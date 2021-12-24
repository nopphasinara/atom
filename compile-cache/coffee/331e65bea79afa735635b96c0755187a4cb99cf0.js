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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXJlbW92ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNWLFFBQUE7SUFEa0IsOEJBQUQsTUFBZTtJQUNoQyxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7SUFDTixXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsMkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtJQUNkLElBQUcscUJBQUEsSUFBaUIsQ0FBSSxZQUF4QjtNQUNFLElBQUcsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsV0FBcEIsQ0FBQSxLQUFvQyxLQUFwQyxJQUE2QyxNQUFNLENBQUMsT0FBUCxDQUFlLGVBQWYsQ0FBaEQ7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBa0MsQ0FBQyxPQUFuQyxDQUFBO1FBQ0EsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO2VBQ1gsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBUixFQUF1RDtVQUFDLEtBQUEsR0FBRDtTQUF2RCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtpQkFBVSxjQUFjLENBQUMsTUFBZixDQUFzQjtZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBUyxVQUFBLEdBQVUsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQVYsR0FBeUIsR0FBN0M7WUFBaUQsTUFBQSxFQUFRLElBQXpEO1dBQXRCO1FBQVYsQ0FETixDQUVBLEVBQUMsS0FBRCxFQUZBLENBRU8sU0FBQyxJQUFEO2lCQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1lBQUMsVUFBQSxRQUFEO1lBQVcsT0FBQSxFQUFTLFVBQUEsR0FBVSxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBVixHQUF5QixHQUE3QztZQUFpRCxNQUFBLEVBQVEsSUFBekQ7WUFBK0QsTUFBQSxFQUFRLElBQXZFO1dBQXRCO1FBQVYsQ0FGUCxFQUhGO09BREY7S0FBQSxNQUFBO2FBUUUsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixrQkFBbkIsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBUixFQUEyRDtRQUFDLEtBQUEsR0FBRDtPQUEzRCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUFVLElBQUksY0FBSixDQUFtQixJQUFuQixFQUF5QixRQUFBLENBQVMsSUFBVCxDQUF6QjtNQUFWLENBRE4sRUFSRjs7RUFIVTs7RUFjWixRQUFBLEdBQVcsU0FBQyxJQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVg7SUFDUCxJQUFHLElBQUg7QUFDRTtXQUFBLDhDQUFBOztxQkFDRSxJQUFLLENBQUEsQ0FBQSxDQUFMLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQTtBQURwQztxQkFERjtLQUFBLE1BQUE7YUFJRSxLQUpGOztFQUZTOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBM0JqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5SZW1vdmVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW92ZS1saXN0LXZpZXcnXG5cbmdpdFJlbW92ZSA9IChyZXBvLCB7c2hvd1NlbGVjdG9yfT17fSkgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgY3VycmVudEZpbGUgPSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlmIGN1cnJlbnRGaWxlPyBhbmQgbm90IHNob3dTZWxlY3RvclxuICAgIGlmIHJlcG8uaXNQYXRoTW9kaWZpZWQoY3VycmVudEZpbGUpIGlzIGZhbHNlIG9yIHdpbmRvdy5jb25maXJtKCdBcmUgeW91IHN1cmU/JylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkuZGVzdHJveSgpXG4gICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgICAgZ2l0LmNtZChbJ3JtJywgJy1mJywgJy0taWdub3JlLXVubWF0Y2gnLCBjdXJyZW50RmlsZV0sIHtjd2R9KVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IFwiUmVtb3ZlICcje3ByZXR0aWZ5IGRhdGF9J1wiLCBvdXRwdXQ6IGRhdGF9KVxuICAgICAgLmNhdGNoIChkYXRhKSAtPiBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBcIlJlbW92ZSAnI3twcmV0dGlmeSBkYXRhfSdcIiwgb3V0cHV0OiBkYXRhLCBmYWlsZWQ6IHRydWV9KVxuICBlbHNlXG4gICAgZ2l0LmNtZChbJ3JtJywgJy1yJywgJy1uJywgJy0taWdub3JlLXVubWF0Y2gnLCAnLWYnLCAnKiddLCB7Y3dkfSlcbiAgICAudGhlbiAoZGF0YSkgLT4gbmV3IFJlbW92ZUxpc3RWaWV3KHJlcG8sIHByZXR0aWZ5KGRhdGEpKVxuXG5wcmV0dGlmeSA9IChkYXRhKSAtPlxuICBkYXRhID0gZGF0YS5tYXRjaCgvcm0gKCcuKicpL2cpXG4gIGlmIGRhdGFcbiAgICBmb3IgZmlsZSwgaSBpbiBkYXRhXG4gICAgICBkYXRhW2ldID0gZmlsZS5tYXRjaCgvcm0gJyguKiknLylbMV1cbiAgZWxzZVxuICAgIGRhdGFcblxubW9kdWxlLmV4cG9ydHMgPSBnaXRSZW1vdmVcbiJdfQ==
