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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zdG9yZXMvRmlsZVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFd0QsTUFBTTs7c0JBQzdDLFFBQVE7Ozs7a0JBQ1YsSUFBSTs7OztrQkFDSixJQUFJOzs7OzhCQUNjLGlCQUFpQjs7QUFObEQsV0FBVyxDQUFDOztJQVFTLFNBQVM7Ozs7d0JBQVQsU0FBUzs7OzthQUNULGtCQUFPLEVBQUUsQ0FBQzs7Ozs7OzthQUNOLEtBQUs7Ozs7O0FBR2pCLFdBTFEsU0FBUyxHQUtkOzs7MEJBTEssU0FBUzs7Ozs7O1NBRzVCLFNBQVMsR0FBRyxFQUFFOztBQUdaLG9CQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDekMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFLLFdBQVcsRUFBRSxDQUFDO09BQ3BCLE1BQU07QUFDTCxjQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGNBQUssV0FBVyxFQUFFLENBQUM7T0FDcEI7S0FDRixDQUFDLENBQUM7R0FDSjs7d0JBZGtCLFNBQVM7OztXQTZCZixpQkFBRzs7O0FBQ2QsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsMEJBQUssUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDaEQsK0JBQVksWUFBTTtBQUNoQixjQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsY0FBSSxHQUFHLEVBQUU7QUFDUCxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUM1QjtBQUNELGNBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtBQUN6QixtQkFBTyxHQUFHLElBQUksQ0FBQztXQUNoQjs7QUFFRCxpQkFBSyxJQUFJ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Q0FBQyxJQUFJO0FBQ2QsYUFBSyxhQUFhO0FBQUU7QUFDbEIsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGtIQUFrSCxFQUFFO0FBQzlJLG9CQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU87QUFDbkIseUJBQVcsYUFBVyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsY0FBUyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQUFBRTtBQUNqRix5QkFBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gsa0JBQU07V0FDUDs7QUFBQSxBQUVEO0FBQVM7O1dBRVI7QUFBQSxPQUNGO0tBQ0Y7OztXQUVlLG1CQUFDLFFBQVEsRUFBRTtBQUN6QixVQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQUU7QUFDekMsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQixlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQTNHa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3N0b3Jlcy9GaWxlU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uLCBhc0ZsYXQsIHRyYW5zYWN0aW9uIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgeyBkZWVwRXh0ZW5kLCBlYWNoIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVN0b3JlIHtcbiAgQG9ic2VydmFibGUgZGF0YSA9IGFzRmxhdChbXSk7XG4gIEBvYnNlcnZhYmxlIGZldGNoaW5nID0gZmFsc2U7XG4gIHRlbXBsYXRlcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGZzLmV4aXN0cyhGaWxlU3RvcmUuZ2V0UGF0aCgpLCAoZXhpc3RzKSA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZUZpbGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcmUoW10pO1xuICAgICAgICB0aGlzLm9ic2VydmVGaWxlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0UGF0aCgpIHtcbiAgICBjb25zdCBmaWxlZGlyID0gYXRvbS5nZXRDb25maWdEaXJQYXRoKCk7XG4gICAgY29uc3QgZW52U2V0dGluZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5lbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMnKTtcbiAgICBsZXQgZmlsZW5hbWUgPSAncHJvamVjdHMuY3Nvbic7XG5cbiAgICBpZiAoZW52U2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IGhvc3RuYW1lID0gb3MuaG9zdG5hbWUoKS5zcGxpdCgnLicpLnNoaWZ0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbGVuYW1lID0gYHByb2plY3RzLiR7aG9zdG5hbWV9LmNzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtmaWxlZGlyfS8ke2ZpbGVuYW1lfWA7XG4gIH1cblxuICBAYWN0aW9uIGZldGNoKCkge1xuICAgIHRoaXMuZmV0Y2hpbmcgPSB0cnVlO1xuICAgIENTT04ucmVhZEZpbGUoRmlsZVN0b3JlLmdldFBhdGgoKSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgdHJhbnNhY3Rpb24oKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgRmlsZVN0b3JlLmhhbmRsZUVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdHMgPSBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYXRhLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gW107XG5cbiAgICAgICAgLy8gU3VwcG9ydCBmb3Igb2xkIHN0cnVjdHVyZS5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0cykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IE9iamVjdC5rZXlzKHJlc3VsdHMpLm1hcChrID0+IHJlc3VsdHNba10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYW4gYXJyYXkuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdHMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVhY2gocmVzdWx0cywgKHJlcykgPT4ge1xuICAgICAgICAgIGxldCByZXN1bHQgPSByZXM7XG4gICAgICAgICAgY29uc3QgdGVtcGxhdGVOYW1lID0gcmVzdWx0LnRlbXBsYXRlIHx8IG51bGw7XG5cbiAgICAgICAgICBpZiAodGVtcGxhdGVOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHJlc3VsdHMuZmlsdGVyKHByb3BzID0+IHByb3BzLnRpdGxlID09PSB0ZW1wbGF0ZU5hbWUpO1xuXG4gICAgICAgICAgICBpZiAodGVtcGxhdGUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGRlZXBFeHRlbmQoe30sIHRlbXBsYXRlWzBdLCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChGaWxlU3RvcmUuaXNQcm9qZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5zb3VyY2UgPSAnZmlsZSc7XG5cbiAgICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZmV0Y2hpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZUVycm9yKGVycikge1xuICAgIHN3aXRjaCAoZXJyLm5hbWUpIHtcbiAgICAgIGNhc2UgJ1N5bnRheEVycm9yJzoge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1RoZXJlIGlzIGEgc3ludGF4IGVycm9yIGluIHlvdXIgcHJvamVjdHMgZmlsZS4gUnVuICoqUHJvamVjdCBNYW5hZ2VyOiBFZGl0IFByb2plY3RzKiogdG8gb3BlbiBhbmQgZml4IHRoZSBpc3N1ZS4nLCB7XG4gICAgICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYExpbmU6ICR7ZXJyLmxvY2F0aW9uLmZpcnN0X2xpbmV9IFJvdzogJHtlcnIubG9jYXRpb24uZmlyc3RfY29sdW1ufWAsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICAvLyBObyBkZWZhdWx0LlxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc1Byb2plY3Qoc2V0dGluZ3MpIHtcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzLnBhdGhzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzZXR0aW5ncy5wYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0b3JlKHByb2plY3RzKSB7XG4gICAgY29uc3Qgc3RvcmUgPSBwcm9qZWN0cy5jb25jYXQodGhpcy50ZW1wbGF0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBDU09OLndyaXRlRmlsZVN5bmMoRmlsZVN0b3JlLmdldFBhdGgoKSwgc3RvcmUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgfVxuXG4gIG9ic2VydmVGaWxlKCkge1xuICAgIGlmICh0aGlzLmZpbGVXYXRjaGVyKSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXIgPSBmcy53YXRjaChGaWxlU3RvcmUuZ2V0UGF0aCgpLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZmV0Y2goKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG59XG4iXX0=