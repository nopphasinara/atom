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

var _fetch = require("./fetch");

exports["default"] = {
	label: "Fetch All",
	description: "Fetch all project repos",
	confirm: {
		message: "Are you sure you want to fetch all project repos?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Fetch All" : arguments[4];

		var fetches = yield Promise.all(atom.project.getPaths().map(function (root) {
			return (0, _fetch.command)([root], statusBar, git, notifications)["catch"](function (err) {
				var message = err.stack ? err.stack : err.toString();
				notifications.addError("Git Menu: Fetch", root + "\n\n" + message);
				return null;
			});
		}));

		var failed = fetches.filter(function (p) {
			return !p;
		});
		var num = "all";
		if (failed.length > 0) {
			num = fetches.length - failed.length;
		}

		return {
			title: title,
			message: "Fetched " + num + " repos."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZmV0Y2gtYWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7NkJBQ0wsa0JBQWtCOzs7O3FCQUNiLFNBQVM7O3FCQUV6QjtBQUNkLE1BQUssRUFBRSxXQUFXO0FBQ2xCLFlBQVcsRUFBRSx5QkFBeUI7QUFDdEMsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLG1EQUFtRDtFQUM1RDtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQW9FO01BQWxFLEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsV0FBVzs7QUFDbkcsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3JFLFVBQU8sb0JBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDbEUsUUFBTSxPQUFPLEdBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQUFBQyxDQUFDO0FBQ3pELGlCQUFhLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFLLElBQUksWUFBTyxPQUFPLENBQUcsQ0FBQztBQUNuRSxXQUFPLElBQUksQ0FBQztJQUNaLENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQyxDQUFDOztBQUVKLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO1VBQUksQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQ3ZDLE1BQUksR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNoQixNQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLE1BQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7R0FDckM7O0FBRUQsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxlQUFhLEdBQUcsWUFBUztHQUNoQyxDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZmV0Y2gtYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuaW1wb3J0IHtjb21tYW5kIGFzIGZldGNofSBmcm9tIFwiLi9mZXRjaFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIkZldGNoIEFsbFwiLFxuXHRkZXNjcmlwdGlvbjogXCJGZXRjaCBhbGwgcHJvamVjdCByZXBvc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZmV0Y2ggYWxsIHByb2plY3QgcmVwb3M/XCIsXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJGZXRjaCBBbGxcIikge1xuXHRcdGNvbnN0IGZldGNoZXMgPSBhd2FpdCBQcm9taXNlLmFsbChhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5tYXAocm9vdCA9PiB7XG5cdFx0XHRyZXR1cm4gZmV0Y2goW3Jvb3RdLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucykuY2F0Y2goKGVycikgPT4ge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gKGVyci5zdGFjayA/IGVyci5zdGFjayA6IGVyci50b1N0cmluZygpKTtcblx0XHRcdFx0bm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkdpdCBNZW51OiBGZXRjaFwiLCBgJHtyb290fVxcblxcbiR7bWVzc2FnZX1gKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cblx0XHRjb25zdCBmYWlsZWQgPSBmZXRjaGVzLmZpbHRlcihwID0+ICFwKTtcblx0XHRsZXQgbnVtID0gXCJhbGxcIjtcblx0XHRpZiAoZmFpbGVkLmxlbmd0aCA+IDApIHtcblx0XHRcdG51bSA9IGZldGNoZXMubGVuZ3RoIC0gZmFpbGVkLmxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBgRmV0Y2hlZCAke251bX0gcmVwb3MuYCxcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==