'use babel';

console.clear();

var path, fs, _;

if (typeof path === 'undefined' || !path) path = require('path');
if (typeof fs === 'undefined' || !fs) fs = require('fs-extra');
if (typeof _ === 'undefined' || !_) _ = require('lodash');

var ATOM_HOME_PATH = atom.getLoadSettings().atomHome;
var PACKAGE_NAME = 'atom-awesome-utils';
var PACKAGE_MAIN = atom.workspace.getActiveTextEditor().getPath();
var PACKAGE_MAIN_DIR = path.dirname(PACKAGE_MAIN);

function resolveFromPath(fromPath = '') {
  resolveFromPath.prototype.hasPrefixPath = () => {
    return this.value;
  };

  if (typeof fromPath !== 'string' || !fromPath) {
    fromPath = PACKAGE_MAIN_DIR;
  }

  this.value = fromPath;

  console.log(fs.realpathSync(fromPath));
  console.log(_.functions(_).join());

  console.log(resolveFromPath().hasPrefixPath());

  return path.resolve(fromPath);
}

console.log(resolveFromPath(''));

module.exports = {
  id: PACKAGE_NAME,

  subscriptions: null,
  // emitters: null,

  serialize: () => {

  },

  initialize: () => {

  },

  activate: (state) => {

  },

  deactivate: () => {

  },
};
