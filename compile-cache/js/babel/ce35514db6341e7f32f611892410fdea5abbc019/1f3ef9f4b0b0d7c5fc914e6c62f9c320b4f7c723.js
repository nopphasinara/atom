Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

exports["default"] = {
	label: "Stash Changes",
	description: "Stash and remove the current changes",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var unstash = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
		var title = arguments.length <= 5 || arguments[5] === undefined ? "Stash Changes" : arguments[5];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);
		statusBar.show((unstash ? "Uns" : "S") + "tashing Changes...", null);
		var result = yield git.stash(root, unstash);
		notifications.addGit(title, result);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: "Changes " + (unstash ? "un" : "") + "stashed."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvc3Rhc2gtY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7NkJBQ0osa0JBQWtCOzs7O3FCQUU3QjtBQUNkLE1BQUssRUFBRSxlQUFlO0FBQ3RCLFlBQVcsRUFBRSxzQ0FBc0M7QUFDbkQsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBeUY7TUFBdkYsR0FBRztNQUFXLGFBQWE7TUFBa0IsT0FBTyx5REFBRyxLQUFLO01BQUUsS0FBSyx5REFBRyxlQUFlOztBQUN4SCxNQUFNLElBQUksR0FBRyxNQUFNLG9CQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsUUFBTSxvQkFBTyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsV0FBUyxDQUFDLElBQUksRUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQSx5QkFBc0IsSUFBSSxDQUFDLENBQUM7QUFDbkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM5QyxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxnQkFBYSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQSxhQUFVO0dBQ2pELENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9zdGFzaC1jaGFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiU3Rhc2ggQ2hhbmdlc1wiLFxuXHRkZXNjcmlwdGlvbjogXCJTdGFzaCBhbmQgcmVtb3ZlIHRoZSBjdXJyZW50IGNoYW5nZXNcIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdW5zdGFzaCA9IGZhbHNlLCB0aXRsZSA9IFwiU3Rhc2ggQ2hhbmdlc1wiKSB7XG5cdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGhlbHBlci5nZXRSb290KGZpbGVQYXRocywgZ2l0KTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdHN0YXR1c0Jhci5zaG93KGAke3Vuc3Rhc2ggPyBcIlVuc1wiIDogXCJTXCJ9dGFzaGluZyBDaGFuZ2VzLi4uYCwgbnVsbCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZ2l0LnN0YXNoKHJvb3QsIHVuc3Rhc2gpO1xuXHRcdG5vdGlmaWNhdGlvbnMuYWRkR2l0KHRpdGxlLCByZXN1bHQpO1xuXHRcdGhlbHBlci5yZWZyZXNoQXRvbShyb290KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBgQ2hhbmdlcyAke3Vuc3Rhc2ggPyBcInVuXCIgOiBcIlwifXN0YXNoZWQuYCxcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==