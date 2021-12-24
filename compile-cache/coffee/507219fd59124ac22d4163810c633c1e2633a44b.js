(function() {
  var ActivityLogger, BufferedProcess, Directory, Os, RepoListView, Repository, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, ref;

  Os = require('os');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, Directory = ref.Directory;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  Repository = require('./repository')["default"];

  ActivityLogger = require('./activity-logger')["default"];

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data, arg) {
    var i, mode, staged;
    staged = (arg != null ? arg : {}).staged;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          staged: staged,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(ref1 = (function() {
      var j, len, ref2, results;
      ref2 = data.slice(1);
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        line = ref2[j];
        results.push('@@' + line);
      }
      return results;
    })())), ref1;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, ref1;
      project = atom.project;
      path = (ref1 = atom.workspace.getCenter().getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options, arg) {
      var color;
      if (options == null) {
        options = {
          env: process.env
        };
      }
      color = (arg != null ? arg : {}).color;
      return new Promise(function(resolve, reject) {
        var output, process, ref1;
        output = '';
        if (color) {
          args = ['-c', 'color.ui=always'].concat(args);
        }
        process = new BufferedProcess({
          command: (ref1 = atom.config.get('git-plus.general.gitPath')) != null ? ref1 : 'git',
          args: args,
          options: options,
          stdout: function(data) {
            return output += data.toString();
          },
          stderr: function(data) {
            return output += data.toString();
          },
          exit: function(code) {
            if (code === 0) {
              return resolve(output);
            } else {
              return reject(output);
            }
          }
        });
        return process.onWillThrowError(function(errorObject) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        });
      });
    },
    getConfig: function(repo, setting) {
      return repo.getConfigValue(setting, repo.getWorkingDirectory());
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0').slice(0, -1);
        } else {
          return [];
        }
      });
    },
    refresh: function(repo) {
      if (repo) {
        if (typeof repo.refreshStatus === "function") {
          repo.refreshStatus();
        }
        return typeof repo.refreshIndex === "function" ? repo.refreshIndex() : void 0;
      } else {
        return atom.project.getRepositories().forEach(function(repo) {
          if (repo != null) {
            return repo.refreshStatus();
          }
        });
      }
    },
    relativize: function(path) {
      var ref1, ref2, ref3, ref4;
      return (ref1 = (ref2 = (ref3 = git.getSubmodule(path)) != null ? ref3.relativize(path) : void 0) != null ? ref2 : (ref4 = atom.project.getRepositories()[0]) != null ? ref4.relativize(path) : void 0) != null ? ref1 : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data, {
          staged: true
        });
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, arg) {
      var args, showUntracked;
      showUntracked = (arg != null ? arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data, {
            staged: false
          }));
        } else {
          return _prettify(data, {
            staged: false
          });
        }
      });
    },
    add: function(repo, arg) {
      var args, file, message, ref1, repoName, update;
      ref1 = arg != null ? arg : {}, file = ref1.file, update = ref1.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      message = "git add " + args[args.length - 1];
      repoName = new Repository(repo).getName();
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: output
        });
      })["catch"](function(output) {
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: output,
          failed: true
        });
      });
    },
    getAllRepos: function() {
      var project;
      project = atom.project;
      return Promise.all(project.getDirectories().map(project.repositoryForDirectory.bind(project)));
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getRepoForPath: function(path) {
      if (path == null) {
        return Promise.reject("No file to find repository for");
      } else {
        return new Promise(function(resolve, reject) {
          var repoPromises;
          repoPromises = atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project));
          return Promise.all(repoPromises).then(function(repos) {
            return repos.filter(Boolean).forEach(function(repo) {
              var directory, submodule;
              directory = new Directory(repo.getWorkingDirectory());
              if ((repo != null) && directory.contains(path) || directory.getPath() === path) {
                submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
                if (submodule != null) {
                  return resolve(submodule);
                } else {
                  return resolve(repo);
                }
              }
            });
          });
        });
      }
    },
    getSubmodule: function(path) {
      var ref1, ref2, ref3;
      if (path == null) {
        path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      }
      return (ref2 = atom.project.getRepositories().filter(function(r) {
        var ref3;
        return r != null ? (ref3 = r.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (ref3 = ref2.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsTUFBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQyxxQ0FBRCxFQUFrQjs7RUFFbEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBQ1gsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQXVCLEVBQUMsT0FBRDs7RUFDckMsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBNEIsRUFBQyxPQUFEOztFQUU3QyxpQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxZQUFQO0FBQ2xCLFFBQUE7O01BRHlCLGVBQWE7O0lBQ3RDLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLG9CQUFuQjtXQUNQLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUNKLFlBQVksQ0FBQyxNQUFiLENBQW9CLGtCQUFBLENBQW1CLElBQW5CLENBQXBCO0lBREksQ0FETjtFQUZrQjs7RUFNcEIsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDVixRQUFBO0lBRGtCLHdCQUFELE1BQVM7SUFDMUIsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEdBQVA7O0lBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQjs7O0FBQ25CO1dBQUEsaURBQUE7O3FCQUNIO1VBQUMsTUFBQSxJQUFEO1VBQU8sUUFBQSxNQUFQO1VBQWUs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SixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNWLGNBQUE7VUFBQSxJQUFHLGFBQUEsSUFBa0IsQ0FBQSxTQUFBLEdBQVksR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFaLENBQXJCO21CQUNFLE9BQUEsQ0FBUSxTQUFTLENBQUMsbUJBQVYsQ0FBQSxDQUFSLEVBREY7V0FBQSxNQUFBO21CQUdFLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO3FCQUFVLE9BQUEsQ0FBUSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFSO1lBQVYsQ0FBbkIsRUFIRjs7UUFEVTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtJQURHLENBekhMOztBQTdDRiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG57QnVmZmVyZWRQcm9jZXNzLCBEaXJlY3Rvcnl9ID0gcmVxdWlyZSAnYXRvbSdcblxuUmVwb0xpc3RWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9yZXBvLWxpc3Qtdmlldydcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi9ub3RpZmllcidcblJlcG9zaXRvcnkgPSAgcmVxdWlyZSgnLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblxuZ2l0VW50cmFja2VkRmlsZXMgPSAocmVwbywgZGF0YVVuc3RhZ2VkPVtdKSAtPlxuICBhcmdzID0gWydscy1maWxlcycsICctbycsICctLWV4Y2x1ZGUtc3RhbmRhcmQnXVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIGRhdGFVbnN0YWdlZC5jb25jYXQoX3ByZXR0aWZ5VW50cmFja2VkKGRhdGEpKVxuXG5fcHJldHRpZnkgPSAoZGF0YSwge3N0YWdlZH09e30pIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXDAvKVsuLi4tMV1cbiAgW10gPSBmb3IgbW9kZSwgaSBpbiBkYXRhIGJ5IDJcbiAgICB7bW9kZSwgc3RhZ2VkLCBwYXRoOiBkYXRhW2krMV19XG5cbl9wcmV0dGlmeVVudHJhY2tlZCA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFxuLykuZmlsdGVyIChkKSAtPiBkIGlzbnQgJydcbiAgZGF0YS5tYXAgKGZpbGUpIC0+IHttb2RlOiAnPycsIHBhdGg6IGZpbGV9XG5cbl9wcmV0dGlmeURpZmYgPSAoZGF0YSkgLT5cbiAgZGF0YSA9IGRhdGEuc3BsaXQoL15AQCg/PVsgXFwtXFwrXFwsMC05XSpAQCkvZ20pXG4gIGRhdGFbMS4uZGF0YS5sZW5ndGhdID0gKCdAQCcgKyBsaW5lIGZvciBsaW5lIGluIGRhdGFbMS4uXSlcbiAgZGF0YVxuXG5nZXRSZXBvRm9yQ3VycmVudEZpbGUgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIHByb2plY3QgPSBhdG9tLnByb2plY3RcbiAgICBwYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgICBkaXJlY3RvcnkgPSBwcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKChkKSAtPiBkLmNvbnRhaW5zKHBhdGgpKVswXVxuICAgIGlmIGRpcmVjdG9yeT9cbiAgICAgIHByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShkaXJlY3RvcnkpLnRoZW4gKHJlcG8pIC0+XG4gICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8ucmVwby5zdWJtb2R1bGVGb3JQYXRoKHBhdGgpXG4gICAgICAgIGlmIHN1Ym1vZHVsZT8gdGhlbiByZXNvbHZlKHN1Ym1vZHVsZSkgZWxzZSByZXNvbHZlKHJlcG8pXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHJlamVjdChlKVxuICAgIGVsc2VcbiAgICAgIHJlamVjdCBcIm5vIGN1cnJlbnQgZmlsZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0ID1cbiAgY21kOiAoYXJncywgb3B0aW9ucz17IGVudjogcHJvY2Vzcy5lbnZ9LCB7Y29sb3J9PXt9KSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBvdXRwdXQgPSAnJ1xuICAgICAgYXJncyA9IFsnLWMnLCAnY29sb3IudWk9YWx3YXlzJ10uY29uY2F0KGFyZ3MpIGlmIGNvbG9yXG4gICAgICBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzc1xuICAgICAgICBjb21tYW5kOiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuZ2l0UGF0aCcpID8gJ2dpdCdcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgIHN0ZG91dDogKGRhdGEpIC0+IG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgc3RkZXJyOiAoZGF0YSkgLT5cbiAgICAgICAgICBvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgIGV4aXQ6IChjb2RlKSAtPlxuICAgICAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICAgICAgcmVzb2x2ZSBvdXRwdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZWplY3Qgb3V0cHV0XG4gICAgICBwcm9jZXNzLm9uV2lsbFRocm93RXJyb3IgKGVycm9yT2JqZWN0KSAtPlxuICAgICAgICBub3RpZmllci5hZGRFcnJvciAnR2l0IFBsdXMgaXMgdW5hYmxlIHRvIGxvY2F0ZSB0aGUgZ2l0IGNvbW1hbmQuIFBsZWFzZSBlbnN1cmUgcHJvY2Vzcy5lbnYuUEFUSCBjYW4gYWNjZXNzIGdpdC4nXG4gICAgICAgIHJlamVjdCBcIkNvdWxkbid0IGZpbmQgZ2l0XCJcblxuICBnZXRDb25maWc6IChyZXBvLCBzZXR0aW5nKSAtPiByZXBvLmdldENvbmZpZ1ZhbHVlIHNldHRpbmcsIHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgcmVzZXQ6IChyZXBvKSAtPlxuICAgIGdpdC5jbWQoWydyZXNldCcsICdIRUFEJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpLnRoZW4gKCkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyAnQWxsIGNoYW5nZXMgdW5zdGFnZWQnXG5cbiAgc3RhdHVzOiAocmVwbykgLT5cbiAgICBnaXQuY21kKFsnc3RhdHVzJywgJy0tcG9yY2VsYWluJywgJy16J10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IGlmIGRhdGEubGVuZ3RoID4gMiB0aGVuIGRhdGEuc3BsaXQoJ1xcMCcpWy4uLi0xXSBlbHNlIFtdXG5cbiAgcmVmcmVzaDogKHJlcG8pIC0+XG4gICAgaWYgcmVwb1xuICAgICAgcmVwby5yZWZyZXNoU3RhdHVzPygpXG4gICAgICByZXBvLnJlZnJlc2hJbmRleD8oKVxuICAgIGVsc2VcbiAgICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5mb3JFYWNoIChyZXBvKSAtPiByZXBvLnJlZnJlc2hTdGF0dXMoKSBpZiByZXBvP1xuXG4gIHJlbGF0aXZpemU6IChwYXRoKSAtPlxuICAgIGdpdC5nZXRTdWJtb2R1bGUocGF0aCk/LnJlbGF0aXZpemUocGF0aCkgPyBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbMF0/LnJlbGF0aXZpemUocGF0aCkgPyBwYXRoXG5cbiAgZGlmZjogKHJlcG8sIHBhdGgpIC0+XG4gICAgZ2l0LmNtZChbJ2RpZmYnLCAnLXAnLCAnLVUxJywgcGF0aF0sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IF9wcmV0dGlmeURpZmYoZGF0YSlcblxuICBzdGFnZWRGaWxlczogKHJlcG8pIC0+XG4gICAgYXJncyA9IFsnZGlmZi1pbmRleCcsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIF9wcmV0dGlmeSBkYXRhLCBzdGFnZWQ6IHRydWVcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgaWYgZXJyb3IuaW5jbHVkZXMgXCJhbWJpZ3VvdXMgYXJndW1lbnQgJ0hFQUQnXCJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlIFsxXVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJvclxuICAgICAgICBQcm9taXNlLnJlc29sdmUgW11cblxuICB1bnN0YWdlZEZpbGVzOiAocmVwbywge3Nob3dVbnRyYWNrZWR9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2RpZmYtZmlsZXMnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgaWYgc2hvd1VudHJhY2tlZFxuICAgICAgICBnaXRVbnRyYWNrZWRGaWxlcyhyZXBvLCBfcHJldHRpZnkoZGF0YSwgc3RhZ2VkOiBmYWxzZSkpXG4gICAgICBlbHNlXG4gICAgICAgIF9wcmV0dGlmeShkYXRhLCBzdGFnZWQ6IGZhbHNlKVxuXG4gIGFkZDogKHJlcG8sIHtmaWxlLCB1cGRhdGV9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2FkZCddXG4gICAgaWYgdXBkYXRlIHRoZW4gYXJncy5wdXNoICctLXVwZGF0ZScgZWxzZSBhcmdzLnB1c2ggJy0tYWxsJ1xuICAgIGFyZ3MucHVzaChpZiBmaWxlIHRoZW4gZmlsZSBlbHNlICcuJylcblxuICAgIG1lc3NhZ2UgPSBcIlwiXCJnaXQgYWRkICN7YXJnc1thcmdzLmxlbmd0aCAtIDFdfVwiXCJcIlxuXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKG91dHB1dCkgLT4gQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZSxvdXRwdXR9KVxuICAgIC5jYXRjaCAob3V0cHV0KSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtcbiAgICAgICAgcmVwb05hbWUsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIG91dHB1dCxcbiAgICAgICAgZmFpbGVkOiB0cnVlXG4gICAgICB9KVxuXG4gIGdldEFsbFJlcG9zOiAtPlxuICAgIHtwcm9qZWN0fSA9IGF0b21cbiAgICBQcm9taXNlLmFsbChwcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgIC5tYXAocHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5LmJpbmQocHJvamVjdCkpKVxuXG4gIGdldFJlcG86IC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGdldFJlcG9Gb3JDdXJyZW50RmlsZSgpLnRoZW4gKHJlcG8pIC0+IHJlc29sdmUocmVwbylcbiAgICAgIC5jYXRjaCAoZSkgLT5cbiAgICAgICAgcmVwb3MgPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZmlsdGVyIChyKSAtPiByP1xuICAgICAgICBpZiByZXBvcy5sZW5ndGggaXMgMFxuICAgICAgICAgIHJlamVjdChcIk5vIHJlcG9zIGZvdW5kXCIpXG4gICAgICAgIGVsc2UgaWYgcmVwb3MubGVuZ3RoID4gMVxuICAgICAgICAgIHJlc29sdmUobmV3IFJlcG9MaXN0VmlldyhyZXBvcykucmVzdWx0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzb2x2ZShyZXBvc1swXSlcblxuICBnZXRSZXBvRm9yUGF0aDogKHBhdGgpIC0+XG4gICAgaWYgbm90IHBhdGg/XG4gICAgICBQcm9taXNlLnJlamVjdCBcIk5vIGZpbGUgdG8gZmluZCByZXBvc2l0b3J5IGZvclwiXG4gICAgZWxzZVxuICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgcmVwb1Byb21pc2VzID1cbiAgICAgICAgICBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICAgIC5tYXAoYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkuYmluZChhdG9tLnByb2plY3QpKVxuXG4gICAgICAgIFByb21pc2UuYWxsKHJlcG9Qcm9taXNlcykudGhlbiAocmVwb3MpIC0+XG4gICAgICAgICAgcmVwb3MuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2ggKHJlcG8pIC0+XG4gICAgICAgICAgICBkaXJlY3RvcnkgPSBuZXcgRGlyZWN0b3J5KHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAgICAgaWYgcmVwbz8gYW5kIGRpcmVjdG9yeS5jb250YWlucyhwYXRoKSBvciBkaXJlY3RvcnkuZ2V0UGF0aCgpIGlzIHBhdGhcbiAgICAgICAgICAgICAgc3VibW9kdWxlID0gcmVwbz8ucmVwby5zdWJtb2R1bGVGb3JQYXRoKHBhdGgpXG4gICAgICAgICAgICAgIGlmIHN1Ym1vZHVsZT8gdGhlbiByZXNvbHZlKHN1Ym1vZHVsZSkgZWxzZSByZXNvbHZlKHJlcG8pXG5cbiAgZ2V0U3VibW9kdWxlOiAocGF0aCkgLT5cbiAgICBwYXRoID89IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG4gICAgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlcigocikgLT5cbiAgICAgIHI/LnJlcG8/LnN1Ym1vZHVsZUZvclBhdGggcGF0aFxuICAgIClbMF0/LnJlcG8/LnN1Ym1vZHVsZUZvclBhdGggcGF0aFxuXG4gIGRpcjogKGFuZFN1Ym1vZHVsZXM9dHJ1ZSkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgaWYgYW5kU3VibW9kdWxlcyBhbmQgc3VibW9kdWxlID0gZ2l0LmdldFN1Ym1vZHVsZSgpXG4gICAgICAgIHJlc29sdmUoc3VibW9kdWxlLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIGVsc2VcbiAgICAgICAgZ2l0LmdldFJlcG8oKS50aGVuIChyZXBvKSAtPiByZXNvbHZlKHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuIl19
