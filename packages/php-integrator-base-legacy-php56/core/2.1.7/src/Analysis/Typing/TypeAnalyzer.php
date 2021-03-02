<?php

namespace PhpIntegrator\Analysis\Typing;

use UnexpectedValueException;

/**
 * Provides functionality for analyzing type names.
 */
class TypeAnalyzer implements TypeNormalizerInterface
{
    /**
     * @var string
     */
    const TYPE_SPLITTER   = '|';

    /**
     * @var string
     */
    const ARRAY_TYPE_HINT_REGEX = '/^(.+)\[\]$/';

    /**
     * @var string
     */
    const TYPE_SELF = 'self';

    /**
     * @var string
     */
    const TYPE_STATIC = 'static';

    /**
     * @var string
     */
    const TYPE_THIS = '$this';

    /**
     * Indicates if a type is "special", i.e. it is not an actual class type, but rather a basic type (e.g. "int",
     * "bool", ...) or another special type (e.g. "$this", "false", ...).
     *
     * @param string $type
     *
     * @see https://github.com/phpDocumentor/fig-standards/blob/master/proposed/phpdoc.md#keyword
     *
     * @return bool
     */
    public function isSpecialType($type)
    {
        $isReservedKeyword = in_array($type, [
            'string',
            'int',
            'bool',
            'float',
            'object',
            'mixed',
            'array',
            'resource',
            'void',
            'null',
            'callable',
            'false',
            'true',
            'self',
            'static',
            'parent',
            '$this'
        ]);

        return $isReservedKeyword || $this->isArraySyntaxTypeHint($type);
    }

    /**
     * @param string $type
     *
     * @return bool
     */
    public function isClassType($type)
    {
        return !$this->isSpecialType($type);
    }

    /**
     * @inheritDoc
     */
    public function getNormalizedFqcn($fqcn)
    {
        if ($fqcn && $fqcn[0] !== '\\') {
            return '\\' . $fqcn;
        }

        return $fqcn;
    }

    /**
     * Splits a docblock type specification up into different (docblock) types.
     *
     * @param string $typeSpecification
     *
     * @example "int|string" becomes ["int", "string"].
     *
     * @return string[]
     */
    public function getTypesForTypeSpecification($typeSpecification)
    {
        return explode(self::TYPE_SPLITTER, $typeSpecification);
    }

    /**
     * Returns a boolean indicating if the specified type (i.e. from a type hint) is valid according to the passed
     * docblock type identifier.
     *
     * @param string $type
     * @param string $typeSpecification
     *
     * @return bool
     */
    public function isTypeConformantWithDocblockType($type, $typeSpecification)
    {
        $docblockTypes = $this->getTypesForTypeSpecification($typeSpecification);

        return $this->isTypeConformantWithDocblockTypes($type, $docblockTypes);
    }

    /**
     * @param string   $type
     * @param string[] $docblockTypes
     *
     * @return bool
     */
    protected function isTypeConformantWithDocblockTypes($type, array $docblockTypes)
    {
        $isPresent = in_array($type, $docblockTypes);

        if (!$isPresent && $type === 'array') {
            foreach ($docblockTypes as $docblockType) {
                // The 'type[]' syntax is also valid for the 'array' type hint.
                if ($this->isArraySyntaxTypeHint($docblockType)) {
                    return true;
                }
            }
        }

        return $isPresent;
    }

    /**
     * @param string $type
     */
    public function isArraySyntaxTypeHint($type)
    {
        return (preg_match(self::ARRAY_TYPE_HINT_REGEX, $type) === 1);
    }

    /**
     * @param string $type
     *
     * @return string|null
     */
    public function getValueTypeFromArraySyntaxTypeHint($type)
    {
        $matches = [];

        if (preg_match(self::ARRAY_TYPE_HINT_REGEX, $type, $matches) === 1) {
            return $matches[1];
        }

        throw new UnexpectedValueException('"' . $type . '" is not an array type hint');
    }

    /**
     * Takes an actual (single) docblock type that contains self and replaces it with the designated type.
     *
     * @param string $docblockType
     * @param string $newType
     *
     * @example "self" with new type "Foo" becomes "Foo".
     * @example "self[]" with new type "\A\B" becomes "\A\B[]".
     *
     * @return string
     */
    public function interchangeSelfWithActualType($docblockType, $newType)
    {
        return $this->interchangeType($docblockType, self::TYPE_SELF, $newType);
    }

    /**
     * Takes an actual (single) docblock type that contains static and replaces it with the designated type.
     *
     * @param string $docblockType
     * @param string $newType
     *
     * @example "static" with new type "Foo" becomes "Foo".
     * @example "static[]" with new type "\A\B" becomes "\A\B[]".
     *
     * @return string
     */
    public function interchangeStaticWithActualType($docblockType, $newType)
    {
        return $this->interchangeType($docblockType, self::TYPE_STATIC, $newType);
    }

    /**
     * Takes an actual (single) docblock type that contains self and replaces it with the designated type.
     *
     * @param string $docblockType
     * @param string $newType
     *
     * @example "self" with new type "Foo" becomes "Foo".
     * @example "self[]" with new type "\A\B" becomes "\A\B[]".
     *
     * @return string
     */
    public function interchangeThisWithActualType($docblockType, $newType)
    {
        return $this->interchangeType($docblockType, self::TYPE_THIS, $newType);
    }

    /**
     * Takes an actual (single) docblock type and replaces it with the designated type.
     *
     * @param string $docblockType
     * @param string $oldType
     * @param string $newType
     *
     * @return string
     */
    protected function interchangeType($docblockType, $oldType, $newType)
    {
        if ($this->isArraySyntaxTypeHint($docblockType)) {
            $valueType = $this->getValueTypeFromArraySyntaxTypeHint($docblockType);

            if ($valueType === $oldType) {
                return $newType . '[]';
            }
        } elseif ($docblockType === $oldType) {
            return $newType;
        }

        return $docblockType;
    }
}
