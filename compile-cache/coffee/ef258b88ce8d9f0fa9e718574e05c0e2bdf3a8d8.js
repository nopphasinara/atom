(function() {
  var $, PromptView, TextEditorView, View, method, noop, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var ref1;
    return (delegate != null ? (ref1 = delegate[method]) != null ? ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(superClass) {
    extend(PromptView, superClass);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getModel();
      this.panelEditor.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      atom.commands.add(this.panelInput.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.panelInput.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate1) {
      var text;
      this.delegate = delegate1 != null ? delegate1 : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.element.setAttribute('placeholder', this.delegate.label || 'Enter abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        this.panelEditor.selectAll();
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((ref1 = this.prevPane) != null) {
        ref1.activate();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.prevPane = atom.workspace.getActivePane();
      atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvcHJvbXB0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0RBQUE7SUFBQTs7O0VBQUEsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLG1DQUFKLEVBQW9COztFQUNwQixJQUFBLEdBQU8sU0FBQSxHQUFBOztFQUVQLE1BQUEsR0FBUyxTQUFDLFFBQUQsRUFBVyxNQUFYO0FBQ1IsUUFBQTt1RUFBaUIsQ0FBRSxJQUFuQixDQUF3QixRQUF4QixvQkFBQSxJQUFxQztFQUQ3Qjs7RUFHVCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0wsVUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFBO2FBQUcsSUFBSTtJQUFQOztJQUVULFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNULElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNDQUFQO09BQUwsRUFBb0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUVuRCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLFNBQUE7bUJBQ2xDLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUFJLGNBQUosQ0FBbUI7Y0FBQSxJQUFBLEVBQU0sSUFBTjthQUFuQixDQUF2QjtVQURrQyxDQUFuQztRQUZtRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQ7SUFEUzs7eUJBTVYsVUFBQSxHQUFZLFNBQUE7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBO01BQ2YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxpQkFBYixDQUErQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDOUIs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RVosSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFUO2FBQ0EsTUFBQSxDQUFPLElBQUMsQ0FBQSxRQUFSLEVBQWtCLE1BQWxCLENBQUEsQ0FBQTtJQVZPOzt5QkFZUixNQUFBLEdBQVEsU0FBQTtNQUNQLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO01BQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO1FBQUEsSUFBQSxFQUFNLElBQU47UUFBWSxPQUFBLEVBQVMsSUFBckI7T0FBOUI7TUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsUUFBVDthQUNBLE1BQUEsQ0FBTyxJQUFDLENBQUEsUUFBUixFQUFrQixNQUFsQixDQUFBLENBQUE7SUFOTzs7OztLQS9EZ0I7QUFQekIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5ub29wID0gLT5cblxubWV0aG9kID0gKGRlbGVnYXRlLCBtZXRob2QpIC0+XG5cdGRlbGVnYXRlP1ttZXRob2RdPy5iaW5kKGRlbGVnYXRlKSBvciBub29wXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFByb21wdFZpZXcgZXh0ZW5kcyBWaWV3XG5cdEBhdHRhY2g6IC0+IG5ldyBQcm9tcHRWaWV3XG5cblx0QGNvbnRlbnQ6IC0+XG5cdFx0QGRpdiBjbGFzczogJ2VtbWV0LXByb21wdCB0b29sLXBhbmVsIHBhbmVsLWJvdHRvbScsID0+XG5cdFx0XHQjIEBsYWJlbCBjbGFzczogJ2VtbWV0LXByb21wdF9fbGFiZWwnLCBvdXRsZXQ6ICdsYWJlbCdcblx0XHRcdEBkaXYgY2xhc3M6ICdlbW1ldC1wcm9tcHRfX2lucHV0JywgPT5cblx0XHRcdFx0QHN1YnZpZXcgJ3BhbmVsSW5wdXQnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcblxuXHRpbml0aWFsaXplOiAoKSAtPlxuXHRcdEBwYW5lbEVkaXRvciA9IEBwYW5lbElucHV0LmdldE1vZGVsKClcblx0XHRAcGFuZWxFZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcgPT5cblx0XHRcdHJldHVybiB1bmxlc3MgQGF0dGFjaGVkXG5cdFx0XHRAaGFuZGxlVXBkYXRlIEBwYW5lbEVkaXRvci5nZXRUZXh0KClcblx0XHRhdG9tLmNvbW1hbmRzLmFkZCBAcGFuZWxJbnB1dC5lbGVtZW50LCAnY29yZTpjb25maXJtJywgPT4gQGNvbmZpcm0oKVxuXHRcdGF0b20uY29tbWFuZHMuYWRkIEBwYW5lbElucHV0LmVsZW1lbnQsICdjb3JlOmNhbmNlbCcsID0+IEBjYW5jZWwoKVxuXG5cdHNob3c6IChAZGVsZWdhdGU9e30pIC0+XG5cdFx0QGVkaXRvciA9IEBkZWxlZ2F0ZS5lZGl0b3Jcblx0XHRAZWRpdG9yVmlldyA9IEBkZWxlZ2F0ZS5lZGl0b3JWaWV3XG5cdFx0IyBAcGFuZWxJbnB1dC5zZXRQbGFjZWhvbGRlclRleHQgQGRlbGVnYXRlLmxhYmVsIG9yICdFbnRlciBhYmJyZXZpYXRpb24nXG5cdFx0QHBhbmVsSW5wdXQuZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ3BsYWNlaG9sZGVyJywgQGRlbGVnYXRlLmxhYmVsIG9yICdFbnRlciBhYmJyZXZpYXRpb24nXG5cdFx0QHVwZGF0ZWQgPSBub1xuXG5cdFx0QGF0dGFjaCgpXG5cdFx0dGV4dCA9IEBwYW5lbEVkaXRvci5nZXRUZXh0KClcblx0XHRpZiB0ZXh0XG5cdFx0XHRAcGFuZWxFZGl0b3Iuc2VsZWN0QWxsKClcblx0XHRcdEBoYW5kbGVVcGRhdGUgdGV4dFxuXG5cdHVuZG86IC0+XG5cdFx0QGVkaXRvci51bmRvKCkgaWYgQHVwZGF0ZWRcblxuXHRoYW5kbGVVcGRhdGU6ICh0ZXh0KSAtPlxuXHRcdEB1bmRvKClcblx0XHRAdXBkYXRlZCA9IHllc1xuXHRcdEBlZGl0b3IudHJhbnNhY3QgPT5cblx0XHRcdG1ldGhvZChAZGVsZWdhdGUsICd1cGRhdGUnKSh0ZXh0KVxuXG5cdGNvbmZpcm06IC0+XG5cdFx0QGhhbmRsZVVwZGF0ZSBAcGFuZWxFZGl0b3IuZ2V0VGV4dCgpXG5cdFx0QHRyaWdnZXIgJ2NvbmZpcm0nXG5cdFx0bWV0aG9kKEBkZWxlZ2F0ZSwgJ2NvbmZpcm0nKSgpXG5cdFx0QGRldGFjaCgpXG5cblx0Y2FuY2VsOiAtPlxuXHRcdEB1bmRvKClcblx0XHRAdHJpZ2dlciAnY2FuY2VsJ1xuXHRcdG1ldGhvZChAZGVsZWdhdGUsICdjYW5jZWwnKSgpXG5cdFx0QGRldGFjaCgpXG5cblx0ZGV0YWNoOiAtPlxuXHRcdHJldHVybiB1bmxlc3MgQGhhc1BhcmVudCgpXG5cdFx0QGRldGFjaGluZyA9IHRydWVcblx0XHRAcHJldlBhbmU/LmFjdGl2YXRlKClcblxuXHRcdHN1cGVyXG5cdFx0QGRldGFjaGluZyA9IGZhbHNlXG5cdFx0QGF0dGFjaGVkID0gZmFsc2VcblxuXHRcdEB0cmlnZ2VyICdkZXRhY2gnXG5cdFx0bWV0aG9kKEBkZWxlZ2F0ZSwgJ2hpZGUnKSgpXG5cblx0YXR0YWNoOiAtPlxuXHRcdEBhdHRhY2hlZCA9IHRydWVcblx0XHRAcHJldlBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblx0XHRhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiB0aGlzLCB2aXNpYmxlOiB0cnVlKVxuXHRcdEBwYW5lbElucHV0LmZvY3VzKClcblx0XHRAdHJpZ2dlciAnYXR0YWNoJ1xuXHRcdG1ldGhvZChAZGVsZWdhdGUsICdzaG93JykoKVxuIl19
