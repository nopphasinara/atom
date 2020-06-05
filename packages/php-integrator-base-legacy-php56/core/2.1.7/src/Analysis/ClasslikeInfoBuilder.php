<?php

namespace PhpIntegrator\Analysis;

use ArrayObject;
use UnexpectedValueException;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

/**
 * Adapts and resolves data from the index as needed to receive an appropriate output data format.
 */
class ClasslikeInfoBuilder
{
    /**
     * @var Conversion\ConstantConverter
     */
    protected $constantConverter;

    /**
     * @var Conversion\ClasslikeConstantConverter
     */
    protected $classlikeConstantConverter;

    /**
     * @var Conversion\PropertyConverter
     */
    protected $propertyConverter;

    /**
     * @var Conversion\FunctionConverter
     */
    protected $functionConverter;

    /**
     * @var Conversion\MethodConverter
     */
    protected $methodConverter;

    /**
     * @var Conversion\ClasslikeConverter
     */
    protected $classlikeConverter;

    /**
     * @var Relations\InheritanceResolver
     */
    protected $inheritanceResolver;

    /**
     * @var Relations\InterfaceImplementationResolver
     */
    protected $interfaceImplementationResolver;

    /**
     * @var Relations\TraitUsageResolver
     */
    protected $traitUsageResolver;

    /**
     * The storage to use for accessing index data.
     *
     * @var ClasslikeInfoBuilderProviderInterface
     */
    protected $storage;

    /**
     * @var Typing\TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @var string[]
     */
    protected $resolutionStack = [];

    /**
     * @param Conversion\ConstantConverter              $constantConverter
     * @param Conversion\ClasslikeConstantConverter     $classlikeConstantConverter
     * @param Conversion\PropertyConverter              $propertyConverter
     * @param Conversion\FunctionConverter              $functionConverter
     * @param Conversion\MethodConverter                $methodConverter
     * @param Conversion\ClasslikeConverter             $classlikeConverter
     * @param Relations\InheritanceResolver             $inheritanceResolver
     * @param Relations\InterfaceImplementationResolver $interfaceImplementationResolver
     * @param Relations\TraitUsageResolver              $traitUsageResolver
     * @param ClasslikeInfoBuilderProviderInterface     $storage
     * @param Typing\TypeAnalyzer                       $typeAnalyzer
     */
    public function __construct(
        Conversion\ConstantConverter $constantConverter,
        Conversion\ClasslikeConstantConverter $classlikeConstantConverter,
        Conversion\PropertyConverter $propertyConverter,
        Conversion\FunctionConverter $functionConverter,
        Conversion\MethodConverter $methodConverter,
        Conversion\ClasslikeConverter $classlikeConverter,
        Relations\InheritanceResolver $inheritanceResolver,
        Relations\InterfaceImplementationResolver $interfaceImplementationResolver,
        Relations\TraitUsageResolver $traitUsageResolver,
        ClasslikeInfoBuilderProviderInterface $storage,
        Typing\TypeAnalyzer $typeAnalyzer
    ) {
        $this->constantConverter = $constantConverter;
        $this->classlikeConstantConverter = $classlikeConstantConverter;
        $this->propertyConverter = $propertyConverter;
        $this->functionConverter = $functionConverter;
        $this->methodConverter = $methodConverter;
        $this->classlikeConverter = $classlikeConverter;

        $this->inheritanceResolver = $inheritanceResolver;
        $this->interfaceImplementationResolver = $interfaceImplementationResolver;
        $this->traitUsageResolver = $traitUsageResolver;

        $this->storage = $storage;
        $this->typeAnalyzer = $typeAnalyzer;
    }

    /**
     * Retrieves information about the specified structural element.
     *
     * @param string $fqcn
     *
     * @throws UnexpectedValueException
     *
     * @return array
     */
    public function getClasslikeInfo($fqcn)
    {
        $this->resolutionStack = [];

        return $this->getCheckedClasslikeInfo($fqcn, '')->getArrayCopy();
    }

    /**
     * @param string $fqcn
     * @param string $originFqcn
     *
     * @return ArrayObject
     */
    protected function getCheckedClasslikeInfo($fqcn, $originFqcn)
    {
        if (in_array($fqcn, $this->resolutionStack)) {
            throw new CircularDependencyException(
                "Circular dependency detected from {$originFqcn} to {$fqcn}!"
            );
        }

        $this->resolutionStack[] = $fqcn;

        $data = $this->getUncheckedClasslikeInfo($fqcn);

        array_pop($this->resolutionStack);

        return $data;
    }

