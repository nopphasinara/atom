(function() {
  var AbstractProvider, VariableProvider, fuzzaldrin, parser,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fuzzaldrin = require('fuzzaldrin');

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  module.exports = VariableProvider = (function(superClass) {
    extend(VariableProvider, superClass);

    function VariableProvider() {
      return VariableProvider.__super__.constructor.apply(this, arguments);
    }

    VariableProvider.prototype.variables = [];


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    VariableProvider.prototype.fetchSuggestions = function(arg) {
      var bufferPosition, editor, prefix, scopeDescriptor, suggestions;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.regex = /(\$[a-zA-Z_]*)/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      this.variables = parser.getAllVariablesInFunction(editor, bufferPosition);
      if (!this.variables.length) {
        return;
      }
      suggestions = this.findSuggestionsForPrefix(prefix.trim());
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };


    /**
     * Returns suggestions available matching the given prefix
     * @param {string} prefix Prefix to match
     * @return array
     */

    VariableProvider.prototype.findSuggestionsForPrefix = function(prefix) {
      var i, len, suggestions, word, words;
      words = fuzzaldrin.filter(this.variables, prefix);
      suggestions = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        suggestions.push({
          text: word,
          type: 'variable',
          replacementPrefix: prefix
        });
      }
      return suggestions;
    };

    return VariableProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL3ZhcmlhYmxlLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0RBQUE7SUFBQTs7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUViLE1BQUEsR0FBUyxPQUFBLENBQVEsb0NBQVI7O0VBQ1QsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUdNOzs7Ozs7OytCQUNGLFNBQUEsR0FBVzs7O0FBRVg7Ozs7OytCQUlBLGdCQUFBLEdBQWtCLFNBQUMsR0FBRDtBQUVkLFVBQUE7TUFGZ0IscUJBQVEscUNBQWdCLHVDQUFpQjtNQUV6RCxJQUFDLENBQUEsS0FBRCxHQUFTO01BRVQsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxFQUFtQixjQUFuQjtNQUNULElBQUEsQ0FBYyxNQUFNLENBQUMsTUFBckI7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLE1BQWpDLEVBQXlDLGNBQXpDO01BQ2IsSUFBQSxDQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBekI7QUFBQSxlQUFBOztNQUVBLFdBQUEsR0FBYyxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUExQjtNQUNkLElBQUEsQ0FBYyxXQUFXLENBQUMsTUFBMUI7QUFBQSxlQUFBOztBQUNBLGFBQU87SUFaTzs7O0FBY2xCOzs7Ozs7K0JBS0Esd0JBQUEsR0FBMEIsU0FBQyxNQUFEO0FBRXRCLFVBQUE7TUFBQSxLQUFBLEdBQVEsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsSUFBQyxDQUFBLFNBQW5CLEVBQThCLE1BQTlCO01BR1IsV0FBQSxHQUFjO0FBQ2QsV0FBQSx1Q0FBQTs7UUFDSSxXQUFXLENBQUMsSUFBWixDQUNJO1VBQUEsSUFBQSxFQUFNLElBQU47VUFDQSxJQUFBLEVBQU0sVUFETjtVQUVBLGlCQUFBLEVBQW1CLE1BRm5CO1NBREo7QUFESjtBQU1BLGFBQU87SUFaZTs7OztLQTFCQztBQVIvQiIsInNvdXJjZXNDb250ZW50IjpbImZ1enphbGRyaW4gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xuXG5wYXJzZXIgPSByZXF1aXJlIFwiLi4vc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyLmNvZmZlZVwiXG5BYnN0cmFjdFByb3ZpZGVyID0gcmVxdWlyZSBcIi4vYWJzdHJhY3QtcHJvdmlkZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiMgQXV0b2NvbXBsZXRlIGZvciBsb2NhbCB2YXJpYWJsZSBuYW1lcy5cbmNsYXNzIFZhcmlhYmxlUHJvdmlkZXIgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgdmFyaWFibGVzOiBbXVxuXG4gICAgIyMjKlxuICAgICAqIEdldCBzdWdnZXN0aW9ucyBmcm9tIHRoZSBwcm92aWRlciAoQHNlZSBwcm92aWRlci1hcGkpXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICMjI1xuICAgIGZldGNoU3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSAtPlxuICAgICAgICAjIFwibmV3XCIga2V5d29yZCBvciB3b3JkIHN0YXJ0aW5nIHdpdGggY2FwaXRhbCBsZXR0ZXJcbiAgICAgICAgQHJlZ2V4ID0gLyhcXCRbYS16QS1aX10qKS9nXG5cbiAgICAgICAgcHJlZml4ID0gQGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHByZWZpeC5sZW5ndGhcblxuICAgICAgICBAdmFyaWFibGVzID0gcGFyc2VyLmdldEFsbFZhcmlhYmxlc0luRnVuY3Rpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgcmV0dXJuIHVubGVzcyBAdmFyaWFibGVzLmxlbmd0aFxuXG4gICAgICAgIHN1Z2dlc3Rpb25zID0gQGZpbmRTdWdnZXN0aW9uc0ZvclByZWZpeChwcmVmaXgudHJpbSgpKVxuICAgICAgICByZXR1cm4gdW5sZXNzIHN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgICMjIypcbiAgICAgKiBSZXR1cm5zIHN1Z2dlc3Rpb25zIGF2YWlsYWJsZSBtYXRjaGluZyB0aGUgZ2l2ZW4gcHJlZml4XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCBQcmVmaXggdG8gbWF0Y2hcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgIyMjXG4gICAgZmluZFN1Z2dlc3Rpb25zRm9yUHJlZml4OiAocHJlZml4KSAtPlxuICAgICAgICAjIEZpbHRlciB0aGUgd29yZHMgdXNpbmcgZnV6emFsZHJpblxuICAgICAgICB3b3JkcyA9IGZ1enphbGRyaW4uZmlsdGVyIEB2YXJpYWJsZXMsIHByZWZpeFxuXG4gICAgICAgICMgQnVpbGRzIHN1Z2dlc3Rpb25zIGZvciB0aGUgd29yZHNcbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgICAgICBmb3Igd29yZCBpbiB3b3Jkc1xuICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgICAgICAgIHRleHQ6IHdvcmQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4XG5cbiAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4iXX0=
