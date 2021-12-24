Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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

var _helper = require("../helper");

var _helper2 = _interopRequireDefault(_helper);

var _Dialog2 = require("./Dialog");

var _Dialog3 = _interopRequireDefault(_Dialog2);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _promisificator = require("promisificator");

var MergeBranchDialog = (function (_Dialog) {
	_inherits(MergeBranchDialog, _Dialog);

	function MergeBranchDialog() {
		_classCallCheck(this, MergeBranchDialog);

		_get(Object.getPrototypeOf(MergeBranchDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(MergeBranchDialog, [{
		key: "initialState",
		value: function initialState(props) {
			if (!props.root) {
				throw new Error("Must specify a {root} property");
			}

			this.git = props.git || _gitCmd2["default"];
			this.notifications = props.notifications || _Notifications2["default"];

			var state = {
				branches: props.branches || [],
				rootBranch: "",
				mergeBranch: "",
				rebase: false,
				"delete": false,
				abort: true,
				root: props.root,
				fetching: false
			};

			var selectedBranch = state.branches.find(function (b) {
				return b.selected;
			});
			state.rootBranch = selectedBranch ? selectedBranch.name : "";
			var defaultBranch = _helper2["default"].getDefaultBranch(state.branches);
			state.mergeBranch = defaultBranch ? defaultBranch.name : "";

			return state;
		}
	}, {
		key: "validate",
		value: _asyncToGenerator(function* (state) {
			var error = false;
			if (!state.rootBranch) {
				this.refs.rootBranchInput.classList.add("error");
				error = true;
			}
			if (!state.mergeBranch) {
				this.refs.mergeBranchInput.classList.add("error");
				error = true;
			}
			if (state.rootBranch === state.mergeBranch) {
				this.refs.rootBranchInput.classList.add("error");
				this.refs.mergeBranchInput.classList.add("error");
				error = true;
			}
			if (error) {
				return;
			}

			var rootBranch = state.branches.find(function (b) {
				return b.name === state.rootBranch;
			}) || {};
			var mergeBranch = state.branches.find(function (b) {
				return b.name === state.mergeBranch;
			}) || {};

			if (state["delete"]) {
				var _ref = yield (0, _promisificator.promisify)(atom.confirm.bind(atom), { rejectOnError: false, alwaysReturnArray: true })({
					type: "warning",
					checkboxLabel: "Never Show This Dialog Again",
					message: "Are you sure you want to delete the branch after merging?",
					detail: "You are deleting:\n" + state.mergeBranch,
					buttons: ["Delete Branch", "Cancel"]
				});

				var _ref2 = _slicedToArray(_ref, 2);

				var confirmButton = _ref2[0];
				var hideDialog = _ref2[1];

				if (hideDialog) {
					atom.config.set("git-menu.confirmationDialogs.deleteAfterMerge", false);
				}
				if (confirmButton === 1) {
					return;
				}
			}

			return [rootBranch, mergeBranch, state.rebase, state["delete"], state.abort];
		})
	}, {
		key: "show",
		value: function show() {
			this.refs.mergeBranchInput.focus();
		}
	}, {
		key: "fetch",
		value: _asyncToGenerator(function* () {
			this.update({ fetching: true });
			try {
				yield this.git.fetch(this.state.root);
				var branches = yield this.git.branches(this.state.root, false);
				this.update({ branches: branches, fetching: false });
			} catch (err) {
				this.notifications.addError("Fetch", err);
				this.update({ fetching: false });
			}
		})
	}, {
		key: "rootBranchChange",
		value: function rootBranchChange(e) {
			this.refs.rootBranchInput.classList.remove("error");
			this.update({ rootBranch: e.target.value });
		}
	}, {
		key: "mergeBranchChange",
		value: function mergeBranchChange(e) {
			this.refs.mergeBranchInput.classList.remove("error");
			this.update({ mergeBranch: e.target.value });
		}
	}, {
		key: "rebaseChange",
		value: function rebaseChange(e) {
			this.update({ rebase: e.target.checked });
		}
	}, {
		key: "deleteChange",
		value: function deleteChange(e) {
			this.update({ "delete": e.target.checked });
		}
	}, {
		key: "abortChange",
		value: function abortChange(e) {
			this.update({ abort: e.target.checked });
		}
	}, {
		key: "body",
		value: function body() {
			var _this = this;

			var rootBranchOptions = undefined,
			    mergeBranchOptions = undefined;
			if (this.state.fetching) {
				rootBranchOptions = _etch2["default"].dom(
					"option",
					null,
					"Fetching..."
				);
				mergeBranchOptions = _etch2["default"].dom(
					"option",
					null,
					"Fetching..."
				);
			} else {
				rootBranchOptions = this.state.branches.map(function (b) {
					return _etch2["default"].dom(
						"option",
						{ value: b.name, selected: b.name === _this.state.rootBranch },
						b.branch
					);
				});
				mergeBranchOptions = this.state.branches.map(function (b) {
					return _etch2["default"].dom(
						"option",
						{ value: b.name, selected: b.name === _this.state.mergeBranch },
						b.branch
					);
				});
			}

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"Merge:",
					_etch2["default"].dom(
						"select",
						{ ref: "mergeBranchInput", tabIndex: "1", className: "native-key-bindings input-select", value: this.state.mergeBranch, disabled: this.state.fetching, on: { change: this.mergeBranchChange } },
						mergeBranchOptions
					)
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"Into:",
					_etch2["default"].dom(
						"select",
						{ ref: "rootBranchInput", tabIndex: "2", className: "native-key-bindings input-select", value: this.state.rootBranch, disabled: this.state.fetching, on: { change: this.rootBranchChange } },
						rootBranchOptions
					)
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "3", checked: this.state.rebase, on: { change: this.rebaseChange } }),
					"Rebase"
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "4", checked: this.state["delete"], on: { change: this.deleteChange } }),
					"Delete ",
					this.state.mergeBranch,
					" branch after merge"
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "5", checked: this.state.abort, on: { change: this.abortChange } }),
					"Abort on failure"
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Merge Branch";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-git-branch inline-block-tight", tabIndex: "6", on: { click: this.accept }, disabled: this.state.fetching },
					"Merge Branch"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-repo-sync inline-block-tight", tabIndex: "7", on: { click: this.fetch }, disabled: this.state.fetching },
					"Fetch"
				)
			);
		}
	}]);

	return MergeBranchDialog;
})(_Dialog3["default"]);

