Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSpacePenViews = require('atom-space-pen-views');

var _atom = require('atom');

var _helperSecureJs = require('../helper/secure.js');

'use babel';

var atom = global.atom;

var ChangePassDialog = (function (_View) {
  _inherits(ChangePassDialog, _View);

  _createClass(ChangePassDialog, null, [{
    key: 'content',
    value: function content(opts) {
      var _this = this;

      var options = opts || {};
      return this.div({
        'class': 'tree-view-dialog overlay from-top'
      }, function () {
        _this.div({
          'class': 'panels'
        }, function () {
          _this.div({
            'class': 'panels-item'
          }, function () {
            _this.label({
              'class': 'icon',
              outlet: 'text'
            });
            _this.div({
              'class': 'error-message',
              style: 'margin-bottom: 15px; color: #ff0000;',
              outlet: 'error'
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

  function ChangePassDialog(opts) {
    _classCallCheck(this, ChangePassDialog);

    var options = opts || {};
    _get(Object.getPrototypeOf(ChangePassDialog.prototype), 'constructor', this).call(this, options);
    var self = this;

    self.mode = options.mode || 'change';
    self.title = options.title || 'Ftp-Remote-Edit';
    self.prompt = options.prompt || 'To change your password, you need to enter the old one and confirm the new one by entering it 2 times.';
    self.iconClass = options.iconClass || '';

    if (self.iconClass) {
      self.text.addClass(this.iconClass);
    }

    var html = '<p>' + self.title + '</p>';
    html += '<p>' + self.prompt + '</p>';
    self.text.html(html);

    var oldPwdLabel = document.createElement('label');
    oldPwdLabel.classList.add('control-label');
    var oldPwdLabelTitle = document.createElement('div');
    oldPwdLabelTitle.textContent = 'Old password:';
    oldPwdLabelTitle.classList.add('setting-title');
    oldPwdLabel.appendChild(oldPwdLabelTitle);
    self.oldPwdInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "Enter old password..." });

    var newPwdLabel = document.createElement('label');
    newPwdLabel.classList.add('control-label');
    var newPwdLabelTitle = document.createElement('div');
    newPwdLabelTitle.textContent = 'New password:';
    newPwdLabelTitle.classList.add('setting-title');
    newPwdLabel.appendChild(newPwdLabelTitle);
    self.newPwdInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "Enter new password..." });

    var confirmPwdLabel = document.createElement('label');
    confirmPwdLabel.classList.add('control-label');
    var confirmPwdLabelTitle = document.createElement('div');
    confirmPwdLabelTitle.textContent = 'Confirm password:';
    confirmPwdLabelTitle.classList.add('setting-title');
    confirmPwdLabel.appendChild(confirmPwdLabelTitle);
    self.confirmPwdInput = new _atomSpacePenViews.TextEditorView({ mini: true, placeholderText: "Enter new password..." });

    var oldPwdControl = document.createElement('div');
    oldPwdControl.classList.add('controls');
    oldPwdControl.classList.add('oldPwd');
    oldPwdControl.appendChild(oldPwdLabel);
    oldPwdControl.appendChild(self.oldPwdInput.element);

    var newPwdControl = document.createElement('div');
    newPwdControl.classList.add('controls');
    newPwdControl.classList.add('newPwd');
    newPwdControl.appendChild(newPwdLabel);
    newPwdControl.appendChild(self.newPwdInput.element);

    var confirmPwdControl = document.createElement('div');
    confirmPwdControl.classList.add('controls');
    confirmPwdControl.classList.add('confirmPwd');
    confirmPwdControl.appendChild(confirmPwdLabel);
    confirmPwdControl.appendChild(self.confirmPwdInput.element);

    var pwdGroup = document.createElement('div');
    pwdGroup.classList.add('control-group');
    if (self.mode == 'change') pwdGroup.appendChild(oldPwdControl);
    pwdGroup.appendChild(newPwdControl);
    pwdGroup.appendChild(confirmPwdControl);

    var groups = document.createElement('div');
    groups.classList.add('control-groups');
    groups.appendChild(pwdGroup);

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Apply';
    saveButton.classList.add('btn');

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.classList.add('btn');
    closeButton.classList.add('pull-right');

    self.elements.append(groups);
    self.elements.append(saveButton);
    self.elements.append(closeButton);

    var oldPasswordModel = self.oldPwdInput.getModel();
    var newPasswordModel = self.newPwdInput.getModel();
    var confirmPasswordModel = self.confirmPwdInput.getModel();

    var changing = false;
    oldPasswordModel.clearTextPassword = new _atom.TextBuffer('');
    oldPasswordModel.buffer.onDidChange(function (obj) {
      if (!changing) {
        changing = true;
        oldPasswordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
        oldPasswordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));
        changing = false;
      }
    });

    newPasswordModel.clearTextPassword = new _atom.TextBuffer('');
    newPasswordModel.buffer.onDidChange(function (obj) {
      if (!changing) {
        changing = true;
        newPasswordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
        newPasswordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));
        changing = false;
      }
    });

    confirmPasswordModel.clearTextPassword = new _atom.TextBuffer('');
    confirmPasswordModel.buffer.onDidChange(function (obj) {
      if (!changing) {
        changing = true;
        confirmPasswordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
        confirmPasswordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));
        changing = false;
      }
    });

    // Events
    closeButton.addEventListener('click', function (event) {
      self.close();
    });

    saveButton.addEventListener('click', function (event) {
      self.save();
    });

    atom.commands.add(this.element, {
      'core:confirm': function coreConfirm() {
        self.save();
      },
      'core:cancel': function coreCancel() {
        self.cancel();
      }
    });
  }

  _createClass(ChangePassDialog, [{
    key: 'attach',
    value: function attach() {
      var self = this;

      self.panel = atom.workspace.addModalPanel({
        item: this.element
      });

      if (self.mode == 'change') {
        self.oldPwdInput.focus();
        self.oldPwdInput.getModel().scrollToCursorPosition();
      } else {
        self.newPwdInput.focus();
        self.newPwdInput.getModel().scrollToCursorPosition();
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var self = this;

      var oldPassword = self.oldPwdInput.getModel().clearTextPassword.getText();
      var newPassword = self.newPwdInput.getModel().clearTextPassword.getText();
      var confirmPassword = self.confirmPwdInput.getModel().clearTextPassword.getText();

      if (!(0, _helperSecureJs.checkPassword)(oldPassword)) {
        return self.showError('Old password do not match.');
      }
      if (newPassword == '') {
        return self.showError('New password can not be empty.');
      }
      if (newPassword != confirmPassword) {
        return self.showError('New passwords do not match.');
      }

      var passwords = {
        'oldPassword': oldPassword,
        'newPassword': newPassword
      };

      this.trigger('dialog-done', [passwords]);
      self.close();
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
    key: 'showError',
    value: function showError(message) {
      this.error.text(message);
      if (message) {
        this.flashError();
      }
    }
  }]);

  return ChangePassDialog;
})(_atomSpacePenViews.View);

exports['default'] = ChangePassDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2NoYW5nZS1wYXNzLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztpQ0FDaUIsc0JBQXNCOztvQkFDbkMsTUFBTTs7OEJBQ0gscUJBQXFCOztBQUxuRCxXQUFXLENBQUM7O0FBT1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFFSixnQkFBZ0I7WUFBaEIsZ0JBQWdCOztlQUFoQixnQkFBZ0I7O1dBRXJCLGlCQUFDLElBQUksRUFBRTs7O0FBQ25CLFVBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDM0IsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2QsaUJBQU8sbUNBQW1DO09BQzNDLEVBQUUsWUFBTTtBQUNQLGNBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sUUFBUTtTQUNoQixFQUFFLFlBQU07QUFDUCxnQkFBSyxHQUFHLENBQUM7QUFDUCxxQkFBTyxhQUFhO1dBQ3JCLEVBQUUsWUFBTTtBQUNQLGtCQUFLLEtBQUssQ0FBQztBQUNULHVCQUFPLE1BQU07QUFDYixvQkFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7QUFDSCxrQkFBSyxHQUFHLENBQUM7QUFDUCx1QkFBTyxlQUFlO0FBQ3RCLG1CQUFLLEVBQUUsc0NBQXNDO0FBQzdDLG9CQUFNLEVBQUUsT0FBTzthQUNoQixDQUFDLENBQUM7QUFDSCxrQkFBSyxHQUFHLENBQUM7QUFDUCx1QkFBTyxnQkFBZ0I7QUFDdkIsb0JBQU0sRUFBRSxVQUFVO2FBQ25CLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7QUFFVSxXQS9CUSxnQkFBZ0IsQ0ErQnZCLElBQUksRUFBRTswQkEvQkMsZ0JBQWdCOztBQWdDakMsUUFBTSxP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Q2QscUJBQWEsRUFBRSxXQUFXO0FBQzFCLHFCQUFhLEVBQUUsV0FBVztPQUMzQixDQUFBOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUN6QyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRUksaUJBQUc7QUFDTixVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksWUFBWSxFQUFFO0FBQ2hCLG9CQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDeEI7O0FBRUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ25CO0tBQ0Y7OztTQXJPa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvZGlhbG9ncy9jaGFuZ2UtcGFzcy1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyAkLCBWaWV3LCBUZXh0RWRpdG9yVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IFRleHRCdWZmZXIgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IGNoZWNrUGFzc3dvcmQgfSBmcm9tICcuLi9oZWxwZXIvc2VjdXJlLmpzJztcblxuY29uc3QgYXRvbSA9IGdsb2JhbC5hdG9tO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFuZ2VQYXNzRGlhbG9nIGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQob3B0cykge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBvcHRzIHx8IHt9O1xuICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICBjbGFzczogJ3RyZWUtdmlldy1kaWFsb2cgb3ZlcmxheSBmcm9tLXRvcCcsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ3BhbmVscycsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3BhbmVscy1pdGVtJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoe1xuICAgICAgICAgICAgY2xhc3M6ICdpY29uJyxcbiAgICAgICAgICAgIG91dGxldDogJ3RleHQnLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICAgIGNsYXNzOiAnZXJyb3ItbWVzc2FnZScsXG4gICAgICAgICAgICBzdHlsZTogJ21hcmdpbi1ib3R0b206IDE1cHg7IGNvbG9yOiAjZmYwMDAwOycsXG4gICAgICAgICAgICBvdXRsZXQ6ICdlcnJvcicsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5kaXYoe1xuICAgICAgICAgICAgY2xhc3M6ICdwYW5lbHMtY29udGVudCcsXG4gICAgICAgICAgICBvdXRsZXQ6ICdlbGVtZW50cycsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG9wdHMgfHwge307XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgJ2NoYW5nZSc7XG4gICAgc2VsZi50aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgJ0Z0cC1SZW1vdGUtRWRpdCc7XG4gICAgc2VsZi5wcm9tcHQgPSBvcHRpb25zLnByb21wdCB8fCAnVG8gY2hhbmdlIHlvdXIgcGFzc3dvcmQsIHlvdSBuZWVkIHRvIGVudGVyIHRoZSBvbGQgb25lIGFuZCBjb25maXJtIHRoZSBuZXcgb25lIGJ5IGVudGVyaW5nIGl0IDIgdGltZXMuJztcbiAgICBzZWxmLmljb25DbGFzcyA9IG9wdGlvbnMuaWNvbkNsYXNzIHx8ICcnO1xuXG4gICAgaWYgKHNlbGYuaWNvbkNsYXNzKSB7XG4gICAgICBzZWxmLnRleHQuYWRkQ2xhc3ModGhpcy5pY29uQ2xhc3MpO1xuICAgIH1cblxuICAgIGxldCBodG1sID0gJzxwPicgKyBzZWxmLnRpdGxlICsgJzwvcD4nO1xuICAgIGh0bWwgKz0gJzxwPicgKyBzZWxmLnByb21wdCArICc8L3A+JztcbiAgICBzZWxmLnRleHQuaHRtbChodG1sKTtcblxuICAgIGxldCBvbGRQd2RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgb2xkUHdkTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBvbGRQd2RMYWJlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb2xkUHdkTGFiZWxUaXRsZS50ZXh0Q29udGVudCA9ICdPbGQgcGFzc3dvcmQ6JztcbiAgICBvbGRQd2RMYWJlbFRpdGxlLmNsYXNzTGlzdC5hZGQoJ3NldHRpbmctdGl0bGUnKTtcbiAgICBvbGRQd2RMYWJlbC5hcHBlbmRDaGlsZChvbGRQd2RMYWJlbFRpdGxlKTtcbiAgICBzZWxmLm9sZFB3ZElucHV0ID0gbmV3IFRleHRFZGl0b3JWaWV3KHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIkVudGVyIG9sZCBwYXNzd29yZC4uLlwiIH0pO1xuXG4gICAgbGV0IG5ld1B3ZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBuZXdQd2RMYWJlbC5jbGFzc0xpc3QuYWRkKCdjb250cm9sLWxhYmVsJyk7XG4gICAgbGV0IG5ld1B3ZExhYmVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXdQd2RMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ05ldyBwYXNzd29yZDonO1xuICAgIG5ld1B3ZExhYmVsVGl0bGUuY2xhc3NMaXN0LmFkZCgnc2V0dGluZy10aXRsZScpO1xuICAgIG5ld1B3ZExhYmVsLmFwcGVuZENoaWxkKG5ld1B3ZExhYmVsVGl0bGUpO1xuICAgIHNlbGYubmV3UHdkSW5wdXQgPSBuZXcgVGV4dEVkaXRvclZpZXcoeyBtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwiRW50ZXIgbmV3IHBhc3N3b3JkLi4uXCIgfSk7XG5cbiAgICBsZXQgY29uZmlybVB3ZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBjb25maXJtUHdkTGFiZWwuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1sYWJlbCcpO1xuICAgIGxldCBjb25maXJtUHdkTGFiZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbmZpcm1Qd2RMYWJlbFRpdGxlLnRleHRDb250ZW50ID0gJ0NvbmZpcm0gcGFzc3dvcmQ6JztcbiAgICBjb25maXJtUHdkTGFiZWxUaXRsZS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nLXRpdGxlJyk7XG4gICAgY29uZmlybVB3ZExhYmVsLmFwcGVuZENoaWxkKGNvbmZpcm1Qd2RMYWJlbFRpdGxlKTtcbiAgICBzZWxmLmNvbmZpcm1Qd2RJbnB1dCA9IG5ldyBUZXh0RWRpdG9yVmlldyh7IG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCJFbnRlciBuZXcgcGFzc3dvcmQuLi5cIiB9KTtcblxuICAgIGxldCBvbGRQd2RDb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb2xkUHdkQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIG9sZFB3ZENvbnRyb2wuY2xhc3NMaXN0LmFkZCgnb2xkUHdkJyk7XG4gICAgb2xkUHdkQ29udHJvbC5hcHBlbmRDaGlsZChvbGRQd2RMYWJlbCk7XG4gICAgb2xkUHdkQ29udHJvbC5hcHBlbmRDaGlsZChzZWxmLm9sZFB3ZElucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IG5ld1B3ZENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBuZXdQd2RDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzJyk7XG4gICAgbmV3UHdkQ29udHJvbC5jbGFzc0xpc3QuYWRkKCduZXdQd2QnKTtcbiAgICBuZXdQd2RDb250cm9sLmFwcGVuZENoaWxkKG5ld1B3ZExhYmVsKTtcbiAgICBuZXdQd2RDb250cm9sLmFwcGVuZENoaWxkKHNlbGYubmV3UHdkSW5wdXQuZWxlbWVudCk7XG5cbiAgICBsZXQgY29uZmlybVB3ZENvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25maXJtUHdkQ29udHJvbC5jbGFzc0xpc3QuYWRkKCdjb250cm9scycpO1xuICAgIGNvbmZpcm1Qd2RDb250cm9sLmNsYXNzTGlzdC5hZGQoJ2NvbmZpcm1Qd2QnKTtcbiAgICBjb25maXJtUHdkQ29udHJvbC5hcHBlbmRDaGlsZChjb25maXJtUHdkTGFiZWwpO1xuICAgIGNvbmZpcm1Qd2RDb250cm9sLmFwcGVuZENoaWxkKHNlbGYuY29uZmlybVB3ZElucHV0LmVsZW1lbnQpO1xuXG4gICAgbGV0IHB3ZEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHdkR3JvdXAuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cCcpO1xuICAgIGlmIChzZWxmLm1vZGUgPT0gJ2NoYW5nZScpIHB3ZEdyb3VwLmFwcGVuZENoaWxkKG9sZFB3ZENvbnRyb2wpO1xuICAgIHB3ZEdyb3VwLmFwcGVuZENoaWxkKG5ld1B3ZENvbnRyb2wpO1xuICAgIHB3ZEdyb3VwLmFwcGVuZENoaWxkKGNvbmZpcm1Qd2RDb250cm9sKTtcblxuICAgIGxldCBncm91cHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBncm91cHMuY2xhc3NMaXN0LmFkZCgnY29udHJvbC1ncm91cHMnKTtcbiAgICBncm91cHMuYXBwZW5kQ2hpbGQocHdkR3JvdXApO1xuXG4gICAgbGV0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBzYXZlQnV0dG9uLnRleHRDb250ZW50ID0gJ0FwcGx5JztcbiAgICBzYXZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuXG4gICAgbGV0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQgPSAnQ2FuY2VsJztcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwdWxsLXJpZ2h0Jyk7XG5cbiAgICBzZWxmLmVsZW1lbnRzLmFwcGVuZChncm91cHMpO1xuICAgIHNlbGYuZWxlbWVudHMuYXBwZW5kKHNhdmVCdXR0b24pO1xuICAgIHNlbGYuZWxlbWVudHMuYXBwZW5kKGNsb3NlQnV0dG9uKTtcblxuICAgIGNvbnN0IG9sZFBhc3N3b3JkTW9kZWwgPSBzZWxmLm9sZFB3ZElucHV0LmdldE1vZGVsKCk7XG4gICAgY29uc3QgbmV3UGFzc3dvcmRNb2RlbCA9IHNlbGYubmV3UHdkSW5wdXQuZ2V0TW9kZWwoKTtcbiAgICBjb25zdCBjb25maXJtUGFzc3dvcmRNb2RlbCA9IHNlbGYuY29uZmlybVB3ZElucHV0LmdldE1vZGVsKCk7XG5cbiAgICBsZXQgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICBvbGRQYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkID0gbmV3IFRleHRCdWZmZXIoJycpO1xuICAgIG9sZFBhc3N3b3JkTW9kZWwuYnVmZmVyLm9uRGlkQ2hhbmdlKChvYmopID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBvbGRQYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLnNldFRleHRJblJhbmdlKG9iai5vbGRSYW5nZSwgb2JqLm5ld1RleHQpO1xuICAgICAgICBvbGRQYXNzd29yZE1vZGVsLmJ1ZmZlci5zZXRUZXh0SW5SYW5nZShvYmoubmV3UmFuZ2UsICcqJy5yZXBlYXQob2JqLm5ld1RleHQubGVuZ3RoKSk7XG4gICAgICAgIGNoYW5naW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBuZXdQYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkID0gbmV3IFRleHRCdWZmZXIoJycpO1xuICAgIG5ld1Bhc3N3b3JkTW9kZWwuYnVmZmVyLm9uRGlkQ2hhbmdlKChvYmopID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBuZXdQYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLnNldFRleHRJblJhbmdlKG9iai5vbGRSYW5nZSwgb2JqLm5ld1RleHQpO1xuICAgICAgICBuZXdQYXNzd29yZE1vZGVsLmJ1ZmZlci5zZXRUZXh0SW5SYW5nZShvYmoubmV3UmFuZ2UsICcqJy5yZXBlYXQob2JqLm5ld1RleHQubGVuZ3RoKSk7XG4gICAgICAgIGNoYW5naW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25maXJtUGFzc3dvcmRNb2RlbC5jbGVhclRleHRQYXNzd29yZCA9IG5ldyBUZXh0QnVmZmVyKCcnKTtcbiAgICBjb25maXJtUGFzc3dvcmRNb2RlbC5idWZmZXIub25EaWRDaGFuZ2UoKG9iaikgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2luZykge1xuICAgICAgICBjaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIGNvbmZpcm1QYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLnNldFRleHRJblJhbmdlKG9iai5vbGRSYW5nZSwgb2JqLm5ld1RleHQpO1xuICAgICAgICBjb25maXJtUGFzc3dvcmRNb2RlbC5idWZmZXIuc2V0VGV4dEluUmFuZ2Uob2JqLm5ld1JhbmdlLCAnKicucmVwZWF0KG9iai5uZXdUZXh0Lmxlbmd0aCkpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHNlbGYuc2F2ZSgpO1xuICAgIH0pO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICBzZWxmLnNhdmUoKTtcbiAgICAgIH0sXG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB7XG4gICAgICAgIHNlbGYuY2FuY2VsKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZi5tb2RlID09ICdjaGFuZ2UnKSB7XG4gICAgICBzZWxmLm9sZFB3ZElucHV0LmZvY3VzKCk7XG4gICAgICBzZWxmLm9sZFB3ZElucHV0LmdldE1vZGVsKCkuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLm5ld1B3ZElucHV0LmZvY3VzKCk7XG4gICAgICBzZWxmLm5ld1B3ZElucHV0LmdldE1vZGVsKCkuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjb25zdCBvbGRQYXNzd29yZCA9IHNlbGYub2xkUHdkSW5wdXQuZ2V0TW9kZWwoKS5jbGVhclRleHRQYXNzd29yZC5nZXRUZXh0KCk7XG4gICAgY29uc3QgbmV3UGFzc3dvcmQgPSBzZWxmLm5ld1B3ZElucHV0LmdldE1vZGVsKCkuY2xlYXJUZXh0UGFzc3dvcmQuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGNvbmZpcm1QYXNzd29yZCA9IHNlbGYuY29uZmlybVB3ZElucHV0LmdldE1vZGVsKCkuY2xlYXJUZXh0UGFzc3dvcmQuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKCFjaGVja1Bhc3N3b3JkKG9sZFBhc3N3b3JkKSkge1xuICAgICAgcmV0dXJuIHNlbGYuc2hvd0Vycm9yKCdPbGQgcGFzc3dvcmQgZG8gbm90IG1hdGNoLicpO1xuICAgIH1cbiAgICBpZiAobmV3UGFzc3dvcmQgPT0gJycpIHtcbiAgICAgIHJldHVybiBzZWxmLnNob3dFcnJvcignTmV3IHBhc3N3b3JkIGNhbiBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuICAgIGlmIChuZXdQYXNzd29yZCAhPSBjb25maXJtUGFzc3dvcmQpIHtcbiAgICAgIHJldHVybiBzZWxmLnNob3dFcnJvcignTmV3IHBhc3N3b3JkcyBkbyBub3QgbWF0Y2guJyk7XG4gICAgfVxuXG4gICAgbGV0IHBhc3N3b3JkcyA9IHtcbiAgICAgICdvbGRQYXNzd29yZCc6IG9sZFBhc3N3b3JkLFxuICAgICAgJ25ld1Bhc3N3b3JkJzogbmV3UGFzc3dvcmQsXG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdkaWFsb2ctZG9uZScsIFtwYXNzd29yZHNdKTtcbiAgICBzZWxmLmNsb3NlKCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBjb25zdCBkZXN0cm95UGFuZWwgPSB0aGlzLnBhbmVsO1xuICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIGlmIChkZXN0cm95UGFuZWwpIHtcbiAgICAgIGRlc3Ryb3lQYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc2hvd0Vycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLmVycm9yLnRleHQobWVzc2FnZSk7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuZmxhc2hFcnJvcigpO1xuICAgIH1cbiAgfVxufVxuIl19