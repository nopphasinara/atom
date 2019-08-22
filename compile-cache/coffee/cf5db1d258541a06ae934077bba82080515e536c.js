(function() {
  var AbstractProvider, FunctionProvider, Point, TextEditor,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(superClass) {
    extend(FunctionProvider, superClass);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.hoverEventSelectors = '.syntax--function-call';


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    FunctionProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var accessModifier, description, exceptionType, info, param, parametersDescription, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, returnType, returnValue, thrownWhenDescription, throwsDescription, value;
      value = this.parser.getMemberContext(editor, term, bufferPosition);
      if (!value) {
        return;
      }
      description = "";
      accessModifier = '';
      returnType = '';
      if ((ref = value.args["return"]) != null ? ref.type : void 0) {
        returnType = value.args["return"].type;
      }
      if (value.isPublic) {
        accessModifier = 'public';
      } else if (value.isProtected) {
        accessModifier = 'protected';
      } else if (value.isFunction == null) {
        accessModifier = 'private';
      }
      description += "<p><div>";
      if (value.isFunction != null) {
        description += returnType + ' <strong>' + term + '</strong>' + '(';
      } else {
        description += accessModifier + ' ' + returnType + ' <strong>' + term + '</strong>' + '(';
      }
      if (((ref1 = value.args.parameters) != null ? ref1.length : void 0) > 0) {
        description += value.args.parameters.join(', ');
      }
      if (((ref2 = value.args.optionals) != null ? ref2.length : void 0) > 0) {
        description += '[';
        if (((ref3 = value.args.parameters) != null ? ref3.length : void 0) > 0) {
          description += ', ';
        }
        description += value.args.optionals.join(', ');
        description += ']';
      }
      description += ')';
      description += '</div></p>';
      description += '<div>';
      description += (value.args.descriptions.short ? value.args.descriptions.short : '(No documentation available)');
      description += '</div>';
      if (((ref4 = value.args.descriptions.long) != null ? ref4.length : void 0) > 0) {
        description += '<div class="section">';
        description += "<h4>Description</h4>";
        description += "<div>" + value.args.descriptions.long + "</div>";
        description += "</div>";
      }
      parametersDescription = "";
      ref5 = value.args.docParameters;
      for (param in ref5) {
        info = ref5[param];
        parametersDescription += "<tr>";
        parametersDescription += "<td>•&nbsp;<strong>";
        if (indexOf.call(value.args.optionals, param) >= 0) {
          parametersDescription += "[" + param + "]";
        } else {
          parametersDescription += param;
        }
        parametersDescription += "</strong></td>";
        parametersDescription += "<td>" + (info.type ? info.type : '&nbsp;') + '</td>';
        parametersDescription += "<td>" + (info.description ? info.description : '&nbsp;') + '</td>';
        parametersDescription += "</tr>";
      }
      if (parametersDescription.length > 0) {
        description += '<div class="section">';
        description += "<h4>Parameters</h4>";
        description += "<div><table>" + parametersDescription + "</table></div>";
        description += "</div>";
      }
      if ((ref6 = value.args["return"]) != null ? ref6.type : void 0) {
        returnValue = '<strong>' + value.args["return"].type + '</strong>';
        if (value.args["return"].description) {
          returnValue += ' ' + value.args["return"].description;
        }
        description += '<div class="section">';
        description += "<h4>Returns</h4>";
        description += "<div>" + returnValue + "</div>";
        description += "</div>";
      }
      throwsDescription = "";
      ref7 = value.args.throws;
      for (exceptionType in ref7) {
        thrownWhenDescription = ref7[exceptionType];
        throwsDescription += "<div>";
        throwsDescription += "• <strong>" + exceptionType + "</strong>";
        if (thrownWhenDescription) {
          throwsDescription += ' ' + thrownWhenDescription;
        }
        throwsDescription += "</div>";
      }
      if (throwsDescription.length > 0) {
        description += '<div class="section">';
        description += "<h4>Throws</h4>";
        description += "<div>" + throwsDescription + "</div>";
        description += "</div>";
      }
      return description;
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3Rvb2x0aXAvZnVuY3Rpb24tcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBOzs7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFDVCxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7Ozs7OzsrQkFDRixtQkFBQSxHQUFxQjs7O0FBRXJCOzs7Ozs7OytCQU1BLGlCQUFBLEdBQW1CLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxjQUFmO0FBQ2YsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDO01BRVIsSUFBRyxDQUFJLEtBQVA7QUFDSSxlQURKOztNQUdBLFdBQUEsR0FBYztNQUdkLGNBQUEsR0FBaUI7TUFDakIsVUFBQSxHQUFhO01BRWIsOENBQW9CLENBQUUsYUFBdEI7UUFDSSxVQUFBLEdBQWEsS0FBSyxDQUFDLElBQUksRUFBQyxNQUFELEVBQU8sQ0FBQyxLQURuQzs7TUFHQSxJQUFHLEtBQUssQ0FBQyxRQUFUO1FBQ0ksY0FBQSxHQUFpQixTQURyQjtPQUFBLE1BR0ssSUFBRyxLQUFLLENBQUMsV0FBVDtRQUNELGNBQUEsR0FBaUIsWUFEaEI7T0FBQSxNQUdBLElBQU8sd0JBQVA7UUFDRCxjQUFBLEdBQWlCLFVBRGhCOztNQUdMLFdBQUEsSUFBZTtNQUVmLElBQUcsd0JBQUg7UUFDRSxXQUFBLElBQWUsVUFBQSxHQUFhLFdBQWIsR0FBMkIsSUFBM0IsR0FBa0MsV0FBbEMsR0FBZ0QsSUFEakU7T0FBQSxNQUFBO1FBR0UsV0FBQSxJ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OUI7UUFDSSxXQUFBLElBQWU7UUFDZixXQUFBLElBQW1CO1FBQ25CLFdBQUEsSUFBbUIsT0FBQSxHQUFVLGlCQUFWLEdBQThCO1FBQ2pELFdBQUEsSUFBZSxTQUpuQjs7QUFNQSxhQUFPO0lBbEhROzs7O0tBVFE7QUFQL0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcbntUZXh0RWRpdG9yfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkFic3RyYWN0UHJvdmlkZXIgPSByZXF1aXJlICcuL2Fic3RyYWN0LXByb3ZpZGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEZ1bmN0aW9uUHJvdmlkZXIgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgaG92ZXJFdmVudFNlbGVjdG9yczogJy5zeW50YXgtLWZ1bmN0aW9uLWNhbGwnXG5cbiAgICAjIyMqXG4gICAgICogUmV0cmlldmVzIGEgdG9vbHRpcCBmb3IgdGhlIHdvcmQgZ2l2ZW4uXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yICAgICAgICAgVGV4dEVkaXRvciB0byBzZWFyY2ggZm9yIG5hbWVzcGFjZSBvZiB0ZXJtLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gICAgIHRlcm0gICAgICAgICAgIFRlcm0gdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0gIHtQb2ludH0gICAgICBidWZmZXJQb3NpdGlvbiBUaGUgY3Vyc29yIGxvY2F0aW9uIHRoZSB0ZXJtIGlzIGF0LlxuICAgICMjI1xuICAgIGdldFRvb2x0aXBGb3JXb3JkOiAoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICAgICAgdmFsdWUgPSBAcGFyc2VyLmdldE1lbWJlckNvbnRleHQoZWRpdG9yLCB0ZXJtLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBpZiBub3QgdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGRlc2NyaXB0aW9uID0gXCJcIlxuXG4gICAgICAgICMgU2hvdyB0aGUgbWV0aG9kJ3Mgc2lnbmF0dXJlLlxuICAgICAgICBhY2Nlc3NNb2RpZmllciA9ICcnXG4gICAgICAgIHJldHVyblR5cGUgPSAnJ1xuXG4gICAgICAgIGlmIHZhbHVlLmFyZ3MucmV0dXJuPy50eXBlXG4gICAgICAgICAgICByZXR1cm5UeXBlID0gdmFsdWUuYXJncy5yZXR1cm4udHlwZVxuXG4gICAgICAgIGlmIHZhbHVlLmlzUHVibGljXG4gICAgICAgICAgICBhY2Nlc3NNb2RpZmllciA9ICdwdWJsaWMnXG5cbiAgICAgICAgZWxzZSBpZiB2YWx1ZS5pc1Byb3RlY3RlZFxuICAgICAgICAgICAgYWNjZXNzTW9kaWZpZXIgPSAncHJvdGVjdGVkJ1xuXG4gICAgICAgIGVsc2UgaWYgbm90IHZhbHVlLmlzRnVuY3Rpb24/XG4gICAgICAgICAgICBhY2Nlc3NNb2RpZmllciA9ICdwcml2YXRlJ1xuXG4gICAgICAgIGRlc2NyaXB0aW9uICs9IFwiPHA+PGRpdj5cIlxuXG4gICAgICAgIGlmIHZhbHVlLmlzRnVuY3Rpb24/XG4gICAgICAgICAgZGVzY3JpcHRpb24gKz0gcmV0dXJuVHlwZSArICcgPHN0cm9uZz4nICsgdGVybSArICc8L3N0cm9uZz4nICsgJygnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZXNjcmlwdGlvbiArPSBhY2Nlc3NNb2RpZmllciArICcgJyArIHJldHVyblR5cGUgKyAnIDxzdHJvbmc+JyArIHRlcm0gKyAnPC9zdHJvbmc+JyArICcoJ1xuXG4gICAgICAgIGlmIHZhbHVlLmFyZ3MucGFyYW1ldGVycz8ubGVuZ3RoID4gMFxuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gdmFsdWUuYXJncy5wYXJhbWV0ZXJzLmpvaW4oJywgJyk7XG5cbiAgICAgICAgaWYgdmFsdWUuYXJncy5vcHRpb25hbHM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICdbJ1xuXG4gICAgICAgICAgICBpZiB2YWx1ZS5hcmdzLnBhcmFtZXRlcnM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAnLCAnXG5cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9IHZhbHVlLmFyZ3Mub3B0aW9uYWxzLmpvaW4oJywgJylcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICddJ1xuXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICcpJ1xuICAgICAgICBkZXNjcmlwdGlvbiArPSAnPC9kaXY+PC9wPidcblxuICAgICAgICAjIFNob3cgdGhlIHN1bW1hcnkgKHNob3J0IGRlc2NyaXB0aW9uKS5cbiAgICAgICAgZGVzY3JpcHRpb24gKz0gJzxkaXY+J1xuICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgKGlmIHZhbHVlLmFyZ3MuZGVzY3JpcHRpb25zLnNob3J0IHRoZW4gdmFsdWUuYXJncy5kZXNjcmlwdGlvbnMuc2hvcnQgZWxzZSAnKE5vIGRvY3VtZW50YXRpb24gYXZhaWxhYmxlKScpXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICc8L2Rpdj4nXG5cbiAgICAgICAgIyBTaG93IHRoZSAobG9uZykgZGVzY3JpcHRpb24uXG4gICAgICAgIGlmIHZhbHVlLmFyZ3MuZGVzY3JpcHRpb25zLmxvbmc/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICc8ZGl2IGNsYXNzPVwic2VjdGlvblwiPidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICAgICBcIjxoND5EZXNjcmlwdGlvbjwvaDQ+XCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICAgICBcIjxkaXY+XCIgKyB2YWx1ZS5hcmdzLmRlc2NyaXB0aW9ucy5sb25nICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gXCI8L2Rpdj5cIlxuXG4gICAgICAgICMgU2hvdyB0aGUgcGFyYW1ldGVycyB0aGUgbWV0aG9kIGhhcy5cbiAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uID0gXCJcIlxuXG4gICAgICAgIGZvciBwYXJhbSxpbmZvIG9mIHZhbHVlLmFyZ3MuZG9jUGFyYW1ldGVyc1xuICAgICAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICs9IFwiPHRyPlwiXG5cbiAgICAgICAgICAgIHBhcmFtZXRlcnNEZXNjcmlwdGlvbiArPSBcIjx0ZD7igKImbmJzcDs8c3Ryb25nPlwiXG5cbiAgICAgICAgICAgIGlmIHBhcmFtIGluIHZhbHVlLmFyZ3Mub3B0aW9uYWxzXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICs9IFwiW1wiICsgcGFyYW0gKyBcIl1cIlxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICs9IHBhcmFtXG5cbiAgICAgICAgICAgIHBhcmFtZXRlcnNEZXNjcmlwdGlvbiArPSBcIjwvc3Ryb25nPjwvdGQ+XCJcblxuICAgICAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICs9IFwiPHRkPlwiICsgKGlmIGluZm8udHlwZSB0aGVuIGluZm8udHlwZSBlbHNlICcmbmJzcDsnKSArICc8L3RkPidcbiAgICAgICAgICAgIHBhcmFtZXRlcnNEZXNjcmlwdGlvbiArPSBcIjx0ZD5cIiArIChpZiBpbmZvLmRlc2NyaXB0aW9uIHRoZW4gaW5mby5kZXNjcmlwdGlvbiBlbHNlICcmbmJzcDsnKSArICc8L3RkPidcblxuICAgICAgICAgICAgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICs9IFwiPC90cj5cIlxuXG4gICAgICAgIGlmIHBhcmFtZXRlcnNEZXNjcmlwdGlvbi5sZW5ndGggPiAwXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAnPGRpdiBjbGFzcz1cInNlY3Rpb25cIj4nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8aDQ+UGFyYW1ldGVyczwvaDQ+XCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICAgICBcIjxkaXY+PHRhYmxlPlwiICsgcGFyYW1ldGVyc0Rlc2NyaXB0aW9uICsgXCI8L3RhYmxlPjwvZGl2PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIjwvZGl2PlwiXG5cbiAgICAgICAgaWYgdmFsdWUuYXJncy5yZXR1cm4/LnR5cGVcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gJzxzdHJvbmc+JyArIHZhbHVlLmFyZ3MucmV0dXJuLnR5cGUgKyAnPC9zdHJvbmc+J1xuXG4gICAgICAgICAgICBpZiB2YWx1ZS5hcmdzLnJldHVybi5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblZhbHVlICs9ICcgJyArIHZhbHVlLmFyZ3MucmV0dXJuLmRlc2NyaXB0aW9uXG5cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICc8ZGl2IGNsYXNzPVwic2VjdGlvblwiPidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICAgICBcIjxoND5SZXR1cm5zPC9oND5cIlxuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gICAgIFwiPGRpdj5cIiArIHJldHVyblZhbHVlICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICAgZGVzY3JpcHRpb24gKz0gXCI8L2Rpdj5cIlxuXG4gICAgICAgICMgU2hvdyBhbiBvdmVydmlldyBvZiB0aGUgZXhjZXB0aW9ucyB0aGUgbWV0aG9kIGNhbiB0aHJvdy5cbiAgICAgICAgdGhyb3dzRGVzY3JpcHRpb24gPSBcIlwiXG5cbiAgICAgICAgZm9yIGV4Y2VwdGlvblR5cGUsdGhyb3duV2hlbkRlc2NyaXB0aW9uIG9mIHZhbHVlLmFyZ3MudGhyb3dzXG4gICAgICAgICAgICB0aHJvd3NEZXNjcmlwdGlvbiArPSBcIjxkaXY+XCJcbiAgICAgICAgICAgIHRocm93c0Rlc2NyaXB0aW9uICs9IFwi4oCiIDxzdHJvbmc+XCIgKyBleGNlcHRpb25UeXBlICsgXCI8L3N0cm9uZz5cIlxuXG4gICAgICAgICAgICBpZiB0aHJvd25XaGVuRGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICB0aHJvd3NEZXNjcmlwdGlvbiArPSAnICcgKyB0aHJvd25XaGVuRGVzY3JpcHRpb25cblxuICAgICAgICAgICAgdGhyb3dzRGVzY3JpcHRpb24gKz0gXCI8L2Rpdj5cIlxuXG4gICAgICAgIGlmIHRocm93c0Rlc2NyaXB0aW9uLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICc8ZGl2IGNsYXNzPVwic2VjdGlvblwiPidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uICs9ICAgICBcIjxoND5UaHJvd3M8L2g0PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8ZGl2PlwiICsgdGhyb3dzRGVzY3JpcHRpb24gKyBcIjwvZGl2PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIjwvZGl2PlwiXG5cbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uXG4iXX0=
