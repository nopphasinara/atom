/** @babel */

console.clear();

if (atom.workspace.isTextEditor(atom.workspace.getActiveTextEditor())) {
  let ACTIVE_EDITOR_PATH = atom.workspace.getActiveTextEditor().getPath();

  var fs = require('fs');
  var _ = require('lodash');
  var path = require('path');

  var _fs = new Object;
  console.log(typeof fs === typeof _fs);

  // module.loaded = false;
  // module.load([path.dirname(ACTIVE_EDITOR_PATH), 'lib', 'config.js'].join('/'));
  // var Config = module.exports;
  // console.log(Config);

  

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

    getTextEditorPath: function (editor) {
      if (typeof editor === 'undefined') {
        return;
      }
      return (typeof fs === 'undefined') ? editor.getPath() : fs.realpathSync(editor.getPath());
    },

  };

  const FILENAME = utils.getTextEditorPath(utils.getActiveTextEditor());
  const DIRNAME = utils.getDirname(FILENAME);
  const BASENAME = utils.getBasename(FILENAME);

  console.group(BASENAME);
  console.log(DIRNAME);
  console.log(FILENAME);
  console.groupEnd();
}
