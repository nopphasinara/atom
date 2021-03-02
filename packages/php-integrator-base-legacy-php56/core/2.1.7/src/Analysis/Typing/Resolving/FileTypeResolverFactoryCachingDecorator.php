<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use PhpIntegrator\Analysis\ClearableCacheInterface;

/**
 * Decorator for factories implementing the {@see FileTypeResolverFactoryInterface} interface that caches created
 * instances (or provides "flyweights").
 */
class FileTypeResolverFactoryCachingDecorator implements FileTypeResolverFactoryInterface, ClearableCacheInterface
{
    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @var array
     */
    protected $cache;

    /**
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     */
    public function __construct(FileTypeResolverFactoryInterface $fileTypeResolverFactory)
    {
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
    }

    /**
     * @inheritDoc
     */
    public function create($filePath)
    {
        if (!isset($this->cache[$filePath])) {
            $this->cache[$filePath] = $this->fileTypeResolverFactory->create($filePath);
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
