var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _helperJs = require('./helper.js');

var _formatJs = require('./format.js');

'use babel';

var EventEmitter = require('events');
var tempDirectory = require('os').tmpdir();
var shortHash = require('short-hash');
var Path = require('path');
var FileSystem = require('fs-plus');

var FinderItemsCache = (function (_EventEmitter) {
  _inherits(FinderItemsCache, _EventEmitter);

  function FinderItemsCache(config, connector) {
    _classCallCheck(this, FinderItemsCache);

    _get(Object.getPrototypeOf(FinderItemsCache.prototype), 'constructor', this).call(this);
    var self = this;

    self.items = [];
    self.paths = [];
    self.config = config;
    self.connector = connector;
    self.loadTask = false;
  }

  _createClass(FinderItemsCache, [{
    key: 'load',
    value: function load() {
      var reindex = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var self = this;

      if (reindex) {
        self.loadTask = false;
        self.items = [];
        self.paths = [];
      }

      if (self.loadTask) return;

      if (reindex) {
        self.deleteCache();
      } else if (self.loadCache()) {
        if (self.paths.length > 0) {
          self.emit('finder-items-cache-queue:update', self.items);
        } else {
          self.emit('finder-items-cache-queue:finish', self.items);
          return true;
        }
      }

      if (self.paths.length == 0) {
        self.paths.push({
          path: self.config.remote + '/',
          relativePath: '/'
        });
      }

      self.loadTask = true;
      self.list(self.paths).then(function (list) {
        self.storeCache(true);
        self.loadTask = false;
        self.emit('finder-items-cache-queue:finish', self.items);
      })['catch'](function (err) {
        self.storeCache(true);
        self.loadTask = false;
        self.emit('finder-items-cache-queue:error', err);
      });
    }
  }, {
    key: 'list',
    value: function list() {
      var self = this;

      var tmp = self.paths.shift();
      var path = tmp.path;
      var relativePath = tmp.relativePath;

      if (!self.loadTask) {
        return new Promise(function (resolve, reject) {
          resolve();
        });
      }

      return self.connector.listDirectory(path).then(function (list) {
        list.forEach(function (element) {
          if (element.type == 'd' && !(0, _helperJs.isFinderPathIgnored)(element.name)) {
            self.paths.push({ path: path + element.name + '/', relativePath: relativePath + element.name + '/' });
          } else if (element.type === '-' && !(0, _helperJs.isFinderPathIgnored)(element.name)) {
            self.items.push({ file: element.name, directory: relativePath, relativePath: relativePath + element.name, size: element.size });
          }
        });
        self.emit('finder-items-cache-queue:index', self.items);

        if (self.paths.length > 0) {
          return self.list().then(function () {
            return new Promise(function (resolve, reject) {
              resolve();
            });
          })['catch'](function (err) {
            return new Promise(function (resolve, reject) {
              reject(err);
            });
          });
        } else {
          return new Promise(function (resolve, reject) {
            resolve();
          });
        }
      })['catch'](function (err) {
        self.loadTask = false;
        return new Promise(function (resolve, reject) {
          reject(err);
        });
      });
    }
  }, {
    key: 'storeCache',
    value: function storeCache() {
      var createFile = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var self = this;

      var path = (self.config.remote ? tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/' + self.config.remote + '/' : tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/').replace(/\/+/g, Path.sep);
      var file = path + Path.sep + '.cache';

      if (!createFile && !FileSystem.existsSync(file)) return;

      var cache = {
        paths: self.paths,
        items: self.items
      };
      try {
        FileSystem.writeFileSync(file, JSON.stringify(cache));
      } catch (ex) {}
    }
  }, {
    key: 'loadCache',
    value: function loadCache() {
      var self = this;

      if (self.loadTask) return true;

      var path = (self.config.remote ? tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/' + self.config.remote + '/' : tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/').replace(/\/+/g, Path.sep);
      var file = path + Path.sep + '.cache';

      try {
        if (FileSystem.existsSync(file)) {
          var tmp = FileSystem.readFileSync(file);
          cache = JSON.parse(tmp);
          self.paths = cache.paths;
          self.items = cache.items;
          return true;
        }
      } catch (ex) {}
      return false;
    }
  }, {
    key: 'deleteCache',
    value: function deleteCache() {
      var self = this;

      var path = (self.config.remote ? tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/' + self.config.remote + '/' : tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/').replace(/\/+/g, Path.sep);
      var file = path + Path.sep + '.cache';

      try {
        if (FileSystem.existsSync(file)) {
          FileSystem.unlinkSync(file);
          self.paths = [];
          self.items = [];
          return true;
        }
      } catch (ex) {
        self.paths = [];
        self.items = [];
      }

      return false;
    }
  }, {
    key: 'addFile',
    value: function addFile(relativePath) {
      var size = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var self = this;

      if (!self.items) return;
      if (!self.loadTask && !self.loadCache()) return;

      var file = (0, _formatJs.basename)(relativePath);
      self.items.push({ file: file, directory: (0, _formatJs.dirname)(relativePath), relativePath: relativePath, size: size });
      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }, {
    key: 'renameFile',
    value: function renameFile(oldRelativePath, newRelativePath) {
      var size = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var self = this;

      if (!self.items) return;
      if (!self.loadTask && !self.loadCache()) return;

      // Remove old
      self.items = self.items.filter(function (item) {
        return item.relativePath != oldRelativePath;
      });

      // Add new
      self.items.push({ file: (0, _formatJs.basename)(newRelativePath), directory: (0, _formatJs.dirname)(newRelativePath), relativePath: newRelativePath, size: size });
      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(relativePath) {
      var self = this;

      if (!self.items) return;
      if (!self.loadTask && !self.loadCache()) return;

      self.items = self.items.filter(function (item) {
        return item.relativePath != relativePath;
      });
      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }, {
    key: 'refreshDirectory',
    value: function refreshDirectory(directory, files) {
      var self = this;

      if (!self.items || !files) return;
      if (!self.loadTask && !self.loadCache()) return;

      // Remove old files in same directory
      self.items = self.items.filter(function (item) {
        return item.directory != directory;
      });

      // Add new files for same directory
      files.forEach(function (file) {
        self.items.push({ file: file.name, directory: directory, relativePath: directory + file.name, size: file.size });
      });

      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }, {
    key: 'renameDirectory',
    value: function renameDirectory(oldRelativePath, newRelativePath) {
      var self = this;

      if (!self.items) return;
      if (!self.loadTask && !self.loadCache()) return;

      // get files
      var items = self.items.filter(function (item) {
        return item.directory.startsWith(oldRelativePath);
      });

      // Remove files in directory
      self.items = self.items.filter(function (item) {
        return !item.directory.startsWith(oldRelativePath);
      });

      // Add new files for directory
      items.forEach(function (item) {
        self.items.push({ file: item.file, directory: item.directory.replace(oldRelativePath, newRelativePath), relativePath: item.relativePath.replace(oldRelativePath, newRelativePath), size: item.size });
      });

      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }, {
    key: 'deleteDirectory',
    value: function deleteDirectory(relativePath) {
      var self = this;

      if (!self.items) return;
      if (!self.loadTask && !self.loadCache()) return;

      // Remove files in directory
      self.items = self.items.filter(function (item) {
        return !item.directory.startsWith(relativePath);
      });

      self.storeCache();
      self.emit('finder-items-cache-queue:update', self.items);
    }
  }]);

  return FinderItemsCache;
})(EventEmitter);

module.exports = FinderItemsCache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvZmluZGVyLWl0ZW1zLWNhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3dCQUVvQyxhQUFhOzt3QkFDZixhQUFhOztBQUgvQyxXQUFXLENBQUM7O0FBS1osSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7SUFFaEMsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7QUFFVCxXQUZQLGdCQUFnQixDQUVSLE1BQU0sRUFBRSxTQUFTLEVBQUU7MEJBRjNCLGdCQUFnQjs7QUFHbEIsK0JBSEUsZ0JBQWdCLDZDQUdWO0FBQ1IsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztHQUN2Qjs7ZUFYRyxnQkFBZ0I7O1dBYWhCLGdCQUFrQjtVQUFqQixPQUFPLHlEQUFHLEtBQUs7O0FBQ2xCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxPQUFPLEVBQUU7QUFDWCxZQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixZQUFJ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SSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztPQUN2TSxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFEOzs7V0FFYyx5QkFBQyxZQUFZLEVBQUU7QUFDNUIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQ3hCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU87OztBQUdoRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGVBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUNqRCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFEOzs7U0F4UUcsZ0JBQWdCO0dBQVMsWUFBWTs7QUEyUTNDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2hlbHBlci9maW5kZXItaXRlbXMtY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgaXNGaW5kZXJQYXRoSWdub3JlZCB9IGZyb20gJy4vaGVscGVyLmpzJztcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lIH0gZnJvbSAnLi9mb3JtYXQuanMnO1xuXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IHRlbXBEaXJlY3RvcnkgPSByZXF1aXJlKCdvcycpLnRtcGRpcigpO1xuY29uc3Qgc2hvcnRIYXNoID0gcmVxdWlyZSgnc2hvcnQtaGFzaCcpO1xuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IEZpbGVTeXN0ZW0gPSByZXF1aXJlKCdmcy1wbHVzJyk7XG5cbmNsYXNzIEZpbmRlckl0ZW1zQ2FjaGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgY29ubmVjdG9yKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaXRlbXMgPSBbXTtcbiAgICBzZWxmLnBhdGhzID0gW107XG4gICAgc2VsZi5jb25maWcgPSBjb25maWc7XG4gICAgc2VsZi5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgc2VsZi5sb2FkVGFzayA9IGZhbHNlO1xuICB9XG5cbiAgbG9hZChyZWluZGV4ID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChyZWluZGV4KSB7XG4gICAgICBzZWxmLmxvYWRUYXNrID0gZmFsc2U7XG4gICAgICBzZWxmLml0ZW1zID0gW107XG4gICAgICBzZWxmLnBhdGhzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHNlbGYubG9hZFRhc2spIHJldHVybjtcblxuICAgIGlmIChyZWluZGV4KSB7XG4gICAgICBzZWxmLmRlbGV0ZUNhY2hlKCk7XG4gICAgfSBlbHNlIGlmIChzZWxmLmxvYWRDYWNoZSgpKSB7XG4gICAgICBpZiAoc2VsZi5wYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHNlbGYuaXRlbXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5lbWl0KCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZmluaXNoJywgc2VsZi5pdGVtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLnBhdGhzLmxlbmd0aCA9PSAwKSB7XG4gICAgICBzZWxmLnBhdGhzLnB1c2goe1xuICAgICAgICBwYXRoOiBzZWxmLmNvbmZpZy5yZW1vdGUgKyAnLycsXG4gICAgICAgIHJlbGF0aXZlUGF0aDogJy8nXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxmLmxvYWRUYXNrID0gdHJ1ZTtcbiAgICBzZWxmLmxpc3Qoc2VsZi5wYXRocykudGhlbigobGlzdCkgPT4ge1xuICAgICAgc2VsZi5zdG9yZUNhY2hlKHRydWUpO1xuICAgICAgc2VsZi5sb2FkVGFzayA9IGZhbHNlO1xuICAgICAgc2VsZi5lbWl0KCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZmluaXNoJywgc2VsZi5pdGVtcyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2VsZi5zdG9yZUNhY2hlKHRydWUpO1xuICAgICAgc2VsZi5sb2FkVGFzayA9IGZhbHNlO1xuICAgICAgc2VsZi5lbWl0KCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZXJyb3InLCBlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgbGlzdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCB0bXAgPSBzZWxmLnBhdGhzLnNoaWZ0KCk7XG4gICAgbGV0IHBhdGggPSB0bXAucGF0aDtcbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gdG1wLnJlbGF0aXZlUGF0aDtcblxuICAgIGlmICghc2VsZi5sb2FkVGFzaykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuY29ubmVjdG9yLmxpc3REaXJlY3RvcnkocGF0aCkudGhlbigobGlzdCkgPT4ge1xuICAgICAgbGlzdC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT0gJ2QnICYmICFpc0ZpbmRlclBhdGhJZ25vcmVkKGVsZW1lbnQubmFtZSkpIHtcbiAgICAgICAgICBzZWxmLnBhdGhzLnB1c2goeyBwYXRoOiBwYXRoICsgZWxlbWVudC5uYW1lICsgJy8nLCByZWxhdGl2ZVBhdGg6IHJlbGF0aXZlUGF0aCArIGVsZW1lbnQubmFtZSArICcvJyB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnR5cGUgPT09ICctJyAmJiAhaXNGaW5kZXJQYXRoSWdub3JlZChlbGVtZW50Lm5hbWUpKSB7XG4gICAgICAgICAgc2VsZi5pdGVtcy5wdXNoKHsgZmlsZTogZWxlbWVudC5uYW1lLCBkaXJlY3Rvcnk6IHJlbGF0aXZlUGF0aCwgcmVsYXRpdmVQYXRoOiByZWxhdGl2ZVBhdGggKyBlbGVtZW50Lm5hbWUsIHNpemU6IGVsZW1lbnQuc2l6ZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzZWxmLmVtaXQoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTppbmRleCcsIHNlbGYuaXRlbXMpO1xuXG4gICAgICBpZiAoc2VsZi5wYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmxpc3QoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzZWxmLmxvYWRUYXNrID0gZmFsc2U7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RvcmVDYWNoZShjcmVhdGVGaWxlID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwYXRoID0gKChzZWxmLmNvbmZpZy5yZW1vdGUpID9cbiAgICAgIHRlbXBEaXJlY3RvcnkgKyAnLycgKyBzaG9ydEhhc2goc2VsZi5jb25maWcuaG9zdCArIHNlbGYuY29uZmlnLm5hbWUpICsgJy8nICsgc2VsZi5jb25maWcuaG9zdCArICcvJyArIHNlbGYuY29uZmlnLnJlbW90ZSArICcvJyA6XG4gICAgICB0ZW1wRGlyZWN0b3J5ICsgJy8nICsgc2hvcnRIYXNoKHNlbGYuY29uZmlnLmhvc3QgKyBzZWxmLmNvbmZpZy5uYW1lKSArICcvJyArIHNlbGYuY29uZmlnLmhvc3QgKyAnLycpLnJlcGxhY2UoL1xcLysvZywgUGF0aC5zZXApO1xuICAgIGxldCBmaWxlID0gcGF0aCArIFBhdGguc2VwICsgJy5jYWNoZSc7XG5cbiAgICBpZiAoIWNyZWF0ZUZpbGUgJiYgIUZpbGVTeXN0ZW0uZXhpc3RzU3luYyhmaWxlKSkgcmV0dXJuO1xuXG4gICAgbGV0IGNhY2hlID0ge1xuICAgICAgcGF0aHM6IHNlbGYucGF0aHMsXG4gICAgICBpdGVtczogc2VsZi5pdGVtcyxcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIEZpbGVTeXN0ZW0ud3JpdGVGaWxlU3luYyhmaWxlLCBKU09OLnN0cmluZ2lmeShjYWNoZSkpO1xuICAgIH0gY2F0Y2ggKGV4KSB7fVxuICB9XG5cbiAgbG9hZENhY2hlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYubG9hZFRhc2spIHJldHVybiB0cnVlO1xuXG4gICAgbGV0IHBhdGggPSAoKHNlbGYuY29uZmlnLnJlbW90ZSkgP1xuICAgICAgdGVtcERpcmVjdG9yeSArICcvJyArIHNob3J0SGFzaChzZWxmLmNvbmZpZy5ob3N0ICsgc2VsZi5jb25maWcubmFtZSkgKyAnLycgKyBzZWxmLmNvbmZpZy5ob3N0ICsgJy8nICsgc2VsZi5jb25maWcucmVtb3RlICsgJy8nIDpcbiAgICAgIHRlbXBEaXJlY3RvcnkgKyAnLycgKyBzaG9ydEhhc2goc2VsZi5jb25maWcuaG9zdCArIHNlbGYuY29uZmlnLm5hbWUpICsgJy8nICsgc2VsZi5jb25maWcuaG9zdCArICcvJykucmVwbGFjZSgvXFwvKy9nLCBQYXRoLnNlcCk7XG4gICAgbGV0IGZpbGUgPSBwYXRoICsgUGF0aC5zZXAgKyAnLmNhY2hlJztcblxuICAgIHRyeSB7XG4gICAgICBpZiAoRmlsZVN5c3RlbS5leGlzdHNTeW5jKGZpbGUpKSB7XG4gICAgICAgIGxldCB0bXAgPSBGaWxlU3lzdGVtLnJlYWRGaWxlU3luYyhmaWxlKTtcbiAgICAgICAgY2FjaGUgPSBKU09OLnBhcnNlKHRtcCk7XG4gICAgICAgIHNlbGYucGF0aHMgPSBjYWNoZS5wYXRocztcbiAgICAgICAgc2VsZi5pdGVtcyA9IGNhY2hlLml0ZW1zO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge31cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkZWxldGVDYWNoZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwYXRoID0gKChzZWxmLmNvbmZpZy5yZW1vdGUpID9cbiAgICAgIHRlbXBEaXJlY3RvcnkgKyAnLycgKyBzaG9ydEhhc2goc2VsZi5jb25maWcuaG9zdCArIHNlbGYuY29uZmlnLm5hbWUpICsgJy8nICsgc2VsZi5jb25maWcuaG9zdCArICcvJyArIHNlbGYuY29uZmlnLnJlbW90ZSArICcvJyA6XG4gICAgICB0ZW1wRGlyZWN0b3J5ICsgJy8nICsgc2hvcnRIYXNoKHNlbGYuY29uZmlnLmhvc3QgKyBzZWxmLmNvbmZpZy5uYW1lKSArICcvJyArIHNlbGYuY29uZmlnLmhvc3QgKyAnLycpLnJlcGxhY2UoL1xcLysvZywgUGF0aC5zZXApO1xuICAgIGxldCBmaWxlID0gcGF0aCArIFBhdGguc2VwICsgJy5jYWNoZSc7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKEZpbGVTeXN0ZW0uZXhpc3RzU3luYyhmaWxlKSkge1xuICAgICAgICBGaWxlU3lzdGVtLnVubGlua1N5bmMoZmlsZSk7XG4gICAgICAgIHNlbGYucGF0aHMgPSBbXTtcbiAgICAgICAgc2VsZi5pdGVtcyA9IFtdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgc2VsZi5wYXRocyA9IFtdO1xuICAgICAgc2VsZi5pdGVtcyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkZEZpbGUocmVsYXRpdmVQYXRoLCBzaXplID0gMCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLml0ZW1zKSByZXR1cm47XG4gICAgaWYgKCFzZWxmLmxvYWRUYXNrICYmICFzZWxmLmxvYWRDYWNoZSgpKSByZXR1cm47XG5cbiAgICBsZXQgZmlsZSA9IGJhc2VuYW1lKHJlbGF0aXZlUGF0aCk7XG4gICAgc2VsZi5pdGVtcy5wdXNoKHsgZmlsZTogZmlsZSwgZGlyZWN0b3J5OiBkaXJuYW1lKHJlbGF0aXZlUGF0aCksIHJlbGF0aXZlUGF0aDogcmVsYXRpdmVQYXRoLCBzaXplOiBzaXplIH0pO1xuICAgIHNlbGYuc3RvcmVDYWNoZSgpO1xuICAgIHNlbGYuZW1pdCgnZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHNlbGYuaXRlbXMpO1xuICB9XG5cbiAgcmVuYW1lRmlsZShvbGRSZWxhdGl2ZVBhdGgsIG5ld1JlbGF0aXZlUGF0aCwgc2l6ZSA9IDApIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5pdGVtcykgcmV0dXJuO1xuICAgIGlmICghc2VsZi5sb2FkVGFzayAmJiAhc2VsZi5sb2FkQ2FjaGUoKSkgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIG9sZFxuICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0ucmVsYXRpdmVQYXRoICE9IG9sZFJlbGF0aXZlUGF0aDtcbiAgICB9KTtcblxuICAgIC8vIEFkZCBuZXdcbiAgICBzZWxmLml0ZW1zLnB1c2goeyBmaWxlOiBiYXNlbmFtZShuZXdSZWxhdGl2ZVBhdGgpLCBkaXJlY3Rvcnk6IGRpcm5hbWUobmV3UmVsYXRpdmVQYXRoKSwgcmVsYXRpdmVQYXRoOiBuZXdSZWxhdGl2ZVBhdGgsIHNpemU6IHNpemUgfSk7XG4gICAgc2VsZi5zdG9yZUNhY2hlKCk7XG4gICAgc2VsZi5lbWl0KCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6dXBkYXRlJywgc2VsZi5pdGVtcyk7XG4gIH1cblxuICBkZWxldGVGaWxlKHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLml0ZW1zKSByZXR1cm47XG4gICAgaWYgKCFzZWxmLmxvYWRUYXNrICYmICFzZWxmLmxvYWRDYWNoZSgpKSByZXR1cm47XG5cbiAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLnJlbGF0aXZlUGF0aCAhPSByZWxhdGl2ZVBhdGg7XG4gICAgfSk7XG4gICAgc2VsZi5zdG9yZUNhY2hlKCk7XG4gICAgc2VsZi5lbWl0KCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6dXBkYXRlJywgc2VsZi5pdGVtcyk7XG4gIH1cblxuICByZWZyZXNoRGlyZWN0b3J5KGRpcmVjdG9yeSwgZmlsZXMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5pdGVtcyB8fCAhZmlsZXMpIHJldHVybjtcbiAgICBpZiAoIXNlbGYubG9hZFRhc2sgJiYgIXNlbGYubG9hZENhY2hlKCkpIHJldHVybjtcblxuICAgIC8vIFJlbW92ZSBvbGQgZmlsZXMgaW4gc2FtZSBkaXJlY3RvcnlcbiAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmRpcmVjdG9yeSAhPSBkaXJlY3Rvcnk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgbmV3IGZpbGVzIGZvciBzYW1lIGRpcmVjdG9yeVxuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIHNlbGYuaXRlbXMucHVzaCh7IGZpbGU6IGZpbGUubmFtZSwgZGlyZWN0b3J5OiBkaXJlY3RvcnksIHJlbGF0aXZlUGF0aDogZGlyZWN0b3J5ICsgZmlsZS5uYW1lLCBzaXplOiBmaWxlLnNpemUgfSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnN0b3JlQ2FjaGUoKTtcbiAgICBzZWxmLmVtaXQoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTp1cGRhdGUnLCBzZWxmLml0ZW1zKTtcbiAgfVxuXG4gIHJlbmFtZURpcmVjdG9yeShvbGRSZWxhdGl2ZVBhdGgsIG5ld1JlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLml0ZW1zKSByZXR1cm47XG4gICAgaWYgKCFzZWxmLmxvYWRUYXNrICYmICFzZWxmLmxvYWRDYWNoZSgpKSByZXR1cm47XG5cbiAgICAvLyBnZXQgZmlsZXNcbiAgICBsZXQgaXRlbXMgPSBzZWxmLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uZGlyZWN0b3J5LnN0YXJ0c1dpdGgob2xkUmVsYXRpdmVQYXRoKTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBmaWxlcyBpbiBkaXJlY3RvcnlcbiAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhaXRlbS5kaXJlY3Rvcnkuc3RhcnRzV2l0aChvbGRSZWxhdGl2ZVBhdGgpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkIG5ldyBmaWxlcyBmb3IgZGlyZWN0b3J5XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgc2VsZi5pdGVtcy5wdXNoKHsgZmlsZTogaXRlbS5maWxlLCBkaXJlY3Rvcnk6IGl0ZW0uZGlyZWN0b3J5LnJlcGxhY2Uob2xkUmVsYXRpdmVQYXRoLCBuZXdSZWxhdGl2ZVBhdGgpLCByZWxhdGl2ZVBhdGg6IGl0ZW0ucmVsYXRpdmVQYXRoLnJlcGxhY2Uob2xkUmVsYXRpdmVQYXRoLCBuZXdSZWxhdGl2ZVBhdGgpLCBzaXplOiBpdGVtLnNpemUgfSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnN0b3JlQ2FjaGUoKTtcbiAgICBzZWxmLmVtaXQoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTp1cGRhdGUnLCBzZWxmLml0ZW1zKTtcbiAgfVxuXG4gIGRlbGV0ZURpcmVjdG9yeShyZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5pdGVtcykgcmV0dXJuO1xuICAgIGlmICghc2VsZi5sb2FkVGFzayAmJiAhc2VsZi5sb2FkQ2FjaGUoKSkgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIGZpbGVzIGluIGRpcmVjdG9yeVxuICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuICFpdGVtLmRpcmVjdG9yeS5zdGFydHNXaXRoKHJlbGF0aXZlUGF0aCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnN0b3JlQ2FjaGUoKTtcbiAgICBzZWxmLmVtaXQoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTp1cGRhdGUnLCBzZWxmLml0ZW1zKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRlckl0ZW1zQ2FjaGU7XG4iXX0=