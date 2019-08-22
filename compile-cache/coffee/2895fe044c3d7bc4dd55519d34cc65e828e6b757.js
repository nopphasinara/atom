(function() {
  var StatusErrorAutocomplete;

  module.exports = StatusErrorAutocomplete = (function() {
    StatusErrorAutocomplete.prototype.actions = [];

    function StatusErrorAutocomplete() {
      this.span = document.createElement("span");
      this.span.className = "inline-block text-subtle";
      this.span.innerHTML = "Autocomplete failure";
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.subcontainer = document.createElement("div");
      this.subcontainer.className = "block";
      this.container.appendChild(this.subcontainer);
      this.subcontainer.appendChild(this.span);
    }

    StatusErrorAutocomplete.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusErrorAutocomplete.prototype.update = function(text, show) {
      if (show) {
        this.container.className = "inline-block";
        this.span.innerHTML = text;
        return this.actions.push(text);
      } else {
        this.actions.forEach(function(value, index) {
          if (value === text) {
            return this.actions.splice(index, 1);
          }
        }, this);
        if (this.actions.length === 0) {
          return this.hide();
        } else {
          return this.span.innerHTML = this.actions[0];
        }
      }
    };

    StatusErrorAutocomplete.prototype.hide = function() {
      return this.container.className = 'hidden';
    };

    StatusErrorAutocomplete.prototype.attach = function() {
      return this.tile = this.statusBar.addRightTile({
        item: this.container,
        priority: 20
      });
    };

    StatusErrorAutocomplete.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusErrorAutocomplete;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL3N0YXR1cy1lcnJvci1hdXRvY29tcGxldGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUtNO3NDQUNKLE9BQUEsR0FBUzs7SUFFSSxpQ0FBQTtNQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7TUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCO01BRWxCLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUI7TUFFdkIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDaEIsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFkLEdBQTBCO01BQzFCLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsWUFBeEI7TUFFQSxJQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBMEIsSUFBQyxDQUFBLElBQTNCO0lBWlc7O3NDQWNiLFVBQUEsR0FBWSxTQUFDLFNBQUQ7TUFBQyxJQUFDLENBQUEsWUFBRDtJQUFEOztzQ0FFWixNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sSUFBUDtNQUNOLElBQUcsSUFBSDtRQUNJLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxHQUF1QjtRQUN2QixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7ZUFDbEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxFQUhKO09BQUEsTUFBQTtRQUtJLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixTQUFDLEtBQUQsRUFBUSxLQUFSO1VBQ2IsSUFBRyxLQUFBLEtBQVMsSUFBWjttQkFDSSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsQ0FBdkIsRUFESjs7UUFEYSxDQUFqQixFQUdFLElBSEY7UUFLQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQixDQUF0QjtpQkFDSSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBREo7U0FBQSxNQUFBO2lCQUdJLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixJQUFDLENBQUEsT0FBUSxDQUFBLENBQUEsRUFIL0I7U0FWSjs7SUFETTs7c0NBZ0JSLElBQUEsR0FBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCO0lBRG5COztzQ0FHTixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxZQUFYLENBQXdCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxTQUFQO1FBQWtCLFFBQUEsRUFBVSxFQUE1QjtPQUF4QjtJQURGOztzQ0FHUixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBRE07Ozs7O0FBOUNWIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuXG4jIypcbiMgUHJvZ3Jlc3MgYmFyIGluIHRoZSBzdGF0dXMgYmFyXG4jI1xuY2xhc3MgU3RhdHVzRXJyb3JBdXRvY29tcGxldGVcbiAgYWN0aW9uczogW11cblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXG4gICAgQHNwYW4uY2xhc3NOYW1lID0gXCJpbmxpbmUtYmxvY2sgdGV4dC1zdWJ0bGVcIlxuICAgIEBzcGFuLmlubmVySFRNTCA9IFwiQXV0b2NvbXBsZXRlIGZhaWx1cmVcIlxuXG4gICAgQGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBAY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiaW5saW5lLWJsb2NrXCJcblxuICAgIEBzdWJjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgQHN1YmNvbnRhaW5lci5jbGFzc05hbWUgPSBcImJsb2NrXCJcbiAgICBAY29udGFpbmVyLmFwcGVuZENoaWxkKEBzdWJjb250YWluZXIpXG5cbiAgICBAc3ViY29udGFpbmVyLmFwcGVuZENoaWxkKEBzcGFuKVxuXG4gIGluaXRpYWxpemU6IChAc3RhdHVzQmFyKSAtPlxuXG4gIHVwZGF0ZTogKHRleHQsIHNob3cpIC0+XG4gICAgaWYgc2hvd1xuICAgICAgICBAY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiaW5saW5lLWJsb2NrXCJcbiAgICAgICAgQHNwYW4uaW5uZXJIVE1MID0gdGV4dFxuICAgICAgICBAYWN0aW9ucy5wdXNoKHRleHQpXG4gICAgZWxzZVxuICAgICAgICBAYWN0aW9ucy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpIC0+XG4gICAgICAgICAgICBpZiB2YWx1ZSA9PSB0ZXh0XG4gICAgICAgICAgICAgICAgQGFjdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAsIEApXG5cbiAgICAgICAgaWYgQGFjdGlvbnMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIEBoaWRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNwYW4uaW5uZXJIVE1MID0gQGFjdGlvbnNbMF1cblxuICBoaWRlOiAtPlxuICAgIEBjb250YWluZXIuY2xhc3NOYW1lID0gJ2hpZGRlbidcblxuICBhdHRhY2g6IC0+XG4gICAgQHRpbGUgPSBAc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZShpdGVtOiBAY29udGFpbmVyLCBwcmlvcml0eTogMjApXG5cbiAgZGV0YWNoOiAtPlxuICAgIEB0aWxlLmRlc3Ryb3koKVxuIl19
