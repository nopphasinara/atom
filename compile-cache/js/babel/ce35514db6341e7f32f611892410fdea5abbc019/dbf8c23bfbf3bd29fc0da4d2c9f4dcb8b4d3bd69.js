Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*global atom */

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _resolve = require('resolve');

var _atom = require('atom');

"use babel";

function findPackageJson(_x) {
    var _again = true;

    _function: while (_again) {
        var basedir = _x;
        _again = false;

        var packagePath = _path3['default'].resolve(basedir, 'package.json');
        try {
            _fs2['default'].accessSync(packagePath);
        } catch (e) {
            var _parent = _path3['default'].resolve(basedir, '../');
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
    var config = JSON.parse(_fs2['default'].readFileSync(packagePath));

    if (config && config.moduleRoots) {
        var _ret = (function () {
            var roots = config.moduleRoots;
            if (typeof roots === 'string') {
                roots = [roots];
            }

            var packageDir = _path3['default'].dirname(packagePath);
            return {
                v: roots.map(function (r) {
                    return _path3['default'].resolve(packageDir, r);
                })
            };
        })();

        if (typeof _ret === 'object') return _ret.v;
    }
}

function resolveWithCustomRoots(basedir, absoluteModule) {
    var module = './' + absoluteModule;

    var roots = loadModuleRoots(basedir);

    if (roots) {
        // Atom doesn't support custom roots, but I need something I can use
        // to verify the feature works.
        if (false) {
            require('make-cache');
        } // eslint-disable-line

        var options = {
            basedir: basedir,
            extensions: atom.config.get('js-hyperclick.extensions')
        };
        for (var i = 0; i < roots.length; i++) {
            options.basedir = roots[i];

            try {
                return (0, _resolve.sync)(module, options);
            } catch (e) {
                /* do nothing */
            }
        }
    }
}

function resolveModule(textEditor, module) {
    var basedir = _path3['default'].dirname(textEditor.getPath());

    if (module[0] === '/') {
        var atomPath = atom.project.relativizePath(textEditor.getPath());
        basedir = atomPath[0];
        module = '.' + module;
    }

    var options = {
        basedir: basedir,
        extensions: atom.config.get('js-hyperclick.extensions')
    };

    try {
        var filename = (0, _resolve.sync)(module, options);
        if (filename == module) {
            return 'http://nodejs.org/api/' + module + '.html';
        }
        return filename;
    } catch (e) {}
    /* do nothing */

    // Allow linking to relative files that don't exist yet.
    if (module[0] === '.') {
        if (_path3['default'].extname(module) == '') {
            module += '.js';
        }

        return _path3['default'].join(basedir, module);
    } else {
        return resolveWithCustomRoots(basedir, module);
    }
}

var scopeSize = function scopeSize(_ref) {
    var b = _ref.block;
    return b.end - b.start;
};

var isJavascript = function isJavascript(textEditor) {
    var _textEditor$getGrammar = textEditor.getGrammar();

    var scopeName = _textEditor$getGrammar.scopeName;

    return scopeName === 'source.js' || scopeName === 'source.js.jsx';
};

exports.isJavascript = isJavascript;
function findClosestScope(scopes, start, end) {
    return scopes.reduce(function (closest, scope) {
        var block = scope.block;

        if (block.start <= start && block.end >= end && scopeSize(scope) < scopeSize(closest)) {
            return scope;
        }

        return closest;
    });
}

function moduleResult(_ref2, textEditor, range, cache) {
    var module = _ref2.module;
    var imported = _ref2.imported;

    return {
        range: range,
        callback: function callback() {
            // ctrl+click creates multiple cursors. This will remove all but the
            // last one to simulate cursor movement instead of creation.
            var lastCursor = textEditor.getLastCursor();
            textEditor.setCursorBufferPosition(lastCursor.getBufferPosition());

            var filename = resolveModule(textEditor, module);

            if (filename == null) {
                var detail = 'module ' + module + ' was not found';

                atom.notifications.addWarning("js-hyperclick", { detail: detail });
                return;
            }

            var _url$parse = _url2['default'].parse(filename);

            var protocol = _url$parse.protocol;

            if (protocol === 'http:' || protocol === 'https:') {
                if (atom.packages.isPackageLoaded('web-browser')) {
                    atom.workspace.open(filename);
                } else {
                    _shell2['default'].openExternal(filename);
                }
                return;
            }

            var options = {
                pending: atom.config.get('js-hyperclick.usePendingPanes')
            };

            atom.workspace.open(filename, options).then(function (editor) {
                var _cache$get = cache.get(editor);

                var parseError = _cache$get.parseError;
                var exports = _cache$get.exports;

                if (parseError) return;

                var target = exports[imported];
                if (target == null) {
                    target = exports['default'];
                }

                if (target != null) {
                    var position = editor.getBuffer().positionForCharacterIndex(target.start);
                    editor.setCursorBufferPosition(position);
                }
            });
        }
    };
}

function pathResult(path, textEditor, cache) {
    var module = {
        module: path.module,
        imported: 'default'
    };

    var range = new _atom.Range(textEditor.getBuffer().positionForCharacterIndex(path.start).toArray(), textEditor.getBuffer().positionForCharacterIndex(path.end).toArray());

    return moduleResult(module, textEditor, range, cache);
}

exports['default'] = function (textEditor, text, range, cache) {
    if (text.length === 0) {
        return null;
    }

    var _cache$get2 = cache.get(textEditor);

    var parseError = _cache$get2.parseError;
    var paths = _cache$get2.paths;
    var scopes = _cache$get2.scopes;
    var externalModules = _cache$get2.externalModules;

    if (parseError) {
        return {
            range: range,
            callback: function callback() {
                var _atom$project$relativizePath = atom.project.relativizePath(textEditor.getPath());

                var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

                var projectPath = _atom$project$relativizePath2[0];
                var relativePath = _atom$project$relativizePath2[1];

                void projectPath;

                atom.notifications.addError('js-hyperclick: error parsing ' + relativePath, {
                    detail: parseError.message
                });
            }
        };
    }

    var start = textEditor.buffer.characterIndexForPosition(range.start);
    var end = textEditor.buffer.characterIndexForPosition(range.end);

    for (var i = 0; i < paths.length; i++) {
        var _path = paths[i];
        if (_path.start > end) {
            break;
        }
        if (_path.start < start && _path.end > end) {
            return pathResult(_path, textEditor, cache);
        }
    }

    var closestScope = findClosestScope(scopes, start, end);

    // Sometimes it reports it has a binding, but it can't actually get the
    // binding
    if (closestScope.hasBinding(text) && closestScope.getBinding(text)) {
        var _ret2 = (function () {

            var binding = closestScope.getBinding(text);
            var _binding$identifier$loc$start = binding.identifier.loc.start;
            var line = _binding$identifier$loc$start.line;
            var column = _binding$identifier$loc$start.column;

            var clickedDeclaration = line - 1 == range.start.row && column == range.start.column;
            var crossFiles = !atom.config.get('js-hyperclick.jumpToImport');

            if (clickedDeclaration || crossFiles) {
                var _module2 = externalModules.find(function (m) {
                    var bindingStart = binding.identifier.start;

                    return m.local == text && m.start == bindingStart;
                });

                if (_module2) {
                    return {
                        v: moduleResult(_module2, textEditor, range, cache)
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
                    range: range,
                    callback: function callback() {
                        textEditor.setCursorBufferPosition([line - 1, column]);
                        textEditor.scrollToCursorPosition();
                    }
                }
            };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL3N1Z2dlc3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7bUJBR2dCLEtBQUs7Ozs7cUJBQ0gsT0FBTzs7OztxQkFDUixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7dUJBQ2EsU0FBUzs7b0JBQ25CLE1BQU07O0FBUjVCLFdBQVcsQ0FBQTs7QUFVWCxTQUFTLGVBQWU7Ozs4QkFBVTtZQUFULE9BQU87OztBQUM1QixZQUFNLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3pELFlBQUk7QUFDQSw0QkFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDN0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLGdCQUFNLE9BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNDLGdCQUFJLE9BQU0sSUFBSSxPQUFPLEVBQUU7cUJBQ0ksT0FBTTs7QUFOL0IsMkJBQVcsR0FJUCxPQUFNOzthQUdYO0FBQ0QsbUJBQU8sU0FBUyxDQUFBO1NBQ25CO0FBQ0QsZUFBTyxXQUFXLENBQUE7S0FDckI7Q0FBQTs7QUFFRCxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUU7QUFDOUIsUUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxXQUFXLEVBQUU7QUFDZCxlQUFNO0tBQ1Q7QUFDRCxRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBOztBQUV2RCxRQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFOztBQUM5QixnQkFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQTtBQUM5QixnQkFBSSxPQUFPLEtBQUss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QkFBTSxrQkFBa0IsR0FBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQyxDQUFBO0FBQ3hGLGdCQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7O0FBRWpFLGdCQUFJLGtCQUFrQixJQUFJLFVBQVUsRUFBRTtBQUNsQyxvQkFBTSxRQUFNLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSzt3QkFDeEIsWUFBWSxHQUFLLE9BQU8sQ0FBQyxVQUFVLENBQTFDLEtBQUs7O0FBQ2IsMkJBQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUE7aUJBQ3BELENBQUMsQ0FBQTs7QUFFRixvQkFBSSxRQUFNLEVBQUU7QUFDUjsyQkFBTyxZQUFZLENBQUMsUUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO3NCQUFBO2lCQUN4RDthQUNKOzs7QUFHRCxnQkFBSSxrQkFBa0IsRUFBRTtBQUNwQjt1QkFBTyxJQUFJO2tCQUFBO2FBQ2Q7O0FBRUQ7bUJBQU87QUFDSCx5QkFBSyxFQUFMLEtBQUs7QUFDTCw0QkFBUSxFQUFBLG9CQUFHO0FBQ1Asa0NBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUN0RCxrQ0FBVSxDQUFDLHNCQUFzQixFQUFFLENBQUE7cUJBQ3RDO2lCQUNKO2NBQUE7Ozs7S0FDSjtDQUNKIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL3N1Z2dlc3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLypnbG9iYWwgYXRvbSAqL1xuXG5pbXBvcnQgdXJsIGZyb20gJ3VybCdcbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBzeW5jIGFzIHJlc29sdmUgfSBmcm9tICdyZXNvbHZlJ1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuXG5mdW5jdGlvbiBmaW5kUGFja2FnZUpzb24oYmFzZWRpcikge1xuICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gcGF0aC5yZXNvbHZlKGJhc2VkaXIsICdwYWNrYWdlLmpzb24nKVxuICAgIHRyeSB7XG4gICAgICAgIGZzLmFjY2Vzc1N5bmMocGFja2FnZVBhdGgpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXRoLnJlc29sdmUoYmFzZWRpciwgJy4uLycpXG4gICAgICAgIGlmIChwYXJlbnQgIT0gYmFzZWRpcikge1xuICAgICAgICAgICAgcmV0dXJuIGZpbmRQYWNrYWdlSnNvbihwYXJlbnQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gcGFja2FnZVBhdGhcbn1cblxuZnVuY3Rpb24gbG9hZE1vZHVsZVJvb3RzKGJhc2VkaXIpIHtcbiAgICBjb25zdCBwYWNrYWdlUGF0aCA9IGZpbmRQYWNrYWdlSnNvbihiYXNlZGlyKVxuICAgIGlmICghcGFja2FnZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VQYXRoKSlcblxuICAgIGlmIChjb25maWcgJiYgY29uZmlnLm1vZHVsZVJvb3RzKSB7XG4gICAgICAgIGxldCByb290cyA9IGNvbmZpZy5tb2R1bGVSb290c1xuICAgICAgICBpZiAodHlwZW9mIHJvb3RzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcm9vdHMgPSBbIHJvb3RzIF1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VEaXIgPSBwYXRoLmRpcm5hbWUocGFja2FnZVBhdGgpXG4gICAgICAgIHJldHVybiByb290cy5tYXAoXG4gICAgICAgICAgICByID0+IHBhdGgucmVzb2x2ZShwYWNrYWdlRGlyICwgcilcbiAgICAgICAgKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVdpdGhDdXN0b21Sb290cyhiYXNlZGlyLCBhYnNvbHV0ZU1vZHVsZSkge1xuICAgIGNvbnN0IG1vZHVsZSA9IGAuLyR7YWJzb2x1dGVNb2R1bGV9YFxuXG4gICAgY29uc3Qgcm9vdHMgPSBsb2FkTW9kdWxlUm9vdHMoYmFzZWRpcilcblxuICAgIGlmIChyb290cykge1xuICAgICAgICAvLyBBdG9tIGRvZXNuJ3Qgc3VwcG9ydCBjdXN0b20gcm9vdHMsIGJ1dCBJIG5lZWQgc29tZXRoaW5nIEkgY2FuIHVzZVxuICAgICAgICAvLyB0byB2ZXJpZnkgdGhlIGZlYXR1cmUgd29ya3MuXG4gICAgICAgIGlmIChmYWxzZSkgeyByZXF1aXJlKCdtYWtlLWNhY2hlJykgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGJhc2VkaXIsXG4gICAgICAgICAgICBleHRlbnNpb25zOiBhdG9tLmNvbmZpZy5nZXQoJ2pzLWh5cGVyY2xpY2suZXh0ZW5zaW9ucycpLFxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9wdGlvbnMuYmFzZWRpciA9IHJvb3RzW2ldXG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobW9kdWxlLCBvcHRpb25zKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU1vZHVsZSh0ZXh0RWRpdG9yLCBtb2R1bGUpIHtcbiAgICBsZXQgYmFzZWRpciA9IHBhdGguZGlybmFtZSh0ZXh0RWRpdG9yLmdldFBhdGgoKSlcblxuICAgIGlmKG1vZHVsZVswXSA9PT0gJy8nKXtcbiAgICAgICBsZXQgYXRvbVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgodGV4dEVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgIGJhc2VkaXIgPSBhdG9tUGF0aFswXTsgXG4gICAgICAgbW9kdWxlID0gJy4nICsgbW9kdWxlO1xuICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgYmFzZWRpcixcbiAgICAgICAgZXh0ZW5zaW9uczogYXRvbS5jb25maWcuZ2V0KCdqcy1oeXBlcmNsaWNrLmV4dGVuc2lvbnMnKVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gcmVzb2x2ZShtb2R1bGUsIG9wdGlvbnMpXG4gICAgICAgIGlmIChmaWxlbmFtZSA9PSBtb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cDovL25vZGVqcy5vcmcvYXBpLyR7bW9kdWxlfS5odG1sYFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWxlbmFtZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLyogZG8gbm90aGluZyAqL1xuICAgIH1cblxuICAgIC8vIEFsbG93IGxpbmtpbmcgdG8gcmVsYXRpdmUgZmlsZXMgdGhhdCBkb24ndCBleGlzdCB5ZXQuXG4gICAgaWYgKG1vZHVsZVswXSA9PT0gJy4nKSB7XG4gICAgICAgIGlmIChwYXRoLmV4dG5hbWUobW9kdWxlKSA9PSAnJykge1xuICAgICAgICAgICAgbW9kdWxlICs9ICcuanMnXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGJhc2VkaXIsIG1vZHVsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZVdpdGhDdXN0b21Sb290cyhiYXNlZGlyLCBtb2R1bGUpXG4gICAgfVxufVxuXG5jb25zdCBzY29wZVNpemUgPSAoe2Jsb2NrOiBifSkgPT4gYi5lbmQgLSBiLnN0YXJ0XG5cbmV4cG9ydCBjb25zdCBpc0phdmFzY3JpcHQgPSAodGV4dEVkaXRvcikgPT4ge1xuICAgIGNvbnN0IHsgc2NvcGVOYW1lIH0gPSB0ZXh0RWRpdG9yLmdldEdyYW1tYXIoKVxuXG4gICAgcmV0dXJuIChzY29wZU5hbWUgPT09ICdzb3VyY2UuanMnIHx8IHNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5qcy5qc3gnKVxufVxuXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdFNjb3BlKHNjb3Blcywgc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBzY29wZXMucmVkdWNlKChjbG9zZXN0LCBzY29wZSkgPT4ge1xuICAgICAgICBjb25zdCB7IGJsb2NrIH0gPSBzY29wZVxuXG4gICAgICAgIGlmIChibG9jay5zdGFydCA8PSBzdGFydFxuICAgICAgICAgICAgJiYgYmxvY2suZW5kID49IGVuZFxuICAgICAgICAgICAgJiYgc2NvcGVTaXplKHNjb3BlKSA8IHNjb3BlU2l6ZShjbG9zZXN0KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtb2R1bGVSZXN1bHQoe21vZHVsZSwgaW1wb3J0ZWR9LCB0ZXh0RWRpdG9yLCByYW5nZSwgY2FjaGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByYW5nZSxcbiAgICAgICAgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBjdHJsK2NsaWNrIGNyZWF0ZXMgbXVsdGlwbGUgY3Vyc29ycy4gVGhpcyB3aWxsIHJlbW92ZSBhbGwgYnV0IHRoZVxuICAgICAgICAgICAgLy8gbGFzdCBvbmUgdG8gc2ltdWxhdGUgY3Vyc29yIG1vdmVtZW50IGluc3RlYWQgb2YgY3JlYXRpb24uXG4gICAgICAgICAgICBjb25zdCBsYXN0Q3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKClcbiAgICAgICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obGFzdEN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuXG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHJlc29sdmVNb2R1bGUodGV4dEVkaXRvciwgbW9kdWxlKVxuXG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGBtb2R1bGUgJHttb2R1bGV9IHdhcyBub3QgZm91bmRgXG5cbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcImpzLWh5cGVyY2xpY2tcIiwgeyBkZXRhaWwgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeyBwcm90b2NvbCB9ID0gdXJsLnBhcnNlKGZpbGVuYW1lKVxuICAgICAgICAgICAgaWYgKHByb3RvY29sID09PSAnaHR0cDonIHx8IHByb3RvY29sID09PSAnaHR0cHM6Jykge1xuICAgICAgICAgICAgICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgnd2ViLWJyb3dzZXInKSkge1xuICAgICAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVuYW1lKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChmaWxlbmFtZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdqcy1oeXBlcmNsaWNrLnVzZVBlbmRpbmdQYW5lcycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZW5hbWUsIG9wdGlvbnMpLnRoZW4oKGVkaXRvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGFyc2VFcnJvciwgZXhwb3J0cyB9ID0gY2FjaGUuZ2V0KGVkaXRvcilcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VFcnJvcikgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZXhwb3J0c1tpbXBvcnRlZF1cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gZXhwb3J0cy5kZWZhdWx0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdG9yLmdldEJ1ZmZlcigpLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodGFyZ2V0LnN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhdGhSZXN1bHQocGF0aCwgdGV4dEVkaXRvciwgY2FjaGUpIHtcbiAgICBjb25zdCBtb2R1bGUgPSB7XG4gICAgICAgIG1vZHVsZTogcGF0aC5tb2R1bGUsXG4gICAgICAgIGltcG9ydGVkOiAnZGVmYXVsdCcsXG4gICAgfVxuXG4gICAgY29uc3QgcmFuZ2UgPSBuZXcgUmFuZ2UoXG4gICAgICAgIHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChwYXRoLnN0YXJ0KS50b0FycmF5KCksXG4gICAgICAgIHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChwYXRoLmVuZCkudG9BcnJheSgpXG4gICAgKVxuXG4gICAgcmV0dXJuIG1vZHVsZVJlc3VsdChtb2R1bGUsIHRleHRFZGl0b3IsIHJhbmdlLCBjYWNoZSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UsIGNhY2hlKSB7XG4gICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIGNvbnN0IHsgcGFyc2VFcnJvciwgcGF0aHMsIHNjb3BlcywgZXh0ZXJuYWxNb2R1bGVzIH0gPSBjYWNoZS5nZXQodGV4dEVkaXRvcilcbiAgICBpZiAocGFyc2VFcnJvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmFuZ2UsXG4gICAgICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbIHByb2plY3RQYXRoLCByZWxhdGl2ZVBhdGggXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aCh0ZXh0RWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgICAgICAgICB2b2lkKHByb2plY3RQYXRoKVxuXG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBqcy1oeXBlcmNsaWNrOiBlcnJvciBwYXJzaW5nICR7cmVsYXRpdmVQYXRofWAsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBwYXJzZUVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnQgPSB0ZXh0RWRpdG9yLmJ1ZmZlci5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKHJhbmdlLnN0YXJ0KVxuICAgIGNvbnN0IGVuZCA9IHRleHRFZGl0b3IuYnVmZmVyLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24ocmFuZ2UuZW5kKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwYXRoID0gcGF0aHNbaV1cbiAgICAgICAgaWYgKHBhdGguc3RhcnQgPiBlbmQpIHsgYnJlYWsgfVxuICAgICAgICBpZiAocGF0aC5zdGFydCA8IHN0YXJ0ICYmIHBhdGguZW5kID4gZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aFJlc3VsdChwYXRoLCB0ZXh0RWRpdG9yLCBjYWNoZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNsb3Nlc3RTY29wZSA9IGZpbmRDbG9zZXN0U2NvcGUoc2NvcGVzLCBzdGFydCwgZW5kKVxuXG4gICAgLy8gU29tZXRpbWVzIGl0IHJlcG9ydHMgaXQgaGFzIGEgYmluZGluZywgYnV0IGl0IGNhbid0IGFjdHVhbGx5IGdldCB0aGVcbiAgICAvLyBiaW5kaW5nXG4gICAgaWYgKGNsb3Nlc3RTY29wZS5oYXNCaW5kaW5nKHRleHQpICYmIGNsb3Nlc3RTY29wZS5nZXRCaW5kaW5nKHRleHQpKSB7XG5cbiAgICAgICAgY29uc3QgYmluZGluZyA9IGNsb3Nlc3RTY29wZS5nZXRCaW5kaW5nKHRleHQpXG4gICAgICAgIGNvbnN0IHsgbGluZSwgY29sdW1uIH0gPSAgYmluZGluZy5pZGVudGlmaWVyLmxvYy5zdGFydFxuXG4gICAgICAgIGNvbnN0IGNsaWNrZWREZWNsYXJhdGlvbiA9IChsaW5lIC0gMSA9PSByYW5nZS5zdGFydC5yb3cgJiYgY29sdW1uID09IHJhbmdlLnN0YXJ0LmNvbHVtbilcbiAgICAgICAgY29uc3QgY3Jvc3NGaWxlcyA9ICFhdG9tLmNvbmZpZy5nZXQoJ2pzLWh5cGVyY2xpY2suanVtcFRvSW1wb3J0JylcblxuICAgICAgICBpZiAoY2xpY2tlZERlY2xhcmF0aW9uIHx8IGNyb3NzRmlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGV4dGVybmFsTW9kdWxlcy5maW5kKChtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGFydDogYmluZGluZ1N0YXJ0IH0gPSBiaW5kaW5nLmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gbS5sb2NhbCA9PSB0ZXh0ICYmIG0uc3RhcnQgPT0gYmluZGluZ1N0YXJ0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vZHVsZVJlc3VsdChtb2R1bGUsIHRleHRFZGl0b3IsIHJhbmdlLCBjYWNoZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4aXQgZWFybHkgaWYgeW91IGNsaWNrZWQgb24gd2hlcmUgdGhlIHZhcmlhYmxlIGlzIGRlY2xhcmVkXG4gICAgICAgIGlmIChjbGlja2VkRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmFuZ2UsXG4gICAgICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICB0ZXh0RWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsaW5lIC0gMSwgY29sdW1uXSlcbiAgICAgICAgICAgICAgICB0ZXh0RWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19