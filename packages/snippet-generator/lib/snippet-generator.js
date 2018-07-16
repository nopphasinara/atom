'use babel';

import {
	CompositeDisposable
}
from 'atom';

export default {

	subscriptions: null,

	activate(state) {

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'snippet-generator:generate': () => {

				var editor = atom.workspace.getActiveTextEditor();
				var text = editor.getSelectedText();

				if (!text.length) {
					atom.notifications.addWarning("Please select some text.");
				} else {

					text = text.replace(/\n/g, '\\n');
					var tabLength = atom.config.get('editor')
						.tabLength;
					var tabReplaceRegex = new RegExp("\\s{" + tabLength + "}", ['g']);
					text = text.replace(tabReplaceRegex, '\\t');
					text = text.replace(/\t/g, "\\t");
					text = text.replace(/'/g, "\\'");

					atom.clipboard.write(text);

					atom.notifications.addSuccess("Snippet copied to clipboard.");

				}

			}
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	}

};
