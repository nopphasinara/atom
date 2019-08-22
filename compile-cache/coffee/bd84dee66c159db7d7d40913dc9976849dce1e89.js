(function() {
  var CompositeDisposable, FileHyperclick, mfs, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  mfs = require('match-files');

  path = require('path');

  module.exports = FileHyperclick = {
    subscriptions: null,
    config: {
      directories: {
        description: "directories under project paths that may contain the file",
        type: 'array',
        "default": ['/lib/src', '/ext/src']
      },
      extension: {
        description: "extension name of the file",
        type: 'string',
        "default": '.coffee'
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
    },
    getProvider: function() {
      return {
        providerName: 'file-hyperclick',
        getSuggestionForWord: function(editor, text, range) {
          return {
            range: range,
            callback: function() {
              var dirs, subDirs;
              dirs = atom.project.getPaths();
              subDirs = atom.config.get('file-hyperclick.directories');
              dirs.forEach(function(dir) {
                subDirs.forEach(function(subDir) {
                  var options, sdir;
                  sdir = path.join(dir, subDir);
                  options = {
                    fileFilters: [
                      function(path) {
                        var file;
                        file = text + atom.config.get('file-hyperclick.extension');
                        return path.slice(-file.length) === file;
                      }
                    ]
                  };
                  mfs.find(sdir, options, function(err, files) {
                    if (files[0] && !err) {
                      atom.workspace.open(files[0]);
                    }
                  });
                });
              });
            }
          };
        }
      };
    },
    deactivate: function() {
      this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9maWxlLWh5cGVyY2xpY2svbGliL2ZpbGUtaHlwZXJjbGljay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxhQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLE1BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSwyREFBYjtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLFVBQUQsRUFBWSxVQUFaLENBRlQ7T0FERjtNQUlBLFNBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSw0QkFBYjtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQUZUO09BTEY7S0FGRjtJQVdBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO0lBRGIsQ0FYVjtJQWVBLFdBQUEsRUFBYSxTQUFBO2FBQ1g7UUFBQSxZQUFBLEVBQWMsaUJBQWQ7UUFDQSxvQkFBQSxFQUFzQixTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsS0FBZjtpQkFDcEI7WUFBQSxLQUFBLEVBQU8sS0FBUDtZQUFjLFFBQUEsRUFBVSxTQUFBO0FBQ3RCLGtCQUFBO2NBQUEsSUFBQSxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBaEIsQ0FBQTtjQUNQLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCO2NBQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLEdBQUQ7Z0JBQ1gsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBQyxNQUFEO0FBQ2Qsc0JBQUE7a0JBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLE1BQWY7a0JBQ1AsT0FBQSxHQUNFO29CQUFBLFdBQUEsRUFBYTtzQkFDWCxTQUFDLElBQUQ7QUFDRSw0QkFBQTt3QkFBQSxJQUFBLEdBQU8sSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEI7K0JBQ2QsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUksQ0FBQyxNQUFqQixDQUFBLEtBQTRCO3NCQUY5QixDQURXO3FCQUFiOztrQkFLRixHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsRUFBZSxPQUFmLEVBQXdCLFNBQUMsR0FBRCxFQUFNLEtBQU47b0JBQ3RCLElBQWdDLEtBQU0sQ0FBQSxDQUFBLENBQU4sSUFBYSxDQUFJLEdBQWpEO3NCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFNLENBQUEsQ0FBQSxDQUExQixFQUFBOztrQkFEc0IsQ0FBeEI7Z0JBUmMsQ0FBaEI7Y0FEVyxDQUFiO1lBSHNCLENBQXhCOztRQURvQixDQUR0Qjs7SUFEVyxDQWZiO0lBcUNBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEVSxDQXJDWjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIiMgY29mZmVlbGludDogZGlzYWJsZT1tYXhfbGluZV9sZW5ndGhcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5tZnMgPSByZXF1aXJlICdtYXRjaC1maWxlcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGVIeXBlcmNsaWNrID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25maWc6XG4gICAgZGlyZWN0b3JpZXM6XG4gICAgICBkZXNjcmlwdGlvbjogXCJkaXJlY3RvcmllcyB1bmRlciBwcm9qZWN0IHBhdGhzIHRoYXQgbWF5IGNvbnRhaW4gdGhlIGZpbGVcIixcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbJy9saWIvc3JjJywnL2V4dC9zcmMnXVxuICAgIGV4dGVuc2lvbjpcbiAgICAgIGRlc2NyaXB0aW9uOiBcImV4dGVuc2lvbiBuYW1lIG9mIHRoZSBmaWxlXCIsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcuY29mZmVlJ1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHJldHVyblxuXG4gIGdldFByb3ZpZGVyOiAtPlxuICAgIHByb3ZpZGVyTmFtZTogJ2ZpbGUtaHlwZXJjbGljaycsXG4gICAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQ6IChlZGl0b3IsIHRleHQsIHJhbmdlKSAtPlxuICAgICAgcmFuZ2U6IHJhbmdlLCBjYWxsYmFjazogLT5cbiAgICAgICAgZGlycyA9IGRvIGF0b20ucHJvamVjdC5nZXRQYXRoc1xuICAgICAgICBzdWJEaXJzID0gYXRvbS5jb25maWcuZ2V0ICdmaWxlLWh5cGVyY2xpY2suZGlyZWN0b3JpZXMnXG4gICAgICAgIGRpcnMuZm9yRWFjaCAoZGlyKSAtPlxuICAgICAgICAgIHN1YkRpcnMuZm9yRWFjaCAoc3ViRGlyKSAtPlxuICAgICAgICAgICAgc2RpciA9IHBhdGguam9pbiBkaXIsIHN1YkRpclxuICAgICAgICAgICAgb3B0aW9ucyA9XG4gICAgICAgICAgICAgIGZpbGVGaWx0ZXJzOiBbXG4gICAgICAgICAgICAgICAgKHBhdGgpIC0+XG4gICAgICAgICAgICAgICAgICBmaWxlID0gdGV4dCArIGF0b20uY29uZmlnLmdldCAnZmlsZS1oeXBlcmNsaWNrLmV4dGVuc2lvbidcbiAgICAgICAgICAgICAgICAgIHBhdGguc2xpY2UoLWZpbGUubGVuZ3RoKSBpcyBmaWxlXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIG1mcy5maW5kIHNkaXIsIG9wdGlvbnMsIChlcnIsIGZpbGVzKSAtPlxuICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVzWzBdIGlmIGZpbGVzWzBdIGFuZCBub3QgZXJyXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIHJldHVyblxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgcmV0dXJuXG4iXX0=
