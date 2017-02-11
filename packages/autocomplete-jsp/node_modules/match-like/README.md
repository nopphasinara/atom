# match-like
Util function to serve as an alternative to the `switch` statement inspired by [Rusts](https://www.rust-lang.org) [`match` expression](https://doc.rust-lang.org/book/match.html)

Using match will make some of your code more readable and allow
you to use the immutable `const` more often.

[![Build Status](https://travis-ci.org/MoritzKn/match-like.svg?branch=master)](https://travis-ci.org/MoritzKn/match-like)


## Install
```sh
npm install match-like --save
```

## Usage
```js
const match = require('match-like');

let returnValue = match(someValue, [
    [valueToMatch1, valueToMatch2, (value, i, all) =>
        someExpression],
    // more checks ...
    [() => defaultExpression,
]);

```

## Parameters
- **value**  
  Value of any type to match against.
- **checks**  
  Array of checks. All checks will be executed in order
  until the first match.
    - **check**  
      Array starting with n values and ending
      with a function as it's last element.
        - **value**  
          Values of any type to check against. If any of
          the values is equal (`===`) to the first value
          supplied to the `match` function, the `handler`
          will be executed. If zero values are supplied
          the `handler` will be executed in any why.
        - **handler**  
          Callback function that will be executed if any
          of the values matches. The callback takes three
          optional arguments:
            - **matchedValue**
              The the matched element.
            - **matchIndex**
              The index of the matched value.
            - **allValues**
              Array with all values i.e. the `check` without
              the `handler`.

## Comparison

### With match

```js
const match = require('match-like');

const num = 7;
const what = match(num, [
    [0, 2, 4, 6, 8, () => 'an even number'],
    [1, 3, 5, 7, 9, () => 'an odd number'],
    [() => 'unknown']
]);

console.log(`${num} is ${what}`);
// => 7 is an odd number
```

### With switch

```js
const num = 7;

let what;
switch (num) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 8:
        what = 'an even number';
        break;
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
        what = 'an odd number';
        break;
    default:
        what = 'unknown';
}

console.log(`${num} is ${what}`);
// => 7 is an odd number
```

### In Rust

```rust
let num = 7;
let what = match num {
    0 | 2 | 4 | 6 | 8 => "an even number",
    1 | 3 | 5 | 7 | 9 => "an odd number",
    _ => "unknown"
};

println!("{} is {}", num, what);
// => 7 is an odd number
```

## Example

```js
const match = require('match-like');

const now = new Date();
const day = now.getDay();

const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const weekendDays = ['saturday', 'sunday'];

function getDayName(dayNum) {
    return match(dayNum, [
        [0, () => 'sunday'],
        [1, () => 'monday'],
        [2, () => 'tuesday'],
        [3, () => 'wednesday'],
        [4, () => 'thursday'],
        [5, () => 'friday'],
        [6, () => 'saturday'],
        [() => 'not a day'],
    ]);
}

const message = match(getDayName(day), [
    [...workingDays, () => 'It\'s a working day'],
    [...weekendDays, () => 'It\'s weekend'],
]);
console.log(message);
```
