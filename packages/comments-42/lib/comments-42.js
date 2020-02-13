'use babel';

import { CompositeDisposable } from 'atom';

export default {
	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'comments-42:comment': () => this.comment()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	comment() {
		const editor = atom.workspace.getActiveTextEditor();
		const lineLen = atom.config.get('editor.preferredLineLength');
		const supportCComments = [
			"c",
			"cpp",
			"cs",
			"css",
			"h",
			"js",
			"VHD",
			"VHDL"
		];
		var index, tmp, ranges, cursors;
		var arr = [];
		var isCommented = [];

		if (supportCComments.indexOf(editor.getTitle().split(".").pop()) === -1) {
			atom.notifications.addWarning("This File does not support C comments");
			atom.beep();
			return ;
		}
		if (editor) {
			ranges = editor.getSelectedBufferRanges();
			cursors = editor.getCursors();
			for (i = 0; i < ranges.length; i++) {
				ranges[i].start.column = 0;
				cursors[i].setBufferPosition(ranges[i].end.toArray());
				cursors[i].moveToEndOfLine();
				ranges[i].end = cursors[i].getBufferPosition();
			}
			for (i = 0; i < ranges.length; i++) {
				for (j = 0; j < i; j++) {
					if (ranges[j].start.row === ranges[i].end.row + 1) {
						ranges[j].start = ranges[i].start;
						ranges.splice(i, 1);
						i = 0;
					} else if (ranges[j].end.row + 1 === ranges[i].start.row) {
						ranges[j].end = ranges[i].end;
						ranges.splice(i, 1);
						i = 0;
					}
				}
			}
			for (i = 0; i < ranges.length; i++)
				arr[i] = editor.getTextInBufferRange(ranges[i]);
			ranges = ranges.filter(function(range, i) {
				if (arr[i].trim() !== '')
					return (1);
				arr.splice(i, 1);
				return (0);
			});
			for (i = 0; i < ranges.length; i++) {
				if (/^\/\*$/m.test(arr[i]) || /^\*\/$/m.test(arr[i]) || /^\*\*.*$/m.test(arr[i])) {
					start = arr[i].search(/\/\*/);
					while (start === -1 && ranges[i].start.row >= 0) {
						ranges[i].start.row--;
						arr[i] = editor.getTextInBufferRange(ranges[i]);
						start = arr[i].search(/\/\*/);
					}
					ranges[i].start.row = ranges[i].end.row - arr[i].slice(start).split('\n').length + 1;
					ranges[i].start.column = 0;
					end = arr[i].search(/\*\//);
					while (end === -1 && ranges[i].end.row < editor.getLineCount()) {
						ranges[i].end.row++;
						arr[i] = editor.getTextInBufferRange(ranges[i]);
						end = arr[i].search(/\*\//);
					}
					ranges[i].end.row = ranges[i].start.row + arr[i].slice(0, end).split('\n').length;
					ranges[i].end.column = 2;
					arr[i] = editor.getTextInBufferRange(ranges[i]);
					isCommented[i] = true;
				} else {
					tmp = arr[i].split('\n');
					for (j = 0; j < tmp.length && tmp[0].trim() === ''; j++) {
						tmp.shift();
						ranges[i].start.row++;
					}
					for (j = tmp.length - 1; j >= 0 && tmp[j].trim() === ''; j--) {
						tmp.pop();
						ranges[i].end.row--;
						cursors[i].setBufferPosition(ranges[i].end.toArray());
						cursors[i].moveToEndOfLine();
						ranges[i].end = cursors[i].getBufferPosition();
					}
					arr[i] = tmp.join('\n');
					isCommented[i] = false;
				}
			}
			for (i = 0; i < ranges.length; i++)
			{
				if (isCommented[i]) {
					tmp = arr[i].split('\n');
					tmp = tmp.filter(function(str) {
						return (!(/^\/\*$/m.test(str) || /^\*\/$/m.test(str)));
					});
					for (j = 0; j < tmp.length; j++) {
						tmp[j] = tmp[j].replace(/^\*\*/, '');
						if (/^</.test(tmp[j])) {
							tmp[j - 1] = tmp[j - 1] + tmp[j].replace(/^</, '');
							tmp.splice(j, 1);
							j--;
						} else
							tmp[j] = tmp[j].replace(/^[ \.]/, '');
					}
					arr[i] = tmp.join('\n');
				} else {
					tmp = arr[i].split('\n');
					for (j = 0; j < tmp.length; j++) {
						if (tmp[j].length + 3 > lineLen && tmp[j].length <= lineLen) {
							index = tmp[j].search(/[ \t][^ \t]*$/);
							if (index > 0) {
								tmp.splice(j + 1, 0, tmp[j].substring(index));
								tmp[j] = tmp[j].substring(0, index);
							}
							tmp[j] = '** ' + tmp[j];
							j++;
							tmp[j] = '**<' + tmp[j];
						} else
							tmp[j] = '** ' + tmp[j];
					}
					tmp.unshift('/*');
					tmp.push('*/');
					arr[i] = tmp.join('\n');
				}
			}
			for (i = 0; i < arr.length; i++)
				editor.setTextInBufferRange(ranges[i], arr[i]);
		}
	}
};
