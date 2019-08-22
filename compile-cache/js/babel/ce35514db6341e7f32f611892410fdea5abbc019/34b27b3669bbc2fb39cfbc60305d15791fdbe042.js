Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperHelperJs = require('./../helper/helper.js');

'use babel';

var PermissionsView = (function (_View) {
  _inherits(PermissionsView, _View);

  function PermissionsView() {
    _classCallCheck(this, PermissionsView);

    _get(Object.getPrototypeOf(PermissionsView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PermissionsView, [{
    key: 'initialize',
    value: function initialize(item) {
      var self = this;

      if (!item) return;

      self.disableEventhandler = false;
      self.item = item;
      self.rights = item.rights ? item.rights : { user: '', group: '', other: '' };

      if (self.item.is('.directory')) {
        self.isFile = false;
      } else {
        self.isFile = true;
      }

      var html = '<p>Change ' + (self.isFile ? 'file' : 'directory') + ' attributes</p>';
      html += '<p>Please select the new attributes for the ' + (self.isFile ? 'file' : 'directory') + ' "' + self.item.name + '".</p>';
      self.info.html(html);

      self.saveButton = document.createElement('button');
      self.saveButton.textContent = 'Save';
      self.saveButton.classList.add('btn');

      self.closeButton = document.createElement('button');
      self.closeButton.textContent = 'Cancel';
      self.closeButton.classList.add('btn');
      self.closeButton.classList.add('pull-right');

      self.elements.append(self.createPanelContent());

      self.elements.append(self.saveButton);
      self.elements.append(self.closeButton);

      // Events
      self.closeButton.addEventListener('click', function (event) {
        self.close();
      });

      self.saveButton.addEventListener('click', function (event) {
        self.save();
      });

      atom.commands.add(this.element, {
        'core:confirm': function coreConfirm() {
          // self.save();
        },
        'core:cancel': function coreCancel() {
          self.cancel();
        }
      });
    }
  }, {
    key: 'createPanelContent',
    value: function createPanelContent() {
      var self = this;

      var content = document.createElement('div');

      content.appendChild(self.createOwnerFieldset());
      content.appendChild(self.createGroupFieldset());
      content.appendChild(self.createOtherFieldset());

      var numericGroup = document.createElement('div');
      numericGroup.classList.add('control-group');
      numericGroup.style.marginBottom = '20px';

      var numericGroupControls = document.createElement('div');
      numericGroupControls.classList.add('controls');
      numericGroup.appendChild(numericGroupControls);

      var numericLabel = document.createElement('label');
      numericLabel.classList.add('control-label');
      var numericLabelTitle = document.createElement('div');
      numericLabelTitle.textContent = 'Numeric value';
      numericLabelTitle.classList.add('setting-title');
      numericLabel.appendChild(numericLabelTitle);
      numericGroup.appendChild(numericLabel);

      self.numericInput = new _atomSpacePenViews.TextEditorView({ mini: true });
      numericGroup.appendChild(self.numericInput.element);

      var infoLabel = document.createElement('p');
      infoLabel.textContent = 'You can use an x at any position to keep the permission the original ' + (self.isFile ? 'file' : 'directory') + ' have.';
      numericGroup.appendChild(infoLabel);

      content.appendChild(numericGroup);

      // Events
      self.numericInput.getModel().buffer.onDidChange(function (obj) {
        var allowed = ['x', '0', '1', '2', '3', '4', '5', '6', '7'];

        if (self.disableEventhandler) return;

        if (obj.newRange.end.column < obj.oldRange.end.column) {
          self.updateCheckboxInputs();
          return;
        }

        if (obj.newRange.end.column > 3) {
          self.numericInput.getModel().buffer.setTextInRange(obj.newRange, '');
          return;
        }

        obj.changes.forEach(function (change) {
          change.newText.split('').forEach(function (value) {
            if (allowed.indexOf(value) == -1) {
              self.numericInput.getModel().buffer.setTextInRange(obj.newRange, '');
            }
          });
        });

        self.updateCheckboxInputs();
      });

      return content;
    }
  }, {
    key: 'createOwnerFieldset',
    value: function createOwnerFieldset() {
      var self = this;

      var ownerGroup = document.createElement('div');
      ownerGroup.classList.add('control-group');
      ownerGroup.style.marginBottom = '20px';

      var ownerGroupLabel = document.createElement('label');
      ownerGroupLabel.classList.add('control-group-label');
      ownerGroupLabel.textContent = 'Owner permissions';
      ownerGroup.appendChild(ownerGroupLabel);

      var ownerGroupControl = document.createElement('div');
      ownerGroupControl.classList.add('controls');
      ownerGroupControl.classList.add('owner');
      ownerGroupControl.classList.add('checkbox');
      ownerGroup.appendChild(ownerGroupControl);

      var ownerGroupReadInputLabel = document.createElement('label');
      ownerGroupReadInputLabel.classList.add('control');
      ownerGroupControl.appendChild(ownerGroupReadInputLabel);

      self.ownerGroupReadInput = document.createElement('input');
      self.ownerGroupReadInput.type = 'checkbox';
      self.ownerGroupReadInput.checked = false;
      self.ownerGroupReadInput.classList.add('input-checkbox');
      var ownerGroupReadInputTitle = document.createElement('div');
      ownerGroupReadInputTitle.classList.add('input-title');
      ownerGroupReadInputTitle.textContent = 'Read';
      ownerGroupReadInputLabel.appendChild(self.ownerGroupReadInput);
      ownerGroupReadInputLabel.appendChild(ownerGroupReadInputTitle);

      var ownerGroupWriteInputLabel = document.createElement('label');
      ownerGroupWriteInputLabel.classList.add('control');
      ownerGroupControl.appendChild(ownerGroupWriteInputLabel);

      self.ownerGroupWriteInput = document.createElement('input');
      self.ownerGroupWriteInput.type = 'checkbox';
      self.ownerGroupWriteInput.checked = false;
      self.ownerGroupWriteInput.classList.add('input-checkbox');
      var ownerGroupWriteInputTitle = document.createElement('div');
      ownerGroupWriteInputTitle.classList.add('input-title');
      ownerGroupWriteInputTitle.textContent = 'Write';
      ownerGroupWriteInputLabel.appendChild(self.ownerGroupWriteInput);
      ownerGroupWriteInputLabel.appendChild(ownerGroupWriteInputTitle);

      var ownerGroupExecuteInputLabel = document.createElement('label');
      ownerGroupExecuteInputLabel.classList.add('control');
      ownerGroupControl.appendChild(ownerGroupExecuteInputLabel);

      self.ownerGroupExecuteInput = document.createElement('input');
      self.ownerGroupExecuteInput.type = 'checkbox';
      self.ownerGroupExecuteInput.checked = false;
      self.ownerGroupExecuteInput.classList.add('input-checkbox');
      var ownerGroupExecuteInputTitle = document.createElement('div');
      ownerGroupExecuteInputTitle.classList.add('input-title');
      ownerGroupExecuteInputTitle.textContent = 'Execute';
      ownerGroupExecuteInputLabel.appendChild(self.ownerGroupExecuteInput);
      ownerGroupExecuteInputLabel.appendChild(ownerGroupExecuteInputTitle);

      // Events
      self.ownerGroupReadInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.ownerGroupWriteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.ownerGroupExecuteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      return ownerGroup;
    }
  }, {
    key: 'createGroupFieldset',
    value: function createGroupFieldset() {
      var self = this;

      var groupGroup = document.createElement('div');
      groupGroup.classList.add('control-group');
      groupGroup.style.marginBottom = '20px';

      var groupGroupLabel = document.createElement('label');
      groupGroupLabel.classList.add('control-group-label');
      groupGroupLabel.textContent = 'Group permissions';
      groupGroup.appendChild(groupGroupLabel);

      var groupGroupControl = document.createElement('div');
      groupGroupControl.classList.add('controls');
      groupGroupControl.classList.add('group');
      groupGroupControl.classList.add('checkbox');
      groupGroup.appendChild(groupGroupControl);

      var groupGroupReadInputLabel = document.createElement('label');
      groupGroupReadInputLabel.classList.add('control');
      groupGroupControl.appendChild(groupGroupReadInputLabel);

      self.groupGroupReadInput = document.createElement('input');
      self.groupGroupReadInput.type = 'checkbox';
      self.groupGroupReadInput.checked = false;
      self.groupGroupReadInput.classList.add('input-checkbox');
      var groupGroupReadInputTitle = document.createElement('div');
      groupGroupReadInputTitle.classList.add('input-title');
      groupGroupReadInputTitle.textContent = 'Read';
      groupGroupReadInputLabel.appendChild(self.groupGroupReadInput);
      groupGroupReadInputLabel.appendChild(groupGroupReadInputTitle);

      var groupGroupWriteInputLabel = document.createElement('label');
      groupGroupWriteInputLabel.classList.add('control');
      groupGroupControl.appendChild(groupGroupWriteInputLabel);

      self.groupGroupWriteInput = document.createElement('input');
      self.groupGroupWriteInput.type = 'checkbox';
      self.groupGroupWriteInput.checked = false;
      self.groupGroupWriteInput.classList.add('input-checkbox');
      var groupGroupWriteInputTitle = document.createElement('div');
      groupGroupWriteInputTitle.classList.add('input-title');
      groupGroupWriteInputTitle.textContent = 'Write';
      groupGroupWriteInputLabel.appendChild(self.groupGroupWriteInput);
      groupGroupWriteInputLabel.appendChild(groupGroupWriteInputTitle);

      var groupGroupExecuteInputLabel = document.createElement('label');
      groupGroupExecuteInputLabel.classList.add('control');
      groupGroupControl.appendChild(groupGroupExecuteInputLabel);

      self.groupGroupExecuteInput = document.createElement('input');
      self.groupGroupExecuteInput.type = 'checkbox';
      self.groupGroupExecuteInput.checked = false;
      self.groupGroupExecuteInput.classList.add('input-checkbox');
      var groupGroupExecuteInputTitle = document.createElement('div');
      groupGroupExecuteInputTitle.classList.add('input-title');
      groupGroupExecuteInputTitle.textContent = 'Execute';
      groupGroupExecuteInputLabel.appendChild(self.groupGroupExecuteInput);
      groupGroupExecuteInputLabel.appendChild(groupGroupExecuteInputTitle);

      // Events
      self.groupGroupReadInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.groupGroupWriteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.groupGroupExecuteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      return groupGroup;
    }
  }, {
    key: 'createOtherFieldset',
    value: function createOtherFieldset() {
      var self = this;

      var otherGroup = document.createElement('div');
      otherGroup.classList.add('control-group');
      otherGroup.style.marginBottom = '20px';

      var otherGroupLabel = document.createElement('label');
      otherGroupLabel.classList.add('control-group-label');
      otherGroupLabel.textContent = 'Public permissions';
      otherGroup.appendChild(otherGroupLabel);

      var otherGroupControl = document.createElement('div');
      otherGroupControl.classList.add('controls');
      otherGroupControl.classList.add('other');
      otherGroupControl.classList.add('checkbox');
      otherGroup.appendChild(otherGroupControl);

      var otherGroupReadInputLabel = document.createElement('label');
      otherGroupReadInputLabel.classList.add('control');
      otherGroupControl.appendChild(otherGroupReadInputLabel);

      self.otherGroupReadInput = document.createElement('input');
      self.otherGroupReadInput.type = 'checkbox';
      self.otherGroupReadInput.checked = false;
      self.otherGroupReadInput.classList.add('input-checkbox');
      var otherGroupReadInputTitle = document.createElement('div');
      otherGroupReadInputTitle.classList.add('input-title');
      otherGroupReadInputTitle.textContent = 'Read';
      otherGroupReadInputLabel.appendChild(self.otherGroupReadInput);
      otherGroupReadInputLabel.appendChild(otherGroupReadInputTitle);

      var otherGroupWriteInputLabel = document.createElement('label');
      otherGroupWriteInputLabel.classList.add('control');
      otherGroupControl.appendChild(otherGroupWriteInputLabel);

      self.otherGroupWriteInput = document.createElement('input');
      self.otherGroupWriteInput.type = 'checkbox';
      self.otherGroupWriteInput.checked = false;
      self.otherGroupWriteInput.classList.add('input-checkbox');
      var otherGroupWriteInputTitle = document.createElement('div');
      otherGroupWriteInputTitle.classList.add('input-title');
      otherGroupWriteInputTitle.textContent = 'Write';
      otherGroupWriteInputLabel.appendChild(self.otherGroupWriteInput);
      otherGroupWriteInputLabel.appendChild(otherGroupWriteInputTitle);

      var otherGroupExecuteInputLabel = document.createElement('label');
      otherGroupExecuteInputLabel.classList.add('control');
      otherGroupControl.appendChild(otherGroupExecuteInputLabel);

      self.otherGroupExecuteInput = document.createElement('input');
      self.otherGroupExecuteInput.type = 'checkbox';
      self.otherGroupExecuteInput.checked = false;
      self.otherGroupExecuteInput.classList.add('input-checkbox');
      var otherGroupExecuteInputTitle = document.createElement('div');
      otherGroupExecuteInputTitle.classList.add('input-title');
      otherGroupExecuteInputTitle.textContent = 'Execute';
      otherGroupExecuteInputLabel.appendChild(self.otherGroupExecuteInput);
      otherGroupExecuteInputLabel.appendChild(otherGroupExecuteInputTitle);

      // Events
      self.otherGroupReadInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.otherGroupWriteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      self.otherGroupExecuteInput.addEventListener('change', function (event) {
        if (self.disableEventhandler) return;
        self.updateNumericInput();
      });

      return otherGroup;
    }
  }, {
    key: 'enableFieldset',
    value: function enableFieldset(group) {
      var self = this;

      if (group == 'owner') {
        self.ownerGroupReadInput.removeAttribute("disabled");
        self.ownerGroupWriteInput.removeAttribute("disabled");
        self.ownerGroupExecuteInput.removeAttribute("disabled");
      }

      if (group == 'group') {
        self.groupGroupReadInput.removeAttribute("disabled");
        self.groupGroupWriteInput.removeAttribute("disabled");
        self.groupGroupExecuteInput.removeAttribute("disabled");
      }

      if (group == 'other') {
        self.otherGroupReadInput.removeAttribute("disabled");
        self.otherGroupWriteInput.removeAttribute("disabled");
        self.otherGroupExecuteInput.removeAttribute("disabled");
      }
    }
  }, {
    key: 'disableFieldset',
    value: function disableFieldset(group) {
      var self = this;

      if (group == 'owner') {
        self.ownerGroupReadInput.setAttribute("disabled", true);
        self.ownerGroupWriteInput.setAttribute("disabled", true);
        self.ownerGroupExecuteInput.setAttribute("disabled", true);
      }

      if (group == 'group') {
        self.groupGroupReadInput.setAttribute("disabled", true);
        self.groupGroupWriteInput.setAttribute("disabled", true);
        self.groupGroupExecuteInput.setAttribute("disabled", true);
      }

      if (group == 'other') {
        self.otherGroupReadInput.setAttribute("disabled", true);
        self.otherGroupWriteInput.setAttribute("disabled", true);
        self.otherGroupExecuteInput.setAttribute("disabled", true);
      }
    }
  }, {
    key: 'setCheckboxInputs',
    value: function setCheckboxInputs(rights) {
      var self = this;

      var user = rights.user.split('');
      var group = rights.group.split('');
      var other = rights.other.split('');

      self.ownerGroupReadInput.checked = false;
      self.ownerGroupWriteInput.checked = false;
      self.ownerGroupExecuteInput.checked = false;
      self.groupGroupReadInput.checked = false;
      self.groupGroupWriteInput.checked = false;
      self.groupGroupExecuteInput.checked = false;
      self.otherGroupReadInput.checked = false;
      self.otherGroupWriteInput.checked = false;
      self.otherGroupExecuteInput.checked = false;

      user.forEach(function (right) {
        if (right == 'r') self.ownerGroupReadInput.checked = true;
        if (right == 'w') self.ownerGroupWriteInput.checked = true;
        if (right == 'x') self.ownerGroupExecuteInput.checked = true;
      });

      group.forEach(function (right) {
        if (right == 'r') self.groupGroupReadInput.checked = true;
        if (right == 'w') self.groupGroupWriteInput.checked = true;
        if (right == 'x') self.groupGroupExecuteInput.checked = true;
      });

      other.forEach(function (right) {
        if (right == 'r') self.otherGroupReadInput.checked = true;
        if (right == 'w') self.otherGroupWriteInput.checked = true;
        if (right == 'x') self.otherGroupExecuteInput.checked = true;
      });
    }
  }, {
    key: 'setNumericInput',
    value: function setNumericInput(permissions) {
      var self = this;

      self.numericInput.getModel().setText(permissions);
    }
  }, {
    key: 'updateNumericInput',
    value: function updateNumericInput() {
      var self = this;

      var permissionsuser = 0;
      var permissionsgroup = 0;
      var permissionsother = 0;

      if (self.ownerGroupReadInput.checked == true) permissionsuser += 4;
      if (self.ownerGroupWriteInput.checked == true) permissionsuser += 2;
      if (self.ownerGroupExecuteInput.checked == true) permissionsuser += 1;

      if (self.groupGroupReadInput.checked == true) permissionsgroup += 4;
      if (self.groupGroupWriteInput.checked == true) permissionsgroup += 2;
      if (self.groupGroupExecuteInput.checked == true) permissionsgroup += 1;

      if (self.otherGroupReadInput.checked == true) permissionsother += 4;
      if (self.otherGroupWriteInput.checked == true) permissionsother += 2;
      if (self.otherGroupExecuteInput.checked == true) permissionsother += 1;

      var permissions = permissionsuser.toString() + permissionsgroup.toString() + permissionsother.toString();

      self.disableEventhandler = true;
      self.enableFieldset('owner');
      self.enableFieldset('group');
      self.enableFieldset('other');
      self.setNumericInput(permissions);
      self.validate();
      self.disableEventhandler = false;
    }
  }, {
    key: 'updateCheckboxInputs',
    value: function updateCheckboxInputs() {
      var self = this;

      var permissions = self.numericInput.getModel().getText();
      if (permissions.length != 0 && permissions.length != 3) return self.validate();
      var rights = (0, _helperHelperJs.permissionsToRights)(permissions);

      self.disableEventhandler = true;
      self.setCheckboxInputs(rights);
      if (permissions[0] == 'x') {
        self.disableFieldset('owner');
      } else {
        self.enableFieldset('owner');
      };
      if (permissions[1] == 'x') {
        self.disableFieldset('group');
      } else {
        self.enableFieldset('group');
      };
      if (permissions[2] == 'x') {
        self.disableFieldset('other');
      } else {
        self.enableFieldset('other');
      };
      self.validate();
      self.disableEventhandler = false;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var self = this;

      var isvalid = true;
      var allowed = ['x', '0', '1', '2', '3', '4', '5', '6', '7'];
      var permissions = self.numericInput.getModel().getText();

      if (permissions.length != 3 || permissions == '000') isvalid = false;

      permissions.split('').forEach(function (value) {
        if (allowed.indexOf(value) == -1) {
          isvalid = false;
        }
      });

      if (isvalid) {
        self.saveButton.removeAttribute("disabled");
      } else {
        self.saveButton.setAttribute("disabled", true);
      }
    }
  }, {
    key: 'attach',
    value: function attach() {
      var self = this;

      if (!self.item) return;

      self.setCheckboxInputs(self.rights);
      self.setNumericInput((0, _helperHelperJs.rightsToPermissions)(self.rights));
      self.validate();

      this.panel = atom.workspace.addModalPanel({
        item: this
      });

      self.numericInput.focus();
      self.numericInput.getModel().scrollToCursorPosition();
    }
  }, {
    key: 'close',
    value: function close() {
      var destroyPanel = this.panel;
      this.panel = null;

      if (destroyPanel) {
        destroyPanel.destroy();
      }

      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.close();
    }
  }, {
    key: 'save',
    value: function save() {
      var self = this;

      var permissions = (0, _helperHelperJs.rightsToPermissions)((0, _helperHelperJs.permissionsToRights)(self.numericInput.getModel().getText()));

      this.trigger('change-permissions', {
        permissions: permissions,
        rights: (0, _helperHelperJs.permissionsToRights)(permissions)
      });
      self.close();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({
        'class': 'ftp-remote-edit permissions-view overlay from-top'
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
              outlet: 'elements'
            });
          });
        });
      });
    }
  }]);

  return PermissionsView;
})(_atomSpacePenViews.View);

