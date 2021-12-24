(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo, arg) {
    var args, extraArgs, noFastForward, ref, remote;
    ref = arg != null ? arg : {}, remote = ref.remote, noFastForward = ref.noFastForward;
    extraArgs = noFastForward ? ['--no-ff'] : [];
    args = ['branch', '--no-color'];
    if (remote) {
      args.push('-r');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new MergeListView(repo, data, extraArgs);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LW1lcmdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTt3QkFEc0IsTUFBd0IsSUFBdkIscUJBQVE7SUFDL0IsU0FBQSxHQUFlLGFBQUgsR0FBc0IsQ0FBQyxTQUFELENBQXRCLEdBQXVDO0lBQ25ELElBQUEsR0FBTyxDQUFDLFFBQUQsRUFBVyxZQUFYO0lBQ1AsSUFBa0IsTUFBbEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBQTs7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBVSxJQUFJLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsU0FBOUI7SUFBVixDQUROO0VBSmU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5NZXJnZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvbWVyZ2UtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7cmVtb3RlLCBub0Zhc3RGb3J3YXJkfT17fSkgLT5cbiAgZXh0cmFBcmdzID0gaWYgbm9GYXN0Rm9yd2FyZCB0aGVuIFsnLS1uby1mZiddIGVsc2UgW11cbiAgYXJncyA9IFsnYnJhbmNoJywgJy0tbm8tY29sb3InXVxuICBhcmdzLnB1c2ggJy1yJyBpZiByZW1vdGVcbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IE1lcmdlTGlzdFZpZXcocmVwbywgZGF0YSwgZXh0cmFBcmdzKVxuIl19
