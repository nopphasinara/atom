console.clear();

var _ = require('lodash');
var stdPath = require('path');
var fs = require('fs');
var editor = atom.workspace.getActiveTextEditor();
var packagesPath = '/Volumes/Storage/Projects/npm-packages';
var pathParse = packagesPath + '/commands-helper/lib/commands-helper.js';

// console.log(pathParse);

var CommandHelper = require(pathParse);
console.log(CommandHelper);