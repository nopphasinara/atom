Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @babel */

/*
 *
 * Copyright (c) 2015 Ryan Florence
 * for https://github.com/reactjs/react-autocomplete
 *
 * Copyright © 2015 Nicolas Bevacqua
 * for https://github.com/bevacqua/fuzzysearch
 *
 */

// modified from https://github.com/reactjs/react-autocomplete

/** @jsx etch.dom */

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

var IMPERATIVE_API = ["blur", "checkValidity", "click", "focus", "select", "setCustomValidity", "setSelectionRange", "setRangeText"];

var Autocomplete = (function () {
	function Autocomplete(props) {
		_classCallCheck(this, Autocomplete);

		this.props = _extends({}, this.getDefaultProps(), props);
		this.state = _extends({}, this.getInitialState(), {
			value: this.props.value
		});

		this.componentWillMount();

		_etch2["default"].initialize(this);

		this.componentDidMount();
		this.exposeAPI(this.refs.input);
	}

	_createClass(Autocomplete, [{
		key: "update",
		value: function update(props) {
			var prevProps = this.props;

			this.componentWillReceiveProps(props);

			this.props = _extends({}, this.props, props);

			_etch2["default"].update(this);

			this.componentDidUpdate(prevProps, this.state);
		}
	}, {
		key: "destroy",
		value: function destroy() {
			_etch2["default"].destroy(this);
		}
	}, {
		key: "setState",
		value: function setState(state) {
			var prevState = this.state;

			this.state = _extends({}, this.state, state);

			_etch2["default"].update(this);

			this.componentDidUpdate(this.props, prevState);
		}
	}, {
		key: "getDefaultProps",
		value: function getDefaultProps() {
			return {

				/** @type {String[]} The items to display in the dropdown menu */
				items: [],

				/** @type {Number} The maximum number of items to render. 0 = all */
				maxItems: 0,

				/** @type {Boolean} Whether or not to show the remove button. */
				removeButton: false,

				/** @type {String} The value to display in the input field */
				value: "",

				/**
     * Invoked every time the user changes the input's value.
     * @param  {Event} event The dispatched event
     * @param  {String} value The new value of the input
     * @return {void}
     */
				onChange: function onChange(event, value) {}, // eslint-disable-line no-unused-vars

				/**
     * Invoked every time the user changes the input's value.
     * @param  {Event} event The dispatched event
     * @param  {String} value The new value of the input
     * @return {void}
     */
				onInput: function onInput(event, value) {}, // eslint-disable-line no-unused-vars

				/**
     * Invoked when the user selects an item from the dropdown menu.
     * @param  {String} value The value of the item
     * @param  {String} item The item selected
     * @return {void}
     */
				onSelect: function onSelect(value, item) {}, // eslint-disable-line no-unused-vars

				/**
     * Invoked when the user clicks the remove button on an item from the dropdown menu.
     * @param  {String} value The value of the item
     * @param  {String} item The item selected
     * @return {void}
     */
				onRemove: function onRemove(value, item) {}, // eslint-disable-line no-unused-vars

				/**
     * Invoked to generate the render tree for the dropdown menu. Ensure the
     * returned tree includes `items` or else no items will be rendered.
     * `styles` will contain { top, left, minWidth } which are the coordinates
     * of the top-left corner and the width of the dropdown menu.
     * @param  {Component[]} items The items to render
     * @param  {String} value The current value of the input
     * @param  {Object} styles Menu styles
     * @return {Component} The rendered menu
     */
				renderMenu: function renderMenu(items, value, styles) {
					var autocompleteStyles = _extends({}, styles, this.menuStyle);

					return _etch2["default"].dom(
						"div",
						{ className: "autocomplete-menu", style: autocompleteStyles },
						items
					);
				},

				/**
     * Styles that are applied to the dropdown menu in the default `renderMenu`
     * implementation. If you override `renderMenu` and you want to use
     * `menuStyles` you must manually apply them (`this.props.menuStyles`).
     * <... style={{ ...styles, ...this.props.menuStyle }} ...>
     * @type {Object}
     */
				menuStyle: {
					position: "fixed",
					zIndex: "1"
				},

				/**
     * Invoked for each entry in `items` that also passes `shouldItemRender` to
     * generate the render tree for each item in the dropdown menu. `styles` is
     * an optional set of styles that can be applied to improve the look/feel
     * of the items in the dropdown menu.
     * @param  {String} value The item value
     * @param  {Boolean} isHighlighted Is item highlighted?
     * @param  {Object} styles Item styles
     * @return {Component} The renderd item
     */
				renderItem: function renderItem(value, isHighlighted, styles) {
					var _this = this;

					var removeClick = function removeClick(e) {
						e.stopPropagation();
						return _this.onRemove(_this.value, value);
					};
					var removeButton = this.removeButton ? _etch2["default"].dom("i", { className: "icon icon-x clickable autocomplete-remove-button", title: "Remove", on: { click: removeClick } }) : null;
					return _etch2["default"].dom(
						"div",
						{ className: "autocomplete-item" + (isHighlighted ? " autocomplete-highlight" : ""), style: styles },
						removeButton,
						value
					);
				},

				/**
     * Used to read the display value from each entry in `items`.
     * @param  {String} item The item
     * @return {String} The value of the item
     */
				getItemValue: function getItemValue(item) {
					return item;
				},

				/**
     * A distance function to determine item weight.
     * @param  {String} item The value of the item
     * @param  {String} value The value of the input
     * @return {Any} The weight of this item with the given value
     */
				getItemWeight: function getItemWeight(item, value) {
					// modified from https://github.com/bevacqua/fuzzysearch
					var hlen = item.length;
					var nlen = value.length;
					if (nlen > hlen) {
						return false;
					}
					if (nlen === hlen) {
						return value === item;
					}
					var weight = 0;
					outer: for (var i = 0, j = 0; i < nlen; i++) {
						var nch = value.charCodeAt(i);
						while (j < hlen) {
							if (item.charCodeAt(j++) === nch) {
								weight += j - 1;
								continue outer;
							}
						}
						return false;
					}
					return weight;
				},

				/**
     * Invoked for each entry in `items` and its return value is used to
     * determine whether or not it should be displayed in the dropdown menu.
     * By default all items are always rendered.
     * @param  {String} item The value of the item
     * @param  {String} value The value of the input
     * @param  {Any} weight The weight returned by `this.props.getItemWeight`
     * @return {Boolean} Should the item be rendered?
     */
				shouldItemRender: function shouldItemRender(item, value, weight) {
					return item !== value && (value === "" || weight !== false);
				},

				/**
     * The function which is used to sort `items` before display.
     * @param  {String} itemA The first item value to compare
     * @param  {String} itemB The second item value to compare
     * @param  {String} value The value of the input
     * @param  {Any} weightA The weight returned by this.props.getItemWeight of the first item
     * @param  {Any} weightB The weight returned by this.props.getItemWeight of the second item
     * @return {integer} < 0: itemA first; > 0 itemB first; = 0 leave unchanged
     */
				sortItems: function sortItems(itemA, itemB, value, weightA, weightB) {
					if (weightA === weightB) {
						return 0;
					}

					return weightA < weightB ? -1 : 1;
				},

				/** @type {Boolean} Whether or not to automatically highlight the top match in the dropdown menu. */
				autoHighlight: false,

				/**
     * Invoked every time the dropdown menu's visibility changes (i.e. every
     * time it is displayed/hidden).
     * @param  {Boolean} isOpen Is the menu showing?
     * @return {void}
     */
				onMenuVisibilityChange: function onMenuVisibilityChange(isOpen) {}, // eslint-disable-line no-unused-vars

				/**
     * Used to override the internal logic which displays/hides the dropdown
     * menu. This is useful if you want to force a certain state based on your
     * UX/business logic. Use it together with `onMenuVisibilityChange` for
     * fine-grained control over the dropdown menu dynamics.
     * @type {Boolean}
     */
				// open: true,

				/**
     * tabindex of input
     * @type {Number|String}
     */
				tabIndex: ""
			};
		}
	}, {
		key: "getInitialState",
		value: function getInitialState() {
			return { isOpen: false, highlightedIndex: null, menuPositionSet: false };
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			// this.refs is frozen, so we need to assign a new object to it
			this.refs = {};
			this._ignoreBlur = false;
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			// If `items` has changed we want to reset `highlightedIndex`
			// since it probably no longer refers to a relevant item
			if (this.props.items !== nextProps.items ||
			// The entries in `items` may have been changed even though the
			// object reference remains the same, double check by seeing
			// if `highlightedIndex` points to an existing item
			this.state.highlightedIndex >= nextProps.items.length) {
				this.setState({ highlightedIndex: null });
			}
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.isOpen()) {
				this.setMenuPositions();
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps, prevState) {
			if (this.state.isOpen && !prevState.isOpen || "open" in this.props && this.props.open && !prevProps.open) {
				this.setMenuPositions();
			}

			this.maybeScrollItemIntoView();
			if (prevState.isOpen !== this.state.isOpen) {
				this.props.onMenuVisibilityChange(this.state.isOpen);
			}
		}
	}, {
		key: "exposeAPI",
		value: function exposeAPI(el) {
			var _this2 = this;

			IMPERATIVE_API.forEach(function (ev) {
				return _this2[ev] = el && el[ev] && el[ev].bind(el);
			});
		}
	}, {
		key: "maybeScrollItemIntoView",
		value: function maybeScrollItemIntoView() {
			if (this.isOpen() && this.state.highlightedIndex !== null) {
				var itemNode = this.refs["item-" + this.state.highlightedIndex];
				var menuNode = this.refs.menu;
				if (itemNode) {
					menuNode.scrollIntoViewIfNeeded();
					itemNode.scrollIntoViewIfNeeded();
				}
			}
		}
	}, {
		key: "handleKeyDown",
		value: function handleKeyDown(event) {
			var _this3 = this;

			var keyDownHandlers = {
				ArrowDown: function ArrowDown(e) {
					e.preventDefault();
					var itemsLength = _this3.getFilteredItems().length;
					if (!itemsLength) {
						return;
					}
					var highlightedIndex = _this3.state.highlightedIndex;

					var index = highlightedIndex === null ? 0 : highlightedIndex + 1;
					if (index >= itemsLength) {
						index = null;
					}
					_this3.setState({ highlightedIndex: index, isOpen: true });
				},

				ArrowUp: function ArrowUp(e) {
					e.preventDefault();
					var itemsLength = _this3.getFilteredItems().length;
					if (!itemsLength) {
						return;
					}
					var highlightedIndex = _this3.state.highlightedIndex;

					var index = highlightedIndex === null ? itemsLength - 1 : highlightedIndex - 1;
					if (index < 0) {
						index = null;
					}
					_this3.setState({ highlightedIndex: index, isOpen: true });
				},

				Enter: function Enter(e) {
					if (!_this3.isOpen()) {
						// menu is closed so there is no selection to accept -> do nothing
						return;
					} else if (_this3.state.highlightedIndex === null) {
						// input has focus but no menu item is selected + enter is hit -> close the menu
						_this3.setState({ isOpen: false });
					} else {
						// text entered + menu item has been highlighted + enter is hit -> update value to that of selected menu item, close the menu
						e.preventDefault();
						var item = _this3.getFilteredItems()[_this3.state.highlightedIndex];
						var value = _this3.props.getItemValue(item);
						_this3.setState({ isOpen: false, highlightedIndex: null, value: value });
						// this.refs.input.value = value;
						// this.refs.input.select();
						_this3.props.onSelect(value, item);
						_this3.props.onChange({
							target: _this3.refs.input,
							type: "select"
						}, value);
					}
				},

				Escape: function Escape() {
					// In case the user is currently hovering over the menu
					_this3.setIgnoreBlur(false);
					_this3.setState({ highlightedIndex: null, isOpen: false });
				},

				Delete: function Delete(e) {
					// [shift] + [del] to remove item
					if (_this3.props.removeButton && _this3.state.highlightedIndex !== null && e.shiftKey) {
						_this3.props.onRemove(_this3.state.value, _this3.refs["item-" + _this3.state.highlightedIndex].textContent);
						e.preventDefault();
					}
				},

				Tab: function Tab() {
					// In case the user is currently hovering over the menu
					_this3.setIgnoreBlur(false);
				}
			};

			if (keyDownHandlers[event.key]) {
				keyDownHandlers[event.key](event);
			} else if (!this.isOpen()) {
				this.setState({ isOpen: true });
			}
		}
	}, {
		key: "handleChange",
		value: function handleChange(event) {
			var _this4 = this;

			var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			if (!force && this._ignoreBlur) {
				// handle change after other events like selecting an item
				setTimeout(function () {
					_this4.handleChange(event, true);
				}, 100);
				return;
			}

			var value = event.target.value;

			this.setState({ highlightedIndex: null, value: value });
			this.props.onChange(event, value);
		}
	}, {
		key: "handleInput",
		value: function handleInput(event) {
			var value = event.target.value;

			this.setState({ highlightedIndex: null, value: value });
			this.props.onInput(event, value);
		}
	}, {
		key: "getFilteredItems",
		value: function getFilteredItems() {
			var _this5 = this;

			var items = this.props.items;
			var value = this.state.value;

			var itemWeights = items.reduce(function (prev, item) {
				prev[item] = _this5.props.getItemWeight(item, value);
				return prev;
			}, {});

			if (this.props.shouldItemRender) {
				items = items.filter(function (item) {
					return _this5.props.shouldItemRender(item, value, itemWeights[item]);
				});
			}

			if (this.props.sortItems) {
				items.sort(function (a, b) {
					return _this5.props.sortItems(a, b, value, itemWeights[a], itemWeights[b]);
				});
			}

			if (this.props.maxItems > 0) {
				items.splice(this.props.maxItems);
			}

			return items;
		}
	}, {
		key: "setMenuPositions",
		value: function setMenuPositions() {
			var node = this.refs.input;
			var rect = node.getBoundingClientRect();
			var computedStyle = global.window.getComputedStyle(node);
			var marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
			var marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
			var marginRight = parseInt(computedStyle.marginRight, 10) || 0;
			this.setState({
				menuTop: rect.bottom + marginBottom,
				menuLeft: rect.left + marginLeft,
				menuWidth: rect.width + marginLeft + marginRight,
				menuPositionSet: true
			});
		}
	}, {
		key: "highlightItemFromMouse",
		value: function highlightItemFromMouse(index) {
			this.setState({ highlightedIndex: index });
		}
	}, {
		key: "selectItemFromMouse",
		value: function selectItemFromMouse(item) {
			var value = this.props.getItemValue(item);
			this.setIgnoreBlur(false);
			this.setState({ isOpen: false, highlightedIndex: null, value: value });
			// this.refs.input.value = value;
			// this.refs.input.select();
			this.props.onSelect(value, item);
			this.props.onChange({
				target: this.refs.input,
				type: "select"
			}, value);
		}
	}, {
		key: "setIgnoreBlur",
		value: function setIgnoreBlur(ignore) {
			this._ignoreBlur = ignore;
		}
	}, {
		key: "renderMenu",
		value: function renderMenu() {
			var _this6 = this;

			if (!this.state.menuPositionSet) {
				return null;
			}

			var items = this.getFilteredItems().map(function (item, index) {
				var element = _this6.props.renderItem(item, _this6.state.highlightedIndex === index, { cursor: "default" });
				element.props = _extends({}, element.props, {
					onmousemove: function onmousemove() {
						return _this6.highlightItemFromMouse(index);
					},
					onclick: function onclick() {
						return _this6.selectItemFromMouse(item);
					},
					ref: "item-" + index
				});
				return element;
			});
			if (items.length === 0) {
				return null;
			}
			var style = {
				left: this.state.menuLeft + "px",
				top: this.state.menuTop + "px",
				minWidth: this.state.menuWidth + "px"
			};
			var menu = this.props.renderMenu(items, this.state.value, style);
			menu.props = _extends({}, menu.props, {
				onmouseenter: function onmouseenter() {
					return _this6.setIgnoreBlur(true);
				},
				onmouseleave: function onmouseleave() {
					return _this6.setIgnoreBlur(false);
				},
				ref: "menu"
			});
			return menu;
		}
	}, {
		key: "handleInputBlur",
		value: function handleInputBlur() {
			if (this._ignoreBlur) {
				this.refs.input.focus();
				return;
			}
			this.setState({ isOpen: false, highlightedIndex: null });
		}
	}, {
		key: "handleInputFocus",
		value: function handleInputFocus(event) {
			if (this._ignoreBlur) {
				return;
			}
			if (event.target.value !== "") {
				this.setState({ isOpen: true });
			}
		}
	}, {
		key: "isInputFocused",
		value: function isInputFocused() {
			var el = this.refs.input;
			return el.ownerDocument && el === el.ownerDocument.activeElement;
		}
	}, {
		key: "handleInputClick",
		value: function handleInputClick(ev) {
			if (this.state.menuPositionSet && this.state.menuTop <= ev.y) {
				// click was on menu not input
				return;
			}

			// Input will not be focused if it's disabled
			if (this.isInputFocused() && !this.isOpen()) {
				this.setState({ isOpen: true });
			}
		}
	}, {
		key: "isOpen",
		value: function isOpen() {
			return "open" in this.props ? this.props.open : this.state.isOpen;
		}
	}, {
		key: "render",
		value: function render() {
			var open = this.isOpen();
			var attr = {
				role: "combobox",
				"aria-autocomplete": "list",
				"aria-expanded": open,
				autoComplete: "off"
			};
			var on = {
				focus: this.handleInputFocus,
				blur: this.handleInputBlur,
				change: this.handleChange,
				input: this.handleInput,
				keydown: this.handleKeyDown,
				click: this.handleInputClick
			};
			return _etch2["default"].dom(
				"div",
				{ className: "autocomplete" },
				_etch2["default"].dom("input", { className: "native-key-bindings input-text autocomplete-input", attributes: attr, tabIndex: this.props.tabIndex, ref: "input", on: on, value: this.state.value }),
				open ? this.renderMenu() : ""
			);
		}
	}]);

	return Autocomplete;
})();

