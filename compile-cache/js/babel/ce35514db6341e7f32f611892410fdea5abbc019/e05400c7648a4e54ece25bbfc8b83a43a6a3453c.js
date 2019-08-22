'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AutocompleteJavascriptView = (function () {
  function AutocompleteJavascriptView(serializedState) {
    _classCallCheck(this, AutocompleteJavascriptView);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('autocomplete-javascript');

    // Create message element
    var message = document.createElement('div');
    message.textContent = 'The AutocompleteJavascript package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated

  _createClass(AutocompleteJavascriptView, [{
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return AutocompleteJavascriptView;
})();

exports['default'] = AutocompleteJavascriptView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmFzY3JpcHQvbGliL2F1dG9jb21wbGV0ZS1qYXZhc2NyaXB0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsMEJBQTBCO0FBRWxDLFdBRlEsMEJBQTBCLENBRWpDLGVBQWUsRUFBRTswQkFGViwwQkFBMEI7OztBQUkzQyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7OztBQUd0RCxRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLFdBQU8sQ0FBQyxXQUFXLEdBQUcsMkRBQTJELENBQUM7QUFDbEYsV0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDbkM7Ozs7ZUFaa0IsMEJBQTBCOztXQWVwQyxxQkFBRyxFQUFFOzs7OztXQUdQLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7OztTQXhCa0IsMEJBQTBCOzs7cUJBQTFCLDBCQUEwQiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhc2NyaXB0L2xpYi9hdXRvY29tcGxldGUtamF2YXNjcmlwdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9jb21wbGV0ZUphdmFzY3JpcHRWaWV3IHtcblxuICBjb25zdHJ1Y3RvcihzZXJpYWxpemVkU3RhdGUpIHtcbiAgICAvLyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2F1dG9jb21wbGV0ZS1qYXZhc2NyaXB0Jyk7XG5cbiAgICAvLyBDcmVhdGUgbWVzc2FnZSBlbGVtZW50XG4gICAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnVGhlIEF1dG9jb21wbGV0ZUphdmFzY3JpcHQgcGFja2FnZSBpcyBBbGl2ZSEgSXRcXCdzIEFMSVZFISc7XG4gICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplKCkge31cblxuICAvLyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxufVxuIl19