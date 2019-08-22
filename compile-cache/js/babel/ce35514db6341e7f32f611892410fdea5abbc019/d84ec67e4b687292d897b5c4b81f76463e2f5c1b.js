var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperFormatJs = require('./../helper/format.js');

var _helperSecureJs = require('./../helper/secure.js');

var _helperHelperJs = require('./../helper/helper.js');

var _helperIssueJs = require('./../helper/issue.js');

var _serverViewJs = require('./server-view.js');

var _serverViewJs2 = _interopRequireDefault(_serverViewJs);

var _folderViewJs = require('./folder-view.js');

var _folderViewJs2 = _interopRequireDefault(_folderViewJs);

var _directoryViewJs = require('./directory-view.js');

var _directoryViewJs2 = _interopRequireDefault(_directoryViewJs);

var _fileViewJs = require('./file-view.js');

var _fileViewJs2 = _interopRequireDefault(_fileViewJs);

var _ftpLogViewJs = require('./ftp-log-view.js');

var _ftpLogViewJs2 = _interopRequireDefault(_ftpLogViewJs);

'use babel';

var md5 = require('md5');
var Path = require('path');
var FileSystem = require('fs-plus');
var Storage = require('./../helper/storage.js');
var FTP_REMOTE_EDIT_URI = 'h3imdall://ftp-remote-edit';

