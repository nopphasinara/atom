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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zdG9yZXMvR2l0U3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUUyQyxNQUFNOztzQkFDOUIsUUFBUTs7OztvQkFDVixNQUFNOzs7O3lCQUNELFdBQVc7Ozs7QUFMakMsV0FBVyxDQUFDOztJQU9TLFFBQVE7Ozs7d0JBQVIsUUFBUTs7OzthQUNSLGtCQUFPLEVBQUUsQ0FBQzs7Ozs7QUFFbEIsV0FIUSxRQUFRLEdBR2I7MEJBSEssUUFBUTs7OztBQUl6QixRQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDL0UsUUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUM5RDs7d0JBTmtCLFFBQVE7OztXQVFkLGlCQUFHOzs7QUFDZCxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3hELFVBQU0sTUFBTSxHQUFHLHlCQUFPLDRCQUFVLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFbEIsWUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBSztBQUMxQyxZQUFNLElBQUksR0FBRyxrQkFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsWUFBTSxXQUFXLEdBQUcsa0JBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLFlBQU0sV0FBVyxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0MsWUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQ25CLGdCQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDYixpQkFBSyxFQUFFLFdBQVc7QUFDbEIsaUJBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNwQixrQkFBTSxFQUFFLEtBQUs7QUFDYixnQkFBSSxFQUFFLFdBQVc7V0FDbEIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsWUFBSSxNQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDOUIsY0FBSSxFQUFFLENBQUM7U0FDUjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7O1dBRVksaUJBQUc7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ25COzs7U0FuQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9zdG9yZXMvR2l0U3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uLCBhc0ZsYXQgfSBmcm9tICdtb2J4JztcbmltcG9ydCBmaW5kaXQgZnJvbSAnZmluZGl0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRTdG9yZSB7XG4gIEBvYnNlcnZhYmxlIGRhdGEgPSBhc0ZsYXQoW10pO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IGlnbm9yZURpcmVjdG9yaWVzID0gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuaWdub3JlRGlyZWN0b3JpZXMnKTtcbiAgICB0aGlzLmlnbm9yZSA9IGlnbm9yZURpcmVjdG9yaWVzLnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJyk7XG4gIH1cblxuICBAYWN0aW9uIGZldGNoKCkge1xuICAgIGNvbnN0IHByb2plY3RIb21lID0gYXRvbS5jb25maWcuZ2V0KCdjb3JlLnByb2plY3RIb21lJyk7XG4gICAgY29uc3QgZmluZGVyID0gZmluZGl0KHVudGlsZGlmeShwcm9qZWN0SG9tZSkpO1xuICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuXG4gICAgZmluZGVyLm9uKCdkaXJlY3RvcnknLCAoZGlyLCBzdGF0LCBzdG9wKSA9PiB7XG4gICAgICBjb25zdCBiYXNlID0gcGF0aC5iYXNlbmFtZShkaXIpO1xuICAgICAgY29uc3QgcHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUoZGlyKTtcbiAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gcGF0aC5iYXNlbmFtZShwcm9qZWN0UGF0aCk7XG5cbiAgICAgIGlmIChiYXNlID09PSAnLmdpdCcpIHtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goe1xuICAgICAgICAgIHRpdGxlOiBwcm9qZWN0TmFtZSxcbiAgICAgICAgICBwYXRoczogW3Byb2plY3RQYXRoXSxcbiAgICAgICAgICBzb3VyY2U6ICdnaXQnLFxuICAgICAgICAgIGljb246ICdpY29uLXJlcG8nLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaWdub3JlLmluY2x1ZGVzKGJhc2UpKSB7XG4gICAgICAgIHN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIEBhY3Rpb24gZW1wdHkoKSB7XG4gICAgdGhpcy5kYXRhLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==