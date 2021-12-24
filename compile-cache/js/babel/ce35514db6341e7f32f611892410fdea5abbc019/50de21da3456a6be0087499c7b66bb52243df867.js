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

var _Dialog2 = require("./Dialog");

var _Dialog3 = _interopRequireDefault(_Dialog2);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var LogDialog = (function (_Dialog) {
	_inherits(LogDialog, _Dialog);

	function LogDialog() {
		_classCallCheck(this, LogDialog);

		_get(Object.getPrototypeOf(LogDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(LogDialog, [{
		key: "initialState",
		value: function initialState(props) {
			var state = {
				format: props.format,
				logs: "",
				offset: 0,
				loading: false,
				gitCmd: props.gitCmd,
				root: props.root,
				error: null
			};

			return state;
		}
	}, {
		key: "getLogs",
		value: _asyncToGenerator(function* () {
			this.update({
				loading: true,
				error: null
			});
			var format = this.state.format;

			format = format.replace(/\\n/g, "%n");

			// unescape slashes
			try {
				// add another escaped slash if the string ends with an odd
				// number of escaped slashes which will crash JSON.parse
				var parsedFormat = format.replace(/(?:^|[^\\])(?:\\\\)*\\$/, "$&\\");
				parsedFormat = JSON.parse("\"" + parsedFormat + "\"");
				format = parsedFormat;
			} catch (e) {
				// invalid json
			}

			try {
				var newLogs = yield this.state.gitCmd.log(this.state.root, 10, this.state.offset, format);
				this.update({
					logs: this.state.logs + "\n\n" + newLogs,
					offset: this.state.offset + 10,
					loading: false
				});
				if (this.state.format !== this.refs.formatInput.value) {
					this.formatChange({ target: this.refs.formatInput });
				} else if (newLogs.trim() !== "") {
					this.scroll({ target: this.refs.logs });
				}
			} catch (err) {
				this.update({
					loading: false,
					error: err
				});
			}
		})
	}, {
		key: "scroll",
		value: function scroll(e) {
			if (!this.state.loading && !this.state.error && e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 100) {
				this.getLogs();
			}
		}
	}, {
		key: "formatChange",
		value: function formatChange(e) {
			if (!this.state.loading) {
				this.update({
					format: e.target.value,
					logs: "",
					offset: 0
				});
				this.getLogs();
			}
		}
	}, {
		key: "show",
		value: function show() {
			this.disposables.add(atom.tooltips.add(this.refs.info, {
				title: "Open Log Format Info"
			}));

			this.refs.formatInput.focus();
			this.refs.formatInput.select();

			this.getLogs();
		}
	}, {
		key: "body",
		value: function body() {
			var message = this.state.logs;
			if (this.state.loading) {
				message += "\nLoading More...";
			}
			if (this.state.error) {
				message = this.state.error;
			}

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom("textarea", { ref: "logs", className: "logs input-textarea native-key-bindings", tabIndex: "1", attributes: { readonly: true }, value: message.trim(), on: { scroll: this.scroll } }),
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"Log Format",
					_etch2["default"].dom(
						"a",
						{ href: "https://git-scm.com/docs/git-log#_pretty_formats", className: "format-info", ref: "info", tabIndex: "2" },
						_etch2["default"].dom("i", { className: "icon icon-info" })
					),
					_etch2["default"].dom("input", { type: "text", ref: "formatInput", tabIndex: "3", className: "native-key-bindings input-text", value: this.state.format, on: { input: this.formatChange } })
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Git Log";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return null;
		}
	}]);

	return LogDialog;
})(_Dialog3["default"]);

exports["default"] = LogDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9Mb2dEaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBSW1CLFVBQVU7Ozs7b0JBQ1osTUFBTTs7OztJQUVGLFNBQVM7V0FBVCxTQUFTOztVQUFULFNBQVM7d0JBQVQsU0FBUzs7NkJBQVQsU0FBUzs7O2NBQVQsU0FBUzs7U0FFakIsc0JBQUMsS0FBSyxFQUFFO0FBQ25CLE9BQU0sS0FBSyxHQUFHO0FBQ2IsVUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ3BCLFFBQUksRUFBRSxFQUFFO0FBQ1IsVUFBTSxFQUFFLENBQUM7QUFDVCxXQUFPLEVBQUUsS0FBSztBQUNkLFVBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQixRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsU0FBSyxFQUFFLElBQUk7SUFDWCxDQUFDOztBQUVGLFVBQU8sS0FBSyxDQUFDO0dBQ2I7OzsyQkFFWSxhQUFHO0FBQ2YsT0FBSSxDQUFDLE1BQU0sQ0FBQztBQUNYLFdBQU8sRUFBRSxJQUFJO0FBQ2IsU0FBSyxFQUFFLElBQUk7SUFDWCxDQUFDLENBQUM7T0FDRSxNQUFNLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBcEIsTUFBTTs7QUFDWCxTQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7OztBQUd0QyxPQUFJOzs7QUFHSCxRQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JFLGdCQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssUUFBSyxZQUFZLFFBQUksQ0FBQztBQUMvQyxVQUFNLEdBQUcsWUFBWSxDQUFDO0lBQ3RCLENBQUMsT0FBTyxDQUFDLEVBQUU7O0lBRVg7O0FBRUQsT0FBSTtBQUNILFFBQU0s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QUMsVUFBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxBQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQUFBQyxFQUFDLEVBQUUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLEFBQUMsR0FBRztJQUN4Szs7T0FBTyxTQUFTLEVBQUMsYUFBYTs7S0FFN0I7O1FBQUcsSUFBSSxFQUFDLGtEQUFrRCxFQUFDLFNBQVMsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsR0FBRztNQUFDLDZCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsR0FBSztNQUFJO0tBQ2pKLGlDQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLGFBQWEsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxnQ0FBZ0MsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxBQUFDLEdBQUc7S0FDbEo7SUFDSCxDQUNMO0dBQ0Y7OztTQUVJLGlCQUFHO0FBQ1AsVUFBTyxTQUFTLENBQUM7R0FDakI7OztTQUVNLG1CQUFHO0FBQ1QsVUFBTyxJQUFJLENBQUM7R0FDWjs7O1FBOUdtQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2RpYWxvZ3MvTG9nRGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gXCIuL0RpYWxvZ1wiO1xuaW1wb3J0IGV0Y2ggZnJvbSBcImV0Y2hcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuXHRpbml0aWFsU3RhdGUocHJvcHMpIHtcblx0XHRjb25zdCBzdGF0ZSA9IHtcblx0XHRcdGZvcm1hdDogcHJvcHMuZm9ybWF0LFxuXHRcdFx0bG9nczogXCJcIixcblx0XHRcdG9mZnNldDogMCxcblx0XHRcdGxvYWRpbmc6IGZhbHNlLFxuXHRcdFx0Z2l0Q21kOiBwcm9wcy5naXRDbWQsXG5cdFx0XHRyb290OiBwcm9wcy5yb290LFxuXHRcdFx0ZXJyb3I6IG51bGwsXG5cdFx0fTtcblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxuXG5cdGFzeW5jIGdldExvZ3MoKSB7XG5cdFx0dGhpcy51cGRhdGUoe1xuXHRcdFx0bG9hZGluZzogdHJ1ZSxcblx0XHRcdGVycm9yOiBudWxsLFxuXHRcdH0pO1xuXHRcdGxldCB7Zm9ybWF0fSA9IHRoaXMuc3RhdGU7XG5cdFx0Zm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoL1xcXFxuL2csIFwiJW5cIik7XG5cblx0XHQvLyB1bmVzY2FwZSBzbGFzaGVzXG5cdFx0dHJ5IHtcblx0XHRcdC8vIGFkZCBhbm90aGVyIGVzY2FwZWQgc2xhc2ggaWYgdGhlIHN0cmluZyBlbmRzIHdpdGggYW4gb2RkXG5cdFx0XHQvLyBudW1iZXIgb2YgZXNjYXBlZCBzbGFzaGVzIHdoaWNoIHdpbGwgY3Jhc2ggSlNPTi5wYXJzZVxuXHRcdFx0bGV0IHBhcnNlZEZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKC8oPzpefFteXFxcXF0pKD86XFxcXFxcXFwpKlxcXFwkLywgXCIkJlxcXFxcIik7XG5cdFx0XHRwYXJzZWRGb3JtYXQgPSBKU09OLnBhcnNlKGBcIiR7cGFyc2VkRm9ybWF0fVwiYCk7XG5cdFx0XHRmb3JtYXQgPSBwYXJzZWRGb3JtYXQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Ly8gaW52YWxpZCBqc29uXG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IG5ld0xvZ3MgPSBhd2FpdCB0aGlzLnN0YXRlLmdpdENtZC5sb2codGhpcy5zdGF0ZS5yb290LCAxMCwgdGhpcy5zdGF0ZS5vZmZzZXQsIGZvcm1hdCk7XG5cdFx0XHR0aGlzLnVwZGF0ZSh7XG5cdFx0XHRcdGxvZ3M6IGAke3RoaXMuc3RhdGUubG9nc31cXG5cXG4ke25ld0xvZ3N9YCxcblx0XHRcdFx0b2Zmc2V0OiB0aGlzLnN0YXRlLm9mZnNldCArIDEwLFxuXHRcdFx0XHRsb2FkaW5nOiBmYWxzZSxcblx0XHRcdH0pO1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZm9ybWF0ICE9PSB0aGlzLnJlZnMuZm9ybWF0SW5wdXQudmFsdWUpIHtcblx0XHRcdFx0dGhpcy5mb3JtYXRDaGFuZ2Uoe3RhcmdldDogdGhpcy5yZWZzLmZvcm1hdElucHV0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKG5ld0xvZ3MudHJpbSgpICE9PSBcIlwiKSB7XG5cdFx0XHRcdHRoaXMuc2Nyb2xsKHt0YXJnZXQ6IHRoaXMucmVmcy5sb2dzfSk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHR0aGlzLnVwZGF0ZSh7XG5cdFx0XHRcdGxvYWRpbmc6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjogZXJyLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0c2Nyb2xsKGUpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGUubG9hZGluZyAmJiAhdGhpcy5zdGF0ZS5lcnJvciAmJiBlLnRhcmdldC5zY3JvbGxIZWlnaHQgLSBlLnRhcmdldC5zY3JvbGxUb3AgLSBlLnRhcmdldC5jbGllbnRIZWlnaHQgPCAxMDApIHtcblx0XHRcdHRoaXMuZ2V0TG9ncygpO1xuXHRcdH1cblx0fVxuXG5cdGZvcm1hdENoYW5nZShlKSB7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLmxvYWRpbmcpIHtcblx0XHRcdHRoaXMudXBkYXRlKHtcblx0XHRcdFx0Zm9ybWF0OiBlLnRhcmdldC52YWx1ZSxcblx0XHRcdFx0bG9nczogXCJcIixcblx0XHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmdldExvZ3MoKTtcblx0XHR9XG5cdH1cblxuXHRzaG93KCkge1xuXHRcdHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMucmVmcy5pbmZvLCB7XG5cdFx0XHR0aXRsZTogXCJPcGVuIExvZyBGb3JtYXQgSW5mb1wiLFxuXHRcdH0pKTtcblxuXHRcdHRoaXMucmVmcy5mb3JtYXRJbnB1dC5mb2N1cygpO1xuXHRcdHRoaXMucmVmcy5mb3JtYXRJbnB1dC5zZWxlY3QoKTtcblxuXHRcdHRoaXMuZ2V0TG9ncygpO1xuXHR9XG5cblx0Ym9keSgpIHtcblx0XHRsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGUubG9ncztcblx0XHRpZiAodGhpcy5zdGF0ZS5sb2FkaW5nKSB7XG5cdFx0XHRtZXNzYWdlICs9IFwiXFxuTG9hZGluZyBNb3JlLi4uXCI7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnN0YXRlLmVycm9yKSB7XG5cdFx0XHRtZXNzYWdlID0gdGhpcy5zdGF0ZS5lcnJvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PHRleHRhcmVhIHJlZj1cImxvZ3NcIiBjbGFzc05hbWU9XCJsb2dzIGlucHV0LXRleHRhcmVhIG5hdGl2ZS1rZXktYmluZGluZ3NcIiB0YWJJbmRleD1cIjFcIiBhdHRyaWJ1dGVzPXt7cmVhZG9ubHk6IHRydWV9fSB2YWx1ZT17bWVzc2FnZS50cmltKCl9IG9uPXt7c2Nyb2xsOiB0aGlzLnNjcm9sbH19IC8+XG5cdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiPlxuXHRcdFx0XHRcdExvZyBGb3JtYXRcblx0XHRcdFx0XHQ8YSBocmVmPVwiaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1sb2cjX3ByZXR0eV9mb3JtYXRzXCIgY2xhc3NOYW1lPVwiZm9ybWF0LWluZm9cIiByZWY9XCJpbmZvXCIgdGFiSW5kZXg9XCIyXCI+PGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWluZm9cIj48L2k+PC9hPlxuXHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlZj1cImZvcm1hdElucHV0XCIgdGFiSW5kZXg9XCIzXCIgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC10ZXh0XCIgdmFsdWU9e3RoaXMuc3RhdGUuZm9ybWF0fSBvbj17e2lucHV0OiB0aGlzLmZvcm1hdENoYW5nZX19IC8+XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG5cblx0dGl0bGUoKSB7XG5cdFx0cmV0dXJuIFwiR2l0IExvZ1wiO1xuXHR9XG5cblx0YnV0dG9ucygpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuIl19