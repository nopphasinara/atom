var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperHelperJs = require('./../helper/helper.js');

var _helperFormatJs = require('./../helper/format.js');

var _fileViewJs = require('./file-view.js');

var _fileViewJs2 = _interopRequireDefault(_fileViewJs);

'use babel';

var md5 = require('md5');
var Path = require('path');

var DirectoryView = (function (_View) {
  _inherits(DirectoryView, _View);

  function DirectoryView() {
    _classCallCheck(this, DirectoryView);

    _get(Object.getPrototypeOf(DirectoryView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DirectoryView, [{
    key: 'serialize',
    value: function serialize() {
      var self = this;

      return {
        id: self.id,
        config: self.config,
        name: self.name,
        rights: self.rights,
        path: self.getPath(false)
      };
    }
  }, {
    key: 'initialize',
    value: function initialize(parent, directory) {
      var self = this;

      self.parent = parent;
      self.config = parent.config;
      self.expanded = false;

      self.name = directory.name;
      self.rights = directory.rights;
      self.id = self.getId();

      // Add directory name
      self.label.text(self.name);

      // Add directory icon
      self.label.addClass('icon-file-directory');

      self.attr('data-name', self.name);
      self.attr('data-host', self.config.host);
      self.attr('id', self.id);

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

      self.remove();
    }
  }, {
    key: 'getId',
    value: function getId() {
      var self = this;

      return 'ftp-remote-edit-' + md5(self.getPath(false));
    }
  }, {
    key: 'getRoot',
    value: function getRoot() {
      var self = this;

      return self.parent.getRoot();
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      return (0, _helperFormatJs.untrailingslashit)((0, _helperFormatJs.normalize)(self.parent.getPath(useRemote) + self.name));
    }
  }, {
    key: 'getLocalPath',
    value: function getLocalPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      return (0, _helperFormatJs.untrailingslashit)((0, _helperFormatJs.normalize)(self.parent.getLocalPath(useRemote) + self.name, Path.sep), Path.sep);
    }
  }, {
    key: 'getConnector',
    value: function getConnector() {
      var self = this;

      return self.getRoot().getConnector();
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
              var li = new DirectoryView(self, {
                name: element.name,
                path: pathOnFileSystem,
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
                path: pathOnFileSystem,
                size: element.size,
                rights: element.rights
              });
              entries.push(li);
            }
          }, _this);

          // Refresh cache
          self.getRoot().getFinderCache().refreshDirectory(self.getPath(false), files);

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

      return self.parent.isExpanded() && self.expanded;
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      var self = this;

      return self.parent.isExpanded();
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

      var initialPath = undefined;

      if (entry = e.target.closest('.entry.directory')) {
        e.stopPropagation();
        initialPath = self.getPath(false);

        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("initialPath", initialPath);
          e.dataTransfer.setData("initialType", "directory");
          e.dataTransfer.setData("initialName", self.name);
        } else if (e.originalEvent.dataTransfer) {
          e.originalEvent.dataTransfer.effectAllowed = "move";
          e.originalEvent.dataTransfer.setData("initialPath", initialPath);
          e.originalEvent.dataTransfer.setData("initialType", "directory");
          e.originalEvent.dataTransfer.setData("initialName", self.name);
        }
      }
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(e) {
      var self = this;

      var entry = undefined,
          initialType = undefined;

      if (entry = e.target.closest('.entry.directory')) {
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

      if (entry = e.target.closest('.entry.directory')) {
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
        'class': 'directory entry list-nested-item collapsed'
      }, function () {
        _this2.div({
          'class': 'header list-item',
          outlet: 'header',
          tabindex: -1
        }, function () {
          return _this2.span({
            'class': 'name icon',
            outlet: 'label'
          });
        });
        _this2.ol({
          'class': 'entries list-tree',
          outlet: 'entries',
          tabindex: -1
        });
      });
    }
  }]);

  return DirectoryView;
})(_atomSpacePenViews.View);

