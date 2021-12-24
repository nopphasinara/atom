(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  fs = require('fs-plus');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(superClass) {
    extend(StatusListView, superClass);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(this.parseData(this.data));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var i, len, line, results;
      results = [];
      for (i = 0, len = files.length; i < len; i++) {
        line = files[i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        results.push({
          type: line[1],
          path: line[2]
        });
      }
      return results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.getEmptyMessage = function() {
      return "Nothing to commit, working directory clean.";
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(arg) {
      var getIcon, path, type;
      type = arg.type, path = arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(arg) {
      var fullPath, openFile, path, type;
      type = arg.type, path = arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zdGF0dXMtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUVBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBQ1YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7NkJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQ2xCLGdEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxJQUFaLENBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUpVOzs2QkFNWixTQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1QsVUFBQTtBQUFBO1dBQUEsdUNBQUE7O2NBQXVCLDRCQUE0QixDQUFDLElBQTdCLENBQWtDLElBQWxDOzs7UUFDckIsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsNEJBQVg7cUJBQ1A7VUFBQyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWjtVQUFnQixJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBM0I7O0FBRkY7O0lBRFM7OzZCQUtYLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7NkJBRWQsZUFBQSxHQUFpQixTQUFBO2FBQUc7SUFBSDs7NkJBRWpCLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7NkJBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7OzZCQUVYLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzs2QkFFTixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLGlCQUFNO01BQ25CLE9BQUEsR0FBVSxTQUFDLENBQUQ7UUFDUixJQUE4QyxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsR0FBdEQ7QUFBQSxpQkFBTyxvQ0FBUDs7UUFDQSxJQUFrRCxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsR0FBMUQ7QUFBQSxpQkFBTyx3Q0FBUDs7UUFDQSxJQUFrRCxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsR0FBMUQ7QUFBQSxpQkFBTyx3Q0FBUDs7UUFDQSxJQUFvRCxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsR0FBUixJQUFlLENBQUUsQ0FBQSxDQUFBLENBQUYsS0FBUSxHQUEzRTtBQUFBLGlCQUFPLDBDQUFQOztBQUNBLGVBQU87TUFMQzthQU9WLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ0YsS0FBQyxDQUFBLEdBQUQsQ0FDRTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sc0JBQVA7Y0FDQSxLQUFBLEVBQU8sK0NBRFA7YUFERixFQUdFLElBSEY7WUFJQSxLQUFDLENBQUEsSUFBRCxDQUFNO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFBLENBQVEsSUFBUixDQUFQO2FBQU47bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFOO1VBTkU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7TUFEQyxDQUFIO0lBUlc7OzZCQWlCYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLGlCQUFNO01BQ2pCLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFHLElBQUEsS0FBUSxJQUFYO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFDLENBQUEsSUFBVCxFQUFlO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBZixFQURGO09BQUEsTUFBQTtRQUdFLFFBQUEsR0FBVyxPQUFBLENBQVEsT0FBQSxHQUFRLElBQVIsR0FBYSxHQUFyQjtRQUNYLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFWLEVBQXVDLElBQXZDO2VBRVgsRUFBRSxDQUFDLElBQUgsQ0FBUSxRQUFSLEVBQWtCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRCxFQUFNLElBQU47QUFDaEIsZ0JBQUE7WUFBQSxJQUFHLEdBQUg7cUJBQ0UsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBRyxDQUFDLE9BQXRCLEVBREY7YUFBQSxNQUFBO2NBR0UsV0FBQSxrQkFBYyxJQUFJLENBQUUsV0FBTixDQUFBO2NBQ2QsSUFBRyxRQUFIO2dCQUNFLElBQUcsV0FBSDt5QkFDRSxJQUFJLENBQUMsSUFBTCxDQUFVO29CQUFBLFdBQUEsRUFBYSxRQUFiO29CQUF1QixTQUFBLEVBQVcsSUFBbEM7bUJBQVYsRUFERjtpQkFBQSxNQUFBO3lCQUdFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixFQUhGO2lCQURGO2VBQUEsTUFBQTt1QkFNRSxPQUFBLENBQVEsS0FBQyxDQUFBLElBQVQsRUFBZTtrQkFBQSxJQUFBLEVBQU0sSUFBTjtpQkFBZixFQU5GO2VBSkY7O1VBRGdCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQixFQU5GOztJQUZTOzs7O0tBMUNnQjtBQVI3QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkdpdERpZmYgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LWRpZmYnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdGF0dXNMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIEBwYXJzZURhdGEgQGRhdGFcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHBhcnNlRGF0YTogKGZpbGVzKSAtPlxuICAgIGZvciBsaW5lIGluIGZpbGVzIHdoZW4gL14oWyBNQURSQ1U/IV17Mn0pXFxzezF9KC4qKS8udGVzdCBsaW5lXG4gICAgICBsaW5lID0gbGluZS5tYXRjaCAvXihbIE1BRFJDVT8hXXsyfSlcXHN7MX0oLiopL1xuICAgICAge3R5cGU6IGxpbmVbMV0sIHBhdGg6IGxpbmVbMl19XG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAncGF0aCdcblxuICBnZXRFbXB0eU1lc3NhZ2U6IC0+IFwiTm90aGluZyB0byBjb21taXQsIHdvcmtpbmcgZGlyZWN0b3J5IGNsZWFuLlwiXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHt0eXBlLCBwYXRofSkgLT5cbiAgICBnZXRJY29uID0gKHMpIC0+XG4gICAgICByZXR1cm4gJ3N0YXR1cy1hZGRlZCBpY29uIGljb24tZGlmZi1hZGRlZCcgaWYgc1swXSBpcyAnQSdcbiAgICAgIHJldHVybiAnc3RhdHVzLXJlbW92ZWQgaWNvbiBpY29uLWRpZmYtcmVtb3ZlZCcgaWYgc1swXSBpcyAnRCdcbiAgICAgIHJldHVybiAnc3RhdHVzLXJlbmFtZWQgaWNvbiBpY29uLWRpZmYtcmVuYW1lZCcgaWYgc1swXSBpcyAnUidcbiAgICAgIHJldHVybiAnc3RhdHVzLW1vZGlmaWVkIGljb24gaWNvbi1kaWZmLW1vZGlmaWVkJyBpZiBzWzBdIGlzICdNJyBvciBzWzFdIGlzICdNJ1xuICAgICAgcmV0dXJuICcnXG5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXZcbiAgICAgICAgICBjbGFzczogJ3B1bGwtcmlnaHQgaGlnaGxpZ2h0J1xuICAgICAgICAgIHN0eWxlOiAnd2hpdGUtc3BhY2U6IHByZS13cmFwOyBmb250LWZhbWlseTogbW9ub3NwYWNlJ1xuICAgICAgICAgIHR5cGVcbiAgICAgICAgQHNwYW4gY2xhc3M6IGdldEljb24odHlwZSlcbiAgICAgICAgQHNwYW4gcGF0aFxuXG4gIGNvbmZpcm1lZDogKHt0eXBlLCBwYXRofSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBpZiB0eXBlIGlzICc/PydcbiAgICAgIGdpdC5hZGQgQHJlcG8sIGZpbGU6IHBhdGhcbiAgICBlbHNlXG4gICAgICBvcGVuRmlsZSA9IGNvbmZpcm0oXCJPcGVuICN7cGF0aH0/XCIpXG4gICAgICBmdWxsUGF0aCA9IFBhdGguam9pbihAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHBhdGgpXG5cbiAgICAgIGZzLnN0YXQgZnVsbFBhdGgsIChlcnIsIHN0YXQpID0+XG4gICAgICAgIGlmIGVyclxuICAgICAgICAgIG5vdGlmaWVyLmFkZEVycm9yKGVyci5tZXNzYWdlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaXNEaXJlY3RvcnkgPSBzdGF0Py5pc0RpcmVjdG9yeSgpXG4gICAgICAgICAgaWYgb3BlbkZpbGVcbiAgICAgICAgICAgIGlmIGlzRGlyZWN0b3J5XG4gICAgICAgICAgICAgIGF0b20ub3BlbihwYXRoc1RvT3BlbjogZnVsbFBhdGgsIG5ld1dpbmRvdzogdHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmdWxsUGF0aClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBHaXREaWZmKEByZXBvLCBmaWxlOiBwYXRoKVxuIl19
