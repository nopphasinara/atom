(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo, arg) {
    var args, cwd, message;
    message = (arg != null ? arg : {}).message;
    cwd = repo.getWorkingDirectory();
    args = ['stash', 'save'];
    if (message) {
      args.push(message);
    }
    return git(args, {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Stash changes'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMxQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLHlCQUFELE1BQVU7SUFDaEMsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO0lBQ04sSUFBQSxHQUFPLENBQUMsT0FBRCxFQUFVLE1BQVY7SUFDUCxJQUFzQixPQUF0QjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFBOztXQUNBLEdBQUEsQ0FBSSxJQUFKLEVBQVU7TUFBQyxLQUFBLEdBQUQ7TUFBTSxLQUFBLEVBQU8sSUFBYjtLQUFWLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxNQUFEO0FBQ0osVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTthQUNYLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFBQyxVQUFBLFFBQUQ7UUFBVyxPQUFBLEVBQVMsZUFBcEI7T0FBZCxFQUFvRCxNQUFwRCxDQUF0QjtJQUZJLENBRE47RUFKZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHttZXNzYWdlfT17fSkgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgYXJncyA9IFsnc3Rhc2gnLCAnc2F2ZSddXG4gIGFyZ3MucHVzaChtZXNzYWdlKSBpZiBtZXNzYWdlXG4gIGdpdChhcmdzLCB7Y3dkLCBjb2xvcjogdHJ1ZX0pXG4gIC50aGVuIChyZXN1bHQpIC0+XG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoT2JqZWN0LmFzc2lnbih7cmVwb05hbWUsIG1lc3NhZ2U6ICdTdGFzaCBjaGFuZ2VzJ30gLHJlc3VsdCkpXG4iXX0=
