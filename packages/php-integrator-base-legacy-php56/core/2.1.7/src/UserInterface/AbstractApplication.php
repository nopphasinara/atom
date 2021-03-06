<?php

namespace PhpIntegrator\UserInterface;

use Doctrine\Common\Cache\ArrayCache;

use PhpIntegrator\Analysis\VariableScanner;
use PhpIntegrator\Analysis\DocblockAnalyzer;
use PhpIntegrator\Analysis\ClasslikeInfoBuilder;
use PhpIntegrator\Analysis\InvocationInfoRetriever;
use PhpIntegrator\Analysis\ClearableCacheInterface;
use PhpIntegrator\Analysis\ClearableCacheCollection;
use PhpIntegrator\Analysis\ClasslikeInfoBuilderProvider;
use PhpIntegrator\Analysis\CachingClasslikeExistanceChecker;
use PhpIntegrator\Analysis\CachingGlobalFunctionExistanceChecker;
use PhpIntegrator\Analysis\CachingGlobalConstantExistanceChecker;

use PhpIntegrator\Analysis\Conversion\MethodConverter;
use PhpIntegrator\Analysis\Conversion\FunctionConverter;
use PhpIntegrator\Analysis\Conversion\PropertyConverter;
use PhpIntegrator\Analysis\Conversion\ConstantConverter;
use PhpIntegrator\Analysis\Conversion\ClasslikeConverter;
use PhpIntegrator\Analysis\Conversion\ClasslikeConstantConverter;

use PhpIntegrator\Analysis\Relations\TraitUsageResolver;
use PhpIntegrator\Analysis\Relations\InheritanceResolver;
use PhpIntegrator\Analysis\Relations\InterfaceImplementationResolver;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;
use PhpIntegrator\Analysis\Typing\FileClassListProviderCachingDecorator;

use PhpIntegrator\Analysis\Typing\Deduction\NodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\LocalTypeScanner;
use PhpIntegrator\Analysis\Typing\Deduction\NewNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\SelfNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\NameNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\CatchNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\CloneNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ArrayNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\StringNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\StaticNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ParentNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\AssignNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\TernaryNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\LNumberNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\DNumberNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ClosureNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\VariableNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\FuncCallNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ClassLikeNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ConstFetchNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\MethodCallNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ExpressionLocalTypeAnalyzer;
use PhpIntegrator\Analysis\Typing\Deduction\ArrayDimFetchNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\PropertyFetchNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ClassConstFetchNodeTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ForeachNodeLoopValueTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\FunctionLikeParameterTypeDeducer;
use PhpIntegrator\Analysis\Typing\Deduction\ConfigurableDelegatingNodeTypeDeducer;

use PhpIntegrator\Analysis\Typing\Localization\TypeLocalizer;
use PhpIntegrator\Analysis\Typing\Localization\FileTypeLocalizerFactory;

use PhpIntegrator\Analysis\Typing\Resolving\TypeResolver;
use PhpIntegrator\Analysis\Typing\Resolving\DocblockTypeResolver;
use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactory;
use PhpIntegrator\Analysis\Typing\Resolving\ProjectTypeResolverFactory;
use PhpIntegrator\Analysis\Typing\Resolving\ProjectTypeResolverFactoryFacade;
use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactoryCachingDecorator;

use PhpIntegrator\Indexing\Indexer;
use PhpIntegrator\Indexing\FileIndexer;
use PhpIntegrator\Indexing\IndexDatabase;
use PhpIntegrator\Indexing\BuiltinIndexer;
use PhpIntegrator\Indexing\ProjectIndexer;
use PhpIntegrator\Indexing\CallbackStorageProxy;

use PhpIntegrator\Mediating\CacheClearingEventMediator;

use PhpIntegrator\Parsing\PartialParser;
use PhpIntegrator\Parsing\PrettyPrinter;
use PhpIntegrator\Parsing\DocblockParser;
use PhpIntegrator\Parsing\ParserTokenHelper;
use PhpIntegrator\Parsing\CachingParserProxy;
use PhpIntegrator\Parsing\LastExpressionParser;

use PhpIntegrator\Utility\SourceCodeStreamReader;

