<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Stmt\ClassLike} node.
 */
class ClassLikeNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Stmt\ClassLike) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromClassLikeNode($node);
    }

    /**
     * @param Node\Stmt\ClassLike $node
     */
    protected function deduceTypesFromClassLikeNode(Node\Stmt\ClassLike $node)
    {
        return [(string) $node->name];
    }
}
