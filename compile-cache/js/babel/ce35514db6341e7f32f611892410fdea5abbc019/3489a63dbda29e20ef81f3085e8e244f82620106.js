Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _commandsCommit = require("./commands/commit");

var _commandsCommit2 = _interopRequireDefault(_commandsCommit);

var _commandsCommitAll = require("./commands/commit-all");

var _commandsCommitAll2 = _interopRequireDefault(_commandsCommitAll);

var _commandsCommitStaged = require("./commands/commit-staged");

var _commandsCommitStaged2 = _interopRequireDefault(_commandsCommitStaged);

var _commandsStageChanges = require("./commands/stage-changes");

var _commandsStageChanges2 = _interopRequireDefault(_commandsStageChanges);

var _commandsAddToLastCommit = require("./commands/add-to-last-commit");

var _commandsAddToLastCommit2 = _interopRequireDefault(_commandsAddToLastCommit);

var _commandsUndoLastCommit = require("./commands/undo-last-commit");

var _commandsUndoLastCommit2 = _interopRequireDefault(_commandsUndoLastCommit);

var _commandsDiscardChanges = require("./commands/discard-changes");

var _commandsDiscardChanges2 = _interopRequireDefault(_commandsDiscardChanges);

var _commandsDiscardAllChanges = require("./commands/discard-all-changes");

var _commandsDiscardAllChanges2 = _interopRequireDefault(_commandsDiscardAllChanges);

var _commandsIgnoreChanges = require("./commands/ignore-changes");

var _commandsIgnoreChanges2 = _interopRequireDefault(_commandsIgnoreChanges);

var _commandsUnignoreChanges = require("./commands/unignore-changes");

var _commandsUnignoreChanges2 = _interopRequireDefault(_commandsUnignoreChanges);

var _commandsStashChanges = require("./commands/stash-changes");

var _commandsStashChanges2 = _interopRequireDefault(_commandsStashChanges);

var _commandsUnstashChanges = require("./commands/unstash-changes");

var _commandsUnstashChanges2 = _interopRequireDefault(_commandsUnstashChanges);

var _commandsFetch = require("./commands/fetch");

var _commandsFetch2 = _interopRequireDefault(_commandsFetch);

var _commandsFetchAll = require("./commands/fetch-all");

var _commandsFetchAll2 = _interopRequireDefault(_commandsFetchAll);

var _commandsPull = require("./commands/pull");

var _commandsPull2 = _interopRequireDefault(_commandsPull);

var _commandsPullAll = require("./commands/pull-all");

var _commandsPullAll2 = _interopRequireDefault(_commandsPullAll);

var _commandsPush = require("./commands/push");

var _commandsPush2 = _interopRequireDefault(_commandsPush);

var _commandsPushAll = require("./commands/push-all");

var _commandsPushAll2 = _interopRequireDefault(_commandsPushAll);

var _commandsSync = require("./commands/sync");

var _commandsSync2 = _interopRequireDefault(_commandsSync);

var _commandsSyncAll = require("./commands/sync-all");

var _commandsSyncAll2 = _interopRequireDefault(_commandsSyncAll);

var _commandsMergeBranch = require("./commands/merge-branch");

var _commandsMergeBranch2 = _interopRequireDefault(_commandsMergeBranch);

var _commandsSwitchBranch = require("./commands/switch-branch");

var _commandsSwitchBranch2 = _interopRequireDefault(_commandsSwitchBranch);

var _commandsCreateBranch = require("./commands/create-branch");

var _commandsCreateBranch2 = _interopRequireDefault(_commandsCreateBranch);

var _commandsDeleteBranch = require("./commands/delete-branch");

var _commandsDeleteBranch2 = _interopRequireDefault(_commandsDeleteBranch);

var _commandsInit = require("./commands/init");

var _commandsInit2 = _interopRequireDefault(_commandsInit);

var _commandsLog = require("./commands/log");

var _commandsLog2 = _interopRequireDefault(_commandsLog);

var _commandsDiff = require("./commands/diff");

var _commandsDiff2 = _interopRequireDefault(_commandsDiff);

