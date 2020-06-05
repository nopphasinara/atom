<?php

namespace PhpIntegrator\Parsing;

use PhpParser\Parser;
use PhpParser\ErrorHandler;

/**
 * Proxy class for a Parser that caches nodes to avoid parsing the same file or source code multiple times.
 *
 * Only the last parsed result is retained. If different code is passed, the cache will miss and a new parse call will
 * occur.
 */
class CachingParserProxy implements Parser
{
    /**
     * @var Parser
     */
    protected $proxiedObject;

    /**
     * @var array|null
     */
    protected $cache = null;

    /**
     * @var string|null
     */
    protected $lastCacheKey = null;

    /**
     * @param Parser $proxiedObject
     */
    public function __construct(Parser $proxiedObject)
    {
        $this->proxiedObject = $proxiedObject;
    }

    /**
     * @inheritDoc
     */
    public function parse($code, ErrorHandler $errorHandler = null)
    {
        $cacheKey = md5($code);

        if ($errorHandler !== null) {
            $cacheKey .= spl_object_hash($errorHandler);
        }

        if ($cacheKey !== $this->lastCacheKey || $this->cache === null) {
            $this->cache = $this->proxiedObject->parse($code, $errorHandler);
        }

        $this->lastCacheKey = $cacheKey;

        return $this->cache;
    }
}
