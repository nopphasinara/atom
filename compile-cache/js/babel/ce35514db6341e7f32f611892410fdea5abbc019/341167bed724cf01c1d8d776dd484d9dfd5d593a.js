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
        input.once('error', function (err) {
          // Remove event listener
          str.removeListener('progress', progressEvent);
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);

          queueItem.changeStatus('Error');
          reject(err);
        });
        // input.once('end', () => {
        //   queueItem.changeProgress(queueItem.info.size);
        //   resolve(localPath.trim());
        // });

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
          // file.once('finish', () => {
          //   self.emit('debug', 'sftp:get:file.finish');
          //   // Remove event listener
          //   str.removeListener('progress', progressEvent);
          //   self.client.removeListener('close', clientCloseEvent);
          //   self.client.removeListener('error', clientErrorEvent);

          //   queueItem.changeProgress(queueItem.info.size);
          //   resolve(localPath.trim());
          // });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL3NmdHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0NBRXVCLDhCQUE4Qjs7OztBQUZyRCxXQUFXLENBQUM7O0FBSVosSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFdkIsSUFBSTtZQUFKLElBQUk7O0FBRVosV0FGUSxJQUFJLEdBRVQ7MEJBRkssSUFBSTs7QUFHckIsK0JBSGlCLElBQUksNkNBR2I7QUFDUixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM3QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0dBQzlCOztlQVhrQixJQUFJOztXQWFoQixpQkFBQyxVQUFVLEVBQUU7OztBQUNsQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLEdBQUcsdUNBQWdCLENBQUM7OztBQUcvQixVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxVQUFVLFNBQVMsRUFBRSxRQUFRLEVBQUU7QUFDMUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENB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a2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL3NmdHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHNmdHBDbGllbnQgZnJvbSAnLi8uLi9oZWxwZXIvc3NoMi1zZnRwLWNsaWVudCc7XG5cbmNvbnN0IEZpbGVTeXN0ZW0gPSByZXF1aXJlKCdmcy1wbHVzJyk7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IHByb2dyZXNzID0gcmVxdWlyZSgncHJvZ3Jlc3Mtc3RyZWFtJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNmdHAgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgIHNlbGYuY2xpZW50UmVhZHlFdmVudCA9IG51bGw7XG4gICAgc2VsZi5jbGllbnRFcnJvckV2ZW50ID0gbnVsbDtcbiAgICBzZWxmLmNsaWVudEVuZEV2ZW50ID0gbnVsbDtcbiAgICBzZWxmLmNsaWVudENsb3NlRXZlbnQgPSBudWxsO1xuICB9XG5cbiAgY29ubmVjdChjb25uZWN0aW9uKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmNvbm5lY3QnKTtcblxuICAgIHNlbGYuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgc2VsZi5jbGllbnQgPSBuZXcgc2Z0cENsaWVudCgpO1xuXG4gICAgLy8gYWRkIHJlbW92ZSBsaXN0ZW5lciBzdXBwb3J0LCBiZWNhdXNlIGl0J3Mgbm90IGltcGxlbWVudGVkIGluIGxpYlxuICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgY2FsbGJhY2spIHtcbiAgICAgIHNlbGYuY2xpZW50LmNsaWVudC5yZW1vdmVMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgc2VsZi5jbGllbnRSZWFkeUV2ZW50ID0gKCkgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmNvbm5lY3Q6cmVhZHknKTtcbiAgICAgIHRoaXMuZW1pdCgnY29ubmVjdGVkJyk7XG4gICAgfTtcbiAgICBzZWxmLmNsaWVudC5vbigncmVhZHknLCBzZWxmLmNsaWVudFJlYWR5RXZlbnQpO1xuXG4gICAgc2VsZi5jbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmNvbm5lY3Q6ZXJyb3InKTtcbiAgICAgIC8vIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgIH07XG4gICAgc2VsZi5jbGllbnQub24oJ2Vycm9yJywgc2VsZi5jbGllbnRFcnJvckV2ZW50KTtcblxuICAgIHNlbGYuY2xpZW50RW5kRXZlbnQgPSAoKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Y29ubmVjdDplbmQnKTtcbiAgICAgIHNlbGYuZW1pdCgnZW5kZWQnLCAnQ29ubmVjdGlvbiBlbmQnKTtcbiAgICB9O1xuICAgIHNlbGYuY2xpZW50Lm9uKCdlbmQnLCBzZWxmLmNsaWVudEVuZEV2ZW50KTtcblxuICAgIHNlbGYuY2xpZW50Q2xvc2VFdmVudCA9ICgpID0+IHtcbiAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpjb25uZWN0OmNsb3NlJyk7XG4gICAgICBzZWxmLmVtaXQoJ2Nsb3NlZCcsICdDb25uZWN0aW9uIGNsb3NlZCcpO1xuICAgIH07XG4gICAgc2VsZi5jbGllbnQub24oJ2Nsb3NlJywgc2VsZi5jbGllbnRDbG9zZUV2ZW50KTtcblxuICAgIGxldCBwdyA9IHRydWU7XG4gICAgaWYgKGNvbm5lY3Rpb24udXNlQWdlbnQpIHtcbiAgICAgIGxldCBhZ2VudCA9IHNlbGYuZ2V0U3NoQWdlbnQoKTtcbiAgICAgIGlmIChhZ2VudCkge1xuICAgICAgICBjb25uZWN0aW9uLmFnZW50ID0gYWdlbnQ7XG4gICAgICAgIHB3ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnTm8gU1NIIGFnZW50IGZvdW5kLicsIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ZhbGxpbmcgYmFjayB0byBrZXlmaWxlIG9yIHBhc3N3b3JkIGJhc2VkIGF1dGhlbnRpY2F0aW9uLidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwdyAmJiBjb25uZWN0aW9uLnByaXZhdGVrZXlmaWxlICYmICFjb25uZWN0aW9uLnByaXZhdGVLZXkpIHtcbiAgICAgIGlmIChGaWxlU3lzdGVtLmV4aXN0c1N5bmMoY29ubmVjdGlvbi5wcml2YXRla2V5ZmlsZSkpIHtcbiAgICAgICAgY29ubmVjdGlvbi5wcml2YXRlS2V5ID0gRmlsZVN5c3RlbS5yZWFkRmlsZVN5bmMoY29ubmVjdGlvbi5wcml2YXRla2V5ZmlsZSwgJ3V0ZjgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgcmVqZWN0KHsgbWVzc2FnZTogJ1ByaXZhdGUgS2V5ZmlsZSBub3QgZm91bmQuLi4nIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHB3ICYmIGNvbm5lY3Rpb24ucHJpdmF0ZUtleSAmJiAhY29ubmVjdGlvbi5wYXNzcGhyYXNlKSB7XG4gICAgICBjb25uZWN0aW9uLnBhc3NwaHJhc2UgPSBjb25uZWN0aW9uLnBhc3N3b3JkO1xuICAgIH1cblxuICAgIGNvbm5lY3Rpb24uZGVidWcgPSAobXNnKSA9PiB7XG4gICAgICBpZiAoIW1zZy5pbmNsdWRlcygnREVCVUc6IFBhcnNlcicpKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCBtc2cucmVwbGFjZSgnREVCVUc6JywgJ3NmdHA6ZGVidWc6JykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWxmLmNsaWVudC5jb25uZWN0KGNvbm5lY3Rpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVzb2x2ZShzZWxmKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTc2hBZ2VudCgpIHtcbiAgICBsZXQgc29jayA9IHByb2Nlc3MuZW52WydTU0hfQVVUSF9TT0NLJ11cbiAgICBpZiAoc29jaykge1xuICAgICAgcmV0dXJuIHNvY2tcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJykge1xuICAgICAgICByZXR1cm4gJ3BhZ2VhbnQnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLmNsaWVudCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghc2VsZi5jbGllbnQuc2Z0cCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghc2VsZi5jbGllbnQuc2Z0cC5fc3RyZWFtKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnNmdHAuX3N0cmVhbS5yZWFkYWJsZTtcbiAgfVxuXG4gIGxpc3QocmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpsaXN0JywgcmVtb3RlUGF0aCk7XG5cbiAgICBsZXQgdGltZXIgPSBudWxsO1xuXG4gICAgLy8gaXNzdWUtNzYgQ2Fubm90IGNvbm5lY3QgdG8gc2VydmVycyBhZnRlciByZXN1bWluZyBmcm9tIHN1c3BlbmRcbiAgICAvLyBzZnRwIHNlcnZlciBkb24ndCByZWFjdCBhZnRlciBsb29zaW5nIENvbm5lY3Rpb25cbiAgICAvLyBXb3JrYXJvdW5kOiBXYWl0IDEwIHNlYywgcmVjb25uZWN0IGFuZCB0cnkgYWdhaW5cbiAgICAvLyBpZiB0aGUgcmVjb25uZWN0aW9uIGZhaWxzLCB0aHJvdyBlcnJvclxuXG4gICAgLy8gcmVjb25uZWN0IGFuZCB0cnkgbGlzdCBhZ2FpblxuICAgIGxldCBwcm9taXNlQSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJldHVybiBzZWxmLmVuZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Qoc2VsZi5jb25uZWN0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmxpc3QocmVtb3RlUGF0aCkudGhlbigobGlzdCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGxpc3QpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSwgMTAwMDApO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdFxuICAgIGxldCBwcm9taXNlQiA9IHNlbGYuY2xpZW50Lmxpc3QocmVtb3RlUGF0aCkudGhlbigobGlzdCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlc29sdmUobGlzdCk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLnJhY2UoW1xuICAgICAgcHJvbWlzZUEsXG4gICAgICBwcm9taXNlQlxuICAgIF0pO1xuICB9XG5cbiAgbWtkaXIocmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpta2RpcicsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50Lm1rZGlyKHJlbW90ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVzb2x2ZShyZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcm1kaXIocmVtb3RlUGF0aCwgcmVjdXJzaXZlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOnJtZGlyJywgcmVtb3RlUGF0aCk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQucm1kaXIocmVtb3RlUGF0aCwgcmVjdXJzaXZlKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlc29sdmUocmVtb3RlUGF0aC50cmltKCkpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kKHJlbW90ZVBhdGgsIHBlcm1pc3Npb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmNobW9kJywgcmVtb3RlUGF0aCk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQuY2htb2QocmVtb3RlUGF0aCwgcGVybWlzc2lvbnMpO1xuICB9XG5cbiAgcHV0KHF1ZXVlSXRlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpwdXQnLCByZW1vdGVQYXRoKTtcblxuICAgIGxldCByZW1vdGVQYXRoID0gcXVldWVJdGVtLmluZm8ucmVtb3RlUGF0aDtcbiAgICBsZXQgbG9jYWxQYXRoID0gcXVldWVJdGVtLmluZm8ubG9jYWxQYXRoO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc3RyID0gcHJvZ3Jlc3MoeyB0aW1lOiAxMDAgfSk7XG4gICAgICBsZXQgaW5wdXQgPSBGaWxlU3lzdGVtLmNyZWF0ZVJlYWRTdHJlYW0obG9jYWxQYXRoKTtcbiAgICAgIGlucHV0LnBhdXNlKCk7XG5cbiAgICAgIC8vIERlY2xhcmUgZXZlbnRzICBcbiAgICAgIGNvbnN0IHByb2dyZXNzRXZlbnQgPSAocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHByb2dyZXNzLnRyYW5zZmVycmVkKTtcbiAgICAgICAgc2VsZi5lbWl0KCdkYXRhJywgcHJvZ3Jlc3MudHJhbnNmZXJyZWQpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGhhZEVycm9yKSB7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoRXJyb3IoJ3NmdHAgY2xvc2VkIGNvbm5lY3Rpb24nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudEVycm9yRXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICBzdHIub24oJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICBpbnB1dC5vbignb3BlbicsICgpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnVHJhbnNmZXJyaW5nJyk7XG4gICAgICB9KTtcbiAgICAgIGlucHV0Lm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIC8vIGlucHV0Lm9uY2UoJ2VuZCcsICgpID0+IHtcbiAgICAgIC8vICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHF1ZXVlSXRlbS5pbmZvLnNpemUpO1xuICAgICAgLy8gICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgLy8gfSk7XG5cbiAgICAgIC8vIGNoZWNrIGZpbGUgZXhpc3RzIGFuZCBnZXQgcGVybWlzc2lvbnNcbiAgICAgIHJldHVybiBzZWxmLmNsaWVudC5zdGF0KHJlbW90ZVBhdGgpLnRoZW4oKGluZm8pID0+IHtcbiAgICAgICAgLy8gZmlsZSAgZXhpc3RzXG4gICAgICAgIGxldCBvdGhlck9wdGlvbnMgPSBudWxsO1xuICAgICAgICBpZiAoaW5mby5wZXJtaXNzaW9ucykge1xuICAgICAgICAgIGluZm8ucGVybWlzc2lvbnMgPSBpbmZvLnBlcm1pc3Npb25zLnRvU3RyaW5nKDgpLnN1YnN0cigtMyk7XG4gICAgICAgICAgb3RoZXJPcHRpb25zID0geyBtb2RlOiBwYXJzZUludCgnMCcgKyBpbmZvLnBlcm1pc3Npb25zLCA4KSB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3RoZXJPcHRpb25zID0geyBtb2RlOiAwbzY0NCB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jbGllbnQucHV0KGlucHV0LnBpcGUoc3RyKSwgcmVtb3RlUGF0aCwgbnVsbCwgbnVsbCwgb3RoZXJPcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgICAgICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyBmaWxlIGRvZXNuJ3QgZXhpc3RzXG4gICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5wdXQoaW5wdXQucGlwZShzdHIpLCByZW1vdGVQYXRoLCBudWxsLCBudWxsLCB7IG1vZGU6IDBvNjQ0IH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZ2V0KHF1ZXVlSXRlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQnLCByZW1vdGVQYXRoLCBsb2NhbFBhdGgpO1xuXG4gICAgbGV0IHJlbW90ZVBhdGggPSBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoO1xuICAgIGxldCBsb2NhbFBhdGggPSBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGg7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBzdHIgPSBwcm9ncmVzcyh7IHRpbWU6IDEwMCB9KTtcblxuICAgICAgLy8gRGVjbGFyZSBldmVudHMgIFxuICAgICAgY29uc3QgcHJvZ3Jlc3NFdmVudCA9IChwcm9ncmVzcykgPT4ge1xuICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmNsaWVudC5nZXQ6cHJvZ3Jlc3MnKTtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHByb2dyZXNzLnRyYW5zZmVycmVkKTtcbiAgICAgICAgc2VsZi5lbWl0KCdkYXRhJywgcHJvZ3Jlc3MudHJhbnNmZXJyZWQpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGhhZEVycm9yKSB7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoRXJyb3IoJ3NmdHAgY2xvc2VkIGNvbm5lY3Rpb24nKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudEVycm9yRXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICBzdHIub24oJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICByZXR1cm4gc2VsZi5jbGllbnQuZ2V0KHJlbW90ZVBhdGgsIG51bGwsIG51bGwpLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICBzdHJlYW0ucGF1c2UoKTtcblxuICAgICAgICBzdHJlYW0ub24oJ3JlYWRhYmxlJywgKCkgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6c3RyZWFtLnJlYWRhYmxlJyk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldDpjbGllbnQuZ2V0OnN1Y2Nlc3MnKTtcbiAgICAgICAgbGV0IGZpbGUgPSBGaWxlU3lzdGVtLmNyZWF0ZVdyaXRlU3RyZWFtKGxvY2FsUGF0aCwgeyBhdXRvQ2xvc2U6IHRydWUgfSk7XG5cbiAgICAgICAgZmlsZS5vbignb3BlbicsIChlcnIpID0+IHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmZpbGUub3BlbicpO1xuICAgICAgICAgIHF1ZXVlSXRlbS5hZGRTdHJlYW0oZmlsZSk7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnVHJhbnNmZXJyaW5nJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWxlLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmZpbGUuZXJyb3InKTtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gZmlsZS5vbmNlKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgIC8vICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmdldDpmaWxlLmZpbmlzaCcpO1xuICAgICAgICAvLyAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAvLyAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgLy8gICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgLy8gICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAvLyAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgLy8gICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICBzdHJlYW0ub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6c3RyZWFtLmVuZCcpO1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RyZWFtLm9uY2UoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OnN0cmVhbS5maW5pc2gnKTtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG5cbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgICAgICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN0cmVhbS5vbmNlKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OnN0cmVhbS5lcnJvcicpO1xuICAgICAgICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnc2Z0cDpnZXQ6c3RyZWFtLnBpcGUnKTtcbiAgICAgICAgc3RyZWFtLnBpcGUoc3RyKS5waXBlKGZpbGUpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6Z2V0OmNsaWVudC5nZXQ6ZXJyb3InKTtcbiAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuXG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGRlbGV0ZShyZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOmRlbGV0ZScsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LmRlbGV0ZShyZW1vdGVQYXRoKTtcbiAgfVxuXG4gIHJlbmFtZShvbGRSZW1vdGVQYXRoLCBuZXdSZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdzZnRwOnJlbmFtZScsIG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50LnJlbmFtZShvbGRSZW1vdGVQYXRoLCBuZXdSZW1vdGVQYXRoKTtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6ZW5kJyk7XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcigncmVhZHknLCBzZWxmLmNsaWVudFJlYWR5RXZlbnQpO1xuICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHNlbGYuY2xpZW50RXJyb3JFdmVudCk7XG4gICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHNlbGYuY2xpZW50RW5kRXZlbnQpO1xuICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIHNlbGYuY2xpZW50Q2xvc2VFdmVudCk7XG5cbiAgICByZXR1cm4gc2VsZi5jbGllbnQuZW5kKCk7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ3NmdHA6YWJvcnQnKTtcblxuICAgIHJldHVybiBzZWxmLmVuZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdChzZWxmLmNvbm5lY3Rpb24pXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==