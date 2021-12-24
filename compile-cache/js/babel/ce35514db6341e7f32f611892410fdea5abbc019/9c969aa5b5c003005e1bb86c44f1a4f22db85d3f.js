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

exports["default"] = {
	label: "Diff",
	description: "Open diff in a new file",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var title = arguments.length <= 3 || arguments[3] === undefined ? "Diff" : arguments[3];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		yield _helper2["default"].checkGitLock(root);

		// commit files
		statusBar.show("Diffing...");
		var result = yield git.diff(root, filePaths);

		var textEditor = yield atom.workspace.open("untitled.diff");
		textEditor.setText(result);

		return {
			title: title,
			message: "Diff opened."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvZGlmZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7cUJBRWY7QUFDZCxNQUFLLEVBQUUsTUFBTTtBQUNiLFlBQVcsRUFBRSx5QkFBeUI7QUFDdEMsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBZ0M7TUFBOUIsR0FBRztNQUFXLEtBQUsseURBQUcsTUFBTTs7QUFDL0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxvQkFBTyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFFBQU0sb0JBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHaEMsV0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUUvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlELFlBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNCLFNBQU87QUFDTixRQUFLLEVBQUwsS0FBSztBQUNMLFVBQU8sRUFBRSxjQUFjO0dBQ3ZCLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9kaWZmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRsYWJlbDogXCJEaWZmXCIsXG5cdGRlc2NyaXB0aW9uOiBcIk9wZW4gZGlmZiBpbiBhIG5ldyBmaWxlXCIsXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgdGl0bGUgPSBcIkRpZmZcIikge1xuXHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdChmaWxlUGF0aHMsIGdpdCk7XG5cdFx0YXdhaXQgaGVscGVyLmNoZWNrR2l0TG9jayhyb290KTtcblxuXHRcdC8vIGNvbW1pdCBmaWxlc1xuXHRcdHN0YXR1c0Jhci5zaG93KFwiRGlmZmluZy4uLlwiKTtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBnaXQuZGlmZihyb290LCBmaWxlUGF0aHMpO1xuXG5cdFx0Y29uc3QgdGV4dEVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJ1bnRpdGxlZC5kaWZmXCIpO1xuXHRcdHRleHRFZGl0b3Iuc2V0VGV4dChyZXN1bHQpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0bWVzc2FnZTogXCJEaWZmIG9wZW5lZC5cIixcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==