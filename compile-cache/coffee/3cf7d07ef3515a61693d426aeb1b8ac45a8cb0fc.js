
/**
 * PHP import use statement
 */

(function() {
  module.exports = {

    /**
     * Import use statement for class under cursor
     * @param {TextEditor} editor
     */
    importUseStatement: function(editor) {
      var ClassListView, ClassProvider, provider, regex, suggestions, word;
      ClassProvider = require('../autocompletion/class-provider.coffee');
      provider = new ClassProvider();
      word = editor.getWordUnderCursor();
      regex = new RegExp('\\\\' + word + '$');
      suggestions = provider.fetchSuggestionsFromWord(word);
      if (!suggestions) {
        return;
      }
      suggestions = suggestions.filter(function(suggestion) {
        return suggestion.text === word || regex.test(suggestion.text);
      });
      if (!suggestions.length) {
        return;
      }
      if (suggestions.length < 2) {
        return provider.onSelectedClassSuggestion({
          editor: editor,
          suggestion: suggestions.shift()
        });
      }
      ClassListView = require('../views/class-list-view');
      return new ClassListView(suggestions, function(arg) {
        var name, suggestion;
        name = arg.name;
        suggestion = suggestions.filter(function(suggestion) {
          return suggestion.text === name;
        }).shift();
        return provider.onSelectedClassSuggestion({
          editor: editor,
          suggestion: suggestion
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL3VzZS1zdGF0ZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUEsTUFBTSxDQUFDLE9BQVAsR0FFSTs7QUFBQTs7OztJQUlBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRDtBQUNoQixVQUFBO01BQUEsYUFBQSxHQUFnQixPQUFBLENBQVEseUNBQVI7TUFDaEIsUUFBQSxHQUFXLElBQUksYUFBSixDQUFBO01BQ1gsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBO01BQ1AsS0FBQSxHQUFRLElBQUksTUFBSixDQUFXLE1BQUEsR0FBUyxJQUFULEdBQWdCLEdBQTNCO01BRVIsV0FBQSxHQUFjLFFBQVEsQ0FBQyx3QkFBVCxDQUFrQyxJQUFsQztNQUNkLElBQUEsQ0FBYyxXQUFkO0FBQUEsZUFBQTs7TUFFQSxXQUFBLEdBQWMsV0FBVyxDQUFDLE1BQVosQ0FBbUIsU0FBQyxVQUFEO0FBQzdCLGVBQU8sVUFBVSxDQUFDLElBQVgsS0FBbUIsSUFBbkIsSUFBMkIsS0FBSyxDQUFDLElBQU4sQ0FBVyxVQUFVLENBQUMsSUFBdEI7TUFETCxDQUFuQjtNQUlkLElBQUEsQ0FBYyxXQUFXLENBQUMsTUFBMUI7QUFBQSxlQUFBOztNQUVBLElBQUcsV0FBVyxDQUFDLE1BQVosR0FBcUIsQ0FBeEI7QUFDSSxlQUFPLFFBQVEsQ0FBQyx5QkFBVCxDQUFtQztVQUFDLFFBQUEsTUFBRDtVQUFTLFVBQUEsRUFBWSxXQUFXLENBQUMsS0FBWixDQUFBLENBQXJCO1NBQW5DLEVBRFg7O01BR0EsYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVI7QUFFaEIsYUFBTyxJQUFJLGFBQUosQ0FBa0IsV0FBbEIsRUFBK0IsU0FBQyxHQUFEO0FBQ2xDLFlBQUE7UUFEb0MsT0FBRDtRQUNuQyxVQUFBLEdBQWEsV0FBVyxDQUFDLE1BQVosQ0FBbUIsU0FBQyxVQUFEO0FBQzVCLGlCQUFPLFVBQVUsQ0FBQyxJQUFYLEtBQW1CO1FBREUsQ0FBbkIsQ0FFWixDQUFDLEtBRlcsQ0FBQTtlQUdiLFFBQVEsQ0FBQyx5QkFBVCxDQUFtQztVQUFDLFFBQUEsTUFBRDtVQUFTLFlBQUEsVUFBVDtTQUFuQztNQUprQyxDQUEvQjtJQXBCUyxDQUpwQjs7QUFOSiIsInNvdXJjZXNDb250ZW50IjpbIiMjIypcbiAqIFBIUCBpbXBvcnQgdXNlIHN0YXRlbWVudFxuIyMjXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAgICMjIypcbiAgICAgKiBJbXBvcnQgdXNlIHN0YXRlbWVudCBmb3IgY2xhc3MgdW5kZXIgY3Vyc29yXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3JcbiAgICAjIyNcbiAgICBpbXBvcnRVc2VTdGF0ZW1lbnQ6IChlZGl0b3IpIC0+XG4gICAgICAgIENsYXNzUHJvdmlkZXIgPSByZXF1aXJlICcuLi9hdXRvY29tcGxldGlvbi9jbGFzcy1wcm92aWRlci5jb2ZmZWUnXG4gICAgICAgIHByb3ZpZGVyID0gbmV3IENsYXNzUHJvdmlkZXIoKVxuICAgICAgICB3b3JkID0gZWRpdG9yLmdldFdvcmRVbmRlckN1cnNvcigpXG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXFxcXFwnICsgd29yZCArICckJyk7XG5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBwcm92aWRlci5mZXRjaFN1Z2dlc3Rpb25zRnJvbVdvcmQod29yZClcbiAgICAgICAgcmV0dXJuIHVubGVzcyBzdWdnZXN0aW9uc1xuXG4gICAgICAgIHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnMuZmlsdGVyKChzdWdnZXN0aW9uKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb24udGV4dCA9PSB3b3JkIHx8IHJlZ2V4LnRlc3Qoc3VnZ2VzdGlvbi50ZXh0KVxuICAgICAgICApXG5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBzdWdnZXN0aW9ucy5sZW5ndGhcblxuICAgICAgICBpZiBzdWdnZXN0aW9ucy5sZW5ndGggPCAyXG4gICAgICAgICAgICByZXR1cm4gcHJvdmlkZXIub25TZWxlY3RlZENsYXNzU3VnZ2VzdGlvbiB7ZWRpdG9yLCBzdWdnZXN0aW9uOiBzdWdnZXN0aW9ucy5zaGlmdCgpfVxuXG4gICAgICAgIENsYXNzTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9jbGFzcy1saXN0LXZpZXcnXG5cbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc0xpc3RWaWV3KHN1Z2dlc3Rpb25zLCAoe25hbWV9KSAtPlxuICAgICAgICAgICAgc3VnZ2VzdGlvbiA9IHN1Z2dlc3Rpb25zLmZpbHRlcigoc3VnZ2VzdGlvbikgLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbi50ZXh0ID09IG5hbWVcbiAgICAgICAgICAgICkuc2hpZnQoKVxuICAgICAgICAgICAgcHJvdmlkZXIub25TZWxlY3RlZENsYXNzU3VnZ2VzdGlvbiB7ZWRpdG9yLCBzdWdnZXN0aW9ufVxuICAgICAgICApXG4iXX0=
