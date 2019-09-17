# ~/.atom/init.coffee

# pathToFunctionsFile = "./functions"
#
# global.functions = require(pathToFunctionsFile)
#
# Object.defineProperty global, 'functions', get: ->
#   delete require.cache[require.resolve(pathToFunctionsFile)]
#   require(pathToFunctionsFile)
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     functions.onSave(editor)


url = require('url')
{shell} = require('electron')
_ = require('underscore-plus')
link = require 'link'
{exec} = require 'child_process'
# link = require './packages/link/lib/link.js'


global.activeEditor = () ->
  return atom.workspace.getActiveTextEditor()

global.exec = exec


# addEventListener('fetch', event => {
#   event.respondWith(handleRequest(event.request))
# })
#
# # Respond to the request
# # @param {Request} request
# async function handleRequest(request) {
#   return new Response('hello world', {
#     status: 200,
#   })
# }


global.getMethods = (obj, options = {}) ->
  if options.returnAs && options.returnAs.toLowerCase() != 'string'
    options.returnAs = 'array'

  options = mergeObject({
    returnAs: 'array',
  }, options)

  properties = []
  currentObj = obj
  if (currentObj = Object.getPrototypeOf(currentObj))
    Object.getOwnPropertyNames(currentObj).map((item, key) ->
      properties.push(item)
    )
    filtered = properties.filter((item, key) ->
      return (typeof obj[item] == 'function')
    )

    if filtered.length > 0
      if options.returnAs == 'string'
        return filtered.join(', ')
      else
        return filtered


mergeObject = (obj = {}, source = {}) ->
  if source && Object.getOwnPropertyNames(source).length > 0
    for key, value of source
      obj[key] = value

  return obj


getOptions = (options = {}) ->
  options = mergeObject({
    select: true,
    skip: false,
    undo: '',
    useSnippet: false,
  }, options)

  return options


mutateSelectedText = (selections, options = {}) ->
  options = mergeObject({
    select: true,
    skip: false,
    undo: '',
    useSnippet: false,
  }, options)

  for selection in selections
    options.selectedText = selectedText = selection.getText()
    selection.retainSelection = true
    selection.plantTail()

    insertText = "/*{{replacement}}*/"
    insertText = insertText.replace("{{replacement}}", "#{selectedText}")
    selection.insertText(insertText, options)

    selection.retainSelection = false


## Custom Commands

#
atom.workspace.observeActiveTextEditor ->
  editor = activeEditor()
  # functions.onSave(editor)


# Comment wrap with /* ... */
atom.commands.add "atom-text-editor", "nerd:wrap-inline-comment", ->
  # editor.autoIndentSelectedRows()

  options = getOptions({
    select: true,
    undo: 'skip',
    skip: true,
  })
  editor = atom.workspace.getActiveTextEditor()
  selections = editor.getSelections()
  callback = (selections, options = {}) ->
    options = getOptions(options)
    for selection in selections
      selectedText = selection.getText()
      selection.retainSelection = true
      selection.plantTail()
      selection.insertText("/* #{selectedText} */", options)
      selection.cursor.moveLeft(selectedText.length + 3)
      if selectedText.length > 0
        selection.selectRight(selectedText.length)
      selection.retainSelection = false

  if selections && selections.length > 0
    callback(selections, options)


# Insert <?php echo ...; ?>
atom.commands.add "atom-text-editor", "nerd:php-echo", ->
  options = getOptions({
    select: true,
    undo: 'skip',
    skip: true,
  })
  editor = atom.workspace.getActiveTextEditor()
  rootScope = editor.getCursorScope().scopes.shift();
  selections = editor.getSelections()
  callback = (selections, options = {}) ->
    options = getOptions(options)
    for selection in selections
      selectedText = selection.getText()
      insertText = "<?php echo \"#{selectedText}\"; ?>"
      moveLeft = selectedText.length + 6
      selectRight = selectedText.length + 2
      selection.retainSelection = true
      selection.plantTail()
      if rootScope == "text.html.php.blade"
        insertText = "{{ \"#{selectedText}\" }}"
        moveLeft = selectedText.length + 5

      selection.insertText("#{insertText}", options)
      selection.cursor.moveLeft(moveLeft)
      if selectRight > 0
        selection.selectRight(selectRight)
      selection.retainSelection = false

  if selections && selections.length > 0
    callback(selections, options)


