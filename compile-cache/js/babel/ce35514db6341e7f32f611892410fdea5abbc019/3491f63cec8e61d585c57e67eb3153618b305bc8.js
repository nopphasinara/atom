Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _utils = require('./utils');

/**
 * Wrapper for dealing with filesystem paths.
 */

var Path = (function () {
    function Path() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        _classCallCheck(this, Path);

        // The last path segment is the "fragment". Paths that end in a
        // separator have a blank fragment.
        var sep = (0, _utils.preferredSeparatorFor)(path);
        var parts = path.split(sep);
        var fragment = parts[parts.length - 1];
        var directory = path.substring(0, path.length - fragment.length);

        // Set non-writable properties.
        (0, _utils.defineImmutable)(this, 'directory', directory);
        (0, _utils.defineImmutable)(this, 'fragment', fragment);
        (0, _utils.defineImmutable)(this, 'full', path);
        (0, _utils.defineImmutable)(this, 'sep', sep);
    }

    /**
     * Return whether the filename matches the given path fragment.
     */

    _createDecoratedClass(Path, [{
        key: 'isDirectory',
        value: function isDirectory() {
            return this.stat ? this.stat.isDirectory() : null;
        }
    }, {
        key: 'isFile',
        value: function isFile() {
            return this.stat ? !this.stat.isDirectory() : null;
        }
    }, {
        key: 'isProjectDirectory',
        value: function isProjectDirectory() {
            return atom.project.getPaths().indexOf(this.absolute) !== -1;
        }
    }, {
        key: 'isRoot',
        value: function isRoot() {
            return _path2['default'].dirname(this.absolute) === this.absolute;
        }
    }, {
        key: 'hasCaseSensitiveFragment',
        value: function hasCaseSensitiveFragment() {
            return this.fragment !== '' && this.fragment !== this.fragment.toLowerCase();
        }
    }, {
        key: 'exists',
        value: function exists() {
            return this.stat !== null;
        }
    }, {
        key: 'asDirectory',
        value: function asDirectory() {
            return new Path(this.full + (this.fragment ? this.sep : ''));
        }
    }, {
        key: 'parent',
        value: function parent() {
            if (this.isRoot()) {
                return this;
            } else if (this.fragment) {
                return new Path(this.directory);
            } else {
                return new Path(_path2['default'].dirname(this.directory) + this.sep);
            }
        }

        /**
         * Return path for the root directory for the drive this path is on.
         */
    }, {
        key: 'root',
        value: function root() {
            var last = null;
            var current = this.absolute;
            while (current !== last) {
                last = current;
                current = _path2['default'].dirname(current);
            }

            return new Path(current);
        }

        /**
         * Create an empty file at the given path if it doesn't already exist.
         */
    }, {
        key: 'createFile',
        value: function createFile() {
            _touch2['default'].sync(this.absolute);
        }

        /**
         * Create directories for the file this path points to, or do nothing
         * if they already exist.
         */
    }, {
        key: 'createDirectories',
        value: function createDirectories() {
            try {
                _mkdirp2['default'].sync((0, _utils.absolutify)(this.directory));
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
    }, {
        key: 'matchingPaths',
        value: function matchingPaths() {
            var _this = this;

            var caseSensitive = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var absoluteDir = (0, _utils.absolutify)(this.directory);
            var filenames = null;

            try {
                filenames = _fs2['default'].readdirSync(absoluteDir);
            } catch (err) {
                return []; // TODO: Catch permissions error and display a message.
            }

            if (this.fragment) {
                if (config.get('fuzzyMatch')) {
                    filenames = _fuzzaldrinPlus2['default'].filter(filenames, this.fragment);
                } else {
                    if (caseSensitive === null) {
                        caseSensitive = this.hasCaseSensitiveFragment();
                    }

                    filenames = filenames.filter(function (fn) {
                        return matchFragment(_this.fragment, fn, caseSensitive);
                    });
                }
            }

            filenames = filenames.filter(isVisible);
            return filenames.map(function (fn) {
                return new Path(_this.directory + fn);
            });
        }

        /**
         * Check if the last path fragment in this path is equal to the given
         * shortcut string, and the path ends in a separator.
         *
         * For example, ':/' and '/foo/bar/:/' have the ':' shortcut, but
         * '/foo/bar:/' and '/blah/:' do not.
         */
    }, {
        key: 'hasShortcut',
        value: function hasShortcut(shortcut) {
            shortcut = shortcut + this.sep;
            return !this.fragment && (this.directory.endsWith(this.sep + shortcut) || this.directory === shortcut);
        }
    }, {
        key: 'equals',
        value: function equals(otherPath) {
            return this.full === otherPath.full;
        }

        /**
         * Return the path to show initially in the path input.
         */
    }, {
        key: 'absolute',
        decorators: [_utils.cachedProperty],
        get: function get() {
            return (0, _utils.absolutify)(this.full);
        }
    }, {
        key: 'stat',
        decorators: [_utils.cachedProperty],
        get: function get() {
            try {
                return _fs2['default'].statSync(this.absolute);
            } catch (err) {
                return null;
            }
        }
    }], [{
        key: 'initial',
        value: function initial() {
            switch (config.get('defaultInputValue')) {
                case config.DEFAULT_ACTIVE_FILE_DIR:
                    var editor = atom.workspace.getActiveTextEditor();
                    if (editor && editor.getPath()) {
                        return new Path(_path2['default'].dirname(editor.getPath()) + _path2['default'].sep);
                    }
                // No break so that we fall back to project root.
                case config.DEFAULT_PROJECT_ROOT:
                    var projectPath = (0, _utils.getProjectPath)();
                    if (projectPath) {
                        return new Path(projectPath + _path2['default'].sep);
                    }
            }

            return new Path('');
        }

        /**
         * Compare two paths lexicographically.
         */
    }, {
        key: 'compare',
        value: function compare(path1, path2) {
            return path1.full.localeCompare(path2.full);
        }

        /**
         * Return a new path instance with the common prefix of all the
         * given paths.
         */
    }, {
        key: 'commonPrefix',
        value: function commonPrefix(paths) {
            var caseSensitive = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (paths.length < 2) {
                throw new Error('Cannot find common prefix for lists shorter than two elements.');
            }

            paths = paths.map(function (path) {
                return path.full;
            }).sort();
            var first = paths[0];
            var last = paths[paths.length - 1];

            var prefix = '';
            var prefixMaxLength = Math.min(first.length, last.length);
            for (var k = 0; k < prefixMaxLength; k++) {
                if (first[k] === last[k]) {
                    prefix += first[k];
                } else if (!caseSensitive && first[k].toLowerCase() === last[k].toLowerCase()) {
                    prefix += first[k].toLowerCase();
                } else {
                    break;
                }
            }

            return new Path(prefix);
        }
    }]);

    return Path;
})();

exports.Path = Path;
function matchFragment(fragment, filename) {
    var caseSensitive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!caseSensitive) {
        fragment = fragment.toLowerCase();
        filename = filename.toLowerCase();
    }

    return filename.startsWith(fragment);
}

