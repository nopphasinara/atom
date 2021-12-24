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

var _dialogsLogDialog = require("../dialogs/LogDialog");

var _dialogsLogDialog2 = _interopRequireDefault(_dialogsLogDialog);

exports["default"] = {
	label: "Log",
	description: "Show Git Log",
	// eslint-disable-next-line no-unused-vars
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
		var dialog = arguments.length <= 4 || arguments[4] === undefined ? _dialogsLogDialog2["default"] : arguments[4];

		var root = yield _helper2["default"].getRoot(filePaths, git);
		var format = atom.config.get("git-menu.logFormat");
		yield new dialog({ root: root, gitCmd: _gitCmd2["default"], format: format }).activate();
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRW1CLFlBQVk7Ozs7c0JBQ1osV0FBVzs7OztnQ0FDUixzQkFBc0I7Ozs7cUJBRTdCO0FBQ2QsTUFBSyxFQUFFLEtBQUs7QUFDWixZQUFXLEVBQUUsY0FBYzs7QUFFM0IsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBMEQ7TUFBeEQsR0FBRztNQUFXLGFBQWEseURBQUcsSUFBSTtNQUFFLE1BQU07O0FBQzdFLE1BQU0sSUFBSSxHQUFHLE1BQU0sb0JBQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3JELFFBQU0sSUFBSSxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUosSUFBSSxFQUFFLE1BQU0scUJBQUEsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztFQUNwRCxDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9sb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IExvZ0RpYWxvZyBmcm9tIFwiLi4vZGlhbG9ncy9Mb2dEaWFsb2dcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRsYWJlbDogXCJMb2dcIixcblx0ZGVzY3JpcHRpb246IFwiU2hvdyBHaXQgTG9nXCIsXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXHRhc3luYyBjb21tYW5kKGZpbGVQYXRocywgc3RhdHVzQmFyLCBnaXQgPSBnaXRDbWQsIG5vdGlmaWNhdGlvbnMgPSBudWxsLCBkaWFsb2cgPSBMb2dEaWFsb2cpIHtcblx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdGNvbnN0IGZvcm1hdCA9IGF0b20uY29uZmlnLmdldChcImdpdC1tZW51LmxvZ0Zvcm1hdFwiKTtcblx0XHRhd2FpdCBuZXcgZGlhbG9nKHtyb290LCBnaXRDbWQsIGZvcm1hdH0pLmFjdGl2YXRlKCk7XG5cdH0sXG59O1xuIl19