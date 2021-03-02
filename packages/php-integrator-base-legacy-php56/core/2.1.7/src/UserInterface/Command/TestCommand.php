<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Indexing\IndexDatabase;
use PhpIntegrator\Indexing\IncorrectDatabaseVersionException;

/**
 * Command that tests a project to see if it is in a properly usable state.
 */
class TestCommand extends AbstractCommand
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @param IndexDatabase  $indexDatabase
     */
    public function __construct(IndexDatabase $indexDatabase)
    {
        $this->indexDatabase = $indexDatabase;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        $success = $this->test();

        return $success;
    }

    /**
     * @return bool
     */
    public function test()
    {
        try {
            $this->indexDatabase->checkDatabaseVersion();
        } catch (IncorrectDatabaseVersionException $e) {
            return false;
        }

        return true;
    }
}
