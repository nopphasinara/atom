Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Handler = require('./Handler');

var _Handler2 = _interopRequireDefault(_Handler);

var _Factory2 = require('./Factory');

var _Factory3 = _interopRequireDefault(_Factory2);

var _SimpleHandler = require('./SimpleHandler');

var _SimpleHandler2 = _interopRequireDefault(_SimpleHandler);

var _ContextHandler = require('./ContextHandler');

var _ContextHandler2 = _interopRequireDefault(_ContextHandler);

'use babel';

var HandlerFactory = (function (_Factory) {
  _inherits(HandlerFactory, _Factory);

  function HandlerFactory() {
    _classCallCheck(this, HandlerFactory);

    _get(Object.getPrototypeOf(HandlerFactory.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(HandlerFactory, null, [{
    key: 'create',
    value: function create() {
      var handler = new _SimpleHandler2['default']();
      var instance = _Factory3['default'].create(_ContextHandler2['default'], handler);
      return instance;
    }
  }]);

  return HandlerFactory;
})(_Factory3['default']);

exports['default'] = HandlerFactory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvSGFuZGxlckZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7dUJBRW9CLFdBQVc7Ozs7d0JBQ1gsV0FBVzs7Ozs2QkFDTCxpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7OztBQUw3QyxXQUFXLENBQUE7O0lBT1UsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQUNwQixrQkFBRztBQUNkLFVBQUksT0FBTyxHQUFHLGdDQUFtQixDQUFBO0FBQ2pDLFVBQUksUUFBUSxHQUFHLHFCQUFRLE1BQU0sOEJBQWlCLE9BQU8sQ0FBQyxDQUFBO0FBQ3RELGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7U0FMa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtc3FsL2xpYi9IYW5kbGVyRmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBIYW5kbGVyIGZyb20gJy4vSGFuZGxlcidcbmltcG9ydCBGYWN0b3J5IGZyb20gJy4vRmFjdG9yeSdcbmltcG9ydCBTaW1wbGVIYW5kbGVyIGZyb20gJy4vU2ltcGxlSGFuZGxlcidcbmltcG9ydCBDb250ZXh0SGFuZGxlciBmcm9tICcuL0NvbnRleHRIYW5kbGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIYW5kbGVyRmFjdG9yeSBleHRlbmRzIEZhY3Rvcnkge1xuICBzdGF0aWMgY3JlYXRlKCkge1xuICAgIGxldCBoYW5kbGVyID0gbmV3IFNpbXBsZUhhbmRsZXIoKVxuICAgIGxldCBpbnN0YW5jZSA9IEZhY3RvcnkuY3JlYXRlKENvbnRleHRIYW5kbGVyLCBoYW5kbGVyKVxuICAgIHJldHVybiBpbnN0YW5jZVxuICB9XG59XG4iXX0=