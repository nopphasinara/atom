Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var UrlReplace = (function () {
	function UrlReplace() {
		_classCallCheck(this, UrlReplace);

		var repo = this.getRepositoryForActiveItem() || this.getRepositoryForProject();
		this.repoInfo = this.parseUrl(repo ? repo.getOriginURL() : null);
		this.info = {
			'repo-name': this.repoInfo.name,
			'repo-owner': this.repoInfo.owner,
			'atom-version': atom.getVersion()
		};
	}

	_createClass(UrlReplace, [{
		key: 'replace',
		value: function replace(url) {
			var re = /({[^}]*})/;

			var m = re.exec(url);
			while (m) {
				var _m = m;

				var _m2 = _slicedToArray(_m, 1);

				var matchedText = _m2[0];

				// eslint-disable-next-line no-param-reassign
				url = url.replace(m[0], this.getInfo(matchedText));

				m = re.exec(url);
			}

			return url;
		}
	}, {
		key: 'getInfo',
		value: function getInfo(key) {
			// eslint-disable-next-line no-param-reassign
			key = key.replace(/{([^}]*)}/, '$1');
			if (key in this.info) {
				return this.info[key];
			}

			return key;
		}
	}, {
		key: 'getRepositoryForActiveItem',
		value: function getRepositoryForActiveItem() {
			var item = atom.workspace.getActivePaneItem();
			var path = item && item.getPath && item.getPath();
			if (!path) {
				return;
			}

			var _atom$project$relativizePath = atom.project.relativizePath(path);

			var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

			var rootDir = _atom$project$relativizePath2[0];

			var rootDirIndex = atom.project.getPaths().indexOf(rootDir);
			if (rootDirIndex >= 0) {
				return atom.project.getRepositories()[rootDirIndex];
			}
		}
	}, {
		key: 'getRepositoryForProject',
		value: function getRepositoryForProject() {
			for (var repo of atom.project.getRepositories()) {
				if (repo) {
					return repo;
				}
			}
		}
	}, {
		key: 'parseUrl',
		value: function parseUrl(url) {
			var repoInfo = {
				owner: '',
				name: ''
			};

			if (!url) {
				return repoInfo;
			}

			var re = undefined;
			if (url.indexOf('http' >= 0)) {
				re = /github\.com\/([^/]*)\/([^/]*)\.git/;
			}
			if (url.indexOf('git@') >= 0) {
				re = /:([^/]*)\/([^/]*)\.git/;
			}
			var m = re.exec(url);

			if (m) {
				return { owner: m[1], name: m[2] };
			}

			return repoInfo;
		}
	}]);

	return UrlReplace;
})();

