# ~/.atom/functions.coffee

module.exports =
  activate: () ->
    this.wrapBlock()
  onSave: (editor) ->
    # console.log "Saved!"
    this.activate()
  observed: (editor) ->
    console.log editor
  wrapBlock: () ->
    editor = atom.workspace.getActiveTextEditor()
    cursors = editor.getCursors()
    # console.log cursors
