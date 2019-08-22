Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = resolveModule;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _resolve = require("resolve");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:resolve-module");

// Default comes from Node's `require.extensions`
var defaultExtensions = [".js", ".json", ".node"];

function findPackageJson(_x) {
  var _again = true;

  _function: while (_again) {
    var basedir = _x;
    _again = false;

    var packagePath = _path2["default"].resolve(basedir, "package.json");
    try {
      _fs2["default"].accessSync(packagePath);
    } catch (e) {
      var _parent = _path2["default"].resolve(basedir, "../");
      if (_parent != basedir) {
        _x = _parent;
        _again = true;
        packagePath = _parent = undefined;
        continue _function;
      }
      return undefined;
    }
    return packagePath;
  }
}

function loadModuleRoots(basedir) {
  var packagePath = findPackageJson(basedir);
  if (!packagePath) {
    return;
  }
  var config = JSON.parse(String(_fs2["default"].readFileSync(packagePath)));

  if (config && config.moduleRoots) {
    var _ret = (function () {
      var roots = config.moduleRoots;
      if (typeof roots === "string") {
        roots = [roots];
      }

      var packageDir = _path2["default"].dirname(packagePath);
      return {
        v: roots.map(function (r) {
          return _path2["default"].resolve(packageDir, r);
        })
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  }
}

function resolveWithCustomRoots(basedir, absoluteModule, options) {
  var _options$extensions = options.extensions;
  var extensions = _options$extensions === undefined ? defaultExtensions : _options$extensions;
  var requireIfTrusted = options.requireIfTrusted;

  var moduleName = "./" + absoluteModule;

  var roots = loadModuleRoots(basedir);

  if (roots) {
    var resolveOptions = { basedir: basedir, extensions: extensions };
    for (var i = 0; i < roots.length; i++) {
      var stats = undefined;
      try {
        stats = _fs2["default"].statSync(roots[i]);
      } catch (e) {
        // Ignore invalid moduleRoots instead of throwing an error.
        continue;
      }

      if (stats.isFile()) {
        var resolver = roots[i];
        try {
          // $FlowExpectError
          var customResolver = requireIfTrusted(resolver);
          var filename = customResolver({
            basedir: basedir,
            moduleName: absoluteModule
          });
          debug("filename", filename);
          // it's ok for a custom resolver to jut pass on a module
          if (filename == null) {
            continue;
          } else if (typeof filename === "string") {
            if (filename.match(/^http/)) {
              return { type: "url", url: filename };
            }

            resolveOptions.basedir = basedir;
            return {
              type: "file",
              filename: (0, _resolve.sync)(filename, resolveOptions)
            };
          }
          throw new Error("Custom resolvers must return a string or null/undefined.\nRecieved: " + filename);
        } catch (e) {
          e.message = "Error in custom resolver: " + resolver + "\n\n" + e.message;
          throw e;
        }
      }
      resolveOptions.basedir = roots[i];

      try {
        var filename = (0, _resolve.sync)(moduleName, resolveOptions);
        return { type: "file", filename: filename };
      } catch (e) {
        /* do nothing */
      }
    }
  }
  return { type: "file", filename: undefined };
}

function resolveModule(filePath, suggestion, options) {
  var _options$extensions2 = options.extensions;
  var extensions = _options$extensions2 === undefined ? defaultExtensions : _options$extensions2;
  var moduleName = suggestion.moduleName;

  var basedir = _path2["default"].dirname(filePath);
  var resolveOptions = { basedir: basedir, extensions: extensions };

  var filename = undefined;

  try {
    filename = (0, _resolve.sync)(moduleName, resolveOptions);
    if (filename == moduleName) {
      return {
        type: "url",
        url: "http://nodejs.org/api/" + moduleName + ".html"
      };
    }
  } catch (e) {
    if (moduleName === "atom") {
      return {
        type: "url",
        url: "https://atom.io/docs/api/latest/"
      };
    }
  }

  // Allow linking to relative files that don't exist yet.
  if (!filename && moduleName[0] === ".") {
    if (_path2["default"].extname(moduleName) == "") {
      moduleName += ".js";
    }

    filename = _path2["default"].join(basedir, moduleName);
    debug("opening new file", filename);
  } else if (!filename) {
    var customResolution = resolveWithCustomRoots(basedir, moduleName, options);
    debug("Custom Resolution", customResolution);
    return customResolution;
  } else {
    debug("resolved", filename);
  }

  return { type: "file", filename: filename };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9yZXNvbHZlLW1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBOEd3QixhQUFhOzs7O29CQTVHcEIsTUFBTTs7OztrQkFDUixJQUFJOzs7O3VCQUNhLFNBQVM7O3FCQUVuQixPQUFPOzs7O0FBTjdCLFdBQVcsQ0FBQTs7QUFPWCxJQUFNLEtBQUssR0FBRyx3QkFBVSw4QkFBOEIsQ0FBQyxDQUFBOzs7QUFHdkQsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBTW5ELFNBQVMsZUFBZTs7OzRCQUFVO1FBQVQsT0FBTzs7O0FBQzlCLFFBQU0sV0FBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDekQsUUFBSTtBQUNGLHNCQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUMzQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsVUFBTSxPQUFNLEdBQUcsa0JBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUMzQyxVQUFJLE9BQU0sSUFBSSxPQUFPLEVBQUU7YUFDRSxPQUFNOztBQU4zQixtQkFBVyxHQUlULE9BQU07O09BR1g7QUFDRCxhQUFPLFNBQVMsQ0FBQTtLQUNqQjtBQUNELFdBQU8sV0FBVyxDQUFBO0dBQ25CO0NBQUE7O0FBRUQsU0FBUyxlQUFlLENBQUMsT0FBTyxFQUFFO0FBQ2hDLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1QyxNQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2hCLFdBQU07R0FDUDtBQUNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRS9ELE1BQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7O0FBQ2hDLFVBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7QUFDOUIsVUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDN0IsYUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDaEI7O0FBRUQsVUFBTSxVQUFVLEdBQUcsa0JBQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzVDO1dBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7aUJBQUksa0JBQUssT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FBQSxDQUFDO1FBQUE7Ozs7R0FDbkQ7Q0FDRjs7QUFFRCxTQUFTLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFZOzRCQUNiLE9BQU8sQ0FBNUQsVUFBVTtNQUFWLFVBQVUsdUNBQUcsaUJBQWlCO01BQUUsZ0JBQWdCLEdBQUssT0FBTyxDQUE1QixnQkFBZ0I7O0FBQ3hELE1BQU0sVUFBVSxVQUFRLGNBQWMsQUFBRSxDQUFBOztBQUV4QyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXRDLE1BQUksS0FBSyxFQUFFO0FBQ1QsUUFBTSxjQUFjLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQTtBQUM5QyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxVQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsVUFBSTtBQUNGLGFBQUssR0FBRyxnQkFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDOUIsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixpQkFBUTtPQUNUOztBQUVELFVBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQ2xCLFlBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QixZQUFJOztBQUVGLGNBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2pELGNBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUM5QixtQkFBTyxFQUFQLE9BQU87QUFDUCxzQkFBVSxFQUFFLGNBQWM7V0FDM0IsQ0FBQyxDQUFBO0FBQ0YsZUFBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFM0IsY0FBSSxRQUFRLElBQUksSUFBSSxFQUFFO0FBQ3BCLHFCQUFRO1dBQ1QsTUFBTSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUN2QyxnQkFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzNCLHFCQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLENBQUE7YUFDdEM7O0FBRUQsMEJBQWMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ2hDLG1CQUFPO0FBQ0wsa0JBQUksRUFBRSxNQUFNO0FBQ1osc0JBQVEsRUFBRSxtQkFBUSxRQUFRLEVBQUUsY0FBYyxDQUFDO2FBQzVDLENBQUE7V0FDRjtBQUNELGdCQUFNLElBQUksS0FBSywwRUFDMEQsUUFBUSxDQUNoRixDQUFBO1NBQ0YsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQUMsQ0FBQyxPQUFPLGtDQUFnQyxRQUFRLFlBQU8sQ0FBQyxDQUFDLE9BQU8sQUFBRSxDQUFBO0FBQ25FLGdCQUFNLENBQUMsQ0FBQTtTQUNSO09BQ0Y7QUFDRCxvQkFBYyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRWpDLFVBQUk7QUFDRixZQUFNLFFBQVEsR0FBRyxtQkFBUSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDcEQsZUFBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFBO09BQ2xDLENBQUMsT0FBTyxDQUFDLEVBQUU7O09BRVg7S0FDRjtHQUNGO0FBQ0QsU0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFBO0NBQzdDOztBQUVjLFNBQVMsYUFBYSxDQUNuQyxRQUFnQixFQUNoQixVQUFrQyxFQUNsQyxPQUF1QixFQUNiOzZCQUNpQyxPQUFPLENBQTFDLFVBQVU7TUFBVixVQUFVLHdDQUFHLGlCQUFpQjtNQUNoQyxVQUFVLEdBQUssVUFBVSxDQUF6QixVQUFVOztBQUVoQixNQUFNLE9BQU8sR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQTs7QUFFOUMsTUFBSSxRQUFRLFlBQUEsQ0FBQTs7QUFFWixNQUFJO0FBQ0YsWUFBUSxHQUFHLG1CQUFRLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUM5QyxRQUFJLFFBQVEsSUFBSSxVQUFVLEVBQUU7QUFDMUIsYUFBTztBQUNMLFlBQUksRUFBRSxLQUFLO0FBQ1gsV0FBRyw2QkFBMkIsVUFBVSxVQUFPO09BQ2hELENBQUE7S0FDRjtHQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixRQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDekIsYUFBTztBQUNMLFlBQUksRUFBRSxLQUFLO0FBQ1gsV0FBRyxvQ0FBb0M7T0FDeEMsQ0FBQTtLQUNGO0dBQ0Y7OztBQUdELE1BQUksQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUN0QyxRQUFJLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDbEMsZ0JBQVUsSUFBSSxLQUFLLENBQUE7S0FDcEI7O0FBRUQsWUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDekMsU0FBSyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0dBQ3BDLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNwQixRQUFNLGdCQUFnQixHQUFHLHNCQUFzQixDQUM3QyxPQUFPLEVBQ1AsVUFBVSxFQUNWLE9BQU8sQ0FDUixDQUFBO0FBQ0QsU0FBSyxDQUFDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUE7QUFDNUMsV0FBTyxnQkFBZ0IsQ0FBQTtHQUN4QixNQUFNO0FBQ0wsU0FBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTtHQUM1Qjs7QUFFRCxTQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUE7Q0FDbEMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9qcy1oeXBlcmNsaWNrL2xpYi9jb3JlL3Jlc29sdmUtbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLy8gQGZsb3dcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IHsgc3luYyBhcyByZXNvbHZlIH0gZnJvbSBcInJlc29sdmVcIlxuaW1wb3J0IHR5cGUgeyBSZXNvbHZlZCB9IGZyb20gXCIuLi90eXBlc1wiXG5pbXBvcnQgbWFrZURlYnVnIGZyb20gXCJkZWJ1Z1wiXG5jb25zdCBkZWJ1ZyA9IG1ha2VEZWJ1ZyhcImpzLWh5cGVyY2xpY2s6cmVzb2x2ZS1tb2R1bGVcIilcblxuLy8gRGVmYXVsdCBjb21lcyBmcm9tIE5vZGUncyBgcmVxdWlyZS5leHRlbnNpb25zYFxuY29uc3QgZGVmYXVsdEV4dGVuc2lvbnMgPSBbXCIuanNcIiwgXCIuanNvblwiLCBcIi5ub2RlXCJdXG50eXBlIFJlc29sdmVPcHRpb25zID0ge1xuICBleHRlbnNpb25zPzogdHlwZW9mIGRlZmF1bHRFeHRlbnNpb25zLFxuICByZXF1aXJlSWZUcnVzdGVkOiAobW9kdWxlTmFtZTogc3RyaW5nKSA9PiBhbnksXG59XG5cbmZ1bmN0aW9uIGZpbmRQYWNrYWdlSnNvbihiYXNlZGlyKSB7XG4gIGNvbnN0IHBhY2thZ2VQYXRoID0gcGF0aC5yZXNvbHZlKGJhc2VkaXIsIFwicGFja2FnZS5qc29uXCIpXG4gIHRyeSB7XG4gICAgZnMuYWNjZXNzU3luYyhwYWNrYWdlUGF0aClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHBhdGgucmVzb2x2ZShiYXNlZGlyLCBcIi4uL1wiKVxuICAgIGlmIChwYXJlbnQgIT0gYmFzZWRpcikge1xuICAgICAgcmV0dXJuIGZpbmRQYWNrYWdlSnNvbihwYXJlbnQpXG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICByZXR1cm4gcGFja2FnZVBhdGhcbn1cblxuZnVuY3Rpb24gbG9hZE1vZHVsZVJvb3RzKGJhc2VkaXIpIHtcbiAgY29uc3QgcGFja2FnZVBhdGggPSBmaW5kUGFja2FnZUpzb24oYmFzZWRpcilcbiAgaWYgKCFwYWNrYWdlUGF0aCkge1xuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoU3RyaW5nKGZzLnJlYWRGaWxlU3luYyhwYWNrYWdlUGF0aCkpKVxuXG4gIGlmIChjb25maWcgJiYgY29uZmlnLm1vZHVsZVJvb3RzKSB7XG4gICAgbGV0IHJvb3RzID0gY29uZmlnLm1vZHVsZVJvb3RzXG4gICAgaWYgKHR5cGVvZiByb290cyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcm9vdHMgPSBbcm9vdHNdXG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZURpciA9IHBhdGguZGlybmFtZShwYWNrYWdlUGF0aClcbiAgICByZXR1cm4gcm9vdHMubWFwKHIgPT4gcGF0aC5yZXNvbHZlKHBhY2thZ2VEaXIsIHIpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVXaXRoQ3VzdG9tUm9vdHMoYmFzZWRpciwgYWJzb2x1dGVNb2R1bGUsIG9wdGlvbnMpOiBSZXNvbHZlZCB7XG4gIGNvbnN0IHsgZXh0ZW5zaW9ucyA9IGRlZmF1bHRFeHRlbnNpb25zLCByZXF1aXJlSWZUcnVzdGVkIH0gPSBvcHRpb25zXG4gIGNvbnN0IG1vZHVsZU5hbWUgPSBgLi8ke2Fic29sdXRlTW9kdWxlfWBcblxuICBjb25zdCByb290cyA9IGxvYWRNb2R1bGVSb290cyhiYXNlZGlyKVxuXG4gIGlmIChyb290cykge1xuICAgIGNvbnN0IHJlc29sdmVPcHRpb25zID0geyBiYXNlZGlyLCBleHRlbnNpb25zIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc3RhdHNcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXRzID0gZnMuc3RhdFN5bmMocm9vdHNbaV0pXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIElnbm9yZSBpbnZhbGlkIG1vZHVsZVJvb3RzIGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgICBjb25zdCByZXNvbHZlciA9IHJvb3RzW2ldXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gJEZsb3dFeHBlY3RFcnJvclxuICAgICAgICAgIGNvbnN0IGN1c3RvbVJlc29sdmVyID0gcmVxdWlyZUlmVHJ1c3RlZChyZXNvbHZlcilcbiAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGN1c3RvbVJlc29sdmVyKHtcbiAgICAgICAgICAgIGJhc2VkaXIsXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiBhYnNvbHV0ZU1vZHVsZSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGRlYnVnKFwiZmlsZW5hbWVcIiwgZmlsZW5hbWUpXG4gICAgICAgICAgLy8gaXQncyBvayBmb3IgYSBjdXN0b20gcmVzb2x2ZXIgdG8ganV0IHBhc3Mgb24gYSBtb2R1bGVcbiAgICAgICAgICBpZiAoZmlsZW5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWxlbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lLm1hdGNoKC9eaHR0cC8pKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IFwidXJsXCIsIHVybDogZmlsZW5hbWUgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlT3B0aW9ucy5iYXNlZGlyID0gYmFzZWRpclxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJmaWxlXCIsXG4gICAgICAgICAgICAgIGZpbGVuYW1lOiByZXNvbHZlKGZpbGVuYW1lLCByZXNvbHZlT3B0aW9ucyksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBDdXN0b20gcmVzb2x2ZXJzIG11c3QgcmV0dXJuIGEgc3RyaW5nIG9yIG51bGwvdW5kZWZpbmVkLlxcblJlY2lldmVkOiAke2ZpbGVuYW1lfWAsXG4gICAgICAgICAgKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZS5tZXNzYWdlID0gYEVycm9yIGluIGN1c3RvbSByZXNvbHZlcjogJHtyZXNvbHZlcn1cXG5cXG4ke2UubWVzc2FnZX1gXG4gICAgICAgICAgdGhyb3cgZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXNvbHZlT3B0aW9ucy5iYXNlZGlyID0gcm9vdHNbaV1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSByZXNvbHZlKG1vZHVsZU5hbWUsIHJlc29sdmVPcHRpb25zKVxuICAgICAgICByZXR1cm4geyB0eXBlOiBcImZpbGVcIiwgZmlsZW5hbWUgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IHR5cGU6IFwiZmlsZVwiLCBmaWxlbmFtZTogdW5kZWZpbmVkIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZU1vZHVsZShcbiAgZmlsZVBhdGg6IHN0cmluZyxcbiAgc3VnZ2VzdGlvbjogeyBtb2R1bGVOYW1lOiBzdHJpbmcgfSxcbiAgb3B0aW9uczogUmVzb2x2ZU9wdGlvbnMsXG4pOiBSZXNvbHZlZCB7XG4gIGNvbnN0IHsgZXh0ZW5zaW9ucyA9IGRlZmF1bHRFeHRlbnNpb25zIH0gPSBvcHRpb25zXG4gIGxldCB7IG1vZHVsZU5hbWUgfSA9IHN1Z2dlc3Rpb25cblxuICBjb25zdCBiYXNlZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBjb25zdCByZXNvbHZlT3B0aW9ucyA9IHsgYmFzZWRpciwgZXh0ZW5zaW9ucyB9XG5cbiAgbGV0IGZpbGVuYW1lXG5cbiAgdHJ5IHtcbiAgICBmaWxlbmFtZSA9IHJlc29sdmUobW9kdWxlTmFtZSwgcmVzb2x2ZU9wdGlvbnMpXG4gICAgaWYgKGZpbGVuYW1lID09IG1vZHVsZU5hbWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwidXJsXCIsXG4gICAgICAgIHVybDogYGh0dHA6Ly9ub2RlanMub3JnL2FwaS8ke21vZHVsZU5hbWV9Lmh0bWxgLFxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChtb2R1bGVOYW1lID09PSBcImF0b21cIikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJ1cmxcIixcbiAgICAgICAgdXJsOiBgaHR0cHM6Ly9hdG9tLmlvL2RvY3MvYXBpL2xhdGVzdC9gLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEFsbG93IGxpbmtpbmcgdG8gcmVsYXRpdmUgZmlsZXMgdGhhdCBkb24ndCBleGlzdCB5ZXQuXG4gIGlmICghZmlsZW5hbWUgJiYgbW9kdWxlTmFtZVswXSA9PT0gXCIuXCIpIHtcbiAgICBpZiAocGF0aC5leHRuYW1lKG1vZHVsZU5hbWUpID09IFwiXCIpIHtcbiAgICAgIG1vZHVsZU5hbWUgKz0gXCIuanNcIlxuICAgIH1cblxuICAgIGZpbGVuYW1lID0gcGF0aC5qb2luKGJhc2VkaXIsIG1vZHVsZU5hbWUpXG4gICAgZGVidWcoXCJvcGVuaW5nIG5ldyBmaWxlXCIsIGZpbGVuYW1lKVxuICB9IGVsc2UgaWYgKCFmaWxlbmFtZSkge1xuICAgIGNvbnN0IGN1c3RvbVJlc29sdXRpb24gPSByZXNvbHZlV2l0aEN1c3RvbVJvb3RzKFxuICAgICAgYmFzZWRpcixcbiAgICAgIG1vZHVsZU5hbWUsXG4gICAgICBvcHRpb25zLFxuICAgIClcbiAgICBkZWJ1ZyhcIkN1c3RvbSBSZXNvbHV0aW9uXCIsIGN1c3RvbVJlc29sdXRpb24pXG4gICAgcmV0dXJuIGN1c3RvbVJlc29sdXRpb25cbiAgfSBlbHNlIHtcbiAgICBkZWJ1ZyhcInJlc29sdmVkXCIsIGZpbGVuYW1lKVxuICB9XG5cbiAgcmV0dXJuIHsgdHlwZTogXCJmaWxlXCIsIGZpbGVuYW1lIH1cbn1cbiJdfQ==