#
atom.commands.add 'atom-text-editor', 'nerd:bio-link', ->
  editor = atom.workspace.getActiveTextEditor()
  clipboardText = ''
  selectedText = ''
  if editor.getSelectedText()
    selectedText = editor.getSelectedText()

  if atom.clipboard.read()
    clipboardText = atom.clipboard.read()

  if !selectedText || !clipboardText
    return

  snippets = atom.packages.getActivePackage('snippets')
  if (snippets)
    snippetsService = snippets.mainModule
    snippetsService.insert "<a href=\"#{clipboardText}\"${1: ${2:title=\"${3:#{selectedText}}\"}}>${4:#{selectedText}}</a>$0"
  # atom.packages.activePackages.snippets?.mainModule?.insert "<a href=\"#{clipboardText}\" title=\"${1:#{selectedText}}\">${2:#{selectedText}}</a>$0"


# Open link
atom.commands.add 'atom-text-editor', 'nerd:link-open', ->
  editor = atom.workspace.getActiveTextEditor()
  selectedText = editor.getSelectedText()
  if selectedText
    {protocol} = url.parse(selectedText)
    if protocol == 'http:' || protocol == 'https:'
      shell.openExternal(selectedText)
    else
      shell.openExternal("http://#{selectedText}")
  else
    atom.commands.dispatch(atom.views.getView(editor), "link:open")
    # link.openLink()


# sss
atom.commands.add 'atom-text-editor', 'nerd:select-outside-brackets', ->
  editor = atom.workspace.getActiveTextEditor()
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")
  atom.commands.dispatch(atom.views.getView(editor), "core:move-right")
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")


global.getHeadAndTailCharacters = (text) ->
  if (text)
    return [
      text.substr(0, 1),
      text.substr(-1, 1),
    ]
  return []


global.havePunctuation = (arr = []) ->
  if (arr.length > 0 && (arr.indexOf("}") >= 0 || arr.indexOf(")") >= 0))
    return true
  return false


global.selectedTextHaveNewline = (text = "") ->
  if (text && (text.substr(0, 1) == "\n" || text.substr(-1, 1) == "\n"))
    return true
  return false


global.displayNotification = (message = "", type = "info", options = {}) ->
  options = mergeObject({
    dismissable: false,
  }, options)

  if (type == "info")
    atom.notifications.addInfo(message, options)
  if (type == "warning")
    atom.notifications.addWarning(message, options)
  if (type == "error")
    atom.notifications.addError(message, options)
  if (type == "fatalError")
    atom.notifications.addFatalError(message, options)
  if (type == "success")
    atom.notifications.addSuccess(message, options)


# sss
atom.commands.add "atom-text-editor", "nerd:select-inside-brackets", ->
  editor = atom.workspace.getActiveTextEditor()
  atom.commands.dispatch(atom.views.getView(editor), "nerd:select-outside-brackets")
  selections = editor.getSelections()
  if selections.length
    selection = selections[0]
    if selection.getText()
      selectedText = selection.getText()
      selectedText = selectedText.substr(1, selectedText.length - 2)
      newSelectedText = selectedText
      leftSpace = false
      rightSpace = false
      if selectedTextHaveNewline(newSelectedText)
        selection.editor.moveRight()
        selection.editor.moveLeft()
        selection.editor.selectLeft(newSelectedText.length)
      else
        if newSelectedText.substr(0, 1) == " "
          leftSpace = true
        if newSelectedText.substr(-1, 1) == " "
          rightSpace = true

        newSelectedText = newSelectedText.trim("\s")
        if newSelectedText
          selectLeft = newSelectedText.length
          diffLength = selectedText.length - newSelectedText.length
          selection.editor.moveRight()
          selection.editor.moveLeft()
          if rightSpace
            selection.editor.moveLeft()
          if selection.isSingleScreenLine()
            # body...
          else
            selectLeft = selectLeft + 2
          selection.editor.selectLeft(selectLeft)

        # displayNotification("#{leftSpace}:#{rightSpace}")
        # displayNotification("#{newSelectedText}")
        # displayNotification("#{diffLength}")


# sss
atom.commands.add 'atom-text-editor', 'nerd:select-line', ->
  editor = atom.workspace.getActiveTextEditor()
  atom.commands.dispatch(atom.views.getView(editor), "editor:move-to-end-of-line")
  atom.commands.dispatch(atom.views.getView(editor), "editor:select-to-beginning-of-line")
  # atom.commands.dispatch(atom.views.getView(editor), "core:select-left")
  atom.commands.dispatch(atom.views.getView(editor), "editor:select-to-first-character-of-line")

