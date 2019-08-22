(function() {
  module.exports = {
    onSave: function(editor) {},
    wrapBlock: function(editor) {
      var rangesToWrap;
      atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("wrapBlock");
      });
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      return console.log(rangesToWrap);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQSxDQUFSO0lBR0EsU0FBQSxFQUFXLFNBQUMsTUFBRDtBQUNULFVBQUE7TUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGlCQUF0QyxFQUF5RCxTQUFBO2VBQ3ZELE9BQU8sQ0FBQyxHQUFSLENBQVksV0FBWjtNQUR1RCxDQUF6RDtNQUdBLFlBQUEsR0FBZSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE1BQWpDLENBQXdDLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxDQUFDLE9BQUYsQ0FBQTtNQUFSLENBQXhDO2FBQ2YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaO0lBTFMsQ0FIWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJTYXZlZCEgI3tlZGl0b3IuZ2V0UGF0aCgpfVwiXG4gICAgIyB0aGlzLndyYXBCbG9jayhlZGl0b3IpXG4gIHdyYXBCbG9jazogKGVkaXRvcikgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIiwgXCJuZXJkOndyYXAtYmxvY2tcIiwgKCkgLT5cbiAgICAgIGNvbnNvbGUubG9nIFwid3JhcEJsb2NrXCJcblxuICAgIHJhbmdlc1RvV3JhcCA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLmZpbHRlcigocikgLT4gIXIuaXNFbXB0eSgpKVxuICAgIGNvbnNvbGUubG9nIHJhbmdlc1RvV3JhcFxuIl19
