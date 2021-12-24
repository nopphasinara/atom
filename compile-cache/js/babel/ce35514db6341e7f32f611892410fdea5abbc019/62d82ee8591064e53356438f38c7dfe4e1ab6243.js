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

var _Dialog2 = require("./Dialog");

var _Dialog3 = _interopRequireDefault(_Dialog2);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _Notifications = require("../Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var SwitchBranchDialog = (function (_Dialog) {
	_inherits(SwitchBranchDialog, _Dialog);

	function SwitchBranchDialog() {
		_classCallCheck(this, SwitchBranchDialog);

		_get(Object.getPrototypeOf(SwitchBranchDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(SwitchBranchDialog, [{
		key: "initialState",
		value: function initialState(props) {
			if (!props.root) {
				throw new Error("Must specify a {root} property");
			}

			this.git = props.git || _gitCmd2["default"];
			this.notifications = props.notifications || _Notifications2["default"];

			var state = {
				branches: props.branches || [],
				branch: "",
				root: props.root,
				fetching: false
			};

			var branch = state.branches.find(function (b) {
				return b.selected;
			});
			state.branch = branch ? branch.name : "";

			return state;
		}
	}, {
		key: "validate",
		value: function validate(state) {
			var error = false;
			if (!state.branch) {
				error = true;
				this.refs.branchInput.classList.add("error");
			}
			if (error) {
				return;
			}

			var branch = state.branches.find(function (b) {
				return b.name === state.branch;
			});
			var name = state.branch;
			var remote = branch && branch.remote ? "origin" : null;
			if (!remote) {
				var isRemote = state.branch.match(/^remotes\/([^/]+)\/(.+)$/);
				if (isRemote) {
					var _isRemote = _slicedToArray(isRemote, 3);

					remote = _isRemote[1];
					name = _isRemote[2];
				}
			}

			return [name, remote];
		}
	}, {
		key: "show",
		value: function show() {
			this.refs.branchInput.focus();
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
		key: "branchChange",
		value: function branchChange(e) {
			this.refs.branchInput.classList.remove("error");
			this.update({ branch: e.target.value });
		}
	}, {
		key: "body",
		value: function body() {
			var _this = this;

			var branchOptions = undefined;
			if (this.state.fetching) {
				branchOptions = _etch2["default"].dom(
					"option",
					null,
					"Fetching..."
				);
			} else {
				branchOptions = this.state.branches.map(function (branch) {
					return _etch2["default"].dom(
						"option",
						{ value: branch.name, selected: branch.name === _this.state.branch },
						branch.branch
					);
				});
			}

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					_etch2["default"].dom(
						"select",
						{ ref: "branchInput", tabIndex: "1", className: "native-key-bindings input-select", value: this.state.branch, disabled: this.state.fetching, on: { change: this.branchChange } },
						branchOptions
					)
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Switch Branch";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-git-branch inline-block-tight", tabIndex: "2", on: { click: this.accept }, disabled: this.state.fetching },
					"Switch Branch"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-repo-sync inline-block-tight", tabIndex: "3", on: { click: this.fetch }, disabled: this.state.fetching },
					"Fetch"
				)
			);
		}
	}]);

	return SwitchBranchDialog;
})(_Dialog3["default"]);

