(function() {
  module.exports = {
    activate: function() {
      return this.wrapBlock();
    },
    onSave: function(editor) {
      console.log("Saved!");
      return this.activate();
    },
    wrapBlock: function() {
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {});
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO01BQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaO2FBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUEsR0FBQSxDQUF6RDtJQURTLENBTFg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyIjIH4vLmF0b20vZnVuY3Rpb25zLmNvZmZlZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoKSAtPlxuICAgIHRoaXMud3JhcEJsb2NrKClcbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQhXCJcbiAgICB0aGlzLmFjdGl2YXRlKClcbiAgd3JhcEJsb2NrOiAoKSAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS10ZXh0LWVkaXRvclwiLCBcIm5lcmQ6d3JhcC1ibG9ja1wiLCAoKSAtPlxuICAgICAgIyBjb25zb2xlLmxvZyBcIndyYXBCbG9jayB4eHhcIlxuIl19
