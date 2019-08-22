Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dataAdvanced = require('../data/advanced');

var _dataAdvanced2 = _interopRequireDefault(_dataAdvanced);

'use babel';

var AdvancedProvider = (function () {
    function AdvancedProvider() {
        _classCallCheck(this, AdvancedProvider);

        this.selector = '.source.js, .source.jsx, .source.coffee';
        this.disableForSelector = '.source.js .comment';
        this.suggestionPriority = 2;
    }

    _createClass(AdvancedProvider, [{
        key: 'getSuggestions',
        value: function getSuggestions(options) {
            var editor = options.editor;
            var bufferPosition = options.bufferPosition;

            var prefix = this.getPrefix(editor, bufferPosition);
            if (prefix.length > 2) {
                return this.findMatchingSuggestions(prefix);
            }
        }
    }, {
        key: 'getPrefix',
        value: function getPrefix(editor, bufferPosition) {
            var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
            var match = line.match(/\S+$/);
            var filtered = match ? match[0] : '';
            return filtered.split('.').reverse()[0];
        }
    }, {
        key: 'findMatchingSuggestions',
        value: function findMatchingSuggestions(prefix) {
            var _this = this;

            return new Promise(function (resolve) {

                var prefixLower = prefix.toLowerCase();
                var matchingSuggestions = _dataAdvanced2['default'].filter(function (suggestion) {
                    var textLower = suggestion.displayText.toLowerCase();
                    return textLower.startsWith(prefixLower);
                });

                var inflateSuggestion = _this.inflateSuggestion.bind(_this, prefix);
                var inflatedSuggestions = matchingSuggestions.map(inflateSuggestion);

                resolve(inflatedSuggestions);
            });
        }
    }, {
        key: 'inflateSuggestion',
        value: function inflateSuggestion(replacementPrefix, suggestion) {
            return {
                displayText: suggestion.displayText,
                snippet: suggestion.snippet,
                description: suggestion.description,
                replacementPrefix: replacementPrefix, // ensures entire prefix is replaced
                iconHTML: '<i class="icon-arrow-right"></i>',
                type: 'snippet',
                rightLabelHTML: '<span class="aab-right-label"> => ' + suggestion.label + ' </span>'
            };
        }
    }]);

    return AdvancedProvider;
})();

