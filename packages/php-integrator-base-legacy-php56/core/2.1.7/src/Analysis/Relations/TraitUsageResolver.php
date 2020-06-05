<?php

namespace PhpIntegrator\Analysis\Relations;

use ArrayObject;

/**
 * Deals with resolving trait usage for classlikes.
 */
class TraitUsageResolver extends AbstractResolver
{
    /**
     * @param ArrayObject $trait
     * @param ArrayObject $class
     * @param array       $traitAliases
     * @param array       $traitPrecedences
     *
     * @return ArrayObject
     */
    public function resolveUseOf(ArrayObject $trait, ArrayObject $class, array $traitAliases, array $traitPrecedences)
    {
        foreach ($trait['properties'] as $property) {
            $this->resolveTraitUseOfProperty($property, $class);
        }

        foreach ($trait['methods'] as $method) {
            // If the method was aliased, pretend it has another name and access modifier before "inheriting" it.
            if (isset($traitAliases[$method['name']])) {
                $alias = $traitAliases[$method['name']];

                if ($alias['trait_fqcn'] === null || $alias['trait_fqcn'] === $trait['name']) {
                    $method['name']        = $alias['alias'] ?: $method['name'];
                    $method['isPublic']    = ($alias['access_modifier'] === 'public');
                    $method['isProtected'] = ($alias['access_modifier'] === 'protected');
                    $method['isPrivate']   = ($alias['access_modifier'] === 'private');
                }
            }

            if (isset($traitPrecedences[$method['name']])) {
                if ($traitPrecedences[$method['name']]['trait_fqcn'] !== $trait['name']) {
                    // The method is present in multiple used traits and precedences indicate that the one
                    // from this trait should not be imported.
                    continue;
                }
            }

            $this->resolveTraitUseOfMethod($method, $class);
        }
    }

    /**
     * @param array       $traitPropertyData
     * @param ArrayObject $class
     */
    protected function resolveTraitUseOfProperty(array $traitPropertyData, ArrayObject $class)
    {
        $inheritedData = [];
        $childProperty = null;
        $overriddenPropertyData = null;

        if (isset($class['properties'][$traitPropertyData['name']])) {
            $childProperty = $class['properties'][$traitPropertyData['name']];

            $overriddenPropertyData = [
                'declaringClass'     => $childProperty['declaringClass'],
                'declaringStructure' => $traitPropertyData['declaringStructure'],
                'startLine'          => $traitPropertyData['startLine'],
                'endLine'            => $traitPropertyData['endLine']
            ];

            if ($traitPropertyData['hasDocumentation'] && $this->isInheritingFullDocumentation($childProperty)) {
                $inheritedData = $this->extractInheritedPropertyInfo($traitPropertyData);
            } else {
                $inheritedData['longDescription'] = $this->resolveInheritDoc(
                    $childProperty['longDescription'],
                    $traitPropertyData['longDescription']
                );
            }

            $childProperty['declaringStructure'] = [
                'name'            => $traitPropertyData['declaringStructure']['name'],
                'filename'        => $traitPropertyData['declaringStructure']['filename'],
                'startLine'       => $traitPropertyData['declaringStructure']['startLine'],
                'endLine'         => $traitPropertyData['declaringStructure']['endLine'],
                'type'            => $traitPropertyData['declaringStructure']['type'],
                'startLineMember' => $traitPropertyData['startLine'],
                'endLineMember'   => $traitPropertyData['endLine']
            ];
        } else {
            $childProperty = [];
        }

        $class['properties'][$traitPropertyData['name']] = array_merge($traitPropertyData, $childProperty, $inheritedData, [
            'override' => $overriddenPropertyData,

            'declaringClass' => [
                'name'            => $class['name'],
                'filename'        => $class['filename'],
                'startLine'       => $class['startLine'],
                'endLine'         => $class['endLine'],
                'type'            => $class['type']
            ]
        ]);
    }

