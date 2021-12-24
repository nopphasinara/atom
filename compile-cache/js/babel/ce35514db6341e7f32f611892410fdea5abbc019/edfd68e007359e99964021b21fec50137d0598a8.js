Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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
	label: "Add To Last Commit",
	description: "Amend the last commit with the changes",
	confirm: {
		message: "Are you sure you want to add these changes to the last commit?",
		detail: _asyncToGenerator(function* (filePaths) {
			var git = arguments.length <= 1 || arguments[1] === undefined ? _gitCmd2["default"] : arguments[1];

			var root = yield _helper2["default"].getRoot(filePaths, git);
			var lastCommit = yield git.lastCommit(root);
			return "You are adding these files:\n" + filePaths.join("\n") + "\n\nTo this commit:\n" + lastCommit;
		})
	},
	command: _asyncToGenerator(function* (filePaths, statusBar) {
		var git = arguments.length <= 2 || arguments[2] === undefined ? _gitCmd2["default"] : arguments[2];
		var notifications = arguments.length <= 3 || arguments[3] === undefined ? _Notifications2["default"] : arguments[3];
		var title = arguments.length <= 4 || arguments[4] === undefined ? "Add To Last Commit" : arguments[4];

		var _ref = yield _helper2["default"].getRootAndFiles(filePaths, git);

		var _ref2 = _slicedToArray(_ref, 2);

		var files = _ref2[0];
		var root = _ref2[1];

		yield _helper2["default"].checkGitLock(root);
		var lastCommit = yield git.lastCommit(root);

		if (lastCommit === null) {
			throw "No commits yet";
		}

		// commit files
		statusBar.show("Committing...");
		var numFiles = files.length + " File" + (files.length !== 1 ? "s" : "");
		var results = [];
		results.push((yield git.unstage(root)));
		results.push((yield git.add(root, filePaths)));
		results.push((yield git.commit(root, lastCommit, true, filePaths)));
		notifications.addGit(title, results);
		_helper2["default"].refreshAtom(root);
		return {
			title: title,
			message: numFiles + " committed."
		};
	})
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29tbWFuZHMvYWRkLXRvLWxhc3QtY29tbWl0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFbUIsWUFBWTs7OztzQkFDWixXQUFXOzs7OzZCQUNKLGtCQUFrQjs7OztxQkFFN0I7QUFDZCxNQUFLLEVBQUUsb0JBQW9CO0FBQzNCLFlBQVcsRUFBRSx3Q0FBd0M7QUFDckQsUUFBTyxFQUFFO0FBQ1IsU0FBTyxFQUFFLGdFQUFnRTtBQUN6RSxRQUFNLG9CQUFFLFdBQU8sU0FBUyxFQUFtQjtPQUFqQixHQUFHOztBQUM1QixPQUFNLElBQUksR0FBRyxNQUFNLG9CQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsT0FBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLDRDQUF1QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBd0IsVUFBVSxDQUFHO0dBQ2hHLENBQUE7RUFDRDtBQUNELEFBQU0sUUFBTyxvQkFBQSxXQUFDLFNBQVMsRUFBRSxTQUFTLEVBQTZFO01BQTNFLEdBQUc7TUFBVyxhQUFhO01BQWtCLEtBQUsseURBQUcsb0JBQW9COzthQUN0RixNQUFNLG9CQUFPLGVBQWUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDOzs7O01BQTNELEtBQUs7TUFBRSxJQUFJOztBQUNsQixRQUFNLG9CQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlDLE1BQUksVUFBVSxLQUFLLElBQUksRUFBRTtBQUN4QixTQUFNLGdCQUFnQixDQUFDO0dBQ3ZCOzs7QUFHRCxXQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sUUFBUSxHQUFNLEtBQUssQ0FBQyxNQUFNLGNBQVEsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUM7QUFDeEUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFNBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUN0QyxTQUFPLENBQUMsSUFBSSxFQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQzdDLFNBQU8sQ0FBQyxJQUFJLEVBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNsRSxlQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxzQkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsU0FBTztBQUNOLFFBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTyxFQUFLLFFBQVEsZ0JBQWE7R0FDakMsQ0FBQztFQUNGLENBQUE7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbW1hbmRzL2FkZC10by1sYXN0LWNvbW1pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGdpdENtZCBmcm9tIFwiLi4vZ2l0LWNtZFwiO1xuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi4vaGVscGVyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGxhYmVsOiBcIkFkZCBUbyBMYXN0IENvbW1pdFwiLFxuXHRkZXNjcmlwdGlvbjogXCJBbWVuZCB0aGUgbGFzdCBjb21taXQgd2l0aCB0aGUgY2hhbmdlc1wiLFxuXHRjb25maXJtOiB7XG5cdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gYWRkIHRoZXNlIGNoYW5nZXMgdG8gdGhlIGxhc3QgY29tbWl0P1wiLFxuXHRcdGRldGFpbDogYXN5bmMgKGZpbGVQYXRocywgZ2l0ID0gZ2l0Q21kKSA9PiB7XG5cdFx0XHRjb25zdCByb290ID0gYXdhaXQgaGVscGVyLmdldFJvb3QoZmlsZVBhdGhzLCBnaXQpO1xuXHRcdFx0Y29uc3QgbGFzdENvbW1pdCA9IGF3YWl0IGdpdC5sYXN0Q29tbWl0KHJvb3QpO1xuXHRcdFx0cmV0dXJuIGBZb3UgYXJlIGFkZGluZyB0aGVzZSBmaWxlczpcXG4ke2ZpbGVQYXRocy5qb2luKFwiXFxuXCIpfVxcblxcblRvIHRoaXMgY29tbWl0OlxcbiR7bGFzdENvbW1pdH1gO1xuXHRcdH0sXG5cdH0sXG5cdGFzeW5jIGNvbW1hbmQoZmlsZVBhdGhzLCBzdGF0dXNCYXIsIGdpdCA9IGdpdENtZCwgbm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnMsIHRpdGxlID0gXCJBZGQgVG8gTGFzdCBDb21taXRcIikge1xuXHRcdGNvbnN0IFtmaWxlcywgcm9vdF0gPSBhd2FpdCBoZWxwZXIuZ2V0Um9vdEFuZEZpbGVzKGZpbGVQYXRocywgZ2l0KTtcblx0XHRhd2FpdCBoZWxwZXIuY2hlY2tHaXRMb2NrKHJvb3QpO1xuXHRcdGNvbnN0IGxhc3RDb21taXQgPSBhd2FpdCBnaXQubGFzdENvbW1pdChyb290KTtcblxuXHRcdGlmIChsYXN0Q29tbWl0ID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBcIk5vIGNvbW1pdHMgeWV0XCI7XG5cdFx0fVxuXG5cdFx0Ly8gY29tbWl0IGZpbGVzXG5cdFx0c3RhdHVzQmFyLnNob3coXCJDb21taXR0aW5nLi4uXCIpO1xuXHRcdGNvbnN0IG51bUZpbGVzID0gYCR7ZmlsZXMubGVuZ3RofSBGaWxlJHtmaWxlcy5sZW5ndGggIT09IDEgPyBcInNcIiA6IFwiXCJ9YDtcblx0XHRjb25zdCByZXN1bHRzID0gW107XG5cdFx0cmVzdWx0cy5wdXNoKGF3YWl0IGdpdC51bnN0YWdlKHJvb3QpKTtcblx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmFkZChyb290LCBmaWxlUGF0aHMpKTtcblx0XHRyZXN1bHRzLnB1c2goYXdhaXQgZ2l0LmNvbW1pdChyb290LCBsYXN0Q29tbWl0LCB0cnVlLCBmaWxlUGF0aHMpKTtcblx0XHRub3RpZmljYXRpb25zLmFkZEdpdCh0aXRsZSwgcmVzdWx0cyk7XG5cdFx0aGVscGVyLnJlZnJlc2hBdG9tKHJvb3QpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aXRsZSxcblx0XHRcdG1lc3NhZ2U6IGAke251bUZpbGVzfSBjb21taXR0ZWQuYCxcblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==