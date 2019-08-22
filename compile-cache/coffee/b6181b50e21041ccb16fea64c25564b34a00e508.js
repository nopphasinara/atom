(function() {
  module.exports = {
    onSave: function(editor) {
      console.log("Saved! " + (editor.getPath()));
      return this.onFuck(editor);
    },
    onFuck: function(editor) {
      return console.log("FUCK");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQ7TUFDTixPQUFPLENBQUMsR0FBUixDQUFZLFNBQUEsR0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBRCxDQUFyQjthQUNBLElBQUksQ0FBQyxNQUFMLENBQVksTUFBWjtJQUZNLENBQVI7SUFHQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO0lBRE0sQ0FIUjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQhICN7ZWRpdG9yLmdldFBhdGgoKX1cIlxuICAgIHRoaXMub25GdWNrKGVkaXRvcilcbiAgb25GdWNrOiAoZWRpdG9yKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiRlVDS1wiXG4iXX0=
