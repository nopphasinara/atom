var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperHelperJs = require('./../helper/helper.js');

var _helperFormatJs = require('./../helper/format.js');

var _helperFinderItemsCacheJs = require('./../helper/finder-items-cache.js');

var _helperFinderItemsCacheJs2 = _interopRequireDefault(_helperFinderItemsCacheJs);

var _connectorsConnectorJs = require('./../connectors/connector.js');

var _connectorsConnectorJs2 = _interopRequireDefault(_connectorsConnectorJs);

var _directoryViewJs = require('./directory-view.js');

var _directoryViewJs2 = _interopRequireDefault(_directoryViewJs);

var _fileViewJs = require('./file-view.js');

var _fileViewJs2 = _interopRequireDefault(_fileViewJs);

'use babel';

var shortHash = require('short-hash');
var md5 = require('md5');
var Path = require('path');
var tempDirectory = require('os').tmpdir();

var ServerView = (function (_View) {
  _inherits(ServerView, _View);

  function ServerView() {
    _classCallCheck(this, ServerView);

    _get(Object.getPrototypeOf(ServerView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ServerView, [{
    key: 'serialize',
    value: function serialize() {
      var self = this;

      return {
        id: self.id,
        config: self.config,
        name: self.name,
        path: self.getPath(false)
      };
    }
  }, {
    key: 'initialize',
    value: function initialize(config) {
      var self = this;

      self.config = config;
      self.expanded = false;
      self.finderItemsCache = null;

      self.name = self.config.name ? self.config.name : self.config.host;
      self.id = self.getId();

      self.label.text(self.name);
      self.label.addClass('icon-file-symlink-directory');
      self.addClass('project-root');

      if (typeof self.config.temp != 'undefined' && self.config.temp) {
        self.addClass('temp');
      }

      self.attr('data-name', '/');
      self.attr('data-host', self.config.host);
      self.attr('id', self.id);

      self.connector = new _connectorsConnectorJs2['default'](self.config);

      // Events
      self.on('click', function (e) {
        e.stopPropagation();
        self.toggle();
      });
      self.on('dblclick', function (e) {
        e.stopPropagation();
      });

      // Drag & Drop
      self.on('dragstart', function (e) {
        return self.onDragStart(e);
      });
      self.on('dragenter', function (e) {
        return self.onDragEnter(e);
      });
      self.on('dragleave', function (e) {
        return self.onDragLeave(e);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      if (self.finderItemsCache) {
        self.finderItemsCache = null;
      }

      this.remove();
    }
  }, {
    key: 'getId',
    value: function getId() {
      var self = this;

      var object = {
        config: self.config,
        name: self.name,
        path: self.getPath(false)
      };

      return 'ftp-remote-edit-' + md5(JSON.stringify(object));
    }
  }, {
    key: 'getRoot',
    value: function getRoot() {
      var self = this;

      return self;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      if (self.config.remote && useRemote) {
        return (0, _helperFormatJs.unleadingslashit)((0, _helperFormatJs.untrailingslashit)((0, _helperFormatJs.normalize)(self.config.remote)));
      } else {
        return '/';
      }
    }
  }, {
    key: 'getLocalPath',
    value: function getLocalPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      if (self.config.remote && useRemote) {
        return (0, _helperFormatJs.untrailingslashit)((0, _helperFormatJs.normalize)(tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host + '/' + self.config.remote, Path.sep), Path.sep);
      } else {
        return (0, _helperFormatJs.untrailingslashit)((0, _helperFormatJs.normalize)(tempDirectory + '/' + shortHash(self.config.host + self.config.name) + '/' + self.config.host, Path.sep), Path.sep);
      }
    }
  }, {
    key: 'getConnector',
    value: function getConnector() {
      var self = this;

      return self.connector;
    }
  }, {
    key: 'getFinderCache',
    value: function getFinderCache() {
      var self = this;

      if (self.finderItemsCache) return self.finderItemsCache;

      self.finderItemsCache = new _helperFinderItemsCacheJs2['default'](self.config, self.getConnector());

      return self.finderItemsCache;
    }
  }, {
    key: 'addSyncIcon',
    value: function addSyncIcon() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      if (!element) element = self;
      if (!element.label) return;

      element.label.addClass('icon-sync').addClass('spin');
    }
  }, {
    key: 'removeSyncIcon',
    value: function removeSyncIcon() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      if (!element) element = self;
      if (!element.label) return;

      element.label.removeClass('icon-sync').removeClass('spin');
    }
  }, {
    key: 'expand',
    value: function expand() {
      var _this = this;

      var self = this;

      var promise = new Promise(function (resolve, reject) {
        if (self.isExpanded()) return resolve(true);

        self.addSyncIcon();
        self.getConnector().listDirectory(self.getPath()).then(function (list) {
          self.expanded = true;
          self.addClass('expanded').removeClass('collapsed');
          self.removeSyncIcon();

          self.entries.children().detach();

          var directories = list.filter(function (item) {
            return item.type === 'd' && item.name !== '.' && item.name !== '..';
          });

          var files = list.filter(function (item) {
            return item.type === '-';
          });

          directories.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
          });

          files.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
          });

          var entries = [];

          directories.forEach(function (element) {
            var pathOnFileSystem = (0, _helperFormatJs.normalize)(self.getPath() + element.name, Path.sep);

            if (!(0, _helperHelperJs.isPathIgnored)(pathOnFileSystem)) {
              var li = new _directoryViewJs2['default'](self, {
                name: element.name,
                rights: element.rights
              });
              entries.push(li);
            }
          }, _this);

          files.forEach(function (element) {
            var pathOnFileSystem = (0, _helperFormatJs.normalize)(self.getPath() + element.name, Path.sep);

            if (!(0, _helperHelperJs.isPathIgnored)(pathOnFileSystem)) {
              var li = new _fileViewJs2['default'](self, {
                name: element.name,
                size: element.size,
                rights: element.rights
              });
              entries.push(li);
            }
          }, _this);

          // Refresh cache
          self.getFinderCache().refreshDirectory(self.getPath(false), files);

          if (!atom.config.get('ftp-remote-edit.tree.sortFoldersBeforeFiles')) {
            entries.sort(function (a, b) {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            });
          }

          entries.forEach(function (entry) {
            self.entries.append(entry);
          });

          self.select();

          resolve(true);
        })['catch'](function (err) {
          self.collapse();
          (0, _helperHelperJs.showMessage)(err.message, 'error');
          reject(err);
        });
      });

      return promise;
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      var self = this;

      self.connector.destroy();

      self.expanded = false;
      self.addClass('collapsed').removeClass('expanded');
      self.removeSyncIcon();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var self = this;

      if (self.isExpanded()) {
        self.collapse();
      } else {
        self.expand()['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err.message, 'error');
        });
      }
    }
  }, {
    key: 'select',
    value: function select() {
      var deselectAllOther = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      if (deselectAllOther) {
        elementsToDeselect = (0, _atomSpacePenViews.$)('.ftp-remote-edit-view .selected');
        for (i = 0, len = elementsToDeselect.length; i < len; i++) {
          selected = elementsToDeselect[i];
          (0, _atomSpacePenViews.$)(selected).removeClass('selected');
        }
      }

      if (!self.hasClass('selected')) {
        self.addClass('selected');
      }
    }
  }, {
    key: 'deselect',
    value: function deselect() {
      var self = this;

      if (self.hasClass('selected')) {
        self.removeClass('selected');
      }
    }
  }, {
    key: 'isExpanded',
    value: function isExpanded() {
      var self = this;

      return self.expanded;
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      var self = this;

      return true;
    }
  }, {
    key: 'refresh',
    value: function refresh(elementToRefresh) {
      var self = this;

      var sortFoldersBeforeFiles = atom.config.get('ftp-remote-edit.tree.sortFoldersBeforeFiles');
      if (elementToRefresh.entries[0].childNodes) {
        var e = elementToRefresh.entries[0].childNodes;
        [].slice.call(e).sort(function (a, b) {
          if (sortFoldersBeforeFiles) {
            if (a.classList.contains('directory') && b.classList.contains('file')) return -1;
            if (a.classList.contains('file') && b.classList.contains('directory')) return 1;
            if (a.spacePenView.name < b.spacePenView.name) return -1;
            if (a.spacePenView.name > b.spacePenView.name) return 1;
          } else {
            if (a.spacePenView.name < b.spacePenView.name) return -1;
            if (a.spacePenView.name > b.spacePenView.name) return 1;
          }
          return 0;
        }).forEach(function (val, index) {
          self.entries.append(val);
        });
      }
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e) {
      var self = this;

      if (entry = e.target.closest('.entry.server')) {
        e.stopPropagation();
        initialPath = self.getPath(true);

        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("initialType", "server");
        } else if (e.originalEvent.dataTransfer) {
          e.originalEvent.dataTransfer.effectAllowed = "move";
          e.originalEvent.dataTransfer.setData("initialType", "server");
        }
      }
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(e) {
      var self = this;

      var entry = undefined,
          initialType = undefined;

      if (entry = e.target.closest('.entry.server')) {
        e.stopPropagation();

        if (e.dataTransfer) {
          initialType = e.dataTransfer.getData("initialType");
        } else {
          initialType = e.originalEvent.dataTransfer.getData("initialType");
        }
        if (initialType == "server") {
          return;
        }

        (0, _atomSpacePenViews.$)(entry).view().select();
      }
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e) {
      var self = this;

      var entry = undefined,
          initialType = undefined;

      if (entry = e.target.closest('.entry.server')) {
        e.stopPropagation();

        if (e.dataTransfer) {
          initialType = e.dataTransfer.getData("initialType");
        } else {
          initialType = e.originalEvent.dataTransfer.getData("initialType");
        }

        if (initialType == "server") {
          return;
        }

        (0, _atomSpacePenViews.$)(entry).view().deselect();
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      return this.li({
        'class': 'server entry list-nested-item project-root collapsed'
      }, function () {
        _this2.div({
          'class': 'header list-item project-root-header',
          outlet: 'header'
        }, function () {
          return _this2.span({
            'class': 'name icon',
            outlet: 'label'
          });
        });
        _this2.ol({
          'class': 'entries list-tree',
          outlet: 'entries'
        });
      });
    }
  }]);

  return ServerView;
})(_atomSpacePenViews.View);

