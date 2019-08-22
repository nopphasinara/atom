(function() {
  var ChildProcess, exec, expanding, findCharacters, firstCharacter, lastCharacter;

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

  atom.workspace.observeActiveTextEditor(function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    return global.e = gc.activeEditor = editor;
  });

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

  atom.commands.add('atom-text-editor', 'gc:bio-link', function() {
    var clipboardText, editor, options, selectedText, selections;
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    options = {
      select: false,
      skip: true,
      reverse: false,
      infix: ''
    };
    selectedText = editor.getSelectedText();
    clipboardText = atom.clipboard.read();
    if (!clipboardText || typeof clipboardText !== 'string') {
      clipboardText = '';
    }
    return editor.insertText("<a href=\"" + clipboardText + "\" title=\"" + selectedText + "\">" + selectedText + "</a>", gc.options);
  });

  atom.commands.add('atom-text-editor', 'gc:bio-link-reverse', function() {
    var editor, selectedText;
    editor = atom.workspace.getActiveTextEditor();
    selectedText = editor.getSelectedText();
    return expanding(editor);
  });

  findCharacters = function(text, find) {
    var i, isFounded, item, len;
    if (text == null) {
      text = '';
    }
    if (find == null) {
      find = [];
    }
    if (typeof text !== 'string') {
      return false;
    }
    if (!find || find.length === 0) {
      return false;
    }
    if (typeof find === 'string') {
      find = new Array(find);
    }
    isFounded = false;
    for (i = 0, len = find.length; i < len; i++) {
      item = find[i];
      if (text.search(item) >= 0) {
        isFounded = text.search(item);
        break;
      }
    }
    return isFounded;
  };

  gc.firstCharacter = firstCharacter = function(text) {
    if (text == null) {
      text = '';
    }
    if (typeof text !== 'string') {
      return;
    }
    return text.substr(0, 1);
  };

  gc.lastCharacter = lastCharacter = function(text) {
    if (text == null) {
      text = '';
    }
    if (typeof text !== 'string') {
      return;
    }
    return text.substr(-1);
  };

  gc.expanding = expanding = function(editor, selectedText) {
    if (selectedText == null) {
      selectedText = '';
    }
    if (typeof selectedText !== 'string' || !selectedText) {
      selectedText = editor.getSelectedText();
    }
    if (lastCharacter(selectedText) !== '}') {
      console.log('no');
      editor.selectToNextWordBoundary();
      selectedText = editor.getSelectedText();
      if (findCharacters(selectedText, "\n") === false) {
        console.log('false');
        return expanding(editor, selectedText);
      } else {
        console.log('stopped');
        return editor.moveLeft();
      }
    } else {
      if (firstCharacter(selectedText) !== '{') {
        console.log('no');
        editor.moveRight();
        editor.selectToPreviousWordBoundary();
        selectedText = editor.getSelectedText();
        if (findCharacters(selectedText, "\n") === false) {
          console.log('false');
          return expanding(editor, selectedText);
        } else {
          console.log('stopped');
          return editor.moveRight();
        }
      } else {
        console.log('yes');
        return console.log(selectedText);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSOztFQUNmLElBQUEsR0FBTyxZQUFZLENBQUM7O0VBRXBCLE1BQU0sQ0FBQyxFQUFQLEdBQVk7SUFDVixJQUFBLEVBQU0sU0FBQTtNQUNKLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWjtNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLFNBQWpCO2FBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtJQUhJLENBREk7SUFLVixTQUFBLEVBQVcsU0FBQTtBQUNULGFBQU8sSUFBSSxDQUFDO0lBREgsQ0FMRDtJQU9WLE1BQUEsRUFBUSxTQUFBO0FBQ04sYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFERCxDQVBFO0lBU1YsVUFBQSxFQUFZLFNBQUE7QUFDVixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLGFBQXJDLENBQUE7SUFERyxDQVRGO0lBV1YsTUFBQSxFQUFRLFNBQUE7QUFDTixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLFNBQXJDLENBQUE7SUFERCxDQVhFO0lBYVYsTUFBQSxFQUFRLFNBQUMsTUFBRCxFQUFTLFVBQVQ7QUFDTixVQUFBO0FBQUEsV0FBQSxpQkFBQTs7UUFDRSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWM7QUFEaEI7QUFHQSxhQUFPO0lBSkQsQ0FiRTtJQWtCVixrQkFBQSxFQUFvQixTQUFDLFVBQUQsRUFBYSxJQUFiLEVBQXVDLElBQXZDO0FBQ2xCLFVBQUE7O1FBRCtCLE9BQU87OztRQUFtQixPQUFPOztNQUNoRSxPQUFBLEdBQVUs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T0FBWjtlQUNBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCLFlBQWxCLEVBRkY7T0FBQSxNQUFBO1FBSUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFaO2VBQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBQSxFQUxGO09BSkY7S0FBQSxNQUFBO01BV0UsSUFBRyxjQUFBLENBQWUsWUFBZixDQUFBLEtBQWdDLEdBQW5DO1FBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQTtRQUNBLE1BQU0sQ0FBQyw0QkFBUCxDQUFBO1FBQ0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxlQUFQLENBQUE7UUFDZixJQUFHLGNBQUEsQ0FBZSxZQUFmLEVBQTZCLElBQTdCLENBQUEsS0FBc0MsS0FBekM7VUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7aUJBQ0EsU0FBQSxDQUFVLE1BQVYsRUFBa0IsWUFBbEIsRUFGRjtTQUFBLE1BQUE7VUFJRSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQVo7aUJBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQSxFQUxGO1NBTEY7T0FBQSxNQUFBO1FBWUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaLEVBYkY7T0FYRjs7RUFKeUI7QUFsVDNCIiwic291cmNlc0NvbnRlbnQiOlsiQ2hpbGRQcm9jZXNzID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbmV4ZWMgPSBDaGlsZFByb2Nlc3MuZXhlY1xuXG5nbG9iYWwuZ2MgPSB7XG4gIGluaXQ6ICgpIC0+XG4gICAgY29uc29sZS5sb2cgYXRvbVxuICAgIGNvbnNvbGUubG9nIGF0b20ud29ya3NwYWNlXG4gICAgY29uc29sZS5sb2cgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHdvcmtzcGFjZTogKCkgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2VcbiAgZWRpdG9yOiAoKSAtPlxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9uczogKCkgLT5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFNlbGVjdGlvbnMoKVxuICBidWZmZXI6ICgpIC0+XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRCdWZmZXIoKVxuICBleHRlbmQ6IChvYmplY3QsIHByb3BlcnRpZXMpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIHByb3BlcnRpZXNcbiAgICAgIG9iamVjdFtrZXldID0gdmFsXG5cbiAgICByZXR1cm4gb2JqZWN0XG4gIG11dGF0ZVNlbGVjdGVkVGV4dDogKHNlbGVjdGlvbnMsIHRleHQgPSAne3tyZXBsYWNlbWVudH19JywgYXJncyA9IHt9KSAtPlxuICAgIG9wdGlvbnMgPSBnYy5vcHRpb25zID0gZ2MuZXh0ZW5kKHtcbiAgICAgIHNlbGVjdDogdHJ1ZSxcbiAgICAgIHVuZG86ICcnLFxuICAgICAgc2tpcDogZmFsc2UsXG4gICAgICBtb3ZlOiAwLFxuICAgICAgaW5maXg6ICcnLFxuICAgICAgcmV2ZXJzZTogZmFsc2UsXG4gICAgfSwgYXJncylcblxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoXG4gICAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgICAgb2xkUG9zaXRpb24gPSBzZWxlY3Rpb24uY3Vyc29yLm1hcmtlci5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgICAgICAgaXNSZXZlcnNlZCA9IHNlbGVjdGlvbi5tYXJrZXIuYnVmZmVyTWFya2VyLmlzUmV2ZXJzZWQoKVxuICAgICAgICBpZiBvcHRpb25zLmluZml4XG4gICAgICAgICAgaWYgc2VsZWN0ZWRUZXh0Lmxlbmd0aCA8PSAwXG4gICAgICAgICAgICBzZWxlY3RlZFRleHQgPSBvcHRpb25zLmluZml4XG4gICAgICAgIHNlbGVjdGVkTGVuZ3RoID0gc2VsZWN0ZWRUZXh0Lmxlbmd0aFxuICAgICAgICBuZXdUZXh0ID0gdGV4dC5yZXBsYWNlKCd7e3JlcGxhY2VtZW50fX0nLCBzZWxlY3RlZFRleHQpXG5cbiAgICAgICAgc2VsZWN0aW9uLnJldGFpblNlbGVjdGlvbiA9IHRydWVcbiAgICAgICAgc2VsZWN0aW9uLnBsYW50VGFpbCgpXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KFwiI3tuZXdUZXh0fVwiLCBvcHRpb25zKVxuICAgICAgICBzZWxlY3Rpb24ucmV0YWluU2VsZWN0aW9uID0gZmFsc2VcblxuICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmVcbiAgICAgICAgZXh0cmFTZWxlY3QgPSBzZWxlY3RlZExlbmd0aFxuICAgICAgICBpZiBvcHRpb25zLnJldmVyc2VcbiAgICAgICAgICBleHRyYU1vdmUgPSBvcHRpb25zLm1vdmUgKyBzZWxlY3RlZExlbmd0aFxuICAgICAgICAgIGV4dHJhU2VsZWN0ID0gMFxuXG4gICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZVJpZ2h0KG51bGwsIHsgbW92ZVRvRW5kT2ZTZWxlY3Rpb246IHRydWUgfSlcbiAgICAgICAgc2VsZWN0aW9uLmNsZWFyKClcbiAgICAgICAgaWYgb3B0aW9ucy5tb3ZlID4gMFxuICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFNb3ZlKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2VsZWN0ID09IHRydWVcbiAgICAgICAgICBpZiBzZWxlY3RlZExlbmd0aCA+IDBcbiAgICAgICAgICAgIHNlbGVjdGlvbi5jdXJzb3IubW92ZUxlZnQoZXh0cmFTZWxlY3QpXG5cbiAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0UmlnaHQoc2VsZWN0ZWRMZW5ndGgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzZWxlY3Rpb24uY2xlYXIoKVxuXG4gICAgICAgIGlmIG9wdGlvbnMuc2tpcFxuICAgICAgICAgIG9wdGlvbnMudW5kbyA9ICdza2lwJ1xufVxuXG5hdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvciAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgZ2xvYmFsLmUgPSBnYy5hY3RpdmVFZGl0b3IgPSBlZGl0b3JcblxuXG4jIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnYzpjb250cm9sLWZpbGVzJywgLT5cbiMgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiMgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCBcImFwcGxpY2F0aW9uOm5ldy13aW5kb3dcIilcbiNcbiMgICBleGVjKCdvcGVuIC1hIEF0b20gXCIkSE9NRS9Ecm9wYm94L0NvbnRyb2wtTWFzdGVyLnR4dFwiIFwiJEhPTUUvR29vZ2xlIERyaXZlcy9ub3BwaGFzaW4vRmluZWFydCBEcml2ZS9Db250cm9sLUZpbmVhcnQudHh0XCIgXCIkSE9NRS9Hb29nbGUgRHJpdmVzL25vcHBoYXNpbi9GaW5lYXJ0IERyaXZlL1BsZXNrX095bngudHh0XCInLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuIyAgICAgIyBjb25zb2xlLmVycm9yIGVycm9yXG4jICAgKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpzZWxlY3Qtb3V0c2lkZS1icmFja2V0JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICMgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKClcbiAgIyBpZiBjdXJzb3JzLmxlbmd0aFxuICAjICAgZm9yIGN1cnNvciBpbiBjdXJzb3JzXG4gICMgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGN1cnNvci5lZGl0b3IpLCBcImVkaXRvci5tb3ZlLXRvLWVuZC1vZi1saW5lXCIpXG4gICMgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGN1cnNvci5lZGl0b3IpLCBcImJyYWNrZXQtbWF0Y2hlcjpzZWxlY3QtaW5zaWRlLWJyYWNrZXRzXCIpXG4gICMgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGN1cnNvci5lZGl0b3IpLCBcImNvcmU6bW92ZS1yaWdodFwiKVxuICAjICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhjdXJzb3IuZWRpdG9yKSwgXCJicmFja2V0LW1hdGNoZXI6c2VsZWN0LWluc2lkZS1icmFja2V0c1wiKVxuICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCBcImJyYWNrZXQtbWF0Y2hlcjpzZWxlY3QtaW5zaWRlLWJyYWNrZXRzXCIpXG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiY29yZTptb3ZlLXJpZ2h0XCIpXG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwiYnJhY2tldC1tYXRjaGVyOnNlbGVjdC1pbnNpZGUtYnJhY2tldHNcIilcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxhZGUtZWNobycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiA0LCBpbmZpeDogJyR2YXInIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICd7ISEge3tyZXBsYWNlbWVudH19ICEhfScsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvcicsICdnYzpjb3B5LWZpbGVuYW1lJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGNsaXBib2FyZCA9IGVkaXRvci5nZXRGaWxlTmFtZSgpXG4gIGlmIGNsaXBib2FyZCAhPSAnJ1xuICAgIEdDLmNsaXBib2FyZCA9IGNsaXBib2FyZFxuICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKGNsaXBib2FyZClcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6Y29tcGlsZS1zYXNzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksIFwic2Fzcy1hdXRvY29tcGlsZTpjb21waWxlLXRvLWZpbGVcIilcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6cGFzdGUnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgaWYgR0MuY2xpcGJvYXJkICE9ICcnXG4gICAgY2xpcGJvYXJkID0gR0MuY2xpcGJvYXJkXG4gICAgZWRpdG9yLmluc2VydFRleHQoY2xpcGJvYXJkKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpjb3B5JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICBpZiBzZWxlY3RlZFRleHQgIT0gJydcbiAgICBjbGlwYm9hcmQgPSBzZWxlY3RlZFRleHRcbiAgICBHQy5jbGlwYm9hcmQgPSBjbGlwYm9hcmRcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmxhZGUtY29tbWVudCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiA1IH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICd7ey0tIHt7cmVwbGFjZW1lbnR9fSAtLX19Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aHRtbC1jb21tZW50JywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDQgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJzwhLS0ge3tyZXBsYWNlbWVudH19IC0tPicsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmJsb2NrLWNvbW1lbnQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnLyoge3tyZXBsYWNlbWVudH19ICovJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5saW5lLWNvbW1lbnQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJy8vIHt7cmVwbGFjZW1lbnR9fScsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmJsYWRlLWUnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMywgaW5maXg6ICckdmFyJyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAne3sge3tyZXBsYWNlbWVudH19IH19Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6dGFiLXN0b3AnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgcmV2ZXJzZTogZmFsc2UsIG1vdmU6IDEsIGluZml4OiAnJyB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnJHt7e3JlcGxhY2VtZW50fX19Jywgb3B0aW9ucylcbiAgIyBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnY29yZTptb3ZlLWxlZnQnKVxuICBlZGl0b3IubW92ZUxlZnQoMSwgZ2Mub3B0aW9ucyk7XG4gIGVkaXRvci5pbnNlcnRUZXh0KFwiOlwiLCBnYy5vcHRpb25zKTtcbiAgZWRpdG9yLm1vdmVMZWZ0KDEsIGdjLm9wdGlvbnMpO1xuICAjIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdjb3JlOm1vdmUtbGVmdCcpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOnBocC1lY2hvJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDQsIGluZml4OiAnJHZhcicgfVxuICByZXBsYWNlbWVudFRleHQgPSAnPD9waHAgZWNobyB7e3JlcGxhY2VtZW50fX07ID8+J1xuICBpZiBzZWxlY3Rpb25zLmxlbmd0aFxuICAgIHNlbGVjdGlvblNjb3BlcyA9IFtdXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBpc1NvdXJjZSA9IGZhbHNlXG4gICAgICBzY29wZXMgPSBzZWxlY3Rpb24uY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpLnNjb3Blc1xuICAgICAgZm9yIHNjb3BlIGluIHNjb3Blc1xuICAgICAgICBpZiBzY29wZS5zZWFyY2goJ3NvdXJjZS5waHAnKSA+PSAwXG4gICAgICAgICAgaXNTb3VyY2UgPSB0cnVlXG4gICAgICAgICAgcmVwbGFjZW1lbnRUZXh0ID0gJ2VjaG8ge3tyZXBsYWNlbWVudH19OydcbiAgICAgICAgICBvcHRpb25zLm1vdmUgPSAxXG4gICAgICAgICAgYnJlYWtcblxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgcmVwbGFjZW1lbnRUZXh0LCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpzcGFjZXMnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2tpcDogdHJ1ZSwgbW92ZTogMSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAnIHt7cmVwbGFjZW1lbnR9fSAnLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpwbHVzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDMgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ1xcJysge3tyZXBsYWNlbWVudH19ICtcXCcnLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpkb3RzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDMgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ1xcJy4ge3tyZXBsYWNlbWVudH19IC5cXCcnLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzpkcGx1cycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBza2lwOiB0cnVlLCBtb3ZlOiAzIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICdcIisge3tyZXBsYWNlbWVudH19ICtcIicsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmRkb3RzJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNraXA6IHRydWUsIG1vdmU6IDMgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJ1wiLiB7e3JlcGxhY2VtZW50fX0gLlwiJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LWJyJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNlbGVjdDogZmFsc2UsIHNraXA6IHRydWUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJzxicj4nLCBvcHRpb25zKVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtcHJvcGVydHknLCAtPlxuICBzbmlwcGV0Qm9keSA9ICdcIiR7MTprZXl9XCI6IFwiJDJcIiwkMCdcbiAgYXRvbS5wYWNrYWdlcy5hY3RpdmVQYWNrYWdlcy5zbmlwcGV0cz8ubWFpbk1vZHVsZT8uaW5zZXJ0IHNuaXBwZXRCb2R5XG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtcHJvcGVydHktYXJyYXknLCAtPlxuICBzbmlwcGV0Qm9keSA9ICdcIiR7MTprZXl9XCI6IFskMl0sJDAnXG4gIGF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXMuc25pcHBldHM/Lm1haW5Nb2R1bGU/Lmluc2VydCBzbmlwcGV0Qm9keVxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXByb3BlcnR5LW9iamVjdCcsIC0+XG4gIHNuaXBwZXRCb2R5ID0gJ1wiJHsxOmtleX1cIjogXFx7JDJcXH0sJDAnXG4gIGF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXMuc25pcHBldHM/Lm1haW5Nb2R1bGU/Lmluc2VydCBzbmlwcGV0Qm9keVxuXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdnYzppbnNlcnQtcCcsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBzZWxlY3Q6IGZhbHNlLCBza2lwOiB0cnVlIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICc8cD4mbmJzcDs8L3A+Jywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6aW5zZXJ0LXNwYWNlJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gIG9wdGlvbnMgPSB7IHNlbGVjdDogZmFsc2UsIHNraXA6IHRydWUgfVxuICBnYy5tdXRhdGVTZWxlY3RlZFRleHQoc2VsZWN0aW9ucywgJyZuYnNwOycsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1wYXJlbnRoZXNpcycsIC0+XG4gIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBzZWxlY3Rpb25zID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICBvcHRpb25zID0geyBzZWxlY3Q6IGZhbHNlLCBza2lwOiB0cnVlIH1cbiAgZ2MubXV0YXRlU2VsZWN0ZWRUZXh0KHNlbGVjdGlvbnMsICcoKScsIG9wdGlvbnMpXG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmluc2VydC1saW5lYnJlYWsnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSB9XG4gIGdjLm11dGF0ZVNlbGVjdGVkVGV4dChzZWxlY3Rpb25zLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJywgb3B0aW9ucylcblxuYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ2M6YmlvLWxpbmsnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgb3B0aW9ucyA9IHsgc2VsZWN0OiBmYWxzZSwgc2tpcDogdHJ1ZSwgcmV2ZXJzZTogZmFsc2UsIGluZml4OiAnJyB9XG5cbiAgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gIGNsaXBib2FyZFRleHQgPSBhdG9tLmNsaXBib2FyZC5yZWFkKClcbiAgaWYgIWNsaXBib2FyZFRleHQgfHwgdHlwZW9mIGNsaXBib2FyZFRleHQgIT0gJ3N0cmluZydcbiAgICBjbGlwYm9hcmRUZXh0ID0gJydcblxuICBlZGl0b3IuaW5zZXJ0VGV4dChcIjxhIGhyZWY9XFxcIiN7Y2xpcGJvYXJkVGV4dH1cXFwiIHRpdGxlPVxcXCIje3NlbGVjdGVkVGV4dH1cXFwiPiN7c2VsZWN0ZWRUZXh0fTwvYT5cIiwgZ2Mub3B0aW9ucylcbiAgIyBzbmlwcGV0Qm9keSA9ICc8YSBocmVmPVwiXCIgdGl0bGU9XCJfX3JlcGxhY2VtZW50X19cIj5fX3JlcGxhY2VtZW50X188L2E+JDAnXG4gICMgYXRvbS5wYWNrYWdlcy5hY3RpdmVQYWNrYWdlcy5zbmlwcGV0cz8ubWFpbk1vZHVsZT8uaW5zZXJ0IHNuaXBwZXRCb2R5XG5cbmF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2djOmJpby1saW5rLXJldmVyc2UnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gIGV4cGFuZGluZyhlZGl0b3IpXG4gICMgd2hpbGUgc2VsZWN0ZWRUZXh0LnN1YnN0cigtMSwgMSkgIT0gJ30nXG4gICMgICBlZGl0b3Iuc2VsZWN0VG9OZXh0V29yZEJvdW5kYXJ5KClcbiAgIyAgIHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuXG5cbmZpbmRDaGFyYWN0ZXJzID0gKHRleHQgPSAnJywgZmluZCA9IFtdKSAtPlxuICBpZiB0eXBlb2YgdGV4dCAhPSAnc3RyaW5nJ1xuICAgIHJldHVybiBmYWxzZVxuXG4gIGlmICFmaW5kIHx8IGZpbmQubGVuZ3RoID09IDBcbiAgICByZXR1cm4gZmFsc2VcblxuICBpZiB0eXBlb2YgZmluZCA9PSAnc3RyaW5nJ1xuICAgIGZpbmQgPSBuZXcgQXJyYXkoZmluZClcblxuICBpc0ZvdW5kZWQgPSBmYWxzZVxuICBmb3IgaXRlbSBpbiBmaW5kXG4gICAgaWYgdGV4dC5zZWFyY2goaXRlbSkgPj0gMFxuICAgICAgaXNGb3VuZGVkID0gdGV4dC5zZWFyY2goaXRlbSlcbiAgICAgIGJyZWFrXG4gIHJldHVybiBpc0ZvdW5kZWRcblxuZ2MuZmlyc3RDaGFyYWN0ZXIgPSBmaXJzdENoYXJhY3RlciA9ICh0ZXh0ID0gJycpIC0+XG4gIGlmIHR5cGVvZiB0ZXh0ICE9ICdzdHJpbmcnXG4gICAgcmV0dXJuXG4gIHJldHVybiB0ZXh0LnN1YnN0cigwLCAxKVxuXG5nYy5sYXN0Q2hhcmFjdGVyID0gbGFzdENoYXJhY3RlciA9ICh0ZXh0ID0gJycpIC0+XG4gIGlmIHR5cGVvZiB0ZXh0ICE9ICdzdHJpbmcnXG4gICAgcmV0dXJuXG4gIHJldHVybiB0ZXh0LnN1YnN0cigtMSlcblxuZ2MuZXhwYW5kaW5nID0gZXhwYW5kaW5nID0gKGVkaXRvciwgc2VsZWN0ZWRUZXh0ID0gJycpIC0+XG4gIGlmIHR5cGVvZiBzZWxlY3RlZFRleHQgIT0gJ3N0cmluZycgfHwgIXNlbGVjdGVkVGV4dFxuICAgIHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuXG4gIGlmIGxhc3RDaGFyYWN0ZXIoc2VsZWN0ZWRUZXh0KSAhPSAnfSdcbiAgICBjb25zb2xlLmxvZyAnbm8nXG4gICAgZWRpdG9yLnNlbGVjdFRvTmV4dFdvcmRCb3VuZGFyeSgpXG4gICAgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgaWYgZmluZENoYXJhY3RlcnMoc2VsZWN0ZWRUZXh0LCBcIlxcblwiKSA9PSBmYWxzZVxuICAgICAgY29uc29sZS5sb2cgJ2ZhbHNlJ1xuICAgICAgZXhwYW5kaW5nKGVkaXRvciwgc2VsZWN0ZWRUZXh0KVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nICdzdG9wcGVkJ1xuICAgICAgZWRpdG9yLm1vdmVMZWZ0KClcbiAgZWxzZVxuICAgIGlmIGZpcnN0Q2hhcmFjdGVyKHNlbGVjdGVkVGV4dCkgIT0gJ3snXG4gICAgICBjb25zb2xlLmxvZyAnbm8nXG4gICAgICBlZGl0b3IubW92ZVJpZ2h0KClcbiAgICAgIGVkaXRvci5zZWxlY3RUb1ByZXZpb3VzV29yZEJvdW5kYXJ5KClcbiAgICAgIHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgICAgaWYgZmluZENoYXJhY3RlcnMoc2VsZWN0ZWRUZXh0LCBcIlxcblwiKSA9PSBmYWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnZmFsc2UnXG4gICAgICAgIGV4cGFuZGluZyhlZGl0b3IsIHNlbGVjdGVkVGV4dClcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ3N0b3BwZWQnXG4gICAgICAgIGVkaXRvci5tb3ZlUmlnaHQoKVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nICd5ZXMnXG4gICAgICBjb25zb2xlLmxvZyBzZWxlY3RlZFRleHRcblxuIyBsaXN0ZW5Ub0tleVByZXNzZWQgPSAoZWRpdG9yKSAtPlxuIyAgICMgZWRpdG9yLm9uRGlkQ2hhbmdlIChlKSAtPlxuIyAgICMgICBjb25zb2xlLmxvZyBlZGl0b3JcbiMgICAjICAgY29uc29sZS5sb2cgZWRpdG9yLmdldEJ1ZmZlcigpXG4jICAgIyAgIGNvbnNvbGUubG9nIGVkaXRvci5nZXRCdWZmZXIoKS5nZXRDaGFuZ2VzU2luY2VDaGVja3BvaW50KClcbiMgICAjICAgY29uc29sZS5sb2cgZVxuIyAgICMgICAjIGNvbnNvbGUubG9nIGVbMF0ub2xkRXh0ZW50XG4jICAgIyAgICMgY29uc29sZS5sb2cgZVswXS5vbGRFeHRlbnQudG9TdHJpbmcoKVxuIyAgICMgICAjXG4jICAgIyAgICNcbiNcbiMgbGlzdGVuVG9CdWZmZXJzID0gKGVkaXRvcikgLT5cbiMgICBlZGl0b3IuYnVmZmVyLm9uRGlkU3RvcENoYW5naW5nIChlKSAtPlxuIyAgICAgaXNNYXRjaGVzID0gZmFsc2VcbiMgICAgIGNvbnNvbGUubG9nIGVcbiMgICAgIGlmIGUuY2hhbmdlcy5sZW5ndGggPiAwXG4jICAgICAgIGZvciBjaGFuZ2UgaW4gZS5jaGFuZ2VzXG4jICAgICAgICAgY29uc29sZS5sb2cgY2hhbmdlLm5ld1RleHRcbiMgICAgICAgICBpZiBjaGFuZ2UubmV3VGV4dCA9PSAnLy8vLydcbiMgICAgICAgICAgIGlzTWF0Y2hlcyA9IHRydWVcbiNcbiNcbiMgICAgIGlmIGlzTWF0Y2hlcyA9PSB0cnVlXG4jICAgICAgIGVkaXRvci5zZWxlY3RMZWZ0KDQpXG4jICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiLy8gZm9vXFxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1wiKVxuIyAgICAgICBlZGl0b3IubW92ZUxlZnQoNDEpXG4jICAgICAgIGVkaXRvci5zZWxlY3RMZWZ0KDQpXG4jXG4jIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yIC0+XG4jICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4jICAgIyBsaXN0ZW5Ub0tleVByZXNzZWQoZWRpdG9yKVxuIyAgICMgbGlzdGVuVG9CdWZmZXJzKGVkaXRvcilcbiJdfQ==
