# ~/.atom/functions.coffee

module.exports =
  activate: () ->
    this.wrapBlock()
  onSave: (editor) ->
    # console.log "Saved!"
    this.activate()
  wrapBlock: () ->
    editor = atom.workspace.getActiveTextEditor()
    cursors = editor.getCursors()
    # console.log cursors
