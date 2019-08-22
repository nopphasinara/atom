Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _utils = require('./utils');

var _fuzzy = require('fuzzy');

var Fuzzy = _interopRequireWildcard(_fuzzy);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var ImportCompletionProvider = (function () {
    function ImportCompletionProvider(projectDeps, filesMap) {
        _classCallCheck(this, ImportCompletionProvider);

        this.selector = '.source.js, .source.ts';
        this.disableForSelector = '.source.js .comment, .source.ts .comment';
        // Include as higher priority than default auto complete suggestions
        this.inclusionPriority = 1;

        // Get search structures via Dependency injection
        this.projectDeps = projectDeps;
        this.filesMap = filesMap;
    }

    _createClass(ImportCompletionProvider, [{
        key: 'getSuggestions',
        value: function getSuggestions(_ref) {
            var _this = this;

            var editor = _ref.editor;
            var bufferPosition = _ref.bufferPosition;

            return Promise.resolve().then(function () {
                // TODO: this strategy won't work when the cursor is in the middle
                var prefix = _this._getPrefix(editor, bufferPosition);
                var settings = atom.config.get('autocomplete-js-import');
                var packageName = (0, _utils.capturedDependency)(prefix, settings.importTypes);
                var results = [];

                if (!packageName) {
                    return results;
                }

                // checks for packages starting with name ../ or ./
                if (/^\.{1,2}\//.test(packageName)) {
                    var _ret = (function () {
                        var _getDirAndFilePrefix = (0, _utils.getDirAndFilePrefix)(packageName);

                        var _getDirAndFilePrefix2 = _slicedToArray(_getDirAndFilePrefix, 2);

                        var inputtedRelativePath = _getDirAndFilePrefix2[0];
                        var toComplete = _getDirAndFilePrefix2[1];

                        var currentDirPath = (0, _utils.getParentDir)(editor.getPath());
                        var absolutePath = _path2['default'].resolve(currentDirPath, inputtedRelativePath);

                        return {
                            v: new Promise(function (resolve) {
                                _fs2['default'].readdir(absolutePath, function (err, files) {
                                    if (!files) {
                                        return resolve([]);
                                    }

                                    var matchingFiles = files.filter(function (f) {
                                        return (0, _utils.startsWith)(f, toComplete);
                                    });

                                    if (!settings.hiddenFiles) {
                                        matchingFiles = matchingFiles.filter((0, _utils.not)(_utils.isHiddenFile));
                                    }

                                    resolve(matchingFiles.map(function (d) {
                                        return (0, _utils.dropExtensions)(d, settings.removeExtensions);
                                    }));
                                });
                            })['catch'](function () {/* shit happens */})
                        };
                    })();

                    if (typeof _ret === 'object') return _ret.v;
                } else if ((0, _utils.matchesNPMNaming)(packageName)) {
                        results.push.apply(results, _toConsumableArray(_this.projectDeps.search(editor.getPath(), packageName)));
                    }

                // This is last to give more precedence to package and local file name matches
                if (settings.fuzzy.enabled) {
                    results.push.apply(results, _toConsumableArray(_this._findInFiles(editor.getPath(), packageName)));
                }

                return results;
            }).then(function (completions) {
                // TODO: if part of the text is already present then replace the text or align it
                // ^ e.g in<cursor><enter>dex will result in index.jsdex instead of index.js
                if (completions && completions.length) {
                    return completions.map(function (c) {
                        var fullCompletion = {
                            type: 'import'
                        };

                        if (typeof c === 'string') {
                            fullCompletion.text = c;
                        } else {
                            Object.assign(fullCompletion, c);
                        }

                        return fullCompletion;
                    });
                }

                return [];
            })['catch'](function () {
                // because shit happens and I need to get work done
            });
        }
    }, {
        key: '_getPrefix',
        value: function _getPrefix(editor, _ref2) {
            var row = _ref2.row;
            var column = _ref2.column;

            var prefixRange = new _atom.Range(new _atom.Point(row, 0), new _atom.Point(row, column));

            return editor.getTextInBufferRange(prefixRange);
        }

        /**
         * @private
         * @param  {String} editorPath
         * @param  {String} stringPattern
         * @param  {Number} max
         * @return {Array<Object<text: String, displayText: String>>}
         */
    }, {
        key: '_findInFiles',
        value: function _findInFiles(editorPath, stringPattern) {
            var max = arguments.length <= 2 || arguments[2] === undefined ? 6 : arguments[2];

            var rootDirs = atom.project.getDirectories();
            var containingRoot = rootDirs.find(function (dir) {
                return dir.contains(editorPath);
            });
            var settings = atom.config.get('autocomplete-js-import');
            var results = [];

            if (!containingRoot) {
                return results;
            }

            var targetFileList = this.filesMap.get(containingRoot.path);

            for (var i = 0; i < targetFileList.length && results.length < max; i++) {
                if (Fuzzy.test(stringPattern, targetFileList[i])) {
                    var rootRelativePath = targetFileList[i];
                    var currFileRelativePath = _path2['default'].relative((0, _utils.getParentDir)(editorPath), containingRoot.path + '/' + rootRelativePath);

                    // TODO: I have no idea how buggy this is
                    // path.relative doesn't add a './' for files in same directory
                    if (/^[^.]/.test(currFileRelativePath)) {
                        currFileRelativePath = './' + currFileRelativePath;
                    }

                    // Show the full path because it aligns with what the user is typing,
                    if (settings.fileRelativePaths) {
                        // just insert the path relative to the user's current file
                        results.push({
                            text: (0, _utils.dropExtensions)(currFileRelativePath, settings.removeExtensions),
                            displayText: rootRelativePath
                        });
                    } else {
                        results.push({
                            text: (0, _utils.dropExtensions)(rootRelativePath, settings.removeExtensions),
                            displayText: rootRelativePath
                        });
                    }
                }
            }

            return results;
        }
    }]);

    return ImportCompletionProvider;
})();

