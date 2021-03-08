'use babel';

import { CompositeDisposable } from 'atom';

export default {

  escapeToJavascriptStringView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'escape-to-javascript-string:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    console.log('EscapeToJavascriptString was toggled!');

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      if (!selection.endsWith('\n')) {
        selection += '\n';
      }
      let escaped = '\'' + selection.replace(/'/g, '\\\'').replace(/\n/g, '\\n\' + \n\'').replace(/\' \+ \n\'$/, '\';');
      editor.insertText(escaped)
      // let reversed = selection.split('').reverse().join('')
      // editor.insertText(reversed)
    }

    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
