(function() {
  var AbstractProvider, ClassProvider, TextEditor, proxy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TextEditor = require('atom').TextEditor;

  proxy = require('./abstract-provider');

  AbstractProvider = require('./abstract-provider');

  module.exports = ClassProvider = (function(superClass) {
    extend(ClassProvider, superClass);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    ClassProvider.prototype.hoverEventSelectors = '.syntax--entity.syntax--inherited-class, .syntax--support.syntax--namespace, .syntax--support.syntax--class, .syntax--comment-clickable .syntax--region';


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    ClassProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var classInfo, description, fullClassName, ref, type;
      fullClassName = this.parser.getFullClassName(editor, term);
      proxy = require('../services/php-proxy.coffee');
      classInfo = proxy.methods(fullClassName);
      if (!classInfo || !classInfo.wasFound) {
        return;
      }
      type = '';
      if (classInfo.isClass) {
        type = (classInfo.isAbstract ? 'abstract ' : '') + 'class';
      } else if (classInfo.isTrait) {
        type = 'trait';
      } else if (classInfo.isInterface) {
        type = 'interface';
      }
      description = '';
      description += "<p><div>";
      description += type + ' ' + '<strong>' + classInfo.shortName + '</strong> &mdash; ' + classInfo["class"];
      description += '</div></p>';
      description += '<div>';
      description += (classInfo.args.descriptions.short ? classInfo.args.descriptions.short : '(No documentation available)');
      description += '</div>';
      if (((ref = classInfo.args.descriptions.long) != null ? ref.length : void 0) > 0) {
        description += '<div class="section">';
        description += "<h4>Description</h4>";
        description += "<div>" + classInfo.args.descriptions.long + "</div>";
        description += "</div>";
      }
      return description;
    };


    /**
     * Gets the correct selector when a class or namespace is clicked.
     *
     * @param  {jQuery.Event}  event  A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */

    ClassProvider.prototype.getSelectorFromEvent = function(event) {
      return this.parser.getClassSelectorFromEvent(event);
    };


    /**
     * Gets the correct element to attach the popover to from the retrieved selector.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    ClassProvider.prototype.getPopoverElementFromSelector = function(selector) {
      var array;
      array = this.$(selector).toArray();
      return array[array.length - 1];
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3Rvb2x0aXAvY2xhc3MtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLEtBQUEsR0FBUSxPQUFBLENBQVEscUJBQVI7O0VBQ1IsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUVNOzs7Ozs7OzRCQUNGLG1CQUFBLEdBQXFCOzs7QUFFckI7Ozs7Ozs7NEJBTUEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWY7QUFDZixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDO01BRWhCLEtBQUEsR0FBUSxPQUFBLENBQVEsOEJBQVI7TUFDUixTQUFBLEdBQVksS0FBSyxDQUFDLE9BQU4sQ0FBYyxhQUFkO01BRVosSUFBRyxDQUFJLFNBQUosSUFBaUIsQ0FBSSxTQUFTLENBQUMsUUFBbEM7QUFDSSxlQURKOztNQUdBLElBQUEsR0FBTztNQUVQLElBQUcsU0FBUyxDQUFDLE9BQWI7UUFDSSxJQUFBLEdBQU8sQ0FBSSxTQUFTLENBQUMsVUFBYixHQUE2QixXQUE3QixHQUE4QyxFQUEvQyxDQUFBLEdBQXFELFFBRGhFO09BQUEsTUFHSyxJQUFHLFNBQVMsQ0FBQyxPQUFiO1FBQ0QsSUFBQSxHQUFPLFFBRE47T0FBQSxNQUdBLElBQUcsU0FBUyxDQUFDLFdBQWI7UUFDRCxJQUFBLEdBQU8sWUFETjs7TUFJTCxXQUFBLEdBQWM7TUFFZCxXQUFBLElBQWU7TUFDZixXQUFBLElBQW1CLElBQUEsR0FBTyxHQUFQLEdBQWEsVUFBYixHQUEwQixTQUFTLENBQUMsU0FBcEMsR0FBZ0Qsb0JBQWhELEdBQXVFLFNBQVMsRUFBQyxLQUFEO01BQ25HLFdBQUEsSUFBZTtNQUdmLFdBQUEsSUFBZTtNQUNmLFdBQUEsSUFBbUIsQ0FBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUEvQixHQUEwQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUF0RSxHQUFpRiw4QkFBbEY7TUFDbkIsV0FBQSxJQUFlO01BR2YsMkRBQW1DLENBQUUsZ0JBQWxDLEdBQTJDLENBQTlDO1FBQ0ksV0FBQSxJQUFlO1FBQ2YsV0FBQSxJQUFtQjtRQUNuQixXQUFBLElBQW1CLE9BQUEsR0FBVSxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUF0QyxHQUE2QztRQUNoRSxXQUFBLElBQWUsU0FKbkI7O0FBTUEsYUFBTztJQXZDUTs7O0FBeUNuQjs7Ozs7Ozs7NEJBT0Esb0JBQUEsR0FBc0IsU0FBQyxLQUFEO0FBQ2xCLGFBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxLQUFsQztJQURXOzs7QUFHdEI7Ozs7Ozs0QkFLQSw2QkFBQSxHQUErQixTQUFDLFFBQUQ7QUFHM0IsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsQ0FBRCxDQUFHLFFBQUgsQ0FBWSxDQUFDLE9BQWIsQ0FBQTtBQUNSLGFBQU8sS0FBTSxDQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBZjtJQUpjOzs7O0tBakVQO0FBUDVCIiwic291cmNlc0NvbnRlbnQiOlsie1RleHRFZGl0b3J9ID0gcmVxdWlyZSAnYXRvbSdcblxucHJveHkgPSByZXF1aXJlICcuL2Fic3RyYWN0LXByb3ZpZGVyJ1xuQWJzdHJhY3RQcm92aWRlciA9IHJlcXVpcmUgJy4vYWJzdHJhY3QtcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgQ2xhc3NQcm92aWRlciBleHRlbmRzIEFic3RyYWN0UHJvdmlkZXJcbiAgICBob3ZlckV2ZW50U2VsZWN0b3JzOiAnLnN5bnRheC0tZW50aXR5LnN5bnRheC0taW5oZXJpdGVkLWNsYXNzLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tbmFtZXNwYWNlLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tY2xhc3MsIC5zeW50YXgtLWNvbW1lbnQtY2xpY2thYmxlIC5zeW50YXgtLXJlZ2lvbidcblxuICAgICMjIypcbiAgICAgKiBSZXRyaWV2ZXMgYSB0b29sdGlwIGZvciB0aGUgd29yZCBnaXZlbi5cbiAgICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBlZGl0b3IgICAgICAgICBUZXh0RWRpdG9yIHRvIHNlYXJjaCBmb3IgbmFtZXNwYWNlIG9mIHRlcm0uXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgdGVybSAgICAgICAgICAgVGVybSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSAge1BvaW50fSAgICAgIGJ1ZmZlclBvc2l0aW9uIFRoZSBjdXJzb3IgbG9jYXRpb24gdGhlIHRlcm0gaXMgYXQuXG4gICAgIyMjXG4gICAgZ2V0VG9vbHRpcEZvcldvcmQ6IChlZGl0b3IsIHRlcm0sIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgICAgICBmdWxsQ2xhc3NOYW1lID0gQHBhcnNlci5nZXRGdWxsQ2xhc3NOYW1lKGVkaXRvciwgdGVybSlcblxuICAgICAgICBwcm94eSA9IHJlcXVpcmUgJy4uL3NlcnZpY2VzL3BocC1wcm94eS5jb2ZmZWUnXG4gICAgICAgIGNsYXNzSW5mbyA9IHByb3h5Lm1ldGhvZHMoZnVsbENsYXNzTmFtZSlcblxuICAgICAgICBpZiBub3QgY2xhc3NJbmZvIG9yIG5vdCBjbGFzc0luZm8ud2FzRm91bmRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHR5cGUgPSAnJ1xuXG4gICAgICAgIGlmIGNsYXNzSW5mby5pc0NsYXNzXG4gICAgICAgICAgICB0eXBlID0gKGlmIGNsYXNzSW5mby5pc0Fic3RyYWN0IHRoZW4gJ2Fic3RyYWN0ICcgZWxzZSAnJykgKyAnY2xhc3MnXG5cbiAgICAgICAgZWxzZSBpZiBjbGFzc0luZm8uaXNUcmFpdFxuICAgICAgICAgICAgdHlwZSA9ICd0cmFpdCdcblxuICAgICAgICBlbHNlIGlmIGNsYXNzSW5mby5pc0ludGVyZmFjZVxuICAgICAgICAgICAgdHlwZSA9ICdpbnRlcmZhY2UnXG5cbiAgICAgICAgIyBDcmVhdGUgYSB1c2VmdWwgZGVzY3JpcHRpb24gdG8gc2hvdyBpbiB0aGUgdG9vbHRpcC5cbiAgICAgICAgZGVzY3JpcHRpb24gPSAnJ1xuXG4gICAgICAgIGRlc2NyaXB0aW9uICs9IFwiPHA+PGRpdj5cIlxuICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgdHlwZSArICcgJyArICc8c3Ryb25nPicgKyBjbGFzc0luZm8uc2hvcnROYW1lICsgJzwvc3Ryb25nPiAmbWRhc2g7ICcgKyBjbGFzc0luZm8uY2xhc3NcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gJzwvZGl2PjwvcD4nXG5cbiAgICAgICAgIyBTaG93IHRoZSBzdW1tYXJ5IChzaG9ydCBkZXNjcmlwdGlvbikuXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICc8ZGl2PidcbiAgICAgICAgZGVzY3JpcHRpb24gKz0gICAgIChpZiBjbGFzc0luZm8uYXJncy5kZXNjcmlwdGlvbnMuc2hvcnQgdGhlbiBjbGFzc0luZm8uYXJncy5kZXNjcmlwdGlvbnMuc2hvcnQgZWxzZSAnKE5vIGRvY3VtZW50YXRpb24gYXZhaWxhYmxlKScpXG4gICAgICAgIGRlc2NyaXB0aW9uICs9ICc8L2Rpdj4nXG5cbiAgICAgICAgIyBTaG93IHRoZSAobG9uZykgZGVzY3JpcHRpb24uXG4gICAgICAgIGlmIGNsYXNzSW5mby5hcmdzLmRlc2NyaXB0aW9ucy5sb25nPy5sZW5ndGggPiAwXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAnPGRpdiBjbGFzcz1cInNlY3Rpb25cIj4nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8aDQ+RGVzY3JpcHRpb248L2g0PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSAgICAgXCI8ZGl2PlwiICsgY2xhc3NJbmZvLmFyZ3MuZGVzY3JpcHRpb25zLmxvbmcgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIjwvZGl2PlwiXG5cbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uXG5cbiAgICAjIyMqXG4gICAgICogR2V0cyB0aGUgY29ycmVjdCBzZWxlY3RvciB3aGVuIGEgY2xhc3Mgb3IgbmFtZXNwYWNlIGlzIGNsaWNrZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtqUXVlcnkuRXZlbnR9ICBldmVudCAgQSBqUXVlcnkgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R8bnVsbH0gQSBzZWxlY3RvciB0byBiZSB1c2VkIHdpdGggalF1ZXJ5LlxuICAgICMjI1xuICAgIGdldFNlbGVjdG9yRnJvbUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgICAgIHJldHVybiBAcGFyc2VyLmdldENsYXNzU2VsZWN0b3JGcm9tRXZlbnQoZXZlbnQpXG5cbiAgICAjIyMqXG4gICAgICogR2V0cyB0aGUgY29ycmVjdCBlbGVtZW50IHRvIGF0dGFjaCB0aGUgcG9wb3ZlciB0byBmcm9tIHRoZSByZXRyaWV2ZWQgc2VsZWN0b3IuXG4gICAgICogQHBhcmFtICB7alF1ZXJ5LkV2ZW50fSAgZXZlbnQgIEEgalF1ZXJ5IGV2ZW50LlxuICAgICAqIEByZXR1cm4ge29iamVjdHxudWxsfSAgICAgICAgICBBIHNlbGVjdG9yIHRvIGJlIHVzZWQgd2l0aCBqUXVlcnkuXG4gICAgIyMjXG4gICAgZ2V0UG9wb3ZlckVsZW1lbnRGcm9tU2VsZWN0b3I6IChzZWxlY3RvcikgLT5cbiAgICAgICAgIyBnZXRTZWxlY3RvckZyb21FdmVudCBjYW4gcmV0dXJuIG11bHRpcGxlIGl0ZW1zIGJlY2F1c2UgbmFtZXNwYWNlcyBhbmQgY2xhc3MgbmFtZXMgYXJlIGRpZmZlcmVudCBIVE1MIGVsZW1lbnRzLlxuICAgICAgICAjIFdlIGhhdmUgdG8gc2VsZWN0IG9uZSB0byBhdHRhY2ggdGhlIHBvcG92ZXIgdG8uXG4gICAgICAgIGFycmF5ID0gQCQoc2VsZWN0b3IpLnRvQXJyYXkoKVxuICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV1cbiJdfQ==
