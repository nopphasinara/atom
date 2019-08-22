Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _jsonSchemaProposalProvider = require('../../json-schema-proposal-provider');

var _compoundProvider = require('./compound-provider');

var _jsonSchemaResolver = require('../../json-schema-resolver');

var _jsonSchema = require('../../json-schema');

'use babel';

var SchemaStoreProvider = (function () {
  function SchemaStoreProvider() {
    _classCallCheck(this, SchemaStoreProvider);

    this.compoundProvier = new _compoundProvider.CompoundProposalProvider();
    this.blackList = {};
  }

  _createClass(SchemaStoreProvider, [{
    key: 'getSchemaInfos',
    value: function getSchemaInfos() {
      var _this = this;

      if (this.schemaInfos) {
        return Promise.resolve(this.schemaInfos);
      }
      return _axios2['default'].get('http://schemastore.org/api/json/catalog.json', { headers: { 'Cache-Control': 'no-cache' } }).then(function (response) {
        return response.data;
      }).then(function (data) {
        return data.schemas.filter(function (schema) {
          return Boolean(schema.fileMatch);
        });
      }).then(function (schemaInfos) {
        _this.schemaInfos = schemaInfos;
        return schemaInfos;
      });
    }
  }, {
    key: 'getProposals',
    value: function getProposals(request) {
      var _this2 = this;

      var file = request.editor.buffer.file;
      if (this.blackList[file.getBaseName()]) {
        console.warn('schemas not available');
        return Promise.resolve([]);
      }

      if (!this.compoundProvier.hasProposals(file)) {
        return this.getSchemaInfos().then(function (schemaInfos) {
          return schemaInfos.filter(function (_ref) {
            var fileMatch = _ref.fileMatch;
            return fileMatch.some(function (match) {
              return (0, _minimatch2['default'])(file.getBaseName(), match);
            });
          });
        }).then(function (matching) {
          var promises = matching.map(function (schemaInfo) {
            return (0, _jsonSchemaResolver.resolve)(schemaInfo.url).then(function (schema) {
              return new _jsonSchemaProposalProvider.JsonSchemaProposalProvider(schemaInfo.fileMatch, (0, _jsonSchema.wrap)(schema));
            });
          });
          return Promise.all(promises);
        }).then(function (providers) {
          return _this2.compoundProvier.addProviders(providers);
        }).then(function () {
          if (!_this2.compoundProvier.hasProposals(file)) {
            _this2.blackList[file.getBaseName()] = true;
          }
        }).then(function () {
          return _this2.compoundProvier.getProposals(request);
        });
      }
      return this.compoundProvier.getProposals(request);
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return '*';
    }
  }]);

  return SchemaStoreProvider;
})();

