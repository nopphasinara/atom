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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9mdHAtcmVtb3RlLWVkaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQ0FFOEIsNEJBQTRCOzs7O29DQUM5QiwwQkFBMEI7Ozs7NkJBQ2pDLG1CQUFtQjs7OztpQ0FDZix1QkFBdUI7Ozs7K0JBQ3pCLHFCQUFxQjs7Ozt5Q0FFZixpQ0FBaUM7Ozs7eUNBQ2pDLGlDQUFpQzs7OztrQ0FDeEMseUJBQXlCOzs7O3FDQUN0Qiw0QkFBNEI7Ozs7bUNBQzlCLDBCQUEwQjs7OztzQ0FDckIsNEJBQTRCOzs7O29CQUVJLE1BQU07OzhCQUM4RixvQkFBb0I7OzhCQUNqRSxvQkFBb0I7OzhCQUNNLG9CQUFvQjs7QUFsQmpLLFdBQVcsQ0FBQzs7QUFvQlosSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdEQsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRTdELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDM0MsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRS9DLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztJQUVqRCxhQUFhO0FBRU4sV0FGUCxhQUFh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Q0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzFFLGdCQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxjQUFjLEVBQUs7QUFDOUYsa0JBQUksY0FBYyxFQUFFO0FBQ2xCLG9CQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLEVBQUU7QUFDN0UsbURBQVksNkJBQTZCLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ3ZEO2VBQ0Y7YUFDRixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7O0FBRUgsZ0JBQU0sQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUN4QixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTzs7QUFFL0Isa0JBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQ3ZDLENBQUMsQ0FBQztTQUNKLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRztPQUNsQixDQUFDLFNBQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoQix5Q0FBWSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ25DLENBQUMsQ0FBQztLQUNKOzs7U0F6MERHLGFBQWE7OztxQkE0MERKLElBQUksYUFBYSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9mdHAtcmVtb3RlLWVkaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IENvbmZpZ3VyYXRpb25WaWV3IGZyb20gJy4vdmlld3MvY29uZmlndXJhdGlvbi12aWV3JztcbmltcG9ydCBQZXJtaXNzaW9uc1ZpZXcgZnJvbSAnLi92aWV3cy9wZXJtaXNzaW9ucy12aWV3JztcbmltcG9ydCBUcmVlVmlldyBmcm9tICcuL3ZpZXdzL3RyZWUtdmlldyc7XG5pbXBvcnQgUHJvdG9jb2xWaWV3IGZyb20gJy4vdmlld3MvcHJvdG9jb2wtdmlldyc7XG5pbXBvcnQgRmluZGVyVmlldyBmcm9tICcuL3ZpZXdzL2ZpbmRlci12aWV3JztcblxuaW1wb3J0IENoYW5nZVBhc3NEaWFsb2cgZnJvbSAnLi9kaWFsb2dzL2NoYW5nZS1wYXNzLWRpYWxvZy5qcyc7XG5pbXBvcnQgUHJvbXB0UGFzc0RpYWxvZyBmcm9tICcuL2RpYWxvZ3MvcHJvbXB0LXBhc3MtZGlhbG9nLmpzJztcbmltcG9ydCBBZGREaWFsb2cgZnJvbSAnLi9kaWFsb2dzL2FkZC1kaWFsb2cuanMnO1xuaW1wb3J0IFJlbmFtZURpYWxvZyBmcm9tICcuL2RpYWxvZ3MvcmVuYW1lLWRpYWxvZy5qcyc7XG5pbXBvcnQgRmluZERpYWxvZyBmcm9tICcuL2RpYWxvZ3MvZmluZC1kaWFsb2cuanMnO1xuaW1wb3J0IER1cGxpY2F0ZURpYWxvZyBmcm9tICcuL2RpYWxvZ3MvZHVwbGljYXRlLWRpYWxvZyc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IGRlY3J5cHQsIGVuY3J5cHQsIGNoZWNrUGFzc3dvcmRFeGlzdHMsIGNoZWNrUGFzc3dvcmQsIHNldFBhc3N3b3JkLCBjaGFuZ2VQYXNzd29yZCwgaXNJbldoaXRlTGlzdCwgaXNJbkJsYWNrTGlzdCwgYWRkVG9XaGl0ZUxpc3QsIGFkZFRvQmxhY2tMaXN0IH0gZnJvbSAnLi9oZWxwZXIvc2VjdXJlLmpzJztcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCB0cmFpbGluZ3NsYXNoaXQsIHVudHJhaWxpbmdzbGFzaGl0LCBsZWFkaW5nc2xhc2hpdCwgdW5sZWFkaW5nc2xhc2hpdCwgbm9ybWFsaXplIH0gZnJvbSAnLi9oZWxwZXIvZm9ybWF0LmpzJztcbmltcG9ydCB7IGxvZ0RlYnVnLCBzaG93TWVzc2FnZSwgZ2V0RnVsbEV4dGVuc2lvbiwgY3JlYXRlTG9jYWxQYXRoLCBkZWxldGVMb2NhbFBhdGgsIG1vdmVMb2NhbFBhdGgsIGdldFRleHRFZGl0b3IsIHBlcm1pc3Npb25zVG9SaWdodHMgfSBmcm9tICcuL2hlbHBlci9oZWxwZXIuanMnO1xuXG5jb25zdCBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9jb25maWctc2NoZW1hLmpzb24nKTtcbmNvbnN0IHNlcnZlcl9jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy9zZXJ2ZXItc2NoZW1hLmpzb24nKTtcblxuY29uc3QgYXRvbSA9IGdsb2JhbC5hdG9tO1xuY29uc3QgRWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IEZpbGVTeXN0ZW0gPSByZXF1aXJlKCdmcy1wbHVzJyk7XG5jb25zdCBnZXRJY29uU2VydmljZXMgPSByZXF1aXJlKCcuL2hlbHBlci9pY29uLmpzJyk7XG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoJy4vaGVscGVyL3F1ZXVlLmpzJyk7XG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi9oZWxwZXIvc3RvcmFnZS5qcycpO1xuXG5yZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDA7XG5cbmNsYXNzIEZ0cFJlbW90ZUVkaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbmZvID0gW107XG4gICAgc2VsZi5jb25maWcgPSBjb25maWc7XG4gICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbnVsbDtcblxuICAgIHNlbGYudHJlZVZpZXcgPSBudWxsO1xuICAgIHNlbGYucHJvdG9jb2xWaWV3ID0gbnVsbDtcbiAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3ID0gbnVsbDtcbiAgICBzZWxmLmZpbmRlclZpZXcgPSBudWxsO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnRyZWVWaWV3ID0gbmV3IFRyZWVWaWV3KCk7XG4gICAgc2VsZi5wcm90b2NvbFZpZXcgPSBuZXcgUHJvdG9jb2xWaWV3KCk7XG5cbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dG9nZ2xlJzogKCkgPT4gc2VsZi50b2dnbGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dG9nZ2xlLWZvY3VzJzogKCkgPT4gc2VsZi50b2dnbGVGb2N1cygpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpzaG93JzogKCkgPT4gc2VsZi5zaG93KCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmhpZGUnOiAoKSA9PiBzZWxmLmhpZGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dW5mb2N1cyc6ICgpID0+IHNlbGYudHJlZVZpZXcudW5mb2N1cygpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDplZGl0LXNlcnZlcnMnOiAoKSA9PiBzZWxmLmNvbmZpZ3VyYXRpb24oKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y2hhbmdlLXBhc3N3b3JkJzogKCkgPT4gc2VsZi5jaGFuZ2VQYXNzd29yZCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpvcGVuLWZpbGUnOiAoKSA9PiBzZWxmLm9wZW4oKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6b3Blbi1maWxlLXBlbmRpbmcnOiAoKSA9PiBzZWxmLm9wZW4odHJ1ZSksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0Om5ldy1maWxlJzogKCkgPT4gc2VsZi5jcmVhdGUoJ2ZpbGUnKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6bmV3LWRpcmVjdG9yeSc6ICgpID0+IHNlbGYuY3JlYXRlKCdkaXJlY3RvcnknKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZHVwbGljYXRlJzogKCkgPT4gc2VsZi5kdXBsaWNhdGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZGVsZXRlJzogKCkgPT4gc2VsZi5kZWxldGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6cmVuYW1lJzogKCkgPT4gc2VsZi5yZW5hbWUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y29weSc6ICgpID0+IHNlbGYuY29weSgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpjdXQnOiAoKSA9PiBzZWxmLmN1dCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpwYXN0ZSc6ICgpID0+IHNlbGYucGFzdGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y2htb2QnOiAoKSA9PiBzZWxmLmNobW9kKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnVwbG9hZC1maWxlJzogKCkgPT4gc2VsZi51cGxvYWQoJ2ZpbGUnKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dXBsb2FkLWRpcmVjdG9yeSc6ICgpID0+IHNlbGYudXBsb2FkKCdkaXJlY3RvcnknKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZG93bmxvYWQnOiAoKSA9PiBzZWxmLmRvd25sb2FkKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnJlbG9hZCc6ICgpID0+IHNlbGYucmVsb2FkKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmZpbmQtcmVtb3RlLXBhdGgnOiAoKSA9PiBzZWxmLmZpbmRSZW1vdGVQYXRoKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmNvcHktcmVtb3RlLXBhdGgnOiAoKSA9PiBzZWxmLmNvcHlSZW1vdGVQYXRoKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmZpbmRlcic6ICgpID0+IHNlbGYucmVtb3RlUGF0aEZpbmRlcigpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpmaW5kZXItcmVpbmRleC1jYWNoZSc6ICgpID0+IHNlbGYucmVtb3RlUGF0aEZpbmRlcih0cnVlKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6YWRkLXRlbXAtc2VydmVyJzogKCkgPT4gc2VsZi5hZGRUZW1wU2VydmVyKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnJlbW92ZS10ZW1wLXNlcnZlcic6ICgpID0+IHNlbGYucmVtb3ZlVGVtcFNlcnZlcigpLFxuICAgIH0pKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdmdHAtcmVtb3RlLWVkaXQuY29uZmlnJywgKCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSkge1xuICAgICAgICBTdG9yYWdlLmxvYWQodHJ1ZSk7XG4gICAgICAgIHNlbGYudHJlZVZpZXcucmVsb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEcmFnICYgRHJvcFxuICAgIHNlbGYudHJlZVZpZXcub24oJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgc2VsZi5kcm9wKGUpO1xuICAgIH0pO1xuXG4gICAgLy8gQXV0byBSZXZlYWwgQWN0aXZlIEZpbGVcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG4gICAgICBzZWxmLmF1dG9SZXZlYWxBY3RpdmVGaWxlKCk7XG4gICAgfSk7XG5cbiAgICAvLyB3b3JrYXJvdW5kIHRvIGFjdGl2YXRlIGNvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zIGlmIGZ0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcyBpcyBhY3RpdmF0ZWRcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJywgKHsgbmV3VmFsdWUsIG9sZFZhbHVlIH0pID0+IHtcbiAgICAgIGlmIChuZXdWYWx1ZSA9PSB0cnVlICYmICFhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycsIHRydWUpXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnLCB0cnVlKVxuICAgIH1cblxuICAgIC8vIFRvZ2dsZSBvbiBzdGFydHVwXG4gICAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSgoYWN0aXZhdGVQYWNrYWdlKSA9PiB7XG4gICAgICBpZiAoYWN0aXZhdGVQYWNrYWdlLm5hbWUgPT0gJ2Z0cC1yZW1vdGUtZWRpdCcpIHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUudG9nZ2xlT25TdGFydHVwJykpIHtcbiAgICAgICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuc3Vic2NyaXB0aW9ucykge1xuICAgICAgc2VsZi5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYudHJlZVZpZXcpIHtcbiAgICAgIHNlbGYudHJlZVZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGlmIChzZWxmLnByb3RvY29sVmlldykge1xuICAgICAgc2VsZi5wcm90b2NvbFZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGlmIChzZWxmLmNvbmZpZ3VyYXRpb25WaWV3KSB7XG4gICAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5maW5kZXJWaWV3KSB7XG4gICAgICBmaW5kZXJWaWV3LmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgaGFuZGxlVVJJKHBhcnNlZFVyaSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IHJlZ2V4ID0gLyhcXC8pPyhbYS16MC05X1xcLV17MSw1fTpcXC9cXC8pKChbXjpdezEsfSkoKDooLnsxLH0pKT9bXFxAXFx4NDBdKSk/KFthLXowLTlfXFwtLl0rKSg6KFswLTldKikpPyguKikvZ2k7XG4gICAgbGV0IGlzX21hdGNoZWQgPSBwYXJzZWRVcmkucGF0aC5tYXRjaChyZWdleCk7XG5cbiAgICBpZiAoaXNfbWF0Y2hlZCkge1xuXG4gICAgICBpZiAoIXNlbGYudHJlZVZpZXcuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgIH1cblxuICAgICAgbGV0IG1hdGNoZWQgPSByZWdleC5leGVjKHBhcnNlZFVyaS5wYXRoKTtcblxuICAgICAgbGV0IHByb3RvY29sID0gbWF0Y2hlZFsyXTtcbiAgICAgIGxldCB1c2VybmFtZSA9IChtYXRjaGVkWzRdICE9PSB1bmRlZmluZWQpID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZWRbNF0pIDogJyc7XG4gICAgICBsZXQgcGFzc3dvcmQgPSAobWF0Y2hlZFs3XSAhPT0gdW5kZWZpbmVkKSA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVkWzddKSA6ICcnO1xuICAgICAgbGV0IGhvc3QgPSAobWF0Y2hlZFs4XSAhPT0gdW5kZWZpbmVkKSA/IG1hdGNoZWRbOF0gOiAnJztcbiAgICAgIGxldCBwb3J0ID0gKG1hdGNoZWRbMTBdICE9PSB1bmRlZmluZWQpID8gbWF0Y2hlZFsxMF0gOiAnJztcbiAgICAgIGxldCBwYXRoID0gKG1hdGNoZWRbMTFdICE9PSB1bmRlZmluZWQpID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZWRbMTFdKSA6IFwiL1wiO1xuXG4gICAgICBsZXQgbmV3Y29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZXJ2ZXJfY29uZmlnKSk7XG4gICAgICBuZXdjb25maWcubmFtZSA9ICh1c2VybmFtZSkgPyBwcm90b2NvbCArIHVzZXJuYW1lICsgJ0AnICsgaG9zdCA6IHByb3RvY29sICsgaG9zdDtcbiAgICAgIG5ld2NvbmZpZy5ob3N0ID0gaG9zdDtcbiAgICAgIG5ld2NvbmZpZy5wb3J0ID0gKHBvcnQpID8gcG9ydCA6ICgocHJvdG9jb2wgPT0gJ3NmdHA6Ly8nKSA/ICcyMicgOiAnMjEnKTtcbiAgICAgIG5ld2NvbmZpZy51c2VyID0gdXNlcm5hbWU7XG4gICAgICBuZXdjb25maWcucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICAgIG5ld2NvbmZpZy5zZnRwID0gKHByb3RvY29sID09ICdzZnRwOi8vJyk7XG4gICAgICBuZXdjb25maWcucmVtb3RlID0gcGF0aDtcbiAgICAgIG5ld2NvbmZpZy50ZW1wID0gdHJ1ZTtcblxuICAgICAgbG9nRGVidWcoXCJBZGRpbmcgbmV3IHNlcnZlciBieSB1cmkgaGFuZGxlclwiLCBuZXdjb25maWcpO1xuXG4gICAgICBzZWxmLnRyZWVWaWV3LmFkZFNlcnZlcihuZXdjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5SZW1vdGVGaWxlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIChmaWxlKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICBsZXQgbG9jYWxQYXRoID0gbm9ybWFsaXplKHJvb3QuZ2V0TG9jYWxQYXRoKCkpO1xuICAgICAgbG9jYWxQYXRoID0gbm9ybWFsaXplKFBhdGguam9pbihsb2NhbFBhdGguc2xpY2UoMCwgbG9jYWxQYXRoLmxhc3RJbmRleE9mKHJvb3QuZ2V0UGF0aCgpKSksIGZpbGUpLnJlcGxhY2UoL1xcLysvZywgUGF0aC5zZXApLCBQYXRoLnNlcCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlID0gc2VsZi50cmVlVmlldy5nZXRFbGVtZW50QnlMb2NhbFBhdGgobG9jYWxQYXRoLCByb290LCAnZmlsZScpO1xuICAgICAgICBzZWxmLm9wZW5GaWxlKGZpbGUpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgbG9nRGVidWcoZXgpXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRTZXJ2ZXJOYW1lKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZWplY3QoJ25vc2VydmVycycpO1xuXG4gICAgICAgIGxldCByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICAgICAgcmVzb2x2ZShyb290Lm5hbWUpO1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50U2VydmVyQ29uZmlnKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIChyZWFzb25Gb3JSZXF1ZXN0KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoIXJlYXNvbkZvclJlcXVlc3QpIHtcbiAgICAgICAgICByZWplY3QoJ25vcmVhc29uZ2l2ZW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJlamVjdCgnbm9zZXJ2ZXJzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFTdG9yYWdlLmhhc1Bhc3N3b3JkKCkpIHtcbiAgICAgICAgICByZWplY3QoJ25vcGFzc3dvcmQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICAgIGxldCBidXR0b25kaXNtaXNzID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGlzSW5CbGFja0xpc3QoU3RvcmFnZS5nZXRQYXNzd29yZCgpLCByZWFzb25Gb3JSZXF1ZXN0KSkge1xuICAgICAgICAgIHJlamVjdCgndXNlcmRlY2xpbmVkJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0luV2hpdGVMaXN0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgcmVhc29uRm9yUmVxdWVzdCkpIHtcbiAgICAgICAgICByZXNvbHZlKHJvb3QuY29uZmlnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2F1dGlvbiA9ICdEZWNsaW5lIHRoaXMgbWVzc2FnZSBpZiB5b3UgZGlkIG5vdCBpbml0aWF0ZSBhIHJlcXVlc3QgdG8gc2hhcmUgeW91ciBzZXJ2ZXIgY29uZmlndXJhdGlvbiB3aXRoIGEgcGFjYWtnZSEnXG4gICAgICAgIGxldCBub3RpZiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdTZXJ2ZXIgQ29uZmlndXJhdGlvbiBSZXF1ZXN0ZWQnLCB7XG4gICAgICAgICAgZGV0YWlsOiByZWFzb25Gb3JSZXF1ZXN0ICsgJ1xcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4nICsgY2F1dGlvbixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgICAgdGV4dDogJ0Fsd2F5cycsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1dHRvbmRpc21pc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBub3RpZi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIGFkZFRvV2hpdGVMaXN0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgcmVhc29uRm9yUmVxdWVzdCk7XG4gICAgICAgICAgICAgIHJlc29sdmUocm9vdC5jb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0FjY2VwdCcsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1dHRvbmRpc21pc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBub3RpZi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIHJlc29sdmUocm9vdC5jb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0RlY2xpbmUnLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBidXR0b25kaXNtaXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbm90aWYuZGlzbWlzcygpO1xuICAgICAgICAgICAgICByZWplY3QoJ3VzZXJkZWNsaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ05ldmVyJyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnV0dG9uZGlzbWlzcyA9IHRydWU7XG4gICAgICAgICAgICAgIG5vdGlmLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgYWRkVG9CbGFja0xpc3QoU3RvcmFnZS5nZXRQYXNzd29yZCgpLCByZWFzb25Gb3JSZXF1ZXN0KTtcbiAgICAgICAgICAgICAgcmVqZWN0KCd1c2VyZGVjbGluZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGRpc3Bvc2FibGUgPSBub3RpZi5vbkRpZERpc21pc3MoKCkgPT4ge1xuICAgICAgICAgIGlmICghYnV0dG9uZGlzbWlzcykgcmVqZWN0KCd1c2VyZGVjbGluZWQnKTtcbiAgICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3VtZUVsZW1lbnRJY29ucyhzZXJ2aWNlKSB7XG4gICAgZ2V0SWNvblNlcnZpY2VzKCkuc2V0RWxlbWVudEljb25zKHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGdldEljb25TZXJ2aWNlcygpLnJlc2V0RWxlbWVudEljb25zKCk7XG4gICAgfSlcbiAgfVxuXG4gIHByb210UGFzc3dvcmQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IFByb21wdFBhc3NEaWFsb2coKTtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGlhbG9nLm9uKCdkaWFsb2ctZG9uZScsIChlLCBwYXNzd29yZCkgPT4ge1xuICAgICAgICBpZiAoY2hlY2tQYXNzd29yZChwYXNzd29yZCkpIHtcbiAgICAgICAgICBTdG9yYWdlLnNldFBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcblxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlhbG9nLnNob3dFcnJvcignV3JvbmcgcGFzc3dvcmQsIHRyeSBhZ2FpbiEnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2hhbmdlUGFzc3dvcmQobW9kZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuICAgIGlmIChtb2RlID09ICdhZGQnKSB7XG4gICAgICBvcHRpb25zLm1vZGUgPSAnYWRkJztcbiAgICAgIG9wdGlvbnMucHJvbXB0ID0gJ0VudGVyIHRoZSBtYXN0ZXIgcGFzc3dvcmQuIEFsbCBpbmZvcm1hdGlvbiBhYm91dCB5b3VyIHNlcnZlciBzZXR0aW5ncyB3aWxsIGJlIGVuY3J5cHRlZCB3aXRoIHRoaXMgcGFzc3dvcmQuJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5tb2RlID0gJ2NoYW5nZSc7XG4gICAgfVxuXG4gICAgY29uc3QgZGlhbG9nID0gbmV3IENoYW5nZVBhc3NEaWFsb2cob3B0aW9ucyk7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBkaWFsb2cub24oJ2RpYWxvZy1kb25lJywgKGUsIHBhc3N3b3JkcykgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIHRoYXQgcGFzc3dvcmQgZnJvbSBuZXcgbWFzdGVyIHBhc3N3b3JkIGNhbiBkZWNyeXB0IGN1cnJlbnQgY29uZmlnXG4gICAgICAgIGlmIChtb2RlID09ICdhZGQnKSB7XG4gICAgICAgICAgbGV0IGNvbmZpZ0hhc2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5jb25maWcnKTtcbiAgICAgICAgICBpZiAoY29uZmlnSGFzaCkge1xuICAgICAgICAgICAgbGV0IG5ld1Bhc3N3b3JkID0gcGFzc3dvcmRzLm5ld1Bhc3N3b3JkO1xuICAgICAgICAgICAgbGV0IHRlc3RDb25maWcgPSBkZWNyeXB0KG5ld1Bhc3N3b3JkLCBjb25maWdIYXNoKTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgbGV0IHRlc3RKc29uID0gSlNPTi5wYXJzZSh0ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgLy8gSWYgbWFzdGVyIHBhc3N3b3JkIGRvZXMgbm90IGRlY3J5cHQgY3VycmVudCBjb25maWcsXG4gICAgICAgICAgICAgIC8vIHByb21wdCB0aGUgdXNlciB0byByZXBseSB0byBpbnNlcnQgY29ycmVjdCBwYXNzd29yZFxuICAgICAgICAgICAgICAvLyBvciByZXNldCBjb25maWcgY29udGVudFxuICAgICAgICAgICAgICBzaG93TWVzc2FnZSgnTWFzdGVyIHBhc3N3b3JkIGRvZXMgbm90IG1hdGNoIHdpdGggcHJldmlvdXMgdXNlZC4gUGxlYXNlIHJldHJ5IG9yIGRlbGV0ZSBcImNvbmZpZ1wiIGVudHJ5IGluIGZ0cC1yZW1vdGUtZWRpdCBjb25maWd1cmF0aW9uIG5vZGUuJywgJ2Vycm9yJyk7XG5cbiAgICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9sZFBhc3N3b3JkVmFsdWUgPSAobW9kZSA9PSAnYWRkJykgPyBwYXNzd29yZHMubmV3UGFzc3dvcmQgOiBwYXNzd29yZHMub2xkUGFzc3dvcmQ7XG5cbiAgICAgICAgY2hhbmdlUGFzc3dvcmQob2xkUGFzc3dvcmRWYWx1ZSwgcGFzc3dvcmRzLm5ld1Bhc3N3b3JkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBTdG9yYWdlLnNldFBhc3N3b3JkKHBhc3N3b3Jkcy5uZXdQYXNzd29yZCk7XG5cbiAgICAgICAgICBpZiAobW9kZSAhPSAnYWRkJykge1xuICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ01hc3RlciBwYXNzd29yZCBzdWNjZXNzZnVsbHkgY2hhbmdlZC4gUGxlYXNlIHJlc3RhcnQgYXRvbSEnLCAnc3VjY2VzcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICBpZiAoIWNoZWNrUGFzc3dvcmRFeGlzdHMoKSkge1xuICAgICAgICBzZWxmLmNoYW5nZVBhc3N3b3JkKCdhZGQnKS50aGVuKChyZXR1cm5WYWx1ZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSkge1xuICAgICAgICAgICAgaWYgKFN0b3JhZ2UubG9hZCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYudHJlZVZpZXcucmVsb2FkKCk7XG4gICAgICAgICAgICAgIHNlbGYudHJlZVZpZXcudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5wcm9tdFBhc3N3b3JkKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKFN0b3JhZ2UubG9hZCgpKSB7XG4gICAgICAgICAgICBzZWxmLnRyZWVWaWV3LnJlbG9hZCgpO1xuICAgICAgICAgICAgc2VsZi50cmVlVmlldy50b2dnbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghU3RvcmFnZS5sb2FkZWQgJiYgU3RvcmFnZS5sb2FkKCkpIHtcbiAgICAgIHNlbGYudHJlZVZpZXcucmVsb2FkKCk7XG4gICAgfVxuICAgIHNlbGYudHJlZVZpZXcudG9nZ2xlKCk7XG4gIH1cblxuICB0b2dnbGVGb2N1cygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRyZWVWaWV3LnRvZ2dsZUZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgc2hvdygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRyZWVWaWV3LnNob3coKTtcbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi50cmVlVmlldy5oaWRlKCk7XG4gIH1cblxuICBjb25maWd1cmF0aW9uKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgbGV0IHJvb3QgPSBudWxsO1xuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggIT09IDApIHtcbiAgICAgIHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuICAgIH07XG5cbiAgICBpZiAoc2VsZi5jb25maWd1cmF0aW9uVmlldyA9PSBudWxsKSB7XG4gICAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3ID0gbmV3IENvbmZpZ3VyYXRpb25WaWV3KCk7XG4gICAgfVxuXG4gICAgaWYgKCFTdG9yYWdlLmhhc1Bhc3N3b3JkKCkpIHtcbiAgICAgIHNlbGYucHJvbXRQYXNzd29yZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAoU3RvcmFnZS5sb2FkKCkpIHtcbiAgICAgICAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3LnJlbG9hZChyb290KTtcbiAgICAgICAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3LmF0dGFjaCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3LnJlbG9hZChyb290KTtcbiAgICBzZWxmLmNvbmZpZ3VyYXRpb25WaWV3LmF0dGFjaCgpO1xuICB9XG5cbiAgYWRkVGVtcFNlcnZlcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGxldCByb290ID0gbnVsbDtcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICAgIHJvb3QuY29uZmlnLnRlbXAgPSBmYWxzZTtcbiAgICAgIHNlbGYudHJlZVZpZXcucmVtb3ZlU2VydmVyKHNlbGVjdGVkLnZpZXcoKSk7XG4gICAgICBTdG9yYWdlLmFkZFNlcnZlcihyb290LmNvbmZpZyk7XG4gICAgICBTdG9yYWdlLnNhdmUoKTtcbiAgICB9O1xuICB9XG5cbiAgcmVtb3ZlVGVtcFNlcnZlcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggIT09IDApIHtcbiAgICAgIHNlbGYudHJlZVZpZXcucmVtb3ZlU2VydmVyKHNlbGVjdGVkLnZpZXcoKSk7XG4gICAgfTtcbiAgfVxuXG4gIG9wZW4ocGVuZGluZyA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIHNlbGYub3BlbkZpbGUoZmlsZSwgcGVuZGluZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgc2VsZi5vcGVuRGlyZWN0b3J5KGRpcmVjdG9yeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbkZpbGUoZmlsZSwgcGVuZGluZyA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0UGF0aCh0cnVlKSArIGZpbGUubmFtZSk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldExvY2FsUGF0aCh0cnVlKSArIGZpbGUubmFtZSwgUGF0aC5zZXApO1xuXG4gICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgaWYgKGdldFRleHRFZGl0b3IoZnVsbExvY2FsUGF0aCwgdHJ1ZSkpIHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZnVsbExvY2FsUGF0aCwgeyBwZW5kaW5nOiBwZW5kaW5nLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNlbGYuZG93bmxvYWRGaWxlKGZpbGUuZ2V0Um9vdCgpLCBmdWxsUmVsYXRpdmVQYXRoLCBmdWxsTG9jYWxQYXRoLCB7IGZpbGVzaXplOiBmaWxlLnNpemUgfSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBPcGVuIGZpbGUgYW5kIGFkZCBoYW5kbGVyIHRvIGVkaXRvciB0byB1cGxvYWQgZmlsZSBvbiBzYXZlXG4gICAgICByZXR1cm4gc2VsZi5vcGVuRmlsZUluRWRpdG9yKGZpbGUsIHBlbmRpbmcpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICBvcGVuRGlyZWN0b3J5KGRpcmVjdG9yeSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZGlyZWN0b3J5LmV4cGFuZCgpO1xuICB9XG5cbiAgY3JlYXRlKHR5cGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKS5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IEFkZERpYWxvZyhkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSksIHRydWUpO1xuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuY3JlYXRlRmlsZShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IEFkZERpYWxvZyhkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSksIGZhbHNlKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmNyZWF0ZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRmlsZShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBjcmVhdGUgbG9jYWwgZmlsZVxuICAgICAgaWYgKCFGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZnVsbExvY2FsUGF0aCkpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGxvY2FsIERpcmVjdG9yeVxuICAgICAgICBjcmVhdGVMb2NhbFBhdGgoZnVsbExvY2FsUGF0aCk7XG4gICAgICAgIEZpbGVTeXN0ZW0ud3JpdGVGaWxlU3luYyhmdWxsTG9jYWxQYXRoLCAnJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5leGlzdHNGaWxlKGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgJyArIHJlbGF0aXZlUGF0aC50cmltKCkgKyAnIGFscmVhZHkgZXhpc3RzJywgJ2Vycm9yJyk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VsZi51cGxvYWRGaWxlKGRpcmVjdG9yeSwgZnVsbExvY2FsUGF0aCwgZnVsbFJlbGF0aXZlUGF0aCwgZmFsc2UpLnRoZW4oKGR1cGxpY2F0ZWRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChkdXBsaWNhdGVkRmlsZSkge1xuICAgICAgICAgIC8vIE9wZW4gZmlsZSBhbmQgYWRkIGhhbmRsZXIgdG8gZWRpdG9yIHRvIHVwbG9hZCBmaWxlIG9uIHNhdmVcbiAgICAgICAgICByZXR1cm4gc2VsZi5vcGVuRmlsZUluRWRpdG9yKGR1cGxpY2F0ZWRGaWxlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJlbGF0aXZlUGF0aCA9IHRyYWlsaW5nc2xhc2hpdChyZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBjcmVhdGUgbG9jYWwgZGlyZWN0b3J5XG4gICAgdHJ5IHtcbiAgICAgIGlmICghRmlsZVN5c3RlbS5leGlzdHNTeW5jKGZ1bGxMb2NhbFBhdGgpKSB7XG4gICAgICAgIGNyZWF0ZUxvY2FsUGF0aChmdWxsTG9jYWxQYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHsgfVxuXG4gICAgZGlyZWN0b3J5LmdldENvbm5lY3RvcigpLmV4aXN0c0RpcmVjdG9yeShmdWxsUmVsYXRpdmVQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgJyArIHJlbGF0aXZlUGF0aC50cmltKCkgKyAnIGFscmVhZHkgZXhpc3RzJywgJ2Vycm9yJyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5jcmVhdGVEaXJlY3RvcnkoZnVsbFJlbGF0aXZlUGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi50cmVlVmlldy5hZGREaXJlY3RvcnkoZGlyZWN0b3J5LmdldFJvb3QoKSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuYW1lKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBjb25zdCBkaWFsb2cgPSBuZXcgUmVuYW1lRGlhbG9nKGZpbGUuZ2V0UGF0aChmYWxzZSkgKyBmaWxlLm5hbWUsIHRydWUpO1xuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYucmVuYW1lRmlsZShmaWxlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBSZW5hbWVEaWFsb2codHJhaWxpbmdzbGFzaGl0KGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSksIGZhbHNlKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLnJlbmFtZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVuYW1lRmlsZShmaWxlLCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIGZpbGUuZ2V0Q29ubmVjdG9yKCkucmVuYW1lKGZpbGUuZ2V0UGF0aCh0cnVlKSArIGZpbGUubmFtZSwgZnVsbFJlbGF0aXZlUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICBmaWxlLmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLnJlbmFtZUZpbGUobm9ybWFsaXplKGZpbGUuZ2V0UGF0aChmYWxzZSkgKyBmaWxlLm5hbWUpLCBub3JtYWxpemUocmVsYXRpdmVQYXRoKSwgZmlsZS5zaXplKTtcblxuICAgICAgLy8gQWRkIHRvIHRyZWVcbiAgICAgIGxldCBlbGVtZW50ID0gc2VsZi50cmVlVmlldy5hZGRGaWxlKGZpbGUuZ2V0Um9vdCgpLCByZWxhdGl2ZVBhdGgsIHsgc2l6ZTogZmlsZS5zaXplLCByaWdodHM6IGZpbGUucmlnaHRzIH0pO1xuICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgICBsZXQgZm91bmQgPSBnZXRUZXh0RWRpdG9yKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIGZvdW5kLnNhdmVPYmplY3QgPSBlbGVtZW50O1xuICAgICAgICBmb3VuZC5zYXZlQXMoZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlbGVtZW50Lm5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBNb3ZlIGxvY2FsIGZpbGVcbiAgICAgIG1vdmVMb2NhbFBhdGgoZmlsZS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIGZ1bGxMb2NhbFBhdGgpO1xuXG4gICAgICAvLyBSZW1vdmUgb2xkIGZpbGUgZnJvbSB0cmVlXG4gICAgICBpZiAoZmlsZSkgZmlsZS5yZW1vdmUoKVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmFtZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmVsYXRpdmVQYXRoID0gdHJhaWxpbmdzbGFzaGl0KHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5yZW5hbWUoZGlyZWN0b3J5LmdldFBhdGgoKSwgZnVsbFJlbGF0aXZlUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICBkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkucmVuYW1lRGlyZWN0b3J5KG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpLCBub3JtYWxpemUocmVsYXRpdmVQYXRoICsgJy8nKSk7XG5cbiAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRSb290KCksIHJlbGF0aXZlUGF0aCwgeyByaWdodHM6IGRpcmVjdG9yeS5yaWdodHMgfSk7XG4gICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPXG4gICAgICAvLyBDaGVjayBpZiBmaWxlcyBhcmUgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuXG4gICAgICAvLyBNb3ZlIGxvY2FsIGRpcmVjdG9yeVxuICAgICAgbW92ZUxvY2FsUGF0aChkaXJlY3RvcnkuZ2V0TG9jYWxQYXRoKHRydWUpLCBmdWxsTG9jYWxQYXRoKTtcblxuICAgICAgLy8gUmVtb3ZlIG9sZCBkaXJlY3RvcnkgZnJvbSB0cmVlXG4gICAgICBpZiAoZGlyZWN0b3J5KSBkaXJlY3RvcnkucmVtb3ZlKClcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICBkdXBsaWNhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBEdXBsaWNhdGVEaWFsb2coZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSk7XG4gICAgICAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlKGZpbGUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgLy8gVE9ET1xuICAgICAgLy8gbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIC8vIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgIC8vICAgY29uc3QgZGlhbG9nID0gbmV3IER1cGxpY2F0ZURpYWxvZyh0cmFpbGluZ3NsYXNoaXQoZGlyZWN0b3J5LmdldFBhdGgoZmFsc2UpKSk7XG4gICAgICAvLyAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICAvLyAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgLy8gICAgICAgc2VsZi5kdXBsaWNhdGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpO1xuICAgICAgLy8gICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9KTtcbiAgICAgIC8vICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxuXG4gIGR1cGxpY2F0ZUZpbGUoZmlsZSwgcmVsYXRpdmVQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsUmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICBmaWxlLmdldENvbm5lY3RvcigpLmV4aXN0c0ZpbGUoZnVsbFJlbGF0aXZlUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZSgnRmlsZSAnICsgcmVsYXRpdmVQYXRoLnRyaW0oKSArICcgYWxyZWFkeSBleGlzdHMnLCAnZXJyb3InKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICBzZWxmLmRvd25sb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBmdWxsTG9jYWxQYXRoLCB7IGZpbGVzaXplOiBmaWxlLnNpemUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHNlbGYudXBsb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgZnVsbExvY2FsUGF0aCwgZnVsbFJlbGF0aXZlUGF0aCkudGhlbigoZHVwbGljYXRlZEZpbGUpID0+IHtcbiAgICAgICAgICBpZiAoZHVwbGljYXRlZEZpbGUpIHtcbiAgICAgICAgICAgIC8vIE9wZW4gZmlsZSBhbmQgYWRkIGhhbmRsZXIgdG8gZWRpdG9yIHRvIHVwbG9hZCBmaWxlIG9uIHNhdmVcbiAgICAgICAgICAgIHJldHVybiBzZWxmLm9wZW5GaWxlSW5FZGl0b3IoZHVwbGljYXRlZEZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkdXBsaWNhdGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBUT0RPXG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmaWxlPycsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIllvdSBhcmUgZGVsZXRpbmc6XFxuXCIgKyBmaWxlLmdldFBhdGgoZmFsc2UpICsgZmlsZS5uYW1lLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIFllczogKCkgPT4ge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGZvbGRlcj8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIGRlbGV0aW5nOlxcblwiICsgdHJhaWxpbmdzbGFzaGl0KGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlRmlsZShmaWxlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICBmaWxlLmdldENvbm5lY3RvcigpLmRlbGV0ZUZpbGUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgIGZpbGUuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuZGVsZXRlRmlsZShub3JtYWxpemUoZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSkpO1xuXG4gICAgICAvLyBEZWxldGUgbG9jYWwgZmlsZVxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKEZpbGVTeXN0ZW0uZXhpc3RzU3luYyhmdWxsTG9jYWxQYXRoKSkge1xuICAgICAgICAgIEZpbGVTeXN0ZW0udW5saW5rU3luYyhmdWxsTG9jYWxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7IH1cblxuICAgICAgZmlsZS5wYXJlbnQuc2VsZWN0KCk7XG4gICAgICBmaWxlLmRlc3Ryb3koKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWN1cnNpdmUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5kZWxldGVEaXJlY3RvcnkoZGlyZWN0b3J5LmdldFBhdGgoKSwgcmVjdXJzaXZlKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgIGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5kZWxldGVEaXJlY3Rvcnkobm9ybWFsaXplKGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSkpO1xuXG4gICAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gKGRpcmVjdG9yeS5nZXRMb2NhbFBhdGgodHJ1ZSkpLnJlcGxhY2UoL1xcLysvZywgUGF0aC5zZXApO1xuXG4gICAgICAvLyBEZWxldGUgbG9jYWwgZGlyZWN0b3J5XG4gICAgICBkZWxldGVMb2NhbFBhdGgoZnVsbExvY2FsUGF0aCk7XG5cbiAgICAgIGRpcmVjdG9yeS5wYXJlbnQuc2VsZWN0KCk7XG4gICAgICBkaXJlY3RvcnkuZGVzdHJveSgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1ZpZXcgPSBuZXcgUGVybWlzc2lvbnNWaWV3KGZpbGUpO1xuICAgICAgICBwZXJtaXNzaW9uc1ZpZXcub24oJ2NoYW5nZS1wZXJtaXNzaW9ucycsIChlLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBzZWxmLmNobW9kRmlsZShmaWxlLCByZXN1bHQucGVybWlzc2lvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3LmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zVmlldyA9IG5ldyBQZXJtaXNzaW9uc1ZpZXcoZGlyZWN0b3J5KTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3Lm9uKCdjaGFuZ2UtcGVybWlzc2lvbnMnLCAoZSwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgc2VsZi5jaG1vZERpcmVjdG9yeShkaXJlY3RvcnksIHJlc3VsdC5wZXJtaXNzaW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgICBwZXJtaXNzaW9uc1ZpZXcuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2htb2RGaWxlKGZpbGUsIHBlcm1pc3Npb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBmaWxlLmdldENvbm5lY3RvcigpLmNobW9kRmlsZShmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIHBlcm1pc3Npb25zKS50aGVuKChyZXNwb25zZVRleHQpID0+IHtcbiAgICAgIGZpbGUucmlnaHRzID0gcGVybWlzc2lvbnNUb1JpZ2h0cyhwZXJtaXNzaW9ucyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgY2htb2REaXJlY3RvcnkoZGlyZWN0b3J5LCBwZXJtaXNzaW9ucykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZGlyZWN0b3J5LmdldENvbm5lY3RvcigpLmNobW9kRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRQYXRoKHRydWUpLCBwZXJtaXNzaW9ucykudGhlbigocmVzcG9uc2VUZXh0KSA9PiB7XG4gICAgICBkaXJlY3RvcnkucmlnaHRzID0gcGVybWlzc2lvbnNUb1JpZ2h0cyhwZXJtaXNzaW9ucyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVsb2FkKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IGZpbGUgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZmlsZSkge1xuICAgICAgICBzZWxmLnJlbG9hZEZpbGUoZmlsZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSB8fCBzZWxlY3RlZC52aWV3KCkuaXMoJy5zZXJ2ZXInKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgc2VsZi5yZWxvYWREaXJlY3RvcnkoZGlyZWN0b3J5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWxvYWRGaWxlKGZpbGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBDaGVjayBpZiBmaWxlIGlzIGFscmVhZHkgb3BlbmVkIGluIHRleHRlZGl0b3JcbiAgICBpZiAoZ2V0VGV4dEVkaXRvcihmdWxsTG9jYWxQYXRoLCB0cnVlKSkge1xuICAgICAgc2VsZi5kb3dubG9hZEZpbGUoZmlsZS5nZXRSb290KCksIGZ1bGxSZWxhdGl2ZVBhdGgsIGZ1bGxMb2NhbFBhdGgsIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWxvYWREaXJlY3RvcnkoZGlyZWN0b3J5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBkaXJlY3RvcnkuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICBkaXJlY3RvcnkuZXhwYW5kKCk7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZWxlbWVudC5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IHN0b3JhZ2UgPSBlbGVtZW50LnNlcmlhbGl6ZSgpO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJylcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJ10gPSBlbmNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZSkpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICAvLyBUT0RPXG4gICAgfVxuICB9XG5cbiAgY3V0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdGVkLnZpZXcoKTtcblxuICAgIGlmIChlbGVtZW50LmlzKCcuZmlsZScpIHx8IGVsZW1lbnQuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IHN0b3JhZ2UgPSBlbGVtZW50LnNlcmlhbGl6ZSgpO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjb3B5UGF0aCcpXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJ10gPSBlbmNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZSkpO1xuICAgIH1cbiAgfVxuXG4gIHBhc3RlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVzdE9iamVjdCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZGVzdE9iamVjdC5pcygnLmZpbGUnKSkge1xuICAgICAgZGVzdE9iamVjdCA9IGRlc3RPYmplY3QucGFyZW50O1xuICAgIH1cblxuICAgIGxldCBkYXRhT2JqZWN0ID0gbnVsbDtcbiAgICBsZXQgc3JjT2JqZWN0ID0gbnVsbDtcbiAgICBsZXQgaGFuZGxlRXZlbnQgPSBudWxsO1xuXG4gICAgbGV0IHNyY1R5cGUgPSBudWxsO1xuICAgIGxldCBzcmNQYXRoID0gbnVsbDtcbiAgICBsZXQgZGVzdFBhdGggPSBudWxsO1xuXG4gICAgLy8gUGFyc2UgZGF0YSBmcm9tIGNvcHkvY3V0L2RyYWcgZXZlbnRcbiAgICBpZiAod2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCddKSB7XG4gICAgICAvLyBDdXQgZXZlbnQgZnJvbSBBdG9tXG4gICAgICBoYW5kbGVFdmVudCA9IFwiY3V0XCI7XG5cbiAgICAgIGxldCBjdXRPYmplY3RTdHJpbmcgPSBkZWNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgd2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCddKTtcbiAgICAgIGRhdGFPYmplY3QgPSAoY3V0T2JqZWN0U3RyaW5nKSA/IEpTT04ucGFyc2UoY3V0T2JqZWN0U3RyaW5nKSA6IG51bGw7XG5cbiAgICAgIGxldCBmaW5kID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJyMnICsgZGF0YU9iamVjdC5pZCk7XG4gICAgICBpZiAoIWZpbmQpIHJldHVybjtcblxuICAgICAgc3JjT2JqZWN0ID0gZmluZC52aWV3KCk7XG4gICAgICBpZiAoIXNyY09iamVjdCkgcmV0dXJuO1xuXG4gICAgICBpZiAoc3JjT2JqZWN0LmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgICAgc3JjVHlwZSA9ICdkaXJlY3RvcnknO1xuICAgICAgICBzcmNQYXRoID0gc3JjT2JqZWN0LmdldFBhdGgodHJ1ZSk7XG4gICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcmNUeXBlID0gJ2ZpbGUnO1xuICAgICAgICBzcmNQYXRoID0gc3JjT2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgICAgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgY29weS9jdXQgb3BlcmF0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24gdGhlIHNhbWUgc2VydmVyXG4gICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoZGVzdE9iamVjdC5jb25maWcpICE9IEpTT04uc3RyaW5naWZ5KHNyY09iamVjdC5jb25maWcpKSByZXR1cm47XG5cbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCcpO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjb3B5UGF0aCcpO1xuICAgIH0gZWxzZSBpZiAod2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnXSkge1xuICAgICAgLy8gQ29weSBldmVudCBmcm9tIEF0b21cbiAgICAgIGhhbmRsZUV2ZW50ID0gXCJjb3B5XCI7XG5cbiAgICAgIGxldCBjb3BpZWRPYmplY3RTdHJpbmcgPSBkZWNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgd2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnXSk7XG4gICAgICBkYXRhT2JqZWN0ID0gKGNvcGllZE9iamVjdFN0cmluZykgPyBKU09OLnBhcnNlKGNvcGllZE9iamVjdFN0cmluZykgOiBudWxsO1xuXG4gICAgICBsZXQgZmluZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcjJyArIGRhdGFPYmplY3QuaWQpO1xuICAgICAgaWYgKCFmaW5kKSByZXR1cm47XG5cbiAgICAgIHNyY09iamVjdCA9IGZpbmQudmlldygpO1xuICAgICAgaWYgKCFzcmNPYmplY3QpIHJldHVybjtcblxuICAgICAgaWYgKHNyY09iamVjdC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICAgIHNyY1R5cGUgPSAnZGlyZWN0b3J5JztcbiAgICAgICAgc3JjUGF0aCA9IHNyY09iamVjdC5nZXRQYXRoKHRydWUpO1xuICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3JjVHlwZSA9ICdmaWxlJztcbiAgICAgICAgc3JjUGF0aCA9IHNyY09iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIGNvcHkvY3V0IG9wZXJhdGlvbiBzaG91bGQgYmUgcGVyZm9ybWVkIG9uIHRoZSBzYW1lIHNlcnZlclxuICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGRlc3RPYmplY3QuY29uZmlnKSAhPSBKU09OLnN0cmluZ2lmeShzcmNPYmplY3QuY29uZmlnKSkgcmV0dXJuO1xuXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZnRwLXJlbW90ZS1lZGl0OmN1dFBhdGgnKTtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYW5kbGVFdmVudCA9PSBcImN1dFwiKSB7XG4gICAgICBpZiAoc3JjVHlwZSA9PSAnZGlyZWN0b3J5Jykgc2VsZi5tb3ZlRGlyZWN0b3J5KGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICBpZiAoc3JjVHlwZSA9PSAnZmlsZScpIHNlbGYubW92ZUZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZUV2ZW50ID09IFwiY29weVwiKSB7XG4gICAgICBpZiAoc3JjVHlwZSA9PSAnZGlyZWN0b3J5Jykgc2VsZi5jb3B5RGlyZWN0b3J5KGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICBpZiAoc3JjVHlwZSA9PSAnZmlsZScpIHNlbGYuY29weUZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoLCB7IGZpbGVzaXplOiBzcmNPYmplY3Quc2l6ZSB9KTtcbiAgICB9XG4gIH1cblxuICBkcm9wKGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGRlc3RPYmplY3QgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGRlc3RPYmplY3QuaXMoJy5maWxlJykpIHtcbiAgICAgIGRlc3RPYmplY3QgPSBkZXN0T2JqZWN0LnBhcmVudDtcbiAgICB9XG5cbiAgICBsZXQgaW5pdGlhbFBhdGgsIGluaXRpYWxOYW1lLCBpbml0aWFsVHlwZSwgcmVmO1xuICAgIGlmIChlbnRyeSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5lbnRyeScpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoIWRlc3RPYmplY3QuaXMoJy5kaXJlY3RvcnknKSAmJiAhZGVzdE9iamVjdC5pcygnLnNlcnZlcicpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGluaXRpYWxQYXRoID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxQYXRoXCIpO1xuICAgICAgICBpbml0aWFsTmFtZSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsTmFtZVwiKTtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsUGF0aCA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxQYXRoXCIpO1xuICAgICAgICBpbml0aWFsTmFtZSA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxOYW1lXCIpO1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5pdGlhbFR5cGUgPT0gXCJkaXJlY3RvcnlcIikge1xuICAgICAgICBpZiAobm9ybWFsaXplKGluaXRpYWxQYXRoKSA9PSBub3JtYWxpemUoZGVzdE9iamVjdC5nZXRQYXRoKGZhbHNlKSArIGluaXRpYWxOYW1lICsgJy8nKSkgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChpbml0aWFsVHlwZSA9PSBcImZpbGVcIikge1xuICAgICAgICBpZiAobm9ybWFsaXplKGluaXRpYWxQYXRoKSA9PSBub3JtYWxpemUoZGVzdE9iamVjdC5nZXRQYXRoKGZhbHNlKSArIGluaXRpYWxOYW1lKSkgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5pdGlhbFBhdGgpIHtcbiAgICAgICAgLy8gRHJvcCBldmVudCBmcm9tIEF0b21cbiAgICAgICAgaWYgKGluaXRpYWxUeXBlID09IFwiZGlyZWN0b3J5XCIpIHtcbiAgICAgICAgICBsZXQgc3JjUGF0aCA9IHRyYWlsaW5nc2xhc2hpdChkZXN0T2JqZWN0LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpKSArIGluaXRpYWxQYXRoO1xuICAgICAgICAgIGxldCBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGluaXRpYWxOYW1lICsgJy8nO1xuICAgICAgICAgIHNlbGYubW92ZURpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgICB9IGVsc2UgaWYgKGluaXRpYWxUeXBlID09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgbGV0IHNyY1BhdGggPSB0cmFpbGluZ3NsYXNoaXQoZGVzdE9iamVjdC5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSkgKyBpbml0aWFsUGF0aDtcbiAgICAgICAgICBsZXQgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBpbml0aWFsTmFtZTtcbiAgICAgICAgICBzZWxmLm1vdmVGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERyb3AgZXZlbnQgZnJvbSBPU1xuICAgICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICByZWYgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWYgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBmaWxlID0gcmVmW2ldO1xuICAgICAgICAgIGxldCBzcmNQYXRoID0gZmlsZS5wYXRoO1xuICAgICAgICAgIGxldCBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGJhc2VuYW1lKGZpbGUucGF0aCwgUGF0aC5zZXApO1xuXG4gICAgICAgICAgaWYgKEZpbGVTeXN0ZW0uc3RhdFN5bmMoZmlsZS5wYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICBzZWxmLnVwbG9hZERpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnVwbG9hZEZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGxvYWQodHlwZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVzdE9iamVjdCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZGVzdE9iamVjdC5pcygnLmZpbGUnKSkge1xuICAgICAgZGVzdE9iamVjdCA9IGRlc3RPYmplY3QucGFyZW50O1xuICAgIH1cblxuICAgIGxldCBkZWZhdWx0UGF0aCA9IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyYW5zZmVyLmRlZmF1bHRVcGxvYWRQYXRoJykgfHwgJ2Rlc2t0b3AnO1xuICAgIGlmIChkZWZhdWx0UGF0aCA9PSAncHJvamVjdCcpIHtcbiAgICAgIGNvbnN0IHByb2plY3RzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgICBkZWZhdWx0UGF0aCA9IHByb2plY3RzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkZWZhdWx0UGF0aCA9PSAnZGVza3RvcCcpIHtcbiAgICAgIGRlZmF1bHRQYXRoID0gRWxlY3Ryb24ucmVtb3RlLmFwcC5nZXRQYXRoKFwiZGVza3RvcFwiKVxuICAgIH0gZWxzZSBpZiAoZGVmYXVsdFBhdGggPT0gJ2Rvd25sb2FkcycpIHtcbiAgICAgIGRlZmF1bHRQYXRoID0gRWxlY3Ryb24ucmVtb3RlLmFwcC5nZXRQYXRoKFwiZG93bmxvYWRzXCIpXG4gICAgfVxuICAgIGxldCBzcmNQYXRoID0gbnVsbDtcbiAgICBsZXQgZGVzdFBhdGggPSBudWxsO1xuXG4gICAgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICBFbGVjdHJvbi5yZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nKG51bGwsIHsgdGl0bGU6ICdTZWxlY3QgZmlsZShzKSBmb3IgdXBsb2FkLi4uJywgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoLCBidXR0b25MYWJlbDogJ1VwbG9hZCcsIHByb3BlcnRpZXM6IFsnb3BlbkZpbGUnLCAnbXVsdGlTZWxlY3Rpb25zJywgJ3Nob3dIaWRkZW5GaWxlcyddIH0sIChmaWxlUGF0aHMsIGJvb2ttYXJrcykgPT4ge1xuICAgICAgICBpZiAoZmlsZVBhdGhzKSB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoZmlsZVBhdGhzLm1hcCgoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgICAgIHNyY1BhdGggPSBmaWxlUGF0aDtcbiAgICAgICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgYmFzZW5hbWUoZmlsZVBhdGgsIFBhdGguc2VwKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnVwbG9hZEZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgICAgICB9KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZSgnRmlsZShzKSBoYXMgYmVlbiB1cGxvYWRlZCB0bzogXFxyIFxcbicgKyBmaWxlUGF0aHMuam9pbignXFxyIFxcbicpLCAnc3VjY2VzcycpO1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGlyZWN0b3J5Jykge1xuICAgICAgRWxlY3Ryb24ucmVtb3RlLmRpYWxvZy5zaG93T3BlbkRpYWxvZyhudWxsLCB7IHRpdGxlOiAnU2VsZWN0IGRpcmVjdG9yeSBmb3IgdXBsb2FkLi4uJywgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoLCBidXR0b25MYWJlbDogJ1VwbG9hZCcsIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeScsICdzaG93SGlkZGVuRmlsZXMnXSB9LCAoZGlyZWN0b3J5UGF0aHMsIGJvb2ttYXJrcykgPT4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5UGF0aHMpIHtcbiAgICAgICAgICBkaXJlY3RvcnlQYXRocy5mb3JFYWNoKChkaXJlY3RvcnlQYXRoLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgc3JjUGF0aCA9IGRpcmVjdG9yeVBhdGg7XG4gICAgICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGJhc2VuYW1lKGRpcmVjdG9yeVBhdGgsIFBhdGguc2VwKTtcblxuICAgICAgICAgICAgc2VsZi51cGxvYWREaXJlY3RvcnkoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0RpcmVjdG9yeSBoYXMgYmVlbiB1cGxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZG93bmxvYWQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKCFTdG9yYWdlLmhhc1Bhc3N3b3JkKCkpIHJldHVybjtcblxuICAgIGxldCBkZWZhdWx0UGF0aCA9IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyYW5zZmVyLmRlZmF1bHREb3dubG9hZFBhdGgnKSB8fCAnZG93bmxvYWRzJztcbiAgICBpZiAoZGVmYXVsdFBhdGggPT0gJ3Byb2plY3QnKSB7XG4gICAgICBjb25zdCBwcm9qZWN0cyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgICAgZGVmYXVsdFBhdGggPSBwcm9qZWN0cy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoZGVmYXVsdFBhdGggPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICBkZWZhdWx0UGF0aCA9IEVsZWN0cm9uLnJlbW90ZS5hcHAuZ2V0UGF0aChcImRlc2t0b3BcIilcbiAgICB9IGVsc2UgaWYgKGRlZmF1bHRQYXRoID09ICdkb3dubG9hZHMnKSB7XG4gICAgICBkZWZhdWx0UGF0aCA9IEVsZWN0cm9uLnJlbW90ZS5hcHAuZ2V0UGF0aChcImRvd25sb2Fkc1wiKVxuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgY29uc3Qgc3JjUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUpO1xuXG4gICAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd1NhdmVEaWFsb2cobnVsbCwgeyBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGggKyBcIi9cIiArIGZpbGUubmFtZSB9LCAoZGVzdFBhdGgpID0+IHtcbiAgICAgICAgICBpZiAoZGVzdFBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWRGaWxlKGZpbGUuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCwgeyBmaWxlc2l6ZTogZmlsZS5zaXplIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBzaG93TWVzc2FnZSgnRmlsZSBoYXMgYmVlbiBkb3dubG9hZGVkIHRvICcgKyBkZXN0UGF0aCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgY29uc3Qgc3JjUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0UGF0aCh0cnVlKSk7XG5cbiAgICAgICAgRWxlY3Ryb24ucmVtb3RlLmRpYWxvZy5zaG93U2F2ZURpYWxvZyhudWxsLCB7IGRlZmF1bHRQYXRoOiBkZWZhdWx0UGF0aCArIFwiL1wiICsgZGlyZWN0b3J5Lm5hbWUgfSwgKGRlc3RQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKGRlc3RQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmRvd25sb2FkRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0RpcmVjdG9yeSBoYXMgYmVlbiBkb3dubG9hZGVkIHRvICcgKyBkZXN0UGF0aCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5zZXJ2ZXInKSkge1xuICAgICAgbGV0IHNlcnZlciA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChzZXJ2ZXIpIHtcbiAgICAgICAgY29uc3Qgc3JjUGF0aCA9IG5vcm1hbGl6ZShzZXJ2ZXIuZ2V0UGF0aCh0cnVlKSk7XG5cbiAgICAgICAgRWxlY3Ryb24ucmVtb3RlLmRpYWxvZy5zaG93U2F2ZURpYWxvZyhudWxsLCB7IGRlZmF1bHRQYXRoOiBkZWZhdWx0UGF0aCArIFwiL1wiIH0sIChkZXN0UGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChkZXN0UGF0aCkge1xuICAgICAgICAgICAgc2VsZi5kb3dubG9hZERpcmVjdG9yeShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0RpcmVjdG9yeSBoYXMgYmVlbiBkb3dubG9hZGVkIHRvICcgKyBkZXN0UGF0aCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbW92ZUZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKG5vcm1hbGl6ZShzcmNQYXRoKSA9PSBub3JtYWxpemUoZGVzdFBhdGgpKSByZXR1cm47XG5cbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRmlsZShkZXN0UGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdGaWxlIGFscmVhZHkgZXhpc3RzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoaXMgZmlsZT8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIG92ZXJ3cml0ZTpcXG5cIiArIGRlc3RQYXRoLnRyaW0oKSxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRlbGV0ZUZpbGUoZGVzdFBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdCh0cnVlKTtcbiAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkucmVuYW1lKHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gZ2V0IGluZm8gZnJvbSBvbGQgb2JqZWN0XG4gICAgICAgIGxldCBvbGRPYmplY3QgPSBzZWxmLnRyZWVWaWV3LmZpbmRFbGVtZW50QnlQYXRoKHNlcnZlciwgdHJhaWxpbmdzbGFzaGl0KHNyY1BhdGgucmVwbGFjZShzZXJ2ZXIuY29uZmlnLnJlbW90ZSwgJycpKSk7XG4gICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5nZXRSb290KCkuY29uZmlnLnJlbW90ZSwgJy8nKSk7XG5cbiAgICAgICAgLy8gQWRkIHRvIHRyZWVcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLnRyZWVWaWV3LmFkZEZpbGUoc2VydmVyLCBjYWNoZVBhdGgsIHsgc2l6ZTogKG9sZE9iamVjdCkgPyBvbGRPYmplY3Quc2l6ZSA6IG51bGwsIHJpZ2h0czogKG9sZE9iamVjdCkgPyBvbGRPYmplY3QucmlnaHRzIDogbnVsbCB9KTtcbiAgICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgICBzZXJ2ZXIuZ2V0RmluZGVyQ2FjaGUoKS5yZW5hbWVGaWxlKG5vcm1hbGl6ZShzcmNQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcvJykpLCBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuY29uZmlnLnJlbW90ZSwgJy8nKSksIChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnNpemUgOiAwKTtcblxuICAgICAgICBpZiAob2xkT2JqZWN0KSB7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgICAgICAgbGV0IGZvdW5kID0gZ2V0VGV4dEVkaXRvcihvbGRPYmplY3QuZ2V0TG9jYWxQYXRoKHRydWUpICsgb2xkT2JqZWN0Lm5hbWUpO1xuICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgZm91bmQuc2F2ZU9iamVjdCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICBmb3VuZC5zYXZlQXMoZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlbGVtZW50Lm5hbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vdmUgbG9jYWwgZmlsZVxuICAgICAgICAgIG1vdmVMb2NhbFBhdGgob2xkT2JqZWN0LmdldExvY2FsUGF0aCh0cnVlKSArIG9sZE9iamVjdC5uYW1lLCBlbGVtZW50LmdldExvY2FsUGF0aCh0cnVlKSArIGVsZW1lbnQubmFtZSk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgb2xkIG9iamVjdFxuICAgICAgICAgIG9sZE9iamVjdC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1vdmVEaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaW5pdGlhbFBhdGggPSB0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aCk7XG4gICAgZGVzdFBhdGggPSB0cmFpbGluZ3NsYXNoaXQoZGVzdFBhdGgpO1xuXG4gICAgaWYgKG5vcm1hbGl6ZShzcmNQYXRoKSA9PSBub3JtYWxpemUoZGVzdFBhdGgpKSByZXR1cm47XG5cbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRGlyZWN0b3J5KGRlc3RQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0RpcmVjdG9yeSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGRpcmVjdG9yeT8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIG92ZXJ3cml0ZTpcXG5cIiArIGRlc3RQYXRoLnRyaW0oKSxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRlbGV0ZURpcmVjdG9yeShkZXN0UGF0aCwgcmVjdXJzaXZlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLnJlbmFtZShzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIGdldCBpbmZvIGZyb20gb2xkIG9iamVjdFxuICAgICAgICBsZXQgb2xkT2JqZWN0ID0gc2VsZi50cmVlVmlldy5maW5kRWxlbWVudEJ5UGF0aChzZXJ2ZXIsIHRyYWlsaW5nc2xhc2hpdChzcmNQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcnKSkpO1xuICAgICAgICBjb25zdCBjYWNoZVBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuZ2V0Um9vdCgpLmNvbmZpZy5yZW1vdGUsICcvJykpO1xuXG4gICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi50cmVlVmlldy5hZGREaXJlY3Rvcnkoc2VydmVyLmdldFJvb3QoKSwgY2FjaGVQYXRoLCB7IHNpemU6IChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnNpemUgOiBudWxsLCByaWdodHM6IChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnJpZ2h0cyA6IG51bGwgfSk7XG4gICAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgICAgc2VydmVyLmdldEZpbmRlckNhY2hlKCkucmVuYW1lRGlyZWN0b3J5KG5vcm1hbGl6ZShzcmNQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcvJykpLCBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuY29uZmlnLnJlbW90ZSwgJy8nKSkpO1xuXG4gICAgICAgIGlmIChvbGRPYmplY3QpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG5cbiAgICAgICAgICAvLyBNb3ZlIGxvY2FsIGZpbGVcbiAgICAgICAgICBtb3ZlTG9jYWxQYXRoKG9sZE9iamVjdC5nZXRMb2NhbFBhdGgodHJ1ZSksIGVsZW1lbnQuZ2V0TG9jYWxQYXRoKHRydWUpKTtcblxuICAgICAgICAgIC8vIFJlbW92ZSBvbGQgb2JqZWN0XG4gICAgICAgICAgaWYgKG9sZE9iamVjdCkgb2xkT2JqZWN0LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29weUZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCwgcGFyYW0gPSB7fSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3Qgc3JjTG9jYWxQYXRoID0gbm9ybWFsaXplKHNlcnZlci5nZXRMb2NhbFBhdGgoZmFsc2UpICsgc3JjUGF0aCwgUGF0aC5zZXApO1xuICAgIGNvbnN0IGRlc3RMb2NhbFBhdGggPSBub3JtYWxpemUoc2VydmVyLmdldExvY2FsUGF0aChmYWxzZSkgKyBkZXN0UGF0aCwgUGF0aC5zZXApO1xuXG4gICAgLy8gUmVuYW1lIGZpbGUgaWYgZXhpc3RzXG4gICAgaWYgKHNyY1BhdGggPT0gZGVzdFBhdGgpIHtcbiAgICAgIGxldCBvcmlnaW5hbFBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgpO1xuICAgICAgbGV0IHBhcmVudFBhdGggPSBub3JtYWxpemUoZGlybmFtZShkZXN0UGF0aCkpO1xuXG4gICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkubGlzdERpcmVjdG9yeShwYXJlbnRQYXRoKS50aGVuKChsaXN0KSA9PiB7XG4gICAgICAgIGxldCBmaWxlcyA9IFtdO1xuICAgICAgICBsZXQgZmlsZUxpc3QgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiBpdGVtLnR5cGUgPT09ICctJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZUxpc3QuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGZpbGVzLnB1c2goZWxlbWVudC5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZpbGVQYXRoO1xuICAgICAgICBsZXQgZmlsZUNvdW50ZXIgPSAwO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBnZXRGdWxsRXh0ZW5zaW9uKG9yaWdpbmFsUGF0aCk7XG5cbiAgICAgICAgLy8gYXBwZW5kIGEgbnVtYmVyIHRvIHRoZSBmaWxlIGlmIGFuIGl0ZW0gd2l0aCB0aGUgc2FtZSBuYW1lIGV4aXN0c1xuICAgICAgICB3aGlsZSAoZmlsZXMuaW5jbHVkZXMoYmFzZW5hbWUoZGVzdFBhdGgpKSkge1xuICAgICAgICAgIGZpbGVQYXRoID0gUGF0aC5kaXJuYW1lKG9yaWdpbmFsUGF0aCkgKyAnLycgKyBQYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCwgZXh0ZW5zaW9uKTtcbiAgICAgICAgICBkZXN0UGF0aCA9IGZpbGVQYXRoICsgZmlsZUNvdW50ZXIgKyBleHRlbnNpb247XG4gICAgICAgICAgZmlsZUNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuY29weUZpbGUoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VydmVyLmdldENvbm5lY3RvcigpLmV4aXN0c0ZpbGUoZGVzdFBhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGZpbGU/JyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBvdmVyd3JpdGU6XFxuXCIgKyBkZXN0UGF0aC50cmltKCksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGZpbGVleGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAvLyBDcmVhdGUgbG9jYWwgRGlyZWN0b3JpZXNcbiAgICAgIGNyZWF0ZUxvY2FsUGF0aChzcmNMb2NhbFBhdGgpO1xuICAgICAgY3JlYXRlTG9jYWxQYXRoKGRlc3RMb2NhbFBhdGgpO1xuXG4gICAgICBzZWxmLmRvd25sb2FkRmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RMb2NhbFBhdGgsIHBhcmFtKS50aGVuKCgpID0+IHtcbiAgICAgICAgc2VsZi51cGxvYWRGaWxlKHNlcnZlciwgZGVzdExvY2FsUGF0aCwgZGVzdFBhdGgpLnRoZW4oKGR1cGxpY2F0ZWRGaWxlKSA9PiB7XG4gICAgICAgICAgaWYgKGR1cGxpY2F0ZWRGaWxlKSB7XG4gICAgICAgICAgICAvLyBPcGVuIGZpbGUgYW5kIGFkZCBoYW5kbGVyIHRvIGVkaXRvciB0byB1cGxvYWQgZmlsZSBvbiBzYXZlXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcGVuRmlsZUluRWRpdG9yKGR1cGxpY2F0ZWRGaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29weURpcmVjdG9yeShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAobm9ybWFsaXplKHNyY1BhdGgpID09IG5vcm1hbGl6ZShkZXN0UGF0aCkpIHJldHVybjtcblxuICAgIC8vIFRPRE9cbiAgICBjb25zb2xlLmxvZygnVE9ETyBjb3B5Jywgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICB9XG5cbiAgdXBsb2FkRmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoLCBjaGVja0ZpbGVFeGlzdHMgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoY2hlY2tGaWxlRXhpc3RzKSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlcnZlci5nZXRDb25uZWN0b3IoKS5leGlzdHNGaWxlKGRlc3RQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWNoZVBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuZ2V0Um9vdCgpLmNvbmZpZy5yZW1vdGUsICcvJykpO1xuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdGaWxlIGFscmVhZHkgZXhpc3RzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoaXMgZmlsZT8nLFxuICAgICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBvdmVyd3JpdGU6XFxuXCIgKyBjYWNoZVBhdGgsXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5kZWxldGVGaWxlKGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBsZXQgZmlsZXN0YXQgPSBGaWxlU3lzdGVtLnN0YXRTeW5jKHNyY1BhdGgpO1xuXG4gICAgICAgICAgbGV0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUodHJhaWxpbmdzbGFzaGl0KHNyY1BhdGgpLCBQYXRoLnNlcCk7XG4gICAgICAgICAgbGV0IGZvdW5kSW5UcmVlVmlldyA9IHNlbGYudHJlZVZpZXcuZmluZEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtKTtcbiAgICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgICAvLyBBZGQgc3luYyBpY29uXG4gICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcuYWRkU3luY0ljb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBZGQgdG8gVXBsb2FkIFF1ZXVlXG4gICAgICAgICAgbGV0IHF1ZXVlSXRlbSA9IFF1ZXVlLmFkZEZpbGUoe1xuICAgICAgICAgICAgZGlyZWN0aW9uOiBcInVwbG9hZFwiLFxuICAgICAgICAgICAgcmVtb3RlUGF0aDogZGVzdFBhdGgsXG4gICAgICAgICAgICBsb2NhbFBhdGg6IHNyY1BhdGgsXG4gICAgICAgICAgICBzaXplOiBmaWxlc3RhdC5zaXplXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLnVwbG9hZEZpbGUocXVldWVJdGVtLCAxKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5nZXRSb290KCkuY29uZmlnLnJlbW90ZSwgJy8nKSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRmlsZShzZXJ2ZXIuZ2V0Um9vdCgpLCBjYWNoZVBhdGgsIHsgc2l6ZTogZmlsZXN0YXQuc2l6ZSB9KTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgICAgICAgIHNlcnZlci5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5kZWxldGVGaWxlKG5vcm1hbGl6ZShjYWNoZVBhdGgpKTtcbiAgICAgICAgICAgIHNlcnZlci5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5hZGRGaWxlKG5vcm1hbGl6ZShjYWNoZVBhdGgpLCBmaWxlc3RhdC5zaXplKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kSW5UcmVlVmlldykge1xuICAgICAgICAgICAgICAvLyBSZW1vdmUgc3luYyBpY29uXG4gICAgICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHF1ZXVlSXRlbS5jaGFuZ2VTdGF0dXMoJ0Vycm9yJyk7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcucmVtb3ZlU3luY0ljb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IGZpbGVzdGF0ID0gRmlsZVN5c3RlbS5zdGF0U3luYyhzcmNQYXRoKTtcblxuICAgICAgICBsZXQgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZSh0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aCksIFBhdGguc2VwKTtcbiAgICAgICAgbGV0IGZvdW5kSW5UcmVlVmlldyA9IHNlbGYudHJlZVZpZXcuZmluZEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtKTtcbiAgICAgICAgaWYgKGZvdW5kSW5UcmVlVmlldykge1xuICAgICAgICAgIC8vIEFkZCBzeW5jIGljb25cbiAgICAgICAgICBmb3VuZEluVHJlZVZpZXcuYWRkU3luY0ljb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0byBVcGxvYWQgUXVldWVcbiAgICAgICAgbGV0IHF1ZXVlSXRlbSA9IFF1ZXVlLmFkZEZpbGUoe1xuICAgICAgICAgIGRpcmVjdGlvbjogXCJ1cGxvYWRcIixcbiAgICAgICAgICByZW1vdGVQYXRoOiBkZXN0UGF0aCxcbiAgICAgICAgICBsb2NhbFBhdGg6IHNyY1BhdGgsXG4gICAgICAgICAgc2l6ZTogZmlsZXN0YXQuc2l6ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLnVwbG9hZEZpbGUocXVldWVJdGVtLCAxKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWNoZVBhdGggPSBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuZ2V0Um9vdCgpLmNvbmZpZy5yZW1vdGUsICcvJykpO1xuXG4gICAgICAgICAgLy8gQWRkIHRvIHRyZWVcbiAgICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYudHJlZVZpZXcuYWRkRmlsZShzZXJ2ZXIuZ2V0Um9vdCgpLCBjYWNoZVBhdGgsIHsgc2l6ZTogZmlsZXN0YXQuc2l6ZSB9KTtcbiAgICAgICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgICAgc2VydmVyLmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLmRlbGV0ZUZpbGUobm9ybWFsaXplKGNhY2hlUGF0aCkpO1xuICAgICAgICAgIHNlcnZlci5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5hZGRGaWxlKG5vcm1hbGl6ZShjYWNoZVBhdGgpLCBmaWxlc3RhdC5zaXplKTtcblxuICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzeW5jIGljb25cbiAgICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoZWxlbWVudCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuXG4gICAgICAgICAgaWYgKGZvdW5kSW5UcmVlVmlldykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgfVxuXG4gIHVwbG9hZERpcmVjdG9yeShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgRmlsZVN5c3RlbS5saXN0VHJlZVN5bmMoc3JjUGF0aCkuZmlsdGVyKChwYXRoKSA9PiBGaWxlU3lzdGVtLmlzRmlsZVN5bmMocGF0aCkpLnJlZHVjZSgocHJldlByb21pc2UsIHBhdGgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByZXZQcm9taXNlLnRoZW4oKCkgPT4gc2VsZi51cGxvYWRGaWxlKHNlcnZlciwgcGF0aCwgbm9ybWFsaXplKGRlc3RQYXRoICsgJy8nICsgcGF0aC5yZXBsYWNlKHNyY1BhdGgsICcvJyksICcvJykpKTtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHJlc29sdmUoKSkuY2F0Y2goKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkRmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoLCBwYXJhbSA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBpbiBRdWV1ZVxuICAgICAgaWYgKFF1ZXVlLmV4aXN0c0ZpbGUoZGVzdFBhdGgpKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZSh0cmFpbGluZ3NsYXNoaXQoc2VydmVyLmdldExvY2FsUGF0aChmYWxzZSkgKyBzcmNQYXRoKSwgUGF0aC5zZXApO1xuICAgICAgbGV0IGZvdW5kSW5UcmVlVmlldyA9IHNlbGYudHJlZVZpZXcuZmluZEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtKTtcbiAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgLy8gQWRkIHN5bmMgaWNvblxuICAgICAgICBmb3VuZEluVHJlZVZpZXcuYWRkU3luY0ljb24oKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIGxvY2FsIERpcmVjdG9yaWVzXG4gICAgICBjcmVhdGVMb2NhbFBhdGgoZGVzdFBhdGgpO1xuXG4gICAgICAvLyBBZGQgdG8gRG93bmxvYWQgUXVldWVcbiAgICAgIGxldCBxdWV1ZUl0ZW0gPSBRdWV1ZS5hZGRGaWxlKHtcbiAgICAgICAgZGlyZWN0aW9uOiBcImRvd25sb2FkXCIsXG4gICAgICAgIHJlbW90ZVBhdGg6IHNyY1BhdGgsXG4gICAgICAgIGxvY2FsUGF0aDogZGVzdFBhdGgsXG4gICAgICAgIHNpemU6IChwYXJhbS5maWxlc2l6ZSkgPyBwYXJhbS5maWxlc2l6ZSA6IDBcbiAgICAgIH0pO1xuXG4gICAgICAvLyBEb3dubG9hZCBmaWxlXG4gICAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZG93bmxvYWRGaWxlKHF1ZXVlSXRlbSkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgc3luYyBpY29uXG4gICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuXG4gICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgc3luYyBpY29uXG4gICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBkb3dubG9hZERpcmVjdG9yeShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBzY2FuRGlyID0gKHBhdGgpID0+IHtcbiAgICAgIHJldHVybiBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkubGlzdERpcmVjdG9yeShwYXRoKS50aGVuKGxpc3QgPT4ge1xuICAgICAgICBjb25zdCBmaWxlcyA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiAoaXRlbS50eXBlID09PSAnLScpKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpdGVtLnBhdGggPSBub3JtYWxpemUocGF0aCArICcvJyArIGl0ZW0ubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkaXJzID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IChpdGVtLnR5cGUgPT09ICdkJyAmJiBpdGVtLm5hbWUgIT09ICcuJyAmJiBpdGVtLm5hbWUgIT09ICcuLicpKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpdGVtLnBhdGggPSBub3JtYWxpemUocGF0aCArICcvJyArIGl0ZW0ubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkaXJzLnJlZHVjZSgocHJldlByb21pc2UsIGRpcikgPT4ge1xuICAgICAgICAgIHJldHVybiBwcmV2UHJvbWlzZS50aGVuKG91dHB1dCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2NhbkRpcihub3JtYWxpemUoZGlyLnBhdGgpKS50aGVuKGZpbGVzID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5jb25jYXQoZmlsZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIFByb21pc2UucmVzb2x2ZShmaWxlcykpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FuRGlyKHNyY1BhdGgpLnRoZW4oKGZpbGVzKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIUZpbGVTeXN0ZW0uZXhpc3RzU3luYyhkZXN0UGF0aCkpIHtcbiAgICAgICAgICBGaWxlU3lzdGVtLm1rZGlyU3luYyhkZXN0UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZpbGVzLnJlZHVjZSgocHJldlByb21pc2UsIGZpbGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJldlByb21pc2UudGhlbigoKSA9PiBzZWxmLmRvd25sb2FkRmlsZShzZXJ2ZXIsIGZpbGUucGF0aCwgbm9ybWFsaXplKGRlc3RQYXRoICsgUGF0aC5zZXAgKyBmaWxlLnBhdGgucmVwbGFjZShzcmNQYXRoLCAnLycpLCBQYXRoLnNlcCksIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KSk7XG4gICAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHJlc29sdmUoKSkuY2F0Y2goKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRSZW1vdGVQYXRoKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi50cmVlVmlldy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlhbG9nID0gbmV3IEZpbmREaWFsb2coJy8nLCBmYWxzZSk7XG4gICAgZGlhbG9nLm9uKCdmaW5kLXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgIHJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShyZWxhdGl2ZVBhdGgpO1xuXG4gICAgICAgIGxldCByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcblxuICAgICAgICAvLyBSZW1vdmUgaW5pdGlhbCBwYXRoIGlmIGV4aXN0c1xuICAgICAgICBpZiAocm9vdC5jb25maWcucmVtb3RlKSB7XG4gICAgICAgICAgaWYgKHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKHJvb3QuY29uZmlnLnJlbW90ZSkpIHtcbiAgICAgICAgICAgIHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlUGF0aC5yZXBsYWNlKHJvb3QuY29uZmlnLnJlbW90ZSwgXCJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi50cmVlVmlldy5leHBhbmQocm9vdCwgcmVsYXRpdmVQYXRoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZGlhbG9nLmF0dGFjaCgpO1xuICB9XG5cbiAgY29weVJlbW90ZVBhdGgoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLnRyZWVWaWV3Lmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZWxlbWVudC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBwYXRoVG9Db3B5ID0gZWxlbWVudC5nZXRQYXRoKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRoVG9Db3B5ID0gZWxlbWVudC5nZXRQYXRoKHRydWUpICsgZWxlbWVudC5uYW1lO1xuICAgIH1cbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZShwYXRoVG9Db3B5KVxuICB9XG5cbiAgcmVtb3RlUGF0aEZpbmRlcihyZWluZGV4ID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYudHJlZVZpZXcubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGxldCByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICBsZXQgaXRlbXNDYWNoZSA9IHJvb3QuZ2V0RmluZGVyQ2FjaGUoKTtcblxuICAgIGlmIChzZWxmLmZpbmRlclZpZXcgPT0gbnVsbCkge1xuICAgICAgc2VsZi5maW5kZXJWaWV3ID0gbmV3IEZpbmRlclZpZXcoc2VsZi50cmVlVmlldyk7XG5cbiAgICAgIHNlbGYuZmluZGVyVmlldy5vbignZnRwLXJlbW90ZS1lZGl0LWZpbmRlcjpvcGVuJywgKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IGl0ZW0ucmVsYXRpdmVQYXRoO1xuICAgICAgICBsZXQgbG9jYWxQYXRoID0gbm9ybWFsaXplKHNlbGYuZmluZGVyVmlldy5yb290LmdldExvY2FsUGF0aCgpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG4gICAgICAgIGxldCBmaWxlID0gc2VsZi50cmVlVmlldy5nZXRFbGVtZW50QnlMb2NhbFBhdGgobG9jYWxQYXRoLCBzZWxmLmZpbmRlclZpZXcucm9vdCwgJ2ZpbGUnKTtcbiAgICAgICAgZmlsZS5zaXplID0gaXRlbS5zaXplO1xuXG4gICAgICAgIGlmIChmaWxlKSBzZWxmLm9wZW5GaWxlKGZpbGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuZmluZGVyVmlldy5vbignZnRwLXJlbW90ZS1lZGl0LWZpbmRlcjpoaWRlJywgKCkgPT4ge1xuICAgICAgICBpdGVtc0NhY2hlLmxvYWRUYXNrID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgc2VsZi5maW5kZXJWaWV3LnJvb3QgPSByb290O1xuICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXNDYWNoZS5pdGVtcyB9KVxuXG4gICAgY29uc3QgaW5kZXggPSAoaXRlbXMpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXMsIGVycm9yTWVzc2FnZTogJycsIGxvYWRpbmdNZXNzYWdlOiAnSW5kZXhpbmdcXHUyMDI2JyArIGl0ZW1zLmxlbmd0aCB9KVxuICAgIH07XG4gICAgaXRlbXNDYWNoZS5yZW1vdmVMaXN0ZW5lcignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmluZGV4JywgaW5kZXgpO1xuICAgIGl0ZW1zQ2FjaGUub24oJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTppbmRleCcsIGluZGV4KTtcblxuICAgIGNvbnN0IHVwZGF0ZSA9IChpdGVtcykgPT4ge1xuICAgICAgc2VsZi5maW5kZXJWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiBpdGVtcywgZXJyb3JNZXNzYWdlOiAnJywgbG9hZGluZ01lc3NhZ2U6ICcnIH0pXG4gICAgfTtcbiAgICBpdGVtc0NhY2hlLnJlbW92ZUxpc3RlbmVyKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6dXBkYXRlJywgdXBkYXRlKTtcbiAgICBpdGVtc0NhY2hlLm9uKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6dXBkYXRlJywgdXBkYXRlKTtcblxuICAgIGNvbnN0IGZpbmlzaCA9IChpdGVtcykgPT4ge1xuICAgICAgc2VsZi5maW5kZXJWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiBpdGVtcywgZXJyb3JNZXNzYWdlOiAnJywgbG9hZGluZ01lc3NhZ2U6ICcnIH0pXG4gICAgfTtcbiAgICBpdGVtc0NhY2hlLnJlbW92ZUxpc3RlbmVyKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZmluaXNoJywgZmluaXNoKTtcbiAgICBpdGVtc0NhY2hlLm9uKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZmluaXNoJywgZmluaXNoKTtcblxuICAgIGNvbnN0IGVycm9yID0gKGVycikgPT4ge1xuICAgICAgc2VsZi5maW5kZXJWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGVycm9yTWVzc2FnZTogJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UgfSlcbiAgICB9O1xuICAgIGl0ZW1zQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTplcnJvcicsIGVycm9yKTtcbiAgICBpdGVtc0NhY2hlLm9uKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZXJyb3InLCBlcnJvcik7XG5cbiAgICBpdGVtc0NhY2hlLmxvYWQocmVpbmRleCk7XG4gICAgc2VsZi5maW5kZXJWaWV3LnRvZ2dsZSgpO1xuICB9XG5cbiAgYXV0b1JldmVhbEFjdGl2ZUZpbGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5hdXRvUmV2ZWFsQWN0aXZlRmlsZScpKSB7XG4gICAgICBpZiAoc2VsZi50cmVlVmlldy5pc1Zpc2libGUoKSkge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgICAgIGxldCBwYXRoT25GaWxlU3lzdGVtID0gbm9ybWFsaXplKHRyYWlsaW5nc2xhc2hpdChlZGl0b3IuZ2V0UGF0aCgpKSwgUGF0aC5zZXApO1xuXG4gICAgICAgICAgbGV0IGVudHJ5ID0gc2VsZi50cmVlVmlldy5maW5kRWxlbWVudEJ5TG9jYWxQYXRoKHBhdGhPbkZpbGVTeXN0ZW0pO1xuICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgZW50cnkuc2VsZWN0KCk7XG4gICAgICAgICAgICBzZWxmLnRyZWVWaWV3LnJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbk1vdmVQYWdlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbkZpbGVJbkVkaXRvcihmaWxlLCBwZW5kaW5nKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbihub3JtYWxpemUoZmlsZS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIFBhdGguc2VwKSwgeyBwZW5kaW5nOiBwZW5kaW5nLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KS50aGVuKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5zYXZlT2JqZWN0ID0gZmlsZTtcbiAgICAgIGVkaXRvci5zYXZlT2JqZWN0LmFkZENsYXNzKCdvcGVuJyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFNhdmUgZmlsZSBvbiByZW1vdGUgc2VydmVyXG4gICAgICAgIGVkaXRvci5vbkRpZFNhdmUoKHNhdmVPYmplY3QpID0+IHtcbiAgICAgICAgICBpZiAoIWVkaXRvci5zYXZlT2JqZWN0KSByZXR1cm47XG5cbiAgICAgICAgICAvLyBHZXQgZmlsZXNpemVcbiAgICAgICAgICBjb25zdCBmaWxlc3RhdCA9IEZpbGVTeXN0ZW0uc3RhdFN5bmMoZWRpdG9yLmdldFBhdGgodHJ1ZSkpO1xuICAgICAgICAgIGVkaXRvci5zYXZlT2JqZWN0LnNpemUgPSBmaWxlc3RhdC5zaXplO1xuICAgICAgICAgIGVkaXRvci5zYXZlT2JqZWN0LmF0dHIoJ2RhdGEtc2l6ZScsIGZpbGVzdGF0LnNpemUpO1xuXG4gICAgICAgICAgY29uc3Qgc3JjUGF0aCA9IGVkaXRvci5zYXZlT2JqZWN0LmdldExvY2FsUGF0aCh0cnVlKSArIGVkaXRvci5zYXZlT2JqZWN0Lm5hbWU7XG4gICAgICAgICAgY29uc3QgZGVzdFBhdGggPSBlZGl0b3Iuc2F2ZU9iamVjdC5nZXRQYXRoKHRydWUpICsgZWRpdG9yLnNhdmVPYmplY3QubmFtZTtcbiAgICAgICAgICBzZWxmLnVwbG9hZEZpbGUoZWRpdG9yLnNhdmVPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCwgZmFsc2UpLnRoZW4oKGR1cGxpY2F0ZWRGaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZHVwbGljYXRlZEZpbGUpIHtcbiAgICAgICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0Lm5vdGlmaWNhdGlvbnMuc2hvd05vdGlmaWNhdGlvbk9uVXBsb2FkJykpIHtcbiAgICAgICAgICAgICAgICBzaG93TWVzc2FnZSgnRmlsZSBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICBpZiAoIWVkaXRvci5zYXZlT2JqZWN0KSByZXR1cm47XG5cbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBGdHBSZW1vdGVFZGl0KCk7XG4iXX0=