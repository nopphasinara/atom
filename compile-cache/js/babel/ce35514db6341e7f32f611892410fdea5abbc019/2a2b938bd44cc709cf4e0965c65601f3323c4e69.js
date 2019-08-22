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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9tb2RlbHMvUHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFcUUsTUFBTTs7a0JBQzVELElBQUk7Ozs7eUJBQ0csV0FBVzs7OztzQkFDaEIsUUFBUTs7OztBQUx6QixXQUFXLENBQUM7O0lBT1MsT0FBTzs7Ozt3QkFBUCxPQUFPOzs7O2FBQ04sRUFBRTs7Ozs7OzthQUNGLElBQUk7Ozs7OztTQUVMLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztLQUN6Qjs7OztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtlQUFJLDRCQUFVLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQztLQUN0RDs7OztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDekI7Ozs7U0FFcUIsZUFBRztBQUN2QixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7Ozs7U0FFcUIsZUFBRztBQUN2QixhQUFPLGdCQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEM7Ozs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0tBQzFCOzs7O1NBRXlCLGVBQUc7QUFDM0IsVUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsYUFBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO09BQzFCOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7U0FFc0IsZUFBRztBQUN4QixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QyxVQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2hDLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBRXNCLGVBQUc7QUFDeEIsYUFBTztBQUNMLGFBQUssRUFBRSxFQUFFO0FBQ1QsYUFBSyxFQUFFLEVBQUU7QUFDVCxhQUFLLEVBQUUsRUFBRTtBQUNULFlBQUksRUFBRSxvQkFBb0I7QUFDMUIsYUFBSyxFQUFFLEVBQUU7QUFDVCxnQkFBUSxFQUFFLEVBQUU7QUFDWixlQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFRLEVBQUUsSUFBSTtBQUNkLGNBQU0sRUFBRSxJQUFJO09BQ2IsQ0FBQztLQUNIOzs7QUFFVSxXQTdEUSxPQUFPLENBNkRkLEtBQUssRUFBRTswQkE3REEsT0FBTzs7Ozs7O0FBOER4QixnQ0FBaUIsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6Qjs7d0JBaEVrQixPQUFPOztXQWtFZixxQkFBQyxLQUFLLEVBQUU7QUFDakIsa0NBQWlCLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JCOzs7V0FFTyxvQkFBRztBQUNULGFBQU8sZ0JBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pCOzs7V0FFYywyQkFBRztzQkFDSyxJQUFJLENBQUMsUUFBUSxFQUFFOztVQUF6QixLQUFLOztBQUNoQixVQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDOztBQUV0QyxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNyQyxnQkFBUSxHQUFHO0FBQ1QsZUFBSyxVQUFVO0FBQUU7QUFDZixrQkFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEMsdUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQ25CO0FBQ0Qsb0JBQU07YUFDUDs7QUFBQSxBQUVEO0FBQVM7QUFDUCxrQkFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLHVCQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztlQUNuQjthQUNGO0FBQUEsU0FDRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7O1dBRW1CLHdCQUFHOzs7QUFDckIsc0JBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ3JDLFlBQUksQ0FBQyxHQUFHLEVBQUU7QUFDUixnQkFBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3BCO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7OztXQU15Qiw4QkFBRzs7O0FBQzNCLFVBQU0sSUFBSSxHQUFNLElBQUksQ0FBQyxRQUFRLGtCQUFlLENBQUM7QUFDN0MsMEJBQUssUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUs7QUFDckMsWUFBSSxHQUFHLEVBQUU7QUFDUCxpQkFBTztTQUNSOztBQUVELG9DQUFpQixPQUFLLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDakQsQ0FBQyxDQUFDO0tBQ0o7OztTQXhIa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL21vZGVscy9Qcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGNvbXB1dGVkLCBleHRlbmRPYnNlcnZhYmxlLCBhY3Rpb24sIHRvSlMgfSBmcm9tICdtb2J4JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgdW50aWxkaWZ5IGZyb20gJ3VudGlsZGlmeSc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IHtcbiAgQG9ic2VydmFibGUgcHJvcHMgPSB7fVxuICBAb2JzZXJ2YWJsZSBzdGF0cyA9IG51bGw7XG5cbiAgQGNvbXB1dGVkIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50aXRsZTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgcGF0aHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aHMubWFwKHBhdGggPT4gdW50aWxkaWZ5KHBhdGgpKTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgZ3JvdXAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZ3JvdXA7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IHJvb3RQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGhzWzBdO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzLnByb3BzLnNldHRpbmdzKTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgc291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnNvdXJjZTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgbGFzdE1vZGlmaWVkKCkge1xuICAgIGxldCBtdGltZSA9IG5ldyBEYXRlKDApO1xuICAgIGlmICh0aGlzLnN0YXRzKSB7XG4gICAgICBtdGltZSA9IHRoaXMuc3RhdHMubXRpbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG10aW1lO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBpc0N1cnJlbnQoKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuXG4gICAgaWYgKGFjdGl2ZVBhdGggPT09IHRoaXMucm9vdFBhdGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBncm91cDogJycsXG4gICAgICBwYXRoczogW10sXG4gICAgICBpY29uOiAnaWNvbi1jaGV2cm9uLXJpZ2h0JyxcbiAgICAgIGNvbG9yOiAnJyxcbiAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgIGRldk1vZGU6IGZhbHNlLFxuICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgZXh0ZW5kT2JzZXJ2YWJsZSh0aGlzLnByb3BzLCBQcm9qZWN0LmRlZmF1bHRQcm9wcyk7XG4gICAgdGhpcy51cGRhdGVQcm9wcyhwcm9wcyk7XG4gIH1cblxuICB1cGRhdGVQcm9wcyhwcm9wcykge1xuICAgIGV4dGVuZE9ic2VydmFibGUodGhpcy5wcm9wcywgcHJvcHMpO1xuICAgIHRoaXMuc2V0RmlsZVN0YXRzKCk7XG4gIH1cblxuICBnZXRQcm9wcygpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGdldENoYW5nZWRQcm9wcygpIHtcbiAgICBjb25zdCB7IC4uLnByb3BzIH0gPSB0aGlzLmdldFByb3BzKCk7XG4gICAgY29uc3QgZGVmYXVsdHMgPSBQcm9qZWN0LmRlZmF1bHRQcm9wcztcblxuICAgIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ3NldHRpbmdzJzoge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwcm9wc1trZXldKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wc1trZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBpZiAocHJvcHNba2V5XSA9PT0gZGVmYXVsdHNba2V5XSkge1xuICAgICAgICAgICAgZGVsZXRlIHByb3BzW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBAYWN0aW9uIHNldEZpbGVTdGF0cygpIHtcbiAgICBmcy5zdGF0KHRoaXMucm9vdFBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoIWVycikge1xuICAgICAgICB0aGlzLnN0YXRzID0gc3RhdHM7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggc2V0dGluZ3MgdGhhdCBhcmUgc2F2ZWQgbG9jYWxseSB3aXRoIHRoZSBwcm9qZWN0XG4gICAqIGlmIHRoZXJlIGFyZSBhbnkuXG4gICAqL1xuICBAYWN0aW9uIGZldGNoTG9jYWxTZXR0aW5ncygpIHtcbiAgICBjb25zdCBmaWxlID0gYCR7dGhpcy5yb290UGF0aH0vcHJvamVjdC5jc29uYDtcbiAgICBDU09OLnJlYWRGaWxlKGZpbGUsIChlcnIsIHNldHRpbmdzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZXh0ZW5kT2JzZXJ2YWJsZSh0aGlzLnByb3BzLnNldHRpbmdzLCBzZXR0aW5ncyk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==