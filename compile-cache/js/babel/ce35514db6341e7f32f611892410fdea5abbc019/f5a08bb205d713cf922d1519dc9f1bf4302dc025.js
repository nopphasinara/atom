Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _dialogsSwitchBranchDialog = require("../dialogs/SwitchBranchDialog");

var _dialogsSwitchBranchDialog2 = _interopRequireDefault(_dialogsSwitchBranchDialog);

exports["default"] = {
	label: "Switch Branch...",
	description: "Checkout a different branch",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsSwitchBranchDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Switch Branch" : arguments[5];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);

		var branches = yield git.branches(root);

		var _ref = yield new dialog({ branches: branches, root: root }).activate();

		var _ref2 = _slicedToArray(_ref, 2);

		var branchName = _ref2[0];
		var remote = _ref2[1];

		statusBar.show("Switching Branch...");

		yield _helper2["default"].checkGitLock(root);
		var result = remote ? (yield git.createBranch(root, branchName, remote)) : (yield git.checkoutBranch(root, branchName));
		notifications.addGit(title, result);

		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Switched to " + branchName + "."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3dpdGNoLWJyYW5jaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7eUNBQ2IsK0JBQStCOzs7O3FCQUUvQztBQUNkLE1BQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBVyxFQUFFLDZCQUE2QjtBQUMxQyxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFxRztNQUFuRyxHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQXVCLEtBQUsseURBQUcsZUFBZTs7QUFDcEksTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O2FBQ2IsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBUixRQUFRLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFOzs7O01BQW5FLFVBQVU7TUFBRSxNQUFNOztBQUV6QixXQUFTLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRXRDLFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFDbEIsTUFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUEsSUFDaEQsTUFBTSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQSxDQUFDO0FBQzlDLGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVwQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxtQkFBaUIsVUFBVSxNQUFHO0dBQ3JDLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9zd2l0Y2gtYnJhbmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5pbXBvcnQgU3dpdGNoQnJhbmNoRGlhbG9nIGZyb20gXCIuLi9kaWFsb2dzL1N3aXRjaEJyYW5jaERpYWxvZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlN3aXRjaCBCcmFuY2guLi5cIixcblx0ZGVzY3JpcHRpb246IFwiQ2hlY2tvdXQgYSBkaWZmZXJlbnQgYnJhbmNoXCIsXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIGRpYWxvZyA9IFN3aXRjaEJyYW5jaERpYWxvZywgdGl0bGUgPSBcIlN3aXRjaCBCcmFuY2hcIikge1xuXHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdChmaWxlUGF0aHMsIGdpdCk7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblxuXHRcdGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgZ2l0LmJyYW5jaGVzKHJvb3QpO1xuXHRcdGNvbnN0IFticmFuY2hOYW1lLCByZW1vdGVdID0gYXdhaXQgbmV3IGRpYWxvZyh7YnJhbmNoZXMsIHJvb3R9KS5hY3RpdmF0ZSgpO1xuXG5cdFx0c3RhdHVzQmFyLnNob3coXCJTd2l0Y2hpbmcgQnJhbmNoLi4uXCIpO1xuXG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblx0XHRjb25zdCByZXN1bHQgPSByZW1vdGVcblx0XHRcdD8gYXdhaXQgZ2l0LmNyZWF0ZUJyYW5jaChyb290LCBicmFuY2hOYW1lLCByZW1vdGUpXG5cdFx0XHQ6IGF3YWl0IGdpdC5jaGVja291dEJyYW5jaChyb290LCBicmFuY2hOYW1lKTtcblx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgcmVzdWx0KTtcblxuXHRcdGhlbHBlci5yZWZyZXNoQXRvbShyb290KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBgU3dpdGNoZWQgdG8gJHticmFuY2hOYW1lfS5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19