var registeredFunctions = {
  isUndefined: function (value) {
    return typeof value === 'undefined';
  },
  isNotUndefined: function (value) {
    return !isUndefined(value);
  },
  isObject: function (value) {
    return typeof value === 'object';
  },
  isNotObject: function (value) {
    return !isObject(value);
  },
  isArray: function (value) {
    return Array.isArray(value);
  },
  isNotArray: function (value) {
    return !isArray(value);
  },
  isFunction: function (value) {
    return typeof value === 'function';
  },
  isNotFunction: function (value) {
    return !isFunction(value);
  },
  isString: function (value) {
    return typeof value === 'string';
  },
  isNotString: function (value) {
    return !isString(value);
  },
  isNumber: function (value) {
    return typeof value === 'number';
  },
  isNotNumber: function (value) {
    return !isNumber(value);
  },
  isBool: function (value) {
    return typeof value === 'boolean';
  },
  isNotBool: function (value) {
    return !isBool(value);
  },
  isGreaterThan: function (value, source) {
    return value > source;
  },
  isNotGreaterThan: function (value, source) {
    return !isGreaterThan(value, source);
  },
  isLessThan: function (value, source) {
    return value < source;
  },
  isNotLessThan: function (value, source) {
    return !isLessThan(value, source);
  },
  isEqual: function (value, source) {
    return value === source;
  },
  isNotEqual: function (value, source) {
    return !isEqual(value, source);
  },
  hasOwnProp: function (obj, prop) {
    return obj.hasOwnProperty(prop);
  },
  hasNotOwnProp: function (value, source) {
    return !hasOwnProp(value, source);
  },
  entriesOf: function (obj) {
    return Object.entries(obj) || [];
  },
  valuesOf: function (obj) {
    return Object.values(obj) || [];
  },
  keysIn: function (obj) {
    return Object.keys(obj) || [];
  },
  propertiesOf: function (obj) {
    return Object.getOwnPropertyDescriptors(obj) || [];
  },
  prototypeOf: function (obj) {
    return Object.getPrototypeOf(obj) || [];
  },
  isPrototypeOf: function (proto, obj) {
    return proto.isPrototypeOf(obj);
  },
};

for (var prop in registeredFunctions) {
  global[prop] = registeredFunctions[prop];
}
