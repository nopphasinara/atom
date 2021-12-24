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

exports["default"] = {
	label: "Ignore Changes",
	description: "Ignore changes to selected files",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var ignore = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Ignore Changes" : arguments[5];

		var _ref = yield Promise.all([_helper2["default"].getRootAndAllFiles(filePaths, git), _helper2["default"].getStatuses(filePaths, git)]);

		var _ref2 = _slicedToArray(_ref, 2);

		var _ref2$0 = _slicedToArray(_ref2[0], 2);

		var files = _ref2$0[0];
		var root = _ref2$0[1];
		var statuses = _ref2[1];

		yield _helper2["default"].checkGitLock(root);

		var trackedFiles = files.filter(function (file) {
			return !statuses.some(function (status) {
				return status.untracked && _path2["default"].resolve(root, status.file) === file;
			});
		});

		statusBar.show((ignore ? "I" : "Uni") + "gnoring...", null);

		var result = yield git.updateIndex(root, trackedFiles, ignore);
		notifications.addGit(title, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: trackedFiles.length + " File" + (trackedFiles.length !== 1 ? "s" : "") + " " + (ignore ? "I" : "Uni") + "gnored."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvaWdub3JlLWNoYW5nZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3NCQUNKLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7cUJBRTdCO0FBQ2QsTUFBSyxFQUFFLGdCQUFnQjtBQUN2QixZQUFXLEVBQUUsa0NBQWtDO0FBQy9DLEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQXdGO01BQXRGLEdBQUc7TUFBVyxhQUFhO01BQWtCLE1BQU0seURBQUcsSUFBSTtNQUFFLEtBQUsseURBQUcsZ0JBQWdCOzthQUNyRixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDbkQsb0JBQU8sa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUN6QyxvQkFBTyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUNsQyxDQUFDOzs7Ozs7TUFITSxLQUFLO01BQUUsSUFBSTtNQUFHLFFBQVE7O0FBSTlCLFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3pDLFVBQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQy9CLFdBQU8sTUFBTSxDQUFDLFNBQVMsSUFBSSxrQkFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDcEUsQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILFdBQVMsQ0FBQyxJQUFJLEVBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUEsaUJBQWMsSUFBSSxDQUFDLENBQUM7O0FBRTFELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLEVBQUssWUFBWSxDQUFDLE1BQU0sY0FBUSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLFVBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUEsWUFBUztHQUM1RyxDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvaWdub3JlLWNoYW5nZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiSWdub3JlIENoYW5nZXNcIixcblx0ZGVzY3JpcHRpb246IFwiSWdub3JlIGNoYW5nZXMgdG8gc2VsZWN0ZWQgZmlsZXNcIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgaWdub3JlID0gdHJ1ZSwgdGl0bGUgPSBcIklnbm9yZSBDaGFuZ2VzXCIpIHtcblx0XHRjb25zdCBbW2ZpbGVzLCByb290XSwgc3RhdHVzZXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdFx0aGVscGVyLmdldFJvb3RBbmRBbGxGaWxlcyhmaWxlUGF0aHMsIGdpdCksXG5cdFx0XHRoZWxwZXIuZ2V0U3RhdHVzZXMoZmlsZVBhdGhzLCBnaXQpLFxuXHRcdF0pO1xuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cblx0XHRjb25zdCB0cmFja2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiB7XG5cdFx0XHRyZXR1cm4gIXN0YXR1c2VzLnNvbWUoc3RhdHVzID0+IHtcblx0XHRcdFx0cmV0dXJuIHN0YXR1cy51bnRyYWNrZWQgJiYgcGF0aC5yZXNvbHZlKHJvb3QsIHN0YXR1cy5maWxlKSA9PT0gZmlsZTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0c3RhdHVzQmFyLnNob3coYCR7aWdub3JlID8gXCJJXCIgOiBcIlVuaVwifWdub3JpbmcuLi5gLCBudWxsKTtcblxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdpdC51cGRhdGVJbmRleChyb290LCB0cmFja2VkRmlsZXMsIGlnbm9yZSk7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdCk7XG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IGAke3RyYWNrZWRGaWxlcy5sZW5ndGh9IEZpbGUke3RyYWNrZWRGaWxlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9ICR7aWdub3JlID8gXCJJXCIgOiBcIlVuaVwifWdub3JlZC5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19