module.exports = DirectoryView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9kaXJlY3Rvcnktdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUV3QixzQkFBc0I7OzhCQUNILHVCQUF1Qjs7OEJBQ0gsdUJBQXVCOzswQkFDakUsZ0JBQWdCOzs7O0FBTHJDLFdBQVcsQ0FBQzs7QUFPWixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUV2QixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7O1dBc0JSLHFCQUFHO0FBQ1YsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixhQUFPO0FBQ0wsVUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ1gsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQixZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7T0FDMUIsQ0FBQztLQUNIOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQzVCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDM0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQy9CLFVBQUksQ0FB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T0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7QUFDaEQsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixZQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDbEIscUJBQVcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyRCxNQUFNO0FBQ0wscUJBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkU7O0FBRUQsWUFBSSxXQUFXLElBQUksUUFBUSxFQUFFO0FBQzNCLGlCQUFPO1NBQ1I7O0FBRUQsa0NBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7T0FDNUI7S0FDRjs7O1dBbldhLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDYixpQkFBTyw0Q0FBNEM7T0FDcEQsRUFBRSxZQUFNO0FBQ1AsZUFBSyxHQUFHLENBQUM7QUFDUCxtQkFBTyxrQkFBa0I7QUFDekIsZ0JBQU0sRUFBRSxRQUFRO0FBQ2hCLGtCQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ2IsRUFBRTtpQkFBTSxPQUFLLElBQUksQ0FBQztBQUNqQixxQkFBTyxXQUFXO0FBQ2xCLGtCQUFNLEVBQUUsT0FBTztXQUNoQixDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ0osZUFBSyxFQUFFLENBQUM7QUFDTixtQkFBTyxtQkFBbUI7QUFDMUIsZ0JBQU0sRUFBRSxTQUFTO0FBQ2pCLGtCQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ2IsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQXBCRyxhQUFhOzs7QUF3V25CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9kaXJlY3Rvcnktdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyAkLCBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgc2hvd01lc3NhZ2UsIGlzUGF0aElnbm9yZWQgfSBmcm9tICcuLy4uL2hlbHBlci9oZWxwZXIuanMnO1xuaW1wb3J0IHsgdW5sZWFkaW5nc2xhc2hpdCwgdW50cmFpbGluZ3NsYXNoaXQsIG5vcm1hbGl6ZSB9IGZyb20gJy4vLi4vaGVscGVyL2Zvcm1hdC5qcyc7XG5pbXBvcnQgRmlsZVZpZXcgZnJvbSAnLi9maWxlLXZpZXcuanMnO1xuXG5jb25zdCBtZDUgPSByZXF1aXJlKCdtZDUnKTtcbmNvbnN0IFBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmNsYXNzIERpcmVjdG9yeVZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5saSh7XG4gICAgICBjbGFzczogJ2RpcmVjdG9yeSBlbnRyeSBsaXN0LW5lc3RlZC1pdGVtIGNvbGxhcHNlZCcsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2hlYWRlciBsaXN0LWl0ZW0nLFxuICAgICAgICBvdXRsZXQ6ICdoZWFkZXInLFxuICAgICAgICB0YWJpbmRleDogLTEsXG4gICAgICB9LCAoKSA9PiB0aGlzLnNwYW4oe1xuICAgICAgICBjbGFzczogJ25hbWUgaWNvbicsXG4gICAgICAgIG91dGxldDogJ2xhYmVsJyxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMub2woe1xuICAgICAgICBjbGFzczogJ2VudHJpZXMgbGlzdC10cmVlJyxcbiAgICAgICAgb3V0bGV0OiAnZW50cmllcycsXG4gICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBzZWxmLmlkLFxuICAgICAgY29uZmlnOiBzZWxmLmNvbmZpZyxcbiAgICAgIG5hbWU6IHNlbGYubmFtZSxcbiAgICAgIHJpZ2h0czogc2VsZi5yaWdodHMsXG4gICAgICBwYXRoOiBzZWxmLmdldFBhdGgoZmFsc2UpLFxuICAgIH07XG4gIH1cblxuICBpbml0aWFsaXplKHBhcmVudCwgZGlyZWN0b3J5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnBhcmVudCA9IHBhcmVudDtcbiAgICBzZWxmLmNvbmZpZyA9IHBhcmVudC5jb25maWc7XG4gICAgc2VsZi5leHBhbmRlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5uYW1lID0gZGlyZWN0b3J5Lm5hbWU7XG4gICAgc2VsZi5yaWdodHMgPSBkaXJlY3RvcnkucmlnaHRzO1xuICAgIHNlbGYuaWQgPSBzZWxmLmdldElkKCk7XG5cbiAgICAvLyBBZGQgZGlyZWN0b3J5IG5hbWVcbiAgICBzZWxmLmxhYmVsLnRleHQoc2VsZi5uYW1lKTtcblxuICAgIC8vIEFkZCBkaXJlY3RvcnkgaWNvblxuICAgIHNlbGYubGFiZWwuYWRkQ2xhc3MoJ2ljb24tZmlsZS1kaXJlY3RvcnknKTtcblxuICAgIHNlbGYuYXR0cignZGF0YS1uYW1lJywgc2VsZi5uYW1lKTtcbiAgICBzZWxmLmF0dHIoJ2RhdGEtaG9zdCcsIHNlbGYuY29uZmlnLmhvc3QpO1xuICAgIHNlbGYuYXR0cignaWQnLCBzZWxmLmlkKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIHNlbGYub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgIH0pO1xuICAgIHNlbGYub24oJ2RibGNsaWNrJywgKGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XG5cbiAgICAvLyBEcmFnICYgRHJvcFxuICAgIHNlbGYub24oJ2RyYWdzdGFydCcsIChlKSA9PiBzZWxmLm9uRHJhZ1N0YXJ0KGUpKTtcbiAgICBzZWxmLm9uKCdkcmFnZW50ZXInLCAoZSkgPT4gc2VsZi5vbkRyYWdFbnRlcihlKSk7XG4gICAgc2VsZi5vbignZHJhZ2xlYXZlJywgKGUpID0+IHNlbGYub25EcmFnTGVhdmUoZSkpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAnZnRwLXJlbW90ZS1lZGl0LScgKyBtZDUoc2VsZi5nZXRQYXRoKGZhbHNlKSk7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHNlbGYucGFyZW50LmdldFJvb3QoKTtcbiAgfVxuXG4gIGdldFBhdGgodXNlUmVtb3RlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHVudHJhaWxpbmdzbGFzaGl0KG5vcm1hbGl6ZShzZWxmLnBhcmVudC5nZXRQYXRoKHVzZVJlbW90ZSkgKyBzZWxmLm5hbWUpKTtcbiAgfVxuXG4gIGdldExvY2FsUGF0aCh1c2VSZW1vdGUgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gdW50cmFpbGluZ3NsYXNoaXQobm9ybWFsaXplKHNlbGYucGFyZW50LmdldExvY2FsUGF0aCh1c2VSZW1vdGUpICsgc2VsZi5uYW1lLCBQYXRoLnNlcCksIFBhdGguc2VwKTtcbiAgfVxuXG4gIGdldENvbm5lY3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLmdldFJvb3QoKS5nZXRDb25uZWN0b3IoKTtcbiAgfVxuXG4gIGFkZFN5bmNJY29uKGVsZW1lbnQgPSBudWxsKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSBzZWxmO1xuICAgIGlmICghZWxlbWVudC5sYWJlbCkgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5sYWJlbC5hZGRDbGFzcygnaWNvbi1zeW5jJykuYWRkQ2xhc3MoJ3NwaW4nKTtcbiAgfVxuXG4gIHJlbW92ZVN5bmNJY29uKGVsZW1lbnQgPSBudWxsKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSBzZWxmO1xuICAgIGlmICghZWxlbWVudC5sYWJlbCkgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5sYWJlbC5yZW1vdmVDbGFzcygnaWNvbi1zeW5jJykucmVtb3ZlQ2xhc3MoJ3NwaW4nKTtcbiAgfVxuXG4gIGV4cGFuZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHNlbGYuaXNFeHBhbmRlZCgpKSByZXR1cm4gcmVzb2x2ZSh0cnVlKTtcblxuICAgICAgc2VsZi5hZGRTeW5jSWNvbigpO1xuICAgICAgc2VsZi5nZXRDb25uZWN0b3IoKS5saXN0RGlyZWN0b3J5KHNlbGYuZ2V0UGF0aCgpKS50aGVuKChsaXN0KSA9PiB7XG4gICAgICAgIHNlbGYuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICBzZWxmLmFkZENsYXNzKCdleHBhbmRlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgc2VsZi5yZW1vdmVTeW5jSWNvbigpO1xuXG4gICAgICAgIHNlbGYuZW50cmllcy5jaGlsZHJlbigpLmRldGFjaCgpO1xuXG4gICAgICAgIGxldCBkaXJlY3RvcmllcyA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSA9PT0gJ2QnICYmIGl0ZW0ubmFtZSAhPT0gJy4nICYmIGl0ZW0ubmFtZSAhPT0gJy4uJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZpbGVzID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAnLSc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpcmVjdG9yaWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPCBiLm5hbWUudG9Mb3dlckNhc2UoKSkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChhLm5hbWUudG9Mb3dlckNhc2UoKSA+IGIubmFtZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gMTtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGlmIChhLm5hbWUudG9Mb3dlckNhc2UoKSA8IGIubmFtZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGEubmFtZS50b0xvd2VyQ2FzZSgpID4gYi5uYW1lLnRvTG93ZXJDYXNlKCkpIHJldHVybiAxO1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZW50cmllcyA9IFtdO1xuXG4gICAgICAgIGRpcmVjdG9yaWVzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXRoT25GaWxlU3lzdGVtID0gbm9ybWFsaXplKHNlbGYuZ2V0UGF0aCgpICsgZWxlbWVudC5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICAgICAgICBpZiAoIWlzUGF0aElnbm9yZWQocGF0aE9uRmlsZVN5c3RlbSkpIHtcbiAgICAgICAgICAgIGxldCBsaSA9IG5ldyBEaXJlY3RvcnlWaWV3KHNlbGYsIHtcbiAgICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lLFxuICAgICAgICAgICAgICBwYXRoOiBwYXRoT25GaWxlU3lzdGVtLFxuICAgICAgICAgICAgICByaWdodHM6IGVsZW1lbnQucmlnaHRzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVudHJpZXMucHVzaChsaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBmaWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZShzZWxmLmdldFBhdGgoKSArIGVsZW1lbnQubmFtZSwgUGF0aC5zZXApO1xuXG4gICAgICAgICAgaWYgKCFpc1BhdGhJZ25vcmVkKHBhdGhPbkZpbGVTeXN0ZW0pKSB7XG4gICAgICAgICAgICBsZXQgbGkgPSBuZXcgRmlsZVZpZXcoc2VsZiwge1xuICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICAgIHBhdGg6IHBhdGhPbkZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgIHNpemU6IGVsZW1lbnQuc2l6ZSxcbiAgICAgICAgICAgICAgcmlnaHRzOiBlbGVtZW50LnJpZ2h0c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbnRyaWVzLnB1c2gobGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgICBzZWxmLmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLnJlZnJlc2hEaXJlY3Rvcnkoc2VsZi5nZXRQYXRoKGZhbHNlKSwgZmlsZXMpO1xuXG4gICAgICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zb3J0Rm9sZGVyc0JlZm9yZUZpbGVzJykpIHtcbiAgICAgICAgICBlbnRyaWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLm5hbWUudG9Mb3dlckNhc2UoKSA8IGIubmFtZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPiBiLm5hbWUudG9Mb3dlckNhc2UoKSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICBzZWxmLmVudHJpZXMuYXBwZW5kKGVudHJ5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5zZWxlY3QoKTtcblxuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzZWxmLmNvbGxhcHNlKCk7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY29sbGFwc2UoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgc2VsZi5hZGRDbGFzcygnY29sbGFwc2VkJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgc2VsZi5yZW1vdmVTeW5jSWNvbigpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuaXNFeHBhbmRlZCgpKSB7XG4gICAgICBzZWxmLmNvbGxhcHNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZXhwYW5kKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdChkZXNlbGVjdEFsbE90aGVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGRlc2VsZWN0QWxsT3RoZXIpIHtcbiAgICAgIGVsZW1lbnRzVG9EZXNlbGVjdCA9ICQoJy5mdHAtcmVtb3RlLWVkaXQtdmlldyAuc2VsZWN0ZWQnKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGVsZW1lbnRzVG9EZXNlbGVjdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZWxlY3RlZCA9IGVsZW1lbnRzVG9EZXNlbGVjdFtpXTtcbiAgICAgICAgJChzZWxlY3RlZCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICBzZWxmLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGRlc2VsZWN0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcbiAgICAgIHNlbGYucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaXNFeHBhbmRlZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLnBhcmVudC5pc0V4cGFuZGVkKCkgJiYgc2VsZi5leHBhbmRlZDtcbiAgfVxuXG4gIGlzVmlzaWJsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLnBhcmVudC5pc0V4cGFuZGVkKCk7XG4gIH1cblxuICByZWZyZXNoKGVsZW1lbnRUb1JlZnJlc2gpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBzb3J0Rm9sZGVyc0JlZm9yZUZpbGVzID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zb3J0Rm9sZGVyc0JlZm9yZUZpbGVzJyk7XG4gICAgaWYgKGVsZW1lbnRUb1JlZnJlc2guZW50cmllc1swXS5jaGlsZE5vZGVzKSB7XG4gICAgICBsZXQgZSA9IGVsZW1lbnRUb1JlZnJlc2guZW50cmllc1swXS5jaGlsZE5vZGVzO1xuICAgICAgW10uc2xpY2UuY2FsbChlKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChzb3J0Rm9sZGVyc0JlZm9yZUZpbGVzKSB7XG4gICAgICAgICAgaWYgKGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXJlY3RvcnknKSAmJiBiLmNsYXNzTGlzdC5jb250YWlucygnZmlsZScpKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlJykgJiYgYi5jbGFzc0xpc3QuY29udGFpbnMoJ2RpcmVjdG9yeScpKSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYS5zcGFjZVBlblZpZXcubmFtZSA8IGIuc3BhY2VQZW5WaWV3Lm5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYS5zcGFjZVBlblZpZXcubmFtZSA+IGIuc3BhY2VQZW5WaWV3Lm5hbWUpIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChhLnNwYWNlUGVuVmlldy5uYW1lIDwgYi5zcGFjZVBlblZpZXcubmFtZSkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChhLnNwYWNlUGVuVmlldy5uYW1lID4gYi5zcGFjZVBlblZpZXcubmFtZSkgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9KS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIHNlbGYuZW50cmllcy5hcHBlbmQodmFsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uRHJhZ1N0YXJ0KGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBpbml0aWFsUGF0aDtcblxuICAgIGlmIChlbnRyeSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5lbnRyeS5kaXJlY3RvcnknKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGluaXRpYWxQYXRoID0gc2VsZi5nZXRQYXRoKGZhbHNlKTtcblxuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluaXRpYWxQYXRoXCIsIGluaXRpYWxQYXRoKTtcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluaXRpYWxUeXBlXCIsIFwiZGlyZWN0b3J5XCIpO1xuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5pdGlhbE5hbWVcIiwgc2VsZi5uYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcIm1vdmVcIjtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5pdGlhbFBhdGhcIiwgaW5pdGlhbFBhdGgpO1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsVHlwZVwiLCBcImRpcmVjdG9yeVwiKTtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5pdGlhbE5hbWVcIiwgc2VsZi5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRyYWdFbnRlcihlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZW50cnksIGluaXRpYWxUeXBlO1xuXG4gICAgaWYgKGVudHJ5ID0gZS50YXJnZXQuY2xvc2VzdCgnLmVudHJ5LmRpcmVjdG9yeScpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5pdGlhbFR5cGUgPT0gXCJzZXJ2ZXJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICQoZW50cnkpLnZpZXcoKS5zZWxlY3QoKTtcbiAgICB9XG4gIH1cblxuICBvbkRyYWdMZWF2ZShlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZW50cnksIGluaXRpYWxUeXBlO1xuXG4gICAgaWYgKGVudHJ5ID0gZS50YXJnZXQuY2xvc2VzdCgnLmVudHJ5LmRpcmVjdG9yeScpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5pdGlhbFR5cGUgPT0gXCJzZXJ2ZXJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICQoZW50cnkpLnZpZXcoKS5kZXNlbGVjdCgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdG9yeVZpZXc7XG4iXX0=