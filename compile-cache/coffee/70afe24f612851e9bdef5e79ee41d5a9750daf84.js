(function() {
  var AbstractProvider, MemberProvider, exec, fuzzaldrin, parser, proxy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzaldrin = require('fuzzaldrin');

  exec = require("child_process");

  proxy = require("../services/php-proxy.coffee");

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  module.exports = MemberProvider = (function(superClass) {
    extend(MemberProvider, superClass);

    function MemberProvider() {
      return MemberProvider.__super__.constructor.apply(this, arguments);
    }

    MemberProvider.prototype.methods = [];


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    MemberProvider.prototype.fetchSuggestions = function(arg) {
      var bufferPosition, characterAfterPrefix, classInfo, className, currentClass, currentClassParents, editor, elements, insertParameterList, mustBeStatic, prefix, scopeDescriptor, suggestions;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.regex = /(?:(?:[a-zA-Z0-9_]*)\s*(?:\(.*\))?\s*(?:->|::)\s*)+([a-zA-Z0-9_]*)/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      elements = parser.getStackClasses(editor, bufferPosition);
      if (elements == null) {
        return;
      }
      className = parser.parseElements(editor, bufferPosition, elements);
      if (className == null) {
        return;
      }
      elements = prefix.split(/(->|::)/);
      if (!(elements.length > 2)) {
        return;
      }
      currentClass = parser.getFullClassName(editor);
      currentClassParents = [];
      if (currentClass) {
        classInfo = proxy.methods(currentClass);
        currentClassParents = (classInfo != null ? classInfo.parents : void 0) ? classInfo != null ? classInfo.parents : void 0 : [];
      }
      mustBeStatic = false;
      if (elements[elements.length - 2] === '::' && elements[elements.length - 3].trim() !== 'parent') {
        mustBeStatic = true;
      }
      characterAfterPrefix = editor.getTextInRange([bufferPosition, [bufferPosition.row, bufferPosition.column + 1]]);
      insertParameterList = characterAfterPrefix === '(' ? false : true;
      suggestions = this.findSuggestionsForPrefix(className, elements[elements.length - 1].trim(), (function(_this) {
        return function(element) {
          var ref;
          if (mustBeStatic && !element.isStatic) {
            return false;
          }
          if (element.isPrivate && element.declaringClass.name !== currentClass) {
            return false;
          }
          if (element.isProtected && element.declaringClass.name !== currentClass && (ref = element.declaringClass.name, indexOf.call(currentClassParents, ref) < 0)) {
            return false;
          }
          if (!element.isMethod && !element.isProperty && !mustBeStatic) {
            return false;
          }
          return true;
        };
      })(this), insertParameterList);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };


    /**
     * Returns suggestions available matching the given prefix
     * @param {string}   className           The name of the class to show members of.
     * @param {string}   prefix              Prefix to match (may be left empty to list all members).
     * @param {callback} filterCallback      A callback that should return true if the item should be added to the
     *                                       suggestions list.
     * @param {bool}     insertParameterList Whether to insert a list of parameters for methods.
     * @return array
     */

    MemberProvider.prototype.findSuggestionsForPrefix = function(className, prefix, filterCallback, insertParameterList) {
      var displayText, ele, element, i, j, len, len1, methods, ref, returnValue, returnValueParts, snippet, suggestions, type, word, words;
      if (insertParameterList == null) {
        insertParameterList = true;
      }
      methods = proxy.methods(className);
      if (!(methods != null ? methods.names : void 0)) {
        return [];
      }
      words = fuzzaldrin.filter(methods.names, prefix);
      suggestions = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        element = methods.values[word];
        if (!(element instanceof Array)) {
          element = [element];
        }
        for (j = 0, len1 = element.length; j < len1; j++) {
          ele = element[j];
          if (filterCallback && !filterCallback(ele)) {
            continue;
          }
          snippet = null;
          displayText = word;
          returnValueParts = ((ref = ele.args["return"]) != null ? ref.type : void 0) ? ele.args["return"].type.split('\\') : [];
          returnValue = returnValueParts[returnValueParts.length - 1];
          if (ele.isMethod) {
            type = 'method';
            snippet = insertParameterList ? this.getFunctionSnippet(word, ele.args) : null;
            displayText = this.getFunctionSignature(word, ele.args);
          } else if (ele.isProperty) {
            type = 'property';
          } else {
            type = 'constant';
          }
          suggestions.push({
            text: word,
            type: type,
            snippet: snippet,
            displayText: displayText,
            leftLabel: returnValue,
            description: ele.args.descriptions.short != null ? ele.args.descriptions.short : '',
            className: ele.args.deprecated ? 'php-atom-autocomplete-strike' : ''
          });
        }
      }
      return suggestions;
    };

    return MemberProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2F1dG9jb21wbGV0aW9uL21lbWJlci1wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7Ozs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUVQLEtBQUEsR0FBUSxPQUFBLENBQVEsOEJBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUjs7RUFDVCxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBR007Ozs7Ozs7NkJBQ0YsT0FBQSxHQUFTOzs7QUFFVDs7Ozs7NkJBSUEsZ0JBQUEsR0FBa0IsU0FBQyxHQUFEO0FBRWQsVUFBQTtNQUZnQixxQkFBUSxxQ0FBZ0IsdUNBQWlCO01BRXpELElBQUMsQ0FBQSxLQUFELEdBQVM7TUFFVCxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CO01BQ1QsSUFBQSxDQUFjLE1BQU0sQ0FBQyxNQUFyQjtBQUFBLGVBQUE7O01BRUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxlQUFQLENBQXVCLE1BQXZCLEVBQStCLGNBQS9CO01BQ1gsSUFBYyxnQkFBZDtBQUFBLGVBQUE7O01BRUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxhQUFQLENBQXFCLE1BQXJCLEVBQTZCLGNBQTdCLEVBQTZDLFFBQTdDO01BQ1osSUFBYyxpQkFBZDtBQUFBLGVBQUE7O01BRUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxLQUFQLENBQWEsU0FBYjtNQUlYLElBQUEsQ0FBQSxDQUFjLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQWhDLENBQUE7QUFBQSxlQUFBOztNQUVBLFlBQUEsR0FBZSxNQUFN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QXJCLENBQTJCLElBQTNCLENBQTlCLEdBQW9FO1VBQ3ZGLFdBQUEsR0FBYyxnQkFBaUIsQ0FBQSxnQkFBZ0IsQ0FBQyxNQUFqQixHQUEwQixDQUExQjtVQUUvQixJQUFHLEdBQUcsQ0FBQyxRQUFQO1lBQ0ksSUFBQSxHQUFPO1lBQ1AsT0FBQSxHQUFhLG1CQUFILEdBQTRCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixHQUFHLENBQUMsSUFBOUIsQ0FBNUIsR0FBcUU7WUFDL0UsV0FBQSxHQUFjLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixJQUF0QixFQUE0QixHQUFHLENBQUMsSUFBaEMsRUFIbEI7V0FBQSxNQUtLLElBQUcsR0FBRyxDQUFDLFVBQVA7WUFDRCxJQUFBLEdBQU8sV0FETjtXQUFBLE1BQUE7WUFJRCxJQUFBLEdBQU8sV0FKTjs7VUFNTCxXQUFXLENBQUMsSUFBWixDQUNJO1lBQUEsSUFBQSxFQUFjLElBQWQ7WUFDQSxJQUFBLEVBQWMsSUFEZDtZQUVBLE9BQUEsRUFBYyxPQUZkO1lBR0EsV0FBQSxFQUFjLFdBSGQ7WUFJQSxTQUFBLEVBQWMsV0FKZDtZQUtBLFdBQUEsRUFBaUIsbUNBQUgsR0FBcUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBM0QsR0FBc0UsRUFMcEY7WUFNQSxTQUFBLEVBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBWixHQUE0Qiw4QkFBNUIsR0FBZ0UsRUFOOUU7V0FESjtBQXJCSjtBQU5KO0FBb0NBLGFBQU87SUFoRGU7Ozs7S0FqRUQ7QUFWN0IiLCJzb3VyY2VzQ29udGVudCI6WyJmdXp6YWxkcmluID0gcmVxdWlyZSAnZnV6emFsZHJpbidcbmV4ZWMgPSByZXF1aXJlIFwiY2hpbGRfcHJvY2Vzc1wiXG5cbnByb3h5ID0gcmVxdWlyZSBcIi4uL3NlcnZpY2VzL3BocC1wcm94eS5jb2ZmZWVcIlxucGFyc2VyID0gcmVxdWlyZSBcIi4uL3NlcnZpY2VzL3BocC1maWxlLXBhcnNlci5jb2ZmZWVcIlxuQWJzdHJhY3RQcm92aWRlciA9IHJlcXVpcmUgXCIuL2Fic3RyYWN0LXByb3ZpZGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4jIEF1dG9jb21wbGV0aW9uIGZvciBtZW1iZXJzIG9mIHZhcmlhYmxlcyBzdWNoIGFzIGFmdGVyIC0+LCA6Oi5cbmNsYXNzIE1lbWJlclByb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlclxuICAgIG1ldGhvZHM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogR2V0IHN1Z2dlc3Rpb25zIGZyb20gdGhlIHByb3ZpZGVyIChAc2VlIHByb3ZpZGVyLWFwaSlcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgIyMjXG4gICAgZmV0Y2hTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgICAgICMgQXV0b2NvbXBsZXRpb24gZm9yIGNsYXNzIG1lbWJlcnMsIGkuZS4gYWZ0ZXIgYSA6OiwgLT4sIC4uLlxuICAgICAgICBAcmVnZXggPSAvKD86KD86W2EtekEtWjAtOV9dKilcXHMqKD86XFwoLipcXCkpP1xccyooPzotPnw6OilcXHMqKSsoW2EtekEtWjAtOV9dKikvZ1xuXG4gICAgICAgIHByZWZpeCA9IEBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwcmVmaXgubGVuZ3RoXG5cbiAgICAgICAgZWxlbWVudHMgPSBwYXJzZXIuZ2V0U3RhY2tDbGFzc2VzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgIHJldHVybiB1bmxlc3MgZWxlbWVudHM/XG5cbiAgICAgICAgY2xhc3NOYW1lID0gcGFyc2VyLnBhcnNlRWxlbWVudHMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgZWxlbWVudHMpXG4gICAgICAgIHJldHVybiB1bmxlc3MgY2xhc3NOYW1lP1xuXG4gICAgICAgIGVsZW1lbnRzID0gcHJlZml4LnNwbGl0KC8oLT58OjopLylcblxuICAgICAgICAjIFdlIG9ubHkgYXV0b2NvbXBsZXRlIGFmdGVyIHNwbGl0dGVycywgc28gdGhlcmUgbXVzdCBiZSBhdCBsZWFzdCBvbmUgd29yZCwgb25lIHNwbGl0dGVyLCBhbmQgYW5vdGhlciB3b3JkXG4gICAgICAgICMgKHRoZSBsYXR0ZXIgd2hpY2ggY291bGQgYmUgZW1wdHkpLlxuICAgICAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnRzLmxlbmd0aCA+IDJcblxuICAgICAgICBjdXJyZW50Q2xhc3MgPSBwYXJzZXIuZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IpXG4gICAgICAgIGN1cnJlbnRDbGFzc1BhcmVudHMgPSBbXVxuXG4gICAgICAgIGlmIGN1cnJlbnRDbGFzc1xuICAgICAgICAgICAgY2xhc3NJbmZvID0gcHJveHkubWV0aG9kcyhjdXJyZW50Q2xhc3MpXG4gICAgICAgICAgICBjdXJyZW50Q2xhc3NQYXJlbnRzID0gaWYgY2xhc3NJbmZvPy5wYXJlbnRzIHRoZW4gY2xhc3NJbmZvPy5wYXJlbnRzIGVsc2UgW11cblxuICAgICAgICBtdXN0QmVTdGF0aWMgPSBmYWxzZVxuXG4gICAgICAgIGlmIGVsZW1lbnRzW2VsZW1lbnRzLmxlbmd0aCAtIDJdID09ICc6OicgYW5kIGVsZW1lbnRzW2VsZW1lbnRzLmxlbmd0aCAtIDNdLnRyaW0oKSAhPSAncGFyZW50J1xuICAgICAgICAgICAgbXVzdEJlU3RhdGljID0gdHJ1ZVxuXG4gICAgICAgIGNoYXJhY3RlckFmdGVyUHJlZml4ID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtidWZmZXJQb3NpdGlvbiwgW2J1ZmZlclBvc2l0aW9uLnJvdywgYnVmZmVyUG9zaXRpb24uY29sdW1uICsgMV1dKVxuICAgICAgICBpbnNlcnRQYXJhbWV0ZXJMaXN0ID0gaWYgY2hhcmFjdGVyQWZ0ZXJQcmVmaXggPT0gJygnIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zRm9yUHJlZml4KGNsYXNzTmFtZSwgZWxlbWVudHNbZWxlbWVudHMubGVuZ3RoLTFdLnRyaW0oKSwgKGVsZW1lbnQpID0+XG4gICAgICAgICAgICAjIFNlZSBhbHNvIHRpY2tldCAjMTI3LlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlIGlmIG11c3RCZVN0YXRpYyBhbmQgbm90IGVsZW1lbnQuaXNTdGF0aWNcbiAgICAgICAgICAgIHJldHVybiBmYWxzZSBpZiBlbGVtZW50LmlzUHJpdmF0ZSBhbmQgZWxlbWVudC5kZWNsYXJpbmdDbGFzcy5uYW1lICE9IGN1cnJlbnRDbGFzc1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQuaXNQcm90ZWN0ZWQgYW5kIGVsZW1lbnQuZGVjbGFyaW5nQ2xhc3MubmFtZSAhPSBjdXJyZW50Q2xhc3MgYW5kIGVsZW1lbnQuZGVjbGFyaW5nQ2xhc3MubmFtZSBub3QgaW4gY3VycmVudENsYXNzUGFyZW50c1xuXG4gICAgICAgICAgICAjIENvbnN0YW50cyBhcmUgb25seSBhdmFpbGFibGUgd2hlbiBzdGF0aWNhbGx5IGFjY2Vzc2VkLlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBlbGVtZW50LmlzTWV0aG9kIGFuZCBub3QgZWxlbWVudC5pc1Byb3BlcnR5IGFuZCBub3QgbXVzdEJlU3RhdGljXG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICwgaW5zZXJ0UGFyYW1ldGVyTGlzdClcblxuICAgICAgICByZXR1cm4gdW5sZXNzIHN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgICMjIypcbiAgICAgKiBSZXR1cm5zIHN1Z2dlc3Rpb25zIGF2YWlsYWJsZSBtYXRjaGluZyB0aGUgZ2l2ZW4gcHJlZml4XG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgY2xhc3NOYW1lICAgICAgICAgICBUaGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gc2hvdyBtZW1iZXJzIG9mLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgIHByZWZpeCAgICAgICAgICAgICAgUHJlZml4IHRvIG1hdGNoIChtYXkgYmUgbGVmdCBlbXB0eSB0byBsaXN0IGFsbCBtZW1iZXJzKS5cbiAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBmaWx0ZXJDYWxsYmFjayAgICAgIEEgY2FsbGJhY2sgdGhhdCBzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhlIGl0ZW0gc2hvdWxkIGJlIGFkZGVkIHRvIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMgbGlzdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2x9ICAgICBpbnNlcnRQYXJhbWV0ZXJMaXN0IFdoZXRoZXIgdG8gaW5zZXJ0IGEgbGlzdCBvZiBwYXJhbWV0ZXJzIGZvciBtZXRob2RzLlxuICAgICAqIEByZXR1cm4gYXJyYXlcbiAgICAjIyNcbiAgICBmaW5kU3VnZ2VzdGlvbnNGb3JQcmVmaXg6IChjbGFzc05hbWUsIHByZWZpeCwgZmlsdGVyQ2FsbGJhY2ssIGluc2VydFBhcmFtZXRlckxpc3QgPSB0cnVlKSAtPlxuICAgICAgICBtZXRob2RzID0gcHJveHkubWV0aG9kcyhjbGFzc05hbWUpXG5cbiAgICAgICAgaWYgbm90IG1ldGhvZHM/Lm5hbWVzXG4gICAgICAgICAgICByZXR1cm4gW11cblxuICAgICAgICAjIEZpbHRlciB0aGUgd29yZHMgdXNpbmcgZnV6emFsZHJpblxuICAgICAgICB3b3JkcyA9IGZ1enphbGRyaW4uZmlsdGVyKG1ldGhvZHMubmFtZXMsIHByZWZpeClcblxuICAgICAgICAjIEJ1aWxkcyBzdWdnZXN0aW9ucyBmb3IgdGhlIHdvcmRzXG4gICAgICAgIHN1Z2dlc3Rpb25zID0gW11cblxuICAgICAgICBmb3Igd29yZCBpbiB3b3Jkc1xuICAgICAgICAgICAgZWxlbWVudCA9IG1ldGhvZHMudmFsdWVzW3dvcmRdXG5cbiAgICAgICAgICAgIGlmIGVsZW1lbnQgbm90IGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gW2VsZW1lbnRdXG5cbiAgICAgICAgICAgIGZvciBlbGUgaW4gZWxlbWVudFxuICAgICAgICAgICAgICAgIGlmIGZpbHRlckNhbGxiYWNrIGFuZCBub3QgZmlsdGVyQ2FsbGJhY2soZWxlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICAgICAgIyBFbnN1cmUgd2UgZG9uJ3QgZ2V0IHZlcnkgbG9uZyByZXR1cm4gdHlwZXMgYnkganVzdCBzaG93aW5nIHRoZSBsYXN0IHBhcnQuXG4gICAgICAgICAgICAgICAgc25pcHBldCA9IG51bGxcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dCA9IHdvcmRcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZVBhcnRzID0gaWYgZWxlLmFyZ3MucmV0dXJuPy50eXBlIHRoZW4gZWxlLmFyZ3MucmV0dXJuLnR5cGUuc3BsaXQoJ1xcXFwnKSBlbHNlIFtdXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSByZXR1cm5WYWx1ZVBhcnRzW3JldHVyblZhbHVlUGFydHMubGVuZ3RoIC0gMV1cblxuICAgICAgICAgICAgICAgIGlmIGVsZS5pc01ldGhvZFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ21ldGhvZCdcbiAgICAgICAgICAgICAgICAgICAgc25pcHBldCA9IGlmIGluc2VydFBhcmFtZXRlckxpc3QgdGhlbiBAZ2V0RnVuY3Rpb25TbmlwcGV0KHdvcmQsIGVsZS5hcmdzKSBlbHNlIG51bGxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQgPSBAZ2V0RnVuY3Rpb25TaWduYXR1cmUod29yZCwgZWxlLmFyZ3MpXG5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVsZS5pc1Byb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAncHJvcGVydHknXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnY29uc3RhbnQnXG5cbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgICAgICAgICAgIHRleHQgICAgICAgIDogd29yZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgICAgICAgOiB0eXBlXG4gICAgICAgICAgICAgICAgICAgIHNuaXBwZXQgICAgIDogc25pcHBldFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dCA6IGRpc3BsYXlUZXh0XG4gICAgICAgICAgICAgICAgICAgIGxlZnRMYWJlbCAgIDogcmV0dXJuVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gOiBpZiBlbGUuYXJncy5kZXNjcmlwdGlvbnMuc2hvcnQ/IHRoZW4gZWxlLmFyZ3MuZGVzY3JpcHRpb25zLnNob3J0IGVsc2UgJydcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lICAgOiBpZiBlbGUuYXJncy5kZXByZWNhdGVkIHRoZW4gJ3BocC1hdG9tLWF1dG9jb21wbGV0ZS1zdHJpa2UnIGVsc2UgJydcblxuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiJdfQ==
