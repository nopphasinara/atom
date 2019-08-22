(function() {
  var AbstractProvider, ClassProvider,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AbstractProvider = require('./abstract-provider');

  module.exports = ClassProvider = (function(superClass) {
    extend(ClassProvider, superClass);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    ClassProvider.prototype.hoverEventSelectors = '.syntax--entity.syntax--inherited-class, .syntax--support.syntax--namespace, .syntax--support.syntax--class, .syntax--comment-clickable .syntax--region';

    ClassProvider.prototype.clickEventSelectors = '.syntax--entity.syntax--inherited-class, .syntax--support.syntax--namespace, .syntax--support.syntax--class';

    ClassProvider.prototype.gotoRegex = /^\\?[A-Z][A-za-z0-9_]*(\\[A-Z][A-Za-z0-9_])*$/;


    /**
     * Goto the class from the term given.
     *
     * @param  {TextEditor} editor TextEditor to search for namespace of term.
     * @param  {string}     term   Term to search for.
     */

    ClassProvider.prototype.gotoFromWord = function(editor, term) {
      var classInfo, classesResponse, matches, proxy, regexMatches;
      if (term === void 0 || term.indexOf('$') === 0) {
        return;
      }
      term = this.parser.getFullClassName(editor, term);
      proxy = require('../services/php-proxy.coffee');
      classesResponse = proxy.classes();
      if (!classesResponse.autocomplete) {
        return;
      }
      this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
      matches = this.fuzzaldrin.filter(classesResponse.autocomplete, term);
      if (matches[0] === term) {
        regexMatches = /(?:\\)(\w+)$/i.exec(matches[0]);
        if (regexMatches === null || regexMatches.length === 0) {
          this.jumpWord = matches[0];
        } else {
          this.jumpWord = regexMatches[1];
        }
        classInfo = proxy.methods(matches[0]);
        return atom.workspace.open(classInfo.filename, {
          searchAllPanes: true
        });
      }
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
     * Goes through all the lines within the editor looking for classes within comments. More specifically if they have
     * @var, @param or @return prefixed.
     *
     * @param  {TextEditor} editor The editor to search through.
     */

    ClassProvider.prototype.registerMarkers = function(editor) {
      var key, regex, results, row, rows, text;
      text = editor.getText();
      rows = text.split('\n');
      results = [];
      for (key in rows) {
        row = rows[key];
        regex = /@param|@var|@return|@throws|@see/gi;
        if (regex.test(row)) {
          results.push(this.addMarkerToCommentLine(row.split(' '), parseInt(key), editor, true));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };


    /**
     * Removes any markers previously created by registerMarkers.
     *
     * @param {TextEditor} editor The editor to search through
     */

    ClassProvider.prototype.cleanMarkers = function(editor) {
      var i, marker, ref;
      ref = this.allMarkers[editor.getLongTitle()];
      for (i in ref) {
        marker = ref[i];
        marker.destroy();
      }
      return this.allMarkers = [];
    };


    /**
     * Analyses the words array given for any classes and then creates a marker for them.
     *
     * @param {array} words           The array of words to check.
     * @param {int} rowIndex          The current row the words are on within the editor.
     * @param {TextEditor} editor     The editor the words are from.
     * @param {bool} shouldBreak      Flag to say whether the search should break after finding 1 class.
     * @param {int} currentIndex  = 0 The current column index the search is on.
     * @param {int} offset        = 0 Any offset that should be applied when creating the marker.
     */

    ClassProvider.prototype.addMarkerToCommentLine = function(words, rowIndex, editor, shouldBreak, currentIndex, offset) {
      var key, keywordRegex, marker, markerProperties, options, range, regex, results, value;
      if (currentIndex == null) {
        currentIndex = 0;
      }
      if (offset == null) {
        offset = 0;
      }
      results = [];
      for (key in words) {
        value = words[key];
        regex = /^\\?([A-Za-z0-9_]+)\\?([A-Za-zA-Z_\\]*)?/g;
        keywordRegex = /^(array|object|bool|string|static|null|boolean|void|int|integer|mixed|callable)$/gi;
        if (value && regex.test(value) && keywordRegex.test(value) === false) {
          if (value.includes('|')) {
            this.addMarkerToCommentLine(value.split('|'), rowIndex, editor, false, currentIndex, parseInt(key));
          } else {
            range = [[rowIndex, currentIndex + parseInt(key) + offset], [rowIndex, currentIndex + parseInt(key) + value.length + offset]];
            marker = editor.markBufferRange(range);
            markerProperties = {
              term: value
            };
            marker.setProperties(markerProperties);
            options = {
              type: 'highlight',
              "class": 'comment-clickable comment'
            };
            if (!marker.isDestroyed()) {
              editor.decorateMarker(marker, options);
            }
            if (this.allMarkers[editor.getLongTitle()] === void 0) {
              this.allMarkers[editor.getLongTitle()] = [];
            }
            this.allMarkers[editor.getLongTitle()].push(marker);
          }
          if (shouldBreak === true) {
            break;
          }
        }
        results.push(currentIndex += value.length);
      }
      return results;
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param  {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    ClassProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("^(class|interface|abstractclass|trait) +" + term, "i");
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2dvdG8vY2xhc3MtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBOzs7RUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBRU07Ozs7Ozs7NEJBQ0YsbUJBQUEsR0FBcUI7OzRCQUNyQixtQkFBQSxHQUFxQjs7NEJBQ3JCLFNBQUEsR0FBVzs7O0FBRVg7Ozs7Ozs7NEJBTUEsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDVixVQUFBO01BQUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxLQUFxQixDQUE3QztBQUNJLGVBREo7O01BR0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsSUFBakM7TUFFUCxLQUFBLEdBQVEsT0FBQSxDQUFRLDhCQUFSO01BQ1IsZUFBQSxHQUFrQixLQUFLLENBQUMsT0FBTixDQUFBO01BRWxCLElBQUEsQ0FBYyxlQUFlLENBQUMsWUFBOUI7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXRCLEVBQXdDLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQXhDO01BR0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixlQUFlLENBQUMsWUFBbkMsRUFBaUQsSUFBakQ7TUFFVixJQUFHLE9BQVEsQ0FBQSxDQUFBLENBQVIsS0FBYyxJQUFqQjtRQUNJLFlBQUEsR0FBZSxlQUFlLENBQUMsSUFBaEIsQ0FBcUIsT0FBUSxDQUFBLENBQUEsQ0FBN0I7UUFF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R0EsSUFBRyxJQUFDLENBQUEsVUFBVyxDQUFBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxDQUFaLEtBQXNDLE1BQXpDO2NBQ0ksSUFBQyxDQUFBLFVBQVcsQ0FBQSxNQUFNLENBQUMsWUFBUCxDQUFBLENBQUEsQ0FBWixHQUFxQyxHQUR6Qzs7WUFHQSxJQUFDLENBQUEsVUFBVyxDQUFBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxDQUFzQixDQUFDLElBQW5DLENBQXdDLE1BQXhDLEVBdkJKOztVQXlCQSxJQUFHLFdBQUEsS0FBZSxJQUFsQjtBQUNJLGtCQURKO1dBMUJKOztxQkE2QkEsWUFBQSxJQUFnQixLQUFLLENBQUM7QUFqQzFCOztJQURvQjs7O0FBb0N4Qjs7Ozs7Ozs7NEJBT0EsY0FBQSxHQUFnQixTQUFDLElBQUQ7QUFDWixhQUFPLE1BQUEsQ0FBQSwwQ0FBQSxHQUErQyxJQUEvQyxFQUFzRCxHQUF0RDtJQURLOzs7O0tBcElRO0FBSjVCIiwic291cmNlc0NvbnRlbnQiOlsiQWJzdHJhY3RQcm92aWRlciA9IHJlcXVpcmUgJy4vYWJzdHJhY3QtcHJvdmlkZXInXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgQ2xhc3NQcm92aWRlciBleHRlbmRzIEFic3RyYWN0UHJvdmlkZXJcbiAgICBob3ZlckV2ZW50U2VsZWN0b3JzOiAnLnN5bnRheC0tZW50aXR5LnN5bnRheC0taW5oZXJpdGVkLWNsYXNzLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tbmFtZXNwYWNlLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tY2xhc3MsIC5zeW50YXgtLWNvbW1lbnQtY2xpY2thYmxlIC5zeW50YXgtLXJlZ2lvbidcbiAgICBjbGlja0V2ZW50U2VsZWN0b3JzOiAnLnN5bnRheC0tZW50aXR5LnN5bnRheC0taW5oZXJpdGVkLWNsYXNzLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tbmFtZXNwYWNlLCAuc3ludGF4LS1zdXBwb3J0LnN5bnRheC0tY2xhc3MnXG4gICAgZ290b1JlZ2V4OiAvXlxcXFw/W0EtWl1bQS16YS16MC05X10qKFxcXFxbQS1aXVtBLVphLXowLTlfXSkqJC9cblxuICAgICMjIypcbiAgICAgKiBHb3RvIHRoZSBjbGFzcyBmcm9tIHRoZSB0ZXJtIGdpdmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIFRleHRFZGl0b3IgdG8gc2VhcmNoIGZvciBuYW1lc3BhY2Ugb2YgdGVybS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICB0ZXJtICAgVGVybSB0byBzZWFyY2ggZm9yLlxuICAgICMjI1xuICAgIGdvdG9Gcm9tV29yZDogKGVkaXRvciwgdGVybSkgLT5cbiAgICAgICAgaWYgdGVybSA9PSB1bmRlZmluZWQgfHwgdGVybS5pbmRleE9mKCckJykgPT0gMFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdGVybSA9IEBwYXJzZXIuZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IsIHRlcm0pXG5cbiAgICAgICAgcHJveHkgPSByZXF1aXJlICcuLi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlJ1xuICAgICAgICBjbGFzc2VzUmVzcG9uc2UgPSBwcm94eS5jbGFzc2VzKClcblxuICAgICAgICByZXR1cm4gdW5sZXNzIGNsYXNzZXNSZXNwb25zZS5hdXRvY29tcGxldGVcblxuICAgICAgICBAbWFuYWdlci5hZGRCYWNrVHJhY2soZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG5cbiAgICAgICAgIyBTZWUgd2hhdCBtYXRjaGVzIHdlIGhhdmUgZm9yIHRoaXMgY2xhc3MgbmFtZS5cbiAgICAgICAgbWF0Y2hlcyA9IEBmdXp6YWxkcmluLmZpbHRlcihjbGFzc2VzUmVzcG9uc2UuYXV0b2NvbXBsZXRlLCB0ZXJtKVxuXG4gICAgICAgIGlmIG1hdGNoZXNbMF0gPT0gdGVybVxuICAgICAgICAgICAgcmVnZXhNYXRjaGVzID0gLyg/OlxcXFwpKFxcdyspJC9pLmV4ZWMobWF0Y2hlc1swXSlcblxuICAgICAgICAgICAgaWYgcmVnZXhNYXRjaGVzID09IG51bGwgfHwgcmVnZXhNYXRjaGVzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICAgICAgQGp1bXBXb3JkID0gbWF0Y2hlc1swXVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGp1bXBXb3JkID0gcmVnZXhNYXRjaGVzWzFdXG5cbiAgICAgICAgICAgIGNsYXNzSW5mbyA9IHByb3h5Lm1ldGhvZHMobWF0Y2hlc1swXSlcblxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihjbGFzc0luZm8uZmlsZW5hbWUsIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgICAgICAgfSlcblxuICAgICMjIypcbiAgICAgKiBHZXRzIHRoZSBjb3JyZWN0IHNlbGVjdG9yIHdoZW4gYSBjbGFzcyBvciBuYW1lc3BhY2UgaXMgY2xpY2tlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2pRdWVyeS5FdmVudH0gIGV2ZW50ICBBIGpRdWVyeSBldmVudC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdHxudWxsfSBBIHNlbGVjdG9yIHRvIGJlIHVzZWQgd2l0aCBqUXVlcnkuXG4gICAgIyMjXG4gICAgZ2V0U2VsZWN0b3JGcm9tRXZlbnQ6IChldmVudCkgLT5cbiAgICAgICAgcmV0dXJuIEBwYXJzZXIuZ2V0Q2xhc3NTZWxlY3RvckZyb21FdmVudChldmVudClcblxuICAgICMjIypcbiAgICAgKiBHb2VzIHRocm91Z2ggYWxsIHRoZSBsaW5lcyB3aXRoaW4gdGhlIGVkaXRvciBsb29raW5nIGZvciBjbGFzc2VzIHdpdGhpbiBjb21tZW50cy4gTW9yZSBzcGVjaWZpY2FsbHkgaWYgdGhleSBoYXZlXG4gICAgICogQHZhciwgQHBhcmFtIG9yIEByZXR1cm4gcHJlZml4ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGhlIGVkaXRvciB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAjIyNcbiAgICByZWdpc3Rlck1hcmtlcnM6IChlZGl0b3IpIC0+XG4gICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIHJvd3MgPSB0ZXh0LnNwbGl0KCdcXG4nKVxuXG4gICAgICAgIGZvciBrZXkscm93IG9mIHJvd3NcbiAgICAgICAgICAgIHJlZ2V4ID0gL0BwYXJhbXxAdmFyfEByZXR1cm58QHRocm93c3xAc2VlL2dpXG5cbiAgICAgICAgICAgIGlmIHJlZ2V4LnRlc3Qocm93KVxuICAgICAgICAgICAgICAgIEBhZGRNYXJrZXJUb0NvbW1lbnRMaW5lIHJvdy5zcGxpdCgnICcpLCBwYXJzZUludChrZXkpLCBlZGl0b3IsIHRydWVcblxuICAgICMjIypcbiAgICAgKiBSZW1vdmVzIGFueSBtYXJrZXJzIHByZXZpb3VzbHkgY3JlYXRlZCBieSByZWdpc3Rlck1hcmtlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUaGUgZWRpdG9yIHRvIHNlYXJjaCB0aHJvdWdoXG4gICAgIyMjXG4gICAgY2xlYW5NYXJrZXJzOiAoZWRpdG9yKSAtPlxuICAgICAgICBmb3IgaSxtYXJrZXIgb2YgQGFsbE1hcmtlcnNbZWRpdG9yLmdldExvbmdUaXRsZSgpXVxuICAgICAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuXG4gICAgICAgIEBhbGxNYXJrZXJzID0gW11cblxuICAgICMjIypcbiAgICAgKiBBbmFseXNlcyB0aGUgd29yZHMgYXJyYXkgZ2l2ZW4gZm9yIGFueSBjbGFzc2VzIGFuZCB0aGVuIGNyZWF0ZXMgYSBtYXJrZXIgZm9yIHRoZW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FycmF5fSB3b3JkcyAgICAgICAgICAgVGhlIGFycmF5IG9mIHdvcmRzIHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7aW50fSByb3dJbmRleCAgICAgICAgICBUaGUgY3VycmVudCByb3cgdGhlIHdvcmRzIGFyZSBvbiB3aXRoaW4gdGhlIGVkaXRvci5cbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciAgICAgVGhlIGVkaXRvciB0aGUgd29yZHMgYXJlIGZyb20uXG4gICAgICogQHBhcmFtIHtib29sfSBzaG91bGRCcmVhayAgICAgIEZsYWcgdG8gc2F5IHdoZXRoZXIgdGhlIHNlYXJjaCBzaG91bGQgYnJlYWsgYWZ0ZXIgZmluZGluZyAxIGNsYXNzLlxuICAgICAqIEBwYXJhbSB7aW50fSBjdXJyZW50SW5kZXggID0gMCBUaGUgY3VycmVudCBjb2x1bW4gaW5kZXggdGhlIHNlYXJjaCBpcyBvbi5cbiAgICAgKiBAcGFyYW0ge2ludH0gb2Zmc2V0ICAgICAgICA9IDAgQW55IG9mZnNldCB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHdoZW4gY3JlYXRpbmcgdGhlIG1hcmtlci5cbiAgICAjIyNcbiAgICBhZGRNYXJrZXJUb0NvbW1lbnRMaW5lOiAod29yZHMsIHJvd0luZGV4LCBlZGl0b3IsIHNob3VsZEJyZWFrLCBjdXJyZW50SW5kZXggPSAwLCBvZmZzZXQgPSAwKSAtPlxuICAgICAgICBmb3Iga2V5LHZhbHVlIG9mIHdvcmRzXG4gICAgICAgICAgICByZWdleCA9IC9eXFxcXD8oW0EtWmEtejAtOV9dKylcXFxcPyhbQS1aYS16QS1aX1xcXFxdKik/L2dcbiAgICAgICAgICAgIGtleXdvcmRSZWdleCA9IC9eKGFycmF5fG9iamVjdHxib29sfHN0cmluZ3xzdGF0aWN8bnVsbHxib29sZWFufHZvaWR8aW50fGludGVnZXJ8bWl4ZWR8Y2FsbGFibGUpJC9naVxuXG4gICAgICAgICAgICBpZiB2YWx1ZSAmJiByZWdleC50ZXN0KHZhbHVlKSAmJiBrZXl3b3JkUmVnZXgudGVzdCh2YWx1ZSkgPT0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZiB2YWx1ZS5pbmNsdWRlcygnfCcpXG4gICAgICAgICAgICAgICAgICAgIEBhZGRNYXJrZXJUb0NvbW1lbnRMaW5lIHZhbHVlLnNwbGl0KCd8JyksIHJvd0luZGV4LCBlZGl0b3IsIGZhbHNlLCBjdXJyZW50SW5kZXgsIHBhcnNlSW50KGtleSlcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2UgPSBbW3Jvd0luZGV4LCBjdXJyZW50SW5kZXggKyBwYXJzZUludChrZXkpICsgb2Zmc2V0XSwgW3Jvd0luZGV4LCBjdXJyZW50SW5kZXggKyBwYXJzZUludChrZXkpICsgdmFsdWUubGVuZ3RoICsgb2Zmc2V0XV07XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSlcblxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJQcm9wZXJ0aWVzID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlcm06IHZhbHVlXG5cbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNldFByb3BlcnRpZXMgbWFya2VyUHJvcGVydGllc1xuXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZ2hsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnY29tbWVudC1jbGlja2FibGUgY29tbWVudCdcblxuICAgICAgICAgICAgICAgICAgICBpZiAhbWFya2VyLmlzRGVzdHJveWVkKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsIG9wdGlvbnNcblxuICAgICAgICAgICAgICAgICAgICBpZiBAYWxsTWFya2Vyc1tlZGl0b3IuZ2V0TG9uZ1RpdGxlKCldID09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgQGFsbE1hcmtlcnNbZWRpdG9yLmdldExvbmdUaXRsZSgpXSA9IFtdXG5cbiAgICAgICAgICAgICAgICAgICAgQGFsbE1hcmtlcnNbZWRpdG9yLmdldExvbmdUaXRsZSgpXS5wdXNoKG1hcmtlcilcblxuICAgICAgICAgICAgICAgIGlmIHNob3VsZEJyZWFrID09IHRydWVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgY3VycmVudEluZGV4ICs9IHZhbHVlLmxlbmd0aDtcblxuICAgICMjIypcbiAgICAgKiBHZXRzIHRoZSByZWdleCB1c2VkIHdoZW4gbG9va2luZyBmb3IgYSB3b3JkIHdpdGhpbiB0aGUgZWRpdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRlcm0gVGVybSBiZWluZyBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtyZWdleH0gUmVnZXggdG8gYmUgdXNlZC5cbiAgICAjIyNcbiAgICBnZXRKdW1wVG9SZWdleDogKHRlcm0pIC0+XG4gICAgICAgIHJldHVybiAvLy9eKGNsYXNzfGludGVyZmFjZXxhYnN0cmFjdCBjbGFzc3x0cmFpdClcXCArI3t0ZXJtfS8vL2lcbiJdfQ==
