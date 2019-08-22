Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsonSchemaTypes = require('./json-schema-types');

var _lodashUniq = require('lodash/uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

'use babel';

var wrap = function wrap(schema) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  switch ((0, _jsonSchemaTypes.schemaType)(schema)) {
    case _jsonSchemaTypes.ALL_OF_TYPE:
      return new AllOfSchema(schema, parent);
    case _jsonSchemaTypes.ANY_OF_TYPE:
      return new AnyOfSchema(schema, parent);
    case _jsonSchemaTypes.ARRAY_TYPE:
      return new ArraySchema(schema, parent);
    case _jsonSchemaTypes.BOOLEAN_TYPE:
      return new BooleanSchema(schema, parent);
    case _jsonSchemaTypes.ENUM_TYPE:
      return new EnumSchema(schema, parent);
    case _jsonSchemaTypes.NULL_TYPE:
      return new NullSchema(schema, parent);
    case _jsonSchemaTypes.NUMBER_TYPE:
      return new NumberSchema(schema, parent);
    case _jsonSchemaTypes.OBJECT_TYPE:
      return new ObjectSchema(schema, parent);
    case _jsonSchemaTypes.ONE_OF_TYPE:
      return new OneOfSchema(schema, parent);
    case _jsonSchemaTypes.STRING_TYPE:
      return new StringSchema(schema, parent);
    default:
      return new AnySchema({}, parent);
  }
};

exports.wrap = wrap;

var BaseSchema = function BaseSchema(schema, parent) {
  _classCallCheck(this, BaseSchema);

  this.schema = schema;
  this.parent = parent;
  this.description = this.schema.description;
  this.defaultValue = this.schema['default'];
};

exports.BaseSchema = BaseSchema;

var PatternProperty = function PatternProperty(pattern, schema) {
  _classCallCheck(this, PatternProperty);

  this.pattern = pattern;
  this.schema = schema;
};

exports.PatternProperty = PatternProperty;

var ObjectSchema = (function (_BaseSchema) {
  _inherits(ObjectSchema, _BaseSchema);

  function ObjectSchema(schema, parent) {
    var _this = this;

    _classCallCheck(this, ObjectSchema);

    _get(Object.getPrototypeOf(ObjectSchema.prototype), 'constructor', this).call(this, schema, parent);
    var properties = this.schema.properties || {};
    this.keys = Object.keys(properties);
    this.properties = this.keys.reduce(function (object, key) {
      object[key] = wrap(properties[key], _this);
      return object;
    }, {});
    this.patternProperties = Object.keys(this.schema.patternProperties || {}).map(function (key) {
      return [key, _this.schema.patternProperties[key]];
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var pattern = _ref2[0];
      var rawSchema = _ref2[1];
      return new PatternProperty(new RegExp(pattern, 'g'), wrap(rawSchema, _this));
    });
    this.displayType = 'object';
  }

  _createClass(ObjectSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitObjectSchema(this, parameter);
    }
  }]);

  return ObjectSchema;
})(BaseSchema);

exports.ObjectSchema = ObjectSchema;

var ArraySchema = (function (_BaseSchema2) {
  _inherits(ArraySchema, _BaseSchema2);

  function ArraySchema(schema, parent) {
    _classCallCheck(this, ArraySchema);

    _get(Object.getPrototypeOf(ArraySchema.prototype), 'constructor', this).call(this, schema, parent);
    this.itemSchema = wrap(this.schema.items, this);
    this.unique = Boolean(this.schema.uniqueItems || false);
    var itemDisplayType = this.itemSchema && this.itemSchema.displayType ? this.itemSchema.displayType : 'any';
    this.displayType = (0, _lodashUniq2['default'])(itemDisplayType.split('|').map(function (t) {
      return t.trim() + '[]';
    })).join(' | ');
  }

  _createClass(ArraySchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitArraySchema(this, parameter);
    }
  }]);

  return ArraySchema;
})(BaseSchema);

exports.ArraySchema = ArraySchema;

var EnumSchema = (function (_BaseSchema3) {
  _inherits(EnumSchema, _BaseSchema3);

  function EnumSchema(schema, parent) {
    _classCallCheck(this, EnumSchema);

    _get(Object.getPrototypeOf(EnumSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.values = this.schema['enum'];
    this.displayType = 'enum';
  }

  _createClass(EnumSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitEnumSchema(this, parameter);
    }
  }]);

  return EnumSchema;
})(BaseSchema);

exports.EnumSchema = EnumSchema;

