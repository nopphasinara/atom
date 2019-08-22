(function() {
  var EscapeCharacterRegex, parseScopeChain, selectorForScopeChain, selectorsMatchScopeChain, slick;

  slick = require('atom-slick');

  EscapeCharacterRegex = /[-!"#$%&'*+,\/:;=?@|^~()<>{}[\]]/g;

  parseScopeChain = function(scopeChain) {
    var i, len, ref, ref1, results, scope;
    scopeChain = scopeChain.replace(EscapeCharacterRegex, function(match) {
      return "\\" + match[0];
    });
    ref1 = (ref = slick.parse(scopeChain)[0]) != null ? ref : [];
    results = [];
    for (i = 0, len = ref1.length; i < len; i++) {
      scope = ref1[i];
      results.push(scope);
    }
    return results;
  };

  selectorForScopeChain = function(selectors, scopeChain) {
    var i, len, scopes, selector;
    for (i = 0, len = selectors.length; i < len; i++) {
      selector = selectors[i];
      scopes = parseScopeChain(scopeChain);
      while (scopes.length > 0) {
        if (selector.matches(scopes)) {
          return selector;
        }
        scopes.pop();
      }
    }
    return null;
  };

  selectorsMatchScopeChain = function(selectors, scopeChain) {
    return selectorForScopeChain(selectors, scopeChain) != null;
  };

  module.exports = {
    parseScopeChain: parseScopeChain,
    selectorsMatchScopeChain: selectorsMatchScopeChain,
    selectorForScopeChain: selectorForScopeChain
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mb3JtYXR0ZXIvbGliL3Njb3BlLWhlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFlBQVI7O0VBRVIsb0JBQUEsR0FBdUI7O0VBRXZCLGVBQUEsR0FBa0IsU0FBQyxVQUFEO0FBQ2hCLFFBQUE7SUFBQSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsb0JBQW5CLEVBQXlDLFNBQUMsS0FBRDthQUFXLElBQUEsR0FBSyxLQUFNLENBQUEsQ0FBQTtJQUF0QixDQUF6QztBQUNiO0FBQUE7U0FBQSxzQ0FBQTs7bUJBQUE7QUFBQTs7RUFGZ0I7O0VBSWxCLHFCQUFBLEdBQXdCLFNBQUMsU0FBRCxFQUFZLFVBQVo7QUFDdEIsUUFBQTtBQUFBLFNBQUEsMkNBQUE7O01BQ0UsTUFBQSxHQUFTLGVBQUEsQ0FBZ0IsVUFBaEI7QUFDVCxhQUFNLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQXRCO1FBQ0UsSUFBbUIsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsTUFBakIsQ0FBbkI7QUFBQSxpQkFBTyxTQUFQOztRQUNBLE1BQU0sQ0FBQyxHQUFQLENBQUE7TUFGRjtBQUZGO1dBS0E7RUFOc0I7O0VBUXhCLHdCQUFBLEdBQTJCLFNBQUMsU0FBRCxFQUFZLFVBQVo7V0FDekI7RUFEeUI7O0VBRzNCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsaUJBQUEsZUFBRDtJQUFrQiwwQkFBQSx3QkFBbEI7SUFBNEMsdUJBQUEscUJBQTVDOztBQW5CakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tLWNvbW11bml0eS9hdXRvY29tcGxldGUtcGx1cy9ibG9iL21hc3Rlci9saWIvc2NvcGUtaGVscGVycy5jb2ZmZWVcblxuc2xpY2sgPSByZXF1aXJlICdhdG9tLXNsaWNrJ1xuXG5Fc2NhcGVDaGFyYWN0ZXJSZWdleCA9IC9bLSFcIiMkJSYnKissLzo7PT9AfF5+KCk8Pnt9W1xcXV0vZ1xuXG5wYXJzZVNjb3BlQ2hhaW4gPSAoc2NvcGVDaGFpbikgLT5cbiAgc2NvcGVDaGFpbiA9IHNjb3BlQ2hhaW4ucmVwbGFjZSBFc2NhcGVDaGFyYWN0ZXJSZWdleCwgKG1hdGNoKSAtPiBcIlxcXFwje21hdGNoWzBdfVwiXG4gIHNjb3BlIGZvciBzY29wZSBpbiBzbGljay5wYXJzZShzY29wZUNoYWluKVswXSA/IFtdXG5cbnNlbGVjdG9yRm9yU2NvcGVDaGFpbiA9IChzZWxlY3RvcnMsIHNjb3BlQ2hhaW4pIC0+XG4gIGZvciBzZWxlY3RvciBpbiBzZWxlY3RvcnNcbiAgICBzY29wZXMgPSBwYXJzZVNjb3BlQ2hhaW4oc2NvcGVDaGFpbilcbiAgICB3aGlsZSBzY29wZXMubGVuZ3RoID4gMFxuICAgICAgcmV0dXJuIHNlbGVjdG9yIGlmIHNlbGVjdG9yLm1hdGNoZXMoc2NvcGVzKVxuICAgICAgc2NvcGVzLnBvcCgpXG4gIG51bGxcblxuc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluID0gKHNlbGVjdG9ycywgc2NvcGVDaGFpbikgLT5cbiAgc2VsZWN0b3JGb3JTY29wZUNoYWluKHNlbGVjdG9ycywgc2NvcGVDaGFpbik/XG5cbm1vZHVsZS5leHBvcnRzID0ge3BhcnNlU2NvcGVDaGFpbiwgc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluLCBzZWxlY3RvckZvclNjb3BlQ2hhaW59XG4iXX0=
