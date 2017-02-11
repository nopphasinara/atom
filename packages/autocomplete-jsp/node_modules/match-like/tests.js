'use strict';

const match = require('.');

let failedTestsCount = 0;

function test(desc, func) {
    console.log(`Test ${desc}`);

    let failed = false;

    function expect(res, what) {
        if (!res) {
            failed = true;

            console.log(` ✗ expect ${what}`);
        } else {
            console.log(` ✓ expect ${what}`);
        }
    }

    func(expect);

    if (failed) {
        failedTestsCount += 1;
    }
}

test('simple pattern', expect => {
    let calledFunc;

    match(10, [
        [0,        () => calledFunc = 0],
        [8, 7, 10, () => calledFunc = 1],
        [8, 10,    () => calledFunc = 2]
    ]);

    expect(calledFunc === 1,
            'the right function to be called');
});


test('pattern with wildcard', expect => {
    let calledFunc;

    match(10, [
        [1, 2, 3, () => calledFunc = 0],
        [         () => calledFunc = 1],
        [4,       () => calledFunc = 2],
        [7, 8,    () => calledFunc = 3]
    ]);

    expect(calledFunc === 1,
            'the right function to be called');
});


test('pattern with mixed types', expect => {
    let calledFunc;

    match(null, [
        ['abc', 'b', () => calledFunc = 0],
        [4, 5, '1',  () => calledFunc = 1],
        [7, null,    () => calledFunc = 2],
        [undefined,  () => calledFunc = 3]
    ]);

    expect(calledFunc === 2,
            'the right function to be called');
});


test('pattern with object pointers', expect => {
    let someObj = {};

    let calledFunc;

    match(someObj, [
        ['abc', 'b',      () => calledFunc = 0],
        [4, someObj, '1', () => calledFunc = 1],
        [7, null,         () => calledFunc = 2],
        [undefined,       () => calledFunc = 3]
    ]);

    expect(calledFunc === 1,
            'the right function to be called');
});


test('pattern with object pointers', expect => {
    let someArray = [15, 80, 'abc', 15, null, undefined, 'hello', NaN, {foo: 'bar'}, [], 80];

    let calledFunc;

    match(15, [
        [80,           () => calledFunc = 0],
        [...someArray, () => calledFunc = 1],
        [7, '', null,  () => calledFunc = 2],
        [              () => calledFunc = 2],
    ]);

    expect(calledFunc === 1,
        'the right function to be called');
});


test('return value', expect => {
    let retVal = match(42, [
        [42, () => 'my return value']
    ]);

    expect(retVal === 'my return value',
            'the return value to be passed through');
});


test('arguments', expect => {
    match(2, [
        [1, 2, 3, 4, (match, matchIndex, allValue) => {

            expect(matchIndex === 1,
                    'the first argument to be the matched element');

            expect(matchIndex === 1,
                    'the second argument to be the matched elements index');

            expect(allValue.length === 4 && allValue[0] === 1 && allValue[1] === 2,
                    'the third argument to be all elements in the pattern');
        }]
    ]);
});


if (failedTestsCount <= 0) {
    console.log('\nAll tests have passed successfully');
} else {
    console.log(`\n${failedTestsCount} tests have failed`);
}

process.exit(failedTestsCount);
