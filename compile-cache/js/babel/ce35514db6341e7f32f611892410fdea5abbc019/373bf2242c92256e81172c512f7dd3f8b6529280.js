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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvc3R5bGUtY2FsY3VsYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFa0MsTUFBTTs7OztBQUZ4QyxXQUFXLENBQUE7O0lBS1UsZUFBZTtBQUN2QixXQURRLGVBQWUsQ0FDdEIsTUFBTSxFQUFFLE1BQU0sRUFBRTswQkFEVCxlQUFlOztBQUVoQyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7ZUFKa0IsZUFBZTs7V0FNckIsdUJBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUU7OztBQUN6RCxVQUFNLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUNoRCxVQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUN6QixjQUFLLFlBQVksQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7T0FDaEQsQ0FBQztBQUNGLG9CQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsYUFBYSxFQUFJO0FBQ3RDLHFCQUFhLENBQUMsR0FBRyxDQUNmLE1BQUssTUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQ3JELENBQUM7T0FDSCxDQUFDLENBQUM7QUFDSCxrQkFBWSxFQUFFLENBQUM7QUFDZixhQUFPLGFBQWEsQ0FBQztLQUN0Qjs7Ozs7V0FHVyxzQkFBQyxVQUFVLEVBQUUsZUFBZSxFQUFFO0FBQ3hDLFVBQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUMsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUM7S0FDckQ7OztTQXhCa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zdHlsZS1jYWxjdWxhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbi8vaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnY29yZS1kZWNvcmF0b3JzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3R5bGVDYWxjdWxhdG9yIHtcbiAgY29uc3RydWN0b3Ioc3R5bGVzLCBjb25maWcpIHtcbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIHN0YXJ0V2F0Y2hpbmcoc291cmNlUGF0aCwgY29uZmlnc1RvV2F0Y2gsIGdldFN0eWxlc2hlZXRGbikge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGNvbnN0IHVwZGF0ZVN0eWxlcyA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3R5bGVzKHNvdXJjZVBhdGgsIGdldFN0eWxlc2hlZXRGbik7XG4gICAgfTtcbiAgICBjb25maWdzVG9XYXRjaC5mb3JFYWNoKGNvbmZpZ1RvV2F0Y2ggPT4ge1xuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMuY29uZmlnLm9uRGlkQ2hhbmdlKGNvbmZpZ1RvV2F0Y2gsIHVwZGF0ZVN0eWxlcyksXG4gICAgICApO1xuICAgIH0pO1xuICAgIHVwZGF0ZVN0eWxlcygpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb25zO1xuICB9XG5cbiAgLy9AYXV0b2JpbmRcbiAgdXBkYXRlU3R5bGVzKHNvdXJjZVBhdGgsIGdldFN0eWxlc2hlZXRGbikge1xuICAgIGNvbnN0IHN0eWxlc2hlZXQgPSBnZXRTdHlsZXNoZWV0Rm4odGhpcy5jb25maWcpO1xuICAgIHRoaXMuc3R5bGVzLmFkZFN0eWxlU2hlZXQoc3R5bGVzaGVldCwge3NvdXJjZVBhdGh9KTtcbiAgfVxufVxuIl19