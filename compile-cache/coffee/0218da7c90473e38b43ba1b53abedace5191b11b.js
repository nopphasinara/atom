(function() {
  var $, CompositeDisposable, GitStashSave, InputView, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  GitStashSave = require('../models/git-stash-save');

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
            placeholderText: 'Stash message'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      var currentPane, disposables, panel;
      disposables = new CompositeDisposable;
      currentPane = atom.workspace.getActivePane();
      panel = atom.workspace.addModalPanel({
        item: this
      });
      panel.show();
      this.commandEditor.focus();
      disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            if (panel != null) {
              panel.destroy();
            }
            currentPane.activate();
            return disposables.dispose();
          };
        })(this)
      }));
      return disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          disposables.dispose();
          if (panel != null) {
            panel.destroy();
          }
          GitStashSave(repo, {
            message: _this.commandEditor.getText()
          });
          return currentPane.activate();
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = InputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc3Rhc2gtbWVzc2FnZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksbUNBQUosRUFBb0I7O0VBRXBCLFlBQUEsR0FBZSxPQUFBLENBQVEsMEJBQVI7O0VBRVQ7Ozs7Ozs7SUFDSixTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBMEIsSUFBSSxjQUFKLENBQW1CO1lBQUEsSUFBQSxFQUFNLElBQU47WUFBWSxlQUFBLEVBQWlCLGVBQTdCO1dBQW5CLENBQTFCO1FBREc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUw7SUFEUTs7d0JBSVYsVUFBQSxHQUFZLFNBQUMsSUFBRDtBQUNWLFVBQUE7TUFBQSxXQUFBLEdBQWMsSUFBSTtNQUNsQixXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7TUFDZCxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBN0I7TUFDUixLQUFLLENBQUMsSUFBTixDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxLQUFmLENBQUE7TUFFQSxXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO1FBQUEsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDs7Y0FDbkUsS0FBSyxDQUFFLE9BQVAsQ0FBQTs7WUFDQSxXQUFXLENBQUMsUUFBWixDQUFBO21CQUNBLFdBQVcsQ0FBQyxPQUFaLENBQUE7VUFIbUU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7T0FBdEMsQ0FBaEI7YUFLQSxXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGNBQXRDLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQ3BFLFdBQVcsQ0FBQyxPQUFaLENBQUE7O1lBQ0EsS0FBSyxDQUFFLE9BQVAsQ0FBQTs7VUFDQSxZQUFBLENBQWEsSUFBYixFQUFtQjtZQUFBLE9BQUEsRUFBUyxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFUO1dBQW5CO2lCQUNBLFdBQVcsQ0FBQyxRQUFaLENBQUE7UUFKb0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBQWhCO0lBWlU7Ozs7S0FMVTs7RUF1QnhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBNUJqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbkdpdFN0YXNoU2F2ZSA9IHJlcXVpcmUgJy4uL21vZGVscy9naXQtc3Rhc2gtc2F2ZSdcblxuY2xhc3MgSW5wdXRWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAc3VidmlldyAnY29tbWFuZEVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdTdGFzaCBtZXNzYWdlJylcblxuICBpbml0aWFsaXplOiAocmVwbykgLT5cbiAgICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBwYW5lbC5zaG93KClcbiAgICBAY29tbWFuZEVkaXRvci5mb2N1cygpXG5cbiAgICBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiAoZSkgPT5cbiAgICAgIHBhbmVsPy5kZXN0cm95KClcbiAgICAgIGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcbiAgICAgIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gICAgZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y29uZmlybScsIChlKSA9PlxuICAgICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBwYW5lbD8uZGVzdHJveSgpXG4gICAgICBHaXRTdGFzaFNhdmUocmVwbywgbWVzc2FnZTogQGNvbW1hbmRFZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0Vmlld1xuIl19
