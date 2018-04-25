provider = require './provider'

module.exports =
  config: provider.config

  activate: ->
    foo = 'bar'
    # console.log 'activate aligner-css'

  getProvider: -> provider
