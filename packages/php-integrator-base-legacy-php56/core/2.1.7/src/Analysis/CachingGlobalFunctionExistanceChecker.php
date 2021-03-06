<?php

namespace PhpIntegrator\Analysis;

/**
 * @inheritDoc
 */
class CachingGlobalFunctionExistanceChecker extends GlobalFunctionExistanceChecker implements ClearableCacheInterface
{
    /**
     * @var array
     */
    protected $globalFunctionsFqcnMap;

    /**
     * @inheritDoc
     */
    protected function getGlobalFunctionsFqcnMap()
    {
        if ($this->globalFunctionsFqcnMap === null) {
            $this->globalFunctionsFqcnMap = parent::getGlobalFunctionsFqcnMap();
        }

        return $this->globalFunctionsFqcnMap;
    }

    /**
     * @inheritDoc
     */
    public function clearCache()
    {
        $this->globalFunctionsFqcnMap = null;
    }
}
