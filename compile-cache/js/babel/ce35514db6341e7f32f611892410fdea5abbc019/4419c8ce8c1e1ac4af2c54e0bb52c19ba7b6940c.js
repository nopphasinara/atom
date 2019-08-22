Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFlatten = require('lodash/flatten');

var _lodashFlatten2 = _interopRequireDefault(_lodashFlatten);

var _utils = require('./utils');

var _jsonSchema = require('./json-schema');

/** Base implementation for JSON schema visitor. Applies the parameter function as all non-overwritten methods. */
'use babel';

var DefaultSchemaVisitor = (function () {
  function DefaultSchemaVisitor(defaultVisit) {
    _classCallCheck(this, DefaultSchemaVisitor);

    this.defaultVisit = defaultVisit;
  }

  /** Visitor for finding the child schemas of any schema. */

  // Complex schemas

  _createClass(DefaultSchemaVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }

    // Simple schemas
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }, {
    key: 'visitAnySchema',
    value: function visitAnySchema(schema, parameter) {
      return this.defaultVisit(schema, parameter);
    }
  }]);

  return DefaultSchemaVisitor;
})();

exports.DefaultSchemaVisitor = DefaultSchemaVisitor;

var SchemaInspectorVisitor = (function (_DefaultSchemaVisitor) {
  _inherits(SchemaInspectorVisitor, _DefaultSchemaVisitor);

  function SchemaInspectorVisitor() {
    _classCallCheck(this, SchemaInspectorVisitor);

    _get(Object.getPrototypeOf(SchemaInspectorVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
  }

  /** Visitor for flattening nested schemas. */

  _createClass(SchemaInspectorVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, segment) {
      var childSchema = schema.properties[segment];
      if (childSchema) {
        return [childSchema];
      }
      return schema.patternProperties.filter(function (_ref) {
        var pattern = _ref.pattern;
        return pattern.test(segment);
      }).map(function (p) {
        return p.schema;
      });
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema) {
      return [schema.itemSchema];
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, segment) {
      var _this = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this, segment);
      }));
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, segment) {
      var _this2 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this2, segment);
      }));
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, segment) {
      var _this3 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.map(function (s) {
        return s.accept(_this3, segment);
      }));
    }
  }]);

  return SchemaInspectorVisitor;
})(DefaultSchemaVisitor);

exports.SchemaInspectorVisitor = SchemaInspectorVisitor;

var SchemaFlattenerVisitor = (function (_DefaultSchemaVisitor2) {
  _inherits(SchemaFlattenerVisitor, _DefaultSchemaVisitor2);

  function SchemaFlattenerVisitor() {
    _classCallCheck(this, SchemaFlattenerVisitor);

    _get(Object.getPrototypeOf(SchemaFlattenerVisitor.prototype), 'constructor', this).call(this, function (schema, parameter) {
      return parameter.push(schema);
    });
  }

  /** Visitor for providing value snippets for the given schema. */

  _createClass(SchemaFlattenerVisitor, [{
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, collector) {
      var _this4 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this4, collector);
      });
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, collector) {
      var _this5 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this5, collector);
      });
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, collector) {
      var _this6 = this;

      schema.schemas.forEach(function (childSchema) {
        return childSchema.accept(_this6, collector);
      });
    }
  }]);

  return SchemaFlattenerVisitor;
})(DefaultSchemaVisitor);

exports.SchemaFlattenerVisitor = SchemaFlattenerVisitor;

var SnippetProposalVisitor = (function (_DefaultSchemaVisitor3) {
  _inherits(SnippetProposalVisitor, _DefaultSchemaVisitor3);

  function SnippetProposalVisitor() {
    _classCallCheck(this, SnippetProposalVisitor);

    _get(Object.getPrototypeOf(SnippetProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return SnippetProposalVisitor.DEFAULT;
    });
  }

  _createClass(SnippetProposalVisitor, [{
    key: 'comma',
    value: function comma(request) {
      return request.shouldAddComma ? ',' : '';
    }
  }, {
    key: 'visitStringLike',
    value: function visitStringLike(schema, request) {
      var isBetweenQuotes = request.isBetweenQuotes;

      var q = isBetweenQuotes ? '' : '"';
      return q + '${1:' + (schema.defaultValue || '') + '}' + q + this.comma(request);
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, request) {
      return this.visitStringLike(schema, request);
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:' + (schema.defaultValue || '0') + '}' + this.comma(request);
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:' + (schema.defaultValue || 'false') + '}' + this.comma(request);
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '${1:null}' + this.comma(request);
    }
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, request) {
      return this.visitStringLike(schema, request);
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '[$1]' + this.comma(request);
    }
  }, {
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      return request.isBetweenQuotes ? this.defaultVisit(schema, request) : '{$1}' + this.comma(request);
    }
  }]);

  return SnippetProposalVisitor;
})(DefaultSchemaVisitor);

