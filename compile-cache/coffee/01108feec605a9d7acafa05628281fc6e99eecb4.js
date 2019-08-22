(function() {
  var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git, git2, ref, runCommand,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  git2 = require('../git-es')["default"];

  Repository = require('../repository')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  runCommand = function(repo, args) {
    var promise, repoName;
    repoName = new Repository(repo).getName();
    promise = git2(args, {
      cwd: repo.getWorkingDirectory(),
      color: true
    });
    promise.then(function(result) {
      ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: "" + (args.join(' '))
      }, result));
      return git.refresh(repo);
    });
    return promise;
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Git command and arguments'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var ref1;
            if ((ref1 = _this.panel) != null) {
              ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var ref1;
          _this.disposables.dispose();
          if ((ref1 = _this.panel) != null) {
            ref1.destroy();
          }
          return runCommand(_this.repo, _this.commandEditor.getText().split(' ')).then(function() {
            _this.currentPane.activate();
            return git.refresh(_this.repo);
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo, args) {
    if (args == null) {
      args = [];
    }
    if (args.length > 0) {
      return runCommand(repo, args.split(' '));
    } else {
      return new InputView(repo);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1ydW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrR0FBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxtQ0FBSixFQUFvQjs7RUFFcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzNCLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFFOUMsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLElBQVA7QUFDWCxRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO0lBQ1gsT0FBQSxHQUFVLElBQUEsQ0FBSyxJQUFMLEVBQVc7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtNQUFpQyxLQUFBLEVBQU8sSUFBeEM7S0FBWDtJQUNWLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQyxNQUFEO01BQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztRQUFDLFVBQUEsUUFBRDtRQUFXLE9BQUEsRUFBUyxFQUFBLEdBQUUsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsQ0FBRCxDQUF0QjtPQUFkLEVBQXdELE1BQXhELENBQXRCO2FBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFaO0lBRlcsQ0FBYjtBQUdBLFdBQU87RUFOSTs7RUFRUDs7Ozs7OztJQUNKLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNILEtBQUMsQ0FBQSxPQUFELENBQVMsZUFBVCxFQUEwQixJQUFJLGNBQUosQ0FBbUI7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLGVBQUEsRUFBaUIsMkJBQTdCO1dBQW5CLENBQTFCO1FBREc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUw7SUFEUTs7d0JBSVYsVUFBQSxHQUFZLFNBQUMsS0FBRDtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7O1FBQ2YsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQTtNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO1FBQUEsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDtBQUNwRSxnQkFBQTs7a0JBQU0sQ0FBRSxPQUFSLENBQUE7O1lBQ0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7VUFIb0U7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7T0FBdEMsQ0FBakI7YUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxjQUF0QyxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUNyRSxjQUFBO1VBQUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7O2dCQUNNLENBQUUsT0FBUixDQUFBOztpQkFDQSxVQUFBLENBQVcsS0FBQyxDQUFBLElBQVosRUFBa0IsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBd0IsQ0FBQyxLQUF6QixDQUErQixHQUEvQixDQUFsQixDQUFzRCxDQUFDLElBQXZELENBQTRELFNBQUE7WUFDMUQsS0FBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUE7bUJBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFDLENBQUEsSUFBYjtVQUYwRCxDQUE1RDtRQUhxRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0FBakI7SUFaVTs7OztLQUxVOztFQXdCeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUDs7TUFBTyxPQUFLOztJQUMzQixJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakI7YUFDRSxVQUFBLENBQVcsSUFBWCxFQUFpQixJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBakIsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBSEY7O0VBRGU7QUF4Q2pCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuZ2l0MiA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5cbnJ1bkNvbW1hbmQgPSAocmVwbywgYXJncykgLT5cbiAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgcHJvbWlzZSA9IGdpdDIoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwgY29sb3I6IHRydWUpXG4gIHByb21pc2UudGhlbiAocmVzdWx0KSAtPlxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogXCIje2FyZ3Muam9pbignICcpfVwifSwgcmVzdWx0KSlcbiAgICBnaXQucmVmcmVzaCByZXBvXG4gIHJldHVybiBwcm9taXNlXG5cbmNsYXNzIElucHV0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiA9PlxuICAgICAgQHN1YnZpZXcgJ2NvbW1hbmRFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnR2l0IGNvbW1hbmQgYW5kIGFyZ3VtZW50cycpXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGNvbW1hbmRFZGl0b3IuZm9jdXMoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNhbmNlbCc6IChlKSA9PlxuICAgICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG4gICAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y29uZmlybScsIChlKSA9PlxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICAgIHJ1bkNvbW1hbmQoQHJlcG8sIEBjb21tYW5kRWRpdG9yLmdldFRleHQoKS5zcGxpdCgnICcpKS50aGVuID0+XG4gICAgICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIGFyZ3M9W10pIC0+XG4gIGlmIGFyZ3MubGVuZ3RoID4gMFxuICAgIHJ1bkNvbW1hbmQgcmVwbywgYXJncy5zcGxpdCgnICcpXG4gIGVsc2VcbiAgICBuZXcgSW5wdXRWaWV3KHJlcG8pXG4iXX0=
