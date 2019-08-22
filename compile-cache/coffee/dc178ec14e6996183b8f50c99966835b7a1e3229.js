(function() {
  var ArgumentParser, Emitter, File, InlineParameterParser, NodeSassCompiler, SassAutocompileOptions, exec, fs, path;

  Emitter = require('event-kit').Emitter;

  SassAutocompileOptions = require('./options');

  InlineParameterParser = require('./helper/inline-parameters-parser');

  File = require('./helper/file');

  ArgumentParser = require('./helper/argument-parser');

  fs = require('fs');

  path = require('path');

  exec = require('child_process').exec;

  module.exports = NodeSassCompiler = (function() {
    NodeSassCompiler.MODE_DIRECT = 'direct';

    NodeSassCompiler.MODE_FILE = 'to-file';

    function NodeSassCompiler(options) {
      this.options = options;
      this.emitter = new Emitter();
    }

    NodeSassCompiler.prototype.destroy = function() {
      this.emitter.dispose();
      return this.emitter = null;
    };

    NodeSassCompiler.prototype.compile = function(mode, filename, compileOnSave) {
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.compileOnSave = compileOnSave;
      this.childFiles = {};
      return this._compile(mode, filename);
    };

    NodeSassCompiler.prototype._compile = function(mode, filename, compileOnSave) {
      var parameterParser, parameterTarget;
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.mode = mode;
      this.targetFilename = filename;
      this.inputFile = void 0;
      this.outputFile = void 0;
      parameterParser = new InlineParameterParser();
      parameterTarget = this.getParameterTarget();
      return parameterParser.parse(parameterTarget, (function(_this) {
        return function(params, error) {
          var errorMessage;
          if (_this.compileOnSave && _this.prohibitCompilationOnSave(params)) {
            _this.emitFinished();
            return;
          }
          if (params === false && _this.options.compileOnlyFirstLineCommentFiles) {
            _this.emitFinished();
            return;
          }
          if (error) {
            _this.emitMessageAndFinish('error', error, true);
            return;
          }
          _this.setupInputFile(filename);
          if ((errorMessage = _this.validateInputFile()) !== void 0) {
            _this.emitMessageAndFinish('error', errorMessage, true);
            return;
          }
          if (params === false && _this.isPartial() && !_this.options.compilePartials) {
            _this.emitFinished();
            return;
          }
          if (typeof params.main === 'string') {
            if (params.main === _this.inputFile.path || _this.childFiles[params.main] !== void 0) {
              return _this.emitMessageAndFinish('error', 'Following the main parameter ends in a loop.');
            } else if (_this.inputFile.isTemporary) {
              return _this.emitMessageAndFinish('error', '\'main\' inline parameter is not supported in direct compilation.');
            } else {
              _this.childFiles[params.main] = true;
              return _this._compile(_this.mode, params.main);
            }
          } else {
            _this.emitStart();
            if (_this.isCompileToFile() && !_this.ensureFileIsSaved()) {
              _this.emitMessageAndFinish('warning', 'Compilation cancelled');
              return;
            }
            _this.updateOptionsWithInlineParameters(params);
            _this.outputStyles = _this.getOutputStylesToCompileTo();
            if (_this.outputStyles.length === 0) {
              _this.emitMessageAndFinish('warning', 'No output style defined! Please enable at least one style in options or use inline parameters.');
              return;
            }
            return _this.doCompile();
          }
        };
      })(this));
    };

    NodeSassCompiler.prototype.getParameterTarget = function() {
      if (typeof this.targetFilename === 'string') {
        return this.targetFilename;
      } else {
        return atom.workspace.getActiveTextEditor();
      }
    };

    NodeSassCompiler.prototype.prohibitCompilationOnSave = function(params) {
      var ref;
      if (params && ((ref = params.compileOnSave) === true || ref === false)) {
        this.options.compileOnSave = params.compileOnSave;
      }
      return !this.options.compileOnSave;
    };

    NodeSassCompiler.prototype.isPartial = function() {
      var filename;
      filename = path.basename(this.inputFile.path);
      return filename[0] === '_';
    };

    NodeSassCompiler.prototype.setupInputFile = function(filename) {
      var activeEditor, syntax;
      if (filename == null) {
        filename = null;
      }
      this.inputFile = {
        isTemporary: false
      };
      if (filename) {
        return this.inputFile.path = filename;
      } else {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (!activeEditor) {
          return;
        }
        if (this.isCompileDirect()) {
          syntax = this.askForInputSyntax();
          if (syntax) {
            this.inputFile.path = File.getTemporaryFilename('sass-autocompile.input.', null, syntax);
            this.inputFile.isTemporary = true;
            return fs.writeFileSync(this.inputFile.path, activeEditor.getText());
          } else {
            return this.inputFile.path = void 0;
          }
        } else {
          this.inputFile.path = activeEditor.getURI();
          if (!this.inputFile.path) {
            return this.inputFile.path = this.askForSavingUnsavedFileInActiveEditor();
          }
        }
      }
    };

    NodeSassCompiler.prototype.askForInputSyntax = function() {
      var dialogResultButton, syntax;
      dialogResultButton = atom.confirm({
        message: "Is the syntax of your input SASS or SCSS?",
        buttons: ['SASS', 'SCSS', 'Cancel']
      });
      switch (dialogResultButton) {
        case 0:
          syntax = 'sass';
          break;
        case 1:
          syntax = 'scss';
          break;
        default:
          syntax = void 0;
      }
      return syntax;
    };

    NodeSassCompiler.prototype.askForSavingUnsavedFileInActiveEditor = function() {
      var activeEditor, dialogResultButton, error, filename;
      activeEditor = atom.workspace.getActiveTextEditor();
      dialogResultButton = atom.confirm({
        message: "In order to compile this SASS file to a CSS file, you have do save it before. Do you want to save this file?",
        detailedMessage: "Alternativly you can use 'Direct Compilation' for compiling without creating a CSS file.",
        buttons: ["Save", "Cancel"]
      });
      if (dialogResultButton === 0) {
        filename = atom.showSaveDialogSync();
        try {
          activeEditor.saveAs(filename);
        } catch (error1) {
          error = error1;
        }
        filename = activeEditor.getURI();
        return filename;
      }
      return void 0;
    };

    NodeSassCompiler.prototype.validateInputFile = function() {
      var errorMessage;
      errorMessage = void 0;
      if (!this.inputFile.path) {
        errorMessage = 'Invalid file: ' + this.inputFile.path;
      }
      if (!fs.existsSync(this.inputFile.path)) {
        errorMessage = 'File does not exist: ' + this.inputFile.path;
      }
      return errorMessage;
    };

    NodeSassCompiler.prototype.ensureFileIsSaved = function() {
      var dialogResultButton, editor, editors, filename, j, len;
      editors = atom.workspace.getTextEditors();
      for (j = 0, len = editors.length; j < len; j++) {
        editor = editors[j];
        if (editor && editor.getURI && editor.getURI() === this.inputFile.path && editor.isModified()) {
          filename = path.basename(this.inputFile.path);
          dialogResultButton = atom.confirm({
            message: "'" + filename + "' has changes, do you want to save them?",
            detailedMessage: "In order to compile SASS you have to save changes.",
            buttons: ["Save and compile", "Cancel"]
          });
          if (dialogResultButton === 0) {
            editor.save();
            break;
          } else {
            return false;
          }
        }
      }
      return true;
    };

    NodeSassCompiler.prototype.updateOptionsWithInlineParameters = function(params) {
      var outputStyle, ref, ref1;
      if (typeof params.out === 'string' || typeof params.outputStyle === 'string' || typeof params.compress === 'boolean') {
        if (this.options.showOldParametersWarning) {
          this.emitMessage('warning', 'Please don\'t use \'out\', \'outputStyle\' or \'compress\' parameter any more. Have a look at the documentation for newer parameters');
        }
        outputStyle = 'compressed';
        if (params.compress === false) {
          outputStyle = 'nested';
        }
        if (params.compress === true) {
          outputStyle = 'compressed';
        }
        if (params.outputStyle) {
          outputStyle = typeof params.outputStyle === 'string' ? params.outputStyle.toLowerCase() : 'compressed';
        }
        this.options.compileCompressed = outputStyle === 'compressed';
        if (outputStyle === 'compressed' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compressedFilenamePattern = params.out;
        }
        this.options.compileCompact = outputStyle === 'compact';
        if (outputStyle === 'compact' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compactFilenamePattern = params.out;
        }
        this.options.compileNested = outputStyle === 'nested';
        if (outputStyle === 'nested' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.nestedFilenamePattern = params.out;
        }
        this.options.compileExpanded = outputStyle === 'expanded';
        if (outputStyle === 'expanded' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.expandedFilenamePattern = params.out;
        }
      }
      if (params.compileCompressed || params.compileCompact || params.compileNested || params.compileExpanded) {
        this.options.compileCompressed = false;
        this.options.compileCompact = false;
        this.options.compileNested = false;
        this.options.compileExpanded = false;
      }
      if (params.compileCompressed === true || params.compileCompressed === false) {
        this.options.compileCompressed = params.compileCompressed;
      } else if (typeof params.compileCompressed === 'string') {
        this.options.compileCompressed = true;
        this.options.compressedFilenamePattern = params.compileCompressed;
      }
      if (typeof params.compressedFilenamePattern === 'string' && params.compressedFilenamePattern.length > 1) {
        this.options.compressedFilenamePattern = params.compressedFilenamePattern;
      }
      if (params.compileCompact === true || params.compileCompact === false) {
        this.options.compileCompact = params.compileCompact;
      } else if (typeof params.compileCompact === 'string') {
        this.options.compileCompact = true;
        this.options.compactFilenamePattern = params.compileCompact;
      }
      if (typeof params.compactFilenamePattern === 'string' && params.compactFilenamePattern.length > 1) {
        this.options.compactFilenamePattern = params.compactFilenamePattern;
      }
      if (params.compileNested === true || params.compileNested === false) {
        this.options.compileNested = params.compileNested;
      } else if (typeof params.compileNested === 'string') {
        this.options.compileNested = true;
        this.options.nestedFilenamePattern = params.compileNested;
      }
      if (typeof params.nestedFilenamePattern === 'string' && params.nestedFilenamePattern.length > 1) {
        this.options.nestedFilenamePattern = params.nestedFilenamePattern;
      }
      if (params.compileExpanded === true || params.compileExpanded === false) {
        this.options.compileExpanded = params.compileExpanded;
      } else if (typeof params.compileExpanded === 'string') {
        this.options.compileExpanded = true;
        this.options.expandedFilenamePattern = params.compileExpanded;
      }
      if (typeof params.expandedFilenamePattern === 'string' && params.expandedFilenamePattern.length > 1) {
        this.options.expandedFilenamePattern = params.expandedFilenamePattern;
      }
      if (typeof params.indentType === 'string' && ((ref = params.indentType.toLowerCase()) === 'space' || ref === 'tab')) {
        this.options.indentType = params.indentType.toLowerCase();
      }
      if (typeof params.indentWidth === 'number' && params.indentWidth <= 10 && indentWidth >= 0) {
        this.options.indentWidth = params.indentWidth;
      }
      if (typeof params.linefeed === 'string' && ((ref1 = params.linefeed.toLowerCase()) === 'cr' || ref1 === 'crlf' || ref1 === 'lf' || ref1 === 'lfcr')) {
        this.options.linefeed = params.linefeed.toLowerCase();
      }
      if (params.sourceMap === true || params.sourceMap === false || (typeof params.sourceMap === 'string' && params.sourceMap.length > 1)) {
        this.options.sourceMap = params.sourceMap;
      }
      if (params.sourceMapEmbed === true || params.sourceMapEmbed === false) {
        this.options.sourceMapEmbed = params.sourceMapEmbed;
      }
      if (params.sourceMapContents === true || params.sourceMapContents === false) {
        this.options.sourceMapContents = params.sourceMapContents;
      }
      if (params.sourceComments === true || params.sourceComments === false) {
        this.options.sourceComments = params.sourceComments;
      }
      if ((typeof params.includePath === 'string' && params.includePath.length > 1) || Array.isArray(params.includePath)) {
        this.options.includePath = params.includePath;
      } else if ((typeof params.includePaths === 'string' && params.includePaths.length > 1) || Array.isArray(params.includePaths)) {
        this.options.includePath = params.includePaths;
      }
      if (typeof params.precision === 'number' && params.precision >= 0) {
        this.options.precision = params.precision;
      }
      if (typeof params.importer === 'string' && params.importer.length > 1) {
        this.options.importer = params.importer;
      }
      if (typeof params.functions === 'string' && params.functions.length > 1) {
        return this.options.functions = params.functions;
      }
    };

    NodeSassCompiler.prototype.getOutputStylesToCompileTo = function() {
      var dialogResultButton, outputStyles;
      outputStyles = [];
      if (this.options.compileCompressed) {
        outputStyles.push('compressed');
      }
      if (this.options.compileCompact) {
        outputStyles.push('compact');
      }
      if (this.options.compileNested) {
        outputStyles.push('nested');
      }
      if (this.options.compileExpanded) {
        outputStyles.push('expanded');
      }
      if (this.isCompileDirect() && outputStyles.length > 1) {
        outputStyles.push('Cancel');
        dialogResultButton = atom.confirm({
          message: "For direction compilation you have to select a single output style. Which one do you want to use?",
          buttons: outputStyles
        });
        if (dialogResultButton < outputStyles.length - 1) {
          outputStyles = [outputStyles[dialogResultButton]];
        } else {
          outputStyles = [];
        }
      }
      return outputStyles;
    };

    NodeSassCompiler.prototype.getOutputFile = function(outputStyle) {
      var basename, fileExtension, filename, outputFile, outputPath, pattern;
      outputFile = {
        style: outputStyle,
        isTemporary: false
      };
      if (this.isCompileDirect()) {
        outputFile.path = File.getTemporaryFilename('sass-autocompile.output.', null, 'css');
        outputFile.isTemporary = true;
      } else {
        switch (outputFile.style) {
          case 'compressed':
            pattern = this.options.compressedFilenamePattern;
            break;
          case 'compact':
            pattern = this.options.compactFilenamePattern;
            break;
          case 'nested':
            pattern = this.options.nestedFilenamePattern;
            break;
          case 'expanded':
            pattern = this.options.expandedFilenamePattern;
            break;
          default:
            throw new Error('Invalid output style.');
        }
        basename = path.basename(this.inputFile.path);
        fileExtension = path.extname(basename).replace('.', '');
        filename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), pattern);
        if (!path.isAbsolute(path.dirname(filename))) {
          outputPath = path.dirname(this.inputFile.path);
          filename = path.join(outputPath, filename);
        }
        outputFile.path = filename;
      }
      return outputFile;
    };

    NodeSassCompiler.prototype.checkOutputFileAlreadyExists = function(outputFile) {
      var dialogResultButton;
      if (this.options.checkOutputFileAlreadyExists) {
        if (fs.existsSync(outputFile.path)) {
          dialogResultButton = atom.confirm({
            message: "The output file already exists. Do you want to overwrite it?",
            detailedMessage: "Output file: '" + outputFile.path + "'",
            buttons: ["Overwrite", "Skip", "Cancel"]
          });
          switch (dialogResultButton) {
            case 0:
              return 'overwrite';
            case 1:
              return 'skip';
            case 2:
              return 'cancel';
          }
        }
      }
      return 'overwrite';
    };

    NodeSassCompiler.prototype.ensureOutputDirectoryExists = function(outputFile) {
      var outputPath;
      if (this.isCompileToFile()) {
        outputPath = path.dirname(outputFile.path);
        return File.ensureDirectoryExists(outputPath);
      }
    };

    NodeSassCompiler.prototype.tryToFindNodeSassInstallation = function(callback) {
      var checkNodeSassExists, devNull, existanceCheckCommand, possibleNodeSassPaths;
      devNull = process.platform === 'win32' ? 'nul' : '/dev/null';
      existanceCheckCommand = "node-sass --version >" + devNull + " 2>&1 && (echo found) || (echo fail)";
      possibleNodeSassPaths = [''];
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        possibleNodeSassPaths.push(this.options.nodeSassPath);
      }
      if (process.platform === 'win32') {
        possibleNodeSassPaths.push(path.join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], 'AppData\\Roaming\\npm'));
      }
      if (process.platform === 'linux') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      if (process.platform === 'darwin') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      checkNodeSassExists = (function(_this) {
        return function(foundInPath) {
          var command, environment, searchPath;
          if (typeof foundInPath === 'string') {
            if (foundInPath === _this.options.nodeSassPath) {
              callback(true, false);
            } else if (_this.askAndFixNodeSassPath(foundInPath)) {
              callback(true, true);
            } else {
              callback(false, false);
            }
            return;
          }
          if (possibleNodeSassPaths.length === 0) {
            callback(false, false);
            return;
          }
          searchPath = possibleNodeSassPaths.shift();
          command = path.join(searchPath, existanceCheckCommand);
          environment = JSON.parse(JSON.stringify(process.env));
          if (typeof searchPath === 'string' && searchPath.length > 1) {
            environment.PATH += ":" + searchPath;
          }
          return exec(command, {
            env: environment
          }, function(error, stdout, stderr) {
            if (stdout.trim() === 'found') {
              return checkNodeSassExists(searchPath);
            } else {
              return checkNodeSassExists();
            }
          });
        };
      })(this);
      return checkNodeSassExists();
    };

    NodeSassCompiler.prototype.askAndFixNodeSassPath = function(nodeSassPath) {
      var detailedMessage, dialogResultButton;
      if (nodeSassPath === '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be cleared, because node-sass is accessable without absolute path.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath === '') {
        detailedMessage = "'Path to node-sass command' option will be set to '" + nodeSassPath + "', because command was found there.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be replaced with '" + nodeSassPath + "', because command was found there.";
      }
      dialogResultButton = atom.confirm({
        message: "'node-sass' command could not be found with current configuration, but it can be automatically fixed. Fix it?",
        detailedMessage: detailedMessage,
        buttons: ["Fix it", "Cancel"]
      });
      switch (dialogResultButton) {
        case 0:
          SassAutocompileOptions.set('nodeSassPath', nodeSassPath);
          this.options.nodeSassPath = nodeSassPath;
          return true;
        case 1:
          return false;
      }
    };

    NodeSassCompiler.prototype.doCompile = function() {
      var child, emitterParameters, error, execParameters, outputFile, outputStyle, timeout;
      if (this.outputStyles.length === 0) {
        this.emitFinished();
        if (this.inputFile.isTemporary) {
          File["delete"](this.inputFile.path);
        }
        return;
      }
      outputStyle = this.outputStyles.pop();
      outputFile = this.getOutputFile(outputStyle);
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      try {
        if (this.isCompileToFile()) {
          switch (this.checkOutputFileAlreadyExists(outputFile)) {
            case 'overwrite':
              break;
            case 'cancel':
              throw new Error('Compilation cancelled');
              break;
            case 'skip':
              emitterParameters.message = 'Compilation skipped: ' + outputFile.path;
              this.emitter.emit('warning', emitterParameters);
              this.doCompile();
              return;
          }
        }
        this.ensureOutputDirectoryExists(outputFile);
        this.startCompilingTimestamp = new Date().getTime();
        execParameters = this.prepareExecParameters(outputFile);
        timeout = this.options.nodeSassTimeout > 0 ? this.options.nodeSassTimeout : 0;
        return child = exec(execParameters.command, {
          env: execParameters.environment,
          timeout: timeout
        }, (function(_this) {
          return function(error, stdout, stderr) {
            if (child.exitCode > 0) {
              return _this.tryToFindNodeSassInstallation(function(found, fixed) {
                if (fixed) {
                  return _this._compile(_this.mode, _this.targetFilename);
                } else {
                  _this.onCompiled(outputFile, error, stdout, stderr, child.killed);
                  return _this.doCompile();
                }
              });
            } else {
              _this.onCompiled(outputFile, error, stdout, stderr, child.killed);
              return _this.doCompile();
            }
          };
        })(this));
      } catch (error1) {
        error = error1;
        emitterParameters.message = error;
        this.emitter.emit('error', emitterParameters);
        this.outputStyles = [];
        return this.doCompile();
      }
    };

    NodeSassCompiler.prototype.onCompiled = function(outputFile, error, stdout, stderr, killed) {
      var compiledCss, emitterParameters, errorJson, errorMessage, statistics;
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      statistics = {
        duration: new Date().getTime() - this.startCompilingTimestamp
      };
      try {
        emitterParameters.nodeSassOutput = stdout ? stdout : stderr;
        if (error !== null || killed) {
          if (killed) {
            errorMessage = "Compilation cancelled because of timeout (" + this.options.nodeSassTimeout + " ms)";
          } else {
            if (error.message.indexOf('"message":') > -1) {
              errorJson = error.message.match(/{\n(.*?(\n))+}/gm);
              errorMessage = JSON.parse(errorJson);
            } else {
              errorMessage = error.message;
            }
          }
          emitterParameters.message = errorMessage;
          this.emitter.emit('error', emitterParameters);
          return this.outputStyles = [];
        } else {
          statistics.before = File.getFileSize(this.inputFile.path);
          statistics.after = File.getFileSize(outputFile.path);
          statistics.unit = 'Byte';
          if (this.isCompileDirect()) {
            compiledCss = fs.readFileSync(outputFile.path);
            atom.workspace.getActiveTextEditor().setText(compiledCss.toString());
          }
          emitterParameters.statistics = statistics;
          return this.emitter.emit('success', emitterParameters);
        }
      } finally {
        if (outputFile.isTemporary) {
          File["delete"](outputFile.path);
        }
      }
    };

    NodeSassCompiler.prototype.prepareExecParameters = function(outputFile) {
      var command, environment, nodeSassParameters;
      nodeSassParameters = this.buildNodeSassParameters(outputFile);
      command = 'node-sass ' + nodeSassParameters.join(' ');
      environment = JSON.parse(JSON.stringify(process.env));
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        command = path.join(this.options.nodeSassPath, command);
        environment.PATH += ":" + this.options.nodeSassPath;
      }
      return {
        command: command,
        environment: environment
      };
    };

    NodeSassCompiler.prototype.buildNodeSassParameters = function(outputFile) {
      var argumentParser, basename, execParameters, fileExtension, functionsFilename, i, importerFilename, includePath, j, ref, sourceMapFilename, workingDirectory;
      execParameters = [];
      workingDirectory = path.dirname(this.inputFile.path);
      execParameters.push('--output-style ' + outputFile.style);
      if (typeof this.options.indentType === 'string' && this.options.indentType.length > 0) {
        execParameters.push('--indent-type ' + this.options.indentType.toLowerCase());
      }
      if (typeof this.options.indentWidth === 'number') {
        execParameters.push('--indent-width ' + this.options.indentWidth);
      }
      if (typeof this.options.linefeed === 'string' && this.options.linefeed.lenght > 0) {
        execParameters.push('--linefeed ' + this.options.linefeed);
      }
      if (this.options.sourceComments === true) {
        execParameters.push('--source-comments');
      }
      if (this.options.sourceMap === true || (typeof this.options.sourceMap === 'string' && this.options.sourceMap.length > 0)) {
        if (this.options.sourceMap === true) {
          sourceMapFilename = outputFile.path + '.map';
        } else {
          basename = path.basename(outputFile.path);
          fileExtension = path.extname(basename).replace('.', '');
          sourceMapFilename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), this.options.sourceMap);
        }
        execParameters.push('--source-map "' + sourceMapFilename + '"');
      }
      if (this.options.sourceMapEmbed === true) {
        execParameters.push('--source-map-embed');
      }
      if (this.options.sourceMapContents === true) {
        execParameters.push('--source-map-contents');
      }
      if (this.options.includePath) {
        includePath = this.options.includePath;
        if (typeof includePath === 'string') {
          argumentParser = new ArgumentParser();
          includePath = argumentParser.parseValue('[' + includePath + ']');
          if (!Array.isArray(includePath)) {
            includePath = [includePath];
          }
        }
        for (i = j = 0, ref = includePath.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (!path.isAbsolute(includePath[i])) {
            includePath[i] = path.join(workingDirectory, includePath[i]);
          }
          if (includePath[i].substr(-1) === path.sep) {
            includePath[i] = includePath[i].substr(0, includePath[i].length - 1);
          }
          execParameters.push('--include-path "' + includePath[i] + '"');
        }
      }
      if (typeof this.options.precision === 'number') {
        execParameters.push('--precision ' + this.options.precision);
      }
      if (typeof this.options.importer === 'string' && this.options.importer.length > 0) {
        importerFilename = this.options.importer;
        if (!path.isAbsolute(importerFilename)) {
          importerFilename = path.join(workingDirectory, importerFilename);
        }
        execParameters.push('--importer "' + path.resolve(importerFilename) + '"');
      }
      if (typeof this.options.functions === 'string' && this.options.functions.length > 0) {
        functionsFilename = this.options.functions;
        if (!path.isAbsolute(functionsFilename)) {
          functionsFilename = path.join(workingDirectory, functionsFilename);
        }
        execParameters.push('--functions "' + path.resolve(functionsFilename) + '"');
      }
      execParameters.push('"' + this.inputFile.path + '"');
      execParameters.push('"' + outputFile.path + '"');
      return execParameters;
    };

    NodeSassCompiler.prototype.emitStart = function() {
      return this.emitter.emit('start', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitFinished = function() {
      this.deleteTemporaryFiles();
      return this.emitter.emit('finished', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitMessage = function(type, message) {
      return this.emitter.emit(type, this.getBasicEmitterParameters({
        message: message
      }));
    };

    NodeSassCompiler.prototype.emitMessageAndFinish = function(type, message, emitStartEvent) {
      if (emitStartEvent == null) {
        emitStartEvent = false;
      }
      if (emitStartEvent) {
        this.emitStart();
      }
      this.emitMessage(type, message);
      return this.emitFinished();
    };

    NodeSassCompiler.prototype.getBasicEmitterParameters = function(additionalParameters) {
      var key, parameters, value;
      if (additionalParameters == null) {
        additionalParameters = {};
      }
      parameters = {
        isCompileToFile: this.isCompileToFile(),
        isCompileDirect: this.isCompileDirect()
      };
      if (this.inputFile) {
        parameters.inputFilename = this.inputFile.path;
      }
      for (key in additionalParameters) {
        value = additionalParameters[key];
        parameters[key] = value;
      }
      return parameters;
    };

    NodeSassCompiler.prototype.deleteTemporaryFiles = function() {
      if (this.inputFile && this.inputFile.isTemporary) {
        File["delete"](this.inputFile.path);
      }
      if (this.outputFile && this.outputFile.isTemporary) {
        return File["delete"](this.outputFile.path);
      }
    };

    NodeSassCompiler.prototype.isCompileDirect = function() {
      return this.mode === NodeSassCompiler.MODE_DIRECT;
    };

    NodeSassCompiler.prototype.isCompileToFile = function() {
      return this.mode === NodeSassCompiler.MODE_FILE;
    };

    NodeSassCompiler.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    NodeSassCompiler.prototype.onSuccess = function(callback) {
      return this.emitter.on('success', callback);
    };

    NodeSassCompiler.prototype.onWarning = function(callback) {
      return this.emitter.on('warning', callback);
    };

    NodeSassCompiler.prototype.onError = function(callback) {
      return this.emitter.on('error', callback);
    };

    NodeSassCompiler.prototype.onFinished = function(callback) {
      return this.emitter.on('finished', callback);
    };

    return NodeSassCompiler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9jb21waWxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFVBQVcsT0FBQSxDQUFRLFdBQVI7O0VBQ1osc0JBQUEsR0FBeUIsT0FBQSxDQUFRLFdBQVI7O0VBRXpCLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUNQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSOztFQUVqQixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDOztFQUdoQyxNQUFNLENBQUMsT0FBUCxHQUNNO0lBRUYsZ0JBQUMsQ0FBQSxXQUFELEdBQWU7O0lBQ2YsZ0JBQUMsQ0FBQSxTQUFELEdBQWE7O0lBR0EsMEJBQUMsT0FBRDtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksT0FBSixDQUFBO0lBRkY7OytCQUtiLE9BQUEsR0FBUyxTQUFBO01BQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRk47OytCQUtULE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQXdCLGFBQXhCOztRQUFPLFdBQVc7OztRQUFNLGdCQUFnQjs7TUFDN0MsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLFVBQUQsR0FBYzthQUNkLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixRQUFoQjtJQUhLOzsrQkFPVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUF3QixhQUF4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QztJQURwQjs7K0JBSWpCLGVBQUEsR0FBaUIsU0FBQTtBQUNiLGFBQU8sSUFBQyxDQUFBLElBQUQsS0FBUyxnQkFBZ0IsQ0FBQztJQURwQjs7K0JBSWpCLE9BQUEsR0FBUyxTQUFDLFFBQUQ7YUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLFFBQXJCO0lBREs7OytCQUlULFNBQUEsR0FBVyxTQUFDLFFBQUQ7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxTQUFaLEVBQXVCLFFBQXZCO0lBRE87OytCQUlYLFNBQUEsR0FBVyxTQUFDLFFBQUQ7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxTQUFaLEVBQXVCLFFBQXZCO0lBRE87OytCQUlYLE9BQUEsR0FBUyxTQUFDLFFBQUQ7YUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLFFBQXJCO0lBREs7OytCQUlULFVBQUEsR0FBWSxTQUFDLFFBQUQ7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCO0lBRFE7Ozs7O0FBOXhCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7RW1pdHRlcn0gPSByZXF1aXJlKCdldmVudC1raXQnKVxuU2Fzc0F1dG9jb21waWxlT3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9ucycpXG5cbklubGluZVBhcmFtZXRlclBhcnNlciA9IHJlcXVpcmUoJy4vaGVscGVyL2lubGluZS1wYXJhbWV0ZXJzLXBhcnNlcicpXG5GaWxlID0gcmVxdWlyZSgnLi9oZWxwZXIvZmlsZScpXG5Bcmd1bWVudFBhcnNlciA9IHJlcXVpcmUoJy4vaGVscGVyL2FyZ3VtZW50LXBhcnNlcicpXG5cbmZzID0gcmVxdWlyZSgnZnMnKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTm9kZVNhc3NDb21waWxlclxuXG4gICAgQE1PREVfRElSRUNUID0gJ2RpcmVjdCdcbiAgICBATU9ERV9GSUxFID0gJ3RvLWZpbGUnXG5cblxuICAgIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICAgICAgQG9wdGlvbnMgPSBvcHRpb25zXG4gICAgICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG5cbiAgICBkZXN0cm95OiAoKSAtPlxuICAgICAgICBAZW1pdHRlci5kaXNwb3NlKClcbiAgICAgICAgQGVtaXR0ZXIgPSBudWxsXG5cblxuICAgIGNvbXBpbGU6IChtb2RlLCBmaWxlbmFtZSA9IG51bGwsIGNvbXBpbGVPblNhdmUgPSBmYWxzZSkgLT5cbiAgICAgICAgQGNvbXBpbGVPblNhdmUgPSBjb21waWxlT25TYXZlXG4gICAgICAgIEBjaGlsZEZpbGVzID0ge31cbiAgICAgICAgQF9jb21waWxlKG1vZGUsIGZpbGVuYW1lKVxuXG5cbiAgICAjIElmIGZpbGVuYW1lIGlzIG51bGwgdGhlbiBhY3RpdmUgdGV4dCBlZGl0b3IgaXMgdXNlZCBmb3IgY29tcGlsYXRpb25cbiAgICBfY29tcGlsZTogKG1vZGUsIGZpbGVuYW1lID0gbnVsbCwgY29tcGlsZU9uU2F2ZSA9IGZhbHNlKSAtPlxuICAgICAgICBAbW9kZSA9IG1vZGVcbiAgICAgICAgQHRhcmdldEZpbGVuYW1lID0gZmlsZW5hbWVcbiAgICAgICAgQGlucHV0RmlsZSA9IHVuZGVmaW5lZFxuICAgICAgICBAb3V0cHV0RmlsZSA9IHVuZGVmaW5lZFxuXG4gICAgICAgICMgUGFyc2UgaW5saW5lIHBhcmFtZXRlcnMgYW5kIHJ1biBjb21waWxhdGlvbjsgZm9yIGJldHRlciBwZXJmb3JtYW5jZSB3ZSB1c2UgYWN0aXZlXG4gICAgICAgICMgdGV4dC1lZGl0b3IgaWYgcG9zc2libGUsIHNvIHBhcmFtZXRlciBwYXJzZXIgbXVzdCBub3QgbG9hZCBmaWxlIGFnYWluXG4gICAgICAgIHBhcmFtZXRlclBhcnNlciA9IG5ldyBJbmxpbmVQYXJhbWV0ZXJQYXJzZXIoKVxuICAgICAgICBwYXJhbWV0ZXJUYXJnZXQgPSBAZ2V0UGFyYW1ldGVyVGFyZ2V0KClcbiAgICAgICAgcGFyYW1ldGVyUGFyc2VyLnBhcnNlIHBhcmFtZXRlclRhcmdldCwgKHBhcmFtcywgZXJyb3IpID0+XG4gICAgICAgICAgICAjIElmIHBhY2thZ2UgaXMgY2FsbGVkIGJ5IHNhdmUtZXZlbnQgb2YgZWRpdG9yLCBidXQgY29tcGlsYXRpb24gaXMgcHJvaGliaXRlZCBieVxuICAgICAgICAgICAgIyBvcHRpb25zIG9yIGZpcnN0IGxpbmUgcGFyYW1ldGVyLCBleGVjdXRpb24gaXMgY2FuY2VsbGVkXG4gICAgICAgICAgICBpZiBAY29tcGlsZU9uU2F2ZSBhbmQgQHByb2hpYml0Q29tcGlsYXRpb25PblNhdmUocGFyYW1zKVxuICAgICAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGEgZmlyc3QgbGluZSBwYXJhbXRlclxuICAgICAgICAgICAgaWYgcGFyYW1zIGlzIGZhbHNlIGFuZCBAb3B0aW9ucy5jb21waWxlT25seUZpcnN0TGluZUNvbW1lbnRGaWxlc1xuICAgICAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIEEgcG90ZW5pYWwgcGFyc2luZyBlcnJvciBpcyBvbmx5IGhhbmRsZWQgaWYgY29tcGlsYXRpb24gaXMgZXhlY3V0ZWQgYW5kIHRoYXQncyB0aGVcbiAgICAgICAgICAgICMgY2FzZSBpZiBjb21waWxlciBpcyBleGVjdXRlZCBieSBjb21tYW5kIG9yIGFmdGVyIGNvbXBpbGUgb24gc2F2ZSwgc28gdGhpcyBjb2RlIG11c3RcbiAgICAgICAgICAgICMgYmUgcGxhY2VkIGFib3ZlIHRoZSBjb2RlIGJlZm9yZVxuICAgICAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgZXJyb3IsIHRydWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIEBzZXR1cElucHV0RmlsZShmaWxlbmFtZSlcbiAgICAgICAgICAgIGlmIChlcnJvck1lc3NhZ2UgPSBAdmFsaWRhdGVJbnB1dEZpbGUoKSkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgZXJyb3JNZXNzYWdlLCB0cnVlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIElmIHRoZXJlIGlzIE5PIGZpcnN0LWxpbmUtY29tbWVudCwgc28gbm8gbWFpbiBmaWxlIGlzIHJlZmVyZW5jZWQsIHdlIHNob3VsZCBjaGVja1xuICAgICAgICAgICAgIyBpcyB1c2VyIHdhbnRzIHRvIGNvbXBpbGUgUGFydGlhbHNcbiAgICAgICAgICAgIGlmIHBhcmFtcyBpcyBmYWxzZSBhbmQgQGlzUGFydGlhbCgpIGFuZCBub3QgQG9wdGlvbnMuY29tcGlsZVBhcnRpYWxzXG4gICAgICAgICAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICMgSW4gY2FzZSB0aGVyZSBpcyBhIFwibWFpblwiIGlubGluZSBwYXJhbXRlciwgcGFyYW1zIGlzIGEgc3RyaW5nIGFuZCBjb250YWlucyB0aGVcbiAgICAgICAgICAgICMgdGFyZ2V0IGZpbGVuYW1lLlxuICAgICAgICAgICAgIyBJdCdzIGltcG9ydGFudCB0byBjaGVjayB0aGF0IGlucHV0RmlsZS5wYXRoIGlzIG5vdCBwYXJhbXMgYmVjYXVzZSBvZiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLm1haW4gaXMgJ3N0cmluZydcbiAgICAgICAgICAgICAgICBpZiBwYXJhbXMubWFpbiBpcyBAaW5wdXRGaWxlLnBhdGggb3IgQGNoaWxkRmlsZXNbcGFyYW1zLm1haW5dIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnZXJyb3InLCAnRm9sbG93aW5nIHRoZSBtYWluIHBhcmFtZXRlciBlbmRzIGluIGEgbG9vcC4nKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgQGlucHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgJ1xcJ21haW5cXCcgaW5saW5lIHBhcmFtZXRlciBpcyBub3Qgc3VwcG9ydGVkIGluIGRpcmVjdCBjb21waWxhdGlvbi4nKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNoaWxkRmlsZXNbcGFyYW1zLm1haW5dID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBAX2NvbXBpbGUoQG1vZGUsIHBhcmFtcy5tYWluKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBlbWl0U3RhcnQoKVxuXG4gICAgICAgICAgICAgICAgaWYgQGlzQ29tcGlsZVRvRmlsZSgpIGFuZCBub3QgQGVuc3VyZUZpbGVJc1NhdmVkKClcbiAgICAgICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCd3YXJuaW5nJywgJ0NvbXBpbGF0aW9uIGNhbmNlbGxlZCcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgQHVwZGF0ZU9wdGlvbnNXaXRoSW5saW5lUGFyYW1ldGVycyhwYXJhbXMpXG4gICAgICAgICAgICAgICAgQG91dHB1dFN0eWxlcyA9IEBnZXRPdXRwdXRTdHlsZXNUb0NvbXBpbGVUbygpXG5cbiAgICAgICAgICAgICAgICBpZiBAb3V0cHV0U3R5bGVzLmxlbmd0aCBpcyAwXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnd2FybmluZycsICdObyBvdXRwdXQgc3R5bGUgZGVmaW5lZCEgUGxlYXNlIGVuYWJsZSBhdCBsZWFzdCBvbmUgc3R5bGUgaW4gb3B0aW9ucyBvciB1c2UgaW5saW5lIHBhcmFtZXRlcnMuJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBAZG9Db21waWxlKClcblxuXG4gICAgZ2V0UGFyYW1ldGVyVGFyZ2V0OiAoKSAtPlxuICAgICAgICBpZiB0eXBlb2YgQHRhcmdldEZpbGVuYW1lIGlzICdzdHJpbmcnXG4gICAgICAgICAgICByZXR1cm4gQHRhcmdldEZpbGVuYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuXG4gICAgcHJvaGliaXRDb21waWxhdGlvbk9uU2F2ZTogKHBhcmFtcykgLT5cbiAgICAgICAgaWYgcGFyYW1zIGFuZCBwYXJhbXMuY29tcGlsZU9uU2F2ZSBpbiBbdHJ1ZSwgZmFsc2VdXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlT25TYXZlID0gcGFyYW1zLmNvbXBpbGVPblNhdmVcbiAgICAgICAgcmV0dXJuIG5vdCBAb3B0aW9ucy5jb21waWxlT25TYXZlXG5cblxuICAgIGlzUGFydGlhbDogKCkgLT5cbiAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgcmV0dXJuIChmaWxlbmFtZVswXSA9PSAnXycpXG5cblxuICAgIHNldHVwSW5wdXRGaWxlOiAoZmlsZW5hbWUgPSBudWxsKSAtPlxuICAgICAgICBAaW5wdXRGaWxlID1cbiAgICAgICAgICAgIGlzVGVtcG9yYXJ5OiBmYWxzZVxuXG4gICAgICAgIGlmIGZpbGVuYW1lXG4gICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBmaWxlbmFtZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgIHJldHVybiB1bmxlc3MgYWN0aXZlRWRpdG9yXG5cbiAgICAgICAgICAgIGlmIEBpc0NvbXBpbGVEaXJlY3QoKVxuICAgICAgICAgICAgICAgIHN5bnRheCA9IEBhc2tGb3JJbnB1dFN5bnRheCgpXG4gICAgICAgICAgICAgICAgaWYgc3ludGF4XG4gICAgICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IEZpbGUuZ2V0VGVtcG9yYXJ5RmlsZW5hbWUoJ3Nhc3MtYXV0b2NvbXBpbGUuaW5wdXQuJywgbnVsbCwgc3ludGF4KVxuICAgICAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLmlzVGVtcG9yYXJ5ID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKEBpbnB1dEZpbGUucGF0aCwgYWN0aXZlRWRpdG9yLmdldFRleHQoKSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IGFjdGl2ZUVkaXRvci5nZXRVUkkoKVxuICAgICAgICAgICAgICAgIGlmIG5vdCBAaW5wdXRGaWxlLnBhdGhcbiAgICAgICAgICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gQGFza0ZvclNhdmluZ1Vuc2F2ZWRGaWxlSW5BY3RpdmVFZGl0b3IoKVxuXG5cbiAgICBhc2tGb3JJbnB1dFN5bnRheDogKCkgLT5cbiAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICBtZXNzYWdlOiBcIklzIHRoZSBzeW50YXggb2YgeW91ciBpbnB1dCBTQVNTIG9yIFNDU1M/XCJcbiAgICAgICAgICAgIGJ1dHRvbnM6IFsnU0FTUycsICdTQ1NTJywgJ0NhbmNlbCddXG4gICAgICAgIHN3aXRjaCBkaWFsb2dSZXN1bHRCdXR0b25cbiAgICAgICAgICAgIHdoZW4gMCB0aGVuIHN5bnRheCA9ICdzYXNzJ1xuICAgICAgICAgICAgd2hlbiAxIHRoZW4gc3ludGF4ID0gJ3Njc3MnXG4gICAgICAgICAgICBlbHNlIHN5bnRheCA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gc3ludGF4XG5cblxuICAgIGFza0ZvclNhdmluZ1Vuc2F2ZWRGaWxlSW5BY3RpdmVFZGl0b3I6ICgpIC0+XG4gICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW4gb3JkZXIgdG8gY29tcGlsZSB0aGlzIFNBU1MgZmlsZSB0byBhIENTUyBmaWxlLCB5b3UgaGF2ZSBkbyBzYXZlIGl0IGJlZm9yZS4gRG8geW91IHdhbnQgdG8gc2F2ZSB0aGlzIGZpbGU/XCJcbiAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJBbHRlcm5hdGl2bHkgeW91IGNhbiB1c2UgJ0RpcmVjdCBDb21waWxhdGlvbicgZm9yIGNvbXBpbGluZyB3aXRob3V0IGNyZWF0aW5nIGEgQ1NTIGZpbGUuXCJcbiAgICAgICAgICAgIGJ1dHRvbnM6IFtcIlNhdmVcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgaWYgZGlhbG9nUmVzdWx0QnV0dG9uIGlzIDBcbiAgICAgICAgICAgIGZpbGVuYW1lID0gYXRvbS5zaG93U2F2ZURpYWxvZ1N5bmMoKVxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgYWN0aXZlRWRpdG9yLnNhdmVBcyhmaWxlbmFtZSlcbiAgICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAgICAgIyBkbyBub3RoaW5nIGlmIHNvbWV0aGluZyBmYWlscyBiZWNhdXNlIGdldFVSSSgpIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCwgaWZcbiAgICAgICAgICAgICAgICAjIGZpbGUgaXMgbm90IHNhdmVkXG5cbiAgICAgICAgICAgIGZpbGVuYW1lID0gYWN0aXZlRWRpdG9yLmdldFVSSSgpXG4gICAgICAgICAgICByZXR1cm4gZmlsZW5hbWVcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgIHZhbGlkYXRlSW5wdXRGaWxlOiAoKSAtPlxuICAgICAgICBlcnJvck1lc3NhZ2UgPSB1bmRlZmluZWRcblxuICAgICAgICAjIElmIG5vIGlucHV0RmlsZS5wYXRoIGlzIGdpdmVuLCB0aGVuIHdlIGNhbm5vdCBjb21waWxlIHRoZSBmaWxlIG9yIGNvbnRlbnQsXG4gICAgICAgICMgYmVjYXVzZSBzb21ldGhpbmcgaXMgd3JvbmdcbiAgICAgICAgaWYgbm90IEBpbnB1dEZpbGUucGF0aFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ludmFsaWQgZmlsZTogJyArIEBpbnB1dEZpbGUucGF0aFxuXG4gICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGaWxlIGRvZXMgbm90IGV4aXN0OiAnICsgQGlucHV0RmlsZS5wYXRoXG5cbiAgICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZVxuXG5cbiAgICBlbnN1cmVGaWxlSXNTYXZlZDogKCkgLT5cbiAgICAgICAgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgICAgZm9yIGVkaXRvciBpbiBlZGl0b3JzXG4gICAgICAgICAgICBpZiBlZGl0b3IgYW5kIGVkaXRvci5nZXRVUkkgYW5kIGVkaXRvci5nZXRVUkkoKSBpcyBAaW5wdXRGaWxlLnBhdGggYW5kIGVkaXRvci5pc01vZGlmaWVkKClcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIicje2ZpbGVuYW1lfScgaGFzIGNoYW5nZXMsIGRvIHlvdSB3YW50IHRvIHNhdmUgdGhlbT9cIlxuICAgICAgICAgICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiSW4gb3JkZXIgdG8gY29tcGlsZSBTQVNTIHlvdSBoYXZlIHRvIHNhdmUgY2hhbmdlcy5cIlxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJTYXZlIGFuZCBjb21waWxlXCIsIFwiQ2FuY2VsXCJdXG4gICAgICAgICAgICAgICAgaWYgZGlhbG9nUmVzdWx0QnV0dG9uIGlzIDBcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgcmV0dXJuIHRydWVcblxuXG4gICAgIyBBdmFpbGFibGUgcGFyYW1ldGVyc1xuICAgICMgICBvdXRcbiAgICAjICAgb3V0cHV0U3R5bGVcbiAgICAjXG4gICAgIyAgIGNvbXBpbGVDb21wcmVzc2VkXG4gICAgIyAgIGNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAjICAgY29tcGlsZUNvbXBhY3RcbiAgICAjICAgY29tcGFjdEZpbGVuYW1lUGF0dGVyblxuICAgICMgICBjb21waWxlTmVzdGVkXG4gICAgIyAgIG5lc3RlZEZpbGVuYW1lUGF0dGVyblxuICAgICMgICBjb21waWxlRXhwYW5kZWRcbiAgICAjICAgZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAjXG4gICAgIyAgIGluZGVudFR5cGVcbiAgICAjICAgaW5kZW50V2lkdGhcbiAgICAjICAgbGluZWZlZWRcbiAgICAjICAgc291cmNlTWFwXG4gICAgIyAgIHNvdXJjZU1hcEVtYmVkXG4gICAgIyAgIHNvdXJjZU1hcENvbnRlbnRzXG4gICAgIyAgIHNvdXJjZUNvbW1lbnRzXG4gICAgIyAgIGluY2x1ZGVQYXRoXG4gICAgIyAgIHByZWNpc2lvblxuICAgICMgICBpbXBvcnRlclxuICAgICMgICBmdW5jdGlvbnNcbiAgICB1cGRhdGVPcHRpb25zV2l0aElubGluZVBhcmFtZXRlcnM6IChwYXJhbXMpIC0+XG4gICAgICAgICMgQkFDS1dBUkQgQ09NUEFUSUJJTElUWTogcGFyYW1zLm91dCBhbmQgcGFyYW0ub3V0cHV0U3R5bGVcbiAgICAgICAgIyBTaG91bGQgd2UgbGV0IHRoaXMgY29kZSBoZXJlLCBzbyB3ZSBjYW4gZGVjaWRlIHRvIG91dHB1dCBvbmx5IG9uZSBzaW5nbGUgZmlsZSB3aXRoIG9uZSBvdXRwdXQgc3R5bGUgcGVyIFNBU1MgZmlsZT9cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5vdXQgaXMgJ3N0cmluZycgb3IgdHlwZW9mIHBhcmFtcy5vdXRwdXRTdHlsZSBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcGFyYW1zLmNvbXByZXNzIGlzICdib29sZWFuJ1xuXG4gICAgICAgICAgICBpZiBAb3B0aW9ucy5zaG93T2xkUGFyYW1ldGVyc1dhcm5pbmdcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2UoJ3dhcm5pbmcnLCAnUGxlYXNlIGRvblxcJ3QgdXNlIFxcJ291dFxcJywgXFwnb3V0cHV0U3R5bGVcXCcgb3IgXFwnY29tcHJlc3NcXCcgcGFyYW1ldGVyIGFueSBtb3JlLiBIYXZlIGEgbG9vayBhdCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbmV3ZXIgcGFyYW1ldGVycycpXG5cbiAgICAgICAgICAgICMgU2V0IGRlZmF1bHQgb3V0cHV0IHN0eWxlXG4gICAgICAgICAgICBvdXRwdXRTdHlsZSA9ICdjb21wcmVzc2VkJ1xuXG4gICAgICAgICAgICAjIElmIFwiY29tcHJlc3NcIiBpcyBzZXQsIGFwcGx5IHRoaXMgdmFsdWVcbiAgICAgICAgICAgIGlmIHBhcmFtcy5jb21wcmVzcyBpcyBmYWxzZVxuICAgICAgICAgICAgICAgIG91dHB1dFN0eWxlID0gJ25lc3RlZCdcbiAgICAgICAgICAgIGlmIHBhcmFtcy5jb21wcmVzcyBpcyB0cnVlXG4gICAgICAgICAgICAgICAgb3V0cHV0U3R5bGUgPSAnY29tcHJlc3NlZCdcblxuICAgICAgICAgICAgaWYgcGFyYW1zLm91dHB1dFN0eWxlXG4gICAgICAgICAgICAgICAgb3V0cHV0U3R5bGUgPSBpZiB0eXBlb2YgcGFyYW1zLm91dHB1dFN0eWxlIGlzICdzdHJpbmcnIHRoZW4gcGFyYW1zLm91dHB1dFN0eWxlLnRvTG93ZXJDYXNlKCkgZWxzZSAnY29tcHJlc3NlZCdcblxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXByZXNzZWQgPSAob3V0cHV0U3R5bGUgaXMgJ2NvbXByZXNzZWQnKVxuICAgICAgICAgICAgaWYgb3V0cHV0U3R5bGUgaXMgJ2NvbXByZXNzZWQnIGFuZCB0eXBlb2YgcGFyYW1zLm91dCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLm91dC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQG9wdGlvbnMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5vdXRcblxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXBhY3QgPSAob3V0cHV0U3R5bGUgaXMgJ2NvbXBhY3QnKVxuICAgICAgICAgICAgaWYgb3V0cHV0U3R5bGUgaXMgJ2NvbXBhY3QnIGFuZCB0eXBlb2YgcGFyYW1zLm91dCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLm91dC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQG9wdGlvbnMuY29tcGFjdEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5vdXRcblxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZU5lc3RlZCA9IChvdXRwdXRTdHlsZSBpcyAnbmVzdGVkJylcbiAgICAgICAgICAgIGlmIG91dHB1dFN0eWxlIGlzICduZXN0ZWQnIGFuZCB0eXBlb2YgcGFyYW1zLm91dCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLm91dC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQG9wdGlvbnMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLm91dFxuXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlRXhwYW5kZWQgPSAob3V0cHV0U3R5bGUgaXMgJ2V4cGFuZGVkJylcbiAgICAgICAgICAgIGlmIG91dHB1dFN0eWxlIGlzICdleHBhbmRlZCcgYW5kIHR5cGVvZiBwYXJhbXMub3V0IGlzICdzdHJpbmcnIGFuZCBwYXJhbXMub3V0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBAb3B0aW9ucy5leHBhbmRlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5vdXRcblxuXG4gICAgICAgICMgSWYgdXNlciBzcGVjaWZpZXMgYSBzaW5nbGUgb3IgbXVsdGlwbGUgb3V0cHV0IHN0eWxlcywgd2UgcmVzZXQgdGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgICAgICAgIyBzbyBvbmx5IHRoZSBnaXZlbiBvdXRwdXQgc3R5bGVzIGFyZSBjb21waWxlZCB0b1xuICAgICAgICBpZiBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWQgb3IgcGFyYW1zLmNvbXBpbGVDb21wYWN0IG9yIHBhcmFtcy5jb21waWxlTmVzdGVkIG9yIHBhcmFtcy5jb21waWxlRXhwYW5kZWRcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wYWN0ID0gZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVOZXN0ZWQgPSBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUV4cGFuZGVkID0gZmFsc2VcblxuICAgICAgICAjIGNvbXBpbGVDb21wcmVzc2VkXG4gICAgICAgIGlmIHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZCBpcyB0cnVlIG9yIHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZCBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXByZXNzZWQgPSBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWRcbiAgICAgICAgZWxzZSBpZiB0eXBlb2YgcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcHJlc3NlZCA9IHRydWVcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWRcblxuICAgICAgICAjIGNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybi5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm5cblxuICAgICAgICAjIGNvbXBpbGVDb21wYWN0XG4gICAgICAgIGlmIHBhcmFtcy5jb21waWxlQ29tcGFjdCBpcyB0cnVlIG9yIHBhcmFtcy5jb21waWxlQ29tcGFjdCBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXBhY3QgPSBwYXJhbXMuY29tcGlsZUNvbXBhY3RcbiAgICAgICAgZWxzZSBpZiB0eXBlb2YgcGFyYW1zLmNvbXBpbGVDb21wYWN0IGlzICdzdHJpbmcnXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcGFjdCA9IHRydWVcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcGlsZUNvbXBhY3RcblxuICAgICAgICAjIGNvbXBhY3RGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuY29tcGFjdEZpbGVuYW1lUGF0dGVybi5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm5cblxuICAgICAgICAjIGNvbXBpbGVOZXN0ZWRcbiAgICAgICAgaWYgcGFyYW1zLmNvbXBpbGVOZXN0ZWQgaXMgdHJ1ZSBvciBwYXJhbXMuY29tcGlsZU5lc3RlZCBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZU5lc3RlZCA9IHBhcmFtcy5jb21waWxlTmVzdGVkXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHBhcmFtcy5jb21waWxlTmVzdGVkIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlTmVzdGVkID0gdHJ1ZVxuICAgICAgICAgICAgQG9wdGlvbnMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXBpbGVOZXN0ZWRcblxuICAgICAgICAjIG5lc3RlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLm5lc3RlZEZpbGVuYW1lUGF0dGVybiBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLm5lc3RlZEZpbGVuYW1lUGF0dGVybi5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuXG5cbiAgICAgICAgIyBjb21waWxlRXhwYW5kZWRcbiAgICAgICAgaWYgcGFyYW1zLmNvbXBpbGVFeHBhbmRlZCBpcyB0cnVlIG9yIHBhcmFtcy5jb21waWxlRXhwYW5kZWQgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVFeHBhbmRlZCA9IHBhcmFtcy5jb21waWxlRXhwYW5kZWRcbiAgICAgICAgZWxzZSBpZiB0eXBlb2YgcGFyYW1zLmNvbXBpbGVFeHBhbmRlZCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUV4cGFuZGVkID0gdHJ1ZVxuICAgICAgICAgICAgQG9wdGlvbnMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcGlsZUV4cGFuZGVkXG5cbiAgICAgICAgIyBleHBhbmRlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm4ubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm5cblxuICAgICAgICAjIGluZGVudFR5cGVcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5pbmRlbnRUeXBlIGlzICdzdHJpbmcnICBhbmQgcGFyYW1zLmluZGVudFR5cGUudG9Mb3dlckNhc2UoKSBpbiBbJ3NwYWNlJywgJ3RhYiddXG4gICAgICAgICAgICBAb3B0aW9ucy5pbmRlbnRUeXBlID0gcGFyYW1zLmluZGVudFR5cGUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICMgaW5kZW50V2lkdGhcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5pbmRlbnRXaWR0aCBpcyAnbnVtYmVyJyBhbmQgcGFyYW1zLmluZGVudFdpZHRoIDw9IDEwIGFuZCBpbmRlbnRXaWR0aCA+PSAwXG4gICAgICAgICAgICBAb3B0aW9ucy5pbmRlbnRXaWR0aCA9IHBhcmFtcy5pbmRlbnRXaWR0aFxuXG4gICAgICAgICMgbGluZWZlZWRcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5saW5lZmVlZCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmxpbmVmZWVkLnRvTG93ZXJDYXNlKCkgaW4gWydjcicsICdjcmxmJywgJ2xmJywgJ2xmY3InXVxuICAgICAgICAgICAgQG9wdGlvbnMubGluZWZlZWQgPSBwYXJhbXMubGluZWZlZWQudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICMgc291cmNlTWFwXG4gICAgICAgIGlmIHBhcmFtcy5zb3VyY2VNYXAgaXMgdHJ1ZSBvciBwYXJhbXMuc291cmNlTWFwIGlzIGZhbHNlIG9yICh0eXBlb2YgcGFyYW1zLnNvdXJjZU1hcCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLnNvdXJjZU1hcC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgQG9wdGlvbnMuc291cmNlTWFwID0gcGFyYW1zLnNvdXJjZU1hcFxuXG4gICAgICAgICMgc291cmNlTWFwRW1iZWRcbiAgICAgICAgaWYgcGFyYW1zLnNvdXJjZU1hcEVtYmVkIGlzIHRydWUgb3IgcGFyYW1zLnNvdXJjZU1hcEVtYmVkIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5zb3VyY2VNYXBFbWJlZCA9IHBhcmFtcy5zb3VyY2VNYXBFbWJlZFxuXG4gICAgICAgICMgc291cmNlTWFwQ29udGVudHNcbiAgICAgICAgaWYgcGFyYW1zLnNvdXJjZU1hcENvbnRlbnRzIGlzIHRydWUgb3IgcGFyYW1zLnNvdXJjZU1hcENvbnRlbnRzIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5zb3VyY2VNYXBDb250ZW50cyA9IHBhcmFtcy5zb3VyY2VNYXBDb250ZW50c1xuXG4gICAgICAgICMgc291cmNlQ29tbWVudHNcbiAgICAgICAgaWYgcGFyYW1zLnNvdXJjZUNvbW1lbnRzIGlzIHRydWUgb3IgcGFyYW1zLnNvdXJjZUNvbW1lbnRzIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5zb3VyY2VDb21tZW50cyA9IHBhcmFtcy5zb3VyY2VDb21tZW50c1xuXG4gICAgICAgICMgaW5jbHVkZVBhdGhcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuaW5jbHVkZVBhdGggaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5pbmNsdWRlUGF0aC5sZW5ndGggPiAxKSBvciBBcnJheS5pc0FycmF5KHBhcmFtcy5pbmNsdWRlUGF0aClcbiAgICAgICAgICAgIEBvcHRpb25zLmluY2x1ZGVQYXRoID0gcGFyYW1zLmluY2x1ZGVQYXRoXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMuaW5jbHVkZVBhdGhzIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuaW5jbHVkZVBhdGhzLmxlbmd0aCA+IDEpIG9yIEFycmF5LmlzQXJyYXkocGFyYW1zLmluY2x1ZGVQYXRocylcbiAgICAgICAgICAgIEBvcHRpb25zLmluY2x1ZGVQYXRoID0gcGFyYW1zLmluY2x1ZGVQYXRoc1xuXG4gICAgICAgICMgcHJlY2lzaW9uXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMucHJlY2lzaW9uIGlzICdudW1iZXInIGFuZCBwYXJhbXMucHJlY2lzaW9uID49IDBcbiAgICAgICAgICAgIEBvcHRpb25zLnByZWNpc2lvbiA9IHBhcmFtcy5wcmVjaXNpb25cblxuICAgICAgICAjIGltcG9ydGVyXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuaW1wb3J0ZXIgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5pbXBvcnRlci5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5pbXBvcnRlciA9IHBhcmFtcy5pbXBvcnRlclxuXG4gICAgICAgICMgZnVuY3Rpb25zXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuZnVuY3Rpb25zIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuZnVuY3Rpb25zLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLmZ1bmN0aW9ucyA9IHBhcmFtcy5mdW5jdGlvbnNcblxuXG4gICAgZ2V0T3V0cHV0U3R5bGVzVG9Db21waWxlVG86ICgpIC0+XG4gICAgICAgIG91dHB1dFN0eWxlcyA9IFtdXG4gICAgICAgIGlmIEBvcHRpb25zLmNvbXBpbGVDb21wcmVzc2VkXG4gICAgICAgICAgICBvdXRwdXRTdHlsZXMucHVzaCgnY29tcHJlc3NlZCcpXG4gICAgICAgIGlmIEBvcHRpb25zLmNvbXBpbGVDb21wYWN0XG4gICAgICAgICAgICBvdXRwdXRTdHlsZXMucHVzaCgnY29tcGFjdCcpXG4gICAgICAgIGlmIEBvcHRpb25zLmNvbXBpbGVOZXN0ZWRcbiAgICAgICAgICAgIG91dHB1dFN0eWxlcy5wdXNoKCduZXN0ZWQnKVxuICAgICAgICBpZiBAb3B0aW9ucy5jb21waWxlRXhwYW5kZWRcbiAgICAgICAgICAgIG91dHB1dFN0eWxlcy5wdXNoKCdleHBhbmRlZCcpXG5cbiAgICAgICAgIyBXaGVuIGl0J3MgZGlyZWN0IGNvbXBpbGF0aW9uIHVzZSBoYXMgdG8gc2VsZWN0IGEgc2luZ2xlIG91dHB1dCBzdHlsZSBpZiB0aGVyZSBpcyBtb3JlXG4gICAgICAgICMgdGhhbiBvbmUgb3V0cHV0IHN0eWxlIGF2YWlsYWJsZVxuICAgICAgICBpZiBAaXNDb21waWxlRGlyZWN0KCkgYW5kIG91dHB1dFN0eWxlcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBvdXRwdXRTdHlsZXMucHVzaCgnQ2FuY2VsJylcbiAgICAgICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRm9yIGRpcmVjdGlvbiBjb21waWxhdGlvbiB5b3UgaGF2ZSB0byBzZWxlY3QgYSBzaW5nbGUgb3V0cHV0IHN0eWxlLiBXaGljaCBvbmUgZG8geW91IHdhbnQgdG8gdXNlP1wiXG4gICAgICAgICAgICAgICAgYnV0dG9uczogb3V0cHV0U3R5bGVzXG4gICAgICAgICAgICBpZiBkaWFsb2dSZXN1bHRCdXR0b24gPCBvdXRwdXRTdHlsZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgICMgUmV0dXJuIG9ubHkgdGhlIHNlbGVjdGVkIG91dHB1dCBzdHlsZSBhcyBhcnJheVxuICAgICAgICAgICAgICAgIG91dHB1dFN0eWxlcyA9IFsgb3V0cHV0U3R5bGVzW2RpYWxvZ1Jlc3VsdEJ1dHRvbl0gXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICMgUmV0dXJuaW5nIGFuIGVtcHR5IGFycmF5IG1lYW5zIG5vIGNvbXBpbGF0aW9uIGlzIHN0YXJ0ZWRcbiAgICAgICAgICAgICAgICBvdXRwdXRTdHlsZXMgPSBbXVxuXG4gICAgICAgIHJldHVybiBvdXRwdXRTdHlsZXNcblxuXG4gICAgZ2V0T3V0cHV0RmlsZTogKG91dHB1dFN0eWxlKSAtPlxuICAgICAgICBvdXRwdXRGaWxlID1cbiAgICAgICAgICAgIHN0eWxlOiBvdXRwdXRTdHlsZVxuICAgICAgICAgICAgaXNUZW1wb3Jhcnk6IGZhbHNlXG5cbiAgICAgICAgaWYgQGlzQ29tcGlsZURpcmVjdCgpXG4gICAgICAgICAgICBvdXRwdXRGaWxlLnBhdGggPSBGaWxlLmdldFRlbXBvcmFyeUZpbGVuYW1lKCdzYXNzLWF1dG9jb21waWxlLm91dHB1dC4nLCBudWxsLCAnY3NzJylcbiAgICAgICAgICAgIG91dHB1dEZpbGUuaXNUZW1wb3JhcnkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN3aXRjaCBvdXRwdXRGaWxlLnN0eWxlXG4gICAgICAgICAgICAgICAgd2hlbiAnY29tcHJlc3NlZCcgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIHdoZW4gJ2NvbXBhY3QnIHRoZW4gcGF0dGVybiA9IEBvcHRpb25zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgICAgICAgICB3aGVuICduZXN0ZWQnIHRoZW4gcGF0dGVybiA9IEBvcHRpb25zLm5lc3RlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIHdoZW4gJ2V4cGFuZGVkJyB0aGVuIHBhdHRlcm4gPSBAb3B0aW9ucy5leHBhbmRlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG91dHB1dCBzdHlsZS4nKVxuXG4gICAgICAgICAgICBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgIyB3ZSBuZWVkIHRoZSBmaWxlIGV4dGVuc2lvbiB3aXRob3V0IHRoZSBkb3QhXG4gICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGJhc2VuYW1lKS5yZXBsYWNlKCcuJywgJycpXG5cbiAgICAgICAgICAgIGZpbGVuYW1lID0gYmFzZW5hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdeKC4qPylcXC4oJyArIGZpbGVFeHRlbnNpb24gKyAnKSQnLCAnZ2knKSwgcGF0dGVybilcblxuICAgICAgICAgICAgaWYgbm90IHBhdGguaXNBYnNvbHV0ZShwYXRoLmRpcm5hbWUoZmlsZW5hbWUpKVxuICAgICAgICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmRpcm5hbWUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gcGF0aC5qb2luKG91dHB1dFBhdGgsIGZpbGVuYW1lKVxuXG4gICAgICAgICAgICBvdXRwdXRGaWxlLnBhdGggPSBmaWxlbmFtZVxuXG4gICAgICAgIHJldHVybiBvdXRwdXRGaWxlXG5cblxuICAgIGNoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHM6IChvdXRwdXRGaWxlKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5jaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzXG4gICAgICAgICAgICBpZiBmcy5leGlzdHNTeW5jKG91dHB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGUgb3V0cHV0IGZpbGUgYWxyZWFkeSBleGlzdHMuIERvIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSBpdD9cIlxuICAgICAgICAgICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiT3V0cHV0IGZpbGU6ICcje291dHB1dEZpbGUucGF0aH0nXCJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1wiT3ZlcndyaXRlXCIsIFwiU2tpcFwiLCBcIkNhbmNlbFwiXVxuICAgICAgICAgICAgICAgIHN3aXRjaCBkaWFsb2dSZXN1bHRCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwIHRoZW4gcmV0dXJuICdvdmVyd3JpdGUnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMSB0aGVuIHJldHVybiAnc2tpcCdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyIHRoZW4gcmV0dXJuICdjYW5jZWwnXG4gICAgICAgIHJldHVybiAnb3ZlcndyaXRlJ1xuXG5cbiAgICBlbnN1cmVPdXRwdXREaXJlY3RvcnlFeGlzdHM6IChvdXRwdXRGaWxlKSAtPlxuICAgICAgICBpZiBAaXNDb21waWxlVG9GaWxlKClcbiAgICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmRpcm5hbWUob3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgRmlsZS5lbnN1cmVEaXJlY3RvcnlFeGlzdHMob3V0cHV0UGF0aClcblxuXG4gICAgdHJ5VG9GaW5kTm9kZVNhc3NJbnN0YWxsYXRpb246IChjYWxsYmFjaykgLT5cbiAgICAgICAgIyBDb21tYW5kIHdoaWNoIGNoZWNrcyBpZiBub2RlLXNhc3MgaXMgYWNjZXNzYWJsZSB3aXRob3V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgIyBUaGlzIGNvbW1hbmQgd29ya3Mgb24gV2luZG93cywgTGludXggYW5kIE1hYyBPU1xuICAgICAgICBkZXZOdWxsID0gaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gJ251bCcgZWxzZSAnL2Rldi9udWxsJ1xuICAgICAgICBleGlzdGFuY2VDaGVja0NvbW1hbmQgPSBcIm5vZGUtc2FzcyAtLXZlcnNpb24gPiN7ZGV2TnVsbH0gMj4mMSAmJiAoZWNobyBmb3VuZCkgfHwgKGVjaG8gZmFpbClcIlxuXG4gICAgICAgIHBvc3NpYmxlTm9kZVNhc3NQYXRocyA9IFsnJ11cbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLm5vZGVTYXNzUGF0aCBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMubm9kZVNhc3NQYXRoLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIHBvc3NpYmxlTm9kZVNhc3NQYXRocy5wdXNoKEBvcHRpb25zLm5vZGVTYXNzUGF0aClcbiAgICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInXG4gICAgICAgICAgICBwb3NzaWJsZU5vZGVTYXNzUGF0aHMucHVzaCggcGF0aC5qb2luKHByb2Nlc3MuZW52WyBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgdGhlbiAnVVNFUlBST0ZJTEUnIGVsc2UgJ0hPTUUnIF0sICdBcHBEYXRhXFxcXFJvYW1pbmdcXFxcbnBtJykgKVxuICAgICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdsaW51eCdcbiAgICAgICAgICAgIHBvc3NpYmxlTm9kZVNhc3NQYXRocy5wdXNoKCcvdXNyL2xvY2FsL2JpbicpXG4gICAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ2RhcndpbidcbiAgICAgICAgICAgIHBvc3NpYmxlTm9kZVNhc3NQYXRocy5wdXNoKCcvdXNyL2xvY2FsL2JpbicpXG5cblxuICAgICAgICBjaGVja05vZGVTYXNzRXhpc3RzID0gKGZvdW5kSW5QYXRoKSA9PlxuICAgICAgICAgICAgaWYgdHlwZW9mIGZvdW5kSW5QYXRoIGlzICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgaWYgZm91bmRJblBhdGggaXMgQG9wdGlvbnMubm9kZVNhc3NQYXRoXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIGZhbHNlKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgQGFza0FuZEZpeE5vZGVTYXNzUGF0aChmb3VuZEluUGF0aClcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBmYWxzZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgcG9zc2libGVOb2RlU2Fzc1BhdGhzLmxlbmd0aCBpcyAwXG4gICAgICAgICAgICAgICAgIyBOT1QgZm91bmQgYW5kIE5PVCBmaXhlZFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBmYWxzZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgc2VhcmNoUGF0aCA9IHBvc3NpYmxlTm9kZVNhc3NQYXRocy5zaGlmdCgpXG4gICAgICAgICAgICBjb21tYW5kID0gcGF0aC5qb2luKHNlYXJjaFBhdGgsIGV4aXN0YW5jZUNoZWNrQ29tbWFuZClcbiAgICAgICAgICAgIGVudmlyb25tZW50ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSggcHJvY2Vzcy5lbnYgKSk7XG4gICAgICAgICAgICBpZiB0eXBlb2Ygc2VhcmNoUGF0aCBpcyAnc3RyaW5nJyBhbmQgc2VhcmNoUGF0aC5sZW5ndGggPiAxXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQuUEFUSCArPSBcIjoje3NlYXJjaFBhdGh9XCJcblxuICAgICAgICAgICAgZXhlYyBjb21tYW5kLCB7IGVudjogZW52aXJvbm1lbnQgfSwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgICAgICAgICAgICBpZiBzdGRvdXQudHJpbSgpIGlzICdmb3VuZCdcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tOb2RlU2Fzc0V4aXN0cyhzZWFyY2hQYXRoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tOb2RlU2Fzc0V4aXN0cygpXG5cblxuICAgICAgICAjIFN0YXJ0IHJlY3Vyc2l2ZSBzZWFyY2ggZm9yIG5vZGUtc2FzcyBjb21tYW5kXG4gICAgICAgIGNoZWNrTm9kZVNhc3NFeGlzdHMoKVxuXG5cbiAgICBhc2tBbmRGaXhOb2RlU2Fzc1BhdGg6IChub2RlU2Fzc1BhdGgpIC0+XG4gICAgICAgIGlmIG5vZGVTYXNzUGF0aCBpcyAnJyBhbmQgQG9wdGlvbnMubm9kZVNhc3NQYXRoIGlzbnQgJydcbiAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZSA9IFwiJ1BhdGggdG8gbm9kZS1zYXNzIGNvbW1hbmQnIG9wdGlvbiB3aWxsIGJlIGNsZWFyZWQsIGJlY2F1c2Ugbm9kZS1zYXNzIGlzIGFjY2Vzc2FibGUgd2l0aG91dCBhYnNvbHV0ZSBwYXRoLlwiXG5cbiAgICAgICAgZWxzZSBpZiBub2RlU2Fzc1BhdGggaXNudCAnJyBhbmQgQG9wdGlvbnMubm9kZVNhc3NQYXRoIGlzICcnXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2UgPSBcIidQYXRoIHRvIG5vZGUtc2FzcyBjb21tYW5kJyBvcHRpb24gd2lsbCBiZSBzZXQgdG8gJyN7bm9kZVNhc3NQYXRofScsIGJlY2F1c2UgY29tbWFuZCB3YXMgZm91bmQgdGhlcmUuXCJcblxuICAgICAgICBlbHNlIGlmIG5vZGVTYXNzUGF0aCBpc250ICcnIGFuZCBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggaXNudCAnJ1xuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlID0gXCInUGF0aCB0byBub2RlLXNhc3MgY29tbWFuZCcgb3B0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCAnI3tub2RlU2Fzc1BhdGh9JywgYmVjYXVzZSBjb21tYW5kIHdhcyBmb3VuZCB0aGVyZS5cIlxuXG4gICAgICAgICMgQXNrIHVzZXIgdG8gZml4IHRoYXQgcGF0aFxuICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiJ25vZGUtc2FzcycgY29tbWFuZCBjb3VsZCBub3QgYmUgZm91bmQgd2l0aCBjdXJyZW50IGNvbmZpZ3VyYXRpb24sIGJ1dCBpdCBjYW4gYmUgYXV0b21hdGljYWxseSBmaXhlZC4gRml4IGl0P1wiXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IGRldGFpbGVkTWVzc2FnZVxuICAgICAgICAgICAgYnV0dG9uczogW1wiRml4IGl0XCIsIFwiQ2FuY2VsXCJdXG4gICAgICAgIHN3aXRjaCBkaWFsb2dSZXN1bHRCdXR0b25cbiAgICAgICAgICAgIHdoZW4gMFxuICAgICAgICAgICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdub2RlU2Fzc1BhdGgnLCBub2RlU2Fzc1BhdGgpXG4gICAgICAgICAgICAgICAgQG9wdGlvbnMubm9kZVNhc3NQYXRoID0gbm9kZVNhc3NQYXRoXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIHdoZW4gMVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICBkb0NvbXBpbGU6ICgpIC0+XG4gICAgICAgIGlmIEBvdXRwdXRTdHlsZXMubGVuZ3RoIGlzIDBcbiAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICAgICAgaWYgQGlucHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgICAgIEZpbGUuZGVsZXRlKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG91dHB1dFN0eWxlID0gQG91dHB1dFN0eWxlcy5wb3AoKTtcbiAgICAgICAgb3V0cHV0RmlsZSA9IEBnZXRPdXRwdXRGaWxlKG91dHB1dFN0eWxlKVxuICAgICAgICBlbWl0dGVyUGFyYW1ldGVycyA9IEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKHsgb3V0cHV0RmlsZW5hbWU6IG91dHB1dEZpbGUucGF0aCwgb3V0cHV0U3R5bGU6IG91dHB1dEZpbGUuc3R5bGUgfSlcblxuICAgICAgICB0cnlcbiAgICAgICAgICAgIGlmIEBpc0NvbXBpbGVUb0ZpbGUoKVxuICAgICAgICAgICAgICAgIHN3aXRjaCBAY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0cyhvdXRwdXRGaWxlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuICdvdmVyd3JpdGUnIHRoZW4gIyBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ2NhbmNlbCcgdGhlbiB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBpbGF0aW9uIGNhbmNlbGxlZCcpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ3NraXAnXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0dGVyUGFyYW1ldGVycy5tZXNzYWdlID0gJ0NvbXBpbGF0aW9uIHNraXBwZWQ6ICcgKyBvdXRwdXRGaWxlLnBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQoJ3dhcm5pbmcnLCBlbWl0dGVyUGFyYW1ldGVycylcbiAgICAgICAgICAgICAgICAgICAgICAgIEBkb0NvbXBpbGUoKSAjIDwtLS0gUmVjdXJzaW9uISEhXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgQGVuc3VyZU91dHB1dERpcmVjdG9yeUV4aXN0cyhvdXRwdXRGaWxlKVxuXG4gICAgICAgICAgICBAc3RhcnRDb21waWxpbmdUaW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycyA9IEBwcmVwYXJlRXhlY1BhcmFtZXRlcnMob3V0cHV0RmlsZSlcbiAgICAgICAgICAgIHRpbWVvdXQgPSBpZiBAb3B0aW9ucy5ub2RlU2Fzc1RpbWVvdXQgPiAwIHRoZW4gQG9wdGlvbnMubm9kZVNhc3NUaW1lb3V0IGVsc2UgMFxuICAgICAgICAgICAgY2hpbGQgPSBleGVjIGV4ZWNQYXJhbWV0ZXJzLmNvbW1hbmQsIHsgZW52OiBleGVjUGFyYW1ldGVycy5lbnZpcm9ubWVudCwgdGltZW91dDogdGltZW91dCB9LCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PlxuICAgICAgICAgICAgICAgICMgZXhpdENvZGUgaXMgMSB3aGVuIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggZXhlY3V0aW5nIG5vZGUtc2FzcyBjb21tYW5kLCBub3Qgd2hlblxuICAgICAgICAgICAgICAgICMgdGhlcmUgaXMgYW4gZXJyb3IgaW4gU0FTU1xuICAgICAgICAgICAgICAgIGlmIGNoaWxkLmV4aXRDb2RlID4gMFxuICAgICAgICAgICAgICAgICAgICBAdHJ5VG9GaW5kTm9kZVNhc3NJbnN0YWxsYXRpb24gKGZvdW5kLCBmaXhlZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgT25seSByZXRyeSB0byBjb21waWxlIGlmIG5vZGUtc2FzcyBjb21tYW5kIGNvdWxkIGJlIGZpeGVkLCBub3QgaWZcbiAgICAgICAgICAgICAgICAgICAgICAgICMgbm9kZS1zYXNzIGNvdWxkIGJlIGZvdW5kLiBCZWNhdXNlIHRoZXJlIGNhbiBiZSBvdGhlciBlcnJvcyB0aGFuIG9ubHlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgYSBub24tZmluZGFibGUgbm9kZS1zYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBmaXhlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBfY29tcGlsZShAbW9kZSwgQHRhcmdldEZpbGVuYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdHJ5IGFnYWluIGNvbXBpbGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb25Db21waWxlZChvdXRwdXRGaWxlLCBlcnJvciwgc3Rkb3V0LCBzdGRlcnIsIGNoaWxkLmtpbGxlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZG9Db21waWxlKCkgIyA8LS0tIFJlY3Vyc2lvbiEhIVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG9uQ29tcGlsZWQob3V0cHV0RmlsZSwgZXJyb3IsIHN0ZG91dCwgc3RkZXJyLCBjaGlsZC5raWxsZWQpXG4gICAgICAgICAgICAgICAgICAgIEBkb0NvbXBpbGUoKSAjIDwtLS0gUmVjdXJzaW9uISEhXG5cbiAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzLm1lc3NhZ2UgPSBlcnJvclxuICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCgnZXJyb3InLCBlbWl0dGVyUGFyYW1ldGVycylcblxuICAgICAgICAgICAgIyBDbGVhciBvdXRwdXQgc3R5bGVzLCBzbyBubyBmdXJ0aGVyIGNvbXBpbGF0aW9uIHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgICAgICAgIEBvdXRwdXRTdHlsZXMgPSBbXTtcblxuICAgICAgICAgICAgQGRvQ29tcGlsZSgpICMgPC0tLSBSZWN1cnNpb24hISFcblxuXG4gICAgb25Db21waWxlZDogKG91dHB1dEZpbGUsIGVycm9yLCBzdGRvdXQsIHN0ZGVyciwga2lsbGVkKSAtPlxuICAgICAgICBlbWl0dGVyUGFyYW1ldGVycyA9IEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKHsgb3V0cHV0RmlsZW5hbWU6IG91dHB1dEZpbGUucGF0aCwgb3V0cHV0U3R5bGU6IG91dHB1dEZpbGUuc3R5bGUgfSlcbiAgICAgICAgc3RhdGlzdGljcyA9XG4gICAgICAgICAgICBkdXJhdGlvbjogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBAc3RhcnRDb21waWxpbmdUaW1lc3RhbXBcblxuICAgICAgICB0cnlcbiAgICAgICAgICAgICMgU2F2ZSBub2RlLXNhc3MgY29tcGlsYXRpb24gb3V0cHV0IChpbmZvLCB3YXJuaW5ncywgZXJyb3JzLCBldGMuKVxuICAgICAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMubm9kZVNhc3NPdXRwdXQgPSBpZiBzdGRvdXQgdGhlbiBzdGRvdXQgZWxzZSBzdGRlcnJcblxuICAgICAgICAgICAgaWYgZXJyb3IgaXNudCBudWxsIG9yIGtpbGxlZFxuICAgICAgICAgICAgICAgIGlmIGtpbGxlZFxuICAgICAgICAgICAgICAgICAgICAjIG5vZGUtc2FzcyBoYXMgYmVlbiBleGVjdXRlZCB0b28gbG9uZ1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBcIkNvbXBpbGF0aW9uIGNhbmNlbGxlZCBiZWNhdXNlIG9mIHRpbWVvdXQgKCN7QG9wdGlvbnMubm9kZVNhc3NUaW1lb3V0fSBtcylcIlxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAjIGVycm9yIHdoaWxlIGV4ZWN1dGluZyBub2RlLXNhc3NcbiAgICAgICAgICAgICAgICAgICAgaWYgZXJyb3IubWVzc2FnZS5pbmRleE9mKCdcIm1lc3NhZ2VcIjonKSA+IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvckpzb24gPSBlcnJvci5tZXNzYWdlLm1hdGNoKC97XFxuKC4qPyhcXG4pKSt9L2dtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04ucGFyc2UoZXJyb3JKc29uKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlXG5cbiAgICAgICAgICAgICAgICBlbWl0dGVyUGFyYW1ldGVycy5tZXNzYWdlID0gZXJyb3JNZXNzYWdlXG4gICAgICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCgnZXJyb3InLCBlbWl0dGVyUGFyYW1ldGVycylcblxuICAgICAgICAgICAgICAgICMgQ2xlYXIgb3V0cHV0IHN0eWxlcywgc28gbm8gZnVydGhlciBjb21waWxhdGlvbiB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICAgICAgICAgICAgQG91dHB1dFN0eWxlcyA9IFtdO1xuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3RhdGlzdGljcy5iZWZvcmUgPSBGaWxlLmdldEZpbGVTaXplKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBzdGF0aXN0aWNzLmFmdGVyID0gRmlsZS5nZXRGaWxlU2l6ZShvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgc3RhdGlzdGljcy51bml0ID0gJ0J5dGUnXG5cbiAgICAgICAgICAgICAgICBpZiBAaXNDb21waWxlRGlyZWN0KClcbiAgICAgICAgICAgICAgICAgICAgY29tcGlsZWRDc3MgPSBmcy5yZWFkRmlsZVN5bmMob3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0VGV4dCggY29tcGlsZWRDc3MudG9TdHJpbmcoKSApXG5cbiAgICAgICAgICAgICAgICBlbWl0dGVyUGFyYW1ldGVycy5zdGF0aXN0aWNzID0gc3RhdGlzdGljc1xuICAgICAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQoJ3N1Y2Nlc3MnLCBlbWl0dGVyUGFyYW1ldGVycylcblxuICAgICAgICBmaW5hbGx5XG4gICAgICAgICAgICAjIERlbGV0ZSB0ZW1wb3JhcnkgY3JlYXRlZCBvdXRwdXQgZmlsZSwgZXZlbiBpZiB0aGVyZSB3YXMgYW4gZXJyb3JcbiAgICAgICAgICAgICMgQnV0IGRvIG5vdCBkZWxldGUgYSB0ZW1wb3JhcnkgaW5wdXQgZmlsZSwgYmVjYXVzZSBvZiBtdWx0aXBsZSBvdXRwdXRzIVxuICAgICAgICAgICAgaWYgb3V0cHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgICAgIEZpbGUuZGVsZXRlKG91dHB1dEZpbGUucGF0aClcblxuXG4gICAgcHJlcGFyZUV4ZWNQYXJhbWV0ZXJzOiAob3V0cHV0RmlsZSkgLT5cbiAgICAgICAgIyBCdWlsZCB0aGUgY29tbWFuZCBzdHJpbmdcbiAgICAgICAgbm9kZVNhc3NQYXJhbWV0ZXJzID0gQGJ1aWxkTm9kZVNhc3NQYXJhbWV0ZXJzKG91dHB1dEZpbGUpXG4gICAgICAgIGNvbW1hbmQgPSAnbm9kZS1zYXNzICcgKyBub2RlU2Fzc1BhcmFtZXRlcnMuam9pbignICcpXG5cbiAgICAgICAgIyBDbG9uZSBjdXJyZW50IGVudmlyb25tZW50LCBzbyBkbyBub3QgdG91Y2ggdGhlIGdsb2JhbCBvbmUgYnV0IGNhbiBtb2RpZnkgdGhlIHNldHRpbmdzXG4gICAgICAgIGVudmlyb25tZW50ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSggcHJvY2Vzcy5lbnYgKSk7XG5cbiAgICAgICAgIyBCZWNhdXNlIG9mIHBlcm1pc3Npb24gcHJvYmxlbXMgaW4gTWFjIE9TIGFuZCBMaW51eCB3ZSBzb21ldGltZXMgbmVlZCB0byBhZGQgbm9kZVNhc3NQYXRoXG4gICAgICAgICMgdG8gY29tbWFuZCBhbmQgdG8gZW52aXJvbm1lbnQgdmFyaWFibGUgUEFUSCBzbyBzaGVsbCBBTkQgbm9kZS5qcyBjYW4gZmluZCBub2RlLXNhc3NcbiAgICAgICAgIyBleGVjdXRhYmxlXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLm5vZGVTYXNzUGF0aC5sZW5ndGggPiAxXG4gICAgICAgICAgICAjIFRPRE86IEhpZXIgc29sbHRlIGVzIHNvIG9wdGltaWVydCB3ZXJkZW4sIGRhc3Mgd2VubiBkZXIgYWJzb2x1dGUgUGZhZCBkaWUgQW53ZW5kdW5nIGVudGjDpGx0IGRpZXNlIMO8YmVybm9tbWVuIHdlcmRlbiBzb2xsdGVcbiAgICAgICAgICAgIGNvbW1hbmQgPSBwYXRoLmpvaW4oQG9wdGlvbnMubm9kZVNhc3NQYXRoLCBjb21tYW5kKVxuICAgICAgICAgICAgZW52aXJvbm1lbnQuUEFUSCArPSBcIjoje0BvcHRpb25zLm5vZGVTYXNzUGF0aH1cIlxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50XG4gICAgICAgIH1cblxuXG4gICAgYnVpbGROb2RlU2Fzc1BhcmFtZXRlcnM6IChvdXRwdXRGaWxlKSAtPlxuICAgICAgICBleGVjUGFyYW1ldGVycyA9IFtdXG4gICAgICAgIHdvcmtpbmdEaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoQGlucHV0RmlsZS5wYXRoKVxuXG4gICAgICAgICMgLS1vdXRwdXQtc3R5bGVcbiAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1vdXRwdXQtc3R5bGUgJyArIG91dHB1dEZpbGUuc3R5bGUpXG5cbiAgICAgICAgIyAtLWluZGVudC10eXBlXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5pbmRlbnRUeXBlIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5pbmRlbnRUeXBlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0taW5kZW50LXR5cGUgJyArIEBvcHRpb25zLmluZGVudFR5cGUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAjIC0taW5kZW50LXdpZHRoXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5pbmRlbnRXaWR0aCBpcyAnbnVtYmVyJ1xuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1pbmRlbnQtd2lkdGggJyArIEBvcHRpb25zLmluZGVudFdpZHRoKVxuXG4gICAgICAgICMgLS1saW5lZmVlZFxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMubGluZWZlZWQgaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLmxpbmVmZWVkLmxlbmdodCA+IDBcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tbGluZWZlZWQgJyArIEBvcHRpb25zLmxpbmVmZWVkKVxuXG4gICAgICAgICMgLS1zb3VyY2UtY29tbWVudHNcbiAgICAgICAgaWYgQG9wdGlvbnMuc291cmNlQ29tbWVudHMgaXMgdHJ1ZVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1zb3VyY2UtY29tbWVudHMnKVxuXG4gICAgICAgICMgLS1zb3VyY2UtbWFwXG4gICAgICAgIGlmIEBvcHRpb25zLnNvdXJjZU1hcCBpcyB0cnVlIG9yICh0eXBlb2YgQG9wdGlvbnMuc291cmNlTWFwIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5zb3VyY2VNYXAubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGlmIEBvcHRpb25zLnNvdXJjZU1hcCBpcyB0cnVlXG4gICAgICAgICAgICAgICAgc291cmNlTWFwRmlsZW5hbWUgPSBvdXRwdXRGaWxlLnBhdGggKyAnLm1hcCdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUob3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoYmFzZW5hbWUpLnJlcGxhY2UoJy4nLCAnJylcbiAgICAgICAgICAgICAgICBzb3VyY2VNYXBGaWxlbmFtZSA9IGJhc2VuYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiguKj8pXFwuKCcgKyBmaWxlRXh0ZW5zaW9uICsgJykkJywgJ2dpJyksIEBvcHRpb25zLnNvdXJjZU1hcClcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tc291cmNlLW1hcCBcIicgKyBzb3VyY2VNYXBGaWxlbmFtZSArICdcIicpXG5cbiAgICAgICAgIyAtLXNvdXJjZS1tYXAtZW1iZWRcbiAgICAgICAgaWYgQG9wdGlvbnMuc291cmNlTWFwRW1iZWQgaXMgdHJ1ZVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1zb3VyY2UtbWFwLWVtYmVkJylcblxuICAgICAgICAjIC0tc291cmNlLW1hcC1jb250ZW50c1xuICAgICAgICBpZiBAb3B0aW9ucy5zb3VyY2VNYXBDb250ZW50cyBpcyB0cnVlXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLXNvdXJjZS1tYXAtY29udGVudHMnKVxuXG4gICAgICAgICMgLS1pbmNsdWRlLXBhdGhcbiAgICAgICAgaWYgQG9wdGlvbnMuaW5jbHVkZVBhdGhcbiAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gQG9wdGlvbnMuaW5jbHVkZVBhdGhcbiAgICAgICAgICAgIGlmIHR5cGVvZiBpbmNsdWRlUGF0aCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50UGFyc2VyID0gbmV3IEFyZ3VtZW50UGFyc2VyKClcbiAgICAgICAgICAgICAgICBpbmNsdWRlUGF0aCA9IGFyZ3VtZW50UGFyc2VyLnBhcnNlVmFsdWUoJ1snICsgaW5jbHVkZVBhdGggKyAnXScpXG4gICAgICAgICAgICAgICAgaWYgIUFycmF5LmlzQXJyYXkoaW5jbHVkZVBhdGgpXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gW2luY2x1ZGVQYXRoXVxuXG4gICAgICAgICAgICBmb3IgaSBpbiBbMCAuLiBpbmNsdWRlUGF0aC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIGlmIG5vdCBwYXRoLmlzQWJzb2x1dGUoaW5jbHVkZVBhdGhbaV0pXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoW2ldID0gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnksIGluY2x1ZGVQYXRoW2ldKVxuXG4gICAgICAgICAgICAgICAgIyBSZW1vdmUgdHJhaWxpbmcgKGJhY2stKXNsYXNoLCBiZWNhdXNlIGVsc2UgdGhlcmUgc2VlbXMgdG8gYmUgYSBidWcgaW4gbm9kZS1zYXNzXG4gICAgICAgICAgICAgICAgIyBzbyBjb21waWxpbmcgZW5kcyBpbiBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgaWYgaW5jbHVkZVBhdGhbaV0uc3Vic3RyKC0xKSBpcyBwYXRoLnNlcFxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGF0aFtpXSA9IGluY2x1ZGVQYXRoW2ldLnN1YnN0cigwLCBpbmNsdWRlUGF0aFtpXS5sZW5ndGggLSAxKVxuXG4gICAgICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1pbmNsdWRlLXBhdGggXCInICsgaW5jbHVkZVBhdGhbaV0gKyAnXCInKVxuXG4gICAgICAgICMgLS1wcmVjaXNpb25cbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLnByZWNpc2lvbiBpcyAnbnVtYmVyJ1xuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1wcmVjaXNpb24gJyArIEBvcHRpb25zLnByZWNpc2lvbilcblxuICAgICAgICAjIC0taW1wb3J0ZXJcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLmltcG9ydGVyIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5pbXBvcnRlci5sZW5ndGggPiAwXG4gICAgICAgICAgICBpbXBvcnRlckZpbGVuYW1lID0gQG9wdGlvbnMuaW1wb3J0ZXJcbiAgICAgICAgICAgIGlmIG5vdCBwYXRoLmlzQWJzb2x1dGUoaW1wb3J0ZXJGaWxlbmFtZSlcbiAgICAgICAgICAgICAgICBpbXBvcnRlckZpbGVuYW1lID0gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnkgLCBpbXBvcnRlckZpbGVuYW1lKVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1pbXBvcnRlciBcIicgKyBwYXRoLnJlc29sdmUoaW1wb3J0ZXJGaWxlbmFtZSkgKyAnXCInKVxuXG4gICAgICAgICMgLS1mdW5jdGlvbnNcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLmZ1bmN0aW9ucyBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMuZnVuY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGZ1bmN0aW9uc0ZpbGVuYW1lID0gQG9wdGlvbnMuZnVuY3Rpb25zXG4gICAgICAgICAgICBpZiBub3QgcGF0aC5pc0Fic29sdXRlKGZ1bmN0aW9uc0ZpbGVuYW1lKVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uc0ZpbGVuYW1lID0gcGF0aC5qb2luKHdvcmtpbmdEaXJlY3RvcnkgLCBmdW5jdGlvbnNGaWxlbmFtZSlcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tZnVuY3Rpb25zIFwiJyArIHBhdGgucmVzb2x2ZShmdW5jdGlvbnNGaWxlbmFtZSkgKyAnXCInKVxuXG4gICAgICAgICMgQ1NTIHRhcmdldCBhbmQgb3V0cHV0IGZpbGVcbiAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnXCInICsgQGlucHV0RmlsZS5wYXRoICsgJ1wiJylcbiAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnXCInICsgb3V0cHV0RmlsZS5wYXRoICsgJ1wiJylcblxuICAgICAgICByZXR1cm4gZXhlY1BhcmFtZXRlcnNcblxuXG4gICAgZW1pdFN0YXJ0OiAoKSAtPlxuICAgICAgICBAZW1pdHRlci5lbWl0KCdzdGFydCcsIEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKCkpXG5cblxuICAgIGVtaXRGaW5pc2hlZDogKCkgLT5cbiAgICAgICAgQGRlbGV0ZVRlbXBvcmFyeUZpbGVzKClcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCgnZmluaXNoZWQnLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycygpKVxuXG5cbiAgICBlbWl0TWVzc2FnZTogKHR5cGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQodHlwZSwgQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoeyBtZXNzYWdlOiBtZXNzYWdlIH0pKVxuXG5cbiAgICBlbWl0TWVzc2FnZUFuZEZpbmlzaDogKHR5cGUsIG1lc3NhZ2UsIGVtaXRTdGFydEV2ZW50ID0gZmFsc2UpIC0+XG4gICAgICAgIGlmIGVtaXRTdGFydEV2ZW50XG4gICAgICAgICAgICBAZW1pdFN0YXJ0KClcbiAgICAgICAgQGVtaXRNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpXG4gICAgICAgIEBlbWl0RmluaXNoZWQoKVxuXG5cbiAgICBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzOiAoYWRkaXRpb25hbFBhcmFtZXRlcnMgPSB7fSkgLT5cbiAgICAgICAgcGFyYW1ldGVycyA9XG4gICAgICAgICAgICBpc0NvbXBpbGVUb0ZpbGU6IEBpc0NvbXBpbGVUb0ZpbGUoKSxcbiAgICAgICAgICAgIGlzQ29tcGlsZURpcmVjdDogQGlzQ29tcGlsZURpcmVjdCgpLFxuXG4gICAgICAgIGlmIEBpbnB1dEZpbGVcbiAgICAgICAgICAgIHBhcmFtZXRlcnMuaW5wdXRGaWxlbmFtZSA9IEBpbnB1dEZpbGUucGF0aFxuXG4gICAgICAgIGZvciBrZXksIHZhbHVlIG9mIGFkZGl0aW9uYWxQYXJhbWV0ZXJzXG4gICAgICAgICAgICBwYXJhbWV0ZXJzW2tleV0gPSB2YWx1ZVxuXG4gICAgICAgIHJldHVybiBwYXJhbWV0ZXJzXG5cblxuICAgIGRlbGV0ZVRlbXBvcmFyeUZpbGVzOiAtPlxuICAgICAgICBpZiBAaW5wdXRGaWxlIGFuZCBAaW5wdXRGaWxlLmlzVGVtcG9yYXJ5XG4gICAgICAgICAgICBGaWxlLmRlbGV0ZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgIGlmIEBvdXRwdXRGaWxlIGFuZCBAb3V0cHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgRmlsZS5kZWxldGUoQG91dHB1dEZpbGUucGF0aClcblxuXG4gICAgaXNDb21waWxlRGlyZWN0OiAtPlxuICAgICAgICByZXR1cm4gQG1vZGUgaXMgTm9kZVNhc3NDb21waWxlci5NT0RFX0RJUkVDVFxuXG5cbiAgICBpc0NvbXBpbGVUb0ZpbGU6IC0+XG4gICAgICAgIHJldHVybiBAbW9kZSBpcyBOb2RlU2Fzc0NvbXBpbGVyLk1PREVfRklMRVxuXG5cbiAgICBvblN0YXJ0OiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdzdGFydCcsIGNhbGxiYWNrXG5cblxuICAgIG9uU3VjY2VzczogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnc3VjY2VzcycsIGNhbGxiYWNrXG5cblxuICAgIG9uV2FybmluZzogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnd2FybmluZycsIGNhbGxiYWNrXG5cblxuICAgIG9uRXJyb3I6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ2Vycm9yJywgY2FsbGJhY2tcblxuXG4gICAgb25GaW5pc2hlZDogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnZmluaXNoZWQnLCBjYWxsYmFja1xuIl19
