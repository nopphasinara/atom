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

var _SuggestionHelper = require('./SuggestionHelper');

var _SuggestionHelper2 = _interopRequireDefault(_SuggestionHelper);

/**
 * knows how to perform the operations associated with carrying out a request.
 */
'use babel';

var SimpleHandler = (function (_Handler) {
  _inherits(SimpleHandler, _Handler);

  function SimpleHandler() {
    _classCallCheck(this, SimpleHandler);

    _get(Object.getPrototypeOf(SimpleHandler.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SimpleHandler, [{
    key: 'perform',

    /* TODO limit the scope of suggestions using the current contexts.
     * Determine whether or not to delegate to the successor.
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

      completions.simple.forEach(function (item) {
        suggestions.push({
          snippet: item,
          displayText: item,
          type: 'keyword',
          description: item,
          descriptionMoreURL: 'http://web.cecs.pdx.edu/~len/sql1999.pdf'
        });
      });
    }
  }]);

  return SimpleHandler;
})(_Handler3['default']);

exports['default'] = SimpleHandler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvU2ltcGxlSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt3QkFFb0IsV0FBVzs7OztnQ0FDRixvQkFBb0I7Ozs7Ozs7QUFIakQsV0FBVyxDQUFBOztJQVFVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7Ozs7O1dBS3pCLGlCQUFDLE9BQU8sRUFBRTtVQUViLE1BQU0sR0FFSixPQUFPLENBRlQsTUFBTTtVQUFFLGNBQWMsR0FFcEIsT0FBTyxDQUZELGNBQWM7VUFBRSxlQUFlLEdBRXJDLE9BQU8sQ0FGZSxlQUFlO1VBQUUsTUFBTSxHQUU3QyxPQUFPLENBRmdDLE1BQU07VUFDL0MsaUJBQWlCLEdBQ2YsT0FBTyxDQURULGlCQUFpQjtVQUFFLFdBQVcsR0FDNUIsT0FBTyxDQURVLFdBQVc7VUFBRSxXQUFXLEdBQ3pDLE9BQU8sQ0FEdUIsV0FBVztVQUFFLFFBQVEsR0FDbkQsT0FBTyxDQURvQyxRQUFROztBQUV2RCxpQkFBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkMsbUJBQVcsQ0FBQyxJQUFJLENBQUM7QUFDZixpQkFBTyxFQUFFLElBQUk7QUFDYixxQkFBVyxFQUFFLElBQUk7QUFDakIsY0FBSSxFQUFFLFNBQVM7QUFDZixxQkFBVyxFQUFFLElBQUk7QUFDakIsNEJBQWtCLEVBQUUsMENBQTBDO1NBQy9ELENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7U0FuQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvU2ltcGxlSGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBIYW5kbGVyIGZyb20gJy4vSGFuZGxlcidcbmltcG9ydCBTdWdnZXN0aW9uSGVscGVyIGZyb20gJy4vU3VnZ2VzdGlvbkhlbHBlcidcblxuLyoqXG4gKiBrbm93cyBob3cgdG8gcGVyZm9ybSB0aGUgb3BlcmF0aW9ucyBhc3NvY2lhdGVkIHdpdGggY2Fycnlpbmcgb3V0IGEgcmVxdWVzdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlSGFuZGxlciBleHRlbmRzIEhhbmRsZXIge1xuXG4gIC8qIFRPRE8gbGltaXQgdGhlIHNjb3BlIG9mIHN1Z2dlc3Rpb25zIHVzaW5nIHRoZSBjdXJyZW50IGNvbnRleHRzLlxuICAgKiBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gZGVsZWdhdGUgdG8gdGhlIHN1Y2Nlc3Nvci5cbiAgICovXG4gIHBlcmZvcm0ocmVxdWVzdCkge1xuICAgIGxldCB7XG4gICAgICBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeCxcbiAgICAgIGFjdGl2YXRlZE1hbnVhbGx5LCBjb21wbGV0aW9ucywgc3VnZ2VzdGlvbnMsIGNvbnRleHRzXG4gICAgfSA9IHJlcXVlc3RcbiAgICBjb21wbGV0aW9ucy5zaW1wbGUuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgc3VnZ2VzdGlvbnMucHVzaCh7XG4gICAgICAgIHNuaXBwZXQ6IGl0ZW0sXG4gICAgICAgIGRpc3BsYXlUZXh0OiBpdGVtLFxuICAgICAgICB0eXBlOiAna2V5d29yZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBpdGVtLFxuICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6ICdodHRwOi8vd2ViLmNlY3MucGR4LmVkdS9+bGVuL3NxbDE5OTkucGRmJ1xuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iXX0=