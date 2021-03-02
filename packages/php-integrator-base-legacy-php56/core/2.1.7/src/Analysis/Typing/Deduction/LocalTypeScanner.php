<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use PhpIntegrator\Parsing;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactoryInterface;

use PhpIntegrator\Analysis\Visiting\ExpressionTypeInfo;
use PhpIntegrator\Analysis\Visiting\ExpressionTypeInfoMap;

use PhpIntegrator\Parsing\DocblockParser;

use PhpIntegrator\Utility\SourceCodeHelpers;

use PhpParser\Node;

/**
 * Scans for types affecting expressions (e.g. variables and properties) in a local scope in a file.
 *
 * This class can be used to scan for types that apply to an expression based on local rules, such as conditionals and
 * type overrides.
 */
class LocalTypeScanner
{
    /**
     * @var DocblockParser
     */
    protected $docblockParser;

    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @var NodeTypeDeducerInterface
     */
    protected $nodeTypeDeducer;

    /**
     * @var ForeachNodeLoopValueTypeDeducer
     */
    protected $foreachNodeLoopValueTypeDeducer;

    /**
     * @var FunctionLikeParameterTypeDeducer
     */
    protected $functionLikeParameterTypeDeducer;

    /**
     * @var ExpressionLocalTypeAnalyzer
     */
    protected $expressionLocalTypeAnalyzer;

    /**
     * @param DocblockParser                   $docblockParser
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     * @param TypeAnalyzer                     $typeAnalyzer
     * @param NodeTypeDeducerInterface         $nodeTypeDeducer
     * @param ForeachNodeLoopValueTypeDeducer  $foreachNodeLoopValueTypeDeducer
     * @param FunctionLikeParameterTypeDeducer $functionLikeParameterTypeDeducer
     * @param ExpressionLocalTypeAnalyzer      $expressionLocalTypeAnalyzer
     */
    public function __construct(
        DocblockParser $docblockParser,
        FileTypeResolverFactoryInterface $fileTypeResolverFactory,
        TypeAnalyzer $typeAnalyzer,
        NodeTypeDeducerInterface $nodeTypeDeducer,
        ForeachNodeLoopValueTypeDeducer $foreachNodeLoopValueTypeDeducer,
        FunctionLikeParameterTypeDeducer $functionLikeParameterTypeDeducer,
        ExpressionLocalTypeAnalyzer $expressionLocalTypeAnalyzer
    ) {
        $this->docblockParser = $docblockParser;
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
        $this->typeAnalyzer = $typeAnalyzer;
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->foreachNodeLoopValueTypeDeducer = $foreachNodeLoopValueTypeDeducer;
        $this->functionLikeParameterTypeDeducer = $functionLikeParameterTypeDeducer;
        $this->expressionLocalTypeAnalyzer = $expressionLocalTypeAnalyzer;
    }

    /**
     * Retrieves the types of a expression based on what's happening to it in a local scope.
     *
     * This can be used to deduce the type of local variables, class properties, ... that are influenced by local
     * assignments, if statements, ...
     *
     * @param string     $file
     * @param string     $code
     * @param string     $expression
     * @param int        $offset
     * @param string[]   $defaultTypes
     *
     * @return string[]
     */
    public function getLocalExpressionTypes($file, $code, $expression, $offset, $defaultTypes = [])
    {
        $expressionTypeInfoMap = $this->expressionLocalTypeAnalyzer->analyze($code, $offset);
        $offsetLine = SourceCodeHelpers::calculateLineByOffset($code, $offset);

        if (!$expressionTypeInfoMap->has($expression)) {
            return [];
        }

        return $this->getResolvedTypes(
            $expressionTypeInfoMap,
            $expression,
            $file,
            $offsetLine,
            $code,
            $offset,
            $defaultTypes
        );
    }

    /**
     * Retrieves a list of fully resolved types for the variable.
     *
     * @param ExpressionTypeInfoMap $expressionTypeInfoMap
     * @param string                $expression
     * @param string                $file
     * @param int                   $line
     * @param string                $code
     * @param int                   $offset
     * @param string[]              $defaultTypes
     *
     * @return string[]
     */
    protected function getResolvedTypes(
        ExpressionTypeInfoMap $expressionTypeInfoMap,
        $expression,
        $file,
        $line,
        $code,
        $offset,
        $defaultTypes = []
    ) {
        $types = $this->getUnreferencedTypes($expressionTypeInfoMap, $expression, $file, $code, $offset, $defaultTypes);

        $expressionTypeInfo = $expressionTypeInfoMap->get($expression);

        $resolvedTypes = [];

        foreach ($types as $type) {
            $typeLine = $expressionTypeInfo->hasBestTypeOverrideMatch() ?
                $expressionTypeInfo->getBestTypeOverrideMatchLine() :
                $line;

            $resolvedTypes[] = $this->fileTypeResolverFactory->create($file)->resolve($type, $typeLine);
        }

        return $resolvedTypes;
    }

