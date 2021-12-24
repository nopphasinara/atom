// ~/.atom/Factory.js

// const _ = require('underscore-plus');
// const path = require('path');
// const fs = require('fs-plus');
// const {
//   BrowserWindow,
//   Menu,
//   app,
//   clipboard,
//   dialog,
//   ipcMain,
//   shell,
//   screen,
// } = require('electron');



// If you want to know the event for the keystroke you pressed you can paste the following script to your developer tools console
// document.addEventListener('keydown', e => console.log(e), true);


// You can add the following to your init.coffee to send Ctrl+@ when you press
// atom.keymaps.addKeystrokeResolver(({event}) => {
//   if (event.code === 'KeyG' && event.altKey && event.ctrlKey && event.type !== 'keyup') {
//     return 'ctrl-@';
//   }
// });


// pseudo-code
// editor.command('snippets:expand', e => {
//   if (this.cursorFollowsValidPrefix()) {
//     this.expandSnippet();
//   } else {
//     e.abortKeyBinding();
//   }
// });


// atom.commands.add('atom-text-editor', 'custom:cut-line', function () {
//   const editor = this.getModel();
//   editor.selectLinesContainingCursors();
//   editor.cutSelectedText();
// });


// atom.commands.add('atom-text-editor', {
//   'user:insert-date': function (event) {
//     const editor = this.getModel();
//     return editor.insertText(new Date().toLocaleString());
//   }
// });


// function mergeObject(obj, source) {
//   if (source && Object.getOwnPropertyNames(source).length > 0) {
//     for (key of Object.keys(source)) {
//       obj[key] = source[key];
//     }
//   }
//
//   return obj;
// }


// try {
//   ...
// } catch (error) {
//   ...
// }


class Factory {


  initialize() {
    console.log('initialized');
    // document.addEventListener('keydown', e => console.log(e), true);
  }

  constructor() {
    // this.initialize();

    try {
      console.log('OK');
    } catch (e) {
      console.log(e);
    } finally {
      console.log('finally');
    }
  }
}

export default Factory;