Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fayeWebsocket = require('faye-websocket');

var _fayeWebsocket2 = _interopRequireDefault(_fayeWebsocket);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var PROTOCOL_CONN_CHECK_1 = 'http://livereload.com/protocols/connection-check-1';
var PROTOCOL_MONITORING_7 = 'http://livereload.com/protocols/official-7';
var PROTOCOL_SAVING_1 = 'http://livereload.com/protocols/saving-1';

var Server = (function (_EventEmitter) {
  _inherits(Server, _EventEmitter);

  // client url

  function Server(config) {
    _classCallCheck(this, Server);

    _get(Object.getPrototypeOf(Server.prototype), 'constructor', this).call(this);
    this.paths = [];
    this.sockets = [];
    this.app = null;
    this.watcher = null;
    this._url = '';
    this.config = _lodash2['default'].assign({}, config);
    this.paths = [];
  }

  _createClass(Server, [{
    key: 'initServer',
    value: function initServer() {
      var _this = this;

      var config = this.config;

      if (config.https === null) {
        this.app = _http2['default'].createServer(this.handleRequest);
      } else {
        this.app = _https2['default'].createServer(config.https, this.handleRequest);
      }

      this.app.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
          setTimeout(_this.start.bind(_this, 0), 100);

          _this.debug('LiveReload: port ' + _this.config.port + ' already in use. Trying another port...');
          _this.emit('newport');
        }
      });

      this.app.on('listening', function () {
        _this.debug('LiveReload: listening on port ' + _this.address.port + '.');
        _this.emit('start');
      });

      this.app.on('upgrade', function (request, socket, body) {
        if (!_fayeWebsocket2['default'].isWebSocket(request)) return;
        var ws = new _fayeWebsocket2['default'](request, socket, body);

        ws.on('message', function (event) {
          var data = event.data,
              json;
          try {
            json = JSON.parse(event.data);
            if (typeof json.command === 'string') {
              _this.handleCommand(json);
            }
          } catch (e) {}
        });

        ws.on('close', function (event) {
          _this.sockets = _this.sockets.filter(function (sock) {
            return sock !== ws;
          });
          ws = null;
        });

        _this.sockets.push(ws);
      });
    }
  }, {
    key: 'start',
    value: function start(port) {
      if (typeof port === 'undefined') {
        port = this.config.port;
      }
      if (!this.app) {
        this.initServer();
      }
      this.app.listen(port);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.app) {
        this.app.close();
        this.app = null;
      }

      this.sockets = [];
      this.unwatch();

      this.emit('stop');
    }
  }, {
    key: 'watch',
    value: function watch(paths) {
      paths = paths.filter(function (path) {
        return !/^atom\:\/\//.test(path);
      });

      if (paths.length < 1) return;

      this.paths = [].concat(_toConsumableArray(this.paths), _toConsumableArray(paths));

      if (this.watcher) {
        this.watcher.watch(paths);
        return;
      }

      this.watcher = _chokidar2['default'].watch(paths, {
        ignoreInitial: true,
        ignored: this.config.exclusions
      });

      var _refresh = this.refresh.bind(this);

      this.watcher.on('add', _refresh).on('change', _refresh).on('unlink', _refresh);
    }
  }, {
    key: 'unwatch',
    value: function unwatch() {
      if (this.watcher) {
        this.watcher.unwatch(this.paths);
        this.watcher.close();
      }
      this.watcher = null;
      this.paths = [];
    }
  }, {
    key: 'refresh',
    value: function refresh(filepath) {
      var extname = _path2['default'].extname(filepath).substring(1);

      if (this.config.exts.indexOf(extname) < 0) return;

      setTimeout(this.send.bind(this, {
        command: 'reload',
        path: filepath,
        liveCSS: this.config.applyCSSLive,
        liveImg: this.config.applyImageLive
      }), this.config.delayForUpdate);
    }
  }, {
    key: 'handleRequest',
    value: function handleRequest(req, res) {
      var content = '',
          status = 200,
          headers;

      switch (_url2['default'].parse(req.url).pathname) {
        case '/':
          res.writeHead(200, { 'Content-Type': 'application/json' });
          break;
        case '/livereload.js':
        case '/xlivereload.js':
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
          content = _fs2['default'].readFileSync(__dirname + '/../node_modules/livereload-js/dist/livereload.js');
          break;
        default:
          res.writeHead(300, { 'Content-Type': 'text/plain' });
          content = 'Not Found';
      }

      res.end(content);
    }
  }, {
    key: 'handleCommand',
    value: function handleCommand(command) {
      switch (command.command) {
        case 'hello':
          this.send({
            command: 'hello',
            protocols: [PROTOCOL_MONITORING_7],
            serverName: 'atom-livereload'
          });
          break;
        case 'ping':
          this.send({
            command: 'pong',
            token: command.token
          });
          break;
      }
    }
  }, {
    key: 'debug',
    value: function debug(text) {
      if (this.config.debug || true) {
        console.log(text);
      }
    }
  }, {
    key: 'send',
    value: function send(command) {
      this.sockets.forEach(function (sock) {
        sock.send(JSON.stringify(command));
      });
    }
  }, {
    key: 'activated',
    get: function get() {
      return !!this.app;
    }
  }, {
    key: 'address',
    get: function get() {
      return this.app.address();
    }
  }]);

  return Server;
})(_events2['default']);

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRXlCLFFBQVE7Ozs7b0JBQ2hCLE1BQU07Ozs7cUJBQ0wsT0FBTzs7OzttQkFDVCxLQUFLOzs7O2tCQUNOLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozs2QkFDRCxnQkFBZ0I7Ozs7d0JBQ2pCLFVBQVU7Ozs7c0JBQ2pCLFFBQVE7Ozs7QUFWdEIsV0FBVyxDQUFDOztBQVlaLElBQU0scUJBQXFCLEdBQUcsb0RBQW9ELENBQUM7QUFDbkYsSUFBTSxxQkFBcUIsR0FBRyw0Q0FBNEMsQ0FBQztBQUMzRSxJQUFNLGlCQUFpQixHQUFHLDBDQUEwQyxDQUFDOztJQUUvRCxNQUFNO1lBQU4sTUFBTTs7OztBQU9DLFdBUFAsTUFBTSxDQU9FLE1BQU0sRUFBRTswQkFQaEIsTUFBTTs7QUFRUiwrQkFSRSxNQUFNLDZDQVFBO1NBUFYsS0FBSyxHQUFHLEVBQUU7U0FDVixPQUFPLEdBQUcsRUFBRTtTQUNaLEdBQUcsR0FBRyxJQUFJO1NBQ1YsT0FBTyxHQUFHLElBQUk7U0FDZCxJQUFJLEdBQUcsRUFBRTtBQUlQLFFBQUksQ0FBQyxNQUFNLEdBQUcsb0JBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztHQUNqQjs7ZUFYRyxNQUFNOztXQWFBLHNCQUFHOzs7QUFDWCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUV6QixVQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxHQUFHLEdBQUcsa0JBQUssWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztPQUNsRCxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsR0FBRyxtQkFBTSxZQUFZLENBQUMs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QUN6Qjs7QUFFRCxTQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xCOzs7V0FFWSx1QkFBQyxPQUFPLEVBQUU7QUFDckIsY0FBUSxPQUFPLENBQUMsT0FBTztBQUNyQixhQUFLLE9BQU87QUFDVixjQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1IsbUJBQU8sRUFBRSxPQUFPO0FBQ2hCLHFCQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztBQUNsQyxzQkFBVSxFQUFFLGlCQUFpQjtXQUM5QixDQUFDLENBQUM7QUFDSCxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxNQUFNO0FBQ1gsY0FBSSxDQUFDLElBQUksQ0FBQztBQUNSLG1CQUFPLEVBQUUsTUFBTTtBQUNmLGlCQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7V0FDckIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQU07QUFBQSxPQUNQO0tBQ0Y7OztXQVVJLGVBQUMsSUFBSSxFQUFFO0FBQ1YsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDN0IsZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNuQjtLQUNGOzs7V0FFRyxjQUFDLE9BQU8sRUFBRTtBQUNaLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFFLFVBQUEsSUFBSSxFQUFJO0FBQzVCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQ3BDLENBQUMsQ0FBQztLQUNKOzs7U0FsQlksZUFBRztBQUNkLGFBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7OztTQUVVLGVBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDM0I7OztTQS9LRyxNQUFNOzs7cUJBOExHLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9saXZlcmVsb2FkL2xpYi9zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgV2ViU29ja2V0IGZyb20gJ2ZheWUtd2Vic29ja2V0JztcbmltcG9ydCBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCBQUk9UT0NPTF9DT05OX0NIRUNLXzEgPSAnaHR0cDovL2xpdmVyZWxvYWQuY29tL3Byb3RvY29scy9jb25uZWN0aW9uLWNoZWNrLTEnO1xuY29uc3QgUFJPVE9DT0xfTU9OSVRPUklOR183ID0gJ2h0dHA6Ly9saXZlcmVsb2FkLmNvbS9wcm90b2NvbHMvb2ZmaWNpYWwtNyc7XG5jb25zdCBQUk9UT0NPTF9TQVZJTkdfMSA9ICdodHRwOi8vbGl2ZXJlbG9hZC5jb20vcHJvdG9jb2xzL3NhdmluZy0xJztcblxuY2xhc3MgU2VydmVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcGF0aHMgPSBbXTtcbiAgc29ja2V0cyA9IFtdO1xuICBhcHAgPSBudWxsO1xuICB3YXRjaGVyID0gbnVsbDtcbiAgX3VybCA9ICcnOyAvLyBjbGllbnQgdXJsXG5cbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbmZpZyA9IF8uYXNzaWduKHt9LCBjb25maWcpO1xuICAgIHRoaXMucGF0aHMgPSBbXTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnO1xuXG4gICAgaWYgKGNvbmZpZy5odHRwcyA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5hcHAgPSBodHRwLmNyZWF0ZVNlcnZlcih0aGlzLmhhbmRsZVJlcXVlc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcCA9IGh0dHBzLmNyZWF0ZVNlcnZlcihjb25maWcuaHR0cHMsIHRoaXMuaGFuZGxlUmVxdWVzdCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHAub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VBRERSSU5VU0UnKSB7XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydC5iaW5kKHRoaXMsIDApLCAxMDApO1xuXG4gICAgICAgIHRoaXMuZGVidWcoYExpdmVSZWxvYWQ6IHBvcnQgJHt0aGlzLmNvbmZpZy5wb3J0fSBhbHJlYWR5IGluIHVzZS4gVHJ5aW5nIGFub3RoZXIgcG9ydC4uLmApO1xuICAgICAgICB0aGlzLmVtaXQoJ25ld3BvcnQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYXBwLm9uKCdsaXN0ZW5pbmcnLCAoKSA9PiB7XG4gICAgICB0aGlzLmRlYnVnKGBMaXZlUmVsb2FkOiBsaXN0ZW5pbmcgb24gcG9ydCAke3RoaXMuYWRkcmVzcy5wb3J0fS5gKTtcbiAgICAgIHRoaXMuZW1pdCgnc3RhcnQnKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXBwLm9uKCd1cGdyYWRlJywgKHJlcXVlc3QsIHNvY2tldCwgYm9keSkgPT4ge1xuICAgICAgaWYgKCFXZWJTb2NrZXQuaXNXZWJTb2NrZXQocmVxdWVzdCkpIHJldHVybjtcbiAgICAgIHZhciB3cyA9IG5ldyBXZWJTb2NrZXQocmVxdWVzdCwgc29ja2V0LCBib2R5KTtcblxuICAgICAgd3Mub24oJ21lc3NhZ2UnLCBldmVudCA9PiB7XG4gICAgICAgIHZhciBkYXRhID0gZXZlbnQuZGF0YSwganNvbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBqc29uID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGpzb24uY29tbWFuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ29tbWFuZChqc29uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkgeyB9XG4gICAgICB9KTtcblxuICAgICAgd3Mub24oJ2Nsb3NlJywgZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldHMgPSB0aGlzLnNvY2tldHMuZmlsdGVyKCBzb2NrID0+IChzb2NrICE9PSB3cykgKTtcbiAgICAgICAgd3MgPSBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0cy5wdXNoKHdzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KHBvcnQpIHtcbiAgICBpZiAodHlwZW9mIHBvcnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwb3J0ID0gdGhpcy5jb25maWcucG9ydDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmFwcCkge1xuICAgICAgdGhpcy5pbml0U2VydmVyKCk7XG4gICAgfVxuICAgIHRoaXMuYXBwLmxpc3Rlbihwb3J0KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuYXBwKSB7XG4gICAgICB0aGlzLmFwcC5jbG9zZSgpO1xuICAgICAgdGhpcy5hcHAgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc29ja2V0cyA9IFtdO1xuICAgIHRoaXMudW53YXRjaCgpO1xuXG4gICAgdGhpcy5lbWl0KCdzdG9wJyk7XG4gIH1cblxuICB3YXRjaChwYXRocykge1xuICAgIHBhdGhzID0gcGF0aHMuZmlsdGVyKCBwYXRoID0+ICEvXmF0b21cXDpcXC9cXC8vLnRlc3QocGF0aCkgKTtcblxuICAgICAgaWYgKHBhdGhzLmxlbmd0aCA8IDEpIHJldHVybjtcblxuICAgICAgdGhpcy5wYXRocyA9IFsuLi50aGlzLnBhdGhzLCAuLi5wYXRoc107XG5cbiAgICAgIGlmICh0aGlzLndhdGNoZXIpIHtcbiAgICAgICAgdGhpcy53YXRjaGVyLndhdGNoKHBhdGhzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLndhdGNoZXIgPSBjaG9raWRhci53YXRjaChwYXRocywge1xuICAgICAgICBpZ25vcmVJbml0aWFsOiB0cnVlLFxuICAgICAgICBpZ25vcmVkOiB0aGlzLmNvbmZpZy5leGNsdXNpb25zXG4gICAgICB9KTtcblxuICAgICAgdmFyIF9yZWZyZXNoID0gdGhpcy5yZWZyZXNoLmJpbmQodGhpcyk7XG5cbiAgICAgIHRoaXMud2F0Y2hlclxuICAgICAgLm9uKCdhZGQnLCBfcmVmcmVzaClcbiAgICAgIC5vbignY2hhbmdlJywgX3JlZnJlc2gpXG4gICAgICAub24oJ3VubGluaycsIF9yZWZyZXNoKTtcbiAgfVxuXG4gIHVud2F0Y2goKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcikge1xuICAgICAgdGhpcy53YXRjaGVyLnVud2F0Y2godGhpcy5wYXRocyk7XG4gICAgICB0aGlzLndhdGNoZXIuY2xvc2UoKTtcbiAgICB9XG4gICAgdGhpcy53YXRjaGVyID0gbnVsbDtcbiAgICB0aGlzLnBhdGhzID0gW107XG4gIH1cblxuICByZWZyZXNoKGZpbGVwYXRoKSB7XG4gICAgdmFyIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUoZmlsZXBhdGgpLnN1YnN0cmluZygxKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5leHRzLmluZGV4T2YoZXh0bmFtZSkgPCAwKSByZXR1cm47XG5cbiAgICBzZXRUaW1lb3V0KFxuICAgICAgdGhpcy5zZW5kLmJpbmQodGhpcywge1xuICAgICAgICBjb21tYW5kOiAncmVsb2FkJyxcbiAgICAgICAgcGF0aDogZmlsZXBhdGgsXG4gICAgICAgIGxpdmVDU1M6IHRoaXMuY29uZmlnLmFwcGx5Q1NTTGl2ZSxcbiAgICAgICAgbGl2ZUltZzogdGhpcy5jb25maWcuYXBwbHlJbWFnZUxpdmVcbiAgICAgIH0pLFxuICAgICAgdGhpcy5jb25maWcuZGVsYXlGb3JVcGRhdGVcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlUmVxdWVzdChyZXEsIHJlcykge1xuICAgIHZhciBjb250ZW50ID0gJycsIHN0YXR1cyA9IDIwMCwgaGVhZGVycztcblxuICAgIHN3aXRjaCAodXJsLnBhcnNlKHJlcS51cmwpLnBhdGhuYW1lKSB7XG4gICAgICBjYXNlICcvJzpcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnL2xpdmVyZWxvYWQuanMnOlxuICAgICAgY2FzZSAnL3hsaXZlcmVsb2FkLmpzJzpcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ3RleHQvamF2YXNjcmlwdCd9KTtcbiAgICAgICAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhfX2Rpcm5hbWUgKyAnLy4uL25vZGVfbW9kdWxlcy9saXZlcmVsb2FkLWpzL2Rpc3QvbGl2ZXJlbG9hZC5qcycpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzAwLCB7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ30pO1xuICAgICAgICBjb250ZW50ID0gJ05vdCBGb3VuZCc7XG4gICAgfVxuXG4gICAgcmVzLmVuZChjb250ZW50KTtcbiAgfVxuXG4gIGhhbmRsZUNvbW1hbmQoY29tbWFuZCkge1xuICAgIHN3aXRjaCAoY29tbWFuZC5jb21tYW5kKSB7XG4gICAgICBjYXNlICdoZWxsbyc6XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgY29tbWFuZDogJ2hlbGxvJyxcbiAgICAgICAgICBwcm90b2NvbHM6IFtQUk9UT0NPTF9NT05JVE9SSU5HXzddLFxuICAgICAgICAgIHNlcnZlck5hbWU6ICdhdG9tLWxpdmVyZWxvYWQnXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3BpbmcnOlxuICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgY29tbWFuZDogJ3BvbmcnLFxuICAgICAgICB0b2tlbjogY29tbWFuZC50b2tlblxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkKCkge1xuICAgIHJldHVybiAhIXRoaXMuYXBwO1xuICB9XG5cbiAgZ2V0IGFkZHJlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmFkZHJlc3MoKTtcbiAgfVxuXG4gIGRlYnVnKHRleHQpIHtcbiAgICBpZiAodGhpcy5jb25maWcuZGVidWcgfHwgdHJ1ZSkge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgfVxuICB9XG5cbiAgc2VuZChjb21tYW5kKSB7XG4gICAgdGhpcy5zb2NrZXRzLmZvckVhY2goIHNvY2sgPT4ge1xuICAgICAgc29jay5zZW5kKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQpKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXI7XG4iXX0=