Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _atom = require('atom');

'use babel';

var atom = global.atom;
var config = require('./../config/folder-schema.json');
var Storage = require('./../helper/storage.js');

var FolderConfigurationView = (function (_View) {
  _inherits(FolderConfigurationView, _View);

  function FolderConfigurationView() {
    _classCallCheck(this, FolderConfigurationView);

    _get(Object.getPrototypeOf(FolderConfigurationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FolderConfigurationView, [{
    key: 'initialize',
    value: function initialize() {
      var self = this;

      self.subscriptions = null;
      self.disableEventhandler = false;

      var html = '<p>Ftp-Remote-Edit Folder Settings</p>';
      html += "<p>You can edit each folder at the time. All changes will only be saved by pushing the save button on the Server Settings window.</p>";
      self.info.html(html);

      var closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.classList.add('btn');
      closeButton.classList.add('pull-right');

      self.content.append(self.createFolderSelect());
      self.content.append(self.createControls());

      self.footer.append(closeButton);

      // Events
      closeButton.addEventListener('click', function (event) {
        self.close();
      });

      self.subscriptions = new _atom.CompositeDisposable();
      self.subscriptions.add(atom.commands.add(this.element, {
        'core:confirm': function coreConfirm() {
          self.close();
        },
        'core:cancel': function coreCancel() {
          self.close();
        }
      }));
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
      divRequired.classList.add('folder-settings');

      var nameLabel = document.createElement('label');
      nameLabel.classList.add('control-label');
      var nameLabelTitle = document.createElement('div');
      nameLabelTitle.textContent = 'The name of the folder.';
      nameLabelTitle.classList.add('setting-title');
      nameLabel.appendChild(nameLabelTitle);
      self.nameInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "name" });
      self.nameInput.element.classList.add('form-control');

      var parentLabel = document.createElement('label');
      parentLabel.classList.add('control-label');
      var parentLabelTitle = document.createElement('div');
      parentLabelTitle.textContent = 'Choose parent folder';
      parentLabelTitle.classList.add('setting-title');
      parentLabel.appendChild(parentLabelTitle);

      self.parentSelect = document.createElement('select');
      self.parentSelect.classList.add('form-control');

      var parentSelectContainer = document.createElement('div');
      parentSelectContainer.classList.add('select-container');
      parentSelectContainer.appendChild(self.parentSelect);

      var nameControl = document.createElement('div');
      nameControl.classList.add('controls');
      nameControl.classList.add('name');
      nameControl.appendChild(nameLabel);
      nameControl.appendChild(self.nameInput.element);

      var parentControl = document.createElement('div');
      parentControl.classList.add('controls');
      parentControl.classList.add('parent');
      parentControl.appendChild(parentLabel);
      parentControl.appendChild(parentSelectContainer);

      var nameGroup = document.createElement('div');
      nameGroup.classList.add('control-group');
      nameGroup.appendChild(parentControl);
      nameGroup.appendChild(nameControl);

      divRequired.appendChild(nameGroup);

      // Events
      self.nameInput.getModel().onDidChange(function () {
        if (Storage.getFolders().length !== 0 && !self.disableEventhandler) {
          var index = self.selectFolder.selectedOptions[0].value;
          var folder = Storage.getFolder(index);
          folder.name = self.nameInput.getText().trim();
          self.selectFolder.selectedOptions[0].text = self.nameInput.getText().trim();
        }
      });

      self.parentSelect.addEventListener('change', function (event) {
        if (Storage.getFolders().length !== 0 && !self.disableEventhandler) {
          var index = self.selectFolder.selectedOptions[0].value;
          var option = event.currentTarget.selectedOptions[0].value;
          var folder = Storage.getFolder(index);
          folder.parent = parseInt(option);
        }
      });

      return divRequired;
    }
  }, {
    key: 'createControlsParent',
    value: function createControlsParent() {
      var self = this;

      while (self.parentSelect.firstChild) {
        self.parentSelect.removeChild(self.parentSelect.firstChild);
      }

      var option = document.createElement("option");
      option.text = '- None -';
      option.value = null;
      self.parentSelect.add(option);

      Storage.getFoldersStructuredByTree().forEach(function (config) {
        var folder_option = document.createElement("option");
        folder_option.text = config.name;
        folder_option.value = config.id;
        folder_option.dataset.parents_id = config.parents_id;
        self.parentSelect.add(folder_option);
      });
    }
  }, {
    key: 'createFolderSelect',
    value: function createFolderSelect() {
      var self = this;

      var div = document.createElement('div');
      div.classList.add('folder');
      div.style.marginBottom = '20px';

      var select = document.createElement('select');
      select.classList.add('form-control');
      self.selectFolder = select;
      self.selectFolder.focus();

      var folderControl = document.createElement('div');
      folderControl.classList.add('controls');
      folderControl.classList.add('folder');
      folderControl.appendChild(self.selectFolder);

      var newButton = document.createElement('button');
      newButton.textContent = 'New';
      newButton.classList.add('btn');

      self.deleteButton = document.createElement('button');
      self.deleteButton.textContent = 'Delete';
      self.deleteButton.classList.add('btn');

      var buttonControl = document.createElement('div');
      buttonControl.classList.add('controls');
      buttonControl.classList.add('folder-button');
      buttonControl.appendChild(newButton);
      buttonControl.appendChild(self.deleteButton);

      var folderGroup = document.createElement('div');
      folderGroup.classList.add('control-group');
      folderGroup.appendChild(folderControl);
      folderGroup.appendChild(buttonControl);

      div.appendChild(folderGroup);

      // Events
      select.addEventListener('change', function (event) {
        if (Storage.getFolders().length !== 0 && !self.disableEventhandler) {
          var option = event.currentTarget.selectedOptions[0];
          var indexInArray = option.value;

          self.fillInputFields(indexInArray ? Storage.getFolder(indexInArray) : null);
        }
      });

      newButton.addEventListener('click', function (event) {
        self['new']();
      });

      self.deleteButton.addEventListener('click', function (event) {
        self['delete']();
      });

      return div;
    }
  }, {
    key: 'reload',
    value: function reload(selectedFolder) {
      var self = this;

      self.disableEventhandler = true;

      while (self.selectFolder.firstChild) {
        self.selectFolder.removeChild(self.selectFolder.firstChild);
      }

      var selectedIndex = 0;
      if (Storage.getFolders().length !== 0) {
        Storage.getFolders().forEach(function (item, index) {
          var option = document.createElement("option");
          option.text = item.name;
          option.value = item.id;
          self.selectFolder.add(option);
        });

        if (typeof selectedFolder === 'undefined') {
          selectedFolder = Storage.getFolders()[0];
        }

        this.selectFolder.value = selectedFolder.id;
        self.fillInputFields(selectedFolder);

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

      if (Storage.getFolders().length === 0) {
        self.disableInputFields();
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

      this.trigger('close');
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
      var folder = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      self.disableEventhandler = true;

      self.createControlsParent();

      if (folder) {
        self.nameInput.setText(folder.name);
        if (folder.parent === null) {
          self.parentSelect.selectedIndex = 0;
        } else {
          self.parentSelect.value = folder.parent;
        }
        for (i = self.parentSelect.options.length - 1; i >= 0; i--) {
          self.parentSelect.options[i].disabled = self.parentSelect.options[i].hidden = self.parentSelect.options[i].value == folder.id || typeof self.parentSelect.options[i].dataset.parents_id !== 'undefined' && typeof self.parentSelect.options[i].dataset.parents_id.split(",").find(function (element) {
            return parseInt(element) === parseInt(folder.id);
          }) !== 'undefined';
        }
      } else {
        self.nameInput.setText('');
        self.parentSelect.selectedIndex = 0;
      }

      self.disableEventhandler = false;
    }
  }, {
    key: 'enableInputFields',
    value: function enableInputFields() {
      var self = this;

      self.deleteButton.classList.remove('disabled');
      self.deleteButton.disabled = false;

      self.nameInput[0].classList.remove('disabled');
      self.nameInput.disabled = false;

      self.parentSelect.classList.remove('disabled');
      self.parentSelect.disabled = false;
    }
  }, {
    key: 'disableInputFields',
    value: function disableInputFields() {
      var self = this;

      self.deleteButton.classList.add('disabled');
      self.deleteButton.disabled = true;

      self.nameInput[0].classList.add('disabled');
      self.nameInput.disabled = true;

      self.parentSelect.classList.add('disabled');
      self.parentSelect.disabled = true;

      var changing = false;
      self.nameInput.getModel().onDidChange(function () {
        if (!changing && self.nameInput.disabled) {
          changing = true;
          self.nameInput.setText('');
          changing = false;
        }
      });
    }
  }, {
    key: 'new',
    value: function _new() {
      var self = this;

      self.enableInputFields();

      var newconfig = JSON.parse(JSON.stringify(config));
      newconfig.name = config.name + " " + (Storage.getFolders().length + 1);
      newconfig = Storage.addFolder(newconfig);

      var option = document.createElement('option');
      option.text = newconfig.name;
      option.value = newconfig.id;

      this.selectFolder.add(option);
      this.selectFolder.value = option.value;
      this.selectFolder.dispatchEvent(new Event('change'));
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var self = this;

      if (Storage.getFolders().length != 0) {
        var index = self.selectFolder.value;
        Storage.deleteFolder(index);
      }

      self.reload();
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

  return FolderConfigurationView;
})(_atomSpacePenViews.View);

exports['default'] = FolderConfigurationView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9mb2xkZXItY29uZmlndXJhdGlvbi12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFd0Msc0JBQXNCOztvQkFDMUIsTUFBTTs7QUFIMUMsV0FBVyxDQUFDOztBQUtaLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDekQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0lBRTdCLHVCQUF1QjtZQUF2Qix1QkFBdUI7O1dBQXZCLHVCQUF1QjswQkFBdkIsdUJBQXVCOzsrQkFBdkIsdUJBQXVCOzs7ZUFBdkIsdUJBQXVCOztXQWlDaEMsc0JBQUc7QUFDWCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7O0FBRWpDLFVBQUksSUFBSSxHQUFHLHdDQUF3QyxDQUFDO0FBQ3BELFVBQUksSUFBSSx1SUFBdUksQ0FBQztBQUNoSixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckIsVUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxpQkFBVyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDbEMsaUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFeEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixF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VUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQTVYYSxtQkFBRzs7O0FBQ2YsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2QsaUJBQU8sZ0RBQWdEO09BQ3hELEVBQUUsWUFBTTtBQUNQLGNBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sUUFBUTtTQUNoQixFQUFFLFlBQU07QUFDUCxnQkFBSyxHQUFHLENBQUM7QUFDUCxxQkFBTyxhQUFhO1dBQ3JCLEVBQUUsWUFBTTtBQUNQLGtCQUFLLEtBQUssQ0FBQztBQUNULHVCQUFPLE1BQU07QUFDYixvQkFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7QUFDSCxrQkFBSyxHQUFHLENBQUM7QUFDUCx1QkFBTyxnQkFBZ0I7QUFDdkIsb0JBQU0sRUFBRSxTQUFTO2FBQ2xCLENBQUMsQ0FBQztBQUNILGtCQUFLLEdBQUcsQ0FBQztBQUNQLHVCQUFPLGVBQWU7QUFDdEIsb0JBQU0sRUFBRSxRQUFRO2FBQ2pCLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztBQUNILGNBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sZUFBZTtBQUN0QixnQkFBTSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQS9Ca0IsdUJBQXVCOzs7cUJBQXZCLHVCQUF1QiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvdmlld3MvZm9sZGVyLWNvbmZpZ3VyYXRpb24tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyAkLCBWaWV3LCBUZXh0RWRpdG9yVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuY29uc3QgYXRvbSA9IGdsb2JhbC5hdG9tO1xuY29uc3QgY29uZmlnID0gcmVxdWlyZSgnLi8uLi9jb25maWcvZm9sZGVyLXNjaGVtYS5qc29uJyk7XG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi8uLi9oZWxwZXIvc3RvcmFnZS5qcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb2xkZXJDb25maWd1cmF0aW9uVmlldyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdCBzZXR0aW5ncy12aWV3IG92ZXJsYXkgZnJvbS10b3AnXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ3BhbmVscycsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3BhbmVscy1pdGVtJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoe1xuICAgICAgICAgICAgY2xhc3M6ICdpY29uJyxcbiAgICAgICAgICAgIG91dGxldDogJ2luZm8nLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICAgIGNsYXNzOiAncGFuZWxzLWNvbnRlbnQnLFxuICAgICAgICAgICAgb3V0bGV0OiAnY29udGVudCcsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5kaXYoe1xuICAgICAgICAgICAgY2xhc3M6ICdwYW5lbHMtZm9vdGVyJyxcbiAgICAgICAgICAgIG91dGxldDogJ2Zvb3RlcicsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAnZXJyb3ItbWVzc2FnZScsXG4gICAgICAgIG91dGxldDogJ2Vycm9yJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG5cbiAgICBsZXQgaHRtbCA9ICc8cD5GdHAtUmVtb3RlLUVkaXQgRm9sZGVyIFNldHRpbmdzPC9wPic7XG4gICAgaHRtbCArPSBcIjxwPllvdSBjYW4gZWRpdCBlYWNoIGZvbGRlciBhdCB0aGUgdGltZS4gQWxsIGNoYW5nZXMgd2lsbCBvbmx5IGJlIHNhdmVkIGJ5IHB1c2hpbmcgdGhlIHNhdmUgYnV0dG9uIG9uIHRoZSBTZXJ2ZXIgU2V0dGluZ3Mgd2luZG93LjwvcD5cIjtcbiAgICBzZWxmLmluZm8uaHRtbChodG1sKTtcblxuICAgIGxldCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNsb3NlQnV0dG9uLnRleHRDb250ZW50ID0gJ0Nsb3NlJztcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwdWxsLXJpZ2h0Jyk7XG5cbiAgICBzZWxmLmNvbnRlbnQuYXBwZW5kKHNlbGYuY3JlYXRlRm9sZGVyU2VsZWN0KCkpO1xuICAgIHNlbGYuY29udGVudC5hcHBlbmQoc2VsZi5jcmVhdGVDb250cm9scygpKTtcblxuICAgIHNlbGYuZm9vdGVyLmFwcGVuZChjbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBFdmVudHNcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHtcbiAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgfSxcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHtcbiAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgfSxcbiAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuc3Vic2NyaXB0aW9ucykge1xuICAgICAgc2VsZi5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29udHJvbHMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZGl2UmVxdWlyZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXZSZXF1aXJlZC5jbGFzc0xpc3QuYWRkKCdmb2xkZXItc2V0dGluZ3MnKTtcblxuICAgIGxldCBuYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIG5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IG5hbWVMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmFtZUxhYmVsVGl0bGUudGV4dENvbnRlbnQgPSAnVGhlIG5hbWUgb2YgdGhlIGZvbGRlci4nO1xuICAgIG5hbWVMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBuYW1lTGFiZWwuYXBwZW5kQ2hpbGQobmFtZUxhYmVsVGl0bGUpO1xuICAgIHNlbGYubmFtZUlucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIm5hbWVcIiB9KTtcbiAgICBzZWxmLm5hbWVJbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tY29udHJvbCcpO1xuXG4gICAgbGV0IHBhcmVudExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBwYXJlbnRMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IHBhcmVudExhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXJlbnRMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ0Nob29zZSBwYXJlbnQgZm9sZGVyJztcbiAgICBwYXJlbnRMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBwYXJlbnRMYWJlbC5hcHBlbmRDaGlsZChwYXJlbnRMYWJlbFRpdGxlKTtcblxuICAgIHNlbGYucGFyZW50U2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgc2VsZi5wYXJlbnRTZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG5cbiAgICBsZXQgcGFyZW50U2VsZWN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGFyZW50U2VsZWN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdC1jb250YWluZXInKTtcbiAgICBwYXJlbnRTZWxlY3RDb250YWluZXIuYXBwZW5kQ2hpbGQoc2VsZi5wYXJlbnRTZWxlY3QpO1xuXG4gICAgbGV0IG5hbWVDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmFtZUNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBuYW1lQ29udHJvbC5jbGFzc0xpc3QuYWRkKCduYW1lJyk7XG4gICAgbmFtZUNvbnRyb2wuYXBwZW5kQ2hpbGQobmFtZUxhYmVsKTtcbiAgICBuYW1lQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLm5hbWVJbnB1dC5lbGVtZW50KTtcblxuICAgIGxldCBwYXJlbnRDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGFyZW50Q29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIHBhcmVudENvbnRyb2wuY2xhc3NMaXN0LmFkZCgncGFyZW50Jyk7XG4gICAgcGFyZW50Q29udHJvbC5hcHBlbmRDaGlsZChwYXJlbnRMYWJlbCk7XG4gICAgcGFyZW50Q29udHJvbC5hcHBlbmRDaGlsZChwYXJlbnRTZWxlY3RDb250YWluZXIpO1xuXG4gICAgbGV0IG5hbWVHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5hbWVHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJyk7XG4gICAgbmFtZUdyb3VwLmFwcGVuZENoaWxkKHBhcmVudENvbnRyb2wpO1xuICAgIG5hbWVHcm91cC5hcHBlbmRDaGlsZChuYW1lQ29udHJvbCk7XG5cbiAgICBkaXZSZXF1aXJlZC5hcHBlbmRDaGlsZChuYW1lR3JvdXApO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgc2VsZi5uYW1lSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoU3RvcmFnZS5nZXRGb2xkZXJzKCkubGVuZ3RoICE9PSAwICYmICFzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RGb2xkZXIuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBsZXQgZm9sZGVyID0gU3RvcmFnZS5nZXRGb2xkZXIoaW5kZXgpO1xuICAgICAgICBmb2xkZXIubmFtZSA9IHNlbGYubmFtZUlucHV0LmdldFRleHQoKS50cmltKCk7XG4gICAgICAgIHNlbGYuc2VsZWN0Rm9sZGVyLnNlbGVjdGVkT3B0aW9uc1swXS50ZXh0ID0gc2VsZi5uYW1lSW5wdXQuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYucGFyZW50U2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKFN0b3JhZ2UuZ2V0Rm9sZGVycygpLmxlbmd0aCAhPT0gMCAmJiAhc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHNlbGYuc2VsZWN0Rm9sZGVyLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xuICAgICAgICBsZXQgZm9sZGVyID0gU3RvcmFnZS5nZXRGb2xkZXIoaW5kZXgpO1xuICAgICAgICBmb2xkZXIucGFyZW50ID0gcGFyc2VJbnQob3B0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkaXZSZXF1aXJlZDtcbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xzUGFyZW50KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgd2hpbGUgKHNlbGYucGFyZW50U2VsZWN0LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHNlbGYucGFyZW50U2VsZWN0LnJlbW92ZUNoaWxkKHNlbGYucGFyZW50U2VsZWN0LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbi50ZXh0ID0gJy0gTm9uZSAtJztcbiAgICBvcHRpb24udmFsdWUgPSBudWxsO1xuICAgIHNlbGYucGFyZW50U2VsZWN0LmFkZChvcHRpb24pO1xuXG4gICAgU3RvcmFnZS5nZXRGb2xkZXJzU3RydWN0dXJlZEJ5VHJlZSgpLmZvckVhY2goKGNvbmZpZykgPT4ge1xuICAgICAgbGV0IGZvbGRlcl9vcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgZm9sZGVyX29wdGlvbi50ZXh0ID0gY29uZmlnLm5hbWU7XG4gICAgICBmb2xkZXJfb3B0aW9uLnZhbHVlID0gY29uZmlnLmlkO1xuICAgICAgZm9sZGVyX29wdGlvbi5kYXRhc2V0LnBhcmVudHNfaWQgPSBjb25maWcucGFyZW50c19pZDtcbiAgICAgIHNlbGYucGFyZW50U2VsZWN0LmFkZChmb2xkZXJfb3B0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUZvbGRlclNlbGVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZm9sZGVyJyk7XG4gICAgZGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyMHB4JztcblxuICAgIGxldCBzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybS1jb250cm9sJyk7XG4gICAgc2VsZi5zZWxlY3RGb2xkZXIgPSBzZWxlY3Q7XG4gICAgc2VsZi5zZWxlY3RGb2xkZXIuZm9jdXMoKTtcblxuICAgIGxldCBmb2xkZXJDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9sZGVyQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGZvbGRlckNvbnRyb2wuY2xhc3NMaXN0LmFkZCgnZm9sZGVyJyk7XG4gICAgZm9sZGVyQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLnNlbGVjdEZvbGRlcik7XG5cbiAgICBsZXQgbmV3QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbmV3QnV0dG9uLnRleHRDb250ZW50ID0gJ05ldyc7XG4gICAgbmV3QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgc2VsZi5kZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdEZWxldGUnO1xuICAgIHNlbGYuZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgbGV0IGJ1dHRvbkNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b25Db250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgYnV0dG9uQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdmb2xkZXItYnV0dG9uJyk7XG4gICAgYnV0dG9uQ29udHJvbC5hcHBlbmRDaGlsZChuZXdCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRyb2wuYXBwZW5kQ2hpbGQoc2VsZi5kZWxldGVCdXR0b24pO1xuXG4gICAgbGV0IGZvbGRlckdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9sZGVyR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIGZvbGRlckdyb3VwLmFwcGVuZENoaWxkKGZvbGRlckNvbnRyb2wpO1xuICAgIGZvbGRlckdyb3VwLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRyb2wpO1xuXG4gICAgZGl2LmFwcGVuZENoaWxkKGZvbGRlckdyb3VwKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChTdG9yYWdlLmdldEZvbGRlcnMoKS5sZW5ndGggIT09IDAgJiYgIXNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikge1xuICAgICAgICBsZXQgb3B0aW9uID0gZXZlbnQuY3VycmVudFRhcmdldC5zZWxlY3RlZE9wdGlvbnNbMF07XG4gICAgICAgIGxldCBpbmRleEluQXJyYXkgPSBvcHRpb24udmFsdWU7XG5cbiAgICAgICAgc2VsZi5maWxsSW5wdXRGaWVsZHMoKGluZGV4SW5BcnJheSkgPyBTdG9yYWdlLmdldEZvbGRlcihpbmRleEluQXJyYXkpIDogbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBuZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYubmV3KCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgc2VsZi5kZWxldGUoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICByZWxvYWQoc2VsZWN0ZWRGb2xkZXIpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IHRydWU7XG5cbiAgICB3aGlsZSAoc2VsZi5zZWxlY3RGb2xkZXIuZmlyc3RDaGlsZCkge1xuICAgICAgc2VsZi5zZWxlY3RGb2xkZXIucmVtb3ZlQ2hpbGQoc2VsZi5zZWxlY3RGb2xkZXIuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGVkSW5kZXggPSAwO1xuICAgIGlmIChTdG9yYWdlLmdldEZvbGRlcnMoKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0b3JhZ2UuZ2V0Rm9sZGVycygpLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICBvcHRpb24udGV4dCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgc2VsZi5zZWxlY3RGb2xkZXIuYWRkKG9wdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RlZEZvbGRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2VsZWN0ZWRGb2xkZXIgPSBTdG9yYWdlLmdldEZvbGRlcnMoKVswXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RGb2xkZXIudmFsdWUgPSBzZWxlY3RlZEZvbGRlci5pZDtcbiAgICAgIHNlbGYuZmlsbElucHV0RmllbGRzKHNlbGVjdGVkRm9sZGVyKTtcblxuICAgICAgLy8gRW5hYmxlIElucHV0IEZpZWxkc1xuICAgICAgc2VsZi5lbmFibGVJbnB1dEZpZWxkcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmZpbGxJbnB1dEZpZWxkcygpO1xuXG4gICAgICAvLyBEaXNhYmxlIElucHV0IEZpZWxkc1xuICAgICAgc2VsZi5kaXNhYmxlSW5wdXRGaWVsZHMoKTtcbiAgICB9XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICBpdGVtOiBzZWxmXG4gICAgfSk7XG5cbiAgICBpZiAoU3RvcmFnZS5nZXRGb2xkZXJzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxmLmRpc2FibGVJbnB1dEZpZWxkcygpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc3QgZGVzdHJveVBhbmVsID0gdGhpcy5wYW5lbDtcbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICBpZiAoZGVzdHJveVBhbmVsKSB7XG4gICAgICBkZXN0cm95UGFuZWwuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcignY2xvc2UnKTtcbiAgfVxuXG4gIHNob3dFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5lcnJvci50ZXh0KG1lc3NhZ2UpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLmZsYXNoRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICBmaWxsSW5wdXRGaWVsZHMoZm9sZGVyID0gbnVsbCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gdHJ1ZTtcblxuICAgIHNlbGYuY3JlYXRlQ29udHJvbHNQYXJlbnQoKTtcblxuICAgIGlmIChmb2xkZXIpIHtcbiAgICAgIHNlbGYubmFtZUlucHV0LnNldFRleHQoZm9sZGVyLm5hbWUpO1xuICAgICAgaWYgKGZvbGRlci5wYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgc2VsZi5wYXJlbnRTZWxlY3Quc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnBhcmVudFNlbGVjdC52YWx1ZSA9IGZvbGRlci5wYXJlbnQ7XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSBzZWxmLnBhcmVudFNlbGVjdC5vcHRpb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHNlbGYucGFyZW50U2VsZWN0Lm9wdGlvbnNbaV0uZGlzYWJsZWQgPSBzZWxmLnBhcmVudFNlbGVjdC5vcHRpb25zW2ldLmhpZGRlbiA9IChzZWxmLnBhcmVudFNlbGVjdC5vcHRpb25zW2ldLnZhbHVlID09IGZvbGRlci5pZCB8fCAodHlwZW9mIHNlbGYucGFyZW50U2VsZWN0Lm9wdGlvbnNbaV0uZGF0YXNldC5wYXJlbnRzX2lkICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygc2VsZi5wYXJlbnRTZWxlY3Qub3B0aW9uc1tpXS5kYXRhc2V0LnBhcmVudHNfaWQuc3BsaXQoXCIsXCIpLmZpbmQoKGVsZW1lbnQpID0+IHsgcmV0dXJuIHBhcnNlSW50KGVsZW1lbnQpID09PSBwYXJzZUludChmb2xkZXIuaWQpOyB9KSAhPT0gJ3VuZGVmaW5lZCcpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5uYW1lSW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICBzZWxmLnBhcmVudFNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGVuYWJsZUlucHV0RmllbGRzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kZWxldGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5uYW1lSW5wdXRbMF0uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLm5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgc2VsZi5wYXJlbnRTZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLnBhcmVudFNlbGVjdC5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgZGlzYWJsZUlucHV0RmllbGRzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5kZWxldGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICBzZWxmLmRlbGV0ZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBzZWxmLm5hbWVJbnB1dFswXS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIHNlbGYubmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHNlbGYucGFyZW50U2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgc2VsZi5wYXJlbnRTZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgbGV0IGNoYW5naW5nID0gZmFsc2U7XG4gICAgc2VsZi5uYW1lSW5wdXQuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICBpZiAoIWNoYW5naW5nICYmIHNlbGYubmFtZUlucHV0LmRpc2FibGVkKSB7XG4gICAgICAgIGNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5uYW1lSW5wdXQuc2V0VGV4dCgnJyk7XG4gICAgICAgIGNoYW5naW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZXcoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmVuYWJsZUlucHV0RmllbGRzKCk7XG5cbiAgICBsZXQgbmV3Y29uZmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWcpKTtcbiAgICBuZXdjb25maWcubmFtZSA9IGNvbmZpZy5uYW1lICsgXCIgXCIgKyAoU3RvcmFnZS5nZXRGb2xkZXJzKCkubGVuZ3RoICsgMSk7XG4gICAgbmV3Y29uZmlnID0gU3RvcmFnZS5hZGRGb2xkZXIobmV3Y29uZmlnKTtcblxuICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24udGV4dCA9IG5ld2NvbmZpZy5uYW1lO1xuICAgIG9wdGlvbi52YWx1ZSA9IG5ld2NvbmZpZy5pZDtcblxuICAgIHRoaXMuc2VsZWN0Rm9sZGVyLmFkZChvcHRpb24pO1xuICAgIHRoaXMuc2VsZWN0Rm9sZGVyLnZhbHVlID0gb3B0aW9uLnZhbHVlXG4gICAgdGhpcy5zZWxlY3RGb2xkZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChTdG9yYWdlLmdldEZvbGRlcnMoKS5sZW5ndGggIT0gMCkge1xuICAgICAgbGV0IGluZGV4ID0gc2VsZi5zZWxlY3RGb2xkZXIudmFsdWU7XG4gICAgICBTdG9yYWdlLmRlbGV0ZUZvbGRlcihpbmRleCk7XG4gICAgfVxuXG4gICAgc2VsZi5yZWxvYWQoKTtcbiAgfVxufVxuIl19