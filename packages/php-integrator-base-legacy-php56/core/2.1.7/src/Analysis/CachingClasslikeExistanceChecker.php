<?php

namespace PhpIntegrator\Analysis;

/**
 * @inheritDoc
 */
class CachingClasslikeExistanceChecker extends ClasslikeExistanceChecker implements ClearableCacheInterface
{
    /**
     * @var array
     */
    protected $classlikeFqcnMap;

    /**
     * @inheritDoc
     */
    protected function getClasslikeFqcnMap()
    {
        if ($this->classlikeFqcnMap === null) {
            $this->classlikeFqcnMap = parent::getClasslikeFqcnMap();
        }

        return $this->classlikeFqcnMap;
    }

    /**
     * @inheritDoc
     */
    public function clearCache()
    {
        $this->classlikeFqcnMap = null;
    }
}
