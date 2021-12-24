(function() {
  var $$, CompositeDisposable, DiffBranchFilesListView, GitDiff, Path, RevisionView, SelectListView, StatusListView, disposables, fs, git, notifier, prepFile, ref, showFile,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  StatusListView = require('./status-list-view');

  GitDiff = require('../models/git-diff');

  Path = require('path');

  RevisionView = require('./git-revision-view');

  disposables = new CompositeDisposable;

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.general.openInPane')) {
      splitDirection = atom.config.get('git-plus.general.splitPane');
      atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return reject(nothingToShow);
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  module.exports = DiffBranchFilesListView = (function(superClass) {
    extend(DiffBranchFilesListView, superClass);

    function DiffBranchFilesListView() {
      return DiffBranchFilesListView.__super__.constructor.apply(this, arguments);
    }

    DiffBranchFilesListView.prototype.initialize = function(repo, data, branchName, selectedFilePath) {
      this.repo = repo;
      this.data = data;
      this.branchName = branchName;
      DiffBranchFilesListView.__super__.initialize.apply(this, arguments);
      this.setItems(this.parseData(this.data));
      if (this.items.length === 0) {
        notifier.addInfo("The branch '" + this.branchName + "' has no differences");
        return this.cancel();
      }
      if (selectedFilePath) {
        this.confirmed({
          path: this.repo.relativize(selectedFilePath)
        });
      }
      this.show();
      return this.focusFilterEditor();
    };

    DiffBranchFilesListView.prototype.parseData = function(files) {
      var files_list, i, len, line, results, trim_files_string;
      trim_files_string = this.data.replace(/^\n+|\n+$/g, "");
      files_list = trim_files_string.split("\n");
      results = [];
      for (i = 0, len = files_list.length; i < len; i++) {
        line = files_list[i];
        if (/^([ MADRCU?!]{1})\s+(.*)/.test(line)) {
          if (line !== "") {
            line = line.match(/^([ MADRCU?!]{1})\s+(.*)/);
            results.push({
              type: line[1],
              path: line[2]
            });
          } else {
            results.push(void 0);
          }
        }
      }
      return results;
    };

    DiffBranchFilesListView.prototype.confirmed = function(arg) {
      var fullPath, path, promise, type;
      type = arg.type, path = arg.path;
      this.cancel();
      fullPath = Path.join(this.repo.getWorkingDirectory(), path);
      promise = atom.workspace.open(fullPath, {
        split: "left",
        activatePane: false,
        activateItem: true,
        searchAllPanes: false
      });
      return promise.then((function(_this) {
        return function(editor) {
          return RevisionView.showRevision(_this.repo, editor, _this.branchName);
        };
      })(this));
    };

    return DiffBranchFilesListView;

  })(StatusListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9kaWZmLWJyYW5jaC1maWxlcy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0tBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNKLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVI7O0VBQ2pCLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVI7O0VBRWYsV0FBQSxHQUFjLElBQUk7O0VBRWxCLFFBQUEsR0FBVyxTQUFDLFFBQUQ7QUFDVCxRQUFBO0lBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUg7TUFDRSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7TUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQUEsQ0FBMEIsQ0FBQyxhQUEzQixDQUFBLENBQTJDLENBQUEsT0FBQSxHQUFRLGNBQVIsQ0FBM0MsQ0FBQSxFQUZGOztXQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjtFQUpTOztFQU1YLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ1QsSUFBSSxPQUFKLENBQVksU0FBQyxPQUFELEVBQVUsTUFBVjtNQUNWLG9CQUFHLElBQUksQ0FBRSxnQkFBTixLQUFnQixDQUFuQjtlQUNFLE1BQUEsQ0FBTyxhQUFQLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0IsRUFBeUMsU0FBQyxHQUFEO1VBQ3ZDLElBQUcsR0FBSDttQkFBWSxNQUFBLENBQU8sR0FBUCxFQUFaO1dBQUEsTUFBQTttQkFBNEIsT0FBQSxDQUFRLElBQVIsRUFBNUI7O1FBRHVDLENBQXpDLEVBSEY7O0lBRFUsQ0FBWjtFQURTOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7c0NBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVIsRUFBZSxVQUFmLEVBQTRCLGdCQUE1QjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsYUFBRDtNQUN6Qix5REFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxJQUFaLENBQVY7TUFDQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxLQUFpQixDQUFwQjtRQUNFLFFBQVEsQ0FBQyxPQUFULENBQWlCLGNBQUEsR0FBZSxJQUFDLENBQUEsVUFBaEIsR0FBMkIsc0JBQTVDO0FBQ0EsZUFBTyxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRlQ7O01BR0EsSUFBd0QsZ0JBQXhEO1FBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVztVQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsZ0JBQWpCLENBQU47U0FBWCxFQUFBOztNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVJVOztzQ0FVWixTQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1QsVUFBQTtNQUFBLGlCQUFBLEdBQW9CLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFlBQWQsRUFBNEIsRUFBNUI7TUFDcEIsVUFBQSxHQUFhLGlCQUFpQixDQUFDLEtBQWxCLENBQXdCLElBQXhCO0FBQ2I7V0FBQSw0Q0FBQTs7WUFBNEIsMEJBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsSUFBaEM7VUFDMUIsSUFBRyxJQUFBLEtBQVEsRUFBWDtZQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLDBCQUFYO3lCQUNQO2NBQUMsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQVo7Y0FBZ0IsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQTNCO2VBRkY7V0FBQSxNQUFBO2lDQUFBOzs7QUFERjs7SUFIUzs7c0NBUVgsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxpQkFBTTtNQUNqQixJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQVYsRUFBdUMsSUFBdkM7TUFDWCxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQ1I7UUFBQSxLQUFBLEVBQU8sTUFBUDtRQUNBLFlBQUEsRUFBYyxLQURkO1FBRUEsWUFBQSxFQUFjLElBRmQ7UUFHQSxjQUFBLEVBQWdCLEtBSGhCO09BRFE7YUFLVixPQUFPLENBQUMsSUFBUixDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUNYLFlBQVksQ0FBQyxZQUFiLENBQTBCLEtBQUMsQ0FBQSxJQUEzQixFQUFpQyxNQUFqQyxFQUF5QyxLQUFDLENBQUEsVUFBMUM7UUFEVztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtJQVJTOzs7O0tBbkJ5QjtBQTNCdEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5TdGF0dXNMaXN0VmlldyA9IHJlcXVpcmUgJy4vc3RhdHVzLWxpc3QtdmlldydcbkdpdERpZmYgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LWRpZmYnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcblJldmlzaW9uVmlldyA9IHJlcXVpcmUgJy4vZ2l0LXJldmlzaW9uLXZpZXcnXG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5zcGxpdFBhbmUnKVxuICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuXG5wcmVwRmlsZSA9ICh0ZXh0LCBmaWxlUGF0aCkgLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBpZiB0ZXh0Py5sZW5ndGggaXMgMFxuICAgICAgcmVqZWN0IG5vdGhpbmdUb1Nob3dcbiAgICBlbHNlXG4gICAgICBmcy53cml0ZUZpbGUgZmlsZVBhdGgsIHRleHQsIGZsYWc6ICd3KycsIChlcnIpIC0+XG4gICAgICAgIGlmIGVyciB0aGVuIHJlamVjdCBlcnIgZWxzZSByZXNvbHZlIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRGlmZkJyYW5jaEZpbGVzTGlzdFZpZXcgZXh0ZW5kcyBTdGF0dXNMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhLCBAYnJhbmNoTmFtZSwgc2VsZWN0ZWRGaWxlUGF0aCkgLT5cbiAgICBzdXBlclxuICAgIEBzZXRJdGVtcyBAcGFyc2VEYXRhIEBkYXRhXG4gICAgaWYgQGl0ZW1zLmxlbmd0aCBpcyAwXG4gICAgICBub3RpZmllci5hZGRJbmZvKFwiVGhlIGJyYW5jaCAnI3tAYnJhbmNoTmFtZX0nIGhhcyBubyBkaWZmZXJlbmNlc1wiKVxuICAgICAgcmV0dXJuIEBjYW5jZWwoKVxuICAgIEBjb25maXJtZWQocGF0aDogQHJlcG8ucmVsYXRpdml6ZShzZWxlY3RlZEZpbGVQYXRoKSkgaWYgc2VsZWN0ZWRGaWxlUGF0aFxuICAgIEBzaG93KClcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHBhcnNlRGF0YTogKGZpbGVzKSAtPlxuICAgIHRyaW1fZmlsZXNfc3RyaW5nID0gQGRhdGEucmVwbGFjZSAvXlxcbit8XFxuKyQvZywgXCJcIlxuICAgIGZpbGVzX2xpc3QgPSB0cmltX2ZpbGVzX3N0cmluZy5zcGxpdChcIlxcblwiKVxuICAgIGZvciBsaW5lIGluIGZpbGVzX2xpc3Qgd2hlbiAvXihbIE1BRFJDVT8hXXsxfSlcXHMrKC4qKS8udGVzdCBsaW5lXG4gICAgICBpZiBsaW5lICE9IFwiXCJcbiAgICAgICAgbGluZSA9IGxpbmUubWF0Y2ggL14oWyBNQURSQ1U/IV17MX0pXFxzKyguKikvXG4gICAgICAgIHt0eXBlOiBsaW5lWzFdLCBwYXRoOiBsaW5lWzJdfVxuXG4gIGNvbmZpcm1lZDogKHt0eXBlLCBwYXRofSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBmdWxsUGF0aCA9IFBhdGguam9pbihAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHBhdGgpXG4gICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4gZnVsbFBhdGgsXG4gICAgICBzcGxpdDogXCJsZWZ0XCJcbiAgICAgIGFjdGl2YXRlUGFuZTogZmFsc2VcbiAgICAgIGFjdGl2YXRlSXRlbTogdHJ1ZVxuICAgICAgc2VhcmNoQWxsUGFuZXM6IGZhbHNlXG4gICAgcHJvbWlzZS50aGVuIChlZGl0b3IpID0+XG4gICAgICBSZXZpc2lvblZpZXcuc2hvd1JldmlzaW9uKEByZXBvLCBlZGl0b3IsIEBicmFuY2hOYW1lKVxuIl19
