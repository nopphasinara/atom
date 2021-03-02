<?php

namespace PhpIntegrator\Parsing;

/**
 * Pretty printer extensions that can handle our custom nodes.
 */
class PrettyPrinter extends \PhpParser\PrettyPrinter\Standard
{
    public function parsing_Node_Keyword_Static()
    {
        return 'static';
    }

    public function parsing_Node_Keyword_Self()
    {
        return 'self';
    }

    public function parsing_Node_Keyword_Parent()
    {
        return 'parent';
    }
}
