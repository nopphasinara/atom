<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

/**
 * Type resolver that can resolve docblock types to their FQCN.
 *
 * This class is also usable as a regular (non-docblock) type resolver as docblock types are a superset of standard
 * types. The additional functionality is decorated on top of the standard resolution process.
 */
class DocblockTypeResolver implements TypeResolverInterface
{
    /**
     * @var TypeResolverInterface
     */
    protected $delegate;

    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @param TypeResolverInterface $delegate
     * @param TypeAnalyzer          $typeAnalyzer
     */
    public function __construct(TypeResolverInterface $delegate, TypeAnalyzer $typeAnalyzer)
    {
        $this->delegate = $delegate;
        $this->typeAnalyzer = $typeAnalyzer;
    }

    /**
     * @inheritDoc
     */
    public function resolve($name, $namespaceName, array $imports, $kind = UseStatementKind::TYPE_CLASSLIKE)
    {
        if ($this->typeAnalyzer->isArraySyntaxTypeHint($name)) {
            $valueType = $this->typeAnalyzer->getValueTypeFromArraySyntaxTypeHint($name);

            $resolvedValueType = $this->delegate->resolve($valueType, $namespaceName, $imports, $kind);

            return $resolvedValueType . '[]';
        }

        return $this->delegate->resolve($name, $namespaceName, $imports, $kind);
    }
}
