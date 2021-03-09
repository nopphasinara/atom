[![Actions Status](https://github.com/UziTech/promisificator/workflows/CI/badge.svg)](https://github.com/UziTech/promisificator/actions)

# promisificator

Returns a `promise` and a `callback` that will fulfill the `promise`.

## Examples

#### 1. Use the callback in an async function to resolve the promise

```javascript
const fs = require("fs");
const promisificator = require("promisificator");

const {
  promise,
  callback,
} = promisificator({rejectOnError: true});

//`callback` can be passed to any async function that takes a callback
fs.readFile("/etc/password", callback);

//`promise` will be fulfilled once the callback is called
promise.then((data) => {
  console.log(data);
}, (err) => {
  throw err;
});
```

#### 2. Allow a function to accept a callback or return a promise

```javascript
const promisificator = require("promisificator");

function myFunc(arg, cb) {
  const {
    promise,
    callback,
  } = promisificator(cb);

  // `cb` will be wrapped in `process.nextTick` so it won't be
  // called immediately if it is a callback
  callback(null, arg);

  // if `cb` is a function `promise` will be undefined
  return promise;
}

myFunc("promise").then(console.log, console.error);

myFunc("callback", (err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(result);
});
```

#### 3. Turn a callback function into a promise

```javascript
const fs = require("fs");
const { promisify } = require("promisificator");

//`promisify(fs.readFile)` will return a function that returns a promise
promisify(fs.readFile, {callbackArg: -1})("/etc/password").then((data) => {
  console.log(data);
}, (err) => {
  throw err;
});
```

## Options

#### rejectOnError

Default: `true`

Reject the promise if the first argument of the callback is truthy.

#### alwaysReturnArray

Default: `false`

Resolve the promise with an array of values if there is only one argument.

By default Promisificator will return an array only if there is more than one non-error argument sent to the callback.

#### useNextTick

Default: `true`

If a callback is provided use [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback_args) when calling the callback to ensure that it is called asynchronously.

If this is set to `false` the callback can be called before the function returns, which might lead to unexpected results.

#### callbackArg

Default: `-1`

The argument index to place the callback for `promisify`.

Negative values will be from the end of the function arguments. Positive values start at 0.
