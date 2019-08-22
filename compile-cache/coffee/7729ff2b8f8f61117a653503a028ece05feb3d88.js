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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSOztFQUNSLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLFdBQUEsR0FBYyxJQUFJOztFQUVsQixxQkFBQSxHQUF3QixTQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtFQUFIOztFQUV4QixZQUFBLEdBQWU7O0VBRWYsY0FBQSxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsS0FBRDtNQUN6QixJQUFHLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQW5CO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxnQkFBUCxFQUF5QixRQUF6QixDQUFSLEVBQTRDO1VBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBNUMsRUFERjtPQUFBLE1BQUE7ZUFHRSxPQUFPLENBQUMsTUFBUixDQUFl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TyxRQUFRLENBQUMsUUFUaEI7SUFEWTtJQVlkLElBQUcsWUFBSDthQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1FBQUEsTUFBQSxFQUFRLElBQVI7T0FBZCxDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsV0FBNUMsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFBLENBQUEsQ0FBTSxDQUFDLElBQVAsQ0FBWSxTQUFBO2VBQUcsV0FBQSxDQUFBO01BQUgsQ0FBWixDQUNBLEVBQUMsS0FBRCxFQURBLENBQ08sU0FBQyxPQUFEO1FBQ0wsNkNBQUcsT0FBTyxDQUFDLFNBQVUsZ0JBQXJCO2lCQUNFLFdBQUEsQ0FBQSxFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFRLENBQUMsT0FBVCxDQUFpQixPQUFqQixFQUhGOztNQURLLENBRFAsRUFIRjs7RUE5QmU7QUFwR2pCIiwic291cmNlc0NvbnRlbnQiOlsiUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuZW1vamkgPSByZXF1aXJlICdub2RlLWVtb2ppJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlKCcuLi9ub3RpZmllcicpXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuR2l0UHVzaCA9IHJlcXVpcmUgJy4vZ2l0LXB1c2gnXG5HaXRQdWxsID0gcmVxdWlyZSAnLi9naXQtcHVsbCdcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG52ZXJib3NlQ29tbWl0c0VuYWJsZWQgPSAtPiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmNvbW1pdHMudmVyYm9zZUNvbW1pdHMnKVxuXG5zY2lzc29yc0xpbmUgPSAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tID44IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSdcblxuZ2V0U3RhZ2VkRmlsZXMgPSAocmVwbykgLT5cbiAgZ2l0LnN0YWdlZEZpbGVzKHJlcG8pLnRoZW4gKGZpbGVzKSAtPlxuICAgIGlmIGZpbGVzLmxlbmd0aCA+PSAxXG4gICAgICBnaXQuY21kKFsnLWMnLCAnY29sb3IudWk9ZmFsc2UnLCAnc3RhdHVzJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgZWxzZVxuICAgICAgUHJvbWlzZS5yZWplY3QgXCJOb3RoaW5nIHRvIGNvbW1pdC5cIlxuXG5nZXRUZW1wbGF0ZSA9IChmaWxlUGF0aCkgLT5cbiAgaWYgZmlsZVBhdGhcbiAgICB0cnlcbiAgICAgIGZzLnJlYWRGaWxlU3luYyhmcy5hYnNvbHV0ZShmaWxlUGF0aC50cmltKCkpKS50b1N0cmluZygpLnRyaW0oKVxuICAgIGNhdGNoIGVcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdXIgY29uZmlndXJlZCBjb21taXQgdGVtcGxhdGUgZmlsZSBjYW4ndCBiZSBmb3VuZC5cIilcbiAgZWxzZVxuICAgICcnXG5cbnByZXBGaWxlID0gKHtzdGF0dXMsIGZpbGVQYXRoLCBkaWZmLCBjb21tZW50Q2hhciwgdGVtcGxhdGV9KSAtPlxuICBpZiBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgICB0ZXh0ID0gY29tbWl0RWRpdG9yLmdldFRleHQoKVxuICAgIGluZGV4T2ZDb21tZW50cyA9IHRleHQuaW5kZXhPZihjb21tZW50Q2hhcilcbiAgICBpZiBpbmRleE9mQ29tbWVudHMgPiAwXG4gICAgICB0ZW1wbGF0ZSA9IHRleHQuc3Vic3RyaW5nKDAsIGluZGV4T2ZDb21tZW50cyAtIDEpXG5cbiAgY3dkID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxzKlxcKC4qXFwpXFxuL2csIFwiXFxuXCIpXG4gIHN0YXR1cyA9IHN0YXR1cy50cmltKCkucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gIGNvbnRlbnQgPVxuICAgIFwiXCJcIiN7dGVtcGxhdGV9XG4gICAgI3tjb21tZW50Q2hhcn0gI3tzY2lzc29yc0xpbmV9XG4gICAgI3tjb21tZW50Q2hhcn0gRG8gbm90IHRvdWNoIHRoZSBsaW5lIGFib3ZlLlxuICAgICN7Y29tbWVudENoYXJ9IEV2ZXJ5dGhpbmcgYmVsb3cgd2lsbCBiZSByZW1vdmVkLlxuICAgICN7Y29tbWVudENoYXJ9IFBsZWFzZSBlbnRlciB0aGUgY29tbWl0IG1lc3NhZ2UgZm9yIHlvdXIgY2hhbmdlcy4gTGluZXMgc3RhcnRpbmdcbiAgICAje2NvbW1lbnRDaGFyfSB3aXRoICcje2NvbW1lbnRDaGFyfScgd2lsbCBiZSBpZ25vcmVkLCBhbmQgYW4gZW1wdHkgbWVzc2FnZSBhYm9ydHMgdGhlIGNvbW1pdC5cbiAgICAje2NvbW1lbnRDaGFyfVxuICAgICN7Y29tbWVudENoYXJ9ICN7c3RhdHVzfVwiXCJcIlxuICBpZiBkaWZmXG4gICAgY29udGVudCArPVxuICAgICAgXCJcIlwiXFxuI3tjb21tZW50Q2hhcn1cbiAgICAgICN7ZGlmZn1cIlwiXCJcbiAgZnMud3JpdGVGaWxlU3luYyBmaWxlUGF0aCwgY29udGVudFxuXG5kZXN0cm95Q29tbWl0RWRpdG9yID0gKGZpbGVQYXRoKSAtPlxuICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5pdGVtRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG5cbnRyaW1GaWxlID0gKGZpbGVQYXRoLCBjb21tZW50Q2hhcikgLT5cbiAgZmluZFNjaXNzb3JzTGluZSA9IChsaW5lKSAtPlxuICAgIGxpbmUuaW5jbHVkZXMoXCIje2NvbW1lbnRDaGFyfSAje3NjaXNzb3JzTGluZX1cIilcblxuICBjd2QgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZnMuYWJzb2x1dGUoZmlsZVBhdGgpKS50b1N0cmluZygpXG4gIHN0YXJ0T2ZDb21tZW50cyA9IGNvbnRlbnQuaW5kZXhPZihjb250ZW50LnNwbGl0KCdcXG4nKS5maW5kKGZpbmRTY2lzc29yc0xpbmUpKVxuICBjb250ZW50ID0gaWYgc3RhcnRPZkNvbW1lbnRzID4gMCB0aGVuIGNvbnRlbnQuc3Vic3RyaW5nKDAsIHN0YXJ0T2ZDb21tZW50cykgZWxzZSBjb250ZW50XG4gIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsIGNvbnRlbnRcblxuY29tbWl0ID0gKHJlcG8sIGZpbGVQYXRoKSAtPlxuICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICBnaXQuY21kKFsnY29tbWl0JywgXCItLWNsZWFudXA9d2hpdGVzcGFjZVwiLCBcIi0tZmlsZT0je2ZpbGVQYXRofVwiXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHsgcmVwb05hbWUsIG1lc3NhZ2U6ICdjb21taXQnLCBvdXRwdXQ6IGVtb2ppLmVtb2ppZnkoZGF0YSl9KVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG4gICAgZ2l0LnJlZnJlc2goKVxuICAuY2F0Y2ggKGRhdGEpIC0+XG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgIG1lc3NhZ2U6ICdjb21taXQnLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZSB9KVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG5cbmNsZWFudXAgPSAoY3VycmVudFBhbmUpIC0+XG4gIGN1cnJlbnRQYW5lLmFjdGl2YXRlKCkgaWYgY3VycmVudFBhbmUuaXNBbGl2ZSgpXG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgY29tbWl0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCk/Lml0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gIGlmIG5vdCBjb21taXRFZGl0b3JcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5zcGxpdFBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlUGF0aFxuICBlbHNlXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGUoKVxuICAgIGVsc2VcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlSXRlbUZvclVSSShmaWxlUGF0aClcbiAgICBQcm9taXNlLnJlc29sdmUoY29tbWl0RWRpdG9yKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7c3RhZ2VDaGFuZ2VzLCBhbmRQdXNofT17fSkgLT5cbiAgZmlsZVBhdGggPSBQYXRoLmpvaW4ocmVwby5nZXRQYXRoKCksICdDT01NSVRfRURJVE1TRycpXG4gIGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gIGNvbW1lbnRDaGFyID0gZ2l0LmdldENvbmZpZyhyZXBvLCAnY29yZS5jb21tZW50Y2hhcicpID8gJyMnXG4gIHRyeVxuICAgIHRlbXBsYXRlID0gZ2V0VGVtcGxhdGUoZ2l0LmdldENvbmZpZyhyZXBvLCAnY29tbWl0LnRlbXBsYXRlJykpXG4gIGNhdGNoIGVcbiAgICBub3RpZmllci5hZGRFcnJvcihlLm1lc3NhZ2UpXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUubWVzc2FnZSlcblxuICBpbml0ID0gLT4gZ2V0U3RhZ2VkRmlsZXMocmVwbykudGhlbiAoc3RhdHVzKSAtPlxuICAgIGlmIHZlcmJvc2VDb21taXRzRW5hYmxlZCgpXG4gICAgICBhcmdzID0gWydkaWZmJywgJy0tY29sb3I9bmV2ZXInLCAnLS1zdGFnZWQnXVxuICAgICAgYXJncy5wdXNoICctLXdvcmQtZGlmZicgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5kaWZmcy53b3JkRGlmZicpXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGlmZikgLT4gcHJlcEZpbGUge3N0YXR1cywgZmlsZVBhdGgsIGRpZmYsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX1cbiAgICBlbHNlXG4gICAgICBwcmVwRmlsZSB7c3RhdHVzLCBmaWxlUGF0aCwgY29tbWVudENoYXIsIHRlbXBsYXRlfVxuICBzdGFydENvbW1pdCA9IC0+XG4gICAgc2hvd0ZpbGUgZmlsZVBhdGhcbiAgICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICAgIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWRTYXZlIC0+XG4gICAgICAgIHRyaW1GaWxlKGZpbGVQYXRoLCBjb21tZW50Q2hhcilcbiAgICAgICAgY29tbWl0KHJlcG8sIGZpbGVQYXRoKVxuICAgICAgICAudGhlbiAtPiBHaXRQdXNoKHJlcG8pIGlmIGFuZFB1c2hcbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBjbGVhbnVwKGN1cnJlbnRQYW5lKVxuICAgIC5jYXRjaChub3RpZmllci5hZGRFcnJvcilcblxuICBpZiBzdGFnZUNoYW5nZXNcbiAgICBnaXQuYWRkKHJlcG8sIHVwZGF0ZTogdHJ1ZSkudGhlbihpbml0KS50aGVuKHN0YXJ0Q29tbWl0KVxuICBlbHNlXG4gICAgaW5pdCgpLnRoZW4gLT4gc3RhcnRDb21taXQoKVxuICAgIC5jYXRjaCAobWVzc2FnZSkgLT5cbiAgICAgIGlmIG1lc3NhZ2UuaW5jbHVkZXM/KCdDUkxGJylcbiAgICAgICAgc3RhcnRDb21taXQoKVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2VcbiJdfQ==
