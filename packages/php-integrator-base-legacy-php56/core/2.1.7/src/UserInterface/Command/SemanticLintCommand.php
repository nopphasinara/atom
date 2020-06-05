<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Analysis\Linting;
use PhpIntegrator\Analysis\DocblockAnalyzer;
use PhpIntegrator\Analysis\ClasslikeInfoBuilder;
use PhpIntegrator\Analysis\ClasslikeExistanceChecker;
use PhpIntegrator\Analysis\GlobalConstantExistanceChecker;
use PhpIntegrator\Analysis\GlobalFunctionExistanceChecker;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;
use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactoryInterface;

use PhpIntegrator\Analysis\Typing\Deduction\NodeTypeDeducerInterface;

use PhpIntegrator\Parsing\DocblockParser;

use PhpIntegrator\Utility\SourceCodeStreamReader;

use PhpParser\Error;
use PhpParser\Parser;
use PhpParser\ErrorHandler;
use PhpParser\NodeTraverser;

/**
 * Command that lints a file's semantics (i.e. it does not deal with syntax errors, as this is already handled by the
 * indexer).
 */
class SemanticLintCommand extends AbstractCommand
{
    /**
     * @var SourceCodeStreamReader
     */
    protected $sourceCodeStreamReader;

    /**
     * @var Parser
     */
    protected $parser;

    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @var NodeTypeDeducerInterface
     */
    protected $nodeTypeDeducer;

    /**
     * @var ClasslikeInfoBuilder
     */
    protected $classlikeInfoBuilder;

    /**
     * @var DocblockParser
     */
    protected $docblockParser;

    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @var DocblockAnalyzer
     */
    protected $docblockAnalyzer;

    /**
     * @var ClasslikeExistanceChecker
     */
    protected $classlikeExistanceChecker;

    /**
     * @var GlobalConstantExistanceChecker
     */
    protected $globalConstantExistanceChecker;

    /**
     * @var GlobalFunctionExistanceChecker
     */
    protected $globalFunctionExistanceChecker;

    /**
     * @param SourceCodeStreamReader           $sourceCodeStreamReader
     * @param Parser                           $parser
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     * @param NodeTypeDeducerInterface         $nodeTypeDeducer
     * @param ClasslikeInfoBuilder             $classlikeInfoBuilder
     * @param DocblockParser                   $docblockParser
     * @param TypeAnalyzer                     $typeAnalyzer
     * @param DocblockAnalyzer                 $docblockAnalyzer
     * @param ClasslikeExistanceChecker        $classlikeExistanceChecker
     * @param GlobalConstantExistanceChecker   $globalConstantExistanceChecker
     * @param GlobalFunctionExistanceChecker   $globalFunctionExistanceChecker
     */
    public function __construct(
        SourceCodeStreamReader $sourceCodeStreamReader,
        Parser $parser,
        FileTypeResolverFactoryInterface $fileTypeResolverFactory,
        NodeTypeDeducerInterface $nodeTypeDeducer,
        ClasslikeInfoBuilder $classlikeInfoBuilder,
        DocblockParser $docblockParser,
        TypeAnalyzer $typeAnalyzer,
        DocblockAnalyzer $docblockAnalyzer,
        ClasslikeExistanceChecker $classlikeExistanceChecker,
        GlobalConstantExistanceChecker $globalConstantExistanceChecker,
        GlobalFunctionExistanceChecker $globalFunctionExistanceChecker
    ) {
        $this->sourceCodeStreamReader = $sourceCodeStreamReader;
        $this->parser = $parser;
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
        $this->nodeTypeDeducer = $nodeTypeDeducer;
        $this->classlikeInfoBuilder = $classlikeInfoBuilder;
        $this->docblockParser = $docblockParser;
        $this->typeAnalyzer = $typeAnalyzer;
        $this->docblockAnalyzer = $docblockAnalyzer;
        $this->classlikeExistanceChecker = $classlikeExistanceChecker;
        $this->globalConstantExistanceChecker = $globalConstantExistanceChecker;
        $this->globalFunctionExistanceChecker = $globalFunctionExistanceChecker;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        if (!isset($arguments['file'])) {
            throw new InvalidArgumentsException('A file name is required for this command.');
        }

        $code = null;

        if (isset($arguments['stdin']) && $arguments['stdin']) {
            $code = $this->sourceCodeStreamReader->getSourceCodeFromStdin();
        } else {
            $code = $this->sourceCodeStreamReader->getSourceCodeFromFile($arguments['file']);
        }

        $output = $this->semanticLint(
            $arguments['file'],
            $code,
            !(isset($arguments['no-unknown-classes']) && $arguments['no-unknown-classes']),
            !(isset($arguments['no-unknown-members']) && $arguments['no-unknown-members']),
            !(isset($arguments['no-unknown-global-functions']) && $arguments['no-unknown-global-functions']),
            !(isset($arguments['no-unknown-global-constants']) && $arguments['no-unknown-global-constants']),
            !(isset($arguments['no-docblock-correctness']) && $arguments['no-docblock-correctness']),
            !(isset($arguments['no-unused-use-statements']) && $arguments['no-unused-use-statements'])
        );

        return $output;
    }

