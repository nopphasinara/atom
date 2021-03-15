;(function () {

  var ATOM_HOME_PATH = '';
  var ATOM_PACKAGES_PATH = '';

  function requireAtomPath(filepath) {
    return require(stdpath.join(ATOM_HOME_PATH, filepath));
  }

  function requireAtomPackagePath(filepath) {
    return require(stdpath.join(ATOM_PACKAGES_PATH, filepath));
  }

  function requirePackagePath(filepath) {
    return require(stdpath.join(this.PACKAGE_PATH, filepath));
  }

  function requireMainPath(filepath) {
    return require(stdpath.join(this.PACKAGE_MAIN_PATH, filepath));
  }

  function loadDeps() {
    if (!global.hasOwnProperty('_')) {
      global._ = require('lodash');
    }

    if (!global.hasOwnProperty('stdpath')) {
      global.stdpath = require('path');
    }

    if (!global.hasOwnProperty('fse')) {
      global.fse = require('fs-extra');
    }
  }

  module.exports = {
    loadSettings: function () {
      ATOM_HOME_PATH = fse.realpathSync(atom.getLoadSettings().atomHome);
      ATOM_PACKAGES_PATH = stdpath.join(ATOM_HOME_PATH, 'packages');
    },

    runtimeGenerator: function () {

    },

    initialize: function () {
      loadDeps();
      this.loadSettings();
      this.runtimeGenerator();

      this.PACKAGE_NAME = 'atom-awesome';
      this.PACKAGE_PATH = stdpath.join(ATOM_PACKAGES_PATH, this.PACKAGE_NAME);
      this.PACKAGE_MAIN_PATH = stdpath.join(this.PACKAGE_PATH, 'lib');

      requireMainPath('utils.js');
    },

    activate: function () {

    },

    deactivate: function () {

    },
  };

}());
