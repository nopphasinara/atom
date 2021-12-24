Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @babel */

/** @jsx etch.dom */

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var FileTree = (function () {
	function FileTree() {
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var _ref$files = _ref.files;
		var files = _ref$files === undefined ? [] : _ref$files;
		var _ref$showCheckboxes = _ref.showCheckboxes;
		var showCheckboxes = _ref$showCheckboxes === undefined ? true : _ref$showCheckboxes;
		var _ref$tabIndexStart = _ref.tabIndexStart;
		var tabIndexStart = _ref$tabIndexStart === undefined ? 1 : _ref$tabIndexStart;
		var _ref$treeView = _ref.treeView;
		var treeView = _ref$treeView === undefined ? true : _ref$treeView;

		_classCallCheck(this, FileTree);

		this.state = {
			fileList: this.convertFiles(files, treeView),
			showCheckboxes: showCheckboxes,
			tabIndexStart: tabIndexStart
		};

		_etch2["default"].initialize(this);
	}

	_createClass(FileTree, [{
		key: "convertFiles",
		value: function convertFiles(files, treeView) {

			if (!treeView) {
				return files.map(function (file) {
					return {
						name: file.file,
						checked: true,
						indeterminate: false,
						file: file,
						parent: null
					};
				});
			}

			files.sort(function (a, b) {
				var aPaths = a.file.split("/");
				var bPaths = b.file.split("/");
				var len = Math.min(aPaths.length, bPaths.length);
				for (var i = 0; i < len; i++) {
					var comp = 0;
					// sort directories first
					if (i === aPaths.length - 1 && i < bPaths.length - 1) {
						comp = 1;
					} else if (i < aPaths.length - 1 && i === bPaths.length - 1) {
						comp = -1;
					} else {
						comp = aPaths[i].localeCompare(bPaths[i]);
					}

					if (comp !== 0) {
						return comp;
					}
				}
				return bPaths.length - aPaths.length;
			});

			var treeFiles = [];

			for (var f of files) {
				var paths = f.file.split("/");
				var key = "";
				var _parent = null;
				var currentLevel = treeFiles;

				var _loop = function (i) {
					var isFile = i === paths.length - 1;
					var p = paths[i] + (isFile ? "" : "/");
					key += p;
					var level = currentLevel.find(function (l) {
						return l.name === p;
					});
					if (!level) {
						if (isFile) {
							level = {
								name: p,
								checked: true,
								indeterminate: false,
								file: f,
								key: key,
								parent: _parent
							};
						} else {
							level = {
								name: p,
								checked: true,
								indeterminate: false,
								collapsed: false,
								files: [],
								key: key,
								parent: _parent
							};
						}
						currentLevel.push(level);
					}
					_parent = level;
					currentLevel = level.files;
				};

				for (var i = 0; i < paths.length; i++) {
					_loop(i);
				}
			}

			var combineEmptyFolders = function combineEmptyFolders(filesArr) {
				var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

				for (var i = 0; i < filesArr.length; i++) {
					var obj = filesArr[i];
					var _name = obj.name;

					if (!obj.files) {
						continue;
					}
					if (obj.files.length === 1) {
						var newName = "" + _name + obj.files[0].name;
						filesArr.splice(i, 1, obj.files[0]);
						filesArr[i].parent = parent;
						filesArr[i].name = newName;
						i--;
					} else {
						obj.files = combineEmptyFolders(obj.files, obj);
					}
				}

				return filesArr;
			};

			return combineEmptyFolders(treeFiles);
		}
	}, {
		key: "update",
		value: function update(props) {
			if (props) {
				this.setState(props);
			}

			return _etch2["default"].update(this);
		}
	}, {
		key: "setState",
		value: function setState(state) {
			this.state = _extends({}, this.state, state);
		}
	}, {
		key: "destroy",
		value: function destroy() {
			return _etch2["default"].destroy(this);
		}
	}, {
		key: "checkboxChange",
		value: function checkboxChange(obj) {
			var _this = this;

			var changeChildren = function changeChildren(files, checked) {
				if (!files) {
					return;
				}

				for (var file of files) {
					file.indeterminate = false;
					file.checked = checked;
					changeChildren(file.files, checked);
				}
			};

			var changeParent = function changeParent(parent, checked) {
				if (!parent) {
					return;
				}

				var hasChecked = false;
				var hasUnchecked = false;
				var hasIndeterminate = false;

				for (var file of parent.files) {
					if (file.checked) {
						hasChecked = true;
						if (hasUnchecked) {
							break;
						}
					} else {
						hasUnchecked = true;
						if (hasChecked) {
							break;
						}
					}
					if (file.indeterminate) {
						hasIndeterminate = true;
						break;
					}
				}

				parent.checked = hasChecked && !(hasIndeterminate || hasUnchecked);
				parent.indeterminate = hasIndeterminate || hasChecked && hasUnchecked;
				changeParent(parent.parent, checked);
			};

			return function (_ref2) {
				var checked = _ref2.target.checked;

				obj.indeterminate = false;
				obj.checked = checked;
				changeChildren(obj.files, checked);
				changeParent(obj.parent, checked);

				_this.update();
			};
		}
	}, {
		key: "changeChecked",
		value: function changeChecked(checked) {

			var checkAll = function checkAll(obj) {
				obj.checked = checked;
				if (obj.files) {
					obj.files.forEach(checkAll);
				}
			};

			this.state.fileList.forEach(checkAll);
			this.update();
		}
	}, {
		key: "dirClick",
		value: function dirClick(obj) {
			var _this2 = this;

			return function () {
				obj.collapsed = !obj.collapsed;
				_this2.update();
			};
		}
	}, {
		key: "getSelectedFiles",
		value: function getSelectedFiles() {

			var checkedFiles = function checkedFiles(files) {
				var arr = [];

				for (var obj of files) {
					if (obj.file) {
						if (obj.checked) {
							arr.push(obj.file.file);
						}
					} else {
						arr = [].concat(_toConsumableArray(arr), _toConsumableArray(checkedFiles(obj.files)));
					}
				}

				return arr;
			};

			return checkedFiles(this.state.fileList);
		}
	}, {
		key: "changeCollapsed",
		value: function changeCollapsed(collapsed) {
			var collapse = function collapse(files) {
				for (var file of files) {
					if (file.files) {
						file.collapsed = collapsed;
						collapse(file.files);
					}
				}
			};

			collapse(this.state.fileList);
			this.update();
		}
	}, {
		key: "hasDirs",
		value: function hasDirs() {
			for (var file of this.state.fileList) {
				if (file.files) {
					return true;
				}
			}

			return false;
		}
	}, {
		key: "moreThanOne",
		value: function moreThanOne() {
			return this.state.fileList.length > 1 || this.state.fileList.length === 1 && this.state.fileList[0].files;
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var tabIndex = +this.state.tabIndexStart;
			var renderItems = function renderItems(files) {
				return files.map(function (obj) {
					var checkbox = "";
					if (_this3.state.showCheckboxes) {
						checkbox = _etch2["default"].dom("input", { className: "native-key-bindings input-checkbox", type: "checkbox", tabIndex: tabIndex++, attributes: { name: obj.name },
							checked: obj.checked, indeterminate: obj.indeterminate, onchange: _this3.checkboxChange(obj) });
					}

					var classes = [];
					if (!obj.checked && !obj.indeterminate) {
						classes.push("unchecked");
					}
					var li = undefined;
					if (obj.file) {
						classes.push("file");
						if (obj.file.added) {
							classes.push("added");
						}
						if (obj.file.untracked) {
							classes.push("untracked");
						}
						if (obj.file.deleted) {
							classes.push("deleted");
						}
						if (obj.file.changed) {
							classes.push("changed");
						}
						li = _etch2["default"].dom(
							"li",
							{ key: obj.key, className: classes.join(" "), title: obj.file.file },
							_etch2["default"].dom(
								"label",
								{ className: "input-label" },
								checkbox,
								_etch2["default"].dom(
									"span",
									null,
									obj.name
								)
							)
						);
					} else {
						classes.push("dir");
						if (obj.collapsed) {
							classes.push("collapsed");
						}
						li = _etch2["default"].dom(
							"li",
							{ key: obj.key, className: classes.join(" ") },
							_etch2["default"].dom(
								"span",
								{ className: "input-label" },
								checkbox,
								_etch2["default"].dom(
									"span",
									{ className: "icon " + (obj.collapsed ? "icon-chevron-right" : "icon-chevron-down"), onclick: _this3.dirClick(obj) },
									_etch2["default"].dom(
										"span",
										{ className: "icon icon-file-directory" },
										obj.name
									)
								)
							),
							_etch2["default"].dom(
								"ul",
								null,
								renderItems(obj.files)
							)
						);
					}

					return li;
				});
			};
			var hasDirs = this.hasDirs();
			var showCheckAll = this.state.showCheckboxes && this.moreThanOne();

			return _etch2["default"].dom(
				"div",
				{ className: "file-tree" },
				_etch2["default"].dom(
					"div",
					{ className: "buttons" },
					_etch2["default"].dom(
						"button",
						{ tabIndex: tabIndex++, className: hasDirs ? "" : "hidden", on: { click: function click() {
									return _this3.changeCollapsed(true);
								} } },
						"Collapse All"
					),
					_etch2["default"].dom(
						"button",
						{ tabIndex: tabIndex++, className: hasDirs ? "" : "hidden", on: { click: function click() {
									return _this3.changeCollapsed(false);
								} } },
						"Expand All"
					),
					_etch2["default"].dom(
						"button",
						{ tabIndex: tabIndex++, className: showCheckAll ? "" : "hidden", on: { click: function click() {
									return _this3.changeChecked(true);
								} } },
						"Check All"
					),
					_etch2["default"].dom(
						"button",
						{ tabIndex: tabIndex++, className: showCheckAll ? "" : "hidden", on: { click: function click() {
									return _this3.changeChecked(false);
								} } },
						"Uncheck All"
					)
				),
				_etch2["default"].dom(
					"div",
					{ className: "files" },
					_etch2["default"].dom(
						"ul",
						null,
						renderItems(this.state.fileList)
					)
				)
			);
		}
	}]);

	return FileTree;
})();

exports["default"] = FileTree;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvd2lkZ2V0cy9GaWxlVHJlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBSWlCLE1BQU07Ozs7SUFFRixRQUFRO0FBRWpCLFVBRlMsUUFBUSxHQUU4RDttRUFBSixFQUFFOzt3QkFBM0UsS0FBSztNQUFMLEtBQUssOEJBQUcsRUFBRTtpQ0FBRSxjQUFjO01BQWQsY0FBYyx1Q0FBRyxJQUFJO2dDQUFFLGFBQWE7TUFBYixhQUFhLHNDQUFHLENBQUM7MkJBQUUsUUFBUTtNQUFSLFFBQVEsaUNBQUcsSUFBSTs7d0JBRjlELFFBQVE7O0FBRzNCLE1BQUksQ0FBQyxLQUFLLEdBQUc7QUFDWixXQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0FBQzVDLGlCQUFjLEVBQWQsY0FBYztBQUNkLGdCQUFhLEVBQWIsYUFBYTtHQUNiLENBQUM7O0FBRUYsb0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3RCOztjQVZtQixRQUFROztTQVloQixzQkFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFOztBQUU3QixPQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2QsV0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3hCLFlBQU87QUFDTixVQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixhQUFPLEVBQUUsSUFBSTtBQUNiLG1CQUFhLEVBQUUsS0FBSztBQUNwQixVQUFJLEVBQUosSUFBSTtBQUNKLFlBQU0sRUFBRSxJQUFJO01BQ1osQ0FBQztLQUNGLENBQUMsQ0FBQztJQUNIOztBQUVELFFBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ3BCLFFBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FB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QUFBLEVBQUMsQUFBQzs7TUFBb0I7S0FDckk7O1FBQVEsUUFBUSxFQUFFLFFBQVEsRUFBRSxBQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksR0FBRyxFQUFFLEdBQUcsUUFBUSxBQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFO2dCQUFNLE9BQUssYUFBYSxDQUFDLElBQUksQ0FBQztTQUFBLEVBQUMsQUFBQzs7TUFBbUI7S0FDdEk7O1FBQVEsUUFBUSxFQUFFLFFBQVEsRUFBRSxBQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksR0FBRyxFQUFFLEdBQUcsUUFBUSxBQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFO2dCQUFNLE9BQUssYUFBYSxDQUFDLEtBQUssQ0FBQztTQUFBLEVBQUMsQUFBQzs7TUFBcUI7S0FDcEk7SUFDTjs7T0FBSyxTQUFTLEVBQUMsT0FBTztLQUNyQjs7O01BQ0UsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO01BQzdCO0tBQ0E7SUFDRCxDQUNMO0dBQ0Y7OztRQW5WbUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi93aWRnZXRzL0ZpbGVUcmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tIFwiZXRjaFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlVHJlZSB7XG5cblx0Y29uc3RydWN0b3Ioe2ZpbGVzID0gW10sIHNob3dDaGVja2JveGVzID0gdHJ1ZSwgdGFiSW5kZXhTdGFydCA9IDEsIHRyZWVWaWV3ID0gdHJ1ZX0gPSB7fSkge1xuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHRmaWxlTGlzdDogdGhpcy5jb252ZXJ0RmlsZXMoZmlsZXMsIHRyZWVWaWV3KSxcblx0XHRcdHNob3dDaGVja2JveGVzLFxuXHRcdFx0dGFiSW5kZXhTdGFydCxcblx0XHR9O1xuXG5cdFx0ZXRjaC5pbml0aWFsaXplKHRoaXMpO1xuXHR9XG5cblx0Y29udmVydEZpbGVzKGZpbGVzLCB0cmVlVmlldykge1xuXG5cdFx0aWYgKCF0cmVlVmlldykge1xuXHRcdFx0cmV0dXJuIGZpbGVzLm1hcChmaWxlID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRuYW1lOiBmaWxlLmZpbGUsXG5cdFx0XHRcdFx0Y2hlY2tlZDogdHJ1ZSxcblx0XHRcdFx0XHRpbmRldGVybWluYXRlOiBmYWxzZSxcblx0XHRcdFx0XHRmaWxlLFxuXHRcdFx0XHRcdHBhcmVudDogbnVsbCxcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZpbGVzLnNvcnQoKGEsIGIpID0+IHtcblx0XHRcdGNvbnN0IGFQYXRocyA9IGEuZmlsZS5zcGxpdChcIi9cIik7XG5cdFx0XHRjb25zdCBiUGF0aHMgPSBiLmZpbGUuc3BsaXQoXCIvXCIpO1xuXHRcdFx0Y29uc3QgbGVuID0gTWF0aC5taW4oYVBhdGhzLmxlbmd0aCwgYlBhdGhzLmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGxldCBjb21wID0gMDtcblx0XHRcdFx0Ly8gc29ydCBkaXJlY3RvcmllcyBmaXJzdFxuXHRcdFx0XHRpZiAoaSA9PT0gYVBhdGhzLmxlbmd0aCAtIDEgJiYgaSA8IGJQYXRocy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0Y29tcCA9IDE7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaSA8IGFQYXRocy5sZW5ndGggLSAxICYmIGkgPT09IGJQYXRocy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0Y29tcCA9IC0xO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbXAgPSBhUGF0aHNbaV0ubG9jYWxlQ29tcGFyZShiUGF0aHNbaV0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbXAgIT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gY29tcDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJQYXRocy5sZW5ndGggLSBhUGF0aHMubGVuZ3RoO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgdHJlZUZpbGVzID0gW107XG5cblx0XHRmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcblx0XHRcdGNvbnN0IHBhdGhzID0gZi5maWxlLnNwbGl0KFwiL1wiKTtcblx0XHRcdGxldCBrZXkgPSBcIlwiO1xuXHRcdFx0bGV0IHBhcmVudCA9IG51bGw7XG5cdFx0XHRsZXQgY3VycmVudExldmVsID0gdHJlZUZpbGVzO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBpc0ZpbGUgPSAoaSA9PT0gcGF0aHMubGVuZ3RoIC0gMSk7XG5cdFx0XHRcdGNvbnN0IHAgPSBwYXRoc1tpXSArIChpc0ZpbGUgPyBcIlwiIDogXCIvXCIpO1xuXHRcdFx0XHRrZXkgKz0gcDtcblx0XHRcdFx0bGV0IGxldmVsID0gY3VycmVudExldmVsLmZpbmQobCA9PiBsLm5hbWUgPT09IHApO1xuXHRcdFx0XHRpZiAoIWxldmVsKSB7XG5cdFx0XHRcdFx0aWYgKGlzRmlsZSkge1xuXHRcdFx0XHRcdFx0bGV2ZWwgPSB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6IHAsXG5cdFx0XHRcdFx0XHRcdGNoZWNrZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGluZGV0ZXJtaW5hdGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRmaWxlOiBmLFxuXHRcdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRcdHBhcmVudCxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsID0ge1xuXHRcdFx0XHRcdFx0XHRuYW1lOiBwLFxuXHRcdFx0XHRcdFx0XHRjaGVja2VkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRpbmRldGVybWluYXRlOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0Y29sbGFwc2VkOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0ZmlsZXM6IFtdLFxuXHRcdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRcdHBhcmVudCxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1cnJlbnRMZXZlbC5wdXNoKGxldmVsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwYXJlbnQgPSBsZXZlbDtcblx0XHRcdFx0Y3VycmVudExldmVsID0gbGV2ZWwuZmlsZXM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29tYmluZUVtcHR5Rm9sZGVycyA9IChmaWxlc0FyciwgcGFyZW50ID0gbnVsbCkgPT4ge1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IG9iaiA9IGZpbGVzQXJyW2ldO1xuXHRcdFx0XHRjb25zdCB7bmFtZX0gPSBvYmo7XG5cdFx0XHRcdGlmICghb2JqLmZpbGVzKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9iai5maWxlcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRjb25zdCBuZXdOYW1lID0gYCR7bmFtZX0ke29iai5maWxlc1swXS5uYW1lfWA7XG5cdFx0XHRcdFx0ZmlsZXNBcnIuc3BsaWNlKGksIDEsIG9iai5maWxlc1swXSk7XG5cdFx0XHRcdFx0ZmlsZXNBcnJbaV0ucGFyZW50ID0gcGFyZW50O1xuXHRcdFx0XHRcdGZpbGVzQXJyW2ldLm5hbWUgPSBuZXdOYW1lO1xuXHRcdFx0XHRcdGktLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvYmouZmlsZXMgPSBjb21iaW5lRW1wdHlGb2xkZXJzKG9iai5maWxlcywgb2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmlsZXNBcnI7XG5cdFx0fTtcblxuXHRcdHJldHVybiBjb21iaW5lRW1wdHlGb2xkZXJzKHRyZWVGaWxlcyk7XG5cdH1cblxuXHR1cGRhdGUocHJvcHMpIHtcblx0XHRpZiAocHJvcHMpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUocHJvcHMpO1xuXHRcdH1cblxuXHRcdHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKTtcblx0fVxuXG5cdHNldFN0YXRlKHN0YXRlKSB7XG5cdFx0dGhpcy5zdGF0ZSA9IHsuLi50aGlzLnN0YXRlLCAuLi5zdGF0ZX07XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHJldHVybiBldGNoLmRlc3Ryb3kodGhpcyk7XG5cdH1cblxuXHRjaGVja2JveENoYW5nZShvYmopIHtcblx0XHRjb25zdCBjaGFuZ2VDaGlsZHJlbiA9IChmaWxlcywgY2hlY2tlZCkgPT4ge1xuXHRcdFx0aWYgKCFmaWxlcykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuXHRcdFx0XHRmaWxlLmluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcblx0XHRcdFx0ZmlsZS5jaGVja2VkID0gY2hlY2tlZDtcblx0XHRcdFx0Y2hhbmdlQ2hpbGRyZW4oZmlsZS5maWxlcywgY2hlY2tlZCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNoYW5nZVBhcmVudCA9IChwYXJlbnQsIGNoZWNrZWQpID0+IHtcblx0XHRcdGlmICghcGFyZW50KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGhhc0NoZWNrZWQgPSBmYWxzZTtcblx0XHRcdGxldCBoYXNVbmNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdGxldCBoYXNJbmRldGVybWluYXRlID0gZmFsc2U7XG5cblx0XHRcdGZvciAoY29uc3QgZmlsZSBvZiBwYXJlbnQuZmlsZXMpIHtcblx0XHRcdFx0aWYgKGZpbGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdGhhc0NoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGlmIChoYXNVbmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRoYXNVbmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGlmIChoYXNDaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZpbGUuaW5kZXRlcm1pbmF0ZSkge1xuXHRcdFx0XHRcdGhhc0luZGV0ZXJtaW5hdGUgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudC5jaGVja2VkID0gaGFzQ2hlY2tlZCAmJiAhKGhhc0luZGV0ZXJtaW5hdGUgfHwgaGFzVW5jaGVja2VkKTtcblx0XHRcdHBhcmVudC5pbmRldGVybWluYXRlID0gaGFzSW5kZXRlcm1pbmF0ZSB8fCAoaGFzQ2hlY2tlZCAmJiBoYXNVbmNoZWNrZWQpO1xuXHRcdFx0Y2hhbmdlUGFyZW50KHBhcmVudC5wYXJlbnQsIGNoZWNrZWQpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gKHt0YXJnZXQ6IHtjaGVja2VkfX0pID0+IHtcblx0XHRcdG9iai5pbmRldGVybWluYXRlID0gZmFsc2U7XG5cdFx0XHRvYmouY2hlY2tlZCA9IGNoZWNrZWQ7XG5cdFx0XHRjaGFuZ2VDaGlsZHJlbihvYmouZmlsZXMsIGNoZWNrZWQpO1xuXHRcdFx0Y2hhbmdlUGFyZW50KG9iai5wYXJlbnQsIGNoZWNrZWQpO1xuXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH07XG5cdH1cblxuXHRjaGFuZ2VDaGVja2VkKGNoZWNrZWQpIHtcblxuXHRcdGNvbnN0IGNoZWNrQWxsID0gKG9iaikgPT4ge1xuXHRcdFx0b2JqLmNoZWNrZWQgPSBjaGVja2VkO1xuXHRcdFx0aWYgKG9iai5maWxlcykge1xuXHRcdFx0XHRvYmouZmlsZXMuZm9yRWFjaChjaGVja0FsbCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMuc3RhdGUuZmlsZUxpc3QuZm9yRWFjaChjaGVja0FsbCk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblx0fVxuXG5cdGRpckNsaWNrKG9iaikge1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRvYmouY29sbGFwc2VkID0gIW9iai5jb2xsYXBzZWQ7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdH07XG5cdH1cblxuXHRnZXRTZWxlY3RlZEZpbGVzKCkge1xuXG5cdFx0Y29uc3QgY2hlY2tlZEZpbGVzID0gKGZpbGVzKSA9PiB7XG5cdFx0XHRsZXQgYXJyID0gW107XG5cblx0XHRcdGZvciAoY29uc3Qgb2JqIG9mIGZpbGVzKSB7XG5cdFx0XHRcdGlmIChvYmouZmlsZSkge1xuXHRcdFx0XHRcdGlmIChvYmouY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0YXJyLnB1c2gob2JqLmZpbGUuZmlsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFyciA9IFsuLi5hcnIsIC4uLmNoZWNrZWRGaWxlcyhvYmouZmlsZXMpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gY2hlY2tlZEZpbGVzKHRoaXMuc3RhdGUuZmlsZUxpc3QpO1xuXHR9XG5cblx0Y2hhbmdlQ29sbGFwc2VkKGNvbGxhcHNlZCkge1xuXHRcdGNvbnN0IGNvbGxhcHNlID0gKGZpbGVzKSA9PiB7XG5cdFx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcblx0XHRcdFx0aWYgKGZpbGUuZmlsZXMpIHtcblx0XHRcdFx0XHRmaWxlLmNvbGxhcHNlZCA9IGNvbGxhcHNlZDtcblx0XHRcdFx0XHRjb2xsYXBzZShmaWxlLmZpbGVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb2xsYXBzZSh0aGlzLnN0YXRlLmZpbGVMaXN0KTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9XG5cblx0aGFzRGlycygpIHtcblx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgdGhpcy5zdGF0ZS5maWxlTGlzdCkge1xuXHRcdFx0aWYgKGZpbGUuZmlsZXMpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0bW9yZVRoYW5PbmUoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuc3RhdGUuZmlsZUxpc3QubGVuZ3RoID4gMSB8fFxuXHRcdFx0KFxuXHRcdFx0XHR0aGlzLnN0YXRlLmZpbGVMaXN0Lmxlbmd0aCA9PT0gMSAmJlxuXHRcdFx0XHR0aGlzLnN0YXRlLmZpbGVMaXN0WzBdLmZpbGVzXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRsZXQgdGFiSW5kZXggPSArdGhpcy5zdGF0ZS50YWJJbmRleFN0YXJ0O1xuXHRcdGNvbnN0IHJlbmRlckl0ZW1zID0gKGZpbGVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gZmlsZXMubWFwKG9iaiA9PiB7XG5cdFx0XHRcdGxldCBjaGVja2JveCA9IFwiXCI7XG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLnNob3dDaGVja2JveGVzKSB7XG5cdFx0XHRcdFx0Y2hlY2tib3ggPSAoXG5cdFx0XHRcdFx0XHQ8aW5wdXQgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5ncyBpbnB1dC1jaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIHRhYkluZGV4PXt0YWJJbmRleCsrfSBhdHRyaWJ1dGVzPXt7bmFtZTogb2JqLm5hbWV9fVxuXHRcdFx0XHRcdFx0XHRjaGVja2VkPXtvYmouY2hlY2tlZH0gaW5kZXRlcm1pbmF0ZT17b2JqLmluZGV0ZXJtaW5hdGV9IG9uY2hhbmdlPXt0aGlzLmNoZWNrYm94Q2hhbmdlKG9iail9Lz5cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgY2xhc3NlcyA9IFtdO1xuXHRcdFx0XHRpZiAoIW9iai5jaGVja2VkICYmICFvYmouaW5kZXRlcm1pbmF0ZSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChcInVuY2hlY2tlZFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgbGk7XG5cdFx0XHRcdGlmIChvYmouZmlsZSkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChcImZpbGVcIik7XG5cdFx0XHRcdFx0aWYgKG9iai5maWxlLmFkZGVkKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goXCJhZGRlZFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9iai5maWxlLnVudHJhY2tlZCkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKFwidW50cmFja2VkXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob2JqLmZpbGUuZGVsZXRlZCkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKFwiZGVsZXRlZFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG9iai5maWxlLmNoYW5nZWQpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChcImNoYW5nZWRcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxpID0gKFxuXHRcdFx0XHRcdFx0PGxpIGtleT17b2JqLmtleX0gY2xhc3NOYW1lPXtjbGFzc2VzLmpvaW4oXCIgXCIpfSB0aXRsZT17b2JqLmZpbGUuZmlsZX0+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiPlxuXHRcdFx0XHRcdFx0XHRcdHtjaGVja2JveH1cblx0XHRcdFx0XHRcdFx0XHQ8c3Bhbj57b2JqLm5hbWV9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChcImRpclwiKTtcblx0XHRcdFx0XHRpZiAob2JqLmNvbGxhcHNlZCkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKFwiY29sbGFwc2VkXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsaSA9IChcblx0XHRcdFx0XHRcdDxsaSBrZXk9e29iai5rZXl9IGNsYXNzTmFtZT17Y2xhc3Nlcy5qb2luKFwiIFwiKX0+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+XG5cdFx0XHRcdFx0XHRcdFx0e2NoZWNrYm94fVxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT17YGljb24gJHtvYmouY29sbGFwc2VkID8gXCJpY29uLWNoZXZyb24tcmlnaHRcIiA6IFwiaWNvbi1jaGV2cm9uLWRvd25cIn1gfSBvbmNsaWNrPXt0aGlzLmRpckNsaWNrKG9iail9PlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWZpbGUtZGlyZWN0b3J5XCI+e29iai5uYW1lfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PHVsPlxuXHRcdFx0XHRcdFx0XHRcdHtyZW5kZXJJdGVtcyhvYmouZmlsZXMpfVxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGxpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBoYXNEaXJzID0gdGhpcy5oYXNEaXJzKCk7XG5cdFx0Y29uc3Qgc2hvd0NoZWNrQWxsID0gdGhpcy5zdGF0ZS5zaG93Q2hlY2tib3hlcyAmJiB0aGlzLm1vcmVUaGFuT25lKCk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJmaWxlLXRyZWVcIj5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0YWJJbmRleD17dGFiSW5kZXgrK30gY2xhc3NOYW1lPXtoYXNEaXJzID8gXCJcIiA6IFwiaGlkZGVuXCJ9IG9uPXt7Y2xpY2s6ICgpID0+IHRoaXMuY2hhbmdlQ29sbGFwc2VkKHRydWUpfX0+Q29sbGFwc2UgQWxsPC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0YWJJbmRleD17dGFiSW5kZXgrK30gY2xhc3NOYW1lPXtoYXNEaXJzID8gXCJcIiA6IFwiaGlkZGVuXCJ9IG9uPXt7Y2xpY2s6ICgpID0+IHRoaXMuY2hhbmdlQ29sbGFwc2VkKGZhbHNlKX19PkV4cGFuZCBBbGw8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIHRhYkluZGV4PXt0YWJJbmRleCsrfSBjbGFzc05hbWU9e3Nob3dDaGVja0FsbCA/IFwiXCIgOiBcImhpZGRlblwifSBvbj17e2NsaWNrOiAoKSA9PiB0aGlzLmNoYW5nZUNoZWNrZWQodHJ1ZSl9fT5DaGVjayBBbGw8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIHRhYkluZGV4PXt0YWJJbmRleCsrfSBjbGFzc05hbWU9e3Nob3dDaGVja0FsbCA/IFwiXCIgOiBcImhpZGRlblwifSBvbj17e2NsaWNrOiAoKSA9PiB0aGlzLmNoYW5nZUNoZWNrZWQoZmFsc2UpfX0+VW5jaGVjayBBbGw8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZmlsZXNcIj5cblx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHR7cmVuZGVySXRlbXModGhpcy5zdGF0ZS5maWxlTGlzdCl9XG5cdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG4iXX0=