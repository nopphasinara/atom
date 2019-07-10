'use babel';

import suggestions from '../data/advanced';


class AdvancedProvider {
    constructor() {
        this.selector = '.source.js, .source.jsx, .source.coffee';
        this.disableForSelector = '.source.js .comment';
        this.suggestionPriority = 2;
    }

    getSuggestions(options) {
        const {
            editor,
            bufferPosition
        } = options;

        let prefix = this.getPrefix(editor, bufferPosition);
        if (prefix.length > 2) {
            return this.findMatchingSuggestions(prefix);
        }
    }

    getPrefix(editor, bufferPosition) {
        let line = editor.getTextInRange([
            [bufferPosition.row, 0], bufferPosition
        ]);
        let match = line.match(/\S+$/);
        let filtered = match ? match[0] : '';
        return filtered.split('.').reverse()[0];
    }

    findMatchingSuggestions(prefix) {
        return new Promise((resolve) => {

            let prefixLower = prefix.toLowerCase();
            let matchingSuggestions = suggestions.filter((suggestion) => {
                let textLower = suggestion.displayText.toLowerCase();
                return textLower.startsWith(prefixLower);
            });

            let inflateSuggestion = this.inflateSuggestion.bind(this, prefix);
            let inflatedSuggestions = matchingSuggestions.map(inflateSuggestion);

            resolve(inflatedSuggestions);
        });
    }

    inflateSuggestion(replacementPrefix, suggestion) {
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
}
export default new AdvancedProvider();