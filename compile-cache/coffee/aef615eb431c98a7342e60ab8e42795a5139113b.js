(function() {
  var $$, ListView, SelectListView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(data, onConfirm) {
      this.data = data;
      this.onConfirm = onConfirm;
      ListView.__super__.initialize.apply(this, arguments);
      this.addClass('git-branch');
      this.show();
      this.parseData();
      return this.currentPane = atom.workspace.getActivePane();
    };

    ListView.prototype.parseData = function() {
      var branches, items;
      items = this.data.split("\n");
      branches = [];
      items.forEach(function(item) {
        var name;
        item = item.replace(/\s/g, '');
        name = item.startsWith("*") ? item.slice(1) : item;
        if (item !== '') {
          return branches.push({
            name: name
          });
        }
      });
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg) {
      var current, name;
      name = arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('HEAD');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(item) {
      var ref1;
      this.onConfirm(item);
      this.cancel();
      if ((ref1 = this.currentPane) != null ? ref1.isAlive() : void 0) {
        return this.currentPane.activate();
      }
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3VCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxTQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsWUFBRDtNQUNsQiwwQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO0lBTEw7O3VCQU9aLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaO01BQ1IsUUFBQSxHQUFXO01BQ1gsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFDLElBQUQ7QUFDWixZQUFBO1FBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQjtRQUNQLElBQUEsR0FBVSxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFILEdBQTZCLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxDQUE3QixHQUFnRDtRQUN2RCxJQUE2QixJQUFBLEtBQVEsRUFBckM7aUJBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYztZQUFDLE1BQUEsSUFBRDtXQUFkLEVBQUE7O01BSFksQ0FBZDtNQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUlM7O3VCQVVYLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7dUJBRWQsSUFBQSxHQUFNLFNBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUhJOzt1QkFLTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7dUJBRVgsSUFBQSxHQUFNLFNBQUE7QUFBRyxVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBQUg7O3VCQUVOLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsT0FBRDtNQUNaLE9BQUEsR0FBVTtNQUNWLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBSDtRQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVg7UUFDUCxPQUFBLEdBQVUsS0FGWjs7YUFHQSxFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksSUFBSixFQUFVLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ1IsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDthQUFMLEVBQTBCLFNBQUE7Y0FDeEIsSUFBaUIsT0FBakI7dUJBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBQUE7O1lBRHdCLENBQTFCO1VBRFE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7TUFEQyxDQUFIO0lBTFc7O3VCQVViLFNBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxVQUFBO01BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYO01BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLDRDQUF1QyxDQUFFLE9BQWQsQ0FBQSxVQUEzQjtlQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLEVBQUE7O0lBSFM7Ozs7S0F2Q1U7QUFIdkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAZGF0YSwgQG9uQ29uZmlybSkgLT5cbiAgICBzdXBlclxuICAgIEBhZGRDbGFzcygnZ2l0LWJyYW5jaCcpXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgYnJhbmNoZXMgPSBbXVxuICAgIGl0ZW1zLmZvckVhY2ggKGl0ZW0pIC0+XG4gICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9cXHMvZywgJycpXG4gICAgICBuYW1lID0gaWYgaXRlbS5zdGFydHNXaXRoKFwiKlwiKSB0aGVuIGl0ZW0uc2xpY2UoMSkgZWxzZSBpdGVtXG4gICAgICBicmFuY2hlcy5wdXNoKHtuYW1lfSkgdW5sZXNzIGl0ZW0gaXMgJydcbiAgICBAc2V0SXRlbXMgYnJhbmNoZXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHtuYW1lfSkgLT5cbiAgICBjdXJyZW50ID0gZmFsc2VcbiAgICBpZiBuYW1lLnN0YXJ0c1dpdGggXCIqXCJcbiAgICAgIG5hbWUgPSBuYW1lLnNsaWNlKDEpXG4gICAgICBjdXJyZW50ID0gdHJ1ZVxuICAgICQkIC0+XG4gICAgICBAbGkgbmFtZSwgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBzcGFuKCdIRUFEJykgaWYgY3VycmVudFxuXG4gIGNvbmZpcm1lZDogKGl0ZW0pIC0+XG4gICAgQG9uQ29uZmlybShpdGVtKVxuICAgIEBjYW5jZWwoKVxuICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpIGlmIEBjdXJyZW50UGFuZT8uaXNBbGl2ZSgpXG4iXX0=
