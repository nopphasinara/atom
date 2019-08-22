(function() {
  var AutocompleteView, CompositeDisposable, Disposable, _, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  _ = require('underscore-plus');

  AutocompleteView = require('./autocomplete-view');

  module.exports = {
    config: {
      includeCompletionsFromAllBuffers: {
        type: 'boolean',
        "default": false
      }
    },
    autocompleteViewsByEditor: null,
    deactivationDisposables: null,
    activate: function() {
      var getAutocompleteView;
      this.autocompleteViewsByEditor = new WeakMap;
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var autocompleteView, disposable;
          if (editor.mini) {
            return;
          }
          autocompleteView = new AutocompleteView(editor);
          _this.autocompleteViewsByEditor.set(editor, autocompleteView);
          disposable = new Disposable(function() {
            return autocompleteView.destroy();
          });
          _this.deactivationDisposables.add(editor.onDidDestroy(function() {
            return disposable.dispose();
          }));
          return _this.deactivationDisposables.add(disposable);
        };
      })(this)));
      getAutocompleteView = (function(_this) {
        return function(editorElement) {
          return _this.autocompleteViewsByEditor.get(editorElement.getModel());
        };
      })(this);
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete:toggle': function() {
          var ref1;
          return (ref1 = getAutocompleteView(this)) != null ? ref1.toggle() : void 0;
        },
        'autocomplete:next': function() {
          var ref1;
          return (ref1 = getAutocompleteView(this)) != null ? ref1.selectNextItemView() : void 0;
        },
        'autocomplete:previous': function() {
          var ref1;
          return (ref1 = getAutocompleteView(this)) != null ? ref1.selectPreviousItemView() : void 0;
        }
      }));
    },
    deactivate: function() {
      return this.deactivationDisposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUvbGliL2F1dG9jb21wbGV0ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsZ0NBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BREY7S0FERjtJQUtBLHlCQUFBLEVBQTJCLElBTDNCO0lBTUEsdUJBQUEsRUFBeUIsSUFOekI7SUFRQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEseUJBQUQsR0FBNkIsSUFBSTtNQUNqQyxJQUFDLENBQUEsdUJBQUQsR0FBMkIsSUFBSTtNQUUvQixJQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtBQUM3RCxjQUFBO1VBQUEsSUFBVSxNQUFNLENBQUMsSUFBakI7QUFBQSxtQkFBQTs7VUFFQSxnQkFBQSxHQUFtQixJQUFJLGdCQUFKLENBQXFCLE1BQXJCO1VBQ25CLEtBQUMsQ0FBQSx5QkFBeUIsQ0FBQyxHQUEzQixDQUErQixNQUEvQixFQUF1QyxnQkFBdkM7VUFFQSxVQUFBLEdBQWEsSUFBSSxVQUFKLENBQWUsU0FBQTttQkFBRyxnQkFBZ0IsQ0FBQyxPQUFqQixDQUFBO1VBQUgsQ0FBZjtVQUNiLEtBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxHQUF6QixDQUE2QixNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO21CQUFHLFVBQVUsQ0FBQyxPQUFYLENBQUE7VUFBSCxDQUFwQixDQUE3QjtpQkFDQSxLQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsVUFBN0I7UUFSNkQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQTdCO01BVUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLGFBQUQ7aUJBQ3BCLEtBQUMsQ0FBQSx5QkFBeUIsQ0FBQyxHQUEzQixDQUErQixhQUFhLENBQUMsUUFBZCxDQUFBLENBQS9CO1FBRG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUd0QixJQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUMzQjtRQUFBLHFCQUFBLEVBQXVCLFNBQUE7QUFDckIsY0FBQTtrRUFBeUIsQ0FBRSxNQUEzQixDQUFBO1FBRHFCLENBQXZCO1FBRUEsbUJBQUEsRUFBcUIsU0FBQTtBQUNuQixjQUFBO2tFQUF5QixDQUFFLGtCQUEzQixDQUFBO1FBRG1CLENBRnJCO1FBSUEsdUJBQUEsRUFBeUIsU0FBQTtBQUN2QixjQUFBO2tFQUF5QixDQUFFLHNCQUEzQixDQUFBO1FBRHVCLENBSnpCO09BRDJCLENBQTdCO0lBakJRLENBUlY7SUFpQ0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQTtJQURVLENBakNaOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5BdXRvY29tcGxldGVWaWV3ID0gcmVxdWlyZSAnLi9hdXRvY29tcGxldGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgaW5jbHVkZUNvbXBsZXRpb25zRnJvbUFsbEJ1ZmZlcnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG5cbiAgYXV0b2NvbXBsZXRlVmlld3NCeUVkaXRvcjogbnVsbFxuICBkZWFjdGl2YXRpb25EaXNwb3NhYmxlczogbnVsbFxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBhdXRvY29tcGxldGVWaWV3c0J5RWRpdG9yID0gbmV3IFdlYWtNYXBcbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIHJldHVybiBpZiBlZGl0b3IubWluaVxuXG4gICAgICBhdXRvY29tcGxldGVWaWV3ID0gbmV3IEF1dG9jb21wbGV0ZVZpZXcoZWRpdG9yKVxuICAgICAgQGF1dG9jb21wbGV0ZVZpZXdzQnlFZGl0b3Iuc2V0KGVkaXRvciwgYXV0b2NvbXBsZXRlVmlldylcblxuICAgICAgZGlzcG9zYWJsZSA9IG5ldyBEaXNwb3NhYmxlID0+IGF1dG9jb21wbGV0ZVZpZXcuZGVzdHJveSgpXG4gICAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgPT4gZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuXG4gICAgZ2V0QXV0b2NvbXBsZXRlVmlldyA9IChlZGl0b3JFbGVtZW50KSA9PlxuICAgICAgQGF1dG9jb21wbGV0ZVZpZXdzQnlFZGl0b3IuZ2V0KGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKSlcblxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ2F1dG9jb21wbGV0ZTp0b2dnbGUnOiAtPlxuICAgICAgICBnZXRBdXRvY29tcGxldGVWaWV3KHRoaXMpPy50b2dnbGUoKVxuICAgICAgJ2F1dG9jb21wbGV0ZTpuZXh0JzogLT5cbiAgICAgICAgZ2V0QXV0b2NvbXBsZXRlVmlldyh0aGlzKT8uc2VsZWN0TmV4dEl0ZW1WaWV3KClcbiAgICAgICdhdXRvY29tcGxldGU6cHJldmlvdXMnOiAtPlxuICAgICAgICBnZXRBdXRvY29tcGxldGVWaWV3KHRoaXMpPy5zZWxlY3RQcmV2aW91c0l0ZW1WaWV3KClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5kaXNwb3NlKClcbiJdfQ==
