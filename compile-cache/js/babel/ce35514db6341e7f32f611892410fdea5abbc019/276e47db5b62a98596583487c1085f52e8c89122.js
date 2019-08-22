Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Handler2 = require('./Handler');

var _Handler3 = _interopRequireDefault(_Handler2);

/**
 * knows how to perform the operations associated with carrying out a request.
 */
'use babel';

var ContextHandler = (function (_Handler) {
  _inherits(ContextHandler, _Handler);

  function ContextHandler() {
    _classCallCheck(this, ContextHandler);

    _get(Object.getPrototypeOf(ContextHandler.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ContextHandler, [{
    key: 'perform',

    /* TODO Determine and set the contexts based on Current Multi-Line Buffer
     */
    value: function perform(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;
      var scopeDescriptor = request.scopeDescriptor;
      var prefix = request.prefix;
      var activatedManually = request.activatedManually;
      var completions = request.completions;
      var suggestions = request.suggestions;
      var contexts = request.contexts;

      this.delegate(request);
    }
  }]);

  return ContextHandler;
})(_Handler3['default']);

exports['default'] = ContextHandler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvQ29udGV4dEhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBRW9CLFdBQVc7Ozs7Ozs7QUFGL0IsV0FBVyxDQUFBOztJQU9VLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7O2VBQWQsY0FBYzs7Ozs7V0FJMUIsaUJBQUMsT0FBTyxFQUFFO1VBRWIsTUFBTSxHQUVKLE9BQU8sQ0FGVCxNQUFNO1VBQUUsY0FBYyxHQUVwQixPQUFPLENBRkQsY0FBYztVQUFFLGVBQWUsR0FFckMsT0FBTyxDQUZlLGVBQWU7VUFBRSxNQUFNLEdBRTdDLE9BQU8sQ0FGZ0MsTUFBTTtVQUMvQyxpQkFBaUIsR0FDZixPQUFPLENBRFQsaUJBQWlCO1VBQUUsV0FBVyxHQUM1QixPQUFPLENBRFUsV0FBVztVQUFFLFdBQVcsR0FDekMsT0FBTyxDQUR1QixXQUFXO1VBQUUsUUFBUSxHQUNuRCxPQUFPLENBRG9DLFFBQVE7O0FBRXZELFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdkI7OztTQVZrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1zcWwvbGliL0NvbnRleHRIYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IEhhbmRsZXIgZnJvbSAnLi9IYW5kbGVyJ1xuXG4vKipcbiAqIGtub3dzIGhvdyB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb25zIGFzc29jaWF0ZWQgd2l0aCBjYXJyeWluZyBvdXQgYSByZXF1ZXN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0SGFuZGxlciBleHRlbmRzIEhhbmRsZXIge1xuXG4gIC8qIFRPRE8gRGV0ZXJtaW5lIGFuZCBzZXQgdGhlIGNvbnRleHRzIGJhc2VkIG9uIEN1cnJlbnQgTXVsdGktTGluZSBCdWZmZXJcbiAgICovXG4gIHBlcmZvcm0ocmVxdWVzdCkge1xuICAgIGxldCB7XG4gICAgICBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeCxcbiAgICAgIGFjdGl2YXRlZE1hbnVhbGx5LCBjb21wbGV0aW9ucywgc3VnZ2VzdGlvbnMsIGNvbnRleHRzXG4gICAgfSA9IHJlcXVlc3RcbiAgICB0aGlzLmRlbGVnYXRlKHJlcXVlc3QpXG4gIH1cbn1cbiJdfQ==