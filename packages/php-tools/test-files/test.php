<?php

class Foo
{
    /** @var [TYPE] **/
    private $foo;

    /** @var [TYPE] **/
    private $bar;

    /** @var string **/
    private $baz;

    public function __construct($foo, $bar, string $baz)
    {
    }
}

class Bar
{
    /** @var int **/
    private $berry;

    /** @var bool **/
    private $theBug;
    public function __construct(int $berry, bool $theBug)
    {
    }
}
