<?php

namespace PhpIntegrator\Parsing;

/**
 * Aids in dealing with PHP parser tokens.
 */
class ParserTokenHelper
{
    /**
     * @see https://secure.php.net/manual/en/tokens.php
     *
     * @return int[]
     */
    public function getExpressionBoundaryTokens()
    {
        $expressionBoundaryTokens = [
            T_ABSTRACT, T_AND_EQUAL, T_AS, T_BOOLEAN_AND, T_BOOLEAN_OR, T_BREAK, T_CALLABLE, T_CASE, T_CATCH,
            T_CLONE, T_CLOSE_TAG, T_CONCAT_EQUAL, T_CONST, T_CONTINUE, T_DEC, T_DECLARE, T_DEFAULT, T_DIV_EQUAL, T_DO,
            T_DOUBLE_ARROW, T_ECHO, T_ELSE, T_ELSEIF, T_ENDDECLARE, T_ENDFOR, T_ENDFOREACH, T_ENDIF, T_ENDSWITCH,
            T_ENDWHILE, T_END_HEREDOC, T_EXIT, T_EXTENDS, T_FINAL, T_FOR, T_FOREACH, T_FUNCTION, T_GLOBAL, T_GOTO, T_IF,
            T_IMPLEMENTS, T_INC, T_INCLUDE, T_INCLUDE_ONCE, T_INSTANCEOF, T_INSTEADOF, T_INTERFACE, T_IS_EQUAL,
            T_IS_GREATER_OR_EQUAL, T_IS_IDENTICAL, T_IS_NOT_EQUAL, T_IS_NOT_IDENTICAL, T_IS_SMALLER_OR_EQUAL,
            T_LOGICAL_AND, T_LOGICAL_OR, T_LOGICAL_XOR, T_MINUS_EQUAL, T_MOD_EQUAL, T_MUL_EQUAL, T_NAMESPACE, T_NEW,
            T_OPEN_TAG, T_OPEN_TAG_WITH_ECHO, T_OR_EQUAL, T_PLUS_EQUAL, T_PRINT, T_PRIVATE, T_PUBLIC, T_PROTECTED,
            T_REQUIRE, T_REQUIRE_ONCE, T_RETURN, T_SL, T_SL_EQUAL, T_SR, T_SR_EQUAL, T_SWITCH, T_THROW, T_TRAIT, T_TRY,
            T_USE, T_VAR, T_WHILE, T_XOR_EQUAL
        ];

        // PHP >= 5.5
        if (defined('T_FINALLY')) {
            $expressionBoundaryTokens[] = T_FINALLY;
        }

        if (defined('T_YIELD')) {
            $expressionBoundaryTokens[] = T_YIELD;
        }

        // PHP >= 5.6
        if (defined('T_ELLIPSIS')) {
            $expressionBoundaryTokens[] = T_ELLIPSIS;
        }

        if (defined('T_POW')) {
            $expressionBoundaryTokens[] = T_POW;
        }

        if (defined('T_POW_EQUAL')) {
            $expressionBoundaryTokens[] = T_POW_EQUAL;
        }

        // PHP >= 7.0
        if (defined('T_SPACESHIP')) {
            $expressionBoundaryTokens[] = T_SPACESHIP;
        }

        return $expressionBoundaryTokens;
    }

    /**
     * @see https://secure.php.net/manual/en/tokens.php
     *
     * @return int[]
     */
    public function getCastBoundaryTokens()
    {
        $expressionBoundaryTokens = [
            T_INT_CAST, T_UNSET_CAST, T_OBJECT_CAST, T_BOOL_CAST, T_ARRAY_CAST, T_DOUBLE_CAST, T_STRING_CAST
        ];

        return $expressionBoundaryTokens;
    }

    /**
     * @see https://secure.php.net/manual/en/tokens.php
     *
     * @return int[]
     */
    public function getSkippableTokens()
    {
        $tokens = [
            T_COMMENT, T_DOC_COMMENT, T_ENCAPSED_AND_WHITESPACE, T_CONSTANT_ENCAPSED_STRING, T_STRING
        ];

        return $tokens;
    }
}