exports['default'] = new AdvancedProvider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1hcnJvdy1hdXRvY29tcGxldGUtanMvbGliL2FkdmFuY2VkLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7NEJBRXdCLGtCQUFrQjs7OztBQUYxQyxXQUFXLENBQUM7O0lBS04sZ0JBQWdCO0FBQ1AsYUFEVCxnQkFBZ0IsR0FDSjs4QkFEWixnQkFBZ0I7O0FBRWQsWUFBSSxDQUFDLFFBQVEsR0FBRyx5Q0FBeUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsa0JBQWtCLEdBQUcscUJBQXFCLENBQUM7QUFDaEQsWUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztLQUMvQjs7aUJBTEMsZ0JBQWdCOztlQU9KLHdCQUFDLE9BQU8sRUFBRTtnQkFFaEIsTUFBTSxHQUVOLE9BQU8sQ0FGUCxNQUFNO2dCQUNOLGNBQWMsR0FDZCxPQUFPLENBRFAsY0FBYzs7QUFHbEIsZ0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3BELGdCQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ25CLHVCQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMvQztTQUNKOzs7ZUFFUSxtQkFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFO0FBQzlCLGdCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQzdCLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQzFDLENBQUMsQ0FBQztBQUNILGdCQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLGdCQUFJLFFBQVEsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxtQkFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDOzs7ZUFFc0IsaUNBQUMsTUFBTSxFQUFFOzs7QUFDNUIsbUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTVCLG9CQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDdkMsb0JBQUksbUJBQW1CLEdBQUcsMEJBQVksTUFBTSxDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ3pELHdCQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3JELDJCQUFPLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzVDLENBQUMsQ0FBQzs7QUFFSCxvQkFBSSxpQkFBaUIsR0FBRyxNQUFLLGlCQUFpQixDQUFDLElBQUksUUFBTyxNQUFNLENBQUMsQ0FBQztBQUNsRSxvQkFBSSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFckUsdUJBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQ2hDLENBQUMsQ0FBQztTQUNOOzs7ZUFFZ0IsMkJBQUMsaUJBQWlCLEVBQUUsVUFBVSxFQUFFO0FBQzdDLG1CQUFPO0FBQ0gsMkJBQVcsRUFBRSxVQUFVLENBQUMsV0FBVztBQUNuQyx1QkFBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO0FBQzNCLDJCQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7QUFDbkMsaUNBQWlCLEVBQUUsaUJBQWlCO0FBQ3BDLHdCQUFRLEVBQUUsa0NBQWtDO0FBQzVDLG9CQUFJLEVBQUUsU0FBUztBQUNmLDhCQUFjLEVBQUUsb0NBQW9DLEdBQUcsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVO2FBQ3ZGLENBQUM7U0FDTDs7O1dBdERDLGdCQUFnQjs7O3FCQXdEUCxJQUFJLGdCQUFnQixFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1hcnJvdy1hdXRvY29tcGxldGUtanMvbGliL2FkdmFuY2VkLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBzdWdnZXN0aW9ucyBmcm9tICcuLi9kYXRhL2FkdmFuY2VkJztcblxuXG5jbGFzcyBBZHZhbmNlZFByb3ZpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9ICcuc291cmNlLmpzLCAuc291cmNlLmpzeCwgLnNvdXJjZS5jb2ZmZWUnO1xuICAgICAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLmpzIC5jb21tZW50JztcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9uUHJpb3JpdHkgPSAyO1xuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZWRpdG9yLFxuICAgICAgICAgICAgYnVmZmVyUG9zaXRpb25cbiAgICAgICAgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgbGV0IHByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgICAgICBpZiAocHJlZml4Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1N1Z2dlc3Rpb25zKHByZWZpeCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikge1xuICAgICAgICBsZXQgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbXG4gICAgICAgICAgICBbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25cbiAgICAgICAgXSk7XG4gICAgICAgIGxldCBtYXRjaCA9IGxpbmUubWF0Y2goL1xcUyskLyk7XG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IG1hdGNoID8gbWF0Y2hbMF0gOiAnJztcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkLnNwbGl0KCcuJykucmV2ZXJzZSgpWzBdO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1N1Z2dlc3Rpb25zKHByZWZpeCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByZWZpeExvd2VyID0gcHJlZml4LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBsZXQgbWF0Y2hpbmdTdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zLmZpbHRlcigoc3VnZ2VzdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0TG93ZXIgPSBzdWdnZXN0aW9uLmRpc3BsYXlUZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHRMb3dlci5zdGFydHNXaXRoKHByZWZpeExvd2VyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgaW5mbGF0ZVN1Z2dlc3Rpb24gPSB0aGlzLmluZmxhdGVTdWdnZXN0aW9uLmJpbmQodGhpcywgcHJlZml4KTtcbiAgICAgICAgICAgIGxldCBpbmZsYXRlZFN1Z2dlc3Rpb25zID0gbWF0Y2hpbmdTdWdnZXN0aW9ucy5tYXAoaW5mbGF0ZVN1Z2dlc3Rpb24pO1xuXG4gICAgICAgICAgICByZXNvbHZlKGluZmxhdGVkU3VnZ2VzdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbmZsYXRlU3VnZ2VzdGlvbihyZXBsYWNlbWVudFByZWZpeCwgc3VnZ2VzdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGlzcGxheVRleHQ6IHN1Z2dlc3Rpb24uZGlzcGxheVRleHQsXG4gICAgICAgICAgICBzbmlwcGV0OiBzdWdnZXN0aW9uLnNuaXBwZXQsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogc3VnZ2VzdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiByZXBsYWNlbWVudFByZWZpeCwgLy8gZW5zdXJlcyBlbnRpcmUgcHJlZml4IGlzIHJlcGxhY2VkXG4gICAgICAgICAgICBpY29uSFRNTDogJzxpIGNsYXNzPVwiaWNvbi1hcnJvdy1yaWdodFwiPjwvaT4nLFxuICAgICAgICAgICAgdHlwZTogJ3NuaXBwZXQnLFxuICAgICAgICAgICAgcmlnaHRMYWJlbEhUTUw6ICc8c3BhbiBjbGFzcz1cImFhYi1yaWdodC1sYWJlbFwiPiA9PiAnICsgc3VnZ2VzdGlvbi5sYWJlbCArICcgPC9zcGFuPidcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBuZXcgQWR2YW5jZWRQcm92aWRlcigpOyJdfQ==