<?php

namespace PhpIntegrator\Analysis;

use PhpIntegrator\Indexing\IndexDatabase;

/**
 * Checks if a classlike exists.
 */
class ClasslikeExistanceChecker implements ClasslikeExistanceCheckerInterface
{
    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @param IndexDatabase $indexDatabase
     */
    public function __construct(IndexDatabase $indexDatabase)
    {
        $this->indexDatabase = $indexDatabase;
    }

    /**
     * @inheritDoc
     */
    public function doesClassExist($fqcn)
    {
        $classlikeFqcnMap = $this->getClasslikeFqcnMap();

        return isset($classlikeFqcnMap[$fqcn]);
    }

    /**
     * @return array
     */
    protected function getClasslikeFqcnMap()
    {
        $classlikeFqcnMap = [];

        foreach ($this->indexDatabase->getAllStructuresRawInfo(null) as $element) {
            $classlikeFqcnMap[$element['fqcn']] = true;
        }

        return $classlikeFqcnMap;
    }
}
