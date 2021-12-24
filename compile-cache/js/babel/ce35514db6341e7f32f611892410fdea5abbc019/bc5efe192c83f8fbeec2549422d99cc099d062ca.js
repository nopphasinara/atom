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

var _widgetsAutocompleteJs = require("../widgets/Autocomplete.js");

var _widgetsAutocompleteJs2 = _interopRequireDefault(_widgetsAutocompleteJs);

var _widgetsFileTreeJs = require("../widgets/FileTree.js");

var _widgetsFileTreeJs2 = _interopRequireDefault(_widgetsFileTreeJs);

var RECENT_ITEM_KEY = "git-menu-run-command-recent";

var RunCommandDialog = (function (_Dialog) {
	_inherits(RunCommandDialog, _Dialog);

	function RunCommandDialog() {
		_classCallCheck(this, RunCommandDialog);

		_get(Object.getPrototypeOf(RunCommandDialog.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(RunCommandDialog, [{
		key: "getRecentItems",
		value: function getRecentItems() {
			var recentItems = [];
			try {
				recentItems = JSON.parse(localStorage.getItem(RECENT_ITEM_KEY));
			} catch (ex) {
				// invalid json
			}

			if (!Array.isArray(recentItems)) {
				recentItems = [];
			}

			return recentItems;
		}
	}, {
		key: "addRecentItem",
		value: function addRecentItem(item) {
			var recentItems = this.getRecentItems();

			// remove item from list
			recentItems = recentItems.filter(function (recentItem) {
				return recentItem !== item;
			});

			// add item to the top of the list
			recentItems.unshift(item);

			// maximum 100 items to prevent bloat
			recentItems.splice(100);

			try {
				localStorage.setItem(RECENT_ITEM_KEY, JSON.stringify(recentItems));
			} catch (ex) {
				// invalid json
			}
		}
	}, {
		key: "removeRecentItem",
		value: function removeRecentItem(item) {
			var recentItems = this.getRecentItems();
			recentItems = recentItems.filter(function (recentItem) {
				return recentItem !== item;
			});

			try {
				localStorage.setItem(RECENT_ITEM_KEY, JSON.stringify(recentItems));
			} catch (ex) {
				// invalid json
			}
		}
	}, {
		key: "initialState",
		value: function initialState(props) {
			var state = {
				files: props.files || [],
				command: "",
				recentItems: this.getRecentItems(),
				treeView: props.treeView
			};

			this.commandRemoveItem = this.commandRemoveItem.bind(this);
			this.commandChange = this.commandChange.bind(this);

			return state;
		}
	}, {
		key: "validate",
		value: function validate(state) {
			var error = false;
			if (!state.command) {
				error = true;
				this.refs.commandInput.refs.input.classList.add("error");
			}
			if (error) {
				return;
			}

			var files = this.refs.fileTree.getSelectedFiles();

			this.addRecentItem(state.command);

			return [state.command, files];
		}
	}, {
		key: "show",
		value: function show() {
			this.refs.commandInput.focus();
		}
	}, {
		key: "commandChange",
		value: function commandChange(e, value) {
			this.refs.commandInput.refs.input.classList.remove("error");
			this.update({ command: value });
		}
	}, {
		key: "commandRemoveItem",
		value: function commandRemoveItem(value, item) {
			this.removeRecentItem(item);
			this.update({ recentItems: this.getRecentItems(), command: value });
		}
	}, {
		key: "body",
		value: function body() {

			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(_widgetsFileTreeJs2["default"], { ref: "fileTree", files: this.state.files, tabIndexStart: "1", treeView: this.state.treeView }),
				_etch2["default"].dom(
					"label",
					{ className: "input-label" },
					"Command (use '%files%' to add the selected files to the command)",
					_etch2["default"].dom(_widgetsAutocompleteJs2["default"], { items: this.state.recentItems, removeButton: "true", onRemove: this.commandRemoveItem, maxItems: "10", ref: "commandInput", tabIndex: 1001, value: this.state.command, onChange: this.commandChange })
				)
			);
		}
	}, {
		key: "title",
		value: function title() {
			return "Run Command";
		}
	}, {
		key: "buttons",
		value: function buttons() {
			return _etch2["default"].dom(
				"div",
				null,
				_etch2["default"].dom(
					"button",
					{ className: "native-key-bindings btn icon icon-dashboard inline-block-tight", tabIndex: 1002, on: { click: this.accept } },
					"Run"
				)
			);
		}
	}]);

	return RunCommandDialog;
})(_Dialog3["default"]);

exports["default"] = RunCommandDialog;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9SdW5Db21tYW5kRGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFJbUIsVUFBVTs7OztvQkFDWixNQUFNOzs7O3FDQUNFLDRCQUE0Qjs7OztpQ0FDaEMsd0JBQXdCOzs7O0FBRTdDLElBQU0sZUFBZSxHQUFHLDZCQUE2QixDQUFDOztJQUVqQyxnQkFBZ0I7V0FBaEIsZ0JBQWdCOztVQUFoQixnQkFBZ0I7d0JBQWhCLGdCQUFnQjs7NkJBQWhCLGdCQUFnQjs7O2NBQWhCLGdCQUFnQjs7U0FFdEIsMEJBQUc7QUFDaEIsT0FBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE9BQUk7QUFDSCxlQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQyxPQUFPLEVBQUUsRUFBRTs7SUFFWjs7QUFFRCxPQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUNoQyxlQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ2pCOztBQUVELFVBQU8sV0FBVyxDQUFDO0dBQ25COzs7U0FFWSx1QkFBQyxJQUFJLEVBQUU7QUFDbkIsT0FBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDOzs7QUFHeEMsY0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxVQUFVO1dBQUksVUFBVSxLQUFLLElBQUk7SUFBQSxDQUFDLENBQUM7OztBQUdwRSxjQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHMUIsY0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFeEIsT0FBSTtBQUNILGdCQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FB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QUMsRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEFBQUMsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxjQUFjLEVBQUMsUUFBUSxFQUFFLElBQUksQUFBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxBQUFDLEdBQUc7S0FDeE07SUFDSCxDQUNMO0dBQ0Y7OztTQUVJLGlCQUFHO0FBQ1AsVUFBTyxhQUFhLENBQUM7R0FDckI7OztTQUVNLG1CQUFHO0FBQ1QsVUFDQzs7O0lBQ0M7O09BQVEsU0FBUyxFQUFDLGdFQUFnRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEFBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxBQUFDOztLQUVuSDtJQUNKLENBQ0w7R0FDRjs7O1FBeEhtQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvZGlhbG9ncy9SdW5Db21tYW5kRGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gXCIuL0RpYWxvZ1wiO1xuaW1wb3J0IGV0Y2ggZnJvbSBcImV0Y2hcIjtcbmltcG9ydCBBdXRvY29tcGxldGUgZnJvbSBcIi4uL3dpZGdldHMvQXV0b2NvbXBsZXRlLmpzXCI7XG5pbXBvcnQgRmlsZVRyZWUgZnJvbSBcIi4uL3dpZGdldHMvRmlsZVRyZWUuanNcIjtcblxuY29uc3QgUkVDRU5UX0lURU1fS0VZID0gXCJnaXQtbWVudS1ydW4tY29tbWFuZC1yZWNlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVuQ29tbWFuZERpYWxvZyBleHRlbmRzIERpYWxvZyB7XG5cblx0Z2V0UmVjZW50SXRlbXMoKSB7XG5cdFx0bGV0IHJlY2VudEl0ZW1zID0gW107XG5cdFx0dHJ5IHtcblx0XHRcdHJlY2VudEl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRUNFTlRfSVRFTV9LRVkpKTtcblx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0Ly8gaW52YWxpZCBqc29uXG5cdFx0fVxuXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHJlY2VudEl0ZW1zKSkge1xuXHRcdFx0cmVjZW50SXRlbXMgPSBbXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVjZW50SXRlbXM7XG5cdH1cblxuXHRhZGRSZWNlbnRJdGVtKGl0ZW0pIHtcblx0XHRsZXQgcmVjZW50SXRlbXMgPSB0aGlzLmdldFJlY2VudEl0ZW1zKCk7XG5cblx0XHQvLyByZW1vdmUgaXRlbSBmcm9tIGxpc3Rcblx0XHRyZWNlbnRJdGVtcyA9IHJlY2VudEl0ZW1zLmZpbHRlcihyZWNlbnRJdGVtID0+IHJlY2VudEl0ZW0gIT09IGl0ZW0pO1xuXG5cdFx0Ly8gYWRkIGl0ZW0gdG8gdGhlIHRvcCBvZiB0aGUgbGlzdFxuXHRcdHJlY2VudEl0ZW1zLnVuc2hpZnQoaXRlbSk7XG5cblx0XHQvLyBtYXhpbXVtIDEwMCBpdGVtcyB0byBwcmV2ZW50IGJsb2F0XG5cdFx0cmVjZW50SXRlbXMuc3BsaWNlKDEwMCk7XG5cblx0XHR0cnkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVDRU5UX0lURU1fS0VZLCBKU09OLnN0cmluZ2lmeShyZWNlbnRJdGVtcykpO1xuXHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHQvLyBpbnZhbGlkIGpzb25cblx0XHR9XG5cdH1cblxuXHRyZW1vdmVSZWNlbnRJdGVtKGl0ZW0pIHtcblx0XHRsZXQgcmVjZW50SXRlbXMgPSB0aGlzLmdldFJlY2VudEl0ZW1zKCk7XG5cdFx0cmVjZW50SXRlbXMgPSByZWNlbnRJdGVtcy5maWx0ZXIocmVjZW50SXRlbSA9PiByZWNlbnRJdGVtICE9PSBpdGVtKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShSRUNFTlRfSVRFTV9LRVksIEpTT04uc3RyaW5naWZ5KHJlY2VudEl0ZW1zKSk7XG5cdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdC8vIGludmFsaWQganNvblxuXHRcdH1cblx0fVxuXG5cdGluaXRpYWxTdGF0ZShwcm9wcykge1xuXHRcdGNvbnN0IHN0YXRlID0ge1xuXHRcdFx0ZmlsZXM6IHByb3BzLmZpbGVzIHx8IFtdLFxuXHRcdFx0Y29tbWFuZDogXCJcIixcblx0XHRcdHJlY2VudEl0ZW1zOiB0aGlzLmdldFJlY2VudEl0ZW1zKCksXG5cdFx0XHR0cmVlVmlldzogcHJvcHMudHJlZVZpZXcsXG5cdFx0fTtcblxuXHRcdHRoaXMuY29tbWFuZFJlbW92ZUl0ZW0gPSB0aGlzLmNvbW1hbmRSZW1vdmVJdGVtLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5jb21tYW5kQ2hhbmdlID0gdGhpcy5jb21tYW5kQ2hhbmdlLmJpbmQodGhpcyk7XG5cblx0XHRyZXR1cm4gc3RhdGU7XG5cdH1cblxuXHR2YWxpZGF0ZShzdGF0ZSkge1xuXHRcdGxldCBlcnJvciA9IGZhbHNlO1xuXHRcdGlmICghc3RhdGUuY29tbWFuZCkge1xuXHRcdFx0ZXJyb3IgPSB0cnVlO1xuXHRcdFx0dGhpcy5yZWZzLmNvbW1hbmRJbnB1dC5yZWZzLmlucHV0LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcblx0XHR9XG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsZXMgPSB0aGlzLnJlZnMuZmlsZVRyZWUuZ2V0U2VsZWN0ZWRGaWxlcygpO1xuXG5cdFx0dGhpcy5hZGRSZWNlbnRJdGVtKHN0YXRlLmNvbW1hbmQpO1xuXG5cdFx0cmV0dXJuIFtcblx0XHRcdHN0YXRlLmNvbW1hbmQsXG5cdFx0XHRmaWxlcyxcblx0XHRdO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHR0aGlzLnJlZnMuY29tbWFuZElucHV0LmZvY3VzKCk7XG5cdH1cblxuXHRjb21tYW5kQ2hhbmdlKGUsIHZhbHVlKSB7XG5cdFx0dGhpcy5yZWZzLmNvbW1hbmRJbnB1dC5yZWZzLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcblx0XHR0aGlzLnVwZGF0ZSh7Y29tbWFuZDogdmFsdWV9KTtcblx0fVxuXG5cdGNvbW1hbmRSZW1vdmVJdGVtKHZhbHVlLCBpdGVtKSB7XG5cdFx0dGhpcy5yZW1vdmVSZWNlbnRJdGVtKGl0ZW0pO1xuXHRcdHRoaXMudXBkYXRlKHtyZWNlbnRJdGVtczogdGhpcy5nZXRSZWNlbnRJdGVtcygpLCBjb21tYW5kOiB2YWx1ZX0pO1xuXHR9XG5cblx0Ym9keSgpIHtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8RmlsZVRyZWUgcmVmPVwiZmlsZVRyZWVcIiBmaWxlcz17dGhpcy5zdGF0ZS5maWxlc30gdGFiSW5kZXhTdGFydD1cIjFcIiB0cmVlVmlldz17dGhpcy5zdGF0ZS50cmVlVmlld30gLz5cblx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0Q29tbWFuZCAodXNlICclZmlsZXMlJyB0byBhZGQgdGhlIHNlbGVjdGVkIGZpbGVzIHRvIHRoZSBjb21tYW5kKVxuXHRcdFx0XHRcdDxBdXRvY29tcGxldGUgaXRlbXM9e3RoaXMuc3RhdGUucmVjZW50SXRlbXN9IHJlbW92ZUJ1dHRvbj1cInRydWVcIiBvblJlbW92ZT17dGhpcy5jb21tYW5kUmVtb3ZlSXRlbX0gbWF4SXRlbXM9XCIxMFwiIHJlZj1cImNvbW1hbmRJbnB1dFwiIHRhYkluZGV4PXsxMDAxfSB2YWx1ZT17dGhpcy5zdGF0ZS5jb21tYW5kfSBvbkNoYW5nZT17dGhpcy5jb21tYW5kQ2hhbmdlfSAvPlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG5cdHRpdGxlKCkge1xuXHRcdHJldHVybiBcIlJ1biBDb21tYW5kXCI7XG5cdH1cblxuXHRidXR0b25zKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3MgYnRuIGljb24gaWNvbi1kYXNoYm9hcmQgaW5saW5lLWJsb2NrLXRpZ2h0XCIgdGFiSW5kZXg9ezEwMDJ9IG9uPXt7Y2xpY2s6IHRoaXMuYWNjZXB0fX0+XG5cdFx0XHRcdFx0UnVuXG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufVxuIl19