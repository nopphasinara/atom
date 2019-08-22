Object.defineProperty(exports, '__esModule', {
  value: true
});

var _matchers = require('../../matchers');

var _utils = require('../../utils');

'use babel';

var MATCHER = (0, _matchers.or)((0, _matchers.request)().value().path((0, _matchers.path)().key('autoload').key('classmap').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload').key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload-dev').key('classmap').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('autoload-dev').key('files').index()), (0, _matchers.request)().value().path((0, _matchers.path)().key('include-path').index()));

var provider = {
  getFileExtensions: function getFileExtensions() {
    return ['.php'];
  },

  getStorageType: function getStorageType() {
    return _utils.StorageType.BOTH;
  },

  getMatcher: function getMatcher() {
    return MATCHER;
  },

  getFilePattern: function getFilePattern() {
    return 'composer.json';
  }
};

exports['default'] = provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9jb21wb3Nlci9jb21wb3Nlci1qc29uLXBocC1maWxlLW9yLWZvbGRlci1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3dCQUVrQyxnQkFBZ0I7O3FCQUN0QixhQUFhOztBQUh6QyxXQUFXLENBQUE7O0FBS1gsSUFBTSxPQUFPLEdBQUcsa0JBQ2Qsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ3RFLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNuRSx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDMUUsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ3ZFLHdCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQzNELENBQUE7O0FBRUQsSUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBaUIsRUFBQSw2QkFBRztBQUNsQixXQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDaEI7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sbUJBQVksSUFBSSxDQUFBO0dBQ3hCOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFdBQU8sT0FBTyxDQUFBO0dBQ2Y7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sZUFBZSxDQUFBO0dBQ3ZCO0NBQ0YsQ0FBQTs7cUJBRWMsUUFBUSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvY29tcG9zZXIvY29tcG9zZXItanNvbi1waHAtZmlsZS1vci1mb2xkZXItcHJvcG9zYWwtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyByZXF1ZXN0LCBwYXRoLCBvciB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuaW1wb3J0IHsgU3RvcmFnZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgTUFUQ0hFUiA9IG9yKFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2F1dG9sb2FkJykua2V5KCdjbGFzc21hcCcpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2F1dG9sb2FkJykua2V5KCdmaWxlcycpLmluZGV4KCkpLFxuICByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoJ2F1dG9sb2FkLWRldicpLmtleSgnY2xhc3NtYXAnKS5pbmRleCgpKSxcbiAgcmVxdWVzdCgpLnZhbHVlKCkucGF0aChwYXRoKCkua2V5KCdhdXRvbG9hZC1kZXYnKS5rZXkoJ2ZpbGVzJykuaW5kZXgoKSksXG4gIHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleSgnaW5jbHVkZS1wYXRoJykuaW5kZXgoKSlcbilcblxuY29uc3QgcHJvdmlkZXIgPSB7XG4gIGdldEZpbGVFeHRlbnNpb25zKCkge1xuICAgIHJldHVybiBbJy5waHAnXVxuICB9LFxuXG4gIGdldFN0b3JhZ2VUeXBlKCkge1xuICAgIHJldHVybiBTdG9yYWdlVHlwZS5CT1RIXG4gIH0sXG5cbiAgZ2V0TWF0Y2hlcigpIHtcbiAgICByZXR1cm4gTUFUQ0hFUlxuICB9LFxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAnY29tcG9zZXIuanNvbidcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm92aWRlclxuIl19