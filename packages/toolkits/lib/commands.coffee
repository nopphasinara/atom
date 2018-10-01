module.exports =
  activate: (state) ->
    global.gc = {
      init: () ->
        console.log atom
        console.log atom.workspace
        console.log atom.workspace.getActiveTextEditor()
      workspace: () ->
        return atom.workspace
      editor: () ->
        return atom.workspace.getActiveTextEditor()
      selections: () ->
        return atom.workspace.getActiveTextEditor().getSelections()
      buffer: () ->
        return atom.workspace.getActiveTextEditor().getBuffer()
      extend: (object, properties) ->
        for key, val of properties
          object[key] = val

        return object
      mutateSelectedText: (selections, text = '{{replacement}}', args = {}) ->
        options = gc.extend({
          select: true,
          undo: '',
          skip: false,
          move: 0,
          infix: '',
          reverse: false,
        }, args)

        if selections.length
          for selection in selections
            oldPosition = selection.cursor.marker.getScreenRange()
            selectedText = selection.getText()
            isReversed = selection.marker.bufferMarker.isReversed()
            if options.infix
              if selectedText.length <= 0
                selectedText = options.infix
            selectedLength = selectedText.length
            newText = text.replace('{{replacement}}', selectedText)

            selection.retainSelection = true
            selection.plantTail()
            selection.insertText("#{newText}", options)
            selection.retainSelection = false

            extraMove = options.move
            extraSelect = selectedLength
            if options.reverse
              extraMove = options.move + selectedLength
              extraSelect = 0

            selection.cursor.moveRight(null, { moveToEndOfSelection: true })
            selection.clear()
            if options.move > 0
              selection.cursor.moveLeft(extraMove)

            if options.select == true
              if selectedLength > 0
                selection.cursor.moveLeft(extraSelect)

              selection.selectRight(selectedLength)
            else
              selection.clear()

            if options.skip
              options.undo = 'skip'
    }


    atom.commands.add 'atom-text-editor', 'gc:blade-echo', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 4, infix: '$var' }
      gc.mutateSelectedText(selections, '{!! {{replacement}} !!}', options)

    atom.commands.add 'atom-workspace, atom-text-editor', 'gc:copy-filename', ->
      editor = atom.workspace.getActiveTextEditor()
      clipboard = editor.getFileName()
      if clipboard != ''
        GC.clipboard = clipboard
        atom.clipboard.write(clipboard)

    atom.commands.add 'atom-text-editor', 'gc:compile-sass', ->
      editor = atom.workspace.getActiveTextEditor()
      atom.commands.dispatch(atom.views.getView(editor), "sass-autocompile:compile-to-file")

    atom.commands.add 'atom-text-editor', 'gc:paste', ->
      editor = atom.workspace.getActiveTextEditor()
      if GC.clipboard != ''
        clipboard = GC.clipboard
        editor.insertText(clipboard)

    atom.commands.add 'atom-text-editor', 'gc:copy', ->
      editor = atom.workspace.getActiveTextEditor()
      selectedText = editor.getSelectedText()
      if selectedText != ''
        clipboard = selectedText
        GC.clipboard = clipboard

    atom.commands.add 'atom-text-editor', 'gc:blade-comment', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 5 }
      gc.mutateSelectedText(selections, '{{-- {{replacement}} --}}', options)

    atom.commands.add 'atom-text-editor', 'gc:html-comment', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 4 }
      gc.mutateSelectedText(selections, '<!-- {{replacement}} -->', options)

    atom.commands.add 'atom-text-editor', 'gc:block-comment', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3 }
      gc.mutateSelectedText(selections, '/* {{replacement}} */', options)

    atom.commands.add 'atom-text-editor', 'gc:inline-comment', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, }
      gc.mutateSelectedText(selections, '// {{replacement}}', options)

    atom.commands.add 'atom-text-editor', 'gc:blade-e', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3, infix: '$var' }
      gc.mutateSelectedText(selections, '{{ {{replacement}} }}', options)

    atom.commands.add 'atom-text-editor', 'gc:tab-stop', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, reverse: false, move: 1, infix: '' }
      gc.mutateSelectedText(selections, '${{{replacement}}}', options)

    atom.commands.add 'atom-text-editor', 'gc:php-echo', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 4, infix: '$var' }
      replacementText = '<?php echo {{replacement}}; ?>'
      if selections.length
        selectionScopes = []
        for selection in selections
          isSource = false
          scopes = selection.cursor.getScopeDescriptor().scopes
          for scope in scopes
            if scope.search('source.php') >= 0
              isSource = true
              replacementText = 'echo {{replacement}};'
              options.move = 1
              break

      gc.mutateSelectedText(selections, replacementText, options)

    atom.commands.add 'atom-text-editor', 'gc:spaces', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 1 }
      gc.mutateSelectedText(selections, ' {{replacement}} ', options)

    atom.commands.add 'atom-text-editor', 'gc:plus', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3 }
      gc.mutateSelectedText(selections, '\'+ {{replacement}} +\'', options)

    atom.commands.add 'atom-text-editor', 'gc:dots', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3 }
      gc.mutateSelectedText(selections, '\'. {{replacement}} .\'', options)

    atom.commands.add 'atom-text-editor', 'gc:dplus', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3 }
      gc.mutateSelectedText(selections, '"+ {{replacement}} +"', options)

    atom.commands.add 'atom-text-editor', 'gc:ddots', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { skip: true, move: 3 }
      gc.mutateSelectedText(selections, '". {{replacement}} ."', options)

    atom.commands.add 'atom-text-editor', 'gc:insert-br', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { select: false, skip: true }
      gc.mutateSelectedText(selections, '<br>', options)

    atom.commands.add 'atom-text-editor', 'gc:insert-p', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { select: false, skip: true }
      gc.mutateSelectedText(selections, '<p>&nbsp;</p>', options)

    atom.commands.add 'atom-text-editor', 'gc:insert-space', ->
      editor = atom.workspace.getActiveTextEditor()
      selections = editor.getSelections()
      options = { select: false, skip: true }
      gc.mutateSelectedText(selections, '&nbsp;', options)

  initialize: () ->
    this.activate()
