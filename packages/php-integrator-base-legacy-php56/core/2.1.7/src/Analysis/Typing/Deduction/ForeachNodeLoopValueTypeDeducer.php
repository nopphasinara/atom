<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of the loop value of a {@see Node\Stmt\Foreach_} node.
 */
class ForeachNodeLoopValueTypeDeducer extends AbstractNodeTypeDeducer
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
     * @param NodeTypeDeducerInterface $nodeTypeDeducer
     * @param TypeAnalyzer             $typeAnalyzer
     */
    public function __construct(NodeTypeDeducerInterface $nodeTypeDeducer, TypeAnalyzer $typeAnalyzer)
    {
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->typeAnalyzer = $typeAnalyzer;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Stmt\Foreach_) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromForeachNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Stmt\Foreach_ $node
     * @param string|null    $file
     * @param string         $code
     * @param int            $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromForeachNode(Node\Stmt\Foreach_ $node, $file, $code, $offset)
    {
        $types = $this->nodeTypeDeducer->deduce($node->expr, $file, $code, $node->getAttribute('startFilePos'));

        foreach ($types as $type) {
            if ($this->typeAnalyzer->isArraySyntaxTypeHint($type)) {
                return [$this->typeAnalyzer->getValueTypeFromArraySyntaxTypeHint($type)];
            }
        }

        return [];
    }
}