exports['default'] = SchemaStoreProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9zY2hlbWFzdG9yZS9zY2hlbWFzdG9yZS1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3lCQUVzQixXQUFXOzs7O3FCQUNmLE9BQU87Ozs7MENBRWtCLHFDQUFxQzs7Z0NBQ3ZDLHFCQUFxQjs7a0NBQ3RDLDRCQUE0Qjs7MEJBQy9CLG1CQUFtQjs7QUFSeEMsV0FBVyxDQUFBOztJQVVVLG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixHQUN4QjswQkFESyxtQkFBbUI7O0FBRXBDLFFBQUksQ0FBQyxlQUFlLEdBQUcsZ0RBQThCLENBQUE7QUFDckQsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUE7R0FDcEI7O2VBSmtCLG1CQUFtQjs7V0FNeEIsMEJBQUc7OztBQUNmLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ3pDO0FBQ0QsYUFBTyxtQkFBTSxHQUFHLENBQUMsOENBQThDLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUMzRyxJQUFJLENBQUMsVUFBQSxRQUFRO2VBQUksUUFBUSxDQUFDLElBQUk7T0FBQSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU07aUJBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FBQyxDQUN0RSxJQUFJLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDbkIsY0FBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLGVBQU8sV0FBVyxDQUFBO09BQ25CLENBQUMsQ0FBQTtLQUNMOzs7V0FFVyxzQkFBQyxPQUFPLEVBQUU7OztBQUNwQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7QUFDdkMsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFO0FBQ3RDLGVBQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNyQyxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDM0I7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzVDLGVBQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUN6QixJQUFJLENBQUMsVUFBQSxXQUFXO2lCQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFhO2dCQUFYLFNBQVMsR0FBWCxJQUFhLENBQVgsU0FBUzttQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztxQkFBSSw0QkFBVSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxDQUFDO2FBQUEsQ0FBQztXQUFBLENBQUM7U0FBQSxDQUFDLENBQ3pILElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoQixjQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVTttQkFBSSxpQ0FBUSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtxQkFBSSwyREFDakYsVUFBVSxDQUFDLFNBQVMsRUFDcEIsc0JBQUssTUFBTSxDQUFDLENBQ2I7YUFBQSxDQUFDO1dBQUEsQ0FBQyxDQUFBO0FBQ0gsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUM3QixDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUEsU0FBUztpQkFBSSxPQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO1NBQUEsQ0FBQyxDQUMvRCxJQUFJLENBQUMsWUFBTTtBQUNWLGNBQUksQ0FBQyxPQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUMsbUJBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQTtXQUMxQztTQUNGLENBQUMsQ0FDRCxJQUFJLENBQUM7aUJBQU0sT0FBSyxlQUFlLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztTQUFBLENBQUMsQ0FBQTtPQUMxRDtBQUNELGFBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDbEQ7OztXQUVhLDBCQUFHO0FBQ2YsYUFBTyxHQUFHLENBQUE7S0FDWDs7O1NBakRrQixtQkFBbUI7OztxQkFBbkIsbUJBQW1CIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Byb3ZpZGVycy9zY2hlbWFzdG9yZS9zY2hlbWFzdG9yZS1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hUHJvcG9zYWxQcm92aWRlciB9IGZyb20gJy4uLy4uL2pzb24tc2NoZW1hLXByb3Bvc2FsLXByb3ZpZGVyJ1xuaW1wb3J0IHsgQ29tcG91bmRQcm9wb3NhbFByb3ZpZGVyIH0gZnJvbSAnLi9jb21wb3VuZC1wcm92aWRlcidcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYS1yZXNvbHZlcidcbmltcG9ydCB7IHdyYXAgfSBmcm9tICcuLi8uLi9qc29uLXNjaGVtYSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hU3RvcmVQcm92aWRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29tcG91bmRQcm92aWVyID0gbmV3IENvbXBvdW5kUHJvcG9zYWxQcm92aWRlcigpXG4gICAgdGhpcy5ibGFja0xpc3QgPSB7fVxuICB9XG5cbiAgZ2V0U2NoZW1hSW5mb3MoKSB7XG4gICAgaWYgKHRoaXMuc2NoZW1hSW5mb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zY2hlbWFJbmZvcylcbiAgICB9XG4gICAgcmV0dXJuIGF4aW9zLmdldCgnaHR0cDovL3NjaGVtYXN0b3JlLm9yZy9hcGkvanNvbi9jYXRhbG9nLmpzb24nLCB7IGhlYWRlcnM6IHsgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnIH0gfSlcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmRhdGEpXG4gICAgICAudGhlbihkYXRhID0+IGRhdGEuc2NoZW1hcy5maWx0ZXIoc2NoZW1hID0+IEJvb2xlYW4oc2NoZW1hLmZpbGVNYXRjaCkpKVxuICAgICAgLnRoZW4oc2NoZW1hSW5mb3MgPT4ge1xuICAgICAgICB0aGlzLnNjaGVtYUluZm9zID0gc2NoZW1hSW5mb3NcbiAgICAgICAgcmV0dXJuIHNjaGVtYUluZm9zXG4gICAgICB9KVxuICB9XG5cbiAgZ2V0UHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICBjb25zdCBmaWxlID0gcmVxdWVzdC5lZGl0b3IuYnVmZmVyLmZpbGVcbiAgICBpZiAodGhpcy5ibGFja0xpc3RbZmlsZS5nZXRCYXNlTmFtZSgpXSkge1xuICAgICAgY29uc29sZS53YXJuKCdzY2hlbWFzIG5vdCBhdmFpbGFibGUnKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY29tcG91bmRQcm92aWVyLmhhc1Byb3Bvc2FscyhmaWxlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2NoZW1hSW5mb3MoKVxuICAgICAgICAudGhlbihzY2hlbWFJbmZvcyA9PiBzY2hlbWFJbmZvcy5maWx0ZXIoKHsgZmlsZU1hdGNoIH0pID0+IGZpbGVNYXRjaC5zb21lKG1hdGNoID0+IG1pbmltYXRjaChmaWxlLmdldEJhc2VOYW1lKCksIG1hdGNoKSkpKVxuICAgICAgICAudGhlbihtYXRjaGluZyA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBtYXRjaGluZy5tYXAoc2NoZW1hSW5mbyA9PiByZXNvbHZlKHNjaGVtYUluZm8udXJsKS50aGVuKHNjaGVtYSA9PiBuZXcgSnNvblNjaGVtYVByb3Bvc2FsUHJvdmlkZXIoXG4gICAgICAgICAgICBzY2hlbWFJbmZvLmZpbGVNYXRjaCxcbiAgICAgICAgICAgIHdyYXAoc2NoZW1hKVxuICAgICAgICAgICkpKVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocHJvdmlkZXJzID0+IHRoaXMuY29tcG91bmRQcm92aWVyLmFkZFByb3ZpZGVycyhwcm92aWRlcnMpKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLmNvbXBvdW5kUHJvdmllci5oYXNQcm9wb3NhbHMoZmlsZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYmxhY2tMaXN0W2ZpbGUuZ2V0QmFzZU5hbWUoKV0gPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB0aGlzLmNvbXBvdW5kUHJvdmllci5nZXRQcm9wb3NhbHMocmVxdWVzdCkpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvdW5kUHJvdmllci5nZXRQcm9wb3NhbHMocmVxdWVzdClcbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiAnKidcbiAgfVxufVxuIl19