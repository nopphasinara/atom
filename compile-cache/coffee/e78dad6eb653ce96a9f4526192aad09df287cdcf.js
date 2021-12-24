(function() {
  var $, $$, ActivityLogger, CherryPickSelectCommits, Repository, SelectListMultipleView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = CherryPickSelectCommits = (function(superClass) {
    extend(CherryPickSelectCommits, superClass);

    function CherryPickSelectCommits() {
      return CherryPickSelectCommits.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectCommits.prototype.initialize = function(repo, data) {
      var item;
      this.repo = repo;
      CherryPickSelectCommits.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i];
          item = item.split('\n');
          results.push({
            hash: item[0],
            author: item[1],
            time: item[2],
            subject: item[3]
          });
        }
        return results;
      })());
      return this.focusFilterEditor();
    };

    CherryPickSelectCommits.prototype.getFilterKey = function() {
      return 'hash';
    };

    CherryPickSelectCommits.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-pick-button'
              }, 'Cherry-Pick!');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-pick-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    CherryPickSelectCommits.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectCommits.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectCommits.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectCommits.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight inline-block pull-right',
              style: 'font-family: monospace'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.hash);
              }
            });
            _this.div({
              "class": 'text-info'
            }, item.author + ", " + item.time);
            return _this.div({
              "class": 'text-warning'
            }, item.subject);
          };
        })(this));
      });
    };

    CherryPickSelectCommits.prototype.completed = function(items) {
      var commits, message, repoName;
      this.cancel();
      commits = items.map(function(item) {
        return item.hash;
      });
      message = "cherry pick commits: " + (commits.join(' '));
      repoName = new Repository(this.repo).getName();
      return git.cmd(['cherry-pick'].concat(commits), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        notifier.addSuccess(msg);
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: msg
        });
      })["catch"](function(msg) {
        notifier.addError(msg);
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: msg,
          failed: true
        });
      });
    };

    return CherryPickSelectCommits;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtY29tbWl0cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0dBQUE7SUFBQTs7O0VBQUEsTUFBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUQsRUFBSTs7RUFFSixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFDckMsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSOztFQUV6QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3NDQUVKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO0FBQ1YsVUFBQTtNQURXLElBQUMsQ0FBQSxPQUFEO01BQ1gseURBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRDs7QUFDRTthQUFBLHNDQUFBOztVQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7dUJBQ1A7WUFBQyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWjtZQUFnQixNQUFBLEVBQVEsSUFBSyxDQUFBLENBQUEsQ0FBN0I7WUFBaUMsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQTVDO1lBQWdELE9BQUEsRUFBUyxJQUFLLENBQUEsQ0FBQSxDQUE5RDs7QUFGRjs7VUFERjthQUtBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUlU7O3NDQVVaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7c0NBRWQsVUFBQSxH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QUFOLENBQVUsU0FBQyxJQUFEO2VBQVUsSUFBSSxDQUFDO01BQWYsQ0FBVjtNQUNWLE9BQUEsR0FBVyx1QkFBQSxHQUF5QixDQUFDLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYixDQUFEO01BQ3BDLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBO2FBQ1gsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLGFBQUQsQ0FBZSxDQUFDLE1BQWhCLENBQXVCLE9BQXZCLENBQVIsRUFBeUM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBekMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEdBQUQ7UUFDSixRQUFRLENBQUMsVUFBVCxDQUFvQixHQUFwQjtlQUNBLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1VBQUMsVUFBQSxRQUFEO1VBQVcsU0FBQSxPQUFYO1VBQW9CLE1BQUEsRUFBUSxHQUE1QjtTQUF0QjtNQUZJLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLFNBQUMsR0FBRDtRQUNMLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCO2VBQ0EsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7VUFBQyxVQUFBLFFBQUQ7VUFBVyxTQUFBLE9BQVg7VUFBb0IsTUFBQSxFQUFRLEdBQTVCO1VBQWlDLE1BQUEsRUFBUSxJQUF6QztTQUF0QjtNQUZLLENBSlA7SUFMUzs7OztLQTdDeUI7QUFUdEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgJCR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuU2VsZWN0TGlzdE11bHRpcGxlVmlldyA9IHJlcXVpcmUgJy4vc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2hlcnJ5UGlja1NlbGVjdENvbW1pdHMgZXh0ZW5kcyBTZWxlY3RMaXN0TXVsdGlwbGVWaWV3XG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBkYXRhKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyhcbiAgICAgIGZvciBpdGVtIGluIGRhdGFcbiAgICAgICAgaXRlbSA9IGl0ZW0uc3BsaXQoJ1xcbicpXG4gICAgICAgIHtoYXNoOiBpdGVtWzBdLCBhdXRob3I6IGl0ZW1bMV0sIHRpbWU6IGl0ZW1bMl0sIHN1YmplY3Q6IGl0ZW1bM119XG4gICAgKVxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnaGFzaCdcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tcGljay1idXR0b24nLCAnQ2hlcnJ5LVBpY2shJ1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgQGNvbXBsZXRlKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tcGljay1idXR0b24nKVxuICAgICAgQGNhbmNlbCgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWNhbmNlbC1idXR0b24nKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG5cbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1oaWdobGlnaHQgaW5saW5lLWJsb2NrIHB1bGwtcmlnaHQnLCBzdHlsZTogJ2ZvbnQtZmFtaWx5OiBtb25vc3BhY2UnLCA9PlxuICAgICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW0uaGFzaFxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1pbmZvJywgXCIje2l0ZW0uYXV0aG9yfSwgI3tpdGVtLnRpbWV9XCJcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtd2FybmluZycsIGl0ZW0uc3ViamVjdFxuXG4gIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIGNvbW1pdHMgPSBpdGVtcy5tYXAgKGl0ZW0pIC0+IGl0ZW0uaGFzaFxuICAgIG1lc3NhZ2UgPSAgXCJcIlwiY2hlcnJ5IHBpY2sgY29tbWl0czogI3tjb21taXRzLmpvaW4oJyAnKX1cIlwiXCJcbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICBnaXQuY21kKFsnY2hlcnJ5LXBpY2snXS5jb25jYXQoY29tbWl0cyksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChtc2cpIC0+XG4gICAgICBub3RpZmllci5hZGRTdWNjZXNzIG1zZ1xuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZSwgb3V0cHV0OiBtc2d9KVxuICAgIC5jYXRjaCAobXNnKSAtPlxuICAgICAgbm90aWZpZXIuYWRkRXJyb3IgbXNnXG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlLCBvdXRwdXQ6IG1zZywgZmFpbGVkOiB0cnVlfSlcbiJdfQ==
