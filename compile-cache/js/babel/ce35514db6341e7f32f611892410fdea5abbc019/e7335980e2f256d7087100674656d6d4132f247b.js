function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var provider = {
  providerName: 'hyperclick-markdown',
  getSuggestionForWord: function getSuggestionForWord(textEditor, _text, range) {
    if (textEditor.getGrammar().name !== 'GitHub Markdown') {
      return;
    }

    var lineRange = (0, _utils.getFullLineRange)(range);
    var text = textEditor.getTextInBufferRange(lineRange);

    var highlightRange = (0, _utils.getHighlight)(text, range);
    var result = text.slice(highlightRange.start.column, highlightRange.end.column);

    var isWeb = result.indexOf('http') === 0;
    var isLocalPath = result[0] === '/' || result[0] === '.';
    var isWebWithoutProtocol = !isWeb && !isLocalPath && (result.indexOf('.') !== -1 || result.indexOf('localhost') === 0);

    if (!isWeb && !isLocalPath && !isWebWithoutProtocol) {
      return;
    }

    return {
      range: range,
      callback: function callback() {
        var filePath = undefined;

        if (isWeb) {
          _shell2['default'].openExternal(result);
          return;
        }

        if (isWebWithoutProtocol) {
          _shell2['default'].openExternal('http://' + result);
          return;
        }

        if (result.indexOf('/') === 0) {
          filePath = atom.project.getPaths()[0] + result;
        } else {
          filePath = _path2['default'].normalize(_path2['default'].dirname(textEditor.getPath()) + '/' + result);
        }

        _fs2['default'].stat(filePath, function (err, stat) {
          if (err) {
            var detail = 'Path: "' + filePath + '"\nError: "' + err.code + '"';
            atom.notifications.addInfo('Hyperclick provider demo', { detail: detail });

            return;
          }

          atom.workspace.open(filePath);
        });
      }
    };
  }
};

module.exports = {
  getProvider: function getProvider() {
    return provider;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvaHlwZXJjbGljay1tYXJrZG93bi9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztxQkFHK0MsU0FBUzs7a0JBQ3pDLElBQUk7Ozs7cUJBQ0QsT0FBTzs7OztvQkFDUixNQUFNOzs7O0FBTnZCLFdBQVcsQ0FBQzs7QUFRWixJQUFNLFFBQVEsR0FBRztBQUNmLGNBQVksRUFBRSxxQkFBcUI7QUFDbkMsc0JBQW9CLEVBQUEsOEJBQUMsVUFBc0IsRUFBRSxLQUFhLEVBQUUsS0FBWSxFQUF3QjtBQUM5RixRQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLEVBQUU7QUFDdEQsYUFBTztLQUNSOztBQUVELFFBQU0sU0FBUyxHQUFHLDZCQUFpQixLQUFLLENBQUMsQ0FBQztBQUMxQyxRQUFNLElBQUksR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXhELFFBQU0sY0FBYyxHQUFHLHlCQUFhLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRCxRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxGLFFBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLFFBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUMzRCxRQUFNLG9CQUFvQixHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUEsQUFBQyxDQUFDOztBQUV6SCxRQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7QUFDbkQsYUFBTztLQUNSOztBQUVELFdBQU87QUFDTCxXQUFLLEVBQUwsS0FBSztBQUNMLGNBQVEsRUFBQSxvQkFBRztBQUNULFlBQUksUUFBUSxZQUFBLENBQUM7O0FBRWIsWUFBSSxLQUFLLEVBQUU7QUFDVCw2QkFBTSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsaUJBQU87U0FDUjs7QUFFRCxZQUFJLG9CQUFvQixFQUFFO0FBQ3hCLDZCQUFNLFlBQVksYUFBVyxNQUFNLENBQUcsQ0FBQztBQUN2QyxpQkFBTztTQUNSOztBQUVELFlBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0Isa0JBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztTQUNoRCxNQUFNO0FBQ0wsa0JBQVEsR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztTQUM5RTs7QUFFRCx3QkFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBSztBQUMvQixjQUFJLEdBQUcsRUFBRTtBQUNQLGdCQUFNLE1BQU0sZUFBYSxRQUFRLG1CQUFjLEdBQUcsQ0FBQyxJQUFJLE1BQUcsQ0FBQztBQUMzRCxnQkFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFbkUsbUJBQU87V0FDUjs7QUFFRCxjQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMvQixDQUFDLENBQUM7T0FDSjtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLGFBQVcsRUFBQSx1QkFBRztBQUNaLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0NBQ0YsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2h5cGVyY2xpY2stbWFya2Rvd24vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGdldEhpZ2hsaWdodCwgZ2V0RnVsbExpbmVSYW5nZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcHJvdmlkZXIgPSB7XG4gIHByb3ZpZGVyTmFtZTogJ2h5cGVyY2xpY2stbWFya2Rvd24nLFxuICBnZXRTdWdnZXN0aW9uRm9yV29yZCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBfdGV4dDogc3RyaW5nLCByYW5nZTogUmFuZ2UpOiBIeXBlcmNsaWNrU3VnZ2VzdGlvbiB7XG4gICAgaWYgKHRleHRFZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUgIT09ICdHaXRIdWIgTWFya2Rvd24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGluZVJhbmdlID0gZ2V0RnVsbExpbmVSYW5nZShyYW5nZSk7XG4gICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UobGluZVJhbmdlKTtcblxuICAgIGNvbnN0IGhpZ2hsaWdodFJhbmdlID0gZ2V0SGlnaGxpZ2h0KHRleHQsIHJhbmdlKTtcbiAgICBjb25zdCByZXN1bHQgPSB0ZXh0LnNsaWNlKGhpZ2hsaWdodFJhbmdlLnN0YXJ0LmNvbHVtbiwgaGlnaGxpZ2h0UmFuZ2UuZW5kLmNvbHVtbik7XG5cbiAgICBjb25zdCBpc1dlYiA9IHJlc3VsdC5pbmRleE9mKCdodHRwJykgPT09IDA7XG4gICAgY29uc3QgaXNMb2NhbFBhdGggPSByZXN1bHRbMF0gPT09ICcvJyB8fCByZXN1bHRbMF0gPT09ICcuJztcbiAgICBjb25zdCBpc1dlYldpdGhvdXRQcm90b2NvbCA9ICFpc1dlYiAmJiAhaXNMb2NhbFBhdGggJiYgKHJlc3VsdC5pbmRleE9mKCcuJykgIT09IC0xIHx8IHJlc3VsdC5pbmRleE9mKCdsb2NhbGhvc3QnKSA9PT0gMCk7XG5cbiAgICBpZiAoIWlzV2ViICYmICFpc0xvY2FsUGF0aCAmJiAhaXNXZWJXaXRob3V0UHJvdG9jb2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2UsXG4gICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgbGV0IGZpbGVQYXRoO1xuXG4gICAgICAgIGlmIChpc1dlYikge1xuICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChyZXN1bHQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1dlYldpdGhvdXRQcm90b2NvbCkge1xuICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChgaHR0cDovLyR7cmVzdWx0fWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZignLycpID09PSAwKSB7XG4gICAgICAgICAgZmlsZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSArIHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKHBhdGguZGlybmFtZSh0ZXh0RWRpdG9yLmdldFBhdGgoKSkgKyAnLycgKyByZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGBQYXRoOiBcIiR7ZmlsZVBhdGh9XCJcXG5FcnJvcjogXCIke2Vyci5jb2RlfVwiYDtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdIeXBlcmNsaWNrIHByb3ZpZGVyIGRlbW8nLCB7IGRldGFpbCB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9XG59O1xuIl19