var TreeView = (function (_ScrollView) {
  _inherits(TreeView, _ScrollView);

  function TreeView() {
    _classCallCheck(this, TreeView);

    _get(Object.getPrototypeOf(TreeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TreeView, [{
    key: 'serialize',
    value: function serialize() {
      return {};
    }
  }, {
    key: 'initialize',
    value: function initialize(state) {
      _get(Object.getPrototypeOf(TreeView.prototype), 'initialize', this).call(this, state);
      var self = this;

      var html = '<background-tip>';
      html += '<ul class="centered background-message">';
      html += '<li class="message fade-in">You can edit the servers from the Settings View with ftp-remote-edit:edit-servers<br/><br/><a role="configure" class="btn btn-xs btn-default icon">Edit Servers</a></li>';
      html += '</ul>';
      html += '</background-tip>';
      self.info.html(html);

      // Events
      atom.config.onDidChange('ftp-remote-edit.tree.showOnRightSide', function () {
        self.element.dataset.showOnRightSide = atom.config.get('ftp-remote-edit.tree.showOnRightSide');
        if (self.isVisible() && atom.config.get('ftp-remote-edit.tree.showInDock') == false) {
          self.detach();
          self.attach();
        }
      });
      atom.config.onDidChange('ftp-remote-edit.tree.sortFoldersBeforeFiles', function () {
        if (self.isVisible()) {
          self.reload();
        }
      });
      atom.config.onDidChange('ftp-remote-edit.tree.sortServerProfilesByName', function () {
        if (self.isVisible()) {
          self.reload();
        }
      });
      atom.config.onDidChange('ftp-remote-edit.tree.hideIgnoredNames', function () {
        (0, _helperHelperJs.resetIgnoredPatterns)();
        if (self.isVisible()) {
          self.reload();
        }
      });
      atom.config.onDidChange('core.ignoredNames', function () {
        (0, _helperHelperJs.resetIgnoredPatterns)();
        (0, _helperHelperJs.resetIgnoredFinderPatterns)();
        if (self.isVisible()) {
          self.reload();
        }
      });
      atom.config.onDidChange('ftp-remote-edit.finder.ignoredNames', function () {
        (0, _helperHelperJs.resetIgnoredPatterns)();
        (0, _helperHelperJs.resetIgnoredFinderPatterns)();
        if (self.isVisible()) {
          self.reload();
        }
      });

      self.on('mousedown', function (e) {
        var entry = undefined;
        if (entry = e.target.closest('.entry')) {
          e.stopPropagation();

          setTimeout(function () {
            (0, _atomSpacePenViews.$)(entry).view().select();
            self.focus();
          }, 10);
        }
      });

      // Info Panel
      self.info.on('click', '[role="configure"]', function (e) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:edit-servers');
      });
      self.info.on('click', '[role="toggle"]', function (e) {
        self.toggle();
      });

      // Resize Panel
      self.horizontalResize.on('dblclick', function (e) {
        self.resizeToFitContent(e);
      });
      self.horizontalResize.on('mousedown', function (e) {
        self.resizeHorizontalStarted(e);
      });

      // Keyboard Navigation
      self.on('keydown', function (e) {
        self.remoteKeyboardNavigation(e);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      if (self.list) {
        if (self.list.children()) {
          self.list.children().detach();
        }
      }
      self.remove();
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return "Remote";
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return FTP_REMOTE_EDIT_URI;
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ["left", "right"];
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      if (atom.config.get('ftp-remote-edit.tree.showOnRightSide')) {
        return "right";
      } else {
        return "left";
      }
    }
  }, {
    key: 'isPermanentDockItem',
    value: function isPermanentDockItem() {
      return true;
    }
  }, {
    key: 'attach',
    value: function attach() {
      var self = this;

      if (atom.config.get('ftp-remote-edit.tree.showOnRightSide')) {
        self.panel = atom.workspace.addRightPanel({
          item: self
        });
      } else {
        self.panel = atom.workspace.addLeftPanel({
          item: self
        });
      }
    }
  }, {
    key: 'detach',
    value: function detach() {
      var self = this;

      if (self.panel) {
        self.panel.destroy();
        self.panel = null;
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var self = this;

      if (atom.config.get('ftp-remote-edit.tree.showInDock')) {
        atom.workspace.toggle(this);
      } else {
        if (self.isVisible()) {
          self.detach();
        } else {
          self.attach();
          self.resizeToFitContent();
        }
      }

      if (self.list[0].children.length > 0) {
        self.hideInfo();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      atom.workspace.open(this, {
        searchAllPanes: true,
        activatePane: true,
        activateItem: true
      }).then(function () {
        atom.workspace.paneContainerForURI(_this.getURI()).show();
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      atom.workspace.hide(this);
    }
  }, {
    key: 'focus',
    value: function focus() {
      (0, _atomSpacePenViews.$)(this).focus();
    }
  }, {
    key: 'unfocus',
    value: function unfocus() {
      atom.workspace.getCenter().activate();
    }
  }, {
    key: 'hasFocus',
    value: function hasFocus() {
      return document.activeElement === this.element;
    }
  }, {
    key: 'toggleFocus',
    value: function toggleFocus() {
      if (this.hasFocus()) {
        this.unfocus();
      } else {
        this.show();
      }
    }
  }, {
    key: 'showInfo',
    value: function showInfo() {
      this.info.css('display', 'flex');
    }
  }, {
    key: 'hideInfo',
    value: function hideInfo() {
      this.info.hide();
    }
  }, {
    key: 'reload',
    value: function reload() {
      var self = this;

      if (Storage.getServers().length === 0) {
        self.showInfo();
        return;
      } else {
        self.hideInfo();
      }

      var temp = self.list.children('.temp');

      self.list.children().detach();

      Storage.getTree().children.forEach(function (config) {
        if (typeof config.children !== 'undefined') {
          self.addFolder(config);
        } else {
          self.addServer(config);
        }
      });

      if (temp.length > 0) {
        self.list.append(temp);
      }
    }
  }, {
    key: 'addServer',
    value: function addServer(config) {
      var self = this;

      var server = new _serverViewJs2['default'](config);

      // Events
      server.getConnector().on('log', function (msg) {
        self.ftpLogView.addLine(msg);
      });

      server.getConnector().on('debug', function (cmd, param1, param2) {
        if (atom.config.get('ftp-remote-edit.dev.debug')) {
          if (param1 && param2) {
            console.log(cmd, param1, param2);
          } else if (param1) {
            console.log(cmd, param1);
          } else if (cmd) console.log(cmd);
        }
      });

      self.list.append(server);
      self.hideInfo();
    }
  }, {
    key: 'removeServer',
    value: function removeServer(root) {
      var self = this;

      if (root.isExpanded()) {
        root.collapse();
      }
      root.destroy();

      if (self.list[0].children.length === 0) {
        self.showInfo();
      }
    }
  }, {
    key: 'addFolder',
    value: function addFolder(config) {
      var self = this;

      var folder = new _folderViewJs2['default'](config, self);

      // Events
      folder.onDidAddServer = function (server) {
        server.getConnector().on('log', function (msg) {
          self.ftpLogView.addLine(msg);
        });

        server.getConnector().on('debug', function (cmd, param1, param2) {
          if (atom.config.get('ftp-remote-edit.dev.debug')) {
            if (param1 && param2) {
              console.log(cmd, param1, param2);
            } else if (param1) {
              console.log(cmd, param1);
            } else if (cmd) console.log(cmd);
          }
        });
      };

      self.list.append(folder);
      self.hideInfo();
    }
  }, {
    key: 'addDirectory',
    value: function addDirectory(root, relativePath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var self = this;

      if (!options.rights) options.rights = (0, _helperHelperJs.permissionsToRights)('644');

      if (relativePath == '/') return root;

      var tmp = (0, _helperFormatJs.leadingslashit)(relativePath).split('/');
      var element = tmp.shift();
      var elementPath = (0, _helperFormatJs.normalize)(root.getPath(false) + (0, _helperFormatJs.trailingslashit)(element));

      var directory = self.findElementByPath(root.getRoot(), elementPath);
      if (!directory) {
        directory = new _directoryViewJs2['default'](root, {
          name: element,
          rights: options.rights
        });
        root.entries.append(directory);

        if (root.isExpanded()) {
          root.refresh(root);
        }
      }

      if (tmp.length > 0) {
        return self.addDirectory(directory, tmp.join('/'));
      } else {
        return directory;
      }
    }
  }, {
    key: 'addFile',
    value: function addFile(root, relativePath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var self = this;

      if (!options.size) options.size = 0;
      if (!options.rights) options.rights = (0, _helperHelperJs.permissionsToRights)('755');

      if (relativePath == '/') return root;

      var tmp = (0, _helperFormatJs.leadingslashit)(relativePath).split('/');
      var element = tmp.pop();
      var elementPath = (0, _helperFormatJs.normalize)(root.getPath(false) + element);

      if (tmp.length > 0) {
        root = self.addDirectory(root, tmp.join('/'));
        elementPath = (0, _helperFormatJs.normalize)(root.getPath(false) + element);
      }

      var file = self.findElementByPath(root.getRoot(), elementPath);
      if (!file) {
        file = new _fileViewJs2['default'](root, {
          name: element,
          size: options.size,
          rights: options.rights
        });
        root.entries.append(file);

        if (root.isExpanded()) {
          root.refresh(root);
        }
      }

      return file;
    }
  }, {
    key: 'getRoot',
    value: function getRoot() {
      var self = this;

      return self;
    }
  }, {
    key: 'expand',
    value: function expand(root, relativePath) {
      var self = this;

      var promise = new Promise(function (resolve, reject) {
        relativePath = (0, _helperFormatJs.leadingslashit)((0, _helperFormatJs.normalize)(relativePath));
        if (relativePath == '' || relativePath == '/') {
          root.select();
          resolve(true);
        }

        root.getRoot().expand().then(function () {
          var arrPath = relativePath.split('/');
          var dir = (0, _helperFormatJs.trailingslashit)((0, _helperFormatJs.normalize)(root.getPath(false) + arrPath.shift()));
          var newRelativePath = arrPath.join('/');

          var find = self.findElementByPath(root.getRoot(), dir);
          if (find) {
            if (find.is('.directory')) {
              find.expand().then(function () {
                if (newRelativePath && newRelativePath != '/') {
                  self.expand(find, newRelativePath).then(function () {
                    resolve(true);
                  })['catch'](function (err) {
                    reject(err);
                  });
                } else {
                  find.select();
                  resolve(true);
                }
              })['catch'](function (err) {
                reject(err);
              });
            } else {
              find.select();
              resolve(true);
            }
          } else {
            reject('Path not found.');
          }
        })['catch'](function (err) {
          reject(err);
        });
      });

      return promise;
    }
  }, {
    key: 'getElementByLocalPath',
    value: function getElementByLocalPath(pathOnFileSystem, root) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? 'directory' : arguments[2];

      var self = this;

      pathOnFileSystem = (0, _helperFormatJs.normalize)(pathOnFileSystem, Path.sep);
      var elementname = (0, _helperFormatJs.basename)(pathOnFileSystem, Path.sep);
      var elementpath = (0, _helperFormatJs.dirname)(pathOnFileSystem, Path.sep) + elementname;
      var dirpath = (0, _helperFormatJs.dirname)(pathOnFileSystem, Path.sep);

      var a = (0, _helperFormatJs.trailingslashit)(pathOnFileSystem, Path.sep);
      var b = (0, _helperFormatJs.trailingslashit)(root.getLocalPath(true), Path.sep);
      if (a == b) {
        return new _serverViewJs2['default'](root.config, root.treeView);
      } else if (type == 'file') {
        if (FileSystem.existsSync(elementpath)) {
          var stats = FileSystem.statSync(elementpath);
          if (stats) {
            return new _fileViewJs2['default'](self.getElementByLocalPath(dirpath, root), {
              name: elementname,
              path: elementpath,
              size: stats.size,
              rights: null
            });
          } else {
            return new _fileViewJs2['default'](self.getElementByLocalPath(dirpath, root), {
              name: elementname,
              path: elementpath,
              size: 0,
              rights: null
            });
          }
        } else {
          return new _fileViewJs2['default'](self.getElementByLocalPath(dirpath, root), {
            name: elementname,
            path: elementpath,
            size: 0,
            rights: null
          });
        }
      } else {
        return new _directoryViewJs2['default'](self.getElementByLocalPath(dirpath, root), {
          name: elementname,
          path: elementpath,
          rights: null
        });
      }
    }
  }, {
    key: 'findElementByPath',
    value: function findElementByPath(root, relativePath) {
      var self = this;

      var find = root.entries.find('li[id="' + 'ftp-remote-edit-' + md5(relativePath) + '"]');
      if (find.length > 0) {
        return find.view();
      }

      find = root.entries.find('li[id="' + 'ftp-remote-edit-' + md5(relativePath + '/') + '"]');
      if (find.length > 0) {
        return find.view();
      }

      return null;
    }
  }, {
    key: 'findElementByLocalPath',
    value: function findElementByLocalPath(pathOnFileSystem) {
      var self = this;

      pathOnFileSystem = (0, _helperFormatJs.trailingslashit)((0, _helperFormatJs.normalize)(pathOnFileSystem, Path.sep));

      if (!Storage.getServers()) return;
      if (!self.list) return;

      var found = null;
      Storage.getServers().forEach(function (config) {
        var server = new _serverViewJs2['default'](config, self);
        var path = server.getLocalPath(true);

        if (pathOnFileSystem.indexOf(path) != -1) {
          var object = {
            config: server.config,
            name: server.name,
            path: server.getPath(false)
          };

          var findRoot = self.list.find('li[id="' + 'ftp-remote-edit-' + md5(JSON.stringify(object)) + '"]');
          if (findRoot.length > 0) {
            var root = findRoot.view();
            var relativePath = pathOnFileSystem.replace(root.getLocalPath(), '');
            var _find = self.findElementByPath(root.getRoot(), (0, _helperFormatJs.normalize)((0, _helperFormatJs.unleadingslashit)(relativePath), '/'));
            if (_find) {
              found = _find;
              return;
            }
          }
        }
      });

      return found;
    }
  }, {
    key: 'resizeHorizontalStarted',
    value: function resizeHorizontalStarted(e) {
      e.preventDefault();

      this.resizeWidthStart = this.width();
      this.resizeMouseStart = e.pageX;
      (0, _atomSpacePenViews.$)(document).on('mousemove', this.resizeHorizontalView.bind(this));
      (0, _atomSpacePenViews.$)(document).on('mouseup', this.resizeHorizontalStopped);
    }
  }, {
    key: 'resizeHorizontalStopped',
    value: function resizeHorizontalStopped() {
      delete this.resizeWidthStart;
      delete this.resizeMouseStart;
      (0, _atomSpacePenViews.$)(document).off('mousemove', this.resizeHorizontalView);
      (0, _atomSpacePenViews.$)(document).off('mouseup', this.resizeHorizontalStopped);
    }
  }, {
    key: 'resizeHorizontalView',
    value: function resizeHorizontalView(e) {
      if (e.which !== 1) {
        return this.resizeHorizontalStopped();
      }

      var delta = e.pageX - this.resizeMouseStart;
      var width = 0;
      if (atom.config.get('ftp-remote-edit.tree.showOnRightSide')) {
        width = Math.max(50, this.resizeWidthStart - delta);
      } else {
        width = Math.max(50, this.resizeWidthStart + delta);
      }

      this.width(width);
    }
  }, {
    key: 'resizeToFitContent',
    value: function resizeToFitContent(e) {
      if (e) e.preventDefault();

      if (atom.config.get('ftp-remote-edit.tree.showInDock')) {
        var paneContainer = atom.workspace.paneContainerForItem(this);
        // NOTE: This is an internal API access
        // It's necessary because there's no Public API for it yet
        if (paneContainer && typeof paneContainer.state.size === 'number' && paneContainer.widthOrHeight == 'width' && typeof paneContainer.render === 'function') {
          paneContainer.state.size = 1;
          paneContainer.state.size = this.list.outerWidth() + 10;
          paneContainer.render(paneContainer.state);
        }
      } else {
        this.width(1);
        this.width(this.list.outerWidth() + 10);
      }
    }
  }, {
    key: 'remoteKeyboardNavigation',
    value: function remoteKeyboardNavigation(e) {
      var arrows = { left: 37, up: 38, right: 39, down: 40, enter: 13 };
      var keyCode = e.keyCode || e.which;

      switch (keyCode) {
        case arrows.up:
          this.remoteKeyboardNavigationUp();
          break;
        case arrows.down:
          this.remoteKeyboardNavigationDown();
          break;
        case arrows.left:
          this.remoteKeyboardNavigationLeft();
          break;
        case arrows.right:
          this.remoteKeyboardNavigationRight();
          break;
        case arrows.enter:
          this.remoteKeyboardNavigationEnter();
          break;
        default:
          return;
      }

      e.preventDefault();
      e.stopPropagation();
      this.remoteKeyboardNavigationMovePage();
    }
  }, {
    key: 'remoteKeyboardNavigationUp',
    value: function remoteKeyboardNavigationUp() {
      var current = this.list.find('.selected');
      if (current.length === 0) {
        if (this.list.children().length > 0) {
          current = this.list.children().last();
          (0, _atomSpacePenViews.$)(current).view().select();
          return;
        }
      }
      var next = current.prev('.entry:visible');

      if (next.length) {
        while (next.is('.expanded') && next.find('.entries .entry:visible').length) {
          next = next.find('.entries .entry:visible');
        }
      } else {
        next = current.closest('.entries').closest('.entry:visible');
      }
      if (next.length) {
        current.removeClass('selected');
        next.last().addClass('selected');
      }
    }
  }, {
    key: 'remoteKeyboardNavigationDown',
    value: function remoteKeyboardNavigationDown() {
      var current = this.list.find('.selected');
      if (current.length === 0) {
        if (this.list.children().length > 0) {
          current = this.list.children().first();
          (0, _atomSpacePenViews.$)(current).view().select();
          return;
        }
      }
      var next = current.find('.entries .entry:visible');

      if (!next.length) {
        tmp = current;

        // Workaround skip after 10
        var counter = 1;
        do {
          next = tmp.next('.entry:visible');
          if (!next.length) {
            tmp = tmp.closest('.entries').closest('.entry:visible');
          }
          counter++;
        } while (!next.length && !tmp.is('.project-root') && counter < 10);
      }
      if (next.length) {
        current.removeClass('selected');
        next.first().addClass('selected');
      }
    }
  }, {
    key: 'remoteKeyboardNavigationLeft',
    value: function remoteKeyboardNavigationLeft() {
      var current = this.list.find('.selected');

      if (current.is('.file')) {
        parent = current.view().parent.view();
        parent.collapse();
        current.removeClass('selected');
        parent.addClass('selected');
      } else if (current.is('.directory') && current.view().isExpanded()) {
        current.view().collapse();
      } else if (current.is('.directory') && !current.view().isExpanded()) {
        parent = current.view().parent.view();
        parent.collapse();
        current.removeClass('selected');
        parent.addClass('selected');
      } else if (current.is('.folder') && current.view().isExpanded()) {
        current.view().collapse();
      } else if (current.is('.folder') && !current.view().isExpanded() && current.view().parent.is('.folder')) {
        parent = current.view().parent.view();
        parent.collapse();
        current.removeClass('selected');
        parent.addClass('selected');
      } else if (current.is('.server')) {
        if (current.view().isExpanded()) {
          current.view().collapse();
        }
      }
    }
  }, {
    key: 'remoteKeyboardNavigationRight',
    value: function remoteKeyboardNavigationRight() {
      var current = this.list.find('.selected');

      if (current.is('.directory') || current.is('.server') || current.is('.folder')) {
        if (!current.view().isExpanded()) {
          current.view().expand();
        }
      } else if (current.is('.file')) {
        if (atom.config.get('ftp-remote-edit.tree.allowPendingPaneItems')) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file-pending');
        } else {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file');
        }
      }
    }
  }, {
    key: 'remoteKeyboardNavigationMovePage',
    value: function remoteKeyboardNavigationMovePage() {
      var current = this.list.find('.selected');

      if (current.length > 0) {
        var scrollerTop = this.scroller.scrollTop(),
            selectedTop = current.position().top;
        if (selectedTop < scrollerTop - 10) {
          this.scroller.pageUp();
        } else if (selectedTop > scrollerTop + this.scroller.height() - 10) {
          this.scroller.pageDown();
        }
      }
    }
  }, {
    key: 'remoteKeyboardNavigationEnter',
    value: function remoteKeyboardNavigationEnter() {
      var current = this.list.find('.selected');

      if (current.is('.directory') || current.is('.server')) {
        if (!current.view().isExpanded()) {
          current.view().expand();
        } else {
          current.view().collapse();
        }
      } else if (current.is('.file')) {
        if (atom.config.get('ftp-remote-edit.tree.allowPendingPaneItems')) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file-pending');
        } else {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file');
        }
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      return this.div({
        'class': 'ftp-remote-edit-view ftp-remote-edit-resizer tool-panel',
        'tabIndex ': '-1',
        'data-show-on-right-side': atom.config.get('ftp-remote-edit.tree.showOnRightSide')
      }, function () {
        _this2.div({
          'class': 'ftp-remote-edit-scroller order--center',
          outlet: 'scroller'
        }, function () {
          _this2.ol({
            'class': 'ftp-remote-edit-list full-menu list-tree has-collapsable-children focusable-panel',
            tabindex: -1,
            outlet: 'list'
          });
        });

        _this2.div({
          'class': 'ftp-remote-edit-resize-handle',
          outlet: 'horizontalResize'
        });

        _this2.subview('ftpLogView', new _ftpLogViewJs2['default']());

        _this2.div({
          'class': 'info',
          tabindex: -1,
          outlet: 'info'
        });
      });
    }
  }]);

  return TreeView;
})(_atomSpacePenViews.ScrollView);

module.exports = TreeView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy90cmVlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FFOEIsc0JBQXNCOzs4QkFDZ0YsdUJBQXVCOzs4QkFDbkksdUJBQXVCOzs4QkFDdUMsdUJBQXVCOzs2QkFDM0Usc0JBQXNCOzs0QkFDakMsa0JBQWtCOzs7OzRCQUNsQixrQkFBa0I7Ozs7K0JBQ2YscUJBQXFCOzs7OzBCQUMxQixnQkFBZ0I7Ozs7NEJBQ2QsbUJBQW1COzs7O0FBWDFDLFdBQVcsQ0FBQzs7QUFhWixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRCxJQUFNLG1CQUFtQixHQUFHLDRCQUE0QixDQUFDOztJQUVuRCxRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBa0NILHFCQUFHO0FBQ1YsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1dBRVMsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLGlDQXZDRSxRQUFRLDRDQXVDTyxLQUFLLEVBQUM7QUFDdkIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUM5QixVQUFJLElBQUksMENBQTBDLENBQUM7QUFDbkQsVUFBSSxJQUFJLHNNQUFzTSxDQUFDO0FBQy9NLFVBQUksSUFBSSxPQUFPLENBQUM7QUFDaEIsVUFBSSxJQUFJLG1CQUFtQixDQUFDO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFD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YUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2QsaUJBQU8seURBQXlEO0FBQ2hFLG1CQUFXLEVBQUUsSUFBSTtBQUNqQixpQ0FBeUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQztPQUNuRixFQUFFLFlBQU07QUFDUCxlQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLHdDQUF3QztBQUMvQyxnQkFBTSxFQUFFLFVBQVU7U0FDbkIsRUFBRSxZQUFNO0FBQ1AsaUJBQUssRUFBRSxDQUFDO0FBQ04scUJBQU8sbUZBQW1GO0FBQzFGLG9CQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ1osa0JBQU0sRUFBRSxNQUFNO1dBQ2YsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDOztBQUVILGVBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sK0JBQStCO0FBQ3RDLGdCQUFNLEVBQUUsa0JBQWtCO1NBQzNCLENBQUMsQ0FBQzs7QUFFSCxlQUFLLE9BQU8sQ0FBQyxZQUFZLEVBQUUsK0JBQWdCLENBQUMsQ0FBQzs7QUFFN0MsZUFBSyxHQUFHLENBQUM7QUFDUCxtQkFBTyxNQUFNO0FBQ2Isa0JBQVEsRUFBRSxDQUFDLENBQUM7QUFDWixnQkFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBaENHLFFBQVE7OztBQXN2QmQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL3ZpZXdzL3RyZWUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyAkLCBTY3JvbGxWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgYmFzZW5hbWUsIGRpcm5hbWUsIGxlYWRpbmdzbGFzaGl0LCB0cmFpbGluZ3NsYXNoaXQsIHVubGVhZGluZ3NsYXNoaXQsIHVudHJhaWxpbmdzbGFzaGl0LCBub3JtYWxpemUsIGNsZWFuSnNvblN0cmluZyB9IGZyb20gJy4vLi4vaGVscGVyL2Zvcm1hdC5qcyc7XG5pbXBvcnQgeyBkZWNyeXB0IH0gZnJvbSAnLi8uLi9oZWxwZXIvc2VjdXJlLmpzJztcbmltcG9ydCB7IHJlc2V0SWdub3JlZFBhdHRlcm5zLCByZXNldElnbm9yZWRGaW5kZXJQYXR0ZXJucywgcGVybWlzc2lvbnNUb1JpZ2h0cyB9IGZyb20gJy4vLi4vaGVscGVyL2hlbHBlci5qcyc7XG5pbXBvcnQgeyB0aHJvd0Vycm9ySXNzdWU0NCB9IGZyb20gJy4vLi4vaGVscGVyL2lzc3VlLmpzJztcbmltcG9ydCBTZXJ2ZXJWaWV3IGZyb20gJy4vc2VydmVyLXZpZXcuanMnO1xuaW1wb3J0IEZvbGRlclZpZXcgZnJvbSAnLi9mb2xkZXItdmlldy5qcyc7XG5pbXBvcnQgRGlyZWN0b3J5VmlldyBmcm9tICcuL2RpcmVjdG9yeS12aWV3LmpzJztcbmltcG9ydCBGaWxlVmlldyBmcm9tICcuL2ZpbGUtdmlldy5qcyc7XG5pbXBvcnQgRnRwTG9nVmlldyBmcm9tICcuL2Z0cC1sb2ctdmlldy5qcyc7XG5cbmNvbnN0IG1kNSA9IHJlcXVpcmUoJ21kNScpO1xuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IEZpbGVTeXN0ZW0gPSByZXF1aXJlKCdmcy1wbHVzJyk7XG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi8uLi9oZWxwZXIvc3RvcmFnZS5qcycpO1xuY29uc3QgRlRQX1JFTU9URV9FRElUX1VSSSA9ICdoM2ltZGFsbDovL2Z0cC1yZW1vdGUtZWRpdCc7XG5cbmNsYXNzIFRyZWVWaWV3IGV4dGVuZHMgU2Nyb2xsVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHtcbiAgICAgIGNsYXNzOiAnZnRwLXJlbW90ZS1lZGl0LXZpZXcgZnRwLXJlbW90ZS1lZGl0LXJlc2l6ZXIgdG9vbC1wYW5lbCcsXG4gICAgICAndGFiSW5kZXggJzogJy0xJyxcbiAgICAgICdkYXRhLXNob3ctb24tcmlnaHQtc2lkZSc6IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc2hvd09uUmlnaHRTaWRlJyksXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdC1zY3JvbGxlciBvcmRlci0tY2VudGVyJyxcbiAgICAgICAgb3V0bGV0OiAnc2Nyb2xsZXInLFxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9sKHtcbiAgICAgICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdC1saXN0IGZ1bGwtbWVudSBsaXN0LXRyZWUgaGFzLWNvbGxhcHNhYmxlLWNoaWxkcmVuIGZvY3VzYWJsZS1wYW5lbCcsXG4gICAgICAgICAgdGFiaW5kZXg6IC0xLFxuICAgICAgICAgIG91dGxldDogJ2xpc3QnLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAnZnRwLXJlbW90ZS1lZGl0LXJlc2l6ZS1oYW5kbGUnLFxuICAgICAgICBvdXRsZXQ6ICdob3Jpem9udGFsUmVzaXplJyxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN1YnZpZXcoJ2Z0cExvZ1ZpZXcnLCBuZXcgRnRwTG9nVmlldygpKTtcblxuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2luZm8nLFxuICAgICAgICB0YWJpbmRleDogLTEsXG4gICAgICAgIG91dGxldDogJ2luZm8nLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZShzdGF0ZSkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoc3RhdGUpXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgaHRtbCA9ICc8YmFja2dyb3VuZC10aXA+JztcbiAgICBodG1sICs9ICc8dWwgY2xhc3M9XCJjZW50ZXJlZCBiYWNrZ3JvdW5kLW1lc3NhZ2VcIj4nO1xuICAgIGh0bWwgKz0gJzxsaSBjbGFzcz1cIm1lc3NhZ2UgZmFkZS1pblwiPllvdSBjYW4gZWRpdCB0aGUgc2VydmVycyBmcm9tIHRoZSBTZXR0aW5ncyBWaWV3IHdpdGggZnRwLXJlbW90ZS1lZGl0OmVkaXQtc2VydmVyczxici8+PGJyLz48YSByb2xlPVwiY29uZmlndXJlXCIgY2xhc3M9XCJidG4gYnRuLXhzIGJ0bi1kZWZhdWx0IGljb25cIj5FZGl0IFNlcnZlcnM8L2E+PC9saT4nO1xuICAgIGh0bWwgKz0gJzwvdWw+JztcbiAgICBodG1sICs9ICc8L2JhY2tncm91bmQtdGlwPic7XG4gICAgc2VsZi5pbmZvLmh0bWwoaHRtbCk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc2hvd09uUmlnaHRTaWRlJywgKCkgPT4ge1xuICAgICAgc2VsZi5lbGVtZW50LmRhdGFzZXQuc2hvd09uUmlnaHRTaWRlID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zaG93T25SaWdodFNpZGUnKTtcbiAgICAgIGlmIChzZWxmLmlzVmlzaWJsZSgpICYmIGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc2hvd0luRG9jaycpID09IGZhbHNlKSB7XG4gICAgICAgIHNlbGYuZGV0YWNoKCk7XG4gICAgICAgIHNlbGYuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnNvcnRGb2xkZXJzQmVmb3JlRmlsZXMnLCAoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5pc1Zpc2libGUoKSkge1xuICAgICAgICBzZWxmLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zb3J0U2VydmVyUHJvZmlsZXNCeU5hbWUnLCAoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5pc1Zpc2libGUoKSkge1xuICAgICAgICBzZWxmLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdmdHAtcmVtb3RlLWVkaXQudHJlZS5oaWRlSWdub3JlZE5hbWVzJywgKCkgPT4ge1xuICAgICAgcmVzZXRJZ25vcmVkUGF0dGVybnMoKTtcbiAgICAgIGlmIChzZWxmLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIHNlbGYucmVsb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2NvcmUuaWdub3JlZE5hbWVzJywgKCkgPT4ge1xuICAgICAgcmVzZXRJZ25vcmVkUGF0dGVybnMoKTtcbiAgICAgIHJlc2V0SWdub3JlZEZpbmRlclBhdHRlcm5zKCk7XG4gICAgICBpZiAoc2VsZi5pc1Zpc2libGUoKSkge1xuICAgICAgICBzZWxmLnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdmdHAtcmVtb3RlLWVkaXQuZmluZGVyLmlnbm9yZWROYW1lcycsICgpID0+IHtcbiAgICAgIHJlc2V0SWdub3JlZFBhdHRlcm5zKCk7XG4gICAgICByZXNldElnbm9yZWRGaW5kZXJQYXR0ZXJucygpO1xuICAgICAgaWYgKHNlbGYuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgc2VsZi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYub24oJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICBsZXQgZW50cnk7XG4gICAgICBpZiAoZW50cnkgPSBlLnRhcmdldC5jbG9zZXN0KCcuZW50cnknKSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoZW50cnkpLnZpZXcoKS5zZWxlY3QoKTtcbiAgICAgICAgICBzZWxmLmZvY3VzKCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEluZm8gUGFuZWxcbiAgICBzZWxmLmluZm8ub24oJ2NsaWNrJywgJ1tyb2xlPVwiY29uZmlndXJlXCJdJywgKGUpID0+IHtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2Z0cC1yZW1vdGUtZWRpdDplZGl0LXNlcnZlcnMnKTtcbiAgICB9KTtcbiAgICBzZWxmLmluZm8ub24oJ2NsaWNrJywgJ1tyb2xlPVwidG9nZ2xlXCJdJywgKGUpID0+IHtcbiAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXNpemUgUGFuZWxcbiAgICBzZWxmLmhvcml6b250YWxSZXNpemUub24oJ2RibGNsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGYucmVzaXplVG9GaXRDb250ZW50KGUpO1xuICAgIH0pO1xuICAgIHNlbGYuaG9yaXpvbnRhbFJlc2l6ZS5vbignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIHNlbGYucmVzaXplSG9yaXpvbnRhbFN0YXJ0ZWQoZSk7XG4gICAgfSk7XG5cbiAgICAvLyBLZXlib2FyZCBOYXZpZ2F0aW9uXG4gICAgc2VsZi5vbigna2V5ZG93bicsIChlKSA9PiB7IHNlbGYucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uKGUpOyB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5saXN0KSB7XG4gICAgICBpZiAoc2VsZi5saXN0LmNoaWxkcmVuKCkpIHtcbiAgICAgICAgc2VsZi5saXN0LmNoaWxkcmVuKCkuZGV0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gXCJSZW1vdGVcIjtcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gRlRQX1JFTU9URV9FRElUX1VSSTtcbiAgfVxuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMoKSB7XG4gICAgcmV0dXJuIFtcImxlZnRcIiwgXCJyaWdodFwiXTtcbiAgfVxuXG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zaG93T25SaWdodFNpZGUnKSkge1xuICAgICAgcmV0dXJuIFwicmlnaHRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwibGVmdFwiO1xuICAgIH1cbiAgfVxuXG4gIGlzUGVybWFuZW50RG9ja0l0ZW0oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zaG93T25SaWdodFNpZGUnKSkge1xuICAgICAgc2VsZi5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWwoe1xuICAgICAgICBpdGVtOiBzZWxmXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZExlZnRQYW5lbCh7XG4gICAgICAgIGl0ZW06IHNlbGZcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLnBhbmVsKSB7XG4gICAgICBzZWxmLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHNlbGYucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnNob3dJbkRvY2snKSkge1xuICAgICAgYXRvbS53b3Jrc3BhY2UudG9nZ2xlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc2VsZi5pc1Zpc2libGUoKSkge1xuICAgICAgICBzZWxmLmRldGFjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5hdHRhY2goKTtcbiAgICAgICAgc2VsZi5yZXNpemVUb0ZpdENvbnRlbnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5saXN0WzBdLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGYuaGlkZUluZm8oKTtcbiAgICB9XG4gIH1cblxuICBzaG93KCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcywge1xuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICBhY3RpdmF0ZVBhbmU6IHRydWUsXG4gICAgICBhY3RpdmF0ZUl0ZW06IHRydWUsXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9yVVJJKHRoaXMuZ2V0VVJJKCkpLnNob3coKVxuICAgIH0pO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5oaWRlKHRoaXMpXG4gIH1cblxuICBmb2N1cygpIHtcbiAgICAkKHRoaXMpLmZvY3VzKCk7XG4gIH1cblxuICB1bmZvY3VzKCkge1xuICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmFjdGl2YXRlKClcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5lbGVtZW50KTtcbiAgfVxuXG4gIHRvZ2dsZUZvY3VzKCkge1xuICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgIHRoaXMudW5mb2N1cygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dJbmZvKCkge1xuICAgIHRoaXMuaW5mby5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICB9XG5cbiAgaGlkZUluZm8oKSB7XG4gICAgdGhpcy5pbmZvLmhpZGUoKTtcbiAgfVxuXG4gIHJlbG9hZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGYuc2hvd0luZm8oKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5oaWRlSW5mbygpO1xuICAgIH1cblxuICAgIGxldCB0ZW1wID0gc2VsZi5saXN0LmNoaWxkcmVuKCcudGVtcCcpO1xuXG4gICAgc2VsZi5saXN0LmNoaWxkcmVuKCkuZGV0YWNoKCk7XG5cbiAgICBTdG9yYWdlLmdldFRyZWUoKS5jaGlsZHJlbi5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLmNoaWxkcmVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxmLmFkZEZvbGRlcihjb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5hZGRTZXJ2ZXIoY29uZmlnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0ZW1wLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGYubGlzdC5hcHBlbmQodGVtcCk7XG4gICAgfVxuICB9XG5cbiAgYWRkU2VydmVyKGNvbmZpZykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IHNlcnZlciA9IG5ldyBTZXJ2ZXJWaWV3KGNvbmZpZyk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkub24oJ2xvZycsIChtc2cpID0+IHtcbiAgICAgIHNlbGYuZnRwTG9nVmlldy5hZGRMaW5lKG1zZyk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkub24oJ2RlYnVnJywgKGNtZCwgcGFyYW0xLCBwYXJhbTIpID0+IHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5kZXYuZGVidWcnKSkge1xuICAgICAgICBpZiAocGFyYW0xICYmIHBhcmFtMikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGNtZCwgcGFyYW0xLCBwYXJhbTIpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGNtZCwgcGFyYW0xKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQpIGNvbnNvbGUubG9nKGNtZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLmxpc3QuYXBwZW5kKHNlcnZlcik7XG4gICAgc2VsZi5oaWRlSW5mbygpO1xuICB9XG5cbiAgcmVtb3ZlU2VydmVyKHJvb3QpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChyb290LmlzRXhwYW5kZWQoKSkge1xuICAgICAgcm9vdC5jb2xsYXBzZSgpO1xuICAgIH1cbiAgICByb290LmRlc3Ryb3koKTtcblxuICAgIGlmIChzZWxmLmxpc3RbMF0uY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxmLnNob3dJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkRm9sZGVyKGNvbmZpZykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGZvbGRlciA9IG5ldyBGb2xkZXJWaWV3KGNvbmZpZywgc2VsZik7XG5cbiAgICAvLyBFdmVudHNcbiAgICBmb2xkZXIub25EaWRBZGRTZXJ2ZXIgPSAoc2VydmVyKSA9PiB7XG4gICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkub24oJ2xvZycsIChtc2cpID0+IHtcbiAgICAgICAgc2VsZi5mdHBMb2dWaWV3LmFkZExpbmUobXNnKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkub24oJ2RlYnVnJywgKGNtZCwgcGFyYW0xLCBwYXJhbTIpID0+IHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmRldi5kZWJ1ZycpKSB7XG4gICAgICAgICAgaWYgKHBhcmFtMSAmJiBwYXJhbTIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNtZCwgcGFyYW0xLCBwYXJhbTIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjbWQsIHBhcmFtMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjbWQpIGNvbnNvbGUubG9nKGNtZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLmxpc3QuYXBwZW5kKGZvbGRlcik7XG4gICAgc2VsZi5oaWRlSW5mbygpO1xuICB9XG5cbiAgYWRkRGlyZWN0b3J5KHJvb3QsIHJlbGF0aXZlUGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIW9wdGlvbnMucmlnaHRzKSBvcHRpb25zLnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMoJzY0NCcpO1xuXG4gICAgaWYgKHJlbGF0aXZlUGF0aCA9PSAnLycpIHJldHVybiByb290O1xuXG4gICAgbGV0IHRtcCA9IGxlYWRpbmdzbGFzaGl0KHJlbGF0aXZlUGF0aCkuc3BsaXQoJy8nKTtcbiAgICBsZXQgZWxlbWVudCA9IHRtcC5zaGlmdCgpO1xuICAgIGxldCBlbGVtZW50UGF0aCA9IG5vcm1hbGl6ZShyb290LmdldFBhdGgoZmFsc2UpICsgdHJhaWxpbmdzbGFzaGl0KGVsZW1lbnQpKTtcblxuICAgIGxldCBkaXJlY3RvcnkgPSBzZWxmLmZpbmRFbGVtZW50QnlQYXRoKHJvb3QuZ2V0Um9vdCgpLCBlbGVtZW50UGF0aCk7XG4gICAgaWYgKCFkaXJlY3RvcnkpIHtcbiAgICAgIGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnlWaWV3KHJvb3QsIHtcbiAgICAgICAgbmFtZTogZWxlbWVudCxcbiAgICAgICAgcmlnaHRzOiBvcHRpb25zLnJpZ2h0c1xuICAgICAgfSk7XG4gICAgICByb290LmVudHJpZXMuYXBwZW5kKGRpcmVjdG9yeSk7XG5cbiAgICAgIGlmIChyb290LmlzRXhwYW5kZWQoKSkge1xuICAgICAgICByb290LnJlZnJlc2gocm9vdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRtcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5hZGREaXJlY3RvcnkoZGlyZWN0b3J5LCB0bXAuam9pbignLycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRpcmVjdG9yeTtcbiAgICB9XG4gIH1cblxuICBhZGRGaWxlKHJvb3QsIHJlbGF0aXZlUGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIW9wdGlvbnMuc2l6ZSkgb3B0aW9ucy5zaXplID0gMDtcbiAgICBpZiAoIW9wdGlvbnMucmlnaHRzKSBvcHRpb25zLnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMoJzc1NScpO1xuXG4gICAgaWYgKHJlbGF0aXZlUGF0aCA9PSAnLycpIHJldHVybiByb290O1xuXG4gICAgbGV0IHRtcCA9IGxlYWRpbmdzbGFzaGl0KHJlbGF0aXZlUGF0aCkuc3BsaXQoJy8nKTtcbiAgICBsZXQgZWxlbWVudCA9IHRtcC5wb3AoKTtcbiAgICBsZXQgZWxlbWVudFBhdGggPSBub3JtYWxpemUocm9vdC5nZXRQYXRoKGZhbHNlKSArIGVsZW1lbnQpO1xuXG4gICAgaWYgKHRtcC5sZW5ndGggPiAwKSB7XG4gICAgICByb290ID0gc2VsZi5hZGREaXJlY3Rvcnkocm9vdCwgdG1wLmpvaW4oJy8nKSk7XG4gICAgICBlbGVtZW50UGF0aCA9IG5vcm1hbGl6ZShyb290LmdldFBhdGgoZmFsc2UpICsgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBzZWxmLmZpbmRFbGVtZW50QnlQYXRoKHJvb3QuZ2V0Um9vdCgpLCBlbGVtZW50UGF0aCk7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBmaWxlID0gbmV3IEZpbGVWaWV3KHJvb3QsIHtcbiAgICAgICAgbmFtZTogZWxlbWVudCxcbiAgICAgICAgc2l6ZTogb3B0aW9ucy5zaXplLFxuICAgICAgICByaWdodHM6IG9wdGlvbnMucmlnaHRzXG4gICAgICB9KTtcbiAgICAgIHJvb3QuZW50cmllcy5hcHBlbmQoZmlsZSk7XG5cbiAgICAgIGlmIChyb290LmlzRXhwYW5kZWQoKSkge1xuICAgICAgICByb290LnJlZnJlc2gocm9vdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZTtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGV4cGFuZChyb290LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVsYXRpdmVQYXRoID0gbGVhZGluZ3NsYXNoaXQobm9ybWFsaXplKHJlbGF0aXZlUGF0aCkpO1xuICAgICAgaWYgKHJlbGF0aXZlUGF0aCA9PSAnJyB8fCByZWxhdGl2ZVBhdGggPT0gJy8nKSB7XG4gICAgICAgIHJvb3Quc2VsZWN0KCk7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJvb3QuZ2V0Um9vdCgpLmV4cGFuZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBsZXQgYXJyUGF0aCA9IHJlbGF0aXZlUGF0aC5zcGxpdCgnLycpO1xuICAgICAgICBsZXQgZGlyID0gdHJhaWxpbmdzbGFzaGl0KG5vcm1hbGl6ZShyb290LmdldFBhdGgoZmFsc2UpICsgYXJyUGF0aC5zaGlmdCgpKSk7XG4gICAgICAgIGxldCBuZXdSZWxhdGl2ZVBhdGggPSBhcnJQYXRoLmpvaW4oJy8nKTtcblxuICAgICAgICBsZXQgZmluZCA9IHNlbGYuZmluZEVsZW1lbnRCeVBhdGgocm9vdC5nZXRSb290KCksIGRpcik7XG4gICAgICAgIGlmIChmaW5kKSB7XG4gICAgICAgICAgaWYgKGZpbmQuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgICAgICAgZmluZC5leHBhbmQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG5ld1JlbGF0aXZlUGF0aCAmJiBuZXdSZWxhdGl2ZVBhdGggIT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5leHBhbmQoZmluZCwgbmV3UmVsYXRpdmVQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmluZC5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmQuc2VsZWN0KCk7XG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ1BhdGggbm90IGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdldEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtLCByb290LCB0eXBlID0gJ2RpcmVjdG9yeScpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUocGF0aE9uRmlsZVN5c3RlbSwgUGF0aC5zZXApO1xuICAgIGxldCBlbGVtZW50bmFtZSA9IGJhc2VuYW1lKHBhdGhPbkZpbGVTeXN0ZW0sIFBhdGguc2VwKTtcbiAgICBsZXQgZWxlbWVudHBhdGggPSBkaXJuYW1lKHBhdGhPbkZpbGVTeXN0ZW0sIFBhdGguc2VwKSArIGVsZW1lbnRuYW1lO1xuICAgIGxldCBkaXJwYXRoID0gZGlybmFtZShwYXRoT25GaWxlU3lzdGVtLCBQYXRoLnNlcCk7XG5cbiAgICBsZXQgYSA9IHRyYWlsaW5nc2xhc2hpdChwYXRoT25GaWxlU3lzdGVtLCBQYXRoLnNlcCk7XG4gICAgbGV0IGIgPSB0cmFpbGluZ3NsYXNoaXQocm9vdC5nZXRMb2NhbFBhdGgodHJ1ZSksIFBhdGguc2VwKTtcbiAgICBpZiAoYSA9PSBiKSB7XG4gICAgICByZXR1cm4gbmV3IFNlcnZlclZpZXcocm9vdC5jb25maWcsIHJvb3QudHJlZVZpZXcpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgIGlmIChGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZWxlbWVudHBhdGgpKSB7XG4gICAgICAgIGxldCBzdGF0cyA9IEZpbGVTeXN0ZW0uc3RhdFN5bmMoZWxlbWVudHBhdGgpO1xuICAgICAgICBpZiAoc3RhdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEZpbGVWaWV3KHNlbGYuZ2V0RWxlbWVudEJ5TG9jYWxQYXRoKGRpcnBhdGgsIHJvb3QpLCB7XG4gICAgICAgICAgICBuYW1lOiBlbGVtZW50bmFtZSxcbiAgICAgICAgICAgIHBhdGg6IGVsZW1lbnRwYXRoLFxuICAgICAgICAgICAgc2l6ZTogc3RhdHMuc2l6ZSxcbiAgICAgICAgICAgIHJpZ2h0czogbnVsbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgRmlsZVZpZXcoc2VsZi5nZXRFbGVtZW50QnlMb2NhbFBhdGgoZGlycGF0aCwgcm9vdCksIHtcbiAgICAgICAgICAgIG5hbWU6IGVsZW1lbnRuYW1lLFxuICAgICAgICAgICAgcGF0aDogZWxlbWVudHBhdGgsXG4gICAgICAgICAgICBzaXplOiAwLFxuICAgICAgICAgICAgcmlnaHRzOiBudWxsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRmlsZVZpZXcoc2VsZi5nZXRFbGVtZW50QnlMb2NhbFBhdGgoZGlycGF0aCwgcm9vdCksIHtcbiAgICAgICAgICBuYW1lOiBlbGVtZW50bmFtZSxcbiAgICAgICAgICBwYXRoOiBlbGVtZW50cGF0aCxcbiAgICAgICAgICBzaXplOiAwLFxuICAgICAgICAgIHJpZ2h0czogbnVsbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBEaXJlY3RvcnlWaWV3KHNlbGYuZ2V0RWxlbWVudEJ5TG9jYWxQYXRoKGRpcnBhdGgsIHJvb3QpLCB7XG4gICAgICAgIG5hbWU6IGVsZW1lbnRuYW1lLFxuICAgICAgICBwYXRoOiBlbGVtZW50cGF0aCxcbiAgICAgICAgcmlnaHRzOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmaW5kRWxlbWVudEJ5UGF0aChyb290LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBmaW5kID0gcm9vdC5lbnRyaWVzLmZpbmQoJ2xpW2lkPVwiJyArICdmdHAtcmVtb3RlLWVkaXQtJyArIG1kNShyZWxhdGl2ZVBhdGgpICsgJ1wiXScpO1xuICAgIGlmIChmaW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBmaW5kLnZpZXcoKTtcbiAgICB9XG5cbiAgICBmaW5kID0gcm9vdC5lbnRyaWVzLmZpbmQoJ2xpW2lkPVwiJyArICdmdHAtcmVtb3RlLWVkaXQtJyArIG1kNShyZWxhdGl2ZVBhdGggKyAnLycpICsgJ1wiXScpO1xuICAgIGlmIChmaW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBmaW5kLnZpZXcoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZpbmRFbGVtZW50QnlMb2NhbFBhdGgocGF0aE9uRmlsZVN5c3RlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcGF0aE9uRmlsZVN5c3RlbSA9IHRyYWlsaW5nc2xhc2hpdChub3JtYWxpemUocGF0aE9uRmlsZVN5c3RlbSwgUGF0aC5zZXApKTtcblxuICAgIGlmICghU3RvcmFnZS5nZXRTZXJ2ZXJzKCkpIHJldHVybjtcbiAgICBpZiAoIXNlbGYubGlzdCkgcmV0dXJuO1xuXG4gICAgbGV0IGZvdW5kID0gbnVsbDtcbiAgICBTdG9yYWdlLmdldFNlcnZlcnMoKS5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXJWaWV3KGNvbmZpZywgc2VsZik7XG4gICAgICBjb25zdCBwYXRoID0gc2VydmVyLmdldExvY2FsUGF0aCh0cnVlKTtcblxuICAgICAgaWYgKHBhdGhPbkZpbGVTeXN0ZW0uaW5kZXhPZihwYXRoKSAhPSAtMSkge1xuICAgICAgICBjb25zdCBvYmplY3QgPSB7XG4gICAgICAgICAgY29uZmlnOiBzZXJ2ZXIuY29uZmlnLFxuICAgICAgICAgIG5hbWU6IHNlcnZlci5uYW1lLFxuICAgICAgICAgIHBhdGg6IHNlcnZlci5nZXRQYXRoKGZhbHNlKSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgZmluZFJvb3QgPSBzZWxmLmxpc3QuZmluZCgnbGlbaWQ9XCInICsgJ2Z0cC1yZW1vdGUtZWRpdC0nICsgbWQ1KEpTT04uc3RyaW5naWZ5KG9iamVjdCkpICsgJ1wiXScpO1xuICAgICAgICBpZiAoZmluZFJvb3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHJvb3QgPSBmaW5kUm9vdC52aWV3KCk7XG4gICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aE9uRmlsZVN5c3RlbS5yZXBsYWNlKHJvb3QuZ2V0TG9jYWxQYXRoKCksICcnKTtcbiAgICAgICAgICBjb25zdCBmaW5kID0gc2VsZi5maW5kRWxlbWVudEJ5UGF0aChyb290LmdldFJvb3QoKSwgbm9ybWFsaXplKHVubGVhZGluZ3NsYXNoaXQocmVsYXRpdmVQYXRoKSwgJy8nKSk7XG4gICAgICAgICAgaWYgKGZpbmQpIHtcbiAgICAgICAgICAgIGZvdW5kID0gZmluZDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcblxuICB9XG5cbiAgcmVzaXplSG9yaXpvbnRhbFN0YXJ0ZWQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMucmVzaXplV2lkdGhTdGFydCA9IHRoaXMud2lkdGgoKTtcbiAgICB0aGlzLnJlc2l6ZU1vdXNlU3RhcnQgPSBlLnBhZ2VYO1xuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUhvcml6b250YWxWaWV3LmJpbmQodGhpcykpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwJywgdGhpcy5yZXNpemVIb3Jpem9udGFsU3RvcHBlZCk7XG4gIH1cblxuICByZXNpemVIb3Jpem9udGFsU3RvcHBlZCgpIHtcbiAgICBkZWxldGUgdGhpcy5yZXNpemVXaWR0aFN0YXJ0O1xuICAgIGRlbGV0ZSB0aGlzLnJlc2l6ZU1vdXNlU3RhcnQ7XG4gICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUhvcml6b250YWxWaWV3KTtcbiAgICAkKGRvY3VtZW50KS5vZmYoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUhvcml6b250YWxTdG9wcGVkKTtcbiAgfVxuXG4gIHJlc2l6ZUhvcml6b250YWxWaWV3KGUpIHtcbiAgICBpZiAoZS53aGljaCAhPT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzaXplSG9yaXpvbnRhbFN0b3BwZWQoKTtcbiAgICB9XG5cbiAgICBsZXQgZGVsdGEgPSBlLnBhZ2VYIC0gdGhpcy5yZXNpemVNb3VzZVN0YXJ0O1xuICAgIGxldCB3aWR0aCA9IDA7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc2hvd09uUmlnaHRTaWRlJykpIHtcbiAgICAgIHdpZHRoID0gTWF0aC5tYXgoNTAsIHRoaXMucmVzaXplV2lkdGhTdGFydCAtIGRlbHRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSBNYXRoLm1heCg1MCwgdGhpcy5yZXNpemVXaWR0aFN0YXJ0ICsgZGVsdGEpO1xuICAgIH1cblxuICAgIHRoaXMud2lkdGgod2lkdGgpO1xuICB9XG5cbiAgcmVzaXplVG9GaXRDb250ZW50KGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuc2hvd0luRG9jaycpKSB7XG4gICAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcylcbiAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gaW50ZXJuYWwgQVBJIGFjY2Vzc1xuICAgICAgLy8gSXQncyBuZWNlc3NhcnkgYmVjYXVzZSB0aGVyZSdzIG5vIFB1YmxpYyBBUEkgZm9yIGl0IHlldFxuICAgICAgaWYgKHBhbmVDb250YWluZXIgJiYgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9PT0gJ251bWJlcicgJiYgcGFuZUNvbnRhaW5lci53aWR0aE9ySGVpZ2h0ID09ICd3aWR0aCcgJiYgdHlwZW9mIHBhbmVDb250YWluZXIucmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9IDFcbiAgICAgICAgcGFuZUNvbnRhaW5lci5zdGF0ZS5zaXplID0gKHRoaXMubGlzdC5vdXRlcldpZHRoKCkgKyAxMCk7XG4gICAgICAgIHBhbmVDb250YWluZXIucmVuZGVyKHBhbmVDb250YWluZXIuc3RhdGUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud2lkdGgoMSk7XG4gICAgICB0aGlzLndpZHRoKHRoaXMubGlzdC5vdXRlcldpZHRoKCkgKyAxMCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uKGUpIHtcbiAgICBsZXQgYXJyb3dzID0geyBsZWZ0OiAzNywgdXA6IDM4LCByaWdodDogMzksIGRvd246IDQwLCBlbnRlcjogMTMgfTtcbiAgICBsZXQga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIGFycm93cy51cDpcbiAgICAgICAgdGhpcy5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb25VcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYXJyb3dzLmRvd246XG4gICAgICAgIHRoaXMucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uRG93bigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYXJyb3dzLmxlZnQ6XG4gICAgICAgIHRoaXMucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uTGVmdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYXJyb3dzLnJpZ2h0OlxuICAgICAgICB0aGlzLnJlbW90ZUtleWJvYXJkTmF2aWdhdGlvblJpZ2h0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBhcnJvd3MuZW50ZXI6XG4gICAgICAgIHRoaXMucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uRW50ZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb25Nb3ZlUGFnZSgpO1xuICB9XG5cbiAgcmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uVXAoKSB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG4gICAgaWYgKGN1cnJlbnQubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5saXN0LmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gdGhpcy5saXN0LmNoaWxkcmVuKCkubGFzdCgpO1xuICAgICAgICAkKGN1cnJlbnQpLnZpZXcoKS5zZWxlY3QoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbmV4dCA9IGN1cnJlbnQucHJldignLmVudHJ5OnZpc2libGUnKTtcblxuICAgIGlmIChuZXh0Lmxlbmd0aCkge1xuICAgICAgd2hpbGUgKG5leHQuaXMoJy5leHBhbmRlZCcpICYmIG5leHQuZmluZCgnLmVudHJpZXMgLmVudHJ5OnZpc2libGUnKS5sZW5ndGgpIHtcbiAgICAgICAgbmV4dCA9IG5leHQuZmluZCgnLmVudHJpZXMgLmVudHJ5OnZpc2libGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCA9IGN1cnJlbnQuY2xvc2VzdCgnLmVudHJpZXMnKS5jbG9zZXN0KCcuZW50cnk6dmlzaWJsZScpO1xuICAgIH1cbiAgICBpZiAobmV4dC5sZW5ndGgpIHtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBuZXh0Lmxhc3QoKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZW1vdGVLZXlib2FyZE5hdmlnYXRpb25Eb3duKCkge1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuICAgIGlmIChjdXJyZW50Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMubGlzdC5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHRoaXMubGlzdC5jaGlsZHJlbigpLmZpcnN0KCk7XG4gICAgICAgICQoY3VycmVudCkudmlldygpLnNlbGVjdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBuZXh0ID0gY3VycmVudC5maW5kKCcuZW50cmllcyAuZW50cnk6dmlzaWJsZScpO1xuXG4gICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuICAgICAgdG1wID0gY3VycmVudDtcblxuICAgICAgLy8gV29ya2Fyb3VuZCBza2lwIGFmdGVyIDEwXG4gICAgICBsZXQgY291bnRlciA9IDE7XG4gICAgICBkbyB7XG4gICAgICAgIG5leHQgPSB0bXAubmV4dCgnLmVudHJ5OnZpc2libGUnKTtcbiAgICAgICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuICAgICAgICAgIHRtcCA9IHRtcC5jbG9zZXN0KCcuZW50cmllcycpLmNsb3Nlc3QoJy5lbnRyeTp2aXNpYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfSB3aGlsZSAoIW5leHQubGVuZ3RoICYmICF0bXAuaXMoJy5wcm9qZWN0LXJvb3QnKSAmJiBjb3VudGVyIDwgMTApO1xuICAgIH1cbiAgICBpZiAobmV4dC5sZW5ndGgpIHtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBuZXh0LmZpcnN0KCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uTGVmdCgpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKGN1cnJlbnQuaXMoJy5maWxlJykpIHtcbiAgICAgIHBhcmVudCA9IGN1cnJlbnQudmlldygpLnBhcmVudC52aWV3KCk7XG4gICAgICBwYXJlbnQuY29sbGFwc2UoKTtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBwYXJlbnQuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50LmlzKCcuZGlyZWN0b3J5JykgJiYgY3VycmVudC52aWV3KCkuaXNFeHBhbmRlZCgpKSB7XG4gICAgICBjdXJyZW50LnZpZXcoKS5jb2xsYXBzZSgpO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudC5pcygnLmRpcmVjdG9yeScpICYmICFjdXJyZW50LnZpZXcoKS5pc0V4cGFuZGVkKCkpIHtcbiAgICAgIHBhcmVudCA9IGN1cnJlbnQudmlldygpLnBhcmVudC52aWV3KCk7XG4gICAgICBwYXJlbnQuY29sbGFwc2UoKTtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBwYXJlbnQuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50LmlzKCcuZm9sZGVyJykgJiYgY3VycmVudC52aWV3KCkuaXNFeHBhbmRlZCgpKSB7XG4gICAgICBjdXJyZW50LnZpZXcoKS5jb2xsYXBzZSgpO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudC5pcygnLmZvbGRlcicpICYmICFjdXJyZW50LnZpZXcoKS5pc0V4cGFuZGVkKCkgJiYgY3VycmVudC52aWV3KCkucGFyZW50LmlzKCcuZm9sZGVyJykpIHtcbiAgICAgIHBhcmVudCA9IGN1cnJlbnQudmlldygpLnBhcmVudC52aWV3KCk7XG4gICAgICBwYXJlbnQuY29sbGFwc2UoKTtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBwYXJlbnQuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50LmlzKCcuc2VydmVyJykpIHtcbiAgICAgIGlmIChjdXJyZW50LnZpZXcoKS5pc0V4cGFuZGVkKCkpIHtcbiAgICAgICAgY3VycmVudC52aWV3KCkuY29sbGFwc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW1vdGVLZXlib2FyZE5hdmlnYXRpb25SaWdodCgpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKGN1cnJlbnQuaXMoJy5kaXJlY3RvcnknKSB8fCBjdXJyZW50LmlzKCcuc2VydmVyJykgfHwgY3VycmVudC5pcygnLmZvbGRlcicpKSB7XG4gICAgICBpZiAoIWN1cnJlbnQudmlldygpLmlzRXhwYW5kZWQoKSkge1xuICAgICAgICBjdXJyZW50LnZpZXcoKS5leHBhbmQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGN1cnJlbnQuaXMoJy5maWxlJykpIHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2Z0cC1yZW1vdGUtZWRpdDpvcGVuLWZpbGUtcGVuZGluZycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnZnRwLXJlbW90ZS1lZGl0Om9wZW4tZmlsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbk1vdmVQYWdlKCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoY3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc2Nyb2xsZXJUb3AgPSB0aGlzLnNjcm9sbGVyLnNjcm9sbFRvcCgpLFxuICAgICAgICBzZWxlY3RlZFRvcCA9IGN1cnJlbnQucG9zaXRpb24oKS50b3A7XG4gICAgICBpZiAoc2VsZWN0ZWRUb3AgPCBzY3JvbGxlclRvcCAtIDEwKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXIucGFnZVVwKCk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkVG9wID4gc2Nyb2xsZXJUb3AgKyB0aGlzLnNjcm9sbGVyLmhlaWdodCgpIC0gMTApIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlci5wYWdlRG93bigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbkVudGVyKCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoY3VycmVudC5pcygnLmRpcmVjdG9yeScpIHx8IGN1cnJlbnQuaXMoJy5zZXJ2ZXInKSkge1xuICAgICAgaWYgKCFjdXJyZW50LnZpZXcoKS5pc0V4cGFuZGVkKCkpIHtcbiAgICAgICAgY3VycmVudC52aWV3KCkuZXhwYW5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50LnZpZXcoKS5jb2xsYXBzZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VycmVudC5pcygnLmZpbGUnKSkge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykpIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnZnRwLXJlbW90ZS1lZGl0Om9wZW4tZmlsZS1wZW5kaW5nJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdmdHAtcmVtb3RlLWVkaXQ6b3Blbi1maWxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZVZpZXc7XG4iXX0=