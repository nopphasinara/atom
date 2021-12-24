(function() {
  var Executable, HybridExecutable, Promise, _, fs, os, parentConfigKey, path, semver, spawn, which,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Promise = require('bluebird');

  _ = require('lodash');

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  semver = require('semver');

  os = require('os');

  fs = require('fs');

  parentConfigKey = "atom-beautify.executables";

  Executable = (function() {
    var isInstalled, version;

    Executable.prototype.name = null;

    Executable.prototype.cmd = null;

    Executable.prototype.key = null;

    Executable.prototype.homepage = null;

    Executable.prototype.installation = null;

    Executable.prototype.versionArgs = ['--version'];

    Executable.prototype.versionParse = function(text) {
      return semver.clean(text);
    };

    Executable.prototype.versionRunOptions = {};

    Executable.prototype.versionsSupported = '>= 0.0.0';

    Executable.prototype.required = true;

    function Executable(options) {
      var versionOptions;
      if (options.cmd == null) {
        throw new Error("The command (i.e. cmd property) is required for an Executable.");
      }
      this.name = options.name;
      this.cmd = options.cmd;
      this.key = this.cmd;
      this.homepage = options.homepage;
      this.installation = options.installation;
      this.required = !options.optional;
      if (options.version != null) {
        versionOptions = options.version;
        if (versionOptions.args) {
          this.versionArgs = versionOptions.args;
        }
        if (versionOptions.parse) {
          this.versionParse = versionOptions.parse;
        }
        if (versionOptions.runOptions) {
          this.versionRunOptions = versionOptions.runOptions;
        }
        if (versionOptions.supported) {
          this.versionsSupported = versionOptions.supported;
        }
      }
      this.setupLogger();
    }

    Executable.prototype.init = function() {
      return Promise.all([this.loadVersion()]).then((function(_this) {
        return function() {
          return _this.verbose("Done init of " + _this.name);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Executable.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Executable.prototype.setupLogger = function() {
      var key, method, ref;
      this.logger = require('../logger')(this.name + " Executable");
      ref = this.logger;
      for (key in ref) {
        method = ref[key];
        this[key] = method;
      }
      return this.verbose(this.name + " executable logger has been initialized.");
    };

    isInstalled = null;

    version = null;

    Executable.prototype.loadVersion = function(force) {
      if (force == null) {
        force = false;
      }
      this.verbose("loadVersion", this.version, force);
      if (force || (this.version == null)) {
        this.verbose("Loading version without cache");
        return this.runVersion().then((function(_this) {
          return function(text) {
            return _this.saveVersion(text);
          };
        })(this));
      } else {
        this.verbose("Loading cached version");
        return Promise.resolve(this.version);
      }
    };

    Executable.prototype.runVersion = function() {
      return this.run(this.versionArgs, this.versionRunOptions).then((function(_this) {
        return function(version) {
          _this.info("Version text: " + version);
          return version;
        };
      })(this));
    };

    Executable.prototype.saveVersion = function(text) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.versionParse(text);
        };
      })(this)).then(function(version) {
        var valid;
        valid = Boolean(semver.valid(version));
        if (!valid) {
          throw new Error("Version is not valid: " + version);
        }
        return version;
      }).then((function(_this) {
        return function(version) {
          _this.isInstalled = true;
          return _this.version = version;
        };
      })(this)).then((function(_this) {
        return function(version) {
          _this.info(_this.cmd + " version: " + version);
          return version;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          var help;
          _this.isInstalled = false;
          _this.error(error);
          help = {
            program: _this.cmd,
            link: _this.installation || _this.homepage,
            pathOption: "Executable - " + (_this.name || _this.cmd) + " - Path"
          };
          return Promise.reject(_this.commandNotFoundError(_this.name || _this.cmd, help));
        };
      })(this));
    };

    Executable.prototype.isSupported = function() {
      return this.isVersion(this.versionsSupported);
    };

    Executable.prototype.isVersion = function(range) {
      return this.versionSatisfies(this.version, range);
    };

    Executable.prototype.versionSatisfies = function(version, range) {
      return semver.satisfies(version, range);
    };

    Executable.prototype.getConfig = function() {
      return (typeof atom !== "undefined" && atom !== null ? atom.config.get(parentConfigKey + "." + this.key) : void 0) || {};
    };


    /*
    Run command-line interface command
     */

    Executable.prototype.run = function(args, options) {
      var cmd, cwd, exeName, help, ignoreReturnCode, onStdin, returnStderr, returnStdoutOrStderr;
      if (options == null) {
        options = {};
      }
      this.debug("Run: ", this.cmd, args, options);
      cmd = options.cmd, cwd = options.cwd, ignoreReturnCode = options.ignoreReturnCode, help = options.help, onStdin = options.onStdin, returnStderr = options.returnStderr, returnStdoutOrStderr = options.returnStdoutOrStderr;
      exeName = cmd || this.cmd;
      if (cwd == null) {
        cwd = os.tmpdir();
      }
      if (help == null) {
        help = {
          program: this.cmd,
          link: this.installation || this.homepage,
          pathOption: "Executable - " + (this.name || this.cmd) + " - Path"
        };
      }
      return Promise.all([this.shellEnv(), this.resolveArgs(args)]).then((function(_this) {
        return function(arg1) {
          var args, env, exePath;
          env = arg1[0], args = arg1[1];
          _this.debug('exeName, args:', exeName, args);
          exePath = _this.path(exeName);
          return Promise.all([exeName, args, env, exePath]);
        };
      })(this)).then((function(_this) {
        return function(arg1) {
          var args, env, exe, exeName, exePath, spawnOptions;
          exeName = arg1[0], args = arg1[1], env = arg1[2], exePath = arg1[3];
          _this.debug('exePath:', exePath);
          _this.debug('env:', env);
          _this.debug('PATH:', env.PATH);
          _this.debug('args', args);
          args = _this.relativizePaths(args);
          _this.debug('relativized args', args);
          exe = exePath != null ? exePath : exeName;
          spawnOptions = {
            cwd: cwd,
            env: env
          };
          _this.debug('spawnOptions', spawnOptions);
          return _this.spawn(exe, args, spawnOptions, onStdin).then(function(arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = arg2.returnCode, stdout = arg2.stdout, stderr = arg2.stderr;
            _this.verbose('spawn result, returnCode', returnCode);
            _this.verbose('spawn result, stdout', stdout);
            _this.verbose('spawn result, stderr', stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows() && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr || stdout);
              }
            } else {
              if (returnStdoutOrStderr) {
                return stdout || stderr;
              } else if (returnStderr) {
                return stderr;
              } else {
                return stdout;
              }
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };

    Executable.prototype.path = function(cmd) {
      var config, exeName;
      if (cmd == null) {
        cmd = this.cmd;
      }
      config = this.getConfig();
      if (config && config.path) {
        return Promise.resolve(config.path);
      } else {
        exeName = cmd;
        return this.which(exeName);
      }
    };

    Executable.prototype.resolveArgs = function(args) {
      args = _.flatten(args);
      return Promise.all(args);
    };

    Executable.prototype.relativizePaths = function(args) {
      var newArgs, tmpDir;
      tmpDir = os.tmpdir();
      newArgs = args.map(function(arg) {
        var isTmpFile;
        isTmpFile = typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && path.dirname(arg).startsWith(tmpDir);
        if (isTmpFile) {
          return path.relative(tmpDir, arg);
        }
        return arg;
      });
      return newArgs;
    };


    /*
    Spawn
     */

    Executable.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Executable.prototype.commandNotFoundError = function(exe, help) {
      if (exe == null) {
        exe = this.name || this.cmd;
      }
      return this.constructor.commandNotFoundError(exe, help);
    };

    Executable.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          docsLink = "https://github.com/Glavin001/atom-beautify#beautifiers";
          helpStr = "See " + exe + " installation instructions at " + docsLink + (help.link ? ' or go to ' + help.link : '') + "\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          helpStr += "Your program is properly installed if running '" + (this.isWindows() ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows() ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable.\n";
          if (help.additional) {
            helpStr += help.additional;
          }
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };

    Executable._envCache = null;

    Executable.prototype.shellEnv = function() {
      var env;
      env = this.constructor.shellEnv();
      this.debug("env", env);
      return env;
    };

    Executable.shellEnv = function() {
      return Promise.resolve(process.env);
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Executable.prototype.which = function(exe, options) {
      return this.constructor.which(exe, options);
    };

    Executable._whichCache = {};

    Executable.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      if (this._whichCache[exe]) {
        return Promise.resolve(this._whichCache[exe]);
      }
      return this.shellEnv().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows()) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = ((ref = process.env.PATHEXT) != null ? ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                return resolve(exe);
              }
              _this._whichCache[exe] = path;
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    If platform is Windows
     */

    Executable.prototype.isWindows = function() {
      return this.constructor.isWindows();
    };

    Executable.isWindows = function() {
      return new RegExp('^win').test(process.platform);
    };

    return Executable;

  })();

  HybridExecutable = (function(superClass) {
    extend(HybridExecutable, superClass);

    HybridExecutable.prototype.dockerOptions = {
      image: void 0,
      workingDir: "/workdir"
    };

    function HybridExecutable(options) {
      HybridExecutable.__super__.constructor.call(this, options);
      this.verbose("HybridExecutable Options", options);
      if (options.docker != null) {
        this.dockerOptions = Object.assign({}, this.dockerOptions, options.docker);
        this.docker = this.constructor.dockerExecutable();
      }
    }

    HybridExecutable.docker = void 0;

    HybridExecutable.dockerExecutable = function() {
      if (this.docker == null) {
        this.docker = new Executable({
          name: "Docker",
          cmd: "docker",
          homepage: "https://www.docker.com/",
          installation: "https://www.docker.com/get-docker",
          version: {
            parse: function(text) {
              return text.match(/version [0]*([1-9]\d*).[0]*([0-9]\d*).[0]*([0-9]\d*)/).slice(1).join('.');
            }
          }
        });
      }
      return this.docker;
    };

    HybridExecutable.prototype.installedWithDocker = false;

    HybridExecutable.prototype.init = function() {
      return HybridExecutable.__super__.init.call(this).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (_this.docker == null) {
            return Promise.reject(error);
          }
          return Promise.resolve(error);
        };
      })(this)).then((function(_this) {
        return function(errorOrThis) {
          var shouldTryWithDocker;
          shouldTryWithDocker = !_this.isInstalled && (_this.docker != null);
          _this.verbose("Executable shouldTryWithDocker", shouldTryWithDocker, _this.isInstalled, _this.docker != null);
          if (shouldTryWithDocker) {
            return _this.initDocker()["catch"](function() {
              return Promise.reject(errorOrThis);
            });
          }
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          if (!_this.required) {
            _this.verbose("Not required");
            return _this;
          } else {
            return Promise.reject(error);
          }
        };
      })(this));
    };

    HybridExecutable.prototype.initDocker = function() {
      return this.docker.init().then((function(_this) {
        return function() {
          return _this.runImage(_this.versionArgs, _this.versionRunOptions);
        };
      })(this)).then((function(_this) {
        return function(text) {
          return _this.saveVersion(text);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.installedWithDocker = true;
        };
      })(this)).then((function(_this) {
        return function() {
          return _this;
        };
      })(this))["catch"]((function(_this) {
        return function(dockerError) {
          _this.debug(dockerError);
          return Promise.reject(dockerError);
        };
      })(this));
    };

    HybridExecutable.prototype.run = function(args, options) {
      if (options == null) {
        options = {};
      }
      this.verbose("Running HybridExecutable");
      this.verbose("installedWithDocker", this.installedWithDocker);
      this.verbose("docker", this.docker);
      this.verbose("docker.isInstalled", this.docker && this.docker.isInstalled);
      if (this.installedWithDocker && this.docker && this.docker.isInstalled) {
        return this.runImage(args, options);
      }
      return HybridExecutable.__super__.run.call(this, args, options);
    };

    HybridExecutable.prototype.runImage = function(args, options) {
      this.debug("Run Docker executable: ", args, options);
      return this.resolveArgs(args).then((function(_this) {
        return function(args) {
          var cwd, image, newArgs, pwd, rootPath, tmpDir, workingDir;
          cwd = options.cwd;
          tmpDir = os.tmpdir();
          pwd = fs.realpathSync(cwd || tmpDir);
          image = _this.dockerOptions.image;
          workingDir = _this.dockerOptions.workingDir;
          rootPath = '/mountedRoot';
          newArgs = args.map(function(arg) {
            if (typeof arg === 'string' && !arg.includes(':') && path.isAbsolute(arg) && !path.dirname(arg).startsWith(tmpDir)) {
              return path.join(rootPath, arg);
            } else {
              return arg;
            }
          });
          return _this.docker.run(["run", "--rm", "--volume", pwd + ":" + workingDir, "--volume", (path.resolve('/')) + ":" + rootPath, "--workdir", workingDir, image, newArgs], Object.assign({}, options, {
            cmd: void 0
          }));
        };
      })(this));
    };

    return HybridExecutable;

  })(Executable);

  module.exports = HybridExecutable;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2V4ZWN1dGFibGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2RkFBQTtJQUFBOzs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQzs7RUFDakMsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFDVCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLGVBQUEsR0FBa0I7O0VBR1o7QUFFSixRQUFBOzt5QkFBQSxJQUFBLEdBQU07O3lCQUNOLEdBQUEsR0FBSzs7eUJBQ0wsR0FBQSxHQUFLOzt5QkFDTCxRQUFBLEdBQVU7O3lCQUNWLFlBQUEsR0FBYzs7eUJBQ2QsV0FBQSxHQUFhLENBQUMsV0FBRDs7eUJBQ2IsWUFBQSxHQUFjLFNBQUMsSUFBRDthQUFVLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYjtJQUFWOzt5QkFDZCxpQkFBQSxHQUFtQjs7eUJBQ25CLGlCQUFBLEdBQW1COzt5QkFDbkIsUUFBQSxHQUFVOztJQUVHLG9CQUFDLE9BQUQ7QUFFWCxVQUFBO01BQUEsSUFBSSxtQkFBSjtBQUNFLGNBQU0sSUFBSSxLQUFKLENBQVUsZ0VBQVYsRUFEUjs7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQztNQUNoQixJQUFDLENBQUEsR0FBRCxHQUFPLE9BQU8sQ0FBQztNQUNmLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFB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SUFBQSxDQURSO0lBRlE7Ozs7S0F6RW1COztFQXVHL0IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUEvY2pCIiwic291cmNlc0NvbnRlbnQiOlsiUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxud2hpY2ggPSByZXF1aXJlKCd3aGljaCcpXG5zcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3blxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuc2VtdmVyID0gcmVxdWlyZSgnc2VtdmVyJylcbm9zID0gcmVxdWlyZSgnb3MnKVxuZnMgPSByZXF1aXJlKCdmcycpXG5cbnBhcmVudENvbmZpZ0tleSA9IFwiYXRvbS1iZWF1dGlmeS5leGVjdXRhYmxlc1wiXG5cblxuY2xhc3MgRXhlY3V0YWJsZVxuXG4gIG5hbWU6IG51bGxcbiAgY21kOiBudWxsXG4gIGtleTogbnVsbFxuICBob21lcGFnZTogbnVsbFxuICBpbnN0YWxsYXRpb246IG51bGxcbiAgdmVyc2lvbkFyZ3M6IFsnLS12ZXJzaW9uJ11cbiAgdmVyc2lvblBhcnNlOiAodGV4dCkgLT4gc2VtdmVyLmNsZWFuKHRleHQpXG4gIHZlcnNpb25SdW5PcHRpb25zOiB7fVxuICB2ZXJzaW9uc1N1cHBvcnRlZDogJz49IDAuMC4wJ1xuICByZXF1aXJlZDogdHJ1ZVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICAjIFZhbGlkYXRpb25cbiAgICBpZiAhb3B0aW9ucy5jbWQ/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY29tbWFuZCAoaS5lLiBjbWQgcHJvcGVydHkpIGlzIHJlcXVpcmVkIGZvciBhbiBFeGVjdXRhYmxlLlwiKVxuICAgIEBuYW1lID0gb3B0aW9ucy5uYW1lXG4gICAgQGNtZCA9IG9wdGlvbnMuY21kXG4gICAgQGtleSA9IEBjbWRcbiAgICBAaG9tZXBhZ2UgPSBvcHRpb25zLmhvbWVwYWdlXG4gICAgQGluc3RhbGxhdGlvbiA9IG9wdGlvbnMuaW5zdGFsbGF0aW9uXG4gICAgQHJlcXVpcmVkID0gbm90IG9wdGlvbnMub3B0aW9uYWxcbiAgICBpZiBvcHRpb25zLnZlcnNpb24/XG4gICAgICB2ZXJzaW9uT3B0aW9ucyA9IG9wdGlvbnMudmVyc2lvblxuICAgICAgQHZlcnNpb25BcmdzID0gdmVyc2lvbk9wdGlvbnMuYXJncyBpZiB2ZXJzaW9uT3B0aW9ucy5hcmdzXG4gICAgICBAdmVyc2lvblBhcnNlID0gdmVyc2lvbk9wdGlvbnMucGFyc2UgaWYgdmVyc2lvbk9wdGlvbnMucGFyc2VcbiAgICAgIEB2ZXJzaW9uUnVuT3B0aW9ucyA9IHZlcnNpb25PcHRpb25zLnJ1bk9wdGlvbnMgaWYgdmVyc2lvbk9wdGlvbnMucnVuT3B0aW9uc1xuICAgICAgQHZlcnNpb25zU3VwcG9ydGVkID0gdmVyc2lvbk9wdGlvbnMuc3VwcG9ydGVkIGlmIHZlcnNpb25PcHRpb25zLnN1cHBvcnRlZFxuICAgIEBzZXR1cExvZ2dlcigpXG5cbiAgaW5pdDogKCkgLT5cbiAgICBQcm9taXNlLmFsbChbXG4gICAgICBAbG9hZFZlcnNpb24oKVxuICAgIF0pXG4gICAgICAudGhlbigoKSA9PiBAdmVyYm9zZShcIkRvbmUgaW5pdCBvZiAje0BuYW1lfVwiKSlcbiAgICAgIC50aGVuKCgpID0+IEApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBpZiBub3QgQC5yZXF1aXJlZFxuICAgICAgICAgIEB2ZXJib3NlKFwiTm90IHJlcXVpcmVkXCIpXG4gICAgICAgICAgQFxuICAgICAgICBlbHNlXG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICApXG5cbiAgIyMjXG4gIExvZ2dlciBpbnN0YW5jZVxuICAjIyNcbiAgbG9nZ2VyOiBudWxsXG4gICMjI1xuICBJbml0aWFsaXplIGFuZCBjb25maWd1cmUgTG9nZ2VyXG4gICMjI1xuICBzZXR1cExvZ2dlcjogLT5cbiAgICBAbG9nZ2VyID0gcmVxdWlyZSgnLi4vbG9nZ2VyJykoXCIje0BuYW1lfSBFeGVjdXRhYmxlXCIpXG4gICAgZm9yIGtleSwgbWV0aG9kIG9mIEBsb2dnZXJcbiAgICAgIEBba2V5XSA9IG1ldGhvZFxuICAgIEB2ZXJib3NlKFwiI3tAbmFtZX0gZXhlY3V0YWJsZSBsb2dnZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXCIpXG5cbiAgaXNJbnN0YWxsZWQgPSBudWxsXG4gIHZlcnNpb24gPSBudWxsXG4gIGxvYWRWZXJzaW9uOiAoZm9yY2UgPSBmYWxzZSkgLT5cbiAgICBAdmVyYm9zZShcImxvYWRWZXJzaW9uXCIsIEB2ZXJzaW9uLCBmb3JjZSlcbiAgICBpZiBmb3JjZSBvciAhQHZlcnNpb24/XG4gICAgICBAdmVyYm9zZShcIkxvYWRpbmcgdmVyc2lvbiB3aXRob3V0IGNhY2hlXCIpXG4gICAgICBAcnVuVmVyc2lvbigpXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiBAc2F2ZVZlcnNpb24odGV4dCkpXG4gICAgZWxzZVxuICAgICAgQHZlcmJvc2UoXCJMb2FkaW5nIGNhY2hlZCB2ZXJzaW9uXCIpXG4gICAgICBQcm9taXNlLnJlc29sdmUoQHZlcnNpb24pXG5cbiAgcnVuVmVyc2lvbjogKCkgLT5cbiAgICBAcnVuKEB2ZXJzaW9uQXJncywgQHZlcnNpb25SdW5PcHRpb25zKVxuICAgICAgLnRoZW4oKHZlcnNpb24pID0+XG4gICAgICAgIEBpbmZvKFwiVmVyc2lvbiB0ZXh0OiBcIiArIHZlcnNpb24pXG4gICAgICAgIHZlcnNpb25cbiAgICAgIClcblxuICBzYXZlVmVyc2lvbjogKHRleHQpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuKCA9PiBAdmVyc2lvblBhcnNlKHRleHQpKVxuICAgICAgLnRoZW4oKHZlcnNpb24pIC0+XG4gICAgICAgIHZhbGlkID0gQm9vbGVhbihzZW12ZXIudmFsaWQodmVyc2lvbikpXG4gICAgICAgIGlmIG5vdCB2YWxpZFxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZlcnNpb24gaXMgbm90IHZhbGlkOiBcIit2ZXJzaW9uKVxuICAgICAgICB2ZXJzaW9uXG4gICAgICApXG4gICAgICAudGhlbigodmVyc2lvbikgPT5cbiAgICAgICAgQGlzSW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgICBAdmVyc2lvbiA9IHZlcnNpb25cbiAgICAgIClcbiAgICAgIC50aGVuKCh2ZXJzaW9uKSA9PlxuICAgICAgICBAaW5mbyhcIiN7QGNtZH0gdmVyc2lvbjogI3t2ZXJzaW9ufVwiKVxuICAgICAgICB2ZXJzaW9uXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBAaXNJbnN0YWxsZWQgPSBmYWxzZVxuICAgICAgICBAZXJyb3IoZXJyb3IpXG4gICAgICAgIGhlbHAgPSB7XG4gICAgICAgICAgcHJvZ3JhbTogQGNtZFxuICAgICAgICAgIGxpbms6IEBpbnN0YWxsYXRpb24gb3IgQGhvbWVwYWdlXG4gICAgICAgICAgcGF0aE9wdGlvbjogXCJFeGVjdXRhYmxlIC0gI3tAbmFtZSBvciBAY21kfSAtIFBhdGhcIlxuICAgICAgICB9XG4gICAgICAgIFByb21pc2UucmVqZWN0KEBjb21tYW5kTm90Rm91bmRFcnJvcihAbmFtZSBvciBAY21kLCBoZWxwKSlcbiAgICAgIClcblxuICBpc1N1cHBvcnRlZDogKCkgLT5cbiAgICBAaXNWZXJzaW9uKEB2ZXJzaW9uc1N1cHBvcnRlZClcblxuICBpc1ZlcnNpb246IChyYW5nZSkgLT5cbiAgICBAdmVyc2lvblNhdGlzZmllcyhAdmVyc2lvbiwgcmFuZ2UpXG5cbiAgdmVyc2lvblNhdGlzZmllczogKHZlcnNpb24sIHJhbmdlKSAtPlxuICAgIHNlbXZlci5zYXRpc2ZpZXModmVyc2lvbiwgcmFuZ2UpXG5cbiAgZ2V0Q29uZmlnOiAoKSAtPlxuICAgIGF0b20/LmNvbmZpZy5nZXQoXCIje3BhcmVudENvbmZpZ0tleX0uI3tAa2V5fVwiKSBvciB7fVxuXG4gICMjI1xuICBSdW4gY29tbWFuZC1saW5lIGludGVyZmFjZSBjb21tYW5kXG4gICMjI1xuICBydW46IChhcmdzLCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlYnVnKFwiUnVuOiBcIiwgQGNtZCwgYXJncywgb3B0aW9ucylcbiAgICB7IGNtZCwgY3dkLCBpZ25vcmVSZXR1cm5Db2RlLCBoZWxwLCBvblN0ZGluLCByZXR1cm5TdGRlcnIsIHJldHVyblN0ZG91dE9yU3RkZXJyIH0gPSBvcHRpb25zXG4gICAgZXhlTmFtZSA9IGNtZCBvciBAY21kXG4gICAgY3dkID89IG9zLnRtcGRpcigpXG4gICAgaGVscCA/PSB7XG4gICAgICBwcm9ncmFtOiBAY21kXG4gICAgICBsaW5rOiBAaW5zdGFsbGF0aW9uIG9yIEBob21lcGFnZVxuICAgICAgcGF0aE9wdGlvbjogXCJFeGVjdXRhYmxlIC0gI3tAbmFtZSBvciBAY21kfSAtIFBhdGhcIlxuICAgIH1cblxuICAgICMgUmVzb2x2ZSBleGVjdXRhYmxlIGFuZCBhbGwgYXJnc1xuICAgIFByb21pc2UuYWxsKFtAc2hlbGxFbnYoKSwgdGhpcy5yZXNvbHZlQXJncyhhcmdzKV0pXG4gICAgICAudGhlbigoW2VudiwgYXJnc10pID0+XG4gICAgICAgIEBkZWJ1ZygnZXhlTmFtZSwgYXJnczonLCBleGVOYW1lLCBhcmdzKVxuICAgICAgICAjIEdldCBQQVRIIGFuZCBvdGhlciBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICAgICAgZXhlUGF0aCA9IEBwYXRoKGV4ZU5hbWUpXG4gICAgICAgIFByb21pc2UuYWxsKFtleGVOYW1lLCBhcmdzLCBlbnYsIGV4ZVBhdGhdKVxuICAgICAgKVxuICAgICAgLnRoZW4oKFtleGVOYW1lLCBhcmdzLCBlbnYsIGV4ZVBhdGhdKSA9PlxuICAgICAgICBAZGVidWcoJ2V4ZVBhdGg6JywgZXhlUGF0aClcbiAgICAgICAgQGRlYnVnKCdlbnY6JywgZW52KVxuICAgICAgICBAZGVidWcoJ1BBVEg6JywgZW52LlBBVEgpXG4gICAgICAgIEBkZWJ1ZygnYXJncycsIGFyZ3MpXG4gICAgICAgIGFyZ3MgPSB0aGlzLnJlbGF0aXZpemVQYXRocyhhcmdzKVxuICAgICAgICBAZGVidWcoJ3JlbGF0aXZpemVkIGFyZ3MnLCBhcmdzKVxuXG4gICAgICAgIGV4ZSA9IGV4ZVBhdGggPyBleGVOYW1lXG4gICAgICAgIHNwYXduT3B0aW9ucyA9IHtcbiAgICAgICAgICBjd2Q6IGN3ZFxuICAgICAgICAgIGVudjogZW52XG4gICAgICAgIH1cbiAgICAgICAgQGRlYnVnKCdzcGF3bk9wdGlvbnMnLCBzcGF3bk9wdGlvbnMpXG5cbiAgICAgICAgQHNwYXduKGV4ZSwgYXJncywgc3Bhd25PcHRpb25zLCBvblN0ZGluKVxuICAgICAgICAgIC50aGVuKCh7cmV0dXJuQ29kZSwgc3Rkb3V0LCBzdGRlcnJ9KSA9PlxuICAgICAgICAgICAgQHZlcmJvc2UoJ3NwYXduIHJlc3VsdCwgcmV0dXJuQ29kZScsIHJldHVybkNvZGUpXG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCBzdGRvdXQnLCBzdGRvdXQpXG4gICAgICAgICAgICBAdmVyYm9zZSgnc3Bhd24gcmVzdWx0LCBzdGRlcnInLCBzdGRlcnIpXG5cbiAgICAgICAgICAgICMgSWYgcmV0dXJuIGNvZGUgaXMgbm90IDAgdGhlbiBlcnJvciBvY2N1cmVkXG4gICAgICAgICAgICBpZiBub3QgaWdub3JlUmV0dXJuQ29kZSBhbmQgcmV0dXJuQ29kZSBpc250IDBcbiAgICAgICAgICAgICAgIyBvcGVyYWJsZSBwcm9ncmFtIG9yIGJhdGNoIGZpbGVcbiAgICAgICAgICAgICAgd2luZG93c1Byb2dyYW1Ob3RGb3VuZE1zZyA9IFwiaXMgbm90IHJlY29nbml6ZWQgYXMgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgY29tbWFuZFwiXG5cbiAgICAgICAgICAgICAgQHZlcmJvc2Uoc3RkZXJyLCB3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnKVxuXG4gICAgICAgICAgICAgIGlmIEBpc1dpbmRvd3MoKSBhbmQgcmV0dXJuQ29kZSBpcyAxIGFuZCBzdGRlcnIuaW5kZXhPZih3aW5kb3dzUHJvZ3JhbU5vdEZvdW5kTXNnKSBpc250IC0xXG4gICAgICAgICAgICAgICAgdGhyb3cgQGNvbW1hbmROb3RGb3VuZEVycm9yKGV4ZU5hbWUsIGhlbHApXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyIG9yIHN0ZG91dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgaWYgcmV0dXJuU3Rkb3V0T3JTdGRlcnJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Rkb3V0IG9yIHN0ZGVyclxuICAgICAgICAgICAgICBlbHNlIGlmIHJldHVyblN0ZGVyclxuICAgICAgICAgICAgICAgIHN0ZGVyclxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3Rkb3V0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PlxuICAgICAgICAgICAgQGRlYnVnKCdlcnJvcicsIGVycilcblxuICAgICAgICAgICAgIyBDaGVjayBpZiBlcnJvciBpcyBFTk9FTlQgKGNvbW1hbmQgY291bGQgbm90IGJlIGZvdW5kKVxuICAgICAgICAgICAgaWYgZXJyLmNvZGUgaXMgJ0VOT0VOVCcgb3IgZXJyLmVycm5vIGlzICdFTk9FTlQnXG4gICAgICAgICAgICAgIHRocm93IEBjb21tYW5kTm90Rm91bmRFcnJvcihleGVOYW1lLCBoZWxwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAjIGNvbnRpbnVlIGFzIG5vcm1hbCBlcnJvclxuICAgICAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgICApXG4gICAgICApXG5cbiAgcGF0aDogKGNtZCA9IEBjbWQpIC0+XG4gICAgY29uZmlnID0gQGdldENvbmZpZygpXG4gICAgaWYgY29uZmlnIGFuZCBjb25maWcucGF0aFxuICAgICAgUHJvbWlzZS5yZXNvbHZlKGNvbmZpZy5wYXRoKVxuICAgIGVsc2VcbiAgICAgIGV4ZU5hbWUgPSBjbWRcbiAgICAgIEB3aGljaChleGVOYW1lKVxuXG4gIHJlc29sdmVBcmdzOiAoYXJncykgLT5cbiAgICBhcmdzID0gXy5mbGF0dGVuKGFyZ3MpXG4gICAgUHJvbWlzZS5hbGwoYXJncylcblxuICByZWxhdGl2aXplUGF0aHM6IChhcmdzKSAtPlxuICAgIHRtcERpciA9IG9zLnRtcGRpcigpXG4gICAgbmV3QXJncyA9IGFyZ3MubWFwKChhcmcpIC0+XG4gICAgICBpc1RtcEZpbGUgPSAodHlwZW9mIGFyZyBpcyAnc3RyaW5nJyBhbmQgbm90IGFyZy5pbmNsdWRlcygnOicpIGFuZCBcXFxuICAgICAgICBwYXRoLmlzQWJzb2x1dGUoYXJnKSBhbmQgcGF0aC5kaXJuYW1lKGFyZykuc3RhcnRzV2l0aCh0bXBEaXIpKVxuICAgICAgaWYgaXNUbXBGaWxlXG4gICAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRtcERpciwgYXJnKVxuICAgICAgcmV0dXJuIGFyZ1xuICAgIClcbiAgICBuZXdBcmdzXG5cbiAgIyMjXG4gIFNwYXduXG4gICMjI1xuICBzcGF3bjogKGV4ZSwgYXJncywgb3B0aW9ucywgb25TdGRpbikgLT5cbiAgICAjIFJlbW92ZSB1bmRlZmluZWQvbnVsbCB2YWx1ZXNcbiAgICBhcmdzID0gXy53aXRob3V0KGFyZ3MsIHVuZGVmaW5lZClcbiAgICBhcmdzID0gXy53aXRob3V0KGFyZ3MsIG51bGwpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBkZWJ1Zygnc3Bhd24nLCBleGUsIGFyZ3MpXG5cbiAgICAgIGNtZCA9IHNwYXduKGV4ZSwgYXJncywgb3B0aW9ucylcbiAgICAgIHN0ZG91dCA9IFwiXCJcbiAgICAgIHN0ZGVyciA9IFwiXCJcblxuICAgICAgY21kLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSAtPlxuICAgICAgICBzdGRvdXQgKz0gZGF0YVxuICAgICAgKVxuICAgICAgY21kLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSAtPlxuICAgICAgICBzdGRlcnIgKz0gZGF0YVxuICAgICAgKVxuICAgICAgY21kLm9uKCdjbG9zZScsIChyZXR1cm5Db2RlKSA9PlxuICAgICAgICBAZGVidWcoJ3NwYXduIGRvbmUnLCByZXR1cm5Db2RlLCBzdGRlcnIsIHN0ZG91dClcbiAgICAgICAgcmVzb2x2ZSh7cmV0dXJuQ29kZSwgc3Rkb3V0LCBzdGRlcnJ9KVxuICAgICAgKVxuICAgICAgY21kLm9uKCdlcnJvcicsIChlcnIpID0+XG4gICAgICAgIEBkZWJ1ZygnZXJyb3InLCBlcnIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICApXG5cbiAgICAgIG9uU3RkaW4gY21kLnN0ZGluIGlmIG9uU3RkaW5cbiAgICApXG5cblxuICAjIyNcbiAgQWRkIGhlbHAgdG8gZXJyb3IuZGVzY3JpcHRpb25cblxuICBOb3RlOiBlcnJvci5kZXNjcmlwdGlvbiBpcyBub3Qgb2ZmaWNpYWxseSB1c2VkIGluIEphdmFTY3JpcHQsXG4gIGhvd2V2ZXIgaXQgaXMgdXNlZCBpbnRlcm5hbGx5IGZvciBBdG9tIEJlYXV0aWZ5IHdoZW4gZGlzcGxheWluZyBlcnJvcnMuXG4gICMjI1xuICBjb21tYW5kTm90Rm91bmRFcnJvcjogKGV4ZSwgaGVscCkgLT5cbiAgICBleGUgPz0gQG5hbWUgb3IgQGNtZFxuICAgIEBjb25zdHJ1Y3Rvci5jb21tYW5kTm90Rm91bmRFcnJvcihleGUsIGhlbHApXG5cbiAgQGNvbW1hbmROb3RGb3VuZEVycm9yOiAoZXhlLCBoZWxwKSAtPlxuICAgICMgQ3JlYXRlIG5ldyBpbXByb3ZlZCBlcnJvclxuICAgICMgbm90aWZ5IHVzZXIgdGhhdCBpdCBtYXkgbm90IGJlXG4gICAgIyBpbnN0YWxsZWQgb3IgaW4gcGF0aFxuICAgIG1lc3NhZ2UgPSBcIkNvdWxkIG5vdCBmaW5kICcje2V4ZX0nLiBcXFxuICAgICAgICAgICAgVGhlIHByb2dyYW0gbWF5IG5vdCBiZSBpbnN0YWxsZWQuXCJcbiAgICBlciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgIGVyLmNvZGUgPSAnQ29tbWFuZE5vdEZvdW5kJ1xuICAgIGVyLmVycm5vID0gZXIuY29kZVxuICAgIGVyLnN5c2NhbGwgPSAnYmVhdXRpZmllcjo6cnVuJ1xuICAgIGVyLmZpbGUgPSBleGVcbiAgICBpZiBoZWxwP1xuICAgICAgaWYgdHlwZW9mIGhlbHAgaXMgXCJvYmplY3RcIlxuICAgICAgICAjIEJhc2ljIG5vdGljZVxuICAgICAgICBkb2NzTGluayA9IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5I2JlYXV0aWZpZXJzXCJcbiAgICAgICAgaGVscFN0ciA9IFwiU2VlICN7ZXhlfSBpbnN0YWxsYXRpb24gaW5zdHJ1Y3Rpb25zIGF0ICN7ZG9jc0xpbmt9I3tpZiBoZWxwLmxpbmsgdGhlbiAoJyBvciBnbyB0byAnK2hlbHAubGluaykgZWxzZSAnJ31cXG5cIlxuICAgICAgICAjICMgSGVscCB0byBjb25maWd1cmUgQXRvbSBCZWF1dGlmeSBmb3IgcHJvZ3JhbSdzIHBhdGhcbiAgICAgICAgaGVscFN0ciArPSBcIllvdSBjYW4gY29uZmlndXJlIEF0b20gQmVhdXRpZnkgXFxcbiAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgYWJzb2x1dGUgcGF0aCBcXFxuICAgICAgICAgICAgICAgICAgICB0byAnI3toZWxwLnByb2dyYW0gb3IgZXhlfScgYnkgc2V0dGluZyBcXFxuICAgICAgICAgICAgICAgICAgICAnI3toZWxwLnBhdGhPcHRpb259JyBpbiBcXFxuICAgICAgICAgICAgICAgICAgICB0aGUgQXRvbSBCZWF1dGlmeSBwYWNrYWdlIHNldHRpbmdzLlxcblwiIGlmIGhlbHAucGF0aE9wdGlvblxuICAgICAgICBoZWxwU3RyICs9IFwiWW91ciBwcm9ncmFtIGlzIHByb3Blcmx5IGluc3RhbGxlZCBpZiBydW5uaW5nIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyN7aWYgQGlzV2luZG93cygpIHRoZW4gJ3doZXJlLmV4ZScgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICd3aGljaCd9ICN7ZXhlfScgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB5b3VyICN7aWYgQGlzV2luZG93cygpIHRoZW4gJ0NNRCBwcm9tcHQnIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAnVGVybWluYWwnfSBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybnMgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZXhlY3V0YWJsZS5cXG5cIlxuICAgICAgICAjICMgT3B0aW9uYWwsIGFkZGl0aW9uYWwgaGVscFxuICAgICAgICBoZWxwU3RyICs9IGhlbHAuYWRkaXRpb25hbCBpZiBoZWxwLmFkZGl0aW9uYWxcbiAgICAgICAgZXIuZGVzY3JpcHRpb24gPSBoZWxwU3RyXG4gICAgICBlbHNlICNpZiB0eXBlb2YgaGVscCBpcyBcInN0cmluZ1wiXG4gICAgICAgIGVyLmRlc2NyaXB0aW9uID0gaGVscFxuICAgIHJldHVybiBlclxuXG5cbiAgQF9lbnZDYWNoZSA9IG51bGxcbiAgc2hlbGxFbnY6ICgpIC0+XG4gICAgZW52ID0gQGNvbnN0cnVjdG9yLnNoZWxsRW52KClcbiAgICBAZGVidWcoXCJlbnZcIiwgZW52KVxuICAgIHJldHVybiBlbnZcbiAgQHNoZWxsRW52OiAoKSAtPlxuICAgIFByb21pc2UucmVzb2x2ZShwcm9jZXNzLmVudilcblxuICAjIyNcbiAgTGlrZSB0aGUgdW5peCB3aGljaCB1dGlsaXR5LlxuXG4gIEZpbmRzIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhIHNwZWNpZmllZCBleGVjdXRhYmxlIGluIHRoZSBQQVRIIGVudmlyb25tZW50IHZhcmlhYmxlLlxuICBEb2VzIG5vdCBjYWNoZSB0aGUgcmVzdWx0cyxcbiAgc28gaGFzaCAtciBpcyBub3QgbmVlZGVkIHdoZW4gdGhlIFBBVEggY2hhbmdlcy5cbiAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS13aGljaFxuICAjIyNcbiAgd2hpY2g6IChleGUsIG9wdGlvbnMpIC0+XG4gICAgQC5jb25zdHJ1Y3Rvci53aGljaChleGUsIG9wdGlvbnMpXG4gIEBfd2hpY2hDYWNoZSA9IHt9XG4gIEB3aGljaDogKGV4ZSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGlmIEBfd2hpY2hDYWNoZVtleGVdXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEBfd2hpY2hDYWNoZVtleGVdKVxuICAgICMgR2V0IFBBVEggYW5kIG90aGVyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgIEBzaGVsbEVudigpXG4gICAgICAudGhlbigoZW52KSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgIG9wdGlvbnMucGF0aCA/PSBlbnYuUEFUSFxuICAgICAgICAgIGlmIEBpc1dpbmRvd3MoKVxuICAgICAgICAgICAgIyBFbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgaW4gd2luZG93c1xuICAgICAgICAgICAgIyBDaGVjayBlbnYgZm9yIGEgY2FzZS1pbnNlbnNpdGl2ZSAncGF0aCcgdmFyaWFibGVcbiAgICAgICAgICAgIGlmICFvcHRpb25zLnBhdGhcbiAgICAgICAgICAgICAgZm9yIGkgb2YgZW52XG4gICAgICAgICAgICAgICAgaWYgaS50b0xvd2VyQ2FzZSgpIGlzIFwicGF0aFwiXG4gICAgICAgICAgICAgICAgICBvcHRpb25zLnBhdGggPSBlbnZbaV1cbiAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICMgVHJpY2sgbm9kZS13aGljaCBpbnRvIGluY2x1ZGluZyBmaWxlc1xuICAgICAgICAgICAgIyB3aXRoIG5vIGV4dGVuc2lvbiBhcyBleGVjdXRhYmxlcy5cbiAgICAgICAgICAgICMgUHV0IGVtcHR5IGV4dGVuc2lvbiBsYXN0IHRvIGFsbG93IGZvciBvdGhlciByZWFsIGV4dGVuc2lvbnMgZmlyc3RcbiAgICAgICAgICAgIG9wdGlvbnMucGF0aEV4dCA/PSBcIiN7cHJvY2Vzcy5lbnYuUEFUSEVYVCA/ICcuRVhFJ307XCJcbiAgICAgICAgICB3aGljaChleGUsIG9wdGlvbnMsIChlcnIsIHBhdGgpID0+XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShleGUpIGlmIGVyclxuICAgICAgICAgICAgQF93aGljaENhY2hlW2V4ZV0gPSBwYXRoXG4gICAgICAgICAgICByZXNvbHZlKHBhdGgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgIyMjXG4gIElmIHBsYXRmb3JtIGlzIFdpbmRvd3NcbiAgIyMjXG4gIGlzV2luZG93czogKCkgLT4gQGNvbnN0cnVjdG9yLmlzV2luZG93cygpXG4gIEBpc1dpbmRvd3M6ICgpIC0+IG5ldyBSZWdFeHAoJ153aW4nKS50ZXN0KHByb2Nlc3MucGxhdGZvcm0pXG5cbmNsYXNzIEh5YnJpZEV4ZWN1dGFibGUgZXh0ZW5kcyBFeGVjdXRhYmxlXG5cbiAgZG9ja2VyT3B0aW9uczoge1xuICAgIGltYWdlOiB1bmRlZmluZWRcbiAgICB3b3JraW5nRGlyOiBcIi93b3JrZGlyXCJcbiAgfVxuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBzdXBlcihvcHRpb25zKVxuICAgIEB2ZXJib3NlKFwiSHlicmlkRXhlY3V0YWJsZSBPcHRpb25zXCIsIG9wdGlvbnMpXG4gICAgaWYgb3B0aW9ucy5kb2NrZXI/XG4gICAgICBAZG9ja2VyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIEBkb2NrZXJPcHRpb25zLCBvcHRpb25zLmRvY2tlcilcbiAgICAgIEBkb2NrZXIgPSBAY29uc3RydWN0b3IuZG9ja2VyRXhlY3V0YWJsZSgpXG5cbiAgQGRvY2tlcjogdW5kZWZpbmVkXG4gIEBkb2NrZXJFeGVjdXRhYmxlOiAoKSAtPlxuICAgIGlmIG5vdCBAZG9ja2VyP1xuICAgICAgQGRvY2tlciA9IG5ldyBFeGVjdXRhYmxlKHtcbiAgICAgICAgbmFtZTogXCJEb2NrZXJcIlxuICAgICAgICBjbWQ6IFwiZG9ja2VyXCJcbiAgICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9cIlxuICAgICAgICBpbnN0YWxsYXRpb246IFwiaHR0cHM6Ly93d3cuZG9ja2VyLmNvbS9nZXQtZG9ja2VyXCJcbiAgICAgICAgdmVyc2lvbjoge1xuICAgICAgICAgIHBhcnNlOiAodGV4dCkgLT4gdGV4dC5tYXRjaCgvdmVyc2lvbiBbMF0qKFsxLTldXFxkKikuWzBdKihbMC05XVxcZCopLlswXSooWzAtOV1cXGQqKS8pLnNsaWNlKDEpLmpvaW4oJy4nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiBAZG9ja2VyXG5cbiAgaW5zdGFsbGVkV2l0aERvY2tlcjogZmFsc2VcbiAgaW5pdDogKCkgLT5cbiAgICBzdXBlcigpXG4gICAgICAudGhlbigoKSA9PlxuICAgICAgICByZXR1cm4gQFxuICAgICAgKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKSBpZiBub3QgQGRvY2tlcj9cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlcnJvcilcbiAgICAgIClcbiAgICAgIC50aGVuKChlcnJvck9yVGhpcykgPT5cbiAgICAgICAgc2hvdWxkVHJ5V2l0aERvY2tlciA9IG5vdCBAaXNJbnN0YWxsZWQgYW5kIEBkb2NrZXI/XG4gICAgICAgIEB2ZXJib3NlKFwiRXhlY3V0YWJsZSBzaG91bGRUcnlXaXRoRG9ja2VyXCIsIHNob3VsZFRyeVdpdGhEb2NrZXIsIEBpc0luc3RhbGxlZCwgQGRvY2tlcj8pXG4gICAgICAgIGlmIHNob3VsZFRyeVdpdGhEb2NrZXJcbiAgICAgICAgICByZXR1cm4gQGluaXREb2NrZXIoKS5jYXRjaCgoKSAtPiBQcm9taXNlLnJlamVjdChlcnJvck9yVGhpcykpXG4gICAgICAgIHJldHVybiBAXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBpZiBub3QgQC5yZXF1aXJlZFxuICAgICAgICAgIEB2ZXJib3NlKFwiTm90IHJlcXVpcmVkXCIpXG4gICAgICAgICAgQFxuICAgICAgICBlbHNlXG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICApXG5cbiAgaW5pdERvY2tlcjogKCkgLT5cbiAgICBAZG9ja2VyLmluaXQoKVxuICAgICAgLnRoZW4oPT4gQHJ1bkltYWdlKEB2ZXJzaW9uQXJncywgQHZlcnNpb25SdW5PcHRpb25zKSlcbiAgICAgIC50aGVuKCh0ZXh0KSA9PiBAc2F2ZVZlcnNpb24odGV4dCkpXG4gICAgICAudGhlbigoKSA9PiBAaW5zdGFsbGVkV2l0aERvY2tlciA9IHRydWUpXG4gICAgICAudGhlbig9PiBAKVxuICAgICAgLmNhdGNoKChkb2NrZXJFcnJvcikgPT5cbiAgICAgICAgQGRlYnVnKGRvY2tlckVycm9yKVxuICAgICAgICBQcm9taXNlLnJlamVjdChkb2NrZXJFcnJvcilcbiAgICAgIClcblxuICBydW46IChhcmdzLCBvcHRpb25zID0ge30pIC0+XG4gICAgQHZlcmJvc2UoXCJSdW5uaW5nIEh5YnJpZEV4ZWN1dGFibGVcIilcbiAgICBAdmVyYm9zZShcImluc3RhbGxlZFdpdGhEb2NrZXJcIiwgQGluc3RhbGxlZFdpdGhEb2NrZXIpXG4gICAgQHZlcmJvc2UoXCJkb2NrZXJcIiwgQGRvY2tlcilcbiAgICBAdmVyYm9zZShcImRvY2tlci5pc0luc3RhbGxlZFwiLCBAZG9ja2VyIGFuZCBAZG9ja2VyLmlzSW5zdGFsbGVkKVxuICAgIGlmIEBpbnN0YWxsZWRXaXRoRG9ja2VyIGFuZCBAZG9ja2VyIGFuZCBAZG9ja2VyLmlzSW5zdGFsbGVkXG4gICAgICByZXR1cm4gQHJ1bkltYWdlKGFyZ3MsIG9wdGlvbnMpXG4gICAgc3VwZXIoYXJncywgb3B0aW9ucylcblxuICBydW5JbWFnZTogKGFyZ3MsIG9wdGlvbnMpIC0+XG4gICAgQGRlYnVnKFwiUnVuIERvY2tlciBleGVjdXRhYmxlOiBcIiwgYXJncywgb3B0aW9ucylcbiAgICB0aGlzLnJlc29sdmVBcmdzKGFyZ3MpXG4gICAgICAudGhlbigoYXJncykgPT5cbiAgICAgICAgeyBjd2QgfSA9IG9wdGlvbnNcbiAgICAgICAgdG1wRGlyID0gb3MudG1wZGlyKClcbiAgICAgICAgcHdkID0gZnMucmVhbHBhdGhTeW5jKGN3ZCBvciB0bXBEaXIpXG4gICAgICAgIGltYWdlID0gQGRvY2tlck9wdGlvbnMuaW1hZ2VcbiAgICAgICAgd29ya2luZ0RpciA9IEBkb2NrZXJPcHRpb25zLndvcmtpbmdEaXJcblxuICAgICAgICByb290UGF0aCA9ICcvbW91bnRlZFJvb3QnXG4gICAgICAgIG5ld0FyZ3MgPSBhcmdzLm1hcCgoYXJnKSAtPlxuICAgICAgICAgIGlmICh0eXBlb2YgYXJnIGlzICdzdHJpbmcnIGFuZCBub3QgYXJnLmluY2x1ZGVzKCc6JykgXFxcbiAgICAgICAgICAgIGFuZCBwYXRoLmlzQWJzb2x1dGUoYXJnKSBhbmQgbm90IHBhdGguZGlybmFtZShhcmcpLnN0YXJ0c1dpdGgodG1wRGlyKSkgXFxcbiAgICAgICAgICAgIHRoZW4gcGF0aC5qb2luKHJvb3RQYXRoLCBhcmcpIGVsc2UgYXJnXG4gICAgICAgIClcblxuICAgICAgICBAZG9ja2VyLnJ1bihbXG4gICAgICAgICAgICBcInJ1blwiLFxuICAgICAgICAgICAgXCItLXJtXCIsXG4gICAgICAgICAgICBcIi0tdm9sdW1lXCIsIFwiI3twd2R9OiN7d29ya2luZ0Rpcn1cIixcbiAgICAgICAgICAgIFwiLS12b2x1bWVcIiwgXCIje3BhdGgucmVzb2x2ZSgnLycpfToje3Jvb3RQYXRofVwiLFxuICAgICAgICAgICAgXCItLXdvcmtkaXJcIiwgd29ya2luZ0RpcixcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgbmV3QXJnc1xuICAgICAgICAgIF0sXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgeyBjbWQ6IHVuZGVmaW5lZCB9KVxuICAgICAgICApXG4gICAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gSHlicmlkRXhlY3V0YWJsZVxuIl19
