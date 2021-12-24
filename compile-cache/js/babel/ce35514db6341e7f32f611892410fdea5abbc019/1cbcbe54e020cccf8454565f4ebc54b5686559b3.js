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

var _promisificator = require("promisificator");

var DeleteBranchDialog = (function (_Dialog) {
	_inherits(DeleteBranchDialog, _Dialog);

	function DeleteBranchDialog() {
		_classCallCheck(this, DeleteBranchDialog);

		_get(Object.getPrototypeOf(DeleteBranchDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(DeleteBranchDialog, [{
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
				local: true,
				remote: false,
				force: false,
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
		value: _asyncToGenerator(function* (state) {
			if (!state.branch) {
				this.refs.branchInput.classList.add("error");
				return;
			}

			var branch = state.branches.find(function (b) {
				return b.name === state.branch;
			}) || {};
			var local = !!(branch.local && state.local);
			var remote = !!(branch.remote && state.remote);

			if (state.force && (!branch.local || state.local) && (!branch.remote || state.remote)) {
				var branches = [local ? state.branch : null, remote ? "origin/" + state.branch : null].filter(function (i) {
					return i;
				}).join("\n");

				var _ref = yield (0, _promisificator.promisify)(atom.confirm.bind(atom), { rejectOnError: false, alwaysReturnArray: true })({
					type: "warning",
					checkboxLabel: "Never Show This Dialog Again",
					message: "Are you sure you want to force delete the only version of this branch?",
					detail: "You are deleting:\n" + branches,
					buttons: ["Delete Branches", "Cancel"]
				});

				var _ref2 = _slicedToArray(_ref, 2);

				var confirmButton = _ref2[0];
				var hideDialog = _ref2[1];

				if (hideDialog) {
					atom.config.set("git-menu.confirmationDialogs.deleteRemote", false);
				}
				if (confirmButton === 1) {
					return;
				}
			}

			return [branch, local, remote, state.force];
		})
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
		key: "remoteChange",
		value: function remoteChange(e) {
			this.update({ remote: e.target.checked });
		}
	}, {
		key: "localChange",
		value: function localChange(e) {
			this.update({ local: e.target.checked });
		}
	}, {
		key: "forceChange",
		value: function forceChange(e) {
			this.update({ force: e.target.checked });
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
				branchOptions = this.state.branches.map(function (b) {
					return _etch2["default"].dom(
						"option",
						{ value: b.name, selected: b.name === _this.state.branch },
						b.branch
					);
				});
			}

			var branch = this.state.branches.find(function (b) {
				return b.name === _this.state.branch;
			});
			var local = branch ? branch.local : false;
			var remote = branch ? branch.remote : false;

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
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label " + (local ? "" : "input-disabled") },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "2", disabled: !local, checked: local && this.state.local, on: { change: this.localChange } }),
					"Delete local branch ",
					this.state.branch
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label " + (remote ? "" : "input-disabled") },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "3", disabled: !remote, checked: remote && this.state.remote, on: { change: this.remoteChange } }),
					"Delete remote branch origin/",
					this.state.branch
				),
				_etch2["default"].dom(
					"label",
					{ className: "input-label checkbox-label" },
					_etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: "4", checked: this.state.force, on: { change: this.forceChange } }),
					"Force"
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Delete Branch";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-git-branch inline-block-tight", tabIndex: "5", on: { click: this.accept }, disabled: this.state.fetching },
					"Delete Branch"
				),
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-repo-sync inline-block-tight", tabIndex: "6", on: { click: this.fetch }, disabled: this.state.fetching },
					"Fetch"
				)
			);
		}
	}]);

	return DeleteBranchDialog;
})(_Dialog3["default"]);

exports["default"] = DeleteBranchDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9EZWxldGVCcmFuY2hEaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFJbUIsWUFBWTs7Ozt1QkFDWixVQUFVOzs7O29CQUNaLE1BQU07Ozs7NkJBQ0csa0JBQWtCOzs7OzhCQUNwQixnQkFBZ0I7O0lBRW5CLGtCQUFrQjtXQUFsQixrQkFBa0I7O1VBQWxCLGtCQUFrQjt3QkFBbEIsa0JBQWtCOzs2QkFBbEIsa0JBQWtCOzs7Y0FBbEIsa0JBQWtCOztTQUUxQixzQkFBQyxLQUFLLEVBQUU7QUFDbkIsT0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2xEOztBQUVELE9BQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsdUJBQVUsQ0FBQztBQUMvQixPQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLDhCQUFpQixDQUFDOztBQUUxRCxPQUFNLEtBQUssR0FBRztBQUNiLFlBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUU7QUFDOUIsVUFBTSxFQUFFLEVBQUU7QUFDVixTQUFLLEVBQUUsSUFBSTtBQUNYLFVBQU0sRUFBRSxLQUFLO0FBQ2IsU0FBSyxFQUFFLEtBQUs7QUFDWixRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsWUFBUSxFQUFFLEtBQUs7SUFDZixDQUFDOztBQUVGLE9BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztXQUFJLENBQUMsQ0FBQyxRQUFRO0lBQUEsQ0FBQyxDQUFDO0FBQ3BELFFBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUV6QyxV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Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9EZWxldGVCcmFuY2hEaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBnaXRDbWQgZnJvbSBcIi4uL2dpdC1jbWRcIjtcbmltcG9ydCBEaWFsb2cgZnJvbSBcIi4vRGlhbG9nXCI7XG5pbXBvcnQgZXRjaCBmcm9tIFwiZXRjaFwiO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSBcIi4uL05vdGlmaWNhdGlvbnNcIjtcbmltcG9ydCB7cHJvbWlzaWZ5fSBmcm9tIFwicHJvbWlzaWZpY2F0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsZXRlQnJhbmNoRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuXHRpbml0aWFsU3RhdGUocHJvcHMpIHtcblx0XHRpZiAoIXByb3BzLnJvb3QpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk11c3Qgc3BlY2lmeSBhIHtyb290fSBwcm9wZXJ0eVwiKTtcblx0XHR9XG5cblx0XHR0aGlzLmdpdCA9IHByb3BzLmdpdCB8fCBnaXRDbWQ7XG5cdFx0dGhpcy5ub3RpZmljYXRpb25zID0gcHJvcHMubm90aWZpY2F0aW9ucyB8fCBOb3RpZmljYXRpb25zO1xuXG5cdFx0Y29uc3Qgc3RhdGUgPSB7XG5cdFx0XHRicmFuY2hlczogcHJvcHMuYnJhbmNoZXMgfHwgW10sXG5cdFx0XHRicmFuY2g6IFwiXCIsXG5cdFx0XHRsb2NhbDogdHJ1ZSxcblx0XHRcdHJlbW90ZTogZmFsc2UsXG5cdFx0XHRmb3JjZTogZmFsc2UsXG5cdFx0XHRyb290OiBwcm9wcy5yb290LFxuXHRcdFx0ZmV0Y2hpbmc6IGZhbHNlLFxuXHRcdH07XG5cblx0XHRjb25zdCBicmFuY2ggPSBzdGF0ZS5icmFuY2hlcy5maW5kKGIgPT4gYi5zZWxlY3RlZCk7XG5cdFx0c3RhdGUuYnJhbmNoID0gYnJhbmNoID8gYnJhbmNoLm5hbWUgOiBcIlwiO1xuXG5cdFx0cmV0dXJuIHN0YXRlO1xuXHR9XG5cblx0YXN5bmMgdmFsaWRhdGUoc3RhdGUpIHtcblx0XHRpZiAoIXN0YXRlLmJyYW5jaCkge1xuXHRcdFx0dGhpcy5yZWZzLmJyYW5jaElucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBicmFuY2ggPSBzdGF0ZS5icmFuY2hlcy5maW5kKGIgPT4gYi5uYW1lID09PSBzdGF0ZS5icmFuY2gpIHx8IHt9O1xuXHRcdGNvbnN0IGxvY2FsID0gISEoYnJhbmNoLmxvY2FsICYmIHN0YXRlLmxvY2FsKTtcblx0XHRjb25zdCByZW1vdGUgPSAhIShicmFuY2gucmVtb3RlICYmIHN0YXRlLnJlbW90ZSk7XG5cblx0XHRpZiAoc3RhdGUuZm9yY2UgJiYgKCFicmFuY2gubG9jYWwgfHwgc3RhdGUubG9jYWwpICYmICghYnJhbmNoLnJlbW90ZSB8fCBzdGF0ZS5yZW1vdGUpKSB7XG5cdFx0XHRjb25zdCBicmFuY2hlcyA9IFtcblx0XHRcdFx0bG9jYWwgPyBzdGF0ZS5icmFuY2ggOiBudWxsLFxuXHRcdFx0XHRyZW1vdGUgPyBgb3JpZ2luLyR7c3RhdGUuYnJhbmNofWAgOiBudWxsLFxuXHRcdFx0XS5maWx0ZXIoaSA9PiBpKS5qb2luKFwiXFxuXCIpO1xuXHRcdFx0Y29uc3QgW2NvbmZpcm1CdXR0b24sIGhpZGVEaWFsb2ddID0gYXdhaXQgcHJvbWlzaWZ5KGF0b20uY29uZmlybS5iaW5kKGF0b20pLCB7cmVqZWN0T25FcnJvcjogZmFsc2UsIGFsd2F5c1JldHVybkFycmF5OiB0cnVlfSkoe1xuXHRcdFx0XHR0eXBlOiBcIndhcm5pbmdcIixcblx0XHRcdFx0Y2hlY2tib3hMYWJlbDogXCJOZXZlciBTaG93IFRoaXMgRGlhbG9nIEFnYWluXCIsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGZvcmNlIGRlbGV0ZSB0aGUgb25seSB2ZXJzaW9uIG9mIHRoaXMgYnJhbmNoP1wiLFxuXHRcdFx0XHRkZXRhaWw6IGBZb3UgYXJlIGRlbGV0aW5nOlxcbiR7YnJhbmNoZXN9YCxcblx0XHRcdFx0YnV0dG9uczogW1xuXHRcdFx0XHRcdFwiRGVsZXRlIEJyYW5jaGVzXCIsXG5cdFx0XHRcdFx0XCJDYW5jZWxcIixcblx0XHRcdFx0XSxcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoaGlkZURpYWxvZykge1xuXHRcdFx0XHRhdG9tLmNvbmZpZy5zZXQoXCJnaXQtbWVudS5jb25maXJtYXRpb25EaWFsb2dzLmRlbGV0ZVJlbW90ZVwiLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY29uZmlybUJ1dHRvbiA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFticmFuY2gsIGxvY2FsLCByZW1vdGUsIHN0YXRlLmZvcmNlXTtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0dGhpcy5yZWZzLmJyYW5jaElucHV0LmZvY3VzKCk7XG5cdH1cblxuXHRhc3luYyBmZXRjaCgpIHtcblx0XHR0aGlzLnVwZGF0ZSh7ZmV0Y2hpbmc6IHRydWV9KTtcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgdGhpcy5naXQuZmV0Y2godGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgdGhpcy5naXQuYnJhbmNoZXModGhpcy5zdGF0ZS5yb290KTtcblx0XHRcdHRoaXMudXBkYXRlKHticmFuY2hlczogYnJhbmNoZXMsIGZldGNoaW5nOiBmYWxzZX0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRmV0Y2hcIiwgZXJyKTtcblx0XHRcdHRoaXMudXBkYXRlKHtmZXRjaGluZzogZmFsc2V9KTtcblx0XHR9XG5cdH1cblxuXHRicmFuY2hDaGFuZ2UoZSkge1xuXHRcdHRoaXMucmVmcy5icmFuY2hJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3JcIik7XG5cdFx0dGhpcy51cGRhdGUoe2JyYW5jaDogZS50YXJnZXQudmFsdWV9KTtcblx0fVxuXG5cdHJlbW90ZUNoYW5nZShlKSB7XG5cdFx0dGhpcy51cGRhdGUoe3JlbW90ZTogZS50YXJnZXQuY2hlY2tlZH0pO1xuXHR9XG5cblx0bG9jYWxDaGFuZ2UoZSkge1xuXHRcdHRoaXMudXBkYXRlKHtsb2NhbDogZS50YXJnZXQuY2hlY2tlZH0pO1xuXHR9XG5cblx0Zm9yY2VDaGFuZ2UoZSkge1xuXHRcdHRoaXMudXBkYXRlKHtmb3JjZTogZS50YXJnZXQuY2hlY2tlZH0pO1xuXHR9XG5cblx0Ym9keSgpIHtcblx0XHRsZXQgYnJhbmNoT3B0aW9ucztcblx0XHRpZiAodGhpcy5zdGF0ZS5mZXRjaGluZykge1xuXHRcdFx0YnJhbmNoT3B0aW9ucyA9IChcblx0XHRcdFx0PG9wdGlvbj5GZXRjaGluZy4uLjwvb3B0aW9uPlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnJhbmNoT3B0aW9ucyA9IHRoaXMuc3RhdGUuYnJhbmNoZXMubWFwKGIgPT4gKFxuXHRcdFx0XHQ8b3B0aW9uIHZhbHVlPXtiLm5hbWV9IHNlbGVjdGVkPXtiLm5hbWUgPT09IHRoaXMuc3RhdGUuYnJhbmNofT57Yi5icmFuY2h9PC9vcHRpb24+XG5cdFx0XHQpKTtcblx0XHR9XG5cblx0XHRjb25zdCBicmFuY2ggPSB0aGlzLnN0YXRlLmJyYW5jaGVzLmZpbmQoYiA9PiBiLm5hbWUgPT09IHRoaXMuc3RhdGUuYnJhbmNoKTtcblx0XHRjb25zdCBsb2NhbCA9IGJyYW5jaCA/IGJyYW5jaC5sb2NhbCA6IGZhbHNlO1xuXHRcdGNvbnN0IHJlbW90ZSA9IGJyYW5jaCA/IGJyYW5jaC5yZW1vdGUgOiBmYWxzZTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIj5cblx0XHRcdFx0XHQ8c2VsZWN0IHJlZj1cImJyYW5jaElucHV0XCIgdGFiSW5kZXg9XCIxXCIgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1zZWxlY3RcIiB2YWx1ZT17dGhpcy5zdGF0ZS5icmFuY2h9IGRpc2FibGVkPXt0aGlzLnN0YXRlLmZldGNoaW5nfSBvbj17e2NoYW5nZTogdGhpcy5icmFuY2hDaGFuZ2V9fT5cblx0XHRcdFx0XHRcdHticmFuY2hPcHRpb25zfVxuXHRcdFx0XHRcdDwvc2VsZWN0PlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPXtgaW5wdXQtbGFiZWwgY2hlY2tib3gtbGFiZWwgJHtsb2NhbCA/IFwiXCIgOiBcImlucHV0LWRpc2FibGVkXCJ9YH0+XG5cdFx0XHRcdFx0PGlucHV0IGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgaW5wdXQtY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIiB0YWJJbmRleD1cIjJcIiBkaXNhYmxlZD17IWxvY2FsfSBjaGVja2VkPXtsb2NhbCAmJiB0aGlzLnN0YXRlLmxvY2FsfSBvbj17e2NoYW5nZTogdGhpcy5sb2NhbENoYW5nZX19IC8+XG5cdFx0XHRcdFx0RGVsZXRlIGxvY2FsIGJyYW5jaCB7dGhpcy5zdGF0ZS5icmFuY2h9XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9e2BpbnB1dC1sYWJlbCBjaGVja2JveC1sYWJlbCAke3JlbW90ZSA/IFwiXCIgOiBcImlucHV0LWRpc2FibGVkXCJ9YH0+XG5cdFx0XHRcdFx0PGlucHV0IGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgaW5wdXQtY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIiB0YWJJbmRleD1cIjNcIiBkaXNhYmxlZD17IXJlbW90ZX0gY2hlY2tlZD17cmVtb3RlICYmIHRoaXMuc3RhdGUucmVtb3RlfSBvbj17e2NoYW5nZTogdGhpcy5yZW1vdGVDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdERlbGV0ZSByZW1vdGUgYnJhbmNoIG9yaWdpbi97dGhpcy5zdGF0ZS5icmFuY2h9XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbCBjaGVja2JveC1sYWJlbFwiPlxuXHRcdFx0XHRcdDxpbnB1dCBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGlucHV0LWNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCIgdGFiSW5kZXg9XCI0XCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5mb3JjZX0gb249e3tjaGFuZ2U6IHRoaXMuZm9yY2VDaGFuZ2V9fSAvPlxuXHRcdFx0XHRcdEZvcmNlXG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG5cblx0dGl0bGUoKSB7XG5cdFx0cmV0dXJuIFwiRGVsZXRlIEJyYW5jaFwiO1xuXHR9XG5cblx0YnV0dG9ucygpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGJ0biBpY29uIGljb24tZ2l0LWJyYW5jaCBpbmxpbmUtYmxvY2stdGlnaHRcIiB0YWJJbmRleD1cIjVcIiBvbj17e2NsaWNrOiB0aGlzLmFjY2VwdH19IGRpc2FibGVkPXt0aGlzLnN0YXRlLmZldGNoaW5nfT5cblx0XHRcdFx0XHREZWxldGUgQnJhbmNoXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgYnRuIGljb24gaWNvbi1yZXBvLXN5bmMgaW5saW5lLWJsb2NrLXRpZ2h0XCIgdGFiSW5kZXg9XCI2XCIgb249e3tjbGljazogdGhpcy5mZXRjaH19IGRpc2FibGVkPXt0aGlzLnN0YXRlLmZldGNoaW5nfT5cblx0XHRcdFx0XHRGZXRjaFxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==