Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint "class-methods-use-this": ["error", {"exceptMethods": ["viewForItem"]}] */

var _atomSpacePenViews = require('atom-space-pen-views');

var _mobx = require('mobx');

var _underscorePlus = require('underscore-plus');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

'use babel';
var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    var _this = this;

    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).call(this);

    (0, _mobx.autorun)('Loading projects for list view', function () {
      if (_this.panel && _this.panel.isVisible()) {
        _this.show(_Manager2['default'].projects);
      }
    });
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');

      var infoText = 'shift+click or shift+enter will open project in the current window';
      if (ProjectsListView.reversedConfirm) {
        infoText = 'shift+click or shift+enter will open project in a new window';
      }
      var infoElement = document.createElement('div');
      infoElement.className = 'text-smaller';
      infoElement.innerHTML = infoText;
      this.error.after(infoElement);

      atom.commands.add(this.element, {
        'project-manager:alt-confirm': function projectManagerAltConfirm(event) {
          _this2.altConfirmed();
          event.stopPropagation();
        }
      });
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = ProjectsListView.possibleFilterKeys.includes(inputArr[0]);
      var filter = ProjectsListView.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      }
      return _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        this.show(_Manager2['default'].projects);
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      this.storeFocusedElement();

      var sortedProjects = ProjectsListView.sortItems(projects);

      this.setItems(sortedProjects);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(project) {
      if (project) {
        _Manager.Manager.open(project, this.isShiftPressed ? !ProjectsListView.reversedConfirm : ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'altConfirmed',
    value: function altConfirmed() {
      var project = this.getSelectedItem();
      if (project) {
        _Manager.Manager.open(project, !ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'cancel', this).call(this);
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.hide();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(project) {
      var _this4 = this;

      var _project$props = project.props;
      var title = _project$props.title;
      var group = _project$props.group;
      var icon = _project$props.icon;
      var color = _project$props.color;
      var devMode = _project$props.devMode;
      var paths = _project$props.paths;

      var showPath = ProjectsListView.showPath;
      var projectMissing = !project.stats;

      var border = color ? 'border-left: 4px inset ' + color : 'border-left: 4px inset transparent';
      var itemView = (0, _atomSpacePenViews.$$)(function itemView() {
        var _this3 = this;

        this.li({ 'class': 'two-lines' }, { 'data-path-missing': projectMissing, style: border }, function () {
          _this3.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this3.span({ 'class': 'project-manager-devmode' });
            }

            _this3.div({ 'class': 'icon ' + icon, style: 'color: ' + color }, function () {
              _this3.span({ 'class': 'project-manager-title' }, title);
              if (group) {
                _this3.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this3.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this3.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              (0, _underscorePlus.each)(paths, function (path) {
                _this3.div({ 'class': 'no-icon' }, path);
              }, _this3);
            }
          });
        });
      });

      itemView.on('mouseup', function (e) {
        _this4.isShiftPressed = e.shiftKey;
      });

      return itemView;
    }
  }], [{
    key: 'sortItems',
    value: function sortItems(items) {
      var key = ProjectsListView.sortBy;
      var sorted = items;

      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        sorted = items.sort(function (a, b) {
          var aModified = a.lastModified.getTime();
          var bModified = b.lastModified.getTime();

          return aModified > bModified ? -1 : 1;
        });
      } else {
        sorted = items.sort(function (a, b) {
          var aValue = (a[key] || '￿').toUpperCase();
          var bValue = (b[key] || '￿').toUpperCase();

          return aValue > bValue ? 1 : -1;
        });
      }

      return sorted;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }, {
    key: 'reversedConfirm',
    get: function get() {
      return atom.config.get('project-manager.alwaysOpenInSameWindow');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztpQ0FJbUMsc0JBQXNCOztvQkFDakMsTUFBTTs7OEJBQ1QsaUJBQWlCOzt1QkFDTCxZQUFZOzs7O0FBUDdDLFdBQVcsQ0FBQztJQVNTLGdCQUFnQjtZQUFoQixnQkFBZ0I7O0FBQ3hCLFdBRFEsZ0JBQWdCLEdBQ3JCOzs7MEJBREssZ0JBQWdCOztBQUVqQywrQkFGaUIsZ0JBQWdCLDZDQUV6Qjs7QUFFUix1QkFBUSxnQ0FBZ0MsRUFBRSxZQUFNO0FBQzlDLFVBQUksTUFBSyxLQUFLLElBQUksTUFBSyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDeEMsY0FBSyxJQUFJLENBQUMscUJBQVEsUUFBUSxDQUFDLENBQUM7T0FDN0I7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFUa0IsZ0JBQWdCOztXQVV6QixzQkFBRzs7O0FBQ1gsaUNBWGlCLGdCQUFnQiw0Q0FXZDtBQUNuQixVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRWpDLFVBQUksUUFBUSxHQUFHLG9FQUFvRSxDQUFDO0FBQ3BGLFVBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFO0FBQ3BDLGdCQUFRLEdBQUcsOERBQThELENBQUM7T0FDM0U7QUFDRCxVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELGlCQUFXLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztBQUN2QyxpQkFBVyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDakMsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlCLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7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YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyogZXNsaW50IFwiY2xhc3MtbWV0aG9kcy11c2UtdGhpc1wiOiBbXCJlcnJvclwiLCB7XCJleGNlcHRNZXRob2RzXCI6IFtcInZpZXdGb3JJdGVtXCJdfV0gKi9cblxuaW1wb3J0IHsgU2VsZWN0TGlzdFZpZXcsICQkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgYXV0b3J1biB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHsgZWFjaCB9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgbWFuYWdlciwgeyBNYW5hZ2VyIH0gZnJvbSAnLi4vTWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RzTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBhdXRvcnVuKCdMb2FkaW5nIHByb2plY3RzIGZvciBsaXN0IHZpZXcnLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdyhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmFkZENsYXNzKCdwcm9qZWN0LW1hbmFnZXInKTtcblxuICAgIGxldCBpbmZvVGV4dCA9ICdzaGlmdCtjbGljayBvciBzaGlmdCtlbnRlciB3aWxsIG9wZW4gcHJvamVjdCBpbiB0aGUgY3VycmVudCB3aW5kb3cnO1xuICAgIGlmIChQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSkge1xuICAgICAgaW5mb1RleHQgPSAnc2hpZnQrY2xpY2sgb3Igc2hpZnQrZW50ZXIgd2lsbCBvcGVuIHByb2plY3QgaW4gYSBuZXcgd2luZG93JztcbiAgICB9XG4gICAgY29uc3QgaW5mb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpbmZvRWxlbWVudC5jbGFzc05hbWUgPSAndGV4dC1zbWFsbGVyJztcbiAgICBpbmZvRWxlbWVudC5pbm5lckhUTUwgPSBpbmZvVGV4dDtcbiAgICB0aGlzLmVycm9yLmFmdGVyKGluZm9FbGVtZW50KTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ3Byb2plY3QtbWFuYWdlcjphbHQtY29uZmlybSc6IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmFsdENvbmZpcm1lZCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHBvc3NpYmxlRmlsdGVyS2V5cygpIHtcbiAgICByZXR1cm4gWyd0aXRsZScsICdncm91cCcsICd0ZW1wbGF0ZSddO1xuICB9XG5cbiAgc3RhdGljIGdldCBkZWZhdWx0RmlsdGVyS2V5KCkge1xuICAgIHJldHVybiAndGl0bGUnO1xuICB9XG5cbiAgc3RhdGljIGdldCBzb3J0QnkoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNvcnRCeScpO1xuICB9XG5cbiAgc3RhdGljIGdldCBzaG93UGF0aCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc2hvd1BhdGgnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcmV2ZXJzZWRDb25maXJtKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5hbHdheXNPcGVuSW5TYW1lV2luZG93Jyk7XG4gIH1cblxuICBnZXRGaWx0ZXJLZXkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBjb25zdCBpc0ZpbHRlcktleSA9IFByb2plY3RzTGlzdFZpZXcucG9zc2libGVGaWx0ZXJLZXlzLmluY2x1ZGVzKGlucHV0QXJyWzBdKTtcbiAgICBsZXQgZmlsdGVyID0gUHJvamVjdHNMaXN0Vmlldy5kZWZhdWx0RmlsdGVyS2V5O1xuXG4gICAgaWYgKGlucHV0QXJyLmxlbmd0aCA+IDEgJiYgaXNGaWx0ZXJLZXkpIHtcbiAgICAgIGZpbHRlciA9IGlucHV0QXJyWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRGaWx0ZXJRdWVyeSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZmlsdGVyRWRpdG9yVmlldy5nZXRUZXh0KCk7XG4gICAgY29uc3QgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnOicpO1xuICAgIGxldCBmaWx0ZXIgPSBpbnB1dDtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxKSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpIHtcbiAgICBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gJ05vIHByb2plY3RzIHNhdmVkIHlldCc7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5nZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KG1hbmFnZXIucHJvamVjdHMpO1xuICAgIH1cbiAgfVxuXG4gIHNob3cocHJvamVjdHMpIHtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9yZUZvY3VzZWRFbGVtZW50KCk7XG5cbiAgICBjb25zdCBzb3J0ZWRQcm9qZWN0cyA9IFByb2plY3RzTGlzdFZpZXcuc29ydEl0ZW1zKHByb2plY3RzKTtcblxuICAgIHRoaXMuc2V0SXRlbXMoc29ydGVkUHJvamVjdHMpO1xuICAgIHRoaXMuZm9jdXNGaWx0ZXJFZGl0b3IoKTtcbiAgfVxuXG4gIGNvbmZpcm1lZChwcm9qZWN0KSB7XG4gICAgaWYgKHByb2plY3QpIHtcbiAgICAgIE1hbmFnZXIub3Blbihwcm9qZWN0LCB0aGlzLmlzU2hpZnRQcmVzc2VkID9cbiAgICAgICAgIVByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtIDogUHJvamVjdHNMaXN0Vmlldy5yZXZlcnNlZENvbmZpcm0pO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgYWx0Q29uZmlybWVkKCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLmdldFNlbGVjdGVkSXRlbSgpO1xuICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICBNYW5hZ2VyLm9wZW4ocHJvamVjdCwgIVByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBzdXBlci5jYW5jZWwoKTtcbiAgfVxuXG4gIGNhbmNlbGxlZCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIHZpZXdGb3JJdGVtKHByb2plY3QpIHtcbiAgICBjb25zdCB7IHRpdGxlLCBncm91cCwgaWNvbiwgY29sb3IsIGRldk1vZGUsIHBhdGhzIH0gPSBwcm9qZWN0LnByb3BzO1xuICAgIGNvbnN0IHNob3dQYXRoID0gUHJvamVjdHNMaXN0Vmlldy5zaG93UGF0aDtcbiAgICBjb25zdCBwcm9qZWN0TWlzc2luZyA9ICFwcm9qZWN0LnN0YXRzO1xuXG4gICAgY29uc3QgYm9yZGVyID0gY29sb3IgPyBgYm9yZGVyLWxlZnQ6IDRweCBpbnNldCAke2NvbG9yfWAgOiAnYm9yZGVyLWxlZnQ6IDRweCBpbnNldCB0cmFuc3BhcmVudCc7XG4gICAgY29uc3QgaXRlbVZpZXcgPSAkJChmdW5jdGlvbiBpdGVtVmlldygpIHtcbiAgICAgIHRoaXMubGkoeyBjbGFzczogJ3R3by1saW5lcycgfSxcbiAgICAgIHsgJ2RhdGEtcGF0aC1taXNzaW5nJzogcHJvamVjdE1pc3NpbmcsIHN0eWxlOiBib3JkZXIgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAncHJpbWFyeS1saW5lJyB9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAncHJvamVjdC1tYW5hZ2VyLWRldm1vZGUnIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6IGBpY29uICR7aWNvbn1gLCBzdHlsZTogYGNvbG9yOiAke2NvbG9yfWAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItdGl0bGUnIH0sIHRpdGxlKTtcbiAgICAgICAgICAgIGlmIChncm91cCkge1xuICAgICAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ3Byb2plY3QtbWFuYWdlci1saXN0LWdyb3VwJyB9LCBncm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUnIH0sICgpID0+IHtcbiAgICAgICAgICBpZiAocHJvamVjdE1pc3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdpY29uIGljb24tYWxlcnQnIH0sICdQYXRoIGlzIG5vdCBhdmFpbGFibGUnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNob3dQYXRoKSB7XG4gICAgICAgICAgICBlYWNoKHBhdGhzLCAocGF0aCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnbm8taWNvbicgfSwgcGF0aCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdGVtVmlldy5vbignbW91c2V1cCcsIChlKSA9PiB7XG4gICAgICB0aGlzLmlzU2hpZnRQcmVzc2VkID0gZS5zaGlmdEtleTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtVmlldztcbiAgfVxuXG4gIHN0YXRpYyBzb3J0SXRlbXMoaXRlbXMpIHtcbiAgICBjb25zdCBrZXkgPSBQcm9qZWN0c0xpc3RWaWV3LnNvcnRCeTtcbiAgICBsZXQgc29ydGVkID0gaXRlbXM7XG5cbiAgICBpZiAoa2V5ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2xhc3QgbW9kaWZpZWQnKSB7XG4gICAgICBzb3J0ZWQgPSBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFNb2RpZmllZCA9IGEubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgYk1vZGlmaWVkID0gYi5sYXN0TW9kaWZpZWQuZ2V0VGltZSgpO1xuXG4gICAgICAgIHJldHVybiBhTW9kaWZpZWQgPiBiTW9kaWZpZWQgPyAtMSA6IDE7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ydGVkID0gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhVmFsdWUgPSAoYVtrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgY29uc3QgYlZhbHVlID0gKGJba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIGFWYWx1ZSA+IGJWYWx1ZSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzb3J0ZWQ7XG4gIH1cbn1cbiJdfQ==