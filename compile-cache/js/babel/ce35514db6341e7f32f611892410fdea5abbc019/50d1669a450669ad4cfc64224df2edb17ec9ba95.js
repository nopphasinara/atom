'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var majorVersions = {
	'4': {
		icons: require('../data/v4/icons'),
		modifiers: require('../data/v4/modifiers'),
		snippets: require('../data/v4/snippets'),
		label: 'v4.7.0',
		className: 'aafa-v4',
		stylePrefixMap: {
			'': 'fa'
		},
		iconMoreRoot: 'https://fontawesome.com/v4.7.0/icon/'
	},
	'5': {
		icons: require('../data/v5/icons'),
		modifiers: require('../data/v5/modifiers'),
		snippets: require('../data/v5/snippets'),
		label: 'v5.0.8',
		className: 'aafa-v5',
		stylePrefixMap: {
			'deprecated': 'fa',
			'solid': 'fas',
			'regular': 'far',
			'brands': 'fab'
		},
		iconMoreRoot: 'https://fontawesome.com/icons/'
	}
};

var VersionHelper = (function () {
	function VersionHelper() {
		_classCallCheck(this, VersionHelper);
	}

	_createClass(VersionHelper, [{
		key: 'getCurrentVersionInfo',
		value: function getCurrentVersionInfo() {
			var version = atom.config.get('autocomplete-font-awesome.version');
			var majorVersion = version.split('.', 1)[0];
			return majorVersions[majorVersion];
		}
	}]);

	return VersionHelper;
})();

exports['default'] = new VersionHelper();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZvbnQtYXdlc29tZS9saWIvdmVyc2lvbi1oZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBTSxhQUFhLEdBQUc7QUFDckIsSUFBRyxFQUFFO0FBQ0osT0FBSyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUNsQyxXQUFTLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQzFDLFVBQVEsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDeEMsT0FBSyxFQUFFLFFBQVE7QUFDZixXQUFTLEVBQUUsU0FBUztBQUNwQixnQkFBYyxFQUFFO0FBQ2YsS0FBRSxFQUFFLElBQUk7R0FDUjtBQUNELGNBQVksRUFBRSxzQ0FBc0M7RUFDcEQ7QUFDRCxJQUFHLEVBQUU7QUFDSixPQUFLLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0FBQzVCLFdBQVMsRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUM7QUFDaEQsVUFBUSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztBQUN4QyxPQUFLLEVBQUUsUUFBUTtBQUNmLFdBQVMsRUFBRSxTQUFTO0FBQ3BCLGdCQUFjLEVBQUU7QUFDZixlQUFZLEVBQUUsSUFBSTtBQUNsQixVQUFPLEVBQUUsS0FBSztBQUNkLFlBQVMsRUFBRSxLQUFLO0FBQ2hCLFdBQVEsRUFBRSxLQUFLO0dBQ2Y7QUFDRCxjQUFZLEVBQUUsZ0NBQWdDO0VBQzlDO0NBQ0QsQ0FBQzs7SUFFSSxhQUFhO1VBQWIsYUFBYTt3QkFBYixhQUFhOzs7Y0FBYixhQUFhOztTQUNNLGlDQUFHO0FBQ3BCLE9BQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDekUsT0FBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsVUFBTyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDdEM7OztRQUxDLGFBQWE7OztxQkFPSixJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1mb250LWF3ZXNvbWUvbGliL3ZlcnNpb24taGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IG1ham9yVmVyc2lvbnMgPSB7XG5cdCc0Jzoge1xuXHRcdGljb25zOiByZXF1aXJlKCcuLi9kYXRhL3Y0L2ljb25zJyksXG5cdFx0bW9kaWZpZXJzOiByZXF1aXJlKCcuLi9kYXRhL3Y0L21vZGlmaWVycycpLFxuXHRcdHNuaXBwZXRzOiByZXF1aXJlKCcuLi9kYXRhL3Y0L3NuaXBwZXRzJyksXG5cdFx0bGFiZWw6ICd2NC43LjAnLFxuXHRcdGNsYXNzTmFtZTogJ2FhZmEtdjQnLFxuXHRcdHN0eWxlUHJlZml4TWFwOiB7XG5cdFx0XHQnJzogJ2ZhJ1xuXHRcdH0sXG5cdFx0aWNvbk1vcmVSb290OiAnaHR0cHM6Ly9mb250YXdlc29tZS5jb20vdjQuNy4wL2ljb24vJ1xuXHR9LFxuXHQnNSc6IHtcblx0XHRpY29uczogcmVxdWlyZSgnLi4vZGF0YS92NS9pY29ucycpLFxuICAgICAgICBtb2RpZmllcnM6IHJlcXVpcmUoJy4uL2RhdGEvdjUvbW9kaWZpZXJzJyksXG5cdFx0c25pcHBldHM6IHJlcXVpcmUoJy4uL2RhdGEvdjUvc25pcHBldHMnKSxcblx0XHRsYWJlbDogJ3Y1LjAuOCcsXG5cdFx0Y2xhc3NOYW1lOiAnYWFmYS12NScsXG5cdFx0c3R5bGVQcmVmaXhNYXA6IHtcblx0XHRcdCdkZXByZWNhdGVkJzogJ2ZhJyxcblx0XHRcdCdzb2xpZCc6ICdmYXMnLFxuXHRcdFx0J3JlZ3VsYXInOiAnZmFyJyxcblx0XHRcdCdicmFuZHMnOiAnZmFiJ1xuXHRcdH0sXG5cdFx0aWNvbk1vcmVSb290OiAnaHR0cHM6Ly9mb250YXdlc29tZS5jb20vaWNvbnMvJ1xuXHR9XG59O1xuXG5jbGFzcyBWZXJzaW9uSGVscGVyIHtcbiAgICBnZXRDdXJyZW50VmVyc2lvbkluZm8oKSB7XG4gICAgICAgIGxldCB2ZXJzaW9uID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtZm9udC1hd2Vzb21lLnZlcnNpb24nKTtcblx0XHRsZXQgbWFqb3JWZXJzaW9uID0gdmVyc2lvbi5zcGxpdCgnLicsIDEpWzBdO1xuICAgICAgICByZXR1cm4gbWFqb3JWZXJzaW9uc1ttYWpvclZlcnNpb25dO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IG5ldyBWZXJzaW9uSGVscGVyKCk7XG4iXX0=