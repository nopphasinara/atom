Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseCode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:parse-code");

// TimeCop was reporting that it took over 600ms for js-hyperclick to start.
// Converting this `import` to a `require` reduced it to under 250ms Moving it
// to require inside `findIdentifiers` and `parseCode` moved it off the TimeCop
// list (under 5ms)

/*
import { parse, traverse, types as t } from '@babel/core'
*/

var parseErrorTag = Symbol();

var identifierReducer = function identifierReducer(tmp, node) {
  var value = node;
  if (node.value) {
    value = node.value;
  }

  var _require = require("@babel/core");

  var t = _require.types;

  var newIdentifiers = undefined;
  if (t.isIdentifier(value)) {
    newIdentifiers = [value];
  } else if (t.isObjectPattern(value)) {
    newIdentifiers = findIdentifiers(value);
  } else if (t.isArrayPattern(value)) {
    newIdentifiers = findIdentifiers(value);
  }

  /* istanbul ignore next: If this throws, it's a mistake in my code or an
    /* unsupported syntax */
  if (!newIdentifiers) {
    throw new Error("No identifiers found");
  }

  return [].concat(_toConsumableArray(tmp), _toConsumableArray(newIdentifiers));
};
function findIdentifiers(node) {
  var identifiers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var _require2 = require("@babel/core");

  var t = _require2.types;

  if (t.isObjectPattern(node)) {
    return node.properties.reduce(identifierReducer, identifiers);
  } else if (t.isArrayPattern(node)) {
    return node.elements.reduce(identifierReducer, identifiers);
  } else if (t.isIdentifier(node)) {
    return [node];
  }
  /* istanbul ignore next */
  throw new Error("Unknown node type");
}

var makeDefaultConfig = function makeDefaultConfig() {
  return {
    sourceType: "module",
    // Enable as many plugins as I can so that people don't need to configure
    // anything.
    plugins: [require("@babel/plugin-syntax-async-generators"), require("@babel/plugin-syntax-bigint"), require("@babel/plugin-syntax-class-properties"), [require("@babel/plugin-syntax-decorators"), { decoratorsBeforeExport: false }], require("@babel/plugin-syntax-do-expressions"), require("@babel/plugin-syntax-dynamic-import"), require("@babel/plugin-syntax-export-default-from"), require("@babel/plugin-syntax-export-namespace-from"), require("@babel/plugin-syntax-flow"), require("@babel/plugin-syntax-function-bind"), require("@babel/plugin-syntax-function-sent"), require("@babel/plugin-syntax-import-meta"), require("@babel/plugin-syntax-json-strings"), require("@babel/plugin-syntax-jsx"), require("@babel/plugin-syntax-logical-assignment-operators"), require("@babel/plugin-syntax-nullish-coalescing-operator"), require("@babel/plugin-syntax-numeric-separator"), require("@babel/plugin-syntax-object-rest-spread"), require("@babel/plugin-syntax-optional-catch-binding"), require("@babel/plugin-syntax-optional-chaining"), [require("@babel/plugin-syntax-pipeline-operator"), { proposal: "minimal" }], require("@babel/plugin-syntax-throw-expressions")]
  };
};

// Even though Babel can parse typescript, I can't have it and flow
// enabled at the same time.
// "@babel/plugin-syntax-typescript",

