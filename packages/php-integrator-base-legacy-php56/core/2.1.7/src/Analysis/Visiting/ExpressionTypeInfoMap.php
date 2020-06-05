<?php

namespace PhpIntegrator\Analysis\Visiting;

use PhpParser\Node;

/**
 * Keeps track of {@see ExpressionTypeInfo} objects for a set of expressions represented by strings.
 */
class ExpressionTypeInfoMap
{
    /**
     * @var array
     */
    protected $map = [];

    /**
     * @param string $expression
     *
     * @return ExpressionTypeInfo
     */
    public function get($expression)
    {
        $this->createIfNecessary($expression);

        return $this->map[$expression];
    }

    /**
     * @param string $expression
     *
     * @return bool
     */
    public function has($expression)
    {
        return isset($this->map[$expression]);
    }

    /**
     * @param string    $expression
     * @param Node|null $bestMatch
     */
    public function setBestMatch($expression, Node $bestMatch = null)
    {
        $this->createIfNecessary($expression);

        $this->get($expression)->setBestMatch($bestMatch);
        $this->get($expression)->getTypePossibilityMap()->clear();
    }

    /**
     * @param string $expression
     * @param string $type
     * @param int    $line
     */
    public function setBestTypeOverrideMatch($expression, $type, $line)
    {
        $this->createIfNecessary($expression);

        $this->get($expression)->setBestTypeOverrideMatch($type);
        $this->get($expression)->setBestTypeOverrideMatchLine($line);
    }

    /**
     * @param string[] $exclusionList
     */
    public function removeAllExcept(array $exclusionList)
    {
        $newMap = [];

        foreach ($this->map as $expression => $data) {
            if (in_array($expression, $exclusionList)) {
                $newMap[$expression] = $data;
            }
        }

        $this->map = $newMap;
    }

    /**
     * @return void
     */
    public function clear()
    {
        $this->map = [];
    }

    /**
     * @param string $expression
     */
    protected function createIfNecessary($expression)
    {
        if ($this->has($expression)) {
            return;
        }

        $this->create($expression);
    }

    /**
     * @param string $expression
     */
    protected function create($expression)
    {
        $this->map[$expression] = new ExpressionTypeInfo();
    }
}
