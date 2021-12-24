(function() {
  var ChangeCase, Commands, getEditorFromElement, makeCommand;

  ChangeCase = require('change-case');

  Commands = {
    camel: 'camelCase',
    constant: 'constantCase',
    dot: 'dotCase',
    lower: 'lowerCase',
    lowerFirst: 'lowerCaseFirst',
    param: 'paramCase',
    pascal: 'pascalCase',
    path: 'pathCase',
    sentence: 'sentenceCase',
    snake: 'snakeCase',
    "switch": 'swapCase',
    swap: 'swapCase',
    title: 'titleCase',
    upper: 'upperCase',
    upperFirst: 'upperCaseFirst',
    kebab: 'paramCase'
  };

  module.exports = {
    activate: function(state) {
      var command, results;
      results = [];
      for (command in Commands) {
        results.push(makeCommand(command));
      }
      return results;
    }
  };

  makeCommand = function(command) {
    return atom.commands.add('atom-workspace', "change-case:" + command, function(event) {
      var converter, editor, method;
      if (event != null) {
        editor = getEditorFromElement(event.target);
      }
      if (editor == null) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (editor == null) {
        return;
      }
      method = Commands[command];
      converter = ChangeCase[method];
      return editor.mutateSelectedText(function(selection) {
        var newText, text;
        if (selection.isEmpty()) {
          selection.selectWord();
        }
        text = selection.getText();
        newText = converter(text);
        return selection.insertText(newText, {
          select: true
        });
      });
    });
  };

  getEditorFromElement = function(element) {
    var ref;
    return (ref = element.closest('atom-text-editor')) != null ? ref.getModel() : void 0;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2NoYW5nZS1jYXNlL2xpYi9jaGFuZ2UtY2FzZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjs7RUFFYixRQUFBLEdBQ0U7SUFBQSxLQUFBLEVBQU8sV0FBUDtJQUNBLFFBQUEsRUFBVSxjQURWO0lBRUEsR0FBQSxFQUFLLFNBRkw7SUFHQSxLQUFBLEVBQU8sV0FIUDtJQUlBLFVBQUEsRUFBWSxnQkFKWjtJQUtBLEtBQUEsRUFBTyxXQUxQO0lBTUEsTUFBQSxFQUFRLFlBTlI7SUFPQSxJQUFBLEVBQU0sVUFQTjtJQVFBLFFBQUEsRUFBVSxjQVJWO0lBU0EsS0FBQSxFQUFPLFdBVFA7SUFVQSxDQUFBLE1BQUEsQ0FBQSxFQUFRLFVBVlI7SUFXQSxJQUFBLEVBQU0sVUFYTjtJQVlBLEtBQUEsRUFBTyxXQVpQO0lBYUEsS0FBQSxFQUFPLFdBYlA7SUFjQSxVQUFBLEVBQVksZ0JBZFo7SUFlQSxLQUFBLEVBQU8sV0FmUDs7O0VBb0JGLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtBQUFBO1dBQUEsbUJBQUE7cUJBQ0UsV0FBQSxDQUFZLE9BQVo7QUFERjs7SUFEUSxDQUFWOzs7RUFJRixXQUFBLEdBQWMsU0FBQyxPQUFEO1dBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxjQUFBLEdBQWUsT0FBbkQsRUFBOEQsU0FBQyxLQUFEO0FBQzVELFVBQUE7TUFBQSxJQUErQyxhQUEvQztRQUFBLE1BQUEsR0FBUyxvQkFBQSxDQUFxQixLQUFLLENBQUMsTUFBM0IsRUFBVDs7TUFDQSxJQUFxRCxjQUFyRDtRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFBVDs7TUFFQSxJQUFjLGNBQWQ7QUFBQSxlQUFBOztNQUVBLE1BQUEsR0FBUyxRQUFTLENBQUEsT0FBQTtNQUNsQixTQUFBLEdBQVksVUFBVyxDQUFBLE1BQUE7YUFFdkIsTUFBTSxDQUFDLGtCQUFQLENBQTBCLFNBQUMsU0FBRDtBQUN4QixZQUFBO1FBQUEsSUFBRyxTQUFTLENBQUMsT0FBVixDQUFBLENBQUg7VUFDRSxTQUFTLENBQUMsVUFBVixDQUFBLEVBREY7O1FBR0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxPQUFWLENBQUE7UUFDUCxPQUFBLEdBQVUsU0FBQSxDQUFVLElBQVY7ZUFFVixTQUFTLENBQUMsVUFBVixDQUFxQixPQUFyQixFQUE4QjtVQUFBLE1BQUEsRUFBUSxJQUFSO1NBQTlCO01BUHdCLENBQTFCO0lBVDRELENBQTlEO0VBRFk7O0VBbUJkLG9CQUFBLEdBQXVCLFNBQUMsT0FBRDtBQUNyQixRQUFBO29FQUFtQyxDQUFFLFFBQXJDLENBQUE7RUFEcUI7QUEvQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiQ2hhbmdlQ2FzZSA9IHJlcXVpcmUgJ2NoYW5nZS1jYXNlJ1xuXG5Db21tYW5kcyA9XG4gIGNhbWVsOiAnY2FtZWxDYXNlJ1xuICBjb25zdGFudDogJ2NvbnN0YW50Q2FzZSdcbiAgZG90OiAnZG90Q2FzZSdcbiAgbG93ZXI6ICdsb3dlckNhc2UnXG4gIGxvd2VyRmlyc3Q6ICdsb3dlckNhc2VGaXJzdCdcbiAgcGFyYW06ICdwYXJhbUNhc2UnXG4gIHBhc2NhbDogJ3Bhc2NhbENhc2UnXG4gIHBhdGg6ICdwYXRoQ2FzZSdcbiAgc2VudGVuY2U6ICdzZW50ZW5jZUNhc2UnXG4gIHNuYWtlOiAnc25ha2VDYXNlJ1xuICBzd2l0Y2g6ICdzd2FwQ2FzZSdcbiAgc3dhcDogJ3N3YXBDYXNlJ1xuICB0aXRsZTogJ3RpdGxlQ2FzZSdcbiAgdXBwZXI6ICd1cHBlckNhc2UnXG4gIHVwcGVyRmlyc3Q6ICd1cHBlckNhc2VGaXJzdCdcbiAga2ViYWI6ICdwYXJhbUNhc2UnXG5cbiMgTk9URTogTmV3IGNvbW1hbmRzIG11c3N0IGJlIGFkZGVkIHRvIHRoZSBhY3RpdmF0aW9uQ29tbWFuZHNcbiMgaW4gdGhlIHBhY2thZ2UuanNvblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgZm9yIGNvbW1hbmQgb2YgQ29tbWFuZHNcbiAgICAgIG1ha2VDb21tYW5kKGNvbW1hbmQpXG5cbm1ha2VDb21tYW5kID0gKGNvbW1hbmQpIC0+XG4gIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsIFwiY2hhbmdlLWNhc2U6I3tjb21tYW5kfVwiLCAoZXZlbnQpIC0+XG4gICAgZWRpdG9yID0gZ2V0RWRpdG9yRnJvbUVsZW1lbnQoZXZlbnQudGFyZ2V0KSBpZiBldmVudD9cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkgdW5sZXNzIGVkaXRvcj9cblxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgbWV0aG9kID0gQ29tbWFuZHNbY29tbWFuZF1cbiAgICBjb252ZXJ0ZXIgPSBDaGFuZ2VDYXNlW21ldGhvZF1cblxuICAgIGVkaXRvci5tdXRhdGVTZWxlY3RlZFRleHQgKHNlbGVjdGlvbikgLT5cbiAgICAgIGlmIHNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgICAgc2VsZWN0aW9uLnNlbGVjdFdvcmQoKVxuXG4gICAgICB0ZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgbmV3VGV4dCA9IGNvbnZlcnRlcih0ZXh0KVxuXG4gICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dCBuZXdUZXh0LCBzZWxlY3Q6IHRydWVcblxuZ2V0RWRpdG9yRnJvbUVsZW1lbnQgPSAoZWxlbWVudCkgLT5cbiAgZWxlbWVudC5jbG9zZXN0KCdhdG9tLXRleHQtZWRpdG9yJyk/LmdldE1vZGVsKClcbiJdfQ==
