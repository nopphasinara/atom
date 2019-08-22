(function() {
  var AbstractProvider, FunctionProvider, config, fuzzaldrin, parser, proxy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fuzzaldrin = require('fuzzaldrin');

  proxy = require("../services/php-proxy.coffee");

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  config = require("../config.coffee");

  module.exports = FunctionProvider = (function(superClass) {
    extend(FunctionProvider, superClass);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.functions = [];


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    FunctionProvider.prototype.fetchSuggestions = function(arg) {
      var bufferPosition, characterAfterPrefix, editor, insertParameterList, prefix, ref, scopeDescriptor, suggestions;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.regex = /(?:(?:^|[^\w\$_\>]))([a-zA-Z_]+)(?![\w\$_\>])/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      this.functions = proxy.functions();
      if (((ref = this.functions) != null ? ref.names : void 0) == null) {
        return;
      }
      characterAfterPrefix = editor.getTextInRange([bufferPosition, [bufferPosition.row, bufferPosition.column + 1]]);
      insertParameterList = characterAfterPrefix === '(' ? false : true;
      suggestions = this.findSuggestionsForPrefix(prefix.trim(), insertParameterList);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };


    /**
     * Returns suggestions available matching the given prefix.
     *
     * @param {string} prefix              Prefix to match.
     * @param {bool}   insertParameterList Whether to insert a list of parameters.
     *
     * @return {Array}
     */

    FunctionProvider.prototype.findSuggestionsForPrefix = function(prefix, insertParameterList) {
      var element, i, j, len, len1, ref, ref1, returnValue, returnValueParts, suggestion, suggestions, word, words;
      if (insertParameterList == null) {
        insertParameterList = true;
      }
      words = fuzzaldrin.filter(this.functions.names, prefix);
      suggestions = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        ref = this.functions.values[word];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          element = ref[j];
          returnValueParts = ((ref1 = element.args["return"]) != null ? ref1.type : void 0) ? element.args["return"].type.split('\\') : [];
          returnValue = returnValueParts[returnValueParts.length - 1];
          suggestion = {
            text: word,
            type: 'function',
            description: element.isInternal ? 'Built-in PHP function.' : (element.args.descriptions.short != null ? element.args.descriptions.short : ''),
            className: element.args.deprecated ? 'php-atom-autocomplete-strike' : '',
            snippet: insertParameterList ? this.getFunctionSnippet(word, element.args) : null,
            displayText: this.getFunctionSignature(word, element.args),
            replacementPrefix: prefix,
            leftLabel: returnValue
          };
          if (element.isInternal) {
            suggestion.descriptionMoreURL = config.config.php_documentation_base_url.functions + word;
          }
          suggestions.push(suggestion);
        }
      }
      return suggestions;
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL2Z1bmN0aW9uLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQTs7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUViLEtBQUEsR0FBUSxPQUFBLENBQVEsOEJBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUjs7RUFDVCxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FHTTs7Ozs7OzsrQkFDRixTQUFBLEdBQVc7OztBQUVYOzs7OzsrQkFJQSxnQkFBQSxHQUFrQixTQUFDLEdBQUQ7QUFFZCxVQUFBO01BRmdCLHFCQUFRLHFDQUFnQix1Q0FBaUI7TUFFekQsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUVULE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsY0FBbkI7TUFDVCxJQUFBLENBQWMsTUFBTSxDQUFDLE1BQXJCO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQUssQ0FBQyxTQUFOLENBQUE7TUFDYixJQUFjLDZEQUFkO0FBQUEsZUFBQTs7TUFFQSxvQkFBQSxHQUF1QixNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLGNBQUQsRUFBaUIsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBN0MsQ0FBakIsQ0FBdEI7TUFDdkIsbUJBQUEsR0FBeUIsb0JBQUEsS0FBd0IsR0FBM0IsR0FBb0MsS0FBcEMsR0FBK0M7TUFFckUsV0FBQSxHQUFjLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixNQUFNLENBQUMsSUFBUCxDQUFBLENBQTFCLEVBQXlDLG1CQUF6QztNQUNkLElBQUEsQ0FBYyxXQUFXLENBQUMsTUFBMUI7QUFBQSxlQUFBOztBQUNBLGFBQU87SUFmTzs7O0FBaUJsQjs7Ozs7Ozs7OytCQVFBLHdCQUFBLEdBQTBCLFNBQUMsTUFBRCxFQUFTLG1CQUFUO0FBRXRCLFVBQUE7O1FBRitCLHNCQUFzQjs7TUFFckQsS0FBQSxHQUFRLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBN0IsRUFBb0MsTUFBcEM7TUFHUixXQUFBLEdBQWM7QUFDZCxXQUFBLHVDQUFBOztBQUNJO0FBQUEsYUFBQSx1Q0FBQTs7VUFDSSxnQkFBQSxrREFBeUMsQ0FBRSxjQUF4QixHQUFrQyxPQUFPLENBQUMsSUFBSSxFQUFDLE1BQUQsRUFBTyxDQUFDLElBQUksQ0FBQyxLQUF6QixDQUErQixJQUEvQixDQUFsQyxHQUE0RTtVQUMvRixXQUFBLEdBQWMsZ0JBQWlCLENBQUEsZ0JBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBMUI7VUFFL0IsVUFBQSxHQUNJO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxJQUFBLEVBQU0sVUFETjtZQUVBLFdBQUEsRUFBZ0IsT0FBTyxDQUFDLFVBQVgsR0FBMkIsd0JBQTNCLEdBQXlELENBQUksdUNBQUgsR0FBeUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBbkUsR0FBOEUsRUFBL0UsQ0FGdEU7WUFHQSxTQUFBLEVBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFoQixHQUFnQyw4QkFBaEMsR0FBb0UsRUFIL0U7WUFJQSxPQUFBLEVBQVksbUJBQUgsR0FBNEIsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLEVBQTBCLE9BQU8sQ0FBQyxJQUFsQyxDQUE1QixHQUF5RSxJQUpsRjtZQUtBLFdBQUEsRUFBYSxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsSUFBdEIsRUFBNEIsT0FBTyxDQUFDLElBQXBDLENBTGI7WUFNQSxpQkFBQSxFQUFtQixNQU5uQjtZQU9BLFNBQUEsRUFBVyxXQVBYOztVQVNKLElBQUcsT0FBTyxDQUFDLFVBQVg7WUFDRSxVQUFVLENBQUMsa0JBQVgsR0FBZ0MsTUFBTSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxTQUF6QyxHQUFxRCxLQUR2Rjs7VUFHQSxXQUFXLENBQUMsSUFBWixDQUFpQixVQUFqQjtBQWpCSjtBQURKO0FBcUJBLGFBQU87SUEzQmU7Ozs7S0FoQ0M7QUFYL0IiLCJzb3VyY2VzQ29udGVudCI6WyJmdXp6YWxkcmluID0gcmVxdWlyZSAnZnV6emFsZHJpbidcblxucHJveHkgPSByZXF1aXJlIFwiLi4vc2VydmljZXMvcGhwLXByb3h5LmNvZmZlZVwiXG5wYXJzZXIgPSByZXF1aXJlIFwiLi4vc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyLmNvZmZlZVwiXG5BYnN0cmFjdFByb3ZpZGVyID0gcmVxdWlyZSBcIi4vYWJzdHJhY3QtcHJvdmlkZXJcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cblxuIyBBdXRvY29tcGxldGlvbiBmb3IgaW50ZXJuYWwgUEhQIGZ1bmN0aW9ucy5cbmNsYXNzIEZ1bmN0aW9uUHJvdmlkZXIgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgZnVuY3Rpb25zOiBbXVxuXG4gICAgIyMjKlxuICAgICAqIEdldCBzdWdnZXN0aW9ucyBmcm9tIHRoZSBwcm92aWRlciAoQHNlZSBwcm92aWRlci1hcGkpXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICMjI1xuICAgIGZldGNoU3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSAtPlxuICAgICAgICAjIG5vdCBwcmVjZWRlZCBieSBhID4gKGFycm93IG9wZXJhdG9yKSwgYSAkICh2YXJpYWJsZSBzdGFydCksIC4uLlxuICAgICAgICBAcmVnZXggPSAvKD86KD86XnxbXlxcd1xcJF9cXD5dKSkoW2EtekEtWl9dKykoPyFbXFx3XFwkX1xcPl0pL2dcblxuICAgICAgICBwcmVmaXggPSBAZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgIHJldHVybiB1bmxlc3MgcHJlZml4Lmxlbmd0aFxuXG4gICAgICAgIEBmdW5jdGlvbnMgPSBwcm94eS5mdW5jdGlvbnMoKVxuICAgICAgICByZXR1cm4gdW5sZXNzIEBmdW5jdGlvbnM/Lm5hbWVzP1xuXG4gICAgICAgIGNoYXJhY3RlckFmdGVyUHJlZml4ID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtidWZmZXJQb3NpdGlvbiwgW2J1ZmZlclBvc2l0aW9uLnJvdywgYnVmZmVyUG9zaXRpb24uY29sdW1uICsgMV1dKVxuICAgICAgICBpbnNlcnRQYXJhbWV0ZXJMaXN0ID0gaWYgY2hhcmFjdGVyQWZ0ZXJQcmVmaXggPT0gJygnIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zRm9yUHJlZml4KHByZWZpeC50cmltKCksIGluc2VydFBhcmFtZXRlckxpc3QpXG4gICAgICAgIHJldHVybiB1bmxlc3Mgc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gICAgIyMjKlxuICAgICAqIFJldHVybnMgc3VnZ2VzdGlvbnMgYXZhaWxhYmxlIG1hdGNoaW5nIHRoZSBnaXZlbiBwcmVmaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4ICAgICAgICAgICAgICBQcmVmaXggdG8gbWF0Y2guXG4gICAgICogQHBhcmFtIHtib29sfSAgIGluc2VydFBhcmFtZXRlckxpc3QgV2hldGhlciB0byBpbnNlcnQgYSBsaXN0IG9mIHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAjIyNcbiAgICBmaW5kU3VnZ2VzdGlvbnNGb3JQcmVmaXg6IChwcmVmaXgsIGluc2VydFBhcmFtZXRlckxpc3QgPSB0cnVlKSAtPlxuICAgICAgICAjIEZpbHRlciB0aGUgd29yZHMgdXNpbmcgZnV6emFsZHJpblxuICAgICAgICB3b3JkcyA9IGZ1enphbGRyaW4uZmlsdGVyIEBmdW5jdGlvbnMubmFtZXMsIHByZWZpeFxuXG4gICAgICAgICMgQnVpbGRzIHN1Z2dlc3Rpb25zIGZvciB0aGUgd29yZHNcbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgICAgICBmb3Igd29yZCBpbiB3b3Jkc1xuICAgICAgICAgICAgZm9yIGVsZW1lbnQgaW4gQGZ1bmN0aW9ucy52YWx1ZXNbd29yZF1cbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZVBhcnRzID0gaWYgZWxlbWVudC5hcmdzLnJldHVybj8udHlwZSB0aGVuIGVsZW1lbnQuYXJncy5yZXR1cm4udHlwZS5zcGxpdCgnXFxcXCcpIGVsc2UgW11cbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlUGFydHNbcmV0dXJuVmFsdWVQYXJ0cy5sZW5ndGggLSAxXVxuXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHdvcmQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBpZiBlbGVtZW50LmlzSW50ZXJuYWwgdGhlbiAnQnVpbHQtaW4gUEhQIGZ1bmN0aW9uLicgZWxzZSAoaWYgZWxlbWVudC5hcmdzLmRlc2NyaXB0aW9ucy5zaG9ydD8gdGhlbiBlbGVtZW50LmFyZ3MuZGVzY3JpcHRpb25zLnNob3J0IGVsc2UgJycpXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogaWYgZWxlbWVudC5hcmdzLmRlcHJlY2F0ZWQgdGhlbiAncGhwLWF0b20tYXV0b2NvbXBsZXRlLXN0cmlrZScgZWxzZSAnJ1xuICAgICAgICAgICAgICAgICAgICBzbmlwcGV0OiBpZiBpbnNlcnRQYXJhbWV0ZXJMaXN0IHRoZW4gQGdldEZ1bmN0aW9uU25pcHBldCh3b3JkLCBlbGVtZW50LmFyZ3MpIGVsc2UgbnVsbFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogQGdldEZ1bmN0aW9uU2lnbmF0dXJlKHdvcmQsIGVsZW1lbnQuYXJncylcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeFxuICAgICAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6IHJldHVyblZhbHVlXG5cbiAgICAgICAgICAgICAgICBpZiBlbGVtZW50LmlzSW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb25Nb3JlVVJMID0gY29uZmlnLmNvbmZpZy5waHBfZG9jdW1lbnRhdGlvbl9iYXNlX3VybC5mdW5jdGlvbnMgKyB3b3JkXG5cbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoIHN1Z2dlc3Rpb25cblxuXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuIl19
