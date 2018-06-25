# coffeelint: disable=max_line_length
{CompositeDisposable} = require 'atom'
mfs = require 'match-files'
path = require 'path'

module.exports = FileHyperclick =
  subscriptions: null
  config:
    directories:
      description: "directories under project paths that may contain the file",
      type: 'array',
      default: ['/lib/src','/ext/src']
    extension:
      description: "extension name of the file",
      type: 'string',
      default: '.coffee'

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    return

  getProvider: ->
    providerName: 'file-hyperclick',
    getSuggestionForWord: (editor, text, range) ->
      range: range, callback: ->
        dirs = do atom.project.getPaths
        subDirs = atom.config.get 'file-hyperclick.directories'
        dirs.forEach (dir) ->
          subDirs.forEach (subDir) ->
            sdir = path.join dir, subDir
            options =
              fileFilters: [
                (path) ->
                  file = text + atom.config.get 'file-hyperclick.extension'
                  path.slice(-file.length) is file
              ]
            mfs.find sdir, options, (err, files) ->
              atom.workspace.open files[0] if files[0] and not err
              return
            return
          return
        return

  deactivate: ->
    @subscriptions.dispose()
    return