    /**
     * @param array       $traitMethodData
     * @param ArrayObject $class
     */
    protected function resolveTraitUseOfMethod(array $traitMethodData, ArrayObject $class)
    {
        $inheritedData = [];
        $childMethod = null;
        $overrideData = null;
        $implementationData = [];

        if (isset($class['methods'][$traitMethodData['name']])) {
            $childMethod = $class['methods'][$traitMethodData['name']];

            if ($traitMethodData['declaringStructure']['type'] === 'interface') {
                $implementationData = array_merge($childMethod['implementations'], [
                    [
                        'declaringClass'     => $childMethod['declaringClass'],
                        'declaringStructure' => $traitMethodData['declaringStructure'],
                        'startLine'          => $traitMethodData['startLine'],
                        'endLine'            => $traitMethodData['endLine']
                    ]
                ]);
            } else {
                if ($childMethod['declaringStructure']['name'] === $class['name']) {
                    // We are in the special case where the class is defining a method with the same name as a method
                    // we're trying to import from a trait. In that case the class' method takes precedence.
                    if (!$childMethod['override']) {
                        /*
                         * This requires a little explanation: strictly spoken, a trait method overrides a method
                         * defined in the parent class of the class using it. If the class itself defines the method
                         * as well, the class is "overriding" a method from its own trait, and the trait method is
                         * "overriding" the parent method. However, if we strictly follow this, the class method's
                         * override data would point to the trait method and the trait method's override data would
                         * point nowhere as a trait in itself can't be overriding anything. Because of this, we opt to
                         * point the class method's override data to the parent method instead of to the trait method,
                         * which is much more useful. If there is no parent method and the class method is just
                         * overwriting the trait method, we *do* point the override data to the trait, as there is no
                         * useful information getting lost.
                         *
                         * *Phew*
                         */
                        $overrideData = [
                            'declaringClass'     => $traitMethodData['declaringClass'],
                            'declaringStructure' => $traitMethodData['declaringStructure'],
                            'startLine'          => $traitMethodData['startLine'],
                            'endLine'            => $traitMethodData['endLine'],
                            'wasAbstract'        => $traitMethodData['isAbstract']
                        ];
                    }
                } else {
                    $overrideData = [
                        'declaringClass'     => $childMethod['declaringClass'],
                        'declaringStructure' => $traitMethodData['declaringStructure'],
                        'startLine'          => $traitMethodData['startLine'],
                        'endLine'            => $traitMethodData['endLine'],
                        'wasAbstract'        => $traitMethodData['isAbstract']
                    ];
                }
            }

            if ($traitMethodData['hasDocumentation'] && $this->isInheritingFullDocumentation($childMethod)) {
                $inheritedData = $this->extractInheritedMethodInfo($traitMethodData, $childMethod);
            } else {
                $inheritedData['longDescription'] = $this->resolveInheritDoc(
                    $childMethod['longDescription'],
                    $traitMethodData['longDescription']
                );
            }

            if ($childMethod['declaringStructure']['name'] !== $class['name']) {
                $childMethod['declaringStructure'] = [
                    'name'            => $traitMethodData['declaringStructure']['name'],
                    'filename'        => $traitMethodData['declaringStructure']['filename'],
                    'startLine'       => $traitMethodData['declaringStructure']['startLine'],
                    'endLine'         => $traitMethodData['declaringStructure']['endLine'],
                    'type'            => $traitMethodData['declaringStructure']['type'],
                    'startLineMember' => $traitMethodData['startLine'],
                    'endLineMember'   => $traitMethodData['endLine']
                ];
            } else {
                $childMethod['declaringStructure'] = [
                    'name'            => $class['name'],
                    'filename'        => $class['filename'],
                    'startLine'       => $class['startLine'],
                    'endLine'         => $class['endLine'],
                    'type'            => $class['type'],
                    'startLineMember' => $childMethod['startLine'],
                    'endLineMember'   => $childMethod['endLine']
                ];
            }
        } else {
            $childMethod = [
                'declaringStructure' => [
                    'name'            => $traitMethodData['declaringStructure']['name'],
                    'filename'        => $traitMethodData['declaringStructure']['filename'],
                    'startLine'       => $traitMethodData['declaringStructure']['startLine'],
                    'endLine'         => $traitMethodData['declaringStructure']['endLine'],
                    'type'            => $traitMethodData['declaringStructure']['type'],
                    'startLineMember' => $traitMethodData['startLine'],
                    'endLineMember'   => $traitMethodData['endLine']
                ]
            ];
        }

        $class['methods'][$traitMethodData['name']] = array_merge($traitMethodData, $childMethod, $inheritedData, [
            'override'        => $overrideData,
            'implementations' => $implementationData,

            'declaringClass' => [
                'name'            => $class['name'],
                'filename'        => $class['filename'],
                'startLine'       => $class['startLine'],
                'endLine'         => $class['endLine'],
                'type'            => $class['type']
            ]
        ]);
    }
}
