"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LivereloadView = (function (_HTMLDivElement) {
  _inherits(LivereloadView, _HTMLDivElement);

  function LivereloadView() {
    _classCallCheck(this, LivereloadView);

    _get(Object.getPrototypeOf(LivereloadView.prototype), 'constructor', this).apply(this, arguments);

    this._link = null;
    this._tooltip = null;
    this._command = null;
  }

  _createClass(LivereloadView, [{
    key: 'initialize',
    value: function initialize(state) {
      var _this = this;

      // add content
      this.innerHTML = '<a href="#" data-url></a>';
      this.firstChild.addEventListener('click', function (event) {
        return _this.handleClick(event);
      }, false);

      // add classes
      this.classList.add('livereload-status', 'inline-block');

      this.url = '';
      this.text = 'Off';
      this.tooltip = '';
    }
  }, {
    key: 'attach',
    value: function attach() {
      // Register command that toggles this view
      this._command = atom.commands.add('atom-workspace', { 'livereload:toggle': this.toggle.bind(this) });
    }
  }, {
    key: 'detach',
    value: function detach() {
      this._tooltip.dispose();
      this._command.dispose();
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return this._activated;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      try {
        this.detach();
      } catch (e) {};
      this.remove();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var event = new Event('toggle');
      this.dispatchEvent(event);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      event.preventDefault();
      if (this.url) {
        atom.clipboard.write(this.url, 'url');
      }
    }
  }, {
    key: 'text',
    set: function set(text) {
      this.firstChild.textContent = 'LiveReload: ' + text;
    },
    get: function get() {
      return this.firstChild.textContent;
    }
  }, {
    key: 'url',
    set: function set(url) {
      this.firstChild.dataset.url = url;
    },
    get: function get() {
      return this.firstChild.dataset.url;
    }
  }, {
    key: 'tooltip',
    set: function set(text) {
      if (this._tooltip) this._tooltip.dispose();
      this._tooltip = atom.tooltips.add(this, { title: text });
    }
  }]);

  return LivereloadView;
})(HTMLDivElement);

exports['default'] = document.registerElement('livereload-status-bar', { prototype: LivereloadView.prototype });
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvbGl2ZXJlbG9hZC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7SUFFTixjQUFjO1lBQWQsY0FBYzs7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OytCQUFkLGNBQWM7O1NBQ2xCLEtBQUssR0FBRyxJQUFJO1NBQ1osUUFBUSxHQUFHLElBQUk7U0FDZixRQUFRLEdBQUcsSUFBSTs7O2VBSFgsY0FBYzs7V0FLUixvQkFBQyxLQUFLLEVBQUU7Ozs7QUFFaEIsVUFBSSxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztBQUM3QyxVQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFBLEtBQUs7ZUFBSSxNQUFLLFdBQVcsQ0FBQyxLQUFLLENBQUM7T0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7QUFHbkYsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRXhELFVBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2QsVUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDbkI7OztXQUVLLGtCQUFHOztBQUVQLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUUsZ0JBQWdCLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFFLENBQUE7S0FDdkc7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCOzs7V0FFUSxxQkFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJO0FBQUUsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQUUsQ0FBQyxPQUFNLENBQUMsRUFBQyxFQUFFLENBQUM7QUFDakMsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjs7O1dBRVUscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFdBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDWixZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3ZDO0tBQ0Y7OztTQUVPLGFBQUMsSUFBSSxFQUFFO0FBQ2IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQztLQUNyRDtTQUVPLGVBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO0tBQ3BDOzs7U0FFTSxhQUFDLEdBQUcsRUFBRTtBQUNYLFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7S0FDbkM7U0FFTSxlQUFHO0FBQ1IsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7S0FDcEM7OztTQUVVLGFBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFFLENBQUM7S0FDNUQ7OztTQXBFRyxjQUFjO0dBQVMsY0FBYzs7cUJBdUU1QixRQUFRLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLEVBQUMsU0FBUyxFQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2xpdmVyZWxvYWQvbGliL2xpdmVyZWxvYWQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmNsYXNzIExpdmVyZWxvYWRWaWV3IGV4dGVuZHMgSFRNTERpdkVsZW1lbnQge1xuICBfbGluayA9IG51bGw7XG4gIF90b29sdGlwID0gbnVsbDtcbiAgX2NvbW1hbmQgPSBudWxsO1xuXG4gIGluaXRpYWxpemUoc3RhdGUpIHtcbiAgICAvLyBhZGQgY29udGVudFxuICAgIHRoaXMuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgZGF0YS11cmw+PC9hPic7XG4gICAgdGhpcy5maXJzdENoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5oYW5kbGVDbGljayhldmVudCksIGZhbHNlKTtcblxuICAgIC8vIGFkZCBjbGFzc2VzXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsaXZlcmVsb2FkLXN0YXR1cycsICdpbmxpbmUtYmxvY2snKTtcblxuICAgIHRoaXMudXJsID0gJyc7XG4gICAgdGhpcy50ZXh0ID0gJ09mZic7XG4gICAgdGhpcy50b29sdGlwID0gJyc7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgdGhpcy5fY29tbWFuZCA9IGF0b20uY29tbWFuZHMuYWRkKCAnYXRvbS13b3Jrc3BhY2UnLCB7ICdsaXZlcmVsb2FkOnRvZ2dsZSc6IHRoaXMudG9nZ2xlLmJpbmQodGhpcykgfSApXG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgdGhpcy5fdG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgdGhpcy5fY29tbWFuZC5kaXNwb3NlKCk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdHJ5IHsgdGhpcy5kZXRhY2goKSB9IGNhdGNoKGUpe307XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoJ3RvZ2dsZScpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMudXJsKSB7XG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZSh0aGlzLnVybCwgJ3VybCcpO1xuICAgIH1cbiAgfVxuXG4gIHNldCB0ZXh0KHRleHQpIHtcbiAgICB0aGlzLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSAnTGl2ZVJlbG9hZDogJyArIHRleHQ7XG4gIH1cblxuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkLnRleHRDb250ZW50O1xuICB9XG5cbiAgc2V0IHVybCh1cmwpIHtcbiAgICB0aGlzLmZpcnN0Q2hpbGQuZGF0YXNldC51cmwgPSB1cmw7XG4gIH1cblxuICBnZXQgdXJsKCkge1xuICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQuZGF0YXNldC51cmw7XG4gIH1cblxuICBzZXQgdG9vbHRpcCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMuX3Rvb2x0aXApIHRoaXMuX3Rvb2x0aXAuZGlzcG9zZSgpO1xuICAgIHRoaXMuX3Rvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCggdGhpcywgeyB0aXRsZTogdGV4dCB9ICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaXZlcmVsb2FkLXN0YXR1cy1iYXInLCB7cHJvdG90eXBlOkxpdmVyZWxvYWRWaWV3LnByb3RvdHlwZX0pO1xuIl19