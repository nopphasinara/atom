(function() {
  module.exports = {
    onSave: function(editor) {
      var rangesToWrap;
      console.log("Saved! " + (editor.getPath()));
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      return this.onFuck(editor);
    },
    onFuck: function(editor) {
      return console.log("FUCK");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQ7QUFDTixVQUFBO01BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFBLEdBQVMsQ0FBQyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUQsQ0FBckI7TUFDQSxZQUFBLEdBQWUsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUFqQyxDQUF3QyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsQ0FBQyxPQUFGLENBQUE7TUFBUixDQUF4QzthQUNmLElBQUksQ0FBQyxNQUFMLENBQVksTUFBWjtJQUhNLENBQVI7SUFJQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO0lBRE0sQ0FKUjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQhICN7ZWRpdG9yLmdldFBhdGgoKX1cIlxuICAgIHJhbmdlc1RvV3JhcCA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLmZpbHRlcigocikgLT4gIXIuaXNFbXB0eSgpKVxuICAgIHRoaXMub25GdWNrKGVkaXRvcilcbiAgb25GdWNrOiAoZWRpdG9yKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiRlVDS1wiXG4iXX0=
