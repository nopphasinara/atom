'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var versionHelper = require('./version-helper');

var SnippetsProvider = (function () {
	function SnippetsProvider() {
		_classCallCheck(this, SnippetsProvider);

		this.selector = '.text.html';
		this.disableForSelector = '.meta.tag, .string.quoted';
		this.suggestionPriority = 2;
	}

	_createClass(SnippetsProvider, [{
		key: 'getSuggestions',
		value: function getSuggestions(_ref) {
			var prefix = _ref.prefix;

			if (prefix.startsWith('fa')) {
				return this.findMatchingSuggestions(prefix);
			}
		}
	}, {
		key: 'findMatchingSuggestions',
		value: function findMatchingSuggestions(replacementPrefix) {
			var versionInfo = versionHelper.getCurrentVersionInfo();

			var matchingSnippets = versionInfo.snippets.filter(function (snippet) {
				return snippet.shortcode.startsWith(replacementPrefix);
			});

			return matchingSnippets.map(this.createSuggestion.bind(this, replacementPrefix, versionInfo));
		}
	}, {
		key: 'createSuggestion',
		value: function createSuggestion(replacementPrefix, versionInfo, snippet) {
			return {
				type: 'snippet',
				iconHTML: 'fa',
				displayText: snippet.shortcode,
				snippet: snippet.body,
				rightLabel: 'snippet',
				description: snippet.description + ' • ' + versionInfo.label,
				descriptionMoreURL: snippet.documentationURL,
				replacementPrefix: replacementPrefix // fixes double prefix bug
			};
		}
	}, {
		key: 'onDidInsertSuggestion',
		value: function onDidInsertSuggestion(_ref2) {
			var editor = _ref2.editor;

			// trigger autocomplete again so user can immediately find icon
			setTimeout(function () {
				atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate');
			}, 0);
		}
	}]);

	return SnippetsProvider;
})();

