(function() {
  module.exports = {
    onSave: function(editor) {},
    wrapBlock: function(editor) {
      var rangesToWrap;
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      return console.log(rangesToWrap);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQSxDQUFSO0lBR0EsU0FBQSxFQUFXLFNBQUMsTUFBRDtBQUNULFVBQUE7TUFBQSxZQUFBLEdBQWUsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUFqQyxDQUF3QyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsQ0FBQyxPQUFGLENBQUE7TUFBUixDQUF4QzthQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWjtJQUZTLENBSFg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyIjIH4vLmF0b20vZnVuY3Rpb25zLmNvZmZlZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIG9uU2F2ZTogKGVkaXRvcikgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiU2F2ZWQhICN7ZWRpdG9yLmdldFBhdGgoKX1cIlxuICAgICMgdGhpcy53cmFwQmxvY2soZWRpdG9yKVxuICB3cmFwQmxvY2s6IChlZGl0b3IpIC0+XG4gICAgcmFuZ2VzVG9XcmFwID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkuZmlsdGVyKChyKSAtPiAhci5pc0VtcHR5KCkpXG4gICAgY29uc29sZS5sb2cgcmFuZ2VzVG9XcmFwXG4iXX0=