var CompositeSchema = (function (_BaseSchema4) {
  _inherits(CompositeSchema, _BaseSchema4);

  function CompositeSchema(schema, parent, keyWord) {
    var _this2 = this;

    _classCallCheck(this, CompositeSchema);

    _get(Object.getPrototypeOf(CompositeSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.schemas = schema[keyWord].map(function (s) {
      return wrap(s, _this2);
    });
    this.defaultValue = null;
    this.displayType = (0, _lodashUniq2['default'])(this.schemas.map(function (s) {
      return s.displayType;
    })).join(' | ');
  }

  return CompositeSchema;
})(BaseSchema);

exports.CompositeSchema = CompositeSchema;

var AnyOfSchema = (function (_CompositeSchema) {
  _inherits(AnyOfSchema, _CompositeSchema);

  function AnyOfSchema(schema, parent) {
    _classCallCheck(this, AnyOfSchema);

    _get(Object.getPrototypeOf(AnyOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'anyOf');
  }

  _createClass(AnyOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAnyOfSchema(this, parameter);
    }
  }]);

  return AnyOfSchema;
})(CompositeSchema);

exports.AnyOfSchema = AnyOfSchema;

var AllOfSchema = (function (_CompositeSchema2) {
  _inherits(AllOfSchema, _CompositeSchema2);

  function AllOfSchema(schema, parent) {
    _classCallCheck(this, AllOfSchema);

    _get(Object.getPrototypeOf(AllOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'allOf');
  }

  _createClass(AllOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAllOfSchema(this, parameter);
    }
  }]);

  return AllOfSchema;
})(CompositeSchema);

exports.AllOfSchema = AllOfSchema;

var OneOfSchema = (function (_CompositeSchema3) {
  _inherits(OneOfSchema, _CompositeSchema3);

  function OneOfSchema(schema, parent) {
    _classCallCheck(this, OneOfSchema);

    _get(Object.getPrototypeOf(OneOfSchema.prototype), 'constructor', this).call(this, schema, parent, 'oneOf');
  }

  _createClass(OneOfSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitOneOfSchema(this, parameter);
    }
  }]);

  return OneOfSchema;
})(CompositeSchema);

exports.OneOfSchema = OneOfSchema;

var NullSchema = (function (_BaseSchema5) {
  _inherits(NullSchema, _BaseSchema5);

  function NullSchema(schema, parent) {
    _classCallCheck(this, NullSchema);

    _get(Object.getPrototypeOf(NullSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.defaultValue = null;
    this.displayType = 'null';
  }

  _createClass(NullSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitNullSchema(this, parameter);
    }
  }]);

  return NullSchema;
})(BaseSchema);

exports.NullSchema = NullSchema;

var StringSchema = (function (_BaseSchema6) {
  _inherits(StringSchema, _BaseSchema6);

  function StringSchema(schema, parent) {
    _classCallCheck(this, StringSchema);

    _get(Object.getPrototypeOf(StringSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'string';
    this.defaultValue = this.defaultValue || '';
  }

  _createClass(StringSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitStringSchema(this, parameter);
    }
  }]);

  return StringSchema;
})(BaseSchema);

exports.StringSchema = StringSchema;

var NumberSchema = (function (_BaseSchema7) {
  _inherits(NumberSchema, _BaseSchema7);

  function NumberSchema(schema, parent) {
    _classCallCheck(this, NumberSchema);

    _get(Object.getPrototypeOf(NumberSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'number';
    this.defaultValue = this.defaultValue || 0;
  }

  _createClass(NumberSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitNumberSchema(this, parameter);
    }
  }]);

  return NumberSchema;
})(BaseSchema);

exports.NumberSchema = NumberSchema;

var BooleanSchema = (function (_BaseSchema8) {
  _inherits(BooleanSchema, _BaseSchema8);

  function BooleanSchema(schema, parent) {
    _classCallCheck(this, BooleanSchema);

    _get(Object.getPrototypeOf(BooleanSchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'boolean';
    this.defaultValue = this.defaultValue || false;
  }

  _createClass(BooleanSchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitBooleanSchema(this, parameter);
    }
  }]);

  return BooleanSchema;
})(BaseSchema);

exports.BooleanSchema = BooleanSchema;

var AnySchema = (function (_BaseSchema9) {
  _inherits(AnySchema, _BaseSchema9);

  function AnySchema(schema, parent) {
    _classCallCheck(this, AnySchema);

    _get(Object.getPrototypeOf(AnySchema.prototype), 'constructor', this).call(this, schema, parent);
    this.displayType = 'any';
    this.defaultValue = null;
  }

  _createClass(AnySchema, [{
    key: 'accept',
    value: function accept(visitor, parameter) {
      return visitor.visitAnySchema(this, parameter);
    }
  }]);

  return AnySchema;
})(BaseSchema);

