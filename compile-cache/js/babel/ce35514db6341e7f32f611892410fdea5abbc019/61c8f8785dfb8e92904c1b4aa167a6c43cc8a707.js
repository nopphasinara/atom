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

var _push = require("./push");

exports["default"] = {
	label: "Push All",
	description: "Push all project repos",
	confirm: {
		message: "Are you sure you want to push all projectrepos?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Push All" : arguments[4];

		var pushes = yield Promise.all(atom.project.getPaths().map(function (root) {
			return (0, _push.command)([root], statusBar, git, notifications)["catch"](function (err) {
				var message = err.stack ? err.stack : err.toString();
				notifications.addError("Git Menu: Push", root + "\n\n" + message);
				return null;
			});
		}));

		var failed = pushes.filter(function (p) {
			return !p;
		});
		var num = "all";
		if (failed.length > 0) {
			num = pushes.length - failed.length;
		}

		return {
			title: title,
			message: "Pushed " + num + " repos."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcHVzaC1hbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7b0JBQ2QsUUFBUTs7cUJBRXZCO0FBQ2QsTUFBSyxFQUFFLFVBQVU7QUFDakIsWUFBVyxFQUFFLHdCQUF3QjtBQUNyQyxRQUFPLEVBQUU7QUFDUixTQUFPLEVBQUUsaURBQWlEO0VBQzFEO0FBQ0QsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBbUU7TUFBakUsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxVQUFVOztBQUNsRyxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDcEUsVUFBTyxtQkFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLFNBQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNqRSxRQUFNLE9BQU8sR0FBSSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxBQUFDLENBQUM7QUFDekQsaUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUssSUFBSSxZQUFPLE9BQU8sQ0FBRyxDQUFDO0FBQ2xFLFdBQU8sSUFBSSxDQUFDO0lBQ1osQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUosTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7VUFBSSxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUM7QUFDdEMsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLE1BQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsTUFBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztHQUNwQzs7QUFFRCxTQUFPO0FBQ04sUUFBSyxFQUFMLEtBQUs7QUFDTCxVQUFPLGNBQVksR0FBRyxZQUFTO0dBQy9CLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9wdXNoLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCB7Y29tbWFuZCBhcyBwdXNofSBmcm9tIFwiLi9wdXNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiUHVzaCBBbGxcIixcblx0ZGVzY3JpcHRpb246IFwiUHVzaCBhbGwgcHJvamVjdCByZXBvc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVzaCBhbGwgcHJvamVjdHJlcG9zP1wiLFxuXHR9LFxuXHRhc3luYyBjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCB0aXRsZSA9IFwiUHVzaCBBbGxcIikge1xuXHRcdGNvbnN0IHB1c2hlcyA9IGF3YWl0IFByb21pc2UuYWxsKGF0b20ucHJvamVjdC5nZXRQYXRocygpLm1hcChyb290ID0+IHtcblx0XHRcdHJldHVybiBwdXNoKFtyb290XSwgc3RhdHVzQmFyLCBnaXQsIG5vdGlmaWNhdGlvbnMpLmNhdGNoKChlcnIpID0+IHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IChlcnIuc3RhY2sgPyBlcnIuc3RhY2sgOiBlcnIudG9TdHJpbmcoKSk7XG5cdFx0XHRcdG5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJHaXQgTWVudTogUHVzaFwiLCBgJHtyb290fVxcblxcbiR7bWVzc2FnZX1gKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cblx0XHRjb25zdCBmYWlsZWQgPSBwdXNoZXMuZmlsdGVyKHAgPT4gIXApO1xuXHRcdGxldCBudW0gPSBcImFsbFwiO1xuXHRcdGlmIChmYWlsZWQubGVuZ3RoID4gMCkge1xuXHRcdFx0bnVtID0gcHVzaGVzLmxlbmd0aCAtIGZhaWxlZC5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogYFB1c2hlZCAke251bX0gcmVwb3MuYCxcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==