module.exports =
	activate: ->

		fromGrammarName: "GitHub Markdown"
		fromScopeName: 'source.gfm'
		toScopeName: 'text.html.basic'

#-------------------------------------------------------------------------------
		transform: (code) ->
			gfm = require 'github-markdown-render'

			gfm(code).then (html) -> code: html
