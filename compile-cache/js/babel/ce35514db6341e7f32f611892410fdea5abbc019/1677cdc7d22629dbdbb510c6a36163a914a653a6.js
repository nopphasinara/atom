Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

/**
 * @class Handles the mapping between projects and their package.json deps
 */
'use babel';

var ProjectDeps = (function () {
    function ProjectDeps() {
        _classCallCheck(this, ProjectDeps);

        this._deps = Object.create(null);
    }

    _createClass(ProjectDeps, [{
        key: 'clear',
        value: function clear() {
            this._deps = Object.create(null);
        }
    }, {
        key: 'set',
        value: function set(rootPath, deps) {
            this._deps[rootPath] = deps;
        }
    }, {
        key: 'hasDeps',
        value: function hasDeps(rootPath) {
            return rootPath in this._deps;
        }
    }, {
        key: 'search',
        value: function search(currPath, keyword) {
            var rootPaths = Object.keys(this._deps);
            var pathDeps = [];

            for (var i = 0; i < rootPaths.length; i++) {
                // for the current path to be a child of root, it must start with rootpath
                if ((0, _utils.startsWith)(currPath, rootPaths[i])) {
                    pathDeps = this._deps[rootPaths[i]];
                    break;
                }
            }

            return pathDeps.filter(function (d) {
                return (0, _utils.startsWith)(d, keyword);
            });
        }
    }]);

    return ProjectDeps;
})();

exports['default'] = ProjectDeps;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvcHJvamVjdC1kZXBzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUN5QixTQUFTOzs7OztBQURsQyxXQUFXLENBQUM7O0lBTVMsV0FBVztBQUNqQixhQURNLFdBQVcsR0FDZDs4QkFERyxXQUFXOztBQUV4QixZQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEM7O2lCQUhnQixXQUFXOztlQUt2QixpQkFBRztBQUNKLGdCQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7OztlQUVFLGFBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtBQUNoQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDL0I7OztlQUVNLGlCQUFDLFFBQVEsRUFBRTtBQUNkLG1CQUFPLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ2pDOzs7ZUFFSyxnQkFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3RCLGdCQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxnQkFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVsQixpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRXZDLG9CQUFJLHVCQUFXLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNwQyw0QkFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsMEJBQU07aUJBQ1Q7YUFDSjs7QUFFRCxtQkFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzt1QkFBSSx1QkFBVyxDQUFDLEVBQUUsT0FBTyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1NBQ3ZEOzs7V0E5QmdCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvcHJvamVjdC1kZXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQge3N0YXJ0c1dpdGh9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEBjbGFzcyBIYW5kbGVzIHRoZSBtYXBwaW5nIGJldHdlZW4gcHJvamVjdHMgYW5kIHRoZWlyIHBhY2thZ2UuanNvbiBkZXBzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3REZXBzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZGVwcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX2RlcHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cblxuICAgIHNldChyb290UGF0aCwgZGVwcykge1xuICAgICAgICB0aGlzLl9kZXBzW3Jvb3RQYXRoXSA9IGRlcHM7XG4gICAgfVxuXG4gICAgaGFzRGVwcyhyb290UGF0aCkge1xuICAgICAgICByZXR1cm4gcm9vdFBhdGggaW4gdGhpcy5fZGVwcztcbiAgICB9XG5cbiAgICBzZWFyY2goY3VyclBhdGgsIGtleXdvcmQpIHtcbiAgICAgICAgY29uc3Qgcm9vdFBhdGhzID0gT2JqZWN0LmtleXModGhpcy5fZGVwcyk7XG4gICAgICAgIGxldCBwYXRoRGVwcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9vdFBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBmb3IgdGhlIGN1cnJlbnQgcGF0aCB0byBiZSBhIGNoaWxkIG9mIHJvb3QsIGl0IG11c3Qgc3RhcnQgd2l0aCByb290cGF0aFxuICAgICAgICAgICAgaWYgKHN0YXJ0c1dpdGgoY3VyclBhdGgsIHJvb3RQYXRoc1tpXSkpIHtcbiAgICAgICAgICAgICAgICBwYXRoRGVwcyA9IHRoaXMuX2RlcHNbcm9vdFBhdGhzW2ldXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoRGVwcy5maWx0ZXIoZCA9PiBzdGFydHNXaXRoKGQsIGtleXdvcmQpKTtcbiAgICB9XG59XG4iXX0=