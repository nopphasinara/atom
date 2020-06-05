<?php

namespace PhpIntegrator\Analysis\Visiting;

use PhpIntegrator\Utility\NodeHelpers;

use PhpParser\Node;

/**
 * Node visitor that fetches usages of (global) functions.
 */
class GlobalFunctionUsageFetchingVisitor extends AbstractNameResolvingVisitor
{
    /**
     * @var array
     */
    protected $globalFunctionCallList = [];

    /**
     * @inheritDoc
     */
    public function enterNode(Node $node)
    {
        parent::enterNode($node);

        if (!$node instanceof Node\Expr\FuncCall || !$node->name instanceof Node\Name) {
            return;
        }

        $this->globalFunctionCallList[] = [
            'name'               => NodeHelpers::fetchClassName($node->name->getAttribute('resolvedName')),
            'localName'          => NodeHelpers::fetchClassName($node->name),
            'localNameFirstPart' => $node->name->getFirst(),
            'isFullyQualified'   => $node->name->isFullyQualified(),
            'namespace'          => $this->namespace ? NodeHelpers::fetchClassName($this->namespace) : null,
            'isUnqualified'      => $node->name->isUnqualified(),
            'start'              => $node->getAttribute('startFilePos') ? $node->getAttribute('startFilePos')   : null,
            'end'                => $node->getAttribute('endFilePos')   ? $node->getAttribute('endFilePos') + 1 : null
        ];
    }

    /**
     * @return array
     */
    public function getGlobalFunctionCallList()
    {
        return $this->globalFunctionCallList;
    }
}
