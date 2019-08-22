(function() {
  var ActivityLogger, RemoveListView, Repository, git, gitRemove, prettify;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, arg) {
    var currentFile, cwd, ref, repoName, showSelector;
    showSelector = (arg != null ? arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        repoName = new Repository(repo).getName();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return ActivityLogger.record({
            repoName: repoName,
            message: "Remove '" + (prettify(data)) + "'",
            output: data
          });
        })["catch"](function(data) {
          return ActivityLogger.record({
            repoName: repoName,
            message: "Remove '" + (prettify(data)) + "'",
            output: data,
            failed: true
          });
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, j, len, results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      results = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        file = data[i];
        results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1yZW1vdmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDVixRQUFBO0lBRGtCLDhCQUFELE1BQWU7SUFDaEMsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO0lBQ04sV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLDJEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEI7SUFDZCxJQUFHLHFCQUFBLElBQWlCLENBQUksWUFBeEI7TUFDRSxJQUFHLElBQUksQ0FBQyxjQUFMLENBQW9CLFdBQXBCLENBQUEsS0FBb0MsS0FBcEMsSUFBNkMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxlQUFmLENBQWhEO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQWtDLENBQUMsT0FBbkMsQ0FBQTtRQUNBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTtlQUNYLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLGtCQUFiLEVBQWlDLFdBQWpDLENBQVIsRUFBdUQ7VUFBQyxLQUFBLEdBQUQ7U0FBdkQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7aUJBQVUsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7WUFBQyxVQUFBLFFBQUQ7WUFBVyxPQUFBLEVBQVMsVUFBQSxHQUFVLENBQUMsUUFBQSxDQUFTLElBQVQsQ0FBRCxDQUFWLEdBQXlCLEdBQTdDO1lBQWlELE1BQUEsRUFBUSxJQUF6RDtXQUF0QjtRQUFWLENBRE4sQ0FFQSxFQUFDLEtBQUQsRUFGQSxDQUVPLFNBQUMsSUFBRDtpQkFBVSxjQUFjLENBQUMsTUFBZixDQUFzQjtZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBUyxVQUFBLEdBQVUsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQVYsR0FBeUIsR0FBN0M7WUFBaUQsTUFBQSxFQUFRLElBQXpEO1lBQStELE1BQUEsRUFBUSxJQUF2RTtXQUF0QjtRQUFWLENBRlAsRUFIRjtPQURGO0tBQUEsTUFBQTthQVFFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsa0JBQW5CLEVBQXVDLElBQXZDLEVBQTZDLEdBQTdDLENBQVIsRUFBMkQ7UUFBQyxLQUFBLEdBQUQ7T0FBM0QsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7ZUFBVSxJQUFJLGNBQUosQ0FBbUIsSUFBbkIsRUFBeUIsUUFBQSxDQUFTLElBQVQsQ0FBekI7TUFBVixDQUROLEVBUkY7O0VBSFU7O0VBY1osUUFBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYO0lBQ1AsSUFBRyxJQUFIO0FBQ0U7V0FBQSw4Q0FBQTs7cUJBQ0UsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxDQUF3QixDQUFBLENBQUE7QUFEcEM7cUJBREY7S0FBQSxNQUFBO2FBSUUsS0FKRjs7RUFGUzs7RUFRWCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTNCakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuUmVtb3ZlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdmUtbGlzdC12aWV3J1xuXG5naXRSZW1vdmUgPSAocmVwbywge3Nob3dTZWxlY3Rvcn09e30pIC0+XG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGN1cnJlbnRGaWxlID0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICBpZiBjdXJyZW50RmlsZT8gYW5kIG5vdCBzaG93U2VsZWN0b3JcbiAgICBpZiByZXBvLmlzUGF0aE1vZGlmaWVkKGN1cnJlbnRGaWxlKSBpcyBmYWxzZSBvciB3aW5kb3cuY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmRlc3Ryb3koKVxuICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgICAgIGdpdC5jbWQoWydybScsICctZicsICctLWlnbm9yZS11bm1hdGNoJywgY3VycmVudEZpbGVdLCB7Y3dkfSlcbiAgICAgIC50aGVuIChkYXRhKSAtPiBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBcIlJlbW92ZSAnI3twcmV0dGlmeSBkYXRhfSdcIiwgb3V0cHV0OiBkYXRhfSlcbiAgICAgIC5jYXRjaCAoZGF0YSkgLT4gQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogXCJSZW1vdmUgJyN7cHJldHRpZnkgZGF0YX0nXCIsIG91dHB1dDogZGF0YSwgZmFpbGVkOiB0cnVlfSlcbiAgZWxzZVxuICAgIGdpdC5jbWQoWydybScsICctcicsICctbicsICctLWlnbm9yZS11bm1hdGNoJywgJy1mJywgJyonXSwge2N3ZH0pXG4gICAgLnRoZW4gKGRhdGEpIC0+IG5ldyBSZW1vdmVMaXN0VmlldyhyZXBvLCBwcmV0dGlmeShkYXRhKSlcblxucHJldHRpZnkgPSAoZGF0YSkgLT5cbiAgZGF0YSA9IGRhdGEubWF0Y2goL3JtICgnLionKS9nKVxuICBpZiBkYXRhXG4gICAgZm9yIGZpbGUsIGkgaW4gZGF0YVxuICAgICAgZGF0YVtpXSA9IGZpbGUubWF0Y2goL3JtICcoLiopJy8pWzFdXG4gIGVsc2VcbiAgICBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0UmVtb3ZlXG4iXX0=
