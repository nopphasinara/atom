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
      targetPath = path.join(os.tmpdir(), "remote-sync", randomize('A0', 16));
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
      targetPath = path.join(os.tmpdir(), "remote-sync", randomize('A0', 16));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvUmVtb3RlU3luYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9OQUFBO0lBQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBQ1gsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSOztFQUVaLElBQUEsR0FBTzs7RUFDUCxTQUFBLEdBQVk7O0VBRVosWUFBQSxHQUFlOztFQUNmLFlBQUEsR0FBZTs7RUFFZixTQUFBLEdBQVk7O0VBQ1osV0FBQSxHQUFjOztFQUNkLElBQUEsR0FBTzs7RUFFUCxRQUFBLEdBQVc7O0VBQ1gsWUFBQSxHQUFlOztFQUVmLGNBQUEsR0FBaUI7O0VBQ2pCLFVBQUEsR0FBaUI7O0VBQ2pCLGNBQUEsR0FBaUI7O0VBQ2pCLE9BQUEsR0FBaUIsUUFBUSxDQUFDLEtBQVQsQ0FBQTs7RUFHakIsTUFBQSxHQUFTOztFQUNULFNBQUEsR0FBWSxTQUFBO0FBQ1YsUUFBQTtJQUFBLElBQUcsQ0FBSSxNQUFQO01BQ0UsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSO01BQ1QsTUFBQSxHQUFTLElBQUksTUFBSixDQUFXLGFBQVgsRUFGWDs7QUFHQSxXQUFPO0VBSkc7O0VBTU47SUFDUyxvQkFBQyxZQUFELEVBQWUsV0FBZjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsY0FBRDtNQUFjLElBQUMsQ0FBQSxhQUFEOztRQUMxQixPQUFRLE9BQUEsQ0FBUSxjQUFSOztNQUVSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxJQUFKLENBQVMsSUFBQyxDQUFBLFVBQVYsRUFBc0IsU0FBQSxDQUFBLENBQXRCO01BQ1IsVUFBQSx3Q0FBd0IsQ0FBRSxLQUFiLENBQW1C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QUFVLFdBQVYsRUFBdUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUF2QjtNQUNiLElBQUEsQ0FBYyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBZDtBQUFBLGVBQUE7O0FBQ0EsYUFBTyxJQUFJLFVBQUosQ0FBZSxXQUFmLEVBQTRCLFVBQTVCO0lBSEQsQ0FBUjtJQUtBLFNBQUEsRUFBVyxTQUFDLFdBQUQsRUFBYyxRQUFkO0FBQ1QsVUFBQTs7UUFBQSxXQUFZLE9BQUEsQ0FBUSxrQkFBUjs7O1FBQ1osT0FBUSxPQUFBLENBQVEsY0FBUjs7O1FBQ1IsZUFBZ0IsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQzs7TUFFbEMsT0FBQSxHQUFVLElBQUksWUFBSixDQUFBO01BQ1YsT0FBTyxDQUFDLEVBQVIsQ0FBVyxZQUFYLEVBQXlCLFFBQXpCO01BRUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXZCO01BQ2IsSUFBQSxHQUFPLElBQUksSUFBSixDQUFTLFVBQVQsRUFBcUIsU0FBQSxDQUFBLENBQXJCLEVBQWtDLE9BQWxDO01BQ1AsSUFBQSxHQUFPLElBQUksUUFBSixDQUFhLElBQWI7YUFDUCxJQUFJLENBQUMsTUFBTCxDQUFBO0lBWFMsQ0FMWDs7QUFqVEYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5jaG9raWRhciA9IHJlcXVpcmUgXCJjaG9raWRhclwiXG5yYW5kb21pemUgPSByZXF1aXJlIFwicmFuZG9tYXRpY1wiXG5cbmV4ZWMgPSBudWxsXG5taW5pbWF0Y2ggPSBudWxsXG5cblNjcFRyYW5zcG9ydCA9IG51bGxcbkZ0cFRyYW5zcG9ydCA9IG51bGxcblxudXBsb2FkQ21kID0gbnVsbFxuRG93bmxvYWRDbWQgPSBudWxsXG5Ib3N0ID0gbnVsbFxuXG5Ib3N0VmlldyA9IG51bGxcbkV2ZW50RW1pdHRlciA9IG51bGxcblxuTW9uaXRvcmVkRmlsZXMgPSBbXVxud2F0Y2hGaWxlcyAgICAgPSB7fVxud2F0Y2hDaGFuZ2VTZXQgPSBmYWxzZVxud2F0Y2hlciAgICAgICAgPSBjaG9raWRhci53YXRjaCgpXG5cblxubG9nZ2VyID0gbnVsbFxuZ2V0TG9nZ2VyID0gLT5cbiAgaWYgbm90IGxvZ2dlclxuICAgIExvZ2dlciA9IHJlcXVpcmUgXCIuL0xvZ2dlclwiXG4gICAgbG9nZ2VyID0gbmV3IExvZ2dlciBcIlJlbW90ZSBTeW5jXCJcbiAgcmV0dXJuIGxvZ2dlclxuXG5jbGFzcyBSZW1vdGVTeW5jXG4gIGNvbnN0cnVjdG9yOiAoQHByb2plY3RQYXRoLCBAY29uZmlnUGF0aCkgLT5cbiAgICBIb3N0ID89IHJlcXVpcmUgJy4vbW9kZWwvaG9zdCdcblxuICAgIEBob3N0ID0gbmV3IEhvc3QoQGNvbmZpZ1BhdGgsIGdldExvZ2dlcigpKVxuICAgIHdhdGNoRmlsZXMgPSBAaG9zdC53YXRjaD8uc3BsaXQoXCIsXCIpLmZpbHRlcihCb29sZWFuKVxuICAgIEBwcm9qZWN0UGF0aCA9IHBhdGguam9pbihAcHJvamVjdFBhdGgsIEBob3N0LnNvdXJjZSkgaWYgQGhvc3Quc291cmNlXG4gICAgaWYgd2F0Y2hGaWxlcz9cbiAgICAgIEBpbml0QXV0b0ZpbGVXYXRjaChAcHJvamVjdFBhdGgpXG4gICAgQGluaXRJZ25vcmUoQGhvc3QpXG4gICAgQGluaXRNb25pdG9yKClcblxuICBpbml0SWdub3JlOiAoaG9zdCktPlxuICAgIGlnbm9yZSA9IGhvc3QuaWdub3JlPy5zcGxpdChcIixcIilcbiAgICBob3N0LmlzSWdub3JlID0gKGZpbGVQYXRoLCByZWxhdGl2aXplUGF0aCkgPT5cbiAgICAgIHJldHVybiB0cnVlIHVubGVzcyByZWxhdGl2aXplUGF0aCBvciBAaW5QYXRoKEBwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG4gICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGlnbm9yZVxuXG4gICAgICByZWxhdGl2aXplUGF0aCA9IEBwcm9qZWN0UGF0aCB1bmxlc3MgcmVsYXRpdml6ZVBhdGhcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5yZWxhdGl2ZSByZWxhdGl2aXplUGF0aCwgZmlsZVBhdGhcblxuICAgICAgbWluaW1hdGNoID89IHJlcXVpcmUgXCJtaW5pbWF0Y2hcIlxuICAgICAgZm9yIHBhdHRlcm4gaW4gaWdub3JlXG4gICAgICAgIHJldHVybiB0cnVlIGlmIG1pbmltYXRjaCBmaWxlUGF0aCwgcGF0dGVybiwgeyBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSB9XG4gICAgICByZXR1cm4gZmFsc2VcblxuICBpc0lnbm9yZTogKGZpbGVQYXRoLCByZWxhdGl2aXplUGF0aCktPlxuICAgIHJldHVybiBAaG9zdC5pc0lnbm9yZShmaWxlUGF0aCwgcmVsYXRpdml6ZVBhdGgpXG5cbiAgaW5QYXRoOiAocm9vdFBhdGgsIGxvY2FsUGF0aCktPlxuICAgIGxvY2FsUGF0aCA9IGxvY2FsUGF0aCArIHBhdGguc2VwIGlmIGZzLmlzRGlyZWN0b3J5U3luYyhsb2NhbFBhdGgpXG4gICAgcmV0dXJuIGxvY2FsUGF0aC5pbmRleE9mKHJvb3RQYXRoICsgcGF0aC5zZXApID09IDBcblxuICBkaXNwb3NlOiAtPlxuICAgIGlmIEB0cmFuc3BvcnRcbiAgICAgIEB0cmFuc3BvcnQuZGlzcG9zZSgpXG4gICAgICBAdHJhbnNwb3J0ID0gbnVsbFxuXG4gIGRlbGV0ZUZpbGU6IChmaWxlUGF0aCkgLT5cbiAgICByZXR1cm4gaWYgQGlzSWdub3JlKGZpbGVQYXRoKVxuXG4gICAgaWYgbm90IHVwbG9hZENtZFxuICAgICAgVXBsb2FkTGlzdGVuZXIgPSByZXF1aXJlIFwiLi9VcGxvYWRMaXN0ZW5lclwiXG4gICAgICB1cGxvYWRDbWQgPSBuZXcgVXBsb2FkTGlzdGVuZXIgZ2V0TG9nZ2VyKClcblxuICAgIHVwbG9hZENtZC5oYW5kbGVEZWxldGUoZmlsZVBhdGgsIEBnZXRUcmFuc3BvcnQoKSlcbiAgICBmb3IgdCBpbiBAZ2V0VXBsb2FkTWlycm9ycygpXG4gICAgICB1cGxvYWRDbWQuaGFuZGxlRGVsZXRlKGZpbGVQYXRoLCB0KVxuXG4gICAgaWYgQGhvc3QuZGVsZXRlTG9jYWxcbiAgICAgIGZzLnJlbW92ZVN5bmMoZmlsZVBhdGgpXG5cbiAgZG93bmxvYWRGb2xkZXI6IChsb2NhbFBhdGgsIHRhcmdldFBhdGgsIGNhbGxiYWNrKS0+XG4gICAgRG93bmxvYWRDbWQgPz0gcmVxdWlyZSAnLi9jb21tYW5kcy9Eb3dubG9hZEFsbENvbW1hbmQnXG4gICAgRG93bmxvYWRDbWQucnVuKGdldExvZ2dlcigpLCBAZ2V0VHJhbnNwb3J0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsUGF0aCwgdGFyZ2V0UGF0aCwgY2FsbGJhY2spXG5cbiAgZG93bmxvYWRGaWxlOiAobG9jYWxQYXRoKS0+XG4gICAgcmV0dXJuIGlmIEBpc0lnbm9yZShsb2NhbFBhdGgpXG4gICAgcmVhbFBhdGggPSBwYXRoLnJlbGF0aXZlKEBwcm9qZWN0UGF0aCwgbG9jYWxQYXRoKVxuICAgIHJlYWxQYXRoID0gcGF0aC5qb2luKEBob3N0LnRhcmdldCwgcmVhbFBhdGgpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXG4gICAgQGdldFRyYW5zcG9ydCgpLmRvd25sb2FkKHJlYWxQYXRoKVxuXG4gIHVwbG9hZEZpbGU6IChmaWxlUGF0aCkgLT5cbiAgICByZXR1cm4gaWYgQGlzSWdub3JlKGZpbGVQYXRoKVxuXG4gICAgaWYgbm90IHVwbG9hZENtZFxuICAgICAgVXBsb2FkTGlzdGVuZXIgPSByZXF1aXJlIFwiLi9VcGxvYWRMaXN0ZW5lclwiXG4gICAgICB1cGxvYWRDbWQgPSBuZXcgVXBsb2FkTGlzdGVuZXIgZ2V0TG9nZ2VyKClcblxuICAgIGlmIEBob3N0LnNhdmVPblVwbG9hZFxuICAgICAgZm9yIGUgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgICBpZiBlLmdldFBhdGgoKSBpcyBmaWxlUGF0aCBhbmQgZS5pc01vZGlmaWVkKClcbiAgICAgICAgICBlLnNhdmUoKVxuICAgICAgICAgIHJldHVybiBpZiBAaG9zdC51cGxvYWRPblNhdmVcblxuICAgIHVwbG9hZENtZC5oYW5kbGVTYXZlKGZpbGVQYXRoLCBAZ2V0VHJhbnNwb3J0KCkpXG4gICAgZm9yIHQgaW4gQGdldFVwbG9hZE1pcnJvcnMoKVxuICAgICAgdXBsb2FkQ21kLmhhbmRsZVNhdmUoZmlsZVBhdGgsIHQpXG5cbiAgdXBsb2FkRm9sZGVyOiAoZGlyUGF0aCktPlxuICAgIGZzLnRyYXZlcnNlVHJlZSBkaXJQYXRoLCBAdXBsb2FkRmlsZS5iaW5kKEApLCA9PlxuICAgICAgcmV0dXJuIG5vdCBAaXNJZ25vcmUoZGlyUGF0aClcbiAgICAsICgtPilcblxuICBpbml0TW9uaXRvcjogKCktPlxuICAgIF90aGlzID0gQFxuICAgIHNldFRpbWVvdXQgLT5cbiAgICAgIE11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciBvciB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAgICAgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zLCBvYnNlcnZlcikgLT5cbiAgICAgICAgX3RoaXMubW9uaXRvclN0eWxlcygpXG4gICAgICAgIHJldHVyblxuICAgICAgKVxuXG4gICAgICB0YXJnZXRPYmplY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yICcudHJlZS12aWV3J1xuICAgICAgaWYgdGFyZ2V0T2JqZWN0ICE9IG51bGxcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSB0YXJnZXRPYmplY3QsXG4gICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICAgIGF0dHJpYnV0ZXM6IGZhbHNlXG4gICAgICAgICAgY2hpbGRMaXN0OiB0cnVlXG4gICAgLCAyNTBcblxuICBtb25pdG9yRmlsZTogKGRpclBhdGgsIHRvZ2dsZSA9IHRydWUsIG5vdGlmaWNhdGlvbnMgPSB0cnVlKS0+XG4gICAgcmV0dXJuIGlmICFAZmlsZUV4aXN0cyhkaXJQYXRoKSAmJiAhQGlzRGlyZWN0b3J5KGRpclBhdGgpXG5cbiAgICBmaWxlTmFtZSA9IEAubW9uaXRvckZpbGVOYW1lKGRpclBhdGgpXG4gICAgaWYgZGlyUGF0aCBub3QgaW4gTW9uaXRvcmVkRmlsZXNcbiAgICAgIE1vbml0b3JlZEZpbGVzLnB1c2ggZGlyUGF0aFxuICAgICAgd2F0Y2hlci5hZGQoZGlyUGF0aClcbiAgICAgIGlmIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJyZW1vdGUtc3luYzogV2F0Y2hpbmcgZmlsZSAtICpcIitmaWxlTmFtZStcIipcIlxuXG4gICAgICBpZiAhd2F0Y2hDaGFuZ2VTZXRcbiAgICAgICAgX3RoaXMgPSBAXG4gICAgICAgIHdhdGNoZXIub24oJ2NoYW5nZScsIChwYXRoKSAtPlxuICAgICAgICAgIF90aGlzLnVwbG9hZEZpbGUocGF0aClcbiAgICAgICAgKVxuICAgICAgICB3YXRjaGVyLm9uKCd1bmxpbmsnLCAocGF0aCkgLT5cbiAgICAgICAgICBfdGhpcy5kZWxldGVGaWxlKHBhdGgpXG4gICAgICAgIClcbiAgICAgICAgd2F0Y2hDaGFuZ2VTZXQgPSB0cnVlXG4gICAgZWxzZSBpZiB0b2dnbGVcbiAgICAgIHdhdGNoZXIudW53YXRjaChkaXJQYXRoKVxuICAgICAgaW5kZXggPSBNb25pdG9yZWRGaWxlcy5pbmRleE9mKGRpclBhdGgpXG4gICAgICBNb25pdG9yZWRGaWxlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICBpZiBub3RpZmljYXRpb25zXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwicmVtb3RlLXN5bmM6IFVud2F0Y2hpbmcgZmlsZSAtICpcIitmaWxlTmFtZStcIipcIlxuICAgIEAubW9uaXRvclN0eWxlcygpXG5cbiAgbW9uaXRvclN0eWxlczogKCktPlxuICAgIG1vbml0b3JDbGFzcyAgPSAnZmlsZS1tb25pdG9yaW5nJ1xuICAgIHB1bHNlQ2xhc3MgICAgPSAncHVsc2UnXG4gICAgbW9uaXRvcmVkICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgJy4nK21vbml0b3JDbGFzc1xuXG4gICAgaWYgbW9uaXRvcmVkICE9IG51bGwgYW5kIG1vbml0b3JlZC5sZW5ndGggIT0gMFxuICAgICAgZm9yIGl0ZW0gaW4gbW9uaXRvcmVkXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSBtb25pdG9yQ2xhc3NcblxuICAgIGZvciBmaWxlIGluIE1vbml0b3JlZEZpbGVzXG4gICAgICBmaWxlX25hbWUgPSBmaWxlLnJlcGxhY2UoLyhbJ1wiXSkvZywgXCJcXFxcJDFcIik7XG4gICAgICBmaWxlX25hbWUgPSBmaWxlLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJyk7XG4gICAgICBpY29uX2ZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yICdbZGF0YS1wYXRoPVwiJytmaWxlX25hbWUrJ1wiXSdcbiAgICAgIGlmIGljb25fZmlsZSAhPSBudWxsXG4gICAgICAgIGxpc3RfaXRlbSA9IGljb25fZmlsZS5wYXJlbnROb2RlXG4gICAgICAgIGxpc3RfaXRlbS5jbGFzc0xpc3QuYWRkIG1vbml0b3JDbGFzc1xuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCJyZW1vdGUtc3luYy5tb25pdG9yRmlsZUFuaW1hdGlvblwiKVxuICAgICAgICAgIGxpc3RfaXRlbS5jbGFzc0xpc3QuYWRkIHB1bHNlQ2xhc3NcblxuICBtb25pdG9yRmlsZXNMaXN0OiAoKS0+XG4gICAgZmlsZXMgICAgICAgID0gXCJcIlxuICAgIHdhdGNoZWRQYXRocyA9IHdhdGNoZXIuZ2V0V2F0Y2hlZCgpXG4gICAgZm9yIGssdiBvZiB3YXRjaGVkUGF0aHNcbiAgICAgIGZvciBmaWxlIGluIHdhdGNoZWRQYXRoc1trXVxuICAgICAgICBmaWxlcyArPSBmaWxlK1wiPGJyLz5cIlxuICAgIGlmIGZpbGVzICE9IFwiXCJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwicmVtb3RlLXN5bmM6IEN1cnJlbnRseSB3YXRjaGluZzo8YnIvPipcIitmaWxlcytcIipcIlxuICAgIGVsc2VcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIFwicmVtb3RlLXN5bmM6IEN1cnJlbnRseSBub3Qgd2F0Y2hpbmcgYW55IGZpbGVzXCJcblxuICBmaWxlRXhpc3RzOiAoZGlyUGF0aCkgLT5cbiAgICBmaWxlX25hbWUgPSBAbW9uaXRvckZpbGVOYW1lKGRpclBhdGgpXG4gICAgdHJ5XG4gICAgICBleGlzdHMgPSBmcy5zdGF0U3luYyhkaXJQYXRoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBjYXRjaCBlXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcInJlbW90ZS1zeW5jOiBjYW5ub3QgZmluZCAqXCIrZmlsZV9uYW1lK1wiKiB0byB3YXRjaFwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBpc0RpcmVjdG9yeTogKGRpclBhdGgpIC0+XG4gICAgaWYgZGlyZWN0b3J5ID0gZnMuc3RhdFN5bmMoZGlyUGF0aCkuaXNEaXJlY3RvcnkoKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgXCJyZW1vdGUtc3luYzogY2Fubm90IHdhdGNoIGRpcmVjdG9yeSAtICpcIitkaXJQYXRoK1wiKlwiXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIHJldHVybiB0cnVlXG5cbiAgbW9uaXRvckZpbGVOYW1lOiAoZGlyUGF0aCktPlxuICAgIGZpbGUgPSBkaXJQYXRoLnNwbGl0KCdcXFxcJykucG9wKCkuc3BsaXQoJy8nKS5wb3AoKVxuICAgIHJldHVybiBmaWxlXG5cbiAgaW5pdEF1dG9GaWxlV2F0Y2g6IChwcm9qZWN0UGF0aCkgLT5cbiAgICBfdGhpcyA9IEBcbiAgICBpZiB3YXRjaEZpbGVzLmxlbmd0aCAhPSAwXG4gICAgICBfdGhpcy5zZXR1cEF1dG9GaWxlV2F0Y2ggZmlsZXNOYW1lLHByb2plY3RQYXRoIGZvciBmaWxlc05hbWUgaW4gd2F0Y2hGaWxlc1xuICAgICAgc2V0VGltZW91dCAtPlxuICAgICAgICBfdGhpcy5tb25pdG9yRmlsZXNMaXN0KClcbiAgICAgICwgMTUwMFxuICAgICAgcmV0dXJuXG5cbiAgc2V0dXBBdXRvRmlsZVdhdGNoOiAoZmlsZXNOYW1lLHByb2plY3RQYXRoKSAtPlxuICAgIF90aGlzID0gQFxuICAgIHNldFRpbWVvdXQgLT5cbiAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gXCJ3aW4zMlwiXG4gICAgICAgIGZpbGVzTmFtZSA9IGZpbGVzTmFtZS5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKVxuICAgICAgZnVsbHBhdGggPSBwcm9qZWN0UGF0aCArIGZpbGVzTmFtZS5yZXBsYWNlIC9eXFxzK3xcXHMrJC9nLCBcIlwiXG4gICAgICBfdGhpcy5tb25pdG9yRmlsZShmdWxscGF0aCxmYWxzZSxmYWxzZSlcbiAgICAsIDI1MFxuXG5cbiAgdXBsb2FkR2l0Q2hhbmdlOiAoZGlyUGF0aCktPlxuICAgIHJlcG9zID0gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpXG4gICAgY3VyUmVwbyA9IG51bGxcbiAgICBmb3IgcmVwbyBpbiByZXBvc1xuICAgICAgY29udGludWUgdW5sZXNzIHJlcG9cbiAgICAgIHdvcmtpbmdEaXJlY3RvcnkgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICAgICAgaWYgQGluUGF0aCh3b3JraW5nRGlyZWN0b3J5LCBAcHJvamVjdFBhdGgpXG4gICAgICAgIGN1clJlcG8gPSByZXBvXG4gICAgICAgIGJyZWFrXG4gICAgcmV0dXJuIHVubGVzcyBjdXJSZXBvXG5cbiAgICBpc0NoYW5nZWRQYXRoID0gKHBhdGgpLT5cbiAgICAgIHN0YXR1cyA9IGN1clJlcG8uZ2V0Q2FjaGVkUGF0aFN0YXR1cyhwYXRoKVxuICAgICAgcmV0dXJuIGN1clJlcG8uaXNTdGF0dXNNb2RpZmllZChzdGF0dXMpIG9yIGN1clJlcG8uaXNTdGF0dXNOZXcoc3RhdHVzKVxuXG4gICAgZnMudHJhdmVyc2VUcmVlIGRpclBhdGgsIChwYXRoKT0+XG4gICAgICBAdXBsb2FkRmlsZShwYXRoKSBpZiBpc0NoYW5nZWRQYXRoKHBhdGgpXG4gICAgLCAocGF0aCkgPT5cbiAgICAgIHJldHVybiBub3QgQGlzSWdub3JlKHBhdGgpXG4gICAgLCAoLT4pXG5cbiAgY3JlYXRlVHJhbnNwb3J0OiAoaG9zdCktPlxuICAgIGlmIGhvc3QudHJhbnNwb3J0IGlzICdzY3AnIG9yIGhvc3QudHJhbnNwb3J0IGlzICdzZnRwJ1xuICAgICAgU2NwVHJhbnNwb3J0ID89IHJlcXVpcmUgXCIuL3RyYW5zcG9ydHMvU2NwVHJhbnNwb3J0XCJcbiAgICAgIFRyYW5zcG9ydCA9IFNjcFRyYW5zcG9ydFxuICAgIGVsc2UgaWYgaG9zdC50cmFuc3BvcnQgaXMgJ2Z0cCdcbiAgICAgIEZ0cFRyYW5zcG9ydCA/PSByZXF1aXJlIFwiLi90cmFuc3BvcnRzL0Z0cFRyYW5zcG9ydFwiXG4gICAgICBUcmFuc3BvcnQgPSBGdHBUcmFuc3BvcnRcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbcmVtb3RlLXN5bmNdIGludmFsaWQgdHJhbnNwb3J0OiBcIiArIGhvc3QudHJhbnNwb3J0ICsgXCIgaW4gXCIgKyBAY29uZmlnUGF0aClcblxuICAgIHJldHVybiBuZXcgVHJhbnNwb3J0KGdldExvZ2dlcigpLCBob3N0LCBAcHJvamVjdFBhdGgpXG5cbiAgZ2V0VHJhbnNwb3J0OiAtPlxuICAgIHJldHVybiBAdHJhbnNwb3J0IGlmIEB0cmFuc3BvcnRcbiAgICBAdHJhbnNwb3J0ID0gQGNyZWF0ZVRyYW5zcG9ydChAaG9zdClcbiAgICByZXR1cm4gQHRyYW5zcG9ydFxuXG4gIGdldFVwbG9hZE1pcnJvcnM6IC0+XG4gICAgcmV0dXJuIEBtaXJyb3JUcmFuc3BvcnRzIGlmIEBtaXJyb3JUcmFuc3BvcnRzXG4gICAgQG1pcnJvclRyYW5zcG9ydHMgPSBbXVxuICAgIGlmIEBob3N0LnVwbG9hZE1pcnJvcnNcbiAgICAgIGZvciBob3N0IGluIEBob3N0LnVwbG9hZE1pcnJvcnNcbiAgICAgICAgQGluaXRJZ25vcmUoaG9zdClcbiAgICAgICAgQG1pcnJvclRyYW5zcG9ydHMucHVzaCBAY3JlYXRlVHJhbnNwb3J0KGhvc3QpXG4gICAgcmV0dXJuIEBtaXJyb3JUcmFuc3BvcnRzXG5cbiAgZGlmZkZpbGU6IChsb2NhbFBhdGgpLT5cbiAgICByZWFsUGF0aCA9IHBhdGgucmVsYXRpdmUoQHByb2plY3RQYXRoLCBsb2NhbFBhdGgpXG4gICAgcmVhbFBhdGggPSBwYXRoLmpvaW4oQGhvc3QudGFyZ2V0LCByZWFsUGF0aCkucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcblxuICAgIG9zID0gcmVxdWlyZSBcIm9zXCIgaWYgbm90IG9zXG4gICAgdGFyZ2V0UGF0aCA9IHBhdGguam9pbiBvcy50bXBkaXIoKSwgXCJyZW1vdGUtc3luY1wiLCByYW5kb21pemUoJ0EwJywgMTYpXG5cbiAgICBAZ2V0VHJhbnNwb3J0KCkuZG93bmxvYWQgcmVhbFBhdGgsIHRhcmdldFBhdGgsID0+XG4gICAgICBAZGlmZiBsb2NhbFBhdGgsIHRhcmdldFBhdGhcblxuICBkaWZmRm9sZGVyOiAobG9jYWxQYXRoKS0+XG4gICAgb3MgPSByZXF1aXJlIFwib3NcIiBpZiBub3Qgb3NcbiAgICB0YXJnZXRQYXRoID0gcGF0aC5qb2luIG9zLnRtcGRpcigpLCBcInJlbW90ZS1zeW5jXCIsIHJhbmRvbWl6ZSgnQTAnLCAxNilcbiAgICBAZG93bmxvYWRGb2xkZXIgbG9jYWxQYXRoLCB0YXJnZXRQYXRoLCA9PlxuICAgICAgQGRpZmYgbG9jYWxQYXRoLCB0YXJnZXRQYXRoXG5cbiAgZGlmZjogKGxvY2FsUGF0aCwgdGFyZ2V0UGF0aCkgLT5cbiAgICByZXR1cm4gaWYgQGlzSWdub3JlKGxvY2FsUGF0aClcbiAgICB0YXJnZXRQYXRoID0gcGF0aC5qb2luKHRhcmdldFBhdGgsIHBhdGgucmVsYXRpdmUoQHByb2plY3RQYXRoLCBsb2NhbFBhdGgpKVxuICAgIGRpZmZDbWQgPSBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1zeW5jLmRpZmZ0b29sQ29tbWFuZCcpXG4gICAgZXhlYyA/PSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKS5leGVjXG4gICAgZXhlYyBcIlxcXCIje2RpZmZDbWR9XFxcIiBcXFwiI3tsb2NhbFBhdGh9XFxcIiBcXFwiI3t0YXJnZXRQYXRofVxcXCJcIiwgKGVyciktPlxuICAgICAgcmV0dXJuIGlmIG5vdCBlcnJcbiAgICAgIGdldExvZ2dlcigpLmVycm9yIFwiXCJcIkNoZWNrIFtkaWZmdG9vbCBDb21tYW5kXSBpbiB5b3VyIHNldHRpbmdzIChyZW1vdGUtc3luYykuXG4gICAgICAgQ29tbWFuZCBlcnJvcjogI3tlcnJ9XG4gICAgICAgY29tbWFuZDogI3tkaWZmQ21kfSAje2xvY2FsUGF0aH0gI3t0YXJnZXRQYXRofVxuICAgICAgXCJcIlwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY3JlYXRlOiAocHJvamVjdFBhdGgpLT5cbiAgICBjb25maWdQYXRoID0gcGF0aC5qb2luIHByb2plY3RQYXRoLCBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1zeW5jLmNvbmZpZ0ZpbGVOYW1lJylcbiAgICByZXR1cm4gdW5sZXNzIGZzLmV4aXN0c1N5bmMgY29uZmlnUGF0aFxuICAgIHJldHVybiBuZXcgUmVtb3RlU3luYyhwcm9qZWN0UGF0aCwgY29uZmlnUGF0aClcblxuICBjb25maWd1cmU6IChwcm9qZWN0UGF0aCwgY2FsbGJhY2spLT5cbiAgICBIb3N0VmlldyA/PSByZXF1aXJlICcuL3ZpZXcvaG9zdC12aWV3J1xuICAgIEhvc3QgPz0gcmVxdWlyZSAnLi9tb2RlbC9ob3N0J1xuICAgIEV2ZW50RW1pdHRlciA/PSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlclxuXG4gICAgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgIGVtaXR0ZXIub24gXCJjb25maWd1cmVkXCIsIGNhbGxiYWNrXG5cbiAgICBjb25maWdQYXRoID0gcGF0aC5qb2luIHByb2plY3RQYXRoLCBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1zeW5jLmNvbmZpZ0ZpbGVOYW1lJylcbiAgICBob3N0ID0gbmV3IEhvc3QoY29uZmlnUGF0aCwgZ2V0TG9nZ2VyKCksIGVtaXR0ZXIpXG4gICAgdmlldyA9IG5ldyBIb3N0Vmlldyhob3N0KVxuICAgIHZpZXcuYXR0YWNoKClcbiJdfQ==
