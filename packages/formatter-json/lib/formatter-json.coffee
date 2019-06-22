{CompositeDisposable} = require 'atom'

module.exports = FormatterJson =
  activate: (state) ->
    return

  config:
    json:
      title: 'JSON'
      type: 'object'
      description: 'All parameters for JSON language.'
      properties:
        enable:
          title: 'Enable formatter for JSON language'
          type: 'boolean'
          default: true
          description: 'Need restart Atom.'
        indentSize:
          title: 'Arguments passed to the formatter JSON language'
          type: 'integer'
          default: 2
          minimum: 0
          description: 'Example : 8'

  provideFormatter: ->
    {
      selector: '.source.json'
      getNewText: (text) ->
        return new Promise (resolve, reject) ->
          try
            toReturn = JSON.stringify(JSON.parse(text), null, atom.config.get 'formatter-json.json.indentSize');
            resolve(toReturn)
          catch e
            atom.notifications.addError('formatter-json : error', {dismissable: true, detail: e});
    } if atom.config.get 'formatter-json.json.enable'
