<?php

namespace PhpIntegrator\Analysis;

use UnexpectedValueException;

use PhpIntegrator\Parsing\ParserTokenHelper;
use PhpIntegrator\Parsing\LastExpressionParser;

use PhpIntegrator\Utility\NodeHelpers;

use PhpParser\Node;
use PhpParser\PrettyPrinterAbstract;

/**
 * Retrieves invocation information for function and method calls.
 */
class InvocationInfoRetriever
{
    /**
     * @var LastExpressionParser
     */
    protected $lastExpressionParser;

    /**
     * @var ParserTokenHelper
     */
    protected $parserTokenHelper;

    /**
     * @var PrettyPrinterAbstract
     */
    protected $prettyPrinter;

    /**
     * @param LastExpressionParser  $lastExpressionParser
     * @param ParserTokenHelper     $parserTokenHelper
     * @param PrettyPrinterAbstract $prettyPrinter
     */
    public function __construct(
        LastExpressionParser $lastExpressionParser,
        ParserTokenHelper $parserTokenHelper,
        PrettyPrinterAbstract $prettyPrinter
    ) {
        $this->lastExpressionParser = $lastExpressionParser;
        $this->parserTokenHelper = $parserTokenHelper;
        $this->prettyPrinter = $prettyPrinter;
    }

    /**
     * Retrieves the call stack of the function or method that is being invoked.
     *
     * This can be used to fetch information about the function or method call the cursor is in.
     *
     * @param string $code
     *
     * @throws UnexpectedValueException when a node type is encountered that this method doesn't know how to handle.
     *
     * @return array|null With elements 'callStack' (array), 'argumentIndex', which denotes the argument in the
     *                    parameter list the position is located at, and offset which denotes the byte offset the
     *                    invocation was found at. Returns 'null' if not in a method or function call.
     */
    public function get($code)
    {
        $scopesOpened = 0;
        $scopesClosed = 0;
        $bracketsOpened = 0;
        $bracketsClosed = 0;
        $parenthesesOpened = 0;
        $parenthesesClosed = 0;

        $argumentIndex = 0;

        $token = null;
        $tokens = @token_get_all($code);
        $currentTokenIndex = count($tokens);
        $tokenStartOffset = strlen($code);

        $skippableTokens = $this->parserTokenHelper->getSkippableTokens();
        $expressionBoundaryTokens = $this->parserTokenHelper->getExpressionBoundaryTokens();

        for ($i = strlen($code) - 1; $i >= 0; --$i) {
            if ($i < $tokenStartOffset) {
                $token = $tokens[--$currentTokenIndex];

                $tokenString = is_array($token) ? $token[1] : $token;
                $tokenStartOffset = ($i + 1) - strlen($tokenString);

                $token = [
                    'type' => is_array($token) ? $token[0] : null,
                    'text' => $tokenString
                ];
            }

            if (in_array($token['type'], $skippableTokens)) {
                continue;
            } elseif ($code[$i] === '}') {
                ++$scopesClosed;
            } elseif ($code[$i] === '{') {
                ++$scopesOpened;

                if ($scopesOpened > $scopesClosed) {
                    return null; // We reached the start of a block, we can never be in a method call.
                }
            } elseif ($code[$i] === ']') {
                ++$bracketsClosed;
            } elseif ($code[$i] === '[') {
                ++$bracketsOpened;

                if ($bracketsOpened > $bracketsClosed) {
                    // We must have been inside an array argument, reset.
                    $argumentIndex = 0;
                    --$bracketsOpened;
                }
            } elseif ($code[$i] === ')') {
                ++$parenthesesClosed;
            } elseif ($code[$i] === '(') {
                ++$parenthesesOpened;
            } elseif ($scopesOpened === $scopesClosed) {
                if ($code[$i] === ';') {
                    return null; // We've moved too far and reached another expression, stop here.
                } elseif ($code[$i] === ',') {
                    if ($parenthesesOpened === ($parenthesesClosed + 1)) {
                        // Pretend the parentheses were closed, the user is probably inside an argument that
                        // contains parentheses.
                        ++$parenthesesClosed;
                    }

                    if ($bracketsOpened >= $bracketsClosed && $parenthesesOpened === $parenthesesClosed) {
                        ++$argumentIndex;
                    }
                }
            }

            if ($scopesOpened === $scopesClosed && $parenthesesOpened === ($parenthesesClosed + 1)) {
                if (in_array($token['type'], $expressionBoundaryTokens)) {
                    break;
                }

                $node = null;

                try {
                    $node = $this->lastExpressionParser->getLastNodeAt($code, $i);
                } catch (\PhpParser\Error $e) {
                    $node = null;
                }

                if ($node) {
                    $type = null;

                    if ($node instanceof Node\Expr\PropertyFetch ||
                        $node instanceof Node\Expr\StaticPropertyFetch ||
                        $node instanceof Node\Expr\MethodCall ||
                        $node instanceof Node\Expr\StaticCall ||
                        $node instanceof Node\Expr\ClassConstFetch
                    ) {
                        $type = 'method';
                    } else {
                        $type = 'function';

                        for ($j = $currentTokenIndex - 2; $j >= 0; --$j) {
                            if (
                                is_array($tokens[$j]) &&
                                in_array($tokens[$j][0], [T_WHITESPACE, T_NS_SEPARATOR, T_NEW, T_STRING])
                            ) {
                                if ($tokens[$j][0] === T_NEW) {
                                    $type = 'instantiation';
                                    break;
                                }


                                continue;
                            }

                            break;
                        }
                    }

                    $name = null;

                    if (isset($node->name)) {
                        if ($node->name instanceof Node\Expr) {
                            $name = $this->prettyPrinter->prettyPrintExpr($node->name);
                        } elseif ($node->name instanceof Node\Name) {
                            $name = NodeHelpers::fetchClassName($node->name);
                        } elseif (is_string($node->name)) {
                            $name = ((string) $node->name);
                        } else {
                            throw new UnexpectedValueException("Don't know how to handle type " . get_class($node->name));
                        }
                    } elseif ($node instanceof Node\Expr) {
                        $name = $this->prettyPrinter->prettyPrintExpr($node);
                    } else {
                        throw new UnexpectedValueException("Don't know how to handle node of type " . get_class($node));
                    }

                    return [
                        'name'           => $name,
                        'expression'     => $this->prettyPrinter->prettyPrintExpr($node),
                        'type'           => $type,
                        'argumentIndex'  => $argumentIndex,
                        'offset'         => $i
                    ];
                }
            }
        }

        return null;
    }
}
