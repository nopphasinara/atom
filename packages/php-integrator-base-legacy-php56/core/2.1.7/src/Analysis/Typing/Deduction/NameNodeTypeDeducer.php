<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\ClasslikeInfoBuilder;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;
use PhpIntegrator\Analysis\Typing\FileClassListProviderInterface;

use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactoryInterface;

use PhpIntegrator\Utility\NodeHelpers;
use PhpIntegrator\Utility\SourceCodeHelpers;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Name} node.
 */
class NameNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * @var ClasslikeInfoBuilder
     */
    protected $classlikeInfoBuilder;

    /**
     * @var FileClassListProviderInterface
     */
    protected $fileClassListProvider;

    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @param TypeAnalyzer                     $typeAnalyzer
     * @param ClasslikeInfoBuilder             $classlikeInfoBuilder
     * @param FileClassListProviderInterface   $fileClassListProvider
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     */
    public function __construct(
        TypeAnalyzer $typeAnalyzer,
        ClasslikeInfoBuilder $classlikeInfoBuilder,
        FileClassListProviderInterface $fileClassListProvider,
        FileTypeResolverFactoryInterface $fileTypeResolverFactory
    ) {
        $this->typeAnalyzer = $typeAnalyzer;
        $this->classlikeInfoBuilder = $classlikeInfoBuilder;
        $this->fileClassListProvider = $fileClassListProvider;
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Name) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromNameNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Name $node
     * @param string    $file
     * @param string    $code
     * @param int       $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromNameNode(Node\Name $node, $file, $code, $offset)
    {
        $nameString = NodeHelpers::fetchClassName($node);

        if ($nameString === 'static' || $nameString === 'self') {
            $currentClass = $this->findCurrentClassAt($file, $code, $offset);

            return [$this->typeAnalyzer->getNormalizedFqcn($currentClass)];
        } elseif ($nameString === 'parent') {
            $currentClassName = $this->findCurrentClassAt($file, $code, $offset);

            if (!$currentClassName) {
                return [];
            }

            $classInfo = $this->classlikeInfoBuilder->getClasslikeInfo($currentClassName);

            if ($classInfo && !empty($classInfo['parents'])) {
                $type = $classInfo['parents'][0];

                return [$this->typeAnalyzer->getNormalizedFqcn($type)];
            }
        } else {
            $line = SourceCodeHelpers::calculateLineByOffset($code, $offset);

            $fqcn = $this->fileTypeResolverFactory->create($file)->resolve($nameString, $line);

            return [$fqcn];
        }
    }

    /**
     * @param string $file
     * @param string $source
     * @param int    $offset
     *
     * @return string|null
     */
    protected function findCurrentClassAt($file, $source, $offset)
    {
        $line = SourceCodeHelpers::calculateLineByOffset($source, $offset);

        return $this->findCurrentClassAtLine($file, $source, $line);
    }

    /**
     * @param string $file
     * @param string $source
     * @param int    $line
     *
     * @return string|null
     */
    protected function findCurrentClassAtLine($file, $source, $line)
    {
        $classes = $this->fileClassListProvider->getClassListForFile($file);

        foreach ($classes as $fqcn => $class) {
            if ($line >= $class['startLine'] && $line <= $class['endLine']) {
                return $fqcn;
            }
        }

        return null;
    }
}
