Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

/** @jsx etch.dom */

var _Dialog2 = require("./Dialog");

var _Dialog3 = _interopRequireDefault(_Dialog2);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _widgetsFileTreeJs = require("../widgets/FileTree.js");

var _widgetsFileTreeJs2 = _interopRequireDefault(_widgetsFileTreeJs);

var CommitDialog = (function (_Dialog) {
	_inherits(CommitDialog, _Dialog);

	function CommitDialog() {
		_classCallCheck(this, CommitDialog);

		_get(Object.getPrototypeOf(CommitDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(CommitDialog, [{
		key: "initialState",
		value: function initialState(props) {
			var state = {
				files: props.files || [],
				message: localStorage.getItem("git-menu.commit-message") || "",
				lastCommit: props.lastCommit || "",
				amend: false,
				push: false,
				sync: false,
				filesSelectable: props.filesSelectable === false ? false : true,
				treeView: props.treeView
			};
			return state;
		}
	}, {
		key: "validate",
		value: function validate(state) {
			var error = false;
			if (!state.message) {
				error = true;
				this.refs.messageInput.classList.add("error");
			}
			if (error) {
				return;
			}

			var files = this.refs.fileTree.getSelectedFiles();

			return [state.message, state.amend, state.push, state.sync, files];
		}
	}, {
		key: "show",
		value: function show() {
			this.refs.messageInput.focus();
		}
	}, {
		key: "messageChange",
		value: function messageChange(e) {
			this.refs.messageInput.classList.remove("error");
			localStorage.setItem("git-menu.commit-message", e.target.value);
			this.update({ message: e.target.value });
		}
	}, {
		key: "amendChange",
		value: function amendChange(e) {
			var message = this.state.message;

			var amend = e.target.checked;
			if (!message && amend) {
				message = this.state.lastCommit;
			} else if (message === this.state.lastCommit && !amend) {
				message = "";
			}
			this.update({ message: message, amend: amend });
		}
	}, {
		key: "pushClick",
		value: function pushClick() {
			this.update({ push: true });
			this.accept();
		}
	}, {
		key: "syncClick",
		value: function syncClick() {
			this.update({ push: true, sync: true });
			this.accept();
		}
	}, {
		key: "body",
		value: function body() {
			var messageTooLong = this.state.message.split("\n").some(function (line, idx) {
				return idx === 0 && line.length > 50 || line.length > 80;
			});
			var lastCommitLines = this.state.lastCommit !== null ? this.state.lastCommit.split("\n") : null;
			var firstLineOfLastCommit = lastCommitLines !== null ? lastCommitLines[0] + (lastCommitLines.length > 1 ? "..." : "") : null;

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(_widgetsFileTreeJs2["default"], { ref: "fileTree", files: this.state.files, showCheckboxes: this.state.filesSelectable, tabIndexStart: "1", treeView: this.state.treeView }),
				_etch2["default"].dom("textarea", { ref: "messageInput", placeholder: "Commit Message", tabIndex: 1001, className: (messageTooLong ? "too-long " : "") + "input-textarea message native-key-bindings", on: { input: this.messageChange }, value: this.state.message }),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: 1002, checked: this.state.amend, on: { change: this.amendChange }, disabled: this.state.lastCommit === null }),
					"Amend Last Commit: ",
					_etch2["default"].dom(
						"span",
						{ className: "last-commit" },
						firstLineOfLastCommit !== null ? firstLineOfLastCommit : ""
					)
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Commit";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-git-commit inline-block-tight", tabIndex: 1003, on: { click: this.accept } },
					"Commit"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-repo-push inline-block-tight", tabIndex: 1004, on: { click: this.pushClick } },
					"Commit & Push"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-sync inline-block-tight", tabIndex: 1005, on: { click: this.syncClick } },
					"Commit & Sync"
				)
			);
		}
	}]);

	return CommitDialog;
})(_Dialog3["default"]);

