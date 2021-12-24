Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

//import {autobind} from 'core-decorators';

'use babel';

var StyleCalculator = (function () {
  function StyleCalculator(styles, config) {
    _classCallCheck(this, StyleCalculator);

    this.styles = styles;
    this.config = config;
  }

  _createClass(StyleCalculator, [{
    key: 'startWatching',
    value: function startWatching(sourcePath, configsToWatch, getStylesheetFn) {
      var _this = this;

      var subscriptions = new _atom.CompositeDisposable();
      var updateStyles = function updateStyles() {
        _this.updateStyles(sourcePath, getStylesheetFn);
      };
      configsToWatch.forEach(function (configToWatch) {
        subscriptions.add(_this.config.onDidChange(configToWatch, updateStyles));
      });
      updateStyles();
      return subscriptions;
    }

    //@autobind
  }, {
    key: 'updateStyles',
    value: function updateStyles(sourcePath, getStylesheetFn) {
      var stylesheet = getStylesheetFn(this.config);
      this.styles.addStyleSheet(stylesheet, { sourcePath: sourcePath });
    }
  }]);

  return StyleCalculator;
})();

exports['default'] = StyleCalculator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zdHlsZS1jYWxjdWxhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVrQyxNQUFNOzs7O0FBRnhDLFdBQVcsQ0FBQTs7SUFLVSxlQUFlO0FBQ3ZCLFdBRFEsZUFBZSxDQUN0QixNQUFNLEVBQUUsTUFBTSxFQUFFOzBCQURULGVBQWU7O0FBRWhDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0dBQ3RCOztlQUprQixlQUFlOztXQU1yQix1QkFBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRTs7O0FBQ3pELFVBQU0sYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQ2hELFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFTO0FBQ3pCLGNBQUssWUFBWSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztPQUNoRCxDQUFDO0FBQ0Ysb0JBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxhQUFhLEVBQUk7QUFDdEMscUJBQWEsQ0FBQyxHQUFHLENBQ2YsTUFBSyxNQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FDckQsQ0FBQztPQUNILENBQUMsQ0FBQztBQUNILGtCQUFZLEVBQUUsQ0FBQztBQUNmLGFBQU8sYUFBYSxDQUFDO0tBQ3RCOzs7OztXQUdXLHNCQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUU7QUFDeEMsVUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsRUFBQyxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUMsQ0FBQztLQUNyRDs7O1NBeEJrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvc3R5bGUtY2FsY3VsYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG4vL2ltcG9ydCB7YXV0b2JpbmR9IGZyb20gJ2NvcmUtZGVjb3JhdG9ycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0eWxlQ2FsY3VsYXRvciB7XG4gIGNvbnN0cnVjdG9yKHN0eWxlcywgY29uZmlnKSB7XG4gICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gIH1cblxuICBzdGFydFdhdGNoaW5nKHNvdXJjZVBhdGgsIGNvbmZpZ3NUb1dhdGNoLCBnZXRTdHlsZXNoZWV0Rm4pIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBjb25zdCB1cGRhdGVTdHlsZXMgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN0eWxlcyhzb3VyY2VQYXRoLCBnZXRTdHlsZXNoZWV0Rm4pO1xuICAgIH07XG4gICAgY29uZmlnc1RvV2F0Y2guZm9yRWFjaChjb25maWdUb1dhdGNoID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLmNvbmZpZy5vbkRpZENoYW5nZShjb25maWdUb1dhdGNoLCB1cGRhdGVTdHlsZXMpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgICB1cGRhdGVTdHlsZXMoKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucztcbiAgfVxuXG4gIC8vQGF1dG9iaW5kXG4gIHVwZGF0ZVN0eWxlcyhzb3VyY2VQYXRoLCBnZXRTdHlsZXNoZWV0Rm4pIHtcbiAgICBjb25zdCBzdHlsZXNoZWV0ID0gZ2V0U3R5bGVzaGVldEZuKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLnN0eWxlcy5hZGRTdHlsZVNoZWV0KHN0eWxlc2hlZXQsIHtzb3VyY2VQYXRofSk7XG4gIH1cbn1cbiJdfQ==