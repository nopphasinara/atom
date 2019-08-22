(function() {
  var Emitter, TodoCollection, TodoModel, TodoRegex, TodosMarkdown, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  TodoRegex = require('./todo-regex');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'workspace';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidCancelSearch = function(cb) {
      return this.emitter.on('did-cancel-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.getState = function() {
      return this.searching;
    };

    TodoCollection.prototype.sortTodos = function(arg) {
      var ref, ref1, sortAsc, sortBy;
      ref = arg != null ? arg : {}, sortBy = ref.sortBy, sortAsc = ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      if (((ref1 = this.searches) != null ? ref1[this.searches.length - 1].sortBy : void 0) !== sortBy) {
        if (this.searches == null) {
          this.searches = [];
        }
        this.searches.push({
          sortBy: sortBy,
          sortAsc: sortAsc
        });
      } else {
        this.searches[this.searches.length - 1] = {
          sortBy: sortBy,
          sortAsc: sortAsc
        };
      }
      this.todos = this.todos.sort((function(_this) {
        return function(todoA, todoB) {
          return _this.todoSorter(todoA, todoB, sortBy, sortAsc);
        };
      })(this));
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.todoSorter = function(todoA, todoB, sortBy, sortAsc) {
      var aVal, bVal, comp, findTheseTodos, ref, ref1, ref2, ref3, search, sortAsc2, sortBy2;
      ref = [sortBy, sortAsc], sortBy2 = ref[0], sortAsc2 = ref[1];
      aVal = todoA.get(sortBy2);
      bVal = todoB.get(sortBy2);
      if (aVal === bVal) {
        if (search = (ref1 = this.searches) != null ? ref1[this.searches.length - 2] : void 0) {
          ref2 = [search.sortBy, search.sortAsc], sortBy2 = ref2[0], sortAsc2 = ref2[1];
        } else {
          sortBy2 = this.defaultKey;
        }
        ref3 = [todoA.get(sortBy2), todoB.get(sortBy2)], aVal = ref3[0], bVal = ref3[1];
      }
      if (sortBy2 === 'Type') {
        findTheseTodos = atom.config.get('todo-show.findTheseTodos');
        comp = findTheseTodos.indexOf(aVal) - findTheseTodos.indexOf(bVal);
      } else if (todoA.keyIsNumber(sortBy2)) {
        comp = parseInt(aVal) - parseInt(bVal);
      } else {
        comp = aVal.localeCompare(bVal);
      }
      if (sortAsc2) {
        return comp;
      } else {
        return -comp;
      }
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      this.filter = filter;
      return this.emitter.emit('did-filter-todos', this.getFilteredTodos());
    };

    TodoCollection.prototype.getFilteredTodos = function() {
      var filter;
      if (!(filter = this.filter)) {
        return this.todos;
      }
      return this.todos.filter(function(todo) {
        return todo.contains(filter);
      });
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'workspace':
            return 'project';
          case 'project':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'workspace';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.getCustomPath = function() {
      return this.customPath;
    };

    TodoCollection.prototype.setCustomPath = function(customPath) {
      this.customPath = customPath;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.fetchRegexItem = function(todoRegex, activeProjectOnly) {
      var options;
      options = {
        paths: this.getSearchPaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(todoRegex.regexp, options, (function(_this) {
        return function(result, error) {
          var i, len, match, ref, results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          ref = result.matches;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            match = ref[i];
            results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, i, len;
      editors = [];
      if (activeEditorOnly) {
        if (editor = atom.workspace.getActiveTextEditor()) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (i = 0, len = editors.length; i < len; i++) {
        editor = editors[i];
        editor.scan(todoRegex.regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.range.start.row, match.range.start.column], [match.range.end.row, match.range.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: editor.getPath(),
              position: range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function(force) {
      var todoRegex;
      if (force == null) {
        force = false;
      }
      if (!atom.config.get('todo-show.autoRefresh') && !force) {
        return;
      }
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      todoRegex = new TodoRegex(atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos'));
      if (todoRegex.error) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(todoRegex, false);
          case 'active':
            return this.fetchOpenRegexItem(todoRegex, true);
          case 'project':
            return this.fetchRegexItem(todoRegex, true);
          default:
            return this.fetchRegexItem(todoRegex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function(result) {
          _this.searching = false;
          if (result === 'cancelled') {
            return _this.emitter.emit('did-cancel-search');
          } else {
            return _this.emitter.emit('did-finish-search');
          }
        };
      })(this))["catch"]((function(_this) {
        return function(reason) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', reason);
        };
      })(this));
    };

    TodoCollection.prototype.getSearchPaths = function() {
      var i, ignore, ignores, len, results;
      if (this.scope === 'custom') {
        return [this.getCustomPath()];
      }
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      results = [];
      for (i = 0, len = ignores.length; i < len; i++) {
        ignore = ignores[i];
        results.push("!" + ignore);
      }
      return results;
    };

    TodoCollection.prototype.activeProjectHas = function(filePath) {
      var project;
      if (filePath == null) {
        filePath = '';
      }
      if (!(project = this.getActiveProject())) {
        return;
      }
      return filePath.indexOf(project) === 0;
    };

    TodoCollection.prototype.getActiveProject = function() {
      var project;
      if (this.activeProject) {
        return this.activeProject;
      }
      if (project = this.getFallbackProject()) {
        return this.activeProject = project;
      }
    };

    TodoCollection.prototype.getFallbackProject = function() {
      var i, item, len, project, ref;
      ref = atom.workspace.getPaneItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (project = this.projectForFile(typeof item.getPath === "function" ? item.getPath() : void 0)) {
          return project;
        }
      }
      if (project = atom.project.getPaths()[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getActiveProjectName = function() {
      var project, projectName;
      if (!(project = this.getActiveProject())) {
        return 'no active project';
      }
      projectName = path.basename(project);
      if (projectName === 'undefined') {
        return "no active project";
      } else {
        return projectName;
      }
    };

    TodoCollection.prototype.setActiveProject = function(filePath) {
      var lastProject, project;
      lastProject = this.activeProject;
      if (project = this.projectForFile(filePath)) {
        this.activeProject = project;
      }
      if (!lastProject) {
        return false;
      }
      return lastProject !== this.activeProject;
    };

    TodoCollection.prototype.projectForFile = function(filePath) {
      var project;
      if (typeof filePath !== 'string') {
        return;
      }
      if (project = atom.project.relativizePath(filePath)[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getFilteredTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var ref;
      return (ref = this.searchPromise) != null ? typeof ref.cancel === "function" ? ref.cancel() : void 0 : void 0;
    };

    TodoCollection.prototype.getPreviousSearch = function() {
      var sortBy;
      return sortBy = localStorage.getItem('todo-show.previous-sortBy');
    };

    TodoCollection.prototype.setPreviousSearch = function(search) {
      return localStorage.setItem('todo-show.previous-search', search);
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tY29sbGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVaLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFDWixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUjs7RUFDaEIsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyx3QkFBQTtNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUNmLElBQUMsQ0FBQSxVQUFELEdBQWM7TUFDZCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUpFOzs2QkFNYixZQUFBLEdBQWMsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixFQUE1QjtJQUFSOzs2QkFDZCxlQUFBLEdBQWlCLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CO0lBQVI7OzZCQUNqQixVQUFBLEdBQVksU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0I7SUFBUjs7NkJBQ1osZ0JBQUEsR0FBa0IsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEM7SUFBUjs7NkJBQ2xCLGdCQUFBLEdBQWtCLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLEVBQWhDO0lBQVI7OzZCQUNsQixp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QUFwQjtBQUFBLGVBQU8sTUFBUDs7YUFDQSxXQUFBLEtBQWlCLElBQUMsQ0FBQTtJQUpGOzs2QkFNbEIsY0FBQSxHQUFnQixTQUFDLFFBQUQ7QUFDZCxVQUFBO01BQUEsSUFBVSxPQUFPLFFBQVAsS0FBcUIsUUFBL0I7QUFBQSxlQUFBOztNQUNBLElBQVcsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUFzQyxDQUFBLENBQUEsQ0FBM0Q7ZUFBQSxRQUFBOztJQUZjOzs2QkFJaEIsV0FBQSxHQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFJO2FBQ3BCLGFBQWEsQ0FBQyxRQUFkLENBQXVCLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQXZCO0lBRlc7OzZCQUliLFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTt3RkFBYyxDQUFFO0lBREo7OzZCQUlkLGlCQUFBLEdBQW1CLFNBQUE7QUFDakIsVUFBQTthQUFBLE1BQUEsR0FBUyxZQUFZLENBQUMsT0FBYixDQUFxQiwyQkFBckI7SUFEUTs7NkJBR25CLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDthQUNqQixZQUFZLENBQUMsT0FBYixDQUFxQiwyQkFBckIsRUFBa0QsTUFBbEQ7SUFEaUI7Ozs7O0FBOVByQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxuVG9kb01vZGVsID0gcmVxdWlyZSAnLi90b2RvLW1vZGVsJ1xuVG9kb3NNYXJrZG93biA9IHJlcXVpcmUgJy4vdG9kby1tYXJrZG93bidcblRvZG9SZWdleCA9IHJlcXVpcmUgJy4vdG9kby1yZWdleCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVG9kb0NvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBkZWZhdWx0S2V5ID0gJ1RleHQnXG4gICAgQHNjb3BlID0gJ3dvcmtzcGFjZSdcbiAgICBAdG9kb3MgPSBbXVxuXG4gIG9uRGlkQWRkVG9kbzogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWFkZC10b2RvJywgY2JcbiAgb25EaWRSZW1vdmVUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLXRvZG8nLCBjYlxuICBvbkRpZENsZWFyOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2xlYXItdG9kb3MnLCBjYlxuICBvbkRpZFN0YXJ0U2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc3RhcnQtc2VhcmNoJywgY2JcbiAgb25EaWRTZWFyY2hQYXRoczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNlYXJjaC1wYXRocycsIGNiXG4gIG9uRGlkRmluaXNoU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmluaXNoLXNlYXJjaCcsIGNiXG4gIG9uRGlkQ2FuY2VsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2FuY2VsLXNlYXJjaCcsIGNiXG4gIG9uRGlkRmFpbFNlYXJjaDogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWZhaWwtc2VhcmNoJywgY2JcbiAgb25EaWRTb3J0VG9kb3M6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zb3J0LXRvZG9zJywgY2JcbiAgb25EaWRGaWx0ZXJUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWZpbHRlci10b2RvcycsIGNiXG4gIG9uRGlkQ2hhbmdlU2VhcmNoU2NvcGU6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2Utc2NvcGUnLCBjYlxuXG4gIGNsZWFyOiAtPlxuICAgIEBjYW5jZWxTZWFyY2goKVxuICAgIEB0b2RvcyA9IFtdXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNsZWFyLXRvZG9zJ1xuXG4gIGFkZFRvZG86ICh0b2RvKSAtPlxuICAgIHJldHVybiBpZiBAYWxyZWFkeUV4aXN0cyh0b2RvKVxuICAgIEB0b2Rvcy5wdXNoKHRvZG8pXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC10b2RvJywgdG9kb1xuXG4gIGdldFRvZG9zOiAtPiBAdG9kb3NcbiAgZ2V0VG9kb3NDb3VudDogLT4gQHRvZG9zLmxlbmd0aFxuICBnZXRTdGF0ZTogLT4gQHNlYXJjaGluZ1xuXG4gIHNvcnRUb2RvczogKHtzb3J0QnksIHNvcnRBc2N9ID0ge30pIC0+XG4gICAgc29ydEJ5ID89IEBkZWZhdWx0S2V5XG5cbiAgICAjIFNhdmUgaGlzdG9yeSBvZiBuZXcgc29ydCBlbGVtZW50c1xuICAgIGlmIEBzZWFyY2hlcz9bQHNlYXJjaGVzLmxlbmd0aCAtIDFdLnNvcnRCeSBpc250IHNvcnRCeVxuICAgICAgQHNlYXJjaGVzID89IFtdXG4gICAgICBAc2VhcmNoZXMucHVzaCB7c29ydEJ5LCBzb3J0QXNjfVxuICAgIGVsc2VcbiAgICAgIEBzZWFyY2hlc1tAc2VhcmNoZXMubGVuZ3RoIC0gMV0gPSB7c29ydEJ5LCBzb3J0QXNjfVxuXG4gICAgQHRvZG9zID0gQHRvZG9zLnNvcnQoKHRvZG9BLCB0b2RvQikgPT5cbiAgICAgIEB0b2RvU29ydGVyKHRvZG9BLCB0b2RvQiwgc29ydEJ5LCBzb3J0QXNjKVxuICAgIClcblxuICAgIHJldHVybiBAZmlsdGVyVG9kb3MoQGZpbHRlcikgaWYgQGZpbHRlclxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zb3J0LXRvZG9zJywgQHRvZG9zXG5cbiAgdG9kb1NvcnRlcjogKHRvZG9BLCB0b2RvQiwgc29ydEJ5LCBzb3J0QXNjKSAtPlxuICAgIFtzb3J0QnkyLCBzb3J0QXNjMl0gPSBbc29ydEJ5LCBzb3J0QXNjXVxuXG4gICAgYVZhbCA9IHRvZG9BLmdldChzb3J0QnkyKVxuICAgIGJWYWwgPSB0b2RvQi5nZXQoc29ydEJ5MilcblxuICAgIGlmIGFWYWwgaXMgYlZhbFxuICAgICAgIyBVc2UgcHJldmlvdXMgc29ydHMgdG8gbWFrZSBhIDItbGV2ZWwgc3RhYmxlIHNvcnRcbiAgICAgIGlmIHNlYXJjaCA9IEBzZWFyY2hlcz9bQHNlYXJjaGVzLmxlbmd0aCAtIDJdXG4gICAgICAgIFtzb3J0QnkyLCBzb3J0QXNjMl0gPSBbc2VhcmNoLnNvcnRCeSwgc2VhcmNoLnNvcnRBc2NdXG4gICAgICBlbHNlXG4gICAgICAgIHNvcnRCeTIgPSBAZGVmYXVsdEtleVxuXG4gICAgICBbYVZhbCwgYlZhbF0gPSBbdG9kb0EuZ2V0KHNvcnRCeTIpLCB0b2RvQi5nZXQoc29ydEJ5MildXG5cbiAgICAjIFNvcnQgdHlwZSBpbiB0aGUgZGVmaW5lZCBvcmRlciwgYXMgbnVtYmVyIG9yIG5vcm1hbCBzdHJpbmcgc29ydFxuICAgIGlmIHNvcnRCeTIgaXMgJ1R5cGUnXG4gICAgICBmaW5kVGhlc2VUb2RvcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICAgIGNvbXAgPSBmaW5kVGhlc2VUb2Rvcy5pbmRleE9mKGFWYWwpIC0gZmluZFRoZXNlVG9kb3MuaW5kZXhPZihiVmFsKVxuICAgIGVsc2UgaWYgdG9kb0Eua2V5SXNOdW1iZXIoc29ydEJ5MilcbiAgICAgIGNvbXAgPSBwYXJzZUludChhVmFsKSAtIHBhcnNlSW50KGJWYWwpXG4gICAgZWxzZVxuICAgICAgY29tcCA9IGFWYWwubG9jYWxlQ29tcGFyZShiVmFsKVxuICAgIGlmIHNvcnRBc2MyIHRoZW4gY29tcCBlbHNlIC1jb21wXG5cbiAgZmlsdGVyVG9kb3M6IChmaWx0ZXIpIC0+XG4gICAgQGZpbHRlciA9IGZpbHRlclxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1maWx0ZXItdG9kb3MnLCBAZ2V0RmlsdGVyZWRUb2RvcygpXG5cbiAgZ2V0RmlsdGVyZWRUb2RvczogLT5cbiAgICByZXR1cm4gQHRvZG9zIHVubGVzcyBmaWx0ZXIgPSBAZmlsdGVyXG4gICAgQHRvZG9zLmZpbHRlciAodG9kbykgLT5cbiAgICAgIHRvZG8uY29udGFpbnMoZmlsdGVyKVxuXG4gIGdldEF2YWlsYWJsZVRhYmxlSXRlbXM6IC0+IEBhdmFpbGFibGVJdGVtc1xuICBzZXRBdmFpbGFibGVUYWJsZUl0ZW1zOiAoQGF2YWlsYWJsZUl0ZW1zKSAtPlxuXG4gIGdldFNlYXJjaFNjb3BlOiAtPiBAc2NvcGVcbiAgc2V0U2VhcmNoU2NvcGU6IChzY29wZSkgLT5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2hhbmdlLXNjb3BlJywgQHNjb3BlID0gc2NvcGVcblxuICB0b2dnbGVTZWFyY2hTY29wZTogLT5cbiAgICBzY29wZSA9IHN3aXRjaCBAc2NvcGVcbiAgICAgIHdoZW4gJ3dvcmtzcGFjZScgdGhlbiAncHJvamVjdCdcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gJ29wZW4nXG4gICAgICB3aGVuICdvcGVuJyB0aGVuICdhY3RpdmUnXG4gICAgICBlbHNlICd3b3Jrc3BhY2UnXG4gICAgQHNldFNlYXJjaFNjb3BlKHNjb3BlKVxuICAgIHNjb3BlXG5cbiAgZ2V0Q3VzdG9tUGF0aDogLT4gQGN1c3RvbVBhdGhcbiAgc2V0Q3VzdG9tUGF0aDogKEBjdXN0b21QYXRoKSAtPlxuXG4gIGFscmVhZHlFeGlzdHM6IChuZXdUb2RvKSAtPlxuICAgIHByb3BlcnRpZXMgPSBbJ3JhbmdlJywgJ3BhdGgnXVxuICAgIEB0b2Rvcy5zb21lICh0b2RvKSAtPlxuICAgICAgcHJvcGVydGllcy5ldmVyeSAocHJvcCkgLT5cbiAgICAgICAgdHJ1ZSBpZiB0b2RvW3Byb3BdIGlzIG5ld1RvZG9bcHJvcF1cblxuICAjIFNjYW4gcHJvamVjdCB3b3Jrc3BhY2UgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gICMgcmV0dXJucyBhIHByb21pc2UgdGhhdCB0aGUgc2NhbiBnZW5lcmF0ZXNcbiAgZmV0Y2hSZWdleEl0ZW06ICh0b2RvUmVnZXgsIGFjdGl2ZVByb2plY3RPbmx5KSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgcGF0aHM6IEBnZXRTZWFyY2hQYXRocygpXG4gICAgICBvblBhdGhzU2VhcmNoZWQ6IChuUGF0aHMpID0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zZWFyY2gtcGF0aHMnLCBuUGF0aHMgaWYgQHNlYXJjaGluZ1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCBvcHRpb25zLCAocmVzdWx0LCBlcnJvcikgPT5cbiAgICAgIGNvbnNvbGUuZGVidWcgZXJyb3IubWVzc2FnZSBpZiBlcnJvclxuICAgICAgcmV0dXJuIHVubGVzcyByZXN1bHRcblxuICAgICAgcmV0dXJuIGlmIGFjdGl2ZVByb2plY3RPbmx5IGFuZCBub3QgQGFjdGl2ZVByb2plY3RIYXMocmVzdWx0LmZpbGVQYXRoKVxuXG4gICAgICBmb3IgbWF0Y2ggaW4gcmVzdWx0Lm1hdGNoZXNcbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgICBwb3NpdGlvbjogbWF0Y2gucmFuZ2VcbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcblxuICAjIFNjYW4gb3BlbiBmaWxlcyBmb3IgdGhlIFRvZG9SZWdleCBvYmplY3RcbiAgZmV0Y2hPcGVuUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVFZGl0b3JPbmx5KSAtPlxuICAgIGVkaXRvcnMgPSBbXVxuICAgIGlmIGFjdGl2ZUVkaXRvck9ubHlcbiAgICAgIGlmIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBlZGl0b3JzID0gW2VkaXRvcl1cbiAgICBlbHNlXG4gICAgICBlZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuXG4gICAgZm9yIGVkaXRvciBpbiBlZGl0b3JzXG4gICAgICBlZGl0b3Iuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCAobWF0Y2gsIGVycm9yKSA9PlxuICAgICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgICAgcmV0dXJuIHVubGVzcyBtYXRjaFxuXG4gICAgICAgIHJhbmdlID0gW1xuICAgICAgICAgIFttYXRjaC5yYW5nZS5zdGFydC5yb3csIG1hdGNoLnJhbmdlLnN0YXJ0LmNvbHVtbl1cbiAgICAgICAgICBbbWF0Y2gucmFuZ2UuZW5kLnJvdywgbWF0Y2gucmFuZ2UuZW5kLmNvbHVtbl1cbiAgICAgICAgXVxuXG4gICAgICAgIEBhZGRUb2RvIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgYWxsOiBtYXRjaC5saW5lVGV4dFxuICAgICAgICAgIHRleHQ6IG1hdGNoLm1hdGNoVGV4dFxuICAgICAgICAgIGxvYzogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICAgIHBvc2l0aW9uOiByYW5nZVxuICAgICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgICByZWdleHA6IHRvZG9SZWdleC5yZWdleHBcbiAgICAgICAgKVxuXG4gICAgIyBObyBhc3luYyBvcGVyYXRpb25zLCBzbyBqdXN0IHJldHVybiBhIHJlc29sdmVkIHByb21pc2VcbiAgICBQcm9taXNlLnJlc29sdmUoKVxuXG4gIHNlYXJjaDogKGZvcmNlID0gZmFsc2UpIC0+XG4gICAgcmV0dXJuIGlmICFhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCcpIGFuZCAhZm9yY2VcblxuICAgIEBjbGVhcigpXG4gICAgQHNlYXJjaGluZyA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc3RhcnQtc2VhcmNoJ1xuXG4gICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICApXG5cbiAgICBpZiB0b2RvUmVnZXguZXJyb3JcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiSW52YWxpZCB0b2RvIHNlYXJjaCByZWdleFwiXG4gICAgICByZXR1cm5cblxuICAgIEBzZWFyY2hQcm9taXNlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgZmFsc2UpXG4gICAgICB3aGVuICdhY3RpdmUnIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBlbHNlIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICBAc2VhcmNoUHJvbWlzZS50aGVuIChyZXN1bHQpID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIGlmIHJlc3VsdCBpcyAnY2FuY2VsbGVkJ1xuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2FuY2VsLXNlYXJjaCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbmlzaC1zZWFyY2gnXG4gICAgLmNhdGNoIChyZWFzb24pID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIHJlYXNvblxuXG4gIGdldFNlYXJjaFBhdGhzOiAtPlxuICAgIHJldHVybiBbQGdldEN1c3RvbVBhdGgoKV0gaWYgQHNjb3BlIGlzICdjdXN0b20nXG5cbiAgICBpZ25vcmVzID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycpXG4gICAgcmV0dXJuIFsnKiddIHVubGVzcyBpZ25vcmVzP1xuICAgIGlmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpZ25vcmVzKSBpc250ICdbb2JqZWN0IEFycmF5XSdcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiaWdub3JlVGhlc2VQYXRocyBtdXN0IGJlIGFuIGFycmF5XCJcbiAgICAgIHJldHVybiBbJyonXVxuICAgIFwiISN7aWdub3JlfVwiIGZvciBpZ25vcmUgaW4gaWdub3Jlc1xuXG4gIGFjdGl2ZVByb2plY3RIYXM6IChmaWxlUGF0aCA9ICcnKSAtPlxuICAgIHJldHVybiB1bmxlc3MgcHJvamVjdCA9IEBnZXRBY3RpdmVQcm9qZWN0KClcbiAgICBmaWxlUGF0aC5pbmRleE9mKHByb2plY3QpIGlzIDBcblxuICBnZXRBY3RpdmVQcm9qZWN0OiAtPlxuICAgIHJldHVybiBAYWN0aXZlUHJvamVjdCBpZiBAYWN0aXZlUHJvamVjdFxuICAgIEBhY3RpdmVQcm9qZWN0ID0gcHJvamVjdCBpZiBwcm9qZWN0ID0gQGdldEZhbGxiYWNrUHJvamVjdCgpXG5cbiAgZ2V0RmFsbGJhY2tQcm9qZWN0OiAtPlxuICAgIGZvciBpdGVtIGluIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG4gICAgICBpZiBwcm9qZWN0ID0gQHByb2plY3RGb3JGaWxlKGl0ZW0uZ2V0UGF0aD8oKSlcbiAgICAgICAgcmV0dXJuIHByb2plY3RcbiAgICBwcm9qZWN0IGlmIHByb2plY3QgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuXG4gIGdldEFjdGl2ZVByb2plY3ROYW1lOiAtPlxuICAgIHJldHVybiAnbm8gYWN0aXZlIHByb2plY3QnIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIHByb2plY3ROYW1lID0gcGF0aC5iYXNlbmFtZShwcm9qZWN0KVxuICAgIGlmIHByb2plY3ROYW1lIGlzICd1bmRlZmluZWQnIHRoZW4gXCJubyBhY3RpdmUgcHJvamVjdFwiIGVsc2UgcHJvamVjdE5hbWVcblxuICBzZXRBY3RpdmVQcm9qZWN0OiAoZmlsZVBhdGgpIC0+XG4gICAgbGFzdFByb2plY3QgPSBAYWN0aXZlUHJvamVjdFxuICAgIEBhY3RpdmVQcm9qZWN0ID0gcHJvamVjdCBpZiBwcm9qZWN0ID0gQHByb2plY3RGb3JGaWxlKGZpbGVQYXRoKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgbGFzdFByb2plY3RcbiAgICBsYXN0UHJvamVjdCBpc250IEBhY3RpdmVQcm9qZWN0XG5cbiAgcHJvamVjdEZvckZpbGU6IChmaWxlUGF0aCkgLT5cbiAgICByZXR1cm4gaWYgdHlwZW9mIGZpbGVQYXRoIGlzbnQgJ3N0cmluZydcbiAgICBwcm9qZWN0IGlmIHByb2plY3QgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG5cbiAgZ2V0TWFya2Rvd246IC0+XG4gICAgdG9kb3NNYXJrZG93biA9IG5ldyBUb2Rvc01hcmtkb3duXG4gICAgdG9kb3NNYXJrZG93bi5tYXJrZG93biBAZ2V0RmlsdGVyZWRUb2RvcygpXG5cbiAgY2FuY2VsU2VhcmNoOiAtPlxuICAgIEBzZWFyY2hQcm9taXNlPy5jYW5jZWw/KClcblxuICAjIFRPRE86IFByZXZpb3VzIHNlYXJjaGVzIGFyZSBub3Qgc2F2ZWQgeWV0IVxuICBnZXRQcmV2aW91c1NlYXJjaDogLT5cbiAgICBzb3J0QnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNvcnRCeSdcblxuICBzZXRQcmV2aW91c1NlYXJjaDogKHNlYXJjaCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNlYXJjaCcsIHNlYXJjaFxuIl19
