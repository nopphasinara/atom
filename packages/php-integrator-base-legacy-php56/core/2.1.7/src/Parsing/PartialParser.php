<?php

namespace PhpIntegrator\Parsing;

use LogicException;

use PhpParser\Node;
use PhpParser\Lexer;
use PhpParser\Parser;
use PhpParser\ErrorHandler;
use PhpParser\ParserFactory;

/**
 * Parses partial (incomplete) PHP code.
 *
 * This class can parse PHP code that is incomplete (and thus erroneous), which is only partially supported by
 * php-parser. This is necessary for being able to deal with incomplete expressions such as "$this->" to see what the
 * type of the expression is. This information can in turn be used by client functionality such as autocompletion.
 */
class PartialParser implements Parser
{
    /**
     * @var Parser
     */
    protected $strictParser;

    /**
     * @var ParserFactory
     */
    protected $parserFactory;

    /**
     * @param ParserFactory $parserFactory
     */
    public function __construct(ParserFactory $parserFactory)
    {
        $this->parserFactory = $parserFactory;
    }

    /**
     * @inheritDoc
     */
    public function parse($code, ErrorHandler $errorHandler = null)
    {
        if ($errorHandler) {
            throw new LogicException('Error handling is not supported as error recovery will be attempted automatically');
        }

        $correctedExpression = $this->getNormalizedCode($code);

        $nodes = $this->tryParse($correctedExpression);
        $nodes = $nodes ?: $this->tryParseWithKeywordCorrection($correctedExpression);
        $nodes = $nodes ?: $this->tryParseWithTrailingSemicolonCorrection($correctedExpression);
        $nodes = $nodes ?: $this->tryParseWithHeredocTerminationCorrection($correctedExpression);
        $nodes = $nodes ?: $this->tryParseWithDummyInsertion($correctedExpression);

        return $nodes;
    }

    /**
     * @param string $code
     *
     * @return string
     */
    protected function getNormalizedCode($code)
    {
        if (mb_substr(trim($code), 0, 5) !== '<?php') {
            return '<?php ' . $code;
        };

        return $code;
    }

    /**
     * @param string $code
     *
     * @return Node[]|null
     */
    protected function tryParseWithKeywordCorrection($code)
    {
        if (mb_strrpos($code, 'self') === (mb_strlen($code) - mb_strlen('self'))) {
            return [new \PhpIntegrator\Parsing\Node\Keyword\Self_()];
        } elseif (mb_strrpos($code, 'static') === (mb_strlen($code) - mb_strlen('static'))) {
            return [new \PhpIntegrator\Parsing\Node\Keyword\Static_()];
        } elseif (mb_strrpos($code, 'parent') === (mb_strlen($code) - mb_strlen('parent'))) {
            return [new \PhpIntegrator\Parsing\Node\Keyword\Parent_()];
        }

        return null;
    }

    /**
     * @param string $code
     *
     * @return Node[]|null
     */
    protected function tryParseWithTrailingSemicolonCorrection($code)
    {
        return $this->tryParse($code . ';');
    }

    /**
     * @param string $code
     *
     * @return Node[]|null
     */
    protected function tryParseWithHeredocTerminationCorrection($code)
    {
        return $this->tryParse($code . ";\n"); // Heredocs need to be suffixed by a semicolon and a newline.
    }

    /**
     * @param string $code
     *
     * @return Node[]|null
     */
    protected function tryParseWithDummyInsertion($code)
    {
        $removeDummy = false;
        $dummyName = '____DUMMY____';

        $nodes = $this->tryParse($code . $dummyName . ';');

        if (empty($nodes)) {
            return null;
        }

        $node = $nodes[count($nodes) - 1];

        if ($node instanceof Node\Expr\ClassConstFetch || $node instanceof Node\Expr\PropertyFetch) {
            if ($node->name === $dummyName) {
                $node->name = '';
            }
        }

        return $nodes;
    }

    /**
     * @param string $code
     *
     * @return Node[]|null
     */
    protected function tryParse($code)
    {
        try {
            return $this->getStrictParser()->parse($code);
        } catch (\PhpParser\Error $e) {
            return null;
        }

        return null;
    }

    /**
     * @return Parser
     */
    protected function getStrictParser()
    {
        if (!$this->strictParser instanceof Parser) {
            $this->strictParser = $this->parserFactory->create(ParserFactory::PREFER_PHP7, new Lexer());
        }

        return $this->strictParser;
    }
}
