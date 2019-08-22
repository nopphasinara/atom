Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('ignore').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('ignore')), (0, _matchers.request)().value().path((0, _matchers.path)().key('main').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('main')));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return null; // any file is OK
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'bower.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9ib3dlci9ib3dlci1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7d0JBRWtDLGdCQUFnQjs7cUJBQ3RCLGFBQWE7O0FBSHpDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLE9BQU8sR0FBRyxrQkFDZCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNwRCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUM1Qyx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNsRCx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUMzQyxDQUFBOztBQUVELElBQU0sUUFBUSxHQUFHO0FBQ2YsbUJBQWlCLEVBQUEsNkJBQUc7QUFDbEIsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxtQkFBWSxJQUFJLENBQUE7R0FDeEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsV0FBTyxPQUFPLENBQUE7R0FDZjs7QUFFRCxnQkFBYyxFQUFBLDBCQUFHO0FBQ2YsV0FBTyxZQUFZLENBQUE7R0FDcEI7Q0FDRixDQUFBOztxQkFFYyxRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9ib3dlci9ib3dlci1qc29uLWZpbGVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcmVxdWVzdCwgcGF0aCwgb3IgfSBmcm9tICcuLi8uLi9tYXRjaGVycydcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmNvbnN0IE1BVENIRVIgPSBvcihcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdpZ25vcmUnKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdpZ25vcmUnKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnbWFpbicpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ21haW4nKSlcbilcblxuY29uc3QgcHJvdmlkZXIgPSB7XG4gIGdldEZpbGVFeHRlbnNpb25zKCkge1xuICAgIHJldHVybiBudWxsIC8vIGFueSBmaWxlIGlzIE9LXG4gIH0sXG5cbiAgZ2V0U3RvcmFnZVR5cGUoKSB7XG4gICAgcmV0dXJuIFN0b3JhZ2VUeXBlLkJPVEhcbiAgfSxcblxuICBnZXRNYXRjaGVyKCkge1xuICAgIHJldHVybiBNQVRDSEVSXG4gIH0sXG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICdib3dlci5qc29uJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByb3ZpZGVyXG4iXX0=