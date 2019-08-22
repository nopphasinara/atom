'use babel';

/**
 * knows how to perform the operations associated with carrying out a request.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Handler = (function () {
  function Handler(successor) {
    _classCallCheck(this, Handler);

    this.successor = successor;
  }

  _createClass(Handler, [{
    key: 'perform',
    value: function perform(request) {}
  }, {
    key: 'delegate',
    value: function delegate(request) {
      if (this.successor instanceof Handler) {
        this.successor.perform(request);
      }
    }
  }]);

  return Handler;
})();

exports['default'] = Handler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7SUFLVSxPQUFPO0FBRWYsV0FGUSxPQUFPLENBRWQsU0FBUyxFQUFFOzBCQUZKLE9BQU87O0FBR3hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0dBQzNCOztlQUprQixPQUFPOztXQUtuQixpQkFBQyxPQUFPLEVBQUUsRUFDaEI7OztXQUNPLGtCQUFDLE9BQU8sRUFBRTtBQUNoQixVQUFJLElBQUksQ0FBQyxTQUFTLFlBQVksT0FBTyxFQUFFO0FBQ3JDLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7OztTQVhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1zcWwvbGliL0hhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vKipcbiAqIGtub3dzIGhvdyB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb25zIGFzc29jaWF0ZWQgd2l0aCBjYXJyeWluZyBvdXQgYSByZXF1ZXN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIYW5kbGVyIHtcblxuICBjb25zdHJ1Y3RvcihzdWNjZXNzb3IpIHtcbiAgICB0aGlzLnN1Y2Nlc3NvciA9IHN1Y2Nlc3NvclxuICB9XG4gIHBlcmZvcm0ocmVxdWVzdCkge1xuICB9XG4gIGRlbGVnYXRlKHJlcXVlc3QpIHtcbiAgICBpZiAodGhpcy5zdWNjZXNzb3IgaW5zdGFuY2VvZiBIYW5kbGVyKSB7XG4gICAgICB0aGlzLnN1Y2Nlc3Nvci5wZXJmb3JtKHJlcXVlc3QpXG4gICAgfVxuICB9XG59XG4iXX0=