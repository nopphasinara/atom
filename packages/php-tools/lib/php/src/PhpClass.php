<?php

namespace JordyvD\AtomPhpTools;

use ReflectionClass;

class PhpClass
{
    /** @var string **/
    public $name;

    /** @var Parameter[] */
    public $constructorParameters = [];

    /** @var Parameter[] */
    public $classProperties = [];

    /** @var ReflectionClass */
    public $ref;

    public function __construct(string $name, array $constructorParameters, ReflectionClass $reflectionClass, array $classProperties)
    {
        $this->name = $name;
        $this->constructorParameters = $constructorParameters;
        $this->ref = $reflectionClass;
        $this->classParameters = $classProperties;
    }

    public function getConstructorParametersNotInProperties(): array
    {
        if (!count($this->classProperties)) {
            return $this->constructorParameters;
        }

        $diff = [];

        foreach ($this->constructorParameters as $parameter) {
            $found = false;
            foreach ($this->classProperties as $property) {
                if ($parameter->name === $property->name) {
                    $found = true;
                }
            }

            if (!$found) {
                $diff[] = $parameter;
            }
        }

        return $diff;
    }
}
