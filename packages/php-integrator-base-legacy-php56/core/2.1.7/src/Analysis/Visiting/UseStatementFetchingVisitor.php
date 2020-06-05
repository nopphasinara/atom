<?php

namespace PhpIntegrator\Analysis\Visiting;

use DomainException;

use PhpParser\Node;
use PhpParser\NodeVisitorAbstract;

/**
 * Node visitor that fetches namespaces and their use statements.
 */
class UseStatementFetchingVisitor extends NodeVisitorAbstract
{
    /**
     * @var array
     */
    protected $namespaces = [];

    /**
     * @var string|null
     */
    protected $lastNamespace = null;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->namespaces[null] = [
            'name'          => null,
            'startLine'     => 0,
            'endLine'       => null,
            'useStatements' => []
        ];

        $this->lastNamespace = null;
    }

    /**
     * @inheritDoc
     */
    public function enterNode(Node $node)
    {
        if ($node instanceof Node\Stmt\Namespace_) {
            $namespace = $node->name ? (string) $node->name : '';

            $this->namespaces[$namespace] = [
                'name'          => $namespace,
                'startLine'     => $node->getLine(),
                'endLine'       => null,
                'useStatements' => []
            ];

            // There is no way to fetch the end of a namespace, so determine it manually (a value of null signifies the
            // end of the file).
            $this->namespaces[$this->lastNamespace]['endLine'] = $node->getLine() - 1;
            $this->lastNamespace = $namespace;
        } elseif ($node instanceof Node\Stmt\Use_ || $node instanceof Node\Stmt\GroupUse) {
            $prefix = '';

            if ($node instanceof Node\Stmt\GroupUse) {
                $prefix = ((string) $node->prefix) . '\\';
            };

            foreach ($node->uses as $use) {
                $type = $node->type === Node\Stmt\Use_::TYPE_UNKNOWN ? $use->type : $node->type;

                if ($type === Node\Stmt\Use_::TYPE_UNKNOWN) {
                    throw new DomainException('Unknown use statement type encountered!');
                }

                $kindMap = [
                    Node\Stmt\Use_::TYPE_NORMAL   => UseStatementKind::TYPE_CLASSLIKE,
                    Node\Stmt\Use_::TYPE_FUNCTION => UseStatementKind::TYPE_FUNCTION,
                    Node\Stmt\Use_::TYPE_CONSTANT => UseStatementKind::TYPE_CONSTANT
                ];

                // NOTE: The namespace may be null here (intended behavior).
                $this->namespaces[$this->lastNamespace]['useStatements'][(string) $use->alias] = [
                    'name'  => $prefix . ((string) $use->name),
                    'alias' => $use->alias,
                    'kind'  => $kindMap[$type],
                    'line'  => $node->getLine(),
                    'start' => $use->getAttribute('startFilePos') ? $use->getAttribute('startFilePos')   : null,
                    'end'   => $use->getAttribute('endFilePos')   ? $use->getAttribute('endFilePos') + 1 : null
                ];
            }
        }
    }

    /**
     * Retrieves a list of namespaces.
     *
     * @return array
     */
    public function getNamespaces()
    {
        return $this->namespaces;
    }
}
