<?php
namespace shameerc;

use Hello\World;
use Another\World as AnotherWorld;
use Hello\Comma, Hello\Separated;
use World\Comma as WorldComma,
    World\NewLineSeparated;

class TestClass extends AnotherWorld
{
    public function __construct()
    {
        $world = new \Hello\World();
    }
}
