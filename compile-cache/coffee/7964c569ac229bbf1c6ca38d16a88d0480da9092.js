(function() {
  var AbstractProvider, FunctionProvider,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(superClass) {
    extend(FunctionProvider, superClass);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.regex = /(\s*(?:public|protected|private)\s+\$)(\w+)\s+/g;


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {
      var context, currentClass, propertyName;
      currentClass = this.parser.getFullClassName(editor);
      propertyName = match[2];
      context = this.parser.getMemberContext(editor, propertyName, null, currentClass);
      if (!context || !context.override) {
        return null;
      }
      return {
        lineNumberClass: 'override',
        tooltipText: 'Overrides property from ' + context.override.declaringClass.name,
        extraData: context.override
      };
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {
      return atom.workspace.open(annotationInfo.extraData.declaringStructure.filename, {
        searchAllPanes: true
      });
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2Fubm90YXRpb24vcHJvcGVydHktcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBOzs7RUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBR007Ozs7Ozs7K0JBQ0YsS0FBQSxHQUFPOzs7QUFFUDs7OzsrQkFHQSxxQkFBQSxHQUF1QixTQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNuQixVQUFBO01BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekI7TUFFZixZQUFBLEdBQWUsS0FBTSxDQUFBLENBQUE7TUFFckIsT0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsWUFBakMsRUFBK0MsSUFBL0MsRUFBcUQsWUFBckQ7TUFFVixJQUFHLENBQUksT0FBSixJQUFlLENBQUksT0FBTyxDQUFDLFFBQTlCO0FBQ0ksZUFBTyxLQURYOztBQUlBLGFBQU87UUFDSCxlQUFBLEVBQWtCLFVBRGY7UUFFSCxXQUFBLEVBQWtCLDBCQUFBLEdBQTZCLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBRjVFO1FBR0gsU0FBQSxFQUFrQixPQUFPLENBQUMsUUFIdkI7O0lBWFk7OztBQWlCdkI7Ozs7K0JBR0EsZ0JBQUEsR0FBa0IsU0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixjQUFoQjthQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFjLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQWhFLEVBQTBFO1FBRXRFLGNBQUEsRUFBaUIsSUFGcUQ7T0FBMUU7SUFEYzs7OztLQTFCUztBQUwvQiIsInNvdXJjZXNDb250ZW50IjpbIkFic3RyYWN0UHJvdmlkZXIgPSByZXF1aXJlICcuL2Fic3RyYWN0LXByb3ZpZGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiMgUHJvdmlkZXMgYW5ub3RhdGlvbnMgZm9yIG92ZXJyaWRpbmcgcHJvcGVydHkuXG5jbGFzcyBGdW5jdGlvblByb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlclxuICAgIHJlZ2V4OiAvKFxccyooPzpwdWJsaWN8cHJvdGVjdGVkfHByaXZhdGUpXFxzK1xcJCkoXFx3KylcXHMrL2dcblxuICAgICMjIypcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICMjI1xuICAgIGV4dHJhY3RBbm5vdGF0aW9uSW5mbzogKGVkaXRvciwgcm93LCByb3dUZXh0LCBtYXRjaCkgLT5cbiAgICAgICAgY3VycmVudENsYXNzID0gQHBhcnNlci5nZXRGdWxsQ2xhc3NOYW1lKGVkaXRvcilcblxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSBtYXRjaFsyXVxuXG4gICAgICAgIGNvbnRleHQgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCBwcm9wZXJ0eU5hbWUsIG51bGwsIGN1cnJlbnRDbGFzcylcblxuICAgICAgICBpZiBub3QgY29udGV4dCBvciBub3QgY29udGV4dC5vdmVycmlkZVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICAjIE5PVEU6IFdlIGRlbGliZXJhdGVseSBzaG93IHRoZSBkZWNsYXJpbmcgY2xhc3MgaGVyZSwgbm90IHRoZSBzdHJ1Y3R1cmUgKHdoaWNoIGNvdWxkIGJlIGEgdHJhaXQpLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluZU51bWJlckNsYXNzIDogJ292ZXJyaWRlJ1xuICAgICAgICAgICAgdG9vbHRpcFRleHQgICAgIDogJ092ZXJyaWRlcyBwcm9wZXJ0eSBmcm9tICcgKyBjb250ZXh0Lm92ZXJyaWRlLmRlY2xhcmluZ0NsYXNzLm5hbWVcbiAgICAgICAgICAgIGV4dHJhRGF0YSAgICAgICA6IGNvbnRleHQub3ZlcnJpZGVcbiAgICAgICAgfVxuXG4gICAgIyMjKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgIyMjXG4gICAgaGFuZGxlTW91c2VDbGljazogKGV2ZW50LCBlZGl0b3IsIGFubm90YXRpb25JbmZvKSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGFubm90YXRpb25JbmZvLmV4dHJhRGF0YS5kZWNsYXJpbmdTdHJ1Y3R1cmUuZmlsZW5hbWUsIHtcbiAgICAgICAgICAgICMgaW5pdGlhbExpbmUgICAgOiBhbm5vdGF0aW9uSW5mby5zdGFydExpbmUgLSAxLFxuICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXMgOiB0cnVlXG4gICAgICAgIH0pXG4iXX0=
