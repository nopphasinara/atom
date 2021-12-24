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

var _dialogsDeleteBranchDialog = require("../dialogs/DeleteBranchDialog");

var _dialogsDeleteBranchDialog2 = _interopRequireDefault(_dialogsDeleteBranchDialog);

exports["default"] = {
	label: "Delete Branch...",
	description: "Delete a branch",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsDeleteBranchDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Delete Branch" : arguments[5];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);

		var branches = yield git.branches(root);

		var _ref = yield new dialog({ branches: branches, root: root }).activate();

		var _ref2 = _slicedToArray(_ref, 4);

		var branch = _ref2[0];
		var local = _ref2[1];
		var remote = _ref2[2];
		var force = _ref2[3];

		if (!local && !remote) {
			return;
		}

		statusBar.show("Deleting Branch...");

		yield _helper2["default"].checkGitLock(root);
		var results = [];
		if (branch.selected) {
			var defaultBranch = _helper2["default"].getDefaultBranch(branches);
			if (defaultBranch) {
				// if branch is current branch then checkout master first
				if (branch.name === defaultBranch.name) {
					branches = yield git.branches(root);
					var br = branches.find(function (b) {
						return !b.selected && b.local;
					});
					if (br) {
						results.push((yield git.checkoutBranch(root, br.name)));
					}
				} else {
					results.push((yield git.checkoutBranch(root, defaultBranch.name)));
				}

				if (results.length > 0) {
					_helper2["default"].refreshAtom(root);
				}
			}
		}

		if (local) {
			results.push((yield git.deleteBranch(root, branch.name, false, force)));

			_helper2["default"].refreshAtom(root);
		}

		if (remote) {
			results.push((yield git.deleteBranch(root, branch.name, true, force)));

			_helper2["default"].refreshAtom(root);
		}

		notifications.addGit(title, results);

		return {
			title: title,
			message: "Deleted branch " + branch.name + "."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGVsZXRlLWJyYW5jaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7eUNBQ2IsK0JBQStCOzs7O3FCQUUvQztBQUNkLE1BQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBVyxFQUFFLGlCQUFpQjtBQUM5QixBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFxRztNQUFuRyxHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQXVCLEtBQUsseURBQUcsZUFBZTs7QUFDcEksTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxNQUFJLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O2FBQ0QsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBUixRQUFRLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFOzs7O01BQTdFLE1BQU07TUFBRSxLQUFLO01BQUUsTUFBTTtNQUFFLEtBQUs7O0FBRW5DLE1BQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDdEIsVUFBTztHQUNQOztBQUVELFdBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFckMsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLE1BQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNwQixPQUFNLGFBQWEsR0FBRyxvQkFBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RCxPQUFJLGFBQWEsRUFBRTs7QUFFbEIsUUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxJQUFJLEVBQUU7QUFDdkMsYUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxTQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsS0FBSztNQUFBLENBQUMsQ0FBQztBQUN0RCxTQUFJLEVBQUUsRUFBRTtBQUNQLGFBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO01BQ3REO0tBQ0QsTUFBTTtBQUNOLFlBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO0tBQ2pFOztBQUVELFFBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkIseUJBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0lBQ0Q7R0FDRDs7QUFFRCxNQUFJLEtBQUssRUFBRTtBQUNWLFVBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUM7O0FBRXRFLHVCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxNQUFJLE1BQU0sRUFBRTtBQUNYLFVBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUM7O0FBRXJFLHVCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFckMsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxzQkFBb0IsTUFBTSxDQUFDLElBQUksTUFBRztHQUN6QyxDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGVsZXRlLWJyYW5jaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuaW1wb3J0IERlbGV0ZUJyYW5jaERpYWxvZyBmcm9tIFwiLi4vZGlhbG9ncy9EZWxldGVCcmFuY2hEaWFsb2dcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRsYWJlbDogXCJEZWxldGUgQnJhbmNoLi4uXCIsXG5cdGRlc2NyaXB0aW9uOiBcIkRlbGV0ZSBhIGJyYW5jaFwiLFxuXHRhc3luYyBjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCBkaWFsb2cgPSBEZWxldGVCcmFuY2hEaWFsb2csIHRpdGxlID0gXCJEZWxldGUgQnJhbmNoXCIpIHtcblx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cblx0XHRsZXQgYnJhbmNoZXMgPSBhd2FpdCBnaXQuYnJhbmNoZXMocm9vdCk7XG5cdFx0Y29uc3QgW2JyYW5jaCwgbG9jYWwsIHJlbW90ZSwgZm9yY2VdID0gYXdhaXQgbmV3IGRpYWxvZyh7YnJhbmNoZXMsIHJvb3R9KS5hY3RpdmF0ZSgpO1xuXG5cdFx0aWYgKCFsb2NhbCAmJiAhcmVtb3RlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c3RhdHVzQmFyLnNob3coXCJEZWxldGluZyBCcmFuY2guLi5cIik7XG5cblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRpZiAoYnJhbmNoLnNlbGVjdGVkKSB7XG5cdFx0XHRjb25zdCBkZWZhdWx0QnJhbmNoID0gaGVscGVyLmdldERlZmF1bHRCcmFuY2goYnJhbmNoZXMpO1xuXHRcdFx0aWYgKGRlZmF1bHRCcmFuY2gpIHtcblx0XHRcdFx0Ly8gaWYgYnJhbmNoIGlzIGN1cnJlbnQgYnJhbmNoIHRoZW4gY2hlY2tvdXQgbWFzdGVyIGZpcnN0XG5cdFx0XHRcdGlmIChicmFuY2gubmFtZSA9PT0gZGVmYXVsdEJyYW5jaC5uYW1lKSB7XG5cdFx0XHRcdFx0YnJhbmNoZXMgPSBhd2FpdCBnaXQuYnJhbmNoZXMocm9vdCk7XG5cdFx0XHRcdFx0Y29uc3QgYnIgPSBicmFuY2hlcy5maW5kKGIgPT4gIWIuc2VsZWN0ZWQgJiYgYi5sb2NhbCk7XG5cdFx0XHRcdFx0aWYgKGJyKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmNoZWNrb3V0QnJhbmNoKHJvb3QsIGJyLm5hbWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGF3YWl0IGdpdC5jaGVja291dEJyYW5jaChyb290LCBkZWZhdWx0QnJhbmNoLm5hbWUpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXN1bHRzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAobG9jYWwpIHtcblx0XHRcdHJlc3VsdHMucHVzaChhd2FpdCBnaXQuZGVsZXRlQnJhbmNoKHJvb3QsIGJyYW5jaC5uYW1lLCBmYWxzZSwgZm9yY2UpKTtcblxuXHRcdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdH1cblxuXHRcdGlmIChyZW1vdGUpIHtcblx0XHRcdHJlc3VsdHMucHVzaChhd2FpdCBnaXQuZGVsZXRlQnJhbmNoKHJvb3QsIGJyYW5jaC5uYW1lLCB0cnVlLCBmb3JjZSkpO1xuXG5cdFx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0fVxuXG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdHMpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogYERlbGV0ZWQgYnJhbmNoICR7YnJhbmNoLm5hbWV9LmAsXG5cdFx0fTtcblx0fSxcbn07XG4iXX0=