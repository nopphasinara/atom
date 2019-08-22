Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = makeCache;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _parseCode = require('./parse-code');

var _parseCode2 = _interopRequireDefault(_parseCode);

"use babel";

function makeCache(subscriptions) {
    var editors = new WeakMap();
    var data = new WeakMap();

    function watchEditor(editor) {
        if (!editors.has(editor)) {
            editors.set(editor, null);
            subscriptions.add(editor.onDidStopChanging(function () {
                data["delete"](editor);
            }));
        }
    }

    return {
        get: function get(editor) {
            watchEditor(editor);
            if (!data.has(editor)) {
                data.set(editor, (0, _parseCode2["default"])(editor.getText()));
            }

            return data.get(editor);
        }
    };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL21ha2UtY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQUl3QixTQUFTOzs7O3lCQUZYLGNBQWM7Ozs7QUFGcEMsV0FBVyxDQUFBOztBQUlJLFNBQVMsU0FBUyxDQUFDLGFBQWEsRUFBRTtBQUM3QyxRQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBQzdCLFFBQU0sSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUE7O0FBRTFCLGFBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUN6QixZQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN0QixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekIseUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQU07QUFDN0Msb0JBQUksVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3RCLENBQUMsQ0FBQyxDQUFBO1NBQ047S0FDSjs7QUFHRCxXQUFPO0FBQ0gsV0FBRyxFQUFBLGFBQUMsTUFBTSxFQUFFO0FBQ1IsdUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQixnQkFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkIsb0JBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLDRCQUFVLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFDaEQ7O0FBRUQsbUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUMxQjtLQUNKLENBQUE7Q0FDSiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2stcHJvamVjdC1wYXRoL2xpYi9tYWtlLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuXG5pbXBvcnQgcGFyc2VDb2RlIGZyb20gJy4vcGFyc2UtY29kZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZUNhY2hlKHN1YnNjcmlwdGlvbnMpIHtcbiAgICBjb25zdCBlZGl0b3JzID0gbmV3IFdlYWtNYXAoKVxuICAgIGNvbnN0IGRhdGEgPSBuZXcgV2Vha01hcCgpXG5cbiAgICBmdW5jdGlvbiB3YXRjaEVkaXRvcihlZGl0b3IpIHtcbiAgICAgICAgaWYgKCFlZGl0b3JzLmhhcyhlZGl0b3IpKSB7XG4gICAgICAgICAgICBlZGl0b3JzLnNldChlZGl0b3IsIG51bGwpXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVsZXRlKGVkaXRvcilcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQoZWRpdG9yKSB7XG4gICAgICAgICAgICB3YXRjaEVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgICBpZiAoIWRhdGEuaGFzKGVkaXRvcikpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnNldChlZGl0b3IsIHBhcnNlQ29kZShlZGl0b3IuZ2V0VGV4dCgpKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuZ2V0KGVkaXRvcilcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==