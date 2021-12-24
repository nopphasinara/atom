Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _dialogsRunCommandDialog = require("../dialogs/RunCommandDialog");

var _dialogsRunCommandDialog2 = _interopRequireDefault(_dialogsRunCommandDialog);

var _stringArgv = require("string-argv");

var _stringArgv2 = _interopRequireDefault(_stringArgv);

exports["default"] = {
	label: "Run Command...",
	description: "Run a git command",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsRunCommandDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Run Command" : arguments[5];

		var _ref = yield _helper2["default"].getRootAndFilesStatuses(filePaths, git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		yield _helper2["default"].checkGitLock(root);
		var treeView = atom.config.get("git-menu.treeView");

		var _ref3 = yield new dialog({ files: files, treeView: treeView }).activate();

		var _ref32 = _slicedToArray(_ref3, 2);

		var gitCommand = _ref32[0];
		var selectedFiles = _ref32[1];

		if (!gitCommand) {
			throw "Command cannot be blank.";
		}
		var trimmedGitCommand = gitCommand.trim().replace(/^git /, "");

		statusBar.show("Running...");
		var selectedFilePaths = selectedFiles.map(function (file) {
			return _path2["default"].join(root, file);
		});
		var numFiles = selectedFiles.length + " file" + (selectedFiles.length !== 1 ? "s" : "");
		var includedFiles = false;
		var gitArgs = (0, _stringArgv2["default"])(trimmedGitCommand).reduce(function (prev, arg) {
			if (arg === "%files%") {
				includedFiles = true;
				selectedFilePaths.forEach(function (file) {
					prev.push(file);
				});
			} else {
				prev.push(arg);
			}
			return prev;
		}, []);

		yield _helper2["default"].checkGitLock(root);
		var result = yield git.cmd(root, gitArgs);
		notifications.addGit(gitCommand, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Ran 'git " + trimmedGitCommand + "'" + (includedFiles ? " with " + numFiles + "." : "")
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcnVuLWNvbW1hbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3NCQUNKLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7dUNBQ2YsNkJBQTZCOzs7OzBCQUNuQyxhQUFhOzs7O3FCQUVyQjtBQUNkLE1BQUssRUFBRSxnQkFBZ0I7QUFDdkIsWUFBVyxFQUFFLG1CQUFtQjtBQUNoQyxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFpRztNQUEvRixHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQXFCLEtBQUsseURBQUcsYUFBYTs7YUFDMUcsTUFBTSxvQkFBTyx1QkFBdUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDOzs7O01BQW5FLEtBQUs7TUFBRSxJQUFJOztBQUNsQixRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztjQUNsQixNQUFNLElBQUksTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Ozs7TUFBM0UsVUFBVTtNQUFFLGFBQWE7O0FBQ2hDLE1BQUksQ0FBQyxVQUFVLEVBQUU7QUFDaEIsU0FBTSwwQkFBMEIsQ0FBQztHQUNqQztBQUNELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWpFLFdBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0IsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtVQUFJLGtCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sUUFBUSxHQUFNLGFBQWEsQ0FBQyxNQUFNLGNBQVEsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUM7QUFDeEYsTUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE1BQU0sT0FBTyxHQUFHLDZCQUFXLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBSztBQUNuRSxPQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7QUFDdEIsaUJBQWEsR0FBRyxJQUFJLENBQUM7QUFDckIscUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ2pDLFNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTTtBQUNOLFFBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZjtBQUNELFVBQU8sSUFBSSxDQUFDO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFUCxRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLGVBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLGdCQUFjLGlCQUFpQixVQUFJLGFBQWEsY0FBWSxRQUFRLFNBQU0sRUFBRSxDQUFBLEFBQUU7R0FDckYsQ0FBQztFQUNGLENBQUE7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbW1hbmRzL3J1bi1jb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuaW1wb3J0IFJ1bkNvbW1hbmREaWFsb2cgZnJvbSBcIi4uL2RpYWxvZ3MvUnVuQ29tbWFuZERpYWxvZ1wiO1xuaW1wb3J0IHN0cmluZ0FyZ3YgZnJvbSBcInN0cmluZy1hcmd2XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiUnVuIENvbW1hbmQuLi5cIixcblx0ZGVzY3JpcHRpb246IFwiUnVuIGEgZ2l0IGNvbW1hbmRcIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgZGlhbG9nID0gUnVuQ29tbWFuZERpYWxvZywgdGl0bGUgPSBcIlJ1biBDb21tYW5kXCIpIHtcblx0XHRjb25zdCBbZmlsZXMsIHJvb3RdID0gYXdhaXQgaGVscGVyLmdldFJvb3RBbmRGaWxlc1N0YXR1c2VzKGZpbGVQYXRocywgZ2l0KTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IHRyZWVWaWV3ID0gYXRvbS5jb25maWcuZ2V0KFwiZ2l0LW1lbnUudHJlZVZpZXdcIik7XG5cdFx0Y29uc3QgW2dpdENvbW1hbmQsIHNlbGVjdGVkRmlsZXNdID0gYXdhaXQgbmV3IGRpYWxvZyh7ZmlsZXMsIHRyZWVWaWV3fSkuYWN0aXZhdGUoKTtcblx0XHRpZiAoIWdpdENvbW1hbmQpIHtcblx0XHRcdHRocm93IFwiQ29tbWFuZCBjYW5ub3QgYmUgYmxhbmsuXCI7XG5cdFx0fVxuXHRcdGNvbnN0IHRyaW1tZWRHaXRDb21tYW5kID0gZ2l0Q29tbWFuZC50cmltKCkucmVwbGFjZSgvXmdpdCAvLCBcIlwiKTtcblxuXHRcdHN0YXR1c0Jhci5zaG93KFwiUnVubmluZy4uLlwiKTtcblx0XHRjb25zdCBzZWxlY3RlZEZpbGVQYXRocyA9IHNlbGVjdGVkRmlsZXMubWFwKGZpbGUgPT4gcGF0aC5qb2luKHJvb3QsIGZpbGUpKTtcblx0XHRjb25zdCBudW1GaWxlcyA9IGAke3NlbGVjdGVkRmlsZXMubGVuZ3RofSBmaWxlJHtzZWxlY3RlZEZpbGVzLmxlbmd0aCAhPT0gMSA/IFwic1wiIDogXCJcIn1gO1xuXHRcdGxldCBpbmNsdWRlZEZpbGVzID0gZmFsc2U7XG5cdFx0Y29uc3QgZ2l0QXJncyA9IHN0cmluZ0FyZ3YodHJpbW1lZEdpdENvbW1hbmQpLnJlZHVjZSgocHJldiwgYXJnKSA9PiB7XG5cdFx0XHRpZiAoYXJnID09PSBcIiVmaWxlcyVcIikge1xuXHRcdFx0XHRpbmNsdWRlZEZpbGVzID0gdHJ1ZTtcblx0XHRcdFx0c2VsZWN0ZWRGaWxlUGF0aHMuZm9yRWFjaChmaWxlID0+IHtcblx0XHRcdFx0XHRwcmV2LnB1c2goZmlsZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJldi5wdXNoKGFyZyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCBbXSk7XG5cblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdpdC5jbWQocm9vdCwgZ2l0QXJncyk7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQoZ2l0Q29tbWFuZCwgcmVzdWx0KTtcblx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogYFJhbiAnZ2l0ICR7dHJpbW1lZEdpdENvbW1hbmR9JyR7aW5jbHVkZWRGaWxlcyA/IGAgd2l0aCAke251bUZpbGVzfS5gIDogXCJcIn1gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19