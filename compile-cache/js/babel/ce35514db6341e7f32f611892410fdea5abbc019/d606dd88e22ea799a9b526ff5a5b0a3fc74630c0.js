Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.resolveObject = resolveObject;
exports.matches = matches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsObject = require('lodash/isObject');

var _lodashIsObject2 = _interopRequireDefault(_lodashIsObject);

var _lodashIsArray = require('lodash/isArray');

var _lodashIsArray2 = _interopRequireDefault(_lodashIsArray);

var _lodashIsUndefined = require('lodash/isUndefined');

var _lodashIsUndefined2 = _interopRequireDefault(_lodashIsUndefined);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

'use babel';

var ArrayTraverser = (function () {
  function ArrayTraverser() {
    var array = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

    _classCallCheck(this, ArrayTraverser);

    this.array = array;
    this.index = index;
  }

  _createClass(ArrayTraverser, [{
    key: 'current',
    value: function current() {
      return this.array[this.index];
    }
  }, {
    key: 'next',
    value: function next() {
      if (!this.hasNext()) {
        throw new Error('no next element at ' + (this.index + 1));
      }
      this.index += 1;
      return this.array[this.index];
    }
  }, {
    key: 'peekNext',
    value: function peekNext(defaultValue) {
      return this.hasNext() ? this.array[this.index + 1] : defaultValue;
    }
  }, {
    key: 'peekPrevious',
    value: function peekPrevious(defaultValue) {
      return this.hasPrevious() ? this.array[this.index - 1] : defaultValue;
    }
  }, {
    key: 'previous',
    value: function previous() {
      if (!this.hasPrevious()) {
        throw new Error('no previous element at ' + this.index);
      }
      this.index -= 1;
      return this.array[this.index];
    }
  }, {
    key: 'hasNext',
    value: function hasNext() {
      return this.index + 1 < this.array.length;
    }
  }, {
    key: 'hasPrevious',
    value: function hasPrevious() {
      return this.index - 1 >= 0 && this.array.length !== 0;
    }
  }]);

  return ArrayTraverser;
})();

exports.ArrayTraverser = ArrayTraverser;

var PositionInfo = (function () {
  function PositionInfo() {
    var segments = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var keyPosition = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var valuePosition = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var previousToken = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    var editedToken = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    var nextToken = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, PositionInfo);

    this.segments = segments;
    this.keyPosition = keyPosition;
    this.valuePosition = valuePosition;
    this.previousToken = previousToken;
    this.editedToken = editedToken;
    this.nextToken = nextToken;
  }

  _createClass(PositionInfo, [{
    key: 'setKeyPosition',
    value: function setKeyPosition() {
      return new PositionInfo(this.segments, true, false, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setValuePosition',
    value: function setValuePosition() {
      return new PositionInfo(this.segments, false, true, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setPreviousToken',
    value: function setPreviousToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, token, this.editedToken, this.nextToken);
    }
  }, {
    key: 'setEditedToken',
    value: function setEditedToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, this.previousToken, token, this.nextToken);
    }
  }, {
    key: 'setNextToken',
    value: function setNextToken(token) {
      return new PositionInfo(this.segments, this.keyPosition, this.valuePosition, this.previousToken, this.editedToken, token);
    }
  }, {
    key: 'add',
    value: function add(segment) {
      return this.addAll([segment]);
    }
  }, {
    key: 'addAll',
    value: function addAll(segments) {
      return new PositionInfo(this.segments.concat(segments), this.keyPosition, this.valuePosition, this.previousToken, this.editedToken, this.nextToken);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return {
        segments: this.segments,
        keyPosition: this.keyPosition,
        valuePosition: this.valuePosition,
        previousToken: this.previousToken,
        editedToken: this.editedToken,
        nextToken: this.nextToken
      };
    }
  }]);

  return PositionInfo;
})();

exports.PositionInfo = PositionInfo;

