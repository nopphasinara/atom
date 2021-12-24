Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

/** @jsx etch.dom */

var _gitCmd = require("../git-cmd");

var _gitCmd2 = _interopRequireDefault(_gitCmd);

var _Dialog2 = require("./Dialog");

var _Dialog3 = _interopRequireDefault(_Dialog2);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var CreateBranchDialog = (function (_Dialog) {
	_inherits(CreateBranchDialog, _Dialog);

	function CreateBranchDialog() {
		_classCallCheck(this, CreateBranchDialog);

		_get(Object.getPrototypeOf(CreateBranchDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(CreateBranchDialog, [{
		key: "initialState",
		value: function initialState(props) {
			if (!props.root) {
				throw new Error("Must specify a {root} property");
			}

			this.git = props.git || _gitCmd2["default"];
			this.notifications = props.notifications || _Notifications2["default"];

			var state = {
				branches: props.branches || [],
				sourceBranch: "",
				newBranch: "",
				track: false,
				root: props.root,
				fetching: false
			};

			var branch = state.branches.find(function (b) {
				return b.selected;
			});
			state.sourceBranch = branch ? branch.name : "";

			return state;
		}
	}, {
		key: "validate",
		value: function validate(state) {
			var error = false;
			if (!state.newBranch) {
				error = true;
				this.refs.newBranchInput.classList.add("error");
			}
			if (!state.sourceBranch) {
				error = true;
				this.refs.sourceBranchInput.classList.add("error");
			}
			if (error) {
				return;
			}
			var newBranch = this.removeIllegalChars(state.newBranch);

			return [state.sourceBranch, newBranch, state.track];
		}
	}, {
		key: "show",
		value: function show() {
			this.refs.newBranchInput.focus();
		}
	}, {
		key: "fetch",
		value: _asyncToGenerator(function* () {
			this.update({ fetching: true });
			try {
				yield this.git.fetch(this.state.root);
				var branches = yield this.git.branches(this.state.root);
				this.update({ branches: branches, fetching: false });
			} catch (err) {
				this.notifications.addError("Fetch", err);
				this.update({ fetching: false });
			}
		})
	}, {
		key: "sourceBranchChange",
		value: function sourceBranchChange(e) {
			this.refs.sourceBranchInput.classList.remove("error");
			this.update({ sourceBranch: e.target.value });
		}
	}, {
		key: "newBranchChange",
		value: function newBranchChange(e) {
			this.refs.newBranchInput.classList.remove("error");
			this.update({ newBranch: e.target.value });
		}
	}, {
		key: "trackChange",
		value: function trackChange(e) {
			this.update({ track: e.target.checked });
		}
	}, {
		key: "removeIllegalChars",
		value: function removeIllegalChars(branchName) {
			// from https://www.kernel.org/pub/software/scm/git/docs/git-check-ref-format.html#_description
			// eslint-disable-next-line no-control-regex
			return branchName.replace(/^[./]|[./]$|^@$|[\s~^:[\\?*\x00-\x20\x7F]/g, "-").replace(/\.\.|@{/g, "--");
		}
	}, {
		key: "body",
		value: function body() {
			var _this = this;

			var branchOptions = this.state.fetching ? _etch2["default"].dom(
				"option",
				null,
				"Fetching..."
			) : this.state.branches.map(function (branch) {
				return _etch2["default"].dom(
					"option",
					{ value: branch.name, selected: branch.name === _this.state.sourceBranch },
					branch.branch
				);
			});

			var actualName = this.removeIllegalChars(this.state.newBranch);

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"New Branch",
					_etch2["default"].dom("input", { type: "text", ref: "newBranchInput", tabIndex: "1", className: "native-key-bindings input-text", value: this.state.newBranch, on: { input: this.newBranchChange } })
				),
				_etch2["default"].dom(
					"div",
					{ className: "actual-name" },
					this.state.newBranch !== actualName ? "Will be created as " + actualName : ""
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"Source Branch",
					_etch2["default"].dom(
						"select",
						{ ref: "sourceBranchInput", tabIndex: "2", className: "native-key-bindings input-select", value: this.state.sourceBranch, disabled: this.state.fetching, on: { change: this.sourceBranchChange } },
						branchOptions
					)
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "3", checked: this.state.track, on: { change: this.trackChange } }),
					"Track ",
					this.state.newBranch ? "origin/" + actualName : ""
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Create Branch";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-git-branch inline-block-tight", tabIndex: "4", on: { click: this.accept }, disabled: this.state.fetching },
					"Create Branch"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-repo-sync inline-block-tight", tabIndex: "5", on: { click: this.fetch }, disabled: this.state.fetching },
					"Fetch"
				)
			);
		}
	}]);

	return CreateBranchDialog;
})(_Dialog3["default"]);

