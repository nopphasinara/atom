Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _matchers = require('../../matchers');

var _packagistPackageLookup = require('packagist-package-lookup');

'use babel';

var DEPENDENCY_PROPERTIES = ['require', 'require-dev'];

var KEY_MATCHER = (0, _matchers.request)().key().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES));
var VALUE_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES).key());

exports['default'] = {
  search: _packagistPackageLookup.searchByName,
  versions: function versions(name) {
    return (0, _packagistPackageLookup.versions)(name, { sort: 'DESC', stable: true }).then(function (vers) {
      return vers.map(function (v) {
        return (0, _lodashTrimStart2['default'])(v, 'v');
      });
    });
  },
  dependencyRequestMatcher: function dependencyRequestMatcher() {
    return KEY_MATCHER;
  },
  versionRequestMatcher: function versionRequestMatcher() {
    return VALUE_MATCHER;
  },
  getFilePattern: function getFilePattern() {
    return 'composer.json';
  },
  getDependencyFilter: function getDependencyFilter(req) {
    var contents = req.contents;

    if (!contents) {
      return function () {
        return true;
      };
    }
    var objects = DEPENDENCY_PROPERTIES.map(function (prop) {
      return contents[prop] || {};
    });
    var merged = _lodashAssign2['default'].apply(undefined, _toConsumableArray(objects)) || {};
    return function (dependency) {
      return !merged.hasOwnProperty(dependency);
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9jb21wb3Nlci9jb21wb3Nlci1qc29uLWRlcGVuZGVuY3ktY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzRCQUVtQixlQUFlOzs7OytCQUNaLGtCQUFrQjs7Ozt3QkFFVixnQkFBZ0I7O3NDQUVQLDBCQUEwQjs7QUFQakUsV0FBVyxDQUFBOztBQVNYLElBQU0scUJBQXFCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUE7O0FBRXhELElBQU0sV0FBVyxHQUFHLHdCQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQTtBQUMzRSxJQUFNLGFBQWEsR0FBRyx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7O3FCQUV0RTtBQUNiLFFBQU0sc0NBQWM7QUFDcEIsVUFBUSxFQUFBLGtCQUFDLElBQUksRUFBRTtBQUNiLFdBQU8sc0NBQVMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2FBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7ZUFBSSxrQ0FBVSxDQUFDLEVBQUUsR0FBRyxDQUFDO09BQUEsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUNyRztBQUNELDBCQUF3QixFQUFBLG9DQUFHO0FBQ3pCLFdBQU8sV0FBVyxDQUFBO0dBQ25CO0FBQ0QsdUJBQXFCLEVBQUEsaUNBQUc7QUFDdEIsV0FBTyxhQUFhLENBQUE7R0FDckI7QUFDRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxlQUFlLENBQUE7R0FDdkI7QUFDRCxxQkFBbUIsRUFBQSw2QkFBQyxHQUFHLEVBQUU7UUFDaEIsUUFBUSxHQUFJLEdBQUcsQ0FBZixRQUFROztBQUNmLFFBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFPO2VBQU0sSUFBSTtPQUFBLENBQUE7S0FDbEI7QUFDRCxRQUFNLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2FBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7S0FBQSxDQUFDLENBQUE7QUFDdkUsUUFBTSxNQUFNLEdBQUcsOERBQVUsT0FBTyxFQUFDLElBQUksRUFBRSxDQUFBO0FBQ3ZDLFdBQU8sVUFBQSxVQUFVO2FBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztLQUFBLENBQUE7R0FDeEQ7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvY29tcG9zZXIvY29tcG9zZXItanNvbi1kZXBlbmRlbmN5LWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoL2Fzc2lnbidcbmltcG9ydCB0cmltU3RhcnQgZnJvbSAnbG9kYXNoL3RyaW1TdGFydCdcblxuaW1wb3J0IHsgcGF0aCwgcmVxdWVzdCB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuXG5pbXBvcnQgeyBzZWFyY2hCeU5hbWUsIHZlcnNpb25zIH0gZnJvbSAncGFja2FnaXN0LXBhY2thZ2UtbG9va3VwJ1xuXG5jb25zdCBERVBFTkRFTkNZX1BST1BFUlRJRVMgPSBbJ3JlcXVpcmUnLCAncmVxdWlyZS1kZXYnXVxuXG5jb25zdCBLRVlfTUFUQ0hFUiA9IHJlcXVlc3QoKS5rZXkoKS5wYXRoKHBhdGgoKS5rZXkoREVQRU5ERU5DWV9QUk9QRVJUSUVTKSlcbmNvbnN0IFZBTFVFX01BVENIRVIgPSByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoREVQRU5ERU5DWV9QUk9QRVJUSUVTKS5rZXkoKSlcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzZWFyY2g6IHNlYXJjaEJ5TmFtZSxcbiAgdmVyc2lvbnMobmFtZSkge1xuICAgIHJldHVybiB2ZXJzaW9ucyhuYW1lLCB7IHNvcnQ6ICdERVNDJywgc3RhYmxlOiB0cnVlIH0pLnRoZW4odmVycyA9PiB2ZXJzLm1hcCh2ID0+IHRyaW1TdGFydCh2LCAndicpKSlcbiAgfSxcbiAgZGVwZW5kZW5jeVJlcXVlc3RNYXRjaGVyKCkge1xuICAgIHJldHVybiBLRVlfTUFUQ0hFUlxuICB9LFxuICB2ZXJzaW9uUmVxdWVzdE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIFZBTFVFX01BVENIRVJcbiAgfSxcbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICdjb21wb3Nlci5qc29uJ1xuICB9LFxuICBnZXREZXBlbmRlbmN5RmlsdGVyKHJlcSkge1xuICAgIGNvbnN0IHtjb250ZW50c30gPSByZXFcbiAgICBpZiAoIWNvbnRlbnRzKSB7XG4gICAgICByZXR1cm4gKCkgPT4gdHJ1ZVxuICAgIH1cbiAgICBjb25zdCBvYmplY3RzID0gREVQRU5ERU5DWV9QUk9QRVJUSUVTLm1hcChwcm9wID0+IGNvbnRlbnRzW3Byb3BdIHx8IHt9KVxuICAgIGNvbnN0IG1lcmdlZCA9IGFzc2lnbiguLi5vYmplY3RzKSB8fCB7fVxuICAgIHJldHVybiBkZXBlbmRlbmN5ID0+ICFtZXJnZWQuaGFzT3duUHJvcGVydHkoZGVwZW5kZW5jeSlcbiAgfVxufVxuIl19