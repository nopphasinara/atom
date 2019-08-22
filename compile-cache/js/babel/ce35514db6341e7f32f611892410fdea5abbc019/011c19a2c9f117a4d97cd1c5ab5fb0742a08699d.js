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

var FindDialog = (function (_Dialog) {
  _inherits(FindDialog, _Dialog);

  function FindDialog(initialPath, isFile) {
    _classCallCheck(this, FindDialog);

    _get(Object.getPrototypeOf(FindDialog.prototype), 'constructor', this).call(this, {
      prompt: 'Enter the path for the folder.',
      initialPath: initialPath,
      select: false,
      iconClass: 'icon-search'
    });
    this.isCreatingFile = isFile;
  }

  _createClass(FindDialog, [{
    key: 'onConfirm',
    value: function onConfirm(relativePath) {
      // correct whitespaces and slashes
      relativePath = (0, _helperFormatJs.normalize)(relativePath);

      this.trigger('find-path', [relativePath]);
    }
  }]);

  return FindDialog;
})(_dialog2['default']);

exports['default'] = FindDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2ZpbmQtZGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixVQUFVOzs7OzhCQUNILHFCQUFxQjs7QUFIL0MsV0FBVyxDQUFDOztJQUtTLFVBQVU7WUFBVixVQUFVOztBQUVsQixXQUZRLFVBQVUsQ0FFakIsV0FBVyxFQUFFLE1BQU0sRUFBRTswQkFGZCxVQUFVOztBQUczQiwrQkFIaUIsVUFBVSw2Q0FHckI7QUFDSixZQUFNLEVBQUUsZ0NBQWdDO0FBQ3hDLGlCQUFXLEVBQVgsV0FBVztBQUNYLFlBQU0sRUFBRSxLQUFLO0FBQ2IsZUFBUyxFQUFFLGFBQWE7S0FDekIsRUFBRTtBQUNILFFBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO0dBQzlCOztlQVZrQixVQUFVOztXQVlwQixtQkFBQyxZQUFZLEVBQUU7O0FBRXRCLGtCQUFZLEdBQUcsK0JBQVUsWUFBWSxDQUFDLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUMzQzs7O1NBakJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvZGlhbG9ncy9maW5kLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJy4uL2hlbHBlci9mb3JtYXQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaW5kRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsUGF0aCwgaXNGaWxlKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcHJvbXB0OiAnRW50ZXIgdGhlIHBhdGggZm9yIHRoZSBmb2xkZXIuJyxcbiAgICAgIGluaXRpYWxQYXRoLFxuICAgICAgc2VsZWN0OiBmYWxzZSxcbiAgICAgIGljb25DbGFzczogJ2ljb24tc2VhcmNoJyxcbiAgICB9KTtcbiAgICB0aGlzLmlzQ3JlYXRpbmdGaWxlID0gaXNGaWxlO1xuICB9XG5cbiAgb25Db25maXJtKHJlbGF0aXZlUGF0aCkge1xuICAgIC8vIGNvcnJlY3Qgd2hpdGVzcGFjZXMgYW5kIHNsYXNoZXNcbiAgICByZWxhdGl2ZVBhdGggPSBub3JtYWxpemUocmVsYXRpdmVQYXRoKTtcblxuICAgIHRoaXMudHJpZ2dlcignZmluZC1wYXRoJywgW3JlbGF0aXZlUGF0aF0pO1xuICB9XG59XG4iXX0=