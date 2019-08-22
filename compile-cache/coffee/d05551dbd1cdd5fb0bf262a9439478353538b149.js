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
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("wrapBlock xxx");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO01BQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaO2FBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUE7ZUFDdkQsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFaO01BRHVELENBQXpEO0lBRFMsQ0FMWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgdGhpcy53cmFwQmxvY2soKVxuICBvblNhdmU6IChlZGl0b3IpIC0+XG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCFcIlxuICAgIHRoaXMuYWN0aXZhdGUoKVxuICB3cmFwQmxvY2s6ICgpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgICBjb25zb2xlLmxvZyBcIndyYXBCbG9jayB4eHhcIlxuIl19
