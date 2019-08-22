Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _helperHelper = require('../helper/helper');

'use babel';

var ftpClient = require("basic-ftp");
var EventEmitter = require('events');
var FileSystem = require('fs-plus');

var Ftp = (function (_EventEmitter) {
  _inherits(Ftp, _EventEmitter);

  function Ftp() {
    _classCallCheck(this, Ftp);

    _get(Object.getPrototypeOf(Ftp.prototype), 'constructor', this).call(this);
  }

  _createClass(Ftp, [{
    key: 'connect',
    value: function connect(connection) {
      var self = this;
      self.emit('debug', 'ftp:connect');

      self.client = new ftpClient.Client();

      // force PASV mode
      self.client.prepareTransfer = ftpClient.enterPassiveModeIPv4;

      // logging
      self.client.ftp.verbose = true;
      self.client.ftp.log = function (message) {
        if (message.startsWith('<') || message.startsWith('>')) {
          self.emit('log', message.replace(/\'+/g, "").replace(/\\r|\\n/g, " "));
        } else {
          self.emit('debug', 'ftp:debug: ' + message);
        }
      };

      // options
      var options = {
        host: connection.host,
        port: connection.port ? connection.port : 21,
        user: connection.user,
        password: connection.password
      };

      // TLS
      if (connection.secure) {
        options.secure = true;
        options.secureOptions = { 'rejectUnauthorized': false };
      }

      try {
        return self.client.access(options).then(function () {
          self.emit('debug', 'ftp:connect:ready');

          // Not able to get directory listing for regular FTP to an IBM i (or AS/400 or iSeries) #123
          // Force IBM i (or AS/400 or iSeries) returns information
          // for the LIST subcommand in the UNIX style list format.
          return self.client.send('SITE LISTFMT 1', true).then(function () {
            // catch connection timeout - code 421
            self.client.ftp.socket.on("data", function (chunk) {
              var code = parseInt(chunk.trim().substr(0, 3), 10);
              if (code === 421) {
                self.emit('debug', 'ftp:timeout');
                self.emit('log', '> Connection timeout');
                self.emit('timeout', new Error('Connection timeout'));
                self.end();
              }
            });

            return self;
          });
        })['catch'](function (err) {
          self.emit('debug', 'ftp:connect:close');
          self.emit('log', '> Connection closed');
          self.emit('closed', 'Connection closed');
          throw err;
        });
      } catch (err) {
        self.emit('debug', 'ftp:connect:close');
        self.emit('log', '> Connection closed');
        self.emit('closed', 'Connection closed');
        return Promise.reject(err);
      }
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      var self = this;

      if (!self.client) return false;

      return self.client.closed === false;
    }
  }, {
    key: 'list',
    value: function list(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:list', remotePath);

      var showHiddenFiles = atom.config.get('ftp-remote-edit.tree.showHiddenFiles');
      var path = showHiddenFiles ? '-al ' + remotePath.trim() : remotePath.trim();

      return self.client.list(path).then(function (list) {
        var newlist = list.map(function (item, index) {
          var rigths = (0, _helperHelper.permissionsToRights)(item.permissions.user.toString() + item.permissions.group.toString() + item.permissions.world.toString());
          return {
            type: item.isFile ? '-' : item.isDirectory ? 'd' : 'l',
            name: item.name,
            size: item.size,
            date: new Date(item.date),
            rights: {
              group: rigths.group,
              other: rigths.other,
              user: rigths.user
            },
            owner: item.user,
            group: item.group,
            target: item.link ? item.link : undefined,
            sticky: false
          };
        });
        return newlist;
      })['catch'](function (err) {
        throw err;
      });
    }
  }, {
    key: 'mkdir',
    value: function mkdir(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:mkdir', remotePath);

      return self.client.protectWhitespace(remotePath).then(function (validPath) {
        return self.client.send("MKD " + validPath).then(function (response) {
          return remotePath.trim();
        })['catch'](function (err) {
          throw err;
        });
      })['catch'](function (err) {
        throw err;
      });
    }
  }, {
    key: 'rmdir',
    value: function rmdir(remotePath, recursive) {
      var self = this;
      self.emit('debug', 'ftp:rmdir', remotePath);

      return self.client.removeDir(remotePath).then(function (response) {
        return remotePath.trim();
      })['catch'](function (err) {
        throw err;
      });
    }
  }, {
    key: 'chmod',
    value: function chmod(remotePath, permissions) {
      var self = this;
      self.emit('debug', 'ftp:chmod', remotePath);

      return self.client.send('SITE CHMOD ' + permissions + ' ' + remotePath);
    }
  }, {
    key: 'put',
    value: function put(queueItem) {
      var self = this;
      self.emit('debug', 'ftp:put', remotePath);

      var remotePath = queueItem.info.remotePath;
      var localPath = queueItem.info.localPath;

      var file = FileSystem.createReadStream(localPath);
      file.on('open', function () {
        self.emit('debug', 'ftp:put:file.open');
        queueItem.addStream(file);
        queueItem.changeStatus('Transferring');
      });
      file.once('error', function (err) {
        self.emit('debug', 'ftp:put:file.error');
        queueItem.changeStatus('Error');
      });
      file.once('end', function () {
        self.emit('debug', 'ftp:put:file.end');
        queueItem.changeProgress(queueItem.info.size);
      });

      self.client.trackProgress(function (info) {
        self.emit('debug', 'ftp:put:client.get:progress');
        queueItem.changeProgress(info.bytes);
        self.emit('data', info.bytes);
      });

      return self.client.upload(file, remotePath).then(function (response) {
        self.client.trackProgress();
        return remotePath.trim();
      })['catch'](function (err) {
        self.client.trackProgress();
        file.close();
        throw err;
      });
    }
  }, {
    key: 'get',
    value: function get(queueItem) {
      var self = this;
      self.emit('debug', 'ftp:get', remotePath, localPath);

      var remotePath = queueItem.info.remotePath;
      var localPath = queueItem.info.localPath;

      var file = FileSystem.createWriteStream(localPath, { autoClose: true });
      file.once('open', function () {
        self.emit('debug', 'ftp:get:file.open');
        queueItem.addStream(file);
        queueItem.changeStatus('Transferring');
      });
      file.once('error', function (err) {
        self.emit('debug', 'ftp:get:file.error');
        queueItem.changeStatus('Error');
      });
      file.once('finish', function () {
        self.emit('debug', 'ftp:get:file.finish');
        queueItem.changeProgress(queueItem.info.size);
      });

      self.client.trackProgress(function (info) {
        self.emit('debug', 'ftp:get:client.get:progress');
        queueItem.changeProgress(info.bytes);
        self.emit('data', info.bytes);
      });

      return self.client.download(file, remotePath).then(function (response) {
        self.client.trackProgress();
        return localPath.trim();
      })['catch'](function (err) {
        self.client.trackProgress();
        file.close();
        throw err;
      });
    }
  }, {
    key: 'delete',
    value: function _delete(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:delete', remotePath);

      return self.client.remove(remotePath).then(function (response) {
        return remotePath.trim();
      })['catch'](function (err) {
        throw err;
      });
    }
  }, {
    key: 'rename',
    value: function rename(oldRemotePath, newRemotePath) {
      var self = this;
      self.emit('debug', 'ftp:rename', oldRemotePath, newRemotePath);

      return self.client.rename(oldRemotePath, newRemotePath).then(function (response) {
        return newRemotePath.trim();
      })['catch'](function (err) {
        throw err;
      });
    }
  }, {
    key: 'end',
    value: function end() {
      var self = this;
      self.emit('debug', 'ftp:end');

      var promise = new Promise(function (resolve, reject) {
        self.emit('log', '> Connection end');
        self.client.close();
        resolve(true);
      });

      return promise;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var self = this;
      self.emit('debug', 'ftp:abort');

      return self.client.send('ABOR', true);
    }
  }]);

  return Ftp;
})(EventEmitter);

exports['default'] = Ftp;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL2Z0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7NEJBRW9DLGtCQUFrQjs7QUFGdEQsV0FBVyxDQUFDOztBQUlaLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN0QyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztJQUVqQixHQUFHO1lBQUgsR0FBRzs7QUFFWCxXQUZRLEdBQUcsR0FFUjswQkFGSyxHQUFHOztBQUdwQiwrQkFIaUIsR0FBRyw2Q0FHWjtHQUNUOztlQUprQixHQUFHOztXQU1mLGlCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRWxDLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7OztBQUdyQyxVQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUM7OztBQUc3RCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFDLE9BQU8sRUFBSztBQUNqQyxZQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0RCxjQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxP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QUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDekUsZUFBUSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUU7T0FDL0IsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDaEIsY0FBTSxHQUFHLENBQUM7T0FDWCxDQUFDLENBQUM7S0FDSjs7O1dBRUUsZUFBRztBQUNKLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdDLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwQixlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDZixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVoQyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN2Qzs7O1NBdlFrQixHQUFHO0dBQVMsWUFBWTs7cUJBQXhCLEdBQUciLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2Nvbm5lY3RvcnMvZnRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IHBlcm1pc3Npb25zVG9SaWdodHMgfSBmcm9tICcuLi9oZWxwZXIvaGVscGVyJztcblxuY29uc3QgZnRwQ2xpZW50ID0gcmVxdWlyZShcImJhc2ljLWZ0cFwiKVxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBGaWxlU3lzdGVtID0gcmVxdWlyZSgnZnMtcGx1cycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdHAgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBjb25uZWN0KGNvbm5lY3Rpb24pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpjb25uZWN0Jyk7XG5cbiAgICBzZWxmLmNsaWVudCA9IG5ldyBmdHBDbGllbnQuQ2xpZW50KCk7XG5cbiAgICAvLyBmb3JjZSBQQVNWIG1vZGVcbiAgICBzZWxmLmNsaWVudC5wcmVwYXJlVHJhbnNmZXIgPSBmdHBDbGllbnQuZW50ZXJQYXNzaXZlTW9kZUlQdjQ7XG5cbiAgICAvLyBsb2dnaW5nXG4gICAgc2VsZi5jbGllbnQuZnRwLnZlcmJvc2UgPSB0cnVlO1xuICAgIHNlbGYuY2xpZW50LmZ0cC5sb2cgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2Uuc3RhcnRzV2l0aCgnPCcpIHx8IG1lc3NhZ2Uuc3RhcnRzV2l0aCgnPicpKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnbG9nJywgbWVzc2FnZS5yZXBsYWNlKC9cXCcrL2csIFwiXCIpLnJlcGxhY2UoL1xcXFxyfFxcXFxuL2csIFwiIFwiKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpkZWJ1ZzogJyArIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBvcHRpb25zXG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBob3N0OiBjb25uZWN0aW9uLmhvc3QsXG4gICAgICBwb3J0OiAoY29ubmVjdGlvbi5wb3J0KSA/IGNvbm5lY3Rpb24ucG9ydCA6IDIxLFxuICAgICAgdXNlcjogY29ubmVjdGlvbi51c2VyLFxuICAgICAgcGFzc3dvcmQ6IGNvbm5lY3Rpb24ucGFzc3dvcmQsXG4gICAgfTtcblxuICAgIC8vIFRMU1xuICAgIGlmIChjb25uZWN0aW9uLnNlY3VyZSkge1xuICAgICAgb3B0aW9ucy5zZWN1cmUgPSB0cnVlO1xuICAgICAgb3B0aW9ucy5zZWN1cmVPcHRpb25zID0geyAncmVqZWN0VW5hdXRob3JpemVkJzogZmFsc2UgfTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmFjY2VzcyhvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDpyZWFkeScpO1xuXG4gICAgICAgIC8vIE5vdCBhYmxlIHRvIGdldCBkaXJlY3RvcnkgbGlzdGluZyBmb3IgcmVndWxhciBGVFAgdG8gYW4gSUJNIGkgKG9yIEFTLzQwMCBvciBpU2VyaWVzKSAjMTIzXG4gICAgICAgIC8vIEZvcmNlIElCTSBpIChvciBBUy80MDAgb3IgaVNlcmllcykgcmV0dXJucyBpbmZvcm1hdGlvblxuICAgICAgICAvLyBmb3IgdGhlIExJU1Qgc3ViY29tbWFuZCBpbiB0aGUgVU5JWCBzdHlsZSBsaXN0IGZvcm1hdC5cbiAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LnNlbmQoJ1NJVEUgTElTVEZNVCAxJywgdHJ1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8gY2F0Y2ggY29ubmVjdGlvbiB0aW1lb3V0IC0gY29kZSA0MjFcbiAgICAgICAgICBzZWxmLmNsaWVudC5mdHAuc29ja2V0Lm9uKFwiZGF0YVwiLCAoY2h1bmspID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwYXJzZUludChjaHVuay50cmltKCkuc3Vic3RyKDAsIDMpLCAxMClcbiAgICAgICAgICAgIGlmIChjb2RlID09PSA0MjEpIHtcbiAgICAgICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6dGltZW91dCcpO1xuICAgICAgICAgICAgICBzZWxmLmVtaXQoJ2xvZycsICc+IENvbm5lY3Rpb24gdGltZW91dCcpO1xuICAgICAgICAgICAgICBzZWxmLmVtaXQoJ3RpbWVvdXQnLCBuZXcgRXJyb3IoJ0Nvbm5lY3Rpb24gdGltZW91dCcpKTtcbiAgICAgICAgICAgICAgc2VsZi5lbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDpjbG9zZScpO1xuICAgICAgICBzZWxmLmVtaXQoJ2xvZycsICc+IENvbm5lY3Rpb24gY2xvc2VkJyk7XG4gICAgICAgIHNlbGYuZW1pdCgnY2xvc2VkJywgJ0Nvbm5lY3Rpb24gY2xvc2VkJyk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDpjbG9zZScpO1xuICAgICAgc2VsZi5lbWl0KCdsb2cnLCAnPiBDb25uZWN0aW9uIGNsb3NlZCcpO1xuICAgICAgc2VsZi5lbWl0KCdjbG9zZWQnLCAnQ29ubmVjdGlvbiBjbG9zZWQnKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLmNsaWVudCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LmNsb3NlZCA9PT0gZmFsc2U7XG4gIH1cblxuICBsaXN0KHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpsaXN0JywgcmVtb3RlUGF0aCk7XG5cbiAgICBjb25zdCBzaG93SGlkZGVuRmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnNob3dIaWRkZW5GaWxlcycpO1xuICAgIGxldCBwYXRoID0gKHNob3dIaWRkZW5GaWxlcyA/ICctYWwgJyArIHJlbW90ZVBhdGgudHJpbSgpIDogcmVtb3RlUGF0aC50cmltKCkpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50Lmxpc3QocGF0aCkudGhlbigobGlzdCkgPT4ge1xuICAgICAgbGV0IG5ld2xpc3QgPSBsaXN0Lm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IHJpZ3RocyA9IHBlcm1pc3Npb25zVG9SaWdodHMoaXRlbS5wZXJtaXNzaW9ucy51c2VyLnRvU3RyaW5nKCkgKyBpdGVtLnBlcm1pc3Npb25zLmdyb3VwLnRvU3RyaW5nKCkgKyBpdGVtLnBlcm1pc3Npb25zLndvcmxkLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IChpdGVtLmlzRmlsZSkgPyAnLScgOiAoaXRlbS5pc0RpcmVjdG9yeSkgPyAnZCcgOiAnbCcsXG4gICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICAgIHNpemU6IGl0ZW0uc2l6ZSxcbiAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShpdGVtLmRhdGUpLFxuICAgICAgICAgIHJpZ2h0czoge1xuICAgICAgICAgICAgZ3JvdXA6IHJpZ3Rocy5ncm91cCxcbiAgICAgICAgICAgIG90aGVyOiByaWd0aHMub3RoZXIsXG4gICAgICAgICAgICB1c2VyOiByaWd0aHMudXNlcixcbiAgICAgICAgICB9LFxuICAgICAgICAgIG93bmVyOiBpdGVtLnVzZXIsXG4gICAgICAgICAgZ3JvdXA6IGl0ZW0uZ3JvdXAsXG4gICAgICAgICAgdGFyZ2V0OiAoaXRlbS5saW5rKSA/IGl0ZW0ubGluayA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzdGlja3k6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXdsaXN0O1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIG1rZGlyKHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpta2RpcicsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnByb3RlY3RXaGl0ZXNwYWNlKHJlbW90ZVBhdGgpLnRoZW4oKHZhbGlkUGF0aCkgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LnNlbmQoXCJNS0QgXCIgKyB2YWxpZFBhdGgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJldHVybiByZW1vdGVQYXRoLnRyaW0oKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG5cbiAgcm1kaXIocmVtb3RlUGF0aCwgcmVjdXJzaXZlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6cm1kaXInLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5yZW1vdmVEaXIocmVtb3RlUGF0aCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiAocmVtb3RlUGF0aC50cmltKCkpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kKHJlbW90ZVBhdGgsIHBlcm1pc3Npb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y2htb2QnLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5zZW5kKCdTSVRFIENITU9EICcgKyBwZXJtaXNzaW9ucyArICcgJyArIHJlbW90ZVBhdGgpO1xuICB9XG5cbiAgcHV0KHF1ZXVlSXRlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOnB1dCcsIHJlbW90ZVBhdGgpO1xuXG4gICAgbGV0IHJlbW90ZVBhdGggPSBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoO1xuICAgIGxldCBsb2NhbFBhdGggPSBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGg7XG5cbiAgICBsZXQgZmlsZSA9IEZpbGVTeXN0ZW0uY3JlYXRlUmVhZFN0cmVhbShsb2NhbFBhdGgpO1xuICAgIGZpbGUub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpwdXQ6ZmlsZS5vcGVuJyk7XG4gICAgICBxdWV1ZUl0ZW0uYWRkU3RyZWFtKGZpbGUpO1xuICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnVHJhbnNmZXJyaW5nJyk7XG4gICAgfSk7XG4gICAgZmlsZS5vbmNlKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOnB1dDpmaWxlLmVycm9yJyk7XG4gICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgIH0pO1xuICAgIGZpbGUub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6cHV0OmZpbGUuZW5kJyk7XG4gICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmNsaWVudC50cmFja1Byb2dyZXNzKGluZm8gPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6cHV0OmNsaWVudC5nZXQ6cHJvZ3Jlc3MnKTtcbiAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhpbmZvLmJ5dGVzKTtcbiAgICAgIHNlbGYuZW1pdCgnZGF0YScsIGluZm8uYnl0ZXMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnVwbG9hZChmaWxlLCByZW1vdGVQYXRoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgc2VsZi5jbGllbnQudHJhY2tQcm9ncmVzcygpO1xuICAgICAgcmV0dXJuIHJlbW90ZVBhdGgudHJpbSgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNlbGYuY2xpZW50LnRyYWNrUHJvZ3Jlc3MoKTtcbiAgICAgIGZpbGUuY2xvc2UoKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIGdldChxdWV1ZUl0ZW0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpnZXQnLCByZW1vdGVQYXRoLCBsb2NhbFBhdGgpO1xuXG4gICAgbGV0IHJlbW90ZVBhdGggPSBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoO1xuICAgIGxldCBsb2NhbFBhdGggPSBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGg7XG5cbiAgICBsZXQgZmlsZSA9IEZpbGVTeXN0ZW0uY3JlYXRlV3JpdGVTdHJlYW0obG9jYWxQYXRoLCB7IGF1dG9DbG9zZTogdHJ1ZSB9KTtcbiAgICBmaWxlLm9uY2UoJ29wZW4nLCAoKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpnZXQ6ZmlsZS5vcGVuJyk7XG4gICAgICBxdWV1ZUl0ZW0uYWRkU3RyZWFtKGZpbGUpO1xuICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnVHJhbnNmZXJyaW5nJyk7XG4gICAgfSk7XG4gICAgZmlsZS5vbmNlKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmdldDpmaWxlLmVycm9yJyk7XG4gICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgIH0pO1xuICAgIGZpbGUub25jZSgnZmluaXNoJywgKCkgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Z2V0OmZpbGUuZmluaXNoJyk7XG4gICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmNsaWVudC50cmFja1Byb2dyZXNzKGluZm8gPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Z2V0OmNsaWVudC5nZXQ6cHJvZ3Jlc3MnKTtcbiAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhpbmZvLmJ5dGVzKTtcbiAgICAgIHNlbGYuZW1pdCgnZGF0YScsIGluZm8uYnl0ZXMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LmRvd25sb2FkKGZpbGUsIHJlbW90ZVBhdGgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBzZWxmLmNsaWVudC50cmFja1Byb2dyZXNzKCk7XG4gICAgICByZXR1cm4gbG9jYWxQYXRoLnRyaW0oKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzZWxmLmNsaWVudC50cmFja1Byb2dyZXNzKCk7XG4gICAgICBmaWxlLmNsb3NlKCk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGUocmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmRlbGV0ZScsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnJlbW92ZShyZW1vdGVQYXRoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIChyZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuYW1lKG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpyZW5hbWUnLCBvbGRSZW1vdGVQYXRoLCBuZXdSZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5yZW5hbWUob2xkUmVtb3RlUGF0aCwgbmV3UmVtb3RlUGF0aCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiAobmV3UmVtb3RlUGF0aC50cmltKCkpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDplbmQnKTtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdsb2cnLCAnPiBDb25uZWN0aW9uIGVuZCcpO1xuICAgICAgc2VsZi5jbGllbnQuY2xvc2UoKTtcbiAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmFib3J0Jyk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQuc2VuZCgnQUJPUicsIHRydWUpO1xuICB9XG59XG4iXX0=