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

var _dialogsCreateBranchDialog = require("../dialogs/CreateBranchDialog");

var _dialogsCreateBranchDialog2 = _interopRequireDefault(_dialogsCreateBranchDialog);

exports["default"] = {
	label: "Create Branch...",
	description: "Create a new branch",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsCreateBranchDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Create Branch" : arguments[5];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);

		var branches = yield git.branches(root);

		var _ref = yield new dialog({ branches: branches, root: root }).activate();

		var _ref2 = _slicedToArray(_ref, 3);

		var sourceBranch = _ref2[0];
		var newBranch = _ref2[1];
		var track = _ref2[2];

		statusBar.show("Creating Branch...");

		yield _helper2["default"].checkGitLock(root);
		var results = [];
		results.push((yield git.checkoutBranch(root, sourceBranch)));

		results.push((yield git.createBranch(root, newBranch)));
		notifications.addGit(title, results);

		_helper2["default"].refreshAtom(root);

		var tracking = "";
		if (track) {
			var trackResult = yield git.setUpstream(root, "origin", newBranch);
			notifications.addGit(title, trackResult);

			_helper2["default"].refreshAtom(root);
			tracking = " and tracking origin/" + newBranch;
		}

		return {
			title: title,
			message: "Created " + newBranch + " from " + sourceBranch + tracking + "."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY3JlYXRlLWJyYW5jaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7eUNBQ2IsK0JBQStCOzs7O3FCQUUvQztBQUNkLE1BQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBVyxFQUFFLHFCQUFxQjtBQUNsQyxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFxRztNQUFuRyxHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQXVCLEtBQUsseURBQUcsZUFBZTs7QUFDcEksTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O2FBQ0QsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBUixRQUFRLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFOzs7O01BQS9FLFlBQVk7TUFBRSxTQUFTO01BQUUsS0FBSzs7QUFFckMsV0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVyQyxRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkIsU0FBTyxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFBLENBQUMsQ0FBQzs7QUFFM0QsU0FBTyxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUN0RCxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFckMsc0JBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV6QixNQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsTUFBSSxLQUFLLEVBQUU7QUFDVixPQUFNLFdBQVcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxnQkFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRXpDLHVCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixXQUFRLDZCQUEyQixTQUFTLEFBQUUsQ0FBQztHQUMvQzs7QUFFRCxTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLGVBQWEsU0FBUyxjQUFTLFlBQVksR0FBRyxRQUFRLE1BQUc7R0FDaEUsQ0FBQztFQUNGLENBQUE7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbW1hbmRzL2NyZWF0ZS1icmFuY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCBDcmVhdGVCcmFuY2hEaWFsb2cgZnJvbSBcIi4uL2RpYWxvZ3MvQ3JlYXRlQnJhbmNoRGlhbG9nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiQ3JlYXRlIEJyYW5jaC4uLlwiLFxuXHRkZXNjcmlwdGlvbjogXCJDcmVhdGUgYSBuZXcgYnJhbmNoXCIsXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIGRpYWxvZyA9IENyZWF0ZUJyYW5jaERpYWxvZywgdGl0bGUgPSBcIkNyZWF0ZSBCcmFuY2hcIikge1xuXHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdChmaWxlUGF0aHMsIGdpdCk7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblxuXHRcdGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgZ2l0LmJyYW5jaGVzKHJvb3QpO1xuXHRcdGNvbnN0IFtzb3VyY2VCcmFuY2gsIG5ld0JyYW5jaCwgdHJhY2tdID0gYXdhaXQgbmV3IGRpYWxvZyh7YnJhbmNoZXMsIHJvb3R9KS5hY3RpdmF0ZSgpO1xuXG5cdFx0c3RhdHVzQmFyLnNob3coXCJDcmVhdGluZyBCcmFuY2guLi5cIik7XG5cblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmNoZWNrb3V0QnJhbmNoKHJvb3QsIHNvdXJjZUJyYW5jaCkpO1xuXG5cdFx0cmVzdWx0cy5wdXNoKGF3YWl0IGdpdC5jcmVhdGVCcmFuY2gocm9vdCwgbmV3QnJhbmNoKSk7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdHMpO1xuXG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXG5cdFx0bGV0IHRyYWNraW5nID0gXCJcIjtcblx0XHRpZiAodHJhY2spIHtcblx0XHRcdGNvbnN0IHRyYWNrUmVzdWx0ID0gYXdhaXQgZ2l0LnNldFVwc3RyZWFtKHJvb3QsIFwib3JpZ2luXCIsIG5ld0JyYW5jaCk7XG5cdFx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgdHJhY2tSZXN1bHQpO1xuXG5cdFx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0XHR0cmFja2luZyA9IGAgYW5kIHRyYWNraW5nIG9yaWdpbi8ke25ld0JyYW5jaH1gO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IGBDcmVhdGVkICR7bmV3QnJhbmNofSBmcm9tICR7c291cmNlQnJhbmNofSR7dHJhY2tpbmd9LmAsXG5cdFx0fTtcblx0fSxcbn07XG4iXX0=