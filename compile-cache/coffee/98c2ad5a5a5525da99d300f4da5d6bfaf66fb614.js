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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1zYXZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSLENBQW9CLEVBQUMsT0FBRDs7RUFDMUIsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUVyQyxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1Qix5QkFBRCxNQUFVO0lBQ2hDLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQTtJQUNOLElBQUEsR0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWO0lBQ1AsSUFBc0IsT0FBdEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBQTs7V0FDQSxHQUFBLENBQUksSUFBSixFQUFVO01BQUMsS0FBQSxHQUFEO01BQU0sS0FBQSxFQUFPLElBQWI7S0FBVixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsTUFBRDtBQUNKLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFvQixDQUFDLE9BQXJCLENBQUE7YUFDWCxjQUFjLENBQUMsTUFBZixDQUFzQixNQUFNLENBQUMsTUFBUCxDQUFjO1FBQUMsVUFBQSxRQUFEO1FBQVcsT0FBQSxFQUFTLGVBQXBCO09BQWQsRUFBb0QsTUFBcEQsQ0FBdEI7SUFGSSxDQUROO0VBSmU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlKCcuLi9naXQtZXMnKS5kZWZhdWx0XG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7bWVzc2FnZX09e30pIC0+XG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGFyZ3MgPSBbJ3N0YXNoJywgJ3NhdmUnXVxuICBhcmdzLnB1c2gobWVzc2FnZSkgaWYgbWVzc2FnZVxuICBnaXQoYXJncywge2N3ZCwgY29sb3I6IHRydWV9KVxuICAudGhlbiAocmVzdWx0KSAtPlxuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKE9iamVjdC5hc3NpZ24oe3JlcG9OYW1lLCBtZXNzYWdlOiAnU3Rhc2ggY2hhbmdlcyd9ICxyZXN1bHQpKVxuIl19
