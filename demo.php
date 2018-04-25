<?php

// <?php = .punctuation.section.embedded > darken(@red, 10%)

/* Comments > @light-gray */

// function = .storage > @purple
// function_name = .entity.name.function > @blue
function function_name() {

  // return = .keyword.control > @purple
  // array = .support.function > @cyan
  // string = .string > @green
  return array(
    'string' => 'string',
    'string' => 'string',
    'string' => true
  );

}

// $ = .punctuation.definition.variable > @very-light-gray
// var_name = .variable > @red
// new = .keyword > @purple
// SUPPORT_CLASS = .support.class > @light-orange
// true = .constant > @orange
$var_name = new SUPPORT_CLASS(true);

echo "${foo}";

function_name();

/**
*
*/
class ClassName extends AnotherClass
{

  public $var1 = null;
  static $var2 = null;

  public static function __construct(argument)
  {
    # code...
  }

  private function __construct(argument)
  {
    # code...
  }
}

?>

<style media="screen">
  body {
    background: red;
  }
</style>
<script type="text/javascript">
  console.log(window);
</script>
<div class="xxx">
  xxx
</div>
