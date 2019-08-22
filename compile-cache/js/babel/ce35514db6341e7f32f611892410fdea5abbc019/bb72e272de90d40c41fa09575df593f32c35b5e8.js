'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ftpClient = require('@icetee/ftp');
var EventEmitter = require('events');
var FileSystem = require('fs-plus');
var progress = require('progress-stream');

var Ftp = (function (_EventEmitter) {
  _inherits(Ftp, _EventEmitter);

  function Ftp() {
    _classCallCheck(this, Ftp);

    _get(Object.getPrototypeOf(Ftp.prototype), 'constructor', this).call(this);

    self.clientReadyEvent = null;
    self.clientErrorEvent = null;
    self.clientEndEvent = null;
    self.clientCloseEvent = null;
  }

  _createClass(Ftp, [{
    key: 'connect',
    value: function connect(connection) {
      var _this = this;

      var self = this;
      self.emit('debug', 'ftp:connect');

      self.client = new ftpClient();
      var promise = new Promise(function (resolve, reject) {
        self.clientReadyEvent = function () {
          // Not able to get directory listing for regular FTP to an IBM i (or AS/400 or iSeries) #123
          // Force IBM i (or AS/400 or iSeries) returns information
          // for the LIST subcommand in the UNIX style list format.
          self.client.site('LISTFMT 1', function (err) {});

          if (self.client._socket) {
            self.client._socket.setTimeout(1000 * 30); // 30 seconds

            self.client._socket.on('ready', function () {
              self.emit('debug', 'ftp:socket:ready');
            });
            self.client._socket.on('end', function () {
              self.emit('debug', 'ftp:socket:end');
              self.connected = false;
            });
            self.client._socket.on('close', function () {
              self.emit('debug', 'ftp:socket:close');
              self.connected = false;
            });
            self.client._socket.on('timeout', function (err) {
              self.emit('debug', 'ftp:socket:timeout');
              self.connected = false;
              self.client._socket.destroy();
              self.client.emit('timeout', new Error('Connection timeout'));
            });
          }

          self.emit('debug', 'ftp:connect:ready');
          self.connected = true;
          _this.emit('connected');
          resolve(self);
        };
        self.client.on('ready', self.clientReadyEvent);

        self.clientErrorEvent = function (err) {
          self.emit('debug', 'ftp:connect:error', err);
          self.connected = self.client.connected;
          // self.emit('error', err);
          reject(err);
        };
        self.client.on('error', self.clientErrorEvent);

        self.clientEndEvent = function () {
          self.emit('debug', 'ftp:connect:end');
          self.connected = false;
          self.emit('log', '> Connection end');
          self.emit('ended', 'Connection end');
          reject({ message: 'Connection end' });
        };
        self.client.on('end', self.clientEndEvent);

        self.clientCloseEvent = function (hadError) {
          self.emit('debug', 'ftp:connect:close');
          self.connected = false;
          self.emit('log', '> Connection closed');
          self.emit('closed', 'Connection closed');
          reject({ message: 'Connection closed' });
        };
        self.client.on('close', self.clientCloseEvent);
      });

      if (connection.secure) {
        connection.secureOptions = { 'rejectUnauthorized': false };
      }

      connection.debug = function (msg) {
        var data = msg.split(/\[(.*)\] (>|<)(.*)/g);
        if (data[1] == "connection") {
          var direction = data[2];
          var cmd = data[3].replace(/\'+/g, "").replace(/\\r|\\n/g, " ");

          // mask password
          if (direction.trim() == ">") {
            var cmdparts = cmd.split(" ");
            if (cmdparts[1] == "PASS") {
              cmd = cmdparts[1] + " " + '*'.repeat(cmdparts[2].length);
            }
          }

          self.emit('log', direction + ' ' + cmd);
        }
      };

      self.client.connect(connection);

      return promise;
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      var self = this;

      if (!self.client) return false;
      if (!self.client._socket) return false;
      if (!self.client._socket.readable) return false;

      return self.connected;
    }
  }, {
    key: 'list',
    value: function list(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:list', remotePath);

      var showHiddenFiles = atom.config.get('ftp-remote-edit.tree.showHiddenFiles');

      var promise = new Promise(function (resolve, reject) {
        try {
          (function () {
            // Add event listener
            var clientCloseEvent = function clientCloseEvent(hadError) {
              reject(Error('ftp closed connection'));
            };
            var clientErrorEvent = function clientErrorEvent(err) {
              reject(err);
            };
            var clientTimeoutEvent = function clientTimeoutEvent(err) {
              reject(err);
            };

            self.client.once('close', clientCloseEvent);
            self.client.once('error', clientErrorEvent);
            self.client.once('timeout', clientTimeoutEvent);

            var path = showHiddenFiles ? '-al ' + remotePath.trim() : remotePath.trim();
            self.client.list(path, function (err, list) {
              self.client.removeListener('close', clientCloseEvent);
              self.client.removeListener('error', clientErrorEvent);
              self.client.removeListener('timeout', clientTimeoutEvent);

              if (err) {
                reject(err);
              } else if (list) {
                resolve(list);
              } else {
                resolve([]);
              }
            });
          })();
        } catch (err) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);
          reject(err);
        }
      });

      return promise;
    }
  }, {
    key: 'mkdir',
    value: function mkdir(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:mkdir', remotePath);

      var promise = new Promise(function (resolve, reject) {
        // Add event listener
        var clientCloseEvent = function clientCloseEvent(hadError) {
          reject(Error('ftp closed connection'));
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          reject(err);
        };

        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client.mkdir(remotePath.trim(), function (err) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);

          if (err) {
            reject(err);
          } else {
            resolve(remotePath.trim());
          }
        });
      });

      return promise;
    }
  }, {
    key: 'rmdir',
    value: function rmdir(remotePath, recursive) {
      var self = this;
      self.emit('debug', 'ftp:rmdir', remotePath);

      var promise = new Promise(function (resolve, reject) {
        // Add event listener
        var clientCloseEvent = function clientCloseEvent(hadError) {
          reject(Error('ftp closed connection'));
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          reject(err);
        };

        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client.rmdir(remotePath.trim(), recursive, function (err) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);

          if (err) {
            reject(err);
          } else {
            resolve(remotePath.trim());
          }
        });
      });

      return promise;
    }
  }, {
    key: 'chmod',
    value: function chmod(remotePath, permissions) {
      var self = this;
      self.emit('debug', 'ftp:chmod', remotePath);

      var promise = new Promise(function (resolve, reject) {
        // Add event listener
        var clientCloseEvent = function clientCloseEvent(hadError) {
          reject(Error('ftp closed connection'));
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          reject(err);
        };

        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client.site('CHMOD ' + permissions + ' ' + remotePath, function (err, responseText, responseCode) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);

          if (err) {
            reject(err);
          } else {
            resolve(responseText);
          }
        });
      });

      return promise;
    }
  }, {
    key: 'put',
    value: function put(queueItem) {
      var self = this;
      self.emit('debug', 'ftp:put', remotePath);

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
            reject(Error('ftp closed connection'));
          } else {
            resolve(localPath.trim());
          }
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };

        // Add event listener
        str.on('progress', progressEvent);
        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

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
          self.client.removeListener('timeout', clientTimeoutEvent);

          queueItem.changeStatus('Error');
          reject(err);
        });

        self.client.put(input.pipe(str), remotePath, false, function (err) {
          if (err) {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);
            self.client.removeListener('timeout', clientTimeoutEvent);

            queueItem.changeStatus('Error');
            reject(err);
          } else {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);
            self.client.removeListener('timeout', clientTimeoutEvent);

            queueItem.changeProgress(queueItem.info.size);
            resolve(remotePath.trim());
          }
        });
      });

      return promise;
    }
  }, {
    key: 'get',
    value: function get(queueItem) {
      var self = this;
      self.emit('debug', 'ftp:get', remotePath, localPath);

      var remotePath = queueItem.info.remotePath;
      var localPath = queueItem.info.localPath;

      var promise = new Promise(function (resolve, reject) {
        var str = progress({ time: 100 });

        // Declare events 
        var progressEvent = function progressEvent(progress) {
          queueItem.changeProgress(progress.transferred);
          self.emit('data', progress.transferred);
        };
        var clientCloseEvent = function clientCloseEvent(hadError) {
          if (hadError) {
            queueItem.changeStatus('Error');
            reject(Error('ftp closed connection'));
          } else {
            resolve(localPath.trim());
          }
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          queueItem.changeStatus('Error');
          reject(err);
        };

        // Add event listener
        str.on('progress', progressEvent);
        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client.get(remotePath, function (err, stream) {
          if (err) {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);
            self.client.removeListener('timeout', clientTimeoutEvent);

            queueItem.changeStatus('Error');
            reject(err);
          } else if (stream) {
            (function () {
              var file = FileSystem.createWriteStream(localPath, { autoClose: true });

              file.once('open', function () {
                queueItem.addStream(file);
                queueItem.changeStatus('Transferring');
              });
              file.once('error', function (err) {
                // Remove event listener
                str.removeListener('progress', progressEvent);
                self.client.removeListener('close', clientCloseEvent);
                self.client.removeListener('error', clientErrorEvent);
                self.client.removeListener('timeout', clientTimeoutEvent);

                queueItem.changeStatus('Error');
                reject(err);
              });

              stream.once('end', function () {
                // Remove event listener
                str.removeListener('progress', progressEvent);
                self.client.removeListener('close', clientCloseEvent);
                self.client.removeListener('error', clientErrorEvent);
                self.client.removeListener('timeout', clientTimeoutEvent);

                queueItem.changeProgress(queueItem.info.size);
                resolve(localPath.trim());
              });
              stream.once('finish', function () {
                // Remove event listener
                str.removeListener('progress', progressEvent);
                self.client.removeListener('close', clientCloseEvent);
                self.client.removeListener('error', clientErrorEvent);
                self.client.removeListener('timeout', clientTimeoutEvent);

                queueItem.changeProgress(queueItem.info.size);
                resolve(localPath.trim());
              });
              stream.once('error', function (err) {
                // Remove event listener
                str.removeListener('progress', progressEvent);
                self.client.removeListener('close', clientCloseEvent);
                self.client.removeListener('error', clientErrorEvent);
                self.client.removeListener('timeout', clientTimeoutEvent);

                queueItem.changeStatus('Error');
                reject(err);
              });

              stream.pause();
              stream.pipe(str).pipe(file);
            })();
          } else {
            // Remove event listener
            str.removeListener('progress', progressEvent);
            self.client.removeListener('close', clientCloseEvent);
            self.client.removeListener('error', clientErrorEvent);
            self.client.removeListener('timeout', clientTimeoutEvent);

            queueItem.changeStatus('Error');
            reject(new Error('File Stream closed'));
          }
        });
      });

      return promise;
    }
  }, {
    key: 'delete',
    value: function _delete(remotePath) {
      var self = this;
      self.emit('debug', 'ftp:delete', remotePath);

      var promise = new Promise(function (resolve, reject) {
        // Add event listener
        var clientCloseEvent = function clientCloseEvent(hadError) {
          reject(Error('ftp closed connection'));
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          reject(err);
        };

        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client['delete'](remotePath, function (err) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);

          if (err) {
            reject(err);
          } else {
            resolve(remotePath.trim());
          }
        });
      });

      return promise;
    }
  }, {
    key: 'rename',
    value: function rename(oldRemotePath, newRemotePath) {
      var self = this;
      self.emit('debug', 'ftp:rename', oldRemotePath, newRemotePath);

      var promise = new Promise(function (resolve, reject) {
        // Add event listener
        var clientCloseEvent = function clientCloseEvent(hadError) {
          reject(Error('ftp closed connection'));
        };
        var clientErrorEvent = function clientErrorEvent(err) {
          reject(err);
        };
        var clientTimeoutEvent = function clientTimeoutEvent(err) {
          reject(err);
        };

        self.client.once('close', clientCloseEvent);
        self.client.once('error', clientErrorEvent);
        self.client.once('timeout', clientTimeoutEvent);

        self.client.rename(oldRemotePath.trim(), newRemotePath.trim(), function (err) {
          self.client.removeListener('close', clientCloseEvent);
          self.client.removeListener('error', clientErrorEvent);
          self.client.removeListener('timeout', clientTimeoutEvent);

          if (err) {
            reject(err);
          } else {
            resolve(newRemotePath.trim());
          }
        });
      });

      return promise;
    }
  }, {
    key: 'end',
    value: function end() {
      var self = this;
      self.emit('debug', 'ftp:end');

      self.connected = false;
      var promise = new Promise(function (resolve, reject) {
        if (!self.client) return resolve(true);

        // Declare events 
        var clientEndEvent = function clientEndEvent() {
          self.emit('debug', 'ftp:end');

          // Remove event listener
          self.client.removeListener('end', clientEndEvent);
          self.client.removeListener('close', clientCloseEvent);

          self.client.removeListener('ready', self.clientReadyEvent);
          self.client.removeListener('error', self.clientErrorEvent);
          self.client.removeListener('end', self.clientEndEvent);
          self.client.removeListener('close', self.clientCloseEvent);
          resolve(true);
        };
        var clientCloseEvent = function clientCloseEvent(hadError) {
          self.emit('debug', 'ftp:end');

          resolve(true);
        };

        // Add event listener
        self.client.on('end', clientEndEvent);
        self.client.on('close', clientCloseEvent);

        self.client.end();
      });

      return promise;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var self = this;
      self.emit('debug', 'ftp:abort');

      var promise = new Promise(function (resolve, reject) {
        if (!self.client) return resolve(true);

        self.client.abort(function (err) {
          resolve();
        });
      });

      return promise;
    }
  }]);

  return Ftp;
})(EventEmitter);

