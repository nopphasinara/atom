(function() {
  var ActivityLogger, Repository, emptyOrUndefined, getUpstream, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  emptyOrUndefined = function(thing) {
    return thing !== '' && thing !== void 0;
  };

  getUpstream = function(repo) {
    var branch, branchInfo, ref, remote;
    branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring('refs/remotes/'.length).split('/') : void 0;
    if (!branchInfo) {
      return null;
    }
    remote = branchInfo[0];
    branch = branchInfo.slice(1).join('/');
    return [remote, branch];
  };

  module.exports = function(repo, arg) {
    var args, extraArgs, recordMessage, repoName, startMessage, upstream;
    extraArgs = (arg != null ? arg : {}).extraArgs;
    if (upstream = getUpstream(repo)) {
      if (typeof extraArgs === 'string') {
        extraArgs = [extraArgs];
      }
      if (extraArgs == null) {
        extraArgs = [];
      }
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      recordMessage = "pull " + (extraArgs.join(' '));
      args = ['pull'].concat(extraArgs).concat(upstream).filter(emptyOrUndefined);
      repoName = new Repository(repo).getName();
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(output) {
        ActivityLogger.record({
          message: recordMessage,
          output: output,
          repoName: repoName
        });
        return startMessage.dismiss();
      })["catch"](function(output) {
        ActivityLogger.record({
          message: recordMessage,
          output: output,
          repoName: repoName,
          failed: true
        });
        return startMessage.dismiss();
      });
    } else {
      return notifier.addInfo('The current branch is not tracking from upstream');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL19wdWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLGdCQUFBLEdBQW1CLFNBQUMsS0FBRDtXQUFXLEtBQUEsS0FBVyxFQUFYLElBQWtCLEtBQUEsS0FBVztFQUF4Qzs7RUFFbkIsV0FBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLFFBQUE7SUFBQSxVQUFBLGlEQUFxQyxDQUFFLFNBQTFCLENBQW9DLGVBQWUsQ0FBQyxNQUFwRCxDQUEyRCxDQUFDLEtBQTVELENBQWtFLEdBQWxFO0lBQ2IsSUFBZSxDQUFJLFVBQW5CO0FBQUEsYUFBTyxLQUFQOztJQUNBLE1BQUEsR0FBUyxVQUFXLENBQUEsQ0FBQTtJQUNwQixNQUFBLEdBQVMsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixHQUF6QjtXQUNULENBQUMsTUFBRCxFQUFTLE1BQVQ7RUFMWTs7RUFPZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QiwyQkFBRCxNQUFZO0lBQ2xDLElBQUcsUUFBQSxHQUFXLFdBQUEsQ0FBWSxJQUFaLENBQWQ7TUFDRSxJQUFHLE9BQU8sU0FBUCxLQUFvQixRQUF2QjtRQUFxQyxTQUFBLEdBQVksQ0FBQyxTQUFELEVBQWpEOzs7UUFDQSxZQUFhOztNQUNiLFlBQUEsR0FBZSxRQUFRLENBQUMsT0FBVCxDQUFpQixZQUFqQixFQUErQjtRQUFBLFdBQUEsRUFBYSxJQUFiO09BQS9CO01BQ2YsYUFBQSxHQUFlLE9BQUEsR0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFWLENBQWUsR0FBZixDQUFEO01BQ3hCLElBQUEsR0FBTyxDQUFDLE1BQUQsQ0FBUSxDQUFDLE1BQVQsQ0FBZ0IsU0FBaEIsQ0FBMEIsQ0FBQyxNQUEzQixDQUFrQyxRQUFsQyxDQUEyQyxDQUFDLE1BQTVDLENBQW1ELGdCQUFuRDtNQUNQLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTthQUNYLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBZCxFQUErQztRQUFDLEtBQUEsRUFBTyxJQUFSO09BQS9DLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxNQUFEO1FBQ0osY0FBYyxDQUFDLE1BQWYsQ0FBc0I7VUFBQyxPQUFBLEVBQVMsYUFBVjtVQUF5QixRQUFBLE1BQXpCO1VBQWlDLFVBQUEsUUFBakM7U0FBdEI7ZUFDQSxZQUFZLENBQUMsT0FBYixDQUFBO01BRkksQ0FETixDQUlBLEVBQUMsS0FBRCxFQUpBLENBSU8sU0FBQyxNQUFEO1FBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7VUFBQyxPQUFBLEVBQVMsYUFBVjtVQUF5QixRQUFBLE1BQXpCO1VBQWlDLFVBQUEsUUFBakM7VUFBMkMsTUFBQSxFQUFRLElBQW5EO1NBQXRCO2VBQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBQTtNQUZLLENBSlAsRUFQRjtLQUFBLE1BQUE7YUFlRSxRQUFRLENBQUMsT0FBVCxDQUFpQixrREFBakIsRUFmRjs7RUFEZTtBQWRqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5lbXB0eU9yVW5kZWZpbmVkID0gKHRoaW5nKSAtPiB0aGluZyBpc250ICcnIGFuZCB0aGluZyBpc250IHVuZGVmaW5lZFxuXG5nZXRVcHN0cmVhbSA9IChyZXBvKSAtPlxuICBicmFuY2hJbmZvID0gcmVwby5nZXRVcHN0cmVhbUJyYW5jaCgpPy5zdWJzdHJpbmcoJ3JlZnMvcmVtb3Rlcy8nLmxlbmd0aCkuc3BsaXQoJy8nKVxuICByZXR1cm4gbnVsbCBpZiBub3QgYnJhbmNoSW5mb1xuICByZW1vdGUgPSBicmFuY2hJbmZvWzBdXG4gIGJyYW5jaCA9IGJyYW5jaEluZm8uc2xpY2UoMSkuam9pbignLycpXG4gIFtyZW1vdGUsIGJyYW5jaF1cblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge2V4dHJhQXJnc309e30pIC0+XG4gIGlmIHVwc3RyZWFtID0gZ2V0VXBzdHJlYW0ocmVwbylcbiAgICBpZiB0eXBlb2YgZXh0cmFBcmdzIGlzICdzdHJpbmcnIHRoZW4gZXh0cmFBcmdzID0gW2V4dHJhQXJnc11cbiAgICBleHRyYUFyZ3MgPz0gW11cbiAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIFwiUHVsbGluZy4uLlwiLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIHJlY29yZE1lc3NhZ2UgPVwiXCJcInB1bGwgI3tleHRyYUFyZ3Muam9pbignICcpfVwiXCJcIlxuICAgIGFyZ3MgPSBbJ3B1bGwnXS5jb25jYXQoZXh0cmFBcmdzKS5jb25jYXQodXBzdHJlYW0pLmZpbHRlcihlbXB0eU9yVW5kZWZpbmVkKVxuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgIC50aGVuIChvdXRwdXQpIC0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe21lc3NhZ2U6IHJlY29yZE1lc3NhZ2UsIG91dHB1dCwgcmVwb05hbWV9KVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgIC5jYXRjaCAob3V0cHV0KSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHttZXNzYWdlOiByZWNvcmRNZXNzYWdlLCBvdXRwdXQsIHJlcG9OYW1lLCBmYWlsZWQ6IHRydWV9KVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyAnVGhlIGN1cnJlbnQgYnJhbmNoIGlzIG5vdCB0cmFja2luZyBmcm9tIHVwc3RyZWFtJ1xuIl19
