(function() {
  var AbstractProvider, parser;

  parser = require("../services/php-file-parser.coffee");

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.regex = '';

    AbstractProvider.prototype.selector = '.source.php';

    AbstractProvider.prototype.inclusionPriority = 10;

    AbstractProvider.prototype.disableForSelector = '.source.php .comment, .source.php .string';


    /**
     * Initializes this provider.
     */

    AbstractProvider.prototype.init = function() {};


    /**
     * Deactives the provider.
     */

    AbstractProvider.prototype.deactivate = function() {};


    /**
     * Entry point of all request from autocomplete-plus
     * Calls @fetchSuggestion in the provider if allowed
     * @return array Suggestions
     */

    AbstractProvider.prototype.getSuggestions = function(arg1) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = arg1.editor, bufferPosition = arg1.bufferPosition, scopeDescriptor = arg1.scopeDescriptor, prefix = arg1.prefix;
      return new Promise((function(_this) {
        return function(resolve) {
          return resolve(_this.fetchSuggestions({
            editor: editor,
            bufferPosition: bufferPosition,
            scopeDescriptor: scopeDescriptor,
            prefix: prefix
          }));
        };
      })(this));
    };


    /**
     * Builds a snippet for a PHP function
     * @param {string} word     Function name
     * @param {array}  elements All arguments for the snippet (parameters, optionals)
     * @return string The snippet
     */

    AbstractProvider.prototype.getFunctionSnippet = function(word, elements) {
      var arg, body, i, index, j, lastIndex, len, len1, ref, ref1;
      body = word + "(";
      lastIndex = 0;
      ref = elements.parameters;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        arg = ref[index];
        if (index !== 0) {
          body += ", ";
        }
        body += "${" + (index + 1) + ":" + arg + "}";
        lastIndex = index + 1;
      }
      if (elements.optionals.length > 0) {
        body += " ${" + (lastIndex + 1) + ":[";
        if (lastIndex !== 0) {
          body += ", ";
        }
        lastIndex += 1;
        ref1 = elements.optionals;
        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
          arg = ref1[index];
          if (index !== 0) {
            body += ", ";
          }
          body += arg;
        }
        body += "]}";
      }
      body += ")";
      body += "$0";
      return body;
    };


    /**
     * Builds the signature for a PHP function
     * @param {string} word     Function name
     * @param {array}  elements All arguments for the signature (parameters, optionals)
     * @return string The signature
     */

    AbstractProvider.prototype.getFunctionSignature = function(word, element) {
      var signature, snippet;
      snippet = this.getFunctionSnippet(word, element);
      signature = snippet.replace(/\$\{\d+:([^\}]+)\}/g, '$1');
      return signature.slice(0, -2);
    };


    /**
     * Get prefix from bufferPosition and @regex
     * @return string
     */

    AbstractProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var i, len, line, match, matches, start, word;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(this.regex);
      if (matches != null) {
        for (i = 0, len = matches.length; i < len; i++) {
          match = matches[i];
          start = bufferPosition.column - match.length;
          if (start >= 0) {
            word = editor.getTextInBufferRange([[bufferPosition.row, bufferPosition.column - match.length], bufferPosition]);
            if (word === match) {
              if (match[0] === '{' || match[0] === '(' || match[0] === '[') {
                match = match.substring(1);
              }
              return match;
            }
          }
        }
      }
      return '';
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL2Fic3RyYWN0LXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUdNOzs7K0JBQ0YsS0FBQSxHQUFPOzsrQkFDUCxRQUFBLEdBQVU7OytCQUVWLGlCQUFBLEdBQW1COzsrQkFFbkIsa0JBQUEsR0FBb0I7OztBQUVwQjs7OzsrQkFHQSxJQUFBLEdBQU0sU0FBQSxHQUFBOzs7QUFFTjs7OzsrQkFHQSxVQUFBLEdBQVksU0FBQSxHQUFBOzs7QUFFWjs7Ozs7OytCQUtBLGNBQUEsR0FBZ0IsU0FBQyxJQUFEO0FBQ1osVUFBQTtNQURjLHNCQUFRLHNDQUFnQix3Q0FBaUI7YUFDdkQsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ1IsT0FBQSxDQUFRLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQjtZQUFDLFFBQUEsTUFBRDtZQUFTLGdCQUFBLGNBQVQ7WUFBeUIsaUJBQUEsZUFBekI7WUFBMEMsUUFBQSxNQUExQztXQUFsQixDQUFSO1FBRFE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFEWTs7O0FBSWhCOzs7Ozs7OytCQU1BLGtCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFFBQVA7QUFDaEIsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFBLEdBQU87TUFDZCxTQUFBLEdBQVk7QUFHWjtBQUFBLFdBQUEscURBQUE7O1FBQ0ksSUFBZ0IsS0FBQSxLQUFTLENBQXpCO1VBQUEsSUFBQSxJQUFRLEtBQVI7O1FBQ0EsSUFBQSxJQUFRLElBQUEsR0FBTyxDQUFDLEtBQUEsR0FBTSxDQUFQLENBQVAsR0FBbUIsR0FBbkIsR0FBeUIsR0FBekIsR0FBK0I7UUFDdkMsU0FBQSxHQUFZLEtBQUEsR0FBTTtBQUh0QjtNQU1BLElBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFuQixHQUE0QixDQUEvQjtRQUNJLElBQUEsSUFBUSxLQUFBLEdBQVEsQ0FBQyxTQUFBLEdBQVksQ0FBYixDQUFSLEdBQTBCO1FBQ2xDLElBQWdCLFNBQUEsS0FBYSxDQUE3QjtVQUFBLElBQUEsSUFBUSxLQUFSOztRQUVBLFNBQUEsSUFBYTtBQUViO0FBQUEsYUFBQSx3REFBQTs7VUFDSSxJQUFnQixLQUFBLEtBQVMsQ0FBekI7WUFBQSxJQUFBLElBQVEsS0FBUjs7VUFDQSxJQUFBLElBQVE7QUFGWjtRQUdBLElBQUEsSUFBUSxLQVRaOztNQVdBLElBQUEsSUFBUTtNQUdSLElBQUEsSUFBUTtBQUVSLGFBQU87SUEzQlM7OztBQTZCcEI7Ozs7Ozs7K0JBTUEsb0JBQUEsR0FBc0IsU0FBQyxJQUFELEVBQU8sT0FBUDtBQUNsQixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixPQUExQjtNQUdWLFNBQUEsR0FBWSxPQUFPLENBQUMsT0FBUixDQUFnQixxQkFBaEIsRUFBdUMsSUFBdkM7QUFFWixhQUFPLFNBQVU7SUFOQzs7O0FBUXRCOzs7OzsrQkFJQSxTQUFBLEdBQVcsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUVQLFVBQUE7TUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFoQixFQUFxQixDQUFyQixDQUFELEVBQTBCLGNBQTFCLENBQXRCO01BR1AsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQVo7TUFHVixJQUFHLGVBQUg7QUFDSSxhQUFBLHlDQUFBOztVQUNJLEtBQUEsR0FBUSxjQUFjLENBQUMsTUFBZixHQUF3QixLQUFLLENBQUM7VUFDdEMsSUFBRyxLQUFBLElBQVMsQ0FBWjtZQUNJLElBQUEsR0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFoQixFQUFxQixjQUFjLENBQUMsTUFBZixHQUF3QixLQUFLLENBQUMsTUFBbkQsQ0FBRCxFQUE2RCxjQUE3RCxDQUE1QjtZQUNQLElBQUcsSUFBQSxLQUFRLEtBQVg7Y0FHSSxJQUFHLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxHQUFaLElBQW1CLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxHQUEvQixJQUFzQyxLQUFNLENBQUEsQ0FBQSxDQUFOLEtBQVksR0FBckQ7Z0JBQ0ksS0FBQSxHQUFRLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBRFo7O0FBR0EscUJBQU8sTUFOWDthQUZKOztBQUZKLFNBREo7O0FBYUEsYUFBTztJQXJCQTs7Ozs7QUFyRmYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXJzZXIgPSByZXF1aXJlIFwiLi4vc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cblxuIyBBYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBhdXRvY29tcGxldGlvbiBwcm92aWRlcnMuXG5jbGFzcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgcmVnZXg6ICcnXG4gICAgc2VsZWN0b3I6ICcuc291cmNlLnBocCdcblxuICAgIGluY2x1c2lvblByaW9yaXR5OiAxMFxuXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5waHAgLmNvbW1lbnQsIC5zb3VyY2UucGhwIC5zdHJpbmcnXG5cbiAgICAjIyMqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhpcyBwcm92aWRlci5cbiAgICAjIyNcbiAgICBpbml0OiAoKSAtPlxuXG4gICAgIyMjKlxuICAgICAqIERlYWN0aXZlcyB0aGUgcHJvdmlkZXIuXG4gICAgIyMjXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cblxuICAgICMjIypcbiAgICAgKiBFbnRyeSBwb2ludCBvZiBhbGwgcmVxdWVzdCBmcm9tIGF1dG9jb21wbGV0ZS1wbHVzXG4gICAgICogQ2FsbHMgQGZldGNoU3VnZ2VzdGlvbiBpbiB0aGUgcHJvdmlkZXIgaWYgYWxsb3dlZFxuICAgICAqIEByZXR1cm4gYXJyYXkgU3VnZ2VzdGlvbnNcbiAgICAjIyNcbiAgICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgICAgICAgcmVzb2x2ZShAZmV0Y2hTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSlcblxuICAgICMjIypcbiAgICAgKiBCdWlsZHMgYSBzbmlwcGV0IGZvciBhIFBIUCBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkICAgICBGdW5jdGlvbiBuYW1lXG4gICAgICogQHBhcmFtIHthcnJheX0gIGVsZW1lbnRzIEFsbCBhcmd1bWVudHMgZm9yIHRoZSBzbmlwcGV0IChwYXJhbWV0ZXJzLCBvcHRpb25hbHMpXG4gICAgICogQHJldHVybiBzdHJpbmcgVGhlIHNuaXBwZXRcbiAgICAjIyNcbiAgICBnZXRGdW5jdGlvblNuaXBwZXQ6ICh3b3JkLCBlbGVtZW50cykgLT5cbiAgICAgICAgYm9keSA9IHdvcmQgKyBcIihcIlxuICAgICAgICBsYXN0SW5kZXggPSAwXG5cbiAgICAgICAgIyBOb24gb3B0aW9uYWwgZWxlbWVudHNcbiAgICAgICAgZm9yIGFyZywgaW5kZXggaW4gZWxlbWVudHMucGFyYW1ldGVyc1xuICAgICAgICAgICAgYm9keSArPSBcIiwgXCIgaWYgaW5kZXggIT0gMFxuICAgICAgICAgICAgYm9keSArPSBcIiR7XCIgKyAoaW5kZXgrMSkgKyBcIjpcIiArIGFyZyArIFwifVwiXG4gICAgICAgICAgICBsYXN0SW5kZXggPSBpbmRleCsxXG5cbiAgICAgICAgIyBPcHRpb25hbCBlbGVtZW50cy4gT25lIGJpZyBzYW1lIHNuaXBwZXRcbiAgICAgICAgaWYgZWxlbWVudHMub3B0aW9uYWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGJvZHkgKz0gXCIgJHtcIiArIChsYXN0SW5kZXggKyAxKSArIFwiOltcIlxuICAgICAgICAgICAgYm9keSArPSBcIiwgXCIgaWYgbGFzdEluZGV4ICE9IDBcblxuICAgICAgICAgICAgbGFzdEluZGV4ICs9IDFcblxuICAgICAgICAgICAgZm9yIGFyZywgaW5kZXggaW4gZWxlbWVudHMub3B0aW9uYWxzXG4gICAgICAgICAgICAgICAgYm9keSArPSBcIiwgXCIgaWYgaW5kZXggIT0gMFxuICAgICAgICAgICAgICAgIGJvZHkgKz0gYXJnXG4gICAgICAgICAgICBib2R5ICs9IFwiXX1cIlxuXG4gICAgICAgIGJvZHkgKz0gXCIpXCJcblxuICAgICAgICAjIEVuc3VyZSB0aGUgdXNlciBlbmRzIHVwIGFmdGVyIHRoZSBpbnNlcnRlZCB0ZXh0IHdoZW4gaGUncyBkb25lIGN5Y2xpbmcgdGhyb3VnaCB0aGUgcGFyYW1ldGVycyB3aXRoIHRhYi5cbiAgICAgICAgYm9keSArPSBcIiQwXCJcblxuICAgICAgICByZXR1cm4gYm9keVxuXG4gICAgIyMjKlxuICAgICAqIEJ1aWxkcyB0aGUgc2lnbmF0dXJlIGZvciBhIFBIUCBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkICAgICBGdW5jdGlvbiBuYW1lXG4gICAgICogQHBhcmFtIHthcnJheX0gIGVsZW1lbnRzIEFsbCBhcmd1bWVudHMgZm9yIHRoZSBzaWduYXR1cmUgKHBhcmFtZXRlcnMsIG9wdGlvbmFscylcbiAgICAgKiBAcmV0dXJuIHN0cmluZyBUaGUgc2lnbmF0dXJlXG4gICAgIyMjXG4gICAgZ2V0RnVuY3Rpb25TaWduYXR1cmU6ICh3b3JkLCBlbGVtZW50KSAtPlxuICAgICAgICBzbmlwcGV0ID0gQGdldEZ1bmN0aW9uU25pcHBldCh3b3JkLCBlbGVtZW50KVxuXG4gICAgICAgICMgSnVzdCBzdHJpcCBvdXQgdGhlIHBsYWNlaG9sZGVycy5cbiAgICAgICAgc2lnbmF0dXJlID0gc25pcHBldC5yZXBsYWNlKC9cXCRcXHtcXGQrOihbXlxcfV0rKVxcfS9nLCAnJDEnKVxuXG4gICAgICAgIHJldHVybiBzaWduYXR1cmVbMCAuLiAtM11cblxuICAgICMjIypcbiAgICAgKiBHZXQgcHJlZml4IGZyb20gYnVmZmVyUG9zaXRpb24gYW5kIEByZWdleFxuICAgICAqIEByZXR1cm4gc3RyaW5nXG4gICAgIyMjXG4gICAgZ2V0UHJlZml4OiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICAgICAgIyBHZXQgdGhlIHRleHQgZm9yIHRoZSBsaW5lIHVwIHRvIHRoZSB0cmlnZ2VyZWQgYnVmZmVyIHBvc2l0aW9uXG4gICAgICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG5cbiAgICAgICAgIyBNYXRjaCB0aGUgcmVnZXggdG8gdGhlIGxpbmUsIGFuZCByZXR1cm4gdGhlIG1hdGNoXG4gICAgICAgIG1hdGNoZXMgPSBsaW5lLm1hdGNoKEByZWdleClcblxuICAgICAgICAjIExvb2tpbmcgZm9yIHRoZSBjb3JyZWN0IG1hdGNoXG4gICAgICAgIGlmIG1hdGNoZXM/XG4gICAgICAgICAgICBmb3IgbWF0Y2ggaW4gbWF0Y2hlc1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gYnVmZmVyUG9zaXRpb24uY29sdW1uIC0gbWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICAgICAgaWYgc3RhcnQgPj0gMFxuICAgICAgICAgICAgICAgICAgICB3b3JkID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCBidWZmZXJQb3NpdGlvbi5jb2x1bW4gLSBtYXRjaC5sZW5ndGhdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmQgPT0gbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICPCoE5vdCByZWFsbHkgbmljZSBoYWNrLi4gQnV0IG5vbiBtYXRjaGluZyBncm91cHMgdGFrZSB0aGUgZmlyc3Qgd29yZCBiZWZvcmUuIFNvIEkgcmVtb3ZlIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgI8KgTmVjZXNzYXJ5IHRvIGhhdmUgY29tcGxldGlvbiBqdXN0ZSBuZXh0IHRvIGEgKCBvciBbIG9yIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG1hdGNoWzBdID09ICd7JyBvciBtYXRjaFswXSA9PSAnKCcgb3IgbWF0Y2hbMF0gPT0gJ1snXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBtYXRjaC5zdWJzdHJpbmcoMSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoXG5cbiAgICAgICAgcmV0dXJuICcnXG4iXX0=
