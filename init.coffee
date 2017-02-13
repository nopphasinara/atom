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


## New class base controller
# This is custom core class used inside atom.
#
class FNBaseController
  activeEditor: () ->
    e = atom.workspace.getActiveTextEditor()
    e[0] = atom.views.getView(e)
    return e

  activeWorkspace: () ->
    e = atom.workspace
    e[0] = atom.views.getView(e)
    return e


## Define global variable of FNBaseController object
global.fn = new FNBaseController


## Custom function and method here ##
# Please put all of your methods and functions below here.
#
## This example associates all mustache files
atom.workspace.observeTextEditors (editor) ->
  if editor.getPath()?.match(/\.mustache$/)
    editor.setGrammar(atom.grammars.grammarForScopeName('source.sql.mustache'))


## Toggle common used panel by default when atom loaded
atom.packages.onDidActivateInitialPackages ->
  workspaceView = atom.views.getView(atom.workspace)
  atom.commands.dispatch(workspaceView, 'tree-view:show')
  atom.commands.dispatch(workspaceView, 'remote-ftp:toggle')


## Delete one character on right of cursor
atom.commands.add 'atom-text-editor', 'fn:delete-right': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _editor = fn.activeEditor()
  _editor.selectRight()
  _editor.backspace()


## Add whitespace on right of cursor
atom.commands.add 'atom-text-editor', 'fn:space-right': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _editor = fn.activeEditor()
  _editor.insertText(' ')
  _editor.moveLeft()


## Add indent on right of cursor
atom.commands.add 'atom-text-editor', 'fn:indent-right': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _editor = fn.activeEditor()
  atom.commands.dispatch(_editor[0], 'editor:indent')
  _editor.moveLeft(2)


## Delete one line above/below current line
atom.commands.add 'atom-text-editor', 'fn:delete-line-above': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _editor = fn.activeEditor()
  _editor.moveUp()
  _editor.deleteLine()

atom.commands.add 'atom-text-editor', 'fn:delete-line-below': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _editor = fn.activeEditor()
  _editor.moveDown()
  _editor.deleteLine()
  _editor.moveUp()


## Toggle favorite panels show/hide all at once
atom.commands.add 'atom-workspace', 'fn:show-favorite': (editor) ->
  return unless editor = atom.workspace.getActiveTextEditor()
  _workspace = fn.activeWorkspace()
  _editor = fn.activeEditor()
  _panes = atom.workspace.getLeftPanels()
  _classes = {
    toolBar: false
    treeView: false
    remoteFtp: false
  }

  if (_panes && _panes.length > 0)
    for _pane, _key in _panes
      _item = _pane.getItem()
      if (_item.element)
        _item = _item.element

      if (_item.classList)
        _itemClasses = _item.classList

        for _className, _kk in _itemClasses
          if (_className == 'remote-ftp-view')
            _classes.remoteFtp = true
          if (_className == 'tool-bar')
            _classes.toolBar = true
          if (_className == 'tree-view-resizer')
            _classes.treeView = true


  if (!_classes.treeView && !_classes.toolBar && !_classes.remoteFtp)
    # Open all invisible panels
    atom.commands.dispatch(_workspace[0], 'tree-view:toggle')
    atom.commands.dispatch(_workspace[0], 'tool-bar:toggle')
    atom.commands.dispatch(_workspace[0], 'remote-ftp:toggle')
  else
    if (_classes.treeView && _classes.toolBar && _classes.remoteFtp)
      # Close all visible panels
      atom.commands.dispatch(_workspace[0], 'remote-ftp:toggle')
      atom.commands.dispatch(_workspace[0], 'tool-bar:toggle')
      atom.commands.dispatch(_workspace[0], 'tree-view:toggle')
    else
      if (!_classes.treeView)
        if (_classes.remoteFtp)
          _classes.remoteFtp = false
          atom.commands.dispatch(_workspace[0], 'remote-ftp:toggle')

      if (!_classes.treeView)
        atom.commands.dispatch(_workspace[0], 'tree-view:toggle')

      if (!_classes.toolBar)
        atom.commands.dispatch(_workspace[0], 'tool-bar:toggle')

      if (!_classes.remoteFtp)
        atom.commands.dispatch(_workspace[0], 'remote-ftp:toggle')


## Terminal custom commands
atom.commands.add '.platform-darwin .platformio-ide-terminal', 'fn:terminal-close': (editor) ->
  _workspace = fn.activeWorkspace()
  atom.commands.dispatch(_workspace[0], 'platformio-ide-terminal:close')
  atom.commands.dispatch(_workspace[0], 'platformio-ide-terminal:toggle')

atom.commands.add '.platform-darwin .platformio-ide-terminal', 'fn:terminal-close-all': (editor) ->
  _workspace = fn.activeWorkspace()
  atom.commands.dispatch(_workspace[0], 'platformio-ide-terminal:close-all')
