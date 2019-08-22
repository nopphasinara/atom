Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.align = align;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _atom = require('atom');

'use babel';
'use strict';

function activate(state) {
  this.subscriptions = new _atom.CompositeDisposable();
  this.subscriptions.add(atom.commands.add('atom-workspace', {
    'simple-align:align': this.align
  }));
}

;

function deactivate() {
  this.subscriptions.dispose();
}

;

function align() {
  var editor = atom.workspace.getActiveTextEditor();
  var buffer = editor.getBuffer();
  var cursors = editor.getCursors();
  var cols = cursors.map(function (c) {
    return c.getBufferColumn();
  });
  var rows = cursors.map(function (c) {
    return c.getBufferRow();
  });
  var texts = rows.map(function (r) {
    return editor.lineTextForBufferRow(r);
  });
  var maxCol = Math.max.apply(Math, _toConsumableArray(cols));

  // Add the necessary number of chars before the
  // cursor in order to align them.
  var aligned = texts.map(function (text, i) {
    var col = cols[i];
    var delta = maxCol - col;
    var start = text.slice(0, col);
    var mid = ' '.repeat(delta);
    var end = text.slice(col);
    return '' + start + mid + end;
  });

  // Perform in a single transaction to ensure that
  // undoing will undo the whole thing. Maybe it
  // helps perf, too?
  // TODO: Is there a way to improve perf on this?
  // Can take >70ms depending on cursor count.
  buffer.transact(function () {
    // Replace every line with the aligned text
    aligned.forEach(function (text, i) {
      var row = rows[i];
      var range = [[row, 0], [row, Infinity]];
      buffer.setTextInRange(range, text);
    });

    // Move every cursor to where the alignment occurred
    cursors.forEach(function (cursor) {
      cursor.moveToBeginningOfLine();
      cursor.moveRight(maxCol);
    });
  });
}

