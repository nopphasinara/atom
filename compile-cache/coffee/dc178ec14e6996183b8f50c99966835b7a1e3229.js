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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2NvbXBpbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsVUFBVyxPQUFBLENBQVEsV0FBUjs7RUFDWixzQkFBQSxHQUF5QixPQUFBLENBQVEsV0FBUjs7RUFFekIscUJBQUEsR0FBd0IsT0FBQSxDQUFRLG1DQUFSOztFQUN4QixJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7O0VBQ1AsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVI7O0VBRWpCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBR2hDLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFRixnQkFBQyxDQUFBLFdBQUQsR0FBZTs7SUFDZixnQkFBQyxDQUFBLFNBQUQsR0FBYTs7SUFHQSwwQkFBQyxPQUFEO01BQ1QsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxPQUFKLENBQUE7SUFGRjs7K0JBS2IsT0FBQSxHQUFTLFNBQUE7TUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGTjs7K0JBS1QsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBd0IsYUFBeEI7O1FBQU8sV0FBVzs7O1FBQU0sZ0JBQWdCOztNQUM3QyxJQUFDLENBQUEsYUFBRCxHQUFpQjtNQUNqQixJQUFDLENBQUEsVUFBRCxHQUFjO2FBQ2QsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCO0lBSEs7OytCQU9ULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVB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QUFnQixDQUFDO0lBRHBCOzsrQkFJakIsZUFBQSxHQUFpQixTQUFBO0FBQ2IsYUFBTyxJQUFDLENBQUEsSUFBRCxLQUFTLGdCQUFnQixDQUFDO0lBRHBCOzsrQkFJakIsT0FBQSxHQUFTLFNBQUMsUUFBRDthQUNMLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsUUFBckI7SUFESzs7K0JBSVQsU0FBQSxHQUFXLFNBQUMsUUFBRDthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsUUFBdkI7SUFETzs7K0JBSVgsU0FBQSxHQUFXLFNBQUMsUUFBRDthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsUUFBdkI7SUFETzs7K0JBSVgsT0FBQSxHQUFTLFNBQUMsUUFBRDthQUNMLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsUUFBckI7SUFESzs7K0JBSVQsVUFBQSxHQUFZLFNBQUMsUUFBRDthQUNSLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFVBQVosRUFBd0IsUUFBeEI7SUFEUTs7Ozs7QUE5eEJoQiIsInNvdXJjZXNDb250ZW50IjpbIntFbWl0dGVyfSA9IHJlcXVpcmUoJ2V2ZW50LWtpdCcpXG5TYXNzQXV0b2NvbXBpbGVPcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb25zJylcblxuSW5saW5lUGFyYW1ldGVyUGFyc2VyID0gcmVxdWlyZSgnLi9oZWxwZXIvaW5saW5lLXBhcmFtZXRlcnMtcGFyc2VyJylcbkZpbGUgPSByZXF1aXJlKCcuL2hlbHBlci9maWxlJylcbkFyZ3VtZW50UGFyc2VyID0gcmVxdWlyZSgnLi9oZWxwZXIvYXJndW1lbnQtcGFyc2VyJylcblxuZnMgPSByZXF1aXJlKCdmcycpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5leGVjID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBOb2RlU2Fzc0NvbXBpbGVyXG5cbiAgICBATU9ERV9ESVJFQ1QgPSAnZGlyZWN0J1xuICAgIEBNT0RFX0ZJTEUgPSAndG8tZmlsZSdcblxuXG4gICAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgICAgICBAb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cblxuICAgIGRlc3Ryb3k6ICgpIC0+XG4gICAgICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuICAgICAgICBAZW1pdHRlciA9IG51bGxcblxuXG4gICAgY29tcGlsZTogKG1vZGUsIGZpbGVuYW1lID0gbnVsbCwgY29tcGlsZU9uU2F2ZSA9IGZhbHNlKSAtPlxuICAgICAgICBAY29tcGlsZU9uU2F2ZSA9IGNvbXBpbGVPblNhdmVcbiAgICAgICAgQGNoaWxkRmlsZXMgPSB7fVxuICAgICAgICBAX2NvbXBpbGUobW9kZSwgZmlsZW5hbWUpXG5cblxuICAgICMgSWYgZmlsZW5hbWUgaXMgbnVsbCB0aGVuIGFjdGl2ZSB0ZXh0IGVkaXRvciBpcyB1c2VkIGZvciBjb21waWxhdGlvblxuICAgIF9jb21waWxlOiAobW9kZSwgZmlsZW5hbWUgPSBudWxsLCBjb21waWxlT25TYXZlID0gZmFsc2UpIC0+XG4gICAgICAgIEBtb2RlID0gbW9kZVxuICAgICAgICBAdGFyZ2V0RmlsZW5hbWUgPSBmaWxlbmFtZVxuICAgICAgICBAaW5wdXRGaWxlID0gdW5kZWZpbmVkXG4gICAgICAgIEBvdXRwdXRGaWxlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgIyBQYXJzZSBpbmxpbmUgcGFyYW1ldGVycyBhbmQgcnVuIGNvbXBpbGF0aW9uOyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIHdlIHVzZSBhY3RpdmVcbiAgICAgICAgIyB0ZXh0LWVkaXRvciBpZiBwb3NzaWJsZSwgc28gcGFyYW1ldGVyIHBhcnNlciBtdXN0IG5vdCBsb2FkIGZpbGUgYWdhaW5cbiAgICAgICAgcGFyYW1ldGVyUGFyc2VyID0gbmV3IElubGluZVBhcmFtZXRlclBhcnNlcigpXG4gICAgICAgIHBhcmFtZXRlclRhcmdldCA9IEBnZXRQYXJhbWV0ZXJUYXJnZXQoKVxuICAgICAgICBwYXJhbWV0ZXJQYXJzZXIucGFyc2UgcGFyYW1ldGVyVGFyZ2V0LCAocGFyYW1zLCBlcnJvcikgPT5cbiAgICAgICAgICAgICMgSWYgcGFja2FnZSBpcyBjYWxsZWQgYnkgc2F2ZS1ldmVudCBvZiBlZGl0b3IsIGJ1dCBjb21waWxhdGlvbiBpcyBwcm9oaWJpdGVkIGJ5XG4gICAgICAgICAgICAjIG9wdGlvbnMgb3IgZmlyc3QgbGluZSBwYXJhbWV0ZXIsIGV4ZWN1dGlvbiBpcyBjYW5jZWxsZWRcbiAgICAgICAgICAgIGlmIEBjb21waWxlT25TYXZlIGFuZCBAcHJvaGliaXRDb21waWxhdGlvbk9uU2F2ZShwYXJhbXMpXG4gICAgICAgICAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlcmUgaXMgYSBmaXJzdCBsaW5lIHBhcmFtdGVyXG4gICAgICAgICAgICBpZiBwYXJhbXMgaXMgZmFsc2UgYW5kIEBvcHRpb25zLmNvbXBpbGVPbmx5Rmlyc3RMaW5lQ29tbWVudEZpbGVzXG4gICAgICAgICAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICMgQSBwb3RlbmlhbCBwYXJzaW5nIGVycm9yIGlzIG9ubHkgaGFuZGxlZCBpZiBjb21waWxhdGlvbiBpcyBleGVjdXRlZCBhbmQgdGhhdCdzIHRoZVxuICAgICAgICAgICAgIyBjYXNlIGlmIGNvbXBpbGVyIGlzIGV4ZWN1dGVkIGJ5IGNvbW1hbmQgb3IgYWZ0ZXIgY29tcGlsZSBvbiBzYXZlLCBzbyB0aGlzIGNvZGUgbXVzdFxuICAgICAgICAgICAgIyBiZSBwbGFjZWQgYWJvdmUgdGhlIGNvZGUgYmVmb3JlXG4gICAgICAgICAgICBpZiBlcnJvclxuICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnZXJyb3InLCBlcnJvciwgdHJ1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgQHNldHVwSW5wdXRGaWxlKGZpbGVuYW1lKVxuICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSA9IEB2YWxpZGF0ZUlucHV0RmlsZSgpKSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnZXJyb3InLCBlcnJvck1lc3NhZ2UsIHRydWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICMgSWYgdGhlcmUgaXMgTk8gZmlyc3QtbGluZS1jb21tZW50LCBzbyBubyBtYWluIGZpbGUgaXMgcmVmZXJlbmNlZCwgd2Ugc2hvdWxkIGNoZWNrXG4gICAgICAgICAgICAjIGlzIHVzZXIgd2FudHMgdG8gY29tcGlsZSBQYXJ0aWFsc1xuICAgICAgICAgICAgaWYgcGFyYW1zIGlzIGZhbHNlIGFuZCBAaXNQYXJ0aWFsKCkgYW5kIG5vdCBAb3B0aW9ucy5jb21waWxlUGFydGlhbHNcbiAgICAgICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBJbiBjYXNlIHRoZXJlIGlzIGEgXCJtYWluXCIgaW5saW5lIHBhcmFtdGVyLCBwYXJhbXMgaXMgYSBzdHJpbmcgYW5kIGNvbnRhaW5zIHRoZVxuICAgICAgICAgICAgIyB0YXJnZXQgZmlsZW5hbWUuXG4gICAgICAgICAgICAjIEl0J3MgaW1wb3J0YW50IHRvIGNoZWNrIHRoYXQgaW5wdXRGaWxlLnBhdGggaXMgbm90IHBhcmFtcyBiZWNhdXNlIG9mIGluZmluaXRlIGxvb3BcbiAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbXMubWFpbiBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGlmIHBhcmFtcy5tYWluIGlzIEBpbnB1dEZpbGUucGF0aCBvciBAY2hpbGRGaWxlc1twYXJhbXMubWFpbl0gaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCdlcnJvcicsICdGb2xsb3dpbmcgdGhlIG1haW4gcGFyYW1ldGVyIGVuZHMgaW4gYSBsb29wLicpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBAaW5wdXRGaWxlLmlzVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnZXJyb3InLCAnXFwnbWFpblxcJyBpbmxpbmUgcGFyYW1ldGVyIGlzIG5vdCBzdXBwb3J0ZWQgaW4gZGlyZWN0IGNvbXBpbGF0aW9uLicpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAY2hpbGRGaWxlc1twYXJhbXMubWFpbl0gPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIEBfY29tcGlsZShAbW9kZSwgcGFyYW1zLm1haW4pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGVtaXRTdGFydCgpXG5cbiAgICAgICAgICAgICAgICBpZiBAaXNDb21waWxlVG9GaWxlKCkgYW5kIG5vdCBAZW5zdXJlRmlsZUlzU2F2ZWQoKVxuICAgICAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ3dhcm5pbmcnLCAnQ29tcGlsYXRpb24gY2FuY2VsbGVkJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBAdXBkYXRlT3B0aW9uc1dpdGhJbmxpbmVQYXJhbWV0ZXJzKHBhcmFtcylcbiAgICAgICAgICAgICAgICBAb3V0cHV0U3R5bGVzID0gQGdldE91dHB1dFN0eWxlc1RvQ29tcGlsZVRvKClcblxuICAgICAgICAgICAgICAgIGlmIEBvdXRwdXRTdHlsZXMubGVuZ3RoIGlzIDBcbiAgICAgICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCd3YXJuaW5nJywgJ05vIG91dHB1dCBzdHlsZSBkZWZpbmVkISBQbGVhc2UgZW5hYmxlIGF0IGxlYXN0IG9uZSBzdHlsZSBpbiBvcHRpb25zIG9yIHVzZSBpbmxpbmUgcGFyYW1ldGVycy4nKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIEBkb0NvbXBpbGUoKVxuXG5cbiAgICBnZXRQYXJhbWV0ZXJUYXJnZXQ6ICgpIC0+XG4gICAgICAgIGlmIHR5cGVvZiBAdGFyZ2V0RmlsZW5hbWUgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIHJldHVybiBAdGFyZ2V0RmlsZW5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG5cbiAgICBwcm9oaWJpdENvbXBpbGF0aW9uT25TYXZlOiAocGFyYW1zKSAtPlxuICAgICAgICBpZiBwYXJhbXMgYW5kIHBhcmFtcy5jb21waWxlT25TYXZlIGluIFt0cnVlLCBmYWxzZV1cbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVPblNhdmUgPSBwYXJhbXMuY29tcGlsZU9uU2F2ZVxuICAgICAgICByZXR1cm4gbm90IEBvcHRpb25zLmNvbXBpbGVPblNhdmVcblxuXG4gICAgaXNQYXJ0aWFsOiAoKSAtPlxuICAgICAgICBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICByZXR1cm4gKGZpbGVuYW1lWzBdID09ICdfJylcblxuXG4gICAgc2V0dXBJbnB1dEZpbGU6IChmaWxlbmFtZSA9IG51bGwpIC0+XG4gICAgICAgIEBpbnB1dEZpbGUgPVxuICAgICAgICAgICAgaXNUZW1wb3Jhcnk6IGZhbHNlXG5cbiAgICAgICAgaWYgZmlsZW5hbWVcbiAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IGZpbGVuYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBhY3RpdmVFZGl0b3JcblxuICAgICAgICAgICAgaWYgQGlzQ29tcGlsZURpcmVjdCgpXG4gICAgICAgICAgICAgICAgc3ludGF4ID0gQGFza0ZvcklucHV0U3ludGF4KClcbiAgICAgICAgICAgICAgICBpZiBzeW50YXhcbiAgICAgICAgICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gRmlsZS5nZXRUZW1wb3JhcnlGaWxlbmFtZSgnc2Fzcy1hdXRvY29tcGlsZS5pbnB1dC4nLCBudWxsLCBzeW50YXgpXG4gICAgICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUuaXNUZW1wb3JhcnkgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoQGlucHV0RmlsZS5wYXRoLCBhY3RpdmVFZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gYWN0aXZlRWRpdG9yLmdldFVSSSgpXG4gICAgICAgICAgICAgICAgaWYgbm90IEBpbnB1dEZpbGUucGF0aFxuICAgICAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBAYXNrRm9yU2F2aW5nVW5zYXZlZEZpbGVJbkFjdGl2ZUVkaXRvcigpXG5cblxuICAgIGFza0ZvcklucHV0U3ludGF4OiAoKSAtPlxuICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiSXMgdGhlIHN5bnRheCBvZiB5b3VyIGlucHV0IFNBU1Mgb3IgU0NTUz9cIlxuICAgICAgICAgICAgYnV0dG9uczogWydTQVNTJywgJ1NDU1MnLCAnQ2FuY2VsJ11cbiAgICAgICAgc3dpdGNoIGRpYWxvZ1Jlc3VsdEJ1dHRvblxuICAgICAgICAgICAgd2hlbiAwIHRoZW4gc3ludGF4ID0gJ3Nhc3MnXG4gICAgICAgICAgICB3aGVuIDEgdGhlbiBzeW50YXggPSAnc2NzcydcbiAgICAgICAgICAgIGVsc2Ugc3ludGF4ID0gdW5kZWZpbmVkXG4gICAgICAgIHJldHVybiBzeW50YXhcblxuXG4gICAgYXNrRm9yU2F2aW5nVW5zYXZlZEZpbGVJbkFjdGl2ZUVkaXRvcjogKCkgLT5cbiAgICAgICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCJJbiBvcmRlciB0byBjb21waWxlIHRoaXMgU0FTUyBmaWxlIHRvIGEgQ1NTIGZpbGUsIHlvdSBoYXZlIGRvIHNhdmUgaXQgYmVmb3JlLiBEbyB5b3Ugd2FudCB0byBzYXZlIHRoaXMgZmlsZT9cIlxuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkFsdGVybmF0aXZseSB5b3UgY2FuIHVzZSAnRGlyZWN0IENvbXBpbGF0aW9uJyBmb3IgY29tcGlsaW5nIHdpdGhvdXQgY3JlYXRpbmcgYSBDU1MgZmlsZS5cIlxuICAgICAgICAgICAgYnV0dG9uczogW1wiU2F2ZVwiLCBcIkNhbmNlbFwiXVxuICAgICAgICBpZiBkaWFsb2dSZXN1bHRCdXR0b24gaXMgMFxuICAgICAgICAgICAgZmlsZW5hbWUgPSBhdG9tLnNob3dTYXZlRGlhbG9nU3luYygpXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBhY3RpdmVFZGl0b3Iuc2F2ZUFzKGZpbGVuYW1lKVxuICAgICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgICAgICAjIGRvIG5vdGhpbmcgaWYgc29tZXRoaW5nIGZhaWxzIGJlY2F1c2UgZ2V0VVJJKCkgd2lsbCByZXR1cm4gdW5kZWZpbmVkLCBpZlxuICAgICAgICAgICAgICAgICMgZmlsZSBpcyBub3Qgc2F2ZWRcblxuICAgICAgICAgICAgZmlsZW5hbWUgPSBhY3RpdmVFZGl0b3IuZ2V0VVJJKClcbiAgICAgICAgICAgIHJldHVybiBmaWxlbmFtZVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuXG4gICAgdmFsaWRhdGVJbnB1dEZpbGU6ICgpIC0+XG4gICAgICAgIGVycm9yTWVzc2FnZSA9IHVuZGVmaW5lZFxuXG4gICAgICAgICMgSWYgbm8gaW5wdXRGaWxlLnBhdGggaXMgZ2l2ZW4sIHRoZW4gd2UgY2Fubm90IGNvbXBpbGUgdGhlIGZpbGUgb3IgY29udGVudCxcbiAgICAgICAgIyBiZWNhdXNlIHNvbWV0aGluZyBpcyB3cm9uZ1xuICAgICAgICBpZiBub3QgQGlucHV0RmlsZS5wYXRoXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnSW52YWxpZCBmaWxlOiAnICsgQGlucHV0RmlsZS5wYXRoXG5cbiAgICAgICAgaWYgbm90IGZzLmV4aXN0c1N5bmMoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZpbGUgZG9lcyBub3QgZXhpc3Q6ICcgKyBAaW5wdXRGaWxlLnBhdGhcblxuICAgICAgICByZXR1cm4gZXJyb3JNZXNzYWdlXG5cblxuICAgIGVuc3VyZUZpbGVJc1NhdmVkOiAoKSAtPlxuICAgICAgICBlZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgICBmb3IgZWRpdG9yIGluIGVkaXRvcnNcbiAgICAgICAgICAgIGlmIGVkaXRvciBhbmQgZWRpdG9yLmdldFVSSSBhbmQgZWRpdG9yLmdldFVSSSgpIGlzIEBpbnB1dEZpbGUucGF0aCBhbmQgZWRpdG9yLmlzTW9kaWZpZWQoKVxuICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiJyN7ZmlsZW5hbWV9JyBoYXMgY2hhbmdlcywgZG8geW91IHdhbnQgdG8gc2F2ZSB0aGVtP1wiXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJJbiBvcmRlciB0byBjb21waWxlIFNBU1MgeW91IGhhdmUgdG8gc2F2ZSBjaGFuZ2VzLlwiXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIlNhdmUgYW5kIGNvbXBpbGVcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgICAgICAgICBpZiBkaWFsb2dSZXN1bHRCdXR0b24gaXMgMFxuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG5cbiAgICAjIEF2YWlsYWJsZSBwYXJhbWV0ZXJzXG4gICAgIyAgIG91dFxuICAgICMgICBvdXRwdXRTdHlsZVxuICAgICNcbiAgICAjICAgY29tcGlsZUNvbXByZXNzZWRcbiAgICAjICAgY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVyblxuICAgICMgICBjb21waWxlQ29tcGFjdFxuICAgICMgICBjb21wYWN0RmlsZW5hbWVQYXR0ZXJuXG4gICAgIyAgIGNvbXBpbGVOZXN0ZWRcbiAgICAjICAgbmVzdGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgIyAgIGNvbXBpbGVFeHBhbmRlZFxuICAgICMgICBleHBhbmRlZEZpbGVuYW1lUGF0dGVyblxuICAgICNcbiAgICAjICAgaW5kZW50VHlwZVxuICAgICMgICBpbmRlbnRXaWR0aFxuICAgICMgICBsaW5lZmVlZFxuICAgICMgICBzb3VyY2VNYXBcbiAgICAjICAgc291cmNlTWFwRW1iZWRcbiAgICAjICAgc291cmNlTWFwQ29udGVudHNcbiAgICAjICAgc291cmNlQ29tbWVudHNcbiAgICAjICAgaW5jbHVkZVBhdGhcbiAgICAjICAgcHJlY2lzaW9uXG4gICAgIyAgIGltcG9ydGVyXG4gICAgIyAgIGZ1bmN0aW9uc1xuICAgIHVwZGF0ZU9wdGlvbnNXaXRoSW5saW5lUGFyYW1ldGVyczogKHBhcmFtcykgLT5cbiAgICAgICAgIyBCQUNLV0FSRCBDT01QQVRJQklMSVRZOiBwYXJhbXMub3V0IGFuZCBwYXJhbS5vdXRwdXRTdHlsZVxuICAgICAgICAjIFNob3VsZCB3ZSBsZXQgdGhpcyBjb2RlIGhlcmUsIHNvIHdlIGNhbiBkZWNpZGUgdG8gb3V0cHV0IG9ubHkgb25lIHNpbmdsZSBmaWxlIHdpdGggb25lIG91dHB1dCBzdHlsZSBwZXIgU0FTUyBmaWxlP1xuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLm91dCBpcyAnc3RyaW5nJyBvciB0eXBlb2YgcGFyYW1zLm91dHB1dFN0eWxlIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBwYXJhbXMuY29tcHJlc3MgaXMgJ2Jvb2xlYW4nXG5cbiAgICAgICAgICAgIGlmIEBvcHRpb25zLnNob3dPbGRQYXJhbWV0ZXJzV2FybmluZ1xuICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZSgnd2FybmluZycsICdQbGVhc2UgZG9uXFwndCB1c2UgXFwnb3V0XFwnLCBcXCdvdXRwdXRTdHlsZVxcJyBvciBcXCdjb21wcmVzc1xcJyBwYXJhbWV0ZXIgYW55IG1vcmUuIEhhdmUgYSBsb29rIGF0IHRoZSBkb2N1bWVudGF0aW9uIGZvciBuZXdlciBwYXJhbWV0ZXJzJylcblxuICAgICAgICAgICAgIyBTZXQgZGVmYXVsdCBvdXRwdXQgc3R5bGVcbiAgICAgICAgICAgIG91dHB1dFN0eWxlID0gJ2NvbXByZXNzZWQnXG5cbiAgICAgICAgICAgICMgSWYgXCJjb21wcmVzc1wiIGlzIHNldCwgYXBwbHkgdGhpcyB2YWx1ZVxuICAgICAgICAgICAgaWYgcGFyYW1zLmNvbXByZXNzIGlzIGZhbHNlXG4gICAgICAgICAgICAgICAgb3V0cHV0U3R5bGUgPSAnbmVzdGVkJ1xuICAgICAgICAgICAgaWYgcGFyYW1zLmNvbXByZXNzIGlzIHRydWVcbiAgICAgICAgICAgICAgICBvdXRwdXRTdHlsZSA9ICdjb21wcmVzc2VkJ1xuXG4gICAgICAgICAgICBpZiBwYXJhbXMub3V0cHV0U3R5bGVcbiAgICAgICAgICAgICAgICBvdXRwdXRTdHlsZSA9IGlmIHR5cGVvZiBwYXJhbXMub3V0cHV0U3R5bGUgaXMgJ3N0cmluZycgdGhlbiBwYXJhbXMub3V0cHV0U3R5bGUudG9Mb3dlckNhc2UoKSBlbHNlICdjb21wcmVzc2VkJ1xuXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcHJlc3NlZCA9IChvdXRwdXRTdHlsZSBpcyAnY29tcHJlc3NlZCcpXG4gICAgICAgICAgICBpZiBvdXRwdXRTdHlsZSBpcyAnY29tcHJlc3NlZCcgYW5kIHR5cGVvZiBwYXJhbXMub3V0IGlzICdzdHJpbmcnIGFuZCBwYXJhbXMub3V0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBAb3B0aW9ucy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLm91dFxuXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcGFjdCA9IChvdXRwdXRTdHlsZSBpcyAnY29tcGFjdCcpXG4gICAgICAgICAgICBpZiBvdXRwdXRTdHlsZSBpcyAnY29tcGFjdCcgYW5kIHR5cGVvZiBwYXJhbXMub3V0IGlzICdzdHJpbmcnIGFuZCBwYXJhbXMub3V0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBAb3B0aW9ucy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLm91dFxuXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlTmVzdGVkID0gKG91dHB1dFN0eWxlIGlzICduZXN0ZWQnKVxuICAgICAgICAgICAgaWYgb3V0cHV0U3R5bGUgaXMgJ25lc3RlZCcgYW5kIHR5cGVvZiBwYXJhbXMub3V0IGlzICdzdHJpbmcnIGFuZCBwYXJhbXMub3V0Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBAb3B0aW9ucy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMub3V0XG5cbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVFeHBhbmRlZCA9IChvdXRwdXRTdHlsZSBpcyAnZXhwYW5kZWQnKVxuICAgICAgICAgICAgaWYgb3V0cHV0U3R5bGUgaXMgJ2V4cGFuZGVkJyBhbmQgdHlwZW9mIHBhcmFtcy5vdXQgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5vdXQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIEBvcHRpb25zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLm91dFxuXG5cbiAgICAgICAgIyBJZiB1c2VyIHNwZWNpZmllcyBhIHNpbmdsZSBvciBtdWx0aXBsZSBvdXRwdXQgc3R5bGVzLCB3ZSByZXNldCB0aGUgZGVmYXVsdCBzZXR0aW5nc1xuICAgICAgICAjIHNvIG9ubHkgdGhlIGdpdmVuIG91dHB1dCBzdHlsZXMgYXJlIGNvbXBpbGVkIHRvXG4gICAgICAgIGlmIHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZCBvciBwYXJhbXMuY29tcGlsZUNvbXBhY3Qgb3IgcGFyYW1zLmNvbXBpbGVOZXN0ZWQgb3IgcGFyYW1zLmNvbXBpbGVFeHBhbmRlZFxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXBhY3QgPSBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZU5lc3RlZCA9IGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlRXhwYW5kZWQgPSBmYWxzZVxuXG4gICAgICAgICMgY29tcGlsZUNvbXByZXNzZWRcbiAgICAgICAgaWYgcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkIGlzIHRydWUgb3IgcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcHJlc3NlZCA9IHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZFxuICAgICAgICBlbHNlIGlmIHR5cGVvZiBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWQgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZFxuXG4gICAgICAgICMgY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm4gaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVyblxuXG4gICAgICAgICMgY29tcGlsZUNvbXBhY3RcbiAgICAgICAgaWYgcGFyYW1zLmNvbXBpbGVDb21wYWN0IGlzIHRydWUgb3IgcGFyYW1zLmNvbXBpbGVDb21wYWN0IGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcGFjdCA9IHBhcmFtcy5jb21waWxlQ29tcGFjdFxuICAgICAgICBlbHNlIGlmIHR5cGVvZiBwYXJhbXMuY29tcGlsZUNvbXBhY3QgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wYWN0ID0gdHJ1ZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGFjdEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21waWxlQ29tcGFjdFxuXG4gICAgICAgICMgY29tcGFjdEZpbGVuYW1lUGF0dGVyblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm4gaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcGFjdEZpbGVuYW1lUGF0dGVyblxuXG4gICAgICAgICMgY29tcGlsZU5lc3RlZFxuICAgICAgICBpZiBwYXJhbXMuY29tcGlsZU5lc3RlZCBpcyB0cnVlIG9yIHBhcmFtcy5jb21waWxlTmVzdGVkIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlTmVzdGVkID0gcGFyYW1zLmNvbXBpbGVOZXN0ZWRcbiAgICAgICAgZWxzZSBpZiB0eXBlb2YgcGFyYW1zLmNvbXBpbGVOZXN0ZWQgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVOZXN0ZWQgPSB0cnVlXG4gICAgICAgICAgICBAb3B0aW9ucy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuY29tcGlsZU5lc3RlZFxuXG4gICAgICAgICMgbmVzdGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLm5lc3RlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm5cblxuICAgICAgICAjIGNvbXBpbGVFeHBhbmRlZFxuICAgICAgICBpZiBwYXJhbXMuY29tcGlsZUV4cGFuZGVkIGlzIHRydWUgb3IgcGFyYW1zLmNvbXBpbGVFeHBhbmRlZCBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUV4cGFuZGVkID0gcGFyYW1zLmNvbXBpbGVFeHBhbmRlZFxuICAgICAgICBlbHNlIGlmIHR5cGVvZiBwYXJhbXMuY29tcGlsZUV4cGFuZGVkIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlRXhwYW5kZWQgPSB0cnVlXG4gICAgICAgICAgICBAb3B0aW9ucy5leHBhbmRlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21waWxlRXhwYW5kZWRcblxuICAgICAgICAjIGV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm4gaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5leHBhbmRlZEZpbGVuYW1lUGF0dGVybi5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5leHBhbmRlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5leHBhbmRlZEZpbGVuYW1lUGF0dGVyblxuXG4gICAgICAgICMgaW5kZW50VHlwZVxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmluZGVudFR5cGUgaXMgJ3N0cmluZycgIGFuZCBwYXJhbXMuaW5kZW50VHlwZS50b0xvd2VyQ2FzZSgpIGluIFsnc3BhY2UnLCAndGFiJ11cbiAgICAgICAgICAgIEBvcHRpb25zLmluZGVudFR5cGUgPSBwYXJhbXMuaW5kZW50VHlwZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgIyBpbmRlbnRXaWR0aFxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmluZGVudFdpZHRoIGlzICdudW1iZXInIGFuZCBwYXJhbXMuaW5kZW50V2lkdGggPD0gMTAgYW5kIGluZGVudFdpZHRoID49IDBcbiAgICAgICAgICAgIEBvcHRpb25zLmluZGVudFdpZHRoID0gcGFyYW1zLmluZGVudFdpZHRoXG5cbiAgICAgICAgIyBsaW5lZmVlZFxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmxpbmVmZWVkIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMubGluZWZlZWQudG9Mb3dlckNhc2UoKSBpbiBbJ2NyJywgJ2NybGYnLCAnbGYnLCAnbGZjciddXG4gICAgICAgICAgICBAb3B0aW9ucy5saW5lZmVlZCA9IHBhcmFtcy5saW5lZmVlZC50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgIyBzb3VyY2VNYXBcbiAgICAgICAgaWYgcGFyYW1zLnNvdXJjZU1hcCBpcyB0cnVlIG9yIHBhcmFtcy5zb3VyY2VNYXAgaXMgZmFsc2Ugb3IgKHR5cGVvZiBwYXJhbXMuc291cmNlTWFwIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuc291cmNlTWFwLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICBAb3B0aW9ucy5zb3VyY2VNYXAgPSBwYXJhbXMuc291cmNlTWFwXG5cbiAgICAgICAgIyBzb3VyY2VNYXBFbWJlZFxuICAgICAgICBpZiBwYXJhbXMuc291cmNlTWFwRW1iZWQgaXMgdHJ1ZSBvciBwYXJhbXMuc291cmNlTWFwRW1iZWQgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLnNvdXJjZU1hcEVtYmVkID0gcGFyYW1zLnNvdXJjZU1hcEVtYmVkXG5cbiAgICAgICAgIyBzb3VyY2VNYXBDb250ZW50c1xuICAgICAgICBpZiBwYXJhbXMuc291cmNlTWFwQ29udGVudHMgaXMgdHJ1ZSBvciBwYXJhbXMuc291cmNlTWFwQ29udGVudHMgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLnNvdXJjZU1hcENvbnRlbnRzID0gcGFyYW1zLnNvdXJjZU1hcENvbnRlbnRzXG5cbiAgICAgICAgIyBzb3VyY2VDb21tZW50c1xuICAgICAgICBpZiBwYXJhbXMuc291cmNlQ29tbWVudHMgaXMgdHJ1ZSBvciBwYXJhbXMuc291cmNlQ29tbWVudHMgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLnNvdXJjZUNvbW1lbnRzID0gcGFyYW1zLnNvdXJjZUNvbW1lbnRzXG5cbiAgICAgICAgIyBpbmNsdWRlUGF0aFxuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5pbmNsdWRlUGF0aCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmluY2x1ZGVQYXRoLmxlbmd0aCA+IDEpIG9yIEFycmF5LmlzQXJyYXkocGFyYW1zLmluY2x1ZGVQYXRoKVxuICAgICAgICAgICAgQG9wdGlvbnMuaW5jbHVkZVBhdGggPSBwYXJhbXMuaW5jbHVkZVBhdGhcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtcy5pbmNsdWRlUGF0aHMgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5pbmNsdWRlUGF0aHMubGVuZ3RoID4gMSkgb3IgQXJyYXkuaXNBcnJheShwYXJhbXMuaW5jbHVkZVBhdGhzKVxuICAgICAgICAgICAgQG9wdGlvbnMuaW5jbHVkZVBhdGggPSBwYXJhbXMuaW5jbHVkZVBhdGhzXG5cbiAgICAgICAgIyBwcmVjaXNpb25cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5wcmVjaXNpb24gaXMgJ251bWJlcicgYW5kIHBhcmFtcy5wcmVjaXNpb24gPj0gMFxuICAgICAgICAgICAgQG9wdGlvbnMucHJlY2lzaW9uID0gcGFyYW1zLnByZWNpc2lvblxuXG4gICAgICAgICMgaW1wb3J0ZXJcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5pbXBvcnRlciBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmltcG9ydGVyLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLmltcG9ydGVyID0gcGFyYW1zLmltcG9ydGVyXG5cbiAgICAgICAgIyBmdW5jdGlvbnNcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5mdW5jdGlvbnMgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5mdW5jdGlvbnMubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMuZnVuY3Rpb25zID0gcGFyYW1zLmZ1bmN0aW9uc1xuXG5cbiAgICBnZXRPdXRwdXRTdHlsZXNUb0NvbXBpbGVUbzogKCkgLT5cbiAgICAgICAgb3V0cHV0U3R5bGVzID0gW11cbiAgICAgICAgaWYgQG9wdGlvbnMuY29tcGlsZUNvbXByZXNzZWRcbiAgICAgICAgICAgIG91dHB1dFN0eWxlcy5wdXNoKCdjb21wcmVzc2VkJylcbiAgICAgICAgaWYgQG9wdGlvbnMuY29tcGlsZUNvbXBhY3RcbiAgICAgICAgICAgIG91dHB1dFN0eWxlcy5wdXNoKCdjb21wYWN0JylcbiAgICAgICAgaWYgQG9wdGlvbnMuY29tcGlsZU5lc3RlZFxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzLnB1c2goJ25lc3RlZCcpXG4gICAgICAgIGlmIEBvcHRpb25zLmNvbXBpbGVFeHBhbmRlZFxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzLnB1c2goJ2V4cGFuZGVkJylcblxuICAgICAgICAjIFdoZW4gaXQncyBkaXJlY3QgY29tcGlsYXRpb24gdXNlIGhhcyB0byBzZWxlY3QgYSBzaW5nbGUgb3V0cHV0IHN0eWxlIGlmIHRoZXJlIGlzIG1vcmVcbiAgICAgICAgIyB0aGFuIG9uZSBvdXRwdXQgc3R5bGUgYXZhaWxhYmxlXG4gICAgICAgIGlmIEBpc0NvbXBpbGVEaXJlY3QoKSBhbmQgb3V0cHV0U3R5bGVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIG91dHB1dFN0eWxlcy5wdXNoKCdDYW5jZWwnKVxuICAgICAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJGb3IgZGlyZWN0aW9uIGNvbXBpbGF0aW9uIHlvdSBoYXZlIHRvIHNlbGVjdCBhIHNpbmdsZSBvdXRwdXQgc3R5bGUuIFdoaWNoIG9uZSBkbyB5b3Ugd2FudCB0byB1c2U/XCJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBvdXRwdXRTdHlsZXNcbiAgICAgICAgICAgIGlmIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA8IG91dHB1dFN0eWxlcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgIyBSZXR1cm4gb25seSB0aGUgc2VsZWN0ZWQgb3V0cHV0IHN0eWxlIGFzIGFycmF5XG4gICAgICAgICAgICAgICAgb3V0cHV0U3R5bGVzID0gWyBvdXRwdXRTdHlsZXNbZGlhbG9nUmVzdWx0QnV0dG9uXSBdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgIyBSZXR1cm5pbmcgYW4gZW1wdHkgYXJyYXkgbWVhbnMgbm8gY29tcGlsYXRpb24gaXMgc3RhcnRlZFxuICAgICAgICAgICAgICAgIG91dHB1dFN0eWxlcyA9IFtdXG5cbiAgICAgICAgcmV0dXJuIG91dHB1dFN0eWxlc1xuXG5cbiAgICBnZXRPdXRwdXRGaWxlOiAob3V0cHV0U3R5bGUpIC0+XG4gICAgICAgIG91dHB1dEZpbGUgPVxuICAgICAgICAgICAgc3R5bGU6IG91dHB1dFN0eWxlXG4gICAgICAgICAgICBpc1RlbXBvcmFyeTogZmFsc2VcblxuICAgICAgICBpZiBAaXNDb21waWxlRGlyZWN0KClcbiAgICAgICAgICAgIG91dHB1dEZpbGUucGF0aCA9IEZpbGUuZ2V0VGVtcG9yYXJ5RmlsZW5hbWUoJ3Nhc3MtYXV0b2NvbXBpbGUub3V0cHV0LicsIG51bGwsICdjc3MnKVxuICAgICAgICAgICAgb3V0cHV0RmlsZS5pc1RlbXBvcmFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3dpdGNoIG91dHB1dEZpbGUuc3R5bGVcbiAgICAgICAgICAgICAgICB3aGVuICdjb21wcmVzc2VkJyB0aGVuIHBhdHRlcm4gPSBAb3B0aW9ucy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgICAgICAgICAgd2hlbiAnY29tcGFjdCcgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMuY29tcGFjdEZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIHdoZW4gJ25lc3RlZCcgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgICAgICAgICAgd2hlbiAnZXhwYW5kZWQnIHRoZW4gcGF0dGVybiA9IEBvcHRpb25zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3V0cHV0IHN0eWxlLicpXG5cbiAgICAgICAgICAgIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAjIHdlIG5lZWQgdGhlIGZpbGUgZXh0ZW5zaW9uIHdpdGhvdXQgdGhlIGRvdCFcbiAgICAgICAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoYmFzZW5hbWUpLnJlcGxhY2UoJy4nLCAnJylcblxuICAgICAgICAgICAgZmlsZW5hbWUgPSBiYXNlbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14oLio/KVxcLignICsgZmlsZUV4dGVuc2lvbiArICcpJCcsICdnaScpLCBwYXR0ZXJuKVxuXG4gICAgICAgICAgICBpZiBub3QgcGF0aC5pc0Fic29sdXRlKHBhdGguZGlybmFtZShmaWxlbmFtZSkpXG4gICAgICAgICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguZGlybmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmpvaW4ob3V0cHV0UGF0aCwgZmlsZW5hbWUpXG5cbiAgICAgICAgICAgIG91dHB1dEZpbGUucGF0aCA9IGZpbGVuYW1lXG5cbiAgICAgICAgcmV0dXJuIG91dHB1dEZpbGVcblxuXG4gICAgY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0czogKG91dHB1dEZpbGUpIC0+XG4gICAgICAgIGlmIEBvcHRpb25zLmNoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHNcbiAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMob3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBvdXRwdXQgZmlsZSBhbHJlYWR5IGV4aXN0cy4gRG8geW91IHdhbnQgdG8gb3ZlcndyaXRlIGl0P1wiXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJPdXRwdXQgZmlsZTogJyN7b3V0cHV0RmlsZS5wYXRofSdcIlxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPdmVyd3JpdGVcIiwgXCJTa2lwXCIsIFwiQ2FuY2VsXCJdXG4gICAgICAgICAgICAgICAgc3dpdGNoIGRpYWxvZ1Jlc3VsdEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB3aGVuIDAgdGhlbiByZXR1cm4gJ292ZXJ3cml0ZSdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxIHRoZW4gcmV0dXJuICdza2lwJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIDIgdGhlbiByZXR1cm4gJ2NhbmNlbCdcbiAgICAgICAgcmV0dXJuICdvdmVyd3JpdGUnXG5cblxuICAgIGVuc3VyZU91dHB1dERpcmVjdG9yeUV4aXN0czogKG91dHB1dEZpbGUpIC0+XG4gICAgICAgIGlmIEBpc0NvbXBpbGVUb0ZpbGUoKVxuICAgICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguZGlybmFtZShvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICBGaWxlLmVuc3VyZURpcmVjdG9yeUV4aXN0cyhvdXRwdXRQYXRoKVxuXG5cbiAgICB0cnlUb0ZpbmROb2RlU2Fzc0luc3RhbGxhdGlvbjogKGNhbGxiYWNrKSAtPlxuICAgICAgICAjIENvbW1hbmQgd2hpY2ggY2hlY2tzIGlmIG5vZGUtc2FzcyBpcyBhY2Nlc3NhYmxlIHdpdGhvdXQgYWJzb2x1dGUgcGF0aFxuICAgICAgICAjIFRoaXMgY29tbWFuZCB3b3JrcyBvbiBXaW5kb3dzLCBMaW51eCBhbmQgTWFjIE9TXG4gICAgICAgIGRldk51bGwgPSBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgdGhlbiAnbnVsJyBlbHNlICcvZGV2L251bGwnXG4gICAgICAgIGV4aXN0YW5jZUNoZWNrQ29tbWFuZCA9IFwibm9kZS1zYXNzIC0tdmVyc2lvbiA+I3tkZXZOdWxsfSAyPiYxICYmIChlY2hvIGZvdW5kKSB8fCAoZWNobyBmYWlsKVwiXG5cbiAgICAgICAgcG9zc2libGVOb2RlU2Fzc1BhdGhzID0gWycnXVxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMubm9kZVNhc3NQYXRoIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5ub2RlU2Fzc1BhdGgubGVuZ3RoID4gMVxuICAgICAgICAgICAgcG9zc2libGVOb2RlU2Fzc1BhdGhzLnB1c2goQG9wdGlvbnMubm9kZVNhc3NQYXRoKVxuICAgICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMidcbiAgICAgICAgICAgIHBvc3NpYmxlTm9kZVNhc3NQYXRocy5wdXNoKCBwYXRoLmpvaW4ocHJvY2Vzcy5lbnZbIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJyB0aGVuICdVU0VSUFJPRklMRScgZWxzZSAnSE9NRScgXSwgJ0FwcERhdGFcXFxcUm9hbWluZ1xcXFxucG0nKSApXG4gICAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ2xpbnV4J1xuICAgICAgICAgICAgcG9zc2libGVOb2RlU2Fzc1BhdGhzLnB1c2goJy91c3IvbG9jYWwvYmluJylcbiAgICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJ1xuICAgICAgICAgICAgcG9zc2libGVOb2RlU2Fzc1BhdGhzLnB1c2goJy91c3IvbG9jYWwvYmluJylcblxuXG4gICAgICAgIGNoZWNrTm9kZVNhc3NFeGlzdHMgPSAoZm91bmRJblBhdGgpID0+XG4gICAgICAgICAgICBpZiB0eXBlb2YgZm91bmRJblBhdGggaXMgJ3N0cmluZydcbiAgICAgICAgICAgICAgICBpZiBmb3VuZEluUGF0aCBpcyBAb3B0aW9ucy5ub2RlU2Fzc1BhdGhcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBAYXNrQW5kRml4Tm9kZVNhc3NQYXRoKGZvdW5kSW5QYXRoKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlLCB0cnVlKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGZhbHNlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBwb3NzaWJsZU5vZGVTYXNzUGF0aHMubGVuZ3RoIGlzIDBcbiAgICAgICAgICAgICAgICAjIE5PVCBmb3VuZCBhbmQgTk9UIGZpeGVkXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGZhbHNlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBzZWFyY2hQYXRoID0gcG9zc2libGVOb2RlU2Fzc1BhdGhzLnNoaWZ0KClcbiAgICAgICAgICAgIGNvbW1hbmQgPSBwYXRoLmpvaW4oc2VhcmNoUGF0aCwgZXhpc3RhbmNlQ2hlY2tDb21tYW5kKVxuICAgICAgICAgICAgZW52aXJvbm1lbnQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KCBwcm9jZXNzLmVudiApKTtcbiAgICAgICAgICAgIGlmIHR5cGVvZiBzZWFyY2hQYXRoIGlzICdzdHJpbmcnIGFuZCBzZWFyY2hQYXRoLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudC5QQVRIICs9IFwiOiN7c2VhcmNoUGF0aH1cIlxuXG4gICAgICAgICAgICBleGVjIGNvbW1hbmQsIHsgZW52OiBlbnZpcm9ubWVudCB9LCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PlxuICAgICAgICAgICAgICAgIGlmIHN0ZG91dC50cmltKCkgaXMgJ2ZvdW5kJ1xuICAgICAgICAgICAgICAgICAgICBjaGVja05vZGVTYXNzRXhpc3RzKHNlYXJjaFBhdGgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjaGVja05vZGVTYXNzRXhpc3RzKClcblxuXG4gICAgICAgICMgU3RhcnQgcmVjdXJzaXZlIHNlYXJjaCBmb3Igbm9kZS1zYXNzIGNvbW1hbmRcbiAgICAgICAgY2hlY2tOb2RlU2Fzc0V4aXN0cygpXG5cblxuICAgIGFza0FuZEZpeE5vZGVTYXNzUGF0aDogKG5vZGVTYXNzUGF0aCkgLT5cbiAgICAgICAgaWYgbm9kZVNhc3NQYXRoIGlzICcnIGFuZCBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggaXNudCAnJ1xuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlID0gXCInUGF0aCB0byBub2RlLXNhc3MgY29tbWFuZCcgb3B0aW9uIHdpbGwgYmUgY2xlYXJlZCwgYmVjYXVzZSBub2RlLXNhc3MgaXMgYWNjZXNzYWJsZSB3aXRob3V0IGFic29sdXRlIHBhdGguXCJcblxuICAgICAgICBlbHNlIGlmIG5vZGVTYXNzUGF0aCBpc250ICcnIGFuZCBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggaXMgJydcbiAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZSA9IFwiJ1BhdGggdG8gbm9kZS1zYXNzIGNvbW1hbmQnIG9wdGlvbiB3aWxsIGJlIHNldCB0byAnI3tub2RlU2Fzc1BhdGh9JywgYmVjYXVzZSBjb21tYW5kIHdhcyBmb3VuZCB0aGVyZS5cIlxuXG4gICAgICAgIGVsc2UgaWYgbm9kZVNhc3NQYXRoIGlzbnQgJycgYW5kIEBvcHRpb25zLm5vZGVTYXNzUGF0aCBpc250ICcnXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2UgPSBcIidQYXRoIHRvIG5vZGUtc2FzcyBjb21tYW5kJyBvcHRpb24gd2lsbCBiZSByZXBsYWNlZCB3aXRoICcje25vZGVTYXNzUGF0aH0nLCBiZWNhdXNlIGNvbW1hbmQgd2FzIGZvdW5kIHRoZXJlLlwiXG5cbiAgICAgICAgIyBBc2sgdXNlciB0byBmaXggdGhhdCBwYXRoXG4gICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCInbm9kZS1zYXNzJyBjb21tYW5kIGNvdWxkIG5vdCBiZSBmb3VuZCB3aXRoIGN1cnJlbnQgY29uZmlndXJhdGlvbiwgYnV0IGl0IGNhbiBiZSBhdXRvbWF0aWNhbGx5IGZpeGVkLiBGaXggaXQ/XCJcbiAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogZGV0YWlsZWRNZXNzYWdlXG4gICAgICAgICAgICBidXR0b25zOiBbXCJGaXggaXRcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgc3dpdGNoIGRpYWxvZ1Jlc3VsdEJ1dHRvblxuICAgICAgICAgICAgd2hlbiAwXG4gICAgICAgICAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ25vZGVTYXNzUGF0aCcsIG5vZGVTYXNzUGF0aClcbiAgICAgICAgICAgICAgICBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggPSBub2RlU2Fzc1BhdGhcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgd2hlbiAxXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cblxuICAgIGRvQ29tcGlsZTogKCkgLT5cbiAgICAgICAgaWYgQG91dHB1dFN0eWxlcy5sZW5ndGggaXMgMFxuICAgICAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG4gICAgICAgICAgICBpZiBAaW5wdXRGaWxlLmlzVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgRmlsZS5kZWxldGUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgb3V0cHV0U3R5bGUgPSBAb3V0cHV0U3R5bGVzLnBvcCgpO1xuICAgICAgICBvdXRwdXRGaWxlID0gQGdldE91dHB1dEZpbGUob3V0cHV0U3R5bGUpXG4gICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzID0gQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoeyBvdXRwdXRGaWxlbmFtZTogb3V0cHV0RmlsZS5wYXRoLCBvdXRwdXRTdHlsZTogb3V0cHV0RmlsZS5zdHlsZSB9KVxuXG4gICAgICAgIHRyeVxuICAgICAgICAgICAgaWYgQGlzQ29tcGlsZVRvRmlsZSgpXG4gICAgICAgICAgICAgICAgc3dpdGNoIEBjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzKG91dHB1dEZpbGUpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ292ZXJ3cml0ZScgdGhlbiAjIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAnY2FuY2VsJyB0aGVuIHRocm93IG5ldyBFcnJvcignQ29tcGlsYXRpb24gY2FuY2VsbGVkJylcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAnc2tpcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzLm1lc3NhZ2UgPSAnQ29tcGlsYXRpb24gc2tpcHBlZDogJyArIG91dHB1dEZpbGUucGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCgnd2FybmluZycsIGVtaXR0ZXJQYXJhbWV0ZXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGRvQ29tcGlsZSgpICMgPC0tLSBSZWN1cnNpb24hISFcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBAZW5zdXJlT3V0cHV0RGlyZWN0b3J5RXhpc3RzKG91dHB1dEZpbGUpXG5cbiAgICAgICAgICAgIEBzdGFydENvbXBpbGluZ1RpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG5cbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzID0gQHByZXBhcmVFeGVjUGFyYW1ldGVycyhvdXRwdXRGaWxlKVxuICAgICAgICAgICAgdGltZW91dCA9IGlmIEBvcHRpb25zLm5vZGVTYXNzVGltZW91dCA+IDAgdGhlbiBAb3B0aW9ucy5ub2RlU2Fzc1RpbWVvdXQgZWxzZSAwXG4gICAgICAgICAgICBjaGlsZCA9IGV4ZWMgZXhlY1BhcmFtZXRlcnMuY29tbWFuZCwgeyBlbnY6IGV4ZWNQYXJhbWV0ZXJzLmVudmlyb25tZW50LCB0aW1lb3V0OiB0aW1lb3V0IH0sIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICAgICAgICAgICAgIyBleGl0Q29kZSBpcyAxIHdoZW4gc29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCBleGVjdXRpbmcgbm9kZS1zYXNzIGNvbW1hbmQsIG5vdCB3aGVuXG4gICAgICAgICAgICAgICAgIyB0aGVyZSBpcyBhbiBlcnJvciBpbiBTQVNTXG4gICAgICAgICAgICAgICAgaWYgY2hpbGQuZXhpdENvZGUgPiAwXG4gICAgICAgICAgICAgICAgICAgIEB0cnlUb0ZpbmROb2RlU2Fzc0luc3RhbGxhdGlvbiAoZm91bmQsIGZpeGVkKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBPbmx5IHJldHJ5IHRvIGNvbXBpbGUgaWYgbm9kZS1zYXNzIGNvbW1hbmQgY291bGQgYmUgZml4ZWQsIG5vdCBpZlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBub2RlLXNhc3MgY291bGQgYmUgZm91bmQuIEJlY2F1c2UgdGhlcmUgY2FuIGJlIG90aGVyIGVycm9zIHRoYW4gb25seVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBhIG5vbi1maW5kYWJsZSBub2RlLXNhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZpeGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQF9jb21waWxlKEBtb2RlLCBAdGFyZ2V0RmlsZW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0cnkgYWdhaW4gY29tcGlsaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0aHJvdyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbkNvbXBpbGVkKG91dHB1dEZpbGUsIGVycm9yLCBzdGRvdXQsIHN0ZGVyciwgY2hpbGQua2lsbGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBkb0NvbXBpbGUoKSAjIDwtLS0gUmVjdXJzaW9uISEhXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAb25Db21waWxlZChvdXRwdXRGaWxlLCBlcnJvciwgc3Rkb3V0LCBzdGRlcnIsIGNoaWxkLmtpbGxlZClcbiAgICAgICAgICAgICAgICAgICAgQGRvQ29tcGlsZSgpICMgPC0tLSBSZWN1cnNpb24hISFcblxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMubWVzc2FnZSA9IGVycm9yXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0KCdlcnJvcicsIGVtaXR0ZXJQYXJhbWV0ZXJzKVxuXG4gICAgICAgICAgICAjIENsZWFyIG91dHB1dCBzdHlsZXMsIHNvIG5vIGZ1cnRoZXIgY29tcGlsYXRpb24gd2lsbCBiZSBleGVjdXRlZFxuICAgICAgICAgICAgQG91dHB1dFN0eWxlcyA9IFtdO1xuXG4gICAgICAgICAgICBAZG9Db21waWxlKCkgIyA8LS0tIFJlY3Vyc2lvbiEhIVxuXG5cbiAgICBvbkNvbXBpbGVkOiAob3V0cHV0RmlsZSwgZXJyb3IsIHN0ZG91dCwgc3RkZXJyLCBraWxsZWQpIC0+XG4gICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzID0gQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoeyBvdXRwdXRGaWxlbmFtZTogb3V0cHV0RmlsZS5wYXRoLCBvdXRwdXRTdHlsZTogb3V0cHV0RmlsZS5zdHlsZSB9KVxuICAgICAgICBzdGF0aXN0aWNzID1cbiAgICAgICAgICAgIGR1cmF0aW9uOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIEBzdGFydENvbXBpbGluZ1RpbWVzdGFtcFxuXG4gICAgICAgIHRyeVxuICAgICAgICAgICAgIyBTYXZlIG5vZGUtc2FzcyBjb21waWxhdGlvbiBvdXRwdXQgKGluZm8sIHdhcm5pbmdzLCBlcnJvcnMsIGV0Yy4pXG4gICAgICAgICAgICBlbWl0dGVyUGFyYW1ldGVycy5ub2RlU2Fzc091dHB1dCA9IGlmIHN0ZG91dCB0aGVuIHN0ZG91dCBlbHNlIHN0ZGVyclxuXG4gICAgICAgICAgICBpZiBlcnJvciBpc250IG51bGwgb3Iga2lsbGVkXG4gICAgICAgICAgICAgICAgaWYga2lsbGVkXG4gICAgICAgICAgICAgICAgICAgICMgbm9kZS1zYXNzIGhhcyBiZWVuIGV4ZWN1dGVkIHRvbyBsb25nXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiQ29tcGlsYXRpb24gY2FuY2VsbGVkIGJlY2F1c2Ugb2YgdGltZW91dCAoI3tAb3B0aW9ucy5ub2RlU2Fzc1RpbWVvdXR9IG1zKVwiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICMgZXJyb3Igd2hpbGUgZXhlY3V0aW5nIG5vZGUtc2Fzc1xuICAgICAgICAgICAgICAgICAgICBpZiBlcnJvci5tZXNzYWdlLmluZGV4T2YoJ1wibWVzc2FnZVwiOicpID4gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySnNvbiA9IGVycm9yLm1lc3NhZ2UubWF0Y2goL3tcXG4oLio/KFxcbikpK30vZ20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gSlNPTi5wYXJzZShlcnJvckpzb24pXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2VcblxuICAgICAgICAgICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzLm1lc3NhZ2UgPSBlcnJvck1lc3NhZ2VcbiAgICAgICAgICAgICAgICBAZW1pdHRlci5lbWl0KCdlcnJvcicsIGVtaXR0ZXJQYXJhbWV0ZXJzKVxuXG4gICAgICAgICAgICAgICAgIyBDbGVhciBvdXRwdXQgc3R5bGVzLCBzbyBubyBmdXJ0aGVyIGNvbXBpbGF0aW9uIHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICBAb3V0cHV0U3R5bGVzID0gW107XG5cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdGF0aXN0aWNzLmJlZm9yZSA9IEZpbGUuZ2V0RmlsZVNpemUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MuYWZ0ZXIgPSBGaWxlLmdldEZpbGVTaXplKG91dHB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBzdGF0aXN0aWNzLnVuaXQgPSAnQnl0ZSdcblxuICAgICAgICAgICAgICAgIGlmIEBpc0NvbXBpbGVEaXJlY3QoKVxuICAgICAgICAgICAgICAgICAgICBjb21waWxlZENzcyA9IGZzLnJlYWRGaWxlU3luYyhvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRUZXh0KCBjb21waWxlZENzcy50b1N0cmluZygpIClcblxuICAgICAgICAgICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzLnN0YXRpc3RpY3MgPSBzdGF0aXN0aWNzXG4gICAgICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCgnc3VjY2VzcycsIGVtaXR0ZXJQYXJhbWV0ZXJzKVxuXG4gICAgICAgIGZpbmFsbHlcbiAgICAgICAgICAgICMgRGVsZXRlIHRlbXBvcmFyeSBjcmVhdGVkIG91dHB1dCBmaWxlLCBldmVuIGlmIHRoZXJlIHdhcyBhbiBlcnJvclxuICAgICAgICAgICAgIyBCdXQgZG8gbm90IGRlbGV0ZSBhIHRlbXBvcmFyeSBpbnB1dCBmaWxlLCBiZWNhdXNlIG9mIG11bHRpcGxlIG91dHB1dHMhXG4gICAgICAgICAgICBpZiBvdXRwdXRGaWxlLmlzVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgRmlsZS5kZWxldGUob3V0cHV0RmlsZS5wYXRoKVxuXG5cbiAgICBwcmVwYXJlRXhlY1BhcmFtZXRlcnM6IChvdXRwdXRGaWxlKSAtPlxuICAgICAgICAjIEJ1aWxkIHRoZSBjb21tYW5kIHN0cmluZ1xuICAgICAgICBub2RlU2Fzc1BhcmFtZXRlcnMgPSBAYnVpbGROb2RlU2Fzc1BhcmFtZXRlcnMob3V0cHV0RmlsZSlcbiAgICAgICAgY29tbWFuZCA9ICdub2RlLXNhc3MgJyArIG5vZGVTYXNzUGFyYW1ldGVycy5qb2luKCcgJylcblxuICAgICAgICAjIENsb25lIGN1cnJlbnQgZW52aXJvbm1lbnQsIHNvIGRvIG5vdCB0b3VjaCB0aGUgZ2xvYmFsIG9uZSBidXQgY2FuIG1vZGlmeSB0aGUgc2V0dGluZ3NcbiAgICAgICAgZW52aXJvbm1lbnQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KCBwcm9jZXNzLmVudiApKTtcblxuICAgICAgICAjIEJlY2F1c2Ugb2YgcGVybWlzc2lvbiBwcm9ibGVtcyBpbiBNYWMgT1MgYW5kIExpbnV4IHdlIHNvbWV0aW1lcyBuZWVkIHRvIGFkZCBub2RlU2Fzc1BhdGhcbiAgICAgICAgIyB0byBjb21tYW5kIGFuZCB0byBlbnZpcm9ubWVudCB2YXJpYWJsZSBQQVRIIHNvIHNoZWxsIEFORCBub2RlLmpzIGNhbiBmaW5kIG5vZGUtc2Fzc1xuICAgICAgICAjIGV4ZWN1dGFibGVcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLm5vZGVTYXNzUGF0aCBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMubm9kZVNhc3NQYXRoLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICMgVE9ETzogSGllciBzb2xsdGUgZXMgc28gb3B0aW1pZXJ0IHdlcmRlbiwgZGFzcyB3ZW5uIGRlciBhYnNvbHV0ZSBQZmFkIGRpZSBBbndlbmR1bmcgZW50aMOkbHQgZGllc2Ugw7xiZXJub21tZW4gd2VyZGVuIHNvbGx0ZVxuICAgICAgICAgICAgY29tbWFuZCA9IHBhdGguam9pbihAb3B0aW9ucy5ub2RlU2Fzc1BhdGgsIGNvbW1hbmQpXG4gICAgICAgICAgICBlbnZpcm9ubWVudC5QQVRIICs9IFwiOiN7QG9wdGlvbnMubm9kZVNhc3NQYXRofVwiXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmQsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnRcbiAgICAgICAgfVxuXG5cbiAgICBidWlsZE5vZGVTYXNzUGFyYW1ldGVyczogKG91dHB1dEZpbGUpIC0+XG4gICAgICAgIGV4ZWNQYXJhbWV0ZXJzID0gW11cbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeSA9IHBhdGguZGlybmFtZShAaW5wdXRGaWxlLnBhdGgpXG5cbiAgICAgICAgIyAtLW91dHB1dC1zdHlsZVxuICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLW91dHB1dC1zdHlsZSAnICsgb3V0cHV0RmlsZS5zdHlsZSlcblxuICAgICAgICAjIC0taW5kZW50LXR5cGVcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLmluZGVudFR5cGUgaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLmluZGVudFR5cGUubGVuZ3RoID4gMFxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1pbmRlbnQtdHlwZSAnICsgQG9wdGlvbnMuaW5kZW50VHlwZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICMgLS1pbmRlbnQtd2lkdGhcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLmluZGVudFdpZHRoIGlzICdudW1iZXInXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWluZGVudC13aWR0aCAnICsgQG9wdGlvbnMuaW5kZW50V2lkdGgpXG5cbiAgICAgICAgIyAtLWxpbmVmZWVkXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5saW5lZmVlZCBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMubGluZWZlZWQubGVuZ2h0ID4gMFxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1saW5lZmVlZCAnICsgQG9wdGlvbnMubGluZWZlZWQpXG5cbiAgICAgICAgIyAtLXNvdXJjZS1jb21tZW50c1xuICAgICAgICBpZiBAb3B0aW9ucy5zb3VyY2VDb21tZW50cyBpcyB0cnVlXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLXNvdXJjZS1jb21tZW50cycpXG5cbiAgICAgICAgIyAtLXNvdXJjZS1tYXBcbiAgICAgICAgaWYgQG9wdGlvbnMuc291cmNlTWFwIGlzIHRydWUgb3IgKHR5cGVvZiBAb3B0aW9ucy5zb3VyY2VNYXAgaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLnNvdXJjZU1hcC5sZW5ndGggPiAwKVxuICAgICAgICAgICAgaWYgQG9wdGlvbnMuc291cmNlTWFwIGlzIHRydWVcbiAgICAgICAgICAgICAgICBzb3VyY2VNYXBGaWxlbmFtZSA9IG91dHB1dEZpbGUucGF0aCArICcubWFwJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgZmlsZUV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShiYXNlbmFtZSkucmVwbGFjZSgnLicsICcnKVxuICAgICAgICAgICAgICAgIHNvdXJjZU1hcEZpbGVuYW1lID0gYmFzZW5hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdeKC4qPylcXC4oJyArIGZpbGVFeHRlbnNpb24gKyAnKSQnLCAnZ2knKSwgQG9wdGlvbnMuc291cmNlTWFwKVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1zb3VyY2UtbWFwIFwiJyArIHNvdXJjZU1hcEZpbGVuYW1lICsgJ1wiJylcblxuICAgICAgICAjIC0tc291cmNlLW1hcC1lbWJlZFxuICAgICAgICBpZiBAb3B0aW9ucy5zb3VyY2VNYXBFbWJlZCBpcyB0cnVlXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLXNvdXJjZS1tYXAtZW1iZWQnKVxuXG4gICAgICAgICMgLS1zb3VyY2UtbWFwLWNvbnRlbnRzXG4gICAgICAgIGlmIEBvcHRpb25zLnNvdXJjZU1hcENvbnRlbnRzIGlzIHRydWVcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tc291cmNlLW1hcC1jb250ZW50cycpXG5cbiAgICAgICAgIyAtLWluY2x1ZGUtcGF0aFxuICAgICAgICBpZiBAb3B0aW9ucy5pbmNsdWRlUGF0aFxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBAb3B0aW9ucy5pbmNsdWRlUGF0aFxuICAgICAgICAgICAgaWYgdHlwZW9mIGluY2x1ZGVQYXRoIGlzICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgYXJndW1lbnRQYXJzZXIgPSBuZXcgQXJndW1lbnRQYXJzZXIoKVxuICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gYXJndW1lbnRQYXJzZXIucGFyc2VWYWx1ZSgnWycgKyBpbmNsdWRlUGF0aCArICddJylcbiAgICAgICAgICAgICAgICBpZiAhQXJyYXkuaXNBcnJheShpbmNsdWRlUGF0aClcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBbaW5jbHVkZVBhdGhdXG5cbiAgICAgICAgICAgIGZvciBpIGluIFswIC4uIGluY2x1ZGVQYXRoLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgaWYgbm90IHBhdGguaXNBYnNvbHV0ZShpbmNsdWRlUGF0aFtpXSlcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhdGhbaV0gPSBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSwgaW5jbHVkZVBhdGhbaV0pXG5cbiAgICAgICAgICAgICAgICAjIFJlbW92ZSB0cmFpbGluZyAoYmFjay0pc2xhc2gsIGJlY2F1c2UgZWxzZSB0aGVyZSBzZWVtcyB0byBiZSBhIGJ1ZyBpbiBub2RlLXNhc3NcbiAgICAgICAgICAgICAgICAjIHNvIGNvbXBpbGluZyBlbmRzIGluIGFuIGluZmluaXRlIGxvb3BcbiAgICAgICAgICAgICAgICBpZiBpbmNsdWRlUGF0aFtpXS5zdWJzdHIoLTEpIGlzIHBhdGguc2VwXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoW2ldID0gaW5jbHVkZVBhdGhbaV0uc3Vic3RyKDAsIGluY2x1ZGVQYXRoW2ldLmxlbmd0aCAtIDEpXG5cbiAgICAgICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWluY2x1ZGUtcGF0aCBcIicgKyBpbmNsdWRlUGF0aFtpXSArICdcIicpXG5cbiAgICAgICAgIyAtLXByZWNpc2lvblxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMucHJlY2lzaW9uIGlzICdudW1iZXInXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLXByZWNpc2lvbiAnICsgQG9wdGlvbnMucHJlY2lzaW9uKVxuXG4gICAgICAgICMgLS1pbXBvcnRlclxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMuaW1wb3J0ZXIgaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLmltcG9ydGVyLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGltcG9ydGVyRmlsZW5hbWUgPSBAb3B0aW9ucy5pbXBvcnRlclxuICAgICAgICAgICAgaWYgbm90IHBhdGguaXNBYnNvbHV0ZShpbXBvcnRlckZpbGVuYW1lKVxuICAgICAgICAgICAgICAgIGltcG9ydGVyRmlsZW5hbWUgPSBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSAsIGltcG9ydGVyRmlsZW5hbWUpXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWltcG9ydGVyIFwiJyArIHBhdGgucmVzb2x2ZShpbXBvcnRlckZpbGVuYW1lKSArICdcIicpXG5cbiAgICAgICAgIyAtLWZ1bmN0aW9uc1xuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMuZnVuY3Rpb25zIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5mdW5jdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgZnVuY3Rpb25zRmlsZW5hbWUgPSBAb3B0aW9ucy5mdW5jdGlvbnNcbiAgICAgICAgICAgIGlmIG5vdCBwYXRoLmlzQWJzb2x1dGUoZnVuY3Rpb25zRmlsZW5hbWUpXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25zRmlsZW5hbWUgPSBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSAsIGZ1bmN0aW9uc0ZpbGVuYW1lKVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1mdW5jdGlvbnMgXCInICsgcGF0aC5yZXNvbHZlKGZ1bmN0aW9uc0ZpbGVuYW1lKSArICdcIicpXG5cbiAgICAgICAgIyBDU1MgdGFyZ2V0IGFuZCBvdXRwdXQgZmlsZVxuICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCdcIicgKyBAaW5wdXRGaWxlLnBhdGggKyAnXCInKVxuICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCdcIicgKyBvdXRwdXRGaWxlLnBhdGggKyAnXCInKVxuXG4gICAgICAgIHJldHVybiBleGVjUGFyYW1ldGVyc1xuXG5cbiAgICBlbWl0U3RhcnQ6ICgpIC0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQoJ3N0YXJ0JywgQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoKSlcblxuXG4gICAgZW1pdEZpbmlzaGVkOiAoKSAtPlxuICAgICAgICBAZGVsZXRlVGVtcG9yYXJ5RmlsZXMoKVxuICAgICAgICBAZW1pdHRlci5lbWl0KCdmaW5pc2hlZCcsIEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKCkpXG5cblxuICAgIGVtaXRNZXNzYWdlOiAodHlwZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgQGVtaXR0ZXIuZW1pdCh0eXBlLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycyh7IG1lc3NhZ2U6IG1lc3NhZ2UgfSkpXG5cblxuICAgIGVtaXRNZXNzYWdlQW5kRmluaXNoOiAodHlwZSwgbWVzc2FnZSwgZW1pdFN0YXJ0RXZlbnQgPSBmYWxzZSkgLT5cbiAgICAgICAgaWYgZW1pdFN0YXJ0RXZlbnRcbiAgICAgICAgICAgIEBlbWl0U3RhcnQoKVxuICAgICAgICBAZW1pdE1lc3NhZ2UodHlwZSwgbWVzc2FnZSlcbiAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG5cblxuICAgIGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnM6IChhZGRpdGlvbmFsUGFyYW1ldGVycyA9IHt9KSAtPlxuICAgICAgICBwYXJhbWV0ZXJzID1cbiAgICAgICAgICAgIGlzQ29tcGlsZVRvRmlsZTogQGlzQ29tcGlsZVRvRmlsZSgpLFxuICAgICAgICAgICAgaXNDb21waWxlRGlyZWN0OiBAaXNDb21waWxlRGlyZWN0KCksXG5cbiAgICAgICAgaWYgQGlucHV0RmlsZVxuICAgICAgICAgICAgcGFyYW1ldGVycy5pbnB1dEZpbGVuYW1lID0gQGlucHV0RmlsZS5wYXRoXG5cbiAgICAgICAgZm9yIGtleSwgdmFsdWUgb2YgYWRkaXRpb25hbFBhcmFtZXRlcnNcbiAgICAgICAgICAgIHBhcmFtZXRlcnNba2V5XSA9IHZhbHVlXG5cbiAgICAgICAgcmV0dXJuIHBhcmFtZXRlcnNcblxuXG4gICAgZGVsZXRlVGVtcG9yYXJ5RmlsZXM6IC0+XG4gICAgICAgIGlmIEBpbnB1dEZpbGUgYW5kIEBpbnB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgIEZpbGUuZGVsZXRlKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgaWYgQG91dHB1dEZpbGUgYW5kIEBvdXRwdXRGaWxlLmlzVGVtcG9yYXJ5XG4gICAgICAgICAgICBGaWxlLmRlbGV0ZShAb3V0cHV0RmlsZS5wYXRoKVxuXG5cbiAgICBpc0NvbXBpbGVEaXJlY3Q6IC0+XG4gICAgICAgIHJldHVybiBAbW9kZSBpcyBOb2RlU2Fzc0NvbXBpbGVyLk1PREVfRElSRUNUXG5cblxuICAgIGlzQ29tcGlsZVRvRmlsZTogLT5cbiAgICAgICAgcmV0dXJuIEBtb2RlIGlzIE5vZGVTYXNzQ29tcGlsZXIuTU9ERV9GSUxFXG5cblxuICAgIG9uU3RhcnQ6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ3N0YXJ0JywgY2FsbGJhY2tcblxuXG4gICAgb25TdWNjZXNzOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdzdWNjZXNzJywgY2FsbGJhY2tcblxuXG4gICAgb25XYXJuaW5nOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICd3YXJuaW5nJywgY2FsbGJhY2tcblxuXG4gICAgb25FcnJvcjogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnZXJyb3InLCBjYWxsYmFja1xuXG5cbiAgICBvbkZpbmlzaGVkOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdmaW5pc2hlZCcsIGNhbGxiYWNrXG4iXX0=
