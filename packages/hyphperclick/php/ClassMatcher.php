<?php namespace shameerc;

class ClassMatcher
{
    protected $classMap = '';
    protected $search;
    protected $word;
    protected $currentNamespace = '';

    public function __construct($contents, $word, $search)
    {
        $this->generateClassMap($contents);
        $this->setSearchString($search);
        $this->word = $word;
    }

    protected function generateClassMap($contents) {
        $tokens = token_get_all($contents);
        $shortName = $className = '';
        $useNamespace = $useFlag = $asFlag = 0;
        $result = array();
        $namespace = [];
        $classes = [];
        $i = 0;
        do{
            $token = $tokens[$i];
            if(is_array($token)) {
                if($token[1] == T_NAMESPACE) {
                    while ($token != ";") {
                        $i++;
                        $token = $tokens[$i];
                        if(is_array($token) && !empty(trim($token[1]))) {
                            $namespace[] = $token[1];
                        }
                    }
                }
                elseif($token[1] == 'use') {
                    $tempClasses = [];
                    $shortNames = "";
                    $aliasFlag = false;
                    $j = 0;
                    while ($token != ";") {
                        $i++;
                        $token = $tokens[$i];
                        if($token == ",") {
                            $j++;
                        }
                        if(is_array($token) && !empty(trim($token[1])) ) {
                            if($token[1] == 'as') {
                                $aliasFlag = true;
                            }
                            else if($aliasFlag) {
                                $shortNames[$j] = $token[1];
                                $aliasFlag = false;
                            }
                            else {
                                $tempClasses[$j][] = $token[1];
                            }
                        }
                    }
                    foreach ($tempClasses as $key => $tempClass) {
                        $className = implode("", $tempClass);
                        $shortName = "";
                        if(!empty($shortNames[$key])) {
                            $shortName = $shortNames[$key];
                            $classes[$shortName] = $className;
                        }
                        else {
                            $shortName = $this->getShortName($className);
                            $classes[$shortName] = $className;
                        }
                        $classes[$className] = $className;
                    } 
                }
            }
            $i++;
        } while($tokens[$i][0] != T_CLASS && !empty($tokens[$i]));
        if(!empty($namespace)) {
            $this->currentNamespace = implode("", $namespace);
        }
        $this->classMap = $classes;
    }

    protected function setSearchString($search) {
        $searchSplit = explode(' ', trim($search));
        $this->search = end($searchSplit);
        $this->search = trim($this->search, '"\\');
    }

    public function getSuggestedFilename() {
        if(!empty($this->classMap[$this->search])) {
            return $this->classMap[$this->search];
        }
        elseif($this->currentNamespace != "") {
            return $this->currentNamespace . '\\' . $this->word;
        }
        return false;
    }

    public function getFileName($loader)
    {
        if($first = $loader->findFile($this->search)) {
            return $first;
        }
    }

    protected function getShortName($className)
    {
        $shortName = "";
        try{
            $reflex = new \ReflectionClass($className);
            $shortName = $reflex->getShortName();
        }
        catch(Exception $e) {}
        return $shortName;
    }
}
