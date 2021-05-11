/** @babel */

console.clear();

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var utils = {

  isTextEditor: function (editor) {
    if (typeof editor === 'object') {
      return atom.workspace.isTextEditor(editor) || false;
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
    var isTextEditor = atom.workspace.isTextEditor(editor);
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

atom.packages.onDidActivateInitialPackages(() => {

  console.log(atom.packages);
  console.log(atom);

  if (utils.isTextEditor(utils.getActiveTextEditor())) {
    let ACTIVE_EDITOR_PATH = utils.getTextEditorPath(utils.getActiveTextEditor());
    let ACTIVE_EDITOR_DIR = utils.getDirname(ACTIVE_EDITOR_PATH);

    console.log(path.resolve([path.dirname(ACTIVE_EDITOR_PATH), 'lib', '../../../', 'config.js'].join('/')));

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

    const FILENAME = utils.getTextEditorPath(utils.getActiveTextEditor());
    const DIRNAME = utils.getDirname(FILENAME);
    const BASENAME = utils.getBasename(FILENAME);

    console.group(BASENAME);
    console.log(DIRNAME);
    console.log(FILENAME);
    console.groupEnd();
  }

});
