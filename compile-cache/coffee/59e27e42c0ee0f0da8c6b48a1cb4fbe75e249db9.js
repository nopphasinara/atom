(function() {
  var CSON, CompositeDisposable, GrammarHelper;

  CompositeDisposable = require('atom').CompositeDisposable;

  CSON = require('season');

  GrammarHelper = require('./grammar-helper');

  module.exports = {
    subscriptions: null,
    debug: false,
    activate: function(state) {
      var customFileTypes, dockerIgnoreExtension, languageDockerPackage;
      languageDockerPackage = atom.packages.getAvailablePackageNames().find(function(name) {
        return name === 'language-docker';
      });
      if (languageDockerPackage != null) {
        customFileTypes = atom.config.get('core.customFileTypes');
        if (customFileTypes == null) {
          customFileTypes = {
            'text.ignore': ['.dockerignore']
          };
          atom.config.set('core.customFileTypes', customFileTypes);
          atom.grammars.removeGrammarForScopeName('source.dockerignore');
          console.log('Desactivate syntax highlighting for "source.dockerignore" from https://atom.io/packages/language-docker.');
        } else if (customFileTypes['text.ignore'] == null) {
          customFileTypes['text.ignore'] = ['.dockerignore'];
          atom.config.set('core.customFileTypes', customFileTypes);
          atom.grammars.removeGrammarForScopeName('source.dockerignore');
          console.log('Desactivate syntax highlighting for "source.dockerignore" from https://atom.io/packages/language-docker.');
        } else {
          dockerIgnoreExtension = customFileTypes['text.ignore'].find(function(ext) {
            return ext === '.dockerignore';
          });
          if (dockerIgnoreExtension == null) {
            customFileTypes['text.ignore'].push('.dockerignore');
            atom.config.set('core.customFileTypes', customFileTypes);
            atom.grammars.removeGrammarForScopeName('source.dockerignore');
            console.log('Desactivate syntax highlighting for "source.dockerignore" from https://atom.io/packages/language-docker.');
          }
        }
      }
      if (!(atom.inDevMode() && !atom.inSpecMode())) {
        return;
      }
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'ignore:compile-grammar-and-reload': (function(_this) {
          return function() {
            return _this.compileGrammar();
          };
        })(this)
      }));
    },
    compileGrammar: function() {
      var helper, promiseIgnore, promiseSlugIgnore;
      if (!(atom.inDevMode() && !atom.inSpecMode())) {
        return;
      }
      helper = new GrammarHelper('../grammars/repositories/', '../grammars/');
      promiseIgnore = helper.readGrammarFile('ignore.cson').then(function(rootGrammar) {
        var partialGrammars;
        rootGrammar.name = 'Ignore File (gitignore syntax)';
        rootGrammar.scopeName = 'text.ignore';
        rootGrammar.fileTypes = ['gitignore', 'npmignore', 'coffeelintignore', 'dockerignore', 'atomignore', 'vscodeignore', 'eslintignore', 'prettierignore'];
        partialGrammars = ['/symbols/negate-symbols.cson', '/symbols/basic-symbols.cson', '/lines/negate.cson', '/lines/directory.cson', '/lines/file.cson'];
        return helper.appendPartialGrammars(rootGrammar, partialGrammars).then((function(_this) {
          return function() {
            if (_this.debug) {
              console.log(CSON.stringify(rootGrammar));
            }
            return helper.writeGrammarFile(rootGrammar, 'language-ignore.cson');
          };
        })(this));
      });
      promiseSlugIgnore = helper.readGrammarFile('ignore.cson').then(function(rootGrammar) {
        var partialGrammars;
        rootGrammar.name = 'Ignore File for Slug compiler (gitignore syntax)';
        rootGrammar.scopeName = 'text.ignore.slugignore';
        rootGrammar.fileTypes = ['slugignore'];
        partialGrammars = ['/symbols/negate-illegal-symbols.cson', '/symbols/basic-symbols.cson', '/lines/negate.cson', '/lines/directory.cson', '/lines/file.cson'];
        return helper.appendPartialGrammars(rootGrammar, partialGrammars).then((function(_this) {
          return function() {
            if (_this.debug) {
              console.log(CSON.stringify(rootGrammar));
            }
            return helper.writeGrammarFile(rootGrammar, 'language-ignore-slug.cson');
          };
        })(this));
      });
      promiseSlugIgnore = helper.readGrammarFile('ignore.cson').then(function(rootGrammar) {
        var partialGrammars;
        rootGrammar.name = 'Ignore File for Mecurial';
        rootGrammar.scopeName = 'text.ignore.hgignore';
        rootGrammar.fileTypes = ['hgignore'];
        partialGrammars = ['/symbols/negate-illegal-symbols.cson', '/symbols/basic-symbols.cson', '/lines/negate.cson', '/lines/directory.cson', '/lines/file.cson'];
        return helper.appendPartialGrammars(rootGrammar, partialGrammars).then((function(_this) {
          return function() {
            if (_this.debug) {
              console.log(CSON.stringify(rootGrammar));
            }
            return helper.writeGrammarFile(rootGrammar, 'language-ignore-mercurial.cson');
          };
        })(this));
      });
      Promise.all([promiseIgnore, promiseSlugIgnore]).then(function() {
        return atom.commands.dispatch('body', 'window:reload');
      });
      return {
        deactivate: function() {
          return this.subscriptions.dispose();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1pZ25vcmUvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFDUCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsS0FBQSxFQUFPLEtBRFA7SUFHQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBRVIsVUFBQTtNQUFBLHFCQUFBLEdBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQWQsQ0FBQSxDQUF3QyxDQUFDLElBQXpDLENBQThDLFNBQUMsSUFBRDtlQUFVLElBQUEsS0FBUTtNQUFsQixDQUE5QztNQUN4QixJQUFHLDZCQUFIO1FBQ0UsZUFBQSxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCO1FBQ2xCLElBQU8sdUJBQVA7VUFDRSxlQUFBLEdBQWtCO1lBQUEsYUFBQSxFQUFlLENBQUMsZUFBRCxDQUFmOztVQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLGVBQXhDO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBZCxDQUF3QyxxQkFBeEM7VUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLDBHQUFaLEVBSkY7U0FBQSxNQUtLLElBQU8sc0NBQVA7VUFDSCxlQUFnQixDQUFBLGFBQUEsQ0FBaEIsR0FBaUMsQ0FBQyxlQUFEO1VBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsZUFBeEM7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLHlCQUFkLENBQXdDLHFCQUF4QztVQUNBLE9B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RUFBWSxTQUFBO2lCQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO1FBRFUsQ0FBWjs7SUE1RWMsQ0EvQmhCOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkNTT04gPSByZXF1aXJlICdzZWFzb24nXG5HcmFtbWFySGVscGVyID0gcmVxdWlyZSAnLi9ncmFtbWFyLWhlbHBlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZGVidWc6IGZhbHNlXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEZpeCBkb2NrZXJpZ25vcmUgY29uZmxpY3RzIHdpdGggaHR0cHM6Ly9hdG9tLmlvL3BhY2thZ2VzL2xhbmd1YWdlLWRvY2tlclxuICAgIGxhbmd1YWdlRG9ja2VyUGFja2FnZSA9IGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZU5hbWVzKCkuZmluZCAobmFtZSkgLT4gbmFtZSBpcyAnbGFuZ3VhZ2UtZG9ja2VyJ1xuICAgIGlmIGxhbmd1YWdlRG9ja2VyUGFja2FnZT9cbiAgICAgIGN1c3RvbUZpbGVUeXBlcyA9IGF0b20uY29uZmlnLmdldCAnY29yZS5jdXN0b21GaWxlVHlwZXMnXG4gICAgICBpZiBub3QgY3VzdG9tRmlsZVR5cGVzP1xuICAgICAgICBjdXN0b21GaWxlVHlwZXMgPSAndGV4dC5pZ25vcmUnOiBbJy5kb2NrZXJpZ25vcmUnXVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2NvcmUuY3VzdG9tRmlsZVR5cGVzJywgY3VzdG9tRmlsZVR5cGVzXG4gICAgICAgIGF0b20uZ3JhbW1hcnMucmVtb3ZlR3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmRvY2tlcmlnbm9yZScpXG4gICAgICAgIGNvbnNvbGUubG9nICdEZXNhY3RpdmF0ZSBzeW50YXggaGlnaGxpZ2h0aW5nIGZvciBcInNvdXJjZS5kb2NrZXJpZ25vcmVcIiBmcm9tIGh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9sYW5ndWFnZS1kb2NrZXIuJ1xuICAgICAgZWxzZSBpZiBub3QgY3VzdG9tRmlsZVR5cGVzWyd0ZXh0Lmlnbm9yZSddP1xuICAgICAgICBjdXN0b21GaWxlVHlwZXNbJ3RleHQuaWdub3JlJ10gPSBbJy5kb2NrZXJpZ25vcmUnXVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2NvcmUuY3VzdG9tRmlsZVR5cGVzJywgY3VzdG9tRmlsZVR5cGVzXG4gICAgICAgIGF0b20uZ3JhbW1hcnMucmVtb3ZlR3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmRvY2tlcmlnbm9yZScpXG4gICAgICAgIGNvbnNvbGUubG9nICdEZXNhY3RpdmF0ZSBzeW50YXggaGlnaGxpZ2h0aW5nIGZvciBcInNvdXJjZS5kb2NrZXJpZ25vcmVcIiBmcm9tIGh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9sYW5ndWFnZS1kb2NrZXIuJ1xuICAgICAgZWxzZVxuICAgICAgICBkb2NrZXJJZ25vcmVFeHRlbnNpb24gPSBjdXN0b21GaWxlVHlwZXNbJ3RleHQuaWdub3JlJ10uZmluZCAoZXh0KSAtPiBleHQgaXMgJy5kb2NrZXJpZ25vcmUnXG4gICAgICAgIGlmIG5vdCBkb2NrZXJJZ25vcmVFeHRlbnNpb24/XG4gICAgICAgICAgY3VzdG9tRmlsZVR5cGVzWyd0ZXh0Lmlnbm9yZSddLnB1c2goJy5kb2NrZXJpZ25vcmUnKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAnY29yZS5jdXN0b21GaWxlVHlwZXMnLCBjdXN0b21GaWxlVHlwZXNcbiAgICAgICAgICBhdG9tLmdyYW1tYXJzLnJlbW92ZUdyYW1tYXJGb3JTY29wZU5hbWUoJ3NvdXJjZS5kb2NrZXJpZ25vcmUnKVxuICAgICAgICAgIGNvbnNvbGUubG9nICdEZXNhY3RpdmF0ZSBzeW50YXggaGlnaGxpZ2h0aW5nIGZvciBcInNvdXJjZS5kb2NrZXJpZ25vcmVcIiBmcm9tIGh0dHBzOi8vYXRvbS5pby9wYWNrYWdlcy9sYW5ndWFnZS1kb2NrZXIuJ1xuXG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmluRGV2TW9kZSgpIGFuZCBub3QgYXRvbS5pblNwZWNNb2RlKClcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2lnbm9yZTpjb21waWxlLWdyYW1tYXItYW5kLXJlbG9hZCc6ID0+IEBjb21waWxlR3JhbW1hcigpXG5cbiAgY29tcGlsZUdyYW1tYXI6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmluRGV2TW9kZSgpIGFuZCBub3QgYXRvbS5pblNwZWNNb2RlKClcblxuICAgIGhlbHBlciA9IG5ldyBHcmFtbWFySGVscGVyICcuLi9ncmFtbWFycy9yZXBvc2l0b3JpZXMvJywgJy4uL2dyYW1tYXJzLydcblxuICAgICMgZ2l0aWdub3JlIGJhc2VcbiAgICBwcm9taXNlSWdub3JlID0gaGVscGVyLnJlYWRHcmFtbWFyRmlsZSAnaWdub3JlLmNzb24nXG4gICAgICAudGhlbiAocm9vdEdyYW1tYXIpIC0+XG4gICAgICAgIHJvb3RHcmFtbWFyLm5hbWUgPSAnSWdub3JlIEZpbGUgKGdpdGlnbm9yZSBzeW50YXgpJ1xuICAgICAgICByb290R3JhbW1hci5zY29wZU5hbWUgPSAndGV4dC5pZ25vcmUnXG4gICAgICAgIHJvb3RHcmFtbWFyLmZpbGVUeXBlcyA9IFtcbiAgICAgICAgICAnZ2l0aWdub3JlJ1xuICAgICAgICAgICducG1pZ25vcmUnXG4gICAgICAgICAgJ2NvZmZlZWxpbnRpZ25vcmUnXG4gICAgICAgICAgJ2RvY2tlcmlnbm9yZSdcbiAgICAgICAgICAnYXRvbWlnbm9yZSdcbiAgICAgICAgICAndnNjb2RlaWdub3JlJ1xuICAgICAgICAgICdlc2xpbnRpZ25vcmUnXG4gICAgICAgICAgJ3ByZXR0aWVyaWdub3JlJ1xuICAgICAgICBdXG4gICAgICAgIHBhcnRpYWxHcmFtbWFycyA9IFtcbiAgICAgICAgICAnL3N5bWJvbHMvbmVnYXRlLXN5bWJvbHMuY3NvbidcbiAgICAgICAgICAnL3N5bWJvbHMvYmFzaWMtc3ltYm9scy5jc29uJ1xuICAgICAgICAgICcvbGluZXMvbmVnYXRlLmNzb24nXG4gICAgICAgICAgJy9saW5lcy9kaXJlY3RvcnkuY3NvbidcbiAgICAgICAgICAnL2xpbmVzL2ZpbGUuY3NvbidcbiAgICAgICAgXVxuICAgICAgICBoZWxwZXIuYXBwZW5kUGFydGlhbEdyYW1tYXJzIHJvb3RHcmFtbWFyLCBwYXJ0aWFsR3JhbW1hcnNcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgaWYgQGRlYnVnIHRoZW4gY29uc29sZS5sb2cgQ1NPTi5zdHJpbmdpZnkgcm9vdEdyYW1tYXJcbiAgICAgICAgICAgIGhlbHBlci53cml0ZUdyYW1tYXJGaWxlIHJvb3RHcmFtbWFyLCAnbGFuZ3VhZ2UtaWdub3JlLmNzb24nXG5cbiAgICAjIHNsdWdpZ25vcmVcbiAgICBwcm9taXNlU2x1Z0lnbm9yZSA9IGhlbHBlci5yZWFkR3JhbW1hckZpbGUgJ2lnbm9yZS5jc29uJ1xuICAgICAgLnRoZW4gKHJvb3RHcmFtbWFyKSAtPlxuICAgICAgICByb290R3JhbW1hci5uYW1lID0gJ0lnbm9yZSBGaWxlIGZvciBTbHVnIGNvbXBpbGVyIChnaXRpZ25vcmUgc3ludGF4KSdcbiAgICAgICAgcm9vdEdyYW1tYXIuc2NvcGVOYW1lID0gJ3RleHQuaWdub3JlLnNsdWdpZ25vcmUnXG4gICAgICAgIHJvb3RHcmFtbWFyLmZpbGVUeXBlcyA9IFtcbiAgICAgICAgICAnc2x1Z2lnbm9yZSdcbiAgICAgICAgXVxuICAgICAgICBwYXJ0aWFsR3JhbW1hcnMgPSBbXG4gICAgICAgICAgJy9zeW1ib2xzL25lZ2F0ZS1pbGxlZ2FsLXN5bWJvbHMuY3NvbidcbiAgICAgICAgICAnL3N5bWJvbHMvYmFzaWMtc3ltYm9scy5jc29uJ1xuICAgICAgICAgICcvbGluZXMvbmVnYXRlLmNzb24nXG4gICAgICAgICAgJy9saW5lcy9kaXJlY3RvcnkuY3NvbidcbiAgICAgICAgICAnL2xpbmVzL2ZpbGUuY3NvbidcbiAgICAgICAgXVxuICAgICAgICBoZWxwZXIuYXBwZW5kUGFydGlhbEdyYW1tYXJzIHJvb3RHcmFtbWFyLCBwYXJ0aWFsR3JhbW1hcnNcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgaWYgQGRlYnVnIHRoZW4gY29uc29sZS5sb2cgQ1NPTi5zdHJpbmdpZnkgcm9vdEdyYW1tYXJcbiAgICAgICAgICAgIGhlbHBlci53cml0ZUdyYW1tYXJGaWxlIHJvb3RHcmFtbWFyLCAnbGFuZ3VhZ2UtaWdub3JlLXNsdWcuY3NvbidcblxuICAgICMgaGdpZ25vcmVcbiAgICBwcm9taXNlU2x1Z0lnbm9yZSA9IGhlbHBlci5yZWFkR3JhbW1hckZpbGUgJ2lnbm9yZS5jc29uJ1xuICAgICAgLnRoZW4gKHJvb3RHcmFtbWFyKSAtPlxuICAgICAgICByb290R3JhbW1hci5uYW1lID0gJ0lnbm9yZSBGaWxlIGZvciBNZWN1cmlhbCdcbiAgICAgICAgcm9vdEdyYW1tYXIuc2NvcGVOYW1lID0gJ3RleHQuaWdub3JlLmhnaWdub3JlJ1xuICAgICAgICByb290R3JhbW1hci5maWxlVHlwZXMgPSBbXG4gICAgICAgICAgJ2hnaWdub3JlJ1xuICAgICAgICBdXG4gICAgICAgIHBhcnRpYWxHcmFtbWFycyA9IFtcbiAgICAgICAgICAnL3N5bWJvbHMvbmVnYXRlLWlsbGVnYWwtc3ltYm9scy5jc29uJ1xuICAgICAgICAgICcvc3ltYm9scy9iYXNpYy1zeW1ib2xzLmNzb24nXG4gICAgICAgICAgJy9saW5lcy9uZWdhdGUuY3NvbidcbiAgICAgICAgICAnL2xpbmVzL2RpcmVjdG9yeS5jc29uJ1xuICAgICAgICAgICcvbGluZXMvZmlsZS5jc29uJ1xuICAgICAgICBdXG4gICAgICAgIGhlbHBlci5hcHBlbmRQYXJ0aWFsR3JhbW1hcnMgcm9vdEdyYW1tYXIsIHBhcnRpYWxHcmFtbWFyc1xuICAgICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICBpZiBAZGVidWcgdGhlbiBjb25zb2xlLmxvZyBDU09OLnN0cmluZ2lmeSByb290R3JhbW1hclxuICAgICAgICAgICAgaGVscGVyLndyaXRlR3JhbW1hckZpbGUgcm9vdEdyYW1tYXIsICdsYW5ndWFnZS1pZ25vcmUtbWVyY3VyaWFsLmNzb24nXG5cbiAgICBQcm9taXNlLmFsbCBbcHJvbWlzZUlnbm9yZSwgcHJvbWlzZVNsdWdJZ25vcmVdXG4gICAgICAudGhlbiAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoICdib2R5JywgJ3dpbmRvdzpyZWxvYWQnXG5cbiAgICBkZWFjdGl2YXRlOiAtPlxuICAgICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4iXX0=
