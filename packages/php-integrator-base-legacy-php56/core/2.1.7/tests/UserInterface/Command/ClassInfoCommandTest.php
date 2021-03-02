<?php

namespace PhpIntegrator\Tests\UserInterface\Command;

use PhpIntegrator\UserInterface\Command\ClassInfoCommand;

use PhpIntegrator\Tests\IndexedTest;

class ClassInfoCommandTest extends IndexedTest
{
    /**
     * @param string $file
     * @param string $fqcn
     *
     * @return array
     */
    protected function getClassInfo($file, $fqcn)
    {
        $path = $this->getPathFor($file);

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ClassInfoCommand(
            $container->get('typeAnalyzer'),
            $container->get('classlikeInfoBuilder')
        );

        return $command->getClassInfo($fqcn);
    }

    /**
     * @param string $fqcn
     *
     * @return array
     */
    protected function getBuiltinClassInfo($fqcn)
    {
        $container = $this->createTestContainerForBuiltinStructuralElements();

        $command = new ClassInfoCommand(
            $container->get('typeAnalyzer'),
            $container->get('classlikeInfoBuilder')
        );

        return $command->getClassInfo($fqcn);
    }

    /**
     * @param string $file
     *
     * @return string
     */
    protected function getPathFor($file)
    {
        return __DIR__ . '/ClassInfoCommandTest/' . $file;
    }

    /**
     * @expectedException \UnexpectedValueException
     */
    public function testFailsOnUnknownClass()
    {
        $output = $this->getClassInfo('SimpleClass.phpt', 'DoesNotExist');
    }

    /**
     *
     */
    public function testLeadingSlashIsResolvedCorrectly()
    {
        $fileName = 'SimpleClass.phpt';

        $this->assertEquals(
            $this->getClassInfo($fileName, 'A\SimpleClass'),
            $this->getClassInfo($fileName, '\A\SimpleClass')
        );
    }

    /**
     *
     */
    public function testDataIsCorrectForASimpleClass()
    {
        $fileName = 'SimpleClass.phpt';

        $output = $this->getClassInfo($fileName, 'A\SimpleClass');

        $this->assertEquals([
            'name'               => '\A\SimpleClass',
            'startLine'          => 10,
            'endLine'            => 13,
            'shortName'          => 'SimpleClass',
            'filename'           => $this->getPathFor($fileName),
            'type'               => 'class',
            'isAbstract'         => false,
            'isFinal'            => false,
            'isBuiltin'          => false,
            'isDeprecated'       => false,
            'isAnnotation'       => false,
            'hasDocblock'        => true,
            'hasDocumentation'   => true,
            'shortDescription'   => 'This is the summary.',
            'longDescription'    => 'This is a long description.',
            'parents'            => [],
            'interfaces'         => [],
            'traits'             => [],
            'directParents'      => [],
            'directInterfaces'   => [],
            'directTraits'       => [],
            'directChildren'     => [],
            'directImplementors' => [],
            'directTraitUsers'   => [],
            'constants'          => [
                'class' => [
                    'name'               => 'class',
                    'fqcn'               => null,
                    'isBuiltin'          => true,
                    'startLine'          => 0,
                    'endLine'            => 0,
                    'defaultValue'       => 'ignored',
                    'filename'           => null,
                    'isPublic'           => true,
                    'isProtected'        => false,
                    'isPrivate'          => false,
                    'isStatic'           => true,
                    'isDeprecated'       => false,
                    'hasDocblock'        => false,
                    'hasDocumentation'   => false,

                    'shortDescription'   => 'PHP built-in class constant that evaluates to the FCQN.',
                    'longDescription'    => null,
                    'typeDescription'    => null,

                    'types'             => [                        [
                            'type'         => 'string',
                            'fqcn'         => 'string',
                            'resolvedType' => 'string'
                        ]
                    ],

                    'declaringClass'     => [
                        'name'      => '\A\SimpleClass',
                        'filename'  => $this->getPathFor($fileName),
                        'startLine' => 10,
                        'endLine'   => 13,
                        'type'      => 'class'
                    ],

                    'declaringStructure' => [
                        'name'            => '\A\SimpleClass',
                        'filename'        => $this->getPathFor($fileName),
                        'startLine'       => 10,
                        'endLine'         => 13,
                        'type'            => 'class',
                        'startLineMember' => 0,
                        'endLineMember'   => 0
                    ]
                ]
            ],
            'properties'         => [],
            'methods'            => []
        ], $output);
    }

    /**
     *
     */
    public function testAnnotationClassIsCorrectlyPickedUp()
    {
        $fileName = 'AnnotationClass.phpt';

        $output = $this->getClassInfo($fileName, 'A\AnnotationClass');

        $this->assertTrue($output['isAnnotation']);
    }

    /**
     *
     */
    public function testFinalClassIsCorrectlyPickedUp()
    {
        $fileName = 'FinalClass.phpt';

        $output = $this->getClassInfo($fileName, 'A\FinalClass');

        $this->assertTrue($output['isFinal']);
    }

