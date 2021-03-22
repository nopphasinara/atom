Compiler = require './compiler'

module.exports = SassCompiler =

    config:
        inputPath:
            title: 'Input path'
            description: 'Specifies where the Scss files are stored. ( Path relative to your project ).'
            type: 'string'
            default: './css/sass/'

        outputPath:
            title: 'Output path'
            description: 'This specifies where the CSS will be saved. ( Path relative to your project ).'
            type: 'string'
            default: './css/'

        fileName:
            title: 'File name'
            description: 'Scss type file name, to be parent of all @include.'
            type: 'string'
            default: 'main'

        outputStyle:
            title: 'Output style'
            description: 'String to determine how the final CSS should be rendered. Its value should be one of nested or compressed.'
            type: 'string'
            default: 'compressed'
            enum: [ 'nested', 'compressed' ]

        successMsg:
            title: 'Eneable/disable success message.'
            description: 'Turns on/off information about successfull compiling.'
            type: 'boolean'
            default: true

        extractPath:
            title: 'Get path from file.'
            description: 'Eneable/disable ( package tries to extract current path based on editable file and sets reference point ).'
            type: 'boolean'
            default: false

        inputPathExtracted:
            title: 'Catalog where scss are stored.'
            description: 'Specifies where your Scss files are stored. ( Relative to extracted reference point ).'
            type: 'string'
            default: 'sass'

        outputPathExtracted:
            title: 'Catalog for saving compiled css.'
            description: 'Specifies where the CSS will be saved. ( Relative to extracted reference point ).'
            type: 'string'
            default: '../css'


    activate: (state) ->
        @compiler = new Compiler()
