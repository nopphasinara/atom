(function() {
  var AbstractProvider, ConstantProvider, config, fuzzaldrin, parser, proxy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fuzzaldrin = require('fuzzaldrin');

  proxy = require("../services/php-proxy.coffee");

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  config = require("../config.coffee");

  module.exports = ConstantProvider = (function(superClass) {
    extend(ConstantProvider, superClass);

    function ConstantProvider() {
      return ConstantProvider.__super__.constructor.apply(this, arguments);
    }

    ConstantProvider.prototype.constants = [];


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    ConstantProvider.prototype.fetchSuggestions = function(arg) {
      var bufferPosition, editor, prefix, ref, scopeDescriptor, suggestions;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.regex = /(?:(?:^|[^\w\$_\>]))([A-Z_]+)(?![\w\$_\>])/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      this.constants = proxy.constants();
      if (((ref = this.constants) != null ? ref.names : void 0) == null) {
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

    ConstantProvider.prototype.findSuggestionsForPrefix = function(prefix) {
      var element, i, j, len, len1, ref, suggestions, word, words;
      words = fuzzaldrin.filter(this.constants.names, prefix);
      suggestions = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        ref = this.constants.values[word];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          element = ref[j];
          suggestions.push({
            text: word,
            type: 'constant',
            description: 'Built-in PHP constant.'
          });
        }
      }
      return suggestions;
    };

    return ConstantProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL2NvbnN0YW50LXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQTs7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUViLEtBQUEsR0FBUSxPQUFBLENBQVEsOEJBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUjs7RUFDVCxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FHTTs7Ozs7OzsrQkFDRixTQUFBLEdBQVc7OztBQUVYOzs7OzsrQkFJQSxnQkFBQSxHQUFrQixTQUFDLEdBQUQ7QUFFZCxVQUFBO01BRmdCLHFCQUFRLHFDQUFnQix1Q0FBaUI7TUFFekQsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUVULE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsY0FBbkI7TUFDVCxJQUFBLENBQWMsTUFBTSxDQUFDLE1BQXJCO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQUssQ0FBQyxTQUFOLENBQUE7TUFDYixJQUFjLDZEQUFkO0FBQUEsZUFBQTs7TUFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLHdCQUFELENBQTBCLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBMUI7TUFDZCxJQUFBLENBQWMsV0FBVyxDQUFDLE1BQTFCO0FBQUEsZUFBQTs7QUFDQSxhQUFPO0lBWk87OztBQWNsQjs7Ozs7OytCQUtBLHdCQUFBLEdBQTBCLFNBQUMsTUFBRDtBQUV0QixVQUFBO01BQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBN0IsRUFBb0MsTUFBcEM7TUFHUixXQUFBLEdBQWM7QUFDZCxXQUFBLHVDQUFBOztBQUNJO0FBQUEsYUFBQSx1Q0FBQTs7VUFDSSxXQUFXLENBQUMsSUFBWixDQUNJO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxJQUFBLEVBQU0sVUFETjtZQUVBLFdBQUEsRUFBYSx3QkFGYjtXQURKO0FBREo7QUFESjtBQU9BLGFBQU87SUFiZTs7OztLQTFCQztBQVgvQiIsInNvdXJjZXNDb250ZW50IjpbImZ1enphbGRyaW4gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xuXG5wcm94eSA9IHJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlXCJcbnBhcnNlciA9IHJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXIuY29mZmVlXCJcbkFic3RyYWN0UHJvdmlkZXIgPSByZXF1aXJlIFwiLi9hYnN0cmFjdC1wcm92aWRlclwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4jIEF1dG9jb21wbGV0aW9uIGZvciBpbnRlcm5hbCBQSFAgY29uc3RhbnRzLlxuY2xhc3MgQ29uc3RhbnRQcm92aWRlciBleHRlbmRzIEFic3RyYWN0UHJvdmlkZXJcbiAgICBjb25zdGFudHM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogR2V0IHN1Z2dlc3Rpb25zIGZyb20gdGhlIHByb3ZpZGVyIChAc2VlIHByb3ZpZGVyLWFwaSlcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgIyMjXG4gICAgZmV0Y2hTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgICAgICMgbm90IHByZWNlZGVkIGJ5IGEgPiAoYXJyb3cgb3BlcmF0b3IpLCBhICQgKHZhcmlhYmxlIHN0YXJ0KSwgLi4uXG4gICAgICAgIEByZWdleCA9IC8oPzooPzpefFteXFx3XFwkX1xcPl0pKShbQS1aX10rKSg/IVtcXHdcXCRfXFw+XSkvZ1xuXG4gICAgICAgIHByZWZpeCA9IEBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwcmVmaXgubGVuZ3RoXG5cbiAgICAgICAgQGNvbnN0YW50cyA9IHByb3h5LmNvbnN0YW50cygpXG4gICAgICAgIHJldHVybiB1bmxlc3MgQGNvbnN0YW50cz8ubmFtZXM/XG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zRm9yUHJlZml4KHByZWZpeC50cmltKCkpXG4gICAgICAgIHJldHVybiB1bmxlc3Mgc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gICAgIyMjKlxuICAgICAqIFJldHVybnMgc3VnZ2VzdGlvbnMgYXZhaWxhYmxlIG1hdGNoaW5nIHRoZSBnaXZlbiBwcmVmaXhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IFByZWZpeCB0byBtYXRjaFxuICAgICAqIEByZXR1cm4gYXJyYXlcbiAgICAjIyNcbiAgICBmaW5kU3VnZ2VzdGlvbnNGb3JQcmVmaXg6IChwcmVmaXgpIC0+XG4gICAgICAgICMgRmlsdGVyIHRoZSB3b3JkcyB1c2luZyBmdXp6YWxkcmluXG4gICAgICAgIHdvcmRzID0gZnV6emFsZHJpbi5maWx0ZXIgQGNvbnN0YW50cy5uYW1lcywgcHJlZml4XG5cbiAgICAgICAgIyBCdWlsZHMgc3VnZ2VzdGlvbnMgZm9yIHRoZSB3b3Jkc1xuICAgICAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgICAgIGZvciB3b3JkIGluIHdvcmRzXG4gICAgICAgICAgICBmb3IgZWxlbWVudCBpbiBAY29uc3RhbnRzLnZhbHVlc1t3b3JkXVxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogd29yZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbnN0YW50JyxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdCdWlsdC1pbiBQSFAgY29uc3RhbnQuJ1xuXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuIl19
