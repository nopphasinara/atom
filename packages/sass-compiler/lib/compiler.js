module.exports = Compiler = (function() {

    function Compiler() {

        var currentView     = atom.workspace.getActiveTextEditor();
        var _this           = this;
        this.project_path   = atom.project.path;

        var saveAction = function( e ){

            // @TODO - always returning false
            // if ( !currentView.isModified() ) {
            //
            //     return false;
            // }

            if ( _this.extension == 'scss' ) {

                _this.compile( _this.filePath );
            }
        };

        atom.workspace.onDidChangeActivePaneItem(function( item ){

            currentView = item;

            // Incase if we will not get a current view
            if ( typeof currentView == 'undefined' ) {

                return false;
            }

            _this.fileName = currentView.getTitle();
            _this.extension = _this.fileName.split( '.' );
            _this.extension = _this.extension[_this.extension.length-1];

            if ( typeof item['sass-compiler-activated'] == 'undefined' && _this.extension == 'scss' ) {

                _this.filePath = currentView.getPath();

                currentView.onDidSave( saveAction );
                currentView['sass-compiler-activated'] = true;
            }
        });

        if ( typeof currentView == 'undefined' ) {

            return false;
        }

        this.fileName   = currentView.getTitle();
        this.extension  = this.fileName.split( '.' );
        this.extension  = this.extension[this.extension.length-1];

        if ( this.extension == 'scss' ) {

            this.filePath   = currentView.getPath();

            currentView.onDidSave( saveAction );
            currentView['sass-compiler-activated'] = true;
        }
    }

    Compiler.prototype.compile = function( filePath ) {

        // @TODO after  Module did not self-register problem will be solved.
        //   var sass = require('node-sass');

        var exec            = require('child_process').exec;

        // Settings
        var outputStyle     = atom.config.get('sass-compiler.outputStyle');
        var inputPath       = atom.config.get('sass-compiler.inputPath');
        var outputPath      = atom.config.get('sass-compiler.outputPath');
        var fileName        = atom.config.get('sass-compiler.fileName');

        if ( !atom.config.get('sass-compiler.extractPath') ) {


            var inputFullPath   = this.project_path + '/' + inputPath + '/' + fileName + '.scss';
            var outputFullPath  = this.project_path + '/' + outputPath + '/' + fileName + '.css';
        } else {

            var path_array          = filePath.split( '\\' );
            var extracted_path      = '';
            var i                   = 0;
            var scss_catalog        = atom.config.get('sass-compiler.inputPathExtracted');

            // extracting path from editing file
            while( path_array[i] !== scss_catalog && path_array.indexOf( scss_catalog ) > -1 ) {

                extracted_path += path_array[i] + '/';
                i++;
            }

            var outputPathExtracted = atom.config.get('sass-compiler.outputPathExtracted');
            var inputFullPath       = extracted_path + scss_catalog + '/' + fileName + '.scss';
            var outputFullPath      = extracted_path + fileName + '.css';
        }

        // @TODO source-maps not working in cli // + ' --source-map ' + sourceMap
        var execString = 'node-sass --output-style ' + outputStyle + ' ' + inputFullPath + ' ' + outputFullPath;

        exec( execString, function (error, stdout, stderr) {

            if ( error != null ) {

                atom.notifications.addError( 'Error while compiling:',{
                    detail: error.message,
                    dismissable: true
                });
            } else {

                if ( atom.config.get('sass-compiler.successMsg') ) {

                    atom.notifications.addSuccess( 'Successfuly compiled' );
                }
            }
        });
    }

    return Compiler;
})();
