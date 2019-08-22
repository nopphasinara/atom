var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _helper = require('./helper');

'use babel';

/**
 * ssh2 sftp client for node
 * https://github.com/jyu213/ssh2-sftp-client
 */

'use strict';

var Client = require('ssh2').Client;
var osPath = require('path').posix;

var SftpClient = function SftpClient() {
  this.client = new Client();
};

/**
 * Retrieves a directory listing
 *
 * @param {String} path, a string containing the path to a directory
 * @return {Promise} data, list info
 */
SftpClient.prototype.list = function (path) {
  var _this = this;

  var reg = /-/gi;

  return new Promise(function (resolve, reject) {
    var sftp = _this.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }
    sftp.readdir(path, function (err, list) {
      if (err) {
        reject(new Error('Failed to list ' + path + ': ' + err.message));
      } else {
        var newList = [];
        // reset file info
        if (list) {
          newList = list.map(function (item) {
            return {
              type: item.longname.substr(0, 1),
              name: item.filename,
              size: item.attrs.size,
              modifyTime: item.attrs.mtime * 1000,
              accessTime: item.attrs.atime * 1000,
              rights: {
                user: item.longname.substr(1, 3).replace(reg, ''),
                group: item.longname.substr(4, 3).replace(reg, ''),
                other: item.longname.substr(7, 3).replace(reg, '')
              },
              owner: item.attrs.uid,
              group: item.attrs.gid
            };
          });
        }
        resolve(newList);
      }
    });
    return undefined;
  });
};

/**
 * @async
 
 * Tests to see if an object exists. If it does, return the type of that object
 * (in the format returned by list). If it does not exist, return false.
 *
 * @param {string} path - path to the object on the sftp server.
 *
 * @return {boolean} returns false if object does not exist. Returns type of
 *                   object if it does
 */
SftpClient.prototype.exists = function (path) {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var sftp = _this2.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }

    var _osPath$parse = osPath.parse(path);

    var dir = _osPath$parse.dir;
    var base = _osPath$parse.base;

    sftp.readdir(dir, function (err, list) {
      if (err) {
        if (err.code === 2) {
          resolve(false);
        } else {
          reject(new Error('Error listing ' + dir + ': code: ' + err.code + ' ' + err.message));
        }
      } else {
        var _list$filter$map = list.filter(function (item) {
          return item.filename === base;
        }).map(function (item) {
          return item.longname.substr(0, 1);
        });

        var _list$filter$map2 = _slicedToArray(_list$filter$map, 1);

        var type = _list$filter$map2[0];

        if (type) {
          resolve(type);
        } else {
          resolve(false);
        }
      }
    });
    return undefined;
  });
};

/**
 * Retrieves attributes for path
 *
 * @param {String} path, a string containing the path to a file
 * @return {Promise} stats, attributes info
 */
SftpClient.prototype.stat = function (remotePath) {
  var _this3 = this;

  return new Promise(function (resolve, reject) {
    var sftp = _this3.sftp;

    if (!sftp) {
      return reject(Error('sftp connect error'));
    }
    sftp.stat(remotePath, function (err, stats) {
      if (err) {
        reject(new Error('Failed to stat ' + remotePath + ': ' + err.message));
      } else {
        // format similarly to sftp.list
        resolve({
          mode: stats.mode,
          permissions: stats.permissions,
          owner: stats.uid,
          group: stats.guid,
          size: stats.size,
          accessTime: stats.atime * 1000,
          modifyTime: stats.mtime * 1000
        });
      }
    });
    return undefined;
  });
};

/**
 * get file
 *
 * @param {String} path, path
 * @param {Object} useCompression, config options
 * @param {String} encoding. Encoding for the ReadStream, can be any value
 * supported by node streams. Use 'null' for binary
 * (https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding)
 * @return {Promise} stream, readable stream
 */
