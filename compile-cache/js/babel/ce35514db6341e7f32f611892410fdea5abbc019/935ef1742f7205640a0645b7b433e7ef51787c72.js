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
	label: "Fetch",
	description: "Fetch from all tracked repos",
	confirm: {
		message: "Are you sure you want to fetch all tracked repos?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Fetch" : arguments[4];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);
		statusBar.show("Fetching...");
		var result = yield git.fetch(root);
		notifications.addGit(title, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Fetched."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZmV0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7OztzQkFDWixXQUFXOzs7OzZCQUNKLGtCQUFrQjs7OztxQkFFN0I7QUFDZCxNQUFLLEVBQUUsT0FBTztBQUNkLFlBQVcsRUFBRSw4QkFBOEI7QUFDM0MsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLG1EQUFtRDtFQUM1RDtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQWdFO01BQTlELEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsT0FBTzs7QUFDL0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFdBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLEVBQUUsVUFBVTtHQUNuQixDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZmV0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRsYWJlbDogXCJGZXRjaFwiLFxuXHRkZXNjcmlwdGlvbjogXCJGZXRjaCBmcm9tIGFsbCB0cmFja2VkIHJlcG9zXCIsXG5cdGNvbmZpcm06IHtcblx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBmZXRjaCBhbGwgdHJhY2tlZCByZXBvcz9cIixcblx0fSxcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdGl0bGUgPSBcIkZldGNoXCIpIHtcblx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGF3YWl0IGhlbHBlci5jaGVja0dpdExvY2socm9vdCk7XG5cdFx0c3RhdHVzQmFyLnNob3coXCJGZXRjaGluZy4uLlwiKTtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBnaXQuZmV0Y2gocm9vdCk7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdCk7XG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IFwiRmV0Y2hlZC5cIixcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==