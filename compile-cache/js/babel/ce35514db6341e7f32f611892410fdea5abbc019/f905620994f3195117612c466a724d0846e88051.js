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

var _push = require("./push");

exports["default"] = {
	label: "Sync",
	description: "Pull then push from upstream",
	confirm: {
		message: "Are you sure you want to sync with upstream?"
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Sync" : arguments[4];

		yield (0, _pull.command)(filePaths, statusBar, git, notifications);
		yield (0, _push.command)(filePaths, statusBar, git, notifications);
		return {
			title: title,
			message: "Synced"
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7OzZCQUNMLGtCQUFrQjs7OztvQkFDZCxRQUFROztvQkFDUixRQUFROztxQkFFdkI7QUFDZCxNQUFLLEVBQUUsTUFBTTtBQUNiLFlBQVcsRUFBRSw4QkFBOEI7QUFDM0MsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLDhDQUE4QztFQUN2RDtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQStEO01BQTdELEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsTUFBTTs7QUFDOUYsUUFBTSxtQkFBSyxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNyRCxRQUFNLG1CQUFLLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELFNBQU87QUFDTixRQUFLLEVBQUwsS0FBSztBQUNMLFVBQU8sRUFBRSxRQUFRO0dBQ2pCLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9zeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuaW1wb3J0IHtjb21tYW5kIGFzIHB1bGx9IGZyb20gXCIuL3B1bGxcIjtcbmltcG9ydCB7Y29tbWFuZCBhcyBwdXNofSBmcm9tIFwiLi9wdXNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiU3luY1wiLFxuXHRkZXNjcmlwdGlvbjogXCJQdWxsIHRoZW4gcHVzaCBmcm9tIHVwc3RyZWFtXCIsXG5cdGNvbmZpcm06IHtcblx0XHRtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBzeW5jIHdpdGggdXBzdHJlYW0/XCIsXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJTeW5jXCIpIHtcblx0XHRhd2FpdCBwdWxsKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQsIG5vdGlmaWNhdGlvbnMpO1xuXHRcdGF3YWl0IHB1c2goZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCwgbm90aWZpY2F0aW9ucyk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogXCJTeW5jZWRcIixcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==