use PhpParser\Lexer;
use PhpParser\Parser;
use PhpParser\ParserFactory;

use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Main application class.
 */
abstract class AbstractApplication
{
    /**
     * @var ContainerBuilder
     */
    protected $container;

    /**
     * The path to the database to use.
     *
     * @var string
     */
    protected $databaseFile;

    /**
     * @return ContainerBuilder
     */
    protected function getContainer()
    {
        if (!$this->container) {
            $this->container = $this->createContainer();
        }

        return $this->container;
    }

    /**
     * @return ContainerBuilder
     */
    protected function createContainer()
    {
        $container = new ContainerBuilder();

        $this->registerServices($container);

        return $container;
    }

    /**
     * @param ContainerBuilder $container
     */
    protected function registerServices(ContainerBuilder $container)
    {
        $container
            ->register('application', AbstractApplication::class)
            ->setSynthetic(true);

        $container->set('application', $this);

        $container
            ->register('lexer', Lexer::class)
            ->addArgument([
                'usedAttributes' => [
                    'comments', 'startLine', 'endLine', 'startFilePos', 'endFilePos'
                ]
            ]);

        $container
            ->register('parser.phpParserFactory', ParserFactory::class);

        $container
            ->register('parser.phpParser', Parser::class)
            ->setFactory([new Reference('parser.phpParserFactory'), 'create'])
            ->setArguments([ParserFactory::PREFER_PHP7, new Reference('lexer')]);

        $container
            ->register('parser.cachingParserProxy', CachingParserProxy::class)
            ->addArgument(new Reference('parser.phpParser'));

        $container->setAlias('parser', 'parser.cachingParserProxy');

        $container
            ->register('cache', ArrayCache::class);

        $container
            ->register('variableScanner', VariableScanner::class);

        $container
            ->register('typeAnalyzer', TypeAnalyzer::class);

        $container
            ->register('typeResolver.backend', TypeResolver::class)
            ->setArguments([new Reference('typeAnalyzer')]);

        $container
            ->register('typeResolver.docblock', DocblockTypeResolver::class)
            ->setArguments([new Reference('typeResolver.backend'), new Reference('typeAnalyzer')]);

        $container->setAlias('typeResolver', 'typeResolver.docblock');

        $container
            ->register('typeLocalizer', TypeLocalizer::class)
            ->setArguments([new Reference('typeAnalyzer')]);

        $container
            ->register('prettyPrinter', PrettyPrinter::class);

        $container
            ->register('partialParser', PartialParser::class)
            ->setArguments([new Reference('parser.phpParserFactory')]);

        $container
            ->register('parserTokenHelper', ParserTokenHelper::class);

        $container
            ->register('lastExpressionParser', LastExpressionParser::class)
            ->setArguments([
                new Reference('partialParser'),
                new Reference('parserTokenHelper')
            ]);

        $container
            ->register('invocationInfoRetriever', InvocationInfoRetriever::class)
            ->setArguments([
                new Reference('lastExpressionParser'),
                new Reference('parserTokenHelper'),
                new Reference('prettyPrinter')
            ]);

        $container
            ->register('sourceCodeStreamReader', SourceCodeStreamReader::class)
            ->setArguments([$this->getStdinStream()]);

        $container
            ->register('docblockParser', DocblockParser::class);

        $container
            ->register('docblockAnalyzer', DocblockAnalyzer::class);

        $container
            ->register('constantConverter', ConstantConverter::class);

        $container
            ->register('classlikeConstantConverter', ClasslikeConstantConverter::class);

        $container
            ->register('propertyConverter', PropertyConverter::class);

        $container
            ->register('classlikeConverter', ClasslikeConverter::class);

        $container
            ->register('functionConverter', FunctionConverter::class);

        $container
            ->register('methodConverter', MethodConverter::class);

        $container
            ->setAlias('fileClassListProvider.instance', 'classListCommand');

        $container
            ->register('fileClassListProvider.cachingDecorator', FileClassListProviderCachingDecorator::class)
            ->setArguments([new Reference('fileClassListProvider.instance')]);

        $container
            ->setAlias('fileClassListProvider', 'fileClassListProvider.cachingDecorator');

        $container
            ->register('fileTypeResolverFactory.instance', FileTypeResolverFactory::class)
            ->setArguments([new Reference('typeResolver'), new Reference('indexDatabase')]);

        $container
            ->register('fileTypeResolverFactory.cachingDecorator', FileTypeResolverFactoryCachingDecorator::class)
            ->setArguments([new Reference('fileTypeResolverFactory.instance')]);

        $container
            ->setAlias('fileTypeResolverFactory', 'fileTypeResolverFactory.cachingDecorator');

        $container
            ->register('projectTypeResolverFactory', ProjectTypeResolverFactory::class)
            ->setArguments([
                new Reference('globalConstantExistanceChecker'),
                new Reference('globalFunctionExistanceChecker'),
                new Reference('indexDatabase')
            ]);

        $container
            ->register('projectTypeResolverFactoryFacade', ProjectTypeResolverFactoryFacade::class)
            ->setArguments([
                new Reference('projectTypeResolverFactory'),
                new Reference('fileTypeResolverFactory')
            ]);

        $container
            ->register('fileTypeLocalizerFactory', FileTypeLocalizerFactory::class)
            ->setArguments([new Reference('typeLocalizer'), new Reference('indexDatabase')]);

        $container
            ->register('inheritanceResolver', InheritanceResolver::class)
            ->setArguments([new Reference('docblockAnalyzer'), new Reference('typeAnalyzer')]);

        $container
            ->register('interfaceImplementationResolver', InterfaceImplementationResolver::class)
            ->setArguments([new Reference('docblockAnalyzer'), new Reference('typeAnalyzer')]);

        $container
            ->register('traitUsageResolver', TraitUsageResolver::class)
            ->setArguments([new Reference('docblockAnalyzer'), new Reference('typeAnalyzer')]);

        $container
            ->register('indexDatabase', IndexDatabase::class);

        $container
            ->setAlias('classlikeInfoBuilderProvider.backend', 'indexDatabase');

        $container
            ->register('classlikeInfoBuilderProvider.instance', ClasslikeInfoBuilderProvider::class)
            ->setArguments([new Reference('classlikeInfoBuilderProvider.backend')]);

        $container
            ->register('classlikeInfoBuilderProvider.cachingProxy', ClasslikeInfoBuilderProviderCachingProxy::class)
            ->setArguments([new Reference('classlikeInfoBuilderProvider.instance'), new Reference('cache')]);

        $container
            ->setAlias('classlikeInfoBuilderProvider', 'classlikeInfoBuilderProvider.cachingProxy');

        $container
            ->register('classlikeExistanceChecker', CachingClasslikeExistanceChecker::class)
            ->setArguments([new Reference('indexDatabase')]);

        $container
            ->register('globalFunctionExistanceChecker', CachingGlobalFunctionExistanceChecker::class)
            ->setArguments([new Reference('indexDatabase')]);

        $container
            ->register('globalConstantExistanceChecker', CachingGlobalConstantExistanceChecker::class)
            ->setArguments([new Reference('indexDatabase')]);

        $container
            ->register('cacheClearingEventMediator.clearableCache', ClearableCacheCollection::class)
            ->setArguments([[
                new Reference('classlikeExistanceChecker'),
                new Reference('globalFunctionExistanceChecker'),
                new Reference('globalConstantExistanceChecker'),
                new Reference('fileTypeResolverFactory.cachingDecorator'),
                new Reference('fileClassListProvider.cachingDecorator')
            ]]);

        $container
            ->register('cacheClearingEventMediator', CacheClearingEventMediator::class)
            ->setArguments([
                new Reference('cacheClearingEventMediator.clearableCache'),
                new Reference('indexer'),
                Indexer::INDEXING_SUCCEEDED_EVENT
            ]);

        $container
            ->register('storageForIndexers', CallbackStorageProxy::class)
            ->setArguments([new Reference('indexDatabase'), function ($fqcn) use ($container) {
                $provider = $container->get('classlikeInfoBuilderProvider');

                if ($provider instanceof ClasslikeInfoBuilderProviderCachingProxy) {
                    $provider->clearCacheFor($fqcn);
                }
            }]);

        $container
            ->register('classlikeInfoBuilder', ClasslikeInfoBuilder::class)
            ->setArguments([
                new Reference('constantConverter'),
                new Reference('classlikeConstantConverter'),
                new Reference('propertyConverter'),
                new Reference('functionConverter'),
                new Reference('methodConverter'),
                new Reference('classlikeConverter'),
                new Reference('inheritanceResolver'),
                new Reference('interfaceImplementationResolver'),
                new Reference('traitUsageResolver'),
                new Reference('classlikeInfoBuilderProvider'),
                new Reference('typeAnalyzer')
            ]);

        $container
            ->register('builtinIndexer', BuiltinIndexer::class)
            ->setArguments([
                new Reference('indexDatabase'),
                new Reference('typeAnalyzer'),
                new Reference('partialParser'),
                new Reference('nodeTypeDeducer')
            ]);

        $container
            ->register('fileIndexer', FileIndexer::class)
            ->setArguments([
                new Reference('storageForIndexers'),
                new Reference('typeAnalyzer'),
                new Reference('typeResolver'),
                new Reference('docblockParser'),
                new Reference('partialParser'),
                new Reference('nodeTypeDeducer'),
                new Reference('parser')
            ]);

        $container
            ->register('projectIndexer', ProjectIndexer::class)
            ->setArguments([
                new Reference('storageForIndexers'),
                new Reference('fileIndexer'),
                new Reference('sourceCodeStreamReader')
            ]);

        $container
            ->register('indexer', Indexer::class)
            ->setArguments([
                new Reference('projectIndexer'),
                new Reference('sourceCodeStreamReader')
            ]);

        $this->registerTypeDeductionServices($container);
        $this->registerCommandServices($container);
    }

