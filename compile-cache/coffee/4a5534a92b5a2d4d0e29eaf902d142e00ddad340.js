(function() {
  var AbstractProvider, AttachedPopover, SubAtom, TextEditor;

  TextEditor = require('atom').TextEditor;

  SubAtom = require('sub-atom');

  AttachedPopover = require('../services/attached-popover');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.hoverEventSelectors = '';


    /**
     * Initializes this provider.
     */

    AbstractProvider.prototype.init = function() {
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      this.subAtom = new SubAtom;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.registerEvents(editor);
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
     * Deactives the provider.
     */

    AbstractProvider.prototype.deactivate = function() {
      this.subAtom.dispose();
      return this.removePopover();
    };


    /**
     * Registers the necessary event handlers.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var scrollViewElement, textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        textEditorElement = atom.views.getView(editor);
        scrollViewElement = this.$(textEditorElement).find('.scroll-view');
        this.subAtom.add(scrollViewElement, 'mouseover', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var cursorPosition, editorViewComponent, selector;
            if (_this.timeout) {
              clearTimeout(_this.timeout);
            }
            selector = _this.getSelectorFromEvent(event);
            if (selector === null) {
              return;
            }
            editorViewComponent = atom.views.getView(editor).component;
            if (editorViewComponent) {
              cursorPosition = editorViewComponent.screenPositionForMouseEvent(event);
              _this.removePopover();
              return _this.showPopoverFor(editor, selector, cursorPosition);
            }
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'mouseout', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            return _this.removePopover();
          };
        })(this));
        editor.onDidDestroy((function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        editor.onDidStopChanging((function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        this.$(textEditorElement).find('.horizontal-scrollbar').on('scroll', (function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        return this.$(textEditorElement).find('.vertical-scrollbar').on('scroll', (function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
      }
    };


    /**
     * Shows a popover containing the documentation of the specified element located at the specified location.
     *
     * @param {TextEditor} editor         TextEditor containing the elemment.
     * @param {string}     element        The element to search for.
     * @param {Point}      bufferPosition The cursor location the element is at.
     * @param {int}        delay          How long to wait before the popover shows up.
     * @param {int}        fadeInTime     The amount of time to take to fade in the tooltip.
     */

    AbstractProvider.prototype.showPopoverFor = function(editor, element, bufferPosition, delay, fadeInTime) {
      var popoverElement, term, tooltipText;
      if (delay == null) {
        delay = 500;
      }
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      term = this.$(element).text();
      tooltipText = this.getTooltipForWord(editor, term, bufferPosition);
      if ((tooltipText != null ? tooltipText.length : void 0) > 0) {
        popoverElement = this.getPopoverElementFromSelector(element);
        this.attachedPopover = new AttachedPopover(popoverElement);
        this.attachedPopover.setText('<div style="margin-top: -1em;">' + tooltipText + '</div>');
        return this.attachedPopover.showAfter(delay, fadeInTime);
      }
    };


    /**
     * Removes the popover, if it is displayed.
     */

    AbstractProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };


    /**
     * Retrieves a tooltip for the word given.
     *
     * @param {TextEditor} editor         TextEditor to search for namespace of term.
     * @param {string}     term           Term to search for.
     * @param {Point}      bufferPosition The cursor location the term is at.
     */

    AbstractProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {};


    /**
     * Gets the correct selector when a selector is clicked.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getSelectorFromEvent = function(event) {
      return event.currentTarget;
    };


    /**
     * Gets the correct element to attach the popover to from the retrieved selector.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getPopoverElementFromSelector = function(selector) {
      return selector;
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3Rvb2x0aXAvYWJzdHJhY3QtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVixlQUFBLEdBQWtCLE9BQUEsQ0FBUSw4QkFBUjs7RUFFbEIsTUFBTSxDQUFDLE9BQVAsR0FFTTs7OytCQUNGLG1CQUFBLEdBQXFCOzs7QUFFckI7Ozs7K0JBR0EsSUFBQSxHQUFNLFNBQUE7TUFDRixJQUFDLENBQUEsQ0FBRCxHQUFLLE9BQUEsQ0FBUSxRQUFSO01BQ0wsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFBLENBQVEsNkJBQVI7TUFFVixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUM5QixLQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQjtRQUQ4QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7TUFJQSxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFmLENBQWdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO0FBQzVCLGNBQUE7VUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUE7VUFFUixJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO0FBQ0k7QUFBQTtpQkFBQSxxQ0FBQTs7Y0FDSSxJQUFHLFFBQUEsWUFBb0IsVUFBdkI7NkJBQ0ksS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsR0FESjtlQUFBLE1BQUE7cUNBQUE7O0FBREo7MkJBREo7O1FBSDRCO01BQUEsQ0FBQSxDQUFBLENB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bUIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWYsR0FBQTs7O0FBRW5COzs7Ozs7K0JBS0Esb0JBQUEsR0FBc0IsU0FBQyxLQUFEO0FBQ2xCLGFBQU8sS0FBSyxDQUFDO0lBREs7OztBQUd0Qjs7Ozs7OytCQUtBLDZCQUFBLEdBQStCLFNBQUMsUUFBRDtBQUMzQixhQUFPO0lBRG9COzs7OztBQWxKbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGV4dEVkaXRvcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5TdWJBdG9tID0gcmVxdWlyZSAnc3ViLWF0b20nXG5BdHRhY2hlZFBvcG92ZXIgPSByZXF1aXJlICcuLi9zZXJ2aWNlcy9hdHRhY2hlZC1wb3BvdmVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEFic3RyYWN0UHJvdmlkZXJcbiAgICBob3ZlckV2ZW50U2VsZWN0b3JzOiAnJ1xuXG4gICAgIyMjKlxuICAgICAqIEluaXRpYWxpemVzIHRoaXMgcHJvdmlkZXIuXG4gICAgIyMjXG4gICAgaW5pdDogKCkgLT5cbiAgICAgICAgQCQgPSByZXF1aXJlICdqcXVlcnknXG4gICAgICAgIEBwYXJzZXIgPSByZXF1aXJlICcuLi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXInXG5cbiAgICAgICAgQHN1YkF0b20gPSBuZXcgU3ViQXRvbVxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgICAgICAgQHJlZ2lzdGVyRXZlbnRzIGVkaXRvclxuXG4gICAgICAgICMgV2hlbiB5b3UgZ28gYmFjayB0byBvbmx5IGhhdmUgb25lIHBhbmUgdGhlIGV2ZW50cyBhcmUgbG9zdCwgc28gbmVlZCB0byByZS1yZWdpc3Rlci5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZSAocGFuZSkgPT5cbiAgICAgICAgICAgIHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuXG4gICAgICAgICAgICBpZiBwYW5lcy5sZW5ndGggPT0gMVxuICAgICAgICAgICAgICAgIGZvciBwYW5lSXRlbSBpbiBwYW5lc1swXS5pdGVtc1xuICAgICAgICAgICAgICAgICAgICBpZiBwYW5lSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlckV2ZW50cyBwYW5lSXRlbVxuXG4gICAgICAgICMgSGF2aW5nIHRvIHJlLXJlZ2lzdGVyIGV2ZW50cyBhcyB3aGVuIGEgbmV3IHBhbmUgaXMgY3JlYXRlZCB0aGUgb2xkIHBhbmVzIGxvc2UgdGhlIGV2ZW50cy5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRBZGRQYW5lIChvYnNlcnZlZFBhbmUpID0+XG4gICAgICAgICAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcblxuICAgICAgICAgICAgZm9yIHBhbmUgaW4gcGFuZXNcbiAgICAgICAgICAgICAgICBpZiBwYW5lID09IG9ic2VydmVkUGFuZVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICAgICAgZm9yIHBhbmVJdGVtIGluIHBhbmUuaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgaWYgcGFuZUl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVnaXN0ZXJFdmVudHMgcGFuZUl0ZW1cblxuICAgICMjIypcbiAgICAgKiBEZWFjdGl2ZXMgdGhlIHByb3ZpZGVyLlxuICAgICMjI1xuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICAgIEBzdWJBdG9tLmRpc3Bvc2UoKVxuICAgICAgICBAcmVtb3ZlUG9wb3ZlcigpXG5cbiAgICAjIyMqXG4gICAgICogUmVnaXN0ZXJzIHRoZSBuZWNlc3NhcnkgZXZlbnQgaGFuZGxlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUZXh0RWRpdG9yIHRvIHJlZ2lzdGVyIGV2ZW50cyB0by5cbiAgICAjIyNcbiAgICByZWdpc3RlckV2ZW50czogKGVkaXRvcikgLT5cbiAgICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2ggL3RleHQuaHRtbC5waHAkL1xuICAgICAgICAgICAgdGV4dEVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICAgICAgc2Nyb2xsVmlld0VsZW1lbnQgPSBAJCh0ZXh0RWRpdG9yRWxlbWVudCkuZmluZCgnLnNjcm9sbC12aWV3JylcblxuICAgICAgICAgICAgQHN1YkF0b20uYWRkIHNjcm9sbFZpZXdFbGVtZW50LCAnbW91c2VvdmVyJywgQGhvdmVyRXZlbnRTZWxlY3RvcnMsIChldmVudCkgPT5cbiAgICAgICAgICAgICAgICBpZiBAdGltZW91dFxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpXG5cbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IEBnZXRTZWxlY3RvckZyb21FdmVudChldmVudClcblxuICAgICAgICAgICAgICAgIGlmIHNlbGVjdG9yID09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBlZGl0b3JWaWV3Q29tcG9uZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuY29tcG9uZW50XG5cbiAgICAgICAgICAgICAgICAjIFRpY2tldCAjMTQwIC0gSW4gcmFyZSBjYXNlcyB0aGUgY29tcG9uZW50IGlzIG51bGwuXG4gICAgICAgICAgICAgICAgaWYgZWRpdG9yVmlld0NvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JQb3NpdGlvbiA9IGVkaXRvclZpZXdDb21wb25lbnQuc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGV2ZW50KVxuXG4gICAgICAgICAgICAgICAgICAgIEByZW1vdmVQb3BvdmVyKClcbiAgICAgICAgICAgICAgICAgICAgQHNob3dQb3BvdmVyRm9yKGVkaXRvciwgc2VsZWN0b3IsIGN1cnNvclBvc2l0aW9uKVxuXG4gICAgICAgICAgICBAc3ViQXRvbS5hZGQgc2Nyb2xsVmlld0VsZW1lbnQsICdtb3VzZW91dCcsIEBob3ZlckV2ZW50U2VsZWN0b3JzLCAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgICAgICAgICAjIFRpY2tldCAjMTA3IC0gTW91c2VvdXQgaXNuJ3QgZ2VuZXJhdGVkIHVudGlsIHRoZSBtb3VzZSBtb3ZlcywgZXZlbiB3aGVuIHNjcm9sbGluZyAod2l0aCB0aGUga2V5Ym9hcmQgb3JcbiAgICAgICAgICAgICMgbW91c2UpLiBJZiB0aGUgZWxlbWVudCBnb2VzIG91dCBvZiB0aGUgdmlldyBpbiB0aGUgbWVhbnRpbWUsIGl0cyBIVE1MIGVsZW1lbnQgZGlzYXBwZWFycywgbmV2ZXIgcmVtb3ZpbmdcbiAgICAgICAgICAgICMgaXQuXG4gICAgICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95ICgpID0+XG4gICAgICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgICAgICAgICBlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcgKCkgPT5cbiAgICAgICAgICAgICAgICBAcmVtb3ZlUG9wb3ZlcigpXG5cbiAgICAgICAgICAgIEAkKHRleHRFZGl0b3JFbGVtZW50KS5maW5kKCcuaG9yaXpvbnRhbC1zY3JvbGxiYXInKS5vbiAnc2Nyb2xsJywgKCkgPT5cbiAgICAgICAgICAgICAgICBAcmVtb3ZlUG9wb3ZlcigpXG5cbiAgICAgICAgICAgIEAkKHRleHRFZGl0b3JFbGVtZW50KS5maW5kKCcudmVydGljYWwtc2Nyb2xsYmFyJykub24gJ3Njcm9sbCcsICgpID0+XG4gICAgICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgIyMjKlxuICAgICAqIFNob3dzIGEgcG9wb3ZlciBjb250YWluaW5nIHRoZSBkb2N1bWVudGF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBsb2NhdGVkIGF0IHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciAgICAgICAgIFRleHRFZGl0b3IgY29udGFpbmluZyB0aGUgZWxlbW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICBlbGVtZW50ICAgICAgICBUaGUgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7UG9pbnR9ICAgICAgYnVmZmVyUG9zaXRpb24gVGhlIGN1cnNvciBsb2NhdGlvbiB0aGUgZWxlbWVudCBpcyBhdC5cbiAgICAgKiBAcGFyYW0ge2ludH0gICAgICAgIGRlbGF5ICAgICAgICAgIEhvdyBsb25nIHRvIHdhaXQgYmVmb3JlIHRoZSBwb3BvdmVyIHNob3dzIHVwLlxuICAgICAqIEBwYXJhbSB7aW50fSAgICAgICAgZmFkZUluVGltZSAgICAgVGhlIGFtb3VudCBvZiB0aW1lIHRvIHRha2UgdG8gZmFkZSBpbiB0aGUgdG9vbHRpcC5cbiAgICAjIyNcbiAgICBzaG93UG9wb3ZlckZvcjogKGVkaXRvciwgZWxlbWVudCwgYnVmZmVyUG9zaXRpb24sIGRlbGF5ID0gNTAwLCBmYWRlSW5UaW1lID0gMTAwKSAtPlxuICAgICAgICB0ZXJtID0gQCQoZWxlbWVudCkudGV4dCgpXG4gICAgICAgIHRvb2x0aXBUZXh0ID0gQGdldFRvb2x0aXBGb3JXb3JkKGVkaXRvciwgdGVybSwgYnVmZmVyUG9zaXRpb24pXG5cbiAgICAgICAgaWYgdG9vbHRpcFRleHQ/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHBvcG92ZXJFbGVtZW50ID0gQGdldFBvcG92ZXJFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgICAgICAgICAgIEBhdHRhY2hlZFBvcG92ZXIgPSBuZXcgQXR0YWNoZWRQb3BvdmVyKHBvcG92ZXJFbGVtZW50KVxuICAgICAgICAgICAgQGF0dGFjaGVkUG9wb3Zlci5zZXRUZXh0KCc8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDogLTFlbTtcIj4nICsgdG9vbHRpcFRleHQgKyAnPC9kaXY+JylcbiAgICAgICAgICAgIEBhdHRhY2hlZFBvcG92ZXIuc2hvd0FmdGVyKGRlbGF5LCBmYWRlSW5UaW1lKVxuXG4gICAgIyMjKlxuICAgICAqIFJlbW92ZXMgdGhlIHBvcG92ZXIsIGlmIGl0IGlzIGRpc3BsYXllZC5cbiAgICAjIyNcbiAgICByZW1vdmVQb3BvdmVyOiAoKSAtPlxuICAgICAgICBpZiBAYXR0YWNoZWRQb3BvdmVyXG4gICAgICAgICAgICBAYXR0YWNoZWRQb3BvdmVyLmRpc3Bvc2UoKVxuICAgICAgICAgICAgQGF0dGFjaGVkUG9wb3ZlciA9IG51bGxcblxuICAgICMjIypcbiAgICAgKiBSZXRyaWV2ZXMgYSB0b29sdGlwIGZvciB0aGUgd29yZCBnaXZlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yICAgICAgICAgVGV4dEVkaXRvciB0byBzZWFyY2ggZm9yIG5hbWVzcGFjZSBvZiB0ZXJtLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgdGVybSAgICAgICAgICAgVGVybSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7UG9pbnR9ICAgICAgYnVmZmVyUG9zaXRpb24gVGhlIGN1cnNvciBsb2NhdGlvbiB0aGUgdGVybSBpcyBhdC5cbiAgICAjIyNcbiAgICBnZXRUb29sdGlwRm9yV29yZDogKGVkaXRvciwgdGVybSwgYnVmZmVyUG9zaXRpb24pIC0+XG5cbiAgICAjIyMqXG4gICAgICogR2V0cyB0aGUgY29ycmVjdCBzZWxlY3RvciB3aGVuIGEgc2VsZWN0b3IgaXMgY2xpY2tlZC5cbiAgICAgKiBAcGFyYW0gIHtqUXVlcnkuRXZlbnR9ICBldmVudCAgQSBqUXVlcnkgZXZlbnQuXG4gICAgICogQHJldHVybiB7b2JqZWN0fG51bGx9ICAgICAgICAgIEEgc2VsZWN0b3IgdG8gYmUgdXNlZCB3aXRoIGpRdWVyeS5cbiAgICAjIyNcbiAgICBnZXRTZWxlY3RvckZyb21FdmVudDogKGV2ZW50KSAtPlxuICAgICAgICByZXR1cm4gZXZlbnQuY3VycmVudFRhcmdldFxuXG4gICAgIyMjKlxuICAgICAqIEdldHMgdGhlIGNvcnJlY3QgZWxlbWVudCB0byBhdHRhY2ggdGhlIHBvcG92ZXIgdG8gZnJvbSB0aGUgcmV0cmlldmVkIHNlbGVjdG9yLlxuICAgICAqIEBwYXJhbSAge2pRdWVyeS5FdmVudH0gIGV2ZW50ICBBIGpRdWVyeSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R8bnVsbH0gICAgICAgICAgQSBzZWxlY3RvciB0byBiZSB1c2VkIHdpdGggalF1ZXJ5LlxuICAgICMjI1xuICAgIGdldFBvcG92ZXJFbGVtZW50RnJvbVNlbGVjdG9yOiAoc2VsZWN0b3IpIC0+XG4gICAgICAgIHJldHVybiBzZWxlY3RvclxuIl19