exports["default"] = Autocomplete;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvd2lkZ2V0cy9BdXRvY29tcGxldGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFnQmlCLE1BQU07Ozs7QUFFdkIsSUFBTSxjQUFjLEdBQUcsQ0FDdEIsTUFBTSxFQUNOLGVBQWUsRUFDZixPQUFPLEVBQ1AsT0FBTyxFQUNQLFFBQVEsRUFDUixtQkFBbUIsRUFDbkIsbUJBQW1CLEVBQ25CLGNBQWMsQ0FDZCxDQUFDOztJQUNtQixZQUFZO0FBRXJCLFVBRlMsWUFBWSxDQUVwQixLQUFLLEVBQUU7d0JBRkMsWUFBWTs7QUFJL0IsTUFBSSxDQUFDLEtBQUssZ0JBQ04sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUN0QixLQUFLLENBQ1IsQ0FBQztBQUNGLE1BQUksQ0FBQyxLQUFLLGdCQUNOLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekIsUUFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztJQUN2QixDQUFDOztBQUVGLE1BQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDOztBQUUxQixvQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXRCLE1BQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNoQzs7Y0FuQm1CLFlBQVk7O1NBcUIxQixnQkFBQyxLQUFLLEVBQUU7QUFDYixPQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOztBQUU3QixPQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXRDLE9BQUksQ0FBQyxLQUFLLGdCQUNOLElBQUksQ0FBQyxLQUFLLEVBQ1YsS0FBSyxDQUNSLENBQUM7O0FBRUYscUJBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxD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ZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1tZW51L2xpYi93aWRnZXRzL0F1dG9jb21wbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLypcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgUnlhbiBGbG9yZW5jZVxuICogZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JlYWN0LWF1dG9jb21wbGV0ZVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE1IE5pY29sYXMgQmV2YWNxdWFcbiAqIGZvciBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZnV6enlzZWFyY2hcbiAqXG4gKi9cblxuLy8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcmVhY3Rqcy9yZWFjdC1hdXRvY29tcGxldGVcblxuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSBcImV0Y2hcIjtcblxuY29uc3QgSU1QRVJBVElWRV9BUEkgPSBbXG5cdFwiYmx1clwiLFxuXHRcImNoZWNrVmFsaWRpdHlcIixcblx0XCJjbGlja1wiLFxuXHRcImZvY3VzXCIsXG5cdFwic2VsZWN0XCIsXG5cdFwic2V0Q3VzdG9tVmFsaWRpdHlcIixcblx0XCJzZXRTZWxlY3Rpb25SYW5nZVwiLFxuXHRcInNldFJhbmdlVGV4dFwiLFxuXTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9jb21wbGV0ZSB7XG5cblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblxuXHRcdHRoaXMucHJvcHMgPSB7XG5cdFx0XHQuLi50aGlzLmdldERlZmF1bHRQcm9wcygpLFxuXHRcdFx0Li4ucHJvcHMsXG5cdFx0fTtcblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0Li4udGhpcy5nZXRJbml0aWFsU3RhdGUoKSxcblx0XHRcdHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlLFxuXHRcdH07XG5cblx0XHR0aGlzLmNvbXBvbmVudFdpbGxNb3VudCgpO1xuXG5cdFx0ZXRjaC5pbml0aWFsaXplKHRoaXMpO1xuXG5cdFx0dGhpcy5jb21wb25lbnREaWRNb3VudCgpO1xuXHRcdHRoaXMuZXhwb3NlQVBJKHRoaXMucmVmcy5pbnB1dCk7XG5cdH1cblxuXHR1cGRhdGUocHJvcHMpIHtcblx0XHRjb25zdCBwcmV2UHJvcHMgPSB0aGlzLnByb3BzO1xuXG5cdFx0dGhpcy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKTtcblxuXHRcdHRoaXMucHJvcHMgPSB7XG5cdFx0XHQuLi50aGlzLnByb3BzLFxuXHRcdFx0Li4ucHJvcHMsXG5cdFx0fTtcblxuXHRcdGV0Y2gudXBkYXRlKHRoaXMpO1xuXG5cdFx0dGhpcy5jb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCB0aGlzLnN0YXRlKTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0ZXRjaC5kZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0c2V0U3RhdGUoc3RhdGUpIHtcblx0XHRjb25zdCBwcmV2U3RhdGUgPSB0aGlzLnN0YXRlO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdC4uLnRoaXMuc3RhdGUsXG5cdFx0XHQuLi5zdGF0ZSxcblx0XHR9O1xuXG5cdFx0ZXRjaC51cGRhdGUodGhpcyk7XG5cblx0XHR0aGlzLmNvbXBvbmVudERpZFVwZGF0ZSh0aGlzLnByb3BzLCBwcmV2U3RhdGUpO1xuXHR9XG5cblx0Z2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cblx0XHRcdC8qKiBAdHlwZSB7U3RyaW5nW119IFRoZSBpdGVtcyB0byBkaXNwbGF5IGluIHRoZSBkcm9wZG93biBtZW51ICovXG5cdFx0XHRpdGVtczogW10sXG5cblx0XHRcdC8qKiBAdHlwZSB7TnVtYmVyfSBUaGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gcmVuZGVyLiAwID0gYWxsICovXG5cdFx0XHRtYXhJdGVtczogMCxcblxuXHRcdFx0LyoqIEB0eXBlIHtCb29sZWFufSBXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSByZW1vdmUgYnV0dG9uLiAqL1xuXHRcdFx0cmVtb3ZlQnV0dG9uOiBmYWxzZSxcblxuXHRcdFx0LyoqIEB0eXBlIHtTdHJpbmd9IFRoZSB2YWx1ZSB0byBkaXNwbGF5IGluIHRoZSBpbnB1dCBmaWVsZCAqL1xuXHRcdFx0dmFsdWU6IFwiXCIsXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW52b2tlZCBldmVyeSB0aW1lIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGlucHV0J3MgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0gIHtFdmVudH0gZXZlbnQgVGhlIGRpc3BhdGNoZWQgZXZlbnRcblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgaW5wdXRcblx0XHRcdCAqIEByZXR1cm4ge3ZvaWR9XG5cdFx0XHQgKi9cblx0XHRcdG9uQ2hhbmdlKGV2ZW50LCB2YWx1ZSkge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJbnZva2VkIGV2ZXJ5IHRpbWUgdGhlIHVzZXIgY2hhbmdlcyB0aGUgaW5wdXQncyB2YWx1ZS5cblx0XHRcdCAqIEBwYXJhbSAge0V2ZW50fSBldmVudCBUaGUgZGlzcGF0Y2hlZCBldmVudFxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBpbnB1dFxuXHRcdFx0ICogQHJldHVybiB7dm9pZH1cblx0XHRcdCAqL1xuXHRcdFx0b25JbnB1dChldmVudCwgdmFsdWUpIHt9LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW52b2tlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYW4gaXRlbSBmcm9tIHRoZSBkcm9wZG93biBtZW51LlxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGl0ZW1cblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gaXRlbSBUaGUgaXRlbSBzZWxlY3RlZFxuXHRcdFx0ICogQHJldHVybiB7dm9pZH1cblx0XHRcdCAqL1xuXHRcdFx0b25TZWxlY3QodmFsdWUsIGl0ZW0pIHt9LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW52b2tlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgcmVtb3ZlIGJ1dHRvbiBvbiBhbiBpdGVtIGZyb20gdGhlIGRyb3Bkb3duIG1lbnUuXG5cdFx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgaXRlbVxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSBpdGVtIFRoZSBpdGVtIHNlbGVjdGVkXG5cdFx0XHQgKiBAcmV0dXJuIHt2b2lkfVxuXHRcdFx0ICovXG5cdFx0XHRvblJlbW92ZSh2YWx1ZSwgaXRlbSkge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJbnZva2VkIHRvIGdlbmVyYXRlIHRoZSByZW5kZXIgdHJlZSBmb3IgdGhlIGRyb3Bkb3duIG1lbnUuIEVuc3VyZSB0aGVcblx0XHRcdCAqIHJldHVybmVkIHRyZWUgaW5jbHVkZXMgYGl0ZW1zYCBvciBlbHNlIG5vIGl0ZW1zIHdpbGwgYmUgcmVuZGVyZWQuXG5cdFx0XHQgKiBgc3R5bGVzYCB3aWxsIGNvbnRhaW4geyB0b3AsIGxlZnQsIG1pbldpZHRoIH0gd2hpY2ggYXJlIHRoZSBjb29yZGluYXRlc1xuXHRcdFx0ICogb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBhbmQgdGhlIHdpZHRoIG9mIHRoZSBkcm9wZG93biBtZW51LlxuXHRcdFx0ICogQHBhcmFtICB7Q29tcG9uZW50W119IGl0ZW1zIFRoZSBpdGVtcyB0byByZW5kZXJcblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGlucHV0XG5cdFx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IHN0eWxlcyBNZW51IHN0eWxlc1xuXHRcdFx0ICogQHJldHVybiB7Q29tcG9uZW50fSBUaGUgcmVuZGVyZWQgbWVudVxuXHRcdFx0ICovXG5cdFx0XHRyZW5kZXJNZW51KGl0ZW1zLCB2YWx1ZSwgc3R5bGVzKSB7XG5cdFx0XHRcdGNvbnN0IGF1dG9jb21wbGV0ZVN0eWxlcyA9IHtcblx0XHRcdFx0XHQuLi5zdHlsZXMsXG5cdFx0XHRcdFx0Li4udGhpcy5tZW51U3R5bGUsXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImF1dG9jb21wbGV0ZS1tZW51XCIgc3R5bGU9e2F1dG9jb21wbGV0ZVN0eWxlc30+XG5cdFx0XHRcdFx0XHR7aXRlbXN9XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFN0eWxlcyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoZSBkcm9wZG93biBtZW51IGluIHRoZSBkZWZhdWx0IGByZW5kZXJNZW51YFxuXHRcdFx0ICogaW1wbGVtZW50YXRpb24uIElmIHlvdSBvdmVycmlkZSBgcmVuZGVyTWVudWAgYW5kIHlvdSB3YW50IHRvIHVzZVxuXHRcdFx0ICogYG1lbnVTdHlsZXNgIHlvdSBtdXN0IG1hbnVhbGx5IGFwcGx5IHRoZW0gKGB0aGlzLnByb3BzLm1lbnVTdHlsZXNgKS5cblx0XHRcdCAqIDwuLi4gc3R5bGU9e3sgLi4uc3R5bGVzLCAuLi50aGlzLnByb3BzLm1lbnVTdHlsZSB9fSAuLi4+XG5cdFx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdFx0ICovXG5cdFx0XHRtZW51U3R5bGU6IHtcblx0XHRcdFx0cG9zaXRpb246IFwiZml4ZWRcIixcblx0XHRcdFx0ekluZGV4OiBcIjFcIixcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW52b2tlZCBmb3IgZWFjaCBlbnRyeSBpbiBgaXRlbXNgIHRoYXQgYWxzbyBwYXNzZXMgYHNob3VsZEl0ZW1SZW5kZXJgIHRvXG5cdFx0XHQgKiBnZW5lcmF0ZSB0aGUgcmVuZGVyIHRyZWUgZm9yIGVhY2ggaXRlbSBpbiB0aGUgZHJvcGRvd24gbWVudS4gYHN0eWxlc2AgaXNcblx0XHRcdCAqIGFuIG9wdGlvbmFsIHNldCBvZiBzdHlsZXMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBpbXByb3ZlIHRoZSBsb29rL2ZlZWxcblx0XHRcdCAqIG9mIHRoZSBpdGVtcyBpbiB0aGUgZHJvcGRvd24gbWVudS5cblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIGl0ZW0gdmFsdWVcblx0XHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGlzSGlnaGxpZ2h0ZWQgSXMgaXRlbSBoaWdobGlnaHRlZD9cblx0XHRcdCAqIEBwYXJhbSAge09iamVjdH0gc3R5bGVzIEl0ZW0gc3R5bGVzXG5cdFx0XHQgKiBAcmV0dXJuIHtDb21wb25lbnR9IFRoZSByZW5kZXJkIGl0ZW1cblx0XHRcdCAqL1xuXHRcdFx0cmVuZGVySXRlbSh2YWx1ZSwgaXNIaWdobGlnaHRlZCwgc3R5bGVzKSB7XG5cdFx0XHRcdGNvbnN0IHJlbW92ZUNsaWNrID0gKGUpID0+IHtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLm9uUmVtb3ZlKHRoaXMudmFsdWUsIHZhbHVlKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3QgcmVtb3ZlQnV0dG9uID0gKHRoaXMucmVtb3ZlQnV0dG9uID8gKFxuXHRcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi14IGNsaWNrYWJsZSBhdXRvY29tcGxldGUtcmVtb3ZlLWJ1dHRvblwiIHRpdGxlPVwiUmVtb3ZlXCIgb249e3tjbGljazogcmVtb3ZlQ2xpY2t9fT48L2k+XG5cdFx0XHRcdCkgOiBudWxsKTtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17YGF1dG9jb21wbGV0ZS1pdGVtJHtpc0hpZ2hsaWdodGVkID8gXCIgYXV0b2NvbXBsZXRlLWhpZ2hsaWdodFwiIDogXCJcIn1gfSBzdHlsZT17c3R5bGVzfT57cmVtb3ZlQnV0dG9ufXt2YWx1ZX08L2Rpdj5cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogVXNlZCB0byByZWFkIHRoZSBkaXNwbGF5IHZhbHVlIGZyb20gZWFjaCBlbnRyeSBpbiBgaXRlbXNgLlxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSBpdGVtIFRoZSBpdGVtXG5cdFx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgaXRlbVxuXHRcdFx0ICovXG5cdFx0XHRnZXRJdGVtVmFsdWUoaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQSBkaXN0YW5jZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaXRlbSB3ZWlnaHQuXG5cdFx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGl0ZW0gVGhlIHZhbHVlIG9mIHRoZSBpdGVtXG5cdFx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRcblx0XHRcdCAqIEByZXR1cm4ge0FueX0gVGhlIHdlaWdodCBvZiB0aGlzIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gdmFsdWVcblx0XHRcdCAqL1xuXHRcdFx0Z2V0SXRlbVdlaWdodChpdGVtLCB2YWx1ZSkge1xuXHRcdFx0XHQvLyBtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9mdXp6eXNlYXJjaFxuXHRcdFx0XHRjb25zdCBobGVuID0gaXRlbS5sZW5ndGg7XG5cdFx0XHRcdGNvbnN0IG5sZW4gPSB2YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdGlmIChubGVuID4gaGxlbikge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmxlbiA9PT0gaGxlbikge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSA9PT0gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgd2VpZ2h0ID0gMDtcblx0XHRcdFx0b3V0ZXI6IGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IG5sZW47IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IG5jaCA9IHZhbHVlLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRcdFx0d2hpbGUgKGogPCBobGVuKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS5jaGFyQ29kZUF0KGorKykgPT09IG5jaCkge1xuXHRcdFx0XHRcdFx0XHR3ZWlnaHQgKz0gKGogLSAxKTtcblx0XHRcdFx0XHRcdFx0Y29udGludWUgb3V0ZXI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gd2VpZ2h0O1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJbnZva2VkIGZvciBlYWNoIGVudHJ5IGluIGBpdGVtc2AgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgdXNlZCB0b1xuXHRcdFx0ICogZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IGl0IHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGhlIGRyb3Bkb3duIG1lbnUuXG5cdFx0XHQgKiBCeSBkZWZhdWx0IGFsbCBpdGVtcyBhcmUgYWx3YXlzIHJlbmRlcmVkLlxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSBpdGVtIFRoZSB2YWx1ZSBvZiB0aGUgaXRlbVxuXHRcdFx0ICogQHBhcmFtICB7U3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGlucHV0XG5cdFx0XHQgKiBAcGFyYW0gIHtBbnl9IHdlaWdodCBUaGUgd2VpZ2h0IHJldHVybmVkIGJ5IGB0aGlzLnByb3BzLmdldEl0ZW1XZWlnaHRgXG5cdFx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBTaG91bGQgdGhlIGl0ZW0gYmUgcmVuZGVyZWQ/XG5cdFx0XHQgKi9cblx0XHRcdHNob3VsZEl0ZW1SZW5kZXIoaXRlbSwgdmFsdWUsIHdlaWdodCkge1xuXHRcdFx0XHRyZXR1cm4gaXRlbSAhPT0gdmFsdWUgJiYgKHZhbHVlID09PSBcIlwiIHx8IHdlaWdodCAhPT0gZmFsc2UpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgZnVuY3Rpb24gd2hpY2ggaXMgdXNlZCB0byBzb3J0IGBpdGVtc2AgYmVmb3JlIGRpc3BsYXkuXG5cdFx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGl0ZW1BIFRoZSBmaXJzdCBpdGVtIHZhbHVlIHRvIGNvbXBhcmVcblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gaXRlbUIgVGhlIHNlY29uZCBpdGVtIHZhbHVlIHRvIGNvbXBhcmVcblx0XHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBpbnB1dFxuXHRcdFx0ICogQHBhcmFtICB7QW55fSB3ZWlnaHRBIFRoZSB3ZWlnaHQgcmV0dXJuZWQgYnkgdGhpcy5wcm9wcy5nZXRJdGVtV2VpZ2h0IG9mIHRoZSBmaXJzdCBpdGVtXG5cdFx0XHQgKiBAcGFyYW0gIHtBbnl9IHdlaWdodEIgVGhlIHdlaWdodCByZXR1cm5lZCBieSB0aGlzLnByb3BzLmdldEl0ZW1XZWlnaHQgb2YgdGhlIHNlY29uZCBpdGVtXG5cdFx0XHQgKiBAcmV0dXJuIHtpbnRlZ2VyfSA8IDA6IGl0ZW1BIGZpcnN0OyA+IDAgaXRlbUIgZmlyc3Q7ID0gMCBsZWF2ZSB1bmNoYW5nZWRcblx0XHRcdCAqL1xuXHRcdFx0c29ydEl0ZW1zKGl0ZW1BLCBpdGVtQiwgdmFsdWUsIHdlaWdodEEsIHdlaWdodEIpIHtcblx0XHRcdFx0aWYgKHdlaWdodEEgPT09IHdlaWdodEIpIHtcblx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAod2VpZ2h0QSA8IHdlaWdodEIgPyAtMSA6IDEpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqIEB0eXBlIHtCb29sZWFufSBXaGV0aGVyIG9yIG5vdCB0byBhdXRvbWF0aWNhbGx5IGhpZ2hsaWdodCB0aGUgdG9wIG1hdGNoIGluIHRoZSBkcm9wZG93biBtZW51LiAqL1xuXHRcdFx0YXV0b0hpZ2hsaWdodDogZmFsc2UsXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSW52b2tlZCBldmVyeSB0aW1lIHRoZSBkcm9wZG93biBtZW51J3MgdmlzaWJpbGl0eSBjaGFuZ2VzIChpLmUuIGV2ZXJ5XG5cdFx0XHQgKiB0aW1lIGl0IGlzIGRpc3BsYXllZC9oaWRkZW4pLlxuXHRcdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaXNPcGVuIElzIHRoZSBtZW51IHNob3dpbmc/XG5cdFx0XHQgKiBAcmV0dXJuIHt2b2lkfVxuXHRcdFx0ICovXG5cdFx0XHRvbk1lbnVWaXNpYmlsaXR5Q2hhbmdlKGlzT3Blbikge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBVc2VkIHRvIG92ZXJyaWRlIHRoZSBpbnRlcm5hbCBsb2dpYyB3aGljaCBkaXNwbGF5cy9oaWRlcyB0aGUgZHJvcGRvd25cblx0XHRcdCAqIG1lbnUuIFRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGZvcmNlIGEgY2VydGFpbiBzdGF0ZSBiYXNlZCBvbiB5b3VyXG5cdFx0XHQgKiBVWC9idXNpbmVzcyBsb2dpYy4gVXNlIGl0IHRvZ2V0aGVyIHdpdGggYG9uTWVudVZpc2liaWxpdHlDaGFuZ2VgIGZvclxuXHRcdFx0ICogZmluZS1ncmFpbmVkIGNvbnRyb2wgb3ZlciB0aGUgZHJvcGRvd24gbWVudSBkeW5hbWljcy5cblx0XHRcdCAqIEB0eXBlIHtCb29sZWFufVxuXHRcdFx0ICovXG5cdFx0XHQvLyBvcGVuOiB0cnVlLFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIHRhYmluZGV4IG9mIGlucHV0XG5cdFx0XHQgKiBAdHlwZSB7TnVtYmVyfFN0cmluZ31cblx0XHRcdCAqL1xuXHRcdFx0dGFiSW5kZXg6IFwiXCIsXG5cdFx0fTtcblx0fVxuXG5cdGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge2lzT3BlbjogZmFsc2UsIGhpZ2hsaWdodGVkSW5kZXg6IG51bGwsIG1lbnVQb3NpdGlvblNldDogZmFsc2V9O1xuXHR9XG5cblx0Y29tcG9uZW50V2lsbE1vdW50KCkge1xuXHRcdC8vIHRoaXMucmVmcyBpcyBmcm96ZW4sIHNvIHdlIG5lZWQgdG8gYXNzaWduIGEgbmV3IG9iamVjdCB0byBpdFxuXHRcdHRoaXMucmVmcyA9IHt9O1xuXHRcdHRoaXMuX2lnbm9yZUJsdXIgPSBmYWxzZTtcblx0fVxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG5cdFx0Ly8gSWYgYGl0ZW1zYCBoYXMgY2hhbmdlZCB3ZSB3YW50IHRvIHJlc2V0IGBoaWdobGlnaHRlZEluZGV4YFxuXHRcdC8vIHNpbmNlIGl0IHByb2JhYmx5IG5vIGxvbmdlciByZWZlcnMgdG8gYSByZWxldmFudCBpdGVtXG5cdFx0aWYgKHRoaXMucHJvcHMuaXRlbXMgIT09IG5leHRQcm9wcy5pdGVtcyB8fFxuXHRcdFx0Ly8gVGhlIGVudHJpZXMgaW4gYGl0ZW1zYCBtYXkgaGF2ZSBiZWVuIGNoYW5nZWQgZXZlbiB0aG91Z2ggdGhlXG5cdFx0XHQvLyBvYmplY3QgcmVmZXJlbmNlIHJlbWFpbnMgdGhlIHNhbWUsIGRvdWJsZSBjaGVjayBieSBzZWVpbmdcblx0XHRcdC8vIGlmIGBoaWdobGlnaHRlZEluZGV4YCBwb2ludHMgdG8gYW4gZXhpc3RpbmcgaXRlbVxuXHRcdFx0dGhpcy5zdGF0ZS5oaWdobGlnaHRlZEluZGV4ID49IG5leHRQcm9wcy5pdGVtcy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2hpZ2hsaWdodGVkSW5kZXg6IG51bGx9KTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5zZXRNZW51UG9zaXRpb25zKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG5cdFx0aWYgKCh0aGlzLnN0YXRlLmlzT3BlbiAmJiAhcHJldlN0YXRlLmlzT3BlbikgfHwgKFwib3BlblwiIGluIHRoaXMucHJvcHMgJiYgdGhpcy5wcm9wcy5vcGVuICYmICFwcmV2UHJvcHMub3BlbikpIHtcblx0XHRcdHRoaXMuc2V0TWVudVBvc2l0aW9ucygpO1xuXHRcdH1cblxuXHRcdHRoaXMubWF5YmVTY3JvbGxJdGVtSW50b1ZpZXcoKTtcblx0XHRpZiAocHJldlN0YXRlLmlzT3BlbiAhPT0gdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHRoaXMucHJvcHMub25NZW51VmlzaWJpbGl0eUNoYW5nZSh0aGlzLnN0YXRlLmlzT3Blbik7XG5cdFx0fVxuXHR9XG5cblx0ZXhwb3NlQVBJKGVsKSB7XG5cdFx0SU1QRVJBVElWRV9BUEkuZm9yRWFjaChldiA9PiB0aGlzW2V2XSA9IChlbCAmJiBlbFtldl0gJiYgZWxbZXZdLmJpbmQoZWwpKSk7XG5cdH1cblxuXHRtYXliZVNjcm9sbEl0ZW1JbnRvVmlldygpIHtcblx0XHRpZiAodGhpcy5pc09wZW4oKSAmJiB0aGlzLnN0YXRlLmhpZ2hsaWdodGVkSW5kZXggIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IGl0ZW1Ob2RlID0gdGhpcy5yZWZzW2BpdGVtLSR7dGhpcy5zdGF0ZS5oaWdobGlnaHRlZEluZGV4fWBdO1xuXHRcdFx0Y29uc3QgbWVudU5vZGUgPSB0aGlzLnJlZnMubWVudTtcblx0XHRcdGlmIChpdGVtTm9kZSkge1xuXHRcdFx0XHRtZW51Tm9kZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0XHRcdGl0ZW1Ob2RlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG5cdFx0Y29uc3Qga2V5RG93bkhhbmRsZXJzID0ge1xuXHRcdFx0QXJyb3dEb3duOiAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGNvbnN0IGl0ZW1zTGVuZ3RoID0gdGhpcy5nZXRGaWx0ZXJlZEl0ZW1zKCkubGVuZ3RoO1xuXHRcdFx0XHRpZiAoIWl0ZW1zTGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHtoaWdobGlnaHRlZEluZGV4fSA9IHRoaXMuc3RhdGU7XG5cdFx0XHRcdGxldCBpbmRleCA9IGhpZ2hsaWdodGVkSW5kZXggPT09IG51bGwgPyAwIDogaGlnaGxpZ2h0ZWRJbmRleCArIDE7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBpdGVtc0xlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtoaWdobGlnaHRlZEluZGV4OiBpbmRleCwgaXNPcGVuOiB0cnVlfSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRBcnJvd1VwOiAoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGNvbnN0IGl0ZW1zTGVuZ3RoID0gdGhpcy5nZXRGaWx0ZXJlZEl0ZW1zKCkubGVuZ3RoO1xuXHRcdFx0XHRpZiAoIWl0ZW1zTGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHtoaWdobGlnaHRlZEluZGV4fSA9IHRoaXMuc3RhdGU7XG5cdFx0XHRcdGxldCBpbmRleCA9IGhpZ2hsaWdodGVkSW5kZXggPT09IG51bGwgPyBpdGVtc0xlbmd0aCAtIDEgOiBoaWdobGlnaHRlZEluZGV4IC0gMTtcblx0XHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRcdGluZGV4ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtoaWdobGlnaHRlZEluZGV4OiBpbmRleCwgaXNPcGVuOiB0cnVlfSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRFbnRlcjogKGUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHRcdFx0Ly8gbWVudSBpcyBjbG9zZWQgc28gdGhlcmUgaXMgbm8gc2VsZWN0aW9uIHRvIGFjY2VwdCAtPiBkbyBub3RoaW5nXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdC8vIGlucHV0IGhhcyBmb2N1cyBidXQgbm8gbWVudSBpdGVtIGlzIHNlbGVjdGVkICsgZW50ZXIgaXMgaGl0IC0+IGNsb3NlIHRoZSBtZW51XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiBmYWxzZX0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHRleHQgZW50ZXJlZCArIG1lbnUgaXRlbSBoYXMgYmVlbiBoaWdobGlnaHRlZCArIGVudGVyIGlzIGhpdCAtPiB1cGRhdGUgdmFsdWUgdG8gdGhhdCBvZiBzZWxlY3RlZCBtZW51IGl0ZW0sIGNsb3NlIHRoZSBtZW51XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmdldEZpbHRlcmVkSXRlbXMoKVt0aGlzLnN0YXRlLmhpZ2hsaWdodGVkSW5kZXhdO1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gdGhpcy5wcm9wcy5nZXRJdGVtVmFsdWUoaXRlbSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiBmYWxzZSwgaGlnaGxpZ2h0ZWRJbmRleDogbnVsbCwgdmFsdWV9KTtcblx0XHRcdFx0XHQvLyB0aGlzLnJlZnMuaW5wdXQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHQvLyB0aGlzLnJlZnMuaW5wdXQuc2VsZWN0KCk7XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5vblNlbGVjdCh2YWx1ZSwgaXRlbSk7XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSh7XG5cdFx0XHRcdFx0XHR0YXJnZXQ6IHRoaXMucmVmcy5pbnB1dCxcblx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZWN0XCIsXG5cdFx0XHRcdFx0fSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRFc2NhcGU6ICgpID0+IHtcblx0XHRcdFx0Ly8gSW4gY2FzZSB0aGUgdXNlciBpcyBjdXJyZW50bHkgaG92ZXJpbmcgb3ZlciB0aGUgbWVudVxuXHRcdFx0XHR0aGlzLnNldElnbm9yZUJsdXIoZmFsc2UpO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtoaWdobGlnaHRlZEluZGV4OiBudWxsLCBpc09wZW46IGZhbHNlfSk7XG5cdFx0XHR9LFxuXG5cdFx0XHREZWxldGU6IChlKSA9PiB7XG5cdFx0XHRcdC8vIFtzaGlmdF0gKyBbZGVsXSB0byByZW1vdmUgaXRlbVxuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5yZW1vdmVCdXR0b24gJiYgdGhpcy5zdGF0ZS5oaWdobGlnaHRlZEluZGV4ICE9PSBudWxsICYmIGUuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHR0aGlzLnByb3BzLm9uUmVtb3ZlKHRoaXMuc3RhdGUudmFsdWUsIHRoaXMucmVmc1tgaXRlbS0ke3RoaXMuc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleH1gXS50ZXh0Q29udGVudCk7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRUYWI6ICgpID0+IHtcblx0XHRcdFx0Ly8gSW4gY2FzZSB0aGUgdXNlciBpcyBjdXJyZW50bHkgaG92ZXJpbmcgb3ZlciB0aGUgbWVudVxuXHRcdFx0XHR0aGlzLnNldElnbm9yZUJsdXIoZmFsc2UpO1xuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0aWYgKGtleURvd25IYW5kbGVyc1tldmVudC5rZXldKSB7XG5cdFx0XHRrZXlEb3duSGFuZGxlcnNbZXZlbnQua2V5XShldmVudCk7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlQ2hhbmdlKGV2ZW50LCBmb3JjZSA9IGZhbHNlKSB7XG5cdFx0aWYgKCFmb3JjZSAmJiB0aGlzLl9pZ25vcmVCbHVyKSB7XG5cdFx0XHQvLyBoYW5kbGUgY2hhbmdlIGFmdGVyIG90aGVyIGV2ZW50cyBsaWtlIHNlbGVjdGluZyBhbiBpdGVtXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQsIHRydWUpO1xuXHRcdFx0fSwgMTAwKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB7dmFsdWV9ID0gZXZlbnQudGFyZ2V0O1xuXHRcdHRoaXMuc2V0U3RhdGUoe2hpZ2hsaWdodGVkSW5kZXg6IG51bGwsIHZhbHVlfSk7XG5cdFx0dGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCwgdmFsdWUpO1xuXHR9XG5cblx0aGFuZGxlSW5wdXQoZXZlbnQpIHtcblx0XHRjb25zdCB7dmFsdWV9ID0gZXZlbnQudGFyZ2V0O1xuXHRcdHRoaXMuc2V0U3RhdGUoe2hpZ2hsaWdodGVkSW5kZXg6IG51bGwsIHZhbHVlfSk7XG5cdFx0dGhpcy5wcm9wcy5vbklucHV0KGV2ZW50LCB2YWx1ZSk7XG5cdH1cblxuXHRnZXRGaWx0ZXJlZEl0ZW1zKCkge1xuXHRcdGxldCB7aXRlbXN9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB7dmFsdWV9ID0gdGhpcy5zdGF0ZTtcblx0XHRjb25zdCBpdGVtV2VpZ2h0cyA9IGl0ZW1zLnJlZHVjZSgocHJldiwgaXRlbSkgPT4ge1xuXHRcdFx0cHJldltpdGVtXSA9IHRoaXMucHJvcHMuZ2V0SXRlbVdlaWdodChpdGVtLCB2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCB7fSk7XG5cblx0XHRpZiAodGhpcy5wcm9wcy5zaG91bGRJdGVtUmVuZGVyKSB7XG5cdFx0XHRpdGVtcyA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgPT4gKHRoaXMucHJvcHMuc2hvdWxkSXRlbVJlbmRlcihpdGVtLCB2YWx1ZSwgaXRlbVdlaWdodHNbaXRlbV0pKSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMuc29ydEl0ZW1zKSB7XG5cdFx0XHRpdGVtcy5zb3J0KChhLCBiKSA9PiAodGhpcy5wcm9wcy5zb3J0SXRlbXMoYSwgYiwgdmFsdWUsIGl0ZW1XZWlnaHRzW2FdLCBpdGVtV2VpZ2h0c1tiXSkpKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5tYXhJdGVtcyA+IDApIHtcblx0XHRcdGl0ZW1zLnNwbGljZSh0aGlzLnByb3BzLm1heEl0ZW1zKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbXM7XG5cdH1cblxuXHRzZXRNZW51UG9zaXRpb25zKCkge1xuXHRcdGNvbnN0IG5vZGUgPSB0aGlzLnJlZnMuaW5wdXQ7XG5cdFx0Y29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0Y29uc3QgY29tcHV0ZWRTdHlsZSA9IGdsb2JhbC53aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0XHRjb25zdCBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChjb21wdXRlZFN0eWxlLm1hcmdpbkJvdHRvbSwgMTApIHx8IDA7XG5cdFx0Y29uc3QgbWFyZ2luTGVmdCA9IHBhcnNlSW50KGNvbXB1dGVkU3R5bGUubWFyZ2luTGVmdCwgMTApIHx8IDA7XG5cdFx0Y29uc3QgbWFyZ2luUmlnaHQgPSBwYXJzZUludChjb21wdXRlZFN0eWxlLm1hcmdpblJpZ2h0LCAxMCkgfHwgMDtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1lbnVUb3A6IHJlY3QuYm90dG9tICsgbWFyZ2luQm90dG9tLFxuXHRcdFx0bWVudUxlZnQ6IHJlY3QubGVmdCArIG1hcmdpbkxlZnQsXG5cdFx0XHRtZW51V2lkdGg6IHJlY3Qud2lkdGggKyBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQsXG5cdFx0XHRtZW51UG9zaXRpb25TZXQ6IHRydWUsXG5cdFx0fSk7XG5cdH1cblxuXHRoaWdobGlnaHRJdGVtRnJvbU1vdXNlKGluZGV4KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7aGlnaGxpZ2h0ZWRJbmRleDogaW5kZXh9KTtcblx0fVxuXG5cdHNlbGVjdEl0ZW1Gcm9tTW91c2UoaXRlbSkge1xuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5wcm9wcy5nZXRJdGVtVmFsdWUoaXRlbSk7XG5cdFx0dGhpcy5zZXRJZ25vcmVCbHVyKGZhbHNlKTtcblx0XHR0aGlzLnNldFN0YXRlKHtpc09wZW46IGZhbHNlLCBoaWdobGlnaHRlZEluZGV4OiBudWxsLCB2YWx1ZX0pO1xuXHRcdC8vIHRoaXMucmVmcy5pbnB1dC52YWx1ZSA9IHZhbHVlO1xuXHRcdC8vIHRoaXMucmVmcy5pbnB1dC5zZWxlY3QoKTtcblx0XHR0aGlzLnByb3BzLm9uU2VsZWN0KHZhbHVlLCBpdGVtKTtcblx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKHtcblx0XHRcdHRhcmdldDogdGhpcy5yZWZzLmlucHV0LFxuXHRcdFx0dHlwZTogXCJzZWxlY3RcIixcblx0XHR9LCB2YWx1ZSk7XG5cdH1cblxuXHRzZXRJZ25vcmVCbHVyKGlnbm9yZSkge1xuXHRcdHRoaXMuX2lnbm9yZUJsdXIgPSBpZ25vcmU7XG5cdH1cblxuXHRyZW5kZXJNZW51KCkge1xuXHRcdGlmICghdGhpcy5zdGF0ZS5tZW51UG9zaXRpb25TZXQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5nZXRGaWx0ZXJlZEl0ZW1zKCkubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IHRoaXMucHJvcHMucmVuZGVySXRlbShpdGVtLCB0aGlzLnN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPT09IGluZGV4LCB7Y3Vyc29yOiBcImRlZmF1bHRcIn0pO1xuXHRcdFx0ZWxlbWVudC5wcm9wcyA9IHtcblx0XHRcdFx0Li4uZWxlbWVudC5wcm9wcyxcblx0XHRcdFx0b25tb3VzZW1vdmU6ICgpID0+IHRoaXMuaGlnaGxpZ2h0SXRlbUZyb21Nb3VzZShpbmRleCksXG5cdFx0XHRcdG9uY2xpY2s6ICgpID0+IHRoaXMuc2VsZWN0SXRlbUZyb21Nb3VzZShpdGVtKSxcblx0XHRcdFx0cmVmOiBgaXRlbS0ke2luZGV4fWAsXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0fSk7XG5cdFx0aWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IHN0eWxlID0ge1xuXHRcdFx0bGVmdDogYCR7dGhpcy5zdGF0ZS5tZW51TGVmdH1weGAsXG5cdFx0XHR0b3A6IGAke3RoaXMuc3RhdGUubWVudVRvcH1weGAsXG5cdFx0XHRtaW5XaWR0aDogYCR7dGhpcy5zdGF0ZS5tZW51V2lkdGh9cHhgLFxuXHRcdH07XG5cdFx0Y29uc3QgbWVudSA9IHRoaXMucHJvcHMucmVuZGVyTWVudShpdGVtcywgdGhpcy5zdGF0ZS52YWx1ZSwgc3R5bGUpO1xuXHRcdG1lbnUucHJvcHMgPSB7XG5cdFx0XHQuLi5tZW51LnByb3BzLFxuXHRcdFx0b25tb3VzZWVudGVyOiAoKSA9PiB0aGlzLnNldElnbm9yZUJsdXIodHJ1ZSksXG5cdFx0XHRvbm1vdXNlbGVhdmU6ICgpID0+IHRoaXMuc2V0SWdub3JlQmx1cihmYWxzZSksXG5cdFx0XHRyZWY6IFwibWVudVwiLFxuXHRcdH07XG5cdFx0cmV0dXJuIG1lbnU7XG5cdH1cblxuXHRoYW5kbGVJbnB1dEJsdXIoKSB7XG5cdFx0aWYgKHRoaXMuX2lnbm9yZUJsdXIpIHtcblx0XHRcdHRoaXMucmVmcy5pbnB1dC5mb2N1cygpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHtpc09wZW46IGZhbHNlLCBoaWdobGlnaHRlZEluZGV4OiBudWxsfSk7XG5cdH1cblxuXHRoYW5kbGVJbnB1dEZvY3VzKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuX2lnbm9yZUJsdXIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKGV2ZW50LnRhcmdldC52YWx1ZSAhPT0gXCJcIikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XG5cdFx0fVxuXHR9XG5cblx0aXNJbnB1dEZvY3VzZWQoKSB7XG5cdFx0Y29uc3QgZWwgPSB0aGlzLnJlZnMuaW5wdXQ7XG5cdFx0cmV0dXJuIGVsLm93bmVyRG9jdW1lbnQgJiYgKGVsID09PSBlbC5vd25lckRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXHR9XG5cblx0aGFuZGxlSW5wdXRDbGljayhldikge1xuXHRcdGlmICh0aGlzLnN0YXRlLm1lbnVQb3NpdGlvblNldCAmJiB0aGlzLnN0YXRlLm1lbnVUb3AgPD0gZXYueSkge1xuXHRcdFx0Ly8gY2xpY2sgd2FzIG9uIG1lbnUgbm90IGlucHV0XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5wdXQgd2lsbCBub3QgYmUgZm9jdXNlZCBpZiBpdCdzIGRpc2FibGVkXG5cdFx0aWYgKHRoaXMuaXNJbnB1dEZvY3VzZWQoKSAmJiAhdGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XG5cdFx0fVxuXHR9XG5cblx0aXNPcGVuKCkge1xuXHRcdHJldHVybiAoXCJvcGVuXCIgaW4gdGhpcy5wcm9wcyA/IHRoaXMucHJvcHMub3BlbiA6IHRoaXMuc3RhdGUuaXNPcGVuKTtcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRjb25zdCBvcGVuID0gdGhpcy5pc09wZW4oKTtcblx0XHRjb25zdCBhdHRyID0ge1xuXHRcdFx0cm9sZTogXCJjb21ib2JveFwiLFxuXHRcdFx0XCJhcmlhLWF1dG9jb21wbGV0ZVwiOiBcImxpc3RcIixcblx0XHRcdFwiYXJpYS1leHBhbmRlZFwiOiBvcGVuLFxuXHRcdFx0YXV0b0NvbXBsZXRlOiBcIm9mZlwiLFxuXHRcdH07XG5cdFx0Y29uc3Qgb24gPSB7XG5cdFx0XHRmb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLFxuXHRcdFx0Ymx1cjogdGhpcy5oYW5kbGVJbnB1dEJsdXIsXG5cdFx0XHRjaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLFxuXHRcdFx0aW5wdXQ6IHRoaXMuaGFuZGxlSW5wdXQsXG5cdFx0XHRrZXlkb3duOiB0aGlzLmhhbmRsZUtleURvd24sXG5cdFx0XHRjbGljazogdGhpcy5oYW5kbGVJbnB1dENsaWNrLFxuXHRcdH07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiYXV0b2NvbXBsZXRlXCI+XG5cdFx0XHRcdDxpbnB1dCBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzIGlucHV0LXRleHQgYXV0b2NvbXBsZXRlLWlucHV0XCIgYXR0cmlidXRlcz17YXR0cn0gdGFiSW5kZXg9e3RoaXMucHJvcHMudGFiSW5kZXh9IHJlZj1cImlucHV0XCIgb249e29ufSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0vPlxuXHRcdFx0XHR7b3BlbiA/IHRoaXMucmVuZGVyTWVudSgpIDogXCJcIn1cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==