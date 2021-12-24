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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3ZpZXdzL3Byb2plY3RzLWxpc3Qtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2lDQUltQyxzQkFBc0I7O29CQUNqQyxNQUFNOzs4QkFDVCxpQkFBaUI7O3VCQUNMLFlBQVk7Ozs7QUFQN0MsV0FBVyxDQUFDO0lBU1MsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7QUFDeEIsV0FEUSxnQkFBZ0IsR0FDckI7OzswQkFESyxnQkFBZ0I7O0FBRWpDLCtCQUZpQixnQkFBZ0IsNkNBRXpCOztBQUVSLHVCQUFRLGdDQUFnQyxFQUFFLFlBQU07QUFDOUMsVUFBSSxNQUFLLEtBQUssSUFBSSxNQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUN4QyxjQUFLLElBQUksQ0FBQyxxQkFBUSxRQUFRLENBQUMsQ0FBQztPQUM3QjtLQUNGLENBQUMsQ0FBQztHQUNKOztlQVRrQixnQkFBZ0I7O1dBVXpCLHNCQUFHOzs7QUFDWCxpQ0FYaUIsZ0JBQWdCLDRDQVdkO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxRQUFRLEdBQUcsb0VBQW9FLENBQUM7QUFDcEYsVUFBSSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUU7QUFDcEMsZ0JBQVEsR0FBRyw4REFBOEQsQ0FBQztPQUMzRTtBQUNELFVBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEQsaUJBQVcsQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ3ZDLGlCQUFXLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUNqQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5QixxQ0FBNkIsRUFBRSxrQ0FBQyxLQUFLLEVBQUs7QUFDeEMsaUJBQUssWUFBWSxFQUFFLENBQUM7QUFDcEIsZUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3pCO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQXNCVyx3QkFBRztBQUNiLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFVBQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxVQUFJLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFL0MsVUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxXQUFXLEVBQUU7QUFDdEMsY0FBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFYSwwQkFBRztBQUNmLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsVUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN2QixjQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3RCOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVjLHlCQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRTtBQUM1QyxVQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7QUFDbkIsZUFBTyx1QkFBdUIsQ0FBQztPQUNoQztBQUNELHdDQWhGaUIsZ0JBQWdCLGlEQWdGSixTQUFTLEVBQUUsaUJBQWlCLEVBQUU7S0FDNUQ7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2YsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLENBQUMscUJBQVEsUUFBUSxDQUFDLENBQUM7T0FDN0I7S0FDRjs7O1dBRUcsY0FBQyxRQUFRLEVBQUU7QUFDYixVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztPQUMzRDs7QUFFRCxVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFM0IsVUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU1RCxVQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlCLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBQzFCOzs7V0FFUSxtQkFBQyxPQUFPLEVBQUU7QUFDakIsVUFBSSxPQUFPLEVBQUU7QUFDWCx5QkFBUSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEdBQ3ZDLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3hFLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OztXQUVXLHdCQUFHO0FBQ2IsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZDLFVBQUksT0FBTyxFQUFFO0FBQ1gseUJBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pELFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNuQjtLQUNGOzs7V0FFSyxrQkFBRztBQUNQLGlDQS9IaUIsZ0JBQWdCLHdDQStIbEI7S0FDaEI7OztXQUVRLHFCQUFHO0FBQ1YsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVVLHFCQUFDLE9BQU8sRUFBRTs7OzJCQUNtQyxPQUFPLENBQUMsS0FBSztVQUEzRCxLQUFLLGtCQUFMLEtBQUs7VUFBRSxLQUFLLGtCQUFMLEtBQUs7VUFBRSxJQUFJLGtCQUFKLElBQUk7VUFBRSxLQUFLLGtCQUFMLEtBQUs7VUFBRSxPQUFPLGtCQUFQLE9BQU87VUFBRSxLQUFLLGtCQUFMLEtBQUs7O0FBQ2pELFVBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztBQUMzQyxVQUFNLGNBQWMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBRXRDLFVBQU0sTUFBTSxHQUFHLEtBQUssK0JBQTZCLEtBQUssR0FBSyxvQ0FBb0MsQ0FBQztBQUNoRyxVQUFNLFFBQVEsR0FBRywyQkFBRyxTQUFTLFFBQVEsR0FBRzs7O0FBQ3RDLFlBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFPLFdBQVcsRUFBRSxFQUM5QixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsWUFBTTtBQUM1RCxpQkFBSyxHQUFHLENBQUMsRUFBRSxTQUFPLGNBQWMsRUFBRSxFQUFFLFlBQU07QUFDeEMsZ0JBQUksT0FBTyxFQUFFO0FBQ1gscUJBQUssSUFBSSxDQUFDLEVBQUUsU0FBTyx5QkFBeUIsRUFBRSxDQUFDLENBQUM7YUFDakQ7O0FBRUQsbUJBQUssR0FBRyxDQUFDLEVBQUUsbUJBQWUsSUFBSSxBQUFFLEVBQUUsS0FBSyxjQUFZLEtBQUssQUFBRSxFQUFFLEVBQUUsWUFBTTtBQUNsRSxxQkFBSyxJQUFJLENBQUMsRUFBRSxTQUFPLHVCQUF1QixFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckQsa0JBQUksS0FBSyxFQUFFO0FBQ1QsdUJBQUssSUFBSSxDQUFDLEVBQUUsU0FBTyw0QkFBNEIsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2VBQzNEO2FBQ0YsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO0FBQ0gsaUJBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxnQkFBZ0IsRUFBRSxFQUFFLFlBQU07QUFDMUMsZ0JBQUksY0FBYyxFQUFFO0FBQ2xCLHFCQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8saUJBQWlCLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2FBQ2pFLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDbkIsd0NBQUssS0FBSyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3BCLHVCQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8sU0FBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7ZUFDdEMsU0FBTyxDQUFDO2FBQ1Y7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsY0FBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDNUIsZUFBSyxjQUFjLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztPQUNsQyxDQUFDLENBQUM7O0FBRUgsYUFBTyxRQUFRLENBQUM7S0FDakI7OztXQUVlLG1CQUFDLEtBQUssRUFBRTtBQUN0QixVQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDcEMsVUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVuQixVQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7QUFDckIsZUFBTyxLQUFLLENBQUM7T0FDZCxNQUFNLElBQUksR0FBRyxLQUFLLGVBQWUsRUFBRTtBQUNsQyxjQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDNUIsY0FBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQyxjQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUUzQyxpQkFBTyxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QyxDQUFDLENBQUM7T0FDSixNQUFNO0FBQ0wsY0FBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQzVCLGNBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQVEsQ0FBQSxDQUFFLFdBQVcsRUFBRSxDQUFDO0FBQ2xELGNBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQVEsQ0FBQSxDQUFFLFdBQVcsRUFBRSxDQUFDOztBQUVsRCxpQkFBTyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNqQyxDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0F0SzRCLGVBQUc7QUFDOUIsYUFBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDdkM7OztTQUUwQixlQUFHO0FBQzVCLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FFZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUNwRDs7O1NBRXlCLGVBQUc7QUFDM0IsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQ2xFOzs7U0FqRGtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvdmlld3MvcHJvamVjdHMtbGlzdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIGVzbGludCBcImNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcIjogW1wiZXJyb3JcIiwge1wiZXhjZXB0TWV0aG9kc1wiOiBbXCJ2aWV3Rm9ySXRlbVwiXX1dICovXG5cbmltcG9ydCB7IFNlbGVjdExpc3RWaWV3LCAkJCB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IGVhY2ggfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IG1hbmFnZXIsIHsgTWFuYWdlciB9IGZyb20gJy4uL01hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0c0xpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgYXV0b3J1bignTG9hZGluZyBwcm9qZWN0cyBmb3IgbGlzdCB2aWV3JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgICB0aGlzLnNob3cobWFuYWdlci5wcm9qZWN0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5hZGRDbGFzcygncHJvamVjdC1tYW5hZ2VyJyk7XG5cbiAgICBsZXQgaW5mb1RleHQgPSAnc2hpZnQrY2xpY2sgb3Igc2hpZnQrZW50ZXIgd2lsbCBvcGVuIHByb2plY3QgaW4gdGhlIGN1cnJlbnQgd2luZG93JztcbiAgICBpZiAoUHJvamVjdHNMaXN0Vmlldy5yZXZlcnNlZENvbmZpcm0pIHtcbiAgICAgIGluZm9UZXh0ID0gJ3NoaWZ0K2NsaWNrIG9yIHNoaWZ0K2VudGVyIHdpbGwgb3BlbiBwcm9qZWN0IGluIGEgbmV3IHdpbmRvdyc7XG4gICAgfVxuICAgIGNvbnN0IGluZm9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5mb0VsZW1lbnQuY2xhc3NOYW1lID0gJ3RleHQtc21hbGxlcic7XG4gICAgaW5mb0VsZW1lbnQuaW5uZXJIVE1MID0gaW5mb1RleHQ7XG4gICAgdGhpcy5lcnJvci5hZnRlcihpbmZvRWxlbWVudCk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6YWx0LWNvbmZpcm0nOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5hbHRDb25maXJtZWQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldCBwb3NzaWJsZUZpbHRlcktleXMoKSB7XG4gICAgcmV0dXJuIFsndGl0bGUnLCAnZ3JvdXAnLCAndGVtcGxhdGUnXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ3RpdGxlJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgc29ydEJ5KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zb3J0QnknKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgc2hvd1BhdGgoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNob3dQYXRoJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHJldmVyc2VkQ29uZmlybSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuYWx3YXlzT3BlbkluU2FtZVdpbmRvdycpO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgaXNGaWx0ZXJLZXkgPSBQcm9qZWN0c0xpc3RWaWV3LnBvc3NpYmxlRmlsdGVyS2V5cy5pbmNsdWRlcyhpbnB1dEFyclswXSk7XG4gICAgbGV0IGZpbHRlciA9IFByb2plY3RzTGlzdFZpZXcuZGVmYXVsdEZpbHRlcktleTtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxICYmIGlzRmlsdGVyS2V5KSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RmlsdGVyUXVlcnkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBsZXQgZmlsdGVyID0gaW5wdXQ7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KSB7XG4gICAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdObyBwcm9qZWN0cyBzYXZlZCB5ZXQnO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICYmIHRoaXMucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdyhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICB9XG4gIH1cblxuICBzaG93KHByb2plY3RzKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcmVGb2N1c2VkRWxlbWVudCgpO1xuXG4gICAgY29uc3Qgc29ydGVkUHJvamVjdHMgPSBQcm9qZWN0c0xpc3RWaWV3LnNvcnRJdGVtcyhwcm9qZWN0cyk7XG5cbiAgICB0aGlzLnNldEl0ZW1zKHNvcnRlZFByb2plY3RzKTtcbiAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gIH1cblxuICBjb25maXJtZWQocHJvamVjdCkge1xuICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICBNYW5hZ2VyLm9wZW4ocHJvamVjdCwgdGhpcy5pc1NoaWZ0UHJlc3NlZCA/XG4gICAgICAgICFQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSA6IFByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFsdENvbmZpcm1lZCgpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW0oKTtcbiAgICBpZiAocHJvamVjdCkge1xuICAgICAgTWFuYWdlci5vcGVuKHByb2plY3QsICFQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgc3VwZXIuY2FuY2VsKCk7XG4gIH1cblxuICBjYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICB2aWV3Rm9ySXRlbShwcm9qZWN0KSB7XG4gICAgY29uc3QgeyB0aXRsZSwgZ3JvdXAsIGljb24sIGNvbG9yLCBkZXZNb2RlLCBwYXRocyB9ID0gcHJvamVjdC5wcm9wcztcbiAgICBjb25zdCBzaG93UGF0aCA9IFByb2plY3RzTGlzdFZpZXcuc2hvd1BhdGg7XG4gICAgY29uc3QgcHJvamVjdE1pc3NpbmcgPSAhcHJvamVjdC5zdGF0cztcblxuICAgIGNvbnN0IGJvcmRlciA9IGNvbG9yID8gYGJvcmRlci1sZWZ0OiA0cHggaW5zZXQgJHtjb2xvcn1gIDogJ2JvcmRlci1sZWZ0OiA0cHggaW5zZXQgdHJhbnNwYXJlbnQnO1xuICAgIGNvbnN0IGl0ZW1WaWV3ID0gJCQoZnVuY3Rpb24gaXRlbVZpZXcoKSB7XG4gICAgICB0aGlzLmxpKHsgY2xhc3M6ICd0d28tbGluZXMnIH0sXG4gICAgICB7ICdkYXRhLXBhdGgtbWlzc2luZyc6IHByb2plY3RNaXNzaW5nLCBzdHlsZTogYm9yZGVyIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3ByaW1hcnktbGluZScgfSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ3Byb2plY3QtbWFuYWdlci1kZXZtb2RlJyB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiBgaWNvbiAke2ljb259YCwgc3R5bGU6IGBjb2xvcjogJHtjb2xvcn1gIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAncHJvamVjdC1tYW5hZ2VyLXRpdGxlJyB9LCB0aXRsZSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXApIHtcbiAgICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItbGlzdC1ncm91cCcgfSwgZ3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3NlY29uZGFyeS1saW5lJyB9LCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHByb2plY3RNaXNzaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaWNvbiBpY29uLWFsZXJ0JyB9LCAnUGF0aCBpcyBub3QgYXZhaWxhYmxlJyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzaG93UGF0aCkge1xuICAgICAgICAgICAgZWFjaChwYXRocywgKHBhdGgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ25vLWljb24nIH0sIHBhdGgpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXRlbVZpZXcub24oJ21vdXNldXAnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5pc1NoaWZ0UHJlc3NlZCA9IGUuc2hpZnRLZXk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbVZpZXc7XG4gIH1cblxuICBzdGF0aWMgc29ydEl0ZW1zKGl0ZW1zKSB7XG4gICAgY29uc3Qga2V5ID0gUHJvamVjdHNMaXN0Vmlldy5zb3J0Qnk7XG4gICAgbGV0IHNvcnRlZCA9IGl0ZW1zO1xuXG4gICAgaWYgKGtleSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdsYXN0IG1vZGlmaWVkJykge1xuICAgICAgc29ydGVkID0gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhTW9kaWZpZWQgPSBhLmxhc3RNb2RpZmllZC5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGJNb2RpZmllZCA9IGIubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcblxuICAgICAgICByZXR1cm4gYU1vZGlmaWVkID4gYk1vZGlmaWVkID8gLTEgOiAxO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvcnRlZCA9IGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYVZhbHVlID0gKGFba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGJWYWx1ZSA9IChiW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIHJldHVybiBhVmFsdWUgPiBiVmFsdWUgPyAxIDogLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc29ydGVkO1xuICB9XG59XG4iXX0=