(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitCheckoutBranch, GitCheckoutNewBranch, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteBranch, GitDiff, GitDiffAll, GitDiffBranchFiles, GitDiffBranches, GitDifftool, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, ManageStashes, commands, gitAdd, gitAddModified, gitCheckoutFile, gitFetch, gitFetchInAllRepos, gitPull, gitPush, gitReset;
    gitAdd = require('./models/add')["default"];
    gitAddModified = require('./models/add-modified')["default"];
    GitCheckoutNewBranch = require('./models/git-checkout-new-branch');
    GitCheckoutBranch = require('./models/git-checkout-branch');
    GitDeleteBranch = require('./models/git-delete-branch');
    gitCheckoutFile = require('./models/checkout-file')["default"];
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDiffBranches = require('./models/git-diff-branches');
    GitDiffBranchFiles = require('./models/git-diff-branch-files');
    GitDifftool = require('./models/git-difftool');
    GitDiffAll = require('./models/git-diff-all');
    gitFetch = require('./models/fetch')["default"];
    gitFetchInAllRepos = require('./models/fetch-in-all-repos')["default"];
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    gitPull = require('./models/pull')["default"];
    gitPush = require('./models/push')["default"];
    gitReset = require('./models/reset')["default"];
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageHunk = require('./models/git-stage-hunk');
    ManageStashes = require('./models/manage-stashes');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStashSaveMessage = require('./models/git-stash-save-message');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    GitOpenChangedFiles = require('./models/git-open-changed-files');
    commands = [];
    return git.getRepo().then(function(repo) {
      var currentFile, ref;
      currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
      git.refresh(repo);
      if (atom.config.get('git-plus.experimental.customCommands')) {
        commands = commands.concat(require('./service').getCustomCommands());
      }
      commands.push(['git-plus:add', 'Add', gitAdd]);
      commands.push(['git-plus:add-modified', 'Add Modified', gitAddModified]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return gitAdd(true);
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return gitCheckoutFile(true);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return gitCheckoutFile();
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-and-commit-and-push', 'Add And Commit And Push', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:commit-all-and-push', 'Commit All And Push', function() {
          return GitCommit(repo, {
            stageChanges: true,
            andPush: true
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitCheckoutBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitCheckoutBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitCheckoutNewBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:delete-branch-local-and-remote', 'Delete Branch (Local and Remote)', function() {
          return GitDeleteBranch(repo).then(function() {
            return GitDeleteBranch(repo, {
              remote: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo, {
            file: currentFile
          });
        }
      ]);
      if (atom.config.get('git-plus.experimental.diffBranches')) {
        commands.push([
          'git-plus:diff-branches', 'Diff branches', function() {
            return GitDiffBranches(repo);
          }
        ]);
        commands.push([
          'git-plus:diff-branch-files', 'Diff branch files', function() {
            return GitDiffBranchFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push(['git-plus:fetch', 'Fetch', gitFetch]);
      commands.push(['git-plus:fetch-all', 'Fetch All (Repos & Remotes)', gitFetchInAllRepos]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return gitFetch({
            prune: true
          });
        }
      ]);
      commands.push(['git-plus:pull', 'Pull', gitPull]);
      commands.push(['git-plus:push', 'Push', gitPush]);
      commands.push([
        'git-plus:push-set-upstream', 'Push -u', function() {
          return gitPush(true);
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push(['git-plus:reset', 'Reset HEAD', gitReset]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-files', 'Stage Files', function() {
          return GitStageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push(['git-plus:manage-stashes', 'Manage Stashes', ManageStashes["default"]]);
      commands.push([
        'git-plus:stash-save', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-message', 'Stash: Save Changes With Message', function() {
          return GitStashSaveMessage(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:merge-remote', 'Merge Remote', function() {
          return GitMerge(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:merge-no-fast-forward', 'Merge without fast-forward', function() {
          return GitMerge(repo, {
            noFastForward: true
          });
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      commands.push([
        'git-plus:git-open-changed-files', 'Open Changed Files', function() {
          return GitOpenChangedFiles(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQtcGx1cy1jb21tYW5kcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixXQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7SUFBQSxNQUFBLEdBQXdCLE9BQUEsQ0FBUSxjQUFSLENBQXVCLEVBQUMsT0FBRDtJQUMvQyxjQUFBLEdBQXdCLE9BQUEsQ0FBUSx1QkFBUixDQUFnQyxFQUFDLE9BQUQ7SUFDeEQsb0JBQUEsR0FBeUIsT0FBQSxDQUFRLGtDQUFSO0lBQ3pCLGlCQUFBLEdBQXlCLE9BQUEsQ0FBUSw4QkFBUjtJQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUjtJQUN6QixlQUFBLEdBQXlCLE9BQUEsQ0FBUSx3QkFBUixDQUFpQyxFQUFDLE9BQUQ7SUFDMUQsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVI7SUFDekIsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVI7SUFDekIsY0FBQSxHQUF5QixPQUFBLENBQVEsMkJBQVI7SUFDekIsT0FBQSxHQUF5QixPQUFBLENBQVEsbUJBQVI7SUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7SUFDekIsa0JBQUEsR0FBeUIsT0FBQSxDQUFRLGdDQUFSO0lBQ3pCLFdBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSO0lBQ3pCLFVBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSO0lBQ3pCLFFBQUEsR0FBeUIsT0FBQSxDQUFRLGdCQUFSLENBQXlCLEVBQUMsT0FBRDtJQUNsRCxrQkFBQSxHQUFnQyxPQUFBLENBQVEsNkJBQVIsQ0FBc0MsRUFBQyxPQUFEO0lBQ3RFLE9BQUEsR0FBeUIsT0FBQSxDQUFRLG1CQUFSO0lBQ3pCLE1BQUEsR0FBeUIsT0FBQSxDQUFR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QVQ7UUFBSCxDQUE1QjtPQUFkO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztRQUFDLHVCQUFELEVBQTBCLGNBQTFCLEVBQTBDLFNBQUE7aUJBQUcsUUFBQSxDQUFTLElBQVQsRUFBZTtZQUFBLE1BQUEsRUFBUSxJQUFSO1dBQWY7UUFBSCxDQUExQztPQUFkO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztRQUFDLGdDQUFELEVBQW1DLDRCQUFuQyxFQUFpRSxTQUFBO2lCQUFHLFFBQUEsQ0FBUyxJQUFULEVBQWU7WUFBQSxhQUFBLEVBQWUsSUFBZjtXQUFmO1FBQUgsQ0FBakU7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyxpQkFBRCxFQUFvQixRQUFwQixFQUE4QixTQUFBO2lCQUFHLFNBQUEsQ0FBVSxJQUFWO1FBQUgsQ0FBOUI7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyxpQ0FBRCxFQUFvQyxvQkFBcEMsRUFBMEQsU0FBQTtpQkFBRyxtQkFBQSxDQUFvQixJQUFwQjtRQUFILENBQTFEO09BQWQ7QUFFQSxhQUFPO0lBNURILENBRFI7RUF6Q1k7O0VBd0dkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBMUdqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4vZ2l0J1xuXG5nZXRDb21tYW5kcyA9IC0+XG4gIGdpdEFkZCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL2FkZCcpLmRlZmF1bHRcbiAgZ2l0QWRkTW9kaWZpZWQgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvYWRkLW1vZGlmaWVkJykuZGVmYXVsdFxuICBHaXRDaGVja291dE5ld0JyYW5jaCAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZWNrb3V0LW5ldy1icmFuY2gnXG4gIEdpdENoZWNrb3V0QnJhbmNoICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtYnJhbmNoJ1xuICBHaXREZWxldGVCcmFuY2ggICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRlbGV0ZS1icmFuY2gnXG4gIGdpdENoZWNrb3V0RmlsZSAgICAgICAgPSByZXF1aXJlKCcuL21vZGVscy9jaGVja291dC1maWxlJykuZGVmYXVsdFxuICBHaXRDaGVycnlQaWNrICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrJ1xuICBHaXRDb21taXQgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNvbW1pdCdcbiAgR2l0Q29tbWl0QW1lbmQgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQtYW1lbmQnXG4gIEdpdERpZmYgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZidcbiAgR2l0RGlmZkJyYW5jaGVzICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWJyYW5jaGVzJ1xuICBHaXREaWZmQnJhbmNoRmlsZXMgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYtYnJhbmNoLWZpbGVzJ1xuICBHaXREaWZmdG9vbCAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmZ0b29sJ1xuICBHaXREaWZmQWxsICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYtYWxsJ1xuICBnaXRGZXRjaCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvZmV0Y2gnKS5kZWZhdWx0XG4gIGdpdEZldGNoSW5BbGxSZXBvcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvZmV0Y2gtaW4tYWxsLXJlcG9zJykuZGVmYXVsdFxuICBHaXRJbml0ICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWluaXQnXG4gIEdpdExvZyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtbG9nJ1xuICBnaXRQdWxsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvcHVsbCcpLmRlZmF1bHRcbiAgZ2l0UHVzaCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL3B1c2gnKS5kZWZhdWx0XG4gIGdpdFJlc2V0ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvcmVzZXQnKS5kZWZhdWx0XG4gIEdpdFJlbW92ZSAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcmVtb3ZlJ1xuICBHaXRTaG93ICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXNob3cnXG4gIEdpdFN0YWdlRmlsZXMgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtZmlsZXMnXG4gIEdpdFN0YWdlSHVuayAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhZ2UtaHVuaydcbiAgTWFuYWdlU3Rhc2hlcyAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvbWFuYWdlLXN0YXNoZXMnXG4gIEdpdFN0YXNoQXBwbHkgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtYXBwbHknXG4gIEdpdFN0YXNoRHJvcCAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtZHJvcCdcbiAgR2l0U3Rhc2hQb3AgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1wb3AnXG4gIEdpdFN0YXNoU2F2ZSAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZSdcbiAgR2l0U3Rhc2hTYXZlTWVzc2FnZSAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1zYXZlLW1lc3NhZ2UnXG4gIEdpdFN0YXR1cyAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhdHVzJ1xuICBHaXRUYWdzICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXRhZ3MnXG4gIEdpdFJ1biAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcnVuJ1xuICBHaXRNZXJnZSAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LW1lcmdlJ1xuICBHaXRSZWJhc2UgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJlYmFzZSdcbiAgR2l0T3BlbkNoYW5nZWRGaWxlcyAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1vcGVuLWNoYW5nZWQtZmlsZXMnXG5cbiAgY29tbWFuZHMgPSBbXVxuXG4gIGdpdC5nZXRSZXBvKClcbiAgICAudGhlbiAocmVwbykgLT5cbiAgICAgIGN1cnJlbnRGaWxlID0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICAgICAgZ2l0LnJlZnJlc2ggcmVwb1xuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5leHBlcmltZW50YWwuY3VzdG9tQ29tbWFuZHMnKVxuICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChyZXF1aXJlKCcuL3NlcnZpY2UnKS5nZXRDdXN0b21Db21tYW5kcygpKVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZCcsICdBZGQnLCBnaXRBZGRdXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLW1vZGlmaWVkJywgJ0FkZCBNb2RpZmllZCcsIGdpdEFkZE1vZGlmaWVkXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbGwnLCAnQWRkIEFsbCcsIC0+IGdpdEFkZCh0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpsb2cnLCAnTG9nJywgLT4gR2l0TG9nKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmxvZy1jdXJyZW50LWZpbGUnLCAnTG9nIEN1cnJlbnQgRmlsZScsIC0+IEdpdExvZyhyZXBvLCBvbmx5Q3VycmVudEZpbGU6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlbW92ZS1jdXJyZW50LWZpbGUnLCAnUmVtb3ZlIEN1cnJlbnQgRmlsZScsIC0+IEdpdFJlbW92ZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1hbGwtZmlsZXMnLCAnQ2hlY2tvdXQgQWxsIEZpbGVzJywgLT4gZ2l0Q2hlY2tvdXRGaWxlKHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0LWN1cnJlbnQtZmlsZScsICdDaGVja291dCBDdXJyZW50IEZpbGUnLCAtPiBnaXRDaGVja291dEZpbGUoKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQnLCAnQ29tbWl0JywgLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbGwnLCAnQ29tbWl0IEFsbCcsIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbWVuZCcsICdDb21taXQgQW1lbmQnLCAtPiBHaXRDb21taXRBbWVuZChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYW5kLWNvbW1pdCcsICdBZGQgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbmQtY29tbWl0LWFuZC1wdXNoJywgJ0FkZCBBbmQgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSkudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1hbmQtY29tbWl0JywgJ0FkZCBBbGwgQW5kIENvbW1pdCcsIC0+IGdpdC5hZGQocmVwbykudGhlbiAtPiBHaXRDb21taXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFsbC1jb21taXQtYW5kLXB1c2gnLCAnQWRkIEFsbCwgQ29tbWl0IEFuZCBQdXNoJywgLT4gZ2l0LmFkZChyZXBvKS50aGVuIC0+IEdpdENvbW1pdChyZXBvLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQtYWxsLWFuZC1wdXNoJywgJ0NvbW1pdCBBbGwgQW5kIFB1c2gnLCAtPiBHaXRDb21taXQocmVwbywgc3RhZ2VDaGFuZ2VzOiB0cnVlLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dCcsICdDaGVja291dCcsIC0+IEdpdENoZWNrb3V0QnJhbmNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0LXJlbW90ZScsICdDaGVja291dCBSZW1vdGUnLCAtPiBHaXRDaGVja291dEJyYW5jaChyZXBvLCB7cmVtb3RlOiB0cnVlfSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bmV3LWJyYW5jaCcsICdDaGVja291dCBOZXcgQnJhbmNoJywgLT4gR2l0Q2hlY2tvdXROZXdCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLWxvY2FsLWJyYW5jaCcsICdEZWxldGUgTG9jYWwgQnJhbmNoJywgLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRlbGV0ZS1yZW1vdGUtYnJhbmNoJywgJ0RlbGV0ZSBSZW1vdGUgQnJhbmNoJywgLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8sIHtyZW1vdGU6IHRydWV9KV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkZWxldGUtYnJhbmNoLWxvY2FsLWFuZC1yZW1vdGUnLCAnRGVsZXRlIEJyYW5jaCAoTG9jYWwgYW5kIFJlbW90ZSknLCAtPiBHaXREZWxldGVCcmFuY2gocmVwbykudGhlbiAtPiBHaXREZWxldGVCcmFuY2gocmVwbywge3JlbW90ZTogdHJ1ZX0pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZXJyeS1waWNrJywgJ0NoZXJyeS1QaWNrJywgLT4gR2l0Q2hlcnJ5UGljayhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmJywgJ0RpZmYnLCAtPiBHaXREaWZmKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKV1cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmRpZmZCcmFuY2hlcycpXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWJyYW5jaGVzJywgJ0RpZmYgYnJhbmNoZXMnLCAtPiBHaXREaWZmQnJhbmNoZXMocmVwbyldXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWJyYW5jaC1maWxlcycsICdEaWZmIGJyYW5jaCBmaWxlcycsIC0+IEdpdERpZmZCcmFuY2hGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmdG9vbCcsICdEaWZmdG9vbCcsIC0+IEdpdERpZmZ0b29sKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRpZmYtYWxsJywgJ0RpZmYgQWxsJywgLT4gR2l0RGlmZkFsbChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpmZXRjaCcsICdGZXRjaCcsIGdpdEZldGNoXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmZldGNoLWFsbCcsICdGZXRjaCBBbGwgKFJlcG9zICYgUmVtb3RlcyknLCBnaXRGZXRjaEluQWxsUmVwb3NdXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZmV0Y2gtcHJ1bmUnLCAnRmV0Y2ggUHJ1bmUnLCAtPiBnaXRGZXRjaCh7cHJ1bmU6IHRydWV9KV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpwdWxsJywgJ1B1bGwnLCBnaXRQdWxsXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnB1c2gnLCAnUHVzaCcsIGdpdFB1c2hdXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cHVzaC1zZXQtdXBzdHJlYW0nLCAnUHVzaCAtdScsIC0+IGdpdFB1c2godHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmVtb3ZlJywgJ1JlbW92ZScsIC0+IEdpdFJlbW92ZShyZXBvLCBzaG93U2VsZWN0b3I6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlc2V0JywgJ1Jlc2V0IEhFQUQnLCBnaXRSZXNldF1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzaG93JywgJ1Nob3cnLCAtPiBHaXRTaG93KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YWdlLWZpbGVzJywgJ1N0YWdlIEZpbGVzJywgLT4gR2l0U3RhZ2VGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFnZS1odW5rJywgJ1N0YWdlIEh1bmsnLCAtPiBHaXRTdGFnZUh1bmsocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWFuYWdlLXN0YXNoZXMnLCAnTWFuYWdlIFN0YXNoZXMnLCBNYW5hZ2VTdGFzaGVzLmRlZmF1bHRdXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtc2F2ZScsICdTdGFzaDogU2F2ZSBDaGFuZ2VzJywgLT4gR2l0U3Rhc2hTYXZlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXNhdmUtbWVzc2FnZScsICdTdGFzaDogU2F2ZSBDaGFuZ2VzIFdpdGggTWVzc2FnZScsIC0+IEdpdFN0YXNoU2F2ZU1lc3NhZ2UocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtcG9wJywgJ1N0YXNoOiBBcHBseSAoUG9wKScsIC0+IEdpdFN0YXNoUG9wKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLWFwcGx5JywgJ1N0YXNoOiBBcHBseSAoS2VlcCknLCAtPiBHaXRTdGFzaEFwcGx5KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLWRlbGV0ZScsICdTdGFzaDogRGVsZXRlIChEcm9wKScsIC0+IEdpdFN0YXNoRHJvcChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGF0dXMnLCAnU3RhdHVzJywgLT4gR2l0U3RhdHVzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnRhZ3MnLCAnVGFncycsIC0+IEdpdFRhZ3MocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cnVuJywgJ1J1bicsIC0+IG5ldyBHaXRSdW4ocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2UnLCAnTWVyZ2UnLCAtPiBHaXRNZXJnZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czptZXJnZS1yZW1vdGUnLCAnTWVyZ2UgUmVtb3RlJywgLT4gR2l0TWVyZ2UocmVwbywgcmVtb3RlOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czptZXJnZS1uby1mYXN0LWZvcndhcmQnLCAnTWVyZ2Ugd2l0aG91dCBmYXN0LWZvcndhcmQnLCAtPiBHaXRNZXJnZShyZXBvLCBub0Zhc3RGb3J3YXJkOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZWJhc2UnLCAnUmViYXNlJywgLT4gR2l0UmViYXNlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmdpdC1vcGVuLWNoYW5nZWQtZmlsZXMnLCAnT3BlbiBDaGFuZ2VkIEZpbGVzJywgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKV1cblxuICAgICAgcmV0dXJuIGNvbW1hbmRzXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Q29tbWFuZHNcbiJdfQ==
