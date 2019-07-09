global.activeEditor = () ->
  return atom.workspace.getActiveTextEditor()

## Custom Commands

#
atom.workspace.observeActiveTextEditor ->
  editor = activeEditor()


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

  atom.packages.activePackages.snippets?.mainModule?.insert "<a href=\"#{clipboardText}\" title=\"${1:#{selectedText}}\">${2:#{selectedText}}</a>$0"
  # editor.insertText("<a href=\"#{clipboardText}\" title=\"#{selectedText}\">#{selectedText}</a>")
  # editor.moveLeft(6 + selectedText.length)
  # editor.selectLeft(selectedText.length)


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
