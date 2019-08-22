Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dialog = require('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _helperSecureJs = require('../helper/secure.js');

var _atom = require('atom');

'use babel';

var atom = global.atom;

var PromptPassDialog = (function (_Dialog) {
  _inherits(PromptPassDialog, _Dialog);

  function PromptPassDialog() {
    _classCallCheck(this, PromptPassDialog);

    _get(Object.getPrototypeOf(PromptPassDialog.prototype), 'constructor', this).call(this, {
      prompt: 'Enter password only for this session:',
      select: false
    });

    var self = this;
    var passwordModel = self.miniEditor.getModel();

    passwordModel.clearTextPassword = new _atom.TextBuffer('');

    var changing = false;
    passwordModel.buffer.onDidChange(function (obj) {
      if (!changing) {
        changing = true;
        passwordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
        passwordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));
        changing = false;
      }
    });

    var coreConfirmListeners = atom.commands.inlineListenersByCommandName['core:confirm'].get(self.element);
    coreConfirmListeners.splice(0, coreConfirmListeners.length);

    atom.commands.add(self.element, {
      'core:confirm': function coreConfirm() {
        self.onConfirm(passwordModel.clearTextPassword.getText());
      }
    });
  }

  _createClass(PromptPassDialog, [{
    key: 'onConfirm',
    value: function onConfirm(pass) {
      this.trigger('dialog-done', [pass]);
    }
  }]);

  return PromptPassDialog;
})(_dialog2['default']);

exports['default'] = PromptPassDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsVUFBVTs7Ozs4QkFDbUIscUJBQXFCOztvQkFDMUMsTUFBTTs7QUFKakMsV0FBVyxDQUFDOztBQU1aLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBRUosZ0JBQWdCO1lBQWhCLGdCQUFnQjs7QUFFeEIsV0FGUSxnQkFBZ0IsR0FFckI7MEJBRkssZ0JBQWdCOztBQUdqQywrQkFIaUIsZ0JBQWdCLDZDQUczQjtBQUNKLFlBQU0sRUFBRSx1Q0FBdUM7QUFDL0MsWUFBTSxFQUFFLEtBQUs7S0FDZCxFQUFFOztBQUVILFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVqRCxpQkFBYSxDQUFDLGlCQUFpQixHQUFHLHFCQUFlLEVBQUUsQ0FBQyxDQUFDOztBQUVyRCxRQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDckIsaUJBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3hDLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLElBQUksQ0FBQztBQUNoQixxQkFBYSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxRSxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNsRixnQkFBUSxHQUFHLEtBQUssQ0FBQztPQUNsQjtLQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxRyx3QkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU1RCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLG9CQUFjLEVBQUUsdUJBQU07QUFDcEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztPQUMzRDtLQUNGLENBQUMsQ0FBQztHQUNKOztlQS9Ca0IsZ0JBQWdCOztXQWlDMUIsbUJBQUMsSUFBSSxFQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3JDOzs7U0FuQ2tCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2RpYWxvZ3MvcHJvbXB0LXBhc3MtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHsgZGVjcnlwdCwgZW5jcnlwdCwgY2hlY2tQYXNzd29yZCB9IGZyb20gJy4uL2hlbHBlci9zZWN1cmUuanMnO1xuaW1wb3J0IHsgVGV4dEJ1ZmZlciB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBhdG9tID0gZ2xvYmFsLmF0b207XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb21wdFBhc3NEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIHByb21wdDogJ0VudGVyIHBhc3N3b3JkIG9ubHkgZm9yIHRoaXMgc2Vzc2lvbjonLFxuICAgICAgc2VsZWN0OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHBhc3N3b3JkTW9kZWwgPSBzZWxmLm1pbmlFZGl0b3IuZ2V0TW9kZWwoKTtcblxuICAgIHBhc3N3b3JkTW9kZWwuY2xlYXJUZXh0UGFzc3dvcmQgPSBuZXcgVGV4dEJ1ZmZlcignJyk7XG5cbiAgICBsZXQgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICBwYXNzd29yZE1vZGVsLmJ1ZmZlci5vbkRpZENoYW5nZSgob2JqKSA9PiB7XG4gICAgICBpZiAoIWNoYW5naW5nKSB7XG4gICAgICAgIGNoYW5naW5nID0gdHJ1ZTtcbiAgICAgICAgcGFzc3dvcmRNb2RlbC5jbGVhclRleHRQYXNzd29yZC5zZXRUZXh0SW5SYW5nZShvYmoub2xkUmFuZ2UsIG9iai5uZXdUZXh0KTtcbiAgICAgICAgcGFzc3dvcmRNb2RlbC5idWZmZXIuc2V0VGV4dEluUmFuZ2Uob2JqLm5ld1JhbmdlLCAnKicucmVwZWF0KG9iai5uZXdUZXh0Lmxlbmd0aCkpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29yZUNvbmZpcm1MaXN0ZW5lcnMgPSBhdG9tLmNvbW1hbmRzLmlubGluZUxpc3RlbmVyc0J5Q29tbWFuZE5hbWVbJ2NvcmU6Y29uZmlybSddLmdldChzZWxmLmVsZW1lbnQpO1xuICAgIGNvcmVDb25maXJtTGlzdGVuZXJzLnNwbGljZSgwLCBjb3JlQ29uZmlybUxpc3RlbmVycy5sZW5ndGgpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoc2VsZi5lbGVtZW50LCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICBzZWxmLm9uQ29uZmlybShwYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLmdldFRleHQoKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgb25Db25maXJtKHBhc3MpIHtcbiAgICB0aGlzLnRyaWdnZXIoJ2RpYWxvZy1kb25lJywgW3Bhc3NdKTtcbiAgfVxufVxuIl19