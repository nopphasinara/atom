(function() {
  var config, exec, fs, md5, process;

  exec = require("child_process");

  process = require("process");

  config = require("../config.coffee");

  md5 = require('md5');

  fs = require('fs');

  module.exports = {
    data: {
      methods: [],
      autocomplete: [],
      composer: null
    },
    currentProcesses: [],

    /**
     * Executes a command to PHP proxy
     * @param  {string}  command  Command to execute
     * @param  {boolean} async    Must be async or not
     * @param  {array}   options  Options for the command
     * @param  {boolean} noparser Do not use php/parser.php
     * @return {array}           Json of the response
     */
    execute: function(command, async, options, noparser) {
      var args, c, commandData, directory, err, i, j, len, len1, processKey, ref, res, stdout;
      if (!options) {
        options = {};
      }
      processKey = command.join("_");
      ref = atom.project.getDirectories();
      for (i = 0, len = ref.length; i < len; i++) {
        directory = ref[i];
        for (j = 0, len1 = command.length; j < len1; j++) {
          c = command[j];
          c.replace(/\\/g, '\\\\');
        }
        if (!async) {
          try {
            if (this.currentProcesses[processKey] == null) {
              this.currentProcesses[processKey] = true;
              args = [__dirname + "/../../php/parser.php", directory.path].concat(command);
              if (noparser) {
                args = command;
              }
              stdout = exec.spawnSync(config.config.php, args, options).output[1].toString('ascii');
              delete this.currentProcesses[processKey];
              if (noparser) {
                res = {
                  result: stdout
                };
              } else {
                res = JSON.parse(stdout);
              }
            }
          } catch (error1) {
            err = error1;
            console.log(err);
            res = {
              error: err
            };
          }
          if (!res) {
            return [];
          }
          if (res.error != null) {
            this.printError(res.error);
          }
          return res;
        } else {
          if (this.currentProcesses[processKey] == null) {
            config.statusErrorAutocomplete.update("Autocomplete failure", false);
            if (processKey.indexOf("--refresh") !== -1) {
              config.statusInProgress.update("Indexing...", true);
            }
            args = [__dirname + "/../../php/parser.php", directory.path].concat(command);
            if (noparser) {
              args = command;
            }
            this.currentProcesses[processKey] = exec.spawn(config.config.php, args, options);
            this.currentProcesses[processKey].on("exit", (function(_this) {
              return function(exitCode) {
                return delete _this.currentProcesses[processKey];
              };
            })(this));
            commandData = '';
            this.currentProcesses[processKey].stdout.on("data", (function(_this) {
              return function(data) {
                return commandData += data.toString();
              };
            })(this));
            this.currentProcesses[processKey].on("close", (function(_this) {
              return function() {
                if (processKey.indexOf("--functions") !== -1) {
                  try {
                    _this.data.functions = JSON.parse(commandData);
                  } catch (error1) {
                    err = error1;
                    config.statusErrorAutocomplete.update("Autocomplete failure", true);
                  }
                }
                if (processKey.indexOf("--refresh") !== -1) {
                  return config.statusInProgress.update("Indexing...", false);
                }
              };
            })(this));
          }
        }
      }
    },

    /**
     * Reads an index by its name (file in indexes/index.[name].json)
     * @param {string} name Name of the index to read
     */
    readIndex: function(name) {
      var crypt, directory, err, i, len, options, path, ref;
      ref = atom.project.getDirectories();
      for (i = 0, len = ref.length; i < len; i++) {
        directory = ref[i];
        crypt = md5(directory.path);
        path = __dirname + "/../../indexes/" + crypt + "/index." + name + ".json";
        try {
          fs.accessSync(path, fs.F_OK | fs.R_OK);
        } catch (error1) {
          err = error1;
          return [];
        }
        options = {
          encoding: 'UTF-8'
        };
        return JSON.parse(fs.readFileSync(path, options));
        break;
      }
    },

    /**
     * Open and read the composer.json file in the current folder
     */
    readComposer: function() {
      var directory, err, i, len, options, path, ref;
      ref = atom.project.getDirectories();
      for (i = 0, len = ref.length; i < len; i++) {
        directory = ref[i];
        path = directory.path + "/composer.json";
        try {
          fs.accessSync(path, fs.F_OK | fs.R_OK);
        } catch (error1) {
          err = error1;
          continue;
        }
        options = {
          encoding: 'UTF-8'
        };
        this.data.composer = JSON.parse(fs.readFileSync(path, options));
        return this.data.composer;
      }
      console.log('Unable to find composer.json file or to open it. The plugin will not work as expected. It only works on composer project');
      throw "Error";
    },

    /**
     * Throw a formatted error
     * @param {object} error Error to show
     */
    printError: function(error) {
      var message;
      this.data.error = true;
      return message = error.message;
    },

    /**
     * Clear all cache of the plugin
     */
    clearCache: function() {
      this.data = {
        error: false,
        autocomplete: [],
        methods: [],
        composer: null
      };
      return this.functions();
    },

    /**
     * Autocomplete for classes name
     * @return {array}
     */
    classes: function() {
      return this.readIndex('classes');
    },

    /**
     * Returns composer.json file
     * @return {Object}
     */
    composer: function() {
      return this.readComposer();
    },

    /**
     * Autocomplete for internal PHP constants
     * @return {array}
     */
    constants: function() {
      var res;
      if (this.data.constants == null) {
        res = this.execute(["--constants"], false);
        this.data.constants = res;
      }
      return this.data.constants;
    },

    /**
     * Autocomplete for internal PHP functions
     *
     * @return {array}
     */
    functions: function() {
      if (this.data.functions == null) {
        this.execute(["--functions"], true);
      }
      return this.data.functions;
    },

    /**
     * Autocomplete for methods & properties of a class
     * @param  {string} className Class complete name (with namespace)
     * @return {array}
     */
    methods: function(className) {
      var res;
      if (this.data.methods[className] == null) {
        res = this.execute(["--methods", "" + className], false);
        this.data.methods[className] = res;
      }
      return this.data.methods[className];
    },

    /**
     * Autocomplete for methods & properties of a class
     * @param  {string} className Class complete name (with namespace)
     * @return {array}
     */
    autocomplete: function(className, name) {
      var cacheKey, res;
      cacheKey = className + "." + name;
      if (this.data.autocomplete[cacheKey] == null) {
        res = this.execute(["--autocomplete", className, name], false);
        this.data.autocomplete[cacheKey] = res;
      }
      return this.data.autocomplete[cacheKey];
    },

    /**
     * Returns params from the documentation of the given function
     *
     * @param {string} className
     * @param {string} functionName
     */
    docParams: function(className, functionName) {
      var res;
      res = this.execute(["--doc-params", "" + className, "" + functionName], false);
      return res;
    },

    /**
     * Refresh the full index or only for the given classPath
     * @param  {string} classPath Full path (dir) of the class to refresh
     */
    refresh: function(classPath) {
      if (classPath == null) {
        return this.execute(["--refresh"], true);
      } else {
        return this.execute(["--refresh", "" + classPath], true);
      }
    },

    /**
     * Method called on plugin activation
     */
    init: function() {
      this.refresh();
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.onDidSave(function(event) {
            var classPath, directory, i, len, path, ref;
            if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
              _this.clearCache();
              path = event.path;
              ref = atom.project.getDirectories();
              for (i = 0, len = ref.length; i < len; i++) {
                directory = ref[i];
                if (path.indexOf(directory.path) === 0) {
                  classPath = path.substr(0, directory.path.length + 1);
                  path = path.substr(directory.path.length + 1);
                  break;
                }
              }
              return _this.refresh(classPath + path.replace(/\\/g, '/'));
            }
          });
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binPhp', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binComposer', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
      return atom.config.onDidChange('atom-autocomplete-php.autoloadPaths', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
    },

    /**
     * Function called when plugin is deactivate
     * Cleanup every request in progress (#330)
     */
    deactivate: function() {
      var key, ref, results;
      ref = this.currentProcesses;
      results = [];
      for (key in ref) {
        process = ref[key];
        results.push(process.kill());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL3BocC1wcm94eS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7RUFDUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0VBQ1YsTUFBQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUjs7RUFDVCxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBQ04sRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQ0k7TUFBQSxPQUFBLEVBQVMsRUFBVDtNQUNBLFlBQUEsRUFBYyxFQURkO01BRUEsUUFBQSxFQUFVLElBRlY7S0FESjtJQUtBLGdCQUFBLEVBQWtCLEVBTGxCOztBQU9BOzs7Ozs7OztJQVFBLE9BQUEsRUFBUyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLE9BQWpCLEVBQTBCLFFBQTFCO0FBQ0wsVUFBQTtNQUFBLElBQWdCLENBQUksT0FBcEI7UUFBQSxPQUFBLEdBQVUsR0FBVjs7TUFDQSxVQUFBLEdBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiO0FBRWI7QUFBQSxXQUFBLHFDQUFBOztBQUNJLGFBQUEsMkNBQUE7O1VBQ0ksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLEVBQWlCLE1BQWpCO0FBREo7UUFHQSxJQUFHLENBQUksS0FBUDtBQUNJO1lBRUksSUFBTyx5Q0FBUDtjQUNJLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxVQUFBLENBQWxCLEdBQWdDO2NBRWhDLElBQUEsR0FBUSxDQUFDLFNBQUEsR0FBWSx1QkFBYixFQUF1QyxTQUFTLENBQUMsSUFBakQsQ0FBc0QsQ0FBQyxNQUF2RCxDQUE4RCxPQUE5RDtjQUNSLElBQUcsUUFBSDtnQkFDSSxJQUFBLEdBQU8sUUFEWDs7Y0FFQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQTdCLEVBQWtDLElBQWxDLEVBQXdDLE9BQXhDLENBQWdELENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQTNELENBQW9FLE9BQXBFO2NBRVQsT0FBTyxJQUFDLENBQUEsZ0JBQWlCLENBQUEsVUFBQTtjQUV6QixJQUFHLFFBQUg7Z0JBQ0ksR0FBQSxHQUNJO2tCQUFBLE1BQUEsRUFBUSxNQUFSO2tCQUZSO2VBQUEsTUFBQTtnQkFJSSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLEVBSlY7ZUFWSjthQUZKO1dBQUEsY0FBQTtZQWlCTTtZQUNGLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWjtZQUNBLEdBQUEsR0FDSTtjQUFBLEtBQUEsRUFBTyxHQUFQO2NBcEJSOztVQXNCQSxJQUFHLENBQUMsR0FBSjtBQUNJLG1CQUFPLEdBRFg7O1VBR0EsSUFBRyxpQkFBSDtZQUNJLElBQUMsQ0FBQSxVQUFELENBQVksR0FBRyxDQUFDLEtBQWhCLEVBREo7O0FBR0EsaUJBQU8sSUE3Qlg7U0FBQSxNQUFBO1VBK0JJLElBQU8seUNBQVA7WUFDSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsTUFBL0IsQ0FBc0Msc0JBQXRDLEVBQThELEtBQTlEO1lBRUEsSUFBRyxVQUFVLENBQUMsT0FBWCxDQUFtQixXQUFuQixDQUFBLEtBQW1DLENBQUMsQ0FBdkM7Y0FDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBeEIsQ0FBK0IsYUFBL0IsRUFBOEMsSUFBOUMsRUFESjs7WUFHQSxJQUFBLEdBQVEsQ0FBQyxTQUFBLEdBQVksdUJBQWIsRUFBdUMsU0FBUyxDQUFDLElBQWpELENBQXNELENBQUMsTUFBdkQsQ0FBOEQsT0FBOUQ7WUFDUixJQUFHLFFBQUg7Y0FDSSxJQUFBLEdBQU8sUUFEWDs7WUFHQSxJQUFDLENBQUEsZ0JBQWlCLENBQUEsVUFBQSxDQUFsQixHQUFnQyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBekIsRUFBOEIsSUFBOUIsRUFBb0MsT0FBcEM7WUFDaEMsSUFBQyxDQUFBLGdCQUFpQixDQUFBLFVBQUEsQ0FBVyxDQUFDLEVBQTlCLENBQWlDLE1BQWpDLEVBQXlDLENBQUEsU0FBQSxLQUFBO3FCQUFBLFNBQUMsUUFBRDt1QkFDckMsT0FBTyxLQUFDLENBQUEsZ0JBQWlCLENBQUEsVUFBQTtjQURZO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QztZQUlBLFdBQUEsR0FBYztZQUNkLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxVQUFBLENBQVcsQ0FBQyxNQUFNLENBQUMsRUFBckMsQ0FBd0MsTUFBeEMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7cUJBQUEsU0FBQyxJQUFEO3VCQUM1QyxXQUFBLElBQWUsSUFBSSxDQUFDLFFBQUwsQ0FBQTtjQUQ2QjtZQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQ7WUFJQSxJQUFDLENBQUEsZ0JBQWlCLENBQUEsVUFBQSxDQUFXLENBQUMsRUFBOUIsQ0FBaUMsT0FBakMsRUFBMEMsQ0FBQSxTQUFBLEtBQUE7cUJBQUEsU0FBQTtnQkFDdEMsSUFBRyxVQUFVLENBQUMsT0FBWCxDQUFtQixhQUFuQixDQUFBLEtBQXFDLENBQUMsQ0FBekM7QUFDSTtvQkFDSSxLQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLEVBRHRCO21CQUFBLGNBQUE7b0JBRU07b0JBQ0YsTUFBTSxDQUFDLHVCQUF1QixDQUFDLE1BQS9CLENBQXNDLHNCQUF0QyxFQUE4RCxJQUE5RCxFQUhKO21CQURKOztnQkFNQSxJQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFdBQW5CLENBQUEsS0FBbUMsQ0FBQyxDQUF2Qzt5QkFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBeEIsQ0FBK0IsYUFBL0IsRUFBOEMsS0FBOUMsRUFESjs7Y0FQc0M7WUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLEVBcEJKO1dBL0JKOztBQUpKO0lBSkssQ0FmVDs7QUFxRkE7Ozs7SUFJQSxTQUFBLEVBQVcsU0FBQyxJQUFEO0FBQ1AsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDSSxLQUFBLEdBQVEsR0FBQSxDQUFJLFNBQVMsQ0FBQyxJQUFkO1FBQ1IsSUFBQSxHQUFPLFNBQUEsR0FBWSxpQkFBWixHQUFnQyxLQUFoQyxHQUF3QyxTQUF4QyxHQUFvRCxJQUFwRCxHQUEyRDtBQUNsRTtVQUNJLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxFQUFvQixFQUFFLENBQUMsSUFBSCxHQUFVLEVBQUUsQ0FBQyxJQUFqQyxFQURKO1NBQUEsY0FBQTtVQUVNO0FBQ0YsaUJBQU8sR0FIWDs7UUFLQSxPQUFBLEdBQ0k7VUFBQSxRQUFBLEVBQVUsT0FBVjs7QUFDSixlQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsQ0FBWDtBQUVQO0FBWko7SUFETyxDQXpGWDs7QUF3R0E7OztJQUdBLFlBQUEsRUFBYyxTQUFBO0FBQ1YsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDSSxJQUFBLEdBQVUsU0FBUyxDQUFDLElBQVgsR0FBZ0I7QUFFekI7VUFDSSxFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsRUFBb0IsRUFBRSxDQUFDLElBQUgsR0FBVSxFQUFFLENBQUMsSUFBakMsRUFESjtTQUFBLGNBQUE7VUFFTTtBQUNGLG1CQUhKOztRQUtBLE9BQUEsR0FDSTtVQUFBLFFBQUEsRUFBVSxPQUFWOztRQUNKLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixHQUFpQixJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQWhCLEVBQXNCLE9BQXRCLENBQVg7QUFDakIsZUFBTyxJQUFDLENBQUEsSUFBSSxDQUFDO0FBWGpCO01BYUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwwSEFBWjtBQUNBLFlBQU07SUFmSSxDQTNHZDs7QUE0SEE7Ozs7SUFJQSxVQUFBLEVBQVcsU0FBQyxLQUFEO0FBQ1AsVUFBQTtNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjO2FBQ2QsT0FBQSxHQUFVLEtBQUssQ0FBQztJQUZULENBaElYOztBQXlJQTs7O0lBR0EsVUFBQSxFQUFZLFNBQUE7TUFDUixJQUFDLENBQUEsSUFBRCxHQUNJO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFDQSxZQUFBLEVBQWMsRUFEZDtRQUVBLE9BQUEsRUFBUyxFQUZUO1FBR0EsUUFBQSxFQUFVLElBSFY7O2FBTUosSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQVJRLENBNUlaOztBQXNKQTs7OztJQUlBLE9BQUEsRUFBUyxTQUFBO0FBQ0wsYUFBTyxJQUFDLENBQUEsU0FBRCxDQUFXLFNBQVg7SUFERixDQTFKVDs7QUE2SkE7Ozs7SUFJQSxRQUFBLEVBQVUsU0FBQTtBQUNOLGFBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQURELENBaktWOztBQW9LQTs7OztJQUlBLFNBQUEsRUFBVyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQU8sMkJBQVA7UUFDSSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLGFBQUQsQ0FBVCxFQUEwQixLQUExQjtRQUNOLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixJQUZ0Qjs7QUFJQSxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUM7SUFMTixDQXhLWDs7QUErS0E7Ozs7O0lBS0EsU0FBQSxFQUFXLFNBQUE7TUFDUCxJQUFPLDJCQUFQO1FBQ0ksSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLGFBQUQsQ0FBVCxFQUEwQixJQUExQixFQURKOztBQUdBLGFBQU8sSUFBQyxDQUFBLElBQUksQ0FBQztJQUpOLENBcExYOztBQTBMQTs7Ozs7SUFLQSxPQUFBLEVBQVMsU0FBQyxTQUFEO0FBQ0wsVUFBQTtNQUFBLElBQU8sb0NBQVA7UUFDSSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLFdBQUQsRUFBYSxFQUFBLEdBQUcsU0FBaEIsQ0FBVCxFQUF1QyxLQUF2QztRQUNOLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBZCxHQUEyQixJQUYvQjs7QUFJQSxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBUSxDQUFBLFNBQUE7SUFMaEIsQ0EvTFQ7O0FBc01BOzs7OztJQUtBLFlBQUEsRUFBYyxTQUFDLFNBQUQsRUFBWSxJQUFaO0FBQ1YsVUFBQTtNQUFBLFFBQUEsR0FBVyxTQUFBLEdBQVksR0FBWixHQUFrQjtNQUU3QixJQUFPLHdDQUFQO1FBQ0ksR0FBQSxHQUFNLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQyxnQkFBRCxFQUFtQixTQUFuQixFQUE4QixJQUE5QixDQUFULEVBQThDLEtBQTlDO1FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFhLENBQUEsUUFBQSxDQUFuQixHQUErQixJQUZuQzs7QUFJQSxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBYSxDQUFBLFFBQUE7SUFQaEIsQ0EzTWQ7O0FBb05BOzs7Ozs7SUFNQSxTQUFBLEVBQVcsU0FBQyxTQUFELEVBQVksWUFBWjtBQUNQLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLGNBQUQsRUFBaUIsRUFBQSxHQUFHLFNBQXBCLEVBQWlDLEVBQUEsR0FBRyxZQUFwQyxDQUFULEVBQThELEtBQTlEO0FBQ04sYUFBTztJQUZBLENBMU5YOztBQThOQTs7OztJQUlBLE9BQUEsRUFBUyxTQUFDLFNBQUQ7TUFDTCxJQUFPLGlCQUFQO2VBQ0ksSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLFdBQUQsQ0FBVCxFQUF3QixJQUF4QixFQURKO09BQUEsTUFBQTtlQUdJLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQyxXQUFELEVBQWMsRUFBQSxHQUFHLFNBQWpCLENBQVQsRUFBd0MsSUFBeEMsRUFISjs7SUFESyxDQWxPVDs7QUF3T0E7OztJQUdBLElBQUEsRUFBTSxTQUFBO01BQ0YsSUFBQyxDQUFBLE9BQUQsQ0FBQTtNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQzlCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUMsS0FBRDtBQUVmLGdCQUFBO1lBQUEsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLEtBQTlCLENBQW9DLGdCQUFwQyxDQUFIO2NBQ0ksS0FBQyxDQUFBLFVBQUQsQ0FBQTtjQUlBLElBQUEsR0FBTyxLQUFLLENBQUM7QUFDYjtBQUFBLG1CQUFBLHFDQUFBOztnQkFDSSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBUyxDQUFDLElBQXZCLENBQUEsS0FBZ0MsQ0FBbkM7a0JBQ0ksU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBZixHQUFzQixDQUFyQztrQkFDWixJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQWYsR0FBc0IsQ0FBbEM7QUFDUCx3QkFISjs7QUFESjtxQkFNQSxLQUFDLENBQUEsT0FBRCxDQUFTLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsR0FBcEIsQ0FBckIsRUFaSjs7VUFGZSxDQUFqQjtRQUQ4QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7TUFrQkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDhCQUF4QixFQUF3RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BELEtBQUMsQ0FBQSxVQUFELENBQUE7UUFEb0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhEO01BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLG1DQUF4QixFQUE2RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3pELEtBQUMsQ0FBQSxVQUFELENBQUE7UUFEeUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdEO2FBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHFDQUF4QixFQUErRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzNELEtBQUMsQ0FBQSxVQUFELENBQUE7UUFEMkQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9EO0lBMUJFLENBM09OOztBQXdRQTs7OztJQUlBLFVBQUEsRUFBWSxTQUFBO0FBQ1IsVUFBQTtBQUFBO0FBQUE7V0FBQSxVQUFBOztxQkFDSSxPQUFPLENBQUMsSUFBUixDQUFBO0FBREo7O0lBRFEsQ0E1UVo7O0FBUEoiLCJzb3VyY2VzQ29udGVudCI6WyJleGVjID0gcmVxdWlyZSBcImNoaWxkX3Byb2Nlc3NcIlxucHJvY2VzcyA9IHJlcXVpcmUgXCJwcm9jZXNzXCJcbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWcuY29mZmVlXCJcbm1kNSA9IHJlcXVpcmUgJ21kNSdcbmZzID0gcmVxdWlyZSAnZnMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBkYXRhOlxuICAgICAgICBtZXRob2RzOiBbXSxcbiAgICAgICAgYXV0b2NvbXBsZXRlOiBbXSxcbiAgICAgICAgY29tcG9zZXI6IG51bGxcblxuICAgIGN1cnJlbnRQcm9jZXNzZXM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogRXhlY3V0ZXMgYSBjb21tYW5kIHRvIFBIUCBwcm94eVxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gIGNvbW1hbmQgIENvbW1hbmQgdG8gZXhlY3V0ZVxuICAgICAqIEBwYXJhbSAge2Jvb2xlYW59IGFzeW5jICAgIE11c3QgYmUgYXN5bmMgb3Igbm90XG4gICAgICogQHBhcmFtICB7YXJyYXl9ICAgb3B0aW9ucyAgT3B0aW9ucyBmb3IgdGhlIGNvbW1hbmRcbiAgICAgKiBAcGFyYW0gIHtib29sZWFufSBub3BhcnNlciBEbyBub3QgdXNlIHBocC9wYXJzZXIucGhwXG4gICAgICogQHJldHVybiB7YXJyYXl9ICAgICAgICAgICBKc29uIG9mIHRoZSByZXNwb25zZVxuICAgICMjI1xuICAgIGV4ZWN1dGU6IChjb21tYW5kLCBhc3luYywgb3B0aW9ucywgbm9wYXJzZXIpIC0+XG4gICAgICAgIG9wdGlvbnMgPSB7fSBpZiBub3Qgb3B0aW9uc1xuICAgICAgICBwcm9jZXNzS2V5ID0gY29tbWFuZC5qb2luKFwiX1wiKVxuXG4gICAgICAgIGZvciBkaXJlY3RvcnkgaW4gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgICAgICAgIGZvciBjIGluIGNvbW1hbmRcbiAgICAgICAgICAgICAgICBjLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcblxuICAgICAgICAgICAgaWYgbm90IGFzeW5jXG4gICAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgICAgICMgYXZvaWQgbXVsdGlwbGUgcHJvY2Vzc2VzIG9mIHRoZSBzYW1lIGNvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IEBjdXJyZW50UHJvY2Vzc2VzW3Byb2Nlc3NLZXldP1xuICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRQcm9jZXNzZXNbcHJvY2Vzc0tleV0gPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSAgW19fZGlybmFtZSArIFwiLy4uLy4uL3BocC9wYXJzZXIucGhwXCIsICBkaXJlY3RvcnkucGF0aF0uY29uY2F0KGNvbW1hbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3BhcnNlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBjb21tYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGRvdXQgPSBleGVjLnNwYXduU3luYyhjb25maWcuY29uZmlnLnBocCwgYXJncywgb3B0aW9ucykub3V0cHV0WzFdLnRvU3RyaW5nKCdhc2NpaScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBAY3VycmVudFByb2Nlc3Nlc1twcm9jZXNzS2V5XVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3BhcnNlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogc3Rkb3V0XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gSlNPTi5wYXJzZShzdGRvdXQpXG4gICAgICAgICAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIGVyclxuICAgICAgICAgICAgICAgICAgICByZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuXG4gICAgICAgICAgICAgICAgaWYgIXJlc1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW11cblxuICAgICAgICAgICAgICAgIGlmIHJlcy5lcnJvcj9cbiAgICAgICAgICAgICAgICAgICAgQHByaW50RXJyb3IocmVzLmVycm9yKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIG5vdCBAY3VycmVudFByb2Nlc3Nlc1twcm9jZXNzS2V5XT9cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnN0YXR1c0Vycm9yQXV0b2NvbXBsZXRlLnVwZGF0ZShcIkF1dG9jb21wbGV0ZSBmYWlsdXJlXCIsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIHByb2Nlc3NLZXkuaW5kZXhPZihcIi0tcmVmcmVzaFwiKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnN0YXR1c0luUHJvZ3Jlc3MudXBkYXRlKFwiSW5kZXhpbmcuLi5cIiwgdHJ1ZSlcblxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gIFtfX2Rpcm5hbWUgKyBcIi8uLi8uLi9waHAvcGFyc2VyLnBocFwiLCAgZGlyZWN0b3J5LnBhdGhdLmNvbmNhdChjb21tYW5kKVxuICAgICAgICAgICAgICAgICAgICBpZiBub3BhcnNlclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGNvbW1hbmRcblxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudFByb2Nlc3Nlc1twcm9jZXNzS2V5XSA9IGV4ZWMuc3Bhd24oY29uZmlnLmNvbmZpZy5waHAsIGFyZ3MsIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50UHJvY2Vzc2VzW3Byb2Nlc3NLZXldLm9uKFwiZXhpdFwiLCAoZXhpdENvZGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgQGN1cnJlbnRQcm9jZXNzZXNbcHJvY2Vzc0tleV1cbiAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmREYXRhID0gJydcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRQcm9jZXNzZXNbcHJvY2Vzc0tleV0uc3Rkb3V0Lm9uKFwiZGF0YVwiLCAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmREYXRhICs9IGRhdGEudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRQcm9jZXNzZXNbcHJvY2Vzc0tleV0ub24oXCJjbG9zZVwiLCAoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgcHJvY2Vzc0tleS5pbmRleE9mKFwiLS1mdW5jdGlvbnNcIikgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGRhdGEuZnVuY3Rpb25zID0gSlNPTi5wYXJzZShjb21tYW5kRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCBlcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnN0YXR1c0Vycm9yQXV0b2NvbXBsZXRlLnVwZGF0ZShcIkF1dG9jb21wbGV0ZSBmYWlsdXJlXCIsIHRydWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHByb2Nlc3NLZXkuaW5kZXhPZihcIi0tcmVmcmVzaFwiKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5zdGF0dXNJblByb2dyZXNzLnVwZGF0ZShcIkluZGV4aW5nLi4uXCIsIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICApXG5cbiAgICAjIyMqXG4gICAgICogUmVhZHMgYW4gaW5kZXggYnkgaXRzIG5hbWUgKGZpbGUgaW4gaW5kZXhlcy9pbmRleC5bbmFtZV0uanNvbilcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBpbmRleCB0byByZWFkXG4gICAgIyMjXG4gICAgcmVhZEluZGV4OiAobmFtZSkgLT5cbiAgICAgICAgZm9yIGRpcmVjdG9yeSBpbiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICAgICAgY3J5cHQgPSBtZDUoZGlyZWN0b3J5LnBhdGgpXG4gICAgICAgICAgICBwYXRoID0gX19kaXJuYW1lICsgXCIvLi4vLi4vaW5kZXhlcy9cIiArIGNyeXB0ICsgXCIvaW5kZXguXCIgKyBuYW1lICsgXCIuanNvblwiXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBmcy5hY2Nlc3NTeW5jKHBhdGgsIGZzLkZfT0sgfCBmcy5SX09LKVxuICAgICAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgICAgICAgIGVuY29kaW5nOiAnVVRGLTgnXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aCwgb3B0aW9ucykpXG5cbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAjIyMqXG4gICAgICogT3BlbiBhbmQgcmVhZCB0aGUgY29tcG9zZXIuanNvbiBmaWxlIGluIHRoZSBjdXJyZW50IGZvbGRlclxuICAgICMjI1xuICAgIHJlYWRDb21wb3NlcjogKCkgLT5cbiAgICAgICAgZm9yIGRpcmVjdG9yeSBpbiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICAgICAgcGF0aCA9IFwiI3tkaXJlY3RvcnkucGF0aH0vY29tcG9zZXIuanNvblwiXG5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGZzLmFjY2Vzc1N5bmMocGF0aCwgZnMuRl9PSyB8IGZzLlJfT0spXG4gICAgICAgICAgICBjYXRjaCBlcnJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBvcHRpb25zID1cbiAgICAgICAgICAgICAgICBlbmNvZGluZzogJ1VURi04J1xuICAgICAgICAgICAgQGRhdGEuY29tcG9zZXIgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLCBvcHRpb25zKSlcbiAgICAgICAgICAgIHJldHVybiBAZGF0YS5jb21wb3NlclxuXG4gICAgICAgIGNvbnNvbGUubG9nICdVbmFibGUgdG8gZmluZCBjb21wb3Nlci5qc29uIGZpbGUgb3IgdG8gb3BlbiBpdC4gVGhlIHBsdWdpbiB3aWxsIG5vdCB3b3JrIGFzIGV4cGVjdGVkLiBJdCBvbmx5IHdvcmtzIG9uIGNvbXBvc2VyIHByb2plY3QnXG4gICAgICAgIHRocm93IFwiRXJyb3JcIlxuXG4gICAgIyMjKlxuICAgICAqIFRocm93IGEgZm9ybWF0dGVkIGVycm9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yIEVycm9yIHRvIHNob3dcbiAgICAjIyNcbiAgICBwcmludEVycm9yOihlcnJvcikgLT5cbiAgICAgICAgQGRhdGEuZXJyb3IgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlXG5cbiAgICAgICAgI2lmIGVycm9yLmZpbGU/IGFuZCBlcnJvci5saW5lP1xuICAgICAgICAgICAgI21lc3NhZ2UgPSBtZXNzYWdlICsgJyBbZnJvbSBmaWxlICcgKyBlcnJvci5maWxlICsgJyAtIExpbmUgJyArIGVycm9yLmxpbmUgKyAnXSdcblxuICAgICAgICAjdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG5cbiAgICAjIyMqXG4gICAgICogQ2xlYXIgYWxsIGNhY2hlIG9mIHRoZSBwbHVnaW5cbiAgICAjIyNcbiAgICBjbGVhckNhY2hlOiAoKSAtPlxuICAgICAgICBAZGF0YSA9XG4gICAgICAgICAgICBlcnJvcjogZmFsc2UsXG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IFtdLFxuICAgICAgICAgICAgbWV0aG9kczogW10sXG4gICAgICAgICAgICBjb21wb3NlcjogbnVsbFxuXG4gICAgICAgICMgRmlsbCB0aGUgZnVuY3Rpb25zIGFycmF5IGJlY2F1c2UgaXQgY2FuIHRha2UgdGltZXNcbiAgICAgICAgQGZ1bmN0aW9ucygpXG5cbiAgICAjIyMqXG4gICAgICogQXV0b2NvbXBsZXRlIGZvciBjbGFzc2VzIG5hbWVcbiAgICAgKiBAcmV0dXJuIHthcnJheX1cbiAgICAjIyNcbiAgICBjbGFzc2VzOiAoKSAtPlxuICAgICAgICByZXR1cm4gQHJlYWRJbmRleCgnY2xhc3NlcycpXG5cbiAgICAjIyMqXG4gICAgICogUmV0dXJucyBjb21wb3Nlci5qc29uIGZpbGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgIyMjXG4gICAgY29tcG9zZXI6ICgpIC0+XG4gICAgICAgIHJldHVybiBAcmVhZENvbXBvc2VyKClcblxuICAgICMjIypcbiAgICAgKiBBdXRvY29tcGxldGUgZm9yIGludGVybmFsIFBIUCBjb25zdGFudHNcbiAgICAgKiBAcmV0dXJuIHthcnJheX1cbiAgICAjIyNcbiAgICBjb25zdGFudHM6ICgpIC0+XG4gICAgICAgIGlmIG5vdCBAZGF0YS5jb25zdGFudHM/XG4gICAgICAgICAgICByZXMgPSBAZXhlY3V0ZShbXCItLWNvbnN0YW50c1wiXSwgZmFsc2UpXG4gICAgICAgICAgICBAZGF0YS5jb25zdGFudHMgPSByZXNcblxuICAgICAgICByZXR1cm4gQGRhdGEuY29uc3RhbnRzXG5cbiAgICAjIyMqXG4gICAgICogQXV0b2NvbXBsZXRlIGZvciBpbnRlcm5hbCBQSFAgZnVuY3Rpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHthcnJheX1cbiAgICAjIyNcbiAgICBmdW5jdGlvbnM6ICgpIC0+XG4gICAgICAgIGlmIG5vdCBAZGF0YS5mdW5jdGlvbnM/XG4gICAgICAgICAgICBAZXhlY3V0ZShbXCItLWZ1bmN0aW9uc1wiXSwgdHJ1ZSlcblxuICAgICAgICByZXR1cm4gQGRhdGEuZnVuY3Rpb25zXG5cbiAgICAjIyMqXG4gICAgICogQXV0b2NvbXBsZXRlIGZvciBtZXRob2RzICYgcHJvcGVydGllcyBvZiBhIGNsYXNzXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgY29tcGxldGUgbmFtZSAod2l0aCBuYW1lc3BhY2UpXG4gICAgICogQHJldHVybiB7YXJyYXl9XG4gICAgIyMjXG4gICAgbWV0aG9kczogKGNsYXNzTmFtZSkgLT5cbiAgICAgICAgaWYgbm90IEBkYXRhLm1ldGhvZHNbY2xhc3NOYW1lXT9cbiAgICAgICAgICAgIHJlcyA9IEBleGVjdXRlKFtcIi0tbWV0aG9kc1wiLFwiI3tjbGFzc05hbWV9XCJdLCBmYWxzZSlcbiAgICAgICAgICAgIEBkYXRhLm1ldGhvZHNbY2xhc3NOYW1lXSA9IHJlc1xuXG4gICAgICAgIHJldHVybiBAZGF0YS5tZXRob2RzW2NsYXNzTmFtZV1cblxuICAgICMjIypcbiAgICAgKiBBdXRvY29tcGxldGUgZm9yIG1ldGhvZHMgJiBwcm9wZXJ0aWVzIG9mIGEgY2xhc3NcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyBjb21wbGV0ZSBuYW1lICh3aXRoIG5hbWVzcGFjZSlcbiAgICAgKiBAcmV0dXJuIHthcnJheX1cbiAgICAjIyNcbiAgICBhdXRvY29tcGxldGU6IChjbGFzc05hbWUsIG5hbWUpIC0+XG4gICAgICAgIGNhY2hlS2V5ID0gY2xhc3NOYW1lICsgXCIuXCIgKyBuYW1lXG5cbiAgICAgICAgaWYgbm90IEBkYXRhLmF1dG9jb21wbGV0ZVtjYWNoZUtleV0/XG4gICAgICAgICAgICByZXMgPSBAZXhlY3V0ZShbXCItLWF1dG9jb21wbGV0ZVwiLCBjbGFzc05hbWUsIG5hbWVdLCBmYWxzZSlcbiAgICAgICAgICAgIEBkYXRhLmF1dG9jb21wbGV0ZVtjYWNoZUtleV0gPSByZXNcblxuICAgICAgICByZXR1cm4gQGRhdGEuYXV0b2NvbXBsZXRlW2NhY2hlS2V5XVxuXG4gICAgIyMjKlxuICAgICAqIFJldHVybnMgcGFyYW1zIGZyb20gdGhlIGRvY3VtZW50YXRpb24gb2YgdGhlIGdpdmVuIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgICMjI1xuICAgIGRvY1BhcmFtczogKGNsYXNzTmFtZSwgZnVuY3Rpb25OYW1lKSAtPlxuICAgICAgICByZXMgPSBAZXhlY3V0ZShbXCItLWRvYy1wYXJhbXNcIiwgXCIje2NsYXNzTmFtZX1cIiwgXCIje2Z1bmN0aW9uTmFtZX1cIl0sIGZhbHNlKVxuICAgICAgICByZXR1cm4gcmVzXG5cbiAgICAjIyMqXG4gICAgICogUmVmcmVzaCB0aGUgZnVsbCBpbmRleCBvciBvbmx5IGZvciB0aGUgZ2l2ZW4gY2xhc3NQYXRoXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBjbGFzc1BhdGggRnVsbCBwYXRoIChkaXIpIG9mIHRoZSBjbGFzcyB0byByZWZyZXNoXG4gICAgIyMjXG4gICAgcmVmcmVzaDogKGNsYXNzUGF0aCkgLT5cbiAgICAgICAgaWYgbm90IGNsYXNzUGF0aD9cbiAgICAgICAgICAgIEBleGVjdXRlKFtcIi0tcmVmcmVzaFwiXSwgdHJ1ZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGV4ZWN1dGUoW1wiLS1yZWZyZXNoXCIsIFwiI3tjbGFzc1BhdGh9XCJdLCB0cnVlKVxuXG4gICAgIyMjKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgb24gcGx1Z2luIGFjdGl2YXRpb25cbiAgICAjIyNcbiAgICBpbml0OiAoKSAtPlxuICAgICAgICBAcmVmcmVzaCgpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkU2F2ZSgoZXZlbnQpID0+XG4gICAgICAgICAgICAgICMgT25seSAucGhwIGZpbGVcbiAgICAgICAgICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2ggL3RleHQuaHRtbC5waHAkL1xuICAgICAgICAgICAgICAgICAgQGNsZWFyQ2FjaGUoKVxuXG4gICAgICAgICAgICAgICAgICAjIEZvciBXaW5kb3dzIC0gUmVwbGFjZSBcXCBpbiBjbGFzcyBuYW1lc3BhY2UgdG8gLyBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICAjIGNvbXBvc2VyIHVzZSAvIGluc3RlYWQgb2YgXFxcbiAgICAgICAgICAgICAgICAgIHBhdGggPSBldmVudC5wYXRoXG4gICAgICAgICAgICAgICAgICBmb3IgZGlyZWN0b3J5IGluIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICAgICAgICAgICAgICAgICAgaWYgcGF0aC5pbmRleE9mKGRpcmVjdG9yeS5wYXRoKSA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzUGF0aCA9IHBhdGguc3Vic3RyKDAsIGRpcmVjdG9yeS5wYXRoLmxlbmd0aCsxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoZGlyZWN0b3J5LnBhdGgubGVuZ3RoKzEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICAgICAgIEByZWZyZXNoKGNsYXNzUGF0aCArIHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdG9tLWF1dG9jb21wbGV0ZS1waHAuYmluUGhwJywgKCkgPT5cbiAgICAgICAgICAgIEBjbGVhckNhY2hlKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmJpbkNvbXBvc2VyJywgKCkgPT5cbiAgICAgICAgICAgIEBjbGVhckNhY2hlKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXRvbS1hdXRvY29tcGxldGUtcGhwLmF1dG9sb2FkUGF0aHMnLCAoKSA9PlxuICAgICAgICAgICAgQGNsZWFyQ2FjaGUoKVxuXG4gICAgIyMjKlxuICAgICAqIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHBsdWdpbiBpcyBkZWFjdGl2YXRlXG4gICAgICogQ2xlYW51cCBldmVyeSByZXF1ZXN0IGluIHByb2dyZXNzICgjMzMwKVxuICAgICMjI1xuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICAgIGZvciBrZXksIHByb2Nlc3Mgb2YgQGN1cnJlbnRQcm9jZXNzZXNcbiAgICAgICAgICAgIHByb2Nlc3Mua2lsbCgpXG4iXX0=
