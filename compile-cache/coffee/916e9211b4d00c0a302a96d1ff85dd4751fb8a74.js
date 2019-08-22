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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvbW9kZWwvaG9zdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxZQUFBLEdBQWUsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQzs7RUFFakMsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGNBQUMsV0FBRCxFQUFjLE1BQWQsRUFBdUIsUUFBdkI7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLGFBQUQ7TUFBYSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxVQUFEO01BQ2xDLElBQVUsQ0FBQyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxVQUFmLENBQVg7QUFBQSxlQUFBOztBQUNBO1FBQ0UsSUFBQSxHQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQUMsQ0FBQSxVQUFqQixFQUE2QixNQUE3QjtRQUNQLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7QUFDWCxhQUFBLGFBQUE7O1VBQ0UsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVO0FBRFosU0FIRjtPQUFBLGNBQUE7UUFLTTtRQUNKLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFpQixHQUFELEdBQUssYUFBTCxHQUFrQixJQUFDLENBQUEsVUFBbkM7UUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLGtCQUE1QixFQUNBO1VBQUMsV0FBQSxFQUFhLElBQWQ7VUFBb0IsTUFBQSxFQUFRLEVBQUEsR0FBRyxHQUEvQjtVQUFzQyxXQUFBLEVBQWEsRUFBQSxHQUFHLElBQUMsQ0FBQSxVQUF2RDtTQURBO0FBRUEsY0FBTSxNQVRSOzs7UUFXQSxJQUFDLENBQUEsT0FBTzs7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO01BQ1IsSUFBZ0MsSUFBQyxDQUFBLE1BQWpDO1FBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLEVBQVY7O01BQ0EsSUFBK0IsSUFBQyxDQUFBLEtBQWhDO1FBQUEsSUFBQyxDQUFBLEtBQUQsR0FBVSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxJQUFaLEVBQVY7O0lBaEJXOzttQkFrQmIsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQTtNQUNkLE9BQUEsR0FBVSxJQUFDLENBQUE7TUFFWCxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLE9BQUQsR0FBVzs7UUFFWCxJQUFDLENBQUEsU0FBUzs7TUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLEdBQWQ7TUFDVixJQUFDLENBQUEsTUFBRDs7QUFBVztBQUFBO2FBQUEscUNBQUE7O2NBQW1DO3lCQUFuQyxHQUFHLENBQUMsSUFBSixDQUFBOztBQUFBOzs7O1FBRVgsSUFBQyxDQUFBLFFBQVU7O01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBYSxHQUFiO01BQ1gsSUFBQyxDQUFBLEtBQUQ7O0FBQVk7QUFBQTthQUFBLHFDQUFBOztjQUFrQzt5QkFBbEMsR0FBRyxDQUFDLElBQUosQ0FBQTs7QUFBQTs7OztRQUVaLElBQUMsQ0FBQSxZQUFXOzthQUVaLEVBQUUsQ0FBQyxTQUFILENBQWEsVUFBYixFQUF5QixJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsQ0FBM0IsQ0FBekIsRUFBd0QsU0FBQyxHQUFEO1FBQ3RELElBQUcsR0FBSDtpQkFDRSxPQUFPLENBQUMsR0FBUixDQUFZLHFCQUFBLEdBQXNCLFVBQWxDLEVBREY7U0FBQSxNQUFBO2lCQUdFLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBYixFQUhGOztNQURzRCxDQUF4RDtJQWpCUTs7Ozs7QUF2QloiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5FdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlclxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBIb3N0XG4gIGNvbnN0cnVjdG9yOiAoQGNvbmZpZ1BhdGgsIEBsb2dnZXIsIEBlbWl0dGVyKSAtPlxuICAgIHJldHVybiBpZiAhZnMuZXhpc3RzU3luYyBAY29uZmlnUGF0aFxuICAgIHRyeVxuICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyBAY29uZmlnUGF0aCwgXCJ1dGY4XCJcbiAgICAgIHNldHRpbmdzID0gSlNPTi5wYXJzZShkYXRhKVxuICAgICAgZm9yIGssIHYgb2Ygc2V0dGluZ3NcbiAgICAgICAgdGhpc1trXSA9IHZcbiAgICBjYXRjaCBlcnJcbiAgICAgIEBsb2dnZXIuZXJyb3IgXCIje2Vycn0sIGluIGZpbGU6ICN7QGNvbmZpZ1BhdGh9XCJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIlJlbW90ZVN5bmMgRXJyb3JcIixcbiAgICAgIHtkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBcIiN7ZXJyfVwiLCBkZXNjcmlwdGlvbjogXCIje0Bjb25maWdQYXRofVwiIH1cbiAgICAgIHRocm93IGVycm9yXG5cbiAgICBAcG9ydD89IFwiXCJcbiAgICBAcG9ydCA9IEBwb3J0LnRvU3RyaW5nKClcbiAgICBAaWdub3JlID0gQGlnbm9yZS5qb2luKFwiLCBcIikgaWYgQGlnbm9yZVxuICAgIEB3YXRjaCAgPSBAd2F0Y2guam9pbihcIiwgXCIpIGlmIEB3YXRjaFxuXG4gIHNhdmVKU09OOiAtPlxuICAgIGNvbmZpZ1BhdGggPSBAY29uZmlnUGF0aFxuICAgIGVtaXR0ZXIgPSBAZW1pdHRlclxuXG4gICAgQGNvbmZpZ1BhdGggPSB1bmRlZmluZWRcbiAgICBAZW1pdHRlciA9IHVuZGVmaW5lZFxuXG4gICAgQGlnbm9yZT89IFwiLnJlbW90ZS1zeW5jLmpzb24sLmdpdC8qKlwiXG4gICAgQGlnbm9yZSA9IEBpZ25vcmUuc3BsaXQoJywnKVxuICAgIEBpZ25vcmUgPSAodmFsLnRyaW0oKSBmb3IgdmFsIGluIEBpZ25vcmUgd2hlbiB2YWwpXG5cbiAgICBAd2F0Y2ggID89IFwiXCJcbiAgICBAd2F0Y2ggICA9IEB3YXRjaC5zcGxpdCgnLCcpXG4gICAgQHdhdGNoICAgPSAodmFsLnRyaW0oKSBmb3IgdmFsIGluIEB3YXRjaCB3aGVuIHZhbClcblxuICAgIEB0cmFuc3BvcnQ/PVwic2NwXCJcblxuICAgIGZzLndyaXRlRmlsZSBjb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCAyKSwgKGVycikgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCBzYXZpbmcgZmlsZSAje2NvbmZpZ1BhdGh9XCIpXG4gICAgICBlbHNlXG4gICAgICAgIGVtaXR0ZXIuZW1pdCAnY29uZmlndXJlZCdcbiJdfQ==
