Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

exports["default"] = {
	label: "Undo Last Commit",
	description: "Undo the last commit and save the current changes",
	confirm: {
		message: "Are you sure you want to undo the last commit?",
		detail: _asyncToGenerator(function* (filePaths) {
			var git = arguments.length <= 1 || arguments[1] === undefined ? _gitCmd2["default"] : arguments[1];

			var root = yield _helper2["default"].getRoot(filePaths, git);
			var lastCommit = yield git.lastCommit(root);
			return "You are undoing the commit:\n" + lastCommit;
		})
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Undo Last Commit" : arguments[4];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);
		statusBar.show("Resetting...");
		try {
			var count = yield git.countCommits(root);
			var result = undefined;
			if (count > 1) {
				result = yield git.reset(root, false, 1);
			} else {
				yield git.remove(root);
				result = yield git.init(root);
			}
			notifications.addGit(title, result);
			_helper2["default"].refreshAtom(root);
			return {
				title: title,
				message: "Last commit is reset."
			};
		} catch (error) {
			if (!error) {
				throw "Unknown Error.";
			} else if (error.includes("ambiguous argument")) {
				throw "No commits.";
			}
			throw error;
		}
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvdW5kby1sYXN0LWNvbW1pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7NkJBQ0osa0JBQWtCOzs7O3FCQUU3QjtBQUNkLE1BQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBVyxFQUFFLG1EQUFtRDtBQUNoRSxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsZ0RBQWdEO0FBQ3pELFFBQU0sb0JBQUUsV0FBTyxTQUFTLEVBQW1CO09BQWpCLEdBQUc7O0FBQzVCLE9BQU0sSUFBSSxHQUFHLE1BQU0sb0JBQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRCxPQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsNENBQXVDLFVBQVUsQ0FBRztHQUNwRCxDQUFBO0VBQ0Q7QUFDRCxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUEyRTtNQUF6RSxHQUFHO01BQVcsYUFBYTtNQUFrQixLQUFLLHlEQUFHLGtCQUFrQjs7QUFDMUcsTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFdBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDL0IsTUFBSTtBQUNILE9BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxPQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsT0FBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ2QsVUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLE1BQU07QUFDTixVQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsVUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QjtBQUNELGdCQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwQyx1QkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsVUFBTztBQUNOLFNBQUssRUFBTCxLQUFLO0FBQ0wsV0FBTyxFQUFFLHVCQUF1QjtJQUNoQyxDQUFDO0dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNmLE9BQUksQ0FBQyxLQUFLLEVBQUU7QUFDWCxVQUFNLGdCQUFnQixDQUFDO0lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDaEQsVUFBTSxhQUFhLENBQUM7SUFDcEI7QUFDRCxTQUFNLEtBQUssQ0FBQztHQUNaO0VBQ0QsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvdW5kby1sYXN0LWNvbW1pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlVuZG8gTGFzdCBDb21taXRcIixcblx0ZGVzY3JpcHRpb246IFwiVW5kbyB0aGUgbGFzdCBjb21taXQgYW5kIHNhdmUgdGhlIGN1cnJlbnQgY2hhbmdlc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gdW5kbyB0aGUgbGFzdCBjb21taXQ/XCIsXG5cdFx0ZGV0YWlsOiBhc3luYyAoZmlsZVBhdGhzLCBnaXQgPSBnaXRDbWQpID0+IHtcblx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdChmaWxlUGF0aHMsIGdpdCk7XG5cdFx0XHRjb25zdCBsYXN0Q29tbWl0ID0gYXdhaXQgZ2l0Lmxhc3RDb21taXQocm9vdCk7XG5cdFx0XHRyZXR1cm4gYFlvdSBhcmUgdW5kb2luZyB0aGUgY29tbWl0OlxcbiR7bGFzdENvbW1pdH1gO1xuXHRcdH0sXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJVbmRvIExhc3QgQ29tbWl0XCIpIHtcblx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cdFx0c3RhdHVzQmFyLnNob3coXCJSZXNldHRpbmcuLi5cIik7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvdW50ID0gYXdhaXQgZ2l0LmNvdW50Q29tbWl0cyhyb290KTtcblx0XHRcdGxldCByZXN1bHQ7XG5cdFx0XHRpZiAoY291bnQgPiAxKSB7XG5cdFx0XHRcdHJlc3VsdCA9IGF3YWl0IGdpdC5yZXNldChyb290LCBmYWxzZSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhd2FpdCBnaXQucmVtb3ZlKHJvb3QpO1xuXHRcdFx0XHRyZXN1bHQgPSBhd2FpdCBnaXQuaW5pdChyb290KTtcblx0XHRcdH1cblx0XHRcdG5vdGlmaWNhdGlvbnMuYWRkR2l0KHRpdGxlLCByZXN1bHQpO1xuXHRcdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiTGFzdCBjb21taXQgaXMgcmVzZXQuXCIsXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoIWVycm9yKSB7XG5cdFx0XHRcdHRocm93IFwiVW5rbm93biBFcnJvci5cIjtcblx0XHRcdH0gZWxzZSBpZiAoZXJyb3IuaW5jbHVkZXMoXCJhbWJpZ3VvdXMgYXJndW1lbnRcIikpIHtcblx0XHRcdFx0dGhyb3cgXCJObyBjb21taXRzLlwiO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9LFxufTtcbiJdfQ==