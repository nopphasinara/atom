(function() {
  var $$, ActivityLogger, ListView, Repository, SelectListView, fs, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo1, data, args) {
      this.repo = repo1;
      this.data = data;
      this.args = args != null ? args : [];
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, i, item, items, len;
      items = this.data.split("\n");
      branches = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
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
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var name;
      name = arg.name;
      this.merge(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.merge = function(branch) {
      var mergeArg;
      mergeArg = ['merge'].concat(this.args).concat([branch]);
      return git(mergeArg, {
        cwd: this.repo.getWorkingDirectory(),
        color: true
      }).then((function(_this) {
        return function(result) {
          var repoName;
          repoName = new Repository(repo).getName();
          ActivityLogger.record(Object.assign({
            repoName: repoName,
            message: "Merge branch '" + branch + "'"
          }, result));
          atom.workspace.getTextEditors().forEach(function(editor) {
            return fs.exists(editor.getPath(), function(exist) {
              if (!exist) {
                return editor.destroy();
              }
            });
          });
          return git.refresh(_this.repo);
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvbWVyZ2UtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMxQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsS0FBRCxFQUFRLElBQVIsRUFBZSxJQUFmO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxzQkFBRCxPQUFNO01BQy9CLDBDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOzt1QkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWjtNQUNSLFFBQUEsR0FBVztBQUNYLFdBQUEsdUNBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQjtRQUNQLElBQU8sSUFBQSxLQUFRLEVBQWY7VUFDRSxRQUFRLENBQUMsSUFBVCxDQUFjO1lBQUMsSUFBQSxFQUFNLElBQVA7V0FBZCxFQURGOztBQUZGO01BSUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSUzs7dUJBVVgsWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzt1QkFFZCxJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7O3VCQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzt1QkFFWCxJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFESTs7dUJBR04sV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO01BQ1osT0FBQSxHQUFVO01BQ1YsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFIO1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWDtRQUNQLE9BQUEsR0FBVSxLQUZaOzthQUdBLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDUixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQTtjQUN4QixJQUFvQixPQUFwQjt1QkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sRUFBQTs7WUFEd0IsQ0FBMUI7VUFEUTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVjtNQURDLENBQUg7SUFMVzs7dUJBVWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFNBQVgsQ0FBc0IsQ0FBQSxDQUFBLENBQTdCO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZTOzt1QkFJWCxLQUFBLEdBQU8sU0FBQyxNQUFEO0FBQ0wsVUFBQTtNQUFBLFFBQUEsR0FBVyxDQUFDLE9BQUQsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBQyxDQUFBLElBQWxCLENBQXVCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxNQUFELENBQS9CO2FBQ1gsR0FBQSxDQUFJLFFBQUosRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtRQUFrQyxLQUFBLEVBQU8sSUFBekM7T0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ0osY0FBQTtVQUFBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTtVQUNYLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQU0sQ0FBQyxNQUFQLENBQWM7WUFBQyxVQUFBLFFBQUQ7WUFBVyxPQUFBLEVBQVMsZ0JBQUEsR0FBaUIsTUFBakIsR0FBd0IsR0FBNUM7V0FBZCxFQUErRCxNQUEvRCxDQUF0QjtVQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUFBLENBQStCLENBQUMsT0FBaEMsQ0FBd0MsU0FBQyxNQUFEO21CQUN0QyxFQUFFLENBQUMsTUFBSCxDQUFVLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBVixFQUE0QixTQUFDLEtBQUQ7Y0FBVyxJQUFvQixDQUFJLEtBQXhCO3VCQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFBQTs7WUFBWCxDQUE1QjtVQURzQyxDQUF4QztpQkFFQSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQUMsQ0FBQSxJQUFiO1FBTEk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE47SUFGSzs7OztLQTFDYztBQVB2QiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbnskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5naXQgPSByZXF1aXJlKCcuLi9naXQtZXMnKS5kZWZhdWx0XG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEsIEBhcmdzPVtdKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgYnJhbmNoZXMgPSBbXVxuICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9cXHMvZywgJycpXG4gICAgICB1bmxlc3MgaXRlbSBpcyAnJ1xuICAgICAgICBicmFuY2hlcy5wdXNoIHtuYW1lOiBpdGVtfVxuICAgIEBzZXRJdGVtcyBicmFuY2hlc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnbmFtZSdcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgY3VycmVudCA9IGZhbHNlXG4gICAgaWYgbmFtZS5zdGFydHNXaXRoIFwiKlwiXG4gICAgICBuYW1lID0gbmFtZS5zbGljZSgxKVxuICAgICAgY3VycmVudCA9IHRydWVcbiAgICAkJCAtPlxuICAgICAgQGxpIG5hbWUsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAc3BhbignQ3VycmVudCcpIGlmIGN1cnJlbnRcblxuICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgQG1lcmdlIG5hbWUubWF0Y2goL1xcKj8oLiopLylbMV1cbiAgICBAY2FuY2VsKClcblxuICBtZXJnZTogKGJyYW5jaCkgLT5cbiAgICBtZXJnZUFyZyA9IFsnbWVyZ2UnXS5jb25jYXQoQGFyZ3MpLmNvbmNhdCBbYnJhbmNoXVxuICAgIGdpdChtZXJnZUFyZywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIGNvbG9yOiB0cnVlKVxuICAgIC50aGVuIChyZXN1bHQpID0+XG4gICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKE9iamVjdC5hc3NpZ24oe3JlcG9OYW1lLCBtZXNzYWdlOiBcIk1lcmdlIGJyYW5jaCAnI3ticmFuY2h9J1wifSwgcmVzdWx0KSlcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSAtPlxuICAgICAgICBmcy5leGlzdHMgZWRpdG9yLmdldFBhdGgoKSwgKGV4aXN0KSAtPiBlZGl0b3IuZGVzdHJveSgpIGlmIG5vdCBleGlzdFxuICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiJdfQ==
