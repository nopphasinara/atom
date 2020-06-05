<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\ClasslikeInfoBuilder;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\MethodCall} node.
 */
class MethodCallNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var NodeTypeDeducerInterface
     */
    protected $nodeTypeDeducer;

    /**
     * @var ClasslikeInfoBuilder
     */
    protected $classlikeInfoBuilder;

    /**
     * @param NodeTypeDeducerInterface $nodeTypeDeducer
     * @param ClasslikeInfoBuilder     $classlikeInfoBuilder
     */
    public function __construct(
        NodeTypeDeducerInterface $nodeTypeDeducer,
        ClasslikeInfoBuilder $classlikeInfoBuilder
    ) {
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->classlikeInfoBuilder = $classlikeInfoBuilder;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\MethodCall && !$node instanceof Node\Expr\StaticCall) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromMethodCallNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Expr\MethodCall|Node\Expr\StaticCall $node
     * @param string|null                               $file
     * @param string                                    $code
     * @param int                                       $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromMethodCallNode(Node\Expr $node, $file, $code, $offset)
    {
        if ($node->name instanceof Node\Expr) {
            return []; // Can't currently deduce type of an expression such as "$this->{$foo}()";
        }

        $objectNode = ($node instanceof Node\Expr\MethodCall) ? $node->var : $node->class;

        $typesOfVar = $this->nodeTypeDeducer->deduce($objectNode, $file, $code, $offset);

        $types = [];

        foreach ($typesOfVar as $type) {
            $info = null;

            try {
                $info = $this->classlikeInfoBuilder->getClasslikeInfo($type);
            } catch (UnexpectedValueException $e) {
                continue;
            }

            if (isset($info['methods'][$node->name])) {
                $fetchedTypes = $this->fetchResolvedTypesFromTypeArrays($info['methods'][$node->name]['returnTypes']);

                if (!empty($fetchedTypes)) {
                    $types += array_combine($fetchedTypes, array_fill(0, count($fetchedTypes), true));
                }
            }
        }

        // We use an associative array so we automatically avoid duplicate types.
        return array_keys($types);
    }
}
