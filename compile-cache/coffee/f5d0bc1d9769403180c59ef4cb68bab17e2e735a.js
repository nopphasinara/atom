(function() {
  var RangeFinder, beautify, prettify;

  RangeFinder = require('./range-finder');

  beautify = require('js-beautify').html;

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'prettify:prettify': function(event) {
          var editor;
          editor = this.getModel();
          return prettify(editor);
        }
      });
    }
  };

  prettify = function(editor) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var text;
      text = editor.getTextInBufferRange(range);
      text = beautify(text, {
        'indent_size': atom.config.get('editor.tabLength')
      });
      return editor.setTextInBufferRange(range, text);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLXByZXR0aWZ5L2xpYi9wcmV0dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7O0VBRWxDLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxtQkFBQSxFQUFxQixTQUFDLEtBQUQ7QUFDekQsY0FBQTtVQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsUUFBRCxDQUFBO2lCQUNULFFBQUEsQ0FBUyxNQUFUO1FBRnlELENBQXJCO09BQXRDO0lBRFEsQ0FBVjs7O0VBS0YsUUFBQSxHQUFXLFNBQUMsTUFBRDtBQUNULFFBQUE7SUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCO1dBQ2pCLGNBQWMsQ0FBQyxPQUFmLENBQXVCLFNBQUMsS0FBRDtBQUNyQixVQUFBO01BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QjtNQUNQLElBQUEsR0FBTyxRQUFBLENBQVMsSUFBVCxFQUNMO1FBQUEsYUFBQSxFQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBZjtPQURLO2FBRVAsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLElBQW5DO0lBSnFCLENBQXZCO0VBRlM7QUFUWCIsInNvdXJjZXNDb250ZW50IjpbIlJhbmdlRmluZGVyID0gcmVxdWlyZSAnLi9yYW5nZS1maW5kZXInXG5iZWF1dGlmeSA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuaHRtbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ3ByZXR0aWZ5OnByZXR0aWZ5JzogKGV2ZW50KSAtPlxuICAgICAgZWRpdG9yID0gQGdldE1vZGVsKClcbiAgICAgIHByZXR0aWZ5KGVkaXRvcilcblxucHJldHRpZnkgPSAoZWRpdG9yKSAtPlxuICBzb3J0YWJsZVJhbmdlcyA9IFJhbmdlRmluZGVyLnJhbmdlc0ZvcihlZGl0b3IpXG4gIHNvcnRhYmxlUmFuZ2VzLmZvckVhY2ggKHJhbmdlKSAtPlxuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgdGV4dCA9IGJlYXV0aWZ5IHRleHQsXG4gICAgICAnaW5kZW50X3NpemUnOiBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnKVxuICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgdGV4dClcbiJdfQ==
