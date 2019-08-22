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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQtYW1lbmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzUkFBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFFckMsV0FBQSxHQUFjLElBQUk7O0VBRWxCLG1CQUFBLEdBQXNCLFNBQUMsSUFBRDtBQUNwQixRQUFBO0lBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEdBQVA7O0lBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQjs7O0FBQ25CO1dBQUEsaURBQUE7O3FCQUNIO1VBQUMsTUFBQSxJQUFEO1VBQU8sSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUFsQjs7QUFERzs7O0VBSGU7O0VBTXRCLHFCQUFBLEdBQXdCLFNBQUMsSUFBRDtXQUN0QjtNQUFBLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFYO01BQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixDQUFpQixDQUFDLElBQWxCLENBQUEsQ0FETjs7RUFEc0I7O0VBSXhCLG9CQUFBLEdBQXVCLFNBQUMsS0FBRDtXQUNyQixLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsR0FBRDtBQUNSLFVBQUE7TUFE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bntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG5wcmV0dGlmeVN0YWdlZEZpbGVzID0gKGRhdGEpIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXDAvKVsuLi4tMV1cbiAgW10gPSBmb3IgbW9kZSwgaSBpbiBkYXRhIGJ5IDJcbiAgICB7bW9kZSwgcGF0aDogZGF0YVtpKzFdIH1cblxucHJldHR5aWZ5UHJldmlvdXNGaWxlID0gKGRhdGEpIC0+XG4gIG1vZGU6IGRhdGFbMF1cbiAgcGF0aDogZGF0YS5zdWJzdHJpbmcoMSkudHJpbSgpXG5cbnByZXR0aWZ5RmlsZVN0YXR1c2VzID0gKGZpbGVzKSAtPlxuICBmaWxlcy5tYXAgKHttb2RlLCBwYXRofSkgLT5cbiAgICBzd2l0Y2ggbW9kZVxuICAgICAgd2hlbiAnTSdcbiAgICAgICAgXCJtb2RpZmllZDogICAje3BhdGh9XCJcbiAgICAgIHdoZW4gJ0EnXG4gICAgICAgIFwibmV3IGZpbGU6ICAgI3twYXRofVwiXG4gICAgICB3aGVuICdEJ1xuICAgICAgICBcImRlbGV0ZWQ6ICAgI3twYXRofVwiXG4gICAgICB3aGVuICdSJ1xuICAgICAgICBcInJlbmFtZWQ6ICAgI3twYXRofVwiXG5cbmdldFN0YWdlZEZpbGVzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGFnZWRGaWxlcyhyZXBvKS50aGVuIChmaWxlcykgLT5cbiAgICBpZiBmaWxlcy5sZW5ndGggPj0gMVxuICAgICAgYXJncyA9IFsnZGlmZi1pbmRleCcsICctLW5vLWNvbG9yJywgJy0tY2FjaGVkJywgJ0hFQUQnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgLT4gcHJldHRpZnlTdGFnZWRGaWxlcyBkYXRhXG4gICAgZWxzZVxuICAgICAgUHJvbWlzZS5yZXNvbHZlIFtdXG5cbmdldEdpdFN0YXR1cyA9IChyZXBvKSAtPlxuICBnaXQuY21kIFsnLWMnLCAnY29sb3IudWk9ZmFsc2UnLCAnc3RhdHVzJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcblxuZGlmZkZpbGVzID0gKHByZXZpb3VzRmlsZXMsIGN1cnJlbnRGaWxlcykgLT5cbiAgcHJldmlvdXNGaWxlcyA9IHByZXZpb3VzRmlsZXMubWFwIChwKSAtPiBwcmV0dHlpZnlQcmV2aW91c0ZpbGUgcFxuICBjdXJyZW50UGF0aHMgPSBjdXJyZW50RmlsZXMubWFwICh7cGF0aH0pIC0+IHBhdGhcbiAgcHJldmlvdXNGaWxlcy5maWx0ZXIgKHApIC0+IHAucGF0aCBpbiBjdXJyZW50UGF0aHMgaXMgZmFsc2VcblxucGFyc2UgPSAocHJldkNvbW1pdCkgLT5cbiAgc3RhdHVzUmVnZXggPSAvXFxuezIsfSgoPzooPzo6XFx3ezZ9IFxcd3s2fSg/OiBcXHd7N31cXC57M30pezJ9IFsgTUFEUkNVPyFdXFxzKy4rP1xcbj8pKSopJC9cbiAgZmlyc3RTcGxpdGluZyA9IHN0YXR1c1JlZ2V4LmV4ZWMgcHJldkNvbW1pdFxuXG4gIGlmIGZpcnN0U3BsaXRpbmc/XG4gICAgbWVzc2FnZSA9IHByZXZDb21taXQuc3Vic3RyaW5nIDAsIGZpcnN0U3BsaXRpbmcuaW5kZXhcblxuICAgIHJlcGxhY2VyUmVnZXggPSAvXjpcXHd7Nn0gXFx3ezZ9KD86IFxcd3s3fVxcLnszfSl7Mn0gKFsgTUFEUkNVPyFdLispJC9nbVxuICAgIHByZXZDaGFuZ2VkRmlsZXMgPSAoZmlyc3RTcGxpdGluZ1sxXS50cmltKCkucmVwbGFjZSByZXBsYWNlclJlZ2V4LCBcIiQxXCIpLnNwbGl0ICdcXG4nXG4gIGVsc2VcbiAgICBtZXNzYWdlID0gcHJldkNvbW1pdC50cmltKClcbiAgICBwcmV2Q2hhbmdlZEZpbGVzID0gW11cbiAge21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9XG5cbmNsZWFudXBVbnN0YWdlZFRleHQgPSAoc3RhdHVzKSAtPlxuICB1bnN0YWdlZEZpbGVzID0gc3RhdHVzLmluZGV4T2YgXCJDaGFuZ2VzIG5vdCBzdGFnZWQgZm9yIGNvbW1pdDpcIlxuICBpZiB1bnN0YWdlZEZpbGVzID49IDBcbiAgICB0ZXh0ID0gc3RhdHVzLnN1YnN0cmluZyB1bnN0YWdlZEZpbGVzXG4gICAgc3RhdHVzID0gXCIje3N0YXR1cy5zdWJzdHJpbmcoMCwgdW5zdGFnZWRGaWxlcyAtIDEpfVxcbiN7dGV4dC5yZXBsYWNlIC9cXHMqXFwoLipcXClcXG4vZywgXCJcIn1cIlxuICBlbHNlXG4gICAgc3RhdHVzXG5cbnByZXBGaWxlID0gKHtjb21tZW50Q2hhciwgbWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlcywgc3RhdHVzLCBmaWxlUGF0aH0pIC0+XG4gICAgc3RhdHVzID0gY2xlYW51cFVuc3RhZ2VkVGV4dCBzdGF0dXNcbiAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxzKlxcKC4qXFwpXFxuL2csIFwiXFxuXCIpLnJlcGxhY2UoL1xcbi9nLCBcIlxcbiN7Y29tbWVudENoYXJ9IFwiKVxuICAgIGlmIHByZXZDaGFuZ2VkRmlsZXMubGVuZ3RoID4gMFxuICAgICAgbm90aGluZ1RvQ29tbWl0ID0gXCJub3RoaW5nIHRvIGNvbW1pdCwgd29ya2luZyBkaXJlY3RvcnkgY2xlYW5cIlxuICAgICAgY3VycmVudENoYW5nZXMgPSBcImNvbW1pdHRlZDpcXG4je2NvbW1lbnRDaGFyfVwiXG4gICAgICB0ZXh0VG9SZXBsYWNlID0gbnVsbFxuICAgICAgaWYgc3RhdHVzLmluZGV4T2Yobm90aGluZ1RvQ29tbWl0KSA+IC0xXG4gICAgICAgIHRleHRUb1JlcGxhY2UgPSBub3RoaW5nVG9Db21taXRcbiAgICAgIGVsc2UgaWYgc3RhdHVzLmluZGV4T2YoY3VycmVudENoYW5nZXMpID4gLTFcbiAgICAgICAgdGV4dFRvUmVwbGFjZSA9IGN1cnJlbnRDaGFuZ2VzXG4gICAgICByZXBsYWNlbWVudFRleHQgPVxuICAgICAgICBcIlwiXCJjb21taXR0ZWQ6XG4gICAgICAgICN7XG4gICAgICAgICAgcHJldkNoYW5nZWRGaWxlcy5tYXAoKGYpIC0+IFwiI3tjb21tZW50Q2hhcn0gICAje2Z9XCIpLmpvaW4oXCJcXG5cIilcbiAgICAgICAgfVwiXCJcIlxuICAgICAgc3RhdHVzID0gc3RhdHVzLnJlcGxhY2UgdGV4dFRvUmVwbGFjZSwgcmVwbGFjZW1lbnRUZXh0XG4gICAgZnMud3JpdGVGaWxlU3luYyBmaWxlUGF0aCxcbiAgICAgIFwiXCJcIiN7bWVzc2FnZX1cbiAgICAgICN7Y29tbWVudENoYXJ9IFBsZWFzZSBlbnRlciB0aGUgY29tbWl0IG1lc3NhZ2UgZm9yIHlvdXIgY2hhbmdlcy4gTGluZXMgc3RhcnRpbmdcbiAgICAgICN7Y29tbWVudENoYXJ9IHdpdGggJyN7Y29tbWVudENoYXJ9JyB3aWxsIGJlIGlnbm9yZWQsIGFuZCBhbiBlbXB0eSBtZXNzYWdlIGFib3J0cyB0aGUgY29tbWl0LlxuICAgICAgI3tjb21tZW50Q2hhcn1cbiAgICAgICN7Y29tbWVudENoYXJ9ICN7c3RhdHVzfVwiXCJcIlxuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgY29tbWl0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCk/Lml0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gIGlmIG5vdCBjb21taXRFZGl0b3JcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5zcGxpdFBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlUGF0aFxuICBlbHNlXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGUoKVxuICAgIGVsc2VcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlSXRlbUZvclVSSShmaWxlUGF0aClcbiAgICBQcm9taXNlLnJlc29sdmUoY29tbWl0RWRpdG9yKVxuXG5kZXN0cm95Q29tbWl0RWRpdG9yID0gKGZpbGVQYXRoKSAtPlxuICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5pdGVtRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG5cbmNvbW1pdCA9IChyZXBvLCBmaWxlUGF0aCkgLT5cbiAgYXJncyA9IFsnY29tbWl0JywgJy0tYW1lbmQnLCAnLS1jbGVhbnVwPXN0cmlwJywgXCItLWZpbGU9I3tmaWxlUGF0aH1cIl1cbiAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoeyByZXBvTmFtZSwgbWVzc2FnZTogJ2NvbW1pdCcsIG91dHB1dDogZGF0YX0pXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcbiAgICBnaXQucmVmcmVzaCgpXG4gIC5jYXRjaCAoZGF0YSkgLT5cbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCAgbWVzc2FnZTogJ2NvbW1pdCcsIG91dHB1dDogZGF0YSwgZmFpbGVkOiB0cnVlIH0pXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcblxuY2xlYW51cCA9IChjdXJyZW50UGFuZSwgZmlsZVBhdGgpIC0+XG4gIGN1cnJlbnRQYW5lLmFjdGl2YXRlKCkgaWYgY3VycmVudFBhbmUuaXNBbGl2ZSgpXG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICBmaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgJ0NPTU1JVF9FRElUTVNHJylcbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgY29tbWVudENoYXIgPSBnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb3JlLmNvbW1lbnRjaGFyJykgPyAnIydcbiAgZ2l0LmNtZChbJ3doYXRjaGFuZ2VkJywgJy0xJywgJy0tZm9ybWF0PSVCJ10sIHtjd2R9KVxuICAudGhlbiAoYW1lbmQpIC0+IHBhcnNlIGFtZW5kXG4gIC50aGVuICh7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc30pIC0+XG4gICAgZ2V0U3RhZ2VkRmlsZXMocmVwbylcbiAgICAudGhlbiAoZmlsZXMpIC0+XG4gICAgICBwcmV2Q2hhbmdlZEZpbGVzID0gcHJldHRpZnlGaWxlU3RhdHVzZXMoZGlmZkZpbGVzIHByZXZDaGFuZ2VkRmlsZXMsIGZpbGVzKVxuICAgICAge21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9XG4gIC50aGVuICh7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc30pIC0+XG4gICAgZ2V0R2l0U3RhdHVzKHJlcG8pXG4gICAgLnRoZW4gKHN0YXR1cykgLT4gcHJlcEZpbGUge2NvbW1lbnRDaGFyLCBtZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzLCBzdGF0dXMsIGZpbGVQYXRofVxuICAgIC50aGVuIC0+IHNob3dGaWxlIGZpbGVQYXRoXG4gIC50aGVuICh0ZXh0RWRpdG9yKSAtPlxuICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkU2F2ZSAtPiBjb21taXQocmVwbywgZmlsZVBhdGgpXG4gICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGNsZWFudXAgY3VycmVudFBhbmUsIGZpbGVQYXRoXG4gIC5jYXRjaCAobXNnKSAtPiBub3RpZmllci5hZGRJbmZvIG1zZ1xuIl19
