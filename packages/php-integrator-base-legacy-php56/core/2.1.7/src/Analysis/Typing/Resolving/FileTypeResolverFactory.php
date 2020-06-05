<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use UnexpectedValueException;

use PhpIntegrator\Analysis\Typing\NamespaceImportProviderInterface;

/**
 * Factory that creates instances of {@see FileTypeResolver}.
 */
class FileTypeResolverFactory implements FileTypeResolverFactoryInterface
{
    /**
     * @var TypeResolverInterface
     */
    protected $typeResolver;

    /**
     * @var NamespaceImportProviderInterface
     */
    protected $namespaceImportProviderInterface;

    /**
     * @param TypeResolverInterface            $typeResolver
     * @param NamespaceImportProviderInterface $namespaceImportProviderInterface
     */
    public function __construct(
        TypeResolverInterface $typeResolver,
        NamespaceImportProviderInterface $namespaceImportProviderInterface
    ) {
        $this->typeResolver = $typeResolver;
        $this->namespaceImportProviderInterface = $namespaceImportProviderInterface;
    }

    /**
     * @inheritDoc
     */
    public function create($filePath)
    {
        $namespaces = $this->namespaceImportProviderInterface->getNamespacesForFile($filePath);

        if (empty($namespaces)) {
            throw new UnexpectedValueException(
                'No namespace found, but there should always exist at least one namespace row in the database!'
            );
        }

        $useStatements = $this->namespaceImportProviderInterface->getUseStatementsForFile($filePath);

        return new FileTypeResolver($this->typeResolver, $namespaces, $useStatements);
    }
}
