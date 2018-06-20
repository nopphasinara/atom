ToolBarSetup = require "./tool-bar-setup"

module.exports =
  activate: (state) ->
    # console.log 'activated'
    ToolBarSetup.activate(state)

  deactivate: (state) ->
    # console.log 'deactivated'
    ToolBarSetup.deactivate(state)

  consumeToolBar: (toolBar) ->
    ToolBarSetup.initialize(toolBar)
