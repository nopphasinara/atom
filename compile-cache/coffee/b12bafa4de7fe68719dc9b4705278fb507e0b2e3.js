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

    FunctionProvider.prototype.regex = /(\s*(?:public|protected|private)\s+function\s+)(\w+)\s*\(/g;


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {
      var context, currentClass, extraData, lineNumberClass, propertyName, tooltipText;
      currentClass = this.parser.getFullClassName(editor);
      propertyName = match[2];
      context = this.parser.getMemberContext(editor, propertyName, null, currentClass);
      if (!context || (!context.override && !context.implementation)) {
        return null;
      }
      extraData = null;
      tooltipText = '';
      lineNumberClass = '';
      if (context.override) {
        extraData = context.override;
        lineNumberClass = 'override';
        tooltipText = 'Overrides method from ' + extraData.declaringClass.name;
      } else {
        extraData = context.implementation;
        lineNumberClass = 'implementation';
        tooltipText = 'Implements method for ' + extraData.declaringClass.name;
      }
      return {
        lineNumberClass: lineNumberClass,
        tooltipText: tooltipText,
        extraData: extraData
      };
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {
      return atom.workspace.open(annotationInfo.extraData.declaringStructure.filename, {
        initialLine: annotationInfo.extraData.startLine - 1,
        searchAllPanes: true
      });
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2Fubm90YXRpb24vbWV0aG9kLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTs7O0VBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUdNOzs7Ozs7OytCQUNGLEtBQUEsR0FBTzs7O0FBRVA7Ozs7K0JBR0EscUJBQUEsR0FBdUIsU0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUIsS0FBdkI7QUFDbkIsVUFBQTtNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCO01BRWYsWUFBQSxHQUFlLEtBQU0sQ0FBQSxDQUFBO01BRXJCLE9BQUEsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLFlBQWpDLEVBQStDLElBQS9DLEVBQXFELFlBQXJEO01BRVYsSUFBRyxDQUFJLE9BQUosSUFBZSxDQUFDLENBQUksT0FBTyxDQUFDLFFBQVosSUFBeUIsQ0FBSSxPQUFPLENBQUMsY0FBdEMsQ0FBbEI7QUFDSSxlQUFPLEtBRFg7O01BR0EsU0FBQSxHQUFZO01BQ1osV0FBQSxHQUFjO01BQ2QsZUFBQSxHQUFrQjtNQUdsQixJQUFHLE9BQU8sQ0FBQyxRQUFYO1FBQ0ksU0FBQSxHQUFZLE9BQU8sQ0FBQztRQUNwQixlQUFBLEdBQWtCO1FBQ2xCLFdBQUEsR0FBYyx3QkFBQSxHQUEyQixTQUFTLENBQUMsY0FBYyxDQUFDLEtBSHRFO09BQUEsTUFBQTtRQU1JLFNBQUEsR0FBWSxPQUFPLENBQUM7UUFDcEIsZUFBQSxHQUFrQjtRQUNsQixXQUFBLEdBQWMsd0JBQUEsR0FBMkIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQVJ0RTs7QUFVQSxhQUFPO1FBQ0gsZUFBQSxFQUFrQixlQURmO1FBRUgsV0FBQSxFQUFrQixXQUZmO1FBR0gsU0FBQSxFQUFrQixTQUhmOztJQXpCWTs7O0FBK0J2Qjs7OzsrQkFHQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLGNBQWhCO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQWMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsUUFBaEUsRUFBMEU7UUFDdEUsV0FBQSxFQUFpQixjQUFjLENBQUMsU0FBUyxDQUFDLFNBQXpCLEdBQXFDLENBRGdCO1FBRXRFLGNBQUEsRUFBaUIsSUFGcUQ7T0FBMUU7SUFEYzs7O0FBTWxCOzs7OytCQUdBLGFBQUEsR0FBZSxTQUFBO01BQ1gsSUFBRyxJQUFDLENBQUEsZUFBSjtRQUNJLElBQUMsQ0FBQSxlQUFlLENBQUMsT0FBakIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEtBRnZCOztJQURXOzs7O0tBakRZO0FBTC9CIiwic291cmNlc0NvbnRlbnQiOlsiQWJzdHJhY3RQcm92aWRlciA9IHJlcXVpcmUgJy4vYWJzdHJhY3QtcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cblxuIyBQcm92aWRlcyBhbm5vdGF0aW9ucyBmb3Igb3ZlcnJpZGluZyBtZXRob2RzIGFuZCBpbXBsZW1lbnRhdGlvbnMgb2YgaW50ZXJmYWNlIG1ldGhvZHMuXG5jbGFzcyBGdW5jdGlvblByb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlclxuICAgIHJlZ2V4OiAvKFxccyooPzpwdWJsaWN8cHJvdGVjdGVkfHByaXZhdGUpXFxzK2Z1bmN0aW9uXFxzKykoXFx3KylcXHMqXFwoL2dcblxuICAgICMjIypcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICMjI1xuICAgIGV4dHJhY3RBbm5vdGF0aW9uSW5mbzogKGVkaXRvciwgcm93LCByb3dUZXh0LCBtYXRjaCkgLT5cbiAgICAgICAgY3VycmVudENsYXNzID0gQHBhcnNlci5nZXRGdWxsQ2xhc3NOYW1lKGVkaXRvcilcblxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSBtYXRjaFsyXVxuXG4gICAgICAgIGNvbnRleHQgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCBwcm9wZXJ0eU5hbWUsIG51bGwsIGN1cnJlbnRDbGFzcylcblxuICAgICAgICBpZiBub3QgY29udGV4dCBvciAobm90IGNvbnRleHQub3ZlcnJpZGUgYW5kIG5vdCBjb250ZXh0LmltcGxlbWVudGF0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBleHRyYURhdGEgPSBudWxsXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gJydcbiAgICAgICAgbGluZU51bWJlckNsYXNzID0gJydcblxuICAgICAgICAjIE5PVEU6IFdlIGRlbGliZXJhdGVseSBzaG93IHRoZSBkZWNsYXJpbmcgY2xhc3MgaGVyZSwgbm90IHRoZSBzdHJ1Y3R1cmUgKHdoaWNoIGNvdWxkIGJlIGEgdHJhaXQpLlxuICAgICAgICBpZiBjb250ZXh0Lm92ZXJyaWRlXG4gICAgICAgICAgICBleHRyYURhdGEgPSBjb250ZXh0Lm92ZXJyaWRlXG4gICAgICAgICAgICBsaW5lTnVtYmVyQ2xhc3MgPSAnb3ZlcnJpZGUnXG4gICAgICAgICAgICB0b29sdGlwVGV4dCA9ICdPdmVycmlkZXMgbWV0aG9kIGZyb20gJyArIGV4dHJhRGF0YS5kZWNsYXJpbmdDbGFzcy5uYW1lXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXh0cmFEYXRhID0gY29udGV4dC5pbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgbGluZU51bWJlckNsYXNzID0gJ2ltcGxlbWVudGF0aW9uJ1xuICAgICAgICAgICAgdG9vbHRpcFRleHQgPSAnSW1wbGVtZW50cyBtZXRob2QgZm9yICcgKyBleHRyYURhdGEuZGVjbGFyaW5nQ2xhc3MubmFtZVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5lTnVtYmVyQ2xhc3MgOiBsaW5lTnVtYmVyQ2xhc3NcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0ICAgICA6IHRvb2x0aXBUZXh0XG4gICAgICAgICAgICBleHRyYURhdGEgICAgICAgOiBleHRyYURhdGFcbiAgICAgICAgfVxuXG4gICAgIyMjKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgIyMjXG4gICAgaGFuZGxlTW91c2VDbGljazogKGV2ZW50LCBlZGl0b3IsIGFubm90YXRpb25JbmZvKSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGFubm90YXRpb25JbmZvLmV4dHJhRGF0YS5kZWNsYXJpbmdTdHJ1Y3R1cmUuZmlsZW5hbWUsIHtcbiAgICAgICAgICAgIGluaXRpYWxMaW5lICAgIDogYW5ub3RhdGlvbkluZm8uZXh0cmFEYXRhLnN0YXJ0TGluZSAtIDEsXG4gICAgICAgICAgICBzZWFyY2hBbGxQYW5lcyA6IHRydWVcbiAgICAgICAgfSlcblxuICAgICMjIypcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICMjI1xuICAgIHJlbW92ZVBvcG92ZXI6ICgpIC0+XG4gICAgICAgIGlmIEBhdHRhY2hlZFBvcG92ZXJcbiAgICAgICAgICAgIEBhdHRhY2hlZFBvcG92ZXIuZGlzcG9zZSgpXG4gICAgICAgICAgICBAYXR0YWNoZWRQb3BvdmVyID0gbnVsbFxuIl19
