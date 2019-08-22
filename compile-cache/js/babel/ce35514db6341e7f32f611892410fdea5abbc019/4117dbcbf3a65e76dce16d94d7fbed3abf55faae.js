Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.path = path;
exports.request = request;
exports.and = and;
exports.or = or;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsNumber = require('lodash/isNumber');

var _lodashIsNumber2 = _interopRequireDefault(_lodashIsNumber);

var _lodashIsString = require('lodash/isString');

var _lodashIsString2 = _interopRequireDefault(_lodashIsString);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

'use babel';

var IndexMatcher = (function () {
  function IndexMatcher(index) {
    _classCallCheck(this, IndexMatcher);

    this.index = index;
  }

  _createClass(IndexMatcher, [{
    key: 'matches',
    value: function matches(segment) {
      return (0, _lodashIsNumber2['default'])(segment) && this.index === segment;
    }
  }]);

  return IndexMatcher;
})();

var KeyMatcher = (function () {
  function KeyMatcher(key) {
    _classCallCheck(this, KeyMatcher);

    this.key = key;
  }

  _createClass(KeyMatcher, [{
    key: 'matches',
    value: function matches(segment) {
      return (0, _lodashIsString2['default'])(segment) && this.key === segment;
    }
  }]);

  return KeyMatcher;
})();

var AnyIndexMatcher = {
  matches: function matches(segment) {
    return (0, _lodashIsNumber2['default'])(segment);
  }
};

var AnyKeyMatcher = {
  matches: function matches(segment) {
    return (0, _lodashIsString2['default'])(segment);
  }
};

var AnyMatcher = {
  matches: function matches() {
    return true;
  }
};

var JsonPathMatcher = (function () {
  function JsonPathMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, JsonPathMatcher);

    this.matchers = matchers;
  }

  _createClass(JsonPathMatcher, [{
    key: 'index',
    value: function index(value) {
      var matcher = null;
      if (value === undefined) {
        matcher = AnyIndexMatcher;
      } else {
        matcher = (0, _lodashIsArray2['default'])(value) ? new OrMatcher(value.map(function (v) {
          return new IndexMatcher(v);
        })) : new IndexMatcher(value);
      }
      return new JsonPathMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'key',
    value: function key(value) {
      var matcher = null;
      if (value === undefined) {
        matcher = AnyKeyMatcher;
      } else {
        matcher = (0, _lodashIsArray2['default'])(value) ? new OrMatcher(value.map(function (v) {
          return new KeyMatcher(v);
        })) : new KeyMatcher(value);
      }
      return new JsonPathMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'any',
    value: function any() {
      return new JsonPathMatcher(this.matchers.concat([AnyMatcher]));
    }
  }, {
    key: 'matches',
    value: function matches(segments) {
      if (segments.length !== this.matchers.length) {
        return false;
      }

      for (var i = 0; i < this.matchers.length; ++i) {
        if (!this.matchers[i].matches(segments[i])) {
          return false;
        }
      }

      return true;
    }
  }]);

  return JsonPathMatcher;
})();

var PathRequestMatcher = (function () {
  function PathRequestMatcher(matcher) {
    _classCallCheck(this, PathRequestMatcher);

    this.matcher = matcher;
  }

  _createClass(PathRequestMatcher, [{
    key: 'matches',
    value: function matches(_ref) {
      var segments = _ref.segments;

      return Boolean(segments) && this.matcher.matches(segments);
    }
  }]);

  return PathRequestMatcher;
})();

var KeyRequestMatcher = {
  matches: function matches(_ref2) {
    var isKeyPosition = _ref2.isKeyPosition;

    return isKeyPosition;
  }
};

var ValueRequestMatcher = {
  matches: function matches(_ref3) {
    var isValuePosition = _ref3.isValuePosition;

    return isValuePosition;
  }
};

var RequestMatcher = (function () {
  function RequestMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, RequestMatcher);

    this.matchers = matchers;
  }

  _createClass(RequestMatcher, [{
    key: 'path',
    value: function path(matcher) {
      return new RequestMatcher(this.matchers.concat([new PathRequestMatcher(matcher)]));
    }
  }, {
    key: 'value',
    value: function value() {
      return new RequestMatcher(this.matchers.concat([ValueRequestMatcher]));
    }
  }, {
    key: 'key',
    value: function key() {
      return new RequestMatcher(this.matchers.concat([KeyRequestMatcher]));
    }
  }, {
    key: 'matches',
    value: function matches(req) {
      return this.matchers.every(function (matcher) {
        return matcher.matches(req);
      });
    }
  }]);

  return RequestMatcher;
})();

