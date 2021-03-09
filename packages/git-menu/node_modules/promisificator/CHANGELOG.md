# [4.2.0](https://github.com/UziTech/promisificator/compare/v4.1.1...v4.2.0) (2020-06-11)


### Features

* add option to not use nextTick to call callback ([2ada7fd](https://github.com/UziTech/promisificator/commit/2ada7fd1e3dd52c845638b17bb0e96b685846778))

# Change Log

## 4.1.0

 - add options `rejectOnError`, `alwaysReturnArray`, and `callbackArg`

## 4.0.0

 - get promisify from `promisificator.promisify` instead of `promisificator().promisify`
 - `promisify` will now create a new promise for every call of a promisified function
