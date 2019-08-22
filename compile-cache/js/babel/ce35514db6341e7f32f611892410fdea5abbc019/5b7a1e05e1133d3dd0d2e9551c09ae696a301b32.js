Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _livereloadView = require('./livereload-view');

var _livereloadView2 = _interopRequireDefault(_livereloadView);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _optionsJson = require('../options.json');

var _optionsJson2 = _interopRequireDefault(_optionsJson);

"use babel";

function createView(self) {
  var view = new _livereloadView2['default']();

  view.addEventListener('toggle', function () {
    var server = self.server;
    if (server.activated) {
      var _ref = ['', '...', 'Stopping LiveReload server...'];

      // turning off the server
      view.url = _ref[0];
      view.text = _ref[1];
      view.tooltip = _ref[2];

      server.stop();
    } else {
      var _ref2 = ['', '...', 'Starting LiveReload server...'];

      // turning on the server
      view.url = _ref2[0];
      view.text = _ref2[1];
      view.tooltip = _ref2[2];

      server.start();
    }
  });

  return view;
}

function createServer(self) {
  var server = new _server2['default']((0, _config2['default'])());

  server.on('newport', function () {
    self.view.tooltip = 'Trying another port...';
  });

  server.on('start', function (port) {
    var view = self.view;

    view.url = (server.config.useHTTPS ? 'https' : 'http') + ('://localhost:' + server.address.port + '/livereload.js');
    view.text = server.address.port;
    view.tooltip = 'Click to copy the URL to clipboard';

    var paths = atom.project.getPaths();
    server.watch(paths);
  });

  server.on('stop', function () {
    var _ref3 = ['', 'Off', 'LiveReload server is currently turned off.'];
    self.view.url = _ref3[0];
    self.view.text = _ref3[1];
    self.view.tooltip = _ref3[2];

    server.unwatch();
  });

  return server;
}

