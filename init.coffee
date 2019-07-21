url = require('url')
{shell} = require('electron')
_ = require('underscore-plus')
link = require 'link'
# link = require './packages/link/lib/link.js'


global.activeEditor = () ->
  return atom.workspace.getActiveTextEditor()

## Custom Commands

#
atom.workspace.observeActiveTextEditor ->
  editor = activeEditor()


# Comment wrap with /* ... */
atom.commands.add "atom-text-editor", "nerd:wrap-inline-comment", ->
  options = {
    select: true,
    undo: '',
    skip: false,
  }
  editor = atom.workspace.getActiveTextEditor()
  selections = editor.getSelections()
  console.log selections
  if selections.length > 0
    for selection in selections
      insertText = "/*{{replacement}}*/"
      selectedText = selection.getText()
      insertText = insertText.replace("{{replacement}}", "#{selectedText}")

      selection.retainSelection = true
      selection.plantTail()
      selection.insertText(insertText, options)
      selection.retainSelection = false


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
    link.openLink()


# sss
atom.commands.add 'atom-text-editor', 'nerd:select-outside-bracket', ->
  editor = atom.workspace.getActiveTextEditor()
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")
  atom.commands.dispatch(atom.views.getView(editor), "core:move-right")
  atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets")


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
