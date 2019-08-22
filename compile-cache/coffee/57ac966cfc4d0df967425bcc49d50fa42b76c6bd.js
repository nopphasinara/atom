(function() {
  var CompositeDisposable, LessAutocompile, LessAutocompileView;

  LessAutocompileView = require('./less-autocompile-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = LessAutocompile = {
    lessAutocompileView: null,
    activate: function(state) {
      return this.lessAutocompileView = new LessAutocompileView(state.lessAutocompileViewState);
    },
    deactivate: function() {
      return this.lessAutocompileView.destroy();
    },
    serialize: function() {
      return {
        lessAutocompileViewState: this.lessAutocompileView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sZXNzLWF1dG9jb21waWxlL2xpYi9sZXNzLWF1dG9jb21waWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsbUJBQUEsR0FBd0IsT0FBQSxDQUFRLHlCQUFSOztFQUN2QixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQUEsR0FDZjtJQUFBLG1CQUFBLEVBQXFCLElBQXJCO0lBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLG1CQUFKLENBQXdCLEtBQUssQ0FBQyx3QkFBOUI7SUFEZixDQUZWO0lBS0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBQTtJQURVLENBTFo7SUFRQSxTQUFBLEVBQVcsU0FBQTthQUNUO1FBQUEsd0JBQUEsRUFBMEIsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQXJCLENBQUEsQ0FBMUI7O0lBRFMsQ0FSWDs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIkxlc3NBdXRvY29tcGlsZVZpZXcgICA9IHJlcXVpcmUgJy4vbGVzcy1hdXRvY29tcGlsZS12aWV3J1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBMZXNzQXV0b2NvbXBpbGUgPVxuICBsZXNzQXV0b2NvbXBpbGVWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAbGVzc0F1dG9jb21waWxlVmlldyA9IG5ldyBMZXNzQXV0b2NvbXBpbGVWaWV3KHN0YXRlLmxlc3NBdXRvY29tcGlsZVZpZXdTdGF0ZSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBsZXNzQXV0b2NvbXBpbGVWaWV3LmRlc3Ryb3koKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBsZXNzQXV0b2NvbXBpbGVWaWV3U3RhdGU6IEBsZXNzQXV0b2NvbXBpbGVWaWV3LnNlcmlhbGl6ZSgpXG4iXX0=
