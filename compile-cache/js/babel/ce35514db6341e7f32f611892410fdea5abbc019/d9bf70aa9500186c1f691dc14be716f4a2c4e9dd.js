Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _uriJs = require('uri-js');

var _uriJs2 = _interopRequireDefault(_uriJs);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashMemoize = require('lodash/memoize');

var _lodashMemoize2 = _interopRequireDefault(_lodashMemoize);

var _lodashOmit = require('lodash/omit');

var _lodashOmit2 = _interopRequireDefault(_lodashOmit);

'use babel';

var loadFileSchema = function loadFileSchema(uri) {
  return new Promise(function (resolve, reject) {
    var path = _os2['default'].platform() === 'win32' ? (0, _lodashTrimStart2['default'])(uri.path, '/') : uri.path;
    _fs2['default'].readFile(path, 'UTF-8', /* TODO think about detecting this */function (error, data) {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
};

exports.loadFileSchema = loadFileSchema;
var loadHttpSchema = function loadHttpSchema(uri) {
  var url = _uriJs2['default'].serialize((0, _lodashOmit2['default'])(uri, ['fragment']));
  return _axios2['default'].get(url).then(function (response) {
    return response.data;
  });
};

exports.loadHttpSchema = loadHttpSchema;
var anySchemaLoader = function anySchemaLoader(uri) {
  switch (uri.scheme) {
    case 'file':
      return loadFileSchema(uri);
    case 'http':
      return loadHttpSchema(uri);
    default:
      throw new Error('Unknown URI format ' + JSON.stringify(uri));
  }
};

exports.anySchemaLoader = anySchemaLoader;
var loadSchema = (0, _lodashMemoize2['default'])(function (uri) {
  return anySchemaLoader(_uriJs2['default'].parse(uri));
});
exports.loadSchema = loadSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLWxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsSUFBSTs7OztrQkFDSixJQUFJOzs7O3FCQUNELFFBQVE7Ozs7cUJBQ1IsT0FBTzs7OzsrQkFDSCxrQkFBa0I7Ozs7NkJBQ3BCLGdCQUFnQjs7OzswQkFDbkIsYUFBYTs7OztBQVI5QixXQUFXLENBQUE7O0FBVUosSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFHLEdBQUc7U0FBSSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDcEUsUUFBTSxJQUFJLEdBQUcsZ0JBQUcsUUFBUSxFQUFFLEtBQUssT0FBTyxHQUFHLGtDQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtBQUM1RSxvQkFBRyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sdUNBQXVDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUMvRSxVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUNkLE1BQU07QUFDTCxZQUFJO0FBQ0YsaUJBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDMUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGdCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDVjtPQUNGO0tBQ0YsQ0FBQyxDQUFBO0dBQ0gsQ0FBQztDQUFBLENBQUE7OztBQUVLLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBRyxHQUFHLEVBQUk7QUFDbkMsTUFBTSxHQUFHLEdBQUcsbUJBQU0sU0FBUyxDQUFDLDZCQUFLLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwRCxTQUFPLG1CQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1dBQUksUUFBUSxDQUFDLElBQUk7R0FBQSxDQUFDLENBQUE7Q0FDdEQsQ0FBQTs7O0FBRU0sSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFHLEdBQUcsRUFBSTtBQUNwQyxVQUFRLEdBQUcsQ0FBQyxNQUFNO0FBQ2hCLFNBQUssTUFBTTtBQUFFLGFBQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQUEsQUFDdkMsU0FBSyxNQUFNO0FBQUUsYUFBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7QUFBQSxBQUN2QztBQUFTLFlBQU0sSUFBSSxLQUFLLHlCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFHLENBQUE7QUFBQSxHQUN0RTtDQUNGLENBQUE7OztBQUVNLElBQU0sVUFBVSxHQUFHLGdDQUFRLFVBQUEsR0FBRztTQUFJLGVBQWUsQ0FBQyxtQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FBQSxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHVyaUpzIGZyb20gJ3VyaS1qcydcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcbmltcG9ydCB0cmltU3RhcnQgZnJvbSAnbG9kYXNoL3RyaW1TdGFydCdcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC9tZW1vaXplJ1xuaW1wb3J0IG9taXQgZnJvbSAnbG9kYXNoL29taXQnXG5cbmV4cG9ydCBjb25zdCBsb2FkRmlsZVNjaGVtYSA9IHVyaSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIGNvbnN0IHBhdGggPSBvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInID8gdHJpbVN0YXJ0KHVyaS5wYXRoLCAnLycpIDogdXJpLnBhdGhcbiAgZnMucmVhZEZpbGUocGF0aCwgJ1VURi04JywgLyogVE9ETyB0aGluayBhYm91dCBkZXRlY3RpbmcgdGhpcyAqLyhlcnJvciwgZGF0YSkgPT4ge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn0pXG5cbmV4cG9ydCBjb25zdCBsb2FkSHR0cFNjaGVtYSA9IHVyaSA9PiB7XG4gIGNvbnN0IHVybCA9IHVyaUpzLnNlcmlhbGl6ZShvbWl0KHVyaSwgWydmcmFnbWVudCddKSlcbiAgcmV0dXJuIGF4aW9zLmdldCh1cmwpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuZGF0YSlcbn1cblxuZXhwb3J0IGNvbnN0IGFueVNjaGVtYUxvYWRlciA9IHVyaSA9PiB7XG4gIHN3aXRjaCAodXJpLnNjaGVtZSkge1xuICAgIGNhc2UgJ2ZpbGUnOiByZXR1cm4gbG9hZEZpbGVTY2hlbWEodXJpKVxuICAgIGNhc2UgJ2h0dHAnOiByZXR1cm4gbG9hZEh0dHBTY2hlbWEodXJpKVxuICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgVW5rbm93biBVUkkgZm9ybWF0ICR7SlNPTi5zdHJpbmdpZnkodXJpKX1gKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2FkU2NoZW1hID0gbWVtb2l6ZSh1cmkgPT4gYW55U2NoZW1hTG9hZGVyKHVyaUpzLnBhcnNlKHVyaSkpKVxuIl19