    /**
     * @param ContainerBuilder $container
     */
    protected function registerTypeDeductionServices(ContainerBuilder $container)
    {
        $container
            ->register('expressionLocalTypeAnalyzer', ExpressionLocalTypeAnalyzer::class)
            ->setArguments([
                new Reference('parser'),
                new Reference('docblockParser'),
                new Reference('prettyPrinter')
            ]);

        $container
            ->register('localTypeScanner', LocalTypeScanner::class)
            ->setArguments([
                new Reference('docblockParser'),
                new Reference('fileTypeResolverFactory'),
                new Reference('typeAnalyzer'),
                new Reference('nodeTypeDeducer'),
                new Reference('foreachNodeLoopValueTypeDeducer'),
                new Reference('functionLikeParameterTypeDeducer'),
                new Reference('expressionLocalTypeAnalyzer')
            ]);

        $container
            ->register('variableNodeTypeDeducer', VariableNodeTypeDeducer::class)
            ->setArguments([
                new Reference('localTypeScanner')
            ]);

        $container
            ->register('lNumberNodeTypeDeducer', LNumberNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('dNumberNodeTypeDeducer', DNumberNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('stringNodeTypeDeducer', StringNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('constFetchNodeTypeDeducer', ConstFetchNodeTypeDeducer::class)
            ->setArguments([
                new Reference('fileTypeResolverFactory'),
                new Reference('indexDatabase'),
                new Reference('constantConverter')
            ]);

        $container
            ->register('arrayDimFetchNodeTypeDeducer', ArrayDimFetchNodeTypeDeducer::class)
            ->setArguments([new Reference('typeAnalyzer'), new Reference('nodeTypeDeducer')]);

        $container
            ->register('closureNodeTypeDeducer', ClosureNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('newNodeTypeDeducer', NewNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('cloneNodeTypeDeducer', CloneNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('arrayNodeTypeDeducer', ArrayNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('selfNodeTypeDeducer', SelfNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('staticNodeTypeDeducer', StaticNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('parentNodeTypeDeducer', ParentNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('nameNodeTypeDeducer', NameNodeTypeDeducer::class)
            ->setArguments([
                new Reference('typeAnalyzer'),
                new Reference('classlikeInfoBuilder'),
                new Reference('fileClassListProvider'),
                new Reference('fileTypeResolverFactory')
            ]);

        $container
            ->register('funcCallNodeTypeDeducer', FuncCallNodeTypeDeducer::class)
            ->setArguments([new Reference('indexDatabase'), new Reference('functionConverter')]);

        $container
            ->register('methodCallNodeTypeDeducer', MethodCallNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer'), new Reference('classlikeInfoBuilder')]);

        $container
            ->register('propertyFetchNodeTypeDeducer', PropertyFetchNodeTypeDeducer::class)
            ->setArguments([
                new Reference('localTypeScanner'),
                new Reference('nodeTypeDeducer'),
                new Reference('prettyPrinter'),
                new Reference('classlikeInfoBuilder')
            ]);

        $container
            ->register('classConstFetchNodeTypeDeducer', ClassConstFetchNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer'), new Reference('classlikeInfoBuilder')]);

        $container
            ->register('assignNodeTypeDeducer', AssignNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('ternaryNodeTypeDeducer', TernaryNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('classLikeNodeTypeDeducer', ClassLikeNodeTypeDeducer::class)
            ->setArguments([]);

        $container
            ->register('catchNodeTypeDeducer', CatchNodeTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer')]);

        $container
            ->register('foreachNodeLoopValueTypeDeducer', ForeachNodeLoopValueTypeDeducer::class)
            ->setArguments([new Reference('nodeTypeDeducer'), new Reference('typeAnalyzer')]);

        $container
            ->register('functionLikeParameterTypeDeducer', FunctionLikeParameterTypeDeducer::class)
            ->setArguments([
                new Reference('nodeTypeDeducer'),
                new Reference('typeAnalyzer'),
                new Reference('docblockParser')
            ]);

        $container
            ->register('nodeTypeDeducer.instance', NodeTypeDeducer::class)
            ->setArguments([
                new Reference('variableNodeTypeDeducer'),
                new Reference('lNumberNodeTypeDeducer'),
                new Reference('dNumberNodeTypeDeducer'),
                new Reference('stringNodeTypeDeducer'),
                new Reference('constFetchNodeTypeDeducer'),
                new Reference('arrayDimFetchNodeTypeDeducer'),
                new Reference('closureNodeTypeDeducer'),
                new Reference('newNodeTypeDeducer'),
                new Reference('cloneNodeTypeDeducer'),
                new Reference('arrayNodeTypeDeducer'),
                new Reference('selfNodeTypeDeducer'),
                new Reference('staticNodeTypeDeducer'),
                new Reference('parentNodeTypeDeducer'),
                new Reference('nameNodeTypeDeducer'),
                new Reference('funcCallNodeTypeDeducer'),
                new Reference('methodCallNodeTypeDeducer'),
                new Reference('propertyFetchNodeTypeDeducer'),
                new Reference('classConstFetchNodeTypeDeducer'),
                new Reference('assignNodeTypeDeducer'),
                new Reference('ternaryNodeTypeDeducer'),
                new Reference('classLikeNodeTypeDeducer'),
                new Reference('catchNodeTypeDeducer')
            ]);

        $container
            ->register('nodeTypeDeducer.configurableDelegator', ConfigurableDelegatingNodeTypeDeducer::class)
            ->setArguments([])
            ->setConfigurator(function (ConfigurableDelegatingNodeTypeDeducer $configurableDelegatingNodeTypeDeducer) use ($container) {
                // Avoid circular references due to two-way object usage.
                $configurableDelegatingNodeTypeDeducer->setNodeTypeDeducer($container->get('nodeTypeDeducer.instance'));
            });

        $container
            ->setAlias('nodeTypeDeducer', 'nodeTypeDeducer.configurableDelegator');
    }

    /**
     * @param ContainerBuilder $container
     */
    protected function registerCommandServices(ContainerBuilder $container)
    {
        $container
            ->register('initializeCommand', Command\InitializeCommand::class)
            ->setArguments([
                new Reference('indexDatabase'),
                new Reference('builtinIndexer'),
                new Reference('projectIndexer'),
                new Reference('cache')
            ]);

        $container
            ->register('reindexCommand', Command\ReindexCommand::class)
            ->setArguments([
                new Reference('indexer')
            ]);

        $container
            ->register('vacuumCommand', Command\VacuumCommand::class)
            ->setArguments([new Reference('projectIndexer')]);

        $container
            ->register('testCommand', Command\TestCommand::class)
            ->setArguments([new Reference('indexDatabase')]);

        $container
            ->register('classListCommand', Command\ClassListCommand::class)
            ->setArguments([
                new Reference('constantConverter'),
                new Reference('classlikeConstantConverter'),
                new Reference('propertyConverter'),
                new Reference('functionConverter'),
                new Reference('methodConverter'),
                new Reference('classlikeConverter'),
                new Reference('inheritanceResolver'),
                new Reference('interfaceImplementationResolver'),
                new Reference('traitUsageResolver'),
                new Reference('classlikeInfoBuilderProvider'),
                new Reference('typeAnalyzer'),
                new Reference('indexDatabase')
            ]);

        $container
            ->register('classInfoCommand', Command\ClassInfoCommand::class)
            ->setArguments([new Reference('typeAnalyzer'), new Reference('classlikeInfoBuilder')]);

        $container
            ->register('globalFunctionsCommand', Command\GlobalFunctionsCommand::class)
            ->setArguments([new Reference('functionConverter'), new Reference('indexDatabase')]);

        $container
            ->register('globalConstantsCommand', Command\GlobalConstantsCommand::class)
            ->setArguments([new Reference('constantConverter'), new Reference('indexDatabase')]);

        $container
            ->register('resolveTypeCommand', Command\ResolveTypeCommand::class)
            ->setArguments([new Reference('indexDatabase'), new Reference('ProjectTypeResolverFactoryFacade')]);

        $container
            ->register('localizeTypeCommand', Command\LocalizeTypeCommand::class)
            ->setArguments([new Reference('indexDatabase'), new Reference('fileTypeLocalizerFactory')]);

        $container
            ->register('semanticLintCommand', Command\SemanticLintCommand::class)
            ->setArguments([
                new Reference('sourceCodeStreamReader'),
                new Reference('parser'),
                new Reference('fileTypeResolverFactory'),
                new Reference('nodeTypeDeducer'),
                new Reference('classlikeInfoBuilder'),
                new Reference('docblockParser'),
                new Reference('typeAnalyzer'),
                new Reference('docblockAnalyzer'),
                new Reference('classlikeExistanceChecker'),
                new Reference('globalConstantExistanceChecker'),
                new Reference('globalFunctionExistanceChecker')
            ]);

        $container
            ->register('availableVariablesCommand', Command\AvailableVariablesCommand::class)
            ->setArguments([
                new Reference('variableScanner'),
                new Reference('parser'),
                new Reference('sourceCodeStreamReader')
            ]);

        $container
            ->register('deduceTypesCommand', Command\DeduceTypesCommand::class)
            ->setArguments([
                    new Reference('nodeTypeDeducer'),
                    new Reference('lastExpressionParser'),
                    new Reference('sourceCodeStreamReader')
                ]);

        $container
            ->register('invocationInfoCommand', Command\InvocationInfoCommand::class)
            ->setArguments([new Reference('invocationInfoRetriever'), new Reference('sourceCodeStreamReader')]);

        $container
            ->register('namespaceListCommand', Command\NamespaceListCommand::class)
            ->setArguments([new Reference('indexDatabase')]);
    }

    /**
     * @return mixed
     */
    abstract public function run();

    /**
     * @return resource|null
     */
    abstract public function getStdinStream();

    /**
     * @param string $databaseFile
     *
     * @return static
     */
    public function setDatabaseFile($databaseFile)
    {
        /** @var IndexDatabase $indexDatabase */
        $indexDatabase = $this->getContainer()->get('indexDatabase');

        if ($indexDatabase->getDatabasePath() !== $databaseFile) {
            $indexDatabase->setDatabasePath($databaseFile);

            /** @var ClearableCacheInterface $clearableCache */
            $clearableCache = $this->getContainer()->get('cacheClearingEventMediator.clearableCache');
            $clearableCache->clearCache();
        }

        return $this;
    }
}
