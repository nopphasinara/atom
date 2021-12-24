(function() {
  var ProjectsListView, git, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  init = function(path) {
    return git.cmd(['init'], {
      cwd: path
    }).then(function(data) {
      notifier.addSuccess(data);
      return atom.project.setPaths(atom.project.getPaths());
    });
  };

  module.exports = function() {
    var currentFile, ref;
    currentFile = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWluaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDZCQUFSOztFQUNuQixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsSUFBQSxHQUFPLFNBQUMsSUFBRDtXQUNMLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxNQUFELENBQVIsRUFBa0I7TUFBQSxHQUFBLEVBQUssSUFBTDtLQUFsQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtNQUNKLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCO2FBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXRCO0lBRkksQ0FETjtFQURLOztFQU1QLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsV0FBQSw2REFBa0QsQ0FBRSxPQUF0QyxDQUFBO0lBQ2QsSUFBRyxDQUFJLFdBQUosSUFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixHQUFpQyxDQUF4RDthQUNFLElBQUksZ0JBQUosQ0FBQSxDQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUE5QixDQUFtQyxTQUFDLElBQUQ7ZUFBVSxJQUFBLENBQUssSUFBTDtNQUFWLENBQW5DLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQSxDQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE3QixFQUhGOztFQUZlO0FBVmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuUHJvamVjdHNMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3Byb2plY3RzLWxpc3Qtdmlldydcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbmluaXQgPSAocGF0aCkgLT5cbiAgZ2l0LmNtZChbJ2luaXQnXSwgY3dkOiBwYXRoKVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBub3RpZmllci5hZGRTdWNjZXNzIGRhdGFcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkpXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgY3VycmVudEZpbGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICBpZiBub3QgY3VycmVudEZpbGUgYW5kIGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCA+IDFcbiAgICBuZXcgUHJvamVjdHNMaXN0VmlldygpLnJlc3VsdC50aGVuIChwYXRoKSAtPiBpbml0KHBhdGgpXG4gIGVsc2VcbiAgICBpbml0KGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdKVxuIl19
