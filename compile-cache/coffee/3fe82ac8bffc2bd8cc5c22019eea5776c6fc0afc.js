(function() {
  var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div({
        "class": 'git-branch'
      }, (function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.show();
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(event) {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            return _this.createBranch();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      this.panel.destroy();
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    InputView.prototype.createBranch = function() {
      var message, name, repoName;
      this.destroy();
      name = this.branchEditor.getModel().getText();
      if (name.length > 0) {
        message = "checkout to new branch '" + name + "'";
        repoName = new Repository(this.repo).getName();
        return git.cmd(['checkout', '-b', name], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(output) {
            ActivityLogger.record({
              repoName: repoName,
              message: message,
              output: output
            });
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return ActivityLogger.record({
              repoName: repoName,
              message: message,
              output: err,
              failed: true
            });
          };
        })(this));
      }
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVja291dC1uZXctYnJhbmNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksbUNBQUosRUFBb0I7O0VBQ3BCLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRS9COzs7Ozs7O0lBQ0osU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtPQUFMLEVBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDeEIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQXlCLElBQUksY0FBSixDQUFtQjtZQUFBLElBQUEsRUFBTSxJQUFOO1lBQVksZUFBQSxFQUFpQixpQkFBN0I7V0FBbkIsQ0FBekI7UUFEd0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0lBRFE7O3dCQUlWLFVBQUEsR0FBWSxTQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7UUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE3QjtNQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BRUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7bUJBQVcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQUFYO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO09BQXRDLENBQWpCO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDttQkFBVyxLQUFDLENBQUEsWUFBRCxDQUFBO1VBQVg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO09BQXRDLENBQWpCO0lBUlU7O3dCQVVaLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO0lBSE87O3dCQUtULFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQUEsQ0FBd0IsQ0FBQyxPQUF6QixDQUFBO01BQ1AsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO1FBQ0UsT0FBQSxHQUFVLDBCQUFBLEdBQTZCLElBQTdCLEdBQWtDO1FBQzVDLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBO2VBQ1gsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQVIsRUFBa0M7VUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7U0FBbEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLE1BQUQ7WUFDSixjQUFjLENBQUMsTUFBZixDQUFzQjtjQUFDLFVBQUEsUUFBRDtjQUFXLFNBQUEsT0FBWDtjQUFvQixRQUFBLE1BQXBCO2FBQXRCO21CQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7VUFGSTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUlBLEVBQUMsS0FBRCxFQUpBLENBSU8sQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxHQUFEO21CQUNMLGNBQWMsQ0FBQyxNQUFmLENBQXNCO2NBQUMsVUFBQSxRQUFEO2NBQVcsU0FBQSxPQUFYO2NBQW9CLE1BQUEsRUFBUSxHQUE1QjtjQUFpQyxNQUFBLEVBQVEsSUFBekM7YUFBdEI7VUFESztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKUCxFQUhGOztJQUhZOzs7O0tBcEJROztFQWlDeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQVUsSUFBSSxTQUFKLENBQWMsSUFBZDtFQUFWO0FBdkNqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5jbGFzcyBJbnB1dFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdnaXQtYnJhbmNoJywgPT5cbiAgICAgIEBzdWJ2aWV3ICdicmFuY2hFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnTmV3IGJyYW5jaCBuYW1lJylcblxuICBpbml0aWFsaXplOiAoQHJlcG8pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBAcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuXG4gICAgQGJyYW5jaEVkaXRvci5mb2N1cygpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNhbmNlbCc6IChldmVudCkgPT4gQGRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJzogKGV2ZW50KSA9PiBAY3JlYXRlQnJhbmNoKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBwYW5lbC5kZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcblxuICBjcmVhdGVCcmFuY2g6IC0+XG4gICAgQGRlc3Ryb3koKVxuICAgIG5hbWUgPSBAYnJhbmNoRWRpdG9yLmdldE1vZGVsKCkuZ2V0VGV4dCgpXG4gICAgaWYgbmFtZS5sZW5ndGggPiAwXG4gICAgICBtZXNzYWdlID0gXCJcIlwiY2hlY2tvdXQgdG8gbmV3IGJyYW5jaCAnI3tuYW1lfSdcIlwiXCJcbiAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgZ2l0LmNtZChbJ2NoZWNrb3V0JywgJy1iJywgbmFtZV0sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKG91dHB1dCkgPT5cbiAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZSwgb3V0cHV0fSlcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgIC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlLCBvdXRwdXQ6IGVyciwgZmFpbGVkOiB0cnVlfSlcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT4gbmV3IElucHV0VmlldyhyZXBvKVxuIl19
