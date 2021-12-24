Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @babel */

/** @jsx etch.dom */

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var _atom = require("atom");

var Dialog = (function () {
	function Dialog() {
		var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Dialog);

		this.disposables = new _atom.CompositeDisposable();

		this.state = this.initialState(props);

		_etch2["default"].initialize(this);

		this.disposables.add(atom.tooltips.add(this.refs.close, {
			title: "Close",
			keyBindingCommand: "core:cancel"
		}));
	}

	_createClass(Dialog, [{
		key: "update",
		value: function update(props) {
			if (props) {
				this.setState(props);
			}

			return _etch2["default"].update(this);
		}
	}, {
		key: "destroy",
		value: function destroy() {
			this.disposables.dispose();
			return _etch2["default"].destroy(this);
		}
	}, {
		key: "setState",
		value: function setState(state) {
			this.state = Object.assign({}, this.state, state);
		}
	}, {
		key: "activate",
		value: function activate() {
			var _this = this;

			this.lastActiveItem = atom.document.activeElement;
			this.modalPanel = atom.workspace.addModalPanel({ item: this });
			this.show();

			return new Promise(function (resolve, reject) {
				_this.resolve = resolve;
				_this.reject = reject;
			});
		}
	}, {
		key: "deactivate",
		value: function deactivate() {
			this.hide();
			this.modalPanel.destroy();
			this.lastActiveItem.focus();
			this.destroy();
		}
	}, {
		key: "keyup",
		value: function keyup(e) {
			switch (e.key) {
				case "Escape":
					this.cancel();
					break;
				default:
				// do nothing
			}
		}
	}, {
		key: "cancel",
		value: function cancel() {
			this.reject();
			this.deactivate();
		}
	}, {
		key: "accept",
		value: _asyncToGenerator(function* () {
			var result = yield this.validate(this.state);
			if (!Array.isArray(result)) {
				return;
			}
			this.resolve(result);
			this.deactivate();
		})
	}, {
		key: "render",
		value: function render() {

			var title = this.title();
			var titleClass = title.toLowerCase().replace(/\W/g, "-");

			return _etch2["default"].dom(
				"div",
				{ className: "dialog git-menu " + titleClass, on: { keyup: this.keyup } },
				_etch2["default"].dom(
					"div",
					{ className: "heading" },
					_etch2["default"].dom("i", { className: "icon icon-x clickable", on: { click: this.cancel }, ref: "close" }),
					_etch2["default"].dom(
						"h1",
						{ className: "title" },
						title
					)
				),
				_etch2["default"].dom(
					"div",
					{ className: "body" },
					this.body()
				),
				_etch2["default"].dom(
					"div",
					{ className: "buttons" },
					this.buttons()
				)
			);
		}
	}, {
		key: "initialState",
		value: function initialState(props) {
			// Subclass can override this initialState() method
			return props;
		}

		// eslint-disable-next-line no-unused-vars
	}, {
		key: "validate",
		value: function validate(state) {
			throw new Error("Subclass must implement a validate(state) method");
		}
	}, {
		key: "title",
		value: function title() {
			throw new Error("Subclass must implement a title() method");
		}
	}, {
		key: "body",
		value: function body() {
			throw new Error("Subclass must implement a body() method");
		}
	}, {
		key: "buttons",
		value: function buttons() {
			throw new Error("Subclass must implement a buttons() method");
		}
	}, {
		key: "show",
		value: function show() {
			// Subclass can override this show() method
		}
	}, {
		key: "hide",
		value: function hide() {
			// Subclass can override this hide() method
		}
	}, {
		key: "beforeInitialize",
		value: function beforeInitialize() {
			// Subclass can override this beforeInitialize() method
		}
	}]);

	return Dialog;
})();