exports['default'] = new SnippetsProvider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZvbnQtYXdlc29tZS9saWIvc25pcHBldHMtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0lBRTVDLGdCQUFnQjtBQUNWLFVBRE4sZ0JBQWdCLEdBQ1A7d0JBRFQsZ0JBQWdCOztBQUVwQixNQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUM3QixNQUFJLENBQUMsa0JBQWtCLEdBQUcsMkJBQTJCLENBQUM7QUFDdEQsTUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztFQUM1Qjs7Y0FMSSxnQkFBZ0I7O1NBT1Asd0JBQUMsSUFBVSxFQUFFO09BQVYsTUFBTSxHQUFSLElBQVUsQ0FBUixNQUFNOztBQUN0QixPQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUIsV0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUM7R0FDRDs7O1NBRXNCLGlDQUFDLGlCQUFpQixFQUFFO0FBQzFDLE9BQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztBQUV4RCxPQUFJLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQy9ELFdBQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUM7O0FBRUgsVUFBTyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztHQUM5Rjs7O1NBRWUsMEJBQUMsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRTtBQUN6RCxVQUFPO0FBQ04sUUFBSSxFQUFFLFNBQVM7QUFDZixZQUFRLEVBQUUsSUFBSTtBQUNkLGVBQVcsRUFBRSxPQUFPLENBQUMsU0FBUztBQUM5QixXQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7QUFDckIsY0FBVSxFQUFFLFNBQVM7QUFDckIsZUFBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLO0FBQzVELHNCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0I7QUFDNUMscUJBQWlCLEVBQUUsaUJBQWlCO0lBQ3BDLENBQUM7R0FDRjs7O1NBRW9CLCtCQUFDLEtBQVUsRUFBRTtPQUFWLE1BQU0sR0FBUixLQUFVLENBQVIsTUFBTTs7O0FBRTdCLGFBQVUsQ0FBQyxZQUFNO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLDRCQUE0QixDQUFDLENBQUM7SUFDakYsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNOOzs7UUF6Q0ksZ0JBQWdCOzs7cUJBMkNQLElBQUksZ0JBQWdCLEVBQUUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZm9udC1hd2Vzb21lL2xpYi9zbmlwcGV0cy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCB2ZXJzaW9uSGVscGVyID0gcmVxdWlyZSgnLi92ZXJzaW9uLWhlbHBlcicpO1xuXG5jbGFzcyBTbmlwcGV0c1Byb3ZpZGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5zZWxlY3RvciA9ICcudGV4dC5odG1sJztcblx0XHR0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcubWV0YS50YWcsIC5zdHJpbmcucXVvdGVkJztcblx0XHR0aGlzLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IDI7XG5cdH1cblxuXHRnZXRTdWdnZXN0aW9ucyh7IHByZWZpeCB9KSB7XG5cdFx0aWYgKHByZWZpeC5zdGFydHNXaXRoKCdmYScpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5maW5kTWF0Y2hpbmdTdWdnZXN0aW9ucyhwcmVmaXgpO1xuXHRcdH1cblx0fVxuXG5cdGZpbmRNYXRjaGluZ1N1Z2dlc3Rpb25zKHJlcGxhY2VtZW50UHJlZml4KSB7XG5cdFx0bGV0IHZlcnNpb25JbmZvID0gdmVyc2lvbkhlbHBlci5nZXRDdXJyZW50VmVyc2lvbkluZm8oKTtcblxuXHRcdGxldCBtYXRjaGluZ1NuaXBwZXRzID0gdmVyc2lvbkluZm8uc25pcHBldHMuZmlsdGVyKChzbmlwcGV0KSA9PiB7XG5cdFx0XHRyZXR1cm4gc25pcHBldC5zaG9ydGNvZGUuc3RhcnRzV2l0aChyZXBsYWNlbWVudFByZWZpeCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gbWF0Y2hpbmdTbmlwcGV0cy5tYXAodGhpcy5jcmVhdGVTdWdnZXN0aW9uLmJpbmQodGhpcywgcmVwbGFjZW1lbnRQcmVmaXgsIHZlcnNpb25JbmZvKSk7XG5cdH1cblxuXHRjcmVhdGVTdWdnZXN0aW9uKHJlcGxhY2VtZW50UHJlZml4LCB2ZXJzaW9uSW5mbywgc25pcHBldCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiAnc25pcHBldCcsXG5cdFx0XHRpY29uSFRNTDogJ2ZhJyxcblx0XHRcdGRpc3BsYXlUZXh0OiBzbmlwcGV0LnNob3J0Y29kZSxcblx0XHRcdHNuaXBwZXQ6IHNuaXBwZXQuYm9keSxcblx0XHRcdHJpZ2h0TGFiZWw6ICdzbmlwcGV0Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiBzbmlwcGV0LmRlc2NyaXB0aW9uICsgJyDigKIgJyArIHZlcnNpb25JbmZvLmxhYmVsLFxuXHRcdFx0ZGVzY3JpcHRpb25Nb3JlVVJMOiBzbmlwcGV0LmRvY3VtZW50YXRpb25VUkwsXG5cdFx0XHRyZXBsYWNlbWVudFByZWZpeDogcmVwbGFjZW1lbnRQcmVmaXggLy8gZml4ZXMgZG91YmxlIHByZWZpeCBidWdcblx0XHR9O1xuXHR9XG5cblx0b25EaWRJbnNlcnRTdWdnZXN0aW9uKHsgZWRpdG9yIH0pIHtcblx0XHQvLyB0cmlnZ2VyIGF1dG9jb21wbGV0ZSBhZ2FpbiBzbyB1c2VyIGNhbiBpbW1lZGlhdGVseSBmaW5kIGljb25cblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdhdXRvY29tcGxldGUtcGx1czphY3RpdmF0ZScpO1xuXHRcdH0sIDApO1xuXHR9XG59XG5leHBvcnQgZGVmYXVsdCBuZXcgU25pcHBldHNQcm92aWRlcigpO1xuIl19