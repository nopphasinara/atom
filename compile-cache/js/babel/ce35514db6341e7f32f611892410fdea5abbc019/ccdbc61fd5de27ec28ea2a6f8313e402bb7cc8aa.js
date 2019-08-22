function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _makeCache = require('./make-cache');

var _makeCache2 = _interopRequireDefault(_makeCache);

var _suggestionsJs = require('./suggestions.js');

var _suggestionsJs2 = _interopRequireDefault(_suggestionsJs);

"use babel";

function makeProvider(subscriptions) {
    var cache = (0, _makeCache2['default'])(subscriptions);

    return {
        providerName: 'js-hyperclick',
        wordRegExp: /[$0-9\w]+/g,
        getSuggestionForWord: function getSuggestionForWord(textEditor, text, range) {
            if ((0, _suggestionsJs.isJavascript)(textEditor)) {
                return (0, _suggestionsJs2['default'])(textEditor, text, range, cache);
            }
        }
    };
}

module.exports = {
    config: {
        extensions: {
            description: "Comma separated list of extensions to check for when a file isn't found",
            type: 'array',
            // Default comes from Node's `require.extensions`
            'default': ['.js', '.json', '.node'],
            items: { type: 'string' }
        },
        usePendingPanes: {
            type: 'boolean',
            'default': false
        },
        jumpToImport: {
            type: 'boolean',
            'default': false,
            description: '\n            Jump to the import statement instead of leaving the current file.\n            You can still click the import to switch files.\n            '.trim() // if the description starts with whitespace it doesn't display
        }
    },
    activate: function activate() {
        this.subscriptions = new _atom.CompositeDisposable();
    },
    getProvider: function getProvider() {
        return makeProvider(this.subscriptions);
    },
    deactivate: function deactivate() {
        this.subscriptions.dispose();
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL2pzLWh5cGVyY2xpY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBQ29DLE1BQU07O3lCQUNwQixjQUFjOzs7OzZCQUNNLGtCQUFrQjs7OztBQUg1RCxXQUFXLENBQUE7O0FBS1gsU0FBUyxZQUFZLENBQUMsYUFBYSxFQUFFO0FBQ2pDLFFBQU0sS0FBSyxHQUFHLDRCQUFVLGFBQWEsQ0FBQyxDQUFBOztBQUV0QyxXQUFPO0FBQ0gsb0JBQVksRUFBQyxlQUFlO0FBQzVCLGtCQUFVLEVBQUUsWUFBWTtBQUN4Qiw0QkFBb0IsRUFBQSw4QkFBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMxQyxnQkFBSSxpQ0FBYSxVQUFVLENBQUMsRUFBRTtBQUMxQix1QkFBTyxnQ0FBWSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTthQUNyRDtTQUNKO0tBQ0osQ0FBQTtDQUNKOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDYixVQUFNLEVBQUU7QUFDSixrQkFBVSxFQUFFO0FBQ1IsdUJBQVcsRUFBRSx5RUFBeUU7QUFDdEYsZ0JBQUksRUFBRSxPQUFPOztBQUViLHVCQUFTLENBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUU7QUFDcEMsaUJBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7U0FDNUI7QUFDRCx1QkFBZSxFQUFFO0FBQ2IsZ0JBQUksRUFBRSxTQUFTO0FBQ2YsdUJBQVMsS0FBSztTQUNqQjtBQUNELG9CQUFZLEVBQUU7QUFDVixnQkFBSSxFQUFFLFNBQVM7QUFDZix1QkFBUyxLQUFLO0FBQ2QsdUJBQVcsRUFBRSw2SkFHWCxJQUFJLEVBQUU7U0FDWDtLQUNKO0FBQ0QsWUFBUSxFQUFBLG9CQUFHO0FBQ1AsWUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtLQUNqRDtBQUNELGVBQVcsRUFBQSx1QkFBRztBQUNWLGVBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUMxQztBQUNELGNBQVUsRUFBQSxzQkFBRztBQUNULFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDL0I7Q0FDSixDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay1wcm9qZWN0LXBhdGgvbGliL2pzLWh5cGVyY2xpY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBtYWtlQ2FjaGUgZnJvbSAnLi9tYWtlLWNhY2hlJ1xuaW1wb3J0IHN1Z2dlc3Rpb25zLCB7IGlzSmF2YXNjcmlwdCB9IGZyb20gJy4vc3VnZ2VzdGlvbnMuanMnXG5cbmZ1bmN0aW9uIG1ha2VQcm92aWRlcihzdWJzY3JpcHRpb25zKSB7XG4gICAgY29uc3QgY2FjaGUgPSBtYWtlQ2FjaGUoc3Vic2NyaXB0aW9ucylcblxuICAgIHJldHVybiB7XG4gICAgICAgIHByb3ZpZGVyTmFtZTonanMtaHlwZXJjbGljaycsXG4gICAgICAgIHdvcmRSZWdFeHA6IC9bJDAtOVxcd10rL2csXG4gICAgICAgIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICBpZiAoaXNKYXZhc2NyaXB0KHRleHRFZGl0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zKHRleHRFZGl0b3IsIHRleHQsIHJhbmdlLCBjYWNoZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29uZmlnOiB7XG4gICAgICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGV4dGVuc2lvbnMgdG8gY2hlY2sgZm9yIHdoZW4gYSBmaWxlIGlzbid0IGZvdW5kXCIsXG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjb21lcyBmcm9tIE5vZGUncyBgcmVxdWlyZS5leHRlbnNpb25zYFxuICAgICAgICAgICAgZGVmYXVsdDogWyAnLmpzJywgJy5qc29uJywgJy5ub2RlJyBdLFxuICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlUGVuZGluZ1BhbmVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAganVtcFRvSW1wb3J0OiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgXG4gICAgICAgICAgICBKdW1wIHRvIHRoZSBpbXBvcnQgc3RhdGVtZW50IGluc3RlYWQgb2YgbGVhdmluZyB0aGUgY3VycmVudCBmaWxlLlxuICAgICAgICAgICAgWW91IGNhbiBzdGlsbCBjbGljayB0aGUgaW1wb3J0IHRvIHN3aXRjaCBmaWxlcy5cbiAgICAgICAgICAgIGAudHJpbSgpIC8vIGlmIHRoZSBkZXNjcmlwdGlvbiBzdGFydHMgd2l0aCB3aGl0ZXNwYWNlIGl0IGRvZXNuJ3QgZGlzcGxheVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB9LFxuICAgIGdldFByb3ZpZGVyKCkge1xuICAgICAgICByZXR1cm4gbWFrZVByb3ZpZGVyKHRoaXMuc3Vic2NyaXB0aW9ucylcbiAgICB9LFxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG59XG4iXX0=