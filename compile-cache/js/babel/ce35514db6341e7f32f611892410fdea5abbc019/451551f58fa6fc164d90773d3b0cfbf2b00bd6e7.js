Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _helperSsh2SftpClient = require('./../helper/ssh2-sftp-client');

var _helperSsh2SftpClient2 = _interopRequireDefault(_helperSsh2SftpClient);

'use babel';

var FileSystem = require('fs-plus');
var EventEmitter = require('events');
var progress = require('progress-stream');

var Sftp = (function (_EventEmitter) {
  _inherits(Sftp, _EventEmitter);

  function Sftp() {
    _classCallCheck(this, Sftp);

    _get(Object.getPrototypeOf(Sftp.prototype), 'constructor', this).call(this);
    var self = this;

    self.connection = null;
    self.clientReadyEvent = null;
    self.clientErrorEvent = null;
    self.clientEndEvent = null;
    self.clientCloseEvent = null;
  }

  _createClass(Sftp, [{
    key: 'connect',
    value: function connect(connection) {
      var _this = this;

      var self = this;
      self.emit('debug', 'sftp:connect');

      self.connection = connection;
      self.client = new _helperSsh2SftpClient2['default']();

      // add remove listener support, because it's not implemented in lib
      self.client.removeListener = function (eventType, callback) {
        self.client.client.removeListener(eventType, callback);
      };

      self.clientReadyEvent = function () {
        self.emit('debug', 'sftp:connect:ready');
        _this.emit('connected');
      };
      self.client.on('ready', self.clientReadyEvent);

      self.clientErrorEvent = function (err) {
        self.emit('debug', 'sftp:connect:error');
        // self.emit('error', err);
      };
      self.client.on('error', self.clientErrorEvent);

      self.clientEndEvent = function () {
        self.emit('debug', 'sftp:connect:end');
        self.emit('ended', 'Connection end');
      };
      self.client.on('end', self.clientEndEvent);

      self.clientCloseEvent = function () {
        self.emit('debug', 'sftp:connect:close');
        self.emit('closed', 'Connection closed');
      };
      self.client.on('close', self.clientCloseEvent);

      var pw = true;
      if (connection.useAgent) {
        var agent = self.getSshAgent();
        if (agent) {
          connection.agent = agent;
          pw = false;
        } else {
          atom.notifications.addWarning('No SSH agent found.', {
            description: 'Falling back to keyfile or password based authentication.'
          });
        }
      }
      if (pw && connection.privatekeyfile && !connection.privateKey) {
        if (FileSystem.existsSync(connection.privatekeyfile)) {
          connection.privateKey = FileSystem.readFileSync(connection.privatekeyfile, 'utf8');
        } else {
          return new Promise(function (resolve, reject) {
            reject({ message: 'Private Keyfile not found...' });
          });
        }
      }
      if (pw && connection.privateKey && !connection.passphrase) {
        connection.passphrase = connection.password;
      }

      connection.debug = function (msg) {
        if (!msg.includes('DEBUG: Parser')) {
          self.emit('debug', msg.replace('DEBUG:', 'sftp:debug:'));
        }
      };

      return self.client.connect(connection).then(function () {
        return new Promise(function (resolve, reject) {
          resolve(self);
        });
      })['catch'](function (err) {
        return new Promise(function (resolve, reject) {
          reject(err);
        });
      });
    }
  }, {
    key: 'getSshAgent',
    value: function getSshAgent() {
      var sock = process.env['SSH_AUTH_SOCK'];
      if (sock) {
        return sock;
      } else {
        if (process.platform == 'win32') {
          return 'pageant';
        } else {
          return null;
        }
      }
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      var self = this;

      if (!self.client) return false;
      if (!self.client.sftp) return false;
      if (!self.client.sftp._stream) return false;
      return self.client.sftp._stream.readable;
    }
  }, {
    key: 'list',
    value: function list(remotePath) {
      var self = this;
      self.emit('debug', 'sftp:list', remotePath);

      var timer = null;

      // issue-76 Cannot connect to servers after resuming from suspend
      // sftp server don't react after loosing Connection
      // Workaround: Wait 10 sec, reconnect and try again
      // if the reconnection fails, throw error

      // reconnect and try list again
      var promiseA = new Promise(function (resolve, reject) {
        timer = setTimeout(function () {
          return self.end().then(function () {
            return self.connect(self.connection).then(function () {
              return self.list(remotePath).then(function (list) {
                resolve(list);
              })['catch'](function (err) {
                reject(err);
              });
            })['catch'](function (err) {
              reject(err);
            });
          })['catch'](function (err) {
            reject(err);
          });
        }, 10000);
      });

      // list
      var promiseB = self.client.list(remotePath).then(function (list) {
        clearTimeout(timer);
        return new Promise(function (resolve, reject) {
          resolve(list);
        });
      })['catch'](function (err) {
        clearTimeout(timer);
        return new Promise(function (resolve, reject) {
          reject(err);
        });
      });

      return Promise.race([promiseA, promiseB]);
    }
  }, {
    key: 'mkdir',
    value: function mkdir(remotePath) {
      var self = this;
      self.emit('debug', 'sftp:mkdir', remotePath);

      return self.client.mkdir(remotePath).then(function () {
        return new Promise(function (resolve, reject) {
          resolve(remotePath.trim());
        });
      })['catch'](function (err) {
        return new Promise(function (resolve, reject) {
          reject(err);
        });
      });
    }
  }, {
    key: 'rmdir',
    value: function rmdir(remotePath, recursive) {
      var self = this;
      self.emit('debug', 'sftp:rmdir', remotePath);

      return self.client.rmdir(remotePath, recursive).then(function () {
        return new Promise(function (resolve, reject) {
          resolve(remotePath.trim());
        });
      })['catch'](function (err) {
        return new Promise(function (resolve, reject) {
          reject(err);
        });
      });
    }
  }, {
    key: 'chmod',
    value: function chmod(remotePath, permissions) {
      var self = this;
      self.emit('debug', 'sftp:chmod', remotePath);

      return self.client.chmod(remotePath, permissions);
    }
  }, {
    key: 'put',
    value: function put(queueItem) {
      var self = this;
      self.emit('debug', 'sftp:put', remotePath);

      var remotePath = queueItem.info.remotePath;
      var localPath = queueItem.info.localPath;

      var promise = new Promise(function (resolve, reject) {
        var str = progress({ time: 100 });
        var input = FileSystem.createReadStream(localPath);
        input.pause();

        // Declare events 
        var progressEvent = function progressEvent(progress) {
          queueItem.changeProgress(progress.transferred);
          self.emit('data', progress.transferred);
        };
        var clientCloseEvent = function clientCloseEvent(hadError) {
          if (hadError) {
            queueItem.changeStatus('Error');
            reject(Error('sftp closed connection'));
          } else {
            resolve(localPath.trim());
          }
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };

        // Add event listener
        str.on('progress', progressEvent);
        self.client.on('close', clientCloseEvent);
        self.client.on('error', clientErrorEvent);

        input.on('open', function () {
          queueItem.changeStatus('Transferring');
        });
        // input.once('end', () => {
        //   queueItem.changeProgress(queueItem.info.size);
        //   resolve(localPath.trim());
        // });
        // input.once('finish', () => {
        //   queueItem.changeProgress(queueItem.info.size);
        //   resolve(localPath.trim());
        // });
        input.once('error', function (err) {
          // Remove event listener
          str.removeListener('progress', progressEvent);
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);

          queueItem.changeStatus('Error');
          reject(err);
        });

        // check file exists and get permissions
        return self.client.stat(remotePath).then(function (info) {
          // file  exists
          var otherOptions = null;
          if (info.permissions) {
            info.permissions = info.permissions.toString(8).substr(-3);
            otherOptions = { mode: parseInt('0' + info.permissions, 8) };
          } else {
            otherOptions = { mode: 420 };
          }

          return self.client.put(input.pipe(str), remotePath, null, null, otherOptions).then(function () {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(localPath.trim());
          })['catch'](function (err) {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeStatus('Error');
            reject(err);
          });
        })['catch'](function (err) {
          // file doesn't exists
          return self.client.put(input.pipe(str), remotePath, null, null, { mode: 420 }).then(function () {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(localPath.trim());
          })['catch'](function (err) {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeStatus('Error');
            reject(err);
          });
        });
      });

      return promise;
    }
  }, {
    key: 'get',
    value: function get(queueItem) {
      var self = this;
      self.emit('debug', 'sftp:get', remotePath, localPath);

      var remotePath = queueItem.info.remotePath;
      var localPath = queueItem.info.localPath;

      var promise = new Promise(function (resolve, reject) {
        var str = progress({ time: 100 });

        // Declare events 
        var progressEvent = function progressEvent(progress) {
          self.emit('debug', 'sftp:get:client.get:progress');
          queueItem.changeProgress(progress.transferred);
          self.emit('data', progress.transferred);
        };
        var clientCloseEvent = function clientCloseEvent(hadError) {
          if (hadError) {
            queueItem.changeStatus('Error');
            reject(Error('sftp closed connection'));
          } else {
            resolve(localPath.trim());
          }
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };

        // Add event listener
        str.on('progress', progressEvent);
        self.client.on('close', clientCloseEvent);
        self.client.on('error', clientErrorEvent);

        return self.client.get(remotePath, null, null).then(function (stream) {
          stream.pause();

          stream.on('readable', function () {
            self.emit('debug', 'sftp:get:stream.readable');
          });

          self.emit('debug', 'sftp:get:client.get:success');
          var file = FileSystem.createWriteStream(localPath, { autoClose: true });

          file.on('open', function (err) {
            self.emit('debug', 'sftp:get:file.open');
            queueItem.addStream(file);
            queueItem.changeStatus('Transferring');
          });
          file.on('error', function (err) {
            self.emit('debug', 'sftp:get:file.error');
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeStatus('Error');
            reject(err);
          });
          file.once('finish', function () {
            self.emit('debug', 'sftp:get:file.finish');
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(localPath.trim());
          });

          stream.once('end', function () {
            self.emit('debug', 'sftp:get:stream.end');
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(localPath.trim());
          });
          stream.once('finish', function () {
            self.emit('debug', 'sftp:get:stream.finish');
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(localPath.trim());
          });
          stream.once('error', function (err) {
            self.emit('debug', 'sftp:get:stream.error');
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);

            queueItem.changeStatus('Error');
            reject(err);
          });

          self.emit('debug', 'sftp:get:stream.pipe');
          stream.pipe(str).pipe(file);
        })['catch'](function (err) {
          self.emit('debug', 'sftp:get:client.get:error');
          // Remove event listener
          str.removeListener('progress', progressEvent);
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);

          queueItem.changeStatus('Error');
          reject(err);
        });
      });

      return promise;
    }
  }, {
    key: 'delete',
    value: function _delete(remotePath) {
      var self = this;
      self.emit('debug', 'sftp:delete', remotePath);

      return self.client['delete'](remotePath);
    }
  }, {
    key: 'rename',
    value: function rename(oldRemotePath, newRemotePath) {
      var self = this;
      self.emit('debug', 'sftp:rename', oldRemotePath, newRemotePath);

      return self.client.rename(oldRemotePath, newRemotePath);
    }
  }, {
    key: 'end',
    value: function end() {
      var self = this;
      self.emit('debug', 'sftp:end');

      // Remove event listener
      self.client.removeListener('ready', self.clientReadyEvent);
      self.client.removeListener('error', self.clientErrorEvent);
      self.client.removeListener('end', self.clientEndEvent);
      self.client.removeListener('close', self.clientCloseEvent);

      return self.client.end();
    }
  }, {
    key: 'abort',
    value: function abort() {
      var self = this;
      self.emit('debug', 'sftp:abort');

      return self.end().then(function () {
        return self.connect(self.connection);
      });
    }
  }]);

  return Sftp;
})(EventEmitter);

