Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _parseCode = require("./parse-code");

var _parseCode2 = _interopRequireDefault(_parseCode);

var _buildSuggestion = require("./build-suggestion");

var _buildSuggestion2 = _interopRequireDefault(_buildSuggestion);

var _resolveModule = require("./resolve-module");

var _resolveModule2 = _interopRequireDefault(_resolveModule);

var _findDestination = require("./find-destination");

var _findDestination2 = _interopRequireDefault(_findDestination);

"use babel";
exports.parseCode = _parseCode2["default"];
exports.buildSuggestion = _buildSuggestion2["default"];
exports.resolveModule = _resolveModule2["default"];
exports.findDestination = _findDestination2["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7eUJBRXNCLGNBQWM7Ozs7K0JBQ1Isb0JBQW9COzs7OzZCQUN0QixrQkFBa0I7Ozs7K0JBQ2hCLG9CQUFvQjs7OztBQUxoRCxXQUFXLENBQUE7UUFPRixTQUFTO1FBQUUsZUFBZTtRQUFFLGFBQWE7UUFBRSxlQUFlIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcbi8vIEBmbG93XG5pbXBvcnQgcGFyc2VDb2RlIGZyb20gXCIuL3BhcnNlLWNvZGVcIlxuaW1wb3J0IGJ1aWxkU3VnZ2VzdGlvbiBmcm9tIFwiLi9idWlsZC1zdWdnZXN0aW9uXCJcbmltcG9ydCByZXNvbHZlTW9kdWxlIGZyb20gXCIuL3Jlc29sdmUtbW9kdWxlXCJcbmltcG9ydCBmaW5kRGVzdGluYXRpb24gZnJvbSBcIi4vZmluZC1kZXN0aW5hdGlvblwiXG5cbmV4cG9ydCB7IHBhcnNlQ29kZSwgYnVpbGRTdWdnZXN0aW9uLCByZXNvbHZlTW9kdWxlLCBmaW5kRGVzdGluYXRpb24gfVxuIl19