console.clear();

var _ = require('lodash');
var fse = require('fs-extra');
var stdpath = require('path');

function requireModule(moduleId) {
  var cachedModule = {};

  moduleId = moduleId || undefined;
  if (!moduleId) {
    throw new Error('xxxxx');
  }

  try {
    cachedModule = require(moduleId);
  } catch (err) {
    try {
      cachedModule = require(resolveFromNodeModule(moduleId));
    } catch (err) {
      throw new Error('Cannot file module ' + moduleId);
    }
  }

  return cachedModule;
}

function typeOf(value) {
  return typeof value;
}

function isTypeOf(value, needle) {
  needle = needle || 'undefined';
  return typeof value === needle;
}

function isNotTypeOf(value, needle) {
  needle = needle || 'undefined';
  return typeof value !== needle;
}

function isUndefined(value) {
  return isTypeOf(value, 'undefined');
}

function isObject(value) {
  return isTypeOf(value, 'object');
}

function isFunction(value) {
  return isTypeOf(value, 'function');
}

function isString(value) {
  return isTypeOf(value, 'string');
}

function isArray(value) {
  return isNotTypeOf(value, 'string') ? Array.isArray(value) : false;
}

function hasProp(obj, prop) {
  if (!isUndefined(obj) && !isUndefined(prop) && isObject(obj) && isString(prop) && prop) {
    return Object(obj).hasOwnProperty(prop);
  }
  return false;
}

function assignTo(obj, props) {
  obj = obj || {};
  props = props || {};
  return Object.assign(obj, props);
}

function customGetCursorScope() {
  var editor = atom.workspace.getActiveTextEditor();
  var cursorScope = editor.getCursorScope();
  var treeScope = editor.getCursorSyntaxTreeScope();
  var result = null;

  atom.openDevTools();
  // atom.commands.dispatch(atom.views.getView(editor), 'window:toggle-dev-tools');

  result = cursorScope.toString();
  console.log(result);

  return result;
}

function getSnippetsService() {
  var snippets = atom.packages.getActivePackage('snippets');
  var snippetsService = null;

  if (snippets) {
    snippetsService = snippets.mainModule;
  }

  return snippetsService;
}

function insertSnippet(text = null, editor = null, cursor = null) {
  const snippetsService = getSnippetsService();
  snippetsService.insert(text, editor, cursor);
}

function escapeCharacters(str = null, chars = null, unescape = false) {
  if (undefined == str || str == '' || ! str) {
    return null;
  }

  if (undefined != unescape && unescape && (unescape === 1 || unescape === '1' || unescape === true || unescape === 'true')) {
    unescape = true;
  } else {
    unescape = false;
  }

  if (unescape) {
    str = str.replace(/(\\\\|\\\{|\\\}|\\\$|\\\")/g, "$1");
  }
  str = str.replace(/(\\|\{|\}|\$|\")/g, "\\$1");

  return str;
}

function customPeriodJoin() {
  var editor = atom.workspace.getActiveTextEditor();

  editor.mutateSelectedText(function (selection, i) {
    var selectedText = selection.getText();
    var bufferRange = selection.getBufferRange();
    selection.editor.selectLargerSyntaxNode();
    var startsWith = selection.getText().substr(0, 1);
    startsWith = (startsWith === "'" || startsWith === '"') ? startsWith : "'";
    selection.setBufferRange(bufferRange);
    var joinText = '';

    if (selectedText) {
      joinText = selectedText;
    }

    joinText = [''+ startsWith +'. ${1:', escapeCharacters(joinText, null, true), '} .'+ startsWith +''].join('');
    insertSnippet(joinText +'$0', selection.editor, selection.cursor);
  });
}

function customPlusJoin() {
  var editor = atom.workspace.getActiveTextEditor();

  editor.mutateSelectedText(function (selection, i) {
    var selectedText = selection.getText();
    var bufferRange = selection.getBufferRange();
    selection.editor.selectLargerSyntaxNode();
    var startsWith = selection.getText().substr(0, 1);
    startsWith = (startsWith === "'" || startsWith === '"') ? startsWith : "'";
    selection.setBufferRange(bufferRange);
    var joinText = '';

    if (selectedText) {
      joinText = selectedText;
    }

    joinText = [''+ startsWith +'+ ${1:', escapeCharacters(joinText, null, true), '} +'+ startsWith +''].join('');
    insertSnippet(joinText +'$0', selection.editor, selection.cursor);
  });
}

_.assign(global, {
  customPeriodJoin,
  customPlusJoin,
  escapeCharacters,
  insertSnippet,
  getSnippetsService,
  customGetCursorScope,
  requireModule,
  typeOf,
  isTypeOf,
  isNotTypeOf,
  isUndefined,
  isObject,
  isFunction,
  isString,
  isArray,
  hasProp,
  assignTo,
});

var ATOM_HOME_PATH = fse.realpathSync(atom.getLoadSettings().atomHome);
var ATOM_PACKAGES_PATH = stdpath.join(ATOM_HOME_PATH, 'packages');
var ATOM_NODE_MODULES_PATH = stdpath.join(ATOM_HOME_PATH, 'node_modules');

var resolveFrom = require('resolve-from');
var resolveFromAtomHome = resolveFrom.bind(null, stdpath.join(ATOM_HOME_PATH));
var resolveFromAtomPackages = resolveFrom.bind(null, stdpath.join(ATOM_PACKAGES_PATH));
var resolveFromNodeModules = resolveFrom.bind(null, stdpath.join(ATOM_NODE_MODULES_PATH));

atom.commands.add('atom-workspace atom-text-editor:not([mini])', 'custom:cursor-scope', customGetCursorScope);
atom.commands.add('atom-workspace atom-text-editor:not([mini])', 'custom:period-join', customPeriodJoin);
atom.commands.add('atom-workspace atom-text-editor:not([mini])', 'custom:plus-join', customPlusJoin);