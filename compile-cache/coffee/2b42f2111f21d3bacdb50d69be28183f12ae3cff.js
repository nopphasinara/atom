(function() {
  var RemoteListView, git, pull;

  git = require('../git');

  pull = require('./_pull');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    var extraArgs;
    extraArgs = atom.config.get('git-plus.remoteInteractions.pullRebase') ? ['--rebase'] : [];
    if (atom.config.get('git-plus.remoteInteractions.pullAutostash')) {
      extraArgs.push('--autostash');
    }
    if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
      return git.cmd(['remote'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return new RemoteListView(repo, data, {
          mode: 'pull',
          extraArgs: extraArgs
        }).result;
      });
    } else {
      return pull(repo, {
        extraArgs: extraArgs
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXB1bGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSOztFQUNQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsU0FBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FBSCxHQUFrRSxDQUFDLFVBQUQsQ0FBbEUsR0FBb0Y7SUFDaEcsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLENBQUg7TUFDRSxTQUFTLENBQUMsSUFBVixDQUFlLGFBQWYsRUFERjs7SUFFQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2Q0FBaEIsQ0FBSDthQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFwQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUNKLElBQUksY0FBQSxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkI7VUFBQSxJQUFBLEVBQU0sTUFBTjtVQUFjLFNBQUEsRUFBVyxTQUF6QjtTQUEzQixDQUE4RCxDQUFDO01BRC9ELENBRE4sRUFERjtLQUFBLE1BQUE7YUFLRSxJQUFBLENBQUssSUFBTCxFQUFXO1FBQUMsV0FBQSxTQUFEO09BQVgsRUFMRjs7RUFKZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbnB1bGwgPSByZXF1aXJlICcuL19wdWxsJ1xuUmVtb3RlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdGUtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBleHRyYUFyZ3MgPSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsUmViYXNlJykgdGhlbiBbJy0tcmViYXNlJ10gZWxzZSBbXVxuICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsQXV0b3N0YXNoJylcbiAgICBleHRyYUFyZ3MucHVzaCAnLS1hdXRvc3Rhc2gnXG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcpXG4gICAgZ2l0LmNtZChbJ3JlbW90ZSddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIGRhdGEsIG1vZGU6ICdwdWxsJywgZXh0cmFBcmdzOiBleHRyYUFyZ3MpLnJlc3VsdFxuICBlbHNlXG4gICAgcHVsbCByZXBvLCB7ZXh0cmFBcmdzfVxuIl19
