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

var RenameDialog = (function (_Dialog) {
  _inherits(RenameDialog, _Dialog);

  function RenameDialog(initialPath, isFile) {
    _classCallCheck(this, RenameDialog);

    _get(Object.getPrototypeOf(RenameDialog.prototype), 'constructor', this).call(this, {
      prompt: isFile ? 'Enter the new path for the file.' : 'Enter the new path for the directory.',
      initialPath: initialPath,
      select: true,
      iconClass: 'icon-arrow-right'
    });
    this.isCreatingFile = isFile;
  }

  _createClass(RenameDialog, [{
    key: 'onConfirm',
    value: function onConfirm(relativePath) {
      // correct whitespaces and slashes
      relativePath = (0, _helperFormatJs.normalize)(relativePath);

      this.trigger('new-path', [relativePath]);
    }
  }]);

  return RenameDialog;
})(_dialog2['default']);

exports['default'] = RenameDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL3JlbmFtZS1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7OEJBQ0gscUJBQXFCOztBQUgvQyxXQUFXLENBQUM7O0lBS1MsWUFBWTtZQUFaLFlBQVk7O0FBRXBCLFdBRlEsWUFBWSxDQUVuQixXQUFXLEVBQUUsTUFBTSxFQUFFOzBCQUZkLFlBQVk7O0FBRzdCLCtCQUhpQixZQUFZLDZDQUd2QjtBQUNKLFlBQU0sRUFBRSxNQUFNLEdBQUcsa0NBQWtDLEdBQUcsdUNBQXVDO0FBQzdGLGlCQUFXLEVBQVgsV0FBVztBQUNYLFlBQU0sRUFBRSxJQUFJO0FBQ1osZUFBUyxFQUFFLGtCQUFrQjtLQUM5QixFQUFFO0FBQ0gsUUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7R0FDOUI7O2VBVmtCLFlBQVk7O1dBWXRCLG1CQUFDLFlBQVksRUFBRTs7QUFFdEIsa0JBQVksR0FBRywrQkFBVSxZQUFZLENBQUMsQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQzFDOzs7U0FqQmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL3JlbmFtZS1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IERpYWxvZyBmcm9tICcuL2RpYWxvZyc7XG5pbXBvcnQgeyBub3JtYWxpemUgfSBmcm9tICcuLi9oZWxwZXIvZm9ybWF0LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuYW1lRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsUGF0aCwgaXNGaWxlKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcHJvbXB0OiBpc0ZpbGUgPyAnRW50ZXIgdGhlIG5ldyBwYXRoIGZvciB0aGUgZmlsZS4nIDogJ0VudGVyIHRoZSBuZXcgcGF0aCBmb3IgdGhlIGRpcmVjdG9yeS4nLFxuICAgICAgaW5pdGlhbFBhdGgsXG4gICAgICBzZWxlY3Q6IHRydWUsXG4gICAgICBpY29uQ2xhc3M6ICdpY29uLWFycm93LXJpZ2h0JyxcbiAgICB9KTtcbiAgICB0aGlzLmlzQ3JlYXRpbmdGaWxlID0gaXNGaWxlO1xuICB9XG5cbiAgb25Db25maXJtKHJlbGF0aXZlUGF0aCkge1xuICAgIC8vIGNvcnJlY3Qgd2hpdGVzcGFjZXMgYW5kIHNsYXNoZXNcbiAgICByZWxhdGl2ZVBhdGggPSBub3JtYWxpemUocmVsYXRpdmVQYXRoKTtcblxuICAgIHRoaXMudHJpZ2dlcignbmV3LXBhdGgnLCBbcmVsYXRpdmVQYXRoXSk7XG4gIH1cbn1cbiJdfQ==