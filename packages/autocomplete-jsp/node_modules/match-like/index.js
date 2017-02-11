'use strict';

/**
 * Util function to serve as an alternative to the `switch` statement inspired
 * by Rusts `match` expression
 *
 * @param  {*}     value  - Value of any type to match against.
 * @param  {Array} checks - Array of checks. All checks will be executed in
 *                          order until the first match. The every check is
 *                          an array starting with n values and ending with
 *                          a function as it's last element.
 * @return {*}            - The value returned by the executed handler.
 */
module.exports = function match(value, checks) {
    if (!checks) {
        return;
    }

    if (typeof checks.length !== 'number') {
        throw new Error('The second argument has to be an array of checks');
    }

    for (let i = 0; i < checks.length; i += 1) {
        if (!(i in checks)) {
            continue;
        }

        if (typeof checks[i].pop !== 'function' || typeof checks[i].indexOf !== 'function') {
            throw new Error('Every check has to be of type array');
        }

        let func = checks[i].pop();

        if (typeof func !== 'function') {
            throw new Error('The last element in the checks array has to be a function');
        }

        let variants = checks[i];
        let index = variants.indexOf(value);

        if (index !== -1 || variants.length === 0) {
            return func(variants[index], index, variants);
        }
    }
};
