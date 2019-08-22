Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _HandlerFactory = require('./HandlerFactory');

var _HandlerFactory2 = _interopRequireDefault(_HandlerFactory);

'use babel';

var Provider = (function () {
  function Provider(completions) {
    _classCallCheck(this, Provider);

    this.selector = '.source.sql';
    this.disableForSelector = '.source.sql .comment';
    this.filterSuggestions = true;
    this.completions = completions;
    this.contexts = [];
  }

  /**
   * A request options object will be passed to your getSuggestions function,
   * with the following properties: editor, bufferPosition, scopeDescriptor
   * prefix, activatedManually
   */

  _createClass(Provider, [{
    key: 'getSuggestions',
    value: function getSuggestions(request) {
      var _this = this;

      var editor = request.editor;
      var bufferPosition = request.bufferPosition;
      var scopeDescriptor = request.scopeDescriptor;
      var prefix = request.prefix;
      var activatedManually = request.activatedManually;

      var suggestions = [];
      return new Promise(function (resolve) {
        _HandlerFactory2['default'].create().perform({
          editor: editor, bufferPosition: bufferPosition,
          scopeDescriptor: scopeDescriptor, prefix: prefix,
          activatedManually: activatedManually, completions: _this.completions,
          suggestions: suggestions, contexts: _this.contexts
        });
        resolve(suggestions);
      });
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvUHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7O0FBRjdDLFdBQVcsQ0FBQTs7SUFJVSxRQUFRO0FBRWhCLFdBRlEsUUFBUSxDQUVmLFdBQVcsRUFBRTswQkFGTixRQUFROztBQUd6QixRQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQTtBQUM3QixRQUFJLENBQUMsa0JBQWtCLEdBQUcsc0JBQXNCLENBQUE7QUFDaEQsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtBQUM3QixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtHQUNuQjs7Ozs7Ozs7ZUFSa0IsUUFBUTs7V0FlYix3QkFBQyxPQUFPLEVBQUU7OztVQUNmLE1BQU0sR0FBZ0UsT0FBTyxDQUE3RSxNQUFNO1VBQUUsY0FBYyxHQUFnRCxPQUFPLENBQXJFLGNBQWM7VUFBRSxlQUFlLEdBQStCLE9BQU8sQ0FBckQsZUFBZTtVQUFFLE1BQU0sR0FBdUIsT0FBTyxDQUFwQyxNQUFNO1VBQUUsaUJBQWlCLEdBQUksT0FBTyxDQUE1QixpQkFBaUI7O0FBQ3pFLFVBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQTtBQUNwQixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLG9DQUFlLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUM5QixnQkFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsY0FBYztBQUM5Qyx5QkFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsTUFBTTtBQUNoRCwyQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsTUFBSyxXQUFXO0FBQ25FLHFCQUFXLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFLLFFBQVE7U0FDbEQsQ0FBQyxDQUFBO0FBQ0YsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ3JCLENBQUMsQ0FBQTtLQUNIOzs7U0EzQmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvUHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgSGFuZGxlckZhY3RvcnkgZnJvbSAnLi9IYW5kbGVyRmFjdG9yeSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXIge1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBsZXRpb25zKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLnNxbCdcbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLnNxbCAuY29tbWVudCdcbiAgICB0aGlzLmZpbHRlclN1Z2dlc3Rpb25zID0gdHJ1ZVxuICAgIHRoaXMuY29tcGxldGlvbnMgPSBjb21wbGV0aW9uc1xuICAgIHRoaXMuY29udGV4dHMgPSBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVxdWVzdCBvcHRpb25zIG9iamVjdCB3aWxsIGJlIHBhc3NlZCB0byB5b3VyIGdldFN1Z2dlc3Rpb25zIGZ1bmN0aW9uLFxuICAgKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yXG4gICAqIHByZWZpeCwgYWN0aXZhdGVkTWFudWFsbHlcbiAgICovXG4gIGdldFN1Z2dlc3Rpb25zKHJlcXVlc3QpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXgsIGFjdGl2YXRlZE1hbnVhbGx5fSA9IHJlcXVlc3RcbiAgICBsZXQgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgSGFuZGxlckZhY3RvcnkuY3JlYXRlKCkucGVyZm9ybSh7XG4gICAgICAgIGVkaXRvcjogZWRpdG9yLCBidWZmZXJQb3NpdGlvbjogYnVmZmVyUG9zaXRpb24sXG4gICAgICAgIHNjb3BlRGVzY3JpcHRvcjogc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgYWN0aXZhdGVkTWFudWFsbHk6IGFjdGl2YXRlZE1hbnVhbGx5LCBjb21wbGV0aW9uczogdGhpcy5jb21wbGV0aW9ucyxcbiAgICAgICAgc3VnZ2VzdGlvbnM6IHN1Z2dlc3Rpb25zLCBjb250ZXh0czogdGhpcy5jb250ZXh0c1xuICAgICAgfSlcbiAgICAgIHJlc29sdmUoc3VnZ2VzdGlvbnMpXG4gICAgfSlcbiAgfVxufVxuIl19