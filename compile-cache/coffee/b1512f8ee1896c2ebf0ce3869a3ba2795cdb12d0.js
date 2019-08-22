(function() {
  module.exports = {
    activate: function() {
      return this.wrapBlock();
    },
    onSave: function(editor) {
      return this.activate();
    },
    wrapBlock: function() {
      atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {});
      return console.log("wrapBlock xxx");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBQ04sSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQURNLENBRlI7SUFJQSxTQUFBLEVBQVcsU0FBQTtNQUNULElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUEsR0FBQSxDQUF6RDthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksZUFBWjtJQUZTLENBSlg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyIjIH4vLmF0b20vZnVuY3Rpb25zLmNvZmZlZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoKSAtPlxuICAgIHRoaXMud3JhcEJsb2NrKClcbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgIHRoaXMuYWN0aXZhdGUoKVxuICB3cmFwQmxvY2s6ICgpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgY29uc29sZS5sb2cgXCJ3cmFwQmxvY2sgeHh4XCJcbiJdfQ==
