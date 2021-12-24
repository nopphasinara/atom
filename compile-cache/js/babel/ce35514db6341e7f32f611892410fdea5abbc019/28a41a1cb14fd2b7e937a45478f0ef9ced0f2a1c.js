Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @babel */

var _atom = require("atom");

var _commands = require("./commands");

var _commands2 = _interopRequireDefault(_commands);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _helper = require("./helper");

var _helper2 = _interopRequireDefault(_helper);

var _widgetsStatusBarManager = require("./widgets/StatusBarManager");

var _widgetsStatusBarManager2 = _interopRequireDefault(_widgetsStatusBarManager);

var _Notifications = require("./Notifications");

var _Notifications2 = _interopRequireDefault(_Notifications);

var _promisificator = require("promisificator");

exports["default"] = {
	config: _config2["default"],

	/**
  * Activate package
  * @return {void}
  */
	activate: function activate() {
		var _this = this;

		this.updateConfig();

		this.disposables = new _atom.CompositeDisposable();
		this.contextMenuDisposables = {};
		this.confirmationDialogs = {};

		this.statusBarManager = new _widgetsStatusBarManager2["default"]();
		this.disposables.add(new _atom.Disposable(function () {
			_this.statusBarManager.destroy();
			_this.statusBarManager = null;
		}));

		var _loop = function (command) {
			var cmd = _commands2["default"][command];

			// observe confirm dialog settings
			if (cmd.confirm) {
				_this.disposables.add(atom.config.observe("git-menu.confirmationDialogs." + command, function (value) {
					_this.confirmationDialogs[command] = value;
				}));
			} else {
				_this.confirmationDialogs[command] = false;
			}

			// add command
			_this.disposables.add(atom.commands.add("atom-workspace", "context-git:" + command, {
				didDispatch: function didDispatch(event) {
					_Notifications2["default"].addError("Deprecated Command", "'context-git:*' commands are deprecated. Please use 'git-menu:*' instead.");
					return _this.dispatchCommand(command, cmd)(event);
				},
				hiddenInCommandPalette: true
			}));
			_this.disposables.add(atom.commands.add("atom-workspace", "git-menu:" + command, _this.dispatchCommand(command, cmd)));

			if (cmd.label) {
				// add to context menu
				_this.disposables.add(atom.config.observe("git-menu.contextMenuItems." + command, function (value) {
					if (value) {
						_this.contextMenuDisposables[command] = atom.contextMenu.add({
							"atom-workspace, atom-text-editor, .tree-view, .tab-bar": [{
								label: "Git",
								submenu: [{
									label: cmd.label.replace(/&/g, "&&"),
									command: "git-menu:" + command
								}]
							}]
						});
						_this.disposables.add(_this.contextMenuDisposables[command]);
					} else {
						if (_this.contextMenuDisposables[command]) {
							_this.disposables.remove(_this.contextMenuDisposables[command]);
							_this.contextMenuDisposables[command].dispose();
							delete _this.contextMenuDisposables[command];
						}
					}
				}));
			}

			if (cmd.keymap) {
				// add key binding
				atom.keymaps.add("git-menu", {
					"atom-workspace": _defineProperty({}, cmd.keymap, "git-menu:" + command)
				});
			}
		};

		for (var command in _commands2["default"]) {
			_loop(command);
		}
	},

	/**
  * Deactivate package
  * @return {void}
  */
	deactivate: function deactivate() {
		this.disposables.dispose();
	},

	/**
  * Copy config from context-git to git-menu
  * @return {void}
  */
	updateConfig: function updateConfig() {
		try {
			var hasGitMenuConfig = ("git-menu" in atom.config.settings);
			var hasContextGitConfig = ("context-git" in atom.config.settings);
			if (hasGitMenuConfig || !hasContextGitConfig) {
				return;
			}

			var contextGitConfig = atom.config.getAll("context-git");
			contextGitConfig.forEach(function (cfg) {
				var scopeSelector = cfg.scopeSelector;

				if (scopeSelector === "*") {
					scopeSelector = null;
				}
				for (var key in cfg.value) {
					var value = cfg.value[key];
					atom.config.set("git-menu." + key, value, { scopeSelector: scopeSelector });
				}
			});
		} catch (ex) {
			// fail silently
		}
	},

	/**
  * Consume the status bar service
  * @param  {mixed} statusBar Status bar service
  * @return {void}
  */
	statusBarService: function statusBarService(statusBar) {
		if (this.statusBarManager) {
			this.statusBarManager.addStatusBar(statusBar);
		}
	},

	/**
  * Consume the busy signal service
  * @param  {mixed} busySignal Busy signal service
  * @return {void}
  */
	busySignalService: function busySignalService(busySignal) {
		if (this.statusBarManager) {
			this.statusBarManager.addBusySignal(busySignal);
		}
	},

	dispatchCommand: function dispatchCommand(command, cmd) {
		var _this2 = this;

		return _asyncToGenerator(function* (event) {
			try {
				_this2.statusBarManager.show(cmd.label, { revealTooltip: false });
				var filePaths = _helper2["default"].getPaths(event.target);

				// show confirm dialog if applicable
				if (_this2.confirmationDialogs[command]) {
					var message = cmd.confirm.message;
					var detail = cmd.confirm.detail;

					if (typeof detail === "function") {
						detail = yield detail(filePaths);
					}

					var _ref = yield (0, _promisificator.promisify)(atom.confirm.bind(atom), { rejectOnError: false, alwaysReturnArray: true })({
						type: "warning",
						checkboxLabel: "Never Show This Dialog Again",
						message: message,
						detail: detail,
						buttons: [cmd.label, "Cancel"]
					});

					var _ref2 = _slicedToArray(_ref, 2);

					var confirmButton = _ref2[0];
					var hideDialog = _ref2[1];

					if (hideDialog) {
						atom.config.set("git-menu.confirmationDialogs." + command, false);
					}
					if (confirmButton === 1) {
						return;
					}
				}

				try {
					// run command

					var _ref3 = yield cmd.command(filePaths, _this2.statusBarManager);

					var title = _ref3.title;
					var message = _ref3.message;

					if (message) {
						_Notifications2["default"].addSuccess(title, message);
					}
				} catch (err) {
					if (err) {
						var message = err.stack ? err.stack : err.toString();
						_Notifications2["default"].addError("Git Menu: " + cmd.label, message);
					}
				}
			} finally {
				_this2.statusBarManager.hide();
			}
		});
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFLTyxNQUFNOzt3QkFDUSxZQUFZOzs7O3NCQUNkLFVBQVU7Ozs7c0JBQ1YsVUFBVTs7Ozt1Q0FDQSw0QkFBNEI7Ozs7NkJBQy9CLGlCQUFpQjs7Ozs4QkFDbkIsZ0JBQWdCOztxQkFFekI7QUFDZCxPQUFNLHFCQUFBOzs7Ozs7QUFNTixTQUFRLEVBQUEsb0JBQUc7OztBQUNWLE1BQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFcEIsTUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQztBQUM3QyxNQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7O0FBRTlCLE1BQUksQ0FBQyxnQkFBZ0IsR0FBRywwQ0FBc0IsQ0FBQztBQUMvQyxNQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFNO0FBQ3pDLFNBQUssZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEMsU0FBSyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7R0FDN0IsQ0FBQyxDQUFDLENBQUM7O3dCQUVPLE9BQU87QUFDakIsT0FBTSxHQUFHLEdBQUcsc0JBQVMsT0FBTyxDQUFDLENBQUM7OztBQUc5QixPQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDaEIsVUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxtQ0FBaUMsT0FBTyxFQUFJLFVBQUEsS0FBSyxFQUFJO0FBQzVGLFdBQUssbUJBQW1CLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0osTUFBTTtBQUNOLFVBQUssbUJBQW1CLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxD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R0FBRyxDQUFDLEtBQUssRUFBSSxPQUFPLENBQUMsQ0FBQztNQUMxRDtLQUNEO0lBQ0QsU0FBUztBQUNULFdBQUssZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0I7R0FDRCxFQUFDO0VBQ0Y7Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7XG5cdENvbXBvc2l0ZURpc3Bvc2FibGUsXG5cdERpc3Bvc2FibGUsXG59IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgY29tbWFuZHMgZnJvbSBcIi4vY29tbWFuZHNcIjtcbmltcG9ydCBjb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuL2hlbHBlclwiO1xuaW1wb3J0IFN0YXR1c0Jhck1hbmFnZXIgZnJvbSBcIi4vd2lkZ2V0cy9TdGF0dXNCYXJNYW5hZ2VyXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi9Ob3RpZmljYXRpb25zXCI7XG5pbXBvcnQge3Byb21pc2lmeX0gZnJvbSBcInByb21pc2lmaWNhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0Y29uZmlnLFxuXG5cdC8qKlxuXHQgKiBBY3RpdmF0ZSBwYWNrYWdlXG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqL1xuXHRhY3RpdmF0ZSgpIHtcblx0XHR0aGlzLnVwZGF0ZUNvbmZpZygpO1xuXG5cdFx0dGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0dGhpcy5jb250ZXh0TWVudURpc3Bvc2FibGVzID0ge307XG5cdFx0dGhpcy5jb25maXJtYXRpb25EaWFsb2dzID0ge307XG5cblx0XHR0aGlzLnN0YXR1c0Jhck1hbmFnZXIgPSBuZXcgU3RhdHVzQmFyTWFuYWdlcigpO1xuXHRcdHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcblx0XHRcdHRoaXMuc3RhdHVzQmFyTWFuYWdlci5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLnN0YXR1c0Jhck1hbmFnZXIgPSBudWxsO1xuXHRcdH0pKTtcblxuXHRcdGZvciAoY29uc3QgY29tbWFuZCBpbiBjb21tYW5kcykge1xuXHRcdFx0Y29uc3QgY21kID0gY29tbWFuZHNbY29tbWFuZF07XG5cblx0XHRcdC8vIG9ic2VydmUgY29uZmlybSBkaWFsb2cgc2V0dGluZ3Ncblx0XHRcdGlmIChjbWQuY29uZmlybSkge1xuXHRcdFx0XHR0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGBnaXQtbWVudS5jb25maXJtYXRpb25EaWFsb2dzLiR7Y29tbWFuZH1gLCB2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5jb25maXJtYXRpb25EaWFsb2dzW2NvbW1hbmRdID0gdmFsdWU7XG5cdFx0XHRcdH0pKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY29uZmlybWF0aW9uRGlhbG9nc1tjb21tYW5kXSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhZGQgY29tbWFuZFxuXHRcdFx0dGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCBgY29udGV4dC1naXQ6JHtjb21tYW5kfWAsIHtcblx0XHRcdFx0ZGlkRGlzcGF0Y2g6IChldmVudCkgPT4ge1xuXHRcdFx0XHRcdE5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJEZXByZWNhdGVkIENvbW1hbmRcIiwgXCInY29udGV4dC1naXQ6KicgY29tbWFuZHMgYXJlIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgJ2dpdC1tZW51OionIGluc3RlYWQuXCIpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRpc3BhdGNoQ29tbWFuZChjb21tYW5kLCBjbWQpKGV2ZW50KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0aGlkZGVuSW5Db21tYW5kUGFsZXR0ZTogdHJ1ZSxcblx0XHRcdH0pKTtcblx0XHRcdHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwgYGdpdC1tZW51OiR7Y29tbWFuZH1gLCB0aGlzLmRpc3BhdGNoQ29tbWFuZChjb21tYW5kLCBjbWQpKSk7XG5cblx0XHRcdGlmIChjbWQubGFiZWwpIHtcblx0XHRcdFx0Ly8gYWRkIHRvIGNvbnRleHQgbWVudVxuXHRcdFx0XHR0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGBnaXQtbWVudS5jb250ZXh0TWVudUl0ZW1zLiR7Y29tbWFuZH1gLCB2YWx1ZSA9PiB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmNvbnRleHRNZW51RGlzcG9zYWJsZXNbY29tbWFuZF0gPSBhdG9tLmNvbnRleHRNZW51LmFkZCh7XG5cdFx0XHRcdFx0XHRcdFwiYXRvbS13b3Jrc3BhY2UsIGF0b20tdGV4dC1lZGl0b3IsIC50cmVlLXZpZXcsIC50YWItYmFyXCI6IFt7XG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IFwiR2l0XCIsXG5cdFx0XHRcdFx0XHRcdFx0c3VibWVudTogW3tcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBjbWQubGFiZWwucmVwbGFjZSgvJi9nLCBcIiYmXCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tbWFuZDogYGdpdC1tZW51OiR7Y29tbWFuZH1gLFxuXHRcdFx0XHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRcdFx0XHR9XSxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5jb250ZXh0TWVudURpc3Bvc2FibGVzW2NvbW1hbmRdKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuY29udGV4dE1lbnVEaXNwb3NhYmxlc1tjb21tYW5kXSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmRpc3Bvc2FibGVzLnJlbW92ZSh0aGlzLmNvbnRleHRNZW51RGlzcG9zYWJsZXNbY29tbWFuZF0pO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmNvbnRleHRNZW51RGlzcG9zYWJsZXNbY29tbWFuZF0uZGlzcG9zZSgpO1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5jb250ZXh0TWVudURpc3Bvc2FibGVzW2NvbW1hbmRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY21kLmtleW1hcCkge1xuXHRcdFx0XHQvLyBhZGQga2V5IGJpbmRpbmdcblx0XHRcdFx0YXRvbS5rZXltYXBzLmFkZChcImdpdC1tZW51XCIsIHtcblx0XHRcdFx0XHRcImF0b20td29ya3NwYWNlXCI6IHtcblx0XHRcdFx0XHRcdFtjbWQua2V5bWFwXTogYGdpdC1tZW51OiR7Y29tbWFuZH1gLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGVhY3RpdmF0ZSBwYWNrYWdlXG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqL1xuXHRkZWFjdGl2YXRlKCkge1xuXHRcdHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDb3B5IGNvbmZpZyBmcm9tIGNvbnRleHQtZ2l0IHRvIGdpdC1tZW51XG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqL1xuXHR1cGRhdGVDb25maWcoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGhhc0dpdE1lbnVDb25maWcgPSBcImdpdC1tZW51XCIgaW4gYXRvbS5jb25maWcuc2V0dGluZ3M7XG5cdFx0XHRjb25zdCBoYXNDb250ZXh0R2l0Q29uZmlnID0gXCJjb250ZXh0LWdpdFwiIGluIGF0b20uY29uZmlnLnNldHRpbmdzO1xuXHRcdFx0aWYgKGhhc0dpdE1lbnVDb25maWcgfHwgIWhhc0NvbnRleHRHaXRDb25maWcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb250ZXh0R2l0Q29uZmlnID0gYXRvbS5jb25maWcuZ2V0QWxsKFwiY29udGV4dC1naXRcIik7XG5cdFx0XHRjb250ZXh0R2l0Q29uZmlnLmZvckVhY2goKGNmZykgPT4ge1xuXHRcdFx0XHRsZXQge3Njb3BlU2VsZWN0b3J9ID0gY2ZnO1xuXHRcdFx0XHRpZiAoc2NvcGVTZWxlY3RvciA9PT0gXCIqXCIpIHtcblx0XHRcdFx0XHRzY29wZVNlbGVjdG9yID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGNvbnN0IGtleSBpbiBjZmcudmFsdWUpIHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGNmZy52YWx1ZVtrZXldO1xuXHRcdFx0XHRcdGF0b20uY29uZmlnLnNldChgZ2l0LW1lbnUuJHtrZXl9YCwgdmFsdWUsIHtzY29wZVNlbGVjdG9yfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHQvLyBmYWlsIHNpbGVudGx5XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDb25zdW1lIHRoZSBzdGF0dXMgYmFyIHNlcnZpY2Vcblx0ICogQHBhcmFtICB7bWl4ZWR9IHN0YXR1c0JhciBTdGF0dXMgYmFyIHNlcnZpY2Vcblx0ICogQHJldHVybiB7dm9pZH1cblx0ICovXG5cdHN0YXR1c0JhclNlcnZpY2Uoc3RhdHVzQmFyKSB7XG5cdFx0aWYgKHRoaXMuc3RhdHVzQmFyTWFuYWdlcikge1xuXHRcdFx0dGhpcy5zdGF0dXNCYXJNYW5hZ2VyLmFkZFN0YXR1c0JhcihzdGF0dXNCYXIpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ29uc3VtZSB0aGUgYnVzeSBzaWduYWwgc2VydmljZVxuXHQgKiBAcGFyYW0gIHttaXhlZH0gYnVzeVNpZ25hbCBCdXN5IHNpZ25hbCBzZXJ2aWNlXG5cdCAqIEByZXR1cm4ge3ZvaWR9XG5cdCAqL1xuXHRidXN5U2lnbmFsU2VydmljZShidXN5U2lnbmFsKSB7XG5cdFx0aWYgKHRoaXMuc3RhdHVzQmFyTWFuYWdlcikge1xuXHRcdFx0dGhpcy5zdGF0dXNCYXJNYW5hZ2VyLmFkZEJ1c3lTaWduYWwoYnVzeVNpZ25hbCk7XG5cdFx0fVxuXHR9LFxuXG5cdGRpc3BhdGNoQ29tbWFuZChjb21tYW5kLCBjbWQpIHtcblx0XHRyZXR1cm4gYXN5bmMgZXZlbnQgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5zdGF0dXNCYXJNYW5hZ2VyLnNob3coY21kLmxhYmVsLCB7cmV2ZWFsVG9vbHRpcDogZmFsc2V9KTtcblx0XHRcdFx0Y29uc3QgZmlsZVBhdGhzID0gaGVscGVyLmdldFBhdGhzKGV2ZW50LnRhcmdldCk7XG5cblx0XHRcdFx0Ly8gc2hvdyBjb25maXJtIGRpYWxvZyBpZiBhcHBsaWNhYmxlXG5cdFx0XHRcdGlmICh0aGlzLmNvbmZpcm1hdGlvbkRpYWxvZ3NbY29tbWFuZF0pIHtcblx0XHRcdFx0XHRjb25zdCB7bWVzc2FnZX0gPSBjbWQuY29uZmlybTtcblx0XHRcdFx0XHRsZXQge2RldGFpbH0gPSBjbWQuY29uZmlybTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGRldGFpbCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRkZXRhaWwgPSBhd2FpdCBkZXRhaWwoZmlsZVBhdGhzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBbY29uZmlybUJ1dHRvbiwgaGlkZURpYWxvZ10gPSBhd2FpdCBwcm9taXNpZnkoYXRvbS5jb25maXJtLmJpbmQoYXRvbSksIHtyZWplY3RPbkVycm9yOiBmYWxzZSwgYWx3YXlzUmV0dXJuQXJyYXk6IHRydWV9KSh7XG5cdFx0XHRcdFx0XHR0eXBlOiBcIndhcm5pbmdcIixcblx0XHRcdFx0XHRcdGNoZWNrYm94TGFiZWw6IFwiTmV2ZXIgU2hvdyBUaGlzIERpYWxvZyBBZ2FpblwiLFxuXHRcdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRcdGRldGFpbCxcblx0XHRcdFx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0XHRcdFx0Y21kLmxhYmVsLFxuXHRcdFx0XHRcdFx0XHRcIkNhbmNlbFwiLFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChoaWRlRGlhbG9nKSB7XG5cdFx0XHRcdFx0XHRhdG9tLmNvbmZpZy5zZXQoYGdpdC1tZW51LmNvbmZpcm1hdGlvbkRpYWxvZ3MuJHtjb21tYW5kfWAsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGNvbmZpcm1CdXR0b24gPT09IDEpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIHJ1biBjb21tYW5kXG5cdFx0XHRcdFx0Y29uc3Qge3RpdGxlLCBtZXNzYWdlfSA9IGF3YWl0IGNtZC5jb21tYW5kKGZpbGVQYXRocywgdGhpcy5zdGF0dXNCYXJNYW5hZ2VyKTtcblx0XHRcdFx0XHRpZiAobWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKHRpdGxlLCBtZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSAoZXJyLnN0YWNrID8gZXJyLnN0YWNrIDogZXJyLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdFx0Tm90aWZpY2F0aW9ucy5hZGRFcnJvcihgR2l0IE1lbnU6ICR7Y21kLmxhYmVsfWAsIG1lc3NhZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0dGhpcy5zdGF0dXNCYXJNYW5hZ2VyLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxufTtcbiJdfQ==