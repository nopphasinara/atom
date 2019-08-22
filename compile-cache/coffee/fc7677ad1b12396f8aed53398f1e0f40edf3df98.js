(function() {
  var StatusErrorAutocomplete, StatusInProgress, fs, namespace, useStatement;

  fs = require('fs');

  namespace = require('./services/namespace.coffee');

  useStatement = require('./services/use-statement.coffee');

  StatusInProgress = require("./services/status-in-progress.coffee");

  StatusErrorAutocomplete = require("./services/status-error-autocomplete.coffee");

  module.exports = {
    config: {},
    statusInProgress: null,
    statusErrorAutocomplete: null,

    /**
     * Get plugin configuration
     */
    getConfig: function() {
      this.config['php_documentation_base_url'] = {
        functions: 'https://secure.php.net/function.'
      };
      this.config['composer'] = atom.config.get('atom-autocomplete-php.binComposer');
      this.config['php'] = atom.config.get('atom-autocomplete-php.binPhp');
      this.config['autoload'] = atom.config.get('atom-autocomplete-php.autoloadPaths');
      this.config['gotoKey'] = atom.config.get('atom-autocomplete-php.gotoKey');
      this.config['classmap'] = atom.config.get('atom-autocomplete-php.classMapFiles');
      this.config['packagePath'] = atom.packages.resolvePackagePath('atom-autocomplete-php');
      this.config['verboseErrors'] = atom.config.get('atom-autocomplete-php.verboseErrors');
      return this.config['insertNewlinesForUseStatements'] = atom.config.get('atom-autocomplete-php.insertNewlinesForUseStatements');
    },

    /**
     * Writes configuration in "php lib" folder
     */
    writeConfig: function() {
      var classmap, classmaps, file, files, i, j, len, len1, ref, ref1, text;
      this.getConfig();
      files = "";
      ref = this.config.autoload;
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        files += "'" + file + "',";
      }
      classmaps = "";
      ref1 = this.config.classmap;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        classmap = ref1[j];
        classmaps += "'" + classmap + "',";
      }
      text = "<?php $config = array( 'composer' => '" + this.config.composer + "', 'php' => '" + this.config.php + "', 'autoload' => array(" + files + "), 'classmap' => array(" + classmaps + ") );";
      return fs.writeFileSync(this.config.packagePath + '/php/tmp.php', text);
    },

    /**
     * Tests the user's PHP and Composer configuration.
     * @return {bool}
     */
    testConfig: function(interactive) {
      var errorMessage, errorTitle, exec, testResult;
      this.getConfig();
      exec = require("child_process");
      testResult = exec.spawnSync(this.config.php, ["-v"]);
      errorTitle = 'atom-autocomplete-php - Incorrect setup!';
      errorMessage = 'Either PHP or Composer is not correctly set up and as a result PHP autocompletion will not work. ' + 'Please visit the settings screen to correct this error. If you are not specifying an absolute path for PHP or ' + 'Composer, make sure they are in your PATH. Feel free to look package\'s README for configuration examples';
      if (testResult.status = null || testResult.status !== 0) {
        atom.notifications.addError(errorTitle, {
          'detail': errorMessage
        });
        return false;
      }
      testResult = exec.spawnSync(this.config.php, [this.config.composer, "--version"]);
      if (testResult.status = null || testResult.status !== 0) {
        testResult = exec.spawnSync(this.config.composer, ["--version"]);
        if (testResult.status = null || testResult.status !== 0) {
          atom.notifications.addError(errorTitle, {
            'detail': errorMessage
          });
          return false;
        }
      }
      if (interactive) {
        atom.notifications.addSuccess('atom-autocomplete-php - Success', {
          'detail': 'Configuration OK !'
        });
      }
      return true;
    },

    /**
     * Init function called on package activation
     * Register config events and write the first config
     */
    init: function() {
      this.statusInProgress = new StatusInProgress;
      this.statusInProgress.hide();
      this.statusErrorAutocomplete = new StatusErrorAutocomplete;
      this.statusErrorAutocomplete.hide();
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:namespace': (function(_this) {
          return function() {
            return namespace.createNamespace(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:import-use-statement': (function(_this) {
          return function() {
            return useStatement.importUseStatement(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:reindex-project': function() {
          var proxy;
          proxy = require('./services/php-proxy.coffee');
          return proxy.refresh();
        }
      });
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:configuration': (function(_this) {
          return function() {
            return _this.testConfig(true);
          };
        })(this)
      });
      this.writeConfig();
      atom.config.onDidChange('atom-autocomplete-php.binPhp', (function(_this) {
        return function() {
          _this.writeConfig();
          return _this.testConfig(true);
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binComposer', (function(_this) {
        return function() {
          _this.writeConfig();
          return _this.testConfig(true);
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.autoloadPaths', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.gotoKey', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.classMapFiles', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.verboseErrors', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      return atom.config.onDidChange('atom-autocomplete-php.insertNewlinesForUseStatements', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSOztFQUNaLFlBQUEsR0FBZSxPQUFBLENBQVEsaUNBQVI7O0VBQ2YsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNDQUFSOztFQUNuQix1QkFBQSxHQUEwQixPQUFBLENBQVEsNkNBQVI7O0VBRTFCLE1BQU0sQ0FBQyxPQUFQLEdBRUk7SUFBQSxNQUFBLEVBQVEsRUFBUjtJQUNBLGdCQUFBLEVBQWtCLElBRGxCO0lBRUEsdUJBQUEsRUFBeUIsSUFGekI7O0FBSUE7OztJQUdBLFNBQUEsRUFBVyxTQUFBO01BRVAsSUFBQyxDQUFBLE1BQU8sQ0FBQSw0QkFBQSxDQUFSLEdBQXdDO1FBQ3BDLFNBQUEsRUFBVyxrQ0FEeUI7O01BSXhDLElBQUMsQ0FBQSxNQUFPLENBQUEsVUFBQSxDQUFSLEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEI7TUFDdEIsSUFBQyxDQUFBLE1BQU8sQ0FBQSxLQUFBLENBQVIsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQjtNQUNqQixJQUFDLENBQUEsTUFBTyxDQUFBLFVBQUEsQ0FBUixHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCO01BQ3RCLElBQUMsQ0FBQSxNQUFPLENBQUEsU0FBQSxDQUFSLEdBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEI7TUFDckIsSUFBQyxDQUFBLE1BQU8sQ0FBQSxVQUFBLENBQVIsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFa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QUEsQ0FBQSxJQUFBLENBQWhGO0lBOUNFLENBdkZOOztBQVJKIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbm5hbWVzcGFjZSA9IHJlcXVpcmUgJy4vc2VydmljZXMvbmFtZXNwYWNlLmNvZmZlZSdcbnVzZVN0YXRlbWVudCA9IHJlcXVpcmUgJy4vc2VydmljZXMvdXNlLXN0YXRlbWVudC5jb2ZmZWUnXG5TdGF0dXNJblByb2dyZXNzID0gcmVxdWlyZSBcIi4vc2VydmljZXMvc3RhdHVzLWluLXByb2dyZXNzLmNvZmZlZVwiXG5TdGF0dXNFcnJvckF1dG9jb21wbGV0ZSA9IHJlcXVpcmUgXCIuL3NlcnZpY2VzL3N0YXR1cy1lcnJvci1hdXRvY29tcGxldGUuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgY29uZmlnOiB7fVxuICAgIHN0YXR1c0luUHJvZ3Jlc3M6IG51bGxcbiAgICBzdGF0dXNFcnJvckF1dG9jb21wbGV0ZTogbnVsbFxuXG4gICAgIyMjKlxuICAgICAqIEdldCBwbHVnaW4gY29uZmlndXJhdGlvblxuICAgICMjI1xuICAgIGdldENvbmZpZzogKCkgLT5cbiAgICAgICAgIyBTZWUgYWxzbyBodHRwczovL3NlY3VyZS5waHAubmV0L3VybGhvd3RvLnBocCAuXG4gICAgICAgIEBjb25maWdbJ3BocF9kb2N1bWVudGF0aW9uX2Jhc2VfdXJsJ10gPSB7XG4gICAgICAgICAgICBmdW5jdGlvbnM6ICdodHRwczovL3NlY3VyZS5waHAubmV0L2Z1bmN0aW9uLidcbiAgICAgICAgfVxuXG4gICAgICAgIEBjb25maWdbJ2NvbXBvc2VyJ10gPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tYXV0b2NvbXBsZXRlLXBocC5iaW5Db21wb3NlcicpXG4gICAgICAgIEBjb25maWdbJ3BocCddID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWF1dG9jb21wbGV0ZS1waHAuYmluUGhwJylcbiAgICAgICAgQGNvbmZpZ1snYXV0b2xvYWQnXSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1hdXRvY29tcGxldGUtcGhwLmF1dG9sb2FkUGF0aHMnKVxuICAgICAgICBAY29uZmlnWydnb3RvS2V5J10gPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tYXV0b2NvbXBsZXRlLXBocC5nb3RvS2V5JylcbiAgICAgICAgQGNvbmZpZ1snY2xhc3NtYXAnXSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1hdXRvY29tcGxldGUtcGhwLmNsYXNzTWFwRmlsZXMnKVxuICAgICAgICBAY29uZmlnWydwYWNrYWdlUGF0aCddID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2F0b20tYXV0b2NvbXBsZXRlLXBocCcpXG4gICAgICAgIEBjb25maWdbJ3ZlcmJvc2VFcnJvcnMnXSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1hdXRvY29tcGxldGUtcGhwLnZlcmJvc2VFcnJvcnMnKVxuICAgICAgICBAY29uZmlnWydpbnNlcnROZXdsaW5lc0ZvclVzZVN0YXRlbWVudHMnXSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1hdXRvY29tcGxldGUtcGhwLmluc2VydE5ld2xpbmVzRm9yVXNlU3RhdGVtZW50cycpXG5cbiAgICAjIyMqXG4gICAgICogV3JpdGVzIGNvbmZpZ3VyYXRpb24gaW4gXCJwaHAgbGliXCIgZm9sZGVyXG4gICAgIyMjXG4gICAgd3JpdGVDb25maWc6ICgpIC0+XG4gICAgICAgIEBnZXRDb25maWcoKVxuXG4gICAgICAgIGZpbGVzID0gXCJcIlxuICAgICAgICBmb3IgZmlsZSBpbiBAY29uZmlnLmF1dG9sb2FkXG4gICAgICAgICAgICBmaWxlcyArPSBcIicje2ZpbGV9JyxcIlxuXG4gICAgICAgIGNsYXNzbWFwcyA9IFwiXCJcbiAgICAgICAgZm9yIGNsYXNzbWFwIGluIEBjb25maWcuY2xhc3NtYXBcbiAgICAgICAgICAgIGNsYXNzbWFwcyArPSBcIicje2NsYXNzbWFwfScsXCJcblxuICAgICAgICB0ZXh0ID0gXCI8P3BocFxuICAgICAgICAgICRjb25maWcgPSBhcnJheShcbiAgICAgICAgICAgICdjb21wb3NlcicgPT4gJyN7QGNvbmZpZy5jb21wb3Nlcn0nLFxuICAgICAgICAgICAgJ3BocCcgPT4gJyN7QGNvbmZpZy5waHB9JyxcbiAgICAgICAgICAgICdhdXRvbG9hZCcgPT4gYXJyYXkoI3tmaWxlc30pLFxuICAgICAgICAgICAgJ2NsYXNzbWFwJyA9PiBhcnJheSgje2NsYXNzbWFwc30pXG4gICAgICAgICAgKTtcbiAgICAgICAgXCJcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKEBjb25maWcucGFja2FnZVBhdGggKyAnL3BocC90bXAucGhwJywgdGV4dClcblxuICAgICMjIypcbiAgICAgKiBUZXN0cyB0aGUgdXNlcidzIFBIUCBhbmQgQ29tcG9zZXIgY29uZmlndXJhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtib29sfVxuICAgICMjI1xuICAgIHRlc3RDb25maWc6IChpbnRlcmFjdGl2ZSkgLT5cbiAgICAgICAgQGdldENvbmZpZygpXG5cbiAgICAgICAgZXhlYyA9IHJlcXVpcmUgXCJjaGlsZF9wcm9jZXNzXCJcbiAgICAgICAgdGVzdFJlc3VsdCA9IGV4ZWMuc3Bhd25TeW5jKEBjb25maWcucGhwLCBbXCItdlwiXSlcblxuICAgICAgICBlcnJvclRpdGxlID0gJ2F0b20tYXV0b2NvbXBsZXRlLXBocCAtIEluY29ycmVjdCBzZXR1cCEnXG4gICAgICAgIGVycm9yTWVzc2FnZSA9ICdFaXRoZXIgUEhQIG9yIENvbXBvc2VyIGlzIG5vdCBjb3JyZWN0bHkgc2V0IHVwIGFuZCBhcyBhIHJlc3VsdCBQSFAgYXV0b2NvbXBsZXRpb24gd2lsbCBub3Qgd29yay4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB2aXNpdCB0aGUgc2V0dGluZ3Mgc2NyZWVuIHRvIGNvcnJlY3QgdGhpcyBlcnJvci4gSWYgeW91IGFyZSBub3Qgc3BlY2lmeWluZyBhbiBhYnNvbHV0ZSBwYXRoIGZvciBQSFAgb3IgJyArXG4gICAgICAgICAgJ0NvbXBvc2VyLCBtYWtlIHN1cmUgdGhleSBhcmUgaW4geW91ciBQQVRILlxuICAgICAgICAgIEZlZWwgZnJlZSB0byBsb29rIHBhY2thZ2VcXCdzIFJFQURNRSBmb3IgY29uZmlndXJhdGlvbiBleGFtcGxlcydcblxuICAgICAgICBpZiB0ZXN0UmVzdWx0LnN0YXR1cyA9IG51bGwgb3IgdGVzdFJlc3VsdC5zdGF0dXMgIT0gMFxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVycm9yVGl0bGUsIHsnZGV0YWlsJzogZXJyb3JNZXNzYWdlfSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICMgVGVzdCBDb21wb3Nlci5cbiAgICAgICAgdGVzdFJlc3VsdCA9IGV4ZWMuc3Bhd25TeW5jKEBjb25maWcucGhwLCBbQGNvbmZpZy5jb21wb3NlciwgXCItLXZlcnNpb25cIl0pXG5cbiAgICAgICAgaWYgdGVzdFJlc3VsdC5zdGF0dXMgPSBudWxsIG9yIHRlc3RSZXN1bHQuc3RhdHVzICE9IDBcbiAgICAgICAgICAgIHRlc3RSZXN1bHQgPSBleGVjLnNwYXduU3luYyhAY29uZmlnLmNvbXBvc2VyLCBbXCItLXZlcnNpb25cIl0pXG5cbiAgICAgICAgICAgICMgVHJ5IGV4ZWN1dGluZyBDb21wb3NlciBkaXJlY3RseS5cbiAgICAgICAgICAgIGlmIHRlc3RSZXN1bHQuc3RhdHVzID0gbnVsbCBvciB0ZXN0UmVzdWx0LnN0YXR1cyAhPSAwXG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVycm9yVGl0bGUsIHsnZGV0YWlsJzogZXJyb3JNZXNzYWdlfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICBpZiBpbnRlcmFjdGl2ZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ2F0b20tYXV0b2NvbXBsZXRlLXBocCAtIFN1Y2Nlc3MnLCB7J2RldGFpbCc6ICdDb25maWd1cmF0aW9uIE9LICEnfSlcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyMjKlxuICAgICAqIEluaXQgZnVuY3Rpb24gY2FsbGVkIG9uIHBhY2thZ2UgYWN0aXZhdGlvblxuICAgICAqIFJlZ2lzdGVyIGNvbmZpZyBldmVudHMgYW5kIHdyaXRlIHRoZSBmaXJzdCBjb25maWdcbiAgICAjIyNcbiAgICBpbml0OiAoKSAtPlxuICAgICAgICBAc3RhdHVzSW5Qcm9ncmVzcyA9IG5ldyBTdGF0dXNJblByb2dyZXNzXG4gICAgICAgIEBzdGF0dXNJblByb2dyZXNzLmhpZGUoKVxuXG4gICAgICAgIEBzdGF0dXNFcnJvckF1dG9jb21wbGV0ZSA9IG5ldyBTdGF0dXNFcnJvckF1dG9jb21wbGV0ZVxuICAgICAgICBAc3RhdHVzRXJyb3JBdXRvY29tcGxldGUuaGlkZSgpXG5cbiAgICAgICAgIyBDb21tYW5kIGZvciBuYW1lc3BhY2VzXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdhdG9tLWF1dG9jb21wbGV0ZS1waHA6bmFtZXNwYWNlJzogPT5cbiAgICAgICAgICAgIG5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcblxuICAgICAgICAjIENvbW1hbmQgZm9yIGltcG9ydGluZyB1c2Ugc3RhdGVtZW50XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdhdG9tLWF1dG9jb21wbGV0ZS1waHA6aW1wb3J0LXVzZS1zdGF0ZW1lbnQnOiA9PlxuICAgICAgICAgICAgdXNlU3RhdGVtZW50LmltcG9ydFVzZVN0YXRlbWVudChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuXG4gICAgICAgICMgQ29tbWFuZCB0byByZWluZGV4IHRoZSBjdXJyZW50IHByb2plY3RcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2F0b20tYXV0b2NvbXBsZXRlLXBocDpyZWluZGV4LXByb2plY3QnOiAtPlxuICAgICAgICAgICAgcHJveHkgPSByZXF1aXJlICcuL3NlcnZpY2VzL3BocC1wcm94eS5jb2ZmZWUnXG4gICAgICAgICAgICBwcm94eS5yZWZyZXNoKClcblxuICAgICAgICAjIENvbW1hbmQgdG8gdGVzdCBjb25maWd1cmF0aW9uXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdhdG9tLWF1dG9jb21wbGV0ZS1waHA6Y29uZmlndXJhdGlvbic6ID0+XG4gICAgICAgICAgICBAdGVzdENvbmZpZyh0cnVlKVxuXG4gICAgICAgIEB3cml0ZUNvbmZpZygpXG5cbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2F0b20tYXV0b2NvbXBsZXRlLXBocC5iaW5QaHAnLCAoKSA9PlxuICAgICAgICAgICAgQHdyaXRlQ29uZmlnKClcbiAgICAgICAgICAgIEB0ZXN0Q29uZmlnKHRydWUpXG5cbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2F0b20tYXV0b2NvbXBsZXRlLXBocC5iaW5Db21wb3NlcicsICgpID0+XG4gICAgICAgICAgICBAd3JpdGVDb25maWcoKVxuICAgICAgICAgICAgQHRlc3RDb25maWcodHJ1ZSlcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmF1dG9sb2FkUGF0aHMnLCAoKSA9PlxuICAgICAgICAgICAgQHdyaXRlQ29uZmlnKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmdvdG9LZXknLCAoKSA9PlxuICAgICAgICAgICAgQHdyaXRlQ29uZmlnKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmNsYXNzTWFwRmlsZXMnLCAoKSA9PlxuICAgICAgICAgICAgQHdyaXRlQ29uZmlnKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLnZlcmJvc2VFcnJvcnMnLCAoKSA9PlxuICAgICAgICAgICAgQHdyaXRlQ29uZmlnKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmluc2VydE5ld2xpbmVzRm9yVXNlU3RhdGVtZW50cycsICgpID0+XG4gICAgICAgICAgICBAd3JpdGVDb25maWcoKVxuIl19
