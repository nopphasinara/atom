{AutoLanguageClient} = require "atom-languageclient"

ToolBarSetup = require "./tool-bar-setup"
ProviderCss = require './provider.css'
ProviderCoffeescript = require './provider.coffeescript'

module.exports =
  config: ProviderCss.config

  activate: (state) ->
    # console.log 'activated'
    ToolBarSetup.activate(state)
    emitter.setMaxListeners()

  deactivate: (state) ->
    # console.log 'deactivated'
    ToolBarSetup.deactivate(state)

  consumeToolBar: (toolBar) ->
    ToolBarSetup.initialize(toolBar)

  getProviders: () ->
    ProviderCss
    ProviderCoffeescript
