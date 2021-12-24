(function() {
  var filesFromData, git;

  git = require('../git');

  filesFromData = function(statusData) {
    var files, i, len, line, lineMatch;
    files = [];
    for (i = 0, len = statusData.length; i < len; i++) {
      line = statusData[i];
      lineMatch = line.match(/^([ MARCU?!]{2})\s{1}(.*)/);
      if (lineMatch) {
        files.push(lineMatch[2]);
      }
    }
    return files;
  };

  module.exports = function(repo) {
    return git.status(repo).then(function(statusData) {
      var file, i, len, ref, results;
      ref = filesFromData(statusData);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        results.push(atom.workspace.open(file));
      }
      return results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LW9wZW4tY2hhbmdlZC1maWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFFTixhQUFBLEdBQWdCLFNBQUMsVUFBRDtBQUNkLFFBQUE7SUFBQSxLQUFBLEdBQVE7QUFDUixTQUFBLDRDQUFBOztNQUNFLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLDJCQUFYO01BQ1osSUFBMkIsU0FBM0I7UUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFNBQVUsQ0FBQSxDQUFBLENBQXJCLEVBQUE7O0FBRkY7V0FHQTtFQUxjOztFQU9oQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsTUFBSixDQUFXLElBQVgsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixTQUFDLFVBQUQ7QUFDcEIsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQXBCO0FBREY7O0lBRG9CLENBQXRCO0VBRGU7QUFUakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5cbmZpbGVzRnJvbURhdGEgPSAoc3RhdHVzRGF0YSkgLT5cbiAgZmlsZXMgPSBbXVxuICBmb3IgbGluZSBpbiBzdGF0dXNEYXRhXG4gICAgbGluZU1hdGNoID0gbGluZS5tYXRjaCAvXihbIE1BUkNVPyFdezJ9KVxcc3sxfSguKikvXG4gICAgZmlsZXMucHVzaCBsaW5lTWF0Y2hbMl0gaWYgbGluZU1hdGNoXG4gIGZpbGVzXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGF0dXMocmVwbykudGhlbiAoc3RhdHVzRGF0YSkgLT5cbiAgICBmb3IgZmlsZSBpbiBmaWxlc0Zyb21EYXRhKHN0YXR1c0RhdGEpXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUpXG4iXX0=
