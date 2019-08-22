(function() {
  module.exports = {
    activate: function() {
      return this.wrapBlock();
    },
    onSave: function(editor) {
      return this.activate();
    },
    wrapBlock: function() {
      var cursors, editor;
      editor = atom.workspace.getActiveTextEditor();
      cursors = editor.getCursors();
      atom.commands.remove("atom-text-editor", "nerd:wrap-block");
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("wrapBlock");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBRU4sSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUE7TUFFVixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQWQsQ0FBcUIsa0JBQXJCLEVBQXlDLGlCQUF6QzthQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUE7ZUFFdkQsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaO01BRnVELENBQXpEO0lBTFMsQ0FMWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgdGhpcy53cmFwQmxvY2soKVxuICBvblNhdmU6IChlZGl0b3IpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIlNhdmVkIVwiXG4gICAgdGhpcy5hY3RpdmF0ZSgpXG4gIHdyYXBCbG9jazogKCkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICMgY29uc29sZS5sb2cgY3Vyc29yc1xuICAgIGF0b20uY29tbWFuZHMucmVtb3ZlKFwiYXRvbS10ZXh0LWVkaXRvclwiLCBcIm5lcmQ6d3JhcC1ibG9ja1wiKVxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS10ZXh0LWVkaXRvclwiLCBcIm5lcmQ6d3JhcC1ibG9ja1wiLCAoKSAtPlxuICAgICAgIyBjb25zb2xlLmxvZyBcIndyYXBCbG9jayB4eHhcIlxuICAgICAgY29uc29sZS5sb2cgXCJ3cmFwQmxvY2tcIlxuIl19
