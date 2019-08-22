(function() {
  var AbstractProvider, SubAtom, TextEditor, config;

  TextEditor = require('atom').TextEditor;

  SubAtom = require('sub-atom');

  config = require('../config.coffee');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.allMarkers = [];

    AbstractProvider.prototype.hoverEventSelectors = '';

    AbstractProvider.prototype.clickEventSelectors = '';

    AbstractProvider.prototype.manager = {};

    AbstractProvider.prototype.gotoRegex = '';

    AbstractProvider.prototype.jumpWord = '';


    /**
     * Initialisation of Gotos
     *
     * @param {GotoManager} manager The manager that stores this goto. Used mainly for backtrack registering.
     */

    AbstractProvider.prototype.init = function(manager) {
      this.subAtom = new SubAtom;
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      this.fuzzaldrin = require('fuzzaldrin');
      this.manager = manager;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidSave(function(event) {
            return _this.rescanMarkers(editor);
          });
          _this.registerMarkers(editor);
          return _this.registerEvents(editor);
        };
      })(this));
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(paneItem) {
          if (paneItem instanceof TextEditor && _this.jumpWord !== '' && _this.jumpWord !== void 0) {
            _this.jumpTo(paneItem, _this.jumpWord);
            return _this.jumpWord = '';
          }
        };
      })(this));
      atom.workspace.onDidDestroyPane((function(_this) {
        return function(pane) {
          var i, len, paneItem, panes, ref, results;
          panes = atom.workspace.getPanes();
          if (panes.length === 1) {
            ref = panes[0].items;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              paneItem = ref[i];
              if (paneItem instanceof TextEditor) {
                results.push(_this.registerEvents(paneItem));
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        };
      })(this));
      return atom.workspace.onDidAddPane((function(_this) {
        return function(observedPane) {
          var i, len, pane, paneItem, panes, results;
          panes = atom.workspace.getPanes();
          results = [];
          for (i = 0, len = panes.length; i < len; i++) {
            pane = panes[i];
            if (pane === observedPane) {
              continue;
            }
            results.push((function() {
              var j, len1, ref, results1;
              ref = pane.items;
              results1 = [];
              for (j = 0, len1 = ref.length; j < len1; j++) {
                paneItem = ref[j];
                if (paneItem instanceof TextEditor) {
                  results1.push(this.registerEvents(paneItem));
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            }).call(_this));
          }
          return results;
        };
      })(this));
    };


    /**
     * Deactives the goto feature.
     */

    AbstractProvider.prototype.deactivate = function() {
      var allMarkers;
      this.subAtom.dispose();
      return allMarkers = [];
    };


    /**
     * Goto from the current cursor position in the editor.
     *
     * @param {TextEditor} editor TextEditor to pull term from.
     */

    AbstractProvider.prototype.gotoFromEditor = function(editor) {
      var position, term, termParts;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        position = editor.getCursorBufferPosition();
        term = this.parser.getFullWordFromBufferPosition(editor, position);
        termParts = term.split(/(?:\-\>|::)/);
        term = termParts.pop().replace('(', '');
        return this.gotoFromWord(editor, term);
      }
    };


    /**
     * Goto from the term given.
     *
     * @param  {TextEditor} editor TextEditor to search for namespace of term.
     * @param  {string}     term   Term to search for.
     */

    AbstractProvider.prototype.gotoFromWord = function(editor, term) {};


    /**
     * Registers the mouse events for alt-click.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var scrollViewElement, textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        textEditorElement = atom.views.getView(editor);
        scrollViewElement = this.$(textEditorElement).find('.scroll-view');
        this.subAtom.add(scrollViewElement, 'mousemove', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            if (!_this.isGotoKeyPressed(event)) {
              return;
            }
            selector = _this.getSelectorFromEvent(event);
            if (!selector) {
              return;
            }
            _this.$(selector).css('border-bottom', '1px solid ' + _this.$(selector).css('color'));
            _this.$(selector).css('cursor', 'pointer');
            return _this.isHovering = true;
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'mouseout', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            if (!_this.isHovering) {
              return;
            }
            selector = _this.getSelectorFromEvent(event);
            if (!selector) {
              return;
            }
            _this.$(selector).css('border-bottom', '');
            _this.$(selector).css('cursor', '');
            return _this.isHovering = false;
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'click', this.clickEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            selector = _this.getSelectorFromEvent(event);
            if (selector === null || _this.isGotoKeyPressed(event) === false) {
              return;
            }
            if (event.handled !== true) {
              _this.gotoFromWord(editor, _this.$(selector).text());
              return event.handled = true;
            }
          };
        })(this));
        return editor.onDidChangeCursorPosition((function(_this) {
          return function(event) {
            var allKey, allMarker, key, marker, markerProperties, markers, results;
            if (!_this.isHovering) {
              return;
            }
            markerProperties = {
              containsBufferPosition: event.newBufferPosition
            };
            markers = event.cursor.editor.findMarkers(markerProperties);
            results = [];
            for (key in markers) {
              marker = markers[key];
              results.push((function() {
                var ref, results1;
                ref = this.allMarkers[editor.getLongTitle()];
                results1 = [];
                for (allKey in ref) {
                  allMarker = ref[allKey];
                  if (marker.id === allMarker.id) {
                    this.gotoFromWord(event.cursor.editor, marker.getProperties().term);
                    break;
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this));
      }
    };


    /**
     * Check if the key binded to the goto with click is pressed or not (according to the settings)
     *
     * @param  {Object}  event JS event
     *
     * @return {Boolean}
     */

    AbstractProvider.prototype.isGotoKeyPressed = function(event) {
      switch (config.config.gotoKey) {
        case 'ctrl':
          return event.ctrlKey;
        case 'alt':
          return event.altKey;
        case 'cmd':
          return event.metaKey;
        default:
          return false;
      }
    };


    /**
     * Register any markers that you need.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.registerMarkers = function(editor) {};


    /**
     * Removes any markers previously created by registerMarkers.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.cleanMarkers = function(editor) {};


    /**
     * Rescans the editor, updating all markers.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.rescanMarkers = function(editor) {
      this.cleanMarkers(editor);
      return this.registerMarkers(editor);
    };


    /**
     * Gets the correct selector when a selector is clicked.
     *
     * @param  {jQuery.Event} event A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getSelectorFromEvent = function(event) {
      return event.currentTarget;
    };


    /**
     * Returns whether this goto is able to jump using the term.
     *
     * @param  {string} term Term to check.
     *
     * @return {boolean} Whether a jump is possible.
     */

    AbstractProvider.prototype.canGoto = function(term) {
      var ref;
      return ((ref = term.match(this.gotoRegex)) != null ? ref.length : void 0) > 0;
    };


    /**
     * Gets the regex used when looking for a word within the editor.
     *
     * @param {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    AbstractProvider.prototype.getJumpToRegex = function(term) {};


    /**
     * Jumps to a word within the editor
     * @param  {TextEditor} editor The editor that has the function in.
     * @param  {string} word       The word to find and then jump to.
     * @return {boolean}           Whether the finding was successful.
     */

    AbstractProvider.prototype.jumpTo = function(editor, word) {
      var bufferPosition;
      bufferPosition = this.parser.findBufferPositionOfWord(editor, word, this.getJumpToRegex(word));
      if (bufferPosition === null) {
        return false;
      }
      return setTimeout(function() {
        editor.setCursorBufferPosition(bufferPosition, {
          autoscroll: false
        });
        return editor.scrollToScreenPosition(editor.screenPositionForBufferPosition(bufferPosition), {
          center: true
        });
      }, 100);
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2dvdG8vYWJzdHJhY3QtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVixNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBRU07OzsrQkFDRixVQUFBLEdBQVk7OytCQUNaLG1CQUFBLEdBQXFCOzsrQkFDckIsbUJBQUEsR0FBcUI7OytCQUNyQixPQUFBLEdBQVM7OytCQUNULFNBQUEsR0FBVzs7K0JBQ1gsUUFBQSxHQUFVOzs7QUFFVjs7Ozs7OytCQUtBLElBQUEsR0FBTSxTQUFDLE9BQUQ7TUFDRixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFDLENBQUEsQ0FBRCxHQUFLLE9BQUEsQ0FBUSxRQUFSO01BQ0wsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFBLENBQVEsNkJBQVI7TUFDVixJQUFDLENBQUEsVUFBRCxHQUFjLE9BQUEsQ0FBUSxZQUFSO01BRWQsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUVYLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDOUIsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxLQUFEO21CQUNiLEtBQUMsQ0FBQSxhQUFELENBQWUsTUFBZjtVQURhLENBQWpCO1VBR0EsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakI7aUJBQ0EsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEI7UUFMOEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO01BT0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtVQUNyQyxJQUFHLFFBQUEsWUFBb0IsVUFBcEIsSUFBa0MsS0FBQyxDQUFBLFFBQUQsS0FBYSxFQUEvQyxJQUFxRCxLQUFDLENBQUEsUUFBRCxLQUFhLE1BQXJFO1lBQ0ksS0FBQyxDQUFBLE1BQUQsQ0FBUSxRQUFSLEVBQWtCLEtBQUMsQ0FBQSxRQUFuQjttQkFDQSxLQUFDLENBQUEsUUFBRCxHQUFZLEdBRmhCOztRQURxQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFNQSxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFmLENBQWdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO0FBQzVCLGNBQUE7VUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUE7VUFFUixJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO0FBQ0k7QUFBQTtpQkFBQSxxQ0FBQTs7Y0FDSSxJQUFHLFFBQUEsWUFBb0IsVUFBdkI7NkJBQ0ksS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsR0FESjtlQUFBLE1BQUE7cUNBQUE7O0FBREo7MkJBREo7O1FBSDRCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQzthQVNBLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsWUFBRDtBQUN4QixjQUFBO1VBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBO0FBRVI7ZUFBQSx1Q0FBQTs7WUFDSSxJQUFHLElBQUEsS0FBUSxZQUFYO0FBQ0ksdUJBREo7Ozs7QUFHQTtBQUFBO21CQUFBLHVDQUFBOztnQkFDSSxJQUFHLFFBQUEsWUFBb0IsVUFBdkI7Z0NBQ0ksSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsR0FESjtpQkFBQSxNQUFBO3dDQUFBOztBQURKOzs7QUFKSjs7UUFId0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO0lBL0JFOzs7QUEwQ047Ozs7K0JBR0EsVUFBQSxHQUFZLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUE7YUFDQSxVQUFBLEdBQWE7SUFGTDs7O0FBSVo7Ozs7OzsrQkFLQSxjQUFBLEdBQWdCLFNBQUMsTUFBRDtBQUNaLFVBQUE7TUFBQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFTLENBQUMsS0FBOUIsQ0FBb0MsZ0JBQXBDLENBQUg7UUFDSSxRQUFBLEdBQVcsTUFBTSxDQUFDLHVCQUFQLENBQUE7UUFDWCxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyw2QkFBUixDQUFzQyxNQUF0QyxFQUE4QyxRQUE5QztRQUVQLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLGFBQVg7UUFDWixJQUFBLEdBQU8sU0FBUyxDQUFDLEdBQVYsQ0FBQSxDQUFlLENBQUMsT0FBaEIsQ0FBd0IsR0FBeEIsRUFBNkIsRUFBN0I7ZUFFUCxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFBc0IsSUFBdEIsRUFQSjs7SUFEWTs7O0FBVWhCOzs7Ozs7OytCQU1BLFlBQUEsR0FBYyxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7OztBQUVkOzs7Ozs7K0JBS0EsY0FBQSxHQUFnQixTQUFDLE1BQUQ7QUFDWixVQUFBO01BQUEsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLEtBQTlCLENBQW9DLGdCQUFwQyxDQUFIO1FBQ0ksaUJBQUEsR0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO1FBQ3BCLGlCQUFBLEdBQW9CLElBQUMsQ0FBQSxDQUFELENBQUcsaUJBQUgsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixjQUEzQjtRQUVwQixJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxpQkFBYixFQUFnQyxXQUFoQyxFQUE2QyxJQUFDLENBQUEsbUJBQTlDLEVBQW1FLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtBQUMvRCxnQkFBQTtZQUFBLElBQUEsQ0FBYyxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBbEIsQ0FBZDtBQUFBLHFCQUFBOztZQUVBLFFBQUEsR0FBVyxLQUFDLENBQUEsb0JBQUQsQ0FBc0IsS0FBdEI7WUFFWCxJQUFBLENBQWMsUUFBZDtBQUFBLHFCQUFBOztZQUVBLEtBQUMsQ0FBQSxDQUFELENBQUcsUUFBSCxDQUFZLENBQUMsR0FBYixDQUFpQixlQUFqQixFQUFrQyxZQUFBLEdBQWUsS0FBQyxDQUFBLENBQUQsQ0FBRyxRQUFILENBQVksQ0FBQyxHQUFiLENBQWlCLE9BQWpCLENBQWpEO1lBQ0EsS0FBQyxDQUFBLENBQUQsQ0FBRyxRQUFILENBQVksQ0FBQyxHQUFiLENBQWlCLFFBQWpCLEVBQTJCLFNBQTNCO21CQUVBLEtBQUMsQ0FBQSxVQUFELEdBQWM7VUFWaUQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5FO1FBWUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsaUJBQWIsRUFBZ0MsVUFBaEMsRUFBNEMsSUFBQyxDQUFBLG1CQUE3QyxFQUFrRSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7QUFDOUQsZ0JBQUE7WUFBQSxJQUFBLENBQWMsS0FBQyxDQUFBLFVBQWY7QUFBQSxxQkFBQTs7WUFFQSxRQUFBLEdBQVcsS0FBQyxDQUFBLG9CQUFELENBQXNCLEtBQXRCO1lBRVgsSUFBQSxDQUFjLFFBQWQ7QUFBQSxxQkFBQTs7WUFFQSxLQUFDLENBQUEsQ0FBRCxDQUFHLFFBQUgsQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsZUFBakIsRUFBa0MsRUFBbEM7WUFDQSxLQUFDLENBQUEsQ0FBRCxDQUFHLFFBQUgsQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkIsRUFBM0I7bUJBRUEsS0FBQyxDQUFBLFVBQUQsR0FBYztVQVZnRDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEU7UUFZQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxpQkFBYixFQUFnQyxPQUFoQyxFQUF5QyxJQUFDLENBQUEsbUJBQTFDLEVBQStELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtBQUMzRCxnQkFBQTtZQUFBLFFBQUEsR0FBVyxLQUFDLENBQUEsb0JBQUQsQ0FBc0IsS0FBdEI7WUFFWCxJQUFHLFFBQUEsS0FBWSxJQUFaLElBQW9CLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQixDQUFBLEtBQTRCLEtBQW5EO0FBQ0kscUJBREo7O1lBR0EsSUFBRyxLQUFLLENBQUMsT0FBTixLQUFpQixJQUFwQjtjQUNJLEtBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixLQUFDLENBQUEsQ0FBRCxDQUFHLFFBQUgsQ0FBWSxDQUFDLElBQWIsQ0FBQSxDQUF0QjtxQkFDQSxLQUFLLENBQUMsT0FBTixHQUFnQixLQUZwQjs7VUFOMkQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9EO2VBV0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtBQUM3QixnQkFBQTtZQUFBLElBQUEsQ0FBYyxLQUFDLENBQUEsVUFBZjtBQUFBLHFCQUFBOztZQUVBLGdCQUFBLEdBQ0k7Y0FBQSxzQkFBQSxFQUF3QixLQUFLLENBQUMsaUJBQTlCOztZQUVKLE9BQUEsR0FBVSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFwQixDQUFnQyxnQkFBaEM7QUFFVjtpQkFBQSxjQUFBOzs7O0FBQ0k7QUFBQTtxQkFBQSxhQUFBOztrQkFDSSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsU0FBUyxDQUFDLEVBQTFCO29CQUNJLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUEzQixFQUFtQyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMsSUFBMUQ7QUFDQSwwQkFGSjttQkFBQSxNQUFBOzBDQUFBOztBQURKOzs7QUFESjs7VUFSNkI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLEVBdkNKOztJQURZOzs7QUFzRGhCOzs7Ozs7OzsrQkFPQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQ7QUFDZCxjQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBckI7QUFBQSxhQUNTLE1BRFQ7QUFDb0IsaUJBQU8sS0FBSyxDQUFDO0FBRGpDLGFBRVMsS0FGVDtBQUVvQixpQkFBTyxLQUFLLENBQUM7QUFGakMsYUFHUyxLQUhUO0FBR29CLGlCQUFPLEtBQUssQ0FBQztBQUhqQztBQUlTLGlCQUFPO0FBSmhCO0lBRGM7OztBQU9sQjs7Ozs7OytCQUtBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEdBQUE7OztBQUVqQjs7Ozs7OytCQUtBLFlBQUEsR0FBYyxTQUFDLE1BQUQsR0FBQTs7O0FBRWQ7Ozs7OzsrQkFLQSxhQUFBLEdBQWUsU0FBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkO2FBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakI7SUFGVzs7O0FBSWY7Ozs7Ozs7OytCQU9BLG9CQUFBLEdBQXNCLFNBQUMsS0FBRDtBQUNsQixhQUFPLEtBQUssQ0FBQztJQURLOzs7QUFHdEI7Ozs7Ozs7OytCQU9BLE9BQUEsR0FBUyxTQUFDLElBQUQ7QUFDTCxVQUFBO0FBQUEsOERBQTZCLENBQUUsZ0JBQXhCLEdBQWlDO0lBRG5DOzs7QUFHVDs7Ozs7Ozs7K0JBT0EsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTs7O0FBRWhCOzs7Ozs7OytCQU1BLE1BQUEsR0FBUSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ0osVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx3QkFBUixDQUFpQyxNQUFqQyxFQUF5QyxJQUF6QyxFQUErQyxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixDQUEvQztNQUVqQixJQUFHLGNBQUEsS0FBa0IsSUFBckI7QUFDSSxlQUFPLE1BRFg7O2FBSUEsVUFBQSxDQUFXLFNBQUE7UUFDUCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsY0FBL0IsRUFBK0M7VUFDM0MsVUFBQSxFQUFZLEtBRCtCO1NBQS9DO2VBS0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLE1BQU0sQ0FBQywrQkFBUCxDQUF1QyxjQUF2QyxDQUE5QixFQUFzRjtVQUNsRixNQUFBLEVBQVEsSUFEMEU7U0FBdEY7TUFOTyxDQUFYLEVBU0UsR0FURjtJQVBJOzs7OztBQS9OWiIsInNvdXJjZXNDb250ZW50IjpbIntUZXh0RWRpdG9yfSA9IHJlcXVpcmUgJ2F0b20nXG5cblN1YkF0b20gPSByZXF1aXJlICdzdWItYXRvbSdcbmNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgQWJzdHJhY3RQcm92aWRlclxuICAgIGFsbE1hcmtlcnM6IFtdXG4gICAgaG92ZXJFdmVudFNlbGVjdG9yczogJydcbiAgICBjbGlja0V2ZW50U2VsZWN0b3JzOiAnJ1xuICAgIG1hbmFnZXI6IHt9XG4gICAgZ290b1JlZ2V4OiAnJ1xuICAgIGp1bXBXb3JkOiAnJ1xuXG4gICAgIyMjKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIG9mIEdvdG9zXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0dvdG9NYW5hZ2VyfSBtYW5hZ2VyIFRoZSBtYW5hZ2VyIHRoYXQgc3RvcmVzIHRoaXMgZ290by4gVXNlZCBtYWlubHkgZm9yIGJhY2t0cmFjayByZWdpc3RlcmluZy5cbiAgICAjIyNcbiAgICBpbml0OiAobWFuYWdlcikgLT5cbiAgICAgICAgQHN1YkF0b20gPSBuZXcgU3ViQXRvbVxuXG4gICAgICAgIEAkID0gcmVxdWlyZSAnanF1ZXJ5J1xuICAgICAgICBAcGFyc2VyID0gcmVxdWlyZSAnLi4vc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyJ1xuICAgICAgICBAZnV6emFsZHJpbiA9IHJlcXVpcmUgJ2Z1enphbGRyaW4nXG5cbiAgICAgICAgQG1hbmFnZXIgPSBtYW5hZ2VyXG5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICBlZGl0b3Iub25EaWRTYXZlIChldmVudCkgPT5cbiAgICAgICAgICAgICAgICBAcmVzY2FuTWFya2VycyhlZGl0b3IpXG5cbiAgICAgICAgICAgIEByZWdpc3Rlck1hcmtlcnMgZWRpdG9yXG4gICAgICAgICAgICBAcmVnaXN0ZXJFdmVudHMgZWRpdG9yXG5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAocGFuZUl0ZW0pID0+XG4gICAgICAgICAgICBpZiBwYW5lSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IgJiYgQGp1bXBXb3JkICE9ICcnICYmIEBqdW1wV29yZCAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBAanVtcFRvKHBhbmVJdGVtLCBAanVtcFdvcmQpXG4gICAgICAgICAgICAgICAgQGp1bXBXb3JkID0gJydcblxuICAgICAgICAjIFdoZW4geW91IGdvIGJhY2sgdG8gb25seSBoYXZlIDEgcGFuZSB0aGUgZXZlbnRzIGFyZSBsb3N0LCBzbyBuZWVkIHRvIHJlLXJlZ2lzdGVyLlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lIChwYW5lKSA9PlxuICAgICAgICAgICAgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG5cbiAgICAgICAgICAgIGlmIHBhbmVzLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICAgICAgZm9yIHBhbmVJdGVtIGluIHBhbmVzWzBdLml0ZW1zXG4gICAgICAgICAgICAgICAgICAgIGlmIHBhbmVJdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlZ2lzdGVyRXZlbnRzIHBhbmVJdGVtXG5cbiAgICAgICAgIyBIYXZpbmcgdG8gcmUtcmVnaXN0ZXIgZXZlbnRzIGFzIHdoZW4gYSBuZXcgcGFuZSBpcyBjcmVhdGVkIHRoZSBvbGQgcGFuZXMgbG9zZSB0aGUgZXZlbnRzLlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFBhbmUgKG9ic2VydmVkUGFuZSkgPT5cbiAgICAgICAgICAgIHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuXG4gICAgICAgICAgICBmb3IgcGFuZSBpbiBwYW5lc1xuICAgICAgICAgICAgICAgIGlmIHBhbmUgPT0gb2JzZXJ2ZWRQYW5lXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICBmb3IgcGFuZUl0ZW0gaW4gcGFuZS5pdGVtc1xuICAgICAgICAgICAgICAgICAgICBpZiBwYW5lSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlckV2ZW50cyBwYW5lSXRlbVxuXG4gICAgIyMjKlxuICAgICAqIERlYWN0aXZlcyB0aGUgZ290byBmZWF0dXJlLlxuICAgICMjI1xuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICAgIEBzdWJBdG9tLmRpc3Bvc2UoKVxuICAgICAgICBhbGxNYXJrZXJzID0gW11cblxuICAgICMjIypcbiAgICAgKiBHb3RvIGZyb20gdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uIGluIHRoZSBlZGl0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUZXh0RWRpdG9yIHRvIHB1bGwgdGVybSBmcm9tLlxuICAgICMjI1xuICAgIGdvdG9Gcm9tRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgICAgICBpZiBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS5tYXRjaCAvdGV4dC5odG1sLnBocCQvXG4gICAgICAgICAgICBwb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgICB0ZXJtID0gQHBhcnNlci5nZXRGdWxsV29yZEZyb21CdWZmZXJQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uKVxuXG4gICAgICAgICAgICB0ZXJtUGFydHMgPSB0ZXJtLnNwbGl0KC8oPzpcXC1cXD58OjopLylcbiAgICAgICAgICAgIHRlcm0gPSB0ZXJtUGFydHMucG9wKCkucmVwbGFjZSgnKCcsICcnKVxuXG4gICAgICAgICAgICBAZ290b0Zyb21Xb3JkKGVkaXRvciwgdGVybSlcblxuICAgICMjIypcbiAgICAgKiBHb3RvIGZyb20gdGhlIHRlcm0gZ2l2ZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGV4dEVkaXRvciB0byBzZWFyY2ggZm9yIG5hbWVzcGFjZSBvZiB0ZXJtLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gICAgIHRlcm0gICBUZXJtIHRvIHNlYXJjaCBmb3IuXG4gICAgIyMjXG4gICAgZ290b0Zyb21Xb3JkOiAoZWRpdG9yLCB0ZXJtKSAtPlxuXG4gICAgIyMjKlxuICAgICAqIFJlZ2lzdGVycyB0aGUgbW91c2UgZXZlbnRzIGZvciBhbHQtY2xpY2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUZXh0RWRpdG9yIHRvIHJlZ2lzdGVyIGV2ZW50cyB0by5cbiAgICAjIyNcbiAgICByZWdpc3RlckV2ZW50czogKGVkaXRvcikgLT5cbiAgICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2ggL3RleHQuaHRtbC5waHAkL1xuICAgICAgICAgICAgdGV4dEVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICAgICAgc2Nyb2xsVmlld0VsZW1lbnQgPSBAJCh0ZXh0RWRpdG9yRWxlbWVudCkuZmluZCgnLnNjcm9sbC12aWV3JylcblxuICAgICAgICAgICAgQHN1YkF0b20uYWRkIHNjcm9sbFZpZXdFbGVtZW50LCAnbW91c2Vtb3ZlJywgQGhvdmVyRXZlbnRTZWxlY3RvcnMsIChldmVudCkgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBpc0dvdG9LZXlQcmVzc2VkKGV2ZW50KVxuXG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBAZ2V0U2VsZWN0b3JGcm9tRXZlbnQoZXZlbnQpXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIHNlbGVjdG9yXG5cbiAgICAgICAgICAgICAgICBAJChzZWxlY3RvcikuY3NzKCdib3JkZXItYm90dG9tJywgJzFweCBzb2xpZCAnICsgQCQoc2VsZWN0b3IpLmNzcygnY29sb3InKSlcbiAgICAgICAgICAgICAgICBAJChzZWxlY3RvcikuY3NzKCdjdXJzb3InLCAncG9pbnRlcicpXG5cbiAgICAgICAgICAgICAgICBAaXNIb3ZlcmluZyA9IHRydWVcblxuICAgICAgICAgICAgQHN1YkF0b20uYWRkIHNjcm9sbFZpZXdFbGVtZW50LCAnbW91c2VvdXQnLCBAaG92ZXJFdmVudFNlbGVjdG9ycywgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGlzSG92ZXJpbmdcblxuICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gQGdldFNlbGVjdG9yRnJvbUV2ZW50KGV2ZW50KVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBzZWxlY3RvclxuXG4gICAgICAgICAgICAgICAgQCQoc2VsZWN0b3IpLmNzcygnYm9yZGVyLWJvdHRvbScsICcnKVxuICAgICAgICAgICAgICAgIEAkKHNlbGVjdG9yKS5jc3MoJ2N1cnNvcicsICcnKVxuXG4gICAgICAgICAgICAgICAgQGlzSG92ZXJpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICBAc3ViQXRvbS5hZGQgc2Nyb2xsVmlld0VsZW1lbnQsICdjbGljaycsIEBjbGlja0V2ZW50U2VsZWN0b3JzLCAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBAZ2V0U2VsZWN0b3JGcm9tRXZlbnQoZXZlbnQpXG5cbiAgICAgICAgICAgICAgICBpZiBzZWxlY3RvciA9PSBudWxsIHx8IEBpc0dvdG9LZXlQcmVzc2VkKGV2ZW50KSA9PSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIGlmIGV2ZW50LmhhbmRsZWQgIT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBAZ290b0Zyb21Xb3JkKGVkaXRvciwgQCQoc2VsZWN0b3IpLnRleHQoKSlcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuaGFuZGxlZCA9IHRydWVcblxuICAgICAgICAgICAgIyBUaGlzIGlzIG5lZWRlZCB0byBiZSBhYmxlIHRvIGFsdC1jbGljayBjbGFzcyBuYW1lcyBpbnNpZGUgY29tbWVudHMgKGRvY2Jsb2NrcykuXG4gICAgICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAaXNIb3ZlcmluZ1xuXG4gICAgICAgICAgICAgICAgbWFya2VyUHJvcGVydGllcyA9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zQnVmZmVyUG9zaXRpb246IGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uXG5cbiAgICAgICAgICAgICAgICBtYXJrZXJzID0gZXZlbnQuY3Vyc29yLmVkaXRvci5maW5kTWFya2VycyBtYXJrZXJQcm9wZXJ0aWVzXG5cbiAgICAgICAgICAgICAgICBmb3Iga2V5LG1hcmtlciBvZiBtYXJrZXJzXG4gICAgICAgICAgICAgICAgICAgIGZvciBhbGxLZXksYWxsTWFya2VyIG9mIEBhbGxNYXJrZXJzW2VkaXRvci5nZXRMb25nVGl0bGUoKV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG1hcmtlci5pZCA9PSBhbGxNYXJrZXIuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZ290b0Zyb21Xb3JkKGV2ZW50LmN1cnNvci5lZGl0b3IsIG1hcmtlci5nZXRQcm9wZXJ0aWVzKCkudGVybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgIyMjKlxuICAgICAqIENoZWNrIGlmIHRoZSBrZXkgYmluZGVkIHRvIHRoZSBnb3RvIHdpdGggY2xpY2sgaXMgcHJlc3NlZCBvciBub3QgKGFjY29yZGluZyB0byB0aGUgc2V0dGluZ3MpXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCBKUyBldmVudFxuICAgICAqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAjIyNcbiAgICBpc0dvdG9LZXlQcmVzc2VkOiAoZXZlbnQpIC0+XG4gICAgICAgIHN3aXRjaCBjb25maWcuY29uZmlnLmdvdG9LZXlcbiAgICAgICAgICAgIHdoZW4gJ2N0cmwndGhlbiByZXR1cm4gZXZlbnQuY3RybEtleVxuICAgICAgICAgICAgd2hlbiAnYWx0JyB0aGVuIHJldHVybiBldmVudC5hbHRLZXlcbiAgICAgICAgICAgIHdoZW4gJ2NtZCcgdGhlbiByZXR1cm4gZXZlbnQubWV0YUtleVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcblxuICAgICMjIypcbiAgICAgKiBSZWdpc3RlciBhbnkgbWFya2VycyB0aGF0IHlvdSBuZWVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGhlIGVkaXRvciB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAjIyNcbiAgICByZWdpc3Rlck1hcmtlcnM6IChlZGl0b3IpIC0+XG5cbiAgICAjIyMqXG4gICAgICogUmVtb3ZlcyBhbnkgbWFya2VycyBwcmV2aW91c2x5IGNyZWF0ZWQgYnkgcmVnaXN0ZXJNYXJrZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGhlIGVkaXRvciB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAjIyNcbiAgICBjbGVhbk1hcmtlcnM6IChlZGl0b3IpIC0+XG5cbiAgICAjIyMqXG4gICAgICogUmVzY2FucyB0aGUgZWRpdG9yLCB1cGRhdGluZyBhbGwgbWFya2Vycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yIFRoZSBlZGl0b3IgdG8gc2VhcmNoIHRocm91Z2guXG4gICAgIyMjXG4gICAgcmVzY2FuTWFya2VyczogKGVkaXRvcikgLT5cbiAgICAgICAgQGNsZWFuTWFya2VycyhlZGl0b3IpXG4gICAgICAgIEByZWdpc3Rlck1hcmtlcnMoZWRpdG9yKVxuXG4gICAgIyMjKlxuICAgICAqIEdldHMgdGhlIGNvcnJlY3Qgc2VsZWN0b3Igd2hlbiBhIHNlbGVjdG9yIGlzIGNsaWNrZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEEgalF1ZXJ5IGV2ZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiB7b2JqZWN0fG51bGx9IEEgc2VsZWN0b3IgdG8gYmUgdXNlZCB3aXRoIGpRdWVyeS5cbiAgICAjIyNcbiAgICBnZXRTZWxlY3RvckZyb21FdmVudDogKGV2ZW50KSAtPlxuICAgICAgICByZXR1cm4gZXZlbnQuY3VycmVudFRhcmdldFxuXG4gICAgIyMjKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGlzIGdvdG8gaXMgYWJsZSB0byBqdW1wIHVzaW5nIHRoZSB0ZXJtLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSB0ZXJtIFRlcm0gdG8gY2hlY2suXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIGEganVtcCBpcyBwb3NzaWJsZS5cbiAgICAjIyNcbiAgICBjYW5Hb3RvOiAodGVybSkgLT5cbiAgICAgICAgcmV0dXJuIHRlcm0ubWF0Y2goQGdvdG9SZWdleCk/Lmxlbmd0aCA+IDBcblxuICAgICMjIypcbiAgICAgKiBHZXRzIHRoZSByZWdleCB1c2VkIHdoZW4gbG9va2luZyBmb3IgYSB3b3JkIHdpdGhpbiB0aGUgZWRpdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm0gVGVybSBiZWluZyBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtyZWdleH0gUmVnZXggdG8gYmUgdXNlZC5cbiAgICAjIyNcbiAgICBnZXRKdW1wVG9SZWdleDogKHRlcm0pIC0+XG5cbiAgICAjIyMqXG4gICAgICogSnVtcHMgdG8gYSB3b3JkIHdpdGhpbiB0aGUgZWRpdG9yXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIFRoZSBlZGl0b3IgdGhhdCBoYXMgdGhlIGZ1bmN0aW9uIGluLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gd29yZCAgICAgICBUaGUgd29yZCB0byBmaW5kIGFuZCB0aGVuIGp1bXAgdG8uXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgIFdoZXRoZXIgdGhlIGZpbmRpbmcgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgIyMjXG4gICAganVtcFRvOiAoZWRpdG9yLCB3b3JkKSAtPlxuICAgICAgICBidWZmZXJQb3NpdGlvbiA9IEBwYXJzZXIuZmluZEJ1ZmZlclBvc2l0aW9uT2ZXb3JkKGVkaXRvciwgd29yZCwgQGdldEp1bXBUb1JlZ2V4KHdvcmQpKVxuXG4gICAgICAgIGlmIGJ1ZmZlclBvc2l0aW9uID09IG51bGxcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICMgU21hbGwgZGVsYXkgdG8gd2FpdCBmb3Igd2hlbiBhIGVkaXRvciBpcyBiZWluZyBjcmVhdGVkLlxuICAgICAgICBzZXRUaW1lb3V0KCgpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24sIHtcbiAgICAgICAgICAgICAgICBhdXRvc2Nyb2xsOiBmYWxzZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgIyBTZXBhcmF0ZWQgdGhlc2UgYXMgdGhlIGF1dG9zY3JvbGwgb24gc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gZGlkbid0IHdvcmsgYXMgd2VsbC5cbiAgICAgICAgICAgIGVkaXRvci5zY3JvbGxUb1NjcmVlblBvc2l0aW9uKGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKSwge1xuICAgICAgICAgICAgICAgIGNlbnRlcjogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgLCAxMDApXG4iXX0=
