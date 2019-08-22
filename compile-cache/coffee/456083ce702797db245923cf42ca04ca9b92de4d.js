(function() {
  var $, Point, Tabularize, TabularizeView, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Tabularize = require('./tabularize');

  Point = require('atom').Point;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  module.exports = TabularizeView = (function(superClass) {
    extend(TabularizeView, superClass);

    function TabularizeView() {
      return TabularizeView.__super__.constructor.apply(this, arguments);
    }

    TabularizeView.activate = function() {
      return new TabularizeView;
    };

    TabularizeView.content = function() {
      return this.div({
        "class": 'tabularize overlay from-top mini'
      }, (function(_this) {
        return function() {
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'message',
            outlet: 'message'
          });
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.div({
              "class": 'btn-group centered'
            }, function() {
              _this.button({
                "class": 'btn selected'
              }, 'Left');
              _this.button({
                "class": 'btn disabled'
              }, 'Center');
              return _this.button({
                "class": 'btn disabled'
              }, 'Right');
            });
          });
        };
      })(this));
    };

    TabularizeView.prototype.detaching = false;

    TabularizeView.prototype.initialize = function() {
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      atom.commands.add('atom-text-editor', 'tabularize:toggle', (function(_this) {
        return function() {
          _this.toggle();
          return false;
        };
      })(this));
      this.miniEditor.on('blur', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.commands.add(this.miniEditor.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.miniEditor.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    };

    TabularizeView.prototype.toggle = function() {
      if (this.panel.isVisible()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    TabularizeView.prototype.close = function() {
      var miniEditorFocused;
      if (!this.panel.isVisible()) {
        return;
      }
      miniEditorFocused = this.miniEditor.hasFocus();
      this.miniEditor.setText('');
      this.panel.hide();
      if (miniEditorFocused) {
        return this.restoreFocus();
      }
    };

    TabularizeView.prototype.confirm = function() {
      var editor, regex;
      regex = this.miniEditor.getText();
      editor = atom.workspace.getActiveTextEditor();
      this.close();
      if (!(editor && regex.length)) {
        return;
      }
      return Tabularize.tabularize(regex, editor);
    };

    TabularizeView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(':focus');
    };

    TabularizeView.prototype.restoreFocus = function() {
      var ref1;
      if ((ref1 = this.previouslyFocusedElement) != null ? ref1.isOnDom() : void 0) {
        return this.previouslyFocusedElement.focus();
      } else {
        return atom.views.getView(atom.workspace).focus();
      }
    };

    TabularizeView.prototype.open = function() {
      var editor;
      if (this.panel.isVisible()) {
        return;
      }
      if (editor = atom.workspace.getActiveTextEditor()) {
        this.storeFocusedElement();
        this.panel.show();
        this.message.text("Use a regex to select the separator");
        return this.miniEditor.focus();
      }
    };

    return TabularizeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90YWJ1bGFyaXplL2xpYi90YWJ1bGFyaXplLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrREFBQTtJQUFBOzs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRVosUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFDVixNQUE2QixPQUFBLENBQVEsc0JBQVIsQ0FBN0IsRUFBQyxTQUFELEVBQUksbUNBQUosRUFBb0I7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixjQUFDLENBQUEsUUFBRCxHQUFXLFNBQUE7YUFBRyxJQUFJO0lBQVA7O0lBRVgsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sa0NBQVA7T0FBTCxFQUFnRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDOUMsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLElBQUksY0FBSixDQUFtQjtZQUFBLElBQUEsRUFBTSxJQUFOO1dBQW5CLENBQXZCO1VBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDtZQUFrQixNQUFBLEVBQVEsU0FBMUI7V0FBTDtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTttQkFDbkIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0JBQVA7YUFBTCxFQUFrQyxTQUFBO2NBQ2hDLEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO2VBQVIsRUFBK0IsTUFBL0I7Y0FDQSxLQUFDLENBQUEsTUFBRCxD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LEtBQTFCLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsS0FBbkMsQ0FBQSxFQUhGOztJQURZOzs2QkFNZCxJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxJQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQVY7QUFBQSxlQUFBOztNQUVBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO1FBQ0UsSUFBQyxDQUFBLG1CQUFELENBQUE7UUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHFDQUFkO2VBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUEsRUFKRjs7SUFISTs7OztLQTFEcUI7QUFON0IiLCJzb3VyY2VzQ29udGVudCI6WyJUYWJ1bGFyaXplID0gcmVxdWlyZSAnLi90YWJ1bGFyaXplJ1xuXG57UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBUZXh0RWRpdG9yVmlldywgVmlld30gID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYnVsYXJpemVWaWV3IGV4dGVuZHMgVmlld1xuICBAYWN0aXZhdGU6IC0+IG5ldyBUYWJ1bGFyaXplVmlld1xuXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICd0YWJ1bGFyaXplIG92ZXJsYXkgZnJvbS10b3AgbWluaScsID0+XG4gICAgICBAc3VidmlldyAnbWluaUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBjbGFzczogJ21lc3NhZ2UnLCBvdXRsZXQ6ICdtZXNzYWdlJ1xuICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCBjZW50ZXJlZCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBzZWxlY3RlZCcsICdMZWZ0J1xuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gZGlzYWJsZWQnLCAnQ2VudGVyJ1xuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gZGlzYWJsZWQnLCAnUmlnaHQnXG5cbiAgZGV0YWNoaW5nOiBmYWxzZVxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSlcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ3RhYnVsYXJpemU6dG9nZ2xlJywgPT5cbiAgICAgIEB0b2dnbGUoKVxuICAgICAgZmFsc2VcblxuICAgIEBtaW5pRWRpdG9yLm9uICdibHVyJywgPT4gQGNsb3NlKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBAbWluaUVkaXRvci5lbGVtZW50LCAnY29yZTpjb25maXJtJywgPT4gQGNvbmZpcm0oKVxuICAgIGF0b20uY29tbWFuZHMuYWRkIEBtaW5pRWRpdG9yLmVsZW1lbnQsICdjb3JlOmNhbmNlbCcsID0+IEBjbG9zZSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQGNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAb3BlbigpXG5cbiAgY2xvc2U6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAcGFuZWwuaXNWaXNpYmxlKClcblxuICAgIG1pbmlFZGl0b3JGb2N1c2VkID0gQG1pbmlFZGl0b3IuaGFzRm9jdXMoKVxuICAgIEBtaW5pRWRpdG9yLnNldFRleHQoJycpXG4gICAgQHBhbmVsLmhpZGUoKVxuICAgIEByZXN0b3JlRm9jdXMoKSBpZiBtaW5pRWRpdG9yRm9jdXNlZFxuXG4gIGNvbmZpcm06IC0+XG4gICAgcmVnZXggPSBAbWluaUVkaXRvci5nZXRUZXh0KClcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIEBjbG9zZSgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciBhbmQgcmVnZXgubGVuZ3RoXG4gICAgVGFidWxhcml6ZS50YWJ1bGFyaXplKHJlZ2V4LCBlZGl0b3IpXG5cbiAgc3RvcmVGb2N1c2VkRWxlbWVudDogLT5cbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gJCgnOmZvY3VzJylcblxuICByZXN0b3JlRm9jdXM6IC0+XG4gICAgaWYgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uaXNPbkRvbSgpXG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICBlbHNlXG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmZvY3VzKClcblxuICBvcGVuOiAtPlxuICAgIHJldHVybiBpZiBAcGFuZWwuaXNWaXNpYmxlKClcblxuICAgIGlmIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgQG1lc3NhZ2UudGV4dChcIlVzZSBhIHJlZ2V4IHRvIHNlbGVjdCB0aGUgc2VwYXJhdG9yXCIpXG4gICAgICBAbWluaUVkaXRvci5mb2N1cygpXG4iXX0=
