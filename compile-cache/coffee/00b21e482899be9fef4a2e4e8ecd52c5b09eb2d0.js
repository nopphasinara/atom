(function() {
  var CSON, Directory, GrammarHelper, base, path;

  Directory = require('atom').Directory;

  CSON = require('season');

  path = require('path');

  if ((base = String.prototype).endsWith == null) {
    base.endsWith = function(s) {
      return s === '' || this.slice(-s.length) === s;
    };
  }

  GrammarHelper = (function() {
    function GrammarHelper(rootInputDirectory, rootOutputDirectory) {
      this.rootInputDirectory = rootInputDirectory;
      this.rootOutputDirectory = rootOutputDirectory;
    }

    GrammarHelper.prototype.readGrammarFile = function(file) {
      var filepath;
      filepath = path.join(__dirname, this.rootInputDirectory, file);
      return CSON.readFileSync(filepath);
    };

    GrammarHelper.prototype.writeGrammarFile = function(grammar, file) {
      var outputFilepath;
      outputFilepath = path.join(__dirname, this.rootOutputDirectory, file);
      return CSON.writeFileSync(outputFilepath, grammar);
    };

    GrammarHelper.prototype.appendPartialGrammars = function(grammar, partialGrammarFiles) {
      var grammarFile, i, key, len, patterns, ref, results;
      results = [];
      for (i = 0, len = partialGrammarFiles.length; i < len; i++) {
        grammarFile = partialGrammarFiles[i];
        ref = this.readGrammarFile(grammarFile), key = ref.key, patterns = ref.patterns;
        if ((key != null) && (patterns != null)) {
          results.push(grammar.repository[key] = {
            patterns: patterns
          });
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    GrammarHelper.prototype.appendPartialGrammarsDirectory = function(grammar, grammarDirectories) {
      var directory, directoryName, entries, entry, i, key, len, patterns, results;
      results = [];
      for (i = 0, len = grammarDirectories.length; i < len; i++) {
        directoryName = grammarDirectories[i];
        directory = new Directory(path.join(__dirname, this.rootInputDirectory, directoryName));
        entries = directory.getEntriesSync();
        results.push((function() {
          var j, len1, ref, results1;
          results1 = [];
          for (j = 0, len1 = entries.length; j < len1; j++) {
            entry = entries[j];
            if (entry.isFile() && entry.getBaseName().endsWith('.cson')) {
              ref = CSON.readFileSync(entry.path), key = ref.key, patterns = ref.patterns;
              if ((key != null) && (patterns != null)) {
                results1.push(grammar.repository[key] = {
                  patterns: patterns
                });
              } else {
                results1.push(void 0);
              }
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    };

    return GrammarHelper;

  })();

  module.exports = GrammarHelper;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1hc2NpaWRvYy9saWIvZ3JhbW1hci1oZWxwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxZQUFhLE9BQUEsQ0FBUSxNQUFSOztFQUNkLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7OztRQUVDLENBQUEsV0FBWSxTQUFDLENBQUQ7YUFBTyxDQUFBLEtBQUssRUFBTCxJQUFXLElBQUUsaUJBQUYsS0FBa0I7SUFBcEM7OztFQUVkO0lBRVMsdUJBQUMsa0JBQUQsRUFBc0IsbUJBQXRCO01BQUMsSUFBQyxDQUFBLHFCQUFEO01BQXFCLElBQUMsQ0FBQSxzQkFBRDtJQUF0Qjs7NEJBRWIsZUFBQSxHQUFpQixTQUFDLElBQUQ7QUFDZixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFDLENBQUEsa0JBQXRCLEVBQTBDLElBQTFDO2FBQ1gsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsUUFBbEI7SUFGZTs7NEJBSWpCLGdCQUFBLEdBQWtCLFNBQUMsT0FBRCxFQUFVLElBQVY7QUFDaEIsVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQUMsQ0FBQSxtQkFBdEIsRUFBMkMsSUFBM0M7YUFDakIsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsT0FBbkM7SUFGZ0I7OzRCQUlsQixxQkFBQSxHQUF1QixTQUFDLE9BQUQsRUFBVSxtQkFBVjtBQUNyQixVQUFBO0FBQUE7V0FBQSxxREFBQTs7UUFDRSxNQUFrQixJQUFDLENBQUEsZUFBRCxDQUFpQixXQUFqQixDQUFsQixFQUFDLGFBQUQsRUFBTTtRQUNOLElBQUcsYUFBQSxJQUFTLGtCQUFaO3VCQUNFLE9BQU8sQ0FBQyxVQUFXLENBQUEsR0FBQSxDQUFuQixHQUNFO1lBQUEsUUFBQSxFQUFVLFFBQVY7YUFGSjtTQUFBLE1BQUE7K0JBQUE7O0FBRkY7O0lBRHFCOzs0QkFPdkIsOEJBQUEsR0FBZ0MsU0FBQyxPQUFELEVBQVUsa0JBQVY7QUFDOUIsVUFBQTtBQUFBO1dBQUEsb0RBQUE7O1FBQ0UsU0FBQSxHQUFZLElBQUksU0FBSixDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFDLENBQUEsa0JBQXRCLEVBQTBDLGFBQTFDLENBQWQ7UUFDWixPQUFBLEdBQVUsU0FBUyxDQUFDLGNBQVYsQ0FBQTs7O0FBQ1Y7ZUFBQSwyQ0FBQTs7WUFDRSxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FBQSxJQUFtQixLQUFLLENBQUMsV0FBTixDQUFBLENBQW1CLENBQUMsUUFBcEIsQ0FBNkIsT0FBN0IsQ0FBdEI7Y0FDRSxNQUFrQixJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFLLENBQUMsSUFBeEIsQ0FBbEIsRUFBQyxhQUFELEVBQU07Y0FDTixJQUFHLGFBQUEsSUFBUyxrQkFBWjs4QkFDRSxPQUFPLENBQUMsVUFBVyxDQUFBLEdBQUEsQ0FBbkIsR0FDRTtrQkFBQSxRQUFBLEVBQVUsUUFBVjttQkFGSjtlQUFBLE1BQUE7c0NBQUE7ZUFGRjthQUFBLE1BQUE7b0NBQUE7O0FBREY7OztBQUhGOztJQUQ4Qjs7Ozs7O0VBV2xDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBcENqQiIsInNvdXJjZXNDb250ZW50IjpbIntEaXJlY3Rvcnl9ID0gcmVxdWlyZSAnYXRvbSdcbkNTT04gPSByZXF1aXJlICdzZWFzb24nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuU3RyaW5nOjplbmRzV2l0aCA/PSAocykgLT4gcyBpcyAnJyBvciBAWy1zLmxlbmd0aC4uXSBpcyBzXG5cbmNsYXNzIEdyYW1tYXJIZWxwZXJcblxuICBjb25zdHJ1Y3RvcjogKEByb290SW5wdXREaXJlY3RvcnksIEByb290T3V0cHV0RGlyZWN0b3J5KSAtPlxuXG4gIHJlYWRHcmFtbWFyRmlsZTogKGZpbGUpIC0+XG4gICAgZmlsZXBhdGggPSBwYXRoLmpvaW4gX19kaXJuYW1lLCBAcm9vdElucHV0RGlyZWN0b3J5LCBmaWxlXG4gICAgQ1NPTi5yZWFkRmlsZVN5bmMgZmlsZXBhdGhcblxuICB3cml0ZUdyYW1tYXJGaWxlOiAoZ3JhbW1hciwgZmlsZSkgLT5cbiAgICBvdXRwdXRGaWxlcGF0aCA9IHBhdGguam9pbiBfX2Rpcm5hbWUsIEByb290T3V0cHV0RGlyZWN0b3J5LCBmaWxlXG4gICAgQ1NPTi53cml0ZUZpbGVTeW5jIG91dHB1dEZpbGVwYXRoLCBncmFtbWFyXG5cbiAgYXBwZW5kUGFydGlhbEdyYW1tYXJzOiAoZ3JhbW1hciwgcGFydGlhbEdyYW1tYXJGaWxlcykgLT5cbiAgICBmb3IgZ3JhbW1hckZpbGUgaW4gcGFydGlhbEdyYW1tYXJGaWxlc1xuICAgICAge2tleSwgcGF0dGVybnN9ID0gQHJlYWRHcmFtbWFyRmlsZSBncmFtbWFyRmlsZVxuICAgICAgaWYga2V5PyBhbmQgcGF0dGVybnM/XG4gICAgICAgIGdyYW1tYXIucmVwb3NpdG9yeVtrZXldID1cbiAgICAgICAgICBwYXR0ZXJuczogcGF0dGVybnNcblxuICBhcHBlbmRQYXJ0aWFsR3JhbW1hcnNEaXJlY3Rvcnk6IChncmFtbWFyLCBncmFtbWFyRGlyZWN0b3JpZXMpIC0+XG4gICAgZm9yIGRpcmVjdG9yeU5hbWUgaW4gZ3JhbW1hckRpcmVjdG9yaWVzXG4gICAgICBkaXJlY3RvcnkgPSBuZXcgRGlyZWN0b3J5IHBhdGguam9pbihfX2Rpcm5hbWUsIEByb290SW5wdXREaXJlY3RvcnksIGRpcmVjdG9yeU5hbWUpXG4gICAgICBlbnRyaWVzID0gZGlyZWN0b3J5LmdldEVudHJpZXNTeW5jKClcbiAgICAgIGZvciBlbnRyeSBpbiBlbnRyaWVzXG4gICAgICAgIGlmIGVudHJ5LmlzRmlsZSgpIGFuZCBlbnRyeS5nZXRCYXNlTmFtZSgpLmVuZHNXaXRoICcuY3NvbidcbiAgICAgICAgICB7a2V5LCBwYXR0ZXJuc30gPSBDU09OLnJlYWRGaWxlU3luYyBlbnRyeS5wYXRoXG4gICAgICAgICAgaWYga2V5PyBhbmQgcGF0dGVybnM/XG4gICAgICAgICAgICBncmFtbWFyLnJlcG9zaXRvcnlba2V5XSA9XG4gICAgICAgICAgICAgIHBhdHRlcm5zOiBwYXR0ZXJuc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJIZWxwZXJcbiJdfQ==
