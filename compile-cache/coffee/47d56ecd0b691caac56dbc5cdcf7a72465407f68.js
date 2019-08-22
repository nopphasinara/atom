(function() {
  var AutocompletionManager, ClassProvider, ConstantProvider, FunctionProvider, MemberProvider, VariableProvider;

  ClassProvider = require('./class-provider.coffee');

  MemberProvider = require('./member-provider.coffee');

  ConstantProvider = require('./constant-provider.coffee');

  VariableProvider = require('./variable-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  module.exports = AutocompletionManager = (function() {
    function AutocompletionManager() {}

    AutocompletionManager.prototype.providers = [];


    /**
     * Initializes the autocompletion providers.
     */

    AutocompletionManager.prototype.init = function() {
      var i, len, provider, ref, results;
      this.providers.push(new ConstantProvider());
      this.providers.push(new VariableProvider());
      this.providers.push(new FunctionProvider());
      this.providers.push(new ClassProvider());
      this.providers.push(new MemberProvider());
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.init(this));
      }
      return results;
    };


    /**
     * Deactivates the autocompletion providers.
     */

    AutocompletionManager.prototype.deactivate = function() {
      var i, len, provider, ref, results;
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.deactivate());
      }
      return results;
    };


    /**
     * Deactivates the autocompletion providers.
     */

    AutocompletionManager.prototype.getProviders = function() {
      return this.providers;
    };

    return AutocompletionManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL2F1dG9jb21wbGV0aW9uLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDaEIsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVI7O0VBQ2pCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUjs7RUFDbkIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSOztFQUNuQixnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBRU07OztvQ0FDRixTQUFBLEdBQVc7OztBQUVYOzs7O29DQUdBLElBQUEsR0FBTSxTQUFBO0FBQ0YsVUFBQTtNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFJLGdCQUFKLENBQUEsQ0FBaEI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxnQkFBSixDQUFBLENBQWhCO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUksZ0JBQUosQ0FBQSxDQUFoQjtNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFJLGFBQUosQ0FBQSxDQUFoQjtNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFJLGNBQUosQ0FBQSxDQUFoQjtBQUVBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkO0FBREo7O0lBUEU7OztBQVVOOzs7O29DQUdBLFVBQUEsR0FBWSxTQUFBO0FBQ1IsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLFVBQVQsQ0FBQTtBQURKOztJQURROzs7QUFJWjs7OztvQ0FHQSxZQUFBLEdBQWMsU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOzs7OztBQWxDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJDbGFzc1Byb3ZpZGVyID0gcmVxdWlyZSAnLi9jbGFzcy1wcm92aWRlci5jb2ZmZWUnXG5NZW1iZXJQcm92aWRlciA9IHJlcXVpcmUgJy4vbWVtYmVyLXByb3ZpZGVyLmNvZmZlZSdcbkNvbnN0YW50UHJvdmlkZXIgPSByZXF1aXJlICcuL2NvbnN0YW50LXByb3ZpZGVyLmNvZmZlZSdcblZhcmlhYmxlUHJvdmlkZXIgPSByZXF1aXJlICcuL3ZhcmlhYmxlLXByb3ZpZGVyLmNvZmZlZSdcbkZ1bmN0aW9uUHJvdmlkZXIgPSByZXF1aXJlICcuL2Z1bmN0aW9uLXByb3ZpZGVyLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG5jbGFzcyBBdXRvY29tcGxldGlvbk1hbmFnZXJcbiAgICBwcm92aWRlcnM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGF1dG9jb21wbGV0aW9uIHByb3ZpZGVycy5cbiAgICAjIyNcbiAgICBpbml0OiAoKSAtPlxuICAgICAgICBAcHJvdmlkZXJzLnB1c2ggbmV3IENvbnN0YW50UHJvdmlkZXIoKVxuICAgICAgICBAcHJvdmlkZXJzLnB1c2ggbmV3IFZhcmlhYmxlUHJvdmlkZXIoKVxuICAgICAgICBAcHJvdmlkZXJzLnB1c2ggbmV3IEZ1bmN0aW9uUHJvdmlkZXIoKVxuICAgICAgICBAcHJvdmlkZXJzLnB1c2ggbmV3IENsYXNzUHJvdmlkZXIoKVxuICAgICAgICBAcHJvdmlkZXJzLnB1c2ggbmV3IE1lbWJlclByb3ZpZGVyKClcblxuICAgICAgICBmb3IgcHJvdmlkZXIgaW4gQHByb3ZpZGVyc1xuICAgICAgICAgICAgcHJvdmlkZXIuaW5pdChAKVxuXG4gICAgIyMjKlxuICAgICAqIERlYWN0aXZhdGVzIHRoZSBhdXRvY29tcGxldGlvbiBwcm92aWRlcnMuXG4gICAgIyMjXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmRlYWN0aXZhdGUoKVxuXG4gICAgIyMjKlxuICAgICAqIERlYWN0aXZhdGVzIHRoZSBhdXRvY29tcGxldGlvbiBwcm92aWRlcnMuXG4gICAgIyMjXG4gICAgZ2V0UHJvdmlkZXJzOiAoKSAtPlxuICAgICAgICBAcHJvdmlkZXJzXG4iXX0=
