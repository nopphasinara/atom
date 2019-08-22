(function() {
  var CompositeDisposable, Disposable, Module, ProviderManager, ProviderMetadata, Selector, applyEdits, ref, scopeChainForScopeDescriptor, specificity, stableSort,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  Selector = require('selector-kit').Selector;

  specificity = require('clear-cut').specificity;

  ProviderMetadata = require('./provider-metadata');

  stableSort = require('stable');

  Module = (function() {
    function Module() {
      this.formatCode = bind(this.formatCode, this);
    }

    Module.prototype.activate = function() {
      this.providerManager = new ProviderManager;
      this.disposible = new CompositeDisposable;
      this.registerCommands();
    };

    Module.prototype.deactivate = function() {
      this.disposible.dispose();
    };

    Module.prototype.registerCommands = function() {
      return this.disposible.add(atom.commands.add('atom-text-editor', 'formatter:format-code', this.formatCode));
    };

    Module.prototype.formatCode = function() {
      var cursor, editor, edits, newText, provider, providers, scopeDescriptor, selected, selection, text;
      editor = atom.workspace.getActiveTextEditor();
      cursor = editor.getLastCursor();
      if (cursor == null) {
        return;
      }
      selection = editor.getSelectedBufferRange();
      if (!selection.isEmpty()) {
        selection = {
          start: {
            line: selection.start.row,
            col: selection.start.column
          },
          end: {
            line: selection.end.row,
            col: selection.end.column
          }
        };
      } else {
        selection = null;
      }
      scopeDescriptor = cursor.getScopeDescriptor();
      providers = this.providerManager.providersForScopeDescriptor(scopeDescriptor);
      if (!(providers.length > 0)) {
        return;
      }
      provider = providers[0];
      if (provider.getCodeEdits) {
        edits = Promise.resolve(provider.getCodeEdits({
          editor: editor,
          selection: selection
        }));
        return edits.then(function(edits) {
          return applyEdits(editor, edits);
        });
      } else if (provider.getNewText) {
        text = editor.getSelectedText();
        if (!text) {
          selected = false;
          text = editor.getText();
        }
        if (!text) {
          return;
        }
        newText = Promise.resolve(provider.getNewText(text));
        return newText.then(function(newText) {
          if (selected) {
            return editor.replaceSelectedText(newText);
          } else {
            return editor.setText(newText);
          }
        });
      }
    };


    /*
    Section: Services API
     */

    Module.prototype.consumeFormatter = function(providers) {
      var i, len, provider, registrations;
      if ((providers != null) && !Array.isArray(providers)) {
        providers = [providers];
      }
      if (!((providers != null ? providers.length : void 0) > 0)) {
        return;
      }
      registrations = new CompositeDisposable;
      for (i = 0, len = providers.length; i < len; i++) {
        provider = providers[i];
        registrations.add(this.providerManager.registerProvider(provider));
      }
      return registrations;
    };

    return Module;

  })();

  applyEdits = function(editor, edits) {
    return editor.transact(function() {
      var edit, i, len, results;
      results = [];
      for (i = 0, len = edits.length; i < len; i++) {
        edit = edits[i];
        results.push(editor.setTextInBufferRange([[edit.start.line, edit.start.col], [edit.end.line, edit.end.col]], edit.newText));
      }
      return results;
    });
  };

  ProviderManager = (function() {
    function ProviderManager() {
      this.providersForScopeDescriptor = bind(this.providersForScopeDescriptor, this);
      this.providers = [];
    }

    ProviderManager.prototype.registerProvider = function(provider) {
      var providerMetadata;
      if (provider == null) {
        return;
      }
      providerMetadata = new ProviderMetadata(provider);
      this.providers.push(providerMetadata);
      return providerMetadata;
    };

    ProviderManager.prototype.providersForScopeDescriptor = function(scopeDescriptor) {
      var i, len, lowestIncludedPriority, matchingProviders, provider, providerMetadata, ref1, ref2, scopeChain;
      scopeChain = scopeChainForScopeDescriptor(scopeDescriptor);
      if (!scopeChain) {
        return [];
      }
      matchingProviders = [];
      lowestIncludedPriority = 0;
      ref1 = this.providers;
      for (i = 0, len = ref1.length; i < len; i++) {
        providerMetadata = ref1[i];
        provider = providerMetadata.provider;
        if (providerMetadata.matchesScopeChain(scopeChain)) {
          matchingProviders.push(provider);
          if (provider.excludeLowerPriority != null) {
            lowestIncludedPriority = Math.max(lowestIncludedPriority, (ref2 = provider.inclusionPriority) != null ? ref2 : 0);
          }
        }
      }
      matchingProviders = (function() {
        var j, len1, ref3, results;
        results = [];
        for (j = 0, len1 = matchingProviders.length; j < len1; j++) {
          provider = matchingProviders[j];
          if (((ref3 = provider.inclusionPriority) != null ? ref3 : 0) >= lowestIncludedPriority) {
            results.push(provider);
          }
        }
        return results;
      })();
      return stableSort(matchingProviders, (function(_this) {
        return function(providerA, providerB) {
          var difference, ref3, ref4, specificityA, specificityB;
          specificityA = _this.metadataForProvider(providerA).getSpecificity(scopeChain);
          specificityB = _this.metadataForProvider(providerB).getSpecificity(scopeChain);
          difference = specificityB - specificityA;
          if (difference === 0) {
            difference = ((ref3 = providerB.suggestionPriority) != null ? ref3 : 1) - ((ref4 = providerA.suggestionPriority) != null ? ref4 : 1);
          }
          return difference;
        };
      })(this));
    };

    return ProviderManager;

  })();

  scopeChainForScopeDescriptor = function(scopeDescriptor) {
    var json, scopeChain, type;
    type = typeof scopeDescriptor;
    if (type === 'string') {
      return scopeDescriptor;
    } else if (type === 'object' && ((scopeDescriptor != null ? scopeDescriptor.getScopeChain : void 0) != null)) {
      scopeChain = scopeDescriptor.getScopeChain();
      if ((scopeChain != null) && (scopeChain.replace == null)) {
        json = JSON.stringify(scopeDescriptor);
        console.log(scopeDescriptor, json);
        throw new Error("01: ScopeChain is not correct type: " + type + "; " + json);
      }
      return scopeChain;
    } else {
      json = JSON.stringify(scopeDescriptor);
      console.log(scopeDescriptor, json);
      throw new Error("02: ScopeChain is not correct type: " + type + "; " + json);
    }
  };

  module.exports = new Module;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mb3JtYXR0ZXIvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0SkFBQTtJQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUFDWixXQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLGNBQWUsT0FBQSxDQUFRLFdBQVI7O0VBQ2hCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbkIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxRQUFSOztFQUVQOzs7OztxQkFFSixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUk7TUFDdkIsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJO01BQ2xCLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0lBSFE7O3FCQU1WLFVBQUEsR0FBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUE7SUFEVTs7cUJBSVosZ0JBQUEsR0FBa0IsU0FBQTthQUNoQixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyx1QkFBdEMsRUFBK0QsSUFBQyxDQUFBLFVBQWhFLENBQWhCO0lBRGdCOztxQkFHbEIsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsYUFBUCxDQUFBO01BQ1QsSUFBYyxjQUFkO0FBQUEsZUFBQTs7TUFFQSxTQUFBLEdBQVksTUFBTSxDQUFDLHNCQUFQLENBQUE7TUFDWixJQUFHLENBQUMsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFKO1FBQ0UsU0FBQSxHQUNFO1VBQUEsS0FB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Ozs7Ozs7RUF5Qi9CLDRCQUFBLEdBQStCLFNBQUMsZUFBRDtBQUM3QixRQUFBO0lBQUEsSUFBQSxHQUFPLE9BQU87SUFDZCxJQUFHLElBQUEsS0FBUSxRQUFYO2FBQ0UsZ0JBREY7S0FBQSxNQUVLLElBQUcsSUFBQSxLQUFRLFFBQVIsSUFBcUIsNEVBQXhCO01BQ0gsVUFBQSxHQUFhLGVBQWUsQ0FBQyxhQUFoQixDQUFBO01BQ2IsSUFBRyxvQkFBQSxJQUFvQiw0QkFBdkI7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxlQUFmO1FBQ1AsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLElBQTdCO0FBQ0EsY0FBTSxJQUFJLEtBQUosQ0FBVSxzQ0FBQSxHQUF1QyxJQUF2QyxHQUE0QyxJQUE1QyxHQUFnRCxJQUExRCxFQUhSOzthQUlBLFdBTkc7S0FBQSxNQUFBO01BUUgsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsZUFBZjtNQUNQLE9BQU8sQ0FBQyxHQUFSLENBQVksZUFBWixFQUE2QixJQUE3QjtBQUNBLFlBQU0sSUFBSSxLQUFKLENBQVUsc0NBQUEsR0FBdUMsSUFBdkMsR0FBNEMsSUFBNUMsR0FBZ0QsSUFBMUQsRUFWSDs7RUFKd0I7O0VBaUIvQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJO0FBeElyQiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57U2VsZWN0b3J9ID0gcmVxdWlyZSAnc2VsZWN0b3Ita2l0J1xue3NwZWNpZmljaXR5fSA9IHJlcXVpcmUgJ2NsZWFyLWN1dCdcblByb3ZpZGVyTWV0YWRhdGEgPSByZXF1aXJlICcuL3Byb3ZpZGVyLW1ldGFkYXRhJ1xuc3RhYmxlU29ydCA9IHJlcXVpcmUgJ3N0YWJsZSdcblxuY2xhc3MgTW9kdWxlXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQHByb3ZpZGVyTWFuYWdlciA9IG5ldyBQcm92aWRlck1hbmFnZXJcbiAgICBAZGlzcG9zaWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHJlZ2lzdGVyQ29tbWFuZHMoKVxuICAgIHJldHVyblxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2libGUuZGlzcG9zZSgpXG4gICAgcmV0dXJuXG5cbiAgcmVnaXN0ZXJDb21tYW5kczogKCkgLT5cbiAgICBAZGlzcG9zaWJsZS5hZGQgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnZm9ybWF0dGVyOmZvcm1hdC1jb2RlJywgQGZvcm1hdENvZGUpXG5cbiAgZm9ybWF0Q29kZTogPT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgcmV0dXJuIHVubGVzcyBjdXJzb3I/XG5cbiAgICBzZWxlY3Rpb24gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgaWYgIXNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIHNlbGVjdGlvbiA9XG4gICAgICAgIHN0YXJ0OlxuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5zdGFydC5yb3dcbiAgICAgICAgICBjb2w6IHNlbGVjdGlvbi5zdGFydC5jb2x1bW5cbiAgICAgICAgZW5kOlxuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5lbmQucm93XG4gICAgICAgICAgY29sOiBzZWxlY3Rpb24uZW5kLmNvbHVtblxuICAgIGVsc2VcbiAgICAgIHNlbGVjdGlvbiA9IG51bGxcblxuICAgICMjIHJlc29sdmUgcHJvdmlkZXIgYnkgc2NvcGUgZGVzY3JpcHRvclxuICAgIHNjb3BlRGVzY3JpcHRvciA9IGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKVxuICAgIHByb3ZpZGVycyA9IEBwcm92aWRlck1hbmFnZXIucHJvdmlkZXJzRm9yU2NvcGVEZXNjcmlwdG9yKHNjb3BlRGVzY3JpcHRvcilcbiAgICByZXR1cm4gdW5sZXNzIHByb3ZpZGVycy5sZW5ndGggPiAwXG5cbiAgICAjIFdlIG9ubHkgc3VwcG9ydCB0aGUgaGlnaGVzdCBwcmlyb3JpdHkgcHJvdmlkZXIgZm9yIG5vdzpcbiAgICBwcm92aWRlciA9IHByb3ZpZGVyc1swXVxuICAgIGlmIHByb3ZpZGVyLmdldENvZGVFZGl0c1xuICAgICAgZWRpdHMgPSBQcm9taXNlLnJlc29sdmUocHJvdmlkZXIuZ2V0Q29kZUVkaXRzKHtlZGl0b3Isc2VsZWN0aW9ufSkpXG4gICAgICBlZGl0cy50aGVuIChlZGl0cykgLT5cbiAgICAgICAgYXBwbHlFZGl0cyhlZGl0b3IsIGVkaXRzKVxuICAgIGVsc2UgaWYgcHJvdmlkZXIuZ2V0TmV3VGV4dFxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgaWYgIXRleHRcbiAgICAgICAgc2VsZWN0ZWQgPSBmYWxzZVxuICAgICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgIHJldHVybiBpZiAhdGV4dFxuICAgICAgbmV3VGV4dCA9IFByb21pc2UucmVzb2x2ZShwcm92aWRlci5nZXROZXdUZXh0KHRleHQpKVxuICAgICAgbmV3VGV4dC50aGVuIChuZXdUZXh0KSAtPlxuICAgICAgICBpZiAoc2VsZWN0ZWQpXG4gICAgICAgICAgZWRpdG9yLnJlcGxhY2VTZWxlY3RlZFRleHQobmV3VGV4dClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0KG5ld1RleHQpXG4gICMjI1xuICBTZWN0aW9uOiBTZXJ2aWNlcyBBUElcbiAgIyMjXG4gIGNvbnN1bWVGb3JtYXR0ZXI6IChwcm92aWRlcnMpIC0+XG4gICAgcHJvdmlkZXJzID0gW3Byb3ZpZGVyc10gaWYgcHJvdmlkZXJzPyBhbmQgbm90IEFycmF5LmlzQXJyYXkocHJvdmlkZXJzKVxuICAgIHJldHVybiB1bmxlc3MgcHJvdmlkZXJzPy5sZW5ndGggPiAwXG4gICAgcmVnaXN0cmF0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgZm9yIHByb3ZpZGVyIGluIHByb3ZpZGVyc1xuICAgICAgcmVnaXN0cmF0aW9ucy5hZGQgQHByb3ZpZGVyTWFuYWdlci5yZWdpc3RlclByb3ZpZGVyKHByb3ZpZGVyKVxuICAgIHJlZ2lzdHJhdGlvbnNcblxuXG5cblxuIyBVdGlsaXR5IGZ1bmN0aW9uIHRvIGFwcGx5IHRoZSBlZGl0c1xuYXBwbHlFZGl0cyA9IChlZGl0b3IsZWRpdHMpIC0+XG4gIGVkaXRvci50cmFuc2FjdCAtPlxuICAgIGZvciBlZGl0IGluIGVkaXRzXG4gICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tlZGl0LnN0YXJ0LmxpbmUsIGVkaXQuc3RhcnQuY29sXSwgW2VkaXQuZW5kLmxpbmUsIGVkaXQuZW5kLmNvbF1dLCBlZGl0Lm5ld1RleHQpO1xuXG5cbiMgTWFuYWdlcyBzY29wZSByZXNvbHV0aW9uXG4jIyBpbnNwaXJhdGlvbiA6IGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tLWNvbW11bml0eS9hdXRvY29tcGxldGUtcGx1cy9ibG9iL21hc3Rlci9saWIvcHJvdmlkZXItbWFuYWdlci5jb2ZmZWVcbmNsYXNzIFByb3ZpZGVyTWFuYWdlclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcHJvdmlkZXJzID0gW11cblxuICByZWdpc3RlclByb3ZpZGVyOiAocHJvdmlkZXIpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm92aWRlcj9cbiAgICBwcm92aWRlck1ldGFkYXRhID0gbmV3IFByb3ZpZGVyTWV0YWRhdGEocHJvdmlkZXIpXG4gICAgQHByb3ZpZGVycy5wdXNoKHByb3ZpZGVyTWV0YWRhdGEpXG4gICAgcmV0dXJuIHByb3ZpZGVyTWV0YWRhdGFcblxuICBwcm92aWRlcnNGb3JTY29wZURlc2NyaXB0b3I6IChzY29wZURlc2NyaXB0b3IpID0+XG4gICAgc2NvcGVDaGFpbiA9IHNjb3BlQ2hhaW5Gb3JTY29wZURlc2NyaXB0b3Ioc2NvcGVEZXNjcmlwdG9yKVxuICAgIHJldHVybiBbXSB1bmxlc3Mgc2NvcGVDaGFpblxuXG4gICAgbWF0Y2hpbmdQcm92aWRlcnMgPSBbXVxuICAgIGxvd2VzdEluY2x1ZGVkUHJpb3JpdHkgPSAwXG5cbiAgICBmb3IgcHJvdmlkZXJNZXRhZGF0YSBpbiBAcHJvdmlkZXJzXG4gICAgICB7cHJvdmlkZXJ9ID0gcHJvdmlkZXJNZXRhZGF0YVxuICAgICAgaWYgcHJvdmlkZXJNZXRhZGF0YS5tYXRjaGVzU2NvcGVDaGFpbihzY29wZUNoYWluKVxuICAgICAgICBtYXRjaGluZ1Byb3ZpZGVycy5wdXNoKHByb3ZpZGVyKVxuICAgICAgICBpZiBwcm92aWRlci5leGNsdWRlTG93ZXJQcmlvcml0eT9cbiAgICAgICAgICBsb3dlc3RJbmNsdWRlZFByaW9yaXR5ID0gTWF0aC5tYXgobG93ZXN0SW5jbHVkZWRQcmlvcml0eSwgcHJvdmlkZXIuaW5jbHVzaW9uUHJpb3JpdHkgPyAwKVxuXG4gICAgbWF0Y2hpbmdQcm92aWRlcnMgPSAocHJvdmlkZXIgZm9yIHByb3ZpZGVyIGluIG1hdGNoaW5nUHJvdmlkZXJzIHdoZW4gKHByb3ZpZGVyLmluY2x1c2lvblByaW9yaXR5ID8gMCkgPj0gbG93ZXN0SW5jbHVkZWRQcmlvcml0eSlcbiAgICBzdGFibGVTb3J0IG1hdGNoaW5nUHJvdmlkZXJzLCAocHJvdmlkZXJBLCBwcm92aWRlckIpID0+XG4gICAgICBzcGVjaWZpY2l0eUEgPSBAbWV0YWRhdGFGb3JQcm92aWRlcihwcm92aWRlckEpLmdldFNwZWNpZmljaXR5KHNjb3BlQ2hhaW4pXG4gICAgICBzcGVjaWZpY2l0eUIgPSBAbWV0YWRhdGFGb3JQcm92aWRlcihwcm92aWRlckIpLmdldFNwZWNpZmljaXR5KHNjb3BlQ2hhaW4pXG4gICAgICBkaWZmZXJlbmNlID0gc3BlY2lmaWNpdHlCIC0gc3BlY2lmaWNpdHlBXG4gICAgICBkaWZmZXJlbmNlID0gKHByb3ZpZGVyQi5zdWdnZXN0aW9uUHJpb3JpdHkgPyAxKSAtIChwcm92aWRlckEuc3VnZ2VzdGlvblByaW9yaXR5ID8gMSkgaWYgZGlmZmVyZW5jZSBpcyAwXG4gICAgICBkaWZmZXJlbmNlXG5cblxuIyBUT0RPOiBtb3N0IG9mIHRoaXMgaXMgdGVtcCBjb2RlIHRvIHVuZGVyc3RhbmQgYXV0b2NvbXBsZXRlLXBsdXMgIzMwOFxuIyBUYWtlbiBmcm9tIGF1dG9jb21wbGV0ZS1wbHVzXG5zY29wZUNoYWluRm9yU2NvcGVEZXNjcmlwdG9yID0gKHNjb3BlRGVzY3JpcHRvcikgLT5cbiAgdHlwZSA9IHR5cGVvZiBzY29wZURlc2NyaXB0b3JcbiAgaWYgdHlwZSBpcyAnc3RyaW5nJ1xuICAgIHNjb3BlRGVzY3JpcHRvclxuICBlbHNlIGlmIHR5cGUgaXMgJ29iamVjdCcgYW5kIHNjb3BlRGVzY3JpcHRvcj8uZ2V0U2NvcGVDaGFpbj9cbiAgICBzY29wZUNoYWluID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3BlQ2hhaW4oKVxuICAgIGlmIHNjb3BlQ2hhaW4/IGFuZCBub3Qgc2NvcGVDaGFpbi5yZXBsYWNlP1xuICAgICAganNvbiA9IEpTT04uc3RyaW5naWZ5KHNjb3BlRGVzY3JpcHRvcilcbiAgICAgIGNvbnNvbGUubG9nIHNjb3BlRGVzY3JpcHRvciwganNvblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiMDE6IFNjb3BlQ2hhaW4gaXMgbm90IGNvcnJlY3QgdHlwZTogI3t0eXBlfTsgI3tqc29ufVwiKVxuICAgIHNjb3BlQ2hhaW5cbiAgZWxzZVxuICAgIGpzb24gPSBKU09OLnN0cmluZ2lmeShzY29wZURlc2NyaXB0b3IpXG4gICAgY29uc29sZS5sb2cgc2NvcGVEZXNjcmlwdG9yLCBqc29uXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiMDI6IFNjb3BlQ2hhaW4gaXMgbm90IGNvcnJlY3QgdHlwZTogI3t0eXBlfTsgI3tqc29ufVwiKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1vZHVsZVxuIl19
