Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _Factory2 = require('./Factory');

var _Factory3 = _interopRequireDefault(_Factory2);

'use babel';

var ProviderFactory = (function (_Factory) {
  _inherits(ProviderFactory, _Factory);

  function ProviderFactory() {
    _classCallCheck(this, ProviderFactory);

    _get(Object.getPrototypeOf(ProviderFactory.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProviderFactory, null, [{
    key: 'create',
    value: function create() {
      var COMPLETIONS = require('./completions.json');
      var instance = _Factory3['default'].create(_Provider2['default'], COMPLETIONS);
      return instance;
    }
  }]);

  return ProviderFactory;
})(_Factory3['default']);

exports['default'] = ProviderFactory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvUHJvdmlkZXJGYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3dCQUVxQixZQUFZOzs7O3dCQUNiLFdBQVc7Ozs7QUFIL0IsV0FBVyxDQUFBOztJQUtVLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7O2VBQWYsZUFBZTs7V0FDckIsa0JBQUc7QUFDZCxVQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxVQUFJLFFBQVEsR0FBRyxxQkFBUSxNQUFNLHdCQUFXLFdBQVcsQ0FBQyxDQUFBO0FBQ3BELGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7U0FMa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtc3FsL2xpYi9Qcm92aWRlckZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgUHJvdmlkZXIgZnJvbSAnLi9Qcm92aWRlcidcbmltcG9ydCBGYWN0b3J5IGZyb20gJy4vRmFjdG9yeSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXJGYWN0b3J5IGV4dGVuZHMgRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGUoKSB7XG4gICAgY29uc3QgQ09NUExFVElPTlMgPSByZXF1aXJlKCcuL2NvbXBsZXRpb25zLmpzb24nKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBGYWN0b3J5LmNyZWF0ZShQcm92aWRlciwgQ09NUExFVElPTlMpXG4gICAgcmV0dXJuIGluc3RhbmNlXG4gIH1cbn1cbiJdfQ==