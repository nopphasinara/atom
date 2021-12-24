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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdGUtYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7OztFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUVqQixhQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLE1BQVA7V0FDZCxJQUFJLENBQUMsVUFBTCxDQUFnQixNQUFBLEdBQVMsR0FBekIsQ0FBQSxJQUFrQyxDQUFJLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZDtFQUR4Qjs7RUFHaEIsTUFBTSxDQUFDLE9BQVAsR0FDUTs7Ozs7OzttQ0FDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixTQUFoQjtNQUFPLElBQUMsQ0FBQSxTQUFEO2FBQ2pCLHFEQUFNLElBQU4sRUFBWSxTQUFaO0lBRFU7O21DQUdaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQWlCLENBQUMsR0FBbEIsQ0FBc0IsU0FBQyxJQUFEO2VBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCO01BQVYsQ0FBdEI7TUFDUixRQUFBLEdBQVcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFBVSxhQUFBLENBQWMsSUFBZCxFQUFvQixLQUFDLENBQUEsTUFBckI7UUFBVjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYixDQUFvRCxDQUFDLEdBQXJELENBQXlELFNBQUMsSUFBRDtlQUFVO1VBQUMsSUFBQSxFQUFNLElBQVA7O01BQVYsQ0FBekQ7TUFDWCxJQUFHLFFBQVEsQ0FBQyxNQUFULEtBQW1CLENBQXRCO1FBQ0UsSUFBQyxDQUFBLFNBQUQsQ0FBVyxRQUFTLENBQUEsQ0FBQSxDQUFwQixFQURGO09BQUEsTUFBQTtRQUdFLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUhGOzthQUlBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUFM7Ozs7S0FKc0I7QUFOckMiLCJzb3VyY2VzQ29udGVudCI6WyJCcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4vYnJhbmNoLWxpc3QtdmlldydcblxuaXNWYWxpZEJyYW5jaCA9IChpdGVtLCByZW1vdGUpIC0+XG4gIGl0ZW0uc3RhcnRzV2l0aChyZW1vdGUgKyAnLycpIGFuZCBub3QgaXRlbS5pbmNsdWRlcygnL0hFQUQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFJlbW90ZUJyYW5jaExpc3RWaWV3IGV4dGVuZHMgQnJhbmNoTGlzdFZpZXdcbiAgICBpbml0aWFsaXplOiAoZGF0YSwgQHJlbW90ZSwgb25Db25maXJtKSAtPlxuICAgICAgc3VwZXIoZGF0YSwgb25Db25maXJtKVxuXG4gICAgcGFyc2VEYXRhOiAtPlxuICAgICAgaXRlbXMgPSBAZGF0YS5zcGxpdChcIlxcblwiKS5tYXAgKGl0ZW0pIC0+IGl0ZW0ucmVwbGFjZSgvXFxzL2csICcnKVxuICAgICAgYnJhbmNoZXMgPSBpdGVtcy5maWx0ZXIoKGl0ZW0pID0+IGlzVmFsaWRCcmFuY2goaXRlbSwgQHJlbW90ZSkpLm1hcCAoaXRlbSkgLT4ge25hbWU6IGl0ZW19XG4gICAgICBpZiBicmFuY2hlcy5sZW5ndGggaXMgMVxuICAgICAgICBAY29uZmlybWVkIGJyYW5jaGVzWzBdXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRJdGVtcyBicmFuY2hlc1xuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiJdfQ==
