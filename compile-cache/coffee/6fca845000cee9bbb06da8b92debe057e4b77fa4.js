(function() {
  var ProviderMetadata, Selector, ref, selectorForScopeChain, selectorsMatchScopeChain, specificity;

  specificity = require('clear-cut').specificity;

  Selector = require('selector-kit').Selector;

  ref = require('./scope-helpers'), selectorForScopeChain = ref.selectorForScopeChain, selectorsMatchScopeChain = ref.selectorsMatchScopeChain;

  module.exports = ProviderMetadata = (function() {
    function ProviderMetadata(provider) {
      this.provider = provider;
      this.selectors = Selector.create(this.provider.selector);
      if (this.provider.disableForSelector != null) {
        this.disableForSelectors = Selector.create(this.provider.disableForSelector);
      }
    }

    ProviderMetadata.prototype.matchesScopeChain = function(scopeChain) {
      if (this.disableForSelectors != null) {
        if (selectorsMatchScopeChain(this.disableForSelectors, scopeChain)) {
          return false;
        }
      }
      if (selectorsMatchScopeChain(this.selectors, scopeChain)) {
        return true;
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.getSpecificity = function(scopeChain) {
      var selector;
      if (selector = selectorForScopeChain(this.selectors, scopeChain)) {
        return selector.getSpecificity();
      } else {
        return 0;
      }
    };

    ProviderMetadata.prototype.dispose = function() {};

    return ProviderMetadata;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mb3JtYXR0ZXIvbGliL3Byb3ZpZGVyLW1ldGFkYXRhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBLE1BQUE7O0VBQUMsY0FBZSxPQUFBLENBQVEsV0FBUjs7RUFDZixXQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNiLE1BQW9ELE9BQUEsQ0FBUSxpQkFBUixDQUFwRCxFQUFDLGlEQUFELEVBQXdCOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsMEJBQUMsUUFBRDtNQUFDLElBQUMsQ0FBQSxXQUFEO01BQ1osSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsUUFBUSxDQUFDLFFBQTFCO01BQ2IsSUFBd0Usd0NBQXhFO1FBQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQTFCLEVBQXZCOztJQUZXOzsrQkFJYixpQkFBQSxHQUFtQixTQUFDLFVBQUQ7TUFDakIsSUFBRyxnQ0FBSDtRQUNFLElBQWdCLHdCQUFBLENBQXlCLElBQUMsQ0FBQSxtQkFBMUIsRUFBK0MsVUFBL0MsQ0FBaEI7QUFBQSxpQkFBTyxNQUFQO1NBREY7O01BR0EsSUFBRyx3QkFBQSxDQUF5QixJQUFDLENBQUEsU0FBMUIsRUFBcUMsVUFBckMsQ0FBSDtlQUNFLEtBREY7T0FBQSxNQUFBO2VBR0UsTUFIRjs7SUFKaUI7OytCQVNuQixjQUFBLEdBQWdCLFNBQUMsVUFBRDtBQUNkLFVBQUE7TUFBQSxJQUFHLFFBQUEsR0FBVyxxQkFBQSxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsVUFBbEMsQ0FBZDtlQUNFLFFBQVEsQ0FBQyxjQUFULENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxFQUhGOztJQURjOzsrQkFNaEIsT0FBQSxHQUFTLFNBQUEsR0FBQTs7Ozs7QUF6QlgiLCJzb3VyY2VzQ29udGVudCI6WyIjIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tLWNvbW11bml0eS9hdXRvY29tcGxldGUtcGx1cy9ibG9iL21hc3Rlci9saWIvcHJvdmlkZXItbWV0YWRhdGEuY29mZmVlXG5cbntzcGVjaWZpY2l0eX0gPSByZXF1aXJlICdjbGVhci1jdXQnXG57U2VsZWN0b3J9ID0gcmVxdWlyZSAnc2VsZWN0b3Ita2l0J1xue3NlbGVjdG9yRm9yU2NvcGVDaGFpbiwgc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWlufSA9IHJlcXVpcmUgJy4vc2NvcGUtaGVscGVycydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUHJvdmlkZXJNZXRhZGF0YVxuICBjb25zdHJ1Y3RvcjogKEBwcm92aWRlcikgLT5cbiAgICBAc2VsZWN0b3JzID0gU2VsZWN0b3IuY3JlYXRlKEBwcm92aWRlci5zZWxlY3RvcilcbiAgICBAZGlzYWJsZUZvclNlbGVjdG9ycyA9IFNlbGVjdG9yLmNyZWF0ZShAcHJvdmlkZXIuZGlzYWJsZUZvclNlbGVjdG9yKSBpZiBAcHJvdmlkZXIuZGlzYWJsZUZvclNlbGVjdG9yP1xuXG4gIG1hdGNoZXNTY29wZUNoYWluOiAoc2NvcGVDaGFpbikgLT5cbiAgICBpZiBAZGlzYWJsZUZvclNlbGVjdG9ycz9cbiAgICAgIHJldHVybiBmYWxzZSBpZiBzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW4oQGRpc2FibGVGb3JTZWxlY3RvcnMsIHNjb3BlQ2hhaW4pXG5cbiAgICBpZiBzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW4oQHNlbGVjdG9ycywgc2NvcGVDaGFpbilcbiAgICAgIHRydWVcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG4gIGdldFNwZWNpZmljaXR5OiAoc2NvcGVDaGFpbikgLT5cbiAgICBpZiBzZWxlY3RvciA9IHNlbGVjdG9yRm9yU2NvcGVDaGFpbihAc2VsZWN0b3JzLCBzY29wZUNoYWluKVxuICAgICAgc2VsZWN0b3IuZ2V0U3BlY2lmaWNpdHkoKVxuICAgIGVsc2VcbiAgICAgIDBcblxuICBkaXNwb3NlOiAtPlxuIl19
