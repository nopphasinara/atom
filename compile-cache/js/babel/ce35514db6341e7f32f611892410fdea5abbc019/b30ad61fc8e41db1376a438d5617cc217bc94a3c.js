Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

exports["default"] = {
	label: "Refresh",
	description: "Refresh Atom",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var title = arguments.length <= 2 || arguments[2] === undefined ? "Refresh" : arguments[2];

		statusBar.show("Refreshing...");
		yield _helper2["default"].refreshAtom();
		return {
			title: title,
			message: "Git Refreshed."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcmVmcmVzaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixXQUFXOzs7O3FCQUVmO0FBQ2QsTUFBSyxFQUFFLFNBQVM7QUFDaEIsWUFBVyxFQUFFLGNBQWM7QUFDM0IsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBcUI7TUFBbkIsS0FBSyx5REFBRyxTQUFTOztBQUNwRCxXQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hDLFFBQU0sb0JBQU8sV0FBVyxFQUFFLENBQUM7QUFDM0IsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxFQUFFLGdCQUFnQjtHQUN6QixDQUFDO0VBQ0YsQ0FBQTtDQUNEIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvcmVmcmVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiUmVmcmVzaFwiLFxuXHRkZXNjcmlwdGlvbjogXCJSZWZyZXNoIEF0b21cIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgdGl0bGUgPSBcIlJlZnJlc2hcIikge1xuXHRcdHN0YXR1c0Jhci5zaG93KFwiUmVmcmVzaGluZy4uLlwiKTtcblx0XHRhd2FpdCBoZWxwZXIucmVmcmVzaEF0b20oKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBcIkdpdCBSZWZyZXNoZWQuXCIsXG5cdFx0fTtcblx0fSxcbn07XG4iXX0=