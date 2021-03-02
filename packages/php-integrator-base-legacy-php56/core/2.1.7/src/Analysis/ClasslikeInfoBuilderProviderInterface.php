<?php

namespace PhpIntegrator\Analysis;

/**
 * Defines functionality that must be exposed by classes that provide data to an ClasslikeInfoBuilder.
 */
interface ClasslikeInfoBuilderProviderInterface extends ClasslikeRawConstantDataProviderInterface
{
    /**
     * @param string $fqcn
     *
     * @return array
     */
    public function getClasslikeRawInfo($fqcn);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawParents($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawChildren($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawInterfaces($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawImplementors($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawTraits($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawTraitUsers($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawProperties($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeRawMethods($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeTraitAliasesAssoc($id);

    /**
     * @param int $id
     *
     * @return array
     */
    public function getClasslikeTraitPrecedencesAssoc($id);
}
