<?php

namespace PhpIntegrator\Analysis\Visiting;

use PhpParser\Node\Name;

use PhpParser\NodeVisitor\NameResolver;

/**
 * Non-destructive extension of php-parser's {@see NameResolver}.
 *
 * This variant will not actually replace any of the existing data in the nodes, but will only attach new data to them.
 * This way, combining this visitor with other visitors will not break them if they depend on the original, unaltered
 * data.
 *
 * The resolved name is available as a 'resolvedName' attribute of the name subnode.
 */
abstract class AbstractNameResolvingVisitor extends NameResolver
{
    /**
     * @inheritDoc
     */
    protected function resolveClassName(Name $name)
    {
        $resolvedName = parent::resolveClassName($name);

        $name->setAttribute('resolvedName', $resolvedName);

        return $name;
    }

    /**
     * @inheritDoc
     */
    protected function resolveOtherName(Name $name, $type)
    {
        $resolvedName = parent::resolveOtherName($name, $type);

        $name->setAttribute('resolvedName', $resolvedName);

        return $name;
    }
}
