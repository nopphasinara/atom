global.GC = {}

{$, $$, SelectListView} = require 'atom-space-pen-views'

ToolkitsToolBar = require './lib/tool-bar'
ToolkitsCommands = require './lib/commands'
ToolkitsChangeCase = require './lib/change-case'
ToolkitsSortLines = require './lib/sort-lines'
# ToolkitsLanguageBlade = require './lib/language-blade'

module.exports =
  activate: (state) ->
    # alert('activated')
    ToolkitsCommands.activate(state)
    ToolkitsChangeCase.activate(state)
    ToolkitsSortLines.activate(state)
    # ToolkitsLanguageBlade.activate(state)

  deactivate: (state) ->
    # alert('deactivated')
    ToolkitsToolBar.deactivate(state)
    ToolkitsSortLines.deactivate(state)
    # ToolkitsLanguageBlade.deactivate(state)

  consumeToolBar: (toolBar) ->
    @toolBar = ToolkitsToolBar.activate(toolBar)