exports["default"] = CommitDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9Db21taXREaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUltQixVQUFVOzs7O29CQUNaLE1BQU07Ozs7aUNBQ0Ysd0JBQXdCOzs7O0lBRXhCLFlBQVk7V0FBWixZQUFZOztVQUFaLFlBQVk7d0JBQVosWUFBWTs7NkJBQVosWUFBWTs7O2NBQVosWUFBWTs7U0FFcEIsc0JBQUMsS0FBSyxFQUFFO0FBQ25CLE9BQU0sS0FBSyxHQUFHO0FBQ2IsU0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRTtBQUN4QixXQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUU7QUFDOUQsY0FBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNsQyxTQUFLLEVBQUUsS0FBSztBQUNaLFFBQUksRUFBRSxLQUFLO0FBQ1gsUUFBSSxFQUFFLEtBQUs7QUFDWCxtQkFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJO0FBQy9ELFlBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtJQUN4QixDQUFDO0FBQ0YsVUFBTyxLQUFLLENBQUM7R0FDYjs7O1NBRU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2YsT0FBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLE9BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ25CLFNBQUssR0FBRyxJQUFJLENBQUM7QUFDYixRQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDO0FBQ0QsT0FBSSxLQUFLLEVBQUU7QUFDVixXQUFPO0lBQ1A7O0FBRUQsT0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7QUFFcEQsVUFBTyxDQUNOLEtBQUssQ0FBQyxPQUFPLEVBQ2IsS0FBSyxDQUFDLEtBQUssRUFDWCxLQUFLLENBQUMsSUFBSSxFQUNWLEtBQUssQ0FBQyxJQUFJLEVBQ1YsS0FBSyxDQUNMLENBQUM7R0FDRjs7O1NBRUcsZ0JBQUc7QUFDTixPQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUMvQjs7O1NBRVksdUJBQUMsQ0FBQyxFQUFFO0FBQ2hCLE9BQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakQsZUFBWSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLE9BQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO0dBQ3ZDOzs7U0FFVSxxQkFBQyxDQUFDLEVBQUU7T0FDVCxPQUFPLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBckIsT0FBTzs7QUFDWixPQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMvQixPQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssRUFBRTtBQUN0QixXQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDaEMsTUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN2RCxXQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2I7QUFDRCxPQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFDLENBQUMsQ0FBQztHQUM5Qjs7O1NBRVEscUJBQUc7QUFDWCxPQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDMUIsT0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Q7OztTQUVRLHFCQUFHO0FBQ1gsT0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDdEMsT0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Q7OztTQUVHLGdCQUFHO0FBQ04sT0FBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHO1dBQU0sQUFBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRTtJQUFDLENBQUMsQ0FBQztBQUNqSSxPQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNsRyxPQUFNLHFCQUFxQixHQUFHLGVBQWUsS0FBSyxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUEsQUFBQyxHQUFHLElBQUksQ0FBQzs7QUFFL0gsVUFDQzs7O0lBQ0Msd0RBQVUsR0FBRyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUMsRUFBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEFBQUMsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxHQUFHO0lBQ2pKLG9DQUFVLEdBQUcsRUFBQyxjQUFjLEVBQUMsV0FBVyxFQUFDLGdCQUFnQixFQUFDLFFBQVEsRUFBRSxJQUFJLEFBQUMsRUFBQyxTQUFTLEdBQUssY0FBYyxHQUFHLFdBQVcsR0FBRyxFQUFFLENBQUEsK0NBQTZDLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUMsQUFBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQyxHQUFHO0lBQ3JPOztPQUFPLFNBQVMsRUFBQyw0QkFBNEI7S0FDNUMsaUNBQU8sU0FBUyxFQUFDLG9DQUFvQyxFQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFFLElBQUksQUFBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQUFBQyxFQUFDLEVBQUUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFDLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssSUFBSSxBQUFDLEdBQUc7O0tBQzFLOztRQUFNLFNBQVMsRUFBQyxhQUFhO01BQUUscUJBQXFCLEtBQUssSUFBSSxHQUFHLHFCQUFxQixHQUFHLEVBQUU7TUFBUTtLQUM5RztJQUNILENBQ0w7R0FDRjs7O1NBRUksaUJBQUc7QUFDUCxVQUFPLFFBQVEsQ0FBQztHQUNoQjs7O1NBRU0sbUJBQUc7QUFDVCxVQUNDOzs7SUFDQzs7T0FBUSxTQUFTLEVBQUMsaUVBQWlFLEVBQUMsUUFBUSxFQUFFLElBQUksQUFBQyxFQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLEFBQUM7O0tBRXBIO0lBQ1Q7O09BQVEsU0FBUyxFQUFDLGdFQUFnRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEFBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBQyxBQUFDOztLQUV0SDtJQUNUOztPQUFRLFNBQVMsRUFBQywyREFBMkQsRUFBQyxRQUFRLEVBQUUsSUFBSSxBQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQUFBQzs7S0FFakg7SUFDSixDQUNMO0dBQ0Y7OztRQXZHbUIsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi9kaWFsb2dzL0NvbW1pdERpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi9EaWFsb2dcIjtcbmltcG9ydCBldGNoIGZyb20gXCJldGNoXCI7XG5pbXBvcnQgRmlsZVRyZWUgZnJvbSBcIi4uL3dpZGdldHMvRmlsZVRyZWUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0RGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuXHRpbml0aWFsU3RhdGUocHJvcHMpIHtcblx0XHRjb25zdCBzdGF0ZSA9IHtcblx0XHRcdGZpbGVzOiBwcm9wcy5maWxlcyB8fCBbXSxcblx0XHRcdG1lc3NhZ2U6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2l0LW1lbnUuY29tbWl0LW1lc3NhZ2VcIikgfHwgXCJcIixcblx0XHRcdGxhc3RDb21taXQ6IHByb3BzLmxhc3RDb21taXQgfHwgXCJcIixcblx0XHRcdGFtZW5kOiBmYWxzZSxcblx0XHRcdHB1c2g6IGZhbHNlLFxuXHRcdFx0c3luYzogZmFsc2UsXG5cdFx0XHRmaWxlc1NlbGVjdGFibGU6IHByb3BzLmZpbGVzU2VsZWN0YWJsZSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUsXG5cdFx0XHR0cmVlVmlldzogcHJvcHMudHJlZVZpZXcsXG5cdFx0fTtcblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHR2YWxpZGF0ZShzdGF0ZSkge1xuXHRcdGxldCBlcnJvciA9IGZhbHNlO1xuXHRcdGlmICghc3RhdGUubWVzc2FnZSkge1xuXHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdFx0dGhpcy5yZWZzLm1lc3NhZ2VJbnB1dC5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XG5cdFx0fVxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbGVzID0gdGhpcy5yZWZzLmZpbGVUcmVlLmdldFNlbGVjdGVkRmlsZXMoKTtcblxuXHRcdHJldHVybiBbXG5cdFx0XHRzdGF0ZS5tZXNzYWdlLFxuXHRcdFx0c3RhdGUuYW1lbmQsXG5cdFx0XHRzdGF0ZS5wdXNoLFxuXHRcdFx0c3RhdGUuc3luYyxcblx0XHRcdGZpbGVzLFxuXHRcdF07XG5cdH1cblxuXHRzaG93KCkge1xuXHRcdHRoaXMucmVmcy5tZXNzYWdlSW5wdXQuZm9jdXMoKTtcblx0fVxuXG5cdG1lc3NhZ2VDaGFuZ2UoZSkge1xuXHRcdHRoaXMucmVmcy5tZXNzYWdlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2l0LW1lbnUuY29tbWl0LW1lc3NhZ2VcIiwgZS50YXJnZXQudmFsdWUpO1xuXHRcdHRoaXMudXBkYXRlKHttZXNzYWdlOiBlLnRhcmdldC52YWx1ZX0pO1xuXHR9XG5cblx0YW1lbmRDaGFuZ2UoZSkge1xuXHRcdGxldCB7bWVzc2FnZX0gPSB0aGlzLnN0YXRlO1xuXHRcdGNvbnN0IGFtZW5kID0gZS50YXJnZXQuY2hlY2tlZDtcblx0XHRpZiAoIW1lc3NhZ2UgJiYgYW1lbmQpIHtcblx0XHRcdG1lc3NhZ2UgPSB0aGlzLnN0YXRlLmxhc3RDb21taXQ7XG5cdFx0fSBlbHNlIGlmIChtZXNzYWdlID09PSB0aGlzLnN0YXRlLmxhc3RDb21taXQgJiYgIWFtZW5kKSB7XG5cdFx0XHRtZXNzYWdlID0gXCJcIjtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGUoe21lc3NhZ2UsIGFtZW5kfSk7XG5cdH1cblxuXHRwdXNoQ2xpY2soKSB7XG5cdFx0dGhpcy51cGRhdGUoe3B1c2g6IHRydWV9KTtcblx0XHR0aGlzLmFjY2VwdCgpO1xuXHR9XG5cblx0c3luY0NsaWNrKCkge1xuXHRcdHRoaXMudXBkYXRlKHtwdXNoOiB0cnVlLCBzeW5jOiB0cnVlfSk7XG5cdFx0dGhpcy5hY2NlcHQoKTtcblx0fVxuXG5cdGJvZHkoKSB7XG5cdFx0Y29uc3QgbWVzc2FnZVRvb0xvbmcgPSB0aGlzLnN0YXRlLm1lc3NhZ2Uuc3BsaXQoXCJcXG5cIikuc29tZSgobGluZSwgaWR4KSA9PiAoKGlkeCA9PT0gMCAmJiBsaW5lLmxlbmd0aCA+IDUwKSB8fCBsaW5lLmxlbmd0aCA+IDgwKSk7XG5cdFx0Y29uc3QgbGFzdENvbW1pdExpbmVzID0gdGhpcy5zdGF0ZS5sYXN0Q29tbWl0ICE9PSBudWxsID8gdGhpcy5zdGF0ZS5sYXN0Q29tbWl0LnNwbGl0KFwiXFxuXCIpIDogbnVsbDtcblx0XHRjb25zdCBmaXJzdExpbmVPZkxhc3RDb21taXQgPSBsYXN0Q29tbWl0TGluZXMgIT09IG51bGwgPyBsYXN0Q29tbWl0TGluZXNbMF0gKyAobGFzdENvbW1pdExpbmVzLmxlbmd0aCA+IDEgPyBcIi4uLlwiIDogXCJcIikgOiBudWxsO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxGaWxlVHJlZSByZWY9XCJmaWxlVHJlZVwiIGZpbGVzPXt0aGlzLnN0YXRlLmZpbGVzfSBzaG93Q2hlY2tib3hlcz17dGhpcy5zdGF0ZS5maWxlc1NlbGVjdGFibGV9IHRhYkluZGV4U3RhcnQ9XCIxXCIgdHJlZVZpZXc9e3RoaXMuc3RhdGUudHJlZVZpZXd9IC8+XG5cdFx0XHRcdDx0ZXh0YXJlYSByZWY9XCJtZXNzYWdlSW5wdXRcIiBwbGFjZWhvbGRlcj1cIkNvbW1pdCBNZXNzYWdlXCIgdGFiSW5kZXg9ezEwMDF9IGNsYXNzTmFtZT17YCR7bWVzc2FnZVRvb0xvbmcgPyBcInRvby1sb25nIFwiIDogXCJcIn1pbnB1dC10ZXh0YXJlYSBtZXNzYWdlIG5hdGl2ZS1rZXktYmluZGluZ3NgfSBvbj17e2lucHV0OiB0aGlzLm1lc3NhZ2VDaGFuZ2V9fSB2YWx1ZT17dGhpcy5zdGF0ZS5tZXNzYWdlfSAvPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWwgY2hlY2tib3gtbGFiZWxcIj5cblx0XHRcdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1jaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIHRhYkluZGV4PXsxMDAyfSBjaGVja2VkPXt0aGlzLnN0YXRlLmFtZW5kfSBvbj17e2NoYW5nZTogdGhpcy5hbWVuZENoYW5nZX19IGRpc2FibGVkPXt0aGlzLnN0YXRlLmxhc3RDb21taXQgPT09IG51bGx9IC8+XG5cdFx0XHRcdFx0QW1lbmQgTGFzdCBDb21taXQ6IDxzcGFuIGNsYXNzTmFtZT1cImxhc3QtY29tbWl0XCI+e2ZpcnN0TGluZU9mTGFzdENvbW1pdCAhPT0gbnVsbCA/IGZpcnN0TGluZU9mTGFzdENvbW1pdCA6IFwiXCJ9PC9zcGFuPlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG5cdHRpdGxlKCkge1xuXHRcdHJldHVybiBcIkNvbW1pdFwiO1xuXHR9XG5cblx0YnV0dG9ucygpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGJ0biBpY29uIGljb24tZ2l0LWNvbW1pdCBpbmxpbmUtYmxvY2stdGlnaHRcIiB0YWJJbmRleD17MTAwM30gb249e3tjbGljazogdGhpcy5hY2NlcHR9fT5cblx0XHRcdFx0XHRDb21taXRcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBidG4gaWNvbiBpY29uLXJlcG8tcHVzaCBpbmxpbmUtYmxvY2stdGlnaHRcIiB0YWJJbmRleD17MTAwNH0gb249e3tjbGljazogdGhpcy5wdXNoQ2xpY2t9fT5cblx0XHRcdFx0XHRDb21taXQgJiBQdXNoXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgYnRuIGljb24gaWNvbi1zeW5jIGlubGluZS1ibG9jay10aWdodFwiIHRhYkluZGV4PXsxMDA1fSBvbj17e2NsaWNrOiB0aGlzLnN5bmNDbGlja319PlxuXHRcdFx0XHRcdENvbW1pdCAmIFN5bmNcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG4iXX0=