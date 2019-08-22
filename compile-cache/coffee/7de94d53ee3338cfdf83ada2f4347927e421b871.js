(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    var stagedFiles, unstagedFiles;
    unstagedFiles = git.unstagedFiles(repo, {
      showUntracked: true
    });
    stagedFiles = git.stagedFiles(repo);
    return Promise.all([unstagedFiles, stagedFiles]).then(function(data) {
      return new SelectStageFiles(repo, data[0].concat(data[1]));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixnQkFBQSxHQUFtQixPQUFBLENBQVEsa0NBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFFBQUE7SUFBQSxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLEVBQXdCO01BQUEsYUFBQSxFQUFlLElBQWY7S0FBeEI7SUFDaEIsV0FBQSxHQUFjLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCO1dBQ2QsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLGFBQUQsRUFBZ0IsV0FBaEIsQ0FBWixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFVLElBQUksZ0JBQUosQ0FBcUIsSUFBckIsRUFBMkIsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQVIsQ0FBZSxJQUFLLENBQUEsQ0FBQSxDQUFwQixDQUEzQjtJQUFWLENBRE47RUFIZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblNlbGVjdFN0YWdlRmlsZXMgPSByZXF1aXJlICcuLi92aWV3cy9zZWxlY3Qtc3RhZ2UtZmlsZXMtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgdW5zdGFnZWRGaWxlcyA9IGdpdC51bnN0YWdlZEZpbGVzKHJlcG8sIHNob3dVbnRyYWNrZWQ6IHRydWUpXG4gIHN0YWdlZEZpbGVzID0gZ2l0LnN0YWdlZEZpbGVzKHJlcG8pXG4gIFByb21pc2UuYWxsKFt1bnN0YWdlZEZpbGVzLCBzdGFnZWRGaWxlc10pXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgU2VsZWN0U3RhZ2VGaWxlcyhyZXBvLCBkYXRhWzBdLmNvbmNhdChkYXRhWzFdKSlcbiJdfQ==
