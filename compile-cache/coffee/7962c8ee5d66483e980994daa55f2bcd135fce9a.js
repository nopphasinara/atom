(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("aaaa");
      });
    },
    onSave: function(editor) {
      return this.activate();
    },
    wrapBlock: function() {
      return console.log("wrapBlock xxx");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxpQkFBdEMsRUFBeUQsU0FBQTtlQUN2RCxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVo7TUFEdUQsQ0FBekQ7SUFEUSxDQUFWO0lBR0EsTUFBQSxFQUFRLFNBQUMsTUFBRDthQUNOLElBQUksQ0FBQyxRQUFMLENBQUE7SUFETSxDQUhSO0lBS0EsU0FBQSxFQUFXLFNBQUE7YUFDVCxPQUFPLENBQUMsR0FBUixDQUFZLGVBQVo7SUFEUyxDQUxYOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsiIyB+Ly5hdG9tL2Z1bmN0aW9ucy5jb2ZmZWVcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKCkgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIiwgXCJuZXJkOndyYXAtYmxvY2tcIiwgKCkgLT5cbiAgICAgIGNvbnNvbGUubG9nIFwiYWFhYVwiXG4gIG9uU2F2ZTogKGVkaXRvcikgLT5cbiAgICB0aGlzLmFjdGl2YXRlKClcbiAgd3JhcEJsb2NrOiAoKSAtPlxuICAgIGNvbnNvbGUubG9nIFwid3JhcEJsb2NrIHh4eFwiXG4iXX0=
