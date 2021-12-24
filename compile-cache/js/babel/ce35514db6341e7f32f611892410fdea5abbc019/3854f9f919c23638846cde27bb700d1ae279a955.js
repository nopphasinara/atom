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
	label: "Initialize",
	description: "Inizialize a git repo",
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Initialize" : arguments[4];

		var roots = atom.project.getPaths().filter(function (dir) {
			return !!dir && filePaths.some(function (filePath) {
				return filePath.startsWith(dir);
			});
		});
		if (roots.length === 0) {
			throw "No project directory.";
		}

		statusBar.show("Initializing...");
		var results = yield Promise.all(roots.map(function (root) {
			return git.init(root);
		}));
		notifications.addGit(title, results);
		atom.project.setPaths(atom.project.getPaths());
		roots.forEach(function (root) {
			_helper2["default"].refreshAtom(root);
		});
		return {
			title: title,
			message: "Git folder" + (results.length > 1 ? "s" : "") + " initialized."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7NkJBQ0osa0JBQWtCOzs7O3FCQUU3QjtBQUNkLE1BQUssRUFBRSxZQUFZO0FBQ25CLFlBQVcsRUFBRSx1QkFBdUI7QUFDcEMsQUFBTSxRQUFPLG9CQUFBLFdBQUMsU0FBUyxFQUFFLFNBQVMsRUFBcUU7TUFBbkUsR0FBRztNQUFXLGFBQWE7TUFBa0IsS0FBSyx5REFBRyxZQUFZOztBQUNwRyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUc7VUFBSyxDQUFDLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1dBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7SUFBQSxDQUFDO0dBQUMsQ0FBQyxDQUFDO0FBQ3JILE1BQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDdkIsU0FBTSx1QkFBdUIsQ0FBQztHQUM5Qjs7QUFFRCxXQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO1VBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7R0FBQSxDQUFDLENBQUMsQ0FBQztBQUNyRSxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxNQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0MsT0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNyQix1QkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDekIsQ0FBQyxDQUFDO0FBQ0gsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxrQkFBZSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLGtCQUFlO0dBQ2xFLENBQUM7RUFDRixDQUFBO0NBQ0QiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9jb21tYW5kcy9pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuLi9oZWxwZXJcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0bGFiZWw6IFwiSW5pdGlhbGl6ZVwiLFxuXHRkZXNjcmlwdGlvbjogXCJJbml6aWFsaXplIGEgZ2l0IHJlcG9cIixcblx0YXN5bmMgY29tbWFuZChmaWxlUGF0aHMsIHN0YXR1c0JhciwgZ2l0ID0gZ2l0Q21kLCBub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucywgdGl0bGUgPSBcIkluaXRpYWxpemVcIikge1xuXHRcdGNvbnN0IHJvb3RzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuZmlsdGVyKGRpciA9PiAoISFkaXIgJiYgZmlsZVBhdGhzLnNvbWUoZmlsZVBhdGggPT4gZmlsZVBhdGguc3RhcnRzV2l0aChkaXIpKSkpO1xuXHRcdGlmIChyb290cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHRocm93IFwiTm8gcHJvamVjdCBkaXJlY3RvcnkuXCI7XG5cdFx0fVxuXG5cdFx0c3RhdHVzQmFyLnNob3coXCJJbml0aWFsaXppbmcuLi5cIik7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHJvb3RzLm1hcChyb290ID0+IGdpdC5pbml0KHJvb3QpKSk7XG5cdFx0bm90aWZpY2F0aW9ucy5hZGRHaXQodGl0bGUsIHJlc3VsdHMpO1xuXHRcdGF0b20ucHJvamVjdC5zZXRQYXRocyhhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSk7XG5cdFx0cm9vdHMuZm9yRWFjaChyb290ID0+IHtcblx0XHRcdGhlbHBlci5yZWZyZXNoQXRvbShyb290KTtcblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRtZXNzYWdlOiBgR2l0IGZvbGRlciR7cmVzdWx0cy5sZW5ndGggPiAxID8gXCJzXCIgOiBcIlwifSBpbml0aWFsaXplZC5gLFxuXHRcdH07XG5cdH0sXG59O1xuIl19