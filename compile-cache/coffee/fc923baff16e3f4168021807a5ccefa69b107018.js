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
      return atom.commands.atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("wrapBlock");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBRU4sSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUE7YUFFVixJQUFJLENBQUMsUUFBUSxDQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsR0FEZCxDQUNrQixrQkFEbEIsRUFDc0MsaUJBRHRDLEVBQ3lELFNBQUE7ZUFFdkQsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaO01BRnVELENBRHpEO0lBSlMsQ0FMWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgdGhpcy53cmFwQmxvY2soKVxuICBvblNhdmU6IChlZGl0b3IpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIlNhdmVkIVwiXG4gICAgdGhpcy5hY3RpdmF0ZSgpXG4gIHdyYXBCbG9jazogKCkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvcnMoKVxuICAgICMgY29uc29sZS5sb2cgY3Vyc29yc1xuICAgIGF0b20uY29tbWFuZHMuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgICAjIGNvbnNvbGUubG9nIFwid3JhcEJsb2NrIHh4eFwiXG4gICAgICBjb25zb2xlLmxvZyBcIndyYXBCbG9ja1wiXG4iXX0=
