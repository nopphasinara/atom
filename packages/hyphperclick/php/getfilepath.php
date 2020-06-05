<?php
$class = $argv[1];
$file = $argv[2];
$rootpath = $argv[3];
$search = $argv[4];
$autoloader = $rootpath . '/vendor/autoload.php';
if (file_exists($autoloader)) {
    $loader = require $autoloader;
    require __DIR__ . '/ClassMatcher.php';
    $contents = file_get_contents($file);
    $classMatcher = new shameerc\ClassMatcher($contents,$class, $search);
    $fileName = $classMatcher->getSuggestedFilename();
    if($fileName) {
        echo $loader->findFile($fileName);
    }
}