    /**
     *
     */
    public function testDataIsCorrectForClassProperties()
    {
        $fileName = 'ClassProperty.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals([
            'name'               => 'testProperty',
            'startLine'          => 14,
            'endLine'            => 14,
            'defaultValue'       => "'test'",
            'isMagic'            => false,
            'isPublic'           => false,
            'isProtected'        => true,
            'isPrivate'          => false,
            'isStatic'           => false,
            'isDeprecated'       => false,
            'hasDocblock'        => true,
            'hasDocumentation'   => true,
            'shortDescription'   => 'This is the summary.',
            'longDescription'    => 'This is a long description.',
            'typeDescription'    => null,

            'types'             => [
                [
                    'type'         => 'MyType',
                    'fqcn'         => '\A\MyType',
                    'resolvedType' => '\A\MyType'
                ],

                [
                    'type'         => 'string',
                    'fqcn'         => 'string',
                    'resolvedType' => 'string'
                ]
            ],

            'override'           => null,

            'declaringClass' => [
                'name'      => '\A\TestClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 5,
                'endLine'   => 15,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\TestClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 5,
                'endLine'         => 15,
                'type'            => 'class',
                'startLineMember' => 14,
                'endLineMember'   => 14
            ]
        ], $output['properties']['testProperty']);
    }

    /**
     *
     */
    public function testPropertyDescriptionAfterVarTagTakesPrecedenceOverDocblockSummary()
    {
        $fileName = 'ClassPropertyDescriptionPrecedence.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('This is a description after the var tag.', $output['properties']['testProperty']['shortDescription']);
        $this->assertEquals('This is a long description.', $output['properties']['testProperty']['longDescription']);
    }

    /**
     *
     */
    public function testCompoundClassPropertyStatementsHaveTheirDocblocksAnalyzedCorrectly()
    {
        $fileName = 'CompoundClassPropertyStatement.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('A description of the first property.', $output['properties']['testProperty1']['shortDescription']);
        $this->assertEquals('This is a long description.', $output['properties']['testProperty1']['longDescription']);

        $this->assertEquals([
            [
                'type'         => 'Foo1',
                'fqcn'         => '\A\Foo1',
                'resolvedType' => '\A\Foo1'
            ]
        ], $output['properties']['testProperty1']['types']);

        $this->assertEquals('A description of the second property.', $output['properties']['testProperty2']['shortDescription']);
        $this->assertEquals('This is a long description.', $output['properties']['testProperty2']['longDescription']);

        $this->assertEquals([
            [
                'type'         => 'Foo2',
                'fqcn'         => '\A\Foo2',
                'resolvedType' => '\A\Foo2'
            ]
        ], $output['properties']['testProperty2']['types']);
    }

    /**
     *
     */
    public function testPropertyTypeDeductionFallsBackToUsingItsDefaultValue()
    {
        $fileName = 'ClassPropertyDefaultValue.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals([
            [
                'type'         => 'string',
                'fqcn'         => 'string',
                'resolvedType' => 'string'
            ]
        ], $output['properties']['testProperty']['types']);

        $this->assertEquals([
            [
                'type'         => 'null',
                'fqcn'         => 'null',
                'resolvedType' => 'null'
            ]
        ], $output['properties']['testPropertyWithNull']['types']);
    }

    /**
     *
     */
    public function testConstantTypeDeductionFallsBackToUsingItsDefaultValue()
    {
        $fileName = 'ClassConstantDefaultValue.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals([
            [
                'type'         => 'array',
                'fqcn'         => 'array',
                'resolvedType' => 'array'
            ]
        ], $output['constants']['TEST_CONSTANT']['types']);
    }

    /**
     *
     */
    public function testDataIsCorrectForClassMethods()
    {
        $fileName = 'ClassMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals([
            'name'               => 'testMethod',
            'fqcn'              => null,
            'isBuiltin'          => false,
            'startLine'          => 19,
            'endLine'            => 22,
            'filename'           => $this->getPathFor($fileName),

            'parameters'         => [
                [
                    'name'         => 'firstParameter',
                    'typeHint'     => '\DateTimeInterface',
                    'description'  => 'First parameter description.',
                    'defaultValue' => 'null',
                    'isNullable'   => true,
                    'isReference'  => false,
                    'isVariadic'   => false,
                    'isOptional'   => true,

                    'types' => [
                        [
                            'type'         => '\DateTimeInterface',
                            'fqcn'         => '\DateTimeInterface',
                            'resolvedType' => '\DateTimeInterface'
                        ],

                        [
                            'type'         => '\DateTime',
                            'fqcn'         => '\DateTime',
                            'resolvedType' => '\DateTime'
                        ]
                    ]
                ],

                [
                    'name'         => 'secondParameter',
                    'typeHint'     => null,
                    'description'  => null,
                    'defaultValue' => 'true',
                    'isNullable'   => false,
                    'isReference'  => true,
                    'isVariadic'   => false,
                    'isOptional'   => true,
                    'types'        => []
                ],

                [
                    'name'         => 'thirdParameter',
                    'typeHint'     => null,
                    'description'  => null,
                    'defaultValue' => null,
                    'isNullable'   => false,
                    'isReference'  => false,
                    'isVariadic'   => true,
                    'isOptional'   => false,
                    'types'        => []
                ]
            ],

            'throws'             => [
                '\UnexpectedValueException' => 'when something goes wrong.',
                '\LogicException'           => 'when something is wrong.'
            ],

            'isDeprecated'       => false,
            'hasDocblock'        => true,
            'hasDocumentation'   => true,

            'shortDescription'   => 'This is the summary.',
            'longDescription'    => 'This is a long description.',
            'returnDescription'  => null,
            'returnTypeHint'     => null,

            'returnTypes' => [
                [
                    'type'         => 'mixed',
                    'fqcn'         => 'mixed',
                    'resolvedType' => 'mixed'
                ],

                [
                    'type'         => 'bool',
                    'fqcn'         => 'bool',
                    'resolvedType' => 'bool'
                ]
            ],

            'isMagic'            => false,
            'isPublic'           => true,
            'isProtected'        => false,
            'isPrivate'          => false,
            'isStatic'           => false,
            'isAbstract'         => false,
            'isFinal'            => false,
            'override'           => null,
            'implementations'    => [],

            'declaringClass'     => [
                'name'      => '\A\TestClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 5,
                'endLine'   => 23,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\TestClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 5,
                'endLine'         => 23,
                'type'            => 'class',
                'startLineMember' => 19,
                'endLineMember'   => 22
            ]
        ], $output['methods']['testMethod']);
    }

    /**
     *
     */
    public function testFinalMethodIsCorrectlyPickedUp()
    {
        $fileName = 'FinalClassMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertTrue($output['methods']['finalMethod']['isFinal']);
    }

    /**
     *
     */
    public function testDataIsCorrectForClassConstants()
    {
        $fileName = 'ClassConstant.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals($output['constants']['TEST_CONSTANT'], [
            'name'               => 'TEST_CONSTANT',
            'fqcn'              => null,
            'isBuiltin'          => false,
            'startLine'          => 14,
            'endLine'            => 14,
            'defaultValue'       => '5',
            'filename'           => $this->getPathFor($fileName),
            'isPublic'           => true,
            'isProtected'        => false,
            'isPrivate'          => false,
            'isStatic'           => true,
            'isDeprecated'       => false,
            'hasDocblock'        => true,
            'hasDocumentation'   => true,

            'shortDescription'   => 'This is the summary.',
            'longDescription'    => 'This is a long description.',
            'typeDescription'    => null,

            'types'             => [
                [
                    'type'         => 'MyType',
                    'fqcn'         => '\A\MyType',
                    'resolvedType' => '\A\MyType'
                ],

                [
                    'type'         => 'string',
                    'fqcn'         => 'string',
                    'resolvedType' => 'string'
                ]
            ],

            'declaringClass'     => [
                'name'      => '\A\TestClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 5,
                'endLine'   => 15,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\TestClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 5,
                'endLine'         => 15,
                'type'            => 'class',
                'startLineMember' => 14,
                'endLineMember'   => 14
            ]
        ]);
    }

    /**
     *
     */
    public function testConstantDescriptionAfterVarTagTakesPrecedenceOverDocblockSummary()
    {
        $fileName = 'ClassConstantDescriptionPrecedence.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('This is a description after the var tag.', $output['constants']['TEST_CONSTANT']['shortDescription']);
        $this->assertEquals('This is a long description.', $output['constants']['TEST_CONSTANT']['longDescription']);
    }

    /**
     *
     */
    public function testDocblockInheritanceWorksProperlyForClasses()
    {
        $fileName = 'ClassDocblockInheritance.phpt';

        $childClassOutput = $this->getClassInfo($fileName, 'A\ChildClass');
        $parentClassOutput = $this->getClassInfo($fileName, 'A\ParentClass');
        $anotherChildClassOutput = $this->getClassInfo($fileName, 'A\AnotherChildClass');

        $this->assertEquals('This is the summary.', $childClassOutput['shortDescription']);
        $this->assertEquals('This is a long description.', $childClassOutput['longDescription']);

        $this->assertEquals(
            'Pre. ' . $parentClassOutput['longDescription'] . ' Post.',
            $anotherChildClassOutput['longDescription']
        );
    }

    /**
     *
     */
    public function testDocblockInheritanceWorksProperlyForMethods()
    {
        $fileName = 'MethodDocblockInheritance.phpt';

        $traitOutput       = $this->getClassInfo($fileName, 'A\TestTrait');
        $interfaceOutput   = $this->getClassInfo($fileName, 'A\TestInterface');
        $childClassOutput  = $this->getClassInfo($fileName, 'A\ChildClass');
        $parentClassOutput = $this->getClassInfo($fileName, 'A\ParentClass');

        $keysToTestForEquality = [
            'hasDocumentation',
            'isDeprecated',
            'longDescription',
            'shortDescription',
            'returnTypes',
            'parameters',
            'throws'
        ];

        foreach ($keysToTestForEquality as $key) {
            $this->assertEquals(
                $childClassOutput['methods']['basicDocblockInheritanceTraitTest'][$key],
                $traitOutput['methods']['basicDocblockInheritanceTraitTest'][$key]
            );

            $this->assertEquals(
                $childClassOutput['methods']['basicDocblockInheritanceInterfaceTest'][$key],
                $interfaceOutput['methods']['basicDocblockInheritanceInterfaceTest'][$key]
            );

            $this->assertEquals(
                $childClassOutput['methods']['basicDocblockInheritanceBaseClassTest'][$key],
                $parentClassOutput['methods']['basicDocblockInheritanceBaseClassTest'][$key]
            );
        }

        $this->assertEquals(
            'Pre. ' . $parentClassOutput['methods']['inheritDocBaseClassTest']['longDescription'] . ' Post.',
            $childClassOutput['methods']['inheritDocBaseClassTest']['longDescription']
        );

        $this->assertEquals(
            'Pre. ' . $interfaceOutput['methods']['inheritDocInterfaceTest']['longDescription'] . ' Post.',
            $childClassOutput['methods']['inheritDocInterfaceTest']['longDescription']
        );

        $this->assertEquals(
            'Pre. ' . $traitOutput['methods']['inheritDocTraitTest']['longDescription'] . ' Post.',
            $childClassOutput['methods']['inheritDocTraitTest']['longDescription']
        );
    }

    /**
     *
     */
    public function testDocblockInheritanceWorksProperlyForProperties()
    {
        $fileName = 'PropertyDocblockInheritance.phpt';

        $traitOutput       = $this->getClassInfo($fileName, 'A\TestTrait');
        $childClassOutput  = $this->getClassInfo($fileName, 'A\ChildClass');
        $parentClassOutput = $this->getClassInfo($fileName, 'A\ParentClass');

        $keysToTestForEquality = [
            'hasDocumentation',
            'isDeprecated',
            'shortDescription',
            'longDescription',
            'typeDescription',
            'types'
        ];

        foreach ($keysToTestForEquality as $key) {
            $this->assertEquals(
                $childClassOutput['properties']['basicDocblockInheritanceTraitTest'][$key],
                $traitOutput['properties']['basicDocblockInheritanceTraitTest'][$key]
            );

            $this->assertEquals(
                $childClassOutput['properties']['basicDocblockInheritanceBaseClassTest'][$key],
                $parentClassOutput['properties']['basicDocblockInheritanceBaseClassTest'][$key]
            );
        }

        $this->assertEquals(
            $childClassOutput['properties']['inheritDocBaseClassTest']['longDescription'],
            'Pre. ' . $parentClassOutput['properties']['inheritDocBaseClassTest']['longDescription'] . ' Post.'
        );

        $this->assertEquals(
            $childClassOutput['properties']['inheritDocTraitTest']['longDescription'],
            'Pre. ' . $traitOutput['properties']['inheritDocTraitTest']['longDescription'] . ' Post.'
        );
    }

    /**
     *
     */
    public function testMethodOverridingIsAnalyzedCorrectly()
    {
        $fileName = 'MethodOverride.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'description'  => null,
                'defaultValue' => null,
                'isNullable'   => false,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => false,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ]
                ]
            ]
        ], $output['methods']['__construct']['parameters']);

        $this->assertEquals([
            'startLine'   => 25,
            'endLine'     => 28,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 21,
                'endLine'   => 39,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 21,
                'endLine'         => 39,
                'type'            => 'class',
                'startLineMember' => 25,
                'endLineMember'   => 28
            ]
        ], $output['methods']['__construct']['override']);

        $this->assertEquals(55, $output['methods']['__construct']['startLine']);
        $this->assertEquals(58, $output['methods']['__construct']['endLine']);

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'description'  => null,
                'defaultValue' => 'null',
                'isNullable'   => true,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ],

                    [
                        'type'         => 'null',
                        'fqcn'         => 'null',
                        'resolvedType' => 'null'
                    ]
                ]
            ]
        ], $output['methods']['parentTraitMethod']['parameters']);

        $this->assertEquals([
            'startLine'   => 15,
            'endLine'     => 18,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 21,
                'endLine'   => 39,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentTrait',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 13,
                'endLine'         => 19,
                'type'            => 'trait',
                'startLineMember' => 15,
                'endLineMember'   => 18
            ]
        ], $output['methods']['parentTraitMethod']['override']);

        $this->assertEquals(65, $output['methods']['parentTraitMethod']['startLine']);
        $this->assertEquals(68, $output['methods']['parentTraitMethod']['endLine']);

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'description'  => null,
                'defaultValue' => 'null',
                'isNullable'   => true,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ],

                    [
                        'type'         => 'null',
                        'fqcn'         => 'null',
                        'resolvedType' => 'null'
                    ]
                ]
            ]
        ], $output['methods']['parentMethod']['parameters']);

        $this->assertEquals([
            'startLine'   => 30,
            'endLine'     => 33,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 21,
                'endLine'   => 39,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 21,
                'endLine'         => 39,
                'type'            => 'class',
                'startLineMember' => 30,
                'endLineMember'   => 33
            ]
        ], $output['methods']['parentMethod']['override']);

        $this->assertEquals(70, $output['methods']['parentMethod']['startLine']);
        $this->assertEquals(73, $output['methods']['parentMethod']['endLine']);

        $this->assertEquals([
            'startLine'   => 35,
            'endLine'     => 38,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 21,
                'endLine'   => 39,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 21,
                'endLine'         => 39,
                'type'            => 'class',
                'startLineMember' => 35,
                'endLineMember'   => 38
            ]
        ], $output['methods']['ancestorMethod']['override']);

        $this->assertEquals(60, $output['methods']['ancestorMethod']['startLine']);
        $this->assertEquals(63, $output['methods']['ancestorMethod']['endLine']);

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'description'  => null,
                'defaultValue' => 'null',
                'isNullable'   => true,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ],

                    [
                        'type'         => 'null',
                        'fqcn'         => 'null',
                        'resolvedType' => 'null'
                    ]
                ]
            ]
        ], $output['methods']['traitMethod']['parameters']);

        $this->assertEquals([
            'startLine'   => 43,
            'endLine'     => 46,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\TestTrait',
                'filename'  =>  $this->getPathFor($fileName),
                'startLine' => 41,
                'endLine'   => 49,
                'type'      => 'trait'
            ],

            'declaringStructure' => [
                'name'            => '\A\TestTrait',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 41,
                'endLine'         => 49,
                'type'            => 'trait',
                'startLineMember' => 43,
                'endLineMember'   => 46
            ]
        ], $output['methods']['traitMethod']['override']);

        $this->assertEquals(75, $output['methods']['traitMethod']['startLine']);
        $this->assertEquals(78, $output['methods']['traitMethod']['endLine']);

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'defaultValue' => 'null',
                'description'  => null,
                'isNullable'   => true,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ],

                    [
                        'type'         => 'null',
                        'fqcn'         => 'null',
                        'resolvedType' => 'null'
                    ]
                ]
            ]
        ], $output['methods']['abstractMethod']['parameters']);

        $this->assertEquals($output['methods']['abstractMethod']['override']['wasAbstract'], true);
    }

    /**
     *
     */
    public function testMethodOverridingOfParentImplementationIsAnalyzedCorrectly()
    {
        $fileName = 'MethodOverrideOfParentImplementation.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            'startLine'   => 12,
            'endLine'     => 15,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  =>  $this->getPathFor($fileName),
                'startLine' => 10,
                'endLine'   => 16,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 10,
                'endLine'         => 16,
                'type'            => 'class',
                'startLineMember' => 12,
                'endLineMember'   => 15
            ]
        ], $output['methods']['interfaceMethod']['override']);

        $this->assertEmpty($output['methods']['interfaceMethod']['implementations']);

        $this->assertEquals(20, $output['methods']['interfaceMethod']['startLine']);
        $this->assertEquals(23, $output['methods']['interfaceMethod']['endLine']);
    }

    /**
     *
     */
    public function testMethodOverridingAndImplementationSimultaneouslyIsAnalyzedCorrectly()
    {
        $fileName = 'MethodOverrideAndImplementation.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            [
                'startLine'   => 7,
                'endLine'     => 7,

                'declaringClass' => [
                    'name'      => '\A\TestInterface',
                    'filename'  =>  $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ]
            ]
        ], $output['methods']['interfaceMethod']['implementations']);

        $this->assertEquals([
            'startLine'   => 12,
            'endLine'     => 15,
            'wasAbstract' => false,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  =>  $this->getPathFor($fileName),
                'startLine' => 10,
                'endLine'   => 16,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 10,
                'endLine'         => 16,
                'type'            => 'class',
                'startLineMember' => 12,
                'endLineMember'   => 15
            ]
        ], $output['methods']['interfaceMethod']['override']);

        $this->assertEquals(20, $output['methods']['interfaceMethod']['startLine']);
        $this->assertEquals(23, $output['methods']['interfaceMethod']['endLine']);
    }

    /**
     *
     */
    public function testPropertyOverridingIsAnalyzedCorrectly()
    {
        $fileName = 'PropertyOverride.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            'startLine' => 12,
            'endLine'   => 12,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 15,
                'endLine'   => 21,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentTrait',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 10,
                'endLine'         => 13,
                'type'            => 'trait',
                'startLineMember' => 12,
                'endLineMember'   => 12
            ]
        ], $output['properties']['parentTraitProperty']['override']);

        $this->assertEquals([
            'startLine' => 19,
            'endLine'   => 19,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 15,
                'endLine'   => 21,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 15,
                'endLine'         => 21,
                'type'            => 'class',
                'startLineMember' => 19,
                'endLineMember'   => 19
            ]
        ], $output['properties']['parentProperty']['override']);

        $this->assertEquals([
            'startLine' => 20,
            'endLine'   => 20,

            'declaringClass' => [
                'name'      => '\A\ParentClass',
                'filename'  => $this->getPathFor($fileName),
                'startLine' => 15,
                'endLine'   => 21,
                'type'      => 'class'
            ],

            'declaringStructure' => [
                'name'            => '\A\ParentClass',
                'filename'        => $this->getPathFor($fileName),
                'startLine'       => 15,
                'endLine'         => 21,
                'type'            => 'class',
                'startLineMember' => 20,
                'endLineMember'   => 20
            ]
        ], $output['properties']['ancestorProperty']['override']);
    }

    /**
     *
     */
    public function testMethodImplementationIsAnalyzedCorrectlyWhenImplementingMethodFromInterfaceReferencedByParentClass()
    {
        $fileName = 'MethodImplementationFromParentClassInterface.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            [
                'name'         => 'foo',
                'typeHint'     => 'Foo',
                'defaultValue' => 'null',
                'description'  => null,
                'isNullable'   => true,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,

                'types' => [
                    [
                        'type'         => 'Foo',
                        'fqcn'         => '\A\Foo',
                        'resolvedType' => '\A\Foo'
                    ],

                    [
                        'type'         => 'null',
                        'fqcn'         => 'null',
                        'resolvedType' => 'null'
                    ]
                ]
            ]
        ], $output['methods']['parentInterfaceMethod']['parameters']);

        $this->assertEquals([
            [
                'startLine' => 7,
                'endLine'   => 7,

                'declaringClass' => [
                    'name'      => '\A\ParentClass',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 10,
                    'endLine'   => 13,
                    'type'      => 'class'
                ],

                'declaringStructure' => [
                    'name'            => '\A\ParentInterface',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ]
            ]
        ], $output['methods']['parentInterfaceMethod']['implementations']);

        $this->assertEquals('\A\ChildClass', $output['methods']['parentInterfaceMethod']['declaringClass']['name']);
        $this->assertEquals('\A\ChildClass', $output['methods']['parentInterfaceMethod']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testMethodImplementationIsAnalyzedCorrectlyWhenImplementingMethodFromInterfaceParent()
    {
        $fileName = 'MethodImplementationFromInterfaceParent.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            [
                'startLine' => 7,
                'endLine'   => 7,

                'declaringClass' => [
                    'name'      => '\A\ParentInterface',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\ParentInterface',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ]
            ]
        ], $output['methods']['interfaceParentMethod']['implementations']);

        $this->assertNull($output['methods']['interfaceParentMethod']['override']);

        $this->assertEquals('\A\ChildClass', $output['methods']['interfaceParentMethod']['declaringClass']['name']);
        $this->assertEquals('\A\ChildClass', $output['methods']['interfaceParentMethod']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testMethodImplementationIsAnalyzedCorrectlyWhenImplementingMethodFromInterfaceDirectlyReferenced()
    {
        $fileName = 'MethodImplementationFromDirectInterface.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals([
            [
                'startLine' => 7,
                'endLine'   => 7,

                'declaringClass' => [
                    'name'      => '\A\TestInterface',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ]
            ]
        ], $output['methods']['interfaceMethod']['implementations']);

        $this->assertEquals('\A\ChildClass', $output['methods']['interfaceMethod']['declaringClass']['name']);
        $this->assertEquals('\A\ChildClass', $output['methods']['interfaceMethod']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testMethodParameterTypesFallBackToDocblock()
    {
        $fileName = 'MethodParameterDocblockFallBack.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');
        $parameters = $output['methods']['testMethod']['parameters'];

        $this->assertEquals('\DateTime', $parameters[0]['types'][0]['type']);
        $this->assertEquals('bool', $parameters[1]['types'][0]['type']);
        $this->assertEquals('mixed', $parameters[2]['types'][0]['type']);
        $this->assertEquals('\Traversable[]', $parameters[3]['types'][0]['type']);
    }

    /**
     *
     */
    public function testMethodParameterTypeIsCorrectlyDeducedIfParameterIsVariadic()
    {
        $fileName = 'MethodVariadicParameter.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');
        $parameters = $output['methods']['testMethod']['parameters'];

        $this->assertEquals('\stdClass[]', $parameters[0]['types'][0]['type']);
    }

    /**
     *
     */
    public function testMagicClassPropertiesArePickedUpCorrectly()
    {
        $fileName = 'MagicClassProperties.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $data = $output['properties']['prop1'];

        $this->assertEquals($data['name'], 'prop1');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], false);

        $this->assertEquals($data['shortDescription'], 'Description 1.');
        $this->assertEquals($data['longDescription'], '');
        $this->assertEquals($data['typeDescription'], null);

        $this->assertEquals($data['types'], [
            [
                'type'         => 'Type1',
                'fqcn'         => '\A\Type1',
                'resolvedType' => '\A\Type1'
            ]
        ]);

        $data = $output['properties']['prop2'];

        $this->assertEquals($data['name'], 'prop2');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], false);

        $this->assertEquals($data['shortDescription'], 'Description 2.');
        $this->assertEquals($data['longDescription'], '');

        $this->assertEquals($data['types'], [
            [
                'type'         => 'Type2',
                'fqcn'         => '\A\Type2',
                'resolvedType' => '\A\Type2'
            ]
        ]);

        $data = $output['properties']['prop3'];

        $this->assertEquals($data['name'], 'prop3');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], false);

        $this->assertEquals($data['shortDescription'], 'Description 3.');
        $this->assertEquals($data['longDescription'], '');

        $this->assertEquals($data['types'], [
            [
                'type'         => 'Type3',
                'fqcn'         => '\A\Type3',
                'resolvedType' => '\A\Type3'
            ]
        ]);

        $data = $output['properties']['prop4'];

        $this->assertEquals($data['name'], 'prop4');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], true);

        $this->assertEquals($data['shortDescription'], 'Description 4.');
        $this->assertEquals($data['longDescription'], '');

        $this->assertEquals($data['types'], [
            [
                'type'         => 'Type4',
                'fqcn'         => '\A\Type4',
                'resolvedType' => '\A\Type4'
            ]
        ]);
    }

    /**
     *
     */
    public function testMagicClassMethodsArePickedUpCorrectly()
    {
        $fileName = 'MagicClassMethods.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $data = $output['methods']['magicFoo'];

        $this->assertEquals($data['name'], 'magicFoo');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], false);
        $this->assertNull($data['returnTypeHint']);

        $this->assertEquals($data['parameters'], []);

        $this->assertNull($data['shortDescription']);
        $this->assertNull($data['longDescription']);
        $this->assertNull($data['returnDescription']);

        $this->assertEquals($data['returnTypes'], [
            [
                'type'         => 'void',
                'fqcn'         => 'void',
                'resolvedType' => 'void'
            ]
        ]);

        $data = $output['methods']['someMethod'];

        $this->assertEquals($data['name'], 'someMethod');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], false);
        $this->assertNull($data['returnTypeHint']);

        $this->assertEquals($data['parameters'], [
            [
                'name'         => 'a',
                'typeHint'     => null,
                'description'  => null,
                'defaultValue' => null,
                'isNullable'   => false,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => false,
                'types'        => []
            ],

            [
                'name'         => 'b',
                'typeHint'     => null,
                'description'  => null,
                'defaultValue' => null,
                'isNullable'   => false,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => false,
                'types'        => []
            ],

            [
                'name'         => 'c',
                'typeHint'     => null,
                'description'  => null,
                'defaultValue' => null,
                'isNullable'   => false,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,
                'types'        => [
                    [
                        'type'         => 'array',
                        'fqcn'         => 'array',
                        'resolvedType' => 'array'
                    ]
                ]
            ],

            [
                'name'         => 'd',
                'typeHint'     => null,
                'description'  => null,
                'defaultValue' => null,
                'isNullable'   => false,
                'isReference'  => false,
                'isVariadic'   => false,
                'isOptional'   => true,
                'types'        => [
                    [
                        'type'         => 'Type',
                        'fqcn'         => '\A\Type',
                        'resolvedType' => '\A\Type'
                    ]
                ]
            ]
        ]);

        $this->assertEquals($data['shortDescription'], 'Description of method Test second line.');
        $this->assertEquals($data['longDescription'], '');
        $this->assertNull($data['returnDescription']);

        $this->assertEquals($data['returnTypes'], [
            [
                'type'         => 'TestClass',
                'fqcn'         => '\A\TestClass',
                'resolvedType' => '\A\TestClass'
            ]
        ]);

        $data = $output['methods']['magicFooStatic'];

        $this->assertEquals($data['name'], 'magicFooStatic');
        $this->assertEquals($data['isMagic'], true);
        $this->assertEquals($data['startLine'], 11);
        $this->assertEquals($data['endLine'], 11);
        $this->assertEquals($data['hasDocblock'], false);
        $this->assertEquals($data['hasDocumentation'], false);
        $this->assertEquals($data['isStatic'], true);
        $this->assertNull($data['returnTypeHint']);

        $this->assertEquals($data['parameters'], []);

        $this->assertNull($data['shortDescription']);
        $this->assertNull($data['longDescription']);
        $this->assertNull($data['returnDescription']);

        $this->assertEquals($data['returnTypes'], [
            [
                'type'         => 'void',
                'fqcn'         => 'void',
                'resolvedType' => 'void'
            ]
        ]);
    }

    /**
     *
     */
    public function testDataIsCorrectForClassInheritance()
    {
        $fileName = 'ClassInheritance.phpt';

        $output = $this->getClassInfo($fileName, 'A\ChildClass');

        $this->assertEquals($output['parents'], ['\A\BaseClass', '\A\AncestorClass']);
        $this->assertEquals($output['directParents'], ['\A\BaseClass']);

        $this->assertThat($output['constants'], $this->arrayHasKey('INHERITED_CONSTANT'));
        $this->assertThat($output['constants'], $this->arrayHasKey('CHILD_CONSTANT'));

        $this->assertThat($output['properties'], $this->arrayHasKey('inheritedProperty'));
        $this->assertThat($output['properties'], $this->arrayHasKey('childProperty'));

        $this->assertThat($output['methods'], $this->arrayHasKey('inheritedMethod'));
        $this->assertThat($output['methods'], $this->arrayHasKey('childMethod'));

        // Do a couple of sanity checks.
        $this->assertEquals('\A\BaseClass', $output['constants']['INHERITED_CONSTANT']['declaringClass']['name']);
        $this->assertEquals('\A\BaseClass', $output['properties']['inheritedProperty']['declaringClass']['name']);
        $this->assertEquals('\A\BaseClass', $output['methods']['inheritedMethod']['declaringClass']['name']);

        $this->assertEquals('\A\BaseClass', $output['constants']['INHERITED_CONSTANT']['declaringStructure']['name']);
        $this->assertEquals('\A\BaseClass', $output['properties']['inheritedProperty']['declaringStructure']['name']);
        $this->assertEquals('\A\BaseClass', $output['methods']['inheritedMethod']['declaringStructure']['name']);

        $output = $this->getClassInfo($fileName, 'A\BaseClass');

        $this->assertEquals($output['directChildren'], ['\A\ChildClass']);
        $this->assertEquals($output['parents'], ['\A\AncestorClass']);
    }

    /**
     *
     */
    public function testInterfaceImplementationIsCorrectlyProcessed()
    {
        $fileName = 'InterfaceImplementation.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals(['\A\BaseInterface', '\A\FirstInterface', '\A\SecondInterface'], $output['interfaces']);
        $this->assertEquals(['\A\FirstInterface', '\A\SecondInterface'], $output['directInterfaces']);

        $this->assertThat($output['constants'], $this->arrayHasKey('FIRST_INTERFACE_CONSTANT'));
        $this->assertThat($output['constants'], $this->arrayHasKey('SECOND_INTERFACE_CONSTANT'));

        $this->assertThat($output['methods'], $this->arrayHasKey('methodFromFirstInterface'));
        $this->assertThat($output['methods'], $this->arrayHasKey('methodFromSecondInterface'));

        // Do a couple of sanity checks.
        $this->assertEquals('\A\FirstInterface', $output['constants']['FIRST_INTERFACE_CONSTANT']['declaringClass']['name']);
        $this->assertEquals('\A\FirstInterface', $output['constants']['FIRST_INTERFACE_CONSTANT']['declaringStructure']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['methodFromFirstInterface']['declaringClass']['name']);
        $this->assertEquals('\A\FirstInterface', $output['methods']['methodFromFirstInterface']['declaringStructure']['name']);

        $this->assertEquals('\A\FirstInterface', $output['constants']['FIRST_INTERFACE_CONSTANT']['declaringClass']['name']);
        $this->assertEquals('\A\FirstInterface', $output['constants']['FIRST_INTERFACE_CONSTANT']['declaringStructure']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['methodFromFirstInterface']['declaringClass']['name']);
        $this->assertEquals('\A\FirstInterface', $output['methods']['methodFromFirstInterface']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testTraitUsageIsCorrectlyProcessed()
    {
        $fileName = 'TraitUsage.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals(['\A\FirstTrait', '\A\SecondTrait', '\A\BaseTrait'], $output['traits']);
        $this->assertEquals(['\A\FirstTrait', '\A\SecondTrait'], $output['directTraits']);

        $this->assertThat($output['properties'], $this->arrayHasKey('baseTraitProperty'));
        $this->assertThat($output['properties'], $this->arrayHasKey('firstTraitProperty'));
        $this->assertThat($output['properties'], $this->arrayHasKey('secondTraitProperty'));

        $this->assertThat($output['methods'], $this->arrayHasKey('testAmbiguous'));
        $this->assertThat($output['methods'], $this->arrayHasKey('testAmbiguousAsWell'));
        $this->assertThat($output['methods'], $this->arrayHasKey('baseTraitMethod'));

        // Do a couple of sanity checks.
        $this->assertEquals('\A\BaseClass', $output['properties']['baseTraitProperty']['declaringClass']['name']);
        $this->assertEquals('\A\BaseTrait', $output['properties']['baseTraitProperty']['declaringStructure']['name']);

        $this->assertEquals('\A\TestClass', $output['properties']['firstTraitProperty']['declaringClass']['name']);
        $this->assertEquals('\A\FirstTrait', $output['properties']['firstTraitProperty']['declaringStructure']['name']);

        $this->assertEquals('\A\BaseClass', $output['methods']['baseTraitMethod']['declaringClass']['name']);
        $this->assertEquals('\A\BaseTrait', $output['methods']['baseTraitMethod']['declaringStructure']['name']);

        $this->assertEquals('\A\TestClass', $output['methods']['test1']['declaringClass']['name']);
        $this->assertEquals('\A\FirstTrait', $output['methods']['test1']['declaringStructure']['name']);

        $this->assertEquals('\A\TestClass', $output['methods']['overriddenInBaseAndChild']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['overriddenInBaseAndChild']['declaringStructure']['name']);

        $this->assertEquals('\A\TestClass', $output['methods']['overriddenInChild']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['overriddenInChild']['declaringStructure']['name']);

        // Test the 'as' keyword for renaming trait method.
        $this->assertThat($output['methods'], $this->arrayHasKey('test1'));
        $this->assertThat($output['methods'], $this->logicalNot($this->arrayHasKey('test')));

        $this->assertTrue($output['methods']['test1']['isPrivate']);

        $this->assertEquals('\A\TestClass', $output['methods']['testAmbiguous']['declaringClass']['name']);
        $this->assertEquals('\A\SecondTrait', $output['methods']['testAmbiguous']['declaringStructure']['name']);

        $this->assertEquals('\A\TestClass', $output['methods']['testAmbiguousAsWell']['declaringClass']['name']);
        $this->assertEquals('\A\FirstTrait', $output['methods']['testAmbiguousAsWell']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testMethodOverrideDataIsCorrectWhenClassHasMethodThatIsAlsoDefinedByOneOfItsOwnTraits()
    {
        $fileName = 'ClassOverridesOwnTraitMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals('\A\TestTrait', $output['methods']['someMethod']['override']['declaringClass']['name']);
        $this->assertEquals('\A\TestTrait', $output['methods']['someMethod']['override']['declaringStructure']['name']);

        $this->assertEmpty($output['methods']['someMethod']['implementations']);
    }

    /**
     *
     */
    public function testMethodOverrideDataIsCorrectWhenClassHasMethodThatIsAlsoDefinedByOneOfItsOwnTraitsAndByTheParent()
    {
        $fileName = 'ClassOverridesTraitAndParentMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals('\A\BaseClass', $output['methods']['someMethod']['override']['declaringClass']['name']);
        $this->assertEquals('\A\BaseClass', $output['methods']['someMethod']['override']['declaringStructure']['name']);

        $this->assertEmpty($output['methods']['someMethod']['implementations']);
    }

    /**
     *
     */
    public function testMethodOverrideDataIsCorrectWhenInterfaceOverridesParentInterfaceMethod()
    {
        $fileName = 'InterfaceOverridesParentInterfaceMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestInterface');

        $this->assertEquals('\A\TestInterface', $output['methods']['interfaceMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestInterface', $output['methods']['interfaceMethod']['declaringStructure']['name']);

        $this->assertEquals('\A\BaseInterface', $output['methods']['interfaceMethod']['override']['declaringClass']['name']);
        $this->assertEquals('\A\BaseInterface', $output['methods']['interfaceMethod']['override']['declaringStructure']['name']);

        $this->assertEmpty($output['methods']['interfaceMethod']['implementations']);
    }

    /**
     *
     */
    public function testMethodImplementationDataIsCorrectWhenTraitMethodIndirectlyImplementsInterfaceMethod()
    {
        $fileName = 'TraitImplementsInterfaceMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestTrait', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals('\A\TestInterface', $output['methods']['someMethod']['implementations'][0]['declaringClass']['name']);
        $this->assertEquals('\A\TestInterface', $output['methods']['someMethod']['implementations'][0]['declaringStructure']['name']);

        $this->assertNull($output['methods']['someMethod']['override']);
    }

    /**
     *
     */
    public function testMethodImplementationDataIsCorrectWhenClassReceivesSameInterfaceMethodFromTwoInterfacesAndDoesNotImplementMethod()
    {
        $fileName = 'ClassWithTwoInterfacesWithSameMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestInterface1', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEmpty($output['methods']['someMethod']['implementations']);

        $this->assertNull($output['methods']['someMethod']['override']);
    }

    /**
     *
     */
    public function testMethodDeclaringStructureIsCorrectWhenMethodDirectlyOriginatesFromTrait()
    {
        $fileName = 'ClassUsingTraitMethod.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestTrait', $output['methods']['someMethod']['declaringStructure']['name']);
    }

    /**
     *
     */
    public function testMethodImplementationDataIsCorrectWhenClassMethodImplementsMultipleInterfaceMethodsSimultaneously()
    {
        $fileName = 'ClassMethodImplementsMultipleInterfaceMethods.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals([
            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface1',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface1',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ],

                'startLine' => 7,
                'endLine'   => 7
            ],

            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface2',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 10,
                    'endLine'   => 13,
                    'type'      => 'interface',
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface2',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 10,
                    'endLine'         => 13,
                    'type'            => 'interface',
                    'startLineMember' => 12,
                    'endLineMember'   => 12
                ],

                'startLine' => 12,
                'endLine'   => 12
            ]
        ], $output['methods']['someMethod']['implementations']);

        $this->assertNull($output['methods']['someMethod']['override']);
    }

    /**
     *
     */
    public function testMethodImplementationDataIsCorrectWhenClassTraitMethodImplementsMultipleInterfaceMethodsSimultaneously()
    {
        $fileName = 'ClassTraitMethodImplementsMultipleInterfaceMethods.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestTrait', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals([
            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface1',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface1',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ],

                'startLine' => 7,
                'endLine'   => 7
            ],

            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface2',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 10,
                    'endLine'   => 13,
                    'type'      => 'interface',
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface2',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 10,
                    'endLine'         => 13,
                    'type'            => 'interface',
                    'startLineMember' => 12,
                    'endLineMember'   => 12
                ],

                'startLine' => 12,
                'endLine'   => 12
            ]
        ], $output['methods']['someMethod']['implementations']);

        $this->assertNull($output['methods']['someMethod']['override']);
    }

    /**
     *
     */
    public function testMethodImplementationDataIsCorrectWhenClassMethodImplementsMultipleDirectAndIndirectInterfaceMethodsSimultaneously()
    {
        $fileName = 'ClassMethodImplementsMultipleDirectAndIndirectInterfaceMethods.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringClass']['name']);
        $this->assertEquals('\A\TestClass', $output['methods']['someMethod']['declaringStructure']['name']);

        $this->assertEquals([
            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface1',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 5,
                    'endLine'   => 8,
                    'type'      => 'interface'
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface1',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 5,
                    'endLine'         => 8,
                    'type'            => 'interface',
                    'startLineMember' => 7,
                    'endLineMember'   => 7
                ],

                'startLine' => 7,
                'endLine'   => 7
            ],

            [
                'declaringClass' => [
                    'name'      => '\A\TestInterface2',
                    'filename'  => $this->getPathFor($fileName),
                    'startLine' => 10,
                    'endLine'   => 13,
                    'type'      => 'interface',
                ],

                'declaringStructure' => [
                    'name'            => '\A\TestInterface2',
                    'filename'        => $this->getPathFor($fileName),
                    'startLine'       => 10,
                    'endLine'         => 13,
                    'type'            => 'interface',
                    'startLineMember' => 12,
                    'endLineMember'   => 12
                ],

                'startLine' => 12,
                'endLine'   => 12
            ]
        ], $output['methods']['someMethod']['implementations']);

        $this->assertNull($output['methods']['someMethod']['override']);
    }

    /**
     *
     */
    public function testSpecialTypesAreCorrectlyResolved()
    {
        $fileName = 'ResolveSpecialTypes.phpt';

        $output = $this->getClassInfo($fileName, 'A\childClass');

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['properties']['basePropSelf']['types']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['properties']['basePropStatic']['types']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['properties']['basePropThis']['types']);

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['properties']['propSelf']['types']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['properties']['propStatic']['types']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['properties']['propThis']['types']);

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['methods']['baseMethodSelf']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['baseMethodStatic']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['baseMethodThis']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['methodSelf']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['methodStatic']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['methodThis']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'childClass',
                'fqcn'         => '\A\childClass',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['methodOwnClassName']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['methods']['baseMethodWithParameters']['parameters'][0]['types']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['baseMethodWithParameters']['parameters'][1]['types']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\childClass'
            ]
        ], $output['methods']['baseMethodWithParameters']['parameters'][2]['types']);

        $output = $this->getClassInfo($fileName, 'A\ParentClass');

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['properties']['basePropSelf']['types']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['properties']['basePropStatic']['types']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['properties']['basePropThis']['types']);

        $this->assertEquals([
            [
                'type'         => 'self',
                'fqcn'         => 'self',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['methods']['baseMethodSelf']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => 'static',
                'fqcn'         => 'static',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['methods']['baseMethodStatic']['returnTypes']);

        $this->assertEquals([
            [
                'type'         => '$this',
                'fqcn'         => '$this',
                'resolvedType' => '\A\ParentClass'
            ]
        ], $output['methods']['baseMethodThis']['returnTypes']);
    }

    /**
     *
     */
    public function testMethodDocblockParameterTypesGetPrecedenceOverTypeHints()
    {
        $fileName = 'ClassMethodPrecedence.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEquals('string[]', $output['methods']['testMethod']['parameters'][0]['types'][0]['type']);
        $this->assertEquals('string[]', $output['methods']['testMethod']['parameters'][0]['types'][0]['fqcn']);
        $this->assertEquals('string', $output['methods']['testMethod']['parameters'][1]['types'][0]['type']);
        $this->assertEquals('string', $output['methods']['testMethod']['parameters'][1]['types'][0]['fqcn']);
    }

    /**
     *
     */
    public function testItemsWithoutDocblockAndDefaultValueHaveNoTypes()
    {
        $fileName = 'ClassMethodNoDocblock.phpt';

        $output = $this->getClassInfo($fileName, 'A\TestClass');

        $this->assertEmpty($output['methods']['testMethod']['parameters'][0]['types']);
        $this->assertEmpty($output['methods']['testMethod']['returnTypes']);
        $this->assertEmpty($output['properties']['testProperty']['types']);
    }

    /**
     *
     */
    public function testCorrectlyFindsClassesInNamelessNamespace()
    {
        $fileName = 'ClassNamelessNamespace.phpt';

        $output = $this->getClassInfo($fileName, 'TestClass');

        $this->assertEquals('\TestClass', $output['name']);
    }

    /**
     *
     */
    public function testCorrectlyAnalyzesBuiltinItems()
    {
        $output = $this->getBuiltinClassInfo('\IteratorAggregate');

        $this->assertArraySubset([
            'name'             => '\IteratorAggregate',
            'startLine'        => 0,
            'endLine'          => 0,
            'shortName'        => 'IteratorAggregate',
            'filename'         => null,
            'type'             => 'interface',
            'isAbstract'       => false,
            'isFinal'          => false,
            'isBuiltin'        => true,
            'isDeprecated'     => false,
            'isAnnotation'     => false,
            'hasDocblock'      => false,
            'hasDocumentation' => false,
            'shortDescription' => null,
            'longDescription'  => null,

            'parents'            => ['\Traversable'],
            'interfaces'         => [],
            'traits'             => [],
            'directParents'      => ['\Traversable'],
            'directInterfaces'   => [],
            'directTraits'       => [],
            'directChildren'     => [],
            'directImplementors' => ['\ArrayObject'],
            'directTraitUsers'   => [],
            'constants'          => [],
            'properties'         => []
        ], $output);

        $this->assertArraySubset([
            'name'               => 'getIterator',
            'fqcn'               => null,
            'isBuiltin'          => true,
            'startLine'          => 0,
            'endLine'            => 0,
            'filename'           => null,
            'parameters'         => [],
            'throws'             => [],
            'isDeprecated'       => false,
            'hasDocblock'        => false,
            'hasDocumentation'   => false,
            'returnTypeHint'     => null,

            'returnTypes'        => [
                [
                    'fqcn'         => '\Traversable',
                    'resolvedType' => '\Traversable',
                    'type'         => 'Traversable'
                ]
            ],

            'isMagic'            => false,
            'isPublic'           => true,
            'isProtected'        => false,
            'isPrivate'          => false,
            'isStatic'           => false,
            'isAbstract'         => false,
            'isFinal'            => false,
            'override'           => null,
            'implementations'    => null,

            'declaringClass' => [
                'name'      => '\IteratorAggregate',
                'filename'  => null,
                'startLine' => 0,
                'endLine'   => 0,
                'type'      => 'interface'
            ],

            'declaringStructure' => [
                'name'            => '\IteratorAggregate',
                'filename'        => null,
                'startLine'       => 0,
                'endLine'         => 0,
                'type'            => 'interface',
                'startLineMember' => 0,
                'endLineMember'   => 0
            ]
        ], $output['methods']['getIterator']);
    }

    /**
     *
     */
    public function testBuiltinInterfaceMethodsAreNotMarkedAsAbstract()
    {
        $output = $this->getBuiltinClassInfo('\SeekableIterator');

        $this->assertFalse($output['methods']['seek']['isAbstract']);
    }

    /**
     *
     */
    public function testBuiltinClassesDoNotAutomaticallyOverrideMethodsFromTheirParents()
    {
        $output = $this->getBuiltinClassInfo('\SeekableIterator');

        $this->assertEquals('\Iterator', $output['methods']['next']['declaringClass']['name']);
    }

    /**
     *
     */
    public function testBuiltinClassesDoNotAutomaticallyOverridePropertiesFromTheirParents()
    {
        $output = $this->getBuiltinClassInfo('\DomainException');

        $this->assertEquals('\Exception', $output['properties']['message']['declaringClass']['name']);
    }

    /**
     *
     */
    public function testBuiltinClassesDoNotAutomaticallyOverrideConstantsFromTheirParents()
    {
        $output = $this->getBuiltinClassInfo('\SplTempFileObject');

        $this->assertEquals('\SplFileObject', $output['constants']['DROP_NEW_LINE']['declaringClass']['name']);
    }

    /**
     * @expectedException \PhpIntegrator\Analysis\CircularDependencyException
     */
    public function testThrowsExceptionOnCircularDependencyWithClassExtendingItself()
    {
        $fileName = 'CircularDependencyExtends.phpt';

        $output = $this->getClassInfo($fileName, 'A\C');
    }

    /**
     * @expectedException \PhpIntegrator\Analysis\CircularDependencyException
     */
    public function testThrowsExceptionOnCircularDependencyWithClassImplementingItself()
    {
        $fileName = 'CircularDependencyImplements.phpt';

        $output = $this->getClassInfo($fileName, 'A\C');
    }

    /**
     * @expectedException \PhpIntegrator\Analysis\CircularDependencyException
     */
    public function testThrowsExceptionOnCircularDependencyWithClassUsingItselfAsTrait()
    {
        $fileName = 'CircularDependencyUses.phpt';

        $output = $this->getClassInfo($fileName, 'A\C');
    }
}
