FileServiceProvider = require './file-service-provider.coffee'

module.exports =
class XmlServiceProvider extends FileServiceProvider
    selector: '.text.xml'

    getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix}) ->
        @regex = /argument[^>]+id[\s]*=[\s]*[\"]([^\"]*)[\"]*/g

        return @fetchSuggestions({editor, bufferPosition, scopeDescriptor, prefix})
