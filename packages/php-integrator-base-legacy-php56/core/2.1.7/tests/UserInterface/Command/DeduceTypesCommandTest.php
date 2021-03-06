<?php

namespace PhpIntegrator\Tests\UserInterface\Command;

use ReflectionClass;

use PhpIntegrator\UserInterface\Command\DeduceTypesCommand;

use PhpIntegrator\Tests\IndexedTest;

class DeduceTypesCommandTest extends IndexedTest
{
    /**
     * @param string $file
     * @param string $expression
     *
     * @return string[]
     */
    protected function deduceTypesFromExpression($file, $expression)
    {
        $path = __DIR__ . '/DeduceTypesCommandTest/' . $file;

        $markerOffset = $this->getMarkerOffset($path, '<MARKER>');

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new DeduceTypesCommand(
            $container->get('nodeTypeDeducer'),
            $container->get('lastExpressionParser'),
            $container->get('sourceCodeStreamReader')
        );

        $reflectionClass = new ReflectionClass(DeduceTypesCommand::class);
        $reflectionMethod = $reflectionClass->getMethod('deduceTypesFromExpression');
        $reflectionMethod->setAccessible(true);

        return $reflectionMethod->invoke($command, $path, file_get_contents($path), $expression, $markerOffset);
    }

    /**
     * @param string $path
     * @param string $marker
     *
     * @return int
     */
    protected function getMarkerOffset($path, $marker)
    {
        $testFileContents = @file_get_contents($path);

        $markerOffset = mb_strpos($testFileContents, $marker);

        return $markerOffset;
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOverrideAnnotations()
    {
        $output = $this->deduceTypesFromExpression('TypeOverrideAnnotations.phpt', '$a');

        $this->assertEquals(['\Traversable'], $output);

        $output = $this->deduceTypesFromExpression('TypeOverrideAnnotations.phpt', '$b');

        $this->assertEquals(['\Traversable'], $output);

        $output = $this->deduceTypesFromExpression('TypeOverrideAnnotations.phpt', '$c');

        $this->assertEquals(['\A\C', 'null'], $output);

        $output = $this->deduceTypesFromExpression('TypeOverrideAnnotations.phpt', '$d');

        $this->assertEquals(['\A\D'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyResolvesThisInClass()
    {
        $output = $this->deduceTypesFromExpression('ThisInClass.phpt', '$this');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyResolvesThisOutsideClass()
    {
        $output = $this->deduceTypesFromExpression('ThisOutsideClass.phpt', '$this');

        $this->assertEquals([], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesFunctionTypeHints()
    {
        $output = $this->deduceTypesFromExpression('FunctionParameterTypeHint.phpt', '$b');

        $this->assertEquals(['\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesFunctionDocblocks()
    {
        $output = $this->deduceTypesFromExpression('FunctionParameterDocblock.phpt', '$b');

        $this->assertEquals(['\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesMethodTypeHints()
    {
        $output = $this->deduceTypesFromExpression('MethodParameterTypeHint.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesMethodDocblocks()
    {
        $output = $this->deduceTypesFromExpression('MethodParameterDocblock.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesClosureTypeHints()
    {
        $output = $this->deduceTypesFromExpression('ClosureParameterTypeHint.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyMovesBeyondClosureScopeForVariableUses()
    {
        $output = $this->deduceTypesFromExpression('ClosureVariableUseStatement.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);

        $output = $this->deduceTypesFromExpression('ClosureVariableUseStatement.phpt', '$c');

        $this->assertEquals(['\A\C'], $output);

        $output = $this->deduceTypesFromExpression('ClosureVariableUseStatement.phpt', '$d');

        $this->assertEquals(['\A\D'], $output);

        $output = $this->deduceTypesFromExpression('ClosureVariableUseStatement.phpt', '$e');

        $this->assertEquals([], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesCatchBlockTypeHints()
    {
        $output = $this->deduceTypesFromExpression('CatchBlockTypeHint.phpt', '$e');

        $this->assertEquals(['\UnexpectedValueException'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceof()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIf.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceofAndProperty()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfWithProperty.phpt', '$this->foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceofAndPropertyWithParentKeyword()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfWithPropertyWithParentKeyword.phpt', 'parent::$foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceofAndStaticPropertyWithClassName()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfWithStaticPropertyWithClassName.phpt', 'Test::$foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceofAndStaticPropertyWithSelfKeyword()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfWithStaticPropertyWithSelfKeyword.phpt', 'self::$foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithInstanceofAndStaticPropertyWithStaticKeyword()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfWithStaticPropertyWithStaticKeyword.phpt', 'static::$foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithInstanceofAndVariableInsideCondition()
    {
        $output = $this->deduceTypesFromExpression('InstanceofComplexIfVariableInsideCondition.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithInstanceofAndAnd()
    {
        $output = $this->deduceTypesFromExpression('InstanceofComplexIfAnd.phpt', '$b');

        $this->assertEquals(['\A\B', '\A\C', '\A\D'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithInstanceofAndOr()
    {
        $output = $this->deduceTypesFromExpression('InstanceofComplexIfOr.phpt', '$b');

        $this->assertEquals(['\A\B', '\A\C', '\A\D', '\A\E'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyIfStatementWithInstanceofAndOrTakesPrecedenceOverFunctionTypeHint()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfOrWithTypeHint.phpt', '$b');

        $this->assertEquals(['\A\B', '\A\C'], $output);
    }

    /**
     * @return void
     */
    public function testIfWithInstanceofContainingIfWithDifferentInstanceofGivesNestedTypePrecedenceOverFirst()
    {
        $output = $this->deduceTypesFromExpression('InstanceofNestedIf.phpt', '$b');

        $this->assertEquals(['\A\A'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesNestedIfStatementWithInstanceofAndNegation()
    {
        $output = $this->deduceTypesFromExpression('InstanceofNestedIfWithNegation.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesNestedIfStatementWithInstanceofAndReassignment()
    {
        $output = $this->deduceTypesFromExpression('InstanceofNestedIfReassignment.phpt', '$b');

        $this->assertEquals(['\A\A'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithNotInstanceof()
    {
        $output = $this->deduceTypesFromExpression('IfNotInstanceof.phpt', '$b');

        $this->assertEquals(['\A\A'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithNotStrictlyEqualsNull()
    {
        $output = $this->deduceTypesFromExpression('IfNotStrictlyEqualsNull.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithNotLooselyEqualsNull()
    {
        $output = $this->deduceTypesFromExpression('IfNotLooselyEqualsNull.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithStrictlyEqualsNull()
    {
        $output = $this->deduceTypesFromExpression('IfStrictlyEqualsNull.phpt', '$b');

        $this->assertEquals(['null'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithLooselyEqualsNull()
    {
        $output = $this->deduceTypesFromExpression('IfLooselyEqualsNull.phpt', '$b');

        $this->assertEquals(['null'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithTruthy()
    {
        $output = $this->deduceTypesFromExpression('IfTruthy.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesIfStatementWithFalsy()
    {
        $output = $this->deduceTypesFromExpression('IfFalsy.phpt', '$b');

        $this->assertEquals(['null'], $output);
    }

    /**
     * @return void
     */
    public function testTypeOverrideAnnotationsStillTakePrecedenceOverConditionals()
    {
        $output = $this->deduceTypesFromExpression('IfWithTypeOverride.phpt', '$b');

        $this->assertEquals(['string'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesComplexIfStatementWithVariableHandlingFunction()
    {
        $output = $this->deduceTypesFromExpression('IfVariableHandlingFunction.phpt', '$b');

        $this->assertEquals([
            'array',
            'bool',
            'callable',
            'float',
            'int',
            'null',
            'string',
            'object',
            'resource'
        ], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyTreatsIfConditionAsSeparateScope()
    {
        $output = $this->deduceTypesFromExpression('InstanceofIfSeparateScope.phpt', '$b');

        $this->assertEquals([], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesElseIfStatementWithInstanceof()
    {
        $output = $this->deduceTypesFromExpression('InstanceofElseIf.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testIfStatementCorrectlyNarrowsDownDetectedTypeOfStringVariable()
    {
        $output = $this->deduceTypesFromExpression('IfStatementNarrowsTypeOfStringVariable.phpt', '$b');

        $this->assertEquals(['string'], $output);
    }

    /**
     * @return void
     */
    public function testNestedIfStatementDoesNotExpandTypeListAgainIfPreviousIfStatementWasSpecific()
    {
        $output = $this->deduceTypesFromExpression('IfStatementDoesNotExpandTypeListOfVariable.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyConfinesTreatsElseIfConditionAsSeparateScope()
    {
        $output = $this->deduceTypesFromExpression('InstanceofElseIfSeparateScope.phpt', '$b');

        $this->assertEquals([], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTernaryExpressionWithInstanceof()
    {
        $output = $this->deduceTypesFromExpression('InstanceofTernary.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyStartsFromTheDocblockTypeOfPropertiesBeforeApplyingConditionals()
    {
        $output = $this->deduceTypesFromExpression('IfWithProperty.phpt', '$b->foo');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyConfinesTreatsTernaryExpressionConditionAsSeparateScope()
    {
        $output = $this->deduceTypesFromExpression('InstanceofTernarySeparateScope.phpt', '$b');

        $this->assertEquals([], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTernaryExpression()
    {
        $output = $this->deduceTypesFromExpression('TernaryExpression.phpt', '$a');

        $this->assertEquals(['\A'], $output);

        $output = $this->deduceTypesFromExpression('TernaryExpression.phpt', '$b');

        $this->assertEquals(['\B'], $output);

        $output = $this->deduceTypesFromExpression('TernaryExpression.phpt', '$c');

        $this->assertEquals(['\C', 'null'], $output);

        $output = $this->deduceTypesFromExpression('TernaryExpression.phpt', '$d');

        $this->assertEquals(['\A', '\C', 'null'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesForeach()
    {
        $output = $this->deduceTypesFromExpression('Foreach.phpt', '$a');

        $this->assertEquals(['\DateTime'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesForeachWithStaticMethodCallReturningArrayWithSelfObjects()
    {
        $output = $this->deduceTypesFromExpression('ForeachWithStaticMethodCallReturningArrayWithSelfObjects.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesForeachWithStaticMethodCallReturningArrayWithStaticObjects()
    {
        $output = $this->deduceTypesFromExpression('ForeachWithStaticMethodCallReturningArrayWithStaticObjects.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesAssignments()
    {
        $output = $this->deduceTypesFromExpression('Assignment.phpt', '$a');

        $this->assertEquals(['\DateTime'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyIgnoresAssignmentsOutOfScope()
    {
        $output = $this->deduceTypesFromExpression('AssignmentOutOfScope.phpt', '$a');

        $this->assertEquals(['\DateTime'], $output);
    }

    /**
     * @return void
     */
    public function testDocblockTakesPrecedenceOverTypeHint()
    {
        $output = $this->deduceTypesFromExpression('DocblockPrecedence.phpt', '$b');

        $this->assertEquals(['\B'], $output);
    }

    /**
     * @return void
     */
    public function testVariadicTypesForParametersAreCorrectlyAnalyzed()
    {
        $output = $this->deduceTypesFromExpression('FunctionVariadicParameter.phpt', '$b');

        $this->assertEquals(['\A\B[]'], $output);
    }

    /**
     * @return void
     */
    public function testSpecialTypesForParametersResolveCorrectly()
    {
        $output = $this->deduceTypesFromExpression('FunctionParameterTypeHintSpecial.phpt', '$a');

        $this->assertEquals(['\A\C'], $output);

        $output = $this->deduceTypesFromExpression('FunctionParameterTypeHintSpecial.phpt', '$b');

        $this->assertEquals(['\A\C'], $output);

        $output = $this->deduceTypesFromExpression('FunctionParameterTypeHintSpecial.phpt', '$c');

        $this->assertEquals(['\A\C'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesStaticPropertyAccess()
    {
        $result = $this->deduceTypesFromExpression(
            'StaticPropertyAccess.phpt',
            'Bar::$testProperty'
        );

        $this->assertEquals(['\DateTime'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesSelf()
    {
        $result = $this->deduceTypesFromExpression(
            'Self.phpt',
            'self::$testProperty'
        );

        $this->assertEquals(['\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesStatic()
    {
        $result = $this->deduceTypesFromExpression(
            'Static.phpt',
            'static::$testProperty'
        );

        $this->assertEquals(['\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesParent()
    {
        $result = $this->deduceTypesFromExpression(
            'Parent.phpt',
            'parent::$testProperty'
        );

        $this->assertEquals(['\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesThis()
    {
        $result = $this->deduceTypesFromExpression(
            'This.phpt',
            '$this->testProperty'
        );

        $this->assertEquals(['\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesVariables()
    {
        $result = $this->deduceTypesFromExpression(
            'Variable.phpt',
            '$var->testProperty'
        );

        $this->assertEquals(['\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesGlobalFunctions()
    {
        $result = $this->deduceTypesFromExpression(
            'GlobalFunction.phpt',
            '\global_function()'
        );

        $this->assertEquals(['\B', 'null'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesGlobalConstants()
    {
        $result = $this->deduceTypesFromExpression(
            'GlobalConstant.phpt',
            '\GLOBAL_CONSTANT'
        );

        $this->assertEquals(['string'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesGlobalConstantsAssignedToOtherGlobalConstants()
    {
        $result = $this->deduceTypesFromExpression(
            'GlobalConstant.phpt',
            '\ANOTHER_GLOBAL_CONSTANT'
        );

        $this->assertEquals(['string'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesClosures()
    {
        $result = $this->deduceTypesFromExpression(
            'Closure.phpt',
            '$var'
        );

        $this->assertEquals(['\Closure'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOfElementsOfArrayWithObjects()
    {
        $output = $this->deduceTypesFromExpression('ArrayElementOfArrayWithObjects.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOfElementsOfString()
    {
        $output = $this->deduceTypesFromExpression('ArrayElementOfString.phpt', '$b');

        $this->assertEquals(['string'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOfElementsOfTypeNotAccessibleAsArray()
    {
        $output = $this->deduceTypesFromExpression('ArrayElementOfTypeNotAccessibleAsArray.phpt', '$b');

        $this->assertEquals(['mixed'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOfElementsOfArrayWithObjectsOfMultipleTypes()
    {
        $output = $this->deduceTypesFromExpression('ArrayElementOfArrayWithObjectsOfMultipleTypes.phpt', '$b');

        $this->assertEquals(['\A\B', '\A\C'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesTypeOfElementsOfArrayWithSelfElementsReturnedByStaticMethodCall()
    {
        $output = $this->deduceTypesFromExpression('ArrayElementOfArrayWithSelfElementsFromStaticMethodCall.phpt', '$b');

        $this->assertEquals(['\A\B'], $output);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesNewWithStatic()
    {
        $result = $this->deduceTypesFromExpression(
            'NewWithKeyword.phpt',
            'new static'
        );

        $this->assertEquals(['\Bar'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesNewWithSelf()
    {
        $result = $this->deduceTypesFromExpression(
            'NewWithKeyword.phpt',
            'new self'
        );

        $this->assertEquals(['\Bar'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesNewWithParent()
    {
        $result = $this->deduceTypesFromExpression(
            'NewWithKeyword.phpt',
            'new parent'
        );

        $this->assertEquals(['\Foo'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesClone()
    {
        $result = $this->deduceTypesFromExpression(
            'Clone.phpt',
            'clone $var'
        );

        $this->assertEquals(['\Bar'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesLongerChains()
    {
        $result = $this->deduceTypesFromExpression(
            'LongerChain.phpt',
            '$this->testProperty->aMethod()->anotherProperty'
        );

        $this->assertEquals(['\DateTime'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyAnalyzesScalarTypes()
    {
        $file = 'ScalarType.phpt';

        $this->assertEquals(['int'], $this->deduceTypesFromExpression($file, '5'));
        $this->assertEquals(['int'], $this->deduceTypesFromExpression($file, '05'));
        $this->assertEquals(['int'], $this->deduceTypesFromExpression($file, '0x5'));
        $this->assertEquals(['float'], $this->deduceTypesFromExpression($file, '5.5'));
        $this->assertEquals(['bool'], $this->deduceTypesFromExpression($file, 'true'));
        $this->assertEquals(['bool'], $this->deduceTypesFromExpression($file, 'false'));
        $this->assertEquals(['string'], $this->deduceTypesFromExpression($file, '"test"'));
        $this->assertEquals(['string'], $this->deduceTypesFromExpression($file, '\'test\''));
        $this->assertEquals(['array'], $this->deduceTypesFromExpression($file, '[$test1, function() {}]'));
        $this->assertEquals(['array'], $this->deduceTypesFromExpression($file, 'array($test1, function() {})'));

        $this->assertEquals(['string'], $this->deduceTypesFromExpression($file, '"
            test
        "'));

        $this->assertEquals(['string'], $this->deduceTypesFromExpression($file, '\'
            test
        \''));
    }

    /**
     * @return void
     */
    public function testCorrectlyProcessesSelfAssign()
    {
        $result = $this->deduceTypesFromExpression(
            'SelfAssign.phpt',
            '$foo1'
        );

        $this->assertEquals(['\A\Foo'], $result);

        $result = $this->deduceTypesFromExpression(
            'SelfAssign.phpt',
            '$foo2'
        );

        $this->assertEquals(['\A\Foo'], $result);

        $result = $this->deduceTypesFromExpression(
            'SelfAssign.phpt',
            '$foo3'
        );

        $this->assertEquals(['\A\Foo'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyProcessesStaticMethodCallAssignedToVariableWithFqcnWithLeadingSlash()
    {
        $result = $this->deduceTypesFromExpression(
            'StaticMethodCallFqcnLeadingSlash.phpt',
            '$data'
        );

        $this->assertEquals(['\A\B'], $result);
    }

    /**
     * @return void
     */
    public function testCorrectlyReturnsMultipleTypes()
    {
        $result = $this->deduceTypesFromExpression(
            'MultipleTypes.phpt',
            '$this->testProperty'
        );

        $this->assertEquals([
            'string',
            'int',
            '\Foo',
            '\Bar'
        ], $result);
    }
}