function parseCode(code, babelConfig) {
  var _require3 = require("@babel/core");

  var traverse = _require3.traverse;
  var t = _require3.types;

  var _require4 = require("@babel/core");

  var parseSync = _require4.parseSync;

  var ast = undefined;

  try {
    ast = parseSync(code, babelConfig || makeDefaultConfig());
  } catch (parseError) {
    debug("parseError", parseError);
    /* istanbul ignore next */
    return { type: "parse-error", parseError: parseError };
  }

  // console.log(JSON.stringify(ast, null, 4))

  var scopes = [];
  var externalModules = [];
  var exports = {};
  var paths = [];

  var addModule = function addModule(moduleName, identifier) {
    var imported = arguments.length <= 2 || arguments[2] === undefined ? "default" : arguments[2];

    externalModules.push({
      local: identifier.name,
      start: identifier.start,
      end: identifier.end,
      moduleName: moduleName,
      imported: imported
    });
  };
  var addUnboundModule = function addUnboundModule(moduleName, identifier) {
    var imported = arguments.length <= 2 || arguments[2] === undefined ? identifier.name : arguments[2];
    return (function () {
      paths.push({
        imported: imported,
        moduleName: moduleName,
        range: {
          start: identifier.start,
          end: identifier.end
        }
      });
    })();
  };

  var isModuleDotExports = function isModuleDotExports(node) {
    return t.isMemberExpression(node) && t.isIdentifier(node.object, { name: "module" }) && t.isIdentifier(node.property, { name: "exports" });
  };

  var visitors = {
    Scope: function Scope(_ref) {
      var scope = _ref.scope;

      scopes.push(scope);
    },
    CallExpression: function CallExpression(_ref2) {
      var node = _ref2.node;
      var parent = _ref2.parent;

      // `import()` is an operator, not a function.
      // `isIdentifier` doesn't work here.
      // http://2ality.com/2017/01/import-operator.html
      var isImport = node.callee.type === "Import";

      var isRequire = t.isIdentifier(node.callee, { name: "require" });

      var isRequireResolve = t.isMemberExpression(node.callee, { computed: false }) && t.isIdentifier(node.callee.object, { name: "require" }) && t.isIdentifier(node.callee.property, { name: "resolve" });

      if (isImport || isRequire || isRequireResolve) {
        if (t.isLiteral(node.arguments[0])) {
          (function () {
            var moduleName = undefined;
            var arg = node.arguments[0];
            if (t.isLiteral(arg)) {
              moduleName = arg.value;
            }
            if (moduleName == null && t.isTemplateLiteral(arg) && arg.quasis.length === 1) {
              var quasi = arg.quasis[0];
              moduleName = quasi.value.cooked;
            }
            var id = parent.id;

            if (moduleName != null) {
              if (t.isAssignmentExpression(parent) && isModuleDotExports(parent.left)) {
                addUnboundModule(moduleName, parent.left, "default");
              }

              paths.push({
                imported: "default",
                moduleName: moduleName,
                range: {
                  start: node.arguments[0].start,
                  end: node.arguments[0].end
                }
              });

              if (t.isIdentifier(id)) {
                addModule(moduleName, id);
              }
              if (t.isObjectPattern(id) || t.isArrayPattern(id)) {
                findIdentifiers(id).forEach(function (identifier) {
                  addModule(moduleName, identifier);
                });
              }
            }
          })();
        }
      }
    },
    ImportDeclaration: function ImportDeclaration(_ref3) {
      var node = _ref3.node;

      if (t.isLiteral(node.source)) {
        (function () {
          var moduleName = node.source.value;
          node.specifiers.forEach(function (_ref4) {
            var local = _ref4.local;
            var imported = _ref4.imported;

            var importedName = "default";
            if (imported != null) {
              addUnboundModule(moduleName, imported);
              importedName = imported.name;
            }

            addModule(moduleName, local, importedName);
          });
          paths.push({
            imported: "default",
            moduleName: moduleName,
            range: {
              start: node.source.start,
              end: node.source.end
            }
          });
        })();
      }
    },
    ExportDefaultDeclaration: function ExportDefaultDeclaration(_ref5) {
      var node = _ref5.node;
      var declaration = node.declaration;

      if (t.isIdentifier(declaration)) {
        exports["default"] = {
          start: declaration.start,
          end: declaration.end
        };
        return;
      }

      exports["default"] = {
        start: node.start,
        end: node.end
      };
    },
    ExportNamedDeclaration: function ExportNamedDeclaration(_ref6) {
      var node = _ref6.node;
      var specifiers = node.specifiers;
      var declaration = node.declaration;

      var moduleName = t.isLiteral(node.source) ? node.source.value : undefined;

      specifiers.forEach(function (spec) {
        if (t.isExportSpecifier(spec)) {
          var _spec$exported = spec.exported;
          var _name = _spec$exported.name;
          var start = _spec$exported.start;
          var end = _spec$exported.end;

          exports[_name] = { start: start, end: end };

          // export ... from does not create a local binding, so I'm
          // gathering it in the paths. build-suggestion will convert
          // it back to a `from-module`
          if (moduleName && t.isIdentifier(spec.local)) {
            addUnboundModule(moduleName, spec.local);
            // paths.push({
            //     imported: spec.local.name,
            //     moduleName,
            //     range: {
            //         start: spec.local.start,
            //         end: spec.local.end,
            //     }
            // })
          }
        } else if (t.isExportDefaultSpecifier(spec)) {
            var _spec$exported2 = spec.exported;
            var _name2 = _spec$exported2.name;
            var start = _spec$exported2.start;
            var end = _spec$exported2.end;

            exports[_name2] = { start: start, end: end };

            if (moduleName) {
              paths.push({
                imported: "default",
                moduleName: moduleName,
                range: {
                  start: spec.exported.start,
                  end: spec.exported.end
                }
              });
            }
          }
      });

      if (t.isVariableDeclaration(declaration)) {
        declaration.declarations.forEach(function (_ref7) {
          var id = _ref7.id;

          declaration.declarations.forEach;
          findIdentifiers(id).forEach(function (_ref8) {
            var name = _ref8.name;
            var start = _ref8.start;
            var end = _ref8.end;

            exports[name] = { start: start, end: end };
          });
        });
      }

      if (t.isFunctionDeclaration(declaration) || t.isTypeAlias(declaration) || t.isInterfaceDeclaration(declaration)) {
        var _declaration$id = declaration.id;
        var _name3 = _declaration$id.name;
        var start = _declaration$id.start;
        var end = _declaration$id.end;

        exports[_name3] = { start: start, end: end };
      }

      if (moduleName) {
        paths.push({
          imported: "default",
          moduleName: moduleName,
          range: {
            start: node.source.start,
            end: node.source.end
          }
        });
      }
    },
    ExportAllDeclaration: function ExportAllDeclaration(_ref9) {
      var node = _ref9.node;

      if (t.isLiteral(node.source)) {
        var moduleName = node.source.value;
        paths.push({
          imported: "default",
          moduleName: moduleName,
          range: {
            start: node.source.start,
            end: node.source.end
          }
        });
      }
    },
    AssignmentExpression: function AssignmentExpression(_ref10) {
      var node = _ref10.node;

      if (isModuleDotExports(node.left)) {
        exports["default"] = {
          start: node.left.start,
          end: node.left.end
        };
      }
    }
  };

  try {
    traverse(ast, visitors);
  } catch (e) {
    debug("Error traversing", e);
    /* istanbul ignore else */
    if (e[parseErrorTag]) {
      return { type: "parse-error", parseError: e };
    } else {
      /* This should never trigger, it just rethrows unexpected errors */
      throw e;
    }
  }

  return {
    type: "info",
    scopes: scopes,
    // Cannot return object literal because possibly uninitialized variable [1]
    // is incompatible with string [2] in property moduleName of array element
    // of property externalModules. - $FlowFixMe
    externalModules: externalModules,
    exports: exports,
    paths: paths
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9wYXJzZS1jb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkE2RndCLFNBQVM7Ozs7OztxQkExRlgsT0FBTzs7OztBQUg3QixXQUFXLENBQUE7O0FBSVgsSUFBTSxLQUFLLEdBQUcsd0JBQVUsMEJBQTBCLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7QUFXbkQsSUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUE7O0FBRTlCLElBQU0saUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQUksR0FBRyxFQUFFLElBQUksRUFBSztBQUN2QyxNQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDaEIsTUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsU0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7R0FDbkI7O2lCQUNvQixPQUFPLENBQUMsYUFBYSxDQUFDOztNQUE1QixDQUFDLFlBQVIsS0FBSzs7QUFDYixNQUFJLGNBQWMsWUFBQSxDQUFBO0FBQ2xCLE1BQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN6QixrQkFBYyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDekIsTUFBTSxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbkMsa0JBQWMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDeEMsTUFBTSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsa0JBQWMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDeEM7Ozs7QUFJRCxNQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25CLFVBQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtHQUN4Qzs7QUFFRCxzQ0FBVyxHQUFHLHNCQUFLLGNBQWMsR0FBQztDQUNuQyxDQUFBO0FB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QUFDLEVBQUU7QUFDakMsZUFBTyxXQUFRLEdBQUc7QUFDaEIsZUFBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztBQUN0QixhQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO1NBQ25CLENBQUE7T0FDRjtLQUNGO0dBQ0YsQ0FBQTs7QUFFRCxNQUFJO0FBQ0YsWUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtHQUN4QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsU0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUU1QixRQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNwQixhQUFPLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUE7S0FDOUMsTUFBTTs7QUFFTCxZQUFNLENBQUMsQ0FBQTtLQUNSO0dBQ0Y7O0FBRUQsU0FBTztBQUNMLFFBQUksRUFBRSxNQUFNO0FBQ1osVUFBTSxFQUFOLE1BQU07Ozs7QUFJTixtQkFBZSxFQUFmLGVBQWU7QUFDZixXQUFPLEVBQVAsT0FBTztBQUNQLFNBQUssRUFBTCxLQUFLO0dBQ04sQ0FBQTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9wYXJzZS1jb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLy8gQGZsb3dcbmltcG9ydCB0eXBlIHsgSW5mbyB9IGZyb20gXCIuLi90eXBlc1wiXG5pbXBvcnQgbWFrZURlYnVnIGZyb20gXCJkZWJ1Z1wiXG5jb25zdCBkZWJ1ZyA9IG1ha2VEZWJ1ZyhcImpzLWh5cGVyY2xpY2s6cGFyc2UtY29kZVwiKVxuXG4vLyBUaW1lQ29wIHdhcyByZXBvcnRpbmcgdGhhdCBpdCB0b29rIG92ZXIgNjAwbXMgZm9yIGpzLWh5cGVyY2xpY2sgdG8gc3RhcnQuXG4vLyBDb252ZXJ0aW5nIHRoaXMgYGltcG9ydGAgdG8gYSBgcmVxdWlyZWAgcmVkdWNlZCBpdCB0byB1bmRlciAyNTBtcyBNb3ZpbmcgaXRcbi8vIHRvIHJlcXVpcmUgaW5zaWRlIGBmaW5kSWRlbnRpZmllcnNgIGFuZCBgcGFyc2VDb2RlYCBtb3ZlZCBpdCBvZmYgdGhlIFRpbWVDb3Bcbi8vIGxpc3QgKHVuZGVyIDVtcylcblxuLypcbmltcG9ydCB7IHBhcnNlLCB0cmF2ZXJzZSwgdHlwZXMgYXMgdCB9IGZyb20gJ0BiYWJlbC9jb3JlJ1xuKi9cblxuY29uc3QgcGFyc2VFcnJvclRhZyA9IFN5bWJvbCgpXG5cbmNvbnN0IGlkZW50aWZpZXJSZWR1Y2VyID0gKHRtcCwgbm9kZSkgPT4ge1xuICBsZXQgdmFsdWUgPSBub2RlXG4gIGlmIChub2RlLnZhbHVlKSB7XG4gICAgdmFsdWUgPSBub2RlLnZhbHVlXG4gIH1cbiAgY29uc3QgeyB0eXBlczogdCB9ID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG4gIGxldCBuZXdJZGVudGlmaWVyc1xuICBpZiAodC5pc0lkZW50aWZpZXIodmFsdWUpKSB7XG4gICAgbmV3SWRlbnRpZmllcnMgPSBbdmFsdWVdXG4gIH0gZWxzZSBpZiAodC5pc09iamVjdFBhdHRlcm4odmFsdWUpKSB7XG4gICAgbmV3SWRlbnRpZmllcnMgPSBmaW5kSWRlbnRpZmllcnModmFsdWUpXG4gIH0gZWxzZSBpZiAodC5pc0FycmF5UGF0dGVybih2YWx1ZSkpIHtcbiAgICBuZXdJZGVudGlmaWVycyA9IGZpbmRJZGVudGlmaWVycyh2YWx1ZSlcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBJZiB0aGlzIHRocm93cywgaXQncyBhIG1pc3Rha2UgaW4gbXkgY29kZSBvciBhblxuICAgIC8qIHVuc3VwcG9ydGVkIHN5bnRheCAqL1xuICBpZiAoIW5ld0lkZW50aWZpZXJzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gaWRlbnRpZmllcnMgZm91bmRcIilcbiAgfVxuXG4gIHJldHVybiBbLi4udG1wLCAuLi5uZXdJZGVudGlmaWVyc11cbn1cbmZ1bmN0aW9uIGZpbmRJZGVudGlmaWVycyhub2RlLCBpZGVudGlmaWVycyA9IFtdKSB7XG4gIGNvbnN0IHsgdHlwZXM6IHQgfSA9IHJlcXVpcmUoXCJAYmFiZWwvY29yZVwiKVxuXG4gIGlmICh0LmlzT2JqZWN0UGF0dGVybihub2RlKSkge1xuICAgIHJldHVybiBub2RlLnByb3BlcnRpZXMucmVkdWNlKGlkZW50aWZpZXJSZWR1Y2VyLCBpZGVudGlmaWVycylcbiAgfSBlbHNlIGlmICh0LmlzQXJyYXlQYXR0ZXJuKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUuZWxlbWVudHMucmVkdWNlKGlkZW50aWZpZXJSZWR1Y2VyLCBpZGVudGlmaWVycylcbiAgfSBlbHNlIGlmICh0LmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgIHJldHVybiBbbm9kZV1cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG5vZGUgdHlwZVwiKVxufVxuXG5jb25zdCBtYWtlRGVmYXVsdENvbmZpZyA9ICgpID0+ICh7XG4gIHNvdXJjZVR5cGU6IFwibW9kdWxlXCIsXG4gIC8vIEVuYWJsZSBhcyBtYW55IHBsdWdpbnMgYXMgSSBjYW4gc28gdGhhdCBwZW9wbGUgZG9uJ3QgbmVlZCB0byBjb25maWd1cmVcbiAgLy8gYW55dGhpbmcuXG4gIHBsdWdpbnM6IFtcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtYXN5bmMtZ2VuZXJhdG9yc1wiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtYmlnaW50XCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1jbGFzcy1wcm9wZXJ0aWVzXCIpLFxuICAgIFtcbiAgICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1kZWNvcmF0b3JzXCIpLFxuICAgICAgeyBkZWNvcmF0b3JzQmVmb3JlRXhwb3J0OiBmYWxzZSB9LFxuICAgIF0sXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWRvLWV4cHJlc3Npb25zXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1keW5hbWljLWltcG9ydFwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtZXhwb3J0LWRlZmF1bHQtZnJvbVwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtZXhwb3J0LW5hbWVzcGFjZS1mcm9tXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1mbG93XCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1mdW5jdGlvbi1iaW5kXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1mdW5jdGlvbi1zZW50XCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1pbXBvcnQtbWV0YVwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtanNvbi1zdHJpbmdzXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1qc3hcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWxvZ2ljYWwtYXNzaWdubWVudC1vcGVyYXRvcnNcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LW51bGxpc2gtY29hbGVzY2luZy1vcGVyYXRvclwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtbnVtZXJpYy1zZXBhcmF0b3JcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LW9iamVjdC1yZXN0LXNwcmVhZFwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtb3B0aW9uYWwtY2F0Y2gtYmluZGluZ1wiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtb3B0aW9uYWwtY2hhaW5pbmdcIiksXG4gICAgW1xuICAgICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LXBpcGVsaW5lLW9wZXJhdG9yXCIpLFxuICAgICAgeyBwcm9wb3NhbDogXCJtaW5pbWFsXCIgfSxcbiAgICBdLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC10aHJvdy1leHByZXNzaW9uc1wiKSxcbiAgICAvLyBFdmVuIHRob3VnaCBCYWJlbCBjYW4gcGFyc2UgdHlwZXNjcmlwdCwgSSBjYW4ndCBoYXZlIGl0IGFuZCBmbG93XG4gICAgLy8gZW5hYmxlZCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIC8vIFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtdHlwZXNjcmlwdFwiLFxuICBdLFxufSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VDb2RlKGNvZGU6IHN0cmluZywgYmFiZWxDb25maWc6ID9PYmplY3QpOiBJbmZvIHtcbiAgY29uc3QgeyB0cmF2ZXJzZSwgdHlwZXM6IHQgfSA9IHJlcXVpcmUoXCJAYmFiZWwvY29yZVwiKVxuICBjb25zdCB7IHBhcnNlU3luYyB9ID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG4gIGxldCBhc3QgPSB1bmRlZmluZWRcblxuICB0cnkge1xuICAgIGFzdCA9IHBhcnNlU3luYyhjb2RlLCBiYWJlbENvbmZpZyB8fCBtYWtlRGVmYXVsdENvbmZpZygpKVxuICB9IGNhdGNoIChwYXJzZUVycm9yKSB7XG4gICAgZGVidWcoXCJwYXJzZUVycm9yXCIsIHBhcnNlRXJyb3IpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICByZXR1cm4geyB0eXBlOiBcInBhcnNlLWVycm9yXCIsIHBhcnNlRXJyb3IgfVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXN0LCBudWxsLCA0KSlcblxuICBjb25zdCBzY29wZXMgPSBbXVxuICBjb25zdCBleHRlcm5hbE1vZHVsZXMgPSBbXVxuICBjb25zdCBleHBvcnRzID0ge31cbiAgY29uc3QgcGF0aHMgPSBbXVxuXG4gIGNvbnN0IGFkZE1vZHVsZSA9IChtb2R1bGVOYW1lLCBpZGVudGlmaWVyLCBpbXBvcnRlZCA9IFwiZGVmYXVsdFwiKSA9PiB7XG4gICAgZXh0ZXJuYWxNb2R1bGVzLnB1c2goe1xuICAgICAgbG9jYWw6IGlkZW50aWZpZXIubmFtZSxcbiAgICAgIHN0YXJ0OiBpZGVudGlmaWVyLnN0YXJ0LFxuICAgICAgZW5kOiBpZGVudGlmaWVyLmVuZCxcbiAgICAgIG1vZHVsZU5hbWUsXG4gICAgICBpbXBvcnRlZCxcbiAgICB9KVxuICB9XG4gIGNvbnN0IGFkZFVuYm91bmRNb2R1bGUgPSAoXG4gICAgbW9kdWxlTmFtZSxcbiAgICBpZGVudGlmaWVyLFxuICAgIGltcG9ydGVkID0gaWRlbnRpZmllci5uYW1lLFxuICApID0+IHtcbiAgICBwYXRocy5wdXNoKHtcbiAgICAgIGltcG9ydGVkLFxuICAgICAgbW9kdWxlTmFtZSxcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgIHN0YXJ0OiBpZGVudGlmaWVyLnN0YXJ0LFxuICAgICAgICBlbmQ6IGlkZW50aWZpZXIuZW5kLFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaXNNb2R1bGVEb3RFeHBvcnRzID0gbm9kZSA9PlxuICAgIHQuaXNNZW1iZXJFeHByZXNzaW9uKG5vZGUpICYmXG4gICAgdC5pc0lkZW50aWZpZXIobm9kZS5vYmplY3QsIHsgbmFtZTogXCJtb2R1bGVcIiB9KSAmJlxuICAgIHQuaXNJZGVudGlmaWVyKG5vZGUucHJvcGVydHksIHsgbmFtZTogXCJleHBvcnRzXCIgfSlcblxuICBjb25zdCB2aXNpdG9ycyA9IHtcbiAgICBTY29wZSh7IHNjb3BlIH0pIHtcbiAgICAgIHNjb3Blcy5wdXNoKHNjb3BlKVxuICAgIH0sXG4gICAgQ2FsbEV4cHJlc3Npb24oeyBub2RlLCBwYXJlbnQgfSkge1xuICAgICAgLy8gYGltcG9ydCgpYCBpcyBhbiBvcGVyYXRvciwgbm90IGEgZnVuY3Rpb24uXG4gICAgICAvLyBgaXNJZGVudGlmaWVyYCBkb2Vzbid0IHdvcmsgaGVyZS5cbiAgICAgIC8vIGh0dHA6Ly8yYWxpdHkuY29tLzIwMTcvMDEvaW1wb3J0LW9wZXJhdG9yLmh0bWxcbiAgICAgIGNvbnN0IGlzSW1wb3J0ID0gbm9kZS5jYWxsZWUudHlwZSA9PT0gXCJJbXBvcnRcIlxuXG4gICAgICBjb25zdCBpc1JlcXVpcmUgPSB0LmlzSWRlbnRpZmllcihub2RlLmNhbGxlZSwgeyBuYW1lOiBcInJlcXVpcmVcIiB9KVxuXG4gICAgICBjb25zdCBpc1JlcXVpcmVSZXNvbHZlID1cbiAgICAgICAgdC5pc01lbWJlckV4cHJlc3Npb24obm9kZS5jYWxsZWUsIHsgY29tcHV0ZWQ6IGZhbHNlIH0pICYmXG4gICAgICAgIHQuaXNJZGVudGlmaWVyKG5vZGUuY2FsbGVlLm9iamVjdCwgeyBuYW1lOiBcInJlcXVpcmVcIiB9KSAmJlxuICAgICAgICB0LmlzSWRlbnRpZmllcihub2RlLmNhbGxlZS5wcm9wZXJ0eSwgeyBuYW1lOiBcInJlc29sdmVcIiB9KVxuXG4gICAgICBpZiAoaXNJbXBvcnQgfHwgaXNSZXF1aXJlIHx8IGlzUmVxdWlyZVJlc29sdmUpIHtcbiAgICAgICAgaWYgKHQuaXNMaXRlcmFsKG5vZGUuYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgIGxldCBtb2R1bGVOYW1lXG4gICAgICAgICAgY29uc3QgYXJnID0gbm9kZS5hcmd1bWVudHNbMF1cbiAgICAgICAgICBpZiAodC5pc0xpdGVyYWwoYXJnKSkge1xuICAgICAgICAgICAgbW9kdWxlTmFtZSA9IGFyZy52YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBtb2R1bGVOYW1lID09IG51bGwgJiZcbiAgICAgICAgICAgIHQuaXNUZW1wbGF0ZUxpdGVyYWwoYXJnKSAmJlxuICAgICAgICAgICAgYXJnLnF1YXNpcy5sZW5ndGggPT09IDFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHF1YXNpID0gYXJnLnF1YXNpc1swXVxuICAgICAgICAgICAgbW9kdWxlTmFtZSA9IHF1YXNpLnZhbHVlLmNvb2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB7IGlkIH0gPSBwYXJlbnRcblxuICAgICAgICAgIGlmIChtb2R1bGVOYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdC5pc0Fzc2lnbm1lbnRFeHByZXNzaW9uKHBhcmVudCkgJiZcbiAgICAgICAgICAgICAgaXNNb2R1bGVEb3RFeHBvcnRzKHBhcmVudC5sZWZ0KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGFkZFVuYm91bmRNb2R1bGUobW9kdWxlTmFtZSwgcGFyZW50LmxlZnQsIFwiZGVmYXVsdFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRocy5wdXNoKHtcbiAgICAgICAgICAgICAgaW1wb3J0ZWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBub2RlLmFyZ3VtZW50c1swXS5zdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IG5vZGUuYXJndW1lbnRzWzBdLmVuZCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmICh0LmlzSWRlbnRpZmllcihpZCkpIHtcbiAgICAgICAgICAgICAgYWRkTW9kdWxlKG1vZHVsZU5hbWUsIGlkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHQuaXNPYmplY3RQYXR0ZXJuKGlkKSB8fCB0LmlzQXJyYXlQYXR0ZXJuKGlkKSkge1xuICAgICAgICAgICAgICBmaW5kSWRlbnRpZmllcnMoaWQpLmZvckVhY2goaWRlbnRpZmllciA9PiB7XG4gICAgICAgICAgICAgICAgYWRkTW9kdWxlKG1vZHVsZU5hbWUsIGlkZW50aWZpZXIpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBJbXBvcnREZWNsYXJhdGlvbih7IG5vZGUgfSkge1xuICAgICAgaWYgKHQuaXNMaXRlcmFsKG5vZGUuc291cmNlKSkge1xuICAgICAgICBjb25zdCBtb2R1bGVOYW1lID0gbm9kZS5zb3VyY2UudmFsdWVcbiAgICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goKHsgbG9jYWwsIGltcG9ydGVkIH0pID0+IHtcbiAgICAgICAgICBsZXQgaW1wb3J0ZWROYW1lID0gXCJkZWZhdWx0XCJcbiAgICAgICAgICBpZiAoaW1wb3J0ZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgYWRkVW5ib3VuZE1vZHVsZShtb2R1bGVOYW1lLCBpbXBvcnRlZClcbiAgICAgICAgICAgIGltcG9ydGVkTmFtZSA9IGltcG9ydGVkLm5hbWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhZGRNb2R1bGUobW9kdWxlTmFtZSwgbG9jYWwsIGltcG9ydGVkTmFtZSlcbiAgICAgICAgfSlcbiAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgaW1wb3J0ZWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgIHN0YXJ0OiBub2RlLnNvdXJjZS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogbm9kZS5zb3VyY2UuZW5kLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24oeyBub2RlIH0pIHtcbiAgICAgIGNvbnN0IHsgZGVjbGFyYXRpb24gfSA9IG5vZGVcblxuICAgICAgaWYgKHQuaXNJZGVudGlmaWVyKGRlY2xhcmF0aW9uKSkge1xuICAgICAgICBleHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgICAgICAgc3RhcnQ6IGRlY2xhcmF0aW9uLnN0YXJ0LFxuICAgICAgICAgIGVuZDogZGVjbGFyYXRpb24uZW5kLFxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBleHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgICAgIHN0YXJ0OiBub2RlLnN0YXJ0LFxuICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgfVxuICAgIH0sXG4gICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbih7IG5vZGUgfSkge1xuICAgICAgY29uc3QgeyBzcGVjaWZpZXJzLCBkZWNsYXJhdGlvbiB9ID0gbm9kZVxuXG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gdC5pc0xpdGVyYWwobm9kZS5zb3VyY2UpXG4gICAgICAgID8gbm9kZS5zb3VyY2UudmFsdWVcbiAgICAgICAgOiB1bmRlZmluZWRcblxuICAgICAgc3BlY2lmaWVycy5mb3JFYWNoKHNwZWMgPT4ge1xuICAgICAgICBpZiAodC5pc0V4cG9ydFNwZWNpZmllcihzcGVjKSkge1xuICAgICAgICAgIGNvbnN0IHsgbmFtZSwgc3RhcnQsIGVuZCB9ID0gc3BlYy5leHBvcnRlZFxuICAgICAgICAgIGV4cG9ydHNbbmFtZV0gPSB7IHN0YXJ0LCBlbmQgfVxuXG4gICAgICAgICAgLy8gZXhwb3J0IC4uLiBmcm9tIGRvZXMgbm90IGNyZWF0ZSBhIGxvY2FsIGJpbmRpbmcsIHNvIEknbVxuICAgICAgICAgIC8vIGdhdGhlcmluZyBpdCBpbiB0aGUgcGF0aHMuIGJ1aWxkLXN1Z2dlc3Rpb24gd2lsbCBjb252ZXJ0XG4gICAgICAgICAgLy8gaXQgYmFjayB0byBhIGBmcm9tLW1vZHVsZWBcbiAgICAgICAgICBpZiAobW9kdWxlTmFtZSAmJiB0LmlzSWRlbnRpZmllcihzcGVjLmxvY2FsKSkge1xuICAgICAgICAgICAgYWRkVW5ib3VuZE1vZHVsZShtb2R1bGVOYW1lLCBzcGVjLmxvY2FsKVxuICAgICAgICAgICAgLy8gcGF0aHMucHVzaCh7XG4gICAgICAgICAgICAvLyAgICAgaW1wb3J0ZWQ6IHNwZWMubG9jYWwubmFtZSxcbiAgICAgICAgICAgIC8vICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgLy8gICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHN0YXJ0OiBzcGVjLmxvY2FsLnN0YXJ0LFxuICAgICAgICAgICAgLy8gICAgICAgICBlbmQ6IHNwZWMubG9jYWwuZW5kLFxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHQuaXNFeHBvcnREZWZhdWx0U3BlY2lmaWVyKHNwZWMpKSB7XG4gICAgICAgICAgY29uc3QgeyBuYW1lLCBzdGFydCwgZW5kIH0gPSBzcGVjLmV4cG9ydGVkXG4gICAgICAgICAgZXhwb3J0c1tuYW1lXSA9IHsgc3RhcnQsIGVuZCB9XG5cbiAgICAgICAgICBpZiAobW9kdWxlTmFtZSkge1xuICAgICAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgICAgIGltcG9ydGVkOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICBzdGFydDogc3BlYy5leHBvcnRlZC5zdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IHNwZWMuZXhwb3J0ZWQuZW5kLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmICh0LmlzVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbikpIHtcbiAgICAgICAgZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2goKHsgaWQgfSkgPT4ge1xuICAgICAgICAgIGRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucy5mb3JFYWNoXG4gICAgICAgICAgZmluZElkZW50aWZpZXJzKGlkKS5mb3JFYWNoKCh7IG5hbWUsIHN0YXJ0LCBlbmQgfSkgPT4ge1xuICAgICAgICAgICAgZXhwb3J0c1tuYW1lXSA9IHsgc3RhcnQsIGVuZCB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICB0LmlzRnVuY3Rpb25EZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHxcbiAgICAgICAgdC5pc1R5cGVBbGlhcyhkZWNsYXJhdGlvbikgfHxcbiAgICAgICAgdC5pc0ludGVyZmFjZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwgc3RhcnQsIGVuZCB9ID0gZGVjbGFyYXRpb24uaWRcbiAgICAgICAgZXhwb3J0c1tuYW1lXSA9IHsgc3RhcnQsIGVuZCB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtb2R1bGVOYW1lKSB7XG4gICAgICAgIHBhdGhzLnB1c2goe1xuICAgICAgICAgIGltcG9ydGVkOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICBzdGFydDogbm9kZS5zb3VyY2Uuc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IG5vZGUuc291cmNlLmVuZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgRXhwb3J0QWxsRGVjbGFyYXRpb24oeyBub2RlIH0pIHtcbiAgICAgIGlmICh0LmlzTGl0ZXJhbChub2RlLnNvdXJjZSkpIHtcbiAgICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IG5vZGUuc291cmNlLnZhbHVlXG4gICAgICAgIHBhdGhzLnB1c2goe1xuICAgICAgICAgIGltcG9ydGVkOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICBzdGFydDogbm9kZS5zb3VyY2Uuc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IG5vZGUuc291cmNlLmVuZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgQXNzaWdubWVudEV4cHJlc3Npb24oeyBub2RlIH0pIHtcbiAgICAgIGlmIChpc01vZHVsZURvdEV4cG9ydHMobm9kZS5sZWZ0KSkge1xuICAgICAgICBleHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgICAgICAgc3RhcnQ6IG5vZGUubGVmdC5zdGFydCxcbiAgICAgICAgICBlbmQ6IG5vZGUubGVmdC5lbmQsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9XG5cbiAgdHJ5IHtcbiAgICB0cmF2ZXJzZShhc3QsIHZpc2l0b3JzKVxuICB9IGNhdGNoIChlKSB7XG4gICAgZGVidWcoXCJFcnJvciB0cmF2ZXJzaW5nXCIsIGUpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoZVtwYXJzZUVycm9yVGFnXSkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJwYXJzZS1lcnJvclwiLCBwYXJzZUVycm9yOiBlIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLyogVGhpcyBzaG91bGQgbmV2ZXIgdHJpZ2dlciwgaXQganVzdCByZXRocm93cyB1bmV4cGVjdGVkIGVycm9ycyAqL1xuICAgICAgdGhyb3cgZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogXCJpbmZvXCIsXG4gICAgc2NvcGVzLFxuICAgIC8vIENhbm5vdCByZXR1cm4gb2JqZWN0IGxpdGVyYWwgYmVjYXVzZSBwb3NzaWJseSB1bmluaXRpYWxpemVkIHZhcmlhYmxlIFsxXVxuICAgIC8vIGlzIGluY29tcGF0aWJsZSB3aXRoIHN0cmluZyBbMl0gaW4gcHJvcGVydHkgbW9kdWxlTmFtZSBvZiBhcnJheSBlbGVtZW50XG4gICAgLy8gb2YgcHJvcGVydHkgZXh0ZXJuYWxNb2R1bGVzLiAtICRGbG93Rml4TWVcbiAgICBleHRlcm5hbE1vZHVsZXMsXG4gICAgZXhwb3J0cyxcbiAgICBwYXRocyxcbiAgfVxufVxuIl19