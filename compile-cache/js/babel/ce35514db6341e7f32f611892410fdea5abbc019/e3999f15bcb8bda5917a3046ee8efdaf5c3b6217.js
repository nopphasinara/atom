Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

var _tildify = require('tildify');

var _tildify2 = _interopRequireDefault(_tildify);

var _atomProjectUtil = require('atom-project-util');

var _atomProjectUtil2 = _interopRequireDefault(_atomProjectUtil);

var _underscorePlus = require('underscore-plus');

var _storesFileStore = require('./stores/FileStore');

var _storesFileStore2 = _interopRequireDefault(_storesFileStore);

var _storesGitStore = require('./stores/GitStore');

var _storesGitStore2 = _interopRequireDefault(_storesGitStore);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

var _modelsProject = require('./models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

'use babel';

var Manager = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Manager, [{
    key: 'projects',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activePaths',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activeProject',
    decorators: [_mobx.computed],
    get: function get() {
      var _this = this;

      if (this.activePaths.length === 0) {
        return null;
      }

      return this.projects.find(function (project) {
        return project.rootPath === _this.activePaths[0];
      });
    }
  }], null, _instanceInitializers);

  function Manager() {
    var _this2 = this;

    _classCallCheck(this, Manager);

    _defineDecoratedPropertyDescriptor(this, 'projects', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'activePaths', _instanceInitializers);

    this.gitStore = new _storesGitStore2['default']();
    this.fileStore = new _storesFileStore2['default']();
    this.settings = new _Settings2['default']();

    this.fetchProjects();

    atom.config.onDidChange('project-manager.includeGitRepositories', function (_ref) {
      var newValue = _ref.newValue;

      if (newValue) {
        _this2.gitStore.fetch();
      } else {
        _this2.gitStore.empty();
      }
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.fileStore.data, function (fileProp) {
        _this2.addProject(fileProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.gitStore.data, function (gitProp) {
        _this2.addProject(gitProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      if (_this2.activeProject) {
        _this2.settings.load(_this2.activeProject.settings);
      }
    });

    this.activePaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      _this2.activePaths = atom.project.getPaths();
      var activePaths = atom.project.getPaths();

      if (_this2.activeProject && _this2.activeProject.rootPath === activePaths[0]) {
        if (_this2.activeProject.paths.length !== activePaths.length) {
          _this2.activeProject.updateProps({ paths: activePaths });
          _this2.saveProjects();
        }
      }
    });
  }

  /**
   * Create or Update a project.
   *
   * Props coming from file goes before any other source.
   */

  _createDecoratedClass(Manager, [{
    key: 'addProject',
    decorators: [_mobx.action],
    value: function addProject(props) {
      var foundProject = this.projects.find(function (project) {
        var projectRootPath = project.rootPath.toLowerCase();
        var propsRootPath = (0, _untildify2['default'])(props.paths[0]).toLowerCase();
        return projectRootPath === propsRootPath;
      });

      if (!foundProject) {
        var newProject = new _modelsProject2['default'](props);
        this.projects.push(newProject);
      } else {
        if (foundProject.source === 'file' && props.source === 'file') {
          foundProject.updateProps(props);
        }

        if (props.source === 'file' || typeof props.source === 'undefined') {
          foundProject.updateProps(props);
        }
      }
    }
  }, {
    key: 'fetchProjects',
    value: function fetchProjects() {
      this.fileStore.fetch();

      if (atom.config.get('project-manager.includeGitRepositories')) {
        this.gitStore.fetch();
      }
    }
  }, {
    key: 'saveProject',
    value: function saveProject(props) {
      var propsToSave = props;
      if (Manager.isProject(props)) {
        propsToSave = props.getProps();
      }
      this.addProject(_extends({}, propsToSave, { source: 'file' }));
      this.saveProjects();
    }
  }, {
    key: 'saveProjects',
    value: function saveProjects() {
      var projects = this.projects.filter(function (project) {
        return project.props.source === 'file';
      });

      var arr = (0, _underscorePlus.map)(projects, function (project) {
        var props = project.getChangedProps();
        delete props.source;

        if (atom.config.get('project-manager.savePathsRelativeToHome')) {
          props.paths = props.paths.map(function (path) {
            return (0, _tildify2['default'])(path);
          });
        }

        return props;
      });

      this.fileStore.store(arr);
    }
  }], [{
    key: 'open',
    value: function open(project) {
      var openInSameWindow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (Manager.isProject(project)) {
        var _project$getProps = project.getProps();

        var devMode = _project$getProps.devMode;

        if (openInSameWindow) {
          _atomProjectUtil2['default']['switch'](project.paths);
        } else {
          atom.open({
            devMode: devMode,
            pathsToOpen: project.paths
          });
        }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(project) {
      if (project instanceof _modelsProject2['default']) {
        return true;
      }

      return false;
    }
  }], _instanceInitializers);

  return Manager;
})();

exports.Manager = Manager;

var manager = new Manager();
exports['default'] = manager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL01hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRXNELE1BQU07O3lCQUN0QyxXQUFXOzs7O3VCQUNiLFNBQVM7Ozs7K0JBQ0wsbUJBQW1COzs7OzhCQUNqQixpQkFBaUI7OytCQUNyQixvQkFBb0I7Ozs7OEJBQ3JCLG1CQUFtQjs7Ozt3QkFDbkIsWUFBWTs7Ozs2QkFDYixrQkFBa0I7Ozs7QUFWdEMsV0FBVyxDQUFDOztJQVlDLE9BQU87Ozs7d0JBQVAsT0FBTzs7OzthQUNLLEVBQUU7Ozs7Ozs7YUFDQyxFQUFFOzs7Ozs7U0FFRCxlQUFHOzs7QUFDNUIsVUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDakMsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztlQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssTUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ2hGOzs7QUFFVSxXQVpBLE9BQU8sR0FZSjs7OzBCQVpILE9BQU87Ozs7OztBQWFoQixRQUFJLENBQUMsUUFBUSxHQUFHLGlDQUFjLENBQUM7QUFDL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxrQ0FBZSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx3Q0FBd0MsRUFBRSxVQUFDLElBQVksRUFBSztVQUFmLFFBQVEsR0FBVixJQUFZLENBQVYsUUFBUTs7QUFDM0UsVUFBSSxRQUFRLEVBQUU7QUFDWixlQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUN2QixN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QUFnQixFQUFFO0FBQ3BCLGdEQUFrQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksQ0FBQztBQUNSLG1CQUFPLEVBQVAsT0FBTztBQUNQLHVCQUFXLEVBQUUsT0FBTyxDQUFDLEtBQUs7V0FDM0IsQ0FBQyxDQUFDO1NBQ0o7T0FDRjtLQUNGOzs7V0E0QmUsbUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFVBQUksT0FBTyxzQ0FBbUIsRUFBRTtBQUM5QixlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQTVJVSxPQUFPOzs7OztBQStJcEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztxQkFDZixPQUFPIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYXV0b3J1biwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSAndGlsZGlmeSc7XG5pbXBvcnQgcHJvamVjdFV0aWwgZnJvbSAnYXRvbS1wcm9qZWN0LXV0aWwnO1xuaW1wb3J0IHsgZWFjaCwgbWFwIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBGaWxlU3RvcmUgZnJvbSAnLi9zdG9yZXMvRmlsZVN0b3JlJztcbmltcG9ydCBHaXRTdG9yZSBmcm9tICcuL3N0b3Jlcy9HaXRTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL21vZGVscy9Qcm9qZWN0JztcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuICBAb2JzZXJ2YWJsZSBwcm9qZWN0cyA9IFtdO1xuICBAb2JzZXJ2YWJsZSBhY3RpdmVQYXRocyA9IFtdO1xuXG4gIEBjb21wdXRlZCBnZXQgYWN0aXZlUHJvamVjdCgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVQYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3RzLmZpbmQocHJvamVjdCA9PiBwcm9qZWN0LnJvb3RQYXRoID09PSB0aGlzLmFjdGl2ZVBhdGhzWzBdKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2l0U3RvcmUgPSBuZXcgR2l0U3RvcmUoKTtcbiAgICB0aGlzLmZpbGVTdG9yZSA9IG5ldyBGaWxlU3RvcmUoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLmZldGNoUHJvamVjdHMoKTtcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdwcm9qZWN0LW1hbmFnZXIuaW5jbHVkZUdpdFJlcG9zaXRvcmllcycsICh7IG5ld1ZhbHVlIH0pID0+IHtcbiAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmVtcHR5KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIGVhY2godGhpcy5maWxlU3RvcmUuZGF0YSwgKGZpbGVQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChmaWxlUHJvcCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9KTtcblxuICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgZWFjaCh0aGlzLmdpdFN0b3JlLmRhdGEsIChnaXRQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChnaXRQcm9wKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MubG9hZCh0aGlzLmFjdGl2ZVByb2plY3Quc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGNvbnN0IGFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QgJiYgdGhpcy5hY3RpdmVQcm9qZWN0LnJvb3RQYXRoID09PSBhY3RpdmVQYXRoc1swXSkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0LnBhdGhzLmxlbmd0aCAhPT0gYWN0aXZlUGF0aHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVQcm9qZWN0LnVwZGF0ZVByb3BzKHsgcGF0aHM6IGFjdGl2ZVBhdGhzIH0pO1xuICAgICAgICAgIHRoaXMuc2F2ZVByb2plY3RzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgVXBkYXRlIGEgcHJvamVjdC5cbiAgICpcbiAgICogUHJvcHMgY29taW5nIGZyb20gZmlsZSBnb2VzIGJlZm9yZSBhbnkgb3RoZXIgc291cmNlLlxuICAgKi9cbiAgQGFjdGlvbiBhZGRQcm9qZWN0KHByb3BzKSB7XG4gICAgY29uc3QgZm91bmRQcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKChwcm9qZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0Um9vdFBhdGggPSBwcm9qZWN0LnJvb3RQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBwcm9wc1Jvb3RQYXRoID0gdW50aWxkaWZ5KHByb3BzLnBhdGhzWzBdKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIHByb2plY3RSb290UGF0aCA9PT0gcHJvcHNSb290UGF0aDtcbiAgICB9KTtcblxuICAgIGlmICghZm91bmRQcm9qZWN0KSB7XG4gICAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QocHJvcHMpO1xuICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm91bmRQcm9qZWN0LnNvdXJjZSA9PT0gJ2ZpbGUnICYmIHByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgIGZvdW5kUHJvamVjdC51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5zb3VyY2UgPT09ICdmaWxlJyB8fCB0eXBlb2YgcHJvcHMuc291cmNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmb3VuZFByb2plY3QudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZldGNoUHJvamVjdHMoKSB7XG4gICAgdGhpcy5maWxlU3RvcmUuZmV0Y2goKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5pbmNsdWRlR2l0UmVwb3NpdG9yaWVzJykpIHtcbiAgICAgIHRoaXMuZ2l0U3RvcmUuZmV0Y2goKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgb3Blbihwcm9qZWN0LCBvcGVuSW5TYW1lV2luZG93ID0gZmFsc2UpIHtcbiAgICBpZiAoTWFuYWdlci5pc1Byb2plY3QocHJvamVjdCkpIHtcbiAgICAgIGNvbnN0IHsgZGV2TW9kZSB9ID0gcHJvamVjdC5nZXRQcm9wcygpO1xuXG4gICAgICBpZiAob3BlbkluU2FtZVdpbmRvdykge1xuICAgICAgICBwcm9qZWN0VXRpbC5zd2l0Y2gocHJvamVjdC5wYXRocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm9wZW4oe1xuICAgICAgICAgIGRldk1vZGUsXG4gICAgICAgICAgcGF0aHNUb09wZW46IHByb2plY3QucGF0aHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNhdmVQcm9qZWN0KHByb3BzKSB7XG4gICAgbGV0IHByb3BzVG9TYXZlID0gcHJvcHM7XG4gICAgaWYgKE1hbmFnZXIuaXNQcm9qZWN0KHByb3BzKSkge1xuICAgICAgcHJvcHNUb1NhdmUgPSBwcm9wcy5nZXRQcm9wcygpO1xuICAgIH1cbiAgICB0aGlzLmFkZFByb2plY3QoeyAuLi5wcm9wc1RvU2F2ZSwgc291cmNlOiAnZmlsZScgfSk7XG4gICAgdGhpcy5zYXZlUHJvamVjdHMoKTtcbiAgfVxuXG4gIHNhdmVQcm9qZWN0cygpIHtcbiAgICBjb25zdCBwcm9qZWN0cyA9IHRoaXMucHJvamVjdHMuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdC5wcm9wcy5zb3VyY2UgPT09ICdmaWxlJyk7XG5cbiAgICBjb25zdCBhcnIgPSBtYXAocHJvamVjdHMsIChwcm9qZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IHByb2plY3QuZ2V0Q2hhbmdlZFByb3BzKCk7XG4gICAgICBkZWxldGUgcHJvcHMuc291cmNlO1xuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc2F2ZVBhdGhzUmVsYXRpdmVUb0hvbWUnKSkge1xuICAgICAgICBwcm9wcy5wYXRocyA9IHByb3BzLnBhdGhzLm1hcChwYXRoID0+IHRpbGRpZnkocGF0aCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvcHM7XG4gICAgfSk7XG5cbiAgICB0aGlzLmZpbGVTdG9yZS5zdG9yZShhcnIpO1xuICB9XG5cbiAgc3RhdGljIGlzUHJvamVjdChwcm9qZWN0KSB7XG4gICAgaWYgKHByb2plY3QgaW5zdGFuY2VvZiBQcm9qZWN0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7XG5leHBvcnQgZGVmYXVsdCBtYW5hZ2VyO1xuIl19