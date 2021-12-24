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

var _dialogsMergeBranchDialog = require("../dialogs/MergeBranchDialog");

var _dialogsMergeBranchDialog2 = _interopRequireDefault(_dialogsMergeBranchDialog);

exports["default"] = {
	label: "Merge Branch...",
	description: "Merge a branch",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsMergeBranchDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Merge Branch" : arguments[5];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);

		var branches = yield git.branches(root, false);

		var _ref = yield new dialog({ branches: branches, root: root }).activate();

		var _ref2 = _slicedToArray(_ref, 5);

		var rootBranch = _ref2[0];
		var mergeBranch = _ref2[1];
		var rebase = _ref2[2];
		var deleteBranch = _ref2[3];
		var abort = _ref2[4];

		if (rootBranch.name === mergeBranch.name) {
			throw "Branches cannot be the same.";
		}

		statusBar.show("Merging Branch...");

		yield _helper2["default"].checkGitLock(root);

		var gitResults = [];
		if (!rootBranch.selected) {
			// if rootBranch is not current branch then checkout rootBranch first
			gitResults.push((yield git.checkoutBranch(root, rootBranch.name)));

			_helper2["default"].refreshAtom(root);
		}

		try {
			gitResults.push(rebase ? (yield git.rebase(root, mergeBranch.name)) : (yield git.merge(root, mergeBranch.name)));
		} catch (ex) {
			notifications.addGit(title, gitResults);
			if (abort) {
				yield git.abort(root, !rebase);
				throw "Merge aborted:\n\n" + ex;
			} else {
				throw ex;
			}
		} finally {
			_helper2["default"].refreshAtom(root);
		}

		if (deleteBranch) {
			gitResults.push((yield git.deleteBranch(root, mergeBranch.name)));

			_helper2["default"].refreshAtom(root);
		}

		notifications.addGit(title, gitResults);

		return {
			title: title,
			message: "Merged branch " + mergeBranch.name + " into " + rootBranch.name + "."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvbWVyZ2UtYnJhbmNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7OztzQkFDWixXQUFXOzs7OzZCQUNKLGtCQUFrQjs7Ozt3Q0FDZCw4QkFBOEI7Ozs7cUJBRTdDO0FBQ2QsTUFBSyxFQUFFLGlCQUFpQjtBQUN4QixZQUFXLEVBQUUsZ0JBQWdCO0FBQzdCLEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQW1HO01BQWpHLEdBQUc7TUFBVyxhQUFhO01BQWtCLE1BQU07TUFBc0IsS0FBSyx5REFBRyxjQUFjOztBQUNsSSxNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7O2FBQ2MsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBUixRQUFRLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFOzs7O01BQXJHLFVBQVU7TUFBRSxXQUFXO01BQUUsTUFBTTtNQUFFLFlBQVk7TUFBRSxLQUFLOztBQUUzRCxNQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRTtBQUN6QyxTQUFNLDhCQUE4QixDQUFDO0dBQ3JDOztBQUVELFdBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFcEMsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTs7QUFFekIsYUFBVSxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7O0FBRWpFLHVCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxNQUFJO0FBQ0gsYUFBVSxDQUFDLElBQUksQ0FDZCxNQUFNLElBQ0gsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUEsSUFDeEMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FDMUMsQ0FBQztHQUNGLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDWixnQkFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEMsT0FBSSxLQUFLLEVBQUU7QUFDVixVQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0IsaUNBQTJCLEVBQUUsQ0FBRztJQUNoQyxNQUFNO0FBQ04sVUFBTSxFQUFFLENBQUM7SUFDVDtHQUNELFNBQVM7QUFDVCx1QkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDekI7O0FBR0QsTUFBSSxZQUFZLEVBQUU7QUFDakIsYUFBVSxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7O0FBRWhFLHVCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFeEMsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxxQkFBbUIsV0FBVyxDQUFDLElBQUksY0FBUyxVQUFVLENBQUMsSUFBSSxNQUFHO0dBQ3JFLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9tZXJnZS1icmFuY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCBNZXJnZUJyYW5jaERpYWxvZyBmcm9tIFwiLi4vZGlhbG9ncy9NZXJnZUJyYW5jaERpYWxvZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIk1lcmdlIEJyYW5jaC4uLlwiLFxuXHRkZXNjcmlwdGlvbjogXCJNZXJnZSBhIGJyYW5jaFwiLFxuXHRhc3luYyBjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCBkaWFsb2cgPSBNZXJnZUJyYW5jaERpYWxvZywgdGl0bGUgPSBcIk1lcmdlIEJyYW5jaFwiKSB7XG5cdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGhlbHBlci5nZXRSb290KGZpbGVQYXRocywgZ2l0KTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXG5cdFx0Y29uc3QgYnJhbmNoZXMgPSBhd2FpdCBnaXQuYnJhbmNoZXMocm9vdCwgZmFsc2UpO1xuXHRcdGNvbnN0IFtyb290QnJhbmNoLCBtZXJnZUJyYW5jaCwgcmViYXNlLCBkZWxldGVCcmFuY2gsIGFib3J0XSA9IGF3YWl0IG5ldyBkaWFsb2coe2JyYW5jaGVzLCByb290fSkuYWN0aXZhdGUoKTtcblxuXHRcdGlmIChyb290QnJhbmNoLm5hbWUgPT09IG1lcmdlQnJhbmNoLm5hbWUpIHtcblx0XHRcdHRocm93IFwiQnJhbmNoZXMgY2Fubm90IGJlIHRoZSBzYW1lLlwiO1xuXHRcdH1cblxuXHRcdHN0YXR1c0Jhci5zaG93KFwiTWVyZ2luZyBCcmFuY2guLi5cIik7XG5cblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXG5cdFx0Y29uc3QgZ2l0UmVzdWx0cyA9IFtdO1xuXHRcdGlmICghcm9vdEJyYW5jaC5zZWxlY3RlZCkge1xuXHRcdFx0Ly8gaWYgcm9vdEJyYW5jaCBpcyBub3QgY3VycmVudCBicmFuY2ggdGhlbiBjaGVja291dCByb290QnJhbmNoIGZpcnN0XG5cdFx0XHRnaXRSZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmNoZWNrb3V0QnJhbmNoKHJvb3QsIHJvb3RCcmFuY2gubmFtZSkpO1xuXG5cdFx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGdpdFJlc3VsdHMucHVzaChcblx0XHRcdFx0cmViYXNlXG5cdFx0XHRcdFx0PyBhd2FpdCBnaXQucmViYXNlKHJvb3QsIG1lcmdlQnJhbmNoLm5hbWUpXG5cdFx0XHRcdFx0OiBhd2FpdCBnaXQubWVyZ2Uocm9vdCwgbWVyZ2VCcmFuY2gubmFtZSksXG5cdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgZ2l0UmVzdWx0cyk7XG5cdFx0XHRpZiAoYWJvcnQpIHtcblx0XHRcdFx0YXdhaXQgZ2l0LmFib3J0KHJvb3QsICFyZWJhc2UpO1xuXHRcdFx0XHR0aHJvdyBgTWVyZ2UgYWJvcnRlZDpcXG5cXG4ke2V4fWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBleDtcblx0XHRcdH1cblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdH1cblxuXG5cdFx0aWYgKGRlbGV0ZUJyYW5jaCkge1xuXHRcdFx0Z2l0UmVzdWx0cy5wdXNoKGF3YWl0IGdpdC5kZWxldGVCcmFuY2gocm9vdCwgbWVyZ2VCcmFuY2gubmFtZSkpO1xuXG5cdFx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0fVxuXG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIGdpdFJlc3VsdHMpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogYE1lcmdlZCBicmFuY2ggJHttZXJnZUJyYW5jaC5uYW1lfSBpbnRvICR7cm9vdEJyYW5jaC5uYW1lfS5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19