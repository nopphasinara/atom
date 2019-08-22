Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _uriJs = require('uri-js');

var _uriJs2 = _interopRequireDefault(_uriJs);

var _lodashIsNil = require('lodash/isNil');

var _lodashIsNil2 = _interopRequireDefault(_lodashIsNil);

var _lodashIsEmpty = require('lodash/isEmpty');

var _lodashIsEmpty2 = _interopRequireDefault(_lodashIsEmpty);

var _lodashAssign = require('lodash/assign');

var _lodashAssign2 = _interopRequireDefault(_lodashAssign);

var _lodashClone = require('lodash/clone');

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

var _lodashValues = require('lodash/values');

var _lodashValues2 = _interopRequireDefault(_lodashValues);

var _jsonSchemaLoader = require('./json-schema-loader');

var _jsonSchemaTypes = require('./json-schema-types');

'use babel';

var updateSchema = function updateSchema(node) {
  return function (schema) {
    // mutation, not pretty
    delete node['$ref'];
    (0, _lodashAssign2['default'])(node, schema);
  };
};

var resolveInSameDocument = function resolveInSameDocument(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var schema = _x,
        segments = _x2;
    _again = false;

    if ((0, _lodashIsEmpty2['default'])(segments)) {
      return schema;
    }

    var _segments = _toArray(segments);

    var key = _segments[0];

    var tail = _segments.slice(1);

    if (key === '#') {
      _x = schema;
      _x2 = tail;
      _again = true;
      _segments = key = tail = undefined;
      continue _function;
    }
    var subSchema = schema[key];
    _x = subSchema;
    _x2 = tail;
    _again = true;
    _segments = key = tail = subSchema = undefined;
    continue _function;
  }
};

var resolveDocument = function resolveDocument(_x3, _x4) {
  var _again2 = true;

  _function2: while (_again2) {
    var root = _x3,
        node = _x4;
    _again2 = false;
    var $ref = node.$ref;

    if ((0, _lodashIsNil2['default'])($ref)) {
      return Promise.resolve(root);
    }

    var uri = _uriJs2['default'].parse($ref);

    if (uri.reference === 'same-document') {
      updateSchema(node)(resolveInSameDocument(root, $ref.split('/')));
      _x3 = root;
      _x4 = node;
      _again2 = true;
      $ref = uri = undefined;
      continue _function2;
    }

    return (0, _jsonSchemaLoader.loadSchema)($ref).then(function (schema) {
      return resolveInSameDocument(schema, (uri.fragment || '').split('/'));
    }).then(updateSchema(node)).then(function () {
      return node.$ref ? resolveDocument(root, node) : null;
    });
  }
};

var findChildNodes = function findChildNodes(node) {
  // mutation, not pretty but has to be done somewhere
  if ((0, _lodashIsArray2['default'])(node.type)) {
    var childSchemas = node.type.map(function (type) {
      return (0, _lodashAssign2['default'])((0, _lodashClone2['default'])(node), { type: type });
    });
    delete node['type'];
    node.oneOf = childSchemas;
  }

  switch ((0, _jsonSchemaTypes.schemaType)(node)) {
    case _jsonSchemaTypes.ALL_OF_TYPE:
      return node.allOf;
    case _jsonSchemaTypes.ANY_OF_TYPE:
      return node.anyOf;
    case _jsonSchemaTypes.ONE_OF_TYPE:
      return node.oneOf;
    case _jsonSchemaTypes.OBJECT_TYPE:
      return (0, _lodashValues2['default'])(node.properties || {});
    case _jsonSchemaTypes.ARRAY_TYPE:
      return [node.items || {}];
    default:
      return [];
  }
};

var traverseResolve = function traverseResolve(root, node) {
  var resolvedNode = node.$ref ? resolveDocument(root, node) : Promise.resolve();
  return resolvedNode.then(function () {
    var childNodes = findChildNodes(node);
    var childResolvePromises = childNodes.map(function (childNode) {
      return traverseResolve(root, childNode);
    });
    return Promise.all(childResolvePromises);
  });
};

var resolve = function resolve(uri) {
  return (0, _jsonSchemaLoader.loadSchema)(uri).then(function (root) {
    return traverseResolve(root, root).then(function () {
      return root;
    });
  });
};
exports.resolve = resolve;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXJlc29sdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUVrQixRQUFROzs7OzJCQUNSLGNBQWM7Ozs7NkJBQ1osZ0JBQWdCOzs7OzRCQUNqQixlQUFlOzs7OzJCQUNoQixjQUFjOzs7OzZCQUNaLGdCQUFnQjs7Ozs0QkFDakIsZUFBZTs7OztnQ0FFUCxzQkFBc0I7OytCQUMwQyxxQkFBcUI7O0FBWGhILFdBQVcsQ0FBQTs7QUFhWCxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBRyxJQUFJO1NBQUksVUFBQSxNQUFNLEVBQUk7O0FBRXJDLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25CLG1DQUFPLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtHQUNyQjtDQUFBLENBQUE7O0FBRUQsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUI7Ozs0QkFBeUI7UUFBckIsTUFBTTtRQUFFLFFBQVE7OztBQUM3QyxRQUFJLGdDQUFRLFFBQVEsQ0FBQyxFQUFFO0FBQ3JCLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OzZCQUNzQixRQUFROztRQUF4QixHQUFHOztRQUFLLElBQUk7O0FBQ25CLFFBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtXQUNjLE1BQU07WUFBRSxJQUFJOztrQkFGcEMsR0FBRyxHQUFLLElBQUk7O0tBR2xCO0FBQ0QsUUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ0EsU0FBUztVQUFFLElBQUk7O2dCQUxyQyxHQUFHLEdBQUssSUFBSSxHQUliLFNBQVM7O0dBRWhCO0NBQUEsQ0FBQTs7QUFFRCxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlOzs7OEJBQW1CO1FBQWYsSUFBSTtRQUFFLElBQUk7O1FBQ3pCLElBQUksR0FBSyxJQUFJLENBQWIsSUFBSTs7QUFFWixRQUFJ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QUFDLElBQUksQ0FBQzthQUFNLElBQUk7S0FBQSxDQUFDO0dBQUEsQ0FBQztDQUFBLENBQUEiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvanNvbi1zY2hlbWEtcmVzb2x2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgdXJpSnMgZnJvbSAndXJpLWpzJ1xuaW1wb3J0IGlzTmlsIGZyb20gJ2xvZGFzaC9pc05pbCdcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2xvZGFzaC9pc0VtcHR5J1xuaW1wb3J0IGFzc2lnbiBmcm9tICdsb2Rhc2gvYXNzaWduJ1xuaW1wb3J0IGNsb25lIGZyb20gJ2xvZGFzaC9jbG9uZSdcbmltcG9ydCBpc0FycmF5IGZyb20gJ2xvZGFzaC9pc0FycmF5J1xuaW1wb3J0IHZhbHVlcyBmcm9tICdsb2Rhc2gvdmFsdWVzJ1xuXG5pbXBvcnQgeyBsb2FkU2NoZW1hIH0gZnJvbSAnLi9qc29uLXNjaGVtYS1sb2FkZXInXG5pbXBvcnQgeyBzY2hlbWFUeXBlLCBBTExfT0ZfVFlQRSwgQU5ZX09GX1RZUEUsIE9ORV9PRl9UWVBFLCBPQkpFQ1RfVFlQRSwgQVJSQVlfVFlQRSB9IGZyb20gJy4vanNvbi1zY2hlbWEtdHlwZXMnXG5cbmNvbnN0IHVwZGF0ZVNjaGVtYSA9IG5vZGUgPT4gc2NoZW1hID0+IHtcbiAgLy8gbXV0YXRpb24sIG5vdCBwcmV0dHlcbiAgZGVsZXRlIG5vZGVbJyRyZWYnXVxuICBhc3NpZ24obm9kZSwgc2NoZW1hKVxufVxuXG5jb25zdCByZXNvbHZlSW5TYW1lRG9jdW1lbnQgPSAoc2NoZW1hLCBzZWdtZW50cykgPT4ge1xuICBpZiAoaXNFbXB0eShzZWdtZW50cykpIHtcbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cbiAgY29uc3QgW2tleSwgLi4udGFpbF0gPSBzZWdtZW50c1xuICBpZiAoa2V5ID09PSAnIycpIHtcbiAgICByZXR1cm4gcmVzb2x2ZUluU2FtZURvY3VtZW50KHNjaGVtYSwgdGFpbClcbiAgfVxuICBjb25zdCBzdWJTY2hlbWEgPSBzY2hlbWFba2V5XVxuICByZXR1cm4gcmVzb2x2ZUluU2FtZURvY3VtZW50KHN1YlNjaGVtYSwgdGFpbClcbn1cblxuY29uc3QgcmVzb2x2ZURvY3VtZW50ID0gKHJvb3QsIG5vZGUpID0+IHtcbiAgY29uc3QgeyAkcmVmIH0gPSBub2RlXG5cbiAgaWYgKGlzTmlsKCRyZWYpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyb290KVxuICB9XG5cbiAgY29uc3QgdXJpID0gdXJpSnMucGFyc2UoJHJlZilcblxuICBpZiAodXJpLnJlZmVyZW5jZSA9PT0gJ3NhbWUtZG9jdW1lbnQnKSB7XG4gICAgdXBkYXRlU2NoZW1hKG5vZGUpKHJlc29sdmVJblNhbWVEb2N1bWVudChyb290LCAkcmVmLnNwbGl0KCcvJykpKVxuICAgIHJldHVybiByZXNvbHZlRG9jdW1lbnQocm9vdCwgbm9kZSlcbiAgfVxuXG4gIHJldHVybiBsb2FkU2NoZW1hKCRyZWYpXG4gICAgLnRoZW4oc2NoZW1hID0+IHJlc29sdmVJblNhbWVEb2N1bWVudChzY2hlbWEsICh1cmkuZnJhZ21lbnQgfHwgJycpLnNwbGl0KCcvJykpKVxuICAgIC50aGVuKHVwZGF0ZVNjaGVtYShub2RlKSlcbiAgICAudGhlbigoKSA9PiBub2RlLiRyZWYgPyByZXNvbHZlRG9jdW1lbnQocm9vdCwgbm9kZSkgOiBudWxsKVxufVxuXG5jb25zdCBmaW5kQ2hpbGROb2RlcyA9IG5vZGUgPT4ge1xuICAvLyBtdXRhdGlvbiwgbm90IHByZXR0eSBidXQgaGFzIHRvIGJlIGRvbmUgc29tZXdoZXJlXG4gIGlmIChpc0FycmF5KG5vZGUudHlwZSkpIHtcbiAgICBjb25zdCBjaGlsZFNjaGVtYXMgPSBub2RlLnR5cGUubWFwKHR5cGUgPT4gYXNzaWduKGNsb25lKG5vZGUpLCB7IHR5cGUgfSkpXG4gICAgZGVsZXRlIG5vZGVbJ3R5cGUnXVxuICAgIG5vZGUub25lT2YgPSBjaGlsZFNjaGVtYXNcbiAgfVxuXG4gIHN3aXRjaCAoc2NoZW1hVHlwZShub2RlKSkge1xuICAgIGNhc2UgQUxMX09GX1RZUEU6IHJldHVybiBub2RlLmFsbE9mXG4gICAgY2FzZSBBTllfT0ZfVFlQRTogcmV0dXJuIG5vZGUuYW55T2ZcbiAgICBjYXNlIE9ORV9PRl9UWVBFOiByZXR1cm4gbm9kZS5vbmVPZlxuICAgIGNhc2UgT0JKRUNUX1RZUEU6IHJldHVybiB2YWx1ZXMobm9kZS5wcm9wZXJ0aWVzIHx8IHt9KVxuICAgIGNhc2UgQVJSQVlfVFlQRTogcmV0dXJuIFtub2RlLml0ZW1zIHx8IHt9XVxuICAgIGRlZmF1bHQ6IHJldHVybiBbXVxuICB9XG59XG5cbmNvbnN0IHRyYXZlcnNlUmVzb2x2ZSA9IChyb290LCBub2RlKSA9PiB7XG4gIGNvbnN0IHJlc29sdmVkTm9kZSA9IChub2RlLiRyZWYgPyByZXNvbHZlRG9jdW1lbnQocm9vdCwgbm9kZSkgOiBQcm9taXNlLnJlc29sdmUoKSlcbiAgcmV0dXJuIHJlc29sdmVkTm9kZS50aGVuKCgpID0+IHtcbiAgICBjb25zdCBjaGlsZE5vZGVzID0gZmluZENoaWxkTm9kZXMobm9kZSlcbiAgICBjb25zdCBjaGlsZFJlc29sdmVQcm9taXNlcyA9IGNoaWxkTm9kZXMubWFwKGNoaWxkTm9kZSA9PiB0cmF2ZXJzZVJlc29sdmUocm9vdCwgY2hpbGROb2RlKSlcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2hpbGRSZXNvbHZlUHJvbWlzZXMpXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlID0gdXJpID0+IGxvYWRTY2hlbWEodXJpKVxuICAudGhlbihyb290ID0+IHRyYXZlcnNlUmVzb2x2ZShyb290LCByb290KS50aGVuKCgpID0+IHJvb3QpKVxuXG4iXX0=