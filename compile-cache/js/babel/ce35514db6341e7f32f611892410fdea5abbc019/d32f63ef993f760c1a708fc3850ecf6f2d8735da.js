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

var _sync = require("./sync");

var _push = require("./push");

var _dialogsCommitDialog = require("../dialogs/CommitDialog");

var _dialogsCommitDialog2 = _interopRequireDefault(_dialogsCommitDialog);

exports["default"] = {
	label: "Commit Staged...",
	description: "Commit staged files",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsCommitDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Commit Staged" : arguments[5];

		var _ref = yield _helper2["default"].getRootAndFilesStatuses(atom.project.getPaths(), git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		var stagedFiles = files.filter(function (f) {
			return f.added;
		});
		if (stagedFiles.length === 0) {
			throw "No Changes Staged";
		}
		yield _helper2["default"].checkGitLock(root);
		var treeView = atom.config.get("git-menu.treeView");
		var lastCommit = yield git.lastCommit(root);

		var _ref3 = yield new dialog({ files: stagedFiles, lastCommit: lastCommit, filesSelectable: false, treeView: treeView }).activate();

		var _ref32 = _slicedToArray(_ref3, 4);

		var message = _ref32[0];
		var amend = _ref32[1];
		var shouldPush = _ref32[2];
		var shouldSync = _ref32[3];

		if (!message) {
			throw "Message cannot be blank.";
		}

		// commit files
		statusBar.show("Committing...");
		var numFiles = stagedFiles.length + " File" + (stagedFiles.length !== 1 ? "s" : "");
		yield _helper2["default"].checkGitLock(root);
		var results = yield git.commit(root, message, amend, null);
		localStorage.removeItem("git-menu.commit-message");
		notifications.addGit(title, results);
		_helper2["default"].refreshAtom(root);
		var success = { title: title, message: numFiles + " committed." };
		if (shouldSync) {
			yield (0, _sync.command)([root], statusBar, git, notifications);
			success.message = numFiles + " committed & synced.";
		} else if (shouldPush) {
			yield (0, _push.command)([root], statusBar, git, notifications);
			success.message = numFiles + " committed & pushed.";
		}
		return success;
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY29tbWl0LXN0YWdlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7b0JBRWQsUUFBUTs7b0JBQ1IsUUFBUTs7bUNBQ2IseUJBQXlCOzs7O3FCQUVuQztBQUNkLE1BQUssRUFBRSxrQkFBa0I7QUFDekIsWUFBVyxFQUFFLHFCQUFxQjtBQUNsQyxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUErRjtNQUE3RixHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQWlCLEtBQUsseURBQUcsZUFBZTs7YUFDeEcsTUFBTSxvQkFBTyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsQ0FBQzs7OztNQUFqRixLQUFLO01BQUUsSUFBSTs7QUFDbEIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7VUFBSSxDQUFDLENBQUMsS0FBSztHQUFBLENBQUMsQ0FBQztBQUMvQyxNQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFNBQU0sbUJBQW1CLENBQUM7R0FDMUI7QUFDRCxRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Y0FNMUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTs7OztNQUpsRyxPQUFPO01BQ1AsS0FBSztNQUNMLFVBQVU7TUFDVixVQUFVOztBQUdYLE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDYixTQUFNLDBCQUEwQixDQUFDO0dBQ2pDOzs7QUFHRCxXQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sUUFBUSxHQUFNLFdBQVcsQ0FBQyxNQUFNLGNBQVEsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUM7QUFDcEYsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdELGNBQVksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuRCxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUwsS0FBSyxFQUFFLE9BQU8sRUFBSyxRQUFRLGdCQUFhLEVBQUMsQ0FBQztBQUMzRCxNQUFJLFVBQVUsRUFBRTtBQUNmLFNBQU0sbUJBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELFVBQU8sQ0FBQyxPQUFPLEdBQU0sUUFBUSx5QkFBc0IsQ0FBQztHQUNwRCxNQUFNLElBQUksVUFBVSxFQUFFO0FBQ3RCLFNBQU0sbUJBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELFVBQU8sQ0FBQyxPQUFPLEdBQU0sUUFBUSx5QkFBc0IsQ0FBQztHQUNwRDtBQUNELFNBQU8sT0FBTyxDQUFDO0VBQ2YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY29tbWl0LXN0YWdlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5pbXBvcnQge2NvbW1hbmQgYXMgc3luY30gZnJvbSBcIi4vc3luY1wiO1xuaW1wb3J0IHtjb21tYW5kIGFzIHB1c2h9IGZyb20gXCIuL3B1c2hcIjtcbmltcG9ydCBDb21taXREaWFsb2cgZnJvbSBcIi4uL2RpYWxvZ3MvQ29tbWl0RGlhbG9nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiQ29tbWl0IFN0YWdlZC4uLlwiLFxuXHRkZXNjcmlwdGlvbjogXCJDb21taXQgc3RhZ2VkIGZpbGVzXCIsXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIGRpYWxvZyA9IENvbW1pdERpYWxvZywgdGl0bGUgPSBcIkNvbW1pdCBTdGFnZWRcIikge1xuXHRcdGNvbnN0IFtmaWxlcywgcm9vdF0gPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdEFuZEZpbGVzU3RhdHVzZXMoYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIGdpdCk7XG5cdFx0Y29uc3Qgc3RhZ2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoZiA9PiBmLmFkZGVkKTtcblx0XHRpZiAoc3RhZ2VkRmlsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHR0aHJvdyBcIk5vIENoYW5nZXMgU3RhZ2VkXCI7XG5cdFx0fVxuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cdFx0Y29uc3QgdHJlZVZpZXcgPSBhdG9tLmNvbmZpZy5nZXQoXCJnaXQtbWVudS50cmVlVmlld1wiKTtcblx0XHRjb25zdCBsYXN0Q29tbWl0ID0gYXdhaXQgZ2l0Lmxhc3RDb21taXQocm9vdCk7XG5cdFx0Y29uc3QgW1xuXHRcdFx0bWVzc2FnZSxcblx0XHRcdGFtZW5kLFxuXHRcdFx0c2hvdWxkUHVzaCxcblx0XHRcdHNob3VsZFN5bmMsXG5cdFx0XSA9IGF3YWl0IG5ldyBkaWFsb2coe2ZpbGVzOiBzdGFnZWRGaWxlcywgbGFzdENvbW1pdCwgZmlsZXNTZWxlY3RhYmxlOiBmYWxzZSwgdHJlZVZpZXd9KS5hY3RpdmF0ZSgpO1xuXG5cdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHR0aHJvdyBcIk1lc3NhZ2UgY2Fubm90IGJlIGJsYW5rLlwiO1xuXHRcdH1cblxuXHRcdC8vIGNvbW1pdCBmaWxlc1xuXHRcdHN0YXR1c0Jhci5zaG93KFwiQ29tbWl0dGluZy4uLlwiKTtcblx0XHRjb25zdCBudW1GaWxlcyA9IGAke3N0YWdlZEZpbGVzLmxlbmd0aH0gRmlsZSR7c3RhZ2VkRmlsZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWA7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblx0XHRjb25zdCByZXN1bHRzID0gYXdhaXQgZ2l0LmNvbW1pdChyb290LCBtZXNzYWdlLCBhbWVuZCwgbnVsbCk7XG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJnaXQtbWVudS5jb21taXQtbWVzc2FnZVwiKTtcblx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgcmVzdWx0cyk7XG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdGNvbnN0IHN1Y2Nlc3MgPSB7dGl0bGUsIG1lc3NhZ2U6IGAke251bUZpbGVzfSBjb21taXR0ZWQuYH07XG5cdFx0aWYgKHNob3VsZFN5bmMpIHtcblx0XHRcdGF3YWl0IHN5bmMoW3Jvb3RdLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucyk7XG5cdFx0XHRzdWNjZXNzLm1lc3NhZ2UgPSBgJHtudW1GaWxlc30gY29tbWl0dGVkICYgc3luY2VkLmA7XG5cdFx0fSBlbHNlIGlmIChzaG91bGRQdXNoKSB7XG5cdFx0XHRhd2FpdCBwdXNoKFtyb290XSwgc3RhdHVzQmFyLCBnaXQsIG5vdGlmaWNhdGlvbnMpO1xuXHRcdFx0c3VjY2Vzcy5tZXNzYWdlID0gYCR7bnVtRmlsZXN9IGNvbW1pdHRlZCAmIHB1c2hlZC5gO1xuXHRcdH1cblx0XHRyZXR1cm4gc3VjY2Vzcztcblx0fSxcbn07XG4iXX0=