exports["default"] = Dialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9EaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFJaUIsTUFBTTs7OztvQkFDVyxNQUFNOztJQUVuQixNQUFNO0FBQ2YsVUFEUyxNQUFNLEdBQ0Y7TUFBWixLQUFLLHlEQUFHLEVBQUU7O3dCQURGLE1BQU07O0FBR3pCLE1BQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7O0FBRTdDLE1BQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsb0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QixNQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN2RCxRQUFLLEVBQUUsT0FBTztBQUNkLG9CQUFpQixFQUFFLGFBQWE7R0FDaEMsQ0FBQyxDQUFDLENBQUM7RUFDSjs7Y0FibUIsTUFBTTs7U0FlcEIsZ0JBQUMsS0FBSyxFQUFFO0FBQ2IsT0FBSSxLQUFLLEVBQUU7QUFDVixRQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCOztBQUVELFVBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3pCOzs7U0FFTSxtQkFBRztBQUNULE9BQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0IsVUFBTyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUI7OztTQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNmLE9BQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztHQUNs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RUcsZ0JBQUc7O0dBRU47OztTQUVlLDRCQUFHOztHQUVsQjs7O1FBaEltQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2RpYWxvZ3MvRGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tIFwiZXRjaFwiO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tIFwiYXRvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG5cblx0XHR0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZShwcm9wcyk7XG5cblx0XHRldGNoLmluaXRpYWxpemUodGhpcyk7XG5cblx0XHR0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLnJlZnMuY2xvc2UsIHtcblx0XHRcdHRpdGxlOiBcIkNsb3NlXCIsXG5cdFx0XHRrZXlCaW5kaW5nQ29tbWFuZDogXCJjb3JlOmNhbmNlbFwiLFxuXHRcdH0pKTtcblx0fVxuXG5cdHVwZGF0ZShwcm9wcykge1xuXHRcdGlmIChwcm9wcykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShwcm9wcyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcblx0XHRyZXR1cm4gZXRjaC5kZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0c2V0U3RhdGUoc3RhdGUpIHtcblx0XHR0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgc3RhdGUpO1xuXHR9XG5cblx0YWN0aXZhdGUoKSB7XG5cdFx0dGhpcy5sYXN0QWN0aXZlSXRlbSA9IGF0b20uZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR0aGlzLm1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiB0aGlzfSk7XG5cdFx0dGhpcy5zaG93KCk7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHR9XG5cblx0ZGVhY3RpdmF0ZSgpIHtcblx0XHR0aGlzLmhpZGUoKTtcblx0XHR0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuXHRcdHRoaXMubGFzdEFjdGl2ZUl0ZW0uZm9jdXMoKTtcblx0XHR0aGlzLmRlc3Ryb3koKTtcblx0fVxuXG5cdGtleXVwKGUpIHtcblx0XHRzd2l0Y2ggKGUua2V5KSB7XG5cdFx0Y2FzZSBcIkVzY2FwZVwiOlxuXHRcdFx0dGhpcy5jYW5jZWwoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vIGRvIG5vdGhpbmdcblx0XHR9XG5cdH1cblxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpcy5yZWplY3QoKTtcblx0XHR0aGlzLmRlYWN0aXZhdGUoKTtcblx0fVxuXG5cdGFzeW5jIGFjY2VwdCgpIHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnZhbGlkYXRlKHRoaXMuc3RhdGUpO1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMucmVzb2x2ZShyZXN1bHQpO1xuXHRcdHRoaXMuZGVhY3RpdmF0ZSgpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXG5cdFx0Y29uc3QgdGl0bGUgPSB0aGlzLnRpdGxlKCk7XG5cdFx0Y29uc3QgdGl0bGVDbGFzcyA9IHRpdGxlLnRvTG93ZXJDYXNlKClcblx0XHRcdC5yZXBsYWNlKC9cXFcvZywgXCItXCIpO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtgZGlhbG9nIGdpdC1tZW51ICR7dGl0bGVDbGFzc31gfSBvbj17e2tleXVwOiB0aGlzLmtleXVwfX0+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGluZ1wiPlxuXHRcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi14IGNsaWNrYWJsZVwiIG9uPXt7Y2xpY2s6IHRoaXMuY2FuY2VsfX0gcmVmPVwiY2xvc2VcIj48L2k+XG5cdFx0XHRcdFx0PGgxIGNsYXNzTmFtZT1cInRpdGxlXCI+e3RpdGxlfTwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImJvZHlcIj5cblx0XHRcdFx0XHR7dGhpcy5ib2R5KCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cblx0XHRcdFx0XHR7dGhpcy5idXR0b25zKCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG5cdGluaXRpYWxTdGF0ZShwcm9wcykge1xuXHRcdC8vIFN1YmNsYXNzIGNhbiBvdmVycmlkZSB0aGlzIGluaXRpYWxTdGF0ZSgpIG1ldGhvZFxuXHRcdHJldHVybiBwcm9wcztcblx0fVxuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXHR2YWxpZGF0ZShzdGF0ZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlN1YmNsYXNzIG11c3QgaW1wbGVtZW50IGEgdmFsaWRhdGUoc3RhdGUpIG1ldGhvZFwiKTtcblx0fVxuXG5cdHRpdGxlKCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlN1YmNsYXNzIG11c3QgaW1wbGVtZW50IGEgdGl0bGUoKSBtZXRob2RcIik7XG5cdH1cblxuXHRib2R5KCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlN1YmNsYXNzIG11c3QgaW1wbGVtZW50IGEgYm9keSgpIG1ldGhvZFwiKTtcblx0fVxuXG5cdGJ1dHRvbnMoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiU3ViY2xhc3MgbXVzdCBpbXBsZW1lbnQgYSBidXR0b25zKCkgbWV0aG9kXCIpO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHQvLyBTdWJjbGFzcyBjYW4gb3ZlcnJpZGUgdGhpcyBzaG93KCkgbWV0aG9kXG5cdH1cblxuXHRoaWRlKCkge1xuXHRcdC8vIFN1YmNsYXNzIGNhbiBvdmVycmlkZSB0aGlzIGhpZGUoKSBtZXRob2Rcblx0fVxuXG5cdGJlZm9yZUluaXRpYWxpemUoKSB7XG5cdFx0Ly8gU3ViY2xhc3MgY2FuIG92ZXJyaWRlIHRoaXMgYmVmb3JlSW5pdGlhbGl6ZSgpIG1ldGhvZFxuXHR9XG59XG4iXX0=