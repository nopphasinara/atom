(function() {
  var AutoHideTimer, Logger, PlainMessageView;

  PlainMessageView = null;

  AutoHideTimer = null;

  module.exports = Logger = (function() {
    function Logger(title) {
      this.title = title;
    }

    Logger.prototype.showInPanel = function(message, className) {
      var MessagePanelView, msg, ref;
      if (!this.panel) {
        ref = require("atom-message-panel"), MessagePanelView = ref.MessagePanelView, PlainMessageView = ref.PlainMessageView;
        this.panel = new MessagePanelView({
          title: this.title
        });
      }
      this.panel.attach();
      msg = new PlainMessageView({
        message: message,
        className: className
      });
      this.panel.add(msg);
      this.panel.setSummary({
        summary: message,
        className: className
      });
      this.panel.body.scrollTop(1e10);
      if (atom.config.get("remote-sync.foldLogPanel") && !this.foldedPanel) {
        this.panel.toggle();
        this.foldedPanel = true;
      }
      return msg;
    };

    Logger.prototype.log = function(message) {
      var date, msg, startTime;
      date = new Date;
      startTime = date.getTime();
      message = "[" + (date.toLocaleTimeString()) + "] " + message;
      if (atom.config.get("remote-sync.logToConsole")) {
        console.log(message);
        return function() {
          return console.log(message + " Complete (" + (Date.now() - startTime) + "ms)");
        };
      } else {
        if (AutoHideTimer) {
          clearTimeout(AutoHideTimer);
          AutoHideTimer = null;
        }
        msg = this.showInPanel(message, "text-info");
        return (function(_this) {
          return function() {
            var endMsg;
            endMsg = " Complete (" + (Date.now() - startTime) + "ms)";
            msg.append(endMsg);
            _this.panel.setSummary({
              summary: message + " " + endMsg,
              className: "text-info"
            });
            if (atom.config.get("remote-sync.autoHideLogPanel")) {
              return AutoHideTimer = setTimeout(_this.panel.close.bind(_this.panel), 1000);
            }
          };
        })(this);
      }
    };

    Logger.prototype.error = function(message) {
      return this.showInPanel("" + message, "text-error");
    };

    return Logger;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvTG9nZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZ0JBQUEsR0FBbUI7O0VBQ25CLGFBQUEsR0FBZ0I7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxnQkFBQyxLQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7SUFBRDs7cUJBRWIsV0FBQSxHQUFhLFNBQUMsT0FBRCxFQUFVLFNBQVY7QUFDWCxVQUFBO01BQUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxLQUFSO1FBQ0UsTUFBdUMsT0FBQSxDQUFRLG9CQUFSLENBQXZDLEVBQUMsdUNBQUQsRUFBbUI7UUFDbkIsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLGdCQUFKLENBQ1A7VUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVI7U0FETyxFQUZYOztNQUtBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBO01BQ0EsR0FBQSxHQUFNLElBQUksZ0JBQUosQ0FDSjtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsU0FBQSxFQUFXLFNBRFg7T0FESTtNQUlOLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLEdBQVg7TUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsQ0FDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsU0FBQSxFQUFXLFNBRFg7T0FERjtNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVosQ0FBc0IsSUFBdEI7TUFFQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBQSxJQUFnRCxDQUFJLElBQUMsQ0FBQSxXQUF4RDtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBO1FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUZqQjs7YUFJQTtJQXZCVzs7cUJBeUJiLEdBQUEsR0FBSyxTQUFDLE9BQUQ7QUFDSCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUk7TUFDWCxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBQTtNQUNaLE9BQUEsR0FBVSxHQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQUwsQ0FBQSxDQUFELENBQUgsR0FBOEIsSUFBOUIsR0FBa0M7TUFDNUMsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQUg7UUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7ZUFDQSxTQUFBO2lCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQWUsT0FBRCxHQUFTLGFBQVQsR0FBcUIsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFBLENBQUEsR0FBYSxTQUFkLENBQXJCLEdBQTZDLEtBQTNEO1FBREYsRUFGRjtPQUFBLE1BQUE7UUFLRSxJQUFHLGFBQUg7VUFDRSxZQUFBLENBQWEsYUFBYjtVQUNBLGFBQUEsR0FBZ0IsS0FGbEI7O1FBR0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBYixFQUFzQixXQUF0QjtlQUNOLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7QUFDSSxnQkFBQTtZQUFBLE1BQUEsR0FBUyxhQUFBLEdBQWEsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFBLENBQUEsR0FBYSxTQUFkLENBQWIsR0FBcUM7WUFDOUMsR0FBRyxDQUFDLE1BQUosQ0FBVyxNQUFYO1lBQ0EsS0FBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQ0U7Y0FBQSxPQUFBLEVBQVksT0FBRCxHQUFTLEdBQVQsR0FBWSxNQUF2QjtjQUNBLFNBQUEsRUFBVyxXQURYO2FBREY7WUFHQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBSDtxQkFDRSxhQUFBLEdBQWdCLFVBQUEsQ0FBVyxLQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLEtBQUMsQ0FBQSxLQUFuQixDQUFYLEVBQXNDLElBQXRDLEVBRGxCOztVQU5KO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQVRGOztJQUpHOztxQkFzQkwsS0FBQSxHQUFPLFNBQUMsT0FBRDthQUNMLElBQUMsQ0FBQSxXQUFELENBQWEsRUFBQSxHQUFHLE9BQWhCLEVBQTBCLFlBQTFCO0lBREs7Ozs7O0FBdERUIiwic291cmNlc0NvbnRlbnQiOlsiUGxhaW5NZXNzYWdlVmlldyA9IG51bGxcbkF1dG9IaWRlVGltZXIgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExvZ2dlclxuICBjb25zdHJ1Y3RvcjogKEB0aXRsZSkgLT5cblxuICBzaG93SW5QYW5lbDogKG1lc3NhZ2UsIGNsYXNzTmFtZSkgLT5cbiAgICBpZiBub3QgQHBhbmVsXG4gICAgICB7TWVzc2FnZVBhbmVsVmlldywgUGxhaW5NZXNzYWdlVmlld30gPSByZXF1aXJlIFwiYXRvbS1tZXNzYWdlLXBhbmVsXCJcbiAgICAgIEBwYW5lbCA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3XG4gICAgICAgIHRpdGxlOiBAdGl0bGVcblxuICAgIEBwYW5lbC5hdHRhY2goKVxuICAgIG1zZyA9IG5ldyBQbGFpbk1lc3NhZ2VWaWV3XG4gICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZVxuXG4gICAgQHBhbmVsLmFkZCBtc2dcblxuICAgIEBwYW5lbC5zZXRTdW1tYXJ5XG4gICAgICBzdW1tYXJ5OiBtZXNzYWdlXG4gICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZVxuXG4gICAgQHBhbmVsLmJvZHkuc2Nyb2xsVG9wKDFlMTApXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJyZW1vdGUtc3luYy5mb2xkTG9nUGFuZWxcIikgYW5kIG5vdCBAZm9sZGVkUGFuZWxcbiAgICAgIEBwYW5lbC50b2dnbGUoKVxuICAgICAgQGZvbGRlZFBhbmVsID0gdHJ1ZVxuXG4gICAgbXNnXG5cbiAgbG9nOiAobWVzc2FnZSkgLT5cbiAgICBkYXRlID0gbmV3IERhdGVcbiAgICBzdGFydFRpbWUgPSBkYXRlLmdldFRpbWUoKVxuICAgIG1lc3NhZ2UgPSBcIlsje2RhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAje21lc3NhZ2V9XCJcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJyZW1vdGUtc3luYy5sb2dUb0NvbnNvbGVcIilcbiAgICAgIGNvbnNvbGUubG9nIG1lc3NhZ2VcbiAgICAgICgpLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCIje21lc3NhZ2V9IENvbXBsZXRlICgje0RhdGUubm93KCkgLSBzdGFydFRpbWV9bXMpXCJcbiAgICBlbHNlXG4gICAgICBpZiBBdXRvSGlkZVRpbWVyXG4gICAgICAgIGNsZWFyVGltZW91dCBBdXRvSGlkZVRpbWVyXG4gICAgICAgIEF1dG9IaWRlVGltZXIgPSBudWxsXG4gICAgICBtc2cgPSBAc2hvd0luUGFuZWwgbWVzc2FnZSwgXCJ0ZXh0LWluZm9cIlxuICAgICAgKCk9PlxuICAgICAgICAgIGVuZE1zZyA9IFwiIENvbXBsZXRlICgje0RhdGUubm93KCkgLSBzdGFydFRpbWV9bXMpXCJcbiAgICAgICAgICBtc2cuYXBwZW5kIGVuZE1zZ1xuICAgICAgICAgIEBwYW5lbC5zZXRTdW1tYXJ5XG4gICAgICAgICAgICBzdW1tYXJ5OiBcIiN7bWVzc2FnZX0gI3tlbmRNc2d9XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LWluZm9cIlxuICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldChcInJlbW90ZS1zeW5jLmF1dG9IaWRlTG9nUGFuZWxcIilcbiAgICAgICAgICAgIEF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0IEBwYW5lbC5jbG9zZS5iaW5kKEBwYW5lbCksIDEwMDBcblxuICBlcnJvcjogKG1lc3NhZ2UpIC0+XG4gICAgQHNob3dJblBhbmVsIFwiI3ttZXNzYWdlfVwiLFwidGV4dC1lcnJvclwiXG4iXX0=
