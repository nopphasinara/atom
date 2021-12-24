(function() {
  var DownloadCmd, EventEmitter, FtpTransport, Host, HostView, MonitoredFiles, RemoteSync, ScpTransport, chokidar, exec, fs, getLogger, logger, minimatch, path, randomize, uploadCmd, watchChangeSet, watchFiles, watcher,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  fs = require("fs-plus");

  chokidar = require("chokidar");

  randomize = require("randomatic");

  exec = null;

  minimatch = null;

  ScpTransport = null;

  FtpTransport = null;

  uploadCmd = null;

  DownloadCmd = null;

  Host = null;

  HostView = null;

  EventEmitter = null;

  MonitoredFiles = [];

  watchFiles = {};

  watchChangeSet = false;

  watcher = chokidar.watch();

  logger = null;

  getLogger = function() {
    var Logger;
    if (!logger) {
      Logger = require("./Logger");
      logger = new Logger("Remote Sync");
    }
    return logger;
  };

  RemoteSync = (function() {
    function RemoteSync(projectPath1, configPath1) {
      var ref;
      this.projectPath = projectPath1;
      this.configPath = configPath1;
      if (Host == null) {
        Host = require('./model/host');
      }
      this.host = new Host(this.configPath, getLogger());
      watchFiles = (ref = this.host.watch) != null ? ref.split(",").filter(Boolean) : void 0;
      if (this.host.source) {
        this.projectPath = path.join(this.projectPath, this.host.source);
      }
      if (watchFiles != null) {
        this.initAutoFileWatch(this.projectPath);
      }
      this.initIgnore(this.host);
      this.initMonitor();
    }

    RemoteSync.prototype.initIgnore = function(host) {
      var ignore, ref;
      ignore = (ref = host.ignore) != null ? ref.split(",") : void 0;
      return host.isIgnore = (function(_this) {
        return function(filePath, relativizePath) {
          var i, len, pattern;
          if (!(relativizePath || _this.inPath(_this.projectPath, filePath))) {
            return true;
          }
          if (!ignore) {
            return false;
          }
          if (!relativizePath) {
            relativizePath = _this.projectPath;
          }
          filePath = path.relative(relativizePath, filePath);
          if (minimatch == null) {
            minimatch = require("minimatch");
          }
          for (i = 0, len = ignore.length; i < len; i++) {
            pattern = ignore[i];
            if (minimatch(filePath, pattern, {
              matchBase: true,
              dot: true
            })) {
              return true;
            }
          }
          return false;
        };
      })(this);
    };

    RemoteSync.prototype.isIgnore = function(filePath, relativizePath) {
      return this.host.isIgnore(filePath, relativizePath);
    };

    RemoteSync.prototype.inPath = function(rootPath, localPath) {
      if (fs.isDirectorySync(localPath)) {
        localPath = localPath + path.sep;
      }
      return localPath.indexOf(rootPath + path.sep) === 0;
    };

    RemoteSync.prototype.dispose = function() {
      if (this.transport) {
        this.transport.dispose();
        return this.transport = null;
      }
    };

    RemoteSync.prototype.deleteFile = function(filePath) {
      var UploadListener, i, len, ref, t;
      if (this.isIgnore(filePath)) {
        return;
      }
      if (!uploadCmd) {
        UploadListener = require("./UploadListener");
        uploadCmd = new UploadListener(getLogger());
      }
      uploadCmd.handleDelete(filePath, this.getTransport());
      ref = this.getUploadMirrors();
      for (i = 0, len = ref.length; i < len; i++) {
        t = ref[i];
        uploadCmd.handleDelete(filePath, t);
      }
      if (this.host.deleteLocal) {
        return fs.removeSync(filePath);
      }
    };

    RemoteSync.prototype.downloadFolder = function(localPath, targetPath, callback) {
      if (DownloadCmd == null) {
        DownloadCmd = require('./commands/DownloadAllCommand');
      }
      return DownloadCmd.run(getLogger(), this.getTransport(), localPath, targetPath, callback);
    };

    RemoteSync.prototype.downloadFile = function(localPath) {
      var realPath;
      if (this.isIgnore(localPath)) {
        return;
      }
      realPath = path.relative(this.projectPath, localPath);
      realPath = path.join(this.host.target, realPath).replace(/\\/g, "/");
      return this.getTransport().download(realPath);
    };

    RemoteSync.prototype.uploadFile = function(filePath) {
      var UploadListener, e, i, j, len, len1, ref, ref1, results, t;
      if (this.isIgnore(filePath)) {
        return;
      }
      if (!uploadCmd) {
        UploadListener = require("./UploadListener");
        uploadCmd = new UploadListener(getLogger());
      }
      if (this.host.saveOnUpload) {
        ref = atom.workspace.getTextEditors();
        for (i = 0, len = ref.length; i < len; i++) {
          e = ref[i];
          if (e.getPath() === filePath && e.isModified()) {
            e.save();
            if (this.host.uploadOnSave) {
              return;
            }
          }
        }
      }
      uploadCmd.handleSave(filePath, this.getTransport());
      ref1 = this.getUploadMirrors();
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        t = ref1[j];
        results.push(uploadCmd.handleSave(filePath, t));
      }
      return results;
    };

    RemoteSync.prototype.uploadFolder = function(dirPath) {
      return fs.traverseTree(dirPath, this.uploadFile.bind(this), (function(_this) {
        return function() {
          return !_this.isIgnore(dirPath);
        };
      })(this), (function() {}));
    };

    RemoteSync.prototype.initMonitor = function() {
      var _this;
      _this = this;
      return setTimeout(function() {
        var MutationObserver, observer, targetObject;
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        observer = new MutationObserver(function(mutations, observer) {
          _this.monitorStyles();
        });
        targetObject = document.querySelector('.tree-view');
        if (targetObject !== null) {
          return observer.observe(targetObject, {
            subtree: true,
            attributes: false,
            childList: true
          });
        }
      }, 250);
    };

    RemoteSync.prototype.monitorFile = function(dirPath, toggle, notifications) {
      var _this, fileName, index;
      if (toggle == null) {
        toggle = true;
      }
      if (notifications == null) {
        notifications = true;
      }
      if (!this.fileExists(dirPath) && !this.isDirectory(dirPath)) {
        return;
      }
      fileName = this.monitorFileName(dirPath);
      if (indexOf.call(MonitoredFiles, dirPath) < 0) {
        MonitoredFiles.push(dirPath);
        watcher.add(dirPath);
        if (notifications) {
          atom.notifications.addInfo("remote-sync: Watching file - *" + fileName + "*");
        }
        if (!watchChangeSet) {
          _this = this;
          watcher.on('change', function(path) {
            return _this.uploadFile(path);
          });
          watcher.on('unlink', function(path) {
            return _this.deleteFile(path);
          });
          watchChangeSet = true;
        }
      } else if (toggle) {
        watcher.unwatch(dirPath);
        index = MonitoredFiles.indexOf(dirPath);
        MonitoredFiles.splice(index, 1);
        if (notifications) {
          atom.notifications.addInfo("remote-sync: Unwatching file - *" + fileName + "*");
        }
      }
      return this.monitorStyles();
    };

    RemoteSync.prototype.monitorStyles = function() {
      var file, file_name, i, icon_file, item, j, len, len1, list_item, monitorClass, monitored, pulseClass, results;
      monitorClass = 'file-monitoring';
      pulseClass = 'pulse';
      monitored = document.querySelectorAll('.' + monitorClass);
      if (monitored !== null && monitored.length !== 0) {
        for (i = 0, len = monitored.length; i < len; i++) {
          item = monitored[i];
          item.classList.remove(monitorClass);
        }
      }
      results = [];
      for (j = 0, len1 = MonitoredFiles.length; j < len1; j++) {
        file = MonitoredFiles[j];
        file_name = file.replace(/(['"])/g, "\\$1");
        file_name = file.replace(/\\/g, '\\\\');
        icon_file = document.querySelector('[data-path="' + file_name + '"]');
        if (icon_file !== null) {
          list_item = icon_file.parentNode;
          list_item.classList.add(monitorClass);
          if (atom.config.get("remote-sync.monitorFileAnimation")) {
            results.push(list_item.classList.add(pulseClass));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    RemoteSync.prototype.monitorFilesList = function() {
      var file, files, i, k, len, ref, v, watchedPaths;
      files = "";
      watchedPaths = watcher.getWatched();
      for (k in watchedPaths) {
        v = watchedPaths[k];
        ref = watchedPaths[k];
        for (i = 0, len = ref.length; i < len; i++) {
          file = ref[i];
          files += file + "<br/>";
        }
      }
      if (files !== "") {
        return atom.notifications.addInfo("remote-sync: Currently watching:<br/>*" + files + "*");
      } else {
        return atom.notifications.addWarning("remote-sync: Currently not watching any files");
      }
    };

    RemoteSync.prototype.fileExists = function(dirPath) {
      var e, exists, file_name;
      file_name = this.monitorFileName(dirPath);
      try {
        exists = fs.statSync(dirPath);
        return true;
      } catch (error) {
        e = error;
        atom.notifications.addWarning("remote-sync: cannot find *" + file_name + "* to watch");
        return false;
      }
    };

    RemoteSync.prototype.isDirectory = function(dirPath) {
      var directory;
      if (directory = fs.statSync(dirPath).isDirectory()) {
        atom.notifications.addWarning("remote-sync: cannot watch directory - *" + dirPath + "*");
        return false;
      }
      return true;
    };

    RemoteSync.prototype.monitorFileName = function(dirPath) {
      var file;
      file = dirPath.split('\\').pop().split('/').pop();
      return file;
    };

    RemoteSync.prototype.initAutoFileWatch = function(projectPath) {
      var _this, filesName, i, len;
      _this = this;
      if (watchFiles.length !== 0) {
        for (i = 0, len = watchFiles.length; i < len; i++) {
          filesName = watchFiles[i];
          _this.setupAutoFileWatch(filesName, projectPath);
        }
        setTimeout(function() {
          return _this.monitorFilesList();
        }, 1500);
      }
    };

    RemoteSync.prototype.setupAutoFileWatch = function(filesName, projectPath) {
      var _this;
      _this = this;
      return setTimeout(function() {
        var fullpath;
        if (process.platform === "win32") {
          filesName = filesName.replace(/\//g, '\\');
        }
        fullpath = projectPath + filesName.replace(/^\s+|\s+$/g, "");
        return _this.monitorFile(fullpath, false, false);
      }, 250);
    };

    RemoteSync.prototype.uploadGitChange = function(dirPath) {
      var curRepo, i, isChangedPath, len, repo, repos, workingDirectory;
      repos = atom.project.getRepositories();
      curRepo = null;
      for (i = 0, len = repos.length; i < len; i++) {
        repo = repos[i];
        if (!repo) {
          continue;
        }
        workingDirectory = repo.getWorkingDirectory();
        if (this.inPath(workingDirectory, this.projectPath)) {
          curRepo = repo;
          break;
        }
      }
      if (!curRepo) {
        return;
      }
      isChangedPath = function(path) {
        var status;
        status = curRepo.getCachedPathStatus(path);
        return curRepo.isStatusModified(status) || curRepo.isStatusNew(status);
      };
      return fs.traverseTree(dirPath, (function(_this) {
        return function(path) {
          if (isChangedPath(path)) {
            return _this.uploadFile(path);
          }
        };
      })(this), (function(_this) {
        return function(path) {
          return !_this.isIgnore(path);
        };
      })(this), (function() {}));
    };

    RemoteSync.prototype.createTransport = function(host) {
      var Transport;
      if (host.transport === 'scp' || host.transport === 'sftp') {
        if (ScpTransport == null) {
          ScpTransport = require("./transports/ScpTransport");
        }
        Transport = ScpTransport;
      } else if (host.transport === 'ftp') {
        if (FtpTransport == null) {
          FtpTransport = require("./transports/FtpTransport");
        }
        Transport = FtpTransport;
      } else {
        throw new Error("[remote-sync] invalid transport: " + host.transport + " in " + this.configPath);
      }
      return new Transport(getLogger(), host, this.projectPath);
    };

    RemoteSync.prototype.getTransport = function() {
      if (this.transport) {
        return this.transport;
      }
      this.transport = this.createTransport(this.host);
      return this.transport;
    };

    RemoteSync.prototype.getUploadMirrors = function() {
      var host, i, len, ref;
      if (this.mirrorTransports) {
        return this.mirrorTransports;
      }
      this.mirrorTransports = [];
      if (this.host.uploadMirrors) {
        ref = this.host.uploadMirrors;
        for (i = 0, len = ref.length; i < len; i++) {
          host = ref[i];
          this.initIgnore(host);
          this.mirrorTransports.push(this.createTransport(host));
        }
      }
      return this.mirrorTransports;
    };

    RemoteSync.prototype.diffFile = function(localPath) {
      var os, realPath, targetPath;
      realPath = path.relative(this.projectPath, localPath);
      realPath = path.join(this.host.target, realPath).replace(/\\/g, "/");
      if (!os) {
        os = require("os");
      }
      targetPath = path.join(os.tmpDir(), "remote-sync", randomize('A0', 16));
      return this.getTransport().download(realPath, targetPath, (function(_this) {
        return function() {
          return _this.diff(localPath, targetPath);
        };
      })(this));
    };

    RemoteSync.prototype.diffFolder = function(localPath) {
      var os, targetPath;
      if (!os) {
        os = require("os");
      }
      targetPath = path.join(os.tmpDir(), "remote-sync", randomize('A0', 16));
      return this.downloadFolder(localPath, targetPath, (function(_this) {
        return function() {
          return _this.diff(localPath, targetPath);
        };
      })(this));
    };

    RemoteSync.prototype.diff = function(localPath, targetPath) {
      var diffCmd;
      if (this.isIgnore(localPath)) {
        return;
      }
      targetPath = path.join(targetPath, path.relative(this.projectPath, localPath));
      diffCmd = atom.config.get('remote-sync.difftoolCommand');
      if (exec == null) {
        exec = require("child_process").exec;
      }
      return exec("\"" + diffCmd + "\" \"" + localPath + "\" \"" + targetPath + "\"", function(err) {
        if (!err) {
          return;
        }
        return getLogger().error("Check [difftool Command] in your settings (remote-sync).\nCommand error: " + err + "\ncommand: " + diffCmd + " " + localPath + " " + targetPath);
      });
    };

    return RemoteSync;

  })();

  module.exports = {
    create: function(projectPath) {
      var configPath;
      configPath = path.join(projectPath, atom.config.get('remote-sync.configFileName'));
      if (!fs.existsSync(configPath)) {
        return;
      }
      return new RemoteSync(projectPath, configPath);
    },
    configure: function(projectPath, callback) {
      var configPath, emitter, host, view;
      if (HostView == null) {
        HostView = require('./view/host-view');
      }
      if (Host == null) {
        Host = require('./model/host');
      }
      if (EventEmitter == null) {
        EventEmitter = require("events").EventEmitter;
      }
      emitter = new EventEmitter();
      emitter.on("configured", callback);
      configPath = path.join(projectPath, atom.config.get('remote-sync.configFileName'));
      host = new Host(configPath, getLogger(), emitter);
      view = new HostView(host);
      return view.attach();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3JlbW90ZS1zeW5jL2xpYi9SZW1vdGVTeW5jLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb05BQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7RUFDWCxTQUFBLEdBQVksT0FBQSxDQUFRLFlBQVI7O0VBRVosSUFBQSxHQUFPOztFQUNQLFNBQUEsR0FBWTs7RUFFWixZQUFBLEdBQWU7O0VBQ2YsWUFBQSxHQUFlOztFQUVmLFNBQUEsR0FBWTs7RUFDWixXQUFBLEdBQWM7O0VBQ2QsSUFBQSxHQUFPOztFQUVQLFFBQUEsR0FBVzs7RUFDWCxZQUFBLEdBQWU7O0VBRWYsY0FBQSxHQUFpQjs7RUFDakIsVUFBQSxHQUFpQjs7RUFDakIsY0FBQSxHQUFpQjs7RUFDakIsT0FBQSxHQUFpQixRQUFRLENBQUMsS0FBVCxDQUFBOztFQUdqQixNQUFBLEdBQVM7O0VBQ1QsU0FBQSxHQUFZLFNBQUE7QUFDVixRQUFBO0lBQUEsSUFBRyxDQUFJLE1BQVA7TUFDRSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7TUFDVCxNQUFBLEdBQVMsSUFBSSxNQUFKLENBQVcsYUFBWCxFQUZYOztBQUdBLFdBQU87RUFKRzs7RUFNTjtJQUNTLG9CQUFDLFlBQUQsRUFBZSxXQUFmO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxjQUFEO01BQWMsSUFBQyxDQUFBLGFBQUQ7O1FBQzFCLE9BQVEsT0FBQSxDQUFRLGNBQVI7O01BRVIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLElBQUosQ0FBUyxJQUFDLENBQUEsVUFBVixFQUFzQixTQUFBLENBQUEsQ0FBdEI7TUFDUixVQUFBLHdDQUF3QixDQUFFLEtB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QyxJQUFMLENBQVUsV0FBVixFQUF1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXZCO01BQ2IsSUFBQSxDQUFjLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUFkO0FBQUEsZUFBQTs7QUFDQSxhQUFPLElBQUksVUFBSixDQUFlLFdBQWYsRUFBNEIsVUFBNUI7SUFIRCxDQUFSO0lBS0EsU0FBQSxFQUFXLFNBQUMsV0FBRCxFQUFjLFFBQWQ7QUFDVCxVQUFBOztRQUFBLFdBQVksT0FBQSxDQUFRLGtCQUFSOzs7UUFDWixPQUFRLE9BQUEsQ0FBUSxjQUFSOzs7UUFDUixlQUFnQixPQUFBLENBQVEsUUFBUixDQUFpQixDQUFDOztNQUVsQyxPQUFBLEdBQVUsSUFBSSxZQUFKLENBQUE7TUFDVixPQUFPLENBQUMsRUFBUixDQUFXLFlBQVgsRUFBeUIsUUFBekI7TUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBdkI7TUFDYixJQUFBLEdBQU8sSUFBSSxJQUFKLENBQVMsVUFBVCxFQUFxQixTQUFBLENBQUEsQ0FBckIsRUFBa0MsT0FBbEM7TUFDUCxJQUFBLEdBQU8sSUFBSSxRQUFKLENBQWEsSUFBYjthQUNQLElBQUksQ0FBQyxNQUFMLENBQUE7SUFYUyxDQUxYOztBQWpURiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5mcyA9IHJlcXVpcmUgXCJmcy1wbHVzXCJcbmNob2tpZGFyID0gcmVxdWlyZSBcImNob2tpZGFyXCJcbnJhbmRvbWl6ZSA9IHJlcXVpcmUgXCJyYW5kb21hdGljXCJcblxuZXhlYyA9IG51bGxcbm1pbmltYXRjaCA9IG51bGxcblxuU2NwVHJhbnNwb3J0ID0gbnVsbFxuRnRwVHJhbnNwb3J0ID0gbnVsbFxuXG51cGxvYWRDbWQgPSBudWxsXG5Eb3dubG9hZENtZCA9IG51bGxcbkhvc3QgPSBudWxsXG5cbkhvc3RWaWV3ID0gbnVsbFxuRXZlbnRFbWl0dGVyID0gbnVsbFxuXG5Nb25pdG9yZWRGaWxlcyA9IFtdXG53YXRjaEZpbGVzICAgICA9IHt9XG53YXRjaENoYW5nZVNldCA9IGZhbHNlXG53YXRjaGVyICAgICAgICA9IGNob2tpZGFyLndhdGNoKClcblxuXG5sb2dnZXIgPSBudWxsXG5nZXRMb2dnZXIgPSAtPlxuICBpZiBub3QgbG9nZ2VyXG4gICAgTG9nZ2VyID0gcmVxdWlyZSBcIi4vTG9nZ2VyXCJcbiAgICBsb2dnZXIgPSBuZXcgTG9nZ2VyIFwiUmVtb3RlIFN5bmNcIlxuICByZXR1cm4gbG9nZ2VyXG5cbmNsYXNzIFJlbW90ZVN5bmNcbiAgY29uc3RydWN0b3I6IChAcHJvamVjdFBhdGgsIEBjb25maWdQYXRoKSAtPlxuICAgIEhvc3QgPz0gcmVxdWlyZSAnLi9tb2RlbC9ob3N0J1xuXG4gICAgQGhvc3QgPSBuZXcgSG9zdChAY29uZmlnUGF0aCwgZ2V0TG9nZ2VyKCkpXG4gICAgd2F0Y2hGaWxlcyA9IEBob3N0LndhdGNoPy5zcGxpdChcIixcIikuZmlsdGVyKEJvb2xlYW4pXG4gICAgQHByb2plY3RQYXRoID0gcGF0aC5qb2luKEBwcm9qZWN0UGF0aCwgQGhvc3Quc291cmNlKSBpZiBAaG9zdC5zb3VyY2VcbiAgICBpZiB3YXRjaEZpbGVzP1xuICAgICAgQGluaXRBdXRvRmlsZVdhdGNoKEBwcm9qZWN0UGF0aClcbiAgICBAaW5pdElnbm9yZShAaG9zdClcbiAgICBAaW5pdE1vbml0b3IoKVxuXG4gIGluaXRJZ25vcmU6IChob3N0KS0+XG4gICAgaWdub3JlID0gaG9zdC5pZ25vcmU/LnNwbGl0KFwiLFwiKVxuICAgIGhvc3QuaXNJZ25vcmUgPSAoZmlsZVBhdGgsIHJlbGF0aXZpemVQYXRoKSA9PlxuICAgICAgcmV0dXJuIHRydWUgdW5sZXNzIHJlbGF0aXZpemVQYXRoIG9yIEBpblBhdGgoQHByb2plY3RQYXRoLCBmaWxlUGF0aClcbiAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgaWdub3JlXG5cbiAgICAgIHJlbGF0aXZpemVQYXRoID0gQHByb2plY3RQYXRoIHVubGVzcyByZWxhdGl2aXplUGF0aFxuICAgICAgZmlsZVBhdGggPSBwYXRoLnJlbGF0aXZlIHJlbGF0aXZpemVQYXRoLCBmaWxlUGF0aFxuXG4gICAgICBtaW5pbWF0Y2ggPz0gcmVxdWlyZSBcIm1pbmltYXRjaFwiXG4gICAgICBmb3IgcGF0dGVybiBpbiBpZ25vcmVcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgbWluaW1hdGNoIGZpbGVQYXRoLCBwYXR0ZXJuLCB7IG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlIH1cbiAgICAgIHJldHVybiBmYWxzZVxuXG4gIGlzSWdub3JlOiAoZmlsZVBhdGgsIHJlbGF0aXZpemVQYXRoKS0+XG4gICAgcmV0dXJuIEBob3N0LmlzSWdub3JlKGZpbGVQYXRoLCByZWxhdGl2aXplUGF0aClcblxuICBpblBhdGg6IChyb290UGF0aCwgbG9jYWxQYXRoKS0+XG4gICAgbG9jYWxQYXRoID0gbG9jYWxQYXRoICsgcGF0aC5zZXAgaWYgZnMuaXNEaXJlY3RvcnlTeW5jKGxvY2FsUGF0aClcbiAgICByZXR1cm4gbG9jYWxQYXRoLmluZGV4T2Yocm9vdFBhdGggKyBwYXRoLnNlcCkgPT0gMFxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgaWYgQHRyYW5zcG9ydFxuICAgICAgQHRyYW5zcG9ydC5kaXNwb3NlKClcbiAgICAgIEB0cmFuc3BvcnQgPSBudWxsXG5cbiAgZGVsZXRlRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiBAaXNJZ25vcmUoZmlsZVBhdGgpXG5cbiAgICBpZiBub3QgdXBsb2FkQ21kXG4gICAgICBVcGxvYWRMaXN0ZW5lciA9IHJlcXVpcmUgXCIuL1VwbG9hZExpc3RlbmVyXCJcbiAgICAgIHVwbG9hZENtZCA9IG5ldyBVcGxvYWRMaXN0ZW5lciBnZXRMb2dnZXIoKVxuXG4gICAgdXBsb2FkQ21kLmhhbmRsZURlbGV0ZShmaWxlUGF0aCwgQGdldFRyYW5zcG9ydCgpKVxuICAgIGZvciB0IGluIEBnZXRVcGxvYWRNaXJyb3JzKClcbiAgICAgIHVwbG9hZENtZC5oYW5kbGVEZWxldGUoZmlsZVBhdGgsIHQpXG5cbiAgICBpZiBAaG9zdC5kZWxldGVMb2NhbFxuICAgICAgZnMucmVtb3ZlU3luYyhmaWxlUGF0aClcblxuICBkb3dubG9hZEZvbGRlcjogKGxvY2FsUGF0aCwgdGFyZ2V0UGF0aCwgY2FsbGJhY2spLT5cbiAgICBEb3dubG9hZENtZCA/PSByZXF1aXJlICcuL2NvbW1hbmRzL0Rvd25sb2FkQWxsQ29tbWFuZCdcbiAgICBEb3dubG9hZENtZC5ydW4oZ2V0TG9nZ2VyKCksIEBnZXRUcmFuc3BvcnQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxQYXRoLCB0YXJnZXRQYXRoLCBjYWxsYmFjaylcblxuICBkb3dubG9hZEZpbGU6IChsb2NhbFBhdGgpLT5cbiAgICByZXR1cm4gaWYgQGlzSWdub3JlKGxvY2FsUGF0aClcbiAgICByZWFsUGF0aCA9IHBhdGgucmVsYXRpdmUoQHByb2plY3RQYXRoLCBsb2NhbFBhdGgpXG4gICAgcmVhbFBhdGggPSBwYXRoLmpvaW4oQGhvc3QudGFyZ2V0LCByZWFsUGF0aCkucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcbiAgICBAZ2V0VHJhbnNwb3J0KCkuZG93bmxvYWQocmVhbFBhdGgpXG5cbiAgdXBsb2FkRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiBAaXNJZ25vcmUoZmlsZVBhdGgpXG5cbiAgICBpZiBub3QgdXBsb2FkQ21kXG4gICAgICBVcGxvYWRMaXN0ZW5lciA9IHJlcXVpcmUgXCIuL1VwbG9hZExpc3RlbmVyXCJcbiAgICAgIHVwbG9hZENtZCA9IG5ldyBVcGxvYWRMaXN0ZW5lciBnZXRMb2dnZXIoKVxuXG4gICAgaWYgQGhvc3Quc2F2ZU9uVXBsb2FkXG4gICAgICBmb3IgZSBpbiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICAgIGlmIGUuZ2V0UGF0aCgpIGlzIGZpbGVQYXRoIGFuZCBlLmlzTW9kaWZpZWQoKVxuICAgICAgICAgIGUuc2F2ZSgpXG4gICAgICAgICAgcmV0dXJuIGlmIEBob3N0LnVwbG9hZE9uU2F2ZVxuXG4gICAgdXBsb2FkQ21kLmhhbmRsZVNhdmUoZmlsZVBhdGgsIEBnZXRUcmFuc3BvcnQoKSlcbiAgICBmb3IgdCBpbiBAZ2V0VXBsb2FkTWlycm9ycygpXG4gICAgICB1cGxvYWRDbWQuaGFuZGxlU2F2ZShmaWxlUGF0aCwgdClcblxuICB1cGxvYWRGb2xkZXI6IChkaXJQYXRoKS0+XG4gICAgZnMudHJhdmVyc2VUcmVlIGRpclBhdGgsIEB1cGxvYWRGaWxlLmJpbmQoQCksID0+XG4gICAgICByZXR1cm4gbm90IEBpc0lnbm9yZShkaXJQYXRoKVxuICAgICwgKC0+KVxuXG4gIGluaXRNb25pdG9yOiAoKS0+XG4gICAgX3RoaXMgPSBAXG4gICAgc2V0VGltZW91dCAtPlxuICAgICAgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIG9yIHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICAgICBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMsIG9ic2VydmVyKSAtPlxuICAgICAgICBfdGhpcy5tb25pdG9yU3R5bGVzKClcbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICAgIHRhcmdldE9iamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgJy50cmVlLXZpZXcnXG4gICAgICBpZiB0YXJnZXRPYmplY3QgIT0gbnVsbFxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlIHRhcmdldE9iamVjdCxcbiAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICAgICAgYXR0cmlidXRlczogZmFsc2VcbiAgICAgICAgICBjaGlsZExpc3Q6IHRydWVcbiAgICAsIDI1MFxuXG4gIG1vbml0b3JGaWxlOiAoZGlyUGF0aCwgdG9nZ2xlID0gdHJ1ZSwgbm90aWZpY2F0aW9ucyA9IHRydWUpLT5cbiAgICByZXR1cm4gaWYgIUBmaWxlRXhpc3RzKGRpclBhdGgpICYmICFAaXNEaXJlY3RvcnkoZGlyUGF0aClcblxuICAgIGZpbGVOYW1lID0gQC5tb25pdG9yRmlsZU5hbWUoZGlyUGF0aClcbiAgICBpZiBkaXJQYXRoIG5vdCBpbiBNb25pdG9yZWRGaWxlc1xuICAgICAgTW9uaXRvcmVkRmlsZXMucHVzaCBkaXJQYXRoXG4gICAgICB3YXRjaGVyLmFkZChkaXJQYXRoKVxuICAgICAgaWYgbm90aWZpY2F0aW9uc1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyBcInJlbW90ZS1zeW5jOiBXYXRjaGluZyBmaWxlIC0gKlwiK2ZpbGVOYW1lK1wiKlwiXG5cbiAgICAgIGlmICF3YXRjaENoYW5nZVNldFxuICAgICAgICBfdGhpcyA9IEBcbiAgICAgICAgd2F0Y2hlci5vbignY2hhbmdlJywgKHBhdGgpIC0+XG4gICAgICAgICAgX3RoaXMudXBsb2FkRmlsZShwYXRoKVxuICAgICAgICApXG4gICAgICAgIHdhdGNoZXIub24oJ3VubGluaycsIChwYXRoKSAtPlxuICAgICAgICAgIF90aGlzLmRlbGV0ZUZpbGUocGF0aClcbiAgICAgICAgKVxuICAgICAgICB3YXRjaENoYW5nZVNldCA9IHRydWVcbiAgICBlbHNlIGlmIHRvZ2dsZVxuICAgICAgd2F0Y2hlci51bndhdGNoKGRpclBhdGgpXG4gICAgICBpbmRleCA9IE1vbml0b3JlZEZpbGVzLmluZGV4T2YoZGlyUGF0aClcbiAgICAgIE1vbml0b3JlZEZpbGVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgIGlmIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJyZW1vdGUtc3luYzogVW53YXRjaGluZyBmaWxlIC0gKlwiK2ZpbGVOYW1lK1wiKlwiXG4gICAgQC5tb25pdG9yU3R5bGVzKClcblxuICBtb25pdG9yU3R5bGVzOiAoKS0+XG4gICAgbW9uaXRvckNsYXNzICA9ICdmaWxlLW1vbml0b3JpbmcnXG4gICAgcHVsc2VDbGFzcyAgICA9ICdwdWxzZSdcbiAgICBtb25pdG9yZWQgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCAnLicrbW9uaXRvckNsYXNzXG5cbiAgICBpZiBtb25pdG9yZWQgIT0gbnVsbCBhbmQgbW9uaXRvcmVkLmxlbmd0aCAhPSAwXG4gICAgICBmb3IgaXRlbSBpbiBtb25pdG9yZWRcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlIG1vbml0b3JDbGFzc1xuXG4gICAgZm9yIGZpbGUgaW4gTW9uaXRvcmVkRmlsZXNcbiAgICAgIGZpbGVfbmFtZSA9IGZpbGUucmVwbGFjZSgvKFsnXCJdKS9nLCBcIlxcXFwkMVwiKTtcbiAgICAgIGZpbGVfbmFtZSA9IGZpbGUucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKTtcbiAgICAgIGljb25fZmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgJ1tkYXRhLXBhdGg9XCInK2ZpbGVfbmFtZSsnXCJdJ1xuICAgICAgaWYgaWNvbl9maWxlICE9IG51bGxcbiAgICAgICAgbGlzdF9pdGVtID0gaWNvbl9maWxlLnBhcmVudE5vZGVcbiAgICAgICAgbGlzdF9pdGVtLmNsYXNzTGlzdC5hZGQgbW9uaXRvckNsYXNzXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldChcInJlbW90ZS1zeW5jLm1vbml0b3JGaWxlQW5pbWF0aW9uXCIpXG4gICAgICAgICAgbGlzdF9pdGVtLmNsYXNzTGlzdC5hZGQgcHVsc2VDbGFzc1xuXG4gIG1vbml0b3JGaWxlc0xpc3Q6ICgpLT5cbiAgICBmaWxlcyAgICAgICAgPSBcIlwiXG4gICAgd2F0Y2hlZFBhdGhzID0gd2F0Y2hlci5nZXRXYXRjaGVkKClcbiAgICBmb3Igayx2IG9mIHdhdGNoZWRQYXRoc1xuICAgICAgZm9yIGZpbGUgaW4gd2F0Y2hlZFBhdGhzW2tdXG4gICAgICAgIGZpbGVzICs9IGZpbGUrXCI8YnIvPlwiXG4gICAgaWYgZmlsZXMgIT0gXCJcIlxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJyZW1vdGUtc3luYzogQ3VycmVudGx5IHdhdGNoaW5nOjxici8+KlwiK2ZpbGVzK1wiKlwiXG4gICAgZWxzZVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgXCJyZW1vdGUtc3luYzogQ3VycmVudGx5IG5vdCB3YXRjaGluZyBhbnkgZmlsZXNcIlxuXG4gIGZpbGVFeGlzdHM6IChkaXJQYXRoKSAtPlxuICAgIGZpbGVfbmFtZSA9IEBtb25pdG9yRmlsZU5hbWUoZGlyUGF0aClcbiAgICB0cnlcbiAgICAgIGV4aXN0cyA9IGZzLnN0YXRTeW5jKGRpclBhdGgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGNhdGNoIGVcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIFwicmVtb3RlLXN5bmM6IGNhbm5vdCBmaW5kICpcIitmaWxlX25hbWUrXCIqIHRvIHdhdGNoXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gIGlzRGlyZWN0b3J5OiAoZGlyUGF0aCkgLT5cbiAgICBpZiBkaXJlY3RvcnkgPSBmcy5zdGF0U3luYyhkaXJQYXRoKS5pc0RpcmVjdG9yeSgpXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcInJlbW90ZS1zeW5jOiBjYW5ub3Qgd2F0Y2ggZGlyZWN0b3J5IC0gKlwiK2RpclBhdGgrXCIqXCJcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgcmV0dXJuIHRydWVcblxuICBtb25pdG9yRmlsZU5hbWU6IChkaXJQYXRoKS0+XG4gICAgZmlsZSA9IGRpclBhdGguc3BsaXQoJ1xcXFwnKS5wb3AoKS5zcGxpdCgnLycpLnBvcCgpXG4gICAgcmV0dXJuIGZpbGVcblxuICBpbml0QXV0b0ZpbGVXYXRjaDogKHByb2plY3RQYXRoKSAtPlxuICAgIF90aGlzID0gQFxuICAgIGlmIHdhdGNoRmlsZXMubGVuZ3RoICE9IDBcbiAgICAgIF90aGlzLnNldHVwQXV0b0ZpbGVXYXRjaCBmaWxlc05hbWUscHJvamVjdFBhdGggZm9yIGZpbGVzTmFtZSBpbiB3YXRjaEZpbGVzXG4gICAgICBzZXRUaW1lb3V0IC0+XG4gICAgICAgIF90aGlzLm1vbml0b3JGaWxlc0xpc3QoKVxuICAgICAgLCAxNTAwXG4gICAgICByZXR1cm5cblxuICBzZXR1cEF1dG9GaWxlV2F0Y2g6IChmaWxlc05hbWUscHJvamVjdFBhdGgpIC0+XG4gICAgX3RoaXMgPSBAXG4gICAgc2V0VGltZW91dCAtPlxuICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSA9PSBcIndpbjMyXCJcbiAgICAgICAgZmlsZXNOYW1lID0gZmlsZXNOYW1lLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpXG4gICAgICBmdWxscGF0aCA9IHByb2plY3RQYXRoICsgZmlsZXNOYW1lLnJlcGxhY2UgL15cXHMrfFxccyskL2csIFwiXCJcbiAgICAgIF90aGlzLm1vbml0b3JGaWxlKGZ1bGxwYXRoLGZhbHNlLGZhbHNlKVxuICAgICwgMjUwXG5cblxuICB1cGxvYWRHaXRDaGFuZ2U6IChkaXJQYXRoKS0+XG4gICAgcmVwb3MgPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClcbiAgICBjdXJSZXBvID0gbnVsbFxuICAgIGZvciByZXBvIGluIHJlcG9zXG4gICAgICBjb250aW51ZSB1bmxlc3MgcmVwb1xuICAgICAgd29ya2luZ0RpcmVjdG9yeSA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gICAgICBpZiBAaW5QYXRoKHdvcmtpbmdEaXJlY3RvcnksIEBwcm9qZWN0UGF0aClcbiAgICAgICAgY3VyUmVwbyA9IHJlcG9cbiAgICAgICAgYnJlYWtcbiAgICByZXR1cm4gdW5sZXNzIGN1clJlcG9cblxuICAgIGlzQ2hhbmdlZFBhdGggPSAocGF0aCktPlxuICAgICAgc3RhdHVzID0gY3VyUmVwby5nZXRDYWNoZWRQYXRoU3RhdHVzKHBhdGgpXG4gICAgICByZXR1cm4gY3VyUmVwby5pc1N0YXR1c01vZGlmaWVkKHN0YXR1cykgb3IgY3VyUmVwby5pc1N0YXR1c05ldyhzdGF0dXMpXG5cbiAgICBmcy50cmF2ZXJzZVRyZWUgZGlyUGF0aCwgKHBhdGgpPT5cbiAgICAgIEB1cGxvYWRGaWxlKHBhdGgpIGlmIGlzQ2hhbmdlZFBhdGgocGF0aClcbiAgICAsIChwYXRoKSA9PlxuICAgICAgcmV0dXJuIG5vdCBAaXNJZ25vcmUocGF0aClcbiAgICAsICgtPilcblxuICBjcmVhdGVUcmFuc3BvcnQ6IChob3N0KS0+XG4gICAgaWYgaG9zdC50cmFuc3BvcnQgaXMgJ3NjcCcgb3IgaG9zdC50cmFuc3BvcnQgaXMgJ3NmdHAnXG4gICAgICBTY3BUcmFuc3BvcnQgPz0gcmVxdWlyZSBcIi4vdHJhbnNwb3J0cy9TY3BUcmFuc3BvcnRcIlxuICAgICAgVHJhbnNwb3J0ID0gU2NwVHJhbnNwb3J0XG4gICAgZWxzZSBpZiBob3N0LnRyYW5zcG9ydCBpcyAnZnRwJ1xuICAgICAgRnRwVHJhbnNwb3J0ID89IHJlcXVpcmUgXCIuL3RyYW5zcG9ydHMvRnRwVHJhbnNwb3J0XCJcbiAgICAgIFRyYW5zcG9ydCA9IEZ0cFRyYW5zcG9ydFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIltyZW1vdGUtc3luY10gaW52YWxpZCB0cmFuc3BvcnQ6IFwiICsgaG9zdC50cmFuc3BvcnQgKyBcIiBpbiBcIiArIEBjb25maWdQYXRoKVxuXG4gICAgcmV0dXJuIG5ldyBUcmFuc3BvcnQoZ2V0TG9nZ2VyKCksIGhvc3QsIEBwcm9qZWN0UGF0aClcblxuICBnZXRUcmFuc3BvcnQ6IC0+XG4gICAgcmV0dXJuIEB0cmFuc3BvcnQgaWYgQHRyYW5zcG9ydFxuICAgIEB0cmFuc3BvcnQgPSBAY3JlYXRlVHJhbnNwb3J0KEBob3N0KVxuICAgIHJldHVybiBAdHJhbnNwb3J0XG5cbiAgZ2V0VXBsb2FkTWlycm9yczogLT5cbiAgICByZXR1cm4gQG1pcnJvclRyYW5zcG9ydHMgaWYgQG1pcnJvclRyYW5zcG9ydHNcbiAgICBAbWlycm9yVHJhbnNwb3J0cyA9IFtdXG4gICAgaWYgQGhvc3QudXBsb2FkTWlycm9yc1xuICAgICAgZm9yIGhvc3QgaW4gQGhvc3QudXBsb2FkTWlycm9yc1xuICAgICAgICBAaW5pdElnbm9yZShob3N0KVxuICAgICAgICBAbWlycm9yVHJhbnNwb3J0cy5wdXNoIEBjcmVhdGVUcmFuc3BvcnQoaG9zdClcbiAgICByZXR1cm4gQG1pcnJvclRyYW5zcG9ydHNcblxuICBkaWZmRmlsZTogKGxvY2FsUGF0aCktPlxuICAgIHJlYWxQYXRoID0gcGF0aC5yZWxhdGl2ZShAcHJvamVjdFBhdGgsIGxvY2FsUGF0aClcbiAgICByZWFsUGF0aCA9IHBhdGguam9pbihAaG9zdC50YXJnZXQsIHJlYWxQYXRoKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxuXG4gICAgb3MgPSByZXF1aXJlIFwib3NcIiBpZiBub3Qgb3NcbiAgICB0YXJnZXRQYXRoID0gcGF0aC5qb2luIG9zLnRtcERpcigpLCBcInJlbW90ZS1zeW5jXCIsIHJhbmRvbWl6ZSgnQTAnLCAxNilcblxuICAgIEBnZXRUcmFuc3BvcnQoKS5kb3dubG9hZCByZWFsUGF0aCwgdGFyZ2V0UGF0aCwgPT5cbiAgICAgIEBkaWZmIGxvY2FsUGF0aCwgdGFyZ2V0UGF0aFxuXG4gIGRpZmZGb2xkZXI6IChsb2NhbFBhdGgpLT5cbiAgICBvcyA9IHJlcXVpcmUgXCJvc1wiIGlmIG5vdCBvc1xuICAgIHRhcmdldFBhdGggPSBwYXRoLmpvaW4gb3MudG1wRGlyKCksIFwicmVtb3RlLXN5bmNcIiwgcmFuZG9taXplKCdBMCcsIDE2KVxuICAgIEBkb3dubG9hZEZvbGRlciBsb2NhbFBhdGgsIHRhcmdldFBhdGgsID0+XG4gICAgICBAZGlmZiBsb2NhbFBhdGgsIHRhcmdldFBhdGhcblxuICBkaWZmOiAobG9jYWxQYXRoLCB0YXJnZXRQYXRoKSAtPlxuICAgIHJldHVybiBpZiBAaXNJZ25vcmUobG9jYWxQYXRoKVxuICAgIHRhcmdldFBhdGggPSBwYXRoLmpvaW4odGFyZ2V0UGF0aCwgcGF0aC5yZWxhdGl2ZShAcHJvamVjdFBhdGgsIGxvY2FsUGF0aCkpXG4gICAgZGlmZkNtZCA9IGF0b20uY29uZmlnLmdldCgncmVtb3RlLXN5bmMuZGlmZnRvb2xDb21tYW5kJylcbiAgICBleGVjID89IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpLmV4ZWNcbiAgICBleGVjIFwiXFxcIiN7ZGlmZkNtZH1cXFwiIFxcXCIje2xvY2FsUGF0aH1cXFwiIFxcXCIje3RhcmdldFBhdGh9XFxcIlwiLCAoZXJyKS0+XG4gICAgICByZXR1cm4gaWYgbm90IGVyclxuICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IgXCJcIlwiQ2hlY2sgW2RpZmZ0b29sIENvbW1hbmRdIGluIHlvdXIgc2V0dGluZ3MgKHJlbW90ZS1zeW5jKS5cbiAgICAgICBDb21tYW5kIGVycm9yOiAje2Vycn1cbiAgICAgICBjb21tYW5kOiAje2RpZmZDbWR9ICN7bG9jYWxQYXRofSAje3RhcmdldFBhdGh9XG4gICAgICBcIlwiXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjcmVhdGU6IChwcm9qZWN0UGF0aCktPlxuICAgIGNvbmZpZ1BhdGggPSBwYXRoLmpvaW4gcHJvamVjdFBhdGgsIGF0b20uY29uZmlnLmdldCgncmVtb3RlLXN5bmMuY29uZmlnRmlsZU5hbWUnKVxuICAgIHJldHVybiB1bmxlc3MgZnMuZXhpc3RzU3luYyBjb25maWdQYXRoXG4gICAgcmV0dXJuIG5ldyBSZW1vdGVTeW5jKHByb2plY3RQYXRoLCBjb25maWdQYXRoKVxuXG4gIGNvbmZpZ3VyZTogKHByb2plY3RQYXRoLCBjYWxsYmFjayktPlxuICAgIEhvc3RWaWV3ID89IHJlcXVpcmUgJy4vdmlldy9ob3N0LXZpZXcnXG4gICAgSG9zdCA/PSByZXF1aXJlICcuL21vZGVsL2hvc3QnXG4gICAgRXZlbnRFbWl0dGVyID89IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyXG5cbiAgICBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgZW1pdHRlci5vbiBcImNvbmZpZ3VyZWRcIiwgY2FsbGJhY2tcblxuICAgIGNvbmZpZ1BhdGggPSBwYXRoLmpvaW4gcHJvamVjdFBhdGgsIGF0b20uY29uZmlnLmdldCgncmVtb3RlLXN5bmMuY29uZmlnRmlsZU5hbWUnKVxuICAgIGhvc3QgPSBuZXcgSG9zdChjb25maWdQYXRoLCBnZXRMb2dnZXIoKSwgZW1pdHRlcilcbiAgICB2aWV3ID0gbmV3IEhvc3RWaWV3KGhvc3QpXG4gICAgdmlldy5hdHRhY2goKVxuIl19
