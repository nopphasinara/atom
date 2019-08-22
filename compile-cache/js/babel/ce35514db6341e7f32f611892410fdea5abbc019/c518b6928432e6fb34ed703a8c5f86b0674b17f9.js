'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var versionHelper = require('./version-helper');

var IconsProvider = (function () {
	function IconsProvider() {
		_classCallCheck(this, IconsProvider);

		this.selector = '*';
		this.suggestionPriority = 2;
	}

	_createClass(IconsProvider, [{
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
			var _this = this;

			var versionInfo = versionHelper.getCurrentVersionInfo();

			var prefixBase = replacementPrefix.replace(/^fa-/, '');
			var matchingIcons = versionInfo.icons.filter(function (icon) {
				var isIdMatch = icon.id.startsWith(prefixBase);
				var isTermMatch = !!_this.findTerm(prefixBase, icon.terms);
				return isIdMatch || isTermMatch;
			});
			var prefixedMatchingIcons = this.explodeIconPrefixes(matchingIcons);

			var createSuggestion = this.createSuggestion.bind(this, replacementPrefix, prefixBase, versionInfo);
			return prefixedMatchingIcons.map(createSuggestion);
		}
	}, {
		key: 'findTerm',
		value: function findTerm(prefixBase, terms) {
			if (prefixBase.length > 0) {
				return terms.find(function (term) {
					return term.startsWith(prefixBase);
				});
			}
		}
	}, {
		key: 'explodeIconPrefixes',
		value: function explodeIconPrefixes(icons) {
			var explodedIcons = [];
			icons.forEach(function (icon) {
				icon.styles.forEach(function (style) {
					explodedIcons.push({
						id: icon.id,
						style: style,
						label: icon.label,
						terms: icon.terms,
						unicode: icon.unicode
					});
				});
			});
			return explodedIcons;
		}
	}, {
		key: 'createSuggestion',
		value: function createSuggestion(replacementPrefix, prefixBase, versionInfo, icon) {
			var term = this.findTerm(prefixBase, icon.terms);
			var iconPrefix = versionInfo.stylePrefixMap[icon.style];
			return {
				className: 'aafa ' + versionInfo.className,
				type: 'value',
				iconHTML: '<i class="' + iconPrefix + ' fa-' + icon.id + '"></i>',
				leftLabel: iconPrefix,
				displayText: 'fa-' + icon.id + (term ? ' (' + term + ')' : ''),
				text: 'fa-' + icon.id,
				rightLabel: '\\' + icon.unicode,
				description: icon.label + (icon.style ? ' (' + icon.style + ')' : '') + ' • ' + versionInfo.label,
				descriptionMoreURL: versionInfo.iconMoreRoot + icon.id + (icon.style ? '?style=' + icon.style : ''),
				replacementPrefix: replacementPrefix // fixes double prefix bug
			};
		}
	}, {
		key: 'onDidInsertSuggestion',
		value: function onDidInsertSuggestion(_ref2) {
			var editor = _ref2.editor;
			var triggerPosition = _ref2.triggerPosition;
			var suggestion = _ref2.suggestion;

			// check for potential style prefixes to switch out (only happens if there is more than 1)
			var stylePrefixes = Object.values(versionHelper.getCurrentVersionInfo().stylePrefixMap);
			if (stylePrefixes.length === 1) {
				return;
			}

			// look for style prefix preceeding the inserted suggestion
			var stylePrefixRegex = new RegExp('\\b(' + stylePrefixes.join('|') + ')\\b[ .\\w\\d-]+\\bfa-[\\w\\d]*$', 'i');
			var leftText = editor.getTextInBufferRange([[triggerPosition.row, 0], triggerPosition]);
			var match = stylePrefixRegex.exec(leftText);

			if (match && match.length === 2) {
				// found it, replace existing style prefix with the one this suggestion uses
				var prefixColumnStart = match.index;
				var prefixColumnEnd = prefixColumnStart + match[1].length;
				editor.setTextInBufferRange([[triggerPosition.row, prefixColumnStart], [triggerPosition.row, prefixColumnEnd]], suggestion.leftLabel // the new style prefix
				);
			}
		}
	}]);

	return IconsProvider;
})();

