<?php

namespace PhpIntegrator\Utility;

use UnexpectedValueException;

/**
 * Deals with reading (not analyzing or parsing) source code.
 */
class SourceCodeStreamReader
{
    /**
     * @var resource|null
     */
    protected $stdinStream;

    /**
     * @var bool
     */
    protected $autoConvertToUtf8;

    /**
     * @param resource|null $stdinStream
     * @param bool          $autoConvertToUtf8
     */
    public function __construct($stdinStream = null, $autoConvertToUtf8 = true)
    {
        $this->stdinStream = $stdinStream;
        $this->autoConvertToUtf8 = $autoConvertToUtf8;
    }

    /**
     * @return resource|null
     */
    public function getStdinStream()
    {
        return $this->stdinStream;
    }

    /**
     * @param resource|null $stdinStream
     *
     * @return static
     */
    public function setStdinStream($stdinStream)
    {
        $this->stdinStream = $stdinStream;
        return $this;
    }

    /**
     * @return bool
     */
    public function getAutoConvertToUtf8()
    {
        return $this->autoConvertToUtf8;
    }

    /**
     * @param bool $autoConvertToUtf8
     *
     * @return static
     */
    public function setAutoConvertToUtf8($autoConvertToUtf8)
    {
        $this->autoConvertToUtf8 = $autoConvertToUtf8;
        return $this;
    }

    /**
     * Reads source code from STDIN. Note that this call is blocking as long as there is no input!
     *
     * @return string
     */
    public function getSourceCodeFromStdin()
    {
        $stream = $this->stdinStream;
        $stream = $stream ?: STDIN;

        $code = stream_get_contents($stream);

        $code = $this->convertEncodingIfNecessary($code);

        return $code;
    }

    /**
     * @param string|null $file
     *
     * @throws UnexpectedValueException if the file doesn't exist or it is unreadable.
     *
     * @return string
     */
    public function getSourceCodeFromFile($file)
    {
        if (!$file) {
            throw new UnexpectedValueException("The file {$file} does not exist!");
        }

        $code = @file_get_contents($file);

        if ($code === false || $code === null) {
            throw new UnexpectedValueException("The file {$file} could not be read, it may be protected!");
        }

        $code = $this->convertEncodingIfNecessary($code);

        return $code;
    }

    /**
     * @param string $code
     *
     * @return string
     */
    protected function convertEncodingIfNecessary($code)
    {
        if ($this->autoConvertToUtf8) {
            return $this->convertEncodingToUtf8($code);
        }

        return $code;
    }

    /**
     * @param string $code
     *
     * @return string
     */
    protected function convertEncodingToUtf8($code)
    {
        $encoding = mb_detect_encoding($code, null, true);

        if (!in_array($encoding, ['UTF-8', 'ASCII'], true)) {
            $code = mb_convert_encoding($code, 'UTF-8', $encoding);
        }

        return $code;
    }
}