    /**
     * @param string $fqcn
     *
     * @throws UnexpectedValueException
     *
     * @return ArrayObject
     */
    protected function getUncheckedClasslikeInfo($fqcn)
    {
        $rawInfo = $this->storage->getClasslikeRawInfo($fqcn);

        if (!$rawInfo) {
            throw new UnexpectedValueException('The structural element "' . $fqcn . '" was not found!');
        }

        $id = $rawInfo['id'];

        $classlike = $this->fetchFlatClasslikeInfo(
            $rawInfo,
            $this->storage->getClasslikeRawParents($id),
            $this->storage->getClasslikeRawChildren($id),
            $this->storage->getClasslikeRawInterfaces($id),
            $this->storage->getClasslikeRawImplementors($id),
            $this->storage->getClasslikeRawTraits($id),
            $this->storage->getClasslikeRawTraitUsers($id),
            $this->storage->getClasslikeRawConstants($id),
            $this->storage->getClasslikeRawProperties($id),
            $this->storage->getClasslikeRawMethods($id),
            $this->storage->getClasslikeTraitAliasesAssoc($id),
            $this->storage->getClasslikeTraitPrecedencesAssoc($id)
        );

        return $classlike;
    }

    /**
     * Builds information about a classlike in a flat structure, meaning it doesn't resolve any inheritance or interface
     * implementations. Instead, it will only list members and data directly relevant to the classlike.
     *
     * @param array $element
     * @param array $parents
     * @param array $children
     * @param array $interfaces
     * @param array $implementors
     * @param array $traits
     * @param array $traitUsers
     * @param array $constants
     * @param array $properties
     * @param array $methods
     * @param array $traitAliases
     * @param array $traitPrecedences
     *
     * @return ArrayObject
     */
    protected function fetchFlatClasslikeInfo(
        array $element,
        array $parents,
        array $children,
        array $interfaces,
        array $implementors,
        array $traits,
        array $traitUsers,
        array $constants,
        array $properties,
        array $methods,
        array $traitAliases,
        array $traitPrecedences
    ) {
        $classlike = new ArrayObject($this->classlikeConverter->convert($element) + [
            'parents'            => [],
            'interfaces'         => [],
            'traits'             => [],

            'directParents'      => [],
            'directInterfaces'   => [],
            'directTraits'       => [],
            'directChildren'     => [],
            'directImplementors' => [],
            'directTraitUsers'   => [],

            'constants'          => [],
            'properties'         => [],
            'methods'            => []
        ]);

        $this->buildDirectChildrenInfo($classlike, $children);
        $this->buildDirectImplementorsInfo($classlike, $implementors);
        $this->buildTraitUsersInfo($classlike, $traitUsers);
        $this->buildConstantsInfo($classlike, $constants);
        $this->buildPropertiesInfo($classlike, $properties);
        $this->buildMethodsInfo($classlike, $methods);
        $this->buildTraitsInfo($classlike, $traits, $traitAliases, $traitPrecedences);

        $this->resolveNormalTypes($classlike);
        $this->resolveSelfTypesTo($classlike, $classlike['name']);

        $this->buildParentsInfo($classlike, $parents);
        $this->buildInterfacesInfo($classlike, $interfaces);

        $this->resolveStaticTypesTo($classlike, $classlike['name']);

        return $classlike;
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $children
     */
    protected function buildDirectChildrenInfo(ArrayObject $classlike, array $children)
    {
        foreach ($children as $child) {
            $classlike['directChildren'][] = $child['fqcn'];
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $implementors
     */
    protected function buildDirectImplementorsInfo(ArrayObject $classlike, array $implementors)
    {
        foreach ($implementors as $implementor) {
            $classlike['directImplementors'][] = $implementor['fqcn'];
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $traitUsers
     */
    protected function buildTraitUsersInfo(ArrayObject $classlike, array $traitUsers)
    {
        foreach ($traitUsers as $trait) {
            $classlike['directTraitUsers'][] = $trait['fqcn'];
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $constants
     */
    protected function buildConstantsInfo(ArrayObject $classlike, array $constants)
    {
        foreach ($constants as $rawConstantData) {
            $classlike['constants'][$rawConstantData['name']] = $this->classlikeConstantConverter->convertForClass(
                $rawConstantData,
                $classlike
            );
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $properties
     */
    protected function buildPropertiesInfo(ArrayObject $classlike, array $properties)
    {
        foreach ($properties as $rawPropertyData) {
            $classlike['properties'][$rawPropertyData['name']] = $this->propertyConverter->convertForClass(
                $rawPropertyData,
                $classlike
            );
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $methods
     */
    protected function buildMethodsInfo(ArrayObject $classlike, array $methods)
    {
        foreach ($methods as $rawMethodData) {
            $classlike['methods'][$rawMethodData['name']] = $this->methodConverter->convertForClass(
                $rawMethodData,
                $classlike
            );
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $traits
     * @param array       $traitAliases
     * @param array       $traitPrecedences
     */
    protected function buildTraitsInfo(
        ArrayObject $classlike,
        array $traits,
        array $traitAliases,
        array $traitPrecedences
    ) {
        foreach ($traits as $trait) {
            $classlike['traits'][] = $trait['fqcn'];
            $classlike['directTraits'][] = $trait['fqcn'];

            $traitInfo = $this->getCheckedClasslikeInfo($trait['fqcn'], $classlike['name']);

            $this->traitUsageResolver->resolveUseOf($traitInfo, $classlike, $traitAliases, $traitPrecedences);
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $parents
     */
    protected function buildParentsInfo(ArrayObject $classlike, array $parents)
    {
        foreach ($parents as $parent) {
            $classlike['parents'][] = $parent['fqcn'];
            $classlike['directParents'][] = $parent['fqcn'];

            $parentInfo = $this->getCheckedClasslikeInfo($parent['fqcn'], $classlike['name']);

            $this->inheritanceResolver->resolveInheritanceOf($parentInfo, $classlike);
        }
    }

    /**
     * @param ArrayObject $classlike
     * @param array       $interfaces
     */
    protected function buildInterfacesInfo(ArrayObject $classlike, array $interfaces)
    {
        foreach ($interfaces as $interface) {
            $classlike['interfaces'][] = $interface['fqcn'];
            $classlike['directInterfaces'][] = $interface['fqcn'];

            $interfaceInfo = $this->getCheckedClasslikeInfo($interface['fqcn'], $classlike['name']);

            $this->interfaceImplementationResolver->resolveImplementationOf($interfaceInfo, $classlike);
        }
    }

    /**
     * @param ArrayObject $result
     * @param string      $elementFqcn
     */
    protected function resolveSelfTypesTo(ArrayObject $result, $elementFqcn)
    {
        $typeAnalyzer = $this->typeAnalyzer;

        $this->walkTypes($result, function (array &$type) use ($elementFqcn, $typeAnalyzer) {
            $type['resolvedType'] = $typeAnalyzer->interchangeSelfWithActualType($type['resolvedType'], $elementFqcn);
        });
    }

    /**
     * @param ArrayObject $result
     * @param string      $elementFqcn
     */
    protected function resolveStaticTypesTo(ArrayObject $result, $elementFqcn)
    {
        $typeAnalyzer = $this->typeAnalyzer;

        $this->walkTypes($result, function (array &$type) use ($elementFqcn, $typeAnalyzer) {
            $replacedThingy = $typeAnalyzer->interchangeStaticWithActualType($type['type'], $elementFqcn);
            $replacedThingy = $typeAnalyzer->interchangeThisWithActualType($replacedThingy, $elementFqcn);

            if ($type['type'] !== $replacedThingy) {
                $type['resolvedType'] = $replacedThingy;
            }
        });
    }

    /**
     * @param ArrayObject $result
     */
    protected function resolveNormalTypes(ArrayObject $result)
    {
        $typeAnalyzer = $this->typeAnalyzer;

        $this->walkTypes($result, function (array &$type) use ($typeAnalyzer) {
            if ($typeAnalyzer->isClassType($type['fqcn'])) {
                $type['resolvedType'] = $typeAnalyzer->getNormalizedFqcn($type['fqcn']);
            } else {
                $type['resolvedType'] = $type['fqcn'];
            }
        });
    }

    /**
     * @param ArrayObject $result
     * @param callable    $callable
     */
    protected function walkTypes(ArrayObject $result, callable $callable)
    {
        foreach ($result['methods'] as $name => &$method) {
            foreach ($method['parameters'] as &$parameter) {
                foreach ($parameter['types'] as &$type) {
                    $callable($type);
                }
            }

            foreach ($method['returnTypes'] as &$returnType) {
                $callable($returnType);
            }
        }

        foreach ($result['properties'] as $name => &$property) {
            foreach ($property['types'] as &$type) {
                $callable($type);
            }
        }

        foreach ($result['constants'] as $name => &$constants) {
            foreach ($constants['types'] as &$type) {
                $callable($type);
            }
        }
    }
}
