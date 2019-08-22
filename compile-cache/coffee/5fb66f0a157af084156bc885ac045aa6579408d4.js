(function() {
  var UploadListener, async, minimatch;

  minimatch = null;

  async = null;

  module.exports = UploadListener = (function() {
    function UploadListener() {}

    UploadListener.prototype.handleSave = function(localFilePath, transport) {
      return this.handleAction(localFilePath, transport, 'upload');
    };

    UploadListener.prototype.handleDelete = function(localFilePath, transport) {
      return this.handleAction(localFilePath, transport, 'delete');
    };

    UploadListener.prototype.handleAction = function(localFilePath, transport, action) {
      var task;
      if (!this.queue) {
        if (!async) {
          async = require("async");
        }
        this.queue = async.queue(this.processFile.bind(this), 1);
      }
      if (this.queue.length()) {
        task = this.queue._tasks.head;
        while (task) {
          if (task.data.localFilePath === localFilePath && task.data.action === action && task.data.transport.settings.transport === transport.settings.transport && task.data.transport.settings.hostname === transport.settings.hostname && task.data.transport.settings.port === transport.settings.port && task.data.transport.settings.target === transport.settings.target) {
            task.data.discard = true;
          }
          task = task.next;
        }
      }
      this.queue.resume();
      return this.queue.push({
        localFilePath: localFilePath,
        transport: transport,
        action: action,
        discard: false
      });
    };

    UploadListener.prototype.processFile = function(task, callback) {
      var action, cb, discard, localFilePath, transport;
      localFilePath = task.localFilePath, transport = task.transport, action = task.action, discard = task.discard;
      cb = (function(_this) {
        return function(err) {
          if (err) {
            _this.queue.pause();
            _this.queue.unshift(task);
          }
          return callback(err);
        };
      })(this);
      if (discard) {
        callback();
        return;
      }
      if (action === 'upload') {
        return transport.upload(localFilePath, cb);
      } else {
        return transport["delete"](localFilePath, cb);
      }
    };

    return UploadListener;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvVXBsb2FkTGlzdGVuZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLEdBQVk7O0VBQ1osS0FBQSxHQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs2QkFDSixVQUFBLEdBQVksU0FBQyxhQUFELEVBQWdCLFNBQWhCO2FBQ1YsSUFBQyxDQUFBLFlBQUQsQ0FBYyxhQUFkLEVBQTZCLFNBQTdCLEVBQXdDLFFBQXhDO0lBRFU7OzZCQUdaLFlBQUEsR0FBYyxTQUFDLGFBQUQsRUFBZ0IsU0FBaEI7YUFDWixJQUFDLENBQUEsWUFBRCxDQUFjLGFBQWQsRUFBNkIsU0FBN0IsRUFBd0MsUUFBeEM7SUFEWTs7NkJBR2QsWUFBQSxHQUFjLFNBQUMsYUFBRCxFQUFnQixTQUFoQixFQUEyQixNQUEzQjtBQUNaLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLEtBQVI7UUFDRSxJQUEyQixDQUFJLEtBQS9CO1VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLEVBQVI7O1FBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsS0FBTixDQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixDQUFaLEVBQWtDLENBQWxDLEVBRlg7O01BS0EsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxDQUFIO1FBQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3JCLGVBQU0sSUFBTjtVQUNDLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFWLEtBQTJCLGFBQTNCLElBQTRDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBVixLQUFvQixNQUFoRSxJQUEwRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBN0IsS0FBMEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUF2SSxJQUFvSixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBN0IsS0FBeUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFoTixJQUE0TixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBN0IsS0FBcUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFwUixJQUE0UixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBN0IsS0FBdUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUF6VjtZQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixHQUFvQixLQUR0Qjs7VUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDO1FBSGIsQ0FGRjs7TUFPQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQTthQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUNFO1FBQUEsYUFBQSxFQUFlLGFBQWY7UUFDQSxTQUFBLEVBQVcsU0FEWDtRQUVBLE1BQUEsRUFBUSxNQUZSO1FBR0EsT0FBQSxFQUFTLEtBSFQ7T0FERjtJQWZZOzs2QkFxQmQsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFFBQVA7QUFDWCxVQUFBO01BQUMsa0NBQUQsRUFBZ0IsMEJBQWhCLEVBQTJCLG9CQUEzQixFQUFtQztNQUVuQyxFQUFBLEdBQUssQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDSCxJQUFHLEdBQUg7WUFDRSxLQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBQTtZQUNBLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQWYsRUFGRjs7aUJBR0EsUUFBQSxDQUFTLEdBQVQ7UUFKRztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7TUFNTCxJQUFHLE9BQUg7UUFDRSxRQUFBLENBQUE7QUFDQSxlQUZGOztNQUlBLElBQUcsTUFBQSxLQUFVLFFBQWI7ZUFDRSxTQUFTLENBQUMsTUFBVixDQUFpQixhQUFqQixFQUFnQyxFQUFoQyxFQURGO09BQUEsTUFBQTtlQUdFLFNBQVMsRUFBQyxNQUFELEVBQVQsQ0FBaUIsYUFBakIsRUFBZ0MsRUFBaEMsRUFIRjs7SUFiVzs7Ozs7QUFoQ2YiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1pbmltYXRjaCA9IG51bGxcbmFzeW5jID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBVcGxvYWRMaXN0ZW5lclxuICBoYW5kbGVTYXZlOiAobG9jYWxGaWxlUGF0aCwgdHJhbnNwb3J0KSAtPlxuICAgIEBoYW5kbGVBY3Rpb24gbG9jYWxGaWxlUGF0aCwgdHJhbnNwb3J0LCAndXBsb2FkJ1xuXG4gIGhhbmRsZURlbGV0ZTogKGxvY2FsRmlsZVBhdGgsIHRyYW5zcG9ydCkgLT5cbiAgICBAaGFuZGxlQWN0aW9uIGxvY2FsRmlsZVBhdGgsIHRyYW5zcG9ydCwgJ2RlbGV0ZSdcblxuICBoYW5kbGVBY3Rpb246IChsb2NhbEZpbGVQYXRoLCB0cmFuc3BvcnQsIGFjdGlvbikgLT5cbiAgICBpZiBub3QgQHF1ZXVlXG4gICAgICBhc3luYyA9IHJlcXVpcmUgXCJhc3luY1wiIGlmIG5vdCBhc3luY1xuICAgICAgQHF1ZXVlID0gYXN5bmMucXVldWUoQHByb2Nlc3NGaWxlLmJpbmQoQCksIDEpXG5cblxuICAgIGlmIEBxdWV1ZS5sZW5ndGgoKVxuICAgICAgdGFzayA9IEBxdWV1ZS5fdGFza3MuaGVhZFxuICAgICAgd2hpbGUgdGFza1xuICAgICAgIGlmIHRhc2suZGF0YS5sb2NhbEZpbGVQYXRoID09IGxvY2FsRmlsZVBhdGggJiYgdGFzay5kYXRhLmFjdGlvbiA9PSBhY3Rpb24gJiYgdGFzay5kYXRhLnRyYW5zcG9ydC5zZXR0aW5ncy50cmFuc3BvcnQgPT0gdHJhbnNwb3J0LnNldHRpbmdzLnRyYW5zcG9ydCAmJiB0YXNrLmRhdGEudHJhbnNwb3J0LnNldHRpbmdzLmhvc3RuYW1lID09IHRyYW5zcG9ydC5zZXR0aW5ncy5ob3N0bmFtZSAmJiB0YXNrLmRhdGEudHJhbnNwb3J0LnNldHRpbmdzLnBvcnQgPT0gdHJhbnNwb3J0LnNldHRpbmdzLnBvcnQgJiYgdGFzay5kYXRhLnRyYW5zcG9ydC5zZXR0aW5ncy50YXJnZXQgPT0gdHJhbnNwb3J0LnNldHRpbmdzLnRhcmdldFxuICAgICAgICAgdGFzay5kYXRhLmRpc2NhcmQgPSB0cnVlXG4gICAgICAgdGFzayA9IHRhc2submV4dFxuXG4gICAgQHF1ZXVlLnJlc3VtZSgpXG5cbiAgICBAcXVldWUucHVzaFxuICAgICAgbG9jYWxGaWxlUGF0aDogbG9jYWxGaWxlUGF0aFxuICAgICAgdHJhbnNwb3J0OiB0cmFuc3BvcnRcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgICBkaXNjYXJkOiBmYWxzZVxuXG4gIHByb2Nlc3NGaWxlOiAodGFzaywgY2FsbGJhY2spIC0+XG4gICAge2xvY2FsRmlsZVBhdGgsIHRyYW5zcG9ydCwgYWN0aW9uLCBkaXNjYXJkfSA9IHRhc2tcblxuICAgIGNiID0gKGVycikgPT5cbiAgICAgIGlmIGVyclxuICAgICAgICBAcXVldWUucGF1c2UoKVxuICAgICAgICBAcXVldWUudW5zaGlmdCB0YXNrXG4gICAgICBjYWxsYmFjayhlcnIpXG5cbiAgICBpZiBkaXNjYXJkXG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGFjdGlvbiA9PSAndXBsb2FkJ1xuICAgICAgdHJhbnNwb3J0LnVwbG9hZCBsb2NhbEZpbGVQYXRoLCBjYlxuICAgIGVsc2VcbiAgICAgIHRyYW5zcG9ydC5kZWxldGUgbG9jYWxGaWxlUGF0aCwgY2JcbiJdfQ==
