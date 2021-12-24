Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _ignoreChanges = require("./ignore-changes");

exports["default"] = {
	label: "Unignore Changes",
	description: "Unignore changes to selected files",
	command: function command(filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Unignore Changes" : arguments[4];

		return (0, _ignoreChanges.command)(filePaths, statusBar, git, notifications, false, title);
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvdW5pZ25vcmUtY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFFbUIsWUFBWTs7Ozs2QkFDTCxrQkFBa0I7Ozs7NkJBRUwsa0JBQWtCOztxQkFFMUM7QUFDZCxNQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLFlBQVcsRUFBRSxvQ0FBb0M7QUFDakQsUUFBTyxFQUFBLGlCQUFDLFNBQVMsRUFBRSxTQUFTLEVBQTJFO01BQXpFLEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsa0JBQWtCOztBQUNwRyxTQUFPLDRCQUFjLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDN0U7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbW1hbmRzL3VuaWdub3JlLWNoYW5nZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmltcG9ydCB7Y29tbWFuZCBhcyBpZ25vcmVDaGFuZ2VzfSBmcm9tIFwiLi9pZ25vcmUtY2hhbmdlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIlVuaWdub3JlIENoYW5nZXNcIixcblx0ZGVzY3JpcHRpb246IFwiVW5pZ25vcmUgY2hhbmdlcyB0byBzZWxlY3RlZCBmaWxlc1wiLFxuXHRjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zLCB0aXRsZSA9IFwiVW5pZ25vcmUgQ2hhbmdlc1wiKSB7XG5cdFx0cmV0dXJuIGlnbm9yZUNoYW5nZXMoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucywgZmFsc2UsIHRpdGxlKTtcblx0fSxcbn07XG4iXX0=