    /**
     * Retrieves a list of types for the variable, with any referencing types (self, static, $this, ...)
     * resolved to their actual types.
     *
     * @param ExpressionTypeInfoMap $expressionTypeInfoMap
     * @param string                $expression
     * @param string                $file
     * @param string                $code
     * @param int                   $offset
     * @param string[]              $defaultTypes
     *
     * @return string[]
     */
    protected function getUnreferencedTypes(
        ExpressionTypeInfoMap $expressionTypeInfoMap,
        $expression,
        $file,
        $code,
        $offset,
        $defaultTypes = []
    ) {
        $expressionTypeInfo = $expressionTypeInfoMap->get($expression);

        $types = $this->getTypes($expressionTypeInfo, $expression, $file, $code, $offset, $defaultTypes);

        $unreferencedTypes = [];

        $selfType = $this->deduceTypesFromSelf($file, $code, $offset);
        $selfType = array_shift($selfType);
        $selfType = $selfType ?: '';

        $staticType = $this->deduceTypesFromStatic($file, $code, $offset);
        $staticType = array_shift($staticType);
        $staticType = $staticType ?: '';

        foreach ($types as $type) {
            $type = $this->typeAnalyzer->interchangeSelfWithActualType($type, $selfType);
            $type = $this->typeAnalyzer->interchangeStaticWithActualType($type, $staticType);
            $type = $this->typeAnalyzer->interchangeThisWithActualType($type, $staticType);

            $unreferencedTypes[] = $type;
        }

        return $unreferencedTypes;
    }

    /**
     * @param string $file
     * @param string $code
     * @param int    $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromSelf($file, $code, $offset)
    {
        $dummyNode = new Parsing\Node\Keyword\Self_();

        return $this->nodeTypeDeducer->deduce($dummyNode, $file, $code, $offset);
    }

    /**
     * @param string $file
     * @param string $code
     * @param int    $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromStatic($file, $code, $offset)
    {
        $dummyNode = new Parsing\Node\Keyword\Static_();

        return $this->nodeTypeDeducer->deduce($dummyNode, $file, $code, $offset);
    }

    /**
     * @param ExpressionTypeInfo $expressionTypeInfo
     * @param string             $expression
     * @param string             $file
     * @param string             $code
     * @param int                $offset
     * @param string[]           $defaultTypes
     *
     * @return string[]
     */
    protected function getTypes(
        ExpressionTypeInfo $expressionTypeInfo,
        $expression,
        $file,
        $code,
        $offset,
        $defaultTypes = []
    ) {
        if ($expressionTypeInfo->hasBestTypeOverrideMatch()) {
            return $this->typeAnalyzer->getTypesForTypeSpecification($expressionTypeInfo->getBestTypeOverrideMatch());
        }

        $types = $defaultTypes;

        if ($expressionTypeInfo->hasBestMatch()) {
            $types = $this->getTypesForBestMatchNode($expression, $expressionTypeInfo->getBestMatch(), $file, $code, $offset);
        }

        return $expressionTypeInfo->getTypePossibilityMap()->determineApplicableTypes($types);
    }

    /**
     * @param string $expression
     * @param Node   $node
     * @param string $file
     * @param string $code
     * @param int    $offset
     *
     * @return string[]
     */
    protected function getTypesForBestMatchNode($expression, Node $node, $file, $code, $offset)
    {
        if ($node instanceof Node\Stmt\Foreach_) {
            return $this->foreachNodeLoopValueTypeDeducer->deduce($node, $file, $code, $offset);
        } elseif ($node instanceof Node\FunctionLike) {
            return $this->deduceTypesFromFunctionLikeParameter($node, $expression, $file, $code, $offset);
        }

        return $this->nodeTypeDeducer->deduce($node, $file, $code, $offset);
    }

    /**
     * @param Node\FunctionLike $node
     * @param string            $parameterName
     * @param string            $file
     * @param string            $code
     * @param int               $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromFunctionLikeParameter(
        Node\FunctionLike $node,
        $parameterName,
        $file,
        $code,
        $offset
    ) {
        foreach ($node->getParams() as $param) {
            if ($param->name === mb_substr($parameterName, 1)) {
                $this->functionLikeParameterTypeDeducer->setFunctionDocblock($node->getDocComment());

                return $this->functionLikeParameterTypeDeducer->deduce($param, $file, $code, $offset);
            }
        }

        return [];
    }
}