SftpClient.prototype.get = function (path, useCompression, encoding, otherOptions) {
  var _this4 = this;

  var options = this.getOptions(useCompression, encoding, otherOptions);

  return new Promise(function (resolve, reject) {
    var sftp = _this4.sftp;

    if (sftp) {
      try {
        var _ret = (function () {
          _this4.client.on('error', reject);

          var stream = sftp.createReadStream(path, options);

          stream.on('error', function (err) {
            _this4.client.removeListener('error', reject);
            return reject(new Error('Failed get for ' + path + ': ' + err.message));
          });
          stream.on('readable', function () {
            _this4.client.removeListener('error', reject);
            // Ater node V10.0.0, 'readable' takes precedence in controlling the flow,
            // i.e. 'data' will be emitted only when stream.read() is called.
            while (stream.read() !== null) {}
          });

          // Return always the stream, not only when readable event is triggerd.
          return {
            v: resolve(stream)
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } catch (err) {
        _this4.client.removeListener('error', reject);
        return reject(new Error('Failed get on ' + path + ': ' + err.message));
      }
    } else {
      return reject(new Error('sftp connect error'));
    }
  });
};

/**
 * Use SSH2 fastGet for downloading the file.
 * Downloads a file at remotePath to localPath using parallel reads for faster throughput.
 * See 'fastGet' at https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
 * @param {String} remotePath
 * @param {String} localPath
 * @param {Object} options
 * @return {Promise} the result of downloading the file
 */
SftpClient.prototype.fastGet = function (remotePath, localPath, options) {
  var _this5 = this;

  options = options || { concurrency: 64, chunkSize: 32768 };
  return new Promise(function (resolve, reject) {
    var sftp = _this5.sftp;

    if (!sftp) {
      return reject(Error('sftp connect error'));
    }
    sftp.fastGet(remotePath, localPath, options, function (err) {
      if (err) {
        reject(new Error('Failed to get ' + remotePath + ': ' + err.message));
      }
      resolve(remotePath + ' was successfully download to ' + localPath + '!');
    });
    return undefined;
  });
};

/**
 * Use SSH2 fastPut for uploading the file.
 * Uploads a file from localPath to remotePath using parallel reads for faster throughput.
 * See 'fastPut' at https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
 * @param {String} localPath
 * @param {String} remotePath
 * @param {Object} options
 * @return {Promise} the result of downloading the file
 */
SftpClient.prototype.fastPut = function (localPath, remotePath, options) {
  var _this6 = this;

  options = options || {};
  return new Promise(function (resolve, reject) {
    var sftp = _this6.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }
    sftp.fastPut(localPath, remotePath, options, function (err) {
      if (err) {
        reject(new Error('Failed to upload ' + localPath + ' to ' + remotePath + ': ' + err.message));
      }
      resolve(localPath + ' was successfully uploaded to ' + remotePath + '!');
    });
    return undefined;
  });
};

/**
 * Create file
 *
 * @param  {String|Buffer|stream} input
 * @param  {String} remotePath,
 * @param  {Object} useCompression [description]
 * @param  {String} encoding. Encoding for the WriteStream, can be any value supported by node streams.
 * @return {[type]}                [description]
 */
SftpClient.prototype.put = function (input, remotePath, useCompression, encoding, otherOptions) {
  var _this7 = this;

  var options = this.getOptions(useCompression, encoding, otherOptions);

  return new Promise(function (resolve, reject) {
    var sftp = _this7.sftp;

    if (sftp) {
      if (typeof input === 'string') {
        sftp.fastPut(input, remotePath, options, function (err) {
          if (err) {
            return reject(new Error('Failed to upload ' + input + ' to ' + remotePath + ': ' + err.message));
          }
          return resolve('Uploaded ' + input + ' to ' + remotePath);
        });
        return false;
      }
      var stream = sftp.createWriteStream(remotePath, options);

      stream.on('error', function (err) {
        return reject(new Error('Failed to upload data stream to ' + remotePath + ': ' + err.message));
      });

      stream.on('close', function () {
        return resolve('Uploaded data stream to ' + remotePath);
      });

      if (input instanceof Buffer) {
        stream.end(input);
        return false;
      }
      input.pipe(stream);
    } else {
      return reject(Error('sftp connect error'));
    }
  });
};
/**
 * Append to file
 *
 * @param  {Buffer|stream} input
 * @param  {String} remotePath,
 * @param  {Object} useCompression [description]
 * @param  {String} encoding. Encoding for the WriteStream, can be any value supported by node streams.
 * @return {[type]}                [description]
 */
SftpClient.prototype.append = function (input, remotePath, useCompression, encoding, otherOptions) {
  var _this8 = this;

  var options = this.getOptions(useCompression, encoding, otherOptions);

  return new Promise(function (resolve, reject) {
    var sftp = _this8.sftp;

    if (sftp) {
      if (typeof input === 'string') {
        throw new Error('Cannot append a file to another');
      }
      var stream = sftp.createWriteStream(remotePath, options);

      stream.on('error', function (err) {
        return reject(new Error('Failed to upload data stream to ' + remotePath + ': ' + err.message));
      });

      stream.on('close', function () {
        return resolve('Uploaded data stream to ' + remotePath);
      });

      if (input instanceof Buffer) {
        stream.end(input);
        return false;
      }
      input.pipe(stream);
    } else {
      return reject(Error('sftp connect error'));
    }
  });
};

SftpClient.prototype.mkdir = function (path) {
  var _this9 = this;

  var recursive = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var sftp = this.sftp;

  var doMkdir = function doMkdir(p) {
    return new Promise(function (resolve, reject) {

      if (!sftp) {
        return reject(new Error('sftp connect error'));
      }
      sftp.mkdir(p, function (err) {
        if (err) {
          reject(new Error('Failed to create directory ' + p + ': ' + err.message));
        }
        resolve(p + ' directory created');
      });
      return undefined;
    });
  };

  if (!recursive) {
    return doMkdir(path);
  }
  var mkdir = function mkdir(p) {
    var _osPath$parse2 = osPath.parse(p);

    var dir = _osPath$parse2.dir;

    return _this9.exists(dir).then(function (type) {
      if (!type) {
        return mkdir(dir);
      }
    }).then(function () {
      return doMkdir(p);
    });
  };
  return mkdir(path);
};

SftpClient.prototype.rmdir = function (path) {
  var _this10 = this;

  var recursive = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var sftp = this.sftp;

  var doRmdir = function doRmdir(p) {
    return new Promise(function (resolve, reject) {

      if (!sftp) {
        return reject(new Error('sftp connect error'));
      }
      sftp.rmdir(p, function (err) {
        if (err) {
          reject(new Error('Failed to remove directory ' + p + ': ' + err.message));
        }
        resolve('Successfully removed directory');
      });
      return undefined;
    });
  };

  if (!recursive) {
    return doRmdir(path);
  }

  var rmdir = function rmdir(p) {
    var list = undefined;
    var files = undefined;
    var dirs = undefined;
    return _this10.list(p).then(function (res) {
      list = res;
      files = list.filter(function (item) {
        return item.type === '-';
      });
      dirs = list.filter(function (item) {
        return item.type === 'd';
      });
      return (0, _helper.forEachAsync)(files, function (f) {
        return _this10['delete'](osPath.join(p, f.name));
      });
    }).then(function () {
      return (0, _helper.forEachAsync)(dirs, function (d) {
        return rmdir(osPath.join(p, d.name));
      });
    }).then(function () {
      return doRmdir(p);
    });
  };
  return rmdir(path);
};

/**
 * @async
 *
 * Delete a file on the remote SFTP server
 *
 * @param {string} path - path to the file to delete
 * @return {Promise} with string 'Successfully deleeted file' once resolved
 * 
 */
SftpClient.prototype['delete'] = function (path) {
  var _this11 = this;

  return new Promise(function (resolve, reject) {
    var sftp = _this11.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }
    sftp.unlink(path, function (err) {
      if (err) {
        reject(new Error('Failed to delete file ' + path + ': ' + err.message));
      }
      resolve('Successfully deleted file');
    });
    return undefined;
  });
};

/**
 * @async
 *
 * Rename a file on the remote SFTP repository
 *
 * @param {sring} srcPath - path to the file to be renamced.
 * @param {string} remotePath - path to the new name.
 *
 * @return {Promise}
 * 
 */
SftpClient.prototype.rename = function (srcPath, remotePath) {
  var _this12 = this;

  return new Promise(function (resolve, reject) {
    var sftp = _this12.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }
    sftp.rename(srcPath, remotePath, function (err) {
      if (err) {
        reject(new Error('Failed to rename file ' + srcPath + ' to ' + remotePath + ': ' + err.message));
      }
      resolve('Successfully renamed ' + srcPath + ' to ' + remotePath);
    });
    return undefined;
  });
};

