Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

'use babel';

var Project = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Project, [{
    key: 'props',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {};
    },
    enumerable: true
  }, {
    key: 'stats',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: 'title',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.title;
    }
  }, {
    key: 'paths',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.paths.map(function (path) {
        return (0, _untildify2['default'])(path);
      });
    }
  }, {
    key: 'group',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.group;
    }
  }, {
    key: 'rootPath',
    decorators: [_mobx.computed],
    get: function get() {
      return this.paths[0];
    }
  }, {
    key: 'settings',
    decorators: [_mobx.computed],
    get: function get() {
      return (0, _mobx.toJS)(this.props.settings);
    }
  }, {
    key: 'source',
    decorators: [_mobx.computed],
    get: function get() {
      return this.props.source;
    }
  }, {
    key: 'lastModified',
    decorators: [_mobx.computed],
    get: function get() {
      var mtime = new Date(0);
      if (this.stats) {
        mtime = this.stats.mtime;
      }

      return mtime;
    }
  }, {
    key: 'isCurrent',
    decorators: [_mobx.computed],
    get: function get() {
      var activePath = atom.project.getPaths()[0];

      if (activePath === this.rootPath) {
        return true;
      }

      return false;
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        group: '',
        paths: [],
        icon: 'icon-chevron-right',
        color: '',
        settings: {},
        devMode: false,
        template: null,
        source: null
      };
    }
  }], _instanceInitializers);

  function Project(props) {
    _classCallCheck(this, Project);

    _defineDecoratedPropertyDescriptor(this, 'props', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'stats', _instanceInitializers);

    (0, _mobx.extendObservable)(this.props, Project.defaultProps);
    this.updateProps(props);
  }

  _createDecoratedClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      (0, _mobx.extendObservable)(this.props, props);
      this.setFileStats();
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      return (0, _mobx.toJS)(this.props);
    }
  }, {
    key: 'getChangedProps',
    value: function getChangedProps() {
      var _getProps = this.getProps();

      var props = _objectWithoutProperties(_getProps, []);

      var defaults = Project.defaultProps;

      Object.keys(defaults).forEach(function (key) {
        switch (key) {
          case 'settings':
            {
              if (Object.keys(props[key]).length === 0) {
                delete props[key];
              }
              break;
            }

          default:
            {
              if (props[key] === defaults[key]) {
                delete props[key];
              }
            }
        }
      });

      return props;
    }
  }, {
    key: 'setFileStats',
    decorators: [_mobx.action],
    value: function setFileStats() {
      var _this = this;

      _fs2['default'].stat(this.rootPath, function (err, stats) {
        if (!err) {
          _this.stats = stats;
        }
      });
    }

    /**
     * Fetch settings that are saved locally with the project
     * if there are any.
     */
  }, {
    key: 'fetchLocalSettings',
    decorators: [_mobx.action],
    value: function fetchLocalSettings() {
      var _this2 = this;

      var file = this.rootPath + '/project.cson';
      _season2['default'].readFile(file, function (err, settings) {
        if (err) {
          return;
        }

        (0, _mobx.extendObservable)(_this2.props.settings, settings);
      });
    }
  }], null, _instanceInitializers);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL21vZGVscy9Qcm9qZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVxRSxNQUFNOztrQkFDNUQsSUFBSTs7Ozt5QkFDRyxXQUFXOzs7O3NCQUNoQixRQUFROzs7O0FBTHpCLFdBQVcsQ0FBQzs7SUFPUyxPQUFPOzs7O3dCQUFQLE9BQU87Ozs7YUFDTixFQUFFOzs7Ozs7O2FBQ0YsSUFBSTs7Ozs7O1NBRUwsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3pCOzs7O1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2VBQUksNEJBQVUsSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3REOzs7O1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztLQUN6Qjs7OztTQUVxQixlQUFHO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0Qjs7OztTQUVxQixlQUFHO0FBQ3ZCLGFBQU8sZ0JBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQzs7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FDMUI7Ozs7U0FFeUIsZUFBRztBQUMzQixVQUFJLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7T0FDMUI7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7OztTQUVzQixlQUFHO0FBQ3hCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlDLFVBQUksVUFBVSxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDaEMsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0FFc0IsZUFBRztBQUN4QixhQUFPO0FBQ0wsYUFBSyxFQUFFLEVBQUU7QUFDVCxhQUFLLEVBQUUsRUFBRTtBQUNULGFBQUssRUFBRSxFQUFFO0FBQ1QsWUFBSSxFQUFFLG9CQUFvQjtBQUMxQixhQUFLLEVBQUUsRUFBRTtBQUNULGdCQUFRLEVBQUUsRUFBRTtBQUNaLGVBQU8sRUFBRSxLQUFLO0FBQ2QsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsY0FBTSxFQUFFLElBQUk7T0FDYixDQUFDO0tBQ0g7OztBQUVVLFdBN0RRLE9BQU8sQ0E2RGQsS0FBSyxFQUFFOzBCQTdEQSxPQUFPOzs7Ozs7QUE4RHhCLGdDQUFpQixJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3pCOzt3QkFoRWtCLE9BQU87O1dBa0VmLHFCQUFDLEtBQUssRUFBRTtBQUNqQixrQ0FBaUIsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDckI7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxnQkFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7OztXQUVjLDJCQUFHO3NCQUNLLElBQUksQ0FBQyxRQUFRLEVBQUU7O1VBQXpCLEtBQUs7O0FBQ2hCLFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3JDLGdCQUFRLEdBQUc7QUFDVCxlQUFLLFVBQVU7QUFBRTtBQUNmLGtCQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN4Qyx1QkFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFDbkI7QUFDRCxvQkFBTTthQUNQOztBQUFBLEFBRUQ7QUFBUztBQUNQLGtCQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEMsdUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQ25CO2FBQ0Y7QUFBQSxTQUNGO09BQ0YsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7V0FFbUIsd0JBQUc7OztBQUNyQixzQkFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDckMsWUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGdCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDcEI7T0FDRixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7O1dBTXlCLDhCQUFHOzs7QUFDM0IsVUFBTSxJQUFJLEdBQU0sSUFBSSxDQUFDLFFBQVEsa0JBQWUsQ0FBQztBQUM3QywwQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBSztBQUNyQyxZQUFJLEdBQUcsRUFBRTtBQUNQLGlCQUFPO1NBQ1I7O0FBRUQsb0NBQWlCLE9BQUssS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUNqRCxDQUFDLENBQUM7S0FDSjs7O1NBeEhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9tb2RlbHMvUHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBjb21wdXRlZCwgZXh0ZW5kT2JzZXJ2YWJsZSwgYWN0aW9uLCB0b0pTIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknO1xuaW1wb3J0IENTT04gZnJvbSAnc2Vhc29uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdCB7XG4gIEBvYnNlcnZhYmxlIHByb3BzID0ge31cbiAgQG9ic2VydmFibGUgc3RhdHMgPSBudWxsO1xuXG4gIEBjb21wdXRlZCBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGl0bGU7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IHBhdGhzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhdGhzLm1hcChwYXRoID0+IHVudGlsZGlmeShwYXRoKSk7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGdyb3VwKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmdyb3VwO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCByb290UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoc1swXTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgc2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRvSlModGhpcy5wcm9wcy5zZXR0aW5ncyk7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IHNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zb3VyY2U7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGxhc3RNb2RpZmllZCgpIHtcbiAgICBsZXQgbXRpbWUgPSBuZXcgRGF0ZSgwKTtcbiAgICBpZiAodGhpcy5zdGF0cykge1xuICAgICAgbXRpbWUgPSB0aGlzLnN0YXRzLm10aW1lO1xuICAgIH1cblxuICAgIHJldHVybiBtdGltZTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgaXNDdXJyZW50KCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcblxuICAgIGlmIChhY3RpdmVQYXRoID09PSB0aGlzLnJvb3RQYXRoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICcnLFxuICAgICAgZ3JvdXA6ICcnLFxuICAgICAgcGF0aHM6IFtdLFxuICAgICAgaWNvbjogJ2ljb24tY2hldnJvbi1yaWdodCcsXG4gICAgICBjb2xvcjogJycsXG4gICAgICBzZXR0aW5nczoge30sXG4gICAgICBkZXZNb2RlOiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgc291cmNlOiBudWxsLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIGV4dGVuZE9ic2VydmFibGUodGhpcy5wcm9wcywgUHJvamVjdC5kZWZhdWx0UHJvcHMpO1xuICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICB9XG5cbiAgdXBkYXRlUHJvcHMocHJvcHMpIHtcbiAgICBleHRlbmRPYnNlcnZhYmxlKHRoaXMucHJvcHMsIHByb3BzKTtcbiAgICB0aGlzLnNldEZpbGVTdGF0cygpO1xuICB9XG5cbiAgZ2V0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHRvSlModGhpcy5wcm9wcyk7XG4gIH1cblxuICBnZXRDaGFuZ2VkUHJvcHMoKSB7XG4gICAgY29uc3QgeyAuLi5wcm9wcyB9ID0gdGhpcy5nZXRQcm9wcygpO1xuICAgIGNvbnN0IGRlZmF1bHRzID0gUHJvamVjdC5kZWZhdWx0UHJvcHM7XG5cbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocHJvcHNba2V5XSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkZWxldGUgcHJvcHNba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgaWYgKHByb3BzW2tleV0gPT09IGRlZmF1bHRzW2tleV0pIHtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRGaWxlU3RhdHMoKSB7XG4gICAgZnMuc3RhdCh0aGlzLnJvb3RQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgdGhpcy5zdGF0cyA9IHN0YXRzO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHNldHRpbmdzIHRoYXQgYXJlIHNhdmVkIGxvY2FsbHkgd2l0aCB0aGUgcHJvamVjdFxuICAgKiBpZiB0aGVyZSBhcmUgYW55LlxuICAgKi9cbiAgQGFjdGlvbiBmZXRjaExvY2FsU2V0dGluZ3MoKSB7XG4gICAgY29uc3QgZmlsZSA9IGAke3RoaXMucm9vdFBhdGh9L3Byb2plY3QuY3NvbmA7XG4gICAgQ1NPTi5yZWFkRmlsZShmaWxlLCAoZXJyLCBzZXR0aW5ncykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV4dGVuZE9ic2VydmFibGUodGhpcy5wcm9wcy5zZXR0aW5ncywgc2V0dGluZ3MpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=