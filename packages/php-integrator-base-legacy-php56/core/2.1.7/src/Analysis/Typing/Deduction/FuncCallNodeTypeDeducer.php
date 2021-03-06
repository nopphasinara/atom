<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\Conversion\FunctionConverter;

use PhpIntegrator\Indexing\IndexDatabase;

use PhpIntegrator\Utility\NodeHelpers;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\FuncCall} node.
 */
class FuncCallNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @var FunctionConverter
     */
    protected $functionConverter;

    /**
     * @param IndexDatabase     $indexDatabase
     * @param FunctionConverter $functionConverter
     */
    public function __construct(IndexDatabase $indexDatabase, FunctionConverter $functionConverter)
    {
        $this->indexDatabase = $indexDatabase;
        $this->functionConverter = $functionConverter;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\FuncCall) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromFuncCallNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Expr\FuncCall $node
     *
     * @return string[]
     */
    protected function deduceTypesFromFuncCallNode(Node\Expr\FuncCall $node)
    {
        if ($node->name instanceof Node\Expr) {
            return []; // Can't currently deduce type of an expression such as "{$foo}()";
        }

        $name = NodeHelpers::fetchClassName($node->name);

        $globalFunction = $this->indexDatabase->getGlobalFunctionByFqcn($name);

        if (!$globalFunction) {
            return [];
        }

        $convertedGlobalFunction = $this->functionConverter->convert($globalFunction);

        return $this->fetchResolvedTypesFromTypeArrays($convertedGlobalFunction['returnTypes']);
    }
}
