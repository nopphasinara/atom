(function() {
  var ChildProcess, exec;

  ChildProcess = require('child_process');

  exec = ChildProcess.exec;

  global.gc = {
    init: function() {
      console.log(atom);
      console.log(atom.workspace);
      return console.log(atom.workspace.getActiveTextEditor());
    },
    workspace: function() {
      return atom.workspace;
    },
    editor: function() {
      return atom.workspace.getActiveTextEditor();
    },
    selections: function() {
      return atom.workspace.getActiveTextEditor().getSelections();
    },
    buffer: function() {
      return atom.workspace.getActiveTextEditor().getBuffer();
    },
    extend: function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    },
    mutateSelectedText: function(selections, text, args) {
      var extraMove, extraSelect, i, isReversed, len, newText, oldPosition, options, results, selectedLength, selectedText, selection;
      if (text == null) {
        text = '{{replacement}}';
      }
      if (args == null) {
        args = {};
      }
      options = gc.options = gc.extend({
        select: true,
        undo: '',
        skip: false,
        move: 0,
        infix: '',
        reverse: false
      }, args);
      if (selections.length) {
        results = [];
        for (i = 0, len = selections.length; i < len; i++) {
          selection = selections[i];
          oldPosition = selection.cursor.marker.getScreenRange();
          selectedText = selection.getText();
          isReversed = selection.marker.bufferMarker.isReversed();
          if (options.infix) {
            if (selectedText.length <= 0) {
              selectedText = options.infix;
            }
          }
          selectedLength = selectedText.length;
          newText = text.replace('{{replacement}}', selectedText);
          selection.retainSelection = true;
          selection.plantTail();
          selection.insertText("" + newText, options);
          selection.retainSelection = false;
          extraMove = options.move;
          extraSelect = selectedLength;
          if (options.reverse) {
            extraMove = options.move + selectedLength;
            extraSelect = 0;
          }
          selection.cursor.moveRight(null, {
            moveToEndOfSelection: true
          });
          selection.clear();
          if (options.move > 0) {
            selection.cursor.moveLeft(extraMove);
          }
          if (options.select === true) {
            if (selectedLength > 0) {
              selection.cursor.moveLeft(extraSelect);
            }
            selection.selectRight(selectedLength);
          } else {
            selection.clear();
          }
          if (options.skip) {
            results.push(options.undo = 'skip');
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    }
  };

  atom.commands.add('atom-text-editor', 'gc:select-outside-bracket', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets");
    atom.commands.dispatch(atom.views.getView(editor), "core:move-right");
    return atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets");
  });

  atom.commands.add('atom-text-editor', 'gc:blade-echo', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 4,
      infix: '$var'
    };
    return gc.mutateSelectedText(selections, '{!! {{replacement}} !!}', options);
  });

  atom.commands.add('atom-workspace, atom-text-editor', 'gc:copy-filename', function() {
    var clipboard, editor;
    editor = atom.workspace.getActiveTextEditor();
    clipboard = editor.getFileName();
    if (clipboard !== '') {
      GC.clipboard = clipboard;
      return atom.clipboard.write(clipboard);
    }
  });

  atom.commands.add('atom-text-editor', 'gc:compile-sass', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    return atom.commands.dispatch(atom.views.getView(editor), "sass-autocompile:compile-to-file");
  });

  atom.commands.add('atom-text-editor', 'gc:paste', function() {
    var clipboard, editor;
    editor = atom.workspace.getActiveTextEditor();
    if (GC.clipboard !== '') {
      clipboard = GC.clipboard;
      return editor.insertText(clipboard);
    }
  });

  atom.commands.add('atom-text-editor', 'gc:copy', function() {
    var clipboard, editor, selectedText;
    editor = atom.workspace.getActiveTextEditor();
    selectedText = editor.getSelectedText();
    if (selectedText !== '') {
      clipboard = selectedText;
      return GC.clipboard = clipboard;
    }
  });

  atom.commands.add('atom-text-editor', 'gc:blade-comment', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 5
    };
    return gc.mutateSelectedText(selections, '{{-- {{replacement}} --}}', options);
  });

  atom.commands.add('atom-text-editor', 'gc:html-comment', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 4
    };
    return gc.mutateSelectedText(selections, '<!-- {{replacement}} -->', options);
  });

  atom.commands.add('atom-text-editor', 'gc:block-comment', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3
    };
    return gc.mutateSelectedText(selections, '/* {{replacement}} */', options);
  });

  atom.commands.add('atom-text-editor', 'gc:inline-comment', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true
    };
    return gc.mutateSelectedText(selections, '// {{replacement}}', options);
  });

  atom.commands.add('atom-text-editor', 'gc:blade-e', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3,
      infix: '$var'
    };
    return gc.mutateSelectedText(selections, '{{ {{replacement}} }}', options);
  });

  atom.commands.add('atom-text-editor', 'gc:tab-stop', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      reverse: false,
      move: 1,
      infix: ''
    };
    gc.mutateSelectedText(selections, '${{{replacement}}}', options);
    editor.moveLeft(1, gc.options);
    editor.insertText(":", gc.options);
    return editor.moveLeft(1, gc.options);
  });

  atom.commands.add('atom-text-editor', 'gc:php-echo', function() {
    var editor, i, isSource, j, len, len1, options, replacementText, scope, scopes, selection, selectionScopes, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 4,
      infix: '$var'
    };
    replacementText = '<?php echo {{replacement}}; ?>';
    if (selections.length) {
      selectionScopes = [];
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        isSource = false;
        scopes = selection.cursor.getScopeDescriptor().scopes;
        for (j = 0, len1 = scopes.length; j < len1; j++) {
          scope = scopes[j];
          if (scope.search('source.php') >= 0) {
            isSource = true;
            replacementText = 'echo {{replacement}};';
            options.move = 1;
            break;
          }
        }
      }
    }
    return gc.mutateSelectedText(selections, replacementText, options);
  });

  atom.commands.add('atom-text-editor', 'gc:spaces', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 1
    };
    return gc.mutateSelectedText(selections, ' {{replacement}} ', options);
  });

  atom.commands.add('atom-text-editor', 'gc:plus', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3
    };
    return gc.mutateSelectedText(selections, '\'+ {{replacement}} +\'', options);
  });

  atom.commands.add('atom-text-editor', 'gc:dots', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3
    };
    return gc.mutateSelectedText(selections, '\'. {{replacement}} .\'', options);
  });

  atom.commands.add('atom-text-editor', 'gc:dplus', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3
    };
    return gc.mutateSelectedText(selections, '"+ {{replacement}} +"', options);
  });

  atom.commands.add('atom-text-editor', 'gc:ddots', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      skip: true,
      move: 3
    };
    return gc.mutateSelectedText(selections, '". {{replacement}} ."', options);
  });

  atom.commands.add('atom-text-editor', 'gc:insert-br', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true
    };
    return gc.mutateSelectedText(selections, '<br>', options);
  });

  atom.commands.add('atom-text-editor', 'gc:insert-property', function() {
    var ref, ref1, snippetBody;
    snippetBody = '"${1:key}": "$2",$0';
    return (ref = atom.packages.activePackages.snippets) != null ? (ref1 = ref.mainModule) != null ? ref1.insert(snippetBody) : void 0 : void 0;
  });

  atom.commands.add('atom-text-editor', 'gc:insert-property-array', function() {
    var ref, ref1, snippetBody;
    snippetBody = '"${1:key}": [$2],$0';
    return (ref = atom.packages.activePackages.snippets) != null ? (ref1 = ref.mainModule) != null ? ref1.insert(snippetBody) : void 0 : void 0;
  });

  atom.commands.add('atom-text-editor', 'gc:insert-property-object', function() {
    var ref, ref1, snippetBody;
    snippetBody = '"${1:key}": \{$2\},$0';
    return (ref = atom.packages.activePackages.snippets) != null ? (ref1 = ref.mainModule) != null ? ref1.insert(snippetBody) : void 0 : void 0;
  });

  atom.commands.add('atom-text-editor', 'gc:insert-p', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true
    };
    return gc.mutateSelectedText(selections, '<p>&nbsp;</p>', options);
  });

  atom.commands.add('atom-text-editor', 'gc:insert-space', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true
    };
    return gc.mutateSelectedText(selections, '&nbsp;', options);
  });

  atom.commands.add('atom-text-editor', 'gc:insert-parenthesis', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true
    };
    return gc.mutateSelectedText(selections, '()', options);
  });

  atom.commands.add('atom-text-editor', 'gc:insert-linebreak', function() {
    var editor, options, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true
    };
    return gc.mutateSelectedText(selections, '————————————————————————————————', options);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSOztFQUNmLElBQUEsR0FBTyxZQUFZLENBQUM7O0VBRXBCLE1BQU0sQ0FBQyxFQUFQLEdBQVk7SUFDVixJQUFBLEVBQU0sU0FBQTtNQUNKLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWjtNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLFNBQWpCO2FBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtJQUhJLENBREk7SUFLVixTQUFBLEVBQVcsU0FBQTtBQUNULGFBQU8sSUFBSSxDQUFDO0lBREgsQ0FMRDtJQU9WLE1BQUEsRUFBUSxTQUFBO0FBQ04sYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFERCxDQVBFO0lBU1YsVUFBQSxFQUFZLFNBQUE7QUFDVixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLGFBQXJDLENBQUE7SUFERyxDQVRGO0lBV1YsTUFBQSxFQUFRLFNBQUE7QUFDTixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLFNBQXJDLENBQUE7SUFERCxDQVhFO0lBYVYsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLFVBQVQ7QUFDTixVQUFBO0FBQUEsV0FBQSxpQkFBQTs7UUFDRSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWM7QUFEaEI7QUFHQSxhQUFPO0lBSkQsQ0FiRTtJQWtCVixrQkFBQSxFQUFvQixTQUFDLFVBQUQsRUFBYSxJQUFiLEVBQXVDLElBQXZDO0FBQ2xCLFVBQUE7O1FBRCtCLE9BQU87OztRQUFtQixPQUFPOztNQUNoRSxPQUFBLEdBQVUs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UCxDQUFBO0lBQ2IsT0FBQSxHQUFVO01BQUUsTUFBQSxFQUFRLEtBQVY7TUFBaUIsSUFBQSxFQUFNLElBQXZCOztXQUNWLEVBQUUsQ0FBQyxrQkFBSCxDQUFzQixVQUF0QixFQUFrQyxRQUFsQyxFQUE0QyxPQUE1QztFQUp1RCxDQUF6RDs7RUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLHVCQUF0QyxFQUErRCxTQUFBO0FBQzdELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsVUFBQSxHQUFhLE1BQU0sQ0FBQyxhQUFQLENBQUE7SUFDYixPQUFBLEdBQVU7TUFBRSxNQUFBLEVBQVEsS0FBVjtNQUFpQixJQUFBLEVBQU0sSUFBdkI7O1dBQ1YsRUFBRSxDQUFDLGtCQUFILENBQXNCLFVBQXRCLEVBQWtDLElBQWxDLEVBQXdDLE9BQXhDO0VBSjZELENBQS9EOztFQU1BLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MscUJBQXRDLEVBQTZELFNBQUE7QUFDM0QsUUFBQTtJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFDVCxVQUFBLEdBQWEsTUFBTSxDQUFDLGFBQVAsQ0FBQTtJQUNiLE9BQUEsR0FBVTtNQUFFLE1BQUEsRUFBUSxLQUFWO01BQWlCLElBQUEsRUFBTSxJQUF2Qjs7V0FDVixFQUFFLENBQUMsa0JBQUgsQ0FBc0IsVUFBdEIsRUFBa0Msa0NBQWxDLEVBQXNFLE9BQXRFO0VBSjJELENBQTdEO0FBdFBBIiwic291cmNlc0NvbnRlbnQiOlsiQ2hpbGRQcm9jZXNzID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbmV4ZWMgPSBDaGlsZFByb2Nlc3MuZXhlY1xuXG5nbG9iYWwuZ2MgPSB7XG4gIGluaXQ6ICgpIC0+XG4gICAgY29uc29sZS5sb2cgYXRvbVxuICAgIGNvbnNvbGUubG9nIGF0b20ud29ya3NwYWNlXG4gICAgY29uc29sZS5sb2cgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHdvcmtzcGFjZTogKCkgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2VcbiAgZWRpdG9yOiAoKSAtPlxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9uczogKCkgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFNlbGVjdGlvbnMoKVxuICBidWZmZXI6ICgpIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRCdWZmZXIoKVxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG5cbiAgICByZXR1cm4gb2JqZWN0XG4gIG11dGF0ZVNlbGVjdGVkVGV4dDogKHNlbGVjdGlvbnMsIHRleHQgPSAne3tyZXBsYWNlbWVudH19JywgYXJncyA9IHt9KSAtPlxuICAgIG9wdGlvbnMgPSBnYy5vcHRpb25zID0gZ2MuZXh0ZW5kKHtcbiAgICAgIHNlbGVjdDogdHJ1ZSxcbiAgICAgIHVuZG86ICcnLFxuICAgICAgc2tpcDogZmFsc2UsXG4gICAgICBtb3ZlOiAwLFxuICAgICAgaW5maXg6ICcnLFxuICAgICAgcmV2ZXJzZTogZmFsc2UsXG4gICAgfSwgYXJncylcblxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoXG4gICAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgICAgb2xkUG9zaXRpb24gPSBzZWxlY3Rpb24uY3Vyc29yLm1hcmtlci5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgICAgICAgaXNSZXZlcnNlZCA9IHNlbGVjdGlvbi5tYXJrZXIuYnVmZmVyTWFya2VyLmlzUmV2ZXJzZWQoKVxuICAgICAgICBpZiBvcHRpb25zLmluZml4XG4gICAgICAgICAgaWYgc2VsZWN0ZWRUZXh0Lmxlbmd0aCA8PSAwXG4gICAgICAgICAgICBzZWxlY3RlZFRleHQgPSBvcHRpb25zLmluZml4XG4gICAgICAgIHNlbGVjdGVkTGVuZ3RoID0gc2VsZWN0ZWRUZXh0Lmxlbmd0aFxuICAgICAgICBuZXdUZXh0ID0gdGV4dC5yZXBsYWNlKCd7e3JlcGxhY2VtZW50fX0nLCBzZWxlY3RlZFRleHQpXG5cbiAgICAgICAgc2VsZWN0aW9uLnJldGFpblNlbGVjdGlvbiA9IHRydWVcbiAgICAgICAgc2VsZWN0aW9uLnBsYW50VGFpbCgpXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KFwiI3tuZXdUZXh0fVwiLCBvcHRpb25zKVxuICAgICAgICBzZWxlY3Rpb24ucmV0YWluU2VsZWN0aW9uID0gZmFsc2VcblxuICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmVcbiAgICAgICAgZXh0cmFTZWxlY3QgPSBzZWxlY3RlZExlbmd0aFxuICAgICAgICBpZiBvcHRpb25zLnJldmVyc2VcbiAgICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmUgKyBzZWxlY3RlZExlbmd0aFxuICAgICAgICAgIGV4dHJhU2VsZWN0ID0gMFxuXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZVJpZ2h0KG51bGwsIHsgbW92ZVRvRW5kT2ZTZWxlY3Rpb246IHRydWUgfSlcbiAgICAgICAgc2VsZWN0aW9uLmNsZWFyKClcbiAgICAgICAgaWYgb3B0aW9ucy5tb3ZlID4gMFxuICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFNb3ZlKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2VsZWN0ID09IHRydWVcbiAgICAgICAgICBpZiBzZWxlY3RlZExlbmd0aCA+IDBcbiAgICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFTZWxlY3QpXG5cbiAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoc2VsZWN0ZWRMZW5ndGgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzZWxlY3Rpb24uY2xlYXIoKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2tpcFxuICAgICAgICAgIG9wdGlvbnMudW5kbyA9ICdza2lwJ1xufVxuXG5cbiMgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2djOmNvbnRyb2wtZmlsZXMnLCAtPlxuIyAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuIyAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiYXBwbGljYXRpb246bmV3LXdpbmRvd1wiKVxuI1xuIyAgIGV4ZWMoJ29wZW4gLWEgQXRvbSBcIiRIT01FL0Ryb3Bib3gvQ29udHJvbC1NYXN0ZXIudHh0XCIgXCIkSE9NRS9Hb29nbGUgRHJpdmVzL25vcHBoYXNpbi9GaW5lYXJ0IERyaXZlL0NvbnRyb2wtRmluZWFydC50eHRcIiBcIiRIT01FL0dvb2dsZSBEcml2ZXMvbm9wcGhhc2luL0ZpbmVhcnQgRHJpdmUvUGxlc2tfT3lueC50eHRcIicsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4jICAgICAjIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiMgICApXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOnNlbGVjdC1vdXRzaWRlLWJyYWNrZXQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgIyBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvcnMoKVxuICAjIGlmIGN1cnNvcnMubGVuZ3RoXG4gICMgICBmb3IgY3Vyc29yIGluIGN1cnNvcnNcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiZWRpdG9yLm1vdmUtdG8tZW5kLW9mLWxpbmVcIilcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiYnJhY2tldC1tYXRjaGVyOnNlbGVjdC1pbnNpZGUtYnJhY2tldHNcIilcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiY29yZTptb3ZlLXJpZ2h0XCIpXG4gICMgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGN1cnNvci5lZGl0b3IpLCBcImJyYWNrZXQtbWF0Y2hlcjpzZWxlY3QtaW5zaWRlLWJyYWNrZXRzXCIpXG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiYnJhY2tldC1tYXRjaGVyOnNlbGVjdC1pbnNpZGUtYnJhY2tldHNcIilcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJjb3JlOm1vdmUtcmlnaHRcIilcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJicmFja2V0LW1hdGNoZXI6c2VsZWN0LWluc2lkZS1icmFja2V0c1wiKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpibGFkZS1lY2hvJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDQsIGluZml4OiAnJHZhcicgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ3shISB7e3JlcGxhY2VtZW50fX0gISF9Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlLCBhdG9tLXRleHQtZWRpdG9yJywgJ2djOmNvcHktZmlsZW5hbWUnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgY2xpcGJvYXJkID0gZWRpdG9yLmdldEZpbGVOYW1lKClcbiAgaWYgY2xpcGJvYXJkICE9ICcnXG4gICAgR0MuY2xpcGJvYXJkID0gY2xpcGJvYXJkXG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoY2xpcGJvYXJkKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpjb21waWxlLXNhc3MnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJzYXNzLWF1dG9jb21waWxlOmNvbXBpbGUtdG8tZmlsZVwiKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpwYXN0ZScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBpZiBHQy5jbGlwYm9hcmQgIT0gJydcbiAgICBjbGlwYm9hcmQgPSBHQy5jbGlwYm9hcmRcbiAgICBlZGl0b3IuaW5zZXJ0VGV4dChjbGlwYm9hcmQpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmNvcHknLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gIGlmIHNlbGVjdGVkVGV4dCAhPSAnJ1xuICAgIGNsaXBib2FyZCA9IHNlbGVjdGVkVGV4dFxuICAgIEdDLmNsaXBib2FyZCA9IGNsaXBib2FyZFxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpibGFkZS1jb21tZW50JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ3t7LS0ge3tyZXBsYWNlbWVudH19IC0tfX0nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpodG1sLWNvbW1lbnQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogNCB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnPCEtLSB7e3JlcGxhY2VtZW50fX0gLS0+Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxvY2stY29tbWVudCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcvKiB7e3JlcGxhY2VtZW50fX0gKi8nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbmxpbmUtY29tbWVudCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnLy8ge3tyZXBsYWNlbWVudH19Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxhZGUtZScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzLCBpbmZpeDogJyR2YXInIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICd7eyB7e3JlcGxhY2VtZW50fX0gfX0nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzp0YWItc3RvcCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCByZXZlcnNlOiBmYWxzZSwgbW92ZTogMSwgaW5maXg6ICcnIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcke3t7cmVwbGFjZW1lbnR9fX0nLCBvcHRpb25zKVxuICAjIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdjb3JlOm1vdmUtbGVmdCcpXG4gIGVkaXRvci5tb3ZlTGVmdCgxLCBnYy5vcHRpb25zKTtcbiAgZWRpdG9yLmluc2VydFRleHQoXCI6XCIsIGdjLm9wdGlvbnMpO1xuICBlZGl0b3IubW92ZUxlZnQoMSwgZ2Mub3B0aW9ucyk7XG4gICMgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2NvcmU6bW92ZS1sZWZ0JylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6cGhwLWVjaG8nLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogNCwgaW5maXg6ICckdmFyJyB9XG4gIHJlcGxhY2VtZW50VGV4dCA9ICc8P3BocCBlY2hvIHt7cmVwbGFjZW1lbnR9fTsgPz4nXG4gIGlmIHNlbGVjdGlvbnMubGVuZ3RoXG4gICAgc2VsZWN0aW9uU2NvcGVzID0gW11cbiAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgIGlzU291cmNlID0gZmFsc2VcbiAgICAgIHNjb3BlcyA9IHNlbGVjdGlvbi5jdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzXG4gICAgICBmb3Igc2NvcGUgaW4gc2NvcGVzXG4gICAgICAgIGlmIHNjb3BlLnNlYXJjaCgnc291cmNlLnBocCcpID49IDBcbiAgICAgICAgICBpc1NvdXJjZSA9IHRydWVcbiAgICAgICAgICByZXBsYWNlbWVudFRleHQgPSAnZWNobyB7e3JlcGxhY2VtZW50fX07J1xuICAgICAgICAgIG9wdGlvbnMubW92ZSA9IDFcbiAgICAgICAgICBicmVha1xuXG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCByZXBsYWNlbWVudFRleHQsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOnNwYWNlcycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAxIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcge3tyZXBsYWNlbWVudH19ICcsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOnBsdXMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnXFwnKyB7e3JlcGxhY2VtZW50fX0gK1xcJycsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmRvdHMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnXFwnLiB7e3JlcGxhY2VtZW50fX0gLlxcJycsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmRwbHVzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDMgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ1wiKyB7e3JlcGxhY2VtZW50fX0gK1wiJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6ZGRvdHMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnXCIuIHt7cmVwbGFjZW1lbnR9fSAuXCInLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtYnInLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnPGJyPicsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1wcm9wZXJ0eScsIC0+XG4gIHNuaXBwZXRCb2R5ID0gJ1wiJHsxOmtleX1cIjogXCIkMlwiLCQwJ1xuICBhdG9tLnBhY2thZ2VzLmFjdGl2ZVBhY2thZ2VzLnNuaXBwZXRzPy5tYWluTW9kdWxlPy5pbnNlcnQgc25pcHBldEJvZHlcbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1wcm9wZXJ0eS1hcnJheScsIC0+XG4gIHNuaXBwZXRCb2R5ID0gJ1wiJHsxOmtleX1cIjogWyQyXSwkMCdcbiAgYXRvbS5wYWNrYWdlcy5hY3RpdmVQYWNrYWdlcy5zbmlwcGV0cz8ubWFpbk1vZHVsZT8uaW5zZXJ0IHNuaXBwZXRCb2R5XG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtcHJvcGVydHktb2JqZWN0JywgLT5cbiAgc25pcHBldEJvZHkgPSAnXCIkezE6a2V5fVwiOiBcXHskMlxcfSwkMCdcbiAgYXRvbS5wYWNrYWdlcy5hY3RpdmVQYWNrYWdlcy5zbmlwcGV0cz8ubWFpbk1vZHVsZT8uaW5zZXJ0IHNuaXBwZXRCb2R5XG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1wJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNlbGVjdDogZmFsc2UsIHNraXA6IHRydWUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJzxwPiZuYnNwOzwvcD4nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtc3BhY2UnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnJm5ic3A7Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXBhcmVudGhlc2lzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNlbGVjdDogZmFsc2UsIHNraXA6IHRydWUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJygpJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LWxpbmVicmVhaycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBzZWxlY3Q6IGZhbHNlLCBza2lwOiB0cnVlIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnLCBvcHRpb25zKVxuXG5cbiMgbGlzdGVuVG9LZXlQcmVzc2VkID0gKGVkaXRvcikgLT5cbiMgICAjIGVkaXRvci5vbkRpZENoYW5nZSAoZSkgLT5cbiMgICAjICAgY29uc29sZS5sb2cgZWRpdG9yXG4jICAgIyAgIGNvbnNvbGUubG9nIGVkaXRvci5nZXRCdWZmZXIoKVxuIyAgICMgICBjb25zb2xlLmxvZyBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0Q2hhbmdlc1NpbmNlQ2hlY2twb2ludCgpXG4jICAgIyAgIGNvbnNvbGUubG9nIGVcbiMgICAjICAgIyBjb25zb2xlLmxvZyBlWzBdLm9sZEV4dGVudFxuIyAgICMgICAjIGNvbnNvbGUubG9nIGVbMF0ub2xkRXh0ZW50LnRvU3RyaW5nKClcbiMgICAjICAgI1xuIyAgICMgICAjXG4jXG4jIGxpc3RlblRvQnVmZmVycyA9IChlZGl0b3IpIC0+XG4jICAgZWRpdG9yLmJ1ZmZlci5vbkRpZFN0b3BDaGFuZ2luZyAoZSkgLT5cbiMgICAgIGlzTWF0Y2hlcyA9IGZhbHNlXG4jICAgICBjb25zb2xlLmxvZyBlXG4jICAgICBpZiBlLmNoYW5nZXMubGVuZ3RoID4gMFxuIyAgICAgICBmb3IgY2hhbmdlIGluIGUuY2hhbmdlc1xuIyAgICAgICAgIGNvbnNvbGUubG9nIGNoYW5nZS5uZXdUZXh0XG4jICAgICAgICAgaWYgY2hhbmdlLm5ld1RleHQgPT0gJy8vLy8nXG4jICAgICAgICAgICBpc01hdGNoZXMgPSB0cnVlXG4jXG4jXG4jICAgICBpZiBpc01hdGNoZXMgPT0gdHJ1ZVxuIyAgICAgICBlZGl0b3Iuc2VsZWN0TGVmdCg0KVxuIyAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcIi8vIGZvb1xcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cIilcbiMgICAgICAgZWRpdG9yLm1vdmVMZWZ0KDQxKVxuIyAgICAgICBlZGl0b3Iuc2VsZWN0TGVmdCg0KVxuI1xuIyBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvciAtPlxuIyAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuIyAgICMgbGlzdGVuVG9LZXlQcmVzc2VkKGVkaXRvcilcbiMgICAjIGxpc3RlblRvQnVmZmVycyhlZGl0b3IpXG4iXX0=
