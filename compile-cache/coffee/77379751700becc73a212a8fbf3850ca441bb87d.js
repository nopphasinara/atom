(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getTable = function(todos) {
      var key, md, out, todo;
      md = "| " + (((function() {
        var i, len, ref, results;
        ref = this.showInTable;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          results.push(key);
        }
        return results;
      }).call(this)).join(' | ')) + " |\n";
      md += "|" + (Array(md.length - 2).join('-')) + "|\n";
      return md + ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = todos.length; i < len; i++) {
          todo = todos[i];
          out = '|' + todo.getMarkdownArray(this.showInTable).join(' |');
          results.push(out + " |\n");
        }
        return results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var out, todo;
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = todos.length; i < len; i++) {
          todo = todos[i];
          out = '-' + todo.getMarkdownArray(this.showInTable).join('');
          if (out === '-') {
            out = "- No details";
          }
          results.push(out + "\n");
        }
        return results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.markdown = function(todos) {
      if (atom.config.get('todo-show.exportAs') === 'Table') {
        return this.getTable(todos);
      } else {
        return this.getList(todos);
      }
    };

    return TodosMarkdown;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbWFya2Rvd24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsdUJBQUE7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEI7SUFESjs7NEJBR2IsUUFBQSxHQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxFQUFBLEdBQU0sSUFBQSxHQUFJLENBQUM7O0FBQUM7QUFBQTthQUFBLHFDQUFBOzt1QkFBNkI7QUFBN0I7O21CQUFELENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsS0FBeEMsQ0FBRCxDQUFKLEdBQW9EO01BQzFELEVBQUEsSUFBTSxHQUFBLEdBQUcsQ0FBQyxLQUFBLENBQU0sRUFBRSxDQUFDLE1BQUgsR0FBVSxDQUFoQixDQUFrQixDQUFDLElBQW5CLENBQXdCLEdBQXhCLENBQUQsQ0FBSCxHQUFpQzthQUN2QyxFQUFBLEdBQUs7O0FBQUM7YUFBQSx1Q0FBQTs7VUFDSixHQUFBLEdBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxnQkFBTCxDQUFzQixJQUFDLENBQUEsV0FBdkIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxJQUF6Qzt1QkFDVCxHQUFELEdBQUs7QUFGSDs7bUJBQUQsQ0FHSixDQUFDLElBSEcsQ0FHRSxFQUhGO0lBSEc7OzRCQVFWLE9BQUEsR0FBUyxTQUFDLEtBQUQ7QUFDUCxVQUFBO2FBQUE7O0FBQUM7YUFBQSx1Q0FBQTs7VUFDQyxHQUFBLEdBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxnQkFBTCxDQUFzQixJQUFDLENBQUEsV0FBdkIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxFQUF6QztVQUNaLElBQXdCLEdBQUEsS0FBTyxHQUEvQjtZQUFBLEdBQUEsR0FBTSxlQUFOOzt1QkFDRyxHQUFELEdBQUs7QUFIUjs7bUJBQUQsQ0FJQyxDQUFDLElBSkYsQ0FJTyxFQUpQO0lBRE87OzRCQU9ULFFBQUEsR0FBVSxTQUFDLEtBQUQ7TUFDUixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBQSxLQUF5QyxPQUE1QztlQUNFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBVCxFQUhGOztJQURROzs7OztBQXBCWiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRvZG9zTWFya2Rvd25cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHNob3dJblRhYmxlID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc2hvd0luVGFibGUnKVxuXG4gIGdldFRhYmxlOiAodG9kb3MpIC0+XG4gICAgbWQgPSAgXCJ8ICN7KGZvciBrZXkgaW4gQHNob3dJblRhYmxlIHRoZW4ga2V5KS5qb2luKCcgfCAnKX0gfFxcblwiXG4gICAgbWQgKz0gXCJ8I3tBcnJheShtZC5sZW5ndGgtMikuam9pbignLScpfXxcXG5cIlxuICAgIG1kICsgKGZvciB0b2RvIGluIHRvZG9zXG4gICAgICBvdXQgPSAnfCcgKyB0b2RvLmdldE1hcmtkb3duQXJyYXkoQHNob3dJblRhYmxlKS5qb2luKCcgfCcpXG4gICAgICBcIiN7b3V0fSB8XFxuXCJcbiAgICApLmpvaW4oJycpXG5cbiAgZ2V0TGlzdDogKHRvZG9zKSAtPlxuICAgIChmb3IgdG9kbyBpbiB0b2Rvc1xuICAgICAgb3V0ID0gJy0nICsgdG9kby5nZXRNYXJrZG93bkFycmF5KEBzaG93SW5UYWJsZSkuam9pbignJylcbiAgICAgIG91dCA9IFwiLSBObyBkZXRhaWxzXCIgaWYgb3V0IGlzICctJ1xuICAgICAgXCIje291dH1cXG5cIlxuICAgICkuam9pbignJylcblxuICBtYXJrZG93bjogKHRvZG9zKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmV4cG9ydEFzJykgaXMgJ1RhYmxlJ1xuICAgICAgQGdldFRhYmxlIHRvZG9zXG4gICAgZWxzZVxuICAgICAgQGdldExpc3QgdG9kb3NcbiJdfQ==
