(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(superClass) {
    extend(TableHeaderView, superClass);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = arg.sortBy, sortAsc = arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(superClass) {
    extend(TodoView, superClass);

    function TodoView() {
      this.openPath = bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
              }
            }));
          }
          return results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo1) {
      this.todo = todo1;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      return atom.workspace.open(this.todo.loc, {
        pending: atom.config.get('core.allowPendingPaneItems') || false
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(superClass) {
    extend(TodoEmptyView, superClass);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8taXRlbS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7OztFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUVIOzs7Ozs7O0lBQ0osZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFdBQUQsRUFBbUIsR0FBbkI7QUFDUixVQUFBOztRQURTLGNBQWM7O01BQUsscUJBQVE7YUFDcEMsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDRixjQUFBO0FBQUE7ZUFBQSw2Q0FBQTs7eUJBQ0UsS0FBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsU0FBQTtjQUNSLElBQUcsSUFBQSxLQUFRLE1BQVIsSUFBbUIsT0FBdEI7Z0JBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9DQUFQO2lCQUFMLEVBREY7ZUFBQSxNQUFBO2dCQUdFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw2QkFBUDtpQkFBTCxFQUhGOztjQUlBLElBQUcsSUFBQSxLQUFRLE1BQVIsSUFBbUIsQ0FBSSxPQUExQjt1QkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUNBQVA7aUJBQUwsRUFERjtlQUFBLE1BQUE7dUJBR0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDRCQUFQO2lCQUFMLEVBSEY7O1lBTFEsQ0FBVjtBQURGOztRQURFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO0lBRFE7Ozs7S0FEa0I7O0VBY3hCOzs7Ozs7OztJQUNKLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFE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Q0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNGLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxPQUFBLEVBQVMsV0FBVyxDQUFDLE1BQXJCO1dBQUosRUFBaUMsU0FBQTttQkFDL0IsS0FBQyxDQUFBLENBQUQsQ0FBRyxlQUFIO1VBRCtCLENBQWpDO1FBREU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7SUFEUTs7OztLQURnQjs7RUFNNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxpQkFBQSxlQUFEO0lBQWtCLFVBQUEsUUFBbEI7SUFBNEIsZUFBQSxhQUE1Qjs7QUE3RGpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmNsYXNzIFRhYmxlSGVhZGVyVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdLCB7c29ydEJ5LCBzb3J0QXNjfSkgLT5cbiAgICBAdHIgPT5cbiAgICAgIGZvciBpdGVtIGluIHNob3dJblRhYmxlXG4gICAgICAgIEB0aCBpdGVtLCA9PlxuICAgICAgICAgIGlmIGl0ZW0gaXMgc29ydEJ5IGFuZCBzb3J0QXNjXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1hc2MgaWNvbi10cmlhbmdsZS1kb3duIGFjdGl2ZSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1hc2MgaWNvbi10cmlhbmdsZS1kb3duJ1xuICAgICAgICAgIGlmIGl0ZW0gaXMgc29ydEJ5IGFuZCBub3Qgc29ydEFzY1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtZGVzYyBpY29uLXRyaWFuZ2xlLXVwIGFjdGl2ZSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1kZXNjIGljb24tdHJpYW5nbGUtdXAnXG5cbmNsYXNzIFRvZG9WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHNob3dJblRhYmxlID0gW10sIHRvZG8pIC0+XG4gICAgQHRyID0+XG4gICAgICBmb3IgaXRlbSBpbiBzaG93SW5UYWJsZVxuICAgICAgICBAdGQgPT5cbiAgICAgICAgICBzd2l0Y2ggaXRlbVxuICAgICAgICAgICAgd2hlbiAnQWxsJyAgIHRoZW4gQHNwYW4gdG9kby5hbGxcbiAgICAgICAgICAgIHdoZW4gJ1RleHQnICB0aGVuIEBzcGFuIHRvZG8udGV4dFxuICAgICAgICAgICAgd2hlbiAnVHlwZScgIHRoZW4gQGkgdG9kby50eXBlXG4gICAgICAgICAgICB3aGVuICdSYW5nZScgdGhlbiBAaSB0b2RvLnJhbmdlXG4gICAgICAgICAgICB3aGVuICdMaW5lJyAgdGhlbiBAaSB0b2RvLmxpbmVcbiAgICAgICAgICAgIHdoZW4gJ1JlZ2V4JyB0aGVuIEBjb2RlIHRvZG8ucmVnZXhcbiAgICAgICAgICAgIHdoZW4gJ1BhdGgnICB0aGVuIEBhIHRvZG8ucGF0aFxuICAgICAgICAgICAgd2hlbiAnRmlsZScgIHRoZW4gQGEgdG9kby5maWxlXG4gICAgICAgICAgICB3aGVuICdUYWdzJyAgdGhlbiBAaSB0b2RvLnRhZ3NcbiAgICAgICAgICAgIHdoZW4gJ0lkJyAgICB0aGVuIEBpIHRvZG8uaWRcbiAgICAgICAgICAgIHdoZW4gJ1Byb2plY3QnIHRoZW4gQGEgdG9kby5wcm9qZWN0XG5cbiAgaW5pdGlhbGl6ZTogKHNob3dJblRhYmxlLCBAdG9kbykgLT5cbiAgICBAaGFuZGxlRXZlbnRzKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBkZXRhY2goKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAb24gJ2NsaWNrJywgJ3RkJywgQG9wZW5QYXRoXG5cbiAgb3BlblBhdGg6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBAdG9kbyBhbmQgQHRvZG8ubG9jXG4gICAgcG9zaXRpb24gPSBbQHRvZG8ucG9zaXRpb25bMF1bMF0sIEB0b2RvLnBvc2l0aW9uWzBdWzFdXVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihAdG9kby5sb2MsIHtcbiAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSBvciBmYWxzZVxuICAgIH0pLnRoZW4gLT5cbiAgICAgICMgU2V0dGluZyBpbml0aWFsQ29sdW1uL0xpbmUgZG9lcyBub3QgYWx3YXlzIGNlbnRlciB2aWV3XG4gICAgICBpZiB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIGF1dG9zY3JvbGw6IGZhbHNlKVxuICAgICAgICB0ZXh0RWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oY2VudGVyOiB0cnVlKVxuXG5jbGFzcyBUb2RvRW1wdHlWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHNob3dJblRhYmxlID0gW10pIC0+XG4gICAgQHRyID0+XG4gICAgICBAdGQgY29sc3Bhbjogc2hvd0luVGFibGUubGVuZ3RoLCA9PlxuICAgICAgICBAcCBcIk5vIHJlc3VsdHMuLi5cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtUYWJsZUhlYWRlclZpZXcsIFRvZG9WaWV3LCBUb2RvRW1wdHlWaWV3fVxuIl19