var CompositeMatcher = (function () {
  function CompositeMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, CompositeMatcher);

    this.matchers = matchers;
  }

  _createClass(CompositeMatcher, [{
    key: 'append',
    value: function append(matcher) {
      return this.createCompositeMatcher(this.matchers.concat([matcher]));
    }
  }, {
    key: 'prepend',
    value: function prepend(matcher) {
      return this.createCompositeMatcher([matcher].concat(this.matchers));
    }
  }]);

  return CompositeMatcher;
})();

var AndMatcher = (function (_CompositeMatcher) {
  _inherits(AndMatcher, _CompositeMatcher);

  function AndMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, AndMatcher);

    _get(Object.getPrototypeOf(AndMatcher.prototype), 'constructor', this).call(this, matchers);
  }

  _createClass(AndMatcher, [{
    key: 'createCompositeMatcher',
    value: function createCompositeMatcher(matchers) {
      return new AndMatcher(matchers);
    }
  }, {
    key: 'matches',
    value: function matches(input) {
      return this.matchers.every(function (matcher) {
        return matcher.matches(input);
      });
    }
  }]);

  return AndMatcher;
})(CompositeMatcher);

var OrMatcher = (function (_CompositeMatcher2) {
  _inherits(OrMatcher, _CompositeMatcher2);

  function OrMatcher() {
    var matchers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, OrMatcher);

    _get(Object.getPrototypeOf(OrMatcher.prototype), 'constructor', this).call(this, matchers);
  }

  _createClass(OrMatcher, [{
    key: 'createCompositeMatcher',
    value: function createCompositeMatcher(matchers) {
      return new OrMatcher(matchers);
    }
  }, {
    key: 'matches',
    value: function matches(input) {
      return this.matchers.some(function (matcher) {
        return matcher.matches(input);
      });
    }
  }]);

  return OrMatcher;
})(CompositeMatcher);

function path() {
  return new JsonPathMatcher();
}

function request() {
  return new RequestMatcher();
}

function and() {
  for (var _len = arguments.length, matchers = Array(_len), _key = 0; _key < _len; _key++) {
    matchers[_key] = arguments[_key];
  }

  return new AndMatcher(matchers);
}