/**
 * Return whether the filename is not hidden by the ignoredPatterns config.
 */
function isVisible(filename) {
    for (var ignoredPattern of (0, _utils.ignoredPatterns)()) {
        if (ignoredPattern.match(filename)) return false;
    }
    return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9tb2RlbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDQyxNQUFNOzs7OzhCQUVILGlCQUFpQjs7OztzQkFDckIsUUFBUTs7OztxQkFDVCxPQUFPOzs7O3NCQUVELFVBQVU7O0lBQXRCLE1BQU07O3FCQVFYLFNBQVM7Ozs7OztJQU1ILElBQUk7QUFDRixhQURGLElBQUksR0FDUTtZQUFULElBQUkseURBQUMsRUFBRTs7OEJBRFYsSUFBSTs7OztBQUlULFlBQUksR0FBRyxHQUFHLGtDQUFzQixJQUFJLENBQUMsQ0FBQztBQUN0QyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFlBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHakUsb0NBQWdCLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDOUMsb0NBQWdCLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsb0NBQWdCLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsb0NBQWdCLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7OzswQkFkUSxJQUFJOztlQThCRix1QkFBRztBQUNWLG1CQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7U0FDckQ7OztlQUVLLGtCQUFHO0FBQ0wsbUJB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LGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7S0FDcEQ7QUFDRCxXQUFPLElBQUksQ0FBQztDQUNmIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9tb2RlbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgc3RkUGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IGZ1enphbGRyaW4gZnJvbSAnZnV6emFsZHJpbi1wbHVzJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCB0b3VjaCBmcm9tICd0b3VjaCc7XG5cbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICAgIGFic29sdXRpZnksXG4gICAgY2FjaGVkUHJvcGVydHksXG4gICAgZGVmaW5lSW1tdXRhYmxlLFxuICAgIGdldFByb2plY3RQYXRoLFxuICAgIGlnbm9yZWRQYXR0ZXJucyxcbiAgICBwcmVmZXJyZWRTZXBhcmF0b3JGb3Jcbn0gZnJvbSAnLi91dGlscyc7XG5cblxuLyoqXG4gKiBXcmFwcGVyIGZvciBkZWFsaW5nIHdpdGggZmlsZXN5c3RlbSBwYXRocy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHBhdGg9JycpIHtcbiAgICAgICAgLy8gVGhlIGxhc3QgcGF0aCBzZWdtZW50IGlzIHRoZSBcImZyYWdtZW50XCIuIFBhdGhzIHRoYXQgZW5kIGluIGFcbiAgICAgICAgLy8gc2VwYXJhdG9yIGhhdmUgYSBibGFuayBmcmFnbWVudC5cbiAgICAgICAgbGV0IHNlcCA9IHByZWZlcnJlZFNlcGFyYXRvckZvcihwYXRoKTtcbiAgICAgICAgbGV0IHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgICAgICBsZXQgZnJhZ21lbnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IGRpcmVjdG9yeSA9IHBhdGguc3Vic3RyaW5nKDAsIHBhdGgubGVuZ3RoIC0gZnJhZ21lbnQubGVuZ3RoKTtcblxuICAgICAgICAvLyBTZXQgbm9uLXdyaXRhYmxlIHByb3BlcnRpZXMuXG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnZGlyZWN0b3J5JywgZGlyZWN0b3J5KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmcmFnbWVudCcsIGZyYWdtZW50KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmdWxsJywgcGF0aCk7XG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnc2VwJywgc2VwKTtcbiAgICB9XG5cbiAgICBAY2FjaGVkUHJvcGVydHlcbiAgICBnZXQgYWJzb2x1dGUoKSB7XG4gICAgICAgIHJldHVybiBhYnNvbHV0aWZ5KHRoaXMuZnVsbCk7XG4gICAgfVxuXG4gICAgQGNhY2hlZFByb3BlcnR5XG4gICAgZ2V0IHN0YXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuc3RhdFN5bmModGhpcy5hYnNvbHV0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0RpcmVjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdCA/IHRoaXMuc3RhdC5pc0RpcmVjdG9yeSgpIDogbnVsbDtcbiAgICB9XG5cbiAgICBpc0ZpbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXQgPyAhdGhpcy5zdGF0LmlzRGlyZWN0b3J5KCkgOiBudWxsO1xuICAgIH1cblxuICAgIGlzUHJvamVjdERpcmVjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpLmluZGV4T2YodGhpcy5hYnNvbHV0ZSkgIT09IC0xO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHN0ZFBhdGguZGlybmFtZSh0aGlzLmFic29sdXRlKSA9PT0gdGhpcy5hYnNvbHV0ZTtcbiAgICB9XG5cbiAgICBoYXNDYXNlU2Vuc2l0aXZlRnJhZ21lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyYWdtZW50ICE9PSAnJyAmJiB0aGlzLmZyYWdtZW50ICE9PSB0aGlzLmZyYWdtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZXhpc3RzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ICE9PSBudWxsO1xuICAgIH1cblxuICAgIGFzRGlyZWN0b3J5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFBhdGgodGhpcy5mdWxsICsgKHRoaXMuZnJhZ21lbnQgPyB0aGlzLnNlcCA6ICcnKSk7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5mcmFnbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHRoaXMuZGlyZWN0b3J5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChzdGRQYXRoLmRpcm5hbWUodGhpcy5kaXJlY3RvcnkpICsgdGhpcy5zZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHBhdGggZm9yIHRoZSByb290IGRpcmVjdG9yeSBmb3IgdGhlIGRyaXZlIHRoaXMgcGF0aCBpcyBvbi5cbiAgICAgKi9cbiAgICByb290KCkge1xuICAgICAgICBsZXQgbGFzdCA9IG51bGw7XG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5hYnNvbHV0ZTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGxhc3QpIHtcbiAgICAgICAgICAgIGxhc3QgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IHN0ZFBhdGguZGlybmFtZShjdXJyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aChjdXJyZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gZW1wdHkgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRmlsZSgpIHtcbiAgICAgICAgdG91Y2guc3luYyh0aGlzLmFic29sdXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZGlyZWN0b3JpZXMgZm9yIHRoZSBmaWxlIHRoaXMgcGF0aCBwb2ludHMgdG8sIG9yIGRvIG5vdGhpbmdcbiAgICAgKiBpZiB0aGV5IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRGlyZWN0b3JpZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0aWZ5KHRoaXMuZGlyZWN0b3J5KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hdGNoaW5nUGF0aHMoY2FzZVNlbnNpdGl2ZT1udWxsKSB7XG4gICAgICAgIGxldCBhYnNvbHV0ZURpciA9IGFic29sdXRpZnkodGhpcy5kaXJlY3RvcnkpO1xuICAgICAgICBsZXQgZmlsZW5hbWVzID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmlsZW5hbWVzID0gZnMucmVhZGRpclN5bmMoYWJzb2x1dGVEaXIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTsgLy8gVE9ETzogQ2F0Y2ggcGVybWlzc2lvbnMgZXJyb3IgYW5kIGRpc3BsYXkgYSBtZXNzYWdlLlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcuZ2V0KCdmdXp6eU1hdGNoJykpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZXMgPSBmdXp6YWxkcmluLmZpbHRlcihmaWxlbmFtZXMsIHRoaXMuZnJhZ21lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FzZVNlbnNpdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlU2Vuc2l0aXZlID0gdGhpcy5oYXNDYXNlU2Vuc2l0aXZlRnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWxlbmFtZXMgPSBmaWxlbmFtZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAoZm4pID0+IG1hdGNoRnJhZ21lbnQodGhpcy5mcmFnbWVudCwgZm4sIGNhc2VTZW5zaXRpdmUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVuYW1lcyA9IGZpbGVuYW1lcy5maWx0ZXIoaXNWaXNpYmxlKVxuICAgICAgICByZXR1cm4gZmlsZW5hbWVzLm1hcCgoZm4pID0+IG5ldyBQYXRoKHRoaXMuZGlyZWN0b3J5ICsgZm4pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgbGFzdCBwYXRoIGZyYWdtZW50IGluIHRoaXMgcGF0aCBpcyBlcXVhbCB0byB0aGUgZ2l2ZW5cbiAgICAgKiBzaG9ydGN1dCBzdHJpbmcsIGFuZCB0aGUgcGF0aCBlbmRzIGluIGEgc2VwYXJhdG9yLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUsICc6LycgYW5kICcvZm9vL2Jhci86LycgaGF2ZSB0aGUgJzonIHNob3J0Y3V0LCBidXRcbiAgICAgKiAnL2Zvby9iYXI6LycgYW5kICcvYmxhaC86JyBkbyBub3QuXG4gICAgICovXG4gICAgaGFzU2hvcnRjdXQoc2hvcnRjdXQpIHtcbiAgICAgICAgc2hvcnRjdXQgPSBzaG9ydGN1dCArIHRoaXMuc2VwO1xuICAgICAgICByZXR1cm4gIXRoaXMuZnJhZ21lbnQgJiYgKFxuICAgICAgICAgICAgdGhpcy5kaXJlY3RvcnkuZW5kc1dpdGgodGhpcy5zZXAgKyBzaG9ydGN1dClcbiAgICAgICAgICAgIHx8IHRoaXMuZGlyZWN0b3J5ID09PSBzaG9ydGN1dFxuICAgICAgICApXG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyUGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mdWxsID09PSBvdGhlclBhdGguZnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHBhdGggdG8gc2hvdyBpbml0aWFsbHkgaW4gdGhlIHBhdGggaW5wdXQuXG4gICAgICovXG4gICAgc3RhdGljIGluaXRpYWwoKSB7XG4gICAgICAgIHN3aXRjaCAoY29uZmlnLmdldCgnZGVmYXVsdElucHV0VmFsdWUnKSkge1xuICAgICAgICAgICAgY2FzZSBjb25maWcuREVGQVVMVF9BQ1RJVkVfRklMRV9ESVI6XG4gICAgICAgICAgICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHN0ZFBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTm8gYnJlYWsgc28gdGhhdCB3ZSBmYWxsIGJhY2sgdG8gcHJvamVjdCByb290LlxuICAgICAgICAgICAgY2FzZSBjb25maWcuREVGQVVMVF9QUk9KRUNUX1JPT1Q6XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RQYXRoID0gZ2V0UHJvamVjdFBhdGgoKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHByb2plY3RQYXRoICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aCgnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGFyZSB0d28gcGF0aHMgbGV4aWNvZ3JhcGhpY2FsbHkuXG4gICAgICovXG4gICAgc3RhdGljIGNvbXBhcmUocGF0aDEsIHBhdGgyKSB7XG4gICAgICAgIHJldHVybiBwYXRoMS5mdWxsLmxvY2FsZUNvbXBhcmUocGF0aDIuZnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgbmV3IHBhdGggaW5zdGFuY2Ugd2l0aCB0aGUgY29tbW9uIHByZWZpeCBvZiBhbGwgdGhlXG4gICAgICogZ2l2ZW4gcGF0aHMuXG4gICAgICovXG4gICAgc3RhdGljIGNvbW1vblByZWZpeChwYXRocywgY2FzZVNlbnNpdGl2ZT1mYWxzZSkge1xuICAgICAgICBpZiAocGF0aHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdDYW5ub3QgZmluZCBjb21tb24gcHJlZml4IGZvciBsaXN0cyBzaG9ydGVyIHRoYW4gdHdvIGVsZW1lbnRzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXRocyA9IHBhdGhzLm1hcCgocGF0aCkgPT4gcGF0aC5mdWxsKS5zb3J0KCk7XG4gICAgICAgIGxldCBmaXJzdCA9IHBhdGhzWzBdO1xuICAgICAgICBsZXQgbGFzdCA9IHBhdGhzW3BhdGhzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgbGV0IHByZWZpeE1heExlbmd0aCA9IE1hdGgubWluKGZpcnN0Lmxlbmd0aCwgbGFzdC5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHByZWZpeE1heExlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3Rba10gPT09IGxhc3Rba10pIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gZmlyc3Rba107XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjYXNlU2Vuc2l0aXZlICYmIGZpcnN0W2tdLnRvTG93ZXJDYXNlKCkgPT09IGxhc3Rba10udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSBmaXJzdFtrXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aChwcmVmaXgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgZmlsZW5hbWUgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aCBmcmFnbWVudC5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hGcmFnbWVudChmcmFnbWVudCwgZmlsZW5hbWUsIGNhc2VTZW5zaXRpdmU9ZmFsc2UpIHtcbiAgICBpZiAoIWNhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgZnJhZ21lbnQgPSBmcmFnbWVudC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVuYW1lLnN0YXJ0c1dpdGgoZnJhZ21lbnQpO1xufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBmaWxlbmFtZSBpcyBub3QgaGlkZGVuIGJ5IHRoZSBpZ25vcmVkUGF0dGVybnMgY29uZmlnLlxuICovXG5mdW5jdGlvbiBpc1Zpc2libGUoZmlsZW5hbWUpIHtcbiAgICBmb3IgKGNvbnN0IGlnbm9yZWRQYXR0ZXJuIG9mIGlnbm9yZWRQYXR0ZXJucygpKSB7XG4gICAgICAgIGlmIChpZ25vcmVkUGF0dGVybi5tYXRjaChmaWxlbmFtZSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4iXX0=