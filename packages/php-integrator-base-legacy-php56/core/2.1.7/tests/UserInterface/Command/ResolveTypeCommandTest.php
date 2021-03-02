<?php

namespace PhpIntegrator\Tests\UserInterface\Command;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

use PhpIntegrator\UserInterface\Command\ResolveTypeCommand;

use PhpIntegrator\Tests\IndexedTest;

class ResolveTypeCommandTest extends IndexedTest
{
    /**
     *
     */
    public function testCorrectlyResolvesVariousTypes()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'ResolveType.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\C', $command->resolveType('C', $path, 1, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\A\C', $command->resolveType('C', $path, 5, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\B\C', $command->resolveType('C', $path, 10, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\B\DateTime', $command->resolveType('DateTime', $path, 10, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\DateTime', $command->resolveType('DateTime', $path, 11, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\DateTime', $command->resolveType('DateTime', $path, 12, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\C\D\Test', $command->resolveType('D\Test', $path, 13, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\DateTime', $command->resolveType('DateTime', $path, 18, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\DateTime', $command->resolveType('DateTime', $path, 18, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\A\SOME_CONSTANT', $command->resolveType('SOME_CONSTANT', $path, 20, UseStatementKind::TYPE_CONSTANT));
        $this->assertEquals('\A\some_function', $command->resolveType('some_function', $path, 20, UseStatementKind::TYPE_FUNCTION));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedConstantsWhenNotInNamespace()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedConstant.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\SOME_CONSTANT', $command->resolveType('SOME_CONSTANT', $path, 2, UseStatementKind::TYPE_CONSTANT));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedConstantsWhenInNamespaceAndNoConstantRelativeToTheNamespaceExists()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedConstant.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\SOME_ROOT_CONSTANT', $command->resolveType('SOME_ROOT_CONSTANT', $path, 6, UseStatementKind::TYPE_CONSTANT));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedConstantsWhenInNamespaceAndConstantRelativeToTheNamespaceExists()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedConstant.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\A\SOME_CONSTANT', $command->resolveType('SOME_CONSTANT', $path, 6, UseStatementKind::TYPE_CONSTANT));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedFunctionsWhenNotInNamespace()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedFunction.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\some_function', $command->resolveType('some_function', $path, 2, UseStatementKind::TYPE_FUNCTION));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedFunctionsWhenInNamespaceAndNoFunctionRelativeToTheNamespaceExists()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedFunction.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\some_root_function', $command->resolveType('some_root_function', $path, 6, UseStatementKind::TYPE_FUNCTION));
    }

    /**
     *
     */
    public function testCorrectlyResolvesUnqualifiedFunctionsWhenInNamespaceAndFunctionRelativeToTheNamespaceExists()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'UnqualifiedFunction.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\A\some_function', $command->resolveType('some_function', $path, 6, UseStatementKind::TYPE_FUNCTION));
    }

    /**
     *
     */
    public function testCorrectlyIgnoresMismatchedKinds()
    {
        $path = __DIR__ . '/ResolveTypeCommandTest/' . 'ResolveType.phpt';

        $container = $this->createTestContainer();

        $this->indexTestFile($container, $path);

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $this->assertEquals('\SOME_CONSTANT', $command->resolveType('SOME_CONSTANT', $path, 20, UseStatementKind::TYPE_CLASSLIKE));
        $this->assertEquals('\some_function', $command->resolveType('some_function', $path, 20, UseStatementKind::TYPE_CLASSLIKE));
    }

    /**
     * @expectedException \PhpIntegrator\UserInterface\Command\InvalidArgumentsException
     */
    public function testThrowsExceptionOnUnknownFile()
    {
        $container = $this->createTestContainer();

        $command = new ResolveTypeCommand(
            $container->get('indexDatabase'),
            $container->get('ProjectTypeResolverFactoryFacade')
        );

        $command->resolveType('\C', 'MissingFile.php', 1, UseStatementKind::TYPE_CLASSLIKE);
    }
}
