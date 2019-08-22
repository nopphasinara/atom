(function() {
  var FTPConnection, FtpTransport, fs, mkdirp, path;

  FTPConnection = null;

  mkdirp = null;

  fs = null;

  path = require("path");

  module.exports = FtpTransport = (function() {
    function FtpTransport(logger, settings, projectPath) {
      this.logger = logger;
      this.settings = settings;
      this.projectPath = projectPath;
    }

    FtpTransport.prototype.dispose = function() {
      if (this.connection) {
        this.connection.end();
        return this.connection = null;
      }
    };

    FtpTransport.prototype["delete"] = function(localFilePath, callback) {
      var errorHandler, targetFilePath;
      targetFilePath = path.join(this.settings.target, path.relative(this.projectPath, localFilePath)).replace(/\\/g, "/");
      errorHandler = (function(_this) {
        return function(err) {
          _this.logger.error(err);
          return callback();
        };
      })(this);
      return this._getConnection((function(_this) {
        return function(err, c) {
          var end;
          if (err) {
            return errorHandler(err);
          }
          end = _this.logger.log("Remote delete: " + targetFilePath + " ...");
          return c["delete"](targetFilePath, function(err) {
            if (err) {
              return errorHandler(err);
            }
            end();
            return callback();
          });
        };
      })(this));
    };

    FtpTransport.prototype.upload = function(localFilePath, callback) {
      var errorHandler, targetFilePath;
      targetFilePath = path.join(this.settings.target, path.relative(this.projectPath, localFilePath)).replace(/\\/g, "/");
      errorHandler = (function(_this) {
        return function(err) {
          _this.logger.error(err);
          return callback();
        };
      })(this);
      return this._getConnection((function(_this) {
        return function(err, c) {
          var end, mpath;
          if (err) {
            return errorHandler(err);
          }
          end = _this.logger.log("Upload: " + localFilePath + " to " + targetFilePath + " ...");
          mpath = path.dirname(targetFilePath);
          return c.mkdir(mpath, true, function(err) {
            if (err && mpath !== "/") {
              return errorHandler(err);
            }
            return c.put(localFilePath, targetFilePath, function(err) {
              if (err) {
                return errorHandler(err);
              }
              end();
              return callback();
            });
          });
        };
      })(this));
    };

    FtpTransport.prototype.download = function(targetFilePath, localFilePath, callback) {
      var errorHandler;
      if (!localFilePath) {
        localFilePath = this.projectPath;
      }
      localFilePath = path.resolve(localFilePath, path.relative(this.settings.target, targetFilePath));
      errorHandler = (function(_this) {
        return function(err) {
          return _this.logger.error(err);
        };
      })(this);
      return this._getConnection((function(_this) {
        return function(err, c) {
          var end;
          if (err) {
            return errorHandler(err);
          }
          end = _this.logger.log("Download: " + targetFilePath + " to " + localFilePath + " ...");
          if (!mkdirp) {
            mkdirp = require("mkdirp");
          }
          return mkdirp(path.dirname(localFilePath), function(err) {
            if (err) {
              return errorHandler(err);
            }
            return c.get(targetFilePath, function(err, readableStream) {
              var writableStream;
              if (err) {
                return errorHandler(err);
              }
              if (!fs) {
                fs = require("fs-plus");
              }
              writableStream = fs.createWriteStream(localFilePath);
              writableStream.on("unpipe", function() {
                end();
                return typeof callback === "function" ? callback() : void 0;
              });
              return readableStream.pipe(writableStream);
            });
          });
        };
      })(this));
    };

    FtpTransport.prototype.fetchFileTree = function(localPath, callback) {
      var isIgnore, targetPath;
      targetPath = path.join(this.settings.target, path.relative(this.projectPath, localPath)).replace(/\\/g, "/");
      isIgnore = this.settings.isIgnore;
      return this._getConnection(function(err, c) {
        var directories, directory, files;
        if (err) {
          return callback(err);
        }
        files = [];
        directories = 0;
        directory = function(dir) {
          directories++;
          return c.list(dir, function(err, list) {
            if (err) {
              return callback(err);
            }
            if (list != null) {
              list.forEach(function(item, i) {
                var ref;
                if (item.type === "-" && !isIgnore(item.name, dir)) {
                  files.push(dir + "/" + item.name);
                }
                if (item.type === "d" && ((ref = item.name) !== "." && ref !== "..")) {
                  return directory(dir + "/" + item.name);
                }
              });
            }
            directories--;
            if (directories === 0) {
              return callback(null, files);
            }
          });
        };
        return directory(targetPath);
      });
    };

    FtpTransport.prototype._getConnection = function(callback) {
      var FtpConnection, connection, hostname, password, port, ref, secure, username, wasReady;
      ref = this.settings, hostname = ref.hostname, port = ref.port, username = ref.username, password = ref.password, secure = ref.secure;
      if (this.connection) {
        return callback(null, this.connection);
      }
      this.logger.log("Connecting: " + username + "@" + hostname + ":" + port);
      if (!FtpConnection) {
        FtpConnection = require("ftp");
      }
      connection = new FtpConnection;
      wasReady = false;
      connection.on("ready", function() {
        wasReady = true;
        return callback(null, connection);
      });
      connection.on("error", (function(_this) {
        return function(err) {
          if (!wasReady) {
            callback(err);
          }
          return _this.connection = null;
        };
      })(this));
      connection.on("end", (function(_this) {
        return function() {
          return _this.connection = null;
        };
      })(this));
      connection.connect({
        host: hostname,
        port: port,
        user: username,
        password: password,
        secure: secure
      });
      return this.connection = connection;
    };

    return FtpTransport;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvdHJhbnNwb3J0cy9GdHBUcmFuc3BvcnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxhQUFBLEdBQWdCOztFQUNoQixNQUFBLEdBQVM7O0VBQ1QsRUFBQSxHQUFLOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msc0JBQUMsTUFBRCxFQUFVLFFBQVYsRUFBcUIsV0FBckI7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLGNBQUQ7SUFBckI7OzJCQUViLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyxJQUFDLENBQUEsVUFBSjtRQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFBO2VBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUZoQjs7SUFETzs7NEJBS1QsUUFBQSxHQUFRLFNBQUMsYUFBRCxFQUFnQixRQUFoQjtBQUNOLFVBQUE7TUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFwQixFQUNXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLFdBQWYsRUFBNEIsYUFBNUIsQ0FEWCxDQUVXLENBQUMsT0FGWixDQUVvQixLQUZwQixFQUUyQixHQUYzQjtNQUlqQixZQUFBLEdBQWUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDYixLQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxHQUFkO2lCQUNBLFFBQUEsQ0FBQTtRQUZhO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQUlmLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0s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QUEsVUFBaEIsRUFEVDs7TUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxjQUFBLEdBQWUsUUFBZixHQUF3QixHQUF4QixHQUEyQixRQUEzQixHQUFvQyxHQUFwQyxHQUF1QyxJQUFuRDtNQUVBLElBQWlDLENBQUksYUFBckM7UUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxLQUFSLEVBQWhCOztNQUVBLFVBQUEsR0FBYSxJQUFJO01BQ2pCLFFBQUEsR0FBVztNQUVYLFVBQVUsQ0FBQyxFQUFYLENBQWMsT0FBZCxFQUF1QixTQUFBO1FBQ3JCLFFBQUEsR0FBVztlQUNYLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZjtNQUZxQixDQUF2QjtNQUlBLFVBQVUsQ0FBQyxFQUFYLENBQWMsT0FBZCxFQUF1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUNyQixJQUFBLENBQU8sUUFBUDtZQUNFLFFBQUEsQ0FBUyxHQUFULEVBREY7O2lCQUVBLEtBQUMsQ0FBQSxVQUFELEdBQWM7UUFITztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7TUFLQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQsRUFBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNuQixLQUFDLENBQUEsVUFBRCxHQUFjO1FBREs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO01BR0EsVUFBVSxDQUFDLE9BQVgsQ0FDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsSUFBQSxFQUFNLElBRE47UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLFFBQUEsRUFBVSxRQUhWO1FBSUEsTUFBQSxFQUFRLE1BSlI7T0FERjthQU9BLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFoQ0E7Ozs7O0FBbkhsQiIsInNvdXJjZXNDb250ZW50IjpbIkZUUENvbm5lY3Rpb24gPSBudWxsXG5ta2RpcnAgPSBudWxsXG5mcyA9IG51bGxcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEZ0cFRyYW5zcG9ydFxuICBjb25zdHJ1Y3RvcjogKEBsb2dnZXIsIEBzZXR0aW5ncywgQHByb2plY3RQYXRoKSAtPlxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgaWYgQGNvbm5lY3Rpb25cbiAgICAgIEBjb25uZWN0aW9uLmVuZCgpXG4gICAgICBAY29ubmVjdGlvbiA9IG51bGxcblxuICBkZWxldGU6IChsb2NhbEZpbGVQYXRoLCBjYWxsYmFjaykgLT5cbiAgICB0YXJnZXRGaWxlUGF0aCA9IHBhdGguam9pbihAc2V0dGluZ3MudGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlbGF0aXZlKEBwcm9qZWN0UGF0aCwgbG9jYWxGaWxlUGF0aCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxuXG4gICAgZXJyb3JIYW5kbGVyID0gKGVycikgPT5cbiAgICAgIEBsb2dnZXIuZXJyb3IgZXJyXG4gICAgICBjYWxsYmFjaygpXG5cbiAgICBAX2dldENvbm5lY3Rpb24gKGVyciwgYykgPT5cbiAgICAgIHJldHVybiBlcnJvckhhbmRsZXIgZXJyIGlmIGVyclxuXG4gICAgICBlbmQgPSBAbG9nZ2VyLmxvZyBcIlJlbW90ZSBkZWxldGU6ICN7dGFyZ2V0RmlsZVBhdGh9IC4uLlwiXG5cbiAgICAgIGMuZGVsZXRlIHRhcmdldEZpbGVQYXRoLCAoZXJyKSAtPlxuICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyIGVyciBpZiBlcnJcblxuICAgICAgICBlbmQoKVxuXG4gICAgICAgIGNhbGxiYWNrKClcblxuICB1cGxvYWQ6IChsb2NhbEZpbGVQYXRoLCBjYWxsYmFjaykgLT5cbiAgICB0YXJnZXRGaWxlUGF0aCA9IHBhdGguam9pbihAc2V0dGluZ3MudGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlbGF0aXZlKEBwcm9qZWN0UGF0aCwgbG9jYWxGaWxlUGF0aCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxuXG4gICAgZXJyb3JIYW5kbGVyID0gKGVycikgPT5cbiAgICAgIEBsb2dnZXIuZXJyb3IgZXJyXG4gICAgICBjYWxsYmFjaygpXG5cbiAgICBAX2dldENvbm5lY3Rpb24gKGVyciwgYykgPT5cbiAgICAgIHJldHVybiBlcnJvckhhbmRsZXIgZXJyIGlmIGVyclxuXG4gICAgICBlbmQgPSBAbG9nZ2VyLmxvZyBcIlVwbG9hZDogI3tsb2NhbEZpbGVQYXRofSB0byAje3RhcmdldEZpbGVQYXRofSAuLi5cIlxuICAgICAgbXBhdGggPSBwYXRoLmRpcm5hbWUodGFyZ2V0RmlsZVBhdGgpXG5cbiAgICAgIGMubWtkaXIgbXBhdGgsIHRydWUsIChlcnIpIC0+XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIgZXJyIGlmIGVyciBhbmQgbXBhdGggIT0gXCIvXCJcblxuICAgICAgICBjLnB1dCBsb2NhbEZpbGVQYXRoLCB0YXJnZXRGaWxlUGF0aCwgKGVycikgLT5cbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyIGVyciBpZiBlcnJcblxuICAgICAgICAgIGVuZCgpXG5cbiAgICAgICAgICBjYWxsYmFjaygpXG5cbiAgZG93bmxvYWQ6ICh0YXJnZXRGaWxlUGF0aCwgbG9jYWxGaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gICAgaWYgbm90IGxvY2FsRmlsZVBhdGhcbiAgICAgIGxvY2FsRmlsZVBhdGggPSBAcHJvamVjdFBhdGhcblxuICAgIGxvY2FsRmlsZVBhdGggPSBwYXRoLnJlc29sdmUobG9jYWxGaWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZWxhdGl2ZShAc2V0dGluZ3MudGFyZ2V0LCB0YXJnZXRGaWxlUGF0aCkpXG5cbiAgICBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PlxuICAgICAgQGxvZ2dlci5lcnJvciBlcnJcblxuICAgIEBfZ2V0Q29ubmVjdGlvbiAoZXJyLCBjKSA9PlxuICAgICAgcmV0dXJuIGVycm9ySGFuZGxlciBlcnIgaWYgZXJyXG5cbiAgICAgIGVuZCA9IEBsb2dnZXIubG9nIFwiRG93bmxvYWQ6ICN7dGFyZ2V0RmlsZVBhdGh9IHRvICN7bG9jYWxGaWxlUGF0aH0gLi4uXCJcblxuICAgICAgbWtkaXJwID0gcmVxdWlyZSBcIm1rZGlycFwiIGlmIG5vdCBta2RpcnBcbiAgICAgIG1rZGlycCBwYXRoLmRpcm5hbWUobG9jYWxGaWxlUGF0aCksIChlcnIpIC0+XG4gICAgICAgIHJldHVybiBlcnJvckhhbmRsZXIgZXJyIGlmIGVyclxuXG4gICAgICAgIGMuZ2V0IHRhcmdldEZpbGVQYXRoLCAoZXJyLCByZWFkYWJsZVN0cmVhbSkgLT5cbiAgICAgICAgICByZXR1cm4gZXJyb3JIYW5kbGVyIGVyciBpZiBlcnJcblxuICAgICAgICAgIGZzID0gcmVxdWlyZSBcImZzLXBsdXNcIiBpZiBub3QgZnNcbiAgICAgICAgICB3cml0YWJsZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGxvY2FsRmlsZVBhdGgpXG4gICAgICAgICAgd3JpdGFibGVTdHJlYW0ub24gXCJ1bnBpcGVcIiwgLT5cbiAgICAgICAgICAgIGVuZCgpXG4gICAgICAgICAgICBjYWxsYmFjaz8oKVxuICAgICAgICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUgd3JpdGFibGVTdHJlYW1cblxuICBmZXRjaEZpbGVUcmVlOiAobG9jYWxQYXRoLCBjYWxsYmFjaykgLT5cbiAgICB0YXJnZXRQYXRoID0gcGF0aC5qb2luKEBzZXR0aW5ncy50YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVsYXRpdmUoQHByb2plY3RQYXRoLCBsb2NhbFBhdGgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcbiAgICBpc0lnbm9yZSA9IEBzZXR0aW5ncy5pc0lnbm9yZVxuXG4gICAgQF9nZXRDb25uZWN0aW9uIChlcnIsIGMpIC0+XG4gICAgICByZXR1cm4gY2FsbGJhY2sgZXJyIGlmIGVyclxuXG4gICAgICBmaWxlcyA9IFtdXG4gICAgICBkaXJlY3RvcmllcyA9IDBcblxuICAgICAgZGlyZWN0b3J5ID0gKGRpcikgLT5cbiAgICAgICAgZGlyZWN0b3JpZXMrK1xuICAgICAgICBjLmxpc3QgZGlyLCAoZXJyLCBsaXN0KSAtPlxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayBlcnIgaWYgZXJyXG5cbiAgICAgICAgICBsaXN0Py5mb3JFYWNoIChpdGVtLCBpKSAtPlxuICAgICAgICAgICAgZmlsZXMucHVzaCBkaXIgKyBcIi9cIiArIGl0ZW0ubmFtZSBpZiBpdGVtLnR5cGUgaXMgXCItXCIgYW5kIG5vdCBpc0lnbm9yZShpdGVtLm5hbWUsIGRpcilcbiAgICAgICAgICAgIGRpcmVjdG9yeSBkaXIgKyBcIi9cIiArIGl0ZW0ubmFtZSBpZiBpdGVtLnR5cGUgaXMgXCJkXCIgYW5kIGl0ZW0ubmFtZSBub3QgaW4gW1wiLlwiLCBcIi4uXCJdXG5cbiAgICAgICAgICBkaXJlY3Rvcmllcy0tXG4gICAgICAgICAgY2FsbGJhY2sgbnVsbCwgZmlsZXMgIGlmIGRpcmVjdG9yaWVzIGlzIDBcblxuICAgICAgZGlyZWN0b3J5KHRhcmdldFBhdGgpXG5cbiAgX2dldENvbm5lY3Rpb246IChjYWxsYmFjaykgLT5cbiAgICB7aG9zdG5hbWUsIHBvcnQsIHVzZXJuYW1lLCBwYXNzd29yZCwgc2VjdXJlfSA9IEBzZXR0aW5nc1xuXG4gICAgaWYgQGNvbm5lY3Rpb25cbiAgICAgIHJldHVybiBjYWxsYmFjayBudWxsLCBAY29ubmVjdGlvblxuXG4gICAgQGxvZ2dlci5sb2cgXCJDb25uZWN0aW5nOiAje3VzZXJuYW1lfUAje2hvc3RuYW1lfToje3BvcnR9XCJcblxuICAgIEZ0cENvbm5lY3Rpb24gPSByZXF1aXJlIFwiZnRwXCIgaWYgbm90IEZ0cENvbm5lY3Rpb25cblxuICAgIGNvbm5lY3Rpb24gPSBuZXcgRnRwQ29ubmVjdGlvblxuICAgIHdhc1JlYWR5ID0gZmFsc2VcblxuICAgIGNvbm5lY3Rpb24ub24gXCJyZWFkeVwiLCAtPlxuICAgICAgd2FzUmVhZHkgPSB0cnVlXG4gICAgICBjYWxsYmFjayBudWxsLCBjb25uZWN0aW9uXG5cbiAgICBjb25uZWN0aW9uLm9uIFwiZXJyb3JcIiwgKGVycikgPT5cbiAgICAgIHVubGVzcyB3YXNSZWFkeVxuICAgICAgICBjYWxsYmFjayBlcnJcbiAgICAgIEBjb25uZWN0aW9uID0gbnVsbFxuXG4gICAgY29ubmVjdGlvbi5vbiBcImVuZFwiLCA9PlxuICAgICAgQGNvbm5lY3Rpb24gPSBudWxsXG5cbiAgICBjb25uZWN0aW9uLmNvbm5lY3RcbiAgICAgIGhvc3Q6IGhvc3RuYW1lXG4gICAgICBwb3J0OiBwb3J0XG4gICAgICB1c2VyOiB1c2VybmFtZVxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICBzZWN1cmU6IHNlY3VyZVxuXG4gICAgQGNvbm5lY3Rpb24gPSBjb25uZWN0aW9uXG4iXX0=