exports['default'] = {
  view: null,
  server: null,
  activated: false,
  config: _optionsJson2['default'],

  activate: function activate(state) {
    this.server = createServer(this);

    this.view = createView(this);
    this.view.initialize(state);
    this.view.attach();

    if (this.server.config.autoStart && !this.server.activated) {
      this.view.dispatchEvent(new Event('toggle'));
    }
  },

  deactivate: function deactivate() {
    if (this.statusBarTile) this.statusBarTile.destory();
    this.statusBarTile = null;

    this.view.detach();
    this.view.destroy();
    if (this.server) {
      this.server.stop();
      this.server = null;
    }
  },

  serialize: function serialize() {
    return { activated: this.server && this.server.activated };
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.statusBarTile = statusBar.addRightTile({ item: this.view, priority: 100 });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvbGl2ZXJlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWtDLE1BQU07OzhCQUNiLG1CQUFtQjs7OztzQkFDM0IsVUFBVTs7OztzQkFDVixVQUFVOzs7OzJCQUNULGlCQUFpQjs7OztBQU5yQyxXQUFXLENBQUM7O0FBUVosU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3hCLE1BQUksSUFBSSxHQUFHLGlDQUFvQixDQUFDOztBQUVoQyxNQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDcEMsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixRQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7aUJBRWtCLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSwrQkFBK0IsQ0FBQzs7O0FBQWpGLFVBQUksQ0FBQyxHQUFHO0FBQUUsVUFBSSxDQUFDLElBQUk7QUFBRSxVQUFJLENBQUMsT0FBTzs7QUFDbEMsWUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2YsTUFBTTtrQkFFaUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLCtCQUErQixDQUFDOzs7QUFBakYsVUFBSSxDQUFDLEdBQUc7QUFBRSxVQUFJLENBQUMsSUFBSTtBQUFFLFVBQUksQ0FBQyxPQUFPOztBQUNsQyxZQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDaEI7R0FDRixDQUFDLENBQUM7O0FBRUgsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDMUIsTUFBSSxNQUFNLEdBQUcsd0JBQVcsMEJBQVEsQ0FBQyxDQUFDOztBQUVsQyxRQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDO0dBQzlDLENBQUMsQ0FB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ZC9saWIvbGl2ZXJlbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgTGl2ZXJlbG9hZFZpZXcgZnJvbSAnLi9saXZlcmVsb2FkLXZpZXcnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgU2VydmVyIGZyb20gJy4vc2VydmVyJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4uL29wdGlvbnMuanNvbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpZXcoc2VsZikge1xuICB2YXIgdmlldyA9IG5ldyBMaXZlcmVsb2FkVmlldygpO1xuXG4gIHZpZXcuYWRkRXZlbnRMaXN0ZW5lcigndG9nZ2xlJywgKCkgPT4ge1xuICAgIHZhciBzZXJ2ZXIgPSBzZWxmLnNlcnZlcjtcbiAgICBpZiAoc2VydmVyLmFjdGl2YXRlZCkge1xuICAgICAgLy8gdHVybmluZyBvZmYgdGhlIHNlcnZlclxuICAgICAgW3ZpZXcudXJsLCB2aWV3LnRleHQsIHZpZXcudG9vbHRpcF0gPSBbJycsICcuLi4nLCAnU3RvcHBpbmcgTGl2ZVJlbG9hZCBzZXJ2ZXIuLi4nXTtcbiAgICAgIHNlcnZlci5zdG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHR1cm5pbmcgb24gdGhlIHNlcnZlclxuICAgICAgW3ZpZXcudXJsLCB2aWV3LnRleHQsIHZpZXcudG9vbHRpcF0gPSBbJycsICcuLi4nLCAnU3RhcnRpbmcgTGl2ZVJlbG9hZCBzZXJ2ZXIuLi4nXTtcbiAgICAgIHNlcnZlci5zdGFydCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHZpZXc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZlcihzZWxmKSB7XG4gIHZhciBzZXJ2ZXIgPSBuZXcgU2VydmVyKGNvbmZpZygpKTtcblxuICBzZXJ2ZXIub24oJ25ld3BvcnQnLCAoKSA9PiB7XG4gICAgc2VsZi52aWV3LnRvb2x0aXAgPSAnVHJ5aW5nIGFub3RoZXIgcG9ydC4uLic7XG4gIH0pO1xuXG4gIHNlcnZlci5vbignc3RhcnQnLCBwb3J0ID0+IHtcbiAgICB2YXIgdmlldyA9IHNlbGYudmlldztcblxuICAgIHZpZXcudXJsID0gKHNlcnZlci5jb25maWcudXNlSFRUUFMgPyAnaHR0cHMnIDogJ2h0dHAnKSArIGA6Ly9sb2NhbGhvc3Q6JHtzZXJ2ZXIuYWRkcmVzcy5wb3J0fS9saXZlcmVsb2FkLmpzYDtcbiAgICB2aWV3LnRleHQgPSBzZXJ2ZXIuYWRkcmVzcy5wb3J0O1xuICAgIHZpZXcudG9vbHRpcCA9ICdDbGljayB0byBjb3B5IHRoZSBVUkwgdG8gY2xpcGJvYXJkJztcblxuICAgIGxldCBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIHNlcnZlci53YXRjaChwYXRocyk7XG4gIH0pO1xuXG4gIHNlcnZlci5vbignc3RvcCcsICgpID0+IHtcbiAgICBbc2VsZi52aWV3LnVybCwgc2VsZi52aWV3LnRleHQsIHNlbGYudmlldy50b29sdGlwXSA9IFsnJywgJ09mZicsICdMaXZlUmVsb2FkIHNlcnZlciBpcyBjdXJyZW50bHkgdHVybmVkIG9mZi4nXTtcbiAgICBzZXJ2ZXIudW53YXRjaCgpO1xuICB9KTtcblxuICByZXR1cm4gc2VydmVyO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdmlldzogbnVsbCxcbiAgc2VydmVyOiBudWxsLFxuICBhY3RpdmF0ZWQ6IGZhbHNlLFxuICBjb25maWc6IG9wdGlvbnMsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICB0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcih0aGlzKTtcblxuICAgIHRoaXMudmlldyA9IGNyZWF0ZVZpZXcodGhpcyk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUoc3RhdGUpO1xuICAgIHRoaXMudmlldy5hdHRhY2goKTtcblxuICAgIGlmICh0aGlzLnNlcnZlci5jb25maWcuYXV0b1N0YXJ0ICYmICF0aGlzLnNlcnZlci5hY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMudmlldy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgndG9nZ2xlJykpO1xuICAgIH1cbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnN0YXR1c0JhclRpbGUpIHRoaXMuc3RhdHVzQmFyVGlsZS5kZXN0b3J5KCk7XG4gICAgdGhpcy5zdGF0dXNCYXJUaWxlID0gbnVsbDtcblxuICAgIHRoaXMudmlldy5kZXRhY2goKTtcbiAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLnNlcnZlcikge1xuICAgICAgdGhpcy5zZXJ2ZXIuc3RvcCgpO1xuICAgICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHsgYWN0aXZhdGVkOiAodGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIuYWN0aXZhdGVkKSAgfTtcbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe2l0ZW06dGhpcy52aWV3LCBwcmlvcml0eToxMDB9KTtcbiAgfVxufTtcbiJdfQ==