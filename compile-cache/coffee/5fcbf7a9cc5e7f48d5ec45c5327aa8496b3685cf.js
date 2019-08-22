(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, arg) {
    var setUpstream;
    setUpstream = (arg != null ? arg : {}).setUpstream;
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      var mode;
      mode = setUpstream ? 'push -u' : 'push';
      return new RemoteListView(repo, data, {
        mode: mode
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1wdXNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1Qiw2QkFBRCxNQUFjO1dBQ3BDLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFwQixDQUFvRCxDQUFDLElBQXJELENBQTBELFNBQUMsSUFBRDtBQUN4RCxVQUFBO01BQUEsSUFBQSxHQUFVLFdBQUgsR0FBb0IsU0FBcEIsR0FBbUM7YUFDMUMsSUFBSSxjQUFKLENBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCO1FBQUMsTUFBQSxJQUFEO09BQS9CO0lBRndELENBQTFEO0VBRGU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtzZXRVcHN0cmVhbX09e30pIC0+XG4gIGdpdC5jbWQoWydyZW1vdGUnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSkudGhlbiAoZGF0YSkgLT5cbiAgICBtb2RlID0gaWYgc2V0VXBzdHJlYW0gdGhlbiAncHVzaCAtdScgZWxzZSAncHVzaCdcbiAgICBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgZGF0YSwge21vZGV9KVxuIl19
