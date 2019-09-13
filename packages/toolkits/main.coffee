global.GC = {}

{$, $$, SelectListView} = require 'atom-space-pen-views'

ToolkitsToolBar = require './lib/tool-bar'
# ToolkitsHelpers = require './lib/helpers'
# ToolkitsDoubleBracketsWithSpaces = require './lib/double-brackets-with-spaces'
# ToolkitsCommands = require './lib/commands'
# ToolkitsChangeCase = require './lib/change-case'
# ToolkitsSortLines = require './lib/sort-lines'
# ToolKitsLessAutocompile = require './lib/less-autocompile'

module.exports =
  activate: (state) ->
    # alert('activated')
    # ToolkitsHelpers.activate(state)
    # ToolkitsCommands.activate(state)
    # ToolkitsChangeCase.activate(state)
    # ToolkitsSortLines.activate(state)
    # ToolKitsLessAutocompile.activate(state)
    # ToolkitsDoubleBracketsWithSpaces.activate(state)

  deactivate: (state) ->
    # alert('deactivated')
    ToolkitsToolBar.deactivate(state)
    # ToolkitsSortLines.deactivate(state)
    # ToolKitsLessAutocompile.deactivate()

  consumeToolBar: (toolBar) ->
    @toolBar = ToolkitsToolBar.activate(toolBar)
