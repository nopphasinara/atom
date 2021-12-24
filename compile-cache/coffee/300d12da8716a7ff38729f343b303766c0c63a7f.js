(function() {
  var $$, ActivityLogger, GitShow, RemoteListView, Repository, SelectListView, TagView, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git-es')["default"];

  GitShow = require('../models/git-show');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(superClass) {
    extend(TagView, superClass);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag1) {
      this.repo = repo;
      this.tag = tag1;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(arg) {
      var cmd, description, tag;
      tag = arg.tag, cmd = arg.cmd, description = arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(arg) {
      var args, cmd, repoName, tag;
      tag = arg.tag, cmd = arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(result) {
              return new RemoteListView(_this.repo, result.output, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        repoName = new Repository(this.repo).getName();
        return git(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(result) {
          return ActivityLogger.record(Object.assign({
            repoName: repoName,
            message: cmd + " tag '" + tag + "'"
          }, result));
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy90YWctdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBGQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMxQixPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSOztFQUNWLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFDckMsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7c0JBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxNQUFEO01BQ2xCLHlDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOztzQkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixLQUFLLENBQUMsSUFBTixDQUFXO1FBQUMsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFQO1FBQVksR0FBQSxFQUFLLE1BQWpCO1FBQXlCLFdBQUEsRUFBYSxVQUF0QztPQUFYO01BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FBUDtRQUFZLEdBQUEsRUFBSyxNQUFqQjtRQUF5QixXQUFBLEVBQWEsbUJBQXRDO09BQVg7TUFDQSxLQUFLLENBQUMsSUFBTixDQUFXO1FB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QkFBTixDQUFBLENBQUw7U0FBVixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsTUFBRDtpQkFBWSxjQUFjLENBQUMsTUFBZixDQUFzQixNQUFNLENBQUMsTUFBUCxDQUFjO1lBQUMsVUFBQSxRQUFEO1lBQVcsT0FBQSxFQUFZLEdBQUQsR0FBSyxRQUFMLEdBQWEsR0FBYixHQUFpQixHQUF2QztXQUFkLEVBQTBELE1BQTFELENBQXRCO1FBQVosQ0FETixFQUZGOztJQWZTOzs7O0tBbENTO0FBVHRCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSgnLi4vZ2l0LWVzJykuZGVmYXVsdFxuR2l0U2hvdyA9IHJlcXVpcmUgJy4uL21vZGVscy9naXQtc2hvdydcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhZ1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEB0YWcpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGl0ZW1zID0gW11cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ1Nob3cnLCBkZXNjcmlwdGlvbjogJ2dpdCBzaG93J31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ1B1c2gnLCBkZXNjcmlwdGlvbjogJ2dpdCBwdXNoIFtyZW1vdGVdJ31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ0NoZWNrb3V0JywgZGVzY3JpcHRpb246ICdnaXQgY2hlY2tvdXQnfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnVmVyaWZ5JywgZGVzY3JpcHRpb246ICdnaXQgdGFnIC0tdmVyaWZ5J31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ0RlbGV0ZScsIGRlc2NyaXB0aW9uOiAnZ2l0IHRhZyAtLWRlbGV0ZSd9XG5cbiAgICBAc2V0SXRlbXMgaXRlbXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7dGFnLCBjbWQsIGRlc2NyaXB0aW9ufSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWhpZ2hsaWdodCcsIGNtZFxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC13YXJuaW5nJywgXCIje2Rlc2NyaXB0aW9ufSAje3RhZ31cIlxuXG4gIGdldEZpbHRlcktleTogLT4gJ2NtZCdcblxuICBjb25maXJtZWQ6ICh7dGFnLCBjbWR9KSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIHN3aXRjaCBjbWRcbiAgICAgIHdoZW4gJ1Nob3cnXG4gICAgICAgIEdpdFNob3coQHJlcG8sIHRhZylcbiAgICAgIHdoZW4gJ1B1c2gnXG4gICAgICAgIGdpdChbJ3JlbW90ZSddLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLnRoZW4gKHJlc3VsdCkgPT4gbmV3IFJlbW90ZUxpc3RWaWV3KEByZXBvLCByZXN1bHQub3V0cHV0LCBtb2RlOiAncHVzaCcsIHRhZzogQHRhZylcbiAgICAgIHdoZW4gJ0NoZWNrb3V0J1xuICAgICAgICBhcmdzID0gWydjaGVja291dCcsIHRhZ11cbiAgICAgIHdoZW4gJ1ZlcmlmeSdcbiAgICAgICAgYXJncyA9IFsndGFnJywgJy0tdmVyaWZ5JywgdGFnXVxuICAgICAgd2hlbiAnRGVsZXRlJ1xuICAgICAgICBhcmdzID0gWyd0YWcnLCAnLS1kZWxldGUnLCB0YWddXG5cbiAgICBpZiBhcmdzP1xuICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgICBnaXQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAocmVzdWx0KSAtPiBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoT2JqZWN0LmFzc2lnbih7cmVwb05hbWUsIG1lc3NhZ2U6IFwiI3tjbWR9IHRhZyAnI3t0YWd9J1wifSwgcmVzdWx0KSlcbiJdfQ==
