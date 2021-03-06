<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Indexing\IndexDatabase;

/**
 * Command that shows a list of available namespace.
 */
class NamespaceListCommand extends AbstractCommand
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @param IndexDatabase $indexDatabase
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
        $file = isset($arguments['file']) ? $arguments['file'] : null;

        $list = $this->getNamespaceList($file);

        return $list;
    }

    /**
     * @param string|null $file
     *
     * @return array
     */
    public function getNamespaceList($file = null)
    {
        if ($file !== null) {
            return $this->indexDatabase->getNamespacesForFile($file);
        }

        return $this->indexDatabase->getNamespaces($file);
    }
}
