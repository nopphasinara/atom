<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use Doctrine\Common\Cache\Cache;
use Doctrine\Common\Cache\ClearableCache;

use PhpIntegrator\Indexing\IndexDatabase;
use PhpIntegrator\Indexing\ProjectIndexer;
use PhpIntegrator\Indexing\BuiltinIndexer;

/**
 * Command that initializes a project.
 */
class InitializeCommand extends AbstractCommand
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @var BuiltinIndexer
     */
    protected $builtinIndexer;

    /**
     * @var ProjectIndexer
     */
    protected $projectIndexer;

    /**
     * @var Cache
     */
    protected $cache;

    /**
     * @param IndexDatabase  $indexDatabase
     * @param BuiltinIndexer $builtinIndexer
     * @param ProjectIndexer $projectIndexer
     * @param Cache          $cache
     */
    public function __construct(
        IndexDatabase $indexDatabase,
        BuiltinIndexer $builtinIndexer,
        ProjectIndexer $projectIndexer,
        Cache $cache
    ) {
        $this->indexDatabase = $indexDatabase;
        $this->builtinIndexer = $builtinIndexer;
        $this->projectIndexer = $projectIndexer;
        $this->cache = $cache;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        $success = $this->initialize();

        return $success;
    }

    /**
     * @param bool $includeBuiltinItems
     *
     * @return bool
     */
    public function initialize($includeBuiltinItems = true)
    {
        $this->ensureIndexDatabaseDoesNotExist();

        $this->indexDatabase->initialize();

        if ($includeBuiltinItems) {
            $this->builtinIndexer->index();
        }

        $this->clearCache();

        return true;
    }

    /**
     * @return void
     */
    protected function ensureIndexDatabaseDoesNotExist()
    {
        if (file_exists($this->indexDatabase->getDatabasePath())) {
            $this->indexDatabase->ensureConnectionClosed();

            unlink($this->indexDatabase->getDatabasePath());
        }
    }

    /**
     * @return void
     */
    protected function clearCache()
    {
        if ($this->cache instanceof ClearableCache) {
            $this->cache->deleteAll();
        }
    }
}
