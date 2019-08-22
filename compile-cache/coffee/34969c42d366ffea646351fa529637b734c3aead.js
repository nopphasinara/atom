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
      console.log(cursors);
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        console.log("wrapBlock xxx");
        return console.log("wrapBlock");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBRU4sSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUE7TUFDVixPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7YUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGlCQUF0QyxFQUF5RCxTQUFBO1FBQ3ZELE9BQU8sQ0FBQyxHQUFSLENBQVksZUFBWjtlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksV0FBWjtNQUZ1RCxDQUF6RDtJQUpTLENBTFg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyIjIH4vLmF0b20vZnVuY3Rpb25zLmNvZmZlZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoKSAtPlxuICAgIHRoaXMud3JhcEJsb2NrKClcbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJTYXZlZCFcIlxuICAgIHRoaXMuYWN0aXZhdGUoKVxuICB3cmFwQmxvY2s6ICgpIC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKClcbiAgICBjb25zb2xlLmxvZyBjdXJzb3JzXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgICBjb25zb2xlLmxvZyBcIndyYXBCbG9jayB4eHhcIlxuICAgICAgY29uc29sZS5sb2cgXCJ3cmFwQmxvY2tcIlxuIl19
