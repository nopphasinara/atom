(function() {
  var BranchListView, RemoteBranchListView, isValidBranch,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BranchListView = require('./branch-list-view');

  isValidBranch = function(item, remote) {
    return item.startsWith(remote + '/') && !item.includes('/HEAD');
  };

  module.exports = RemoteBranchListView = (function(superClass) {
    extend(RemoteBranchListView, superClass);

    function RemoteBranchListView() {
      return RemoteBranchListView.__super__.constructor.apply(this, arguments);
    }

    RemoteBranchListView.prototype.initialize = function(data, remote1, onConfirm) {
      this.remote = remote1;
      return RemoteBranchListView.__super__.initialize.call(this, data, onConfirm);
    };

    RemoteBranchListView.prototype.parseData = function() {
      var branches, items;
      items = this.data.split("\n").map(function(item) {
        return item.replace(/\s/g, '');
      });
      branches = items.filter((function(_this) {
        return function(item) {
          return isValidBranch(item, _this.remote);
        };
      })(this)).map(function(item) {
        return {
          name: item
        };
      });
      if (branches.length === 1) {
        this.confirmed(branches[0]);
      } else {
        this.setItems(branches);
      }
      return this.focusFilterEditor();
    };

    return RemoteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWJyYW5jaC1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBOzs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFFakIsYUFBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQO1dBQ2QsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsTUFBQSxHQUFTLEdBQXpCLENBQUEsSUFBa0MsQ0FBSSxJQUFJLENBQUMsUUFBTCxDQUFjLE9BQWQ7RUFEeEI7O0VBR2hCLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7bUNBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsU0FBaEI7TUFBTyxJQUFDLENBQUEsU0FBRDthQUNqQixxREFBTSxJQUFOLEVBQVksU0FBWjtJQURVOzttQ0FHWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixDQUFpQixDQUFDLEdBQWxCLENBQXNCLFNBQUMsSUFBRDtlQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQjtNQUFWLENBQXRCO01BQ1IsUUFBQSxHQUFXLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQVUsYUFBQSxDQUFjLElBQWQsRUFBb0IsS0FBQyxDQUFBLE1BQXJCO1FBQVY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWIsQ0FBb0QsQ0FBQyxHQUFyRCxDQUF5RCxTQUFDLElBQUQ7ZUFBVTtVQUFDLElBQUEsRUFBTSxJQUFQOztNQUFWLENBQXpEO01BQ1gsSUFBRyxRQUFRLENBQUMsTUFBVCxLQUFtQixDQUF0QjtRQUNFLElBQUMsQ0FBQSxTQUFELENBQVcsUUFBUyxDQUFBLENBQUEsQ0FBcEIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFIRjs7YUFJQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVBTOzs7O0tBSnNCO0FBTnJDIiwic291cmNlc0NvbnRlbnQiOlsiQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuL2JyYW5jaC1saXN0LXZpZXcnXG5cbmlzVmFsaWRCcmFuY2ggPSAoaXRlbSwgcmVtb3RlKSAtPlxuICBpdGVtLnN0YXJ0c1dpdGgocmVtb3RlICsgJy8nKSBhbmQgbm90IGl0ZW0uaW5jbHVkZXMoJy9IRUFEJylcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBSZW1vdGVCcmFuY2hMaXN0VmlldyBleHRlbmRzIEJyYW5jaExpc3RWaWV3XG4gICAgaW5pdGlhbGl6ZTogKGRhdGEsIEByZW1vdGUsIG9uQ29uZmlybSkgLT5cbiAgICAgIHN1cGVyKGRhdGEsIG9uQ29uZmlybSlcblxuICAgIHBhcnNlRGF0YTogLT5cbiAgICAgIGl0ZW1zID0gQGRhdGEuc3BsaXQoXCJcXG5cIikubWFwIChpdGVtKSAtPiBpdGVtLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgIGJyYW5jaGVzID0gaXRlbXMuZmlsdGVyKChpdGVtKSA9PiBpc1ZhbGlkQnJhbmNoKGl0ZW0sIEByZW1vdGUpKS5tYXAgKGl0ZW0pIC0+IHtuYW1lOiBpdGVtfVxuICAgICAgaWYgYnJhbmNoZXMubGVuZ3RoIGlzIDFcbiAgICAgICAgQGNvbmZpcm1lZCBicmFuY2hlc1swXVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0SXRlbXMgYnJhbmNoZXNcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG4iXX0=
