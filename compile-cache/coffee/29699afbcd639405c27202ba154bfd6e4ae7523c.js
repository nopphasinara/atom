(function() {
  var AtomMinifier, AtomMinifyMinifierOptionsParser, AtomMinifyOptions, Emitter, File, InlineParameterParser, fs, path;

  Emitter = require('event-kit').Emitter;

  AtomMinifyOptions = require('./options');

  AtomMinifyMinifierOptionsParser = require('./minifier-options-parser');

  InlineParameterParser = require('./helper/inline-parameter-parser');

  File = require('./helper/file');

  fs = require('fs');

  path = require('path');

  module.exports = AtomMinifier = (function() {
    var defaultOutputFilenamePattern;

    AtomMinifier.MINIFY_DIRECT = 'direct';

    AtomMinifier.MINIFY_TO_MIN_FILE = 'to-min-file';

    defaultOutputFilenamePattern = '$1.min.$2';

    function AtomMinifier(options) {
      this.options = options;
      this.emitter = new Emitter();
    }

    AtomMinifier.prototype.destroy = function() {
      this.emitter.dispose();
      return this.emitter = null;
    };

    AtomMinifier.prototype.minify = function(mode, filename, minifyOnSave) {
      var parameterParser, parameterTarget;
      if (filename == null) {
        filename = null;
      }
      if (minifyOnSave == null) {
        minifyOnSave = false;
      }
      this.mode = mode;
      this.targetFilename = filename;
      this.minifyOnSave = minifyOnSave;
      this.contentType = void 0;
      this.inputFile = void 0;
      this.outputFile = void 0;
      if (this.isMinifyDirect && !atom.workspace.getActiveTextEditor()) {
        this.emitFinished();
        return;
      }
      parameterParser = new InlineParameterParser();
      parameterTarget = this.getParameterTarget();
      return parameterParser.parse(parameterTarget, (function(_this) {
        return function(params, error) {
          var errorMessage, ref, result;
          if (_this.minifyOnSave && _this.prohibitMinificationOnSave(params)) {
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
          if ((ref = (result = _this.detectContentType())) === false || ref === 'cancelled') {
            if (result === 'cancelled') {
              _this.emitMessageAndFinish('warning', 'Invalid content type. Minification cancelled!', true);
            } else {
              _this.emitFinished();
            }
            return;
          }
          _this.emitStart();
          if (_this.isMinifyToFile() && (!_this.ensureFileIsSaved() || !_this.checkAlreadyMinifiedFile())) {
            _this.emitMessageAndFinish('warning', 'Minification cancelled!');
            return;
          }
          _this.updateOptionsByInlineParameters(params);
          _this.setupOutputFile();
          if (_this.isMinifyToFile() && !_this.checkOutputFileAlreadyExists()) {
            return _this.emitFinished();
          } else {
            _this.ensureOutputDirectoryExists();
            if (_this.options.compress !== void 0 && _this.options.compress === false) {
              if (_this.isMinifyToFile()) {
                return _this.writeUnminifiedText();
              } else {
                return _this.emitMessageAndFinish('warning', 'Do you think it makes sense to directly minify to uncompressed code?');
              }
            } else {
              return _this.writeMinifiedText();
            }
          }
        };
      })(this));
    };

    AtomMinifier.prototype.getParameterTarget = function() {
      if (typeof this.targetFilename === 'string') {
        return this.targetFilename;
      } else {
        return atom.workspace.getActiveTextEditor();
      }
    };

    AtomMinifier.prototype.prohibitMinificationOnSave = function(params) {
      var ref, ref1;
      if ((ref = params.minifyOnSave) === true || ref === false) {
        this.options.minifyOnSave = params.minifyOnSave;
      } else if ((ref1 = params.minOnSave) === true || ref1 === false) {
        this.options.minifyOnSave = params.minOnSave;
      }
      return !this.options.minifyOnSave;
    };

    AtomMinifier.prototype.validateInputFile = function() {
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

    AtomMinifier.prototype.setupInputFile = function(filename) {
      var activeEditor;
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
        if (this.isMinifyDirect()) {
          this.inputFile.path = File.getTemporaryFilename('atom-minify.input.');
          this.inputFile.isTemporary = true;
          return fs.writeFileSync(this.inputFile.path, activeEditor.getText());
        } else {
          this.inputFile.path = activeEditor.getURI();
          if (!this.inputFile.path) {
            return this.inputFile.path = this.askForSavingUnsavedFileInActiveEditor();
          }
        }
      }
    };

    AtomMinifier.prototype.askForSavingUnsavedFileInActiveEditor = function() {
      var activeEditor, dialogResultButton, error, filename;
      activeEditor = atom.workspace.getActiveTextEditor();
      dialogResultButton = atom.confirm({
        message: "You want to minify a unsaved file to a minified file, but you have to save it before. Do you want to save the file?",
        detailedMessage: "Alternativly you can use 'Direct Minification' for minifying file.",
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

    AtomMinifier.prototype.detectContentType = function() {
      var activeEditor, fileExtension, filename;
      this.contentType = void 0;
      if (this.isMinifyDirect()) {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor && activeEditor.getURI()) {
          filename = activeEditor.getURI();
          if (filename && fs.existsSync(filename)) {
            fileExtension = path.extname(filename).toLowerCase();
          }
        }
      } else if (this.inputFile.path) {
        fileExtension = path.extname(this.inputFile.path).toLowerCase();
      }
      switch (fileExtension) {
        case '.css':
          this.contentType = 'css';
          break;
        case '.js':
          this.contentType = 'js';
          break;
        default:
          if (!this.isMinifyOnSave()) {
            this.contentType = this.askForContentType();
          }
      }
      if (this.contentType === false) {
        return 'cancelled';
      } else {
        return this.contentType !== void 0;
      }
    };

    AtomMinifier.prototype.askForContentType = function() {
      var dialogResultButton, type;
      dialogResultButton = atom.confirm({
        message: "Can not detect content type. Tell me which minifier should be used for minification?",
        buttons: ["CSS", "JS", "Cancel"]
      });
      switch (dialogResultButton) {
        case 0:
          type = 'css';
          break;
        case 1:
          type = 'js';
          break;
        default:
          type = false;
      }
      return type;
    };

    AtomMinifier.prototype.ensureFileIsSaved = function() {
      var dialogResultButton, editor, editors, filename, i, len;
      editors = atom.workspace.getTextEditors();
      for (i = 0, len = editors.length; i < len; i++) {
        editor = editors[i];
        if (editor && editor.getURI && editor.getURI() === this.inputFile.path && editor.isModified()) {
          filename = path.basename(this.inputFile.path);
          dialogResultButton = atom.confirm({
            message: "'" + filename + "' has changes, do you want to save them?",
            detailedMessage: "In order to minify a file you have to save changes.",
            buttons: ["Save and minify", "Cancel"]
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

    AtomMinifier.prototype.checkAlreadyMinifiedFile = function() {
      var dialogResultButton;
      if (this.options.checkAlreadyMinifiedFile) {
        if (/\.(?:min|minified|compressed)\./i.exec(this.inputFile.path) !== null) {
          dialogResultButton = atom.confirm({
            message: "The filename indicates that content is already minified. Minify again?",
            detailedMessage: "The filename contains one of the following parts: '.min.', '.minified.', '.compressed.'",
            buttons: ["Minify", "Cancel"]
          });
          return dialogResultButton === 0;
        }
      }
      return true;
    };

    AtomMinifier.prototype.updateOptionsByInlineParameters = function(params) {
      var isUnknownMinifier, minifierOptionsParser, ref, ref1;
      if (params.compress === false || params.uncompressed === true) {
        this.options.compress = false;
      }
      if (typeof params.filenamePattern === 'string' && params.filenamePattern.length > 0) {
        switch (this.contentType) {
          case 'css':
            this.options.cssMinifiedFilenamePattern = params.filenamePattern;
            break;
          case 'js':
            this.options.jsMinifiedFilenamePattern = params.filenamePattern;
        }
      }
      if ((typeof params.outputPath === 'string' && params.outputPath.length > 0) || (typeof this.options.outputPath === 'string' && this.options.outputPath.length > 0)) {
        this.emitMessage('warning', "Please do not use outputPath option and/or parameter any more. These option has been removed. Use filename pattern options/parameters instead!");
      }
      if (typeof params.minifier === 'string') {
        isUnknownMinifier = true;
        switch (this.contentType) {
          case 'css':
            if ((ref = params.minifier) === 'clean-css' || ref === 'csso' || ref === 'sqwish' || ref === 'yui-css') {
              this.options.cssMinifier = params.minifier;
              isUnknownMinifier = false;
            }
            break;
          case 'js':
            if ((ref1 = params.minifier) === 'gcc' || ref1 === 'uglify-js' || ref1 === 'yui-js') {
              this.options.jsMinifier = params.minifier;
              isUnknownMinifier = false;
            }
        }
        if (isUnknownMinifier) {
          this.emitMessage('warning', "Unknown minifier '" + params.minifier + "' in first-line-parameters; using default minifier for minification");
        }
      }
      minifierOptionsParser = new AtomMinifyMinifierOptionsParser();
      this.options.minifierOptions = minifierOptionsParser.parse(this.contentType, this.options, params);
      if (typeof params.buffer === 'number') {
        if (params.buffer >= 1024 * 1024) {
          return this.options.buffer = params.buffer;
        } else {
          return this.emitMessage('warning', 'Parameter \'buffer\' must be greater or equal than 1024 * 1024');
        }
      }
    };

    AtomMinifier.prototype.setupOutputFile = function() {
      var basename, fileExtension, outputFile, outputPath, pattern;
      this.outputFile = {
        isTemporary: false
      };
      if (this.isMinifyDirect()) {
        this.outputFile.path = File.getTemporaryFilename('atom-minify.output.', null, this.contentType);
        return this.outputFile.isTemporary = true;
      } else {
        basename = path.basename(this.inputFile.path);
        fileExtension = path.extname(basename).replace('.', '');
        switch (this.contentType) {
          case 'css':
            pattern = this.options.cssMinifiedFilenamePattern;
            break;
          case 'js':
            pattern = this.options.jsMinifiedFilenamePattern;
            break;
          default:
            pattern = this.defaultOutputFilenamePattern;
        }
        basename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), pattern);
        if (fileExtension === '') {
          basename += this.contentType;
        }
        outputFile = basename;
        if (!path.isAbsolute(path.dirname(outputFile))) {
          outputPath = path.dirname(this.inputFile.path);
          outputFile = path.join(outputPath, outputFile);
        }
        return this.outputFile.path = outputFile;
      }
    };

    AtomMinifier.prototype.checkOutputFileAlreadyExists = function() {
      var dialogResultButton;
      if (this.options.checkOutputFileAlreadyExists) {
        if (fs.existsSync(this.outputFile.path)) {
          dialogResultButton = atom.confirm({
            message: "The output file already exists. Do you want to overwrite it?",
            detailedMessage: "Output file: '" + this.outputFile.path + "'",
            buttons: ["Overwrite", "Cancel"]
          });
          return dialogResultButton === 0;
        }
      }
      return true;
    };

    AtomMinifier.prototype.ensureOutputDirectoryExists = function() {
      var outputPath;
      if (this.isMinifyToFile()) {
        outputPath = path.dirname(this.outputFile.path);
        return File.ensureDirectoryExists(outputPath);
      }
    };

    AtomMinifier.prototype.writeUnminifiedText = function() {
      var activeEditor, dummyMinifierName, error, startTimestamp, statistics;
      dummyMinifierName = 'uncompressed';
      try {
        startTimestamp = new Date().getTime();
        activeEditor = atom.workspace.getActiveTextEditor();
        fs.writeFileSync(this.outputFile.path, activeEditor.getText());
        statistics = {
          duration: new Date().getTime() - startTimestamp,
          before: File.getFileSize(this.inputFile.path),
          after: File.getFileSize(this.outputFile.path)
        };
        this.emitter.emit('success', this.getBasicEmitterParameters({
          minifierName: dummyMinifierName,
          statistics: statistics
        }));
      } catch (error1) {
        error = error1;
        this.emitter.emit('error', this.getBasicEmitterParameters({
          minifierName: dummyMinifierName,
          message: error
        }));
      }
      return this.emitFinished();
    };

    AtomMinifier.prototype.writeMinifiedText = function() {
      var e, minifier, startTimestamp;
      minifier = this.buildMinifierInstance();
      try {
        startTimestamp = new Date().getTime();
        return minifier.minify(this.inputFile.path, this.outputFile.path, (function(_this) {
          return function(minifiedText, error) {
            var statistics;
            try {
              if (error) {
                return _this.emitMessage('error', error);
              } else {
                statistics = {
                  duration: new Date().getTime() - startTimestamp
                };
                if (_this.isMinifyDirect()) {
                  statistics.before = atom.workspace.getActiveTextEditor().getText().length;
                  statistics.after = minifiedText.length;
                  atom.workspace.getActiveTextEditor().setText(minifiedText);
                } else {
                  statistics.before = File.getFileSize(_this.inputFile.path);
                  statistics.after = File.getFileSize(_this.outputFile.path);
                }
                return _this.emitter.emit('success', _this.getBasicEmitterParameters({
                  minifierName: minifier.getName(),
                  statistics: statistics
                }));
              }
            } finally {
              _this.deleteTemporaryFiles();
              _this.emitFinished();
            }
          };
        })(this));
      } catch (error1) {
        e = error1;
        this.emitter.emit('error', this.getBasicEmitterParameters({
          minifierName: minifier.getName(),
          message: e.toString()
        }));
        return this.emitFinished();
      }
    };

    AtomMinifier.prototype.emitStart = function() {
      return this.emitter.emit('start', this.getBasicEmitterParameters());
    };

    AtomMinifier.prototype.emitFinished = function() {
      this.deleteTemporaryFiles();
      return this.emitter.emit('finished', this.getBasicEmitterParameters());
    };

    AtomMinifier.prototype.emitMessage = function(type, message) {
      return this.emitter.emit(type, this.getBasicEmitterParameters({
        message: message
      }));
    };

    AtomMinifier.prototype.emitMessageAndFinish = function(type, message, emitStartEvent) {
      if (emitStartEvent == null) {
        emitStartEvent = false;
      }
      if (emitStartEvent) {
        this.emitStart();
      }
      this.emitMessage(type, message);
      return this.emitFinished();
    };

    AtomMinifier.prototype.getBasicEmitterParameters = function(additionalParameters) {
      var key, parameters, value;
      if (additionalParameters == null) {
        additionalParameters = {};
      }
      parameters = {
        isMinifyToFile: this.isMinifyToFile(),
        isMinifyDirect: this.isMinifyDirect()
      };
      if (this.inputFile) {
        parameters.inputFilename = this.inputFile.path;
      }
      if (this.contentType) {
        parameters.contentType = this.contentType;
      }
      if (this.outputFile) {
        parameters.outputFilename = this.outputFile.path;
      }
      for (key in additionalParameters) {
        value = additionalParameters[key];
        parameters[key] = value;
      }
      return parameters;
    };

    AtomMinifier.prototype.deleteTemporaryFiles = function() {
      if (this.inputFile && this.inputFile.isTemporary) {
        File["delete"](this.inputFile.path);
      }
      if (this.outputFile && this.outputFile.isTemporary) {
        return File["delete"](this.outputFile.path);
      }
    };

    AtomMinifier.prototype.buildMinifierInstance = function() {
      var minifier, minifierClass, moduleName;
      switch (this.contentType) {
        case 'css':
          moduleName = this.options.cssMinifier;
          break;
        case 'js':
          moduleName = this.options.jsMinifier;
      }
      minifierClass = require("./minifier/" + this.contentType + "/" + moduleName);
      minifier = new minifierClass(this.options);
      return minifier;
    };

    AtomMinifier.prototype.isMinifyOnSave = function() {
      return this.minifyOnSave;
    };

    AtomMinifier.prototype.isMinifyDirect = function() {
      return this.mode === AtomMinifier.MINIFY_DIRECT;
    };

    AtomMinifier.prototype.isMinifyToFile = function() {
      return this.mode === AtomMinifier.MINIFY_TO_MIN_FILE;
    };

    AtomMinifier.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    AtomMinifier.prototype.onSuccess = function(callback) {
      return this.emitter.on('success', callback);
    };

    AtomMinifier.prototype.onWarning = function(callback) {
      return this.emitter.on('warning', callback);
    };

    AtomMinifier.prototype.onError = function(callback) {
      return this.emitter.on('error', callback);
    };

    AtomMinifier.prototype.onFinished = function(callback) {
      return this.emitter.on('finished', callback);
    };

    return AtomMinifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9taW5pZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFVBQVcsT0FBQSxDQUFRLFdBQVI7O0VBRVosaUJBQUEsR0FBb0IsT0FBQSxDQUFRLFdBQVI7O0VBQ3BCLCtCQUFBLEdBQWtDLE9BQUEsQ0FBUSwyQkFBUjs7RUFFbEMscUJBQUEsR0FBd0IsT0FBQSxDQUFRLGtDQUFSOztFQUN4QixJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7O0VBRVAsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFHUCxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUYsUUFBQTs7SUFBQSxZQUFDLENBQUEsYUFBRCxHQUFpQjs7SUFDakIsWUFBQyxDQUFBLGtCQUFELEdBQXNCOztJQUV0Qiw0QkFBQSxHQUErQjs7SUFHbEIsc0JBQUMsT0FBRDtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksT0FBSixDQUFBO0lBRkY7OzJCQUtiLE9BQUEsR0FBUyxTQUFBO01BQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRk47OzJCQU1ULE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQXdCLFlBQXhCO0FBQ0osVUFBQTs7UUFEVyxXQUFXOzs7UUFBTSxlQUFlOztNQUMzQyxJQUFDLENBQUEsSUFBRCxHQUFRO01BQ1IsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEs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LFFBQXZCO0lBRE87OzJCQUlYLE9BQUEsR0FBUyxTQUFDLFFBQUQ7YUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLFFBQXJCO0lBREs7OzJCQUlULFVBQUEsR0FBWSxTQUFDLFFBQUQ7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCO0lBRFE7Ozs7O0FBeGRoQiIsInNvdXJjZXNDb250ZW50IjpbIntFbWl0dGVyfSA9IHJlcXVpcmUoJ2V2ZW50LWtpdCcpXG5cbkF0b21NaW5pZnlPcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb25zJylcbkF0b21NaW5pZnlNaW5pZmllck9wdGlvbnNQYXJzZXIgPSByZXF1aXJlKCcuL21pbmlmaWVyLW9wdGlvbnMtcGFyc2VyJylcblxuSW5saW5lUGFyYW1ldGVyUGFyc2VyID0gcmVxdWlyZSgnLi9oZWxwZXIvaW5saW5lLXBhcmFtZXRlci1wYXJzZXInKVxuRmlsZSA9IHJlcXVpcmUoJy4vaGVscGVyL2ZpbGUnKVxuXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBBdG9tTWluaWZpZXJcblxuICAgIEBNSU5JRllfRElSRUNUID0gJ2RpcmVjdCdcbiAgICBATUlOSUZZX1RPX01JTl9GSUxFID0gJ3RvLW1pbi1maWxlJ1xuXG4gICAgZGVmYXVsdE91dHB1dEZpbGVuYW1lUGF0dGVybiA9ICckMS5taW4uJDInXG5cblxuICAgIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICAgICAgQG9wdGlvbnMgPSBvcHRpb25zXG4gICAgICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG5cbiAgICBkZXN0cm95OiAoKSAtPlxuICAgICAgICBAZW1pdHRlci5kaXNwb3NlKClcbiAgICAgICAgQGVtaXR0ZXIgPSBudWxsXG5cblxuICAgICMgSWYgZmlsZW5hbWUgaXMgbnVsbCB0aGVuIGFjdGl2ZSB0ZXh0IGVkaXRvciBpcyB1c2VkIGZvciBtaW5pZmljYXRpb25cbiAgICBtaW5pZnk6IChtb2RlLCBmaWxlbmFtZSA9IG51bGwsIG1pbmlmeU9uU2F2ZSA9IGZhbHNlKSAtPlxuICAgICAgICBAbW9kZSA9IG1vZGVcbiAgICAgICAgQHRhcmdldEZpbGVuYW1lID0gZmlsZW5hbWVcbiAgICAgICAgQG1pbmlmeU9uU2F2ZSA9IG1pbmlmeU9uU2F2ZVxuICAgICAgICBAY29udGVudFR5cGUgPSB1bmRlZmluZWRcbiAgICAgICAgQGlucHV0RmlsZSA9IHVuZGVmaW5lZFxuICAgICAgICBAb3V0cHV0RmlsZSA9IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmIEBpc01pbmlmeURpcmVjdCBhbmQgIWF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgQGVtaXRGaW5pc2hlZCgpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIFBhcnNlIGlubGluZSBwYXJhbWV0ZXJzIGFuZCBydW4gbWluaWZpY2F0aW9uOyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIHdlIHVzZSBhY3RpdmVcbiAgICAgICAgIyB0ZXh0LWVkaXRvciBpZiBwb3NzaWJsZSwgc28gcGFyYW1ldGVyIHBhcnNlciBtdXN0IG5vdCBsb2FkIGZpbGUgYWdhaW5cbiAgICAgICAgcGFyYW1ldGVyUGFyc2VyID0gbmV3IElubGluZVBhcmFtZXRlclBhcnNlcigpXG4gICAgICAgIHBhcmFtZXRlclRhcmdldCA9IEBnZXRQYXJhbWV0ZXJUYXJnZXQoKVxuICAgICAgICBwYXJhbWV0ZXJQYXJzZXIucGFyc2UgcGFyYW1ldGVyVGFyZ2V0LCAocGFyYW1zLCBlcnJvcikgPT5cbiAgICAgICAgICAgICMgSWYgcGFja2FnZSBpcyBjYWxsZWQgYnkgc2F2ZS1ldmVudCBvZiBlZGl0b3IsIGJ1dCBtaW5pZmljYXRpb24gaXMgcHJvaGliaXRlZCBieVxuICAgICAgICAgICAgIyBvcHRpb25zIG9yIGZpcnN0IGxpbmUgcGFyYW1ldGVyLCBleGVjdXRpb24gaXMgY2FuY2VsbGVkXG4gICAgICAgICAgICBpZiBAbWluaWZ5T25TYXZlIGFuZCBAcHJvaGliaXRNaW5pZmljYXRpb25PblNhdmUocGFyYW1zKVxuICAgICAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIEEgcG90ZW5pYWwgcGFyc2luZyBlcnJvciBpcyBvbmx5IGhhbmRsZWQgaWYgbWluaWZpY2F0aW9uIGlzIGV4ZWN1dGVkIGFuZCB0aGF0J3MgdGhlXG4gICAgICAgICAgICAjIGNhc2UgaWYgbWluaWZpZXIgaXMgZXhlY3V0ZWQgYnkgY29tbWFuZCBvciBhZnRlciBtaW5pZnkgb24gc2F2ZSwgc28gdGhpcyBjb2RlIG11c3RcbiAgICAgICAgICAgICMgYmUgcGxhY2VkIGFib3ZlIHRoZSBjb2RlIGJlZm9yZVxuICAgICAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgZXJyb3IsIHRydWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIEBzZXR1cElucHV0RmlsZShmaWxlbmFtZSlcbiAgICAgICAgICAgIGlmIChlcnJvck1lc3NhZ2UgPSBAdmFsaWRhdGVJbnB1dEZpbGUoKSkgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgZXJyb3JNZXNzYWdlLCB0cnVlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIElmIGNvbnRlbnQgdHlwZSBjYW5ub3QgYXV0b21hdGljYWxseSBiZSBkZXRlY3RlZCwgdXNlciBpcyBhc2tlZCBmb3IgY29udGVudCB0eXBlLiBJZiBoZVxuICAgICAgICAgICAgIyBjYW5jZWxzIHRoZSByZXF1ZXN0LCBhIHdhcm5pbmcgaXMgc2hvd24sIGVsc2UgaWYgY29udGVudCB0eXBlIGlzIGZhbHNlLCBubyBtZXNzYWdlXG4gICAgICAgICAgICAjIGlzIGRpc3BsYXkgYW5kIG9ubHkgdGhlIGZpbmlzaGVkIGV2ZW50IGlzIGVtaXR0ZWRcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPSBAZGV0ZWN0Q29udGVudFR5cGUoKSkgaW4gW2ZhbHNlLCAnY2FuY2VsbGVkJ11cbiAgICAgICAgICAgICAgICBpZiByZXN1bHQgaXMgJ2NhbmNlbGxlZCdcbiAgICAgICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCd3YXJuaW5nJywgJ0ludmFsaWQgY29udGVudCB0eXBlLiBNaW5pZmljYXRpb24gY2FuY2VsbGVkIScsIHRydWUpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuXG4gICAgICAgICAgICBAZW1pdFN0YXJ0KClcblxuICAgICAgICAgICAgIyBJZiBhIGZpbGUgc2hvdWxkIGJlIG1pbmlmaWVkIHRvIGFub3RoZXIsIHRoZSBmaWxlIG11c3QgYmUgc2F2ZWQsIGVsc2Ugb25seSBkaXJlY3RcbiAgICAgICAgICAgICMgbWluaWZpY2F0aW9uIGlzIGF2YWlsYWJsZS4gVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyB0aGF0IGJ1aWxkaW5nIGEgbWluaWZpZWRcbiAgICAgICAgICAgICMgZmlsZW5hbWUgaXMgYmFzZWQgb24gdGhlIGV4aXN0YW50IGZpbGVuYW1lXG4gICAgICAgICAgICBpZiBAaXNNaW5pZnlUb0ZpbGUoKSBhbmQgKG5vdCBAZW5zdXJlRmlsZUlzU2F2ZWQoKSBvciBub3QgQGNoZWNrQWxyZWFkeU1pbmlmaWVkRmlsZSgpKVxuICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnd2FybmluZycsICdNaW5pZmljYXRpb24gY2FuY2VsbGVkIScpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIEB1cGRhdGVPcHRpb25zQnlJbmxpbmVQYXJhbWV0ZXJzKHBhcmFtcylcbiAgICAgICAgICAgIEBzZXR1cE91dHB1dEZpbGUoKVxuXG4gICAgICAgICAgICBpZiBAaXNNaW5pZnlUb0ZpbGUoKSBhbmQgbm90IEBjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzKClcbiAgICAgICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZW5zdXJlT3V0cHV0RGlyZWN0b3J5RXhpc3RzKClcblxuICAgICAgICAgICAgICAgIGlmIEBvcHRpb25zLmNvbXByZXNzIGlzbnQgdW5kZWZpbmVkIGFuZCBAb3B0aW9ucy5jb21wcmVzcyBpcyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAjIE9ubHkgd3JpdGUgdW5taW5pZmllZCB0ZXh0IGlmIHRhcmdldCBpcyBhIGZpbGUsIGVsc2UgaXQgZG9lcyBub3QgbWFrZVxuICAgICAgICAgICAgICAgICAgICAjIGFueSBzZW5zZVxuICAgICAgICAgICAgICAgICAgICBpZiBAaXNNaW5pZnlUb0ZpbGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQHdyaXRlVW5taW5pZmllZFRleHQoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ3dhcm5pbmcnLCAnRG8geW91IHRoaW5rIGl0IG1ha2VzIHNlbnNlIHRvIGRpcmVjdGx5IG1pbmlmeSB0byB1bmNvbXByZXNzZWQgY29kZT8nKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQHdyaXRlTWluaWZpZWRUZXh0KClcblxuXG4gICAgZ2V0UGFyYW1ldGVyVGFyZ2V0OiAoKSAtPlxuICAgICAgICBpZiB0eXBlb2YgQHRhcmdldEZpbGVuYW1lIGlzICdzdHJpbmcnXG4gICAgICAgICAgICByZXR1cm4gQHRhcmdldEZpbGVuYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuXG4gICAgcHJvaGliaXRNaW5pZmljYXRpb25PblNhdmU6IChwYXJhbXMpIC0+XG4gICAgICAgIGlmIHBhcmFtcy5taW5pZnlPblNhdmUgaW4gW3RydWUsIGZhbHNlXVxuICAgICAgICAgICAgQG9wdGlvbnMubWluaWZ5T25TYXZlID0gcGFyYW1zLm1pbmlmeU9uU2F2ZVxuICAgICAgICBlbHNlIGlmIHBhcmFtcy5taW5PblNhdmUgaW4gW3RydWUsIGZhbHNlXVxuICAgICAgICAgICAgQG9wdGlvbnMubWluaWZ5T25TYXZlID0gcGFyYW1zLm1pbk9uU2F2ZVxuICAgICAgICByZXR1cm4gbm90IEBvcHRpb25zLm1pbmlmeU9uU2F2ZVxuXG5cbiAgICB2YWxpZGF0ZUlucHV0RmlsZTogKCkgLT5cbiAgICAgICAgZXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgIyBJZiBubyBpbnB1dEZpbGUucGF0aCBpcyBnaXZlbiwgdGhlbiB3ZSBjYW5ub3QgY29tcGlsZSB0aGUgZmlsZSBvciBjb250ZW50LFxuICAgICAgICAjIGJlY2F1c2Ugc29tZXRoaW5nIGlzIHdyb25nXG4gICAgICAgIGlmIG5vdCBAaW5wdXRGaWxlLnBhdGhcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIGZpbGU6ICcgKyBAaW5wdXRGaWxlLnBhdGhcblxuICAgICAgICBpZiBub3QgZnMuZXhpc3RzU3luYyhAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmlsZSBkb2VzIG5vdCBleGlzdDogJyArIEBpbnB1dEZpbGUucGF0aFxuXG4gICAgICAgIHJldHVybiBlcnJvck1lc3NhZ2VcblxuXG4gICAgc2V0dXBJbnB1dEZpbGU6IChmaWxlbmFtZSA9IG51bGwpIC0+XG4gICAgICAgIEBpbnB1dEZpbGUgPVxuICAgICAgICAgICAgaXNUZW1wb3Jhcnk6IGZhbHNlXG5cbiAgICAgICAgaWYgZmlsZW5hbWVcbiAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IGZpbGVuYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBhY3RpdmVFZGl0b3JcblxuICAgICAgICAgICAgaWYgQGlzTWluaWZ5RGlyZWN0KClcbiAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBGaWxlLmdldFRlbXBvcmFyeUZpbGVuYW1lKCdhdG9tLW1pbmlmeS5pbnB1dC4nKVxuICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUuaXNUZW1wb3JhcnkgPSB0cnVlXG4gICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhAaW5wdXRGaWxlLnBhdGgsIGFjdGl2ZUVkaXRvci5nZXRUZXh0KCkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gYWN0aXZlRWRpdG9yLmdldFVSSSgpXG4gICAgICAgICAgICAgICAgaWYgbm90IEBpbnB1dEZpbGUucGF0aFxuICAgICAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBAYXNrRm9yU2F2aW5nVW5zYXZlZEZpbGVJbkFjdGl2ZUVkaXRvcigpXG5cblxuICAgIGFza0ZvclNhdmluZ1Vuc2F2ZWRGaWxlSW5BY3RpdmVFZGl0b3I6ICgpIC0+XG4gICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91IHdhbnQgdG8gbWluaWZ5IGEgdW5zYXZlZCBmaWxlIHRvIGEgbWluaWZpZWQgZmlsZSwgYnV0IHlvdSBoYXZlIHRvIHNhdmUgaXQgYmVmb3JlLiBEbyB5b3Ugd2FudCB0byBzYXZlIHRoZSBmaWxlP1wiXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiQWx0ZXJuYXRpdmx5IHlvdSBjYW4gdXNlICdEaXJlY3QgTWluaWZpY2F0aW9uJyBmb3IgbWluaWZ5aW5nIGZpbGUuXCJcbiAgICAgICAgICAgIGJ1dHRvbnM6IFtcIlNhdmVcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgaWYgZGlhbG9nUmVzdWx0QnV0dG9uIGlzIDBcbiAgICAgICAgICAgIGZpbGVuYW1lID0gYXRvbS5zaG93U2F2ZURpYWxvZ1N5bmMoKVxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgYWN0aXZlRWRpdG9yLnNhdmVBcyhmaWxlbmFtZSlcbiAgICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAgICAgIyBkbyBub3RoaW5nIGlmIHNvbWV0aGluZyBmYWlscyBiZWNhdXNlIGdldFVSSSgpIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCwgaWZcbiAgICAgICAgICAgICAgICAjIGZpbGUgaXMgbm90IHNhdmVkXG5cbiAgICAgICAgICAgIGZpbGVuYW1lID0gYWN0aXZlRWRpdG9yLmdldFVSSSgpXG4gICAgICAgICAgICByZXR1cm4gZmlsZW5hbWVcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuICAgIGRldGVjdENvbnRlbnRUeXBlOiAoKSAtPlxuICAgICAgICBAY29udGVudFR5cGUgPSB1bmRlZmluZWRcblxuICAgICAgICAjIFdlIGRvbid0IHJldHVybiBpZiBpbnB1dEZpbGUucGF0aCBpcyBlbXB0eSBiZWNhdXNlIHVzZXIgeW91IHNob3VsZCBiZSBhYmxlIHRvIG1pbmlmeVxuICAgICAgICAjIHRleHQgb2YgYSBuZXcgb3BlbmVkLCBidXQgdW5zYXZlZCB0YWJcbiAgICAgICAgaWYgQGlzTWluaWZ5RGlyZWN0KClcbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgaWYgYWN0aXZlRWRpdG9yIGFuZCBhY3RpdmVFZGl0b3IuZ2V0VVJJKClcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGFjdGl2ZUVkaXRvci5nZXRVUkkoKVxuICAgICAgICAgICAgICAgIGlmIGZpbGVuYW1lIGFuZCBmcy5leGlzdHNTeW5jKGZpbGVuYW1lKVxuICAgICAgICAgICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGVsc2UgaWYgQGlucHV0RmlsZS5wYXRoXG4gICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKEBpbnB1dEZpbGUucGF0aCkudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICMgRGV0ZWN0IGNvbnRlbnQgdHlwZSBieSBmaWxlIGV4dGVuc2lvbiBvciBhc2sgdXNlclxuICAgICAgICAjIEJVVCB3ZSBvbmx5IGFzayB0aGUgdXNlciB0byBzZWxlY3QgY29udGVudCB0eXBlLCBpZiBtaW5pZmljYXRpb24gaXMgbm90IHN0YXJ0ZXQgdmlhXG4gICAgICAgICMgc2F2aW5nIGZpbGVcbiAgICAgICAgc3dpdGNoIGZpbGVFeHRlbnNpb25cbiAgICAgICAgICAgIHdoZW4gJy5jc3MnIHRoZW4gQGNvbnRlbnRUeXBlID0gJ2NzcydcbiAgICAgICAgICAgIHdoZW4gJy5qcycgdGhlbiBAY29udGVudFR5cGUgPSAnanMnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgbm90IEBpc01pbmlmeU9uU2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgIEBjb250ZW50VHlwZSA9IEBhc2tGb3JDb250ZW50VHlwZSgpXG5cbiAgICAgICAgIyBJZiBjb250ZW50VHlwZSBpcyBmYWxzZSB0aGVuIFwiQXNrIGZvciBjb250ZW50IHR5cGVcIiBkaWFsb2cgd2FzIGNhbmNlbGxlZCBieSB1c2VyXG4gICAgICAgIGlmIEBjb250ZW50VHlwZSBpcyBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuICdjYW5jZWxsZWQnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBAY29udGVudFR5cGUgaXNudCB1bmRlZmluZWRcblxuXG4gICAgYXNrRm9yQ29udGVudFR5cGU6ICgpIC0+XG4gICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCJDYW4gbm90IGRldGVjdCBjb250ZW50IHR5cGUuIFRlbGwgbWUgd2hpY2ggbWluaWZpZXIgc2hvdWxkIGJlIHVzZWQgZm9yIG1pbmlmaWNhdGlvbj9cIlxuICAgICAgICAgICAgYnV0dG9uczogW1wiQ1NTXCIsIFwiSlNcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgc3dpdGNoIGRpYWxvZ1Jlc3VsdEJ1dHRvblxuICAgICAgICAgICAgd2hlbiAwIHRoZW4gdHlwZSA9ICdjc3MnXG4gICAgICAgICAgICB3aGVuIDEgdGhlbiB0eXBlID0gJ2pzJ1xuICAgICAgICAgICAgZWxzZSB0eXBlID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIHR5cGVcblxuXG4gICAgZW5zdXJlRmlsZUlzU2F2ZWQ6ICgpIC0+XG4gICAgICAgIGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICAgIGZvciBlZGl0b3IgaW4gZWRpdG9yc1xuICAgICAgICAgICAgaWYgZWRpdG9yIGFuZCBlZGl0b3IuZ2V0VVJJIGFuZCBlZGl0b3IuZ2V0VVJJKCkgaXMgQGlucHV0RmlsZS5wYXRoIGFuZCBlZGl0b3IuaXNNb2RpZmllZCgpXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCInI3tmaWxlbmFtZX0nIGhhcyBjaGFuZ2VzLCBkbyB5b3Ugd2FudCB0byBzYXZlIHRoZW0/XCJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkluIG9yZGVyIHRvIG1pbmlmeSBhIGZpbGUgeW91IGhhdmUgdG8gc2F2ZSBjaGFuZ2VzLlwiXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIlNhdmUgYW5kIG1pbmlmeVwiLCBcIkNhbmNlbFwiXVxuICAgICAgICAgICAgICAgIGlmIGRpYWxvZ1Jlc3VsdEJ1dHRvbiBpcyAwXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgIHJldHVybiB0cnVlXG5cblxuICAgIGNoZWNrQWxyZWFkeU1pbmlmaWVkRmlsZTogKCkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuY2hlY2tBbHJlYWR5TWluaWZpZWRGaWxlXG4gICAgICAgICAgICBpZiAvXFwuKD86bWlufG1pbmlmaWVkfGNvbXByZXNzZWQpXFwuL2kuZXhlYyhAaW5wdXRGaWxlLnBhdGgpIGlzbnQgbnVsbFxuICAgICAgICAgICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBmaWxlbmFtZSBpbmRpY2F0ZXMgdGhhdCBjb250ZW50IGlzIGFscmVhZHkgbWluaWZpZWQuIE1pbmlmeSBhZ2Fpbj9cIlxuICAgICAgICAgICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiVGhlIGZpbGVuYW1lIGNvbnRhaW5zIG9uZSBvZiB0aGUgZm9sbG93aW5nIHBhcnRzOiAnLm1pbi4nLCAnLm1pbmlmaWVkLicsICcuY29tcHJlc3NlZC4nXCJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1wiTWluaWZ5XCIsIFwiQ2FuY2VsXCJdXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpYWxvZ1Jlc3VsdEJ1dHRvbiBpcyAwXG4gICAgICAgIHJldHVybiB0cnVlXG5cblxuICAgIHVwZGF0ZU9wdGlvbnNCeUlubGluZVBhcmFtZXRlcnM6IChwYXJhbXMpIC0+XG4gICAgICAgICMgY29tcHJlc3MgLyB1bmNvbXByZXNzZWRcbiAgICAgICAgaWYgcGFyYW1zLmNvbXByZXNzIGlzIGZhbHNlIG9yIHBhcmFtcy51bmNvbXByZXNzZWQgaXMgdHJ1ZVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcHJlc3MgPSBmYWxzZVxuXG4gICAgICAgICMgZmlsZW5hbWUgcGF0dGVyblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmZpbGVuYW1lUGF0dGVybiBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmZpbGVuYW1lUGF0dGVybi5sZW5ndGggPiAwXG4gICAgICAgICAgICBzd2l0Y2ggQGNvbnRlbnRUeXBlXG4gICAgICAgICAgICAgICAgd2hlbiAnY3NzJyB0aGVuIEBvcHRpb25zLmNzc01pbmlmaWVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIHdoZW4gJ2pzJyB0aGVuIEBvcHRpb25zLmpzTWluaWZpZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMuZmlsZW5hbWVQYXR0ZXJuXG5cbiAgICAgICAgIyBvdXRwdXQgcGF0aFxuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5vdXRwdXRQYXRoIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMub3V0cHV0UGF0aC5sZW5ndGggPiAwKSBvciAodHlwZW9mIEBvcHRpb25zLm91dHB1dFBhdGggaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLm91dHB1dFBhdGgubGVuZ3RoID4gMClcbiAgICAgICAgICAgIEBlbWl0TWVzc2FnZSgnd2FybmluZycsIFwiUGxlYXNlIGRvIG5vdCB1c2Ugb3V0cHV0UGF0aCBvcHRpb24gYW5kL29yIHBhcmFtZXRlciBhbnkgbW9yZS4gVGhlc2Ugb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWQuIFVzZSBmaWxlbmFtZSBwYXR0ZXJuIG9wdGlvbnMvcGFyYW1ldGVycyBpbnN0ZWFkIVwiKVxuXG4gICAgICAgICMgbWluaWZpZXJcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5taW5pZmllciBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgaXNVbmtub3duTWluaWZpZXIgPSB0cnVlXG4gICAgICAgICAgICBzd2l0Y2ggQGNvbnRlbnRUeXBlXG4gICAgICAgICAgICAgICAgd2hlbiAnY3NzJ1xuICAgICAgICAgICAgICAgICAgICBpZiBwYXJhbXMubWluaWZpZXIgaW4gWydjbGVhbi1jc3MnLCAnY3NzbycsICdzcXdpc2gnLCAneXVpLWNzcyddXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9ucy5jc3NNaW5pZmllciA9IHBhcmFtcy5taW5pZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNVbmtub3duTWluaWZpZXIgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHdoZW4gJ2pzJ1xuICAgICAgICAgICAgICAgICAgICBpZiBwYXJhbXMubWluaWZpZXIgaW4gWydnY2MnLCAndWdsaWZ5LWpzJywgJ3l1aS1qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9ucy5qc01pbmlmaWVyID0gcGFyYW1zLm1pbmlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Vua25vd25NaW5pZmllciA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIGlzVW5rbm93bk1pbmlmaWVyXG4gICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlKCd3YXJuaW5nJywgXCJVbmtub3duIG1pbmlmaWVyICcje3BhcmFtcy5taW5pZmllcn0nIGluIGZpcnN0LWxpbmUtcGFyYW1ldGVyczsgdXNpbmcgZGVmYXVsdCBtaW5pZmllciBmb3IgbWluaWZpY2F0aW9uXCIpXG5cbiAgICAgICAgIyBtaW5pZmllciBvcHRpb25zXG4gICAgICAgIG1pbmlmaWVyT3B0aW9uc1BhcnNlciA9IG5ldyBBdG9tTWluaWZ5TWluaWZpZXJPcHRpb25zUGFyc2VyKClcbiAgICAgICAgQG9wdGlvbnMubWluaWZpZXJPcHRpb25zID0gbWluaWZpZXJPcHRpb25zUGFyc2VyLnBhcnNlKEBjb250ZW50VHlwZSwgQG9wdGlvbnMsIHBhcmFtcylcblxuICAgICAgICAjIGJ1ZmZlclxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmJ1ZmZlciBpcyAnbnVtYmVyJ1xuICAgICAgICAgICAgaWYgcGFyYW1zLmJ1ZmZlciA+PSAxMDI0ICogMTAyNFxuICAgICAgICAgICAgICAgIEBvcHRpb25zLmJ1ZmZlciA9IHBhcmFtcy5idWZmZXJcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2UoJ3dhcm5pbmcnLCAnUGFyYW1ldGVyIFxcJ2J1ZmZlclxcJyBtdXN0IGJlIGdyZWF0ZXIgb3IgZXF1YWwgdGhhbiAxMDI0ICogMTAyNCcpXG5cblxuICAgIHNldHVwT3V0cHV0RmlsZTogKCkgLT5cbiAgICAgICAgQG91dHB1dEZpbGUgPVxuICAgICAgICAgICAgaXNUZW1wb3Jhcnk6IGZhbHNlXG5cbiAgICAgICAgaWYgQGlzTWluaWZ5RGlyZWN0KClcbiAgICAgICAgICAgIEBvdXRwdXRGaWxlLnBhdGggPSBGaWxlLmdldFRlbXBvcmFyeUZpbGVuYW1lKCdhdG9tLW1pbmlmeS5vdXRwdXQuJywgbnVsbCwgQGNvbnRlbnRUeXBlKVxuICAgICAgICAgICAgQG91dHB1dEZpbGUuaXNUZW1wb3JhcnkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAjIHdlIG5lZWQgdGhlIGZpbGUgZXh0ZW5zaW9uIHdpdGhvdXQgdGhlIGRvdCFcbiAgICAgICAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoYmFzZW5hbWUpLnJlcGxhY2UoJy4nLCAnJylcblxuICAgICAgICAgICAgc3dpdGNoIEBjb250ZW50VHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gJ2NzcycgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMuY3NzTWluaWZpZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgICAgICAgICB3aGVuICdqcycgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMuanNNaW5pZmllZEZpbGVuYW1lUGF0dGVyblxuICAgICAgICAgICAgICAgIGVsc2UgcGF0dGVybiA9IEBkZWZhdWx0T3V0cHV0RmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgICAgICBiYXNlbmFtZSA9IGJhc2VuYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiguKj8pXFwuKCcgKyBmaWxlRXh0ZW5zaW9uICsgJykkJywgJ2dpJyksIHBhdHRlcm4pXG5cbiAgICAgICAgICAgICMgSWYgdGhlcmUgaXMgbm8gZmlsZSBleHRlbnNpb24gYXQgdGhlIHNvdXJjZSBmaWxlbmFtZSwgd2UgYWRkIHRoZSBjb3JyZWN0IGV4dGVuc2lvbiB0b1xuICAgICAgICAgICAgIyB0aGUgb3V0cHV0IGZpbGVuYW1lXG4gICAgICAgICAgICBpZiBmaWxlRXh0ZW5zaW9uIGlzICcnXG4gICAgICAgICAgICAgICAgYmFzZW5hbWUgKz0gQGNvbnRlbnRUeXBlXG5cbiAgICAgICAgICAgIG91dHB1dEZpbGUgPSBiYXNlbmFtZVxuICAgICAgICAgICAgaWYgbm90IHBhdGguaXNBYnNvbHV0ZShwYXRoLmRpcm5hbWUob3V0cHV0RmlsZSkpXG4gICAgICAgICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguZGlybmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgb3V0cHV0RmlsZSA9IHBhdGguam9pbihvdXRwdXRQYXRoLCBvdXRwdXRGaWxlKVxuXG4gICAgICAgICAgICBAb3V0cHV0RmlsZS5wYXRoID0gb3V0cHV0RmlsZVxuXG5cbiAgICBjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzOiAoKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5jaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzXG4gICAgICAgICAgICBpZiBmcy5leGlzdHNTeW5jKEBvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIG91dHB1dCBmaWxlIGFscmVhZHkgZXhpc3RzLiBEbyB5b3Ugd2FudCB0byBvdmVyd3JpdGUgaXQ/XCJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIk91dHB1dCBmaWxlOiAnI3tAb3V0cHV0RmlsZS5wYXRofSdcIlxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPdmVyd3JpdGVcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nUmVzdWx0QnV0dG9uIGlzIDBcbiAgICAgICAgcmV0dXJuIHRydWVcblxuXG4gICAgZW5zdXJlT3V0cHV0RGlyZWN0b3J5RXhpc3RzOiAoKSAtPlxuICAgICAgICBpZiBAaXNNaW5pZnlUb0ZpbGUoKVxuICAgICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguZGlybmFtZShAb3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgRmlsZS5lbnN1cmVEaXJlY3RvcnlFeGlzdHMob3V0cHV0UGF0aClcblxuXG4gICAgd3JpdGVVbm1pbmlmaWVkVGV4dDogKCkgLT5cbiAgICAgICAgZHVtbXlNaW5pZmllck5hbWUgPSAndW5jb21wcmVzc2VkJ1xuICAgICAgICB0cnlcbiAgICAgICAgICAgIHN0YXJ0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhAb3V0cHV0RmlsZS5wYXRoLCBhY3RpdmVFZGl0b3IuZ2V0VGV4dCgpKVxuXG4gICAgICAgICAgICBzdGF0aXN0aWNzID1cbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICBiZWZvcmU6IEZpbGUuZ2V0RmlsZVNpemUoQGlucHV0RmlsZS5wYXRoKSxcbiAgICAgICAgICAgICAgICBhZnRlcjogRmlsZS5nZXRGaWxlU2l6ZShAb3V0cHV0RmlsZS5wYXRoKVxuXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0KCdzdWNjZXNzJywgQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoeyBtaW5pZmllck5hbWU6IGR1bW15TWluaWZpZXJOYW1lLCBzdGF0aXN0aWNzOiBzdGF0aXN0aWNzIH0pKVxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCgnZXJyb3InLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycyh7IG1pbmlmaWVyTmFtZTogZHVtbXlNaW5pZmllck5hbWUsIG1lc3NhZ2U6IGVycm9yIH0pKVxuXG4gICAgICAgIEBlbWl0RmluaXNoZWQoKVxuXG5cbiAgICB3cml0ZU1pbmlmaWVkVGV4dDogKCkgLT5cbiAgICAgICAgbWluaWZpZXIgPSBAYnVpbGRNaW5pZmllckluc3RhbmNlKClcbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBzdGFydFRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICAgICAgICBtaW5pZmllci5taW5pZnkgQGlucHV0RmlsZS5wYXRoLCBAb3V0cHV0RmlsZS5wYXRoLCAobWluaWZpZWRUZXh0LCBlcnJvcikgPT5cbiAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZSgnZXJyb3InLCBlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGlzdGljcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lc3RhbXBcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQGlzTWluaWZ5RGlyZWN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIENhbGMgc2F2aW5nIEJFRk9SRSB3ZSBlZGl0IHRoZSB0ZXh0IGVkaXRvcnMgdGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MuYmVmb3JlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0aXN0aWNzLmFmdGVyID0gbWluaWZpZWRUZXh0Lmxlbmd0aFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBBcHBseSB0ZXh0IGJ1dCBkbyBOT1Qgc2F2ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRUZXh0KG1pbmlmaWVkVGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0aXN0aWNzLmJlZm9yZSA9IEZpbGUuZ2V0RmlsZVNpemUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MuYWZ0ZXIgPSBGaWxlLmdldEZpbGVTaXplKEBvdXRwdXRGaWxlLnBhdGgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQoJ3N1Y2Nlc3MnLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycyh7IG1pbmlmaWVyTmFtZSA6IG1pbmlmaWVyLmdldE5hbWUoKSwgc3RhdGlzdGljczogc3RhdGlzdGljcyB9KSlcbiAgICAgICAgICAgICAgICBmaW5hbGx5XG4gICAgICAgICAgICAgICAgICAgIEBkZWxldGVUZW1wb3JhcnlGaWxlcygpXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0KCdlcnJvcicsIEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKHsgbWluaWZpZXJOYW1lIDogbWluaWZpZXIuZ2V0TmFtZSgpLCBtZXNzYWdlOiBlLnRvU3RyaW5nKCkgfSkpXG4gICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcblxuXG4gICAgZW1pdFN0YXJ0OiAoKSAtPlxuICAgICAgICBAZW1pdHRlci5lbWl0KCdzdGFydCcsIEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKCkpXG5cblxuICAgIGVtaXRGaW5pc2hlZDogKCkgLT5cbiAgICAgICAgQGRlbGV0ZVRlbXBvcmFyeUZpbGVzKClcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCgnZmluaXNoZWQnLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycygpKVxuXG5cbiAgICBlbWl0TWVzc2FnZTogKHR5cGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQodHlwZSwgQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoeyBtZXNzYWdlOiBtZXNzYWdlIH0pKVxuXG5cbiAgICBlbWl0TWVzc2FnZUFuZEZpbmlzaDogKHR5cGUsIG1lc3NhZ2UsIGVtaXRTdGFydEV2ZW50ID0gZmFsc2UpIC0+XG4gICAgICAgIGlmIGVtaXRTdGFydEV2ZW50XG4gICAgICAgICAgICBAZW1pdFN0YXJ0KClcbiAgICAgICAgQGVtaXRNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpXG4gICAgICAgIEBlbWl0RmluaXNoZWQoKVxuXG5cbiAgICBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzOiAoYWRkaXRpb25hbFBhcmFtZXRlcnMgPSB7fSkgLT5cbiAgICAgICAgcGFyYW1ldGVycyA9XG4gICAgICAgICAgICBpc01pbmlmeVRvRmlsZTogQGlzTWluaWZ5VG9GaWxlKCksXG4gICAgICAgICAgICBpc01pbmlmeURpcmVjdDogQGlzTWluaWZ5RGlyZWN0KCksXG5cbiAgICAgICAgaWYgQGlucHV0RmlsZVxuICAgICAgICAgICAgcGFyYW1ldGVycy5pbnB1dEZpbGVuYW1lID0gQGlucHV0RmlsZS5wYXRoXG4gICAgICAgIGlmIEBjb250ZW50VHlwZVxuICAgICAgICAgICAgcGFyYW1ldGVycy5jb250ZW50VHlwZSA9IEBjb250ZW50VHlwZVxuICAgICAgICBpZiBAb3V0cHV0RmlsZVxuICAgICAgICAgICAgcGFyYW1ldGVycy5vdXRwdXRGaWxlbmFtZSA9IEBvdXRwdXRGaWxlLnBhdGhcblxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBhZGRpdGlvbmFsUGFyYW1ldGVyc1xuICAgICAgICAgICAgcGFyYW1ldGVyc1trZXldID0gdmFsdWVcblxuICAgICAgICByZXR1cm4gcGFyYW1ldGVyc1xuXG5cbiAgICBkZWxldGVUZW1wb3JhcnlGaWxlczogLT5cbiAgICAgICAgaWYgQGlucHV0RmlsZSBhbmQgQGlucHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgRmlsZS5kZWxldGUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICBpZiBAb3V0cHV0RmlsZSBhbmQgQG91dHB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgIEZpbGUuZGVsZXRlKEBvdXRwdXRGaWxlLnBhdGgpXG5cblxuICAgIGJ1aWxkTWluaWZpZXJJbnN0YW5jZTogKCkgLT5cbiAgICAgICAgc3dpdGNoIEBjb250ZW50VHlwZVxuICAgICAgICAgICAgd2hlbiAnY3NzJyB0aGVuIG1vZHVsZU5hbWUgPSBAb3B0aW9ucy5jc3NNaW5pZmllclxuICAgICAgICAgICAgd2hlbiAnanMnIHRoZW4gbW9kdWxlTmFtZSA9IEBvcHRpb25zLmpzTWluaWZpZXJcblxuICAgICAgICBtaW5pZmllckNsYXNzID0gcmVxdWlyZShcIi4vbWluaWZpZXIvI3tAY29udGVudFR5cGV9LyN7bW9kdWxlTmFtZX1cIilcbiAgICAgICAgbWluaWZpZXIgPSBuZXcgbWluaWZpZXJDbGFzcyhAb3B0aW9ucylcblxuICAgICAgICByZXR1cm4gbWluaWZpZXJcblxuXG4gICAgaXNNaW5pZnlPblNhdmU6IC0+XG4gICAgICAgIHJldHVybiBAbWluaWZ5T25TYXZlXG5cblxuICAgIGlzTWluaWZ5RGlyZWN0OiAtPlxuICAgICAgICByZXR1cm4gQG1vZGUgaXMgQXRvbU1pbmlmaWVyLk1JTklGWV9ESVJFQ1RcblxuXG4gICAgaXNNaW5pZnlUb0ZpbGU6IC0+XG4gICAgICAgIHJldHVybiBAbW9kZSBpcyBBdG9tTWluaWZpZXIuTUlOSUZZX1RPX01JTl9GSUxFXG5cblxuICAgIG9uU3RhcnQ6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ3N0YXJ0JywgY2FsbGJhY2tcblxuXG4gICAgb25TdWNjZXNzOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdzdWNjZXNzJywgY2FsbGJhY2tcblxuXG4gICAgb25XYXJuaW5nOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICd3YXJuaW5nJywgY2FsbGJhY2tcblxuXG4gICAgb25FcnJvcjogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnZXJyb3InLCBjYWxsYmFja1xuXG5cbiAgICBvbkZpbmlzaGVkOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdmaW5pc2hlZCcsIGNhbGxiYWNrXG4iXX0=
