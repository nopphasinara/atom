<?php
use \JordyvD\AtomPhpTools\PhpClass;
use \JordyvD\AtomPhpTools\Parameter;
use JordyvD\AtomPhpTools\ClassPropertyGenerator;

require_once __DIR__."/../../../vendor/autoload.php";

// $activeFilePath = $argv[1];
$activeFilePath = "/Users/jordyvandomselaar/workspace/atom/php-tools/test-files/test.php";
$classConstructorParameters = getClassConstructorParameters($activeFilePath);
$classesWithProperties = getClassesWithProperties($classConstructorParameters);

$newFileContents = file_get_contents($activeFilePath);
foreach ($classesWithProperties as $class) {
    $newFileContents = ClassPropertyGenerator::addPropertiesToClassDeclaration($newFileContents, $class->name, $class->getConstructorParametersNotInProperties());
}

echo $newFileContents;

function getClassesWithProperties(array $classes)
{
        return array_map(function (PhpClass $class) {
            $class->classProperties = array_map(function (ReflectionProperty $property) {
                return new Parameter($property->getName(), '');
            }, $class->ref->getProperties());

            return $class;
        }, $classes);
}

/**
 * Get all classes with the parameters in their constructors.
 * @param  string $filePath File to scan for classe.s
 * @return array            Array of classes with parameters.
 */
function getClassConstructorParameters(string $filePath): array
{
    $parsedFile = new \Go\ParserReflection\ReflectionFile($filePath);

    return array_reduce($parsedFile->getFileNamespaces(), function ($carrier, $namespace) {
        // New array with namespaces as keys, and classes in the namespaces as values
        return array_reduce($namespace->getClasses(), function ($carrierA, $class) {
            // Array with class as key and every method as value
            $carrierA[$class->getName()] = array_reduce($class->getMethods(), function ($carrierB, $method) use ($class) {
                // We only want the constructors
                if ($method->getName() !== "__construct") {
                    return $carrierB;
                }

                $parameters = array_map(function ($parameter) {
                    return new Parameter($parameter->getName(), (string)$parameter->getType());
                }, $method->getParameters());

                return new PhpClass($class->getName(), $parameters, $class, []);
            }, []);

            return $carrierA;
        }, []);
    }, []);
}
