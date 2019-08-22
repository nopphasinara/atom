(function() {
  var CompositeDisposable, TabNumbersView, View,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = TabNumbersView = (function(superClass) {
    extend(TabNumbersView, superClass);

    function TabNumbersView() {
      this.update = bind(this.update, this);
      return TabNumbersView.__super__.constructor.apply(this, arguments);
    }

    TabNumbersView.prototype.nTodos = 0;

    TabNumbersView.content = function() {
      return this.div({
        "class": 'todo-status-bar-indicator inline-block',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.a({
            "class": 'inline-block'
          }, function() {
            _this.span({
              "class": 'icon icon-checklist'
            });
            return _this.span({
              outlet: 'todoCount'
            });
          });
        };
      })(this));
    };

    TabNumbersView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.on('click', this.element, this.activateTodoPackage);
      this.update();
      return this.disposables.add(this.collection.onDidFinishSearch(this.update));
    };

    TabNumbersView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    TabNumbersView.prototype.update = function() {
      var ref;
      this.nTodos = this.collection.getTodosCount();
      this.todoCount.text(this.nTodos);
      if ((ref = this.toolTipDisposable) != null) {
        ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.element, {
        title: this.nTodos + " TODOs"
      });
    };

    TabNumbersView.prototype.activateTodoPackage = function() {
      return atom.commands.dispatch(this, 'todo-show:toggle');
    };

    return TabNumbersView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8taW5kaWNhdG9yLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5Q0FBQTtJQUFBOzs7O0VBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBQ1Isc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7Ozs2QkFDSixNQUFBLEdBQVE7O0lBRVIsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0NBQVA7UUFBaUQsUUFBQSxFQUFVLENBQUMsQ0FBNUQ7T0FBTCxFQUFvRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2xFLEtBQUMsQ0FBQSxDQUFELENBQUc7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7V0FBSCxFQUEwQixTQUFBO1lBQ3hCLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHFCQUFQO2FBQU47bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLE1BQUEsRUFBUSxXQUFSO2FBQU47VUFGd0IsQ0FBMUI7UUFEa0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFO0lBRFE7OzZCQU1WLFVBQUEsR0FBWSxTQUFDLFVBQUQ7TUFBQyxJQUFDLENBQUEsYUFBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxJQUFJLENBQUMsT0FBbEIsRUFBMkIsSUFBQyxDQUFBLG1CQUE1QjtNQUVBLElBQUMsQ0FBQSxNQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsTUFBL0IsQ0FBakI7SUFMVTs7NkJBT1osT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGTzs7NkJBSVQsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBQTtNQUNWLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsTUFBakI7O1dBRWtCLENBQUUsT0FBcEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QjtRQUFBLEtBQUEsRUFBVSxJQUFDLENBQUEsTUFBRixHQUFTLFFBQWxCO09BQTVCO0lBTGY7OzZCQU9SLG1CQUFBLEdBQXFCLFNBQUE7YUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQXZCLEVBQTZCLGtCQUE3QjtJQURtQjs7OztLQTNCTTtBQUo3QiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGFiTnVtYmVyc1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIG5Ub2RvczogMFxuXG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICd0b2RvLXN0YXR1cy1iYXItaW5kaWNhdG9yIGlubGluZS1ibG9jaycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEBhIGNsYXNzOiAnaW5saW5lLWJsb2NrJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdpY29uIGljb24tY2hlY2tsaXN0J1xuICAgICAgICBAc3BhbiBvdXRsZXQ6ICd0b2RvQ291bnQnXG5cbiAgaW5pdGlhbGl6ZTogKEBjb2xsZWN0aW9uKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9uICdjbGljaycsIHRoaXMuZWxlbWVudCwgQGFjdGl2YXRlVG9kb1BhY2thZ2VcblxuICAgIEB1cGRhdGUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaW5pc2hTZWFyY2ggQHVwZGF0ZVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBkZXRhY2goKVxuXG4gIHVwZGF0ZTogPT5cbiAgICBAblRvZG9zID0gQGNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpXG4gICAgQHRvZG9Db3VudC50ZXh0KEBuVG9kb3MpXG5cbiAgICBAdG9vbFRpcERpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuICAgIEB0b29sVGlwRGlzcG9zYWJsZSA9IGF0b20udG9vbHRpcHMuYWRkIEBlbGVtZW50LCB0aXRsZTogXCIje0BuVG9kb3N9IFRPRE9zXCJcblxuICBhY3RpdmF0ZVRvZG9QYWNrYWdlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGhpcywgJ3RvZG8tc2hvdzp0b2dnbGUnKVxuIl19
