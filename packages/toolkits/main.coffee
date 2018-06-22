global.GC = {}

{$, $$, SelectListView} = require 'atom-space-pen-views'

ToolkitsToolBar = require './lib/tool-bar'
ToolkitsCommands = require './lib/commands'
ToolkitsChangeCase = require './lib/change-case'
ToolkitsSortLines = require './lib/sort-lines'
LessAutocompile = require './lib/less-autocompile'
# ToolkitsLanguageBlade = require './lib/language-blade'

module.exports =
  activate: (state) ->
    # alert('activated')
    ToolkitsCommands.activate(state)
    ToolkitsChangeCase.activate(state)
    ToolkitsSortLines.activate(state)
    LessAutocompile.activate(state)
    # ToolkitsLanguageBlade.activate(state)

  deactivate: (state) ->
    # alert('deactivated')
    ToolkitsToolBar.deactivate(state)
    ToolkitsSortLines.deactivate(state)
    LessAutocompile.deactivate()
    # ToolkitsLanguageBlade.deactivate(state)

  consumeToolBar: (toolBar) ->
    @toolBar = ToolkitsToolBar.activate(toolBar)
