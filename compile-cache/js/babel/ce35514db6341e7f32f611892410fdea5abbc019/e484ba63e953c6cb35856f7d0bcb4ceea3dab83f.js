'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var versionHelper = require('./version-helper');

var ModifiersProvider = (function () {
	function ModifiersProvider() {
		_classCallCheck(this, ModifiersProvider);

		this.selector = '*';
		this.suggestionPriority = 2;
	}

	_createClass(ModifiersProvider, [{
		key: 'getSuggestions',
		value: function getSuggestions(_ref) {
			var prefix = _ref.prefix;

			if (prefix.startsWith('fa-')) {
				return this.findMatchingSuggestions(prefix);
			}
		}
	}, {
		key: 'findMatchingSuggestions',
		value: function findMatchingSuggestions(replacementPrefix) {
			var versionInfo = versionHelper.getCurrentVersionInfo();

			var prefixBase = replacementPrefix.replace(/^fa-/, '');
			var matchingModifiers = versionInfo.modifiers.filter(function (modifier) {
				return modifier.id.startsWith(prefixBase);
			});

			var createSuggestion = this.createSuggestion.bind(this, replacementPrefix, prefixBase, versionInfo);
			return matchingModifiers.map(createSuggestion);
		}
	}, {
		key: 'createSuggestion',
		value: function createSuggestion(replacementPrefix, prefixBase, versionInfo, modifier) {
			return {
				type: 'value',
				iconHTML: 'fa',
				text: 'fa-' + modifier.id,
				rightLabel: 'modifier',
				description: modifier.description + ' • ' + versionInfo.label,
				descriptionMoreURL: modifier.documentationURL,
				replacementPrefix: replacementPrefix // fixes double prefix bug
			};
		}
	}]);

	return ModifiersProvider;
})();

exports['default'] = new ModifiersProvider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZvbnQtYXdlc29tZS9saWIvbW9kaWZpZXJzLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUU1QyxpQkFBaUI7QUFDWCxVQUROLGlCQUFpQixHQUNSO3dCQURULGlCQUFpQjs7QUFFckIsTUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDcEIsTUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztFQUM1Qjs7Y0FKSSxpQkFBaUI7O1NBTVIsd0JBQUMsSUFBVSxFQUFFO09BQVYsTUFBTSxHQUFSLElBQVUsQ0FBUixNQUFNOztBQUN0QixPQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0IsV0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUM7R0FDRDs7O1NBRXNCLGlDQUFDLGlCQUFpQixFQUFFO0FBQzFDLE9BQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztBQUV4RCxPQUFJLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELE9BQUksaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDbEUsV0FBTyxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUM7O0FBRUgsT0FBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDcEcsVUFBTyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztHQUMvQzs7O1NBRWUsMEJBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUU7QUFDdEUsVUFBTztBQUNOLFFBQUksRUFBRSxPQUFPO0FBQ2IsWUFBUSxFQUFFLElBQUk7QUFDZCxRQUFJLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFO0FBQ3pCLGNBQVUsRUFBRSxVQUFVO0FBQ3RCLGVBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSztBQUM3RCxzQkFBa0IsRUFBRSxRQUFRLENBQUMsZ0JBQWdCO0FBQzdDLHFCQUFpQixFQUFFLGlCQUFpQjtJQUNwQyxDQUFDO0dBQ0Y7OztRQWxDSSxpQkFBaUI7OztxQkFvQ1IsSUFBSSxpQkFBaUIsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1mb250LWF3ZXNvbWUvbGliL21vZGlmaWVycy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCB2ZXJzaW9uSGVscGVyID0gcmVxdWlyZSgnLi92ZXJzaW9uLWhlbHBlcicpO1xuXG5jbGFzcyBNb2RpZmllcnNQcm92aWRlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuc2VsZWN0b3IgPSAnKic7XG5cdFx0dGhpcy5zdWdnZXN0aW9uUHJpb3JpdHkgPSAyO1xuXHR9XG5cblx0Z2V0U3VnZ2VzdGlvbnMoeyBwcmVmaXggfSkge1xuXHRcdGlmIChwcmVmaXguc3RhcnRzV2l0aCgnZmEtJykpIHtcblx0XHRcdHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1N1Z2dlc3Rpb25zKHByZWZpeCk7XG5cdFx0fVxuXHR9XG5cblx0ZmluZE1hdGNoaW5nU3VnZ2VzdGlvbnMocmVwbGFjZW1lbnRQcmVmaXgpIHtcblx0XHRsZXQgdmVyc2lvbkluZm8gPSB2ZXJzaW9uSGVscGVyLmdldEN1cnJlbnRWZXJzaW9uSW5mbygpO1xuXG5cdFx0bGV0IHByZWZpeEJhc2UgPSByZXBsYWNlbWVudFByZWZpeC5yZXBsYWNlKC9eZmEtLywgJycpO1xuXHRcdGxldCBtYXRjaGluZ01vZGlmaWVycyA9IHZlcnNpb25JbmZvLm1vZGlmaWVycy5maWx0ZXIoKG1vZGlmaWVyKSA9PiB7XG5cdFx0XHRyZXR1cm4gbW9kaWZpZXIuaWQuc3RhcnRzV2l0aChwcmVmaXhCYXNlKTtcblx0XHR9KTtcblxuXHRcdGxldCBjcmVhdGVTdWdnZXN0aW9uID0gdGhpcy5jcmVhdGVTdWdnZXN0aW9uLmJpbmQodGhpcywgcmVwbGFjZW1lbnRQcmVmaXgsIHByZWZpeEJhc2UsIHZlcnNpb25JbmZvKTtcblx0XHRyZXR1cm4gbWF0Y2hpbmdNb2RpZmllcnMubWFwKGNyZWF0ZVN1Z2dlc3Rpb24pO1xuXHR9XG5cblx0Y3JlYXRlU3VnZ2VzdGlvbihyZXBsYWNlbWVudFByZWZpeCwgcHJlZml4QmFzZSwgdmVyc2lvbkluZm8sIG1vZGlmaWVyKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICd2YWx1ZScsXG5cdFx0XHRpY29uSFRNTDogJ2ZhJyxcblx0XHRcdHRleHQ6ICdmYS0nICsgbW9kaWZpZXIuaWQsXG5cdFx0XHRyaWdodExhYmVsOiAnbW9kaWZpZXInLFxuXHRcdFx0ZGVzY3JpcHRpb246IG1vZGlmaWVyLmRlc2NyaXB0aW9uICsgJyDigKIgJyArIHZlcnNpb25JbmZvLmxhYmVsLFxuXHRcdFx0ZGVzY3JpcHRpb25Nb3JlVVJMOiBtb2RpZmllci5kb2N1bWVudGF0aW9uVVJMLFxuXHRcdFx0cmVwbGFjZW1lbnRQcmVmaXg6IHJlcGxhY2VtZW50UHJlZml4IC8vIGZpeGVzIGRvdWJsZSBwcmVmaXggYnVnXG5cdFx0fTtcblx0fVxufVxuZXhwb3J0IGRlZmF1bHQgbmV3IE1vZGlmaWVyc1Byb3ZpZGVyKCk7XG4iXX0=