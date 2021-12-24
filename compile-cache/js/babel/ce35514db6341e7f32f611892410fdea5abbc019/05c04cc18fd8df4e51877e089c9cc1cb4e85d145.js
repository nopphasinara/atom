Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

'use babel';

var FileStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(FileStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }, {
    key: 'fetching',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return false;
    },
    enumerable: true
  }], null, _instanceInitializers);

  function FileStore() {
    var _this = this;

    _classCallCheck(this, FileStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'fetching', _instanceInitializers);

    this.templates = [];

    _fs2['default'].exists(FileStore.getPath(), function (exists) {
      if (exists) {
        _this.observeFile();
      } else {
        _this.store([]);
        _this.observeFile();
      }
    });
  }

  _createDecoratedClass(FileStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this2 = this;

      this.fetching = true;
      _season2['default'].readFile(FileStore.getPath(), function (err, data) {
        (0, _mobx.transaction)(function () {
          var results = [];
          if (err) {
            FileStore.handleError(err);
          }
          if (!err && data !== null) {
            results = data;
          }

          _this2.data.clear();
          _this2.templates = [];

          // Support for old structure.
          if (Array.isArray(results) === false) {
            results = Object.keys(results).map(function (k) {
              return results[k];
            });
          }

          // Make sure we have an array.
          if (Array.isArray(results) === false) {
            results = [];
          }

          (0, _underscorePlus.each)(results, function (res) {
            var result = res;
            var templateName = result.template || null;

            if (templateName) {
              var template = results.filter(function (props) {
                return props.title === templateName;
              });

              if (template.length) {
                result = (0, _underscorePlus.deepExtend)({}, template[0], result);
              }
            }

            if (FileStore.isProject(result)) {
              result.source = 'file';

              _this2.data.push(result);
            } else {
              _this2.templates.push(result);
            }
          }, _this2);

          _this2.fetching = false;
        });
      });
    }
  }, {
    key: 'store',
    value: function store(projects) {
      var store = projects.concat(this.templates);
      try {
        _season2['default'].writeFileSync(FileStore.getPath(), store);
      } catch (e) {
        // console.log(e);
      }
    }
  }, {
    key: 'observeFile',
    value: function observeFile() {
      var _this3 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(FileStore.getPath(), function () {
          _this3.fetch();
        });
      } catch (error) {
        // console.log(error);
      }
    }
  }], [{
    key: 'getPath',
    value: function getPath() {
      var filedir = atom.getConfigDirPath();
      var envSettings = atom.config.get('project-manager.environmentSpecificProjects');
      var filename = 'projects.cson';

      if (envSettings) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }, {
    key: 'handleError',
    value: function handleError(err) {
      switch (err.name) {
        case 'SyntaxError':
          {
            atom.notifications.addError('There is a syntax error in your projects file. Run **Project Manager: Edit Projects** to open and fix the issue.', {
              detail: err.message,
              description: 'Line: ' + err.location.first_line + ' Row: ' + err.location.first_column,
              dismissable: true
            });
            break;
          }

        default:
          {
            // No default.
          }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(settings) {
      if (typeof settings.paths === 'undefined') {
        return false;
      }

      if (settings.paths.length === 0) {
        return false;
      }

      return true;
    }
  }], _instanceInitializers);

  return FileStore;
})();

