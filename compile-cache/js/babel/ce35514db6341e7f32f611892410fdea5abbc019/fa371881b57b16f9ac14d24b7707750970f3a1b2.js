Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _atom = require('atom');

var _helperHelperJs = require('./../helper/helper.js');

var _connectorsConnectorJs = require('./../connectors/connector.js');

var _connectorsConnectorJs2 = _interopRequireDefault(_connectorsConnectorJs);

var _helperImportJs = require('./../helper/import.js');

var _helperImportJs2 = _interopRequireDefault(_helperImportJs);

var _viewsFolderConfigurationView = require('./../views/folder-configuration-view');

var _viewsFolderConfigurationView2 = _interopRequireDefault(_viewsFolderConfigurationView);

'use babel';

var atom = global.atom;
var config = require('./../config/server-schema.json');
var debugConfig = __dirname + './../config/server-test-schema.json';
var Storage = require('./../helper/storage.js');

var ConfigurationView = (function (_View) {
  _inherits(ConfigurationView, _View);

  function ConfigurationView() {
    _classCallCheck(this, ConfigurationView);

    _get(Object.getPrototypeOf(ConfigurationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ConfigurationView, [{
    key: 'initialize',
    value: function initialize() {
      var self = this;

      self.subscriptions = null;
      self.disableEventhandler = false;

      var html = '<p>Ftp-Remote-Edit Server Settings</p>';
      html += "<p>You can edit each connection at the time. All changes will only be saved by pushing the save button.</p>";
      self.info.html(html);

      var saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.classList.add('btn');

      var importButton = document.createElement('button');
      importButton.textContent = 'Import';
      importButton.classList.add('btn');

      var closeButton = document.createElement('button');
      closeButton.textContent = 'Cancel';
      closeButton.classList.add('btn');
      closeButton.classList.add('pull-right');

      self.content.append(self.createServerSelect());
      self.content.append(self.createControls());

      self.footer.append(saveButton);
      self.footer.append(importButton);
      self.footer.append(closeButton);

      // Events
      closeButton.addEventListener('click', function (event) {
        self.close();
      });

      saveButton.addEventListener('click', function (event) {
        self.save();
        self.close();
      });

      importButton.addEventListener('click', function (event) {
        self['import']();
      });

      self.subscriptions = new _atom.CompositeDisposable();
      self.subscriptions.add(atom.commands.add(this.element, {
        'core:confirm': function coreConfirm() {
          // self.save();
        },
        'core:cancel': function coreCancel() {
          self.cancel();
        }
      }));

      // Handle keydown by tab events to switch between fields
      closeButton.addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.selectServer.focus();
        }
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      if (self.subscriptions) {
        self.subscriptions.dispose();
        self.subscriptions = null;
      }
    }
  }, {
    key: 'createControls',
    value: function createControls() {
      var self = this;

      var divRequired = document.createElement('div');
      divRequired.classList.add('server-settings');

      var nameLabel = document.createElement('label');
      nameLabel.classList.add('control-label');
      var nameLabelTitle = document.createElement('div');
      nameLabelTitle.textContent = 'The name of the server.';
      nameLabelTitle.classList.add('setting-title');
      nameLabel.appendChild(nameLabelTitle);
      self.nameInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "name" });
      self.nameInput.element.classList.add('form-control');

      var folderLabel = document.createElement('label');
      folderLabel.classList.add('control-label');
      var folderLabelTitle = document.createElement('div');
      folderLabelTitle.textContent = 'Folder';
      folderLabelTitle.classList.add('setting-title');
      folderLabel.appendChild(folderLabelTitle);

      self.folderSelect = document.createElement('select');
      self.folderSelect.classList.add('form-control');
      self.createControlsFolderSelect();

      self.folderEdit = document.createElement('button');
      self.folderEdit.textContent = 'Edit';
      self.folderEdit.classList.add('btn');

      var hostLabel = document.createElement('label');
      hostLabel.classList.add('control-label');
      var hostLabelTitle = document.createElement('div');
      hostLabelTitle.textContent = 'The hostname or IP address of the server.';
      hostLabelTitle.classList.add('setting-title');
      hostLabel.appendChild(hostLabelTitle);
      self.hostInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "localhost" });
      self.hostInput.element.classList.add('form-control');

      var portLabel = document.createElement('label');
      portLabel.classList.add('control-label');
      var portLabelTitle = document.createElement('div');
      portLabelTitle.textContent = 'Port';
      portLabelTitle.classList.add('setting-title');
      portLabel.appendChild(portLabelTitle);
      self.portInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "21" });
      self.portInput.element.classList.add('form-control');

      var protocolLabel = document.createElement('label');
      protocolLabel.classList.add('control-label');
      var protocolLabelTitle = document.createElement('div');
      protocolLabelTitle.textContent = 'Protocol';
      protocolLabelTitle.classList.add('setting-title');
      protocolLabel.appendChild(protocolLabelTitle);

      self.protocolSelect = document.createElement('select');
      self.protocolSelect.classList.add('form-control');
      var optionFTP = document.createElement("option");
      optionFTP.text = 'FTP - File Transfer Protocol';
      optionFTP.value = 'ftp';
      self.protocolSelect.add(optionFTP);
      var optionSFTP = document.createElement("option");
      optionSFTP.text = 'SFTP - SSH File Transfer Protocol';
      optionSFTP.value = 'sftp';
      self.protocolSelect.add(optionSFTP);
      var protocolSelectContainer = document.createElement('div');
      protocolSelectContainer.classList.add('select-container');
      protocolSelectContainer.appendChild(self.protocolSelect);

      var protocolEncryptionLabel = document.createElement('label');
      protocolEncryptionLabel.classList.add('control-label');
      var protocolEncryptionLabelTitle = document.createElement('div');
      protocolEncryptionLabelTitle.textContent = 'Encryption';
      protocolEncryptionLabelTitle.classList.add('setting-title');
      protocolEncryptionLabel.appendChild(protocolEncryptionLabelTitle);

      self.protocolEncryptionSelect = document.createElement('select');
      self.protocolEncryptionSelect.classList.add('form-control');
      var optionPlainFTP = document.createElement("option");
      optionPlainFTP.text = 'Only use plain FTP (insecure)';
      optionPlainFTP.value = 'none';
      self.protocolEncryptionSelect.add(optionPlainFTP);
      var optionExplicitSFTP = document.createElement("option");
      optionExplicitSFTP.text = 'Require explicit FTP over TLS';
      optionExplicitSFTP.value = 'explicit';
      self.protocolEncryptionSelect.add(optionExplicitSFTP);
      var optionImplicitSFTP = document.createElement("option");
      optionImplicitSFTP.text = 'Require implicit FTP over TLS (not implemented)';
      optionImplicitSFTP.value = 'implicit';
      optionImplicitSFTP.disabled = true;
      self.protocolEncryptionSelect.add(optionImplicitSFTP);
      var protocolEncryptionSelectContainer = document.createElement('div');
      protocolEncryptionSelectContainer.classList.add('select-container');
      protocolEncryptionSelectContainer.appendChild(self.protocolEncryptionSelect);

      var logonTypeLabel = document.createElement('label');
      logonTypeLabel.classList.add('control-label');
      var logonTypeLabelTitle = document.createElement('div');
      logonTypeLabelTitle.textContent = 'Logon Type';
      logonTypeLabelTitle.classList.add('setting-title');
      logonTypeLabel.appendChild(logonTypeLabelTitle);

      self.logonTypeSelect = document.createElement('select');
      self.logonTypeSelect.classList.add('form-control');
      var optionNormal = document.createElement("option");
      optionNormal.text = 'Username / Password';
      optionNormal.value = 'credentials';
      self.logonTypeSelect.add(optionNormal);
      var optionKeyFile = document.createElement("option");
      optionKeyFile.text = 'Keyfile (OpenSSH format - PEM)';
      optionKeyFile.value = 'keyfile';
      self.logonTypeSelect.add(optionKeyFile);
      var optionAgent = document.createElement("option");
      optionAgent.text = 'SSH Agent';
      optionAgent.value = 'agent';
      self.logonTypeSelect.add(optionAgent);
      var logonTypeSelectContainer = document.createElement('div');
      logonTypeSelectContainer.classList.add('select-container');
      logonTypeSelectContainer.appendChild(self.logonTypeSelect);

      var userLabel = document.createElement('label');
      userLabel.classList.add('control-label');
      var userLabelTitle = document.createElement('div');
      userLabelTitle.textContent = 'Username for authentication.';
      userLabelTitle.classList.add('setting-title');
      userLabel.appendChild(userLabelTitle);
      self.userInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "username" });
      self.userInput.element.classList.add('form-control');

      var passwordLabel = document.createElement('label');
      passwordLabel.classList.add('control-label');
      var passwordLabelTitle = document.createElement('div');
      passwordLabelTitle.textContent = 'Password/Passphrase for authentication.';
      passwordLabelTitle.classList.add('setting-title');
      passwordLabel.appendChild(passwordLabelTitle);
      self.passwordInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "password" });
      self.passwordInput.element.classList.add('form-control');

      var privatekeyfileLabel = document.createElement('label');
      privatekeyfileLabel.classList.add('control-label');
      var privatekeyfileLabelTitle = document.createElement('div');
      privatekeyfileLabelTitle.textContent = 'Path to private keyfile.';
      privatekeyfileLabelTitle.classList.add('setting-title');
      privatekeyfileLabel.appendChild(privatekeyfileLabelTitle);
      self.privatekeyfileInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "path to private keyfile" });
      self.privatekeyfileInput.element.classList.add('form-control');

      var remoteLabel = document.createElement('label');
      remoteLabel.classList.add('control-label');
      var remoteLabelTitle = document.createElement('div');
      remoteLabelTitle.textContent = 'Initial Directory.';
      remoteLabelTitle.classList.add('setting-title');
      remoteLabel.appendChild(remoteLabelTitle);
      self.remoteInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "/" });
      self.remoteInput.element.classList.add('form-control');

      var nameControl = document.createElement('div');
      nameControl.classList.add('controls');
      nameControl.classList.add('name');
      nameControl.appendChild(nameLabel);
      nameControl.appendChild(self.nameInput.element);

      var folderControl = document.createElement('div');
      folderControl.classList.add('controls');
      folderControl.classList.add('folder');
      folderControl.appendChild(folderLabel);
      folderControl.appendChild(self.folderSelect);

      var folderButtonControl = document.createElement('div');
      folderButtonControl.classList.add('controls');
      folderButtonControl.classList.add('folder-button');
      folderButtonControl.appendChild(self.folderEdit);

      var hostControl = document.createElement('div');
      hostControl.classList.add('controls');
      hostControl.classList.add('host');
      hostControl.appendChild(hostLabel);
      hostControl.appendChild(self.hostInput.element);

      var portControl = document.createElement('div');
      portControl.classList.add('controls');
      portControl.classList.add('port');
      portControl.appendChild(portLabel);
      portControl.appendChild(self.portInput.element);

      var protocolControl = document.createElement('div');
      protocolControl.classList.add('controls');
      protocolControl.classList.add('protocol');
      protocolControl.appendChild(protocolLabel);
      protocolControl.appendChild(protocolSelectContainer);

      self.protocolEncryptionControl = document.createElement('div');
      self.protocolEncryptionControl.classList.add('controls');
      self.protocolEncryptionControl.classList.add('protocol-encryption');
      self.protocolEncryptionControl.appendChild(protocolEncryptionLabel);
      self.protocolEncryptionControl.appendChild(protocolEncryptionSelectContainer);

      var logonTypeControl = document.createElement('div');
      logonTypeControl.classList.add('controls');
      logonTypeControl.classList.add('protocol');
      logonTypeControl.appendChild(logonTypeLabel);
      logonTypeControl.appendChild(logonTypeSelectContainer);

      var nameGroup = document.createElement('div');
      nameGroup.classList.add('control-group');
      nameGroup.appendChild(nameControl);
      nameGroup.appendChild(folderControl);
      nameGroup.appendChild(folderButtonControl);
      divRequired.appendChild(nameGroup);

      var hostGroup = document.createElement('div');
      hostGroup.classList.add('control-group');
      hostGroup.appendChild(hostControl);
      hostGroup.appendChild(portControl);
      divRequired.appendChild(hostGroup);

      var protocolGroup = document.createElement('div');
      protocolGroup.classList.add('control-group');
      protocolGroup.appendChild(protocolControl);
      protocolGroup.appendChild(self.protocolEncryptionControl);
      protocolGroup.appendChild(logonTypeControl);
      divRequired.appendChild(protocolGroup);

      var usernameControl = document.createElement('div');
      usernameControl.classList.add('controls');
      usernameControl.classList.add('username');
      usernameControl.appendChild(userLabel);
      usernameControl.appendChild(self.userInput.element);

      self.passwordControl = document.createElement('div');
      self.passwordControl.classList.add('controls');
      self.passwordControl.classList.add('password');
      self.passwordControl.appendChild(passwordLabel);
      self.passwordControl.appendChild(self.passwordInput.element);

      var credentialGroup = document.createElement('div');
      credentialGroup.classList.add('control-group');
      credentialGroup.appendChild(usernameControl);
      credentialGroup.appendChild(self.passwordControl);
      divRequired.appendChild(credentialGroup);

      self.privatekeyfileControl = document.createElement('div');
      self.privatekeyfileControl.classList.add('controls');
      self.privatekeyfileControl.classList.add('privatekeyfile');
      self.privatekeyfileControl.appendChild(privatekeyfileLabel);
      self.privatekeyfileControl.appendChild(self.privatekeyfileInput.element);

      var remoteControl = document.createElement('div');
      remoteControl.classList.add('controls');
      remoteControl.classList.add('remote');
      remoteControl.appendChild(remoteLabel);
      remoteControl.appendChild(self.remoteInput.element);

      var advancedSettingsGroup = document.createElement('div');
      advancedSettingsGroup.classList.add('control-group');
      advancedSettingsGroup.appendChild(self.privatekeyfileControl);
      advancedSettingsGroup.appendChild(remoteControl);
      divRequired.appendChild(advancedSettingsGroup);

      // Events
      self.nameInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].name = self.nameInput.getText().trim();
          self.selectServer.selectedOptions[0].text = self.nameInput.getText().trim();
        }
      });
      self.hostInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].host = self.hostInput.getText().trim();
        }
      });
      self.portInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].port = self.portInput.getText().trim();
        }
      });

      self.folderSelect.addEventListener('change', function (event) {
        if (Storage.getFolders().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          var option = event.currentTarget.selectedOptions[0];
          Storage.getServers()[index].parent = parseInt(option.value);
        }
      });

      self.folderEdit.addEventListener('click', function (event) {
        self.editFolders();
      });

      self.protocolSelect.addEventListener('change', function (event) {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          var option = event.currentTarget.selectedOptions[0];

          if (option.value == 'sftp') {
            Storage.getServers()[index].sftp = true;
            Storage.getServers()[index].secure = false;
          } else {
            Storage.getServers()[index].logon = 'credentials';
            Storage.getServers()[index].sftp = false;
            Storage.getServers()[index].useAgent = false;
            Storage.getServers()[index].privatekeyfile = '';
          }
          self.fillInputFields(Storage.getServers()[index]);
        }
      });

      self.protocolEncryptionSelect.addEventListener('change', function (event) {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          var option = event.currentTarget.selectedOptions[0];

          if (option.value == 'explicit') {
            Storage.getServers()[index].secure = true;
          } else if (option.value == 'implicit') {
            Storage.getServers()[index].secure = 'implicit';
          } else {
            Storage.getServers()[index].secure = false;
          }
          self.fillInputFields(Storage.getServers()[index]);
        }
      });

      self.logonTypeSelect.addEventListener('change', function (event) {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          var option = event.currentTarget.selectedOptions[0];

          if (option.value == 'credentials') {
            Storage.getServers()[index].logon = 'credentials';
            Storage.getServers()[index].useAgent = false;
            Storage.getServers()[index].privatekeyfile = '';
          } else if (option.value == 'keyfile') {
            Storage.getServers()[index].logon = 'keyfile';
            Storage.getServers()[index].useAgent = false;
          } else if (option.value == 'agent') {
            Storage.getServers()[index].logon = 'agent';
            Storage.getServers()[index].useAgent = true;
            Storage.getServers()[index].privatekeyfile = '';
            Storage.getServers()[index].password = '';
          } else {
            Storage.getServers()[index].useAgent = false;
          }
          self.fillInputFields(Storage.getServers()[index]);
        }
      });

      self.userInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].user = self.userInput.getText().trim();
        }
      });

      var changing = false;
      var passwordModel = self.passwordInput.getModel();
      passwordModel.clearTextPassword = new _atom.TextBuffer('');
      passwordModel.buffer.onDidChange(function (obj) {
        if (!changing) {
          changing = true;
          passwordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
          passwordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));

          if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
            var index = self.selectServer.selectedOptions[0].value;
            Storage.getServers()[index].password = passwordModel.clearTextPassword.getText().trim();
          }

          changing = false;
        }
      });

      self.privatekeyfileInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].privatekeyfile = self.privatekeyfileInput.getText().trim();
        }
      });
      self.remoteInput.getModel().onDidChange(function () {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var index = self.selectServer.selectedOptions[0].value;
          Storage.getServers()[index].remote = self.remoteInput.getText().trim();
        }
      });

      // Handle keydown by tab events to switch between fields
      self.nameInput.getModel().getElement().addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          (0, _atomSpacePenViews.$)(self.folderSelect).focus();
        }
      });

      self.folderSelect.addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.hostInput.focus();
        }
      });

      self.hostInput.getModel().getElement().addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.portInput.focus();
        }
      });

      self.logonTypeSelect.addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.userInput.focus();
        }
      });

      self.userInput.getModel().getElement().addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          if (Storage.getServers().length !== 0) {
            var option = self.logonTypeSelect.selectedOptions[0].value;
            if (option == 'credentials') {
              self.passwordInput.focus();
            } else if (option == 'keyfile') {
              self.passwordInput.focus();
            } else if (option == 'agent') {
              self.remoteInput.focus();
            }
          }
        }
      });

      self.passwordInput.getModel().getElement().addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          if (Storage.getServers().length !== 0) {
            var option = self.logonTypeSelect.selectedOptions[0].value;
            if (option == 'credentials') {
              self.remoteInput.focus();
            } else if (option == 'keyfile') {
              self.privatekeyfileInput.focus();
            } else if (option == 'agent') {
              self.remoteInput.focus();
            }
          }
        }
      });

      self.privatekeyfileInput.getModel().getElement().addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.remoteInput.focus();
        }
      });

      return divRequired;
    }
  }, {
    key: 'createControlsFolderSelect',
    value: function createControlsFolderSelect() {
      var self = this;

      var selected_value = self.folderSelect.value;

      while (self.folderSelect.firstChild) {
        self.folderSelect.removeChild(self.folderSelect.firstChild);
      }

      var optionNone = document.createElement("option");
      optionNone.text = '- None -';
      optionNone.value = null;
      self.folderSelect.add(optionNone);

      Storage.getFoldersStructuredByTree().forEach(function (config) {
        var folder_option = document.createElement("option");
        folder_option.text = config.name;
        folder_option.value = config.id;
        self.folderSelect.add(folder_option);
      });

      self.folderSelect.value = selected_value;
    }
  }, {
    key: 'createServerSelect',
    value: function createServerSelect() {
      var self = this;

      var div = document.createElement('div');
      div.classList.add('server');
      div.style.marginBottom = '20px';

      var select = document.createElement('select');
      select.classList.add('form-control');
      self.selectServer = select;
      self.selectServer.focus();

      var serverControl = document.createElement('div');
      serverControl.classList.add('controls');
      serverControl.classList.add('server');
      serverControl.appendChild(self.selectServer);

      var newButton = document.createElement('button');
      newButton.textContent = 'New';
      newButton.classList.add('btn');

      self.deleteButton = document.createElement('button');
      self.deleteButton.textContent = 'Delete';
      self.deleteButton.classList.add('btn');

      self.duplicateButton = document.createElement('button');
      self.duplicateButton.textContent = 'Duplicate';
      self.duplicateButton.classList.add('btn');

      self.testButton = document.createElement('button');
      self.testButton.textContent = 'Test';
      self.testButton.classList.add('btn');

      var buttonControl = document.createElement('div');
      buttonControl.classList.add('controls');
      buttonControl.classList.add('server-button');
      buttonControl.appendChild(newButton);
      buttonControl.appendChild(self.deleteButton);
      buttonControl.appendChild(self.duplicateButton);
      buttonControl.appendChild(self.testButton);

      var serverGroup = document.createElement('div');
      serverGroup.classList.add('control-group');
      serverGroup.appendChild(serverControl);
      serverGroup.appendChild(buttonControl);

      div.appendChild(serverGroup);

      // Events
      select.addEventListener('change', function (event) {
        if (Storage.getServers().length !== 0 && !self.disableEventhandler) {
          var option = event.currentTarget.selectedOptions[0];
          var indexInArray = option.value;

          self.fillInputFields(indexInArray ? Storage.getServers()[indexInArray] : null);
        }
      });

      newButton.addEventListener('click', function (event) {
        self['new']();
      });

      self.deleteButton.addEventListener('click', function (event) {
        self['delete']();
      });

      self.duplicateButton.addEventListener('click', function (event) {
        self.duplicate();
      });

      self.testButton.addEventListener('click', function (event) {
        self.test();
      });

      // Handle keydown by tab events to switch between fields
      self.testButton.addEventListener('keydown', function (event) {
        if (event.key == 'Tab') {
          event.preventDefault();
          self.nameInput.focus();
        }
      });

      return div;
    }
  }, {
    key: 'reload',
    value: function reload() {
      var selectedServer = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      self.disableEventhandler = true;

      self.createControlsFolderSelect();

      while (self.selectServer.firstChild) {
        self.selectServer.removeChild(self.selectServer.firstChild);
      }

      var selectedIndex = 0;
      if (Storage.getServers().length !== 0) {
        Storage.getServers().forEach(function (item, index) {
          var option = document.createElement("option");
          option.text = item.name;
          option.value = index;
          self.selectServer.add(option);

          if (selectedServer && typeof selectedServer.config !== 'undefined' && selectedServer.config.host !== 'undefined') {
            if (selectedServer.config.host == item.host && selectedServer.config.name == item.name) {
              selectedIndex = index;
            }
          }
        });

        self.selectServer.selectedIndex = selectedIndex;
        self.fillInputFields(Storage.getServers()[selectedIndex]);

        // Enable Input Fields
        self.enableInputFields();
      } else {
        self.fillInputFields();

        // Disable Input Fields
        self.disableInputFields();
      }
      self.disableEventhandler = false;
    }
  }, {
    key: 'attach',
    value: function attach() {
      var self = this;

      self.panel = atom.workspace.addModalPanel({
        item: self
      });

      // Resize content to fit on smaller displays
      var body = document.body.offsetHeight;
      var content = self.panel.element.offsetHeight;
      var offset = (0, _atomSpacePenViews.$)(self.panel.element).position().top;

      if (content + 2 * offset > body) {
        var settings = self.content.find('.server-settings')[0];
        var height = 2 * offset + content - body;
        (0, _atomSpacePenViews.$)(settings).height((0, _atomSpacePenViews.$)(settings).height() - height);
      }
    }
  }, {
    key: 'close',
    value: function close() {
      var self = this;

      var destroyPanel = this.panel;
      this.panel = null;
      if (destroyPanel) {
        destroyPanel.destroy();
      }

      Storage.load(true);

      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.close();
    }
  }, {
    key: 'showError',
    value: function showError(message) {
      this.error.text(message);
      if (message) {
        this.flashError();
      }
    }
  }, {
    key: 'fillInputFields',
    value: function fillInputFields() {
      var server = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      self.disableEventhandler = true;

      if (server) {
        self.nameInput.setText(server.name ? server.name : server.host);
        self.hostInput.setText(server.host);
        self.portInput.setText(server.port);
        if (Storage.getFolder(server.parent)) {
          self.folderSelect.value = Storage.getFolder(server.parent).id;
        } else {
          self.folderSelect.value = 'null';
        }

        if (server.sftp) {
          self.protocolSelect.selectedIndex = 1;
          self.portInput.element.setAttribute('placeholder-text', '22');

          self.protocolEncryptionSelect.selectedIndex = 0;

          self.logonTypeSelect.options[1].disabled = false;
          self.logonTypeSelect.options[2].disabled = false;

          self.protocolEncryptionControl.setAttribute("style", "display:none;");
        } else {
          self.protocolSelect.selectedIndex = 0;

          if (server.secure === 'implicit') {
            self.protocolEncryptionSelect.selectedIndex = 2;
            self.portInput.element.setAttribute('placeholder-text', '990');
          } else if (server.secure === true) {
            self.protocolEncryptionSelect.selectedIndex = 1;
            self.portInput.element.setAttribute('placeholder-text', '21');
          } else {
            self.protocolEncryptionSelect.selectedIndex = 0;
            self.portInput.element.setAttribute('placeholder-text', '21');
          }

          self.logonTypeSelect.selectedIndex = 0; // Username/Password
          self.logonTypeSelect.options[1].disabled = true;
          self.logonTypeSelect.options[2].disabled = true;

          self.protocolEncryptionControl.removeAttribute("style");
        }

        if (server.logon == 'keyfile') {
          self.logonTypeSelect.selectedIndex = 1; // Keyfile
          self.passwordControl.removeAttribute("style");
          self.privatekeyfileControl.removeAttribute("style");
        } else if (server.logon == 'agent') {
          self.logonTypeSelect.selectedIndex = 2; // SSH Agent
          self.passwordControl.setAttribute("style", "display:none;");
          self.privatekeyfileControl.setAttribute("style", "display:none;");
        } else {
          self.logonTypeSelect.selectedIndex = 0; // Username/Password
          self.passwordControl.removeAttribute("style");
          self.privatekeyfileControl.setAttribute("style", "display:none;");
        }

        self.userInput.setText(server.user);
        self.passwordInput.setText(server.password);
        self.privatekeyfileInput.setText(server.privatekeyfile ? server.privatekeyfile : '');
        self.remoteInput.setText(server.remote ? server.remote : '/');
      } else {
        self.nameInput.setText('');
        self.hostInput.setText('');
        self.portInput.setText('');

        self.protocolSelect.selectedIndex = 0;
        self.protocolEncryptionSelect.selectedIndex = 0;
        self.logonTypeSelect.selectedIndex = 0;

        self.userInput.setText('');
        self.passwordInput.setText('');
        self.privatekeyfileInput.setText('');
        self.remoteInput.setText('');

        self.privatekeyfileControl.setAttribute("style", "display:none;");
      }

      self.disableEventhandler = false;
    }
  }, {
    key: 'enableInputFields',
    value: function enableInputFields() {
      var self = this;

      self.deleteButton.classList.remove('disabled');
      self.deleteButton.disabled = false;

      self.duplicateButton.classList.remove('disabled');
      self.duplicateButton.disabled = false;

      self.testButton.classList.remove('disabled');
      self.testButton.disabled = false;

      self.nameInput[0].classList.remove('disabled');
      self.nameInput.disabled = false;

      self.folderSelect.classList.remove('disabled');
      self.folderSelect.disabled = false;

      self.hostInput[0].classList.remove('disabled');
      self.hostInput.disabled = false;

      self.portInput[0].classList.remove('disabled');
      self.portInput.disabled = false;

      self.protocolSelect.classList.remove('disabled');
      self.protocolSelect.disabled = false;

      self.logonTypeSelect.classList.remove('disabled');
      self.logonTypeSelect.disabled = false;

      self.userInput[0].classList.remove('disabled');
      self.userInput.disabled = false;

      self.passwordInput[0].classList.remove('disabled');
      self.passwordInput.disabled = false;

      self.privatekeyfileInput[0].classList.remove('disabled');
      self.privatekeyfileInput.disabled = false;

      self.remoteInput[0].classList.remove('disabled');
      self.remoteInput.disabled = false;
    }
  }, {
    key: 'disableInputFields',
    value: function disableInputFields() {
      var self = this;

      self.deleteButton.classList.add('disabled');
      self.deleteButton.disabled = true;

      self.duplicateButton.classList.add('disabled');
      self.duplicateButton.disabled = true;

      self.testButton.classList.add('disabled');
      self.testButton.disabled = true;

      self.nameInput[0].classList.add('disabled');
      self.nameInput.disabled = true;

      self.folderSelect.classList.add('disabled');
      self.folderSelect.disabled = true;

      self.hostInput[0].classList.add('disabled');
      self.hostInput.disabled = true;

      self.portInput[0].classList.add('disabled');
      self.portInput.disabled = true;

      self.protocolSelect.classList.add('disabled');
      self.protocolSelect.disabled = true;

      self.logonTypeSelect.classList.add('disabled');
      self.logonTypeSelect.disabled = true;

      self.userInput[0].classList.add('disabled');
      self.userInput.disabled = true;

      self.passwordInput[0].classList.add('disabled');
      self.passwordInput.disabled = true;

      self.privatekeyfileInput[0].classList.add('disabled');
      self.privatekeyfileInput.disabled = true;

      self.remoteInput[0].classList.add('disabled');
      self.remoteInput.disabled = true;

      var changing = false;
      self.nameInput.getModel().onDidChange(function () {
        if (!changing && self.nameInput.disabled) {
          changing = true;
          self.nameInput.setText('');
          changing = false;
        }
      });
      self.hostInput.getModel().onDidChange(function () {
        if (!changing && self.hostInput.disabled) {
          changing = true;
          self.hostInput.setText('');
          changing = false;
        }
      });
      self.portInput.getModel().onDidChange(function () {
        if (!changing && self.portInput.disabled) {
          changing = true;
          self.portInput.setText('');
          changing = false;
        }
      });
      self.userInput.getModel().onDidChange(function () {
        if (!changing && self.userInput.disabled) {
          changing = true;
          self.userInput.setText('');
          changing = false;
        }
      });
      self.passwordInput.getModel().onDidChange(function () {
        if (!changing && self.passwordInput.disabled) {
          changing = true;
          self.passwordInput.setText('');
          changing = false;
        }
      });
      self.privatekeyfileInput.getModel().onDidChange(function () {
        if (!changing && self.privatekeyfileInput.disabled) {
          changing = true;
          self.privatekeyfileInput.setText('');
          changing = false;
        }
      });
      self.remoteInput.getModel().onDidChange(function () {
        if (!changing && self.remoteInput.disabled) {
          changing = true;
          self.remoteInput.setText('');
          changing = false;
        }
      });
    }
  }, {
    key: 'test',
    value: function test() {
      var self = this;

      if (Storage.getServers().length == 0) return;

      try {
        (function () {
          var index = self.selectServer.selectedOptions[0].value;
          var config = JSON.parse(JSON.stringify(Storage.getServers()[index]));

          var connector = new _connectorsConnectorJs2['default'](config);

          connector.on('debug', function (cmd, param1, param2) {
            if (atom.config.get('ftp-remote-edit.dev.debug')) {
              if (param1 && param2) {
                console.log(cmd, param1, param2);
              } else if (param1) {
                console.log(cmd, param1);
              } else if (cmd) console.log(cmd);
            }
          });

          connector.connect().then(function () {
            (0, _helperHelperJs.showMessage)('Connection could be established successfully');
            connector.disconnect(null)['catch'](function () {});
            connector.destroy();
          })['catch'](function (err) {
            (0, _helperHelperJs.showMessage)(err, 'error');
            connector.disconnect(null)['catch'](function () {});
            connector.destroy();
          });
        })();
      } catch (e) {}
    }
  }, {
    key: 'new',
    value: function _new() {
      var self = this;

      self.enableInputFields();

      var newconfig = JSON.parse(JSON.stringify(config));
      newconfig.name = config.name + " " + (Storage.getServers().length + 1);
      Storage.addServer(newconfig);

      var option = document.createElement('option');
      option.text = newconfig.name;
      option.value = Storage.getServers().length - 1;

      this.selectServer.add(option);
      this.selectServer.value = Storage.getServers().length - 1;
      this.selectServer.dispatchEvent(new Event('change'));
      self.nameInput.focus();
    }
  }, {
    key: 'save',
    value: function save() {
      var self = this;
      Storage.save();
      self.close();
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var self = this;

      if (Storage.getServers().length == 0) return;

      var index = self.selectServer.selectedOptions[0].value;
      Storage.deleteServer(index);

      self.reload();
      self.selectServer.focus();
    }
  }, {
    key: 'duplicate',
    value: function duplicate() {
      var self = this;

      if (Storage.getServers().length == 0) return;

      var index = self.selectServer.selectedOptions[0].value;

      self.enableInputFields();

      var newconfig = JSON.parse(JSON.stringify(Storage.getServers()[index]));
      newconfig.name = newconfig.name + " " + (Storage.getServers().length + 1);
      Storage.addServer(newconfig);

      var option = document.createElement('option');
      option.text = newconfig.name;
      option.value = Storage.getServers().length - 1;

      this.selectServer.add(option);
      this.selectServer.value = Storage.getServers().length - 1;
      this.selectServer.dispatchEvent(new Event('change'));
      self.nameInput.focus();
    }
  }, {
    key: 'import',
    value: function _import() {
      var self = this;
      var importHandler = new _helperImportJs2['default']();

      importHandler.onFinished = function (statistic) {
        var detail = [];

        if (statistic.createdServers) {
          detail.push(statistic.createdServers + " New Server(s)");
        }
        if (statistic.updatedServers) {
          detail.push(statistic.updatedServers + " Updated Server(s)");
        }
        if (statistic.createdFolders) {
          detail.push(statistic.createdFolders + " New Folder(s)");
        }

        atom.notifications.addSuccess('Import completed', {
          detail: 'Imported: ' + detail.join(', ') + '.',
          dismissable: true
        });

        self.reload();
      };

      importHandler.onWarning = function (error) {
        // TODO
      };

      importHandler.onError = function (error) {
        atom.notifications.addError('An error occurred during import.', {
          detail: error.message,
          dismissable: true
        });
      };

      importHandler['import']();
    }
  }, {
    key: 'editFolders',
    value: function editFolders() {
      var self = this;

      var folderConfigurationView = new _viewsFolderConfigurationView2['default']('', true);

      var index = self.folderSelect.selectedOptions[0].value;

      if (index > 0) {
        var folder = Storage.getFolder(index);
        folderConfigurationView.reload(folder);
      } else if (Storage.getFolders().length > 0) {
        var folder = Storage.getFolders()[0];
        folderConfigurationView.reload(folder);
      }

      folderConfigurationView.on('close', function (e) {
        self.createControlsFolderSelect();
        self.attach();
      });

      folderConfigurationView.attach();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({
        'class': 'ftp-remote-edit settings-view overlay from-top'
      }, function () {
        _this.div({
          'class': 'panels'
        }, function () {
          _this.div({
            'class': 'panels-item'
          }, function () {
            _this.label({
              'class': 'icon',
              outlet: 'info'
            });
            _this.div({
              'class': 'panels-content',
              outlet: 'content'
            });
            _this.div({
              'class': 'panels-footer',
              outlet: 'footer'
            });
          });
        });
        _this.div({
          'class': 'error-message',
          outlet: 'error'
        });
      });
    }
  }]);

  return ConfigurationView;
})(_atomSpacePenViews.View);

