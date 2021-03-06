<?php

namespace PhpIntegrator\Analysis;

/**
 * @inheritDoc
 */
class CachingGlobalConstantExistanceChecker extends GlobalConstantExistanceChecker implements ClearableCacheInterface
{
    /**
     * @var array
     */
    protected $globalConstantFqcnMap;

    /**
     * @inheritDoc
     */
    protected function getGlobalConstantFqcnMap()
    {
        if ($this->globalConstantFqcnMap === null) {
            $this->globalConstantFqcnMap = parent::getGlobalConstantFqcnMap();
        }

        return $this->globalConstantFqcnMap;
    }

    /**
     * @inheritDoc
     */
    public function clearCache()
    {
        $this->globalConstantFqcnMap = null;
    }
}
