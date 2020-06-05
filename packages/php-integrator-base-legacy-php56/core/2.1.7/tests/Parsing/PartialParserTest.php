<?php

namespace PhpIntegrator\Tests\Parsing;

use PhpIntegrator\Parsing\PartialParser;

use PhpParser\Node;
use PhpParser\ParserFactory;

class PartialParserTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @return ParserFactory
     */
    protected function createParserFactoryStub()
    {
        return new ParserFactory();
    }

    /**
     * @return PartialParser
     */
    protected function createPartialParser()
    {
        return new PartialParser($this->createParserFactoryStub());
    }

    /**
     * @return void
     */
    public function testParsesFunctionCalls()
    {
        $source = <<<'SOURCE'
<?php

array_walk
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\ConstFetch::class, $result);
        $this->assertEquals('array_walk', $result->name->toString());
    }

    /**
     * @return void
     */
    public function testParsesStaticConstFetches()
    {
        $source = <<<'SOURCE'
<?php

Bar::TEST_CONSTANT
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\ClassConstFetch::class, $result);
        $this->assertEquals('Bar', $result->class->toString());
        $this->assertEquals('TEST_CONSTANT', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesStaticMethodCallsWithNamespacedClassNames()
    {
        $source = <<<'SOURCE'
<?php

NamespaceTest\Bar::staticmethod()
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\StaticCall::class, $result);
        $this->assertEquals('NamespaceTest\Bar', $result->class->toString());
        $this->assertEquals('staticmethod', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesPropertyFetches()
    {
        $source = <<<'SOURCE'
<?php

$this->someProperty
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result);
        $this->assertEquals('this', $result->var->name);
        $this->assertEquals('someProperty', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesStaticPropertyFetches()
    {
        $source = <<<'SOURCE'
<?php

self::$someProperty
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\StaticPropertyFetch::class, $result);
        $this->assertEquals('self', $result->class);
        $this->assertEquals('someProperty', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesStringWithDotsAndColons()
    {
        $source = <<<'SOURCE'
<?php

'.:'
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\String_::class, $result);
        $this->assertEquals('.:', $result->value);
    }

    /**
     * @return void
     */
    public function testParsesDynamicMethodCalls()
    {
        $source = <<<'SOURCE'
<?php

$this->{$foo}()->test()
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->var);
        $this->assertInstanceOf(Node\Expr\Variable::class, $result->var->var);
        $this->assertInstanceOf(Node\Expr\Variable::class, $result->var->name);
        $this->assertEquals('this', $result->var->var->name);
        $this->assertEquals('foo', $result->var->name->name);
        $this->assertEquals('test', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesMemberAccessWithMissingMember()
    {
        $source = <<<'SOURCE'
<?php

$this->
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result);
        $this->assertEquals('this', $result->var->name);
        $this->assertEquals('', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesMethodCallOnInstantiationInParentheses()
    {
        $source = <<<'SOURCE'
<?php

(new Foo\Bar())->doFoo()
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result);
        $this->assertInstanceOf(Node\Expr\New_::class, $result->var);
        $this->assertEquals('Foo\Bar', $result->var->class);
        $this->assertEquals('doFoo', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesMethodCallOnComplexCallStack()
    {
        $source = <<<'SOURCE'
<?php

$this
    ->testChaining(5, ['Somewhat more complex parameters', /* inline comment */ null])
    //------------
    /*
        another comment$this;[]{}**** /*int echo return
    */
    ->testChaining(2, [
    //------------
        'value1',
        'value2'
    ])

    ->testChaining(
    //------------
        3,
        [],
        function (FooClass $foo) {
            echo 'test';
            //    --------
            return $foo;
        }
    )

    ->testChaining(
    //------------
        nestedCall() - (2 * 5),
        nestedCall() - 3
    )

    ->testChai
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->var);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->var->var);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->var->var->var);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->var->var->var->var);
        $this->assertEquals('testChaining', $result->var->name);
        $this->assertEquals('testChaining', $result->var->var->name);
        $this->assertEquals('testChaining', $result->var->var->var->name);
        $this->assertEquals('testChaining', $result->var->var->var->var->name);
        $this->assertEquals('testChai', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesConstFetchOnStaticKeyword()
    {
        $source = <<<'SOURCE'
<?php

static::doSome
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\ClassConstFetch::class, $result);
        $this->assertEquals('static', $result->class);
        $this->assertEquals('doSome', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesEncapsedString()
    {
        $source = <<<'SOURCE'
<?php

"(($version{0} * 10000) + ($version{2} * 100) + $version{4}"
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\Encapsed::class, $result);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[0]);
        $this->assertEquals('((', $result->parts[0]->value);
        $this->assertInstanceOf(Node\Expr\Variable::class, $result->parts[1]);
        $this->assertEquals('version', $result->parts[1]->name);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[2]);
        $this->assertEquals('{0} * 10000) + (', $result->parts[2]->value);
        $this->assertInstanceOf(Node\Expr\Variable::class, $result->parts[3]);
        $this->assertEquals('version', $result->parts[3]->name);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[4]);
        $this->assertEquals('{2} * 100) + ', $result->parts[4]->value);
        $this->assertInstanceOf(Node\Expr\Variable::class, $result->parts[5]);
        $this->assertEquals('version', $result->parts[5]->name);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[6]);
        $this->assertEquals('{4}', $result->parts[6]->value);
    }

    /**
     * @return void
     */
    public function testParsesEncapsedStringWithIntepolatedMethodCall()
    {
        $source = <<<'SOURCE'
<?php

"{$test->foo()}"
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\Encapsed::class, $result);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->parts[0]);
        $this->assertEquals('test', $result->parts[0]->var->name);
        $this->assertEquals('foo', $result->parts[0]->name);
    }

    /**
     * @return void
     */
    public function testParsesEncapsedStringWithIntepolatedPropertyFetch()
    {
        $source = <<<'SOURCE'
<?php

"{$test->foo}"
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\Encapsed::class, $result);
        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result->parts[0]);
        $this->assertEquals('test', $result->parts[0]->var->name);
        $this->assertEquals('foo', $result->parts[0]->name);
    }

    /**
     * @return void
     */
    public function testParsesStringContainingIgnoredInterpolations()
    {
        $source = <<<'SOURCE'
<?php

'{$a->asd()[0]}'
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\String_::class, $result);
        $this->assertEquals('{$a->asd()[0]}', $result->value);
    }

    /**
     * @return void
     */
    public function testParsesNowdoc()
    {
        $source = <<<'SOURCE'
<?php

<<<'EOF'
TEST
EOF
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\String_::class, $result);
        $this->assertEquals('TEST', $result->value);
    }

    /**
     * @return void
     */
    public function testParsesHeredoc()
    {
        $source = <<<'SOURCE'
<?php

<<<EOF
TEST
EOF
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\String_::class, $result);
        $this->assertEquals('TEST', $result->value);
    }

    /**
     * @return void
     */
    public function testParsesHeredocContainingInterpolatedValues()
    {
        $source = <<<'SOURCE'
<?php

<<<EOF
EOF: {$foo[2]->bar()} some_text

This is / some text.

EOF
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Scalar\Encapsed::class, $result);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[0]);
        $this->assertEquals('EOF: ', $result->parts[0]->value);
        $this->assertInstanceOf(Node\Expr\MethodCall::class, $result->parts[1]);
        $this->assertInstanceOf(Node\Expr\ArrayDimFetch::class, $result->parts[1]->var);
        $this->assertEquals('foo', $result->parts[1]->var->var->name);
        $this->assertEquals(2, $result->parts[1]->var->dim->value);
        $this->assertEquals('bar', $result->parts[1]->name);
        $this->assertInstanceOf(Node\Scalar\EncapsedStringPart::class, $result->parts[2]);
        $this->assertEquals(" some_text\n\nThis is / some text.\n", $result->parts[2]->value);
    }

    /**
     * @return void
     */
    public function testParsesConstFetchWithSpecialClassConstantClassKeyword()
    {
        $source = <<<'SOURCE'
<?php

Test::class
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\ClassConstFetch::class, $result);
        $this->assertEquals('Test', $result->class->toString());
        $this->assertEquals('class', $result->name);
    }

    /**
     * @return void
     */
    public function testParsesShiftExpression()
    {
        $source = <<<'SOURCE'
<?php

1 << 0
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\BinaryOp\ShiftLeft::class, $result);
        $this->assertEquals(1, $result->left->value);
        $this->assertEquals(0, $result->right->value);
    }

    /**
     * @return void
     */
    public function testParsesExpressionWithBooleanNotOperator()
    {
        $source = <<<'SOURCE'
<?php

!$this->one
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\BooleanNot::class, $result);
        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result->expr);
        $this->assertEquals('this', $result->expr->var->name);
        $this->assertEquals('one', $result->expr->name);
    }

    /**
     * @return void
     */
    public function testParsesExpressionWithSilencingOperator()
    {
        $source = <<<'SOURCE'
<?php

@$this->one
SOURCE;

        $result = $this->createPartialParser()->parse($source);

        $this->assertEquals(1, count($result));

        $result = array_shift($result);

        $this->assertInstanceOf(Node\Expr\ErrorSuppress::class, $result);
        $this->assertInstanceOf(Node\Expr\PropertyFetch::class, $result->expr);
        $this->assertEquals('this', $result->expr->var->name);
        $this->assertEquals('one', $result->expr->name);
    }
}
