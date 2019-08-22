Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _npmPackageLookup = require('npm-package-lookup');

var _matchers = require('../../matchers');

'use babel';

var DEPENDENCY_PROPERTIES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
var KEY_MATCHER = (0, _matchers.request)().key().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES));
var VALUE_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(DEPENDENCY_PROPERTIES).key());

exports['default'] = {
  versions: function versions(name) {
    return (0, _npmPackageLookup.versions)(name, { sort: 'DESC', stable: true });
  },

  search: function search(prefix) {
    return (0, _npmPackageLookup.search)(prefix).then(function (results) {
      return results.map(function (name) {
        return { name: name };
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
    return 'package.json';
  },

  isAvailable: function isAvailable() {
    return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9wYWNrYWdlL3BhY2thZ2UtanNvbi1kZXBlbmRlbmN5LWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs0QkFFbUIsZUFBZTs7OztnQ0FDRCxvQkFBb0I7O3dCQUV2QixnQkFBZ0I7O0FBTDlDLFdBQVcsQ0FBQTs7QUFPWCxJQUFNLHFCQUFxQixHQUFHLENBQUMsY0FBYyxFQUFFLGlCQUFpQixFQUFFLHNCQUFzQixFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDN0csSUFBTSxXQUFXLEdBQUcsd0JBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBO0FBQzNFLElBQU0sYUFBYSxHQUFHLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTs7cUJBRXRFO0FBQ2IsVUFBUSxFQUFBLGtCQUFDLElBQUksRUFBRTtBQUNiLFdBQU8sZ0NBQVMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtHQUN0RDs7QUFFRCxRQUFNLEVBQUEsZ0JBQUMsTUFBTSxFQUFFO0FBQ2IsV0FBTyw4QkFBTyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO2FBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7ZUFBSyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUU7T0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0dBQ3ZFOztBQUVELDBCQUF3QixFQUFBLG9DQUFHO0FBQ3pCLFdBQU8sV0FBVyxDQUFBO0dBQ25COztBQUVELHVCQUFxQixFQUFBLGlDQUFHO0FBQ3RCLFdBQU8sYUFBYSxDQUFBO0dBQ3JCOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLGNBQWMsQ0FBQTtHQUN0Qjs7QUFFRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELHFCQUFtQixFQUFBLDZCQUFDLEdBQUcsRUFBRTtRQUNoQixRQUFRLEdBQUksR0FBRyxDQUFmLFFBQVE7O0FBQ2YsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQU87ZUFBTSxJQUFJO09BQUEsQ0FBQTtLQUNsQjtBQUNELFFBQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7YUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtLQUFBLENBQUMsQ0FBQTtBQUN2RSxRQUFNLE1BQU0sR0FBRyw4REFBVSxPQUFPLEVBQUMsSUFBSSxFQUFFLENBQUE7QUFDdkMsV0FBTyxVQUFBLFVBQVU7YUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO0tBQUEsQ0FBQTtHQUN4RDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9wYWNrYWdlL3BhY2thZ2UtanNvbi1kZXBlbmRlbmN5LWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoL2Fzc2lnbidcbmltcG9ydCB7IHNlYXJjaCwgdmVyc2lvbnMgfSBmcm9tICducG0tcGFja2FnZS1sb29rdXAnXG5cbmltcG9ydCB7IHBhdGgsIHJlcXVlc3QgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcblxuY29uc3QgREVQRU5ERU5DWV9QUk9QRVJUSUVTID0gWydkZXBlbmRlbmNpZXMnLCAnZGV2RGVwZW5kZW5jaWVzJywgJ29wdGlvbmFsRGVwZW5kZW5jaWVzJywgJ3BlZXJEZXBlbmRlbmNpZXMnXVxuY29uc3QgS0VZX01BVENIRVIgPSByZXF1ZXN0KCkua2V5KCkucGF0aChwYXRoKCkua2V5KERFUEVOREVOQ1lfUFJPUEVSVElFUykpXG5jb25zdCBWQUxVRV9NQVRDSEVSID0gcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KERFUEVOREVOQ1lfUFJPUEVSVElFUykua2V5KCkpXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdmVyc2lvbnMobmFtZSkge1xuICAgIHJldHVybiB2ZXJzaW9ucyhuYW1lLCB7IHNvcnQ6ICdERVNDJywgc3RhYmxlOiB0cnVlIH0pXG4gIH0sXG5cbiAgc2VhcmNoKHByZWZpeCkge1xuICAgIHJldHVybiBzZWFyY2gocHJlZml4KS50aGVuKHJlc3VsdHMgPT4gcmVzdWx0cy5tYXAobmFtZSA9PiAoeyBuYW1lIH0pKSlcbiAgfSxcblxuICBkZXBlbmRlbmN5UmVxdWVzdE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIEtFWV9NQVRDSEVSXG4gIH0sXG5cbiAgdmVyc2lvblJlcXVlc3RNYXRjaGVyKCkge1xuICAgIHJldHVybiBWQUxVRV9NQVRDSEVSXG4gIH0sXG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICdwYWNrYWdlLmpzb24nXG4gIH0sXG5cbiAgaXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgZ2V0RGVwZW5kZW5jeUZpbHRlcihyZXEpIHtcbiAgICBjb25zdCB7Y29udGVudHN9ID0gcmVxXG4gICAgaWYgKCFjb250ZW50cykge1xuICAgICAgcmV0dXJuICgpID0+IHRydWVcbiAgICB9XG4gICAgY29uc3Qgb2JqZWN0cyA9IERFUEVOREVOQ1lfUFJPUEVSVElFUy5tYXAocHJvcCA9PiBjb250ZW50c1twcm9wXSB8fCB7fSlcbiAgICBjb25zdCBtZXJnZWQgPSBhc3NpZ24oLi4ub2JqZWN0cykgfHwge31cbiAgICByZXR1cm4gZGVwZW5kZW5jeSA9PiAhbWVyZ2VkLmhhc093blByb3BlcnR5KGRlcGVuZGVuY3kpXG4gIH1cbn1cbiJdfQ==