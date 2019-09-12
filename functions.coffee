# ~/.atom/functions.coffee

module.exports =
  onSave: (editor) ->
    console.log "Saved!"

    selections = editor.getSelections()
    if selections.length > 0
      console.log selections
      console.log "selectedText"
      console.log editor.getSelectedText()
