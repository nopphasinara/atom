<?php
require dirname(__DIR__) . '/ClassMatcher.php';

require __DIR__ . '/Another/World.php';
require __DIR__ . '/Hello/World.php';
require __DIR__ . '/Hello/Comma.php';
require __DIR__ . '/Hello/Separated.php';
require __DIR__ . '/World/Comma.php';
require __DIR__ . '/World/NewLineSeparated.php';

// Thank you https://gist.github.com/mathiasverraes/9046427
function should($e,$a){echo (($e == $a)?'✔︎':'✘')." ".$e." should match ".$a."\n"; if(!($e==$a)){$GLOBALS['f']=1;}}function done(){if(@$GLOBALS['f'])die(1);}

$expected = array(
    'World' => 'Hello\World',
    'AnotherWorld' => 'Another\World',
    'Comma' => 'Hello\Comma',
    'Separated' => 'Hello\Separated',
    'new Hello\Separated' => 'Hello\Separated',
    'WorldComma' => 'World\Comma',
    'NewLineSeparated' => 'World\NewLineSeparated'
);
$contents = file_get_contents(__DIR__ . '/TestClass.php');

foreach($expected as $item => $result) {
    $classMatcher = new shameerc\ClassMatcher($contents, $item, $item);
    should($result,$classMatcher->getSuggestedFilename());
}
