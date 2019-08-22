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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFd0IsTUFBTTs7b0JBQ2tCLE1BQU07O3VCQUNsQyxXQUFXOzs7OzRCQUNJLGtCQUFrQjs7QUFMckQsV0FBVyxDQUFDOztBQU9aLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztBQUN2QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRWQsU0FBUyxhQUFhLEdBQUc7QUFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTdDLFNBQU8sSUFBSSxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQVEsYUFBYSxFQUFFLENBQUMsQ0FBQztDQUN6RDs7QUFFTSxTQUFTLFFBQVEsR0FBRzs7O0FBQ3pCLGFBQVcsR0FBRywrQkFBeUIsQ0FBQzs7QUFFeEMsYUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoRCxRQUFJLEdBQUcsMkJBQWEsSUFBSSxHQUFHLDJCQUFhLEVBQUU7QUFDeEMsYUFBTyxhQUFhLEVBQUUsQ0FBQztLQUN4Qjs7QUFFRCxXQUFPLElBQUksQ0FBQztHQUNiLENBQUMsQ0FBQyxDQUFDOztBQUVKLGFBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEQsbUNBQStCLEVBQUUsc0NBQU07QUFDckMsVUFBSSxDQUFDLE1BQUssZ0JBQWdCLEVBQUU7QUFDMUIsWUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7QUFFL0Qsd0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO09BQzNDOztBQUVELHNCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNCO0FBQ0QsbUNBQStCLEVBQUUsc0NBQU07QUFDckMsVUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGlCQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7T0FDM0M7O0FBRUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDMUM7QUFDRCxrQ0FBOEIsRUFBRSxxQ0FBTTtBQUNwQyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksd0JBQVUsQ0FBQztLQUMvQjtBQUNELGtDQUE4QixFQUFFLHFDQUFNO0FBQ3BDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBVSxDQUFDO0tBQy9CO0FBQ0QscUNBQWlDLEVBQUUsd0NBQU07QUFDdkMsMkJBQVEsYUFBYSxFQUFFLENBQUM7S0FDekI7R0FDRixDQUFDLENBQUMsQ0FBQztDQUNMOztBQUVNLFNBQVMsVUFBVSxHQUFHO0FBQzNCLGFBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUN2Qjs7QUFFTSxTQUFTLGVBQWUsR0FBRztBQUNoQyxTQUFPO0FBQ0wsZUFBVyxFQUFFLHFCQUFDLFFBQVEsRUFBSztBQUN6QixVQUFNLFFBQVEsR0FBRyxtQkFBUSxZQUFNO0FBQzdCLGdCQUFRLENBQUMscUJBQVEsUUFBUSxDQUFDLENBQUM7T0FDNUIsQ0FBQyxDQUFDOztBQUVILGFBQU8scUJBQWUsWUFBTTtBQUMxQixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7S0FDSjtBQUNELGNBQVUsRUFBRSxvQkFBQyxRQUFRLEVBQUs7QUFDeEIsVUFBTSxRQUFRLEdBQUcsbUJBQVEsWUFBTTtBQUM3QixnQkFBUSxDQUFDLHFCQUFRLGFBQWEsQ0FBQyxDQUFDO09BQ2pDLENBQUMsQ0FBQzs7QUFFSCxhQUFPLHFCQUFlLFlBQU07QUFDMUIsZ0JBQVEsRUFBRSxDQUFDO09BQ1osQ0FBQyxDQUFDO0tBQ0o7QUFDRCxlQUFXLEVBQUUscUJBQUMsT0FBTyxFQUFLO0FBQ3hCLDJCQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5QjtBQUNELGVBQVcsRUFBRSxxQkFBQyxPQUFPLEVBQUs7QUFDeEIsMkJBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgYXV0b3J1biB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9NYW5hZ2VyJztcbmltcG9ydCB7IFNBVkVfVVJJLCBFRElUX1VSSSB9IGZyb20gJy4vdmlld3Mvdmlldy11cmknO1xuXG5sZXQgZGlzcG9zYWJsZXMgPSBudWxsO1xubGV0IHByb2plY3RzTGlzdFZpZXcgPSBudWxsO1xubGV0IEZpbGVTdG9yZSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBlZGl0Q29tcG9uZW50KCkge1xuICBjb25zdCBFZGl0VmlldyA9IHJlcXVpcmUoJy4vdmlld3MvRWRpdFZpZXcnKTtcblxuICByZXR1cm4gbmV3IEVkaXRWaWV3KHsgcHJvamVjdDogbWFuYWdlci5hY3RpdmVQcm9qZWN0IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKCh1cmkpID0+IHtcbiAgICBpZiAodXJpID09PSBFRElUX1VSSSB8fCB1cmkgPT09IFNBVkVfVVJJKSB7XG4gICAgICByZXR1cm4gZWRpdENvbXBvbmVudCgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9KSk7XG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAncHJvamVjdC1tYW5hZ2VyOmxpc3QtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucHJvamVjdHNMaXN0Vmlldykge1xuICAgICAgICBjb25zdCBQcm9qZWN0c0xpc3RWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcnKTtcblxuICAgICAgICBwcm9qZWN0c0xpc3RWaWV3ID0gbmV3IFByb2plY3RzTGlzdFZpZXcoKTtcbiAgICAgIH1cblxuICAgICAgcHJvamVjdHNMaXN0Vmlldy50b2dnbGUoKTtcbiAgICB9LFxuICAgICdwcm9qZWN0LW1hbmFnZXI6ZWRpdC1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgIGlmICghRmlsZVN0b3JlKSB7XG4gICAgICAgIEZpbGVTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL0ZpbGVTdG9yZScpO1xuICAgICAgfVxuXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEZpbGVTdG9yZS5nZXRQYXRoKCkpO1xuICAgIH0sXG4gICAgJ3Byb2plY3QtbWFuYWdlcjpzYXZlLXByb2plY3QnOiAoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFNBVkVfVVJJKTtcbiAgICB9LFxuICAgICdwcm9qZWN0LW1hbmFnZXI6ZWRpdC1wcm9qZWN0JzogKCkgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihFRElUX1VSSSk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOnVwZGF0ZS1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgIG1hbmFnZXIuZmV0Y2hQcm9qZWN0cygpO1xuICAgIH0sXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVQcm9qZWN0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBnZXRQcm9qZWN0czogKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjb25zdCBkaXNwb3NlciA9IGF1dG9ydW4oKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBkaXNwb3NlcigpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRQcm9qZWN0OiAoY2FsbGJhY2spID0+IHtcbiAgICAgIGNvbnN0IGRpc3Bvc2VyID0gYXV0b3J1bigoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKG1hbmFnZXIuYWN0aXZlUHJvamVjdCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgZGlzcG9zZXIoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2F2ZVByb2plY3Q6IChwcm9qZWN0KSA9PiB7XG4gICAgICBtYW5hZ2VyLnNhdmVQcm9qZWN0KHByb2plY3QpO1xuICAgIH0sXG4gICAgb3BlblByb2plY3Q6IChwcm9qZWN0KSA9PiB7XG4gICAgICBtYW5hZ2VyLm9wZW4ocHJvamVjdCk7XG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==