exports['default'] = FileStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3N0b3Jlcy9GaWxlU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUV3RCxNQUFNOztzQkFDN0MsUUFBUTs7OztrQkFDVixJQUFJOzs7O2tCQUNKLElBQUk7Ozs7OEJBQ2MsaUJBQWlCOztBQU5sRCxXQUFXLENBQUM7O0lBUVMsU0FBUzs7Ozt3QkFBVCxTQUFTOzs7O2FBQ1Qsa0JBQU8sRUFBRSxDQUFDOzs7Ozs7O2FBQ04sS0FBSzs7Ozs7QUFHakIsV0FMUSxTQUFTLEdBS2Q7OzswQkFMSyxTQUFTOzs7Ozs7U0FHNUIsU0FBUyxHQUFHLEVBQUU7O0FBR1osb0JBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFDLE1BQU0sRUFBSztBQUN6QyxVQUFJLE1BQU0sRUFBRTtBQUNWLGNBQUssV0FBVyxFQUFFLENBQUM7T0FDcEIsTUFBTTtBQUNMLGNBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2YsY0FBSyxXQUFXLEVBQUUsQ0FBQztPQUNwQjtLQUNGLENBQUMsQ0FBQztHQUNKOzt3QkFka0IsU0FBUzs7O1dBNkJmLGlCQUFHOzs7QUFDZCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQiwwQkFBSyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBSztBQUNoRCwrQkFBWSxZQUFNO0FBQ2hCLGNBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixjQUFJLEdBQUcsRUFBRTtBQUNQLHFCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQzVCO0FBQ0QsY0FBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ3pCLG1CQUFPLEdBQUcsSUFBSSxDQUFDO1dBQ2hCOztBQUVELGlCQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNsQixpQkFBSyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsY0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUNwQyxtQkFBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztxQkFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1dBQ3JEOzs7QUFHRCxjQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxFQUFFO0FBQ3BDLG1CQUFPLEdBQUcsRUFBRSxDQUFDO1dBQ2Q7O0FBRUQsb0NBQUssT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ3JCLGdCQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDakIsZ0JBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDOztBQUU3QyxnQkFBSSxZQUFZLEVBQUU7QUFDaEIsa0JBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLO3VCQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssWUFBWTtlQUFBLENBQUMsQ0FBQzs7QUFFdkUsa0JBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNuQixzQkFBTSxHQUFHLGdDQUFXLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7ZUFDOUM7YUFDRjs7QUFFRCxnQkFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQy9CLG9CQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFdkIscUJBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4QixNQUFNO0FBQ0wscUJBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM3QjtXQUNGLFNBQU8sQ0FBQzs7QUFFVCxpQkFBSyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0ErQkksZUFBQyxRQUFRLEVBQUU7QUFDZCxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QyxVQUFJO0FBQ0YsNEJBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNoRCxDQUFDLE9BQU8sQ0FBQyxFQUFFOztPQUVYO0tBQ0Y7OztXQUVVLHVCQUFHOzs7QUFDWixVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUMxQjs7QUFFRCxVQUFJO0FBQ0YsWUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLFlBQU07QUFDckQsaUJBQUssS0FBSyxFQUFFLENBQUM7U0FDZCxDQUFDLENBQUM7T0FDSixDQUFDLE9BQU8sS0FBSyxFQUFFOztPQUVmO0tBQ0Y7OztXQWxIYSxtQkFBRztBQUNmLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3hDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDbkYsVUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDOztBQUUvQixVQUFJLFdBQVcsRUFBRTtBQUNmLFlBQU0sUUFBUSxHQUFHLGdCQUFHLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNoRSxnQkFBUSxpQkFBZSxRQUFRLFVBQU8sQ0FBQztPQUN4Qzs7QUFFRCxhQUFVLE9BQU8sU0FBSSxRQUFRLENBQUc7S0FDakM7OztXQXFEaUIscUJBQUMsR0FBRyxFQUFFO0FBQ3RCLGNBQVEsR0FBRyxDQUFDLElBQUk7QUFDZCxhQUFLLGFBQWE7QUFBRTtBQUNsQixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsa0hBQWtILEVBQUU7QUFDOUksb0JBQU0sRUFBRSxHQUFHLENBQUMsT0FBTztBQUNuQix5QkFBVyxhQUFXLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxjQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxBQUFFO0FBQ2pGLHlCQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7QUFDSCxrQkFBTTtXQUNQOztBQUFBLEFBRUQ7QUFBUzs7V0FFUjtBQUFBLE9BQ0Y7S0FDRjs7O1dBRWUsbUJBQUMsUUFBUSxFQUFFO0FBQ3pCLFVBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtBQUN6QyxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELFVBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBM0drQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zdG9yZXMvRmlsZVN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGFjdGlvbiwgYXNGbGF0LCB0cmFuc2FjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IENTT04gZnJvbSAnc2Vhc29uJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHsgZGVlcEV4dGVuZCwgZWFjaCB9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVTdG9yZSB7XG4gIEBvYnNlcnZhYmxlIGRhdGEgPSBhc0ZsYXQoW10pO1xuICBAb2JzZXJ2YWJsZSBmZXRjaGluZyA9IGZhbHNlO1xuICB0ZW1wbGF0ZXMgPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBmcy5leGlzdHMoRmlsZVN0b3JlLmdldFBhdGgoKSwgKGV4aXN0cykgPT4ge1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICB0aGlzLm9ic2VydmVGaWxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3JlKFtdKTtcbiAgICAgICAgdGhpcy5vYnNlcnZlRmlsZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldFBhdGgoKSB7XG4gICAgY29uc3QgZmlsZWRpciA9IGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpO1xuICAgIGNvbnN0IGVudlNldHRpbmdzID0gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuZW52aXJvbm1lbnRTcGVjaWZpY1Byb2plY3RzJyk7XG4gICAgbGV0IGZpbGVuYW1lID0gJ3Byb2plY3RzLmNzb24nO1xuXG4gICAgaWYgKGVudlNldHRpbmdzKSB7XG4gICAgICBjb25zdCBob3N0bmFtZSA9IG9zLmhvc3RuYW1lKCkuc3BsaXQoJy4nKS5zaGlmdCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWxlbmFtZSA9IGBwcm9qZWN0cy4ke2hvc3RuYW1lfS5jc29uYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7ZmlsZWRpcn0vJHtmaWxlbmFtZX1gO1xuICB9XG5cbiAgQGFjdGlvbiBmZXRjaCgpIHtcbiAgICB0aGlzLmZldGNoaW5nID0gdHJ1ZTtcbiAgICBDU09OLnJlYWRGaWxlKEZpbGVTdG9yZS5nZXRQYXRoKCksIChlcnIsIGRhdGEpID0+IHtcbiAgICAgIHRyYW5zYWN0aW9uKCgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIEZpbGVTdG9yZS5oYW5kbGVFcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZXJyICYmIGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xuXG4gICAgICAgIC8vIFN1cHBvcnQgZm9yIG9sZCBzdHJ1Y3R1cmUuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdHMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJlc3VsdHMgPSBPYmplY3Qua2V5cyhyZXN1bHRzKS5tYXAoayA9PiByZXN1bHRzW2tdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGFycmF5LlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHRzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBlYWNoKHJlc3VsdHMsIChyZXMpID0+IHtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gcmVzO1xuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlTmFtZSA9IHJlc3VsdC50ZW1wbGF0ZSB8fCBudWxsO1xuXG4gICAgICAgICAgaWYgKHRlbXBsYXRlTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSByZXN1bHRzLmZpbHRlcihwcm9wcyA9PiBwcm9wcy50aXRsZSA9PT0gdGVtcGxhdGVOYW1lKTtcblxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXN1bHQgPSBkZWVwRXh0ZW5kKHt9LCB0ZW1wbGF0ZVswXSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoRmlsZVN0b3JlLmlzUHJvamVjdChyZXN1bHQpKSB7XG4gICAgICAgICAgICByZXN1bHQuc291cmNlID0gJ2ZpbGUnO1xuXG4gICAgICAgICAgICB0aGlzLmRhdGEucHVzaChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLmZldGNoaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVFcnJvcihlcnIpIHtcbiAgICBzd2l0Y2ggKGVyci5uYW1lKSB7XG4gICAgICBjYXNlICdTeW50YXhFcnJvcic6IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdUaGVyZSBpcyBhIHN5bnRheCBlcnJvciBpbiB5b3VyIHByb2plY3RzIGZpbGUuIFJ1biAqKlByb2plY3QgTWFuYWdlcjogRWRpdCBQcm9qZWN0cyoqIHRvIG9wZW4gYW5kIGZpeCB0aGUgaXNzdWUuJywge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGBMaW5lOiAke2Vyci5sb2NhdGlvbi5maXJzdF9saW5lfSBSb3c6ICR7ZXJyLmxvY2F0aW9uLmZpcnN0X2NvbHVtbn1gLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgLy8gTm8gZGVmYXVsdC5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaXNQcm9qZWN0KHNldHRpbmdzKSB7XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5wYXRocyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2V0dGluZ3MucGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdG9yZShwcm9qZWN0cykge1xuICAgIGNvbnN0IHN0b3JlID0gcHJvamVjdHMuY29uY2F0KHRoaXMudGVtcGxhdGVzKTtcbiAgICB0cnkge1xuICAgICAgQ1NPTi53cml0ZUZpbGVTeW5jKEZpbGVTdG9yZS5nZXRQYXRoKCksIHN0b3JlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gIH1cblxuICBvYnNlcnZlRmlsZSgpIHtcbiAgICBpZiAodGhpcy5maWxlV2F0Y2hlcikge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlci5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyID0gZnMud2F0Y2goRmlsZVN0b3JlLmdldFBhdGgoKSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuIl19