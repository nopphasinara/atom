(function() {
  var ExpandSelectionToQuotes, Range;

  Range = require('atom').Range;

  ExpandSelectionToQuotes = (function() {
    function ExpandSelectionToQuotes(editor1) {
      var b, editor, i, index, len, ref;
      this.editor = editor1;
      editor = atom.workspace.getActiveTextEditor();
      this.cursors = editor.getCursorBufferPositions();
      ref = this.cursors;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        b = ref[index];
        this.addSelection(index);
      }
    }

    ExpandSelectionToQuotes.prototype.getCursorPosition = function(index) {
      return this.cursors[index];
    };

    ExpandSelectionToQuotes.prototype.addSelection = function(index) {
      var quoteRange;
      quoteRange = this.getQuoteRange(index);
      if (quoteRange) {
        return this.editor.addSelectionForBufferRange(quoteRange);
      }
    };

    ExpandSelectionToQuotes.prototype.getOpeningQuotePosition = function(index) {
      var quote, range;
      range = new Range(this.editor.buffer.getFirstPosition(), this.getCursorPosition(index));
      quote = false;
      this.editor.buffer.backwardsScanInRange(/[`'"]/g, range, (function(_this) {
        return function(obj) {
          _this.quoteType = obj.matchText;
          obj.stop();
          return quote = obj.range.end;
        };
      })(this));
      return quote;
    };

    ExpandSelectionToQuotes.prototype.getClosingQuotePosition = function(index) {
      var quote, range;
      range = new Range(this.getCursorPosition(index), this.editor.buffer.getEndPosition());
      quote = false;
      this.editor.buffer.scanInRange(/[`'"]/g, range, (function(_this) {
        return function(obj) {
          if (obj.matchText === _this.quoteType) {
            obj.stop();
          }
          return quote = obj.range.start;
        };
      })(this));
      return quote;
    };

    ExpandSelectionToQuotes.prototype.getQuoteRange = function(index) {
      var closing, opening;
      opening = this.getOpeningQuotePosition(index);
      if (opening == null) {
        return false;
      }
      closing = this.getClosingQuotePosition(index);
      if (closing == null) {
        return false;
      }
      return new Range(opening, closing);
    };

    return ExpandSelectionToQuotes;

  })();

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor', 'expand-selection-to-quotes:toggle', function() {
        var paneItem;
        paneItem = atom.workspace.getActivePaneItem();
        return new ExpandSelectionToQuotes(paneItem);
      });
    },
    ExpandSelectionToQuotes: ExpandSelectionToQuotes
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2V4cGFuZC1zZWxlY3Rpb24tdG8tcXVvdGVzL2xpYi9leHBhbmQtc2VsZWN0aW9uLXRvLXF1b3Rlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBYUo7SUFDUyxpQ0FBQyxPQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxTQUFEO01BQ1osTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVcsTUFBTSxDQUFDLHdCQUFQLENBQUE7QUFDWDtBQUFBLFdBQUEscURBQUE7O1FBQ0UsSUFBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkO0FBREY7SUFIVzs7c0NBTWIsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO0FBQ2pCLGFBQU8sSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBO0lBREM7O3NDQUduQixZQUFBLEdBQWMsU0FBQyxLQUFEO0FBQ1osVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsYUFBRCxDQUFlLEtBQWY7TUFDYixJQUFrRCxVQUFsRDtlQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsVUFBbkMsRUFBQTs7SUFGWTs7c0NBSWQsdUJBQUEsR0FBeUIsU0FBQyxLQUFEO0FBQ3ZCLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBSSxLQUFKLENBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWYsQ0FBQSxDQUFWLEVBQTZDLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQixDQUE3QztNQUNSLEtBQUEsR0FBUTtNQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFmLENBQW9DLFFBQXBDLEVBQThDLEtBQTlDLEVBQXFELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO1VBQ25ELEtBQUMsQ0FBQSxTQUFELEdBQWEsR0FBRyxDQUFDO1VBQ2pCLEdBQUcsQ0FBQyxJQUFKLENBQUE7aUJBQ0EsS0FBQSxHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFIaUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJEO2FBSUE7SUFQdUI7O3NDQVN6Qix1QkFBQSxHQUF5QixTQUFDLEtBQUQ7QUFDdkIsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFJLEtBQUosQ0FBVSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkIsQ0FBVixFQUFxQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFmLENBQUEsQ0FBckM7TUFDUixLQUFBLEdBQVE7TUFDUixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFmLENBQTJCLFFBQTNCLEVBQXFDLEtBQXJDLEVBQTRDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO1VBQzFDLElBQWMsR0FBRyxDQUFDLFNBQUosS0FBaUIsS0FBQyxDQUFBLFNBQWhDO1lBQUEsR0FBRyxDQUFDLElBQUosQ0FBQSxFQUFBOztpQkFDQSxLQUFBLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUZ3QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUM7YUFHQTtJQU51Qjs7c0NBUXpCLGFBQUEsR0FBZSxTQUFDLEtBQUQ7QUFDYixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixLQUF6QjtNQUNWLElBQW9CLGVBQXBCO0FBQUEsZUFBTyxNQUFQOztNQUNBLE9BQUEsR0FBVSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsS0FBekI7TUFDVixJQUFvQixlQUFwQjtBQUFBLGVBQU8sTUFBUDs7YUFDQSxJQUFJLEtBQUosQ0FBVSxPQUFWLEVBQW1CLE9BQW5CO0lBTGE7Ozs7OztFQU9qQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLG1DQUF0QyxFQUEyRSxTQUFBO0FBQ3pFLFlBQUE7UUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBO2VBQ1gsSUFBSSx1QkFBSixDQUE0QixRQUE1QjtNQUZ5RSxDQUEzRTtJQURRLENBQVY7SUFLQSx1QkFBQSxFQUF5Qix1QkFMekI7O0FBcERGIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbiMgV2l0aCBjdXJzb3IgYXQgWCwgdGhlIGNvbW1hbmQgc2hvdWxkIHNlbGVjdCB0aGUgc3RyaW5nOlxuIyBcIkhlcmUgaXMgdGhlIFggY3Vyc29yXCJcbiNcbiMgV2l0aCBjdXJzb3IgYXQgWCwgdGhlIGNvbW1hbmQgc2hvdWxkIHNlbGVjdCB0aGUgc2luZ2xlIHF1b3RlZCBzdHJpbmc6XG4jIFwiSGVyZSBpcyAndGhlIFggY3Vyc29yJyBub3dcIlxuI1xuIyBUaGlzIG9uZSBkb2Vzbid0IHdvcmsgcmlnaHQgeWV0LiBXZSdyZSBhc3N1bWluZyB0aGF0IHRoZSBmaXJzdCBxdW90ZSBpc1xuIyB0aGUgb25lIHdlIHdhbnQsIHdoaWNoIGlzbid0IGFsd2F5cyB0cnVlLlxuIyBXaXRoIGN1cnNvciBhdCBYLCB0aGUgY29tbWFuZCBzaG91bGQgc2VsZWN0IHRoZSBkb3VibGUgcXVvdGVkIHN0cmluZzpcbiMgXCJIZXJlIHRoZSBjdXJzb3IgaXMgJ291dHNpZGUnIHRoZSBYIHNlbGVjdGlvblwiXG5cbmNsYXNzIEV4cGFuZFNlbGVjdGlvblRvUXVvdGVzXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvcikgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAY3Vyc29ycyA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKVxuICAgIGZvciBiLCBpbmRleCBpbiBAY3Vyc29yc1xuICAgICAgQGFkZFNlbGVjdGlvbihpbmRleClcblxuICBnZXRDdXJzb3JQb3NpdGlvbjogKGluZGV4KSAtPlxuICAgIHJldHVybiBAY3Vyc29yc1tpbmRleF1cblxuICBhZGRTZWxlY3Rpb246IChpbmRleCkgLT5cbiAgICBxdW90ZVJhbmdlID0gQGdldFF1b3RlUmFuZ2UoaW5kZXgpXG4gICAgQGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShxdW90ZVJhbmdlKSBpZiBxdW90ZVJhbmdlXG5cbiAgZ2V0T3BlbmluZ1F1b3RlUG9zaXRpb246IChpbmRleCkgLT5cbiAgICByYW5nZSA9IG5ldyBSYW5nZSBAZWRpdG9yLmJ1ZmZlci5nZXRGaXJzdFBvc2l0aW9uKCksIEBnZXRDdXJzb3JQb3NpdGlvbihpbmRleClcbiAgICBxdW90ZSA9IGZhbHNlXG4gICAgQGVkaXRvci5idWZmZXIuYmFja3dhcmRzU2NhbkluUmFuZ2UgL1tgJ1wiXS9nLCByYW5nZSwgKG9iaikgPT5cbiAgICAgIEBxdW90ZVR5cGUgPSBvYmoubWF0Y2hUZXh0XG4gICAgICBvYmouc3RvcCgpXG4gICAgICBxdW90ZSA9IG9iai5yYW5nZS5lbmRcbiAgICBxdW90ZVxuXG4gIGdldENsb3NpbmdRdW90ZVBvc2l0aW9uOiAoaW5kZXgpIC0+XG4gICAgcmFuZ2UgPSBuZXcgUmFuZ2UgQGdldEN1cnNvclBvc2l0aW9uKGluZGV4KSwgQGVkaXRvci5idWZmZXIuZ2V0RW5kUG9zaXRpb24oKVxuICAgIHF1b3RlID0gZmFsc2VcbiAgICBAZWRpdG9yLmJ1ZmZlci5zY2FuSW5SYW5nZSAvW2AnXCJdL2csIHJhbmdlLCAob2JqKSA9PlxuICAgICAgb2JqLnN0b3AoKSBpZiBvYmoubWF0Y2hUZXh0IGlzIEBxdW90ZVR5cGVcbiAgICAgIHF1b3RlID0gb2JqLnJhbmdlLnN0YXJ0XG4gICAgcXVvdGVcblxuICBnZXRRdW90ZVJhbmdlOiAoaW5kZXgpIC0+XG4gICAgb3BlbmluZyA9IEBnZXRPcGVuaW5nUXVvdGVQb3NpdGlvbihpbmRleClcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIG9wZW5pbmc/XG4gICAgY2xvc2luZyA9IEBnZXRDbG9zaW5nUXVvdGVQb3NpdGlvbihpbmRleClcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGNsb3Npbmc/XG4gICAgbmV3IFJhbmdlIG9wZW5pbmcsIGNsb3NpbmdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdleHBhbmQtc2VsZWN0aW9uLXRvLXF1b3Rlczp0b2dnbGUnLCAtPlxuICAgICAgcGFuZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICBuZXcgRXhwYW5kU2VsZWN0aW9uVG9RdW90ZXMocGFuZUl0ZW0pXG5cbiAgRXhwYW5kU2VsZWN0aW9uVG9RdW90ZXM6IEV4cGFuZFNlbGVjdGlvblRvUXVvdGVzXG4iXX0=
