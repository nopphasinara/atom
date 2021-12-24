(function() {
  var ActivityLogger, CompositeDisposable, GitPull, GitPush, Path, Repository, cleanup, commit, destroyCommitEditor, disposables, emoji, fs, getStagedFiles, getTemplate, git, notifier, prepFile, scissorsLine, showFile, trimFile, verboseCommitsEnabled;

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  emoji = require('node-emoji');

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.commits.verboseCommits');
  };

  scissorsLine = '------------------------ >8 ------------------------';

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['-c', 'color.ui=false', 'status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(filePath) {
    var e;
    if (filePath) {
      try {
        return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
      } catch (error) {
        e = error;
        throw new Error("Your configured commit template file can't be found.");
      }
    } else {
      return '';
    }
  };

  prepFile = function(arg) {
    var commentChar, commitEditor, content, cwd, diff, filePath, indexOfComments, ref, status, template, text;
    status = arg.status, filePath = arg.filePath, diff = arg.diff, commentChar = arg.commentChar, template = arg.template;
    if (commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0) {
      text = commitEditor.getText();
      indexOfComments = text.indexOf(commentChar);
      if (indexOfComments > 0) {
        template = text.substring(0, indexOfComments - 1);
      }
    }
    cwd = Path.dirname(filePath);
    status = status.replace(/\s*\(.*\)\n/g, "\n");
    status = status.trim().replace(/\n/g, "\n" + commentChar + " ");
    content = template + "\n" + commentChar + " " + scissorsLine + "\n" + commentChar + " Do not touch the line above.\n" + commentChar + " Everything below will be removed.\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status;
    if (diff) {
      content += "\n" + commentChar + "\n" + diff;
    }
    return fs.writeFileSync(filePath, content);
  };

  destroyCommitEditor = function(filePath) {
    var ref;
    return (ref = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref.destroy() : void 0;
  };

  trimFile = function(filePath, commentChar) {
    var content, cwd, findScissorsLine, startOfComments;
    findScissorsLine = function(line) {
      return line.includes(commentChar + " " + scissorsLine);
    };
    cwd = Path.dirname(filePath);
    content = fs.readFileSync(fs.absolute(filePath)).toString();
    startOfComments = content.indexOf(content.split('\n').find(findScissorsLine));
    content = startOfComments > 0 ? content.substring(0, startOfComments) : content;
    return fs.writeFileSync(filePath, content);
  };

  commit = function(repo, filePath) {
    var repoName;
    repoName = new Repository(repo).getName();
    return git.cmd(['commit', "--cleanup=whitespace", "--file=" + filePath], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      ActivityLogger.record({
        repoName: repoName,
        message: 'commit',
        output: emoji.emojify(data)
      });
      destroyCommitEditor(filePath);
      return git.refresh();
    })["catch"](function(data) {
      ActivityLogger.record({
        repoName: repoName,
        message: 'commit',
        output: data,
        failed: true
      });
      return destroyCommitEditor(filePath);
    });
  };

  cleanup = function(currentPane) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  module.exports = function(repo, arg) {
    var andPush, commentChar, currentPane, e, filePath, init, ref, ref1, stageChanges, startCommit, template;
    ref = arg != null ? arg : {}, stageChanges = ref.stageChanges, andPush = ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    commentChar = (ref1 = git.getConfig(repo, 'core.commentchar')) != null ? ref1 : '#';
    try {
      template = getTemplate(git.getConfig(repo, 'commit.template'));
    } catch (error) {
      e = error;
      notifier.addError(e.message);
      return Promise.reject(e.message);
    }
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.diffs.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile({
              status: status,
              filePath: filePath,
              diff: diff,
              commentChar: commentChar,
              template: template
            });
          });
        } else {
          return prepFile({
            status: status,
            filePath: filePath,
            commentChar: commentChar,
            template: template
          });
        }
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.dispose();
        disposables = new CompositeDisposable;
        disposables.add(textEditor.onDidSave(function() {
          trimFile(filePath, commentChar);
          return commit(repo, filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane);
        }));
      })["catch"](notifier.addError);
    };
    if (stageChanges) {
      return git.add(repo, {
        update: true
      }).then(init).then(startCommit);
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxLQUFBLEdBQVEsT0FBQSxDQUFRLFlBQVI7O0VBQ1IsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDVixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsV0FBQSxHQUFjLElBQUk7O0VBRWxCLHFCQUFBLEdBQXdCLFNBQUE7V0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO0VBQUg7O0VBRXhCLFlBQUEsR0FBZTs7RUFFZixjQUFBLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxLQUFEO01BQ3pCLElBQUcsS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBbkI7ZUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLGdCQUFQLEVBQXlCLFFBQXpCLENBQVIsRUFBNEM7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUE1QyxFQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxN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RUFUQSxDQVNPLFFBQVEsQ0FBQyxRQVRoQjtJQURZO0lBWWQsSUFBRyxZQUFIO2FBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxNQUFBLEVBQVEsSUFBUjtPQUFkLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxXQUE1QyxFQURGO0tBQUEsTUFBQTthQUdFLElBQUEsQ0FBQSxDQUFNLENBQUMsSUFBUCxDQUFZLFNBQUE7ZUFBRyxXQUFBLENBQUE7TUFBSCxDQUFaLENBQ0EsRUFBQyxLQUFELEVBREEsQ0FDTyxTQUFDLE9BQUQ7UUFDTCw2Q0FBRyxPQUFPLENBQUMsU0FBVSxnQkFBckI7aUJBQ0UsV0FBQSxDQUFBLEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBSEY7O01BREssQ0FEUCxFQUhGOztFQTlCZTtBQXBHakIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXRoID0gcmVxdWlyZSAncGF0aCdcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5lbW9qaSA9IHJlcXVpcmUgJ25vZGUtZW1vamknXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUoJy4uL25vdGlmaWVyJylcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5HaXRQdXNoID0gcmVxdWlyZSAnLi9naXQtcHVzaCdcbkdpdFB1bGwgPSByZXF1aXJlICcuL2dpdC1wdWxsJ1xuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbnZlcmJvc2VDb21taXRzRW5hYmxlZCA9IC0+IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuY29tbWl0cy52ZXJib3NlQ29tbWl0cycpXG5cbnNjaXNzb3JzTGluZSA9ICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gPjggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJ1xuXG5nZXRTdGFnZWRGaWxlcyA9IChyZXBvKSAtPlxuICBnaXQuc3RhZ2VkRmlsZXMocmVwbykudGhlbiAoZmlsZXMpIC0+XG4gICAgaWYgZmlsZXMubGVuZ3RoID49IDFcbiAgICAgIGdpdC5jbWQoWyctYycsICdjb2xvci51aT1mYWxzZScsICdzdGF0dXMnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICBlbHNlXG4gICAgICBQcm9taXNlLnJlamVjdCBcIk5vdGhpbmcgdG8gY29tbWl0LlwiXG5cbmdldFRlbXBsYXRlID0gKGZpbGVQYXRoKSAtPlxuICBpZiBmaWxlUGF0aFxuICAgIHRyeVxuICAgICAgZnMucmVhZEZpbGVTeW5jKGZzLmFic29sdXRlKGZpbGVQYXRoLnRyaW0oKSkpLnRvU3RyaW5nKCkudHJpbSgpXG4gICAgY2F0Y2ggZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91ciBjb25maWd1cmVkIGNvbW1pdCB0ZW1wbGF0ZSBmaWxlIGNhbid0IGJlIGZvdW5kLlwiKVxuICBlbHNlXG4gICAgJydcblxucHJlcEZpbGUgPSAoe3N0YXR1cywgZmlsZVBhdGgsIGRpZmYsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX0pIC0+XG4gIGlmIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIHRleHQgPSBjb21taXRFZGl0b3IuZ2V0VGV4dCgpXG4gICAgaW5kZXhPZkNvbW1lbnRzID0gdGV4dC5pbmRleE9mKGNvbW1lbnRDaGFyKVxuICAgIGlmIGluZGV4T2ZDb21tZW50cyA+IDBcbiAgICAgIHRlbXBsYXRlID0gdGV4dC5zdWJzdHJpbmcoMCwgaW5kZXhPZkNvbW1lbnRzIC0gMSlcblxuICBjd2QgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXHMqXFwoLipcXClcXG4vZywgXCJcXG5cIilcbiAgc3RhdHVzID0gc3RhdHVzLnRyaW0oKS5yZXBsYWNlKC9cXG4vZywgXCJcXG4je2NvbW1lbnRDaGFyfSBcIilcbiAgY29udGVudCA9XG4gICAgXCJcIlwiI3t0ZW1wbGF0ZX1cbiAgICAje2NvbW1lbnRDaGFyfSAje3NjaXNzb3JzTGluZX1cbiAgICAje2NvbW1lbnRDaGFyfSBEbyBub3QgdG91Y2ggdGhlIGxpbmUgYWJvdmUuXG4gICAgI3tjb21tZW50Q2hhcn0gRXZlcnl0aGluZyBiZWxvdyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICN7Y29tbWVudENoYXJ9IHdpdGggJyN7Y29tbWVudENoYXJ9JyB3aWxsIGJlIGlnbm9yZWQsIGFuZCBhbiBlbXB0eSBtZXNzYWdlIGFib3J0cyB0aGUgY29tbWl0LlxuICAgICN7Y29tbWVudENoYXJ9XG4gICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG4gIGlmIGRpZmZcbiAgICBjb250ZW50ICs9XG4gICAgICBcIlwiXCJcXG4je2NvbW1lbnRDaGFyfVxuICAgICAgI3tkaWZmfVwiXCJcIlxuICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLCBjb250ZW50XG5cbmRlc3Ryb3lDb21taXRFZGl0b3IgPSAoZmlsZVBhdGgpIC0+XG4gIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLml0ZW1Gb3JVUkkoZmlsZVBhdGgpPy5kZXN0cm95KClcblxudHJpbUZpbGUgPSAoZmlsZVBhdGgsIGNvbW1lbnRDaGFyKSAtPlxuICBmaW5kU2Npc3NvcnNMaW5lID0gKGxpbmUpIC0+XG4gICAgbGluZS5pbmNsdWRlcyhcIiN7Y29tbWVudENoYXJ9ICN7c2Npc3NvcnNMaW5lfVwiKVxuXG4gIGN3ZCA9IFBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmcy5hYnNvbHV0ZShmaWxlUGF0aCkpLnRvU3RyaW5nKClcbiAgc3RhcnRPZkNvbW1lbnRzID0gY29udGVudC5pbmRleE9mKGNvbnRlbnQuc3BsaXQoJ1xcbicpLmZpbmQoZmluZFNjaXNzb3JzTGluZSkpXG4gIGNvbnRlbnQgPSBpZiBzdGFydE9mQ29tbWVudHMgPiAwIHRoZW4gY29udGVudC5zdWJzdHJpbmcoMCwgc3RhcnRPZkNvbW1lbnRzKSBlbHNlIGNvbnRlbnRcbiAgZnMud3JpdGVGaWxlU3luYyBmaWxlUGF0aCwgY29udGVudFxuXG5jb21taXQgPSAocmVwbywgZmlsZVBhdGgpIC0+XG4gIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gIGdpdC5jbWQoWydjb21taXQnLCBcIi0tY2xlYW51cD13aGl0ZXNwYWNlXCIsIFwiLS1maWxlPSN7ZmlsZVBhdGh9XCJdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoeyByZXBvTmFtZSwgbWVzc2FnZTogJ2NvbW1pdCcsIG91dHB1dDogZW1vamkuZW1vamlmeShkYXRhKX0pXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcbiAgICBnaXQucmVmcmVzaCgpXG4gIC5jYXRjaCAoZGF0YSkgLT5cbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCAgbWVzc2FnZTogJ2NvbW1pdCcsIG91dHB1dDogZGF0YSwgZmFpbGVkOiB0cnVlIH0pXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcblxuY2xlYW51cCA9IChjdXJyZW50UGFuZSkgLT5cbiAgY3VycmVudFBhbmUuYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFuZS5pc0FsaXZlKClcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgaWYgbm90IGNvbW1pdEVkaXRvclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoXG4gIGVsc2VcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGVJdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIFByb21pc2UucmVzb2x2ZShjb21taXRFZGl0b3IpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtzdGFnZUNoYW5nZXMsIGFuZFB1c2h9PXt9KSAtPlxuICBmaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgJ0NPTU1JVF9FRElUTVNHJylcbiAgY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgY29tbWVudENoYXIgPSBnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb3JlLmNvbW1lbnRjaGFyJykgPyAnIydcbiAgdHJ5XG4gICAgdGVtcGxhdGUgPSBnZXRUZW1wbGF0ZShnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb21taXQudGVtcGxhdGUnKSlcbiAgY2F0Y2ggZVxuICAgIG5vdGlmaWVyLmFkZEVycm9yKGUubWVzc2FnZSlcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKVxuXG4gIGluaXQgPSAtPiBnZXRTdGFnZWRGaWxlcyhyZXBvKS50aGVuIChzdGF0dXMpIC0+XG4gICAgaWYgdmVyYm9zZUNvbW1pdHNFbmFibGVkKClcbiAgICAgIGFyZ3MgPSBbJ2RpZmYnLCAnLS1jb2xvcj1uZXZlcicsICctLXN0YWdlZCddXG4gICAgICBhcmdzLnB1c2ggJy0td29yZC1kaWZmJyBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJylcbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkaWZmKSAtPiBwcmVwRmlsZSB7c3RhdHVzLCBmaWxlUGF0aCwgZGlmZiwgY29tbWVudENoYXIsIHRlbXBsYXRlfVxuICAgIGVsc2VcbiAgICAgIHByZXBGaWxlIHtzdGF0dXMsIGZpbGVQYXRoLCBjb21tZW50Q2hhciwgdGVtcGxhdGV9XG4gIHN0YXJ0Q29tbWl0ID0gLT5cbiAgICBzaG93RmlsZSBmaWxlUGF0aFxuICAgIC50aGVuICh0ZXh0RWRpdG9yKSAtPlxuICAgICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZFNhdmUgLT5cbiAgICAgICAgdHJpbUZpbGUoZmlsZVBhdGgsIGNvbW1lbnRDaGFyKVxuICAgICAgICBjb21taXQocmVwbywgZmlsZVBhdGgpXG4gICAgICAgIC50aGVuIC0+IEdpdFB1c2gocmVwbykgaWYgYW5kUHVzaFxuICAgICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGNsZWFudXAoY3VycmVudFBhbmUpXG4gICAgLmNhdGNoKG5vdGlmaWVyLmFkZEVycm9yKVxuXG4gIGlmIHN0YWdlQ2hhbmdlc1xuICAgIGdpdC5hZGQocmVwbywgdXBkYXRlOiB0cnVlKS50aGVuKGluaXQpLnRoZW4oc3RhcnRDb21taXQpXG4gIGVsc2VcbiAgICBpbml0KCkudGhlbiAtPiBzdGFydENvbW1pdCgpXG4gICAgLmNhdGNoIChtZXNzYWdlKSAtPlxuICAgICAgaWYgbWVzc2FnZS5pbmNsdWRlcz8oJ0NSTEYnKVxuICAgICAgICBzdGFydENvbW1pdCgpXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZVxuIl19