var ValueHolder = (function () {
  function ValueHolder(value) {
    _classCallCheck(this, ValueHolder);

    this.value = value;
  }

  _createClass(ValueHolder, [{
    key: 'get',
    value: function get() {
      if (!this.hasValue()) {
        throw new Error('value is not set');
      }
      return this.value;
    }
  }, {
    key: 'getOrElse',
    value: function getOrElse(defaultValue) {
      return this.hasValue() ? this.get() : defaultValue;
    }
  }, {
    key: 'set',
    value: function set(value) {
      this.value = value;
    }
  }, {
    key: 'hasValue',
    value: function hasValue() {
      return !(0, _lodashIsUndefined2['default'])(this.value);
    }
  }]);

  return ValueHolder;
})();

exports.ValueHolder = ValueHolder;

function resolveObject(_x9, _x10) {
  var _again = true;

  _function: while (_again) {
    var segments = _x9,
        object = _x10;
    _again = false;

    if (!(0, _lodashIsObject2['default'])(object)) {
      return null;
    }
    if (segments.length === 0) {
      return object;
    }

    var _segments = _toArray(segments);

    var key = _segments[0];

    var restOfSegments = _segments.slice(1);

    _x9 = restOfSegments;
    _x10 = object[key];
    _again = true;
    _segments = key = restOfSegments = undefined;
    continue _function;
  }
}

