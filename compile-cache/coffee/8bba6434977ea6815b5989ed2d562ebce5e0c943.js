(function() {
  var StatusInProgress;

  module.exports = StatusInProgress = (function() {
    StatusInProgress.prototype.actions = [];

    function StatusInProgress() {
      this.span = document.createElement("span");
      this.span.className = "inline-block text-subtle";
      this.span.innerHTML = "Indexing..";
      this.progress = document.createElement("progress");
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.subcontainer = document.createElement("div");
      this.subcontainer.className = "block";
      this.container.appendChild(this.subcontainer);
      this.subcontainer.appendChild(this.progress);
      this.subcontainer.appendChild(this.span);
    }

    StatusInProgress.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusInProgress.prototype.update = function(text, show) {
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

    StatusInProgress.prototype.hide = function() {
      return this.container.className = 'hidden';
    };

    StatusInProgress.prototype.attach = function() {
      return this.tile = this.statusBar.addRightTile({
        item: this.container,
        priority: 19
      });
    };

    StatusInProgress.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusInProgress;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL3N0YXR1cy1pbi1wcm9ncmVzcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBS007K0JBQ0osT0FBQSxHQUFTOztJQUVJLDBCQUFBO01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtNQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7TUFFbEIsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QjtNQUVaLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUI7TUFFdkIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDaEIsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFkLEdBQTBCO01BQzFCLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsWUFBeEI7TUFFQSxJQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBMEIsSUFBQyxDQUFBLFFBQTNCO01BQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxXQUFkLENBQTBCLElBQUMsQ0FBQSxJQUEzQjtJQWZXOzsrQkFpQmIsVUFBQSxHQUFZLFNBQUMsU0FBRDtNQUFDLElBQUMsQ0FBQSxZQUFEO0lBQUQ7OytCQUVaLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxJQUFQO01BQ04sSUFBRyxJQUFIO1FBQ0ksSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCO1FBQ3ZCLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtlQUNsQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFkLEVBSEo7T0FBQSxNQUFBO1FBS0ksSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQWlCLFNBQUMsS0FBRCxFQUFRLEtBQVI7VUFDYixJQUFHLEtBQUEsS0FBUyxJQUFaO21CQUNJLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixLQUFoQixFQUF1QixDQUF2QixFQURKOztRQURhLENBQWpCLEVBR0UsSUFIRjtRQUtBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEtBQW1CLENBQXRCO2lCQUNJLElBQUMsQ0FBQSxJQUFELENBQUEsRUFESjtTQUFBLE1BQUE7aUJBR0ksSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxFQUgvQjtTQVZKOztJQURNOzsrQkFnQlIsSUFBQSxHQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUI7SUFEbkI7OytCQUdOLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0I7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFNBQVA7UUFBa0IsUUFBQSxFQUFVLEVBQTVCO09BQXhCO0lBREY7OytCQUdSLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFETTs7Ozs7QUFqRFYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5cbiMjKlxuIyBQcm9ncmVzcyBiYXIgaW4gdGhlIHN0YXR1cyBiYXJcbiMjXG5jbGFzcyBTdGF0dXNJblByb2dyZXNzXG4gIGFjdGlvbnM6IFtdXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgIEBzcGFuLmNsYXNzTmFtZSA9IFwiaW5saW5lLWJsb2NrIHRleHQtc3VidGxlXCJcbiAgICBAc3Bhbi5pbm5lckhUTUwgPSBcIkluZGV4aW5nLi5cIlxuXG4gICAgQHByb2dyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByb2dyZXNzXCIpXG5cbiAgICBAY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIEBjb250YWluZXIuY2xhc3NOYW1lID0gXCJpbmxpbmUtYmxvY2tcIlxuXG4gICAgQHN1YmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBAc3ViY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYmxvY2tcIlxuICAgIEBjb250YWluZXIuYXBwZW5kQ2hpbGQoQHN1YmNvbnRhaW5lcilcblxuICAgIEBzdWJjb250YWluZXIuYXBwZW5kQ2hpbGQoQHByb2dyZXNzKVxuICAgIEBzdWJjb250YWluZXIuYXBwZW5kQ2hpbGQoQHNwYW4pXG5cbiAgaW5pdGlhbGl6ZTogKEBzdGF0dXNCYXIpIC0+XG5cbiAgdXBkYXRlOiAodGV4dCwgc2hvdykgLT5cbiAgICBpZiBzaG93XG4gICAgICAgIEBjb250YWluZXIuY2xhc3NOYW1lID0gXCJpbmxpbmUtYmxvY2tcIlxuICAgICAgICBAc3Bhbi5pbm5lckhUTUwgPSB0ZXh0XG4gICAgICAgIEBhY3Rpb25zLnB1c2godGV4dClcbiAgICBlbHNlXG4gICAgICAgIEBhY3Rpb25zLmZvckVhY2goKHZhbHVlLCBpbmRleCkgLT5cbiAgICAgICAgICAgIGlmIHZhbHVlID09IHRleHRcbiAgICAgICAgICAgICAgICBAYWN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICwgQClcblxuICAgICAgICBpZiBAYWN0aW9ucy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgQGhpZGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc3Bhbi5pbm5lckhUTUwgPSBAYWN0aW9uc1swXVxuXG4gIGhpZGU6IC0+XG4gICAgQGNvbnRhaW5lci5jbGFzc05hbWUgPSAnaGlkZGVuJ1xuXG4gIGF0dGFjaDogLT5cbiAgICBAdGlsZSA9IEBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKGl0ZW06IEBjb250YWluZXIsIHByaW9yaXR5OiAxOSlcblxuICBkZXRhY2g6IC0+XG4gICAgQHRpbGUuZGVzdHJveSgpXG4iXX0=
