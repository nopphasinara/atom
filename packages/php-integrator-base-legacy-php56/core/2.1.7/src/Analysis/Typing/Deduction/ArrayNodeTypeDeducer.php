<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\Array_} node.
 */
class ArrayNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\Array_) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromArrayNode($node);
    }

    /**
     * @param Node\Expr\Array_ $node
     *
     * @return string[]
     */
    protected function deduceTypesFromArrayNode(Node\Expr\Array_ $node)
    {
        return ['array'];
    }
}