var _commandsRunCommand = require("./commands/run-command");

var _commandsRunCommand2 = _interopRequireDefault(_commandsRunCommand);

var _commandsRefresh = require("./commands/refresh");

var _commandsRefresh2 = _interopRequireDefault(_commandsRefresh);

/**
 * These commands will be added to the context menu in the order they appear here.
 * They can include the following properties:
 * {
 *   label: (required) The text to display on the context menu item
 *   description: (optional) A description that will be displayed by the enable/disable setting
 *   keymap: (optional) A key combination to add as a default keybinding
 *   confirm: (optional) If the command requires a confirm dialog you can supply the `message` and `detail` parameters
 *     message: (required) This is the question you are asking the user to confirm.
 *     detail: (optional) This is where you can provide a more detailed list of the changes.
 *                                 This can be a string or a function that will be called with the `filePaths` parameter that returns a string
 *                                 This function can be asynchronous
 *   command: (required) The asynchronous function to run when the command is called.
 *                       This function will be called with the parameters `filePaths` and `statusBar`.
 *                       This function should ultimately resolve to an object with the following properties:
 *                         .title: A title for the command
 *                         .message: A success message to display to the user
 * }
 */
exports["default"] = {
	"commit": _commandsCommit2["default"],
	"commit-all": _commandsCommitAll2["default"],
	"commit-staged": _commandsCommitStaged2["default"],
	"stage-changes": _commandsStageChanges2["default"],
	"add-to-last-commit": _commandsAddToLastCommit2["default"],
	"undo-last-commit": _commandsUndoLastCommit2["default"],
	"discard-changes": _commandsDiscardChanges2["default"],
	"discard-all-changes": _commandsDiscardAllChanges2["default"],
	"ignore-changes": _commandsIgnoreChanges2["default"],
	"unignore-changes": _commandsUnignoreChanges2["default"],
	"stash-changes": _commandsStashChanges2["default"],
	"unstash-changes": _commandsUnstashChanges2["default"],
	"fetch": _commandsFetch2["default"],
	"fetch-all": _commandsFetchAll2["default"],
	"pull": _commandsPull2["default"],
	"pull-all": _commandsPullAll2["default"],
	"push": _commandsPush2["default"],
	"push-all": _commandsPushAll2["default"],
	"sync": _commandsSync2["default"],
	"sync-all": _commandsSyncAll2["default"],
	"merge-branch": _commandsMergeBranch2["default"],
	"switch-branch": _commandsSwitchBranch2["default"],
	"create-branch": _commandsCreateBranch2["default"],
	"delete-branch": _commandsDeleteBranch2["default"],
	"init": _commandsInit2["default"],
	"log": _commandsLog2["default"],
	"diff": _commandsDiff2["default"],
	"run-command": _commandsRunCommand2["default"],
	"refresh": _commandsRefresh2["default"]
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OEJBRW1CLG1CQUFtQjs7OztpQ0FDaEIsdUJBQXVCOzs7O29DQUNwQiwwQkFBMEI7Ozs7b0NBQzFCLDBCQUEwQjs7Ozt1Q0FDdkIsK0JBQStCOzs7O3NDQUNoQyw2QkFBNkI7Ozs7c0NBQzdCLDRCQUE0Qjs7Ozt5Q0FDekIsZ0NBQWdDOzs7O3FDQUNwQywyQkFBMkI7Ozs7dUNBQ3pCLDZCQUE2Qjs7OztvQ0FDaEMsMEJBQTBCOzs7O3NDQUN4Qiw0QkFBNEI7Ozs7NkJBQ3JDLGtCQUFrQjs7OztnQ0FDZixzQkFBc0I7Ozs7NEJBQzFCLGlCQUFpQjs7OzsrQkFDZCxxQkFBcUI7Ozs7NEJBQ3hCLGlCQUFpQjs7OzsrQkFDZCxxQkFBcUI7Ozs7NEJBQ3hCLGlCQUFpQjs7OzsrQkFDZCxxQkFBcUI7Ozs7bUNBQ2pCLHlCQUF5Qjs7OztvQ0FDeEIsMEJBQTBCOzs7O29DQUMxQiwwQkFBMEI7Ozs7b0NBQzFCLDBCQUEwQjs7Ozs0QkFDbEMsaUJBQWlCOzs7OzJCQUNsQixnQkFBZ0I7Ozs7NEJBQ2YsaUJBQWlCOzs7O2tDQUNYLHdCQUF3Qjs7OzsrQkFDM0Isb0JBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFxQnpCO0FBQ2QsU0FBUSw2QkFBUTtBQUNoQixhQUFZLGdDQUFXO0FBQ3ZCLGdCQUFlLG1DQUFjO0FBQzdCLGdCQUFlLG1DQUFjO0FBQzdCLHFCQUFvQixzQ0FBaUI7QUFDckMsbUJBQWtCLHFDQUFnQjtBQUNsQyxrQkFBaUIscUNBQWdCO0FBQ2pDLHNCQUFxQix3Q0FBbUI7QUFDeEMsaUJBQWdCLG9DQUFlO0FBQy9CLG1CQUFrQixzQ0FBaUI7QUFDbkMsZ0JBQWUsbUNBQWM7QUFDN0Isa0JBQWlCLHFDQUFnQjtBQUNqQyxRQUFPLDRCQUFPO0FBQ2QsWUFBVywrQkFBVTtBQUNyQixPQUFNLDJCQUFNO0FBQ1osV0FBVSw4QkFBUztBQUNuQixPQUFNLDJCQUFNO0FBQ1osV0FBVSw4QkFBUztBQUNuQixPQUFNLDJCQUFNO0FBQ1osV0FBVSw4QkFBUztBQUNuQixlQUFjLGtDQUFhO0FBQzNCLGdCQUFlLG1DQUFjO0FBQzdCLGdCQUFlLG1DQUFjO0FBQzdCLGdCQUFlLG1DQUFjO0FBQzdCLE9BQU0sMkJBQU07QUFDWixNQUFLLDBCQUFLO0FBQ1YsT0FBTSwyQkFBTTtBQUNaLGNBQWEsaUNBQVk7QUFDekIsVUFBUyw4QkFBUztDQUNsQiIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgY29tbWl0IGZyb20gXCIuL2NvbW1hbmRzL2NvbW1pdFwiO1xuaW1wb3J0IGNvbW1pdEFsbCBmcm9tIFwiLi9jb21tYW5kcy9jb21taXQtYWxsXCI7XG5pbXBvcnQgY29tbWl0U3RhZ2VkIGZyb20gXCIuL2NvbW1hbmRzL2NvbW1pdC1zdGFnZWRcIjtcbmltcG9ydCBzdGFnZUNoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvc3RhZ2UtY2hhbmdlc1wiO1xuaW1wb3J0IGFkZFRvTGFzdENvbW1pdCBmcm9tIFwiLi9jb21tYW5kcy9hZGQtdG8tbGFzdC1jb21taXRcIjtcbmltcG9ydCB1bmRvTGFzdENvbW1pdCBmcm9tIFwiLi9jb21tYW5kcy91bmRvLWxhc3QtY29tbWl0XCI7XG5pbXBvcnQgZGlzY2FyZENoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvZGlzY2FyZC1jaGFuZ2VzXCI7XG5pbXBvcnQgZGlzY2FyZEFsbENoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvZGlzY2FyZC1hbGwtY2hhbmdlc1wiO1xuaW1wb3J0IGlnbm9yZUNoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvaWdub3JlLWNoYW5nZXNcIjtcbmltcG9ydCB1bmlnbm9yZUNoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvdW5pZ25vcmUtY2hhbmdlc1wiO1xuaW1wb3J0IHN0YXNoQ2hhbmdlcyBmcm9tIFwiLi9jb21tYW5kcy9zdGFzaC1jaGFuZ2VzXCI7XG5pbXBvcnQgdW5zdGFzaENoYW5nZXMgZnJvbSBcIi4vY29tbWFuZHMvdW5zdGFzaC1jaGFuZ2VzXCI7XG5pbXBvcnQgZmV0Y2ggZnJvbSBcIi4vY29tbWFuZHMvZmV0Y2hcIjtcbmltcG9ydCBmZXRjaEFsbCBmcm9tIFwiLi9jb21tYW5kcy9mZXRjaC1hbGxcIjtcbmltcG9ydCBwdWxsIGZyb20gXCIuL2NvbW1hbmRzL3B1bGxcIjtcbmltcG9ydCBwdWxsQWxsIGZyb20gXCIuL2NvbW1hbmRzL3B1bGwtYWxsXCI7XG5pbXBvcnQgcHVzaCBmcm9tIFwiLi9jb21tYW5kcy9wdXNoXCI7XG5pbXBvcnQgcHVzaEFsbCBmcm9tIFwiLi9jb21tYW5kcy9wdXNoLWFsbFwiO1xuaW1wb3J0IHN5bmMgZnJvbSBcIi4vY29tbWFuZHMvc3luY1wiO1xuaW1wb3J0IHN5bmNBbGwgZnJvbSBcIi4vY29tbWFuZHMvc3luYy1hbGxcIjtcbmltcG9ydCBtZXJnZUJyYW5jaCBmcm9tIFwiLi9jb21tYW5kcy9tZXJnZS1icmFuY2hcIjtcbmltcG9ydCBzd2l0Y2hCcmFuY2ggZnJvbSBcIi4vY29tbWFuZHMvc3dpdGNoLWJyYW5jaFwiO1xuaW1wb3J0IGNyZWF0ZUJyYW5jaCBmcm9tIFwiLi9jb21tYW5kcy9jcmVhdGUtYnJhbmNoXCI7XG5pbXBvcnQgZGVsZXRlQnJhbmNoIGZyb20gXCIuL2NvbW1hbmRzL2RlbGV0ZS1icmFuY2hcIjtcbmltcG9ydCBpbml0IGZyb20gXCIuL2NvbW1hbmRzL2luaXRcIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4vY29tbWFuZHMvbG9nXCI7XG5pbXBvcnQgZGlmZiBmcm9tIFwiLi9jb21tYW5kcy9kaWZmXCI7XG5pbXBvcnQgcnVuQ29tbWFuZCBmcm9tIFwiLi9jb21tYW5kcy9ydW4tY29tbWFuZFwiO1xuaW1wb3J0IHJlZnJlc2ggZnJvbSBcIi4vY29tbWFuZHMvcmVmcmVzaFwiO1xuXG4vKipcbiAqIFRoZXNlIGNvbW1hbmRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGNvbnRleHQgbWVudSBpbiB0aGUgb3JkZXIgdGhleSBhcHBlYXIgaGVyZS5cbiAqIFRoZXkgY2FuIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICoge1xuICogICBsYWJlbDogKHJlcXVpcmVkKSBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBjb250ZXh0IG1lbnUgaXRlbVxuICogICBkZXNjcmlwdGlvbjogKG9wdGlvbmFsKSBBIGRlc2NyaXB0aW9uIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgYnkgdGhlIGVuYWJsZS9kaXNhYmxlIHNldHRpbmdcbiAqICAga2V5bWFwOiAob3B0aW9uYWwpIEEga2V5IGNvbWJpbmF0aW9uIHRvIGFkZCBhcyBhIGRlZmF1bHQga2V5YmluZGluZ1xuICogICBjb25maXJtOiAob3B0aW9uYWwpIElmIHRoZSBjb21tYW5kIHJlcXVpcmVzIGEgY29uZmlybSBkaWFsb2cgeW91IGNhbiBzdXBwbHkgdGhlIGBtZXNzYWdlYCBhbmQgYGRldGFpbGAgcGFyYW1ldGVyc1xuICogICAgIG1lc3NhZ2U6IChyZXF1aXJlZCkgVGhpcyBpcyB0aGUgcXVlc3Rpb24geW91IGFyZSBhc2tpbmcgdGhlIHVzZXIgdG8gY29uZmlybS5cbiAqICAgICBkZXRhaWw6IChvcHRpb25hbCkgVGhpcyBpcyB3aGVyZSB5b3UgY2FuIHByb3ZpZGUgYSBtb3JlIGRldGFpbGVkIGxpc3Qgb2YgdGhlIGNoYW5nZXMuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgY2FuIGJlIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBgZmlsZVBhdGhzYCBwYXJhbWV0ZXIgdGhhdCByZXR1cm5zIGEgc3RyaW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgZnVuY3Rpb24gY2FuIGJlIGFzeW5jaHJvbm91c1xuICogICBjb21tYW5kOiAocmVxdWlyZWQpIFRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24gdG8gcnVuIHdoZW4gdGhlIGNvbW1hbmQgaXMgY2FsbGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycyBgZmlsZVBhdGhzYCBhbmQgYHN0YXR1c0JhcmAuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBmdW5jdGlvbiBzaG91bGQgdWx0aW1hdGVseSByZXNvbHZlIHRvIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIC50aXRsZTogQSB0aXRsZSBmb3IgdGhlIGNvbW1hbmRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIC5tZXNzYWdlOiBBIHN1Y2Nlc3MgbWVzc2FnZSB0byBkaXNwbGF5IHRvIHRoZSB1c2VyXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblx0XCJjb21taXRcIjogY29tbWl0LFxuXHRcImNvbW1pdC1hbGxcIjogY29tbWl0QWxsLFxuXHRcImNvbW1pdC1zdGFnZWRcIjogY29tbWl0U3RhZ2VkLFxuXHRcInN0YWdlLWNoYW5nZXNcIjogc3RhZ2VDaGFuZ2VzLFxuXHRcImFkZC10by1sYXN0LWNvbW1pdFwiOiBhZGRUb0xhc3RDb21taXQsXG5cdFwidW5kby1sYXN0LWNvbW1pdFwiOiB1bmRvTGFzdENvbW1pdCxcblx0XCJkaXNjYXJkLWNoYW5nZXNcIjogZGlzY2FyZENoYW5nZXMsXG5cdFwiZGlzY2FyZC1hbGwtY2hhbmdlc1wiOiBkaXNjYXJkQWxsQ2hhbmdlcyxcblx0XCJpZ25vcmUtY2hhbmdlc1wiOiBpZ25vcmVDaGFuZ2VzLFxuXHRcInVuaWdub3JlLWNoYW5nZXNcIjogdW5pZ25vcmVDaGFuZ2VzLFxuXHRcInN0YXNoLWNoYW5nZXNcIjogc3Rhc2hDaGFuZ2VzLFxuXHRcInVuc3Rhc2gtY2hhbmdlc1wiOiB1bnN0YXNoQ2hhbmdlcyxcblx0XCJmZXRjaFwiOiBmZXRjaCxcblx0XCJmZXRjaC1hbGxcIjogZmV0Y2hBbGwsXG5cdFwicHVsbFwiOiBwdWxsLFxuXHRcInB1bGwtYWxsXCI6IHB1bGxBbGwsXG5cdFwicHVzaFwiOiBwdXNoLFxuXHRcInB1c2gtYWxsXCI6IHB1c2hBbGwsXG5cdFwic3luY1wiOiBzeW5jLFxuXHRcInN5bmMtYWxsXCI6IHN5bmNBbGwsXG5cdFwibWVyZ2UtYnJhbmNoXCI6IG1lcmdlQnJhbmNoLFxuXHRcInN3aXRjaC1icmFuY2hcIjogc3dpdGNoQnJhbmNoLFxuXHRcImNyZWF0ZS1icmFuY2hcIjogY3JlYXRlQnJhbmNoLFxuXHRcImRlbGV0ZS1icmFuY2hcIjogZGVsZXRlQnJhbmNoLFxuXHRcImluaXRcIjogaW5pdCxcblx0XCJsb2dcIjogbG9nLFxuXHRcImRpZmZcIjogZGlmZixcblx0XCJydW4tY29tbWFuZFwiOiBydW5Db21tYW5kLFxuXHRcInJlZnJlc2hcIjogcmVmcmVzaCxcbn07XG4iXX0=