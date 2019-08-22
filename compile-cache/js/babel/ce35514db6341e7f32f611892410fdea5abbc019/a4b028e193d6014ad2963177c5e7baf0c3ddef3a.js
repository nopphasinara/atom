Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helperSecureJs = require('./helper/secure.js');

var _helperFormatJs = require('./helper/format.js');

var _helperHelperJs = require('./helper/helper.js');

'use babel';

var ConfigurationView = null;
var PermissionsView = null;
var TreeView = null;
var ProtocolView = null;
var FinderView = null;

var ChangePassDialog = null;
var PromptPassDialog = null;
var AddDialog = null;
var RenameDialog = null;
var FindDialog = null;
var DuplicateDialog = null;

var Electron = null;
var Path = null;
var FileSystem = null;
var Queue = null;
var Storage = null;

var atom = global.atom;
var getIconServices = require('./helper/icon.js');
var config = require('./config/config-schema.json');
var server_config = require('./config/server-schema.json');

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
    self.loaded = false;
  }

  _createClass(FtpRemoteEdit, [{
    key: 'activate',
    value: function activate() {
      var self = this;

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
          return self.unfocus();
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
      atom.packages.onDidActivatePackage(function (activatePackage) {
        if (activatePackage.name == 'ftp-remote-edit') {
          // Remove obsolete entries from the configuration
          var packageVersion = atom.packages.getActivePackage('ftp-remote-edit').metadata.version;
          if ((0, _helperHelperJs.compareVersions)(packageVersion, '0.17.1') >= 0) {
            atom.config.unset('ftp-remote-edit.tree.showInDock');
            atom.config.unset('ftp-remote-edit.tree.showHiddenFiles');
            atom.config.unset('ftp-remote-edit.tree.showOnRightSide');
          }

          // Init package when lazy loading is disabled
          if (atom.config.get('ftp-remote-edit.dev.disableLazyLoading')) {
            self.init();
          }

          // Open the view automatically when atom starts
          if (atom.config.get('ftp-remote-edit.tree.toggleOnStartup')) {
            self.toggle();
          }
        }
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var self = this;

      if (!self.loaded) {
        self.loaded = true;

        require('events').EventEmitter.defaultMaxListeners = 0;

        ConfigurationView = require('./views/configuration-view');
        PermissionsView = require('./views/permissions-view');
        TreeView = require('./views/tree-view');
        ProtocolView = require('./views/protocol-view');
        FinderView = require('./views/finder-view');

        ChangePassDialog = require('./dialogs/change-pass-dialog');
        PromptPassDialog = require('./dialogs/prompt-pass-dialog');
        AddDialog = require('./dialogs/add-dialog');
        RenameDialog = require('./dialogs/rename-dialog');
        FindDialog = require('./dialogs/find-dialog');
        DuplicateDialog = require('./dialogs/duplicate-dialog');

        Electron = require('electron');
        Path = require('path');
        FileSystem = require('fs-plus');
        Queue = require('./helper/queue.js');
        Storage = require('./helper/storage.js');

        // Events
        // Config change
        atom.config.onDidChange('ftp-remote-edit.config', function () {
          if (Storage.getPassword()) {
            Storage.load(true);
            self.getTreeViewInstance().reload();
          }
        });

        // Drag & Drop
        self.getTreeViewInstance().on('drop', function (e) {
          self.drop(e);
        });

        // Auto Reveal Active File
        atom.workspace.getCenter().onDidStopChangingActivePaneItem(function (item) {
          self.autoRevealActiveFile();
        });

        // Workaround to activate core.allowPendingPaneItems if ftp-remote-edit.tree.allowPendingPaneItems is activated
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

        // Init protocoll view
        self.getProtocolViewInstance();
      }
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

        if (!self.getTreeViewInstance().isVisible()) {
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

        self.getTreeViewInstance().addServer(newconfig);
      }
    }
  }, {
    key: 'openRemoteFile',
    value: function openRemoteFile() {
      var self = this;

      return function (file) {
        var selected = self.getTreeViewInstance().list.find('.selected');

        if (selected.length === 0) return;

        var root = selected.view().getRoot();
        var localPath = (0, _helperFormatJs.normalize)(root.getLocalPath());
        localPath = (0, _helperFormatJs.normalize)(Path.join(localPath.slice(0, localPath.lastIndexOf(root.getPath())), file).replace(/\/+/g, Path.sep), Path.sep);

        try {
          var _file = self.getTreeViewInstance().getElementByLocalPath(localPath, root, 'file');
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
          var selected = self.getTreeViewInstance().list.find('.selected');
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

          var selected = self.getTreeViewInstance().list.find('.selected');
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
      var dialog = new PromptPassDialog();

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

      var dialog = new ChangePassDialog(options);
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

      self.init();

      if (!Storage.hasPassword()) {
        if (!(0, _helperSecureJs.checkPasswordExists)()) {
          self.changePassword('add').then(function (returnValue) {
            if (returnValue) {
              if (Storage.load()) {
                self.getTreeViewInstance().reload();
                self.getTreeViewInstance().toggle();
              }
            }
          });
          return;
        } else {
          self.promtPassword().then(function () {
            if (Storage.load()) {
              self.getTreeViewInstance().reload();
              self.getTreeViewInstance().toggle();
            }
          });
          return;
        }
      } else if (!Storage.loaded && Storage.load()) {
        self.getTreeViewInstance().reload();
      }
      self.getTreeViewInstance().toggle();
    }
  }, {
    key: 'toggleFocus',
    value: function toggleFocus() {
      var self = this;

      if (!Storage.hasPassword()) {
        self.toggle();
      } else {
        self.getTreeViewInstance().toggleFocus();
      }
    }
  }, {
    key: 'unfocus',
    value: function unfocus() {
      var self = this;

      self.getTreeViewInstance().unfocus();
    }
  }, {
    key: 'show',
    value: function show() {
      var self = this;

      if (!Storage.hasPassword()) {
        self.toggle();
      } else {
        self.getTreeViewInstance().show();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      var self = this;

      self.getTreeViewInstance().hide();
    }
  }, {
    key: 'configuration',
    value: function configuration() {
      var self = this;
      var selected = self.getTreeViewInstance().list.find('.selected');

      var root = null;
      if (selected.length !== 0) {
        root = selected.view().getRoot();
      };

      if (!Storage.hasPassword()) {
        self.promtPassword().then(function () {
          if (Storage.load()) {
            self.getConfigurationViewInstance().reload(root);
            self.getConfigurationViewInstance().attach();
          }
        });
        return;
      }

      self.getConfigurationViewInstance().reload(root);
      self.getConfigurationViewInstance().attach();
    }
  }, {
    key: 'addTempServer',
    value: function addTempServer() {
      var self = this;
      var selected = self.getTreeViewInstance().list.find('.selected');

      var root = null;
      if (selected.length !== 0) {
        root = selected.view().getRoot();
        root.config.temp = false;
        self.getTreeViewInstance().removeServer(selected.view());
        Storage.addServer(root.config);
        Storage.save();
      };
    }
  }, {
    key: 'removeTempServer',
    value: function removeTempServer() {
      var self = this;
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length !== 0) {
        self.getTreeViewInstance().removeServer(selected.view());
      };
    }
  }, {
    key: 'open',
    value: function open() {
      var pending = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var self = this;
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        directory = selected.view().parent;
      } else {
        directory = selected.view();
      }

      if (directory) {
        if (type == 'file') {
          (function () {
            var dialog = new AddDialog(directory.getPath(false), true);
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
            var dialog = new AddDialog(directory.getPath(false), false);
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
          var element = self.getTreeViewInstance().addDirectory(directory.getRoot(), relativePath);
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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            (function () {
              var dialog = new RenameDialog(file.getPath(false) + file.name, true);
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
              var dialog = new RenameDialog((0, _helperFormatJs.trailingslashit)(directory.getPath(false)), false);
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
        var element = self.getTreeViewInstance().addFile(file.getRoot(), relativePath, { size: file.size, rights: file.rights });
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
        var element = self.getTreeViewInstance().addDirectory(directory.getRoot(), relativePath, { rights: directory.rights });
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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            (function () {
              var dialog = new DuplicateDialog(file.getPath(false) + file.name);
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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      if (selected.view().is('.file')) {
        (function () {
          var file = selected.view();
          if (file) {
            var permissionsView = new PermissionsView(file);
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
            var permissionsView = new PermissionsView(directory);
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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

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

        var _find = self.getTreeViewInstance().list.find('#' + dataObject.id);
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

        var _find2 = self.getTreeViewInstance().list.find('#' + dataObject.id);
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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
          var oldObject = self.getTreeViewInstance().findElementByPath(server, (0, _helperFormatJs.trailingslashit)(srcPath.replace(server.config.remote, '')));
          var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

          // Add to tree
          var element = self.getTreeViewInstance().addFile(server, cachePath, { size: oldObject ? oldObject.size : null, rights: oldObject ? oldObject.rights : null });
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
          var oldObject = self.getTreeViewInstance().findElementByPath(server, (0, _helperFormatJs.trailingslashit)(srcPath.replace(server.config.remote, '')));
          var cachePath = (0, _helperFormatJs.normalize)(destPath.replace(server.getRoot().config.remote, '/'));

          // Add to tree
          var element = self.getTreeViewInstance().addDirectory(server.getRoot(), cachePath, { size: oldObject ? oldObject.size : null, rights: oldObject ? oldObject.rights : null });
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
            var foundInTreeView = self.getTreeViewInstance().findElementByLocalPath(pathOnFileSystem);
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
              var element = self.getTreeViewInstance().addFile(server.getRoot(), cachePath, { size: filestat.size });
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
          var foundInTreeView = self.getTreeViewInstance().findElementByLocalPath(pathOnFileSystem);
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
            var element = self.getTreeViewInstance().addFile(server.getRoot(), cachePath, { size: filestat.size });
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
        var foundInTreeView = self.getTreeViewInstance().findElementByLocalPath(pathOnFileSystem);
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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      var dialog = new FindDialog('/', false);
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

          self.getTreeViewInstance().expand(root, relativePath)['catch'](function (err) {
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
      var selected = self.getTreeViewInstance().list.find('.selected');

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
      var selected = self.getTreeViewInstance().list.find('.selected');

      if (selected.length === 0) return;

      var root = selected.view().getRoot();
      var itemsCache = root.getFinderCache();

      if (self.finderView == null) {
        self.finderView = new FinderView(self.getTreeViewInstance());

        self.finderView.on('ftp-remote-edit-finder:open', function (item) {
          var relativePath = item.relativePath;
          var localPath = (0, _helperFormatJs.normalize)(self.finderView.root.getLocalPath() + relativePath, Path.sep);
          var file = self.getTreeViewInstance().getElementByLocalPath(localPath, self.finderView.root, 'file');
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
        if (self.getTreeViewInstance().isVisible()) {
          var editor = atom.workspace.getActiveTextEditor();

          if (editor && editor.getPath()) {
            var pathOnFileSystem = (0, _helperFormatJs.normalize)((0, _helperFormatJs.trailingslashit)(editor.getPath()), Path.sep);

            var _entry = self.getTreeViewInstance().findElementByLocalPath(pathOnFileSystem);
            if (_entry && _entry.isVisible()) {
              _entry.select();
              self.getTreeViewInstance().remoteKeyboardNavigationMovePage();
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
  }, {
    key: 'getTreeViewInstance',
    value: function getTreeViewInstance() {
      var self = this;

      self.init();

      if (self.treeView == null) {
        self.treeView = new TreeView();
      }
      return self.treeView;
    }
  }, {
    key: 'getProtocolViewInstance',
    value: function getProtocolViewInstance() {
      var self = this;

      self.init();

      if (self.protocolView == null) {
        self.protocolView = new ProtocolView();
      }
      return self.protocolView;
    }
  }, {
    key: 'getConfigurationViewInstance',
    value: function getConfigurationViewInstance() {
      var self = this;

      self.init();

      if (self.configurationView == null) {
        self.configurationView = new ConfigurationView();
      }
      return self.configurationView;
    }
  }]);

  return FtpRemoteEdit;
})();

exports['default'] = new FtpRemoteEdit();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9mdHAtcmVtb3RlLWVkaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWdELE1BQU07OzhCQUM2RixvQkFBb0I7OzhCQUN6RyxvQkFBb0I7OzhCQUM0RSxvQkFBb0I7O0FBTGxMLFdBQVcsQ0FBQzs7QUFPWixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUM3QixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztBQUN4QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXRCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFM0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN0RCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7SUFFdkQs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QUFFLENBQUM7T0FDaEM7QUFDRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7OztXQUVzQixtQ0FBRztBQUN4QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixVQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztPQUN4QztBQUNELGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjs7O1dBRTJCLHdDQUFHO0FBQzdCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVaLFVBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRTtBQUNsQyxZQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO09BQ2xEO0FBQ0QsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7S0FDL0I7OztTQTc1REcsYUFBYTs7O3FCQWc2REosSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2Z0cC1yZW1vdGUtZWRpdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBkZWNyeXB0LCBlbmNyeXB0LCBjaGVja1Bhc3N3b3JkRXhpc3RzLCBjaGVja1Bhc3N3b3JkLCBjaGFuZ2VQYXNzd29yZCwgaXNJbldoaXRlTGlzdCwgaXNJbkJsYWNrTGlzdCwgYWRkVG9XaGl0ZUxpc3QsIGFkZFRvQmxhY2tMaXN0IH0gZnJvbSAnLi9oZWxwZXIvc2VjdXJlLmpzJztcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCB0cmFpbGluZ3NsYXNoaXQsIG5vcm1hbGl6ZSB9IGZyb20gJy4vaGVscGVyL2Zvcm1hdC5qcyc7XG5pbXBvcnQgeyBsb2dEZWJ1Zywgc2hvd01lc3NhZ2UsIGdldEZ1bGxFeHRlbnNpb24sIGNyZWF0ZUxvY2FsUGF0aCwgZGVsZXRlTG9jYWxQYXRoLCBtb3ZlTG9jYWxQYXRoLCBnZXRUZXh0RWRpdG9yLCBwZXJtaXNzaW9uc1RvUmlnaHRzLCBjb21wYXJlVmVyc2lvbnMgfSBmcm9tICcuL2hlbHBlci9oZWxwZXIuanMnO1xuXG5sZXQgQ29uZmlndXJhdGlvblZpZXcgPSBudWxsO1xubGV0IFBlcm1pc3Npb25zVmlldyA9IG51bGw7XG5sZXQgVHJlZVZpZXcgPSBudWxsO1xubGV0IFByb3RvY29sVmlldyA9IG51bGw7XG5sZXQgRmluZGVyVmlldyA9IG51bGw7XG5cbmxldCBDaGFuZ2VQYXNzRGlhbG9nID0gbnVsbDtcbmxldCBQcm9tcHRQYXNzRGlhbG9nID0gbnVsbDtcbmxldCBBZGREaWFsb2cgPSBudWxsO1xubGV0IFJlbmFtZURpYWxvZyA9IG51bGw7XG5sZXQgRmluZERpYWxvZyA9IG51bGw7XG5sZXQgRHVwbGljYXRlRGlhbG9nID0gbnVsbDtcblxubGV0IEVsZWN0cm9uID0gbnVsbDtcbmxldCBQYXRoID0gbnVsbDtcbmxldCBGaWxlU3lzdGVtID0gbnVsbDtcbmxldCBRdWV1ZSA9IG51bGw7XG5sZXQgU3RvcmFnZSA9IG51bGw7XG5cbmNvbnN0IGF0b20gPSBnbG9iYWwuYXRvbTtcbmNvbnN0IGdldEljb25TZXJ2aWNlcyA9IHJlcXVpcmUoJy4vaGVscGVyL2ljb24uanMnKTtcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL2NvbmZpZy1zY2hlbWEuanNvbicpO1xuY29uc3Qgc2VydmVyX2NvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnL3NlcnZlci1zY2hlbWEuanNvbicpO1xuXG5jbGFzcyBGdHBSZW1vdGVFZGl0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaW5mbyA9IFtdO1xuICAgIHNlbGYuY29uZmlnID0gY29uZmlnO1xuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBzZWxmLnRyZWVWaWV3ID0gbnVsbDtcbiAgICBzZWxmLnByb3RvY29sVmlldyA9IG51bGw7XG4gICAgc2VsZi5jb25maWd1cmF0aW9uVmlldyA9IG51bGw7XG4gICAgc2VsZi5maW5kZXJWaWV3ID0gbnVsbDtcbiAgICBzZWxmLmxvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dG9nZ2xlJzogKCkgPT4gc2VsZi50b2dnbGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dG9nZ2xlLWZvY3VzJzogKCkgPT4gc2VsZi50b2dnbGVGb2N1cygpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpzaG93JzogKCkgPT4gc2VsZi5zaG93KCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmhpZGUnOiAoKSA9PiBzZWxmLmhpZGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dW5mb2N1cyc6ICgpID0+IHNlbGYudW5mb2N1cygpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDplZGl0LXNlcnZlcnMnOiAoKSA9PiBzZWxmLmNvbmZpZ3VyYXRpb24oKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y2hhbmdlLXBhc3N3b3JkJzogKCkgPT4gc2VsZi5jaGFuZ2VQYXNzd29yZCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpvcGVuLWZpbGUnOiAoKSA9PiBzZWxmLm9wZW4oKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6b3Blbi1maWxlLXBlbmRpbmcnOiAoKSA9PiBzZWxmLm9wZW4odHJ1ZSksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0Om5ldy1maWxlJzogKCkgPT4gc2VsZi5jcmVhdGUoJ2ZpbGUnKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6bmV3LWRpcmVjdG9yeSc6ICgpID0+IHNlbGYuY3JlYXRlKCdkaXJlY3RvcnknKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZHVwbGljYXRlJzogKCkgPT4gc2VsZi5kdXBsaWNhdGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZGVsZXRlJzogKCkgPT4gc2VsZi5kZWxldGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6cmVuYW1lJzogKCkgPT4gc2VsZi5yZW5hbWUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y29weSc6ICgpID0+IHNlbGYuY29weSgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpjdXQnOiAoKSA9PiBzZWxmLmN1dCgpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpwYXN0ZSc6ICgpID0+IHNlbGYucGFzdGUoKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6Y2htb2QnOiAoKSA9PiBzZWxmLmNobW9kKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnVwbG9hZC1maWxlJzogKCkgPT4gc2VsZi51cGxvYWQoJ2ZpbGUnKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6dXBsb2FkLWRpcmVjdG9yeSc6ICgpID0+IHNlbGYudXBsb2FkKCdkaXJlY3RvcnknKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6ZG93bmxvYWQnOiAoKSA9PiBzZWxmLmRvd25sb2FkKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnJlbG9hZCc6ICgpID0+IHNlbGYucmVsb2FkKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmZpbmQtcmVtb3RlLXBhdGgnOiAoKSA9PiBzZWxmLmZpbmRSZW1vdGVQYXRoKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmNvcHktcmVtb3RlLXBhdGgnOiAoKSA9PiBzZWxmLmNvcHlSZW1vdGVQYXRoKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OmZpbmRlcic6ICgpID0+IHNlbGYucmVtb3RlUGF0aEZpbmRlcigpLFxuICAgICAgJ2Z0cC1yZW1vdGUtZWRpdDpmaW5kZXItcmVpbmRleC1jYWNoZSc6ICgpID0+IHNlbGYucmVtb3RlUGF0aEZpbmRlcih0cnVlKSxcbiAgICAgICdmdHAtcmVtb3RlLWVkaXQ6YWRkLXRlbXAtc2VydmVyJzogKCkgPT4gc2VsZi5hZGRUZW1wU2VydmVyKCksXG4gICAgICAnZnRwLXJlbW90ZS1lZGl0OnJlbW92ZS10ZW1wLXNlcnZlcic6ICgpID0+IHNlbGYucmVtb3ZlVGVtcFNlcnZlcigpLFxuICAgIH0pKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UoKGFjdGl2YXRlUGFja2FnZSkgPT4ge1xuICAgICAgaWYgKGFjdGl2YXRlUGFja2FnZS5uYW1lID09ICdmdHAtcmVtb3RlLWVkaXQnKSB7XG4gICAgICAgIC8vIFJlbW92ZSBvYnNvbGV0ZSBlbnRyaWVzIGZyb20gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV0IHBhY2thZ2VWZXJzaW9uID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdmdHAtcmVtb3RlLWVkaXQnKS5tZXRhZGF0YS52ZXJzaW9uO1xuICAgICAgICBpZiAoY29tcGFyZVZlcnNpb25zKHBhY2thZ2VWZXJzaW9uLCAnMC4xNy4xJykgPj0gMCkge1xuICAgICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zaG93SW5Eb2NrJyk7XG4gICAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLnNob3dIaWRkZW5GaWxlcycpO1xuICAgICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5zaG93T25SaWdodFNpZGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluaXQgcGFja2FnZSB3aGVuIGxhenkgbG9hZGluZyBpcyBkaXNhYmxlZFxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQuZGV2LmRpc2FibGVMYXp5TG9hZGluZycpKSB7XG4gICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcGVuIHRoZSB2aWV3IGF1dG9tYXRpY2FsbHkgd2hlbiBhdG9tIHN0YXJ0c1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS50b2dnbGVPblN0YXJ0dXAnKSkge1xuICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYubG9hZGVkKSB7XG4gICAgICBzZWxmLmxvYWRlZCA9IHRydWU7XG5cbiAgICAgIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMDtcblxuICAgICAgQ29uZmlndXJhdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24tdmlldycpO1xuICAgICAgUGVybWlzc2lvbnNWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9wZXJtaXNzaW9ucy12aWV3Jyk7XG4gICAgICBUcmVlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvdHJlZS12aWV3Jyk7XG4gICAgICBQcm90b2NvbFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Byb3RvY29sLXZpZXcnKTtcbiAgICAgIEZpbmRlclZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2ZpbmRlci12aWV3Jyk7XG5cbiAgICAgIENoYW5nZVBhc3NEaWFsb2cgPSByZXF1aXJlKCcuL2RpYWxvZ3MvY2hhbmdlLXBhc3MtZGlhbG9nJyk7XG4gICAgICBQcm9tcHRQYXNzRGlhbG9nID0gcmVxdWlyZSgnLi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZycpO1xuICAgICAgQWRkRGlhbG9nID0gcmVxdWlyZSgnLi9kaWFsb2dzL2FkZC1kaWFsb2cnKTtcbiAgICAgIFJlbmFtZURpYWxvZyA9IHJlcXVpcmUoJy4vZGlhbG9ncy9yZW5hbWUtZGlhbG9nJyk7XG4gICAgICBGaW5kRGlhbG9nID0gcmVxdWlyZSgnLi9kaWFsb2dzL2ZpbmQtZGlhbG9nJyk7XG4gICAgICBEdXBsaWNhdGVEaWFsb2cgPSByZXF1aXJlKCcuL2RpYWxvZ3MvZHVwbGljYXRlLWRpYWxvZycpO1xuXG4gICAgICBFbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7XG4gICAgICBQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgRmlsZVN5c3RlbSA9IHJlcXVpcmUoJ2ZzLXBsdXMnKTtcbiAgICAgIFF1ZXVlID0gcmVxdWlyZSgnLi9oZWxwZXIvcXVldWUuanMnKTtcbiAgICAgIFN0b3JhZ2UgPSByZXF1aXJlKCcuL2hlbHBlci9zdG9yYWdlLmpzJyk7XG5cbiAgICAgIC8vIEV2ZW50c1xuICAgICAgLy8gQ29uZmlnIGNoYW5nZVxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2Z0cC1yZW1vdGUtZWRpdC5jb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGlmIChTdG9yYWdlLmdldFBhc3N3b3JkKCkpIHtcbiAgICAgICAgICBTdG9yYWdlLmxvYWQodHJ1ZSk7XG4gICAgICAgICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkucmVsb2FkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEcmFnICYgRHJvcFxuICAgICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkub24oJ2Ryb3AnLCAoZSkgPT4ge1xuICAgICAgICBzZWxmLmRyb3AoZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQXV0byBSZXZlYWwgQWN0aXZlIEZpbGVcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgc2VsZi5hdXRvUmV2ZWFsQWN0aXZlRmlsZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFdvcmthcm91bmQgdG8gYWN0aXZhdGUgY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMgaWYgZnRwLXJlbW90ZS1lZGl0LnRyZWUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zIGlzIGFjdGl2YXRlZFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycsICh7IG5ld1ZhbHVlLCBvbGRWYWx1ZSB9KSA9PiB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0cnVlICYmICFhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykpIHtcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQudHJlZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJywgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gSW5pdCBwcm90b2NvbGwgdmlld1xuICAgICAgc2VsZi5nZXRQcm90b2NvbFZpZXdJbnN0YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5zdWJzY3JpcHRpb25zKSB7XG4gICAgICBzZWxmLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50cmVlVmlldykge1xuICAgICAgc2VsZi50cmVlVmlldy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYucHJvdG9jb2xWaWV3KSB7XG4gICAgICBzZWxmLnByb3RvY29sVmlldy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuY29uZmlndXJhdGlvblZpZXcpIHtcbiAgICAgIHNlbGYuY29uZmlndXJhdGlvblZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGlmIChzZWxmLmZpbmRlclZpZXcpIHtcbiAgICAgIGZpbmRlclZpZXcuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBoYW5kbGVVUkkocGFyc2VkVXJpKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgcmVnZXggPSAvKFxcLyk/KFthLXowLTlfXFwtXXsxLDV9OlxcL1xcLykoKFteOl17MSx9KSgoOiguezEsfSkpP1tcXEBcXHg0MF0pKT8oW2EtejAtOV9cXC0uXSspKDooWzAtOV0qKSk/KC4qKS9naTtcbiAgICBsZXQgaXNfbWF0Y2hlZCA9IHBhcnNlZFVyaS5wYXRoLm1hdGNoKHJlZ2V4KTtcblxuICAgIGlmIChpc19tYXRjaGVkKSB7XG5cbiAgICAgIGlmICghc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgIH1cblxuICAgICAgbGV0IG1hdGNoZWQgPSByZWdleC5leGVjKHBhcnNlZFVyaS5wYXRoKTtcblxuICAgICAgbGV0IHByb3RvY29sID0gbWF0Y2hlZFsyXTtcbiAgICAgIGxldCB1c2VybmFtZSA9IChtYXRjaGVkWzRdICE9PSB1bmRlZmluZWQpID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZWRbNF0pIDogJyc7XG4gICAgICBsZXQgcGFzc3dvcmQgPSAobWF0Y2hlZFs3XSAhPT0gdW5kZWZpbmVkKSA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVkWzddKSA6ICcnO1xuICAgICAgbGV0IGhvc3QgPSAobWF0Y2hlZFs4XSAhPT0gdW5kZWZpbmVkKSA/IG1hdGNoZWRbOF0gOiAnJztcbiAgICAgIGxldCBwb3J0ID0gKG1hdGNoZWRbMTBdICE9PSB1bmRlZmluZWQpID8gbWF0Y2hlZFsxMF0gOiAnJztcbiAgICAgIGxldCBwYXRoID0gKG1hdGNoZWRbMTFdICE9PSB1bmRlZmluZWQpID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZWRbMTFdKSA6IFwiL1wiO1xuXG4gICAgICBsZXQgbmV3Y29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZXJ2ZXJfY29uZmlnKSk7XG4gICAgICBuZXdjb25maWcubmFtZSA9ICh1c2VybmFtZSkgPyBwcm90b2NvbCArIHVzZXJuYW1lICsgJ0AnICsgaG9zdCA6IHByb3RvY29sICsgaG9zdDtcbiAgICAgIG5ld2NvbmZpZy5ob3N0ID0gaG9zdDtcbiAgICAgIG5ld2NvbmZpZy5wb3J0ID0gKHBvcnQpID8gcG9ydCA6ICgocHJvdG9jb2wgPT0gJ3NmdHA6Ly8nKSA/ICcyMicgOiAnMjEnKTtcbiAgICAgIG5ld2NvbmZpZy51c2VyID0gdXNlcm5hbWU7XG4gICAgICBuZXdjb25maWcucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICAgIG5ld2NvbmZpZy5zZnRwID0gKHByb3RvY29sID09ICdzZnRwOi8vJyk7XG4gICAgICBuZXdjb25maWcucmVtb3RlID0gcGF0aDtcbiAgICAgIG5ld2NvbmZpZy50ZW1wID0gdHJ1ZTtcblxuICAgICAgbG9nRGVidWcoXCJBZGRpbmcgbmV3IHNlcnZlciBieSB1cmkgaGFuZGxlclwiLCBuZXdjb25maWcpO1xuXG4gICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5hZGRTZXJ2ZXIobmV3Y29uZmlnKTtcbiAgICB9XG4gIH1cblxuICBvcGVuUmVtb3RlRmlsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAoZmlsZSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGxldCByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICAgIGxldCBsb2NhbFBhdGggPSBub3JtYWxpemUocm9vdC5nZXRMb2NhbFBhdGgoKSk7XG4gICAgICBsb2NhbFBhdGggPSBub3JtYWxpemUoUGF0aC5qb2luKGxvY2FsUGF0aC5zbGljZSgwLCBsb2NhbFBhdGgubGFzdEluZGV4T2Yocm9vdC5nZXRQYXRoKCkpKSwgZmlsZSkucmVwbGFjZSgvXFwvKy9nLCBQYXRoLnNlcCksIFBhdGguc2VwKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGUgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5nZXRFbGVtZW50QnlMb2NhbFBhdGgobG9jYWxQYXRoLCByb290LCAnZmlsZScpO1xuICAgICAgICBzZWxmLm9wZW5GaWxlKGZpbGUpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgbG9nRGVidWcoZXgpXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRTZXJ2ZXJOYW1lKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmVqZWN0KCdub3NlcnZlcnMnKTtcblxuICAgICAgICBsZXQgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICAgIHJlc29sdmUocm9vdC5uYW1lKTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q3VycmVudFNlcnZlckNvbmZpZygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAocmVhc29uRm9yUmVxdWVzdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKCFyZWFzb25Gb3JSZXF1ZXN0KSB7XG4gICAgICAgICAgcmVqZWN0KCdub3JlYXNvbmdpdmVuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmVqZWN0KCdub3NlcnZlcnMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgICAgIHJlamVjdCgnbm9wYXNzd29yZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb290ID0gc2VsZWN0ZWQudmlldygpLmdldFJvb3QoKTtcbiAgICAgICAgbGV0IGJ1dHRvbmRpc21pc3MgPSBmYWxzZTtcblxuICAgICAgICBpZiAoaXNJbkJsYWNrTGlzdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHJlYXNvbkZvclJlcXVlc3QpKSB7XG4gICAgICAgICAgcmVqZWN0KCd1c2VyZGVjbGluZWQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5XaGl0ZUxpc3QoU3RvcmFnZS5nZXRQYXNzd29yZCgpLCByZWFzb25Gb3JSZXF1ZXN0KSkge1xuICAgICAgICAgIHJlc29sdmUocm9vdC5jb25maWcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYXV0aW9uID0gJ0RlY2xpbmUgdGhpcyBtZXNzYWdlIGlmIHlvdSBkaWQgbm90IGluaXRpYXRlIGEgcmVxdWVzdCB0byBzaGFyZSB5b3VyIHNlcnZlciBjb25maWd1cmF0aW9uIHdpdGggYSBwYWNha2dlISdcbiAgICAgICAgbGV0IG5vdGlmID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NlcnZlciBDb25maWd1cmF0aW9uIFJlcXVlc3RlZCcsIHtcbiAgICAgICAgICBkZXRhaWw6IHJlYXNvbkZvclJlcXVlc3QgKyAnXFxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbicgKyBjYXV0aW9uLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICB0ZXh0OiAnQWx3YXlzJyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnV0dG9uZGlzbWlzcyA9IHRydWU7XG4gICAgICAgICAgICAgIG5vdGlmLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgYWRkVG9XaGl0ZUxpc3QoU3RvcmFnZS5nZXRQYXNzd29yZCgpLCByZWFzb25Gb3JSZXF1ZXN0KTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyb290LmNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnQWNjZXB0JyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnV0dG9uZGlzbWlzcyA9IHRydWU7XG4gICAgICAgICAgICAgIG5vdGlmLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyb290LmNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnRGVjbGluZScsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1dHRvbmRpc21pc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBub3RpZi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIHJlamVjdCgndXNlcmRlY2xpbmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnTmV2ZXInLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBidXR0b25kaXNtaXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbm90aWYuZGlzbWlzcygpO1xuICAgICAgICAgICAgICBhZGRUb0JsYWNrTGlzdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIHJlYXNvbkZvclJlcXVlc3QpO1xuICAgICAgICAgICAgICByZWplY3QoJ3VzZXJkZWNsaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZGlzcG9zYWJsZSA9IG5vdGlmLm9uRGlkRGlzbWlzcygoKSA9PiB7XG4gICAgICAgICAgaWYgKCFidXR0b25kaXNtaXNzKSByZWplY3QoJ3VzZXJkZWNsaW5lZCcpO1xuICAgICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb25zdW1lRWxlbWVudEljb25zKHNlcnZpY2UpIHtcbiAgICBnZXRJY29uU2VydmljZXMoKS5zZXRFbGVtZW50SWNvbnMoc2VydmljZSk7XG5cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZ2V0SWNvblNlcnZpY2VzKCkucmVzZXRFbGVtZW50SWNvbnMoKTtcbiAgICB9KVxuICB9XG5cbiAgcHJvbXRQYXNzd29yZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgUHJvbXB0UGFzc0RpYWxvZygpO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBkaWFsb2cub24oJ2RpYWxvZy1kb25lJywgKGUsIHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIGlmIChjaGVja1Bhc3N3b3JkKHBhc3N3b3JkKSkge1xuICAgICAgICAgIFN0b3JhZ2Uuc2V0UGFzc3dvcmQocGFzc3dvcmQpO1xuICAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaWFsb2cuc2hvd0Vycm9yKCdXcm9uZyBwYXNzd29yZCwgdHJ5IGFnYWluIScpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBjaGFuZ2VQYXNzd29yZChtb2RlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBvcHRpb25zID0ge307XG4gICAgaWYgKG1vZGUgPT0gJ2FkZCcpIHtcbiAgICAgIG9wdGlvbnMubW9kZSA9ICdhZGQnO1xuICAgICAgb3B0aW9ucy5wcm9tcHQgPSAnRW50ZXIgdGhlIG1hc3RlciBwYXNzd29yZC4gQWxsIGluZm9ybWF0aW9uIGFib3V0IHlvdXIgc2VydmVyIHNldHRpbmdzIHdpbGwgYmUgZW5jcnlwdGVkIHdpdGggdGhpcyBwYXNzd29yZC4nO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLm1vZGUgPSAnY2hhbmdlJztcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgQ2hhbmdlUGFzc0RpYWxvZyhvcHRpb25zKTtcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGRpYWxvZy5vbignZGlhbG9nLWRvbmUnLCAoZSwgcGFzc3dvcmRzKSA9PiB7XG5cbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBwYXNzd29yZCBmcm9tIG5ldyBtYXN0ZXIgcGFzc3dvcmQgY2FuIGRlY3J5cHQgY3VycmVudCBjb25maWdcbiAgICAgICAgaWYgKG1vZGUgPT0gJ2FkZCcpIHtcbiAgICAgICAgICBsZXQgY29uZmlnSGFzaCA9IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmNvbmZpZycpO1xuICAgICAgICAgIGlmIChjb25maWdIYXNoKSB7XG4gICAgICAgICAgICBsZXQgbmV3UGFzc3dvcmQgPSBwYXNzd29yZHMubmV3UGFzc3dvcmQ7XG4gICAgICAgICAgICBsZXQgdGVzdENvbmZpZyA9IGRlY3J5cHQobmV3UGFzc3dvcmQsIGNvbmZpZ0hhc2gpO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBsZXQgdGVzdEpzb24gPSBKU09OLnBhcnNlKHRlc3RDb25maWcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAvLyBJZiBtYXN0ZXIgcGFzc3dvcmQgZG9lcyBub3QgZGVjcnlwdCBjdXJyZW50IGNvbmZpZyxcbiAgICAgICAgICAgICAgLy8gcHJvbXB0IHRoZSB1c2VyIHRvIHJlcGx5IHRvIGluc2VydCBjb3JyZWN0IHBhc3N3b3JkXG4gICAgICAgICAgICAgIC8vIG9yIHJlc2V0IGNvbmZpZyBjb250ZW50XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdNYXN0ZXIgcGFzc3dvcmQgZG9lcyBub3QgbWF0Y2ggd2l0aCBwcmV2aW91cyB1c2VkLiBQbGVhc2UgcmV0cnkgb3IgZGVsZXRlIFwiY29uZmlnXCIgZW50cnkgaW4gZnRwLXJlbW90ZS1lZGl0IGNvbmZpZ3VyYXRpb24gbm9kZS4nLCAnZXJyb3InKTtcblxuICAgICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb2xkUGFzc3dvcmRWYWx1ZSA9IChtb2RlID09ICdhZGQnKSA/IHBhc3N3b3Jkcy5uZXdQYXNzd29yZCA6IHBhc3N3b3Jkcy5vbGRQYXNzd29yZDtcblxuICAgICAgICBjaGFuZ2VQYXNzd29yZChvbGRQYXNzd29yZFZhbHVlLCBwYXNzd29yZHMubmV3UGFzc3dvcmQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIFN0b3JhZ2Uuc2V0UGFzc3dvcmQocGFzc3dvcmRzLm5ld1Bhc3N3b3JkKTtcblxuICAgICAgICAgIGlmIChtb2RlICE9ICdhZGQnKSB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZSgnTWFzdGVyIHBhc3N3b3JkIHN1Y2Nlc3NmdWxseSBjaGFuZ2VkLiBQbGVhc2UgcmVzdGFydCBhdG9tIScsICdzdWNjZXNzJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbml0KCk7XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgaWYgKCFjaGVja1Bhc3N3b3JkRXhpc3RzKCkpIHtcbiAgICAgICAgc2VsZi5jaGFuZ2VQYXNzd29yZCgnYWRkJykudGhlbigocmV0dXJuVmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAocmV0dXJuVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChTdG9yYWdlLmxvYWQoKSkge1xuICAgICAgICAgICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5wcm9tdFBhc3N3b3JkKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKFN0b3JhZ2UubG9hZCgpKSB7XG4gICAgICAgICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5yZWxvYWQoKTtcbiAgICAgICAgICAgIHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLnRvZ2dsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFTdG9yYWdlLmxvYWRlZCAmJiBTdG9yYWdlLmxvYWQoKSkge1xuICAgICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkucmVsb2FkKCk7XG4gICAgfVxuICAgIHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLnRvZ2dsZSgpO1xuICB9XG5cbiAgdG9nZ2xlRm9jdXMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkudG9nZ2xlRm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICB1bmZvY3VzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkudW5mb2N1cygpO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSB7XG4gICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmhpZGUoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyYXRpb24oKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgbGV0IHJvb3QgPSBudWxsO1xuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggIT09IDApIHtcbiAgICAgIHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuICAgIH07XG5cbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkge1xuICAgICAgc2VsZi5wcm9tdFBhc3N3b3JkKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmIChTdG9yYWdlLmxvYWQoKSkge1xuICAgICAgICAgIHNlbGYuZ2V0Q29uZmlndXJhdGlvblZpZXdJbnN0YW5jZSgpLnJlbG9hZChyb290KTtcbiAgICAgICAgICBzZWxmLmdldENvbmZpZ3VyYXRpb25WaWV3SW5zdGFuY2UoKS5hdHRhY2goKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5nZXRDb25maWd1cmF0aW9uVmlld0luc3RhbmNlKCkucmVsb2FkKHJvb3QpO1xuICAgIHNlbGYuZ2V0Q29uZmlndXJhdGlvblZpZXdJbnN0YW5jZSgpLmF0dGFjaCgpO1xuICB9XG5cbiAgYWRkVGVtcFNlcnZlcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBsZXQgcm9vdCA9IG51bGw7XG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcm9vdCA9IHNlbGVjdGVkLnZpZXcoKS5nZXRSb290KCk7XG4gICAgICByb290LmNvbmZpZy50ZW1wID0gZmFsc2U7XG4gICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5yZW1vdmVTZXJ2ZXIoc2VsZWN0ZWQudmlldygpKTtcbiAgICAgIFN0b3JhZ2UuYWRkU2VydmVyKHJvb3QuY29uZmlnKTtcbiAgICAgIFN0b3JhZ2Uuc2F2ZSgpO1xuICAgIH07XG4gIH1cblxuICByZW1vdmVUZW1wU2VydmVyKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggIT09IDApIHtcbiAgICAgIHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLnJlbW92ZVNlcnZlcihzZWxlY3RlZC52aWV3KCkpO1xuICAgIH07XG4gIH1cblxuICBvcGVuKHBlbmRpbmcgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgc2VsZi5vcGVuRmlsZShmaWxlLCBwZW5kaW5nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgICBzZWxmLm9wZW5EaXJlY3RvcnkoZGlyZWN0b3J5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuRmlsZShmaWxlLCBwZW5kaW5nID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBDaGVjayBpZiBmaWxlIGlzIGFscmVhZHkgb3BlbmVkIGluIHRleHRlZGl0b3JcbiAgICBpZiAoZ2V0VGV4dEVkaXRvcihmdWxsTG9jYWxQYXRoLCB0cnVlKSkge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmdWxsTG9jYWxQYXRoLCB7IHBlbmRpbmc6IHBlbmRpbmcsIHNlYXJjaEFsbFBhbmVzOiB0cnVlIH0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2VsZi5kb3dubG9hZEZpbGUoZmlsZS5nZXRSb290KCksIGZ1bGxSZWxhdGl2ZVBhdGgsIGZ1bGxMb2NhbFBhdGgsIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgIC8vIE9wZW4gZmlsZSBhbmQgYWRkIGhhbmRsZXIgdG8gZWRpdG9yIHRvIHVwbG9hZCBmaWxlIG9uIHNhdmVcbiAgICAgIHJldHVybiBzZWxmLm9wZW5GaWxlSW5FZGl0b3IoZmlsZSwgcGVuZGluZyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9wZW5EaXJlY3RvcnkoZGlyZWN0b3J5KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBkaXJlY3RvcnkuZXhwYW5kKCk7XG4gIH1cblxuICBjcmVhdGUodHlwZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKS5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICBpZiAodHlwZSA9PSAnZmlsZScpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IEFkZERpYWxvZyhkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSksIHRydWUpO1xuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuY3JlYXRlRmlsZShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IEFkZERpYWxvZyhkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSksIGZhbHNlKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmNyZWF0ZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRmlsZShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBjcmVhdGUgbG9jYWwgZmlsZVxuICAgICAgaWYgKCFGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZnVsbExvY2FsUGF0aCkpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGxvY2FsIERpcmVjdG9yeVxuICAgICAgICBjcmVhdGVMb2NhbFBhdGgoZnVsbExvY2FsUGF0aCk7XG4gICAgICAgIEZpbGVTeXN0ZW0ud3JpdGVGaWxlU3luYyhmdWxsTG9jYWxQYXRoLCAnJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5leGlzdHNGaWxlKGZ1bGxSZWxhdGl2ZVBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgJyArIHJlbGF0aXZlUGF0aC50cmltKCkgKyAnIGFscmVhZHkgZXhpc3RzJywgJ2Vycm9yJyk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VsZi51cGxvYWRGaWxlKGRpcmVjdG9yeSwgZnVsbExvY2FsUGF0aCwgZnVsbFJlbGF0aXZlUGF0aCwgZmFsc2UpLnRoZW4oKGR1cGxpY2F0ZWRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChkdXBsaWNhdGVkRmlsZSkge1xuICAgICAgICAgIC8vIE9wZW4gZmlsZSBhbmQgYWRkIGhhbmRsZXIgdG8gZWRpdG9yIHRvIHVwbG9hZCBmaWxlIG9uIHNhdmVcbiAgICAgICAgICByZXR1cm4gc2VsZi5vcGVuRmlsZUluRWRpdG9yKGR1cGxpY2F0ZWRGaWxlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJlbGF0aXZlUGF0aCA9IHRyYWlsaW5nc2xhc2hpdChyZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0TG9jYWxQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBjcmVhdGUgbG9jYWwgZGlyZWN0b3J5XG4gICAgdHJ5IHtcbiAgICAgIGlmICghRmlsZVN5c3RlbS5leGlzdHNTeW5jKGZ1bGxMb2NhbFBhdGgpKSB7XG4gICAgICAgIGNyZWF0ZUxvY2FsUGF0aChmdWxsTG9jYWxQYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHsgfVxuXG4gICAgZGlyZWN0b3J5LmdldENvbm5lY3RvcigpLmV4aXN0c0RpcmVjdG9yeShmdWxsUmVsYXRpdmVQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgJyArIHJlbGF0aXZlUGF0aC50cmltKCkgKyAnIGFscmVhZHkgZXhpc3RzJywgJ2Vycm9yJyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5jcmVhdGVEaXJlY3RvcnkoZnVsbFJlbGF0aXZlUGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuYWRkRGlyZWN0b3J5KGRpcmVjdG9yeS5nZXRSb290KCksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgIGlmIChlbGVtZW50LmlzVmlzaWJsZSgpKSB7XG4gICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmFtZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBSZW5hbWVEaWFsb2coZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSwgdHJ1ZSk7XG4gICAgICAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgcmVsYXRpdmVQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgc2VsZi5yZW5hbWVGaWxlKGZpbGUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IFJlbmFtZURpYWxvZyh0cmFpbGluZ3NsYXNoaXQoZGlyZWN0b3J5LmdldFBhdGgoZmFsc2UpKSwgZmFsc2UpO1xuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIHJlbGF0aXZlUGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYucmVuYW1lRGlyZWN0b3J5KGRpcmVjdG9yeSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW5hbWVGaWxlKGZpbGUsIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFJvb3QoKS5nZXRQYXRoKHRydWUpICsgcmVsYXRpdmVQYXRoKTtcbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0Um9vdCgpLmdldExvY2FsUGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCwgUGF0aC5zZXApO1xuXG4gICAgZmlsZS5nZXRDb25uZWN0b3IoKS5yZW5hbWUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBmdWxsUmVsYXRpdmVQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgIGZpbGUuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkucmVuYW1lRmlsZShub3JtYWxpemUoZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSksIG5vcm1hbGl6ZShyZWxhdGl2ZVBhdGgpLCBmaWxlLnNpemUpO1xuXG4gICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5hZGRGaWxlKGZpbGUuZ2V0Um9vdCgpLCByZWxhdGl2ZVBhdGgsIHsgc2l6ZTogZmlsZS5zaXplLCByaWdodHM6IGZpbGUucmlnaHRzIH0pO1xuICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgICBsZXQgZm91bmQgPSBnZXRUZXh0RWRpdG9yKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIGZvdW5kLnNhdmVPYmplY3QgPSBlbGVtZW50O1xuICAgICAgICBmb3VuZC5zYXZlQXMoZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlbGVtZW50Lm5hbWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBNb3ZlIGxvY2FsIGZpbGVcbiAgICAgIG1vdmVMb2NhbFBhdGgoZmlsZS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIGZ1bGxMb2NhbFBhdGgpO1xuXG4gICAgICAvLyBSZW1vdmUgb2xkIGZpbGUgZnJvbSB0cmVlXG4gICAgICBpZiAoZmlsZSkgZmlsZS5yZW1vdmUoKVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmFtZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmVsYXRpdmVQYXRoID0gdHJhaWxpbmdzbGFzaGl0KHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5yZW5hbWUoZGlyZWN0b3J5LmdldFBhdGgoKSwgZnVsbFJlbGF0aXZlUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICBkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkucmVuYW1lRGlyZWN0b3J5KG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpLCBub3JtYWxpemUocmVsYXRpdmVQYXRoICsgJy8nKSk7XG5cbiAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICBsZXQgZWxlbWVudCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmFkZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0Um9vdCgpLCByZWxhdGl2ZVBhdGgsIHsgcmlnaHRzOiBkaXJlY3RvcnkucmlnaHRzIH0pO1xuICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ET1xuICAgICAgLy8gQ2hlY2sgaWYgZmlsZXMgYXJlIGFscmVhZHkgb3BlbmVkIGluIHRleHRlZGl0b3JcblxuICAgICAgLy8gTW92ZSBsb2NhbCBkaXJlY3RvcnlcbiAgICAgIG1vdmVMb2NhbFBhdGgoZGlyZWN0b3J5LmdldExvY2FsUGF0aCh0cnVlKSwgZnVsbExvY2FsUGF0aCk7XG5cbiAgICAgIC8vIFJlbW92ZSBvbGQgZGlyZWN0b3J5IGZyb20gdHJlZVxuICAgICAgaWYgKGRpcmVjdG9yeSkgZGlyZWN0b3J5LnJlbW92ZSgpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgZHVwbGljYXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IER1cGxpY2F0ZURpYWxvZyhmaWxlLmdldFBhdGgoZmFsc2UpICsgZmlsZS5uYW1lKTtcbiAgICAgICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGUoZmlsZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRpYWxvZy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICAvLyBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgLy8gaWYgKGRpcmVjdG9yeSkge1xuICAgICAgLy8gICBjb25zdCBkaWFsb2cgPSBuZXcgRHVwbGljYXRlRGlhbG9nKHRyYWlsaW5nc2xhc2hpdChkaXJlY3RvcnkuZ2V0UGF0aChmYWxzZSkpKTtcbiAgICAgIC8vICAgZGlhbG9nLm9uKCduZXctcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgIC8vICAgICBpZiAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAvLyAgICAgICBzZWxmLmR1cGxpY2F0ZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCk7XG4gICAgICAvLyAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICAvLyB9XG4gICAgfVxuICB9XG5cbiAgZHVwbGljYXRlRmlsZShmaWxlLCByZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGZ1bGxSZWxhdGl2ZVBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRSb290KCkuZ2V0UGF0aCh0cnVlKSArIHJlbGF0aXZlUGF0aCk7XG4gICAgY29uc3QgZnVsbExvY2FsUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIGZpbGUuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRmlsZShmdWxsUmVsYXRpdmVQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKCdGaWxlICcgKyByZWxhdGl2ZVBhdGgudHJpbSgpICsgJyBhbHJlYWR5IGV4aXN0cycsICdlcnJvcicpO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHNlbGYuZG93bmxvYWRGaWxlKGZpbGUuZ2V0Um9vdCgpLCBmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIGZ1bGxMb2NhbFBhdGgsIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgc2VsZi51cGxvYWRGaWxlKGZpbGUuZ2V0Um9vdCgpLCBmdWxsTG9jYWxQYXRoLCBmdWxsUmVsYXRpdmVQYXRoKS50aGVuKChkdXBsaWNhdGVkRmlsZSkgPT4ge1xuICAgICAgICAgIGlmIChkdXBsaWNhdGVkRmlsZSkge1xuICAgICAgICAgICAgLy8gT3BlbiBmaWxlIGFuZCBhZGQgaGFuZGxlciB0byBlZGl0b3IgdG8gdXBsb2FkIGZpbGUgb24gc2F2ZVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub3BlbkZpbGVJbkVkaXRvcihkdXBsaWNhdGVkRmlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGR1cGxpY2F0ZURpcmVjdG9yeShkaXJlY3RvcnksIHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShkaXJlY3RvcnkuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFJvb3QoKS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyByZWxhdGl2ZVBhdGgsIFBhdGguc2VwKTtcblxuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmaWxlPycsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIllvdSBhcmUgZGVsZXRpbmc6XFxuXCIgKyBmaWxlLmdldFBhdGgoZmFsc2UpICsgZmlsZS5uYW1lLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIFllczogKCkgPT4ge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgbGV0IGRpcmVjdG9yeSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChkaXJlY3RvcnkpIHtcbiAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGZvbGRlcj8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIGRlbGV0aW5nOlxcblwiICsgdHJhaWxpbmdzbGFzaGl0KGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlRmlsZShmaWxlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gbm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCk7XG5cbiAgICBmaWxlLmdldENvbm5lY3RvcigpLmRlbGV0ZUZpbGUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgIGZpbGUuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuZGVsZXRlRmlsZShub3JtYWxpemUoZmlsZS5nZXRQYXRoKGZhbHNlKSArIGZpbGUubmFtZSkpO1xuXG4gICAgICAvLyBEZWxldGUgbG9jYWwgZmlsZVxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKEZpbGVTeXN0ZW0uZXhpc3RzU3luYyhmdWxsTG9jYWxQYXRoKSkge1xuICAgICAgICAgIEZpbGVTeXN0ZW0udW5saW5rU3luYyhmdWxsTG9jYWxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7IH1cblxuICAgICAgZmlsZS5wYXJlbnQuc2VsZWN0KCk7XG4gICAgICBmaWxlLmRlc3Ryb3koKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGVEaXJlY3RvcnkoZGlyZWN0b3J5LCByZWN1cnNpdmUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5kZWxldGVEaXJlY3RvcnkoZGlyZWN0b3J5LmdldFBhdGgoKSwgcmVjdXJzaXZlKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFJlZnJlc2ggY2FjaGVcbiAgICAgIGRpcmVjdG9yeS5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5kZWxldGVEaXJlY3Rvcnkobm9ybWFsaXplKGRpcmVjdG9yeS5nZXRQYXRoKGZhbHNlKSkpO1xuXG4gICAgICBjb25zdCBmdWxsTG9jYWxQYXRoID0gKGRpcmVjdG9yeS5nZXRMb2NhbFBhdGgodHJ1ZSkpLnJlcGxhY2UoL1xcLysvZywgUGF0aC5zZXApO1xuXG4gICAgICAvLyBEZWxldGUgbG9jYWwgZGlyZWN0b3J5XG4gICAgICBkZWxldGVMb2NhbFBhdGgoZnVsbExvY2FsUGF0aCk7XG5cbiAgICAgIGRpcmVjdG9yeS5wYXJlbnQuc2VsZWN0KCk7XG4gICAgICBkaXJlY3RvcnkuZGVzdHJveSgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGlmIChzZWxlY3RlZC52aWV3KCkuaXMoJy5maWxlJykpIHtcbiAgICAgIGxldCBmaWxlID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgY29uc3QgcGVybWlzc2lvbnNWaWV3ID0gbmV3IFBlcm1pc3Npb25zVmlldyhmaWxlKTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3Lm9uKCdjaGFuZ2UtcGVybWlzc2lvbnMnLCAoZSwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgc2VsZi5jaG1vZEZpbGUoZmlsZSwgcmVzdWx0LnBlcm1pc3Npb25zKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBlcm1pc3Npb25zVmlldy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1ZpZXcgPSBuZXcgUGVybWlzc2lvbnNWaWV3KGRpcmVjdG9yeSk7XG4gICAgICAgIHBlcm1pc3Npb25zVmlldy5vbignY2hhbmdlLXBlcm1pc3Npb25zJywgKGUsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHNlbGYuY2htb2REaXJlY3RvcnkoZGlyZWN0b3J5LCByZXN1bHQucGVybWlzc2lvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGVybWlzc2lvbnNWaWV3LmF0dGFjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNobW9kRmlsZShmaWxlLCBwZXJtaXNzaW9ucykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZmlsZS5nZXRDb25uZWN0b3IoKS5jaG1vZEZpbGUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBwZXJtaXNzaW9ucykudGhlbigocmVzcG9uc2VUZXh0KSA9PiB7XG4gICAgICBmaWxlLnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMocGVybWlzc2lvbnMpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kRGlyZWN0b3J5KGRpcmVjdG9yeSwgcGVybWlzc2lvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5nZXRDb25uZWN0b3IoKS5jaG1vZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0UGF0aCh0cnVlKSwgcGVybWlzc2lvbnMpLnRoZW4oKHJlc3BvbnNlVGV4dCkgPT4ge1xuICAgICAgZGlyZWN0b3J5LnJpZ2h0cyA9IHBlcm1pc3Npb25zVG9SaWdodHMocGVybWlzc2lvbnMpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbG9hZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIHNlbGYucmVsb2FkRmlsZShmaWxlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkLnZpZXcoKS5pcygnLmRpcmVjdG9yeScpIHx8IHNlbGVjdGVkLnZpZXcoKS5pcygnLnNlcnZlcicpKSB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gc2VsZWN0ZWQudmlldygpO1xuICAgICAgaWYgKGRpcmVjdG9yeSkge1xuICAgICAgICBzZWxmLnJlbG9hZERpcmVjdG9yeShkaXJlY3RvcnkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbG9hZEZpbGUoZmlsZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZnVsbFJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShmaWxlLmdldFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUpO1xuICAgIGNvbnN0IGZ1bGxMb2NhbFBhdGggPSBub3JtYWxpemUoZmlsZS5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBmaWxlLm5hbWUsIFBhdGguc2VwKTtcblxuICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBvcGVuZWQgaW4gdGV4dGVkaXRvclxuICAgIGlmIChnZXRUZXh0RWRpdG9yKGZ1bGxMb2NhbFBhdGgsIHRydWUpKSB7XG4gICAgICBzZWxmLmRvd25sb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgZnVsbFJlbGF0aXZlUGF0aCwgZnVsbExvY2FsUGF0aCwgeyBmaWxlc2l6ZTogZmlsZS5zaXplIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbG9hZERpcmVjdG9yeShkaXJlY3RvcnkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRpcmVjdG9yeS5leHBhbmRlZCA9IGZhbHNlO1xuICAgIGRpcmVjdG9yeS5leHBhbmQoKTtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZWxlbWVudC5pcygnLmZpbGUnKSkge1xuICAgICAgbGV0IHN0b3JhZ2UgPSBlbGVtZW50LnNlcmlhbGl6ZSgpO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJylcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZVsnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJ10gPSBlbmNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZSkpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICAvLyBUT0RPXG4gICAgfVxuICB9XG5cbiAgY3V0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBpZiAoIVN0b3JhZ2UuaGFzUGFzc3dvcmQoKSkgcmV0dXJuO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3RlZC52aWV3KCk7XG5cbiAgICBpZiAoZWxlbWVudC5pcygnLmZpbGUnKSB8fCBlbGVtZW50LmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBzdG9yYWdlID0gZWxlbWVudC5zZXJpYWxpemUoKTtcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnKVxuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCddID0gZW5jcnlwdChTdG9yYWdlLmdldFBhc3N3b3JkKCksIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKTtcbiAgICB9XG4gIH1cblxuICBwYXN0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYgKCFTdG9yYWdlLmhhc1Bhc3N3b3JkKCkpIHJldHVybjtcblxuICAgIGxldCBkZXN0T2JqZWN0ID0gc2VsZWN0ZWQudmlldygpO1xuICAgIGlmIChkZXN0T2JqZWN0LmlzKCcuZmlsZScpKSB7XG4gICAgICBkZXN0T2JqZWN0ID0gZGVzdE9iamVjdC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgbGV0IGRhdGFPYmplY3QgPSBudWxsO1xuICAgIGxldCBzcmNPYmplY3QgPSBudWxsO1xuICAgIGxldCBoYW5kbGVFdmVudCA9IG51bGw7XG5cbiAgICBsZXQgc3JjVHlwZSA9IG51bGw7XG4gICAgbGV0IHNyY1BhdGggPSBudWxsO1xuICAgIGxldCBkZXN0UGF0aCA9IG51bGw7XG5cbiAgICAvLyBQYXJzZSBkYXRhIGZyb20gY29weS9jdXQvZHJhZyBldmVudFxuICAgIGlmICh3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJ10pIHtcbiAgICAgIC8vIEN1dCBldmVudCBmcm9tIEF0b21cbiAgICAgIGhhbmRsZUV2ZW50ID0gXCJjdXRcIjtcblxuICAgICAgbGV0IGN1dE9iamVjdFN0cmluZyA9IGRlY3J5cHQoU3RvcmFnZS5nZXRQYXNzd29yZCgpLCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJ10pO1xuICAgICAgZGF0YU9iamVjdCA9IChjdXRPYmplY3RTdHJpbmcpID8gSlNPTi5wYXJzZShjdXRPYmplY3RTdHJpbmcpIDogbnVsbDtcblxuICAgICAgbGV0IGZpbmQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJyMnICsgZGF0YU9iamVjdC5pZCk7XG4gICAgICBpZiAoIWZpbmQpIHJldHVybjtcblxuICAgICAgc3JjT2JqZWN0ID0gZmluZC52aWV3KCk7XG4gICAgICBpZiAoIXNyY09iamVjdCkgcmV0dXJuO1xuXG4gICAgICBpZiAoc3JjT2JqZWN0LmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgICAgc3JjVHlwZSA9ICdkaXJlY3RvcnknO1xuICAgICAgICBzcmNQYXRoID0gc3JjT2JqZWN0LmdldFBhdGgodHJ1ZSk7XG4gICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgc3JjT2JqZWN0Lm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcmNUeXBlID0gJ2ZpbGUnO1xuICAgICAgICBzcmNQYXRoID0gc3JjT2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgICAgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgY29weS9jdXQgb3BlcmF0aW9uIHNob3VsZCBiZSBwZXJmb3JtZWQgb24gdGhlIHNhbWUgc2VydmVyXG4gICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoZGVzdE9iamVjdC5jb25maWcpICE9IEpTT04uc3RyaW5naWZ5KHNyY09iamVjdC5jb25maWcpKSByZXR1cm47XG5cbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdmdHAtcmVtb3RlLWVkaXQ6Y3V0UGF0aCcpO1xuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjb3B5UGF0aCcpO1xuICAgIH0gZWxzZSBpZiAod2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnXSkge1xuICAgICAgLy8gQ29weSBldmVudCBmcm9tIEF0b21cbiAgICAgIGhhbmRsZUV2ZW50ID0gXCJjb3B5XCI7XG5cbiAgICAgIGxldCBjb3BpZWRPYmplY3RTdHJpbmcgPSBkZWNyeXB0KFN0b3JhZ2UuZ2V0UGFzc3dvcmQoKSwgd2luZG93LnNlc3Npb25TdG9yYWdlWydmdHAtcmVtb3RlLWVkaXQ6Y29weVBhdGgnXSk7XG4gICAgICBkYXRhT2JqZWN0ID0gKGNvcGllZE9iamVjdFN0cmluZykgPyBKU09OLnBhcnNlKGNvcGllZE9iamVjdFN0cmluZykgOiBudWxsO1xuXG4gICAgICBsZXQgZmluZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnIycgKyBkYXRhT2JqZWN0LmlkKTtcbiAgICAgIGlmICghZmluZCkgcmV0dXJuO1xuXG4gICAgICBzcmNPYmplY3QgPSBmaW5kLnZpZXcoKTtcbiAgICAgIGlmICghc3JjT2JqZWN0KSByZXR1cm47XG5cbiAgICAgIGlmIChzcmNPYmplY3QuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgICBzcmNUeXBlID0gJ2RpcmVjdG9yeSc7XG4gICAgICAgIHNyY1BhdGggPSBzcmNPYmplY3QuZ2V0UGF0aCh0cnVlKTtcbiAgICAgICAgZGVzdFBhdGggPSBkZXN0T2JqZWN0LmdldFBhdGgodHJ1ZSkgKyBzcmNPYmplY3QubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNyY1R5cGUgPSAnZmlsZSc7XG4gICAgICAgIHNyY1BhdGggPSBzcmNPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIHNyY09iamVjdC5uYW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiBjb3B5L2N1dCBvcGVyYXRpb24gc2hvdWxkIGJlIHBlcmZvcm1lZCBvbiB0aGUgc2FtZSBzZXJ2ZXJcbiAgICAgIGlmIChKU09OLnN0cmluZ2lmeShkZXN0T2JqZWN0LmNvbmZpZykgIT0gSlNPTi5zdHJpbmdpZnkoc3JjT2JqZWN0LmNvbmZpZykpIHJldHVybjtcblxuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Z0cC1yZW1vdGUtZWRpdDpjdXRQYXRoJyk7XG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZnRwLXJlbW90ZS1lZGl0OmNvcHlQYXRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGFuZGxlRXZlbnQgPT0gXCJjdXRcIikge1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2RpcmVjdG9yeScpIHNlbGYubW92ZURpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2ZpbGUnKSBzZWxmLm1vdmVGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVFdmVudCA9PSBcImNvcHlcIikge1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2RpcmVjdG9yeScpIHNlbGYuY29weURpcmVjdG9yeShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgaWYgKHNyY1R5cGUgPT0gJ2ZpbGUnKSBzZWxmLmNvcHlGaWxlKGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCwgeyBmaWxlc2l6ZTogc3JjT2JqZWN0LnNpemUgfSk7XG4gICAgfVxuICB9XG5cbiAgZHJvcChlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVzdE9iamVjdCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZGVzdE9iamVjdC5pcygnLmZpbGUnKSkge1xuICAgICAgZGVzdE9iamVjdCA9IGRlc3RPYmplY3QucGFyZW50O1xuICAgIH1cblxuICAgIGxldCBpbml0aWFsUGF0aCwgaW5pdGlhbE5hbWUsIGluaXRpYWxUeXBlLCByZWY7XG4gICAgaWYgKGVudHJ5ID0gZS50YXJnZXQuY2xvc2VzdCgnLmVudHJ5JykpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmICghZGVzdE9iamVjdC5pcygnLmRpcmVjdG9yeScpICYmICFkZXN0T2JqZWN0LmlzKCcuc2VydmVyJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgaW5pdGlhbFBhdGggPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFBhdGhcIik7XG4gICAgICAgIGluaXRpYWxOYW1lID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxOYW1lXCIpO1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsVHlwZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxQYXRoID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFBhdGhcIik7XG4gICAgICAgIGluaXRpYWxOYW1lID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbE5hbWVcIik7XG4gICAgICAgIGluaXRpYWxUeXBlID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbml0aWFsVHlwZSA9PSBcImRpcmVjdG9yeVwiKSB7XG4gICAgICAgIGlmIChub3JtYWxpemUoaW5pdGlhbFBhdGgpID09IG5vcm1hbGl6ZShkZXN0T2JqZWN0LmdldFBhdGgoZmFsc2UpICsgaW5pdGlhbE5hbWUgKyAnLycpKSByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGluaXRpYWxUeXBlID09IFwiZmlsZVwiKSB7XG4gICAgICAgIGlmIChub3JtYWxpemUoaW5pdGlhbFBhdGgpID09IG5vcm1hbGl6ZShkZXN0T2JqZWN0LmdldFBhdGgoZmFsc2UpICsgaW5pdGlhbE5hbWUpKSByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpbml0aWFsUGF0aCkge1xuICAgICAgICAvLyBEcm9wIGV2ZW50IGZyb20gQXRvbVxuICAgICAgICBpZiAoaW5pdGlhbFR5cGUgPT0gXCJkaXJlY3RvcnlcIikge1xuICAgICAgICAgIGxldCBzcmNQYXRoID0gdHJhaWxpbmdzbGFzaGl0KGRlc3RPYmplY3QuZ2V0Um9vdCgpLmdldFBhdGgodHJ1ZSkpICsgaW5pdGlhbFBhdGg7XG4gICAgICAgICAgbGV0IGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgaW5pdGlhbE5hbWUgKyAnLyc7XG4gICAgICAgICAgc2VsZi5tb3ZlRGlyZWN0b3J5KGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5pdGlhbFR5cGUgPT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICBsZXQgc3JjUGF0aCA9IHRyYWlsaW5nc2xhc2hpdChkZXN0T2JqZWN0LmdldFJvb3QoKS5nZXRQYXRoKHRydWUpKSArIGluaXRpYWxQYXRoO1xuICAgICAgICAgIGxldCBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGluaXRpYWxOYW1lO1xuICAgICAgICAgIHNlbGYubW92ZUZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRHJvcCBldmVudCBmcm9tIE9TXG4gICAgICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgICAgIHJlZiA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZiA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbGV0IGZpbGUgPSByZWZbaV07XG4gICAgICAgICAgbGV0IHNyY1BhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgbGV0IGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgYmFzZW5hbWUoZmlsZS5wYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAgICAgICBpZiAoRmlsZVN5c3RlbS5zdGF0U3luYyhmaWxlLnBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHNlbGYudXBsb2FkRGlyZWN0b3J5KGRlc3RPYmplY3QuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYudXBsb2FkRmlsZShkZXN0T2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZCh0eXBlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVzdE9iamVjdCA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICBpZiAoZGVzdE9iamVjdC5pcygnLmZpbGUnKSkge1xuICAgICAgZGVzdE9iamVjdCA9IGRlc3RPYmplY3QucGFyZW50O1xuICAgIH1cblxuICAgIGxldCBkZWZhdWx0UGF0aCA9IGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyYW5zZmVyLmRlZmF1bHRVcGxvYWRQYXRoJykgfHwgJ2Rlc2t0b3AnO1xuICAgIGlmIChkZWZhdWx0UGF0aCA9PSAncHJvamVjdCcpIHtcbiAgICAgIGNvbnN0IHByb2plY3RzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgICBkZWZhdWx0UGF0aCA9IHByb2plY3RzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkZWZhdWx0UGF0aCA9PSAnZGVza3RvcCcpIHtcbiAgICAgIGRlZmF1bHRQYXRoID0gRWxlY3Ryb24ucmVtb3RlLmFwcC5nZXRQYXRoKFwiZGVza3RvcFwiKVxuICAgIH0gZWxzZSBpZiAoZGVmYXVsdFBhdGggPT0gJ2Rvd25sb2FkcycpIHtcbiAgICAgIGRlZmF1bHRQYXRoID0gRWxlY3Ryb24ucmVtb3RlLmFwcC5nZXRQYXRoKFwiZG93bmxvYWRzXCIpXG4gICAgfVxuICAgIGxldCBzcmNQYXRoID0gbnVsbDtcbiAgICBsZXQgZGVzdFBhdGggPSBudWxsO1xuXG4gICAgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XG4gICAgICBFbGVjdHJvbi5yZW1vdGUuZGlhbG9nLnNob3dPcGVuRGlhbG9nKG51bGwsIHsgdGl0bGU6ICdTZWxlY3QgZmlsZShzKSBmb3IgdXBsb2FkLi4uJywgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoLCBidXR0b25MYWJlbDogJ1VwbG9hZCcsIHByb3BlcnRpZXM6IFsnb3BlbkZpbGUnLCAnbXVsdGlTZWxlY3Rpb25zJywgJ3Nob3dIaWRkZW5GaWxlcyddIH0sIChmaWxlUGF0aHMsIGJvb2ttYXJrcykgPT4ge1xuICAgICAgICBpZiAoZmlsZVBhdGhzKSB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwoZmlsZVBhdGhzLm1hcCgoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgICAgIHNyY1BhdGggPSBmaWxlUGF0aDtcbiAgICAgICAgICAgIGRlc3RQYXRoID0gZGVzdE9iamVjdC5nZXRQYXRoKHRydWUpICsgYmFzZW5hbWUoZmlsZVBhdGgsIFBhdGguc2VwKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnVwbG9hZEZpbGUoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgICAgICB9KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZSgnRmlsZShzKSBoYXMgYmVlbiB1cGxvYWRlZCB0bzogXFxyIFxcbicgKyBmaWxlUGF0aHMuam9pbignXFxyIFxcbicpLCAnc3VjY2VzcycpO1xuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGlyZWN0b3J5Jykge1xuICAgICAgRWxlY3Ryb24ucmVtb3RlLmRpYWxvZy5zaG93T3BlbkRpYWxvZyhudWxsLCB7IHRpdGxlOiAnU2VsZWN0IGRpcmVjdG9yeSBmb3IgdXBsb2FkLi4uJywgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoLCBidXR0b25MYWJlbDogJ1VwbG9hZCcsIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeScsICdzaG93SGlkZGVuRmlsZXMnXSB9LCAoZGlyZWN0b3J5UGF0aHMsIGJvb2ttYXJrcykgPT4ge1xuICAgICAgICBpZiAoZGlyZWN0b3J5UGF0aHMpIHtcbiAgICAgICAgICBkaXJlY3RvcnlQYXRocy5mb3JFYWNoKChkaXJlY3RvcnlQYXRoLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgc3JjUGF0aCA9IGRpcmVjdG9yeVBhdGg7XG4gICAgICAgICAgICBkZXN0UGF0aCA9IGRlc3RPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGJhc2VuYW1lKGRpcmVjdG9yeVBhdGgsIFBhdGguc2VwKTtcblxuICAgICAgICAgICAgc2VsZi51cGxvYWREaXJlY3RvcnkoZGVzdE9iamVjdC5nZXRSb290KCksIHNyY1BhdGgsIGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0RpcmVjdG9yeSBoYXMgYmVlbiB1cGxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZG93bmxvYWQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGlmICghU3RvcmFnZS5oYXNQYXNzd29yZCgpKSByZXR1cm47XG5cbiAgICBsZXQgZGVmYXVsdFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmFuc2Zlci5kZWZhdWx0RG93bmxvYWRQYXRoJykgfHwgJ2Rvd25sb2Fkcyc7XG4gICAgaWYgKGRlZmF1bHRQYXRoID09ICdwcm9qZWN0Jykge1xuICAgICAgY29uc3QgcHJvamVjdHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGRlZmF1bHRQYXRoID0gcHJvamVjdHMuc2hpZnQoKTtcbiAgICB9IGVsc2UgaWYgKGRlZmF1bHRQYXRoID09ICdkZXNrdG9wJykge1xuICAgICAgZGVmYXVsdFBhdGggPSBFbGVjdHJvbi5yZW1vdGUuYXBwLmdldFBhdGgoXCJkZXNrdG9wXCIpXG4gICAgfSBlbHNlIGlmIChkZWZhdWx0UGF0aCA9PSAnZG93bmxvYWRzJykge1xuICAgICAgZGVmYXVsdFBhdGggPSBFbGVjdHJvbi5yZW1vdGUuYXBwLmdldFBhdGgoXCJkb3dubG9hZHNcIilcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZmlsZScpKSB7XG4gICAgICBsZXQgZmlsZSA9IHNlbGVjdGVkLnZpZXcoKTtcbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoZmlsZS5nZXRQYXRoKHRydWUpICsgZmlsZS5uYW1lKTtcblxuICAgICAgICBFbGVjdHJvbi5yZW1vdGUuZGlhbG9nLnNob3dTYXZlRGlhbG9nKG51bGwsIHsgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoICsgXCIvXCIgKyBmaWxlLm5hbWUgfSwgKGRlc3RQYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKGRlc3RQYXRoKSB7XG4gICAgICAgICAgICBzZWxmLmRvd25sb2FkRmlsZShmaWxlLmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgsIHsgZmlsZXNpemU6IGZpbGUuc2l6ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuZGlyZWN0b3J5JykpIHtcbiAgICAgIGxldCBkaXJlY3RvcnkgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoZGlyZWN0b3J5KSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoZGlyZWN0b3J5LmdldFBhdGgodHJ1ZSkpO1xuXG4gICAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd1NhdmVEaWFsb2cobnVsbCwgeyBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGggKyBcIi9cIiArIGRpcmVjdG9yeS5uYW1lIH0sIChkZXN0UGF0aCkgPT4ge1xuICAgICAgICAgIGlmIChkZXN0UGF0aCkge1xuICAgICAgICAgICAgc2VsZi5kb3dubG9hZERpcmVjdG9yeShkaXJlY3RvcnkuZ2V0Um9vdCgpLCBzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQudmlldygpLmlzKCcuc2VydmVyJykpIHtcbiAgICAgIGxldCBzZXJ2ZXIgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgICBpZiAoc2VydmVyKSB7XG4gICAgICAgIGNvbnN0IHNyY1BhdGggPSBub3JtYWxpemUoc2VydmVyLmdldFBhdGgodHJ1ZSkpO1xuXG4gICAgICAgIEVsZWN0cm9uLnJlbW90ZS5kaWFsb2cuc2hvd1NhdmVEaWFsb2cobnVsbCwgeyBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGggKyBcIi9cIiB9LCAoZGVzdFBhdGgpID0+IHtcbiAgICAgICAgICBpZiAoZGVzdFBhdGgpIHtcbiAgICAgICAgICAgIHNlbGYuZG93bmxvYWREaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKCdEaXJlY3RvcnkgaGFzIGJlZW4gZG93bmxvYWRlZCB0byAnICsgZGVzdFBhdGgsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1vdmVGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChub3JtYWxpemUoc3JjUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RQYXRoKSkgcmV0dXJuO1xuXG4gICAgc2VydmVyLmdldENvbm5lY3RvcigpLmV4aXN0c0ZpbGUoZGVzdFBhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGZpbGU/JyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiWW91IGFyZSBvdmVyd3JpdGU6XFxuXCIgKyBkZXN0UGF0aC50cmltKCksXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgWWVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5kZWxldGVGaWxlKGRlc3RQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLnJlbmFtZShzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIGdldCBpbmZvIGZyb20gb2xkIG9iamVjdFxuICAgICAgICBsZXQgb2xkT2JqZWN0ID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuZmluZEVsZW1lbnRCeVBhdGgoc2VydmVyLCB0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnJykpKTtcbiAgICAgICAgY29uc3QgY2FjaGVQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmdldFJvb3QoKS5jb25maWcucmVtb3RlLCAnLycpKTtcblxuICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmFkZEZpbGUoc2VydmVyLCBjYWNoZVBhdGgsIHsgc2l6ZTogKG9sZE9iamVjdCkgPyBvbGRPYmplY3Quc2l6ZSA6IG51bGwsIHJpZ2h0czogKG9sZE9iamVjdCkgPyBvbGRPYmplY3QucmlnaHRzIDogbnVsbCB9KTtcbiAgICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgICBzZXJ2ZXIuZ2V0RmluZGVyQ2FjaGUoKS5yZW5hbWVGaWxlKG5vcm1hbGl6ZShzcmNQYXRoLnJlcGxhY2Uoc2VydmVyLmNvbmZpZy5yZW1vdGUsICcvJykpLCBub3JtYWxpemUoZGVzdFBhdGgucmVwbGFjZShzZXJ2ZXIuY29uZmlnLnJlbW90ZSwgJy8nKSksIChvbGRPYmplY3QpID8gb2xkT2JqZWN0LnNpemUgOiAwKTtcblxuICAgICAgICBpZiAob2xkT2JqZWN0KSB7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgZmlsZSBpcyBhbHJlYWR5IG9wZW5lZCBpbiB0ZXh0ZWRpdG9yXG4gICAgICAgICAgbGV0IGZvdW5kID0gZ2V0VGV4dEVkaXRvcihvbGRPYmplY3QuZ2V0TG9jYWxQYXRoKHRydWUpICsgb2xkT2JqZWN0Lm5hbWUpO1xuICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgZm91bmQuc2F2ZU9iamVjdCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICBmb3VuZC5zYXZlQXMoZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlbGVtZW50Lm5hbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vdmUgbG9jYWwgZmlsZVxuICAgICAgICAgIG1vdmVMb2NhbFBhdGgob2xkT2JqZWN0LmdldExvY2FsUGF0aCh0cnVlKSArIG9sZE9iamVjdC5uYW1lLCBlbGVtZW50LmdldExvY2FsUGF0aCh0cnVlKSArIGVsZW1lbnQubmFtZSk7XG5cbiAgICAgICAgICAvLyBSZW1vdmUgb2xkIG9iamVjdFxuICAgICAgICAgIG9sZE9iamVjdC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1vdmVEaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaW5pdGlhbFBhdGggPSB0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aCk7XG4gICAgZGVzdFBhdGggPSB0cmFpbGluZ3NsYXNoaXQoZGVzdFBhdGgpO1xuXG4gICAgaWYgKG5vcm1hbGl6ZShzcmNQYXRoKSA9PSBub3JtYWxpemUoZGVzdFBhdGgpKSByZXR1cm47XG5cbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRGlyZWN0b3J5KGRlc3RQYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0RpcmVjdG9yeSBhbHJlYWR5IGV4aXN0cy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGlzIGRpcmVjdG9yeT8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIG92ZXJ3cml0ZTpcXG5cIiArIGRlc3RQYXRoLnRyaW0oKSxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRlbGV0ZURpcmVjdG9yeShkZXN0UGF0aCwgcmVjdXJzaXZlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBzaG93TWVzc2FnZShlcnIubWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLnJlbmFtZShzcmNQYXRoLCBkZXN0UGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIGdldCBpbmZvIGZyb20gb2xkIG9iamVjdFxuICAgICAgICBsZXQgb2xkT2JqZWN0ID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuZmluZEVsZW1lbnRCeVBhdGgoc2VydmVyLCB0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnJykpKTtcbiAgICAgICAgY29uc3QgY2FjaGVQYXRoID0gbm9ybWFsaXplKGRlc3RQYXRoLnJlcGxhY2Uoc2VydmVyLmdldFJvb3QoKS5jb25maWcucmVtb3RlLCAnLycpKTtcblxuICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmFkZERpcmVjdG9yeShzZXJ2ZXIuZ2V0Um9vdCgpLCBjYWNoZVBhdGgsIHsgc2l6ZTogKG9sZE9iamVjdCkgPyBvbGRPYmplY3Quc2l6ZSA6IG51bGwsIHJpZ2h0czogKG9sZE9iamVjdCkgPyBvbGRPYmplY3QucmlnaHRzIDogbnVsbCB9KTtcbiAgICAgICAgaWYgKGVsZW1lbnQuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVmcmVzaCBjYWNoZVxuICAgICAgICBzZXJ2ZXIuZ2V0RmluZGVyQ2FjaGUoKS5yZW5hbWVEaXJlY3Rvcnkobm9ybWFsaXplKHNyY1BhdGgucmVwbGFjZShzZXJ2ZXIuY29uZmlnLnJlbW90ZSwgJy8nKSksIG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5jb25maWcucmVtb3RlLCAnLycpKSk7XG5cbiAgICAgICAgaWYgKG9sZE9iamVjdCkge1xuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAvLyBDaGVjayBpZiBmaWxlIGlzIGFscmVhZHkgb3BlbmVkIGluIHRleHRlZGl0b3JcblxuICAgICAgICAgIC8vIE1vdmUgbG9jYWwgZmlsZVxuICAgICAgICAgIG1vdmVMb2NhbFBhdGgob2xkT2JqZWN0LmdldExvY2FsUGF0aCh0cnVlKSwgZWxlbWVudC5nZXRMb2NhbFBhdGgodHJ1ZSkpO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIG9sZCBvYmplY3RcbiAgICAgICAgICBpZiAob2xkT2JqZWN0KSBvbGRPYmplY3QucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb3B5RmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoLCBwYXJhbSA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBzcmNMb2NhbFBhdGggPSBub3JtYWxpemUoc2VydmVyLmdldExvY2FsUGF0aChmYWxzZSkgKyBzcmNQYXRoLCBQYXRoLnNlcCk7XG4gICAgY29uc3QgZGVzdExvY2FsUGF0aCA9IG5vcm1hbGl6ZShzZXJ2ZXIuZ2V0TG9jYWxQYXRoKGZhbHNlKSArIGRlc3RQYXRoLCBQYXRoLnNlcCk7XG5cbiAgICAvLyBSZW5hbWUgZmlsZSBpZiBleGlzdHNcbiAgICBpZiAoc3JjUGF0aCA9PSBkZXN0UGF0aCkge1xuICAgICAgbGV0IG9yaWdpbmFsUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aCk7XG4gICAgICBsZXQgcGFyZW50UGF0aCA9IG5vcm1hbGl6ZShkaXJuYW1lKGRlc3RQYXRoKSk7XG5cbiAgICAgIHNlcnZlci5nZXRDb25uZWN0b3IoKS5saXN0RGlyZWN0b3J5KHBhcmVudFBhdGgpLnRoZW4oKGxpc3QpID0+IHtcbiAgICAgICAgbGV0IGZpbGVzID0gW107XG4gICAgICAgIGxldCBmaWxlTGlzdCA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSA9PT0gJy0nO1xuICAgICAgICB9KTtcblxuICAgICAgICBmaWxlTGlzdC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZmlsZXMucHVzaChlbGVtZW50Lm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZmlsZVBhdGg7XG4gICAgICAgIGxldCBmaWxlQ291bnRlciA9IDA7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IGdldEZ1bGxFeHRlbnNpb24ob3JpZ2luYWxQYXRoKTtcblxuICAgICAgICAvLyBhcHBlbmQgYSBudW1iZXIgdG8gdGhlIGZpbGUgaWYgYW4gaXRlbSB3aXRoIHRoZSBzYW1lIG5hbWUgZXhpc3RzXG4gICAgICAgIHdoaWxlIChmaWxlcy5pbmNsdWRlcyhiYXNlbmFtZShkZXN0UGF0aCkpKSB7XG4gICAgICAgICAgZmlsZVBhdGggPSBQYXRoLmRpcm5hbWUob3JpZ2luYWxQYXRoKSArICcvJyArIFBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoLCBleHRlbnNpb24pO1xuICAgICAgICAgIGRlc3RQYXRoID0gZmlsZVBhdGggKyBmaWxlQ291bnRlciArIGV4dGVuc2lvbjtcbiAgICAgICAgICBmaWxlQ291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5jb3B5RmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkuZXhpc3RzRmlsZShkZXN0UGF0aCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdGaWxlIGFscmVhZHkgZXhpc3RzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoaXMgZmlsZT8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIG92ZXJ3cml0ZTpcXG5cIiArIGRlc3RQYXRoLnRyaW0oKSxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBZZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgZmlsZWV4aXN0cyA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdCh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIENyZWF0ZSBsb2NhbCBEaXJlY3Rvcmllc1xuICAgICAgY3JlYXRlTG9jYWxQYXRoKHNyY0xvY2FsUGF0aCk7XG4gICAgICBjcmVhdGVMb2NhbFBhdGgoZGVzdExvY2FsUGF0aCk7XG5cbiAgICAgIHNlbGYuZG93bmxvYWRGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdExvY2FsUGF0aCwgcGFyYW0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBzZWxmLnVwbG9hZEZpbGUoc2VydmVyLCBkZXN0TG9jYWxQYXRoLCBkZXN0UGF0aCkudGhlbigoZHVwbGljYXRlZEZpbGUpID0+IHtcbiAgICAgICAgICBpZiAoZHVwbGljYXRlZEZpbGUpIHtcbiAgICAgICAgICAgIC8vIE9wZW4gZmlsZSBhbmQgYWRkIGhhbmRsZXIgdG8gZWRpdG9yIHRvIHVwbG9hZCBmaWxlIG9uIHNhdmVcbiAgICAgICAgICAgIHJldHVybiBzZWxmLm9wZW5GaWxlSW5FZGl0b3IoZHVwbGljYXRlZEZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHNob3dNZXNzYWdlKGVyciwgJ2Vycm9yJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb3B5RGlyZWN0b3J5KHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChub3JtYWxpemUoc3JjUGF0aCkgPT0gbm9ybWFsaXplKGRlc3RQYXRoKSkgcmV0dXJuO1xuXG4gICAgLy8gVE9ET1xuICAgIGNvbnNvbGUubG9nKCdUT0RPIGNvcHknLCBzcmNQYXRoLCBkZXN0UGF0aCk7XG4gIH1cblxuICB1cGxvYWRGaWxlKHNlcnZlciwgc3JjUGF0aCwgZGVzdFBhdGgsIGNoZWNrRmlsZUV4aXN0cyA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChjaGVja0ZpbGVFeGlzdHMpIHtcbiAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLmV4aXN0c0ZpbGUoZGVzdFBhdGgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5nZXRSb290KCkuY29uZmlnLnJlbW90ZSwgJy8nKSk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maXJtKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0ZpbGUgYWxyZWFkeSBleGlzdHMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhpcyBmaWxlPycsXG4gICAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJZb3UgYXJlIG92ZXJ3cml0ZTpcXG5cIiArIGNhY2hlUGF0aCxcbiAgICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgIFllczogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRlbGV0ZUZpbGUoZGVzdFBhdGgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKGVyci5tZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGxldCBmaWxlc3RhdCA9IEZpbGVTeXN0ZW0uc3RhdFN5bmMoc3JjUGF0aCk7XG5cbiAgICAgICAgICBsZXQgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZSh0cmFpbGluZ3NsYXNoaXQoc3JjUGF0aCksIFBhdGguc2VwKTtcbiAgICAgICAgICBsZXQgZm91bmRJblRyZWVWaWV3ID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuZmluZEVsZW1lbnRCeUxvY2FsUGF0aChwYXRoT25GaWxlU3lzdGVtKTtcbiAgICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgICAvLyBBZGQgc3luYyBpY29uXG4gICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcuYWRkU3luY0ljb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBZGQgdG8gVXBsb2FkIFF1ZXVlXG4gICAgICAgICAgbGV0IHF1ZXVlSXRlbSA9IFF1ZXVlLmFkZEZpbGUoe1xuICAgICAgICAgICAgZGlyZWN0aW9uOiBcInVwbG9hZFwiLFxuICAgICAgICAgICAgcmVtb3RlUGF0aDogZGVzdFBhdGgsXG4gICAgICAgICAgICBsb2NhbFBhdGg6IHNyY1BhdGgsXG4gICAgICAgICAgICBzaXplOiBmaWxlc3RhdC5zaXplXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLnVwbG9hZEZpbGUocXVldWVJdGVtLCAxKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5nZXRSb290KCkuY29uZmlnLnJlbW90ZSwgJy8nKSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0byB0cmVlXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmFkZEZpbGUoc2VydmVyLmdldFJvb3QoKSwgY2FjaGVQYXRoLCB7IHNpemU6IGZpbGVzdGF0LnNpemUgfSk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgICAgICBzZXJ2ZXIuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuZGVsZXRlRmlsZShub3JtYWxpemUoY2FjaGVQYXRoKSk7XG4gICAgICAgICAgICBzZXJ2ZXIuZ2V0Um9vdCgpLmdldEZpbmRlckNhY2hlKCkuYWRkRmlsZShub3JtYWxpemUoY2FjaGVQYXRoKSwgZmlsZXN0YXQuc2l6ZSk7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgICAgICBmb3VuZEluVHJlZVZpZXcucmVtb3ZlU3luY0ljb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuXG4gICAgICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSBzeW5jIGljb25cbiAgICAgICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBmaWxlc3RhdCA9IEZpbGVTeXN0ZW0uc3RhdFN5bmMoc3JjUGF0aCk7XG5cbiAgICAgICAgbGV0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUodHJhaWxpbmdzbGFzaGl0KHNyY1BhdGgpLCBQYXRoLnNlcCk7XG4gICAgICAgIGxldCBmb3VuZEluVHJlZVZpZXcgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5maW5kRWxlbWVudEJ5TG9jYWxQYXRoKHBhdGhPbkZpbGVTeXN0ZW0pO1xuICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgLy8gQWRkIHN5bmMgaWNvblxuICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5hZGRTeW5jSWNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRvIFVwbG9hZCBRdWV1ZVxuICAgICAgICBsZXQgcXVldWVJdGVtID0gUXVldWUuYWRkRmlsZSh7XG4gICAgICAgICAgZGlyZWN0aW9uOiBcInVwbG9hZFwiLFxuICAgICAgICAgIHJlbW90ZVBhdGg6IGRlc3RQYXRoLFxuICAgICAgICAgIGxvY2FsUGF0aDogc3JjUGF0aCxcbiAgICAgICAgICBzaXplOiBmaWxlc3RhdC5zaXplXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzZXJ2ZXIuZ2V0Q29ubmVjdG9yKCkudXBsb2FkRmlsZShxdWV1ZUl0ZW0sIDEpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhY2hlUGF0aCA9IG5vcm1hbGl6ZShkZXN0UGF0aC5yZXBsYWNlKHNlcnZlci5nZXRSb290KCkuY29uZmlnLnJlbW90ZSwgJy8nKSk7XG5cbiAgICAgICAgICAvLyBBZGQgdG8gdHJlZVxuICAgICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuYWRkRmlsZShzZXJ2ZXIuZ2V0Um9vdCgpLCBjYWNoZVBhdGgsIHsgc2l6ZTogZmlsZXN0YXQuc2l6ZSB9KTtcbiAgICAgICAgICBpZiAoZWxlbWVudC5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWZyZXNoIGNhY2hlXG4gICAgICAgICAgc2VydmVyLmdldFJvb3QoKS5nZXRGaW5kZXJDYWNoZSgpLmRlbGV0ZUZpbGUobm9ybWFsaXplKGNhY2hlUGF0aCkpO1xuICAgICAgICAgIHNlcnZlci5nZXRSb290KCkuZ2V0RmluZGVyQ2FjaGUoKS5hZGRGaWxlKG5vcm1hbGl6ZShjYWNoZVBhdGgpLCBmaWxlc3RhdC5zaXplKTtcblxuICAgICAgICAgIGlmIChmb3VuZEluVHJlZVZpZXcpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzeW5jIGljb25cbiAgICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoZWxlbWVudCk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBxdWV1ZUl0ZW0uY2hhbmdlU3RhdHVzKCdFcnJvcicpO1xuXG4gICAgICAgICAgaWYgKGZvdW5kSW5UcmVlVmlldykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgICAgZm91bmRJblRyZWVWaWV3LnJlbW92ZVN5bmNJY29uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgfVxuXG4gIHVwbG9hZERpcmVjdG9yeShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgRmlsZVN5c3RlbS5saXN0VHJlZVN5bmMoc3JjUGF0aCkuZmlsdGVyKChwYXRoKSA9PiBGaWxlU3lzdGVtLmlzRmlsZVN5bmMocGF0aCkpLnJlZHVjZSgocHJldlByb21pc2UsIHBhdGgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByZXZQcm9taXNlLnRoZW4oKCkgPT4gc2VsZi51cGxvYWRGaWxlKHNlcnZlciwgcGF0aCwgbm9ybWFsaXplKGRlc3RQYXRoICsgJy8nICsgcGF0aC5yZXBsYWNlKHNyY1BhdGgsICcvJyksICcvJykpKTtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHJlc29sdmUoKSkuY2F0Y2goKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkRmlsZShzZXJ2ZXIsIHNyY1BhdGgsIGRlc3RQYXRoLCBwYXJhbSA9IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIENoZWNrIGlmIGZpbGUgaXMgYWxyZWFkeSBpbiBRdWV1ZVxuICAgICAgaWYgKFF1ZXVlLmV4aXN0c0ZpbGUoZGVzdFBhdGgpKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcGF0aE9uRmlsZVN5c3RlbSA9IG5vcm1hbGl6ZSh0cmFpbGluZ3NsYXNoaXQoc2VydmVyLmdldExvY2FsUGF0aChmYWxzZSkgKyBzcmNQYXRoKSwgUGF0aC5zZXApO1xuICAgICAgbGV0IGZvdW5kSW5UcmVlVmlldyA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmZpbmRFbGVtZW50QnlMb2NhbFBhdGgocGF0aE9uRmlsZVN5c3RlbSk7XG4gICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgIC8vIEFkZCBzeW5jIGljb25cbiAgICAgICAgZm91bmRJblRyZWVWaWV3LmFkZFN5bmNJY29uKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBsb2NhbCBEaXJlY3Rvcmllc1xuICAgICAgY3JlYXRlTG9jYWxQYXRoKGRlc3RQYXRoKTtcblxuICAgICAgLy8gQWRkIHRvIERvd25sb2FkIFF1ZXVlXG4gICAgICBsZXQgcXVldWVJdGVtID0gUXVldWUuYWRkRmlsZSh7XG4gICAgICAgIGRpcmVjdGlvbjogXCJkb3dubG9hZFwiLFxuICAgICAgICByZW1vdGVQYXRoOiBzcmNQYXRoLFxuICAgICAgICBsb2NhbFBhdGg6IGRlc3RQYXRoLFxuICAgICAgICBzaXplOiAocGFyYW0uZmlsZXNpemUpID8gcGFyYW0uZmlsZXNpemUgOiAwXG4gICAgICB9KTtcblxuICAgICAgLy8gRG93bmxvYWQgZmlsZVxuICAgICAgc2VydmVyLmdldENvbm5lY3RvcigpLmRvd25sb2FkRmlsZShxdWV1ZUl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgcXVldWVJdGVtLmNoYW5nZVN0YXR1cygnRXJyb3InKTtcblxuICAgICAgICBpZiAoZm91bmRJblRyZWVWaWV3KSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN5bmMgaWNvblxuICAgICAgICAgIGZvdW5kSW5UcmVlVmlldy5yZW1vdmVTeW5jSWNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZG93bmxvYWREaXJlY3Rvcnkoc2VydmVyLCBzcmNQYXRoLCBkZXN0UGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3Qgc2NhbkRpciA9IChwYXRoKSA9PiB7XG4gICAgICByZXR1cm4gc2VydmVyLmdldENvbm5lY3RvcigpLmxpc3REaXJlY3RvcnkocGF0aCkudGhlbihsaXN0ID0+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4gKGl0ZW0udHlwZSA9PT0gJy0nKSkubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgaXRlbS5wYXRoID0gbm9ybWFsaXplKHBhdGggKyAnLycgKyBpdGVtLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGlycyA9IGxpc3QuZmlsdGVyKChpdGVtKSA9PiAoaXRlbS50eXBlID09PSAnZCcgJiYgaXRlbS5uYW1lICE9PSAnLicgJiYgaXRlbS5uYW1lICE9PSAnLi4nKSkubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgaXRlbS5wYXRoID0gbm9ybWFsaXplKHBhdGggKyAnLycgKyBpdGVtLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGlycy5yZWR1Y2UoKHByZXZQcm9taXNlLCBkaXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJldlByb21pc2UudGhlbihvdXRwdXQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNjYW5EaXIobm9ybWFsaXplKGRpci5wYXRoKSkudGhlbihmaWxlcyA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBvdXRwdXQuY29uY2F0KGZpbGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoZmlsZXMpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbkRpcihzcmNQYXRoKS50aGVuKChmaWxlcykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFGaWxlU3lzdGVtLmV4aXN0c1N5bmMoZGVzdFBhdGgpKSB7XG4gICAgICAgICAgRmlsZVN5c3RlbS5ta2RpclN5bmMoZGVzdFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmaWxlcy5yZWR1Y2UoKHByZXZQcm9taXNlLCBmaWxlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByZXZQcm9taXNlLnRoZW4oKCkgPT4gc2VsZi5kb3dubG9hZEZpbGUoc2VydmVyLCBmaWxlLnBhdGgsIG5vcm1hbGl6ZShkZXN0UGF0aCArIFBhdGguc2VwICsgZmlsZS5wYXRoLnJlcGxhY2Uoc3JjUGF0aCwgJy8nKSwgUGF0aC5zZXApLCB7IGZpbGVzaXplOiBmaWxlLnNpemUgfSkpO1xuICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiByZXNvbHZlKCkpLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kUmVtb3RlUGF0aCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RlZCA9IHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgRmluZERpYWxvZygnLycsIGZhbHNlKTtcbiAgICBkaWFsb2cub24oJ2ZpbmQtcGF0aCcsIChlLCByZWxhdGl2ZVBhdGgpID0+IHtcbiAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgcmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKHJlbGF0aXZlUGF0aCk7XG5cbiAgICAgICAgbGV0IHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBpbml0aWFsIHBhdGggaWYgZXhpc3RzXG4gICAgICAgIGlmIChyb290LmNvbmZpZy5yZW1vdGUpIHtcbiAgICAgICAgICBpZiAocmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgocm9vdC5jb25maWcucmVtb3RlKSkge1xuICAgICAgICAgICAgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmVQYXRoLnJlcGxhY2Uocm9vdC5jb25maWcucmVtb3RlLCBcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5leHBhbmQocm9vdCwgcmVsYXRpdmVQYXRoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZGlhbG9nLmF0dGFjaCgpO1xuICB9XG5cbiAgY29weVJlbW90ZVBhdGgoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3RlZC52aWV3KCk7XG4gICAgaWYgKGVsZW1lbnQuaXMoJy5kaXJlY3RvcnknKSkge1xuICAgICAgcGF0aFRvQ29weSA9IGVsZW1lbnQuZ2V0UGF0aCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aFRvQ29weSA9IGVsZW1lbnQuZ2V0UGF0aCh0cnVlKSArIGVsZW1lbnQubmFtZTtcbiAgICB9XG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUocGF0aFRvQ29weSlcbiAgfVxuXG4gIHJlbW90ZVBhdGhGaW5kZXIocmVpbmRleCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgbGV0IHJvb3QgPSBzZWxlY3RlZC52aWV3KCkuZ2V0Um9vdCgpO1xuICAgIGxldCBpdGVtc0NhY2hlID0gcm9vdC5nZXRGaW5kZXJDYWNoZSgpO1xuXG4gICAgaWYgKHNlbGYuZmluZGVyVmlldyA9PSBudWxsKSB7XG4gICAgICBzZWxmLmZpbmRlclZpZXcgPSBuZXcgRmluZGVyVmlldyhzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKSk7XG5cbiAgICAgIHNlbGYuZmluZGVyVmlldy5vbignZnRwLXJlbW90ZS1lZGl0LWZpbmRlcjpvcGVuJywgKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IGl0ZW0ucmVsYXRpdmVQYXRoO1xuICAgICAgICBsZXQgbG9jYWxQYXRoID0gbm9ybWFsaXplKHNlbGYuZmluZGVyVmlldy5yb290LmdldExvY2FsUGF0aCgpICsgcmVsYXRpdmVQYXRoLCBQYXRoLnNlcCk7XG4gICAgICAgIGxldCBmaWxlID0gc2VsZi5nZXRUcmVlVmlld0luc3RhbmNlKCkuZ2V0RWxlbWVudEJ5TG9jYWxQYXRoKGxvY2FsUGF0aCwgc2VsZi5maW5kZXJWaWV3LnJvb3QsICdmaWxlJyk7XG4gICAgICAgIGZpbGUuc2l6ZSA9IGl0ZW0uc2l6ZTtcblxuICAgICAgICBpZiAoZmlsZSkgc2VsZi5vcGVuRmlsZShmaWxlKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLmZpbmRlclZpZXcub24oJ2Z0cC1yZW1vdGUtZWRpdC1maW5kZXI6aGlkZScsICgpID0+IHtcbiAgICAgICAgaXRlbXNDYWNoZS5sb2FkVGFzayA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHNlbGYuZmluZGVyVmlldy5yb290ID0gcm9vdDtcbiAgICBzZWxmLmZpbmRlclZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHsgaXRlbXM6IGl0ZW1zQ2FjaGUuaXRlbXMgfSlcblxuICAgIGNvbnN0IGluZGV4ID0gKGl0ZW1zKSA9PiB7XG4gICAgICBzZWxmLmZpbmRlclZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHsgaXRlbXM6IGl0ZW1zLCBlcnJvck1lc3NhZ2U6ICcnLCBsb2FkaW5nTWVzc2FnZTogJ0luZGV4aW5nXFx1MjAyNicgKyBpdGVtcy5sZW5ndGggfSlcbiAgICB9O1xuICAgIGl0ZW1zQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ2ZpbmRlci1pdGVtcy1jYWNoZS1xdWV1ZTppbmRleCcsIGluZGV4KTtcbiAgICBpdGVtc0NhY2hlLm9uKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6aW5kZXgnLCBpbmRleCk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoaXRlbXMpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXMsIGVycm9yTWVzc2FnZTogJycsIGxvYWRpbmdNZXNzYWdlOiAnJyB9KVxuICAgIH07XG4gICAgaXRlbXNDYWNoZS5yZW1vdmVMaXN0ZW5lcignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHVwZGF0ZSk7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOnVwZGF0ZScsIHVwZGF0ZSk7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoaXRlbXMpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogaXRlbXMsIGVycm9yTWVzc2FnZTogJycsIGxvYWRpbmdNZXNzYWdlOiAnJyB9KVxuICAgIH07XG4gICAgaXRlbXNDYWNoZS5yZW1vdmVMaXN0ZW5lcignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmZpbmlzaCcsIGZpbmlzaCk7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmZpbmlzaCcsIGZpbmlzaCk7XG5cbiAgICBjb25zdCBlcnJvciA9IChlcnIpID0+IHtcbiAgICAgIHNlbGYuZmluZGVyVmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBlcnJvck1lc3NhZ2U6ICdFcnJvcjogJyArIGVyci5tZXNzYWdlIH0pXG4gICAgfTtcbiAgICBpdGVtc0NhY2hlLnJlbW92ZUxpc3RlbmVyKCdmaW5kZXItaXRlbXMtY2FjaGUtcXVldWU6ZXJyb3InLCBlcnJvcik7XG4gICAgaXRlbXNDYWNoZS5vbignZmluZGVyLWl0ZW1zLWNhY2hlLXF1ZXVlOmVycm9yJywgZXJyb3IpO1xuXG4gICAgaXRlbXNDYWNoZS5sb2FkKHJlaW5kZXgpO1xuICAgIHNlbGYuZmluZGVyVmlldy50b2dnbGUoKTtcbiAgfVxuXG4gIGF1dG9SZXZlYWxBY3RpdmVGaWxlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LnRyZWUuYXV0b1JldmVhbEFjdGl2ZUZpbGUnKSkge1xuICAgICAgaWYgKHNlbGYuZ2V0VHJlZVZpZXdJbnN0YW5jZSgpLmlzVmlzaWJsZSgpKSB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAgICAgaWYgKGVkaXRvciAmJiBlZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICAgICAgbGV0IHBhdGhPbkZpbGVTeXN0ZW0gPSBub3JtYWxpemUodHJhaWxpbmdzbGFzaGl0KGVkaXRvci5nZXRQYXRoKCkpLCBQYXRoLnNlcCk7XG5cbiAgICAgICAgICBsZXQgZW50cnkgPSBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5maW5kRWxlbWVudEJ5TG9jYWxQYXRoKHBhdGhPbkZpbGVTeXN0ZW0pO1xuICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5pc1Zpc2libGUoKSkge1xuICAgICAgICAgICAgZW50cnkuc2VsZWN0KCk7XG4gICAgICAgICAgICBzZWxmLmdldFRyZWVWaWV3SW5zdGFuY2UoKS5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb25Nb3ZlUGFnZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWxlSW5FZGl0b3IoZmlsZSwgcGVuZGluZykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4obm9ybWFsaXplKGZpbGUuZ2V0TG9jYWxQYXRoKHRydWUpICsgZmlsZS5uYW1lLCBQYXRoLnNlcCksIHsgcGVuZGluZzogcGVuZGluZywgc2VhcmNoQWxsUGFuZXM6IHRydWUgfSkudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3Iuc2F2ZU9iamVjdCA9IGZpbGU7XG4gICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBTYXZlIGZpbGUgb24gcmVtb3RlIHNlcnZlclxuICAgICAgICBlZGl0b3Iub25EaWRTYXZlKChzYXZlT2JqZWN0KSA9PiB7XG4gICAgICAgICAgaWYgKCFlZGl0b3Iuc2F2ZU9iamVjdCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gR2V0IGZpbGVzaXplXG4gICAgICAgICAgY29uc3QgZmlsZXN0YXQgPSBGaWxlU3lzdGVtLnN0YXRTeW5jKGVkaXRvci5nZXRQYXRoKHRydWUpKTtcbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5zaXplID0gZmlsZXN0YXQuc2l6ZTtcbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5hdHRyKCdkYXRhLXNpemUnLCBmaWxlc3RhdC5zaXplKTtcblxuICAgICAgICAgIGNvbnN0IHNyY1BhdGggPSBlZGl0b3Iuc2F2ZU9iamVjdC5nZXRMb2NhbFBhdGgodHJ1ZSkgKyBlZGl0b3Iuc2F2ZU9iamVjdC5uYW1lO1xuICAgICAgICAgIGNvbnN0IGRlc3RQYXRoID0gZWRpdG9yLnNhdmVPYmplY3QuZ2V0UGF0aCh0cnVlKSArIGVkaXRvci5zYXZlT2JqZWN0Lm5hbWU7XG4gICAgICAgICAgc2VsZi51cGxvYWRGaWxlKGVkaXRvci5zYXZlT2JqZWN0LmdldFJvb3QoKSwgc3JjUGF0aCwgZGVzdFBhdGgsIGZhbHNlKS50aGVuKChkdXBsaWNhdGVkRmlsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZWRGaWxlKSB7XG4gICAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5ub3RpZmljYXRpb25zLnNob3dOb3RpZmljYXRpb25PblVwbG9hZCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd01lc3NhZ2UoJ0ZpbGUgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkLicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICBpZiAoIWVkaXRvci5zYXZlT2JqZWN0KSByZXR1cm47XG5cbiAgICAgICAgICBlZGl0b3Iuc2F2ZU9iamVjdC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgc2hvd01lc3NhZ2UoZXJyLm1lc3NhZ2UsICdlcnJvcicpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJlZVZpZXdJbnN0YW5jZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaW5pdCgpO1xuXG4gICAgaWYgKHNlbGYudHJlZVZpZXcgPT0gbnVsbCkge1xuICAgICAgc2VsZi50cmVlVmlldyA9IG5ldyBUcmVlVmlldygpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi50cmVlVmlldztcbiAgfVxuXG4gIGdldFByb3RvY29sVmlld0luc3RhbmNlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbml0KCk7XG5cbiAgICBpZiAoc2VsZi5wcm90b2NvbFZpZXcgPT0gbnVsbCkge1xuICAgICAgc2VsZi5wcm90b2NvbFZpZXcgPSBuZXcgUHJvdG9jb2xWaWV3KCk7XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnByb3RvY29sVmlldztcbiAgfVxuXG4gIGdldENvbmZpZ3VyYXRpb25WaWV3SW5zdGFuY2UoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmluaXQoKTtcblxuICAgIGlmIChzZWxmLmNvbmZpZ3VyYXRpb25WaWV3ID09IG51bGwpIHtcbiAgICAgIHNlbGYuY29uZmlndXJhdGlvblZpZXcgPSBuZXcgQ29uZmlndXJhdGlvblZpZXcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYuY29uZmlndXJhdGlvblZpZXc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZ0cFJlbW90ZUVkaXQoKTtcbiJdfQ==