function or() {
  for (var _len2 = arguments.length, matchers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    matchers[_key2] = arguments[_key2];
  }

  return new OrMatcher(matchers);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL21hdGNoZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBRXFCLGlCQUFpQjs7Ozs4QkFDakIsaUJBQWlCOzs7OzZCQUNsQixnQkFBZ0I7Ozs7QUFKcEMsV0FBVyxDQUFBOztJQU1MLFlBQVk7QUFDTCxXQURQLFlBQVksQ0FDSixLQUFLLEVBQUU7MEJBRGYsWUFBWTs7QUFFZCxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtHQUNuQjs7ZUFIRyxZQUFZOztXQUtULGlCQUFDLE9BQU8sRUFBRTtBQUNmLGFBQU8saUNBQVMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUE7S0FDbkQ7OztTQVBHLFlBQVk7OztJQVVaLFVBQVU7QUFDSCxXQURQLFVBQVUsQ0FDRixHQUFHLEVBQUU7MEJBRGIsVUFBVTs7QUFFWixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtHQUNmOztlQUhHLFVBQVU7O1dBS1AsaUJBQUMsT0FBTyxFQUFFO0FBQ2YsYUFBTyxpQ0FBUyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQTtLQUNqRDs7O1NBUEcsVUFBVTs7O0FBVWhCLElBQU0sZUFBZSxHQUFHO0FBQ3RCLFNBQU8sRUFBQSxpQkFBQyxPQUFPLEVBQUU7QUFDZixXQUFPLGlDQUFTLE9BQU8sQ0FBQyxDQUFBO0dBQ3pCO0NBQ0YsQ0FBQTs7QUFFRCxJQUFNLGFBQWEsR0FBRztBQUNwQixTQUFPLEVBQUEsaUJBQUMsT0FBTyxFQUFFO0FBQ2YsV0FBTyxpQ0FBUyxPQUFPLENBQUMsQ0FBQTtHQUN6QjtDQUNGLENBQUE7O0FBRUQsSUFBTSxVQUFVLEdBQUc7QUFDakIsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsV0FBTyxJQUFJLENBQUE7R0FDWjtDQUNGLENBQUE7O0lBRUss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LENBQUE7Q0FDN0I7O0FBRU0sU0FBUyxPQUFPLEdBQUc7QUFDeEIsU0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFBO0NBQzVCOztBQUVNLFNBQVMsR0FBRyxHQUFjO29DQUFWLFFBQVE7QUFBUixZQUFROzs7QUFDN0IsU0FBTyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUNoQzs7QUFFTSxTQUFTLEVBQUUsR0FBYztxQ0FBVixRQUFRO0FBQVIsWUFBUTs7O0FBQzVCLFNBQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7Q0FDL0IiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvbWF0Y2hlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgaXNOdW1iZXIgZnJvbSAnbG9kYXNoL2lzTnVtYmVyJ1xuaW1wb3J0IGlzU3RyaW5nIGZyb20gJ2xvZGFzaC9pc1N0cmluZydcbmltcG9ydCBpc0FycmF5IGZyb20gJ2xvZGFzaC9pc0FycmF5J1xuXG5jbGFzcyBJbmRleE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihpbmRleCkge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleFxuICB9XG5cbiAgbWF0Y2hlcyhzZWdtZW50KSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKHNlZ21lbnQpICYmIHRoaXMuaW5kZXggPT09IHNlZ21lbnRcbiAgfVxufVxuXG5jbGFzcyBLZXlNYXRjaGVyIHtcbiAgY29uc3RydWN0b3Ioa2V5KSB7XG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgfVxuXG4gIG1hdGNoZXMoc2VnbWVudCkge1xuICAgIHJldHVybiBpc1N0cmluZyhzZWdtZW50KSAmJiB0aGlzLmtleSA9PT0gc2VnbWVudFxuICB9XG59XG5cbmNvbnN0IEFueUluZGV4TWF0Y2hlciA9IHtcbiAgbWF0Y2hlcyhzZWdtZW50KSB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKHNlZ21lbnQpXG4gIH1cbn1cblxuY29uc3QgQW55S2V5TWF0Y2hlciA9IHtcbiAgbWF0Y2hlcyhzZWdtZW50KSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKHNlZ21lbnQpXG4gIH1cbn1cblxuY29uc3QgQW55TWF0Y2hlciA9IHtcbiAgbWF0Y2hlcygpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmNsYXNzIEpzb25QYXRoTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoZXJzID0gW10pIHtcbiAgICB0aGlzLm1hdGNoZXJzID0gbWF0Y2hlcnNcbiAgfVxuXG4gIGluZGV4KHZhbHVlKSB7XG4gICAgbGV0IG1hdGNoZXIgPSBudWxsXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1hdGNoZXIgPSBBbnlJbmRleE1hdGNoZXJcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2hlciA9IGlzQXJyYXkodmFsdWUpXG4gICAgICAgID8gbmV3IE9yTWF0Y2hlcih2YWx1ZS5tYXAodiA9PiBuZXcgSW5kZXhNYXRjaGVyKHYpKSlcbiAgICAgICAgOiBuZXcgSW5kZXhNYXRjaGVyKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEpzb25QYXRoTWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbbWF0Y2hlcl0pKVxuICB9XG5cbiAga2V5KHZhbHVlKSB7XG4gICAgbGV0IG1hdGNoZXIgPSBudWxsXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1hdGNoZXIgPSBBbnlLZXlNYXRjaGVyXG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoZXIgPSBpc0FycmF5KHZhbHVlKVxuICAgICAgICA/IG5ldyBPck1hdGNoZXIodmFsdWUubWFwKHYgPT4gbmV3IEtleU1hdGNoZXIodikpKVxuICAgICAgICA6IG5ldyBLZXlNYXRjaGVyKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEpzb25QYXRoTWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbbWF0Y2hlcl0pKVxuICB9XG5cbiAgYW55KCkge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhNYXRjaGVyKHRoaXMubWF0Y2hlcnMuY29uY2F0KFtBbnlNYXRjaGVyXSkpXG4gIH1cblxuICBtYXRjaGVzKHNlZ21lbnRzKSB7XG4gICAgaWYgKHNlZ21lbnRzLmxlbmd0aCAhPT0gdGhpcy5tYXRjaGVycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXRjaGVycy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKCF0aGlzLm1hdGNoZXJzW2ldLm1hdGNoZXMoc2VnbWVudHNbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuY2xhc3MgUGF0aFJlcXVlc3RNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IobWF0Y2hlcikge1xuICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXJcbiAgfVxuXG4gIG1hdGNoZXMoe3NlZ21lbnRzfSkge1xuICAgIHJldHVybiBCb29sZWFuKHNlZ21lbnRzKSAmJiB0aGlzLm1hdGNoZXIubWF0Y2hlcyhzZWdtZW50cylcbiAgfVxufVxuXG5jb25zdCBLZXlSZXF1ZXN0TWF0Y2hlciA9IHtcbiAgbWF0Y2hlcyh7aXNLZXlQb3NpdGlvbn0pIHtcbiAgICByZXR1cm4gaXNLZXlQb3NpdGlvblxuICB9XG59XG5cbmNvbnN0IFZhbHVlUmVxdWVzdE1hdGNoZXIgPSB7XG4gIG1hdGNoZXMoe2lzVmFsdWVQb3NpdGlvbn0pIHtcbiAgICByZXR1cm4gaXNWYWx1ZVBvc2l0aW9uXG4gIH1cbn1cblxuY2xhc3MgUmVxdWVzdE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihtYXRjaGVycyA9IFtdKSB7XG4gICAgdGhpcy5tYXRjaGVycyA9IG1hdGNoZXJzXG4gIH1cblxuICBwYXRoKG1hdGNoZXIpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RNYXRjaGVyKHRoaXMubWF0Y2hlcnMuY29uY2F0KFtuZXcgUGF0aFJlcXVlc3RNYXRjaGVyKG1hdGNoZXIpXSkpXG4gIH1cblxuICB2YWx1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RNYXRjaGVyKHRoaXMubWF0Y2hlcnMuY29uY2F0KFtWYWx1ZVJlcXVlc3RNYXRjaGVyXSkpXG4gIH1cblxuICBrZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0TWF0Y2hlcih0aGlzLm1hdGNoZXJzLmNvbmNhdChbS2V5UmVxdWVzdE1hdGNoZXJdKSlcbiAgfVxuXG4gIG1hdGNoZXMocmVxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnMuZXZlcnkobWF0Y2hlciA9PiBtYXRjaGVyLm1hdGNoZXMocmVxKSlcbiAgfVxufVxuXG5jbGFzcyBDb21wb3NpdGVNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IobWF0Y2hlcnMgPSBbXSkge1xuICAgIHRoaXMubWF0Y2hlcnMgPSBtYXRjaGVyc1xuICB9XG5cbiAgYXBwZW5kKG1hdGNoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDb21wb3NpdGVNYXRjaGVyKHRoaXMubWF0Y2hlcnMuY29uY2F0KFttYXRjaGVyXSkpXG4gIH1cblxuICBwcmVwZW5kKG1hdGNoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDb21wb3NpdGVNYXRjaGVyKFttYXRjaGVyXS5jb25jYXQodGhpcy5tYXRjaGVycykpXG4gIH1cbn1cblxuXG5jbGFzcyBBbmRNYXRjaGVyIGV4dGVuZHMgQ29tcG9zaXRlTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoZXJzID0gW10pIHtcbiAgICBzdXBlcihtYXRjaGVycylcbiAgfVxuXG4gIGNyZWF0ZUNvbXBvc2l0ZU1hdGNoZXIobWF0Y2hlcnMpIHtcbiAgICByZXR1cm4gbmV3IEFuZE1hdGNoZXIobWF0Y2hlcnMpXG4gIH1cblxuICBtYXRjaGVzKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnMuZXZlcnkobWF0Y2hlciA9PiBtYXRjaGVyLm1hdGNoZXMoaW5wdXQpKVxuICB9XG59XG5cbmNsYXNzIE9yTWF0Y2hlciBleHRlbmRzIENvbXBvc2l0ZU1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihtYXRjaGVycyA9IFtdKSB7XG4gICAgc3VwZXIobWF0Y2hlcnMpXG4gIH1cblxuICBjcmVhdGVDb21wb3NpdGVNYXRjaGVyKG1hdGNoZXJzKSB7XG4gICAgcmV0dXJuIG5ldyBPck1hdGNoZXIobWF0Y2hlcnMpXG4gIH1cblxuICBtYXRjaGVzKGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnMuc29tZShtYXRjaGVyID0+IG1hdGNoZXIubWF0Y2hlcyhpbnB1dCkpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGgoKSB7XG4gIHJldHVybiBuZXcgSnNvblBhdGhNYXRjaGVyKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdE1hdGNoZXIoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYW5kKC4uLm1hdGNoZXJzKSB7XG4gIHJldHVybiBuZXcgQW5kTWF0Y2hlcihtYXRjaGVycylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yKC4uLm1hdGNoZXJzKSB7XG4gIHJldHVybiBuZXcgT3JNYXRjaGVyKG1hdGNoZXJzKVxufVxuIl19