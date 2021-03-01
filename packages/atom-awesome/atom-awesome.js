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

_.assign(global, {
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