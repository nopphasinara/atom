Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = buildSuggestion;
"use babel";

var scopeSize = function scopeSize(_ref) {
  var b = _ref.block;
  return b.end - b.start;
};

function findClosestScope(scopes, start, end) {
  return scopes.reduce(function (closest, scope) {
    var block = scope.block;

    if (block.start <= start && block.end >= end && scopeSize(scope) < scopeSize(closest)) {
      return scope;
    }

    return closest;
  });
}

function buildSuggestion(info, text, _ref2) {
  var start = _ref2.start;
  var end = _ref2.end;
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  if (info.parseError) throw info.parseError;
  var paths = info.paths;
  var scopes = info.scopes;
  var externalModules = info.externalModules;

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (path.range.start > end) {
      break;
    }
    if (path.range.start <= start && path.range.end >= end) {
      if (path.imported !== "default") {
        return {
          type: "from-import",
          imported: path.imported,
          moduleName: path.moduleName,
          bindingStart: path.range.start,
          bindingEnd: path.range.end
        };
      }

      return {
        type: "path",
        imported: path.imported,
        moduleName: path.moduleName,
        range: path.range
      };
    }
  }

  var closestScope = findClosestScope(scopes, start, end);
  // Sometimes it reports it has a binding, but it can't actually get the
  // binding
  if (closestScope.hasBinding(text) && closestScope.getBinding(text)) {
    var _ret = (function () {
      var binding = closestScope.getBinding(text);
      var _binding$identifier = binding.identifier;
      var bindingStart = _binding$identifier.start;
      var bindingEnd = _binding$identifier.end;

      var clickedDeclaration = bindingStart <= start && bindingEnd >= end;
      var crossFiles = !options.jumpToImport;

      if (clickedDeclaration || crossFiles) {
        var targetModule = externalModules.find(function (m) {
          var bindingStart = binding.identifier.start;

          return m.local == text && m.start == bindingStart;
        });

        if (targetModule) {
          return {
            v: {
              type: "from-import",
              imported: targetModule.imported,
              moduleName: targetModule.moduleName,
              bindingStart: bindingStart,
              bindingEnd: bindingEnd
            }
          };
        }
      }

      // Exit early if you clicked on where the variable is declared
      if (clickedDeclaration) {
        return {
          v: null
        };
      }

      return {
        v: {
          type: "binding",
          start: bindingStart,
          end: bindingEnd
        }
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  }

  return null;
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9idWlsZC1zdWdnZXN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFzQndCLGVBQWU7QUF0QnZDLFdBQVcsQ0FBQTs7QUFJWCxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxJQUFZO01BQUgsQ0FBQyxHQUFWLElBQVksQ0FBVixLQUFLO1NBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSztDQUFBLENBQUE7O0FBRW5ELFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDNUMsU0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUssRUFBSztRQUMvQixLQUFLLEdBQUssS0FBSyxDQUFmLEtBQUs7O0FBRWIsUUFDRSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssSUFDcEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQ2hCLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQ3JDO0FBQ0EsYUFBTyxLQUFLLENBQUE7S0FDYjs7QUFFRCxXQUFPLE9BQU8sQ0FBQTtHQUNmLENBQUMsQ0FBQTtDQUNIOztBQUVjLFNBQVMsZUFBZSxDQUNyQyxJQUFVLEVBQ1YsSUFBWSxFQUNaLEtBQXFCLEVBRVI7TUFGWCxLQUFLLEdBQVAsS0FBcUIsQ0FBbkIsS0FBSztNQUFFLEdBQUcsR0FBWixLQUFxQixDQUFaLEdBQUc7TUFDWixPQUEwQix5REFBRyxFQUFFOztBQUUvQixNQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFBO01BQ2xDLEtBQUssR0FBOEIsSUFBSSxDQUF2QyxLQUFLO01BQUUsTUFBTSxHQUFzQixJQUFJLENBQWhDLE1BQU07TUFBRSxlQUFlLEdBQUssSUFBSSxDQUF4QixlQUFlOztBQUV0QyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxRQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDckIsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFDMUIsWUFBSztLQUNOO0FBQ0QsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFO0FBQ3RELFVBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7QUFDL0IsZUFBTztBQUNMLGNBQUksRUFBRSxhQUFhO0FBQ25CLGtCQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDdkIsb0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQixzQkFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztBQUM5QixvQkFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztTQUMzQixDQUFBO09BQ0Y7O0FBRUQsYUFBTztBQUNMLFlBQUksRUFBRSxNQUFNO0FBQ1osZ0JBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUN2QixrQkFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQzNCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztPQUNsQixDQUFBO0tBQ0Y7R0FDRjs7QUFFRCxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBOzs7QUFHekQsTUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBQ2xFLFVBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7Z0NBQ0ksT0FBTyxDQUFDLFVBQVU7VUFBcEQsWUFBWSx1QkFBbkIsS0FBSztVQUFxQixVQUFVLHVCQUFmLEdBQUc7O0FBRWhDLFVBQU0sa0JBQWtCLEdBQUcsWUFBWSxJQUFJLEtBQUssSUFBSSxVQUFVLElBQUksR0FBRyxDQUFBO0FBQ3JFLFVBQU0sVUFBVSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQTs7QUFFeEMsVUFBSSxrQkFBa0IsSUFBSSxVQUFVLEVBQUU7QUFDcEMsWUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsRUFBSTtjQUM5QixZQUFZLEdBQUssT0FBTyxDQUFDLFVBQVUsQ0FBMUMsS0FBSzs7QUFDYixpQkFBTyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQTtTQUNsRCxDQUFDLENBQUE7O0FBRUYsWUFBSSxZQUFZLEVBQUU7QUFDaEI7ZUFBTztBQUNMLGtCQUFJLEVBQUUsYUFBYTtBQUNuQixzQkFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRO0FBQy9CLHdCQUFVLEVBQUUsWUFBWSxDQUFDLFVBQVU7QUFDbkMsMEJBQVksRUFBWixZQUFZO0FBQ1osd0JBQVUsRUFBVixVQUFVO2FBQ1g7WUFBQTtTQUNGO09BQ0Y7OztBQUdELFVBQUksa0JBQWtCLEVBQUU7QUFDdEI7YUFBTyxJQUFJO1VBQUE7T0FDWjs7QUFFRDtXQUFPO0FBQ0wsY0FBSSxFQUFFLFNBQVM7QUFDZixlQUFLLEVBQUUsWUFBWTtBQUNuQixhQUFHLEVBQUUsVUFBVTtTQUNoQjtRQUFBOzs7O0dBQ0Y7O0FBRUQsU0FBTyxJQUFJLENBQUE7Q0FDWiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvYnVpbGQtc3VnZ2VzdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcbi8vIEBmbG93XG5pbXBvcnQgdHlwZSB7IEluZm8sIFJhbmdlLCBTdWdnZXN0aW9uLCBTdWdnZXN0aW9uT3B0aW9ucyB9IGZyb20gXCIuLi90eXBlc1wiXG5cbmNvbnN0IHNjb3BlU2l6ZSA9ICh7IGJsb2NrOiBiIH0pID0+IGIuZW5kIC0gYi5zdGFydFxuXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdFNjb3BlKHNjb3Blcywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gc2NvcGVzLnJlZHVjZSgoY2xvc2VzdCwgc2NvcGUpID0+IHtcbiAgICBjb25zdCB7IGJsb2NrIH0gPSBzY29wZVxuXG4gICAgaWYgKFxuICAgICAgYmxvY2suc3RhcnQgPD0gc3RhcnQgJiZcbiAgICAgIGJsb2NrLmVuZCA+PSBlbmQgJiZcbiAgICAgIHNjb3BlU2l6ZShzY29wZSkgPCBzY29wZVNpemUoY2xvc2VzdClcbiAgICApIHtcbiAgICAgIHJldHVybiBzY29wZVxuICAgIH1cblxuICAgIHJldHVybiBjbG9zZXN0XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkU3VnZ2VzdGlvbihcbiAgaW5mbzogSW5mbyxcbiAgdGV4dDogc3RyaW5nLFxuICB7IHN0YXJ0LCBlbmQgfTogUmFuZ2UsXG4gIG9wdGlvbnM6IFN1Z2dlc3Rpb25PcHRpb25zID0ge30sXG4pOiA/U3VnZ2VzdGlvbiB7XG4gIGlmIChpbmZvLnBhcnNlRXJyb3IpIHRocm93IGluZm8ucGFyc2VFcnJvclxuICBjb25zdCB7IHBhdGhzLCBzY29wZXMsIGV4dGVybmFsTW9kdWxlcyB9ID0gaW5mb1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoID0gcGF0aHNbaV1cbiAgICBpZiAocGF0aC5yYW5nZS5zdGFydCA+IGVuZCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKHBhdGgucmFuZ2Uuc3RhcnQgPD0gc3RhcnQgJiYgcGF0aC5yYW5nZS5lbmQgPj0gZW5kKSB7XG4gICAgICBpZiAocGF0aC5pbXBvcnRlZCAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiBcImZyb20taW1wb3J0XCIsXG4gICAgICAgICAgaW1wb3J0ZWQ6IHBhdGguaW1wb3J0ZWQsXG4gICAgICAgICAgbW9kdWxlTmFtZTogcGF0aC5tb2R1bGVOYW1lLFxuICAgICAgICAgIGJpbmRpbmdTdGFydDogcGF0aC5yYW5nZS5zdGFydCxcbiAgICAgICAgICBiaW5kaW5nRW5kOiBwYXRoLnJhbmdlLmVuZCxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcInBhdGhcIixcbiAgICAgICAgaW1wb3J0ZWQ6IHBhdGguaW1wb3J0ZWQsXG4gICAgICAgIG1vZHVsZU5hbWU6IHBhdGgubW9kdWxlTmFtZSxcbiAgICAgICAgcmFuZ2U6IHBhdGgucmFuZ2UsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgY2xvc2VzdFNjb3BlID0gZmluZENsb3Nlc3RTY29wZShzY29wZXMsIHN0YXJ0LCBlbmQpXG4gIC8vIFNvbWV0aW1lcyBpdCByZXBvcnRzIGl0IGhhcyBhIGJpbmRpbmcsIGJ1dCBpdCBjYW4ndCBhY3R1YWxseSBnZXQgdGhlXG4gIC8vIGJpbmRpbmdcbiAgaWYgKGNsb3Nlc3RTY29wZS5oYXNCaW5kaW5nKHRleHQpICYmIGNsb3Nlc3RTY29wZS5nZXRCaW5kaW5nKHRleHQpKSB7XG4gICAgY29uc3QgYmluZGluZyA9IGNsb3Nlc3RTY29wZS5nZXRCaW5kaW5nKHRleHQpXG4gICAgY29uc3QgeyBzdGFydDogYmluZGluZ1N0YXJ0LCBlbmQ6IGJpbmRpbmdFbmQgfSA9IGJpbmRpbmcuaWRlbnRpZmllclxuXG4gICAgY29uc3QgY2xpY2tlZERlY2xhcmF0aW9uID0gYmluZGluZ1N0YXJ0IDw9IHN0YXJ0ICYmIGJpbmRpbmdFbmQgPj0gZW5kXG4gICAgY29uc3QgY3Jvc3NGaWxlcyA9ICFvcHRpb25zLmp1bXBUb0ltcG9ydFxuXG4gICAgaWYgKGNsaWNrZWREZWNsYXJhdGlvbiB8fCBjcm9zc0ZpbGVzKSB7XG4gICAgICBjb25zdCB0YXJnZXRNb2R1bGUgPSBleHRlcm5hbE1vZHVsZXMuZmluZChtID0+IHtcbiAgICAgICAgY29uc3QgeyBzdGFydDogYmluZGluZ1N0YXJ0IH0gPSBiaW5kaW5nLmlkZW50aWZpZXJcbiAgICAgICAgcmV0dXJuIG0ubG9jYWwgPT0gdGV4dCAmJiBtLnN0YXJ0ID09IGJpbmRpbmdTdGFydFxuICAgICAgfSlcblxuICAgICAgaWYgKHRhcmdldE1vZHVsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IFwiZnJvbS1pbXBvcnRcIixcbiAgICAgICAgICBpbXBvcnRlZDogdGFyZ2V0TW9kdWxlLmltcG9ydGVkLFxuICAgICAgICAgIG1vZHVsZU5hbWU6IHRhcmdldE1vZHVsZS5tb2R1bGVOYW1lLFxuICAgICAgICAgIGJpbmRpbmdTdGFydCxcbiAgICAgICAgICBiaW5kaW5nRW5kLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhpdCBlYXJseSBpZiB5b3UgY2xpY2tlZCBvbiB3aGVyZSB0aGUgdmFyaWFibGUgaXMgZGVjbGFyZWRcbiAgICBpZiAoY2xpY2tlZERlY2xhcmF0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcImJpbmRpbmdcIixcbiAgICAgIHN0YXJ0OiBiaW5kaW5nU3RhcnQsXG4gICAgICBlbmQ6IGJpbmRpbmdFbmQsXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiJdfQ==