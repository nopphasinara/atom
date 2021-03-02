<?php

namespace JordyvD\AtomPhpTools;

class ClassPropertyGenerator
{
    /**
     * @param  Parameter[]  $properties
     * @return string
     */
    static function generateProperties(array $properties): string
    {
        return array_reduce($properties, function (string $carrier, Parameter $parameter) {
            return $carrier .= sprintf("    /** @var %s **/\n    private $%s;\n\n", $parameter->type ?: "[TYPE]", $parameter->name);
        }, "");
    }

    static function addPropertiesToClassDeclaration(string $fileContents, string $className, array $properties)
    {
        return preg_replace(sprintf("/(class\s*%s[\s\S]+?{)\n+/", $className), sprintf("$1\n%s", self::generateProperties($properties)), $fileContents);
    }
}
