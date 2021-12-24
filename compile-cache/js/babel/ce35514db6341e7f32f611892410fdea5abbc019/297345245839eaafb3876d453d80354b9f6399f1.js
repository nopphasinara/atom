Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _stashChanges = require("./stash-changes");

exports["default"] = {
	label: "Unstash Changes",
	description: "Restore the changes that were stashed",
	command: function command(filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Unstash Changes" : arguments[4];

		return (0, _stashChanges.command)(filePaths, statusBar, git, notifications, true, title);
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvdW5zdGFzaC1jaGFuZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7OzZCQUNMLGtCQUFrQjs7Ozs0QkFFTixpQkFBaUI7O3FCQUV4QztBQUNkLE1BQUssRUFBRSxpQkFBaUI7QUFDeEIsWUFBVyxFQUFFLHVDQUF1QztBQUNwRCxRQUFPLEVBQUEsaUJBQUMsU0FBUyxFQUFFLFNBQVMsRUFBMEU7TUFBeEUsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxpQkFBaUI7O0FBQ25HLFNBQU8sMkJBQWEsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztFQUMzRTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvdW5zdGFzaC1jaGFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5pbXBvcnQge2NvbW1hbmQgYXMgc3Rhc2hDaGFuZ2VzfSBmcm9tIFwiLi9zdGFzaC1jaGFuZ2VzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiVW5zdGFzaCBDaGFuZ2VzXCIsXG5cdGRlc2NyaXB0aW9uOiBcIlJlc3RvcmUgdGhlIGNoYW5nZXMgdGhhdCB3ZXJlIHN0YXNoZWRcIixcblx0Y29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdGl0bGUgPSBcIlVuc3Rhc2ggQ2hhbmdlc1wiKSB7XG5cdFx0cmV0dXJuIHN0YXNoQ2hhbmdlcyhmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0LCBub3RpZmljYXRpb25zLCB0cnVlLCB0aXRsZSk7XG5cdH0sXG59O1xuIl19