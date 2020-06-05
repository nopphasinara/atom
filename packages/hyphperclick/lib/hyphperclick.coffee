HyphperclickView = require './hyphperclick-view'
{CompositeDisposable} = require 'atom'

module.exports = Hyphperclick =
  hyphperclickView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @hyphperclickView = new HyphperclickView(state.hyphperclickViewState)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @subscriptions.dispose()
    @hyphperclickView.destroy()
  getProvider: ->
    @hyphperclickView.singleSuggestionProvider()

  serialize: ->
    hyphperclickViewState: @hyphperclickView.serialize()