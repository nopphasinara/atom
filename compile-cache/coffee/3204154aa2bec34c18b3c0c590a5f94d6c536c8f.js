(function() {
  var $$, ListView, SelectListView, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function() {
      ListView.__super__.initialize.apply(this, arguments);
      this.currentPane = atom.workspace.getActivePane();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
          return _this.setup();
        };
      })(this));
    };

    ListView.prototype.getFilterKey = function() {
      return 'path';
    };

    ListView.prototype.setup = function() {
      this.setItems(atom.project.getPaths().map(function(p) {
        return {
          path: p,
          relativized: p.substring(p.lastIndexOf('/') + 1)
        };
      }));
      return this.show();
    };

    ListView.prototype.show = function() {
      this.filterEditorView.getModel().placeholderText = 'Initialize new repo where?';
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.focusFilterEditor();
      return this.storeFocusedElement();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.viewForItem = function(arg) {
      var path, relativized;
      path = arg.path, relativized = arg.relativized;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, relativized);
            return _this.div({
              "class": 'text-info'
            }, path);
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var path;
      path = arg.path;
      this.resolve(path);
      return this.cancel();
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBOzs7RUFBQSxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUE7TUFDViwwQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTthQUNmLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO1VBQ3BCLEtBQUMsQ0FBQSxPQUFELEdBQVc7VUFDWCxLQUFDLENBQUEsTUFBRCxHQUFVO2lCQUNWLEtBQUMsQ0FBQSxLQUFELENBQUE7UUFIb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFIQTs7dUJBUVosWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzt1QkFFZCxLQUFBLEdBQU8sU0FBQTtNQUNMLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxHQUF4QixDQUE0QixTQUFDLENBQUQ7QUFDcEMsZUFBTztVQUNMLElBQUEsRUFBTSxDQUREO1VBRUwsV0FBQSxFQUFhLENBQUMsQ0FBQyxTQUFGLENBQVksQ0FBQyxDQUFDLFdBQUYsQ0FBYyxHQUFkLENBQUEsR0FBbUIsQ0FBL0IsQ0FGUjs7TUFENkIsQ0FBNUIsQ0FBVjthQUtBLElBQUMsQ0FBQSxJQUFELENBQUE7SUFOSzs7dUJBUVAsSUFBQSxHQUFNLFNBQUE7TUFDSixJQUFDLENBQUEsZ0JBQWdCLENBQUMsUUFBbEIsQ0FBQSxDQUE0QixDQUFDLGVBQTdCLEdBQStDOztRQUMvQyxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFMSTs7dUJBT04sSUFBQSxHQUFNLFNBQUE7QUFBRyxVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBQUg7O3VCQUVOLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQURTOzt1QkFHWCxXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLGlCQUFNO2FBQ25CLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ0YsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixXQUE5QjttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUwsRUFBeUIsSUFBekI7VUFGRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtNQURDLENBQUg7SUFEVzs7dUJBTWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFUO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZTOzs7O0tBckNVO0FBSnpCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gICAgaW5pdGlhbGl6ZTogLT5cbiAgICAgIHN1cGVyXG4gICAgICBAY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIEByZXN1bHQgPSBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICBAcmVzb2x2ZSA9IHJlc29sdmVcbiAgICAgICAgQHJlamVjdCA9IHJlamVjdFxuICAgICAgICBAc2V0dXAoKVxuXG4gICAgZ2V0RmlsdGVyS2V5OiAtPiAncGF0aCdcblxuICAgIHNldHVwOiAtPlxuICAgICAgQHNldEl0ZW1zIGF0b20ucHJvamVjdC5nZXRQYXRocygpLm1hcCAocCkgLT5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwYXRoOiBwXG4gICAgICAgICAgcmVsYXRpdml6ZWQ6IHAuc3Vic3RyaW5nKHAubGFzdEluZGV4T2YoJy8nKSsxKVxuICAgICAgICB9XG4gICAgICBAc2hvdygpXG5cbiAgICBzaG93OiAtPlxuICAgICAgQGZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5wbGFjZWhvbGRlclRleHQgPSAnSW5pdGlhbGl6ZSBuZXcgcmVwbyB3aGVyZT8nXG4gICAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiAgICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICAgIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgICBjYW5jZWxsZWQ6IC0+XG4gICAgICBAaGlkZSgpXG5cbiAgICB2aWV3Rm9ySXRlbTogKHtwYXRoLCByZWxhdGl2aXplZH0pIC0+XG4gICAgICAkJCAtPlxuICAgICAgICBAbGkgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1oaWdobGlnaHQnLCByZWxhdGl2aXplZFxuICAgICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWluZm8nLCBwYXRoXG5cbiAgICBjb25maXJtZWQ6ICh7cGF0aH0pIC0+XG4gICAgICBAcmVzb2x2ZSBwYXRoXG4gICAgICBAY2FuY2VsKClcbiJdfQ==
