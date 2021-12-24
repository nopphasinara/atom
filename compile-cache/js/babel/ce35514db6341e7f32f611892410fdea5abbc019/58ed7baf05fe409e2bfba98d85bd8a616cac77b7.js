Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _atom = require("atom");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _promisificator = require("promisificator");

var _Notifications = require("./Notifications");

exports["default"] = {

	/**
  * Send git command with arguments
  * @param {string} cwd Current Working Directory
  * @param {string[]} [args=[]] Argument list. Any empty strings will be removed.
  * @param {string} [stdin=""] String to write to stdin
  * @param {bool} [includeCommand=true] Include the command in output
  * @return {Promise} {string} The result of the command
  */
	cmd: function cmd(cwd) {
		var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
		var stdin = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
		var includeCommand = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

		return new Promise(function (resolve, reject) {
			var output = "";
			var git = atom.config.get("git-menu.gitPath");
			// eslint-disable-next-line no-param-reassign
			args = args.filter(function (i) {
				return i !== "";
			});
			var bp = new _atom.BufferedProcess({
				command: git,
				args: args,
				options: {
					cwd: cwd,
					env: process.env
				},
				stdout: function stdout(data) {
					output += data.toString();
				},
				stderr: function stderr(data) {
					output += data.toString();
				},
				exit: function exit(code) {
					output = output.trimEnd();
					if ((0, _Notifications.isVerbose)() && includeCommand) {
						if (process.platform === "win32") {
							output = "> " + bp.process.spawnargs[bp.process.spawnargs.length - 1].replace(/^"(.+)"$/g, "$1") + "\n\n" + output;
						} else {
							output = "> " + git + " " + args.join(" ") + "\n\n" + output;
						}
					}

					if (code === 0) {
						resolve(output);
					} else {
						reject("Error code: " + code + "\n\n" + output);
					}
				}
			});
			if (stdin) {
				bp.process.stdin.write(stdin);
			}
			bp.process.stdin.end();
		});
	},

	/**
  * Initialize a git repository
  * @param {string} cwd Current Working Directory
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	init: function init(cwd) {
		var verbose = arguments.length <= 1 || arguments[1] === undefined ? (0, _Notifications.isVerbose)() : arguments[1];

		var verboseArgs = !verbose ? "--quiet" : "";
		return this.cmd(cwd, ["init", verboseArgs]);
	},

	/**
  * Remove the git repository
  * @param {string} cwd Current Working Directory
  * @return {Promise} void
  */
	remove: function remove(cwd) {
		var gitPath = _path2["default"].join(cwd, ".git");
		return (0, _promisificator.promisify)(_rimraf2["default"])(gitPath, { disableGlob: true });
	},

	/**
  * Count commits
  * @param {string} cwd Current Working Directory
  * @return {Promise} {int} The result of the command
  */
	countCommits: _asyncToGenerator(function* (cwd) {
		try {
			var result = yield this.cmd(cwd, ["rev-list", "--count", "HEAD"], "", false);
			if (isNaN(+result)) {
				throw result;
			}
			return +result;
		} catch (err) {
			// check for 0 commits
			var log = yield this.log(cwd, 1);
			if (!log) {
				return 0;
			}
			throw err;
		}
	}),

	/**
  * Add files to track
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files to add
  * @param {bool} verbose Add the --verbose flag
  * @return {Promise} {string} The result of the command
  */
	add: function add(cwd, files) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = verbose ? "--verbose" : "";
		return this.cmd(cwd, ["add", verboseArg, "--"].concat(_toConsumableArray(files)));
	},

	/**
  * Add files to track
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files to diff
  * @return {Promise} {string} The result of the command
  */
	diff: function diff(cwd, files) {
		return this.cmd(cwd, ["diff", "--ignore-all-space", "--"].concat(_toConsumableArray(files)));
	},

	/**
  * Get the root directory of the git repository
  * @param {string} cwd Current Working Directory
  * @return {Promise} {string} The absolute path of the root directory
  */
	rootDir: _asyncToGenerator(function* (cwd) {
		var result = yield this.cmd(cwd, ["rev-parse", "--show-toplevel"], "", false);
		if (result.startsWith("\\\\") || result.startsWith("smb://")) {
			return cwd;
		}

		return result.trimEnd().replace(/[\\/]/g, _path2["default"].sep);
	}),

	/**
  * Commit files with message or amend last commit with message
  * @param {string} cwd Current Working Directory
  * @param {string} message The commit message.
  * @param {bool} amend True = amend last commit, False = create new commit
  * @param {string[]} files The files to commit
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	commit: function commit(cwd, message, amend) {
		var files = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
		var verbose = arguments.length <= 4 || arguments[4] === undefined ? (0, _Notifications.isVerbose)() : arguments[4];

		var verboseArg = !verbose ? "--quiet" : "";
		var amendArg = amend ? "--amend" : "";
		if (files) {
			files.unshift("--");
		} else {
			// eslint-disable-next-line no-param-reassign
			files = [];
		}
		return this.cmd(cwd, ["commit", verboseArg, "--file=-", amendArg].concat(_toConsumableArray(files)), message);
	},

	/**
  * Checkout branch
  * @param {string} cwd Current Working Directory
  * @param {string} branch The branch name to checkout
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	checkoutBranch: function checkoutBranch(cwd, branch) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = !verbose ? "--quiet" : "";
		return this.cmd(cwd, ["checkout", verboseArg, branch]);
	},

	/**
  * Create branch
  * @param {string} cwd Current Working Directory
  * @param {string} branch The branch name to create
  * @param {string} remote The remote name to checkout from
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	createBranch: function createBranch(cwd, branch, remote) {
		var verbose = arguments.length <= 3 || arguments[3] === undefined ? (0, _Notifications.isVerbose)() : arguments[3];

		var verboseArg = !verbose ? "--quiet" : "";
		var remoteArg = [];
		if (remote) {
			remoteArg.push("--track", remote + "/" + branch);
		}
		return this.cmd(cwd, ["checkout", verboseArg, "-b", branch].concat(remoteArg));
	},

	/**
  * Delete a branch
  * @param {string} cwd Current Working Directory
  * @param {string} branch The branch name to create
  * @param {bool} remote Delete a remote branch if it exists
  * @param {bool} force Force delete the branch
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	deleteBranch: function deleteBranch(cwd, branch) {
		var remote = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
		var force = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
		var verbose = arguments.length <= 4 || arguments[4] === undefined ? (0, _Notifications.isVerbose)() : arguments[4];

		var forceArg = force ? "--force" : "";
		var verboseArg = !verbose ? "--quiet" : remote ? "--verbose" : "";
		var args = undefined;
		if (remote) {
			args = ["push", "--delete", forceArg, verboseArg, "origin", branch];
		} else {
			args = ["branch", "--delete", forceArg, verboseArg, branch];
		}
		return this.cmd(cwd, args);
	},

	/**
  * Set upstream branch
  * @param {string} cwd Current Working Directory
  * @param {string} remote The remote to create the branch
  * @param {string} branch The branch name
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	setUpstream: function setUpstream(cwd, remote, branch) {
		var verbose = arguments.length <= 3 || arguments[3] === undefined ? (0, _Notifications.isVerbose)() : arguments[3];

		var verboseArg = verbose ? "--verbose" : "--quiet";
		return this.cmd(cwd, ["push", verboseArg, "--set-upstream", remote, branch]);
	},

	/**
  * Checkout files
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files to checkout
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	checkoutFiles: function checkoutFiles(cwd, files) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = !verbose ? "--quiet" : "";
		return this.cmd(cwd, ["checkout", verboseArg, "--"].concat(_toConsumableArray(files)));
	},

	/**
  * Remove untracked files
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files to remove
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	clean: function clean(cwd, files) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = !verbose ? "--quiet" : "";
		if (files.length === 1 && files[0] === ".") {
			// files === ["."] means all files
			// eslint-disable-next-line no-param-reassign
			files = [];
		} else {
			files.unshift("--");
		}
		return this.cmd(cwd, ["clean", verboseArg, "--force", "-d"].concat(_toConsumableArray(files)));
	},

	/**
  * Push commits to remote repo
  * @param {string} cwd Current Working Directory
  * @param {bool} [force=false] Add --force flag
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	push: _asyncToGenerator(function* (cwd) {
		var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var tracking = [];
		var result = yield this.cmd(cwd, ["status", "-b", "--porcelain"]);

		var _result$match = result.match(/^## (.+?)(?:\.\.\.(.+))?$/m);

		var _result$match2 = _slicedToArray(_result$match, 3);

		var branch = _result$match2[1];
		var remote = _result$match2[2];

		if (!remote) {
			tracking.push("--set-upstream", "origin", branch);
		}

		var verboseArg = verbose ? "--verbose" : "--quiet";
		var forceArg = force ? "--force" : "";
		return this.cmd(cwd, ["push", verboseArg, forceArg].concat(tracking));
	}),

	/**
  * Pull commits from remote repo
  * @param {string} cwd Current Working Directory
  * @param {bool} [rebase=false] Add --rebase flag
  * @param {bool} [force=false] Add --force flag
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	pull: function pull(cwd) {
		var rebase = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var force = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
		var verbose = arguments.length <= 3 || arguments[3] === undefined ? (0, _Notifications.isVerbose)() : arguments[3];

		var verboseArg = verbose ? "--verbose" : "--quiet";
		var forceArg = force ? "--force" : "";
		var rebaseArg = rebase ? "--rebase" : "";
		return this.cmd(cwd, ["pull", verboseArg, forceArg, rebaseArg]);
	},

	/**
  * Merge commits from a branch into the current branch
  * @param {string} cwd Current Working Directory
  * @param {string} branch The branch to merge
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	merge: function merge(cwd, branch) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = verbose ? "--verbose" : "--quiet";
		return this.cmd(cwd, ["merge", branch, verboseArg]);
	},

	/**
  * Rebase commits from a branch into the current branch
  * @param {string} cwd Current Working Directory
  * @param {string} branch The branch to rebase on
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	rebase: function rebase(cwd, branch) {
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = verbose ? "--verbose" : "--quiet";
		return this.cmd(cwd, ["rebase", branch, verboseArg]);
	},

	/**
  * Abort merge or rebase
  * @param {string} cwd Current Working Directory
  * @param {bool} merge true=merge, false=rebase
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	abort: function abort(cwd) {
		var merge = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		var type = merge ? "merge" : "rebase";
		return this.cmd(cwd, [type, "--abort"]);
	},

	/**
  * Unstage files
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files to reset
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	unstage: function unstage(cwd) {
		var files = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var verboseArg = !verbose ? "--quiet" : "";
		if (files) {
			files.unshift("--");
		} else {
			// eslint-disable-next-line no-param-reassign
			files = [];
		}
		return this.cmd(cwd, ["reset", verboseArg].concat(_toConsumableArray(files)));
	},

	/**
  * Undo last commit
  * @param {string} cwd Current Working Directory
  * @param {bool} [hard=false] Discard changes
  * @param {int} [nCommits=1] Number of commits to undo. Default = 1
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	reset: function reset(cwd) {
		var hard = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var nCommits = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
		var verbose = arguments.length <= 3 || arguments[3] === undefined ? (0, _Notifications.isVerbose)() : arguments[3];

		// eslint-disable-next-line no-param-reassign
		nCommits = parseInt(nCommits, 10);
		if (isNaN(nCommits) || nCommits <= 0) {
			throw "nCommits is not a number greater than 0";
		}
		var hardArg = hard ? "--hard" : "--mixed";
		var verboseArg = !verbose ? "--quiet" : "";
		return this.cmd(cwd, ["reset", hardArg, verboseArg, "HEAD~" + nCommits]);
	},

	/**
  * Get last commit message
  * @param {string} cwd Current Working Directory
  * @return {Promise} {string|null} The last commit message or null if no commits
  */
	lastCommit: _asyncToGenerator(function* (cwd) {
		var result = yield this.log(cwd, 1);
		if (!result) {
			return null;
		}
		return result;
	}),

	/**
  * Get Log
  * @param {string} cwd Current Working Directory
  * @param {int} [number=1] Number of commits
  * @param {string} [offset=0] Offset
  * @param {string} [format="%B"] Format
  * @return {Promise} {string|null} The last commit message or null if no commits
  */
	log: _asyncToGenerator(function* (cwd) {
		var number = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
		var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
		var format = arguments.length <= 3 || arguments[3] === undefined ? "%B" : arguments[3];

		try {
			return yield this.cmd(cwd, ["log", "--max-count=" + number, "--skip=" + offset, "--format=" + format], "", false);
		} catch (error) {
			if (error.endsWith("does not have any commits yet")) {
				return "";
			}
			throw error;
		}
	}),

	/**
  * Get the status on changed files
  * @param {string} cwd Current Working Directory
  * @param {string} filePaths The directorys or files to check
  * @return {Promise} {object[]} Status objects
  *                        [
  *                          {
  *                            added: bool,
  *                            untracked: bool,
  *                            deleted: bool,
  *                            changed: bool,
  *                            file: string,
  *                          }, ...
  *                        ]
  */
	status: _asyncToGenerator(function* (cwd, filePaths) {
		var _this = this;

		var result = yield this.cmd(cwd, ["status", "--porcelain", "--untracked-files=all"].concat(_toConsumableArray(filePaths)), "", false);
		if (result === "") {
			return [];
		}

		return result.trimEnd().split("\n").map(function (line) {
			var lineMatch = line.match(/^([ MADRCU?]{2}) "?(.*?)"?$/);
			if (!lineMatch) {
				throw "git status output invalid: '" + line.replace(" ", "·") + "'";
			}

			var _lineMatch = _slicedToArray(lineMatch, 3);

			var code = _lineMatch[1];
			var file = _lineMatch[2];

			var status = _this.statusFromCode(code);
			if (status === false) {
				throw "Unknown code '" + line.replace(" ", "·") + "'";
			}
			return _extends({}, status, { file: file });
		});
	}),

	/**
  * Get the file status from the git status code
  * @param {string} code The code from `git status`
  * @return {Object} {
  *                    added: bool,
  *                    untracked: bool,
  *                    deleted: bool,
  *                    changed: bool,
  *                  }
  */
	statusFromCode: function statusFromCode(code) {
		var added = false;
		var untracked = false;
		var deleted = false;
		var changed = false;
		switch (code) {
			case "M ":
			case "MM":
			case "MD":
			case "UU":
				added = true;
				changed = true;
				break;
			case " M":
				changed = true;
				break;
			case "D ":
			case "DD":
			case "DM":
			case "UD":
			case "DU":
				added = true;
				deleted = true;
				break;
			case " D":
				deleted = true;
				break;
			case "A ":
			case "A?":
			case "AM":
			case "AD":
			case "R ":
			case "RM":
			case "RD":
			case "AA":
			case "AU":
			case "UA":
				added = true;
				untracked = true;
				break;
			case "??":
				untracked = true;
				break;
			default:
				return false;
		}

		return {
			added: added,
			untracked: untracked,
			deleted: deleted,
			changed: changed
		};
	},

	/**
  * Get repo branches
  * @param {string} cwd Current Working Directory
  * @param {bool} [remotes=true] List remote branches
  * @return {Promise} {object[]} Repository branch names
  */
	branches: _asyncToGenerator(function* (cwd) {
		var remotes = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		var remotesArg = remotes ? "--all" : "";
		var result = yield this.cmd(cwd, ["branch", "--list", remotesArg], "", false);
		if (result === "") {
			return [];
		}

		return Object.values(result.split("\n").reduce(function (branches, line) {
			var branch = line.trim();

			if (branch.match(/\/HEAD\b/)) {
				return branches;
			}

			var selected = branch.startsWith("* ");
			var remote = branch.includes("remotes/origin/");
			var local = !remote;
			var name = branch.replace(/^(\* )?(remotes\/origin\/)?/, "");

			if (name in branches) {
				if (local) {
					branches[name].local = true;
					branches[name].branch = branch;
				} else {
					branches[name].remote = true;
				}
				if (selected) {
					branches[name].selected = true;
					branches[name].branch = branch;
				}
			} else {
				branches[name] = { branch: branch, name: name, selected: selected, local: local, remote: remote };
			}
			return branches;
		}, {}));
	}),

	/**
  * Fetch from remotes
  * @param {string} cwd Current Working Directory
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	fetch: function fetch(cwd) {
		var verbose = arguments.length <= 1 || arguments[1] === undefined ? (0, _Notifications.isVerbose)() : arguments[1];

		var verboseArg = verbose ? "--verbose" : "--quiet";
		return this.cmd(cwd, ["fetch", "--all", "--prune", verboseArg]);
	},

	/**
  * Stash or unstash changes
  * @param {string} cwd Current Working Directory
  * @param {bool} [pop=false] Restore the last changes that were stashed
  * @param {bool} verbose Not add the --quiet flag
  * @return {Promise} {string} The result of the command
  */
	stash: function stash(cwd) {
		var pop = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var verbose = arguments.length <= 2 || arguments[2] === undefined ? (0, _Notifications.isVerbose)() : arguments[2];

		var popArg = pop ? "pop" : "";
		var verboseArg = !verbose ? "--quiet" : "";
		return this.cmd(cwd, ["stash", popArg, verboseArg]);
	},

	/**
  * Update index and ignore/unignore changes from these files
  * @param {string} cwd Current Working Directory
  * @param {string[]} files The files update
  * @param {bool} [ignore=true] To ignore or unignore
  * @param {bool} verbose Add the --verbose flag
  * @return {Promise} {string} The result of the command
  */
	updateIndex: function updateIndex(cwd, files) {
		var ignore = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
		var verbose = arguments.length <= 3 || arguments[3] === undefined ? (0, _Notifications.isVerbose)() : arguments[3];

		var assumeUnchangedArg = ignore ? "--assume-unchanged" : "--no-assume-unchanged";
		var verboseArg = verbose ? "--verbose" : "";
		return this.cmd(cwd, ["update-index", assumeUnchangedArg, verboseArg, "--stdin"], files.join("\n"));
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZ2l0LWNtZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUU4QixNQUFNOztvQkFDbkIsTUFBTTs7OztzQkFDSixRQUFROzs7OzhCQUNILGdCQUFnQjs7NkJBQ2hCLGlCQUFpQjs7cUJBRTFCOzs7Ozs7Ozs7O0FBVWQsSUFBRyxFQUFBLGFBQUMsR0FBRyxFQUFnRDtNQUE5QyxJQUFJLHlEQUFHLEVBQUU7TUFBRSxLQUFLLHlEQUFHLEVBQUU7TUFBRSxjQUFjLHlEQUFHLElBQUk7O0FBQ3BELFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3ZDLE9BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixPQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVoRCxPQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLEtBQUssRUFBRTtJQUFBLENBQUMsQ0FBQztBQUNsQyxPQUFNLEVBQUUsR0FBRywwQkFBb0I7QUFDOUIsV0FBTyxFQUFFLEdBQUc7QUFDWixRQUFJLEVBQUosSUFBSTtBQUNKLFdBQU8sRUFBRTtBQUNSLFFBQUcsRUFBRSxHQUFHO0FBQ1IsUUFBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO0tBQ2hCO0FBQ0QsVUFBTSxFQUFFLGdCQUFBLElBQUksRUFBSTtBQUNmLFdBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDMUI7QUFDRCxVQUFNLEVBQUUsZ0JBQUEsSUFBSSxFQUFJO0FBQ2YsV0FBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMxQjtBQUNELFFBQUksRUFBRSxjQUFBLElBQUksRUFBSTtBQUNiLFdBQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxF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U0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7RUFDaEU7Ozs7Ozs7OztBQVNELE1BQUssRUFBQSxlQUFDLEdBQUcsRUFBc0M7TUFBcEMsR0FBRyx5REFBRyxLQUFLO01BQUUsT0FBTyx5REFBRywrQkFBVzs7QUFDNUMsTUFBTSxNQUFNLEdBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxFQUFFLEFBQUMsQ0FBQztBQUNsQyxNQUFNLFVBQVUsR0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsRUFBRSxBQUFDLENBQUM7QUFDL0MsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztFQUNwRDs7Ozs7Ozs7OztBQVVELFlBQVcsRUFBQSxxQkFBQyxHQUFHLEVBQUUsS0FBSyxFQUF3QztNQUF0QyxNQUFNLHlEQUFHLElBQUk7TUFBRSxPQUFPLHlEQUFHLCtCQUFXOztBQUMzRCxNQUFNLGtCQUFrQixHQUFJLE1BQU0sR0FBRyxvQkFBb0IsR0FBRyx1QkFBdUIsQUFBQyxDQUFDO0FBQ3JGLE1BQU0sVUFBVSxHQUFJLE9BQU8sR0FBRyxXQUFXLEdBQUcsRUFBRSxBQUFDLENBQUM7QUFDaEQsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3BHO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9naXQtY21kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQge0J1ZmZlcmVkUHJvY2Vzc30gZnJvbSBcImF0b21cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcmltcmFmIGZyb20gXCJyaW1yYWZcIjtcbmltcG9ydCB7cHJvbWlzaWZ5fSBmcm9tIFwicHJvbWlzaWZpY2F0b3JcIjtcbmltcG9ydCB7aXNWZXJib3NlfSBmcm9tIFwiLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuXHQvKipcblx0ICogU2VuZCBnaXQgY29tbWFuZCB3aXRoIGFyZ3VtZW50c1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gW2FyZ3M9W11dIEFyZ3VtZW50IGxpc3QuIEFueSBlbXB0eSBzdHJpbmdzIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IFtzdGRpbj1cIlwiXSBTdHJpbmcgdG8gd3JpdGUgdG8gc3RkaW5cblx0ICogQHBhcmFtIHtib29sfSBbaW5jbHVkZUNvbW1hbmQ9dHJ1ZV0gSW5jbHVkZSB0aGUgY29tbWFuZCBpbiBvdXRwdXRcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0Y21kKGN3ZCwgYXJncyA9IFtdLCBzdGRpbiA9IFwiXCIsIGluY2x1ZGVDb21tYW5kID0gdHJ1ZSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRsZXQgb3V0cHV0ID0gXCJcIjtcblx0XHRcdGNvbnN0IGdpdCA9IGF0b20uY29uZmlnLmdldChcImdpdC1tZW51LmdpdFBhdGhcIik7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdGFyZ3MgPSBhcmdzLmZpbHRlcihpID0+IGkgIT09IFwiXCIpO1xuXHRcdFx0Y29uc3QgYnAgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcblx0XHRcdFx0Y29tbWFuZDogZ2l0LFxuXHRcdFx0XHRhcmdzLFxuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0Y3dkOiBjd2QsXG5cdFx0XHRcdFx0ZW52OiBwcm9jZXNzLmVudixcblx0XHRcdFx0fSxcblx0XHRcdFx0c3Rkb3V0OiBkYXRhID0+IHtcblx0XHRcdFx0XHRvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdGRlcnI6IGRhdGEgPT4ge1xuXHRcdFx0XHRcdG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGV4aXQ6IGNvZGUgPT4ge1xuXHRcdFx0XHRcdG91dHB1dCA9IG91dHB1dC50cmltRW5kKCk7XG5cdFx0XHRcdFx0aWYgKGlzVmVyYm9zZSgpICYmIGluY2x1ZGVDb21tYW5kKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG5cdFx0XHRcdFx0XHRcdG91dHB1dCA9IGA+ICR7YnAucHJvY2Vzcy5zcGF3bmFyZ3NbYnAucHJvY2Vzcy5zcGF3bmFyZ3MubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXlwiKC4rKVwiJC9nLCBcIiQxXCIpfVxcblxcbiR7b3V0cHV0fWA7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRvdXRwdXQgPSBgPiAke2dpdH0gJHthcmdzLmpvaW4oXCIgXCIpfVxcblxcbiR7b3V0cHV0fWA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGNvZGUgPT09IDApIHtcblx0XHRcdFx0XHRcdHJlc29sdmUob3V0cHV0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGBFcnJvciBjb2RlOiAke2NvZGV9XFxuXFxuJHtvdXRwdXR9YCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoc3RkaW4pIHtcblx0XHRcdFx0YnAucHJvY2Vzcy5zdGRpbi53cml0ZShzdGRpbik7XG5cdFx0XHR9XG5cdFx0XHRicC5wcm9jZXNzLnN0ZGluLmVuZCgpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGEgZ2l0IHJlcG9zaXRvcnlcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEBwYXJhbSB7Ym9vbH0gdmVyYm9zZSBOb3QgYWRkIHRoZSAtLXF1aWV0IGZsYWdcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0aW5pdChjd2QsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdGNvbnN0IHZlcmJvc2VBcmdzID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiBcIlwiKTtcblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJpbml0XCIsIHZlcmJvc2VBcmdzXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZSB0aGUgZ2l0IHJlcG9zaXRvcnlcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHZvaWRcblx0ICovXG5cdHJlbW92ZShjd2QpIHtcblx0XHRjb25zdCBnaXRQYXRoID0gcGF0aC5qb2luKGN3ZCwgXCIuZ2l0XCIpO1xuXHRcdHJldHVybiBwcm9taXNpZnkocmltcmFmKShnaXRQYXRoLCB7ZGlzYWJsZUdsb2I6IHRydWV9KTtcblx0fSxcblxuXHQvKipcblx0ICogQ291bnQgY29tbWl0c1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge2ludH0gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0YXN5bmMgY291bnRDb21taXRzKGN3ZCkge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNtZChjd2QsIFtcInJldi1saXN0XCIsIFwiLS1jb3VudFwiLCBcIkhFQURcIl0sIFwiXCIsIGZhbHNlKTtcblx0XHRcdGlmIChpc05hTigrcmVzdWx0KSkge1xuXHRcdFx0XHR0aHJvdyByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gK3Jlc3VsdDtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdC8vIGNoZWNrIGZvciAwIGNvbW1pdHNcblx0XHRcdGNvbnN0IGxvZyA9IGF3YWl0IHRoaXMubG9nKGN3ZCwgMSk7XG5cdFx0XHRpZiAoIWxvZykge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHRcdHRocm93IGVycjtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCBmaWxlcyB0byB0cmFja1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZXMgVGhlIGZpbGVzIHRvIGFkZFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgQWRkIHRoZSAtLXZlcmJvc2UgZmxhZ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcmVzdWx0IG9mIHRoZSBjb21tYW5kXG5cdCAqL1xuXHRhZGQoY3dkLCBmaWxlcywgdmVyYm9zZSA9IGlzVmVyYm9zZSgpKSB7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICh2ZXJib3NlID8gXCItLXZlcmJvc2VcIiA6IFwiXCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcImFkZFwiLCB2ZXJib3NlQXJnLCBcIi0tXCIsIC4uLmZpbGVzXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCBmaWxlcyB0byB0cmFja1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZXMgVGhlIGZpbGVzIHRvIGRpZmZcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0ZGlmZihjd2QsIGZpbGVzKSB7XG5cdFx0cmV0dXJuIHRoaXMuY21kKGN3ZCwgW1wiZGlmZlwiLCBcIi0taWdub3JlLWFsbC1zcGFjZVwiLCBcIi0tXCIsIC4uLmZpbGVzXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIGdpdCByZXBvc2l0b3J5XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgYWJzb2x1dGUgcGF0aCBvZiB0aGUgcm9vdCBkaXJlY3Rvcnlcblx0ICovXG5cdGFzeW5jIHJvb3REaXIoY3dkKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jbWQoY3dkLCBbXCJyZXYtcGFyc2VcIiwgXCItLXNob3ctdG9wbGV2ZWxcIl0sIFwiXCIsIGZhbHNlKTtcblx0XHRpZiAocmVzdWx0LnN0YXJ0c1dpdGgoXCJcXFxcXFxcXFwiKSB8fCByZXN1bHQuc3RhcnRzV2l0aChcInNtYjovL1wiKSkge1xuXHRcdFx0cmV0dXJuIGN3ZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0LnRyaW1FbmQoKS5yZXBsYWNlKC9bXFxcXC9dL2csIHBhdGguc2VwKTtcblx0fSxcblxuXHQvKipcblx0ICogQ29tbWl0IGZpbGVzIHdpdGggbWVzc2FnZSBvciBhbWVuZCBsYXN0IGNvbW1pdCB3aXRoIG1lc3NhZ2Vcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBjb21taXQgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtib29sfSBhbWVuZCBUcnVlID0gYW1lbmQgbGFzdCBjb21taXQsIEZhbHNlID0gY3JlYXRlIG5ldyBjb21taXRcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZXMgVGhlIGZpbGVzIHRvIGNvbW1pdFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdGNvbW1pdChjd2QsIG1lc3NhZ2UsIGFtZW5kLCBmaWxlcyA9IG51bGwsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdGNvbnN0IHZlcmJvc2VBcmcgPSAoIXZlcmJvc2UgPyBcIi0tcXVpZXRcIiA6IFwiXCIpO1xuXHRcdGNvbnN0IGFtZW5kQXJnID0gKGFtZW5kID8gXCItLWFtZW5kXCIgOiBcIlwiKTtcblx0XHRpZiAoZmlsZXMpIHtcblx0XHRcdGZpbGVzLnVuc2hpZnQoXCItLVwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRmaWxlcyA9IFtdO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJjb21taXRcIiwgdmVyYm9zZUFyZywgXCItLWZpbGU9LVwiLCBhbWVuZEFyZywgLi4uZmlsZXNdLCBtZXNzYWdlKTtcblx0fSxcblxuXHQvKipcblx0ICogQ2hlY2tvdXQgYnJhbmNoXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2ggbmFtZSB0byBjaGVja291dFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdGNoZWNrb3V0QnJhbmNoKGN3ZCwgYnJhbmNoLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiBcIlwiKTtcblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJjaGVja291dFwiLCB2ZXJib3NlQXJnLCBicmFuY2hdKTtcblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGJyYW5jaFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoIG5hbWUgdG8gY3JlYXRlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdGUgVGhlIHJlbW90ZSBuYW1lIHRvIGNoZWNrb3V0IGZyb21cblx0ICogQHBhcmFtIHtib29sfSB2ZXJib3NlIE5vdCBhZGQgdGhlIC0tcXVpZXQgZmxhZ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcmVzdWx0IG9mIHRoZSBjb21tYW5kXG5cdCAqL1xuXHRjcmVhdGVCcmFuY2goY3dkLCBicmFuY2gsIHJlbW90ZSwgdmVyYm9zZSA9IGlzVmVyYm9zZSgpKSB7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICghdmVyYm9zZSA/IFwiLS1xdWlldFwiIDogXCJcIik7XG5cdFx0Y29uc3QgcmVtb3RlQXJnID0gW107XG5cdFx0aWYgKHJlbW90ZSkge1xuXHRcdFx0cmVtb3RlQXJnLnB1c2goXCItLXRyYWNrXCIsIGAke3JlbW90ZX0vJHticmFuY2h9YCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcImNoZWNrb3V0XCIsIHZlcmJvc2VBcmcsIFwiLWJcIiwgYnJhbmNoLCAuLi5yZW1vdGVBcmddKTtcblx0fSxcblxuXHQvKipcblx0ICogRGVsZXRlIGEgYnJhbmNoXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2ggbmFtZSB0byBjcmVhdGVcblx0ICogQHBhcmFtIHtib29sfSByZW1vdGUgRGVsZXRlIGEgcmVtb3RlIGJyYW5jaCBpZiBpdCBleGlzdHNcblx0ICogQHBhcmFtIHtib29sfSBmb3JjZSBGb3JjZSBkZWxldGUgdGhlIGJyYW5jaFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdGRlbGV0ZUJyYW5jaChjd2QsIGJyYW5jaCwgcmVtb3RlID0gZmFsc2UsIGZvcmNlID0gZmFsc2UsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdGNvbnN0IGZvcmNlQXJnID0gKGZvcmNlID8gXCItLWZvcmNlXCIgOiBcIlwiKTtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiAocmVtb3RlID8gXCItLXZlcmJvc2VcIiA6IFwiXCIpKTtcblx0XHRsZXQgYXJncztcblx0XHRpZiAocmVtb3RlKSB7XG5cdFx0XHRhcmdzID0gW1wicHVzaFwiLCBcIi0tZGVsZXRlXCIsIGZvcmNlQXJnLCB2ZXJib3NlQXJnLCBcIm9yaWdpblwiLCBicmFuY2hdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcmdzID0gW1wiYnJhbmNoXCIsIFwiLS1kZWxldGVcIiwgZm9yY2VBcmcsIHZlcmJvc2VBcmcsIGJyYW5jaF07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIGFyZ3MpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBTZXQgdXBzdHJlYW0gYnJhbmNoXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlIFRoZSByZW1vdGUgdG8gY3JlYXRlIHRoZSBicmFuY2hcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoIG5hbWVcblx0ICogQHBhcmFtIHtib29sfSB2ZXJib3NlIE5vdCBhZGQgdGhlIC0tcXVpZXQgZmxhZ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcmVzdWx0IG9mIHRoZSBjb21tYW5kXG5cdCAqL1xuXHRzZXRVcHN0cmVhbShjd2QsIHJlbW90ZSwgYnJhbmNoLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKHZlcmJvc2UgPyBcIi0tdmVyYm9zZVwiIDogXCItLXF1aWV0XCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcInB1c2hcIiwgdmVyYm9zZUFyZywgXCItLXNldC11cHN0cmVhbVwiLCByZW1vdGUsIGJyYW5jaF0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVja291dCBmaWxlc1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZXMgVGhlIGZpbGVzIHRvIGNoZWNrb3V0XG5cdCAqIEBwYXJhbSB7Ym9vbH0gdmVyYm9zZSBOb3QgYWRkIHRoZSAtLXF1aWV0IGZsYWdcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0Y2hlY2tvdXRGaWxlcyhjd2QsIGZpbGVzLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiBcIlwiKTtcblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJjaGVja291dFwiLCB2ZXJib3NlQXJnLCBcIi0tXCIsIC4uLmZpbGVzXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbW92ZSB1bnRyYWNrZWQgZmlsZXNcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGZpbGVzIFRoZSBmaWxlcyB0byByZW1vdmVcblx0ICogQHBhcmFtIHtib29sfSB2ZXJib3NlIE5vdCBhZGQgdGhlIC0tcXVpZXQgZmxhZ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcmVzdWx0IG9mIHRoZSBjb21tYW5kXG5cdCAqL1xuXHRjbGVhbihjd2QsIGZpbGVzLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiBcIlwiKTtcblx0XHRpZiAoZmlsZXMubGVuZ3RoID09PSAxICYmIGZpbGVzWzBdID09PSBcIi5cIikge1xuXHRcdFx0Ly8gZmlsZXMgPT09IFtcIi5cIl0gbWVhbnMgYWxsIGZpbGVzXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdGZpbGVzID0gW107XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZpbGVzLnVuc2hpZnQoXCItLVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuY21kKGN3ZCwgW1wiY2xlYW5cIiwgdmVyYm9zZUFyZywgXCItLWZvcmNlXCIsIFwiLWRcIiwgLi4uZmlsZXNdKTtcblx0fSxcblxuXHQvKipcblx0ICogUHVzaCBjb21taXRzIHRvIHJlbW90ZSByZXBvXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge2Jvb2x9IFtmb3JjZT1mYWxzZV0gQWRkIC0tZm9yY2UgZmxhZ1xuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdGFzeW5jIHB1c2goY3dkLCBmb3JjZSA9IGZhbHNlLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB0cmFja2luZyA9IFtdO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY21kKGN3ZCwgW1wic3RhdHVzXCIsIFwiLWJcIiwgXCItLXBvcmNlbGFpblwiXSk7XG5cdFx0Y29uc3QgWywgYnJhbmNoLCByZW1vdGVdID0gcmVzdWx0Lm1hdGNoKC9eIyMgKC4rPykoPzpcXC5cXC5cXC4oLispKT8kL20pO1xuXHRcdGlmICghcmVtb3RlKSB7XG5cdFx0XHR0cmFja2luZy5wdXNoKFwiLS1zZXQtdXBzdHJlYW1cIiwgXCJvcmlnaW5cIiwgYnJhbmNoKTtcblx0XHR9XG5cblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKHZlcmJvc2UgPyBcIi0tdmVyYm9zZVwiIDogXCItLXF1aWV0XCIpO1xuXHRcdGNvbnN0IGZvcmNlQXJnID0gKGZvcmNlID8gXCItLWZvcmNlXCIgOiBcIlwiKTtcblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJwdXNoXCIsIHZlcmJvc2VBcmcsIGZvcmNlQXJnLCAuLi50cmFja2luZ10pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBQdWxsIGNvbW1pdHMgZnJvbSByZW1vdGUgcmVwb1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtib29sfSBbcmViYXNlPWZhbHNlXSBBZGQgLS1yZWJhc2UgZmxhZ1xuXHQgKiBAcGFyYW0ge2Jvb2x9IFtmb3JjZT1mYWxzZV0gQWRkIC0tZm9yY2UgZmxhZ1xuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdHB1bGwoY3dkLCByZWJhc2UgPSBmYWxzZSwgZm9yY2UgPSBmYWxzZSwgdmVyYm9zZSA9IGlzVmVyYm9zZSgpKSB7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICh2ZXJib3NlID8gXCItLXZlcmJvc2VcIiA6IFwiLS1xdWlldFwiKTtcblx0XHRjb25zdCBmb3JjZUFyZyA9IChmb3JjZSA/IFwiLS1mb3JjZVwiIDogXCJcIik7XG5cdFx0Y29uc3QgcmViYXNlQXJnID0gKHJlYmFzZSA/IFwiLS1yZWJhc2VcIiA6IFwiXCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcInB1bGxcIiwgdmVyYm9zZUFyZywgZm9yY2VBcmcsIHJlYmFzZUFyZ10pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNZXJnZSBjb21taXRzIGZyb20gYSBicmFuY2ggaW50byB0aGUgY3VycmVudCBicmFuY2hcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggVGhlIGJyYW5jaCB0byBtZXJnZVxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdG1lcmdlKGN3ZCwgYnJhbmNoLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKHZlcmJvc2UgPyBcIi0tdmVyYm9zZVwiIDogXCItLXF1aWV0XCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcIm1lcmdlXCIsIGJyYW5jaCwgdmVyYm9zZUFyZ10pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZWJhc2UgY29tbWl0cyBmcm9tIGEgYnJhbmNoIGludG8gdGhlIGN1cnJlbnQgYnJhbmNoXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2ggdG8gcmViYXNlIG9uXG5cdCAqIEBwYXJhbSB7Ym9vbH0gdmVyYm9zZSBOb3QgYWRkIHRoZSAtLXF1aWV0IGZsYWdcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0cmViYXNlKGN3ZCwgYnJhbmNoLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKHZlcmJvc2UgPyBcIi0tdmVyYm9zZVwiIDogXCItLXF1aWV0XCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcInJlYmFzZVwiLCBicmFuY2gsIHZlcmJvc2VBcmddKTtcblx0fSxcblxuXHQvKipcblx0ICogQWJvcnQgbWVyZ2Ugb3IgcmViYXNlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge2Jvb2x9IG1lcmdlIHRydWU9bWVyZ2UsIGZhbHNlPXJlYmFzZVxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdGFib3J0KGN3ZCwgbWVyZ2UgPSB0cnVlKSB7XG5cdFx0Y29uc3QgdHlwZSA9IChtZXJnZSA/IFwibWVyZ2VcIiA6IFwicmViYXNlXCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFt0eXBlLCBcIi0tYWJvcnRcIl0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBVbnN0YWdlIGZpbGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBmaWxlcyBUaGUgZmlsZXMgdG8gcmVzZXRcblx0ICogQHBhcmFtIHtib29sfSB2ZXJib3NlIE5vdCBhZGQgdGhlIC0tcXVpZXQgZmxhZ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfSBUaGUgcmVzdWx0IG9mIHRoZSBjb21tYW5kXG5cdCAqL1xuXHR1bnN0YWdlKGN3ZCwgZmlsZXMgPSBudWxsLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKCF2ZXJib3NlID8gXCItLXF1aWV0XCIgOiBcIlwiKTtcblx0XHRpZiAoZmlsZXMpIHtcblx0XHRcdGZpbGVzLnVuc2hpZnQoXCItLVwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRmaWxlcyA9IFtdO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5jbWQoY3dkLCBbXCJyZXNldFwiLCB2ZXJib3NlQXJnLCAuLi5maWxlc10pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBVbmRvIGxhc3QgY29tbWl0XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge2Jvb2x9IFtoYXJkPWZhbHNlXSBEaXNjYXJkIGNoYW5nZXNcblx0ICogQHBhcmFtIHtpbnR9IFtuQ29tbWl0cz0xXSBOdW1iZXIgb2YgY29tbWl0cyB0byB1bmRvLiBEZWZhdWx0ID0gMVxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdHJlc2V0KGN3ZCwgaGFyZCA9IGZhbHNlLCBuQ29tbWl0cyA9IDEsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuXHRcdG5Db21taXRzID0gcGFyc2VJbnQobkNvbW1pdHMsIDEwKTtcblx0XHRpZiAoaXNOYU4obkNvbW1pdHMpIHx8IG5Db21taXRzIDw9IDApIHtcblx0XHRcdHRocm93IFwibkNvbW1pdHMgaXMgbm90IGEgbnVtYmVyIGdyZWF0ZXIgdGhhbiAwXCI7XG5cdFx0fVxuXHRcdGNvbnN0IGhhcmRBcmcgPSAoaGFyZCA/IFwiLS1oYXJkXCIgOiBcIi0tbWl4ZWRcIik7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICghdmVyYm9zZSA/IFwiLS1xdWlldFwiIDogXCJcIik7XG5cdFx0cmV0dXJuIHRoaXMuY21kKGN3ZCwgW1wicmVzZXRcIiwgaGFyZEFyZywgdmVyYm9zZUFyZywgYEhFQUR+JHtuQ29tbWl0c31gXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBsYXN0IGNvbW1pdCBtZXNzYWdlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7c3RyaW5nfG51bGx9IFRoZSBsYXN0IGNvbW1pdCBtZXNzYWdlIG9yIG51bGwgaWYgbm8gY29tbWl0c1xuXHQgKi9cblx0YXN5bmMgbGFzdENvbW1pdChjd2QpIHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmxvZyhjd2QsIDEpO1xuXHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IExvZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtpbnR9IFtudW1iZXI9MV0gTnVtYmVyIG9mIGNvbW1pdHNcblx0ICogQHBhcmFtIHtzdHJpbmd9IFtvZmZzZXQ9MF0gT2Zmc2V0XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBbZm9ybWF0PVwiJUJcIl0gRm9ybWF0XG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd8bnVsbH0gVGhlIGxhc3QgY29tbWl0IG1lc3NhZ2Ugb3IgbnVsbCBpZiBubyBjb21taXRzXG5cdCAqL1xuXHRhc3luYyBsb2coY3dkLCBudW1iZXIgPSAxLCBvZmZzZXQgPSAwLCBmb3JtYXQgPSBcIiVCXCIpIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IHRoaXMuY21kKGN3ZCwgW1wibG9nXCIsIGAtLW1heC1jb3VudD0ke251bWJlcn1gLCBgLS1za2lwPSR7b2Zmc2V0fWAsIGAtLWZvcm1hdD0ke2Zvcm1hdH1gXSwgXCJcIiwgZmFsc2UpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoZXJyb3IuZW5kc1dpdGgoXCJkb2VzIG5vdCBoYXZlIGFueSBjb21taXRzIHlldFwiKSkge1xuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdH1cblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogR2V0IHRoZSBzdGF0dXMgb24gY2hhbmdlZCBmaWxlc1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRocyBUaGUgZGlyZWN0b3J5cyBvciBmaWxlcyB0byBjaGVja1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSB7b2JqZWN0W119IFN0YXR1cyBvYmplY3RzXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgW1xuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZDogYm9vbCxcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdW50cmFja2VkOiBib29sLFxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkOiBib29sLFxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBib29sLFxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBzdHJpbmcsXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAuLi5cblx0ICogICAgICAgICAgICAgICAgICAgICAgICBdXG5cdCAqL1xuXHRhc3luYyBzdGF0dXMoY3dkLCBmaWxlUGF0aHMpIHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNtZChjd2QsIFtcInN0YXR1c1wiLCBcIi0tcG9yY2VsYWluXCIsIFwiLS11bnRyYWNrZWQtZmlsZXM9YWxsXCIsIC4uLmZpbGVQYXRoc10sIFwiXCIsIGZhbHNlKTtcblx0XHRpZiAocmVzdWx0ID09PSBcIlwiKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdC50cmltRW5kKCkuc3BsaXQoXCJcXG5cIikubWFwKGxpbmUgPT4ge1xuXHRcdFx0Y29uc3QgbGluZU1hdGNoID0gbGluZS5tYXRjaCgvXihbIE1BRFJDVT9dezJ9KSBcIj8oLio/KVwiPyQvKTtcblx0XHRcdGlmICghbGluZU1hdGNoKSB7XG5cdFx0XHRcdHRocm93IGBnaXQgc3RhdHVzIG91dHB1dCBpbnZhbGlkOiAnJHtsaW5lLnJlcGxhY2UoXCIgXCIsIFwiwrdcIil9J2A7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBbLCBjb2RlLCBmaWxlXSA9IGxpbmVNYXRjaDtcblx0XHRcdGNvbnN0IHN0YXR1cyA9IHRoaXMuc3RhdHVzRnJvbUNvZGUoY29kZSk7XG5cdFx0XHRpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aHJvdyBgVW5rbm93biBjb2RlICcke2xpbmUucmVwbGFjZShcIiBcIiwgXCLCt1wiKX0nYDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7Li4uc3RhdHVzLCBmaWxlfTtcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IHRoZSBmaWxlIHN0YXR1cyBmcm9tIHRoZSBnaXQgc3RhdHVzIGNvZGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgVGhlIGNvZGUgZnJvbSBgZ2l0IHN0YXR1c2Bcblx0ICogQHJldHVybiB7T2JqZWN0fSB7XG5cdCAqICAgICAgICAgICAgICAgICAgICBhZGRlZDogYm9vbCxcblx0ICogICAgICAgICAgICAgICAgICAgIHVudHJhY2tlZDogYm9vbCxcblx0ICogICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQ6IGJvb2wsXG5cdCAqICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBib29sLFxuXHQgKiAgICAgICAgICAgICAgICAgIH1cblx0ICovXG5cdHN0YXR1c0Zyb21Db2RlKGNvZGUpIHtcblx0XHRsZXQgYWRkZWQgPSBmYWxzZTtcblx0XHRsZXQgdW50cmFja2VkID0gZmFsc2U7XG5cdFx0bGV0IGRlbGV0ZWQgPSBmYWxzZTtcblx0XHRsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXHRcdHN3aXRjaCAoY29kZSkge1xuXHRcdGNhc2UgXCJNIFwiOlxuXHRcdGNhc2UgXCJNTVwiOlxuXHRcdGNhc2UgXCJNRFwiOlxuXHRcdGNhc2UgXCJVVVwiOlxuXHRcdFx0YWRkZWQgPSB0cnVlO1xuXHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiIE1cIjpcblx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkQgXCI6XG5cdFx0Y2FzZSBcIkREXCI6XG5cdFx0Y2FzZSBcIkRNXCI6XG5cdFx0Y2FzZSBcIlVEXCI6XG5cdFx0Y2FzZSBcIkRVXCI6XG5cdFx0XHRhZGRlZCA9IHRydWU7XG5cdFx0XHRkZWxldGVkID0gdHJ1ZTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCIgRFwiOlxuXHRcdFx0ZGVsZXRlZCA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiQSBcIjpcblx0XHRjYXNlIFwiQT9cIjpcblx0XHRjYXNlIFwiQU1cIjpcblx0XHRjYXNlIFwiQURcIjpcblx0XHRjYXNlIFwiUiBcIjpcblx0XHRjYXNlIFwiUk1cIjpcblx0XHRjYXNlIFwiUkRcIjpcblx0XHRjYXNlIFwiQUFcIjpcblx0XHRjYXNlIFwiQVVcIjpcblx0XHRjYXNlIFwiVUFcIjpcblx0XHRcdGFkZGVkID0gdHJ1ZTtcblx0XHRcdHVudHJhY2tlZCA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiPz9cIjpcblx0XHRcdHVudHJhY2tlZCA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRhZGRlZCxcblx0XHRcdHVudHJhY2tlZCxcblx0XHRcdGRlbGV0ZWQsXG5cdFx0XHRjaGFuZ2VkLFxuXHRcdH07XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCByZXBvIGJyYW5jaGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge2Jvb2x9IFtyZW1vdGVzPXRydWVdIExpc3QgcmVtb3RlIGJyYW5jaGVzXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtvYmplY3RbXX0gUmVwb3NpdG9yeSBicmFuY2ggbmFtZXNcblx0ICovXG5cdGFzeW5jIGJyYW5jaGVzKGN3ZCwgcmVtb3RlcyA9IHRydWUpIHtcblx0XHRjb25zdCByZW1vdGVzQXJnID0gKHJlbW90ZXMgPyBcIi0tYWxsXCIgOiBcIlwiKTtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNtZChjd2QsIFtcImJyYW5jaFwiLCBcIi0tbGlzdFwiLCByZW1vdGVzQXJnXSwgXCJcIiwgZmFsc2UpO1xuXHRcdGlmIChyZXN1bHQgPT09IFwiXCIpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gT2JqZWN0LnZhbHVlcyhyZXN1bHQuc3BsaXQoXCJcXG5cIikucmVkdWNlKChicmFuY2hlcywgbGluZSkgPT4ge1xuXHRcdFx0Y29uc3QgYnJhbmNoID0gbGluZS50cmltKCk7XG5cblx0XHRcdGlmIChicmFuY2gubWF0Y2goL1xcL0hFQURcXGIvKSkge1xuXHRcdFx0XHRyZXR1cm4gYnJhbmNoZXM7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlbGVjdGVkID0gYnJhbmNoLnN0YXJ0c1dpdGgoXCIqIFwiKTtcblx0XHRcdGNvbnN0IHJlbW90ZSA9IGJyYW5jaC5pbmNsdWRlcyhcInJlbW90ZXMvb3JpZ2luL1wiKTtcblx0XHRcdGNvbnN0IGxvY2FsID0gIXJlbW90ZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBicmFuY2gucmVwbGFjZSgvXihcXCogKT8ocmVtb3Rlc1xcL29yaWdpblxcLyk/LywgXCJcIik7XG5cblx0XHRcdGlmIChuYW1lIGluIGJyYW5jaGVzKSB7XG5cdFx0XHRcdGlmIChsb2NhbCkge1xuXHRcdFx0XHRcdGJyYW5jaGVzW25hbWVdLmxvY2FsID0gdHJ1ZTtcblx0XHRcdFx0XHRicmFuY2hlc1tuYW1lXS5icmFuY2ggPSBicmFuY2g7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnJhbmNoZXNbbmFtZV0ucmVtb3RlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRicmFuY2hlc1tuYW1lXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJhbmNoZXNbbmFtZV0uYnJhbmNoID0gYnJhbmNoO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRicmFuY2hlc1tuYW1lXSA9IHticmFuY2gsIG5hbWUsIHNlbGVjdGVkLCBsb2NhbCwgcmVtb3RlfTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBicmFuY2hlcztcblx0XHR9LCB7fSkpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBGZXRjaCBmcm9tIHJlbW90ZXNcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN3ZCBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5XG5cdCAqIEBwYXJhbSB7Ym9vbH0gdmVyYm9zZSBOb3QgYWRkIHRoZSAtLXF1aWV0IGZsYWdcblx0ICogQHJldHVybiB7UHJvbWlzZX0ge3N0cmluZ30gVGhlIHJlc3VsdCBvZiB0aGUgY29tbWFuZFxuXHQgKi9cblx0ZmV0Y2goY3dkLCB2ZXJib3NlID0gaXNWZXJib3NlKCkpIHtcblx0XHRjb25zdCB2ZXJib3NlQXJnID0gKHZlcmJvc2UgPyBcIi0tdmVyYm9zZVwiIDogXCItLXF1aWV0XCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcImZldGNoXCIsIFwiLS1hbGxcIiwgXCItLXBydW5lXCIsIHZlcmJvc2VBcmddKTtcblx0fSxcblxuXHQvKipcblx0ICogU3Rhc2ggb3IgdW5zdGFzaCBjaGFuZ2VzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjd2QgQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeVxuXHQgKiBAcGFyYW0ge2Jvb2x9IFtwb3A9ZmFsc2VdIFJlc3RvcmUgdGhlIGxhc3QgY2hhbmdlcyB0aGF0IHdlcmUgc3Rhc2hlZFxuXHQgKiBAcGFyYW0ge2Jvb2x9IHZlcmJvc2UgTm90IGFkZCB0aGUgLS1xdWlldCBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdHN0YXNoKGN3ZCwgcG9wID0gZmFsc2UsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdGNvbnN0IHBvcEFyZyA9IChwb3AgPyBcInBvcFwiIDogXCJcIik7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICghdmVyYm9zZSA/IFwiLS1xdWlldFwiIDogXCJcIik7XG5cdFx0cmV0dXJuIHRoaXMuY21kKGN3ZCwgW1wic3Rhc2hcIiwgcG9wQXJnLCB2ZXJib3NlQXJnXSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVwZGF0ZSBpbmRleCBhbmQgaWdub3JlL3VuaWdub3JlIGNoYW5nZXMgZnJvbSB0aGVzZSBmaWxlc1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gY3dkIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnlcblx0ICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZXMgVGhlIGZpbGVzIHVwZGF0ZVxuXHQgKiBAcGFyYW0ge2Jvb2x9IFtpZ25vcmU9dHJ1ZV0gVG8gaWdub3JlIG9yIHVuaWdub3JlXG5cdCAqIEBwYXJhbSB7Ym9vbH0gdmVyYm9zZSBBZGQgdGhlIC0tdmVyYm9zZSBmbGFnXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IHtzdHJpbmd9IFRoZSByZXN1bHQgb2YgdGhlIGNvbW1hbmRcblx0ICovXG5cdHVwZGF0ZUluZGV4KGN3ZCwgZmlsZXMsIGlnbm9yZSA9IHRydWUsIHZlcmJvc2UgPSBpc1ZlcmJvc2UoKSkge1xuXHRcdGNvbnN0IGFzc3VtZVVuY2hhbmdlZEFyZyA9IChpZ25vcmUgPyBcIi0tYXNzdW1lLXVuY2hhbmdlZFwiIDogXCItLW5vLWFzc3VtZS11bmNoYW5nZWRcIik7XG5cdFx0Y29uc3QgdmVyYm9zZUFyZyA9ICh2ZXJib3NlID8gXCItLXZlcmJvc2VcIiA6IFwiXCIpO1xuXHRcdHJldHVybiB0aGlzLmNtZChjd2QsIFtcInVwZGF0ZS1pbmRleFwiLCBhc3N1bWVVbmNoYW5nZWRBcmcsIHZlcmJvc2VBcmcsIFwiLS1zdGRpblwiXSwgZmlsZXMuam9pbihcIlxcblwiKSk7XG5cdH0sXG59O1xuIl19