(function() {
  var EventEmitter, Host, fs;

  fs = require('fs-plus');

  EventEmitter = require("events").EventEmitter;

  module.exports = Host = (function() {
    function Host(configPath1, logger, emitter1) {
      var data, err, k, settings, v;
      this.configPath = configPath1;
      this.logger = logger;
      this.emitter = emitter1;
      if (!fs.existsSync(this.configPath)) {
        return;
      }
      try {
        data = fs.readFileSync(this.configPath, "utf8");
        settings = JSON.parse(data);
        for (k in settings) {
          v = settings[k];
          this[k] = v;
        }
      } catch (error1) {
        err = error1;
        this.logger.error(err + ", in file: " + this.configPath);
        atom.notifications.addError("RemoteSync Error", {
          dismissable: true,
          detail: "" + err,
          description: "" + this.configPath
        });
        throw error;
      }
      if (this.port == null) {
        this.port = "";
      }
      this.port = this.port.toString();
      if (this.ignore) {
        this.ignore = this.ignore.join(", ");
      }
      if (this.watch) {
        this.watch = this.watch.join(", ");
      }
    }

    Host.prototype.saveJSON = function() {
      var configPath, emitter, val;
      configPath = this.configPath;
      emitter = this.emitter;
      this.configPath = void 0;
      this.emitter = void 0;
      if (this.ignore == null) {
        this.ignore = ".remote-sync.json,.git/**";
      }
      this.ignore = this.ignore.split(',');
      this.ignore = (function() {
        var i, len, ref, results;
        ref = this.ignore;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          val = ref[i];
          if (val) {
            results.push(val.trim());
          }
        }
        return results;
      }).call(this);
      if (this.watch == null) {
        this.watch = "";
      }
      this.watch = this.watch.split(',');
      this.watch = (function() {
        var i, len, ref, results;
        ref = this.watch;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          val = ref[i];
          if (val) {
            results.push(val.trim());
          }
        }
        return results;
      }).call(this);
      if (this.transport == null) {
        this.transport = "scp";
      }
      return fs.writeFile(configPath, JSON.stringify(this, null, 2), function(err) {
        if (err) {
          return console.log("Failed saving file " + configPath);
        } else {
          return emitter.emit('configured');
        }
      });
    };

    return Host;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3JlbW90ZS1zeW5jL2xpYi9tb2RlbC9ob3N0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLFlBQUEsR0FBZSxPQUFBLENBQVEsUUFBUixDQUFpQixDQUFDOztFQUVqQyxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsY0FBQyxXQUFELEVBQWMsTUFBZCxFQUF1QixRQUF2QjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsYUFBRDtNQUFhLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFVBQUQ7TUFDbEMsSUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLFVBQWYsQ0FBWDtBQUFBLGVBQUE7O0FBQ0E7UUFDRSxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBQyxDQUFBLFVBQWpCLEVBQTZCLE1BQTdCO1FBQ1AsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDtBQUNYLGFBQUEsYUFBQTs7VUFDRSxJQUFLLENBQUEsQ0FBQSxDQUFMLEdBQVU7QUFEWixTQUhGO09BQUEsY0FBQTtRQUtNO1FBQ0osSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWlCLEdBQUQsR0FBSyxhQUFMLEdBQWtCLElBQUMsQ0FBQSxVQUFuQztRQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsa0JBQTVCLEVBQ0E7VUFBQyxXQUFBLEVBQWEsSUFBZDtVQUFvQixNQUFBLEVBQVEsRUFBQSxHQUFHLEdBQS9CO1VBQXNDLFdBQUEsRUFBYSxFQUFBLEdBQUcsSUFBQyxDQUFBLFVBQXZEO1NBREE7QUFFQSxjQUFNLE1BVFI7OztRQVdBLElBQUMsQ0FBQSxPQUFPOztNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUE7TUFDUixJQUFnQyxJQUFDLENBQUEsTUFBakM7UUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQWIsRUFBVjs7TUFDQSxJQUErQixJQUFDLENBQUEsS0FBaEM7UUFBQSxJQUFDLENBQUEsS0FBRCxHQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosRUFBVjs7SUFoQlc7O21CQWtCYixRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBO01BQ2QsT0FBQSxHQUFVLElBQUMsQ0FBQTtNQUVYLElBQUMsQ0FBQSxVQUFELEdBQWM7TUFDZCxJQUFDLENBQUEsT0FBRCxHQUFXOztRQUVYLElBQUMsQ0FBQSxTQUFTOztNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsR0FBZDtNQUNWLElBQUMsQ0FBQSxNQUFEOztBQUFXO0FBQUE7YUFBQSxxQ0FBQTs7Y0FBbUM7eUJBQW5DLEdBQUcsQ0FBQyxJQUFKLENBQUE7O0FBQUE7Ozs7UUFFWCxJQUFDLENBQUEsUUFBVTs7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFhLEdBQWI7TUFDWCxJQUFDLENBQUEsS0FBRDs7QUFBWTtBQUFBO2FBQUEscUNBQUE7O2NBQWtDO3lCQUFsQyxHQUFHLENBQUMsSUFBSixDQUFBOztBQUFBOzs7O1FBRVosSUFBQyxDQUFBLFlBQVc7O2FBRVosRUFBRSxDQUFDLFNBQUgsQ0FBYSxVQUFiLEVBQXlCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQixDQUEzQixDQUF6QixFQUF3RCxTQUFDLEdBQUQ7UUFDdEQsSUFBRyxHQUFIO2lCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQUEsR0FBc0IsVUFBbEMsRUFERjtTQUFBLE1BQUE7aUJBR0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxZQUFiLEVBSEY7O01BRHNELENBQXhEO0lBakJROzs7OztBQXZCWiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbkV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEhvc3RcbiAgY29uc3RydWN0b3I6IChAY29uZmlnUGF0aCwgQGxvZ2dlciwgQGVtaXR0ZXIpIC0+XG4gICAgcmV0dXJuIGlmICFmcy5leGlzdHNTeW5jIEBjb25maWdQYXRoXG4gICAgdHJ5XG4gICAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jIEBjb25maWdQYXRoLCBcInV0ZjhcIlxuICAgICAgc2V0dGluZ3MgPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgICBmb3IgaywgdiBvZiBzZXR0aW5nc1xuICAgICAgICB0aGlzW2tdID0gdlxuICAgIGNhdGNoIGVyclxuICAgICAgQGxvZ2dlci5lcnJvciBcIiN7ZXJyfSwgaW4gZmlsZTogI3tAY29uZmlnUGF0aH1cIlxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiUmVtb3RlU3luYyBFcnJvclwiLFxuICAgICAge2Rpc21pc3NhYmxlOiB0cnVlLCBkZXRhaWw6IFwiI3tlcnJ9XCIsIGRlc2NyaXB0aW9uOiBcIiN7QGNvbmZpZ1BhdGh9XCIgfVxuICAgICAgdGhyb3cgZXJyb3JcblxuICAgIEBwb3J0Pz0gXCJcIlxuICAgIEBwb3J0ID0gQHBvcnQudG9TdHJpbmcoKVxuICAgIEBpZ25vcmUgPSBAaWdub3JlLmpvaW4oXCIsIFwiKSBpZiBAaWdub3JlXG4gICAgQHdhdGNoICA9IEB3YXRjaC5qb2luKFwiLCBcIikgaWYgQHdhdGNoXG5cbiAgc2F2ZUpTT046IC0+XG4gICAgY29uZmlnUGF0aCA9IEBjb25maWdQYXRoXG4gICAgZW1pdHRlciA9IEBlbWl0dGVyXG5cbiAgICBAY29uZmlnUGF0aCA9IHVuZGVmaW5lZFxuICAgIEBlbWl0dGVyID0gdW5kZWZpbmVkXG5cbiAgICBAaWdub3JlPz0gXCIucmVtb3RlLXN5bmMuanNvbiwuZ2l0LyoqXCJcbiAgICBAaWdub3JlID0gQGlnbm9yZS5zcGxpdCgnLCcpXG4gICAgQGlnbm9yZSA9ICh2YWwudHJpbSgpIGZvciB2YWwgaW4gQGlnbm9yZSB3aGVuIHZhbClcblxuICAgIEB3YXRjaCAgPz0gXCJcIlxuICAgIEB3YXRjaCAgID0gQHdhdGNoLnNwbGl0KCcsJylcbiAgICBAd2F0Y2ggICA9ICh2YWwudHJpbSgpIGZvciB2YWwgaW4gQHdhdGNoIHdoZW4gdmFsKVxuXG4gICAgQHRyYW5zcG9ydD89XCJzY3BcIlxuXG4gICAgZnMud3JpdGVGaWxlIGNvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsIDIpLCAoZXJyKSAtPlxuICAgICAgaWYgZXJyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkIHNhdmluZyBmaWxlICN7Y29uZmlnUGF0aH1cIilcbiAgICAgIGVsc2VcbiAgICAgICAgZW1pdHRlci5lbWl0ICdjb25maWd1cmVkJ1xuIl19
