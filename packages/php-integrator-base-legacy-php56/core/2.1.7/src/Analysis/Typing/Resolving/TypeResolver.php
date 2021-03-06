<?php

namespace PhpIntegrator\Analysis\Typing\Resolving;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

/**
 * Resolves local types to their FQCN.
 */
class TypeResolver implements TypeResolverInterface
{
    /**
     * @var TypeAnalyzer
     */
    protected $typeAnalyzer;

    /**
     * Constructor.
     *
     * @param TypeAnalyzer $typeAnalyzer
     */
    public function __construct(TypeAnalyzer $typeAnalyzer)
    {
        $this->typeAnalyzer = $typeAnalyzer;
    }

    /**
     * @inheritDoc
     */
    public function resolve($name, $namespaceName, array $imports, $kind = UseStatementKind::TYPE_CLASSLIKE)
    {
        if (empty($name)) {
            return null;
        } elseif ($name[0] === '\\') {
            return $name;
        } elseif (!$this->typeAnalyzer->isClassType($name)) {
            return $name;
        }

        $fullName = null;
        $nameParts = explode('\\', $name);

        foreach ($imports as $import) {
            if ($import['alias'] === $nameParts[0] && $import['kind'] === $kind) {
                array_shift($nameParts);

                $fullName = $import['name'];

                if (!empty($nameParts)) {
                    /*
                     * This block is only executed when relative names are used with more than one part, i.e.:
                     *   use A\B\C;
                     *
                     *   C\D::foo();
                     *
                     * 'C' will be dropped from 'C\D', and the remaining 'D' will be appended to 'A\B\C',
                     * becoming 'A\B\C\D'.
                     */
                    $fullName .= '\\' . implode('\\', $nameParts);
                }

                break;
            }
        }

        if (!$fullName) {
            if ($kind !== UseStatementKind::TYPE_CLASSLIKE) {
                // Unqualified constant or functions names could be relative to the current namespace OR be part of the
                // root namespace. Which one of the two is used by PHP depends on which one exists, which is not known
                // to us.
                throw new TypeResolutionImpossibleException(
                    'An unqualified can\'t be resolved without further information!'
                );
            }

            // Still here? There must be no explicit use statement, default to the current namespace.
            $fullName = $namespaceName ? ($namespaceName . '\\') : '';
            $fullName .= $name;
        }

        return $this->typeAnalyzer->getNormalizedFqcn($fullName);
    }
}
