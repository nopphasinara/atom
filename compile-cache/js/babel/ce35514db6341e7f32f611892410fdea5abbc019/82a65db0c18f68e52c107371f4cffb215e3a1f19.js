Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('exclude').index()));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return ['.ts', '.tsx'];
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'tsconfig.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy90c2NvbmZpZy90c2NvbmZpZy1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7d0JBRWtDLGdCQUFnQjs7cUJBQ3RCLGFBQWE7O0FBSHpDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLE9BQU8sR0FBRyxrQkFDZCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNuRCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUN0RCxDQUFBOztBQUVELElBQU0sUUFBUSxHQUFHO0FBQ2YsbUJBQWlCLEVBQUEsNkJBQUc7QUFDbEIsV0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtHQUN2Qjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxtQkFBWSxJQUFJLENBQUE7R0FDeEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsV0FBTyxPQUFPLENBQUE7R0FDZjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxlQUFlLENBQUE7R0FDdkI7Q0FDRixDQUFBOztxQkFFYyxRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy90c2NvbmZpZy90c2NvbmZpZy1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcmVxdWVzdCwgcGF0aCwgb3IgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmNvbnN0IE1BVENIRVIgPSBvcihcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdmaWxlcycpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2V4Y2x1ZGUnKS5pbmRleCgpKVxuKVxuXG5jb25zdCBwcm92aWRlciA9IHtcbiAgZ2V0RmlsZUV4dGVuc2lvbnMoKSB7XG4gICAgcmV0dXJuIFsnLnRzJywgJy50c3gnXVxuICB9LFxuXG4gIGdldFN0b3JhZ2VUeXBlKCkge1xuICAgIHJldHVybiBTdG9yYWdlVHlwZS5CT1RIXG4gIH0sXG5cbiAgZ2V0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gTUFUQ0hFUlxuICB9LFxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAndHNjb25maWcuanNvbidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm92aWRlclxuIl19