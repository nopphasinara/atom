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
      options = gc.extend({
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
    return gc.mutateSelectedText(selections, '${{{replacement}}}', options);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSOztFQUNmLElBQUEsR0FBTyxZQUFZLENBQUM7O0VBRXBCLE1BQU0sQ0FBQyxFQUFQLEdBQVk7SUFDVixJQUFBLEVBQU0sU0FBQTtNQUNKLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWjtNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLFNBQWpCO2FBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtJQUhJLENBREk7SUFLVixTQUFBLEVBQVcsU0FBQTtBQUNULGFBQU8sSUFBSSxDQUFDO0lBREgsQ0FMRDtJQU9WLE1BQUEsRUFBUSxTQUFBO0FBQ04sYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFERCxDQVBFO0lBU1YsVUFBQSxFQUFZLFNBQUE7QUFDVixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLGFBQXJDLENBQUE7SUFERyxDQVRGO0lBV1YsTUFBQSxFQUFRLFNBQUE7QUFDTixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLFNBQXJDLENBQUE7SUFERCxDQVhFO0lBYVYsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLFVBQVQ7QUFDTixVQUFBO0FBQUEsV0FBQSxpQkFBQTs7UUFDRSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWM7QUFEaEI7QUFHQSxhQUFPO0lBSkQsQ0FiRTtJQWtCVixrQkFBQSxFQUFvQixTQUFDLFVBQUQsRUFBYSxJQUFiLEVBQXVDLElBQXZDO0FBQ2xCLFVBQUE7O1FBRCtCLE9BQU87OztRQUFtQixPQUFPOztNQUNoRSxPQUFBLEdBQVUs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RUFBK0QsU0FBQTtBQUM3RCxRQUFBO0lBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUNULFVBQUEsR0FBYSxNQUFNLENBQUMsYUFBUCxDQUFBO0lBQ2IsT0FBQSxHQUFVO01BQUUsTUFBQSxFQUFRLEtBQVY7TUFBaUIsSUFBQSxFQUFNLElBQXZCOztXQUNWLEVBQUUsQ0FBQyxrQkFBSCxDQUFzQixVQUF0QixFQUFrQyxJQUFsQyxFQUF3QyxPQUF4QztFQUo2RCxDQUEvRDs7RUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLHFCQUF0QyxFQUE2RCxTQUFBO0FBQzNELFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBQ1QsVUFBQSxHQUFhLE1BQU0sQ0FBQyxhQUFQLENBQUE7SUFDYixPQUFBLEdBQVU7TUFBRSxNQUFBLEVBQVEsS0FBVjtNQUFpQixJQUFBLEVBQU0sSUFBdkI7O1dBQ1YsRUFBRSxDQUFDLGtCQUFILENBQXNCLFVBQXRCLEVBQWtDLGtDQUFsQyxFQUFzRSxPQUF0RTtFQUoyRCxDQUE3RDtBQWpQQSIsInNvdXJjZXNDb250ZW50IjpbIkNoaWxkUHJvY2VzcyA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5leGVjID0gQ2hpbGRQcm9jZXNzLmV4ZWNcblxuZ2xvYmFsLmdjID0ge1xuICBpbml0OiAoKSAtPlxuICAgIGNvbnNvbGUubG9nIGF0b21cbiAgICBjb25zb2xlLmxvZyBhdG9tLndvcmtzcGFjZVxuICAgIGNvbnNvbGUubG9nIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICB3b3Jrc3BhY2U6ICgpIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlXG4gIGVkaXRvcjogKCkgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnM6ICgpIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRTZWxlY3Rpb25zKClcbiAgYnVmZmVyOiAoKSAtPlxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0QnVmZmVyKClcbiAgZXh0ZW5kOiAob2JqZWN0LCBwcm9wZXJ0aWVzKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBwcm9wZXJ0aWVzXG4gICAgICBvYmplY3Rba2V5XSA9IHZhbFxuXG4gICAgcmV0dXJuIG9iamVjdFxuICBtdXRhdGVTZWxlY3RlZFRleHQ6IChzZWxlY3Rpb25zLCB0ZXh0ID0gJ3t7cmVwbGFjZW1lbnR9fScsIGFyZ3MgPSB7fSkgLT5cbiAgICBvcHRpb25zID0gZ2MuZXh0ZW5kKHtcbiAgICAgIHNlbGVjdDogdHJ1ZSxcbiAgICAgIHVuZG86ICcnLFxuICAgICAgc2tpcDogZmFsc2UsXG4gICAgICBtb3ZlOiAwLFxuICAgICAgaW5maXg6ICcnLFxuICAgICAgcmV2ZXJzZTogZmFsc2UsXG4gICAgfSwgYXJncylcblxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoXG4gICAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgICAgb2xkUG9zaXRpb24gPSBzZWxlY3Rpb24uY3Vyc29yLm1hcmtlci5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgICAgICAgaXNSZXZlcnNlZCA9IHNlbGVjdGlvbi5tYXJrZXIuYnVmZmVyTWFya2VyLmlzUmV2ZXJzZWQoKVxuICAgICAgICBpZiBvcHRpb25zLmluZml4XG4gICAgICAgICAgaWYgc2VsZWN0ZWRUZXh0Lmxlbmd0aCA8PSAwXG4gICAgICAgICAgICBzZWxlY3RlZFRleHQgPSBvcHRpb25zLmluZml4XG4gICAgICAgIHNlbGVjdGVkTGVuZ3RoID0gc2VsZWN0ZWRUZXh0Lmxlbmd0aFxuICAgICAgICBuZXdUZXh0ID0gdGV4dC5yZXBsYWNlKCd7e3JlcGxhY2VtZW50fX0nLCBzZWxlY3RlZFRleHQpXG5cbiAgICAgICAgc2VsZWN0aW9uLnJldGFpblNlbGVjdGlvbiA9IHRydWVcbiAgICAgICAgc2VsZWN0aW9uLnBsYW50VGFpbCgpXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KFwiI3tuZXdUZXh0fVwiLCBvcHRpb25zKVxuICAgICAgICBzZWxlY3Rpb24ucmV0YWluU2VsZWN0aW9uID0gZmFsc2VcblxuICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmVcbiAgICAgICAgZXh0cmFTZWxlY3QgPSBzZWxlY3RlZExlbmd0aFxuICAgICAgICBpZiBvcHRpb25zLnJldmVyc2VcbiAgICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmUgKyBzZWxlY3RlZExlbmd0aFxuICAgICAgICAgIGV4dHJhU2VsZWN0ID0gMFxuXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZVJpZ2h0KG51bGwsIHsgbW92ZVRvRW5kT2ZTZWxlY3Rpb246IHRydWUgfSlcbiAgICAgICAgc2VsZWN0aW9uLmNsZWFyKClcbiAgICAgICAgaWYgb3B0aW9ucy5tb3ZlID4gMFxuICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFNb3ZlKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2VsZWN0ID09IHRydWVcbiAgICAgICAgICBpZiBzZWxlY3RlZExlbmd0aCA+IDBcbiAgICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFTZWxlY3QpXG5cbiAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoc2VsZWN0ZWRMZW5ndGgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzZWxlY3Rpb24uY2xlYXIoKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2tpcFxuICAgICAgICAgIG9wdGlvbnMudW5kbyA9ICdza2lwJ1xufVxuXG5cbiMgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2djOmNvbnRyb2wtZmlsZXMnLCAtPlxuIyAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuIyAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiYXBwbGljYXRpb246bmV3LXdpbmRvd1wiKVxuI1xuIyAgIGV4ZWMoJ29wZW4gLWEgQXRvbSBcIiRIT01FL0Ryb3Bib3gvQ29udHJvbC1NYXN0ZXIudHh0XCIgXCIkSE9NRS9Hb29nbGUgRHJpdmVzL25vcHBoYXNpbi9GaW5lYXJ0IERyaXZlL0NvbnRyb2wtRmluZWFydC50eHRcIiBcIiRIT01FL0dvb2dsZSBEcml2ZXMvbm9wcGhhc2luL0ZpbmVhcnQgRHJpdmUvUGxlc2tfT3lueC50eHRcIicsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4jICAgICAjIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiMgICApXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOnNlbGVjdC1vdXRzaWRlLWJyYWNrZXQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgIyBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvcnMoKVxuICAjIGlmIGN1cnNvcnMubGVuZ3RoXG4gICMgICBmb3IgY3Vyc29yIGluIGN1cnNvcnNcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiZWRpdG9yLm1vdmUtdG8tZW5kLW9mLWxpbmVcIilcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiYnJhY2tldC1tYXRjaGVyOnNlbGVjdC1pbnNpZGUtYnJhY2tldHNcIilcbiAgIyAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoY3Vyc29yLmVkaXRvciksIFwiY29yZTptb3ZlLXJpZ2h0XCIpXG4gICMgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGN1cnNvci5lZGl0b3IpLCBcImJyYWNrZXQtbWF0Y2hlcjpzZWxlY3QtaW5zaWRlLWJyYWNrZXRzXCIpXG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiYnJhY2tldC1tYXRjaGVyOnNlbGVjdC1pbnNpZGUtYnJhY2tldHNcIilcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJjb3JlOm1vdmUtcmlnaHRcIilcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJicmFja2V0LW1hdGNoZXI6c2VsZWN0LWluc2lkZS1icmFja2V0c1wiKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpibGFkZS1lY2hvJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDQsIGluZml4OiAnJHZhcicgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ3shISB7e3JlcGxhY2VtZW50fX0gISF9Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlLCBhdG9tLXRleHQtZWRpdG9yJywgJ2djOmNvcHktZmlsZW5hbWUnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgY2xpcGJvYXJkID0gZWRpdG9yLmdldEZpbGVOYW1lKClcbiAgaWYgY2xpcGJvYXJkICE9ICcnXG4gICAgR0MuY2xpcGJvYXJkID0gY2xpcGJvYXJkXG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoY2xpcGJvYXJkKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpjb21waWxlLXNhc3MnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJzYXNzLWF1dG9jb21waWxlOmNvbXBpbGUtdG8tZmlsZVwiKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpwYXN0ZScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBpZiBHQy5jbGlwYm9hcmQgIT0gJydcbiAgICBjbGlwYm9hcmQgPSBHQy5jbGlwYm9hcmRcbiAgICBlZGl0b3IuaW5zZXJ0VGV4dChjbGlwYm9hcmQpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmNvcHknLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gIGlmIHNlbGVjdGVkVGV4dCAhPSAnJ1xuICAgIGNsaXBib2FyZCA9IHNlbGVjdGVkVGV4dFxuICAgIEdDLmNsaXBib2FyZCA9IGNsaXBib2FyZFxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpibGFkZS1jb21tZW50JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ3t7LS0ge3tyZXBsYWNlbWVudH19IC0tfX0nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpodG1sLWNvbW1lbnQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogNCB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnPCEtLSB7e3JlcGxhY2VtZW50fX0gLS0+Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxvY2stY29tbWVudCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcvKiB7e3JlcGxhY2VtZW50fX0gKi8nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbmxpbmUtY29tbWVudCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnLy8ge3tyZXBsYWNlbWVudH19Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxhZGUtZScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzLCBpbmZpeDogJyR2YXInIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICd7eyB7e3JlcGxhY2VtZW50fX0gfX0nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzp0YWItc3RvcCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCByZXZlcnNlOiBmYWxzZSwgbW92ZTogMSwgaW5maXg6ICcnIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcke3t7cmVwbGFjZW1lbnR9fX0nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpwaHAtZWNobycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiA0LCBpbmZpeDogJyR2YXInIH1cbiAgcmVwbGFjZW1lbnRUZXh0ID0gJzw/cGhwIGVjaG8ge3tyZXBsYWNlbWVudH19OyA/PidcbiAgaWYgc2VsZWN0aW9ucy5sZW5ndGhcbiAgICBzZWxlY3Rpb25TY29wZXMgPSBbXVxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgaXNTb3VyY2UgPSBmYWxzZVxuICAgICAgc2NvcGVzID0gc2VsZWN0aW9uLmN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKS5zY29wZXNcbiAgICAgIGZvciBzY29wZSBpbiBzY29wZXNcbiAgICAgICAgaWYgc2NvcGUuc2VhcmNoKCdzb3VyY2UucGhwJykgPj0gMFxuICAgICAgICAgIGlzU291cmNlID0gdHJ1ZVxuICAgICAgICAgIHJlcGxhY2VtZW50VGV4dCA9ICdlY2hvIHt7cmVwbGFjZW1lbnR9fTsnXG4gICAgICAgICAgb3B0aW9ucy5tb3ZlID0gMVxuICAgICAgICAgIGJyZWFrXG5cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsIHJlcGxhY2VtZW50VGV4dCwgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6c3BhY2VzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDEgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJyB7e3JlcGxhY2VtZW50fX0gJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6cGx1cycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICdcXCcrIHt7cmVwbGFjZW1lbnR9fSArXFwnJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6ZG90cycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICdcXCcuIHt7cmVwbGFjZW1lbnR9fSAuXFwnJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6ZHBsdXMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnXCIrIHt7cmVwbGFjZW1lbnR9fSArXCInLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpkZG90cycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICdcIi4ge3tyZXBsYWNlbWVudH19IC5cIicsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1icicsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBzZWxlY3Q6IGZhbHNlLCBza2lwOiB0cnVlIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICc8YnI+Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXByb3BlcnR5JywgLT5cbiAgc25pcHBldEJvZHkgPSAnXCIkezE6a2V5fVwiOiBcIiQyXCIsJDAnXG4gIGF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXMuc25pcHBldHM/Lm1haW5Nb2R1bGU/Lmluc2VydCBzbmlwcGV0Qm9keVxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXByb3BlcnR5LWFycmF5JywgLT5cbiAgc25pcHBldEJvZHkgPSAnXCIkezE6a2V5fVwiOiBbJDJdLCQwJ1xuICBhdG9tLnBhY2thZ2VzLmFjdGl2ZVBhY2thZ2VzLnNuaXBwZXRzPy5tYWluTW9kdWxlPy5pbnNlcnQgc25pcHBldEJvZHlcbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1wcm9wZXJ0eS1vYmplY3QnLCAtPlxuICBzbmlwcGV0Qm9keSA9ICdcIiR7MTprZXl9XCI6IFxceyQyXFx9LCQwJ1xuICBhdG9tLnBhY2thZ2VzLmFjdGl2ZVBhY2thZ2VzLnNuaXBwZXRzPy5tYWluTW9kdWxlPy5pbnNlcnQgc25pcHBldEJvZHlcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXAnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnPHA+Jm5ic3A7PC9wPicsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1zcGFjZScsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBzZWxlY3Q6IGZhbHNlLCBza2lwOiB0cnVlIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcmbmJzcDsnLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtcGFyZW50aGVzaXMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnKCknLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtbGluZWJyZWFrJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNlbGVjdDogZmFsc2UsIHNraXA6IHRydWUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCcsIG9wdGlvbnMpXG5cblxuIyBsaXN0ZW5Ub0tleVByZXNzZWQgPSAoZWRpdG9yKSAtPlxuIyAgICMgZWRpdG9yLm9uRGlkQ2hhbmdlIChlKSAtPlxuIyAgICMgICBjb25zb2xlLmxvZyBlZGl0b3JcbiMgICAjICAgY29uc29sZS5sb2cgZWRpdG9yLmdldEJ1ZmZlcigpXG4jICAgIyAgIGNvbnNvbGUubG9nIGVkaXRvci5nZXRCdWZmZXIoKS5nZXRDaGFuZ2VzU2luY2VDaGVja3BvaW50KClcbiMgICAjICAgY29uc29sZS5sb2cgZVxuIyAgICMgICAjIGNvbnNvbGUubG9nIGVbMF0ub2xkRXh0ZW50XG4jICAgIyAgICMgY29uc29sZS5sb2cgZVswXS5vbGRFeHRlbnQudG9TdHJpbmcoKVxuIyAgICMgICAjXG4jICAgIyAgICNcbiNcbiMgbGlzdGVuVG9CdWZmZXJzID0gKGVkaXRvcikgLT5cbiMgICBlZGl0b3IuYnVmZmVyLm9uRGlkU3RvcENoYW5naW5nIChlKSAtPlxuIyAgICAgaXNNYXRjaGVzID0gZmFsc2VcbiMgICAgIGNvbnNvbGUubG9nIGVcbiMgICAgIGlmIGUuY2hhbmdlcy5sZW5ndGggPiAwXG4jICAgICAgIGZvciBjaGFuZ2UgaW4gZS5jaGFuZ2VzXG4jICAgICAgICAgY29uc29sZS5sb2cgY2hhbmdlLm5ld1RleHRcbiMgICAgICAgICBpZiBjaGFuZ2UubmV3VGV4dCA9PSAnLy8vLydcbiMgICAgICAgICAgIGlzTWF0Y2hlcyA9IHRydWVcbiNcbiNcbiMgICAgIGlmIGlzTWF0Y2hlcyA9PSB0cnVlXG4jICAgICAgIGVkaXRvci5zZWxlY3RMZWZ0KDQpXG4jICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiLy8gZm9vXFxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1wiKVxuIyAgICAgICBlZGl0b3IubW92ZUxlZnQoNDEpXG4jICAgICAgIGVkaXRvci5zZWxlY3RMZWZ0KDQpXG4jXG4jIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yIC0+XG4jICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4jICAgIyBsaXN0ZW5Ub0tleVByZXNzZWQoZWRpdG9yKVxuIyAgICMgbGlzdGVuVG9CdWZmZXJzKGVkaXRvcilcbiJdfQ==