exports['default'] = new IconsProvider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZvbnQtYXdlc29tZS9saWIvaWNvbnMtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0lBRTVDLGFBQWE7QUFDUCxVQUROLGFBQWEsR0FDSjt3QkFEVCxhQUFhOztBQUVqQixNQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUNwQixNQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0VBQzVCOztjQUpJLGFBQWE7O1NBTUosd0JBQUMsSUFBVSxFQUFFO09BQVYsTUFBTSxHQUFSLElBQVUsQ0FBUixNQUFNOztBQUN0QixPQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0IsV0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUM7R0FDRDs7O1NBRXNCLGlDQUFDLGlCQUFpQixFQUFFOzs7QUFDMUMsT0FBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRXhELE9BQUksVUFBVSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkQsT0FBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEQsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsUUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQUssUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsV0FBTyxTQUFTLElBQUksV0FBVyxDQUFDO0lBQ2hDLENBQUMsQ0FBQztB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QyxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEYsT0FBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQixXQUFPO0lBQ1A7OztBQUdELE9BQUksZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsa0NBQWtDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUcsT0FBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDeEYsT0FBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU1QyxPQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7QUFFaEMsUUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3BDLFFBQUksZUFBZSxHQUFHLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDMUQsVUFBTSxDQUFDLG9CQUFvQixDQUMxQixDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQyxFQUNsRixVQUFVLENBQUMsU0FBUztLQUNwQixDQUFDO0lBQ0Y7R0FDRDs7O1FBekZJLGFBQWE7OztxQkEyRkosSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZm9udC1hd2Vzb21lL2xpYi9pY29ucy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCB2ZXJzaW9uSGVscGVyID0gcmVxdWlyZSgnLi92ZXJzaW9uLWhlbHBlcicpO1xuXG5jbGFzcyBJY29uc1Byb3ZpZGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5zZWxlY3RvciA9ICcqJztcblx0XHR0aGlzLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IDI7XG5cdH1cblxuXHRnZXRTdWdnZXN0aW9ucyh7IHByZWZpeCB9KSB7XG5cdFx0aWYgKHByZWZpeC5zdGFydHNXaXRoKCdmYS0nKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZmluZE1hdGNoaW5nU3VnZ2VzdGlvbnMocHJlZml4KTtcblx0XHR9XG5cdH1cblxuXHRmaW5kTWF0Y2hpbmdTdWdnZXN0aW9ucyhyZXBsYWNlbWVudFByZWZpeCkge1xuXHRcdGxldCB2ZXJzaW9uSW5mbyA9IHZlcnNpb25IZWxwZXIuZ2V0Q3VycmVudFZlcnNpb25JbmZvKCk7XG5cblx0XHRsZXQgcHJlZml4QmFzZSA9IHJlcGxhY2VtZW50UHJlZml4LnJlcGxhY2UoL15mYS0vLCAnJyk7XG5cdFx0bGV0IG1hdGNoaW5nSWNvbnMgPSB2ZXJzaW9uSW5mby5pY29ucy5maWx0ZXIoKGljb24pID0+IHtcblx0XHRcdGxldCBpc0lkTWF0Y2ggPSBpY29uLmlkLnN0YXJ0c1dpdGgocHJlZml4QmFzZSk7XG5cdFx0XHRsZXQgaXNUZXJtTWF0Y2ggPSAhIXRoaXMuZmluZFRlcm0ocHJlZml4QmFzZSwgaWNvbi50ZXJtcyk7XG5cdFx0XHRyZXR1cm4gaXNJZE1hdGNoIHx8IGlzVGVybU1hdGNoO1xuXHRcdH0pO1xuXHRcdGxldCBwcmVmaXhlZE1hdGNoaW5nSWNvbnMgPSB0aGlzLmV4cGxvZGVJY29uUHJlZml4ZXMobWF0Y2hpbmdJY29ucyk7XG5cblx0XHRsZXQgY3JlYXRlU3VnZ2VzdGlvbiA9IHRoaXMuY3JlYXRlU3VnZ2VzdGlvbi5iaW5kKHRoaXMsIHJlcGxhY2VtZW50UHJlZml4LCBwcmVmaXhCYXNlLCB2ZXJzaW9uSW5mbyk7XG5cdFx0cmV0dXJuIHByZWZpeGVkTWF0Y2hpbmdJY29ucy5tYXAoY3JlYXRlU3VnZ2VzdGlvbik7XG5cdH1cblxuXHRmaW5kVGVybShwcmVmaXhCYXNlLCB0ZXJtcykge1xuXHRcdGlmIChwcmVmaXhCYXNlLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiB0ZXJtcy5maW5kKCh0ZXJtKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0ZXJtLnN0YXJ0c1dpdGgocHJlZml4QmFzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRleHBsb2RlSWNvblByZWZpeGVzKGljb25zKSB7XG5cdFx0bGV0IGV4cGxvZGVkSWNvbnMgPSBbXTtcblx0XHRpY29ucy5mb3JFYWNoKChpY29uKSA9PiB7XG5cdFx0XHRpY29uLnN0eWxlcy5mb3JFYWNoKChzdHlsZSkgPT4ge1xuXHRcdFx0XHRleHBsb2RlZEljb25zLnB1c2goe1xuXHRcdFx0XHRcdGlkOiBpY29uLmlkLFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSxcblx0XHRcdFx0XHRsYWJlbDogaWNvbi5sYWJlbCxcblx0XHRcdFx0XHR0ZXJtczogaWNvbi50ZXJtcyxcblx0XHRcdFx0XHR1bmljb2RlOiBpY29uLnVuaWNvZGVcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZXhwbG9kZWRJY29ucztcblx0fVxuXG5cdGNyZWF0ZVN1Z2dlc3Rpb24ocmVwbGFjZW1lbnRQcmVmaXgsIHByZWZpeEJhc2UsIHZlcnNpb25JbmZvLCBpY29uKSB7XG5cdFx0bGV0IHRlcm0gPSB0aGlzLmZpbmRUZXJtKHByZWZpeEJhc2UsIGljb24udGVybXMpO1xuXHRcdGxldCBpY29uUHJlZml4ID0gdmVyc2lvbkluZm8uc3R5bGVQcmVmaXhNYXBbaWNvbi5zdHlsZV07XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNsYXNzTmFtZTogJ2FhZmEgJyArIHZlcnNpb25JbmZvLmNsYXNzTmFtZSxcblx0XHRcdHR5cGU6ICd2YWx1ZScsXG5cdFx0XHRpY29uSFRNTDogJzxpIGNsYXNzPVwiJyArIGljb25QcmVmaXggKyAnIGZhLScgKyBpY29uLmlkICsgJ1wiPjwvaT4nLFxuXHRcdFx0bGVmdExhYmVsOiBpY29uUHJlZml4LFxuXHRcdFx0ZGlzcGxheVRleHQ6ICdmYS0nICsgaWNvbi5pZCArICh0ZXJtID8gJyAoJyArIHRlcm0gKyAnKScgOiAnJyksXG5cdFx0XHR0ZXh0OiAnZmEtJyArIGljb24uaWQsXG5cdFx0XHRyaWdodExhYmVsOiAnXFxcXCcgKyBpY29uLnVuaWNvZGUsXG5cdFx0XHRkZXNjcmlwdGlvbjogaWNvbi5sYWJlbCArIChpY29uLnN0eWxlID8gJyAoJyArIGljb24uc3R5bGUgKyAnKScgOiAnJykgKyAnIOKAoiAnICsgdmVyc2lvbkluZm8ubGFiZWwsXG5cdFx0XHRkZXNjcmlwdGlvbk1vcmVVUkw6IHZlcnNpb25JbmZvLmljb25Nb3JlUm9vdCArIGljb24uaWQgKyAoaWNvbi5zdHlsZSA/ICc/c3R5bGU9JyArIGljb24uc3R5bGUgOiAnJyksXG5cdFx0XHRyZXBsYWNlbWVudFByZWZpeDogcmVwbGFjZW1lbnRQcmVmaXggLy8gZml4ZXMgZG91YmxlIHByZWZpeCBidWdcblx0XHR9O1xuXHR9XG5cblx0b25EaWRJbnNlcnRTdWdnZXN0aW9uKHsgZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb24gfSkge1xuXHRcdC8vIGNoZWNrIGZvciBwb3RlbnRpYWwgc3R5bGUgcHJlZml4ZXMgdG8gc3dpdGNoIG91dCAob25seSBoYXBwZW5zIGlmIHRoZXJlIGlzIG1vcmUgdGhhbiAxKVxuXHRcdGxldCBzdHlsZVByZWZpeGVzID0gT2JqZWN0LnZhbHVlcyh2ZXJzaW9uSGVscGVyLmdldEN1cnJlbnRWZXJzaW9uSW5mbygpLnN0eWxlUHJlZml4TWFwKTtcblx0XHRpZiAoc3R5bGVQcmVmaXhlcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBsb29rIGZvciBzdHlsZSBwcmVmaXggcHJlY2VlZGluZyB0aGUgaW5zZXJ0ZWQgc3VnZ2VzdGlvblxuXHRcdGxldCBzdHlsZVByZWZpeFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXGIoJyArIHN0eWxlUHJlZml4ZXMuam9pbignfCcpICsgJylcXFxcYlsgLlxcXFx3XFxcXGQtXStcXFxcYmZhLVtcXFxcd1xcXFxkXSokJywgJ2knKTtcblx0XHRsZXQgbGVmdFRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1t0cmlnZ2VyUG9zaXRpb24ucm93LCAwXSwgdHJpZ2dlclBvc2l0aW9uXSk7XG5cdFx0bGV0IG1hdGNoID0gc3R5bGVQcmVmaXhSZWdleC5leGVjKGxlZnRUZXh0KTtcblxuXHRcdGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGggPT09IDIpIHtcblx0XHRcdC8vIGZvdW5kIGl0LCByZXBsYWNlIGV4aXN0aW5nIHN0eWxlIHByZWZpeCB3aXRoIHRoZSBvbmUgdGhpcyBzdWdnZXN0aW9uIHVzZXNcblx0XHRcdGxldCBwcmVmaXhDb2x1bW5TdGFydCA9IG1hdGNoLmluZGV4O1xuXHRcdFx0bGV0IHByZWZpeENvbHVtbkVuZCA9IHByZWZpeENvbHVtblN0YXJ0ICsgbWF0Y2hbMV0ubGVuZ3RoO1xuXHRcdFx0ZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFxuXHRcdFx0XHRbW3RyaWdnZXJQb3NpdGlvbi5yb3csIHByZWZpeENvbHVtblN0YXJ0XSwgW3RyaWdnZXJQb3NpdGlvbi5yb3csIHByZWZpeENvbHVtbkVuZF1dLFxuXHRcdFx0XHRzdWdnZXN0aW9uLmxlZnRMYWJlbCAvLyB0aGUgbmV3IHN0eWxlIHByZWZpeFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbn1cbmV4cG9ydCBkZWZhdWx0IG5ldyBJY29uc1Byb3ZpZGVyKCk7XG4iXX0=