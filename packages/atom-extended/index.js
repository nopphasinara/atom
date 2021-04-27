// const log4js = require('log4js');
// console.group('log4js');
// console.log(log4js);
// console.groupEnd();
// log4js.configure({
//   appenders: {
//     cheese: {
//       type: 'file',
//       filename: 'cheese.log',
//     },
//   },
//   categories: {
//     default: {
//       appenders: [
//         'cheese',
//       ],
//       level: 'error',
//     },
//   },
// });
//
// const logger = log4js.getLogger('cheese');
// console.group('logger');
// console.log(logger);
// console.groupEnd();
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Comté.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

console.group('require');
console.log(fs);
console.log(fs.prototype || Object.getPrototypeOf(fs) || fs.__proto__);
console.log(_);
console.log(_.prototype || Object.getPrototypeOf(_) || _.__proto__);
console.log(path);
console.log(path.prototype || Object.getPrototypeOf(path) || path.__proto__);
console.groupEnd();

const DIRNAME = __dirname;
const FILENAME = __filename;
const BASENAME = path.parse(FILENAME).basename;

console.group(BASENAME);
console.log(DIRNAME);
console.log(FILENAME);
console.groupEnd();