    /**
     * @param string $file
     * @param string $code
     * @param bool   $retrieveUnknownClasses
     * @param bool   $retrieveUnknownMembers
     * @param bool   $retrieveUnknownGlobalFunctions
     * @param bool   $retrieveUnknownGlobalConstants
     * @param bool   $analyzeDocblockCorrectness
     * @param bool   $retrieveUnusedUseStatements
     *
     * @return array
     */
    public function semanticLint(
        $file,
        $code,
        $retrieveUnknownClasses = true,
        $retrieveUnknownMembers = true,
        $retrieveUnknownGlobalFunctions = true,
        $retrieveUnknownGlobalConstants = true,
        $analyzeDocblockCorrectness = true,
        $retrieveUnusedUseStatements = true
    ) {
        // Parse the file to fetch the information we need.
        $nodes = [];
        $parser = $this->parser;

        $handler = new ErrorHandler\Collecting();

        $nodes = $parser->parse($code, $handler);

        $output = [
            'errors'   => [
                'syntaxErrors' => []
            ],

            'warnings' => []
        ];

        foreach ($handler->getErrors() as $e) {
            $output['errors']['syntaxErrors'][] = [
                'startLine'   => $e->getStartLine() >= 0 ? $e->getStartLine() : null,
                'endLine'     => $e->getEndLine() >= 0 ? $e->getEndLine() : null,
                'startColumn' => $e->hasColumnInfo() ? $e->getStartColumn($code) : null,
                'endColumn'   => $e->hasColumnInfo() ? $e->getEndColumn($code) : null,
                'message'     => $e->getMessage()
            ];
        }

        if ($nodes !== null) {
            $traverser = new NodeTraverser(false);

            $unknownClassAnalyzer = null;

            if ($retrieveUnknownClasses) {
                $fileTypeResolver = $this->fileTypeResolverFactory->create($file);

                $unknownClassAnalyzer = new Linting\UnknownClassAnalyzer(
                    $this->classlikeExistanceChecker,
                    $fileTypeResolver,
                    $this->typeAnalyzer,
                    $this->docblockParser
                );

                foreach ($unknownClassAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            $unknownMemberAnalyzer = null;

            if ($retrieveUnknownMembers) {
                $unknownMemberAnalyzer = new Linting\UnknownMemberAnalyzer(
                    $this->nodeTypeDeducer,
                    $this->classlikeInfoBuilder,
                    $this->typeAnalyzer,
                    $file,
                    $code
                );

                foreach ($unknownMemberAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            $unusedUseStatementAnalyzer = null;

            if ($retrieveUnusedUseStatements) {
                $unusedUseStatementAnalyzer = new Linting\UnusedUseStatementAnalyzer(
                    $this->typeAnalyzer,
                    $this->docblockParser
                );

                foreach ($unusedUseStatementAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            $docblockCorrectnessAnalyzer = null;

            if ($analyzeDocblockCorrectness) {
                $docblockCorrectnessAnalyzer = new Linting\DocblockCorrectnessAnalyzer(
                    $code,
                    $this->classlikeInfoBuilder,
                    $this->docblockParser,
                    $this->typeAnalyzer,
                    $this->docblockAnalyzer
                );

                foreach ($docblockCorrectnessAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            $unknownGlobalConstantAnalyzer = null;

            if ($retrieveUnknownGlobalFunctions) {
                $unknownGlobalConstantAnalyzer = new Linting\UnknownGlobalConstantAnalyzer(
                    $this->globalConstantExistanceChecker
                );

                foreach ($unknownGlobalConstantAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            $unknownGlobalFunctionAnalyzer = null;

            if ($retrieveUnknownGlobalFunctions) {
                $unknownGlobalFunctionAnalyzer = new Linting\UnknownGlobalFunctionAnalyzer(
                    $this->globalFunctionExistanceChecker
                );

                foreach ($unknownGlobalFunctionAnalyzer->getVisitors() as $visitor) {
                    $traverser->addVisitor($visitor);
                }
            }

            try {
                $traverser->traverse($nodes);
            } catch (Error $e) {
                $output['errors']['syntaxErrors'][] = [
                    'startLine'   => 0,
                    'endLine'     => 0,
                    'startColumn' => 0,
                    'endColumn'   => 0,
                    'message'     => "Something is semantically wrong. Is there perhaps a duplicate use statement?"
                ];

                return $output;
            }

            if ($unknownClassAnalyzer) {
                $output['errors']['unknownClasses'] = $unknownClassAnalyzer->getOutput();
            }

            if ($unknownMemberAnalyzer) {
                $analyzerOutput = $unknownMemberAnalyzer->getOutput();

                $output['errors']['unknownMembers']   = $analyzerOutput['errors'];
                $output['warnings']['unknownMembers'] = $analyzerOutput['warnings'];
            }

            if ($unknownGlobalFunctionAnalyzer) {
                $output['errors']['unknownGlobalFunctions'] = $unknownGlobalFunctionAnalyzer->getOutput();
            }

            if ($unknownGlobalConstantAnalyzer) {
                $output['errors']['unknownGlobalConstants'] = $unknownGlobalConstantAnalyzer->getOutput();
            }

            if ($docblockCorrectnessAnalyzer) {
                $output['warnings']['docblockIssues'] = $docblockCorrectnessAnalyzer->getOutput();
            }

            if ($unusedUseStatementAnalyzer) {
                $output['warnings']['unusedUseStatements'] = $unusedUseStatementAnalyzer->getOutput();
            }
        }

        return $output;
    }
}
