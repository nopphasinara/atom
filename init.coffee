# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"

class FNBaseController
  activeEditor: () ->
    e = atom.workspace.getActiveTextEditor()
    e[0] = atom.views.getView(e)
    return e

  activeWorkspace: () ->
    e = atom.workspace
    e[0] = atom.views.getView(e)
    return e

global.fn = new FNBaseController

atom.packages.onDidActivateInitialPackages ->
  workspaceView = atom.views.getView(atom.workspace)
  atom.commands.dispatch(workspaceView, 'tree-view:show')
  atom.commands.dispatch(workspaceView, 'remote-ftp:toggle')

atom.commands.add 'atom-text-editor',
  'fn:delete-left': (editor) ->
    _editor = fn.activeEditor()
    _editor.selectLeft()
    _editor.backspace()

atom.commands.add 'atom-text-editor',
  'fn:delete-right': (editor) ->
    _editor = fn.activeEditor()
    _editor.selectRight()
    _editor.backspace()

atom.commands.add 'atom-text-editor',
  'fn:space-right': (editor) ->
    _editor = fn.activeEditor()
    _editor.insertText(' ')
    _editor.moveLeft()

atom.commands.add 'atom-text-editor',
  'fn:indent-right': (editor) ->
    _editor = fn.activeEditor()
    atom.commands.dispatch(_editor[0], 'editor:indent')
    _editor.moveLeft(2)
