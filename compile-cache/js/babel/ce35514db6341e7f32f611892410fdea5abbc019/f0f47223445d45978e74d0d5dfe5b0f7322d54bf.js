Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.editComponent = editComponent;
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideProjects = provideProjects;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mobx = require('mobx');

var _atom = require('atom');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _viewsViewUri = require('./views/view-uri');

'use babel';

var disposables = null;
var projectsListView = null;
var FileStore = null;

function editComponent() {
  var EditView = require('./views/EditView');

  return new EditView({ project: _Manager2['default'].activeProject });
}

function activate() {
  var _this = this;

  disposables = new _atom.CompositeDisposable();

  disposables.add(atom.workspace.addOpener(function (uri) {
    if (uri === _viewsViewUri.EDIT_URI || uri === _viewsViewUri.SAVE_URI) {
      return editComponent();
    }

    return null;
  }));

  disposables.add(atom.commands.add('atom-workspace', {
    'project-manager:list-projects': function projectManagerListProjects() {
      if (!_this.projectsListView) {
        var ProjectsListView = require('./views/projects-list-view');

        projectsListView = new ProjectsListView();
      }

      projectsListView.toggle();
    },
    'project-manager:edit-projects': function projectManagerEditProjects() {
      if (!FileStore) {
        FileStore = require('./stores/FileStore');
      }

      atom.workspace.open(FileStore.getPath());
    },
    'project-manager:save-project': function projectManagerSaveProject() {
      atom.workspace.open(_viewsViewUri.SAVE_URI);
    },
    'project-manager:edit-project': function projectManagerEditProject() {
      atom.workspace.open(_viewsViewUri.EDIT_URI);
    },
    'project-manager:update-projects': function projectManagerUpdateProjects() {
      _Manager2['default'].fetchProjects();
    }
  }));
}

function deactivate() {
  disposables.dispose();
}

