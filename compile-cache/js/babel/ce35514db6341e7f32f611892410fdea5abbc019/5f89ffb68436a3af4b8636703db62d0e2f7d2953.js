"use babel";

// TimeCop was reporting that it took over 600ms for js-hyperclick to start.
// Converting this `import` to a `require` reduced it to under 250ms Moving it
// to require inside `findIdentifiers` and `parseCode` moved it off the TimeCop
// list (under 5ms)

/*
import { parse, traverse, types as t } from 'babel-core'
*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = parseCode;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var parseErrorTag = Symbol();

function findIdentifiers(node) {
    var identifiers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var _require = require('babel-core');

    var t = _require.types;

    var reducer = function reducer(tmp, _ref) {
        var value = _ref.value;

        var newIdentifiers = [];
        if (t.isIdentifier(value)) {
            newIdentifiers = [value];
        } else if (t.isObjectPattern(value) || t.isArrayPattern(value)) {
            newIdentifiers = findIdentifiers(value);
        } else {
            throw new Error("Unknown node type");
        }

        return [].concat(_toConsumableArray(tmp), _toConsumableArray(newIdentifiers));
    };

    if (t.isObjectPattern(node)) {
        return node.properties.reduce(reducer, identifiers);
    } else if (t.isArrayPattern(node)) {
        return node.elements.reduce(reducer, identifiers);
    } else if (t.isIdentifier(node)) {
        return [node];
    } else {
        throw new Error('Unknown node type');
    }
}

function parseCode(code) {
    var _require2 = require('babel-core');

    var traverse = _require2.traverse;
    var t = _require2.types;
    var Hub = traverse.Hub;
    var NodePath = traverse.NodePath;

    var _require3 = require('babylon');

    var parse = _require3.parse;

    var ast = undefined;

    try {
        ast = parse(code, {
            sourceType: "module",
            plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators', 'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind', 'functionSent']
        });
    } catch (parseError) {
        return { parseError: parseError };
    }

    var scopes = [];
    var externalModules = [];
    var exports = {};
    var paths = [];

    var addModule = function addModule(module, identifier) {
        var imported = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];

        externalModules.push({
            local: identifier.name,
            start: identifier.start,
            end: identifier.end,
            module: module,
            imported: imported
        });
    };

    var visitors = {
        Scope: function Scope(_ref2) {
            var scope = _ref2.scope;

            scopes.push(scope);
        },
        CallExpression: function CallExpression(_ref3) {
            var node = _ref3.node;
            var parent = _ref3.parent;

            if (t.isIdentifier(node.callee, { name: "require" })) {
                if (t.isLiteral(node.arguments[0])) {
                    (function () {
                        var module = node.arguments[0].value;
                        var id = parent.id;

                        paths.push({
                            start: node.arguments[0].start,
                            end: node.arguments[0].end,
                            module: module
                        });

                        if (t.isIdentifier(id)) {
                            addModule(module, id);
                        }
                        if (t.isObjectPattern(id) || t.isArrayPattern(id)) {
                            findIdentifiers(id).forEach(function (identifier) {
                                addModule(module, identifier);
                            });
                        }
                    })();
                }
            }
        },
        ImportDeclaration: function ImportDeclaration(_ref4) {
            var node = _ref4.node;

            if (t.isLiteral(node.source)) {
                (function () {
                    var module = node.source.value;
                    paths.push({
                        start: node.source.start,
                        end: node.source.end,
                        module: module
                    });
                    node.specifiers.forEach(function (_ref5) {
                        var local = _ref5.local;
                        var imported = _ref5.imported;

                        var importedName = 'default';
                        if (imported != null) {
                            importedName = imported.name;
                        }

                        addModule(module, local, importedName);
                    });
                })();
            }
        },
        ExportDefaultDeclaration: function ExportDefaultDeclaration(_ref6) {
            var node = _ref6.node;

            exports["default"] = {
                start: node.start,
                end: node.end
            };
        },
        ExportNamedDeclaration: function ExportNamedDeclaration(_ref7) {
            var node = _ref7.node;
            var specifiers = node.specifiers;
            var declaration = node.declaration;

            specifiers.forEach(function (spec) {
                if (t.isExportSpecifier(spec)) {
                    var _spec$exported = spec.exported;
                    var _name = _spec$exported.name;
                    var start = _spec$exported.start;
                    var end = _spec$exported.end;

                    exports[_name] = { start: start, end: end };
                }
            });

            if (t.isVariableDeclaration(declaration)) {
                declaration.declarations.forEach(function (_ref8) {
                    var id = _ref8.id;

                    declaration.declarations.forEach;
                    findIdentifiers(id).forEach(function (_ref9) {
                        var name = _ref9.name;
                        var start = _ref9.start;
                        var end = _ref9.end;

                        exports[name] = { start: start, end: end };
                    });
                });
            }

            if (t.isFunctionDeclaration(declaration)) {
                var _declaration$id = declaration.id;
                var _name2 = _declaration$id.name;
                var start = _declaration$id.start;
                var end = _declaration$id.end;

                exports[_name2] = { start: start, end: end };
            }

            if (t.isLiteral(node.source)) {
                var _module2 = node.source.value;
                paths.push({
                    start: node.source.start,
                    end: node.source.end,
                    module: _module2
                });
            }
        },
        ExportAllDeclaration: function ExportAllDeclaration(_ref10) {
            var node = _ref10.node;

            if (t.isLiteral(node.source)) {
                var _module3 = node.source.value;
                paths.push({
                    start: node.source.start,
                    end: node.source.end,
                    module: _module3
                });
            }
        },
        AssignmentExpression: function AssignmentExpression(_ref11) {
            var _ref11$node = _ref11.node;
            var left = _ref11$node.left;
            var start = _ref11$node.start;
            var end = _ref11$node.end;

            if ((t.isMemberExpression(left) && t.isIdentifier(left.object), { name: 'module' } && t.isIdentifier(left.property, { name: 'exports' }))) {
                exports["default"] = { start: start, end: end };
            }
        }
    };

    try {
        var hub = new Hub({
            buildCodeFrameError: function buildCodeFrameError(node, message, Error) {
                var loc = node && (node.loc || node._loc);

                if (loc) {
                    var err = new Error(message + " (" + loc.start.line + ":" + loc.start.column + ")");
                    err[parseErrorTag] = true;
                    return err;
                }

                // Assume if we don't have a location, then it isn't a problem
                // in the user's code and shouldn't be displayed as a parse
                // error.
                return new Error(message);
            }
        });
        var path = NodePath.get({
            hub: hub,
            parentPath: null,
            parent: ast,
            container: ast,
            key: "program"
        }).setContext();
        // On order to capture duplicate declaration errors I have to build a
        // scope to get access to a "hub" that returns the error I need to catch.
        //
        // https://github.com/babel/babel/issues/4640
        traverse(ast, visitors, path.scope);
    } catch (e) {
        if (e[parseErrorTag]) {
            return { parseError: e };
        }

        throw e;
    }

    return {
        scopes: scopes,
        externalModules: externalModules,
        exports: exports,
        paths: paths
    };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL3BhcnNlLWNvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7OztxQkF1Q2EsU0FBUzs7OztBQTVCakMsSUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUE7O0FBRTlCLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBb0I7UUFBbEIsV0FBVyx5REFBRyxFQUFFOzttQkFDdEIsT0FBTyxDQUFDLFlBQVksQ0FBQzs7UUFBM0IsQ0FBQyxZQUFSLEtBQUs7O0FBQ2IsUUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksR0FBRyxFQUFFLElBQU8sRUFBSztZQUFYLEtBQUssR0FBTixJQUFPLENBQU4sS0FBSzs7QUFDeEIsWUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFlBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2QiwwQkFBYyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDM0IsTUFBTSxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1RCwwQkFBYyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUMxQyxNQUFNO0FBQ0gsa0JBQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtTQUN2Qzs7QUFFRCw0Q0FBVyxHQUFHLHNCQUFLLGNBQWMsR0FBQztLQUNyQyxDQUFBOztBQUVELFFBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN6QixlQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtLQUN0RCxNQUFNLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENB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QUFPLEdBQUcsQ0FBQTtpQkFDYjs7Ozs7QUFLRCx1QkFBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM1QjtTQUNKLENBQUMsQ0FBQTtBQUNGLFlBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDdEIsZUFBRyxFQUFFLEdBQUc7QUFDUixzQkFBVSxFQUFFLElBQUk7QUFDaEIsa0JBQU0sRUFBRSxHQUFHO0FBQ1gscUJBQVMsRUFBRSxHQUFHO0FBQ2QsZUFBRyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBOzs7OztBQUtmLGdCQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLFlBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ2xCLG1CQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFBO1NBQzNCOztBQUVELGNBQU0sQ0FBQyxDQUFBO0tBQ1Y7O0FBRUQsV0FBTztBQUNILGNBQU0sRUFBTixNQUFNO0FBQ04sdUJBQWUsRUFBZixlQUFlO0FBQ2YsZUFBTyxFQUFQLE9BQU87QUFDUCxhQUFLLEVBQUwsS0FBSztLQUNSLENBQUE7Q0FDSiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2stcHJvamVjdC1wYXRoL2xpYi9wYXJzZS1jb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuXG4vLyBUaW1lQ29wIHdhcyByZXBvcnRpbmcgdGhhdCBpdCB0b29rIG92ZXIgNjAwbXMgZm9yIGpzLWh5cGVyY2xpY2sgdG8gc3RhcnQuXG4vLyBDb252ZXJ0aW5nIHRoaXMgYGltcG9ydGAgdG8gYSBgcmVxdWlyZWAgcmVkdWNlZCBpdCB0byB1bmRlciAyNTBtcyBNb3ZpbmcgaXRcbi8vIHRvIHJlcXVpcmUgaW5zaWRlIGBmaW5kSWRlbnRpZmllcnNgIGFuZCBgcGFyc2VDb2RlYCBtb3ZlZCBpdCBvZmYgdGhlIFRpbWVDb3Bcbi8vIGxpc3QgKHVuZGVyIDVtcylcblxuLypcbmltcG9ydCB7IHBhcnNlLCB0cmF2ZXJzZSwgdHlwZXMgYXMgdCB9IGZyb20gJ2JhYmVsLWNvcmUnXG4qL1xuXG5jb25zdCBwYXJzZUVycm9yVGFnID0gU3ltYm9sKClcblxuZnVuY3Rpb24gZmluZElkZW50aWZpZXJzKG5vZGUsIGlkZW50aWZpZXJzID0gW10pIHtcbiAgICBjb25zdCB7IHR5cGVzOiB0IH0gPSByZXF1aXJlKCdiYWJlbC1jb3JlJylcbiAgICBjb25zdCByZWR1Y2VyID0gKHRtcCwge3ZhbHVlfSkgPT4ge1xuICAgICAgICBsZXQgbmV3SWRlbnRpZmllcnMgPSBbXVxuICAgICAgICBpZiAodC5pc0lkZW50aWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICBuZXdJZGVudGlmaWVycyA9IFt2YWx1ZV1cbiAgICAgICAgfSBlbHNlIGlmICh0LmlzT2JqZWN0UGF0dGVybih2YWx1ZSkgfHwgdC5pc0FycmF5UGF0dGVybih2YWx1ZSkpIHtcbiAgICAgICAgICAgIG5ld0lkZW50aWZpZXJzID0gZmluZElkZW50aWZpZXJzKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBub2RlIHR5cGVcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbLi4udG1wLCAuLi5uZXdJZGVudGlmaWVyc11cbiAgICB9XG5cbiAgICBpZiAodC5pc09iamVjdFBhdHRlcm4obm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUucHJvcGVydGllcy5yZWR1Y2UocmVkdWNlciwgaWRlbnRpZmllcnMpXG4gICAgfSBlbHNlIGlmICh0LmlzQXJyYXlQYXR0ZXJuKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlLmVsZW1lbnRzLnJlZHVjZShyZWR1Y2VyLCBpZGVudGlmaWVycylcbiAgICB9IGVsc2UgaWYgKHQuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBbIG5vZGUgXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBub2RlIHR5cGUnKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VDb2RlKGNvZGUpIHtcbiAgICBjb25zdCB7IHRyYXZlcnNlLCB0eXBlczogdCB9ID0gcmVxdWlyZSgnYmFiZWwtY29yZScpXG4gICAgY29uc3QgeyBIdWIsIE5vZGVQYXRoIH0gPSB0cmF2ZXJzZVxuICAgIGNvbnN0IHsgcGFyc2UgfSA9IHJlcXVpcmUoJ2JhYnlsb24nKVxuICAgIGxldCBhc3QgPSB1bmRlZmluZWRcblxuICAgIHRyeSB7XG4gICAgICAgIGFzdCA9IHBhcnNlKGNvZGUsIHtcbiAgICAgICAgICAgIHNvdXJjZVR5cGU6IFwibW9kdWxlXCIsXG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgICAgJ2pzeCcsXG4gICAgICAgICAgICAgICAgJ2Zsb3cnLFxuICAgICAgICAgICAgICAgICdkb0V4cHJlc3Npb25zJyxcbiAgICAgICAgICAgICAgICAnb2JqZWN0UmVzdFNwcmVhZCcsXG4gICAgICAgICAgICAgICAgJ2RlY29yYXRvcnMnLFxuICAgICAgICAgICAgICAgICdjbGFzc1Byb3BlcnRpZXMnLFxuICAgICAgICAgICAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICAgICAgICAgICAnYXN5bmNHZW5lcmF0b3JzJyxcbiAgICAgICAgICAgICAgICAnZnVuY3Rpb25CaW5kJyxcbiAgICAgICAgICAgICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICB9IGNhdGNoIChwYXJzZUVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHBhcnNlRXJyb3IgfVxuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlcyA9IFtdXG4gICAgY29uc3QgZXh0ZXJuYWxNb2R1bGVzID0gW11cbiAgICBjb25zdCBleHBvcnRzID0ge31cbiAgICBjb25zdCBwYXRocyA9IFtdXG5cbiAgICBjb25zdCBhZGRNb2R1bGUgPSAobW9kdWxlLCBpZGVudGlmaWVyLCBpbXBvcnRlZCA9ICdkZWZhdWx0JykgPT4ge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXMucHVzaCh7XG4gICAgICAgICAgICBsb2NhbDogaWRlbnRpZmllci5uYW1lLFxuICAgICAgICAgICAgc3RhcnQ6IGlkZW50aWZpZXIuc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGlkZW50aWZpZXIuZW5kLFxuICAgICAgICAgICAgbW9kdWxlLFxuICAgICAgICAgICAgaW1wb3J0ZWQsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmlzaXRvcnMgPSB7XG4gICAgICAgIFNjb3BlKHsgc2NvcGUgfSkge1xuICAgICAgICAgICAgc2NvcGVzLnB1c2goc2NvcGUpXG4gICAgICAgIH0sXG4gICAgICAgIENhbGxFeHByZXNzaW9uKHsgbm9kZSwgcGFyZW50IH0pIHtcbiAgICAgICAgICAgIGlmICh0LmlzSWRlbnRpZmllcihub2RlLmNhbGxlZSwgeyBuYW1lOiBcInJlcXVpcmVcIiB9KSkge1xuICAgICAgICAgICAgICAgIGlmICh0LmlzTGl0ZXJhbChub2RlLmFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gbm9kZS5hcmd1bWVudHNbMF0udmFsdWVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBpZCB9ID0gcGFyZW50XG5cbiAgICAgICAgICAgICAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbm9kZS5hcmd1bWVudHNbMF0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IG5vZGUuYXJndW1lbnRzWzBdLmVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc0lkZW50aWZpZXIoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRNb2R1bGUobW9kdWxlLCBpZClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodC5pc09iamVjdFBhdHRlcm4oaWQpIHx8IHQuaXNBcnJheVBhdHRlcm4oaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kSWRlbnRpZmllcnMoaWQpLmZvckVhY2goKGlkZW50aWZpZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRNb2R1bGUobW9kdWxlLCBpZGVudGlmaWVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgSW1wb3J0RGVjbGFyYXRpb24oeyBub2RlIH0pIHtcbiAgICAgICAgICAgIGlmICh0LmlzTGl0ZXJhbChub2RlLnNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBub2RlLnNvdXJjZS52YWx1ZVxuICAgICAgICAgICAgICAgIHBhdGhzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbm9kZS5zb3VyY2Uuc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGVuZDogbm9kZS5zb3VyY2UuZW5kLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGUsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaCgoe2xvY2FsLCBpbXBvcnRlZH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydGVkTmFtZSA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0ZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0ZWROYW1lID0gaW1wb3J0ZWQubmFtZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYWRkTW9kdWxlKG1vZHVsZSwgbG9jYWwsIGltcG9ydGVkTmFtZSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24oeyBub2RlIH0pIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDogbm9kZS5zdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uKHsgbm9kZSB9KSB7XG4gICAgICAgICAgICBjb25zdCB7IHNwZWNpZmllcnMsIGRlY2xhcmF0aW9uIH0gPSBub2RlXG5cbiAgICAgICAgICAgIHNwZWNpZmllcnMuZm9yRWFjaCgoc3BlYykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0LmlzRXhwb3J0U3BlY2lmaWVyKHNwZWMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbmFtZSwgc3RhcnQsIGVuZCB9ID0gc3BlYy5leHBvcnRlZFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRzW25hbWVdID0geyBzdGFydCwgZW5kIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAodC5pc1ZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2goKHtpZH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2hcbiAgICAgICAgICAgICAgICAgICAgZmluZElkZW50aWZpZXJzKGlkKS5mb3JFYWNoKCh7bmFtZSwgc3RhcnQsIGVuZH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydHNbbmFtZV0gPSB7IHN0YXJ0LCBlbmQgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0LmlzRnVuY3Rpb25EZWNsYXJhdGlvbihkZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIHN0YXJ0LCBlbmQgfSA9IGRlY2xhcmF0aW9uLmlkXG4gICAgICAgICAgICAgICAgZXhwb3J0c1tuYW1lXSA9IHsgc3RhcnQsIGVuZCB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0LmlzTGl0ZXJhbChub2RlLnNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBub2RlLnNvdXJjZS52YWx1ZVxuICAgICAgICAgICAgICAgIHBhdGhzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbm9kZS5zb3VyY2Uuc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGVuZDogbm9kZS5zb3VyY2UuZW5kLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGUsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRBbGxEZWNsYXJhdGlvbih7IG5vZGUgfSkge1xuICAgICAgICAgICAgaWYgKHQuaXNMaXRlcmFsKG5vZGUuc291cmNlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IG5vZGUuc291cmNlLnZhbHVlXG4gICAgICAgICAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBub2RlLnNvdXJjZS5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgZW5kOiBub2RlLnNvdXJjZS5lbmQsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBBc3NpZ25tZW50RXhwcmVzc2lvbih7IG5vZGU6IHtsZWZ0LCBzdGFydCwgZW5kfSB9KSB7XG4gICAgICAgICAgICBpZiAodC5pc01lbWJlckV4cHJlc3Npb24obGVmdClcbiAgICAgICAgICAgICAgICAmJiB0LmlzSWRlbnRpZmllcihsZWZ0Lm9iamVjdCksIHsgbmFtZTogJ21vZHVsZSd9XG4gICAgICAgICAgICAgICAgJiYgdC5pc0lkZW50aWZpZXIobGVmdC5wcm9wZXJ0eSwgeyBuYW1lOiAnZXhwb3J0cyd9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZXhwb3J0cy5kZWZhdWx0ID0geyBzdGFydCwgZW5kIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaHViID0gbmV3IEh1Yih7XG4gICAgICAgICAgICBidWlsZENvZGVGcmFtZUVycm9yKG5vZGUsIG1lc3NhZ2UsIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jID0gbm9kZSAmJiAobm9kZS5sb2MgfHwgbm9kZS5fbG9jKVxuXG4gICAgICAgICAgICAgICAgaWYgKGxvYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSAgbmV3IEVycm9yKGAke21lc3NhZ2V9ICgke2xvYy5zdGFydC5saW5lfToke2xvYy5zdGFydC5jb2x1bW59KWApXG4gICAgICAgICAgICAgICAgICAgIGVycltwYXJzZUVycm9yVGFnXSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVyclxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFzc3VtZSBpZiB3ZSBkb24ndCBoYXZlIGEgbG9jYXRpb24sIHRoZW4gaXQgaXNuJ3QgYSBwcm9ibGVtXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIHVzZXIncyBjb2RlIGFuZCBzaG91bGRuJ3QgYmUgZGlzcGxheWVkIGFzIGEgcGFyc2VcbiAgICAgICAgICAgICAgICAvLyBlcnJvci5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHBhdGggPSBOb2RlUGF0aC5nZXQoe1xuICAgICAgICAgICAgaHViOiBodWIsXG4gICAgICAgICAgICBwYXJlbnRQYXRoOiBudWxsLFxuICAgICAgICAgICAgcGFyZW50OiBhc3QsXG4gICAgICAgICAgICBjb250YWluZXI6IGFzdCxcbiAgICAgICAgICAgIGtleTogXCJwcm9ncmFtXCJcbiAgICAgICAgfSkuc2V0Q29udGV4dCgpXG4gICAgICAgIC8vIE9uIG9yZGVyIHRvIGNhcHR1cmUgZHVwbGljYXRlIGRlY2xhcmF0aW9uIGVycm9ycyBJIGhhdmUgdG8gYnVpbGQgYVxuICAgICAgICAvLyBzY29wZSB0byBnZXQgYWNjZXNzIHRvIGEgXCJodWJcIiB0aGF0IHJldHVybnMgdGhlIGVycm9yIEkgbmVlZCB0byBjYXRjaC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2lzc3Vlcy80NjQwXG4gICAgICAgIHRyYXZlcnNlKGFzdCwgdmlzaXRvcnMsIHBhdGguc2NvcGUpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZVtwYXJzZUVycm9yVGFnXSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgcGFyc2VFcnJvcjogZSB9XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2NvcGVzLFxuICAgICAgICBleHRlcm5hbE1vZHVsZXMsXG4gICAgICAgIGV4cG9ydHMsXG4gICAgICAgIHBhdGhzLFxuICAgIH1cbn1cbiJdfQ==