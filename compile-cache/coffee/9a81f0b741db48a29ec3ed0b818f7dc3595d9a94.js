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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlHQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sS0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUjs7RUFDUixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxvQkFBQSxHQUF1QixPQUFBLENBQVEsMkJBQVI7O0VBRXZCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVIsRUFBZSxJQUFmO0FBQ1YsVUFBQTtNQURXLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7NEJBQU8sT0FBMEIsSUFBekIsSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxLQUFLLElBQUMsQ0FBQSxpQkFBQTtNQUN4QywwQ0FBQSxTQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPOzs7UUFDUixJQUFDLENBQUEsWUFBYTs7TUFDZCxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQsRUFBVyxPQUFYO1VBQUMsS0FBQyxDQUFBLFVBQUQ7VUFBVSxLQUFDLENBQUEsU0FBRDtRQUFYO01BQUEsQ0FB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LFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtVQUNMLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1lBQUMsVUFBQSxRQUFEO1lBQVcsT0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFwQjtZQUFvQyxNQUFBLEVBQVEsSUFBNUM7WUFBa0QsTUFBQSxFQUFRLElBQTFEO1dBQXRCO2lCQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7UUFGSztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKUDtJQUxrQjs7OztLQTVIQztBQVZ2QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbl9wdWxsID0gcmVxdWlyZSAnLi4vbW9kZWxzL19wdWxsJ1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5SZW1vdGVCcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4vcmVtb3RlLWJyYW5jaC1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBAZGF0YSwge0Btb2RlLCBAdGFnLCBAZXh0cmFBcmdzfT17fSkgLT5cbiAgICBzdXBlclxuICAgIEB0YWcgPz0gJydcbiAgICBAZXh0cmFBcmdzID89IFtdXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuICAgIEByZXN1bHQgPSBuZXcgUHJvbWlzZSAoQHJlc29sdmUsIEByZWplY3QpID0+XG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGl0ZW1zID0gQGRhdGEuc3BsaXQoXCJcXG5cIilcbiAgICByZW1vdGVzID0gaXRlbXMuZmlsdGVyKChpdGVtKSAtPiBpdGVtIGlzbnQgJycpLm1hcCAoaXRlbSkgLT4geyBuYW1lOiBpdGVtIH1cbiAgICBpZiByZW1vdGVzLmxlbmd0aCBpcyAxXG4gICAgICBAY29uZmlybWVkIHJlbW90ZXNbMF1cbiAgICBlbHNlXG4gICAgICBAc2V0SXRlbXMgcmVtb3Rlc1xuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSBuYW1lXG5cbiAgcHVsbDogKHJlbW90ZU5hbWUpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHJvbXB0Rm9yQnJhbmNoJylcbiAgICAgIGdpdC5jbWQoWydicmFuY2gnLCAnLS1uby1jb2xvcicsICctciddLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICAgIG5ldyBSZW1vdGVCcmFuY2hMaXN0VmlldyBkYXRhLCByZW1vdGVOYW1lLCAoe25hbWV9KSA9PlxuICAgICAgICAgICAgYnJhbmNoTmFtZSA9IG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZignLycpICsgMSlcbiAgICAgICAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gXCJQdWxsaW5nLi4uXCIsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICBhcmdzID0gWydwdWxsJ10uY29uY2F0KEBleHRyYUFyZ3MsIHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUpLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICAgICAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgICAgICByZXNvbHZlIGJyYW5jaE5hbWVcbiAgICAgICAgICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgICAgICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGF9KVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICByZWplY3QoKVxuICAgICAgICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBlcnJvciwgZmFpbGVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgIGVsc2VcbiAgICAgIF9wdWxsIEByZXBvLCBleHRyYUFyZ3M6IEBleHRyYUFyZ3NcblxuICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgaWYgQG1vZGUgaXMgJ3B1bGwnXG4gICAgICBAcHVsbCBuYW1lXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAnZmV0Y2gtcHJ1bmUnXG4gICAgICBAbW9kZSA9ICdmZXRjaCdcbiAgICAgIEBleGVjdXRlIG5hbWUsICctLXBydW5lJ1xuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ3B1c2gnXG4gICAgICBwdWxsQmVmb3JlUHVzaCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnB1bGxCZWZvcmVQdXNoJylcbiAgICAgIEBleHRyYUFyZ3MgPSAnLS1yZWJhc2UnIGlmIHB1bGxCZWZvcmVQdXNoIGFuZCBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsUmViYXNlJylcbiAgICAgIGlmIHB1bGxCZWZvcmVQdXNoXG4gICAgICAgIEBwdWxsKG5hbWUpLnRoZW4gKGJyYW5jaCkgPT4gQGV4ZWN1dGUgbmFtZSwgbnVsbCwgYnJhbmNoXG4gICAgICBlbHNlXG4gICAgICAgIEBleGVjdXRlIG5hbWVcbiAgICBlbHNlIGlmIEBtb2RlIGlzICdwdXNoIC11J1xuICAgICAgQHB1c2hBbmRTZXRVcHN0cmVhbSBuYW1lXG4gICAgZWxzZVxuICAgICAgQGV4ZWN1dGUgbmFtZVxuICAgIEBjYW5jZWwoKVxuXG4gIGV4ZWN1dGU6IChyZW1vdGU9JycsIGV4dHJhQXJncz0nJywgYnJhbmNoKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcpXG4gICAgICBpZiBicmFuY2g/XG4gICAgICAgIGFyZ3MgPSBbQG1vZGVdXG4gICAgICAgIGlmIGV4dHJhQXJncy5sZW5ndGggPiAwXG4gICAgICAgICAgYXJncy5wdXNoIGV4dHJhQXJnc1xuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQoW3JlbW90ZSwgYnJhbmNoXSlcbiAgICAgICAgbWVzc2FnZSA9IFwiI3tAbW9kZVswXS50b1VwcGVyQ2FzZSgpK0Btb2RlLnN1YnN0cmluZygxKX1pbmcuLi5cIlxuICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgZWxzZVxuICAgICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIG5ldyBSZW1vdGVCcmFuY2hMaXN0VmlldyBkYXRhLCByZW1vdGUsICh7bmFtZX0pID0+XG4gICAgICAgICAgICBicmFuY2hOYW1lID0gbmFtZS5zdWJzdHJpbmcobmFtZS5pbmRleE9mKCcvJykgKyAxKVxuICAgICAgICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1c2hpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIGFyZ3MgPSBbJ3B1c2gnXS5jb25jYXQoZXh0cmFBcmdzLCByZW1vdGUsIGJyYW5jaE5hbWUpLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICAgICAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhfSlcbiAgICAgICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICAgICAgLmNhdGNoIChlcnJvcikgPT5cbiAgICAgICAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZXJyb3IsIGZhaWxlZDogdHJ1ZX0pXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICBlbHNlXG4gICAgICBhcmdzID0gW0Btb2RlXVxuICAgICAgaWYgZXh0cmFBcmdzLmxlbmd0aCA+IDBcbiAgICAgICAgYXJncy5wdXNoIGV4dHJhQXJnc1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtyZW1vdGUsIEB0YWddKS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgICBtZXNzYWdlID0gXCIje0Btb2RlWzBdLnRvVXBwZXJDYXNlKCkrQG1vZGUuc3Vic3RyaW5nKDEpfWluZy4uLlwiXG4gICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YX0pXG4gICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgIC5jYXRjaCAoZGF0YSkgPT5cbiAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YSwgZmFpbGVkOiB0cnVlfSlcbiAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuXG4gIHB1c2hBbmRTZXRVcHN0cmVhbTogKHJlbW90ZT0nJykgLT5cbiAgICBhcmdzID0gWydwdXNoJywgJy11JywgcmVtb3RlLCAnSEVBRCddLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICBtZXNzYWdlID0gXCJQdXNoaW5nLi4uXCJcbiAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGF9KVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgIC5jYXRjaCAoZGF0YSkgPT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZX0pXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4iXX0=
