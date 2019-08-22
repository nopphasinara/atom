(function() {
  var $, CompositeDisposable, RemoteSync, configure, disposables, fs, getEventPath, handleEvent, initProject, path, projectDict, reload;

  fs = require('fs-plus');

  CompositeDisposable = null;

  path = null;

  $ = null;

  getEventPath = function(e) {
    var fullPath, projectPath, ref, relativePath, target;
    if ($ == null) {
      $ = require('atom-space-pen-views').$;
    }
    target = $(e.target).closest('.file, .directory, .tab')[0];
    if (target == null) {
      target = atom.workspace.getActiveTextEditor();
    }
    fullPath = target != null ? typeof target.getPath === "function" ? target.getPath() : void 0 : void 0;
    if (!fullPath) {
      return [];
    }
    ref = atom.project.relativizePath(fullPath), projectPath = ref[0], relativePath = ref[1];
    return [projectPath, fullPath];
  };

  projectDict = null;

  disposables = null;

  RemoteSync = null;

  initProject = function(projectPaths) {
    var disposes, err, i, j, len, len1, obj, projectPath, results;
    disposes = [];
    for (projectPath in projectDict) {
      if (projectPaths.indexOf(projectPath) === -1) {
        disposes.push(projectPath);
      }
    }
    for (i = 0, len = disposes.length; i < len; i++) {
      projectPath = disposes[i];
      projectDict[projectPath].dispose();
      delete projectDict[projectPath];
    }
    results = [];
    for (j = 0, len1 = projectPaths.length; j < len1; j++) {
      projectPath = projectPaths[j];
      try {
        projectPath = fs.realpathSync(projectPath);
      } catch (error) {
        err = error;
        continue;
      }
      if (projectDict[projectPath]) {
        continue;
      }
      if (RemoteSync == null) {
        RemoteSync = require("./lib/RemoteSync");
      }
      obj = RemoteSync.create(projectPath);
      if (obj) {
        results.push(projectDict[projectPath] = obj);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  handleEvent = function(e, cmd) {
    var fullPath, projectObj, projectPath, ref;
    ref = getEventPath(e), projectPath = ref[0], fullPath = ref[1];
    if (!projectPath) {
      return;
    }
    projectObj = projectDict[fs.realpathSync(projectPath)];
    return typeof projectObj[cmd] === "function" ? projectObj[cmd](fs.realpathSync(fullPath)) : void 0;
  };

  reload = function(projectPath) {
    var ref;
    if ((ref = projectDict[projectPath]) != null) {
      ref.dispose();
    }
    return projectDict[projectPath] = RemoteSync.create(projectPath);
  };

  configure = function(e) {
    var projectPath;
    projectPath = getEventPath(e)[0];
    if (!projectPath) {
      return;
    }
    projectPath = fs.realpathSync(projectPath);
    if (RemoteSync == null) {
      RemoteSync = require("./lib/RemoteSync");
    }
    return RemoteSync.configure(projectPath, function() {
      return reload(projectPath);
    });
  };

  module.exports = {
    config: {
      logToConsole: {
        type: 'boolean',
        "default": false,
        title: 'Log to console',
        description: 'Log messages to the console instead of the status view at the bottom of the window'
      },
      autoHideLogPanel: {
        type: 'boolean',
        "default": false,
        title: 'Hide log panel after transferring',
        description: 'Hides the status view at the bottom of the window after the transfer operation is done'
      },
      foldLogPanel: {
        type: 'boolean',
        "default": false,
        title: 'Fold log panel by default',
        description: 'Shows only one line in the status view'
      },
      monitorFileAnimation: {
        type: 'boolean',
        "default": true,
        title: 'Monitor file animation',
        description: 'Toggles the pulse animation for a monitored file'
      },
      difftoolCommand: {
        type: 'string',
        "default": '',
        title: 'Diff tool command',
        description: 'The command to run for your diff tool'
      },
      configFileName: {
        type: 'string',
        "default": '.remote-sync.json'
      }
    },
    activate: function(state) {
      projectDict = {};
      try {
        initProject(atom.project.getPaths());
      } catch (error) {
        atom.notifications.addError("RemoteSync Error", {
          dismissable: true,
          detail: "Failed to initalise RemoteSync"
        });
      }
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      disposables = new CompositeDisposable;
      disposables.add(atom.commands.add('atom-workspace', {
        'remote-sync:upload-folder': function(e) {
          return handleEvent(e, "uploadFolder");
        },
        'remote-sync:upload-file': function(e) {
          return handleEvent(e, "uploadFile");
        },
        'remote-sync:delete-file': function(e) {
          return handleEvent(e, "deleteFile");
        },
        'remote-sync:delete-folder': function(e) {
          return handleEvent(e, "deleteFile");
        },
        'remote-sync:download-file': function(e) {
          return handleEvent(e, "downloadFile");
        },
        'remote-sync:download-folder': function(e) {
          return handleEvent(e, "downloadFolder");
        },
        'remote-sync:diff-file': function(e) {
          return handleEvent(e, "diffFile");
        },
        'remote-sync:diff-folder': function(e) {
          return handleEvent(e, "diffFolder");
        },
        'remote-sync:upload-git-change': function(e) {
          return handleEvent(e, "uploadGitChange");
        },
        'remote-sync:monitor-file': function(e) {
          return handleEvent(e, "monitorFile");
        },
        'remote-sync:monitor-files-list': function(e) {
          return handleEvent(e, "monitorFilesList");
        },
        'remote-sync:configure': configure
      }));
      disposables.add(atom.project.onDidChangePaths(function(projectPaths) {
        return initProject(projectPaths);
      }));
      return disposables.add(atom.workspace.observeTextEditors(function(editor) {
        var onDidDestroy, onDidSave;
        onDidSave = editor.onDidSave(function(e) {
          var fullPath, projectObj, projectPath, ref, relativePath;
          fullPath = e.path;
          ref = atom.project.relativizePath(fullPath), projectPath = ref[0], relativePath = ref[1];
          if (!projectPath) {
            return;
          }
          projectPath = fs.realpathSync(projectPath);
          projectObj = projectDict[projectPath];
          if (!projectObj) {
            return;
          }
          if (fs.realpathSync(fullPath) === fs.realpathSync(projectObj.configPath)) {
            projectObj = reload(projectPath);
          }
          if (!projectObj.host.uploadOnSave) {
            return;
          }
          return projectObj.uploadFile(fs.realpathSync(fullPath));
        });
        onDidDestroy = editor.onDidDestroy(function() {
          disposables.remove(onDidSave);
          disposables.remove(onDidDestroy);
          onDidDestroy.dispose();
          return onDidSave.dispose();
        });
        disposables.add(onDidSave);
        return disposables.add(onDidDestroy);
      }));
    },
    deactivate: function() {
      var obj, projectPath;
      disposables.dispose();
      disposables = null;
      for (projectPath in projectDict) {
        obj = projectDict[projectPath];
        obj.dispose();
      }
      return projectDict = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxtQkFBQSxHQUFzQjs7RUFDdEIsSUFBQSxHQUFPOztFQUNQLENBQUEsR0FBSTs7RUFFSixZQUFBLEdBQWUsU0FBQyxDQUFEO0FBQ2IsUUFBQTs7TUFBQSxJQUFLLE9BQUEsQ0FBUSxzQkFBUixDQUErQixDQUFDOztJQUVyQyxNQUFBLEdBQVMsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQVcsQ0FBQyxPQUFaLENBQW9CLHlCQUFwQixDQUErQyxDQUFBLENBQUE7O01BQ3hELFNBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBOztJQUVWLFFBQUEsMkRBQVcsTUFBTSxDQUFFO0lBQ25CLElBQUEsQ0FBaUIsUUFBakI7QUFBQSxhQUFPLEdBQVA7O0lBRUEsTUFBOEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQTlCLEVBQUMsb0JBQUQsRUFBYztBQUNkLFdBQU8sQ0FBQyxXQUFELEVBQWMsUUFBZDtFQVZNOztFQVlmLFdBQUEsR0FBYzs7RUFDZCxXQUFBLEdBQWM7O0VBQ2QsVUFBQSxHQUFhOztFQUNiLFdBQUEsR0FBYyxTQUFDLFlBQUQ7QUFDWixRQUFBO0lBQUEsUUFBQSxHQUFXO0FBQ1gsU0FBQSwwQkFBQTtNQUNFLElBQTZCLFlBQVksQ0FBQyxPQUFiLENBQXFCLFdBQXJCLENBQUEsS0FBcUMsQ0FBQyxDQUFuRTtRQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxFQUFBOztBQURGO0FBR0EsU0FBQSwwQ0FBQTs7TUFDRSxXQUFZLENBQUEsV0FBQSxDQUFZLENBQUMsT0FBekIsQ0FBQTtNQUNBLE9BQU8sV0FBWSxDQUFBLFdBQUE7QUFGckI7QUFJQTtTQUFBLGdEQUFBOztBQUNFO1FBQ0ksV0FBQSxHQUFjLEVBQUUsQ0FBQyxZQUFILENBQWdCLFdBQWhCLEVBRGxCO09BQUEsYUFBQTtRQUVNO0FBQ0YsaUJBSEo7O01BSUEsSUFBWSxXQUFZLENBQUEsV0FBQSxDQUF4QjtBQUFBLGlCQUFBOzs7UUFDQSxhQUFjLE9BQUEsQ0FBUSxrQkFBUjs7TUFDZCxHQUFBLEdBQU0sVUFBVSxDQUFDLE1BQVgsQ0FBa0IsV0FBbEI7TUFDTixJQUFrQyxHQUFsQztxQkFBQSxXQUFZLENBQUEsV0FBQSxDQUFaLEdBQTJCLEtBQTNCO09BQUEsTUFBQTs2QkFBQTs7QUFSRjs7RUFUWTs7RUFtQmQsV0FBQSxHQUFjLFNBQUMsQ0FBRCxFQUFJLEdBQUo7QUFDWixRQUFBO0lBQUEsTUFBMEIsWUFBQSxDQUFhLENBQWIsQ0FBMUIsRUFBQyxvQkFBRCxFQUFjO0lBQ2QsSUFBQSxDQUFjLFdBQWQ7QUFBQSxhQUFBOztJQUVBLFVBQUEsR0FBYSxXQUFZLENBQUEsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsV0FBaEIsQ0FBQTttREFDekIsVUFBVyxDQUFBLEdBQUEsRUFBTSxFQUFFLENBQUMsWUFBSCxDQUFnQixRQUFoQjtFQUxMOztFQU9kLE1BQUEsR0FBUyxTQUFDLFdBQUQ7QUFDUCxRQUFBOztTQUF3QixDQUFFLE9BQTFCLENBQUE7O1dBQ0EsV0FBWSxDQUFBLFdBQUEsQ0FBWixHQUEyQixVQUFVLENBQUMsTUFBWCxDQUFrQixXQUFsQjtFQUZwQjs7RUFJVCxTQUFBLEdBQVksU0FBQyxDQUFEO0FBQ1YsUUFBQTtJQUFDLGNBQWUsWUFBQSxDQUFhLENBQWI7SUFDaEIsSUFBQSxDQUFjLFdBQWQ7QUFBQSxhQUFBOztJQUVBLFdBQUEsR0FBYyxFQUFFLENBQUMsWUFBSCxDQUFnQixXQUFoQjs7TUFDZCxhQUFjLE9BQUEsQ0FBUSxrQkFBUjs7V0FDZCxVQUFVLENBQUMsU0FBWCxDQUFxQixXQUFyQixFQUFrQyxTQUFBO2FBQUcsTUFBQSxDQUFPLFdBQVA7SUFBSCxDQUFsQztFQU5VOztFQVFaLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLEtBQUEsRUFBTyxnQkFGUDtRQUdBLFdBQUEsRUFBYSxvRkFIYjtPQURGO01BS0EsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsS0FBQSxFQUFPLG1DQUZQO1FBR0EsV0FBQSxFQUFhLHdGQUhiO09BTkY7TUFVQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLEtBQUEsRUFBTywyQkFGUDtRQUdBLFdBQUEsRUFBYSx3Q0FIYjtPQVhGO01BZUEsb0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsS0FBQSxFQUFPLHdCQUZQO1FBR0EsV0FBQSxFQUFhLGtEQUhiO09BaEJGO01Bb0JBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsS0FBQSxFQUFPLG1CQUZQO1FBR0EsV0FBQSxFQUFhLHVDQUhiO09BckJGO01BeUJBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxtQkFEVDtPQTFCRjtLQURGO0lBOEJBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixXQUFBLEdBQWM7QUFDZDtRQUNFLFdBQUEsQ0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFaLEVBREY7T0FBQSxhQUFBO1FBR0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixrQkFBNUIsRUFDQTtVQUFDLFdBQUEsRUFBYSxJQUFkO1VBQW9CLE1BQUEsRUFBUSxnQ0FBNUI7U0FEQSxFQUhGOzs7UUFNQSxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztNQUN2QyxXQUFBLEdBQWMsSUFBSTtNQUVsQixXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQ2xELDJCQUFBLEVBQTZCLFNBQUMsQ0FBRDtpQkFBTSxXQUFBLENBQVksQ0FBWixFQUFlLGNBQWY7UUFBTixDQURxQjtRQUVsRCx5QkFBQSxFQUEyQixTQUFDLENBQUQ7aUJBQU0sV0FBQSxDQUFZLENBQVosRUFBZSxZQUFmO1FBQU4sQ0FGdUI7UUFHbEQseUJBQUEsRUFBMkIsU0FBQyxDQUFEO2lCQUFNLFdBQUEsQ0FBWSxDQUFaLEVBQWUsWUFBZjtRQUFOLENBSHVCO1FBSWxELDJCQUFBLEVBQTZCLFNBQUMsQ0FBRDtpQkFBTSxXQUFBLENBQVksQ0FBWixFQUFlLFlBQWY7UUFBTixDQUpxQjtRQUtsRCwyQkFBQSxFQUE2QixTQUFDLENBQUQ7aUJBQU0sV0FBQSxDQUFZLENBQVosRUFBZSxjQUFmO1FBQU4sQ0FMcUI7UUFNbEQsNkJBQUEsRUFBK0IsU0FBQyxDQUFEO2lCQUFNLFdBQUEsQ0FBWSxDQUFaLEVBQWUsZ0JBQWY7UUFBTixDQU5tQjtRQU9sRCx1QkFBQSxFQUF5QixTQUFDLENBQUQ7aUJBQU0sV0FBQSxDQUFZLENBQVosRUFBZSxVQUFmO1FBQU4sQ0FQeUI7UUFRbEQseUJBQUEsRUFBMkIsU0FBQyxDQUFEO2lCQUFNLFdBQUEsQ0FBWSxDQUFaLEVBQWUsWUFBZjtRQUFOLENBUnVCO1FBU2xELCtCQUFBLEVBQWlDLFNBQUMsQ0FBRDtpQkFBTSxXQUFBLENBQVksQ0FBWixFQUFlLGlCQUFmO1FBQU4sQ0FUaUI7UUFVbEQsMEJBQUEsRUFBNEIsU0FBQyxDQUFEO2lCQUFNLFdBQUEsQ0FBWSxDQUFaLEVBQWUsYUFBZjtRQUFOLENBVnNCO1FBV2xELGdDQUFBLEVBQWtDLFNBQUMsQ0FBRDtpQkFBTSxXQUFBLENBQVksQ0FBWixFQUFjLGtCQUFkO1FBQU4sQ0FYZ0I7UUFZbEQsdUJBQUEsRUFBeUIsU0FaeUI7T0FBcEMsQ0FBaEI7TUFlQSxXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLFNBQUMsWUFBRDtlQUM1QyxXQUFBLENBQVksWUFBWjtNQUQ0QyxDQUE5QixDQUFoQjthQUdBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO0FBQ2hELFlBQUE7UUFBQSxTQUFBLEdBQVksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxDQUFEO0FBQzNCLGNBQUE7VUFBQSxRQUFBLEdBQVcsQ0FBQyxDQUFDO1VBQ2IsTUFBOEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQTlCLEVBQUMsb0JBQUQsRUFBYztVQUNkLElBQUEsQ0FBYyxXQUFkO0FBQUEsbUJBQUE7O1VBRUEsV0FBQSxHQUFjLEVBQUUsQ0FBQyxZQUFILENBQWdCLFdBQWhCO1VBQ2QsVUFBQSxHQUFhLFdBQVksQ0FBQSxXQUFBO1VBQ3pCLElBQUEsQ0FBYyxVQUFkO0FBQUEsbUJBQUE7O1VBRUEsSUFBRyxFQUFFLENBQUMsWUFBSCxDQUFnQixRQUFoQixDQUFBLEtBQTZCLEVBQUUsQ0FBQyxZQUFILENBQWdCLFVBQVUsQ0FBQyxVQUEzQixDQUFoQztZQUNFLFVBQUEsR0FBYSxNQUFBLENBQU8sV0FBUCxFQURmOztVQUdBLElBQUEsQ0FBYyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQTlCO0FBQUEsbUJBQUE7O2lCQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLENBQXRCO1FBYjJCLENBQWpCO1FBZ0JaLFlBQUEsR0FBZSxNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO1VBQ2pDLFdBQVcsQ0FBQyxNQUFaLENBQW1CLFNBQW5CO1VBQ0EsV0FBVyxDQUFDLE1BQVosQ0FBbUIsWUFBbkI7VUFDQSxZQUFZLENBQUMsT0FBYixDQUFBO2lCQUNBLFNBQVMsQ0FBQyxPQUFWLENBQUE7UUFKaUMsQ0FBcEI7UUFNZixXQUFXLENBQUMsR0FBWixDQUFnQixTQUFoQjtlQUNBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFlBQWhCO01BeEJnRCxDQUFsQyxDQUFoQjtJQTdCUSxDQTlCVjtJQXNGQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxXQUFXLENBQUMsT0FBWixDQUFBO01BQ0EsV0FBQSxHQUFjO0FBQ2QsV0FBQSwwQkFBQTs7UUFDRSxHQUFHLENBQUMsT0FBSixDQUFBO0FBREY7YUFFQSxXQUFBLEdBQWM7SUFMSixDQXRGWjs7QUE1REYiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxuXG5Db21wb3NpdGVEaXNwb3NhYmxlID0gbnVsbFxucGF0aCA9IG51bGxcbiQgPSBudWxsXG5cbmdldEV2ZW50UGF0aCA9IChlKS0+XG4gICQgPz0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS4kXG5cbiAgdGFyZ2V0ID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmZpbGUsIC5kaXJlY3RvcnksIC50YWInKVswXVxuICB0YXJnZXQgPz0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZnVsbFBhdGggPSB0YXJnZXQ/LmdldFBhdGg/KClcbiAgcmV0dXJuIFtdIHVubGVzcyBmdWxsUGF0aFxuXG4gIFtwcm9qZWN0UGF0aCwgcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmdWxsUGF0aClcbiAgcmV0dXJuIFtwcm9qZWN0UGF0aCwgZnVsbFBhdGhdXG5cbnByb2plY3REaWN0ID0gbnVsbFxuZGlzcG9zYWJsZXMgPSBudWxsXG5SZW1vdGVTeW5jID0gbnVsbFxuaW5pdFByb2plY3QgPSAocHJvamVjdFBhdGhzKS0+XG4gIGRpc3Bvc2VzID0gW11cbiAgZm9yIHByb2plY3RQYXRoIG9mIHByb2plY3REaWN0XG4gICAgZGlzcG9zZXMucHVzaCBwcm9qZWN0UGF0aCBpZiBwcm9qZWN0UGF0aHMuaW5kZXhPZihwcm9qZWN0UGF0aCkgPT0gLTFcblxuICBmb3IgcHJvamVjdFBhdGggaW4gZGlzcG9zZXNcbiAgICBwcm9qZWN0RGljdFtwcm9qZWN0UGF0aF0uZGlzcG9zZSgpXG4gICAgZGVsZXRlIHByb2plY3REaWN0W3Byb2plY3RQYXRoXVxuXG4gIGZvciBwcm9qZWN0UGF0aCBpbiBwcm9qZWN0UGF0aHNcbiAgICB0cnlcbiAgICAgICAgcHJvamVjdFBhdGggPSBmcy5yZWFscGF0aFN5bmMocHJvamVjdFBhdGgpXG4gICAgY2F0Y2ggZXJyXG4gICAgICAgIGNvbnRpbnVlXG4gICAgY29udGludWUgaWYgcHJvamVjdERpY3RbcHJvamVjdFBhdGhdXG4gICAgUmVtb3RlU3luYyA/PSByZXF1aXJlIFwiLi9saWIvUmVtb3RlU3luY1wiXG4gICAgb2JqID0gUmVtb3RlU3luYy5jcmVhdGUocHJvamVjdFBhdGgpXG4gICAgcHJvamVjdERpY3RbcHJvamVjdFBhdGhdID0gb2JqIGlmIG9ialxuXG5oYW5kbGVFdmVudCA9IChlLCBjbWQpLT5cbiAgW3Byb2plY3RQYXRoLCBmdWxsUGF0aF0gPSBnZXRFdmVudFBhdGgoZSlcbiAgcmV0dXJuIHVubGVzcyBwcm9qZWN0UGF0aFxuXG4gIHByb2plY3RPYmogPSBwcm9qZWN0RGljdFtmcy5yZWFscGF0aFN5bmMocHJvamVjdFBhdGgpXVxuICBwcm9qZWN0T2JqW2NtZF0/KGZzLnJlYWxwYXRoU3luYyhmdWxsUGF0aCkpXG5cbnJlbG9hZCA9IChwcm9qZWN0UGF0aCktPlxuICBwcm9qZWN0RGljdFtwcm9qZWN0UGF0aF0/LmRpc3Bvc2UoKVxuICBwcm9qZWN0RGljdFtwcm9qZWN0UGF0aF0gPSBSZW1vdGVTeW5jLmNyZWF0ZShwcm9qZWN0UGF0aClcblxuY29uZmlndXJlID0gKGUpLT5cbiAgW3Byb2plY3RQYXRoXSA9IGdldEV2ZW50UGF0aChlKVxuICByZXR1cm4gdW5sZXNzIHByb2plY3RQYXRoXG5cbiAgcHJvamVjdFBhdGggPSBmcy5yZWFscGF0aFN5bmMocHJvamVjdFBhdGgpXG4gIFJlbW90ZVN5bmMgPz0gcmVxdWlyZSBcIi4vbGliL1JlbW90ZVN5bmNcIlxuICBSZW1vdGVTeW5jLmNvbmZpZ3VyZSBwcm9qZWN0UGF0aCwgLT4gcmVsb2FkKHByb2plY3RQYXRoKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBsb2dUb0NvbnNvbGU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0aXRsZTogJ0xvZyB0byBjb25zb2xlJ1xuICAgICAgZGVzY3JpcHRpb246ICdMb2cgbWVzc2FnZXMgdG8gdGhlIGNvbnNvbGUgaW5zdGVhZCBvZiB0aGUgc3RhdHVzIHZpZXcgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93J1xuICAgIGF1dG9IaWRlTG9nUGFuZWw6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0aXRsZTogJ0hpZGUgbG9nIHBhbmVsIGFmdGVyIHRyYW5zZmVycmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGlkZXMgdGhlIHN0YXR1cyB2aWV3IGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvdyBhZnRlciB0aGUgdHJhbnNmZXIgb3BlcmF0aW9uIGlzIGRvbmUnXG4gICAgZm9sZExvZ1BhbmVsOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgdGl0bGU6ICdGb2xkIGxvZyBwYW5lbCBieSBkZWZhdWx0J1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93cyBvbmx5IG9uZSBsaW5lIGluIHRoZSBzdGF0dXMgdmlldydcbiAgICBtb25pdG9yRmlsZUFuaW1hdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgdGl0bGU6ICdNb25pdG9yIGZpbGUgYW5pbWF0aW9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdUb2dnbGVzIHRoZSBwdWxzZSBhbmltYXRpb24gZm9yIGEgbW9uaXRvcmVkIGZpbGUnXG4gICAgZGlmZnRvb2xDb21tYW5kOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICB0aXRsZTogJ0RpZmYgdG9vbCBjb21tYW5kJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29tbWFuZCB0byBydW4gZm9yIHlvdXIgZGlmZiB0b29sJ1xuICAgIGNvbmZpZ0ZpbGVOYW1lOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcucmVtb3RlLXN5bmMuanNvbidcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIHByb2plY3REaWN0ID0ge31cbiAgICB0cnlcbiAgICAgIGluaXRQcm9qZWN0KGF0b20ucHJvamVjdC5nZXRQYXRocygpKVxuICAgIGNhdGNoXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJSZW1vdGVTeW5jIEVycm9yXCIsXG4gICAgICB7ZGlzbWlzc2FibGU6IHRydWUsIGRldGFpbDogXCJGYWlsZWQgdG8gaW5pdGFsaXNlIFJlbW90ZVN5bmNcIn1cblxuICAgIENvbXBvc2l0ZURpc3Bvc2FibGUgPz0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3JlbW90ZS1zeW5jOnVwbG9hZC1mb2xkZXInOiAoZSktPiBoYW5kbGVFdmVudChlLCBcInVwbG9hZEZvbGRlclwiKVxuICAgICAgJ3JlbW90ZS1zeW5jOnVwbG9hZC1maWxlJzogKGUpLT4gaGFuZGxlRXZlbnQoZSwgXCJ1cGxvYWRGaWxlXCIpXG4gICAgICAncmVtb3RlLXN5bmM6ZGVsZXRlLWZpbGUnOiAoZSktPiBoYW5kbGVFdmVudChlLCBcImRlbGV0ZUZpbGVcIilcbiAgICAgICdyZW1vdGUtc3luYzpkZWxldGUtZm9sZGVyJzogKGUpLT4gaGFuZGxlRXZlbnQoZSwgXCJkZWxldGVGaWxlXCIpXG4gICAgICAncmVtb3RlLXN5bmM6ZG93bmxvYWQtZmlsZSc6IChlKS0+IGhhbmRsZUV2ZW50KGUsIFwiZG93bmxvYWRGaWxlXCIpXG4gICAgICAncmVtb3RlLXN5bmM6ZG93bmxvYWQtZm9sZGVyJzogKGUpLT4gaGFuZGxlRXZlbnQoZSwgXCJkb3dubG9hZEZvbGRlclwiKVxuICAgICAgJ3JlbW90ZS1zeW5jOmRpZmYtZmlsZSc6IChlKS0+IGhhbmRsZUV2ZW50KGUsIFwiZGlmZkZpbGVcIilcbiAgICAgICdyZW1vdGUtc3luYzpkaWZmLWZvbGRlcic6IChlKS0+IGhhbmRsZUV2ZW50KGUsIFwiZGlmZkZvbGRlclwiKVxuICAgICAgJ3JlbW90ZS1zeW5jOnVwbG9hZC1naXQtY2hhbmdlJzogKGUpLT4gaGFuZGxlRXZlbnQoZSwgXCJ1cGxvYWRHaXRDaGFuZ2VcIilcbiAgICAgICdyZW1vdGUtc3luYzptb25pdG9yLWZpbGUnOiAoZSktPiBoYW5kbGVFdmVudChlLCBcIm1vbml0b3JGaWxlXCIpXG4gICAgICAncmVtb3RlLXN5bmM6bW9uaXRvci1maWxlcy1saXN0JzogKGUpLT4gaGFuZGxlRXZlbnQoZSxcIm1vbml0b3JGaWxlc0xpc3RcIilcbiAgICAgICdyZW1vdGUtc3luYzpjb25maWd1cmUnOiBjb25maWd1cmVcbiAgICB9KVxuXG4gICAgZGlzcG9zYWJsZXMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzIChwcm9qZWN0UGF0aHMpLT5cbiAgICAgIGluaXRQcm9qZWN0KHByb2plY3RQYXRocylcblxuICAgIGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICAgIG9uRGlkU2F2ZSA9IGVkaXRvci5vbkRpZFNhdmUgKGUpIC0+XG4gICAgICAgIGZ1bGxQYXRoID0gZS5wYXRoXG4gICAgICAgIFtwcm9qZWN0UGF0aCwgcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmdWxsUGF0aClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0UGF0aFxuXG4gICAgICAgIHByb2plY3RQYXRoID0gZnMucmVhbHBhdGhTeW5jKHByb2plY3RQYXRoKVxuICAgICAgICBwcm9qZWN0T2JqID0gcHJvamVjdERpY3RbcHJvamVjdFBhdGhdXG4gICAgICAgIHJldHVybiB1bmxlc3MgcHJvamVjdE9ialxuXG4gICAgICAgIGlmIGZzLnJlYWxwYXRoU3luYyhmdWxsUGF0aCkgPT0gZnMucmVhbHBhdGhTeW5jKHByb2plY3RPYmouY29uZmlnUGF0aClcbiAgICAgICAgICBwcm9qZWN0T2JqID0gcmVsb2FkKHByb2plY3RQYXRoKVxuXG4gICAgICAgIHJldHVybiB1bmxlc3MgcHJvamVjdE9iai5ob3N0LnVwbG9hZE9uU2F2ZVxuICAgICAgICBwcm9qZWN0T2JqLnVwbG9hZEZpbGUoZnMucmVhbHBhdGhTeW5jKGZ1bGxQYXRoKSlcblxuXG4gICAgICBvbkRpZERlc3Ryb3kgPSBlZGl0b3Iub25EaWREZXN0cm95IC0+XG4gICAgICAgIGRpc3Bvc2FibGVzLnJlbW92ZSBvbkRpZFNhdmVcbiAgICAgICAgZGlzcG9zYWJsZXMucmVtb3ZlIG9uRGlkRGVzdHJveVxuICAgICAgICBvbkRpZERlc3Ryb3kuZGlzcG9zZSgpXG4gICAgICAgIG9uRGlkU2F2ZS5kaXNwb3NlKClcblxuICAgICAgZGlzcG9zYWJsZXMuYWRkIG9uRGlkU2F2ZVxuICAgICAgZGlzcG9zYWJsZXMuYWRkIG9uRGlkRGVzdHJveVxuXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBkaXNwb3NhYmxlcyA9IG51bGxcbiAgICBmb3IgcHJvamVjdFBhdGgsIG9iaiBvZiBwcm9qZWN0RGljdFxuICAgICAgb2JqLmRpc3Bvc2UoKVxuICAgIHByb2plY3REaWN0ID0gbnVsbFxuIl19
