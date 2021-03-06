<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpIntegrator\Parsing\DocblockParser;

use PhpIntegrator\Utility\NodeHelpers;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a parameter of a {@see Node\FunctionLike} node.
 */
class FunctionLikeParameterTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var NodeTypeDeducerInterface
     */
    protected $nodeTypeDeducer;

    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @var DocblockParser
     */
    protected $docblockParser;

    /**
     * @var string|null
     */
    protected $functionDocblock;

    /**
     * @param NodeTypeDeducerInterface $nodeTypeDeducer
     * @param TypeAnalyzer             $typeAnalyzer
     * @param DocblockParser           $docblockParser
     */
    public function __construct(
        NodeTypeDeducerInterface $nodeTypeDeducer,
        TypeAnalyzer $typeAnalyzer,
        DocblockParser $docblockParser
    ) {
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->typeAnalyzer = $typeAnalyzer;
        $this->docblockParser = $docblockParser;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Param) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromFunctionLikeParameterNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Param $node
     * @param string|null       $file
     * @param string            $code
     * @param int               $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromFunctionLikeParameterNode(Node\Param $node, $file, $code, $offset)
    {
        if ($docBlock = $this->getFunctionDocblock()) {
            // Analyze the docblock's @param tags.
            $result = $this->docblockParser->parse((string) $docBlock, [
                DocblockParser::PARAM_TYPE
            ], '', true);

            if (isset($result['params']['$' . $node->name])) {
                return $this->typeAnalyzer->getTypesForTypeSpecification($result['params']['$' . $node->name]['type']);
            }
        }

        // TODO: Support NullableType (PHP 7.1).
        if ($node->type instanceof Node\Name) {
            $typeHintType = NodeHelpers::fetchClassName($node->type);

            if ($node->variadic) {
                $typeHintType .= '[]';
            }

            return [$typeHintType];
        } elseif (is_string($node->type)) {
            return [$node->type];
        }

        return [];
    }

    /**
     * @return string|null
     */
    public function getFunctionDocblock()
    {
        return $this->functionDocblock;
    }

    /**
     * @param string|null $functionDocblock
     *
     * @return static
     */
    public function setFunctionDocblock($functionDocblock)
    {
        $this->functionDocblock = $functionDocblock;
        return $this;
    }
}
