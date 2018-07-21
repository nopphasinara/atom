'use babel';

import { CompositeDisposable, Point, Range } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spaces-in-braces:run-space-check': (e) => this.runSpaceCheck(e)
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spaces-in-braces:run-backspace-check': (e) => this.runBackspaceCheck(e)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  runSpaceCheck(e) {
    if( atom.workspace.getActiveTextEditor() ) {
      let editor = atom.workspace.getActiveTextEditor();
      let cp = editor.getCursorBufferPosition();
      if( cp.column > 0 ) {
        let range = [ [ cp.row, cp.column - 1 ], [ cp.row, cp.column + 1 ] ];
        let text = editor.getTextInBufferRange( range );
        console.log( "text is ", text[0], text[1]);
        if( ( text[0] == '{' && text[1] == '}' ) ||
            ( text[0] == '(' && text[1] == ')' ) ||
            ( text[0] == '[' && text[1] == ']' ) )
        {
          editor.insertText( "  " );
          editor.moveLeft( 1 );
          return;
        }
      }
    }
    e.abortKeyBinding();
  },

  runBackspaceCheck(e) {
    if( atom.workspace.getActiveTextEditor() ) {
      let editor = atom.workspace.getActiveTextEditor();
      let cp = editor.getCursorBufferPosition();
      if( cp.column >= 2 ) {
        let range = [ [ cp.row, cp.column - 2 ], [ cp.row, cp.column + 2 ] ];
        let text = editor.getTextInBufferRange( range );
        if( text.slice( 1, 3 ) == '  ' ) {
          if( ( text[0] == '{' && text[3] == '}' ) ||
              ( text[0] == '(' && text[3] == ')' ) ||
              ( text[0] == '[' && text[3] == ']' ) )
          {
            editor.delete();
            editor.backspace();
            return;
          }
        }
      }
    }
    e.abortKeyBinding();
  }

};
