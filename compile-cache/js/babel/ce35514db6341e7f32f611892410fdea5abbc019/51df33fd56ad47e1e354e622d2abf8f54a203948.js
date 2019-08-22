Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

'use babel';

function createDependencyProposal(request, dependency) {
  var isBetweenQuotes = request.isBetweenQuotes;
  var shouldAddComma = request.shouldAddComma;

  var proposal = {};
  proposal.displayText = dependency.name;
  proposal.rightLabel = 'dependency';
  proposal.type = 'property';
  proposal.description = dependency.description;
  if (isBetweenQuotes) {
    proposal.text = dependency.name;
  } else {
    proposal.snippet = '"' + dependency.name + '": "$1"' + (shouldAddComma ? ',' : '');
  }
  return proposal;
}

function createVersionProposal(request, version) {
  var isBetweenQuotes = request.isBetweenQuotes;
  var shouldAddComma = request.shouldAddComma;
  var prefix = request.prefix;

  var proposal = {};
  proposal.displayText = version;
  proposal.rightLabel = 'version';
  proposal.type = 'value';
  proposal.replacementPrefix = (0, _lodashTrimStart2['default'])(prefix, '~^<>="');
  if (isBetweenQuotes) {
    proposal.text = version;
  } else {
    proposal.snippet = '"' + version + '"' + (shouldAddComma ? ',' : '');
  }
  return proposal;
}

var SemverDependencyProposalProvider = (function () {
  function SemverDependencyProposalProvider(config) {
    _classCallCheck(this, SemverDependencyProposalProvider);

    this.config = config;
  }

  _createClass(SemverDependencyProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      if (this.config.dependencyRequestMatcher().matches(request)) {
        return this.getDependencyKeysProposals(request);
      }
      if (this.config.versionRequestMatcher().matches(request)) {
        return this.getDependencyVersionsProposals(request);
      }
      return Promise.resolve([]);
    }
  }, {
    key: 'getDependencyKeysProposals',
    value: function getDependencyKeysProposals(request) {
      var prefix = request.prefix;

      var dependencyFilter = this.config.getDependencyFilter(request);
      return this.config.search(prefix).then(function (packages) {
        return packages.filter(function (dependency) {
          return dependencyFilter(dependency.name);
        }).map(function (dependency) {
          return createDependencyProposal(request, dependency);
        });
      });
    }
  }, {
    key: 'getDependencyVersionsProposals',
    value: function getDependencyVersionsProposals(request) {
      var segments = request.segments;
      var prefix = request.prefix;

      var _segments = _slicedToArray(segments, 2);

      var packageName = _segments[1];

      var trimmedPrefix = (0, _lodashTrimStart2['default'])(prefix, '~^<>="');
      return this.config.versions(packageName.toString()).then(function (versions) {
        return versions.filter(function (version) {
          return (0, _lodashStartsWith2['default'])(version, trimmedPrefix);
        }).map(function (version) {
          return createVersionProposal(request, version);
        });
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.config.getFilePattern();
    }
  }]);

  return SemverDependencyProposalProvider;
})();

