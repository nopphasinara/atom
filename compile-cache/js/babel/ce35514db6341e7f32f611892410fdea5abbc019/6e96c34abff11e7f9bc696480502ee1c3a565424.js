'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = alignLines;
function repeat(string, times) {
  var result = '';
  for (var i = 0; i < times; i++) {
    result += string;
  }
  return result;
}

function transformLines(lines, regexp) {
  var n = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var alignPosition = -1;

  var transformed = lines.map(function (line) {
    var match = undefined;

    // reset regexp and find nth match
    regexp.lastIndex = 0;
    for (var i = 0; i <= n; i++) {
      match = regexp.exec(line);
    }
    if (!match) {
      return { matched: false, content: line };
    }

    var alignStart = match.index;

    // search the first non-whitespace character
    while (alignStart > 0 && line[alignStart - 1] === ' ') alignStart--;

    // part before regex match with no trailing whitespace (e.g. `let a`)
    var left = line.substring(0, alignStart);
    // part after regex match starting (e.g. `= 'foo'`)
    var right = line.substring(match.index);

    if (alignStart > alignPosition) {
      alignPosition = alignStart;
    }
    return { matched: true, left: left, right: right, alignStart: alignStart };
  }).map(function (line) {
    // leave unmatched lines as is
    if (!line.matched) {
      return line.content;
    }
    // leave one space before the aligned char/string
    var spacesCount = alignPosition - line.alignStart + 1;
    return line.left + repeat(' ', spacesCount) + line.right;
  });
  return [transformed, alignPosition > -1];
}

function alignLines(content, regexp) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var lineEnding = options.lineEnding || '\n';
  var lines = content.split(lineEnding);
  var changed = false;
  var n = 0;
  do {
    var _transformLines = transformLines(lines, regexp, n);

    var _transformLines2 = _slicedToArray(_transformLines, 2);

    newLines = _transformLines2[0];
    changed = _transformLines2[1];

    lines = newLines;
    n++;
  } while (regexp.global && changed && n <= 100);

  // there will probably not be 100 occurences on the same line
  // so it is most likely to be an issue with the regexp
  if (n === 100) {
    console.error('stopped alignment after 100th match, check regexp');
  }
  return lines.join(lineEnding);
}

