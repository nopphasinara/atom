<?php

namespace PhpIntegrator\Indexing;

use LogicException;

use Evenement\EventEmitterTrait;
use Evenement\EventEmitterInterface;

use PhpIntegrator\Utility\SourceCodeStreamReader;

/**
 * Handles indexation of PHP code.
 */
class Indexer implements EventEmitterInterface
{
    use EventEmitterTrait;

    /**
     * @var string
     */
    const INDEXING_FAILED_EVENT = 'indexingFailed';

    /**
     * @var string
     */
    const INDEXING_SUCCEEDED_EVENT = 'indexingSucceeded';

    /**
     * @var ProjectIndexer
     */
    protected $projectIndexer;

    /**
     * @var SourceCodeStreamReader
     */
    protected $sourceCodeStreamReader;

    /**
     * @var callable|null
     */
    protected $progressStreamingCallback;

    /**
     * @param ProjectIndexer         $projectIndexer
     * @param SourceCodeStreamReader $sourceCodeStreamReader
     */
    public function __construct(ProjectIndexer $projectIndexer, SourceCodeStreamReader $sourceCodeStreamReader)
    {
        $this->projectIndexer = $projectIndexer;
        $this->sourceCodeStreamReader = $sourceCodeStreamReader;
    }

    /**
     * @param string[] $paths
     * @param bool     $useStdin
     * @param bool     $showOutput
     * @param bool     $doStreamProgress
     * @param string[] $excludedPaths
     * @param string[] $extensionsToIndex
     *
     * @return bool Whether indexing succeeded or not.
     */
    public function reindex(
        array $paths,
        $useStdin,
        $showOutput,
        $doStreamProgress,
        array $excludedPaths = [],
        array $extensionsToIndex = ['php']
    ) {
        if ($doStreamProgress && !$this->getProgressStreamingCallback()) {
            throw new LogicException('No progress streaming callback configured whilst streaming was requestd!');
        }

        $this->projectIndexer
            ->setLoggingStream($showOutput ? STDOUT : null)
            ->setProgressStreamingCallback($doStreamProgress ? $this->getProgressStreamingCallback() : null);

        $sourceOverrideMap = [];

        if ($useStdin) {
            $sourceOverrideMap[$paths[0]] = $this->sourceCodeStreamReader->getSourceCodeFromStdin();
        }

        try {
            $this->projectIndexer->index($paths, $extensionsToIndex, $excludedPaths, $sourceOverrideMap);
        } catch (IndexingFailedException $e) {
            $this->emit(self::INDEXING_FAILED_EVENT);

            return false;
        }

        $this->emit(self::INDEXING_SUCCEEDED_EVENT);

        return true;
    }

    /**
     * @return callable|null
     */
    public function getProgressStreamingCallback()
    {
        return $this->progressStreamingCallback;
    }

    /**
     * @param callable|null $progressStreamingCallback
     *
     * @return static
     */
    public function setProgressStreamingCallback(callable $progressStreamingCallback = null)
    {
        $this->progressStreamingCallback = $progressStreamingCallback;
        return $this;
    }
}
