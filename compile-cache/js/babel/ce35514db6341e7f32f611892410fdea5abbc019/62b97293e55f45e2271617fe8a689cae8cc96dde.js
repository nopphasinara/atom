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
      optionImplicitSFTP.text = 'Require implicit FTP over TLS';
      optionImplicitSFTP.value = 'implicit';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9jb25maWd1cmF0aW9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7aUNBRXdDLHNCQUFzQjs7b0JBQ2QsTUFBTTs7OEJBQzFCLHVCQUF1Qjs7cUNBQzdCLDhCQUE4Qjs7Ozs4QkFDakMsdUJBQXVCOzs7OzRDQUNOLHNDQUFzQzs7OztBQVAxRSxXQUFXLENBQUM7O0FBU1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUN6RCxJQUFNLFdBQVcsR0FBRyxTQUFTLEdBQUcscUNBQXFDLENBQUM7QUFDdEUsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0lBRTdCLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzsrQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQWlDMUIsc0JBQUc7QUFDWCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7O0FBRWpDLFVBQUksSUFBSSxHQUFHLHdDQUF3QyxDQUFDO0FBQ3BELFVBQUksSUFBSSw2R0FBNkcsQ0FBQztBQUN0SCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxnQkFBVSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDaEMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVo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Q0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkUsY0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDN0U7T0FDRixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzFDLFlBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDbEUsY0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEU7T0FDRixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzFDLFlBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDbEUsY0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEU7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDdEQsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsY0FBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3RDtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNuRCxZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7T0FDcEIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3hELFlBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDbEUsY0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELGNBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVwRCxjQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxFQUFFO0FBQzFCLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN4QyxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7V0FDNUMsTUFBTTtBQUNMLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQztBQUNsRCxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDekMsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzdDLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztXQUNqRDtBQUNELGNBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDbkQ7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNsRSxZQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQ2xFLGNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2RCxjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEQsY0FBSSxNQUFNLENBQUMsS0FBSyxJQUFJLFVBQVUsRUFBRTtBQUM5QixtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7V0FDM0MsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksVUFBVSxFQUFFO0FBQ3JDLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztXQUNqRCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1dBQzVDO0FBQ0QsY0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNuRDtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUN6RCxZQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQ2xFLGNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2RCxjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEQsY0FBSSxNQUFNLENBQUMsS0FBSyxJQUFJLGFBQWEsRUFBRTtBQUNqQyxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7QUFDbEQsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzdDLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztXQUNqRCxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDcEMsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQzlDLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztXQUM5QyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDbEMsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQzVDLG1CQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUM1QyxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDaEQsbUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1dBQzNDLE1BQU07QUFDTCxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7V0FDOUM7QUFDRCxjQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ25EO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDMUMsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNwRTtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDckIsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNwRCxtQkFBYSxDQUFDLGlCQUFpQixHQUFHLHFCQUFlLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELG1CQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxZQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2Isa0JBQVEsR0FBRyxJQUFJLENBQUM7QUFDaEIsdUJBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUUsdUJBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRWxGLGNBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDbEUsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2RCxtQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDekY7O0FBRUQsa0JBQVEsR0FBRyxLQUFLLENBQUM7U0FDbEI7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ3BELFlBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDbEUsY0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN4RjtPQUNGLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDNUMsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN4RTtPQUNGLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDNUUsWUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRTtBQUN0QixlQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsb0NBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzlCO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3ZELFlBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDdEIsZUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDNUUsWUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRTtBQUN0QixlQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN4QjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMxRCxZQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFO0FBQ3RCLGVBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixjQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzVFLFlBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDdEIsZUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLGNBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsZ0JBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM3RCxnQkFBSSxNQUFNLElBQUksYUFBYSxFQUFFO0FBQzNCLGtCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzVCLE1BQU0sSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO0FBQzlCLGtCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzVCLE1BQU0sSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQzVCLGtCQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzFCO1dBQ0Y7U0FDRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNoRixZQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFO0FBQ3RCLGVBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixjQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLGdCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDN0QsZ0JBQUksTUFBTSxJQUFJLGFBQWEsRUFBRTtBQUMzQixrQkFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMxQixNQUFNLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtBQUM5QixrQkFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2xDLE1BQU0sSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQzVCLGtCQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzFCO1dBQ0Y7U0FDRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3RGLFlBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDdEIsZUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDMUI7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxXQUFXLENBQUM7S0FDcEI7OztXQUV5QixzQ0FBRztBQUMzQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDOztBQUU3QyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO0FBQ25DLFlBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDN0Q7O0FBRUQsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxnQkFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDN0IsZ0JBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVsQyxhQUFPLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDdkQsWUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRCxxQkFBYSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2pDLHFCQUFhLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDaEMsWUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7T0FDdEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztLQUMxQzs7O1dBRWlCLDhCQUFHO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxTQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixTQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7O0FBRWhDLFVBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsWUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDM0IsVUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFMUIsVUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxtQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsbUJBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLG1CQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFN0MsVUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxlQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUM5QixlQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUN6QyxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0MsVUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUxQyxVQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckMsVUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxtQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsbUJBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLG1CQUFhLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLG1CQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxtQkFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEQsbUJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUUzQyxVQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzQyxpQkFBVyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxpQkFBVyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFdkMsU0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7O0FBRzdCLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0MsWUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUNsRSxjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxjQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDOztBQUVoQyxjQUFJLENBQUMsZUFBZSxDQUFDLEFBQUMsWUFBWSxHQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUNsRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxlQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzdDLFlBQUksT0FBSSxFQUFFLENBQUM7T0FDWixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDckQsWUFBSSxVQUFPLEVBQUUsQ0FBQztPQUNmLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUN4RCxZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7T0FDbEIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ25ELFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDckQsWUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRTtBQUN0QixlQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN4QjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEdBQUcsQ0FBQztLQUNaOzs7V0FFSyxrQkFBd0I7VUFBdkIsY0FBYyx5REFBRyxJQUFJOztBQUMxQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7O0FBRWhDLFVBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDOztBQUVsQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO0FBQ25DLFlBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDN0Q7O0FBRUQsVUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFVBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsZUFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDNUMsY0FBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxnQkFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLGdCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixjQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUIsY0FBSSxjQUFjLElBQUksT0FBTyxjQUFjLENBQUMsTUFBTSxLQUFLLFdBQVcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7QUFDaEgsZ0JBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3RGLDJCQUFhLEdBQUcsS0FBSyxDQUFDO2FBQ3ZCO1dBQ0Y7U0FDRixDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ2hELFlBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7OztBQUcxRCxZQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztPQUMxQixNQUFNO0FBQ0wsWUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOzs7QUFHdkIsWUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7T0FDM0I7QUFDRCxVQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0tBQ2xDOzs7V0FFSyxrQkFBRztBQUNQLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4QyxZQUFJLEVBQUUsSUFBSTtPQUNYLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDdEMsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQzlDLFVBQUksTUFBTSxHQUFHLDBCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDOztBQUVsRCxVQUFJLE9BQU8sR0FBSSxDQUFDLEdBQUcsTUFBTSxBQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ2pDLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBSSxNQUFNLEdBQUcsQUFBQyxDQUFDLEdBQUcsTUFBTSxHQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDM0Msa0NBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFFLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO09BQ25EO0tBQ0Y7OztXQUVJLGlCQUFHO0FBQ04sVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksWUFBWSxFQUFFO0FBQ2hCLG9CQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDeEI7O0FBRUQsYUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ25CO0tBQ0Y7OztXQUVjLDJCQUFnQjtVQUFmLE1BQU0seURBQUcsSUFBSTs7QUFDM0IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDOztBQUVoQyxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxZQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3BDLGNBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUMvRCxNQUFNO0FBQ0wsY0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ2xDOztBQUVELFlBQUksTUFBTSxDQUFDLElBQUksRUFBRTtBQUNmLGNBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QyxjQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTlELGNBQUksQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUVoRCxjQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ2pELGNBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWpELGNBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3ZFLE1BQU07QUFDTCxjQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXRDLGNBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDaEMsZ0JBQUksQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELGdCQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7V0FDaEUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ2pDLGdCQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUNoRCxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1dBQy9ELE1BQU07QUFDTCxnQkFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDaEQsZ0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztXQUMvRDs7QUFFRCxjQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdkMsY0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNoRCxjQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVoRCxjQUFJLENBQUMseUJBQXlCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pEOztBQUVELFlBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDN0IsY0FBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLGNBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckQsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO0FBQ2xDLGNBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN2QyxjQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDNUQsY0FBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDbkUsTUFBTTtBQUNMLGNBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN2QyxjQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QyxjQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztTQUNuRTs7QUFFRCxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztPQUMvRCxNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRTNCLFlBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QyxZQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUNoRCxZQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRTdCLFlBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO09BQ25FOztBQUVELFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7S0FDbEM7OztXQUVnQiw2QkFBRztBQUNsQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXRDLFVBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXJDLFVBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXRDLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuRCxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUUxQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ25DOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVsQyxVQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQyxVQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVoQyxVQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUUvQixVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVsQyxVQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUUvQixVQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUUvQixVQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEdB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QUcsQ0FBQztBQUNQLHFCQUFPLGFBQWE7V0FDckIsRUFBRSxZQUFNO0FBQ1Asa0JBQUssS0FBSyxDQUFDO0FBQ1QsdUJBQU8sTUFBTTtBQUNiLG9CQUFNLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQztBQUNILGtCQUFLLEdBQUcsQ0FBQztBQUNQLHVCQUFPLGdCQUFnQjtBQUN2QixvQkFBTSxFQUFFLFNBQVM7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gsa0JBQUssR0FBRyxDQUFDO0FBQ1AsdUJBQU8sZUFBZTtBQUN0QixvQkFBTSxFQUFFLFFBQVE7YUFDakIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO0FBQ0gsY0FBSyxHQUFHLENBQUM7QUFDUCxtQkFBTyxlQUFlO0FBQ3RCLGdCQUFNLEVBQUUsT0FBTztTQUNoQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBL0JrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9jb25maWd1cmF0aW9uLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgJCwgVmlldywgVGV4dEVkaXRvclZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgeyBUZXh0QnVmZmVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBzaG93TWVzc2FnZSB9IGZyb20gJy4vLi4vaGVscGVyL2hlbHBlci5qcyc7XG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gJy4vLi4vY29ubmVjdG9ycy9jb25uZWN0b3IuanMnO1xuaW1wb3J0IEltcG9ydCBmcm9tICcuLy4uL2hlbHBlci9pbXBvcnQuanMnO1xuaW1wb3J0IEZvbGRlckNvbmZpZ3VyYXRpb25WaWV3IGZyb20gJy4vLi4vdmlld3MvZm9sZGVyLWNvbmZpZ3VyYXRpb24tdmlldyc7XG5cbmNvbnN0IGF0b20gPSBnbG9iYWwuYXRvbTtcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vLi4vY29uZmlnL3NlcnZlci1zY2hlbWEuanNvbicpO1xuY29uc3QgZGVidWdDb25maWcgPSBfX2Rpcm5hbWUgKyAnLi8uLi9jb25maWcvc2VydmVyLXRlc3Qtc2NoZW1hLmpzb24nO1xuY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4vLi4vaGVscGVyL3N0b3JhZ2UuanMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlndXJhdGlvblZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYoe1xuICAgICAgY2xhc3M6ICdmdHAtcmVtb3RlLWVkaXQgc2V0dGluZ3MtdmlldyBvdmVybGF5IGZyb20tdG9wJ1xuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdwYW5lbHMnLFxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7XG4gICAgICAgICAgY2xhc3M6ICdwYW5lbHMtaXRlbScsXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxhYmVsKHtcbiAgICAgICAgICAgIGNsYXNzOiAnaWNvbicsXG4gICAgICAgICAgICBvdXRsZXQ6ICdpbmZvJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmRpdih7XG4gICAgICAgICAgICBjbGFzczogJ3BhbmVscy1jb250ZW50JyxcbiAgICAgICAgICAgIG91dGxldDogJ2NvbnRlbnQnLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICAgIGNsYXNzOiAncGFuZWxzLWZvb3RlcicsXG4gICAgICAgICAgICBvdXRsZXQ6ICdmb290ZXInLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2Vycm9yLW1lc3NhZ2UnLFxuICAgICAgICBvdXRsZXQ6ICdlcnJvcicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IGZhbHNlO1xuXG4gICAgbGV0IGh0bWwgPSAnPHA+RnRwLVJlbW90ZS1FZGl0IFNlcnZlciBTZXR0aW5nczwvcD4nO1xuICAgIGh0bWwgKz0gXCI8cD5Zb3UgY2FuIGVkaXQgZWFjaCBjb25uZWN0aW9uIGF0IHRoZSB0aW1lLiBBbGwgY2hhbmdlcyB3aWxsIG9ubHkgYmUgc2F2ZWQgYnkgcHVzaGluZyB0aGUgc2F2ZSBidXR0b24uPC9wPlwiO1xuICAgIHNlbGYuaW5mby5odG1sKGh0bWwpO1xuXG4gICAgbGV0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzYXZlQnV0dG9uLnRleHRDb250ZW50ID0gJ1NhdmUnO1xuICAgIHNhdmVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBsZXQgaW1wb3J0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgaW1wb3J0QnV0dG9uLnRleHRDb250ZW50ID0gJ0ltcG9ydCc7XG4gICAgaW1wb3J0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgbGV0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQgPSAnQ2FuY2VsJztcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwdWxsLXJpZ2h0Jyk7XG5cbiAgICBzZWxmLmNvbnRlbnQuYXBwZW5kKHNlbGYuY3JlYXRlU2VydmVyU2VsZWN0KCkpO1xuICAgIHNlbGYuY29udGVudC5hcHBlbmQoc2VsZi5jcmVhdGVDb250cm9scygpKTtcblxuICAgIHNlbGYuZm9vdGVyLmFwcGVuZChzYXZlQnV0dG9uKTtcbiAgICBzZWxmLmZvb3Rlci5hcHBlbmQoaW1wb3J0QnV0dG9uKTtcbiAgICBzZWxmLmZvb3Rlci5hcHBlbmQoY2xvc2VCdXR0b24pO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuc2F2ZSgpO1xuICAgICAgc2VsZi5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaW1wb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLmltcG9ydCgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHtcbiAgICAgICAgLy8gc2VsZi5zYXZlKCk7XG4gICAgICB9LFxuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4ge1xuICAgICAgICBzZWxmLmNhbmNlbCgpO1xuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICAvLyBIYW5kbGUga2V5ZG93biBieSB0YWIgZXZlbnRzIHRvIHN3aXRjaCBiZXR3ZWVuIGZpZWxkc1xuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ1RhYicpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VsZi5zZWxlY3RTZXJ2ZXIuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5zdWJzY3JpcHRpb25zKSB7XG4gICAgICBzZWxmLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb250cm9scygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBkaXZSZXF1aXJlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdlJlcXVpcmVkLmNsYXNzTGlzdC5hZGQoJ3NlcnZlci1zZXR0aW5ncycpO1xuXG4gICAgbGV0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgbmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgbmFtZUxhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuYW1lTGFiZWxUaXRsZS50ZXh0Q29udGVudCA9ICdUaGUgbmFtZSBvZiB0aGUgc2VydmVyLic7XG4gICAgbmFtZUxhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIG5hbWVMYWJlbC5hcHBlbmRDaGlsZChuYW1lTGFiZWxUaXRsZSk7XG4gICAgc2VsZi5uYW1lSW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwibmFtZVwiIH0pO1xuICAgIHNlbGYubmFtZUlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgZm9sZGVyTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGZvbGRlckxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgZm9sZGVyTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvbGRlckxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnRm9sZGVyJztcbiAgICBmb2xkZXJMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBmb2xkZXJMYWJlbC5hcHBlbmRDaGlsZChmb2xkZXJMYWJlbFRpdGxlKTtcblxuICAgIHNlbGYuZm9sZGVyU2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG4gICAgc2VsZi5jcmVhdGVDb250cm9sc0ZvbGRlclNlbGVjdCgpO1xuXG4gICAgc2VsZi5mb2xkZXJFZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VsZi5mb2xkZXJFZGl0LnRleHRDb250ZW50ID0gJ0VkaXQnO1xuICAgIHNlbGYuZm9sZGVyRWRpdC5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIGxldCBob3N0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGhvc3RMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IGhvc3RMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG9zdExhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnVGhlIGhvc3RuYW1lIG9yIElQIGFkZHJlc3Mgb2YgdGhlIHNlcnZlci4nO1xuICAgIGhvc3RMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBob3N0TGFiZWwuYXBwZW5kQ2hpbGQoaG9zdExhYmVsVGl0bGUpO1xuICAgIHNlbGYuaG9zdElucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcImxvY2FsaG9zdFwiIH0pO1xuICAgIHNlbGYuaG9zdElucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgcG9ydExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwb3J0TGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBwb3J0TGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvcnRMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ1BvcnQnO1xuICAgIHBvcnRMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBwb3J0TGFiZWwuYXBwZW5kQ2hpbGQocG9ydExhYmVsVGl0bGUpO1xuICAgIHNlbGYucG9ydElucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIjIxXCIgfSk7XG4gICAgc2VsZi5wb3J0SW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcblxuICAgIGxldCBwcm90b2NvbExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwcm90b2NvbExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgcHJvdG9jb2xMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvdG9jb2xMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ1Byb3RvY29sJztcbiAgICBwcm90b2NvbExhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIHByb3RvY29sTGFiZWwuYXBwZW5kQ2hpbGQocHJvdG9jb2xMYWJlbFRpdGxlKTtcblxuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuICAgIGxldCBvcHRpb25GVFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbkZUUC50ZXh0ID0gJ0ZUUCAtIEZpbGUgVHJhbnNmZXIgUHJvdG9jb2wnO1xuICAgIG9wdGlvbkZUUC52YWx1ZSA9ICdmdHAnO1xuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QuYWRkKG9wdGlvbkZUUCk7XG4gICAgbGV0IG9wdGlvblNGVFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvblNGVFAudGV4dCA9ICdTRlRQIC0gU1NIIEZpbGUgVHJhbnNmZXIgUHJvdG9jb2wnO1xuICAgIG9wdGlvblNGVFAudmFsdWUgPSAnc2Z0cCc7XG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdC5hZGQob3B0aW9uU0ZUUCk7XG4gICAgbGV0IHByb3RvY29sU2VsZWN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvdG9jb2xTZWxlY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2VsZWN0LWNvbnRhaW5lcicpO1xuICAgIHByb3RvY29sU2VsZWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGYucHJvdG9jb2xTZWxlY3QpO1xuXG4gICAgbGV0IHByb3RvY29sRW5jcnlwdGlvbkxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwcm90b2NvbEVuY3J5cHRpb25MYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHByb3RvY29sRW5jcnlwdGlvbkxhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm90b2NvbEVuY3J5cHRpb25MYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ0VuY3J5cHRpb24nO1xuICAgIHByb3RvY29sRW5jcnlwdGlvbkxhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIHByb3RvY29sRW5jcnlwdGlvbkxhYmVsLmFwcGVuZENoaWxkKHByb3RvY29sRW5jcnlwdGlvbkxhYmVsVGl0bGUpO1xuXG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcbiAgICBsZXQgb3B0aW9uUGxhaW5GVFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvblBsYWluRlRQLnRleHQgPSAnT25seSB1c2UgcGxhaW4gRlRQIChpbnNlY3VyZSknO1xuICAgIG9wdGlvblBsYWluRlRQLnZhbHVlID0gJ25vbmUnO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LmFkZChvcHRpb25QbGFpbkZUUCk7XG4gICAgbGV0IG9wdGlvbkV4cGxpY2l0U0ZUUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uRXhwbGljaXRTRlRQLnRleHQgPSAnUmVxdWlyZSBleHBsaWNpdCBGVFAgb3ZlciBUTFMnO1xuICAgIG9wdGlvbkV4cGxpY2l0U0ZUUC52YWx1ZSA9ICdleHBsaWNpdCc7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3QuYWRkKG9wdGlvbkV4cGxpY2l0U0ZUUCk7XG4gICAgbGV0IG9wdGlvbkltcGxpY2l0U0ZUUCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uSW1wbGljaXRTRlRQLnRleHQgPSAnUmVxdWlyZSBpbXBsaWNpdCBGVFAgb3ZlciBUTFMnO1xuICAgIG9wdGlvbkltcGxpY2l0U0ZUUC52YWx1ZSA9ICdpbXBsaWNpdCc7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3QuYWRkKG9wdGlvbkltcGxpY2l0U0ZUUCk7XG4gICAgbGV0IHByb3RvY29sRW5jcnlwdGlvblNlbGVjdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb3RvY29sRW5jcnlwdGlvblNlbGVjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzZWxlY3QtY29udGFpbmVyJyk7XG4gICAgcHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0KTtcblxuICAgIGxldCBsb2dvblR5cGVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgbG9nb25UeXBlTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBsb2dvblR5cGVMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbG9nb25UeXBlTGFiZWxUaXRsZS50ZXh0Q29udGVudCA9ICdMb2dvbiBUeXBlJztcbiAgICBsb2dvblR5cGVMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBsb2dvblR5cGVMYWJlbC5hcHBlbmRDaGlsZChsb2dvblR5cGVMYWJlbFRpdGxlKTtcblxuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG4gICAgbGV0IG9wdGlvbk5vcm1hbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uTm9ybWFsLnRleHQgPSAnVXNlcm5hbWUgLyBQYXNzd29yZCc7XG4gICAgb3B0aW9uTm9ybWFsLnZhbHVlID0gJ2NyZWRlbnRpYWxzJztcbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5hZGQob3B0aW9uTm9ybWFsKTtcbiAgICBsZXQgb3B0aW9uS2V5RmlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uS2V5RmlsZS50ZXh0ID0gJ0tleWZpbGUgKE9wZW5TU0ggZm9ybWF0IC0gUEVNKSc7XG4gICAgb3B0aW9uS2V5RmlsZS52YWx1ZSA9ICdrZXlmaWxlJztcbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5hZGQob3B0aW9uS2V5RmlsZSk7XG4gICAgbGV0IG9wdGlvbkFnZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHRpb25BZ2VudC50ZXh0ID0gJ1NTSCBBZ2VudCc7XG4gICAgb3B0aW9uQWdlbnQudmFsdWUgPSAnYWdlbnQnO1xuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmFkZChvcHRpb25BZ2VudCk7XG4gICAgbGV0IGxvZ29uVHlwZVNlbGVjdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxvZ29uVHlwZVNlbGVjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzZWxlY3QtY29udGFpbmVyJyk7XG4gICAgbG9nb25UeXBlU2VsZWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGYubG9nb25UeXBlU2VsZWN0KTtcblxuICAgIGxldCB1c2VyTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHVzZXJMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHVzZXJMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdXNlckxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSBgVXNlcm5hbWUgZm9yIGF1dGhlbnRpY2F0aW9uLmA7XG4gICAgdXNlckxhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIHVzZXJMYWJlbC5hcHBlbmRDaGlsZCh1c2VyTGFiZWxUaXRsZSk7XG4gICAgc2VsZi51c2VySW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwidXNlcm5hbWVcIiB9KTtcbiAgICBzZWxmLnVzZXJJbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuXG4gICAgbGV0IHBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHBhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBwYXNzd29yZExhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXNzd29yZExhYmVsVGl0bGUudGV4dENvbnRlbnQgPSBgUGFzc3dvcmQvUGFzc3BocmFzZSBmb3IgYXV0aGVudGljYXRpb24uYDtcbiAgICBwYXNzd29yZExhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIHBhc3N3b3JkTGFiZWwuYXBwZW5kQ2hpbGQocGFzc3dvcmRMYWJlbFRpdGxlKTtcbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwicGFzc3dvcmRcIiB9KTtcbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb3JtLWNvbnRyb2wnKTtcblxuICAgIGxldCBwcml2YXRla2V5ZmlsZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwcml2YXRla2V5ZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgcHJpdmF0ZWtleWZpbGVMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJpdmF0ZWtleWZpbGVMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gYFBhdGggdG8gcHJpdmF0ZSBrZXlmaWxlLmA7XG4gICAgcHJpdmF0ZWtleWZpbGVMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBwcml2YXRla2V5ZmlsZUxhYmVsLmFwcGVuZENoaWxkKHByaXZhdGVrZXlmaWxlTGFiZWxUaXRsZSk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcInBhdGggdG8gcHJpdmF0ZSBrZXlmaWxlXCIgfSk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgcmVtb3RlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIHJlbW90ZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtbGFiZWwnKTtcbiAgICBsZXQgcmVtb3RlTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbW90ZUxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSBgSW5pdGlhbCBEaXJlY3RvcnkuYDtcbiAgICByZW1vdGVMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICByZW1vdGVMYWJlbC5hcHBlbmRDaGlsZChyZW1vdGVMYWJlbFRpdGxlKTtcbiAgICBzZWxmLnJlbW90ZUlucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIi9cIiB9KTtcbiAgICBzZWxmLnJlbW90ZUlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgbmFtZUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuYW1lQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIG5hbWVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ25hbWUnKTtcbiAgICBuYW1lQ29udHJvbC5hcHBlbmRDaGlsZChuYW1lTGFiZWwpO1xuICAgIG5hbWVDb250cm9sLmFwcGVuZENoaWxkKHNlbGYubmFtZUlucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IGZvbGRlckNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBmb2xkZXJDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgZm9sZGVyQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdmb2xkZXInKTtcbiAgICBmb2xkZXJDb250cm9sLmFwcGVuZENoaWxkKGZvbGRlckxhYmVsKTtcbiAgICBmb2xkZXJDb250cm9sLmFwcGVuZENoaWxkKHNlbGYuZm9sZGVyU2VsZWN0KTtcblxuICAgIGxldCBmb2xkZXJCdXR0b25Db250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9sZGVyQnV0dG9uQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGZvbGRlckJ1dHRvbkNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnZm9sZGVyLWJ1dHRvbicpO1xuICAgIGZvbGRlckJ1dHRvbkNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5mb2xkZXJFZGl0KTtcblxuICAgIGxldCBob3N0Q29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvc3RDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgaG9zdENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnaG9zdCcpO1xuICAgIGhvc3RDb250cm9sLmFwcGVuZENoaWxkKGhvc3RMYWJlbCk7XG4gICAgaG9zdENvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5ob3N0SW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgcG9ydENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwb3J0Q29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHBvcnRDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3BvcnQnKTtcbiAgICBwb3J0Q29udHJvbC5hcHBlbmRDaGlsZChwb3J0TGFiZWwpO1xuICAgIHBvcnRDb250cm9sLmFwcGVuZENoaWxkKHNlbGYucG9ydElucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IHByb3RvY29sQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb3RvY29sQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHByb3RvY29sQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdwcm90b2NvbCcpO1xuICAgIHByb3RvY29sQ29udHJvbC5hcHBlbmRDaGlsZChwcm90b2NvbExhYmVsKTtcbiAgICBwcm90b2NvbENvbnRyb2wuYXBwZW5kQ2hpbGQocHJvdG9jb2xTZWxlY3RDb250YWluZXIpO1xuXG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ3Byb3RvY29sLWVuY3J5cHRpb24nKTtcbiAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvbkNvbnRyb2wuYXBwZW5kQ2hpbGQocHJvdG9jb2xFbmNyeXB0aW9uTGFiZWwpO1xuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbC5hcHBlbmRDaGlsZChwcm90b2NvbEVuY3J5cHRpb25TZWxlY3RDb250YWluZXIpO1xuXG4gICAgbGV0IGxvZ29uVHlwZUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2dvblR5cGVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgbG9nb25UeXBlQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdwcm90b2NvbCcpO1xuICAgIGxvZ29uVHlwZUNvbnRyb2wuYXBwZW5kQ2hpbGQobG9nb25UeXBlTGFiZWwpO1xuICAgIGxvZ29uVHlwZUNvbnRyb2wuYXBwZW5kQ2hpbGQobG9nb25UeXBlU2VsZWN0Q29udGFpbmVyKTtcblxuICAgIGxldCBuYW1lR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuYW1lR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIG5hbWVHcm91cC5hcHBlbmRDaGlsZChuYW1lQ29udHJvbCk7XG4gICAgbmFtZUdyb3VwLmFwcGVuZENoaWxkKGZvbGRlckNvbnRyb2wpO1xuICAgIG5hbWVHcm91cC5hcHBlbmRDaGlsZChmb2xkZXJCdXR0b25Db250cm9sKTtcbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChuYW1lR3JvdXApO1xuXG4gICAgbGV0IGhvc3RHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvc3RHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJyk7XG4gICAgaG9zdEdyb3VwLmFwcGVuZENoaWxkKGhvc3RDb250cm9sKTtcbiAgICBob3N0R3JvdXAuYXBwZW5kQ2hpbGQocG9ydENvbnRyb2wpO1xuICAgIGRpdlJlcXVpcmVkLmFwcGVuZENoaWxkKGhvc3RHcm91cCk7XG5cbiAgICBsZXQgcHJvdG9jb2xHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb3RvY29sR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIHByb3RvY29sR3JvdXAuYXBwZW5kQ2hpbGQocHJvdG9jb2xDb250cm9sKTtcbiAgICBwcm90b2NvbEdyb3VwLmFwcGVuZENoaWxkKHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uQ29udHJvbCk7XG4gICAgcHJvdG9jb2xHcm91cC5hcHBlbmRDaGlsZChsb2dvblR5cGVDb250cm9sKTtcbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChwcm90b2NvbEdyb3VwKTtcblxuICAgIGxldCB1c2VybmFtZUNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB1c2VybmFtZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICB1c2VybmFtZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgndXNlcm5hbWUnKTtcbiAgICB1c2VybmFtZUNvbnRyb2wuYXBwZW5kQ2hpbGQodXNlckxhYmVsKTtcbiAgICB1c2VybmFtZUNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi51c2VySW5wdXQuZWxlbWVudCk7XG5cbiAgICBzZWxmLnBhc3N3b3JkQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlbGYucGFzc3dvcmRDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgc2VsZi5wYXNzd29yZENvbnRyb2wuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQnKTtcbiAgICBzZWxmLnBhc3N3b3JkQ29udHJvbC5hcHBlbmRDaGlsZChwYXNzd29yZExhYmVsKTtcbiAgICBzZWxmLnBhc3N3b3JkQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLnBhc3N3b3JkSW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgY3JlZGVudGlhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY3JlZGVudGlhbEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBjcmVkZW50aWFsR3JvdXAuYXBwZW5kQ2hpbGQodXNlcm5hbWVDb250cm9sKTtcbiAgICBjcmVkZW50aWFsR3JvdXAuYXBwZW5kQ2hpbGQoc2VsZi5wYXNzd29yZENvbnRyb2wpO1xuICAgIGRpdlJlcXVpcmVkLmFwcGVuZENoaWxkKGNyZWRlbnRpYWxHcm91cCk7XG5cbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgncHJpdmF0ZWtleWZpbGUnKTtcbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5hcHBlbmRDaGlsZChwcml2YXRla2V5ZmlsZUxhYmVsKTtcbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgcmVtb3RlQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbW90ZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICByZW1vdGVDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3JlbW90ZScpO1xuICAgIHJlbW90ZUNvbnRyb2wuYXBwZW5kQ2hpbGQocmVtb3RlTGFiZWwpO1xuICAgIHJlbW90ZUNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5yZW1vdGVJbnB1dC5lbGVtZW50KTtcblxuICAgIGxldCBhZHZhbmNlZFNldHRpbmdzR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhZHZhbmNlZFNldHRpbmdzR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIGFkdmFuY2VkU2V0dGluZ3NHcm91cC5hcHBlbmRDaGlsZChzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbCk7XG4gICAgYWR2YW5jZWRTZXR0aW5nc0dyb3VwLmFwcGVuZENoaWxkKHJlbW90ZUNvbnRyb2wpO1xuICAgIGRpdlJlcXVpcmVkLmFwcGVuZENoaWxkKGFkdmFuY2VkU2V0dGluZ3NHcm91cCk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLm5hbWVJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5uYW1lID0gc2VsZi5uYW1lSW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgICAgc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnRleHQgPSBzZWxmLm5hbWVJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYuaG9zdElucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLmhvc3QgPSBzZWxmLmhvc3RJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucG9ydElucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnBvcnQgPSBzZWxmLnBvcnRJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRGb2xkZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBsZXQgb3B0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5zZWxlY3RlZE9wdGlvbnNbMF07XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wYXJlbnQgPSBwYXJzZUludChvcHRpb24udmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi5mb2xkZXJFZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLmVkaXRGb2xkZXJzKCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VsZWN0ZWRPcHRpb25zWzBdO1xuXG4gICAgICAgIGlmIChvcHRpb24udmFsdWUgPT0gJ3NmdHAnKSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnNmdHAgPSB0cnVlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZWN1cmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ubG9nb24gPSAnY3JlZGVudGlhbHMnO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZnRwID0gZmFsc2U7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnVzZUFnZW50ID0gZmFsc2U7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnByaXZhdGVrZXlmaWxlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5maWxsSW5wdXRGaWVsZHMoU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VsZWN0ZWRPcHRpb25zWzBdO1xuXG4gICAgICAgIGlmIChvcHRpb24udmFsdWUgPT0gJ2V4cGxpY2l0Jykge1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5zZWN1cmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi52YWx1ZSA9PSAnaW1wbGljaXQnKSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnNlY3VyZSA9ICdpbXBsaWNpdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnNlY3VyZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIGxldCBvcHRpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0LnNlbGVjdGVkT3B0aW9uc1swXTtcblxuICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09ICdjcmVkZW50aWFscycpIHtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ubG9nb24gPSAnY3JlZGVudGlhbHMnO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VBZ2VudCA9IGZhbHNlO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wcml2YXRla2V5ZmlsZSA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi52YWx1ZSA9PSAna2V5ZmlsZScpIHtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ubG9nb24gPSAna2V5ZmlsZSc7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnVzZUFnZW50ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnZhbHVlID09ICdhZ2VudCcpIHtcbiAgICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ubG9nb24gPSAnYWdlbnQnO1xuICAgICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS51c2VBZ2VudCA9IHRydWU7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnByaXZhdGVrZXlmaWxlID0gJyc7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnBhc3N3b3JkID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnVzZUFnZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5maWxsSW5wdXRGaWVsZHMoU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYudXNlcklucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnVzZXIgPSBzZWxmLnVzZXJJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGNoYW5naW5nID0gZmFsc2U7XG4gICAgY29uc3QgcGFzc3dvcmRNb2RlbCA9IHNlbGYucGFzc3dvcmRJbnB1dC5nZXRNb2RlbCgpO1xuICAgIHBhc3N3b3JkTW9kZWwuY2xlYXJUZXh0UGFzc3dvcmQgPSBuZXcgVGV4dEJ1ZmZlcignJyk7XG4gICAgcGFzc3dvcmRNb2RlbC5idWZmZXIub25EaWRDaGFuZ2UoKG9iaikgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZykge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHBhc3N3b3JkTW9kZWwuY2xlYXJUZXh0UGFzc3dvcmQuc2V0VGV4dEluUmFuZ2Uob2JqLm9sZFJhbmdlLCBvYmoubmV3VGV4dCk7XG4gICAgICAgIHBhc3N3b3JkTW9kZWwuYnVmZmVyLnNldFRleHRJblJhbmdlKG9iai5uZXdSYW5nZSwgJyonLnJlcGVhdChvYmoubmV3VGV4dC5sZW5ndGgpKTtcblxuICAgICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgICAgU3RvcmFnZS5nZXRTZXJ2ZXJzKClbaW5kZXhdLnBhc3N3b3JkID0gcGFzc3dvcmRNb2RlbC5jbGVhclRleHRQYXNzd29yZC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgaW5kZXggPSBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgIFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XS5wcml2YXRla2V5ZmlsZSA9IHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucmVtb3RlSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0ucmVtb3RlID0gc2VsZi5yZW1vdGVJbnB1dC5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gSGFuZGxlIGtleWRvd24gYnkgdGFiIGV2ZW50cyB0byBzd2l0Y2ggYmV0d2VlbiBmaWVsZHNcbiAgICBzZWxmLm5hbWVJbnB1dC5nZXRNb2RlbCgpLmdldEVsZW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoc2VsZi5mb2xkZXJTZWxlY3QpLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLmZvbGRlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYuaG9zdElucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLmhvc3RJbnB1dC5nZXRNb2RlbCgpLmdldEVsZW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYucG9ydElucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYudXNlcklucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnVzZXJJbnB1dC5nZXRNb2RlbCgpLmdldEVsZW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgICAgaWYgKG9wdGlvbiA9PSAnY3JlZGVudGlhbHMnKSB7XG4gICAgICAgICAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PSAna2V5ZmlsZScpIHtcbiAgICAgICAgICAgIHNlbGYucGFzc3dvcmRJbnB1dC5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09ICdhZ2VudCcpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3RlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYucGFzc3dvcmRJbnB1dC5nZXRNb2RlbCgpLmdldEVsZW1lbnQoKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09ICdUYWInKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG4gICAgICAgICAgaWYgKG9wdGlvbiA9PSAnY3JlZGVudGlhbHMnKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW90ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT0gJ2tleWZpbGUnKSB7XG4gICAgICAgICAgICBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PSAnYWdlbnQnKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW90ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuZ2V0TW9kZWwoKS5nZXRFbGVtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnVGFiJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxmLnJlbW90ZUlucHV0LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGl2UmVxdWlyZWQ7XG4gIH1cblxuICBjcmVhdGVDb250cm9sc0ZvbGRlclNlbGVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBzZWxlY3RlZF92YWx1ZSA9IHNlbGYuZm9sZGVyU2VsZWN0LnZhbHVlO1xuXG4gICAgd2hpbGUgKHNlbGYuZm9sZGVyU2VsZWN0LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHNlbGYuZm9sZGVyU2VsZWN0LnJlbW92ZUNoaWxkKHNlbGYuZm9sZGVyU2VsZWN0LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25Ob25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHRpb25Ob25lLnRleHQgPSAnLSBOb25lIC0nO1xuICAgIG9wdGlvbk5vbmUudmFsdWUgPSBudWxsO1xuICAgIHNlbGYuZm9sZGVyU2VsZWN0LmFkZChvcHRpb25Ob25lKTtcblxuICAgIFN0b3JhZ2UuZ2V0Rm9sZGVyc1N0cnVjdHVyZWRCeVRyZWUoKS5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGxldCBmb2xkZXJfb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgIGZvbGRlcl9vcHRpb24udGV4dCA9IGNvbmZpZy5uYW1lO1xuICAgICAgZm9sZGVyX29wdGlvbi52YWx1ZSA9IGNvbmZpZy5pZDtcbiAgICAgIHNlbGYuZm9sZGVyU2VsZWN0LmFkZChmb2xkZXJfb3B0aW9uKTtcbiAgICB9KTtcblxuICAgIHNlbGYuZm9sZGVyU2VsZWN0LnZhbHVlID0gc2VsZWN0ZWRfdmFsdWU7XG4gIH1cblxuICBjcmVhdGVTZXJ2ZXJTZWxlY3QoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3NlcnZlcicpO1xuICAgIGRpdi5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMjBweCc7XG5cbiAgICBsZXQgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgc2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuICAgIHNlbGYuc2VsZWN0U2VydmVyID0gc2VsZWN0O1xuICAgIHNlbGYuc2VsZWN0U2VydmVyLmZvY3VzKCk7XG5cbiAgICBsZXQgc2VydmVyQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlcnZlckNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBzZXJ2ZXJDb250cm9sLmNsYXNzTGlzdC5hZGQoJ3NlcnZlcicpO1xuICAgIHNlcnZlckNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5zZWxlY3RTZXJ2ZXIpO1xuXG4gICAgbGV0IG5ld0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld0J1dHRvbi50ZXh0Q29udGVudCA9ICdOZXcnO1xuICAgIG5ld0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHNlbGYuZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VsZi5kZWxldGVCdXR0b24udGV4dENvbnRlbnQgPSAnRGVsZXRlJztcbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VsZi5kdXBsaWNhdGVCdXR0b24udGV4dENvbnRlbnQgPSAnRHVwbGljYXRlJztcbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcblxuICAgIHNlbGYudGVzdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbGYudGVzdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdUZXN0JztcbiAgICBzZWxmLnRlc3RCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBsZXQgYnV0dG9uQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbkNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBidXR0b25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ3NlcnZlci1idXR0b24nKTtcbiAgICBidXR0b25Db250cm9sLmFwcGVuZENoaWxkKG5ld0J1dHRvbik7XG4gICAgYnV0dG9uQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLmRlbGV0ZUJ1dHRvbik7XG4gICAgYnV0dG9uQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLmR1cGxpY2F0ZUJ1dHRvbik7XG4gICAgYnV0dG9uQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLnRlc3RCdXR0b24pO1xuXG4gICAgbGV0IHNlcnZlckdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2VydmVyR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIHNlcnZlckdyb3VwLmFwcGVuZENoaWxkKHNlcnZlckNvbnRyb2wpO1xuICAgIHNlcnZlckdyb3VwLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRyb2wpO1xuXG4gICAgZGl2LmFwcGVuZENoaWxkKHNlcnZlckdyb3VwKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgb3B0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5zZWxlY3RlZE9wdGlvbnNbMF07XG4gICAgICAgIGxldCBpbmRleEluQXJyYXkgPSBvcHRpb24udmFsdWU7XG5cbiAgICAgICAgc2VsZi5maWxsSW5wdXRGaWVsZHMoKGluZGV4SW5BcnJheSkgPyBTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleEluQXJyYXldIDogbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBuZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYubmV3KCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5kZWxldGUoKTtcbiAgICB9KTtcblxuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLmR1cGxpY2F0ZSgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi50ZXN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLnRlc3QoKTtcbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBrZXlkb3duIGJ5IHRhYiBldmVudHMgdG8gc3dpdGNoIGJldHdlZW4gZmllbGRzXG4gICAgc2VsZi50ZXN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ1RhYicpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VsZi5uYW1lSW5wdXQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICByZWxvYWQoc2VsZWN0ZWRTZXJ2ZXIgPSBudWxsKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIgPSB0cnVlO1xuXG4gICAgc2VsZi5jcmVhdGVDb250cm9sc0ZvbGRlclNlbGVjdCgpO1xuXG4gICAgd2hpbGUgKHNlbGYuc2VsZWN0U2VydmVyLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHNlbGYuc2VsZWN0U2VydmVyLnJlbW92ZUNoaWxkKHNlbGYuc2VsZWN0U2VydmVyLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZEluZGV4ID0gMDtcbiAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICBTdG9yYWdlLmdldFNlcnZlcnMoKS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgb3B0aW9uLnRleHQgPSBpdGVtLm5hbWU7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGluZGV4O1xuICAgICAgICBzZWxmLnNlbGVjdFNlcnZlci5hZGQob3B0aW9uKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRTZXJ2ZXIgJiYgdHlwZW9mIHNlbGVjdGVkU2VydmVyLmNvbmZpZyAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZWN0ZWRTZXJ2ZXIuY29uZmlnLmhvc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKHNlbGVjdGVkU2VydmVyLmNvbmZpZy5ob3N0ID09IGl0ZW0uaG9zdCAmJiBzZWxlY3RlZFNlcnZlci5jb25maWcubmFtZSA9PSBpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLnNlbGVjdFNlcnZlci5zZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleDtcbiAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKFN0b3JhZ2UuZ2V0U2VydmVycygpW3NlbGVjdGVkSW5kZXhdKTtcblxuICAgICAgLy8gRW5hYmxlIElucHV0IEZpZWxkc1xuICAgICAgc2VsZi5lbmFibGVJbnB1dEZpZWxkcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmZpbGxJbnB1dEZpZWxkcygpO1xuXG4gICAgICAvLyBEaXNhYmxlIElucHV0IEZpZWxkc1xuICAgICAgc2VsZi5kaXNhYmxlSW5wdXRGaWVsZHMoKTtcbiAgICB9XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICBpdGVtOiBzZWxmXG4gICAgfSk7XG5cbiAgICAvLyBSZXNpemUgY29udGVudCB0byBmaXQgb24gc21hbGxlciBkaXNwbGF5c1xuICAgIGxldCBib2R5ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGNvbnRlbnQgPSBzZWxmLnBhbmVsLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBvZmZzZXQgPSAkKHNlbGYucGFuZWwuZWxlbWVudCkucG9zaXRpb24oKS50b3A7XG5cbiAgICBpZiAoY29udGVudCArICgyICogb2Zmc2V0KSA+IGJvZHkpIHtcbiAgICAgIGxldCBzZXR0aW5ncyA9IHNlbGYuY29udGVudC5maW5kKCcuc2VydmVyLXNldHRpbmdzJylbMF07XG4gICAgICBsZXQgaGVpZ2h0ID0gKDIgKiBvZmZzZXQpICsgY29udGVudCAtIGJvZHk7XG4gICAgICAkKHNldHRpbmdzKS5oZWlnaHQoJChzZXR0aW5ncykuaGVpZ2h0KCkgLSBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZGVzdHJveVBhbmVsID0gdGhpcy5wYW5lbDtcbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICBpZiAoZGVzdHJveVBhbmVsKSB7XG4gICAgICBkZXN0cm95UGFuZWwuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIFN0b3JhZ2UubG9hZCh0cnVlKTtcblxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHNob3dFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5lcnJvci50ZXh0KG1lc3NhZ2UpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLmZsYXNoRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICBmaWxsSW5wdXRGaWVsZHMoc2VydmVyID0gbnVsbCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gdHJ1ZTtcblxuICAgIGlmIChzZXJ2ZXIpIHtcbiAgICAgIHNlbGYubmFtZUlucHV0LnNldFRleHQoc2VydmVyLm5hbWUgPyBzZXJ2ZXIubmFtZSA6IHNlcnZlci5ob3N0KTtcbiAgICAgIHNlbGYuaG9zdElucHV0LnNldFRleHQoc2VydmVyLmhvc3QpO1xuICAgICAgc2VsZi5wb3J0SW5wdXQuc2V0VGV4dChzZXJ2ZXIucG9ydCk7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRGb2xkZXIoc2VydmVyLnBhcmVudCkpIHtcbiAgICAgICAgc2VsZi5mb2xkZXJTZWxlY3QudmFsdWUgPSBTdG9yYWdlLmdldEZvbGRlcihzZXJ2ZXIucGFyZW50KS5pZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuZm9sZGVyU2VsZWN0LnZhbHVlID0gJ251bGwnO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VydmVyLnNmdHApIHtcbiAgICAgICAgc2VsZi5wcm90b2NvbFNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMTtcbiAgICAgICAgc2VsZi5wb3J0SW5wdXQuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyLXRleHQnLCAnMjInKTtcblxuICAgICAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvblNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcblxuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5vcHRpb25zWzFdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHNlbGYubG9nb25UeXBlU2VsZWN0Lm9wdGlvbnNbMl0uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICBzZWxmLnByb3RvY29sRW5jcnlwdGlvbkNvbnRyb2wuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmU7XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5wcm90b2NvbFNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgXG4gICAgICAgIGlmIChzZXJ2ZXIuc2VjdXJlID09PSAnaW1wbGljaXQnKSB7XG4gICAgICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDI7XG4gICAgICAgICAgc2VsZi5wb3J0SW5wdXQuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyLXRleHQnLCAnOTkwJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VydmVyLnNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHNlbGYucHJvdG9jb2xFbmNyeXB0aW9uU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAxO1xuICAgICAgICAgIHNlbGYucG9ydElucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlci10ZXh0JywgJzIxJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgc2VsZi5wb3J0SW5wdXQuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyLXRleHQnLCAnMjEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAwOyAvLyBVc2VybmFtZS9QYXNzd29yZFxuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5vcHRpb25zWzFdLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5sb2dvblR5cGVTZWxlY3Qub3B0aW9uc1syXS5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25Db250cm9sLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VydmVyLmxvZ29uID09ICdrZXlmaWxlJykge1xuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMTsgLy8gS2V5ZmlsZVxuICAgICAgICBzZWxmLnBhc3N3b3JkQ29udHJvbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUNvbnRyb2wucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICB9IGVsc2UgaWYgKHNlcnZlci5sb2dvbiA9PSAnYWdlbnQnKSB7XG4gICAgICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAyOyAvLyBTU0ggQWdlbnRcbiAgICAgICAgc2VsZi5wYXNzd29yZENvbnRyb2wuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmU7XCIpO1xuICAgICAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZTtcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDsgLy8gVXNlcm5hbWUvUGFzc3dvcmRcbiAgICAgICAgc2VsZi5wYXNzd29yZENvbnRyb2wucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIHNlbGYucHJpdmF0ZWtleWZpbGVDb250cm9sLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lO1wiKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi51c2VySW5wdXQuc2V0VGV4dChzZXJ2ZXIudXNlcik7XG4gICAgICBzZWxmLnBhc3N3b3JkSW5wdXQuc2V0VGV4dChzZXJ2ZXIucGFzc3dvcmQpO1xuICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LnNldFRleHQoc2VydmVyLnByaXZhdGVrZXlmaWxlID8gc2VydmVyLnByaXZhdGVrZXlmaWxlIDogJycpO1xuICAgICAgc2VsZi5yZW1vdGVJbnB1dC5zZXRUZXh0KHNlcnZlci5yZW1vdGUgPyBzZXJ2ZXIucmVtb3RlIDogJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5uYW1lSW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLmhvc3RJbnB1dC5zZXRUZXh0KCcnKTtcbiAgICAgIHNlbGYucG9ydElucHV0LnNldFRleHQoJycpO1xuXG4gICAgICBzZWxmLnByb3RvY29sU2VsZWN0LnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgc2VsZi5wcm90b2NvbEVuY3J5cHRpb25TZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICBzZWxmLmxvZ29uVHlwZVNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcblxuICAgICAgc2VsZi51c2VySW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLnBhc3N3b3JkSW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLnByaXZhdGVrZXlmaWxlSW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLnJlbW90ZUlucHV0LnNldFRleHQoJycpO1xuXG4gICAgICBzZWxmLnByaXZhdGVrZXlmaWxlQ29udHJvbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZTtcIik7XG4gICAgfVxuXG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG4gIH1cblxuICBlbmFibGVJbnB1dEZpZWxkcygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5kZWxldGVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5kdXBsaWNhdGVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYudGVzdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYudGVzdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5uYW1lSW5wdXRbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLm5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmZvbGRlclNlbGVjdC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5ob3N0SW5wdXRbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmhvc3RJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5wb3J0SW5wdXRbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnBvcnRJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5wcm90b2NvbFNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYudXNlcklucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi51c2VySW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIHNlbGYucGFzc3dvcmRJbnB1dFswXS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucGFzc3dvcmRJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBzZWxmLnJlbW90ZUlucHV0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5yZW1vdGVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgZGlzYWJsZUlucHV0RmllbGRzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kZWxldGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLmR1cGxpY2F0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYuZHVwbGljYXRlQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYudGVzdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYudGVzdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLm5hbWVJbnB1dFswXS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYubmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYuZm9sZGVyU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5mb2xkZXJTZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5ob3N0SW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmhvc3RJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLnBvcnRJbnB1dFswXS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYucG9ydElucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYucHJvdG9jb2xTZWxlY3QuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnByb3RvY29sU2VsZWN0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYubG9nb25UeXBlU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5sb2dvblR5cGVTZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi51c2VySW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnVzZXJJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLnBhc3N3b3JkSW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnBhc3N3b3JkSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0WzBdLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYucmVtb3RlSW5wdXRbMF0uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnJlbW90ZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIGxldCBjaGFuZ2luZyA9IGZhbHNlO1xuICAgIHNlbGYubmFtZUlucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZyAmJiBzZWxmLm5hbWVJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYubmFtZUlucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYuaG9zdElucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZyAmJiBzZWxmLmhvc3RJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYuaG9zdElucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucG9ydElucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZyAmJiBzZWxmLnBvcnRJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYucG9ydElucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYudXNlcklucHV0LmdldE1vZGVsKCkub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZyAmJiBzZWxmLnVzZXJJbnB1dC5kaXNhYmxlZCkge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIHNlbGYudXNlcklucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucGFzc3dvcmRJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi5wYXNzd29yZElucHV0LmRpc2FibGVkKSB7XG4gICAgICAgIGNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5wYXNzd29yZElucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucHJpdmF0ZWtleWZpbGVJbnB1dC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcgJiYgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LmRpc2FibGVkKSB7XG4gICAgICAgIGNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5wcml2YXRla2V5ZmlsZUlucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYucmVtb3RlSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoIWNoYW5naW5nICYmIHNlbGYucmVtb3RlSW5wdXQuZGlzYWJsZWQpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBzZWxmLnJlbW90ZUlucHV0LnNldFRleHQoJycpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGVzdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gc2VsZi5zZWxlY3RTZXJ2ZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShTdG9yYWdlLmdldFNlcnZlcnMoKVtpbmRleF0pKTtcblxuICAgICAgY29uc3QgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcihjb25maWcpO1xuXG4gICAgICBjb25uZWN0b3Iub24oJ2RlYnVnJywgKGNtZCwgcGFyYW0xLCBwYXJhbTIpID0+IHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmRldi5kZWJ1ZycpKSB7XG4gICAgICAgICAgaWYgKHBhcmFtMSAmJiBwYXJhbTIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNtZCwgcGFyYW0xLCBwYXJhbTIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjbWQsIHBhcmFtMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjbWQpIGNvbnNvbGUubG9nKGNtZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25uZWN0b3IuY29ubmVjdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZSgnQ29ubmVjdGlvbiBjb3VsZCBiZSBlc3RhYmxpc2hlZCBzdWNjZXNzZnVsbHknKVxuICAgICAgICBjb25uZWN0b3IuZGlzY29ubmVjdChudWxsKS5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICBjb25uZWN0b3IuZGVzdHJveSgpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBzaG93TWVzc2FnZShlcnIsICdlcnJvcicpO1xuICAgICAgICBjb25uZWN0b3IuZGlzY29ubmVjdChudWxsKS5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICBjb25uZWN0b3IuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkgeyB9XG4gIH1cblxuICBuZXcoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmVuYWJsZUlucHV0RmllbGRzKCk7XG5cbiAgICBsZXQgbmV3Y29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWcpKTtcbiAgICBuZXdjb25maWcubmFtZSA9IGNvbmZpZy5uYW1lICsgXCIgXCIgKyAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoICsgMSk7XG4gICAgU3RvcmFnZS5hZGRTZXJ2ZXIobmV3Y29uZmlnKTtcblxuICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24udGV4dCA9IG5ld2NvbmZpZy5uYW1lO1xuICAgIG9wdGlvbi52YWx1ZSA9IFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAtIDE7XG5cbiAgICB0aGlzLnNlbGVjdFNlcnZlci5hZGQob3B0aW9uKTtcbiAgICB0aGlzLnNlbGVjdFNlcnZlci52YWx1ZSA9IFN0b3JhZ2UuZ2V0U2VydmVycygpLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5zZWxlY3RTZXJ2ZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcbiAgICBzZWxmLm5hbWVJbnB1dC5mb2N1cygpO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBTdG9yYWdlLnNhdmUoKTtcbiAgICBzZWxmLmNsb3NlKCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICBTdG9yYWdlLmRlbGV0ZVNlcnZlcihpbmRleCk7XG5cbiAgICBzZWxmLnJlbG9hZCgpO1xuICAgIHNlbGYuc2VsZWN0U2VydmVyLmZvY3VzKCk7XG4gIH1cblxuICBkdXBsaWNhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoID09IDApIHJldHVybjtcblxuICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0U2VydmVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcblxuICAgIHNlbGYuZW5hYmxlSW5wdXRGaWVsZHMoKTtcblxuICAgIGxldCBuZXdjb25maWcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFN0b3JhZ2UuZ2V0U2VydmVycygpW2luZGV4XSkpO1xuICAgIG5ld2NvbmZpZy5uYW1lID0gbmV3Y29uZmlnLm5hbWUgKyBcIiBcIiArIChTdG9yYWdlLmdldFNlcnZlcnMoKS5sZW5ndGggKyAxKTtcbiAgICBTdG9yYWdlLmFkZFNlcnZlcihuZXdjb25maWcpO1xuXG4gICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG9wdGlvbi50ZXh0ID0gbmV3Y29uZmlnLm5hbWU7XG4gICAgb3B0aW9uLnZhbHVlID0gU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoIC0gMTtcblxuICAgIHRoaXMuc2VsZWN0U2VydmVyLmFkZChvcHRpb24pO1xuICAgIHRoaXMuc2VsZWN0U2VydmVyLnZhbHVlID0gU3RvcmFnZS5nZXRTZXJ2ZXJzKCkubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnNlbGVjdFNlcnZlci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICAgIHNlbGYubmFtZUlucHV0LmZvY3VzKCk7XG4gIH1cblxuICBpbXBvcnQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgaW1wb3J0SGFuZGxlciA9IG5ldyBJbXBvcnQoKTtcblxuICAgIGltcG9ydEhhbmRsZXIub25GaW5pc2hlZCA9IChzdGF0aXN0aWMpID0+IHtcbiAgICAgIGxldCBkZXRhaWwgPSBbXTtcblxuICAgICAgaWYgKHN0YXRpc3RpYy5jcmVhdGVkU2VydmVycykge1xuICAgICAgICBkZXRhaWwucHVzaChzdGF0aXN0aWMuY3JlYXRlZFNlcnZlcnMgKyBcIiBOZXcgU2VydmVyKHMpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXRpc3RpYy51cGRhdGVkU2VydmVycykge1xuICAgICAgICBkZXRhaWwucHVzaChzdGF0aXN0aWMudXBkYXRlZFNlcnZlcnMgKyBcIiBVcGRhdGVkIFNlcnZlcihzKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0aXN0aWMuY3JlYXRlZEZvbGRlcnMpIHtcbiAgICAgICAgZGV0YWlsLnB1c2goc3RhdGlzdGljLmNyZWF0ZWRGb2xkZXJzICsgXCIgTmV3IEZvbGRlcihzKVwiKTtcbiAgICAgIH1cblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ0ltcG9ydCBjb21wbGV0ZWQnLCB7XG4gICAgICAgIGRldGFpbDogJ0ltcG9ydGVkOiAnICsgZGV0YWlsLmpvaW4oJywgJykgKyAnLicsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIHNlbGYucmVsb2FkKCk7XG4gICAgfTtcblxuICAgIGltcG9ydEhhbmRsZXIub25XYXJuaW5nID0gKGVycm9yKSA9PiB7XG4gICAgICAvLyBUT0RPXG4gICAgfTtcblxuICAgIGltcG9ydEhhbmRsZXIub25FcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgaW1wb3J0LicsIHtcbiAgICAgICAgZGV0YWlsOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpbXBvcnRIYW5kbGVyLmltcG9ydCgpO1xuICB9XG5cbiAgZWRpdEZvbGRlcnMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBmb2xkZXJDb25maWd1cmF0aW9uVmlldyA9IG5ldyBGb2xkZXJDb25maWd1cmF0aW9uVmlldygnJywgdHJ1ZSk7XG5cbiAgICBsZXQgaW5kZXggPSBzZWxmLmZvbGRlclNlbGVjdC5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XG5cbiAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICBsZXQgZm9sZGVyID0gU3RvcmFnZS5nZXRGb2xkZXIoaW5kZXgpO1xuICAgICAgZm9sZGVyQ29uZmlndXJhdGlvblZpZXcucmVsb2FkKGZvbGRlcik7XG4gICAgfSBlbHNlIGlmIChTdG9yYWdlLmdldEZvbGRlcnMoKS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZm9sZGVyID0gU3RvcmFnZS5nZXRGb2xkZXJzKClbMF07XG4gICAgICBmb2xkZXJDb25maWd1cmF0aW9uVmlldy5yZWxvYWQoZm9sZGVyKTtcbiAgICB9XG5cbiAgICBmb2xkZXJDb25maWd1cmF0aW9uVmlldy5vbignY2xvc2UnLCAoZSkgPT4ge1xuICAgICAgc2VsZi5jcmVhdGVDb250cm9sc0ZvbGRlclNlbGVjdCgpO1xuICAgICAgc2VsZi5hdHRhY2goKTtcbiAgICB9KTtcblxuICAgIGZvbGRlckNvbmZpZ3VyYXRpb25WaWV3LmF0dGFjaCgpO1xuICB9XG59XG4iXX0=