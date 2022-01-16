# JavaScript Pop Quiz

## What's the Essential Difference Between These Code Blocks?

```JS

function PrototypicalGreeting(greeting = "Hello", name = "World") {
  this.greeting = greeting
  this.name = name
}

PrototypicalGreeting.prototype.greet = function() {
  return `${this.greeting}, ${this.name}!`
}

const greetProto = new PrototypicalGreeting("Hey", "folks")
console.log(greetProto.greet())

```

```JS

class ClassicalGreeting {
  constructor(greeting = "Hello", name = "World") {
    this.greeting = greeting
    this.name = name
  }

  greet() {
    return `${this.greeting}, ${this.name}!`
  }
}

const classyGreeting = new ClassicalGreeting("Hey", "folks")

console.log(classyGreeting.greet())

```

The answer here is there isn't one. These do effectively the same thing, it's only a question of whether ES6 class syntax was used.

True, the second example is more expressive. For that reason alone, you might argue that `class` is a nice addition to the language. Unfortunately, the problem is a little more subtle.


## What Does the Following Code Do?

```JS

function Proto() {
  this.name = 'Proto'
  return this;
}

Proto.prototype.getName = function() {
  return this.name
}

class MyClass extends Proto {
  constructor() {
    super()
    this.name = 'MyClass'
  }
}

const instance = new MyClass()

console.log(instance.getName())

Proto.prototype.getName = function() { return 'Overridden in Proto' }

console.log(instance.getName())

MyClass.prototype.getName = function() { return 'Overridden in MyClass' }

console.log(instance.getName())

instance.getName = function() { return 'Overridden in instance' }


console.log(instance.getName())

```

The correct answer is that it prints to console:

```JS

> MyClass
> Overridden in Proto
> Overridden in MyClass
> Overridden in instance

```

If you answered incorrectly, you don't understand what `class` actually is. This isn't your fault. Much like `Array`, `class` is not a language feature, it's syntactic obscurantism. It tries to hide the prototypical inheritance model and the clumsy idioms that come with it, and it implies that JavaScript is doing something that it is not.

You might have been told that `class` was introduced to JavaScript to make classical OOP developers coming from languages like Java more comfortable with the ES6 `class` inheritance model. If you are one of those developers, that example probably horrified you. It should. It shows that JavaScript's `class` keyword doesn't come with any of the guarantees that a `class` is meant to provide. It also demonstrates one of the key differences in the prototype inheritance model: Prototypes are _object instances_, not _types_.


#### Reference:

- sss