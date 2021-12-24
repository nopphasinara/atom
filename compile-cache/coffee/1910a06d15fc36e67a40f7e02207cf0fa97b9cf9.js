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

    ListView.prototype.initialize = function(repos) {
      this.repos = repos;
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
      return 'name';
    };

    ListView.prototype.setup = function() {
      this.repos = this.repos.map(function(r) {
        var path;
        path = r.getWorkingDirectory();
        return {
          name: path.substring(path.lastIndexOf('/') + 1),
          repo: r
        };
      });
      this.setItems(this.repos);
      return this.show();
    };

    ListView.prototype.show = function() {
      this.filterEditorView.getModel().placeholderText = 'Which repo?';
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
      var name;
      name = arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var repo;
      repo = arg.repo;
      this.resolve(repo);
      return this.cancel();
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZXBvLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDUTs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxLQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7TUFDWCwwQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTthQUNmLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO1VBQ3BCLEtBQUMsQ0FBQSxPQUFELEdBQVc7VUFDWCxLQUFDLENBQUEsTUFBRCxHQUFVO2lCQUNWLEtBQUMsQ0FBQSxLQUFELENBQUE7UUFIb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFIQTs7dUJBUVosWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzt1QkFFZCxLQUFBLEdBQU8sU0FBQTtNQUNMLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsU0FBQyxDQUFEO0FBQ2xCLFlBQUE7UUFBQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLG1CQUFGLENBQUE7QUFDUCxlQUFPO1VBQ0wsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsR0FBakIsQ0FBQSxHQUFzQixDQUFyQyxDQUREO1VBRUwsSUFBQSxFQUFNLENBRkQ7O01BRlcsQ0FBWDtNQU1ULElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLEtBQVg7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBUks7O3VCQVVQLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLGdCQUFnQixDQUFDLFFBQWxCLENBQUEsQ0FBNEIsQ0FBQyxlQUE3QixHQUErQzs7UUFDL0MsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBTEk7O3VCQU9OLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzt1QkFFTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7dUJBRVgsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO2FBQ1osRUFBQSxDQUFHLFNBQUE7ZUFBRyxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUo7TUFBSCxDQUFIO0lBRFc7O3VCQUdiLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDVCxVQUFBO01BRFcsT0FBRDtNQUNWLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGUzs7OztLQW5DVTtBQUp6QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICAgIGluaXRpYWxpemU6IChAcmVwb3MpIC0+XG4gICAgICBzdXBlclxuICAgICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBAcmVzdWx0ID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgQHJlc29sdmUgPSByZXNvbHZlXG4gICAgICAgIEByZWplY3QgPSByZWplY3RcbiAgICAgICAgQHNldHVwKClcblxuICAgIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgICBzZXR1cDogLT5cbiAgICAgIEByZXBvcyA9IEByZXBvcy5tYXAgKHIpIC0+XG4gICAgICAgIHBhdGggPSByLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IHBhdGguc3Vic3RyaW5nKHBhdGgubGFzdEluZGV4T2YoJy8nKSsxKVxuICAgICAgICAgIHJlcG86IHJcbiAgICAgICAgfVxuICAgICAgQHNldEl0ZW1zIEByZXBvc1xuICAgICAgQHNob3coKVxuXG4gICAgc2hvdzogLT5cbiAgICAgIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkucGxhY2Vob2xkZXJUZXh0ID0gJ1doaWNoIHJlcG8/J1xuICAgICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICAgIEBwYW5lbC5zaG93KClcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG4gICAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gICAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgICB2aWV3Rm9ySXRlbTogKHtuYW1lfSkgLT5cbiAgICAgICQkIC0+IEBsaShuYW1lKVxuXG4gICAgY29uZmlybWVkOiAoe3JlcG99KSAtPlxuICAgICAgQHJlc29sdmUgcmVwb1xuICAgICAgQGNhbmNlbCgpXG4iXX0=
