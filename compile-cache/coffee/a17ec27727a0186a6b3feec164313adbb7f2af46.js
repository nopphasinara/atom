(function() {
  var CodeView, CompositeDisposable, ItemView, ShowTodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  ItemView = (function(superClass) {
    extend(ItemView, superClass);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.content = function(item) {
      return this.span({
        "class": 'badge badge-large',
        'data-id': item
      }, item);
    };

    return ItemView;

  })(View);

  CodeView = (function(superClass) {
    extend(CodeView, superClass);

    function CodeView() {
      return CodeView.__super__.constructor.apply(this, arguments);
    }

    CodeView.content = function(item) {
      return this.code(item);
    };

    return CodeView;

  })(View);

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.updateShowInTable = bind(this.updateShowInTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        outlet: 'todoOptions',
        "class": 'todo-options'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('On Table');
            return _this.div({
              outlet: 'itemsOnTable',
              "class": 'block items-on-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Off Table');
            return _this.div({
              outlet: 'itemsOffTable',
              "class": 'block items-off-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Todos');
            return _this.div({
              outlet: 'findTodoDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Regex');
            return _this.div({
              outlet: 'findRegexDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Ignore Paths');
            return _this.div({
              outlet: 'ignorePathDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Auto Refresh');
            return _this.div({
              "class": 'checkbox'
            }, function() {
              return _this.label(function() {
                return _this.input({
                  outlet: 'autoRefreshCheckbox',
                  "class": 'input-checkbox',
                  type: 'checkbox'
                });
              });
            });
          });
          return _this.div({
            "class": 'option'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'configButton',
                "class": 'btn'
              }, "Go to Config");
              return _this.button({
                outlet: 'closeButton',
                "class": 'btn'
              }, "Close Options");
            });
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.updateUI();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.configButton.on('click', function() {
        return atom.workspace.open('atom://config/packages/todo-show');
      });
      this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.parent().slideToggle();
        };
      })(this));
      this.autoRefreshCheckbox.on('click', (function(_this) {
        return function(event) {
          return _this.autoRefreshChange(event.target.checked);
        };
      })(this));
      return this.disposables.add(atom.config.observe('todo-show.autoRefresh', (function(_this) {
        return function(newValue) {
          var ref;
          return (ref = _this.autoRefreshCheckbox.context) != null ? ref.checked = newValue : void 0;
        };
      })(this)));
    };

    ShowTodoView.prototype.detach = function() {
      return this.disposables.dispose();
    };

    ShowTodoView.prototype.updateShowInTable = function() {
      var showInTable;
      showInTable = this.sortable.toArray();
      return atom.config.set('todo-show.showInTable', showInTable);
    };

    ShowTodoView.prototype.updateUI = function() {
      var Sortable, i, item, j, k, len, len1, len2, path, ref, ref1, ref2, regex, results, tableItems, todo, todos;
      tableItems = atom.config.get('todo-show.showInTable');
      ref = this.collection.getAvailableTableItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (tableItems.indexOf(item) === -1) {
          this.itemsOffTable.append(new ItemView(item));
        } else {
          this.itemsOnTable.append(new ItemView(item));
        }
      }
      Sortable = require('sortablejs');
      this.sortable = Sortable.create(this.itemsOnTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost',
        onSort: this.updateShowInTable
      });
      Sortable.create(this.itemsOffTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost'
      });
      ref1 = todos = atom.config.get('todo-show.findTheseTodos');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        todo = ref1[j];
        this.findTodoDiv.append(new CodeView(todo));
      }
      regex = atom.config.get('todo-show.findUsingRegex');
      this.findRegexDiv.append(new CodeView(regex.replace('${TODOS}', todos.join('|'))));
      ref2 = atom.config.get('todo-show.ignoreThesePaths');
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        path = ref2[k];
        results.push(this.ignorePathDiv.append(new CodeView(path)));
      }
      return results;
    };

    ShowTodoView.prototype.autoRefreshChange = function(state) {
      return atom.config.set('todo-show.autoRefresh', state);
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tb3B0aW9ucy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMkRBQUE7SUFBQTs7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBRUg7Ozs7Ozs7SUFDSixRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRDthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFQO1FBQTRCLFNBQUEsRUFBVyxJQUF2QztPQUFOLEVBQW1ELElBQW5EO0lBRFE7Ozs7S0FEVzs7RUFJakI7Ozs7Ozs7SUFDSixRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRDthQUNSLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBTjtJQURROzs7O0tBRFc7O0VBSXZCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLE1BQUEsRUFBUSxhQUFSO1FBQXVCLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBOUI7T0FBTCxFQUFtRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDakQsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxVQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsY0FBUjtjQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQUEvQjthQUFMO1VBRm9CLENBQXRCO1VBSUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxXQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsZUFBUjtjQUF5QixDQUFBLEtBQUEsQ0FBQSxFQUFPLHVCQUFoQzthQUFMO1VBRm9CLENBQXRCO1VBSUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxZQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsYUFBUjthQUFMO1VBRm9CLENBQXRCO1VBSUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxZQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsY0FBUjthQUFMO1VBRm9CLENBQXRCO1VBSUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxjQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsZUFBUjthQUFMO1VBRm9CLENBQXRCO1VBSUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUE7WUFDcEIsS0FBQyxDQUFBLEVBQUQsQ0FBSSxjQUFKO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFVBQVA7YUFBTCxFQUF3QixTQUFBO3FCQUN0QixLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUE7dUJBQ0wsS0FBQyxDQUFBLEtBQUQsQ0FBTztrQkFBQSxNQUFBLEVBQVEscUJBQVI7a0JBQStCLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQXRDO2tCQUF3RCxJQUFBLEVBQU0sVUFBOUQ7aUJBQVA7Y0FESyxDQUFQO1lBRHNCLENBQXhCO1VBRm9CLENBQXRCO2lCQU1BLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixTQUFBO21CQUNwQixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUwsRUFBeUIsU0FBQTtjQUN2QixLQUFDLENBQUEsTUFBRCxDQUFRO2dCQUFBLE1BQUEsRUFBUSxjQUFSO2dCQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLEtBQS9CO2VBQVIsRUFBOEMsY0FBOUM7cUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtnQkFBQSxNQUFBLEVBQVEsYUFBUjtnQkFBdUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUE5QjtlQUFSLEVBQTZDLGVBQTdDO1lBRnVCLENBQXpCO1VBRG9CLENBQXRCO1FBM0JpRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQ7SUFEUTs7MkJBaUNWLFVBQUEsR0FBWSxTQUFDLFVBQUQ7TUFBQyxJQUFDLENBQUEsYUFBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsWUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQUhVOzsyQkFLWixZQUFBLEdBQWMsU0FBQTtNQUNaLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixTQUFBO2VBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixrQ0FBcEI7TUFEd0IsQ0FBMUI7TUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN2QixLQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxXQUFWLENBQUE7UUFEdUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO01BRUEsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUMvQixLQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFoQztRQUQrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakM7YUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHVCQUFwQixFQUE2QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtBQUM1RCxjQUFBO3dFQUE0QixDQUFFLE9BQTlCLEdBQXdDO1FBRG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QyxDQUFqQjtJQVJZOzsyQkFXZCxNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBRE07OzJCQUdSLGlCQUFBLEdBQW1CLFNBQUE7QUFDakIsVUFBQTtNQUFBLFdBQUEsR0FBYyxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQTthQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsV0FBekM7SUFGaUI7OzJCQUluQixRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQjtBQUNiO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxJQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBQUEsS0FBNEIsQ0FBQyxDQUFoQztVQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFzQixJQUFJLFFBQUosQ0FBYSxJQUFiLENBQXRCLEVBREY7U0FBQSxNQUFBO1VBR0UsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLElBQUksUUFBSixDQUFhLElBQWIsQ0FBckIsRUFIRjs7QUFERjtNQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjtNQUVYLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBUSxDQUFDLE1BQVQsQ0FDVixJQUFDLENBQUEsWUFBWSxDQUFDLE9BREosRUFFVjtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsVUFBQSxFQUFZLE9BRFo7UUFFQSxNQUFBLEVBQVEsSUFBQyxDQUFBLGlCQUZUO09BRlU7TUFPWixRQUFRLENBQUMsTUFBVCxDQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FEakIsRUFFRTtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsVUFBQSxFQUFZLE9BRFo7T0FGRjtBQU1BO0FBQUEsV0FBQSx3Q0FBQTs7UUFDRSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0IsSUFBSSxRQUFKLENBQWEsSUFBYixDQUFwQjtBQURGO01BR0EsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEI7TUFDUixJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsSUFBSSxRQUFKLENBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxVQUFkLEVBQTBCLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxDQUExQixDQUFiLENBQXJCO0FBRUE7QUFBQTtXQUFBLHdDQUFBOztxQkFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsSUFBSSxRQUFKLENBQWEsSUFBYixDQUF0QjtBQURGOztJQTdCUTs7MkJBZ0NWLGlCQUFBLEdBQW1CLFNBQUMsS0FBRDthQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDO0lBRGlCOzs7O0tBekZNO0FBWjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5jbGFzcyBJdGVtVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChpdGVtKSAtPlxuICAgIEBzcGFuIGNsYXNzOiAnYmFkZ2UgYmFkZ2UtbGFyZ2UnLCAnZGF0YS1pZCc6IGl0ZW0sIGl0ZW1cblxuY2xhc3MgQ29kZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoaXRlbSkgLT5cbiAgICBAY29kZSBpdGVtXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNob3dUb2RvVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBvdXRsZXQ6ICd0b2RvT3B0aW9ucycsIGNsYXNzOiAndG9kby1vcHRpb25zJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ09uIFRhYmxlJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2l0ZW1zT25UYWJsZScsIGNsYXNzOiAnYmxvY2sgaXRlbXMtb24tdGFibGUnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ09mZiBUYWJsZSdcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdpdGVtc09mZlRhYmxlJywgY2xhc3M6ICdibG9jayBpdGVtcy1vZmYtdGFibGUnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ0ZpbmQgVG9kb3MnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnZmluZFRvZG9EaXYnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ0ZpbmQgUmVnZXgnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnZmluZFJlZ2V4RGl2J1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdJZ25vcmUgUGF0aHMnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnaWdub3JlUGF0aERpdidcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnQXV0byBSZWZyZXNoJ1xuICAgICAgICBAZGl2IGNsYXNzOiAnY2hlY2tib3gnLCA9PlxuICAgICAgICAgIEBsYWJlbCA9PlxuICAgICAgICAgICAgQGlucHV0IG91dGxldDogJ2F1dG9SZWZyZXNoQ2hlY2tib3gnLCBjbGFzczogJ2lucHV0LWNoZWNrYm94JywgdHlwZTogJ2NoZWNrYm94J1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdjb25maWdCdXR0b24nLCBjbGFzczogJ2J0bicsIFwiR28gdG8gQ29uZmlnXCJcbiAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ2Nsb3NlQnV0dG9uJywgY2xhc3M6ICdidG4nLCBcIkNsb3NlIE9wdGlvbnNcIlxuXG4gIGluaXRpYWxpemU6IChAY29sbGVjdGlvbikgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVFdmVudHMoKVxuICAgIEB1cGRhdGVVSSgpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBjb25maWdCdXR0b24ub24gJ2NsaWNrJywgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ2F0b206Ly9jb25maWcvcGFja2FnZXMvdG9kby1zaG93J1xuICAgIEBjbG9zZUJ1dHRvbi5vbiAnY2xpY2snLCA9PlxuICAgICAgQHBhcmVudCgpLnNsaWRlVG9nZ2xlKClcbiAgICBAYXV0b1JlZnJlc2hDaGVja2JveC5vbiAnY2xpY2snLCAoZXZlbnQpID0+XG4gICAgICBAYXV0b1JlZnJlc2hDaGFuZ2UoZXZlbnQudGFyZ2V0LmNoZWNrZWQpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCcsIChuZXdWYWx1ZSkgPT5cbiAgICAgIEBhdXRvUmVmcmVzaENoZWNrYm94LmNvbnRleHQ/LmNoZWNrZWQgPSBuZXdWYWx1ZVxuXG4gIGRldGFjaDogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgdXBkYXRlU2hvd0luVGFibGU6ID0+XG4gICAgc2hvd0luVGFibGUgPSBAc29ydGFibGUudG9BcnJheSgpXG4gICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBzaG93SW5UYWJsZSlcblxuICB1cGRhdGVVSTogLT5cbiAgICB0YWJsZUl0ZW1zID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc2hvd0luVGFibGUnKVxuICAgIGZvciBpdGVtIGluIEBjb2xsZWN0aW9uLmdldEF2YWlsYWJsZVRhYmxlSXRlbXMoKVxuICAgICAgaWYgdGFibGVJdGVtcy5pbmRleE9mKGl0ZW0pIGlzIC0xXG4gICAgICAgIEBpdGVtc09mZlRhYmxlLmFwcGVuZCBuZXcgSXRlbVZpZXcoaXRlbSlcbiAgICAgIGVsc2VcbiAgICAgICAgQGl0ZW1zT25UYWJsZS5hcHBlbmQgbmV3IEl0ZW1WaWV3KGl0ZW0pXG5cbiAgICBTb3J0YWJsZSA9IHJlcXVpcmUgJ3NvcnRhYmxlanMnXG5cbiAgICBAc29ydGFibGUgPSBTb3J0YWJsZS5jcmVhdGUoXG4gICAgICBAaXRlbXNPblRhYmxlLmNvbnRleHRcbiAgICAgIGdyb3VwOiAndGFibGVJdGVtcydcbiAgICAgIGdob3N0Q2xhc3M6ICdnaG9zdCdcbiAgICAgIG9uU29ydDogQHVwZGF0ZVNob3dJblRhYmxlXG4gICAgKVxuXG4gICAgU29ydGFibGUuY3JlYXRlKFxuICAgICAgQGl0ZW1zT2ZmVGFibGUuY29udGV4dFxuICAgICAgZ3JvdXA6ICd0YWJsZUl0ZW1zJ1xuICAgICAgZ2hvc3RDbGFzczogJ2dob3N0J1xuICAgIClcblxuICAgIGZvciB0b2RvIGluIHRvZG9zID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnKVxuICAgICAgQGZpbmRUb2RvRGl2LmFwcGVuZCBuZXcgQ29kZVZpZXcodG9kbylcblxuICAgIHJlZ2V4ID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFVzaW5nUmVnZXgnKVxuICAgIEBmaW5kUmVnZXhEaXYuYXBwZW5kIG5ldyBDb2RlVmlldyhyZWdleC5yZXBsYWNlKCcke1RPRE9TfScsIHRvZG9zLmpvaW4oJ3wnKSkpXG5cbiAgICBmb3IgcGF0aCBpbiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICAgIEBpZ25vcmVQYXRoRGl2LmFwcGVuZCBuZXcgQ29kZVZpZXcocGF0aClcblxuICBhdXRvUmVmcmVzaENoYW5nZTogKHN0YXRlKSAtPlxuICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LmF1dG9SZWZyZXNoJywgc3RhdGUpXG4iXX0=
