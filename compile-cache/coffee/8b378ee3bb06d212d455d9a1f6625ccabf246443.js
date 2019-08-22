(function() {
  var BranchListView, Path, fs, git, nothingToShow, notifier, prepFile, showFile;

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  nothingToShow = 'Nothing to show.';

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.general.openInPane')) {
      splitDirection = atom.config.get('git-plus.general.splitPane');
      atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return reject(nothingToShow);
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  module.exports = function(repo) {
    var disposable;
    disposable = null;
    return git.cmd(['branch', '--no-color'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new BranchListView(data, function(arg) {
        var args, branchName, name;
        name = arg.name;
        branchName = name;
        args = ['diff', '--stat', repo.branch, name];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          var diffFilePath, diffStat;
          diffStat = data;
          diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
          args = ['diff', '--color=never', repo.branch, name];
          if (atom.config.get('git-plus.diffs.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(data) {
            return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
          }).then(function() {
            return showFile(diffFilePath);
          }).then(function(textEditor) {
            return disposable = textEditor.onDidDestroy(function() {
              fs.unlink(diffFilePath);
              return disposable != null ? disposable.dispose() : void 0;
            });
          })["catch"]((function(_this) {
            return function(err) {
              if (err === nothingToShow) {
                return notifier.addInfo(err);
              } else {
                return notifier.addError(err);
              }
            };
          })(this));
        });
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixhQUFBLEdBQWdCOztFQUVoQixRQUFBLEdBQVcsU0FBQyxRQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFIO01BQ0UsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO01BQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUFBLENBQTBCLENBQUMsYUFBM0IsQ0FBQSxDQUEyQyxDQUFBLE9BQUEsR0FBUSxjQUFSLENBQTNDLENBQUEsRUFGRjs7V0FHQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEI7RUFKUzs7RUFNWCxRQUFBLEdBQVcsU0FBQyxJQUFELEVBQU8sUUFBUDtXQUNULElBQUksT0FBSixDQUFZLFNBQUMsT0FBRCxFQUFVLE1BQVY7TUFDVixvQkFBRyxJQUFJLENBQUUsZ0JBQU4sS0FBZ0IsQ0FBbkI7ZUFDRSxNQUFBLENBQU8sYUFBUCxFQURGO09BQUEsTUFBQTtlQUdFLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBYixFQUF1QixJQUF2QixFQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCLEVBQXlDLFNBQUMsR0FBRDtVQUN2QyxJQUFHLEdBQUg7bUJBQVksTUFBQSxDQUFPLEdBQVAsRUFBWjtXQUFBLE1BQUE7bUJBQTRCLE9BQUEsQ0FBUSxJQUFSLEVBQTVCOztRQUR1QyxDQUF6QyxFQUhGOztJQURVLENBQVo7RUFEUzs7RUFRWCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsVUFBQSxHQUFhO1dBQ2IsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxZQUFYLENBQVIsRUFBa0M7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFsQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFVLElBQUksY0FBSixDQUFtQixJQUFuQixFQUF5QixTQUFDLEdBQUQ7QUFDdkMsWUFBQTtRQUR5QyxPQUFEO1FBQ3hDLFVBQUEsR0FBYTtRQUNiLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLElBQUksQ0FBQyxNQUF4QixFQUFnQyxJQUFoQztlQUNQLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1VBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtBQUNKLGNBQUE7VUFBQSxRQUFBLEdBQVc7VUFDWCxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsb0JBQTFCO1VBQ2YsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsSUFBSSxDQUFDLE1BQS9CLEVBQXVDLElBQXZDO1VBQ1AsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUEzQjtZQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBVixFQUFBOztpQkFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztZQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1dBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7bUJBQVUsUUFBQSxDQUFTLG9CQUFDLFdBQVcsRUFBWixDQUFBLEdBQWtCLElBQTNCLEVBQWlDLFlBQWpDO1VBQVYsQ0FETixDQUVBLENBQUMsSUFGRCxDQUVNLFNBQUE7bUJBQUcsUUFBQSxDQUFTLFlBQVQ7VUFBSCxDQUZOLENBR0EsQ0FBQyxJQUhELENBR00sU0FBQyxVQUFEO21CQUNKLFVBQUEsR0FBYSxVQUFVLENBQUMsWUFBWCxDQUF3QixTQUFBO2NBQ25DLEVBQUUsQ0FBQyxNQUFILENBQVUsWUFBVjswQ0FDQSxVQUFVLENBQUUsT0FBWixDQUFBO1lBRm1DLENBQXhCO1VBRFQsQ0FITixDQU9BLEVBQUMsS0FBRCxFQVBBLENBT08sQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxHQUFEO2NBQ0wsSUFBRyxHQUFBLEtBQU8sYUFBVjt1QkFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURGO2VBQUEsTUFBQTt1QkFHRSxRQUFRLENBQUMsUUFBVCxDQUFrQixHQUFsQixFQUhGOztZQURLO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVBQO1FBTEksQ0FETjtNQUh1QyxDQUF6QjtJQUFWLENBRE47RUFGZTtBQXRCakIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5CcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2JyYW5jaC1saXN0LXZpZXcnXG5cbm5vdGhpbmdUb1Nob3cgPSAnTm90aGluZyB0byBzaG93Lidcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5zcGxpdFBhbmUnKVxuICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuXG5wcmVwRmlsZSA9ICh0ZXh0LCBmaWxlUGF0aCkgLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBpZiB0ZXh0Py5sZW5ndGggaXMgMFxuICAgICAgcmVqZWN0IG5vdGhpbmdUb1Nob3dcbiAgICBlbHNlXG4gICAgICBmcy53cml0ZUZpbGUgZmlsZVBhdGgsIHRleHQsIGZsYWc6ICd3KycsIChlcnIpIC0+XG4gICAgICAgIGlmIGVyciB0aGVuIHJlamVjdCBlcnIgZWxzZSByZXNvbHZlIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgZGlzcG9zYWJsZSA9IG51bGxcbiAgZ2l0LmNtZChbJ2JyYW5jaCcsICctLW5vLWNvbG9yJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgQnJhbmNoTGlzdFZpZXcgZGF0YSwgKHtuYW1lfSkgLT5cbiAgICBicmFuY2hOYW1lID0gbmFtZVxuICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1zdGF0JywgcmVwby5icmFuY2gsIG5hbWVdXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgZGlmZlN0YXQgPSBkYXRhXG4gICAgICBkaWZmRmlsZVBhdGggPSBQYXRoLmpvaW4ocmVwby5nZXRQYXRoKCksIFwiYXRvbV9naXRfcGx1cy5kaWZmXCIpXG4gICAgICBhcmdzID0gWydkaWZmJywgJy0tY29sb3I9bmV2ZXInLCByZXBvLmJyYW5jaCwgbmFtZV1cbiAgICAgIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgLT4gcHJlcEZpbGUoKGRpZmZTdGF0ID8gJycpICsgZGF0YSwgZGlmZkZpbGVQYXRoKVxuICAgICAgLnRoZW4gLT4gc2hvd0ZpbGUgZGlmZkZpbGVQYXRoXG4gICAgICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICAgICAgZGlzcG9zYWJsZSA9IHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+XG4gICAgICAgICAgZnMudW5saW5rIGRpZmZGaWxlUGF0aFxuICAgICAgICAgIGRpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgIGlmIGVyciBpcyBub3RoaW5nVG9TaG93XG4gICAgICAgICAgbm90aWZpZXIuYWRkSW5mbyBlcnJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5vdGlmaWVyLmFkZEVycm9yIGVyclxuIl19