atom.commands.add 'atom-text-editor', 'nerd:select-line-copy', ->
  editor = atom.workspace.getActiveTextEditor()
  atom.commands.dispatch(atom.views.getView(editor), "editor:move-to-end-of-line")
  atom.commands.dispatch(atom.views.getView(editor), "editor:select-to-beginning-of-line")
  # atom.commands.dispatch(atom.views.getView(editor), "core:select-left")
  atom.commands.dispatch(atom.views.getView(editor), "editor:select-to-first-character-of-line")
  atom.commands.dispatch(atom.views.getView(editor), "core:copy")


# sss
atom.commands.add 'atom-text-editor', 'nerd:toggle-fold', ->
  editor = atom.workspace.getActiveTextEditor()
  cursors = editor.getCursors()
  if cursors.length > 0
    cursors = cursors.reverse()
    for cursor in cursors
      editor.toggleFoldAtBufferRow(cursor.getBufferRow())

atom.commands.add 'atom-text-editor', 'nerd:fold', ->
  editor = atom.workspace.getActiveTextEditor()
  cursors = editor.getCursors()
  if cursors.length > 0
    cursors = cursors.reverse()
    for cursor in cursors
      cursor.editor.foldBufferRow(cursor.getBufferRow(), true)
      # editor.foldBufferRow(cursor.getScreenRow(), true)

atom.commands.add 'atom-text-editor', 'nerd:unfold', ->
  editor = atom.workspace.getActiveTextEditor()
  cursors = editor.getCursors()
  if cursors.length > 0
    cursors = cursors.reverse()
    for cursor in cursors
      cursor.editor.unfoldBufferRow(cursor.getBufferRow(), true)
      # editor.unfoldBufferRow(cursor.getScreenRow(), true)


# Reveal active file in Finder
atom.commands.add 'atom-text-editor', 'nerd:reveal-in-finder', ->
  editor = atom.workspace.getActiveTextEditor()
  filepath = editor.getPath()
  if filepath
    treeView = atom.packages.getActivePackage("tree-view")
    if treeView
      treeViewService = treeView.mainModule
      treeViewService.treeView.showCurrentFileInFileManager()

    # exec "ls \"#{filepath}\" 2>/dev/null", (error, stdout, stderr) =>
    #   if error
    #     error = error.toString().replace("Error: ", "")
    #     console.error "exec error: #{error}"
    #   else
    #     treeView = atom.packages.getActivePackage("tree-view")
    #     if treeView
    #       treeViewService = treeView.mainModule
    #       treeViewService.treeView.showCurrentFileInFileManager()


# In init.coffee
# atom.packages.onDidActivateInitialPackages(() => {
#   const gitPlus = atom.packages.getActivePackage('git-plus')
#   if (gitPlus) {
#     const gp = gitPlus.mainModule.provideService()
#     // commands go here, see below
#   }
# })

# atom.packages.onDidActivateInitialPackages () ->
# if gitPlus = atom.packages.getActivePackage('git-plus')?.mainModule.provideService()
#   gitPlus.registerCommand 'atom-text-editor', 'custom-git-commands:undo-last-commit', ->
#     gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
#     .then (repo) -> gitPlus.run repo, 'reset HEAD~1'
#
#     gitPlus.registerCommand 'atom-text-editor', 'akonwi:unstage-last-commit', ->
#       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
#       .then (repo) -> gitPlus.run repo, 'reset HEAD~1'
#
#     gitPlus.registerCommand 'atom-text-editor', 'akonwi:update-last-commit', ->
#       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
#       .then (repo) -> gitPlus.run repo, 'commit --all --amend --no-edit'
#
#     gitPlus.registerCommand 'atom-text-editor', 'akonwi:use-the-force', ->
#       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
#       .then (repo) -> gitPlus.run repo, 'push --force-with-lease'



# wrapBlock = () ->
#   editor = atom.workspace.getActiveTextEditor()
#   rangesToWrap = editor.getSelectedBufferRanges().filter((r) -> !r.isEmpty())
#   if rangesToWrap.length
#     rangesToWrap.sort((a, b) ->
#       return if a.start.row > b.start.row then -1 else 1
#     ).forEach((range) ->
#       text = editor.getTextInBufferRange(range)
#       if (/^\s*\{\s*/.test(text) && /\s*\}\s*/.test(text))
#         # unwrap each selection from its block
#         editor.setTextInBufferRange(range, text.replace(/\{\s*/, '').replace(/\s*\}/, ''))
#       else
#         # wrap each selection in a block
#         editor.setTextInBufferRange(range, '{\n' + text + '\n}')
#     )
#     editor.autoIndentSelectedRows()
#   else
#     # create an empty block at each cursor
#     editor.insertText('{\n\n}')
#     editor.selectUp(2)
#     editor.autoIndentSelectedRows()
#     editor.moveRight()
#     editor.moveUp()
#     editor.moveToEndOfLine()
