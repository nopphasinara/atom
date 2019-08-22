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

'use babel';

var atom = global.atom;

var Dialog = (function (_View) {
  _inherits(Dialog, _View);

  _createClass(Dialog, null, [{
    key: 'content',
    value: function content(opts) {
      var _this = this;

      var options = opts || {};
      return this.div({
        'class': 'tree-view-dialog overlay from-top'
      }, function () {
        _this.label(options.prompt, {
          'class': 'icon',
          outlet: 'text'
        });
        _this.div({
          'class': 'error-message',
          style: 'margin-bottom: 15px; color: #ff0000;',
          outlet: 'error'
        });
        _this.subview('miniEditor', new _atomSpacePenViews.TextEditorView({
          mini: true
        }));
      });
    }
  }]);

  function Dialog(opts) {
    var _this2 = this;

    _classCallCheck(this, Dialog);

    var options = opts || {};
    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, options);
    var self = this;

    this.prompt = options.prompt || '';
    this.initialPath = options.initialPath || '';
    this.select = options.select || false;
    this.iconClass = options.iconClass || '';

    if (this.iconClass) {
      this.text.addClass(this.iconClass);
    }

    atom.commands.add(this.element, {
      'core:confirm': function coreConfirm() {
        self.onConfirm(self.miniEditor.getText());
      },
      'core:cancel': function coreCancel() {
        self.cancel();
      }
    });

    this.miniEditor.on('blur', function () {
      _this2.close();
    });

    this.miniEditor.getModel().onDidChange(function () {
      _this2.showError();
    });

    if (this.initialPath) {
      this.miniEditor.getModel().setText(this.initialPath);
    }

    if (this.select) {
      var ext = _path2['default'].extname(this.initialPath);
      var _name = _path2['default'].basename(this.initialPath);
      var selEnd = undefined;
      if (_name === ext) {
        selEnd = this.initialPath.length;
      } else {
        selEnd = this.initialPath.length - ext.length;
      }
      var range = [[0, this.initialPath.length - _name.length], [0, selEnd]];
      this.miniEditor.getModel().setSelectedBufferRange(range);
    }
  }

  _createClass(Dialog, [{
    key: 'attach',
    value: function attach() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      this.miniEditor.getModel().scrollToCursorPosition();
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

  return Dialog;
})(_atomSpacePenViews.View);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2RpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztpQ0FDaUIsc0JBQXNCOztBQUg5RCxXQUFXLENBQUM7O0FBS1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFFSixNQUFNO1lBQU4sTUFBTTs7ZUFBTixNQUFNOztXQUVYLGlCQUFDLElBQUksRUFBRTs7O0FBQ25CLFVBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDM0IsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ2QsaUJBQU8sbUNBQW1DO09BQzNDLEVBQUUsWUFBTTtBQUNQLGNBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDekIsbUJBQU8sTUFBTTtBQUNiLGdCQUFNLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztBQUNILGNBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sZUFBZTtBQUN0QixlQUFLLEVBQUUsc0NBQXNDO0FBQzdDLGdCQUFNLEVBQUUsT0FBTztTQUNoQixDQUFDLENBQUM7QUFDSCxjQUFLLE9BQU8sQ0FBQyxZQUFZLEVBQUUsc0NBQW1CO0FBQzVDLGNBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDLENBQUM7T0FDTCxDQUFDLENBQUM7S0FDSjs7O0FBRVUsV0F0QlEsTUFBTSxDQXNCYixJQUFJLEVBQUU7OzswQkF0QkMsTUFBTTs7QUF1QnZCLFFBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDM0IsK0JBeEJpQixNQUFNLDZDQXdCakIsT0FBTyxFQUFFO0FBQ2YsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7QUFDN0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztBQUN0QyxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDOztBQUV6QyxRQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3BDOztBQUVELFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUIsb0JBQWMsRUFBRSx1QkFBTTtBQUNwQixZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztPQUMzQztBQUNELG1CQUFhLEVBQUUsc0JBQU07QUFDbkIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDL0IsYUFBSyxLQUFLLEVBQUUsQ0FBQztLQUNkLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzNDLGFBQUssU0FBUyxFQUFFLENBQUM7S0FDbEIsQ0FBQyxDQUFDOztBQUVILFFBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixVQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDdEQ7O0FBRUQsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsVUFBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzQyxVQUFNLEtBQUksR0FBRyxrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxVQUFJLEtBQUksS0FBSyxHQUFHLEVBQUU7QUFDaEIsY0FBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO09BQ2xDLE1BQU07QUFDTCxjQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztPQUMvQztBQUNELFVBQU0sS0FBSyxHQUFHLENBQ1osQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUMxQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FDWixDQUFDO0FBQ0YsVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxRDtHQUNGOztlQXhFa0IsTUFBTTs7V0EwRW5CLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4QyxZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87T0FDbkIsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QixVQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7S0FDckQ7OztXQUVJLGlCQUFHO0FBQ04sVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNoQyxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLFlBQVksRUFBRTtBQUNoQixvQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3hCOztBQUVELFVBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDM0M7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVRLG1CQUFDLE9BQU8sRUFBRTtBQUNqQixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QixVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztPQUNuQjtLQUNGOzs7U0FyR2tCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2RpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ICQsIFZpZXcsIFRleHRFZGl0b3JWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5jb25zdCBhdG9tID0gZ2xvYmFsLmF0b207XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBjb250ZW50KG9wdHMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gb3B0cyB8fCB7fTtcbiAgICByZXR1cm4gdGhpcy5kaXYoe1xuICAgICAgY2xhc3M6ICd0cmVlLXZpZXctZGlhbG9nIG92ZXJsYXkgZnJvbS10b3AnLFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMubGFiZWwob3B0aW9ucy5wcm9tcHQsIHtcbiAgICAgICAgY2xhc3M6ICdpY29uJyxcbiAgICAgICAgb3V0bGV0OiAndGV4dCcsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdlcnJvci1tZXNzYWdlJyxcbiAgICAgICAgc3R5bGU6ICdtYXJnaW4tYm90dG9tOiAxNXB4OyBjb2xvcjogI2ZmMDAwMDsnLFxuICAgICAgICBvdXRsZXQ6ICdlcnJvcicsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3VidmlldygnbWluaUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyh7XG4gICAgICAgIG1pbmk6IHRydWUsXG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG9wdHMgfHwge307XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnByb21wdCA9IG9wdGlvbnMucHJvbXB0IHx8ICcnO1xuICAgIHRoaXMuaW5pdGlhbFBhdGggPSBvcHRpb25zLmluaXRpYWxQYXRoIHx8ICcnO1xuICAgIHRoaXMuc2VsZWN0ID0gb3B0aW9ucy5zZWxlY3QgfHwgZmFsc2U7XG4gICAgdGhpcy5pY29uQ2xhc3MgPSBvcHRpb25zLmljb25DbGFzcyB8fCAnJztcblxuICAgIGlmICh0aGlzLmljb25DbGFzcykge1xuICAgICAgdGhpcy50ZXh0LmFkZENsYXNzKHRoaXMuaWNvbkNsYXNzKTtcbiAgICB9XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB7XG4gICAgICAgIHNlbGYub25Db25maXJtKHNlbGYubWluaUVkaXRvci5nZXRUZXh0KCkpO1xuICAgICAgfSxcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHtcbiAgICAgICAgc2VsZi5jYW5jZWwoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm1pbmlFZGl0b3Iub24oJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICB0aGlzLnNob3dFcnJvcigpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaW5pdGlhbFBhdGgpIHtcbiAgICAgIHRoaXMubWluaUVkaXRvci5nZXRNb2RlbCgpLnNldFRleHQodGhpcy5pbml0aWFsUGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0KSB7XG4gICAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUodGhpcy5pbml0aWFsUGF0aCk7XG4gICAgICBjb25zdCBuYW1lID0gcGF0aC5iYXNlbmFtZSh0aGlzLmluaXRpYWxQYXRoKTtcbiAgICAgIGxldCBzZWxFbmQ7XG4gICAgICBpZiAobmFtZSA9PT0gZXh0KSB7XG4gICAgICAgIHNlbEVuZCA9IHRoaXMuaW5pdGlhbFBhdGgubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsRW5kID0gdGhpcy5pbml0aWFsUGF0aC5sZW5ndGggLSBleHQubGVuZ3RoO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgIFswLCB0aGlzLmluaXRpYWxQYXRoLmxlbmd0aCAtIG5hbWUubGVuZ3RoXSxcbiAgICAgICAgWzAsIHNlbEVuZF1cbiAgICAgIF07XG4gICAgICB0aGlzLm1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50XG4gICAgfSk7XG4gICAgdGhpcy5taW5pRWRpdG9yLmZvY3VzKCk7XG4gICAgdGhpcy5taW5pRWRpdG9yLmdldE1vZGVsKCkuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgY29uc3QgZGVzdHJveVBhbmVsID0gdGhpcy5wYW5lbDtcbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICBpZiAoZGVzdHJveVBhbmVsKSB7XG4gICAgICBkZXN0cm95UGFuZWwuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHNob3dFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5lcnJvci50ZXh0KG1lc3NhZ2UpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLmZsYXNoRXJyb3IoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==