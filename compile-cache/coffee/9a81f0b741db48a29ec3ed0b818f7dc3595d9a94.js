(function() {
  var $$, ActivityLogger, ListView, RemoteBranchListView, Repository, SelectListView, _pull, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  _pull = require('../models/_pull');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoteBranchListView = require('./remote-branch-list-view');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, arg1) {
      var ref1;
      this.repo = repo;
      this.data = data1;
      ref1 = arg1 != null ? arg1 : {}, this.mode = ref1.mode, this.tag = ref1.tag, this.extraArgs = ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve1, reject1) {
          _this.resolve = resolve1;
          _this.reject = reject1;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg1) {
      var name;
      name = arg1.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        return git.cmd(['branch', '--no-color', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new Promise(function(resolve, reject) {
              return new RemoteBranchListView(data, remoteName, function(arg1) {
                var args, branchName, name, repoName, startMessage;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                startMessage = notifier.addInfo("Pulling...", {
                  dismissable: true
                });
                args = ['pull'].concat(_this.extraArgs, remoteName, branchName).filter(function(arg) {
                  return arg !== '';
                });
                repoName = new Repository(_this.repo).getName();
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  resolve(branchName);
                  repoName = new Repository(_this.repo).getName();
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data
                  });
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  reject();
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: error,
                    failed: true
                  });
                  return startMessage.dismiss();
                });
              });
            });
          };
        })(this));
      } else {
        return _pull(this.repo, {
          extraArgs: this.extraArgs
        });
      }
    };

    ListView.prototype.confirmed = function(arg1) {
      var name, pullBeforePush;
      name = arg1.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullBeforePush = atom.config.get('git-plus.remoteInteractions.pullBeforePush');
        if (pullBeforePush && atom.config.get('git-plus.remoteInteractions.pullRebase')) {
          this.extraArgs = '--rebase';
        }
        if (pullBeforePush) {
          this.pull(name).then((function(_this) {
            return function(branch) {
              return _this.execute(name, null, branch);
            };
          })(this));
        } else {
          this.execute(name);
        }
      } else if (this.mode === 'push -u') {
        this.pushAndSetUpstream(name);
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs, branch) {
      var args, message, repoName, startMessage;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        if (branch != null) {
          args = [this.mode];
          if (extraArgs.length > 0) {
            args.push(extraArgs);
          }
          args = args.concat([remote, branch]);
          message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
          startMessage = notifier.addInfo(message, {
            dismissable: true
          });
          return git.cmd(args, {
            cwd: this.repo.getWorkingDirectory()
          }, {
            color: true
          }).then((function(_this) {
            return function(data) {
              startMessage.dismiss();
              return git.refresh(_this.repo);
            };
          })(this))["catch"]((function(_this) {
            return function(data) {
              return startMessage.dismiss();
            };
          })(this));
        } else {
          return git.cmd(['branch', '--no-color', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteBranchListView(data, remote, function(arg1) {
                var branchName, name, repoName;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                startMessage = notifier.addInfo("Pushing...", {
                  dismissable: true
                });
                args = ['push'].concat(extraArgs, remote, branchName).filter(function(arg) {
                  return arg !== '';
                });
                repoName = new Repository(_this.repo).getName();
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data
                  });
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: error,
                    failed: true
                  });
                  return startMessage.dismiss();
                });
              });
            };
          })(this));
        }
      } else {
        args = [this.mode];
        if (extraArgs.length > 0) {
          args.push(extraArgs);
        }
        args = args.concat([remote, this.tag]).filter(function(arg) {
          return arg !== '';
        });
        message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
        startMessage = notifier.addInfo(message, {
          dismissable: true
        });
        repoName = new Repository(this.repo).getName();
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }, {
          color: true
        }).then((function(_this) {
          return function(data) {
            ActivityLogger.record({
              repoName: repoName,
              message: args.join(' '),
              output: data
            });
            startMessage.dismiss();
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(data) {
            ActivityLogger.record({
              repoName: repoName,
              message: args.join(' '),
              output: data,
              failed: true
            });
            return startMessage.dismiss();
          };
        })(this));
      }
    };

    ListView.prototype.pushAndSetUpstream = function(remote) {
      var args, message, repoName, startMessage;
      if (remote == null) {
        remote = '';
      }
      args = ['push', '-u', remote, 'HEAD'].filter(function(arg) {
        return arg !== '';
      });
      message = "Pushing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      repoName = new Repository(this.repo).getName();
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        ActivityLogger.record({
          repoName: repoName,
          message: args.join(' '),
          output: data
        });
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          ActivityLogger.record({
            repoName: repoName,
            message: args.join(' '),
            output: data,
            failed: true
          });
          return startMessage.dismiss();
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdGUtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUdBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUVMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSOztFQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFdkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUixFQUFlLElBQWY7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsT0FBRDs0QkFBTyxPQUEwQixJQUF6QixJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxXQUFBLEtBQUssSUFBQyxDQUFBLGlCQUFBO01BQ3hDLDBDQUFBLFNBQUE7O1FBQ0EsSUFBQyxDQUFBLE1BQU87OztRQUNSLElBQUMsQ0FBQSxZQUFhOztNQUNkLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLE9BQUosQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRCxFQUFXLE9BQVg7VUFBQyxLQUFDLENBQUEsVUFBRDtVQUFVLEtBQUMsQ0FBQSxTQUFEO1FBQVg7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QXRCO2VBQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBQTtNQUZJLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7WUFBQyxVQUFBLFFBQUQ7WUFBVyxPQUFBLEVBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQXBCO1lBQW9DLE1BQUEsRUFBUSxJQUE1QztZQUFrRCxNQUFBLEVBQVEsSUFBMUQ7V0FBdEI7aUJBQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBQTtRQUZLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpQO0lBTGtCOzs7O0tBNUhDO0FBVnZCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuX3B1bGwgPSByZXF1aXJlICcuLi9tb2RlbHMvX3B1bGwnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblJlbW90ZUJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi9yZW1vdGUtYnJhbmNoLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhLCB7QG1vZGUsIEB0YWcsIEBleHRyYUFyZ3N9PXt9KSAtPlxuICAgIHN1cGVyXG4gICAgQHRhZyA/PSAnJ1xuICAgIEBleHRyYUFyZ3MgPz0gW11cbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG4gICAgQHJlc3VsdCA9IG5ldyBQcm9taXNlIChAcmVzb2x2ZSwgQHJlamVjdCkgPT5cblxuICBwYXJzZURhdGE6IC0+XG4gICAgaXRlbXMgPSBAZGF0YS5zcGxpdChcIlxcblwiKVxuICAgIHJlbW90ZXMgPSBpdGVtcy5maWx0ZXIoKGl0ZW0pIC0+IGl0ZW0gaXNudCAnJykubWFwIChpdGVtKSAtPiB7IG5hbWU6IGl0ZW0gfVxuICAgIGlmIHJlbW90ZXMubGVuZ3RoIGlzIDFcbiAgICAgIEBjb25maXJtZWQgcmVtb3Rlc1swXVxuICAgIGVsc2VcbiAgICAgIEBzZXRJdGVtcyByZW1vdGVzXG4gICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHtuYW1lfSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpIG5hbWVcblxuICBwdWxsOiAocmVtb3RlTmFtZSkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wcm9tcHRGb3JCcmFuY2gnKVxuICAgICAgZ2l0LmNtZChbJ2JyYW5jaCcsICctLW5vLWNvbG9yJywgJy1yJ10sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgbmV3IFJlbW90ZUJyYW5jaExpc3RWaWV3IGRhdGEsIHJlbW90ZU5hbWUsICh7bmFtZX0pID0+XG4gICAgICAgICAgICBicmFuY2hOYW1lID0gbmFtZS5zdWJzdHJpbmcobmFtZS5pbmRleE9mKCcvJykgKyAxKVxuICAgICAgICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1bGxpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIGFyZ3MgPSBbJ3B1bGwnXS5jb25jYXQoQGV4dHJhQXJncywgcmVtb3RlTmFtZSwgYnJhbmNoTmFtZSkuZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgICAgICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgICAgIHJlc29sdmUgYnJhbmNoTmFtZVxuICAgICAgICAgICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgICAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YX0pXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgICAgICAgIC5jYXRjaCAoZXJyb3IpID0+XG4gICAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGVycm9yLCBmYWlsZWQ6IHRydWV9KVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgZWxzZVxuICAgICAgX3B1bGwgQHJlcG8sIGV4dHJhQXJnczogQGV4dHJhQXJnc1xuXG4gIGNvbmZpcm1lZDogKHtuYW1lfSkgLT5cbiAgICBpZiBAbW9kZSBpcyAncHVsbCdcbiAgICAgIEBwdWxsIG5hbWVcbiAgICBlbHNlIGlmIEBtb2RlIGlzICdmZXRjaC1wcnVuZSdcbiAgICAgIEBtb2RlID0gJ2ZldGNoJ1xuICAgICAgQGV4ZWN1dGUgbmFtZSwgJy0tcHJ1bmUnXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAncHVzaCdcbiAgICAgIHB1bGxCZWZvcmVQdXNoID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHVsbEJlZm9yZVB1c2gnKVxuICAgICAgQGV4dHJhQXJncyA9ICctLXJlYmFzZScgaWYgcHVsbEJlZm9yZVB1c2ggYW5kIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnB1bGxSZWJhc2UnKVxuICAgICAgaWYgcHVsbEJlZm9yZVB1c2hcbiAgICAgICAgQHB1bGwobmFtZSkudGhlbiAoYnJhbmNoKSA9PiBAZXhlY3V0ZSBuYW1lLCBudWxsLCBicmFuY2hcbiAgICAgIGVsc2VcbiAgICAgICAgQGV4ZWN1dGUgbmFtZVxuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ3B1c2ggLXUnXG4gICAgICBAcHVzaEFuZFNldFVwc3RyZWFtIG5hbWVcbiAgICBlbHNlXG4gICAgICBAZXhlY3V0ZSBuYW1lXG4gICAgQGNhbmNlbCgpXG5cbiAgZXhlY3V0ZTogKHJlbW90ZT0nJywgZXh0cmFBcmdzPScnLCBicmFuY2gpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHJvbXB0Rm9yQnJhbmNoJylcbiAgICAgIGlmIGJyYW5jaD9cbiAgICAgICAgYXJncyA9IFtAbW9kZV1cbiAgICAgICAgaWYgZXh0cmFBcmdzLmxlbmd0aCA+IDBcbiAgICAgICAgICBhcmdzLnB1c2ggZXh0cmFBcmdzXG4gICAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbcmVtb3RlLCBicmFuY2hdKVxuICAgICAgICBtZXNzYWdlID0gXCIje0Btb2RlWzBdLnRvVXBwZXJDYXNlKCkrQG1vZGUuc3Vic3RyaW5nKDEpfWluZy4uLlwiXG4gICAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZSwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgIC5jYXRjaCAoZGF0YSkgPT5cbiAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICBlbHNlXG4gICAgICAgIGdpdC5jbWQoWydicmFuY2gnLCAnLS1uby1jb2xvcicsICctciddLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgbmV3IFJlbW90ZUJyYW5jaExpc3RWaWV3IGRhdGEsIHJlbW90ZSwgKHtuYW1lfSkgPT5cbiAgICAgICAgICAgIGJyYW5jaE5hbWUgPSBuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoJy8nKSArIDEpXG4gICAgICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIFwiUHVzaGluZy4uLlwiLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgYXJncyA9IFsncHVzaCddLmNvbmNhdChleHRyYUFyZ3MsIHJlbW90ZSwgYnJhbmNoTmFtZSkuZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgICAgICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGF9KVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBlcnJvciwgZmFpbGVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgIGVsc2VcbiAgICAgIGFyZ3MgPSBbQG1vZGVdXG4gICAgICBpZiBleHRyYUFyZ3MubGVuZ3RoID4gMFxuICAgICAgICBhcmdzLnB1c2ggZXh0cmFBcmdzXG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoW3JlbW90ZSwgQHRhZ10pLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICAgIG1lc3NhZ2UgPSBcIiN7QG1vZGVbMF0udG9VcHBlckNhc2UoKStAbW9kZS5zdWJzdHJpbmcoMSl9aW5nLi4uXCJcbiAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZSwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhfSlcbiAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhLCBmYWlsZWQ6IHRydWV9KVxuICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG5cbiAgcHVzaEFuZFNldFVwc3RyZWFtOiAocmVtb3RlPScnKSAtPlxuICAgIGFyZ3MgPSBbJ3B1c2gnLCAnLXUnLCByZW1vdGUsICdIRUFEJ10uZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgIG1lc3NhZ2UgPSBcIlB1c2hpbmcuLi5cIlxuICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZSwgZGlzbWlzc2FibGU6IHRydWVcbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YX0pXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YSwgZmFpbGVkOiB0cnVlfSlcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiJdfQ==
