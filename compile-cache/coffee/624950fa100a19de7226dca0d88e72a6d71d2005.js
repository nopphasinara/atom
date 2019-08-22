(function() {
  module.exports = {
    activate: function() {
      return this.wrapBlock();
    },
    onSave: function(editor) {
      return this.activate();
    },
    wrapBlock: function() {
      var editor;
      console.log("wrapBlock");
      return editor = atom.workspace.getActiveTextEditor();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBQTtJQURRLENBQVY7SUFFQSxNQUFBLEVBQVEsU0FBQyxNQUFEO2FBRU4sSUFBSSxDQUFDLFFBQUwsQ0FBQTtJQUZNLENBRlI7SUFLQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVo7YUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBRkEsQ0FMWDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIiMgfi8uYXRvbS9mdW5jdGlvbnMuY29mZmVlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgdGhpcy53cmFwQmxvY2soKVxuICBvblNhdmU6IChlZGl0b3IpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIlNhdmVkIVwiXG4gICAgdGhpcy5hY3RpdmF0ZSgpXG4gIHdyYXBCbG9jazogKCkgLT5cbiAgICBjb25zb2xlLmxvZyBcIndyYXBCbG9ja1wiXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgIyBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIiwgXCJuZXJkOndyYXAtYmxvY2tcIiwgKCkgLT5cbiAgICAjICAgY29uc29sZS5sb2cgXCJ3cmFwQmxvY2sgeHh4XCJcbiJdfQ==
