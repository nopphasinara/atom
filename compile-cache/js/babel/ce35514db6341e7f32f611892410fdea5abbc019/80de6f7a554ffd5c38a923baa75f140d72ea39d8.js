Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.cachedProperty = cachedProperty;
exports.getProjectPath = getProjectPath;
exports.preferredSeparatorFor = preferredSeparatorFor;
exports.defineImmutable = defineImmutable;
exports.absolutify = absolutify;
exports.dom = dom;
exports.closest = closest;
exports.getOrUpdateStringMap = getOrUpdateStringMap;
exports.ignoredPatterns = ignoredPatterns;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stringmap = require('stringmap');

var _stringmap2 = _interopRequireDefault(_stringmap);

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

/**
 * Generates the return value for the wrapper property on first access
 * and caches it on the object. All future calls return the cached value
 * instead of re-calculating it.
 */

function cachedProperty(target, key, descriptor) {
    var getter = descriptor.get;
    var cached_key = Symbol(key + '_cached');

    descriptor.get = function () {
        if (this[cached_key] === undefined) {
            Object.defineProperty(this, cached_key, {
                value: getter.call(this),
                writable: false,
                enumerable: false
            });
        }
        return this[cached_key];
    };

    return descriptor;
}

/**
 * Get the path to the current project directory. For now this just uses
 * the first directory in the list. Return null if there are no project
 * directories.
 *
 * TODO: Support more than just the first.
 */

function getProjectPath() {
    var projectPaths = atom.project.getPaths();
    if (projectPaths.length > 0) {
        return projectPaths[0];
    } else {
        return null;
    }
}

/**
 * Get the preferred path separator for the given string based on the
 * first path separator detected.
 */

function preferredSeparatorFor(path) {
    var forwardIndex = path.indexOf('/');
    var backIndex = path.indexOf('\\');

    if (backIndex === -1 && forwardIndex === -1) {
        return _path2['default'].sep;
    } else if (forwardIndex === -1) {
        return '\\';
    } else if (backIndex === -1) {
        return '/';
    } else if (forwardIndex < backIndex) {
        return '/';
    } else {
        return '\\';
    }
}

/**
 * Define an immutable property on an object.
 */

function defineImmutable(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        writable: false,
        enumerable: true
    });
}

/**
 * Turn the given path into an absolute path if necessary. Paths are
 * considered relative to the project root.
 */

function absolutify(path) {
    // If we start with a tilde, just replace it with the home dir.
    var sep = preferredSeparatorFor(path);
    if (path.startsWith('~' + sep)) {
        return _osenv2['default'].home() + sep + path.slice(2);
    }

    // If the path doesn't start with a separator, it's relative to the
    // project root.
    if (!path.startsWith(sep)) {
        var relativeBases = [];
        var projectPath = getProjectPath();
        if (projectPath) {
            relativeBases.push(projectPath);
        }

        return _path2['default'].resolve.apply(_path2['default'], relativeBases.concat([path]));
    }

    // Otherwise it was absolute already.
    return path;
}

/**
 * Parse the given string as HTML and return DOM nodes. Assumes a root
 * DOM node because, well, that's all I use it for.
 */

function dom(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

/**
 * Starts at the current DOM element and moves upward in the DOM tree
 * until an element matching the given selector is found.
 *
 * Intended to be bound to DOM elements like so:
 * domNode::closest('selector');
 */

function closest(selector) {
    if (this.matches && this.matches(selector)) {
        return this;
    } else if (this.parentNode) {
        var _context;

        return (_context = this.parentNode, closest).call(_context, selector);
    } else {
        return null;
    }
}

/**
 * Return value from StringMap if exists
 * otherwise generate value with getValue, set the StringMap and return
 */

function getOrUpdateStringMap(stringMap, key, getValue) {
    if (stringMap.has(key)) {
        return stringMap.get(key);
    }
    var value = getValue(key);
    stringMap.set(key, value);
    return value;
}

/**
 * Returns an array of Minimatch instances to test whether a filename
 * is ignored. Cache the Minimatch instances instead of re-compiling
 * the regexp.
 */
var _minimatchesCache = (0, _stringmap2['default'])();

function ignoredPatterns() {
    var ignoredGlobs = config.get('ignoredPatterns');
    return ignoredGlobs.map(function (glob) {
        return getOrUpdateStringMap(_minimatchesCache, glob, function (glob) {
            return new _minimatch2['default'].Minimatch(glob);
        });
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUVzQixXQUFXOzs7O29CQUNiLE1BQU07Ozs7eUJBQ0osV0FBVzs7OztxQkFFZixPQUFPOzs7O3NCQUVELFVBQVU7O0lBQXRCLE1BQU07Ozs7Ozs7O0FBUVgsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDcEQsUUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztBQUM1QixRQUFJLFVBQVUsR0FBRyxNQUFNLENBQUksR0FBRyxhQUFVLENBQUM7O0FBRXpDLGNBQVUsQ0FBQyxHQUFHLEdBQUcsWUFBVztBQUN4QixZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDaEMsa0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUNwQyxxQkFBSyxFQUFFLEFBQU0sTUFBTSxNQUFaLElBQUksQ0FBVTtBQUNyQix3QkFBUSxFQUFFLEtBQUs7QUFDZiwwQkFBVSxFQUFFLEtBQUs7YUFDcEIsQ0FBQyxDQUFDO1NBQ047QUFDRCxlQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMzQixDQUFDOztBQUVGLFdBQU8sVUFBVSxDQUFDO0NBQ3JCOzs7Ozs7Ozs7O0FBVU0sU0FBUyxjQUFjLEdBQUc7QUFDN0IsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQyxRQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLGVBQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFCLE1BQU07QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmO0NBQ0o7Ozs7Ozs7QUFPTSxTQUFTLHFCQUFxQixDQUFDLElBQUksRUFB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LFdBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7Ozs7QUFPRCxJQUFJLGlCQUFpQixHQUFHLDZCQUFXLENBQUM7O0FBQzdCLFNBQVMsZUFBZSxHQUFHO0FBQzlCLFFBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNsRCxXQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJO2VBQUssb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLFVBQUMsSUFBSTttQkFDbEYsSUFBSSx1QkFBVSxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQztLQUFBLENBQUMsQ0FBQTtDQUNyQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBzdGRQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFN0cmluZ01hcCBmcm9tICdzdHJpbmdtYXAnO1xuXG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuXG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSByZXR1cm4gdmFsdWUgZm9yIHRoZSB3cmFwcGVyIHByb3BlcnR5IG9uIGZpcnN0IGFjY2Vzc1xuICogYW5kIGNhY2hlcyBpdCBvbiB0aGUgb2JqZWN0LiBBbGwgZnV0dXJlIGNhbGxzIHJldHVybiB0aGUgY2FjaGVkIHZhbHVlXG4gKiBpbnN0ZWFkIG9mIHJlLWNhbGN1bGF0aW5nIGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FjaGVkUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBsZXQgZ2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgbGV0IGNhY2hlZF9rZXkgPSBTeW1ib2woYCR7a2V5fV9jYWNoZWRgKTtcblxuICAgIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzW2NhY2hlZF9rZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBjYWNoZWRfa2V5LCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXM6OmdldHRlcigpLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW2NhY2hlZF9rZXldO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgY3VycmVudCBwcm9qZWN0IGRpcmVjdG9yeS4gRm9yIG5vdyB0aGlzIGp1c3QgdXNlc1xuICogdGhlIGZpcnN0IGRpcmVjdG9yeSBpbiB0aGUgbGlzdC4gUmV0dXJuIG51bGwgaWYgdGhlcmUgYXJlIG5vIHByb2plY3RcbiAqIGRpcmVjdG9yaWVzLlxuICpcbiAqIFRPRE86IFN1cHBvcnQgbW9yZSB0aGFuIGp1c3QgdGhlIGZpcnN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdFBhdGgoKSB7XG4gICAgbGV0IHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGlmIChwcm9qZWN0UGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcHJvamVjdFBhdGhzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEdldCB0aGUgcHJlZmVycmVkIHBhdGggc2VwYXJhdG9yIGZvciB0aGUgZ2l2ZW4gc3RyaW5nIGJhc2VkIG9uIHRoZVxuICogZmlyc3QgcGF0aCBzZXBhcmF0b3IgZGV0ZWN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXJyZWRTZXBhcmF0b3JGb3IocGF0aCkge1xuICAgIGxldCBmb3J3YXJkSW5kZXggPSBwYXRoLmluZGV4T2YoJy8nKTtcbiAgICBsZXQgYmFja0luZGV4ID0gcGF0aC5pbmRleE9mKCdcXFxcJyk7XG5cbiAgICBpZiAoYmFja0luZGV4ID09PSAtMSAmJiBmb3J3YXJkSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBzdGRQYXRoLnNlcDtcbiAgICB9IGVsc2UgaWYgKGZvcndhcmRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICdcXFxcJztcbiAgICB9IGVsc2UgaWYgKGJhY2tJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICcvJztcbiAgICB9IGVsc2UgaWYgKGZvcndhcmRJbmRleCA8IGJhY2tJbmRleCkge1xuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnXFxcXCc7XG4gICAgfVxufVxuXG5cbi8qKlxuICogRGVmaW5lIGFuIGltbXV0YWJsZSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVJbW11dGFibGUob2JqLCBuYW1lLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgfSk7XG59XG5cblxuLyoqXG4gKiBUdXJuIHRoZSBnaXZlbiBwYXRoIGludG8gYW4gYWJzb2x1dGUgcGF0aCBpZiBuZWNlc3NhcnkuIFBhdGhzIGFyZVxuICogY29uc2lkZXJlZCByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWJzb2x1dGlmeShwYXRoKSB7XG4gICAgLy8gSWYgd2Ugc3RhcnQgd2l0aCBhIHRpbGRlLCBqdXN0IHJlcGxhY2UgaXQgd2l0aCB0aGUgaG9tZSBkaXIuXG4gICAgbGV0IHNlcCA9IHByZWZlcnJlZFNlcGFyYXRvckZvcihwYXRoKTtcbiAgICBpZiAocGF0aC5zdGFydHNXaXRoKCd+JyArIHNlcCkpIHtcbiAgICAgICAgcmV0dXJuIG9zZW52LmhvbWUoKSArIHNlcCArIHBhdGguc2xpY2UoMik7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHBhdGggZG9lc24ndCBzdGFydCB3aXRoIGEgc2VwYXJhdG9yLCBpdCdzIHJlbGF0aXZlIHRvIHRoZVxuICAgIC8vIHByb2plY3Qgcm9vdC5cbiAgICBpZiAoIXBhdGguc3RhcnRzV2l0aChzZXApKSB7XG4gICAgICAgIGxldCByZWxhdGl2ZUJhc2VzID0gW107XG4gICAgICAgIGxldCBwcm9qZWN0UGF0aCA9IGdldFByb2plY3RQYXRoKCk7XG4gICAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICAgICAgcmVsYXRpdmVCYXNlcy5wdXNoKHByb2plY3RQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGRQYXRoLnJlc29sdmUoLi4ucmVsYXRpdmVCYXNlcywgcGF0aCk7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIGl0IHdhcyBhYnNvbHV0ZSBhbHJlYWR5LlxuICAgIHJldHVybiBwYXRoO1xufVxuXG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHN0cmluZyBhcyBIVE1MIGFuZCByZXR1cm4gRE9NIG5vZGVzLiBBc3N1bWVzIGEgcm9vdFxuICogRE9NIG5vZGUgYmVjYXVzZSwgd2VsbCwgdGhhdCdzIGFsbCBJIHVzZSBpdCBmb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb20oaHRtbCkge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5cbi8qKlxuICogU3RhcnRzIGF0IHRoZSBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBtb3ZlcyB1cHdhcmQgaW4gdGhlIERPTSB0cmVlXG4gKiB1bnRpbCBhbiBlbGVtZW50IG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvciBpcyBmb3VuZC5cbiAqXG4gKiBJbnRlbmRlZCB0byBiZSBib3VuZCB0byBET00gZWxlbWVudHMgbGlrZSBzbzpcbiAqIGRvbU5vZGU6OmNsb3Nlc3QoJ3NlbGVjdG9yJyk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG4gICAgaWYgKHRoaXMubWF0Y2hlcyAmJiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudE5vZGU6OmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIFJldHVybiB2YWx1ZSBmcm9tIFN0cmluZ01hcCBpZiBleGlzdHNcbiAqIG90aGVyd2lzZSBnZW5lcmF0ZSB2YWx1ZSB3aXRoIGdldFZhbHVlLCBzZXQgdGhlIFN0cmluZ01hcCBhbmQgcmV0dXJuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPclVwZGF0ZVN0cmluZ01hcChzdHJpbmdNYXAsIGtleSwgZ2V0VmFsdWUpIHtcbiAgaWYgKHN0cmluZ01hcC5oYXMoa2V5KSApIHtcbiAgICByZXR1cm4gc3RyaW5nTWFwLmdldChrZXkpO1xuICB9XG4gIGNvbnN0IHZhbHVlID0gZ2V0VmFsdWUoa2V5KTtcbiAgc3RyaW5nTWFwLnNldChrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgTWluaW1hdGNoIGluc3RhbmNlcyB0byB0ZXN0IHdoZXRoZXIgYSBmaWxlbmFtZVxuICogaXMgaWdub3JlZC4gQ2FjaGUgdGhlIE1pbmltYXRjaCBpbnN0YW5jZXMgaW5zdGVhZCBvZiByZS1jb21waWxpbmdcbiAqIHRoZSByZWdleHAuXG4gKi9cbmxldCBfbWluaW1hdGNoZXNDYWNoZSA9IFN0cmluZ01hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZWRQYXR0ZXJucygpIHtcbiAgICBjb25zdCBpZ25vcmVkR2xvYnMgPSBjb25maWcuZ2V0KCdpZ25vcmVkUGF0dGVybnMnKVxuICAgIHJldHVybiBpZ25vcmVkR2xvYnMubWFwKChnbG9iKSA9PiBnZXRPclVwZGF0ZVN0cmluZ01hcChfbWluaW1hdGNoZXNDYWNoZSwgZ2xvYiwgKGdsb2IpID0+XG4gICAgICAgbmV3IG1pbmltYXRjaC5NaW5pbWF0Y2goZ2xvYikpKVxufVxuIl19