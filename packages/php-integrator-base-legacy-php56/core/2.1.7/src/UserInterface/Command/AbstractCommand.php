<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

/**
 * Base class for commands.
 */
abstract class AbstractCommand implements CommandInterface
{
    /**
     * Executes the actual command and processes the specified arguments.
     *
     * Operates as a template method.
     *
     * @param ArrayAccess $arguments
     *
     * @throws InvalidArgumentsException
     *
     * @return string Output to pass back.
     */
    abstract public function execute(ArrayAccess $arguments);
}
