(function() {
  var Aligner, alignLines, alignLinesMultiple;

  Aligner = require('./aligner');

  module.exports = {
    config: {
      alignmentSpaceChars: {
        type: 'array',
        "default": ['=>', ':=', '='],
        items: {
          type: "string"
        },
        description: "insert space in front of the character (a=1 > a =1)",
        order: 2
      },
      alignBy: {
        type: 'array',
        "default": ['=>', ':=', ':', '='],
        items: {
          type: "string"
        },
        description: "consider the order, the left most matching value is taken to compute the alignment",
        order: 1
      },
      addSpacePostfix: {
        type: 'boolean',
        "default": false,
        description: "insert space after the matching character (a=1 > a= 1) if character is part of the 'alignment space chars'",
        order: 3
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'atom-alignment:align': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLines(editor);
        },
        'atom-alignment:alignMultiple': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLinesMultiple(editor);
        }
      });
    }
  };

  alignLines = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(false);
  };

  alignLinesMultiple = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(true);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWFsaWdubWVudC9saWIvYXRvbS1hbGlnbm1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLE1BQUEsRUFDSTtNQUFBLG1CQUFBLEVBQ0k7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEdBQWIsQ0FEVDtRQUVBLEtBQUEsRUFDSTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEo7UUFJQSxXQUFBLEVBQWEscURBSmI7UUFLQSxLQUFBLEVBQU8sQ0FMUDtPQURKO01BT0EsT0FBQSxFQUNJO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBRFQ7UUFFQSxLQUFBLEVBQ0k7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUhKO1FBSUEsV0FBQSxFQUFhLG9GQUpiO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FSSjtNQWNBLGVBQUEsRUFDSTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRHQUZiO1FBR0EsS0FBQSxFQUFPLENBSFA7T0FmSjtLQURKO0lBcUJBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0k7UUFBQSxzQkFBQSxFQUF3QixTQUFBO0FBQ3BCLGNBQUE7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBO2lCQUNULFVBQUEsQ0FBVyxNQUFYO1FBRm9CLENBQXhCO1FBSUEsOEJBQUEsRUFBZ0MsU0FBQTtBQUM1QixjQUFBO1VBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQTtpQkFDVCxrQkFBQSxDQUFtQixNQUFuQjtRQUY0QixDQUpoQztPQURKO0lBRE0sQ0FyQlY7OztFQStCSixVQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1QsUUFBQTtJQUFBLFVBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQjtJQUNuQixPQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEI7SUFDbkIsZUFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO0lBQ25CLENBQUEsR0FBSSxJQUFJLE9BQUosQ0FBWSxNQUFaLEVBQW9CLFVBQXBCLEVBQWdDLE9BQWhDLEVBQXlDLGVBQXpDO0lBQ0osQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSO0VBTFM7O0VBUWIsa0JBQUEsR0FBcUIsU0FBQyxNQUFEO0FBQ2pCLFFBQUE7SUFBQSxVQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEI7SUFDbkIsT0FBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCO0lBQ25CLGVBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQjtJQUNuQixDQUFBLEdBQUksSUFBSSxPQUFKLENBQVksTUFBWixFQUFvQixVQUFwQixFQUFnQyxPQUFoQyxFQUF5QyxlQUF6QztJQUNKLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUjtFQUxpQjtBQTFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJBbGlnbmVyID0gcmVxdWlyZSAnLi9hbGlnbmVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgY29uZmlnOlxuICAgICAgICBhbGlnbm1lbnRTcGFjZUNoYXJzOlxuICAgICAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgICAgICAgZGVmYXVsdDogWyc9PicsICc6PScsICc9J11cbiAgICAgICAgICAgIGl0ZW1zOlxuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImluc2VydCBzcGFjZSBpbiBmcm9udCBvZiB0aGUgY2hhcmFjdGVyIChhPTEgPiBhID0xKVwiXG4gICAgICAgICAgICBvcmRlcjogMlxuICAgICAgICBhbGlnbkJ5OlxuICAgICAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgICAgICAgZGVmYXVsdDogWyc9PicsICc6PScsICc6JywgJz0nXVxuICAgICAgICAgICAgaXRlbXM6XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiY29uc2lkZXIgdGhlIG9yZGVyLCB0aGUgbGVmdCBtb3N0IG1hdGNoaW5nIHZhbHVlIGlzIHRha2VuIHRvIGNvbXB1dGUgdGhlIGFsaWdubWVudFwiXG4gICAgICAgICAgICBvcmRlcjogMVxuICAgICAgICBhZGRTcGFjZVBvc3RmaXg6XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJpbnNlcnQgc3BhY2UgYWZ0ZXIgdGhlIG1hdGNoaW5nIGNoYXJhY3RlciAoYT0xID4gYT0gMSkgaWYgY2hhcmFjdGVyIGlzIHBhcnQgb2YgdGhlICdhbGlnbm1lbnQgc3BhY2UgY2hhcnMnXCJcbiAgICAgICAgICAgIG9yZGVyOiAzXG5cbiAgICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAgICAgJ2F0b20tYWxpZ25tZW50OmFsaWduJzogLT5cbiAgICAgICAgICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgICAgICAgICAgYWxpZ25MaW5lcyBlZGl0b3JcblxuICAgICAgICAgICAgJ2F0b20tYWxpZ25tZW50OmFsaWduTXVsdGlwbGUnOiAtPlxuICAgICAgICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgICAgICAgICBhbGlnbkxpbmVzTXVsdGlwbGUgZWRpdG9yXG5cbmFsaWduTGluZXMgPSAoZWRpdG9yKSAtPlxuICAgIHNwYWNlQ2hhcnMgICAgICAgPSBhdG9tLmNvbmZpZy5nZXQgJ2F0b20tYWxpZ25tZW50LmFsaWdubWVudFNwYWNlQ2hhcnMnXG4gICAgbWF0Y2hlciAgICAgICAgICA9IGF0b20uY29uZmlnLmdldCAnYXRvbS1hbGlnbm1lbnQuYWxpZ25CeSdcbiAgICBhZGRTcGFjZVBvc3RmaXggID0gYXRvbS5jb25maWcuZ2V0ICdhdG9tLWFsaWdubWVudC5hZGRTcGFjZVBvc3RmaXgnXG4gICAgYSA9IG5ldyBBbGlnbmVyKGVkaXRvciwgc3BhY2VDaGFycywgbWF0Y2hlciwgYWRkU3BhY2VQb3N0Zml4KVxuICAgIGEuYWxpZ24oZmFsc2UpXG4gICAgcmV0dXJuXG5cbmFsaWduTGluZXNNdWx0aXBsZSA9IChlZGl0b3IpIC0+XG4gICAgc3BhY2VDaGFycyAgICAgICA9IGF0b20uY29uZmlnLmdldCAnYXRvbS1hbGlnbm1lbnQuYWxpZ25tZW50U3BhY2VDaGFycydcbiAgICBtYXRjaGVyICAgICAgICAgID0gYXRvbS5jb25maWcuZ2V0ICdhdG9tLWFsaWdubWVudC5hbGlnbkJ5J1xuICAgIGFkZFNwYWNlUG9zdGZpeCAgPSBhdG9tLmNvbmZpZy5nZXQgJ2F0b20tYWxpZ25tZW50LmFkZFNwYWNlUG9zdGZpeCdcbiAgICBhID0gbmV3IEFsaWduZXIoZWRpdG9yLCBzcGFjZUNoYXJzLCBtYXRjaGVyLCBhZGRTcGFjZVBvc3RmaXgpXG4gICAgYS5hbGlnbih0cnVlKVxuICAgIHJldHVyblxuIl19
