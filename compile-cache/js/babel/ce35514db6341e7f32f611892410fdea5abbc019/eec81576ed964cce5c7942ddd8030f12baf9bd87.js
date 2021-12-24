Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _dialogsCommitDialog = require("../dialogs/CommitDialog");

var _dialogsCommitDialog2 = _interopRequireDefault(_dialogsCommitDialog);

var _commit = require("./commit");

exports["default"] = {
	label: "Commit All...",
	description: "Commit all files",
	command: function command(filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsCommitDialog2["default"] : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Commit All" : arguments[5];

		// only get paths that are parents of filePaths files
		var paths = atom.project.getPaths().map(function (root) {
			var r = root.toLowerCase().replace(/\\/g, "/");
			var hasPath = filePaths.some(function (file) {
				var p = file.toLowerCase().replace(/\\/g, "/");
				return p.indexOf(r) === 0;
			});
			return hasPath ? root : false;
		}).filter(function (r) {
			return r;
		});

		return (0, _commit.command)(paths, statusBar, git, notifications, dialog, title);
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY29tbWl0LWFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7bUNBQ25CLHlCQUF5Qjs7OztzQkFFbEIsVUFBVTs7cUJBRTNCO0FBQ2QsTUFBSyxFQUFFLGVBQWU7QUFDdEIsWUFBVyxFQUFFLGtCQUFrQjtBQUMvQixRQUFPLEVBQUEsaUJBQUMsU0FBUyxFQUFFLFNBQVMsRUFBNEY7TUFBMUYsR0FBRztNQUFXLGFBQWE7TUFBa0IsTUFBTTtNQUFpQixLQUFLLHlEQUFHLFlBQVk7OztBQUVySCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNqRCxPQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRCxPQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3RDLFFBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pELFdBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0FBQ0gsVUFBTyxPQUFPLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztHQUM5QixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztVQUFJLENBQUM7R0FBQSxDQUFDLENBQUM7O0FBRWxCLFNBQU8scUJBQU8sS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztFQUNuRTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvY29tbWl0LWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCBDb21taXREaWFsb2cgZnJvbSBcIi4uL2RpYWxvZ3MvQ29tbWl0RGlhbG9nXCI7XG5cbmltcG9ydCB7Y29tbWFuZCBhcyBjb21taXR9IGZyb20gXCIuL2NvbW1pdFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIkNvbW1pdCBBbGwuLi5cIixcblx0ZGVzY3JpcHRpb246IFwiQ29tbWl0IGFsbCBmaWxlc1wiLFxuXHRjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCBkaWFsb2cgPSBDb21taXREaWFsb2csIHRpdGxlID0gXCJDb21taXQgQWxsXCIpIHtcblx0XHQvLyBvbmx5IGdldCBwYXRocyB0aGF0IGFyZSBwYXJlbnRzIG9mIGZpbGVQYXRocyBmaWxlc1xuXHRcdGNvbnN0IHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubWFwKHJvb3QgPT4ge1xuXHRcdFx0Y29uc3QgciA9IHJvb3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcblx0XHRcdGNvbnN0IGhhc1BhdGggPSBmaWxlUGF0aHMuc29tZShmaWxlID0+IHtcblx0XHRcdFx0Y29uc3QgcCA9IGZpbGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcblx0XHRcdFx0cmV0dXJuIHAuaW5kZXhPZihyKSA9PT0gMDtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGhhc1BhdGggPyByb290IDogZmFsc2U7XG5cdFx0fSkuZmlsdGVyKHIgPT4gcik7XG5cblx0XHRyZXR1cm4gY29tbWl0KHBhdGhzLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucywgZGlhbG9nLCB0aXRsZSk7XG5cdH0sXG59O1xuIl19