(function() {
  var LessAutocompileView, async, fs, less, mkdirp, path, readline;

  async = require('async');

  fs = require('fs');

  less = require('less');

  mkdirp = require('mkdirp');

  path = require('path');

  readline = require('readline');

  module.exports = LessAutocompileView = (function() {
    function LessAutocompileView(serializeState) {
      atom.commands.add('atom-workspace', {
        'core:save': (function(_this) {
          return function() {
            return _this.handleSave();
          };
        })(this)
      });
    }

    LessAutocompileView.prototype.serialize = function() {};

    LessAutocompileView.prototype.destroy = function() {};

    LessAutocompileView.prototype.handleSave = function() {
      this.activeEditor = atom.workspace.getActiveTextEditor();
      if (this.activeEditor) {
        this.filePath = this.activeEditor.getURI();
        this.fileExt = path.extname(this.filePath);
        if (this.fileExt === '.less') {
          return this.getParams(this.filePath, (function(_this) {
            return function(params) {
              return _this.compileLess(params);
            };
          })(this));
        }
      }
    };

    LessAutocompileView.prototype.writeFiles = function(output, newPath, newFile) {
      return async.series({
        css: (function(_this) {
          return function(callback) {
            if (output.css) {
              return _this.writeFile(output.css, newPath, newFile, function() {
                return callback(null, newFile);
              });
            } else {
              return callback(null, null);
            }
          };
        })(this),
        map: (function(_this) {
          return function(callback) {
            if (output.map) {
              newFile = newFile + ".map";
              return _this.writeFile(output.map, newPath, newFile, function() {
                return callback(null, newFile);
              });
            } else {
              return callback(null, null);
            }
          };
        })(this)
      }, function(err, results) {
        if (err) {
          return atom.notifications.addError(err, {
            dismissable: true
          });
        } else {
          if (results.map !== null) {
            return atom.notifications.addSuccess("Files created", {
              detail: results.css + "\n" + results.map
            });
          } else {
            return atom.notifications.addSuccess("File created", {
              detail: results.css
            });
          }
        }
      });
    };

    LessAutocompileView.prototype.writeFile = function(contentFile, newPath, newFile, callback) {
      return mkdirp(newPath, function(err) {
        if (err) {
          return atom.notifications.addError(err, {
            dismissable: true
          });
        } else {
          return fs.writeFile(newFile, contentFile, callback);
        }
      });
    };

    LessAutocompileView.prototype.compileLess = function(params) {
      var contentFile, firstLine, optionsLess, rl;
      if (!params.out) {
        return;
      }
      firstLine = true;
      contentFile = [];
      optionsLess = {
        paths: [path.dirname(path.resolve(params.file))],
        filename: path.basename(params.file),
        compress: params.compress === 'true' ? true : false,
        sourceMap: params.sourcemap === 'true' ? {} : false
      };
      rl = readline.createInterface({
        input: fs.createReadStream(params.file),
        terminal: false
      });
      rl.on('line', function(line) {
        if (!firstLine) {
          contentFile.push(line);
        }
        return firstLine = false;
      });
      return rl.on('close', (function(_this) {
        return function() {
          return _this.renderLess(params, contentFile, optionsLess);
        };
      })(this));
    };

    LessAutocompileView.prototype.renderLess = function(params, contentFile, optionsLess) {
      contentFile = contentFile.join("\n");
      return less.render(contentFile, optionsLess).then((function(_this) {
        return function(output) {
          var newFile, newPath;
          newFile = path.resolve(path.dirname(params.file), params.out);
          newPath = path.dirname(newFile);
          return _this.writeFiles(output, newPath, newFile);
        };
      })(this), function(err) {
        if (err) {
          return atom.notifications.addError(err.message, {
            detail: err.filename + ":" + err.line,
            dismissable: true
          });
        }
      });
    };

    LessAutocompileView.prototype.getParams = function(filePath, callback) {
      var rl;
      if (!fs.existsSync(filePath)) {
        atom.notifications.addError(filePath + " not exist", {
          dismissable: true
        });
        return;
      }
      this.params = {
        file: filePath
      };
      this.firstLine = true;
      rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        terminal: false
      });
      rl.on('line', (function(_this) {
        return function(line) {
          return _this.parseFirstLine(line);
        };
      })(this));
      return rl.on('close', (function(_this) {
        return function() {
          if (_this.params.main) {
            return _this.getParams(path.resolve(path.dirname(filePath), _this.params.main), callback);
          } else {
            return callback(_this.params);
          }
        };
      })(this));
    };

    LessAutocompileView.prototype.parseFirstLine = function(line) {
      if (!this.firstLine) {
        return;
      }
      this.firstLine = false;
      return line.split(',').forEach((function(_this) {
        return function(item) {
          var i, key, match, value;
          i = item.indexOf(':');
          if (i < 0) {
            return;
          }
          key = item.substr(0, i).trim();
          match = /^\s*\/\/\s*(.+)/.exec(key);
          if (match) {
            key = match[1];
          }
          value = item.substr(i + 1).trim();
          return _this.params[key] = value;
        };
      })(this));
    };

    return LessAutocompileView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sZXNzLWF1dG9jb21waWxlL2xpYi9sZXNzLWF1dG9jb21waWxlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVcsT0FBQSxDQUFRLE9BQVI7O0VBQ1gsRUFBQSxHQUFXLE9BQUEsQ0FBUSxJQUFSOztFQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsTUFBUjs7RUFDWCxNQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0VBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsNkJBQUMsY0FBRDtNQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxXQUFBLEVBQWEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7T0FBcEM7SUFEVzs7a0NBR2IsU0FBQSxHQUFXLFNBQUEsR0FBQTs7a0NBRVgsT0FBQSxHQUFTLFNBQUEsR0FBQTs7a0NBRVQsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFFaEIsSUFBRyxJQUFDLENBQUEsWUFBSjtRQUNFLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQUE7UUFDWixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFFBQWQ7UUFFWCxJQUFHLElBQUMsQ0FBQSxPQUFELEtBQVksT0FBZjtpQkFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLElB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QUFDLElBQTdDLENBQVgsRUFBK0QsUUFBL0QsRUFERjtXQUFBLE1BQUE7bUJBR0UsUUFBQSxDQUFTLEtBQUMsQ0FBQSxNQUFWLEVBSEY7O1FBRGE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7SUFuQlM7O2tDQXlCWCxjQUFBLEdBQWdCLFNBQUMsSUFBRDtNQUNkLElBQVUsQ0FBQyxJQUFDLENBQUEsU0FBWjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYTthQUViLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFlLENBQUMsT0FBaEIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDdEIsY0FBQTtVQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWI7VUFFSixJQUFHLENBQUEsR0FBSSxDQUFQO0FBQ0UsbUJBREY7O1VBR0EsR0FBQSxHQUFNLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLENBQWYsQ0FBaUIsQ0FBQyxJQUFsQixDQUFBO1VBQ04sS0FBQSxHQUFRLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLEdBQXZCO1VBRVIsSUFBRyxLQUFIO1lBQ0UsR0FBQSxHQUFNLEtBQU0sQ0FBQSxDQUFBLEVBRGQ7O1VBR0EsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBQSxHQUFJLENBQWhCLENBQWtCLENBQUMsSUFBbkIsQ0FBQTtpQkFFUixLQUFDLENBQUEsTUFBTyxDQUFBLEdBQUEsQ0FBUixHQUFlO1FBZE87TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO0lBTGM7Ozs7O0FBL0hsQiIsInNvdXJjZXNDb250ZW50IjpbImFzeW5jICAgID0gcmVxdWlyZSAnYXN5bmMnXG5mcyAgICAgICA9IHJlcXVpcmUgJ2ZzJ1xubGVzcyAgICAgPSByZXF1aXJlICdsZXNzJ1xubWtkaXJwICAgPSByZXF1aXJlICdta2RpcnAnXG5wYXRoICAgICA9IHJlcXVpcmUgJ3BhdGgnXG5yZWFkbGluZSA9IHJlcXVpcmUgJ3JlYWRsaW5lJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMZXNzQXV0b2NvbXBpbGVWaWV3XG4gIGNvbnN0cnVjdG9yOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2NvcmU6c2F2ZSc6ID0+IEBoYW5kbGVTYXZlKClcblxuICBzZXJpYWxpemU6IC0+XG5cbiAgZGVzdHJveTogLT5cblxuICBoYW5kbGVTYXZlOiAtPlxuICAgIEBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGlmIEBhY3RpdmVFZGl0b3JcbiAgICAgIEBmaWxlUGF0aCA9IEBhY3RpdmVFZGl0b3IuZ2V0VVJJKClcbiAgICAgIEBmaWxlRXh0ID0gcGF0aC5leHRuYW1lIEBmaWxlUGF0aFxuXG4gICAgICBpZiBAZmlsZUV4dCA9PSAnLmxlc3MnXG4gICAgICAgIEBnZXRQYXJhbXMgQGZpbGVQYXRoLCAocGFyYW1zKSA9PlxuICAgICAgICAgIEBjb21waWxlTGVzcyBwYXJhbXNcblxuICB3cml0ZUZpbGVzOiAob3V0cHV0LCBuZXdQYXRoLCBuZXdGaWxlKSAtPlxuICAgIGFzeW5jLnNlcmllc1xuICAgICAgY3NzOiAoY2FsbGJhY2spID0+XG4gICAgICAgIGlmIG91dHB1dC5jc3NcbiAgICAgICAgICBAd3JpdGVGaWxlIG91dHB1dC5jc3MsIG5ld1BhdGgsIG5ld0ZpbGUsIC0+XG4gICAgICAgICAgICBjYWxsYmFjayBudWxsLCBuZXdGaWxlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYWxsYmFjayBudWxsLCBudWxsXG4gICAgICBtYXA6IChjYWxsYmFjaykgPT5cbiAgICAgICAgaWYgb3V0cHV0Lm1hcFxuICAgICAgICAgIG5ld0ZpbGUgPSBcIiN7bmV3RmlsZX0ubWFwXCJcblxuICAgICAgICAgIEB3cml0ZUZpbGUgb3V0cHV0Lm1hcCwgbmV3UGF0aCwgbmV3RmlsZSwgLT5cbiAgICAgICAgICAgIGNhbGxiYWNrIG51bGwsIG5ld0ZpbGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhbGxiYWNrIG51bGwsIG51bGxcbiAgICAsIChlcnIsIHJlc3VsdHMpIC0+XG4gICAgICBpZiBlcnJcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIGVycixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICBpZiByZXN1bHRzLm1hcCAhPSBudWxsXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJGaWxlcyBjcmVhdGVkXCIsXG4gICAgICAgICAgICBkZXRhaWw6IFwiI3tyZXN1bHRzLmNzc31cXG4je3Jlc3VsdHMubWFwfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyBcIkZpbGUgY3JlYXRlZFwiLFxuICAgICAgICAgICAgZGV0YWlsOiByZXN1bHRzLmNzc1xuXG4gIHdyaXRlRmlsZTogKGNvbnRlbnRGaWxlLCBuZXdQYXRoLCBuZXdGaWxlLCBjYWxsYmFjaykgLT5cbiAgICBta2RpcnAgbmV3UGF0aCwgKGVycikgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgZXJyLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBlbHNlXG4gICAgICAgIGZzLndyaXRlRmlsZSBuZXdGaWxlLCBjb250ZW50RmlsZSwgY2FsbGJhY2tcblxuICBjb21waWxlTGVzczogKHBhcmFtcykgLT5cbiAgICByZXR1cm4gaWYgIXBhcmFtcy5vdXRcblxuICAgIGZpcnN0TGluZSA9IHRydWVcbiAgICBjb250ZW50RmlsZSA9IFtdXG4gICAgb3B0aW9uc0xlc3MgPVxuICAgICAgcGF0aHM6IFtwYXRoLmRpcm5hbWUgcGF0aC5yZXNvbHZlKHBhcmFtcy5maWxlKV1cbiAgICAgIGZpbGVuYW1lOiBwYXRoLmJhc2VuYW1lIHBhcmFtcy5maWxlXG4gICAgICBjb21wcmVzczogaWYgcGFyYW1zLmNvbXByZXNzID09ICd0cnVlJyB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgc291cmNlTWFwOiBpZiBwYXJhbXMuc291cmNlbWFwID09ICd0cnVlJyB0aGVuIHt9IGVsc2UgZmFsc2VcblxuICAgIHJsID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlXG4gICAgICBpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbSBwYXJhbXMuZmlsZVxuICAgICAgdGVybWluYWw6IGZhbHNlXG5cbiAgICBybC5vbiAnbGluZScsIChsaW5lKSAtPlxuICAgICAgaWYgIWZpcnN0TGluZVxuICAgICAgICBjb250ZW50RmlsZS5wdXNoIGxpbmVcblxuICAgICAgZmlyc3RMaW5lID0gZmFsc2VcblxuICAgIHJsLm9uICdjbG9zZScsID0+XG4gICAgICBAcmVuZGVyTGVzcyBwYXJhbXMsIGNvbnRlbnRGaWxlLCBvcHRpb25zTGVzc1xuXG4gIHJlbmRlckxlc3M6IChwYXJhbXMsIGNvbnRlbnRGaWxlLCBvcHRpb25zTGVzcykgLT5cbiAgICBjb250ZW50RmlsZSA9IGNvbnRlbnRGaWxlLmpvaW4gXCJcXG5cIlxuXG4gICAgbGVzcy5yZW5kZXIgY29udGVudEZpbGUsIG9wdGlvbnNMZXNzXG4gICAgICAudGhlbiAob3V0cHV0KSA9PlxuICAgICAgICBuZXdGaWxlID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwYXJhbXMuZmlsZSksIHBhcmFtcy5vdXQpXG4gICAgICAgIG5ld1BhdGggPSBwYXRoLmRpcm5hbWUgbmV3RmlsZVxuXG4gICAgICAgIEB3cml0ZUZpbGVzIG91dHB1dCwgbmV3UGF0aCwgbmV3RmlsZVxuICAgICwgKGVycikgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgZGV0YWlsOiBcIiN7ZXJyLmZpbGVuYW1lfToje2Vyci5saW5lfVwiXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcblxuICBnZXRQYXJhbXM6IChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gICAgaWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIiN7ZmlsZVBhdGh9IG5vdCBleGlzdFwiLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuXG4gICAgICByZXR1cm5cblxuICAgIEBwYXJhbXMgPVxuICAgICAgZmlsZTogZmlsZVBhdGhcblxuICAgIEBmaXJzdExpbmUgPSB0cnVlXG5cbiAgICBybCA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZVxuICAgICAgaW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0gZmlsZVBhdGhcbiAgICAgIHRlcm1pbmFsOiBmYWxzZVxuXG4gICAgcmwub24gJ2xpbmUnLCAobGluZSkgPT5cbiAgICAgIEBwYXJzZUZpcnN0TGluZSBsaW5lXG5cbiAgICBybC5vbiAnY2xvc2UnLCA9PlxuICAgICAgaWYgQHBhcmFtcy5tYWluXG4gICAgICAgIEBnZXRQYXJhbXMgcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlUGF0aCksIEBwYXJhbXMubWFpbiksIGNhbGxiYWNrXG4gICAgICBlbHNlXG4gICAgICAgIGNhbGxiYWNrIEBwYXJhbXNcblxuICBwYXJzZUZpcnN0TGluZTogKGxpbmUpIC0+XG4gICAgcmV0dXJuIGlmICFAZmlyc3RMaW5lXG5cbiAgICBAZmlyc3RMaW5lID0gZmFsc2VcblxuICAgIGxpbmUuc3BsaXQoJywnKS5mb3JFYWNoIChpdGVtKSA9PlxuICAgICAgaSA9IGl0ZW0uaW5kZXhPZiAnOidcblxuICAgICAgaWYgaSA8IDBcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGtleSA9IGl0ZW0uc3Vic3RyKDAsIGkpLnRyaW0oKVxuICAgICAgbWF0Y2ggPSAvXlxccypcXC9cXC9cXHMqKC4rKS8uZXhlYyhrZXkpXG5cbiAgICAgIGlmIG1hdGNoXG4gICAgICAgIGtleSA9IG1hdGNoWzFdXG5cbiAgICAgIHZhbHVlID0gaXRlbS5zdWJzdHIoaSArIDEpLnRyaW0oKVxuXG4gICAgICBAcGFyYW1zW2tleV0gPSB2YWx1ZVxuIl19