exports["default"] = CreateBranchDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9DcmVhdGVCcmFuY2hEaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBSW1CLFlBQVk7Ozs7dUJBQ1osVUFBVTs7OztvQkFDWixNQUFNOzs7OzZCQUNHLGtCQUFrQjs7OztJQUV2QixrQkFBa0I7V0FBbEIsa0JBQWtCOztVQUFsQixrQkFBa0I7d0JBQWxCLGtCQUFrQjs7NkJBQWxCLGtCQUFrQjs7O2NBQWxCLGtCQUFrQjs7U0FFMUIsc0JBQUMsS0FBSyxFQUFFO0FBQ25CLE9BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNsRDs7QUFFRCxPQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLHVCQUFVLENBQUM7QUFDL0IsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSw4QkFBaUIsQ0FBQzs7QUFFMUQsT0FBTSxLQUFLLEdBQUc7QUFDYixZQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFO0FBQzlCLGdCQUFZLEVBQUUsRUFBRTtBQUNoQixhQUFTLEVBQUUsRUFBRTtBQUNiLFNBQUssRUFBRSxLQUFLO0FBQ1osUUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLFlBQVEsRUFBRSxLQUFLO0lBQ2YsQ0FBQzs7QUFFRixPQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsUUFBUTtJQUFBLENBQUMsQ0FBQztBQUNwRCxRQUFLLENBQUMsWUFBWSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFL0MsVUFBTyxLQUFLLENBQUM7R0FDYjs7O1NBRU8sa0JBQUMsS0FB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QUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBQyxBQUFDLEdBQUc7O0tBQ3pJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxlQUFhLFVBQVUsR0FBSyxFQUFFO0tBQ2xEO0lBQ0gsQ0FDTDtHQUNGOzs7U0FFSSxpQkFBRztBQUNQLFVBQU8sZUFBZSxDQUFDO0dBQ3ZCOzs7U0FFTSxtQkFBRztBQUNULFVBQ0M7OztJQUNDOztPQUFRLFNBQVMsRUFBQyxpRUFBaUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEFBQUM7O0tBRWhKO0lBQ1Q7O09BQVEsU0FBUyxFQUFDLGdFQUFnRSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQzs7S0FFOUk7SUFDSixDQUNMO0dBQ0Y7OztRQTVIbUIsa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2RpYWxvZ3MvQ3JlYXRlQnJhbmNoRGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZ2l0Q21kIGZyb20gXCIuLi9naXQtY21kXCI7XG5pbXBvcnQgRGlhbG9nIGZyb20gXCIuL0RpYWxvZ1wiO1xuaW1wb3J0IGV0Y2ggZnJvbSBcImV0Y2hcIjtcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gXCIuLi9Ob3RpZmljYXRpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUJyYW5jaERpYWxvZyBleHRlbmRzIERpYWxvZyB7XG5cblx0aW5pdGlhbFN0YXRlKHByb3BzKSB7XG5cdFx0aWYgKCFwcm9wcy5yb290KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IHNwZWNpZnkgYSB7cm9vdH0gcHJvcGVydHlcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5naXQgPSBwcm9wcy5naXQgfHwgZ2l0Q21kO1xuXHRcdHRoaXMubm90aWZpY2F0aW9ucyA9IHByb3BzLm5vdGlmaWNhdGlvbnMgfHwgTm90aWZpY2F0aW9ucztcblxuXHRcdGNvbnN0IHN0YXRlID0ge1xuXHRcdFx0YnJhbmNoZXM6IHByb3BzLmJyYW5jaGVzIHx8IFtdLFxuXHRcdFx0c291cmNlQnJhbmNoOiBcIlwiLFxuXHRcdFx0bmV3QnJhbmNoOiBcIlwiLFxuXHRcdFx0dHJhY2s6IGZhbHNlLFxuXHRcdFx0cm9vdDogcHJvcHMucm9vdCxcblx0XHRcdGZldGNoaW5nOiBmYWxzZSxcblx0XHR9O1xuXG5cdFx0Y29uc3QgYnJhbmNoID0gc3RhdGUuYnJhbmNoZXMuZmluZChiID0+IGIuc2VsZWN0ZWQpO1xuXHRcdHN0YXRlLnNvdXJjZUJyYW5jaCA9IGJyYW5jaCA/IGJyYW5jaC5uYW1lIDogXCJcIjtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdHZhbGlkYXRlKHN0YXRlKSB7XG5cdFx0bGV0IGVycm9yID0gZmFsc2U7XG5cdFx0aWYgKCFzdGF0ZS5uZXdCcmFuY2gpIHtcblx0XHRcdGVycm9yID0gdHJ1ZTtcblx0XHRcdHRoaXMucmVmcy5uZXdCcmFuY2hJbnB1dC5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XG5cdFx0fVxuXHRcdGlmICghc3RhdGUuc291cmNlQnJhbmNoKSB7XG5cdFx0XHRlcnJvciA9IHRydWU7XG5cdFx0XHR0aGlzLnJlZnMuc291cmNlQnJhbmNoSW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xuXHRcdH1cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgbmV3QnJhbmNoID0gdGhpcy5yZW1vdmVJbGxlZ2FsQ2hhcnMoc3RhdGUubmV3QnJhbmNoKTtcblxuXHRcdHJldHVybiBbc3RhdGUuc291cmNlQnJhbmNoLCBuZXdCcmFuY2gsIHN0YXRlLnRyYWNrXTtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0dGhpcy5yZWZzLm5ld0JyYW5jaElucHV0LmZvY3VzKCk7XG5cdH1cblxuXHRhc3luYyBmZXRjaCgpIHtcblx0XHR0aGlzLnVwZGF0ZSh7ZmV0Y2hpbmc6IHRydWV9KTtcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgdGhpcy5naXQuZmV0Y2godGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgdGhpcy5naXQuYnJhbmNoZXModGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdHRoaXMudXBkYXRlKHticmFuY2hlczogYnJhbmNoZXMsIGZldGNoaW5nOiBmYWxzZX0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRmV0Y2hcIiwgZXJyKTtcblx0XHRcdHRoaXMudXBkYXRlKHtmZXRjaGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxuXHRzb3VyY2VCcmFuY2hDaGFuZ2UoZSkge1xuXHRcdHRoaXMucmVmcy5zb3VyY2VCcmFuY2hJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0dGhpcy51cGRhdGUoe3NvdXJjZUJyYW5jaDogZS50YXJnZXQudmFsdWV9KTtcblx0fVxuXG5cdG5ld0JyYW5jaENoYW5nZShlKSB7XG5cdFx0dGhpcy5yZWZzLm5ld0JyYW5jaElucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcblx0XHR0aGlzLnVwZGF0ZSh7bmV3QnJhbmNoOiBlLnRhcmdldC52YWx1ZX0pO1xuXHR9XG5cblx0dHJhY2tDaGFuZ2UoZSkge1xuXHRcdHRoaXMudXBkYXRlKHt0cmFjazogZS50YXJnZXQuY2hlY2tlZH0pO1xuXHR9XG5cblx0cmVtb3ZlSWxsZWdhbENoYXJzKGJyYW5jaE5hbWUpIHtcblx0XHQvLyBmcm9tIGh0dHBzOi8vd3d3Lmtlcm5lbC5vcmcvcHViL3NvZnR3YXJlL3NjbS9naXQvZG9jcy9naXQtY2hlY2stcmVmLWZvcm1hdC5odG1sI19kZXNjcmlwdGlvblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250cm9sLXJlZ2V4XG5cdFx0cmV0dXJuIGJyYW5jaE5hbWUucmVwbGFjZSgvXlsuL118Wy4vXSR8XkAkfFtcXHN+XjpbXFxcXD8qXFx4MDAtXFx4MjBcXHg3Rl0vZywgXCItXCIpLnJlcGxhY2UoL1xcLlxcLnxAey9nLCBcIi0tXCIpO1xuXHR9XG5cblx0Ym9keSgpIHtcblx0XHRjb25zdCBicmFuY2hPcHRpb25zID0gdGhpcy5zdGF0ZS5mZXRjaGluZyA/IChcblx0XHRcdDxvcHRpb24+RmV0Y2hpbmcuLi48L29wdGlvbj5cblx0XHQpIDogdGhpcy5zdGF0ZS5icmFuY2hlcy5tYXAoYnJhbmNoID0+IChcblx0XHRcdDxvcHRpb24gdmFsdWU9e2JyYW5jaC5uYW1lfSBzZWxlY3RlZD17YnJhbmNoLm5hbWUgPT09IHRoaXMuc3RhdGUuc291cmNlQnJhbmNofT57YnJhbmNoLmJyYW5jaH08L29wdGlvbj5cblx0XHQpKTtcblxuXHRcdGNvbnN0IGFjdHVhbE5hbWUgPSB0aGlzLnJlbW92ZUlsbGVnYWxDaGFycyh0aGlzLnN0YXRlLm5ld0JyYW5jaCk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0TmV3IEJyYW5jaFxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlZj1cIm5ld0JyYW5jaElucHV0XCIgdGFiSW5kZXg9XCIxXCIgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC10ZXh0XCIgdmFsdWU9e3RoaXMuc3RhdGUubmV3QnJhbmNofSBvbj17e2lucHV0OiB0aGlzLm5ld0JyYW5jaENoYW5nZX19IC8+XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiYWN0dWFsLW5hbWVcIj57dGhpcy5zdGF0ZS5uZXdCcmFuY2ggIT09IGFjdHVhbE5hbWUgPyBgV2lsbCBiZSBjcmVhdGVkIGFzICR7YWN0dWFsTmFtZX1gIDogXCJcIn08L2Rpdj5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0U291cmNlIEJyYW5jaFxuXHRcdFx0XHRcdDxzZWxlY3QgcmVmPVwic291cmNlQnJhbmNoSW5wdXRcIiB0YWJJbmRleD1cIjJcIiBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGlucHV0LXNlbGVjdFwiIHZhbHVlPXt0aGlzLnN0YXRlLnNvdXJjZUJyYW5jaH0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuZmV0Y2hpbmd9IG9uPXt7Y2hhbmdlOiB0aGlzLnNvdXJjZUJyYW5jaENoYW5nZX19PlxuXHRcdFx0XHRcdFx0e2JyYW5jaE9wdGlvbnN9XG5cdFx0XHRcdFx0PC9zZWxlY3Q+XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbCBjaGVja2JveC1sYWJlbFwiPlxuXHRcdFx0XHRcdDxpbnB1dCBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGlucHV0LWNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCIgdGFiSW5kZXg9XCIzXCIgY2hlY2tlZD17dGhpcy5zdGF0ZS50cmFja30gb249e3tjaGFuZ2U6IHRoaXMudHJhY2tDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdFRyYWNrIHt0aGlzLnN0YXRlLm5ld0JyYW5jaCA/IGBvcmlnaW4vJHthY3R1YWxOYW1lfWAgOiBcIlwifVxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG5cdHRpdGxlKCkge1xuXHRcdHJldHVybiBcIkNyZWF0ZSBCcmFuY2hcIjtcblx0fVxuXG5cdGJ1dHRvbnMoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBidG4gaWNvbiBpY29uLWdpdC1icmFuY2ggaW5saW5lLWJsb2NrLXRpZ2h0XCIgdGFiSW5kZXg9XCI0XCIgb249e3tjbGljazogdGhpcy5hY2NlcHR9fSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5mZXRjaGluZ30+XG5cdFx0XHRcdFx0Q3JlYXRlIEJyYW5jaFxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGJ0biBpY29uIGljb24tcmVwby1zeW5jIGlubGluZS1ibG9jay10aWdodFwiIHRhYkluZGV4PVwiNVwiIG9uPXt7Y2xpY2s6IHRoaXMuZmV0Y2h9fSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5mZXRjaGluZ30+XG5cdFx0XHRcdFx0RmV0Y2hcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG4iXX0=