exports.SemverDependencyProposalProvider = SemverDependencyProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3NlbXZlci1kZXBlbmRlbmN5LXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzsrQkFFc0Isa0JBQWtCOzs7O2dDQUNqQixtQkFBbUI7Ozs7QUFIMUMsV0FBVyxDQUFBOztBQUtYLFNBQVMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRTtNQUM5QyxlQUFlLEdBQW9CLE9BQU8sQ0FBMUMsZUFBZTtNQUFFLGNBQWMsR0FBSSxPQUFPLENBQXpCLGNBQWM7O0FBQ3RDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixVQUFRLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUE7QUFDdEMsVUFBUSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUE7QUFDbEMsVUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUE7QUFDMUIsVUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFBO0FBQzdDLE1BQUksZUFBZSxFQUFFO0FBQ25CLFlBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQTtHQUNoQyxNQUFNO0FBQ0wsWUFBUSxDQUFDLE9BQU8sU0FBTyxVQUFVLENBQUMsSUFBSSxnQkFBVSxjQUFjLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUE7R0FDNUU7QUFDRCxTQUFPLFFBQVEsQ0FBQTtDQUNoQjs7QUFFRCxTQUFTLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7TUFDeEMsZUFBZSxHQUE0QixPQUFPLENBQWxELGVBQWU7TUFBRSxjQUFjLEdBQVksT0FBTyxDQUFqQyxjQUFjO01BQUUsTUFBTSxHQUFJLE9BQU8sQ0FBakIsTUFBTTs7QUFDOUMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQVEsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFBO0FBQzlCLFVBQVEsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO0FBQy9CLFVBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFBO0FBQ3ZCLFVBQVEsQ0FBQyxpQkFBaUIsR0FBRyxrQ0FBVSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDeEQsTUFBSSxlQUFlLEVBQUU7QUFDbkIsWUFBUSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7R0FDeEIsTUFBTTtBQUNMLFlBQVEsQ0FBQyxPQUFPLFNBQU8sT0FBTyxVQUFJLGNBQWMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUUsQ0FBQTtHQUM5RDtBQUNELFNBQU8sUUFBUSxDQUFBO0NBQ2hCOztJQUdZLGdDQUFnQztBQUVoQyxXQUZBLGdDQUFnQyxDQUUvQixNQUFNLEVBQUU7MEJBRlQsZ0NBQWdDOztBQUd6QyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtHQUNyQjs7ZUFKVSxnQ0FBZ0M7O1dBTS9CLHNCQUFDLE9BQU8sRUFBRTtBQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDM0QsZUFBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDaEQ7QUFDRCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDeEQsZUFBTyxJQUFJLENBQUMsOEJBQThCLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDcEQ7QUFDRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDM0I7OztXQUV5QixvQ0FBQyxPQUFPLEVBQUU7VUFDM0IsTUFBTSxHQUFJLE9BQU8sQ0FBakIsTUFBTTs7QUFDYixVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2VBQzdDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxVQUFVO2lCQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQzdELEdBQUcsQ0FBQyxVQUFBLFVBQVU7aUJBQUksd0JBQXdCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztTQUFBLENBQUM7T0FBQSxDQUNwRSxDQUFBO0tBQ0Y7OztXQUU2Qix3Q0FBQyxPQUFPLEVBQUU7VUFDL0IsUUFBUSxHQUFZLE9BQU8sQ0FBM0IsUUFBUTtVQUFFLE1BQU0sR0FBSSxPQUFPLENBQWpCLE1BQU07O3FDQUNDLFFBQVE7O1VBQXZCLFdBQVc7O0FBQ3BCLFVBQU0sYUFBYSxHQUFHLGtDQUFVLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNqRCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7ZUFDL0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87aUJBQUksbUNBQVcsT0FBTyxFQUFFLGFBQWEsQ0FBQztTQUFBLENBQUMsQ0FDM0QsR0FBRyxDQUFDLFVBQUEsT0FBTztpQkFBSSxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1NBQUEsQ0FBQztPQUFBLENBQzNELENBQUE7S0FDRjs7O1dBRWEsMEJBQUc7QUFDZixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUE7S0FDcEM7OztTQXJDVSxnQ0FBZ0MiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvc2VtdmVyLWRlcGVuZGVuY3ktcHJvcG9zYWwtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgdHJpbVN0YXJ0IGZyb20gJ2xvZGFzaC90cmltU3RhcnQnXG5pbXBvcnQgc3RhcnRzV2l0aCBmcm9tICdsb2Rhc2gvc3RhcnRzV2l0aCdcblxuZnVuY3Rpb24gY3JlYXRlRGVwZW5kZW5jeVByb3Bvc2FsKHJlcXVlc3QsIGRlcGVuZGVuY3kpIHtcbiAgY29uc3Qge2lzQmV0d2VlblF1b3Rlcywgc2hvdWxkQWRkQ29tbWF9ID0gcmVxdWVzdFxuICBjb25zdCBwcm9wb3NhbCA9IHt9XG4gIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gZGVwZW5kZW5jeS5uYW1lXG4gIHByb3Bvc2FsLnJpZ2h0TGFiZWwgPSAnZGVwZW5kZW5jeSdcbiAgcHJvcG9zYWwudHlwZSA9ICdwcm9wZXJ0eSdcbiAgcHJvcG9zYWwuZGVzY3JpcHRpb24gPSBkZXBlbmRlbmN5LmRlc2NyaXB0aW9uXG4gIGlmIChpc0JldHdlZW5RdW90ZXMpIHtcbiAgICBwcm9wb3NhbC50ZXh0ID0gZGVwZW5kZW5jeS5uYW1lXG4gIH0gZWxzZSB7XG4gICAgcHJvcG9zYWwuc25pcHBldCA9IGBcIiR7ZGVwZW5kZW5jeS5uYW1lfVwiOiBcIiQxXCIke3Nob3VsZEFkZENvbW1hID8gJywnIDogJyd9YFxuICB9XG4gIHJldHVybiBwcm9wb3NhbFxufVxuXG5mdW5jdGlvbiBjcmVhdGVWZXJzaW9uUHJvcG9zYWwocmVxdWVzdCwgdmVyc2lvbikge1xuICBjb25zdCB7aXNCZXR3ZWVuUXVvdGVzLCBzaG91bGRBZGRDb21tYSwgcHJlZml4fSA9IHJlcXVlc3RcbiAgY29uc3QgcHJvcG9zYWwgPSB7fVxuICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IHZlcnNpb25cbiAgcHJvcG9zYWwucmlnaHRMYWJlbCA9ICd2ZXJzaW9uJ1xuICBwcm9wb3NhbC50eXBlID0gJ3ZhbHVlJ1xuICBwcm9wb3NhbC5yZXBsYWNlbWVudFByZWZpeCA9IHRyaW1TdGFydChwcmVmaXgsICd+Xjw+PVwiJylcbiAgaWYgKGlzQmV0d2VlblF1b3Rlcykge1xuICAgIHByb3Bvc2FsLnRleHQgPSB2ZXJzaW9uXG4gIH0gZWxzZSB7XG4gICAgcHJvcG9zYWwuc25pcHBldCA9IGBcIiR7dmVyc2lvbn1cIiR7c2hvdWxkQWRkQ29tbWEgPyAnLCcgOiAnJ31gXG4gIH1cbiAgcmV0dXJuIHByb3Bvc2FsXG59XG5cblxuZXhwb3J0IGNsYXNzIFNlbXZlckRlcGVuZGVuY3lQcm9wb3NhbFByb3ZpZGVyIHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1xuICB9XG5cbiAgZ2V0UHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICBpZiAodGhpcy5jb25maWcuZGVwZW5kZW5jeVJlcXVlc3RNYXRjaGVyKCkubWF0Y2hlcyhyZXF1ZXN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVwZW5kZW5jeUtleXNQcm9wb3NhbHMocmVxdWVzdClcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlnLnZlcnNpb25SZXF1ZXN0TWF0Y2hlcigpLm1hdGNoZXMocmVxdWVzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlcGVuZGVuY3lWZXJzaW9uc1Byb3Bvc2FscyhyZXF1ZXN0KVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICB9XG5cbiAgZ2V0RGVwZW5kZW5jeUtleXNQcm9wb3NhbHMocmVxdWVzdCkge1xuICAgIGNvbnN0IHtwcmVmaXh9ID0gcmVxdWVzdFxuICAgIGNvbnN0IGRlcGVuZGVuY3lGaWx0ZXIgPSB0aGlzLmNvbmZpZy5nZXREZXBlbmRlbmN5RmlsdGVyKHJlcXVlc3QpXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnNlYXJjaChwcmVmaXgpLnRoZW4ocGFja2FnZXMgPT5cbiAgICAgIHBhY2thZ2VzLmZpbHRlcihkZXBlbmRlbmN5ID0+IGRlcGVuZGVuY3lGaWx0ZXIoZGVwZW5kZW5jeS5uYW1lKSlcbiAgICAgICAgLm1hcChkZXBlbmRlbmN5ID0+IGNyZWF0ZURlcGVuZGVuY3lQcm9wb3NhbChyZXF1ZXN0LCBkZXBlbmRlbmN5KSlcbiAgICApXG4gIH1cblxuICBnZXREZXBlbmRlbmN5VmVyc2lvbnNQcm9wb3NhbHMocmVxdWVzdCkge1xuICAgIGNvbnN0IHtzZWdtZW50cywgcHJlZml4fSA9IHJlcXVlc3RcbiAgICBjb25zdCBbLCBwYWNrYWdlTmFtZV0gPSBzZWdtZW50c1xuICAgIGNvbnN0IHRyaW1tZWRQcmVmaXggPSB0cmltU3RhcnQocHJlZml4LCAnfl48Pj1cIicpXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnZlcnNpb25zKHBhY2thZ2VOYW1lLnRvU3RyaW5nKCkpLnRoZW4odmVyc2lvbnMgPT5cbiAgICAgIHZlcnNpb25zLmZpbHRlcih2ZXJzaW9uID0+IHN0YXJ0c1dpdGgodmVyc2lvbiwgdHJpbW1lZFByZWZpeCkpXG4gICAgICAgIC5tYXAodmVyc2lvbiA9PiBjcmVhdGVWZXJzaW9uUHJvcG9zYWwocmVxdWVzdCwgdmVyc2lvbikpXG4gICAgKVxuICB9XG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldEZpbGVQYXR0ZXJuKClcbiAgfVxufVxuIl19