<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Indexing\Indexer;

/**
 * Command that reindexes a file or folder.
 */
class ReindexCommand extends AbstractCommand
{
    /**
     * @var Indexer
     */
    protected $indexer;

    /**
     * @param Indexer $indexer
     */
    public function __construct(Indexer $indexer)
    {
        $this->indexer = $indexer;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        if (!isset($arguments['source']) || empty($arguments['source'])) {
            throw new InvalidArgumentsException('At least one file or directory to index is required for this command.');
        }

        $paths = $arguments['source'];
        $useStdin = isset($arguments['stdin']);

        if ($useStdin) {
            if (count($paths) > 1) {
                throw new InvalidArgumentsException('Reading from STDIN is only possible when a single path is specified!');
            } elseif (!is_file($paths[0])) {
                throw new InvalidArgumentsException('Reading from STDIN is only possible for a single file!');
            }
        }

        $success = $this->indexer->reindex(
            $paths,
            $useStdin,
            isset($arguments['verbose']),
            isset($arguments['stream-progress']),
            isset($arguments['exclude']) ? $arguments['exclude'] : [],
            isset($arguments['extension']) ? $arguments['extension'] : []
        );

        return $success;
    }
}