;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc2ltcGxlLWFsaWduL2xpYi9zaW1wbGUtYWxpZ24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O29CQUdvQyxNQUFNOztBQUgxQyxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7O0FBSU4sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQzlCLE1BQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsTUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsd0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUs7R0FDakMsQ0FBQyxDQUFDLENBQUM7Q0FDTDs7QUFBQSxDQUFDOztBQUVLLFNBQVMsVUFBVSxHQUFHO0FBQzNCLE1BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDOUI7O0FBQUEsQ0FBQzs7QUFFSyxTQUFTLEtBQUssR0FBRztBQUN0QixNQUFJLE1BQU0sR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDbkQsTUFBSSxNQUFNLEdBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pDLE1BQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQyxNQUFJLElBQUksR0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztXQUFLLENBQUMsQ0FBQyxlQUFlLEVBQUU7R0FBQSxDQUFDLENBQUM7QUFDdEQsTUFBSSxJQUFJLEdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUM7V0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFO0dBQUEsQ0FBQyxDQUFDO0FBQ25ELE1BQUksS0FBSyxHQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1dBQUssTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztHQUFBLENBQUMsQ0FBQztBQUM5RCxNQUFJLE1BQU0sR0FBSSxJQUFJLENBQUMsR0FBRyxNQUFBLENBQVIsSUFBSSxxQkFBUSxJQUFJLEVBQUMsQ0FBQzs7OztBQUloQyxNQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUMsRUFBSztBQUNuQyxRQUFJLEdBQUcsR0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsUUFBSSxLQUFLLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUN6QixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQixRQUFJLEdBQUcsR0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFFBQUksR0FBRyxHQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsZ0JBQVUsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUc7R0FDL0IsQ0FBQyxDQUFDOzs7Ozs7O0FBT0gsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFNOztBQUVwQixXQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUMsRUFBSztBQUMzQixVQUFJLEdBQUcsR0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsVUFBSSxLQUFLLEdBQUcsQ0FBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBRSxDQUFDO0FBQzFDLFlBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BDLENBQUMsQ0FBQzs7O0FBR0gsV0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUMxQixZQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUMvQixZQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzFCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKOztBQUFBLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zaW1wbGUtYWxpZ24vbGliL3NpbXBsZS1hbGlnbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZSkge1xuICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAnc2ltcGxlLWFsaWduOmFsaWduJzogdGhpcy5hbGlnblxuICB9KSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGlnbigpIHtcbiAgbGV0IGVkaXRvciAgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIGxldCBidWZmZXIgID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICBsZXQgY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JzKCk7XG4gIGxldCBjb2xzICAgID0gY3Vyc29ycy5tYXAoKGMpID0+IGMuZ2V0QnVmZmVyQ29sdW1uKCkpO1xuICBsZXQgcm93cyAgICA9IGN1cnNvcnMubWFwKChjKSA9PiBjLmdldEJ1ZmZlclJvdygpKTtcbiAgbGV0IHRleHRzICAgPSByb3dzLm1hcCgocikgPT4gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHIpKTtcbiAgbGV0IG1heENvbCAgPSBNYXRoLm1heCguLi5jb2xzKTtcblxuICAvLyBBZGQgdGhlIG5lY2Vzc2FyeSBudW1iZXIgb2YgY2hhcnMgYmVmb3JlIHRoZVxuICAvLyBjdXJzb3IgaW4gb3JkZXIgdG8gYWxpZ24gdGhlbS5cbiAgbGV0IGFsaWduZWQgPSB0ZXh0cy5tYXAoKHRleHQsIGkpID0+IHtcbiAgICBsZXQgY29sICAgPSBjb2xzW2ldO1xuICAgIGxldCBkZWx0YSA9IG1heENvbCAtIGNvbDtcbiAgICBsZXQgc3RhcnQgPSB0ZXh0LnNsaWNlKDAsIGNvbCk7XG4gICAgbGV0IG1pZCAgID0gJyAnLnJlcGVhdChkZWx0YSk7XG4gICAgbGV0IGVuZCAgID0gdGV4dC5zbGljZShjb2wpO1xuICAgIHJldHVybiBgJHtzdGFydH0ke21pZH0ke2VuZH1gO1xuICB9KTtcblxuICAvLyBQZXJmb3JtIGluIGEgc2luZ2xlIHRyYW5zYWN0aW9uIHRvIGVuc3VyZSB0aGF0XG4gIC8vIHVuZG9pbmcgd2lsbCB1bmRvIHRoZSB3aG9sZSB0aGluZy4gTWF5YmUgaXRcbiAgLy8gaGVscHMgcGVyZiwgdG9vP1xuICAvLyBUT0RPOiBJcyB0aGVyZSBhIHdheSB0byBpbXByb3ZlIHBlcmYgb24gdGhpcz9cbiAgLy8gQ2FuIHRha2UgPjcwbXMgZGVwZW5kaW5nIG9uIGN1cnNvciBjb3VudC5cbiAgYnVmZmVyLnRyYW5zYWN0KCgpID0+IHtcbiAgICAvLyBSZXBsYWNlIGV2ZXJ5IGxpbmUgd2l0aCB0aGUgYWxpZ25lZCB0ZXh0XG4gICAgYWxpZ25lZC5mb3JFYWNoKCh0ZXh0LCBpKSA9PiB7XG4gICAgICBsZXQgcm93ICAgPSByb3dzW2ldO1xuICAgICAgbGV0IHJhbmdlID0gWyBbcm93LCAwXSwgW3JvdywgSW5maW5pdHldIF07XG4gICAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UocmFuZ2UsIHRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gTW92ZSBldmVyeSBjdXJzb3IgdG8gd2hlcmUgdGhlIGFsaWdubWVudCBvY2N1cnJlZFxuICAgIGN1cnNvcnMuZm9yRWFjaCgoY3Vyc29yKSA9PiB7XG4gICAgICBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKCk7XG4gICAgICBjdXJzb3IubW92ZVJpZ2h0KG1heENvbCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiJdfQ==