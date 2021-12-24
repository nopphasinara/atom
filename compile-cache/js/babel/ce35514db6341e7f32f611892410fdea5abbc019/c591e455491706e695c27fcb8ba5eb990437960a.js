Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _promisificator = require("promisificator");

exports["default"] = {

	/**
  * Remove selected files where a parent folder is also selected and group by parent folder.
  * @param  {Object[]} cwdDirs The result of getDirectories()
  * @return {Object} Keys will be cwds and values will be an array of files for that cwd
  */
	consolidateFiles: function consolidateFiles(cwdDirs) {
		var dirs = cwdDirs.filter(function (cwdFile) {
			return cwdFile.isDir;
		}).map(function (cwdFile) {
			return cwdFile.filePath;
		});
		var files = {};
		cwdDirs.forEach(function (cwdFile) {
			var isInSelectedDir = dirs.some(function (dir) {
				return cwdFile.filePath !== dir && cwdFile.filePath.startsWith(dir);
			});
			if (!isInSelectedDir) {
				if (!(cwdFile.cwd in files)) {
					files[cwdFile.cwd] = [];
				}
				files[cwdFile.cwd].push(cwdFile.filePath);
			}
		});
		return files;
	},

	/**
  * Get Default Branch
  * @param  {object[]} branches Array of branch objects
  * @return {object} Branch object
  */
	getDefaultBranch: function getDefaultBranch(branches) {
		var defaultBranchNames = ["master", "main", "default"];

		var _loop = function (branchName) {
			var defaultBranch = branches.find(function (b) {
				return b.name === branchName;
			});
			if (defaultBranch) {
				return {
					v: defaultBranch
				};
			}
		};

		for (var branchName of defaultBranchNames) {
			var _ret = _loop(branchName);

			if (typeof _ret === "object") return _ret.v;
		}

		return null;
	},

	/**
  * Get the paths of the context target
  * @param  {EventTarget} target The context target
  * @return {string[]} The selected paths for the target
  */
	getPaths: function getPaths(target) {
		if (!target) {
			return atom.project.getPaths();
		}

		var treeView = target.closest(".tree-view");
		if (treeView) {
			// called from treeview
			var selected = treeView.querySelectorAll(".selected > .list-item > .name, .selected > .name");
			if (selected.length > 0) {
				return [].concat(_toConsumableArray(selected)).map(function (el) {
					return el.dataset.path;
				});
			}
			return [];
		}

		var tab = target.closest(".tab-bar > .tab");
		if (tab) {
			// called from tab
			var title = tab.querySelector(".title");
			if (title && title.dataset.path) {
				return [title.dataset.path];
			}
			return [];
		}

		var paneItem = atom.workspace.getActivePaneItem();
		if (paneItem && typeof paneItem.getPath === "function") {
			// called from active pane
			return [paneItem.getPath()];
		}

		var textEditor = atom.workspace.getActiveTextEditor();
		if (textEditor && typeof textEditor.getPath === "function") {
			// fallback to activeTextEditor if activePaneItem is not a file
			return [textEditor.getPath()];
		}

		return [];
	},

	/**
  * Get cwds of filePaths
  * @param  {string[]} filePaths The files to check
  * @return {Promise} {Object[]} Will resolve to {cwd, isDir, filePath}
  */
	getDirectories: function getDirectories(filePaths) {
		var directories = Promise.all(filePaths.map(_asyncToGenerator(function* (filePath) {
			var stats = yield (0, _promisificator.promisify)(_fs2["default"].stat, { callbackArg: 1 })(filePath);

			var cwd = undefined;
			var isDir = stats.isDirectory();

			if (isDir) {
				cwd = filePath;
			} else {
				cwd = _path2["default"].dirname(filePath);
			}

			return {
				cwd: cwd,
				isDir: isDir,
				filePath: filePath
			};
		})));

		return directories;
	},

	/**
  * Get a list of unsaved files
  * @param {string[]} filePaths The file paths to check for unsaved
  * @return {string[]} Unsaved files;
  */
	getUnsavedFiles: function getUnsavedFiles(filePaths) {
		var unsavedTabs = document.querySelectorAll(".tab-bar > .tab.modified > .title");
		var unsavedFiles = [].concat(_toConsumableArray(unsavedTabs)).map(function (el) {
			return el.dataset.path;
		});
		return unsavedFiles.filter(function (file) {
			return !!file && filePaths.some(function (filePath) {
				return file.startsWith(filePath);
			});
		});
	},

	/**
  * Refresh Atom git repositories
  * @param {string|string[]} root Root directory(s) of the repo(s)
  * @return {Promise} {void}
  */
	refreshAtom: _asyncToGenerator(function* (root) {
		var directories = undefined;
		if (typeof root === "undefined") {
			directories = atom.project.getDirectories();
		} else {
			(function () {
				var roots = !Array.isArray(root) ? new Set([root.toLowerCase()]) : new Set(root.map(function (r) {
					return r.toLowerCase();
				}));
				directories = atom.project.getDirectories().filter(function (dir) {
					return roots.has(dir.getPath().toLowerCase());
				});
			})();
		}
		yield Promise.all(directories.map(_asyncToGenerator(function* (dir) {
			var repo = yield atom.project.repositoryForDirectory(dir);
			repo.refreshStatus();
		})));
	}),

	/**
  * Get files inside directory
  * @param  {string} dir The file paths to look for files
  * @return {Promise} {string[]} The list of files in directory
  */
	getFilesInDir: _asyncToGenerator(function* (dir) {
		var _this = this;

		var stats = yield (0, _promisificator.promisify)(_fs2["default"].stat, { callbackArg: 1 })(dir);

		if (stats.isDirectory()) {
			var filePaths = yield (0, _promisificator.promisify)(_fs2["default"].readdir, { callbackArg: 2 })(dir);

			var files = yield Promise.all(filePaths.map(function (filePath) {
				return _this.getFilesInDir(_path2["default"].resolve(dir, filePath));
			}));
			return files.reduce(function (prev, file) {
				return prev.concat(file);
			}, []);
		}

		return [dir];
	}),

	/**
  * Get file statuses
  * @param  {string[]} filePaths A list of file/folder paths
  * @param  {Object} git git-cmd
  * @return {Promise} {Object[]} The file statuses
  */
	getStatuses: _asyncToGenerator(function* (filePaths, git) {
		var cwdDirs = yield this.getDirectories(filePaths);

		// remove duplicates
		var cwdFiles = this.consolidateFiles(cwdDirs);
		var cwds = Object.keys(cwdFiles);

		var statuses = yield Promise.all(cwds.map(function (cwd) {
			return git.status(cwd, cwdFiles[cwd]);
		}));

		// flatten statuses
		return statuses.reduce(function (prev, status) {
			return prev.concat(status);
		}, []);
	}),

	/**
  * Get the git root directory
  * @param  {string[]} filePaths A list of file/folder paths
  * @param  {Object} git git-cmd
  * @return {Promise} {string} The root directory
  */
	getRoot: _asyncToGenerator(function* (filePaths, git) {
		if (filePaths.length === 0) {
			// eslint-disable-next-line no-param-reassign
			filePaths = atom.project.getPaths();
		}

		var cwdDirs = yield this.getDirectories(filePaths);

		// remove duplicates
		var cwdFiles = this.consolidateFiles(cwdDirs);

		var rootDirs = yield Promise.all(Object.keys(cwdFiles).map(function (cwd) {
			return git.rootDir(cwd);
		}));
		// remove duplicates
		var roots = [].concat(_toConsumableArray(new Set(rootDirs)));
		if (roots.length > 1) {
			throw "Selected files are not in the same repository";
			// TODO: should we be able to handle this instead of throwing an error?
		}
		return roots[0];
	}),

	/**
  * Get all files associated with context files
  * @param  {string[]} filePaths The context files
  * @param  {Object} git git-cmd
  * @return {Promise} {[string[], string]} Resolves to [files, root]
  */
	getRootAndAllFiles: _asyncToGenerator(function* (filePaths, git) {
		var _this2 = this;

		var getFiles = yield Promise.all(filePaths.map(function (filePath) {
			return _this2.getFilesInDir(filePath);
		}));

		// flatten files
		var allFiles = getFiles.reduce(function (prev, file) {
			return prev.concat(file);
		}, []);
		var files = [].concat(_toConsumableArray(new Set(allFiles)));
		var root = yield this.getRoot(filePaths, git);
		return [files, root];
	}),

	/**
  * Get files git statuses associated with context files
  * @param  {string[]} filePaths The context files
  * @param  {Object} git git-cmd
  * @return {Promise} {[Object[], string]} Resolves to [files, root]
  */
	getRootAndFilesStatuses: _asyncToGenerator(function* (filePaths, git) {

		if (this.getUnsavedFiles(filePaths).length > 0) {
			throw "Save files before running git.";
		}

		var _ref = yield Promise.all([this.getStatuses(filePaths, git), this.getRoot(filePaths, git)]);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		return [files, root];
	}),

	/**
  * Get files associated with context files
  * @param  {string[]} filePaths The context files
  * @param  {Object} git git-cmd
  * @return {Promise} {[Object[], string]} Resolves to [files, root]
  */
	getRootAndFiles: _asyncToGenerator(function* (filePaths, git) {
		var _ref3 = yield this.getRootAndFilesStatuses(filePaths, git);

		var _ref32 = _slicedToArray(_ref3, 2);

		var statuses = _ref32[0];
		var root = _ref32[1];

		var files = statuses.map(function (status) {
			return status.file;
		});
		return [files, root];
	}),

	/**
  * Check if index.lock exists and ask the user to remove it
  * @param  {string} root The root if the git repository
  * @param  {integer} retry Check again after this much time (in ms) to see if the lock file still exists before showing the dialog. A falsey value means no retry.
  * @return {Promise} {void}
  */
	checkGitLock: _asyncToGenerator(function* (root) {
		var retry = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

		var lockPath = _path2["default"].resolve(root, ".git/index.lock");
		var fileExistsAsync = function fileExistsAsync(file) {
			return new Promise(function (resolve) {
				_fs2["default"].access(file, function (err) {
					resolve(!err);
				});
			});
		};

		if (!(yield fileExistsAsync(lockPath))) {
			return;
		}

		if (retry) {
			var stillThere = yield new Promise(function (resolve) {
				setTimeout(_asyncToGenerator(function* () {
					if (yield fileExistsAsync(lockPath)) {
						resolve(true);
					}
					resolve(false);
				}), retry);
			});

			if (!stillThere) {
				return;
			}
		}

		var _ref4 = yield (0, _promisificator.promisify)(atom.confirm.bind(atom), { rejectOnError: false, alwaysReturnArray: true })({
			type: "error",
			checkboxLabel: "Remove Lock",
			checkboxChecked: true,
			message: "Another git process seems to be running in this repository, do you want to remove the lock file and continue?",
			detail: "You are deleting:\n" + lockPath,
			buttons: ["Continue", "Cancel"]
		});

		var _ref42 = _slicedToArray(_ref4, 2);

		var confirmButton = _ref42[0];
		var removeLock = _ref42[1];

		if (confirmButton === 1) {
			return Promise.reject();
		}

		if (removeLock) {
			try {
				yield (0, _promisificator.promisify)(_fs2["default"].unlink)(lockPath);
			} catch (ex) {
				// if files no longer exists skip error
				if (!ex.code === "ENOENT") {
					throw ex;
				}
			}
		}
	}),

	/**
  * Reduce files to their folder if all files in that folder are selected
  * @param  {string[]} selectedFiles The selected files to reduce
  * @param  {string[]} allFiles All files to check for each folder
  * @return {string[]} The list of files replaced by folders if all files in a folder are selected
  */
	reduceFilesToCommonFolders: function reduceFilesToCommonFolders(selectedFiles, allFiles) {
		if (selectedFiles.length === 0 || allFiles.length === 0) {
			return [];
		}

		// filter out selected files not in all files
		var reducedFiles = selectedFiles.filter(function (file) {
			return allFiles.includes(file);
		});
		if (reducedFiles.length === allFiles.length) {
			if (allFiles[0].startsWith("/")) {
				return ["/"];
			}
			return ["."];
		}

		// count selected files by folder
		var selectedHash = reducedFiles.reduce(function (prev, file) {
			var folder = _path2["default"].dirname(file);
			while (![".", "/"].includes(folder)) {
				if (folder + "/" in prev) {
					prev[folder + "/"]++;
				} else {
					prev[folder + "/"] = 1;
				}
				folder = _path2["default"].dirname(folder);
			}

			return prev;
		}, {});

		// count all files by folder
		var allHash = allFiles.reduce(function (prev, file) {
			var folder = _path2["default"].dirname(file);
			while (![".", "/"].includes(folder)) {
				if (folder + "/" in prev) {
					prev[folder + "/"]++;
				} else {
					prev[folder + "/"] = 1;
				}
				folder = _path2["default"].dirname(folder);
			}

			return prev;
		}, {});

		// check each folder for all files selected
		var replaceFolders = Object.keys(selectedHash).reduce(function (prev, folder) {
			if (allHash[folder] === selectedHash[folder]) {
				prev.push(folder);
			}

			return prev;
		}, []);

		// remove replaceFolders that are children of replaceFolders
		replaceFolders = replaceFolders.reduce(function (prev, folder) {
			var isChildFolder = replaceFolders.some(function (otherFolder) {
				if (otherFolder === folder) {
					return false;
				}

				return folder.startsWith(otherFolder);
			});

			if (!isChildFolder) {
				prev.push(folder);
			}

			return prev;
		}, []);

		// remove files in replaceFolders
		reducedFiles = reducedFiles.reduce(function (prev, file) {
			var shouldReplace = replaceFolders.some(function (folder) {
				if (file.startsWith(folder)) {
					return true;
				}
			});
			if (!shouldReplace) {
				prev.push(file);
			}
			return prev;
		}, []);

		// add replaceFolders
		reducedFiles = reducedFiles.concat(replaceFolders);

		return reducedFiles;
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvaGVscGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozs4QkFDQyxnQkFBZ0I7O3FCQUV6Qjs7Ozs7OztBQU9kLGlCQUFnQixFQUFBLDBCQUFDLE9BQU8sRUFBRTtBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztVQUFJLE9BQU8sQ0FBQyxLQUFLO0dBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87VUFBSSxPQUFPLENBQUMsUUFBUTtHQUFBLENBQUMsQ0FBQztBQUN2RixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDakIsU0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUMxQixPQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztXQUFLLE9BQU8sQ0FBQyxRQUFRLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztJQUFDLENBQUMsQ0FBQztBQUN6RyxPQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3JCLFFBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQSxBQUFDLEVBQUU7QUFDNUIsVUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDeEI7QUFDRCxTQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUM7R0FDRCxDQUFDLENBQUM7QUFDSCxTQUFPLEtBQUssQ0FBQztFQUNiOzs7Ozs7O0FBT0QsaUJBQWdCLEVBQUEsMEJBQUMsUUFBUSxFQUFFO0FBQzFCLE1BQU0sa0JBQWtCLEdBQUcsQ0FDMUIsUUFB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LENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ25ELFFBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM1QixZQUFPLElBQUksQ0FBQztLQUNaO0lBQ0QsQ0FBQyxDQUFDO0FBQ0gsT0FBSSxDQUFDLGFBQWEsRUFBRTtBQUNuQixRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCO0FBQ0QsVUFBTyxJQUFJLENBQUM7R0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7QUFHUCxjQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFbkQsU0FBTyxZQUFZLENBQUM7RUFDcEI7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2hlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7cHJvbWlzaWZ5fSBmcm9tIFwicHJvbWlzaWZpY2F0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXG5cdC8qKlxuXHQgKiBSZW1vdmUgc2VsZWN0ZWQgZmlsZXMgd2hlcmUgYSBwYXJlbnQgZm9sZGVyIGlzIGFsc28gc2VsZWN0ZWQgYW5kIGdyb3VwIGJ5IHBhcmVudCBmb2xkZXIuXG5cdCAqIEBwYXJhbSAge09iamVjdFtdfSBjd2REaXJzIFRoZSByZXN1bHQgb2YgZ2V0RGlyZWN0b3JpZXMoKVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEtleXMgd2lsbCBiZSBjd2RzIGFuZCB2YWx1ZXMgd2lsbCBiZSBhbiBhcnJheSBvZiBmaWxlcyBmb3IgdGhhdCBjd2Rcblx0ICovXG5cdGNvbnNvbGlkYXRlRmlsZXMoY3dkRGlycykge1xuXHRcdGNvbnN0IGRpcnMgPSBjd2REaXJzLmZpbHRlcihjd2RGaWxlID0+IGN3ZEZpbGUuaXNEaXIpLm1hcChjd2RGaWxlID0+IGN3ZEZpbGUuZmlsZVBhdGgpO1xuXHRcdGNvbnN0IGZpbGVzID0ge307XG5cdFx0Y3dkRGlycy5mb3JFYWNoKGN3ZEZpbGUgPT4ge1xuXHRcdFx0Y29uc3QgaXNJblNlbGVjdGVkRGlyID0gZGlycy5zb21lKGRpciA9PiAoY3dkRmlsZS5maWxlUGF0aCAhPT0gZGlyICYmIGN3ZEZpbGUuZmlsZVBhdGguc3RhcnRzV2l0aChkaXIpKSk7XG5cdFx0XHRpZiAoIWlzSW5TZWxlY3RlZERpcikge1xuXHRcdFx0XHRpZiAoIShjd2RGaWxlLmN3ZCBpbiBmaWxlcykpIHtcblx0XHRcdFx0XHRmaWxlc1tjd2RGaWxlLmN3ZF0gPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmaWxlc1tjd2RGaWxlLmN3ZF0ucHVzaChjd2RGaWxlLmZpbGVQYXRoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gZmlsZXM7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBEZWZhdWx0IEJyYW5jaFxuXHQgKiBAcGFyYW0gIHtvYmplY3RbXX0gYnJhbmNoZXMgQXJyYXkgb2YgYnJhbmNoIG9iamVjdHNcblx0ICogQHJldHVybiB7b2JqZWN0fSBCcmFuY2ggb2JqZWN0XG5cdCAqL1xuXHRnZXREZWZhdWx0QnJhbmNoKGJyYW5jaGVzKSB7XG5cdFx0Y29uc3QgZGVmYXVsdEJyYW5jaE5hbWVzID0gW1xuXHRcdFx0XCJtYXN0ZXJcIixcblx0XHRcdFwibWFpblwiLFxuXHRcdFx0XCJkZWZhdWx0XCIsXG5cdFx0XTtcblxuXHRcdGZvciAoY29uc3QgYnJhbmNoTmFtZSBvZiBkZWZhdWx0QnJhbmNoTmFtZXMpIHtcblx0XHRcdGNvbnN0IGRlZmF1bHRCcmFuY2ggPSBicmFuY2hlcy5maW5kKGIgPT4gYi5uYW1lID09PSBicmFuY2hOYW1lKTtcblx0XHRcdGlmIChkZWZhdWx0QnJhbmNoKSB7XG5cdFx0XHRcdHJldHVybiBkZWZhdWx0QnJhbmNoO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHBhdGhzIG9mIHRoZSBjb250ZXh0IHRhcmdldFxuXHQgKiBAcGFyYW0gIHtFdmVudFRhcmdldH0gdGFyZ2V0IFRoZSBjb250ZXh0IHRhcmdldFxuXHQgKiBAcmV0dXJuIHtzdHJpbmdbXX0gVGhlIHNlbGVjdGVkIHBhdGhzIGZvciB0aGUgdGFyZ2V0XG5cdCAqL1xuXHRnZXRQYXRocyh0YXJnZXQpIHtcblx0XHRpZiAoIXRhcmdldCkge1xuXHRcdFx0cmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRyZWVWaWV3ID0gdGFyZ2V0LmNsb3Nlc3QoXCIudHJlZS12aWV3XCIpO1xuXHRcdGlmICh0cmVlVmlldykge1xuXHRcdFx0Ly8gY2FsbGVkIGZyb20gdHJlZXZpZXdcblx0XHRcdGNvbnN0IHNlbGVjdGVkID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbChcIi5zZWxlY3RlZCA+IC5saXN0LWl0ZW0gPiAubmFtZSwgLnNlbGVjdGVkID4gLm5hbWVcIik7XG5cdFx0XHRpZiAoc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gWy4uLnNlbGVjdGVkXS5tYXAoZWwgPT4gZWwuZGF0YXNldC5wYXRoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCB0YWIgPSB0YXJnZXQuY2xvc2VzdChcIi50YWItYmFyID4gLnRhYlwiKTtcblx0XHRpZiAodGFiKSB7XG5cdFx0XHQvLyBjYWxsZWQgZnJvbSB0YWJcblx0XHRcdGNvbnN0IHRpdGxlID0gdGFiLnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG5cdFx0XHRpZiAodGl0bGUgJiYgdGl0bGUuZGF0YXNldC5wYXRoKSB7XG5cdFx0XHRcdHJldHVybiBbdGl0bGUuZGF0YXNldC5wYXRoXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCBwYW5lSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cdFx0aWYgKHBhbmVJdGVtICYmIHR5cGVvZiBwYW5lSXRlbS5nZXRQYXRoID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdC8vIGNhbGxlZCBmcm9tIGFjdGl2ZSBwYW5lXG5cdFx0XHRyZXR1cm4gW3BhbmVJdGVtLmdldFBhdGgoKV07XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblx0XHRpZiAodGV4dEVkaXRvciAmJiB0eXBlb2YgdGV4dEVkaXRvci5nZXRQYXRoID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdC8vIGZhbGxiYWNrIHRvIGFjdGl2ZVRleHRFZGl0b3IgaWYgYWN0aXZlUGFuZUl0ZW0gaXMgbm90IGEgZmlsZVxuXHRcdFx0cmV0dXJuIFt0ZXh0RWRpdG9yLmdldFBhdGgoKV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFtdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgY3dkcyBvZiBmaWxlUGF0aHNcblx0ICogQHBhcmFtICB7c3RyaW5nW119IGZpbGVQYXRocyBUaGUgZmlsZXMgdG8gY2hlY2tcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge09iamVjdFtdfSBXaWxsIHJlc29sdmUgdG8ge2N3ZCwgaXNEaXIsIGZpbGVQYXRofVxuXHQgKi9cblx0Z2V0RGlyZWN0b3JpZXMoZmlsZVBhdGhzKSB7XG5cdFx0Y29uc3QgZGlyZWN0b3JpZXMgPSBQcm9taXNlLmFsbChmaWxlUGF0aHMubWFwKGFzeW5jIGZpbGVQYXRoID0+IHtcblx0XHRcdGNvbnN0IHN0YXRzID0gYXdhaXQgcHJvbWlzaWZ5KGZzLnN0YXQsIHtjYWxsYmFja0FyZzogMX0pKGZpbGVQYXRoKTtcblxuXHRcdFx0bGV0IGN3ZDtcblx0XHRcdGNvbnN0IGlzRGlyID0gc3RhdHMuaXNEaXJlY3RvcnkoKTtcblxuXHRcdFx0aWYgKGlzRGlyKSB7XG5cdFx0XHRcdGN3ZCA9IGZpbGVQYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRpc0Rpcixcblx0XHRcdFx0ZmlsZVBhdGgsXG5cdFx0XHR9O1xuXHRcdH0pKTtcblxuXHRcdHJldHVybiBkaXJlY3Rvcmllcztcblx0fSxcblxuXHQvKipcblx0ICogR2V0IGEgbGlzdCBvZiB1bnNhdmVkIGZpbGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGZpbGVQYXRocyBUaGUgZmlsZSBwYXRocyB0byBjaGVjayBmb3IgdW5zYXZlZFxuXHQgKiBAcmV0dXJuIHtzdHJpbmdbXX0gVW5zYXZlZCBmaWxlcztcblx0ICovXG5cdGdldFVuc2F2ZWRGaWxlcyhmaWxlUGF0aHMpIHtcblx0XHRjb25zdCB1bnNhdmVkVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFiLWJhciA+IC50YWIubW9kaWZpZWQgPiAudGl0bGVcIik7XG5cdFx0Y29uc3QgdW5zYXZlZEZpbGVzID0gWy4uLnVuc2F2ZWRUYWJzXS5tYXAoZWwgPT4gZWwuZGF0YXNldC5wYXRoKTtcblx0XHRyZXR1cm4gdW5zYXZlZEZpbGVzLmZpbHRlcihmaWxlID0+ICghIWZpbGUgJiYgZmlsZVBhdGhzLnNvbWUoZmlsZVBhdGggPT4gZmlsZS5zdGFydHNXaXRoKGZpbGVQYXRoKSkpKTtcblx0fSxcblxuXHQvKipcblx0ICogUmVmcmVzaCBBdG9tIGdpdCByZXBvc2l0b3JpZXNcblx0ICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHJvb3QgUm9vdCBkaXJlY3Rvcnkocykgb2YgdGhlIHJlcG8ocylcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3ZvaWR9XG5cdCAqL1xuXHRhc3luYyByZWZyZXNoQXRvbShyb290KSB7XG5cdFx0bGV0IGRpcmVjdG9yaWVzO1xuXHRcdGlmICh0eXBlb2Ygcm9vdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0ZGlyZWN0b3JpZXMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3Qgcm9vdHMgPSAoXG5cdFx0XHRcdCFBcnJheS5pc0FycmF5KHJvb3QpXG5cdFx0XHRcdFx0PyBuZXcgU2V0KFtyb290LnRvTG93ZXJDYXNlKCldKVxuXHRcdFx0XHRcdDogbmV3IFNldChyb290Lm1hcChyID0+IHIudG9Mb3dlckNhc2UoKSkpXG5cdFx0XHQpO1xuXHRcdFx0ZGlyZWN0b3JpZXMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5maWx0ZXIoZGlyID0+IHJvb3RzLmhhcyhkaXIuZ2V0UGF0aCgpLnRvTG93ZXJDYXNlKCkpKTtcblx0XHR9XG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwoZGlyZWN0b3JpZXMubWFwKGFzeW5jIGRpciA9PiB7XG5cdFx0XHRjb25zdCByZXBvID0gYXdhaXQgYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyKTtcblx0XHRcdHJlcG8ucmVmcmVzaFN0YXR1cygpO1xuXHRcdH0pKTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IGZpbGVzIGluc2lkZSBkaXJlY3Rvcnlcblx0ICogQHBhcmFtICB7c3RyaW5nfSBkaXIgVGhlIGZpbGUgcGF0aHMgdG8gbG9vayBmb3IgZmlsZXNcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ1tdfSBUaGUgbGlzdCBvZiBmaWxlcyBpbiBkaXJlY3Rvcnlcblx0ICovXG5cdGFzeW5jIGdldEZpbGVzSW5EaXIoZGlyKSB7XG5cdFx0Y29uc3Qgc3RhdHMgPSBhd2FpdCBwcm9taXNpZnkoZnMuc3RhdCwge2NhbGxiYWNrQXJnOiAxfSkoZGlyKTtcblxuXHRcdGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG5cdFx0XHRjb25zdCBmaWxlUGF0aHMgPSBhd2FpdCBwcm9taXNpZnkoZnMucmVhZGRpciwge2NhbGxiYWNrQXJnOiAyfSkoZGlyKTtcblxuXHRcdFx0Y29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IHRoaXMuZ2V0RmlsZXNJbkRpcihwYXRoLnJlc29sdmUoZGlyLCBmaWxlUGF0aCkpKSk7XG5cdFx0XHRyZXR1cm4gZmlsZXMucmVkdWNlKChwcmV2LCBmaWxlKSA9PiBwcmV2LmNvbmNhdChmaWxlKSwgW10pO1xuXHRcdH1cblxuXHRcdHJldHVybiBbZGlyXTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IGZpbGUgc3RhdHVzZXNcblx0ICogQHBhcmFtICB7c3RyaW5nW119IGZpbGVQYXRocyBBIGxpc3Qgb2YgZmlsZS9mb2xkZXIgcGF0aHNcblx0ICogQHBhcmFtICB7T2JqZWN0fSBnaXQgZ2l0LWNtZFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7T2JqZWN0W119IFRoZSBmaWxlIHN0YXR1c2VzXG5cdCAqL1xuXHRhc3luYyBnZXRTdGF0dXNlcyhmaWxlUGF0aHMsIGdpdCkge1xuXHRcdGNvbnN0IGN3ZERpcnMgPSBhd2FpdCB0aGlzLmdldERpcmVjdG9yaWVzKGZpbGVQYXRocyk7XG5cblx0XHQvLyByZW1vdmUgZHVwbGljYXRlc1xuXHRcdGNvbnN0IGN3ZEZpbGVzID0gdGhpcy5jb25zb2xpZGF0ZUZpbGVzKGN3ZERpcnMpO1xuXHRcdGNvbnN0IGN3ZHMgPSBPYmplY3Qua2V5cyhjd2RGaWxlcyk7XG5cblx0XHRjb25zdCBzdGF0dXNlcyA9IGF3YWl0IFByb21pc2UuYWxsKGN3ZHMubWFwKGN3ZCA9PiBnaXQuc3RhdHVzKGN3ZCwgY3dkRmlsZXNbY3dkXSkpKTtcblxuXHRcdC8vIGZsYXR0ZW4gc3RhdHVzZXNcblx0XHRyZXR1cm4gc3RhdHVzZXMucmVkdWNlKChwcmV2LCBzdGF0dXMpID0+IHByZXYuY29uY2F0KHN0YXR1cyksIFtdKTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IHRoZSBnaXQgcm9vdCBkaXJlY3Rvcnlcblx0ICogQHBhcmFtICB7c3RyaW5nW119IGZpbGVQYXRocyBBIGxpc3Qgb2YgZmlsZS9mb2xkZXIgcGF0aHNcblx0ICogQHBhcmFtICB7T2JqZWN0fSBnaXQgZ2l0LWNtZFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcm9vdCBkaXJlY3Rvcnlcblx0ICovXG5cdGFzeW5jIGdldFJvb3QoZmlsZVBhdGhzLCBnaXQpIHtcblx0XHRpZiAoZmlsZVBhdGhzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRmaWxlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblx0XHR9XG5cblx0XHRjb25zdCBjd2REaXJzID0gYXdhaXQgdGhpcy5nZXREaXJlY3RvcmllcyhmaWxlUGF0aHMpO1xuXG5cdFx0Ly8gcmVtb3ZlIGR1cGxpY2F0ZXNcblx0XHRjb25zdCBjd2RGaWxlcyA9IHRoaXMuY29uc29saWRhdGVGaWxlcyhjd2REaXJzKTtcblxuXHRcdGNvbnN0IHJvb3REaXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoY3dkRmlsZXMpLm1hcChjd2QgPT4gZ2l0LnJvb3REaXIoY3dkKSkpO1xuXHRcdC8vIHJlbW92ZSBkdXBsaWNhdGVzXG5cdFx0Y29uc3Qgcm9vdHMgPSBbLi4ubmV3IFNldChyb290RGlycyldO1xuXHRcdGlmIChyb290cy5sZW5ndGggPiAxKSB7XG5cdFx0XHR0aHJvdyBcIlNlbGVjdGVkIGZpbGVzIGFyZSBub3QgaW4gdGhlIHNhbWUgcmVwb3NpdG9yeVwiO1xuXHRcdFx0Ly8gVE9ETzogc2hvdWxkIHdlIGJlIGFibGUgdG8gaGFuZGxlIHRoaXMgaW5zdGVhZCBvZiB0aHJvd2luZyBhbiBlcnJvcj9cblx0XHR9XG5cdFx0cmV0dXJuIHJvb3RzWzBdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgYWxsIGZpbGVzIGFzc29jaWF0ZWQgd2l0aCBjb250ZXh0IGZpbGVzXG5cdCAqIEBwYXJhbSAge3N0cmluZ1tdfSBmaWxlUGF0aHMgVGhlIGNvbnRleHQgZmlsZXNcblx0ICogQHBhcmFtICB7T2JqZWN0fSBnaXQgZ2l0LWNtZFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7W3N0cmluZ1tdLCBzdHJpbmddfSBSZXNvbHZlcyB0byBbZmlsZXMsIHJvb3RdXG5cdCAqL1xuXHRhc3luYyBnZXRSb290QW5kQWxsRmlsZXMoZmlsZVBhdGhzLCBnaXQpIHtcblxuXHRcdGNvbnN0IGdldEZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZVBhdGhzLm1hcChmaWxlUGF0aCA9PiB0aGlzLmdldEZpbGVzSW5EaXIoZmlsZVBhdGgpKSk7XG5cblx0XHQvLyBmbGF0dGVuIGZpbGVzXG5cdFx0Y29uc3QgYWxsRmlsZXMgPSBnZXRGaWxlcy5yZWR1Y2UoKHByZXYsIGZpbGUpID0+IHByZXYuY29uY2F0KGZpbGUpLCBbXSk7XG5cdFx0Y29uc3QgZmlsZXMgPSBbLi4ubmV3IFNldChhbGxGaWxlcyldO1xuXHRcdGNvbnN0IHJvb3QgPSBhd2FpdCB0aGlzLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdHJldHVybiBbZmlsZXMsIHJvb3RdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgZmlsZXMgZ2l0IHN0YXR1c2VzIGFzc29jaWF0ZWQgd2l0aCBjb250ZXh0IGZpbGVzXG5cdCAqIEBwYXJhbSAge3N0cmluZ1tdfSBmaWxlUGF0aHMgVGhlIGNvbnRleHQgZmlsZXNcblx0ICogQHBhcmFtICB7T2JqZWN0fSBnaXQgZ2l0LWNtZFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7W09iamVjdFtdLCBzdHJpbmddfSBSZXNvbHZlcyB0byBbZmlsZXMsIHJvb3RdXG5cdCAqL1xuXHRhc3luYyBnZXRSb290QW5kRmlsZXNTdGF0dXNlcyhmaWxlUGF0aHMsIGdpdCkge1xuXG5cdFx0aWYgKHRoaXMuZ2V0VW5zYXZlZEZpbGVzKGZpbGVQYXRocykubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhyb3cgXCJTYXZlIGZpbGVzIGJlZm9yZSBydW5uaW5nIGdpdC5cIjtcblx0XHR9XG5cblx0XHRjb25zdCBbZmlsZXMsIHJvb3RdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuZ2V0U3RhdHVzZXMoZmlsZVBhdGhzLCBnaXQpLCB0aGlzLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpXSk7XG5cblx0XHRyZXR1cm4gW2ZpbGVzLCByb290XTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IGZpbGVzIGFzc29jaWF0ZWQgd2l0aCBjb250ZXh0IGZpbGVzXG5cdCAqIEBwYXJhbSAge3N0cmluZ1tdfSBmaWxlUGF0aHMgVGhlIGNvbnRleHQgZmlsZXNcblx0ICogQHBhcmFtICB7T2JqZWN0fSBnaXQgZ2l0LWNtZFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7W09iamVjdFtdLCBzdHJpbmddfSBSZXNvbHZlcyB0byBbZmlsZXMsIHJvb3RdXG5cdCAqL1xuXHRhc3luYyBnZXRSb290QW5kRmlsZXMoZmlsZVBhdGhzLCBnaXQpIHtcblx0XHRjb25zdCBbc3RhdHVzZXMsIHJvb3RdID0gYXdhaXQgdGhpcy5nZXRSb290QW5kRmlsZXNTdGF0dXNlcyhmaWxlUGF0aHMsIGdpdCk7XG5cdFx0Y29uc3QgZmlsZXMgPSBzdGF0dXNlcy5tYXAoc3RhdHVzID0+IHN0YXR1cy5maWxlKTtcblx0XHRyZXR1cm4gW2ZpbGVzLCByb290XTtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2sgaWYgaW5kZXgubG9jayBleGlzdHMgYW5kIGFzayB0aGUgdXNlciB0byByZW1vdmUgaXRcblx0ICogQHBhcmFtICB7c3RyaW5nfSByb290IFRoZSByb290IGlmIHRoZSBnaXQgcmVwb3NpdG9yeVxuXHQgKiBAcGFyYW0gIHtpbnRlZ2VyfSByZXRyeSBDaGVjayBhZ2FpbiBhZnRlciB0aGlzIG11Y2ggdGltZSAoaW4gbXMpIHRvIHNlZSBpZiB0aGUgbG9jayBmaWxlIHN0aWxsIGV4aXN0cyBiZWZvcmUgc2hvd2luZyB0aGUgZGlhbG9nLiBBIGZhbHNleSB2YWx1ZSBtZWFucyBubyByZXRyeS5cblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3ZvaWR9XG5cdCAqL1xuXHRhc3luYyBjaGVja0dpdExvY2socm9vdCwgcmV0cnkgPSAxMDApIHtcblx0XHRjb25zdCBsb2NrUGF0aCA9IHBhdGgucmVzb2x2ZShyb290LCBcIi5naXQvaW5kZXgubG9ja1wiKTtcblx0XHRjb25zdCBmaWxlRXhpc3RzQXN5bmMgPSBmaWxlID0+IHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdFx0ZnMuYWNjZXNzKGZpbGUsIGVyciA9PiB7XG5cdFx0XHRcdFx0cmVzb2x2ZSghZXJyKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0aWYgKCFhd2FpdCBmaWxlRXhpc3RzQXN5bmMobG9ja1BhdGgpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHJldHJ5KSB7XG5cdFx0XHRjb25zdCBzdGlsbFRoZXJlID0gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChhd2FpdCBmaWxlRXhpc3RzQXN5bmMobG9ja1BhdGgpKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0fSwgcmV0cnkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghc3RpbGxUaGVyZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgW2NvbmZpcm1CdXR0b24sIHJlbW92ZUxvY2tdID0gYXdhaXQgcHJvbWlzaWZ5KGF0b20uY29uZmlybS5iaW5kKGF0b20pLCB7cmVqZWN0T25FcnJvcjogZmFsc2UsIGFsd2F5c1JldHVybkFycmF5OiB0cnVlfSkoe1xuXHRcdFx0dHlwZTogXCJlcnJvclwiLFxuXHRcdFx0Y2hlY2tib3hMYWJlbDogXCJSZW1vdmUgTG9ja1wiLFxuXHRcdFx0Y2hlY2tib3hDaGVja2VkOiB0cnVlLFxuXHRcdFx0bWVzc2FnZTogXCJBbm90aGVyIGdpdCBwcm9jZXNzIHNlZW1zIHRvIGJlIHJ1bm5pbmcgaW4gdGhpcyByZXBvc2l0b3J5LCBkbyB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGxvY2sgZmlsZSBhbmQgY29udGludWU/XCIsXG5cdFx0XHRkZXRhaWw6IGBZb3UgYXJlIGRlbGV0aW5nOlxcbiR7bG9ja1BhdGh9YCxcblx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0XCJDb250aW51ZVwiLFxuXHRcdFx0XHRcIkNhbmNlbFwiLFxuXHRcdFx0XSxcblx0XHR9KTtcblxuXHRcdGlmIChjb25maXJtQnV0dG9uID09PSAxKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcblx0XHR9XG5cblx0XHRpZiAocmVtb3ZlTG9jaykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0YXdhaXQgcHJvbWlzaWZ5KGZzLnVubGluaykobG9ja1BhdGgpO1xuXHRcdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdFx0Ly8gaWYgZmlsZXMgbm8gbG9uZ2VyIGV4aXN0cyBza2lwIGVycm9yXG5cdFx0XHRcdGlmICghZXguY29kZSA9PT0gXCJFTk9FTlRcIikge1xuXHRcdFx0XHRcdHRocm93IGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZWR1Y2UgZmlsZXMgdG8gdGhlaXIgZm9sZGVyIGlmIGFsbCBmaWxlcyBpbiB0aGF0IGZvbGRlciBhcmUgc2VsZWN0ZWRcblx0ICogQHBhcmFtICB7c3RyaW5nW119IHNlbGVjdGVkRmlsZXMgVGhlIHNlbGVjdGVkIGZpbGVzIHRvIHJlZHVjZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmdbXX0gYWxsRmlsZXMgQWxsIGZpbGVzIHRvIGNoZWNrIGZvciBlYWNoIGZvbGRlclxuXHQgKiBAcmV0dXJuIHtzdHJpbmdbXX0gVGhlIGxpc3Qgb2YgZmlsZXMgcmVwbGFjZWQgYnkgZm9sZGVycyBpZiBhbGwgZmlsZXMgaW4gYSBmb2xkZXIgYXJlIHNlbGVjdGVkXG5cdCAqL1xuXHRyZWR1Y2VGaWxlc1RvQ29tbW9uRm9sZGVycyhzZWxlY3RlZEZpbGVzLCBhbGxGaWxlcykge1xuXHRcdGlmIChzZWxlY3RlZEZpbGVzLmxlbmd0aCA9PT0gMCB8fCBhbGxGaWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHQvLyBmaWx0ZXIgb3V0IHNlbGVjdGVkIGZpbGVzIG5vdCBpbiBhbGwgZmlsZXNcblx0XHRsZXQgcmVkdWNlZEZpbGVzID0gc2VsZWN0ZWRGaWxlcy5maWx0ZXIoZmlsZSA9PiBhbGxGaWxlcy5pbmNsdWRlcyhmaWxlKSk7XG5cdFx0aWYgKHJlZHVjZWRGaWxlcy5sZW5ndGggPT09IGFsbEZpbGVzLmxlbmd0aCkge1xuXHRcdFx0aWYgKGFsbEZpbGVzWzBdLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XG5cdFx0XHRcdHJldHVybiBbXCIvXCJdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFtcIi5cIl07XG5cdFx0fVxuXG5cdFx0Ly8gY291bnQgc2VsZWN0ZWQgZmlsZXMgYnkgZm9sZGVyXG5cdFx0Y29uc3Qgc2VsZWN0ZWRIYXNoID0gcmVkdWNlZEZpbGVzLnJlZHVjZSgocHJldiwgZmlsZSkgPT4ge1xuXHRcdFx0bGV0IGZvbGRlciA9IHBhdGguZGlybmFtZShmaWxlKTtcblx0XHRcdHdoaWxlICghW1wiLlwiLCBcIi9cIl0uaW5jbHVkZXMoZm9sZGVyKSkge1xuXHRcdFx0XHRpZiAoYCR7Zm9sZGVyfS9gIGluIHByZXYpIHtcblx0XHRcdFx0XHRwcmV2W2Ake2ZvbGRlcn0vYF0rKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcmV2W2Ake2ZvbGRlcn0vYF0gPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvbGRlciA9IHBhdGguZGlybmFtZShmb2xkZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCB7fSk7XG5cblx0XHQvLyBjb3VudCBhbGwgZmlsZXMgYnkgZm9sZGVyXG5cdFx0Y29uc3QgYWxsSGFzaCA9IGFsbEZpbGVzLnJlZHVjZSgocHJldiwgZmlsZSkgPT4ge1xuXHRcdFx0bGV0IGZvbGRlciA9IHBhdGguZGlybmFtZShmaWxlKTtcblx0XHRcdHdoaWxlICghW1wiLlwiLCBcIi9cIl0uaW5jbHVkZXMoZm9sZGVyKSkge1xuXHRcdFx0XHRpZiAoYCR7Zm9sZGVyfS9gIGluIHByZXYpIHtcblx0XHRcdFx0XHRwcmV2W2Ake2ZvbGRlcn0vYF0rKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcmV2W2Ake2ZvbGRlcn0vYF0gPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvbGRlciA9IHBhdGguZGlybmFtZShmb2xkZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCB7fSk7XG5cblx0XHQvLyBjaGVjayBlYWNoIGZvbGRlciBmb3IgYWxsIGZpbGVzIHNlbGVjdGVkXG5cdFx0bGV0IHJlcGxhY2VGb2xkZXJzID0gT2JqZWN0LmtleXMoc2VsZWN0ZWRIYXNoKS5yZWR1Y2UoKHByZXYsIGZvbGRlcikgPT4ge1xuXHRcdFx0aWYgKGFsbEhhc2hbZm9sZGVyXSA9PT0gc2VsZWN0ZWRIYXNoW2ZvbGRlcl0pIHtcblx0XHRcdFx0cHJldi5wdXNoKGZvbGRlcik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcmV2O1xuXHRcdH0sIFtdKTtcblxuXHRcdC8vIHJlbW92ZSByZXBsYWNlRm9sZGVycyB0aGF0IGFyZSBjaGlsZHJlbiBvZiByZXBsYWNlRm9sZGVyc1xuXHRcdHJlcGxhY2VGb2xkZXJzID0gcmVwbGFjZUZvbGRlcnMucmVkdWNlKChwcmV2LCBmb2xkZXIpID0+IHtcblx0XHRcdGNvbnN0IGlzQ2hpbGRGb2xkZXIgPSByZXBsYWNlRm9sZGVycy5zb21lKG90aGVyRm9sZGVyID0+IHtcblx0XHRcdFx0aWYgKG90aGVyRm9sZGVyID09PSBmb2xkZXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZm9sZGVyLnN0YXJ0c1dpdGgob3RoZXJGb2xkZXIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghaXNDaGlsZEZvbGRlcikge1xuXHRcdFx0XHRwcmV2LnB1c2goZm9sZGVyKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByZXY7XG5cdFx0fSwgW10pO1xuXG5cdFx0Ly8gcmVtb3ZlIGZpbGVzIGluIHJlcGxhY2VGb2xkZXJzXG5cdFx0cmVkdWNlZEZpbGVzID0gcmVkdWNlZEZpbGVzLnJlZHVjZSgocHJldiwgZmlsZSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2hvdWxkUmVwbGFjZSA9IHJlcGxhY2VGb2xkZXJzLnNvbWUoZm9sZGVyID0+IHtcblx0XHRcdFx0aWYgKGZpbGUuc3RhcnRzV2l0aChmb2xkZXIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKCFzaG91bGRSZXBsYWNlKSB7XG5cdFx0XHRcdHByZXYucHVzaChmaWxlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcmV2O1xuXHRcdH0sIFtdKTtcblxuXHRcdC8vIGFkZCByZXBsYWNlRm9sZGVyc1xuXHRcdHJlZHVjZWRGaWxlcyA9IHJlZHVjZWRGaWxlcy5jb25jYXQocmVwbGFjZUZvbGRlcnMpO1xuXG5cdFx0cmV0dXJuIHJlZHVjZWRGaWxlcztcblx0fSxcbn07XG4iXX0=