Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key('directories').key());

var provider = {
  getFileExtensions: function getFileExtensions() {
    return null;
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.FOLDER;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'package.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9wYWNrYWdlL3BhY2thZ2UtanNvbi1kaXJlY3Rvcmllcy1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3dCQUU4QixnQkFBZ0I7O3FCQUNsQixhQUFhOztBQUh6QyxXQUFXLENBQUE7O0FBS1gsSUFBTSxPQUFPLEdBQUcsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTs7QUFFdkUsSUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBaUIsRUFBQSw2QkFBRztBQUNsQixXQUFPLElBQUksQ0FBQTtHQUNaOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLG1CQUFZLE1BQU0sQ0FBQTtHQUMxQjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLE9BQU8sQ0FBQTtHQUNmOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLGNBQWMsQ0FBQTtHQUN0QjtDQUNGLENBQUE7O3FCQUVjLFFBQVEiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL3BhY2thZ2UvcGFja2FnZS1qc29uLWRpcmVjdG9yaWVzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcmVxdWVzdCwgcGF0aCB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuaW1wb3J0IHsgU3RvcmFnZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgTUFUQ0hFUiA9IHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnZGlyZWN0b3JpZXMnKS5rZXkoKSlcblxuY29uc3QgcHJvdmlkZXIgPSB7XG4gIGdldEZpbGVFeHRlbnNpb25zKCkge1xuICAgIHJldHVybiBudWxsXG4gIH0sXG5cbiAgZ2V0U3RvcmFnZVR5cGUoKSB7XG4gICAgcmV0dXJuIFN0b3JhZ2VUeXBlLkZPTERFUlxuICB9LFxuXG4gIGdldE1hdGNoZXIoKSB7XG4gICAgcmV0dXJuIE1BVENIRVJcbiAgfSxcblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJ3BhY2thZ2UuanNvbidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm92aWRlclxuIl19