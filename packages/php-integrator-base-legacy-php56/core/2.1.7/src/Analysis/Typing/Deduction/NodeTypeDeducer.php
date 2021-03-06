<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use DomainException;

use PhpIntegrator\Parsing;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node} object.
 *
 * This is a thin type deducer that can deduce the type of any node by delegating the type deduction to a more
 * appropriate deducer returned by the configured factory.
 */
class NodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var VariableNodeTypeDeducer
     */
    protected $variableNodeTypeDeducer;

    /**
     * @var LNumberNodeTypeDeducer
     */
    protected $lNumberNodeTypeDeducer;

    /**
     * @var DNumberNodeTypeDeducer
     */
    protected $dNumberNodeTypeDeducer;

    /**
     * @var StringNodeTypeDeducer
     */
    protected $stringNodeTypeDeducer;

    /**
     * @var ConstFetchNodeTypeDeducer
     */
    protected $constFetchNodeTypeDeducer;

    /**
     * @var ArrayDimFetchNodeTypeDeducer
     */
    protected $arrayDimFetchNodeTypeDeducer;

    /**
     * @var ClosureNodeTypeDeducer
     */
    protected $closureNodeTypeDeducer;

    /**
     * @var NewNodeTypeDeducer
     */
    protected $newNodeTypeDeducer;

    /**
     * @var CloneNodeTypeDeducer
     */
    protected $cloneNodeTypeDeducer;

    /**
     * @var ArrayNodeTypeDeducer
     */
    protected $arrayNodeTypeDeducer;

    /**
     * @var SelfNodeTypeDeducer
     */
    protected $selfNodeTypeDeducer;

    /**
     * @var StaticNodeTypeDeducer
     */
    protected $staticNodeTypeDeducer;

    /**
     * @var ParentNodeTypeDeducer
     */
    protected $parentNodeTypeDeducer;

    /**
     * @var NameNodeTypeDeducer
     */
    protected $nameNodeTypeDeducer;

    /**
     * @var FuncCallNodeTypeDeducer
     */
    protected $funcCallNodeTypeDeducer;

    /**
     * @var MethodCallNodeTypeDeducer
     */
    protected $methodCallNodeTypeDeducer;

    /**
     * @var PropertyFetchNodeTypeDeducer
     */
    protected $propertyFetchNodeTypeDeducer;

    /**
     * @var ClassConstFetchNodeTypeDeducer
     */
    protected $classConstFetchNodeTypeDeducer;

    /**
     * @var AssignNodeTypeDeducer
     */
    protected $assignNodeTypeDeducer;

    /**
     * @var TernaryNodeTypeDeducer
     */
    protected $ternaryNodeTypeDeducer;

    /**
     * @var ClassLikeNodeTypeDeducer
     */
    protected $classLikeNodeTypeDeducer;

    /**
     * @var CatchNodeTypeDeducer
     */
    protected $catchNodeTypeDeducer;

    /**
     * @param VariableNodeTypeDeducer        $variableNodeTypeDeducer
     * @param LNumberNodeTypeDeducer         $lNumberNodeTypeDeducer
     * @param DNumberNodeTypeDeducer         $dNumberNodeTypeDeducer
     * @param StringNodeTypeDeducer          $stringNodeTypeDeducer
     * @param ConstFetchNodeTypeDeducer      $constFetchNodeTypeDeducer
     * @param ArrayDimFetchNodeTypeDeducer   $arrayDimFetchNodeTypeDeducer
     * @param ClosureNodeTypeDeducer         $closureNodeTypeDeducer
     * @param NewNodeTypeDeducer             $newNodeTypeDeducer
     * @param CloneNodeTypeDeducer           $cloneNodeTypeDeducer
     * @param ArrayNodeTypeDeducer           $arrayNodeTypeDeducer
     * @param SelfNodeTypeDeducer            $selfNodeTypeDeducer
     * @param StaticNodeTypeDeducer          $staticNodeTypeDeducer
     * @param ParentNodeTypeDeducer          $parentNodeTypeDeducer
     * @param NameNodeTypeDeducer            $nameNodeTypeDeducer
     * @param FuncCallNodeTypeDeducer        $funcCallNodeTypeDeducer
     * @param MethodCallNodeTypeDeducer      $methodCallNodeTypeDeducer
     * @param PropertyFetchNodeTypeDeducer   $propertyFetchNodeTypeDeducer
     * @param ClassConstFetchNodeTypeDeducer $classConstFetchNodeTypeDeducer
     * @param AssignNodeTypeDeducer          $assignNodeTypeDeducer
     * @param TernaryNodeTypeDeducer         $ternaryNodeTypeDeducer
     * @param ClassLikeNodeTypeDeducer       $classLikeNodeTypeDeducer
     * @param CatchNodeTypeDeducer           $catchNodeTypeDeducer
     */
    public function __construct(
        VariableNodeTypeDeducer $variableNodeTypeDeducer,
        LNumberNodeTypeDeducer $lNumberNodeTypeDeducer,
        DNumberNodeTypeDeducer $dNumberNodeTypeDeducer,
        StringNodeTypeDeducer $stringNodeTypeDeducer,
        ConstFetchNodeTypeDeducer $constFetchNodeTypeDeducer,
        ArrayDimFetchNodeTypeDeducer $arrayDimFetchNodeTypeDeducer,
        ClosureNodeTypeDeducer $closureNodeTypeDeducer,
        NewNodeTypeDeducer $newNodeTypeDeducer,
        CloneNodeTypeDeducer $cloneNodeTypeDeducer,
        ArrayNodeTypeDeducer $arrayNodeTypeDeducer,
        SelfNodeTypeDeducer $selfNodeTypeDeducer,
        StaticNodeTypeDeducer $staticNodeTypeDeducer,
        ParentNodeTypeDeducer $parentNodeTypeDeducer,
        NameNodeTypeDeducer $nameNodeTypeDeducer,
        FuncCallNodeTypeDeducer $funcCallNodeTypeDeducer,
        MethodCallNodeTypeDeducer $methodCallNodeTypeDeducer,
        PropertyFetchNodeTypeDeducer $propertyFetchNodeTypeDeducer,
        ClassConstFetchNodeTypeDeducer $classConstFetchNodeTypeDeducer,
        AssignNodeTypeDeducer $assignNodeTypeDeducer,
        TernaryNodeTypeDeducer $ternaryNodeTypeDeducer,
        ClassLikeNodeTypeDeducer $classLikeNodeTypeDeducer,
        CatchNodeTypeDeducer $catchNodeTypeDeducer
    ) {
        $this->variableNodeTypeDeducer = $variableNodeTypeDeducer;
        $this->lNumberNodeTypeDeducer = $lNumberNodeTypeDeducer;
        $this->dNumberNodeTypeDeducer = $dNumberNodeTypeDeducer;
        $this->stringNodeTypeDeducer = $stringNodeTypeDeducer;
        $this->constFetchNodeTypeDeducer = $constFetchNodeTypeDeducer;
        $this->arrayDimFetchNodeTypeDeducer = $arrayDimFetchNodeTypeDeducer;
        $this->closureNodeTypeDeducer = $closureNodeTypeDeducer;
        $this->newNodeTypeDeducer = $newNodeTypeDeducer;
        $this->cloneNodeTypeDeducer = $cloneNodeTypeDeducer;
        $this->arrayNodeTypeDeducer = $arrayNodeTypeDeducer;
        $this->selfNodeTypeDeducer = $selfNodeTypeDeducer;
        $this->staticNodeTypeDeducer = $staticNodeTypeDeducer;
        $this->parentNodeTypeDeducer = $parentNodeTypeDeducer;
        $this->nameNodeTypeDeducer = $nameNodeTypeDeducer;
        $this->funcCallNodeTypeDeducer = $funcCallNodeTypeDeducer;
        $this->methodCallNodeTypeDeducer = $methodCallNodeTypeDeducer;
        $this->propertyFetchNodeTypeDeducer = $propertyFetchNodeTypeDeducer;
        $this->classConstFetchNodeTypeDeducer = $classConstFetchNodeTypeDeducer;
        $this->assignNodeTypeDeducer = $assignNodeTypeDeducer;
        $this->ternaryNodeTypeDeducer = $ternaryNodeTypeDeducer;
        $this->classLikeNodeTypeDeducer = $classLikeNodeTypeDeducer;
        $this->catchNodeTypeDeducer = $catchNodeTypeDeducer;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        $typeDeducer = null;

        try {
            $typeDeducer = $this->getTypeDeducerForNode($node);
        } catch (DomainException $e) {
            return [];
        }

        return $typeDeducer->deduce($node, $file, $code, $offset);
    }

    /**
     * @param Node $node
     *
     * @throws DomainException
     *
     * @return NodeTypeDeducerInterface
     */
    protected function getTypeDeducerForNode(Node $node)
    {
        return $this->getTypeDeducerForNodeClass(get_class($node));
    }

    /**
     * @param string $class
     *
     * @throws DomainException
     *
     * @return NodeTypeDeducerInterface
     */
    protected function getTypeDeducerForNodeClass($class)
    {
        $map = [
            Node\Expr\Variable::class            => $this->variableNodeTypeDeducer,
            Node\Scalar\LNumber::class           => $this->lNumberNodeTypeDeducer,
            Node\Scalar\DNumber::class           => $this->dNumberNodeTypeDeducer,
            Node\Scalar\String_::class           => $this->stringNodeTypeDeducer,
            Node\Expr\ConstFetch::class          => $this->constFetchNodeTypeDeducer,
            Node\Expr\ArrayDimFetch::class       => $this->arrayDimFetchNodeTypeDeducer,
            Node\Expr\Closure::class             => $this->closureNodeTypeDeducer,
            Node\Expr\New_::class                => $this->newNodeTypeDeducer,
            Node\Expr\Clone_::class              => $this->cloneNodeTypeDeducer,
            Node\Expr\Array_::class              => $this->arrayNodeTypeDeducer,
            Parsing\Node\Keyword\Self_::class    => $this->selfNodeTypeDeducer,
            Parsing\Node\Keyword\Static_::class  => $this->staticNodeTypeDeducer,
            Parsing\Node\Keyword\Parent_::class  => $this->parentNodeTypeDeducer,
            Node\Name::class                     => $this->nameNodeTypeDeducer,
            Node\Name\FullyQualified::class      => $this->nameNodeTypeDeducer,
            Node\Name\Relative::class            => $this->nameNodeTypeDeducer,
            Node\Expr\FuncCall::class            => $this->funcCallNodeTypeDeducer,
            Node\Expr\MethodCall::class          => $this->methodCallNodeTypeDeducer,
            Node\Expr\StaticCall::class          => $this->methodCallNodeTypeDeducer,
            Node\Expr\PropertyFetch::class       => $this->propertyFetchNodeTypeDeducer,
            Node\Expr\StaticPropertyFetch::class => $this->propertyFetchNodeTypeDeducer,
            Node\Expr\ClassConstFetch::class     => $this->classConstFetchNodeTypeDeducer,
            Node\Expr\Assign::class              => $this->assignNodeTypeDeducer,
            Node\Expr\Ternary::class             => $this->ternaryNodeTypeDeducer,
            Node\Stmt\Class_::class              => $this->classLikeNodeTypeDeducer,
            Node\Stmt\Interface_::class          => $this->classLikeNodeTypeDeducer,
            Node\Stmt\Trait_::class              => $this->classLikeNodeTypeDeducer,
            Node\Stmt\Catch_::class              => $this->catchNodeTypeDeducer
        ];

        if (!isset($map[$class])) {
            throw new DomainException("No deducer known for class {$class}");
        }

        return $map[$class];
    }
}
