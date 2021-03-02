<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use UnexpectedValueException;

use PhpIntegrator\Analysis\GlobalConstantExistanceCheckerInterface;
use PhpIntegrator\Analysis\GlobalFunctionExistanceCheckerInterface;

use PhpIntegrator\Analysis\Typing\NamespaceImportProviderInterface;

/**
 * Factory that creates instances of {@see ProjectTypeResolver}.
 */
class ProjectTypeResolverFactory
{
    /**
     * @var GlobalConstantExistanceCheckerInterface
     */
    protected $globalConstantExistanceChecker;

    /**
     * @var GlobalFunctionExistanceCheckerInterface
     */
    protected $globalFunctionExistanceChecker;

    /**
     * @var NamespaceImportProviderInterface
     */
    protected $namespaceImportProviderInterface;

    /**
     * @param GlobalConstantExistanceCheckerInterface $globalConstantExistanceChecker
     * @param GlobalFunctionExistanceCheckerInterface $globalFunctionExistanceChecker
     * @param NamespaceImportProviderInterface $namespaceImportProviderInterface
     */
    public function __construct(
        GlobalConstantExistanceCheckerInterface $globalConstantExistanceChecker,
        GlobalFunctionExistanceCheckerInterface $globalFunctionExistanceChecker,
        NamespaceImportProviderInterface $namespaceImportProviderInterface
    ) {
        $this->globalConstantExistanceChecker = $globalConstantExistanceChecker;
        $this->globalFunctionExistanceChecker = $globalFunctionExistanceChecker;
        $this->namespaceImportProviderInterface = $namespaceImportProviderInterface;
    }

    /**
     * @param FileTypeResolverInterface $typeResolver
     * @param string                    $filePath
     *
     * @throws UnexpectedValueException if no namespaces exist for a file.
     *
     * @return ProjectTypeResolver
     */
    public function create(FileTypeResolverInterface $typeResolver, $filePath)
    {
        $namespaces = $this->namespaceImportProviderInterface->getNamespacesForFile($filePath);

        if (empty($namespaces)) {
            throw new UnexpectedValueException(
                'No namespace found, but there should always exist at least one namespace row in the database!'
            );
        }

        return new ProjectTypeResolver(
            $typeResolver,
            $this->globalConstantExistanceChecker,
            $this->globalFunctionExistanceChecker,
            $namespaces
        );
    }
}
