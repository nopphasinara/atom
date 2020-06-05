<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

/**
 * Resolves local types to their FQCN for a file.
 */
interface FileTypeResolverInterface
{
    /**
     * Resolves and determines the FQCN of the specified type.
     *
     * @param string $name
     * @param int    $line
     * @param string $kind
     *
     * @throws TypeResolutionImpossibleException when unqualified constants or functions are encountered.
     *
     * @return string|null
     */
    public function resolve($name, $line, $kind = UseStatementKind::TYPE_CLASSLIKE);
}
