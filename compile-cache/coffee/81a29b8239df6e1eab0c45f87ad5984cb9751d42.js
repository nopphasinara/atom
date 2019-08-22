(function() {
  var AnnotationManager, MethodProvider, PropertyProvider;

  MethodProvider = require('./method-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  module.exports = AnnotationManager = (function() {
    function AnnotationManager() {}

    AnnotationManager.prototype.providers = [];


    /**
     * Initializes the tooltip providers.
     */

    AnnotationManager.prototype.init = function() {
      var i, len, provider, ref, results;
      this.providers.push(new MethodProvider());
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

    AnnotationManager.prototype.deactivate = function() {
      var i, len, provider, ref, results;
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.deactivate());
      }
      return results;
    };

    return AnnotationManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2Fubm90YXRpb24vYW5ub3RhdGlvbi1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVI7O0VBQ2pCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7O2dDQUNGLFNBQUEsR0FBVzs7O0FBRVg7Ozs7Z0NBR0EsSUFBQSxHQUFNLFNBQUE7QUFDRixVQUFBO01BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUksY0FBSixDQUFBLENBQWhCO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUksZ0JBQUosQ0FBQSxDQUFoQjtBQUVBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkO0FBREo7O0lBSkU7OztBQU9OOzs7O2dDQUdBLFVBQUEsR0FBWSxTQUFBO0FBQ1IsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0ksUUFBUSxDQUFDLFVBQVQsQ0FBQTtBQURKOztJQURROzs7OztBQXJCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJNZXRob2RQcm92aWRlciA9IHJlcXVpcmUgJy4vbWV0aG9kLXByb3ZpZGVyLmNvZmZlZSdcblByb3BlcnR5UHJvdmlkZXIgPSByZXF1aXJlICcuL3Byb3BlcnR5LXByb3ZpZGVyLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG5jbGFzcyBBbm5vdGF0aW9uTWFuYWdlclxuICAgIHByb3ZpZGVyczogW11cblxuICAgICMjIypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgdG9vbHRpcCBwcm92aWRlcnMuXG4gICAgIyMjXG4gICAgaW5pdDogKCkgLT5cbiAgICAgICAgQHByb3ZpZGVycy5wdXNoIG5ldyBNZXRob2RQcm92aWRlcigpXG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgUHJvcGVydHlQcm92aWRlcigpXG5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmluaXQoQClcblxuICAgICMjIypcbiAgICAgKiBEZWFjdGl2YXRlcyB0aGUgdG9vbHRpcCBwcm92aWRlcnMuXG4gICAgIyMjXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmRlYWN0aXZhdGUoKVxuIl19
