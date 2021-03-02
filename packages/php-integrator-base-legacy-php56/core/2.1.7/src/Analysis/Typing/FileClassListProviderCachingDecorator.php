<?php

namespace PhpIntegrator\Analysis\Typing;

use PhpIntegrator\Analysis\ClearableCacheInterface;

 /**
  * Decorator for classes implementing the {@see FileClassListProviderInterface} interface that performs caching.
  */
class FileClassListProviderCachingDecorator implements FileClassListProviderInterface, ClearableCacheInterface
{
    /**
     * @var FileClassListProviderInterface
     */
    protected $fileClassListProviderInterface;

    /**
     * @var array
     */
    protected $cache;

    /**
     * @param FileClassListProviderInterface $fileClassListProviderInterface
     */
    public function __construct(FileClassListProviderInterface $fileClassListProviderInterface)
    {
        $this->fileClassListProviderInterface = $fileClassListProviderInterface;
    }

    /**
     * @inheritDoc
     */
    public function getClassListForFile($filePath)
    {
        if (!isset($this->cache[$filePath])) {
            $this->cache[$filePath] = $this->fileClassListProviderInterface->getClassListForFile($filePath);
        }

        return $this->cache[$filePath];
    }

    /**
     * @inheritDoc
     */
    public function clearCache()
    {
        $this->cache = [];
    }
}
