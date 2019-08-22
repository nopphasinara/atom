(function() {
  var $, BufferedProcess, CompositeDisposable, GitRevisionView, SplitDiff, SyncScroll, _, disposables, fs, path, ref;

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  ref = require("atom"), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  disposables = new CompositeDisposable;

  SplitDiff = null;

  SyncScroll = null;

  module.exports = GitRevisionView = (function() {
    function GitRevisionView() {}

    GitRevisionView.fileContentA = "";

    GitRevisionView.fileContentB = "";

    GitRevisionView.showRevision = function(revA, filePathA, revB, filePathB) {
      var error, self;
      if (!SplitDiff) {
        try {
          SplitDiff = require(atom.packages.resolvePackagePath('split-diff'));
          SyncScroll = require(atom.packages.resolvePackagePath('split-diff') + '/lib/sync-scroll');
          atom.themes.requireStylesheet(atom.packages.resolvePackagePath('split-diff') + '/styles/split-diff');
        } catch (error1) {
          error = error1;
          return atom.notifications.addInfo("Git Plus: Could not load 'split-diff' package to open diff view. Please install it `apm install split-diff`.");
        }
      }
      SplitDiff.disable(false);
      self = this;
      self.fileContentA = "";
      self.fileContentB = "";
      return self._getRepo(filePathA).then(function(repo) {
        var cwd;
        if (!repo) {
          cwd = atom.project.getPaths()[0];
        } else {
          cwd = repo.getWorkingDirectory();
        }
        return self._loadfileContentA(cwd, revA, filePathA, revB, filePathB);
      });
    };

    GitRevisionView._loadfileContentA = function(cwd, revA, filePathA, revB, filePathB) {
      var exit, process, self, showArgs, stderr, stdout;
      self = this;
      stdout = function(output) {
        return self.fileContentA += output;
      };
      stderr = function(error) {
        return console.error("git-split-diff-hyperclick:ERROR:", error);
      };
      exit = (function(_this) {
        return function(code) {
          var outputFilePath;
          if (code === 0) {
            outputFilePath = _this._getFilePath(revA, filePathA);
            return fs.writeFile(outputFilePath, self.fileContentA, function(error) {
              var promise;
              if (!error) {
                promise = atom.workspace.open(outputFilePath, {
                  split: "up",
                  activatePane: true,
                  activateItem: true,
                  searchAllPanes: false
                });
                return promise.then(function(editorA) {
                  editorA.setSoftWrapped(false);
                  self._loadfileContentB(cwd, editorA, revA, filePathA, revB, filePathB);
                  try {
                    return disposables.add(editorA.onDidDestroy(function() {
                      return fs.unlink(outputFilePath);
                    }));
                  } catch (error1) {
                    error = error1;
                    return atom.notifications.addError("Could not remove file " + outputFilePath);
                  }
                });
              }
            });
          } else {
            return atom.notifications.addError("Could not retrieve revision for " + (path.basename(filePathA)) + " (" + code + ")");
          }
        };
      })(this);
      showArgs = ["cat-file", "-p", "" + revA];
      return process = new BufferedProcess({
        command: "git",
        args: showArgs,
        options: {
          cwd: cwd
        },
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    GitRevisionView._loadfileContentB = function(cwd, editorA, revA, filePathA, revB, filePathB) {
      var exit, process, self, showArgs, stderr, stdout;
      self = this;
      stdout = function(output) {
        return self.fileContentB += output;
      };
      stderr = function(error) {
        return console.error("git-split-diff-hyperclick:ERROR:", error);
      };
      exit = (function(_this) {
        return function(code) {
          if (code === 0) {
            return _this._showRevision(editorA, revA, filePathA, revB, filePathB, self.fileContentB);
          } else {
            return atom.notifications.addError("Could not retrieve revision for " + (path.basename(filePathB)) + " (" + code + ")");
          }
        };
      })(this);
      showArgs = ["cat-file", "-p", "" + revB];
      return process = new BufferedProcess({
        command: "git",
        args: showArgs,
        options: {
          cwd: cwd
        },
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    GitRevisionView._getFilePath = function(rev, filePath) {
      var outputDir;
      outputDir = (atom.getConfigDirPath()) + "/git-split-diff-hyperclick";
      if (!fs.existsSync(outputDir)) {
        fs.mkdir(outputDir);
      }
      return outputDir + "/" + rev + "#" + (path.basename(filePath));
    };

    GitRevisionView._showRevision = function(editorA, revA, filePathA, revB, filePathB, fileContentB) {
      var outputFilePath;
      outputFilePath = this._getFilePath(revB, filePathB);
      return fs.writeFile(outputFilePath, fileContentB, (function(_this) {
        return function(error) {
          var promise;
          if (!error) {
            promise = atom.workspace.open(outputFilePath, {
              split: "right",
              activatePane: true,
              activateItem: true,
              searchAllPanes: false
            });
            return promise.then(function(editorB) {
              editorB.setSoftWrapped(false);
              _this._splitDiff(editorA, editorB);
              try {
                disposables.add(editorB.onDidDestroy(function() {
                  return fs.unlink(outputFilePath);
                }));
              } catch (error1) {
                error = error1;
                return atom.notifications.addError("Could not remove file " + outputFilePath);
              }
              try {
                disposables.add(editorA.onDidDestroy(function() {
                  return editorB.destroy();
                }));
                return disposables.add(editorB.onDidDestroy(function() {
                  return editorA.destroy();
                }));
              } catch (error1) {
                error = error1;
                return atom.notifications.addError("Could not close diff panels.");
              }
            });
          }
        };
      })(this));
    };

    GitRevisionView._splitDiff = function(editorA, editorB) {
      var editors, syncScroll;
      editors = {
        editor1: editorB,
        editor2: editorA
      };
      SplitDiff._setConfig('diffWords', true);
      SplitDiff._setConfig('ignoreWhitespace', true);
      SplitDiff._setConfig('syncHorizontalScroll', true);
      SplitDiff.diffPanes();
      SplitDiff.updateDiff(editors);
      syncScroll = new SyncScroll(editors.editor1, editors.editor2, true);
      return syncScroll.syncPositions();
    };

    GitRevisionView._getRepo = function(filePath) {
      return new Promise(function(resolve, reject) {
        var directory, project;
        project = atom.project;
        filePath = path.join(atom.project.getPaths()[0], filePath);
        directory = project.getDirectories().filter(function(d) {
          return d.contains(filePath);
        })[0];
        if (directory != null) {
          return project.repositoryForDirectory(directory).then(function(repo) {
            var submodule;
            submodule = repo.repo.submoduleForPath(filePath);
            if (submodule != null) {
              return resolve(submodule);
            } else {
              return resolve(repo);
            }
          })["catch"](function(e) {
            return reject(e);
          });
        } else {
          return reject("no current file");
        }
      });
    };

    return GitRevisionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtc3BsaXQtZGlmZi1oeXBlcmNsaWNrL2xpYi9naXQtcmV2aXNpb24tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxNQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDZDQUFELEVBQXNCOztFQUNyQixJQUFLLE9BQUEsQ0FBUSxzQkFBUjs7RUFFTixXQUFBLEdBQWMsSUFBSTs7RUFDbEIsU0FBQSxHQUFZOztFQUNaLFVBQUEsR0FBYTs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFSixlQUFDLENBQUEsWUFBRCxHQUFnQjs7SUFDaEIsZUFBQyxDQUFBLFlBQUQsR0FBZ0I7O0lBQ2hCLGVBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixJQUFsQixFQUF3QixTQUF4QjtBQUNiLFVBQUE7TUFBQSxJQUFHLENBQUksU0FBUDtBQUNFO1VBQ0UsU0FBQSxHQUFZLE9BQUEsQ0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLFlBQWpDLENBQVI7VUFDWixVQUFBLEdBQWEsT0FBQSxDQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBQSxHQUFpRCxrQkFBekQ7VUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFaLENBQThCLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBQSxHQUFpRCxvQkFBL0UsRUFIRjtTQUFBLGNBQUE7VUFJTTtBQUNKLGlCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsOEdB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SixDQUFZLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbkMsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUM7UUFDZixRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsUUFBdEM7UUFDWCxTQUFBLEdBQVksT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQUF3QixDQUFDLE1BQXpCLENBQWdDLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVg7UUFBUCxDQUFoQyxDQUE2RCxDQUFBLENBQUE7UUFDekUsSUFBRyxpQkFBSDtpQkFDRSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsU0FBL0IsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUFDLElBQUQ7QUFDN0MsZ0JBQUE7WUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBVixDQUEyQixRQUEzQjtZQUNaLElBQUcsaUJBQUg7cUJBQW1CLE9BQUEsQ0FBUSxTQUFSLEVBQW5CO2FBQUEsTUFBQTtxQkFBMkMsT0FBQSxDQUFRLElBQVIsRUFBM0M7O1VBRjZDLENBQS9DLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLENBQUQ7bUJBQ0wsTUFBQSxDQUFPLENBQVA7VUFESyxDQUhQLEVBREY7U0FBQSxNQUFBO2lCQU9FLE1BQUEsQ0FBTyxpQkFBUCxFQVBGOztNQUptQyxDQUFaO0lBQWQ7Ozs7O0FBckliIiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcblxue0NvbXBvc2l0ZURpc3Bvc2FibGUsIEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlIFwiYXRvbVwiXG57JH0gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5TcGxpdERpZmYgPSBudWxsXG5TeW5jU2Nyb2xsID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBHaXRSZXZpc2lvblZpZXdcblxuICBAZmlsZUNvbnRlbnRBID0gXCJcIlxuICBAZmlsZUNvbnRlbnRCID0gXCJcIlxuICBAc2hvd1JldmlzaW9uOiAocmV2QSwgZmlsZVBhdGhBLCByZXZCLCBmaWxlUGF0aEIpIC0+XG4gICAgaWYgbm90IFNwbGl0RGlmZlxuICAgICAgdHJ5XG4gICAgICAgIFNwbGl0RGlmZiA9IHJlcXVpcmUgYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3NwbGl0LWRpZmYnKVxuICAgICAgICBTeW5jU2Nyb2xsID0gcmVxdWlyZSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnc3BsaXQtZGlmZicpICsgJy9saWIvc3luYy1zY3JvbGwnXG4gICAgICAgIGF0b20udGhlbWVzLnJlcXVpcmVTdHlsZXNoZWV0KGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdzcGxpdC1kaWZmJykgKyAnL3N0eWxlcy9zcGxpdC1kaWZmJylcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIkdpdCBQbHVzOiBDb3VsZCBub3QgbG9hZCAnc3BsaXQtZGlmZicgcGFja2FnZSB0byBvcGVuIGRpZmYgdmlldy4gUGxlYXNlIGluc3RhbGwgaXQgYGFwbSBpbnN0YWxsIHNwbGl0LWRpZmZgLlwiKVxuXG4gICAgU3BsaXREaWZmLmRpc2FibGUoZmFsc2UpXG4gICAgc2VsZiA9IEBcbiAgICBzZWxmLmZpbGVDb250ZW50QSA9IFwiXCJcbiAgICBzZWxmLmZpbGVDb250ZW50QiA9IFwiXCJcbiAgICBzZWxmLl9nZXRSZXBvKGZpbGVQYXRoQSkudGhlbiAocmVwbykgLT5cbiAgICAgIGlmIG5vdCByZXBvXG4gICAgICAgIGN3ZCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICBlbHNlXG4gICAgICAgIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gICAgICBzZWxmLl9sb2FkZmlsZUNvbnRlbnRBKGN3ZCwgcmV2QSwgZmlsZVBhdGhBLCByZXZCLCBmaWxlUGF0aEIpXG5cbiAgQF9sb2FkZmlsZUNvbnRlbnRBOiAoY3dkLCByZXZBLCBmaWxlUGF0aEEsIHJldkIsIGZpbGVQYXRoQikgLT5cbiAgICBzZWxmID0gQFxuICAgIHN0ZG91dCA9IChvdXRwdXQpIC0+XG4gICAgICBzZWxmLmZpbGVDb250ZW50QSArPSBvdXRwdXRcbiAgICBzdGRlcnIgPSAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmVycm9yKFwiZ2l0LXNwbGl0LWRpZmYtaHlwZXJjbGljazpFUlJPUjpcIiwgZXJyb3IpXG4gICAgZXhpdCA9IChjb2RlKSA9PlxuICAgICAgaWYgY29kZSBpcyAwXG4gICAgICAgIG91dHB1dEZpbGVQYXRoID0gQF9nZXRGaWxlUGF0aChyZXZBLCBmaWxlUGF0aEEpXG4gICAgICAgIGZzLndyaXRlRmlsZSBvdXRwdXRGaWxlUGF0aCwgc2VsZi5maWxlQ29udGVudEEsIChlcnJvcikgLT5cbiAgICAgICAgICBpZiBub3QgZXJyb3JcbiAgICAgICAgICAgIHByb21pc2UgPSBhdG9tLndvcmtzcGFjZS5vcGVuIG91dHB1dEZpbGVQYXRoLFxuICAgICAgICAgICAgICBzcGxpdDogXCJ1cFwiXG4gICAgICAgICAgICAgIGFjdGl2YXRlUGFuZTogdHJ1ZVxuICAgICAgICAgICAgICBhY3RpdmF0ZUl0ZW06IHRydWVcbiAgICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IGZhbHNlXG4gICAgICAgICAgICBwcm9taXNlLnRoZW4gKGVkaXRvckEpIC0+XG4gICAgICAgICAgICAgIGVkaXRvckEuc2V0U29mdFdyYXBwZWQoZmFsc2UpXG4gICAgICAgICAgICAgIHNlbGYuX2xvYWRmaWxlQ29udGVudEIoY3dkLCBlZGl0b3JBLCByZXZBLCBmaWxlUGF0aEEsIHJldkIsIGZpbGVQYXRoQilcbiAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgZGlzcG9zYWJsZXMuYWRkIGVkaXRvckEub25EaWREZXN0cm95IC0+IGZzLnVubGluayBvdXRwdXRGaWxlUGF0aFxuICAgICAgICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJDb3VsZCBub3QgcmVtb3ZlIGZpbGUgI3tvdXRwdXRGaWxlUGF0aH1cIlxuICAgICAgZWxzZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJDb3VsZCBub3QgcmV0cmlldmUgcmV2aXNpb24gZm9yICN7cGF0aC5iYXNlbmFtZShmaWxlUGF0aEEpfSAoI3tjb2RlfSlcIlxuXG4gICAgc2hvd0FyZ3MgPSBbXCJjYXQtZmlsZVwiLCBcIi1wXCIsIFwiI3tyZXZBfVwiXVxuICAgIHByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcbiAgICAgIGNvbW1hbmQ6IFwiZ2l0XCIsXG4gICAgICBhcmdzOiBzaG93QXJncyxcbiAgICAgIG9wdGlvbnM6IHsgY3dkOmN3ZCB9LFxuICAgICAgc3Rkb3V0LFxuICAgICAgc3RkZXJyLFxuICAgICAgZXhpdFxuICAgIH0pXG5cbiAgQF9sb2FkZmlsZUNvbnRlbnRCOiAoY3dkLCBlZGl0b3JBLCByZXZBLCBmaWxlUGF0aEEsIHJldkIsIGZpbGVQYXRoQikgLT5cbiAgICBzZWxmID0gQFxuICAgIHN0ZG91dCA9IChvdXRwdXQpIC0+XG4gICAgICBzZWxmLmZpbGVDb250ZW50QiArPSBvdXRwdXRcbiAgICBzdGRlcnIgPSAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmVycm9yKFwiZ2l0LXNwbGl0LWRpZmYtaHlwZXJjbGljazpFUlJPUjpcIiwgZXJyb3IpXG4gICAgZXhpdCA9IChjb2RlKSA9PlxuICAgICAgaWYgY29kZSBpcyAwXG4gICAgICAgIEBfc2hvd1JldmlzaW9uKGVkaXRvckEsIHJldkEsIGZpbGVQYXRoQSwgcmV2QiwgZmlsZVBhdGhCLCBzZWxmLmZpbGVDb250ZW50QilcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiQ291bGQgbm90IHJldHJpZXZlIHJldmlzaW9uIGZvciAje3BhdGguYmFzZW5hbWUoZmlsZVBhdGhCKX0gKCN7Y29kZX0pXCJcblxuICAgIHNob3dBcmdzID0gW1wiY2F0LWZpbGVcIiwgXCItcFwiLCBcIiN7cmV2Qn1cIl1cbiAgICBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgICBjb21tYW5kOiBcImdpdFwiLFxuICAgICAgYXJnczogc2hvd0FyZ3MsXG4gICAgICBvcHRpb25zOiB7IGN3ZDpjd2QgfSxcbiAgICAgIHN0ZG91dCxcbiAgICAgIHN0ZGVycixcbiAgICAgIGV4aXRcbiAgICB9KVxuXG4gIEBfZ2V0RmlsZVBhdGg6IChyZXYsIGZpbGVQYXRoKSAtPlxuICAgIG91dHB1dERpciA9IFwiI3thdG9tLmdldENvbmZpZ0RpclBhdGgoKX0vZ2l0LXNwbGl0LWRpZmYtaHlwZXJjbGlja1wiXG4gICAgZnMubWtkaXIgb3V0cHV0RGlyIGlmIG5vdCBmcy5leGlzdHNTeW5jIG91dHB1dERpclxuICAgIHJldHVybiBcIiN7b3V0cHV0RGlyfS8je3Jldn0jI3twYXRoLmJhc2VuYW1lKGZpbGVQYXRoKX1cIlxuXG4gIEBfc2hvd1JldmlzaW9uOiAoZWRpdG9yQSwgcmV2QSwgZmlsZVBhdGhBLCByZXZCLCBmaWxlUGF0aEIsIGZpbGVDb250ZW50QikgLT5cbiAgICBvdXRwdXRGaWxlUGF0aCA9IEBfZ2V0RmlsZVBhdGgocmV2QiwgZmlsZVBhdGhCKVxuICAgIGZzLndyaXRlRmlsZSBvdXRwdXRGaWxlUGF0aCwgZmlsZUNvbnRlbnRCLCAoZXJyb3IpID0+XG4gICAgICBpZiBub3QgZXJyb3JcbiAgICAgICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4gb3V0cHV0RmlsZVBhdGgsXG4gICAgICAgICAgc3BsaXQ6IFwicmlnaHRcIlxuICAgICAgICAgIGFjdGl2YXRlUGFuZTogdHJ1ZVxuICAgICAgICAgIGFjdGl2YXRlSXRlbTogdHJ1ZVxuICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiBmYWxzZVxuICAgICAgICBwcm9taXNlLnRoZW4gKGVkaXRvckIpID0+XG4gICAgICAgICAgZWRpdG9yQi5zZXRTb2Z0V3JhcHBlZChmYWxzZSlcbiAgICAgICAgICBAX3NwbGl0RGlmZihlZGl0b3JBLCBlZGl0b3JCKVxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgZGlzcG9zYWJsZXMuYWRkIGVkaXRvckIub25EaWREZXN0cm95IC0+IGZzLnVubGluayBvdXRwdXRGaWxlUGF0aFxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiQ291bGQgbm90IHJlbW92ZSBmaWxlICN7b3V0cHV0RmlsZVBhdGh9XCJcbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIGRpc3Bvc2FibGVzLmFkZCBlZGl0b3JBLm9uRGlkRGVzdHJveSAtPiBlZGl0b3JCLmRlc3Ryb3koKVxuICAgICAgICAgICAgZGlzcG9zYWJsZXMuYWRkIGVkaXRvckIub25EaWREZXN0cm95IC0+IGVkaXRvckEuZGVzdHJveSgpXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJDb3VsZCBub3QgY2xvc2UgZGlmZiBwYW5lbHMuXCJcblxuICBAX3NwbGl0RGlmZjogKGVkaXRvckEsIGVkaXRvckIpIC0+XG4gICAgZWRpdG9ycyA9XG4gICAgICBlZGl0b3IxOiBlZGl0b3JCICAgICMgdGhlIG9sZGVyIHJldmlzaW9uXG4gICAgICBlZGl0b3IyOiBlZGl0b3JBICAgICAgICAgICAjIGN1cnJlbnQgcmV2XG4gICAgU3BsaXREaWZmLl9zZXRDb25maWcgJ2RpZmZXb3JkcycsIHRydWVcbiAgICBTcGxpdERpZmYuX3NldENvbmZpZyAnaWdub3JlV2hpdGVzcGFjZScsIHRydWVcbiAgICBTcGxpdERpZmYuX3NldENvbmZpZyAnc3luY0hvcml6b250YWxTY3JvbGwnLCB0cnVlXG4gICAgU3BsaXREaWZmLmRpZmZQYW5lcygpXG4gICAgU3BsaXREaWZmLnVwZGF0ZURpZmYoZWRpdG9ycylcbiAgICBzeW5jU2Nyb2xsID0gbmV3IFN5bmNTY3JvbGwoZWRpdG9ycy5lZGl0b3IxLCBlZGl0b3JzLmVkaXRvcjIsIHRydWUpXG4gICAgc3luY1Njcm9sbC5zeW5jUG9zaXRpb25zKClcblxuICBAX2dldFJlcG86IChmaWxlUGF0aCkgLT4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBwcm9qZWN0ID0gYXRvbS5wcm9qZWN0XG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sIGZpbGVQYXRoKVxuICAgIGRpcmVjdG9yeSA9IHByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5maWx0ZXIoKGQpIC0+IGQuY29udGFpbnMoZmlsZVBhdGgpKVswXVxuICAgIGlmIGRpcmVjdG9yeT9cbiAgICAgIHByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShkaXJlY3RvcnkpLnRoZW4gKHJlcG8pIC0+XG4gICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8ucmVwby5zdWJtb2R1bGVGb3JQYXRoKGZpbGVQYXRoKVxuICAgICAgICBpZiBzdWJtb2R1bGU/IHRoZW4gcmVzb2x2ZShzdWJtb2R1bGUpIGVsc2UgcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZWplY3QoZSlcbiAgICBlbHNlXG4gICAgICByZWplY3QgXCJubyBjdXJyZW50IGZpbGVcIlxuIl19
