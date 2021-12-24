(function() {
  var CompositeDisposable, Task, Transpiler, fs, languagebabelSchema, path, pathIsInside, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Task = ref.Task, CompositeDisposable = ref.CompositeDisposable;

  path = require('path');

  pathIsInside = require('../node_modules/path-is-inside');

  fs = new Proxy({}, {
    get: function(target, key) {
      if (target.fs == null) {
        target.fs = require('fs-plus');
      }
      return target.fs[key];
    }
  });

  languagebabelSchema = {
    type: 'object',
    properties: {
      babelMapsPath: {
        type: 'string'
      },
      babelMapsAddUrl: {
        type: 'boolean'
      },
      babelSourcePath: {
        type: 'string'
      },
      babelTranspilePath: {
        type: 'string'
      },
      createMap: {
        type: 'boolean'
      },
      createTargetDirectories: {
        type: 'boolean'
      },
      createTranspiledCode: {
        type: 'boolean'
      },
      disableWhenNoBabelrcFileInPath: {
        type: 'boolean'
      },
      keepFileExtension: {
        type: 'boolean'
      },
      projectRoot: {
        type: 'boolean'
      },
      suppressSourcePathMessages: {
        type: 'boolean'
      },
      suppressTranspileOnSaveMessages: {
        type: 'boolean'
      },
      transpileOnSave: {
        type: 'boolean'
      }
    },
    additionalProperties: false
  };

  Transpiler = (function() {
    Transpiler.prototype.fromGrammarName = 'Babel ES6 JavaScript';

    Transpiler.prototype.fromScopeName = 'source.js.jsx';

    Transpiler.prototype.toScopeName = 'source.js.jsx';

    function Transpiler() {
      this.commandTranspileDirectories = bind(this.commandTranspileDirectories, this);
      this.commandTranspileDirectory = bind(this.commandTranspileDirectory, this);
      this.reqId = 0;
      this.babelTranspilerTasks = {};
      this.babelTransformerPath = require.resolve('./transpiler-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
      this.disposables = new CompositeDisposable();
      if (this.getConfig().transpileOnSave || this.getConfig().allowLocalOverride) {
        this.disposables.add(atom.contextMenu.add({
          '.tree-view .directory > .header > .name': [
            {
              label: 'Language-Babel',
              submenu: [
                {
                  label: 'Transpile Directory ',
                  command: 'language-babel:transpile-directory'
                }, {
                  label: 'Transpile Directories',
                  command: 'language-babel:transpile-directories'
                }
              ]
            }, {
              'type': 'separator'
            }
          ]
        }));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directory', this.commandTranspileDirectory));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directories', this.commandTranspileDirectories));
      }
    }

    Transpiler.prototype.transform = function(code, arg) {
      var babelOptions, config, filePath, msgObject, pathTo, reqId, sourceMap;
      filePath = arg.filePath, sourceMap = arg.sourceMap;
      config = this.getConfig();
      pathTo = this.getPaths(filePath, config);
      this.createTask(pathTo.projectPath);
      babelOptions = {
        filename: filePath,
        ast: false
      };
      if (sourceMap) {
        babelOptions.sourceMaps = sourceMap;
      }
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpileCode',
          pathTo: pathTo,
          code: code,
          babelOptions: babelOptions
        };
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var err;
          try {
            _this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
          } catch (error) {
            err = error;
            delete _this.babelTranspilerTasks[pathTo.projectPath];
            reject("Error " + err + " sending to transpile task with PID " + _this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          }
          return _this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, function(msgRet) {
            if (msgRet.err != null) {
              return reject("Babel v" + msgRet.babelVersion + "\n" + msgRet.err.message + "\n" + msgRet.babelCoreUsed);
            } else {
              msgRet.sourceMap = msgRet.map;
              return resolve(msgRet);
            }
          });
        };
      })(this));
    };

    Transpiler.prototype.commandTranspileDirectory = function(arg) {
      var target;
      target = arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path
      });
    };

    Transpiler.prototype.commandTranspileDirectories = function(arg) {
      var target;
      target = arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path,
        recursive: true
      });
    };

    Transpiler.prototype.transpileDirectory = function(options) {
      var directory, recursive;
      directory = options.directory;
      recursive = options.recursive || false;
      return fs.readdir(directory, (function(_this) {
        return function(err, files) {
          if (err == null) {
            return files.map(function(file) {
              var fqFileName;
              fqFileName = path.join(directory, file);
              return fs.stat(fqFileName, function(err, stats) {
                if (err == null) {
                  if (stats.isFile()) {
                    if (/\.min\.[a-z]+$/.test(fqFileName)) {
                      return;
                    }
                    if (/\.(js|jsx|es|es6|babel|mjs)$/.test(fqFileName)) {
                      return _this.transpile(file, null, _this.getConfigAndPathTo(fqFileName));
                    }
                  } else if (recursive && stats.isDirectory()) {
                    return _this.transpileDirectory({
                      directory: fqFileName,
                      recursive: true
                    });
                  }
                }
              });
            });
          }
        };
      })(this));
    };

    Transpiler.prototype.transpile = function(sourceFile, textEditor, configAndPathTo) {
      var babelOptions, config, err, msgObject, pathTo, ref1, reqId;
      if (configAndPathTo != null) {
        config = configAndPathTo.config, pathTo = configAndPathTo.pathTo;
      } else {
        ref1 = this.getConfigAndPathTo(sourceFile), config = ref1.config, pathTo = ref1.pathTo;
      }
      if (config.transpileOnSave !== true) {
        return;
      }
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('LB: Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config);
      this.cleanNotifications(pathTo);
      this.createTask(pathTo.projectPath);
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        try {
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        } catch (error) {
          err = error;
          console.log("Error " + err + " sending to transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          delete this.babelTranspilerTasks[pathTo.projectPath];
          this.createTask(pathTo.projectPath);
          console.log("Restarted transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        }
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var f, mapJson, ref2, ref3, ref4;
            if ((ref2 = msgRet.result) != null ? ref2.ignored : void 0) {
              return;
            }
            if (msgRet.err) {
              if (msgRet.err.stack) {
                return _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel Transpiler Error", {
                  dismissable: true,
                  detail: msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.stack
                });
              } else {
                _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                  dismissable: true,
                  detail: msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
                });
                if ((((ref3 = msgRet.err.loc) != null ? ref3.line : void 0) != null) && (textEditor != null ? textEditor.alive : void 0)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column]);
                }
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: pathTo.sourceFile + "\n \n" + msgRet.babelCoreUsed
                });
              }
              if (!config.createTranspiledCode) {
                if (!config.suppressTranspileOnSaveMessages) {
                  atom.notifications.addInfo('LB: No transpiled output configured');
                }
                return;
              }
              if (pathTo.sourceFile === pathTo.transpiledFile) {
                atom.notifications.addWarning('LB: Transpiled file would overwrite source file. Aborted!', {
                  dismissable: true,
                  detail: pathTo.sourceFile
                });
                return;
              }
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
              }
              if (config.babelMapsAddUrl) {
                f = path.join(path.relative(pathTo.transpiledFileDir, pathTo.mapFileDir), pathTo.mapFileName).split(path.sep).join('/');
                msgRet.result.code = msgRet.result.code + '\n' + '//# sourceMappingURL=' + f;
              }
              fs.writeFileSync(pathTo.transpiledFile, msgRet.result.code);
              if (config.createMap && ((ref4 = msgRet.result.map) != null ? ref4.version : void 0)) {
                if (config.createTargetDirectories) {
                  fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
                }
                f = path.join(path.relative(pathTo.mapFileDir, pathTo.sourceFileDir), pathTo.sourceFileName).split(path.sep).join('/');
                mapJson = {
                  version: msgRet.result.map.version,
                  sources: [f],
                  file: f,
                  names: msgRet.result.map.names,
                  mappings: msgRet.result.map.mappings
                };
                return fs.writeFileSync(pathTo.mapFile, JSON.stringify(mapJson, null, ' '));
              }
            }
          };
        })(this));
      }
    };

    Transpiler.prototype.cleanNotifications = function(pathTo) {
      var i, n, ref1, results, sf;
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      ref1 = this.transpileErrorNotifications;
      for (sf in ref1) {
        n = ref1[sf];
        if (n.dismissed) {
          delete this.transpileErrorNotifications[sf];
        }
      }
      i = atom.notifications.notifications.length - 1;
      results = [];
      while (i >= 0) {
        if (atom.notifications.notifications[i].dismissed && atom.notifications.notifications[i].message.substring(0, 3) === "LB:") {
          atom.notifications.notifications.splice(i, 1);
        }
        results.push(i--);
      }
      return results;
    };

    Transpiler.prototype.createTask = function(projectPath) {
      var base;
      return (base = this.babelTranspilerTasks)[projectPath] != null ? base[projectPath] : base[projectPath] = Task.once(this.babelTransformerPath, projectPath, (function(_this) {
        return function() {
          return delete _this.babelTranspilerTasks[projectPath];
        };
      })(this));
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      atom.config.unset('language-babel.stopAtProjectDirectory');
      atom.config.unset('language-babel.babelStage');
      atom.config.unset('language-babel.externalHelpers');
      atom.config.unset('language-babel.moduleLoader');
      atom.config.unset('language-babel.blacklistTransformers');
      atom.config.unset('language-babel.whitelistTransformers');
      atom.config.unset('language-babel.looseTransformers');
      atom.config.unset('language-babel.optionalTransformers');
      atom.config.unset('language-babel.plugins');
      atom.config.unset('language-babel.presets');
      return atom.config.unset('language-babel.formatJSX');
    };

    Transpiler.prototype.getBabelOptions = function(config) {
      var babelOptions;
      babelOptions = {
        code: true
      };
      if (config.createMap) {
        babelOptions.sourceMaps = config.createMap;
      }
      return babelOptions;
    };

    Transpiler.prototype.getConfigAndPathTo = function(sourceFile) {
      var config, localConfig, pathTo;
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
      if (config.allowLocalOverride) {
        if (this.jsonSchema == null) {
          this.jsonSchema = (require('../node_modules/jjv'))();
          this.jsonSchema.addSchema('localConfig', languagebabelSchema);
        }
        localConfig = this.getLocalConfig(pathTo.sourceFileDir, pathTo.projectPath, {});
        this.merge(config, localConfig);
        pathTo = this.getPaths(sourceFile, config);
      }
      return {
        config: config,
        pathTo: pathTo
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, isProjectRoot, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
      localConfigFile = '.languagebabel';
      languageBabelCfgFile = path.join(fromDir, localConfigFile);
      if (fs.existsSync(languageBabelCfgFile)) {
        fileContent = fs.readFileSync(languageBabelCfgFile, 'utf8');
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (error) {
          err = error;
          atom.notifications.addError("LB: " + localConfigFile + " " + err.message, {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
          return;
        }
        schemaErrors = this.jsonSchema.validate('localConfig', jsonContent);
        if (schemaErrors) {
          atom.notifications.addError("LB: " + localConfigFile + " configuration error", {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
        } else {
          isProjectRoot = jsonContent.projectRoot;
          this.merge(jsonContent, localConfig);
          if (isProjectRoot) {
            jsonContent.projectRootDir = fromDir;
          }
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        if (isProjectRoot) {
          return localConfig;
        }
        return this.getLocalConfig(path.dirname(fromDir), toDir, localConfig);
      } else {
        return localConfig;
      }
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, fnExt, mapFileName, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath, sourceFileInProject, sourceFileName;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        sourceFileInProject = false;
      } else {
        sourceFileInProject = true;
      }
      if (config.projectRootDir != null) {
        absProjectPath = path.normalize(config.projectRootDir);
      } else if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(path.join(projectContainingSource[0], '.'));
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      if (config.keepFileExtension) {
        fnExt = parsedSourceFile.ext;
      } else {
        fnExt = '.js';
      }
      sourceFileName = parsedSourceFile.name + fnExt;
      mapFileName = parsedSourceFile.name + fnExt + '.map';
      absTranspiledFile = path.normalize(path.join(absTranspileRoot, relSourceRootToSourceFile, sourceFileName));
      absMapFile = path.normalize(path.join(absMapsRoot, relSourceRootToSourceFile, mapFileName));
      return {
        sourceFileInProject: sourceFileInProject,
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        sourceFileName: sourceFileName,
        mapFile: absMapFile,
        mapFileDir: path.parse(absMapFile).dir,
        mapFileName: mapFileName,
        transpiledFile: absTranspiledFile,
        transpiledFileDir: path.parse(absTranspiledFile).dir,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir) {
      var babelrc, babelrcFiles;
      babelrc = ['.babelrc', '.babelrc.js'];
      babelrcFiles = babelrc.map(function(file) {
        return path.join(fromDir, file);
      });
      if (babelrcFiles.some(fs.existsSync)) {
        return true;
      }
      if (fromDir !== path.dirname(fromDir)) {
        return this.isBabelrcInPath(path.dirname(fromDir));
      } else {
        return false;
      }
    };

    Transpiler.prototype.merge = function(targetObj, sourceObj) {
      var prop, results, val;
      results = [];
      for (prop in sourceObj) {
        val = sourceObj[prop];
        results.push(targetObj[prop] = val);
      }
      return results;
    };

    Transpiler.prototype.stopTranspilerTask = function(projectPath) {
      var msgObject;
      msgObject = {
        command: 'stop'
      };
      return this.babelTranspilerTasks[projectPath].send(msgObject);
    };

    Transpiler.prototype.stopAllTranspilerTask = function() {
      var projectPath, ref1, results, v;
      ref1 = this.babelTranspilerTasks;
      results = [];
      for (projectPath in ref1) {
        v = ref1[projectPath];
        results.push(this.stopTranspilerTask(projectPath));
      }
      return results;
    };

    Transpiler.prototype.stopUnusedTasks = function() {
      var atomProjectPath, atomProjectPaths, isTaskInCurrentProject, j, len, projectTaskPath, ref1, results, v;
      atomProjectPaths = atom.project.getPaths();
      ref1 = this.babelTranspilerTasks;
      results = [];
      for (projectTaskPath in ref1) {
        v = ref1[projectTaskPath];
        isTaskInCurrentProject = false;
        for (j = 0, len = atomProjectPaths.length; j < len; j++) {
          atomProjectPath = atomProjectPaths[j];
          if (pathIsInside(projectTaskPath, atomProjectPath)) {
            isTaskInCurrentProject = true;
            break;
          }
        }
        if (!isTaskInCurrentProject) {
          results.push(this.stopTranspilerTask(projectTaskPath));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Transpiler;

  })();

  module.exports = Transpiler;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi90cmFuc3BpbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUZBQUE7SUFBQTs7RUFBQSxNQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLGVBQUQsRUFBTzs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQ0FBUjs7RUFHZixFQUFBLEdBQUssSUFBSSxLQUFKLENBQVUsRUFBVixFQUFjO0lBQ2pCLEdBQUEsRUFBSyxTQUFDLE1BQUQsRUFBUyxHQUFUOztRQUNILE1BQU0sQ0FBQyxLQUFNLE9BQUEsQ0FBUSxTQUFSOzthQUNiLE1BQU0sQ0FBQyxFQUFHLENBQUEsR0FBQTtJQUZQLENBRFk7R0FBZDs7RUFPTCxtQkFBQSxHQUFzQjtJQUNwQixJQUFBLEVBQU0sUUFEYztJQUVwQixVQUFBLEVBQVk7TUFDVixhQUFBLEVBQWtDO1FBQUUsSUFBQSxFQUFNLFFBQVI7T0FEeEI7TUFFVixlQUFBLEVBQWtDO1FBQUUsSUFBQSxFQUFNLFNBQVI7T0FGeEI7TUFHVixlQUFBLEVBQWtDO1FBQUUsSUFBQSxFQUFNLFFBQVI7T0FIeEI7TUFJVixrQkFBQSxFQUFrQztRQUFFLElBQUEsRUFBTSxRQUFSO09BSnhCO01BS1YsU0FBQSxFQUFrQztRQUFFLElBQUEsRUFBTSxTQUFSO09BTHhCO01BTVYsdUJBQUEsRUFBa0M7UUFBRSxJQUFBLEVBQU0sU0FBUjtPQU54QjtNQU9WLG9CQUFBLEVBQWtDO1FBQUUsSUFBQSxFQUFNLFNBQVI7T0FQeEI7TUFRViw4QkFBQSxFQUFrQztRQUFFLElBQUEsRUFBTSxTQUFSO09BUnhCO01BU1YsaUJBQUEsRUFBa0M7UUFBRSxJQUFBLEVBQU0sU0FBUjtPQVR4QjtNQVVWLFdBQUEsRUFB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O0FBQ3pCLGFBQUEsa0RBQUE7O1VBQ0UsSUFBRyxZQUFBLENBQWEsZUFBYixFQUE4QixlQUE5QixDQUFIO1lBQ0Usc0JBQUEsR0FBeUI7QUFDekIsa0JBRkY7O0FBREY7UUFJQSxJQUFHLENBQUksc0JBQVA7dUJBQW1DLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixlQUFwQixHQUFuQztTQUFBLE1BQUE7K0JBQUE7O0FBTkY7O0lBRmU7Ozs7OztFQVVuQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQW5jakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGFzaywgQ29tcG9zaXRlRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xucGF0aElzSW5zaWRlID0gcmVxdWlyZSAnLi4vbm9kZV9tb2R1bGVzL3BhdGgtaXMtaW5zaWRlJ1xuXG4jIExhemlseSByZXF1aXJlIGZzLXBsdXMgdG8gYXZvaWQgYmxvY2tpbmcgc3RhcnR1cC5cbmZzID0gbmV3IFByb3h5KHt9LCB7XG4gIGdldDogKHRhcmdldCwga2V5KSAtPlxuICAgIHRhcmdldC5mcyA/PSByZXF1aXJlICdmcy1wbHVzJ1xuICAgIHRhcmdldC5mc1trZXldXG59KVxuXG4jIHNldHVwIEpTT04gU2NoZW1hIHRvIHBhcnNlIC5sYW5ndWFnZWJhYmVsIGNvbmZpZ3Ncbmxhbmd1YWdlYmFiZWxTY2hlbWEgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFiZWxNYXBzUGF0aDogICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBiYWJlbE1hcHNBZGRVcmw6ICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYm9vbGVhbicgfSxcbiAgICBiYWJlbFNvdXJjZVBhdGg6ICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIGJhYmVsVHJhbnNwaWxlUGF0aDogICAgICAgICAgICAgICB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgY3JlYXRlTWFwOiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgY3JlYXRlVGFyZ2V0RGlyZWN0b3JpZXM6ICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgY3JlYXRlVHJhbnNwaWxlZENvZGU6ICAgICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgZGlzYWJsZVdoZW5Ob0JhYmVscmNGaWxlSW5QYXRoOiAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAga2VlcEZpbGVFeHRlbnNpb246ICAgICAgICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgcHJvamVjdFJvb3Q6ICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgc3VwcHJlc3NTb3VyY2VQYXRoTWVzc2FnZXM6ICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgc3VwcHJlc3NUcmFuc3BpbGVPblNhdmVNZXNzYWdlczogIHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgdHJhbnNwaWxlT25TYXZlOiAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2Jvb2xlYW4nIH1cbiAgfSxcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlXG59XG5cbmNsYXNzIFRyYW5zcGlsZXJcblxuICBmcm9tR3JhbW1hck5hbWU6ICdCYWJlbCBFUzYgSmF2YVNjcmlwdCdcbiAgZnJvbVNjb3BlTmFtZTogJ3NvdXJjZS5qcy5qc3gnXG4gIHRvU2NvcGVOYW1lOiAnc291cmNlLmpzLmpzeCdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcmVxSWQgPSAwXG4gICAgQGJhYmVsVHJhbnNwaWxlclRhc2tzID0ge31cbiAgICBAYmFiZWxUcmFuc2Zvcm1lclBhdGggPSByZXF1aXJlLnJlc29sdmUgJy4vdHJhbnNwaWxlci10YXNrJ1xuICAgIEB0cmFuc3BpbGVFcnJvck5vdGlmaWNhdGlvbnMgPSB7fVxuICAgIEBkZXByZWNhdGVDb25maWcoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBpZiBAZ2V0Q29uZmlnKCkudHJhbnNwaWxlT25TYXZlIG9yIEBnZXRDb25maWcoKS5hbGxvd0xvY2FsT3ZlcnJpZGVcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb250ZXh0TWVudS5hZGQge1xuICAgICAgICAnLnRyZWUtdmlldyAuZGlyZWN0b3J5ID4gLmhlYWRlciA+IC5uYW1lJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ0xhbmd1YWdlLUJhYmVsJ1xuICAgICAgICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAgICAgICAge2xhYmVsOiAnVHJhbnNwaWxlIERpcmVjdG9yeSAnLCBjb21tYW5kOiAnbGFuZ3VhZ2UtYmFiZWw6dHJhbnNwaWxlLWRpcmVjdG9yeSd9XG4gICAgICAgICAgICAgICAge2xhYmVsOiAnVHJhbnNwaWxlIERpcmVjdG9yaWVzJywgY29tbWFuZDogJ2xhbmd1YWdlLWJhYmVsOnRyYW5zcGlsZS1kaXJlY3Rvcmllcyd9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHsndHlwZSc6ICdzZXBhcmF0b3InIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmRpcmVjdG9yeSA+IC5oZWFkZXIgPiAubmFtZScsICdsYW5ndWFnZS1iYWJlbDp0cmFuc3BpbGUtZGlyZWN0b3J5JywgQGNvbW1hbmRUcmFuc3BpbGVEaXJlY3RvcnlcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmRpcmVjdG9yeSA+IC5oZWFkZXIgPiAubmFtZScsICdsYW5ndWFnZS1iYWJlbDp0cmFuc3BpbGUtZGlyZWN0b3JpZXMnLCBAY29tbWFuZFRyYW5zcGlsZURpcmVjdG9yaWVzXG5cbiAgIyBtZXRob2QgdXNlZCBieSBzb3VyY2UtcHJldmlldyB0byBzZWUgdHJhbnNwaWxlZCBjb2RlXG4gIHRyYW5zZm9ybTogKGNvZGUsIHtmaWxlUGF0aCwgc291cmNlTWFwfSkgLT5cbiAgICBjb25maWcgPSBAZ2V0Q29uZmlnKClcbiAgICBwYXRoVG8gPSBAZ2V0UGF0aHMgZmlsZVBhdGgsIGNvbmZpZ1xuICAgICMgY3JlYXRlIGJhYmVsIHRyYW5zZm9ybWVyIHRhc2tzIC0gb25lIHBlciBwcm9qZWN0IGFzIG5lZWRlZFxuICAgIEBjcmVhdGVUYXNrIHBhdGhUby5wcm9qZWN0UGF0aFxuICAgIGJhYmVsT3B0aW9ucyA9XG4gICAgICBmaWxlbmFtZTogZmlsZVBhdGhcbiAgICAgIGFzdDogZmFsc2VcbiAgICBpZiBzb3VyY2VNYXAgdGhlbiBiYWJlbE9wdGlvbnMuc291cmNlTWFwcyA9IHNvdXJjZU1hcFxuICAgICMgb2sgbm93IHRyYW5zcGlsZSBpbiB0aGUgdGFzayBhbmQgd2FpdCBvbiB0aGUgcmVzdWx0XG4gICAgaWYgQGJhYmVsVHJhbnNwaWxlclRhc2tzW3BhdGhUby5wcm9qZWN0UGF0aF1cbiAgICAgIHJlcUlkID0gQHJlcUlkKytcbiAgICAgIG1zZ09iamVjdCA9XG4gICAgICAgIHJlcUlkOiByZXFJZFxuICAgICAgICBjb21tYW5kOiAndHJhbnNwaWxlQ29kZSdcbiAgICAgICAgcGF0aFRvOiBwYXRoVG9cbiAgICAgICAgY29kZTogY29kZVxuICAgICAgICBiYWJlbE9wdGlvbnM6IGJhYmVsT3B0aW9uc1xuXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCApID0+XG4gICAgICAjIHRyYW5zcGlsZSBpbiB0YXNrXG4gICAgICB0cnlcbiAgICAgICAgQGJhYmVsVHJhbnNwaWxlclRhc2tzW3BhdGhUby5wcm9qZWN0UGF0aF0uc2VuZChtc2dPYmplY3QpXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgZGVsZXRlIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twYXRoVG8ucHJvamVjdFBhdGhdXG4gICAgICAgIHJlamVjdChcIkVycm9yICN7ZXJyfSBzZW5kaW5nIHRvIHRyYW5zcGlsZSB0YXNrIHdpdGggUElEICN7QGJhYmVsVHJhbnNwaWxlclRhc2tzW3BhdGhUby5wcm9qZWN0UGF0aF0uY2hpbGRQcm9jZXNzLnBpZH1cIilcbiAgICAgICMgZ2V0IHJlc3VsdCBmcm9tIHRhc2sgZm9yIHRoaXMgcmVxSWRcbiAgICAgIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twYXRoVG8ucHJvamVjdFBhdGhdLm9uY2UgXCJ0cmFuc3BpbGU6I3tyZXFJZH1cIiwgKG1zZ1JldCkgPT5cbiAgICAgICAgaWYgbXNnUmV0LmVycj9cbiAgICAgICAgICByZWplY3QoXCJCYWJlbCB2I3ttc2dSZXQuYmFiZWxWZXJzaW9ufVxcbiN7bXNnUmV0LmVyci5tZXNzYWdlfVxcbiN7bXNnUmV0LmJhYmVsQ29yZVVzZWR9XCIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtc2dSZXQuc291cmNlTWFwID0gbXNnUmV0Lm1hcFxuICAgICAgICAgIHJlc29sdmUobXNnUmV0KVxuXG4gICMgY2FsbGVkIGJ5IGNvbW1hbmRcbiAgY29tbWFuZFRyYW5zcGlsZURpcmVjdG9yeTogKHt0YXJnZXR9KSA9PlxuICAgIEB0cmFuc3BpbGVEaXJlY3Rvcnkge2RpcmVjdG9yeTogdGFyZ2V0LmRhdGFzZXQucGF0aCB9XG5cbiAgIyBjYWxsZWQgYnkgY29tbWFuZFxuICBjb21tYW5kVHJhbnNwaWxlRGlyZWN0b3JpZXM6ICh7dGFyZ2V0fSkgPT5cbiAgICBAdHJhbnNwaWxlRGlyZWN0b3J5IHtkaXJlY3Rvcnk6IHRhcmdldC5kYXRhc2V0LnBhdGgsIHJlY3Vyc2l2ZTogdHJ1ZX1cblxuICAjIHRyYW5zcGlsZSBhbGwgZmlsZXMgaW4gYSBkaXJlY3Rvcnkgb3IgcmVjdXJzaXZlIGRpcmVjdG9yaWVzXG4gICMgb3B0aW9ucyBhcmUgeyBkaXJlY3Rvcnk6IG5hbWUsIHJlY3Vyc2l2ZTogdHJ1ZXxmYWxzZX1cbiAgdHJhbnNwaWxlRGlyZWN0b3J5OiAob3B0aW9ucykgLT5cbiAgICBkaXJlY3RvcnkgPSBvcHRpb25zLmRpcmVjdG9yeVxuICAgIHJlY3Vyc2l2ZSA9IG9wdGlvbnMucmVjdXJzaXZlIG9yIGZhbHNlXG4gICAgZnMucmVhZGRpciBkaXJlY3RvcnksIChlcnIsZmlsZXMpID0+XG4gICAgICBpZiBub3QgZXJyP1xuICAgICAgICBmaWxlcy5tYXAgKGZpbGUpID0+XG4gICAgICAgICAgZnFGaWxlTmFtZSA9IHBhdGguam9pbihkaXJlY3RvcnksIGZpbGUpXG4gICAgICAgICAgZnMuc3RhdCBmcUZpbGVOYW1lLCAoZXJyLCBzdGF0cykgPT5cbiAgICAgICAgICAgIGlmIG5vdCBlcnI/XG4gICAgICAgICAgICAgIGlmIHN0YXRzLmlzRmlsZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIC9cXC5taW5cXC5bYS16XSskLy50ZXN0IGZxRmlsZU5hbWUgIyBubyBtaW5pbWl6ZWQgZmlsZXNcbiAgICAgICAgICAgICAgICBpZiAvXFwuKGpzfGpzeHxlc3xlczZ8YmFiZWx8bWpzKSQvLnRlc3QgZnFGaWxlTmFtZSAjIG9ubHkganNcbiAgICAgICAgICAgICAgICAgIEB0cmFuc3BpbGUgZmlsZSwgbnVsbCwgQGdldENvbmZpZ0FuZFBhdGhUbyBmcUZpbGVOYW1lXG4gICAgICAgICAgICAgIGVsc2UgaWYgcmVjdXJzaXZlIGFuZCBzdGF0cy5pc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICAgICAgQHRyYW5zcGlsZURpcmVjdG9yeSB7ZGlyZWN0b3J5OiBmcUZpbGVOYW1lLCByZWN1cnNpdmU6IHRydWV9XG5cbiAgIyB0cmFuc3BpbGUgc291cmNlRmlsZSBlZGl0ZWQgYnkgdGhlIG9wdGlvbmFsIHRleHRFZGl0b3JcbiAgdHJhbnNwaWxlOiAoc291cmNlRmlsZSwgdGV4dEVkaXRvciwgY29uZmlnQW5kUGF0aFRvKSAtPlxuICAgICMgZ2V0IGNvbmZpZ1xuICAgIGlmIGNvbmZpZ0FuZFBhdGhUbz9cbiAgICAgIHsgY29uZmlnLCBwYXRoVG8gfSA9IGNvbmZpZ0FuZFBhdGhUb1xuICAgIGVsc2VcbiAgICAgIHtjb25maWcsIHBhdGhUbyB9ID0gQGdldENvbmZpZ0FuZFBhdGhUbyhzb3VyY2VGaWxlKVxuXG4gICAgcmV0dXJuIGlmIGNvbmZpZy50cmFuc3BpbGVPblNhdmUgaXNudCB0cnVlXG5cbiAgICBpZiBjb25maWcuZGlzYWJsZVdoZW5Ob0JhYmVscmNGaWxlSW5QYXRoXG4gICAgICBpZiBub3QgQGlzQmFiZWxyY0luUGF0aCBwYXRoVG8uc291cmNlRmlsZURpclxuICAgICAgICByZXR1cm5cblxuICAgIGlmIG5vdCBwYXRoSXNJbnNpZGUocGF0aFRvLnNvdXJjZUZpbGUsIHBhdGhUby5zb3VyY2VSb290KVxuICAgICAgaWYgbm90IGNvbmZpZy5zdXBwcmVzc1NvdXJjZVBhdGhNZXNzYWdlc1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyAnTEI6IEJhYmVsIGZpbGUgaXMgbm90IGluc2lkZSB0aGUgXCJCYWJlbCBTb3VyY2UgUGF0aFwiIGRpcmVjdG9yeS4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgICAgIGRldGFpbDogXCJObyB0cmFuc3BpbGVkIGNvZGUgb3V0cHV0IGZvciBmaWxlIFxcbiN7cGF0aFRvLnNvdXJjZUZpbGV9XG4gICAgICAgICAgICBcXG5cXG5UbyBzdXBwcmVzcyB0aGVzZSAnaW52YWxpZCBzb3VyY2UgcGF0aCdcbiAgICAgICAgICAgIG1lc3NhZ2VzIHVzZSBsYW5ndWFnZS1iYWJlbCBwYWNrYWdlIHNldHRpbmdzXCJcbiAgICAgIHJldHVyblxuXG4gICAgYmFiZWxPcHRpb25zID0gQGdldEJhYmVsT3B0aW9ucyBjb25maWdcblxuICAgIEBjbGVhbk5vdGlmaWNhdGlvbnMocGF0aFRvKVxuXG4gICAgIyBjcmVhdGUgYmFiZWwgdHJhbnNmb3JtZXIgdGFza3MgLSBvbmUgcGVyIHByb2plY3QgYXMgbmVlZGVkXG4gICAgQGNyZWF0ZVRhc2sgcGF0aFRvLnByb2plY3RQYXRoXG5cbiAgICAjIG9rIG5vdyB0cmFuc3BpbGUgaW4gdGhlIHRhc2sgYW5kIHdhaXQgb24gdGhlIHJlc3VsdFxuICAgIGlmIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twYXRoVG8ucHJvamVjdFBhdGhdXG4gICAgICByZXFJZCA9IEByZXFJZCsrXG4gICAgICBtc2dPYmplY3QgPVxuICAgICAgICByZXFJZDogcmVxSWRcbiAgICAgICAgY29tbWFuZDogJ3RyYW5zcGlsZSdcbiAgICAgICAgcGF0aFRvOiBwYXRoVG9cbiAgICAgICAgYmFiZWxPcHRpb25zOiBiYWJlbE9wdGlvbnNcblxuICAgICAgIyB0cmFuc3BpbGUgaW4gdGFza1xuICAgICAgdHJ5XG4gICAgICAgIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twYXRoVG8ucHJvamVjdFBhdGhdLnNlbmQobXNnT2JqZWN0KVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiRXJyb3IgI3tlcnJ9IHNlbmRpbmcgdG8gdHJhbnNwaWxlIHRhc2sgd2l0aCBQSUQgI3tAYmFiZWxUcmFuc3BpbGVyVGFza3NbcGF0aFRvLnByb2plY3RQYXRoXS5jaGlsZFByb2Nlc3MucGlkfVwiXG4gICAgICAgIGRlbGV0ZSBAYmFiZWxUcmFuc3BpbGVyVGFza3NbcGF0aFRvLnByb2plY3RQYXRoXVxuICAgICAgICBAY3JlYXRlVGFzayBwYXRoVG8ucHJvamVjdFBhdGhcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZXN0YXJ0ZWQgdHJhbnNwaWxlIHRhc2sgd2l0aCBQSUQgI3tAYmFiZWxUcmFuc3BpbGVyVGFza3NbcGF0aFRvLnByb2plY3RQYXRoXS5jaGlsZFByb2Nlc3MucGlkfVwiXG4gICAgICAgIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twYXRoVG8ucHJvamVjdFBhdGhdLnNlbmQobXNnT2JqZWN0KVxuXG4gICAgICAjIGdldCByZXN1bHQgZnJvbSB0YXNrIGZvciB0aGlzIHJlcUlkXG4gICAgICBAYmFiZWxUcmFuc3BpbGVyVGFza3NbcGF0aFRvLnByb2plY3RQYXRoXS5vbmNlIFwidHJhbnNwaWxlOiN7cmVxSWR9XCIsIChtc2dSZXQpID0+XG4gICAgICAgICMgLmlnbm9yZWQgaXMgcmV0dXJuZWQgd2hlbiAuYmFiZWxyYyBpZ25vcmUvb25seSBmbGFncyBhcmUgdXNlZFxuICAgICAgICBpZiBtc2dSZXQucmVzdWx0Py5pZ25vcmVkIHRoZW4gcmV0dXJuXG4gICAgICAgIGlmIG1zZ1JldC5lcnJcbiAgICAgICAgICBpZiBtc2dSZXQuZXJyLnN0YWNrXG4gICAgICAgICAgICBAdHJhbnNwaWxlRXJyb3JOb3RpZmljYXRpb25zW3BhdGhUby5zb3VyY2VGaWxlXSA9XG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkxCOiBCYWJlbCBUcmFuc3BpbGVyIEVycm9yXCIsXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgICAgICBkZXRhaWw6IFwiI3ttc2dSZXQuZXJyLm1lc3NhZ2V9XFxuIFxcbiN7bXNnUmV0LmJhYmVsQ29yZVVzZWR9XFxuIFxcbiN7bXNnUmV0LmVyci5zdGFja31cIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB0cmFuc3BpbGVFcnJvck5vdGlmaWNhdGlvbnNbcGF0aFRvLnNvdXJjZUZpbGVdID1cbiAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiTEI6IEJhYmVsIHYje21zZ1JldC5iYWJlbFZlcnNpb259IFRyYW5zcGlsZXIgRXJyb3JcIixcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIGRldGFpbDogXCIje21zZ1JldC5lcnIubWVzc2FnZX1cXG4gXFxuI3ttc2dSZXQuYmFiZWxDb3JlVXNlZH1cXG4gXFxuI3ttc2dSZXQuZXJyLmNvZGVGcmFtZX1cIlxuICAgICAgICAgICAgIyBpZiB3ZSBoYXZlIGEgbGluZS9jb2wgc3ludGF4IGVycm9yIGp1bXAgdG8gdGhlIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiBtc2dSZXQuZXJyLmxvYz8ubGluZT8gYW5kIHRleHRFZGl0b3I/LmFsaXZlXG4gICAgICAgICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW21zZ1JldC5lcnIubG9jLmxpbmUtMSwgbXNnUmV0LmVyci5sb2MuY29sdW1uXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbm90IGNvbmZpZy5zdXBwcmVzc1RyYW5zcGlsZU9uU2F2ZU1lc3NhZ2VzXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcIkxCOiBCYWJlbCB2I3ttc2dSZXQuYmFiZWxWZXJzaW9ufSBUcmFuc3BpbGVyIFN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgZGV0YWlsOiBcIiN7cGF0aFRvLnNvdXJjZUZpbGV9XFxuIFxcbiN7bXNnUmV0LmJhYmVsQ29yZVVzZWR9XCJcblxuICAgICAgICAgIGlmIG5vdCBjb25maWcuY3JlYXRlVHJhbnNwaWxlZENvZGVcbiAgICAgICAgICAgIGlmIG5vdCBjb25maWcuc3VwcHJlc3NUcmFuc3BpbGVPblNhdmVNZXNzYWdlc1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyAnTEI6IE5vIHRyYW5zcGlsZWQgb3V0cHV0IGNvbmZpZ3VyZWQnXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBpZiBwYXRoVG8uc291cmNlRmlsZSBpcyBwYXRoVG8udHJhbnNwaWxlZEZpbGVcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nICdMQjogVHJhbnNwaWxlZCBmaWxlIHdvdWxkIG92ZXJ3cml0ZSBzb3VyY2UgZmlsZS4gQWJvcnRlZCEnLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICBkZXRhaWw6IHBhdGhUby5zb3VyY2VGaWxlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICMgd3JpdGUgY29kZSBhbmQgbWFwc1xuICAgICAgICAgIGlmIGNvbmZpZy5jcmVhdGVUYXJnZXREaXJlY3Rvcmllc1xuICAgICAgICAgICAgZnMubWFrZVRyZWVTeW5jKCBwYXRoLnBhcnNlKCBwYXRoVG8udHJhbnNwaWxlZEZpbGUpLmRpcilcblxuICAgICAgICAgICMgYWRkIHNvdXJjZSBtYXAgdXJsIHRvIGNvZGUgaWYgZmlsZSBpc24ndCBpZ25vcmVkXG4gICAgICAgICAgaWYgY29uZmlnLmJhYmVsTWFwc0FkZFVybFxuICAgICAgICAgICAgIyBNYWtlIHVuaXggdHlwZSBwYXRoIC0gbWFwIGZpbGUgbG9jYXRpb24gcmVsYXRpdmUgdG8gdHJhbnNwaWxlZCBmaWxlXG4gICAgICAgICAgICBmID0gcGF0aC5qb2luKHBhdGgucmVsYXRpdmUocGF0aFRvLnRyYW5zcGlsZWRGaWxlRGlyLCBwYXRoVG8ubWFwRmlsZURpciksIHBhdGhUby5tYXBGaWxlTmFtZSkuc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKVxuICAgICAgICAgICAgbXNnUmV0LnJlc3VsdC5jb2RlID0gbXNnUmV0LnJlc3VsdC5jb2RlICsgJ1xcbicgKyAnLy8jIHNvdXJjZU1hcHBpbmdVUkw9JytmXG5cbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jIHBhdGhUby50cmFuc3BpbGVkRmlsZSwgbXNnUmV0LnJlc3VsdC5jb2RlXG5cbiAgICAgICAgICAjIHdyaXRlIHNvdXJjZSBtYXAgaWYgcmV0dXJuZWQgYW5kIGlmIGFza2VkXG4gICAgICAgICAgaWYgY29uZmlnLmNyZWF0ZU1hcCBhbmQgbXNnUmV0LnJlc3VsdC5tYXA/LnZlcnNpb25cbiAgICAgICAgICAgIGlmIGNvbmZpZy5jcmVhdGVUYXJnZXREaXJlY3Rvcmllc1xuICAgICAgICAgICAgICBmcy5tYWtlVHJlZVN5bmMocGF0aC5wYXJzZShwYXRoVG8ubWFwRmlsZSkuZGlyKVxuXG4gICAgICAgICAgICAjIE1ha2UgdW5peCB0eXBlIHBhdGggLSBvcmlnaW5hbCBzb3VyY2UgZmlsZSAgcmVsYXRpdmUgdG8gbWFwIGZpbGVcbiAgICAgICAgICAgIGYgPSBwYXRoLmpvaW4ocGF0aC5yZWxhdGl2ZShwYXRoVG8ubWFwRmlsZURpciwgcGF0aFRvLnNvdXJjZUZpbGVEaXIgKSwgcGF0aFRvLnNvdXJjZUZpbGVOYW1lKS5zcGxpdChwYXRoLnNlcCkuam9pbignLycpXG5cbiAgICAgICAgICAgIG1hcEpzb24gPVxuICAgICAgICAgICAgICB2ZXJzaW9uOiBtc2dSZXQucmVzdWx0Lm1hcC52ZXJzaW9uXG4gICAgICAgICAgICAgIHNvdXJjZXM6ICBbZl1cbiAgICAgICAgICAgICAgZmlsZTogZlxuICAgICAgICAgICAgICBuYW1lczogbXNnUmV0LnJlc3VsdC5tYXAubmFtZXNcbiAgICAgICAgICAgICAgbWFwcGluZ3M6IG1zZ1JldC5yZXN1bHQubWFwLm1hcHBpbmdzXG4gICAgICAgICAgICAjeHNzaVByb3RlY3Rpb24gPSAnKV19XFxuJyAgICAjIHJlbW92ZWQgdGhpcyBsaW5lIGFzIEZpcmVmb3ggZG9lc24ndCBzdXBwb3J0IHJlbW92YWwgb2YgeHNzaSBwcmVmaXghXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jIHBhdGhUby5tYXBGaWxlLCBKU09OLnN0cmluZ2lmeSBtYXBKc29uLCBudWxsLCAnICdcblxuICAjIGNsZWFuIG5vdGlmaWNhdGlvbiBtZXNzYWdlc1xuICBjbGVhbk5vdGlmaWNhdGlvbnM6IChwYXRoVG8pIC0+XG4gICAgIyBhdXRvIGRpc21pc3MgcHJldmlvdXMgdHJhbnNwaWxlIGVycm9yIG5vdGlmaWNhdGlvbnMgZm9yIHRoaXMgc291cmNlIGZpbGVcbiAgICBpZiBAdHJhbnNwaWxlRXJyb3JOb3RpZmljYXRpb25zW3BhdGhUby5zb3VyY2VGaWxlXT9cbiAgICAgIEB0cmFuc3BpbGVFcnJvck5vdGlmaWNhdGlvbnNbcGF0aFRvLnNvdXJjZUZpbGVdLmRpc21pc3MoKVxuICAgICAgZGVsZXRlIEB0cmFuc3BpbGVFcnJvck5vdGlmaWNhdGlvbnNbcGF0aFRvLnNvdXJjZUZpbGVdXG4gICAgIyByZW1vdmUgYW55IHVzZXIgZGlzbWlzc2VkIG5vdGlmaWNhdGlvbiBvYmplY3QgcmVmZXJlbmNlc1xuICAgIGZvciBzZiwgbiBvZiBAdHJhbnNwaWxlRXJyb3JOb3RpZmljYXRpb25zXG4gICAgICBpZiBuLmRpc21pc3NlZFxuICAgICAgICBkZWxldGUgQHRyYW5zcGlsZUVycm9yTm90aWZpY2F0aW9uc1tzZl1cbiAgICAjIEZJWCBmb3IgYXRvbSBub3RpZmljYXRpb25zLiBkaXNtaXNzZWQgbm9mdGlmaWNhdGlvbnMgdmlhIHdoYXRldmVyIG1lYW5zXG4gICAgIyBhcmUgbmV2ZXIgYWN0dWFsbHkgcmVtb3ZlZCBmcm9tIG1lbW9yeS4gSSBjb25zaWRlciB0aGlzIGEgbWVtb3J5IGxlYWtcbiAgICAjIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy84NjE0IHNvIHJlbW92ZSBhbnkgZGlzbWlzc2VkXG4gICAgIyBub3RpZmljYXRpb24gb2JqZWN0cyBwcmVmaXhlZCB3aXRoIGEgbWVzc2FnZSBwcmVmaXggb2YgTEI6IGZyb20gbWVtb3J5XG4gICAgaSA9IGF0b20ubm90aWZpY2F0aW9ucy5ub3RpZmljYXRpb25zLmxlbmd0aCAtIDFcbiAgICB3aGlsZSBpID49IDBcbiAgICAgIGlmIGF0b20ubm90aWZpY2F0aW9ucy5ub3RpZmljYXRpb25zW2ldLmRpc21pc3NlZCBhbmRcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5ub3RpZmljYXRpb25zW2ldLm1lc3NhZ2Uuc3Vic3RyaW5nKDAsMykgaXMgXCJMQjpcIlxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMubm90aWZpY2F0aW9ucy5zcGxpY2UgaSwgMVxuICAgICAgaS0tXG5cbiAgIyBjcmVhdGUgYmFiZWwgdHJhbnNmb3JtZXIgdGFza3MgLSBvbmUgcGVyIHByb2plY3QgYXMgbmVlZGVkXG4gIGNyZWF0ZVRhc2s6IChwcm9qZWN0UGF0aCkgLT5cbiAgICBAYmFiZWxUcmFuc3BpbGVyVGFza3NbcHJvamVjdFBhdGhdID89XG4gICAgICBUYXNrLm9uY2UgQGJhYmVsVHJhbnNmb3JtZXJQYXRoLCBwcm9qZWN0UGF0aCwgPT5cbiAgICAgICAgIyB0YXNrIGVuZGVkXG4gICAgICAgIGRlbGV0ZSBAYmFiZWxUcmFuc3BpbGVyVGFza3NbcHJvamVjdFBhdGhdXG5cbiAgIyBtb2RpZmllcyBjb25maWcgb3B0aW9ucyBmb3IgY2hhbmdlZCBvciBkZXByZWNhdGVkIGNvbmZpZ3NcbiAgZGVwcmVjYXRlQ29uZmlnOiAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnbGFuZ3VhZ2UtYmFiZWwuc3VwcmVzc1RyYW5zcGlsZU9uU2F2ZU1lc3NhZ2VzJyk/XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ2xhbmd1YWdlLWJhYmVsLnN1cHByZXNzVHJhbnNwaWxlT25TYXZlTWVzc2FnZXMnLFxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLWJhYmVsLnN1cHJlc3NUcmFuc3BpbGVPblNhdmVNZXNzYWdlcycpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1iYWJlbC5zdXByZXNzU291cmNlUGF0aE1lc3NhZ2VzJyk/XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ2xhbmd1YWdlLWJhYmVsLnN1cHByZXNzU291cmNlUGF0aE1lc3NhZ2VzJyxcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1iYWJlbC5zdXByZXNzU291cmNlUGF0aE1lc3NhZ2VzJylcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwuc3VwcmVzc1RyYW5zcGlsZU9uU2F2ZU1lc3NhZ2VzJylcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwuc3VwcmVzc1NvdXJjZVBhdGhNZXNzYWdlcycpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLnVzZUludGVybmFsU2Nhbm5lcicpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLnN0b3BBdFByb2plY3REaXJlY3RvcnknKVxuICAgICMgcmVtb3ZlIGJhYmVsIFY1IG9wdGlvbnNcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwuYmFiZWxTdGFnZScpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLmV4dGVybmFsSGVscGVycycpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLm1vZHVsZUxvYWRlcicpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLmJsYWNrbGlzdFRyYW5zZm9ybWVycycpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLndoaXRlbGlzdFRyYW5zZm9ybWVycycpXG4gICAgYXRvbS5jb25maWcudW5zZXQoJ2xhbmd1YWdlLWJhYmVsLmxvb3NlVHJhbnNmb3JtZXJzJylcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwub3B0aW9uYWxUcmFuc2Zvcm1lcnMnKVxuICAgIGF0b20uY29uZmlnLnVuc2V0KCdsYW5ndWFnZS1iYWJlbC5wbHVnaW5zJylcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwucHJlc2V0cycpXG4gICAgIyByZW1vdmUgb2xkIG5hbWUgaW5kZW50IG9wdGlvbnNcbiAgICBhdG9tLmNvbmZpZy51bnNldCgnbGFuZ3VhZ2UtYmFiZWwuZm9ybWF0SlNYJylcblxuICAjIGNhbGN1bGF0ZSBiYWJlbCBvcHRpb25zIGJhc2VkIHVwb24gcGFja2FnZSBjb25maWcsIGJhYmVscmMgZmlsZXMgYW5kXG4gICMgd2hldGhlciBpbnRlcm5hbFNjYW5uZXIgaXMgdXNlZC5cbiAgZ2V0QmFiZWxPcHRpb25zOiAoY29uZmlnKS0+XG4gICAgIyBzZXQgdHJhbnNwaWxlciBvcHRpb25zIGZyb20gcGFja2FnZSBjb25maWd1cmF0aW9uLlxuICAgIGJhYmVsT3B0aW9ucyA9XG4gICAgICBjb2RlOiB0cnVlXG4gICAgaWYgY29uZmlnLmNyZWF0ZU1hcCAgdGhlbiBiYWJlbE9wdGlvbnMuc291cmNlTWFwcyA9IGNvbmZpZy5jcmVhdGVNYXBcbiAgICBiYWJlbE9wdGlvbnNcblxuICAjZ2V0IGNvbmZpZ3VyYXRpb24gYW5kIHBhdGhzXG4gIGdldENvbmZpZ0FuZFBhdGhUbzogKHNvdXJjZUZpbGUpIC0+XG4gICAgY29uZmlnID0gQGdldENvbmZpZygpXG4gICAgcGF0aFRvID0gQGdldFBhdGhzIHNvdXJjZUZpbGUsIGNvbmZpZ1xuXG4gICAgaWYgY29uZmlnLmFsbG93TG9jYWxPdmVycmlkZVxuICAgICAgaWYgbm90IEBqc29uU2NoZW1hP1xuICAgICAgICBAanNvblNjaGVtYSA9IChyZXF1aXJlICcuLi9ub2RlX21vZHVsZXMvamp2JykoKSAjIHVzZSBqanYgYXMgaXQgcnVucyB3aXRob3V0IENTUCBpc3N1ZXNcbiAgICAgICAgQGpzb25TY2hlbWEuYWRkU2NoZW1hICdsb2NhbENvbmZpZycsIGxhbmd1YWdlYmFiZWxTY2hlbWFcbiAgICAgIGxvY2FsQ29uZmlnID0gQGdldExvY2FsQ29uZmlnIHBhdGhUby5zb3VyY2VGaWxlRGlyLCBwYXRoVG8ucHJvamVjdFBhdGgsIHt9XG4gICAgICAjIG1lcmdlIGxvY2FsIGNvbmZpZ3Mgd2l0aCBnbG9iYWwuIGxvY2FsIHdpbnNcbiAgICAgIEBtZXJnZSBjb25maWcsIGxvY2FsQ29uZmlnXG4gICAgICAjIHJlY2FsYyBwYXRoc1xuICAgICAgcGF0aFRvID0gQGdldFBhdGhzIHNvdXJjZUZpbGUsIGNvbmZpZ1xuICAgIHJldHVybiB7IGNvbmZpZywgcGF0aFRvIH1cblxuICAjIGdldCBnbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgbGFuZ3VhZ2UtYmFiZWxcbiAgZ2V0Q29uZmlnOiAtPiBhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLWJhYmVsJylcblxuIyBjaGVjayBmb3IgcHJlc2NlbmNlIG9mIGEgLmxhbmd1YWdlYmFiZWwgZmlsZSBwYXRoIGZyb21EaXIgdG9EaXJcbiMgcmVhZCwgdmFsaWRhdGUgYW5kIG92ZXJ3cml0ZSBjb25maWcgYXMgcmVxdWlyZWRcbiMgdG9EaXIgaXMgbm9ybWFsbHkgdGhlIGltcGxpY2l0IEF0b20gcHJvamVjdCBmb2xkZXJzIHJvb3QgYnV0IHdlXG4jIHdpbGwgc3RvcCBvZiBhIHByb2plY3RSb290IHRydWUgaXMgZm91bmQgYXMgd2VsbFxuICBnZXRMb2NhbENvbmZpZzogKGZyb21EaXIsIHRvRGlyLCBsb2NhbENvbmZpZykgLT5cbiAgICAjIGdldCBsb2NhbCBwYXRoIG92ZXJpZGVzXG4gICAgbG9jYWxDb25maWdGaWxlID0gJy5sYW5ndWFnZWJhYmVsJ1xuICAgIGxhbmd1YWdlQmFiZWxDZmdGaWxlID0gcGF0aC5qb2luIGZyb21EaXIsIGxvY2FsQ29uZmlnRmlsZVxuICAgIGlmIGZzLmV4aXN0c1N5bmMgbGFuZ3VhZ2VCYWJlbENmZ0ZpbGVcbiAgICAgIGZpbGVDb250ZW50PSBmcy5yZWFkRmlsZVN5bmMgbGFuZ3VhZ2VCYWJlbENmZ0ZpbGUsICd1dGY4J1xuICAgICAgdHJ5XG4gICAgICAgIGpzb25Db250ZW50ID0gSlNPTi5wYXJzZSBmaWxlQ29udGVudFxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkxCOiAje2xvY2FsQ29uZmlnRmlsZX0gI3tlcnIubWVzc2FnZX1cIixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIGRldGFpbDogXCJGaWxlID0gI3tsYW5ndWFnZUJhYmVsQ2ZnRmlsZX1cXG5cXG4je2ZpbGVDb250ZW50fVwiXG4gICAgICAgIHJldHVyblxuXG4gICAgICBzY2hlbWFFcnJvcnMgPSBAanNvblNjaGVtYS52YWxpZGF0ZSAnbG9jYWxDb25maWcnLCBqc29uQ29udGVudFxuICAgICAgaWYgc2NoZW1hRXJyb3JzXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkxCOiAje2xvY2FsQ29uZmlnRmlsZX0gY29uZmlndXJhdGlvbiBlcnJvclwiLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgZGV0YWlsOiBcIkZpbGUgPSAje2xhbmd1YWdlQmFiZWxDZmdGaWxlfVxcblxcbiN7ZmlsZUNvbnRlbnR9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgIyBtZXJnZSBsb2NhbCBjb25maWcuIGNvbmZpZyBjbG9zZXN0IHNvdXJjZUZpbGUgd2luc1xuICAgICAgICAjIGFwYXJ0IGZyb20gcHJvamVjdFJvb3Qgd2hpY2ggd2lucyBvbiB0cnVlXG4gICAgICAgIGlzUHJvamVjdFJvb3QgPSBqc29uQ29udGVudC5wcm9qZWN0Um9vdFxuICAgICAgICBAbWVyZ2UgIGpzb25Db250ZW50LCBsb2NhbENvbmZpZ1xuICAgICAgICBpZiBpc1Byb2plY3RSb290IHRoZW4ganNvbkNvbnRlbnQucHJvamVjdFJvb3REaXIgPSBmcm9tRGlyXG4gICAgICAgIGxvY2FsQ29uZmlnID0ganNvbkNvbnRlbnRcbiAgICBpZiBmcm9tRGlyIGlzbnQgdG9EaXJcbiAgICAgICMgc3RvcCBpbmZpbml0ZSByZWN1cnNpb24gaHR0cHM6Ly9naXRodWIuY29tL2dhbmRtL2xhbmd1YWdlLWJhYmVsL2lzc3Vlcy82NlxuICAgICAgaWYgZnJvbURpciA9PSBwYXRoLmRpcm5hbWUoZnJvbURpcikgdGhlbiByZXR1cm4gbG9jYWxDb25maWdcbiAgICAgICMgY2hlY2sgcHJvamVjdFJvb3QgcHJvcGVydHkgYW5kIGVuZCByZWN1cnNpb24gaWYgdHJ1ZVxuICAgICAgaWYgaXNQcm9qZWN0Um9vdCB0aGVuIHJldHVybiBsb2NhbENvbmZpZ1xuICAgICAgcmV0dXJuIEBnZXRMb2NhbENvbmZpZyBwYXRoLmRpcm5hbWUoZnJvbURpciksIHRvRGlyLCBsb2NhbENvbmZpZ1xuICAgIGVsc2UgcmV0dXJuIGxvY2FsQ29uZmlnXG5cbiAgIyBjYWxjdWxhdGUgYWJzb3VsdGUgcGF0aHMgb2YgYmFiZWwgc291cmNlLCB0YXJnZXQganMgYW5kIG1hcHMgZmlsZXNcbiAgIyBiYXNlZCB1cG9uIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBzb3VyY2VcbiAgIyBhbmQgdGhlIHJvb3RzIG9mIHNvdXJjZSwgdHJhbnNwaWxlIHBhdGggYW5kIG1hcHMgcGF0aHMgZGVmaW5lZCBpbiBjb25maWdcbiAgZ2V0UGF0aHM6ICAoc291cmNlRmlsZSwgY29uZmlnKSAtPlxuICAgIHByb2plY3RDb250YWluaW5nU291cmNlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoIHNvdXJjZUZpbGVcbiAgICAjIElzIHRoZSBzb3VyY2VGaWxlIGxvY2F0ZWQgaW5zaWRlIGFuIEF0b20gcHJvamVjdCBmb2xkZXI/XG4gICAgaWYgcHJvamVjdENvbnRhaW5pbmdTb3VyY2VbMF0gaXMgbnVsbFxuICAgICAgc291cmNlRmlsZUluUHJvamVjdCA9IGZhbHNlXG4gICAgZWxzZSBzb3VyY2VGaWxlSW5Qcm9qZWN0ID0gdHJ1ZVxuICAgICMgZGV0ZXJtaW5lcyB0aGUgcHJvamVjdCByb290IGRpciBmcm9tIC5sYW5ndWFnZWJhYmVsIG9yIGZyb20gQXRvbVxuICAgICMgaWYgYSBwcm9qZWN0IGlzIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiBhdG9tIHBhc3NlcyBiYWNrIGEgbnVsbCBmb3JcbiAgICAjIHRoZSBwcm9qZWN0IHBhdGggaWYgdGhlIGZpbGUgaXNuJ3QgaW4gYSBwcm9qZWN0IGZvbGRlclxuICAgICMgc28gbWFrZSB0aGUgcm9vdCBkaXIgdGhhdCBzb3VyY2UgZmlsZSB0aGUgcHJvamVjdFxuICAgIGlmIGNvbmZpZy5wcm9qZWN0Um9vdERpcj9cbiAgICAgIGFic1Byb2plY3RQYXRoID0gcGF0aC5ub3JtYWxpemUoY29uZmlnLnByb2plY3RSb290RGlyKVxuICAgIGVsc2UgaWYgcHJvamVjdENvbnRhaW5pbmdTb3VyY2VbMF0gaXMgbnVsbFxuICAgICAgYWJzUHJvamVjdFBhdGggPSBwYXRoLnBhcnNlKHNvdXJjZUZpbGUpLnJvb3RcbiAgICBlbHNlXG4gICAgICAjIEF0b20gMS44IHJldHVybmluZyBkcml2ZSBhcyBwcm9qZWN0IHJvb3Qgb24gd2luZG93cyBlLmcuIGM6IG5vdCBjOlxcXG4gICAgICAjIHVzaW5nIHBhdGguam9pbiB0byAnLicgZml4ZXMgaXQuXG4gICAgICBhYnNQcm9qZWN0UGF0aCA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihwcm9qZWN0Q29udGFpbmluZ1NvdXJjZVswXSwnLicpKVxuICAgIHJlbFNvdXJjZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShjb25maWcuYmFiZWxTb3VyY2VQYXRoKVxuICAgIHJlbFRyYW5zcGlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShjb25maWcuYmFiZWxUcmFuc3BpbGVQYXRoKVxuICAgIHJlbE1hcHNQYXRoID0gcGF0aC5ub3JtYWxpemUoY29uZmlnLmJhYmVsTWFwc1BhdGgpXG5cbiAgICBhYnNTb3VyY2VSb290ID0gcGF0aC5qb2luKGFic1Byb2plY3RQYXRoICwgcmVsU291cmNlUGF0aClcbiAgICBhYnNUcmFuc3BpbGVSb290ID0gcGF0aC5qb2luKGFic1Byb2plY3RQYXRoICwgcmVsVHJhbnNwaWxlUGF0aClcbiAgICBhYnNNYXBzUm9vdCA9IHBhdGguam9pbihhYnNQcm9qZWN0UGF0aCAsIHJlbE1hcHNQYXRoKVxuXG4gICAgcGFyc2VkU291cmNlRmlsZSA9IHBhdGgucGFyc2Uoc291cmNlRmlsZSlcbiAgICByZWxTb3VyY2VSb290VG9Tb3VyY2VGaWxlID0gcGF0aC5yZWxhdGl2ZShhYnNTb3VyY2VSb290LCBwYXJzZWRTb3VyY2VGaWxlLmRpcilcblxuICAgICMgb3B0aW9uIHRvIGtlZXAgZmlsZW5hbWUgZXh0ZW5zaW9uIG5hbWVcbiAgICBpZiBjb25maWcua2VlcEZpbGVFeHRlbnNpb25cbiAgICAgIGZuRXh0ID0gcGFyc2VkU291cmNlRmlsZS5leHRcbiAgICBlbHNlXG4gICAgICBmbkV4dCA9ICAnLmpzJ1xuXG4gICAgc291cmNlRmlsZU5hbWUgPSBwYXJzZWRTb3VyY2VGaWxlLm5hbWUgICsgZm5FeHRcbiAgICBtYXBGaWxlTmFtZSA9IHBhcnNlZFNvdXJjZUZpbGUubmFtZSAgKyBmbkV4dCArICcubWFwJ1xuXG4gICAgYWJzVHJhbnNwaWxlZEZpbGUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oYWJzVHJhbnNwaWxlUm9vdCwgcmVsU291cmNlUm9vdFRvU291cmNlRmlsZSAsIHNvdXJjZUZpbGVOYW1lICkpXG4gICAgYWJzTWFwRmlsZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihhYnNNYXBzUm9vdCwgcmVsU291cmNlUm9vdFRvU291cmNlRmlsZSwgbWFwRmlsZU5hbWUgKSlcblxuICAgIHNvdXJjZUZpbGVJblByb2plY3Q6IHNvdXJjZUZpbGVJblByb2plY3RcbiAgICBzb3VyY2VGaWxlOiBzb3VyY2VGaWxlXG4gICAgc291cmNlRmlsZURpcjogcGFyc2VkU291cmNlRmlsZS5kaXJcbiAgICBzb3VyY2VGaWxlTmFtZTogc291cmNlRmlsZU5hbWVcbiAgICBtYXBGaWxlOiBhYnNNYXBGaWxlXG4gICAgbWFwRmlsZURpcjogcGF0aC5wYXJzZShhYnNNYXBGaWxlKS5kaXJcbiAgICBtYXBGaWxlTmFtZTogbWFwRmlsZU5hbWVcbiAgICB0cmFuc3BpbGVkRmlsZTogYWJzVHJhbnNwaWxlZEZpbGVcbiAgICB0cmFuc3BpbGVkRmlsZURpcjogcGF0aC5wYXJzZShhYnNUcmFuc3BpbGVkRmlsZSkuZGlyXG4gICAgc291cmNlUm9vdDogYWJzU291cmNlUm9vdFxuICAgIHByb2plY3RQYXRoOiBhYnNQcm9qZWN0UGF0aFxuXG4jIGNoZWNrIGZvciBwcmVzY2VuY2Ugb2YgYSAuYmFiZWxyYyBmaWxlIHBhdGggZnJvbURpciB0byByb290XG4gIGlzQmFiZWxyY0luUGF0aDogKGZyb21EaXIpIC0+XG4gICAgIyBlbnZpcm9tbmVudHMgdXNlZCBpbiBiYWJlbHJjXG4gICAgYmFiZWxyYyA9IFtcbiAgICAgICcuYmFiZWxyYydcbiAgICAgICcuYmFiZWxyYy5qcycgIyBCYWJlbCA3LjAgYW5kIG5ld2VyXG4gICAgXVxuICAgIGJhYmVscmNGaWxlcyA9IGJhYmVscmMubWFwIChmaWxlKSAtPiBwYXRoLmpvaW4oZnJvbURpciwgZmlsZSlcblxuICAgIGlmIGJhYmVscmNGaWxlcy5zb21lIGZzLmV4aXN0c1N5bmNcbiAgICAgIHJldHVybiB0cnVlXG4gICAgaWYgZnJvbURpciAhPSBwYXRoLmRpcm5hbWUoZnJvbURpcilcbiAgICAgIHJldHVybiBAaXNCYWJlbHJjSW5QYXRoIHBhdGguZGlybmFtZShmcm9tRGlyKVxuICAgIGVsc2UgcmV0dXJuIGZhbHNlXG5cbiMgc2ltcGxlIG1lcmdlIG9mIG9iamVjdHNcbiAgbWVyZ2U6ICh0YXJnZXRPYmosIHNvdXJjZU9iaikgLT5cbiAgICBmb3IgcHJvcCwgdmFsIG9mIHNvdXJjZU9ialxuICAgICAgdGFyZ2V0T2JqW3Byb3BdID0gdmFsXG5cbiMgc3RvcCB0cmFuc3BpbGVyIHRhc2tcbiAgc3RvcFRyYW5zcGlsZXJUYXNrOiAocHJvamVjdFBhdGgpIC0+XG4gICAgbXNnT2JqZWN0ID1cbiAgICAgIGNvbW1hbmQ6ICdzdG9wJ1xuICAgIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1twcm9qZWN0UGF0aF0uc2VuZChtc2dPYmplY3QpXG5cbiMgc3RvcCBhbGwgdHJhbnNwaWxlciB0YXNrc1xuICBzdG9wQWxsVHJhbnNwaWxlclRhc2s6ICgpIC0+XG4gICAgZm9yIHByb2plY3RQYXRoLCB2IG9mIEBiYWJlbFRyYW5zcGlsZXJUYXNrc1xuICAgICAgQHN0b3BUcmFuc3BpbGVyVGFzayhwcm9qZWN0UGF0aClcblxuIyBzdG9wIHVuc3VlZCB0cmFuc3BpbGVyIHRhc2tzIGlmIGl0cyBwYXRoIGlzbid0IHByZXNlbnQgaW4gYSBjdXJyZW50XG4jIEF0b20gcHJvamVjdCBmb2xkZXJcbiAgc3RvcFVudXNlZFRhc2tzOiAoKSAtPlxuICAgIGF0b21Qcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGZvciBwcm9qZWN0VGFza1BhdGgsdiBvZiBAYmFiZWxUcmFuc3BpbGVyVGFza3NcbiAgICAgIGlzVGFza0luQ3VycmVudFByb2plY3QgPSBmYWxzZVxuICAgICAgZm9yIGF0b21Qcm9qZWN0UGF0aCBpbiBhdG9tUHJvamVjdFBhdGhzXG4gICAgICAgIGlmIHBhdGhJc0luc2lkZShwcm9qZWN0VGFza1BhdGgsIGF0b21Qcm9qZWN0UGF0aClcbiAgICAgICAgICBpc1Rhc2tJbkN1cnJlbnRQcm9qZWN0ID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICBpZiBub3QgaXNUYXNrSW5DdXJyZW50UHJvamVjdCB0aGVuIEBzdG9wVHJhbnNwaWxlclRhc2socHJvamVjdFRhc2tQYXRoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcGlsZXJcbiJdfQ==
