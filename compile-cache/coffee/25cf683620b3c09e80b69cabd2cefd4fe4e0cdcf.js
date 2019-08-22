(function() {
  var AbstractProvider, PropertyProvider, TextEditor,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = PropertyProvider = (function(superClass) {
    extend(PropertyProvider, superClass);

    function PropertyProvider() {
      return PropertyProvider.__super__.constructor.apply(this, arguments);
    }

    PropertyProvider.prototype.hoverEventSelectors = '.syntax--property';

    PropertyProvider.prototype.clickEventSelectors = '.syntax--property';

    PropertyProvider.prototype.gotoRegex = /^(\$\w+)?((->|::)\w+)+/;


    /**
     * Goto the property from the term given.
     *
     * @param {TextEditor} editor TextEditor to search for namespace of term.
     * @param {string}     term   Term to search for.
     */

    PropertyProvider.prototype.gotoFromWord = function(editor, term) {
      var bufferPosition, calledClass, currentClass, value;
      bufferPosition = editor.getCursorBufferPosition();
      calledClass = this.parser.getCalledClass(editor, term, bufferPosition);
      if (!calledClass) {
        return;
      }
      currentClass = this.parser.getFullClassName(editor);
      if (currentClass === calledClass && this.jumpTo(editor, term)) {
        this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
        return;
      }
      value = this.parser.getMemberContext(editor, term, bufferPosition, calledClass);
      if (!value) {
        return;
      }
      atom.workspace.open(value.declaringStructure.filename, {
        searchAllPanes: true
      });
      this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
      return this.jumpWord = term;
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param  {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    PropertyProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("(protected|public|private|static) +\\$" + term, "i");
    };

    return PropertyProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2dvdG8vcHJvcGVydHktcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7Ozs7OzsrQkFDRixtQkFBQSxHQUFxQjs7K0JBQ3JCLG1CQUFBLEdBQXFCOzsrQkFDckIsU0FBQSxHQUFXOzs7QUFFWDs7Ozs7OzsrQkFNQSxZQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsSUFBVDtBQUNWLFVBQUE7TUFBQSxjQUFBLEdBQWlCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBO01BRWpCLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsTUFBdkIsRUFBK0IsSUFBL0IsRUFBcUMsY0FBckM7TUFFZCxJQUFHLENBQUksV0FBUDtBQUNJLGVBREo7O01BR0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekI7TUFFZixJQUFHLFlBQUEsS0FBZ0IsV0FBaEIsSUFBK0IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQWdCLElBQWhCLENBQWxDO1FBQ0ksSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBdEIsRUFBd0MsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBeEM7QUFDQSxlQUZKOztNQUlBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDLEVBQXVELFdBQXZEO01BRVIsSUFBRyxDQUFJLEtBQVA7QUFDSSxlQURKOztNQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBN0MsRUFBdUQ7UUFDbkQsY0FBQSxFQUFnQixJQURtQztPQUF2RDtNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXRCLEVBQXdDLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQXhDO2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQXhCRjs7O0FBMEJkOzs7Ozs7OzsrQkFPQSxjQUFBLEdBQWdCLFNBQUMsSUFBRDtBQUNaLGFBQU8sTUFBQSxDQUFBLHdDQUFBLEdBQTJDLElBQTNDLEVBQWtELEdBQWxEO0lBREs7Ozs7S0E1Q1c7QUFOL0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGV4dEVkaXRvcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5BYnN0cmFjdFByb3ZpZGVyID0gcmVxdWlyZSAnLi9hYnN0cmFjdC1wcm92aWRlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuXG5jbGFzcyBQcm9wZXJ0eVByb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlclxuICAgIGhvdmVyRXZlbnRTZWxlY3RvcnM6ICcuc3ludGF4LS1wcm9wZXJ0eSdcbiAgICBjbGlja0V2ZW50U2VsZWN0b3JzOiAnLnN5bnRheC0tcHJvcGVydHknXG4gICAgZ290b1JlZ2V4OiAvXihcXCRcXHcrKT8oKC0+fDo6KVxcdyspKy9cblxuICAgICMjIypcbiAgICAgKiBHb3RvIHRoZSBwcm9wZXJ0eSBmcm9tIHRoZSB0ZXJtIGdpdmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGV4dEVkaXRvciB0byBzZWFyY2ggZm9yIG5hbWVzcGFjZSBvZiB0ZXJtLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgdGVybSAgIFRlcm0gdG8gc2VhcmNoIGZvci5cbiAgICAjIyNcbiAgICBnb3RvRnJvbVdvcmQ6IChlZGl0b3IsIHRlcm0pIC0+XG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgICAgICBjYWxsZWRDbGFzcyA9IEBwYXJzZXIuZ2V0Q2FsbGVkQ2xhc3MoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBpZiBub3QgY2FsbGVkQ2xhc3NcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGN1cnJlbnRDbGFzcyA9IEBwYXJzZXIuZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IpXG5cbiAgICAgICAgaWYgY3VycmVudENsYXNzID09IGNhbGxlZENsYXNzICYmIEBqdW1wVG8oZWRpdG9yLCB0ZXJtKVxuICAgICAgICAgICAgQG1hbmFnZXIuYWRkQmFja1RyYWNrKGVkaXRvci5nZXRQYXRoKCksIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdmFsdWUgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbiwgY2FsbGVkQ2xhc3MpXG5cbiAgICAgICAgaWYgbm90IHZhbHVlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHZhbHVlLmRlY2xhcmluZ1N0cnVjdHVyZS5maWxlbmFtZSwge1xuICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICBAbWFuYWdlci5hZGRCYWNrVHJhY2soZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgICAgIEBqdW1wV29yZCA9IHRlcm1cblxuICAgICMjIypcbiAgICAgKiBHZXRzIHRoZSByZWdleCB1c2VkIHdoZW4gbG9va2luZyBmb3IgYSB3b3JkIHdpdGhpbiB0aGUgZWRpdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRlcm0gVGVybSBiZWluZyBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtyZWdleH0gUmVnZXggdG8gYmUgdXNlZC5cbiAgICAjIyNcbiAgICBnZXRKdW1wVG9SZWdleDogKHRlcm0pIC0+XG4gICAgICAgIHJldHVybiAvLy8ocHJvdGVjdGVkfHB1YmxpY3xwcml2YXRlfHN0YXRpYylcXCArXFwkI3t0ZXJtfS8vL2lcbiJdfQ==
