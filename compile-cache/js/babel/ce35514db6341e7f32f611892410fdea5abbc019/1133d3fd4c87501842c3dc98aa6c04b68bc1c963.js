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

var _pull = require("./pull");

exports["default"] = {
	label: "Pull All",
	description: "Pull all project repos",
	confirm: {
		message: "Are you sure you want to pull all project repos?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Pull All" : arguments[4];

		var pulls = yield Promise.all(atom.project.getPaths().map(function (root) {
			return (0, _pull.command)([root], statusBar, git, notifications)["catch"](function (err) {
				var message = err.stack ? err.stack : err.toString();
				notifications.addError("Git Menu: Pull", root + "\n\n" + message);
				return null;
			});
		}));

		var failed = pulls.filter(function (p) {
			return !p;
		});
		var num = "all";
		if (failed.length > 0) {
			num = pulls.length - failed.length;
		}

		return {
			title: title,
			message: "Pulled " + num + " repos."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVsbC1hbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7b0JBQ2QsUUFBUTs7cUJBRXZCO0FBQ2QsTUFBSyxFQUFFLFVBQVU7QUFDakIsWUFBVyxFQUFFLHdCQUF3QjtBQUNyQyxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsa0RBQWtEO0VBQzNEO0FBQ0QsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBbUU7TUFBakUsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxVQUFVOztBQUNsRyxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDbkUsVUFBTyxtQkFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLFNBQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNqRSxRQUFNLE9BQU8sR0FBSSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxBQUFDLENBQUM7QUFDekQsaUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUssSUFBSSxZQUFPLE9BQU8sQ0FBRyxDQUFDO0FBQ2xFLFdBQU8sSUFBSSxDQUFDO0lBQ1osQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUosTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7VUFBSSxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUM7QUFDckMsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLE1BQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsTUFBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztHQUNuQzs7QUFFRCxTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLGNBQVksR0FBRyxZQUFTO0dBQy9CLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9wdWxsLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCB7Y29tbWFuZCBhcyBwdWxsfSBmcm9tIFwiLi9wdWxsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiUHVsbCBBbGxcIixcblx0ZGVzY3JpcHRpb246IFwiUHVsbCBhbGwgcHJvamVjdCByZXBvc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVsbCBhbGwgcHJvamVjdCByZXBvcz9cIixcblx0fSxcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdGl0bGUgPSBcIlB1bGwgQWxsXCIpIHtcblx0XHRjb25zdCBwdWxscyA9IGF3YWl0IFByb21pc2UuYWxsKGF0b20ucHJvamVjdC5nZXRQYXRocygpLm1hcChyb290ID0+IHtcblx0XHRcdHJldHVybiBwdWxsKFtyb290XSwgc3RhdHVzQmFyLCBnaXQsIG5vdGlmaWNhdGlvbnMpLmNhdGNoKChlcnIpID0+IHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IChlcnIuc3RhY2sgPyBlcnIuc3RhY2sgOiBlcnIudG9TdHJpbmcoKSk7XG5cdFx0XHRcdG5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJHaXQgTWVudTogUHVsbFwiLCBgJHtyb290fVxcblxcbiR7bWVzc2FnZX1gKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cblx0XHRjb25zdCBmYWlsZWQgPSBwdWxscy5maWx0ZXIocCA9PiAhcCk7XG5cdFx0bGV0IG51bSA9IFwiYWxsXCI7XG5cdFx0aWYgKGZhaWxlZC5sZW5ndGggPiAwKSB7XG5cdFx0XHRudW0gPSBwdWxscy5sZW5ndGggLSBmYWlsZWQubGVuZ3RoO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IGBQdWxsZWQgJHtudW19IHJlcG9zLmAsXG5cdFx0fTtcblx0fSxcbn07XG4iXX0=