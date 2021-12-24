(function() {
  var LogListView, LogViewURI, git;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  LogViewURI = 'atom://git-plus:log';

  module.exports = function(repo, arg) {
    var currentFile, onlyCurrentFile, ref;
    onlyCurrentFile = (arg != null ? arg : {}).onlyCurrentFile;
    atom.workspace.addOpener(function(uri) {
      if (uri === LogViewURI) {
        return new LogListView;
      }
    });
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    return atom.workspace.open(LogViewURI).then(function(view) {
      if (onlyCurrentFile) {
        return view.currentFileLog(repo, currentFile);
      } else {
        return view.branchLog(repo);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWxvZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSOztFQUNkLFVBQUEsR0FBYTs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QixpQ0FBRCxNQUFrQjtJQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxHQUFEO01BQ3ZCLElBQTBCLEdBQUEsS0FBTyxVQUFqQztBQUFBLGVBQU8sSUFBSSxZQUFYOztJQUR1QixDQUF6QjtJQUdBLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO1dBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsU0FBQyxJQUFEO01BQ25DLElBQUcsZUFBSDtlQUNFLElBQUksQ0FBQyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLFdBQTFCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBSEY7O0lBRG1DLENBQXJDO0VBTGU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5Mb2dMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2xvZy1saXN0LXZpZXcnXG5Mb2dWaWV3VVJJID0gJ2F0b206Ly9naXQtcGx1czpsb2cnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtvbmx5Q3VycmVudEZpbGV9PXt9KSAtPlxuICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaSkgLT5cbiAgICByZXR1cm4gbmV3IExvZ0xpc3RWaWV3IGlmIHVyaSBpcyBMb2dWaWV3VVJJXG5cbiAgY3VycmVudEZpbGUgPSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oTG9nVmlld1VSSSkudGhlbiAodmlldykgLT5cbiAgICBpZiBvbmx5Q3VycmVudEZpbGVcbiAgICAgIHZpZXcuY3VycmVudEZpbGVMb2cocmVwbywgY3VycmVudEZpbGUpXG4gICAgZWxzZVxuICAgICAgdmlldy5icmFuY2hMb2cgcmVwb1xuIl19
