(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), ScrollView = ref1.ScrollView, TextEditorView = ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    ShowTodoView.content = function(collection, filterBuffer) {
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'exportButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection1, uri) {
      this.collection = collection1;
      this.uri = uri;
      this.toggleOptions = bind(this.toggleOptions, this);
      this.setScopeButtonState = bind(this.setScopeButtonState, this);
      this.toggleSearchScope = bind(this.toggleSearchScope, this);
      this["export"] = bind(this["export"], this);
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.onlySearchWhenVisible = true;
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.exportButton, {
        title: "Export Todos"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(atom.commands.add(this.element, {
        'core:export': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this["export"]();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.search(true);
          };
        })(this)
      }));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.search(true);
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text(nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.search();
          }));
        };
      })(this)));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.exportButton.on('click', this["export"]);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.search(true);
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.serialize = function() {
      return {
        deserializer: 'todo-show/todo-view',
        scope: this.collection.scope,
        customPath: this.collection.getCustomPath()
      };
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getDefaultLocation = function() {
      return 'right';
    };

    ShowTodoView.prototype.getAllowedLocations = function() {
      return ['left', 'right', 'bottom'];
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.search = function(force) {
      var ref2;
      if (force == null) {
        force = false;
      }
      if (this.onlySearchWhenVisible) {
        if (!((ref2 = atom.workspace.paneContainerForItem(this)) != null ? ref2.isVisible() : void 0)) {
          return;
        }
      }
      return this.collection.search(force);
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html((this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        case 'custom':
          return "in <code>" + this.collection.customPath + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype["export"] = function() {
      var filePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (fs.existsSync(filePath)) {
        filePath = void 0;
      }
      return atom.workspace.open(filePath).then((function(_this) {
        return function(textEditor) {
          return textEditor.setText(_this.collection.getMarkdown());
        };
      })(this));
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
        case 'custom':
          return this.scopeButton.text('Custom');
        default:
          return this.scopeButton.text('Workspace');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRJQUFBO0lBQUE7Ozs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixPQUErQixPQUFBLENBQVEsc0JBQVIsQ0FBL0IsRUFBQyw0QkFBRCxFQUFhOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUjs7RUFDWixXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSOztFQUVkLG9CQUFBLEdBQXVCLFNBQUMsTUFBRDtBQUNyQixRQUFBO0lBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixNQUEvQixFQURGO0tBQUEsTUFBQTtNQUdFLFVBQUEsR0FBYSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7YUFDN0IsSUFBSSxVQUFKLENBQWUsTUFBZixFQUpGOztFQURxQjs7RUFPdkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFVBQUQsRUFBYSxZQUFiO2FBV1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7UUFBNEIsUUFBQSxFQUFVLENBQUMsQ0FBdkM7T0FBTCxFQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDN0MsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUE7WUFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8s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VUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEI7SUFETTs7MkJBR1IsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxXQUFELENBQWEseU5BQWIsRUFERjs7SUFEZ0I7Ozs7S0ExTU87QUFoQjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntTY3JvbGxWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5Ub2RvVGFibGUgPSByZXF1aXJlICcuL3RvZG8tdGFibGUtdmlldydcblRvZG9PcHRpb25zID0gcmVxdWlyZSAnLi90b2RvLW9wdGlvbnMtdmlldydcblxuZGVwcmVjYXRlZFRleHRFZGl0b3IgPSAocGFyYW1zKSAtPlxuICBpZiBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3I/XG4gICAgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHBhcmFtcylcbiAgZWxzZVxuICAgIFRleHRFZGl0b3IgPSByZXF1aXJlKCdhdG9tJykuVGV4dEVkaXRvclxuICAgIG5ldyBUZXh0RWRpdG9yKHBhcmFtcylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogKGNvbGxlY3Rpb24sIGZpbHRlckJ1ZmZlcikgLT5cbiAgICAjIEZJWE1FOiBDcmVhdGluZyB0ZXh0IGVkaXRvciB0aGlzIHdheSByZXN1bHRzIGluIHdlaXJkIGdldFNjb3BlQ2hhaW4gZXJyb3IgaW4gQXRvbSBjb3JlIC0gZGVwcmVjYXRlZFxuICAgICMgZmlsdGVyRWRpdG9yID0gZGVwcmVjYXRlZFRleHRFZGl0b3IoXG4gICAgIyAgIG1pbmk6IHRydWVcbiAgICAjICAgdGFiTGVuZ3RoOiAyXG4gICAgIyAgIHNvZnRUYWJzOiB0cnVlXG4gICAgIyAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICMgICBidWZmZXI6IGZpbHRlckJ1ZmZlclxuICAgICMgICBwbGFjZWhvbGRlclRleHQ6ICdTZWFyY2ggVG9kb3MnXG4gICAgIyApXG5cbiAgICBAZGl2IGNsYXNzOiAnc2hvdy10b2RvLXByZXZpZXcnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbSBpbnB1dC1ibG9jay1pdGVtLS1mbGV4J1xuICAgICAgICAgICMgQHN1YnZpZXcgJ2ZpbHRlckVkaXRvclZpZXcnLCBuZXcgVGV4dEVkaXRvclZpZXcoZWRpdG9yOiBmaWx0ZXJFZGl0b3IpXG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtJywgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwJywgPT5cbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnc2NvcGVCdXR0b24nLCBjbGFzczogJ2J0bidcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnb3B0aW9uc0J1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tZ2VhcidcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnZXhwb3J0QnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1jbG91ZC1kb3dubG9hZCdcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAncmVmcmVzaEJ1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tc3luYydcblxuICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrIHRvZG8taW5mby1ibG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtJywgPT5cbiAgICAgICAgICBAc3BhbiBvdXRsZXQ6ICd0b2RvSW5mbydcblxuICAgICAgQGRpdiBvdXRsZXQ6ICdvcHRpb25zVmlldydcblxuICAgICAgQGRpdiBvdXRsZXQ6ICd0b2RvTG9hZGluZycsIGNsYXNzOiAndG9kby1sb2FkaW5nJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ21hcmtkb3duLXNwaW5uZXInXG4gICAgICAgIEBoNSBvdXRsZXQ6ICdzZWFyY2hDb3VudCcsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBcIkxvYWRpbmcgVG9kb3MuLi5cIlxuXG4gICAgICBAc3VidmlldyAndG9kb1RhYmxlJywgbmV3IFRvZG9UYWJsZShjb2xsZWN0aW9uKVxuXG4gIGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEB1cmkpIC0+XG4gICAgc3VwZXIgQGNvbGxlY3Rpb24sIEBmaWx0ZXJCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlclxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShAY29sbGVjdGlvbi5nZXRTZWFyY2hTY29wZSgpKVxuXG4gICAgQG9ubHlTZWFyY2hXaGVuVmlzaWJsZSA9IHRydWVcbiAgICBAbm90aWZpY2F0aW9uT3B0aW9ucyA9XG4gICAgICBkZXRhaWw6ICdBdG9tIHRvZG8tc2hvdyBwYWNrYWdlJ1xuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIGljb246IEBnZXRJY29uTmFtZSgpXG5cbiAgICBAY2hlY2tEZXByZWNhdGlvbigpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBzY29wZUJ1dHRvbiwgdGl0bGU6IFwiV2hhdCB0byBTZWFyY2hcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQG9wdGlvbnNCdXR0b24sIHRpdGxlOiBcIlNob3cgVG9kbyBPcHRpb25zXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBleHBvcnRCdXR0b24sIHRpdGxlOiBcIkV4cG9ydCBUb2Rvc1wiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAcmVmcmVzaEJ1dHRvbiwgdGl0bGU6IFwiUmVmcmVzaCBUb2Rvc1wiXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnY29yZTpleHBvcnQnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBleHBvcnQoKVxuICAgICAgJ2NvcmU6cmVmcmVzaCc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQHNlYXJjaCh0cnVlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZFN0YXJ0U2VhcmNoIEBzdGFydExvYWRpbmdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmluaXNoU2VhcmNoIEBzdG9wTG9hZGluZ1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGYWlsU2VhcmNoIChlcnIpID0+XG4gICAgICBAc2VhcmNoQ291bnQudGV4dCBcIlNlYXJjaCBGYWlsZWRcIlxuICAgICAgY29uc29sZS5lcnJvciBlcnIgaWYgZXJyXG4gICAgICBAc2hvd0Vycm9yIGVyciBpZiBlcnJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRDaGFuZ2VTZWFyY2hTY29wZSAoc2NvcGUpID0+XG4gICAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcbiAgICAgIEBzZWFyY2godHJ1ZSlcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTZWFyY2hQYXRocyAoblBhdGhzKSA9PlxuICAgICAgQHNlYXJjaENvdW50LnRleHQgXCIje25QYXRoc30gcGF0aHMgc2VhcmNoZWQuLi5cIlxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PlxuICAgICAgaWYgQGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdChpdGVtPy5nZXRQYXRoPygpKSBvclxuICAgICAgKGl0ZW0/LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1RleHRFZGl0b3InIGFuZCBAY29sbGVjdGlvbi5zY29wZSBpcyAnYWN0aXZlJylcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkVGV4dEVkaXRvciAoe3RleHRFZGl0b3J9KSA9PlxuICAgICAgQHNlYXJjaCgpIGlmIEBjb2xsZWN0aW9uLnNjb3BlIGlzICdvcGVuJ1xuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSAoe2l0ZW19KSA9PlxuICAgICAgQHNlYXJjaCgpIGlmIEBjb2xsZWN0aW9uLnNjb3BlIGlzICdvcGVuJ1xuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZWRpdG9yLm9uRGlkU2F2ZSA9PlxuICAgICAgICBAc2VhcmNoKClcblxuICAgICMgQGZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICMgICBAZmlsdGVyKCkgaWYgQGZpcnN0VGltZUZpbHRlclxuICAgICMgICBAZmlyc3RUaW1lRmlsdGVyID0gdHJ1ZVxuXG4gICAgQHNjb3BlQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVTZWFyY2hTY29wZVxuICAgIEBvcHRpb25zQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVPcHRpb25zXG4gICAgQGV4cG9ydEJ1dHRvbi5vbiAnY2xpY2snLCBAZXhwb3J0XG4gICAgQHJlZnJlc2hCdXR0b24ub24gJ2NsaWNrJywgPT4gQHNlYXJjaCh0cnVlKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNvbGxlY3Rpb24uY2FuY2VsU2VhcmNoKClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGRldGFjaCgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGRlc2VyaWFsaXplcjogJ3RvZG8tc2hvdy90b2RvLXZpZXcnXG4gICAgc2NvcGU6IEBjb2xsZWN0aW9uLnNjb3BlXG4gICAgY3VzdG9tUGF0aDogQGNvbGxlY3Rpb24uZ2V0Q3VzdG9tUGF0aCgpXG5cbiAgZ2V0VGl0bGU6IC0+IFwiVG9kbyBTaG93XCJcbiAgZ2V0SWNvbk5hbWU6IC0+IFwiY2hlY2tsaXN0XCJcbiAgZ2V0VVJJOiAtPiBAdXJpXG4gIGdldERlZmF1bHRMb2NhdGlvbjogLT4gJ3JpZ2h0J1xuICBnZXRBbGxvd2VkTG9jYXRpb25zOiAtPiBbJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJ11cbiAgZ2V0UHJvamVjdE5hbWU6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3ROYW1lKClcbiAgZ2V0UHJvamVjdFBhdGg6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKVxuXG4gIGdldFRvZG9zOiAtPiBAY29sbGVjdGlvbi5nZXRUb2RvcygpXG4gIGdldFRvZG9zQ291bnQ6IC0+IEBjb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKVxuICBpc1NlYXJjaGluZzogLT4gQGNvbGxlY3Rpb24uZ2V0U3RhdGUoKVxuICBzZWFyY2g6IChmb3JjZSA9IGZhbHNlKSAtPlxuICAgIGlmIEBvbmx5U2VhcmNoV2hlblZpc2libGVcbiAgICAgIHJldHVybiB1bmxlc3MgYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcyk/LmlzVmlzaWJsZSgpXG4gICAgQGNvbGxlY3Rpb24uc2VhcmNoKGZvcmNlKVxuXG4gIHN0YXJ0TG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuc2hvdygpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHN0b3BMb2FkaW5nOiA9PlxuICAgIEB0b2RvTG9hZGluZy5oaWRlKClcbiAgICBAdXBkYXRlSW5mbygpXG5cbiAgdXBkYXRlSW5mbzogLT5cbiAgICBAdG9kb0luZm8uaHRtbChcIiN7QGdldEluZm9UZXh0KCl9ICN7QGdldFNjb3BlVGV4dCgpfVwiKVxuXG4gIGdldEluZm9UZXh0OiAtPlxuICAgIHJldHVybiBcIkZvdW5kIC4uLiByZXN1bHRzXCIgaWYgQGlzU2VhcmNoaW5nKClcbiAgICBzd2l0Y2ggY291bnQgPSBAZ2V0VG9kb3NDb3VudCgpXG4gICAgICB3aGVuIDEgdGhlbiBcIkZvdW5kICN7Y291bnR9IHJlc3VsdFwiXG4gICAgICBlbHNlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0c1wiXG5cbiAgZ2V0U2NvcGVUZXh0OiAtPlxuICAgICMgVE9ETzogQWxzbyBzaG93IG51bWJlciBvZiBmaWxlc1xuXG4gICAgc3dpdGNoIEBjb2xsZWN0aW9uLnNjb3BlXG4gICAgICB3aGVuICdhY3RpdmUnXG4gICAgICAgIFwiaW4gYWN0aXZlIGZpbGVcIlxuICAgICAgd2hlbiAnb3BlbidcbiAgICAgICAgXCJpbiBvcGVuIGZpbGVzXCJcbiAgICAgIHdoZW4gJ3Byb2plY3QnXG4gICAgICAgIFwiaW4gcHJvamVjdCA8Y29kZT4je0BnZXRQcm9qZWN0TmFtZSgpfTwvY29kZT5cIlxuICAgICAgd2hlbiAnY3VzdG9tJ1xuICAgICAgICBcImluIDxjb2RlPiN7QGNvbGxlY3Rpb24uY3VzdG9tUGF0aH08L2NvZGU+XCJcbiAgICAgIGVsc2VcbiAgICAgICAgXCJpbiB3b3Jrc3BhY2VcIlxuXG4gIHNob3dFcnJvcjogKG1lc3NhZ2UgPSAnJykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgbWVzc2FnZS50b1N0cmluZygpLCBAbm90aWZpY2F0aW9uT3B0aW9uc1xuXG4gIHNob3dXYXJuaW5nOiAobWVzc2FnZSA9ICcnKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIG1lc3NhZ2UudG9TdHJpbmcoKSwgQG5vdGlmaWNhdGlvbk9wdGlvbnNcblxuICBleHBvcnQ6ID0+XG4gICAgcmV0dXJuIGlmIEBpc1NlYXJjaGluZygpXG5cbiAgICBmaWxlUGF0aCA9IFwiI3tAZ2V0UHJvamVjdE5hbWUoKSBvciAndG9kb3MnfS5tZFwiXG4gICAgaWYgcHJvamVjdFBhdGggPSBAZ2V0UHJvamVjdFBhdGgoKVxuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuXG4gICAgIyBEbyBub3Qgb3ZlcnJpZGUgaWYgZGVmYXVsdCBmaWxlIHBhdGggYWxyZWFkeSBleGlzdHNcbiAgICBmaWxlUGF0aCA9IHVuZGVmaW5lZCBpZiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCkudGhlbiAodGV4dEVkaXRvcikgPT5cbiAgICAgIHRleHRFZGl0b3Iuc2V0VGV4dChAY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKVxuXG4gIHRvZ2dsZVNlYXJjaFNjb3BlOiA9PlxuICAgIHNjb3BlID0gQGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKVxuICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKHNjb3BlKVxuXG4gIHNldFNjb3BlQnV0dG9uU3RhdGU6IChzdGF0ZSkgPT5cbiAgICBzd2l0Y2ggc3RhdGVcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1Byb2plY3QnXG4gICAgICB3aGVuICdvcGVuJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdPcGVuIEZpbGVzJ1xuICAgICAgd2hlbiAnYWN0aXZlJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdBY3RpdmUgRmlsZSdcbiAgICAgIHdoZW4gJ2N1c3RvbScgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnQ3VzdG9tJ1xuICAgICAgZWxzZSBAc2NvcGVCdXR0b24udGV4dCAnV29ya3NwYWNlJ1xuXG4gIHRvZ2dsZU9wdGlvbnM6ID0+XG4gICAgdW5sZXNzIEB0b2RvT3B0aW9uc1xuICAgICAgQG9wdGlvbnNWaWV3LmhpZGUoKVxuICAgICAgQHRvZG9PcHRpb25zID0gbmV3IFRvZG9PcHRpb25zKEBjb2xsZWN0aW9uKVxuICAgICAgQG9wdGlvbnNWaWV3Lmh0bWwgQHRvZG9PcHRpb25zXG4gICAgQG9wdGlvbnNWaWV3LnNsaWRlVG9nZ2xlKClcblxuICBmaWx0ZXI6IC0+XG4gICAgQGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MgQGZpbHRlckJ1ZmZlci5nZXRUZXh0KClcblxuICBjaGVja0RlcHJlY2F0aW9uOiAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVJlZ2V4ZXMnKVxuICAgICAgQHNob3dXYXJuaW5nICcnJ1xuICAgICAgRGVwcmVjYXRpb24gV2FybmluZzpcXG5cbiAgICAgIGBmaW5kVGhlc2VSZWdleGVzYCBjb25maWcgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgZmluZFRoZXNlVG9kb3NgIGFuZCBgZmluZFVzaW5nUmVnZXhgIGZvciBjdXN0b20gYmVoYXZpb3VyLlxuICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tcm9kYWxnYWFyZC9hdG9tLXRvZG8tc2hvdyNjb25maWcgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAnJydcbiJdfQ==
