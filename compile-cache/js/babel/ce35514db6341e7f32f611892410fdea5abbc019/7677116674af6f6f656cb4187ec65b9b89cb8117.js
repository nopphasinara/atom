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
	label: "Commit...",
	description: "Commit selected files",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsCommitDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Commit" : arguments[5];

		var _ref = yield _helper2["default"].getRootAndFilesStatuses(filePaths, git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		yield _helper2["default"].checkGitLock(root);
		var treeView = atom.config.get("git-menu.treeView");
		var lastCommit = yield git.lastCommit(root);

		var _ref3 = yield new dialog({ files: files, lastCommit: lastCommit, treeView: treeView }).activate();

		var _ref32 = _slicedToArray(_ref3, 5);

		var message = _ref32[0];
		var amend = _ref32[1];
		var shouldPush = _ref32[2];
		var shouldSync = _ref32[3];
		var selectedFiles = _ref32[4];

		if (!message) {
			throw "Message cannot be blank.";
		}

		// commit files
		statusBar.show("Committing...");
		var changedFiles = (yield _helper2["default"].getStatuses([root], git)).map(function (status) {
			return status.file;
		});
		var reducedFiles = _helper2["default"].reduceFilesToCommonFolders(selectedFiles, changedFiles);
		var numFiles = selectedFiles.length + " File" + (selectedFiles.length !== 1 ? "s" : "");
		yield _helper2["default"].checkGitLock(root);
		var results = [];
		results.push((yield git.unstage(root)));
		results.push((yield git.add(root, reducedFiles)));
		results.push((yield git.commit(root, message, amend, null)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY29tbWl0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7OztzQkFDWixXQUFXOzs7OzZCQUNKLGtCQUFrQjs7OztvQkFFZCxRQUFROztvQkFDUixRQUFROzttQ0FDYix5QkFBeUI7Ozs7cUJBRW5DO0FBQ2QsTUFBSyxFQUFFLFdBQVc7QUFDbEIsWUFBVyxFQUFFLHVCQUF1QjtBQUNwQyxBQUFNLFFBQU8sb0JBQUEsV0FBQyxTQUFTLEVBQUUsU0FBUyxFQUF3RjtNQUF0RixHQUFHO01BQVcsYUFBYTtNQUFrQixNQUFNO01BQWlCLEtBQUsseURBQUcsUUFBUTs7YUFDakcsTUFBTSxvQkFBTyx1QkFBdUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDOzs7O01BQW5FLEtBQUs7TUFBRSxJQUFJOztBQUNsQixRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Y0FPMUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Ozs7TUFMN0QsT0FBTztNQUNQLEtBQUs7TUFDTCxVQUFVO01BQ1YsVUFBVTtNQUNWLGFBQWE7O0FBR2QsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNiLFNBQU0sMEJBQTBCLENBQUM7R0FDakM7OztBQUdELFdBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLG9CQUFPLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBLENBQUUsR0FBRyxDQUFDLFVBQUEsTUFBTTtVQUFJLE1BQU0sQ0FBQyxJQUFJO0dBQUEsQ0FBQyxDQUFDO0FBQ3hGLE1BQU0sWUFBWSxHQUFHLG9CQUFPLDBCQUEwQixDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwRixNQUFNLFFBQVEsR0FBTSxhQUFhLENBQUMsTUFBTSxjQUFRLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsQUFBRSxDQUFDO0FBQ3hGLFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNuQixTQUFPLENBQUMsSUFBSSxFQUFDLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDdEMsU0FBTyxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNoRCxTQUFPLENBQUMsSUFBSSxFQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDM0QsY0FBWSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ25ELGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLE9BQU8sR0FBRyxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFLLFFBQVEsZ0JBQWEsRUFBQyxDQUFDO0FBQzNELE1BQUksVUFBVSxFQUFFO0FBQ2YsU0FBTSxtQkFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbEQsVUFBTyxDQUFDLE9BQU8sR0FBTSxRQUFRLHlCQUFzQixDQUFDO0dBQ3BELE1BQU0sSUFBSSxVQUFVLEVBQUU7QUFDdEIsU0FBTSxtQkFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbEQsVUFBTyxDQUFDLE9BQU8sR0FBTSxRQUFRLHlCQUFzQixDQUFDO0dBQ3BEO0FBQ0QsU0FBTyxPQUFPLENBQUM7RUFDZixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9jb21taXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcblxuaW1wb3J0IHtjb21tYW5kIGFzIHN5bmN9IGZyb20gXCIuL3N5bmNcIjtcbmltcG9ydCB7Y29tbWFuZCBhcyBwdXNofSBmcm9tIFwiLi9wdXNoXCI7XG5pbXBvcnQgQ29tbWl0RGlhbG9nIGZyb20gXCIuLi9kaWFsb2dzL0NvbW1pdERpYWxvZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIkNvbW1pdC4uLlwiLFxuXHRkZXNjcmlwdGlvbjogXCJDb21taXQgc2VsZWN0ZWQgZmlsZXNcIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgZGlhbG9nID0gQ29tbWl0RGlhbG9nLCB0aXRsZSA9IFwiQ29tbWl0XCIpIHtcblx0XHRjb25zdCBbZmlsZXMsIHJvb3RdID0gYXdhaXQgaGVscGVyLmdldFJvb3RBbmRGaWxlc1N0YXR1c2VzKGZpbGVQYXRocywgZ2l0KTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IHRyZWVWaWV3ID0gYXRvbS5jb25maWcuZ2V0KFwiZ2l0LW1lbnUudHJlZVZpZXdcIik7XG5cdFx0Y29uc3QgbGFzdENvbW1pdCA9IGF3YWl0IGdpdC5sYXN0Q29tbWl0KHJvb3QpO1xuXHRcdGNvbnN0IFtcblx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRhbWVuZCxcblx0XHRcdHNob3VsZFB1c2gsXG5cdFx0XHRzaG91bGRTeW5jLFxuXHRcdFx0c2VsZWN0ZWRGaWxlcyxcblx0XHRdID0gYXdhaXQgbmV3IGRpYWxvZyh7ZmlsZXMsIGxhc3RDb21taXQsIHRyZWVWaWV3fSkuYWN0aXZhdGUoKTtcblxuXHRcdGlmICghbWVzc2FnZSkge1xuXHRcdFx0dGhyb3cgXCJNZXNzYWdlIGNhbm5vdCBiZSBibGFuay5cIjtcblx0XHR9XG5cblx0XHQvLyBjb21taXQgZmlsZXNcblx0XHRzdGF0dXNCYXIuc2hvdyhcIkNvbW1pdHRpbmcuLi5cIik7XG5cdFx0Y29uc3QgY2hhbmdlZEZpbGVzID0gKGF3YWl0IGhlbHBlci5nZXRTdGF0dXNlcyhbcm9vdF0sIGdpdCkpLm1hcChzdGF0dXMgPT4gc3RhdHVzLmZpbGUpO1xuXHRcdGNvbnN0IHJlZHVjZWRGaWxlcyA9IGhlbHBlci5yZWR1Y2VGaWxlc1RvQ29tbW9uRm9sZGVycyhzZWxlY3RlZEZpbGVzLCBjaGFuZ2VkRmlsZXMpO1xuXHRcdGNvbnN0IG51bUZpbGVzID0gYCR7c2VsZWN0ZWRGaWxlcy5sZW5ndGh9IEZpbGUke3NlbGVjdGVkRmlsZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWA7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblx0XHRjb25zdCByZXN1bHRzID0gW107XG5cdFx0cmVzdWx0cy5wdXNoKGF3YWl0IGdpdC51bnN0YWdlKHJvb3QpKTtcblx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmFkZChyb290LCByZWR1Y2VkRmlsZXMpKTtcblx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmNvbW1pdChyb290LCBtZXNzYWdlLCBhbWVuZCwgbnVsbCkpO1xuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZ2l0LW1lbnUuY29tbWl0LW1lc3NhZ2VcIik7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdHMpO1xuXHRcdGhlbHBlci5yZWZyZXNoQXRvbShyb290KTtcblx0XHRjb25zdCBzdWNjZXNzID0ge3RpdGxlLCBtZXNzYWdlOiBgJHtudW1GaWxlc30gY29tbWl0dGVkLmB9O1xuXHRcdGlmIChzaG91bGRTeW5jKSB7XG5cdFx0XHRhd2FpdCBzeW5jKFtyb290XSwgc3RhdHVzQmFyLCBnaXQsIG5vdGlmaWNhdGlvbnMpO1xuXHRcdFx0c3VjY2Vzcy5tZXNzYWdlID0gYCR7bnVtRmlsZXN9IGNvbW1pdHRlZCAmIHN5bmNlZC5gO1xuXHRcdH0gZWxzZSBpZiAoc2hvdWxkUHVzaCkge1xuXHRcdFx0YXdhaXQgcHVzaChbcm9vdF0sIHN0YXR1c0JhciwgZ2l0LCBub3RpZmljYXRpb25zKTtcblx0XHRcdHN1Y2Nlc3MubWVzc2FnZSA9IGAke251bUZpbGVzfSBjb21taXR0ZWQgJiBwdXNoZWQuYDtcblx0XHR9XG5cdFx0cmV0dXJuIHN1Y2Nlc3M7XG5cdH0sXG59O1xuIl19