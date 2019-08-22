Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('man').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('man')));

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
    return 'package.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9wYWNrYWdlL3BhY2thZ2UtanNvbi1maWxlcy1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3dCQUVrQyxnQkFBZ0I7O3FCQUN0QixhQUFhOztBQUh6QyxXQUFXLENBQUE7O0FBS1gsSUFBTSxPQUFPLEdBQUcsa0JBQ2Qsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDbkQsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDakQsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDMUMsQ0FBQTs7QUFFRCxJQUFNLFFBQVEsR0FBRztBQUNmLG1CQUFpQixFQUFBLDZCQUFHO0FBQ2xCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sbUJBQVksSUFBSSxDQUFBO0dBQ3hCOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFdBQU8sT0FBTyxDQUFBO0dBQ2Y7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sY0FBYyxDQUFBO0dBQ3RCO0NBQ0YsQ0FBQTs7cUJBRWMsUUFBUSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvcGFja2FnZS9wYWNrYWdlLWpzb24tZmlsZXMtcHJvcG9zYWwtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyByZXF1ZXN0LCBwYXRoLCBvciB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuaW1wb3J0IHsgU3RvcmFnZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgTUFUQ0hFUiA9IG9yKFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2ZpbGVzJykuaW5kZXgoKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnbWFuJykuaW5kZXgoKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnbWFuJykpXG4pXG5cbmNvbnN0IHByb3ZpZGVyID0ge1xuICBnZXRGaWxlRXh0ZW5zaW9ucygpIHtcbiAgICByZXR1cm4gbnVsbCAvLyBhbnkgZmlsZSBpcyBPS1xuICB9LFxuXG4gIGdldFN0b3JhZ2VUeXBlKCkge1xuICAgIHJldHVybiBTdG9yYWdlVHlwZS5CT1RIXG4gIH0sXG5cbiAgZ2V0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gTUFUQ0hFUlxuICB9LFxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAncGFja2FnZS5qc29uJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByb3ZpZGVyXG4iXX0=