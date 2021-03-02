<?php

namespace PhpIntegrator\Analysis\Typing;

/**
 * Interface for classes that can retrieve a class list for a specific file.
 */
interface FileClassListProviderInterface
{
    /**
     * @param string $filePath
     *
     * @return array
     */
    public function getClassListForFile($filePath);
}