function doMatches(pattern, file) {
  var path = pattern.indexOf('/') > -1 ? file.getRealPathSync() : file.getBaseName();
  var search = process.platform === 'win32' ? pattern.replace(/\//g, '\\') : pattern;
  return (0, _minimatch2['default'])(path, search);
}

function matches(file, patterns) {
  return (0, _lodashIsArray2['default'])(patterns) ? patterns.some(function (pattern) {
    return doMatches(pattern, file);
  }) : doMatches(patterns, file);
}

var StorageType = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
  BOTH: 'BOTH'
};
exports.StorageType = StorageType;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs4QkFFcUIsaUJBQWlCOzs7OzZCQUNsQixnQkFBZ0I7Ozs7aUNBQ1osb0JBQW9COzs7O3lCQUV0QixXQUFXOzs7O0FBTmpDLFdBQVcsQ0FBQTs7SUFRRSxjQUFjO0FBRWQsV0FGQSxjQUFjLEdBRVc7UUFBeEIsS0FBSyx5REFBRyxFQUFFO1FBQUUsS0FBSyx5REFBRyxDQUFDLENBQUM7OzBCQUZ2QixjQUFjOztBQUd2QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtHQUNuQjs7ZUFMVSxjQUFjOztXQU9sQixtQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDOUI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNuQixjQUFNLElBQUksS0FBSywwQkFBdUIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsQ0FBRyxDQUFBO09BQ3hEO0FBQ0QsVUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7QUFDZixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzlCOzs7V0FFTyxrQkFBQyxZQUFZLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQTtLQUNsRTs7O1dBRVcsc0JBQUMsWUFBWSxFQUFFO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFB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QUFBIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGlzT2JqZWN0IGZyb20gJ2xvZGFzaC9pc09iamVjdCdcbmltcG9ydCBpc0FycmF5IGZyb20gJ2xvZGFzaC9pc0FycmF5J1xuaW1wb3J0IGlzVW5kZWZpbmVkIGZyb20gJ2xvZGFzaC9pc1VuZGVmaW5lZCdcblxuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5cbmV4cG9ydCBjbGFzcyBBcnJheVRyYXZlcnNlciB7XG5cbiAgY29uc3RydWN0b3IoYXJyYXkgPSBbXSwgaW5kZXggPSAtMSkge1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheVxuICAgIHRoaXMuaW5kZXggPSBpbmRleFxuICB9XG5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheVt0aGlzLmluZGV4XVxuICB9XG5cbiAgbmV4dCgpIHtcbiAgICBpZiAoIXRoaXMuaGFzTmV4dCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIG5leHQgZWxlbWVudCBhdCAke3RoaXMuaW5kZXggKyAxfWApXG4gICAgfVxuICAgIHRoaXMuaW5kZXggKz0gMVxuICAgIHJldHVybiB0aGlzLmFycmF5W3RoaXMuaW5kZXhdXG4gIH1cblxuICBwZWVrTmV4dChkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXNOZXh0KCkgPyB0aGlzLmFycmF5W3RoaXMuaW5kZXggKyAxXSA6IGRlZmF1bHRWYWx1ZVxuICB9XG5cbiAgcGVla1ByZXZpb3VzKGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmhhc1ByZXZpb3VzKCkgPyB0aGlzLmFycmF5W3RoaXMuaW5kZXggLSAxXSA6IGRlZmF1bHRWYWx1ZVxuICB9XG5cbiAgcHJldmlvdXMoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbm8gcHJldmlvdXMgZWxlbWVudCBhdCAke3RoaXMuaW5kZXh9YClcbiAgICB9XG4gICAgdGhpcy5pbmRleCAtPSAxXG4gICAgcmV0dXJuIHRoaXMuYXJyYXlbdGhpcy5pbmRleF1cbiAgfVxuXG4gIGhhc05leHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZXggKyAxIDwgdGhpcy5hcnJheS5sZW5ndGhcbiAgfVxuXG4gIGhhc1ByZXZpb3VzKCkge1xuICAgIHJldHVybiB0aGlzLmluZGV4IC0gMSA+PSAwICYmIHRoaXMuYXJyYXkubGVuZ3RoICE9PSAwXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uSW5mbyB7XG4gIGNvbnN0cnVjdG9yKHNlZ21lbnRzID0gW10sXG4gICAga2V5UG9zaXRpb24gPSBmYWxzZSxcbiAgICB2YWx1ZVBvc2l0aW9uID0gZmFsc2UsXG4gICAgcHJldmlvdXNUb2tlbiA9IG51bGwsXG4gICAgZWRpdGVkVG9rZW4gPSBudWxsLFxuICAgIG5leHRUb2tlbiA9IG51bGxcbiAgKSB7XG4gICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzXG4gICAgdGhpcy5rZXlQb3NpdGlvbiA9IGtleVBvc2l0aW9uXG4gICAgdGhpcy52YWx1ZVBvc2l0aW9uID0gdmFsdWVQb3NpdGlvblxuICAgIHRoaXMucHJldmlvdXNUb2tlbiA9IHByZXZpb3VzVG9rZW5cbiAgICB0aGlzLmVkaXRlZFRva2VuID0gZWRpdGVkVG9rZW5cbiAgICB0aGlzLm5leHRUb2tlbiA9IG5leHRUb2tlblxuICB9XG5cbiAgc2V0S2V5UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbkluZm8odGhpcy5zZWdtZW50cywgdHJ1ZSwgZmFsc2UsIHRoaXMucHJldmlvdXNUb2tlbiwgdGhpcy5lZGl0ZWRUb2tlbiwgdGhpcy5uZXh0VG9rZW4pXG4gIH1cblxuICBzZXRWYWx1ZVBvc2l0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb25JbmZvKHRoaXMuc2VnbWVudHMsIGZhbHNlLCB0cnVlLCB0aGlzLnByZXZpb3VzVG9rZW4sIHRoaXMuZWRpdGVkVG9rZW4sIHRoaXMubmV4dFRva2VuKVxuICB9XG5cbiAgc2V0UHJldmlvdXNUb2tlbih0b2tlbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb25JbmZvKHRoaXMuc2VnbWVudHMsIHRoaXMua2V5UG9zaXRpb24sIHRoaXMudmFsdWVQb3NpdGlvbiwgdG9rZW4sIHRoaXMuZWRpdGVkVG9rZW4sIHRoaXMubmV4dFRva2VuKVxuICB9XG5cbiAgc2V0RWRpdGVkVG9rZW4odG9rZW4pIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uSW5mbyh0aGlzLnNlZ21lbnRzLCB0aGlzLmtleVBvc2l0aW9uLCB0aGlzLnZhbHVlUG9zaXRpb24sIHRoaXMucHJldmlvdXNUb2tlbiwgdG9rZW4sIHRoaXMubmV4dFRva2VuKVxuICB9XG5cbiAgc2V0TmV4dFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbkluZm8odGhpcy5zZWdtZW50cywgdGhpcy5rZXlQb3NpdGlvbiwgdGhpcy52YWx1ZVBvc2l0aW9uLCB0aGlzLnByZXZpb3VzVG9rZW4sIHRoaXMuZWRpdGVkVG9rZW4sIHRva2VuKVxuICB9XG5cbiAgYWRkKHNlZ21lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRBbGwoW3NlZ21lbnRdKVxuICB9XG5cbiAgYWRkQWxsKHNlZ21lbnRzKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbkluZm8oXG4gICAgICB0aGlzLnNlZ21lbnRzLmNvbmNhdChzZWdtZW50cyksXG4gICAgICB0aGlzLmtleVBvc2l0aW9uLFxuICAgICAgdGhpcy52YWx1ZVBvc2l0aW9uLFxuICAgICAgdGhpcy5wcmV2aW91c1Rva2VuLFxuICAgICAgdGhpcy5lZGl0ZWRUb2tlbixcbiAgICAgIHRoaXMubmV4dFRva2VuXG4gICAgKVxuICB9XG5cbiAgdG9PYmplY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlZ21lbnRzOiB0aGlzLnNlZ21lbnRzLFxuICAgICAga2V5UG9zaXRpb246IHRoaXMua2V5UG9zaXRpb24sXG4gICAgICB2YWx1ZVBvc2l0aW9uOiB0aGlzLnZhbHVlUG9zaXRpb24sXG4gICAgICBwcmV2aW91c1Rva2VuOiB0aGlzLnByZXZpb3VzVG9rZW4sXG4gICAgICBlZGl0ZWRUb2tlbjogdGhpcy5lZGl0ZWRUb2tlbixcbiAgICAgIG5leHRUb2tlbjogdGhpcy5uZXh0VG9rZW5cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhbHVlSG9sZGVyIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgfVxuXG4gIGdldCgpIHtcbiAgICBpZiAoIXRoaXMuaGFzVmFsdWUoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd2YWx1ZSBpcyBub3Qgc2V0JylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgfVxuXG4gIGdldE9yRWxzZShkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXNWYWx1ZSgpID8gdGhpcy5nZXQoKSA6IGRlZmF1bHRWYWx1ZVxuICB9XG5cbiAgc2V0KHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIH1cblxuICBoYXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gIWlzVW5kZWZpbmVkKHRoaXMudmFsdWUpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVPYmplY3Qoc2VnbWVudHMsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqZWN0XG4gIH1cbiAgY29uc3QgW2tleSwgLi4ucmVzdE9mU2VnbWVudHNdID0gc2VnbWVudHNcbiAgcmV0dXJuIHJlc29sdmVPYmplY3QocmVzdE9mU2VnbWVudHMsIG9iamVjdFtrZXldKVxufVxuXG5mdW5jdGlvbiBkb01hdGNoZXMocGF0dGVybiwgZmlsZSkge1xuICBjb25zdCBwYXRoID0gcGF0dGVybi5pbmRleE9mKCcvJykgPiAtMSA/IGZpbGUuZ2V0UmVhbFBhdGhTeW5jKCkgOiBmaWxlLmdldEJhc2VOYW1lKClcbiAgY29uc3Qgc2VhcmNoID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/IHBhdHRlcm4ucmVwbGFjZSgvXFwvL2csICdcXFxcJykgOiBwYXR0ZXJuXG4gIHJldHVybiBtaW5pbWF0Y2gocGF0aCwgc2VhcmNoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlcyhmaWxlLCBwYXR0ZXJucykge1xuICByZXR1cm4gaXNBcnJheShwYXR0ZXJucykgPyBwYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gZG9NYXRjaGVzKHBhdHRlcm4sIGZpbGUpKSA6IGRvTWF0Y2hlcyhwYXR0ZXJucywgZmlsZSlcbn1cblxuZXhwb3J0IGNvbnN0IFN0b3JhZ2VUeXBlID0ge1xuICBGSUxFOiAnRklMRScsXG4gIEZPTERFUjogJ0ZPTERFUicsXG4gIEJPVEg6ICdCT1RIJ1xufVxuXG4iXX0=