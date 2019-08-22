(function() {
  var Tabularize, _;

  _ = require('underscore');

  module.exports = Tabularize = (function() {
    function Tabularize() {}

    Tabularize.tabularize = function(separator, editor) {
      _(editor.getSelections()).each(function(selection) {
        var first_row, last_column, last_row, range;
        range = selection.getBufferRange();
        first_row = range.start.row;
        last_row = range.end.row;
        last_column = range.end.column;
        selection.setBufferRange([[first_row, 0], [last_row, last_column]]);
        if (!selection.isReversed()) {
          return selection.selectToEndOfLine();
        }
      });
      return editor.mutateSelectedText(function(selection, index) {
        var i, lines, matches, num_columns, padded_columns, padded_lines, result, separator_regex, stripped_lines;
        separator_regex = RegExp(separator, 'g');
        lines = selection.getText().split("\n");
        matches = [];
        lines = _(lines).map(function(line) {
          matches.push(line.match(separator_regex) || "");
          return line.split(separator_regex);
        });
        stripped_lines = Tabularize.stripSpaces(lines);
        num_columns = _.chain(stripped_lines).map(function(cells) {
          return cells.length;
        }).max().value();
        padded_columns = (function() {
          var j, ref, results;
          results = [];
          for (i = j = 0, ref = num_columns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            results.push(Tabularize.paddingColumn(i, stripped_lines));
          }
          return results;
        })();
        padded_lines = (function() {
          var j, ref, results;
          results = [];
          for (i = j = 0, ref = lines.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            results.push(Tabularize.paddedLine(i, padded_columns));
          }
          return results;
        })();
        result = _.chain(padded_lines).zip(matches).map(function(e) {
          var line;
          line = _(e).first();
          matches = _(e).last();
          line = _.chain(line).zip(matches).flatten().compact().value().join(' ');
          return Tabularize.stripTrailingWhitespace(line);
        }).value().join("\n");
        return selection.insertText(result);
      });
    };

    Tabularize.leftAlign = function(string, fieldWidth) {
      var right, spaces;
      spaces = fieldWidth - string.length;
      right = spaces;
      return "" + string + (Tabularize.repeatPadding(right));
    };

    Tabularize.stripTrailingWhitespace = function(text) {
      return text.replace(/\s+$/g, "");
    };

    Tabularize.repeatPadding = function(size) {
      return Array(size + 1).join(' ');
    };

    Tabularize.paddingColumn = function(col_index, matrix) {
      var cell, cell_size, column, j, len, results;
      cell_size = 0;
      column = _(matrix).map(function(line) {
        if (line.length > col_index) {
          if (cell_size < line[col_index].length) {
            cell_size = line[col_index].length;
          }
          return line[col_index];
        } else {
          return "";
        }
      });
      results = [];
      for (j = 0, len = column.length; j < len; j++) {
        cell = column[j];
        results.push(Tabularize.leftAlign(cell, cell_size));
      }
      return results;
    };

    Tabularize.paddedLine = function(line_index, columns) {
      return _.chain(columns).map(function(column) {
        return column[line_index];
      }).compact().value();
    };

    Tabularize.stripSpaces = function(lines) {
      return _.map(lines, function(cells) {
        return cells = _.map(cells, function(cell, i) {
          if (i === 0) {
            return Tabularize.stripTrailingWhitespace(cell);
          } else {
            return cell.trim();
          }
        });
      });
    };

    return Tabularize;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90YWJ1bGFyaXplL2xpYi90YWJ1bGFyaXplLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7OztJQUVKLFVBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxTQUFELEVBQVksTUFBWjtNQUVYLENBQUEsQ0FBRSxNQUFNLENBQUMsYUFBUCxDQUFBLENBQUYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixTQUFDLFNBQUQ7QUFDN0IsWUFBQTtRQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsY0FBVixDQUFBO1FBQ1IsU0FBQSxHQUFZLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDeEIsUUFBQSxHQUFXLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsV0FBQSxHQUFjLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDeEIsU0FBUyxDQUFDLGNBQVYsQ0FBeUIsQ0FBQyxDQUFDLFNBQUQsRUFBVyxDQUFYLENBQUQsRUFBZSxDQUFDLFFBQUQsRUFBVSxXQUFWLENBQWYsQ0FBekI7UUFDQSxJQUFBLENBQU8sU0FBUyxDQUFDLFVBQVYsQ0FBQSxDQUFQO2lCQUNFLFNBQVMsQ0FBQyxpQkFBVixDQUFBLEVBREY7O01BTjZCLENBQS9CO2FBU0EsTUFBTSxDQUFDLGtCQUFQLENBQTBCLFNBQUMsU0FBRCxFQUFZLEtBQVo7QUFDeEIsWUFBQTtRQUFBLGVBQUEsR0FBa0IsTUFBQSxDQUFPLFNBQVAsRUFBaUIsR0FBakI7UUFDbEIsS0FBQSxHQUFRLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBbUIsQ0FBQyxLQUFwQixDQUEwQixJQUExQjtRQUNSLE9BQUEsR0FBVTtRQUdWLEtBQUEsR0FBUSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMs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LENBQVEsT0FBUixDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsTUFBRDtlQUNuQixNQUFPLENBQUEsVUFBQTtNQURZLENBQXJCLENBRUEsQ0FBQyxPQUZELENBQUEsQ0FHQSxDQUFDLEtBSEQsQ0FBQTtJQUZXOztJQU9iLFVBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO2FBR1osQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFOLEVBQWEsU0FBQyxLQUFEO2VBQ1gsS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFGLENBQU0sS0FBTixFQUFhLFNBQUMsSUFBRCxFQUFPLENBQVA7VUFDbkIsSUFBRyxDQUFBLEtBQUssQ0FBUjttQkFDRSxVQUFVLENBQUMsdUJBQVgsQ0FBbUMsSUFBbkMsRUFERjtXQUFBLE1BQUE7bUJBR0UsSUFBSSxDQUFDLElBQUwsQ0FBQSxFQUhGOztRQURtQixDQUFiO01BREcsQ0FBYjtJQUhZOzs7OztBQXZGbEIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBUYWJ1bGFyaXplXG5cbiAgICBAdGFidWxhcml6ZTogKHNlcGFyYXRvciwgZWRpdG9yKSAtPlxuICAgICAgIyBDaGFuZ2Ugc2VsZWN0aW9ucyB0byBlbnRpcmUgbGluZXMgaW5zaWRlIHNlbGVjdGlvbnNcbiAgICAgIF8oZWRpdG9yLmdldFNlbGVjdGlvbnMoKSkuZWFjaCAoc2VsZWN0aW9uKSAtPlxuICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgIGZpcnN0X3JvdyA9IHJhbmdlLnN0YXJ0LnJvd1xuICAgICAgICBsYXN0X3JvdyA9IHJhbmdlLmVuZC5yb3dcbiAgICAgICAgbGFzdF9jb2x1bW4gPSByYW5nZS5lbmQuY29sdW1uXG4gICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShbW2ZpcnN0X3JvdywwXSxbbGFzdF9yb3csbGFzdF9jb2x1bW5dXSlcbiAgICAgICAgdW5sZXNzIHNlbGVjdGlvbi5pc1JldmVyc2VkKClcbiAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0VG9FbmRPZkxpbmUoKVxuXG4gICAgICBlZGl0b3IubXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24sIGluZGV4KSAtPlxuICAgICAgICBzZXBhcmF0b3JfcmVnZXggPSBSZWdFeHAoc2VwYXJhdG9yLCdnJylcbiAgICAgICAgbGluZXMgPSBzZWxlY3Rpb24uZ2V0VGV4dCgpLnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIG1hdGNoZXMgPSBbXVxuXG4gICAgICAgICMgc3BsaXQgbGluZXMgYW5kIHNhdmUgdGhlIG1hdGNoZXNcbiAgICAgICAgbGluZXMgPSBfKGxpbmVzKS5tYXAgKGxpbmUpIC0+XG4gICAgICAgICAgbWF0Y2hlcy5wdXNoIGxpbmUubWF0Y2goc2VwYXJhdG9yX3JlZ2V4KSB8fCBcIlwiXG4gICAgICAgICAgbGluZS5zcGxpdChzZXBhcmF0b3JfcmVnZXgpXG5cbiAgICAgICAgIyBzdHJpcCBzcGFjZXMgZnJvbSBjZWxsc1xuICAgICAgICBzdHJpcHBlZF9saW5lcyA9IFRhYnVsYXJpemUuc3RyaXBTcGFjZXMobGluZXMpXG5cbiAgICAgICAgbnVtX2NvbHVtbnMgPSBfLmNoYWluKHN0cmlwcGVkX2xpbmVzKS5tYXAgKGNlbGxzKSAtPlxuICAgICAgICAgIGNlbGxzLmxlbmd0aFxuICAgICAgICAubWF4KClcbiAgICAgICAgLnZhbHVlKClcblxuICAgICAgICBwYWRkZWRfY29sdW1ucyA9IChUYWJ1bGFyaXplLnBhZGRpbmdDb2x1bW4oaSwgc3RyaXBwZWRfbGluZXMpIGZvciBpIGluIFswLi5udW1fY29sdW1ucy0xXSlcblxuICAgICAgICBwYWRkZWRfbGluZXMgPSAoVGFidWxhcml6ZS5wYWRkZWRMaW5lKGksIHBhZGRlZF9jb2x1bW5zKSBmb3IgaSBpbiBbMC4ubGluZXMubGVuZ3RoLTFdKVxuXG4gICAgICAgICMgQ29tYmluZSBwYWRkZWQgbGluZXMgYW5kIHByZXZpb3VzbHkgc2F2ZWQgbWF0Y2hlcyBhbmQgam9pbiB0aGVtIGJhY2tcbiAgICAgICAgcmVzdWx0ID0gXy5jaGFpbihwYWRkZWRfbGluZXMpLnppcChtYXRjaGVzKS5tYXAgKGUpIC0+XG4gICAgICAgICAgbGluZSA9IF8oZSkuZmlyc3QoKVxuICAgICAgICAgIG1hdGNoZXMgPSBfKGUpLmxhc3QoKVxuICAgICAgICAgIGxpbmUgPSBfLmNoYWluKGxpbmUpXG4gICAgICAgICAgICAuemlwKG1hdGNoZXMpXG4gICAgICAgICAgICAuZmxhdHRlbigpXG4gICAgICAgICAgICAuY29tcGFjdCgpXG4gICAgICAgICAgICAudmFsdWUoKVxuICAgICAgICAgICAgLmpvaW4oJyAnKVxuICAgICAgICAgIFRhYnVsYXJpemUuc3RyaXBUcmFpbGluZ1doaXRlc3BhY2UobGluZSlcbiAgICAgICAgLnZhbHVlKCkuam9pbihcIlxcblwiKVxuXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHJlc3VsdClcblxuICAgICMgTGVmdCBhbGlnbiAnc3RyaW5nJyBpbiBhIGZpZWxkIG9mIHNpemUgJ2ZpZWxkd2lkdGgnXG4gICAgQGxlZnRBbGlnbjogKHN0cmluZywgZmllbGRXaWR0aCkgLT5cbiAgICAgIHNwYWNlcyA9IGZpZWxkV2lkdGggLSBzdHJpbmcubGVuZ3RoXG4gICAgICByaWdodCA9IHNwYWNlc1xuICAgICAgXCIje3N0cmluZ30je1RhYnVsYXJpemUucmVwZWF0UGFkZGluZyhyaWdodCl9XCJcblxuICAgIEBzdHJpcFRyYWlsaW5nV2hpdGVzcGFjZTogKHRleHQpIC0+XG4gICAgICB0ZXh0LnJlcGxhY2UgL1xccyskL2csIFwiXCJcblxuICAgIEByZXBlYXRQYWRkaW5nOiAoc2l6ZSkgLT5cbiAgICAgIEFycmF5KHNpemUrMSkuam9pbiAnICdcblxuICAgICMgUGFkIGNlbGxzIG9mIHRoZSAjbnRoIGNvbHVtblxuICAgIEBwYWRkaW5nQ29sdW1uOiAoY29sX2luZGV4LCBtYXRyaXgpIC0+XG4gICAgICAjIEV4dHJhY3QgdGhlICNudGggY29sdW1uLCBleHRyYWN0IHRoZSBiaWdnZXN0IGNlbGwgd2hpbGUgYXQgaXRcbiAgICAgIGNlbGxfc2l6ZSA9IDBcbiAgICAgIGNvbHVtbiA9IF8obWF0cml4KS5tYXAgKGxpbmUpIC0+XG4gICAgICAgIGlmIGxpbmUubGVuZ3RoID4gY29sX2luZGV4XG4gICAgICAgICAgY2VsbF9zaXplID0gbGluZVtjb2xfaW5kZXhdLmxlbmd0aCBpZiBjZWxsX3NpemUgPCBsaW5lW2NvbF9pbmRleF0ubGVuZ3RoXG4gICAgICAgICAgbGluZVtjb2xfaW5kZXhdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBcIlwiXG5cbiAgICAgICMgUGFkIHRoZSBjZWxsc1xuICAgICAgKFRhYnVsYXJpemUubGVmdEFsaWduKGNlbGwsIGNlbGxfc2l6ZSkgZm9yIGNlbGwgaW4gY29sdW1uKVxuXG4gICAgIyBFeHRyYWN0IHRoZSAjbnRoIGxpbmVcbiAgICBAcGFkZGVkTGluZTogKGxpbmVfaW5kZXgsIGNvbHVtbnMpIC0+XG4gICAgICAjIGV4dHJhY3QgI250aCBsaW5lLCBmaWx0ZXIgbnVsbCB2YWx1ZXMgYW5kIHJldHVyblxuICAgICAgXy5jaGFpbihjb2x1bW5zKS5tYXAgKGNvbHVtbikgLT5cbiAgICAgICAgY29sdW1uW2xpbmVfaW5kZXhdXG4gICAgICAuY29tcGFjdCgpXG4gICAgICAudmFsdWUoKVxuXG4gICAgQHN0cmlwU3BhY2VzOiAobGluZXMpIC0+XG4gICAgICAjIFN0cmlwIHNwYWNlc1xuICAgICAgIyAgIC0gRG9uJ3Qgc3RyaXAgbGVhZGluZyBzcGFjZXMgZnJvbSB0aGUgZmlyc3QgZWxlbWVudDsgd2UgbGlrZSBpbmRlbnRpbmcuXG4gICAgICBfLm1hcCBsaW5lcywgKGNlbGxzKSAtPlxuICAgICAgICBjZWxscyA9IF8ubWFwIGNlbGxzLCAoY2VsbCwgaSkgLT5cbiAgICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICAgIFRhYnVsYXJpemUuc3RyaXBUcmFpbGluZ1doaXRlc3BhY2UoY2VsbClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjZWxsLnRyaW0oKVxuIl19
