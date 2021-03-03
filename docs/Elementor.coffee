# ssss

Elementor = {

  getEditorView: (editor) ->
    return atom.views.getView(editor)

  getActiveEditor: () ->
    return atom.workspace.getActiveTextEditor()

  addCommands: () ->
    atom.commands.add('atom-text-editor', 'nerd:select-inside-bracket', () ->
        atom.commands.dispatch(@getEditorView(@getActiveEditor()), 'bracket-matcher:go-to-matching-bracket')
      )

  getElementSections: () ->
    console.log 'getElementSections'

  init: () ->
    @constructor()

  constructor: () ->
    console.log 'OK'

    @addCommands()

    return this

}


# Export module.
module.exports = Elementor