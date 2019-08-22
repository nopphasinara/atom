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

var _helperFormatJs = require('../helper/format.js');

'use babel';

var AddDialog = (function (_Dialog) {
  _inherits(AddDialog, _Dialog);

  function AddDialog(initialPath, isFile) {
    _classCallCheck(this, AddDialog);

    _get(Object.getPrototypeOf(AddDialog.prototype), 'constructor', this).call(this, {
      prompt: isFile ? 'Enter the path for the new file.' : 'Enter the path for the new folder.',
      initialPath: initialPath,
      select: false,
      iconClass: isFile ? 'icon-file-add' : 'icon-file-directory-create'
    });
    this.isCreatingFile = isFile;
  }

  _createClass(AddDialog, [{
    key: 'onConfirm',
    value: function onConfirm(relativePath) {
      // correct whitespaces and slashes
      relativePath = (0, _helperFormatJs.normalize)(relativePath);

      this.trigger('new-path', [relativePath]);
    }
  }]);

  return AddDialog;
})(_dialog2['default']);

exports['default'] = AddDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2FkZC1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7OEJBQ0gscUJBQXFCOztBQUgvQyxXQUFXLENBQUM7O0lBS1MsU0FBUztZQUFULFNBQVM7O0FBRWpCLFdBRlEsU0FBUyxDQUVoQixXQUFXLEVBQUUsTUFBTSxFQUFFOzBCQUZkLFNBQVM7O0FBRzFCLCtCQUhpQixTQUFTLDZDQUdwQjtBQUNKLFlBQU0sRUFBRSxNQUFNLEdBQUcsa0NBQWtDLEdBQUcsb0NBQW9DO0FBQzFGLGlCQUFXLEVBQVgsV0FBVztBQUNYLFlBQU0sRUFBRSxLQUFLO0FBQ2IsZUFBUyxFQUFFLE1BQU0sR0FBRyxlQUFlLEdBQUcsNEJBQTRCO0tBQ25FLEVBQUU7QUFDSCxRQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztHQUM5Qjs7ZUFWa0IsU0FBUzs7V0FZbkIsbUJBQUMsWUFBWSxFQUFFOztBQUV0QixrQkFBWSxHQUFHLCtCQUFVLFlBQVksQ0FBQyxDQUFDOztBQUV2QyxVQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDMUM7OztTQWpCa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2RpYWxvZ3MvYWRkLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJy4uL2hlbHBlci9mb3JtYXQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGREaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxQYXRoLCBpc0ZpbGUpIHtcbiAgICBzdXBlcih7XG4gICAgICBwcm9tcHQ6IGlzRmlsZSA/ICdFbnRlciB0aGUgcGF0aCBmb3IgdGhlIG5ldyBmaWxlLicgOiAnRW50ZXIgdGhlIHBhdGggZm9yIHRoZSBuZXcgZm9sZGVyLicsXG4gICAgICBpbml0aWFsUGF0aCxcbiAgICAgIHNlbGVjdDogZmFsc2UsXG4gICAgICBpY29uQ2xhc3M6IGlzRmlsZSA/ICdpY29uLWZpbGUtYWRkJyA6ICdpY29uLWZpbGUtZGlyZWN0b3J5LWNyZWF0ZScsXG4gICAgfSk7XG4gICAgdGhpcy5pc0NyZWF0aW5nRmlsZSA9IGlzRmlsZTtcbiAgfVxuXG4gIG9uQ29uZmlybShyZWxhdGl2ZVBhdGgpIHtcbiAgICAvLyBjb3JyZWN0IHdoaXRlc3BhY2VzIGFuZCBzbGFzaGVzXG4gICAgcmVsYXRpdmVQYXRoID0gbm9ybWFsaXplKHJlbGF0aXZlUGF0aCk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ25ldy1wYXRoJywgW3JlbGF0aXZlUGF0aF0pO1xuICB9XG59XG4iXX0=