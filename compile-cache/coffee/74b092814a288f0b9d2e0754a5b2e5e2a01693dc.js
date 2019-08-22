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


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    PropertyProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var accessModifier, description, ref, ref1, ref2, returnType, returnValue, value;
      value = this.parser.getMemberContext(editor, term, bufferPosition);
      if (!value) {
        return;
      }
      accessModifier = '';
      returnType = ((ref = value.args["return"]) != null ? ref.type : void 0) ? value.args["return"].type : 'mixed';
      if (value.isPublic) {
        accessModifier = 'public';
      } else if (value.isProtected) {
        accessModifier = 'protected';
      } else {
        accessModifier = 'private';
      }
      description = '';
      description += "<p><div>";
      description += accessModifier + ' ' + returnType + '<strong>' + ' $' + term + '</strong>';
      description += '</div></p>';
      description += '<div>';
      description += (value.args.descriptions.short ? value.args.descriptions.short : '(No documentation available)');
      description += '</div>';
      if (((ref1 = value.args.descriptions.long) != null ? ref1.length : void 0) > 0) {
        description += '<div class="section">';
        description += "<h4>Description</h4>";
        description += "<div>" + value.args.descriptions.long + "</div>";
        description += "</div>";
      }
      if ((ref2 = value.args["return"]) != null ? ref2.type : void 0) {
        returnValue = '<strong>' + value.args["return"].type + '</strong>';
        if (value.args["return"].description) {
          returnValue += ' ' + value.args["return"].description;
        }
        description += '<div class="section">';
        description += "<h4>Type</h4>";
        description += "<div>" + returnValue + "</div>";
        description += "</div>";
      }
      return description;
    };

    return PropertyProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3Rvb2x0aXAvcHJvcGVydHktcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7Ozs7OzsrQkFDRixtQkFBQSxHQUFxQjs7O0FBRXJCOzs7Ozs7OytCQU1BLGlCQUFBLEdBQW1CLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxjQUFmO0FBQ2YsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDO01BRVIsSUFBRyxDQUFJLEtBQVA7QUFDSSxlQURKOztNQUdBLGNBQUEsR0FBaUI7TUFDakIsVUFBQSw4Q0FBaUMsQ0FBRSxjQUF0QixHQUFnQyxLQUFLLENBQUMsSUFBSSxFQUFDLE1BQUQsRUFBTyxDQUFDLElBQWxELEdBQTREO01BRXpFLElBQUcsS0FBSyxDQUFDLFFBQVQ7UUFDSSxjQUFBLEdBQWlCLFNBRHJCO09BQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxXQUFUO1FBQ0QsY0FBQSxHQUFpQixZQURoQjtPQUFBLE1BQUE7UUFJRCxjQUFBLEdBQWlCLFVBSmhCOztNQU9MLFdBQUEsR0FBYztNQUVkLFdBQUEsSUFBZTtNQUNmLFdBQUEsSUFBZSxjQUFBLEdBQWlCLEdBQWpCLEdBQXVCLFVBQXZCLEdBQW9DLFVBQXBDLEdBQWlELElBQWpELEdBQXdELElBQXhELEdBQStEO01BQzlFLFdBQUEsSUFBZTtNQUdmLFdBQUEsSUFBZTtNQUNmLFdBQUEsSUFBbUIsQ0FBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUEzQixHQUFzQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUE5RCxHQUF5RSw4QkFBMUU7TUFDbkIsV0FBQSxJQUFlO01BR2YseURBQStCLENBQUUsZ0JBQTlCLEdBQXVDLENBQTFDO1FBQ0ksV0FBQSxJQUFlO1FBQ2YsV0FBQSxJQUFtQjtRQUNuQixXQUFBLElBQW1CLE9BQUEsR0FBVSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFsQyxHQUF5QztRQUM1RCxXQUFBLElBQWUsU0FKbkI7O01BTUEsZ0RBQW9CLENBQUUsYUFBdEI7UUFDSSxXQUFBLEdBQWMsVUFBQSxHQUFhLEtBQUssQ0FBQyxJQUFJLEVBQUMsTUFBRCxFQUFPLENBQUMsSUFBL0IsR0FBc0M7UUFFcEQsSUFBRyxLQUFLLENBQUMsSUFBSSxFQUFDLE1BQUQsRUFBTyxDQUFDLFdBQXJCO1VBQ0ksV0FBQSxJQUFlLEdBQUEsR0FBTSxLQUFLLENBQUMsSUFBSSxFQUFDLE1BQUQsRUFBTyxDQUFDLFlBRDNDOztRQUdBLFdBQUEsSUFBZTtRQUNmLFdBQUEsSUFBbUI7UUFDbkIsV0FBQSxJQUFtQixPQUFBLEdBQVUsV0FBVixHQUF3QjtRQUMzQyxXQUFBLElBQWUsU0FUbkI7O0FBV0EsYUFBTztJQWhEUTs7OztLQVRRO0FBTi9CIiwic291cmNlc0NvbnRlbnQiOlsie1RleHRFZGl0b3J9ID0gcmVxdWlyZSAnYXRvbSdcblxuQWJzdHJhY3RQcm92aWRlciA9IHJlcXVpcmUgJy4vYWJzdHJhY3QtcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgUHJvcGVydHlQcm92aWRlciBleHRlbmRzIEFic3RyYWN0UHJvdmlkZXJcbiAgICBob3ZlckV2ZW50U2VsZWN0b3JzOiAnLnN5bnRheC0tcHJvcGVydHknXG5cbiAgICAjIyMqXG4gICAgICogUmV0cmlldmVzIGEgdG9vbHRpcCBmb3IgdGhlIHdvcmQgZ2l2ZW4uXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yICAgICAgICAgVGV4dEVkaXRvciB0byBzZWFyY2ggZm9yIG5hbWVzcGFjZSBvZiB0ZXJtLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gICAgIHRlcm0gICAgICAgICAgIFRlcm0gdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0gIHtQb2ludH0gICAgICBidWZmZXJQb3NpdGlvbiBUaGUgY3Vyc29yIGxvY2F0aW9uIHRoZSB0ZXJtIGlzIGF0LlxuICAgICMjI1xuICAgIGdldFRvb2x0aXBGb3JXb3JkOiAoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICAgICAgdmFsdWUgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBpZiBub3QgdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGFjY2Vzc01vZGlmaWVyID0gJydcbiAgICAgICAgcmV0dXJuVHlwZSA9IGlmIHZhbHVlLmFyZ3MucmV0dXJuPy50eXBlIHRoZW4gdmFsdWUuYXJncy5yZXR1cm4udHlwZSBlbHNlICdtaXhlZCdcblxuICAgICAgICBpZiB2YWx1ZS5pc1B1YmxpY1xuICAgICAgICAgICAgYWNjZXNzTW9kaWZpZXIgPSAncHVibGljJ1xuXG4gICAgICAgIGVsc2UgaWYgdmFsdWUuaXNQcm90ZWN0ZWRcbiAgICAgICAgICAgIGFjY2Vzc01vZGlmaWVyID0gJ3Byb3RlY3RlZCdcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhY2Nlc3NNb2RpZmllciA9ICdwcml2YXRlJ1xuXG4gICAgICAgICMgQ3JlYXRlIGEgdXNlZnVsIGRlc2NyaXB0aW9uIHRvIHNob3cgaW4gdGhlIHRvb2x0aXAuXG4gICAgICAgIGRlc2NyaXB0aW9uID0gJydcblxuICAgICAgICBkZXNjcmlwdGlvbiArPSBcIjxwPjxkaXY+XCJcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gYWNjZXNzTW9kaWZpZXIgKyAnICcgKyByZXR1cm5UeXBlICsgJzxzdHJvbmc+JyArICcgJCcgKyB0ZXJtICsgJzwvc3Ryb25nPidcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gJzwvZGl2PjwvcD4nXG5cbiAgICAgICAgIyBTaG93IHRoZSBzdW1tYXJ5IChzaG9ydCBkZXNjcmlwdGlvbikuXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICc8ZGl2PidcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gICAgIChpZiB2YWx1ZS5hcmdzLmRlc2NyaXB0aW9ucy5zaG9ydCB0aGVuIHZhbHVlLmFyZ3MuZGVzY3JpcHRpb25zLnNob3J0IGVsc2UgJyhObyBkb2N1bWVudGF0aW9uIGF2YWlsYWJsZSknKVxuICAgICAgICBkZXNjcmlwdGlvbiArPSAnPC9kaXY+J1xuXG4gICAgICAgICMgU2hvdyB0aGUgKGxvbmcpIGRlc2NyaXB0aW9uLlxuICAgICAgICBpZiB2YWx1ZS5hcmdzLmRlc2NyaXB0aW9ucy5sb25nPy5sZW5ndGggPiAwXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAnPGRpdiBjbGFzcz1cInNlY3Rpb25cIj4nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8aDQ+RGVzY3JpcHRpb248L2g0PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8ZGl2PlwiICsgdmFsdWUuYXJncy5kZXNjcmlwdGlvbnMubG9uZyArIFwiPC9kaXY+XCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFwiPC9kaXY+XCJcblxuICAgICAgICBpZiB2YWx1ZS5hcmdzLnJldHVybj8udHlwZVxuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAnPHN0cm9uZz4nICsgdmFsdWUuYXJncy5yZXR1cm4udHlwZSArICc8L3N0cm9uZz4nXG5cbiAgICAgICAgICAgIGlmIHZhbHVlLmFyZ3MucmV0dXJuLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgKz0gJyAnICsgdmFsdWUuYXJncy5yZXR1cm4uZGVzY3JpcHRpb25cblxuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gJzxkaXYgY2xhc3M9XCJzZWN0aW9uXCI+J1xuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gICAgIFwiPGg0PlR5cGU8L2g0PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8ZGl2PlwiICsgcmV0dXJuVmFsdWUgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIjwvZGl2PlwiXG5cbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uXG4iXX0=