exports['default'] = PermissionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9wZXJtaXNzaW9ucy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFd0Msc0JBQXNCOzs4QkFDTCx1QkFBdUI7O0FBSGhGLFdBQVcsQ0FBQzs7SUFLUyxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBeUJ4QixvQkFBQyxJQUFJLEVBQUU7QUFDZixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsVUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsSUFBSSxDQUFDLE1BQU0sR0FBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFFL0UsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUM5QixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7T0FDcEI7O0FBRUQsVUFBSSxJQUFJLEdBQUcsWUFBWSxJQUFJLEFBQUMsSUFBSSxDQUFDLE1BQU0sR0FBSSxNQUFNLEdBQUcsV0FBVyxDQUFBLEFBQUMsR0FBRyxpQkFBaUIsQ0FBQztBQUNyRixVQUFJLElBQUksOENBQThDLElBQUksQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFJLE1BQU0sR0FBRyxXQUFXLENBQUEsQUFBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMs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QUFJLENBQUM7O0FBRWxCLFVBQUksV0FBVyxHQUFHLHlDQUFvQix5Q0FBb0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5HLFVBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7QUFDakMsbUJBQVcsRUFBRSxXQUFXO0FBQ3hCLGNBQU0sRUFBRSx5Q0FBb0IsV0FBVyxDQUFDO09BQ3pDLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7V0E1akJhLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDZCxpQkFBTyxtREFBbUQ7T0FDM0QsRUFBRSxZQUFNO0FBQ1AsY0FBSyxHQUFHLENBQUM7QUFDUCxtQkFBTyxRQUFRO1NBQ2hCLEVBQUUsWUFBTTtBQUNQLGdCQUFLLEdBQUcsQ0FBQztBQUNQLHFCQUFPLGFBQWE7V0FDckIsRUFBRSxZQUFNO0FBQ1Asa0JBQUssS0FBSyxDQUFDO0FBQ1QsdUJBQU8sTUFBTTtBQUNiLG9CQUFNLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQztBQUNILGtCQUFLLEdBQUcsQ0FBQztBQUNQLHVCQUFPLGdCQUFnQjtBQUN2QixvQkFBTSxFQUFFLFVBQVU7YUFDbkIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQXZCa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL3ZpZXdzL3Blcm1pc3Npb25zLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgJCwgVmlldywgVGV4dEVkaXRvclZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgeyByaWdodHNUb1Blcm1pc3Npb25zLCBwZXJtaXNzaW9uc1RvUmlnaHRzIH0gZnJvbSAnLi8uLi9oZWxwZXIvaGVscGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVybWlzc2lvbnNWaWV3IGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHtcbiAgICAgIGNsYXNzOiAnZnRwLXJlbW90ZS1lZGl0IHBlcm1pc3Npb25zLXZpZXcgb3ZlcmxheSBmcm9tLXRvcCcsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ3BhbmVscycsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3BhbmVscy1pdGVtJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoe1xuICAgICAgICAgICAgY2xhc3M6ICdpY29uJyxcbiAgICAgICAgICAgIG91dGxldDogJ2luZm8nLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICAgIGNsYXNzOiAncGFuZWxzLWNvbnRlbnQnLFxuICAgICAgICAgICAgb3V0bGV0OiAnZWxlbWVudHMnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpdGVtKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcblxuICAgIHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlciA9IGZhbHNlO1xuICAgIHNlbGYuaXRlbSA9IGl0ZW07XG4gICAgc2VsZi5yaWdodHMgPSAoaXRlbS5yaWdodHMpID8gaXRlbS5yaWdodHMgOiB7IHVzZXI6ICcnLCBncm91cDogJycsIG90aGVyOiAnJyB9O1xuXG4gICAgaWYgKHNlbGYuaXRlbS5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBzZWxmLmlzRmlsZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmlzRmlsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgbGV0IGh0bWwgPSAnPHA+Q2hhbmdlICcgKyAoKHNlbGYuaXNGaWxlKSA/ICdmaWxlJyA6ICdkaXJlY3RvcnknKSArICcgYXR0cmlidXRlczwvcD4nO1xuICAgIGh0bWwgKz0gJzxwPlBsZWFzZSBzZWxlY3QgdGhlIG5ldyBhdHRyaWJ1dGVzIGZvciB0aGUgJyArICgoc2VsZi5pc0ZpbGUpID8gJ2ZpbGUnIDogJ2RpcmVjdG9yeScpICsgJyBcIicgKyBzZWxmLml0ZW0ubmFtZSArICdcIi48L3A+JztcbiAgICBzZWxmLmluZm8uaHRtbChodG1sKTtcblxuICAgIHNlbGYuc2F2ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHNlbGYuc2F2ZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdTYXZlJztcbiAgICBzZWxmLnNhdmVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG5cbiAgICBzZWxmLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgc2VsZi5jbG9zZUJ1dHRvbi50ZXh0Q29udGVudCA9ICdDYW5jZWwnO1xuICAgIHNlbGYuY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgc2VsZi5jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwdWxsLXJpZ2h0Jyk7XG5cbiAgICBzZWxmLmVsZW1lbnRzLmFwcGVuZChzZWxmLmNyZWF0ZVBhbmVsQ29udGVudCgpKTtcblxuICAgIHNlbGYuZWxlbWVudHMuYXBwZW5kKHNlbGYuc2F2ZUJ1dHRvbik7XG4gICAgc2VsZi5lbGVtZW50cy5hcHBlbmQoc2VsZi5jbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLmNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBzZWxmLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuc2F2ZSgpO1xuICAgIH0pO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICAvLyBzZWxmLnNhdmUoKTtcbiAgICAgIH0sXG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB7XG4gICAgICAgIHNlbGYuY2FuY2VsKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlUGFuZWxDb250ZW50KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZi5jcmVhdGVPd25lckZpZWxkc2V0KCkpO1xuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZi5jcmVhdGVHcm91cEZpZWxkc2V0KCkpO1xuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc2VsZi5jcmVhdGVPdGhlckZpZWxkc2V0KCkpO1xuXG4gICAgbGV0IG51bWVyaWNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG51bWVyaWNHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJyk7XG4gICAgbnVtZXJpY0dyb3VwLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyMHB4JztcblxuICAgIGxldCBudW1lcmljR3JvdXBDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG51bWVyaWNHcm91cENvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgbnVtZXJpY0dyb3VwLmFwcGVuZENoaWxkKG51bWVyaWNHcm91cENvbnRyb2xzKTtcblxuICAgIGxldCBudW1lcmljTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIG51bWVyaWNMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IG51bWVyaWNMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbnVtZXJpY0xhYmVsVGl0bGUudGV4dENvbnRlbnQgPSBgTnVtZXJpYyB2YWx1ZWA7XG4gICAgbnVtZXJpY0xhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIG51bWVyaWNMYWJlbC5hcHBlbmRDaGlsZChudW1lcmljTGFiZWxUaXRsZSk7XG4gICAgbnVtZXJpY0dyb3VwLmFwcGVuZENoaWxkKG51bWVyaWNMYWJlbCk7XG5cbiAgICBzZWxmLm51bWVyaWNJbnB1dCA9IG5ldyBUZXh0RWRpdG9yVmlldyh7IG1pbmk6IHRydWUgfSlcbiAgICBudW1lcmljR3JvdXAuYXBwZW5kQ2hpbGQoc2VsZi5udW1lcmljSW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgaW5mb0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGluZm9MYWJlbC50ZXh0Q29udGVudCA9ICdZb3UgY2FuIHVzZSBhbiB4IGF0IGFueSBwb3NpdGlvbiB0byBrZWVwIHRoZSBwZXJtaXNzaW9uIHRoZSBvcmlnaW5hbCAnICsgKChzZWxmLmlzRmlsZSkgPyAnZmlsZScgOiAnZGlyZWN0b3J5JykgKyAnIGhhdmUuJztcbiAgICBudW1lcmljR3JvdXAuYXBwZW5kQ2hpbGQoaW5mb0xhYmVsKTtcblxuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQobnVtZXJpY0dyb3VwKTtcblxuICAgIC8vIEV2ZW50c1xuICAgIHNlbGYubnVtZXJpY0lucHV0LmdldE1vZGVsKCkuYnVmZmVyLm9uRGlkQ2hhbmdlKChvYmopID0+IHtcbiAgICAgIGxldCBhbGxvd2VkID0gWyd4JywgJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNyddO1xuXG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG5cbiAgICAgIGlmIChvYmoubmV3UmFuZ2UuZW5kLmNvbHVtbiA8IG9iai5vbGRSYW5nZS5lbmQuY29sdW1uKSB7XG4gICAgICAgIHNlbGYudXBkYXRlQ2hlY2tib3hJbnB1dHMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm5ld1JhbmdlLmVuZC5jb2x1bW4gPiAzKSB7XG4gICAgICAgIHNlbGYubnVtZXJpY0lucHV0LmdldE1vZGVsKCkuYnVmZmVyLnNldFRleHRJblJhbmdlKG9iai5uZXdSYW5nZSwgJycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9iai5jaGFuZ2VzLmZvckVhY2goKGNoYW5nZSkgPT4ge1xuICAgICAgICBjaGFuZ2UubmV3VGV4dC5zcGxpdCgnJykuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAoYWxsb3dlZC5pbmRleE9mKHZhbHVlKSA9PSAtMSkge1xuICAgICAgICAgICAgc2VsZi5udW1lcmljSW5wdXQuZ2V0TW9kZWwoKS5idWZmZXIuc2V0VGV4dEluUmFuZ2Uob2JqLm5ld1JhbmdlLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLnVwZGF0ZUNoZWNrYm94SW5wdXRzKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGNyZWF0ZU93bmVyRmllbGRzZXQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgb3duZXJHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG93bmVyR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIG93bmVyR3JvdXAuc3R5bGUubWFyZ2luQm90dG9tID0gJzIwcHgnO1xuXG4gICAgbGV0IG93bmVyR3JvdXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgb3duZXJHcm91cExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAtbGFiZWwnKTtcbiAgICBvd25lckdyb3VwTGFiZWwudGV4dENvbnRlbnQgPSAnT3duZXIgcGVybWlzc2lvbnMnO1xuICAgIG93bmVyR3JvdXAuYXBwZW5kQ2hpbGQob3duZXJHcm91cExhYmVsKTtcblxuICAgIGxldCBvd25lckdyb3VwQ29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG93bmVyR3JvdXBDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgb3duZXJHcm91cENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnb3duZXInKTtcbiAgICBvd25lckdyb3VwQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjaGVja2JveCcpO1xuICAgIG93bmVyR3JvdXAuYXBwZW5kQ2hpbGQob3duZXJHcm91cENvbnRyb2wpO1xuXG4gICAgbGV0IG93bmVyR3JvdXBSZWFkSW5wdXRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgb3duZXJHcm91cFJlYWRJbnB1dExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wnKTtcbiAgICBvd25lckdyb3VwQ29udHJvbC5hcHBlbmRDaGlsZChvd25lckdyb3VwUmVhZElucHV0TGFiZWwpO1xuXG4gICAgc2VsZi5vd25lckdyb3VwUmVhZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZWxmLm93bmVyR3JvdXBSZWFkSW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgc2VsZi5vd25lckdyb3VwUmVhZElucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLm93bmVyR3JvdXBSZWFkSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtY2hlY2tib3gnKTtcbiAgICBsZXQgb3duZXJHcm91cFJlYWRJbnB1dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3duZXJHcm91cFJlYWRJbnB1dFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXRpdGxlJylcbiAgICBvd25lckdyb3VwUmVhZElucHV0VGl0bGUudGV4dENvbnRlbnQgPSAnUmVhZCc7XG4gICAgb3duZXJHcm91cFJlYWRJbnB1dExhYmVsLmFwcGVuZENoaWxkKHNlbGYub3duZXJHcm91cFJlYWRJbnB1dCk7XG4gICAgb3duZXJHcm91cFJlYWRJbnB1dExhYmVsLmFwcGVuZENoaWxkKG93bmVyR3JvdXBSZWFkSW5wdXRUaXRsZSk7XG5cbiAgICBsZXQgb3duZXJHcm91cFdyaXRlSW5wdXRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgb3duZXJHcm91cFdyaXRlSW5wdXRMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sJyk7XG4gICAgb3duZXJHcm91cENvbnRyb2wuYXBwZW5kQ2hpbGQob3duZXJHcm91cFdyaXRlSW5wdXRMYWJlbCk7XG5cbiAgICBzZWxmLm93bmVyR3JvdXBXcml0ZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZWxmLm93bmVyR3JvdXBXcml0ZUlucHV0LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHNlbGYub3duZXJHcm91cFdyaXRlSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuICAgIHNlbGYub3duZXJHcm91cFdyaXRlSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtY2hlY2tib3gnKTtcbiAgICBsZXQgb3duZXJHcm91cFdyaXRlSW5wdXRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG93bmVyR3JvdXBXcml0ZUlucHV0VGl0bGUuY2xhc3NMaXN0LmFkZCgnaW5wdXQtdGl0bGUnKVxuICAgIG93bmVyR3JvdXBXcml0ZUlucHV0VGl0bGUudGV4dENvbnRlbnQgPSAnV3JpdGUnO1xuICAgIG93bmVyR3JvdXBXcml0ZUlucHV0TGFiZWwuYXBwZW5kQ2hpbGQoc2VsZi5vd25lckdyb3VwV3JpdGVJbnB1dCk7XG4gICAgb3duZXJHcm91cFdyaXRlSW5wdXRMYWJlbC5hcHBlbmRDaGlsZChvd25lckdyb3VwV3JpdGVJbnB1dFRpdGxlKTtcblxuICAgIGxldCBvd25lckdyb3VwRXhlY3V0ZUlucHV0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIG93bmVyR3JvdXBFeGVjdXRlSW5wdXRMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sJyk7XG4gICAgb3duZXJHcm91cENvbnRyb2wuYXBwZW5kQ2hpbGQob3duZXJHcm91cEV4ZWN1dGVJbnB1dExhYmVsKTtcblxuICAgIHNlbGYub3duZXJHcm91cEV4ZWN1dGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc2VsZi5vd25lckdyb3VwRXhlY3V0ZUlucHV0LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIHNlbGYub3duZXJHcm91cEV4ZWN1dGVJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5vd25lckdyb3VwRXhlY3V0ZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LWNoZWNrYm94Jyk7XG4gICAgbGV0IG93bmVyR3JvdXBFeGVjdXRlSW5wdXRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG93bmVyR3JvdXBFeGVjdXRlSW5wdXRUaXRsZS5jbGFzc0xpc3QuYWRkKCdpbnB1dC10aXRsZScpXG4gICAgb3duZXJHcm91cEV4ZWN1dGVJbnB1dFRpdGxlLnRleHRDb250ZW50ID0gJ0V4ZWN1dGUnO1xuICAgIG93bmVyR3JvdXBFeGVjdXRlSW5wdXRMYWJlbC5hcHBlbmRDaGlsZChzZWxmLm93bmVyR3JvdXBFeGVjdXRlSW5wdXQpO1xuICAgIG93bmVyR3JvdXBFeGVjdXRlSW5wdXRMYWJlbC5hcHBlbmRDaGlsZChvd25lckdyb3VwRXhlY3V0ZUlucHV0VGl0bGUpO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgc2VsZi5vd25lckdyb3VwUmVhZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikgcmV0dXJuO1xuICAgICAgc2VsZi51cGRhdGVOdW1lcmljSW5wdXQoKTtcbiAgICB9KTtcblxuICAgIHNlbGYub3duZXJHcm91cFdyaXRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG4gICAgICBzZWxmLnVwZGF0ZU51bWVyaWNJbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5vd25lckdyb3VwRXhlY3V0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKHNlbGYuZGlzYWJsZUV2ZW50aGFuZGxlcikgcmV0dXJuO1xuICAgICAgc2VsZi51cGRhdGVOdW1lcmljSW5wdXQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvd25lckdyb3VwO1xuICB9XG5cbiAgY3JlYXRlR3JvdXBGaWVsZHNldCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBncm91cEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXBHcm91cC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwJyk7XG4gICAgZ3JvdXBHcm91cC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMjBweCc7XG5cbiAgICBsZXQgZ3JvdXBHcm91cExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBncm91cEdyb3VwTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cC1sYWJlbCcpO1xuICAgIGdyb3VwR3JvdXBMYWJlbC50ZXh0Q29udGVudCA9ICdHcm91cCBwZXJtaXNzaW9ucyc7XG4gICAgZ3JvdXBHcm91cC5hcHBlbmRDaGlsZChncm91cEdyb3VwTGFiZWwpO1xuXG4gICAgbGV0IGdyb3VwR3JvdXBDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXBHcm91cENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBncm91cEdyb3VwQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdncm91cCcpO1xuICAgIGdyb3VwR3JvdXBDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NoZWNrYm94Jyk7XG4gICAgZ3JvdXBHcm91cC5hcHBlbmRDaGlsZChncm91cEdyb3VwQ29udHJvbCk7XG5cbiAgICBsZXQgZ3JvdXBHcm91cFJlYWRJbnB1dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBncm91cEdyb3VwUmVhZElucHV0TGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbCcpO1xuICAgIGdyb3VwR3JvdXBDb250cm9sLmFwcGVuZENoaWxkKGdyb3VwR3JvdXBSZWFkSW5wdXRMYWJlbCk7XG5cbiAgICBzZWxmLmdyb3VwR3JvdXBSZWFkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNlbGYuZ3JvdXBHcm91cFJlYWRJbnB1dC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBzZWxmLmdyb3VwR3JvdXBSZWFkSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuICAgIHNlbGYuZ3JvdXBHcm91cFJlYWRJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1jaGVja2JveCcpO1xuICAgIGxldCBncm91cEdyb3VwUmVhZElucHV0VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncm91cEdyb3VwUmVhZElucHV0VGl0bGUuY2xhc3NMaXN0LmFkZCgnaW5wdXQtdGl0bGUnKVxuICAgIGdyb3VwR3JvdXBSZWFkSW5wdXRUaXRsZS50ZXh0Q29udGVudCA9ICdSZWFkJztcbiAgICBncm91cEdyb3VwUmVhZElucHV0TGFiZWwuYXBwZW5kQ2hpbGQoc2VsZi5ncm91cEdyb3VwUmVhZElucHV0KTtcbiAgICBncm91cEdyb3VwUmVhZElucHV0TGFiZWwuYXBwZW5kQ2hpbGQoZ3JvdXBHcm91cFJlYWRJbnB1dFRpdGxlKTtcblxuICAgIGxldCBncm91cEdyb3VwV3JpdGVJbnB1dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBncm91cEdyb3VwV3JpdGVJbnB1dExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wnKTtcbiAgICBncm91cEdyb3VwQ29udHJvbC5hcHBlbmRDaGlsZChncm91cEdyb3VwV3JpdGVJbnB1dExhYmVsKTtcblxuICAgIHNlbGYuZ3JvdXBHcm91cFdyaXRlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNlbGYuZ3JvdXBHcm91cFdyaXRlSW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgc2VsZi5ncm91cEdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5ncm91cEdyb3VwV3JpdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1jaGVja2JveCcpO1xuICAgIGxldCBncm91cEdyb3VwV3JpdGVJbnB1dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXBHcm91cFdyaXRlSW5wdXRUaXRsZS5jbGFzc0xpc3QuYWRkKCdpbnB1dC10aXRsZScpXG4gICAgZ3JvdXBHcm91cFdyaXRlSW5wdXRUaXRsZS50ZXh0Q29udGVudCA9ICdXcml0ZSc7XG4gICAgZ3JvdXBHcm91cFdyaXRlSW5wdXRMYWJlbC5hcHBlbmRDaGlsZChzZWxmLmdyb3VwR3JvdXBXcml0ZUlucHV0KTtcbiAgICBncm91cEdyb3VwV3JpdGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKGdyb3VwR3JvdXBXcml0ZUlucHV0VGl0bGUpO1xuXG4gICAgbGV0IGdyb3VwR3JvdXBFeGVjdXRlSW5wdXRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wnKTtcbiAgICBncm91cEdyb3VwQ29udHJvbC5hcHBlbmRDaGlsZChncm91cEdyb3VwRXhlY3V0ZUlucHV0TGFiZWwpO1xuXG4gICAgc2VsZi5ncm91cEdyb3VwRXhlY3V0ZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZWxmLmdyb3VwR3JvdXBFeGVjdXRlSW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgc2VsZi5ncm91cEdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLmdyb3VwR3JvdXBFeGVjdXRlSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtY2hlY2tib3gnKTtcbiAgICBsZXQgZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXRpdGxlJylcbiAgICBncm91cEdyb3VwRXhlY3V0ZUlucHV0VGl0bGUudGV4dENvbnRlbnQgPSAnRXhlY3V0ZSc7XG4gICAgZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKHNlbGYuZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dCk7XG4gICAgZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKGdyb3VwR3JvdXBFeGVjdXRlSW5wdXRUaXRsZSk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLmdyb3VwR3JvdXBSZWFkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG4gICAgICBzZWxmLnVwZGF0ZU51bWVyaWNJbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5ncm91cEdyb3VwV3JpdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHJldHVybjtcbiAgICAgIHNlbGYudXBkYXRlTnVtZXJpY0lucHV0KCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmdyb3VwR3JvdXBFeGVjdXRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG4gICAgICBzZWxmLnVwZGF0ZU51bWVyaWNJbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyb3VwR3JvdXA7XG4gIH1cblxuICBjcmVhdGVPdGhlckZpZWxkc2V0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IG90aGVyR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdGhlckdyb3VwLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wtZ3JvdXAnKTtcbiAgICBvdGhlckdyb3VwLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyMHB4JztcblxuICAgIGxldCBvdGhlckdyb3VwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIG90aGVyR3JvdXBMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWdyb3VwLWxhYmVsJyk7XG4gICAgb3RoZXJHcm91cExhYmVsLnRleHRDb250ZW50ID0gJ1B1YmxpYyBwZXJtaXNzaW9ucyc7XG4gICAgb3RoZXJHcm91cC5hcHBlbmRDaGlsZChvdGhlckdyb3VwTGFiZWwpO1xuXG4gICAgbGV0IG90aGVyR3JvdXBDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3RoZXJHcm91cENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnY29udHJvbHMnKTtcbiAgICBvdGhlckdyb3VwQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdvdGhlcicpO1xuICAgIG90aGVyR3JvdXBDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NoZWNrYm94Jyk7XG4gICAgb3RoZXJHcm91cC5hcHBlbmRDaGlsZChvdGhlckdyb3VwQ29udHJvbCk7XG5cbiAgICBsZXQgb3RoZXJHcm91cFJlYWRJbnB1dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBvdGhlckdyb3VwUmVhZElucHV0TGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbCcpO1xuICAgIG90aGVyR3JvdXBDb250cm9sLmFwcGVuZENoaWxkKG90aGVyR3JvdXBSZWFkSW5wdXRMYWJlbCk7XG5cbiAgICBzZWxmLm90aGVyR3JvdXBSZWFkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNlbGYub3RoZXJHcm91cFJlYWRJbnB1dC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBzZWxmLm90aGVyR3JvdXBSZWFkSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuICAgIHNlbGYub3RoZXJHcm91cFJlYWRJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1jaGVja2JveCcpO1xuICAgIGxldCBvdGhlckdyb3VwUmVhZElucHV0VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdGhlckdyb3VwUmVhZElucHV0VGl0bGUuY2xhc3NMaXN0LmFkZCgnaW5wdXQtdGl0bGUnKVxuICAgIG90aGVyR3JvdXBSZWFkSW5wdXRUaXRsZS50ZXh0Q29udGVudCA9ICdSZWFkJztcbiAgICBvdGhlckdyb3VwUmVhZElucHV0TGFiZWwuYXBwZW5kQ2hpbGQoc2VsZi5vdGhlckdyb3VwUmVhZElucHV0KTtcbiAgICBvdGhlckdyb3VwUmVhZElucHV0TGFiZWwuYXBwZW5kQ2hpbGQob3RoZXJHcm91cFJlYWRJbnB1dFRpdGxlKTtcblxuICAgIGxldCBvdGhlckdyb3VwV3JpdGVJbnB1dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBvdGhlckdyb3VwV3JpdGVJbnB1dExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wnKTtcbiAgICBvdGhlckdyb3VwQ29udHJvbC5hcHBlbmRDaGlsZChvdGhlckdyb3VwV3JpdGVJbnB1dExhYmVsKTtcblxuICAgIHNlbGYub3RoZXJHcm91cFdyaXRlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHNlbGYub3RoZXJHcm91cFdyaXRlSW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgc2VsZi5vdGhlckdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5vdGhlckdyb3VwV3JpdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1jaGVja2JveCcpO1xuICAgIGxldCBvdGhlckdyb3VwV3JpdGVJbnB1dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3RoZXJHcm91cFdyaXRlSW5wdXRUaXRsZS5jbGFzc0xpc3QuYWRkKCdpbnB1dC10aXRsZScpXG4gICAgb3RoZXJHcm91cFdyaXRlSW5wdXRUaXRsZS50ZXh0Q29udGVudCA9ICdXcml0ZSc7XG4gICAgb3RoZXJHcm91cFdyaXRlSW5wdXRMYWJlbC5hcHBlbmRDaGlsZChzZWxmLm90aGVyR3JvdXBXcml0ZUlucHV0KTtcbiAgICBvdGhlckdyb3VwV3JpdGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKG90aGVyR3JvdXBXcml0ZUlucHV0VGl0bGUpO1xuXG4gICAgbGV0IG90aGVyR3JvdXBFeGVjdXRlSW5wdXRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgb3RoZXJHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2wnKTtcbiAgICBvdGhlckdyb3VwQ29udHJvbC5hcHBlbmRDaGlsZChvdGhlckdyb3VwRXhlY3V0ZUlucHV0TGFiZWwpO1xuXG4gICAgc2VsZi5vdGhlckdyb3VwRXhlY3V0ZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgc2VsZi5vdGhlckdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtY2hlY2tib3gnKTtcbiAgICBsZXQgb3RoZXJHcm91cEV4ZWN1dGVJbnB1dFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3RoZXJHcm91cEV4ZWN1dGVJbnB1dFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXRpdGxlJylcbiAgICBvdGhlckdyb3VwRXhlY3V0ZUlucHV0VGl0bGUudGV4dENvbnRlbnQgPSAnRXhlY3V0ZSc7XG4gICAgb3RoZXJHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKHNlbGYub3RoZXJHcm91cEV4ZWN1dGVJbnB1dCk7XG4gICAgb3RoZXJHcm91cEV4ZWN1dGVJbnB1dExhYmVsLmFwcGVuZENoaWxkKG90aGVyR3JvdXBFeGVjdXRlSW5wdXRUaXRsZSk7XG5cbiAgICAvLyBFdmVudHNcbiAgICBzZWxmLm90aGVyR3JvdXBSZWFkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG4gICAgICBzZWxmLnVwZGF0ZU51bWVyaWNJbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5vdGhlckdyb3VwV3JpdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIpIHJldHVybjtcbiAgICAgIHNlbGYudXBkYXRlTnVtZXJpY0lucHV0KCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyKSByZXR1cm47XG4gICAgICBzZWxmLnVwZGF0ZU51bWVyaWNJbnB1dCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG90aGVyR3JvdXA7XG4gIH1cblxuICBlbmFibGVGaWVsZHNldChncm91cCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGdyb3VwID09ICdvd25lcicpIHtcbiAgICAgIHNlbGYub3duZXJHcm91cFJlYWRJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNlbGYub3duZXJHcm91cFdyaXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICBzZWxmLm93bmVyR3JvdXBFeGVjdXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuXG4gICAgaWYgKGdyb3VwID09ICdncm91cCcpIHtcbiAgICAgIHNlbGYuZ3JvdXBHcm91cFJlYWRJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNlbGYuZ3JvdXBHcm91cFdyaXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICBzZWxmLmdyb3VwR3JvdXBFeGVjdXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuXG4gICAgaWYgKGdyb3VwID09ICdvdGhlcicpIHtcbiAgICAgIHNlbGYub3RoZXJHcm91cFJlYWRJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNlbGYub3RoZXJHcm91cFdyaXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuICB9XG5cbiAgZGlzYWJsZUZpZWxkc2V0KGdyb3VwKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoZ3JvdXAgPT0gJ293bmVyJykge1xuICAgICAgc2VsZi5vd25lckdyb3VwUmVhZElucHV0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgc2VsZi5vd25lckdyb3VwV3JpdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgIHNlbGYub3duZXJHcm91cEV4ZWN1dGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoZ3JvdXAgPT0gJ2dyb3VwJykge1xuICAgICAgc2VsZi5ncm91cEdyb3VwUmVhZElucHV0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgc2VsZi5ncm91cEdyb3VwV3JpdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgIHNlbGYuZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoZ3JvdXAgPT0gJ290aGVyJykge1xuICAgICAgc2VsZi5vdGhlckdyb3VwUmVhZElucHV0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgc2VsZi5vdGhlckdyb3VwV3JpdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgIHNlbGYub3RoZXJHcm91cEV4ZWN1dGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBzZXRDaGVja2JveElucHV0cyhyaWdodHMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCB1c2VyID0gcmlnaHRzLnVzZXIuc3BsaXQoJycpO1xuICAgIGxldCBncm91cCA9IHJpZ2h0cy5ncm91cC5zcGxpdCgnJyk7XG4gICAgbGV0IG90aGVyID0gcmlnaHRzLm90aGVyLnNwbGl0KCcnKTtcblxuICAgIHNlbGYub3duZXJHcm91cFJlYWRJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5vd25lckdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5vd25lckdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLmdyb3VwR3JvdXBSZWFkSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuICAgIHNlbGYuZ3JvdXBHcm91cFdyaXRlSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuICAgIHNlbGYuZ3JvdXBHcm91cEV4ZWN1dGVJbnB1dC5jaGVja2VkID0gZmFsc2U7XG4gICAgc2VsZi5vdGhlckdyb3VwUmVhZElucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLm90aGVyR3JvdXBXcml0ZUlucHV0LmNoZWNrZWQgPSBmYWxzZTtcbiAgICBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQuY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgdXNlci5mb3JFYWNoKChyaWdodCkgPT4ge1xuICAgICAgaWYgKHJpZ2h0ID09ICdyJykgc2VsZi5vd25lckdyb3VwUmVhZElucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgaWYgKHJpZ2h0ID09ICd3Jykgc2VsZi5vd25lckdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGlmIChyaWdodCA9PSAneCcpIHNlbGYub3duZXJHcm91cEV4ZWN1dGVJbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGdyb3VwLmZvckVhY2goKHJpZ2h0KSA9PiB7XG4gICAgICBpZiAocmlnaHQgPT0gJ3InKSBzZWxmLmdyb3VwR3JvdXBSZWFkSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICBpZiAocmlnaHQgPT0gJ3cnKSBzZWxmLmdyb3VwR3JvdXBXcml0ZUlucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgaWYgKHJpZ2h0ID09ICd4Jykgc2VsZi5ncm91cEdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgb3RoZXIuZm9yRWFjaCgocmlnaHQpID0+IHtcbiAgICAgIGlmIChyaWdodCA9PSAncicpIHNlbGYub3RoZXJHcm91cFJlYWRJbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGlmIChyaWdodCA9PSAndycpIHNlbGYub3RoZXJHcm91cFdyaXRlSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICBpZiAocmlnaHQgPT0gJ3gnKSBzZWxmLm90aGVyR3JvdXBFeGVjdXRlSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBzZXROdW1lcmljSW5wdXQocGVybWlzc2lvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYubnVtZXJpY0lucHV0LmdldE1vZGVsKCkuc2V0VGV4dChwZXJtaXNzaW9ucyk7XG4gIH1cblxuICB1cGRhdGVOdW1lcmljSW5wdXQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgcGVybWlzc2lvbnN1c2VyID0gMDtcbiAgICBsZXQgcGVybWlzc2lvbnNncm91cCA9IDA7XG4gICAgbGV0IHBlcm1pc3Npb25zb3RoZXIgPSAwO1xuXG4gICAgaWYgKHNlbGYub3duZXJHcm91cFJlYWRJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zdXNlciArPSA0O1xuICAgIGlmIChzZWxmLm93bmVyR3JvdXBXcml0ZUlucHV0LmNoZWNrZWQgPT0gdHJ1ZSkgcGVybWlzc2lvbnN1c2VyICs9IDI7XG4gICAgaWYgKHNlbGYub3duZXJHcm91cEV4ZWN1dGVJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zdXNlciArPSAxO1xuXG4gICAgaWYgKHNlbGYuZ3JvdXBHcm91cFJlYWRJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zZ3JvdXAgKz0gNDtcbiAgICBpZiAoc2VsZi5ncm91cEdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zZ3JvdXAgKz0gMjtcbiAgICBpZiAoc2VsZi5ncm91cEdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPT0gdHJ1ZSkgcGVybWlzc2lvbnNncm91cCArPSAxO1xuXG4gICAgaWYgKHNlbGYub3RoZXJHcm91cFJlYWRJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zb3RoZXIgKz0gNDtcbiAgICBpZiAoc2VsZi5vdGhlckdyb3VwV3JpdGVJbnB1dC5jaGVja2VkID09IHRydWUpIHBlcm1pc3Npb25zb3RoZXIgKz0gMjtcbiAgICBpZiAoc2VsZi5vdGhlckdyb3VwRXhlY3V0ZUlucHV0LmNoZWNrZWQgPT0gdHJ1ZSkgcGVybWlzc2lvbnNvdGhlciArPSAxO1xuXG4gICAgbGV0IHBlcm1pc3Npb25zID0gcGVybWlzc2lvbnN1c2VyLnRvU3RyaW5nKCkgKyBwZXJtaXNzaW9uc2dyb3VwLnRvU3RyaW5nKCkgKyBwZXJtaXNzaW9uc290aGVyLnRvU3RyaW5nKCk7XG5cbiAgICBzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIgPSB0cnVlO1xuICAgIHNlbGYuZW5hYmxlRmllbGRzZXQoJ293bmVyJyk7XG4gICAgc2VsZi5lbmFibGVGaWVsZHNldCgnZ3JvdXAnKTtcbiAgICBzZWxmLmVuYWJsZUZpZWxkc2V0KCdvdGhlcicpO1xuICAgIHNlbGYuc2V0TnVtZXJpY0lucHV0KHBlcm1pc3Npb25zKTtcbiAgICBzZWxmLnZhbGlkYXRlKCk7XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVDaGVja2JveElucHV0cygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwZXJtaXNzaW9ucyA9IHNlbGYubnVtZXJpY0lucHV0LmdldE1vZGVsKCkuZ2V0VGV4dCgpO1xuICAgIGlmIChwZXJtaXNzaW9ucy5sZW5ndGggIT0gMCAmJiBwZXJtaXNzaW9ucy5sZW5ndGggIT0gMykgcmV0dXJuIHNlbGYudmFsaWRhdGUoKTtcbiAgICBsZXQgcmlnaHRzID0gcGVybWlzc2lvbnNUb1JpZ2h0cyhwZXJtaXNzaW9ucyk7XG5cbiAgICBzZWxmLmRpc2FibGVFdmVudGhhbmRsZXIgPSB0cnVlO1xuICAgIHNlbGYuc2V0Q2hlY2tib3hJbnB1dHMocmlnaHRzKTtcbiAgICBpZiAocGVybWlzc2lvbnNbMF0gPT0gJ3gnKSB7IHNlbGYuZGlzYWJsZUZpZWxkc2V0KCdvd25lcicpOyB9IGVsc2UgeyBzZWxmLmVuYWJsZUZpZWxkc2V0KCdvd25lcicpOyB9O1xuICAgIGlmIChwZXJtaXNzaW9uc1sxXSA9PSAneCcpIHsgc2VsZi5kaXNhYmxlRmllbGRzZXQoJ2dyb3VwJyk7IH0gZWxzZSB7IHNlbGYuZW5hYmxlRmllbGRzZXQoJ2dyb3VwJyk7IH07XG4gICAgaWYgKHBlcm1pc3Npb25zWzJdID09ICd4JykgeyBzZWxmLmRpc2FibGVGaWVsZHNldCgnb3RoZXInKTsgfSBlbHNlIHsgc2VsZi5lbmFibGVGaWVsZHNldCgnb3RoZXInKTsgfTtcbiAgICBzZWxmLnZhbGlkYXRlKCk7XG4gICAgc2VsZi5kaXNhYmxlRXZlbnRoYW5kbGVyID0gZmFsc2U7XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBpc3ZhbGlkID0gdHJ1ZTtcbiAgICBsZXQgYWxsb3dlZCA9IFsneCcsICcwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnXTtcbiAgICBsZXQgcGVybWlzc2lvbnMgPSBzZWxmLm51bWVyaWNJbnB1dC5nZXRNb2RlbCgpLmdldFRleHQoKTtcblxuICAgIGlmIChwZXJtaXNzaW9ucy5sZW5ndGggIT0gMyB8fCBwZXJtaXNzaW9ucyA9PSAnMDAwJykgaXN2YWxpZCA9IGZhbHNlO1xuXG4gICAgcGVybWlzc2lvbnMuc3BsaXQoJycpLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoYWxsb3dlZC5pbmRleE9mKHZhbHVlKSA9PSAtMSkge1xuICAgICAgICBpc3ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaXN2YWxpZCkge1xuICAgICAgc2VsZi5zYXZlQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLml0ZW0pIHJldHVybjtcblxuICAgIHNlbGYuc2V0Q2hlY2tib3hJbnB1dHMoc2VsZi5yaWdodHMpO1xuICAgIHNlbGYuc2V0TnVtZXJpY0lucHV0KHJpZ2h0c1RvUGVybWlzc2lvbnMoc2VsZi5yaWdodHMpKTtcbiAgICBzZWxmLnZhbGlkYXRlKCk7XG5cbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICBpdGVtOiB0aGlzXG4gICAgfSk7XG5cbiAgICBzZWxmLm51bWVyaWNJbnB1dC5mb2N1cygpO1xuICAgIHNlbGYubnVtZXJpY0lucHV0LmdldE1vZGVsKCkuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgY29uc3QgZGVzdHJveVBhbmVsID0gdGhpcy5wYW5lbDtcbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcblxuICAgIGlmIChkZXN0cm95UGFuZWwpIHtcbiAgICAgIGRlc3Ryb3lQYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBwZXJtaXNzaW9ucyA9IHJpZ2h0c1RvUGVybWlzc2lvbnMocGVybWlzc2lvbnNUb1JpZ2h0cyhzZWxmLm51bWVyaWNJbnB1dC5nZXRNb2RlbCgpLmdldFRleHQoKSkpO1xuXG4gICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UtcGVybWlzc2lvbnMnLCB7XG4gICAgICBwZXJtaXNzaW9uczogcGVybWlzc2lvbnMsXG4gICAgICByaWdodHM6IHBlcm1pc3Npb25zVG9SaWdodHMocGVybWlzc2lvbnMpXG4gICAgfSk7XG4gICAgc2VsZi5jbG9zZSgpO1xuICB9XG59XG4iXX0=