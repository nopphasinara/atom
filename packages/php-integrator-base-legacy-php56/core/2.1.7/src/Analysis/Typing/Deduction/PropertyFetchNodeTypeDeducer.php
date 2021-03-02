<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\ClasslikeInfoBuilder;

use PhpParser\Node;
use PhpParser\PrettyPrinterAbstract;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\PropertyFetch} node.
 */
class PropertyFetchNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var LocalTypeScanner
     */
    protected $localTypeScanner;

    /**
     * @var NodeTypeDeducerInterface
     */
    protected $nodeTypeDeducer;

    /**
     * @var PrettyPrinterAbstract
     */
    protected $prettyPrinter;

    /**
     * @var ClasslikeInfoBuilder
     */
    protected $classlikeInfoBuilder;

    /**
     * @param LocalTypeScanner         $localTypeScanner
     * @param NodeTypeDeducerInterface $nodeTypeDeducer
     * @param PrettyPrinterAbstract    $prettyPrinter
     * @param ClasslikeInfoBuilder     $classlikeInfoBuilder
     */
    public function __construct(
        LocalTypeScanner $localTypeScanner,
        NodeTypeDeducerInterface $nodeTypeDeducer,
        PrettyPrinterAbstract $prettyPrinter,
        ClasslikeInfoBuilder $classlikeInfoBuilder
    ) {
        $this->localTypeScanner = $localTypeScanner;
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->prettyPrinter = $prettyPrinter;
        $this->classlikeInfoBuilder = $classlikeInfoBuilder;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\PropertyFetch && !$node instanceof Node\Expr\StaticPropertyFetch) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromPropertyFetchNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Expr\PropertyFetch|Node\Expr\StaticPropertyFetch $node
     * @param string|null                                           $file
     * @param string                                                $code
     * @param int                                                   $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromPropertyFetchNode(Node\Expr $node, $file, $code, $offset)
    {
        if ($node->name instanceof Node\Expr) {
            return []; // Can't currently deduce type of an expression such as "$this->{$foo}";
        }

        $objectNode = ($node instanceof Node\Expr\PropertyFetch) ? $node->var : $node->class;

        if ($node instanceof Node\Expr\PropertyFetch) {
            $objectNode = $node->var;
        } else {
            $objectNode = $node->class;
        }

        $typesOfVar = $this->nodeTypeDeducer->deduce($objectNode, $file, $code, $offset);

        $typeMap = [];

        foreach ($typesOfVar as $type) {
            $info = null;

            try {
                $info = $this->classlikeInfoBuilder->getClasslikeInfo($type);
            } catch (UnexpectedValueException $e) {
                continue;
            }

            if (isset($info['properties'][$node->name])) {
                $fetchedTypes = $this->fetchResolvedTypesFromTypeArrays($info['properties'][$node->name]['types']);

                if (!empty($fetchedTypes)) {
                    $typeMap += array_combine($fetchedTypes, array_fill(0, count($fetchedTypes), true));
                }
            }
        }

        // We use an associative array so we automatically avoid duplicate types.
        $types = array_keys($typeMap);

        $expressionString = $this->prettyPrinter->prettyPrintExpr($node);

        $localTypes = $this->localTypeScanner->getLocalExpressionTypes($file, $code, $expressionString, $offset, $types);

        if (!empty($localTypes)) {
            return $localTypes;
        }

        return $types;
    }
}
