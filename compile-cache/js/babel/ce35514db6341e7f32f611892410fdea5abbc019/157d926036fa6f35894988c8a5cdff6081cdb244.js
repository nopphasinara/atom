Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsonSchemaProposalFactory = require('./json-schema-proposal-factory');

var _jsonSchemaResolver = require('./json-schema-resolver');

var _jsonSchema = require('./json-schema');

'use babel';

var JsonSchemaProposalProvider = (function () {
  function JsonSchemaProposalProvider(filePattern, schema) {
    _classCallCheck(this, JsonSchemaProposalProvider);

    this.filePattern = filePattern;
    this.schema = schema;
    this.proposalFactory = new _jsonSchemaProposalFactory.JsonSchemaProposalFactory();
  }

  _createClass(JsonSchemaProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      return Promise.resolve(this.proposalFactory.createProposals(request, this.schema));
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.filePattern;
    }
  }], [{
    key: 'createFromProvider',
    value: function createFromProvider(schemaProvider) {
      return (0, _jsonSchemaResolver.resolve)(schemaProvider.getSchemaURI()).then(function (schema) {
        return new JsonSchemaProposalProvider(schemaProvider.getFilePattern(), (0, _jsonSchema.wrap)(schema));
      });
    }
  }]);

  return JsonSchemaProposalProvider;
})();

exports.JsonSchemaProposalProvider = JsonSchemaProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXByb3Bvc2FsLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3lDQUUwQyxnQ0FBZ0M7O2tDQUNsRCx3QkFBd0I7OzBCQUMzQixlQUFlOztBQUpwQyxXQUFXLENBQUE7O0lBTUUsMEJBQTBCO0FBQzFCLFdBREEsMEJBQTBCLENBQ3pCLFdBQVcsRUFBRSxNQUFNLEVBQUU7MEJBRHRCLDBCQUEwQjs7QUFFbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRywwREFBK0IsQ0FBQTtHQUN2RDs7ZUFMVSwwQkFBMEI7O1dBT3pCLHNCQUFDLE9BQU8sRUFBRTtBQUNwQixhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0tBQ25GOzs7V0FFYSwwQkFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtLQUN4Qjs7O1dBRXdCLDRCQUFDLGNBQWMsRUFBRTtBQUN4QyxhQUFPLGlDQUFRLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07ZUFBSSxJQUFJLDBCQUEwQixDQUN6RixjQUFjLENBQUMsY0FBYyxFQUFFLEVBQy9CLHNCQUFLLE1BQU0sQ0FBQyxDQUNiO09BQUEsQ0FBQyxDQUFBO0tBQ0g7OztTQXBCVSwwQkFBMEIiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcHJvcG9zYWwtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBKc29uU2NoZW1hUHJvcG9zYWxGYWN0b3J5IH0gZnJvbSAnLi9qc29uLXNjaGVtYS1wcm9wb3NhbC1mYWN0b3J5J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJy4vanNvbi1zY2hlbWEtcmVzb2x2ZXInXG5pbXBvcnQgeyB3cmFwIH0gZnJvbSAnLi9qc29uLXNjaGVtYSdcblxuZXhwb3J0IGNsYXNzIEpzb25TY2hlbWFQcm9wb3NhbFByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoZmlsZVBhdHRlcm4sIHNjaGVtYSkge1xuICAgIHRoaXMuZmlsZVBhdHRlcm4gPSBmaWxlUGF0dGVyblxuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hXG4gICAgdGhpcy5wcm9wb3NhbEZhY3RvcnkgPSBuZXcgSnNvblNjaGVtYVByb3Bvc2FsRmFjdG9yeSgpXG4gIH1cblxuICBnZXRQcm9wb3NhbHMocmVxdWVzdCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5wcm9wb3NhbEZhY3RvcnkuY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHRoaXMuc2NoZW1hKSlcbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXR0ZXJuXG4gIH1cblxuICBzdGF0aWMgY3JlYXRlRnJvbVByb3ZpZGVyKHNjaGVtYVByb3ZpZGVyKSB7XG4gICAgcmV0dXJuIHJlc29sdmUoc2NoZW1hUHJvdmlkZXIuZ2V0U2NoZW1hVVJJKCkpLnRoZW4oc2NoZW1hID0+IG5ldyBKc29uU2NoZW1hUHJvcG9zYWxQcm92aWRlcihcbiAgICAgIHNjaGVtYVByb3ZpZGVyLmdldEZpbGVQYXR0ZXJuKCksXG4gICAgICB3cmFwKHNjaGVtYSlcbiAgICApKVxuICB9XG59XG4iXX0=