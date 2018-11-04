{CompositeDisposable} = require 'atom'

crypto = require 'crypto'
Entities = new (require('html-entities').AllHtmlEntities)

cryptoHash =
  hash: (algorithm, data) ->
    crypto.createHash(algorithm).update(data).digest('hex')
  MD5: (text) ->
    cryptoHash.hash('md5', text)
  SHA256: (text) ->
    cryptoHash.hash('sha256', text)
  SHA512: (text) ->
    cryptoHash.hash('sha512', text)

base64 =
  encode: (text) ->
    new Buffer(text).toString('base64')
  decode: (text) ->
    new Buffer(text, 'base64').toString()

transfrom = (converter) ->
  return unless editor = atom.workspace.getActiveTextEditor()

  selections = editor.getSelections()
  # Selected or not
  if selections[0].isEmpty()
    editor.setText(converter(editor.getText()))
  else
    for sel in selections
      sel.insertText(converter(sel.getText()), {"select": true})

module.exports = StringEncoder =
  subscriptions: null

  activate: () ->
    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace',
      'string-encoder:md5': -> transfrom(cryptoHash.MD5)
      'string-encoder:sha256': -> transfrom(cryptoHash.SHA256)
      'string-encoder:sha512': -> transfrom(cryptoHash.SHA512)
      'string-encoder:base64-encode': -> transfrom(base64.encode)
      'string-encoder:base64-decode': -> transfrom(base64.decode)
      'string-encoder:html-entities-encode': -> transfrom(Entities.encode)
      'string-encoder:html-entities-decode': -> transfrom(Entities.decode)
      'string-encoder:uri-encode': -> transfrom(encodeURIComponent)
      'string-encoder:uri-decode': -> transfrom(decodeURIComponent)

  deactivate: ->
    @subscriptions.dispose()
