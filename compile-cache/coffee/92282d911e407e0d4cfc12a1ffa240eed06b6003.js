(function() {
  var Point, Range, fs, gitRevisionView, path, ref;

  path = require("path");

  fs = require("fs");

  ref = require("atom"), Point = ref.Point, Range = ref.Range;

  gitRevisionView = require("./git-revision-view.coffee");

  module.exports = {
    activate: function() {
      return require("atom-package-deps").install("git-split-diff-hyperclick");
    },
    getProvider: function() {
      return {
        providerName: "split-diff-hyperclick",
        indexRegex: /index ([0-9a-f]{7})\.\.([0-9a-f]{7})/,
        diffRegex: /diff --git a\/(.*) b\/(.*)/,
        getSuggestion: function(textEditor, point) {
          var diffMatched, diffNamedMatched, editor, filePathA, filePathB, gitDiffNamedString, gitDiffString, gitIndexString, indexMatched, rangeDiff, rangeDiffNamed, rangeIndex, ref1, ref2, ref3, revA, revB;
          if (textEditor.getGrammar().name !== 'Word Diff' || !textEditor || !point) {
            return void 0;
          } else {
            editor = textEditor;
            rangeIndex = new Range(new Point(point.row, 0), new Point(point.row, 1000));
            gitIndexString = editor.getTextInBufferRange(rangeIndex);
            rangeDiffNamed = new Range(new Point(point.row - 4, 0), new Point(point.row, 1000));
            gitDiffNamedString = editor.getTextInBufferRange(rangeDiffNamed);
            diffNamedMatched = gitDiffNamedString.match(this.diffRegex);
            rangeDiff = new Range(new Point(point.row - 1, 0), new Point(point.row, 1000));
            gitDiffString = editor.getTextInBufferRange(rangeDiff);
            diffMatched = gitDiffString.match(this.diffRegex);
            indexMatched = gitIndexString.match(this.indexRegex);
            if (!indexMatched || !(diffMatched || diffNamedMatched)) {
              return void 0;
            } else {
              if (diffNamedMatched) {
                ref1 = gitDiffNamedString.match(this.diffRegex), diffMatched = ref1[0], filePathA = ref1[1], filePathB = ref1[2];
              } else {
                ref2 = gitDiffString.match(this.diffRegex), diffMatched = ref2[0], filePathA = ref2[1], filePathB = ref2[2];
              }
              ref3 = gitIndexString.match(this.indexRegex), indexMatched = ref3[0], revA = ref3[1], revB = ref3[2];
              return {
                range: rangeIndex,
                callback: function() {
                  return gitRevisionView.showRevision(revA, filePathA, revB, filePathB);
                }
              };
            }
          }
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtc3BsaXQtZGlmZi1oeXBlcmNsaWNrL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxNQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGlCQUFELEVBQVE7O0VBQ1IsZUFBQSxHQUFrQixPQUFBLENBQVEsNEJBQVI7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUNSLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLDJCQUFyQztJQURRLENBQVY7SUFHQSxXQUFBLEVBQWEsU0FBQTtBQUNYLGFBQU87UUFDTCxZQUFBLEVBQWMsdUJBRFQ7UUFFTCxVQUFBLEVBQVksc0NBRlA7UUFHTCxTQUFBLEVBQVcsNEJBSE47UUFJTCxhQUFBLEVBQWUsU0FBQyxVQUFELEVBQWEsS0FBYjtBQUNiLGNBQUE7VUFBQSxJQUFHLFVBQVUsQ0FBQyxVQUFYLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixLQUFnQyxXQUFoQyxJQUErQyxDQUFDLFVBQWhELElBQThELENBQUMsS0FBbEU7QUFDRSxtQkFBTyxPQURUO1dBQUEsTUFBQTtZQUdFLE1BQUEsR0FBUztZQUNULFVBQUEsR0FBYSxJQUFJLEtBQUosQ0FBVSxJQUFJLEtBQUosQ0FBVSxLQUFLLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBVixFQUFtQyxJQUFJLEtBQUosQ0FBVSxLQUFLLENBQUMsR0FBaEIsRUFBcUIsSUFBckIsQ0FBbkM7WUFDYixjQUFBLEdBQWlCLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixVQUE1QjtZQUNqQixjQUFBLEdBQWlCLElBQUksS0FBSixDQUFVLElBQUksS0FBSixDQUFVLEtBQUssQ0FBQyxHQUFOLEdBQVksQ0FBdEIsRUFBeUIsQ0FBekIsQ0FBVixFQUF1QyxJQUFJLEtBQUosQ0FBVSxLQUFLLENBQUMsR0FBaEIsRUFBcUIsSUFBckIsQ0FBdkM7WUFDakIsa0JBQUEsR0FBcUIsTUFBTSxDQUFDLG9CQUFQLENBQTRCLGNBQTVCO1lBQ3JCLGdCQUFBLEdBQW1CLGtCQUFrQixDQUFDLEtBQW5CLENBQXlCLElBQUksQ0FBQyxTQUE5QjtZQUNuQixTQUFBLEdBQVksSUFBSSxLQUFKLENBQVUsSUFBSSxLQUFKLENBQVUsS0FBSyxDQUFDLEdBQU4sR0FBWSxDQUF0QixFQUF5QixDQUF6QixDQUFWLEVBQXVDLElBQUksS0FBSixDQUFVLEtBQUssQ0FBQyxHQUFoQixFQUFxQixJQUFyQixDQUF2QztZQUNaLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLG9CQUFQLENBQTRCLFNBQTVCO1lBQ2hCLFdBQUEsR0FBYyxhQUFhLENBQUMsS0FBZCxDQUFvQixJQUFJLENBQUMsU0FBekI7WUFDZCxZQUFBLEdBQWUsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsSUFBSSxDQUFDLFVBQTFCO1lBQ2YsSUFBRyxDQUFDLFlBQUQsSUFBaUIsQ0FBQyxDQUFDLFdBQUEsSUFBYyxnQkFBZixDQUFyQjtBQUNFLHFCQUFPLE9BRFQ7YUFBQSxNQUFBO2NBR0UsSUFBRyxnQkFBSDtnQkFDRSxPQUFzQyxrQkFBa0IsQ0FBQyxLQUFuQixDQUF5QixJQUFJLENBQUMsU0FBOUIsQ0FBdEMsRUFBQyxxQkFBRCxFQUFjLG1CQUFkLEVBQXlCLG9CQUQzQjtlQUFBLE1BQUE7Z0JBR0UsT0FBc0MsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsSUFBSSxDQUFDLFNBQXpCLENBQXRDLEVBQUMscUJBQUQsRUFBYyxtQkFBZCxFQUF5QixvQkFIM0I7O2NBSUEsT0FBNkIsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsSUFBSSxDQUFDLFVBQTFCLENBQTdCLEVBQUMsc0JBQUQsRUFBZSxjQUFmLEVBQXFCO0FBQ3JCLHFCQUFPO2dCQUNMLEtBQUEsRUFBTyxVQURGO2dCQUVMLFFBQUEsRUFBVSxTQUFBO3lCQUNSLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixJQUE3QixFQUFtQyxTQUFuQyxFQUE4QyxJQUE5QyxFQUFvRCxTQUFwRDtnQkFEUSxDQUZMO2dCQVJUO2FBYkY7O1FBRGEsQ0FKVjs7SUFESSxDQUhiOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcbmZzID0gcmVxdWlyZSBcImZzXCJcbntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSBcImF0b21cIlxuZ2l0UmV2aXNpb25WaWV3ID0gcmVxdWlyZSBcIi4vZ2l0LXJldmlzaW9uLXZpZXcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKCkgLT5cbiAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImdpdC1zcGxpdC1kaWZmLWh5cGVyY2xpY2tcIilcblxuICBnZXRQcm92aWRlcjogKCkgLT5cbiAgICByZXR1cm4ge1xuICAgICAgcHJvdmlkZXJOYW1lOiBcInNwbGl0LWRpZmYtaHlwZXJjbGlja1wiXG4gICAgICBpbmRleFJlZ2V4OiAvaW5kZXggKFswLTlhLWZdezd9KVxcLlxcLihbMC05YS1mXXs3fSkvXG4gICAgICBkaWZmUmVnZXg6IC9kaWZmIC0tZ2l0IGFcXC8oLiopIGJcXC8oLiopL1xuICAgICAgZ2V0U3VnZ2VzdGlvbjogKHRleHRFZGl0b3IsIHBvaW50KSAtPlxuICAgICAgICBpZiB0ZXh0RWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lICE9ICdXb3JkIERpZmYnIHx8ICF0ZXh0RWRpdG9yIHx8ICFwb2ludFxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVkaXRvciA9IHRleHRFZGl0b3JcbiAgICAgICAgICByYW5nZUluZGV4ID0gbmV3IFJhbmdlKG5ldyBQb2ludChwb2ludC5yb3csIDApLCBuZXcgUG9pbnQocG9pbnQucm93LCAxMDAwKSlcbiAgICAgICAgICBnaXRJbmRleFN0cmluZyA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZUluZGV4KVxuICAgICAgICAgIHJhbmdlRGlmZk5hbWVkID0gbmV3IFJhbmdlKG5ldyBQb2ludChwb2ludC5yb3cgLSA0LCAwKSwgbmV3IFBvaW50KHBvaW50LnJvdywgMTAwMCkpXG4gICAgICAgICAgZ2l0RGlmZk5hbWVkU3RyaW5nID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlRGlmZk5hbWVkKVxuICAgICAgICAgIGRpZmZOYW1lZE1hdGNoZWQgPSBnaXREaWZmTmFtZWRTdHJpbmcubWF0Y2ggdGhpcy5kaWZmUmVnZXhcbiAgICAgICAgICByYW5nZURpZmYgPSBuZXcgUmFuZ2UobmV3IFBvaW50KHBvaW50LnJvdyAtIDEsIDApLCBuZXcgUG9pbnQocG9pbnQucm93LCAxMDAwKSlcbiAgICAgICAgICBnaXREaWZmU3RyaW5nID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlRGlmZilcbiAgICAgICAgICBkaWZmTWF0Y2hlZCA9IGdpdERpZmZTdHJpbmcubWF0Y2ggdGhpcy5kaWZmUmVnZXhcbiAgICAgICAgICBpbmRleE1hdGNoZWQgPSBnaXRJbmRleFN0cmluZy5tYXRjaCB0aGlzLmluZGV4UmVnZXhcbiAgICAgICAgICBpZiAhaW5kZXhNYXRjaGVkIHx8ICEoZGlmZk1hdGNoZWR8fCBkaWZmTmFtZWRNYXRjaGVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIGRpZmZOYW1lZE1hdGNoZWRcbiAgICAgICAgICAgICAgW2RpZmZNYXRjaGVkLCBmaWxlUGF0aEEsIGZpbGVQYXRoQl0gPSBnaXREaWZmTmFtZWRTdHJpbmcubWF0Y2ggdGhpcy5kaWZmUmVnZXhcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgW2RpZmZNYXRjaGVkLCBmaWxlUGF0aEEsIGZpbGVQYXRoQl0gPSBnaXREaWZmU3RyaW5nLm1hdGNoIHRoaXMuZGlmZlJlZ2V4XG4gICAgICAgICAgICBbaW5kZXhNYXRjaGVkLCByZXZBLCByZXZCXSA9IGdpdEluZGV4U3RyaW5nLm1hdGNoIHRoaXMuaW5kZXhSZWdleFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcmFuZ2U6IHJhbmdlSW5kZXgsXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiAtPlxuICAgICAgICAgICAgICAgIGdpdFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24ocmV2QSwgZmlsZVBhdGhBLCByZXZCLCBmaWxlUGF0aEIpXG4gICAgICAgICAgICB9XG4gICAgfVxuIl19
