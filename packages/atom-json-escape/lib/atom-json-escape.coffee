module.exports = AtomJsonEscape =
  activate: (state) ->
    atom.commands.add 'atom-text-editor',
      'atom-json-escape:escape': (e) ->
        editor = @getModel()
        text = editor.getText()
        editor.insertText JSON.stringify(text), select: true

      'atom-json-escape:unescape': (e) ->
        editor = @getModel()
        text = editor.getText()
        editor.insertText JSON.parse(text), select: true
