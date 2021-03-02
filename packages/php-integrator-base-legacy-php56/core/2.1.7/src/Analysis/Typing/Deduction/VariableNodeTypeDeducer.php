<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\Variable} node.
 */
class VariableNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var LocalTypeScanner
     */
    protected $localTypeScanner;

    /**
     * @param LocalTypeScanner $localTypeScanner
     */
    public function __construct(LocalTypeScanner $localTypeScanner)
    {
        $this->localTypeScanner = $localTypeScanner;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\Variable) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromVariableNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Expr\Variable $node
     * @param string|null        $file
     * @param string             $code
     * @param int                $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromVariableNode(Node\Expr\Variable $node, $file, $code, $offset)
    {
        if ($node->name instanceof Node\Expr) {
            return []; // Can't currently deduce type of a variable such as "$$this".
        }

        return $this->localTypeScanner->getLocalExpressionTypes($file, $code, '$' . $node->name, $offset);
    }
}
