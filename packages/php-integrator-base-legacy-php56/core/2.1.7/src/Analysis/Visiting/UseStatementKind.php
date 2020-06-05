<?php

namespace PhpIntegrator\Analysis\Visiting;

/**
 * Kinds of use statements.
 */
class UseStatementKind
{
    /**
     * @var string
     */
    const TYPE_CLASSLIKE = 'classlike';

    /**
     * @var string
     */
    const TYPE_FUNCTION = 'function';

    /**
     * @var string
     */
    const TYPE_CONSTANT = 'constant';
}