/**
 * @async
 *
 * Change the mode of a remote file on the SFTP repository
 *
 * @param {string} remotePath - path to the remote target object.
 * @param {Octal} mode - the new mode to set
 *
 * @return {Promise}.
 */
SftpClient.prototype.chmod = function (remotePath, mode) {
  var _this13 = this;

  return new Promise(function (resolve, reject) {
    var sftp = _this13.sftp;

    if (!sftp) {
      return reject(new Error('sftp connect error'));
    }
    sftp.chmod(remotePath, mode, function (err) {
      if (err) {
        reject(new Error('Failed to change mode for ' + remotePath + ': ' + err.message));
      }
      resolve('Successfully change file mode');
    });
    return undefined;
  });
};

/**
 * @async
 *
 * Create a new SFTP connection to a remote SFTP server
 *
 * @param {Object} config - an SFTP configuration object
 * @param {string} connectMethod - ???
 *
 * @return {Promise} which will resolve to an sftp client object
 * 
 */
SftpClient.prototype.connect = function (config, connectMethod) {
  var _this14 = this;

  connectMethod = connectMethod || 'on';

  return new Promise(function (resolve, reject) {
    _this14.client[connectMethod]('ready', function () {
      _this14.client.sftp(function (err, sftp) {
        _this14.client.removeListener('error', reject);
        _this14.client.removeListener('end', reject);
        if (err) {
          reject(new Error('Failed to connect to server: ' + err.message));
        }
        _this14.sftp = sftp;
        resolve(sftp);
      });
    }).on('end', reject).on('error', reject).connect(config);
  });
};

/**
 * @async
 *
 * Close the SFTP connection
 * 
 */
SftpClient.prototype.end = function () {
  var _this15 = this;

  return new Promise(function (resolve) {
    _this15.client.end();
    resolve();
  });
};

SftpClient.prototype.getOptions = function (useCompression, encoding, otherOptions) {
  if (encoding === undefined) {
    encoding = 'utf8';
  }
  var options = Object.assign({}, otherOptions || {}, { encoding: encoding }, useCompression);
  return options;
};

// add Event type support
SftpClient.prototype.on = function (eventType, callback) {
  this.client.on(eventType, callback);
};

module.exports = SftpClient;

