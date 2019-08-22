(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git(['stash', 'pop'], {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Pop stash'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1wb3AuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMxQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFFBQUE7SUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7V0FDTixHQUFBLENBQUksQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFKLEVBQXNCO01BQUMsS0FBQSxHQUFEO01BQU0sS0FBQSxFQUFPLElBQWI7S0FBdEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7QUFDSixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO2FBQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztRQUFDLFVBQUEsUUFBRDtRQUFXLE9BQUEsRUFBUyxXQUFwQjtPQUFkLEVBQWdELE1BQWhELENBQXRCO0lBRkksQ0FETjtFQUZlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSgnLi4vZ2l0LWVzJykuZGVmYXVsdFxuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgZ2l0KFsnc3Rhc2gnLCAncG9wJ10sIHtjd2QsIGNvbG9yOiB0cnVlfSlcbiAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogJ1BvcCBzdGFzaCd9LCByZXN1bHQpKVxuIl19
