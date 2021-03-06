<?php

namespace PhpIntegrator\Analysis\Linting;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;
use PhpIntegrator\Analysis\Visiting\ClassUsageFetchingVisitor;
use PhpIntegrator\Analysis\Visiting\UseStatementFetchingVisitor;
use PhpIntegrator\Analysis\Visiting\DocblockClassUsageFetchingVisitor;
use PhpIntegrator\Analysis\Visiting\GlobalFunctionUsageFetchingVisitor;
use PhpIntegrator\Analysis\Visiting\GlobalConstantUsageFetchingVisitor;

use PhpIntegrator\Parsing\DocblockParser;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

/**
 * Looks for unused use statements.
 */
class UnusedUseStatementAnalyzer implements AnalyzerInterface
{
    /**
     * @var ClassUsageFetchingVisitor
     */
    protected $classUsageFetchingVisitor;

    /**
     * @var UseStatementFetchingVisitor
     */
    protected $useStatementFetchingVisitor;

    /**
     * @var GlobalConstantUsageFetchingVisitor
     */
    protected $globalConstantUsageFetchingVisitor;

    /**
     * @var GlobalFunctionUsageFetchingVisitor
     */
    protected $globalFunctionUsageFetchingVisitor;

    /**
     * @var DocblockClassUsageFetchingVisitor
     */
    protected $docblockClassUsageFetchingVisitor;

    /**
     * Constructor.
     *
     * @param TypeAnalyzer   $typeAnalyzer
     * @param DocblockParser $docblockParser
     */
    public function __construct(TypeAnalyzer $typeAnalyzer, DocblockParser $docblockParser)
    {
        $this->classUsageFetchingVisitor = new ClassUsageFetchingVisitor($typeAnalyzer);
        $this->useStatementFetchingVisitor = new UseStatementFetchingVisitor();
        $this->globalConstantUsageFetchingVisitor = new GlobalConstantUsageFetchingVisitor();
        $this->globalFunctionUsageFetchingVisitor = new GlobalFunctionUsageFetchingVisitor();
        $this->docblockClassUsageFetchingVisitor = new DocblockClassUsageFetchingVisitor($typeAnalyzer, $docblockParser);
    }

    /**
     * @inheritDoc
     */
    public function getVisitors()
    {
        return [
            $this->classUsageFetchingVisitor,
            $this->useStatementFetchingVisitor,
            $this->docblockClassUsageFetchingVisitor,
            $this->globalConstantUsageFetchingVisitor,
            $this->globalFunctionUsageFetchingVisitor
        ];
    }

    /**
     * @inheritDoc
     */
    public function getOutput()
    {
        $unusedUseStatements = array_merge(
            $this->getOutputForClasses(),
            $this->getOutputForConstants(),
            $this->getOutputForFunctions()
        );

        return $unusedUseStatements;
    }

    /**
     * @return array
     */
    protected function getOutputForClasses()
    {
        // Cross-reference the found class names against the class map.
        $namespaces = $this->useStatementFetchingVisitor->getNamespaces();

        $classUsages = array_merge(
            $this->classUsageFetchingVisitor->getClassUsageList(),
            $this->docblockClassUsageFetchingVisitor->getClassUsageList()
        );

        foreach ($classUsages as $classUsage) {
            $relevantAlias = $classUsage['firstPart'];

            if (!$classUsage['isFullyQualified'] &&
                isset($namespaces[$classUsage['namespace']]['useStatements'][$relevantAlias]) &&
                $namespaces[$classUsage['namespace']]['useStatements'][$relevantAlias]['kind'] === UseStatementKind::TYPE_CLASSLIKE
            ) {
                // Mark the accompanying used statement, if any, as used.
                $namespaces[$classUsage['namespace']]['useStatements'][$relevantAlias]['used'] = true;
            }
        }

        $unusedUseStatements = [];

        foreach ($namespaces as $namespace => $namespaceData) {
            $useStatementMap = $namespaceData['useStatements'];

            foreach ($useStatementMap as $alias => $data) {
                if (
                    (!array_key_exists('used', $data) || !$data['used']) &&
                    $data['kind'] === UseStatementKind::TYPE_CLASSLIKE
                ) {
                    unset($data['line'], $data['kind']);

                    $unusedUseStatements[] = $data;
                }
            }
        }

        return $unusedUseStatements;
    }

    /**
     * @return array
     */
    protected function getOutputForConstants()
    {
        $unknownClasses = [];
        $namespaces = $this->useStatementFetchingVisitor->getNamespaces();

        $constantUsages = $this->globalConstantUsageFetchingVisitor->getGlobalConstantList();

        foreach ($constantUsages as $constantUsage) {
            $relevantAlias = $constantUsage['localNameFirstPart'];

            if (!$constantUsage['isFullyQualified'] &&
                isset($namespaces[$constantUsage['namespace']]['useStatements'][$relevantAlias]) &&
                $namespaces[$constantUsage['namespace']]['useStatements'][$relevantAlias]['kind'] === UseStatementKind::TYPE_CONSTANT
            ) {
                // Mark the accompanying used statement, if any, as used.
                $namespaces[$constantUsage['namespace']]['useStatements'][$relevantAlias]['used'] = true;
            }
        }

        $unusedUseStatements = [];

        foreach ($namespaces as $namespace => $namespaceData) {
            $useStatementMap = $namespaceData['useStatements'];

            foreach ($useStatementMap as $alias => $data) {
                if (
                    (!array_key_exists('used', $data) || !$data['used']) &&
                    $data['kind'] === UseStatementKind::TYPE_CONSTANT
                ) {
                    unset($data['line'], $data['kind']);

                    $unusedUseStatements[] = $data;
                }
            }
        }

        return $unusedUseStatements;
    }

    /**
     * @return array
     */
    protected function getOutputForFunctions()
    {
        $unknownClasses = [];
        $namespaces = $this->useStatementFetchingVisitor->getNamespaces();

        $functionUsages = $this->globalFunctionUsageFetchingVisitor->getGlobalFunctionCallList();

        foreach ($functionUsages as $functionUsage) {
            $relevantAlias = $functionUsage['localNameFirstPart'];

            if (!$functionUsage['isFullyQualified'] &&
                isset($namespaces[$functionUsage['namespace']]['useStatements'][$relevantAlias]) &&
                $namespaces[$functionUsage['namespace']]['useStatements'][$relevantAlias]['kind'] === UseStatementKind::TYPE_FUNCTION
            ) {
                // Mark the accompanying used statement, if any, as used.
                $namespaces[$functionUsage['namespace']]['useStatements'][$relevantAlias]['used'] = true;
            }
        }

        $unusedUseStatements = [];

        foreach ($namespaces as $namespace => $namespaceData) {
            $useStatementMap = $namespaceData['useStatements'];

            foreach ($useStatementMap as $alias => $data) {
                if (
                    (!array_key_exists('used', $data) || !$data['used']) &&
                    $data['kind'] === UseStatementKind::TYPE_FUNCTION
                ) {
                    unset($data['line'], $data['kind']);

                    $unusedUseStatements[] = $data;
                }
            }
        }

        return $unusedUseStatements;
    }
}
