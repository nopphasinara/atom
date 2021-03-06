<?php

namespace PhpIntegrator\UserInterface;

use PhpIntegrator\Analysis\ClasslikeInfoBuilderProviderInterface;

/**
 * Proxy for a {@see ClasslikeInfoBuilderProviderInterface} that does not return any data (is a "white hole") for several
 * methods that are unnecessary when fetching the structural element list to avoid their cost and to improve performance.
 */
class ClasslikeInfoBuilderWhiteHolingProxyProvider implements ClasslikeInfoBuilderProviderInterface
{
    /**
     * @var ClasslikeInfoBuilderProviderInterface
     */
    protected $proxiedObject;

    /**
    * @var array|null
    */
    protected $structureRawInfo = null;

    /**
     * Constructor.
     *
     * @param ClasslikeInfoBuilderProviderInterface $proxiedObject
     */
    public function __construct(ClasslikeInfoBuilderProviderInterface $proxiedObject)
    {
        $this->proxiedObject = $proxiedObject;
    }

    /**
     * Sets the data to return for the {@see getClasslikeRawInfo} call. If set to null (the default), that call
     * will proxy the method from the proxied object as usual.
     *
     * Can be used to avoid performing an additional proxy call to improve performance or just to override the returned
     * data.
     *
     * @param array|null
     *
     * @return $this
     */
    public function setStructureRawInfo(array $rawInfo = null)
    {
        $this->structureRawInfo = $rawInfo;
        return $this;
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawInfo($id)
    {
        return ($this->structureRawInfo !== null) ?
            $this->structureRawInfo :
            $this->proxiedObject->getClasslikeRawInfo($id);
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawParents($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawChildren($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawInterfaces($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawImplementors($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawTraits($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawTraitUsers($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawConstants($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawProperties($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeRawMethods($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeTraitAliasesAssoc($id)
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getClasslikeTraitPrecedencesAssoc($id)
    {
        return [];
    }
}