exports['default'] = Ftp;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL2Z0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBRVosSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRXZCLEdBQUc7WUFBSCxHQUFHOztBQUVYLFdBRlEsR0FBRyxHQUVSOzBCQUZLLEdBQUc7O0FBR3BCLCtCQUhpQixHQUFHLDZDQUdaOztBQUVSLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM3QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0dBQzlCOztlQVRrQixHQUFHOztXQVdmLGlCQUFDLFVBQVUsRUFBRTs7O0FBQ2xCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQzs7QUFFbEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQzlCLFVBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUM3QyxZQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBTTs7OztBQUk1QixjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUssRUFBRyxDQUFD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RixZQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLFFBQVEsRUFBSztBQUNyQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFOUIsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNmLENBQUM7OztBQUdGLFlBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN0QyxZQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFMUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNuQixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVoQyxVQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3pCLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBdGxCa0IsR0FBRztHQUFTLFlBQVk7O3FCQUF4QixHQUFHIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL2Z0cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBmdHBDbGllbnQgPSByZXF1aXJlKCdAaWNldGVlL2Z0cCcpO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBGaWxlU3lzdGVtID0gcmVxdWlyZSgnZnMtcGx1cycpO1xuY29uc3QgcHJvZ3Jlc3MgPSByZXF1aXJlKCdwcm9ncmVzcy1zdHJlYW0nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnRwIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgc2VsZi5jbGllbnRSZWFkeUV2ZW50ID0gbnVsbDtcbiAgICBzZWxmLmNsaWVudEVycm9yRXZlbnQgPSBudWxsO1xuICAgIHNlbGYuY2xpZW50RW5kRXZlbnQgPSBudWxsO1xuICAgIHNlbGYuY2xpZW50Q2xvc2VFdmVudCA9IG51bGw7XG4gIH1cblxuICBjb25uZWN0KGNvbm5lY3Rpb24pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpjb25uZWN0Jyk7XG5cbiAgICBzZWxmLmNsaWVudCA9IG5ldyBmdHBDbGllbnQoKTtcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlbGYuY2xpZW50UmVhZHlFdmVudCA9ICgpID0+IHtcbiAgICAgICAgLy8gTm90IGFibGUgdG8gZ2V0IGRpcmVjdG9yeSBsaXN0aW5nIGZvciByZWd1bGFyIEZUUCB0byBhbiBJQk0gaSAob3IgQVMvNDAwIG9yIGlTZXJpZXMpICMxMjNcbiAgICAgICAgLy8gRm9yY2UgSUJNIGkgKG9yIEFTLzQwMCBvciBpU2VyaWVzKSByZXR1cm5zIGluZm9ybWF0aW9uXG4gICAgICAgIC8vIGZvciB0aGUgTElTVCBzdWJjb21tYW5kIGluIHRoZSBVTklYIHN0eWxlIGxpc3QgZm9ybWF0LlxuICAgICAgICBzZWxmLmNsaWVudC5zaXRlKCdMSVNURk1UIDEnLCAoZXJyKSA9PiB7IH0pO1xuXG4gICAgICAgIGlmIChzZWxmLmNsaWVudC5fc29ja2V0KSB7XG4gICAgICAgICAgc2VsZi5jbGllbnQuX3NvY2tldC5zZXRUaW1lb3V0KDEwMDAgKiAzMCk7IC8vIDMwIHNlY29uZHNcblxuICAgICAgICAgIHNlbGYuY2xpZW50Ll9zb2NrZXQub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6c29ja2V0OnJlYWR5Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2VsZi5jbGllbnQuX3NvY2tldC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6c29ja2V0OmVuZCcpO1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5fc29ja2V0Lm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOnNvY2tldDpjbG9zZScpO1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZWxmLmNsaWVudC5fc29ja2V0Lm9uKCd0aW1lb3V0JywgKGVycikgPT4ge1xuICAgICAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6c29ja2V0OnRpbWVvdXQnKTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5fc29ja2V0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LmVtaXQoJ3RpbWVvdXQnLCBuZXcgRXJyb3IoJ0Nvbm5lY3Rpb24gdGltZW91dCcpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmNvbm5lY3Q6cmVhZHknKTtcbiAgICAgICAgc2VsZi5jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3RlZCcpO1xuICAgICAgICByZXNvbHZlKHNlbGYpO1xuICAgICAgfTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uKCdyZWFkeScsIHNlbGYuY2xpZW50UmVhZHlFdmVudCk7XG5cbiAgICAgIHNlbGYuY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDplcnJvcicsIGVycik7XG4gICAgICAgIHNlbGYuY29ubmVjdGVkID0gc2VsZi5jbGllbnQuY29ubmVjdGVkO1xuICAgICAgICAvLyBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgc2VsZi5jbGllbnQub24oJ2Vycm9yJywgc2VsZi5jbGllbnRFcnJvckV2ZW50KTtcblxuICAgICAgc2VsZi5jbGllbnRFbmRFdmVudCA9ICgpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDplbmQnKTtcbiAgICAgICAgc2VsZi5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5lbWl0KCdsb2cnLCAnPiBDb25uZWN0aW9uIGVuZCcpO1xuICAgICAgICBzZWxmLmVtaXQoJ2VuZGVkJywgJ0Nvbm5lY3Rpb24gZW5kJyk7XG4gICAgICAgIHJlamVjdCh7IG1lc3NhZ2U6ICdDb25uZWN0aW9uIGVuZCcgfSk7XG4gICAgICB9O1xuICAgICAgc2VsZi5jbGllbnQub24oJ2VuZCcsIHNlbGYuY2xpZW50RW5kRXZlbnQpO1xuXG4gICAgICBzZWxmLmNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6Y29ubmVjdDpjbG9zZScpO1xuICAgICAgICBzZWxmLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLmVtaXQoJ2xvZycsICc+IENvbm5lY3Rpb24gY2xvc2VkJyk7XG4gICAgICAgIHNlbGYuZW1pdCgnY2xvc2VkJywgJ0Nvbm5lY3Rpb24gY2xvc2VkJyk7XG4gICAgICAgIHJlamVjdCh7IG1lc3NhZ2U6ICdDb25uZWN0aW9uIGNsb3NlZCcgfSk7XG4gICAgICB9O1xuICAgICAgc2VsZi5jbGllbnQub24oJ2Nsb3NlJywgc2VsZi5jbGllbnRDbG9zZUV2ZW50KTtcbiAgICB9KTtcblxuICAgIGlmIChjb25uZWN0aW9uLnNlY3VyZSkge1xuICAgICAgY29ubmVjdGlvbi5zZWN1cmVPcHRpb25zID0geyAncmVqZWN0VW5hdXRob3JpemVkJzogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBjb25uZWN0aW9uLmRlYnVnID0gKG1zZykgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBtc2cuc3BsaXQoL1xcWyguKilcXF0gKD58PCkoLiopL2cpO1xuICAgICAgaWYgKGRhdGFbMV0gPT0gXCJjb25uZWN0aW9uXCIpIHtcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGRhdGFbMl07XG4gICAgICAgIGxldCBjbWQgPSBkYXRhWzNdLnJlcGxhY2UoL1xcJysvZywgXCJcIikucmVwbGFjZSgvXFxcXHJ8XFxcXG4vZywgXCIgXCIpO1xuXG4gICAgICAgIC8vIG1hc2sgcGFzc3dvcmRcbiAgICAgICAgaWYgKGRpcmVjdGlvbi50cmltKCkgPT0gXCI+XCIpIHtcbiAgICAgICAgICBsZXQgY21kcGFydHMgPSBjbWQuc3BsaXQoXCIgXCIpO1xuICAgICAgICAgIGlmIChjbWRwYXJ0c1sxXSA9PSBcIlBBU1NcIikge1xuICAgICAgICAgICAgY21kID0gY21kcGFydHNbMV0gKyBcIiBcIiArICcqJy5yZXBlYXQoY21kcGFydHNbMl0ubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmVtaXQoJ2xvZycsIGRpcmVjdGlvbiArICcgJyArIGNtZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5jbGllbnQuY29ubmVjdChjb25uZWN0aW9uKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYuY2xpZW50KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFzZWxmLmNsaWVudC5fc29ja2V0KSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFzZWxmLmNsaWVudC5fc29ja2V0LnJlYWRhYmxlKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gc2VsZi5jb25uZWN0ZWQ7XG4gIH1cblxuICBsaXN0KHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpsaXN0JywgcmVtb3RlUGF0aCk7XG5cbiAgICBjb25zdCBzaG93SGlkZGVuRmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnNob3dIaWRkZW5GaWxlcycpO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgY29uc3QgY2xpZW50Q2xvc2VFdmVudCA9IChoYWRFcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChFcnJvcignZnRwIGNsb3NlZCBjb25uZWN0aW9uJykpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGllbnRUaW1lb3V0RXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5jbGllbnQub25jZSgnY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQub25jZSgnZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQub25jZSgndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgICAgbGV0IHBhdGggPSAoc2hvd0hpZGRlbkZpbGVzID8gJy1hbCAnICsgcmVtb3RlUGF0aC50cmltKCkgOiByZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgICAgIHNlbGYuY2xpZW50Lmxpc3QocGF0aCwgKGVyciwgbGlzdCkgPT4ge1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGlzdCkge1xuICAgICAgICAgICAgcmVzb2x2ZShsaXN0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIG1rZGlyKHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpta2RpcicsIHJlbW90ZVBhdGgpO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgIGNvbnN0IGNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgcmVqZWN0KEVycm9yKCdmdHAgY2xvc2VkIGNvbm5lY3Rpb24nKSk7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50VGltZW91dEV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub25jZSgndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgIHNlbGYuY2xpZW50Lm1rZGlyKHJlbW90ZVBhdGgudHJpbSgpLCAoZXJyKSA9PiB7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlbW90ZVBhdGgudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHJtZGlyKHJlbW90ZVBhdGgsIHJlY3Vyc2l2ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOnJtZGlyJywgcmVtb3RlUGF0aCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lclxuICAgICAgY29uc3QgY2xpZW50Q2xvc2VFdmVudCA9IChoYWRFcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoRXJyb3IoJ2Z0cCBjbG9zZWQgY29ubmVjdGlvbicpKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRUaW1lb3V0RXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5jbGllbnQub25jZSgnY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgc2VsZi5jbGllbnQucm1kaXIocmVtb3RlUGF0aC50cmltKCksIHJlY3Vyc2l2ZSwgKGVycikgPT4ge1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBjaG1vZChyZW1vdGVQYXRoLCBwZXJtaXNzaW9ucykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmNobW9kJywgcmVtb3RlUGF0aCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lclxuICAgICAgY29uc3QgY2xpZW50Q2xvc2VFdmVudCA9IChoYWRFcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoRXJyb3IoJ2Z0cCBjbG9zZWQgY29ubmVjdGlvbicpKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRUaW1lb3V0RXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5jbGllbnQub25jZSgnY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgc2VsZi5jbGllbnQuc2l0ZSgnQ0hNT0QgJyArIHBlcm1pc3Npb25zICsgJyAnICsgcmVtb3RlUGF0aCwgKGVyciwgcmVzcG9uc2VUZXh0LCByZXNwb25zZUNvZGUpID0+IHtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcigndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHB1dChxdWV1ZUl0ZW0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpwdXQnLCByZW1vdGVQYXRoKTtcblxuICAgIGxldCByZW1vdGVQYXRoID0gcXVldWVJdGVtLmluZm8ucmVtb3RlUGF0aDtcbiAgICBsZXQgbG9jYWxQYXRoID0gcXVldWVJdGVtLmluZm8ubG9jYWxQYXRoO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc3RyID0gcHJvZ3Jlc3MoeyB0aW1lOiAxMDAgfSk7XG4gICAgICBsZXQgaW5wdXQgPSBGaWxlU3lzdGVtLmNyZWF0ZVJlYWRTdHJlYW0obG9jYWxQYXRoKTtcbiAgICAgIGlucHV0LnBhdXNlKCk7XG5cbiAgICAgIC8vIERlY2xhcmUgZXZlbnRzICBcbiAgICAgIGNvbnN0IHByb2dyZXNzRXZlbnQgPSAocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVByb2dyZXNzKHByb2dyZXNzLnRyYW5zZmVycmVkKTtcbiAgICAgICAgc2VsZi5lbWl0KCdkYXRhJywgcHJvZ3Jlc3MudHJhbnNmZXJyZWQpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGhhZEVycm9yKSB7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoRXJyb3IoJ2Z0cCBjbG9zZWQgY29ubmVjdGlvbicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50VGltZW91dEV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lclxuICAgICAgc3RyLm9uKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub25jZSgnY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgaW5wdXQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ1RyYW5zZmVycmluZycpO1xuICAgICAgfSk7XG4gICAgICAvLyBpbnB1dC5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAvLyAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgIC8vICAgcmVzb2x2ZShsb2NhbFBhdGgudHJpbSgpKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8gaW5wdXQub25jZSgnZmluaXNoJywgKCkgPT4ge1xuICAgICAgLy8gICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgICAvLyAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAvLyB9KTtcbiAgICAgIGlucHV0Lm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLmNsaWVudC5wdXQoaW5wdXQucGlwZShzdHIpLCByZW1vdGVQYXRoLCBmYWxzZSwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICByZXNvbHZlKHJlbW90ZVBhdGgudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdldChxdWV1ZUl0ZW0pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpnZXQnLCByZW1vdGVQYXRoLCBsb2NhbFBhdGgpO1xuXG4gICAgbGV0IHJlbW90ZVBhdGggPSBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoO1xuICAgIGxldCBsb2NhbFBhdGggPSBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGg7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBzdHIgPSBwcm9ncmVzcyh7IHRpbWU6IDEwMCB9KTtcblxuICAgICAgLy8gRGVjbGFyZSBldmVudHMgIFxuICAgICAgY29uc3QgcHJvZ3Jlc3NFdmVudCA9IChwcm9ncmVzcykgPT4ge1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocHJvZ3Jlc3MudHJhbnNmZXJyZWQpO1xuICAgICAgICBzZWxmLmVtaXQoJ2RhdGEnLCBwcm9ncmVzcy50cmFuc2ZlcnJlZCk7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50Q2xvc2VFdmVudCA9IChoYWRFcnJvcikgPT4ge1xuICAgICAgICBpZiAoaGFkRXJyb3IpIHtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgIHJlamVjdChFcnJvcignZnRwIGNsb3NlZCBjb25uZWN0aW9uJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRFcnJvckV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRUaW1lb3V0RXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICBzdHIub24oJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub25jZSgnZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICBzZWxmLmNsaWVudC5nZXQocmVtb3RlUGF0aCwgKGVyciwgc3RyZWFtKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJlYW0pIHtcbiAgICAgICAgICBsZXQgZmlsZSA9IEZpbGVTeXN0ZW0uY3JlYXRlV3JpdGVTdHJlYW0obG9jYWxQYXRoLCB7IGF1dG9DbG9zZTogdHJ1ZSB9KTtcblxuICAgICAgICAgIGZpbGUub25jZSgnb3BlbicsICgpID0+IHtcbiAgICAgICAgICAgIHF1ZXVlSXRlbS5hZGRTdHJlYW0oZmlsZSk7XG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdUcmFuc2ZlcnJpbmcnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmaWxlLm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzdHJlYW0ub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlUHJvZ3Jlc3MocXVldWVJdGVtLmluZm8uc2l6ZSk7XG4gICAgICAgICAgICByZXNvbHZlKGxvY2FsUGF0aC50cmltKCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHN0cmVhbS5vbmNlKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIHN0ci5yZW1vdmVMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0V2ZW50KTtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcigndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VQcm9ncmVzcyhxdWV1ZUl0ZW0uaW5mby5zaXplKTtcbiAgICAgICAgICAgIHJlc29sdmUobG9jYWxQYXRoLnRyaW0oKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RyZWFtLm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBzdHIucmVtb3ZlTGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3NFdmVudCk7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICAgICAgICBzdHJlYW0ucGlwZShzdHIpLnBpcGUoZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc3RyLnJlbW92ZUxpc3RlbmVyKCdwcm9ncmVzcycsIHByb2dyZXNzRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmlsZSBTdHJlYW0gY2xvc2VkJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZGVsZXRlKHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Z0cDpkZWxldGUnLCByZW1vdGVQYXRoKTtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICBjb25zdCBjbGllbnRDbG9zZUV2ZW50ID0gKGhhZEVycm9yKSA9PiB7XG4gICAgICAgIHJlamVjdChFcnJvcignZnRwIGNsb3NlZCBjb25uZWN0aW9uJykpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudEVycm9yRXZlbnQgPSAoZXJyKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudFRpbWVvdXRFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub25jZSgnZXJyb3InLCBjbGllbnRFcnJvckV2ZW50KTtcbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ3RpbWVvdXQnLCBjbGllbnRUaW1lb3V0RXZlbnQpO1xuXG4gICAgICBzZWxmLmNsaWVudC5kZWxldGUocmVtb3RlUGF0aCwgKGVycikgPT4ge1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCd0aW1lb3V0JywgY2xpZW50VGltZW91dEV2ZW50KTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICByZW5hbWUob2xkUmVtb3RlUGF0aCwgbmV3UmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOnJlbmFtZScsIG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgIGNvbnN0IGNsaWVudENsb3NlRXZlbnQgPSAoaGFkRXJyb3IpID0+IHtcbiAgICAgICAgcmVqZWN0KEVycm9yKCdmdHAgY2xvc2VkIGNvbm5lY3Rpb24nKSk7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50RXJyb3JFdmVudCA9IChlcnIpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9O1xuICAgICAgY29uc3QgY2xpZW50VGltZW91dEV2ZW50ID0gKGVycikgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuY2xpZW50Lm9uY2UoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbmNlKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgc2VsZi5jbGllbnQub25jZSgndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgIHNlbGYuY2xpZW50LnJlbmFtZShvbGRSZW1vdGVQYXRoLnRyaW0oKSwgbmV3UmVtb3RlUGF0aC50cmltKCksIChlcnIpID0+IHtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xpZW50Q2xvc2VFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGNsaWVudEVycm9yRXZlbnQpO1xuICAgICAgICBzZWxmLmNsaWVudC5yZW1vdmVMaXN0ZW5lcigndGltZW91dCcsIGNsaWVudFRpbWVvdXRFdmVudCk7XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUobmV3UmVtb3RlUGF0aC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmVuZCcpO1xuXG4gICAgc2VsZi5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghc2VsZi5jbGllbnQpIHJldHVybiByZXNvbHZlKHRydWUpO1xuXG4gICAgICAvLyBEZWNsYXJlIGV2ZW50cyAgXG4gICAgICBjb25zdCBjbGllbnRFbmRFdmVudCA9ICgpID0+IHtcbiAgICAgICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdmdHA6ZW5kJyk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGllbnRFbmRFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsaWVudENsb3NlRXZlbnQpO1xuXG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdyZWFkeScsIHNlbGYuY2xpZW50UmVhZHlFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHNlbGYuY2xpZW50RXJyb3JFdmVudCk7XG4gICAgICAgIHNlbGYuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBzZWxmLmNsaWVudEVuZEV2ZW50KTtcbiAgICAgICAgc2VsZi5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgc2VsZi5jbGllbnRDbG9zZUV2ZW50KTtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnRDbG9zZUV2ZW50ID0gKGhhZEVycm9yKSA9PiB7XG4gICAgICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmVuZCcpO1xuXG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgIHNlbGYuY2xpZW50Lm9uKCdlbmQnLCBjbGllbnRFbmRFdmVudCk7XG4gICAgICBzZWxmLmNsaWVudC5vbignY2xvc2UnLCBjbGllbnRDbG9zZUV2ZW50KTtcblxuICAgICAgc2VsZi5jbGllbnQuZW5kKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnZnRwOmFib3J0Jyk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghc2VsZi5jbGllbnQpIHJldHVybiByZXNvbHZlKHRydWUpO1xuXG4gICAgICBzZWxmLmNsaWVudC5hYm9ydCgoZXJyKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cbiJdfQ==