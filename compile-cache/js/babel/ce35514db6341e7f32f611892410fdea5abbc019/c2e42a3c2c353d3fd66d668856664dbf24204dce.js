Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = cachedParser;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _core = require("./core");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _requireIfTrusted = require("./require-if-trusted");

var _requireIfTrusted2 = _interopRequireDefault(_requireIfTrusted);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:make-cache");

function findFile(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var basedir = _x,
        filenames = _x2;
    _again = false;

    for (var i = 0; i < filenames.length; i++) {
      try {
        var absolutePath = _path2["default"].resolve(basedir, filenames[i]);
        _fs2["default"].accessSync(absolutePath);
        return absolutePath;
      } catch (e) {
        // Skip this file, it probably doesn't exist
      }
    }

    var parent = _path2["default"].resolve(basedir, "../");
    if (parent != basedir) {
      _x = parent;
      _x2 = filenames;
      _again = true;
      i = parent = undefined;
      continue _function;
    }
    return undefined;
  }
}

function cachedParser(subscriptions) {
  var editors = new WeakMap();
  var data = new WeakMap();
  var configCache = new WeakMap();

  function findConfigFile(editor) {
    var basedir = _path2["default"].dirname(editor.getPath());
    // "New in Babel 7.x, Babel has as concept of a "root" directory, which
    // defaults to the current working directory"
    // https://babeljs.io/docs/en/config-files#project-wide-configuration
    //
    // The current working directory doesn't work well for `js-hyperclick`
    // because you might launch Atom from anywhere and you can add multiple
    // projects at once.
    var configPath = findFile(basedir, ["babel.config.js"]);
    if (configPath == null) {
      configPath = findFile(basedir, [".babelrc", ".babelrc.js"]);
    }

    if (configPath != null) {
      var _basedir = _path2["default"].dirname(configPath);
      var packagePath = findFile(_basedir, ["package.json"]);
      if (packagePath != null) {
        var packageJson = undefined;
        try {
          packageJson = JSON.parse(String(_fs2["default"].readFileSync(packagePath)));
        } catch (e) {
          // do nothing
        }
        if (packageJson != null) {
          var dependencies = _extends({}, packageJson.dependencies, packageJson.devDependencies);
          var babelVersion = dependencies["babel-core"] || dependencies["@babel/core"];
          if (babelVersion) {
            // Strep anything that's not a digit, I only need the firt number
            var major = babelVersion.replace(/\D/, "");
            if (major[0] === "6") {
              debug("Skipping Babel 6 config");
              // Do not accept a config from a Babel6 project
              configPath = null;
            }
          }
        }
      }
    }

    return configPath;
  }

  function loadBabelConfig(editor) {
    if (!configCache.has(editor)) {
      var babelConfig = undefined;
      var configPath = findConfigFile(editor);
      if (configPath != null) {
        debug("loadBabelConfig", configPath);
        try {
          if (_path2["default"].extname(configPath) === ".js") {
            var _ret = (function () {
              var dontCache = {};

              var requireIfTrusted = (0, _requireIfTrusted2["default"])(function (trusted) {
                if (trusted === false) {
                  return undefined;
                }
                if (trusted === true) {
                  data["delete"](editor);
                  configCache["delete"](editor);
                }

                return dontCache;
              });

              // $FlowExpectError
              var cfg = requireIfTrusted(configPath);
              debug("cfg", cfg);

              babelConfig = typeof cfg === "function" ? cfg() : cfg;
              if (babelConfig === dontCache) {
                return {
                  v: undefined
                };
              }
            })();

            if (typeof _ret === "object") return _ret.v;
          } else {
            babelConfig = JSON.parse(String(_fs2["default"].readFileSync(configPath)));
          }

          if (babelConfig) {
            // cwd can't be added to babel.config.js
            if (_path2["default"].basename(configPath) !== "babel.config.js") {
              babelConfig.cwd = babelConfig.cwd || _path2["default"].dirname(configPath);
            }
            var babel = require("@babel/core");
            babelConfig = babel.loadOptions(babelConfig);
          }
        } catch (e) {
          debug("loadBabelConfig error", e);
        }
        debug("babel config", babelConfig);
      }
      configCache.set(editor, babelConfig);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvbWFrZS1jYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBK0J3QixZQUFZOzs7O29CQTVCbkIsTUFBTTs7OztrQkFDUixJQUFJOzs7O29CQUdPLFFBQVE7O3FCQUNaLE9BQU87Ozs7Z0NBQ0wsc0JBQXNCOzs7O0FBVDlDLFdBQVcsQ0FBQTs7QUFXWCxJQUFNLEtBQUssR0FBRyx3QkFBVSwwQkFBMEIsQ0FBQyxDQUFBOztBQUVuRCxTQUFTLFFBQVE7Ozs0QkFBcUI7UUFBcEIsT0FBTztRQUFFLFNBQVM7OztBQUNsQyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxVQUFJO0FBQ0YsWUFBTSxZQUFZLEdBQUcsa0JBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RCx3QkFBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDM0IsZUFBTyxZQUFZLENBQUE7T0FDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRTs7T0FFWDtLQUNGOztBQUVELFFBQU0sTUFBTSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDM0MsUUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO1dBQ0wsTUFBTTtZQUFFLFNBQVM7O0FBWjFCLE9BQUMsR0FVSixNQUFNOztLQUdYO0FBQ0QsV0FBTyxTQUFTLENBQUE7R0FDakI7Q0FBQTs7QUFFYyxTQUFTLFlBQVksQ0FBQyxhQUFrQyxFQUFFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUE7QUFDN0IsTUFBTSxJQUErQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUE7QUFDckQsTUFBTSxXQUF5QyxHQUFHLElBQUksT0FBTyxF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RjtHQUNGOztBQUVELFNBQU87QUFDTCxPQUFHLEVBQUEsYUFBQyxNQUFrQixFQUFRO0FBQzVCLGlCQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDckIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQVUsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdkU7OztBQUdELGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUN4QjtHQUNGLENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL21ha2UtY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG4vLyBAZmxvd1xuXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5pbXBvcnQgZnMgZnJvbSBcImZzXCJcbmltcG9ydCB0eXBlIHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB0eXBlIHsgSW5mbyB9IGZyb20gXCIuL3R5cGVzXCJcbmltcG9ydCB7IHBhcnNlQ29kZSB9IGZyb20gXCIuL2NvcmVcIlxuaW1wb3J0IG1ha2VEZWJ1ZyBmcm9tIFwiZGVidWdcIlxuaW1wb3J0IG1ha2VSZXF1aXJlIGZyb20gXCIuL3JlcXVpcmUtaWYtdHJ1c3RlZFwiXG5cbmNvbnN0IGRlYnVnID0gbWFrZURlYnVnKFwianMtaHlwZXJjbGljazptYWtlLWNhY2hlXCIpXG5cbmZ1bmN0aW9uIGZpbmRGaWxlKGJhc2VkaXIsIGZpbGVuYW1lcykge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoYmFzZWRpciwgZmlsZW5hbWVzW2ldKVxuICAgICAgZnMuYWNjZXNzU3luYyhhYnNvbHV0ZVBhdGgpXG4gICAgICByZXR1cm4gYWJzb2x1dGVQYXRoXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gU2tpcCB0aGlzIGZpbGUsIGl0IHByb2JhYmx5IGRvZXNuJ3QgZXhpc3RcbiAgICB9XG4gIH1cblxuICBjb25zdCBwYXJlbnQgPSBwYXRoLnJlc29sdmUoYmFzZWRpciwgXCIuLi9cIilcbiAgaWYgKHBhcmVudCAhPSBiYXNlZGlyKSB7XG4gICAgcmV0dXJuIGZpbmRGaWxlKHBhcmVudCwgZmlsZW5hbWVzKVxuICB9XG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FjaGVkUGFyc2VyKHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGUpIHtcbiAgY29uc3QgZWRpdG9ycyA9IG5ldyBXZWFrTWFwKClcbiAgY29uc3QgZGF0YTogV2Vha01hcDxUZXh0RWRpdG9yLCBJbmZvPiA9IG5ldyBXZWFrTWFwKClcbiAgY29uc3QgY29uZmlnQ2FjaGU6IFdlYWtNYXA8VGV4dEVkaXRvciwgP09iamVjdD4gPSBuZXcgV2Vha01hcCgpXG5cbiAgZnVuY3Rpb24gZmluZENvbmZpZ0ZpbGUoZWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgY29uc3QgYmFzZWRpciA9IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIC8vIFwiTmV3IGluIEJhYmVsIDcueCwgQmFiZWwgaGFzIGFzIGNvbmNlcHQgb2YgYSBcInJvb3RcIiBkaXJlY3RvcnksIHdoaWNoXG4gICAgLy8gZGVmYXVsdHMgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnlcIlxuICAgIC8vIGh0dHBzOi8vYmFiZWxqcy5pby9kb2NzL2VuL2NvbmZpZy1maWxlcyNwcm9qZWN0LXdpZGUtY29uZmlndXJhdGlvblxuICAgIC8vXG4gICAgLy8gVGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkgZG9lc24ndCB3b3JrIHdlbGwgZm9yIGBqcy1oeXBlcmNsaWNrYFxuICAgIC8vIGJlY2F1c2UgeW91IG1pZ2h0IGxhdW5jaCBBdG9tIGZyb20gYW55d2hlcmUgYW5kIHlvdSBjYW4gYWRkIG11bHRpcGxlXG4gICAgLy8gcHJvamVjdHMgYXQgb25jZS5cbiAgICBsZXQgY29uZmlnUGF0aCA9IGZpbmRGaWxlKGJhc2VkaXIsIFtcImJhYmVsLmNvbmZpZy5qc1wiXSlcbiAgICBpZiAoY29uZmlnUGF0aCA9PSBudWxsKSB7XG4gICAgICBjb25maWdQYXRoID0gZmluZEZpbGUoYmFzZWRpciwgW1wiLmJhYmVscmNcIiwgXCIuYmFiZWxyYy5qc1wiXSlcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnUGF0aCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBiYXNlZGlyID0gcGF0aC5kaXJuYW1lKGNvbmZpZ1BhdGgpXG4gICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IGZpbmRGaWxlKGJhc2VkaXIsIFtcInBhY2thZ2UuanNvblwiXSlcbiAgICAgIGlmIChwYWNrYWdlUGF0aCAhPSBudWxsKSB7XG4gICAgICAgIGxldCBwYWNrYWdlSnNvblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShTdHJpbmcoZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VQYXRoKSkpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhY2thZ2VKc29uICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSB7XG4gICAgICAgICAgICAuLi5wYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMsXG4gICAgICAgICAgICAuLi5wYWNrYWdlSnNvbi5kZXZEZXBlbmRlbmNpZXMsXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGJhYmVsVmVyc2lvbiA9XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXNbXCJiYWJlbC1jb3JlXCJdIHx8IGRlcGVuZGVuY2llc1tcIkBiYWJlbC9jb3JlXCJdXG4gICAgICAgICAgaWYgKGJhYmVsVmVyc2lvbikge1xuICAgICAgICAgICAgLy8gU3RyZXAgYW55dGhpbmcgdGhhdCdzIG5vdCBhIGRpZ2l0LCBJIG9ubHkgbmVlZCB0aGUgZmlydCBudW1iZXJcbiAgICAgICAgICAgIGNvbnN0IG1ham9yID0gYmFiZWxWZXJzaW9uLnJlcGxhY2UoL1xcRC8sIFwiXCIpXG4gICAgICAgICAgICBpZiAobWFqb3JbMF0gPT09IFwiNlwiKSB7XG4gICAgICAgICAgICAgIGRlYnVnKFwiU2tpcHBpbmcgQmFiZWwgNiBjb25maWdcIilcbiAgICAgICAgICAgICAgLy8gRG8gbm90IGFjY2VwdCBhIGNvbmZpZyBmcm9tIGEgQmFiZWw2IHByb2plY3RcbiAgICAgICAgICAgICAgY29uZmlnUGF0aCA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnUGF0aFxuICB9XG5cbiAgZnVuY3Rpb24gbG9hZEJhYmVsQ29uZmlnKGVkaXRvcikge1xuICAgIGlmICghY29uZmlnQ2FjaGUuaGFzKGVkaXRvcikpIHtcbiAgICAgIGxldCBiYWJlbENvbmZpZzogP09iamVjdCA9IHVuZGVmaW5lZFxuICAgICAgY29uc3QgY29uZmlnUGF0aCA9IGZpbmRDb25maWdGaWxlKGVkaXRvcilcbiAgICAgIGlmIChjb25maWdQYXRoICE9IG51bGwpIHtcbiAgICAgICAgZGVidWcoXCJsb2FkQmFiZWxDb25maWdcIiwgY29uZmlnUGF0aClcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGNvbmZpZ1BhdGgpID09PSBcIi5qc1wiKSB7XG4gICAgICAgICAgICBjb25zdCBkb250Q2FjaGUgPSB7fVxuXG4gICAgICAgICAgICBjb25zdCByZXF1aXJlSWZUcnVzdGVkID0gbWFrZVJlcXVpcmUodHJ1c3RlZCA9PiB7XG4gICAgICAgICAgICAgIGlmICh0cnVzdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodHJ1c3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVsZXRlKGVkaXRvcilcbiAgICAgICAgICAgICAgICBjb25maWdDYWNoZS5kZWxldGUoZWRpdG9yKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGRvbnRDYWNoZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gJEZsb3dFeHBlY3RFcnJvclxuICAgICAgICAgICAgY29uc3QgY2ZnID0gcmVxdWlyZUlmVHJ1c3RlZChjb25maWdQYXRoKVxuICAgICAgICAgICAgZGVidWcoXCJjZmdcIiwgY2ZnKVxuXG4gICAgICAgICAgICBiYWJlbENvbmZpZyA9IHR5cGVvZiBjZmcgPT09IFwiZnVuY3Rpb25cIiA/IGNmZygpIDogY2ZnXG4gICAgICAgICAgICBpZiAoYmFiZWxDb25maWcgPT09IGRvbnRDYWNoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJhYmVsQ29uZmlnID0gSlNPTi5wYXJzZShTdHJpbmcoZnMucmVhZEZpbGVTeW5jKGNvbmZpZ1BhdGgpKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmFiZWxDb25maWcpIHtcbiAgICAgICAgICAgIC8vIGN3ZCBjYW4ndCBiZSBhZGRlZCB0byBiYWJlbC5jb25maWcuanNcbiAgICAgICAgICAgIGlmIChwYXRoLmJhc2VuYW1lKGNvbmZpZ1BhdGgpICE9PSBcImJhYmVsLmNvbmZpZy5qc1wiKSB7XG4gICAgICAgICAgICAgIGJhYmVsQ29uZmlnLmN3ZCA9IGJhYmVsQ29uZmlnLmN3ZCB8fCBwYXRoLmRpcm5hbWUoY29uZmlnUGF0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJhYmVsID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG4gICAgICAgICAgICBiYWJlbENvbmZpZyA9IGJhYmVsLmxvYWRPcHRpb25zKGJhYmVsQ29uZmlnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlYnVnKFwibG9hZEJhYmVsQ29uZmlnIGVycm9yXCIsIGUpXG4gICAgICAgIH1cbiAgICAgICAgZGVidWcoXCJiYWJlbCBjb25maWdcIiwgYmFiZWxDb25maWcpXG4gICAgICB9XG4gICAgICBjb25maWdDYWNoZS5zZXQoZWRpdG9yLCBiYWJlbENvbmZpZylcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZ0NhY2hlLmdldChlZGl0b3IpXG4gIH1cblxuICBmdW5jdGlvbiB3YXRjaEVkaXRvcihlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvcnMuaGFzKGVkaXRvcikpIHtcbiAgICAgIGVkaXRvcnMuc2V0KGVkaXRvciwgbnVsbClcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgICAgIGRhdGEuZGVsZXRlKGVkaXRvcilcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQoZWRpdG9yOiBUZXh0RWRpdG9yKTogSW5mbyB7XG4gICAgICB3YXRjaEVkaXRvcihlZGl0b3IpXG4gICAgICBpZiAoIWRhdGEuaGFzKGVkaXRvcikpIHtcbiAgICAgICAgZGF0YS5zZXQoZWRpdG9yLCBwYXJzZUNvZGUoZWRpdG9yLmdldFRleHQoKSwgbG9hZEJhYmVsQ29uZmlnKGVkaXRvcikpKVxuICAgICAgfVxuXG4gICAgICAvLyAkRmxvd0V4cGVjdEVycm9yIC0gRmxvdyB0aGlua3MgaXQgbWlnaHQgcmV0dXJuIG51bGwgaGVyZVxuICAgICAgcmV0dXJuIGRhdGEuZ2V0KGVkaXRvcilcbiAgICB9LFxuICB9XG59XG4iXX0=