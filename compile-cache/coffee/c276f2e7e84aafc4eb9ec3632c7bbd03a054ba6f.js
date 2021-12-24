(function() {
  var cssDocsURL, firstCharsEqual, firstInlinePropertyNameWithColonPattern, fs, hasScope, importantPrefixPattern, inlinePropertyNameWithColonPattern, lineEndsWithSemicolon, makeSnippet, path, pesudoSelectorPrefixPattern, propertyNamePrefixPattern, propertyNameWithColonPattern, tagSelectorPrefixPattern;

  fs = require('fs');

  path = require('path');

  firstInlinePropertyNameWithColonPattern = /{\s*(\S+)\s*:/;

  inlinePropertyNameWithColonPattern = /(?:;.+?)*;\s*(\S+)\s*:/;

  propertyNameWithColonPattern = /^\s*(\S+)\s*:/;

  propertyNamePrefixPattern = /[a-zA-Z]+[-a-zA-Z]*$/;

  pesudoSelectorPrefixPattern = /:(:)?([a-z]+[a-z-]*)?$/;

  tagSelectorPrefixPattern = /(^|\s|,)([a-z]+)?$/;

  importantPrefixPattern = /(![a-z]+)$/;

  cssDocsURL = "https://developer.mozilla.org/en-US/docs/Web/CSS";

  module.exports = {
    selector: '.source.inside-js.css.styled, .source.css.styled',
    disableForSelector: ".source.inside-js.css.styled .comment, .source.inside-js.css.styled .string, .source.inside-js.css.styled .entity.quasi.element.js, .source.css.styled .comment, .source.css.styled .string, .source.css.styled .entity.quasi.element.js",
    filterSuggestions: true,
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    suggestionPriority: 90,
    getSuggestions: function(request) {
      var completions, scopes;
      completions = null;
      scopes = request.scopeDescriptor.getScopesArray();
      if (this.isCompletingValue(request)) {
        completions = this.getPropertyValueCompletions(request);
      } else if (this.isCompletingPseudoSelector(request)) {
        completions = this.getPseudoSelectorCompletions(request);
      } else {
        if (this.isCompletingName(request)) {
          completions = this.getPropertyNameCompletions(request);
        } else if (this.isCompletingNameOrTag(request)) {
          completions = this.getPropertyNameCompletions(request).concat(this.getTagCompletions(request));
        }
      }
      return completions;
    },
    onDidInsertSuggestion: function(arg) {
      var editor, suggestion;
      editor = arg.editor, suggestion = arg.suggestion;
      if (suggestion.type === 'property') {
        return setTimeout(this.triggerAutocomplete.bind(this, editor), 1);
      }
    },
    triggerAutocomplete: function(editor) {
      return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', {
        activatedManually: false
      });
    },
    loadProperties: function() {
      this.properties = {};
      return fs.readFile(path.resolve(__dirname, 'completions.json'), (function(_this) {
        return function(error, content) {
          var ref;
          if (error == null) {
            ref = JSON.parse(content), _this.pseudoSelectors = ref.pseudoSelectors, _this.properties = ref.properties, _this.tags = ref.tags;
          }
        };
      })(this));
    },
    isCompletingValue: function(arg) {
      var beforePrefixBufferPosition, beforePrefixScopes, beforePrefixScopesArray, bufferPosition, editor, prefix, scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor, bufferPosition = arg.bufferPosition, prefix = arg.prefix, editor = arg.editor;
      scopes = scopeDescriptor.getScopesArray();
      beforePrefixBufferPosition = [bufferPosition.row, Math.max(0, bufferPosition.column - prefix.length - 1)];
      beforePrefixScopes = editor.scopeDescriptorForBufferPosition(beforePrefixBufferPosition);
      beforePrefixScopesArray = beforePrefixScopes.getScopesArray();
      return (hasScope(scopes, 'meta.property-values.css')) || (hasScope(beforePrefixScopesArray, 'meta.property-values.css'));
    },
    isCompletingName: function(arg) {
      var bufferPosition, editor, prefix, scope, scopeDescriptor;
      scopeDescriptor = arg.scopeDescriptor, bufferPosition = arg.bufferPosition, editor = arg.editor;
      scope = scopeDescriptor.getScopesArray().slice(-1);
      prefix = this.getPropertyNamePrefix(bufferPosition, editor);
      return this.isPropertyNamePrefix(prefix) && (scope[0] === 'meta.property-list.css');
    },
    isCompletingNameOrTag: function(arg) {
      var bufferPosition, editor, prefix, scope, scopeDescriptor;
      scopeDescriptor = arg.scopeDescriptor, bufferPosition = arg.bufferPosition, editor = arg.editor;
      scope = scopeDescriptor.getScopesArray().slice(-1);
      prefix = this.getPropertyNamePrefix(bufferPosition, editor);
      return this.isPropertyNamePrefix(prefix) && ((scope[0] === 'meta.property-list.css') || (scope[0] === 'source.css.styled') || (scope[0] === 'entity.name.tag.css') || (scope[0] === 'source.inside-js.css.styled'));
    },
    isCompletingPseudoSelector: function(arg) {
      var bufferPosition, editor, scope, scopeDescriptor;
      editor = arg.editor, scopeDescriptor = arg.scopeDescriptor, bufferPosition = arg.bufferPosition;
      scope = scopeDescriptor.getScopesArray().slice(-1);
      return (scope[0] === 'constant.language.pseudo.prefixed.css') || (scope[0] === 'keyword.operator.pseudo.css');
    },
    isPropertyValuePrefix: function(prefix) {
      prefix = prefix.trim();
      return prefix.length > 0 && prefix !== ':';
    },
    isPropertyNamePrefix: function(prefix) {
      if (prefix == null) {
        return false;
      }
      prefix = prefix.trim();
      return prefix.match(/^[a-zA-Z-]+$/);
    },
    getImportantPrefix: function(editor, bufferPosition) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return (ref = importantPrefixPattern.exec(line)) != null ? ref[1] : void 0;
    },
    getPreviousPropertyName: function(bufferPosition, editor) {
      var line, propertyName, ref, ref1, ref2, row;
      row = bufferPosition.row;
      while (row >= 0) {
        line = editor.lineTextForBufferRow(row);
        propertyName = (ref = inlinePropertyNameWithColonPattern.exec(line)) != null ? ref[1] : void 0;
        if (propertyName == null) {
          propertyName = (ref1 = firstInlinePropertyNameWithColonPattern.exec(line)) != null ? ref1[1] : void 0;
        }
        if (propertyName == null) {
          propertyName = (ref2 = propertyNameWithColonPattern.exec(line)) != null ? ref2[1] : void 0;
        }
        if (propertyName) {
          return propertyName;
        }
        row--;
      }
    },
    getPropertyValueCompletions: function(arg) {
      var addSemicolon, bufferPosition, completions, editor, i, importantPrefix, j, len, len1, prefix, property, ref, scopeDescriptor, scopes, value, values;
      bufferPosition = arg.bufferPosition, editor = arg.editor, prefix = arg.prefix, scopeDescriptor = arg.scopeDescriptor;
      property = this.getPreviousPropertyName(bufferPosition, editor);
      values = (ref = this.properties[property]) != null ? ref.values : void 0;
      if (values == null) {
        return null;
      }
      scopes = scopeDescriptor.getScopesArray();
      addSemicolon = !lineEndsWithSemicolon(bufferPosition, editor);
      completions = [];
      if (this.isPropertyValuePrefix(prefix)) {
        for (i = 0, len = values.length; i < len; i++) {
          value = values[i];
          if (firstCharsEqual(value, prefix)) {
            completions.push(this.buildPropertyValueCompletion(value, property, addSemicolon));
          }
        }
      } else {
        for (j = 0, len1 = values.length; j < len1; j++) {
          value = values[j];
          completions.push(this.buildPropertyValueCompletion(value, property, addSemicolon));
        }
      }
      if (importantPrefix = this.getImportantPrefix(editor, bufferPosition)) {
        completions.push({
          type: 'keyword',
          text: '!important',
          displayText: '!important',
          replacementPrefix: importantPrefix,
          description: "Forces this property to override any other declaration of the same property. Use with caution.",
          descriptionMoreURL: cssDocsURL + "/Specificity#The_!important_exception"
        });
      }
      return completions;
    },
    buildPropertyValueCompletion: function(value, propertyName, addSemicolon) {
      var text;
      text = value;
      if (addSemicolon) {
        text += ';';
      }
      text = makeSnippet(text);
      return {
        type: 'value',
        snippet: text,
        displayText: value,
        description: value + " value for the " + propertyName + " property",
        descriptionMoreURL: cssDocsURL + "/" + propertyName + "#Values"
      };
    },
    getPropertyNamePrefix: function(bufferPosition, editor) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return (ref = propertyNamePrefixPattern.exec(line)) != null ? ref[0] : void 0;
    },
    getPropertyNameCompletions: function(arg) {
      var activatedManually, bufferPosition, completions, editor, line, options, prefix, property, ref, scopeDescriptor, scopes;
      bufferPosition = arg.bufferPosition, editor = arg.editor, scopeDescriptor = arg.scopeDescriptor, activatedManually = arg.activatedManually;
      scopes = scopeDescriptor.getScopesArray();
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      prefix = this.getPropertyNamePrefix(bufferPosition, editor);
      if (!(activatedManually || prefix)) {
        return [];
      }
      completions = [];
      ref = this.properties;
      for (property in ref) {
        options = ref[property];
        if (!prefix || firstCharsEqual(property, prefix)) {
          completions.push(this.buildPropertyNameCompletion(property, prefix, options));
        }
      }
      return completions;
    },
    buildPropertyNameCompletion: function(propertyName, prefix, arg) {
      var description;
      description = arg.description;
      return {
        type: 'property',
        text: propertyName + ": ",
        displayText: propertyName,
        replacementPrefix: prefix,
        description: description,
        descriptionMoreURL: cssDocsURL + "/" + propertyName
      };
    },
    getPseudoSelectorPrefix: function(editor, bufferPosition) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return (ref = line.match(pesudoSelectorPrefixPattern)) != null ? ref[0] : void 0;
    },
    getPseudoSelectorCompletions: function(arg) {
      var bufferPosition, completions, editor, options, prefix, pseudoSelector, ref;
      bufferPosition = arg.bufferPosition, editor = arg.editor;
      prefix = this.getPseudoSelectorPrefix(editor, bufferPosition);
      if (!prefix) {
        return null;
      }
      completions = [];
      ref = this.pseudoSelectors;
      for (pseudoSelector in ref) {
        options = ref[pseudoSelector];
        if (firstCharsEqual(pseudoSelector, prefix)) {
          completions.push(this.buildPseudoSelectorCompletion(pseudoSelector, prefix, options));
        }
      }
      return completions;
    },
    buildPseudoSelectorCompletion: function(pseudoSelector, prefix, arg) {
      var argument, completion, description;
      argument = arg.argument, description = arg.description;
      completion = {
        type: 'pseudo-selector',
        replacementPrefix: prefix,
        description: description,
        descriptionMoreURL: cssDocsURL + "/" + pseudoSelector
      };
      if (argument != null) {
        completion.snippet = pseudoSelector + "(${1:" + argument + "})";
      } else {
        completion.text = pseudoSelector;
      }
      return completion;
    },
    getTagSelectorPrefix: function(editor, bufferPosition) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return (ref = tagSelectorPrefixPattern.exec(line)) != null ? ref[2] : void 0;
    },
    getTagCompletions: function(arg) {
      var bufferPosition, completions, editor, i, len, prefix, ref, tag;
      bufferPosition = arg.bufferPosition, editor = arg.editor, prefix = arg.prefix;
      completions = [];
      if (prefix) {
        ref = this.tags;
        for (i = 0, len = ref.length; i < len; i++) {
          tag = ref[i];
          if (firstCharsEqual(tag, prefix)) {
            completions.push(this.buildTagCompletion(tag));
          }
        }
      }
      return completions;
    },
    buildTagCompletion: function(tag) {
      return {
        type: 'tag',
        text: tag,
        description: "Selector for <" + tag + "> elements"
      };
    }
  };

  lineEndsWithSemicolon = function(bufferPosition, editor) {
    var line, row;
    row = bufferPosition.row;
    line = editor.lineTextForBufferRow(row);
    return /;\s*$/.test(line);
  };

  hasScope = function(scopesArray, scope) {
    return scopesArray.indexOf(scope) !== -1;
  };

  firstCharsEqual = function(str1, str2) {
    return str1[0].toLowerCase() === str2[0].toLowerCase();
  };

  makeSnippet = function(text) {
    var snippetNumber;
    snippetNumber = 0;
    while (text.includes('()')) {
      text = text.replace('()', "($" + (++snippetNumber) + ")");
    }
    text = text + ("$" + (++snippetNumber));
    return text;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWNvbXBsZXRlLXN0eWxlZC1jb21wb25lbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCx1Q0FBQSxHQUEwQzs7RUFDMUMsa0NBQUEsR0FBcUM7O0VBQ3JDLDRCQUFBLEdBQStCOztFQUMvQix5QkFBQSxHQUE0Qjs7RUFDNUIsMkJBQUEsR0FBOEI7O0VBQzlCLHdCQUFBLEdBQTJCOztFQUMzQixzQkFBQSxHQUF5Qjs7RUFDekIsVUFBQSxHQUFhOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsa0RBQVY7SUFDQSxrQkFBQSxFQUFvQiwwT0FEcEI7SUFHQSxpQkFBQSxFQUFtQixJQUhuQjtJQUlBLGlCQUFBLEVBQW1CLEtBSm5CO0lBS0Esb0JBQUEsRUFBc0IsS0FMdEI7SUFNQSxrQkFBQSxFQUFvQixFQU5wQjtJQVFBLGNBQUEsRUFBZ0IsU0FBQyxPQUFEO0FBQ2QsVUFBQTtNQUFBLFdBQUEsR0FBYztNQUNkLE1BQUEsR0FBUyxPQUFPLENBQUMsZUFBZSxDQUFDLGNBQXhCLENBQUE7TUFFVCxJQUFHLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixPQUFuQixDQUFIO1FBQ0UsV0FBQSxHQUFjLElBQUMsQ0FBQSwyQkFBRCxDQUE2QixPQUE3QixFQURoQjtPQUFBLE1BRUssSUFBRyxJQUFDLENBQUEsMEJBQUQsQ0FBNEIsT0FBNUIsQ0FBSDtRQUNILFdBQUEsR0FBYyxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsT0FBOUIsRUFEWDtPQUFBLE1BQUE7UUFHSCxJQUFHLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixDQUFI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cyBjb2RlIHdhcyBiYXNlZCB1cG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F1dG9jb21wbGV0ZS1jc3MgYnV0IGhhcyBiZWVuIG1vZGlmaWVkIHRvIGFsbG93IGl0IHRvIGJlIHVzZWRcbiMgZm9yIHN0eWxlZC1jb21wb25lbmV0cy4gVGhlIGNvbXBsZXRpb25zLmpzb24gZmlsZSB1c2VkIHRvIGF1dG8gY29tcGxldGUgaXMgYSBjb3B5IG9mIHRoZSBvbmUgdXNlZCBieSB0aGUgYXRvbVxuIyBwYWNrYWdlLiBUaGF0IHBhY2thZ2UsIHByb3ZpZGVkIGFzIGFuIEF0b20gYmFzZSBwYWNrYWdlLCBoYXMgdG9vbHMgdG8gdXBkYXRlIHRoZSBjb21wbGV0aW9ucy5qc29uIGZpbGUgZnJvbSB0aGUgd2ViLlxuIyBTZWUgdGhhdCBwYWNrYWdlIGZvciBtb3JlIGluZm8gYW5kIGp1c3QgY29weSB0aGUgY29tcGxldGlvbnMuanNvbiB0byB0aGlzIGZpbGVzIGRpcmVjdG9yeSB3aGVuIGEgcmVmcmVzaCBpcyBuZWVkZWQuXG5cbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuZmlyc3RJbmxpbmVQcm9wZXJ0eU5hbWVXaXRoQ29sb25QYXR0ZXJuID0gL3tcXHMqKFxcUyspXFxzKjovICMgLmV4YW1wbGUgeyBkaXNwbGF5OiB9XG5pbmxpbmVQcm9wZXJ0eU5hbWVXaXRoQ29sb25QYXR0ZXJuID0gLyg/OjsuKz8pKjtcXHMqKFxcUyspXFxzKjovICMgLmV4YW1wbGUgeyBkaXNwbGF5OiBibG9jazsgZmxvYXQ6IGxlZnQ7IGNvbG9yOiB9IChtYXRjaCB0aGUgbGFzdCBvbmUpXG5wcm9wZXJ0eU5hbWVXaXRoQ29sb25QYXR0ZXJuID0gL15cXHMqKFxcUyspXFxzKjovICMgZGlzcGxheTpcbnByb3BlcnR5TmFtZVByZWZpeFBhdHRlcm4gPSAvW2EtekEtWl0rWy1hLXpBLVpdKiQvXG5wZXN1ZG9TZWxlY3RvclByZWZpeFBhdHRlcm4gPSAvOig6KT8oW2Etel0rW2Etei1dKik/JC9cbnRhZ1NlbGVjdG9yUHJlZml4UGF0dGVybiA9IC8oXnxcXHN8LCkoW2Etel0rKT8kL1xuaW1wb3J0YW50UHJlZml4UGF0dGVybiA9IC8oIVthLXpdKykkL1xuY3NzRG9jc1VSTCA9IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZWxlY3RvcjogJy5zb3VyY2UuaW5zaWRlLWpzLmNzcy5zdHlsZWQsIC5zb3VyY2UuY3NzLnN0eWxlZCdcbiAgZGlzYWJsZUZvclNlbGVjdG9yOiBcIi5zb3VyY2UuaW5zaWRlLWpzLmNzcy5zdHlsZWQgLmNvbW1lbnQsIC5zb3VyY2UuaW5zaWRlLWpzLmNzcy5zdHlsZWQgLnN0cmluZywgLnNvdXJjZS5pbnNpZGUtanMuY3NzLnN0eWxlZCAuZW50aXR5LnF1YXNpLmVsZW1lbnQuanMsIC5zb3VyY2UuY3NzLnN0eWxlZCAuY29tbWVudCwgLnNvdXJjZS5jc3Muc3R5bGVkIC5zdHJpbmcsIC5zb3VyY2UuY3NzLnN0eWxlZCAuZW50aXR5LnF1YXNpLmVsZW1lbnQuanNcIlxuXG4gIGZpbHRlclN1Z2dlc3Rpb25zOiB0cnVlXG4gIGluY2x1c2lvblByaW9yaXR5OiAxMDAwMFxuICBleGNsdWRlTG93ZXJQcmlvcml0eTogZmFsc2VcbiAgc3VnZ2VzdGlvblByaW9yaXR5OiA5MFxuXG4gIGdldFN1Z2dlc3Rpb25zOiAocmVxdWVzdCkgLT5cbiAgICBjb21wbGV0aW9ucyA9IG51bGxcbiAgICBzY29wZXMgPSByZXF1ZXN0LnNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG5cbiAgICBpZiBAaXNDb21wbGV0aW5nVmFsdWUocmVxdWVzdClcbiAgICAgIGNvbXBsZXRpb25zID0gQGdldFByb3BlcnR5VmFsdWVDb21wbGV0aW9ucyhyZXF1ZXN0KVxuICAgIGVsc2UgaWYgQGlzQ29tcGxldGluZ1BzZXVkb1NlbGVjdG9yKHJlcXVlc3QpXG4gICAgICBjb21wbGV0aW9ucyA9IEBnZXRQc2V1ZG9TZWxlY3RvckNvbXBsZXRpb25zKHJlcXVlc3QpXG4gICAgZWxzZVxuICAgICAgaWYgQGlzQ29tcGxldGluZ05hbWUocmVxdWVzdClcbiAgICAgICAgY29tcGxldGlvbnMgPSBAZ2V0UHJvcGVydHlOYW1lQ29tcGxldGlvbnMocmVxdWVzdClcbiAgICAgIGVsc2UgaWYgQGlzQ29tcGxldGluZ05hbWVPclRhZyhyZXF1ZXN0KVxuICAgICAgICBjb21wbGV0aW9ucyA9IEBnZXRQcm9wZXJ0eU5hbWVDb21wbGV0aW9ucyhyZXF1ZXN0KVxuICAgICAgICAgIC5jb25jYXQoQGdldFRhZ0NvbXBsZXRpb25zKHJlcXVlc3QpKVxuXG4gICAgcmV0dXJuIGNvbXBsZXRpb25zXG5cbiAgb25EaWRJbnNlcnRTdWdnZXN0aW9uOiAoe2VkaXRvciwgc3VnZ2VzdGlvbn0pIC0+XG4gICAgc2V0VGltZW91dChAdHJpZ2dlckF1dG9jb21wbGV0ZS5iaW5kKHRoaXMsIGVkaXRvciksIDEpIGlmIHN1Z2dlc3Rpb24udHlwZSBpcyAncHJvcGVydHknXG5cbiAgdHJpZ2dlckF1dG9jb21wbGV0ZTogKGVkaXRvcikgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnYXV0b2NvbXBsZXRlLXBsdXM6YWN0aXZhdGUnLCB7YWN0aXZhdGVkTWFudWFsbHk6IGZhbHNlfSlcblxuICBsb2FkUHJvcGVydGllczogLT5cbiAgICBAcHJvcGVydGllcyA9IHt9XG4gICAgZnMucmVhZEZpbGUgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2NvbXBsZXRpb25zLmpzb24nKSwgKGVycm9yLCBjb250ZW50KSA9PlxuICAgICAge0Bwc2V1ZG9TZWxlY3RvcnMsIEBwcm9wZXJ0aWVzLCBAdGFnc30gPSBKU09OLnBhcnNlKGNvbnRlbnQpIHVubGVzcyBlcnJvcj9cblxuICAgICAgcmV0dXJuXG5cbiAgaXNDb21wbGV0aW5nVmFsdWU6ICh7c2NvcGVEZXNjcmlwdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4LCBlZGl0b3J9KSAtPlxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG5cbiAgICBiZWZvcmVQcmVmaXhCdWZmZXJQb3NpdGlvbiA9IFtidWZmZXJQb3NpdGlvbi5yb3csIE1hdGgubWF4KDAsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiAtIHByZWZpeC5sZW5ndGggLSAxKV1cbiAgICBiZWZvcmVQcmVmaXhTY29wZXMgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oYmVmb3JlUHJlZml4QnVmZmVyUG9zaXRpb24pXG4gICAgYmVmb3JlUHJlZml4U2NvcGVzQXJyYXkgPSBiZWZvcmVQcmVmaXhTY29wZXMuZ2V0U2NvcGVzQXJyYXkoKVxuXG4gICAgcmV0dXJuIChoYXNTY29wZShzY29wZXMsICdtZXRhLnByb3BlcnR5LXZhbHVlcy5jc3MnKSkgb3JcbiAgICAgIChoYXNTY29wZShiZWZvcmVQcmVmaXhTY29wZXNBcnJheSAsICdtZXRhLnByb3BlcnR5LXZhbHVlcy5jc3MnKSlcblxuICBpc0NvbXBsZXRpbmdOYW1lOiAoe3Njb3BlRGVzY3JpcHRvciwgYnVmZmVyUG9zaXRpb24sIGVkaXRvcn0pIC0+XG4gICAgc2NvcGUgPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKS5zbGljZSgtMSlcbiAgICBwcmVmaXggPSBAZ2V0UHJvcGVydHlOYW1lUHJlZml4KGJ1ZmZlclBvc2l0aW9uLCBlZGl0b3IpXG4gICAgcmV0dXJuIEBpc1Byb3BlcnR5TmFtZVByZWZpeChwcmVmaXgpIGFuZCAoc2NvcGVbMF0gaXMgJ21ldGEucHJvcGVydHktbGlzdC5jc3MnKVxuXG4gIGlzQ29tcGxldGluZ05hbWVPclRhZzogKHtzY29wZURlc2NyaXB0b3IsIGJ1ZmZlclBvc2l0aW9uLCBlZGl0b3J9KSAtPlxuICAgIHNjb3BlID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCkuc2xpY2UoLTEpXG4gICAgcHJlZml4ID0gQGdldFByb3BlcnR5TmFtZVByZWZpeChidWZmZXJQb3NpdGlvbiwgZWRpdG9yKVxuICAgIHJldHVybiBAaXNQcm9wZXJ0eU5hbWVQcmVmaXgocHJlZml4KSBhbmRcbiAgICAgKChzY29wZVswXSBpcyAnbWV0YS5wcm9wZXJ0eS1saXN0LmNzcycpIG9yXG4gICAgICAoc2NvcGVbMF0gaXMgJ3NvdXJjZS5jc3Muc3R5bGVkJykgb3JcbiAgICAgIChzY29wZVswXSBpcyAnZW50aXR5Lm5hbWUudGFnLmNzcycpIG9yXG4gICAgICAoc2NvcGVbMF0gaXMgJ3NvdXJjZS5pbnNpZGUtanMuY3NzLnN0eWxlZCcpKVxuXG4gIGlzQ29tcGxldGluZ1BzZXVkb1NlbGVjdG9yOiAoe2VkaXRvciwgc2NvcGVEZXNjcmlwdG9yLCBidWZmZXJQb3NpdGlvbn0pIC0+XG4gICAgc2NvcGUgPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKS5zbGljZSgtMSlcbiAgICByZXR1cm4gKCAoIHNjb3BlWzBdIGlzICdjb25zdGFudC5sYW5ndWFnZS5wc2V1ZG8ucHJlZml4ZWQuY3NzJykgb3JcbiAgICAgICggc2NvcGVbMF0gaXMgJ2tleXdvcmQub3BlcmF0b3IucHNldWRvLmNzcycpIClcblxuICBpc1Byb3BlcnR5VmFsdWVQcmVmaXg6IChwcmVmaXgpIC0+XG4gICAgcHJlZml4ID0gcHJlZml4LnRyaW0oKVxuICAgIHByZWZpeC5sZW5ndGggPiAwIGFuZCBwcmVmaXggaXNudCAnOidcblxuICBpc1Byb3BlcnR5TmFtZVByZWZpeDogKHByZWZpeCkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHByZWZpeD9cbiAgICBwcmVmaXggPSBwcmVmaXgudHJpbSgpXG4gICAgcHJlZml4Lm1hdGNoKC9eW2EtekEtWi1dKyQvKVxuXG4gIGdldEltcG9ydGFudFByZWZpeDogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICBpbXBvcnRhbnRQcmVmaXhQYXR0ZXJuLmV4ZWMobGluZSk/WzFdXG5cbiAgZ2V0UHJldmlvdXNQcm9wZXJ0eU5hbWU6IChidWZmZXJQb3NpdGlvbiwgZWRpdG9yKSAtPlxuICAgIHtyb3d9ID0gYnVmZmVyUG9zaXRpb25cbiAgICB3aGlsZSByb3cgPj0gMFxuICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICBwcm9wZXJ0eU5hbWUgPSBpbmxpbmVQcm9wZXJ0eU5hbWVXaXRoQ29sb25QYXR0ZXJuLmV4ZWMobGluZSk/WzFdXG4gICAgICBwcm9wZXJ0eU5hbWUgPz0gZmlyc3RJbmxpbmVQcm9wZXJ0eU5hbWVXaXRoQ29sb25QYXR0ZXJuLmV4ZWMobGluZSk/WzFdXG4gICAgICBwcm9wZXJ0eU5hbWUgPz0gcHJvcGVydHlOYW1lV2l0aENvbG9uUGF0dGVybi5leGVjKGxpbmUpP1sxXVxuICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZSBpZiBwcm9wZXJ0eU5hbWVcbiAgICAgIHJvdy0tXG4gICAgcmV0dXJuXG5cbiAgZ2V0UHJvcGVydHlWYWx1ZUNvbXBsZXRpb25zOiAoe2J1ZmZlclBvc2l0aW9uLCBlZGl0b3IsIHByZWZpeCwgc2NvcGVEZXNjcmlwdG9yfSkgLT5cbiAgICBwcm9wZXJ0eSA9IEBnZXRQcmV2aW91c1Byb3BlcnR5TmFtZShidWZmZXJQb3NpdGlvbiwgZWRpdG9yKVxuICAgIHZhbHVlcyA9IEBwcm9wZXJ0aWVzW3Byb3BlcnR5XT8udmFsdWVzXG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHZhbHVlcz9cblxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgYWRkU2VtaWNvbG9uID0gbm90IGxpbmVFbmRzV2l0aFNlbWljb2xvbihidWZmZXJQb3NpdGlvbiwgZWRpdG9yKVxuXG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGlmIEBpc1Byb3BlcnR5VmFsdWVQcmVmaXgocHJlZml4KVxuICAgICAgZm9yIHZhbHVlIGluIHZhbHVlcyB3aGVuIGZpcnN0Q2hhcnNFcXVhbCh2YWx1ZSwgcHJlZml4KVxuICAgICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZFByb3BlcnR5VmFsdWVDb21wbGV0aW9uKHZhbHVlLCBwcm9wZXJ0eSwgYWRkU2VtaWNvbG9uKSlcbiAgICBlbHNlXG4gICAgICBmb3IgdmFsdWUgaW4gdmFsdWVzXG4gICAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkUHJvcGVydHlWYWx1ZUNvbXBsZXRpb24odmFsdWUsIHByb3BlcnR5LCBhZGRTZW1pY29sb24pKVxuXG4gICAgaWYgaW1wb3J0YW50UHJlZml4ID0gQGdldEltcG9ydGFudFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgY29tcGxldGlvbnMucHVzaFxuICAgICAgICB0eXBlOiAna2V5d29yZCdcbiAgICAgICAgdGV4dDogJyFpbXBvcnRhbnQnXG4gICAgICAgIGRpc3BsYXlUZXh0OiAnIWltcG9ydGFudCdcbiAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IGltcG9ydGFudFByZWZpeFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJGb3JjZXMgdGhpcyBwcm9wZXJ0eSB0byBvdmVycmlkZSBhbnkgb3RoZXIgZGVjbGFyYXRpb24gb2YgdGhlIHNhbWUgcHJvcGVydHkuIFVzZSB3aXRoIGNhdXRpb24uXCJcbiAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBcIiN7Y3NzRG9jc1VSTH0vU3BlY2lmaWNpdHkjVGhlXyFpbXBvcnRhbnRfZXhjZXB0aW9uXCJcblxuICAgIGNvbXBsZXRpb25zXG5cbiAgYnVpbGRQcm9wZXJ0eVZhbHVlQ29tcGxldGlvbjogKHZhbHVlLCBwcm9wZXJ0eU5hbWUsIGFkZFNlbWljb2xvbikgLT5cbiAgICB0ZXh0ID0gdmFsdWVcbiAgICB0ZXh0ICs9ICc7JyBpZiBhZGRTZW1pY29sb25cbiAgICB0ZXh0ID0gbWFrZVNuaXBwZXQodGV4dClcblxuICAgIHtcbiAgICAgIHR5cGU6ICd2YWx1ZSdcbiAgICAgIHNuaXBwZXQ6IHRleHRcbiAgICAgIGRpc3BsYXlUZXh0OiB2YWx1ZVxuICAgICAgZGVzY3JpcHRpb246IFwiI3t2YWx1ZX0gdmFsdWUgZm9yIHRoZSAje3Byb3BlcnR5TmFtZX0gcHJvcGVydHlcIlxuICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBcIiN7Y3NzRG9jc1VSTH0vI3twcm9wZXJ0eU5hbWV9I1ZhbHVlc1wiXG4gICAgfVxuXG4gIGdldFByb3BlcnR5TmFtZVByZWZpeDogKGJ1ZmZlclBvc2l0aW9uLCBlZGl0b3IpIC0+XG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICBwcm9wZXJ0eU5hbWVQcmVmaXhQYXR0ZXJuLmV4ZWMobGluZSk/WzBdXG5cbiAgZ2V0UHJvcGVydHlOYW1lQ29tcGxldGlvbnM6ICh7YnVmZmVyUG9zaXRpb24sIGVkaXRvciwgc2NvcGVEZXNjcmlwdG9yLCBhY3RpdmF0ZWRNYW51YWxseX0pIC0+XG4gICAgc2NvcGVzID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuXG4gICAgcHJlZml4ID0gQGdldFByb3BlcnR5TmFtZVByZWZpeChidWZmZXJQb3NpdGlvbiwgZWRpdG9yKVxuICAgIHJldHVybiBbXSB1bmxlc3MgYWN0aXZhdGVkTWFudWFsbHkgb3IgcHJlZml4XG5cbiAgICBjb21wbGV0aW9ucyA9IFtdXG4gICAgZm9yIHByb3BlcnR5LCBvcHRpb25zIG9mIEBwcm9wZXJ0aWVzIHdoZW4gbm90IHByZWZpeCBvciBmaXJzdENoYXJzRXF1YWwocHJvcGVydHksIHByZWZpeClcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkUHJvcGVydHlOYW1lQ29tcGxldGlvbihwcm9wZXJ0eSwgcHJlZml4LCBvcHRpb25zKSlcbiAgICBjb21wbGV0aW9uc1xuXG4gIGJ1aWxkUHJvcGVydHlOYW1lQ29tcGxldGlvbjogKHByb3BlcnR5TmFtZSwgcHJlZml4LCB7ZGVzY3JpcHRpb259KSAtPlxuICAgIHR5cGU6ICdwcm9wZXJ0eSdcbiAgICB0ZXh0OiBcIiN7cHJvcGVydHlOYW1lfTogXCJcbiAgICBkaXNwbGF5VGV4dDogcHJvcGVydHlOYW1lXG4gICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeFxuICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblxuICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogXCIje2Nzc0RvY3NVUkx9LyN7cHJvcGVydHlOYW1lfVwiXG5cbiAgZ2V0UHNldWRvU2VsZWN0b3JQcmVmaXg6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgbGluZS5tYXRjaChwZXN1ZG9TZWxlY3RvclByZWZpeFBhdHRlcm4pP1swXVxuXG4gIGdldFBzZXVkb1NlbGVjdG9yQ29tcGxldGlvbnM6ICh7YnVmZmVyUG9zaXRpb24sIGVkaXRvcn0pIC0+XG4gICAgcHJlZml4ID0gQGdldFBzZXVkb1NlbGVjdG9yUHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIHByZWZpeFxuXG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGZvciBwc2V1ZG9TZWxlY3Rvciwgb3B0aW9ucyBvZiBAcHNldWRvU2VsZWN0b3JzIHdoZW4gZmlyc3RDaGFyc0VxdWFsKHBzZXVkb1NlbGVjdG9yLCBwcmVmaXgpXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZFBzZXVkb1NlbGVjdG9yQ29tcGxldGlvbihwc2V1ZG9TZWxlY3RvciwgcHJlZml4LCBvcHRpb25zKSlcbiAgICBjb21wbGV0aW9uc1xuXG4gIGJ1aWxkUHNldWRvU2VsZWN0b3JDb21wbGV0aW9uOiAocHNldWRvU2VsZWN0b3IsIHByZWZpeCwge2FyZ3VtZW50LCBkZXNjcmlwdGlvbn0pIC0+XG4gICAgY29tcGxldGlvbiA9XG4gICAgICB0eXBlOiAncHNldWRvLXNlbGVjdG9yJ1xuICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeFxuICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG4gICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6IFwiI3tjc3NEb2NzVVJMfS8je3BzZXVkb1NlbGVjdG9yfVwiXG5cbiAgICBpZiBhcmd1bWVudD9cbiAgICAgIGNvbXBsZXRpb24uc25pcHBldCA9IFwiI3twc2V1ZG9TZWxlY3Rvcn0oJHsxOiN7YXJndW1lbnR9fSlcIlxuICAgIGVsc2VcbiAgICAgIGNvbXBsZXRpb24udGV4dCA9IHBzZXVkb1NlbGVjdG9yXG4gICAgY29tcGxldGlvblxuXG4gIGdldFRhZ1NlbGVjdG9yUHJlZml4OiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuICAgIHRhZ1NlbGVjdG9yUHJlZml4UGF0dGVybi5leGVjKGxpbmUpP1syXVxuXG4gIGdldFRhZ0NvbXBsZXRpb25zOiAoe2J1ZmZlclBvc2l0aW9uLCBlZGl0b3IsIHByZWZpeH0pIC0+XG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGlmIHByZWZpeFxuICAgICAgZm9yIHRhZyBpbiBAdGFncyB3aGVuIGZpcnN0Q2hhcnNFcXVhbCh0YWcsIHByZWZpeClcbiAgICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRUYWdDb21wbGV0aW9uKHRhZykpXG4gICAgY29tcGxldGlvbnNcblxuICBidWlsZFRhZ0NvbXBsZXRpb246ICh0YWcpIC0+XG4gICAgdHlwZTogJ3RhZydcbiAgICB0ZXh0OiB0YWdcbiAgICBkZXNjcmlwdGlvbjogXCJTZWxlY3RvciBmb3IgPCN7dGFnfT4gZWxlbWVudHNcIlxuXG5saW5lRW5kc1dpdGhTZW1pY29sb24gPSAoYnVmZmVyUG9zaXRpb24sIGVkaXRvcikgLT5cbiAge3Jvd30gPSBidWZmZXJQb3NpdGlvblxuICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylcbiAgLztcXHMqJC8udGVzdChsaW5lKVxuXG5oYXNTY29wZSA9IChzY29wZXNBcnJheSwgc2NvcGUpIC0+XG4gIHNjb3Blc0FycmF5LmluZGV4T2Yoc2NvcGUpIGlzbnQgLTFcblxuZmlyc3RDaGFyc0VxdWFsID0gKHN0cjEsIHN0cjIpIC0+XG4gIHN0cjFbMF0udG9Mb3dlckNhc2UoKSBpcyBzdHIyWzBdLnRvTG93ZXJDYXNlKClcblxuIyBsb29rcyBhdCBhIHN0cmluZyBhbmQgcmVwbGFjZXMgY29uc2VjdXRpdmUgKCkgd2l0aCBpbmNyZW1lbnRpbmcgc25pcHBldCBwb3NpdGlvbnMgKCRuKVxuIyBJdCBhbHNvIGFkZHMgYSB0cmFpbGluZyAkbiBhdCBlbmQgb2YgdGV4dFxuIyBlLmcgdHJhbnNsYXRlKCkgYmVjb21lcyB0cmFuc2xhdGUoJDEpJDJcbm1ha2VTbmlwcGV0ID0gKHRleHQpICAtPlxuICBzbmlwcGV0TnVtYmVyID0gMFxuICB3aGlsZSB0ZXh0LmluY2x1ZGVzKCcoKScpXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgnKCknLCBcIigkI3srK3NuaXBwZXROdW1iZXJ9KVwiKVxuICB0ZXh0ID0gdGV4dCArIFwiJCN7KytzbmlwcGV0TnVtYmVyfVwiXG4gIHJldHVybiB0ZXh0XG4iXX0=
