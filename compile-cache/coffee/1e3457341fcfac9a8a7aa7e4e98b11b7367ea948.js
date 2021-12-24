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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9tZXJnZS1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzRUFBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzFCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFFckMsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxLQUFELEVBQVEsSUFBUixFQUFlLElBQWY7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLHNCQUFELE9BQU07TUFDL0IsMENBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7O3VCQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaO01BQ1IsUUFBQSxHQUFXO0FBQ1gsV0FBQSx1Q0FBQTs7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCO1FBQ1AsSUFBTyxJQUFBLEtBQVEsRUFBZjtVQUNFLFFBQVEsQ0FBQyxJQUFULENBQWM7WUFBQyxJQUFBLEVBQU0sSUFBUDtXQUFkLEVBREY7O0FBRkY7TUFJQSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVJTOzt1QkFVWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3VCQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7dUJBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O3VCQUVYLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQURJOzt1QkFHTixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7TUFDWixPQUFBLEdBQVU7TUFDVixJQUFHLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLENBQUg7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYO1FBQ1AsT0FBQSxHQUFVLEtBRlo7O2FBR0EsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFBVSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNSLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBO2NBQ3hCLElBQW9CLE9BQXBCO3VCQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixFQUFBOztZQUR3QixDQUExQjtVQURRO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWO01BREMsQ0FBSDtJQUxXOzt1QkFVYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUFDLENBQUEsS0FBRCxDQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBWCxDQUFzQixDQUFBLENBQUEsQ0FBN0I7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRlM7O3VCQUlYLEtBQUEsR0FBTyxTQUFDLE1BQUQ7QUFDTCxVQUFBO01BQUEsUUFBQSxHQUFXLENBQUMsT0FBRCxDQUFTLENBQUMsTUFBVixDQUFpQixJQUFDLENBQUEsSUFBbEIsQ0FBdUIsQ0FBQyxNQUF4QixDQUErQixDQUFDLE1BQUQsQ0FBL0I7YUFDWCxHQUFBLENBQUksUUFBSixFQUFjO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO1FBQWtDLEtBQUEsRUFBTyxJQUF6QztPQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7QUFDSixjQUFBO1VBQUEsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO1VBQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBUyxnQkFBQSxHQUFpQixNQUFqQixHQUF3QixHQUE1QztXQUFkLEVBQStELE1BQS9ELENBQXRCO1VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQUEsQ0FBK0IsQ0FBQyxPQUFoQyxDQUF3QyxTQUFDLE1BQUQ7bUJBQ3RDLEVBQUUsQ0FBQyxNQUFILENBQVUsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFWLEVBQTRCLFNBQUMsS0FBRDtjQUFXLElBQW9CLENBQUksS0FBeEI7dUJBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQUFBOztZQUFYLENBQTVCO1VBRHNDLENBQXhDO2lCQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7UUFMSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETjtJQUZLOzs7O0tBMUNjO0FBUHZCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBAZGF0YSwgQGFyZ3M9W10pIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGl0ZW1zID0gQGRhdGEuc3BsaXQoXCJcXG5cIilcbiAgICBicmFuY2hlcyA9IFtdXG4gICAgZm9yIGl0ZW0gaW4gaXRlbXNcbiAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgIHVubGVzcyBpdGVtIGlzICcnXG4gICAgICAgIGJyYW5jaGVzLnB1c2gge25hbWU6IGl0ZW19XG4gICAgQHNldEl0ZW1zIGJyYW5jaGVzXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHtuYW1lfSkgLT5cbiAgICBjdXJyZW50ID0gZmFsc2VcbiAgICBpZiBuYW1lLnN0YXJ0c1dpdGggXCIqXCJcbiAgICAgIG5hbWUgPSBuYW1lLnNsaWNlKDEpXG4gICAgICBjdXJyZW50ID0gdHJ1ZVxuICAgICQkIC0+XG4gICAgICBAbGkgbmFtZSwgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBzcGFuKCdDdXJyZW50JykgaWYgY3VycmVudFxuXG4gIGNvbmZpcm1lZDogKHtuYW1lfSkgLT5cbiAgICBAbWVyZ2UgbmFtZS5tYXRjaCgvXFwqPyguKikvKVsxXVxuICAgIEBjYW5jZWwoKVxuXG4gIG1lcmdlOiAoYnJhbmNoKSAtPlxuICAgIG1lcmdlQXJnID0gWydtZXJnZSddLmNvbmNhdChAYXJncykuY29uY2F0IFticmFuY2hdXG4gICAgZ2l0KG1lcmdlQXJnLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwgY29sb3I6IHRydWUpXG4gICAgLnRoZW4gKHJlc3VsdCkgPT5cbiAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoT2JqZWN0LmFzc2lnbih7cmVwb05hbWUsIG1lc3NhZ2U6IFwiTWVyZ2UgYnJhbmNoICcje2JyYW5jaH0nXCJ9LCByZXN1bHQpKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoIChlZGl0b3IpIC0+XG4gICAgICAgIGZzLmV4aXN0cyBlZGl0b3IuZ2V0UGF0aCgpLCAoZXhpc3QpIC0+IGVkaXRvci5kZXN0cm95KCkgaWYgbm90IGV4aXN0XG4gICAgICBnaXQucmVmcmVzaCBAcmVwb1xuIl19
