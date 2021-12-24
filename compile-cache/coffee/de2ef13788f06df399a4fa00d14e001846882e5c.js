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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsWUFBQSxHQUFlLE9BQUEsQ0FBUSw0QkFBUjs7RUFFZixhQUFBLEdBQWdCOztFQUVoQixXQUFBLEdBQWMsSUFBSTs7RUFFbEIsUUFBQSxHQUFXLFNBQUMsUUFBRDtBQUNULFFBQUE7SUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBSDtNQUNFLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQjtNQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBQSxDQUEwQixDQUFDLGFBQTNCLENBQUEsQ0FBMkMsQ0FBQSxPQUFBLEdBQVEsY0FBUixDQUEzQyxDQUFBLEVBRkY7O1dBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCO0VBSlM7O0VBTVgsUUFBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLFFBQVA7V0FDVCxJQUFJLE9BQUosQ0FBWSxTQUFDLE9BQUQsRUFBVSxNQUFWO01BQ1Ysb0JBQUcsSUFBSSxDQUFFLGdCQUFOLEtBQWdCLENBQW5CO2VBQ0UsTUFBQSxDQUFPLGFBQVAsRUFERjtPQUFBLE1BQUE7ZUFHRSxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsRUFBdUIs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cmUgJ2F0b20nXG5PcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5SZXZpc2lvblZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9naXQtcmV2aXNpb24tdmlldydcblxubm90aGluZ1RvU2hvdyA9ICdOb3RoaW5nIHRvIHNob3cuJ1xuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuc3BsaXRQYW5lJylcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblxucHJlcEZpbGUgPSAodGV4dCwgZmlsZVBhdGgpIC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgaWYgdGV4dD8ubGVuZ3RoIGlzIDBcbiAgICAgIHJlamVjdCBub3RoaW5nVG9TaG93XG4gICAgZWxzZVxuICAgICAgZnMud3JpdGVGaWxlIGZpbGVQYXRoLCB0ZXh0LCBmbGFnOiAndysnLCAoZXJyKSAtPlxuICAgICAgICBpZiBlcnIgdGhlbiByZWplY3QgZXJyIGVsc2UgcmVzb2x2ZSB0cnVlXG5cbnNwbGl0RGlmZiA9IChyZXBvLCBwYXRoVG9GaWxlKSAtPlxuICBhdG9tLndvcmtzcGFjZS5vcGVuKFBhdGguam9pbihyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSxwYXRoVG9GaWxlKSwge1xuICAgIHNwbGl0OiAnbGVmdCcsXG4gICAgYWN0aXZhdGVQYW5lOiBmYWxzZSxcbiAgICBhY3RpdmF0ZUl0ZW06IHRydWUsXG4gICAgc2VhcmNoQWxsUGFuZXM6IGZhbHNlXG4gIH0pLnRoZW4gKGVkaXRvcikgLT4gUmV2aXNpb25WaWV3LnNob3dSZXZpc2lvbihyZXBvLCBlZGl0b3IsIHJlcG8uYnJhbmNoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7ZGlmZlN0YXQsIGZpbGV9PXt9KSAtPlxuICBmaWxlID89IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgaWYgZmlsZSBhbmQgZmlsZSBpc250ICcuJyBhbmQgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5kaWZmcy51c2VTcGxpdERpZmYnKVxuICAgIHNwbGl0RGlmZihyZXBvLCBmaWxlKVxuICBlbHNlXG4gICAgZGlmZkZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCBcImF0b21fZ2l0X3BsdXMuZGlmZlwiKVxuICAgIGlmIG5vdCBmaWxlXG4gICAgICByZXR1cm4gbm90aWZpZXIuYWRkRXJyb3IgXCJObyBvcGVuIGZpbGUuIFNlbGVjdCAnRGlmZiBBbGwnLlwiXG4gICAgYXJncyA9IFsnZGlmZicsICctLWNvbG9yPW5ldmVyJ11cbiAgICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYnXG4gICAgYXJncy5wdXNoICctLXdvcmQtZGlmZicgaWYgYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5kaWZmcy53b3JkRGlmZidcbiAgICBhcmdzLnB1c2ggZmlsZSB1bmxlc3MgZGlmZlN0YXRcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IHByZXBGaWxlKChkaWZmU3RhdCA/ICcnKSArIGRhdGEsIGRpZmZGaWxlUGF0aClcbiAgICAudGhlbiAtPiBzaG93RmlsZSBkaWZmRmlsZVBhdGhcbiAgICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBmcy51bmxpbmsgZGlmZkZpbGVQYXRoXG4gICAgLmNhdGNoIChlcnIpIC0+XG4gICAgICBpZiBlcnIgaXMgbm90aGluZ1RvU2hvd1xuICAgICAgICBub3RpZmllci5hZGRJbmZvIGVyclxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJcbiJdfQ==
