Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.provideLinter = provideLinter;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _jsonlint = require('jsonlint');

var jsonlint = _interopRequireWildcard(_jsonlint);

'use babel';

var regex = '.+?line\\s(\\d+)';

function activate() {
  require('atom-package-deps').install('linter-jsonlint');
}

function provideLinter() {
  return {
    name: 'JSON Lint',
    grammarScopes: ['source.json'],
    scope: 'file',
    lintsOnChange: true,
    lint: function lint(editor) {
      var path = editor.getPath();
      var text = editor.getText();

      try {
        jsonlint.parse(text);
      } catch (error) {
        var message = error.message;

        var line = Number(message.match(regex)[1]);
        var column = 0;

        return Promise.resolve([{
          severity: 'error',
          excerpt: message,
          location: {
            file: path,
            position: new _atom.Range([line, column], [line, column + 1])
          }
        }]);
      }

      return Promise.resolve([]);
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGludGVyLWpzb25saW50L2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUdzQixNQUFNOzt3QkFDRixVQUFVOztJQUF4QixRQUFROztBQUpwQixXQUFXLENBQUM7O0FBTVosSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7O0FBRTFCLFNBQVMsUUFBUSxHQUFHO0FBQ3pCLFNBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0NBQ3pEOztBQUVNLFNBQVMsYUFBYSxHQUFHO0FBQzlCLFNBQU87QUFDTCxRQUFJLEVBQUUsV0FBVztBQUNqQixpQkFBYSxFQUFFLENBQUMsYUFBYSxDQUFDO0FBQzlCLFNBQUssRUFBRSxNQUFNO0FBQ2IsaUJBQWEsRUFBRSxJQUFJO0FBQ25CLFFBQUksRUFBRSxjQUFDLE1BQU0sRUFBSztBQUNoQixVQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5QixVQUFJO0FBQ0YsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsQ0FBQyxPQUFPLEtBQUssRUFBRTtZQUNOLE9BQU8sR0FBSyxLQUFLLENBQWpCLE9BQU87O0FBQ2YsWUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxZQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWpCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RCLGtCQUFRLEVBQUUsT0FBTztBQUNqQixpQkFBTyxFQUFFLE9BQU87QUFDaEIsa0JBQVEsRUFBRTtBQUNSLGdCQUFJLEVBQUUsSUFBSTtBQUNWLG9CQUFRLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1dBQ3hEO1NBQ0YsQ0FBQyxDQUFDLENBQUM7T0FDTDs7QUFFRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBSYW5nZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0ICogYXMganNvbmxpbnQgZnJvbSAnanNvbmxpbnQnO1xuXG5jb25zdCByZWdleCA9ICcuKz9saW5lXFxcXHMoXFxcXGQrKSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItanNvbmxpbnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVMaW50ZXIoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0pTT04gTGludCcsXG4gICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanNvbiddLFxuICAgIHNjb3BlOiAnZmlsZScsXG4gICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBqc29ubGludC5wYXJzZSh0ZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gZXJyb3I7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBOdW1iZXIobWVzc2FnZS5tYXRjaChyZWdleClbMV0pO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSAwO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW3tcbiAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICBleGNlcnB0OiBtZXNzYWdlLFxuICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBmaWxlOiBwYXRoLFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBSYW5nZShbbGluZSwgY29sdW1uXSwgW2xpbmUsIGNvbHVtbiArIDFdKVxuICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG4gIH07XG59XG4iXX0=