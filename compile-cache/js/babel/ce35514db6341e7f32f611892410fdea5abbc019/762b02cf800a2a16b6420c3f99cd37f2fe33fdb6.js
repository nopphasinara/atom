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
            pathsToOpen: project.paths,
            newWindow: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9NYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVzRCxNQUFNOzt5QkFDdEMsV0FBVzs7Ozt1QkFDYixTQUFTOzs7OytCQUNMLG1CQUFtQjs7Ozs4QkFDakIsaUJBQWlCOzsrQkFDckIsb0JBQW9COzs7OzhCQUNyQixtQkFBbUI7Ozs7d0JBQ25CLFlBQVk7Ozs7NkJBQ2Isa0JBQWtCOzs7O0FBVnRDLFdBQVcsQ0FBQzs7SUFZQyxPQUFPOzs7O3dCQUFQLE9BQU87Ozs7YUFDSyxFQUFFOzs7Ozs7O2FBQ0MsRUFBRTs7Ozs7O1NBRUQsZUFBRzs7O0FBQzVCLFVBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE1BQUssV0FBVyxDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNoRjs7O0FBRVUsV0FaQSxPQUFPLEdBWUo7OzswQkFaSCxPQUFPOzs7Ozs7QUFhaEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxpQ0FBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsa0NBQWUsQ0FBQztBQUNqQyxRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7O0FBRS9CLFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsd0NBQXdDLEVBQUUsVUFBQyxJQUFZLEVBQUs7VUFBZixRQUFRLEdBQVYsSUFBWSxDQUFWLFFBQVE7O0FBQzNFLFVBQUksUUFBUSxFQUFFO0FBQ1osZUFBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDdkIsTUFBTTtBQUNM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RTtBQUNwQixnREFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkMsTUFBTTtBQUNMLGNBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixtQkFBTyxFQUFQLE9BQU87QUFDUCx1QkFBVyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQzFCLHFCQUFTLEVBQUUsSUFBSTtXQUNoQixDQUFDLENBQUM7U0FDSjtPQUNGO0tBQ0Y7OztXQTRCZSxtQkFBQyxPQUFPLEVBQUU7QUFDeEIsVUFBSSxPQUFPLHNDQUFtQixFQUFFO0FBQzlCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBN0lVLE9BQU87Ozs7O0FBZ0pwQixJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO3FCQUNmLE9BQU8iLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYXV0b3J1biwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSAndGlsZGlmeSc7XG5pbXBvcnQgcHJvamVjdFV0aWwgZnJvbSAnYXRvbS1wcm9qZWN0LXV0aWwnO1xuaW1wb3J0IHsgZWFjaCwgbWFwIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBGaWxlU3RvcmUgZnJvbSAnLi9zdG9yZXMvRmlsZVN0b3JlJztcbmltcG9ydCBHaXRTdG9yZSBmcm9tICcuL3N0b3Jlcy9HaXRTdG9yZSc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL21vZGVscy9Qcm9qZWN0JztcblxuZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xuICBAb2JzZXJ2YWJsZSBwcm9qZWN0cyA9IFtdO1xuICBAb2JzZXJ2YWJsZSBhY3RpdmVQYXRocyA9IFtdO1xuXG4gIEBjb21wdXRlZCBnZXQgYWN0aXZlUHJvamVjdCgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVQYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3RzLmZpbmQocHJvamVjdCA9PiBwcm9qZWN0LnJvb3RQYXRoID09PSB0aGlzLmFjdGl2ZVBhdGhzWzBdKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2l0U3RvcmUgPSBuZXcgR2l0U3RvcmUoKTtcbiAgICB0aGlzLmZpbGVTdG9yZSA9IG5ldyBGaWxlU3RvcmUoKTtcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLmZldGNoUHJvamVjdHMoKTtcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdwcm9qZWN0LW1hbmFnZXIuaW5jbHVkZUdpdFJlcG9zaXRvcmllcycsICh7IG5ld1ZhbHVlIH0pID0+IHtcbiAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmVtcHR5KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIGVhY2godGhpcy5maWxlU3RvcmUuZGF0YSwgKGZpbGVQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChmaWxlUHJvcCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9KTtcblxuICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgZWFjaCh0aGlzLmdpdFN0b3JlLmRhdGEsIChnaXRQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChnaXRQcm9wKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MubG9hZCh0aGlzLmFjdGl2ZVByb2plY3Quc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGNvbnN0IGFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QgJiYgdGhpcy5hY3RpdmVQcm9qZWN0LnJvb3RQYXRoID09PSBhY3RpdmVQYXRoc1swXSkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0LnBhdGhzLmxlbmd0aCAhPT0gYWN0aXZlUGF0aHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVQcm9qZWN0LnVwZGF0ZVByb3BzKHsgcGF0aHM6IGFjdGl2ZVBhdGhzIH0pO1xuICAgICAgICAgIHRoaXMuc2F2ZVByb2plY3RzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgVXBkYXRlIGEgcHJvamVjdC5cbiAgICpcbiAgICogUHJvcHMgY29taW5nIGZyb20gZmlsZSBnb2VzIGJlZm9yZSBhbnkgb3RoZXIgc291cmNlLlxuICAgKi9cbiAgQGFjdGlvbiBhZGRQcm9qZWN0KHByb3BzKSB7XG4gICAgY29uc3QgZm91bmRQcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKChwcm9qZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0Um9vdFBhdGggPSBwcm9qZWN0LnJvb3RQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBwcm9wc1Jvb3RQYXRoID0gdW50aWxkaWZ5KHByb3BzLnBhdGhzWzBdKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIHByb2plY3RSb290UGF0aCA9PT0gcHJvcHNSb290UGF0aDtcbiAgICB9KTtcblxuICAgIGlmICghZm91bmRQcm9qZWN0KSB7XG4gICAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QocHJvcHMpO1xuICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm91bmRQcm9qZWN0LnNvdXJjZSA9PT0gJ2ZpbGUnICYmIHByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgIGZvdW5kUHJvamVjdC51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5zb3VyY2UgPT09ICdmaWxlJyB8fCB0eXBlb2YgcHJvcHMuc291cmNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmb3VuZFByb2plY3QudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZldGNoUHJvamVjdHMoKSB7XG4gICAgdGhpcy5maWxlU3RvcmUuZmV0Y2goKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5pbmNsdWRlR2l0UmVwb3NpdG9yaWVzJykpIHtcbiAgICAgIHRoaXMuZ2l0U3RvcmUuZmV0Y2goKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgb3Blbihwcm9qZWN0LCBvcGVuSW5TYW1lV2luZG93ID0gZmFsc2UpIHtcbiAgICBpZiAoTWFuYWdlci5pc1Byb2plY3QocHJvamVjdCkpIHtcbiAgICAgIGNvbnN0IHsgZGV2TW9kZSB9ID0gcHJvamVjdC5nZXRQcm9wcygpO1xuXG4gICAgICBpZiAob3BlbkluU2FtZVdpbmRvdykge1xuICAgICAgICBwcm9qZWN0VXRpbC5zd2l0Y2gocHJvamVjdC5wYXRocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm9wZW4oe1xuICAgICAgICAgIGRldk1vZGUsXG4gICAgICAgICAgcGF0aHNUb09wZW46IHByb2plY3QucGF0aHMsXG4gICAgICAgICAgbmV3V2luZG93OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzYXZlUHJvamVjdChwcm9wcykge1xuICAgIGxldCBwcm9wc1RvU2F2ZSA9IHByb3BzO1xuICAgIGlmIChNYW5hZ2VyLmlzUHJvamVjdChwcm9wcykpIHtcbiAgICAgIHByb3BzVG9TYXZlID0gcHJvcHMuZ2V0UHJvcHMoKTtcbiAgICB9XG4gICAgdGhpcy5hZGRQcm9qZWN0KHsgLi4ucHJvcHNUb1NhdmUsIHNvdXJjZTogJ2ZpbGUnIH0pO1xuICAgIHRoaXMuc2F2ZVByb2plY3RzKCk7XG4gIH1cblxuICBzYXZlUHJvamVjdHMoKSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSB0aGlzLnByb2plY3RzLmZpbHRlcihwcm9qZWN0ID0+IHByb2plY3QucHJvcHMuc291cmNlID09PSAnZmlsZScpO1xuXG4gICAgY29uc3QgYXJyID0gbWFwKHByb2plY3RzLCAocHJvamVjdCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBwcm9qZWN0LmdldENoYW5nZWRQcm9wcygpO1xuICAgICAgZGVsZXRlIHByb3BzLnNvdXJjZTtcblxuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNhdmVQYXRoc1JlbGF0aXZlVG9Ib21lJykpIHtcbiAgICAgICAgcHJvcHMucGF0aHMgPSBwcm9wcy5wYXRocy5tYXAocGF0aCA9PiB0aWxkaWZ5KHBhdGgpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH0pO1xuXG4gICAgdGhpcy5maWxlU3RvcmUuc3RvcmUoYXJyKTtcbiAgfVxuXG4gIHN0YXRpYyBpc1Byb2plY3QocHJvamVjdCkge1xuICAgIGlmIChwcm9qZWN0IGluc3RhbmNlb2YgUHJvamVjdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xuZXhwb3J0IGRlZmF1bHQgbWFuYWdlcjtcbiJdfQ==