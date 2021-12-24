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
	label: "Push",
	description: "Push to upstream",
	confirm: {
		message: "Are you sure you want to push to upstream?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Push" : arguments[4];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);
		statusBar.show("Pushing...");
		var result = yield git.push(root, false);
		notifications.addGit(title, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Pushed."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVzaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7NkJBQ0osa0JBQWtCOzs7O3FCQUU3QjtBQUNkLE1BQUssRUFBRSxNQUFNO0FBQ2IsWUFBVyxFQUFFLGtCQUFrQjtBQUMvQixRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsNENBQTRDO0VBQ3JEO0FBQ0QsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBK0Q7TUFBN0QsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxNQUFNOztBQUM5RixNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsV0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNDLGVBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLHNCQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLEVBQUUsU0FBUztHQUNsQixDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlB1c2hcIixcblx0ZGVzY3JpcHRpb246IFwiUHVzaCB0byB1cHN0cmVhbVwiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVzaCB0byB1cHN0cmVhbT9cIixcblx0fSxcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdGl0bGUgPSBcIlB1c2hcIikge1xuXHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdChmaWxlUGF0aHMsIGdpdCk7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblx0XHRzdGF0dXNCYXIuc2hvdyhcIlB1c2hpbmcuLi5cIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZ2l0LnB1c2gocm9vdCwgZmFsc2UpO1xuXHRcdG5vdGlmaWNhdGlvbnMuYWRkR2l0KHRpdGxlLCByZXN1bHQpO1xuXHRcdGhlbHBlci5yZWZyZXNoQXRvbShyb290KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBcIlB1c2hlZC5cIixcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==