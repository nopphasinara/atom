Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _viewsConfigurationView = require('./views/configuration-view');

var _viewsConfigurationView2 = _interopRequireDefault(_viewsConfigurationView);

var _viewsPermissionsView = require('./views/permissions-view');

var _viewsPermissionsView2 = _interopRequireDefault(_viewsPermissionsView);

var _viewsTreeView = require('./views/tree-view');

var _viewsTreeView2 = _interopRequireDefault(_viewsTreeView);

var _viewsProtocolView = require('./views/protocol-view');

var _viewsProtocolView2 = _interopRequireDefault(_viewsProtocolView);

var _viewsFinderView = require('./views/finder-view');

var _viewsFinderView2 = _interopRequireDefault(_viewsFinderView);

var _dialogsChangePassDialogJs = require('./dialogs/change-pass-dialog.js');

var _dialogsChangePassDialogJs2 = _interopRequireDefault(_dialogsChangePassDialogJs);

var _dialogsPromptPassDialogJs = require('./dialogs/prompt-pass-dialog.js');

var _dialogsPromptPassDialogJs2 = _interopRequireDefault(_dialogsPromptPassDialogJs);

var _dialogsAddDialogJs = require('./dialogs/add-dialog.js');

var _dialogsAddDialogJs2 = _interopRequireDefault(_dialogsAddDialogJs);

var _dialogsRenameDialogJs = require('./dialogs/rename-dialog.js');

var _dialogsRenameDialogJs2 = _interopRequireDefault(_dialogsRenameDialogJs);

var _dialogsFindDialogJs = require('./dialogs/find-dialog.js');

var _dialogsFindDialogJs2 = _interopRequireDefault(_dialogsFindDialogJs);

var _dialogsDuplicateDialog = require('./dialogs/duplicate-dialog');

var _dialogsDuplicateDialog2 = _interopRequireDefault(_dialogsDuplicateDialog);

var _atom = require('atom');

var _helperSecureJs = require('./helper/secure.js');

var _helperFormatJs = require('./helper/format.js');

var _helperHelperJs = require('./helper/helper.js');

'use babel';

var config = require('./config/config-schema.json');
var server_config = require('./config/server-schema.json');

var atom = global.atom;
var Electron = require('electron');
var Path = require('path');
var FileSystem = require('fs-plus');
var getIconServices = require('./helper/icon.js');
var Queue = require('./helper/queue.js');
var Storage = require('./helper/storage.js');

require('events').EventEmitter.defaultMaxListeners = 0;

