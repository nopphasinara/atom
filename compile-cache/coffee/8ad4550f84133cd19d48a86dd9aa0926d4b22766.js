(function() {
  var CSON, CompositeDisposable, GrammarHelper, generator, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  CSON = require('season');

  GrammarHelper = require('./grammar-helper');

  generator = require('./code-block-generator');

  path = require('path');

  module.exports = {
    config: {
      liveReload: {
        title: '[Only on Developer Mode] Grammars live reload',
        type: 'boolean',
        "default": false
      }
    },
    subscriptions: null,
    liveReloadSubscriptions: null,
    activate: function(state) {
      if (!(atom.inDevMode() && !atom.inSpecMode())) {
        return;
      }
      this.subscriptions = new CompositeDisposable;
      this.helper = new GrammarHelper('../grammars/repositories/', '../grammars/');
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'asciidoc-grammar:compile-grammar-and-reload': (function(_this) {
          return function() {
            return _this.compileGrammar();
          };
        })(this),
        'asciidoc-grammar:toggle-live-reload': function() {
          var keyPath;
          keyPath = 'language-asciidoc.liveReload';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      }));
      return this.subscriptions.add(atom.config.observe('language-asciidoc.liveReload', (function(_this) {
        return function(newValue) {
          var ref;
          if (!atom.inDevMode()) {
            return;
          }
          if (newValue) {
            _this.compileGrammar();
            _this.liveReloadSubscriptions = new CompositeDisposable;
            return _this.startliveReload();
          } else {
            return (ref = _this.liveReloadSubscriptions) != null ? ref.dispose() : void 0;
          }
        };
      })(this)));
    },
    startliveReload: function() {
      if (!(atom.inDevMode() && !atom.inSpecMode() && atom.config.get('language-asciidoc.liveReload'))) {
        return;
      }
      return this.liveReloadSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (path.extname(editor.getTitle()) === '.cson') {
            return _this.liveReloadSubscriptions.add(editor.buffer.onDidSave(function() {
              return _this.compileGrammar();
            }));
          }
        };
      })(this)));
    },
    compileGrammar: function(debug) {
      var codeAsciidocBlocks, codeMarkdownBlocks, languages, rootGrammar;
      if (!(atom.inDevMode() && !atom.inSpecMode())) {
        return;
      }
      rootGrammar = this.helper.readGrammarFile('asciidoc-grammar.cson');
      rootGrammar.name = 'AsciiDoc';
      rootGrammar.scopeName = 'source.asciidoc';
      rootGrammar.fileTypes = ['ad', 'asc', 'adoc', 'asciidoc', 'adoc.txt'];
      this.helper.appendPartialGrammarsDirectory(rootGrammar, ['partials/', 'inlines/', 'blocks/', 'tables/']);
      languages = this.helper.readGrammarFile('languages.cson');
      codeAsciidocBlocks = generator.makeAsciidocBlocks(languages);
      rootGrammar.repository['source-asciidoctor'] = {
        patterns: codeAsciidocBlocks
      };
      codeMarkdownBlocks = generator.makeMarkdownBlocks(languages);
      rootGrammar.repository['source-markdown'] = {
        patterns: codeMarkdownBlocks
      };
      if (debug) {
        console.log(CSON.stringify(rootGrammar));
      }
      this.helper.writeGrammarFile(rootGrammar, 'language-asciidoc.cson');
      return this.reload();
    },
    reload: function() {
      var updatedPackage;
      atom.grammars.removeGrammarForScopeName('source.asciidoc');
      atom.grammars.removeGrammarForScopeName('source.asciidoc.properties');
      delete atom.packages.loadedPackages['language-asciidoc'];
      updatedPackage = atom.packages.loadPackage('language-asciidoc');
      updatedPackage.loadGrammarsSync();
      atom.workspace.getTextEditors().forEach(function(editor) {
        var atomVersion, grammarOverride;
        if (editor.getGrammar().packageName === 'language-asciidoc') {
          atomVersion = parseFloat(atom.getVersion());
          if (atomVersion < 1.11) {
            return editor.reloadGrammar();
          } else {
            grammarOverride = atom.textEditors.editorGrammarOverrides[editor.id];
            atom.textEditors.setGrammarOverride(editor, 'text.plain');
            if (grammarOverride != null) {
              return atom.textEditors.setGrammarOverride(editor, grammarOverride);
            } else {
              return atom.textEditors.clearGrammarOverride(editor);
            }
          }
        }
      });
      console.log('AsciiDoc grammars reloaded');
      return {
        deactivate: function() {
          var ref;
          if ((ref = this.liveReloadSubscriptions) != null) {
            ref.dispose();
          }
          return this.subscriptions.dispose();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1hc2NpaWRvYy9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSOztFQUNaLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLCtDQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7T0FERjtLQURGO0lBTUEsYUFBQSxFQUFlLElBTmY7SUFPQSx1QkFBQSxFQUF5QixJQVB6QjtJQVNBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFBLENBQUEsQ0FBYyxJQUFJLENBQUMsU0FBTCxDQUFBLENBQUEsSUFBcUIsQ0FBSSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQXZDLENBQUE7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLGFBQUosQ0FBa0IsMkJBQWxCLEVBQStDLGNBQS9DO01BR1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSw2Q0FBQSxFQUErQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxjQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0M7UUFDQSxx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QUZGOztNQURzQyxDQUF4QztNQW1CQSxPQUFPLENBQUMsR0FBUixDQUFZLDRCQUFaO2FBRUE7UUFBQSxVQUFBLEVBQVksU0FBQTtBQUNWLGNBQUE7O2VBQXdCLENBQUUsT0FBMUIsQ0FBQTs7aUJBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7UUFGVSxDQUFaOztJQWxDTSxDQXpFUjs7QUFSRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5DU09OID0gcmVxdWlyZSAnc2Vhc29uJ1xuR3JhbW1hckhlbHBlciA9IHJlcXVpcmUgJy4vZ3JhbW1hci1oZWxwZXInXG5nZW5lcmF0b3IgPSByZXF1aXJlICcuL2NvZGUtYmxvY2stZ2VuZXJhdG9yJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgbGl2ZVJlbG9hZDpcbiAgICAgIHRpdGxlOiAnW09ubHkgb24gRGV2ZWxvcGVyIE1vZGVdIEdyYW1tYXJzIGxpdmUgcmVsb2FkJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgbGl2ZVJlbG9hZFN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIHJldHVybiB1bmxlc3MgYXRvbS5pbkRldk1vZGUoKSBhbmQgbm90IGF0b20uaW5TcGVjTW9kZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAaGVscGVyID0gbmV3IEdyYW1tYXJIZWxwZXIgJy4uL2dyYW1tYXJzL3JlcG9zaXRvcmllcy8nLCAnLi4vZ3JhbW1hcnMvJ1xuXG4gICAgIyBBZGQgYWN0aW9ucyBpbiBDb21tYW5kIFBhbGV0dGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdhc2NpaWRvYy1ncmFtbWFyOmNvbXBpbGUtZ3JhbW1hci1hbmQtcmVsb2FkJzogPT4gQGNvbXBpbGVHcmFtbWFyKClcbiAgICAgICdhc2NpaWRvYy1ncmFtbWFyOnRvZ2dsZS1saXZlLXJlbG9hZCc6IC0+XG4gICAgICAgIGtleVBhdGggPSAnbGFuZ3VhZ2UtYXNjaWlkb2MubGl2ZVJlbG9hZCdcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KGtleVBhdGgsIG5vdCBhdG9tLmNvbmZpZy5nZXQoa2V5UGF0aCkpXG5cbiAgICAjIENhbGxzIGltbWVkaWF0ZWx5IGFuZCBldmVyeSB0aW1lIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2xhbmd1YWdlLWFzY2lpZG9jLmxpdmVSZWxvYWQnLCAobmV3VmFsdWUpID0+XG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20uaW5EZXZNb2RlKClcbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgIEBjb21waWxlR3JhbW1hcigpXG4gICAgICAgIEBsaXZlUmVsb2FkU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgIEBzdGFydGxpdmVSZWxvYWQoKVxuICAgICAgZWxzZVxuICAgICAgICBAbGl2ZVJlbG9hZFN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuXG4gIHN0YXJ0bGl2ZVJlbG9hZDogLT5cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uaW5EZXZNb2RlKCkgYW5kIG5vdCBhdG9tLmluU3BlY01vZGUoKSBhbmQgYXRvbS5jb25maWcuZ2V0ICdsYW5ndWFnZS1hc2NpaWRvYy5saXZlUmVsb2FkJ1xuXG4gICAgQGxpdmVSZWxvYWRTdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIGlmIHBhdGguZXh0bmFtZShlZGl0b3IuZ2V0VGl0bGUoKSkgaXMgJy5jc29uJ1xuICAgICAgICBAbGl2ZVJlbG9hZFN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5idWZmZXIub25EaWRTYXZlID0+XG4gICAgICAgICAgQGNvbXBpbGVHcmFtbWFyKClcblxuICBjb21waWxlR3JhbW1hcjogKGRlYnVnKSAtPlxuICAgIHJldHVybiB1bmxlc3MgYXRvbS5pbkRldk1vZGUoKSBhbmQgbm90IGF0b20uaW5TcGVjTW9kZSgpXG5cbiAgICByb290R3JhbW1hciA9IEBoZWxwZXIucmVhZEdyYW1tYXJGaWxlICdhc2NpaWRvYy1ncmFtbWFyLmNzb24nXG4gICAgcm9vdEdyYW1tYXIubmFtZSA9ICdBc2NpaURvYydcbiAgICByb290R3JhbW1hci5zY29wZU5hbWUgPSAnc291cmNlLmFzY2lpZG9jJ1xuICAgIHJvb3RHcmFtbWFyLmZpbGVUeXBlcyA9IFtcbiAgICAgICdhZCdcbiAgICAgICdhc2MnXG4gICAgICAnYWRvYydcbiAgICAgICdhc2NpaWRvYydcbiAgICAgICdhZG9jLnR4dCdcbiAgICBdXG5cbiAgICBAaGVscGVyLmFwcGVuZFBhcnRpYWxHcmFtbWFyc0RpcmVjdG9yeSByb290R3JhbW1hciwgWydwYXJ0aWFscy8nLCAnaW5saW5lcy8nLCAnYmxvY2tzLycsICd0YWJsZXMvJ11cblxuICAgICMgTG9hZCBsYW5ndWFnZXMgbGlzdFxuICAgIGxhbmd1YWdlcyA9IEBoZWxwZXIucmVhZEdyYW1tYXJGaWxlICdsYW5ndWFnZXMuY3NvbidcblxuICAgICMgQWRkIGxhbmd1YWdlcyBibG9ja3MgZm9yIEFzY2lpRG9jXG4gICAgY29kZUFzY2lpZG9jQmxvY2tzID0gZ2VuZXJhdG9yLm1ha2VBc2NpaWRvY0Jsb2NrcyBsYW5ndWFnZXNcbiAgICByb290R3JhbW1hci5yZXBvc2l0b3J5Wydzb3VyY2UtYXNjaWlkb2N0b3InXSA9IHBhdHRlcm5zOiBjb2RlQXNjaWlkb2NCbG9ja3NcblxuICAgICMgQWRkIGxhbmd1YWdlcyBibG9ja3MgZm9yIE1hcmtkb3duXG4gICAgY29kZU1hcmtkb3duQmxvY2tzID0gZ2VuZXJhdG9yLm1ha2VNYXJrZG93bkJsb2NrcyBsYW5ndWFnZXNcbiAgICByb290R3JhbW1hci5yZXBvc2l0b3J5Wydzb3VyY2UtbWFya2Rvd24nXSA9IHBhdHRlcm5zOiBjb2RlTWFya2Rvd25CbG9ja3NcblxuICAgIGlmIGRlYnVnXG4gICAgICBjb25zb2xlLmxvZyBDU09OLnN0cmluZ2lmeSByb290R3JhbW1hclxuICAgIEBoZWxwZXIud3JpdGVHcmFtbWFyRmlsZSByb290R3JhbW1hciwgJ2xhbmd1YWdlLWFzY2lpZG9jLmNzb24nXG4gICAgQHJlbG9hZCgpXG5cbiAgcmVsb2FkOiAtPlxuICAgICMgUmVtb3ZlIGdyYW1tYXJzXG4gICAgYXRvbS5ncmFtbWFycy5yZW1vdmVHcmFtbWFyRm9yU2NvcGVOYW1lICdzb3VyY2UuYXNjaWlkb2MnXG4gICAgYXRvbS5ncmFtbWFycy5yZW1vdmVHcmFtbWFyRm9yU2NvcGVOYW1lICdzb3VyY2UuYXNjaWlkb2MucHJvcGVydGllcydcblxuICAgICMgUmVtb3ZlIGxvYWRlZCBwYWNrYWdlIChIYWNrIGZvcmNlIHJlbG9hZClcbiAgICBkZWxldGUgYXRvbS5wYWNrYWdlcy5sb2FkZWRQYWNrYWdlc1snbGFuZ3VhZ2UtYXNjaWlkb2MnXVxuXG4gICAgIyBMb2FkIHBhY2thZ2VcbiAgICB1cGRhdGVkUGFja2FnZSA9IGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UgJ2xhbmd1YWdlLWFzY2lpZG9jJ1xuICAgIHVwZGF0ZWRQYWNrYWdlLmxvYWRHcmFtbWFyc1N5bmMoKVxuXG4gICAgIyBSZWxvYWQgZ3JhbW1hcnMgZm9yIGVhY2ggZWRpdG9yXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoIChlZGl0b3IpIC0+XG4gICAgICBpZiBlZGl0b3IuZ2V0R3JhbW1hcigpLnBhY2thZ2VOYW1lIGlzICdsYW5ndWFnZS1hc2NpaWRvYydcbiAgICAgICAgYXRvbVZlcnNpb24gPSBwYXJzZUZsb2F0KGF0b20uZ2V0VmVyc2lvbigpKVxuICAgICAgICBpZiBhdG9tVmVyc2lvbiA8IDEuMTFcbiAgICAgICAgICAjIG9ubHkgZm9yIGNvbXBhdGliaWx0eSB3aXRoIG9sZGVyIHZlcnNpb24gb2YgQXRvbVxuICAgICAgICAgIGVkaXRvci5yZWxvYWRHcmFtbWFyKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgV29ya2Fyb3VuZCBiZWNhdXNlOlxuICAgICAgICAgICMgLSBgcmVsb2FkR3JhbW1hcmAgaXMgYnVnZ3kgYmVmb3JlIDEuMTEgKGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzEzMDIyKVxuICAgICAgICAgICMgLSBgbWFpbnRhaW5HcmFtbWFyYCBjaGFuZ2UgdGhpcyBiZWhhdmlvciBhbmQgZG9uJ3QgcmVsb2FkIGV4aXN0aW5nIGdyYW1tYXIuXG4gICAgICAgICAgIyAgIC0gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9wdWxsLzEyMTI1XG4gICAgICAgICAgIyAgIC0gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9ibG9iL2M4NDRkMGYwOTllNmVkOTVjNTJmMGI5NGUxZjE0MTc1OTkyNmFlYjgvc3JjL3RleHQtZWRpdG9yLXJlZ2lzdHJ5LmpzI0wyMDFcbiAgICAgICAgICBncmFtbWFyT3ZlcnJpZGUgPSBhdG9tLnRleHRFZGl0b3JzLmVkaXRvckdyYW1tYXJPdmVycmlkZXNbZWRpdG9yLmlkXVxuICAgICAgICAgIGF0b20udGV4dEVkaXRvcnMuc2V0R3JhbW1hck92ZXJyaWRlIGVkaXRvciwgJ3RleHQucGxhaW4nXG4gICAgICAgICAgaWYgZ3JhbW1hck92ZXJyaWRlP1xuICAgICAgICAgICAgYXRvbS50ZXh0RWRpdG9ycy5zZXRHcmFtbWFyT3ZlcnJpZGUgZWRpdG9yLCBncmFtbWFyT3ZlcnJpZGVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBhdG9tLnRleHRFZGl0b3JzLmNsZWFyR3JhbW1hck92ZXJyaWRlIGVkaXRvclxuXG4gICAgY29uc29sZS5sb2cgJ0FzY2lpRG9jIGdyYW1tYXJzIHJlbG9hZGVkJ1xuXG4gICAgZGVhY3RpdmF0ZTogLT5cbiAgICAgIEBsaXZlUmVsb2FkU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiJdfQ==
