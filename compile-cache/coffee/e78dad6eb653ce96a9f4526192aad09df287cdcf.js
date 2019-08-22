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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWNvbW1pdHMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNHQUFBO0lBQUE7OztFQUFBLE1BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFELEVBQUk7O0VBRUosR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFekIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztzQ0FFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtBQUNWLFVBQUE7TUFEVyxJQUFDLENBQUEsT0FBRDtNQUNYLHlEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQ7O0FBQ0U7YUFBQSxzQ0FBQTs7VUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO3VCQUNQO1lBQUMsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQVo7WUFBZ0IsTUFBQSxFQUFRLElBQUssQ0FBQSxDQUFBLENBQTdCO1lBQWlDLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUE1QztZQUFnRCxPQUFBLEVBQVMsSUFBSyxDQUFBLENBQUEsQ0FBOUQ7O0FBRkY7O1VBREY7YUFLQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQVJVOztzQ0FVWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3NDQUVkLFVBQUEsR0FBWSxTQUFB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LFNBQUMsSUFBRDtlQUFVLElBQUksQ0FBQztNQUFmLENBQVY7TUFDVixPQUFBLEdBQVcsdUJBQUEsR0FBeUIsQ0FBQyxPQUFPLENBQUMsSUFBUixDQUFhLEdBQWIsQ0FBRDtNQUNwQyxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBQyxDQUFBLElBQWhCLENBQXFCLENBQUMsT0FBdEIsQ0FBQTthQUNYLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxhQUFELENBQWUsQ0FBQyxNQUFoQixDQUF1QixPQUF2QixDQUFSLEVBQXlDO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQXpDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxHQUFEO1FBQ0osUUFBUSxDQUFDLFVBQVQsQ0FBb0IsR0FBcEI7ZUFDQSxjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLFVBQUEsUUFBRDtVQUFXLFNBQUEsT0FBWDtVQUFvQixNQUFBLEVBQVEsR0FBNUI7U0FBdEI7TUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLEdBQUQ7UUFDTCxRQUFRLENBQUMsUUFBVCxDQUFrQixHQUFsQjtlQUNBLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1VBQUMsVUFBQSxRQUFEO1VBQVcsU0FBQSxPQUFYO1VBQW9CLE1BQUEsRUFBUSxHQUE1QjtVQUFpQyxNQUFBLEVBQVEsSUFBekM7U0FBdEI7TUFGSyxDQUpQO0lBTFM7Ozs7S0E3Q3lCO0FBVHRDIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENoZXJyeVBpY2tTZWxlY3RDb21taXRzIGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgZGF0YSkgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAc2V0SXRlbXMoXG4gICAgICBmb3IgaXRlbSBpbiBkYXRhXG4gICAgICAgIGl0ZW0gPSBpdGVtLnNwbGl0KCdcXG4nKVxuICAgICAgICB7aGFzaDogaXRlbVswXSwgYXV0aG9yOiBpdGVtWzFdLCB0aW1lOiBpdGVtWzJdLCBzdWJqZWN0OiBpdGVtWzNdfVxuICAgIClcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ2hhc2gnXG5cbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdidXR0b25zJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLXBpY2stYnV0dG9uJywgJ0NoZXJyeS1QaWNrISdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLXBpY2stYnV0dG9uJylcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtLCBtYXRjaGVkU3RyKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0IGlubGluZS1ibG9jayBwdWxsLXJpZ2h0Jywgc3R5bGU6ICdmb250LWZhbWlseTogbW9ub3NwYWNlJywgPT5cbiAgICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtLmhhc2hcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaW5mbycsIFwiI3tpdGVtLmF1dGhvcn0sICN7aXRlbS50aW1lfVwiXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcnLCBpdGVtLnN1YmplY3RcblxuICBjb21wbGV0ZWQ6IChpdGVtcykgLT5cbiAgICBAY2FuY2VsKClcbiAgICBjb21taXRzID0gaXRlbXMubWFwIChpdGVtKSAtPiBpdGVtLmhhc2hcbiAgICBtZXNzYWdlID0gIFwiXCJcImNoZXJyeSBwaWNrIGNvbW1pdHM6ICN7Y29tbWl0cy5qb2luKCcgJyl9XCJcIlwiXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgZ2l0LmNtZChbJ2NoZXJyeS1waWNrJ10uY29uY2F0KGNvbW1pdHMpLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAobXNnKSAtPlxuICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyBtc2dcbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2UsIG91dHB1dDogbXNnfSlcbiAgICAuY2F0Y2ggKG1zZykgLT5cbiAgICAgIG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZSwgb3V0cHV0OiBtc2csIGZhaWxlZDogdHJ1ZX0pXG4iXX0=
