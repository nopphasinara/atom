Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _alignRegexpView = require('./align-regexp-view');

var _alignRegexpView2 = _interopRequireDefault(_alignRegexpView);

var _alignLines = require('./align-lines');

var _alignLines2 = _interopRequireDefault(_alignLines);

'use babel';

exports['default'] = {
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.alignRegexpView = new _alignRegexpView2['default'](state && state.history);

    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.alignRegexpView,
      visible: false
    });
    this.alignRegexpView.on('align', this.executeAlign.bind(this));
    this.alignRegexpView.on('cancel', function () {
      return _this.cancel();
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'align-regexp:align-selection': function alignRegexpAlignSelection() {
        return _this.alignSelection();
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    this.alignRegexpView.destroy();
  },

  serialize: function serialize() {
    return {
      history: this.alignRegexpView.history
    };
  },

  alignSelection: function alignSelection() {
    this.modalPanel.show();
    this.alignRegexpView.getEditorElement().focus();
  },

  realignSelection: function realignSelection() {
    this.executeAlign(this.lastRegexp);
  },

  executeAlign: function executeAlign(regexpString) {
    this.cancel();
    if (!regexpString) {
      return;
    }

    var flags = '';
    var extractFlagsRegex = /([g|i|m|u|y]+): ?(.+)/;

    var flagsMatch = extractFlagsRegex.exec(regexpString);
    if (flagsMatch) {
      regexpString = flagsMatch[2];
      flags = flagsMatch[1];
    }

    var regexp = undefined;
    try {
      regexp = new RegExp(regexpString, flags);
    } catch (e) {
      var _ret = (function () {
        var notification = atom.notifications.addError('Invalid regexp ' + regexpString);
        setTimeout(function () {
          return notification.dismiss();
        }, 500);
        return {
          v: undefined
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    var editor = atom.workspace.getActiveTextEditor();
    var lineEnding = editor.getBuffer().getPreferredLineEnding();
    var selections = editor.getSelections();

    selections.forEach(function (selection) {
      var aligned = (0, _alignLines2['default'])(selection.getText(), regexp, { lineEnding: lineEnding });
      editor.setTextInBufferRange(selection.getBufferRange(), aligned);
    });

    this.alignRegexpView.addToHistory(regexpString);
  },

  cancel: function cancel() {
    this.modalPanel.hide();
    atom.workspace.getActivePane().activate();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWxpZ24tcmVnZXhwL2xpYi9hbGlnbi1yZWdleHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOzsrQkFDTixxQkFBcUI7Ozs7MEJBQ3JCLGVBQWU7Ozs7QUFKbkQsV0FBVyxDQUFDOztxQkFNRztBQUNiLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOzs7QUFDZCxRQUFJLENBQUMsYUFBYSxHQUFLLCtCQUF5QixDQUFDO0FBQ2pELFFBQUksQ0FBQyxlQUFlLEdBQUcsaUNBQW9CLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRW5FLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFDOUMsVUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlO0FBQzFCLGFBQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0QsUUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXZELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELG9DQUE4QixFQUFFO2VBQU0sTUFBSyxjQUFjLEVBQUU7T0FBQTtLQUM1RCxDQUFDLENBQUMsQ0FBQztHQUNMOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNoQzs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPO0FBQ0wsYUFBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTztLQUN0QyxDQUFDO0dBQ0g7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2pEOztBQUVELGtCQUFnQixFQUFBLDRCQUFHO0FBQ2pCLFFBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQ3BDOztBQUVELGNBQVksRUFBQSxzQkFBQyxZQUFZLEVBQUU7QUFDekIsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsUUFBSSxDQUFDLFlBQVksRUFBRTtBQUNqQixhQUFPO0tBQ1I7O0FBRUQsUUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQzs7QUFFbEQsUUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hELFFBQUksVUFBVSxFQUFFO0FBQ2Qsa0JBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsV0FBSyxHQUFVLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5Qjs7QUFFRCxRQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsUUFBSTtBQUNGLFlBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUMsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFDVixZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEscUJBQW1CLFlBQVksQ0FBRyxDQUFDO0FBQ25GLGtCQUFVLENBQUM7aUJBQU0sWUFBWSxDQUFDLE9BQU8sRUFBRTtTQUFBLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUM7O1VBQU87Ozs7S0FDUjs7QUFFRCxRQUFNLE1BQU0sR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDeEQsUUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7QUFDL0QsUUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUUxQyxjQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUyxFQUFJO0FBQzlCLFVBQU0sT0FBTyxHQUFHLDZCQUFXLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBQyxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUMsQ0FBQztBQUN0RSxZQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2xFLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNqRDs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7R0FDM0M7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2FsaWduLXJlZ2V4cC9saWIvYWxpZ24tcmVnZXhwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBBbGlnblJlZ2V4cFZpZXcgICAgICAgICBmcm9tICcuL2FsaWduLXJlZ2V4cC12aWV3JztcbmltcG9ydCBhbGlnbkxpbmVzICAgICAgICAgICAgICBmcm9tICcuL2FsaWduLWxpbmVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zICAgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuYWxpZ25SZWdleHBWaWV3ID0gbmV3IEFsaWduUmVnZXhwVmlldyhzdGF0ZSAmJiBzdGF0ZS5oaXN0b3J5KTtcblxuICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMuYWxpZ25SZWdleHBWaWV3LFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICB0aGlzLmFsaWduUmVnZXhwVmlldy5vbignYWxpZ24nLCB0aGlzLmV4ZWN1dGVBbGlnbi5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmFsaWduUmVnZXhwVmlldy5vbignY2FuY2VsJywgKCkgPT4gdGhpcy5jYW5jZWwoKSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdhbGlnbi1yZWdleHA6YWxpZ24tc2VsZWN0aW9uJzogKCkgPT4gdGhpcy5hbGlnblNlbGVjdGlvbigpXG4gICAgfSkpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmFsaWduUmVnZXhwVmlldy5kZXN0cm95KCk7XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoaXN0b3J5OiB0aGlzLmFsaWduUmVnZXhwVmlldy5oaXN0b3J5XG4gICAgfTtcbiAgfSxcblxuICBhbGlnblNlbGVjdGlvbigpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuc2hvdygpO1xuICAgIHRoaXMuYWxpZ25SZWdleHBWaWV3LmdldEVkaXRvckVsZW1lbnQoKS5mb2N1cygpO1xuICB9LFxuXG4gIHJlYWxpZ25TZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5leGVjdXRlQWxpZ24odGhpcy5sYXN0UmVnZXhwKTtcbiAgfSxcblxuICBleGVjdXRlQWxpZ24ocmVnZXhwU3RyaW5nKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICBpZiAoIXJlZ2V4cFN0cmluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmbGFncyA9ICcnO1xuICAgIGNvbnN0IGV4dHJhY3RGbGFnc1JlZ2V4ID0gLyhbZ3xpfG18dXx5XSspOiA/KC4rKS87XG5cbiAgICBjb25zdCBmbGFnc01hdGNoID0gZXh0cmFjdEZsYWdzUmVnZXguZXhlYyhyZWdleHBTdHJpbmcpO1xuICAgIGlmIChmbGFnc01hdGNoKSB7XG4gICAgICByZWdleHBTdHJpbmcgPSBmbGFnc01hdGNoWzJdO1xuICAgICAgZmxhZ3MgICAgICAgID0gZmxhZ3NNYXRjaFsxXTtcbiAgICB9XG5cbiAgICBsZXQgcmVnZXhwO1xuICAgIHRyeSB7XG4gICAgICByZWdleHAgPSBuZXcgUmVnRXhwKHJlZ2V4cFN0cmluZywgZmxhZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgSW52YWxpZCByZWdleHAgJHtyZWdleHBTdHJpbmd9YCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCksIDUwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yICAgICA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBsaW5lRW5kaW5nID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldFByZWZlcnJlZExpbmVFbmRpbmcoKTtcbiAgICBjb25zdCBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKTtcblxuICAgIHNlbGVjdGlvbnMuZm9yRWFjaChzZWxlY3Rpb24gPT4ge1xuICAgICAgY29uc3QgYWxpZ25lZCA9IGFsaWduTGluZXMoc2VsZWN0aW9uLmdldFRleHQoKSwgcmVnZXhwLCB7bGluZUVuZGluZ30pO1xuICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLCBhbGlnbmVkKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWxpZ25SZWdleHBWaWV3LmFkZFRvSGlzdG9yeShyZWdleHBTdHJpbmcpO1xuICB9LFxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpO1xuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICB9XG59O1xuIl19