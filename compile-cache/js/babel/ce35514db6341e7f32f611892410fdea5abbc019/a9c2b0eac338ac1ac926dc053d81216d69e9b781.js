Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProvider = getProvider;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*global atom */

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

'use babel';

var linkRegexp = /@import (?:"([^"]+)"|'([^"]+)')/;

var getRange = function getRange(textEditor, range) {
  var searchStart = [range.start.row, 0];
  var searchEnd = [range.end.row + 1, 0];
  var searchRange = [searchStart, searchEnd];

  var linkRange = null;
  var linkedFile = null;

  textEditor.scanInBufferRange(linkRegexp, searchRange, function (found) {
    linkedFile = found.match[1] || found.match[2];
    linkRange = found.range;
    found.stop();
  });
  return {
    linkedFile: linkedFile,
    linkRange: linkRange
  };
};

function getProvider() {
  return {
    priority: 1,
    grammarScopes: ['source.css', 'source.css.scss'],
    getSuggestionForWord: function getSuggestionForWord(textEditor, text, range) {
      var _getRange = getRange(textEditor, range);

      var linkRange = _getRange.linkRange;
      var linkedFile = _getRange.linkedFile;

      if (linkRange && linkedFile) {
        return {
          range: linkRange,
          callback: function callback() {
            var _path$parse = _path2["default"].parse(textEditor.getPath());

            var dir = _path$parse.dir;
            var ext = _path$parse.ext;

            var _path$parse2 = _path2["default"].parse(linkedFile);

            var linkedFileExt = _path$parse2.ext;

            var filepath = _path2["default"].join(dir, linkedFile + (linkedFileExt ? '' : ext));
            if (_fs2["default"].existsSync(filepath)) {
              filepath = _fs2["default"].realpathSync(filepath);
            }
            atom.workspace.open(filepath);
          }
        };
      }
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvY3NzLWh5cGVyY2xpY2svbGliL2Nzcy1oeXBlcmNsaWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztrQkFJZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7QUFMdkIsV0FBVyxDQUFBOztBQVdYLElBQU0sVUFBVSxHQUFHLGlDQUFpQyxDQUFBOztBQUVwRCxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxVQUFVLEVBQUUsS0FBSyxFQUFLO0FBQ3ZDLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUE7O0FBRTVDLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNuQixNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUE7O0FBRXRCLFlBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlELGNBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0MsYUFBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7QUFDdkIsU0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ2QsQ0FBQyxDQUFBO0FBQ0YsU0FBTztBQUNKLGNBQVUsRUFBVixVQUFVO0FBQ1YsYUFBUyxFQUFULFNBQVM7R0FDVixDQUFBO0NBQ0YsQ0FBQTs7QUFFTSxTQUFTLFdBQVcsR0FBRztBQUM1QixTQUFPO0FBQ0wsWUFBUSxFQUFFLENBQUM7QUFDWCxpQkFBYSxFQUFFLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDO0FBQ2hELHdCQUFvQixFQUFBLDhCQUNsQixVQUFzQixFQUN0QixJQUFZLEVBQ1osS0FBWSxFQUNXO3NCQUNTLFFBQVEsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDOztVQUFwRCxTQUFTLGFBQVQsU0FBUztVQUFFLFVBQVUsYUFBVixVQUFVOztBQUM1QixVQUFHLFNBQVMsSUFBSSxVQUFVLEVBQUU7QUFDMUIsZUFBTztBQUNMLGVBQUssRUFBRSxTQUFTO0FBQ2hCLGtCQUFRLEVBQUEsb0JBQUc7OEJBQ0Usa0JBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7Z0JBQTVDLEdBQUcsZUFBSCxHQUFHO2dCQUFFLEdBQUcsZUFBSCxHQUFHOzsrQkFDZ0Isa0JBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQzs7Z0JBQXhDLGFBQWEsZ0JBQWxCLEdBQUc7O0FBQ1QsZ0JBQUksUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxJQUFJLGFBQWEsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQyxDQUFBO0FBQ2hFLGdCQUFJLGdCQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMzQixzQkFBUSxHQUFHLGdCQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTthQUNyQztBQUNELGdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUM5QjtTQUNGLENBQUE7T0FDRjtLQUNGO0dBQ0YsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvY3NzLWh5cGVyY2xpY2svbGliL2Nzcy1oeXBlcmNsaWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qZ2xvYmFsIGF0b20gKi9cbi8vIEBmbG93XG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHR5cGUgeyBIeXBlcmNsaWNrU3VnZ2VzdGlvbiB9IGZyb20gJ2F0b20taWRlLXVpJ1xuXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgdHlwZSB7IFJhbmdlIH0gZnJvbSBcIi4vdHlwZXNcIlxuXG5jb25zdCBsaW5rUmVnZXhwID0gL0BpbXBvcnQgKD86XCIoW15cIl0rKVwifCcoW15cIl0rKScpL1xuXG5jb25zdCBnZXRSYW5nZSA9ICh0ZXh0RWRpdG9yLCByYW5nZSkgPT4ge1xuXHRjb25zdCBzZWFyY2hTdGFydCA9IFtyYW5nZS5zdGFydC5yb3csIDBdXG5cdGNvbnN0IHNlYXJjaEVuZCA9IFtyYW5nZS5lbmQucm93ICsgMSwgMF1cblx0Y29uc3Qgc2VhcmNoUmFuZ2UgPSBbc2VhcmNoU3RhcnQsIHNlYXJjaEVuZF1cblxuXHRsZXQgbGlua1JhbmdlID0gbnVsbFxuICBsZXQgbGlua2VkRmlsZSA9IG51bGxcblxuXHR0ZXh0RWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlKGxpbmtSZWdleHAsIHNlYXJjaFJhbmdlLCAoZm91bmQpID0+IHtcbiAgICBsaW5rZWRGaWxlID0gZm91bmQubWF0Y2hbMV0gfHwgZm91bmQubWF0Y2hbMl1cbiAgICBsaW5rUmFuZ2UgPSBmb3VuZC5yYW5nZVxuICAgIGZvdW5kLnN0b3AoKVxuXHR9KVxuXHRyZXR1cm4ge1xuICAgIGxpbmtlZEZpbGUsXG4gICAgbGlua1JhbmdlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3ZpZGVyKCkge1xuICByZXR1cm4ge1xuICAgIHByaW9yaXR5OiAxLFxuICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmNzcycsICdzb3VyY2UuY3NzLnNjc3MnXSxcbiAgICBnZXRTdWdnZXN0aW9uRm9yV29yZChcbiAgICAgIHRleHRFZGl0b3I6IFRleHRFZGl0b3IsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICByYW5nZTogUmFuZ2VcbiAgICApOiA/SHlwZXJjbGlja1N1Z2dlc3Rpb24ge1xuICAgICAgY29uc3Qge2xpbmtSYW5nZSwgbGlua2VkRmlsZX0gPSBnZXRSYW5nZSh0ZXh0RWRpdG9yLCByYW5nZSlcbiAgICAgIGlmKGxpbmtSYW5nZSAmJiBsaW5rZWRGaWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmFuZ2U6IGxpbmtSYW5nZSxcbiAgICAgICAgICBjYWxsYmFjaygpIHtcblx0XHRcdFx0XHRcdGxldCB7ZGlyLCBleHR9ID0gcGF0aC5wYXJzZSh0ZXh0RWRpdG9yLmdldFBhdGgoKSlcblx0XHRcdFx0XHRcdGxldCB7IGV4dDogbGlua2VkRmlsZUV4dCB9ID0gcGF0aC5wYXJzZShsaW5rZWRGaWxlKVxuXHRcdFx0XHRcdFx0bGV0IGZpbGVwYXRoID0gcGF0aC5qb2luKGRpciwgbGlua2VkRmlsZSArIChsaW5rZWRGaWxlRXh0ID8gJycgOiBleHQpKVxuICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgICAgICAgIGZpbGVwYXRoID0gZnMucmVhbHBhdGhTeW5jKGZpbGVwYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlcGF0aClcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuIl19