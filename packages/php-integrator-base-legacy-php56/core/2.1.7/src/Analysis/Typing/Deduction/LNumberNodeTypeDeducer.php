<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Scalar\LNumber} node.
 */
class LNumberNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Scalar\LNumber) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromLNumberNode($node);
    }

    /**
     * @param Node\Scalar\LNumber $node
     *
     * @return string[]
     */
    protected function deduceTypesFromLNumberNode(Node\Scalar\LNumber $node)
    {
        return ['int'];
    }
}
