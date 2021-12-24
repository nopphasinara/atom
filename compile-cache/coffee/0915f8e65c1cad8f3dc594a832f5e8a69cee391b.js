(function() {
  var $, $$, CommandsKeystrokeHumanizer, GitInit, GitPaletteView, GitPlusCommands, SelectListView, _, fuzzyFilter, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, SelectListView = ref.SelectListView;

  GitPlusCommands = require('../git-plus-commands');

  GitInit = require('../models/git-init');

  fuzzyFilter = require('fuzzaldrin').filter;

  CommandsKeystrokeHumanizer = require('../command-keystroke-humanizer')();

  module.exports = GitPaletteView = (function(superClass) {
    extend(GitPaletteView, superClass);

    function GitPaletteView() {
      return GitPaletteView.__super__.constructor.apply(this, arguments);
    }

    GitPaletteView.prototype.initialize = function() {
      GitPaletteView.__super__.initialize.apply(this, arguments);
      this.addClass('git-palette');
      return this.toggle();
    };

    GitPaletteView.prototype.getFilterKey = function() {
      return 'description';
    };

    GitPaletteView.prototype.cancelled = function() {
      return this.hide();
    };

    GitPaletteView.prototype.toggle = function() {
      var ref1;
      if ((ref1 = this.panel) != null ? ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    GitPaletteView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.commandElement = this.previouslyFocusedElement;
      } else {
        this.commandElement = atom.views.getView(atom.workspace);
      }
      this.keyBindings = atom.keymaps.findKeyBindings({
        target: this.commandElement[0]
      });
      return GitPlusCommands().then((function(_this) {
        return function(commands) {
          var keystrokes;
          keystrokes = CommandsKeystrokeHumanizer.get(commands);
          commands = commands.map(function(c) {
            return {
              name: c[0],
              description: c[1],
              func: c[2],
              keystroke: keystrokes[c[0]]
            };
          });
          commands = _.sortBy(commands, 'description');
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          var commands;
          (commands = []).push({
            name: 'git-plus:init',
            description: 'Init',
            func: function() {
              return GitInit();
            }
          });
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this));
    };

    GitPaletteView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, j, options, ref1, ref2, ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          key: this.getFilterKey()
        };
        filteredItems = fuzzyFilter(this.items, filterQuery, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = j = 0, ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          item = (ref2 = filteredItems[i].original) != null ? ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (ref3 = filteredItems[i].string) != null ? ref3 : null));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    GitPaletteView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    GitPaletteView.prototype.viewForItem = function(arg, matchedStr) {
      var description, keystroke, name;
      name = arg.name, description = arg.description, keystroke = arg.keystroke;
      return $$(function() {
        return this.li({
          "class": 'command',
          'data-command-name': name
        }, (function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              _this.span(description);
              if (keystroke != null) {
                return _this.div({
                  "class": 'pull-right'
                }, function() {
                  return _this.kbd({
                    "class": 'key-binding'
                  }, keystroke);
                });
              }
            }
          };
        })(this));
      });
    };

    GitPaletteView.prototype.confirmed = function(arg) {
      var func;
      func = arg.func;
      this.cancel();
      return func();
    };

    return GitPaletteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9naXQtcGFsZXR0ZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0hBQUE7SUFBQTs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUEwQixPQUFBLENBQVEsc0JBQVIsQ0FBMUIsRUFBQyxTQUFELEVBQUksV0FBSixFQUFROztFQUNSLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHNCQUFSOztFQUNsQixPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSOztFQUNWLFdBQUEsR0FBYyxPQUFBLENBQVEsWUFBUixDQUFxQixDQUFDOztFQUNwQywwQkFBQSxHQUE2QixPQUFBLENBQVEsZ0NBQVIsQ0FBQSxDQUFBOztFQUM3QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzZCQUVKLFVBQUEsR0FBWSxTQUFBO01BQ1YsZ0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsYUFBVjthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFIVTs7NkJBS1osWUFBQSxHQUFjLFNBQUE7YUFDWjtJQURZOzs2QkFHZCxTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7NkJBRVgsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsc0NBQVMsQ0FBRSxTQUFSLENBQUEsVUFBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7O0lBRE07OzZCQU1SLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUVWLElBQUMsQ0FBQSxt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Iiwic291cmNlc0NvbnRlbnQiOlsiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbnskLCAkJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5HaXRQbHVzQ29tbWFuZHMgPSByZXF1aXJlICcuLi9naXQtcGx1cy1jb21tYW5kcydcbkdpdEluaXQgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LWluaXQnXG5mdXp6eUZpbHRlciA9IHJlcXVpcmUoJ2Z1enphbGRyaW4nKS5maWx0ZXJcbkNvbW1hbmRzS2V5c3Ryb2tlSHVtYW5pemVyID0gcmVxdWlyZSgnLi4vY29tbWFuZC1rZXlzdHJva2UtaHVtYW5pemVyJykoKVxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgR2l0UGFsZXR0ZVZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgc3VwZXJcbiAgICBAYWRkQ2xhc3MoJ2dpdC1wYWxldHRlJylcbiAgICBAdG9nZ2xlKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+XG4gICAgJ2Rlc2NyaXB0aW9uJ1xuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAcGFuZWw/LmlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAc2hvdygpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gICAgaWYgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudFswXSBhbmQgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudFswXSBpc250IGRvY3VtZW50LmJvZHlcbiAgICAgIEBjb21tYW5kRWxlbWVudCA9IEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnRcbiAgICBlbHNlXG4gICAgICBAY29tbWFuZEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgQGtleUJpbmRpbmdzID0gYXRvbS5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyh0YXJnZXQ6IEBjb21tYW5kRWxlbWVudFswXSlcblxuICAgIEdpdFBsdXNDb21tYW5kcygpXG4gICAgICAudGhlbiAoY29tbWFuZHMpID0+XG4gICAgICAgIGtleXN0cm9rZXMgPSBDb21tYW5kc0tleXN0cm9rZUh1bWFuaXplci5nZXQoY29tbWFuZHMpXG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMubWFwIChjKSAtPiB7IG5hbWU6IGNbMF0sIGRlc2NyaXB0aW9uOiBjWzFdLCBmdW5jOiBjWzJdLCBrZXlzdHJva2U6IGtleXN0cm9rZXNbY1swXV0gfVxuICAgICAgICBjb21tYW5kcyA9IF8uc29ydEJ5KGNvbW1hbmRzLCAnZGVzY3JpcHRpb24nKVxuICAgICAgICBAc2V0SXRlbXMoY29tbWFuZHMpXG4gICAgICAgIEBwYW5lbC5zaG93KClcbiAgICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiAgICAgIC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICAoY29tbWFuZHMgPSBbXSkucHVzaCB7IG5hbWU6ICdnaXQtcGx1czppbml0JywgZGVzY3JpcHRpb246ICdJbml0JywgZnVuYzogLT4gR2l0SW5pdCgpIH1cbiAgICAgICAgQHNldEl0ZW1zKGNvbW1hbmRzKVxuICAgICAgICBAcGFuZWwuc2hvdygpXG4gICAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgcG9wdWxhdGVMaXN0OiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGl0ZW1zP1xuXG4gICAgZmlsdGVyUXVlcnkgPSBAZ2V0RmlsdGVyUXVlcnkoKVxuICAgIGlmIGZpbHRlclF1ZXJ5Lmxlbmd0aFxuICAgICAgb3B0aW9ucyA9XG4gICAgICAgIGtleTogQGdldEZpbHRlcktleSgpXG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gZnV6enlGaWx0ZXIoQGl0ZW1zLCBmaWx0ZXJRdWVyeSwgb3B0aW9ucylcbiAgICBlbHNlXG4gICAgICBmaWx0ZXJlZEl0ZW1zID0gQGl0ZW1zXG5cbiAgICBAbGlzdC5lbXB0eSgpXG4gICAgaWYgZmlsdGVyZWRJdGVtcy5sZW5ndGhcbiAgICAgIEBzZXRFcnJvcihudWxsKVxuICAgICAgZm9yIGkgaW4gWzAuLi5NYXRoLm1pbihmaWx0ZXJlZEl0ZW1zLmxlbmd0aCwgQG1heEl0ZW1zKV1cbiAgICAgICAgaXRlbSA9IGZpbHRlcmVkSXRlbXNbaV0ub3JpZ2luYWwgPyBmaWx0ZXJlZEl0ZW1zW2ldXG4gICAgICAgIGl0ZW1WaWV3ID0gJChAdmlld0Zvckl0ZW0oaXRlbSwgZmlsdGVyZWRJdGVtc1tpXS5zdHJpbmcgPyBudWxsKSlcbiAgICAgICAgaXRlbVZpZXcuZGF0YSgnc2VsZWN0LWxpc3QtaXRlbScsIGl0ZW0pXG4gICAgICAgIEBsaXN0LmFwcGVuZChpdGVtVmlldylcblxuICAgICAgQHNlbGVjdEl0ZW1WaWV3KEBsaXN0LmZpbmQoJ2xpOmZpcnN0JykpXG4gICAgZWxzZVxuICAgICAgQHNldEVycm9yKEBnZXRFbXB0eU1lc3NhZ2UoQGl0ZW1zLmxlbmd0aCwgZmlsdGVyZWRJdGVtcy5sZW5ndGgpKVxuXG4gIGhpZGU6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHtuYW1lLCBkZXNjcmlwdGlvbiwga2V5c3Ryb2tlfSwgbWF0Y2hlZFN0cikgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiAnY29tbWFuZCcsICdkYXRhLWNvbW1hbmQtbmFtZSc6IG5hbWUsID0+XG4gICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHNwYW4gZGVzY3JpcHRpb25cbiAgICAgICAgICBpZiBrZXlzdHJva2U/XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgICAgIEBrYmQgY2xhc3M6ICdrZXktYmluZGluZycsIGtleXN0cm9rZVxuXG4gIGNvbmZpcm1lZDogKHtmdW5jfSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBmdW5jKClcbiJdfQ==
