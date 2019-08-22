'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SuggestionHelper = (function () {
  function SuggestionHelper() {
    _classCallCheck(this, SuggestionHelper);
  }

  _createClass(SuggestionHelper, null, [{
    key: 'append',
    value: function append(completions, suggestions) {
      completions.forEach(function (item) {
        var snippet = item.snippet;
        var displayText = item.displayText;
        var type = item.type;
        var description = item.description;
        var descriptionMoreURL = item.descriptionMoreURL;

        suggestions.push({
          snippet: snippet,
          displayText: displayText,
          type: type,
          description: description,
          descriptionMoreURL: descriptionMoreURL
        });
      });
    }
  }]);

  return SuggestionHelper;
})();

exports['default'] = SuggestionHelper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvU3VnZ2VzdGlvbkhlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7SUFFVSxnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBRXRCLGdCQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUU7QUFDdEMsaUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7WUFDckIsT0FBTyxHQUF3RCxJQUFJLENBQW5FLE9BQU87WUFBRSxXQUFXLEdBQTJDLElBQUksQ0FBMUQsV0FBVztZQUFFLElBQUksR0FBcUMsSUFBSSxDQUE3QyxJQUFJO1lBQUUsV0FBVyxHQUF3QixJQUFJLENBQXZDLFdBQVc7WUFBRSxrQkFBa0IsR0FBSSxJQUFJLENBQTFCLGtCQUFrQjs7QUFDbEUsbUJBQVcsQ0FBQyxJQUFJLENBQUM7QUFDZixpQkFBTyxFQUFFLE9BQU87QUFDaEIscUJBQVcsRUFBRSxXQUFXO0FBQ3hCLGNBQUksRUFBRSxJQUFJO0FBQ1YscUJBQVcsRUFBRSxXQUFXO0FBQ3hCLDRCQUFrQixFQUFFLGtCQUFrQjtTQUN2QyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1NBYmtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtc3FsL2xpYi9TdWdnZXN0aW9uSGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VnZ2VzdGlvbkhlbHBlciB7XG5cbiAgc3RhdGljIGFwcGVuZChjb21wbGV0aW9ucywgc3VnZ2VzdGlvbnMpIHtcbiAgICBjb21wbGV0aW9ucy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB7c25pcHBldCwgZGlzcGxheVRleHQsIHR5cGUsIGRlc2NyaXB0aW9uLCBkZXNjcmlwdGlvbk1vcmVVUkx9ID0gaXRlbVxuICAgICAgc3VnZ2VzdGlvbnMucHVzaCh7XG4gICAgICAgIHNuaXBwZXQ6IHNuaXBwZXQsXG4gICAgICAgIGRpc3BsYXlUZXh0OiBkaXNwbGF5VGV4dCxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6IGRlc2NyaXB0aW9uTW9yZVVSTFxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iXX0=