exports['default'] = ConfigurationView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9jb25maWd1cmF0aW9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7aUNBRXdDLHNCQUFzQjs7b0JBQ2QsTUFBTTs7OEJBQzFCLHVCQUF1Qjs7cUNBQzdCLDhCQUE4Qjs7Ozs4QkFDakMsdUJBQXVCOzs7OzRDQUNOLHNDQUFzQzs7OztBQVAxRSxXQUFXLENBQUM7O0FBU1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUN6RCxJQUFNLFdBQVcsR0FBRyxTQUFTLEdBQUcscUNBQXFDLENBQUM7QUFDdEUsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0lBRTdCLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzsrQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQWlDMUIsc0JBQUc7QUFDWCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7O0FBRWpDLFVBQUksSUFBSSxHQUFHLHdDQUF3QyxDQUFDO0FBQ3BELFVBQUksSUFBSSw2R0FBNkcsQ0FBQztBQUN0SCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxnQkFBVSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDaEMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVo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LGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELHFCQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxxQkFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMscUJBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMscUJBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0QsVUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxxQkFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0MscUJBQWUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0MscUJBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xELGlCQUFXLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV6QyxVQUFJLENBQUMscUJBQXFCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM1RCxVQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFekUsVUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxtQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsbUJBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLG1CQUFhLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLG1CQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXBELFVBQUkscUJBQXFCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCwyQkFBcUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELDJCQUFxQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM5RCwyQkFBcUIsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakQsaUJBQVcsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7O0FBRy9DLFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDMUMsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuRSxjQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM3RTtPQUNGLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDMUMsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNwRTtPQUNGLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDMUMsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMs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RUFBRSxDQUFDLENBQUM7QUFDL0IsWUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFN0IsWUFBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7T0FDbkU7O0FBRUQsVUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztLQUNsQzs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFakMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFaEMsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUs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QUFDO1NBQ2xCO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUMxQyxZQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3hDLGtCQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGtCQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ2xCO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUMxQyxZQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3hDLGtCQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGtCQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ2xCO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUMxQyxZQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3hDLGtCQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGtCQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ2xCO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUM5QyxZQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQzVDLGtCQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksQ0FBQyxhQUFhLENBQUMs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QUFPLFFBQVE7U0FDaEIsRUFBRSxZQUFNO0FBQ1AsZ0JBQUssR0FBRyxDQUFDO0FBQ1AscUJBQU8sYUFBYTtXQUNyQixFQUFFLFlBQU07QUFDUCxrQkFBSyxLQUFLLENBQUM7QUFDVCx1QkFBTyxNQUFNO0FBQ2Isb0JBQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQyxDQUFDO0FBQ0gsa0JBQUssR0FBRyxDQUFDO0FBQ1AsdUJBQU8sZ0JBQWdCO0FBQ3ZCLG9CQUFNLEVBQUUsU0FBUzthQUNsQixDQUFDLENBQUM7QUFDSCxrQkFBSyxHQUFHLENBQUM7QUFDUCx1QkFBTyxlQUFlO0FBQ3RCLG9CQUFNLEVBQUUsUUFBUTthQUNqQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7QUFDSCxjQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLGVBQWU7QUFDdEIsZ0JBQU0sRUFBRSxPQUFPO1NBQ2hCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0EvQmtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL3ZpZXdzL2NvbmZpZ3VyYXRpb24tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyAkLCBWaWV3LCBUZXh0RWRpdG9yVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IFRleHRCdWZmZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IHNob3dNZXNzYWdlIH0gZnJvbSAnLi8uLi9oZWxwZXIvaGVscGVyLmpzJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi8uLi9jb25uZWN0b3JzL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgSW1wb3J0IGZyb20gJy4vLi4vaGVscGVyL2ltcG9ydC5qcyc7XG5pbXBvcnQgRm9sZGVyQ29uZmlndXJhdGlvblZpZXcgZnJvbSAnLi8uLi92aWV3cy9mb2xkZXItY29uZmlndXJhdGlvbi12aWV3JztcblxuY29uc3QgYXRvbSA9IGdsb2JhbC5hdG9tO1xuY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi8uLi9jb25maWcvc2VydmVyLXNjaGVtYS5qc29uJyk7XG5jb25zdCBkZWJ1Z0NvbmZpZyA9IF9fZGlybmFtZSArICcuLy4uL2NvbmZpZy9zZXJ2ZXItdGVzdC1zY2hlbWEuanNvbic7XG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi8uLi9oZWxwZXIvc3RvcmFnZS5qcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWd1cmF0aW9uVmlldyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdCBzZXR0aW5ncy12aWV3IG92ZXJsYXkgZnJvbS10b3AnXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ3BhbmVscycsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3BhbmVscy1pdGVtJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoe1xuICAgICAgICAgICAgY2xhc3M6ICdpY29uJyxcbiAgICAgICAgICAgIG91dGxldDogJ2luZm8nLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICAgIGNsYXNzOiAncGFuZWxzLWNvbnRlbnQnLFxuICAgICAgICAgICAgb3V0bGV0OiAnY29udGVudCcsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5kaXYoe1xuICAgICAgICAgICAgY2xhc3M6ICdwYW5lbHMtZm9vdGVyJyxcbiAgICAgICAgICAgIG91dGxldDogJ2Zvb3RlcicsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAnZXJyb3ItbWVzc2FnZScsXG4gICAgICAgIG91dGxldDogJ2Vycm9yJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG5cbiAgICBsZXQgaHRtbCA9ICc8cD5GdHAtUmVtb3RlLUVkaXQgU2VydmVyIFNldHRpbmdzPC9wPic7XG4gICAgaHRtbCArPSBcIjxwPllvdSBjYW4gZWRpdCBlYWNoIGNvbm5lY3Rpb24gYXQgdGhlIHRpbWUuIEFsbCBjaGFuZ2VzIHdpbGwgb25seSBiZSBzYXZlZCBieSBwdXNoaW5nIHRoZSBzYXZlIGJ1dHRvbi48L3A+XCI7XG4gICAgc2VsZi5pbmZvLmh0bWwoaHRtbCk7XG5cbiAgICBsZXQgc2F2ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNhdmVCdXR0b24udGV4dENvbnRlbnQgPSAnU2F2ZSc7XG4gICAgc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIGxldCBpbXBvcnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBpbXBvcnRCdXR0b24udGV4dENvbnRlbnQgPSAnSW1wb3J0JztcbiAgICBpbXBvcnRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBsZXQgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjbG9zZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdDYW5jZWwnO1xuICAgIGNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3B1bGwtcmlnaHQnKTtcblxuICAgIHNlbGYuY29udGVudC5hcHBlbmQoc2VsZi5jcmVhdGVTZXJ2ZXJTZWxlY3QoKSk7XG4gICAgc2VsZi5jb250ZW50LmFwcGVuZChzZWxmLmNyZWF0ZUNvbnRyb2xzKCkpO1xuXG4gICAgc2VsZi5mb290ZXIuYXBwZW5kKHNhdmVCdXR0b24pO1xuICAgIHNlbGYuZm9vdGVyLmFwcGVuZChpbXBvcnRCdXR0b24pO1xuICAgIHNlbGYuZm9vdGVyLmFwcGVuZChjbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBFdmVudHNcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5zYXZlKCk7XG4gICAgICBzZWxmLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBpbXBvcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuaW1wb3J0KCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHNlbGYuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICAvLyBzZWxmLnNhdmUoKTtcbiAgICAgIH0sXG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB7XG4gICAgICAgIHNlbGYuY2FuY2VsKCk7XG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIC8vIEhhbmRsZSBrZXlkb3duIGJ5IHRhYiBldmVudHMgdG8gc3dpdGNoIGJldHdlZW4gZmllbGRzXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxmLnNlbGVjdFNlcnZlci5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHNlbGYuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGRpdlJlcXVpcmVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2UmVxdWlyZWQuY2xhc3NMaXN0LmFkZCgnc2VydmVyLXNldHRpbmdzJyk7XG5cbiAgICBsZXQgbmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBuYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBuYW1lTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5hbWVMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ1RoZSBuYW1lIG9mIHRoZSBzZXJ2ZXIuJztcbiAgICBuYW1lTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgbmFtZUxhYmVsLmFwcGVuZENoaWxkKG5hbWVMYWJlbFRpdGxlKTtcbiAgICBzZWxmLm5hbWVJbnB1dCA9IG5ldyBUZXh0RWRpdG9yVmlldyh7IG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCJuYW1lXCIgfSk7XG4gICAgc2VsZi5uYW1lSW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcblxuICAgIGxldCBmb2xkZXJMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgZm9sZGVyTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBmb2xkZXJMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9sZGVyTGFiZWxUaXRsZS50ZXh0Q29udGVudCA9ICdGb2xkZXInO1xuICAgIGZvbGRlckxhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIGZvbGRlckxhYmVsLmFwcGVuZENoaWxkKGZvbGRlckxhYmVsVGl0bGUpO1xuXG4gICAgc2VsZi5mb2xkZXJTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzZWxmLmZvbGRlclNlbGVjdC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcbiAgICBzZWxmLmNyZWF0ZUNvbnRyb2xzRm9sZGVyU2VsZWN0KCk7XG5cbiAgICBzZWxmLmZvbGRlckVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZWxmLmZvbGRlckVkaXQudGV4dENvbnRlbnQgPSAnRWRpdCc7XG4gICAgc2VsZi5mb2xkZXJFZGl0LmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgbGV0IGhvc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgaG9zdExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgaG9zdExhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3N0TGFiZWxUaXRsZS50ZXh0Q29udGVudCA9ICdUaGUgaG9zdG5hbWUgb3IgSVAgYWRkcmVzcyBvZiB0aGUgc2VydmVyLic7XG4gICAgaG9zdExhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIGhvc3RMYWJlbC5hcHBlbmRDaGlsZChob3N0TGFiZWxUaXRsZSk7XG4gICAgc2VsZi5ob3N0SW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwibG9jYWxob3N0XCIgfSk7XG4gICAgc2VsZi5ob3N0SW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcblxuICAgIGxldCBwb3J0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHBvcnRMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHBvcnRMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9ydExhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnUG9ydCc7XG4gICAgcG9ydExhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIHBvcnRMYWJlbC5hcHBlbmRDaGlsZChwb3J0TGFiZWxUaXRsZSk7XG4gICAgc2VsZi5wb3J0SW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwiMjFcIiB9KTtcbiAgICBzZWxmLnBvcnRJbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuXG4gICAgbGV0IHByb3RvY29sTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHByb3RvY29sTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBwcm90b2NvbExhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbExhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnUHJvdG9jb2wnO1xuICAgIHByb3RvY29sTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgcHJvdG9jb2xMYWJlbC5hcHBlbmRDaGlsZChwcm90b2NvbExhYmVsVGl0bGUpO1xuXG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG4gICAgbGV0IG9wdGlvbkZUUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uRlRQLnRleHQgPSAnRlRQIC0gRmlsZSBUcmFuc2ZlciBQcm90b2NvbCc7XG4gICAgb3B0aW9uRlRQLnZhbHVlID0gJ2Z0cCc7XG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdC5hZGQob3B0aW9uRlRQKTtcbiAgICBsZXQgb3B0aW9uU0ZUUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uU0ZUUC50ZXh0ID0gJ1NGVFAgLSBTU0ggRmlsZSBUcmFuc2ZlciBQcm90b2NvbCc7XG4gICAgb3B0aW9uU0ZUUC52YWx1ZSA9ICdzZnRwJztcbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmFkZChvcHRpb25TRlRQKTtcbiAgICBsZXQgcHJvdG9jb2xTZWxlY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbFNlbGVjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzZWxlY3QtY29udGFpbmVyJyk7XG4gICAgcHJvdG9jb2xTZWxlY3RDb250YWluZXIuYXBwZW5kQ2hpbGQoc2VsZi5wcm90b2NvbFNlbGVjdCk7XG5cbiAgICBsZXQgcHJvdG9jb2xFbmNyeXB0aW9uTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHByb3RvY29sRW5jcnlwdGlvbkxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgcHJvdG9jb2xFbmNyeXB0aW9uTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb3RvY29sRW5jcnlwdGlvbkxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnRW5jcnlwdGlvbic7XG4gICAgcHJvdG9jb2xFbmNyeXB0aW9uTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgcHJvdG9jb2xFbmNyeXB0aW9uTGFiZWwuYXBwZW5kQ2hpbGQocHJvdG9jb2xFbmNyeXB0aW9uTGFiZWxUaXRsZSk7XG5cbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuICAgIGxldCBvcHRpb25QbGFpbkZUUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uUGxhaW5GVFAudGV4dCA9ICdPbmx5IHVzZSBwbGFpbiBGVFAgKGluc2VjdXJlKSc7XG4gICAgb3B0aW9uUGxhaW5GVFAudmFsdWUgPSAnbm9uZSc7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3QuYWRkKG9wdGlvblBsYWluRlRQKTtcbiAgICBsZXQgb3B0aW9uRXhwbGljaXRTRlRQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHRpb25FeHBsaWNpdFNGVFAudGV4dCA9ICdSZXF1aXJlIGV4cGxpY2l0IEZUUCBvdmVyIFRMUyc7XG4gICAgb3B0aW9uRXhwbGljaXRTRlRQLnZhbHVlID0gJ2V4cGxpY2l0JztcbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdC5hZGQob3B0aW9uRXhwbGljaXRTRlRQKTtcbiAgICBsZXQgb3B0aW9uSW1wbGljaXRTRlRQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHRpb25JbXBsaWNpdFNGVFAudGV4dCA9ICdSZXF1aXJlIGltcGxpY2l0IEZUUCBvdmVyIFRMUyAobm90IGltcGxlbWVudGVkKSc7XG4gICAgb3B0aW9uSW1wbGljaXRTRlRQLnZhbHVlID0gJ2ltcGxpY2l0JztcbiAgICBvcHRpb25JbXBsaWNpdFNGVFAuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LmFkZChvcHRpb25JbXBsaWNpdFNGVFApO1xuICAgIGxldCBwcm90b2NvbEVuY3J5cHRpb25TZWxlY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbEVuY3J5cHRpb25TZWxlY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0LWNvbnRhaW5lcicpO1xuICAgIHByb3RvY29sRW5jcnlwdGlvblNlbGVjdENvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdCk7XG5cbiAgICBsZXQgbG9nb25UeXBlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGxvZ29uVHlwZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgbG9nb25UeXBlTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxvZ29uVHlwZUxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnTG9nb24gVHlwZSc7XG4gICAgbG9nb25UeXBlTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgbG9nb25UeXBlTGFiZWwuYXBwZW5kQ2hpbGQobG9nb25UeXBlTGFiZWxUaXRsZSk7XG5cbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuICAgIGxldCBvcHRpb25Ob3JtYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbk5vcm1hbC50ZXh0ID0gJ1VzZXJuYW1lIC8gUGFzc3dvcmQnO1xuICAgIG9wdGlvbk5vcm1hbC52YWx1ZSA9ICdjcmVkZW50aWFscyc7XG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuYWRkKG9wdGlvbk5vcm1hbCk7XG4gICAgbGV0IG9wdGlvbktleUZpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbktleUZpbGUudGV4dCA9ICdLZXlmaWxlIChPcGVuU1NIIGZvcm1hdCAtIFBFTSknO1xuICAgIG9wdGlvbktleUZpbGUudmFsdWUgPSAna2V5ZmlsZSc7XG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuYWRkKG9wdGlvbktleUZpbGUpO1xuICAgIGxldCBvcHRpb25BZ2VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uQWdlbnQudGV4dCA9ICdTU0ggQWdlbnQnO1xuICAgIG9wdGlvbkFnZW50LnZhbHVlID0gJ2FnZW50JztcbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5hZGQob3B0aW9uQWdlbnQpO1xuICAgIGxldCBsb2dvblR5cGVTZWxlY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2dvblR5cGVTZWxlY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0LWNvbnRhaW5lcicpO1xuICAgIGxvZ29uVHlwZVNlbGVjdENvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLmxvZ29uVHlwZVNlbGVjdCk7XG5cbiAgICBsZXQgdXNlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB1c2VyTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCB1c2VyTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHVzZXJMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gYFVzZXJuYW1lIGZvciBhdXRoZW50aWNhdGlvbi5gO1xuICAgIHVzZXJMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICB1c2VyTGFiZWwuYXBwZW5kQ2hpbGQodXNlckxhYmVsVGl0bGUpO1xuICAgIHNlbGYudXNlcklucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcInVzZXJuYW1lXCIgfSk7XG4gICAgc2VsZi51c2VySW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcblxuICAgIGxldCBwYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwYXNzd29yZExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgcGFzc3dvcmRMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGFzc3dvcmRMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gYFBhc3N3b3JkL1Bhc3NwaHJhc2UgZm9yIGF1dGhlbnRpY2F0aW9uLmA7XG4gICAgcGFzc3dvcmRMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBwYXNzd29yZExhYmVsLmFwcGVuZENoaWxkKHBhc3N3b3JkTGFiZWxUaXRsZSk7XG4gICAgc2VsZi5wYXNzd29yZElucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcInBhc3N3b3JkXCIgfSk7XG4gICAgc2VsZi5wYXNzd29yZElucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgcHJpdmF0ZWtleWZpbGVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgcHJpdmF0ZWtleWZpbGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHByaXZhdGVrZXlmaWxlTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByaXZhdGVrZXlmaWxlTGFiZWxUaXRsZS50ZXh0Q29udGVudCA9IGBQYXRoIHRvIHByaXZhdGUga2V5ZmlsZS5gO1xuICAgIHByaXZhdGVrZXlmaWxlTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgcHJpdmF0ZWtleWZpbGVMYWJlbC5hcHBlbmRDaGlsZChwcml2YXRla2V5ZmlsZUxhYmVsVGl0bGUpO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dCA9IG5ldyBUZXh0RWRpdG9yVmlldyh7IG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCJwYXRoIHRvIHByaXZhdGUga2V5ZmlsZVwiIH0pO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuXG4gICAgbGV0IHJlbW90ZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICByZW1vdGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHJlbW90ZUxhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW1vdGVMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gYEluaXRpYWwgRGlyZWN0b3J5LmA7XG4gICAgcmVtb3RlTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgcmVtb3RlTGFiZWwuYXBwZW5kQ2hpbGQocmVtb3RlTGFiZWxUaXRsZSk7XG4gICAgc2VsZi5yZW1vdGVJbnB1dCA9IG5ldyBUZXh0RWRpdG9yVmlldyh7IG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCIvXCIgfSk7XG4gICAgc2VsZi5yZW1vdGVJbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuXG4gICAgbGV0IG5hbWVDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmFtZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBuYW1lQ29udHJvbC5jbGFzc0xpc3QuYWRkKCduYW1lJyk7XG4gICAgbmFtZUNvbnRyb2wuYXBwZW5kQ2hpbGQobmFtZUxhYmVsKTtcbiAgICBuYW1lQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLm5hbWVJbnB1dC5lbGVtZW50KTtcblxuICAgIGxldCBmb2xkZXJDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9sZGVyQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGZvbGRlckNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnZm9sZGVyJyk7XG4gICAgZm9sZGVyQ29udHJvbC5hcHBlbmRDaGlsZChmb2xkZXJMYWJlbCk7XG4gICAgZm9sZGVyQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLmZvbGRlclNlbGVjdCk7XG5cbiAgICBsZXQgZm9sZGVyQnV0dG9uQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvbGRlckJ1dHRvbkNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBmb2xkZXJCdXR0b25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ2ZvbGRlci1idXR0b24nKTtcbiAgICBmb2xkZXJCdXR0b25Db250cm9sLmFwcGVuZENoaWxkKHNlbGYuZm9sZGVyRWRpdCk7XG5cbiAgICBsZXQgaG9zdENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3N0Q29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGhvc3RDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2hvc3QnKTtcbiAgICBob3N0Q29udHJvbC5hcHBlbmRDaGlsZChob3N0TGFiZWwpO1xuICAgIGhvc3RDb250cm9sLmFwcGVuZENoaWxkKHNlbGYuaG9zdElucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IHBvcnRDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9ydENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBwb3J0Q29udHJvbC5jbGFzc0xpc3QuYWRkKCdwb3J0Jyk7XG4gICAgcG9ydENvbnRyb2wuYXBwZW5kQ2hpbGQocG9ydExhYmVsKTtcbiAgICBwb3J0Q29udHJvbC5hcHBlbmRDaGlsZChzZWxmLnBvcnRJbnB1dC5lbGVtZW50KTtcblxuICAgIGxldCBwcm90b2NvbENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBwcm90b2NvbENvbnRyb2wuY2xhc3NMaXN0LmFkZCgncHJvdG9jb2wnKTtcbiAgICBwcm90b2NvbENvbnRyb2wuYXBwZW5kQ2hpbGQocHJvdG9jb2xMYWJlbCk7XG4gICAgcHJvdG9jb2xDb250cm9sLmFwcGVuZENoaWxkKHByb3RvY29sU2VsZWN0Q29udGFpbmVyKTtcblxuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdwcm90b2NvbC1lbmNyeXB0aW9uJyk7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sLmFwcGVuZENoaWxkKHByb3RvY29sRW5jcnlwdGlvbkxhYmVsKTtcbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvbkNvbnRyb2wuYXBwZW5kQ2hpbGQocHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0Q29udGFpbmVyKTtcblxuICAgIGxldCBsb2dvblR5cGVDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbG9nb25UeXBlQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGxvZ29uVHlwZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgncHJvdG9jb2wnKTtcbiAgICBsb2dvblR5cGVDb250cm9sLmFwcGVuZENoaWxkKGxvZ29uVHlwZUxhYmVsKTtcbiAgICBsb2dvblR5cGVDb250cm9sLmFwcGVuZENoaWxkKGxvZ29uVHlwZVNlbGVjdENvbnRhaW5lcik7XG5cbiAgICBsZXQgbmFtZUdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmFtZUdyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBuYW1lR3JvdXAuYXBwZW5kQ2hpbGQobmFtZUNvbnRyb2wpO1xuICAgIG5hbWVHcm91cC5hcHBlbmRDaGlsZChmb2xkZXJDb250cm9sKTtcbiAgICBuYW1lR3JvdXAuYXBwZW5kQ2hpbGQoZm9sZGVyQnV0dG9uQ29udHJvbCk7XG4gICAgZGl2UmVxdWlyZWQuYXBwZW5kQ2hpbGQobmFtZUdyb3VwKTtcblxuICAgIGxldCBob3N0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3N0R3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIGhvc3RHcm91cC5hcHBlbmRDaGlsZChob3N0Q29udHJvbCk7XG4gICAgaG9zdEdyb3VwLmFwcGVuZENoaWxkKHBvcnRDb250cm9sKTtcbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChob3N0R3JvdXApO1xuXG4gICAgbGV0IHByb3RvY29sR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBwcm90b2NvbEdyb3VwLmFwcGVuZENoaWxkKHByb3RvY29sQ29udHJvbCk7XG4gICAgcHJvdG9jb2xHcm91cC5hcHBlbmRDaGlsZChzZWxmLnByb3RvY29sRW5jcnlwdGlvbkNvbnRyb2wpO1xuICAgIHByb3RvY29sR3JvdXAuYXBwZW5kQ2hpbGQobG9nb25UeXBlQ29udHJvbCk7XG4gICAgZGl2UmVxdWlyZWQuYXBwZW5kQ2hpbGQocHJvdG9jb2xHcm91cCk7XG5cbiAgICBsZXQgdXNlcm5hbWVDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdXNlcm5hbWVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgdXNlcm5hbWVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3VzZXJuYW1lJyk7XG4gICAgdXNlcm5hbWVDb250cm9sLmFwcGVuZENoaWxkKHVzZXJMYWJlbCk7XG4gICAgdXNlcm5hbWVDb250cm9sLmFwcGVuZENoaWxkKHNlbGYudXNlcklucHV0LmVsZW1lbnQpO1xuXG4gICAgc2VsZi5wYXNzd29yZENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzZWxmLnBhc3N3b3JkQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHNlbGYucGFzc3dvcmRDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3Bhc3N3b3JkJyk7XG4gICAgc2VsZi5wYXNzd29yZENvbnRyb2wuYXBwZW5kQ2hpbGQocGFzc3dvcmRMYWJlbCk7XG4gICAgc2VsZi5wYXNzd29yZENvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5wYXNzd29yZElucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IGNyZWRlbnRpYWxHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNyZWRlbnRpYWxHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJyk7XG4gICAgY3JlZGVudGlhbEdyb3VwLmFwcGVuZENoaWxkKHVzZXJuYW1lQ29udHJvbCk7XG4gICAgY3JlZGVudGlhbEdyb3VwLmFwcGVuZENoaWxkKHNlbGYucGFzc3dvcmRDb250cm9sKTtcbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChjcmVkZW50aWFsR3JvdXApO1xuXG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3ByaXZhdGVrZXlmaWxlJyk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wuYXBwZW5kQ2hpbGQocHJpdmF0ZWtleWZpbGVMYWJlbCk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IHJlbW90ZUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW1vdGVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgcmVtb3RlQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdyZW1vdGUnKTtcbiAgICByZW1vdGVDb250cm9sLmFwcGVuZENoaWxkKHJlbW90ZUxhYmVsKTtcbiAgICByZW1vdGVDb250cm9sLmFwcGVuZENoaWxkKHNlbGYucmVtb3RlSW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgYWR2YW5jZWRTZXR0aW5nc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYWR2YW5jZWRTZXR0aW5nc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBhZHZhbmNlZFNldHRpbmdzR3JvdXAuYXBwZW5kQ2hpbGQoc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wpO1xuICAgIGFkdmFuY2VkU2V0dGluZ3NHcm91cC5hcHBlbmRDaGlsZChyZW1vdGVDb250cm9sKTtcbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChhZHZhbmNlZFNldHRpbmdzR3JvdXApO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgc2VsZi5uYW1lSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ubmFtZSA9IHNlbGYubmFtZUlucHV0LmdldFRleHQoKS50cmltKCk7XG4gICAgICAgIHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS50ZXh0ID0gc2VsZi5uYW1lSW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLmhvc3RJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5ob3N0ID0gc2VsZi5ob3N0SW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnBvcnRJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wb3J0ID0gc2VsZi5wb3J0SW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYuZm9sZGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0Rm9sZGVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VsZWN0ZWRPcHRpb25zWzBdO1xuICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ucGFyZW50ID0gcGFyc2VJbnQob3B0aW9uLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYuZm9sZGVyRWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5lZGl0Rm9sZGVycygpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIGxldCBvcHRpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0LnNlbGVjdGVkT3B0aW9uc1swXTtcblxuICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09ICdzZnRwJykge1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZnRwID0gdHJ1ZTtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0uc2VjdXJlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLmxvZ29uID0gJ2NyZWRlbnRpYWxzJztcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0uc2Z0cCA9IGZhbHNlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VBZ2VudCA9IGZhbHNlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wcml2YXRla2V5ZmlsZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIGxldCBvcHRpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0LnNlbGVjdGVkT3B0aW9uc1swXTtcblxuICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09ICdleHBsaWNpdCcpIHtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0uc2VjdXJlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udmFsdWUgPT0gJ2ltcGxpY2l0Jykge1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZWN1cmUgPSAnaW1wbGljaXQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZWN1cmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmZpbGxJbnB1dEZpZWxkcyhTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBsZXQgb3B0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5zZWxlY3RlZE9wdGlvbnNbMF07XG5cbiAgICAgICAgaWYgKG9wdGlvbi52YWx1ZSA9PSAnY3JlZGVudGlhbHMnKSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLmxvZ29uID0gJ2NyZWRlbnRpYWxzJztcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0udXNlQWdlbnQgPSBmYWxzZTtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ucHJpdmF0ZWtleWZpbGUgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udmFsdWUgPT0gJ2tleWZpbGUnKSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLmxvZ29uID0gJ2tleWZpbGUnO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VBZ2VudCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi52YWx1ZSA9PSAnYWdlbnQnKSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLmxvZ29uID0gJ2FnZW50JztcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0udXNlQWdlbnQgPSB0cnVlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wcml2YXRla2V5ZmlsZSA9ICcnO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wYXNzd29yZCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VBZ2VudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnVzZXJJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VyID0gc2VsZi51c2VySW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBjaGFuZ2luZyA9IGZhbHNlO1xuICAgIGNvbnN0IHBhc3N3b3JkTW9kZWwgPSBzZWxmLnBhc3N3b3JkSW5wdXQuZ2V0TW9kZWwoKTtcbiAgICBwYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkID0gbmV3IFRleHRCdWZmZXIoJycpO1xuICAgIHBhc3N3b3JkTW9kZWwuYnVmZmVyLm9uRGlkQ2hhbmdlKChvYmopID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBwYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLnNldFRleHRJblJhbmdlKG9iai5vbGRSYW5nZSwgb2JqLm5ld1RleHQpO1xuICAgICAgICBwYXNzd29yZE1vZGVsLmJ1ZmZlci5zZXRUZXh0SW5SYW5nZShvYmoubmV3UmFuZ2UsICcqJy5yZXBlYXQob2JqLm5ld1RleHQubGVuZ3RoKSk7XG5cbiAgICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wYXNzd29yZCA9IHBhc3N3b3JkTW9kZWwuY2xlYXJUZXh0UGFzc3dvcmQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYW5naW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ucHJpdmF0ZWtleWZpbGUgPSBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnJlbW90ZUlucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnJlbW90ZSA9IHNlbGYucmVtb3RlSW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBrZXlkb3duIGJ5IHRhYiBldmVudHMgdG8gc3dpdGNoIGJldHdlZW4gZmllbGRzXG4gICAgc2VsZi5uYW1lSW5wdXQuZ2V0TW9kZWwoKS5nZXRFbGVtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKHNlbGYuZm9sZGVyU2VsZWN0KS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxmLmhvc3RJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5ob3N0SW5wdXQuZ2V0TW9kZWwoKS5nZXRFbGVtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxmLnBvcnRJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxmLnVzZXJJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi51c2VySW5wdXQuZ2V0TW9kZWwoKS5nZXRFbGVtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZi5sb2dvblR5cGVTZWxlY3Quc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICAgIGlmIChvcHRpb24gPT0gJ2NyZWRlbnRpYWxzJykge1xuICAgICAgICAgICAgc2VsZi5wYXNzd29yZElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT0gJ2tleWZpbGUnKSB7XG4gICAgICAgICAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PSAnYWdlbnQnKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW90ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZ2V0TW9kZWwoKS5nZXRFbGVtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZi5sb2dvblR5cGVTZWxlY3Quc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICAgIGlmIChvcHRpb24gPT0gJ2NyZWRlbnRpYWxzJykge1xuICAgICAgICAgICAgc2VsZi5yZW1vdGVJbnB1dC5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09ICdrZXlmaWxlJykge1xuICAgICAgICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT0gJ2FnZW50Jykge1xuICAgICAgICAgICAgc2VsZi5yZW1vdGVJbnB1dC5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmdldE1vZGVsKCkuZ2V0RWxlbWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ1RhYicpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VsZi5yZW1vdGVJbnB1dC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRpdlJlcXVpcmVkO1xuICB9XG5cbiAgY3JlYXRlQ29udHJvbHNGb2xkZXJTZWxlY3QoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgc2VsZWN0ZWRfdmFsdWUgPSBzZWxmLmZvbGRlclNlbGVjdC52YWx1ZTtcblxuICAgIHdoaWxlIChzZWxmLmZvbGRlclNlbGVjdC5maXJzdENoaWxkKSB7XG4gICAgICBzZWxmLmZvbGRlclNlbGVjdC5yZW1vdmVDaGlsZChzZWxmLmZvbGRlclNlbGVjdC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9uTm9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uTm9uZS50ZXh0ID0gJy0gTm9uZSAtJztcbiAgICBvcHRpb25Ob25lLnZhbHVlID0gbnVsbDtcbiAgICBzZWxmLmZvbGRlclNlbGVjdC5hZGQob3B0aW9uTm9uZSk7XG5cbiAgICBTdG9yYWdlLmdldEZvbGRlcnNTdHJ1Y3R1cmVkQnlUcmVlKCkuZm9yRWFjaCgoY29uZmlnKSA9PiB7XG4gICAgICBsZXQgZm9sZGVyX29wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICBmb2xkZXJfb3B0aW9uLnRleHQgPSBjb25maWcubmFtZTtcbiAgICAgIGZvbGRlcl9vcHRpb24udmFsdWUgPSBjb25maWcuaWQ7XG4gICAgICBzZWxmLmZvbGRlclNlbGVjdC5hZGQoZm9sZGVyX29wdGlvbik7XG4gICAgfSk7XG5cbiAgICBzZWxmLmZvbGRlclNlbGVjdC52YWx1ZSA9IHNlbGVjdGVkX3ZhbHVlO1xuICB9XG5cbiAgY3JlYXRlU2VydmVyU2VsZWN0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdzZXJ2ZXInKTtcbiAgICBkaXYuc3R5bGUubWFyZ2luQm90dG9tID0gJzIwcHgnO1xuXG4gICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHNlbGVjdC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcbiAgICBzZWxmLnNlbGVjdFNlcnZlciA9IHNlbGVjdDtcbiAgICBzZWxmLnNlbGVjdFNlcnZlci5mb2N1cygpO1xuXG4gICAgbGV0IHNlcnZlckNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzZXJ2ZXJDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgc2VydmVyQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdzZXJ2ZXInKTtcbiAgICBzZXJ2ZXJDb250cm9sLmFwcGVuZENoaWxkKHNlbGYuc2VsZWN0U2VydmVyKTtcblxuICAgIGxldCBuZXdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXdCdXR0b24udGV4dENvbnRlbnQgPSAnTmV3JztcbiAgICBuZXdCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbGYuZGVsZXRlQnV0dG9uLnRleHRDb250ZW50ID0gJ0RlbGV0ZSc7XG4gICAgc2VsZi5kZWxldGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uLnRleHRDb250ZW50ID0gJ0R1cGxpY2F0ZSc7XG4gICAgc2VsZi5kdXBsaWNhdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBzZWxmLnRlc3RCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZWxmLnRlc3RCdXR0b24udGV4dENvbnRlbnQgPSAnVGVzdCc7XG4gICAgc2VsZi50ZXN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgbGV0IGJ1dHRvbkNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgYnV0dG9uQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdzZXJ2ZXItYnV0dG9uJyk7XG4gICAgYnV0dG9uQ29udHJvbC5hcHBlbmRDaGlsZChuZXdCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5kZWxldGVCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5kdXBsaWNhdGVCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi50ZXN0QnV0dG9uKTtcblxuICAgIGxldCBzZXJ2ZXJHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlcnZlckdyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBzZXJ2ZXJHcm91cC5hcHBlbmRDaGlsZChzZXJ2ZXJDb250cm9sKTtcbiAgICBzZXJ2ZXJHcm91cC5hcHBlbmRDaGlsZChidXR0b25Db250cm9sKTtcblxuICAgIGRpdi5hcHBlbmRDaGlsZChzZXJ2ZXJHcm91cCk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VsZWN0ZWRPcHRpb25zWzBdO1xuICAgICAgICBsZXQgaW5kZXhJbkFycmF5ID0gb3B0aW9uLnZhbHVlO1xuXG4gICAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKChpbmRleEluQXJyYXkpID8gU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhJbkFycmF5XSA6IG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbmV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLm5ldygpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5kZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuZGVsZXRlKCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5kdXBsaWNhdGUoKTtcbiAgICB9KTtcblxuICAgIHNlbGYudGVzdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi50ZXN0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUga2V5ZG93biBieSB0YWIgZXZlbnRzIHRvIHN3aXRjaCBiZXR3ZWVuIGZpZWxkc1xuICAgIHNlbGYudGVzdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYubmFtZUlucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGl2O1xuICB9XG5cbiAgcmVsb2FkKHNlbGVjdGVkU2VydmVyID0gbnVsbCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gdHJ1ZTtcblxuICAgIHNlbGYuY3JlYXRlQ29udHJvbHNGb2xkZXJTZWxlY3QoKTtcblxuICAgIHdoaWxlIChzZWxmLnNlbGVjdFNlcnZlci5maXJzdENoaWxkKSB7XG4gICAgICBzZWxmLnNlbGVjdFNlcnZlci5yZW1vdmVDaGlsZChzZWxmLnNlbGVjdFNlcnZlci5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKCkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgIG9wdGlvbi50ZXh0ID0gaXRlbS5uYW1lO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBpbmRleDtcbiAgICAgICAgc2VsZi5zZWxlY3RTZXJ2ZXIuYWRkKG9wdGlvbik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkU2VydmVyICYmIHR5cGVvZiBzZWxlY3RlZFNlcnZlci5jb25maWcgIT09ICd1bmRlZmluZWQnICYmIHNlbGVjdGVkU2VydmVyLmNvbmZpZy5ob3N0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmIChzZWxlY3RlZFNlcnZlci5jb25maWcuaG9zdCA9PSBpdGVtLmhvc3QgJiYgc2VsZWN0ZWRTZXJ2ZXIuY29uZmlnLm5hbWUgPT0gaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICBzZWxmLmZpbGxJbnB1dEZpZWxkcyhTdG9yYWdlLmdldFNlcnZlcnMoKVtzZWxlY3RlZEluZGV4XSk7XG5cbiAgICAgIC8vIEVuYWJsZSBJbnB1dCBGaWVsZHNcbiAgICAgIHNlbGYuZW5hYmxlSW5wdXRGaWVsZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5maWxsSW5wdXRGaWVsZHMoKTtcblxuICAgICAgLy8gRGlzYWJsZSBJbnB1dCBGaWVsZHNcbiAgICAgIHNlbGYuZGlzYWJsZUlucHV0RmllbGRzKCk7XG4gICAgfVxuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IGZhbHNlO1xuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogc2VsZlxuICAgIH0pO1xuXG4gICAgLy8gUmVzaXplIGNvbnRlbnQgdG8gZml0IG9uIHNtYWxsZXIgZGlzcGxheXNcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBjb250ZW50ID0gc2VsZi5wYW5lbC5lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBsZXQgb2Zmc2V0ID0gJChzZWxmLnBhbmVsLmVsZW1lbnQpLnBvc2l0aW9uKCkudG9wO1xuXG4gICAgaWYgKGNvbnRlbnQgKyAoMiAqIG9mZnNldCkgPiBib2R5KSB7XG4gICAgICBsZXQgc2V0dGluZ3MgPSBzZWxmLmNvbnRlbnQuZmluZCgnLnNlcnZlci1zZXR0aW5ncycpWzBdO1xuICAgICAgbGV0IGhlaWdodCA9ICgyICogb2Zmc2V0KSArIGNvbnRlbnQgLSBib2R5O1xuICAgICAgJChzZXR0aW5ncykuaGVpZ2h0KCQoc2V0dGluZ3MpLmhlaWdodCgpIC0gaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNvbnN0IGRlc3Ryb3lQYW5lbCA9IHRoaXMucGFuZWw7XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgaWYgKGRlc3Ryb3lQYW5lbCkge1xuICAgICAgZGVzdHJveVBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBTdG9yYWdlLmxvYWQodHJ1ZSk7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBzaG93RXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMuZXJyb3IudGV4dChtZXNzYWdlKTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5mbGFzaEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgZmlsbElucHV0RmllbGRzKHNlcnZlciA9IG51bGwpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IHRydWU7XG5cbiAgICBpZiAoc2VydmVyKSB7XG4gICAgICBzZWxmLm5hbWVJbnB1dC5zZXRUZXh0KHNlcnZlci5uYW1lID8gc2VydmVyLm5hbWUgOiBzZXJ2ZXIuaG9zdCk7XG4gICAgICBzZWxmLmhvc3RJbnB1dC5zZXRUZXh0KHNlcnZlci5ob3N0KTtcbiAgICAgIHNlbGYucG9ydElucHV0LnNldFRleHQoc2VydmVyLnBvcnQpO1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0Rm9sZGVyKHNlcnZlci5wYXJlbnQpKSB7XG4gICAgICAgIHNlbGYuZm9sZGVyU2VsZWN0LnZhbHVlID0gU3RvcmFnZS5nZXRGb2xkZXIoc2VydmVyLnBhcmVudCkuaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmZvbGRlclNlbGVjdC52YWx1ZSA9ICdudWxsJztcbiAgICAgIH1cblxuICAgICAgaWYgKHNlcnZlci5zZnRwKSB7XG4gICAgICAgIHNlbGYucHJvdG9jb2xTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDE7XG4gICAgICAgIHNlbGYucG9ydElucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlci10ZXh0JywgJzIyJyk7XG5cbiAgICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG5cbiAgICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Qub3B0aW9uc1sxXS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5vcHRpb25zWzJdLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lO1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYucHJvdG9jb2xTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2VydmVyLnNlY3VyZSA9PT0gJ2ltcGxpY2l0Jykge1xuICAgICAgICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAyO1xuICAgICAgICAgIHNlbGYucG9ydElucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlci10ZXh0JywgJzk5MCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlcnZlci5zZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMTtcbiAgICAgICAgICBzZWxmLnBvcnRJbnB1dC5lbGVtZW50LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXItdGV4dCcsICcyMScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICAgIHNlbGYucG9ydElucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlci10ZXh0JywgJzIxJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDsgLy8gVXNlcm5hbWUvUGFzc3dvcmRcbiAgICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Qub3B0aW9uc1sxXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHNlbGYubG9nb25UeXBlU2VsZWN0Lm9wdGlvbnNbMl0uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlcnZlci5sb2dvbiA9PSAna2V5ZmlsZScpIHtcbiAgICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDE7IC8vIEtleWZpbGVcbiAgICAgICAgc2VsZi5wYXNzd29yZENvbnRyb2wucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIHNlbGYucHJpdmF0ZWtleWZpbGVDb250cm9sLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgfSBlbHNlIGlmIChzZXJ2ZXIubG9nb24gPT0gJ2FnZW50Jykge1xuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMjsgLy8gU1NIIEFnZW50XG4gICAgICAgIHNlbGYucGFzc3dvcmRDb250cm9sLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lO1wiKTtcbiAgICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmU7XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7IC8vIFVzZXJuYW1lL1Bhc3N3b3JkXG4gICAgICAgIHNlbGYucGFzc3dvcmRDb250cm9sLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZTtcIik7XG4gICAgICB9XG5cbiAgICAgIHNlbGYudXNlcklucHV0LnNldFRleHQoc2VydmVyLnVzZXIpO1xuICAgICAgc2VsZi5wYXNzd29yZElucHV0LnNldFRleHQoc2VydmVyLnBhc3N3b3JkKTtcbiAgICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5zZXRUZXh0KHNlcnZlci5wcml2YXRla2V5ZmlsZSA/IHNlcnZlci5wcml2YXRla2V5ZmlsZSA6ICcnKTtcbiAgICAgIHNlbGYucmVtb3RlSW5wdXQuc2V0VGV4dChzZXJ2ZXIucmVtb3RlID8gc2VydmVyLnJlbW90ZSA6ICcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYubmFtZUlucHV0LnNldFRleHQoJycpO1xuICAgICAgc2VsZi5ob3N0SW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLnBvcnRJbnB1dC5zZXRUZXh0KCcnKTtcblxuICAgICAgc2VsZi5wcm90b2NvbFNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG5cbiAgICAgIHNlbGYudXNlcklucHV0LnNldFRleHQoJycpO1xuICAgICAgc2VsZi5wYXNzd29yZElucHV0LnNldFRleHQoJycpO1xuICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LnNldFRleHQoJycpO1xuICAgICAgc2VsZi5yZW1vdGVJbnB1dC5zZXRUZXh0KCcnKTtcblxuICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmU7XCIpO1xuICAgIH1cblxuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IGZhbHNlO1xuICB9XG5cbiAgZW5hYmxlSW5wdXRGaWVsZHMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYuZGVsZXRlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLnRlc3RCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnRlc3RCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYubmFtZUlucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5uYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYuZm9sZGVyU2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYuaG9zdElucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5ob3N0SW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYucG9ydElucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wb3J0SW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLnVzZXJJbnB1dFswXS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYudXNlcklucHV0LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLnBhc3N3b3JkSW5wdXRbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dFswXS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5yZW1vdGVJbnB1dFswXS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucmVtb3RlSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGRpc2FibGVJbnB1dEZpZWxkcygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5kZWxldGVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5kdXBsaWNhdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLnRlc3RCdXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnRlc3RCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5uYW1lSW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLm5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLmZvbGRlclNlbGVjdC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYuZm9sZGVyU2VsZWN0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYuaG9zdElucHV0WzBdLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5ob3N0SW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5wb3J0SW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnBvcnRJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYudXNlcklucHV0WzBdLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi51c2VySW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5wYXNzd29yZElucHV0WzBdLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wYXNzd29yZElucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dFswXS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLnJlbW90ZUlucHV0WzBdLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5yZW1vdGVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBsZXQgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICBzZWxmLm5hbWVJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi5uYW1lSW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLm5hbWVJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLmhvc3RJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi5ob3N0SW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLmhvc3RJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnBvcnRJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi5wb3J0SW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLnBvcnRJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnVzZXJJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi51c2VySW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLnVzZXJJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoIWNoYW5naW5nICYmIHNlbGYucGFzc3dvcmRJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYucGFzc3dvcmRJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoIWNoYW5naW5nICYmIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxmLnJlbW90ZUlucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZyAmJiBzZWxmLnJlbW90ZUlucHV0LmRpc2FibGVkKSB7XG4gICAgICAgIGNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5yZW1vdGVJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRlc3QoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdKSk7XG5cbiAgICAgIGNvbnN0IGNvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IoY29uZmlnKTtcblxuICAgICAgY29ubmVjdG9yLm9uKCdkZWJ1ZycsIChjbWQsIHBhcmFtMSwgcGFyYW0yKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC5kZXYuZGVidWcnKSkge1xuICAgICAgICAgIGlmIChwYXJhbTEgJiYgcGFyYW0yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjbWQsIHBhcmFtMSwgcGFyYW0yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY21kLCBwYXJhbTEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY21kKSBjb25zb2xlLmxvZyhjbWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29ubmVjdG9yLmNvbm5lY3QoKS50aGVuKCgpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoJ0Nvbm5lY3Rpb24gY291bGQgYmUgZXN0YWJsaXNoZWQgc3VjY2Vzc2Z1bGx5JylcbiAgICAgICAgY29ubmVjdG9yLmRpc2Nvbm5lY3QobnVsbCkuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgY29ubmVjdG9yLmRlc3Ryb3koKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc2hvd01lc3NhZ2UoZXJyLCAnZXJyb3InKTtcbiAgICAgICAgY29ubmVjdG9yLmRpc2Nvbm5lY3QobnVsbCkuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgY29ubmVjdG9yLmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHsgfVxuICB9XG5cbiAgbmV3KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5lbmFibGVJbnB1dEZpZWxkcygpO1xuXG4gICAgbGV0IG5ld2NvbmZpZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG4gICAgbmV3Y29uZmlnLm5hbWUgPSBjb25maWcubmFtZSArIFwiIFwiICsgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCArIDEpO1xuICAgIFN0b3JhZ2UuYWRkU2VydmVyKG5ld2NvbmZpZyk7XG5cbiAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgb3B0aW9uLnRleHQgPSBuZXdjb25maWcubmFtZTtcbiAgICBvcHRpb24udmFsdWUgPSBTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggLSAxO1xuXG4gICAgdGhpcy5zZWxlY3RTZXJ2ZXIuYWRkKG9wdGlvbik7XG4gICAgdGhpcy5zZWxlY3RTZXJ2ZXIudmFsdWUgPSBTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggLSAxO1xuICAgIHRoaXMuc2VsZWN0U2VydmVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgc2VsZi5uYW1lSW5wdXQuZm9jdXMoKTtcbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgU3RvcmFnZS5zYXZlKCk7XG4gICAgc2VsZi5jbG9zZSgpO1xuICB9XG5cbiAgZGVsZXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgU3RvcmFnZS5kZWxldGVTZXJ2ZXIoaW5kZXgpO1xuXG4gICAgc2VsZi5yZWxvYWQoKTtcbiAgICBzZWxmLnNlbGVjdFNlcnZlci5mb2N1cygpO1xuICB9XG5cbiAgZHVwbGljYXRlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG5cbiAgICBzZWxmLmVuYWJsZUlucHV0RmllbGRzKCk7XG5cbiAgICBsZXQgbmV3Y29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0pKTtcbiAgICBuZXdjb25maWcubmFtZSA9IG5ld2NvbmZpZy5uYW1lICsgXCIgXCIgKyAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICsgMSk7XG4gICAgU3RvcmFnZS5hZGRTZXJ2ZXIobmV3Y29uZmlnKTtcblxuICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24udGV4dCA9IG5ld2NvbmZpZy5uYW1lO1xuICAgIG9wdGlvbi52YWx1ZSA9IFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAtIDE7XG5cbiAgICB0aGlzLnNlbGVjdFNlcnZlci5hZGQob3B0aW9uKTtcbiAgICB0aGlzLnNlbGVjdFNlcnZlci52YWx1ZSA9IFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5zZWxlY3RTZXJ2ZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcbiAgICBzZWxmLm5hbWVJbnB1dC5mb2N1cygpO1xuICB9XG5cbiAgaW1wb3J0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGltcG9ydEhhbmRsZXIgPSBuZXcgSW1wb3J0KCk7XG5cbiAgICBpbXBvcnRIYW5kbGVyLm9uRmluaXNoZWQgPSAoc3RhdGlzdGljKSA9PiB7XG4gICAgICBsZXQgZGV0YWlsID0gW107XG5cbiAgICAgIGlmIChzdGF0aXN0aWMuY3JlYXRlZFNlcnZlcnMpIHtcbiAgICAgICAgZGV0YWlsLnB1c2goc3RhdGlzdGljLmNyZWF0ZWRTZXJ2ZXJzICsgXCIgTmV3IFNlcnZlcihzKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0aXN0aWMudXBkYXRlZFNlcnZlcnMpIHtcbiAgICAgICAgZGV0YWlsLnB1c2goc3RhdGlzdGljLnVwZGF0ZWRTZXJ2ZXJzICsgXCIgVXBkYXRlZCBTZXJ2ZXIocylcIik7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGlzdGljLmNyZWF0ZWRGb2xkZXJzKSB7XG4gICAgICAgIGRldGFpbC5wdXNoKHN0YXRpc3RpYy5jcmVhdGVkRm9sZGVycyArIFwiIE5ldyBGb2xkZXIocylcIik7XG4gICAgICB9XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCdJbXBvcnQgY29tcGxldGVkJywge1xuICAgICAgICBkZXRhaWw6ICdJbXBvcnRlZDogJyArIGRldGFpbC5qb2luKCcsICcpICsgJy4nLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLnJlbG9hZCgpO1xuICAgIH07XG5cbiAgICBpbXBvcnRIYW5kbGVyLm9uV2FybmluZyA9IChlcnJvcikgPT4ge1xuICAgICAgLy8gVE9ET1xuICAgIH07XG5cbiAgICBpbXBvcnRIYW5kbGVyLm9uRXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGltcG9ydC4nLCB7XG4gICAgICAgIGRldGFpbDogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaW1wb3J0SGFuZGxlci5pbXBvcnQoKTtcbiAgfVxuXG4gIGVkaXRGb2xkZXJzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZm9sZGVyQ29uZmlndXJhdGlvblZpZXcgPSBuZXcgRm9sZGVyQ29uZmlndXJhdGlvblZpZXcoJycsIHRydWUpO1xuXG4gICAgbGV0IGluZGV4ID0gc2VsZi5mb2xkZXJTZWxlY3Quc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuXG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgbGV0IGZvbGRlciA9IFN0b3JhZ2UuZ2V0Rm9sZGVyKGluZGV4KTtcbiAgICAgIGZvbGRlckNvbmZpZ3VyYXRpb25WaWV3LnJlbG9hZChmb2xkZXIpO1xuICAgIH0gZWxzZSBpZiAoU3RvcmFnZS5nZXRGb2xkZXJzKCkubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGZvbGRlciA9IFN0b3JhZ2UuZ2V0Rm9sZGVycygpWzBdO1xuICAgICAgZm9sZGVyQ29uZmlndXJhdGlvblZpZXcucmVsb2FkKGZvbGRlcik7XG4gICAgfVxuXG4gICAgZm9sZGVyQ29uZmlndXJhdGlvblZpZXcub24oJ2Nsb3NlJywgKGUpID0+IHtcbiAgICAgIHNlbGYuY3JlYXRlQ29udHJvbHNGb2xkZXJTZWxlY3QoKTtcbiAgICAgIHNlbGYuYXR0YWNoKCk7XG4gICAgfSk7XG5cbiAgICBmb2xkZXJDb25maWd1cmF0aW9uVmlldy5hdHRhY2goKTtcbiAgfVxufVxuIl19