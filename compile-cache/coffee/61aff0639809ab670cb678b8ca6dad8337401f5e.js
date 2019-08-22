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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9jaGFuZ2UtY2FzZS9saWIvY2hhbmdlLWNhc2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0VBRWIsUUFBQSxHQUNFO0lBQUEsS0FBQSxFQUFPLFdBQVA7SUFDQSxRQUFBLEVBQVUsY0FEVjtJQUVBLEdBQUEsRUFBSyxTQUZMO0lBR0EsS0FBQSxFQUFPLFdBSFA7SUFJQSxVQUFBLEVBQVksZ0JBSlo7SUFLQSxLQUFBLEVBQU8sV0FMUDtJQU1BLE1BQUEsRUFBUSxZQU5SO0lBT0EsSUFBQSxFQUFNLFVBUE47SUFRQSxRQUFBLEVBQVUsY0FSVjtJQVNBLEtBQUEsRUFBTyxXQVRQO0lBVUEsQ0FBQSxNQUFBLENBQUEsRUFBUSxVQVZSO0lBV0EsSUFBQSxFQUFNLFVBWE47SUFZQSxLQUFBLEVBQU8sV0FaUDtJQWFBLEtBQUEsRUFBTyxXQWJQO0lBY0EsVUFBQSxFQUFZLGdCQWRaO0lBZUEsS0FBQSxFQUFPLFdBZlA7OztFQW9CRixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7QUFBQTtXQUFBLG1CQUFBO3FCQUNFLFdBQUEsQ0FBWSxPQUFaO0FBREY7O0lBRFEsQ0FBVjs7O0VBSUYsV0FBQSxHQUFjLFNBQUMsT0FBRDtXQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsY0FBQSxHQUFlLE9BQW5ELEVBQThELFNBQUMsS0FBRDtBQUM1RCxVQUFBO01BQUEsSUFBK0MsYUFBL0M7UUFBQSxNQUFBLEdBQVMsb0JBQUEsQ0FBcUIsS0FBSyxDQUFDLE1BQTNCLEVBQVQ7O01BQ0EsSUFBcUQsY0FBckQ7UUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBQVQ7O01BRUEsSUFBYyxjQUFkO0FBQUEsZUFBQTs7TUFFQSxNQUFBLEdBQVMsUUFBUyxDQUFBLE9BQUE7TUFDbEIsU0FBQSxHQUFZLFVBQVcsQ0FBQSxNQUFBO2FBRXZCLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixTQUFDLFNBQUQ7QUFDeEIsWUFBQTtRQUFBLElBQUcsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFIO1VBQ0UsU0FBUyxDQUFDLFVBQVYsQ0FBQSxFQURGOztRQUdBLElBQUEsR0FBTyxTQUFTLENBQUMsT0FBVixDQUFBO1FBQ1AsT0FBQSxHQUFVLFNBQUEsQ0FBVSxJQUFWO2VBRVYsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsT0FBckIsRUFBOEI7VUFBQSxNQUFBLEVBQVEsSUFBUjtTQUE5QjtNQVB3QixDQUExQjtJQVQ0RCxDQUE5RDtFQURZOztFQW1CZCxvQkFBQSxHQUF1QixTQUFDLE9BQUQ7QUFDckIsUUFBQTtvRUFBbUMsQ0FBRSxRQUFyQyxDQUFBO0VBRHFCO0FBL0N2QiIsInNvdXJjZXNDb250ZW50IjpbIkNoYW5nZUNhc2UgPSByZXF1aXJlICdjaGFuZ2UtY2FzZSdcblxuQ29tbWFuZHMgPVxuICBjYW1lbDogJ2NhbWVsQ2FzZSdcbiAgY29uc3RhbnQ6ICdjb25zdGFudENhc2UnXG4gIGRvdDogJ2RvdENhc2UnXG4gIGxvd2VyOiAnbG93ZXJDYXNlJ1xuICBsb3dlckZpcnN0OiAnbG93ZXJDYXNlRmlyc3QnXG4gIHBhcmFtOiAncGFyYW1DYXNlJ1xuICBwYXNjYWw6ICdwYXNjYWxDYXNlJ1xuICBwYXRoOiAncGF0aENhc2UnXG4gIHNlbnRlbmNlOiAnc2VudGVuY2VDYXNlJ1xuICBzbmFrZTogJ3NuYWtlQ2FzZSdcbiAgc3dpdGNoOiAnc3dhcENhc2UnXG4gIHN3YXA6ICdzd2FwQ2FzZSdcbiAgdGl0bGU6ICd0aXRsZUNhc2UnXG4gIHVwcGVyOiAndXBwZXJDYXNlJ1xuICB1cHBlckZpcnN0OiAndXBwZXJDYXNlRmlyc3QnXG4gIGtlYmFiOiAncGFyYW1DYXNlJ1xuXG4jIE5PVEU6IE5ldyBjb21tYW5kcyBtdXNzdCBiZSBhZGRlZCB0byB0aGUgYWN0aXZhdGlvbkNvbW1hbmRzXG4jIGluIHRoZSBwYWNrYWdlLmpzb25cblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGZvciBjb21tYW5kIG9mIENvbW1hbmRzXG4gICAgICBtYWtlQ29tbWFuZChjb21tYW5kKVxuXG5tYWtlQ29tbWFuZCA9IChjb21tYW5kKSAtPlxuICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCBcImNoYW5nZS1jYXNlOiN7Y29tbWFuZH1cIiwgKGV2ZW50KSAtPlxuICAgIGVkaXRvciA9IGdldEVkaXRvckZyb21FbGVtZW50KGV2ZW50LnRhcmdldCkgaWYgZXZlbnQ/XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIHVubGVzcyBlZGl0b3I/XG5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cblxuICAgIG1ldGhvZCA9IENvbW1hbmRzW2NvbW1hbmRdXG4gICAgY29udmVydGVyID0gQ2hhbmdlQ2FzZVttZXRob2RdXG5cbiAgICBlZGl0b3IubXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+XG4gICAgICBpZiBzZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICAgIHNlbGVjdGlvbi5zZWxlY3RXb3JkKClcblxuICAgICAgdGV4dCA9IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgICAgIG5ld1RleHQgPSBjb252ZXJ0ZXIodGV4dClcblxuICAgICAgc2VsZWN0aW9uLmluc2VydFRleHQgbmV3VGV4dCwgc2VsZWN0OiB0cnVlXG5cbmdldEVkaXRvckZyb21FbGVtZW50ID0gKGVsZW1lbnQpIC0+XG4gIGVsZW1lbnQuY2xvc2VzdCgnYXRvbS10ZXh0LWVkaXRvcicpPy5nZXRNb2RlbCgpXG4iXX0=