exports['default'] = ImportCompletionProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFDMkIsTUFBTTs7cUJBVTFCLFNBQVM7O3FCQUNPLE9BQU87O0lBQWxCLEtBQUs7O29CQUNBLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztBQWRuQixXQUFXLENBQUE7O0lBZ0JVLHdCQUF3QjtBQUM5QixhQURNLHdCQUF3QixDQUM3QixXQUFXLEVBQUUsUUFBUSxFQUFFOzhCQURsQix3QkFBd0I7O0FBRXJDLFlBQUksQ0FBQyxRQUFRLEdBQUksd0JBQXdCLENBQUM7QUFDMUMsWUFBSSxDQUFDLGtCQUFrQixHQUFHLDBDQUEwQyxDQUFDOztBQUVyRSxZQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDNUI7O2lCQVZnQix3QkFBd0I7O2VBWTNCLHdCQUFDLElBQXdCLEVBQUU7OztnQkFBekIsTUFBTSxHQUFQLElBQXdCLENBQXZCLE1BQU07Z0JBQUUsY0FBYyxHQUF2QixJQUF3QixDQUFmLGNBQWM7O0FBQ2xDLG1CQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FDbkIsSUFBSSxDQUFDLFlBQU07O0FBRVIsb0JBQU0sTUFBTSxHQUFHLE1BQUssVUFBVSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN2RCxvQkFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMzRCxvQkFBTSxXQUFXLEdBQUcsK0JBQW1CLE1BQU0sRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckUsb0JBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsb0JB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LDRDQUFvQixHQUFHLElBQUksR0FBRyxvQkFBb0IsQ0FBQztxQkFDdEQ7OztBQUdELHdCQUFJLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTs7QUFFNUIsK0JBQU8sQ0FBQyxJQUFJLENBQUM7QUFDVCxnQ0FBSSxFQUFFLDJCQUFlLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNyRSx1Q0FBVyxFQUFFLGdCQUFnQjt5QkFDaEMsQ0FBQyxDQUFDO3FCQUNOLE1BQU07QUFDSCwrQkFBTyxDQUFDLElBQUksQ0FBQztBQUNULGdDQUFJLEVBQUUsMkJBQWUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDO0FBQ2pFLHVDQUFXLEVBQUUsZ0JBQWdCO3lCQUNoQyxDQUFDLENBQUM7cUJBQ047aUJBQ0o7YUFDSjs7QUFFRCxtQkFBTyxPQUFPLENBQUM7U0FDbEI7OztXQTNJZ0Isd0JBQXdCOzs7cUJBQXhCLHdCQUF3QiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qcy1pbXBvcnQvbGliL3Byb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmltcG9ydCB7UmFuZ2UsIFBvaW50fSBmcm9tICdhdG9tJztcbmltcG9ydCB7XG4gICAgc3RhcnRzV2l0aCxcbiAgICBjYXB0dXJlZERlcGVuZGVuY3ksXG4gICAgbm90LFxuICAgIGlzSGlkZGVuRmlsZSxcbiAgICBtYXRjaGVzTlBNTmFtaW5nLFxuICAgIGRyb3BFeHRlbnNpb25zLFxuICAgIGdldFBhcmVudERpcixcbiAgICBnZXREaXJBbmRGaWxlUHJlZml4XG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgRnV6enkgZnJvbSAnZnV6enknO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBvcnRDb21wbGV0aW9uUHJvdmlkZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2plY3REZXBzLCBmaWxlc01hcCkge1xuICAgICAgICB0aGlzLnNlbGVjdG9yID0gICcuc291cmNlLmpzLCAuc291cmNlLnRzJztcbiAgICAgICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSAnLnNvdXJjZS5qcyAuY29tbWVudCwgLnNvdXJjZS50cyAuY29tbWVudCc7XG4gICAgICAgIC8vIEluY2x1ZGUgYXMgaGlnaGVyIHByaW9yaXR5IHRoYW4gZGVmYXVsdCBhdXRvIGNvbXBsZXRlIHN1Z2dlc3Rpb25zXG4gICAgICAgIHRoaXMuaW5jbHVzaW9uUHJpb3JpdHkgPSAxO1xuXG4gICAgICAgIC8vIEdldCBzZWFyY2ggc3RydWN0dXJlcyB2aWEgRGVwZW5kZW5jeSBpbmplY3Rpb25cbiAgICAgICAgdGhpcy5wcm9qZWN0RGVwcyA9IHByb2plY3REZXBzO1xuICAgICAgICB0aGlzLmZpbGVzTWFwID0gZmlsZXNNYXA7XG4gICAgfVxuXG4gICAgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb259KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgc3RyYXRlZ3kgd29uJ3Qgd29yayB3aGVuIHRoZSBjdXJzb3IgaXMgaW4gdGhlIG1pZGRsZVxuICAgICAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHRoaXMuX2dldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWpzLWltcG9ydCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gY2FwdHVyZWREZXBlbmRlbmN5KHByZWZpeCwgc2V0dGluZ3MuaW1wb3J0VHlwZXMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGlmICghcGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY2hlY2tzIGZvciBwYWNrYWdlcyBzdGFydGluZyB3aXRoIG5hbWUgLi4vIG9yIC4vXG4gICAgICAgICAgICAgICAgaWYgKC9eXFwuezEsMn1cXC8vLnRlc3QocGFja2FnZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtpbnB1dHRlZFJlbGF0aXZlUGF0aCwgdG9Db21wbGV0ZV0gPSBnZXREaXJBbmRGaWxlUHJlZml4KHBhY2thZ2VOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudERpclBhdGggPSBnZXRQYXJlbnREaXIoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShjdXJyZW50RGlyUGF0aCwgaW5wdXR0ZWRSZWxhdGl2ZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLnJlYWRkaXIoYWJzb2x1dGVQYXRoLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGluZ0ZpbGVzID0gZmlsZXMuZmlsdGVyKGYgPT4gc3RhcnRzV2l0aChmLCB0b0NvbXBsZXRlKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLmhpZGRlbkZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nRmlsZXMgPSBtYXRjaGluZ0ZpbGVzLmZpbHRlcihub3QoaXNIaWRkZW5GaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtYXRjaGluZ0ZpbGVzLm1hcChkID0+IGRyb3BFeHRlbnNpb25zKGQsIHNldHRpbmdzLnJlbW92ZUV4dGVuc2lvbnMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7Lyogc2hpdCBoYXBwZW5zICovfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVzTlBNTmFtaW5nKHBhY2thZ2VOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goLi4udGhpcy5wcm9qZWN0RGVwcy5zZWFyY2goZWRpdG9yLmdldFBhdGgoKSwgcGFja2FnZU5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGxhc3QgdG8gZ2l2ZSBtb3JlIHByZWNlZGVuY2UgdG8gcGFja2FnZSBhbmQgbG9jYWwgZmlsZSBuYW1lIG1hdGNoZXNcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZnV6enkuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goLi4udGhpcy5fZmluZEluRmlsZXMoZWRpdG9yLmdldFBhdGgoKSwgcGFja2FnZU5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihjb21wbGV0aW9ucyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogaWYgcGFydCBvZiB0aGUgdGV4dCBpcyBhbHJlYWR5IHByZXNlbnQgdGhlbiByZXBsYWNlIHRoZSB0ZXh0IG9yIGFsaWduIGl0XG4gICAgICAgICAgICAgICAgLy8gXiBlLmcgaW48Y3Vyc29yPjxlbnRlcj5kZXggd2lsbCByZXN1bHQgaW4gaW5kZXguanNkZXggaW5zdGVhZCBvZiBpbmRleC5qc1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0aW9ucyAmJiBjb21wbGV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBsZXRpb25zLm1hcChjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxDb21wbGV0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbXBvcnQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbENvbXBsZXRpb24udGV4dCA9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZnVsbENvbXBsZXRpb24sIGMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVsbENvbXBsZXRpb247XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2Ugc2hpdCBoYXBwZW5zIGFuZCBJIG5lZWQgdG8gZ2V0IHdvcmsgZG9uZVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2dldFByZWZpeChlZGl0b3IsIHtyb3csIGNvbHVtbn0pIHtcbiAgICAgICAgY29uc3QgcHJlZml4UmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KHJvdywgMCksIG5ldyBQb2ludChyb3csIGNvbHVtbikpO1xuXG4gICAgICAgIHJldHVybiBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocHJlZml4UmFuZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBlZGl0b3JQYXRoXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzdHJpbmdQYXR0ZXJuXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBtYXhcbiAgICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q8dGV4dDogU3RyaW5nLCBkaXNwbGF5VGV4dDogU3RyaW5nPj59XG4gICAgICovXG4gICAgX2ZpbmRJbkZpbGVzKGVkaXRvclBhdGgsIHN0cmluZ1BhdHRlcm4sIG1heCA9IDYpIHtcbiAgICAgICAgY29uc3Qgcm9vdERpcnMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcbiAgICAgICAgY29uc3QgY29udGFpbmluZ1Jvb3QgPSByb290RGlycy5maW5kKGRpciA9PiBkaXIuY29udGFpbnMoZWRpdG9yUGF0aCkpO1xuXHRcdGNvbnN0IHNldHRpbmdzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtanMtaW1wb3J0Jyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBpZiAoIWNvbnRhaW5pbmdSb290KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhcmdldEZpbGVMaXN0ID0gdGhpcy5maWxlc01hcC5nZXQoY29udGFpbmluZ1Jvb3QucGF0aCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXRGaWxlTGlzdC5sZW5ndGggJiYgcmVzdWx0cy5sZW5ndGggPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgaWYgKEZ1enp5LnRlc3Qoc3RyaW5nUGF0dGVybiwgdGFyZ2V0RmlsZUxpc3RbaV0pKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vdFJlbGF0aXZlUGF0aCA9IHRhcmdldEZpbGVMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyRmlsZVJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUoXG4gICAgICAgICAgICAgICAgICAgIGdldFBhcmVudERpcihlZGl0b3JQYXRoKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmluZ1Jvb3QucGF0aCArICcvJyArIHJvb3RSZWxhdGl2ZVBhdGhcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogSSBoYXZlIG5vIGlkZWEgaG93IGJ1Z2d5IHRoaXMgaXNcbiAgICAgICAgICAgICAgICAvLyBwYXRoLnJlbGF0aXZlIGRvZXNuJ3QgYWRkIGEgJy4vJyBmb3IgZmlsZXMgaW4gc2FtZSBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgICBpZiAoL15bXi5dLy50ZXN0KGN1cnJGaWxlUmVsYXRpdmVQYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyRmlsZVJlbGF0aXZlUGF0aCA9ICcuLycgKyBjdXJyRmlsZVJlbGF0aXZlUGF0aDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93IHRoZSBmdWxsIHBhdGggYmVjYXVzZSBpdCBhbGlnbnMgd2l0aCB3aGF0IHRoZSB1c2VyIGlzIHR5cGluZyxcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuZmlsZVJlbGF0aXZlUGF0aHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8ganVzdCBpbnNlcnQgdGhlIHBhdGggcmVsYXRpdmUgdG8gdGhlIHVzZXIncyBjdXJyZW50IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRyb3BFeHRlbnNpb25zKGN1cnJGaWxlUmVsYXRpdmVQYXRoLCBzZXR0aW5ncy5yZW1vdmVFeHRlbnNpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiByb290UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkcm9wRXh0ZW5zaW9ucyhyb290UmVsYXRpdmVQYXRoLCBzZXR0aW5ncy5yZW1vdmVFeHRlbnNpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiByb290UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbiJdfQ==