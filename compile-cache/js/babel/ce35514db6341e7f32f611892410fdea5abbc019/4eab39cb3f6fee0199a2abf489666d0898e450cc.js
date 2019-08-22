Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _utils = require('../../utils');

'use babel';

var CompoundProposalProvider = (function () {
  function CompoundProposalProvider() {
    _classCallCheck(this, CompoundProposalProvider);

    this.providers = [];
  }

  _createClass(CompoundProposalProvider, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      this.addProviders([provider]);
    }
  }, {
    key: 'addProviders',
    value: function addProviders(providers) {
      this.providers = this.providers.concat(providers);
    }
  }, {
    key: 'hasProposals',
    value: function hasProposals(file) {
      return this.providers.some(function (provider) {
        return (0, _utils.matches)(file, provider.getFilePattern());
      });
    }
  }, {
    key: 'getProposals',
    value: function getProposals(request) {
      var file = request.editor.buffer.file;
      return Promise.all(this.providers.filter(function (provider) {
        return (0, _utils.matches)(file, provider.getFilePattern());
      }).map(function (provider) {
        return provider.getProposals(request);
      })).then(function (results) {
        return (0, _lodashFlatten2['default'])(results);
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return undefined; // not used
    }
  }]);

  return CompoundProposalProvider;
})();

exports.CompoundProposalProvider = CompoundProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9zY2hlbWFzdG9yZS9jb21wb3VuZC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzZCQUVvQixnQkFBZ0I7Ozs7cUJBQ1osYUFBYTs7QUFIckMsV0FBVyxDQUFBOztJQUtFLHdCQUF3QjtBQUN4QixXQURBLHdCQUF3QixHQUNyQjswQkFESCx3QkFBd0I7O0FBRWpDLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO0dBQ3BCOztlQUhVLHdCQUF3Qjs7V0FLeEIscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0tBQzlCOzs7V0FFVyxzQkFBQyxTQUFTLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUNsRDs7O1dBRVcsc0JBQUMsSUFBSSxFQUFFO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2VBQUksb0JBQVEsSUFBSSxFQUFFLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUFBLENBQUMsQ0FBQTtLQUNqRjs7O1dBRVcsc0JBQUMsT0FBTyxFQUFFO0FBQ3BCLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtBQUN2QyxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxTQUFTLENBQ1gsTUFBTSxDQUFDLFVBQUEsUUFBUTtlQUFJLG9CQUFRLElBQUksRUFBRSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7T0FBQSxDQUFDLENBQzVELEdBQUcsQ0FBQyxVQUFBLFFBQVE7ZUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztPQUFBLENBQUMsQ0FDbkQsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO2VBQUksZ0NBQVEsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQ3BDOzs7V0FFYSwwQkFBRztBQUNmLGFBQU8sU0FBUyxDQUFBO0tBQ2pCOzs7U0E1QlUsd0JBQXdCIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9zY2hlbWFzdG9yZS9jb21wb3VuZC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBmbGF0dGVuIGZyb20gJ2xvZGFzaC9mbGF0dGVuJ1xuaW1wb3J0IHsgbWF0Y2hlcyB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgQ29tcG91bmRQcm9wb3NhbFByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMgPSBbXVxuICB9XG5cbiAgYWRkUHJvdmlkZXIocHJvdmlkZXIpIHtcbiAgICB0aGlzLmFkZFByb3ZpZGVycyhbcHJvdmlkZXJdKVxuICB9XG5cbiAgYWRkUHJvdmlkZXJzKHByb3ZpZGVycykge1xuICAgIHRoaXMucHJvdmlkZXJzID0gdGhpcy5wcm92aWRlcnMuY29uY2F0KHByb3ZpZGVycylcbiAgfVxuXG4gIGhhc1Byb3Bvc2FscyhmaWxlKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLnNvbWUocHJvdmlkZXIgPT4gbWF0Y2hlcyhmaWxlLCBwcm92aWRlci5nZXRGaWxlUGF0dGVybigpKSlcbiAgfVxuXG4gIGdldFByb3Bvc2FscyhyZXF1ZXN0KSB7XG4gICAgY29uc3QgZmlsZSA9IHJlcXVlc3QuZWRpdG9yLmJ1ZmZlci5maWxlXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgdGhpcy5wcm92aWRlcnNcbiAgICAgICAgLmZpbHRlcihwcm92aWRlciA9PiBtYXRjaGVzKGZpbGUsIHByb3ZpZGVyLmdldEZpbGVQYXR0ZXJuKCkpKVxuICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmdldFByb3Bvc2FscyhyZXF1ZXN0KSlcbiAgICApLnRoZW4ocmVzdWx0cyA9PiBmbGF0dGVuKHJlc3VsdHMpKVxuICB9XG5cbiAgZ2V0RmlsZVBhdHRlcm4oKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZCAvLyBub3QgdXNlZFxuICB9XG59XG4iXX0=