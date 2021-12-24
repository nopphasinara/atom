(function() {
  var $$, BufferedProcess, CherryPickSelectBranch, CherryPickSelectCommits, SelectListView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  CherryPickSelectCommits = require('./cherry-pick-select-commits-view');

  module.exports = CherryPickSelectBranch = (function(superClass) {
    extend(CherryPickSelectBranch, superClass);

    function CherryPickSelectBranch() {
      return CherryPickSelectBranch.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectBranch.prototype.initialize = function(repo, items, currentHead) {
      this.repo = repo;
      this.currentHead = currentHead;
      CherryPickSelectBranch.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    CherryPickSelectBranch.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectBranch.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectBranch.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectBranch.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li(item);
      });
    };

    CherryPickSelectBranch.prototype.confirmed = function(item) {
      var args;
      this.cancel();
      args = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', this.currentHead + "..." + item];
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(save) {
          if (save.length > 0) {
            return new CherryPickSelectCommits(_this.repo, save.split('\0').slice(0, -1));
          } else {
            return notifier.addInfo("No commits available to cherry-pick.");
          }
        };
      })(this));
    };

    return CherryPickSelectBranch;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtYnJhbmNoLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3R0FBQTtJQUFBOzs7RUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLHVCQUFBLEdBQTBCLE9BQUEsQ0FBUSxtQ0FBUjs7RUFFMUIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztxQ0FFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUixFQUFlLFdBQWY7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFjLElBQUMsQ0FBQSxjQUFEO01BQ3pCLHdEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFKVTs7cUNBTVosSUFBQSxHQUFNLFNBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFFQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUpJOztxQ0FNTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7cUNBRVgsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBREk7O3FDQUdOLFdBQUEsR0FBYSxTQUFDLElBQUQ7YUFDWCxFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksSUFBSjtNQURDLENBQUg7SUFEVzs7cUNBSWIsU0FBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFVBQUE7TUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQSxHQUFPLENBQ0wsS0FESyxFQUVMLGVBRkssRUFHTCxJQUhLLEVBSUwsMkJBSkssRUFLRixJQUFDLENBQUEsV0FBRixHQUFjLEtBQWQsR0FBbUIsSUFMaEI7YUFRUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDSixJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakI7bUJBQ0UsSUFBSSx1QkFBSixDQUE0QixLQUFDLENBQUEsSUFBN0IsRUFBbUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLGFBQXBELEVBREY7V0FBQSxNQUFBO21CQUdFLFFBQVEsQ0FBQyxPQUFULENBQWlCLHNDQUFqQixFQUhGOztRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROO0lBVlM7Ozs7S0F2QndCO0FBUnJDIiwic291cmNlc0NvbnRlbnQiOlsie0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkNoZXJyeVBpY2tTZWxlY3RDb21taXRzID0gcmVxdWlyZSAnLi9jaGVycnktcGljay1zZWxlY3QtY29tbWl0cy12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaGVycnlQaWNrU2VsZWN0QnJhbmNoIGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIGl0ZW1zLCBAY3VycmVudEhlYWQpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSBpdGVtXG5cbiAgY29uZmlybWVkOiAoaXRlbSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBhcmdzID0gW1xuICAgICAgJ2xvZydcbiAgICAgICctLWNoZXJyeS1waWNrJ1xuICAgICAgJy16J1xuICAgICAgJy0tZm9ybWF0PSVIJW4lYW4lbiVhciVuJXMnXG4gICAgICBcIiN7QGN1cnJlbnRIZWFkfS4uLiN7aXRlbX1cIlxuICAgIF1cblxuICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKHNhdmUpID0+XG4gICAgICBpZiBzYXZlLmxlbmd0aCA+IDBcbiAgICAgICAgbmV3IENoZXJyeVBpY2tTZWxlY3RDb21taXRzKEByZXBvLCBzYXZlLnNwbGl0KCdcXDAnKVsuLi4tMV0pXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyBjb21taXRzIGF2YWlsYWJsZSB0byBjaGVycnktcGljay5cIlxuIl19
