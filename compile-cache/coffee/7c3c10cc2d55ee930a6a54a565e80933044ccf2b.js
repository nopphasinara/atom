(function() {
  module.exports = {
    onSave: function() {
      var rangesToWrap;
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      return console.log(rangesToWrap);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFBO0FBRU4sVUFBQTtNQUFBLFlBQUEsR0FBZSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE1BQWpDLENBQXdDLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxDQUFDLE9BQUYsQ0FBQTtNQUFSLENBQXhDO2FBQ2YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaO0lBSE0sQ0FBUjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgb25TYXZlOiAoKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJTYXZlZCEgI3tlZGl0b3IuZ2V0UGF0aCgpfVwiXG4gICAgcmFuZ2VzVG9XcmFwID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkuZmlsdGVyKChyKSAtPiAhci5pc0VtcHR5KCkpXG4gICAgY29uc29sZS5sb2cgcmFuZ2VzVG9XcmFwXG4iXX0=
