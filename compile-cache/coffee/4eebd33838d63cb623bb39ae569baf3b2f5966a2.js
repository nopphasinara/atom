(function() {
  global.activeEditor = function() {
    return atom.workspace.getActiveTextEditor();
  };

  atom.workspace.observeActiveTextEditor(function() {
    var editor;
    return editor = activeEditor();
  });

  atom.commands.add('atom-text-editor', 'nerd:bio-link', function() {
    var clipboardText, editor, ref, ref1, selectedText;
    editor = atom.workspace.getActiveTextEditor();
    clipboardText = '';
    selectedText = '';
    if (editor.getSelectedText()) {
      selectedText = editor.getSelectedText();
    }
    if (atom.clipboard.read()) {
      clipboardText = atom.clipboard.read();
    }
    if (!selectedText || !clipboardText) {
      return;
    }
    return (ref = atom.packages.activePackages.snippets) != null ? (ref1 = ref.mainModule) != null ? ref1.insert("<a href=\"" + clipboardText + "\" title=\"${1:" + selectedText + "}\">${2:" + selectedText + "}</a>$0") : void 0 : void 0;
  });

  atom.commands.add('atom-text-editor', 'nerd:select-outside-bracket', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets");
    atom.commands.dispatch(atom.views.getView(editor), "core:move-right");
    return atom.commands.dispatch(atom.views.getView(editor), "bracket-matcher:select-inside-brackets");
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLFNBQUE7QUFDcEIsV0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7RUFEYTs7RUFNdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBZixDQUF1QyxTQUFBO0FBQ3JDLFFBQUE7V0FBQSxNQUFBLEdBQVMsWUFBQSxDQUFBO0VBRDRCLENBQXZDOztFQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsZUFBdEMsRUFBdUQsU0FBQTtBQUNyRCxRQUFBO0lBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUNULGFBQUEsR0FBZ0I7SUFDaEIsWUFBQSxHQUFlO0lBQ2YsSUFBRyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQUg7TUFDRSxZQUFBLEdBQWUsTUFBTSxDQUFDLGVBQVAsQ0FBQSxFQURqQjs7SUFHQSxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQUg7TUFDRSxhQUFBLEdBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGxCOztJQUdBLElBQUcsQ0FBQyxZQUFELElBQWlCLENBQUMsYUFBckI7QUFDRSxhQURGOzt5R0FHaUQsQ0FBRSxNQUFuRCxDQUEwRCxZQUFBLEdBQWEsYUFBYixHQUEyQixpQkFBM0IsR0FBNEMsWUFBNUMsR0FBeUQsVUFBekQsR0FBbUUsWUFBbkUsR0FBZ0YsU0FBMUk7RUFicUQsQ0FBdkQ7O0VBb0JBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsNkJBQXRDLEVBQXFFLFNBQUE7QUFDbkUsUUFBQTtJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQXZCLEVBQW1ELHdDQUFuRDtJQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBdkIsRUFBbUQsaUJBQW5EO1dBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUF2QixFQUFtRCx3Q0FBbkQ7RUFKbUUsQ0FBckU7QUEvQkEiLCJzb3VyY2VzQ29udGVudCI6WyJnbG9iYWwuYWN0aXZlRWRpdG9yID0gKCkgLT5cbiAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4jIyBDdXN0b20gQ29tbWFuZHNcblxuI1xuYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IgLT5cbiAgZWRpdG9yID0gYWN0aXZlRWRpdG9yKClcblxuXG4jXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICduZXJkOmJpby1saW5rJywgLT5cbiAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGNsaXBib2FyZFRleHQgPSAnJ1xuICBzZWxlY3RlZFRleHQgPSAnJ1xuICBpZiBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBzZWxlY3RlZFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcblxuICBpZiBhdG9tLmNsaXBib2FyZC5yZWFkKClcbiAgICBjbGlwYm9hcmRUZXh0ID0gYXRvbS5jbGlwYm9hcmQucmVhZCgpXG5cbiAgaWYgIXNlbGVjdGVkVGV4dCB8fCAhY2xpcGJvYXJkVGV4dFxuICAgIHJldHVyblxuXG4gIGF0b20ucGFja2FnZXMuYWN0aXZlUGFja2FnZXMuc25pcHBldHM/Lm1haW5Nb2R1bGU/Lmluc2VydCBcIjxhIGhyZWY9XFxcIiN7Y2xpcGJvYXJkVGV4dH1cXFwiIHRpdGxlPVxcXCIkezE6I3tzZWxlY3RlZFRleHR9fVxcXCI+JHsyOiN7c2VsZWN0ZWRUZXh0fX08L2E+JDBcIlxuICAjIGVkaXRvci5pbnNlcnRUZXh0KFwiPGEgaHJlZj1cXFwiI3tjbGlwYm9hcmRUZXh0fVxcXCIgdGl0bGU9XFxcIiN7c2VsZWN0ZWRUZXh0fVxcXCI+I3tzZWxlY3RlZFRleHR9PC9hPlwiKVxuICAjIGVkaXRvci5tb3ZlTGVmdCg2ICsgc2VsZWN0ZWRUZXh0Lmxlbmd0aClcbiAgIyBlZGl0b3Iuc2VsZWN0TGVmdChzZWxlY3RlZFRleHQubGVuZ3RoKVxuXG5cbiMgc3NzXG5hdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICduZXJkOnNlbGVjdC1vdXRzaWRlLWJyYWNrZXQnLCAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgXCJicmFja2V0LW1hdGNoZXI6c2VsZWN0LWluc2lkZS1icmFja2V0c1wiKVxuICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCBcImNvcmU6bW92ZS1yaWdodFwiKVxuICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCBcImJyYWNrZXQtbWF0Y2hlcjpzZWxlY3QtaW5zaWRlLWJyYWNrZXRzXCIpXG4iXX0=
