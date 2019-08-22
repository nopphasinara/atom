'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Console = (function () {
  function Console() {
    _classCallCheck(this, Console);

    var html = '\n    <div class="stdout"></div>\n    <div class="output"></div>\n    <div class="error"></div>\n    <div class="executionTime"></div>\n    ';
    this.element = document.createElement('div');
    this.element.classList.add('js-console');
    this.element.innerHTML = html;

    this.panel = atom.workspace.addBottomPanel({
      item: this.element,
      visible: false
    });
  }

  _createClass(Console, [{
    key: 'show',
    value: function show() {
      this.panel.show();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'render',
    value: function render(_ref) {
      var code = _ref.code;
      var output = _ref.output;
      var error = _ref.error;
      var stdout = _ref.stdout;
      var executionTime = _ref.executionTime;

      this.show();
      this.element.querySelector('.stdout').innerHTML = stdout.join('<br/>');
      this.element.querySelector('.output').textContent = output;
      this.element.querySelector('.error').textContent = error;
      this.element.querySelector('.executionTime').textContent = '(executed in ' + executionTime + ' ms)';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.modalPanel.destroy();
    }
  }]);

  return Console;
})();

exports['default'] = Console;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9Db25zb2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQUVTLE9BQU87QUFFZixXQUZRLE9BQU8sR0FFWjswQkFGSyxPQUFPOztBQUd4QixRQUFNLElBQUksaUpBS1QsQ0FBQTtBQUNELFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBOztBQUU3QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0FBQ3pDLFVBQUksRUFBRSxJQUFJLENBQUMsT0FBTztBQUNsQixhQUFPLEVBQUUsS0FBSztLQUNmLENBQUMsQ0FBQTtHQUNIOztlQWpCa0IsT0FBTzs7V0FtQnRCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUNsQjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ2xCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDckI7OztXQUVLLGdCQUFDLElBQThDLEVBQUU7VUFBOUMsSUFBSSxHQUFOLElBQThDLENBQTVDLElBQUk7VUFBRSxNQUFNLEdBQWQsSUFBOEMsQ0FBdEMsTUFBTTtVQUFFLEtBQUssR0FBckIsSUFBOEMsQ0FBOUIsS0FBSztVQUFFLE1BQU0sR0FBN0IsSUFBOEMsQ0FBdkIsTUFBTTtVQUFFLGFBQWEsR0FBNUMsSUFBOEMsQ0FBZixhQUFhOztBQUNqRCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDWCxVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN0RSxVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEdBQUksTUFBTSxDQUFBO0FBQzNELFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxXQUFXLHFCQUFtQixhQUFhLFNBQU0sQ0FBQTtLQUMvRjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzFCOzs7U0F6Q2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9Db25zb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnNvbGUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IGh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInN0ZG91dFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJvdXRwdXRcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZXJyb3JcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZXhlY3V0aW9uVGltZVwiPjwvZGl2PlxuICAgIGBcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdqcy1jb25zb2xlJylcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFxuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5wYW5lbC5zaG93KClcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxuXG4gIHJlbmRlcih7IGNvZGUsIG91dHB1dCwgZXJyb3IsIHN0ZG91dCwgZXhlY3V0aW9uVGltZSB9KSB7XG4gICAgdGhpcy5zaG93KClcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN0ZG91dCcpLmlubmVySFRNTCA9IHN0ZG91dC5qb2luKCc8YnIvPicpXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdXRwdXQnKS50ZXh0Q29udGVudCA9ICBvdXRwdXRcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmVycm9yJykudGV4dENvbnRlbnQgPSBlcnJvclxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZXhlY3V0aW9uVGltZScpLnRleHRDb250ZW50ID0gYChleGVjdXRlZCBpbiAke2V4ZWN1dGlvblRpbWV9IG1zKWBcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5tb2RhbFBhbmVsLmRlc3Ryb3koKVxuICB9XG5cbn1cbiJdfQ==