;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWxpZ24tcmVnZXhwL2xpYi9hbGlnbi1saW5lcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7O3FCQW1EWSxVQUFVO0FBakRsQyxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzdCLE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlCLFVBQU0sSUFBSSxNQUFNLENBQUM7R0FDbEI7QUFDRCxTQUFPLE1BQU0sQ0FBQztDQUNmOztBQUVELFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQVM7TUFBUCxDQUFDLHlEQUFHLENBQUM7O0FBQzFDLE1BQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUV2QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3BDLFFBQUksS0FBSyxZQUFBLENBQUM7OztBQUdWLFVBQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0IsV0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0I7QUFDRCxRQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsYUFBTyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0tBQ3hDOztBQUVELFFBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7OztBQUc3QixXQUFPLFVBQVUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUM7OztBQUdwRSxRQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFM0MsUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTFDLFFBQUksVUFBVSxHQUFHLGFBQWEsRUFBRTtBQUM5QixtQkFBYSxHQUFHLFVBQVUsQ0FBQztLQUM1QjtBQUNELFdBQU8sRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUM7R0FDakQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksRUFBSTs7QUFFYixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7O0FBRUQsUUFBTSxXQUFXLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELFdBQU8sSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDMUQsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxDQUFDLFdBQVcsRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMxQzs7QUFFYyxTQUFTLFVBQVUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDOUQsTUFBTSxVQUFVLEdBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7QUFDL0MsTUFBSSxLQUFLLEdBQVcsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QyxNQUFJLE9BQU8sR0FBUyxLQUFLLENBQUM7QUFDMUIsTUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsS0FBRzswQkFDcUIsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDOzs7O0FBQXJELFlBQVE7QUFBRSxXQUFPOztBQUNsQixTQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ2pCLEtBQUMsRUFBRSxDQUFDO0dBQ0wsUUFBUSxNQUFNLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFOzs7O0FBSS9DLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNiLFdBQU8sQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztHQUNwRTtBQUNELFNBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUMvQjs7QUFBQSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWxpZ24tcmVnZXhwL2xpYi9hbGlnbi1saW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5mdW5jdGlvbiByZXBlYXQoc3RyaW5nLCB0aW1lcykge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xuICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtTGluZXMobGluZXMsIHJlZ2V4cCwgbiA9IDApIHtcbiAgbGV0IGFsaWduUG9zaXRpb24gPSAtMTtcblxuICBjb25zdCB0cmFuc2Zvcm1lZCA9IGxpbmVzLm1hcChsaW5lID0+IHtcbiAgICBsZXQgbWF0Y2g7XG5cbiAgICAvLyByZXNldCByZWdleHAgYW5kIGZpbmQgbnRoIG1hdGNoXG4gICAgcmVnZXhwLmxhc3RJbmRleCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XG4gICAgICBtYXRjaCA9IHJlZ2V4cC5leGVjKGxpbmUpO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4ge21hdGNoZWQ6IGZhbHNlLCBjb250ZW50OiBsaW5lfTtcbiAgICB9XG5cbiAgICBsZXQgYWxpZ25TdGFydCA9IG1hdGNoLmluZGV4O1xuXG4gICAgLy8gc2VhcmNoIHRoZSBmaXJzdCBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXJcbiAgICB3aGlsZSAoYWxpZ25TdGFydCA+IDAgJiYgbGluZVthbGlnblN0YXJ0IC0gMV0gPT09ICcgJykgYWxpZ25TdGFydC0tO1xuXG4gICAgLy8gcGFydCBiZWZvcmUgcmVnZXggbWF0Y2ggd2l0aCBubyB0cmFpbGluZyB3aGl0ZXNwYWNlIChlLmcuIGBsZXQgYWApXG4gICAgY29uc3QgbGVmdCA9IGxpbmUuc3Vic3RyaW5nKDAsIGFsaWduU3RhcnQpO1xuICAgIC8vIHBhcnQgYWZ0ZXIgcmVnZXggbWF0Y2ggc3RhcnRpbmcgKGUuZy4gYD0gJ2ZvbydgKVxuICAgIGNvbnN0IHJpZ2h0ID0gbGluZS5zdWJzdHJpbmcobWF0Y2guaW5kZXgpO1xuXG4gICAgaWYgKGFsaWduU3RhcnQgPiBhbGlnblBvc2l0aW9uKSB7XG4gICAgICBhbGlnblBvc2l0aW9uID0gYWxpZ25TdGFydDtcbiAgICB9XG4gICAgcmV0dXJuIHttYXRjaGVkOiB0cnVlLCBsZWZ0LCByaWdodCwgYWxpZ25TdGFydH07XG4gIH0pLm1hcChsaW5lID0+IHtcbiAgICAvLyBsZWF2ZSB1bm1hdGNoZWQgbGluZXMgYXMgaXNcbiAgICBpZiAoIWxpbmUubWF0Y2hlZCkge1xuICAgICAgcmV0dXJuIGxpbmUuY29udGVudDtcbiAgICB9XG4gICAgLy8gbGVhdmUgb25lIHNwYWNlIGJlZm9yZSB0aGUgYWxpZ25lZCBjaGFyL3N0cmluZ1xuICAgIGNvbnN0IHNwYWNlc0NvdW50ID0gYWxpZ25Qb3NpdGlvbiAtIGxpbmUuYWxpZ25TdGFydCArIDE7XG4gICAgcmV0dXJuIGxpbmUubGVmdCArIHJlcGVhdCgnICcsIHNwYWNlc0NvdW50KSArIGxpbmUucmlnaHQ7XG4gIH0pO1xuICByZXR1cm4gW3RyYW5zZm9ybWVkLCBhbGlnblBvc2l0aW9uID4gLTFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGlnbkxpbmVzKGNvbnRlbnQsIHJlZ2V4cCwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGxpbmVFbmRpbmcgID0gb3B0aW9ucy5saW5lRW5kaW5nIHx8ICdcXG4nO1xuICBsZXQgbGluZXMgICAgICAgICA9IGNvbnRlbnQuc3BsaXQobGluZUVuZGluZyk7XG4gIGxldCBjaGFuZ2VkICAgICAgID0gZmFsc2U7XG4gIGxldCBuID0gMDtcbiAgZG8ge1xuICAgIFtuZXdMaW5lcywgY2hhbmdlZF0gPSB0cmFuc2Zvcm1MaW5lcyhsaW5lcywgcmVnZXhwLCBuKTtcbiAgICBsaW5lcyA9IG5ld0xpbmVzO1xuICAgIG4rKztcbiAgfSB3aGlsZSAocmVnZXhwLmdsb2JhbCAmJiBjaGFuZ2VkICYmIG4gPD0gMTAwKTtcblxuICAvLyB0aGVyZSB3aWxsIHByb2JhYmx5IG5vdCBiZSAxMDAgb2NjdXJlbmNlcyBvbiB0aGUgc2FtZSBsaW5lXG4gIC8vIHNvIGl0IGlzIG1vc3QgbGlrZWx5IHRvIGJlIGFuIGlzc3VlIHdpdGggdGhlIHJlZ2V4cFxuICBpZiAobiA9PT0gMTAwKSB7XG4gICAgY29uc29sZS5lcnJvcignc3RvcHBlZCBhbGlnbm1lbnQgYWZ0ZXIgMTAwdGggbWF0Y2gsIGNoZWNrIHJlZ2V4cCcpO1xuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKGxpbmVFbmRpbmcpO1xufTtcbiJdfQ==