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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwRkFBQTtJQUFBOzs7RUFBQSxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBRUwsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSLENBQW9CLEVBQUMsT0FBRDs7RUFDMUIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUjs7RUFDVixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3NCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsTUFBRDtNQUNsQix5Q0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFIVTs7c0JBS1osU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FBUDtRQUFZLEdBQUEsRUFBSyxNQUFqQjtRQUF5QixXQUFBLEVBQWEsVUFBdEM7T0FBWDtNQUNBLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUssSUFBQyxDQUFBLEdBQVA7UUFBWSxHQUFBLEVBQUssTUFBakI7UUFBeUIsV0FBQSxFQUFhLG1CQUF0QztPQUFYO01BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEs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QSxDQUFMO1NBQVYsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7aUJBQVksY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBWSxHQUFELEdBQUssUUFBTCxHQUFhLEdBQWIsR0FBaUIsR0FBdkM7V0FBZCxFQUEwRCxNQUExRCxDQUF0QjtRQUFaLENBRE4sRUFGRjs7SUFmUzs7OztLQWxDUztBQVR0QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcbkdpdFNob3cgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LXNob3cnXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuUmVtb3RlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdGUtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUYWdWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBAdGFnKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IFtdXG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdTaG93JywgZGVzY3JpcHRpb246ICdnaXQgc2hvdyd9XG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdQdXNoJywgZGVzY3JpcHRpb246ICdnaXQgcHVzaCBbcmVtb3RlXSd9XG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdDaGVja291dCcsIGRlc2NyaXB0aW9uOiAnZ2l0IGNoZWNrb3V0J31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ1ZlcmlmeScsIGRlc2NyaXB0aW9uOiAnZ2l0IHRhZyAtLXZlcmlmeSd9XG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdEZWxldGUnLCBkZXNjcmlwdGlvbjogJ2dpdCB0YWcgLS1kZWxldGUnfVxuXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe3RhZywgY21kLCBkZXNjcmlwdGlvbn0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1oaWdobGlnaHQnLCBjbWRcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtd2FybmluZycsIFwiI3tkZXNjcmlwdGlvbn0gI3t0YWd9XCJcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICdjbWQnXG5cbiAgY29uZmlybWVkOiAoe3RhZywgY21kfSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBzd2l0Y2ggY21kXG4gICAgICB3aGVuICdTaG93J1xuICAgICAgICBHaXRTaG93KEByZXBvLCB0YWcpXG4gICAgICB3aGVuICdQdXNoJ1xuICAgICAgICBnaXQoWydyZW1vdGUnXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChyZXN1bHQpID0+IG5ldyBSZW1vdGVMaXN0VmlldyhAcmVwbywgcmVzdWx0Lm91dHB1dCwgbW9kZTogJ3B1c2gnLCB0YWc6IEB0YWcpXG4gICAgICB3aGVuICdDaGVja291dCdcbiAgICAgICAgYXJncyA9IFsnY2hlY2tvdXQnLCB0YWddXG4gICAgICB3aGVuICdWZXJpZnknXG4gICAgICAgIGFyZ3MgPSBbJ3RhZycsICctLXZlcmlmeScsIHRhZ11cbiAgICAgIHdoZW4gJ0RlbGV0ZSdcbiAgICAgICAgYXJncyA9IFsndGFnJywgJy0tZGVsZXRlJywgdGFnXVxuXG4gICAgaWYgYXJncz9cbiAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgZ2l0KGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKHJlc3VsdCkgLT4gQWN0aXZpdHlMb2dnZXIucmVjb3JkKE9iamVjdC5hc3NpZ24oe3JlcG9OYW1lLCBtZXNzYWdlOiBcIiN7Y21kfSB0YWcgJyN7dGFnfSdcIn0sIHJlc3VsdCkpXG4iXX0=
