"use strict";

var _fs = _interopRequireDefault(require("fs"));

function _nuclideUri() {
  const data = _interopRequireDefault(require("../../../modules/nuclide-commons/nuclideUri"));

  _nuclideUri = function () {
    return data;
  };

  return data;
}

function _process() {
  const data = require("../../../modules/nuclide-commons/process");

  _process = function () {
    return data;
  };

  return data;
}

function _a_file_search_should() {
  const data = require("../__mocks__/a_file_search_should");

  _a_file_search_should = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */
jest.setTimeout(30000);

async function gitTestFolder() {
  const folder = await (0, _a_file_search_should().createTestFolder)();
  await (0, _process().runCommand)('git', ['init'], {
    cwd: folder
  }).toPromise();
  await (0, _process().runCommand)('git', ['add', '*'], {
    cwd: folder
  }).toPromise(); // After adding the existing files to git, add an ignored file to
  // prove we're using git to populate the list.

  const ignoredFile = 'ignored';

  _fs.default.writeFileSync(_nuclideUri().default.join(folder, ignoredFile), '');

  _fs.default.writeFileSync(_nuclideUri().default.join(folder, '.gitignore'), `.gitignore\n${ignoredFile}`);

  return folder;
}

(0, _a_file_search_should().aFileSearchShould)('Git', gitTestFolder);