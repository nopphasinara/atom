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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LXBsdXMtY29tbWFuZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBRU4sV0FBQSxHQUFjLFNBQUE7QUFDWixRQUFBO0lBQUEsTUFBQSxHQUF3QixPQUFBLENBQVEsY0FBUixDQUF1QixFQUFDLE9BQUQ7SUFDL0MsY0FBQSxHQUF3QixPQUFBLENBQVEsdUJBQVIsQ0FBZ0MsRUFBQyxPQUFEO0lBQ3hELG9CQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQ0FBUjtJQUN6QixpQkFBQSxHQUF5QixPQUFBLENBQVEsOEJBQVI7SUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7SUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsd0JBQVIsQ0FBaUMsRUFBQyxPQUFEO0lBQzFELGFBQUEsR0FBeUIsT0FBQSxDQUFRLDBCQUFSO0lBQ3pCLFNBQUEsR0FBeUIsT0FBQSxDQUFRLHFCQUFSO0lBQ3pCLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSO0lBQ3pCLE9BQUEsR0FBeUIsT0FBQSxDQUFRLG1CQUFSO0lBQ3pCLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSO0lBQ3pCLGtCQUFBLEdBQXlCLE9BQUEsQ0FBUSxnQ0FBUjtJQUN6QixXQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUjtJQUN6QixVQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUjtJQUN6QixRQUFBLEdBQXlCLE9BQUEsQ0FBUSxnQkFBUixDQUF5QixFQUFDLE9BQUQ7SUFDbEQsa0JBQUEsR0FBZ0MsT0FBQSxDQUFRLDZCQUFSLENBQXNDLEVBQUMsT0FBRDtJQUN0RSxPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjtJQUN6QixNQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQkFBUjtJ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Q0FBNUI7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyx1QkFBRCxFQUEwQixjQUExQixFQUEwQyxTQUFBO2lCQUFHLFFBQUEsQ0FBUyxJQUFULEVBQWU7WUFBQSxNQUFBLEVBQVEsSUFBUjtXQUFmO1FBQUgsQ0FBMUM7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyxnQ0FBRCxFQUFtQyw0QkFBbkMsRUFBaUUsU0FBQTtpQkFBRyxRQUFBLENBQVMsSUFBVCxFQUFlO1lBQUEsYUFBQSxFQUFlLElBQWY7V0FBZjtRQUFILENBQWpFO09BQWQ7TUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjO1FBQUMsaUJBQUQsRUFBb0IsUUFBcEIsRUFBOEIsU0FBQTtpQkFBRyxTQUFBLENBQVUsSUFBVjtRQUFILENBQTlCO09BQWQ7TUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjO1FBQUMsaUNBQUQsRUFBb0Msb0JBQXBDLEVBQTBELFNBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEI7UUFBSCxDQUExRDtPQUFkO0FBRUEsYUFBTztJQTVESCxDQURSO0VBekNZOztFQXdHZCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTFHakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuL2dpdCdcblxuZ2V0Q29tbWFuZHMgPSAtPlxuICBnaXRBZGQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL21vZGVscy9hZGQnKS5kZWZhdWx0XG4gIGdpdEFkZE1vZGlmaWVkICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL2FkZC1tb2RpZmllZCcpLmRlZmF1bHRcbiAgR2l0Q2hlY2tvdXROZXdCcmFuY2ggICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1uZXctYnJhbmNoJ1xuICBHaXRDaGVja291dEJyYW5jaCAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWNoZWNrb3V0LWJyYW5jaCdcbiAgR2l0RGVsZXRlQnJhbmNoICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kZWxldGUtYnJhbmNoJ1xuICBnaXRDaGVja291dEZpbGUgICAgICAgID0gcmVxdWlyZSgnLi9tb2RlbHMvY2hlY2tvdXQtZmlsZScpLmRlZmF1bHRcbiAgR2l0Q2hlcnJ5UGljayAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVycnktcGljaydcbiAgR2l0Q29tbWl0ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQnXG4gIEdpdENvbW1pdEFtZW5kICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY29tbWl0LWFtZW5kJ1xuICBHaXREaWZmICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYnXG4gIEdpdERpZmZCcmFuY2hlcyAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZi1icmFuY2hlcydcbiAgR2l0RGlmZkJyYW5jaEZpbGVzICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcydcbiAgR2l0RGlmZnRvb2wgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmdG9vbCdcbiAgR2l0RGlmZkFsbCAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1kaWZmLWFsbCdcbiAgZ2l0RmV0Y2ggICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL2ZldGNoJykuZGVmYXVsdFxuICBnaXRGZXRjaEluQWxsUmVwb3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL2ZldGNoLWluLWFsbC1yZXBvcycpLmRlZmF1bHRcbiAgR2l0SW5pdCAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1pbml0J1xuICBHaXRMb2cgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWxvZydcbiAgZ2l0UHVsbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL3B1bGwnKS5kZWZhdWx0XG4gIGdpdFB1c2ggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL21vZGVscy9wdXNoJykuZGVmYXVsdFxuICBnaXRSZXNldCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbW9kZWxzL3Jlc2V0JykuZGVmYXVsdFxuICBHaXRSZW1vdmUgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJlbW92ZSdcbiAgR2l0U2hvdyAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zaG93J1xuICBHaXRTdGFnZUZpbGVzICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzJ1xuICBHaXRTdGFnZUh1bmsgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YWdlLWh1bmsnXG4gIE1hbmFnZVN0YXNoZXMgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL21hbmFnZS1zdGFzaGVzJ1xuICBHaXRTdGFzaEFwcGx5ICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLWFwcGx5J1xuICBHaXRTdGFzaERyb3AgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLWRyb3AnXG4gIEdpdFN0YXNoUG9wICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtcG9wJ1xuICBHaXRTdGFzaFNhdmUgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUnXG4gIEdpdFN0YXNoU2F2ZU1lc3NhZ2UgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZS1tZXNzYWdlJ1xuICBHaXRTdGF0dXMgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YXR1cydcbiAgR2l0VGFncyAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC10YWdzJ1xuICBHaXRSdW4gICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXJ1bidcbiAgR2l0TWVyZ2UgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1tZXJnZSdcbiAgR2l0UmViYXNlICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1yZWJhc2UnXG4gIEdpdE9wZW5DaGFuZ2VkRmlsZXMgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtb3Blbi1jaGFuZ2VkLWZpbGVzJ1xuXG4gIGNvbW1hbmRzID0gW11cblxuICBnaXQuZ2V0UmVwbygpXG4gICAgLnRoZW4gKHJlcG8pIC0+XG4gICAgICBjdXJyZW50RmlsZSA9IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgICAgIGdpdC5yZWZyZXNoIHJlcG9cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmN1c3RvbUNvbW1hbmRzJylcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQocmVxdWlyZSgnLi9zZXJ2aWNlJykuZ2V0Q3VzdG9tQ29tbWFuZHMoKSlcbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQnLCAnQWRkJywgZ2l0QWRkXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1tb2RpZmllZCcsICdBZGQgTW9kaWZpZWQnLCBnaXRBZGRNb2RpZmllZF1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYWxsJywgJ0FkZCBBbGwnLCAtPiBnaXRBZGQodHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bG9nJywgJ0xvZycsIC0+IEdpdExvZyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpsb2ctY3VycmVudC1maWxlJywgJ0xvZyBDdXJyZW50IEZpbGUnLCAtPiBHaXRMb2cocmVwbywgb25seUN1cnJlbnRGaWxlOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZW1vdmUtY3VycmVudC1maWxlJywgJ1JlbW92ZSBDdXJyZW50IEZpbGUnLCAtPiBHaXRSZW1vdmUocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y2hlY2tvdXQtYWxsLWZpbGVzJywgJ0NoZWNrb3V0IEFsbCBGaWxlcycsIC0+IGdpdENoZWNrb3V0RmlsZSh0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1jdXJyZW50LWZpbGUnLCAnQ2hlY2tvdXQgQ3VycmVudCBGaWxlJywgLT4gZ2l0Q2hlY2tvdXRGaWxlKCldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y29tbWl0JywgJ0NvbW1pdCcsIC0+IEdpdENvbW1pdChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQtYWxsJywgJ0NvbW1pdCBBbGwnLCAtPiBHaXRDb21taXQocmVwbywgc3RhZ2VDaGFuZ2VzOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjb21taXQtYW1lbmQnLCAnQ29tbWl0IEFtZW5kJywgLT4gR2l0Q29tbWl0QW1lbmQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFuZC1jb21taXQnLCAnQWRkIEFuZCBDb21taXQnLCAtPiBnaXQuYWRkKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKS50aGVuIC0+IEdpdENvbW1pdChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYW5kLWNvbW1pdC1hbmQtcHVzaCcsICdBZGQgQW5kIENvbW1pdCBBbmQgUHVzaCcsIC0+IGdpdC5hZGQocmVwbywgZmlsZTogY3VycmVudEZpbGUpLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8sIGFuZFB1c2g6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbGwtYW5kLWNvbW1pdCcsICdBZGQgQWxsIEFuZCBDb21taXQnLCAtPiBnaXQuYWRkKHJlcG8pLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbGwtY29tbWl0LWFuZC1wdXNoJywgJ0FkZCBBbGwsIENvbW1pdCBBbmQgUHVzaCcsIC0+IGdpdC5hZGQocmVwbykudGhlbiAtPiBHaXRDb21taXQocmVwbywgYW5kUHVzaDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y29tbWl0LWFsbC1hbmQtcHVzaCcsICdDb21taXQgQWxsIEFuZCBQdXNoJywgLT4gR2l0Q29tbWl0KHJlcG8sIHN0YWdlQ2hhbmdlczogdHJ1ZSwgYW5kUHVzaDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y2hlY2tvdXQnLCAnQ2hlY2tvdXQnLCAtPiBHaXRDaGVja291dEJyYW5jaChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVja291dC1yZW1vdGUnLCAnQ2hlY2tvdXQgUmVtb3RlJywgLT4gR2l0Q2hlY2tvdXRCcmFuY2gocmVwbywge3JlbW90ZTogdHJ1ZX0pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm5ldy1icmFuY2gnLCAnQ2hlY2tvdXQgTmV3IEJyYW5jaCcsIC0+IEdpdENoZWNrb3V0TmV3QnJhbmNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRlbGV0ZS1sb2NhbC1icmFuY2gnLCAnRGVsZXRlIExvY2FsIEJyYW5jaCcsIC0+IEdpdERlbGV0ZUJyYW5jaChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkZWxldGUtcmVtb3RlLWJyYW5jaCcsICdEZWxldGUgUmVtb3RlIEJyYW5jaCcsIC0+IEdpdERlbGV0ZUJyYW5jaChyZXBvLCB7cmVtb3RlOiB0cnVlfSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLWJyYW5jaC1sb2NhbC1hbmQtcmVtb3RlJywgJ0RlbGV0ZSBCcmFuY2ggKExvY2FsIGFuZCBSZW1vdGUpJywgLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8pLnRoZW4gLT4gR2l0RGVsZXRlQnJhbmNoKHJlcG8sIHtyZW1vdGU6IHRydWV9KV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpjaGVycnktcGljaycsICdDaGVycnktUGljaycsIC0+IEdpdENoZXJyeVBpY2socmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZicsICdEaWZmJywgLT4gR2l0RGlmZihyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSldXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5kaWZmQnJhbmNoZXMnKVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZi1icmFuY2hlcycsICdEaWZmIGJyYW5jaGVzJywgLT4gR2l0RGlmZkJyYW5jaGVzKHJlcG8pXVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZi1icmFuY2gtZmlsZXMnLCAnRGlmZiBicmFuY2ggZmlsZXMnLCAtPiBHaXREaWZmQnJhbmNoRmlsZXMocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGlmZnRvb2wnLCAnRGlmZnRvb2wnLCAtPiBHaXREaWZmdG9vbChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWFsbCcsICdEaWZmIEFsbCcsIC0+IEdpdERpZmZBbGwocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZmV0Y2gnLCAnRmV0Y2gnLCBnaXRGZXRjaF1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpmZXRjaC1hbGwnLCAnRmV0Y2ggQWxsIChSZXBvcyAmIFJlbW90ZXMpJywgZ2l0RmV0Y2hJbkFsbFJlcG9zXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmZldGNoLXBydW5lJywgJ0ZldGNoIFBydW5lJywgLT4gZ2l0RmV0Y2goe3BydW5lOiB0cnVlfSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cHVsbCcsICdQdWxsJywgZ2l0UHVsbF1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpwdXNoJywgJ1B1c2gnLCBnaXRQdXNoXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnB1c2gtc2V0LXVwc3RyZWFtJywgJ1B1c2ggLXUnLCAtPiBnaXRQdXNoKHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlbW92ZScsICdSZW1vdmUnLCAtPiBHaXRSZW1vdmUocmVwbywgc2hvd1NlbGVjdG9yOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZXNldCcsICdSZXNldCBIRUFEJywgZ2l0UmVzZXRdXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c2hvdycsICdTaG93JywgLT4gR2l0U2hvdyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFnZS1maWxlcycsICdTdGFnZSBGaWxlcycsIC0+IEdpdFN0YWdlRmlsZXMocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhZ2UtaHVuaycsICdTdGFnZSBIdW5rJywgLT4gR2l0U3RhZ2VIdW5rKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm1hbmFnZS1zdGFzaGVzJywgJ01hbmFnZSBTdGFzaGVzJywgTWFuYWdlU3Rhc2hlcy5kZWZhdWx0XVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXNhdmUnLCAnU3Rhc2g6IFNhdmUgQ2hhbmdlcycsIC0+IEdpdFN0YXNoU2F2ZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1zYXZlLW1lc3NhZ2UnLCAnU3Rhc2g6IFNhdmUgQ2hhbmdlcyBXaXRoIE1lc3NhZ2UnLCAtPiBHaXRTdGFzaFNhdmVNZXNzYWdlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXNoLXBvcCcsICdTdGFzaDogQXBwbHkgKFBvcCknLCAtPiBHaXRTdGFzaFBvcChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1hcHBseScsICdTdGFzaDogQXBwbHkgKEtlZXApJywgLT4gR2l0U3Rhc2hBcHBseShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1kZWxldGUnLCAnU3Rhc2g6IERlbGV0ZSAoRHJvcCknLCAtPiBHaXRTdGFzaERyb3AocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhdHVzJywgJ1N0YXR1cycsIC0+IEdpdFN0YXR1cyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czp0YWdzJywgJ1RhZ3MnLCAtPiBHaXRUYWdzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJ1bicsICdSdW4nLCAtPiBuZXcgR2l0UnVuKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm1lcmdlJywgJ01lcmdlJywgLT4gR2l0TWVyZ2UocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2UtcmVtb3RlJywgJ01lcmdlIFJlbW90ZScsIC0+IEdpdE1lcmdlKHJlcG8sIHJlbW90ZTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bWVyZ2Utbm8tZmFzdC1mb3J3YXJkJywgJ01lcmdlIHdpdGhvdXQgZmFzdC1mb3J3YXJkJywgLT4gR2l0TWVyZ2UocmVwbywgbm9GYXN0Rm9yd2FyZDogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmViYXNlJywgJ1JlYmFzZScsIC0+IEdpdFJlYmFzZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpnaXQtb3Blbi1jaGFuZ2VkLWZpbGVzJywgJ09wZW4gQ2hhbmdlZCBGaWxlcycsIC0+IEdpdE9wZW5DaGFuZ2VkRmlsZXMocmVwbyldXG5cbiAgICAgIHJldHVybiBjb21tYW5kc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldENvbW1hbmRzXG4iXX0=
