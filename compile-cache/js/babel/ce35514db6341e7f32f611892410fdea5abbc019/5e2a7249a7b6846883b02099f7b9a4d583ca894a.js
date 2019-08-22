'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EditorView = (function () {
  function EditorView(editor, onCloseCallback) {
    _classCallCheck(this, EditorView);

    var html = '\n    <div class="ajc__editor__close">x</div>\n    ';
    this.element = document.createElement('div');
    this.element.classList.add('ajc__editor');
    this.element.innerHTML = html;

    this.element.querySelector('.ajc__editor__close').addEventListener('click', onCloseCallback);

    // Append editor element
    this.editorElement = atom.views.getView(editor);
    this.element.appendChild(this.editorElement);
  }

  _createClass(EditorView, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return EditorView;
})();

exports['default'] = EditorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9FZGl0b3JWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7OztJQUVVLFVBQVU7QUFFbEIsV0FGUSxVQUFVLENBRWpCLE1BQU0sRUFBRSxlQUFlLEVBQUU7MEJBRmxCLFVBQVU7O0FBRzNCLFFBQU0sSUFBSSx3REFFVCxDQUFBO0FBQ0QsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7O0FBRTdCLFFBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFBOzs7QUFHNUYsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQyxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDN0M7O2VBZmtCLFVBQVU7O1dBaUJuQixzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1NBbkJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F0b20tanMtY29uc29sZS9saWIvRWRpdG9yVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvclZpZXcge1xuXG4gIGNvbnN0cnVjdG9yKGVkaXRvciwgb25DbG9zZUNhbGxiYWNrKSB7XG4gICAgY29uc3QgaHRtbCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwiYWpjX19lZGl0b3JfX2Nsb3NlXCI+eDwvZGl2PlxuICAgIGBcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhamNfX2VkaXRvcicpXG4gICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGh0bWxcblxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYWpjX19lZGl0b3JfX2Nsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQ2FsbGJhY2spXG5cbiAgICAvLyBBcHBlbmQgZWRpdG9yIGVsZW1lbnRcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVkaXRvckVsZW1lbnQpXG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRcbiAgfVxuXG59XG4iXX0=