exports['default'] = UrlReplace;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9mbGV4LXRvb2wtYmFyL2xpYi91cmwtcmVwbGFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFcUIsVUFBVTtBQUNuQixVQURTLFVBQVUsR0FDaEI7d0JBRE0sVUFBVTs7QUFFN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7QUFDakYsTUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDakUsTUFBSSxDQUFDLElBQUksR0FBRztBQUNYLGNBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7QUFDL0IsZUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSztBQUNqQyxpQkFBYyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUU7R0FDakMsQ0FBQztFQUNGOztjQVRtQixVQUFVOztTQVd2QixpQkFBQyxHQUFHLEVBQUU7QUFDWixPQUFNLEVBQUUsR0FBRyxXQUFXLENBQUM7O0FBRXZCLE9BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsVUFBTyxDQUFDLEVBQUU7YUFDYSxDQUFDOzs7O1FBQWhCLFdBQVc7OztBQUVsQixPQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOztBQUVuRCxLQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQjs7QUFFRCxVQUFPLEdBQUcsQ0FBQztHQUNYOzs7U0FFTSxpQkFBQyxHQUFHLEVBQUU7O0FBRVosTUFBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLE9BQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDckIsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCOztBQUVELFVBQU8sR0FBRyxDQUFDO0dBQ1g7OztTQUV5QixzQ0FBRztBQUM1QixPQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDaEQsT0FBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BELE9BQUksQ0FBQyxJQUFJLEVBQUU7QUFDVixXQUFPO0lBQ1A7O3NDQUNpQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7Ozs7T0FBNUMsT0FBTzs7QUFDZCxPQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5RCxPQUFJLFlBQVksSUFBSSxDQUFDLEVBQUU7QUFDdEIsV0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BEO0dBQ0Q7OztTQUVzQixtQ0FBRztBQUN6QixRQUFLLElBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUU7QUFDbEQsUUFBSSxJQUFJLEVBQUU7QUFDVCxZQUFPLElBQUksQ0FBQztLQUNaO0lBQ0Q7R0FDRDs7O1NBRU8sa0JBQUMsR0FBRyxFQUFFO0FBQ2IsT0FBTSxRQUFRLEdBQUc7QUFDaEIsU0FBSyxFQUFFLEVBQUU7QUFDVCxRQUFJLEVBQUUsRUFBRTtJQUNSLENBQUM7O0FBRUYsT0FBSSxDQUFDLEdBQUcsRUFBRTtBQUNULFdBQU8sUUFBUSxDQUFDO0lBQ2hCOztBQUVELE9BQUksRUFBRSxZQUFBLENBQUM7QUFDUCxPQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzdCLE1BQUUsR0FBRyxvQ0FBb0MsQ0FBQztJQUMxQztBQUNELE9BQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDN0IsTUFBRSxHQUFHLHdCQUF3QixDQUFDO0lBQzlCO0FBQ0QsT0FBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsT0FBSSxDQUFDLEVBQUU7QUFDTixXQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDakM7O0FBRUQsVUFBTyxRQUFRLENBQUM7R0FDaEI7OztRQWpGbUIsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvbGliL3VybC1yZXBsYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcmxSZXBsYWNlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Y29uc3QgcmVwbyA9IHRoaXMuZ2V0UmVwb3NpdG9yeUZvckFjdGl2ZUl0ZW0oKSB8fCB0aGlzLmdldFJlcG9zaXRvcnlGb3JQcm9qZWN0KCk7XG5cdFx0dGhpcy5yZXBvSW5mbyA9IHRoaXMucGFyc2VVcmwocmVwbyA/IHJlcG8uZ2V0T3JpZ2luVVJMKCkgOiBudWxsKTtcblx0XHR0aGlzLmluZm8gPSB7XG5cdFx0XHQncmVwby1uYW1lJzogdGhpcy5yZXBvSW5mby5uYW1lLFxuXHRcdFx0J3JlcG8tb3duZXInOiB0aGlzLnJlcG9JbmZvLm93bmVyLFxuXHRcdFx0J2F0b20tdmVyc2lvbic6IGF0b20uZ2V0VmVyc2lvbigpLFxuXHRcdH07XG5cdH1cblxuXHRyZXBsYWNlKHVybCkge1xuXHRcdGNvbnN0IHJlID0gLyh7W159XSp9KS87XG5cblx0XHRsZXQgbSA9IHJlLmV4ZWModXJsKTtcblx0XHR3aGlsZSAobSkge1xuXHRcdFx0Y29uc3QgW21hdGNoZWRUZXh0XSA9IG07XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKG1bMF0sIHRoaXMuZ2V0SW5mbyhtYXRjaGVkVGV4dCkpO1xuXG5cdFx0XHRtID0gcmUuZXhlYyh1cmwpO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH1cblxuXHRnZXRJbmZvKGtleSkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRrZXkgPSBrZXkucmVwbGFjZSgveyhbXn1dKil9LywgJyQxJyk7XG5cdFx0aWYgKGtleSBpbiB0aGlzLmluZm8pIHtcblx0XHRcdHJldHVybiB0aGlzLmluZm9ba2V5XTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga2V5O1xuXHR9XG5cblx0Z2V0UmVwb3NpdG9yeUZvckFjdGl2ZUl0ZW0oKSB7XG5cdFx0Y29uc3QgaXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cdFx0Y29uc3QgcGF0aCA9IGl0ZW0gJiYgaXRlbS5nZXRQYXRoICYmIGl0ZW0uZ2V0UGF0aCgpO1xuXHRcdGlmICghcGF0aCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBbcm9vdERpcl0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aCk7XG5cdFx0Y29uc3Qgcm9vdERpckluZGV4ID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuaW5kZXhPZihyb290RGlyKTtcblx0XHRpZiAocm9vdERpckluZGV4ID49IDApIHtcblx0XHRcdHJldHVybiBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbcm9vdERpckluZGV4XTtcblx0XHR9XG5cdH1cblxuXHRnZXRSZXBvc2l0b3J5Rm9yUHJvamVjdCgpIHtcblx0XHRmb3IgKGNvbnN0IHJlcG8gb2YgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpKSB7XG5cdFx0XHRpZiAocmVwbykge1xuXHRcdFx0XHRyZXR1cm4gcmVwbztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwYXJzZVVybCh1cmwpIHtcblx0XHRjb25zdCByZXBvSW5mbyA9IHtcblx0XHRcdG93bmVyOiAnJyxcblx0XHRcdG5hbWU6ICcnLFxuXHRcdH07XG5cblx0XHRpZiAoIXVybCkge1xuXHRcdFx0cmV0dXJuIHJlcG9JbmZvO1xuXHRcdH1cblxuXHRcdGxldCByZTtcblx0XHRpZiAodXJsLmluZGV4T2YoJ2h0dHAnID49IDApKSB7XG5cdFx0XHRyZSA9IC9naXRodWJcXC5jb21cXC8oW14vXSopXFwvKFteL10qKVxcLmdpdC87XG5cdFx0fVxuXHRcdGlmICh1cmwuaW5kZXhPZignZ2l0QCcpID49IDApIHtcblx0XHRcdHJlID0gLzooW14vXSopXFwvKFteL10qKVxcLmdpdC87XG5cdFx0fVxuXHRcdGNvbnN0IG0gPSByZS5leGVjKHVybCk7XG5cblx0XHRpZiAobSkge1xuXHRcdFx0cmV0dXJuIHtvd25lcjogbVsxXSwgbmFtZTogbVsyXX07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlcG9JbmZvO1xuXHR9XG59XG4iXX0=