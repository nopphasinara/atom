'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.getHighlight = getHighlight;
exports.getHighlightRange = getHighlightRange;
exports.getFullLineRange = getFullLineRange;

function getHighlight(text, range) {
  var _getHighlightRange = getHighlightRange(text, range.start.column, range.end.column);

  var _getHighlightRange2 = _slicedToArray(_getHighlightRange, 2);

  var start = _getHighlightRange2[0];
  var end = _getHighlightRange2[1];

  range.start.column = start;
  range.end.column = end;

  return range;
}

;

function getHighlightRange(text, start, end) {
  for (; start > 0; start--) {
    if (/[\[\]\(\)\s]/.test(text[start])) {
      start++;
      break;
    }
  }

  for (; end < text.length; end++) {
    if (/[\[\]\(\)\s]/.test(text[end])) {
      break;
    }
  }

  return [start, end];
}

;

function getFullLineRange(range) {
  var startOfLine = [range.start.row, 0];
  var endOfLine = [range.end.row, 1000];

  return [startOfLine, endOfLine];
}

;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvaHlwZXJjbGljay1tYXJrZG93bi9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7QUFFTCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFOzJCQUNqQixpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Ozs7TUFBNUUsS0FBSztNQUFFLEdBQUc7O0FBRWxCLE9BQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUMzQixPQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7O0FBRXZCLFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBQUEsQ0FBQzs7QUFFSyxTQUFTLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ2xELFNBQU8sS0FBSyxHQUFHLENBQUMsRUFBRyxLQUFLLEVBQUUsRUFBRTtBQUMxQixRQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDcEMsV0FBSyxFQUFFLENBQUM7QUFDUixZQUFNO0tBQ1A7R0FDRjs7QUFFRCxTQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsRUFBRSxFQUFFO0FBQ2hDLFFBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNsQyxZQUFNO0tBQ1A7R0FDRjs7QUFFRCxTQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQ3JCOztBQUFBLENBQUM7O0FBRUssU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7QUFDdEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUV4QyxTQUFPLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0NBQ2pDOztBQUFBLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9oeXBlcmNsaWNrLW1hcmtkb3duL2xpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0KHRleHQsIHJhbmdlKSB7XG4gIGNvbnN0IFsgc3RhcnQsIGVuZCBdID0gZ2V0SGlnaGxpZ2h0UmFuZ2UodGV4dCwgcmFuZ2Uuc3RhcnQuY29sdW1uLCByYW5nZS5lbmQuY29sdW1uKTtcblxuICByYW5nZS5zdGFydC5jb2x1bW4gPSBzdGFydDtcbiAgcmFuZ2UuZW5kLmNvbHVtbiA9IGVuZDtcblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0UmFuZ2UodGV4dCwgc3RhcnQsIGVuZCkge1xuICBmb3IgKDsgc3RhcnQgPiAwIDsgc3RhcnQtLSkge1xuICAgIGlmICgvW1xcW1xcXVxcKFxcKVxcc10vLnRlc3QodGV4dFtzdGFydF0pKSB7XG4gICAgICBzdGFydCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGVuZCA8IHRleHQubGVuZ3RoIDsgZW5kKyspIHtcbiAgICBpZiAoL1tcXFtcXF1cXChcXClcXHNdLy50ZXN0KHRleHRbZW5kXSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbc3RhcnQsIGVuZF07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbExpbmVSYW5nZShyYW5nZSkge1xuICBjb25zdCBzdGFydE9mTGluZSA9IFtyYW5nZS5zdGFydC5yb3csIDBdO1xuICBjb25zdCBlbmRPZkxpbmUgPSBbcmFuZ2UuZW5kLnJvdywgMTAwMF07XG5cbiAgcmV0dXJuIFtzdGFydE9mTGluZSwgZW5kT2ZMaW5lXTtcbn07XG4iXX0=