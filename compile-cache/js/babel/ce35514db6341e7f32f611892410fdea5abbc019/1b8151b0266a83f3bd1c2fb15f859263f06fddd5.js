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

exports["default"] = {
	label: "Discard Changes",
	description: "Discard file changes",
	confirm: {
		message: "Are you sure you want to discard all uncommitted changes to these files?",
		detail: function detail(filePaths) {
			return "You are discarding changes to:\n" + filePaths.join("\n");
		}
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Discard Changes" : arguments[4];

		var _ref = yield _helper2["default"].getRootAndFilesStatuses(filePaths, git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		yield _helper2["default"].checkGitLock(root);

		var results = [];
		results.push((yield git.unstage(root)));

		var _files$reduce = files.reduce(function (prev, file) {
			if (file.untracked) {
				prev.untrackedFiles.push(file.file);
			} else {
				prev.trackedFiles.push(file.file);
			}
			return prev;
		}, { untrackedFiles: [], trackedFiles: [] });

		var untrackedFiles = _files$reduce.untrackedFiles;
		var trackedFiles = _files$reduce.trackedFiles;

		var allFiles = (yield _helper2["default"].getStatuses([root], git)).reduce(function (prev, file) {
			if (file.untracked) {
				prev.untracked.push(file.file);
			} else {
				prev.tracked.push(file.file);
			}
			return prev;
		}, { untracked: [], tracked: [] });

		var hasUntrackedFiles = untrackedFiles.length > 0 && allFiles.untracked.length > 0;
		var hasTrackedFiles = trackedFiles.length > 0 && allFiles.tracked.length > 0;

		untrackedFiles = _helper2["default"].reduceFilesToCommonFolders(untrackedFiles, allFiles.untracked);
		trackedFiles = _helper2["default"].reduceFilesToCommonFolders(trackedFiles, allFiles.tracked);

		statusBar.show("Discarding...");

		// discard files
		results = results.concat((yield Promise.all([hasUntrackedFiles ? git.clean(root, untrackedFiles) : "", hasTrackedFiles ? git.checkoutFiles(root, trackedFiles) : ""])));
		notifications.addGit(title, results);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: files.length + " File" + (files.length !== 1 ? "s" : "") + " Discarded."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGlzY2FyZC1jaGFuZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7OztzQkFDWixXQUFXOzs7OzZCQUNKLGtCQUFrQjs7OztxQkFFN0I7QUFDZCxNQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLFlBQVcsRUFBRSxzQkFBc0I7QUFDbkMsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLDBFQUEwRTtBQUNuRixRQUFNLEVBQUUsZ0JBQUEsU0FBUzsrQ0FBdUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7R0FBRTtFQUM5RTtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQTBFO01BQXhFLEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsaUJBQWlCOzthQUNuRixNQUFNLG9CQUFPLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7Ozs7TUFBbkUsS0FBSztNQUFFLElBQUk7O0FBQ2xCLFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxNQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsU0FBTyxDQUFDLElBQUksRUFBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDOztzQkFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUNqRSxPQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbkIsUUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE1BQU07QUFDTixRQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEM7QUFDRCxVQUFPLElBQUksQ0FBQztHQUNaLEVBQUUsRUFBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQzs7TUFQckMsY0FBYyxpQkFBZCxjQUFjO01BQUUsWUFBWSxpQkFBWixZQUFZOztBQVNqQyxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sb0JBQU8sV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUEsQ0FBRSxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQy9FLE9BQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNuQixRQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsTUFBTTtBQUNOLFFBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QjtBQUNELFVBQU8sSUFBSSxDQUFDO0dBQ1osRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7O0FBRWpDLE1BQU0saUJBQWlCLEdBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxBQUFDLENBQUM7QUFDdkYsTUFBTSxlQUFlLEdBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxBQUFDLENBQUM7O0FBRWpGLGdCQUFjLEdBQUcsb0JBQU8sMEJBQTBCLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2RixjQUFZLEdBQUcsb0JBQU8sMEJBQTBCLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFakYsV0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzs7O0FBR2hDLFNBQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUN6QyxpQkFBaUIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsR0FBRyxFQUFFLEVBQ3hELGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsR0FBRyxFQUFFLENBQzdELENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDSixlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxFQUFLLEtBQUssQ0FBQyxNQUFNLGNBQVEsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxnQkFBYTtHQUMxRSxDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGlzY2FyZC1jaGFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiRGlzY2FyZCBDaGFuZ2VzXCIsXG5cdGRlc2NyaXB0aW9uOiBcIkRpc2NhcmQgZmlsZSBjaGFuZ2VzXCIsXG5cdGNvbmZpcm06IHtcblx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkaXNjYXJkIGFsbCB1bmNvbW1pdHRlZCBjaGFuZ2VzIHRvIHRoZXNlIGZpbGVzP1wiLFxuXHRcdGRldGFpbDogZmlsZVBhdGhzID0+IGBZb3UgYXJlIGRpc2NhcmRpbmcgY2hhbmdlcyB0bzpcXG4ke2ZpbGVQYXRocy5qb2luKFwiXFxuXCIpfWAsXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJEaXNjYXJkIENoYW5nZXNcIikge1xuXHRcdGNvbnN0IFtmaWxlcywgcm9vdF0gPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdEFuZEZpbGVzU3RhdHVzZXMoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cblx0XHRsZXQgcmVzdWx0cyA9IFtdO1xuXHRcdHJlc3VsdHMucHVzaChhd2FpdCBnaXQudW5zdGFnZShyb290KSk7XG5cblx0XHRsZXQge3VudHJhY2tlZEZpbGVzLCB0cmFja2VkRmlsZXN9ID0gZmlsZXMucmVkdWNlKChwcmV2LCBmaWxlKSA9PiB7XG5cdFx0XHRpZiAoZmlsZS51bnRyYWNrZWQpIHtcblx0XHRcdFx0cHJldi51bnRyYWNrZWRGaWxlcy5wdXNoKGZpbGUuZmlsZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmV2LnRyYWNrZWRGaWxlcy5wdXNoKGZpbGUuZmlsZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCB7dW50cmFja2VkRmlsZXM6IFtdLCB0cmFja2VkRmlsZXM6IFtdfSk7XG5cblx0XHRjb25zdCBhbGxGaWxlcyA9IChhd2FpdCBoZWxwZXIuZ2V0U3RhdHVzZXMoW3Jvb3RdLCBnaXQpKS5yZWR1Y2UoKHByZXYsIGZpbGUpID0+IHtcblx0XHRcdGlmIChmaWxlLnVudHJhY2tlZCkge1xuXHRcdFx0XHRwcmV2LnVudHJhY2tlZC5wdXNoKGZpbGUuZmlsZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmV2LnRyYWNrZWQucHVzaChmaWxlLmZpbGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByZXY7XG5cdFx0fSwge3VudHJhY2tlZDogW10sIHRyYWNrZWQ6IFtdfSk7XG5cblx0XHRjb25zdCBoYXNVbnRyYWNrZWRGaWxlcyA9ICh1bnRyYWNrZWRGaWxlcy5sZW5ndGggPiAwICYmIGFsbEZpbGVzLnVudHJhY2tlZC5sZW5ndGggPiAwKTtcblx0XHRjb25zdCBoYXNUcmFja2VkRmlsZXMgPSAodHJhY2tlZEZpbGVzLmxlbmd0aCA+IDAgJiYgYWxsRmlsZXMudHJhY2tlZC5sZW5ndGggPiAwKTtcblxuXHRcdHVudHJhY2tlZEZpbGVzID0gaGVscGVyLnJlZHVjZUZpbGVzVG9Db21tb25Gb2xkZXJzKHVudHJhY2tlZEZpbGVzLCBhbGxGaWxlcy51bnRyYWNrZWQpO1xuXHRcdHRyYWNrZWRGaWxlcyA9IGhlbHBlci5yZWR1Y2VGaWxlc1RvQ29tbW9uRm9sZGVycyh0cmFja2VkRmlsZXMsIGFsbEZpbGVzLnRyYWNrZWQpO1xuXG5cdFx0c3RhdHVzQmFyLnNob3coXCJEaXNjYXJkaW5nLi4uXCIpO1xuXG5cdFx0Ly8gZGlzY2FyZCBmaWxlc1xuXHRcdHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChhd2FpdCBQcm9taXNlLmFsbChbXG5cdFx0XHQoaGFzVW50cmFja2VkRmlsZXMgPyBnaXQuY2xlYW4ocm9vdCwgdW50cmFja2VkRmlsZXMpIDogXCJcIiksXG5cdFx0XHQoaGFzVHJhY2tlZEZpbGVzID8gZ2l0LmNoZWNrb3V0RmlsZXMocm9vdCwgdHJhY2tlZEZpbGVzKSA6IFwiXCIpLFxuXHRcdF0pKTtcblx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgcmVzdWx0cyk7XG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IGAke2ZpbGVzLmxlbmd0aH0gRmlsZSR7ZmlsZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifSBEaXNjYXJkZWQuYCxcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==