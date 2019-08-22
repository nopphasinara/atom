(function() {
  var ClassProvider, FunctionProvider, PropertyProvider, TooltipManager;

  ClassProvider = require('./class-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  module.exports = TooltipManager = (function() {
    function TooltipManager() {}

    TooltipManager.prototype.providers = [];


    /**
     * Initializes the tooltip providers.
     */

    TooltipManager.prototype.init = function() {
      var i, len, provider, ref, results;
      this.providers.push(new ClassProvider());
      this.providers.push(new FunctionProvider());
      this.providers.push(new PropertyProvider());
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.init(this));
      }
      return results;
    };


    /**
     * Deactivates the tooltip providers.
     */

    TooltipManager.prototype.deactivate = function() {
      var i, len, provider, ref, results;
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.deactivate());
      }
      return results;
    };

    return TooltipManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3Rvb2x0aXAvdG9vbHRpcC1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEseUJBQVI7O0VBQ2hCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUjs7RUFDbkIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUVNOzs7NkJBQ0YsU0FBQSxHQUFXOzs7QUFFWDs7Ozs2QkFHQSxJQUFBLEdBQU0sU0FBQTtBQUNGLFVBQUE7TUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxhQUFKLENBQUEsQ0FBaEI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxnQkFBSixDQUFBLENBQWhCO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUksZ0JBQUosQ0FBQSxDQUFoQjtBQUVBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkO0FBREo7O0lBTEU7OztBQVFOOzs7OzZCQUdBLFVBQUEsR0FBWSxTQUFBO0FBQ1IsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLFVBQVQsQ0FBQTtBQURKOztJQURROzs7OztBQXZCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJDbGFzc1Byb3ZpZGVyID0gcmVxdWlyZSAnLi9jbGFzcy1wcm92aWRlci5jb2ZmZWUnXG5GdW5jdGlvblByb3ZpZGVyID0gcmVxdWlyZSAnLi9mdW5jdGlvbi1wcm92aWRlci5jb2ZmZWUnXG5Qcm9wZXJ0eVByb3ZpZGVyID0gcmVxdWlyZSAnLi9wcm9wZXJ0eS1wcm92aWRlci5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgVG9vbHRpcE1hbmFnZXJcbiAgICBwcm92aWRlcnM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIHRvb2x0aXAgcHJvdmlkZXJzLlxuICAgICMjI1xuICAgIGluaXQ6ICgpIC0+XG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgQ2xhc3NQcm92aWRlcigpXG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgRnVuY3Rpb25Qcm92aWRlcigpXG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgUHJvcGVydHlQcm92aWRlcigpXG5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmluaXQoQClcblxuICAgICMjIypcbiAgICAgKiBEZWFjdGl2YXRlcyB0aGUgdG9vbHRpcCBwcm92aWRlcnMuXG4gICAgIyMjXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmRlYWN0aXZhdGUoKVxuIl19
