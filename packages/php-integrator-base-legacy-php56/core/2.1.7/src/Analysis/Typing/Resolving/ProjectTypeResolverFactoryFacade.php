<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use UnexpectedValueException;

/**
 * Facade that provides convenience methods on top of {@see ProjectTYpeResolverFactory}.
 */
class ProjectTypeResolverFactoryFacade
{
    /**
     * @var ProjectTypeResolverFactory
     */
    protected $projectTypeResolverFactory;

    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @param ProjectTypeResolverFactory       $projectTypeResolverFactory
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     */
    public function __construct(
        ProjectTypeResolverFactory $projectTypeResolverFactory,
        FileTypeResolverFactoryInterface $fileTypeResolverFactory
    ) {
        $this->projectTypeResolverFactory = $projectTypeResolverFactory;
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
    }

    /**
     * @param string $filePath
     *
     * @throws UnexpectedValueException if no namespaces exist for a file.
     *
     * @return ProjectTypeResolver
     */
    public function create($filePath)
    {
        $fileTypeResolver = $this->fileTypeResolverFactory->create($filePath);

        return $this->projectTypeResolverFactory->create($fileTypeResolver, $filePath);
    }
}
