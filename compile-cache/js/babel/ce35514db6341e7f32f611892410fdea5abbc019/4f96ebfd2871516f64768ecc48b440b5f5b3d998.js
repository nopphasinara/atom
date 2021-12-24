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
	label: "Stage Changes",
	description: "Stage the changes to commit later",
	confirm: {
		message: "Are you sure you want to stage these changes?",
		detail: function detail(filePaths) {
			return "You are staging these files:\n" + filePaths.join("\n");
		}
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Stage Changes" : arguments[4];

		var _ref = yield _helper2["default"].getRootAndFiles(filePaths, git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		yield _helper2["default"].checkGitLock(root);

		// commit files
		statusBar.show("Staging...");
		var numFiles = files.length + " File" + (files.length !== 1 ? "s" : "");
		var results = yield git.add(root, files);
		notifications.addGit(title, results);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: numFiles + " staged."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3RhZ2UtY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7Ozs2QkFDSixrQkFBa0I7Ozs7cUJBRTdCO0FBQ2QsTUFBSyxFQUFFLGVBQWU7QUFDdEIsWUFBVyxFQUFFLG1DQUFtQztBQUNoRCxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsK0NBQStDO0FBQ3hELFFBQU0sRUFBRSxnQkFBQyxTQUFTLEVBQUs7QUFDdEIsNkNBQXdDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUc7R0FDL0Q7RUFDRDtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQXdFO01BQXRFLEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsZUFBZTs7YUFDakYsTUFBTSxvQkFBTyxlQUFlLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQzs7OztNQUEzRCxLQUFLO01BQUUsSUFBSTs7QUFDbEIsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUdoQyxXQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sUUFBUSxHQUFNLEtBQUssQ0FBQyxNQUFNLGNBQVEsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUM7QUFDeEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzQyxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxFQUFLLFFBQVEsYUFBVTtHQUM5QixDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3RhZ2UtY2hhbmdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlN0YWdlIENoYW5nZXNcIixcblx0ZGVzY3JpcHRpb246IFwiU3RhZ2UgdGhlIGNoYW5nZXMgdG8gY29tbWl0IGxhdGVyXCIsXG5cdGNvbmZpcm06IHtcblx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBzdGFnZSB0aGVzZSBjaGFuZ2VzP1wiLFxuXHRcdGRldGFpbDogKGZpbGVQYXRocykgPT4ge1xuXHRcdFx0cmV0dXJuIGBZb3UgYXJlIHN0YWdpbmcgdGhlc2UgZmlsZXM6XFxuJHtmaWxlUGF0aHMuam9pbihcIlxcblwiKX1gO1xuXHRcdH0sXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJTdGFnZSBDaGFuZ2VzXCIpIHtcblx0XHRjb25zdCBbZmlsZXMsIHJvb3RdID0gYXdhaXQgaGVscGVyLmdldFJvb3RBbmRGaWxlcyhmaWxlUGF0aHMsIGdpdCk7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblxuXHRcdC8vIGNvbW1pdCBmaWxlc1xuXHRcdHN0YXR1c0Jhci5zaG93KFwiU3RhZ2luZy4uLlwiKTtcblx0XHRjb25zdCBudW1GaWxlcyA9IGAke2ZpbGVzLmxlbmd0aH0gRmlsZSR7ZmlsZXMubGVuZ3RoICE9PSAxID8gXCJzXCIgOiBcIlwifWA7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IGF3YWl0IGdpdC5hZGQocm9vdCwgZmlsZXMpO1xuXHRcdG5vdGlmaWNhdGlvbnMuYWRkR2l0KHRpdGxlLCByZXN1bHRzKTtcblx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogYCR7bnVtRmlsZXN9IHN0YWdlZC5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19