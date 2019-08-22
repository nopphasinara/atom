(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor1) {
      this.editor = editor1;
    }

    RangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeForEntireBuffer()];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    RangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    RangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    RangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXByZXR0aWZ5L2xpYi9yYW5nZS1maW5kZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFSixXQUFDLENBQUEsU0FBRCxHQUFZLFNBQUMsTUFBRDthQUNWLElBQUksV0FBSixDQUFnQixNQUFoQixDQUF1QixDQUFDLE1BQXhCLENBQUE7SUFEVTs7SUFJQyxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7SUFBRDs7MEJBR2IsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsZUFBRCxDQUFBO01BQ2xCLElBQUcsZUFBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO2VBQ0UsQ0FBQyxJQUFDLENBQUEsNEJBQUQsQ0FBQSxDQUFELEVBREY7T0FBQSxNQUFBO2VBR0UsZUFBZSxDQUFDLEdBQWhCLENBQW9CLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsY0FBRDttQkFDbEIsS0FBQyxDQUFBLGlCQUFELENBQW1CLGNBQW5CO1VBRGtCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixFQUhGOztJQUZNOzswQkFTUixlQUFBLEdBQWlCLFNBQUE7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaUMsQ0FBQyxNQUFsQyxDQUF5QyxTQUFDLEtBQUQ7ZUFDdkMsQ0FBSSxLQUFLLENBQUMsT0FBTixDQUFBO01BRG1DLENBQXpDO0lBRGU7OzBCQUtqQiw0QkFBQSxHQUE4QixTQUFBO2FBQzVCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsUUFBcEIsQ0FBQTtJQUQ0Qjs7MEJBSTlCLGlCQUFBLEdBQW1CLFNBQUMsY0FBRDtBQUNqQixVQUFBO01BQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxLQUFLLENBQUM7TUFDaEMsUUFBQSxHQUFXO01BQ1gsTUFBQSxHQUFZLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBbkIsS0FBNkIsQ0FBaEMsR0FDUCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQW5CLEdBQXlCLENBRGxCLEdBR1AsY0FBYyxDQUFDLEdBQUcsQ0FBQztNQUNyQixNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUE3QixDQUFvQyxDQUFDO2FBRTlDLElBQUksS0FBSixDQUFVLENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FBVixFQUFnQyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQWhDO0lBVGlCOzs7OztBQTlCckIiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUmFuZ2VGaW5kZXJcbiAgIyBQdWJsaWNcbiAgQHJhbmdlc0ZvcjogKGVkaXRvcikgLT5cbiAgICBuZXcgUmFuZ2VGaW5kZXIoZWRpdG9yKS5yYW5nZXMoKVxuXG4gICMgUHVibGljXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cblxuICAjIFB1YmxpY1xuICByYW5nZXM6IC0+XG4gICAgc2VsZWN0aW9uUmFuZ2VzID0gQHNlbGVjdGlvblJhbmdlcygpXG4gICAgaWYgc2VsZWN0aW9uUmFuZ2VzLmxlbmd0aCBpcyAwXG4gICAgICBbQHNvcnRhYmxlUmFuZ2VGb3JFbnRpcmVCdWZmZXIoKV1cbiAgICBlbHNlXG4gICAgICBzZWxlY3Rpb25SYW5nZXMubWFwIChzZWxlY3Rpb25SYW5nZSkgPT5cbiAgICAgICAgQHNvcnRhYmxlUmFuZ2VGcm9tKHNlbGVjdGlvblJhbmdlKVxuXG4gICMgSW50ZXJuYWxcbiAgc2VsZWN0aW9uUmFuZ2VzOiAtPlxuICAgIEBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKS5maWx0ZXIgKHJhbmdlKSAtPlxuICAgICAgbm90IHJhbmdlLmlzRW1wdHkoKVxuXG4gICMgSW50ZXJuYWxcbiAgc29ydGFibGVSYW5nZUZvckVudGlyZUJ1ZmZlcjogLT5cbiAgICBAZWRpdG9yLmdldEJ1ZmZlcigpLmdldFJhbmdlKClcblxuICAjIEludGVybmFsXG4gIHNvcnRhYmxlUmFuZ2VGcm9tOiAoc2VsZWN0aW9uUmFuZ2UpIC0+XG4gICAgc3RhcnRSb3cgPSBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3dcbiAgICBzdGFydENvbCA9IDBcbiAgICBlbmRSb3cgPSBpZiBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uID09IDBcbiAgICAgIHNlbGVjdGlvblJhbmdlLmVuZC5yb3cgLSAxXG4gICAgZWxzZVxuICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLnJvd1xuICAgIGVuZENvbCA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZW5kUm93KS5sZW5ndGhcblxuICAgIG5ldyBSYW5nZSBbc3RhcnRSb3csIHN0YXJ0Q29sXSwgW2VuZFJvdywgZW5kQ29sXVxuIl19
