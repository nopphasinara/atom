'use strict';

let AtomAwesome;
let Provider;

let atomAwesome = {
  privateConfig: {},
  config: {},
  id: 'atom-awesome',

  requireFromPackage: function (moduleId) {
    if (isNotUndefined(moduleId) && isString(moduleId)) {
      var filepath = stdpath.join(this.getPackagePath(), moduleId);
      if (isExistsSync(filepath)) {
        return require(filepath);
      }
    }
    return {};
  },

  getPackagePath: function () {
    let filepath = fse.realpathSync(stdpath.join(atom.getLoadSettings().atomHome, 'packages', this.id));
    return filepath;
  },

  getPackageMainPath: function () {
    let filepath = fse.realpathSync(stdpath.join(atom.getLoadSettings().atomHome, 'packages', this.id, 'lib'));
    return filepath;
  },

  getAtomNodePath: function () {
    let filepath = fse.realpathSync(stdpath.join(atom.getLoadSettings().atomHome, 'node_modules'));
    return filepath;
  },

  setConfig: function () {
    if (isNotUndefined(Provider) && isObject(Provider)) {
      this.config = Provider.config;
    }
    this.privateConfig.packagePath = this.getPackagePath();
    this.privateConfig.packageMainPath = stdpath.join(this.privateConfig.packagePath, 'lib/main.js');
  },

  registerCommands: function () {
    let CommandManager = this.requireFromPackage('lib/commands.js');
    CommandManager.registerCommands();
  },

  activate: function () {
    console.log('activate atom-awesome');
  },

  getProvider: function() {
    let fse = require('fs-extra');
    let stdpath = require('path');
    let _ = require('lodash');

    global.fse = fse;
    global.stdpath = stdpath;
    global._ = _;

    AtomAwesome = require(stdpath.join(this.getAtomNodePath(), 'atom-awesome/lib/main.js'));
    AtomAwesome.getProvider();
    Provider = require(stdpath.join(this.getPackagePath(), 'lib', 'provider.js'));

    this.setConfig();

    this.registerCommands();

    return Provider;
  },
};

console.clear();

console.group('atomAwesome');
console.log(atomAwesome);
console.groupEnd();

module.exports = atomAwesome;