function provideProjects() {
  return {
    getProjects: function getProjects(callback) {
      var disposer = (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].projects);
      });

      return new _atom.Disposable(function () {
        disposer();
      });
    },
    getProject: function getProject(callback) {
      var disposer = (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].activeProject);
      });

      return new _atom.Disposable(function () {
        disposer();
      });
    },
    saveProject: function saveProject(project) {
      _Manager2['default'].saveProject(project);
    },
    openProject: function openProject(project) {
      _Manager2['default'].open(project);
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUV3QixNQUFNOztvQkFDa0IsTUFBTTs7dUJBQ2xDLFdBQVc7Ozs7NEJBQ0ksa0JBQWtCOztBQUxyRCxXQUFXLENBQUM7O0FBT1osSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFZCxTQUFTLGFBQWEsR0FBRztBQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFN0MsU0FBTyxJQUFJLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBUSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0NBQ3pEOztBQUVNLFNBQVMsUUFBUSxHQUFHOzs7QUFDekIsYUFBVyxHQUFHLCtCQUF5QixDQUFDOztBQUV4QyxhQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2hELFFBQUksR0FBRywyQkFBYSxJQUFJLEdBQUcsMkJBQWEsRUFBRTtBQUN4QyxhQUFPLGFBQWEsRUFBRSxDQUFDO0tBQ3hCOztBQUVELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQyxDQUFDLENBQUM7O0FBRUosYUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsRCxtQ0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxVQUFJLENBQUMsTUFBSyxnQkFBZ0IsRUFBRTtBQUMxQixZQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUvRCx3QkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7T0FDM0M7O0FBRUQsc0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7QUFDRCxtQ0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxVQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsaUJBQVMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztPQUMzQzs7QUFFRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMxQztBQUNELGtDQUE4QixFQUFFLHFDQUFNO0FBQ3BDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBVSxDQUFDO0tBQy9CO0FBQ0Qsa0NBQThCLEVBQUUscUNBQU07QUFDcEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUFVLENBQUM7S0FDL0I7QUFDRCxxQ0FBaUMsRUFBRSx3Q0FBTTtBQUN2QywyQkFBUSxhQUFhLEVBQUUsQ0FBQztLQUN6QjtHQUNGLENBQUMsQ0FBQyxDQUFDO0NBQ0w7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDM0IsYUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ3ZCOztBQUVNLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLFNBQU87QUFDTCxlQUFXLEVBQUUscUJBQUMsUUFBUSxFQUFLO0FBQ3pCLFVBQU0sUUFBUSxHQUFHLG1CQUFRLFlBQU07QUFDN0IsZ0JBQVEsQ0FBQyxxQkFBUSxRQUFRLENBQUMsQ0FBQztPQUM1QixDQUFDLENBQUM7O0FBRUgsYUFBTyxxQkFBZSxZQUFNO0FBQzFCLGdCQUFRLEVBQUUsQ0FBQztPQUNaLENBQUMsQ0FBQztLQUNKO0FBQ0QsY0FBVSxFQUFFLG9CQUFDLFFBQVEsRUFBSztBQUN4QixVQUFNLFFBQVEsR0FBRyxtQkFBUSxZQUFNO0FBQzdCLGdCQUFRLENBQUMscUJBQVEsYUFBYSxDQUFDLENBQUM7T0FDakMsQ0FBQyxDQUFDOztBQUVILGFBQU8scUJBQWUsWUFBTTtBQUMxQixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7S0FDSjtBQUNELGVBQVcsRUFBRSxxQkFBQyxPQUFPLEVBQUs7QUFDeEIsMkJBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlCO0FBQ0QsZUFBVyxFQUFFLHFCQUFDLE9BQU8sRUFBSztBQUN4QiwyQkFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdkI7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vTWFuYWdlcic7XG5pbXBvcnQgeyBTQVZFX1VSSSwgRURJVF9VUkkgfSBmcm9tICcuL3ZpZXdzL3ZpZXctdXJpJztcblxubGV0IGRpc3Bvc2FibGVzID0gbnVsbDtcbmxldCBwcm9qZWN0c0xpc3RWaWV3ID0gbnVsbDtcbmxldCBGaWxlU3RvcmUgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gZWRpdENvbXBvbmVudCgpIHtcbiAgY29uc3QgRWRpdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL0VkaXRWaWV3Jyk7XG5cbiAgcmV0dXJuIG5ldyBFZGl0Vmlldyh7IHByb2plY3Q6IG1hbmFnZXIuYWN0aXZlUHJvamVjdCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcigodXJpKSA9PiB7XG4gICAgaWYgKHVyaSA9PT0gRURJVF9VUkkgfHwgdXJpID09PSBTQVZFX1VSSSkge1xuICAgICAgcmV0dXJuIGVkaXRDb21wb25lbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSkpO1xuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgJ3Byb2plY3QtbWFuYWdlcjpsaXN0LXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb2plY3RzTGlzdFZpZXcpIHtcbiAgICAgICAgY29uc3QgUHJvamVjdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vdmlld3MvcHJvamVjdHMtbGlzdC12aWV3Jyk7XG5cbiAgICAgICAgcHJvamVjdHNMaXN0VmlldyA9IG5ldyBQcm9qZWN0c0xpc3RWaWV3KCk7XG4gICAgICB9XG5cbiAgICAgIHByb2plY3RzTGlzdFZpZXcudG9nZ2xlKCk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICBpZiAoIUZpbGVTdG9yZSkge1xuICAgICAgICBGaWxlU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9GaWxlU3RvcmUnKTtcbiAgICAgIH1cblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihGaWxlU3RvcmUuZ2V0UGF0aCgpKTtcbiAgICB9LFxuICAgICdwcm9qZWN0LW1hbmFnZXI6c2F2ZS1wcm9qZWN0JzogKCkgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihTQVZFX1VSSSk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdCc6ICgpID0+IHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oRURJVF9VUkkpO1xuICAgIH0sXG4gICAgJ3Byb2plY3QtbWFuYWdlcjp1cGRhdGUtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICBtYW5hZ2VyLmZldGNoUHJvamVjdHMoKTtcbiAgICB9LFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlUHJvamVjdHMoKSB7XG4gIHJldHVybiB7XG4gICAgZ2V0UHJvamVjdHM6IChjYWxsYmFjaykgPT4ge1xuICAgICAgY29uc3QgZGlzcG9zZXIgPSBhdXRvcnVuKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sobWFuYWdlci5wcm9qZWN0cyk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgZGlzcG9zZXIoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0UHJvamVjdDogKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjb25zdCBkaXNwb3NlciA9IGF1dG9ydW4oKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhtYW5hZ2VyLmFjdGl2ZVByb2plY3QpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGRpc3Bvc2VyKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNhdmVQcm9qZWN0OiAocHJvamVjdCkgPT4ge1xuICAgICAgbWFuYWdlci5zYXZlUHJvamVjdChwcm9qZWN0KTtcbiAgICB9LFxuICAgIG9wZW5Qcm9qZWN0OiAocHJvamVjdCkgPT4ge1xuICAgICAgbWFuYWdlci5vcGVuKHByb2plY3QpO1xuICAgIH0sXG4gIH07XG59XG4iXX0=