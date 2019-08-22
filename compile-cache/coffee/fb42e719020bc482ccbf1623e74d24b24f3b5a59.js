(function() {
  var AbstractProvider, FunctionProvider, TextEditor,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(superClass) {
    extend(FunctionProvider, superClass);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.hoverEventSelectors = '.syntax--function-call';

    FunctionProvider.prototype.clickEventSelectors = '.syntax--function-call';

    FunctionProvider.prototype.gotoRegex = /(?:(?:[a-zA-Z0-9_]*)\s*(?:\(.*\))?\s*(?:->|::)\s*)+([a-zA-Z0-9_]*)/;


    /**
     * Goto the class from the term given.
     *
     * @param {TextEditor} editor  TextEditor to search for namespace of term.
     * @param {string}     term    Term to search for.
     */

    FunctionProvider.prototype.gotoFromWord = function(editor, term) {
      var bufferPosition, calledClass, currentClass, value;
      bufferPosition = editor.getCursorBufferPosition();
      calledClass = this.parser.getCalledClass(editor, term, bufferPosition);
      if (!calledClass) {
        return;
      }
      currentClass = this.parser.getFullClassName(editor);
      if (currentClass === calledClass && this.jumpTo(editor, term)) {
        this.manager.addBackTrack(editor.getPath(), bufferPosition);
        return;
      }
      value = this.parser.getMemberContext(editor, term, bufferPosition, calledClass);
      if (!value) {
        return;
      }
      atom.workspace.open(value.declaringStructure.filename, {
        initialLine: value.startLine - 1,
        searchAllPanes: true
      });
      return this.manager.addBackTrack(editor.getPath(), bufferPosition);
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    FunctionProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("function +" + term + "( +|\\()", "i");
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2dvdG8vZnVuY3Rpb24tcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7Ozs7OzsrQkFDRixtQkFBQSxHQUFxQjs7K0JBQ3JCLG1CQUFBLEdBQXFCOzsrQkFDckIsU0FBQSxHQUFXOzs7QUFFWDs7Ozs7OzsrQkFNQSxZQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsSUFBVDtBQUNWLFVBQUE7TUFBQSxjQUFBLEdBQWlCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBO01BRWpCLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsTUFBdkIsRUFBK0IsSUFBL0IsRUFBcUMsY0FBckM7TUFFZCxJQUFHLENBQUksV0FBUDtBQUNJLGVBREo7O01BR0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekI7TUFFZixJQUFHLFlBQUEsS0FBZ0IsV0FBaEIsSUFBK0IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQWdCLElBQWhCLENBQWxDO1FBQ0ksSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBdEIsRUFBd0MsY0FBeEM7QUFDQSxlQUZKOztNQUlBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDLEVBQXVELFdBQXZEO01BRVIsSUFBRyxDQUFJLEtBQVA7QUFDSSxlQURKOztNQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBN0MsRUFBdUQ7UUFDbkQsV0FBQSxFQUFrQixLQUFLLENBQUMsU0FBTixHQUFrQixDQURlO1FBRW5ELGNBQUEsRUFBaUIsSUFGa0M7T0FBdkQ7YUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUF0QixFQUF3QyxjQUF4QztJQXhCVTs7O0FBMEJkOzs7Ozs7OzsrQkFPQSxjQUFBLEdBQWdCLFNBQUMsSUFBRDtBQUNaLGFBQU8sTUFBQSxDQUFBLFlBQUEsR0FBZ0IsSUFBaEIsR0FBcUIsVUFBckIsRUFBK0IsR0FBL0I7SUFESzs7OztLQTVDVztBQU4vQiIsInNvdXJjZXNDb250ZW50IjpbIntUZXh0RWRpdG9yfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkFic3RyYWN0UHJvdmlkZXIgPSByZXF1aXJlICcuL2Fic3RyYWN0LXByb3ZpZGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEZ1bmN0aW9uUHJvdmlkZXIgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgaG92ZXJFdmVudFNlbGVjdG9yczogJy5zeW50YXgtLWZ1bmN0aW9uLWNhbGwnXG4gICAgY2xpY2tFdmVudFNlbGVjdG9yczogJy5zeW50YXgtLWZ1bmN0aW9uLWNhbGwnXG4gICAgZ290b1JlZ2V4OiAvKD86KD86W2EtekEtWjAtOV9dKilcXHMqKD86XFwoLipcXCkpP1xccyooPzotPnw6OilcXHMqKSsoW2EtekEtWjAtOV9dKikvXG5cbiAgICAjIyMqXG4gICAgICogR290byB0aGUgY2xhc3MgZnJvbSB0aGUgdGVybSBnaXZlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yICBUZXh0RWRpdG9yIHRvIHNlYXJjaCBmb3IgbmFtZXNwYWNlIG9mIHRlcm0uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICB0ZXJtICAgIFRlcm0gdG8gc2VhcmNoIGZvci5cbiAgICAjIyNcbiAgICBnb3RvRnJvbVdvcmQ6IChlZGl0b3IsIHRlcm0pIC0+XG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgICAgICBjYWxsZWRDbGFzcyA9IEBwYXJzZXIuZ2V0Q2FsbGVkQ2xhc3MoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBpZiBub3QgY2FsbGVkQ2xhc3NcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGN1cnJlbnRDbGFzcyA9IEBwYXJzZXIuZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IpXG5cbiAgICAgICAgaWYgY3VycmVudENsYXNzID09IGNhbGxlZENsYXNzICYmIEBqdW1wVG8oZWRpdG9yLCB0ZXJtKVxuICAgICAgICAgICAgQG1hbmFnZXIuYWRkQmFja1RyYWNrKGVkaXRvci5nZXRQYXRoKCksIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdmFsdWUgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbiwgY2FsbGVkQ2xhc3MpXG5cbiAgICAgICAgaWYgbm90IHZhbHVlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHZhbHVlLmRlY2xhcmluZ1N0cnVjdHVyZS5maWxlbmFtZSwge1xuICAgICAgICAgICAgaW5pdGlhbExpbmUgICAgOiAodmFsdWUuc3RhcnRMaW5lIC0gMSksXG4gICAgICAgICAgICBzZWFyY2hBbGxQYW5lcyA6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICBAbWFuYWdlci5hZGRCYWNrVHJhY2soZWRpdG9yLmdldFBhdGgoKSwgYnVmZmVyUG9zaXRpb24pXG5cbiAgICAjIyMqXG4gICAgICogR2V0cyB0aGUgcmVnZXggdXNlZCB3aGVuIGxvb2tpbmcgZm9yIGEgd29yZCB3aXRoaW4gdGhlIGVkaXRvclxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm0gVGVybSBiZWluZyBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtyZWdleH0gUmVnZXggdG8gYmUgdXNlZC5cbiAgICAjIyNcbiAgICBnZXRKdW1wVG9SZWdleDogKHRlcm0pIC0+XG4gICAgICAgIHJldHVybiAvLy9mdW5jdGlvblxcICsje3Rlcm19KFxcICt8XFwoKS8vL2lcbiJdfQ==
