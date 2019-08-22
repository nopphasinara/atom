(function() {
  var AbstractProvider, ClassProvider, config, exec, fuzzaldrin, parser, proxy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fuzzaldrin = require('fuzzaldrin');

  exec = require("child_process");

  config = require("../config.coffee");

  proxy = require("../services/php-proxy.coffee");

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  module.exports = ClassProvider = (function(superClass) {
    var classes;

    extend(ClassProvider, superClass);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    classes = [];

    ClassProvider.prototype.disableForSelector = '.source.php .string';


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    ClassProvider.prototype.fetchSuggestions = function(arg) {
      var bufferPosition, characterAfterPrefix, editor, insertParameterList, prefix, ref, scopeDescriptor, suggestions;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.regex = /((?:new|use)?(?:[^a-z0-9_])\\?(?:[A-Z][a-zA-Z_\\]*)+)/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      this.classes = proxy.classes();
      if (((ref = this.classes) != null ? ref.autocomplete : void 0) == null) {
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
     * Get suggestions from the provider for a single word (@see provider-api)
     * @return array
     */

    ClassProvider.prototype.fetchSuggestionsFromWord = function(word) {
      var ref, suggestions;
      this.classes = proxy.classes();
      if (((ref = this.classes) != null ? ref.autocomplete : void 0) == null) {
        return;
      }
      suggestions = this.findSuggestionsForPrefix(word);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };


    /**
     * Returns suggestions available matching the given prefix
     * @param {string} prefix              Prefix to match.
     * @param {bool}   insertParameterList Whether to insert a list of parameters for methods.
     * @return array
     */

    ClassProvider.prototype.findSuggestionsForPrefix = function(prefix, insertParameterList) {
      var args, classInfo, i, instantiation, len, suggestions, use, word, words;
      if (insertParameterList == null) {
        insertParameterList = true;
      }
      instantiation = false;
      use = false;
      if (prefix.indexOf("new \\") !== -1) {
        instantiation = true;
        prefix = prefix.replace(/new \\/, '');
      } else if (prefix.indexOf("new ") !== -1) {
        instantiation = true;
        prefix = prefix.replace(/new /, '');
      } else if (prefix.indexOf("use ") !== -1) {
        use = true;
        prefix = prefix.replace(/use /, '');
      }
      if (prefix.indexOf("\\") === 0) {
        prefix = prefix.substring(1, prefix.length);
      }
      words = fuzzaldrin.filter(this.classes.autocomplete, prefix);
      suggestions = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (!(word !== prefix)) {
          continue;
        }
        classInfo = this.classes.mapping[word];
        if (instantiation && this.classes.mapping[word].methods.constructor.has) {
          args = classInfo.methods.constructor.args;
          suggestions.push({
            text: word,
            type: 'class',
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            snippet: insertParameterList ? this.getFunctionSnippet(word, args) : null,
            displayText: this.getFunctionSignature(word, args),
            data: {
              kind: 'instantiation',
              prefix: prefix,
              replacementPrefix: prefix
            }
          });
        } else if (use) {
          suggestions.push({
            text: word,
            type: 'class',
            prefix: prefix,
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            replacementPrefix: prefix,
            data: {
              kind: 'use'
            }
          });
        } else {
          suggestions.push({
            text: word,
            type: 'class',
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            data: {
              kind: 'static',
              prefix: prefix,
              replacementPrefix: prefix
            }
          });
        }
      }
      return suggestions;
    };


    /**
     * Adds the missing use if needed
     * @param {TextEditor} editor
     * @param {Position}   triggerPosition
     * @param {object}     suggestion
     */

    ClassProvider.prototype.onDidInsertSuggestion = function(arg) {
      var editor, ref, suggestion, triggerPosition;
      editor = arg.editor, triggerPosition = arg.triggerPosition, suggestion = arg.suggestion;
      if (!((ref = suggestion.data) != null ? ref.kind : void 0)) {
        return;
      }
      if (suggestion.data.kind === 'instantiation' || suggestion.data.kind === 'static') {
        return editor.transact((function(_this) {
          return function() {
            var endColumn, linesAdded, name, nameLength, row, splits, startColumn;
            linesAdded = parser.addUseClass(editor, suggestion.text, config.config.insertNewlinesForUseStatements);
            if (linesAdded !== null) {
              name = suggestion.text;
              splits = name.split('\\');
              nameLength = splits[splits.length - 1].length;
              startColumn = triggerPosition.column - suggestion.data.prefix.length;
              row = triggerPosition.row + linesAdded;
              if (suggestion.data.kind === 'instantiation') {
                endColumn = startColumn + name.length - nameLength - splits.length + 1;
              } else {
                endColumn = startColumn + name.length - nameLength;
              }
              return editor.setTextInBufferRange([[row, startColumn], [row, endColumn]], "");
            }
          };
        })(this));
      }
    };


    /**
     * Adds the missing use if needed without removing text from editor
     * @param {TextEditor} editor
     * @param {object}     suggestion
     */

    ClassProvider.prototype.onSelectedClassSuggestion = function(arg) {
      var editor, ref, suggestion;
      editor = arg.editor, suggestion = arg.suggestion;
      if (!((ref = suggestion.data) != null ? ref.kind : void 0)) {
        return;
      }
      if (suggestion.data.kind === 'instantiation' || suggestion.data.kind === 'static') {
        return editor.transact((function(_this) {
          return function() {
            var linesAdded;
            return linesAdded = parser.addUseClass(editor, suggestion.text, config.config.insertNewlinesForUseStatements);
          };
        })(this));
      }
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL2NsYXNzLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0VBQUE7SUFBQTs7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7RUFFUCxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsOEJBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUjs7RUFDVCxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBR007QUFDRixRQUFBOzs7Ozs7OztJQUFBLE9BQUEsR0FBVTs7NEJBQ1Ysa0JBQUEsR0FBb0I7OztBQUVwQjs7Ozs7NEJBSUEsZ0JBQUEsR0FBa0IsU0FBQyxHQUFEO0FBRWQsVUFBQTtNQUZnQixxQkFBUSxxQ0FBZ0IsdUNBQWlCO01BRXpELElBQUMsQ0FBQSxLQUFELEdBQVM7TUFFVCxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CO01BQ1QsSUFBQSxDQUFjLE1BQU0sQ0FBQyxNQUFyQjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFLLENBQUMsT0FBTixDQUFBO01BQ1gsSUFBYyxrRUFBZDtBQUFBLGVBQUE7O01BRUEsb0JBQUEsR0FBdUIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBQyxjQUFELEVBQWlCLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQTdDLENBQWpCLENBQXRCO01BQ3ZCLG1CQUFBLEdBQXlCLG9CQUFBLEtBQXdCLEdBQTNCLEdBQW9DLEtB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O0tBbEpIO0FBWDVCIiwic291cmNlc0NvbnRlbnQiOlsiZnV6emFsZHJpbiA9IHJlcXVpcmUgJ2Z1enphbGRyaW4nXG5leGVjID0gcmVxdWlyZSBcImNoaWxkX3Byb2Nlc3NcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnLmNvZmZlZVwiXG5wcm94eSA9IHJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlXCJcbnBhcnNlciA9IHJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXIuY29mZmVlXCJcbkFic3RyYWN0UHJvdmlkZXIgPSByZXF1aXJlIFwiLi9hYnN0cmFjdC1wcm92aWRlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cblxuIyBBdXRvY29tcGxldGlvbiBmb3IgY2xhc3MgbmFtZXMgKGUuZy4gYWZ0ZXIgdGhlIG5ldyBvciB1c2Uga2V5d29yZCkuXG5jbGFzcyBDbGFzc1Byb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlclxuICAgIGNsYXNzZXMgPSBbXVxuICAgIGRpc2FibGVGb3JTZWxlY3RvcjogJy5zb3VyY2UucGhwIC5zdHJpbmcnXG5cbiAgICAjIyMqXG4gICAgICogR2V0IHN1Z2dlc3Rpb25zIGZyb20gdGhlIHByb3ZpZGVyIChAc2VlIHByb3ZpZGVyLWFwaSlcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgIyMjXG4gICAgZmV0Y2hTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgICAgICMgXCJuZXdcIiBrZXl3b3JkIG9yIHdvcmQgc3RhcnRpbmcgd2l0aCBjYXBpdGFsIGxldHRlclxuICAgICAgICBAcmVnZXggPSAvKCg/Om5ld3x1c2UpPyg/OlteYS16MC05X10pXFxcXD8oPzpbQS1aXVthLXpBLVpfXFxcXF0qKSspL2dcblxuICAgICAgICBwcmVmaXggPSBAZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgIHJldHVybiB1bmxlc3MgcHJlZml4Lmxlbmd0aFxuXG4gICAgICAgIEBjbGFzc2VzID0gcHJveHkuY2xhc3NlcygpXG4gICAgICAgIHJldHVybiB1bmxlc3MgQGNsYXNzZXM/LmF1dG9jb21wbGV0ZT9cblxuICAgICAgICBjaGFyYWN0ZXJBZnRlclByZWZpeCA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbYnVmZmVyUG9zaXRpb24sIFtidWZmZXJQb3NpdGlvbi5yb3csIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiArIDFdXSlcbiAgICAgICAgaW5zZXJ0UGFyYW1ldGVyTGlzdCA9IGlmIGNoYXJhY3RlckFmdGVyUHJlZml4ID09ICcoJyB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXG4gICAgICAgIHN1Z2dlc3Rpb25zID0gQGZpbmRTdWdnZXN0aW9uc0ZvclByZWZpeChwcmVmaXgudHJpbSgpLCBpbnNlcnRQYXJhbWV0ZXJMaXN0KVxuICAgICAgICByZXR1cm4gdW5sZXNzIHN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgICMjIypcbiAgICAgKiBHZXQgc3VnZ2VzdGlvbnMgZnJvbSB0aGUgcHJvdmlkZXIgZm9yIGEgc2luZ2xlIHdvcmQgKEBzZWUgcHJvdmlkZXItYXBpKVxuICAgICAqIEByZXR1cm4gYXJyYXlcbiAgICAjIyNcbiAgICBmZXRjaFN1Z2dlc3Rpb25zRnJvbVdvcmQ6ICh3b3JkKSAtPlxuICAgICAgICBAY2xhc3NlcyA9IHByb3h5LmNsYXNzZXMoKVxuICAgICAgICByZXR1cm4gdW5sZXNzIEBjbGFzc2VzPy5hdXRvY29tcGxldGU/XG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zRm9yUHJlZml4KHdvcmQpXG4gICAgICAgIHJldHVybiB1bmxlc3Mgc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gICAgIyMjKlxuICAgICAqIFJldHVybnMgc3VnZ2VzdGlvbnMgYXZhaWxhYmxlIG1hdGNoaW5nIHRoZSBnaXZlbiBwcmVmaXhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4ICAgICAgICAgICAgICBQcmVmaXggdG8gbWF0Y2guXG4gICAgICogQHBhcmFtIHtib29sfSAgIGluc2VydFBhcmFtZXRlckxpc3QgV2hldGhlciB0byBpbnNlcnQgYSBsaXN0IG9mIHBhcmFtZXRlcnMgZm9yIG1ldGhvZHMuXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICMjI1xuICAgIGZpbmRTdWdnZXN0aW9uc0ZvclByZWZpeDogKHByZWZpeCwgaW5zZXJ0UGFyYW1ldGVyTGlzdCA9IHRydWUpIC0+XG4gICAgICAgICMgR2V0IHJpZCBvZiB0aGUgbGVhZGluZyBcIm5ld1wiIG9yIFwidXNlXCIga2V5d29yZFxuICAgICAgICBpbnN0YW50aWF0aW9uID0gZmFsc2VcbiAgICAgICAgdXNlID0gZmFsc2VcblxuICAgICAgICBpZiBwcmVmaXguaW5kZXhPZihcIm5ldyBcXFxcXCIpICE9IC0xXG4gICAgICAgICAgICBpbnN0YW50aWF0aW9uID0gdHJ1ZVxuICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4LnJlcGxhY2UgL25ldyBcXFxcLywgJydcbiAgICAgICAgZWxzZSBpZiBwcmVmaXguaW5kZXhPZihcIm5ldyBcIikgIT0gLTFcbiAgICAgICAgICAgIGluc3RhbnRpYXRpb24gPSB0cnVlXG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZSAvbmV3IC8sICcnXG4gICAgICAgIGVsc2UgaWYgcHJlZml4LmluZGV4T2YoXCJ1c2UgXCIpICE9IC0xXG4gICAgICAgICAgICB1c2UgPSB0cnVlXG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXgucmVwbGFjZSAvdXNlIC8sICcnXG5cbiAgICAgICAgaWYgcHJlZml4LmluZGV4T2YoXCJcXFxcXCIpID09IDBcbiAgICAgICAgICAgIHByZWZpeCA9IHByZWZpeC5zdWJzdHJpbmcoMSwgcHJlZml4Lmxlbmd0aClcblxuICAgICAgICAjIEZpbHRlciB0aGUgd29yZHMgdXNpbmcgZnV6emFsZHJpblxuICAgICAgICB3b3JkcyA9IGZ1enphbGRyaW4uZmlsdGVyIEBjbGFzc2VzLmF1dG9jb21wbGV0ZSwgcHJlZml4XG5cbiAgICAgICAgIyBCdWlsZHMgc3VnZ2VzdGlvbnMgZm9yIHRoZSB3b3Jkc1xuICAgICAgICBzdWdnZXN0aW9ucyA9IFtdXG5cbiAgICAgICAgZm9yIHdvcmQgaW4gd29yZHMgd2hlbiB3b3JkIGlzbnQgcHJlZml4XG4gICAgICAgICAgICBjbGFzc0luZm8gPSBAY2xhc3Nlcy5tYXBwaW5nW3dvcmRdXG5cbiAgICAgICAgICAgICMgSnVzdCBwcmludCBjbGFzc2VzIHdpdGggY29uc3RydWN0b3JzIHdpdGggXCJuZXdcIlxuICAgICAgICAgICAgaWYgaW5zdGFudGlhdGlvbiBhbmQgQGNsYXNzZXMubWFwcGluZ1t3b3JkXS5tZXRob2RzLmNvbnN0cnVjdG9yLmhhc1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBjbGFzc0luZm8ubWV0aG9kcy5jb25zdHJ1Y3Rvci5hcmdzXG5cbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHdvcmQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjbGFzcycsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogaWYgY2xhc3NJbmZvLmNsYXNzLmRlcHJlY2F0ZWQgdGhlbiAncGhwLWF0b20tYXV0b2NvbXBsZXRlLXN0cmlrZScgZWxzZSAnJ1xuICAgICAgICAgICAgICAgICAgICBzbmlwcGV0OiBpZiBpbnNlcnRQYXJhbWV0ZXJMaXN0IHRoZW4gQGdldEZ1bmN0aW9uU25pcHBldCh3b3JkLCBhcmdzKSBlbHNlIG51bGxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IEBnZXRGdW5jdGlvblNpZ25hdHVyZSh3b3JkLCBhcmdzKVxuICAgICAgICAgICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2luc3RhbnRpYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4XG5cbiAgICAgICAgICAgIGVsc2UgaWYgdXNlXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB3b3JkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xhc3MnLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBpZiBjbGFzc0luZm8uY2xhc3MuZGVwcmVjYXRlZCB0aGVuICdwaHAtYXRvbS1hdXRvY29tcGxldGUtc3RyaWtlJyBlbHNlICcnXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAndXNlJ1xuXG4gICAgICAgICAgICAjIE5vdCBpbnN0YW50aWF0aW9uID0+IG5vdCBwcmludGluZyBjb25zdHJ1Y3RvciBwYXJhbXNcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHdvcmQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjbGFzcycsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogaWYgY2xhc3NJbmZvLmNsYXNzLmRlcHJlY2F0ZWQgdGhlbiAncGhwLWF0b20tYXV0b2NvbXBsZXRlLXN0cmlrZScgZWxzZSAnJ1xuICAgICAgICAgICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ3N0YXRpYycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXhcblxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgICMjIypcbiAgICAgKiBBZGRzIHRoZSBtaXNzaW5nIHVzZSBpZiBuZWVkZWRcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgICAqIEBwYXJhbSB7UG9zaXRpb259ICAgdHJpZ2dlclBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICAgICBzdWdnZXN0aW9uXG4gICAgIyMjXG4gICAgb25EaWRJbnNlcnRTdWdnZXN0aW9uOiAoe2VkaXRvciwgdHJpZ2dlclBvc2l0aW9uLCBzdWdnZXN0aW9ufSkgLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBzdWdnZXN0aW9uLmRhdGE/LmtpbmRcblxuICAgICAgICBpZiBzdWdnZXN0aW9uLmRhdGEua2luZCA9PSAnaW5zdGFudGlhdGlvbicgb3Igc3VnZ2VzdGlvbi5kYXRhLmtpbmQgPT0gJ3N0YXRpYydcbiAgICAgICAgICAgIGVkaXRvci50cmFuc2FjdCAoKSA9PlxuICAgICAgICAgICAgICAgIGxpbmVzQWRkZWQgPSBwYXJzZXIuYWRkVXNlQ2xhc3MoZWRpdG9yLCBzdWdnZXN0aW9uLnRleHQsIGNvbmZpZy5jb25maWcuaW5zZXJ0TmV3bGluZXNGb3JVc2VTdGF0ZW1lbnRzKVxuXG4gICAgICAgICAgICAgICAgIyBSZW1vdmVzIG5hbWVzcGFjZSBmcm9tIGNsYXNzbmFtZVxuICAgICAgICAgICAgICAgIGlmIGxpbmVzQWRkZWQgIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gc3VnZ2VzdGlvbi50ZXh0XG4gICAgICAgICAgICAgICAgICAgIHNwbGl0cyA9IG5hbWUuc3BsaXQoJ1xcXFwnKVxuXG4gICAgICAgICAgICAgICAgICAgIG5hbWVMZW5ndGggPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRDb2x1bW4gPSB0cmlnZ2VyUG9zaXRpb24uY29sdW1uIC0gc3VnZ2VzdGlvbi5kYXRhLnByZWZpeC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gdHJpZ2dlclBvc2l0aW9uLnJvdyArIGxpbmVzQWRkZWRcblxuICAgICAgICAgICAgICAgICAgICBpZiBzdWdnZXN0aW9uLmRhdGEua2luZCA9PSAnaW5zdGFudGlhdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZENvbHVtbiA9IHN0YXJ0Q29sdW1uICsgbmFtZS5sZW5ndGggLSBuYW1lTGVuZ3RoIC0gc3BsaXRzLmxlbmd0aCArIDFcblxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDb2x1bW4gPSBzdGFydENvbHVtbiArIG5hbWUubGVuZ3RoIC0gbmFtZUxlbmd0aFxuXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbXG4gICAgICAgICAgICAgICAgICAgICAgICBbcm93LCBzdGFydENvbHVtbl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbcm93LCBlbmRDb2x1bW5dICMgQmVjYXVzZSB3aGVuIHNlbGVjdGVkIHRoZXJlJ3Mgbm90IFxcICh3aHk/KVxuICAgICAgICAgICAgICAgICAgICBdLCBcIlwiKVxuXG4gICAgIyMjKlxuICAgICAqIEFkZHMgdGhlIG1pc3NpbmcgdXNlIGlmIG5lZWRlZCB3aXRob3V0IHJlbW92aW5nIHRleHQgZnJvbSBlZGl0b3JcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAgICAgc3VnZ2VzdGlvblxuICAgICMjI1xuICAgIG9uU2VsZWN0ZWRDbGFzc1N1Z2dlc3Rpb246ICh7ZWRpdG9yLCBzdWdnZXN0aW9ufSkgLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBzdWdnZXN0aW9uLmRhdGE/LmtpbmRcblxuICAgICAgICBpZiBzdWdnZXN0aW9uLmRhdGEua2luZCA9PSAnaW5zdGFudGlhdGlvbicgb3Igc3VnZ2VzdGlvbi5kYXRhLmtpbmQgPT0gJ3N0YXRpYydcbiAgICAgICAgICAgIGVkaXRvci50cmFuc2FjdCAoKSA9PlxuICAgICAgICAgICAgICAgIGxpbmVzQWRkZWQgPSBwYXJzZXIuYWRkVXNlQ2xhc3MoZWRpdG9yLCBzdWdnZXN0aW9uLnRleHQsIGNvbmZpZy5jb25maWcuaW5zZXJ0TmV3bGluZXNGb3JVc2VTdGF0ZW1lbnRzKVxuIl19
