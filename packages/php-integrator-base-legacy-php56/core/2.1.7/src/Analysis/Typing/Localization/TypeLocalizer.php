<?php

namespace PhpIntegrator\Analysis\Typing\Localization;

use PhpIntegrator\Analysis\Typing\TypeAnalyzer;

use PhpIntegrator\Analysis\Visiting\UseStatementKind;

/**
 * Resolves FQCN's back to local types based on use statements and the namespace.
 */
class TypeLocalizer
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
     * "Unresolves" a FQCN, turning it back into a name relative to local use statements. If no local type could be
     * determined, the FQCN is returned (as that is the only way the type can be referenced locally).
     *
     * @param string      $name
     * @param string|null $namespaceFqcn
     * @param array {
     *     @var string|null $fqcn
     *     @var string      $alias
     *     @var string      $kind
     * } $imports
     *
     * @example With use statement "use A\B as AliasB", unresolving "A\B\C\D" will yield "AliasB\C\D".
     *
     * @return string|null
     */
    public function localize($name, $namespaceFqcn, array $imports, $kind = UseStatementKind::TYPE_CLASSLIKE)
    {
        $bestLocalizedType = null;

        if (!$name) {
            return null;
        }

        $nameFqcn = $this->typeAnalyzer->getNormalizedFqcn($name);

        if ($namespaceFqcn) {
            $namespaceFqcn = $this->typeAnalyzer->getNormalizedFqcn($namespaceFqcn);

            $namespaceParts = explode('\\', $namespaceFqcn);

            if (mb_strpos($nameFqcn, $namespaceFqcn) === 0) {
                $nameWithoutNamespacePrefix = mb_substr($nameFqcn, mb_strlen($namespaceFqcn) + 1);

                $nameWithoutNamespacePrefixParts = explode('\\', $nameWithoutNamespacePrefix);

                // The namespace also acts as a use statement, but the rules are slightly different: in namespace A,
                // the class \A\B becomes B rather than A\B (the latter which would happen if there were a use
                // statement "use A;").
                $imports[] = [
                    'name'  => $namespaceFqcn . '\\' . $nameWithoutNamespacePrefixParts[0],
                    'alias' => $nameWithoutNamespacePrefixParts[0],
                    'kind'  => null
                ];
            }
        }

        foreach ($imports as $import) {
            $importFqcn = $this->typeAnalyzer->getNormalizedFqcn($import['name']);

            if (mb_strpos($nameFqcn, $importFqcn) === 0 && ($import['kind'] === $kind || $import['kind'] === null)) {
                $localizedType = $import['alias'] . mb_substr($nameFqcn, mb_strlen($importFqcn));

                // It is possible that there are multiple use statements the FQCN could be made relative to (e.g.
                // if a namespace as well as one of its classes is imported), select the closest one in that case.
                if (!$bestLocalizedType || mb_strlen($localizedType) < mb_strlen($bestLocalizedType)) {
                    $bestLocalizedType = $localizedType;
                }
            }
        }

        return $bestLocalizedType ?: $this->typeAnalyzer->getNormalizedFqcn($name);
    }
}
