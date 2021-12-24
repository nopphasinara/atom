# ~/.atom/init.coffee

# Object.defineProperty global, 'functions', get: ->
#   delete require.cache[require.resolve(pathToFunctionsFile)]
#   require(pathToFunctionsFile)
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     functions.onSave(editor)


# _       = require('underscore-plus')
# {shell} = require('electron.remote.screen')
# {exec}  = require('child_process')
# url     = require('url')
# link    = require('link')


filePaths = [
  {
    name: 'Factory',
    path: './Factory.js',
  },
]

for file in filePaths
  global[file.name] = require(file.path)
  # global[file.name] = require(file.path)
  # Object.defineProperty global, file.name, () ->
  #   delete require.cache[require.resolve(file.path)]
  #   require(file.path)


global.Fc = new Factory()

console.log Fc

console.info Factory