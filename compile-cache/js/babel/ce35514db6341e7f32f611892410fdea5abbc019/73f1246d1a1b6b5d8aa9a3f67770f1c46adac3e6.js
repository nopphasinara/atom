Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _sync = require("./sync");

exports["default"] = {
	label: "Sync All",
	description: "Pull then push all project repos",
	confirm: {
		message: "Are you sure you want to sync all project repos?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Sync All" : arguments[4];

		var syncs = yield Promise.all(atom.project.getPaths().map(function (root) {
			return (0, _sync.command)([root], statusBar, git, notifications)["catch"](function (err) {
				var message = err.stack ? err.stack : err.toString();
				notifications.addError("Git Menu: Sync", root + "\n\n" + message);
				return null;
			});
		}));

		var failed = syncs.filter(function (p) {
			return !p;
		});
		var num = "all";
		if (failed.length > 0) {
			num = syncs.length - failed.length;
		}

		return {
			title: title,
			message: "Synced " + num + " repos."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3luYy1hbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7b0JBQ2QsUUFBUTs7cUJBRXZCO0FBQ2QsTUFBSyxFQUFFLFVBQVU7QUFDakIsWUFBVyxFQUFFLGtDQUFrQztBQUMvQyxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsa0RBQWtEO0VBQzNEO0FBQ0QsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBbUU7TUFBakUsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxVQUFVOztBQUNsRyxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDbkUsVUFBTyxtQkFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLFNBQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNqRSxRQUFNLE9BQU8sR0FBSSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxBQUFDLENBQUM7QUFDekQsaUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUssSUFBSSxZQUFPLE9BQU8sQ0FBRyxDQUFDO0FBQ2xFLFdBQU8sSUFBSSxDQUFDO0lBQ1osQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUosTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7VUFBSSxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUM7QUFDckMsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLE1BQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsTUFBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztHQUNuQzs7QUFFRCxTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLGNBQVksR0FBRyxZQUFTO0dBQy9CLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9zeW5jLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCB7Y29tbWFuZCBhcyBzeW5jfSBmcm9tIFwiLi9zeW5jXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiU3luYyBBbGxcIixcblx0ZGVzY3JpcHRpb246IFwiUHVsbCB0aGVuIHB1c2ggYWxsIHByb2plY3QgcmVwb3NcIixcblx0Y29uZmlybToge1xuXHRcdG1lc3NhZ2U6IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHN5bmMgYWxsIHByb2plY3QgcmVwb3M/XCIsXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJTeW5jIEFsbFwiKSB7XG5cdFx0Y29uc3Qgc3luY3MgPSBhd2FpdCBQcm9taXNlLmFsbChhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5tYXAocm9vdCA9PiB7XG5cdFx0XHRyZXR1cm4gc3luYyhbcm9vdF0sIHN0YXR1c0JhciwgZ2l0LCBub3RpZmljYXRpb25zKS5jYXRjaCgoZXJyKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSAoZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRub3RpZmljYXRpb25zLmFkZEVycm9yKFwiR2l0IE1lbnU6IFN5bmNcIiwgYCR7cm9vdH1cXG5cXG4ke21lc3NhZ2V9YCk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fSk7XG5cdFx0fSkpO1xuXG5cdFx0Y29uc3QgZmFpbGVkID0gc3luY3MuZmlsdGVyKHAgPT4gIXApO1xuXHRcdGxldCBudW0gPSBcImFsbFwiO1xuXHRcdGlmIChmYWlsZWQubGVuZ3RoID4gMCkge1xuXHRcdFx0bnVtID0gc3luY3MubGVuZ3RoIC0gZmFpbGVkLmxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBgU3luY2VkICR7bnVtfSByZXBvcy5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19