(function() {
  var CompositeDisposable, provider;

  CompositeDisposable = require('atom').CompositeDisposable;

  provider = require('./provider');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'PHP Executable Path',
        "default": 'php'
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('autocomplete-php.executablePath', function(executablePath) {
        return provider.executablePath = executablePath;
      }));
      return provider.loadCompletions();
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGhwL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsS0FBQSxFQUFPLHFCQURQO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO09BREY7S0FERjtJQU1BLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlDQUFwQixFQUNqQixTQUFDLGNBQUQ7ZUFDRSxRQUFRLENBQUMsY0FBVCxHQUEwQjtNQUQ1QixDQURpQixDQUFuQjthQUdBLFFBQVEsQ0FBQyxlQUFULENBQUE7SUFMUSxDQU5WO0lBYUEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVLENBYlo7SUFnQkEsV0FBQSxFQUFhLFNBQUE7YUFBRztJQUFILENBaEJiOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnByb3ZpZGVyID0gcmVxdWlyZSAnLi9wcm92aWRlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZXhlY3V0YWJsZVBhdGg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgdGl0bGU6ICdQSFAgRXhlY3V0YWJsZSBQYXRoJ1xuICAgICAgZGVmYXVsdDogJ3BocCcgIyBMZXQgT1MncyAkUEFUSCBoYW5kbGUgdGhlIHJlc3RcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2F1dG9jb21wbGV0ZS1waHAuZXhlY3V0YWJsZVBhdGgnLFxuICAgICAgKGV4ZWN1dGFibGVQYXRoKSAtPlxuICAgICAgICBwcm92aWRlci5leGVjdXRhYmxlUGF0aCA9IGV4ZWN1dGFibGVQYXRoXG4gICAgcHJvdmlkZXIubG9hZENvbXBsZXRpb25zKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIGdldFByb3ZpZGVyOiAtPiBwcm92aWRlclxuIl19
