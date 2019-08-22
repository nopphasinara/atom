Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _matchers = require('../../matchers');

var _npmPackageLookup = require('npm-package-lookup');

'use babel';

var PRESETS = 'presets';
var BABEL_PRESET = 'babel-preset-';

var PRESET_MATCHER = (0, _matchers.request)().value().path((0, _matchers.path)().key(PRESETS).index());

var BabelRCPresetsProposalProvider = (function () {
  function BabelRCPresetsProposalProvider() {
    _classCallCheck(this, BabelRCPresetsProposalProvider);
  }

  _createClass(BabelRCPresetsProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(req) {
      var _this = this;

      var contents = req.contents;
      var prefix = req.prefix;
      var isBetweenQuotes = req.isBetweenQuotes;
      var shouldAddComma = req.shouldAddComma;

      if (PRESET_MATCHER.matches(_matchers.request)) {
        var _ret = (function () {
          var presets = contents[PRESETS] || [];
          var results = (0, _npmPackageLookup.search)(_this.calculateSearchKeyword(prefix));
          return {
            v: results.then(function (names) {
              return names.filter(function (name) {
                return presets.indexOf(name.replace(BABEL_PRESET, '')) < 0;
              }).map(function (presetName) {
                var name = presetName.replace(BABEL_PRESET, '');
                var proposal = _defineProperty({
                  displayText: name,
                  rightLabel: 'preset',
                  type: 'preset',
                  description: name + ' babel preset. Required dependency in package.json: ' + presetName
                }, isBetweenQuotes ? 'text' : 'snippet', isBetweenQuotes ? name : '"' + name + '"' + (shouldAddComma ? ',' : ''));
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
      if ((0, _lodashStartsWith2['default'])(BABEL_PRESET, prefix)) {
        return BABEL_PRESET;
      } else if ((0, _lodashStartsWith2['default'])(prefix, BABEL_PRESET)) {
        return prefix;
      }
      return BABEL_PRESET + prefix;
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '.babelrc';
    }
  }]);

  return BabelRCPresetsProposalProvider;
})();

exports['default'] = BabelRCPresetsProposalProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9iYWJlbHJjL2JhYmVscmMtcHJlc2V0cy1wcm9wb3NhbC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Z0NBRXVCLG1CQUFtQjs7Ozt3QkFDWixnQkFBZ0I7O2dDQUN2QixvQkFBb0I7O0FBSjNDLFdBQVcsQ0FBQTs7QUFNWCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUE7QUFDekIsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFBOztBQUVwQyxJQUFNLGNBQWMsR0FBRyx3QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBOztJQUVyRCw4QkFBOEI7V0FBOUIsOEJBQThCOzBCQUE5Qiw4QkFBOEI7OztlQUE5Qiw4QkFBOEI7O1dBQ3JDLHNCQUFDLEdBQUcsRUFBRTs7O1VBQ1QsUUFBUSxHQUE2QyxHQUFHLENBQXhELFFBQVE7VUFBRSxNQUFNLEdBQXFDLEdBQUcsQ0FBOUMsTUFBTTtVQUFFLGVBQWUsR0FBb0IsR0FBRyxDQUF0QyxlQUFlO1VBQUUsY0FBYyxHQUFJLEdBQUcsQ0FBckIsY0FBYzs7QUFDeEQsVUFBSSxjQUFjLENBQUMsT0FBTyxtQkFBUyxFQUFFOztBQUNuQyxjQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3ZDLGNBQU0sT0FBTyxHQUFHLDhCQUFPLE1BQUssc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMzRDtlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO3FCQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO3VCQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO2VBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN2SCxvQkFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDakQsb0JBQU0sUUFBUTtBQUNaLDZCQUFXLEVBQUUsSUFBSTtBQUNqQiw0QkFBVSxFQUFFLFFBQVE7QUFDcEIsc0JBQUksRUFBRSxRQUFRO0FBQ2QsNkJBQVcsRUFBSyxJQUFJLDREQUF1RCxVQUFVLEFBQUU7bUJBQ3RGLGVBQWUsR0FBRyxNQUFNLEdBQUcsU0FBUyxFQUFHLGVBQWUsR0FBRyxJQUFJLFNBQVEsSUFBSSxVQUFNLGNBQWMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUUsQ0FDNUcsQ0FBQTtBQUNELHVCQUFPLFFBQVEsQ0FBQTtlQUNoQixDQUFDO2FBQUEsQ0FBQztZQUFBOzs7O09BQ0o7QUFDRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDM0I7OztXQUVxQixnQ0FBQyxNQUFNLEVBQUU7QUFDN0IsVUFBSSxtQ0FBVyxZQUFZLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDcEMsZUFBTyxZQUFZLENBQUE7T0FDcEIsTUFBTSxJQUFJLG1DQUFXLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBRTtBQUMzQyxlQUFPLE1BQU0sQ0FBQTtPQUNkO0FBQ0QsYUFBTyxZQUFZLEdBQUcsTUFBTSxDQUFBO0tBRTdCOzs7V0FFYSwwQkFBRztBQUNmLGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7U0FqQ2tCLDhCQUE4Qjs7O3FCQUE5Qiw4QkFBOEIiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcHJvdmlkZXJzL2JhYmVscmMvYmFiZWxyYy1wcmVzZXRzLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHN0YXJ0c1dpdGggZnJvbSAnbG9kYXNoL3N0YXJ0c1dpdGgnXG5pbXBvcnQgeyBwYXRoLCByZXF1ZXN0IH0gZnJvbSAnLi4vLi4vbWF0Y2hlcnMnXG5pbXBvcnQgeyBzZWFyY2ggfSBmcm9tICducG0tcGFja2FnZS1sb29rdXAnXG5cbmNvbnN0IFBSRVNFVFMgPSAncHJlc2V0cydcbmNvbnN0IEJBQkVMX1BSRVNFVCA9ICdiYWJlbC1wcmVzZXQtJ1xuXG5jb25zdCBQUkVTRVRfTUFUQ0hFUiA9IHJlcXVlc3QoKS52YWx1ZSgpLnBhdGgocGF0aCgpLmtleShQUkVTRVRTKS5pbmRleCgpKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYWJlbFJDUHJlc2V0c1Byb3Bvc2FsUHJvdmlkZXIge1xuICBnZXRQcm9wb3NhbHMocmVxKSB7XG4gICAgY29uc3Qge2NvbnRlbnRzLCBwcmVmaXgsIGlzQmV0d2VlblF1b3Rlcywgc2hvdWxkQWRkQ29tbWF9ID0gcmVxXG4gICAgaWYgKFBSRVNFVF9NQVRDSEVSLm1hdGNoZXMocmVxdWVzdCkpIHtcbiAgICAgIGNvbnN0IHByZXNldHMgPSBjb250ZW50c1tQUkVTRVRTXSB8fCBbXVxuICAgICAgY29uc3QgcmVzdWx0cyA9IHNlYXJjaCh0aGlzLmNhbGN1bGF0ZVNlYXJjaEtleXdvcmQocHJlZml4KSlcbiAgICAgIHJldHVybiByZXN1bHRzLnRoZW4obmFtZXMgPT4gbmFtZXMuZmlsdGVyKG5hbWUgPT4gcHJlc2V0cy5pbmRleE9mKG5hbWUucmVwbGFjZShCQUJFTF9QUkVTRVQsICcnKSkgPCAwKS5tYXAocHJlc2V0TmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwcmVzZXROYW1lLnJlcGxhY2UoQkFCRUxfUFJFU0VULCAnJylcbiAgICAgICAgY29uc3QgcHJvcG9zYWwgPSB7XG4gICAgICAgICAgZGlzcGxheVRleHQ6IG5hbWUsXG4gICAgICAgICAgcmlnaHRMYWJlbDogJ3ByZXNldCcsXG4gICAgICAgICAgdHlwZTogJ3ByZXNldCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGAke25hbWV9IGJhYmVsIHByZXNldC4gUmVxdWlyZWQgZGVwZW5kZW5jeSBpbiBwYWNrYWdlLmpzb246ICR7cHJlc2V0TmFtZX1gLFxuICAgICAgICAgIFtpc0JldHdlZW5RdW90ZXMgPyAndGV4dCcgOiAnc25pcHBldCddOiBpc0JldHdlZW5RdW90ZXMgPyBuYW1lIDogYFwiJHsgbmFtZSB9XCIkeyBzaG91bGRBZGRDb21tYSA/ICcsJyA6ICcnfWBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcG9zYWxcbiAgICAgIH0pKVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICB9XG5cbiAgY2FsY3VsYXRlU2VhcmNoS2V5d29yZChwcmVmaXgpIHtcbiAgICBpZiAoc3RhcnRzV2l0aChCQUJFTF9QUkVTRVQsIHByZWZpeCkpIHtcbiAgICAgIHJldHVybiBCQUJFTF9QUkVTRVRcbiAgICB9IGVsc2UgaWYgKHN0YXJ0c1dpdGgocHJlZml4LCBCQUJFTF9QUkVTRVQpKSB7XG4gICAgICByZXR1cm4gcHJlZml4XG4gICAgfSBcbiAgICByZXR1cm4gQkFCRUxfUFJFU0VUICsgcHJlZml4XG4gICAgXG4gIH1cblxuICBnZXRGaWxlUGF0dGVybigpIHtcbiAgICByZXR1cm4gJy5iYWJlbHJjJ1xuICB9XG59XG4iXX0=