var FtpRemoteEdit = (function () {
  function FtpRemoteEdit() {
    _classCallCheck(this, FtpRemoteEdit);

    var self = this;

    self.info = [];
    self.config = config;
    self.subscriptions = null;

    self.treeView = null;
    self.protocolView = null;
    self.configurationView = null;
    self.finderView = null;
  }

  _createClass(FtpRemoteEdit, [{
    key: 'activate',
    value: function activate() {
      var self = this;

      self.treeView = new _viewsTreeView2['default']();
      self.protocolView = new _viewsProtocolView2['default']();

      // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
      self.subscriptions = new _atom.CompositeDisposable();

      // Register command that toggles this view
      self.subscriptions.add(atom.commands.add('atom-workspace', {
        'ftp-remote-edit:toggle': function ftpRemoteEditToggle() {
          return self.toggle();
        },
        'ftp-remote-edit:toggle-focus': function ftpRemoteEditToggleFocus() {
          return self.toggleFocus();
        },
        'ftp-remote-edit:show': function ftpRemoteEditShow() {
          return self.show();
        },
        'ftp-remote-edit:hide': function ftpRemoteEditHide() {
          return self.hide();
        },
        'ftp-remote-edit:unfocus': function ftpRemoteEditUnfocus() {
          return self.treeView.unfocus();
        },
        'ftp-remote-edit:edit-servers': function ftpRemoteEditEditServers() {
          return self.configuration();
        },
        'ftp-remote-edit:change-password': function ftpRemoteEditChangePassword() {
          return self.changePassword();
        },
        'ftp-remote-edit:open-file': function ftpRemoteEditOpenFile() {
          return self.open();
        },
        'ftp-remote-edit:open-file-pending': function ftpRemoteEditOpenFilePending() {
          return self.open(true);
        },
        'ftp-remote-edit:new-file': function ftpRemoteEditNewFile() {
          return self.create('file');
        },
        'ftp-remote-edit:new-directory': function ftpRemoteEditNewDirectory() {
          return self.create('directory');
        },
        'ftp-remote-edit:duplicate': function ftpRemoteEditDuplicate() {
          return self.duplicate();
        },
        'ftp-remote-edit:delete': function ftpRemoteEditDelete() {
          return self['delete']();
        },
        'ftp-remote-edit:rename': function ftpRemoteEditRename() {
          return self.rename();
        },
        'ftp-remote-edit:copy': function ftpRemoteEditCopy() {
          return self.copy();
        },
        'ftp-remote-edit:cut': function ftpRemoteEditCut() {
          return self.cut();
        },
        'ftp-remote-edit:paste': function ftpRemoteEditPaste() {
          return self.paste();
        },
        'ftp-remote-edit:chmod': function ftpRemoteEditChmod() {
          return self.chmod();
        },
        'ftp-remote-edit:upload-file': function ftpRemoteEditUploadFile() {
          return self.upload('file');
        },
        'ftp-remote-edit:upload-directory': function ftpRemoteEditUploadDirectory() {
          return self.upload('directory');
        },
        'ftp-remote-edit:download': function ftpRemoteEditDownload() {
          return self.download();
        },
        'ftp-remote-edit:reload': function ftpRemoteEditReload() {
          return self.reload();
        },
        'ftp-remote-edit:find-remote-path': function ftpRemoteEditFindRemotePath() {
          return self.findRemotePath();
        },
        'ftp-remote-edit:copy-remote-path': function ftpRemoteEditCopyRemotePath() {
          return self.copyRemotePath();
        },
        'ftp-remote-edit:finder': function ftpRemoteEditFinder() {
          return self.remotePathFinder();
        },
        'ftp-remote-edit:finder-reindex-cache': function ftpRemoteEditFinderReindexCache() {
          return self.remotePathFinder(true);
        },
        'ftp-remote-edit:add-temp-server': function ftpRemoteEditAddTempServer() {
          return self.addTempServer();
        },
        'ftp-remote-edit:remove-temp-server': function ftpRemoteEditRemoveTempServer() {
          return self.removeTempServer();
        }
      }));

      // Events
      atom.config.onDidChange('ftp-remote-edit.config', function () {
        if (Storage.getPassword()) {
          Storage.load(true);
          self.treeView.reload();
        }
      });

      // Drag & Drop
      self.treeView.on('drop', function (e) {
        self.drop(e);
      });

      // Auto Reveal Active File
      atom.workspace.getCenter().onDidStopChangingActivePaneItem(function (item) {
        self.autoRevealActiveFile();
      });

      // workaround to activate core.allowPendingPaneItems if ftp-remote-edit.tree.allowPendingPaneItems is activated
      atom.config.onDidChange('ftp-remote-edit.tree.allowPendingPaneItems', function (_ref) {
        var newValue = _ref.newValue;
        var oldValue = _ref.oldValue;

        if (newValue == true && !atom.config.get('core.allowPendingPaneItems')) {
          atom.config.set('core.allowPendingPaneItems', true);
        }
      });
      if (atom.config.get('ftp-remote-edit.tree.allowPendingPaneItems')) {
        atom.config.set('core.allowPendingPaneItems', true);
      }

      // Toggle on startup
      atom.packages.onDidActivatePackage(function (activatePackage) {
        if (activatePackage.name == 'ftp-remote-edit') {
          if (atom.config.get('ftp-remote-edit.tree.toggleOnStartup')) {
            self.toggle();
          }
        }
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      var self = this;

      if (self.subscriptions) {
        self.subscriptions.dispose();
        self.subscriptions = null;
      }

      if (self.treeView) {
        self.treeView.destroy();
      }

      if (self.protocolView) {
        self.protocolView.destroy();
      }

      if (self.configurationView) {
        self.configurationView.destroy();
      }

      if (self.finderView) {
        finderView.destroy();
      }
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {};
    }
  }, {
    key: 'handleURI',
    value: function handleURI(parsedUri) {
      var self = this;

      var regex = /(\/)?([a-z0-9_\-]{1,5}:\/\/)(([^:]{1,})((:(.{1,}))?[\@\x40]))?([a-z0-9_\-.]+)(:([0-9]*))?(.*)/gi;
      var is_matched = parsedUri.path.match(regex);

      if (is_matched) {

        if (!self.treeView.isVisible()) {
          self.toggle();
        }

        var matched = regex.exec(parsedUri.path);

        var protocol = matched[2];
        var username = matched[4] !== undefined ? decodeURIComponent(matched[4]) : '';
        var password = matched[7] !== undefined ? decodeURIComponent(matched[7]) : '';
        var host = matched[8] !== undefined ? matched[8] : '';
        var port = matched[10] !== undefined ? matched[10] : '';
        var path = matched[11] !== undefined ? decodeURIComponent(matched[11]) : "/";

        var newconfig = JSON.parse(JSON.stringify(server_config));
        newconfig.name = username ? protocol + username + '@' + host : protocol + host;
        newconfig.host = host;
        newconfig.port = port ? port : protocol == 'sftp://' ? '22' : '21';
        newconfig.user = username;
        newconfig.password = password;
        newconfig.sftp = protocol == 'sftp://';
        newconfig.remote = path;
        newconfig.temp = true;

        (0, _helperHelperJs.logDebug)("Adding new server by uri handler", newconfig);

        self.treeView.addServer(newconfig);
      }
    }
  }, {
    key: 'openRemoteFile',
    value: function openRemoteFile() {
      var self = this;

      return function (file) {
        var selected = self.treeView.list.find('.selected');

        if (selected.length === 0) return;

        var root = selected.view().getRoot();
        var localPath = (0, _helperFormatJs.normalize)(root.getLocalPath());
        localPath = (0, _helperFormatJs.normalize)(Path.join(localPath.slice(0, localPath.lastIndexOf(root.getPath())), file).replace(/\/+/g, Path.sep), Path.sep);

        try {
          var _file = self.treeView.getElementByLocalPath(localPath, root, 'file');
          self.openFile(_file);

          return true;
        } catch (ex) {
          (0, _helperHelperJs.logDebug)(ex);

          return false;
        }
      };
    }
  }, {
    key: 'getCurrentServerName',
    value: function getCurrentServerName() {
      var self = this;

      return function () {
        return new Promise(function (resolve, reject) {
          var selected = self.treeView.list.find('.selected');
          if (selected.length === 0) reject('noservers');

          var root = selected.view().getRoot();
          resolve(root.name);
        });
      };
    }
  }, {
    key: 'getCurrentServerConfig',
    value: function getCurrentServerConfig() {
      var self = this;

      return function (reasonForRequest) {
        return new Promise(function (resolve, reject) {
          if (!reasonForRequest) {
            reject('noreasongiven');
            return;
          }

          var selected = self.treeView.list.find('.selected');
          if (selected.length === 0) {
            reject('noservers');
            return;
          }

          if (!Storage.hasPassword()) {
            reject('nopassword');
            return;
          }

          var root = selected.view().getRoot();
          var buttondismiss = false;

          if ((0, _helperSecureJs.isInBlackList)(Storage.getPassword(), reasonForRequest)) {
            reject('userdeclined');
            return;
          }
          if ((0, _helperSecureJs.isInWhiteList)(Storage.getPassword(), reasonForRequest)) {
            resolve(root.config);
            return;
          }

          var caution = 'Decline this message if you did not initiate a request to share your server configuration with a pacakge!';
          var notif = atom.notifications.addWarning('Server Configuration Requested', {
            detail: reasonForRequest + '\n-------------------------------\n' + caution,
            dismissable: true,
            buttons: [{
              text: 'Always',
              onDidClick: function onDidClick() {
                buttondismiss = true;
                notif.dismiss();
                (0, _helperSecureJs.addToWhiteList)(Storage.getPassword(), reasonForRequest);
                resolve(root.config);
              }
            }, {
              text: 'Accept',
              onDidClick: function onDidClick() {
                buttondismiss = true;
                notif.dismiss();
                resolve(root.config);
              }
            }, {
              text: 'Decline',
              onDidClick: function onDidClick() {
                buttondismiss = true;
                notif.dismiss();
                reject('userdeclined');
              }
            }, {
              text: 'Never',
              onDidClick: function onDidClick() {
                buttondismiss = true;
                notif.dismiss();
                (0, _helperSecureJs.addToBlackList)(Storage.getPassword(), reasonForRequest);
                reject('userdeclined');
              }
            }]
          });

          var disposable = notif.onDidDismiss(function () {
            if (!buttondismiss) reject('userdeclined');
            disposable.dispose();
          });
        });
      };
    }
  }, {
    key: 'consumeElementIcons',
    value: function consumeElementIcons(service) {
      getIconServices().setElementIcons(service);

      return new _atom.Disposable(function () {
        getIconServices().resetElementIcons();
      });
    }
  }, {
    key: 'promtPassword',
    value: function promtPassword() {
      var self = this;
      var dialog = new _dialogsPromptPassDialogJs2['default']();

      var promise = new Promise(function (resolve, reject) {
        dialog.on('dialog-done', function (e, password) {
          if ((0, _helperSecureJs.checkPassword)(password)) {
            Storage.setPassword(password);
            dialog.close();

            resolve(true);
          } else {
            dialog.showError('Wrong password, try again!');
          }
        });

        dialog.attach();
      });

      return promise;
    }
  }, {
    key: 'changePassword',
    value: function changePassword(mode) {
      var self = this;

      var options = {};
      if (mode == 'add') {
        options.mode = 'add';
        options.prompt = 'Enter the master password. All information about your server settings will be encrypted with this password.';
      } else {
        options.mode = 'change';
      }

      var dialog = new _dialogsChangePassDialogJs2['default'](options);
      var promise = new Promise(function (resolve, reject) {
        dialog.on('dialog-done', function (e, passwords) {

          // Check that password from new master password can decrypt current config
          if (mode == 'add') {
            var configHash = atom.config.get('ftp-remote-edit.config');
            if (configHash) {
              var newPassword = passwords.newPassword;
              var testConfig = (0, _helperSecureJs.decrypt)(newPassword, configHash);

              try {
                var testJson = JSON.parse(testConfig);
              } catch (e) {
                // If master password does not decrypt current config,
                // prompt the user to reply to insert correct password
                // or reset config content
                (0, _helperHelperJs.showMessage)('Master password does not match with previous used. Please retry or delete "config" entry in ftp-remote-edit configuration node.', 'error');

                dialog.close();
                resolve(false);
                return;
              }
            }
          }

          var oldPasswordValue = mode == 'add' ? passwords.newPassword : passwords.oldPassword;

          (0, _helperSecureJs.changePassword)(oldPasswordValue, passwords.newPassword).then(function () {
            Storage.setPassword(passwords.newPassword);

            if (mode != 'add') {
              (0, _helperHelperJs.showMessage)('Master password successfully changed. Please restart atom!', 'success');
            }
            resolve(true);
          });

          dialog.close();
        });

        dialog.attach();
      });

      return promise;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var self = this;

      if (!Storage.hasPassword()) {
        if (!(0, _helperSecureJs.checkPasswordExists)()) {
          self.changePassword('add').then(function (returnValue) {
            if (returnValue) {
              if (Storage.load()) {
                self.treeView.reload();
                self.treeView.toggle();
              }
            }
          });
          return;
        } else {
          self.promtPassword().then(function () {
            if (Storage.load()) {
              self.treeView.reload();
              self.treeView.toggle();
            }
          });
          return;
        }
      } else if (!Storage.loaded && Storage.load()) {
        self.treeView.reload();
      }
      self.treeView.toggle();
    }
  }, {
    key: 'toggleFocus',
    value: function toggleFocus() {
      var self = this;

      if (!Storage.hasPassword()) {
        self.toggle();
      } else {
        self.treeView.toggleFocus();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var self = this;

      if (!Storage.hasPassword()) {
        self.toggle();
      } else {
        self.treeView.show();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      var self = this;

      self.treeView.hide();
    }
  }, {
    key: 'configuration',
    value: function configuration() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      var root = null;
      if (selected.length !== 0) {
        root = selected.view().getRoot();
      };

      if (self.configurationView == null) {
        self.configurationView = new _viewsConfigurationView2['default']();
      }

      if (!Storage.hasPassword()) {
        self.promtPassword().then(function () {
          if (Storage.load()) {
            self.configurationView.reload(root);
            self.configurationView.attach();
          }
        });
        return;
      }

      self.configurationView.reload(root);
      self.configurationView.attach();
    }
  }, {
    key: 'addTempServer',
    value: function addTempServer() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      var root = null;
      if (selected.length !== 0) {
        root = selected.view().getRoot();
        root.config.temp = false;
        self.treeView.removeServer(selected.view());
        Storage.addServer(root.config);
        Storage.save();
      };
    }
  }, {
    key: 'removeTempServer',
    value: function removeTempServer() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length !== 0) {
        self.treeView.removeServer(selected.view());
      };
    }
  }, {
    key: 'open',
    value: function open() {
      var pending = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        var file = selected.view();
        if (file) {
          self.openFile(file, pending);
        }
      } else if (selected.view().is('.directory')) {
        var _directory = selected.view();
        if (_directory) {
          self.openDirectory(_directory);
        }
      }
    }
  }, {
    key: 'openFile',
    value: function openFile(file) {
      var pending = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(file.getPath(true) + file.name);
      var fullLocalPath = (0, _helperFormatJs.normalize)(file.getLocalPath(true) + file.name, Path.sep);

      // Check if file is already opened in texteditor
      if ((0, _helperHelperJs.getTextEditor)(fullLocalPath, true)) {
        atom.workspace.open(fullLocalPath, { pending: pending, searchAllPanes: true });
        return false;
      }

      self.downloadFile(file.getRoot(), fullRelativePath, fullLocalPath, { filesize: file.size }).then(function () {
        // Open file and add handler to editor to upload file on save
        return self.openFileInEditor(file, pending);
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err, 'error');
      });
    }
  }, {
    key: 'openDirectory',
    value: function openDirectory(directory) {
      var self = this;

      directory.expand();
    }
  }, {
    key: 'create',
    value: function create(type) {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        directory = selected.view().parent;
      } else {
        directory = selected.view();
      }

      if (directory) {
        if (type == 'file') {
          (function () {
            var dialog = new _dialogsAddDialogJs2['default'](directory.getPath(false), true);
            dialog.on('new-path', function (e, relativePath) {
              if (relativePath) {
                self.createFile(directory, relativePath);
                dialog.close();
              }
            });
            dialog.attach();
          })();
        } else if (type == 'directory') {
          (function () {
            var dialog = new _dialogsAddDialogJs2['default'](directory.getPath(false), false);
            dialog.on('new-path', function (e, relativePath) {
              if (relativePath) {
                self.createDirectory(directory, relativePath);
                dialog.close();
              }
            });
            dialog.attach();
          })();
        }
      }
    }
  }, {
    key: 'createFile',
    value: function createFile(directory, relativePath) {
      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(directory.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(directory.getRoot().getLocalPath(true) + relativePath, Path.sep);

      try {
        // create local file
        if (!FileSystem.existsSync(fullLocalPath)) {
          // Create local Directory
          (0, _helperHelperJs.createLocalPath)(fullLocalPath);
          FileSystem.writeFileSync(fullLocalPath, '');
        }
      } catch (err) {
        (0, _helperHelperJs.showMessage)(err, 'error');
        return false;
      }

      directory.getConnector().existsFile(fullRelativePath).then(function () {
        (0, _helperHelperJs.showMessage)('File ' + relativePath.trim() + ' already exists', 'error');
      })['catch'](function () {
        self.uploadFile(directory, fullLocalPath, fullRelativePath, false).then(function (duplicatedFile) {
          if (duplicatedFile) {
            // Open file and add handler to editor to upload file on save
            return self.openFileInEditor(duplicatedFile);
          }
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err, 'error');
        });
      });
    }
  }, {
    key: 'createDirectory',
    value: function createDirectory(directory, relativePath) {
      var self = this;

      relativePath = (0, _helperFormatJs.trailingslashit)(relativePath);
      var fullRelativePath = (0, _helperFormatJs.normalize)(directory.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(directory.getRoot().getLocalPath(true) + relativePath, Path.sep);

      // create local directory
      try {
        if (!FileSystem.existsSync(fullLocalPath)) {
          (0, _helperHelperJs.createLocalPath)(fullLocalPath);
        }
      } catch (err) {}

      directory.getConnector().existsDirectory(fullRelativePath).then(function (result) {
        (0, _helperHelperJs.showMessage)('Directory ' + relativePath.trim() + ' already exists', 'error');
      })['catch'](function (err) {
        return directory.getConnector().createDirectory(fullRelativePath).then(function (result) {
          // Add to tree
          var element = self.treeView.addDirectory(directory.getRoot(), relativePath);
          if (element.isVisible()) {
            element.select();
          }
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err.message, 'error');
        });
      });
    }
  }, {
    key: 'rename',
    value: function rename() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            (function () {
              var dialog = new _dialogsRenameDialogJs2['default'](file.getPath(false) + file.name, true);
              dialog.on('new-path', function (e, relativePath) {
                if (relativePath) {
                  self.renameFile(file, relativePath);
                  dialog.close();
                }
              });
              dialog.attach();
            })();
          }
        })();
      } else if (selected.view().is('.directory')) {
        (function () {
          var directory = selected.view();
          if (directory) {
            (function () {
              var dialog = new _dialogsRenameDialogJs2['default']((0, _helperFormatJs.trailingslashit)(directory.getPath(false)), false);
              dialog.on('new-path', function (e, relativePath) {
                if (relativePath) {
                  self.renameDirectory(directory, relativePath);
                  dialog.close();
                }
              });
              dialog.attach();
            })();
          }
        })();
      }
    }
  }, {
    key: 'renameFile',
    value: function renameFile(file, relativePath) {
      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(file.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(file.getRoot().getLocalPath(true) + relativePath, Path.sep);

      file.getConnector().rename(file.getPath(true) + file.name, fullRelativePath).then(function () {
        // Refresh cache
        file.getRoot().getFinderCache().renameFile((0, _helperFormatJs.normalize)(file.getPath(false) + file.name), (0, _helperFormatJs.normalize)(relativePath), file.size);

        // Add to tree
        var element = self.treeView.addFile(file.getRoot(), relativePath, { size: file.size, rights: file.rights });
        if (element.isVisible()) {
          element.select();
        }

        // Check if file is already opened in texteditor
        var found = (0, _helperHelperJs.getTextEditor)(file.getLocalPath(true) + file.name);
        if (found) {
          element.addClass('open');
          found.saveObject = element;
          found.saveAs(element.getLocalPath(true) + element.name);
        }

        // Move local file
        (0, _helperHelperJs.moveLocalPath)(file.getLocalPath(true) + file.name, fullLocalPath);

        // Remove old file from tree
        if (file) file.remove();
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'renameDirectory',
    value: function renameDirectory(directory, relativePath) {
      var self = this;

      relativePath = (0, _helperFormatJs.trailingslashit)(relativePath);
      var fullRelativePath = (0, _helperFormatJs.normalize)(directory.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(directory.getRoot().getLocalPath(true) + relativePath, Path.sep);

      directory.getConnector().rename(directory.getPath(), fullRelativePath).then(function () {
        // Refresh cache
        directory.getRoot().getFinderCache().renameDirectory((0, _helperFormatJs.normalize)(directory.getPath(false)), (0, _helperFormatJs.normalize)(relativePath + '/'));

        // Add to tree
        var element = self.treeView.addDirectory(directory.getRoot(), relativePath, { rights: directory.rights });
        if (element.isVisible()) {
          element.select();
        }

        // TODO
        // Check if files are already opened in texteditor

        // Move local directory
        (0, _helperHelperJs.moveLocalPath)(directory.getLocalPath(true), fullLocalPath);

        // Remove old directory from tree
        if (directory) directory.remove();
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'duplicate',
    value: function duplicate() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            (function () {
              var dialog = new _dialogsDuplicateDialog2['default'](file.getPath(false) + file.name);
              dialog.on('new-path', function (e, relativePath) {
                if (relativePath) {
                  self.duplicateFile(file, relativePath);
                  dialog.close();
                }
              });
              dialog.attach();
            })();
          }
        })();
      } else if (selected.view().is('.directory')) {
        // TODO
        // let directory = selected.view();
        // if (directory) {
        //   const dialog = new DuplicateDialog(trailingslashit(directory.getPath(false)));
        //   dialog.on('new-path', (e, relativePath) => {
        //     if (relativePath) {
        //       self.duplicateDirectory(directory, relativePath);
        //       dialog.close();
        //     }
        //   });
        //   dialog.attach();
        // }
      }
    }
  }, {
    key: 'duplicateFile',
    value: function duplicateFile(file, relativePath) {
      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(file.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(file.getRoot().getLocalPath(true) + relativePath, Path.sep);

      file.getConnector().existsFile(fullRelativePath).then(function () {
        (0, _helperHelperJs.showMessage)('File ' + relativePath.trim() + ' already exists', 'error');
      })['catch'](function () {
        self.downloadFile(file.getRoot(), file.getPath(true) + file.name, fullLocalPath, { filesize: file.size }).then(function () {
          self.uploadFile(file.getRoot(), fullLocalPath, fullRelativePath).then(function (duplicatedFile) {
            if (duplicatedFile) {
              // Open file and add handler to editor to upload file on save
              return self.openFileInEditor(duplicatedFile);
            }
          })['catch'](function (err) {
            (0, _helperHelperJs.showMessage)(err, 'error');
          });
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err, 'error');
        });
      });
    }
  }, {
    key: 'duplicateDirectory',
    value: function duplicateDirectory(directory, relativePath) {
      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(directory.getRoot().getPath(true) + relativePath);
      var fullLocalPath = (0, _helperFormatJs.normalize)(directory.getRoot().getLocalPath(true) + relativePath, Path.sep);

      // TODO
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            atom.confirm({
              message: 'Are you sure you want to delete this file?',
              detailedMessage: "You are deleting:\n" + file.getPath(false) + file.name,
              buttons: {
                Yes: function Yes() {
                  self.deleteFile(file);
                },
                Cancel: function Cancel() {
                  return true;
                }
              }
            });
          }
        })();
      } else if (selected.view().is('.directory')) {
        (function () {
          var directory = selected.view();
          if (directory) {
            atom.confirm({
              message: 'Are you sure you want to delete this folder?',
              detailedMessage: "You are deleting:\n" + (0, _helperFormatJs.trailingslashit)(directory.getPath(false)),
              buttons: {
                Yes: function Yes() {
                  self.deleteDirectory(directory, true);
                },
                Cancel: function Cancel() {
                  return true;
                }
              }
            });
          }
        })();
      }
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(file) {
      var self = this;

      var fullLocalPath = (0, _helperFormatJs.normalize)(file.getLocalPath(true) + file.name, Path.sep);

      file.getConnector().deleteFile(file.getPath(true) + file.name).then(function () {
        // Refresh cache
        file.getRoot().getFinderCache().deleteFile((0, _helperFormatJs.normalize)(file.getPath(false) + file.name));

        // Delete local file
        try {
          if (FileSystem.existsSync(fullLocalPath)) {
            FileSystem.unlinkSync(fullLocalPath);
          }
        } catch (err) {}

        file.parent.select();
        file.destroy();
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'deleteDirectory',
    value: function deleteDirectory(directory, recursive) {
      var self = this;

      directory.getConnector().deleteDirectory(directory.getPath(), recursive).then(function () {
        // Refresh cache
        directory.getRoot().getFinderCache().deleteDirectory((0, _helperFormatJs.normalize)(directory.getPath(false)));

        var fullLocalPath = directory.getLocalPath(true).replace(/\/+/g, Path.sep);

        // Delete local directory
        (0, _helperHelperJs.deleteLocalPath)(fullLocalPath);

        directory.parent.select();
        directory.destroy();
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'chmod',
    value: function chmod() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            var permissionsView = new _viewsPermissionsView2['default'](file);
            permissionsView.on('change-permissions', function (e, result) {
              self.chmodFile(file, result.permissions);
            });
            permissionsView.attach();
          }
        })();
      } else if (selected.view().is('.directory')) {
        (function () {
          var directory = selected.view();
          if (directory) {
            var permissionsView = new _viewsPermissionsView2['default'](directory);
            permissionsView.on('change-permissions', function (e, result) {
              self.chmodDirectory(directory, result.permissions);
            });
            permissionsView.attach();
          }
        })();
      }
    }
  }, {
    key: 'chmodFile',
    value: function chmodFile(file, permissions) {
      var self = this;

      file.getConnector().chmodFile(file.getPath(true) + file.name, permissions).then(function (responseText) {
        file.rights = (0, _helperHelperJs.permissionsToRights)(permissions);
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'chmodDirectory',
    value: function chmodDirectory(directory, permissions) {
      var self = this;

      directory.getConnector().chmodDirectory(directory.getPath(true), permissions).then(function (responseText) {
        directory.rights = (0, _helperHelperJs.permissionsToRights)(permissions);
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }, {
    key: 'reload',
    value: function reload() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        var file = selected.view();
        if (file) {
          self.reloadFile(file);
        }
      } else if (selected.view().is('.directory') || selected.view().is('.server')) {
        var _directory2 = selected.view();
        if (_directory2) {
          self.reloadDirectory(_directory2);
        }
      }
    }
  }, {
    key: 'reloadFile',
    value: function reloadFile(file) {
      var self = this;

      var fullRelativePath = (0, _helperFormatJs.normalize)(file.getPath(true) + file.name);
      var fullLocalPath = (0, _helperFormatJs.normalize)(file.getLocalPath(true) + file.name, Path.sep);

      // Check if file is already opened in texteditor
      if ((0, _helperHelperJs.getTextEditor)(fullLocalPath, true)) {
        self.downloadFile(file.getRoot(), fullRelativePath, fullLocalPath, { filesize: file.size })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err, 'error');
        });
      }
    }
  }, {
    key: 'reloadDirectory',
    value: function reloadDirectory(directory) {
      var self = this;

      directory.expanded = false;
      directory.expand();
    }
  }, {
    key: 'copy',
    value: function copy() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var element = selected.view();
      if (element.is('.file')) {
        var storage = element.serialize();
        window.sessionStorage.removeItem('ftp-remote-edit:cutPath');
        window.sessionStorage['ftp-remote-edit:copyPath'] = (0, _helperSecureJs.encrypt)(Storage.getPassword(), JSON.stringify(storage));
      } else if (element.is('.directory')) {
        // TODO
      }
    }
  }, {
    key: 'cut',
    value: function cut() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var element = selected.view();

      if (element.is('.file') || element.is('.directory')) {
        var storage = element.serialize();
        window.sessionStorage.removeItem('ftp-remote-edit:copyPath');
        window.sessionStorage['ftp-remote-edit:cutPath'] = (0, _helperSecureJs.encrypt)(Storage.getPassword(), JSON.stringify(storage));
      }
    }
  }, {
    key: 'paste',
    value: function paste() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var destObject = selected.view();
      if (destObject.is('.file')) {
        destObject = destObject.parent;
      }

      var dataObject = null;
      var srcObject = null;
      var handleEvent = null;

      var srcType = null;
      var srcPath = null;
      var destPath = null;

      // Parse data from copy/cut/drag event
      if (window.sessionStorage['ftp-remote-edit:cutPath']) {
        // Cut event from Atom
        handleEvent = "cut";

        var cutObjectString = (0, _helperSecureJs.decrypt)(Storage.getPassword(), window.sessionStorage['ftp-remote-edit:cutPath']);
        dataObject = cutObjectString ? JSON.parse(cutObjectString) : null;

        var _find = self.treeView.list.find('#' + dataObject.id);
        if (!_find) return;

        srcObject = _find.view();
        if (!srcObject) return;

        if (srcObject.is('.directory')) {
          srcType = 'directory';
          srcPath = srcObject.getPath(true);
          destPath = destObject.getPath(true) + srcObject.name;
        } else {
          srcType = 'file';
          srcPath = srcObject.getPath(true) + srcObject.name;
          destPath = destObject.getPath(true) + srcObject.name;
        }

        // Check if copy/cut operation should be performed on the same server
        if (JSON.stringify(destObject.config) != JSON.stringify(srcObject.config)) return;

        window.sessionStorage.removeItem('ftp-remote-edit:cutPath');
        window.sessionStorage.removeItem('ftp-remote-edit:copyPath');
      } else if (window.sessionStorage['ftp-remote-edit:copyPath']) {
        // Copy event from Atom
        handleEvent = "copy";

        var copiedObjectString = (0, _helperSecureJs.decrypt)(Storage.getPassword(), window.sessionStorage['ftp-remote-edit:copyPath']);
        dataObject = copiedObjectString ? JSON.parse(copiedObjectString) : null;

        var _find2 = self.treeView.list.find('#' + dataObject.id);
        if (!_find2) return;

        srcObject = _find2.view();
        if (!srcObject) return;

        if (srcObject.is('.directory')) {
          srcType = 'directory';
          srcPath = srcObject.getPath(true);
          destPath = destObject.getPath(true) + srcObject.name;
        } else {
          srcType = 'file';
          srcPath = srcObject.getPath(true) + srcObject.name;
          destPath = destObject.getPath(true) + srcObject.name;
        }

        // Check if copy/cut operation should be performed on the same server
        if (JSON.stringify(destObject.config) != JSON.stringify(srcObject.config)) return;

        window.sessionStorage.removeItem('ftp-remote-edit:cutPath');
        window.sessionStorage.removeItem('ftp-remote-edit:copyPath');
      } else {
        return;
      }

      if (handleEvent == "cut") {
        if (srcType == 'directory') self.moveDirectory(destObject.getRoot(), srcPath, destPath);
        if (srcType == 'file') self.moveFile(destObject.getRoot(), srcPath, destPath);
      } else if (handleEvent == "copy") {
        if (srcType == 'directory') self.copyDirectory(destObject.getRoot(), srcPath, destPath);
        if (srcType == 'file') self.copyFile(destObject.getRoot(), srcPath, destPath, { filesize: srcObject.size });
      }
    }
  }, {
    key: 'drop',
    value: function drop(e) {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var destObject = selected.view();
      if (destObject.is('.file')) {
        destObject = destObject.parent;
      }

      var initialPath = undefined,
          initialName = undefined,
          initialType = undefined,
          ref = undefined;
      if (entry = e.target.closest('.entry')) {
        e.preventDefault();
        e.stopPropagation();

        if (!destObject.is('.directory') && !destObject.is('.server')) {
          return;
        }

        if (e.dataTransfer) {
          initialPath = e.dataTransfer.getData("initialPath");
          initialName = e.dataTransfer.getData("initialName");
          initialType = e.dataTransfer.getData("initialType");
        } else {
          initialPath = e.originalEvent.dataTransfer.getData("initialPath");
          initialName = e.originalEvent.dataTransfer.getData("initialName");
          initialType = e.originalEvent.dataTransfer.getData("initialType");
        }

        if (initialType == "directory") {
          if ((0, _helperFormatJs.normalize)(initialPath) == (0, _helperFormatJs.normalize)(destObject.getPath(false) + initialName + '/')) return;
        } else if (initialType == "file") {
          if ((0, _helperFormatJs.normalize)(initialPath) == (0, _helperFormatJs.normalize)(destObject.getPath(false) + initialName)) return;
        }

        if (initialPath) {
          // Drop event from Atom
          if (initialType == "directory") {
            var srcPath = (0, _helperFormatJs.trailingslashit)(destObject.getRoot().getPath(true)) + initialPath;
            var destPath = destObject.getPath(true) + initialName + '/';
            self.moveDirectory(destObject.getRoot(), srcPath, destPath);
          } else if (initialType == "file") {
            var srcPath = (0, _helperFormatJs.trailingslashit)(destObject.getRoot().getPath(true)) + initialPath;
            var destPath = destObject.getPath(true) + initialName;
            self.moveFile(destObject.getRoot(), srcPath, destPath);
          }
        } else {
          // Drop event from OS
          if (e.dataTransfer) {
            ref = e.dataTransfer.files;
          } else {
            ref = e.originalEvent.dataTransfer.files;
          }

          for (var i = 0, len = ref.length; i < len; i++) {
            var file = ref[i];
            var srcPath = file.path;
            var destPath = destObject.getPath(true) + (0, _helperFormatJs.basename)(file.path, Path.sep);

            if (FileSystem.statSync(file.path).isDirectory()) {
              self.uploadDirectory(destObject.getRoot(), srcPath, destPath)['catch'](function (err) {
                (0, _helperHelperJs.showMessage)(err, 'error');
              });
            } else {
              self.uploadFile(destObject.getRoot(), srcPath, destPath)['catch'](function (err) {
                (0, _helperHelperJs.showMessage)(err, 'error');
              });
            }
          }
        }
      }
    }
  }, {
    key: 'upload',
    value: function upload(type) {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var destObject = selected.view();
      if (destObject.is('.file')) {
        destObject = destObject.parent;
      }

      var defaultPath = atom.config.get('ftp-remote-edit.transfer.defaultUploadPath') || 'desktop';
      if (defaultPath == 'project') {
        var projects = atom.project.getPaths();
        defaultPath = projects.shift();
      } else if (defaultPath == 'desktop') {
        defaultPath = Electron.remote.app.getPath("desktop");
      } else if (defaultPath == 'downloads') {
        defaultPath = Electron.remote.app.getPath("downloads");
      }
      var srcPath = null;
      var destPath = null;

      if (type == 'file') {
        Electron.remote.dialog.showOpenDialog(null, { title: 'Select file(s) for upload...', defaultPath: defaultPath, buttonLabel: 'Upload', properties: ['openFile', 'multiSelections', 'showHiddenFiles'] }, function (filePaths, bookmarks) {
          if (filePaths) {
            Promise.all(filePaths.map(function (filePath) {
              srcPath = filePath;
              destPath = destObject.getPath(true) + (0, _helperFormatJs.basename)(filePath, Path.sep);
              return self.uploadFile(destObject.getRoot(), srcPath, destPath);
            })).then(function () {
              (0, _helperHelperJs.showMessage)('File(s) has been uploaded to: \r \n' + filePaths.join('\r \n'), 'success');
            })['catch'](function (err) {
              (0, _helperHelperJs.showMessage)(err, 'error');
            });
          }
        });
      } else if (type == 'directory') {
        Electron.remote.dialog.showOpenDialog(null, { title: 'Select directory for upload...', defaultPath: defaultPath, buttonLabel: 'Upload', properties: ['openDirectory', 'showHiddenFiles'] }, function (directoryPaths, bookmarks) {
          if (directoryPaths) {
            directoryPaths.forEach(function (directoryPath, index) {
              srcPath = directoryPath;
              destPath = destObject.getPath(true) + (0, _helperFormatJs.basename)(directoryPath, Path.sep);

              self.uploadDirectory(destObject.getRoot(), srcPath, destPath).then(function () {
                (0, _helperHelperJs.showMessage)('Directory has been uploaded to ' + destPath, 'success');
              })['catch'](function (err) {
                (0, _helperHelperJs.showMessage)(err, 'error');
              });
            });
          }
        });
      }
    }
  }, {
    key: 'download',
    value: function download() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;
      if (!Storage.hasPassword()) return;

      var defaultPath = atom.config.get('ftp-remote-edit.transfer.defaultDownloadPath') || 'downloads';
      if (defaultPath == 'project') {
        var projects = atom.project.getPaths();
        defaultPath = projects.shift();
      } else if (defaultPath == 'desktop') {
        defaultPath = Electron.remote.app.getPath("desktop");
      } else if (defaultPath == 'downloads') {
        defaultPath = Electron.remote.app.getPath("downloads");
      }

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            (function () {
              var srcPath = (0, _helperFormatJs.normalize)(file.getPath(true) + file.name);

              Electron.remote.dialog.showSaveDialog(null, { defaultPath: defaultPath + "/" + file.name }, function (destPath) {
                if (destPath) {
                  self.downloadFile(file.getRoot(), srcPath, destPath, { filesize: file.size }).then(function () {
                    (0, _helperHelperJs.showMessage)('File has been downloaded to ' + destPath, 'success');
                  })['catch'](function (err) {
                    (0, _helperHelperJs.showMessage)(err, 'error');
                  });
                }
              });
            })();
          }
        })();
      } else if (selected.view().is('.directory')) {
        (function () {
          var directory = selected.view();
          if (directory) {
            (function () {
              var srcPath = (0, _helperFormatJs.normalize)(directory.getPath(true));

              Electron.remote.dialog.showSaveDialog(null, { defaultPath: defaultPath + "/" + directory.name }, function (destPath) {
                if (destPath) {
                  self.downloadDirectory(directory.getRoot(), srcPath, destPath).then(function () {
                    (0, _helperHelperJs.showMessage)('Directory has been downloaded to ' + destPath, 'success');
                  })['catch'](function (err) {
                    (0, _helperHelperJs.showMessage)(err, 'error');
                  });
                }
              });
            })();
          }
        })();
      } else if (selected.view().is('.server')) {
        (function () {
          var server = selected.view();
          if (server) {
            (function () {
              var srcPath = (0, _helperFormatJs.normalize)(server.getPath(true));

              Electron.remote.dialog.showSaveDialog(null, { defaultPath: defaultPath + "/" }, function (destPath) {
                if (destPath) {
                  self.downloadDirectory(server, srcPath, destPath).then(function () {
                    (0, _helperHelperJs.showMessage)('Directory has been downloaded to ' + destPath, 'success');
                  })['catch'](function (err) {
                    (0, _helperHelperJs.showMessage)(err, 'error');
                  });
                }
              });
            })();
          }
        })();
      }
    }
  }, {
    key: 'moveFile',
    value: function moveFile(server, srcPath, destPath) {
      var self = this;

      if ((0, _helperFormatJs.normalize)(srcPath) == (0, _helperFormatJs.normalize)(destPath)) return;

      server.getConnector().existsFile(destPath).then(function (result) {
        return new Promise(function (resolve, reject) {
          atom.confirm({
            message: 'File already exists. Are you sure you want to overwrite this file?',
            detailedMessage: "You are overwrite:\n" + destPath.trim(),
            buttons: {
              Yes: function Yes() {
                server.getConnector().deleteFile(destPath).then(function () {
                  reject(true);
                })['catch'](function (err) {
                  (0, _helperHelperJs.showMessage)(err.message, 'error');
                  resolve(false);
                });
              },
              Cancel: function Cancel() {
                resolve(false);
              }
            }
          });
        });
      })['catch'](function () {
        server.getConnector().rename(srcPath, destPath).then(function () {
          // get info from old object
          var oldObject = self.treeView.findElementByPath(server, (0, _helperFormatJs.trailingslashit)(srcPath.replace(server.config.remote, '')));
          var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

          // Add to tree
          var element = self.treeView.addFile(server, cachePath, { size: oldObject ? oldObject.size : null, rights: oldObject ? oldObject.rights : null });
          if (element.isVisible()) {
            element.select();
          }

          // Refresh cache
          server.getFinderCache().renameFile((0, _helperFormatJs.normalize)(srcPath.replace(server.config.remote, '/')), (0, _helperFormatJs.normalize)(destPath.replace(server.config.remote, '/')), oldObject ? oldObject.size : 0);

          if (oldObject) {
            // Check if file is already opened in texteditor
            var found = (0, _helperHelperJs.getTextEditor)(oldObject.getLocalPath(true) + oldObject.name);
            if (found) {
              element.addClass('open');
              found.saveObject = element;
              found.saveAs(element.getLocalPath(true) + element.name);
            }

            // Move local file
            (0, _helperHelperJs.moveLocalPath)(oldObject.getLocalPath(true) + oldObject.name, element.getLocalPath(true) + element.name);

            // Remove old object
            oldObject.remove();
          }
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err.message, 'error');
        });
      });
    }
  }, {
    key: 'moveDirectory',
    value: function moveDirectory(server, srcPath, destPath) {
      var self = this;

      initialPath = (0, _helperFormatJs.trailingslashit)(srcPath);
      destPath = (0, _helperFormatJs.trailingslashit)(destPath);

      if ((0, _helperFormatJs.normalize)(srcPath) == (0, _helperFormatJs.normalize)(destPath)) return;

      server.getConnector().existsDirectory(destPath).then(function (result) {
        return new Promise(function (resolve, reject) {
          atom.confirm({
            message: 'Directory already exists. Are you sure you want to overwrite this directory?',
            detailedMessage: "You are overwrite:\n" + destPath.trim(),
            buttons: {
              Yes: function Yes() {
                server.getConnector().deleteDirectory(destPath, recursive).then(function () {
                  reject(true);
                })['catch'](function (err) {
                  (0, _helperHelperJs.showMessage)(err.message, 'error');
                  resolve(false);
                });
              },
              Cancel: function Cancel() {
                resolve(false);
              }
            }
          });
        });
      })['catch'](function () {
        server.getConnector().rename(srcPath, destPath).then(function () {
          // get info from old object
          var oldObject = self.treeView.findElementByPath(server, (0, _helperFormatJs.trailingslashit)(srcPath.replace(server.config.remote, '')));
          var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

          // Add to tree
          var element = self.treeView.addDirectory(server.getRoot(), cachePath, { size: oldObject ? oldObject.size : null, rights: oldObject ? oldObject.rights : null });
          if (element.isVisible()) {
            element.select();
          }

          // Refresh cache
          server.getFinderCache().renameDirectory((0, _helperFormatJs.normalize)(srcPath.replace(server.config.remote, '/')), (0, _helperFormatJs.normalize)(destPath.replace(server.config.remote, '/')));

          if (oldObject) {
            // TODO
            // Check if file is already opened in texteditor

            // Move local file
            (0, _helperHelperJs.moveLocalPath)(oldObject.getLocalPath(true), element.getLocalPath(true));

            // Remove old object
            if (oldObject) oldObject.remove();
          }
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err.message, 'error');
        });
      });
    }
  }, {
    key: 'copyFile',
    value: function copyFile(server, srcPath, destPath) {
      var param = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var self = this;

      var srcLocalPath = (0, _helperFormatJs.normalize)(server.getLocalPath(false) + srcPath, Path.sep);
      var destLocalPath = (0, _helperFormatJs.normalize)(server.getLocalPath(false) + destPath, Path.sep);

      // Rename file if exists
      if (srcPath == destPath) {
        var _ret19 = (function () {
          var originalPath = (0, _helperFormatJs.normalize)(destPath);
          var parentPath = (0, _helperFormatJs.normalize)((0, _helperFormatJs.dirname)(destPath));

          server.getConnector().listDirectory(parentPath).then(function (list) {
            var files = [];
            var fileList = list.filter(function (item) {
              return item.type === '-';
            });

            fileList.forEach(function (element) {
              files.push(element.name);
            });

            var filePath = undefined;
            var fileCounter = 0;
            var extension = (0, _helperHelperJs.getFullExtension)(originalPath);

            // append a number to the file if an item with the same name exists
            while (files.includes((0, _helperFormatJs.basename)(destPath))) {
              filePath = Path.dirname(originalPath) + '/' + Path.basename(originalPath, extension);
              destPath = filePath + fileCounter + extension;
              fileCounter += 1;
            }

            self.copyFile(server, srcPath, destPath);
          })['catch'](function (err) {
            (0, _helperHelperJs.showMessage)(err.message, 'error');
          });

          return {
            v: undefined
          };
        })();

        if (typeof _ret19 === 'object') return _ret19.v;
      }

      server.getConnector().existsFile(destPath).then(function (result) {
        return new Promise(function (resolve, reject) {
          atom.confirm({
            message: 'File already exists. Are you sure you want to overwrite this file?',
            detailedMessage: "You are overwrite:\n" + destPath.trim(),
            buttons: {
              Yes: function Yes() {
                fileexists = true;
                reject(true);
              },
              Cancel: function Cancel() {
                resolve(false);
              }
            }
          });
        });
      })['catch'](function () {
        // Create local Directories
        (0, _helperHelperJs.createLocalPath)(srcLocalPath);
        (0, _helperHelperJs.createLocalPath)(destLocalPath);

        self.downloadFile(server, srcPath, destLocalPath, param).then(function () {
          self.uploadFile(server, destLocalPath, destPath).then(function (duplicatedFile) {
            if (duplicatedFile) {
              // Open file and add handler to editor to upload file on save
              return self.openFileInEditor(duplicatedFile);
            }
          })['catch'](function (err) {
            (0, _helperHelperJs.showMessage)(err, 'error');
          });
        })['catch'](function (err) {
          (0, _helperHelperJs.showMessage)(err, 'error');
        });
      });
    }
  }, {
    key: 'copyDirectory',
    value: function copyDirectory(server, srcPath, destPath) {
      var self = this;

      if ((0, _helperFormatJs.normalize)(srcPath) == (0, _helperFormatJs.normalize)(destPath)) return;

      // TODO
      console.log('TODO copy', srcPath, destPath);
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(server, srcPath, destPath) {
      var checkFileExists = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      var self = this;

      if (checkFileExists) {
        var promise = new Promise(function (resolve, reject) {
          return server.getConnector().existsFile(destPath).then(function (result) {
            var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

            return new Promise(function (resolve, reject) {
              atom.confirm({
                message: 'File already exists. Are you sure you want to overwrite this file?',
                detailedMessage: "You are overwrite:\n" + cachePath,
                buttons: {
                  Yes: function Yes() {
                    server.getConnector().deleteFile(destPath).then(function () {
                      reject(true);
                    })['catch'](function (err) {
                      (0, _helperHelperJs.showMessage)(err.message, 'error');
                      resolve(false);
                    });
                  },
                  Cancel: function Cancel() {
                    resolve(false);
                  }
                }
              });
            });
          })['catch'](function (err) {
            var filestat = FileSystem.statSync(srcPath);

            var pathOnFileSystem = (0, _helperFormatJs.normalize)((0, _helperFormatJs.trailingslashit)(srcPath), Path.sep);
            var foundInTreeView = self.treeView.findElementByLocalPath(pathOnFileSystem);
            if (foundInTreeView) {
              // Add sync icon
              foundInTreeView.addSyncIcon();
            }

            // Add to Upload Queue
            var queueItem = Queue.addFile({
              direction: "upload",
              remotePath: destPath,
              localPath: srcPath,
              size: filestat.size
            });

            return server.getConnector().uploadFile(queueItem, 1).then(function () {
              var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

              // Add to tree
              var element = self.treeView.addFile(server.getRoot(), cachePath, { size: filestat.size });
              if (element.isVisible()) {
                element.select();
              }

              // Refresh cache
              server.getRoot().getFinderCache().deleteFile((0, _helperFormatJs.normalize)(cachePath));
              server.getRoot().getFinderCache().addFile((0, _helperFormatJs.normalize)(cachePath), filestat.size);

              if (foundInTreeView) {
                // Remove sync icon
                foundInTreeView.removeSyncIcon();
              }

              resolve(element);
            })['catch'](function (err) {
              queueItem.changeStatus('Error');

              if (foundInTreeView) {
                // Remove sync icon
                foundInTreeView.removeSyncIcon();
              }

              reject(err);
            });
          });
        });

        return promise;
      } else {
        var promise = new Promise(function (resolve, reject) {
          var filestat = FileSystem.statSync(srcPath);

          var pathOnFileSystem = (0, _helperFormatJs.normalize)((0, _helperFormatJs.trailingslashit)(srcPath), Path.sep);
          var foundInTreeView = self.treeView.findElementByLocalPath(pathOnFileSystem);
          if (foundInTreeView) {
            // Add sync icon
            foundInTreeView.addSyncIcon();
          }

          // Add to Upload Queue
          var queueItem = Queue.addFile({
            direction: "upload",
            remotePath: destPath,
            localPath: srcPath,
            size: filestat.size
          });

          return server.getConnector().uploadFile(queueItem, 1).then(function () {
            var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

            // Add to tree
            var element = self.treeView.addFile(server.getRoot(), cachePath, { size: filestat.size });
            if (element.isVisible()) {
              element.select();
            }

            // Refresh cache
            server.getRoot().getFinderCache().deleteFile((0, _helperFormatJs.normalize)(cachePath));
            server.getRoot().getFinderCache().addFile((0, _helperFormatJs.normalize)(cachePath), filestat.size);

            if (foundInTreeView) {
              // Remove sync icon
              foundInTreeView.removeSyncIcon();
            }

            resolve(element);
          })['catch'](function (err) {
            queueItem.changeStatus('Error');

            if (foundInTreeView) {
              // Remove sync icon
              foundInTreeView.removeSyncIcon();
            }

            reject(err);
          });
        });

        return promise;
      }
    }
  }, {
    key: 'uploadDirectory',
    value: function uploadDirectory(server, srcPath, destPath) {
      var self = this;

      return new Promise(function (resolve, reject) {
        FileSystem.listTreeSync(srcPath).filter(function (path) {
          return FileSystem.isFileSync(path);
        }).reduce(function (prevPromise, path) {
          return prevPromise.then(function () {
            return self.uploadFile(server, path, (0, _helperFormatJs.normalize)(destPath + '/' + path.replace(srcPath, '/'), '/'));
          });
        }, Promise.resolve()).then(function () {
          return resolve();
        })['catch'](function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'downloadFile',
    value: function downloadFile(server, srcPath, destPath) {
      var param = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var self = this;

      var promise = new Promise(function (resolve, reject) {
        // Check if file is already in Queue
        if (Queue.existsFile(destPath)) {
          return reject(false);
        }

        var pathOnFileSystem = (0, _helperFormatJs.normalize)((0, _helperFormatJs.trailingslashit)(server.getLocalPath(false) + srcPath), Path.sep);
        var foundInTreeView = self.treeView.findElementByLocalPath(pathOnFileSystem);
        if (foundInTreeView) {
          // Add sync icon
          foundInTreeView.addSyncIcon();
        }

        // Create local Directories
        (0, _helperHelperJs.createLocalPath)(destPath);

        // Add to Download Queue
        var queueItem = Queue.addFile({
          direction: "download",
          remotePath: srcPath,
          localPath: destPath,
          size: param.filesize ? param.filesize : 0
        });

        // Download file
        server.getConnector().downloadFile(queueItem).then(function () {
          if (foundInTreeView) {
            // Remove sync icon
            foundInTreeView.removeSyncIcon();
          }

          resolve(true);
        })['catch'](function (err) {
          queueItem.changeStatus('Error');

          if (foundInTreeView) {
            // Remove sync icon
            foundInTreeView.removeSyncIcon();
          }

          reject(err);
        });
      });

      return promise;
    }
  }, {
    key: 'downloadDirectory',
    value: function downloadDirectory(server, srcPath, destPath) {
      var self = this;

      var scanDir = function scanDir(path) {
        return server.getConnector().listDirectory(path).then(function (list) {
          var files = list.filter(function (item) {
            return item.type === '-';
          }).map(function (item) {
            item.path = (0, _helperFormatJs.normalize)(path + '/' + item.name);
            return item;
          });
          var dirs = list.filter(function (item) {
            return item.type === 'd' && item.name !== '.' && item.name !== '..';
          }).map(function (item) {
            item.path = (0, _helperFormatJs.normalize)(path + '/' + item.name);
            return item;
          });

          return dirs.reduce(function (prevPromise, dir) {
            return prevPromise.then(function (output) {
              return scanDir((0, _helperFormatJs.normalize)(dir.path)).then(function (files) {
                return output.concat(files);
              });
            });
          }, Promise.resolve(files));
        });
      };

      return scanDir(srcPath).then(function (files) {
        try {
          if (!FileSystem.existsSync(destPath)) {
            FileSystem.mkdirSync(destPath);
          }
        } catch (error) {
          return Promise.reject(error);
        }

        return new Promise(function (resolve, reject) {
          files.reduce(function (prevPromise, file) {
            return prevPromise.then(function () {
              return self.downloadFile(server, file.path, (0, _helperFormatJs.normalize)(destPath + Path.sep + file.path.replace(srcPath, '/'), Path.sep), { filesize: file.size });
            });
          }, Promise.resolve()).then(function () {
            return resolve();
          })['catch'](function (error) {
            return reject(error);
          });
        });
      })['catch'](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: 'findRemotePath',
    value: function findRemotePath() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      var dialog = new _dialogsFindDialogJs2['default']('/', false);
      dialog.on('find-path', function (e, relativePath) {
        if (relativePath) {
          relativePath = (0, _helperFormatJs.normalize)(relativePath);

          var root = selected.view().getRoot();

          // Remove initial path if exists
          if (root.config.remote) {
            if (relativePath.startsWith(root.config.remote)) {
              relativePath = relativePath.replace(root.config.remote, "");
            }
          }

          self.treeView.expand(root, relativePath)['catch'](function (err) {
            (0, _helperHelperJs.showMessage)(err, 'error');
          });

          dialog.close();
        }
      });
      dialog.attach();
    }
  }, {
    key: 'copyRemotePath',
    value: function copyRemotePath() {
      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      var element = selected.view();
      if (element.is('.directory')) {
        pathToCopy = element.getPath(true);
      } else {
        pathToCopy = element.getPath(true) + element.name;
      }
      atom.clipboard.write(pathToCopy);
    }
  }, {
    key: 'remotePathFinder',
    value: function remotePathFinder() {
      var reindex = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var self = this;
      var selected = self.treeView.list.find('.selected');

      if (selected.length === 0) return;

      var root = selected.view().getRoot();
      var itemsCache = root.getFinderCache();

      if (self.finderView == null) {
        self.finderView = new _viewsFinderView2['default'](self.treeView);

        self.finderView.on('ftp-remote-edit-finder:open', function (item) {
          var relativePath = item.relativePath;
          var localPath = (0, _helperFormatJs.normalize)(self.finderView.root.getLocalPath() + relativePath, Path.sep);
          var file = self.treeView.getElementByLocalPath(localPath, self.finderView.root, 'file');
          file.size = item.size;

          if (file) self.openFile(file);
        });

        self.finderView.on('ftp-remote-edit-finder:hide', function () {
          itemsCache.loadTask = false;
        });
      }
      self.finderView.root = root;
      self.finderView.selectListView.update({ items: itemsCache.items });

      var index = function index(items) {
        self.finderView.selectListView.update({ items: items, errorMessage: '', loadingMessage: 'Indexing…' + items.length });
      };
      itemsCache.removeListener('finder-items-cache-queue:index', index);
      itemsCache.on('finder-items-cache-queue:index', index);

      var update = function update(items) {
        self.finderView.selectListView.update({ items: items, errorMessage: '', loadingMessage: '' });
      };
      itemsCache.removeListener('finder-items-cache-queue:update', update);
      itemsCache.on('finder-items-cache-queue:update', update);

      var finish = function finish(items) {
        self.finderView.selectListView.update({ items: items, errorMessage: '', loadingMessage: '' });
      };
      itemsCache.removeListener('finder-items-cache-queue:finish', finish);
      itemsCache.on('finder-items-cache-queue:finish', finish);

      var error = function error(err) {
        self.finderView.selectListView.update({ errorMessage: 'Error: ' + err.message });
      };
      itemsCache.removeListener('finder-items-cache-queue:error', error);
      itemsCache.on('finder-items-cache-queue:error', error);

      itemsCache.load(reindex);
      self.finderView.toggle();
    }
  }, {
    key: 'autoRevealActiveFile',
    value: function autoRevealActiveFile() {
      var self = this;

      if (atom.config.get('ftp-remote-edit.tree.autoRevealActiveFile')) {
        if (self.treeView.isVisible()) {
          var editor = atom.workspace.getActiveTextEditor();

          if (editor && editor.getPath()) {
            var pathOnFileSystem = (0, _helperFormatJs.normalize)((0, _helperFormatJs.trailingslashit)(editor.getPath()), Path.sep);

            var _entry = self.treeView.findElementByLocalPath(pathOnFileSystem);
            if (_entry && _entry.isVisible()) {
              _entry.select();
              self.treeView.remoteKeyboardNavigationMovePage();
            }
          }
        }
      }
    }
  }, {
    key: 'openFileInEditor',
    value: function openFileInEditor(file, pending) {
      var self = this;

      return atom.workspace.open((0, _helperFormatJs.normalize)(file.getLocalPath(true) + file.name, Path.sep), { pending: pending, searchAllPanes: true }).then(function (editor) {
        editor.saveObject = file;
        editor.saveObject.addClass('open');

        try {
          // Save file on remote server
          editor.onDidSave(function (saveObject) {
            if (!editor.saveObject) return;

            // Get filesize
            var filestat = FileSystem.statSync(editor.getPath(true));
            editor.saveObject.size = filestat.size;
            editor.saveObject.attr('data-size', filestat.size);

            var srcPath = editor.saveObject.getLocalPath(true) + editor.saveObject.name;
            var destPath = editor.saveObject.getPath(true) + editor.saveObject.name;
            self.uploadFile(editor.saveObject.getRoot(), srcPath, destPath, false).then(function (duplicatedFile) {
              if (duplicatedFile) {
                if (atom.config.get('ftp-remote-edit.notifications.showNotificationOnUpload')) {
                  (0, _helperHelperJs.showMessage)('File successfully uploaded.', 'success');
                }
              }
            })['catch'](function (err) {
              (0, _helperHelperJs.showMessage)(err, 'error');
            });
          });

          editor.onDidDestroy(function () {
            if (!editor.saveObject) return;

            editor.saveObject.removeClass('open');
          });
        } catch (err) {}
      })['catch'](function (err) {
        (0, _helperHelperJs.showMessage)(err.message, 'error');
      });
    }
  }]);

  return FtpRemoteEdit;
})();

exports['default'] = new FtpRemoteEdit();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9mdHAtcmVtb3RlLWVkaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQ0FFOEIsNEJBQTRCOzs7O29DQUM5QiwwQkFBMEI7Ozs7NkJBQ2pDLG1CQUFtQjs7OztpQ0FDZix1QkFBdUI7Ozs7K0JBQ3pCLHFCQUFxQjs7Ozt5Q0FFZixpQ0FBaUM7Ozs7eUNBQ2pDLGlDQUFpQzs7OztrQ0FDeEMseUJBQXlCOzs7O3FDQUN0Qiw0QkFBNEI7Ozs7bUNBQzlCLDBCQUEwQjs7OztzQ0FDckIsNEJBQTRCOzs7O29CQUVJLE1BQU07OzhCQUM4RixvQkFBb0I7OzhCQUNqRSxvQkFBb0I7OzhCQUNNLG9CQUFvQjs7QUFsQmpLLFdBQVcsQ0FBQzs7QUFvQlosSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdEQsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTdELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDM0MsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRS9DLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztJQUVqRCxhQUFhO0FBRU4sV0FGUCxhQUFh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Q0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzFFLGdCQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxjQUFjLEVBQUs7QUFDOUYsa0JBQUksY0FBYyxFQUFFO0FBQ2xCLG9CQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLEVBQUU7QUFDN0UsbURBQVksNkJBQTZCLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ3ZEO2VBQ0Y7YUFDRixDQUFDLFNBQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoQiwrQ0FBWSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDM0IsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDOztBQUVILGdCQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDeEIsZ0JBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU87O0FBRS9CLGtCQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUN2QyxDQUFDLENBQUM7U0FDSixDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUc7T0FDbEIsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDaEIseUNBQVksR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUNuQyxDQUFDLENBQUM7S0FDSjs7O1NBMzBERyxhQUFhOzs7cUJBODBESixJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvZnRwLXJlbW90ZS1lZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBDb25maWd1cmF0aW9uVmlldyBmcm9tICcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24tdmlldyc7XG5pbXBvcnQgUGVybWlzc2lvbnNWaWV3IGZyb20gJy4vdmlld3MvcGVybWlzc2lvbnMtdmlldyc7XG5pbXBvcnQgVHJlZVZpZXcgZnJvbSAnLi92aWV3cy90cmVlLXZpZXcnO1xuaW1wb3J0IFByb3RvY29sVmlldyBmcm9tICcuL3ZpZXdzL3Byb3RvY29sLXZpZXcnO1xuaW1wb3J0IEZpbmRlclZpZXcgZnJvbSAnLi92aWV3cy9maW5kZXItdmlldyc7XG5cbmltcG9ydCBDaGFuZ2VQYXNzRGlhbG9nIGZyb20gJy4vZGlhbG9ncy9jaGFuZ2UtcGFzcy1kaWFsb2cuanMnO1xuaW1wb3J0IFByb21wdFBhc3NEaWFsb2cgZnJvbSAnLi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZy5qcyc7XG5pbXBvcnQgQWRkRGlhbG9nIGZyb20gJy4vZGlhbG9ncy9hZGQtZGlhbG9nLmpzJztcbmltcG9ydCBSZW5hbWVEaWFsb2cgZnJvbSAnLi9kaWFsb2dzL3JlbmFtZS1kaWFsb2cuanMnO1xuaW1wb3J0IEZpbmREaWFsb2cgZnJvbSAnLi9kaWFsb2dzL2ZpbmQtZGlhbG9nLmpzJztcbmltcG9ydCBEdXBsaWNhdGVEaWFsb2cgZnJvbSAnLi9kaWFsb2dzL2R1cGxpY2F0ZS1kaWFsb2cnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBkZWNyeXB0LCBlbmNyeXB0LCBjaGVja1Bhc3N3b3JkRXhpc3RzLCBjaGVja1Bhc3N3b3JkLCBzZXRQYXNzd29yZCwgY2hhbmdlUGFzc3dvcmQsIGlzSW5XaGl0ZUxpc3QsIGlzSW5CbGFja0xpc3QsIGFkZFRvV2hpdGVMaXN0LCBhZGRUb0JsYWNrTGlzdCB9IGZyb20gJy4vaGVscGVyL3NlY3VyZS5qcyc7XG5pbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgdHJhaWxpbmdzbGFzaGl0LCB1bnRyYWlsaW5nc2xhc2hpdCwgbGVhZGluZ3NsYXNoaXQsIHVubGVhZGluZ3NsYXNoaXQsIG5vcm1hbGl6ZSB9IGZyb20gJy4vaGVscGVyL2Zvcm1hdC5qcyc7XG5pbXBvcnQgeyBsb2dEZWJ1Zywgc2hvd01lc3NhZ2UsIGdldEZ1bGxFeHRlbnNpb24sIGNyZWF0ZUxvY2FsUGF0aCwgZGVsZXRlTG9jYWxQYXRoLCBtb3ZlTG9jYWxQYXRoLCBnZXRUZXh0RWRpdG9yLCBwZXJtaXNzaW9uc1RvUmlnaHRzIH0gZnJvbSAnLi9oZWxwZXIvaGVscGVyLmpzJztcblxuY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcvY29uZmlnLXNjaGVtYS5qc29uJyk7XG5jb25zdCBzZXJ2ZXJfY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcvc2VydmVyLXNjaGVtYS5qc29uJyk7XG5cbmNvbnN0IGF0b20gPSBnbG9iYWwuYXRvbTtcbmNvbnN0IEVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbmNvbnN0IFBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBGaWxlU3lzdGVtID0gcmVxdWlyZSgnZnMtcGx1cycpO1xuY29uc3QgZ2V0SWNvblNlcnZpY2VzID0gcmVxdWlyZSgnLi9oZWxwZXIvaWNvbi5qcycpO1xuY29uc3QgUXVldWUgPSByZXF1aXJlKCcuL2hlbHBlci9xdWV1ZS5qcycpO1xuY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4vaGVscGVyL3N0b3JhZ2UuanMnKTtcblxucmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAwO1xuXG5jbGFzcyBGdHBSZW1vdGVFZGl0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaW5mbyA9IFtdO1xuICAgIHNlbGYuY29uZmlnID0gY29uZmlnO1xuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBzZWxmLnRyZWVWaWV3ID0gbnVsbDtcbiAgICBzZWxmLnByb3RvY29sVmlldyA9IG51bGw7XG4gICAgc2VsZi5jb25maWd1cmF0aW9uVmlldyA9IG51bGw7XG4gICAgc2VsZi5maW5kZXJWaWV3ID0gbnVsbDtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi50cmVlVmlldyA9IG5ldyBUcmVlVmlldygpO1xuICAgIHNlbGYucHJvdG9jb2xWaWV3ID0gbmV3IFByb3RvY29sVmlldygpO1xuXG4gICAgLy8gRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgc2VsZi5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnRvZ2dsZSc6ICgpID0+IHNlbGYudG9nZ2xlKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnRvZ2dsZS1mb2N1cyc6ICgpID0+IHNlbGYudG9nZ2xlRm9jdXMoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6c2hvdyc6ICgpID0+IHNlbGYuc2hvdygpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpoaWRlJzogKCkgPT4gc2VsZi5oaWRlKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnVuZm9jdXMnOiAoKSA9PiBzZWxmLnRyZWVWaWV3LnVuZm9jdXMoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZWRpdC1zZXJ2ZXJzJzogKCkgPT4gc2VsZi5jb25maWd1cmF0aW9uKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmNoYW5nZS1wYXNzd29yZCc6ICgpID0+IHNlbGYuY2hhbmdlUGFzc3dvcmQoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6b3Blbi1maWxlJzogKCkgPT4gc2VsZi5vcGVuKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0Om9wZW4tZmlsZS1wZW5kaW5nJzogKCkgPT4gc2VsZi5vcGVuKHRydWUpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpuZXctZmlsZSc6ICgpID0+IHNlbGYuY3JlYXRlKCdmaWxlJyksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0Om5ldy1kaXJlY3RvcnknOiAoKSA9PiBzZWxmLmNyZWF0ZSgnZGlyZWN0b3J5JyksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmR1cGxpY2F0ZSc6ICgpID0+IHNlbGYuZHVwbGljYXRlKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmRlbGV0ZSc6ICgpID0+IHNlbGYuZGVsZXRlKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnJlbmFtZSc6ICgpID0+IHNlbGYucmVuYW1lKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmNvcHknOiAoKSA9PiBzZWxmLmNvcHkoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y3V0JzogKCkgPT4gc2VsZi5jdXQoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6cGFzdGUnOiAoKSA9PiBzZWxmLnBhc3RlKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmNobW9kJzogKCkgPT4gc2VsZi5jaG1vZCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDp1cGxvYWQtZmlsZSc6ICgpID0+IHNlbGYudXBsb2FkKCdmaWxlJyksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnVwbG9hZC1kaXJlY3RvcnknOiAoKSA9PiBzZWxmLnVwbG9hZCgnZGlyZWN0b3J5JyksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmRvd25sb2FkJzogKCkgPT4gc2VsZi5kb3dubG9hZCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpyZWxvYWQnOiAoKSA9PiBzZWxmLnJlbG9hZCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpmaW5kLXJlbW90ZS1wYXRoJzogKCkgPT4gc2VsZi5maW5kUmVtb3RlUGF0aCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpjb3B5LXJlbW90ZS1wYXRoJzogKCkgPT4gc2VsZi5jb3B5UmVtb3RlUGF0aCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpmaW5kZXInOiAoKSA9PiBzZWxmLnJlbW90ZVBhdGhGaW5kZXIoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZmluZGVyLXJlaW5kZXgtY2FjaGUnOiAoKSA9PiBzZWxmLnJlbW90ZVBhdGhGaW5kZXIodHJ1ZSksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmFkZC10ZW1wLXNlcnZlcic6ICgpID0+IHNlbGYuYWRkVGVtcFNlcnZlcigpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpyZW1vdmUtdGVtcC1zZXJ2ZXInOiAoKSA9PiBzZWxmLnJlbW92ZVRlbXBTZXJ2ZXIoKSxcbiAgICB9KSk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZnRwLXJlbW90ZS1lZGl0LmNvbmZpZycsICgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFBhc3N3b3JkKCkpIHtcbiAgICAgICAgU3RvcmFnZS5sb2FkKHRydWUpO1xuICAgICAgICBzZWxmLnRyZWVWaWV3LnJlbG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRHJhZyAmIERyb3BcbiAgICBzZWxmLnRyZWVWaWV3Lm9uKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIHNlbGYuZHJvcChlKTtcbiAgICB9KTtcblxuICAgIC8vIEF1dG8gUmV2ZWFsIEFjdGl2ZSBGaWxlXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgc2VsZi5hdXRvUmV2ZWFsQWN0aXZlRmlsZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gd29ya2Fyb3VuZCB0byBhY3RpdmF0ZSBjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcyBpZiBmdHAtcmVtb3RlLWVkaXQudHJlZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMgaXMgYWN0aXZhdGVkXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycsICh7IG5ld1ZhbHVlLCBvbGRWYWx1ZSB9KSA9PiB7XG4gICAgICBpZiAobmV3VmFsdWUgPT0gdHJ1ZSAmJiAhYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnLCB0cnVlKVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJywgdHJ1ZSlcbiAgICB9XG5cbiAgICAvLyBUb2dnbGUgb24gc3RhcnR1cFxuICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UoKGFjdGl2YXRlUGFja2FnZSkgPT4ge1xuICAgICAgaWYgKGFjdGl2YXRlUGFja2FnZS5uYW1lID09ICdmdHAtcmVtb3RlLWVkaXQnKSB7XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnRvZ2dsZU9uU3RhcnR1cCcpKSB7XG4gICAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHNlbGYuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChzZWxmLnRyZWVWaWV3KSB7XG4gICAgICBzZWxmLnRyZWVWaWV3LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5wcm90b2NvbFZpZXcpIHtcbiAgICAgIHNlbGYucHJvdG9jb2xWaWV3LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5jb25maWd1cmF0aW9uVmlldykge1xuICAgICAgc2VsZi5jb25maWd1cmF0aW9uVmlldy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuZmluZGVyVmlldykge1xuICAgICAgZmluZGVyVmlldy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGhhbmRsZVVSSShwYXJzZWRVcmkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCByZWdleCA9IC8oXFwvKT8oW2EtejAtOV9cXC1dezEsNX06XFwvXFwvKSgoW146XXsxLH0pKCg6KC57MSx9KSk/W1xcQFxceDQwXSkpPyhbYS16MC05X1xcLS5dKykoOihbMC05XSopKT8oLiopL2dpO1xuICAgIGxldCBpc19tYXRjaGVkID0gcGFyc2VkVXJpLnBhdGgubWF0Y2gocmVnZXgpO1xuXG4gICAgaWYgKGlzX21hdGNoZWQpIHtcblxuICAgICAgaWYgKCFzZWxmLnRyZWVWaWV3LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBtYXRjaGVkID0gcmVnZXguZXhlYyhwYXJzZWRVcmkucGF0aCk7XG5cbiAgICAgIGxldCBwcm90b2NvbCA9IG1hdGNoZWRbMl07XG4gICAgICBsZXQgdXNlcm5hbWUgPSAobWF0Y2hlZFs0XSAhPT0gdW5kZWZpbmVkKSA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVkWzRdKSA6ICcnO1xuICAgICAgbGV0IHBhc3N3b3JkID0gKG1hdGNoZWRbN10gIT09IHVuZGVmaW5lZCkgPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hlZFs3XSkgOiAnJztcbiAgICAgIGxldCBob3N0ID0gKG1hdGNoZWRbOF0gIT09IHVuZGVmaW5lZCkgPyBtYXRjaGVkWzhdIDogJyc7XG4gICAgICBsZXQgcG9ydCA9IChtYXRjaGVkWzEwXSAhPT0gdW5kZWZpbmVkKSA/IG1hdGNoZWRbMTBdIDogJyc7XG4gICAgICBsZXQgcGF0aCA9IChtYXRjaGVkWzExXSAhPT0gdW5kZWZpbmVkKSA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVkWzExXSkgOiBcIi9cIjtcblxuICAgICAgbGV0IG5ld2NvbmZpZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc2VydmVyX2NvbmZpZykpO1xuICAgICAgbmV3Y29uZmlnLm5hbWUgPSAodXNlcm5hbWUpID8gcHJvdG9jb2wgKyB1c2VybmFtZSArICdAJyArIGhvc3QgOiBwcm90b2NvbCArIGhvc3Q7XG4gICAgICBuZXdjb25maWcuaG9zdCA9IGhvc3Q7XG4gICAgICBuZXdjb25maWcucG9ydCA9IChwb3J0KSA/IHBvcnQgOiAoKHByb3RvY29sID09ICdzZnRwOi8vJykgPyAnMjInIDogJzIxJyk7XG4gICAgICBuZXdjb25maWcudXNlciA9IHVzZXJuYW1lO1xuICAgICAgbmV3Y29uZmlnLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgICBuZXdjb25maWcuc2Z0cCA9IChwcm90b2NvbCA9PSAnc2Z0cDovLycpO1xuICAgICAgbmV3Y29uZmlnLnJlbW90ZSA9IHBhdGg7XG4gICAgICBuZXdjb25maWcudGVtcCA9IHRydWU7XG5cbiAgICAgIGxvZ0RlYnVnKFwiQWRkaW5nIG5ldyBzZXJ2ZXIgYnkgdXJpIGhhbmRsZXJcIiwgbmV3Y29uZmlnKTtcblxuICAgICAgc2VsZi50cmVlVmlldy5hZGRTZXJ2ZXIobmV3Y29uZmlnKTtcbiAgICB9XG4gIH1cblxuICBvcGVuUmVtb3RlRmlsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAoZmlsZSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgbGV0IHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuICAgICAgbGV0IGxvY2FsUGF0aCA9IG5vcm1hbGl6ZShyb290LmdldExvY2FsUGF0aCgpKTtcbiAgICAgIGxvY2FsUGF0aCA9IG5vcm1hbGl6ZShQYXRoLmpvaW4obG9jYWxQYXRoLnNsaWNlKDAsIGxvY2FsUGF0aC5sYXN0SW5kZXhPZihyb290LmdldFBhdGgoKSkpLCBmaWxlKS5yZXBsYWNlKC9cXC8rL2csIFBhdGguc2VwKSwgUGF0aC5zZXApO1xuXG4gICAgICB0cnkge1xuICAgICAgICBsZXQgZmlsZSA9IHNlbGYudHJlZVZpZXcuZ2V0RWxlbWVudEJ5TG9jYWxQYXRoKGxvY2FsUGF0aCwgcm9vdCwgJ2ZpbGUnKTtcbiAgICAgICAgc2VsZi5vcGVuRmlsZShmaWxlKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGxvZ0RlYnVnKGV4KVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50U2VydmVyTmFtZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmVqZWN0KCdub3NlcnZlcnMnKTtcblxuICAgICAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICAgIHJlc29sdmUocm9vdC5uYW1lKTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q3VycmVudFNlcnZlckNvbmZpZygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAocmVhc29uRm9yUmVxdWVzdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKCFyZWFzb25Gb3JSZXF1ZXN0KSB7XG4gICAgICAgICAgcmVqZWN0KCdub3JlYXNvbmdpdmVuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG4gICAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZWplY3QoJ25vc2VydmVycycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICAgICAgcmVqZWN0KCdub3Bhc3N3b3JkJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuICAgICAgICBsZXQgYnV0dG9uZGlzbWlzcyA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChpc0luQmxhY2tMaXN0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgcmVhc29uRm9yUmVxdWVzdCkpIHtcbiAgICAgICAgICByZWplY3QoJ3VzZXJkZWNsaW5lZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNJbldoaXRlTGlzdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHJlYXNvbkZvclJlcXVlc3QpKSB7XG4gICAgICAgICAgcmVzb2x2ZShyb290LmNvbmZpZyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhdXRpb24gPSAnRGVjbGluZSB0aGlzIG1lc3NhZ2UgaWYgeW91IGRpZCBub3QgaW5pdGlhdGUgYSByZXF1ZXN0IHRvIHNoYXJlIHlvdXIgc2VydmVyIGNvbmZpZ3VyYXRpb24gd2l0aCBhIHBhY2FrZ2UhJ1xuICAgICAgICBsZXQgbm90aWYgPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU2VydmVyIENvbmZpZ3VyYXRpb24gUmVxdWVzdGVkJywge1xuICAgICAgICAgIGRldGFpbDogcmVhc29uRm9yUmVxdWVzdCArICdcXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJyArIGNhdXRpb24sXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgIHRleHQ6ICdBbHdheXMnLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBidXR0b25kaXNtaXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbm90aWYuZGlzbWlzcygpO1xuICAgICAgICAgICAgICBhZGRUb1doaXRlTGlzdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHJlYXNvbkZvclJlcXVlc3QpO1xuICAgICAgICAgICAgICByZXNvbHZlKHJvb3QuY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdBY2NlcHQnLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBidXR0b25kaXNtaXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbm90aWYuZGlzbWlzcygpO1xuICAgICAgICAgICAgICByZXNvbHZlKHJvb3QuY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdEZWNsaW5lJyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnV0dG9uZGlzbWlzcyA9IHRydWU7XG4gICAgICAgICAgICAgIG5vdGlmLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgcmVqZWN0KCd1c2VyZGVjbGluZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdOZXZlcicsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1dHRvbmRpc21pc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBub3RpZi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIGFkZFRvQmxhY2tMaXN0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgcmVhc29uRm9yUmVxdWVzdCk7XG4gICAgICAgICAgICAgIHJlamVjdCgndXNlcmRlY2xpbmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBkaXNwb3NhYmxlID0gbm90aWYub25EaWREaXNtaXNzKCgpID0+IHtcbiAgICAgICAgICBpZiAoIWJ1dHRvbmRpc21pc3MpIHJlamVjdCgndXNlcmRlY2xpbmVkJyk7XG4gICAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN1bWVFbGVtZW50SWNvbnMoc2VydmljZSkge1xuICAgIGdldEljb25TZXJ2aWNlcygpLnNldEVsZW1lbnRJY29ucyhzZXJ2aWNlKTtcblxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBnZXRJY29uU2VydmljZXMoKS5yZXNldEVsZW1lbnRJY29ucygpO1xuICAgIH0pXG4gIH1cblxuICBwcm9tdFBhc3N3b3JkKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBQcm9tcHRQYXNzRGlhbG9nKCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGRpYWxvZy5vbignZGlhbG9nLWRvbmUnLCAoZSwgcGFzc3dvcmQpID0+IHtcbiAgICAgICAgaWYgKGNoZWNrUGFzc3dvcmQocGFzc3dvcmQpKSB7XG4gICAgICAgICAgU3RvcmFnZS5zZXRQYXNzd29yZChwYXNzd29yZCk7XG4gICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpYWxvZy5zaG93RXJyb3IoJ1dyb25nIHBhc3N3b3JkLCB0cnkgYWdhaW4hJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNoYW5nZVBhc3N3b3JkKG1vZGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICBpZiAobW9kZSA9PSAnYWRkJykge1xuICAgICAgb3B0aW9ucy5tb2RlID0gJ2FkZCc7XG4gICAgICBvcHRpb25zLnByb21wdCA9ICdFbnRlciB0aGUgbWFzdGVyIHBhc3N3b3JkLiBBbGwgaW5mb3JtYXRpb24gYWJvdXQgeW91ciBzZXJ2ZXIgc2V0dGluZ3Mgd2lsbCBiZSBlbmNyeXB0ZWQgd2l0aCB0aGlzIHBhc3N3b3JkLic7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMubW9kZSA9ICdjaGFuZ2UnO1xuICAgIH1cblxuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBDaGFuZ2VQYXNzRGlhbG9nKG9wdGlvbnMpO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGlhbG9nLm9uKCdkaWFsb2ctZG9uZScsIChlLCBwYXNzd29yZHMpID0+IHtcblxuICAgICAgICAvLyBDaGVjayB0aGF0IHBhc3N3b3JkIGZyb20gbmV3IG1hc3RlciBwYXNzd29yZCBjYW4gZGVjcnlwdCBjdXJyZW50IGNvbmZpZ1xuICAgICAgICBpZiAobW9kZSA9PSAnYWRkJykge1xuICAgICAgICAgIGxldCBjb25maWdIYXNoID0gYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQuY29uZmlnJyk7XG4gICAgICAgICAgaWYgKGNvbmZpZ0hhc2gpIHtcbiAgICAgICAgICAgIGxldCBuZXdQYXNzd29yZCA9IHBhc3N3b3Jkcy5uZXdQYXNzd29yZDtcbiAgICAgICAgICAgIGxldCB0ZXN0Q29uZmlnID0gZGVjcnlwdChuZXdQYXNzd29yZCwgY29uZmlnSGFzaCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGxldCB0ZXN0SnNvbiA9IEpTT04ucGFyc2UodGVzdENvbmZpZyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIC8vIElmIG1hc3RlciBwYXNzd29yZCBkb2VzIG5vdCBkZWNyeXB0IGN1cnJlbnQgY29uZmlnLFxuICAgICAgICAgICAgICAvLyBwcm9tcHQgdGhlIHVzZXIgdG8gcmVwbHkgdG8gaW5zZXJ0IGNvcnJlY3QgcGFzc3dvcmRcbiAgICAgICAgICAgICAgLy8gb3IgcmVzZXQgY29uZmlnIGNvbnRlbnRcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ01hc3RlciBwYXNzd29yZCBkb2VzIG5vdCBtYXRjaCB3aXRoIHByZXZpb3VzIHVzZWQuIFBsZWFzZSByZXRyeSBvciBkZWxldGUgXCJjb25maWdcIiBlbnRyeSBpbiBmdHAtcmVtb3RlLWVkaXQgY29uZmlndXJhdGlvbiBub2RlLicsICdlcnJvcicpO1xuXG4gICAgICAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvbGRQYXNzd29yZFZhbHVlID0gKG1vZGUgPT0gJ2FkZCcpID8gcGFzc3dvcmRzLm5ld1Bhc3N3b3JkIDogcGFzc3dvcmRzLm9sZFBhc3N3b3JkO1xuXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkKG9sZFBhc3N3b3JkVmFsdWUsIHBhc3N3b3Jkcy5uZXdQYXNzd29yZCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgU3RvcmFnZS5zZXRQYXNzd29yZChwYXNzd29yZHMubmV3UGFzc3dvcmQpO1xuXG4gICAgICAgICAgaWYgKG1vZGUgIT0gJ2FkZCcpIHtcbiAgICAgICAgICAgIHNob3dNZXNzYWdlKCdNYXN0ZXIgcGFzc3dvcmQgc3VjY2Vzc2Z1bGx5IGNoYW5nZWQuIFBsZWFzZSByZXN0YXJ0IGF0b20hJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICB9KTtcblxuICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgaWYgKCFjaGVja1Bhc3N3b3JkRXhpc3RzKCkpIHtcbiAgICAgICAgc2VsZi5jaGFuZ2VQYXNzd29yZCgnYWRkJykudGhlbigocmV0dXJuVmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAocmV0dXJuVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChTdG9yYWdlLmxvYWQoKSkge1xuICAgICAgICAgICAgICBzZWxmLnRyZWVWaWV3LnJlbG9hZCgpO1xuICAgICAgICAgICAgICBzZWxmLnRyZWVWaWV3LnRvZ2dsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYucHJvbXRQYXNzd29yZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGlmIChTdG9yYWdlLmxvYWQoKSkge1xuICAgICAgICAgICAgc2VsZi50cmVlVmlldy5yZWxvYWQoKTtcbiAgICAgICAgICAgIHNlbGYudHJlZVZpZXcudG9nZ2xlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIVN0b3JhZ2UubG9hZGVkICYmIFN0b3JhZ2UubG9hZCgpKSB7XG4gICAgICBzZWxmLnRyZWVWaWV3LnJlbG9hZCgpO1xuICAgIH1cbiAgICBzZWxmLnRyZWVWaWV3LnRvZ2dsZSgpO1xuICB9XG5cbiAgdG9nZ2xlRm9jdXMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50cmVlVmlldy50b2dnbGVGb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHNob3coKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50cmVlVmlldy5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYudHJlZVZpZXcuaGlkZSgpO1xuICB9XG5cbiAgY29uZmlndXJhdGlvbigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGxldCByb290ID0gbnVsbDtcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICB9O1xuXG4gICAgaWYgKHNlbGYuY29uZmlndXJhdGlvblZpZXcgPT0gbnVsbCkge1xuICAgICAgc2VsZi5jb25maWd1cmF0aW9uVmlldyA9IG5ldyBDb25maWd1cmF0aW9uVmlldygpO1xuICAgIH1cblxuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICBzZWxmLnByb210UGFzc3dvcmQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKFN0b3JhZ2UubG9hZCgpKSB7XG4gICAgICAgICAgc2VsZi5jb25maWd1cmF0aW9uVmlldy5yZWxvYWQocm9vdCk7XG4gICAgICAgICAgc2VsZi5jb25maWd1cmF0aW9uVmlldy5hdHRhY2goKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5jb25maWd1cmF0aW9uVmlldy5yZWxvYWQocm9vdCk7XG4gICAgc2VsZi5jb25maWd1cmF0aW9uVmlldy5hdHRhY2goKTtcbiAgfVxuXG4gIGFkZFRlbXBTZXJ2ZXIoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBsZXQgcm9vdCA9IG51bGw7XG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICByb290LmNvbmZpZy50ZW1wID0gZmFsc2U7XG4gICAgICBzZWxmLnRyZWVWaWV3LnJlbW92ZVNlcnZlcihzZWxlY3RlZC52aWV3KCkpO1xuICAgICAgU3RvcmFnZS5hZGRTZXJ2ZXIocm9vdC5jb25maWcpO1xuICAgICAgU3RvcmFnZS5zYXZlKCk7XG4gICAgfTtcbiAgfVxuXG4gIHJlbW92ZVRlbXBTZXJ2ZXIoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICBzZWxmLnRyZWVWaWV3LnJlbW92ZVNlcnZlcihzZWxlY3RlZC52aWV3KCkpO1xuICAgIH07XG4gIH1cblxuICBvcGVuKHBlbmRpbmcgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBzZWxmLm9wZW5GaWxlKGZpbGUsIHBlbmRpbmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIHNlbGYub3BlbkRpcmVjdG9yeShkaXJlY3RvcnkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWxlKGZpbGUsIHBlbmRpbmcgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIFBhdGguc2VwKTtcblxuICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuICAgIGlmIChnZXRUZXh0RWRpdG9yKGZ1bGxMb2NhbFBhdGgsIHRydWUpKSB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZ1bGxMb2NhbFBhdGgsIHsgcGVuZGluZzogcGVuZGluZywgc2VhcmNoQWxsUGFuZXM6IHRydWUgfSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZWxmLmRvd25sb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgZnVsbFJlbGF0aXZlUGF0aCwgZnVsbExvY2FsUGF0aCwgeyBmaWxlc2l6ZTogZmlsZS5zaXplIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gT3BlbiBmaWxlIGFuZCBhZGQgaGFuZGxlciB0byBlZGl0b3IgdG8gdXBsb2FkIGZpbGUgb24gc2F2ZVxuICAgICAgcmV0dXJuIHNlbGYub3BlbkZpbGVJbkVkaXRvcihmaWxlLCBwZW5kaW5nKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgb3BlbkRpcmVjdG9yeShkaXJlY3RvcnkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5leHBhbmQoKTtcbiAgfVxuXG4gIGNyZWF0ZSh0eXBlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCkucGFyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBBZGREaWFsb2coZGlyZWN0b3J5LmdldFBhdGgoZmFsc2UpLCB0cnVlKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmNyZWF0ZUZpbGUoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdkaXJlY3RvcnknKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBBZGREaWFsb2coZGlyZWN0b3J5LmdldFBhdGgoZmFsc2UpLCBmYWxzZSk7XG4gICAgICAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgc2VsZi5jcmVhdGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUZpbGUoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gY3JlYXRlIGxvY2FsIGZpbGVcbiAgICAgIGlmICghRmlsZVN5c3RlbS5leGlzdHNTeW5jKGZ1bGxMb2NhbFBhdGgpKSB7XG4gICAgICAgIC8vIENyZWF0ZSBsb2NhbCBEaXJlY3RvcnlcbiAgICAgICAgY3JlYXRlTG9jYWxQYXRoKGZ1bGxMb2NhbFBhdGgpO1xuICAgICAgICBGaWxlU3lzdGVtLndyaXRlRmlsZVN5bmMoZnVsbExvY2FsUGF0aCwgJycpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkaXJlY3RvcnkuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRmlsZShmdWxsUmVsYXRpdmVQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKCdGaWxlICcgKyByZWxhdGl2ZVBhdGgudHJpbSgpICsgJyBhbHJlYWR5IGV4aXN0cycsICdlcnJvcicpO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHNlbGYudXBsb2FkRmlsZShkaXJlY3RvcnksIGZ1bGxMb2NhbFBhdGgsIGZ1bGxSZWxhdGl2ZVBhdGgsIGZhbHNlKS50aGVuKChkdXBsaWNhdGVkRmlsZSkgPT4ge1xuICAgICAgICBpZiAoZHVwbGljYXRlZEZpbGUpIHtcbiAgICAgICAgICAvLyBPcGVuIGZpbGUgYW5kIGFkZCBoYW5kbGVyIHRvIGVkaXRvciB0byB1cGxvYWQgZmlsZSBvbiBzYXZlXG4gICAgICAgICAgcmV0dXJuIHNlbGYub3BlbkZpbGVJbkVkaXRvcihkdXBsaWNhdGVkRmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgcmVsYXRpdmVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZWxhdGl2ZVBhdGggPSB0cmFpbGluZ3NsYXNoaXQocmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldExvY2FsUGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCwgUGF0aC5zZXApO1xuXG4gICAgLy8gY3JlYXRlIGxvY2FsIGRpcmVjdG9yeVxuICAgIHRyeSB7XG4gICAgICBpZiAoIUZpbGVTeXN0ZW0uZXhpc3RzU3luYyhmdWxsTG9jYWxQYXRoKSkge1xuICAgICAgICBjcmVhdGVMb2NhbFBhdGgoZnVsbExvY2FsUGF0aCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7IH1cblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5leGlzdHNEaXJlY3RvcnkoZnVsbFJlbGF0aXZlUGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBzaG93TWVzc2FnZSgnRGlyZWN0b3J5ICcgKyByZWxhdGl2ZVBhdGgudHJpbSgpICsgJyBhbHJlYWR5IGV4aXN0cycsICdlcnJvcicpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHJldHVybiBkaXJlY3RvcnkuZ2V0Q29ubmVjdG9yKCkuY3JlYXRlRGlyZWN0b3J5KGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRSb290KCksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmFtZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IFJlbmFtZURpYWxvZyhmaWxlLmdldFBhdGgoZmFsc2UpICsgZmlsZS5uYW1lLCB0cnVlKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLnJlbmFtZUZpbGUoZmlsZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgICBjb25zdCBkaWFsb2cgPSBuZXcgUmVuYW1lRGlhbG9nKHRyYWlsaW5nc2xhc2hpdChkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpLCBmYWxzZSk7XG4gICAgICAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgc2VsZi5yZW5hbWVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbmFtZUZpbGUoZmlsZSwgcmVsYXRpdmVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICBmaWxlLmdldENvbm5lY3RvcigpLnJlbmFtZShmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgZmlsZS5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5yZW5hbWVGaWxlKG5vcm1hbGl6ZShmaWxlLmdldFBhdGgoZmFsc2UpICsgZmlsZS5uYW1lKSwgbm9ybWFsaXplKHJlbGF0aXZlUGF0aCksIGZpbGUuc2l6ZSk7XG5cbiAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRmlsZShmaWxlLmdldFJvb3QoKSwgcmVsYXRpdmVQYXRoLCB7IHNpemU6IGZpbGUuc2l6ZSwgcmlnaHRzOiBmaWxlLnJpZ2h0cyB9KTtcbiAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIGVsZW1lbnQuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuICAgICAgbGV0IGZvdW5kID0gZ2V0VGV4dEVkaXRvcihmaWxlLmdldExvY2FsUGF0aCh0cnVlKSArIGZpbGUubmFtZSk7XG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICBmb3VuZC5zYXZlT2JqZWN0ID0gZWxlbWVudDtcbiAgICAgICAgZm91bmQuc2F2ZUFzKGVsZW1lbnQuZ2V0TG9jYWxQYXRoKHRydWUpICsgZWxlbWVudC5uYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gTW92ZSBsb2NhbCBmaWxlXG4gICAgICBtb3ZlTG9jYWxQYXRoKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBmdWxsTG9jYWxQYXRoKTtcblxuICAgICAgLy8gUmVtb3ZlIG9sZCBmaWxlIGZyb20gdHJlZVxuICAgICAgaWYgKGZpbGUpIGZpbGUucmVtb3ZlKClcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICByZW5hbWVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJlbGF0aXZlUGF0aCA9IHRyYWlsaW5nc2xhc2hpdChyZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICBkaXJlY3RvcnkuZ2V0Q29ubmVjdG9yKCkucmVuYW1lKGRpcmVjdG9yeS5nZXRQYXRoKCksIGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLnJlbmFtZURpcmVjdG9yeShub3JtYWxpemUoZGlyZWN0b3J5LmdldFBhdGgoZmFsc2UpKSwgbm9ybWFsaXplKHJlbGF0aXZlUGF0aCArICcvJykpO1xuXG4gICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLnRyZWVWaWV3LmFkZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0Um9vdCgpLCByZWxhdGl2ZVBhdGgsIHsgcmlnaHRzOiBkaXJlY3RvcnkucmlnaHRzIH0pO1xuICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ET1xuICAgICAgLy8gQ2hlY2sgaWYgZmlsZXMgYXJlIGFscmVhZHkgb3BlbmVkIGluIHRleHRlZGl0b3JcblxuICAgICAgLy8gTW92ZSBsb2NhbCBkaXJlY3RvcnlcbiAgICAgIG1vdmVMb2NhbFBhdGgoZGlyZWN0b3J5LmdldExvY2FsUGF0aCh0cnVlKSwgZnVsbExvY2FsUGF0aCk7XG5cbiAgICAgIC8vIFJlbW92ZSBvbGQgZGlyZWN0b3J5IGZyb20gdHJlZVxuICAgICAgaWYgKGRpcmVjdG9yeSkgZGlyZWN0b3J5LnJlbW92ZSgpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgZHVwbGljYXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBjb25zdCBkaWFsb2cgPSBuZXcgRHVwbGljYXRlRGlhbG9nKGZpbGUuZ2V0UGF0aChmYWxzZSkgKyBmaWxlLm5hbWUpO1xuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZShmaWxlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIC8vIFRPRE9cbiAgICAgIC8vIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICAvLyBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAvLyAgIGNvbnN0IGRpYWxvZyA9IG5ldyBEdXBsaWNhdGVEaWFsb2codHJhaWxpbmdzbGFzaGl0KGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSkpO1xuICAgICAgLy8gICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgLy8gICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgIC8vICAgICAgIHNlbGYuZHVwbGljYXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIC8vICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICAgIC8vIH1cbiAgICB9XG4gIH1cblxuICBkdXBsaWNhdGVGaWxlKGZpbGUsIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0Um9vdCgpLmdldExvY2FsUGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCwgUGF0aC5zZXApO1xuXG4gICAgZmlsZS5nZXRDb25uZWN0b3IoKS5leGlzdHNGaWxlKGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgJyArIHJlbGF0aXZlUGF0aC50cmltKCkgKyAnIGFscmVhZHkgZXhpc3RzJywgJ2Vycm9yJyk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VsZi5kb3dubG9hZEZpbGUoZmlsZS5nZXRSb290KCksIGZpbGUuZ2V0UGF0aCh0cnVlKSArIGZpbGUubmFtZSwgZnVsbExvY2FsUGF0aCwgeyBmaWxlc2l6ZTogZmlsZS5zaXplIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBzZWxmLnVwbG9hZEZpbGUoZmlsZS5nZXRSb290KCksIGZ1bGxMb2NhbFBhdGgsIGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKGR1cGxpY2F0ZWRGaWxlKSA9PiB7XG4gICAgICAgICAgaWYgKGR1cGxpY2F0ZWRGaWxlKSB7XG4gICAgICAgICAgICAvLyBPcGVuIGZpbGUgYW5kIGFkZCBoYW5kbGVyIHRvIGVkaXRvciB0byB1cGxvYWQgZmlsZSBvbiBzYXZlXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcGVuRmlsZUluRWRpdG9yKGR1cGxpY2F0ZWRGaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZHVwbGljYXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgcmVsYXRpdmVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldExvY2FsUGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCwgUGF0aC5zZXApO1xuXG4gICAgLy8gVE9ET1xuICB9XG5cbiAgZGVsZXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgZmlsZT8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIGRlbGV0aW5nOlxcblwiICsgZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmb2xkZXI/JyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBkZWxldGluZzpcXG5cIiArIHRyYWlsaW5nc2xhc2hpdChkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIFllczogKCkgPT4ge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZURpcmVjdG9yeShkaXJlY3RvcnksIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZUZpbGUoZmlsZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldExvY2FsUGF0aCh0cnVlKSArIGZpbGUubmFtZSwgUGF0aC5zZXApO1xuXG4gICAgZmlsZS5nZXRDb25uZWN0b3IoKS5kZWxldGVGaWxlKGZpbGUuZ2V0UGF0aCh0cnVlKSArIGZpbGUubmFtZSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICBmaWxlLmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLmRlbGV0ZUZpbGUobm9ybWFsaXplKGZpbGUuZ2V0UGF0aChmYWxzZSkgKyBmaWxlLm5hbWUpKTtcblxuICAgICAgLy8gRGVsZXRlIGxvY2FsIGZpbGVcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZnVsbExvY2FsUGF0aCkpIHtcbiAgICAgICAgICBGaWxlU3lzdGVtLnVubGlua1N5bmMoZnVsbExvY2FsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG5cbiAgICAgIGZpbGUucGFyZW50LnNlbGVjdCgpO1xuICAgICAgZmlsZS5kZXN0cm95KCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgcmVjdXJzaXZlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBkaXJlY3RvcnkuZ2V0Q29ubmVjdG9yKCkuZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRQYXRoKCksIHJlY3Vyc2l2ZSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICBkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuZGVsZXRlRGlyZWN0b3J5KG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpKTtcblxuICAgICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IChkaXJlY3RvcnkuZ2V0TG9jYWxQYXRoKHRydWUpKS5yZXBsYWNlKC9cXC8rL2csIFBhdGguc2VwKTtcblxuICAgICAgLy8gRGVsZXRlIGxvY2FsIGRpcmVjdG9yeVxuICAgICAgZGVsZXRlTG9jYWxQYXRoKGZ1bGxMb2NhbFBhdGgpO1xuXG4gICAgICBkaXJlY3RvcnkucGFyZW50LnNlbGVjdCgpO1xuICAgICAgZGlyZWN0b3J5LmRlc3Ryb3koKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICBjaG1vZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgY29uc3QgcGVybWlzc2lvbnNWaWV3ID0gbmV3IFBlcm1pc3Npb25zVmlldyhmaWxlKTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3Lm9uKCdjaGFuZ2UtcGVybWlzc2lvbnMnLCAoZSwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgc2VsZi5jaG1vZEZpbGUoZmlsZSwgcmVzdWx0LnBlcm1pc3Npb25zKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBlcm1pc3Npb25zVmlldy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1ZpZXcgPSBuZXcgUGVybWlzc2lvbnNWaWV3KGRpcmVjdG9yeSk7XG4gICAgICAgIHBlcm1pc3Npb25zVmlldy5vbignY2hhbmdlLXBlcm1pc3Npb25zJywgKGUsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHNlbGYuY2htb2REaXJlY3RvcnkoZGlyZWN0b3J5LCByZXN1bHQucGVybWlzc2lvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3LmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNobW9kRmlsZShmaWxlLCBwZXJtaXNzaW9ucykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZmlsZS5nZXRDb25uZWN0b3IoKS5jaG1vZEZpbGUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBwZXJtaXNzaW9ucykudGhlbigocmVzcG9uc2VUZXh0KSA9PiB7XG4gICAgICBmaWxlLnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMocGVybWlzc2lvbnMpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kRGlyZWN0b3J5KGRpcmVjdG9yeSwgcGVybWlzc2lvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5jaG1vZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0UGF0aCh0cnVlKSwgcGVybWlzc2lvbnMpLnRoZW4oKHJlc3BvbnNlVGV4dCkgPT4ge1xuICAgICAgZGlyZWN0b3J5LnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMocGVybWlzc2lvbnMpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbG9hZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgc2VsZi5yZWxvYWRGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykgfHwgc2VsZWN0ZWQudmlldygpLmlzKCcuc2VydmVyJykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIHNlbGYucmVsb2FkRGlyZWN0b3J5KGRpcmVjdG9yeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkRmlsZShmaWxlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0UGF0aCh0cnVlKSArIGZpbGUubmFtZSk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldExvY2FsUGF0aCh0cnVlKSArIGZpbGUubmFtZSwgUGF0aC5zZXApO1xuXG4gICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgaWYgKGdldFRleHRFZGl0b3IoZnVsbExvY2FsUGF0aCwgdHJ1ZSkpIHtcbiAgICAgIHNlbGYuZG93bmxvYWRGaWxlKGZpbGUuZ2V0Um9vdCgpLCBmdWxsUmVsYXRpdmVQYXRoLCBmdWxsTG9jYWxQYXRoLCB7IGZpbGVzaXplOiBmaWxlLnNpemUgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkRGlyZWN0b3J5KGRpcmVjdG9yeSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZGlyZWN0b3J5LmV4cGFuZGVkID0gZmFsc2U7XG4gICAgZGlyZWN0b3J5LmV4cGFuZCgpO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGVsZW1lbnQuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBzdG9yYWdlID0gZWxlbWVudC5zZXJpYWxpemUoKTtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCcpXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbJ2Z0cC1yZW1vdGUtZWRpdDpjb3B5UGF0aCddID0gZW5jcnlwdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKTtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgLy8gVE9ET1xuICAgIH1cbiAgfVxuXG4gIGN1dCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3RlZC52aWV3KCk7XG5cbiAgICBpZiAoZWxlbWVudC5pcygnLmZpbGUnKSB8fCBlbGVtZW50LmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBzdG9yYWdlID0gZWxlbWVudC5zZXJpYWxpemUoKTtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnKVxuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCddID0gZW5jcnlwdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKTtcbiAgICB9XG4gIH1cblxuICBwYXN0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGRlc3RPYmplY3QgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGRlc3RPYmplY3QuaXMoJy5maWxlJykpIHtcbiAgICAgIGRlc3RPYmplY3QgPSBkZXN0T2JqZWN0LnBhcmVudDtcbiAgICB9XG5cbiAgICBsZXQgZGF0YU9iamVjdCA9IG51bGw7XG4gICAgbGV0IHNyY09iamVjdCA9IG51bGw7XG4gICAgbGV0IGhhbmRsZUV2ZW50ID0gbnVsbDtcblxuICAgIGxldCBzcmNUeXBlID0gbnVsbDtcbiAgICBsZXQgc3JjUGF0aCA9IG51bGw7XG4gICAgbGV0IGRlc3RQYXRoID0gbnVsbDtcblxuICAgIC8vIFBhcnNlIGRhdGEgZnJvbSBjb3B5L2N1dC9kcmFnIGV2ZW50XG4gICAgaWYgKHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmN1dFBhdGgnXSkge1xuICAgICAgLy8gQ3V0IGV2ZW50IGZyb20gQXRvbVxuICAgICAgaGFuZGxlRXZlbnQgPSBcImN1dFwiO1xuXG4gICAgICBsZXQgY3V0T2JqZWN0U3RyaW5nID0gZGVjcnlwdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmN1dFBhdGgnXSk7XG4gICAgICBkYXRhT2JqZWN0ID0gKGN1dE9iamVjdFN0cmluZykgPyBKU09OLnBhcnNlKGN1dE9iamVjdFN0cmluZykgOiBudWxsO1xuXG4gICAgICBsZXQgZmluZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcjJyArIGRhdGFPYmplY3QuaWQpO1xuICAgICAgaWYgKCFmaW5kKSByZXR1cm47XG5cbiAgICAgIHNyY09iamVjdCA9IGZpbmQudmlldygpO1xuICAgICAgaWYgKCFzcmNPYmplY3QpIHJldHVybjtcblxuICAgICAgaWYgKHNyY09iamVjdC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICAgIHNyY1R5cGUgPSAnZGlyZWN0b3J5JztcbiAgICAgICAgc3JjUGF0aCA9IHNyY09iamVjdC5nZXRQYXRoKHRydWUpO1xuICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3JjVHlwZSA9ICdmaWxlJztcbiAgICAgICAgc3JjUGF0aCA9IHNyY09iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIGNvcHkvY3V0IG9wZXJhdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIG9uIHRoZSBzYW1lIHNlcnZlclxuICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGRlc3RPYmplY3QuY29uZmlnKSAhPSBKU09OLnN0cmluZ2lmeShzcmNPYmplY3QuY29uZmlnKSkgcmV0dXJuO1xuXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZnRwLXJlbW90ZS1lZGl0OmN1dFBhdGgnKTtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnKTtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJ10pIHtcbiAgICAgIC8vIENvcHkgZXZlbnQgZnJvbSBBdG9tXG4gICAgICBoYW5kbGVFdmVudCA9IFwiY29weVwiO1xuXG4gICAgICBsZXQgY29waWVkT2JqZWN0U3RyaW5nID0gZGVjcnlwdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJ10pO1xuICAgICAgZGF0YU9iamVjdCA9IChjb3BpZWRPYmplY3RTdHJpbmcpID8gSlNPTi5wYXJzZShjb3BpZWRPYmplY3RTdHJpbmcpIDogbnVsbDtcblxuICAgICAgbGV0IGZpbmQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnIycgKyBkYXRhT2JqZWN0LmlkKTtcbiAgICAgIGlmICghZmluZCkgcmV0dXJuO1xuXG4gICAgICBzcmNPYmplY3QgPSBmaW5kLnZpZXcoKTtcbiAgICAgIGlmICghc3JjT2JqZWN0KSByZXR1cm47XG5cbiAgICAgIGlmIChzcmNPYmplY3QuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgICBzcmNUeXBlID0gJ2RpcmVjdG9yeSc7XG4gICAgICAgIHNyY1BhdGggPSBzcmNPYmplY3QuZ2V0UGF0aCh0cnVlKTtcbiAgICAgICAgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNyY1R5cGUgPSAnZmlsZSc7XG4gICAgICAgIHNyY1BhdGggPSBzcmNPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiBjb3B5L2N1dCBvcGVyYXRpb24gc2hvdWxkIGJlIHBlcmZvcm1lZCBvbiB0aGUgc2FtZSBzZXJ2ZXJcbiAgICAgIGlmIChKU09OLnN0cmluZ2lmeShkZXN0T2JqZWN0LmNvbmZpZykgIT0gSlNPTi5zdHJpbmdpZnkoc3JjT2JqZWN0LmNvbmZpZykpIHJldHVybjtcblxuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJyk7XG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGFuZGxlRXZlbnQgPT0gXCJjdXRcIikge1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2RpcmVjdG9yeScpIHNlbGYubW92ZURpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2ZpbGUnKSBzZWxmLm1vdmVGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVFdmVudCA9PSBcImNvcHlcIikge1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2RpcmVjdG9yeScpIHNlbGYuY29weURpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2ZpbGUnKSBzZWxmLmNvcHlGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCwgeyBmaWxlc2l6ZTogc3JjT2JqZWN0LnNpemUgfSk7XG4gICAgfVxuICB9XG5cbiAgZHJvcChlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKCFTdG9yYWdlLmhhc1Bhc3N3b3JkKCkpIHJldHVybjtcblxuICAgIGxldCBkZXN0T2JqZWN0ID0gc2VsZWN0ZWQudmlldygpO1xuICAgIGlmIChkZXN0T2JqZWN0LmlzKCcuZmlsZScpKSB7XG4gICAgICBkZXN0T2JqZWN0ID0gZGVzdE9iamVjdC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgbGV0IGluaXRpYWxQYXRoLCBpbml0aWFsTmFtZSwgaW5pdGlhbFR5cGUsIHJlZjtcbiAgICBpZiAoZW50cnkgPSBlLnRhcmdldC5jbG9zZXN0KCcuZW50cnknKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKCFkZXN0T2JqZWN0LmlzKCcuZGlyZWN0b3J5JykgJiYgIWRlc3RPYmplY3QuaXMoJy5zZXJ2ZXInKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgICBpbml0aWFsUGF0aCA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsUGF0aFwiKTtcbiAgICAgICAgaW5pdGlhbE5hbWUgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbE5hbWVcIik7XG4gICAgICAgIGluaXRpYWxUeXBlID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFBhdGggPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsUGF0aFwiKTtcbiAgICAgICAgaW5pdGlhbE5hbWUgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsTmFtZVwiKTtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsVHlwZVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluaXRpYWxUeXBlID09IFwiZGlyZWN0b3J5XCIpIHtcbiAgICAgICAgaWYgKG5vcm1hbGl6ZShpbml0aWFsUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RPYmplY3QuZ2V0UGF0aChmYWxzZSkgKyBpbml0aWFsTmFtZSArICcvJykpIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoaW5pdGlhbFR5cGUgPT0gXCJmaWxlXCIpIHtcbiAgICAgICAgaWYgKG5vcm1hbGl6ZShpbml0aWFsUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RPYmplY3QuZ2V0UGF0aChmYWxzZSkgKyBpbml0aWFsTmFtZSkpIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGluaXRpYWxQYXRoKSB7XG4gICAgICAgIC8vIERyb3AgZXZlbnQgZnJvbSBBdG9tXG4gICAgICAgIGlmIChpbml0aWFsVHlwZSA9PSBcImRpcmVjdG9yeVwiKSB7XG4gICAgICAgICAgbGV0IHNyY1BhdGggPSB0cmFpbGluZ3NsYXNoaXQoZGVzdE9iamVjdC5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSkgKyBpbml0aWFsUGF0aDtcbiAgICAgICAgICBsZXQgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBpbml0aWFsTmFtZSArICcvJztcbiAgICAgICAgICBzZWxmLm1vdmVEaXJlY3RvcnkoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbml0aWFsVHlwZSA9PSBcImZpbGVcIikge1xuICAgICAgICAgIGxldCBzcmNQYXRoID0gdHJhaWxpbmdzbGFzaGl0KGRlc3RPYmplY3QuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkpICsgaW5pdGlhbFBhdGg7XG4gICAgICAgICAgbGV0IGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgaW5pdGlhbE5hbWU7XG4gICAgICAgICAgc2VsZi5tb3ZlRmlsZShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEcm9wIGV2ZW50IGZyb20gT1NcbiAgICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgICAgcmVmID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVmID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgZmlsZSA9IHJlZltpXTtcbiAgICAgICAgICBsZXQgc3JjUGF0aCA9IGZpbGUucGF0aDtcbiAgICAgICAgICBsZXQgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBiYXNlbmFtZShmaWxlLnBhdGgsIFBhdGguc2VwKTtcblxuICAgICAgICAgIGlmIChGaWxlU3lzdGVtLnN0YXRTeW5jKGZpbGUucGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgc2VsZi51cGxvYWREaXJlY3RvcnkoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi51cGxvYWRGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBsb2FkKHR5cGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGRlc3RPYmplY3QgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGRlc3RPYmplY3QuaXMoJy5maWxlJykpIHtcbiAgICAgIGRlc3RPYmplY3QgPSBkZXN0T2JqZWN0LnBhcmVudDtcbiAgICB9XG5cbiAgICBsZXQgZGVmYXVsdFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmFuc2Zlci5kZWZhdWx0VXBsb2FkUGF0aCcpIHx8ICdkZXNrdG9wJztcbiAgICBpZiAoZGVmYXVsdFBhdGggPT0gJ3Byb2plY3QnKSB7XG4gICAgICBjb25zdCBwcm9qZWN0cyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgICAgZGVmYXVsdFBhdGggPSBwcm9qZWN0cy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoZGVmYXVsdFBhdGggPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICBkZWZhdWx0UGF0aCA9IEVsZWN0cm9uLnJlbW90ZS5hcHAuZ2V0UGF0aChcImRlc2t0b3BcIilcbiAgICB9IGVsc2UgaWYgKGRlZmF1bHRQYXRoID09ICdkb3dubG9hZHMnKSB7XG4gICAgICBkZWZhdWx0UGF0aCA9IEVsZWN0cm9uLnJlbW90ZS5hcHAuZ2V0UGF0aChcImRvd25sb2Fkc1wiKVxuICAgIH1cbiAgICBsZXQgc3JjUGF0aCA9IG51bGw7XG4gICAgbGV0IGRlc3RQYXRoID0gbnVsbDtcblxuICAgIGlmICh0eXBlID09ICdmaWxlJykge1xuICAgICAgRWxlY3Ryb24ucmVtb3RlLmRpYWxvZy5zaG93T3BlbkRpYWxvZyhudWxsLCB7IHRpdGxlOiAnU2VsZWN0IGZpbGUocykgZm9yIHVwbG9hZC4uLicsIGRlZmF1bHRQYXRoOiBkZWZhdWx0UGF0aCwgYnV0dG9uTGFiZWw6ICdVcGxvYWQnLCBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJywgJ211bHRpU2VsZWN0aW9ucycsICdzaG93SGlkZGVuRmlsZXMnXSB9LCAoZmlsZVBhdGhzLCBib29rbWFya3MpID0+IHtcbiAgICAgICAgaWYgKGZpbGVQYXRocykge1xuICAgICAgICAgIFByb21pc2UuYWxsKGZpbGVQYXRocy5tYXAoKGZpbGVQYXRoKSA9PiB7XG4gICAgICAgICAgICBzcmNQYXRoID0gZmlsZVBhdGg7XG4gICAgICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGJhc2VuYW1lKGZpbGVQYXRoLCBQYXRoLnNlcCk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi51cGxvYWRGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICAgICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUocykgaGFzIGJlZW4gdXBsb2FkZWQgdG86IFxcciBcXG4nICsgZmlsZVBhdGhzLmpvaW4oJ1xcciBcXG4nKSwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd09wZW5EaWFsb2cobnVsbCwgeyB0aXRsZTogJ1NlbGVjdCBkaXJlY3RvcnkgZm9yIHVwbG9hZC4uLicsIGRlZmF1bHRQYXRoOiBkZWZhdWx0UGF0aCwgYnV0dG9uTGFiZWw6ICdVcGxvYWQnLCBwcm9wZXJ0aWVzOiBbJ29wZW5EaXJlY3RvcnknLCAnc2hvd0hpZGRlbkZpbGVzJ10gfSwgKGRpcmVjdG9yeVBhdGhzLCBib29rbWFya3MpID0+IHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeVBhdGhzKSB7XG4gICAgICAgICAgZGlyZWN0b3J5UGF0aHMuZm9yRWFjaCgoZGlyZWN0b3J5UGF0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNyY1BhdGggPSBkaXJlY3RvcnlQYXRoO1xuICAgICAgICAgICAgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBiYXNlbmFtZShkaXJlY3RvcnlQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAgICAgICAgIHNlbGYudXBsb2FkRGlyZWN0b3J5KGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgaGFzIGJlZW4gdXBsb2FkZWQgdG8gJyArIGRlc3RQYXRoLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRvd25sb2FkKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVmYXVsdFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmFuc2Zlci5kZWZhdWx0RG93bmxvYWRQYXRoJykgfHwgJ2Rvd25sb2Fkcyc7XG4gICAgaWYgKGRlZmF1bHRQYXRoID09ICdwcm9qZWN0Jykge1xuICAgICAgY29uc3QgcHJvamVjdHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGRlZmF1bHRQYXRoID0gcHJvamVjdHMuc2hpZnQoKTtcbiAgICB9IGVsc2UgaWYgKGRlZmF1bHRQYXRoID09ICdkZXNrdG9wJykge1xuICAgICAgZGVmYXVsdFBhdGggPSBFbGVjdHJvbi5yZW1vdGUuYXBwLmdldFBhdGgoXCJkZXNrdG9wXCIpXG4gICAgfSBlbHNlIGlmIChkZWZhdWx0UGF0aCA9PSAnZG93bmxvYWRzJykge1xuICAgICAgZGVmYXVsdFBhdGggPSBFbGVjdHJvbi5yZW1vdGUuYXBwLmdldFBhdGgoXCJkb3dubG9hZHNcIilcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcblxuICAgICAgICBFbGVjdHJvbi5yZW1vdGUuZGlhbG9nLnNob3dTYXZlRGlhbG9nKG51bGwsIHsgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoICsgXCIvXCIgKyBmaWxlLm5hbWUgfSwgKGRlc3RQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKGRlc3RQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmRvd25sb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgsIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFBhdGgodHJ1ZSkpO1xuXG4gICAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd1NhdmVEaWFsb2cobnVsbCwgeyBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGggKyBcIi9cIiArIGRpcmVjdG9yeS5uYW1lIH0sIChkZXN0UGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChkZXN0UGF0aCkge1xuICAgICAgICAgICAgc2VsZi5kb3dubG9hZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuc2VydmVyJykpIHtcbiAgICAgIGxldCBzZXJ2ZXIgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoc2VydmVyKSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoc2VydmVyLmdldFBhdGgodHJ1ZSkpO1xuXG4gICAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd1NhdmVEaWFsb2cobnVsbCwgeyBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGggKyBcIi9cIiB9LCAoZGVzdFBhdGgpID0+IHtcbiAgICAgICAgICBpZiAoZGVzdFBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWREaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1vdmVGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChub3JtYWxpemUoc3JjUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RQYXRoKSkgcmV0dXJuO1xuXG4gICAgc2VydmVyLmdldENvbm5lY3RvcigpLmV4aXN0c0ZpbGUoZGVzdFBhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGZpbGU/JyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBvdmVyd3JpdGU6XFxuXCIgKyBkZXN0UGF0aC50cmltKCksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5kZWxldGVGaWxlKGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLnJlbmFtZShzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIGdldCBpbmZvIGZyb20gb2xkIG9iamVjdFxuICAgICAgICBsZXQgb2xkT2JqZWN0ID0gc2VsZi50cmVlVmlldy5maW5kRWxlbWVudEJ5UGF0aChzZXJ2ZXIsIHRyYWlsaW5nc2xhc2hpdChzcmNQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcnKSkpO1xuICAgICAgICBjb25zdCBjYWNoZVBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuZ2V0Um9vdCgpLmNvbmZpZy5yZW1vdGUsICcvJykpO1xuXG4gICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi50cmVlVmlldy5hZGRGaWxlKHNlcnZlciwgY2FjaGVQYXRoLCB7IHNpemU6IChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnNpemUgOiBudWxsLCByaWdodHM6IChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnJpZ2h0cyA6IG51bGwgfSk7XG4gICAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgICAgc2VydmVyLmdldEZpbmRlckNhY2hlKCkucmVuYW1lRmlsZShub3JtYWxpemUoc3JjUGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnLycpKSwgbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcvJykpLCAob2xkT2JqZWN0KSA/IG9sZE9iamVjdC5zaXplIDogMCk7XG5cbiAgICAgICAgaWYgKG9sZE9iamVjdCkge1xuICAgICAgICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuICAgICAgICAgIGxldCBmb3VuZCA9IGdldFRleHRFZGl0b3Iob2xkT2JqZWN0LmdldExvY2FsUGF0aCh0cnVlKSArIG9sZE9iamVjdC5uYW1lKTtcbiAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIGZvdW5kLnNhdmVPYmplY3QgPSBlbGVtZW50O1xuICAgICAgICAgICAgZm91bmQuc2F2ZUFzKGVsZW1lbnQuZ2V0TG9jYWxQYXRoKHRydWUpICsgZWxlbWVudC5uYW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNb3ZlIGxvY2FsIGZpbGVcbiAgICAgICAgICBtb3ZlTG9jYWxQYXRoKG9sZE9iamVjdC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBvbGRPYmplY3QubmFtZSwgZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlbGVtZW50Lm5hbWUpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIG9sZCBvYmplY3RcbiAgICAgICAgICBvbGRPYmplY3QucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBtb3ZlRGlyZWN0b3J5KHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGluaXRpYWxQYXRoID0gdHJhaWxpbmdzbGFzaGl0KHNyY1BhdGgpO1xuICAgIGRlc3RQYXRoID0gdHJhaWxpbmdzbGFzaGl0KGRlc3RQYXRoKTtcblxuICAgIGlmIChub3JtYWxpemUoc3JjUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RQYXRoKSkgcmV0dXJuO1xuXG4gICAgc2VydmVyLmdldENvbm5lY3RvcigpLmV4aXN0c0RpcmVjdG9yeShkZXN0UGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdEaXJlY3RvcnkgYWxyZWFkeSBleGlzdHMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhpcyBkaXJlY3Rvcnk/JyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBvdmVyd3JpdGU6XFxuXCIgKyBkZXN0UGF0aC50cmltKCksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5kZWxldGVEaXJlY3RvcnkoZGVzdFBhdGgsIHJlY3Vyc2l2ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHRydWUpO1xuICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5yZW5hbWUoc3JjUGF0aCwgZGVzdFBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBnZXQgaW5mbyBmcm9tIG9sZCBvYmplY3RcbiAgICAgICAgbGV0IG9sZE9iamVjdCA9IHNlbGYudHJlZVZpZXcuZmluZEVsZW1lbnRCeVBhdGgoc2VydmVyLCB0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnJykpKTtcbiAgICAgICAgY29uc3QgY2FjaGVQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmdldFJvb3QoKS5jb25maWcucmVtb3RlLCAnLycpKTtcblxuICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRGlyZWN0b3J5KHNlcnZlci5nZXRSb290KCksIGNhY2hlUGF0aCwgeyBzaXplOiAob2xkT2JqZWN0KSA/IG9sZE9iamVjdC5zaXplIDogbnVsbCwgcmlnaHRzOiAob2xkT2JqZWN0KSA/IG9sZE9iamVjdC5yaWdodHMgOiBudWxsIH0pO1xuICAgICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICAgIGVsZW1lbnQuc2VsZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgIHNlcnZlci5nZXRGaW5kZXJDYWNoZSgpLnJlbmFtZURpcmVjdG9yeShub3JtYWxpemUoc3JjUGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnLycpKSwgbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcvJykpKTtcblxuICAgICAgICBpZiAob2xkT2JqZWN0KSB7XG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuXG4gICAgICAgICAgLy8gTW92ZSBsb2NhbCBmaWxlXG4gICAgICAgICAgbW92ZUxvY2FsUGF0aChvbGRPYmplY3QuZ2V0TG9jYWxQYXRoKHRydWUpLCBlbGVtZW50LmdldExvY2FsUGF0aCh0cnVlKSk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgb2xkIG9iamVjdFxuICAgICAgICAgIGlmIChvbGRPYmplY3QpIG9sZE9iamVjdC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvcHlGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgsIHBhcmFtID0ge30pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IHNyY0xvY2FsUGF0aCA9IG5vcm1hbGl6ZShzZXJ2ZXIuZ2V0TG9jYWxQYXRoKGZhbHNlKSArIHNyY1BhdGgsIFBhdGguc2VwKTtcbiAgICBjb25zdCBkZXN0TG9jYWxQYXRoID0gbm9ybWFsaXplKHNlcnZlci5nZXRMb2NhbFBhdGgoZmFsc2UpICsgZGVzdFBhdGgsIFBhdGguc2VwKTtcblxuICAgIC8vIFJlbmFtZSBmaWxlIGlmIGV4aXN0c1xuICAgIGlmIChzcmNQYXRoID09IGRlc3RQYXRoKSB7XG4gICAgICBsZXQgb3JpZ2luYWxQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoKTtcbiAgICAgIGxldCBwYXJlbnRQYXRoID0gbm9ybWFsaXplKGRpcm5hbWUoZGVzdFBhdGgpKTtcblxuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmxpc3REaXJlY3RvcnkocGFyZW50UGF0aCkudGhlbigobGlzdCkgPT4ge1xuICAgICAgICBsZXQgZmlsZXMgPSBbXTtcbiAgICAgICAgbGV0IGZpbGVMaXN0ID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICByZXR1cm4gaXRlbS50eXBlID09PSAnLSc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGVMaXN0LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBmaWxlcy5wdXNoKGVsZW1lbnQubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmaWxlUGF0aDtcbiAgICAgICAgbGV0IGZpbGVDb3VudGVyID0gMDtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gZ2V0RnVsbEV4dGVuc2lvbihvcmlnaW5hbFBhdGgpO1xuXG4gICAgICAgIC8vIGFwcGVuZCBhIG51bWJlciB0byB0aGUgZmlsZSBpZiBhbiBpdGVtIHdpdGggdGhlIHNhbWUgbmFtZSBleGlzdHNcbiAgICAgICAgd2hpbGUgKGZpbGVzLmluY2x1ZGVzKGJhc2VuYW1lKGRlc3RQYXRoKSkpIHtcbiAgICAgICAgICBmaWxlUGF0aCA9IFBhdGguZGlybmFtZShvcmlnaW5hbFBhdGgpICsgJy8nICsgUGF0aC5iYXNlbmFtZShvcmlnaW5hbFBhdGgsIGV4dGVuc2lvbik7XG4gICAgICAgICAgZGVzdFBhdGggPSBmaWxlUGF0aCArIGZpbGVDb3VudGVyICsgZXh0ZW5zaW9uO1xuICAgICAgICAgIGZpbGVDb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmNvcHlGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5leGlzdHNGaWxlKGRlc3RQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0ZpbGUgYWxyZWFkeSBleGlzdHMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhpcyBmaWxlPycsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIllvdSBhcmUgb3ZlcndyaXRlOlxcblwiICsgZGVzdFBhdGgudHJpbSgpLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIFllczogKCkgPT4ge1xuICAgICAgICAgICAgICBmaWxlZXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVqZWN0KHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8gQ3JlYXRlIGxvY2FsIERpcmVjdG9yaWVzXG4gICAgICBjcmVhdGVMb2NhbFBhdGgoc3JjTG9jYWxQYXRoKTtcbiAgICAgIGNyZWF0ZUxvY2FsUGF0aChkZXN0TG9jYWxQYXRoKTtcblxuICAgICAgc2VsZi5kb3dubG9hZEZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0TG9jYWxQYXRoLCBwYXJhbSkudGhlbigoKSA9PiB7XG4gICAgICAgIHNlbGYudXBsb2FkRmlsZShzZXJ2ZXIsIGRlc3RMb2NhbFBhdGgsIGRlc3RQYXRoKS50aGVuKChkdXBsaWNhdGVkRmlsZSkgPT4ge1xuICAgICAgICAgIGlmIChkdXBsaWNhdGVkRmlsZSkge1xuICAgICAgICAgICAgLy8gT3BlbiBmaWxlIGFuZCBhZGQgaGFuZGxlciB0byBlZGl0b3IgdG8gdXBsb2FkIGZpbGUgb24gc2F2ZVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub3BlbkZpbGVJbkVkaXRvcihkdXBsaWNhdGVkRmlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvcHlEaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKG5vcm1hbGl6ZShzcmNQYXRoKSA9PSBub3JtYWxpemUoZGVzdFBhdGgpKSByZXR1cm47XG5cbiAgICAvLyBUT0RPXG4gICAgY29uc29sZS5sb2coJ1RPRE8gY29weScsIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgfVxuXG4gIHVwbG9hZEZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCwgY2hlY2tGaWxlRXhpc3RzID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGNoZWNrRmlsZUV4aXN0cykge1xuICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRmlsZShkZXN0UGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FjaGVQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmdldFJvb3QoKS5jb25maWcucmVtb3RlLCAnLycpKTtcblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGZpbGU/JyxcbiAgICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIllvdSBhcmUgb3ZlcndyaXRlOlxcblwiICsgY2FjaGVQYXRoLFxuICAgICAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZGVsZXRlRmlsZShkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbGVzdGF0ID0gRmlsZVN5c3RlbS5zdGF0U3luYyhzcmNQYXRoKTtcblxuICAgICAgICAgIGxldCBwYXRoT25GaWxlU3lzdGVtID0gbm9ybWFsaXplKHRyYWlsaW5nc2xhc2hpdChzcmNQYXRoKSwgUGF0aC5zZXApO1xuICAgICAgICAgIGxldCBmb3VuZEluVHJlZVZpZXcgPSBzZWxmLnRyZWVWaWV3LmZpbmRFbGVtZW50QnlMb2NhbFBhdGgocGF0aE9uRmlsZVN5c3RlbSk7XG4gICAgICAgICAgaWYgKGZvdW5kSW5UcmVlVmlldykge1xuICAgICAgICAgICAgLy8gQWRkIHN5bmMgaWNvblxuICAgICAgICAgICAgZm91bmRJblRyZWVWaWV3LmFkZFN5bmNJY29uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWRkIHRvIFVwbG9hZCBRdWV1ZVxuICAgICAgICAgIGxldCBxdWV1ZUl0ZW0gPSBRdWV1ZS5hZGRGaWxlKHtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogXCJ1cGxvYWRcIixcbiAgICAgICAgICAgIHJlbW90ZVBhdGg6IGRlc3RQYXRoLFxuICAgICAgICAgICAgbG9jYWxQYXRoOiBzcmNQYXRoLFxuICAgICAgICAgICAgc2l6ZTogZmlsZXN0YXQuc2l6ZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHNlcnZlci5nZXRDb25uZWN0b3IoKS51cGxvYWRGaWxlKHF1ZXVlSXRlbSwgMSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZVBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuZ2V0Um9vdCgpLmNvbmZpZy5yZW1vdGUsICcvJykpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLnRyZWVWaWV3LmFkZEZpbGUoc2VydmVyLmdldFJvb3QoKSwgY2FjaGVQYXRoLCB7IHNpemU6IGZpbGVzdGF0LnNpemUgfSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgICAgICBzZXJ2ZXIuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuZGVsZXRlRmlsZShub3JtYWxpemUoY2FjaGVQYXRoKSk7XG4gICAgICAgICAgICBzZXJ2ZXIuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuYWRkRmlsZShub3JtYWxpemUoY2FjaGVQYXRoKSwgZmlsZXN0YXQuc2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcucmVtb3ZlU3luY0ljb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuXG4gICAgICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSBzeW5jIGljb25cbiAgICAgICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBmaWxlc3RhdCA9IEZpbGVTeXN0ZW0uc3RhdFN5bmMoc3JjUGF0aCk7XG5cbiAgICAgICAgbGV0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUodHJhaWxpbmdzbGFzaGl0KHNyY1BhdGgpLCBQYXRoLnNlcCk7XG4gICAgICAgIGxldCBmb3VuZEluVHJlZVZpZXcgPSBzZWxmLnRyZWVWaWV3LmZpbmRFbGVtZW50QnlMb2NhbFBhdGgocGF0aE9uRmlsZVN5c3RlbSk7XG4gICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAvLyBBZGQgc3luYyBpY29uXG4gICAgICAgICAgZm91bmRJblRyZWVWaWV3LmFkZFN5bmNJY29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdG8gVXBsb2FkIFF1ZXVlXG4gICAgICAgIGxldCBxdWV1ZUl0ZW0gPSBRdWV1ZS5hZGRGaWxlKHtcbiAgICAgICAgICBkaXJlY3Rpb246IFwidXBsb2FkXCIsXG4gICAgICAgICAgcmVtb3RlUGF0aDogZGVzdFBhdGgsXG4gICAgICAgICAgbG9jYWxQYXRoOiBzcmNQYXRoLFxuICAgICAgICAgIHNpemU6IGZpbGVzdGF0LnNpemVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlci5nZXRDb25uZWN0b3IoKS51cGxvYWRGaWxlKHF1ZXVlSXRlbSwgMSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FjaGVQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmdldFJvb3QoKS5jb25maWcucmVtb3RlLCAnLycpKTtcblxuICAgICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLnRyZWVWaWV3LmFkZEZpbGUoc2VydmVyLmdldFJvb3QoKSwgY2FjaGVQYXRoLCB7IHNpemU6IGZpbGVzdGF0LnNpemUgfSk7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2VsZWN0KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgICAgIHNlcnZlci5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5kZWxldGVGaWxlKG5vcm1hbGl6ZShjYWNoZVBhdGgpKTtcbiAgICAgICAgICBzZXJ2ZXIuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuYWRkRmlsZShub3JtYWxpemUoY2FjaGVQYXRoKSwgZmlsZXN0YXQuc2l6ZSk7XG5cbiAgICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgc3luYyBpY29uXG4gICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcucmVtb3ZlU3luY0ljb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcblxuICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzeW5jIGljb25cbiAgICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gIH1cblxuICB1cGxvYWREaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIEZpbGVTeXN0ZW0ubGlzdFRyZWVTeW5jKHNyY1BhdGgpLmZpbHRlcigocGF0aCkgPT4gRmlsZVN5c3RlbS5pc0ZpbGVTeW5jKHBhdGgpKS5yZWR1Y2UoKHByZXZQcm9taXNlLCBwYXRoKSA9PiB7XG4gICAgICAgIHJldHVybiBwcmV2UHJvbWlzZS50aGVuKCgpID0+IHNlbGYudXBsb2FkRmlsZShzZXJ2ZXIsIHBhdGgsIG5vcm1hbGl6ZShkZXN0UGF0aCArICcvJyArIHBhdGgucmVwbGFjZShzcmNQYXRoLCAnLycpLCAnLycpKSk7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiByZXNvbHZlKCkpLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgfSk7XG4gIH1cblxuICBkb3dubG9hZEZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCwgcGFyYW0gPSB7fSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBDaGVjayBpZiBmaWxlIGlzIGFscmVhZHkgaW4gUXVldWVcbiAgICAgIGlmIChRdWV1ZS5leGlzdHNGaWxlKGRlc3RQYXRoKSkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUodHJhaWxpbmdzbGFzaGl0KHNlcnZlci5nZXRMb2NhbFBhdGgoZmFsc2UpICsgc3JjUGF0aCksIFBhdGguc2VwKTtcbiAgICAgIGxldCBmb3VuZEluVHJlZVZpZXcgPSBzZWxmLnRyZWVWaWV3LmZpbmRFbGVtZW50QnlMb2NhbFBhdGgocGF0aE9uRmlsZVN5c3RlbSk7XG4gICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgIC8vIEFkZCBzeW5jIGljb25cbiAgICAgICAgZm91bmRJblRyZWVWaWV3LmFkZFN5bmNJY29uKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBsb2NhbCBEaXJlY3Rvcmllc1xuICAgICAgY3JlYXRlTG9jYWxQYXRoKGRlc3RQYXRoKTtcblxuICAgICAgLy8gQWRkIHRvIERvd25sb2FkIFF1ZXVlXG4gICAgICBsZXQgcXVldWVJdGVtID0gUXVldWUuYWRkRmlsZSh7XG4gICAgICAgIGRpcmVjdGlvbjogXCJkb3dubG9hZFwiLFxuICAgICAgICByZW1vdGVQYXRoOiBzcmNQYXRoLFxuICAgICAgICBsb2NhbFBhdGg6IGRlc3RQYXRoLFxuICAgICAgICBzaXplOiAocGFyYW0uZmlsZXNpemUpID8gcGFyYW0uZmlsZXNpemUgOiAwXG4gICAgICB9KTtcblxuICAgICAgLy8gRG93bmxvYWQgZmlsZVxuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRvd25sb2FkRmlsZShxdWV1ZUl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcblxuICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZG93bmxvYWREaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3Qgc2NhbkRpciA9IChwYXRoKSA9PiB7XG4gICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLmxpc3REaXJlY3RvcnkocGF0aCkudGhlbihsaXN0ID0+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4gKGl0ZW0udHlwZSA9PT0gJy0nKSkubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgaXRlbS5wYXRoID0gbm9ybWFsaXplKHBhdGggKyAnLycgKyBpdGVtLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlycyA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiAoaXRlbS50eXBlID09PSAnZCcgJiYgaXRlbS5uYW1lICE9PSAnLicgJiYgaXRlbS5uYW1lICE9PSAnLi4nKSkubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgaXRlbS5wYXRoID0gbm9ybWFsaXplKHBhdGggKyAnLycgKyBpdGVtLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGlycy5yZWR1Y2UoKHByZXZQcm9taXNlLCBkaXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJldlByb21pc2UudGhlbihvdXRwdXQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNjYW5EaXIobm9ybWFsaXplKGRpci5wYXRoKSkudGhlbihmaWxlcyA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBvdXRwdXQuY29uY2F0KGZpbGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoZmlsZXMpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbkRpcihzcmNQYXRoKS50aGVuKChmaWxlcykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZGVzdFBhdGgpKSB7XG4gICAgICAgICAgRmlsZVN5c3RlbS5ta2RpclN5bmMoZGVzdFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmaWxlcy5yZWR1Y2UoKHByZXZQcm9taXNlLCBmaWxlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByZXZQcm9taXNlLnRoZW4oKCkgPT4gc2VsZi5kb3dubG9hZEZpbGUoc2VydmVyLCBmaWxlLnBhdGgsIG5vcm1hbGl6ZShkZXN0UGF0aCArIFBhdGguc2VwICsgZmlsZS5wYXRoLnJlcGxhY2Uoc3JjUGF0aCwgJy8nKSwgUGF0aC5zZXApLCB7IGZpbGVzaXplOiBmaWxlLnNpemUgfSkpO1xuICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiByZXNvbHZlKCkpLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kUmVtb3RlUGF0aCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBGaW5kRGlhbG9nKCcvJywgZmFsc2UpO1xuICAgIGRpYWxvZy5vbignZmluZC1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICByZWxhdGl2ZVBhdGggPSBub3JtYWxpemUocmVsYXRpdmVQYXRoKTtcblxuICAgICAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGluaXRpYWwgcGF0aCBpZiBleGlzdHNcbiAgICAgICAgaWYgKHJvb3QuY29uZmlnLnJlbW90ZSkge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGguc3RhcnRzV2l0aChyb290LmNvbmZpZy5yZW1vdGUpKSB7XG4gICAgICAgICAgICByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZVBhdGgucmVwbGFjZShyb290LmNvbmZpZy5yZW1vdGUsIFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudHJlZVZpZXcuZXhwYW5kKHJvb3QsIHJlbGF0aXZlUGF0aCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgfVxuXG4gIGNvcHlSZW1vdGVQYXRoKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGVsZW1lbnQuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgcGF0aFRvQ29weSA9IGVsZW1lbnQuZ2V0UGF0aCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aFRvQ29weSA9IGVsZW1lbnQuZ2V0UGF0aCh0cnVlKSArIGVsZW1lbnQubmFtZTtcbiAgICB9XG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUocGF0aFRvQ29weSlcbiAgfVxuXG4gIHJlbW90ZVBhdGhGaW5kZXIocmVpbmRleCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgbGV0IGl0ZW1zQ2FjaGUgPSByb290LmdldEZpbmRlckNhY2hlKCk7XG5cbiAgICBpZiAoc2VsZi5maW5kZXJWaWV3ID09IG51bGwpIHtcbiAgICAgIHNlbGYuZmluZGVyVmlldyA9IG5ldyBGaW5kZXJWaWV3KHNlbGYudHJlZVZpZXcpO1xuXG4gICAgICBzZWxmLmZpbmRlclZpZXcub24oJ2Z0cC1yZW1vdGUtZWRpdC1maW5kZXI6b3BlbicsIChpdGVtKSA9PiB7XG4gICAgICAgIGxldCByZWxhdGl2ZVBhdGggPSBpdGVtLnJlbGF0aXZlUGF0aDtcbiAgICAgICAgbGV0IGxvY2FsUGF0aCA9IG5vcm1hbGl6ZShzZWxmLmZpbmRlclZpZXcucm9vdC5nZXRMb2NhbFBhdGgoKSArIHJlbGF0aXZlUGF0aCwgUGF0aC5zZXApO1xuICAgICAgICBsZXQgZmlsZSA9IHNlbGYudHJlZVZpZXcuZ2V0RWxlbWVudEJ5TG9jYWxQYXRoKGxvY2FsUGF0aCwgc2VsZi5maW5kZXJWaWV3LnJvb3QsICdmaWxlJyk7XG4gICAgICAgIGZpbGUuc2l6ZSA9IGl0ZW0uc2l6ZTtcblxuICAgICAgICBpZiAoZmlsZSkgc2VsZi5vcGVuRmlsZShmaWxlKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLmZpbmRlclZpZXcub24oJ2Z0cC1yZW1vdGUtZWRpdC1maW5kZXI6aGlkZScsICgpID0+IHtcbiAgICAgICAgaXRlbXNDYWNoZS5sb2FkVGFzayA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHNlbGYuZmluZGVyVmlldy5yb290ID0gcm9vdDtcbiAgICBzZWxmLmZpbmRlclZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHsgaXRlbXM6IGl0ZW1zQ2FjaGUuaXRlbXMgfSlcblxuICAgIGNvbnN0IGluZGV4ID0gKGl0ZW1zKSA9PiB7XG4gICAgICBzZWxmLmZpbmRlclZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHsgaXRlbXM6IGl0ZW1zLCBlcnJvck1lc3NhZ2U6ICcnLCBsb2FkaW5nTWVzc2FnZTogJ0luZGV4aW5nXFx1MjAyNicgKyBpdGVtcy5sZW5ndGggfSlcbiAgICB9O1xuICAgIGl0ZW1zQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTppbmRleCcsIGluZGV4KTtcbiAgICBpdGVtc0NhY2hlLm9uKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6aW5kZXgnLCBpbmRleCk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoaXRlbXMpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXMsIGVycm9yTWVzc2FnZTogJycsIGxvYWRpbmdNZXNzYWdlOiAnJyB9KVxuICAgIH07XG4gICAgaXRlbXNDYWNoZS5yZW1vdmVMaXN0ZW5lcignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHVwZGF0ZSk7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHVwZGF0ZSk7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoaXRlbXMpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXMsIGVycm9yTWVzc2FnZTogJycsIGxvYWRpbmdNZXNzYWdlOiAnJyB9KVxuICAgIH07XG4gICAgaXRlbXNDYWNoZS5yZW1vdmVMaXN0ZW5lcignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmZpbmlzaCcsIGZpbmlzaCk7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmZpbmlzaCcsIGZpbmlzaCk7XG5cbiAgICBjb25zdCBlcnJvciA9IChlcnIpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBlcnJvck1lc3NhZ2U6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlIH0pXG4gICAgfTtcbiAgICBpdGVtc0NhY2hlLnJlbW92ZUxpc3RlbmVyKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZXJyb3InLCBlcnJvcik7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmVycm9yJywgZXJyb3IpO1xuXG4gICAgaXRlbXNDYWNoZS5sb2FkKHJlaW5kZXgpO1xuICAgIHNlbGYuZmluZGVyVmlldy50b2dnbGUoKTtcbiAgfVxuXG4gIGF1dG9SZXZlYWxBY3RpdmVGaWxlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuYXV0b1JldmVhbEFjdGl2ZUZpbGUnKSkge1xuICAgICAgaWYgKHNlbGYudHJlZVZpZXcuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgICAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgICAgICBsZXQgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZSh0cmFpbGluZ3NsYXNoaXQoZWRpdG9yLmdldFBhdGgoKSksIFBhdGguc2VwKTtcblxuICAgICAgICAgIGxldCBlbnRyeSA9IHNlbGYudHJlZVZpZXcuZmluZEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtKTtcbiAgICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgIGVudHJ5LnNlbGVjdCgpO1xuICAgICAgICAgICAgc2VsZi50cmVlVmlldy5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb25Nb3ZlUGFnZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWxlSW5FZGl0b3IoZmlsZSwgcGVuZGluZykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4obm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCksIHsgcGVuZGluZzogcGVuZGluZywgc2VhcmNoQWxsUGFuZXM6IHRydWUgfSkudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3Iuc2F2ZU9iamVjdCA9IGZpbGU7XG4gICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBTYXZlIGZpbGUgb24gcmVtb3RlIHNlcnZlclxuICAgICAgICBlZGl0b3Iub25EaWRTYXZlKChzYXZlT2JqZWN0KSA9PiB7XG4gICAgICAgICAgaWYgKCFlZGl0b3Iuc2F2ZU9iamVjdCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gR2V0IGZpbGVzaXplXG4gICAgICAgICAgY29uc3QgZmlsZXN0YXQgPSBGaWxlU3lzdGVtLnN0YXRTeW5jKGVkaXRvci5nZXRQYXRoKHRydWUpKTtcbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5zaXplID0gZmlsZXN0YXQuc2l6ZTtcbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5hdHRyKCdkYXRhLXNpemUnLCBmaWxlc3RhdC5zaXplKTtcblxuICAgICAgICAgIGNvbnN0IHNyY1BhdGggPSBlZGl0b3Iuc2F2ZU9iamVjdC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlZGl0b3Iuc2F2ZU9iamVjdC5uYW1lO1xuICAgICAgICAgIGNvbnN0IGRlc3RQYXRoID0gZWRpdG9yLnNhdmVPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGVkaXRvci5zYXZlT2JqZWN0Lm5hbWU7XG4gICAgICAgICAgc2VsZi51cGxvYWRGaWxlKGVkaXRvci5zYXZlT2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgsIGZhbHNlKS50aGVuKChkdXBsaWNhdGVkRmlsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZWRGaWxlKSB7XG4gICAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5ub3RpZmljYXRpb25zLnNob3dOb3RpZmljYXRpb25PblVwbG9hZCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICBpZiAoIWVkaXRvci5zYXZlT2JqZWN0KSByZXR1cm47XG5cbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBGdHBSZW1vdGVFZGl0KCk7XG4iXX0=