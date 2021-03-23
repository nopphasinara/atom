'use strict';

let CompositeDisposable = require('atom').CompositeDisposable;
let Emitter = require('atom').Emitter;

let CommandManager = {
  registerCommands: function () {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();

    atom.commands.add('atom-text-editor', 'custom:select-line', function () {
      var editor = atom.workspace.getActiveTextEditor();
      editor.mutateSelectedText(function (selection, i) {
        selection.editor.selectLinesContainingCursors();

        var selectedText = selection.editor.getSelectedText();
        if (selectedText) {
          var trimStart = selectedText.length - selectedText.trimStart().length;
          var trimEnd = selectedText.length - selectedText.trimEnd().length;
          var trimAll = selectedText.length - trimStart - trimEnd;
          var buffer = selection.editor.getSelectedBufferRange();

          if (selection.isReversed()) {
            selection.editor.moveRight();
            selection.editor.moveLeft(trimEnd);
            selection.selectLeft(trimAll);
          } else {
            selection.editor.moveLeft();
            selection.editor.moveRight(trimStart);
            selection.selectRight(trimAll);
          }
        }
      });

      // var selections = editor.getSelections();
      // for (var i = 0; i < selections.length; i++) {
      //   var selection = selections[i];
      //   var selectedText = selection.editor.getSelectedText();
      //   if (selectedText) {
      //     var trimStart = selectedText.length - selectedText.trimStart().length;
      //     var trimEnd = selectedText.length - selectedText.trimEnd().length;
      //     var trimAll = selectedText.length - trimStart - trimEnd;
      //     var buffer = selection.editor.getSelectedBufferRange();
      //
      //     if (selection.isReversed()) {
      //       selection.cursor.moveRight();
      //       selection.cursor.moveLeft(trimEnd);
      //       selection.cursor.selection.selectLeft(trimAll);
      //     } else {
      //       selection.cursor.moveLeft();
      //       selection.cursor.moveRight(trimStart);
      //       selection.cursor.selection.selectRight(trimAll);
      //     }
      //   }
      // }
    });
  },
};

module.exports = CommandManager;
