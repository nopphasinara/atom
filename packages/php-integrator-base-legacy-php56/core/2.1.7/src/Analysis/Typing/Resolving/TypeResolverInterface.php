<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

/**
 * Interface for classes that can resolve local types to their FQCN.
 */
interface TypeResolverInterface
{
    /**
     * Resolves and determines the FQCN of the specified type.
     *
     * @param string      $type
     * @param string|null $namespaceName
     * @param array {
     *     @var string|null $name
     *     @var string      $alias
     *     @var string      $kind
     * } $imports
     * @param string      $kind
     *
     * @throws TypeResolutionImpossibleException when unqualified constants or functions are encountered.
     *
     * @return string|null
     */
    public function resolve($name, $namespaceName, array $imports, $kind = UseStatementKind::TYPE_CLASSLIKE);
}