module.exports = ServerView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9zZXJ2ZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUV3QixzQkFBc0I7OzhCQUNILHVCQUF1Qjs7OEJBQ0gsdUJBQXVCOzt3Q0FDekQsbUNBQW1DOzs7O3FDQUMxQyw4QkFBOEI7Ozs7K0JBQzFCLHFCQUFxQjs7OzswQkFDMUIsZ0JBQWdCOzs7O0FBUnJDLFdBQVcsQ0FBQzs7QUFVWixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7O0lBRXZDLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FvQkwscUJBQUc7QUFDVixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLGFBQU87QUFDTCxVQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDWCxjQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsWUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO09BQzFCLENBQUM7S0FDSDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdEIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7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Q0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JELE1BQU07QUFDTCxxQkFBVyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNuRTs7QUFFRCxZQUFJLFdBQVcsSUFBSSxRQUFRLEVBQUU7QUFDM0IsaUJBQU87U0FDUjs7QUFFRCxrQ0FBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUM1QjtLQUNGOzs7V0F4WGEsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNiLGlCQUFPLHNEQUFzRDtPQUM5RCxFQUFFLFlBQU07QUFDUCxlQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLHNDQUFzQztBQUM3QyxnQkFBTSxFQUFFLFFBQVE7U0FDakIsRUFBRTtpQkFBTSxPQUFLLElBQUksQ0FBQztBQUNqQixxQkFBTyxXQUFXO0FBQ2xCLGtCQUFNLEVBQUUsT0FBTztXQUNoQixDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ0osZUFBSyxFQUFFLENBQUM7QUFDTixtQkFBTyxtQkFBbUI7QUFDMUIsZ0JBQU0sRUFBRSxTQUFTO1NBQ2xCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0FsQkcsVUFBVTs7O0FBNlhoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvdmlld3Mvc2VydmVyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgJCwgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IHNob3dNZXNzYWdlLCBpc1BhdGhJZ25vcmVkIH0gZnJvbSAnLi8uLi9oZWxwZXIvaGVscGVyLmpzJztcbmltcG9ydCB7IHVubGVhZGluZ3NsYXNoaXQsIHVudHJhaWxpbmdzbGFzaGl0LCBub3JtYWxpemUgfSBmcm9tICcuLy4uL2hlbHBlci9mb3JtYXQuanMnO1xuaW1wb3J0IEZpbmRlckl0ZW1zQ2FjaGUgZnJvbSAnLi8uLi9oZWxwZXIvZmluZGVyLWl0ZW1zLWNhY2hlLmpzJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi8uLi9jb25uZWN0b3JzL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgRGlyZWN0b3J5VmlldyBmcm9tICcuL2RpcmVjdG9yeS12aWV3LmpzJztcbmltcG9ydCBGaWxlVmlldyBmcm9tICcuL2ZpbGUtdmlldy5qcyc7XG5cbmNvbnN0IHNob3J0SGFzaCA9IHJlcXVpcmUoJ3Nob3J0LWhhc2gnKTtcbmNvbnN0IG1kNSA9IHJlcXVpcmUoJ21kNScpO1xuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHRlbXBEaXJlY3RvcnkgPSByZXF1aXJlKCdvcycpLnRtcGRpcigpO1xuXG5jbGFzcyBTZXJ2ZXJWaWV3IGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubGkoe1xuICAgICAgY2xhc3M6ICdzZXJ2ZXIgZW50cnkgbGlzdC1uZXN0ZWQtaXRlbSBwcm9qZWN0LXJvb3QgY29sbGFwc2VkJyxcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAnaGVhZGVyIGxpc3QtaXRlbSBwcm9qZWN0LXJvb3QtaGVhZGVyJyxcbiAgICAgICAgb3V0bGV0OiAnaGVhZGVyJyxcbiAgICAgIH0sICgpID0+IHRoaXMuc3Bhbih7XG4gICAgICAgIGNsYXNzOiAnbmFtZSBpY29uJyxcbiAgICAgICAgb3V0bGV0OiAnbGFiZWwnLFxuICAgICAgfSkpO1xuICAgICAgdGhpcy5vbCh7XG4gICAgICAgIGNsYXNzOiAnZW50cmllcyBsaXN0LXRyZWUnLFxuICAgICAgICBvdXRsZXQ6ICdlbnRyaWVzJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBzZWxmLmlkLFxuICAgICAgY29uZmlnOiBzZWxmLmNvbmZpZyxcbiAgICAgIG5hbWU6IHNlbGYubmFtZSxcbiAgICAgIHBhdGg6IHNlbGYuZ2V0UGF0aChmYWxzZSksXG4gICAgfTtcbiAgfVxuXG4gIGluaXRpYWxpemUoY29uZmlnKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbmZpZyA9IGNvbmZpZztcbiAgICBzZWxmLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgc2VsZi5maW5kZXJJdGVtc0NhY2hlID0gbnVsbDtcblxuICAgIHNlbGYubmFtZSA9IHNlbGYuY29uZmlnLm5hbWUgPyBzZWxmLmNvbmZpZy5uYW1lIDogc2VsZi5jb25maWcuaG9zdDtcbiAgICBzZWxmLmlkID0gc2VsZi5nZXRJZCgpO1xuXG4gICAgc2VsZi5sYWJlbC50ZXh0KHNlbGYubmFtZSk7XG4gICAgc2VsZi5sYWJlbC5hZGRDbGFzcygnaWNvbi1maWxlLXN5bWxpbmstZGlyZWN0b3J5Jyk7XG4gICAgc2VsZi5hZGRDbGFzcygncHJvamVjdC1yb290Jyk7XG5cbiAgICBpZiAodHlwZW9mIHNlbGYuY29uZmlnLnRlbXAgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5jb25maWcudGVtcCkge1xuICAgICAgc2VsZi5hZGRDbGFzcygndGVtcCcpO1xuICAgIH1cblxuICAgIHNlbGYuYXR0cignZGF0YS1uYW1lJywgJy8nKTtcbiAgICBzZWxmLmF0dHIoJ2RhdGEtaG9zdCcsIHNlbGYuY29uZmlnLmhvc3QpO1xuICAgIHNlbGYuYXR0cignaWQnLCBzZWxmLmlkKTtcblxuICAgIHNlbGYuY29ubmVjdG9yID0gbmV3IENvbm5lY3RvcihzZWxmLmNvbmZpZyk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICB9KTtcbiAgICBzZWxmLm9uKCdkYmxjbGljaycsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pO1xuXG4gICAgLy8gRHJhZyAmIERyb3BcbiAgICBzZWxmLm9uKCdkcmFnc3RhcnQnLCAoZSkgPT4gc2VsZi5vbkRyYWdTdGFydChlKSk7XG4gICAgc2VsZi5vbignZHJhZ2VudGVyJywgKGUpID0+IHNlbGYub25EcmFnRW50ZXIoZSkpO1xuICAgIHNlbGYub24oJ2RyYWdsZWF2ZScsIChlKSA9PiBzZWxmLm9uRHJhZ0xlYXZlKGUpKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5maW5kZXJJdGVtc0NhY2hlKSB7XG4gICAgICBzZWxmLmZpbmRlckl0ZW1zQ2FjaGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBvYmplY3QgPSB7XG4gICAgICBjb25maWc6IHNlbGYuY29uZmlnLFxuICAgICAgbmFtZTogc2VsZi5uYW1lLFxuICAgICAgcGF0aDogc2VsZi5nZXRQYXRoKGZhbHNlKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuICdmdHAtcmVtb3RlLWVkaXQtJyArIG1kNShKU09OLnN0cmluZ2lmeShvYmplY3QpKTtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGdldFBhdGgodXNlUmVtb3RlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuY29uZmlnLnJlbW90ZSAmJiB1c2VSZW1vdGUpIHtcbiAgICAgIHJldHVybiB1bmxlYWRpbmdzbGFzaGl0KHVudHJhaWxpbmdzbGFzaGl0KG5vcm1hbGl6ZShzZWxmLmNvbmZpZy5yZW1vdGUpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLyc7XG4gICAgfVxuICB9XG5cbiAgZ2V0TG9jYWxQYXRoKHVzZVJlbW90ZSA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmNvbmZpZy5yZW1vdGUgJiYgdXNlUmVtb3RlKSB7XG4gICAgICByZXR1cm4gdW50cmFpbGluZ3NsYXNoaXQobm9ybWFsaXplKHRlbXBEaXJlY3RvcnkgKyAnLycgKyBzaG9ydEhhc2goc2VsZi5jb25maWcuaG9zdCArIHNlbGYuY29uZmlnLm5hbWUpICsgJy8nICsgc2VsZi5jb25maWcuaG9zdCArICcvJyArIHNlbGYuY29uZmlnLnJlbW90ZSwgUGF0aC5zZXApLCBQYXRoLnNlcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bnRyYWlsaW5nc2xhc2hpdChub3JtYWxpemUodGVtcERpcmVjdG9yeSArICcvJyArIHNob3J0SGFzaChzZWxmLmNvbmZpZy5ob3N0ICsgc2VsZi5jb25maWcubmFtZSkgKyAnLycgKyBzZWxmLmNvbmZpZy5ob3N0LCBQYXRoLnNlcCksIFBhdGguc2VwKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb25uZWN0b3IoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZi5jb25uZWN0b3I7XG4gIH1cblxuICBnZXRGaW5kZXJDYWNoZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmZpbmRlckl0ZW1zQ2FjaGUpIHJldHVybiBzZWxmLmZpbmRlckl0ZW1zQ2FjaGU7XG5cbiAgICBzZWxmLmZpbmRlckl0ZW1zQ2FjaGUgPSBuZXcgRmluZGVySXRlbXNDYWNoZShzZWxmLmNvbmZpZywgc2VsZi5nZXRDb25uZWN0b3IoKSk7XG5cbiAgICByZXR1cm4gc2VsZi5maW5kZXJJdGVtc0NhY2hlO1xuICB9XG5cbiAgYWRkU3luY0ljb24oZWxlbWVudCA9IG51bGwpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghZWxlbWVudCkgZWxlbWVudCA9IHNlbGY7XG4gICAgaWYgKCFlbGVtZW50LmxhYmVsKSByZXR1cm47XG5cbiAgICBlbGVtZW50LmxhYmVsLmFkZENsYXNzKCdpY29uLXN5bmMnKS5hZGRDbGFzcygnc3BpbicpO1xuICB9XG5cbiAgcmVtb3ZlU3luY0ljb24oZWxlbWVudCA9IG51bGwpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghZWxlbWVudCkgZWxlbWVudCA9IHNlbGY7XG4gICAgaWYgKCFlbGVtZW50LmxhYmVsKSByZXR1cm47XG5cbiAgICBlbGVtZW50LmxhYmVsLnJlbW92ZUNsYXNzKCdpY29uLXN5bmMnKS5yZW1vdmVDbGFzcygnc3BpbicpO1xuICB9XG5cbiAgZXhwYW5kKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoc2VsZi5pc0V4cGFuZGVkKCkpIHJldHVybiByZXNvbHZlKHRydWUpO1xuXG4gICAgICBzZWxmLmFkZFN5bmNJY29uKCk7XG4gICAgICBzZWxmLmdldENvbm5lY3RvcigpLmxpc3REaXJlY3Rvcnkoc2VsZi5nZXRQYXRoKCkpLnRoZW4oKGxpc3QpID0+IHtcbiAgICAgICAgc2VsZi5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgIHNlbGYuYWRkQ2xhc3MoJ2V4cGFuZGVkJykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICBzZWxmLnJlbW92ZVN5bmNJY29uKCk7XG5cbiAgICAgICAgc2VsZi5lbnRyaWVzLmNoaWxkcmVuKCkuZGV0YWNoKCk7XG5cbiAgICAgICAgbGV0IGRpcmVjdG9yaWVzID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAnZCcgJiYgaXRlbS5uYW1lICE9PSAnLicgJiYgaXRlbS5uYW1lICE9PSAnLi4nO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZmlsZXMgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICctJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlyZWN0b3JpZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGlmIChhLm5hbWUudG9Mb3dlckNhc2UoKSA8IGIubmFtZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGEubmFtZS50b0xvd2VyQ2FzZSgpID4gYi5uYW1lLnRvTG93ZXJDYXNlKCkpIHJldHVybiAxO1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBmaWxlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgaWYgKGEubmFtZS50b0xvd2VyQ2FzZSgpIDwgYi5uYW1lLnRvTG93ZXJDYXNlKCkpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPiBiLm5hbWUudG9Mb3dlckNhc2UoKSkgcmV0dXJuIDE7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBlbnRyaWVzID0gW107XG5cbiAgICAgICAgZGlyZWN0b3JpZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUoc2VsZi5nZXRQYXRoKCkgKyBlbGVtZW50Lm5hbWUsIFBhdGguc2VwKTtcblxuICAgICAgICAgIGlmICghaXNQYXRoSWdub3JlZChwYXRoT25GaWxlU3lzdGVtKSkge1xuICAgICAgICAgICAgbGV0IGxpID0gbmV3IERpcmVjdG9yeVZpZXcoc2VsZiwge1xuICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICAgIHJpZ2h0czogZWxlbWVudC5yaWdodHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZW50cmllcy5wdXNoKGxpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIGZpbGVzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXRoT25GaWxlU3lzdGVtID0gbm9ybWFsaXplKHNlbGYuZ2V0UGF0aCgpICsgZWxlbWVudC5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICAgICAgICBpZiAoIWlzUGF0aElnbm9yZWQocGF0aE9uRmlsZVN5c3RlbSkpIHtcbiAgICAgICAgICAgIGxldCBsaSA9IG5ldyBGaWxlVmlldyhzZWxmLCB7XG4gICAgICAgICAgICAgIG5hbWU6IGVsZW1lbnQubmFtZSxcbiAgICAgICAgICAgICAgc2l6ZTogZWxlbWVudC5zaXplLFxuICAgICAgICAgICAgICByaWdodHM6IGVsZW1lbnQucmlnaHRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVudHJpZXMucHVzaChsaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgIHNlbGYuZ2V0RmluZGVyQ2FjaGUoKS5yZWZyZXNoRGlyZWN0b3J5KHNlbGYuZ2V0UGF0aChmYWxzZSksIGZpbGVzKTtcblxuICAgICAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc29ydEZvbGRlcnNCZWZvcmVGaWxlcycpKSB7XG4gICAgICAgICAgZW50cmllcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPCBiLm5hbWUudG9Mb3dlckNhc2UoKSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEubmFtZS50b0xvd2VyQ2FzZSgpID4gYi5uYW1lLnRvTG93ZXJDYXNlKCkpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgc2VsZi5lbnRyaWVzLmFwcGVuZChlbnRyeSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuc2VsZWN0KCk7XG5cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2VsZi5jb2xsYXBzZSgpO1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNvbGxhcHNlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5jb25uZWN0b3IuZGVzdHJveSgpO1xuXG4gICAgc2VsZi5leHBhbmRlZCA9IGZhbHNlO1xuICAgIHNlbGYuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgIHNlbGYucmVtb3ZlU3luY0ljb24oKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmlzRXhwYW5kZWQoKSkge1xuICAgICAgc2VsZi5jb2xsYXBzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmV4cGFuZCgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzZWxlY3QoZGVzZWxlY3RBbGxPdGhlciA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChkZXNlbGVjdEFsbE90aGVyKSB7XG4gICAgICBlbGVtZW50c1RvRGVzZWxlY3QgPSAkKCcuZnRwLXJlbW90ZS1lZGl0LXZpZXcgLnNlbGVjdGVkJyk7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbGVtZW50c1RvRGVzZWxlY3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2VsZWN0ZWQgPSBlbGVtZW50c1RvRGVzZWxlY3RbaV07XG4gICAgICAgICQoc2VsZWN0ZWQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc2VsZi5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuICAgICAgc2VsZi5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICBzZWxmLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGlzRXhwYW5kZWQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZi5leHBhbmRlZDtcbiAgfVxuXG4gIGlzVmlzaWJsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVmcmVzaChlbGVtZW50VG9SZWZyZXNoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgc29ydEZvbGRlcnNCZWZvcmVGaWxlcyA9IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc29ydEZvbGRlcnNCZWZvcmVGaWxlcycpO1xuICAgIGlmIChlbGVtZW50VG9SZWZyZXNoLmVudHJpZXNbMF0uY2hpbGROb2Rlcykge1xuICAgICAgbGV0IGUgPSBlbGVtZW50VG9SZWZyZXNoLmVudHJpZXNbMF0uY2hpbGROb2RlcztcbiAgICAgIFtdLnNsaWNlLmNhbGwoZSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoc29ydEZvbGRlcnNCZWZvcmVGaWxlcykge1xuICAgICAgICAgIGlmIChhLmNsYXNzTGlzdC5jb250YWlucygnZGlyZWN0b3J5JykgJiYgYi5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUnKSkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChhLmNsYXNzTGlzdC5jb250YWlucygnZmlsZScpICYmIGIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXJlY3RvcnknKSkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGEuc3BhY2VQZW5WaWV3Lm5hbWUgPCBiLnNwYWNlUGVuVmlldy5uYW1lKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGEuc3BhY2VQZW5WaWV3Lm5hbWUgPiBiLnNwYWNlUGVuVmlldy5uYW1lKSByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYS5zcGFjZVBlblZpZXcubmFtZSA8IGIuc3BhY2VQZW5WaWV3Lm5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYS5zcGFjZVBlblZpZXcubmFtZSA+IGIuc3BhY2VQZW5WaWV3Lm5hbWUpIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgICBzZWxmLmVudHJpZXMuYXBwZW5kKHZhbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvbkRyYWdTdGFydChlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoZW50cnkgPSBlLnRhcmdldC5jbG9zZXN0KCcuZW50cnkuc2VydmVyJykpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpbml0aWFsUGF0aCA9IHNlbGYuZ2V0UGF0aCh0cnVlKTtcblxuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluaXRpYWxUeXBlXCIsIFwic2VydmVyXCIpO1xuICAgICAgfSBlbHNlIGlmIChlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwibW92ZVwiO1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsVHlwZVwiLCBcInNlcnZlclwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRyYWdFbnRlcihlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZW50cnksIGluaXRpYWxUeXBlO1xuXG4gICAgaWYgKGVudHJ5ID0gZS50YXJnZXQuY2xvc2VzdCgnLmVudHJ5LnNlcnZlcicpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWxUeXBlID09IFwic2VydmVyXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkKGVudHJ5KS52aWV3KCkuc2VsZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgb25EcmFnTGVhdmUoZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGVudHJ5LCBpbml0aWFsVHlwZTtcblxuICAgIGlmIChlbnRyeSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5lbnRyeS5zZXJ2ZXInKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGluaXRpYWxUeXBlID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsVHlwZVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluaXRpYWxUeXBlID09IFwic2VydmVyXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkKGVudHJ5KS52aWV3KCkuZGVzZWxlY3QoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJWaWV3O1xuIl19