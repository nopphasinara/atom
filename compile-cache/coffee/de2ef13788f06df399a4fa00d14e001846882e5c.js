(function() {
  var CompositeDisposable, Os, Path, RevisionView, disposables, fs, git, nothingToShow, notifier, prepFile, showFile, splitDiff;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  RevisionView = require('../views/git-revision-view');

  nothingToShow = 'Nothing to show.';

  disposables = new CompositeDisposable;

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

  splitDiff = function(repo, pathToFile) {
    return atom.workspace.open(Path.join(repo.getWorkingDirectory(), pathToFile), {
      split: 'left',
      activatePane: false,
      activateItem: true,
      searchAllPanes: false
    }).then(function(editor) {
      return RevisionView.showRevision(repo, editor, repo.branch);
    });
  };

  module.exports = function(repo, arg) {
    var args, diffFilePath, diffStat, file, ref, ref1;
    ref = arg != null ? arg : {}, diffStat = ref.diffStat, file = ref.file;
    if (file == null) {
      file = repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
    }
    if (file && file !== '.' && atom.config.get('git-plus.diffs.useSplitDiff')) {
      return splitDiff(repo, file);
    } else {
      diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
      if (!file) {
        return notifier.addError("No open file. Select 'Diff All'.");
      }
      args = ['diff', '--color=never'];
      if (atom.config.get('git-plus.diffs.includeStagedDiff')) {
        args.push('HEAD');
      }
      if (atom.config.get('git-plus.diffs.wordDiff')) {
        args.push('--word-diff');
      }
      if (!diffStat) {
        args.push(file);
      }
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
      }).then(function() {
        return showFile(diffFilePath);
      }).then(function(textEditor) {
        return disposables.add(textEditor.onDidDestroy(function() {
          return fs.unlink(diffFilePath);
        }));
      })["catch"](function(err) {
        if (err === nothingToShow) {
          return notifier.addInfo(err);
        } else {
          return notifier.addError(err);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLFlBQUEsR0FBZSxPQUFBLENBQVEsNEJBQVI7O0VBRWYsYUFBQSxHQUFnQjs7RUFFaEIsV0FBQSxHQUFjLElBQUk7O0VBRWxCLFFBQUEsR0FBVyxTQUFDLFFBQUQ7QUFDVCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUg7TUFDRSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7TUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQUEsQ0FBMEIsQ0FBQyxhQUEzQixDQUFBLENBQTJDLENBQUEsT0FBQSxHQUFRLGNBQVIsQ0FBM0MsQ0FBQSxFQUZGOztXQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjtFQUpTOztFQU1YLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ1QsSUFBSSxPQUFKLENBQVksU0FBQyxPQUFELEVBQVUsTUFBVjtNQUNWLG9CQUFHLElBQUksQ0FBRSxnQkFBTixLQUFnQixDQUFuQjtlQUNFLE1BQUEsQ0FBTyxhQUFQLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0IsRUFBeUMsU0FBQyxHQUFEO1VBQ3ZDLElBQUcsR0FBSDttQkFBWSxNQUFBLENBQU8sR0FBUCxFQUFaO1dBQUEsTUFBQTttQkFBNEIsT0FBQSxDQUFRLElBQVIsRUFBNUI7O1FBRHVDLENBQXpDLEVBSEY7O0lBRFUsQ0FBWjtFQURTOztFQVFYLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxVQUFQO1dBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBVixFQUFxQyxVQUFyQyxDQUFwQixFQUFzRTtNQUNwRSxLQUFBLEVBQU8sTUFENkQ7TUFFcEUsWUFBQSxFQUFjLEtBRnNEO01BR3BFLFlBQUEsRUFBYyxJQUhzRDtNQUlwRSxjQUFBLEVBQWdCLEtBSm9EO0tBQXRFLENBS0UsQ0FBQyxJQUxILENBS1EsU0FBQyxNQUFEO2FBQVksWUFBWSxDQUFDLFlBQWIsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsRUFBd0MsSUFBSSxDQUFDLE1BQTdDO0lBQVosQ0FMUjtFQURVOztFQVFaLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO3dCQURzQixNQUFpQixJQUFoQix5QkFBVTs7TUFDakMsT0FBUSxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCOztJQUNSLElBQUcsSUFBQSxJQUFTLElBQUEsS0FBVSxHQUFuQixJQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQTlCO2FBQ0UsU0FBQSxDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFERjtLQUFBLE1BQUE7TUFHRSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsb0JBQTFCO01BQ2YsSUFBRyxDQUFJLElBQVA7QUFDRSxlQUFPLFFBQVEsQ0FBQyxRQUFULENBQWtCLGtDQUFsQixFQURUOztNQUVBLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFUO01BQ1AsSUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFwQjtRQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztNQUNBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBM0I7UUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsRUFBQTs7TUFDQSxJQUFBLENBQXNCLFFBQXRCO1FBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEVBQUE7O2FBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQVUsUUFBQSxDQUFTLG9CQUFDLFdBQVcsRUFBWixDQUFBLEdBQWtCLElBQTNCLEVBQWlDLFlBQWpDO01BQVYsQ0FETixDQUVBLENBQUMsSUFGRCxDQUVNLFNBQUE7ZUFBRyxRQUFBLENBQVMsWUFBVDtNQUFILENBRk4sQ0FHQSxDQUFDLElBSEQsQ0FHTSxTQUFDLFVBQUQ7ZUFDSixXQUFXLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsWUFBWCxDQUF3QixTQUFBO2lCQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsWUFBVjtRQUFILENBQXhCLENBQWhCO01BREksQ0FITixDQUtBLEVBQUMsS0FBRCxFQUxBLENBS08sU0FBQyxHQUFEO1FBQ0wsSUFBRyxHQUFBLEtBQU8sYUFBVjtpQkFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFRLENBQUMsUUFBVCxDQUFrQixHQUFsQixFQUhGOztNQURLLENBTFAsRUFWRjs7RUFGZTtBQW5DakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuT3MgPSByZXF1aXJlICdvcydcblBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuUmV2aXNpb25WaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvZ2l0LXJldmlzaW9uLXZpZXcnXG5cbm5vdGhpbmdUb1Nob3cgPSAnTm90aGluZyB0byBzaG93LidcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cbnByZXBGaWxlID0gKHRleHQsIGZpbGVQYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIGlmIHRleHQ/Lmxlbmd0aCBpcyAwXG4gICAgICByZWplY3Qgbm90aGluZ1RvU2hvd1xuICAgIGVsc2VcbiAgICAgIGZzLndyaXRlRmlsZSBmaWxlUGF0aCwgdGV4dCwgZmxhZzogJ3crJywgKGVycikgLT5cbiAgICAgICAgaWYgZXJyIHRoZW4gcmVqZWN0IGVyciBlbHNlIHJlc29sdmUgdHJ1ZVxuXG5zcGxpdERpZmYgPSAocmVwbywgcGF0aFRvRmlsZSkgLT5cbiAgYXRvbS53b3Jrc3BhY2Uub3BlbihQYXRoLmpvaW4ocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkscGF0aFRvRmlsZSksIHtcbiAgICBzcGxpdDogJ2xlZnQnLFxuICAgIGFjdGl2YXRlUGFuZTogZmFsc2UsXG4gICAgYWN0aXZhdGVJdGVtOiB0cnVlLFxuICAgIHNlYXJjaEFsbFBhbmVzOiBmYWxzZVxuICB9KS50aGVuIChlZGl0b3IpIC0+IFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24ocmVwbywgZWRpdG9yLCByZXBvLmJyYW5jaClcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge2RpZmZTdGF0LCBmaWxlfT17fSkgLT5cbiAgZmlsZSA/PSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlmIGZpbGUgYW5kIGZpbGUgaXNudCAnLicgYW5kIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZGlmZnMudXNlU3BsaXREaWZmJylcbiAgICBzcGxpdERpZmYocmVwbywgZmlsZSlcbiAgZWxzZVxuICAgIGRpZmZGaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgXCJhdG9tX2dpdF9wbHVzLmRpZmZcIilcbiAgICBpZiBub3QgZmlsZVxuICAgICAgcmV0dXJuIG5vdGlmaWVyLmFkZEVycm9yIFwiTm8gb3BlbiBmaWxlLiBTZWxlY3QgJ0RpZmYgQWxsJy5cIlxuICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1jb2xvcj1uZXZlciddXG4gICAgYXJncy5wdXNoICdIRUFEJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJ1xuICAgIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnXG4gICAgYXJncy5wdXNoIGZpbGUgdW5sZXNzIGRpZmZTdGF0XG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBwcmVwRmlsZSgoZGlmZlN0YXQgPyAnJykgKyBkYXRhLCBkaWZmRmlsZVBhdGgpXG4gICAgLnRoZW4gLT4gc2hvd0ZpbGUgZGlmZkZpbGVQYXRoXG4gICAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT4gZnMudW5saW5rIGRpZmZGaWxlUGF0aFxuICAgIC5jYXRjaCAoZXJyKSAtPlxuICAgICAgaWYgZXJyIGlzIG5vdGhpbmdUb1Nob3dcbiAgICAgICAgbm90aWZpZXIuYWRkSW5mbyBlcnJcbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyXG4iXX0=