exports["default"] = MergeBranchDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9NZXJnZUJyYW5jaERpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUltQixZQUFZOzs7O3NCQUNaLFdBQVc7Ozs7dUJBQ1gsVUFBVTs7OztvQkFDWixNQUFNOzs7OzZCQUNHLGtCQUFrQjs7Ozs4QkFDcEIsZ0JBQWdCOztJQUVuQixpQkFBaUI7V0FBakIsaUJBQWlCOztVQUFqQixpQkFBaUI7d0JBQWpCLGlCQUFpQjs7NkJBQWpCLGlCQUFpQjs7O2NBQWpCLGlCQUFpQjs7U0FFekIsc0JBQUMsS0FBSyxFQUFFO0FBQ25CLE9BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNsRDs7QUFFRCxPQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLHVCQUFVLENBQUM7QUFDL0IsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSw4QkFBaUIsQ0FBQzs7QUFFMUQsT0FBTSxLQUFLLEdBQUc7QUFDYixZQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFO0FBQzlCLGNBQVUsRUFBRSxFQUFFO0FBQ2QsZUFBVyxFQUFFLEVBQUU7QUFDZixVQUFNLEVBQUUsS0FBSztBQUNiLGNBQVEsS0FBSztBQUNiLFNBQUssRUFBRSxJQUFJO0FBQ1gsUUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLFlBQVEsRUFBRSxLQUFLO0lBQ2YsQ0FBQzs7QUFFRixPQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsUUFBUTtJQUFBLENBQUMsQ0FBQztBQUM1RCxRQUFLLENBQUMsVUFBVSxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMs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LG9DQUFvQyxFQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEFBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBQyxBQUFDLEdBQUc7O0tBRXpJO0lBQ0gsQ0FDTDtHQUNGOzs7U0FFSSxpQkFBRztBQUNQLFVBQU8sY0FBYyxDQUFDO0dBQ3RCOzs7U0FFTSxtQkFBRztBQUNULFVBQ0M7OztJQUNDOztPQUFRLFNBQVMsRUFBQyxpRUFBaUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEFBQUM7O0tBRWhKO0lBQ1Q7O09BQVEsU0FBUyxFQUFDLGdFQUFnRSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQzs7S0FFOUk7SUFDSixDQUNMO0dBQ0Y7OztRQS9LbUIsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2RpYWxvZ3MvTWVyZ2VCcmFuY2hEaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4uL2hlbHBlclwiO1xuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi9EaWFsb2dcIjtcbmltcG9ydCBldGNoIGZyb20gXCJldGNoXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi4vTm90aWZpY2F0aW9uc1wiO1xuaW1wb3J0IHtwcm9taXNpZnl9IGZyb20gXCJwcm9taXNpZmljYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXJnZUJyYW5jaERpYWxvZyBleHRlbmRzIERpYWxvZyB7XG5cblx0aW5pdGlhbFN0YXRlKHByb3BzKSB7XG5cdFx0aWYgKCFwcm9wcy5yb290KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IHNwZWNpZnkgYSB7cm9vdH0gcHJvcGVydHlcIik7XG5cdFx0fVxuXG5cdFx0dGhpcy5naXQgPSBwcm9wcy5naXQgfHwgZ2l0Q21kO1xuXHRcdHRoaXMubm90aWZpY2F0aW9ucyA9IHByb3BzLm5vdGlmaWNhdGlvbnMgfHwgTm90aWZpY2F0aW9ucztcblxuXHRcdGNvbnN0IHN0YXRlID0ge1xuXHRcdFx0YnJhbmNoZXM6IHByb3BzLmJyYW5jaGVzIHx8IFtdLFxuXHRcdFx0cm9vdEJyYW5jaDogXCJcIixcblx0XHRcdG1lcmdlQnJhbmNoOiBcIlwiLFxuXHRcdFx0cmViYXNlOiBmYWxzZSxcblx0XHRcdGRlbGV0ZTogZmFsc2UsXG5cdFx0XHRhYm9ydDogdHJ1ZSxcblx0XHRcdHJvb3Q6IHByb3BzLnJvb3QsXG5cdFx0XHRmZXRjaGluZzogZmFsc2UsXG5cdFx0fTtcblxuXHRcdGNvbnN0IHNlbGVjdGVkQnJhbmNoID0gc3RhdGUuYnJhbmNoZXMuZmluZChiID0+IGIuc2VsZWN0ZWQpO1xuXHRcdHN0YXRlLnJvb3RCcmFuY2ggPSBzZWxlY3RlZEJyYW5jaCA/IHNlbGVjdGVkQnJhbmNoLm5hbWUgOiBcIlwiO1xuXHRcdGNvbnN0IGRlZmF1bHRCcmFuY2ggPSBoZWxwZXIuZ2V0RGVmYXVsdEJyYW5jaChzdGF0ZS5icmFuY2hlcyk7XG5cdFx0c3RhdGUubWVyZ2VCcmFuY2ggPSBkZWZhdWx0QnJhbmNoID8gZGVmYXVsdEJyYW5jaC5uYW1lIDogXCJcIjtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdGFzeW5jIHZhbGlkYXRlKHN0YXRlKSB7XG5cdFx0bGV0IGVycm9yID0gZmFsc2U7XG5cdFx0aWYgKCFzdGF0ZS5yb290QnJhbmNoKSB7XG5cdFx0XHR0aGlzLnJlZnMucm9vdEJyYW5jaElucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0XHRcdGVycm9yID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKCFzdGF0ZS5tZXJnZUJyYW5jaCkge1xuXHRcdFx0dGhpcy5yZWZzLm1lcmdlQnJhbmNoSW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xuXHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc3RhdGUucm9vdEJyYW5jaCA9PT0gc3RhdGUubWVyZ2VCcmFuY2gpIHtcblx0XHRcdHRoaXMucmVmcy5yb290QnJhbmNoSW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xuXHRcdFx0dGhpcy5yZWZzLm1lcmdlQnJhbmNoSW5wdXQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xuXHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCByb290QnJhbmNoID0gc3RhdGUuYnJhbmNoZXMuZmluZChiID0+IGIubmFtZSA9PT0gc3RhdGUucm9vdEJyYW5jaCkgfHwge307XG5cdFx0Y29uc3QgbWVyZ2VCcmFuY2ggPSBzdGF0ZS5icmFuY2hlcy5maW5kKGIgPT4gYi5uYW1lID09PSBzdGF0ZS5tZXJnZUJyYW5jaCkgfHwge307XG5cblx0XHRpZiAoc3RhdGUuZGVsZXRlKSB7XG5cdFx0XHRjb25zdCBbY29uZmlybUJ1dHRvbiwgaGlkZURpYWxvZ10gPSBhd2FpdCBwcm9taXNpZnkoYXRvbS5jb25maXJtLmJpbmQoYXRvbSksIHtyZWplY3RPbkVycm9yOiBmYWxzZSwgYWx3YXlzUmV0dXJuQXJyYXk6IHRydWV9KSh7XG5cdFx0XHRcdHR5cGU6IFwid2FybmluZ1wiLFxuXHRcdFx0XHRjaGVja2JveExhYmVsOiBcIk5ldmVyIFNob3cgVGhpcyBEaWFsb2cgQWdhaW5cIixcblx0XHRcdFx0bWVzc2FnZTogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSBicmFuY2ggYWZ0ZXIgbWVyZ2luZz9cIixcblx0XHRcdFx0ZGV0YWlsOiBgWW91IGFyZSBkZWxldGluZzpcXG4ke3N0YXRlLm1lcmdlQnJhbmNofWAsXG5cdFx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0XHRcIkRlbGV0ZSBCcmFuY2hcIixcblx0XHRcdFx0XHRcIkNhbmNlbFwiLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChoaWRlRGlhbG9nKSB7XG5cdFx0XHRcdGF0b20uY29uZmlnLnNldChcImdpdC1tZW51LmNvbmZpcm1hdGlvbkRpYWxvZ3MuZGVsZXRlQWZ0ZXJNZXJnZVwiLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY29uZmlybUJ1dHRvbiA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFtyb290QnJhbmNoLCBtZXJnZUJyYW5jaCwgc3RhdGUucmViYXNlLCBzdGF0ZS5kZWxldGUsIHN0YXRlLmFib3J0XTtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0dGhpcy5yZWZzLm1lcmdlQnJhbmNoSW5wdXQuZm9jdXMoKTtcblx0fVxuXG5cdGFzeW5jIGZldGNoKCkge1xuXHRcdHRoaXMudXBkYXRlKHtmZXRjaGluZzogdHJ1ZX0pO1xuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCB0aGlzLmdpdC5mZXRjaCh0aGlzLnN0YXRlLnJvb3QpO1xuXHRcdFx0Y29uc3QgYnJhbmNoZXMgPSBhd2FpdCB0aGlzLmdpdC5icmFuY2hlcyh0aGlzLnN0YXRlLnJvb3QsIGZhbHNlKTtcblx0XHRcdHRoaXMudXBkYXRlKHticmFuY2hlczogYnJhbmNoZXMsIGZldGNoaW5nOiBmYWxzZX0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRmV0Y2hcIiwgZXJyKTtcblx0XHRcdHRoaXMudXBkYXRlKHtmZXRjaGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxuXHRyb290QnJhbmNoQ2hhbmdlKGUpIHtcblx0XHR0aGlzLnJlZnMucm9vdEJyYW5jaElucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcblx0XHR0aGlzLnVwZGF0ZSh7cm9vdEJyYW5jaDogZS50YXJnZXQudmFsdWV9KTtcblx0fVxuXG5cdG1lcmdlQnJhbmNoQ2hhbmdlKGUpIHtcblx0XHR0aGlzLnJlZnMubWVyZ2VCcmFuY2hJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0dGhpcy51cGRhdGUoe21lcmdlQnJhbmNoOiBlLnRhcmdldC52YWx1ZX0pO1xuXHR9XG5cblx0cmViYXNlQ2hhbmdlKGUpIHtcblx0XHR0aGlzLnVwZGF0ZSh7cmViYXNlOiBlLnRhcmdldC5jaGVja2VkfSk7XG5cdH1cblxuXHRkZWxldGVDaGFuZ2UoZSkge1xuXHRcdHRoaXMudXBkYXRlKHtkZWxldGU6IGUudGFyZ2V0LmNoZWNrZWR9KTtcblx0fVxuXG5cdGFib3J0Q2hhbmdlKGUpIHtcblx0XHR0aGlzLnVwZGF0ZSh7YWJvcnQ6IGUudGFyZ2V0LmNoZWNrZWR9KTtcblx0fVxuXG5cdGJvZHkoKSB7XG5cdFx0bGV0IHJvb3RCcmFuY2hPcHRpb25zLCBtZXJnZUJyYW5jaE9wdGlvbnM7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmV0Y2hpbmcpIHtcblx0XHRcdHJvb3RCcmFuY2hPcHRpb25zID0gKFxuXHRcdFx0XHQ8b3B0aW9uPkZldGNoaW5nLi4uPC9vcHRpb24+XG5cdFx0XHQpO1xuXHRcdFx0bWVyZ2VCcmFuY2hPcHRpb25zID0gKFxuXHRcdFx0XHQ8b3B0aW9uPkZldGNoaW5nLi4uPC9vcHRpb24+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyb290QnJhbmNoT3B0aW9ucyA9IHRoaXMuc3RhdGUuYnJhbmNoZXMubWFwKGIgPT4gKFxuXHRcdFx0XHQ8b3B0aW9uIHZhbHVlPXtiLm5hbWV9IHNlbGVjdGVkPXtiLm5hbWUgPT09IHRoaXMuc3RhdGUucm9vdEJyYW5jaH0+e2IuYnJhbmNofTwvb3B0aW9uPlxuXHRcdFx0KSk7XG5cdFx0XHRtZXJnZUJyYW5jaE9wdGlvbnMgPSB0aGlzLnN0YXRlLmJyYW5jaGVzLm1hcChiID0+IChcblx0XHRcdFx0PG9wdGlvbiB2YWx1ZT17Yi5uYW1lfSBzZWxlY3RlZD17Yi5uYW1lID09PSB0aGlzLnN0YXRlLm1lcmdlQnJhbmNofT57Yi5icmFuY2h9PC9vcHRpb24+XG5cdFx0XHQpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0TWVyZ2U6XG5cdFx0XHRcdFx0PHNlbGVjdCByZWY9XCJtZXJnZUJyYW5jaElucHV0XCIgdGFiSW5kZXg9XCIxXCIgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1zZWxlY3RcIiB2YWx1ZT17dGhpcy5zdGF0ZS5tZXJnZUJyYW5jaH0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuZmV0Y2hpbmd9IG9uPXt7Y2hhbmdlOiB0aGlzLm1lcmdlQnJhbmNoQ2hhbmdlfX0+XG5cdFx0XHRcdFx0XHR7bWVyZ2VCcmFuY2hPcHRpb25zfVxuXHRcdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIj5cblx0XHRcdFx0XHRJbnRvOlxuXHRcdFx0XHRcdDxzZWxlY3QgcmVmPVwicm9vdEJyYW5jaElucHV0XCIgdGFiSW5kZXg9XCIyXCIgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1zZWxlY3RcIiB2YWx1ZT17dGhpcy5zdGF0ZS5yb290QnJhbmNofSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5mZXRjaGluZ30gb249e3tjaGFuZ2U6IHRoaXMucm9vdEJyYW5jaENoYW5nZX19PlxuXHRcdFx0XHRcdFx0e3Jvb3RCcmFuY2hPcHRpb25zfVxuXHRcdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWwgY2hlY2tib3gtbGFiZWxcIj5cblx0XHRcdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1jaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIHRhYkluZGV4PVwiM1wiIGNoZWNrZWQ9e3RoaXMuc3RhdGUucmViYXNlfSBvbj17e2NoYW5nZTogdGhpcy5yZWJhc2VDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdFJlYmFzZVxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWwgY2hlY2tib3gtbGFiZWxcIj5cblx0XHRcdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1jaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIHRhYkluZGV4PVwiNFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUuZGVsZXRlfSBvbj17e2NoYW5nZTogdGhpcy5kZWxldGVDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdERlbGV0ZSB7dGhpcy5zdGF0ZS5tZXJnZUJyYW5jaH0gYnJhbmNoIGFmdGVyIG1lcmdlXG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbCBjaGVja2JveC1sYWJlbFwiPlxuXHRcdFx0XHRcdDxpbnB1dCBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGlucHV0LWNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCIgdGFiSW5kZXg9XCI1XCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5hYm9ydH0gb249e3tjaGFuZ2U6IHRoaXMuYWJvcnRDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdEFib3J0IG9uIGZhaWx1cmVcblx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblxuXHR0aXRsZSgpIHtcblx0XHRyZXR1cm4gXCJNZXJnZSBCcmFuY2hcIjtcblx0fVxuXG5cdGJ1dHRvbnMoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBidG4gaWNvbiBpY29uLWdpdC1icmFuY2ggaW5saW5lLWJsb2NrLXRpZ2h0XCIgdGFiSW5kZXg9XCI2XCIgb249e3tjbGljazogdGhpcy5hY2NlcHR9fSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5mZXRjaGluZ30+XG5cdFx0XHRcdFx0TWVyZ2UgQnJhbmNoXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgYnRuIGljb24gaWNvbi1yZXBvLXN5bmMgaW5saW5lLWJsb2NrLXRpZ2h0XCIgdGFiSW5kZXg9XCI3XCIgb249e3tjbGljazogdGhpcy5mZXRjaH19IGRpc2FibGVkPXt0aGlzLnN0YXRlLmZldGNoaW5nfT5cblx0XHRcdFx0XHRGZXRjaFxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==