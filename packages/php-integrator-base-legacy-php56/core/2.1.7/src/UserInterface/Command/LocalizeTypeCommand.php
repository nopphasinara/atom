<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Analysis\Typing\Localization\FileTypeLocalizerFactory;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

use PhpIntegrator\Indexing\IndexDatabase;

/**
 * Command that makes a FQCN relative to local use statements in a file.
 */
class LocalizeTypeCommand extends AbstractCommand
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @var FileTypeLocalizerFactory
     */
    protected $fileTypeLocalizerFactory;

    /**
     * @param IndexDatabase            $indexDatabase
     * @param FileTypeLocalizerFactory $fileTypeLocalizerFactory
     */
    public function __construct(IndexDatabase $indexDatabase, FileTypeLocalizerFactory $fileTypeLocalizerFactory)
    {
        $this->indexDatabase = $indexDatabase;
        $this->fileTypeLocalizerFactory = $fileTypeLocalizerFactory;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        if (!isset($arguments['type'])) {
            throw new InvalidArgumentsException('The type is required for this command.');
        } elseif (!isset($arguments['file'])) {
            throw new InvalidArgumentsException('A file name is required for this command.');
        } elseif (!isset($arguments['line'])) {
            throw new InvalidArgumentsException('A line number is required for this command.');
        }

        $type = $this->localizeType(
            $arguments['type'],
            $arguments['file'],
            $arguments['line'],
            isset($arguments['kind']) ? $arguments['kind'] : UseStatementKind::TYPE_CLASSLIKE
        );

        return $type;
    }

    /**
     * Resolves the type.
     *
     * @param string $type
     * @param string $file
     * @param int    $line
     * @param string $kind A constant from {@see UseStatementKind}.
     *
     * @return string|null
     */
    public function localizeType($type, $file, $line, $kind)
    {
        $fileId = $this->indexDatabase->getFileId($file);

        if (!$fileId) {
            throw new InvalidArgumentsException('File "' . $file . '" is not present in the index!');
        }

        return $this->fileTypeLocalizerFactory->create($file)->resolve($type, $line, $kind);
    }
}
