Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _discardChanges = require("./discard-changes");

exports["default"] = {
	label: "Discard All Changes",
	description: "Discard all changes",
	confirm: {
		message: "Are you sure you want to discard all uncommitted changes to all files in this repo?"
	},
	command: function command(filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Discard All Changes" : arguments[4];

		return (0, _discardChanges.command)(atom.project.getPaths(), statusBar, git, notifications, title);
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGlzY2FyZC1hbGwtY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7OEJBRUosbUJBQW1COztxQkFFNUM7QUFDZCxNQUFLLEVBQUUscUJBQXFCO0FBQzVCLFlBQVcsRUFBRSxxQkFBcUI7QUFDbEMsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLHFGQUFxRjtFQUM5RjtBQUNELFFBQU8sRUFBQSxpQkFBQyxTQUFTLEVBQUUsU0FBUyxFQUE4RTtNQUE1RSxHQUFHO01BQVcsYUFBYTtNQUFrQixLQUFLLHlEQUFHLHFCQUFxQjs7QUFDdkcsU0FBTyw2QkFBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0VBQ3JGO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9kaXNjYXJkLWFsbC1jaGFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5pbXBvcnQge2NvbW1hbmQgYXMgZGlzY2FyZENoYW5nZXN9IGZyb20gXCIuL2Rpc2NhcmQtY2hhbmdlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIkRpc2NhcmQgQWxsIENoYW5nZXNcIixcblx0ZGVzY3JpcHRpb246IFwiRGlzY2FyZCBhbGwgY2hhbmdlc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGlzY2FyZCBhbGwgdW5jb21taXR0ZWQgY2hhbmdlcyB0byBhbGwgZmlsZXMgaW4gdGhpcyByZXBvP1wiLFxuXHR9LFxuXHRjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCB0aXRsZSA9IFwiRGlzY2FyZCBBbGwgQ2hhbmdlc1wiKSB7XG5cdFx0cmV0dXJuIGRpc2NhcmRDaGFuZ2VzKGF0b20ucHJvamVjdC5nZXRQYXRocygpLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucywgdGl0bGUpO1xuXHR9LFxufTtcbiJdfQ==