console.clear();

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

// console.group('require');
// console.log(fs);
// console.log(fs.prototype || Object.getPrototypeOf(fs));
// console.log(_);
// console.log(_.prototype || Object.getPrototypeOf(_));
// console.log(path);
// console.log(path.prototype || Object.getPrototypeOf(path));
// console.groupEnd();

var utils = {

  isTextEditor: function (object) {
    if (typeof object === 'object') {
      return atom.workspace.isTextEditor(object) || false;
    }
    return false;
  },

  pathParse: function (filepath) {
    if (typeof filepath !== 'string') {
      return;
    }
    return path.parse(filepath);
  },

  getDirname: function (filepath) {
    if (typeof filepath !== 'string') {
      return;
    }
    return this.pathParse(filepath).dir;
  },

  getBasename: function (filepath) {
    if (typeof filepath !== 'string') {
      return;
    }
    return this.pathParse(filepath).base;
  },

  getName: function (filepath) {
    if (typeof filepath !== 'string') {
      return;
    }
    return this.pathParse(filepath).name;
  },

  getExt: function (filepath) {
    if (typeof filepath !== 'string') {
      return;
    }
    return this.pathParse(filepath).ext;
  },

  getActiveTextEditor: function () {
    var editor = atom.workspace.getActiveTextEditor();
    const isTextEditor = this.isTextEditor(editor);
    if (isTextEditor) {
      return editor;
    }
    return;
  },

  getActiveTextEditorPath: function (editor) {
    if (typeof editor === 'undefined') {
      editor = this.getActiveTextEditor();
    } else {
      if (typeof editor.getPath === 'undefined') {
        return;
      }
    }
    return (typeof fs === 'undefined') ? editor.getPath() : fs.realpathSync(editor.getPath());
  },

};

const FILENAME = utils.getActiveTextEditorPath();
const DIRNAME = utils.getDirname(FILENAME);
const BASENAME = utils.getBasename(FILENAME);

console.group(BASENAME);
console.log(DIRNAME);
console.log(FILENAME);
console.groupEnd();
