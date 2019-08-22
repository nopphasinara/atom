(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "nerd:wrap-block", function() {
        return console.log("wrapBlock");
      });
    },
    onSave: function(editor) {
      return this.wrapBlock(editor);
    },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9mdW5jdGlvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxpQkFBdEMsRUFBeUQsU0FBQTtlQUN2RCxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVo7TUFEdUQsQ0FBekQ7SUFEUSxDQUFWO0lBR0EsTUFBQSxFQUFRLFNBQUMsTUFBRDthQUVOLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZjtJQUZNLENBSFI7SUFNQSxTQUFBLEVBQVcsU0FBQyxNQUFEO0FBQ1QsVUFBQTtNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLEVBQXlELFNBQUE7ZUFDdkQsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaO01BRHVELENBQXpEO01BR0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsTUFBakMsQ0FBd0MsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLENBQUMsT0FBRixDQUFBO01BQVIsQ0FBeEM7YUFDZixPQUFPLENBQUMsR0FBUixDQUFZLFlBQVo7SUFMUyxDQU5YOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsiIyB+Ly5hdG9tL2Z1bmN0aW9ucy5jb2ZmZWVcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKCkgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIiwgXCJuZXJkOndyYXAtYmxvY2tcIiwgKCkgLT5cbiAgICAgIGNvbnNvbGUubG9nIFwid3JhcEJsb2NrXCJcbiAgb25TYXZlOiAoZWRpdG9yKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJTYXZlZCEgI3tlZGl0b3IuZ2V0UGF0aCgpfVwiXG4gICAgdGhpcy53cmFwQmxvY2soZWRpdG9yKVxuICB3cmFwQmxvY2s6IChlZGl0b3IpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsIFwibmVyZDp3cmFwLWJsb2NrXCIsICgpIC0+XG4gICAgICBjb25zb2xlLmxvZyBcIndyYXBCbG9ja1wiXG5cbiAgICByYW5nZXNUb1dyYXAgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKS5maWx0ZXIoKHIpIC0+ICFyLmlzRW1wdHkoKSlcbiAgICBjb25zb2xlLmxvZyByYW5nZXNUb1dyYXBcbiJdfQ==
