Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _findit = require('findit');

var _findit2 = _interopRequireDefault(_findit);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

'use babel';

var GitStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(GitStore, [{
    key: 'data',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return (0, _mobx.asFlat)([]);
    },
    enumerable: true
  }], null, _instanceInitializers);

  function GitStore() {
    _classCallCheck(this, GitStore);

    _defineDecoratedPropertyDescriptor(this, 'data', _instanceInitializers);

    var ignoreDirectories = atom.config.get('project-manager.ignoreDirectories');
    this.ignore = ignoreDirectories.replace(/ /g, '').split(',');
  }

  _createDecoratedClass(GitStore, [{
    key: 'fetch',
    decorators: [_mobx.action],
    value: function fetch() {
      var _this = this;

      var projectHome = atom.config.get('core.projectHome');
      var finder = (0, _findit2['default'])((0, _untildify2['default'])(projectHome));
      this.data.clear();

      finder.on('directory', function (dir, stat, stop) {
        var base = _path2['default'].basename(dir);
        var projectPath = _path2['default'].dirname(dir);
        var projectName = _path2['default'].basename(projectPath);

        if (base === '.git') {
          _this.data.push({
            title: projectName,
            paths: [projectPath],
            source: 'git',
            icon: 'icon-repo'
          });
        }

        if (_this.ignore.includes(base)) {
          stop();
        }
      });
    }
  }, {
    key: 'empty',
    decorators: [_mobx.action],
    value: function empty() {
      this.data.clear();
    }
  }], null, _instanceInitializers);

  return GitStore;
})();

exports['default'] = GitStore;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3N0b3Jlcy9HaXRTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3NCQUM5QixRQUFROzs7O29CQUNWLE1BQU07Ozs7eUJBQ0QsV0FBVzs7OztBQUxqQyxXQUFXLENBQUM7O0lBT1MsUUFBUTs7Ozt3QkFBUixRQUFROzs7O2FBQ1Isa0JBQU8sRUFBRSxDQUFDOzs7OztBQUVsQixXQUhRLFFBQVEsR0FHYjswQkFISyxRQUFROzs7O0FBSXpCLFFBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUMvRSxRQUFJLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzlEOzt3QkFOa0IsUUFBUTs7O1dBUWQsaUJBQUc7OztBQUNkLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDeEQsVUFBTSxNQUFNLEdBQUcseUJBQU8sNEJBQVUsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVsQixZQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQzFDLFlBQU0sSUFBSSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxZQUFNLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsWUFBTSxXQUFXLEdBQUcsa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUvQyxZQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDbkIsZ0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQztBQUNiLGlCQUFLLEVBQUUsV0FBVztBQUNsQixpQkFBSyxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ3BCLGtCQUFNLEVBQUUsS0FBSztBQUNiLGdCQUFJLEVBQUUsV0FBVztXQUNsQixDQUFDLENBQUM7U0FDSjs7QUFFRCxZQUFJLE1BQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QixjQUFJLEVBQUUsQ0FBQztTQUNSO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7V0FFWSxpQkFBRztBQUNkLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDbkI7OztTQW5Da0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc3RvcmVzL0dpdFN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGFjdGlvbiwgYXNGbGF0IH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgZmluZGl0IGZyb20gJ2ZpbmRpdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1bnRpbGRpZnkgZnJvbSAndW50aWxkaWZ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0U3RvcmUge1xuICBAb2JzZXJ2YWJsZSBkYXRhID0gYXNGbGF0KFtdKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBpZ25vcmVEaXJlY3RvcmllcyA9IGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmlnbm9yZURpcmVjdG9yaWVzJyk7XG4gICAgdGhpcy5pZ25vcmUgPSBpZ25vcmVEaXJlY3Rvcmllcy5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpO1xuICB9XG5cbiAgQGFjdGlvbiBmZXRjaCgpIHtcbiAgICBjb25zdCBwcm9qZWN0SG9tZSA9IGF0b20uY29uZmlnLmdldCgnY29yZS5wcm9qZWN0SG9tZScpO1xuICAgIGNvbnN0IGZpbmRlciA9IGZpbmRpdCh1bnRpbGRpZnkocHJvamVjdEhvbWUpKTtcbiAgICB0aGlzLmRhdGEuY2xlYXIoKTtcblxuICAgIGZpbmRlci5vbignZGlyZWN0b3J5JywgKGRpciwgc3RhdCwgc3RvcCkgPT4ge1xuICAgICAgY29uc3QgYmFzZSA9IHBhdGguYmFzZW5hbWUoZGlyKTtcbiAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gcGF0aC5kaXJuYW1lKGRpcik7XG4gICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IHBhdGguYmFzZW5hbWUocHJvamVjdFBhdGgpO1xuXG4gICAgICBpZiAoYmFzZSA9PT0gJy5naXQnKSB7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKHtcbiAgICAgICAgICB0aXRsZTogcHJvamVjdE5hbWUsXG4gICAgICAgICAgcGF0aHM6IFtwcm9qZWN0UGF0aF0sXG4gICAgICAgICAgc291cmNlOiAnZ2l0JyxcbiAgICAgICAgICBpY29uOiAnaWNvbi1yZXBvJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlnbm9yZS5pbmNsdWRlcyhiYXNlKSkge1xuICAgICAgICBzdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBAYWN0aW9uIGVtcHR5KCkge1xuICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuICB9XG59XG4iXX0=