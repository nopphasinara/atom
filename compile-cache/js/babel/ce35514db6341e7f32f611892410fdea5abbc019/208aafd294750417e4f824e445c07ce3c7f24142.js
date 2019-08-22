Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

var MAX_HISTORY_SIZE = 10;

var AlignRegexpView = (function (_EventEmitter) {
  _inherits(AlignRegexpView, _EventEmitter);

  function AlignRegexpView(serializedHistory) {
    var _this = this;

    _classCallCheck(this, AlignRegexpView);

    _get(Object.getPrototypeOf(AlignRegexpView.prototype), 'constructor', this).call(this);
    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('div');
    this.editorElement = document.createElement('atom-text-editor');

    this.editorElement.classList.add('align-regexp');
    this.editorElement.classList.add('editor');
    this.editorElement.getModel().setMini(true);
    this.editorElement.setAttribute('mini', '');

    this.subscriptions.add(atom.commands.add(this.editorElement, 'core:confirm', function () {
      return _this.execute();
    }));
    this.subscriptions.add(atom.commands.add(this.editorElement, 'core:cancel', function () {
      return _this.cancel();
    }));
    this.subscriptions.add(atom.commands.add(this.editorElement, 'core:move-up', function () {
      return _this.historyPrevious();
    }));
    this.subscriptions.add(atom.commands.add(this.editorElement, 'core:move-down', function () {
      return _this.historyNext();
    }));

    this.element.appendChild(this.editorElement);

    this.history = serializedHistory || [''];
    this.historyIndex = 0;
  }

  _createClass(AlignRegexpView, [{
    key: 'execute',
    value: function execute() {
      this.emit('align', this.editorElement.getModel().getText());
      this.reset();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.emit('cancel');
      this.reset();
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.historyIndex = 0;
      this.editorElement.getModel().setText('');
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        history: this.history
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
      this.subscriptions.dispose();
    }
  }, {
    key: 'historyNext',
    value: function historyNext() {
      this.selectHistoryItem(this.historyIndex - 1);
    }
  }, {
    key: 'historyPrevious',
    value: function historyPrevious() {
      this.selectHistoryItem(this.historyIndex + 1);
    }
  }, {
    key: 'selectHistoryItem',
    value: function selectHistoryItem(index) {
      var historySize = this.history.length;
      this.historyIndex = (index + historySize) % historySize;
      this.editorElement.getModel().setText(this.history[this.historyIndex]);
    }
  }, {
    key: 'getEditorElement',
    value: function getEditorElement() {
      return this.editorElement;
    }
  }, {
    key: 'addToHistory',
    value: function addToHistory(regexp) {
      var index = this.history.indexOf(regexp);
      if (index > -1) {
        this.history.splice(index, 1);
      }
      this.history.splice(1, 0, regexp);
      if (this.history.length > MAX_HISTORY_SIZE) {
        this.history.splice(MAX_HISTORY_SIZE, this.history.length - MAX_HISTORY_SIZE + 1);
      }
    }
  }]);

  return AlignRegexpView;
})(_events2['default']);

exports['default'] = AlignRegexpView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWxpZ24tcmVnZXhwL2xpYi9hbGlnbi1yZWdleHAtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7c0JBQ04sUUFBUTs7OztBQUg1QyxXQUFXLENBQUM7O0FBS1osSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7O0lBRVAsZUFBZTtZQUFmLGVBQWU7O0FBQ3ZCLFdBRFEsZUFBZSxDQUN0QixpQkFBaUIsRUFBRTs7OzBCQURaLGVBQWU7O0FBRWhDLCtCQUZpQixlQUFlLDZDQUV4QjtBQUNSLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sR0FBUyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVoRSxRQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDakQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFNUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFO2FBQU0sTUFBSyxPQUFPLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQztBQUMvRSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFD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QUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEVBQUU7QUFDMUMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7T0FDbkY7S0FDRjs7O1NBaEZrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2FsaWduLXJlZ2V4cC9saWIvYWxpZ24tcmVnZXhwLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IEV2ZW50RW1pdHRlciAgICAgICAgICAgIGZyb20gJ2V2ZW50cyc7XG5cbmNvbnN0IE1BWF9ISVNUT1JZX1NJWkUgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWxpZ25SZWdleHBWaWV3IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Ioc2VyaWFsaXplZEhpc3RvcnkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5lbGVtZW50ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lZGl0b3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvcicpO1xuXG4gICAgdGhpcy5lZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FsaWduLXJlZ2V4cCcpO1xuICAgIHRoaXMuZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlZGl0b3InKTtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5zZXRNaW5pKHRydWUpO1xuICAgIHRoaXMuZWRpdG9yRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21pbmknLCAnJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lZGl0b3JFbGVtZW50LCAnY29yZTpjb25maXJtJywgKCkgPT4gdGhpcy5leGVjdXRlKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lZGl0b3JFbGVtZW50LCAnY29yZTpjYW5jZWwnLCAoKSA9PiB0aGlzLmNhbmNlbCgpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWRpdG9yRWxlbWVudCwgJ2NvcmU6bW92ZS11cCcsICgpID0+IHRoaXMuaGlzdG9yeVByZXZpb3VzKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lZGl0b3JFbGVtZW50LCAnY29yZTptb3ZlLWRvd24nLCAoKSA9PiB0aGlzLmhpc3RvcnlOZXh0KCkpKTtcblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvckVsZW1lbnQpO1xuXG4gICAgdGhpcy5oaXN0b3J5ID0gc2VyaWFsaXplZEhpc3RvcnkgfHwgWycnXTtcbiAgICB0aGlzLmhpc3RvcnlJbmRleCA9IDA7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMuZW1pdCgnYWxpZ24nLCB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmVtaXQoJ2NhbmNlbCcpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaGlzdG9yeUluZGV4ID0gMDtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5zZXRUZXh0KCcnKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGlzdG9yeTogdGhpcy5oaXN0b3J5XG4gICAgfTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBoaXN0b3J5TmV4dCgpIHtcbiAgICB0aGlzLnNlbGVjdEhpc3RvcnlJdGVtKHRoaXMuaGlzdG9yeUluZGV4IC0gMSk7XG4gIH1cblxuICBoaXN0b3J5UHJldmlvdXMoKSB7XG4gICAgdGhpcy5zZWxlY3RIaXN0b3J5SXRlbSh0aGlzLmhpc3RvcnlJbmRleCArIDEpO1xuICB9XG5cbiAgc2VsZWN0SGlzdG9yeUl0ZW0oaW5kZXgpIHtcbiAgICBjb25zdCBoaXN0b3J5U2l6ZSA9IHRoaXMuaGlzdG9yeS5sZW5ndGg7XG4gICAgdGhpcy5oaXN0b3J5SW5kZXggPSAoaW5kZXggKyBoaXN0b3J5U2l6ZSkgJSBoaXN0b3J5U2l6ZTtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5zZXRUZXh0KHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnlJbmRleF0pO1xuICB9XG5cbiAgZ2V0RWRpdG9yRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JFbGVtZW50O1xuICB9XG5cbiAgYWRkVG9IaXN0b3J5KHJlZ2V4cCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocmVnZXhwKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5oaXN0b3J5LnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHRoaXMuaGlzdG9yeS5zcGxpY2UoMSwgMCwgcmVnZXhwKTtcbiAgICBpZiAodGhpcy5oaXN0b3J5Lmxlbmd0aCA+IE1BWF9ISVNUT1JZX1NJWkUpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5zcGxpY2UoTUFYX0hJU1RPUllfU0laRSwgdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIE1BWF9ISVNUT1JZX1NJWkUgKyAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==