exports["default"] = SwitchBranchDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9Td2l0Y2hCcmFuY2hEaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFJbUIsWUFBWTs7Ozt1QkFDWixVQUFVOzs7O29CQUNaLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7O0lBRXZCLGtCQUFrQjtXQUFsQixrQkFBa0I7O1VBQWxCLGtCQUFrQjt3QkFBbEIsa0JBQWtCOzs2QkFBbEIsa0JBQWtCOzs7Y0FBbEIsa0JBQWtCOztTQUUxQixzQkFBQyxLQUFLLEVBQUU7QUFDbkIsT0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2xEOztBQUVELE9BQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsdUJBQVUsQ0FBQztBQUMvQixPQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLDhCQUFpQixDQUFDOztBQUUxRCxPQUFNLEtBQUssR0FBRztBQUNiLFlBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUU7QUFDOUIsVUFBTSxFQUFFLEVBQUU7QUFDVixRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsWUFBUSxFQUFFLEtBQUs7SUFDZixDQUFDOztBQUVGLE9BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztXQUFJLENBQUMsQ0FBQyxRQUFRO0lBQUEsQ0FBQyxDQUFDO0FBQ3BELFFBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUV6QyxVQUFPLEtBQUssQ0FBQztHQUNiOzs7U0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZixPQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7QUFD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RUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxFQUFDLEVBQUUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFDLEFBQUM7TUFDM0ssYUFBYTtNQUNOO0tBQ0Y7SUFDSCxDQUNMO0dBQ0Y7OztTQUVJLGlCQUFHO0FBQ1AsVUFBTyxlQUFlLENBQUM7R0FDdkI7OztTQUVNLG1CQUFHO0FBQ1QsVUFDQzs7O0lBQ0M7O09BQVEsU0FBUyxFQUFDLGlFQUFpRSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQzs7S0FFaEo7SUFDVDs7T0FBUSxTQUFTLEVBQUMsZ0VBQWdFLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDOztLQUU5STtJQUNKLENBQ0w7R0FDRjs7O1FBekdtQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9Td2l0Y2hCcmFuY2hEaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcIi4vRGlhbG9nXCI7XG5pbXBvcnQgZXRjaCBmcm9tIFwiZXRjaFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3dpdGNoQnJhbmNoRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuXHRpbml0aWFsU3RhdGUocHJvcHMpIHtcblx0XHRpZiAoIXByb3BzLnJvb3QpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk11c3Qgc3BlY2lmeSBhIHtyb290fSBwcm9wZXJ0eVwiKTtcblx0XHR9XG5cblx0XHR0aGlzLmdpdCA9IHByb3BzLmdpdCB8fCBnaXRDbWQ7XG5cdFx0dGhpcy5ub3RpZmljYXRpb25zID0gcHJvcHMubm90aWZpY2F0aW9ucyB8fCBOb3RpZmljYXRpb25zO1xuXG5cdFx0Y29uc3Qgc3RhdGUgPSB7XG5cdFx0XHRicmFuY2hlczogcHJvcHMuYnJhbmNoZXMgfHwgW10sXG5cdFx0XHRicmFuY2g6IFwiXCIsXG5cdFx0XHRyb290OiBwcm9wcy5yb290LFxuXHRcdFx0ZmV0Y2hpbmc6IGZhbHNlLFxuXHRcdH07XG5cblx0XHRjb25zdCBicmFuY2ggPSBzdGF0ZS5icmFuY2hlcy5maW5kKGIgPT4gYi5zZWxlY3RlZCk7XG5cdFx0c3RhdGUuYnJhbmNoID0gYnJhbmNoID8gYnJhbmNoLm5hbWUgOiBcIlwiO1xuXG5cdFx0cmV0dXJuIHN0YXRlO1xuXHR9XG5cblx0dmFsaWRhdGUoc3RhdGUpIHtcblx0XHRsZXQgZXJyb3IgPSBmYWxzZTtcblx0XHRpZiAoIXN0YXRlLmJyYW5jaCkge1xuXHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdFx0dGhpcy5yZWZzLmJyYW5jaElucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0XHR9XG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgYnJhbmNoID0gc3RhdGUuYnJhbmNoZXMuZmluZChiID0+IGIubmFtZSA9PT0gc3RhdGUuYnJhbmNoKTtcblx0XHRsZXQgbmFtZSA9IHN0YXRlLmJyYW5jaDtcblx0XHRsZXQgcmVtb3RlID0gYnJhbmNoICYmIGJyYW5jaC5yZW1vdGUgPyBcIm9yaWdpblwiIDogbnVsbDtcblx0XHRpZiAoIXJlbW90ZSkge1xuXHRcdFx0Y29uc3QgaXNSZW1vdGUgPSBzdGF0ZS5icmFuY2gubWF0Y2goL15yZW1vdGVzXFwvKFteL10rKVxcLyguKykkLyk7XG5cdFx0XHRpZiAoaXNSZW1vdGUpIHtcblx0XHRcdFx0WywgcmVtb3RlLCBuYW1lXSA9IGlzUmVtb3RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBbbmFtZSwgcmVtb3RlXTtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0dGhpcy5yZWZzLmJyYW5jaElucHV0LmZvY3VzKCk7XG5cdH1cblxuXHRhc3luYyBmZXRjaCgpIHtcblx0XHR0aGlzLnVwZGF0ZSh7ZmV0Y2hpbmc6IHRydWV9KTtcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgdGhpcy5naXQuZmV0Y2godGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgdGhpcy5naXQuYnJhbmNoZXModGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdHRoaXMudXBkYXRlKHticmFuY2hlczogYnJhbmNoZXMsIGZldGNoaW5nOiBmYWxzZX0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRmV0Y2hcIiwgZXJyKTtcblx0XHRcdHRoaXMudXBkYXRlKHtmZXRjaGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxuXHRicmFuY2hDaGFuZ2UoZSkge1xuXHRcdHRoaXMucmVmcy5icmFuY2hJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0dGhpcy51cGRhdGUoe2JyYW5jaDogZS50YXJnZXQudmFsdWV9KTtcblx0fVxuXG5cdGJvZHkoKSB7XG5cdFx0bGV0IGJyYW5jaE9wdGlvbnM7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmV0Y2hpbmcpIHtcblx0XHRcdGJyYW5jaE9wdGlvbnMgPSAoXG5cdFx0XHRcdDxvcHRpb24+RmV0Y2hpbmcuLi48L29wdGlvbj5cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJyYW5jaE9wdGlvbnMgPSB0aGlzLnN0YXRlLmJyYW5jaGVzLm1hcChicmFuY2ggPT4gKFxuXHRcdFx0XHQ8b3B0aW9uIHZhbHVlPXticmFuY2gubmFtZX0gc2VsZWN0ZWQ9e2JyYW5jaC5uYW1lID09PSB0aGlzLnN0YXRlLmJyYW5jaH0+e2JyYW5jaC5icmFuY2h9PC9vcHRpb24+XG5cdFx0XHQpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0PHNlbGVjdCByZWY9XCJicmFuY2hJbnB1dFwiIHRhYkluZGV4PVwiMVwiIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgaW5wdXQtc2VsZWN0XCIgdmFsdWU9e3RoaXMuc3RhdGUuYnJhbmNofSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5mZXRjaGluZ30gb249e3tjaGFuZ2U6IHRoaXMuYnJhbmNoQ2hhbmdlfX0+XG5cdFx0XHRcdFx0XHR7YnJhbmNoT3B0aW9uc31cblx0XHRcdFx0XHQ8L3NlbGVjdD5cblx0XHRcdFx0PC9sYWJlbD5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblxuXHR0aXRsZSgpIHtcblx0XHRyZXR1cm4gXCJTd2l0Y2ggQnJhbmNoXCI7XG5cdH1cblxuXHRidXR0b25zKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgYnRuIGljb24gaWNvbi1naXQtYnJhbmNoIGlubGluZS1ibG9jay10aWdodFwiIHRhYkluZGV4PVwiMlwiIG9uPXt7Y2xpY2s6IHRoaXMuYWNjZXB0fX0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuZmV0Y2hpbmd9PlxuXHRcdFx0XHRcdFN3aXRjaCBCcmFuY2hcblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDxidXR0b24gY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBidG4gaWNvbiBpY29uLXJlcG8tc3luYyBpbmxpbmUtYmxvY2stdGlnaHRcIiB0YWJJbmRleD1cIjNcIiBvbj17e2NsaWNrOiB0aGlzLmZldGNofX0gZGlzYWJsZWQ9e3RoaXMuc3RhdGUuZmV0Y2hpbmd9PlxuXHRcdFx0XHRcdEZldGNoXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufVxuIl19