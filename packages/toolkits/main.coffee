global.GC = {}

{$, $$, SelectListView} = require 'atom-space-pen-views'

ToolkitsToolBar = require './lib/tool-bar'
# ToolkitsCommands = require './lib/commands'
# ToolkitsChangeCase = require './lib/change-case'
# ToolkitsSortLines = require './lib/sort-lines'
# ToolKitsLessAutocompile = require './lib/less-autocompile'

module.exports =
  activate: (state) ->
    # alert('activated')
    # ToolkitsCommands.activate(state)
    # ToolkitsChangeCase.activate(state)
    # ToolkitsSortLines.activate(state)
    # ToolKitsLessAutocompile.activate(state)

  deactivate: (state) ->
    # alert('deactivated')
    ToolkitsToolBar.deactivate(state)
    # ToolkitsSortLines.deactivate(state)
    # ToolKitsLessAutocompile.deactivate()

  consumeToolBar: (toolBar) ->
    @toolBar = ToolkitsToolBar.activate(toolBar)
