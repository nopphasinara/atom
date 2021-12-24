(function() {
  var ActivityLogger, CompositeDisposable, Path, Repository, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1).trim()
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(arg) {
      var mode, path;
      mode = arg.mode, path = arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--no-color', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['-c', 'color.ui=false', 'status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(arg) {
      var path;
      path = arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var ref;
      return (ref = p.path, indexOf.call(currentPaths, ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var firstSpliting, message, prevChangedFiles, replacerRegex, statusRegex;
    statusRegex = /\n{2,}((?:(?::\w{6} \w{6}(?: \w{7}\.{3}){2} [ MADRCU?!]\s+.+?\n?))*)$/;
    firstSpliting = statusRegex.exec(prevCommit);
    if (firstSpliting != null) {
      message = prevCommit.substring(0, firstSpliting.index);
      replacerRegex = /^:\w{6} \w{6}(?: \w{7}\.{3}){2} ([ MADRCU?!].+)$/gm;
      prevChangedFiles = (firstSpliting[1].trim().replace(replacerRegex, "$1")).split('\n');
    } else {
      message = prevCommit.trim();
      prevChangedFiles = [];
    }
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(arg) {
    var commentChar, currentChanges, filePath, message, nothingToCommit, prevChangedFiles, replacementText, status, textToReplace;
    commentChar = arg.commentChar, message = arg.message, prevChangedFiles = arg.prevChangedFiles, status = arg.status, filePath = arg.filePath;
    status = cleanupUnstagedText(status);
    status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentChar + " ");
    if (prevChangedFiles.length > 0) {
      nothingToCommit = "nothing to commit, working directory clean";
      currentChanges = "committed:\n" + commentChar;
      textToReplace = null;
      if (status.indexOf(nothingToCommit) > -1) {
        textToReplace = nothingToCommit;
      } else if (status.indexOf(currentChanges) > -1) {
        textToReplace = currentChanges;
      }
      replacementText = "committed:\n" + (prevChangedFiles.map(function(f) {
        return commentChar + "   " + f;
      }).join("\n"));
      status = status.replace(textToReplace, replacementText);
    }
    return fs.writeFileSync(filePath, message + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status);
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

  destroyCommitEditor = function(filePath) {
    var ref;
    return (ref = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref.destroy() : void 0;
  };

  commit = function(repo, filePath) {
    var args, repoName;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    repoName = new Repository(repo).getName();
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      ActivityLogger.record({
        repoName: repoName,
        message: 'commit',
        output: data
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

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
  };

  module.exports = function(repo) {
    var commentChar, currentPane, cwd, filePath, ref;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
    return git.cmd(['whatchanged', '-1', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          commentChar: commentChar,
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(repo, filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC1hbWVuZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNSQUFBO0lBQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUVyQyxXQUFBLEdBQWMsSUFBSTs7RUFFbEIsbUJBQUEsR0FBc0IsU0FBQyxJQUFEO0FBQ3BCLFFBQUE7SUFBQSxJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCOzs7QUFDbkI7V0FBQSxpREFBQTs7cUJBQ0g7VUFBQyxNQUFBLElBQUQ7VUFBTyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWxCOztBQURHOzs7RUFIZTs7RUFNdEIscUJBQUEsR0FBd0IsU0FBQyxJQUFEO1dBQ3RCO01BQUEsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQVg7TUFDQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmLENBQWlCLENBQUMsSUFBbEIsQ0FBQSxDQUROOztFQURzQjs7RUFJeEIsb0JBQUEsR0FBdUIsU0FBQyxLQUFEO1dBQ3JCLEtBQUssQ0FBQyxHQUFOLENBQVUsU0FBQyxHQUFEO0FBQ1Is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ICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbnByZXR0aWZ5U3RhZ2VkRmlsZXMgPSAoZGF0YSkgLT5cbiAgcmV0dXJuIFtdIGlmIGRhdGEgaXMgJydcbiAgZGF0YSA9IGRhdGEuc3BsaXQoL1xcMC8pWy4uLi0xXVxuICBbXSA9IGZvciBtb2RlLCBpIGluIGRhdGEgYnkgMlxuICAgIHttb2RlLCBwYXRoOiBkYXRhW2krMV0gfVxuXG5wcmV0dHlpZnlQcmV2aW91c0ZpbGUgPSAoZGF0YSkgLT5cbiAgbW9kZTogZGF0YVswXVxuICBwYXRoOiBkYXRhLnN1YnN0cmluZygxKS50cmltKClcblxucHJldHRpZnlGaWxlU3RhdHVzZXMgPSAoZmlsZXMpIC0+XG4gIGZpbGVzLm1hcCAoe21vZGUsIHBhdGh9KSAtPlxuICAgIHN3aXRjaCBtb2RlXG4gICAgICB3aGVuICdNJ1xuICAgICAgICBcIm1vZGlmaWVkOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnQSdcbiAgICAgICAgXCJuZXcgZmlsZTogICAje3BhdGh9XCJcbiAgICAgIHdoZW4gJ0QnXG4gICAgICAgIFwiZGVsZXRlZDogICAje3BhdGh9XCJcbiAgICAgIHdoZW4gJ1InXG4gICAgICAgIFwicmVuYW1lZDogICAje3BhdGh9XCJcblxuZ2V0U3RhZ2VkRmlsZXMgPSAocmVwbykgLT5cbiAgZ2l0LnN0YWdlZEZpbGVzKHJlcG8pLnRoZW4gKGZpbGVzKSAtPlxuICAgIGlmIGZpbGVzLmxlbmd0aCA+PSAxXG4gICAgICBhcmdzID0gWydkaWZmLWluZGV4JywgJy0tbm8tY29sb3InLCAnLS1jYWNoZWQnLCAnSEVBRCcsICctLW5hbWUtc3RhdHVzJywgJy16J11cbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkYXRhKSAtPiBwcmV0dGlmeVN0YWdlZEZpbGVzIGRhdGFcbiAgICBlbHNlXG4gICAgICBQcm9taXNlLnJlc29sdmUgW11cblxuZ2V0R2l0U3RhdHVzID0gKHJlcG8pIC0+XG4gIGdpdC5jbWQgWyctYycsICdjb2xvci51aT1mYWxzZScsICdzdGF0dXMnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuXG5kaWZmRmlsZXMgPSAocHJldmlvdXNGaWxlcywgY3VycmVudEZpbGVzKSAtPlxuICBwcmV2aW91c0ZpbGVzID0gcHJldmlvdXNGaWxlcy5tYXAgKHApIC0+IHByZXR0eWlmeVByZXZpb3VzRmlsZSBwXG4gIGN1cnJlbnRQYXRocyA9IGN1cnJlbnRGaWxlcy5tYXAgKHtwYXRofSkgLT4gcGF0aFxuICBwcmV2aW91c0ZpbGVzLmZpbHRlciAocCkgLT4gcC5wYXRoIGluIGN1cnJlbnRQYXRocyBpcyBmYWxzZVxuXG5wYXJzZSA9IChwcmV2Q29tbWl0KSAtPlxuICBzdGF0dXNSZWdleCA9IC9cXG57Mix9KCg/Oig/OjpcXHd7Nn0gXFx3ezZ9KD86IFxcd3s3fVxcLnszfSl7Mn0gWyBNQURSQ1U/IV1cXHMrLis/XFxuPykpKikkL1xuICBmaXJzdFNwbGl0aW5nID0gc3RhdHVzUmVnZXguZXhlYyBwcmV2Q29tbWl0XG5cbiAgaWYgZmlyc3RTcGxpdGluZz9cbiAgICBtZXNzYWdlID0gcHJldkNvbW1pdC5zdWJzdHJpbmcgMCwgZmlyc3RTcGxpdGluZy5pbmRleFxuXG4gICAgcmVwbGFjZXJSZWdleCA9IC9eOlxcd3s2fSBcXHd7Nn0oPzogXFx3ezd9XFwuezN9KXsyfSAoWyBNQURSQ1U/IV0uKykkL2dtXG4gICAgcHJldkNoYW5nZWRGaWxlcyA9IChmaXJzdFNwbGl0aW5nWzFdLnRyaW0oKS5yZXBsYWNlIHJlcGxhY2VyUmVnZXgsIFwiJDFcIikuc3BsaXQgJ1xcbidcbiAgZWxzZVxuICAgIG1lc3NhZ2UgPSBwcmV2Q29tbWl0LnRyaW0oKVxuICAgIHByZXZDaGFuZ2VkRmlsZXMgPSBbXVxuICB7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc31cblxuY2xlYW51cFVuc3RhZ2VkVGV4dCA9IChzdGF0dXMpIC0+XG4gIHVuc3RhZ2VkRmlsZXMgPSBzdGF0dXMuaW5kZXhPZiBcIkNoYW5nZXMgbm90IHN0YWdlZCBmb3IgY29tbWl0OlwiXG4gIGlmIHVuc3RhZ2VkRmlsZXMgPj0gMFxuICAgIHRleHQgPSBzdGF0dXMuc3Vic3RyaW5nIHVuc3RhZ2VkRmlsZXNcbiAgICBzdGF0dXMgPSBcIiN7c3RhdHVzLnN1YnN0cmluZygwLCB1bnN0YWdlZEZpbGVzIC0gMSl9XFxuI3t0ZXh0LnJlcGxhY2UgL1xccypcXCguKlxcKVxcbi9nLCBcIlwifVwiXG4gIGVsc2VcbiAgICBzdGF0dXNcblxucHJlcEZpbGUgPSAoe2NvbW1lbnRDaGFyLCBtZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzLCBzdGF0dXMsIGZpbGVQYXRofSkgLT5cbiAgICBzdGF0dXMgPSBjbGVhbnVwVW5zdGFnZWRUZXh0IHN0YXR1c1xuICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXHMqXFwoLipcXClcXG4vZywgXCJcXG5cIikucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gICAgaWYgcHJldkNoYW5nZWRGaWxlcy5sZW5ndGggPiAwXG4gICAgICBub3RoaW5nVG9Db21taXQgPSBcIm5vdGhpbmcgdG8gY29tbWl0LCB3b3JraW5nIGRpcmVjdG9yeSBjbGVhblwiXG4gICAgICBjdXJyZW50Q2hhbmdlcyA9IFwiY29tbWl0dGVkOlxcbiN7Y29tbWVudENoYXJ9XCJcbiAgICAgIHRleHRUb1JlcGxhY2UgPSBudWxsXG4gICAgICBpZiBzdGF0dXMuaW5kZXhPZihub3RoaW5nVG9Db21taXQpID4gLTFcbiAgICAgICAgdGV4dFRvUmVwbGFjZSA9IG5vdGhpbmdUb0NvbW1pdFxuICAgICAgZWxzZSBpZiBzdGF0dXMuaW5kZXhPZihjdXJyZW50Q2hhbmdlcykgPiAtMVxuICAgICAgICB0ZXh0VG9SZXBsYWNlID0gY3VycmVudENoYW5nZXNcbiAgICAgIHJlcGxhY2VtZW50VGV4dCA9XG4gICAgICAgIFwiXCJcImNvbW1pdHRlZDpcbiAgICAgICAgI3tcbiAgICAgICAgICBwcmV2Q2hhbmdlZEZpbGVzLm1hcCgoZikgLT4gXCIje2NvbW1lbnRDaGFyfSAgICN7Zn1cIikuam9pbihcIlxcblwiKVxuICAgICAgICB9XCJcIlwiXG4gICAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSB0ZXh0VG9SZXBsYWNlLCByZXBsYWNlbWVudFRleHRcbiAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLFxuICAgICAgXCJcIlwiI3ttZXNzYWdlfVxuICAgICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICAgI3tjb21tZW50Q2hhcn0gd2l0aCAnI3tjb21tZW50Q2hhcn0nIHdpbGwgYmUgaWdub3JlZCwgYW5kIGFuIGVtcHR5IG1lc3NhZ2UgYWJvcnRzIHRoZSBjb21taXQuXG4gICAgICAje2NvbW1lbnRDaGFyfVxuICAgICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgaWYgbm90IGNvbW1pdEVkaXRvclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoXG4gIGVsc2VcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGVJdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIFByb21pc2UucmVzb2x2ZShjb21taXRFZGl0b3IpXG5cbmRlc3Ryb3lDb21taXRFZGl0b3IgPSAoZmlsZVBhdGgpIC0+XG4gIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLml0ZW1Gb3JVUkkoZmlsZVBhdGgpPy5kZXN0cm95KClcblxuY29tbWl0ID0gKHJlcG8sIGZpbGVQYXRoKSAtPlxuICBhcmdzID0gWydjb21taXQnLCAnLS1hbWVuZCcsICctLWNsZWFudXA9c3RyaXAnLCBcIi0tZmlsZT0je2ZpbGVQYXRofVwiXVxuICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7IHJlcG9OYW1lLCBtZXNzYWdlOiAnY29tbWl0Jywgb3V0cHV0OiBkYXRhfSlcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuICAgIGdpdC5yZWZyZXNoKClcbiAgLmNhdGNoIChkYXRhKSAtPlxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsICBtZXNzYWdlOiAnY29tbWl0Jywgb3V0cHV0OiBkYXRhLCBmYWlsZWQ6IHRydWUgfSlcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuXG5jbGVhbnVwID0gKGN1cnJlbnRQYW5lLCBmaWxlUGF0aCkgLT5cbiAgY3VycmVudFBhbmUuYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFuZS5pc0FsaXZlKClcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gIGZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCAnQ09NTUlUX0VESVRNU0cnKVxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBjb21tZW50Q2hhciA9IGdpdC5nZXRDb25maWcocmVwbywgJ2NvcmUuY29tbWVudGNoYXInKSA/ICcjJ1xuICBnaXQuY21kKFsnd2hhdGNoYW5nZWQnLCAnLTEnLCAnLS1mb3JtYXQ9JUInXSwge2N3ZH0pXG4gIC50aGVuIChhbWVuZCkgLT4gcGFyc2UgYW1lbmRcbiAgLnRoZW4gKHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfSkgLT5cbiAgICBnZXRTdGFnZWRGaWxlcyhyZXBvKVxuICAgIC50aGVuIChmaWxlcykgLT5cbiAgICAgIHByZXZDaGFuZ2VkRmlsZXMgPSBwcmV0dGlmeUZpbGVTdGF0dXNlcyhkaWZmRmlsZXMgcHJldkNoYW5nZWRGaWxlcywgZmlsZXMpXG4gICAgICB7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc31cbiAgLnRoZW4gKHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfSkgLT5cbiAgICBnZXRHaXRTdGF0dXMocmVwbylcbiAgICAudGhlbiAoc3RhdHVzKSAtPiBwcmVwRmlsZSB7Y29tbWVudENoYXIsIG1lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXMsIHN0YXR1cywgZmlsZVBhdGh9XG4gICAgLnRoZW4gLT4gc2hvd0ZpbGUgZmlsZVBhdGhcbiAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWRTYXZlIC0+IGNvbW1pdChyZXBvLCBmaWxlUGF0aClcbiAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT4gY2xlYW51cCBjdXJyZW50UGFuZSwgZmlsZVBhdGhcbiAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZEluZm8gbXNnXG4iXX0=
