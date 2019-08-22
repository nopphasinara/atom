(function() {
  var CompositeDisposable, FindJson, FindPathListView;

  FindPathListView = require('./find-path-list-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = FindJson = {
    subscriptions: null,
    config: {
      maxDepth: {
        type: 'integer',
        "default": 6
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-path-finder:find': (function(_this) {
          return function() {
            return _this.show({
              isResultFlatten: false
            });
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'json-path-finder:find-flatten': (function(_this) {
          return function() {
            return _this.show({
              isResultFlatten: true
            });
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    show: function(arg) {
      var editor, error, findPathListView, isResultFlatten, object, text;
      isResultFlatten = (arg != null ? arg : {
        isResultFlatten: true
      }).isResultFlatten;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      text = editor.getText();
      try {
        object = JSON.parse(text);
      } catch (error1) {
        error = error1;
        return console.error(error);
      }
      return findPathListView = new FindPathListView(object, isResultFlatten);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9qc29uLXBhdGgtZmluZGVyL2xpYi9qc29uLXBhdGgtZmluZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHVCQUFSOztFQUNsQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FDZjtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBRUEsTUFBQSxFQUNFO01BQUEsUUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7T0FERjtLQUhGO0lBT0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSx1QkFBQSxFQUF5QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxlQUFBLEVBQWlCLEtBQWpCO2FBQU47VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7T0FBcEMsQ0FBbkI7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLGVBQUEsRUFBaUIsSUFBakI7YUFBTjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztPQUFwQyxDQUFuQjtJQU5RLENBUFY7SUFlQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FmWjtJQWtCQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osVUFBQTtNQURNLGlDQUFELE1BQW9CO1FBQUMsZUFBQSxFQUFpQixJQUFsQjs7TUFDekIsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQWMsY0FBZDtBQUFBLGVBQUE7O01BRUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7QUFFUDtRQUNFLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsRUFEWDtPQUFBLGNBQUE7UUFFTTtBQUNKLGVBQU8sT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLEVBSFQ7O2FBS0EsZ0JBQUEsR0FBbUIsSUFBSSxnQkFBSixDQUFxQixNQUFyQixFQUE2QixlQUE3QjtJQVhmLENBbEJOOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiRmluZFBhdGhMaXN0VmlldyA9IHJlcXVpcmUgJy4vZmluZC1wYXRoLWxpc3QtdmlldydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEpzb24gPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgY29uZmlnOlxuICAgIG1heERlcHRoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA2XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2pzb24tcGF0aC1maW5kZXI6ZmluZCc6ID0+IEBzaG93KGlzUmVzdWx0RmxhdHRlbjogZmFsc2UpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqc29uLXBhdGgtZmluZGVyOmZpbmQtZmxhdHRlbic6ID0+IEBzaG93KGlzUmVzdWx0RmxhdHRlbjogdHJ1ZSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHNob3c6ICh7aXNSZXN1bHRGbGF0dGVufSA9IHtpc1Jlc3VsdEZsYXR0ZW46IHRydWV9KS0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuXG4gICAgdHJ5XG4gICAgICBvYmplY3QgPSBKU09OLnBhcnNlKHRleHQpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gICAgZmluZFBhdGhMaXN0VmlldyA9IG5ldyBGaW5kUGF0aExpc3RWaWV3KG9iamVjdCwgaXNSZXN1bHRGbGF0dGVuKVxuIl19