exports['default'] = Sftp;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL3NmdHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0NBRXVCLDhCQUE4Qjs7OztBQUZyRCxXQUFXLENBQUM7O0FBSVosSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFdkIsSUFBSTtZQUFKLElBQUk7O0FBRVosV0FGUSxJQUFJLEdBRVQ7MEJBRkssSUFBSTs7QUFHckIsK0JBSGlCLElBQUksNkNBR2I7QUFDUixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM3QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0dBQzlCOztlQVhrQixJQUFJOztXQWFoQixpQkFBQyxVQUFVLEVBQUU7OztBQUNsQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLEdBQUcsdUNBQWdCLENBQUM7OztBQUcvQixVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxVQUFVLFNBQVMsRUFBRSxRQUFRLEVBQUU7QUFDMUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENB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QUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUUzRCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDMUI7OztXQUVJLGlCQUFHO0FBQ04sVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUVqQyxhQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMzQixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ3JDLENBQUMsQ0FBQztLQUNKOzs7U0E3Y2tCLElBQUk7R0FBUyxZQUFZOztxQkFBekIsSUFBSSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvY29ubmVjdG9ycy9zZnRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBzZnRwQ2xpZW50IGZyb20gJy4vLi4vaGVscGVyL3NzaDItc2Z0cC1jbGllbnQnO1xuXG5jb25zdCBGaWxlU3lzdGVtID0gcmVxdWlyZSgnZnMtcGx1cycpO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBwcm9ncmVzcyA9IHJlcXVpcmUoJ3Byb2dyZXNzLXN0cmVhbScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZnRwIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5jb25uZWN0aW9uID0gbnVsbDtcbiAgICBzZWxmLmNsaWVudFJlYWR5RXZlbnQgPSBudWxsO1xuICAgIHNlbGYuY2xpZW50RXJyb3JFdmVudCA9IG51bGw7XG4gICAgc2VsZi5jbGllbnRFbmRFdmVudCA9IG51bGw7XG4gICAgc2VsZi5jbGllbnRDbG9zZUV2ZW50ID0gbnVsbDtcbiAgfVxuXG4gIGNvbm5lY3QoY29ubmVjdGlvbikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpjb25uZWN0Jyk7XG5cbiAgICBzZWxmLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIHNlbGYuY2xpZW50ID0gbmV3IHNmdHBDbGllbnQoKTtcblxuICAgIC8vIGFkZCByZW1vdmUgbGlzdGVuZXIgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG5vdCBpbXBsZW1lbnRlZCBpbiBsaWJcbiAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICBzZWxmLmNsaWVudC5jbGllbnQucmVtb3ZlTGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHNlbGYuY2xpZW50UmVhZHlFdmVudCA9ICgpID0+IHtcbiAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpjb25uZWN0OnJlYWR5Jyk7XG4gICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3RlZCcpO1xuICAgIH07XG4gICAgc2VsZi5jbGllbnQub24oJ3JlYWR5Jywgc2VsZi5jbGllbnRSZWFkeUV2ZW50KTtcblxuICAgIHNlbGYuY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpjb25uZWN0OmVycm9yJyk7XG4gICAgICAvLyBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9O1xuICAgIHNlbGYuY2xpZW50Lm9uKCdlcnJvcicsIHNlbGYuY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICBzZWxmLmNsaWVudEVuZEV2ZW50ID0gKCkgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmNvbm5lY3Q6ZW5kJyk7XG4gICAgICBzZWxmLmVtaXQoJ2VuZGVkJywgJ0Nvbm5lY3Rpb24gZW5kJyk7XG4gICAgfTtcbiAgICBzZWxmLmNsaWVudC5vbignZW5kJywgc2VsZi5jbGllbnRFbmRFdmVudCk7XG5cbiAgICBzZWxmLmNsaWVudENsb3NlRXZlbnQgPSAoKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Y29ubmVjdDpjbG9zZScpO1xuICAgICAgc2VsZi5lbWl0KCdjbG9zZWQnLCAnQ29ubmVjdGlvbiBjbG9zZWQnKTtcbiAgICB9O1xuICAgIHNlbGYuY2xpZW50Lm9uKCdjbG9zZScsIHNlbGYuY2xpZW50Q2xvc2VFdmVudCk7XG5cbiAgICBsZXQgcHcgPSB0cnVlO1xuICAgIGlmIChjb25uZWN0aW9uLnVzZUFnZW50KSB7XG4gICAgICBsZXQgYWdlbnQgPSBzZWxmLmdldFNzaEFnZW50KCk7XG4gICAgICBpZiAoYWdlbnQpIHtcbiAgICAgICAgY29ubmVjdGlvbi5hZ2VudCA9IGFnZW50O1xuICAgICAgICBwdyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ05vIFNTSCBhZ2VudCBmb3VuZC4nLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdGYWxsaW5nIGJhY2sgdG8ga2V5ZmlsZSBvciBwYXNzd29yZCBiYXNlZCBhdXRoZW50aWNhdGlvbi4nXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHcgJiYgY29ubmVjdGlvbi5wcml2YXRla2V5ZmlsZSAmJiAhY29ubmVjdGlvbi5wcml2YXRlS2V5KSB7XG4gICAgICBpZiAoRmlsZVN5c3RlbS5leGlzdHNTeW5jKGNvbm5lY3Rpb24ucHJpdmF0ZWtleWZpbGUpKSB7XG4gICAgICAgIGNvbm5lY3Rpb24ucHJpdmF0ZUtleSA9IEZpbGVTeXN0ZW0ucmVhZEZpbGVTeW5jKGNvbm5lY3Rpb24ucHJpdmF0ZWtleWZpbGUsICd1dGY4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIHJlamVjdCh7IG1lc3NhZ2U6ICdQcml2YXRlIEtleWZpbGUgbm90IGZvdW5kLi4uJyB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwdyAmJiBjb25uZWN0aW9uLnByaXZhdGVLZXkgJiYgIWNvbm5lY3Rpb24ucGFzc3BocmFzZSkge1xuICAgICAgY29ubmVjdGlvbi5wYXNzcGhyYXNlID0gY29ubmVjdGlvbi5wYXNzd29yZDtcbiAgICB9XG5cbiAgICBjb25uZWN0aW9uLmRlYnVnID0gKG1zZykgPT4ge1xuICAgICAgaWYgKCFtc2cuaW5jbHVkZXMoJ0RFQlVHOiBQYXJzZXInKSkge1xuICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgbXNnLnJlcGxhY2UoJ0RFQlVHOicsICdzZnRwOmRlYnVnOicpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQuY29ubmVjdChjb25uZWN0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlc29sdmUoc2VsZik7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3NoQWdlbnQoKSB7XG4gICAgbGV0IHNvY2sgPSBwcm9jZXNzLmVudlsnU1NIX0FVVEhfU09DSyddXG4gICAgaWYgKHNvY2spIHtcbiAgICAgIHJldHVybiBzb2NrXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMicpIHtcbiAgICAgICAgcmV0dXJuICdwYWdlYW50J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5jbGllbnQpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXNlbGYuY2xpZW50LnNmdHApIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXNlbGYuY2xpZW50LnNmdHAuX3N0cmVhbSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBzZWxmLmNsaWVudC5zZnRwLl9zdHJlYW0ucmVhZGFibGU7XG4gIH1cblxuICBsaXN0KHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6bGlzdCcsIHJlbW90ZVBhdGgpO1xuXG4gICAgbGV0IHRpbWVyID0gbnVsbDtcblxuICAgIC8vIGlzc3VlLTc2IENhbm5vdCBjb25uZWN0IHRvIHNlcnZlcnMgYWZ0ZXIgcmVzdW1pbmcgZnJvbSBzdXNwZW5kXG4gICAgLy8gc2Z0cCBzZXJ2ZXIgZG9uJ3QgcmVhY3QgYWZ0ZXIgbG9vc2luZyBDb25uZWN0aW9uXG4gICAgLy8gV29ya2Fyb3VuZDogV2FpdCAxMCBzZWMsIHJlY29ubmVjdCBhbmQgdHJ5IGFnYWluXG4gICAgLy8gaWYgdGhlIHJlY29ubmVjdGlvbiBmYWlscywgdGhyb3cgZXJyb3JcblxuICAgIC8vIHJlY29ubmVjdCBhbmQgdHJ5IGxpc3QgYWdhaW5cbiAgICBsZXQgcHJvbWlzZUEgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXR1cm4gc2VsZi5lbmQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0KHNlbGYuY29ubmVjdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5saXN0KHJlbW90ZVBhdGgpLnRoZW4oKGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShsaXN0KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDEwMDAwKTtcbiAgICB9KTtcblxuICAgIC8vIGxpc3RcbiAgICBsZXQgcHJvbWlzZUIgPSBzZWxmLmNsaWVudC5saXN0KHJlbW90ZVBhdGgpLnRoZW4oKGxpc3QpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZXNvbHZlKGxpc3QpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcbiAgICAgIHByb21pc2VBLFxuICAgICAgcHJvbWlzZUJcbiAgICBdKTtcbiAgfVxuXG4gIG1rZGlyKHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6bWtkaXInLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5ta2RpcihyZW1vdGVQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlc29sdmUocmVtb3RlUGF0aC50cmltKCkpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJtZGlyKHJlbW90ZVBhdGgsIHJlY3Vyc2l2ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpybWRpcicsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnJtZGlyKHJlbW90ZVBhdGgsIHJlY3Vyc2l2ZSkudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZXNvbHZlKHJlbW90ZVBhdGgudHJpbSgpKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjaG1vZChyZW1vdGVQYXRoLCBwZXJtaXNzaW9ucykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpjaG1vZCcsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LmNobW9kKHJlbW90ZVBhdGgsIHBlcm1pc3Npb25zKTtcbiAgfVxuXG4gIHB1dChxdWV1ZUl0ZW0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6cHV0JywgcmVtb3RlUGF0aCk7XG5cbiAgICBsZXQgcmVtb3RlUGF0aCA9IHF1ZXVlSXRlbS5pbmZvLnJlbW90ZVBhdGg7XG4gICAgbGV0IGxvY2FsUGF0aCA9IHF1ZXVlSXRlbS5pbmZvLmxvY2FsUGF0aDtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHN0ciA9IHByb2dyZXNzKHsgdGltZTogMTAwIH0pO1xuICAgICAgbGV0IGlucHV0ID0gRmlsZVN5c3RlbS5jcmVhdGVSZWFkU3RyZWFtKGxvY2FsUGF0aCk7XG4gICAgICBpbnB1dC5wYXVzZSgpO1xuXG4gICAgICAvLyBEZWNsYXJlIGV2ZW50cyAgXG4gICAgICBjb25zdCBwcm9ncmVzc0V2ZW50ID0gKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhwcm9ncmVzcy50cmFuc2ZlcnJlZCk7XG4gICAgICAgIHNlbGYuZW1pdCgnZGF0YScsIHByb2dyZXNzLnRyYW5zZmVycmVkKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRDbG9zZUV2ZW50ID0gKGhhZEVycm9yKSA9PiB7XG4gICAgICAgIGlmIChoYWRFcnJvcikge1xuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KEVycm9yKCdzZnRwIGNsb3NlZCBjb25uZWN0aW9uJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lclxuICAgICAgc3RyLm9uKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub24oJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgaW5wdXQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ1RyYW5zZmVycmluZycpO1xuICAgICAgfSk7XG4gICAgICAvLyBpbnB1dC5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAvLyAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgIC8vICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8gaW5wdXQub25jZSgnZmluaXNoJywgKCkgPT4ge1xuICAgICAgLy8gICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgICAvLyAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAvLyB9KTtcbiAgICAgIGlucHV0Lm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcblxuICAgICAgLy8gY2hlY2sgZmlsZSBleGlzdHMgYW5kIGdldCBwZXJtaXNzaW9uc1xuICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LnN0YXQocmVtb3RlUGF0aCkudGhlbigoaW5mbykgPT4ge1xuICAgICAgICAvLyBmaWxlICBleGlzdHNcbiAgICAgICAgbGV0IG90aGVyT3B0aW9ucyA9IG51bGw7XG4gICAgICAgIGlmIChpbmZvLnBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgaW5mby5wZXJtaXNzaW9ucyA9IGluZm8ucGVybWlzc2lvbnMudG9TdHJpbmcoOCkuc3Vic3RyKC0zKTtcbiAgICAgICAgICBvdGhlck9wdGlvbnMgPSB7IG1vZGU6IHBhcnNlSW50KCcwJyArIGluZm8ucGVybWlzc2lvbnMsIDgpIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdGhlck9wdGlvbnMgPSB7IG1vZGU6IDBvNjQ0IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5wdXQoaW5wdXQucGlwZShzdHIpLCByZW1vdGVQYXRoLCBudWxsLCBudWxsLCBvdGhlck9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIGZpbGUgZG9lc24ndCBleGlzdHNcbiAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LnB1dChpbnB1dC5waXBlKHN0ciksIHJlbW90ZVBhdGgsIG51bGwsIG51bGwsIHsgbW9kZTogMG82NDQgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHF1ZXVlSXRlbS5pbmZvLnNpemUpO1xuICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZXQocXVldWVJdGVtKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldCcsIHJlbW90ZVBhdGgsIGxvY2FsUGF0aCk7XG5cbiAgICBsZXQgcmVtb3RlUGF0aCA9IHF1ZXVlSXRlbS5pbmZvLnJlbW90ZVBhdGg7XG4gICAgbGV0IGxvY2FsUGF0aCA9IHF1ZXVlSXRlbS5pbmZvLmxvY2FsUGF0aDtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHN0ciA9IHByb2dyZXNzKHsgdGltZTogMTAwIH0pO1xuXG4gICAgICAvLyBEZWNsYXJlIGV2ZW50cyAgXG4gICAgICBjb25zdCBwcm9ncmVzc0V2ZW50ID0gKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6Y2xpZW50LmdldDpwcm9ncmVzcycpO1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocHJvZ3Jlc3MudHJhbnNmZXJyZWQpO1xuICAgICAgICBzZWxmLmVtaXQoJ2RhdGEnLCBwcm9ncmVzcy50cmFuc2ZlcnJlZCk7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50Q2xvc2VFdmVudCA9IChoYWRFcnJvcikgPT4ge1xuICAgICAgICBpZiAoaGFkRXJyb3IpIHtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgIHJlamVjdChFcnJvcignc2Z0cCBjbG9zZWQgY29ubmVjdGlvbicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuXG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgIHN0ci5vbigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub24oJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgIHJldHVybiBzZWxmLmNsaWVudC5nZXQocmVtb3RlUGF0aCwgbnVsbCwgbnVsbCkudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgIHN0cmVhbS5wYXVzZSgpO1xuXG4gICAgICAgIHN0cmVhbS5vbigncmVhZGFibGUnLCAoKSA9PiB7XG4gICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldDpzdHJlYW0ucmVhZGFibGUnKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmNsaWVudC5nZXQ6c3VjY2VzcycpO1xuICAgICAgICBsZXQgZmlsZSA9IEZpbGVTeXN0ZW0uY3JlYXRlV3JpdGVTdHJlYW0obG9jYWxQYXRoLCB7IGF1dG9DbG9zZTogdHJ1ZSB9KTtcblxuICAgICAgICBmaWxlLm9uKCdvcGVuJywgKGVycikgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6ZmlsZS5vcGVuJyk7XG4gICAgICAgICAgcXVldWVJdGVtLmFkZFN0cmVhbShmaWxlKTtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdUcmFuc2ZlcnJpbmcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbGUub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6ZmlsZS5lcnJvcicpO1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWxlLm9uY2UoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmZpbGUuZmluaXNoJyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHF1ZXVlSXRlbS5pbmZvLnNpemUpO1xuICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0cmVhbS5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldDpzdHJlYW0uZW5kJyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHF1ZXVlSXRlbS5pbmZvLnNpemUpO1xuICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzdHJlYW0ub25jZSgnZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6c3RyZWFtLmZpbmlzaCcpO1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RyZWFtLm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6c3RyZWFtLmVycm9yJyk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldDpzdHJlYW0ucGlwZScpO1xuICAgICAgICBzdHJlYW0ucGlwZShzdHIpLnBpcGUoZmlsZSk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6Y2xpZW50LmdldDplcnJvcicpO1xuICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZGVsZXRlKHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6ZGVsZXRlJywgcmVtb3RlUGF0aCk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQuZGVsZXRlKHJlbW90ZVBhdGgpO1xuICB9XG5cbiAgcmVuYW1lKG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6cmVuYW1lJywgb2xkUmVtb3RlUGF0aCwgbmV3UmVtb3RlUGF0aCk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQucmVuYW1lKG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDplbmQnKTtcblxuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdyZWFkeScsIHNlbGYuY2xpZW50UmVhZHlFdmVudCk7XG4gICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgc2VsZi5jbGllbnRFcnJvckV2ZW50KTtcbiAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZW5kJywgc2VsZi5jbGllbnRFbmRFdmVudCk7XG4gICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgc2VsZi5jbGllbnRDbG9zZUV2ZW50KTtcblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5lbmQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDphYm9ydCcpO1xuXG4gICAgcmV0dXJuIHNlbGYuZW5kKCkudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5jb25uZWN0KHNlbGYuY29ubmVjdGlvbilcbiAgICB9KTtcbiAgfVxufVxuIl19