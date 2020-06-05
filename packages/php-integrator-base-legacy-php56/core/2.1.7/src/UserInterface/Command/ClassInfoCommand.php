<?php

namespace PhpIntegrator\UserInterface\Command;

use ArrayAccess;

use PhpIntegrator\Analysis\ClasslikeInfoBuilder;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

/**
 * Command that shows information about a class, interface or trait.
 */
class ClassInfoCommand extends AbstractCommand
{
    /**
     * @param TypeAnalyzer         $typeAnalyzer
     * @param ClasslikeInfoBuilder $classlikeInfoBuilder
     */
    public function __construct(TypeAnalyzer $typeAnalyzer, ClasslikeInfoBuilder $classlikeInfoBuilder)
    {
        $this->typeAnalyzer = $typeAnalyzer;
        $this->classlikeInfoBuilder = $classlikeInfoBuilder;
    }

    /**
     * @inheritDoc
     */
    public function execute(ArrayAccess $arguments)
    {
        if (!isset($arguments['name'])) {
            throw new InvalidArgumentsException(
                'The fully qualified name of the structural element is required for this command.'
            );
        }

        $result = $this->getClassInfo($arguments['name']);

        return $result;
    }

    /**
     * @param string $fqcn
     *
     * @return array
     */
    public function getClassInfo($fqcn)
    {
        $fqcn = $this->typeAnalyzer->getNormalizedFqcn($fqcn);

        return $this->classlikeInfoBuilder->getClasslikeInfo($fqcn);
    }
}
