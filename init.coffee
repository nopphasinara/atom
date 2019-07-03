ChildProcess = require 'child_process'
exec = ChildProcess.exec

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
    options = gc.options = gc.extend({
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

atom.workspace.observeActiveTextEditor ->
  editor = atom.workspace.getActiveTextEditor()
  global.e = gc.activeEditor = editor


# atom.commands.add 'atom-workspace', 'gc:control-files', ->
#   editor = atom.workspace.getActiveTextEditor()
#   atom.commands.dispatch(atom.views.getView(editor), "application:new-window")
#
#   exec('open -a Atom "$HOME/Dropbox/Control-Master.txt" "$HOME/Google Drives/nopphasin/Fineart Drive/Control-Fineart.txt" "$HOME/Google Drives/nopphasin/Fineart Drive/Plesk_Oynx.txt"', (error, stdout, stderr) ->
#     # console.error error
#   )

atom.commands.add 'atom-text-editor', 'gc:select-outside-bracket', ->
  editor = atom.workspace.getActiveTextEditor()
  # cursors = editor.getCursors()
  # if cursors.length
  #   for cursor in cursors
  #     atom.commands.dispatch(atom.views.getView(cursor.editor), "editor.move-to-end-of-line")
  #     atom.commands.dispatch(atom.views.getView(cursor.editor), "bracket-matcher:select-inside-brackets")
  #     atom.commands.dispatch(atom.views.getView(cursor.editor), "core:move-right")
  #     atom.commands.dispatch(atom.views.getView(cursor.editor), "bracket-matcher:select-inside-brackets")
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")
  atom.commands.dispatch(atom.views.getView(editor), "core:move-right")
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")

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
  # atom.commands.dispatch(atom.views.getView(editor), 'core:move-left')
  editor.moveLeft(1, gc.options);
  editor.insertText(":", gc.options);
  editor.moveLeft(1, gc.options);
  # atom.commands.dispatch(atom.views.getView(editor), 'core:move-left')

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

atom.commands.add 'atom-text-editor', 'gc:insert-property', ->
  snippetBody = '"${1:key}": "$2",$0'
  atom.packages.activePackages.snippets?.mainModule?.insert snippetBody
atom.commands.add 'atom-text-editor', 'gc:insert-property-array', ->
  snippetBody = '"${1:key}": [$2],$0'
  atom.packages.activePackages.snippets?.mainModule?.insert snippetBody
atom.commands.add 'atom-text-editor', 'gc:insert-property-object', ->
  snippetBody = '"${1:key}": \{$2\},$0'
  atom.packages.activePackages.snippets?.mainModule?.insert snippetBody

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

atom.commands.add 'atom-text-editor', 'gc:insert-parenthesis', ->
  editor = atom.workspace.getActiveTextEditor()
  selections = editor.getSelections()
  options = { select: false, skip: true }
  gc.mutateSelectedText(selections, '()', options)

atom.commands.add 'atom-text-editor', 'gc:insert-linebreak', ->
  editor = atom.workspace.getActiveTextEditor()
  selections = editor.getSelections()
  options = { select: false, skip: true }
  gc.mutateSelectedText(selections, '————————————————————————————————', options)

atom.commands.add 'atom-text-editor', 'gc:bio-link', ->
  editor = atom.workspace.getActiveTextEditor()
  selections = editor.getSelections()
  options = { select: false, skip: true, reverse: false, infix: '' }

  selectedText = editor.getSelectedText()
  clipboardText = atom.clipboard.read()
  if !clipboardText || typeof clipboardText != 'string'
    clipboardText = ''

  editor.insertText("<a href=\"#{clipboardText}\" title=\"#{selectedText}\">#{selectedText}</a>", gc.options)
  # snippetBody = '<a href="" title="__replacement__">__replacement__</a>$0'
  # atom.packages.activePackages.snippets?.mainModule?.insert snippetBody

atom.commands.add 'atom-text-editor', 'gc:bio-link-reverse', ->
  editor = atom.workspace.getActiveTextEditor()
  selectedText = editor.getSelectedText()
  expanding(editor)
  # while selectedText.substr(-1, 1) != '}'
  #   editor.selectToNextWordBoundary()
  #   selectedText = editor.getSelectedText()


findCharacters = (text = '', find = []) ->
  if typeof text != 'string'
    return false

  if !find || find.length == 0
    return false

  if typeof find == 'string'
    find = new Array(find)

  isFounded = false
  for item in find
    if text.search(item) >= 0
      isFounded = text.search(item)
      break
  return isFounded

gc.firstCharacter = firstCharacter = (text = '') ->
  if typeof text != 'string'
    return
  return text.substr(0, 1)

gc.lastCharacter = lastCharacter = (text = '') ->
  if typeof text != 'string'
    return
  return text.substr(-1)

gc.expanding = expanding = (editor, selectedText = '') ->
  if typeof selectedText != 'string' || !selectedText
    selectedText = editor.getSelectedText()

  if lastCharacter(selectedText) != '}'
    console.log 'no'
    editor.selectToNextWordBoundary()
    selectedText = editor.getSelectedText()
    if findCharacters(selectedText, "\n") == false
      console.log 'false'
      expanding(editor, selectedText)
    else
      console.log 'stopped'
      editor.moveLeft()
  else
    if firstCharacter(selectedText) != '{'
      console.log 'no'
      editor.moveRight()
      editor.selectToPreviousWordBoundary()
      selectedText = editor.getSelectedText()
      if findCharacters(selectedText, "\n") == false
        console.log 'false'
        expanding(editor, selectedText)
      else
        console.log 'stopped'
        editor.moveRight()
    else
      console.log 'yes'
      console.log selectedText

# listenToKeyPressed = (editor) ->
#   # editor.onDidChange (e) ->
#   #   console.log editor
#   #   console.log editor.getBuffer()
#   #   console.log editor.getBuffer().getChangesSinceCheckpoint()
#   #   console.log e
#   #   # console.log e[0].oldExtent
#   #   # console.log e[0].oldExtent.toString()
#   #   #
#   #   #
#
# listenToBuffers = (editor) ->
#   editor.buffer.onDidStopChanging (e) ->
#     isMatches = false
#     console.log e
#     if e.changes.length > 0
#       for change in e.changes
#         console.log change.newText
#         if change.newText == '////'
#           isMatches = true
#
#
#     if isMatches == true
#       editor.selectLeft(4)
#       editor.insertText("// foo\n////////////////////////////////////////")
#       editor.moveLeft(41)
#       editor.selectLeft(4)
#
# atom.workspace.observeActiveTextEditor ->
#   editor = atom.workspace.getActiveTextEditor()
#   # listenToKeyPressed(editor)
#   # listenToBuffers(editor)
