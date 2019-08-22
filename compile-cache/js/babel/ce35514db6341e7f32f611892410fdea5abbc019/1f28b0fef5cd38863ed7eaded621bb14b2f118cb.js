Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = cachedParser;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _core = require("./core");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:make-cache");

function cachedParser(subscriptions) {
  var editors = new WeakMap();
  var data = new WeakMap();
  var configCache = new WeakMap();

  function loadBabelConfig(editor) {
    if (!configCache.has(editor)) {
      var babel = require("@babel/core");
      var transformOptions = {
        babelrc: true,
        root: _path2["default"].dirname(editor.getPath()),
        rootMode: "upward-optional",
        filename: editor.getPath()
      };

      try {
        var partialConfig = babel.loadPartialConfig(transformOptions);

        debug("Partial Config", partialConfig);

        if (partialConfig.config == null) {
          configCache.set(editor, undefined);
        } else {
          configCache.set(editor, partialConfig.options);
        }
      } catch (e) {
        debug("Error loading config");
        debug(e);
      }
    }
    return configCache.get(editor);
  }

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
        data.set(editor, (0, _core.parseCode)(editor.getText(), loadBabelConfig(editor)));
      }

      // $FlowExpectError - Flow thinks it might return null here
      return data.get(editor);
    }
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvbWFrZS1jYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBV3dCLFlBQVk7Ozs7b0JBUm5CLE1BQU07Ozs7b0JBR0csUUFBUTs7cUJBQ1osT0FBTzs7OztBQVA3QixXQUFXLENBQUE7O0FBU1gsSUFBTSxLQUFLLEdBQUcsd0JBQVUsMEJBQTBCLENBQUMsQ0FBQTs7QUFFcEMsU0FBUyxZQUFZLENBQUMsYUFBa0MsRUFBRTtBQUN2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBQzdCLE1BQU0sSUFBK0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBQ3JELE1BQU0sV0FBeUMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBOztBQUUvRCxXQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDL0IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDNUIsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsZUFBTyxFQUFFLElBQUk7QUFDYixZQUFJLEVBQUUsa0JBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxnQkFBUSxFQUFFLGlCQUFpQjtBQUMzQixnQkFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7T0FDM0IsQ0FBQTs7QUFFRCxVQUFJO0FBQ0YsWUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRS9ELGFBQUssQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQTs7QUFFdEMsWUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtBQUNoQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7U0FDbkMsTUFBTTtBQUNMLHFCQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDL0M7T0FDRixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsYUFBSyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDN0IsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ1Q7S0FDRjtBQUNELFdBQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUMvQjs7QUFFRCxXQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDM0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDeEIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekIsbUJBQWEsQ0FBQyxHQUFHLENBQ2YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQU07QUFDN0IsWUFBSSxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDcEIsQ0FBQyxDQUNILENBQUE7S0FDRjtHQUNGOztBQUVELFNBQU87QUFDTCxPQUFHLEVBQUEsYUFBQyxNQUFrQixFQUFRO0FBQzVCLGlCQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDckIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQVUsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdkU7OztBQUdELGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUN4QjtHQUNGLENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL21ha2UtY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG4vLyBAZmxvd1xuXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5pbXBvcnQgdHlwZSB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgdHlwZSB7IEluZm8gfSBmcm9tIFwiLi90eXBlc1wiXG5pbXBvcnQgeyBwYXJzZUNvZGUgfSBmcm9tIFwiLi9jb3JlXCJcbmltcG9ydCBtYWtlRGVidWcgZnJvbSBcImRlYnVnXCJcblxuY29uc3QgZGVidWcgPSBtYWtlRGVidWcoXCJqcy1oeXBlcmNsaWNrOm1ha2UtY2FjaGVcIilcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FjaGVkUGFyc2VyKHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGUpIHtcbiAgY29uc3QgZWRpdG9ycyA9IG5ldyBXZWFrTWFwKClcbiAgY29uc3QgZGF0YTogV2Vha01hcDxUZXh0RWRpdG9yLCBJbmZvPiA9IG5ldyBXZWFrTWFwKClcbiAgY29uc3QgY29uZmlnQ2FjaGU6IFdlYWtNYXA8VGV4dEVkaXRvciwgP09iamVjdD4gPSBuZXcgV2Vha01hcCgpXG5cbiAgZnVuY3Rpb24gbG9hZEJhYmVsQ29uZmlnKGVkaXRvcikge1xuICAgIGlmICghY29uZmlnQ2FjaGUuaGFzKGVkaXRvcikpIHtcbiAgICAgIGNvbnN0IGJhYmVsID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG4gICAgICBjb25zdCB0cmFuc2Zvcm1PcHRpb25zID0ge1xuICAgICAgICBiYWJlbHJjOiB0cnVlLFxuICAgICAgICByb290OiBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSksXG4gICAgICAgIHJvb3RNb2RlOiBcInVwd2FyZC1vcHRpb25hbFwiLFxuICAgICAgICBmaWxlbmFtZTogZWRpdG9yLmdldFBhdGgoKSxcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFydGlhbENvbmZpZyA9IGJhYmVsLmxvYWRQYXJ0aWFsQ29uZmlnKHRyYW5zZm9ybU9wdGlvbnMpXG5cbiAgICAgICAgZGVidWcoXCJQYXJ0aWFsIENvbmZpZ1wiLCBwYXJ0aWFsQ29uZmlnKVxuXG4gICAgICAgIGlmIChwYXJ0aWFsQ29uZmlnLmNvbmZpZyA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZmlnQ2FjaGUuc2V0KGVkaXRvciwgdW5kZWZpbmVkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbmZpZ0NhY2hlLnNldChlZGl0b3IsIHBhcnRpYWxDb25maWcub3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWJ1ZyhcIkVycm9yIGxvYWRpbmcgY29uZmlnXCIpXG4gICAgICAgIGRlYnVnKGUpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25maWdDYWNoZS5nZXQoZWRpdG9yKVxuICB9XG5cbiAgZnVuY3Rpb24gd2F0Y2hFZGl0b3IoZWRpdG9yKSB7XG4gICAgaWYgKCFlZGl0b3JzLmhhcyhlZGl0b3IpKSB7XG4gICAgICBlZGl0b3JzLnNldChlZGl0b3IsIG51bGwpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IHtcbiAgICAgICAgICBkYXRhLmRlbGV0ZShlZGl0b3IpXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0KGVkaXRvcjogVGV4dEVkaXRvcik6IEluZm8ge1xuICAgICAgd2F0Y2hFZGl0b3IoZWRpdG9yKVxuICAgICAgaWYgKCFkYXRhLmhhcyhlZGl0b3IpKSB7XG4gICAgICAgIGRhdGEuc2V0KGVkaXRvciwgcGFyc2VDb2RlKGVkaXRvci5nZXRUZXh0KCksIGxvYWRCYWJlbENvbmZpZyhlZGl0b3IpKSlcbiAgICAgIH1cblxuICAgICAgLy8gJEZsb3dFeHBlY3RFcnJvciAtIEZsb3cgdGhpbmtzIGl0IG1pZ2h0IHJldHVybiBudWxsIGhlcmVcbiAgICAgIHJldHVybiBkYXRhLmdldChlZGl0b3IpXG4gICAgfSxcbiAgfVxufVxuIl19