exports.SnippetProposalVisitor = SnippetProposalVisitor;

SnippetProposalVisitor.DEFAULT = '$1';

/** Visitor for providing an array of IProposal s for any schema. */

var ValueProposalVisitor = (function (_DefaultSchemaVisitor4) {
  _inherits(ValueProposalVisitor, _DefaultSchemaVisitor4);

  function ValueProposalVisitor(snippetVisitor) {
    _classCallCheck(this, ValueProposalVisitor);

    _get(Object.getPrototypeOf(ValueProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
    this.snippetVisitor = snippetVisitor;
  }

  /** Visitor for providing an array of IProposal, when editing key position */

  _createClass(ValueProposalVisitor, [{
    key: 'createBaseProposalFor',
    value: function createBaseProposalFor(schema) {
      return {
        description: schema.description,
        rightLabel: schema.displayType,
        type: 'value'
      };
    }
  }, {
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = '{}';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitArraySchema',
    value: function visitArraySchema(schema, request) {
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = '[]';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitStringSchema',
    value: function visitStringSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '"' + schema.defaultValue + '"' : '""';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitNumberSchema',
    value: function visitNumberSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '' + schema.defaultValue : '0';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitBooleanSchema',
    value: function visitBooleanSchema(schema, request) {
      var _this7 = this;

      if (request.isBetweenQuotes) {
        return [];
      }
      return [true, false].map(function (bool) {
        var proposal = _this7.createBaseProposalFor(schema);
        proposal.displayText = bool ? 'true' : 'false';
        proposal.snippet = proposal.displayText + '${1}' + _this7.snippetVisitor.comma(request);
        return proposal;
      });
    }
  }, {
    key: 'visitNullSchema',
    value: function visitNullSchema(schema, request) {
      if (request.isBetweenQuotes) {
        return [];
      }
      var proposal = this.createBaseProposalFor(schema);
      proposal.displayText = schema.defaultValue ? '' + schema.defaultValue : 'null';
      proposal.snippet = schema.accept(this.snippetVisitor, request);
      return [proposal];
    }
  }, {
    key: 'visitEnumSchema',
    value: function visitEnumSchema(schema, request) {
      var _this8 = this;

      var segments = request.segments;
      var contents = request.contents;

      var possibleValues = schema.values;

      if (schema.parent instanceof _jsonSchema.ArraySchema && schema.parent.hasUniqueItems()) {
        (function () {
          var alreadyPresentValues = (0, _utils.resolveObject)(segments.slice(0, segments.length - 1), contents) || [];
          possibleValues = possibleValues.filter(function (value) {
            return alreadyPresentValues.indexOf(value) < 0;
          });
        })();
      }

      return possibleValues.map(function (enumValue) {
        var proposal = _this8.createBaseProposalFor(schema);
        proposal.displayText = enumValue;
        if (request.isBetweenQuotes) {
          proposal.text = enumValue;
        } else {
          proposal.snippet = '"' + enumValue + '${1}"' + _this8.snippetVisitor.comma(request);
        }
        return proposal;
      });
    }
  }, {
    key: 'visitCompositeSchema',
    value: function visitCompositeSchema(schema, request) {
      var _this9 = this;

      return (0, _lodashFlatten2['default'])(schema.schemas.filter(function (s) {
        return !(s instanceof _jsonSchema.AnyOfSchema);
      }).map(function (s) {
        return s.accept(_this9, request).filter(function (r) {
          return r.snippet !== SnippetProposalVisitor.DEFAULT;
        });
      }));
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }]);

  return ValueProposalVisitor;
})(DefaultSchemaVisitor);

exports.ValueProposalVisitor = ValueProposalVisitor;

var KeyProposalVisitor = (function (_DefaultSchemaVisitor5) {
  _inherits(KeyProposalVisitor, _DefaultSchemaVisitor5);

  function KeyProposalVisitor(unwrappedContents, snippetVisitor) {
    _classCallCheck(this, KeyProposalVisitor);

    _get(Object.getPrototypeOf(KeyProposalVisitor.prototype), 'constructor', this).call(this, function () {
      return [];
    });
    this.unwrappedContents = unwrappedContents;
    this.snippetVisitor = snippetVisitor;
  }

  _createClass(KeyProposalVisitor, [{
    key: 'visitObjectSchema',
    value: function visitObjectSchema(schema, request) {
      var _this10 = this;

      var prefix = request.prefix;
      var isBetweenQuotes = request.isBetweenQuotes;

      return schema.keys.filter(function (key) {
        return !_this10.unwrappedContents || key.indexOf(prefix) >= 0 && !_this10.unwrappedContents.hasOwnProperty(key);
      }).map(function (key) {
        var valueSchema = schema.properties[key];
        var proposal = {};

        proposal.description = valueSchema.description;
        proposal.type = 'property';
        proposal.displayText = key;
        proposal.rightLabel = valueSchema.displayType;
        if (isBetweenQuotes) {
          proposal.text = key;
        } else {
          var value = schema.properties[key].accept(_this10.snippetVisitor, request);
          proposal.snippet = '"' + key + '": ' + value;
        }
        return proposal;
      });
    }
  }, {
    key: 'visitCompositeSchema',
    value: function visitCompositeSchema(schema, request) {
      var _this11 = this;

      var proposals = schema.schemas.filter(function (s) {
        return s instanceof _jsonSchema.ObjectSchema;
      }).map(function (s) {
        return s.accept(_this11, request);
      });
      return (0, _lodashFlatten2['default'])(proposals);
    }
  }, {
    key: 'visitAllOfSchema',
    value: function visitAllOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitAnyOfSchema',
    value: function visitAnyOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }, {
    key: 'visitOneOfSchema',
    value: function visitOneOfSchema(schema, request) {
      return this.visitCompositeSchema(schema, request);
    }
  }]);

  return KeyProposalVisitor;
})(DefaultSchemaVisitor);

exports.KeyProposalVisitor = KeyProposalVisitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLXZpc2l0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzZCQUVvQixnQkFBZ0I7Ozs7cUJBQ04sU0FBUzs7MEJBQ2dCLGVBQWU7OztBQUp0RSxXQUFXLENBQUE7O0lBT0Usb0JBQW9CO0FBQ3BCLFdBREEsb0JBQW9CLENBQ25CLFlBQVksRUFBRTswQkFEZixvQkFBb0I7O0FBRTdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO0dBQ2pDOzs7Ozs7ZUFIVSxvQkFBb0I7O1dBS2QsMkJBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNuQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDZSwwQkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ2xDLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDNUM7OztXQUNlLDBCQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDbEMsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUM1Qzs7O1dBQ2UsMEJBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNsQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDZSwwQkFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ2xDLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7S0FDNUM7Ozs7O1dBR2MseUJBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNqQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDZ0Is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Y2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9qc29uLXNjaGVtYS12aXNpdG9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBmbGF0dGVuIGZyb20gJ2xvZGFzaC9mbGF0dGVuJ1xuaW1wb3J0IHsgcmVzb2x2ZU9iamVjdCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBBcnJheVNjaGVtYSwgT2JqZWN0U2NoZW1hLCBBbnlPZlNjaGVtYSB9IGZyb20gJy4vanNvbi1zY2hlbWEnXG5cbi8qKiBCYXNlIGltcGxlbWVudGF0aW9uIGZvciBKU09OIHNjaGVtYSB2aXNpdG9yLiBBcHBsaWVzIHRoZSBwYXJhbWV0ZXIgZnVuY3Rpb24gYXMgYWxsIG5vbi1vdmVyd3JpdHRlbiBtZXRob2RzLiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRTY2hlbWFWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdFZpc2l0KSB7XG4gICAgdGhpcy5kZWZhdWx0VmlzaXQgPSBkZWZhdWx0VmlzaXRcbiAgfVxuICAvLyBDb21wbGV4IHNjaGVtYXNcbiAgdmlzaXRPYmplY3RTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXRBcnJheVNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdE9uZU9mU2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG4gIHZpc2l0QWxsT2ZTY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXRBbnlPZlNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuXG4gIC8vIFNpbXBsZSBzY2hlbWFzXG4gIHZpc2l0RW51bVNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdFN0cmluZ1NjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdE51bWJlclNjaGVtYShzY2hlbWEsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHBhcmFtZXRlcilcbiAgfVxuICB2aXNpdEJvb2xlYW5TY2hlbWEoc2NoZW1hLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCBwYXJhbWV0ZXIpXG4gIH1cbiAgdmlzaXROdWxsU2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG4gIHZpc2l0QW55U2NoZW1hKHNjaGVtYSwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZpc2l0KHNjaGVtYSwgcGFyYW1ldGVyKVxuICB9XG59XG5cbi8qKiBWaXNpdG9yIGZvciBmaW5kaW5nIHRoZSBjaGlsZCBzY2hlbWFzIG9mIGFueSBzY2hlbWEuICovXG5leHBvcnQgY2xhc3MgU2NoZW1hSW5zcGVjdG9yVmlzaXRvciBleHRlbmRzIERlZmF1bHRTY2hlbWFWaXNpdG9yIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigoKSA9PiBbXSlcbiAgfVxuXG4gIHZpc2l0T2JqZWN0U2NoZW1hKHNjaGVtYSwgc2VnbWVudCkge1xuICAgIGNvbnN0IGNoaWxkU2NoZW1hID0gc2NoZW1hLnByb3BlcnRpZXNbc2VnbWVudF1cbiAgICBpZiAoY2hpbGRTY2hlbWEpIHtcbiAgICAgIHJldHVybiBbY2hpbGRTY2hlbWFdXG4gICAgfVxuICAgIHJldHVybiBzY2hlbWEucGF0dGVyblByb3BlcnRpZXNcbiAgICAgIC5maWx0ZXIoKHsgcGF0dGVybiB9KSA9PiBwYXR0ZXJuLnRlc3Qoc2VnbWVudCkpXG4gICAgICAubWFwKHAgPT4gcC5zY2hlbWEpXG4gIH1cblxuICB2aXNpdEFycmF5U2NoZW1hKHNjaGVtYSkge1xuICAgIHJldHVybiBbc2NoZW1hLml0ZW1TY2hlbWFdXG4gIH1cblxuICB2aXNpdE9uZU9mU2NoZW1hKHNjaGVtYSwgc2VnbWVudCkge1xuICAgIHJldHVybiBmbGF0dGVuKHNjaGVtYS5zY2hlbWFzLm1hcChzID0+IHMuYWNjZXB0KHRoaXMsIHNlZ21lbnQpKSlcbiAgfVxuXG4gIHZpc2l0QWxsT2ZTY2hlbWEoc2NoZW1hLCBzZWdtZW50KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oc2NoZW1hLnNjaGVtYXMubWFwKHMgPT4gcy5hY2NlcHQodGhpcywgc2VnbWVudCkpKVxuICB9XG5cbiAgdmlzaXRBbnlPZlNjaGVtYShzY2hlbWEsIHNlZ21lbnQpIHtcbiAgICByZXR1cm4gZmxhdHRlbihzY2hlbWEuc2NoZW1hcy5tYXAocyA9PiBzLmFjY2VwdCh0aGlzLCBzZWdtZW50KSkpXG4gIH1cbn1cblxuLyoqIFZpc2l0b3IgZm9yIGZsYXR0ZW5pbmcgbmVzdGVkIHNjaGVtYXMuICovXG5leHBvcnQgY2xhc3MgU2NoZW1hRmxhdHRlbmVyVmlzaXRvciBleHRlbmRzIERlZmF1bHRTY2hlbWFWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKHNjaGVtYSwgcGFyYW1ldGVyKSA9PiBwYXJhbWV0ZXIucHVzaChzY2hlbWEpKVxuICB9XG5cbiAgdmlzaXRPbmVPZlNjaGVtYShzY2hlbWEsIGNvbGxlY3Rvcikge1xuICAgIHNjaGVtYS5zY2hlbWFzLmZvckVhY2goY2hpbGRTY2hlbWEgPT4gY2hpbGRTY2hlbWEuYWNjZXB0KHRoaXMsIGNvbGxlY3RvcikpXG4gIH1cblxuICB2aXNpdEFsbE9mU2NoZW1hKHNjaGVtYSwgY29sbGVjdG9yKSB7XG4gICAgc2NoZW1hLnNjaGVtYXMuZm9yRWFjaChjaGlsZFNjaGVtYSA9PiBjaGlsZFNjaGVtYS5hY2NlcHQodGhpcywgY29sbGVjdG9yKSlcbiAgfVxuXG4gIHZpc2l0QW55T2ZTY2hlbWEoc2NoZW1hLCBjb2xsZWN0b3IpIHtcbiAgICBzY2hlbWEuc2NoZW1hcy5mb3JFYWNoKGNoaWxkU2NoZW1hID0+IGNoaWxkU2NoZW1hLmFjY2VwdCh0aGlzLCBjb2xsZWN0b3IpKVxuICB9XG59XG5cbi8qKiBWaXNpdG9yIGZvciBwcm92aWRpbmcgdmFsdWUgc25pcHBldHMgZm9yIHRoZSBnaXZlbiBzY2hlbWEuICovXG5leHBvcnQgY2xhc3MgU25pcHBldFByb3Bvc2FsVmlzaXRvciBleHRlbmRzIERlZmF1bHRTY2hlbWFWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKCkgPT4gU25pcHBldFByb3Bvc2FsVmlzaXRvci5ERUZBVUxUKVxuICB9XG5cbiAgY29tbWEocmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LnNob3VsZEFkZENvbW1hID8gJywnIDogJydcbiAgfVxuXG4gIHZpc2l0U3RyaW5nTGlrZShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBjb25zdCB7IGlzQmV0d2VlblF1b3RlcyB9ID0gcmVxdWVzdFxuICAgIGNvbnN0IHEgPSBpc0JldHdlZW5RdW90ZXMgPyAnJyA6ICdcIidcbiAgICByZXR1cm4gYCR7cX1cXCR7MToke3NjaGVtYS5kZWZhdWx0VmFsdWUgfHwgJyd9fSR7cX0ke3RoaXMuY29tbWEocmVxdWVzdCl9YFxuICB9XG5cbiAgdmlzaXRTdHJpbmdTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRTdHJpbmdMaWtlKHNjaGVtYSwgcmVxdWVzdClcbiAgfVxuXG4gIHZpc2l0TnVtYmVyU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LmlzQmV0d2VlblF1b3Rlc1xuICAgICAgPyB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHJlcXVlc3QpXG4gICAgICA6IGBcXCR7MToke3NjaGVtYS5kZWZhdWx0VmFsdWUgfHwgJzAnfX0ke3RoaXMuY29tbWEocmVxdWVzdCl9YFxuICB9XG5cbiAgdmlzaXRCb29sZWFuU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LmlzQmV0d2VlblF1b3Rlc1xuICAgICAgPyB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHJlcXVlc3QpXG4gICAgICA6IGBcXCR7MToke3NjaGVtYS5kZWZhdWx0VmFsdWUgfHwgJ2ZhbHNlJ319JHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxuXG4gIHZpc2l0TnVsbFNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcmVxdWVzdC5pc0JldHdlZW5RdW90ZXNcbiAgICAgID8gdGhpcy5kZWZhdWx0VmlzaXQoc2NoZW1hLCByZXF1ZXN0KVxuICAgICAgOiBgXFwkezE6bnVsbH0ke3RoaXMuY29tbWEocmVxdWVzdCl9YFxuICB9XG5cbiAgdmlzaXRFbnVtU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0U3RyaW5nTGlrZShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cblxuICB2aXNpdEFycmF5U2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LmlzQmV0d2VlblF1b3Rlc1xuICAgICAgPyB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHJlcXVlc3QpXG4gICAgICA6IGBbJDFdJHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxuXG4gIHZpc2l0T2JqZWN0U2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LmlzQmV0d2VlblF1b3Rlc1xuICAgICAgPyB0aGlzLmRlZmF1bHRWaXNpdChzY2hlbWEsIHJlcXVlc3QpXG4gICAgICA6IGB7JDF9JHt0aGlzLmNvbW1hKHJlcXVlc3QpfWBcbiAgfVxufVxuXG5TbmlwcGV0UHJvcG9zYWxWaXNpdG9yLkRFRkFVTFQgPSAnJDEnXG5cbi8qKiBWaXNpdG9yIGZvciBwcm92aWRpbmcgYW4gYXJyYXkgb2YgSVByb3Bvc2FsIHMgZm9yIGFueSBzY2hlbWEuICovXG5leHBvcnQgY2xhc3MgVmFsdWVQcm9wb3NhbFZpc2l0b3IgZXh0ZW5kcyBEZWZhdWx0U2NoZW1hVmlzaXRvciB7XG5cbiAgY29uc3RydWN0b3Ioc25pcHBldFZpc2l0b3IpIHtcbiAgICBzdXBlcigoKSA9PiBbXSlcbiAgICB0aGlzLnNuaXBwZXRWaXNpdG9yID0gc25pcHBldFZpc2l0b3JcbiAgfVxuXG4gIGNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzY3JpcHRpb246IHNjaGVtYS5kZXNjcmlwdGlvbixcbiAgICAgIHJpZ2h0TGFiZWw6IHNjaGVtYS5kaXNwbGF5VHlwZSxcbiAgICAgIHR5cGU6ICd2YWx1ZSdcbiAgICB9XG4gIH1cblxuICB2aXNpdE9iamVjdFNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9wb3NhbCA9IHRoaXMuY3JlYXRlQmFzZVByb3Bvc2FsRm9yKHNjaGVtYSlcbiAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9ICd7fSdcbiAgICBwcm9wb3NhbC5zbmlwcGV0ID0gc2NoZW1hLmFjY2VwdCh0aGlzLnNuaXBwZXRWaXNpdG9yLCByZXF1ZXN0KVxuICAgIHJldHVybiBbcHJvcG9zYWxdXG4gIH1cblxuICB2aXNpdEFycmF5U2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGNvbnN0IHByb3Bvc2FsID0gdGhpcy5jcmVhdGVCYXNlUHJvcG9zYWxGb3Ioc2NoZW1hKVxuICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gJ1tdJ1xuICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBzY2hlbWEuYWNjZXB0KHRoaXMuc25pcHBldFZpc2l0b3IsIHJlcXVlc3QpXG4gICAgcmV0dXJuIFtwcm9wb3NhbF1cbiAgfVxuXG4gIHZpc2l0U3RyaW5nU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGlmIChyZXF1ZXN0LmlzQmV0d2VlblF1b3Rlcykge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGNvbnN0IHByb3Bvc2FsID0gdGhpcy5jcmVhdGVCYXNlUHJvcG9zYWxGb3Ioc2NoZW1hKVxuICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gc2NoZW1hLmRlZmF1bHRWYWx1ZSA/IGBcIiR7c2NoZW1hLmRlZmF1bHRWYWx1ZX1cImAgOiAnXCJcIidcbiAgICBwcm9wb3NhbC5zbmlwcGV0ID0gc2NoZW1hLmFjY2VwdCh0aGlzLnNuaXBwZXRWaXNpdG9yLCByZXF1ZXN0KVxuICAgIHJldHVybiBbcHJvcG9zYWxdXG4gIH1cblxuICB2aXNpdE51bWJlclNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBpZiAocmVxdWVzdC5pc0JldHdlZW5RdW90ZXMpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBjb25zdCBwcm9wb3NhbCA9IHRoaXMuY3JlYXRlQmFzZVByb3Bvc2FsRm9yKHNjaGVtYSlcbiAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IHNjaGVtYS5kZWZhdWx0VmFsdWUgPyBgJHtzY2hlbWEuZGVmYXVsdFZhbHVlfWAgOiAnMCdcbiAgICBwcm9wb3NhbC5zbmlwcGV0ID0gc2NoZW1hLmFjY2VwdCh0aGlzLnNuaXBwZXRWaXNpdG9yLCByZXF1ZXN0KVxuICAgIHJldHVybiBbcHJvcG9zYWxdXG4gIH1cblxuICB2aXNpdEJvb2xlYW5TY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgaWYgKHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgcmV0dXJuIFt0cnVlLCBmYWxzZV0ubWFwKGJvb2wgPT4ge1xuICAgICAgY29uc3QgcHJvcG9zYWwgPSB0aGlzLmNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpXG4gICAgICBwcm9wb3NhbC5kaXNwbGF5VGV4dCA9IGJvb2wgPyAndHJ1ZScgOiAnZmFsc2UnXG4gICAgICBwcm9wb3NhbC5zbmlwcGV0ID0gYCR7cHJvcG9zYWwuZGlzcGxheVRleHR9XFwkezF9JHt0aGlzLnNuaXBwZXRWaXNpdG9yLmNvbW1hKHJlcXVlc3QpfWBcbiAgICAgIHJldHVybiBwcm9wb3NhbFxuICAgIH0pXG4gIH1cblxuICB2aXNpdE51bGxTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgaWYgKHJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgY29uc3QgcHJvcG9zYWwgPSB0aGlzLmNyZWF0ZUJhc2VQcm9wb3NhbEZvcihzY2hlbWEpXG4gICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBzY2hlbWEuZGVmYXVsdFZhbHVlID8gYCR7c2NoZW1hLmRlZmF1bHRWYWx1ZX1gIDogJ251bGwnXG4gICAgcHJvcG9zYWwuc25pcHBldCA9IHNjaGVtYS5hY2NlcHQodGhpcy5zbmlwcGV0VmlzaXRvciwgcmVxdWVzdClcbiAgICByZXR1cm4gW3Byb3Bvc2FsXVxuICB9XG5cbiAgdmlzaXRFbnVtU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIGNvbnN0IHsgc2VnbWVudHMsIGNvbnRlbnRzIH0gPSByZXF1ZXN0XG4gICAgbGV0IHBvc3NpYmxlVmFsdWVzID0gc2NoZW1hLnZhbHVlc1xuXG4gICAgaWYgKChzY2hlbWEucGFyZW50IGluc3RhbmNlb2YgQXJyYXlTY2hlbWEpICYmIHNjaGVtYS5wYXJlbnQuaGFzVW5pcXVlSXRlbXMoKSkge1xuICAgICAgY29uc3QgYWxyZWFkeVByZXNlbnRWYWx1ZXMgPSByZXNvbHZlT2JqZWN0KHNlZ21lbnRzLnNsaWNlKDAsIHNlZ21lbnRzLmxlbmd0aCAtIDEpLCBjb250ZW50cykgfHwgW11cbiAgICAgIHBvc3NpYmxlVmFsdWVzID0gcG9zc2libGVWYWx1ZXMuZmlsdGVyKHZhbHVlID0+IGFscmVhZHlQcmVzZW50VmFsdWVzLmluZGV4T2YodmFsdWUpIDwgMClcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zc2libGVWYWx1ZXMubWFwKGVudW1WYWx1ZSA9PiB7XG4gICAgICBjb25zdCBwcm9wb3NhbCA9IHRoaXMuY3JlYXRlQmFzZVByb3Bvc2FsRm9yKHNjaGVtYSlcbiAgICAgIHByb3Bvc2FsLmRpc3BsYXlUZXh0ID0gZW51bVZhbHVlXG4gICAgICBpZiAocmVxdWVzdC5pc0JldHdlZW5RdW90ZXMpIHtcbiAgICAgICAgcHJvcG9zYWwudGV4dCA9IGVudW1WYWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvcG9zYWwuc25pcHBldCA9IGBcIiR7ZW51bVZhbHVlfVxcJHsxfVwiJHt0aGlzLnNuaXBwZXRWaXNpdG9yLmNvbW1hKHJlcXVlc3QpfWBcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9wb3NhbFxuICAgIH0pXG4gIH1cblxuICB2aXNpdENvbXBvc2l0ZVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gZmxhdHRlbihzY2hlbWEuc2NoZW1hc1xuICAgICAgLmZpbHRlcihzID0+ICEocyBpbnN0YW5jZW9mIEFueU9mU2NoZW1hKSlcbiAgICAgIC5tYXAocyA9PiBzLmFjY2VwdCh0aGlzLCByZXF1ZXN0KS5maWx0ZXIociA9PiByLnNuaXBwZXQgIT09IFNuaXBwZXRQcm9wb3NhbFZpc2l0b3IuREVGQVVMVCkpXG4gICAgKVxuICB9XG5cbiAgdmlzaXRBbGxPZlNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENvbXBvc2l0ZVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cblxuICB2aXNpdEFueU9mU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q29tcG9zaXRlU2NoZW1hKHNjaGVtYSwgcmVxdWVzdClcbiAgfVxuXG4gIHZpc2l0T25lT2ZTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KVxuICB9XG59XG5cbi8qKiBWaXNpdG9yIGZvciBwcm92aWRpbmcgYW4gYXJyYXkgb2YgSVByb3Bvc2FsLCB3aGVuIGVkaXRpbmcga2V5IHBvc2l0aW9uICovXG5leHBvcnQgY2xhc3MgS2V5UHJvcG9zYWxWaXNpdG9yIGV4dGVuZHMgRGVmYXVsdFNjaGVtYVZpc2l0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKHVud3JhcHBlZENvbnRlbnRzLCBzbmlwcGV0VmlzaXRvcikge1xuICAgIHN1cGVyKCgoKSA9PiBbXSkpXG4gICAgdGhpcy51bndyYXBwZWRDb250ZW50cyA9IHVud3JhcHBlZENvbnRlbnRzXG4gICAgdGhpcy5zbmlwcGV0VmlzaXRvciA9IHNuaXBwZXRWaXNpdG9yXG4gIH1cblxuICB2aXNpdE9iamVjdFNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICBjb25zdCB7IHByZWZpeCwgaXNCZXR3ZWVuUXVvdGVzIH0gPSByZXF1ZXN0XG4gICAgcmV0dXJuIHNjaGVtYS5rZXlzXG4gICAgICAuZmlsdGVyKGtleSA9PiAhdGhpcy51bndyYXBwZWRDb250ZW50cyB8fCAoa2V5LmluZGV4T2YocHJlZml4KSA+PSAwICYmICF0aGlzLnVud3JhcHBlZENvbnRlbnRzLmhhc093blByb3BlcnR5KGtleSkpKVxuICAgICAgLm1hcChrZXkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZVNjaGVtYSA9IHNjaGVtYS5wcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgY29uc3QgcHJvcG9zYWwgPSB7fVxuXG4gICAgICAgIHByb3Bvc2FsLmRlc2NyaXB0aW9uID0gdmFsdWVTY2hlbWEuZGVzY3JpcHRpb25cbiAgICAgICAgcHJvcG9zYWwudHlwZSA9ICdwcm9wZXJ0eSdcbiAgICAgICAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBrZXlcbiAgICAgICAgcHJvcG9zYWwucmlnaHRMYWJlbCA9IHZhbHVlU2NoZW1hLmRpc3BsYXlUeXBlXG4gICAgICAgIGlmIChpc0JldHdlZW5RdW90ZXMpIHtcbiAgICAgICAgICBwcm9wb3NhbC50ZXh0ID0ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBzY2hlbWEucHJvcGVydGllc1trZXldLmFjY2VwdCh0aGlzLnNuaXBwZXRWaXNpdG9yLCByZXF1ZXN0KVxuICAgICAgICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBgXCIke2tleX1cIjogJHt2YWx1ZX1gXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3Bvc2FsXG4gICAgICB9KVxuICB9XG5cbiAgdmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvcG9zYWxzID0gc2NoZW1hLnNjaGVtYXNcbiAgICAgIC5maWx0ZXIocyA9PiBzIGluc3RhbmNlb2YgT2JqZWN0U2NoZW1hKVxuICAgICAgLm1hcChzID0+IHMuYWNjZXB0KHRoaXMsIHJlcXVlc3QpKVxuICAgIHJldHVybiBmbGF0dGVuKHByb3Bvc2FscylcbiAgfVxuXG4gIHZpc2l0QWxsT2ZTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDb21wb3NpdGVTY2hlbWEoc2NoZW1hLCByZXF1ZXN0KVxuICB9XG5cbiAgdmlzaXRBbnlPZlNjaGVtYShzY2hlbWEsIHJlcXVlc3QpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpdENvbXBvc2l0ZVNjaGVtYShzY2hlbWEsIHJlcXVlc3QpXG4gIH1cblxuICB2aXNpdE9uZU9mU2NoZW1hKHNjaGVtYSwgcmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q29tcG9zaXRlU2NoZW1hKHNjaGVtYSwgcmVxdWVzdClcbiAgfVxufVxuIl19