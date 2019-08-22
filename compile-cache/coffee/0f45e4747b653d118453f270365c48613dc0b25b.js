(function() {
  module.exports = {
    onSave: function(editor) {
      return this.wrapBlock(editor);
    },
    wrapBlock: function(editor) {
      var rangesToWrap;
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      return console.log(rangesToWrap);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQ7YUFFTixJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWY7SUFGTSxDQUFSO0lBR0EsU0FBQSxFQUFXLFNBQUMsTUFBRDtBQUNULFVBQUE7TUFBQSxZQUFBLEdBQWUsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUFqQyxDQUF3QyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsQ0FBQyxPQUFGLENBQUE7TUFBUixDQUF4QzthQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWjtJQUZTLENBSFg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyIjIH4vLmF0b20vZnVuY3Rpb25zLmNvZmZlZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIG9uU2F2ZTogKGVkaXRvcikgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiU2F2ZWQhICN7ZWRpdG9yLmdldFBhdGgoKX1cIlxuICAgIHRoaXMud3JhcEJsb2NrKGVkaXRvcilcbiAgd3JhcEJsb2NrOiAoZWRpdG9yKSAtPlxuICAgIHJhbmdlc1RvV3JhcCA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLmZpbHRlcigocikgLT4gIXIuaXNFbXB0eSgpKVxuICAgIGNvbnNvbGUubG9nIHJhbmdlc1RvV3JhcFxuIl19
