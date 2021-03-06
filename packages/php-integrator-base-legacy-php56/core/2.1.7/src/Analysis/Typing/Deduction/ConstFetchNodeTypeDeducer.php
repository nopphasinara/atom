<?php

namespace PhpIntegrator\Analysis\Typing\Deduction;

use UnexpectedValueException;

use PhpIntegrator\Analysis\Conversion\ConstantConverter;

use PhpIntegrator\Analysis\Typing\Resolving\FileTypeResolverFactoryInterface;

use PhpIntegrator\Indexing\IndexDatabase;

use PhpIntegrator\Utility\NodeHelpers;
use PhpIntegrator\Utility\SourceCodeHelpers;

use PhpParser\Node;

/**
 * Type deducer that can deduce the type of a {@see Node\Expr\ConstFetch} node.
 */
class ConstFetchNodeTypeDeducer extends AbstractNodeTypeDeducer
{
    /**
     * @var FileTypeResolverFactoryInterface
     */
    protected $fileTypeResolverFactory;

    /**
     * @var IndexDatabase
     */
    protected $indexDatabase;

    /**
     * @var ConstantConverter
     */
    protected $constantConverter;

    /**
     * @param FileTypeResolverFactoryInterface $fileTypeResolverFactory
     * @param IndexDatabase                    $indexDatabase
     * @param ConstantConverter                $constantConverter
     */
    public function __construct(
        FileTypeResolverFactoryInterface $fileTypeResolverFactory,
        IndexDatabase $indexDatabase,
        ConstantConverter $constantConverter
    ) {
        $this->fileTypeResolverFactory = $fileTypeResolverFactory;
        $this->indexDatabase = $indexDatabase;
        $this->constantConverter = $constantConverter;
    }

    /**
     * @inheritDoc
     */
    public function deduce(Node $node, $file, $code, $offset)
    {
        if (!$node instanceof Node\Expr\ConstFetch) {
            throw new UnexpectedValueException("Can't handle node of type " . get_class($node));
        }

        return $this->deduceTypesFromConstFetchNode($node, $file, $code, $offset);
    }

    /**
     * @param Node\Expr\ConstFetch $node
     * @param string|null          $file
     * @param string               $code
     * @param int                  $offset
     *
     * @return string[]
     */
    protected function deduceTypesFromConstFetchNode(Node\Expr\ConstFetch $node, $file, $code, $offset)
    {
        $name = NodeHelpers::fetchClassName($node->name);

        if ($name === 'null') {
            return ['null'];
        } elseif ($name === 'true' || $name === 'false') {
            return ['bool'];
        }

        $line = SourceCodeHelpers::calculateLineByOffset($code, $offset);

        $fqcn = $this->fileTypeResolverFactory->create($file)->resolve($name, $line);

        $globalConstant = $this->indexDatabase->getGlobalConstantByFqcn($fqcn);

        if (!$globalConstant) {
            return [];
        }

        $convertedGlobalConstant = $this->constantConverter->convert($globalConstant);

        return $this->fetchResolvedTypesFromTypeArrays($convertedGlobalConstant['types']);
    }
}