// sftp = new SftpClient()
// sftp.client.on('event')
//
// sftp.on('end', ()=>{})   => this.client.on('event', callback)
// sftp.on('error', () => {})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvc3NoMi1zZnRwLWNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztzQkFTNkIsVUFBVTs7QUFUdkMsV0FBVyxDQUFDOzs7Ozs7O0FBT1osWUFBWSxDQUFDOztBQUliLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDdEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFckMsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLEdBQWE7QUFDekIsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0NBQzVCLENBQUM7Ozs7Ozs7O0FBUUYsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBUyxJQUFJLEVBQUU7OztBQUN6QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUM7O0FBRWxCLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFFBQUksSUFBSSxHQUFHLE1BQUssSUFBSSxDQUFDOztBQUVyQixRQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsYUFBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0tBQ2hEO0FBQ0QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFLO0FBQ2hDLFVBQUksR0FBRyxFQUFFO0FBQ1AsY0FBTSxDQUFDLElBQUksS0FBSyxxQkFBbUIsSUFBSSxVQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUcsQ0FBQyxDQUFDO09BQzdELE1BQU07QUFDTCxZQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLFlBQUksSUFBSSxFQUFFO0FBQ1IsaUJBQU8sR0FBRyxJQUFJLENBQUMsR0FB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QUNqRixNQUFHLFFBQVEsS0FBSyxTQUFTLEVBQUM7QUFDeEIsWUFBUSxHQUFHLE1BQU0sQ0FBQztHQUNuQjtBQUNELE1BQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFlBQVksSUFBSSxFQUFFLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDMUYsU0FBTyxPQUFPLENBQUM7Q0FDaEIsQ0FBQzs7O0FBR0YsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsVUFBUyxTQUFTLEVBQUUsUUFBUSxFQUFFO0FBQ3RELE1BQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNyQyxDQUFDOztBQUdGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvc3NoMi1zZnRwLWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIHNzaDIgc2Z0cCBjbGllbnQgZm9yIG5vZGVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qeXUyMTMvc3NoMi1zZnRwLWNsaWVudFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgZm9yRWFjaEFzeW5jIH0gZnJvbSAnLi9oZWxwZXInO1xuXG5jb25zdCBDbGllbnQgPSByZXF1aXJlKCdzc2gyJykuQ2xpZW50O1xuY29uc3Qgb3NQYXRoID0gcmVxdWlyZSgncGF0aCcpLnBvc2l4O1xuXG5sZXQgU2Z0cENsaWVudCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuY2xpZW50ID0gbmV3IENsaWVudCgpO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgYSBkaXJlY3RvcnkgbGlzdGluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoLCBhIHN0cmluZyBjb250YWluaW5nIHRoZSBwYXRoIHRvIGEgZGlyZWN0b3J5XG4gKiBAcmV0dXJuIHtQcm9taXNlfSBkYXRhLCBsaXN0IGluZm9cbiAqL1xuU2Z0cENsaWVudC5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgY29uc3QgcmVnID0gLy0vZ2k7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgc2Z0cCA9IHRoaXMuc2Z0cDtcblxuICAgIGlmICghc2Z0cCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ3NmdHAgY29ubmVjdCBlcnJvcicpKTtcbiAgICB9XG4gICAgc2Z0cC5yZWFkZGlyKHBhdGgsIChlcnIsIGxpc3QpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxpc3QgJHtwYXRofTogJHtlcnIubWVzc2FnZX1gKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbmV3TGlzdCA9IFtdO1xuICAgICAgICAvLyByZXNldCBmaWxlIGluZm9cbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBuZXdMaXN0ID0gbGlzdC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiBpdGVtLmxvbmduYW1lLnN1YnN0cigwLCAxKSxcbiAgICAgICAgICAgICAgbmFtZTogaXRlbS5maWxlbmFtZSxcbiAgICAgICAgICAgICAgc2l6ZTogaXRlbS5hdHRycy5zaXplLFxuICAgICAgICAgICAgICBtb2RpZnlUaW1lOiBpdGVtLmF0dHJzLm10aW1lICogMTAwMCxcbiAgICAgICAgICAgICAgYWNjZXNzVGltZTogaXRlbS5hdHRycy5hdGltZSAqIDEwMDAsXG4gICAgICAgICAgICAgIHJpZ2h0czoge1xuICAgICAgICAgICAgICAgIHVzZXI6IGl0ZW0ubG9uZ25hbWUuc3Vic3RyKDEsIDMpLnJlcGxhY2UocmVnLCAnJyksXG4gICAgICAgICAgICAgICAgZ3JvdXA6IGl0ZW0ubG9uZ25hbWUuc3Vic3RyKDQsMykucmVwbGFjZShyZWcsICcnKSxcbiAgICAgICAgICAgICAgICBvdGhlcjogaXRlbS5sb25nbmFtZS5zdWJzdHIoNywgMykucmVwbGFjZShyZWcsICcnKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvd25lcjogaXRlbS5hdHRycy51aWQsXG4gICAgICAgICAgICAgIGdyb3VwOiBpdGVtLmF0dHJzLmdpZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKG5ld0xpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAYXN5bmNcbiBcbiAqIFRlc3RzIHRvIHNlZSBpZiBhbiBvYmplY3QgZXhpc3RzLiBJZiBpdCBkb2VzLCByZXR1cm4gdGhlIHR5cGUgb2YgdGhhdCBvYmplY3RcbiAqIChpbiB0aGUgZm9ybWF0IHJldHVybmVkIGJ5IGxpc3QpLiBJZiBpdCBkb2VzIG5vdCBleGlzdCwgcmV0dXJuIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gcGF0aCB0byB0aGUgb2JqZWN0IG9uIHRoZSBzZnRwIHNlcnZlci5cbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufSByZXR1cm5zIGZhbHNlIGlmIG9iamVjdCBkb2VzIG5vdCBleGlzdC4gUmV0dXJucyB0eXBlIG9mXG4gKiAgICAgICAgICAgICAgICAgICBvYmplY3QgaWYgaXQgZG9lc1xuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5leGlzdHMgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHNmdHAgPSB0aGlzLnNmdHA7XG5cbiAgICBpZiAoIXNmdHApIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7XG4gICAgfVxuICAgIGxldCB7ZGlyLCBiYXNlfSA9IG9zUGF0aC5wYXJzZShwYXRoKTtcbiAgICBzZnRwLnJlYWRkaXIoZGlyLCAoZXJyLCBsaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMikge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEVycm9yIGxpc3RpbmcgJHtkaXJ9OiBjb2RlOiAke2Vyci5jb2RlfSAke2Vyci5tZXNzYWdlfWApKTsgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBbdHlwZV0gPSBsaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uZmlsZW5hbWUgPT09IGJhc2UpLm1hcChpdGVtID0+IGl0ZW0ubG9uZ25hbWUuc3Vic3RyKDAsIDEpKTtcbiAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICByZXNvbHZlKHR5cGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyBhdHRyaWJ1dGVzIGZvciBwYXRoXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGgsIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHBhdGggdG8gYSBmaWxlXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBzdGF0cywgYXR0cmlidXRlcyBpbmZvXG4gKi9cblNmdHBDbGllbnQucHJvdG90eXBlLnN0YXQgPSBmdW5jdGlvbihyZW1vdGVQYXRoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHNmdHAgPSB0aGlzLnNmdHA7XG5cbiAgICBpZiAoIXNmdHApIHtcbiAgICAgIHJldHVybiByZWplY3QoRXJyb3IoJ3NmdHAgY29ubmVjdCBlcnJvcicpKTsgICAgICBcbiAgICB9XG4gICAgc2Z0cC5zdGF0KHJlbW90ZVBhdGgsIGZ1bmN0aW9uIChlcnIsIHN0YXRzKSB7XG4gICAgICBpZiAoZXJyKXtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIHN0YXQgJHtyZW1vdGVQYXRofTogJHtlcnIubWVzc2FnZX1gKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgLy8gZm9ybWF0IHNpbWlsYXJseSB0byBzZnRwLmxpc3RcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgbW9kZTogc3RhdHMubW9kZSxcbiAgICAgICAgICBwZXJtaXNzaW9uczogc3RhdHMucGVybWlzc2lvbnMsXG4gICAgICAgICAgb3duZXI6IHN0YXRzLnVpZCxcbiAgICAgICAgICBncm91cDogc3RhdHMuZ3VpZCxcbiAgICAgICAgICBzaXplOiBzdGF0cy5zaXplLFxuICAgICAgICAgIGFjY2Vzc1RpbWU6IHN0YXRzLmF0aW1lICogMTAwMCxcbiAgICAgICAgICBtb2RpZnlUaW1lOiBzdGF0cy5tdGltZSAqIDEwMDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIGdldCBmaWxlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGgsIHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VDb21wcmVzc2lvbiwgY29uZmlnIG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbmNvZGluZy4gRW5jb2RpbmcgZm9yIHRoZSBSZWFkU3RyZWFtLCBjYW4gYmUgYW55IHZhbHVlXG4gKiBzdXBwb3J0ZWQgYnkgbm9kZSBzdHJlYW1zLiBVc2UgJ251bGwnIGZvciBiaW5hcnlcbiAqIChodHRwczovL25vZGVqcy5vcmcvYXBpL3N0cmVhbS5odG1sI3N0cmVhbV9yZWFkYWJsZV9zZXRlbmNvZGluZ19lbmNvZGluZylcbiAqIEByZXR1cm4ge1Byb21pc2V9IHN0cmVhbSwgcmVhZGFibGUgc3RyZWFtXG4gKi9cblNmdHBDbGllbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHBhdGgsIHVzZUNvbXByZXNzaW9uLCBlbmNvZGluZywgb3RoZXJPcHRpb25zKSB7XG4gIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKHVzZUNvbXByZXNzaW9uLCBlbmNvZGluZywgb3RoZXJPcHRpb25zKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBzZnRwID0gdGhpcy5zZnRwO1xuXG4gICAgaWYgKHNmdHApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY2xpZW50Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgXG4gICAgICAgIGxldCBzdHJlYW0gPSBzZnRwLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG4gICAgICAgIFxuICAgICAgICBzdHJlYW0ub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCBnZXQgZm9yICR7cGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RyZWFtLm9uKCdyZWFkYWJsZScsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsaWVudC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgIC8vIEF0ZXIgbm9kZSBWMTAuMC4wLCAncmVhZGFibGUnIHRha2VzIHByZWNlZGVuY2UgaW4gY29udHJvbGxpbmcgdGhlIGZsb3csXG4gICAgICAgICAgLy8gaS5lLiAnZGF0YScgd2lsbCBiZSBlbWl0dGVkIG9ubHkgd2hlbiBzdHJlYW0ucmVhZCgpIGlzIGNhbGxlZC5cbiAgICAgICAgICB3aGlsZSgoc3RyZWFtLnJlYWQoKSkgIT09IG51bGwpIHt9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhbHdheXMgdGhlIHN0cmVhbSwgbm90IG9ubHkgd2hlbiByZWFkYWJsZSBldmVudCBpcyB0cmlnZ2VyZC5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoc3RyZWFtKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgZ2V0IG9uICR7cGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignc2Z0cCBjb25uZWN0IGVycm9yJykpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIFVzZSBTU0gyIGZhc3RHZXQgZm9yIGRvd25sb2FkaW5nIHRoZSBmaWxlLlxuICogRG93bmxvYWRzIGEgZmlsZSBhdCByZW1vdGVQYXRoIHRvIGxvY2FsUGF0aCB1c2luZyBwYXJhbGxlbCByZWFkcyBmb3IgZmFzdGVyIHRocm91Z2hwdXQuXG4gKiBTZWUgJ2Zhc3RHZXQnIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9tc2NkZXgvc3NoMi1zdHJlYW1zL2Jsb2IvbWFzdGVyL1NGVFBTdHJlYW0ubWRcbiAqIEBwYXJhbSB7U3RyaW5nfSByZW1vdGVQYXRoXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxQYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UHJvbWlzZX0gdGhlIHJlc3VsdCBvZiBkb3dubG9hZGluZyB0aGUgZmlsZVxuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5mYXN0R2V0ID0gZnVuY3Rpb24ocmVtb3RlUGF0aCwgbG9jYWxQYXRoLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHtjb25jdXJyZW5jeTogNjQsIGNodW5rU2l6ZTogMzI3Njh9O1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBzZnRwID0gdGhpcy5zZnRwO1xuXG4gICAgaWYgKCFzZnRwKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7ICAgICAgXG4gICAgfVxuICAgIHNmdHAuZmFzdEdldChyZW1vdGVQYXRoLCBsb2NhbFBhdGgsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpe1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gZ2V0ICR7cmVtb3RlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShgJHtyZW1vdGVQYXRofSB3YXMgc3VjY2Vzc2Z1bGx5IGRvd25sb2FkIHRvICR7bG9jYWxQYXRofSFgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn07XG5cbi8qKlxuICogVXNlIFNTSDIgZmFzdFB1dCBmb3IgdXBsb2FkaW5nIHRoZSBmaWxlLlxuICogVXBsb2FkcyBhIGZpbGUgZnJvbSBsb2NhbFBhdGggdG8gcmVtb3RlUGF0aCB1c2luZyBwYXJhbGxlbCByZWFkcyBmb3IgZmFzdGVyIHRocm91Z2hwdXQuXG4gKiBTZWUgJ2Zhc3RQdXQnIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9tc2NkZXgvc3NoMi1zdHJlYW1zL2Jsb2IvbWFzdGVyL1NGVFBTdHJlYW0ubWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbFBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSByZW1vdGVQYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UHJvbWlzZX0gdGhlIHJlc3VsdCBvZiBkb3dubG9hZGluZyB0aGUgZmlsZVxuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5mYXN0UHV0ID0gZnVuY3Rpb24obG9jYWxQYXRoLCByZW1vdGVQYXRoLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBzZnRwID0gdGhpcy5zZnRwO1xuXG4gICAgaWYgKCFzZnRwKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignc2Z0cCBjb25uZWN0IGVycm9yJykpOyAgICAgIFxuICAgIH1cbiAgICBzZnRwLmZhc3RQdXQobG9jYWxQYXRoLCByZW1vdGVQYXRoLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byB1cGxvYWQgJHtsb2NhbFBhdGh9IHRvICR7cmVtb3RlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShgJHtsb2NhbFBhdGh9IHdhcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQgdG8gJHtyZW1vdGVQYXRofSFgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGUgZmlsZVxuICpcbiAqIEBwYXJhbSAge1N0cmluZ3xCdWZmZXJ8c3RyZWFtfSBpbnB1dFxuICogQHBhcmFtICB7U3RyaW5nfSByZW1vdGVQYXRoLFxuICogQHBhcmFtICB7T2JqZWN0fSB1c2VDb21wcmVzc2lvbiBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVuY29kaW5nLiBFbmNvZGluZyBmb3IgdGhlIFdyaXRlU3RyZWFtLCBjYW4gYmUgYW55IHZhbHVlIHN1cHBvcnRlZCBieSBub2RlIHN0cmVhbXMuXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuU2Z0cENsaWVudC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24oaW5wdXQsIHJlbW90ZVBhdGgsIHVzZUNvbXByZXNzaW9uLCBlbmNvZGluZywgb3RoZXJPcHRpb25zKSB7XG4gIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKHVzZUNvbXByZXNzaW9uLCBlbmNvZGluZywgb3RoZXJPcHRpb25zKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBzZnRwID0gdGhpcy5zZnRwO1xuXG4gICAgaWYgKHNmdHApIHtcbiAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNmdHAuZmFzdFB1dChpbnB1dCwgcmVtb3RlUGF0aCwgb3B0aW9ucywgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gdXBsb2FkICR7aW5wdXR9IHRvICR7cmVtb3RlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShgVXBsb2FkZWQgJHtpbnB1dH0gdG8gJHtyZW1vdGVQYXRofWApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbGV0IHN0cmVhbSA9IHNmdHAuY3JlYXRlV3JpdGVTdHJlYW0ocmVtb3RlUGF0aCwgb3B0aW9ucyk7XG5cbiAgICAgIHN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIHVwbG9hZCBkYXRhIHN0cmVhbSB0byAke3JlbW90ZVBhdGh9OiAke2Vyci5tZXNzYWdlfWApKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShgVXBsb2FkZWQgZGF0YSBzdHJlYW0gdG8gJHtyZW1vdGVQYXRofWApO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICBzdHJlYW0uZW5kKGlucHV0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaW5wdXQucGlwZShzdHJlYW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVqZWN0KEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7XG4gICAgfVxuICB9KTtcbn07XG4vKipcbiAqIEFwcGVuZCB0byBmaWxlXG4gKlxuICogQHBhcmFtICB7QnVmZmVyfHN0cmVhbX0gaW5wdXRcbiAqIEBwYXJhbSAge1N0cmluZ30gcmVtb3RlUGF0aCxcbiAqIEBwYXJhbSAge09iamVjdH0gdXNlQ29tcHJlc3Npb24gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7U3RyaW5nfSBlbmNvZGluZy4gRW5jb2RpbmcgZm9yIHRoZSBXcml0ZVN0cmVhbSwgY2FuIGJlIGFueSB2YWx1ZSBzdXBwb3J0ZWQgYnkgbm9kZSBzdHJlYW1zLlxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cblNmdHBDbGllbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKGlucHV0LCByZW1vdGVQYXRoLCB1c2VDb21wcmVzc2lvbiwgZW5jb2RpbmcsIG90aGVyT3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucyh1c2VDb21wcmVzc2lvbiwgZW5jb2RpbmcsIG90aGVyT3B0aW9ucyk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgc2Z0cCA9IHRoaXMuc2Z0cDtcblxuICAgIGlmIChzZnRwKSB7XG4gICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhcHBlbmQgYSBmaWxlIHRvIGFub3RoZXInKVxuICAgICAgfVxuICAgICAgbGV0IHN0cmVhbSA9IHNmdHAuY3JlYXRlV3JpdGVTdHJlYW0ocmVtb3RlUGF0aCwgb3B0aW9ucyk7XG5cbiAgICAgIHN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIHVwbG9hZCBkYXRhIHN0cmVhbSB0byAke3JlbW90ZVBhdGh9OiAke2Vyci5tZXNzYWdlfWApKTtcbiAgICAgIH0pO1xuXG4gICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShgVXBsb2FkZWQgZGF0YSBzdHJlYW0gdG8gJHtyZW1vdGVQYXRofWApO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICBzdHJlYW0uZW5kKGlucHV0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaW5wdXQucGlwZShzdHJlYW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVqZWN0KEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7XG4gICAgfVxuICB9KTtcbn07XG5cblNmdHBDbGllbnQucHJvdG90eXBlLm1rZGlyID0gZnVuY3Rpb24ocGF0aCwgcmVjdXJzaXZlID0gZmFsc2UpIHtcbiAgbGV0IHNmdHAgPSB0aGlzLnNmdHA7XG5cbiAgbGV0IGRvTWtkaXIgPSBwID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG5cbiAgICAgIGlmICghc2Z0cCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignc2Z0cCBjb25uZWN0IGVycm9yJykpO1xuICAgICAgfVxuICAgICAgc2Z0cC5ta2RpcihwLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSBkaXJlY3RvcnkgJHtwfTogJHtlcnIubWVzc2FnZX1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShgJHtwfSBkaXJlY3RvcnkgY3JlYXRlZGApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9O1xuXG4gIGlmICghcmVjdXJzaXZlKSB7XG4gICAgcmV0dXJuIGRvTWtkaXIocGF0aCk7XG4gIH1cbiAgbGV0IG1rZGlyID0gcCA9PiB7XG4gICAgICBsZXQge2Rpcn0gPSBvc1BhdGgucGFyc2UocCk7XG4gICAgICByZXR1cm4gdGhpcy5leGlzdHMoZGlyKS50aGVuKCh0eXBlKSA9PiB7XG4gICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgIHJldHVybiBta2RpcihkaXIpO1xuICAgICAgICB9XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvTWtkaXIocCk7XG4gICAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIG1rZGlyKHBhdGgpO1xufTtcblxuU2Z0cENsaWVudC5wcm90b3R5cGUucm1kaXIgPSBmdW5jdGlvbihwYXRoLCByZWN1cnNpdmUgPSBmYWxzZSkge1xuICBsZXQgc2Z0cCA9IHRoaXMuc2Z0cDtcblxuICBsZXQgZG9SbWRpciA9IHAgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGlmICghc2Z0cCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignc2Z0cCBjb25uZWN0IGVycm9yJykpO1xuICAgICAgfVxuICAgICAgc2Z0cC5ybWRpcihwLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIHJlbW92ZSBkaXJlY3RvcnkgJHtwfTogJHtlcnIubWVzc2FnZX1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSgnU3VjY2Vzc2Z1bGx5IHJlbW92ZWQgZGlyZWN0b3J5Jyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKCFyZWN1cnNpdmUpIHtcbiAgICByZXR1cm4gZG9SbWRpcihwYXRoKTtcbiAgfVxuXG4gIGxldCBybWRpciA9IHAgPT4ge1xuICAgIGxldCBsaXN0O1xuICAgIGxldCBmaWxlcztcbiAgICBsZXQgZGlycztcbiAgICByZXR1cm4gdGhpcy5saXN0KHApLnRoZW4oKHJlcykgPT4ge1xuICAgICAgbGlzdCA9IHJlcztcbiAgICAgIGZpbGVzID0gbGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09ICctJyk7XG4gICAgICBkaXJzID0gbGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09ICdkJyk7XG4gICAgICByZXR1cm4gZm9yRWFjaEFzeW5jKGZpbGVzLCAoZikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUob3NQYXRoLmpvaW4ocCwgZi5uYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBmb3JFYWNoQXN5bmMoZGlycywgKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHJtZGlyKG9zUGF0aC5qb2luKHAsIGQubmFtZSkpO1xuICAgICAgfSk7XG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZG9SbWRpcihwKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHJtZGlyKHBhdGgpO1xufTtcblxuLyoqXG4gKiBAYXN5bmNcbiAqXG4gKiBEZWxldGUgYSBmaWxlIG9uIHRoZSByZW1vdGUgU0ZUUCBzZXJ2ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHBhdGggdG8gdGhlIGZpbGUgdG8gZGVsZXRlXG4gKiBAcmV0dXJuIHtQcm9taXNlfSB3aXRoIHN0cmluZyAnU3VjY2Vzc2Z1bGx5IGRlbGVldGVkIGZpbGUnIG9uY2UgcmVzb2x2ZWRcbiAqIFxuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHNmdHAgPSB0aGlzLnNmdHA7XG5cbiAgICBpZiAoIXNmdHApIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7ICAgICAgXG4gICAgfVxuICAgIHNmdHAudW5saW5rKHBhdGgsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGRlbGV0ZSBmaWxlICR7cGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZSgnU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgZmlsZScpO1xuICAgIH0pO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAYXN5bmNcbiAqXG4gKiBSZW5hbWUgYSBmaWxlIG9uIHRoZSByZW1vdGUgU0ZUUCByZXBvc2l0b3J5XG4gKlxuICogQHBhcmFtIHtzcmluZ30gc3JjUGF0aCAtIHBhdGggdG8gdGhlIGZpbGUgdG8gYmUgcmVuYW1jZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlUGF0aCAtIHBhdGggdG8gdGhlIG5ldyBuYW1lLlxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKiBcbiAqL1xuU2Z0cENsaWVudC5wcm90b3R5cGUucmVuYW1lID0gZnVuY3Rpb24oc3JjUGF0aCwgcmVtb3RlUGF0aCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBzZnRwID0gdGhpcy5zZnRwO1xuXG4gICAgaWYgKCFzZnRwKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignc2Z0cCBjb25uZWN0IGVycm9yJykpOyAgICAgIFxuICAgIH1cbiAgICBzZnRwLnJlbmFtZShzcmNQYXRoLCByZW1vdGVQYXRoLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byByZW5hbWUgZmlsZSAke3NyY1BhdGh9IHRvICR7cmVtb3RlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShgU3VjY2Vzc2Z1bGx5IHJlbmFtZWQgJHtzcmNQYXRofSB0byAke3JlbW90ZVBhdGh9YCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEBhc3luY1xuICpcbiAqIENoYW5nZSB0aGUgbW9kZSBvZiBhIHJlbW90ZSBmaWxlIG9uIHRoZSBTRlRQIHJlcG9zaXRvcnlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlUGF0aCAtIHBhdGggdG8gdGhlIHJlbW90ZSB0YXJnZXQgb2JqZWN0LlxuICogQHBhcmFtIHtPY3RhbH0gbW9kZSAtIHRoZSBuZXcgbW9kZSB0byBzZXRcbiAqXG4gKiBAcmV0dXJuIHtQcm9taXNlfS5cbiAqL1xuU2Z0cENsaWVudC5wcm90b3R5cGUuY2htb2QgPSBmdW5jdGlvbihyZW1vdGVQYXRoLCBtb2RlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHNmdHAgPSB0aGlzLnNmdHA7XG5cbiAgICBpZiAoIXNmdHApIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdzZnRwIGNvbm5lY3QgZXJyb3InKSk7ICAgICAgXG4gICAgfVxuICAgIHNmdHAuY2htb2QocmVtb3RlUGF0aCwgbW9kZSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gY2hhbmdlIG1vZGUgZm9yICR7cmVtb3RlUGF0aH06ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZSgnU3VjY2Vzc2Z1bGx5IGNoYW5nZSBmaWxlIG1vZGUnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn07XG5cbi8qKlxuICogQGFzeW5jXG4gKlxuICogQ3JlYXRlIGEgbmV3IFNGVFAgY29ubmVjdGlvbiB0byBhIHJlbW90ZSBTRlRQIHNlcnZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBhbiBTRlRQIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gY29ubmVjdE1ldGhvZCAtID8/P1xuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9IHdoaWNoIHdpbGwgcmVzb2x2ZSB0byBhbiBzZnRwIGNsaWVudCBvYmplY3RcbiAqIFxuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oY29uZmlnLCBjb25uZWN0TWV0aG9kKSB7XG4gIGNvbm5lY3RNZXRob2QgPSBjb25uZWN0TWV0aG9kIHx8ICdvbic7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0aGlzLmNsaWVudFtjb25uZWN0TWV0aG9kXSgncmVhZHknLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudC5zZnRwKChlcnIsIHNmdHApID0+IHtcbiAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgdGhpcy5jbGllbnQucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHJlamVjdCk7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gY29ubmVjdCB0byBzZXJ2ZXI6ICR7ZXJyLm1lc3NhZ2V9YCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Z0cCA9IHNmdHA7XG4gICAgICAgIHJlc29sdmUoc2Z0cCk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgICAgLm9uKCdlbmQnLCByZWplY3QpXG4gICAgICAub24oJ2Vycm9yJywgcmVqZWN0KVxuICAgICAgLmNvbm5lY3QoY29uZmlnKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEBhc3luY1xuICpcbiAqIENsb3NlIHRoZSBTRlRQIGNvbm5lY3Rpb25cbiAqIFxuICovXG5TZnRwQ2xpZW50LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgdGhpcy5jbGllbnQuZW5kKCk7XG4gICAgcmVzb2x2ZSgpO1xuICB9KTtcbn07XG5cblNmdHBDbGllbnQucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbih1c2VDb21wcmVzc2lvbiwgZW5jb2RpbmcsIG90aGVyT3B0aW9ucykge1xuICBpZihlbmNvZGluZyA9PT0gdW5kZWZpbmVkKXtcbiAgICBlbmNvZGluZyA9ICd1dGY4JztcbiAgfVxuICBsZXQgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG90aGVyT3B0aW9ucyB8fCB7fSwge2VuY29kaW5nOiBlbmNvZGluZ30sIHVzZUNvbXByZXNzaW9uKTtcbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG4vLyBhZGQgRXZlbnQgdHlwZSBzdXBwb3J0XG5TZnRwQ2xpZW50LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgY2FsbGJhY2spIHtcbiAgdGhpcy5jbGllbnQub24oZXZlbnRUeXBlLCBjYWxsYmFjayk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU2Z0cENsaWVudDtcblxuLy8gc2Z0cCA9IG5ldyBTZnRwQ2xpZW50KClcbi8vIHNmdHAuY2xpZW50Lm9uKCdldmVudCcpXG4vL1xuLy8gc2Z0cC5vbignZW5kJywgKCk9Pnt9KSAgID0+IHRoaXMuY2xpZW50Lm9uKCdldmVudCcsIGNhbGxiYWNrKVxuLy8gc2Z0cC5vbignZXJyb3InLCAoKSA9PiB7fSlcbiJdfQ==