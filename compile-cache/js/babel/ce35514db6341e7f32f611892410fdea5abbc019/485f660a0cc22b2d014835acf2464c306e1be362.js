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

var DuplicateDialog = (function (_Dialog) {
  _inherits(DuplicateDialog, _Dialog);

  function DuplicateDialog(initialPath) {
    _classCallCheck(this, DuplicateDialog);

    _get(Object.getPrototypeOf(DuplicateDialog.prototype), 'constructor', this).call(this, {
      prompt: 'Enter the new path for the duplicate.',
      initialPath: initialPath,
      select: true,
      iconClass: 'icon-arrow-right'
    });
  }

  _createClass(DuplicateDialog, [{
    key: 'onConfirm',
    value: function onConfirm(relativePath) {
      // correct whitespaces and slashes
      relativePath = (0, _helperFormatJs.normalize)(relativePath);

      this.trigger('new-path', [relativePath]);
    }
  }]);

  return DuplicateDialog;
})(_dialog2['default']);

exports['default'] = DuplicateDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9kaWFsb2dzL2R1cGxpY2F0ZS1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7OEJBQ0gscUJBQXFCOztBQUgvQyxXQUFXLENBQUM7O0lBS1MsZUFBZTtZQUFmLGVBQWU7O0FBRXZCLFdBRlEsZUFBZSxDQUV0QixXQUFXLEVBQUU7MEJBRk4sZUFBZTs7QUFHaEMsK0JBSGlCLGVBQWUsNkNBRzFCO0FBQ0osWUFBTSxFQUFFLHVDQUF1QztBQUMvQyxpQkFBVyxFQUFYLFdBQVc7QUFDWCxZQUFNLEVBQUUsSUFBSTtBQUNaLGVBQVMsRUFBRSxrQkFBa0I7S0FDOUIsRUFBRTtHQUNKOztlQVRrQixlQUFlOztXQVd6QixtQkFBQyxZQUFZLEVBQUU7O0FBRXRCLGtCQUFZLEdBQUcsK0JBQVUsWUFBWSxDQUFDLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUMxQzs7O1NBaEJrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvZGlhbG9ncy9kdXBsaWNhdGUtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9kaWFsb2cnO1xuaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnLi4vaGVscGVyL2Zvcm1hdC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIER1cGxpY2F0ZURpYWxvZyBleHRlbmRzIERpYWxvZyB7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFBhdGgpIHtcbiAgICBzdXBlcih7XG4gICAgICBwcm9tcHQ6ICdFbnRlciB0aGUgbmV3IHBhdGggZm9yIHRoZSBkdXBsaWNhdGUuJyxcbiAgICAgIGluaXRpYWxQYXRoLFxuICAgICAgc2VsZWN0OiB0cnVlLFxuICAgICAgaWNvbkNsYXNzOiAnaWNvbi1hcnJvdy1yaWdodCcsXG4gICAgfSk7XG4gIH1cblxuICBvbkNvbmZpcm0ocmVsYXRpdmVQYXRoKSB7XG4gICAgLy8gY29ycmVjdCB3aGl0ZXNwYWNlcyBhbmQgc2xhc2hlc1xuICAgIHJlbGF0aXZlUGF0aCA9IG5vcm1hbGl6ZShyZWxhdGl2ZVBhdGgpO1xuXG4gICAgdGhpcy50cmlnZ2VyKCduZXctcGF0aCcsIFtyZWxhdGl2ZVBhdGhdKTtcbiAgfVxufVxuIl19