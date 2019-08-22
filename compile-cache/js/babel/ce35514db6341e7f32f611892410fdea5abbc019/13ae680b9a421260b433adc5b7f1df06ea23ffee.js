'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ftpClient = require('./ftp');
var sftpClient = require('./sftp');
var EventEmitter = require('events');
var PQueue = require('p-queue');

var Connector = (function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(connection) {
    _classCallCheck(this, Connector);

    _get(Object.getPrototypeOf(Connector.prototype), 'constructor', this).call(this);
    var self = this;

    self.connection = connection;
    self.client = null;
    self.queue = new PQueue({ concurrency: 1 });

    if (self.connection.sftp === true || self.connection.useAgent === true) {
      self.client = new sftpClient();
    } else {
      self.client = new ftpClient();
    }

    // Events
    self.client.on('debug', function (msg) {
      self.emit('debug', msg);
    });
    self.client.on('log', function (msg) {
      self.emit('log', msg);
    });
  }

  // Tear down any state and detach

  _createClass(Connector, [{
    key: 'destroy',
    value: function destroy() {
      var self = this;

      return self.abortAll().then(function () {
        return self.client.end();
      })['catch'](function (error) {
        return self.client.end();
      });
    }
  }, {
    key: 'connect',
    value: function connect() {
      var self = this;
      self.emit('debug', 'connector:connect');

      // Keep connection alive
      if (self.client.isConnected()) {
        return new Promise(function (resolve, reject) {
          resolve(self.client);
        });
      }

      try {
        // Start new connection
        return self.client.connect(self.connection);
      } catch (error) {
        console.log(error);
        return self.disconnect(null, error);
      }
    }
  }, {
    key: 'disconnect',
    value: function disconnect(result, error) {
      var self = this;
      self.emit('debug', 'connector:disconnect');

      // Keep connection alive
      return new Promise(function (resolve, reject) {
        if (result) resolve(result);
        if (error) reject(error);
      });

      // return self.client.end()
      //   .then(() => {
      //     return new Promise((resolve, reject) => {
      //       if (result) resolve(result);
      //       if (error) reject(error);
      //     });
      //   })
      //   .catch(() => {
      //     return new Promise((resolve, reject) => {
      //       if (result) resolve(result);
      //       if (error) reject(error);
      //     });
      //   });
    }
  }, {
    key: 'abort',
    value: function abort() {
      var self = this;
      self.emit('debug', 'connector:abort');

      if (!self.client.isConnected()) return self.disconnect(true);

      return self.connect().then(function (Client) {
        return Client.abort(function () {
          return self.disconnect(true);
        });
      })['catch'](function (error) {
        return self.disconnect(null, error);
      });
    }
  }, {
    key: 'abortAll',
    value: function abortAll() {
      var self = this;
      self.emit('debug', 'connector:abortAll');

      self.queue.clear();

      if (!self.client.isConnected()) return self.disconnect(true);

      return self.connect().then(function (Client) {
        return Client.abort(function () {
          return self.disconnect(true);
        });
      })['catch'](function (error) {
        return self.disconnect(null, error);
      });
    }
  }, {
    key: 'listDirectory',
    value: function listDirectory(remotePath) {
      var self = this;
      self.emit('debug', 'connector:listDirectory', remotePath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.list(remotePath.trim()).then(function (result) {
            return self.disconnect(result);
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 10 });
    }
  }, {
    key: 'createDirectory',
    value: function createDirectory(remotePath) {
      var self = this;
      self.emit('debug', 'connector:createDirectory', remotePath);

      return self.queue.add(function () {
        return self._createDirectory(remotePath);
      }, { priority: 9 });
    }
  }, {
    key: '_createDirectory',
    value: function _createDirectory(remotePath) {
      var self = this;

      // Check directory already exists
      return self._existsDirectory(remotePath.trim()).then(function () {
        // Directory already exists
        // Nothing to do
        return Promise.resolve(remotePath.trim());
      })['catch'](function () {
        // Directory not exists and must be created
        return self.connect().then(function (Client) {

          var paths = [];
          remotePath.split('/').reduce(function (path, dir) {
            path += '/' + dir.trim();
            paths.push(path);
            return path;
          });

          // Walk recursive through directory tree and create non existing directories
          return self._createDirectoryStructure(Client, paths).then(function () {
            return self.disconnect(remotePath.trim());
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      });
    }
  }, {
    key: '_createDirectoryStructure',
    value: function _createDirectoryStructure(Client, remotePaths) {
      var self = this;
      self.emit('debug', 'connector:createDirectoryStructure', remotePaths);

      var path = remotePaths.shift();
      var directory = path.split('/');
      directory.pop();
      directory = directory.join('/');
      if (!directory) directory = '/';

      // Walk recursive through directory tree and create non existing directories
      return Client.list(directory).then(function (list) {
        var dir = list.find(function (item) {
          return item.name == path.split('/').slice(-1)[0];
        });

        if (dir) {
          if (remotePaths.length > 0) {
            return self._createDirectoryStructure(Client, remotePaths).then(function () {
              return Promise.resolve(path.trim());
            })['catch'](function (error) {
              return Promise.reject(error);
            });
          } else {
            return Promise.resolve(path.trim());
          }
        } else {
          return Client.mkdir(path.trim()).then(function () {
            if (remotePaths.length > 0) {
              return self._createDirectoryStructure(Client, remotePaths).then(function () {
                return Promise.resolve(path.trim());
              })['catch'](function (error) {
                return Promise.reject(error);
              });
            } else {
              return Promise.resolve(path.trim());
            }
          })['catch'](function (error) {
            return Promise.reject(error);
          });
        }
      })['catch'](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: 'deleteDirectory',
    value: function deleteDirectory(remotePath, recursive) {
      var self = this;
      self.emit('debug', 'connector:deleteDirectory', remotePath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.rmdir(remotePath.trim(), true).then(function (result) {
            return self.disconnect(result);
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 6 });
    }
  }, {
    key: 'existsDirectory',
    value: function existsDirectory(remotePath) {
      var self = this;
      self.emit('debug', 'connector:existsDirectory', remotePath);

      return self.queue.add(function () {
        return self._existsDirectory(remotePath);
      }, { priority: 10 });
    }
  }, {
    key: '_existsDirectory',
    value: function _existsDirectory(remotePath) {
      var self = this;

      if (!remotePath || remotePath == '/') {
        return Promise.resolve(remotePath);
      }

      return self.connect().then(function (Client) {
        var directory = remotePath.split('/');
        directory.pop();
        directory = directory.join('/');

        return Client.list(directory).then(function (list) {
          var dir = list.find(function (item) {
            return item.name == remotePath.split('/').slice(-1)[0];
          });
          if (dir) {
            return self.disconnect(remotePath);
          }
          return self.disconnect(null, { message: 'Directory not exists.' });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      })['catch'](function (error) {
        return self.disconnect(null, error);
      });
    }
  }, {
    key: 'chmodDirectory',
    value: function chmodDirectory(remotePath, permissions) {
      var self = this;
      self.emit('debug', 'connector:chmodDirectory', remotePath + ' ' + permissions);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.chmod(remotePath, permissions).then(function (responseText) {
            return self.disconnect(responseText);
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 5 });
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(queueItem) {
      var priority = arguments.length <= 1 || arguments[1] === undefined ? 8 : arguments[1];

      var self = this;
      self.emit('debug', 'connector:uploadFile', queueItem.info.remotePath, queueItem.info.localPath);

      var arrPath = queueItem.info.remotePath.split('/');
      arrPath.pop();

      return self.queue.add(function () {
        return self._createDirectory(arrPath.join('/')).then(function () {
          return self.connect().then(function (Client) {
            return Client.put(queueItem).then(function (remotePath) {
              queueItem.changeStatus('Finished');
              return self.disconnect(remotePath);
            })['catch'](function (error) {
              queueItem.changeStatus('Error');
              return self.disconnect(null, error);
            });
          })['catch'](function (error) {
            queueItem.changeStatus('Error');
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          queueItem.changeStatus('Error');
          return self.disconnect(null, error);
        });
      }, { priority: priority });
    }
  }, {
    key: 'downloadFile',
    value: function downloadFile(queueItem) {
      var priority = arguments.length <= 1 || arguments[1] === undefined ? 7 : arguments[1];

      var self = this;
      self.emit('debug', 'connector:downloadFile', queueItem.info.remotePath, queueItem.info.localPath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.get(queueItem).then(function (localPath) {
            queueItem.changeStatus('Finished');
            return self.disconnect(localPath);
          })['catch'](function (error) {
            queueItem.changeStatus('Error');
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          queueItem.changeStatus('Error');
          return self.disconnect(null, error);
        });
      }, { priority: priority });
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(remotePath) {
      var self = this;
      self.emit('debug', 'connector:deleteFile', remotePath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client['delete'](remotePath.trim()).then(function () {
            return self.disconnect(remotePath.trim());
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 6 });
    }
  }, {
    key: 'existsFile',
    value: function existsFile(remotePath) {
      var self = this;
      self.emit('debug', 'connector:existsFile', remotePath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          var directory = remotePath.split('/');
          directory.pop();
          directory = directory.join('/');

          return Client.list(directory).then(function (list) {
            var file = list.find(function (item) {
              return item.name == remotePath.split('/').slice(-1)[0];
            });
            if (file) {
              return self.disconnect(remotePath);
            }
            return self.disconnect(null, { message: 'File not exists.' });
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 10 });
    }
  }, {
    key: 'chmodFile',
    value: function chmodFile(remotePath, permissions) {
      var self = this;
      self.emit('debug', 'connector:chmodFile', remotePath + ' ' + permissions);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.chmod(remotePath, permissions).then(function (responseText) {
            return self.disconnect(responseText);
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 5 });
    }
  }, {
    key: 'rename',
    value: function rename(oldRemotePath, newRemotePath) {
      var self = this;
      self.emit('debug', 'connector:rename', oldRemotePath, newRemotePath);

      return self.queue.add(function () {
        return self.connect().then(function (Client) {
          return Client.rename(oldRemotePath.trim(), newRemotePath.trim()).then(function () {
            return self.disconnect(newRemotePath.trim());
          })['catch'](function (error) {
            return self.disconnect(null, error);
          });
        })['catch'](function (error) {
          return self.disconnect(null, error);
        });
      }, { priority: 6 });
    }
  }]);

  return Connector;
})(EventEmitter);

exports['default'] = Connector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL2Nvbm5lY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBRVosSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztJQUViLFNBQVM7WUFBVCxTQUFTOztBQUVqQixXQUZRLFNBQVMsQ0FFaEIsVUFBVSxFQUFFOzBCQUZMLFNBQVM7O0FBRzFCLCtCQUhpQixTQUFTLDZDQUdsQjtBQUNSLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUU1QyxRQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDdEUsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0tBQ2hDLE1BQU07QUFDTCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7S0FDL0I7OztBQUdELFFBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBSztBQUMvQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8s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QUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUNyQyxpQkFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMxRSxtQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzlDLENBQUMsU0FBTSxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7V0FBRSxDQUFDLENBQUM7U0FDL0QsQ0FBQyxTQUFNLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxpQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUFFLENBQUMsQ0FBQztPQUMvRCxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDckI7OztTQTdYa0IsU0FBUztHQUFTLFlBQVk7O3FCQUE5QixTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9jb25uZWN0b3JzL2Nvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBmdHBDbGllbnQgPSByZXF1aXJlKCcuL2Z0cCcpO1xuY29uc3Qgc2Z0cENsaWVudCA9IHJlcXVpcmUoJy4vc2Z0cCcpO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBQUXVldWUgPSByZXF1aXJlKCdwLXF1ZXVlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3RvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IoY29ubmVjdGlvbikge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIHNlbGYuY2xpZW50ID0gbnVsbDtcbiAgICBzZWxmLnF1ZXVlID0gbmV3IFBRdWV1ZSh7IGNvbmN1cnJlbmN5OiAxIH0pO1xuXG4gICAgaWYgKHNlbGYuY29ubmVjdGlvbi5zZnRwID09PSB0cnVlIHx8IHNlbGYuY29ubmVjdGlvbi51c2VBZ2VudCA9PT0gdHJ1ZSkge1xuICAgICAgc2VsZi5jbGllbnQgPSBuZXcgc2Z0cENsaWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmNsaWVudCA9IG5ldyBmdHBDbGllbnQoKTtcbiAgICB9XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLmNsaWVudC5vbignZGVidWcnLCAobXNnKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2RlYnVnJywgbXNnKTtcbiAgICB9KTtcbiAgICBzZWxmLmNsaWVudC5vbignbG9nJywgKG1zZykgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdsb2cnLCBtc2cpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZi5hYm9ydEFsbCgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmVuZCgpO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmVuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY29ubmVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3Rvcjpjb25uZWN0Jyk7XG5cbiAgICAvLyBLZWVwIGNvbm5lY3Rpb24gYWxpdmVcbiAgICBpZiAoc2VsZi5jbGllbnQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVzb2x2ZShzZWxmLmNsaWVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gU3RhcnQgbmV3IGNvbm5lY3Rpb25cbiAgICAgIHJldHVybiBzZWxmLmNsaWVudC5jb25uZWN0KHNlbGYuY29ubmVjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChyZXN1bHQsIGVycm9yKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdjb25uZWN0b3I6ZGlzY29ubmVjdCcpO1xuXG4gICAgLy8gS2VlcCBjb25uZWN0aW9uIGFsaXZlXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIGlmIChlcnJvcikgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcblxuICAgIC8vIHJldHVybiBzZWxmLmNsaWVudC5lbmQoKVxuICAgIC8vICAgLnRoZW4oKCkgPT4ge1xuICAgIC8vICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICAgICAgIGlmIChyZXN1bHQpIHJlc29sdmUocmVzdWx0KTtcbiAgICAvLyAgICAgICBpZiAoZXJyb3IpIHJlamVjdChlcnJvcik7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSlcbiAgICAvLyAgIC5jYXRjaCgoKSA9PiB7XG4gICAgLy8gICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gICAgICAgaWYgKHJlc3VsdCkgcmVzb2x2ZShyZXN1bHQpO1xuICAgIC8vICAgICAgIGlmIChlcnJvcikgcmVqZWN0KGVycm9yKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOmFib3J0Jyk7XG5cbiAgICBpZiAoIXNlbGYuY2xpZW50LmlzQ29ubmVjdGVkKCkpIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QodHJ1ZSk7XG5cbiAgICByZXR1cm4gc2VsZi5jb25uZWN0KCkudGhlbigoQ2xpZW50KSA9PiB7XG4gICAgICByZXR1cm4gQ2xpZW50LmFib3J0KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdCh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgfSk7XG4gIH1cblxuICBhYm9ydEFsbCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3RvcjphYm9ydEFsbCcpO1xuXG4gICAgc2VsZi5xdWV1ZS5jbGVhcigpO1xuXG4gICAgaWYgKCFzZWxmLmNsaWVudC5pc0Nvbm5lY3RlZCgpKSByZXR1cm4gc2VsZi5kaXNjb25uZWN0KHRydWUpO1xuXG4gICAgcmV0dXJuIHNlbGYuY29ubmVjdCgpLnRoZW4oKENsaWVudCkgPT4ge1xuICAgICAgcmV0dXJuIENsaWVudC5hYm9ydCgoKSA9PiB7XG4gICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgbGlzdERpcmVjdG9yeShyZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdjb25uZWN0b3I6bGlzdERpcmVjdG9yeScsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYucXVldWUuYWRkKCgpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmNvbm5lY3QoKS50aGVuKChDbGllbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIENsaWVudC5saXN0KHJlbW90ZVBhdGgudHJpbSgpKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5kaXNjb25uZWN0KHJlc3VsdCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTsgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9LCB7IHByaW9yaXR5OiAxMCB9KTtcbiAgfVxuXG4gIGNyZWF0ZURpcmVjdG9yeShyZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdjb25uZWN0b3I6Y3JlYXRlRGlyZWN0b3J5JywgcmVtb3RlUGF0aCk7XG5cbiAgICByZXR1cm4gc2VsZi5xdWV1ZS5hZGQoKCkgPT4ge1xuICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZURpcmVjdG9yeShyZW1vdGVQYXRoKTtcbiAgICB9LCB7IHByaW9yaXR5OiA5IH0pO1xuICB9XG5cbiAgX2NyZWF0ZURpcmVjdG9yeShyZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBDaGVjayBkaXJlY3RvcnkgYWxyZWFkeSBleGlzdHNcbiAgICByZXR1cm4gc2VsZi5fZXhpc3RzRGlyZWN0b3J5KHJlbW90ZVBhdGgudHJpbSgpKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIERpcmVjdG9yeSBhbHJlYWR5IGV4aXN0c1xuICAgICAgLy8gTm90aGluZyB0byBkb1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8gRGlyZWN0b3J5IG5vdCBleGlzdHMgYW5kIG11c3QgYmUgY3JlYXRlZFxuICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdCgpLnRoZW4oKENsaWVudCkgPT4ge1xuXG4gICAgICAgIGxldCBwYXRocyA9IFtdO1xuICAgICAgICByZW1vdGVQYXRoLnNwbGl0KCcvJykucmVkdWNlKChwYXRoLCBkaXIpID0+IHtcbiAgICAgICAgICBwYXRoICs9ICcvJyArIGRpci50cmltKCk7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2FsayByZWN1cnNpdmUgdGhyb3VnaCBkaXJlY3RvcnkgdHJlZSBhbmQgY3JlYXRlIG5vbiBleGlzdGluZyBkaXJlY3Rvcmllc1xuICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlRGlyZWN0b3J5U3RydWN0dXJlKENsaWVudCwgcGF0aHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QocmVtb3RlUGF0aC50cmltKCkpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIF9jcmVhdGVEaXJlY3RvcnlTdHJ1Y3R1cmUoQ2xpZW50LCByZW1vdGVQYXRocykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOmNyZWF0ZURpcmVjdG9yeVN0cnVjdHVyZScsIHJlbW90ZVBhdGhzKTtcblxuICAgIGxldCBwYXRoID0gcmVtb3RlUGF0aHMuc2hpZnQoKTtcbiAgICBsZXQgZGlyZWN0b3J5ID0gcGF0aC5zcGxpdCgnLycpO1xuICAgIGRpcmVjdG9yeS5wb3AoKTtcbiAgICBkaXJlY3RvcnkgPSBkaXJlY3Rvcnkuam9pbignLycpO1xuICAgIGlmICghZGlyZWN0b3J5KSBkaXJlY3RvcnkgPSAnLyc7XG5cbiAgICAvLyBXYWxrIHJlY3Vyc2l2ZSB0aHJvdWdoIGRpcmVjdG9yeSB0cmVlIGFuZCBjcmVhdGUgbm9uIGV4aXN0aW5nIGRpcmVjdG9yaWVzXG4gICAgcmV0dXJuIENsaWVudC5saXN0KGRpcmVjdG9yeSkudGhlbigobGlzdCkgPT4ge1xuICAgICAgbGV0IGRpciA9IGxpc3QuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbS5uYW1lID09IHBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSlbMF07XG4gICAgICB9KTtcblxuICAgICAgaWYgKGRpcikge1xuICAgICAgICBpZiAocmVtb3RlUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVEaXJlY3RvcnlTdHJ1Y3R1cmUoQ2xpZW50LCByZW1vdGVQYXRocykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhdGgudHJpbSgpKTtcbiAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXRoLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBDbGllbnQubWtkaXIocGF0aC50cmltKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGlmIChyZW1vdGVQYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlRGlyZWN0b3J5U3RydWN0dXJlKENsaWVudCwgcmVtb3RlUGF0aHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhdGgudHJpbSgpKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocGF0aC50cmltKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVsZXRlRGlyZWN0b3J5KHJlbW90ZVBhdGgsIHJlY3Vyc2l2ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOmRlbGV0ZURpcmVjdG9yeScsIHJlbW90ZVBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYucXVldWUuYWRkKCgpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmNvbm5lY3QoKS50aGVuKChDbGllbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIENsaWVudC5ybWRpcihyZW1vdGVQYXRoLnRyaW0oKSwgdHJ1ZSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChyZXN1bHQpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7IH0pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgICB9LCB7IHByaW9yaXR5OiA2IH0pO1xuICB9XG5cbiAgZXhpc3RzRGlyZWN0b3J5KHJlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3RvcjpleGlzdHNEaXJlY3RvcnknLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLnF1ZXVlLmFkZCgoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5fZXhpc3RzRGlyZWN0b3J5KHJlbW90ZVBhdGgpO1xuICAgIH0sIHsgcHJpb3JpdHk6IDEwIH0pO1xuICB9XG5cbiAgX2V4aXN0c0RpcmVjdG9yeShyZW1vdGVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXJlbW90ZVBhdGggfHwgcmVtb3RlUGF0aCA9PSAnLycpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVtb3RlUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuY29ubmVjdCgpLnRoZW4oKENsaWVudCkgPT4ge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHJlbW90ZVBhdGguc3BsaXQoJy8nKTtcbiAgICAgIGRpcmVjdG9yeS5wb3AoKTtcbiAgICAgIGRpcmVjdG9yeSA9IGRpcmVjdG9yeS5qb2luKCcvJyk7XG5cbiAgICAgIHJldHVybiBDbGllbnQubGlzdChkaXJlY3RvcnkpLnRoZW4oKGxpc3QpID0+IHtcbiAgICAgICAgbGV0IGRpciA9IGxpc3QuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiBpdGVtLm5hbWUgPT0gcmVtb3RlUGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKVswXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5kaXNjb25uZWN0KHJlbW90ZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgeyBtZXNzYWdlOiAnRGlyZWN0b3J5IG5vdCBleGlzdHMuJyB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTsgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgfVxuXG4gIGNobW9kRGlyZWN0b3J5KHJlbW90ZVBhdGgsIHBlcm1pc3Npb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5lbWl0KCdkZWJ1ZycsICdjb25uZWN0b3I6Y2htb2REaXJlY3RvcnknLCByZW1vdGVQYXRoICsgJyAnICsgcGVybWlzc2lvbnMpO1xuXG4gICAgcmV0dXJuIHNlbGYucXVldWUuYWRkKCgpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmNvbm5lY3QoKS50aGVuKChDbGllbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIENsaWVudC5jaG1vZChyZW1vdGVQYXRoLCBwZXJtaXNzaW9ucykudGhlbigocmVzcG9uc2VUZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChyZXNwb25zZVRleHQpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7IH0pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgICB9LCB7IHByaW9yaXR5OiA1IH0pO1xuICB9XG5cbiAgdXBsb2FkRmlsZShxdWV1ZUl0ZW0sIHByaW9yaXR5ID0gOCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOnVwbG9hZEZpbGUnLCBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoLCBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGgpO1xuXG4gICAgbGV0IGFyclBhdGggPSBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoLnNwbGl0KCcvJyk7XG4gICAgYXJyUGF0aC5wb3AoKTtcblxuICAgIHJldHVybiBzZWxmLnF1ZXVlLmFkZCgoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5fY3JlYXRlRGlyZWN0b3J5KGFyclBhdGguam9pbignLycpKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdCgpLnRoZW4oKENsaWVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiBDbGllbnQucHV0KHF1ZXVlSXRlbSkudGhlbigocmVtb3RlUGF0aCkgPT4ge1xuICAgICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRmluaXNoZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QocmVtb3RlUGF0aCk7XG4gICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG4gICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSwgeyBwcmlvcml0eTogcHJpb3JpdHkgfSk7XG4gIH1cblxuICBkb3dubG9hZEZpbGUocXVldWVJdGVtLCBwcmlvcml0eSA9IDcpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3Rvcjpkb3dubG9hZEZpbGUnLCBxdWV1ZUl0ZW0uaW5mby5yZW1vdGVQYXRoLCBxdWV1ZUl0ZW0uaW5mby5sb2NhbFBhdGgpO1xuXG4gICAgcmV0dXJuIHNlbGYucXVldWUuYWRkKCgpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmNvbm5lY3QoKS50aGVuKChDbGllbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIENsaWVudC5nZXQocXVldWVJdGVtKS50aGVuKChsb2NhbFBhdGgpID0+IHtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdGaW5pc2hlZCcpO1xuICAgICAgICAgIHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobG9jYWxQYXRoKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcbiAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9LCB7IHByaW9yaXR5OiBwcmlvcml0eSB9KTtcbiAgfVxuXG4gIGRlbGV0ZUZpbGUocmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOmRlbGV0ZUZpbGUnLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLnF1ZXVlLmFkZCgoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5jb25uZWN0KCkudGhlbigoQ2xpZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBDbGllbnQuZGVsZXRlKHJlbW90ZVBhdGgudHJpbSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5kaXNjb25uZWN0KHJlbW90ZVBhdGgudHJpbSgpKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTsgfSk7XG4gICAgfSwgeyBwcmlvcml0eTogNiB9KTtcbiAgfVxuXG4gIGV4aXN0c0ZpbGUocmVtb3RlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuZW1pdCgnZGVidWcnLCAnY29ubmVjdG9yOmV4aXN0c0ZpbGUnLCByZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLnF1ZXVlLmFkZCgoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5jb25uZWN0KCkudGhlbigoQ2xpZW50KSA9PiB7XG4gICAgICAgIGxldCBkaXJlY3RvcnkgPSByZW1vdGVQYXRoLnNwbGl0KCcvJyk7XG4gICAgICAgIGRpcmVjdG9yeS5wb3AoKTtcbiAgICAgICAgZGlyZWN0b3J5ID0gZGlyZWN0b3J5LmpvaW4oJy8nKTtcblxuICAgICAgICByZXR1cm4gQ2xpZW50Lmxpc3QoZGlyZWN0b3J5KS50aGVuKChsaXN0KSA9PiB7XG4gICAgICAgICAgbGV0IGZpbGUgPSBsaXN0LmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm5hbWUgPT0gcmVtb3RlUGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKVswXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChyZW1vdGVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCB7IG1lc3NhZ2U6ICdGaWxlIG5vdCBleGlzdHMuJyB9KTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTsgfSk7XG4gICAgfSwgeyBwcmlvcml0eTogMTAgfSk7XG4gIH1cblxuICBjaG1vZEZpbGUocmVtb3RlUGF0aCwgcGVybWlzc2lvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3RvcjpjaG1vZEZpbGUnLCByZW1vdGVQYXRoICsgJyAnICsgcGVybWlzc2lvbnMpO1xuXG4gICAgcmV0dXJuIHNlbGYucXVldWUuYWRkKCgpID0+IHtcbiAgICAgIHJldHVybiBzZWxmLmNvbm5lY3QoKS50aGVuKChDbGllbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIENsaWVudC5jaG1vZChyZW1vdGVQYXRoLCBwZXJtaXNzaW9ucykudGhlbigocmVzcG9uc2VUZXh0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChyZXNwb25zZVRleHQpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7IH0pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHJldHVybiBzZWxmLmRpc2Nvbm5lY3QobnVsbCwgZXJyb3IpOyB9KTtcbiAgICB9LCB7IHByaW9yaXR5OiA1IH0pO1xuICB9XG5cbiAgcmVuYW1lKG9sZFJlbW90ZVBhdGgsIG5ld1JlbW90ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmVtaXQoJ2RlYnVnJywgJ2Nvbm5lY3RvcjpyZW5hbWUnLCBvbGRSZW1vdGVQYXRoLCBuZXdSZW1vdGVQYXRoKTtcblxuICAgIHJldHVybiBzZWxmLnF1ZXVlLmFkZCgoKSA9PiB7XG4gICAgICByZXR1cm4gc2VsZi5jb25uZWN0KCkudGhlbigoQ2xpZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBDbGllbnQucmVuYW1lKG9sZFJlbW90ZVBhdGgudHJpbSgpLCBuZXdSZW1vdGVQYXRoLnRyaW0oKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChuZXdSZW1vdGVQYXRoLnRyaW0oKSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyByZXR1cm4gc2VsZi5kaXNjb25uZWN0KG51bGwsIGVycm9yKTsgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgcmV0dXJuIHNlbGYuZGlzY29ubmVjdChudWxsLCBlcnJvcik7IH0pO1xuICAgIH0sIHsgcHJpb3JpdHk6IDYgfSk7XG4gIH1cbn1cbiJdfQ==