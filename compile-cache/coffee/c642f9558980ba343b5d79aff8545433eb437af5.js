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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvX3B1bGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFFckMsZ0JBQUEsR0FBbUIsU0FBQyxLQUFEO1dBQVcsS0FBQSxLQUFXLEVBQVgsSUFBa0IsS0FBQSxLQUFXO0VBQXhDOztFQUVuQixXQUFBLEdBQWMsU0FBQyxJQUFEO0FBQ1osUUFBQTtJQUFBLFVBQUEsaURBQXFDLENBQUUsU0FBMUIsQ0FBb0MsZUFBZSxDQUFDLE1BQXBELENBQTJELENBQUMsS0FBNUQsQ0FBa0UsR0FBbEU7SUFDYixJQUFlLENBQUksVUFBbkI7QUFBQSxhQUFPLEtBQVA7O0lBQ0EsTUFBQSxHQUFTLFVBQVcsQ0FBQSxDQUFBO0lBQ3BCLE1BQUEsR0FBUyxVQUFVLENBQUMsS0FBWCxDQUFpQixDQUFqQixDQUFtQixDQUFDLElBQXBCLENBQXlCLEdBQXpCO1dBQ1QsQ0FBQyxNQUFELEVBQVMsTUFBVDtFQUxZOztFQU9kLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLDJCQUFELE1BQVk7SUFDbEMsSUFBRyxRQUFBLEdBQVcsV0FBQSxDQUFZLElBQVosQ0FBZDtNQUNFLElBQUcsT0FBTyxTQUFQLEtBQW9CLFFBQXZCO1FBQXFDLFNBQUEsR0FBWSxDQUFDLFNBQUQsRUFBakQ7OztRQUNBLFlBQWE7O01BQ2IsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLFlBQWpCLEVBQStCO1FBQUEsV0FBQSxFQUFhLElBQWI7T0FBL0I7TUFDZixhQUFBLEdBQWUsT0FBQSxHQUFTLENBQUMsU0FBUyxDQUFDLElBQVYsQ0FBZSxHQUFmLENBQUQ7TUFDeEIsSUFBQSxHQUFPLENBQUMsTUFBRCxDQUFRLENBQUMsTUFBVCxDQUFnQixTQUFoQixDQUEwQixDQUFDLE1BQTNCLENBQWtDLFFBQWxDLENBQTJDLENBQUMsTUFBNUMsQ0FBbUQsZ0JBQW5EO01BQ1AsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO2FBQ1gsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFkLEVBQStDO1FBQUMsS0FBQSxFQUFPLElBQVI7T0FBL0MsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7UUFDSixjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLE9BQUEsRUFBUyxhQUFWO1VBQXlCLFFBQUEsTUFBekI7VUFBaUMsVUFBQSxRQUFqQztTQUF0QjtlQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLE1BQUQ7UUFDTCxjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLE9BQUEsRUFBUyxhQUFWO1VBQXlCLFFBQUEsTUFBekI7VUFBaUMsVUFBQSxRQUFqQztVQUEyQyxNQUFBLEVBQVEsSUFBbkQ7U0FBdEI7ZUFDQSxZQUFZLENBQUMsT0FBYixDQUFBO01BRkssQ0FKUCxFQVBGO0tBQUEsTUFBQTthQWVFLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtEQUFqQixFQWZGOztFQURlO0FBZGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5cbmVtcHR5T3JVbmRlZmluZWQgPSAodGhpbmcpIC0+IHRoaW5nIGlzbnQgJycgYW5kIHRoaW5nIGlzbnQgdW5kZWZpbmVkXG5cbmdldFVwc3RyZWFtID0gKHJlcG8pIC0+XG4gIGJyYW5jaEluZm8gPSByZXBvLmdldFVwc3RyZWFtQnJhbmNoKCk/LnN1YnN0cmluZygncmVmcy9yZW1vdGVzLycubGVuZ3RoKS5zcGxpdCgnLycpXG4gIHJldHVybiBudWxsIGlmIG5vdCBicmFuY2hJbmZvXG4gIHJlbW90ZSA9IGJyYW5jaEluZm9bMF1cbiAgYnJhbmNoID0gYnJhbmNoSW5mby5zbGljZSgxKS5qb2luKCcvJylcbiAgW3JlbW90ZSwgYnJhbmNoXVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7ZXh0cmFBcmdzfT17fSkgLT5cbiAgaWYgdXBzdHJlYW0gPSBnZXRVcHN0cmVhbShyZXBvKVxuICAgIGlmIHR5cGVvZiBleHRyYUFyZ3MgaXMgJ3N0cmluZycgdGhlbiBleHRyYUFyZ3MgPSBbZXh0cmFBcmdzXVxuICAgIGV4dHJhQXJncyA/PSBbXVxuICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gXCJQdWxsaW5nLi4uXCIsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgcmVjb3JkTWVzc2FnZSA9XCJcIlwicHVsbCAje2V4dHJhQXJncy5qb2luKCcgJyl9XCJcIlwiXG4gICAgYXJncyA9IFsncHVsbCddLmNvbmNhdChleHRyYUFyZ3MpLmNvbmNhdCh1cHN0cmVhbSkuZmlsdGVyKGVtcHR5T3JVbmRlZmluZWQpXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgLnRoZW4gKG91dHB1dCkgLT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7bWVzc2FnZTogcmVjb3JkTWVzc2FnZSwgb3V0cHV0LCByZXBvTmFtZX0pXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgLmNhdGNoIChvdXRwdXQpIC0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe21lc3NhZ2U6IHJlY29yZE1lc3NhZ2UsIG91dHB1dCwgcmVwb05hbWUsIGZhaWxlZDogdHJ1ZX0pXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvICdUaGUgY3VycmVudCBicmFuY2ggaXMgbm90IHRyYWNraW5nIGZyb20gdXBzdHJlYW0nXG4iXX0=
