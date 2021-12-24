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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYtYnJhbmNoZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLGFBQUEsR0FBZ0I7O0VBRWhCLFFBQUEsR0FBVyxTQUFDLFFBQUQ7QUFDVCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUg7TUFDRSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7TUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQUEsQ0FBMEIsQ0FBQyxhQUEzQixDQUFBLENBQTJDLENBQUEsT0FBQSxHQUFRLGNBQVIsQ0FBM0MsQ0FBQSxFQUZGOztXQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjtFQUpTOztFQU1YLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ1QsSUFBSSxPQUFKLENBQVksU0FBQyxPQUFELEVBQVUsTUFBVjtNQUNWLG9CQUFHLElBQUksQ0FBRSxnQkFBTixLQUFnQixDQUFuQjtlQUNFLE1BQUEsQ0FBTyxhQUFQLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0IsRUFBeUMsU0FBQyxHQUFEO1VBQ3ZDLElBQUcsR0FBSDttQkFBWSxNQUFBLENBQU8sR0FBUCxFQUFaO1dBQUEsTUFBQTttQkFBNEIsT0FBQSxDQUFRLElBQVIsRUFBNUI7O1FBRHVDLENBQXpDLEVBSEY7O0lBRFUsQ0FBWjtFQURTOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFFBQUE7SUFBQSxVQUFBLEdBQWE7V0FDYixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLFlBQVgsQ0FBUixFQUFrQztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWxDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQVUsSUFBSSxjQUFKLENBQW1CLElBQW5CLEVBQXlCLFNBQUMsR0FBRDtBQUN2QyxZQUFBO1FBRHlDLE9BQUQ7UUFDeEMsVUFBQSxHQUFhO1FBQ2IsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsSUFBSSxDQUFDLE1BQXhCLEVBQWdDLElBQWhDO2VBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO0FBQ0osY0FBQTtVQUFBLFFBQUEsR0FBVztVQUNYLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBVixFQUEwQixvQkFBMUI7VUFDZixJQUFBLEdBQU8sQ0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixJQUFJLENBQUMsTUFBL0IsRUFBdUMsSUFBdkM7VUFDUCxJQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQTNCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxhQUFWLEVBQUE7O2lCQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1lBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7V0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDttQkFBVSxRQUFBLENBQVMsb0JBQUMsV0FBVyxFQUFaLENBQUEsR0FBa0IsSUFBM0IsRUFBaUMsWUFBakM7VUFBVixDQUROLENBRUEsQ0FBQyxJQUZELENBRU0sU0FBQTttQkFBRyxRQUFBLENBQVMsWUFBVDtVQUFILENBRk4sQ0FHQSxDQUFDLElBSEQsQ0FHTSxTQUFDLFVBQUQ7bUJBQ0osVUFBQSxHQUFhLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFNBQUE7Y0FDbkMsRUFBRSxDQUFDLE1BQUgsQ0FBVSxZQUFWOzBDQUNBLFVBQVUsQ0FBRSxPQUFaLENBQUE7WUFGbUMsQ0FBeEI7VUFEVCxDQUhOLENBT0EsRUFBQyxLQUFELEVBUEEsQ0FPTyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFDLEdBQUQ7Y0FDTCxJQUFHLEdBQUEsS0FBTyxhQUFWO3VCQUNFLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBREY7ZUFBQSxNQUFBO3VCQUdFLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCLEVBSEY7O1lBREs7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUFA7UUFMSSxDQUROO01BSHVDLENBQXpCO0lBQVYsQ0FETjtFQUZlO0FBdEJqQiIsInNvdXJjZXNDb250ZW50IjpbIlBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvYnJhbmNoLWxpc3Qtdmlldydcblxubm90aGluZ1RvU2hvdyA9ICdOb3RoaW5nIHRvIHNob3cuJ1xuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cbnByZXBGaWxlID0gKHRleHQsIGZpbGVQYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIGlmIHRleHQ/Lmxlbmd0aCBpcyAwXG4gICAgICByZWplY3Qgbm90aGluZ1RvU2hvd1xuICAgIGVsc2VcbiAgICAgIGZzLndyaXRlRmlsZSBmaWxlUGF0aCwgdGV4dCwgZmxhZzogJ3crJywgKGVycikgLT5cbiAgICAgICAgaWYgZXJyIHRoZW4gcmVqZWN0IGVyciBlbHNlIHJlc29sdmUgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBkaXNwb3NhYmxlID0gbnVsbFxuICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBCcmFuY2hMaXN0VmlldyBkYXRhLCAoe25hbWV9KSAtPlxuICAgIGJyYW5jaE5hbWUgPSBuYW1lXG4gICAgYXJncyA9IFsnZGlmZicsICctLXN0YXQnLCByZXBvLmJyYW5jaCwgbmFtZV1cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBkaWZmU3RhdCA9IGRhdGFcbiAgICAgIGRpZmZGaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgXCJhdG9tX2dpdF9wbHVzLmRpZmZcIilcbiAgICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1jb2xvcj1uZXZlcicsIHJlcG8uYnJhbmNoLCBuYW1lXVxuICAgICAgYXJncy5wdXNoICctLXdvcmQtZGlmZicgaWYgYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5kaWZmcy53b3JkRGlmZidcbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkYXRhKSAtPiBwcmVwRmlsZSgoZGlmZlN0YXQgPyAnJykgKyBkYXRhLCBkaWZmRmlsZVBhdGgpXG4gICAgICAudGhlbiAtPiBzaG93RmlsZSBkaWZmRmlsZVBhdGhcbiAgICAgIC50aGVuICh0ZXh0RWRpdG9yKSAtPlxuICAgICAgICBkaXNwb3NhYmxlID0gdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICBmcy51bmxpbmsgZGlmZkZpbGVQYXRoXG4gICAgICAgICAgZGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgaWYgZXJyIGlzIG5vdGhpbmdUb1Nob3dcbiAgICAgICAgICBub3RpZmllci5hZGRJbmZvIGVyclxuICAgICAgICBlbHNlXG4gICAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyXG4iXX0=