exports.AnySchema = AnySchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBRXlKLHFCQUFxQjs7MEJBQzdKLGFBQWE7Ozs7QUFIOUIsV0FBVyxDQUFBOztBQUtKLElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFJLE1BQU0sRUFBb0I7TUFBbEIsTUFBTSx5REFBRyxJQUFJOztBQUN4QyxVQUFRLGlDQUFXLE1BQU0sQ0FBQztBQUN4QjtBQUFrQixhQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQ3hEO0FBQWtCLGFBQU8sSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDeEQ7QUFBaUIsYUFBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUN2RDtBQUFtQixhQUFPLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQzNEO0FBQWdCLGFBQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDckQ7QUFBZ0IsYUFBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUNyRDtBQUFrQixhQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFBQ3pEO0FBQWtCLGFBQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQUEsQUFDekQ7QUFBa0IsYUFBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFBQSxBQUN4RDtBQUFrQixhQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUFBLEFB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QVRVLFNBQVM7R0FBUyxVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2pzb24tc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgc2NoZW1hVHlwZSwgQUxMX09GX1RZUEUsIEFOWV9PRl9UWVBFLCBBUlJBWV9UWVBFLCBCT09MRUFOX1RZUEUsIEVOVU1fVFlQRSwgTlVMTF9UWVBFLCBOVU1CRVJfVFlQRSwgT0JKRUNUX1RZUEUsIE9ORV9PRl9UWVBFLCBTVFJJTkdfVFlQRSB9IGZyb20gJy4vanNvbi1zY2hlbWEtdHlwZXMnXG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gvdW5pcSdcblxuZXhwb3J0IGNvbnN0IHdyYXAgPSAoc2NoZW1hLCBwYXJlbnQgPSBudWxsKSA9PiB7XG4gIHN3aXRjaCAoc2NoZW1hVHlwZShzY2hlbWEpKSB7XG4gICAgY2FzZSBBTExfT0ZfVFlQRTogcmV0dXJuIG5ldyBBbGxPZlNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIEFOWV9PRl9UWVBFOiByZXR1cm4gbmV3IEFueU9mU2NoZW1hKHNjaGVtYSwgcGFyZW50KVxuICAgIGNhc2UgQVJSQVlfVFlQRTogcmV0dXJuIG5ldyBBcnJheVNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIEJPT0xFQU5fVFlQRTogcmV0dXJuIG5ldyBCb29sZWFuU2NoZW1hKHNjaGVtYSwgcGFyZW50KVxuICAgIGNhc2UgRU5VTV9UWVBFOiByZXR1cm4gbmV3IEVudW1TY2hlbWEoc2NoZW1hLCBwYXJlbnQpXG4gICAgY2FzZSBOVUxMX1RZUEU6IHJldHVybiBuZXcgTnVsbFNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIE5VTUJFUl9UWVBFOiByZXR1cm4gbmV3IE51bWJlclNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIE9CSkVDVF9UWVBFOiByZXR1cm4gbmV3IE9iamVjdFNjaGVtYShzY2hlbWEsIHBhcmVudClcbiAgICBjYXNlIE9ORV9PRl9UWVBFOiByZXR1cm4gbmV3IE9uZU9mU2NoZW1hKHNjaGVtYSwgcGFyZW50KVxuICAgIGNhc2UgU1RSSU5HX1RZUEU6IHJldHVybiBuZXcgU3RyaW5nU2NoZW1hKHNjaGVtYSwgcGFyZW50KVxuICAgIGRlZmF1bHQ6IHJldHVybiBuZXcgQW55U2NoZW1hKHt9LCBwYXJlbnQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5zY2hlbWEuZGVzY3JpcHRpb25cbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IHRoaXMuc2NoZW1hWydkZWZhdWx0J11cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGF0dGVyblByb3BlcnR5IHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgc2NoZW1hKSB7XG4gICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVyblxuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9iamVjdFNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLnNjaGVtYS5wcm9wZXJ0aWVzIHx8IHt9XG4gICAgdGhpcy5rZXlzID0gT2JqZWN0LmtleXMocHJvcGVydGllcylcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB0aGlzLmtleXMucmVkdWNlKChvYmplY3QsIGtleSkgPT4ge1xuICAgICAgb2JqZWN0W2tleV0gPSB3cmFwKHByb3BlcnRpZXNba2V5XSwgdGhpcylcbiAgICAgIHJldHVybiBvYmplY3RcbiAgICB9LCB7fSlcbiAgICB0aGlzLnBhdHRlcm5Qcm9wZXJ0aWVzID0gT2JqZWN0LmtleXModGhpcy5zY2hlbWEucGF0dGVyblByb3BlcnRpZXMgfHwge30pXG4gICAgICAubWFwKGtleSA9PiBba2V5LCB0aGlzLnNjaGVtYS5wYXR0ZXJuUHJvcGVydGllc1trZXldXSlcbiAgICAgIC5tYXAoKFtwYXR0ZXJuLCByYXdTY2hlbWFdKSA9PiBuZXcgUGF0dGVyblByb3BlcnR5KG5ldyBSZWdFeHAocGF0dGVybiwgJ2cnKSwgd3JhcChyYXdTY2hlbWEsIHRoaXMpKSlcbiAgICB0aGlzLmRpc3BsYXlUeXBlID0gJ29iamVjdCdcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdE9iamVjdFNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFycmF5U2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5pdGVtU2NoZW1hID0gd3JhcCh0aGlzLnNjaGVtYS5pdGVtcywgdGhpcylcbiAgICB0aGlzLnVuaXF1ZSA9IEJvb2xlYW4odGhpcy5zY2hlbWEudW5pcXVlSXRlbXMgfHwgZmFsc2UpXG4gICAgY29uc3QgaXRlbURpc3BsYXlUeXBlID0gdGhpcy5pdGVtU2NoZW1hICYmIHRoaXMuaXRlbVNjaGVtYS5kaXNwbGF5VHlwZSA/IHRoaXMuaXRlbVNjaGVtYS5kaXNwbGF5VHlwZSA6ICdhbnknXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9IHVuaXEoaXRlbURpc3BsYXlUeXBlLnNwbGl0KCd8JykubWFwKHQgPT4gYCR7dC50cmltKCl9W11gKSkuam9pbignIHwgJylcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycmF5U2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRW51bVNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50KVxuICAgIHRoaXMudmFsdWVzID0gdGhpcy5zY2hlbWEuZW51bVxuICAgIHRoaXMuZGlzcGxheVR5cGUgPSAnZW51bSdcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEVudW1TY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQsIGtleVdvcmQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudClcbiAgICB0aGlzLnNjaGVtYXMgPSBzY2hlbWFba2V5V29yZF0ubWFwKHMgPT4gd3JhcChzLCB0aGlzKSlcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG51bGxcbiAgICB0aGlzLmRpc3BsYXlUeXBlID0gdW5pcSh0aGlzLnNjaGVtYXMubWFwKHMgPT4gcy5kaXNwbGF5VHlwZSkpLmpvaW4oJyB8ICcpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFueU9mU2NoZW1hIGV4dGVuZHMgQ29tcG9zaXRlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudCwgJ2FueU9mJylcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEFueU9mU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWxsT2ZTY2hlbWEgZXh0ZW5kcyBDb21wb3NpdGVTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihzY2hlbWEsIHBhcmVudCkge1xuICAgIHN1cGVyKHNjaGVtYSwgcGFyZW50LCAnYWxsT2YnKVxuICB9XG5cbiAgYWNjZXB0KHZpc2l0b3IsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QWxsT2ZTY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPbmVPZlNjaGVtYSBleHRlbmRzIENvbXBvc2l0ZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQsICdvbmVPZicpXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRPbmVPZlNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudClcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG51bGxcbiAgICB0aGlzLmRpc3BsYXlUeXBlID0gJ251bGwnXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdzdHJpbmcnXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLmRlZmF1bHRWYWx1ZSB8fCAnJ1xuICB9XG5cbiAgYWNjZXB0KHZpc2l0b3IsIHBhcmFtZXRlcikge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3RyaW5nU2NoZW1hKHRoaXMsIHBhcmFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdudW1iZXInXG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLmRlZmF1bHRWYWx1ZSB8fCAwXG4gIH1cblxuICBhY2NlcHQodmlzaXRvciwgcGFyYW1ldGVyKSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdW1iZXJTY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCb29sZWFuU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVtYSwgcGFyZW50KSB7XG4gICAgc3VwZXIoc2NoZW1hLCBwYXJlbnQpXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9ICdib29sZWFuJ1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gdGhpcy5kZWZhdWx0VmFsdWUgfHwgZmFsc2VcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEJvb2xlYW5TY2hlbWEodGhpcywgcGFyYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbnlTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioc2NoZW1hLCBwYXJlbnQpIHtcbiAgICBzdXBlcihzY2hlbWEsIHBhcmVudClcbiAgICB0aGlzLmRpc3BsYXlUeXBlID0gJ2FueSdcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG51bGxcbiAgfVxuXG4gIGFjY2VwdCh2aXNpdG9yLCBwYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEFueVNjaGVtYSh0aGlzLCBwYXJhbWV0ZXIpXG4gIH1cbn1cbiJdfQ==