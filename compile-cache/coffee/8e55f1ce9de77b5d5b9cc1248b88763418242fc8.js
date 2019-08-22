(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return this.wrapBlock();
      });
    },
    onSave: function(editor) {
      return this.activate();
    },
    wrapBlock: function() {
      return console.log("wrapBlock xxx");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxpQkFBdEMsRUFBeUQsU0FBQTtlQUN2RCxJQUFJLENBQUMsU0FBTCxDQUFBO01BRHVELENBQXpEO0lBRFEsQ0FBVjtJQUdBLE1BQUEsRUFBUSxTQUFDLE1BQUQ7YUFDTixJQUFJLENBQUMsUUFBTCxDQUFBO0lBRE0sQ0FIUjtJQUtBLFNBQUEsRUFBVyxTQUFBO2FBQ1QsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFaO0lBRFMsQ0FMWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgICB0aGlzLndyYXBCbG9jaygpXG4gIG9uU2F2ZTogKGVkaXRvcikgLT5cbiAgICB0aGlzLmFjdGl2YXRlKClcbiAgd3JhcEJsb2NrOiAoKSAtPlxuICAgIGNvbnNvbGUubG9nIFwid3JhcEJsb2NrIHh4eFwiXG4iXX0=
