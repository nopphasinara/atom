(function() {
  var TagListView, git;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  module.exports = function(repo) {
    return git.cmd(['tag', '-ln'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new TagListView(repo, data);
    })["catch"](function() {
      return new TagListView(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXRhZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBUixFQUF3QjtNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXhCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQVUsSUFBSSxXQUFKLENBQWdCLElBQWhCLEVBQXNCLElBQXRCO0lBQVYsQ0FETixDQUVBLEVBQUMsS0FBRCxFQUZBLENBRU8sU0FBQTthQUFHLElBQUksV0FBSixDQUFnQixJQUFoQjtJQUFILENBRlA7RUFEZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblRhZ0xpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvdGFnLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZChbJ3RhZycsICctbG4nXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBUYWdMaXN0VmlldyhyZXBvLCBkYXRhKVxuICAuY2F0Y2ggLT4gbmV3IFRhZ0xpc3RWaWV3KHJlcG8pXG4iXX0=
