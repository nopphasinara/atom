Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _matchers = require('../../matchers');

var _npmPackageLookup = require('npm-package-lookup');

'use babel';

var PLUGINS = 'plugins';
var BABEL_PLUGIN = 'babel-plugin-';

var PRESET_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(PLUGINS).index());

var BabelRCPluginsProposalProvider = (function () {
  function BabelRCPluginsProposalProvider() {
    _classCallCheck(this, BabelRCPluginsProposalProvider);
  }

  _createClass(BabelRCPluginsProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(req) {
      var _this = this;

      var contents = req.contents;
      var prefix = req.prefix;
      var isBetweenQuotes = req.isBetweenQuotes;
      var shouldAddComma = req.shouldAddComma;

      if (PRESET_MATCHER.matches(req)) {
        var _ret = (function () {
          var plugins = contents[PLUGINS] || [];
          var results = (0, _npmPackageLookup.search)(_this.calculateSearchKeyword(prefix));
          return {
            v: results.then(function (names) {
              return names.filter(function (name) {
                return plugins.indexOf(name.replace(BABEL_PLUGIN, '')) < 0;
              }).map(function (pluginName) {
                var name = pluginName.replace(BABEL_PLUGIN, '');
                var proposal = {};
                proposal.displayText = name;
                proposal.rightLabel = 'plugin';
                proposal.type = 'plugin';
                proposal.description = name + ' babel plugin. Required dependency in package.json: ' + pluginName;
                if (isBetweenQuotes) {
                  proposal.text = name;
                } else {
                  proposal.snippet = '"' + name + '"' + (shouldAddComma ? ',' : '');
                }
                return proposal;
              });
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
      return Promise.resolve([]);
    }
  }, {
    key: 'calculateSearchKeyword',
    value: function calculateSearchKeyword(prefix) {
      if ((0, _lodashStartsWith2['default'])(BABEL_PLUGIN, prefix)) {
        return BABEL_PLUGIN;
      } else if ((0, _lodashStartsWith2['default'])(prefix, BABEL_PLUGIN)) {
        return prefix;
      }
      return BABEL_PLUGIN + prefix;
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '.babelrc';
    }
  }]);

  return BabelRCPluginsProposalProvider;
})();

exports['default'] = BabelRCPluginsProposalProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9iYWJlbHJjL2JhYmVscmMtcGx1Z2lucy1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2dDQUV1QixtQkFBbUI7Ozs7d0JBRVosZ0JBQWdCOztnQ0FDdkIsb0JBQW9COztBQUwzQyxXQUFXLENBQUE7O0FBT1gsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFBO0FBQ3pCLElBQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQTs7QUFFcEMsSUFBTSxjQUFjLEdBQUcsd0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTs7SUFFckQsOEJBQThCO1dBQTlCLDhCQUE4QjswQkFBOUIsOEJBQThCOzs7ZUFBOUIsOEJBQThCOztXQUNyQyxzQkFBQyxHQUFHLEVBQUU7OztVQUNSLFFBQVEsR0FBNkMsR0FBRyxDQUF4RCxRQUFRO1VBQUUsTUFBTSxHQUFxQyxHQUFHLENBQTlDLE1BQU07VUFBRSxlQUFlLEdBQW9CLEdBQUcsQ0FBdEMsZUFBZTtVQUFFLGNBQWMsR0FBSSxHQUFHLENBQXJCLGNBQWM7O0FBQ3pELFVBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTs7QUFDL0IsY0FBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUN2QyxjQUFNLE9BQU8sR0FBRyw4QkFBTyxNQUFLLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDM0Q7ZUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztxQkFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTt1QkFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDdkgsb0JBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2pELG9CQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbkIsd0JBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQzNCLHdCQUFRLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQTtBQUM5Qix3QkFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7QUFDeEIsd0JBQVEsQ0FBQyxXQUFXLEdBQU0sSUFBSSw0REFBdUQsVUFBVSxBQUFFLENBQUE7QUFDakcsb0JBQUksZUFBZSxFQUFFO0FBQ25CLDBCQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtpQkFDckIsTUFBTTtBQUNMLDBCQUFRLENBQUMsT0FBTyxTQUFPLElBQUksVUFBSSxjQUFjLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUE7aUJBQzNEO0FBQ0QsdUJBQU8sUUFBUSxDQUFBO2VBQ2hCLENBQUM7YUFBQSxDQUFDO1lBQUE7Ozs7T0FDSjtBQUNELGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMzQjs7O1dBRXFCLGdDQUFDLE1BQU0sRUFBRTtBQUM3QixVQUFJLG1DQUFXLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBRTtBQUNwQyxlQUFPLFlBQVksQ0FBQTtPQUNwQixNQUFNLElBQUksbUNBQVcsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUFFO0FBQzNDLGVBQU8sTUFBTSxDQUFBO09BQ2Q7QUFDRCxhQUFPLFlBQVksR0FBRyxNQUFNLENBQUE7S0FFN0I7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxVQUFVLENBQUE7S0FDbEI7OztTQXBDa0IsOEJBQThCOzs7cUJBQTlCLDhCQUE4QiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9wcm92aWRlcnMvYmFiZWxyYy9iYWJlbHJjLXBsdWdpbnMtcHJvcG9zYWwtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgc3RhcnRzV2l0aCBmcm9tICdsb2Rhc2gvc3RhcnRzV2l0aCdcblxuaW1wb3J0IHsgcGF0aCwgcmVxdWVzdCB9IGZyb20gJy4uLy4uL21hdGNoZXJzJ1xuaW1wb3J0IHsgc2VhcmNoIH0gZnJvbSAnbnBtLXBhY2thZ2UtbG9va3VwJ1xuXG5jb25zdCBQTFVHSU5TID0gJ3BsdWdpbnMnXG5jb25zdCBCQUJFTF9QTFVHSU4gPSAnYmFiZWwtcGx1Z2luLSdcblxuY29uc3QgUFJFU0VUX01BVENIRVIgPSByZXF1ZXN0KCkudmFsdWUoKS5wYXRoKHBhdGgoKS5rZXkoUExVR0lOUykuaW5kZXgoKSlcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFiZWxSQ1BsdWdpbnNQcm9wb3NhbFByb3ZpZGVyIHtcbiAgZ2V0UHJvcG9zYWxzKHJlcSkge1xuICAgIGNvbnN0IHsgY29udGVudHMsIHByZWZpeCwgaXNCZXR3ZWVuUXVvdGVzLCBzaG91bGRBZGRDb21tYX0gPSByZXFcbiAgICBpZiAoUFJFU0VUX01BVENIRVIubWF0Y2hlcyhyZXEpKSB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gY29udGVudHNbUExVR0lOU10gfHwgW11cbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBzZWFyY2godGhpcy5jYWxjdWxhdGVTZWFyY2hLZXl3b3JkKHByZWZpeCkpXG4gICAgICByZXR1cm4gcmVzdWx0cy50aGVuKG5hbWVzID0+IG5hbWVzLmZpbHRlcihuYW1lID0+IHBsdWdpbnMuaW5kZXhPZihuYW1lLnJlcGxhY2UoQkFCRUxfUExVR0lOLCAnJykpIDwgMCkubWFwKHBsdWdpbk5hbWUgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gcGx1Z2luTmFtZS5yZXBsYWNlKEJBQkVMX1BMVUdJTiwgJycpXG4gICAgICAgIGNvbnN0IHByb3Bvc2FsID0ge31cbiAgICAgICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBuYW1lXG4gICAgICAgIHByb3Bvc2FsLnJpZ2h0TGFiZWwgPSAncGx1Z2luJ1xuICAgICAgICBwcm9wb3NhbC50eXBlID0gJ3BsdWdpbidcbiAgICAgICAgcHJvcG9zYWwuZGVzY3JpcHRpb24gPSBgJHtuYW1lfSBiYWJlbCBwbHVnaW4uIFJlcXVpcmVkIGRlcGVuZGVuY3kgaW4gcGFja2FnZS5qc29uOiAke3BsdWdpbk5hbWV9YFxuICAgICAgICBpZiAoaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICAgICAgcHJvcG9zYWwudGV4dCA9IG5hbWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wb3NhbC5zbmlwcGV0ID0gYFwiJHtuYW1lfVwiJHtzaG91bGRBZGRDb21tYSA/ICcsJyA6ICcnfWBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcG9zYWxcbiAgICAgIH0pKVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICB9XG5cbiAgY2FsY3VsYXRlU2VhcmNoS2V5d29yZChwcmVmaXgpIHtcbiAgICBpZiAoc3RhcnRzV2l0aChCQUJFTF9QTFVHSU4sIHByZWZpeCkpIHtcbiAgICAgIHJldHVybiBCQUJFTF9QTFVHSU5cbiAgICB9IGVsc2UgaWYgKHN0YXJ0c1dpdGgocHJlZml4LCBCQUJFTF9QTFVHSU4pKSB7XG4gICAgICByZXR1cm4gcHJlZml4XG4gICAgfVxuICAgIHJldHVybiBCQUJFTF9QTFVHSU4gKyBwcmVmaXhcblxuICB9XG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICcuYmFiZWxyYydcbiAgfVxufVxuIl19