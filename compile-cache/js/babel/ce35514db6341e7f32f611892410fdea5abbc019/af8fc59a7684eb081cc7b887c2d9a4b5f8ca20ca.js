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
	label: "Pull",
	description: "Pull from upstream",
	confirm: {
		message: "Are you sure you want to pull from upstream?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Pull" : arguments[4];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		var rebase = atom.config.get("git-menu.rebaseOnPull");
		yield _helper2["default"].checkGitLock(root);
		statusBar.show("Pulling...");
		var result = yield git.pull(root, rebase, false);
		notifications.addGit(title, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Pulled."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7NkJBQ0osa0JBQWtCOzs7O3FCQUU3QjtBQUNkLE1BQUssRUFBRSxNQUFNO0FBQ2IsWUFBVyxFQUFFLG9CQUFvQjtBQUNqQyxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsOENBQThDO0VBQ3ZEO0FBQ0QsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBK0Q7TUFBN0QsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxNQUFNOztBQUM5RixNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN4RCxRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxXQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25ELGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLEVBQUUsU0FBUztHQUNsQixDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlB1bGxcIixcblx0ZGVzY3JpcHRpb246IFwiUHVsbCBmcm9tIHVwc3RyZWFtXCIsXG5cdGNvbmZpcm06IHtcblx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwdWxsIGZyb20gdXBzdHJlYW0/XCIsXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJQdWxsXCIpIHtcblx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGNvbnN0IHJlYmFzZSA9IGF0b20uY29uZmlnLmdldChcImdpdC1tZW51LnJlYmFzZU9uUHVsbFwiKTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdHN0YXR1c0Jhci5zaG93KFwiUHVsbGluZy4uLlwiKTtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBnaXQucHVsbChyb290LCByZWJhc2UsIGZhbHNlKTtcblx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgcmVzdWx0KTtcblx0XHRoZWxwZXIucmVmcmVzaEF0b20ocm9vdCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogXCJQdWxsZWQuXCIsXG5cdFx0fTtcblx0fSxcbn07XG4iXX0=