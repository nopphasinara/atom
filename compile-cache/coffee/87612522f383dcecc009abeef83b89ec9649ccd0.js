(function() {
  var CSON, GrammarHelper, path;

  CSON = require('season');

  path = require('path');

  GrammarHelper = (function() {
    function GrammarHelper(rootInputDirectory, rootOutputDirectory) {
      this.rootInputDirectory = rootInputDirectory;
      this.rootOutputDirectory = rootOutputDirectory;
    }

    GrammarHelper.prototype.readGrammarFile = function(file) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var filepath;
          filepath = path.join(__dirname, _this.rootInputDirectory, file);
          return CSON.readFile(filepath, function(error, content) {
            if (error != null) {
              return reject(error);
            } else {
              return resolve(content);
            }
          });
        };
      })(this));
    };

    GrammarHelper.prototype.writeGrammarFile = function(grammar, file) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var outputFilepath;
          outputFilepath = path.join(__dirname, _this.rootOutputDirectory, file);
          return CSON.writeFile(outputFilepath, grammar, function(error, written) {
            if (error != null) {
              return reject(error);
            } else {
              return resolve(written);
            }
          });
        };
      })(this));
    };

    GrammarHelper.prototype.appendPartialGrammars = function(grammar, partialGrammarFiles) {
      return Promise.all(partialGrammarFiles.map((function(_this) {
        return function(grammarFile) {
          return _this.readGrammarFile(grammarFile).then(function(partialGrammar) {
            var key, patterns;
            key = partialGrammar.key, patterns = partialGrammar.patterns;
            if ((key != null) && (patterns != null)) {
              grammar.repository[key] = {
                patterns: patterns
              };
            }
            return partialGrammar;
          });
        };
      })(this)));
    };

    return GrammarHelper;

  })();

  module.exports = GrammarHelper;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1pZ25vcmUvbGliL2dyYW1tYXItaGVscGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFRDtJQUVTLHVCQUFDLGtCQUFELEVBQXNCLG1CQUF0QjtNQUFDLElBQUMsQ0FBQSxxQkFBRDtNQUFxQixJQUFDLENBQUEsc0JBQUQ7SUFBdEI7OzRCQUViLGVBQUEsR0FBaUIsU0FBQyxJQUFEO2FBQ2YsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1YsY0FBQTtVQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBQyxDQUFBLGtCQUF0QixFQUEwQyxJQUExQztpQkFDWCxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsRUFBd0IsU0FBQyxLQUFELEVBQVEsT0FBUjtZQUN0QixJQUFHLGFBQUg7cUJBQWUsTUFBQSxDQUFPLEtBQVAsRUFBZjthQUFBLE1BQUE7cUJBQWlDLE9BQUEsQ0FBUSxPQUFSLEVBQWpDOztVQURzQixDQUF4QjtRQUZVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRGU7OzRCQU1qQixnQkFBQSxHQUFrQixTQUFDLE9BQUQsRUFBVSxJQUFWO2FBQ2hCLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNWLGNBQUE7VUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixLQUFDLENBQUEsbUJBQXRCLEVBQTJDLElBQTNDO2lCQUNqQixJQUFJLENBQUMsU0FBTCxDQUFlLGNBQWYsRUFBK0IsT0FBL0IsRUFBd0MsU0FBQyxLQUFELEVBQVEsT0FBUjtZQUN0QyxJQUFHLGFBQUg7cUJBQWUsTUFBQSxDQUFPLEtBQVAsRUFBZjthQUFBLE1BQUE7cUJBQWlDLE9BQUEsQ0FBUSxPQUFSLEVBQWpDOztVQURzQyxDQUF4QztRQUZVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRGdCOzs0QkFNbEIscUJBQUEsR0FBdUIsU0FBQyxPQUFELEVBQVUsbUJBQVY7YUFDckIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBbUIsQ0FBQyxHQUFwQixDQUF3QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsV0FBRDtpQkFDbEMsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsV0FBakIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLGNBQUQ7QUFDSixnQkFBQTtZQUFDLHdCQUFELEVBQU07WUFDTixJQUFHLGFBQUEsSUFBUyxrQkFBWjtjQUNFLE9BQU8sQ0FBQyxVQUFXLENBQUEsR0FBQSxDQUFuQixHQUNFO2dCQUFBLFFBQUEsRUFBVSxRQUFWO2dCQUZKOzttQkFHQTtVQUxJLENBRFI7UUFEa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLENBQVo7SUFEcUI7Ozs7OztFQVV6QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTdCakIiLCJzb3VyY2VzQ29udGVudCI6WyJDU09OID0gcmVxdWlyZSAnc2Vhc29uJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbmNsYXNzIEdyYW1tYXJIZWxwZXJcblxuICBjb25zdHJ1Y3RvcjogKEByb290SW5wdXREaXJlY3RvcnksIEByb290T3V0cHV0RGlyZWN0b3J5KSAtPlxuXG4gIHJlYWRHcmFtbWFyRmlsZTogKGZpbGUpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGZpbGVwYXRoID0gcGF0aC5qb2luIF9fZGlybmFtZSwgQHJvb3RJbnB1dERpcmVjdG9yeSwgZmlsZVxuICAgICAgQ1NPTi5yZWFkRmlsZSBmaWxlcGF0aCwgKGVycm9yLCBjb250ZW50KSAtPlxuICAgICAgICBpZiBlcnJvcj8gdGhlbiByZWplY3QgZXJyb3IgZWxzZSByZXNvbHZlIGNvbnRlbnRcblxuICB3cml0ZUdyYW1tYXJGaWxlOiAoZ3JhbW1hciwgZmlsZSkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgb3V0cHV0RmlsZXBhdGggPSBwYXRoLmpvaW4gX19kaXJuYW1lLCBAcm9vdE91dHB1dERpcmVjdG9yeSwgZmlsZVxuICAgICAgQ1NPTi53cml0ZUZpbGUgb3V0cHV0RmlsZXBhdGgsIGdyYW1tYXIsIChlcnJvciwgd3JpdHRlbikgLT5cbiAgICAgICAgaWYgZXJyb3I/IHRoZW4gcmVqZWN0IGVycm9yIGVsc2UgcmVzb2x2ZSB3cml0dGVuXG5cbiAgYXBwZW5kUGFydGlhbEdyYW1tYXJzOiAoZ3JhbW1hciwgcGFydGlhbEdyYW1tYXJGaWxlcykgLT5cbiAgICBQcm9taXNlLmFsbCBwYXJ0aWFsR3JhbW1hckZpbGVzLm1hcCAoZ3JhbW1hckZpbGUpID0+XG4gICAgICBAcmVhZEdyYW1tYXJGaWxlIGdyYW1tYXJGaWxlXG4gICAgICAgIC50aGVuIChwYXJ0aWFsR3JhbW1hcikgLT5cbiAgICAgICAgICB7a2V5LCBwYXR0ZXJuc30gPSBwYXJ0aWFsR3JhbW1hclxuICAgICAgICAgIGlmIGtleT8gYW5kIHBhdHRlcm5zP1xuICAgICAgICAgICAgZ3JhbW1hci5yZXBvc2l0b3J5W2tleV0gPVxuICAgICAgICAgICAgICBwYXR0ZXJuczogcGF0dGVybnNcbiAgICAgICAgICBwYXJ0aWFsR3JhbW1hclxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJIZWxwZXJcbiJdfQ==
