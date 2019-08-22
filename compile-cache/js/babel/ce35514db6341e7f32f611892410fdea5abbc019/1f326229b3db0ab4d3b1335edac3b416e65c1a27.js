Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _jsonSchemaVisitors = require('./json-schema-visitors');

var _jsonSchema = require('./json-schema');

var _utils = require('./utils');

'use babel';

var expandedSchemas = function expandedSchemas(schema) {
  if (schema instanceof _jsonSchema.CompositeSchema) {
    var schemas = [];
    schema.accept(new _jsonSchemaVisitors.SchemaFlattenerVisitor(), schemas);
    return schemas;
  }
  return [schema];
};

var possibleTypes = function possibleTypes(schema, segments) {
  if (segments.length === 0) {
    return expandedSchemas(schema);
  }
  var visitor = new _jsonSchemaVisitors.SchemaInspectorVisitor();
  return segments.reduce(function (schemas, segment) {
    var resolvedNextSchemas = schemas.map(function (s) {
      return expandedSchemas(s);
    });
    var nextSchemas = (0, _lodashFlatten2['default'])(resolvedNextSchemas).map(function (s) {
      return s.accept(visitor, segment);
    });
    return (0, _lodashFlatten2['default'])(nextSchemas);
  }, [schema]);
};

var KeyProposalFactory = (function () {
  function KeyProposalFactory() {
    _classCallCheck(this, KeyProposalFactory);
  }

  _createClass(KeyProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var contents = request.contents;
      var segments = request.segments;

      var unwrappedContents = (0, _utils.resolveObject)(segments, contents);
      var visitor = new _jsonSchemaVisitors.KeyProposalVisitor(unwrappedContents, new _jsonSchemaVisitors.SnippetProposalVisitor());
      var possibleTpes = possibleTypes(schema, segments);
      var proposals = possibleTpes.map(function (s) {
        return s.accept(visitor, request);
      });
      return (0, _lodashFlatten2['default'])(proposals);
    }
  }]);

  return KeyProposalFactory;
})();

var ValueProposalFactory = (function () {
  function ValueProposalFactory() {
    _classCallCheck(this, ValueProposalFactory);
  }

  _createClass(ValueProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var segments = request.segments;

      var schemas = possibleTypes(schema, segments);
      var visitor = new _jsonSchemaVisitors.ValueProposalVisitor(new _jsonSchemaVisitors.SnippetProposalVisitor());
      return (0, _lodashFlatten2['default'])(schemas.map(function (s) {
        return s.accept(visitor, request);
      }));
    }
  }]);

  return ValueProposalFactory;
})();

var JsonSchemaProposalFactory = (function () {
  function JsonSchemaProposalFactory() {
    _classCallCheck(this, JsonSchemaProposalFactory);

    this.keyProposalFactory = new KeyProposalFactory();
    this.valueProposalFactory = new ValueProposalFactory();
  }

  _createClass(JsonSchemaProposalFactory, [{
    key: 'createProposals',
    value: function createProposals(request, schema) {
      var visitor = new _jsonSchemaVisitors.ValueProposalVisitor(new _jsonSchemaVisitors.SnippetProposalVisitor());

      var isKeyPosition = request.isKeyPosition;
      var isValuePosition = request.isValuePosition;
      var isFileEmpty = request.isFileEmpty;

      if (isFileEmpty) {
        return (0, _lodashFlatten2['default'])(possibleTypes(schema, []).map(function (s) {
          return s.accept(visitor, request);
        }));
      }
      if (isKeyPosition) {
        return this.keyProposalFactory.createProposals(request, schema);
      } else if (isValuePosition) {
        return this.valueProposalFactory.createProposals(request, schema);
      }
      return [];
    }
  }]);

  return JsonSchemaProposalFactory;
})();

exports.JsonSchemaProposalFactory = JsonSchemaProposalFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXByb3Bvc2FsLWZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs2QkFFb0IsZ0JBQWdCOzs7O2tDQUU2Rix3QkFBd0I7OzBCQUN6SCxlQUFlOztxQkFDakIsU0FBUzs7QUFOdkMsV0FBVyxDQUFBOztBQVFYLElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBRyxNQUFNLEVBQUk7QUFDaEMsTUFBSSxNQUFNLHVDQUEyQixFQUFFO0FBQ3JDLFFBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNsQixVQUFNLENBQUMsTUFBTSxDQUFDLGdEQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3BELFdBQU8sT0FBTyxDQUFBO0dBQ2Y7QUFDRCxTQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Q0FDaEIsQ0FBQTs7QUFFRCxJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksTUFBTSxFQUFFLFFBQVEsRUFBSztBQUMxQyxNQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQy9CO0FBQ0QsTUFBTSxPQUFPLEdBQUcsZ0RBQTRCLENBQUE7QUFDNUMsU0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBSztBQUMzQyxRQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUksZUFBZSxDQUFDLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUNoRSxRQUFNLFdBQVcsR0FBRyxnQ0FBUSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDckYsV0FBTyxnQ0FBUSxXQUFXLENBQUMsQ0FBQTtHQUM1QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUNiLENBQUE7O0lBR0ssa0JBQWtCO1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCOztXQUNQLHlCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7VUFDdkIsUUFBUSxHQUFlLE9BQU8sQ0FBOUIsUUFBUTtVQUFFLFFBQVEsR0FBSyxPQUFPLENBQXBCLFFBQVE7O0FBQzFCLFVBQU0saUJBQWlCLEdBQUcsMEJBQWMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzNELFVBQU0sT0FBTyxHQUFHLDJDQUF1QixpQkFBaUIsRUFBRSxnREFBNEIsQ0FBQyxDQUFBO0FBQ3ZGLFVBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDcEQsVUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDbkUsYUFBTyxnQ0FBUSxTQUFTLENBQUMsQ0FBQTtLQUMxQjs7O1NBUkcsa0JBQWtCOzs7SUFXbEIsb0JBQW9CO1dBQXBCLG9CQUFvQjswQkFBcEIsb0JBQW9COzs7ZUFBcEIsb0JBQW9COztXQUNULHlCQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7VUFDdkIsUUFBUSxHQUFLLE9BQU8sQ0FBcEIsUUFBUTs7QUFDaEIsVUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUMvQyxVQUFNLE9BQU8sR0FBRyw2Q0FBeUIsZ0RBQTRCLENBQUMsQ0FBQTtBQUN0RSxhQUFPLGdDQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUE7S0FDN0Q7OztTQU5HLG9CQUFvQjs7O0lBU2IseUJBQXlCO0FBQ3pCLFdBREEseUJBQXlCLEdBQ3RCOzBCQURILHlCQUF5Qjs7QUFFbEMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQTtBQUNsRCxRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFBO0dBQ3ZEOztlQUpVLHlCQUF5Qjs7V0FNckIseUJBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvQixVQUFNLE9BQU8sR0FBRyw2Q0FBeUIsZ0RBQTRCLENBQUMsQ0FBQTs7VUFFOUQsYUFBYSxHQUFtQyxPQUFPLENBQXZELGFBQWE7VUFBRSxlQUFlLEdBQWtCLE9BQU8sQ0FBeEMsZUFBZTtVQUFFLFdBQVcsR0FBSyxPQUFPLENBQXZCLFdBQVc7O0FBQ25ELFVBQUksV0FBVyxFQUFFO0FBQ2YsZUFBTyxnQ0FBUSxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7aUJBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1NBQUEsQ0FBQyxDQUFDLENBQUE7T0FDL0U7QUFDRCxVQUFJLGFBQWEsRUFBRTtBQUNqQixlQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ2hFLE1BQU0sSUFBSSxlQUFlLEVBQUU7QUFDMUIsZUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUNsRTtBQUNELGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztTQW5CVSx5QkFBeUIiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcHJvcG9zYWwtZmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBmbGF0dGVuIGZyb20gJ2xvZGFzaC9mbGF0dGVuJ1xuXG5pbXBvcnQgeyBLZXlQcm9wb3NhbFZpc2l0b3IsIFZhbHVlUHJvcG9zYWxWaXNpdG9yLCBTbmlwcGV0UHJvcG9zYWxWaXNpdG9yLCBTY2hlbWFGbGF0dGVuZXJWaXNpdG9yLCBTY2hlbWFJbnNwZWN0b3JWaXNpdG9yIH0gZnJvbSAnLi9qc29uLXNjaGVtYS12aXNpdG9ycydcbmltcG9ydCB7IENvbXBvc2l0ZVNjaGVtYSB9IGZyb20gJy4vanNvbi1zY2hlbWEnXG5pbXBvcnQgeyByZXNvbHZlT2JqZWN0IH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgZXhwYW5kZWRTY2hlbWFzID0gc2NoZW1hID0+IHtcbiAgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIENvbXBvc2l0ZVNjaGVtYSkge1xuICAgIGNvbnN0IHNjaGVtYXMgPSBbXVxuICAgIHNjaGVtYS5hY2NlcHQobmV3IFNjaGVtYUZsYXR0ZW5lclZpc2l0b3IoKSwgc2NoZW1hcylcbiAgICByZXR1cm4gc2NoZW1hc1xuICB9XG4gIHJldHVybiBbc2NoZW1hXVxufVxuXG5jb25zdCBwb3NzaWJsZVR5cGVzID0gKHNjaGVtYSwgc2VnbWVudHMpID0+IHtcbiAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBleHBhbmRlZFNjaGVtYXMoc2NoZW1hKVxuICB9XG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgU2NoZW1hSW5zcGVjdG9yVmlzaXRvcigpXG4gIHJldHVybiBzZWdtZW50cy5yZWR1Y2UoKHNjaGVtYXMsIHNlZ21lbnQpID0+IHtcbiAgICBjb25zdCByZXNvbHZlZE5leHRTY2hlbWFzID0gc2NoZW1hcy5tYXAocyA9PiBleHBhbmRlZFNjaGVtYXMocykpXG4gICAgY29uc3QgbmV4dFNjaGVtYXMgPSBmbGF0dGVuKHJlc29sdmVkTmV4dFNjaGVtYXMpLm1hcChzID0+IHMuYWNjZXB0KHZpc2l0b3IsIHNlZ21lbnQpKVxuICAgIHJldHVybiBmbGF0dGVuKG5leHRTY2hlbWFzKVxuICB9LCBbc2NoZW1hXSlcbn1cblxuXG5jbGFzcyBLZXlQcm9wb3NhbEZhY3Rvcnkge1xuICBjcmVhdGVQcm9wb3NhbHMocmVxdWVzdCwgc2NoZW1hKSB7XG4gICAgY29uc3QgeyBjb250ZW50cywgc2VnbWVudHMgfSA9IHJlcXVlc3RcbiAgICBjb25zdCB1bndyYXBwZWRDb250ZW50cyA9IHJlc29sdmVPYmplY3Qoc2VnbWVudHMsIGNvbnRlbnRzKVxuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgS2V5UHJvcG9zYWxWaXNpdG9yKHVud3JhcHBlZENvbnRlbnRzLCBuZXcgU25pcHBldFByb3Bvc2FsVmlzaXRvcigpKVxuICAgIGNvbnN0IHBvc3NpYmxlVHBlcyA9IHBvc3NpYmxlVHlwZXMoc2NoZW1hLCBzZWdtZW50cylcbiAgICBjb25zdCBwcm9wb3NhbHMgPSBwb3NzaWJsZVRwZXMubWFwKHMgPT4gcy5hY2NlcHQodmlzaXRvciwgcmVxdWVzdCkpXG4gICAgcmV0dXJuIGZsYXR0ZW4ocHJvcG9zYWxzKVxuICB9XG59XG5cbmNsYXNzIFZhbHVlUHJvcG9zYWxGYWN0b3J5IHtcbiAgY3JlYXRlUHJvcG9zYWxzKHJlcXVlc3QsIHNjaGVtYSkge1xuICAgIGNvbnN0IHsgc2VnbWVudHMgfSA9IHJlcXVlc3RcbiAgICBjb25zdCBzY2hlbWFzID0gcG9zc2libGVUeXBlcyhzY2hlbWEsIHNlZ21lbnRzKVxuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgVmFsdWVQcm9wb3NhbFZpc2l0b3IobmV3IFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IoKSlcbiAgICByZXR1cm4gZmxhdHRlbihzY2hlbWFzLm1hcChzID0+IHMuYWNjZXB0KHZpc2l0b3IsIHJlcXVlc3QpKSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYVByb3Bvc2FsRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5UHJvcG9zYWxGYWN0b3J5ID0gbmV3IEtleVByb3Bvc2FsRmFjdG9yeSgpXG4gICAgdGhpcy52YWx1ZVByb3Bvc2FsRmFjdG9yeSA9IG5ldyBWYWx1ZVByb3Bvc2FsRmFjdG9yeSgpXG4gIH1cblxuICBjcmVhdGVQcm9wb3NhbHMocmVxdWVzdCwgc2NoZW1hKSB7XG4gICAgY29uc3QgdmlzaXRvciA9IG5ldyBWYWx1ZVByb3Bvc2FsVmlzaXRvcihuZXcgU25pcHBldFByb3Bvc2FsVmlzaXRvcigpKVxuXG4gICAgY29uc3QgeyBpc0tleVBvc2l0aW9uLCBpc1ZhbHVlUG9zaXRpb24sIGlzRmlsZUVtcHR5IH0gPSByZXF1ZXN0XG4gICAgaWYgKGlzRmlsZUVtcHR5KSB7XG4gICAgICByZXR1cm4gZmxhdHRlbihwb3NzaWJsZVR5cGVzKHNjaGVtYSwgW10pLm1hcChzID0+IHMuYWNjZXB0KHZpc2l0b3IsIHJlcXVlc3QpKSlcbiAgICB9XG4gICAgaWYgKGlzS2V5UG9zaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLmtleVByb3Bvc2FsRmFjdG9yeS5jcmVhdGVQcm9wb3NhbHMocmVxdWVzdCwgc2NoZW1hKVxuICAgIH0gZWxzZSBpZiAoaXNWYWx1ZVBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVByb3Bvc2FsRmFjdG9yeS5jcmVhdGVQcm9wb3NhbHMocmVxdWVzdCwgc2NoZW1hKVxuICAgIH1cbiAgICByZXR1cm4gW11cbiAgfVxufVxuIl19