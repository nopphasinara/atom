(function() {
  var AbstractProvider, AttachedPopover, Point, Range, SubAtom, TextEditor, ref;

  ref = require('atom'), Range = ref.Range, Point = ref.Point, TextEditor = ref.TextEditor;

  SubAtom = require('sub-atom');

  AttachedPopover = require('../services/attached-popover');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.regex = null;

    AbstractProvider.prototype.markers = [];

    AbstractProvider.prototype.subAtoms = [];


    /**
     * Initializes this provider.
     */

    AbstractProvider.prototype.init = function() {
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidSave(function(event) {
            return _this.rescan(editor);
          });
          _this.registerAnnotations(editor);
          return _this.registerEvents(editor);
        };
      })(this));
      atom.workspace.onDidDestroyPane((function(_this) {
        return function(pane) {
          var j, len, paneItem, panes, ref1, results;
          panes = atom.workspace.getPanes();
          if (panes.length === 1) {
            ref1 = panes[0].items;
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              paneItem = ref1[j];
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
          var j, len, pane, paneItem, panes, results;
          panes = atom.workspace.getPanes();
          results = [];
          for (j = 0, len = panes.length; j < len; j++) {
            pane = panes[j];
            if (pane === observedPane) {
              continue;
            }
            results.push((function() {
              var k, len1, ref1, results1;
              ref1 = pane.items;
              results1 = [];
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                paneItem = ref1[k];
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
      return this.removeAnnotations();
    };


    /**
     * Registers event handlers.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
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
        textEditorElement = atom.views.getView(editor);
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
     * Registers the annotations.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.registerAnnotations = function(editor) {
      var match, results, row, rowNum, rows, text;
      text = editor.getText();
      rows = text.split('\n');
      this.subAtoms[editor.getLongTitle()] = new SubAtom;
      results = [];
      for (rowNum in rows) {
        row = rows[rowNum];
        results.push((function() {
          var results1;
          results1 = [];
          while ((match = this.regex.exec(row))) {
            results1.push(this.placeAnnotation(editor, rowNum, row, match));
          }
          return results1;
        }).call(this));
      }
      return results;
    };


    /**
     * Places an annotation at the specified line and row text.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {String}     rowText
     * @param {Array}      match
     */

    AbstractProvider.prototype.placeAnnotation = function(editor, row, rowText, match) {
      var annotationInfo, decoration, longTitle, marker, markerLayer, range;
      annotationInfo = this.extractAnnotationInfo(editor, row, rowText, match);
      if (!annotationInfo) {
        return;
      }
      range = new Range(new Point(parseInt(row), 0), new Point(parseInt(row), rowText.length));
      if (typeof editor.addMarkerLayer === 'function') {
        if (this.markerLayers == null) {
          this.markerLayers = new WeakMap;
        }
        if (!(markerLayer = this.markerLayers.get(editor))) {
          markerLayer = editor.addMarkerLayer({
            maintainHistory: true
          });
          this.markerLayers.set(editor, markerLayer);
        }
      }
      marker = (markerLayer != null ? markerLayer : editor).markBufferRange(range);
      decoration = editor.decorateMarker(marker, {
        type: 'line-number',
        "class": annotationInfo.lineNumberClass
      });
      longTitle = editor.getLongTitle();
      if (this.markers[longTitle] === void 0) {
        this.markers[longTitle] = [];
      }
      this.markers[longTitle].push(marker);
      return this.registerAnnotationEventHandlers(editor, row, annotationInfo);
    };


    /**
     * Exracts information about the annotation match.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {String}     rowText
     * @param {Array}      match
     */

    AbstractProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {};


    /**
     * Registers annotation event handlers for the specified row.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {Object}     annotationInfo
     */

    AbstractProvider.prototype.registerAnnotationEventHandlers = function(editor, row, annotationInfo) {
      var gutterContainerElement, textEditorElement;
      textEditorElement = atom.views.getView(editor);
      gutterContainerElement = this.$(textEditorElement).find('.gutter-container');
      return (function(_this) {
        return function(editor, gutterContainerElement, annotationInfo) {
          var longTitle, selector;
          longTitle = editor.getLongTitle();
          selector = '.line-number' + '.' + annotationInfo.lineNumberClass + '[data-buffer-row=' + row + '] .icon-right';
          _this.subAtoms[longTitle].add(gutterContainerElement, 'mouseover', selector, function(event) {
            return _this.handleMouseOver(event, editor, annotationInfo);
          });
          _this.subAtoms[longTitle].add(gutterContainerElement, 'mouseout', selector, function(event) {
            return _this.handleMouseOut(event, editor, annotationInfo);
          });
          return _this.subAtoms[longTitle].add(gutterContainerElement, 'click', selector, function(event) {
            return _this.handleMouseClick(event, editor, annotationInfo);
          });
        };
      })(this)(editor, gutterContainerElement, annotationInfo);
    };


    /**
     * Handles the mouse over event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseOver = function(event, editor, annotationInfo) {
      if (annotationInfo.tooltipText) {
        this.removePopover();
        this.attachedPopover = new AttachedPopover(event.target);
        this.attachedPopover.setText(annotationInfo.tooltipText);
        return this.attachedPopover.show();
      }
    };


    /**
     * Handles the mouse out event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseOut = function(event, editor, annotationInfo) {
      return this.removePopover();
    };


    /**
     * Handles the mouse click event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {};


    /**
     * Removes the existing popover, if any.
     */

    AbstractProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };


    /**
     * Removes any annotations that were created.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.removeAnnotations = function(editor) {
      var i, marker, name, ref1, ref2, ref3, ref4, ref5, subAtom;
      if (editor != null) {
        ref1 = this.markers[editor.getLongTitle()];
        for (i in ref1) {
          marker = ref1[i];
          marker.destroy();
        }
        this.markers[editor.getLongTitle()] = [];
        return (ref2 = this.subAtoms[editor.getLongTitle()]) != null ? ref2.dispose() : void 0;
      } else {
        ref3 = this.markers;
        for (i in ref3) {
          name = ref3[i];
          ref4 = this.markers[name];
          for (i in ref4) {
            marker = ref4[i];
            marker.destroy();
          }
        }
        this.markers = [];
        ref5 = this.subAtoms;
        for (i in ref5) {
          subAtom = ref5[i];
          subAtom.dispose();
        }
        return this.subAtoms = [];
      }
    };


    /**
     * Rescans the editor, updating all annotations.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.rescan = function(editor) {
      this.removeAnnotations(editor);
      return this.registerAnnotations(editor);
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2Fubm90YXRpb24vYWJzdHJhY3QtcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUE2QixPQUFBLENBQVEsTUFBUixDQUE3QixFQUFDLGlCQUFELEVBQVEsaUJBQVIsRUFBZTs7RUFFZixPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBRVYsZUFBQSxHQUFrQixPQUFBLENBQVEsOEJBQVI7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBRU07OzsrQkFFRixLQUFBLEdBQU87OytCQUNQLE9BQUEsR0FBUzs7K0JBQ1QsUUFBQSxHQUFVOzs7QUFFVjs7OzsrQkFHQSxJQUFBLEdBQU0sU0FBQTtNQUNGLElBQUMsQ0FBQSxDQUFELEdBQUssT0FBQSxDQUFRLFFBQVI7TUFDTCxJQUFDLENBQUEsTUFBRCxHQUFVLE9BQUEsQ0FBUSw2QkFBUjtNQUVWLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDOUIsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxLQUFEO21CQUNiLEtBQUMsQ0FBQSxNQUFELENBQVEsTUFBUjtVQURhLENBQWpCO1VBR0EsS0FBQyxDQUFBLG1CQUFELENBQXFCLE1BQXJCO2lCQUNBLEtBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCO1FBTDhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQztNQVFBLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWYsQ0FBZ0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDNUIsY0FBQTtVQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQTtVQUVSLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FB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QUEsU0FBQTs7VUFDSSxNQUFNLENBQUMsT0FBUCxDQUFBO0FBREo7UUFFQSxJQUFDLENBQUEsT0FBUSxDQUFBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxDQUFULEdBQWtDOzJFQUNGLENBQUUsT0FBbEMsQ0FBQSxXQUpKO09BQUEsTUFBQTtBQU1JO0FBQUEsYUFBQSxTQUFBOztBQUNJO0FBQUEsZUFBQSxTQUFBOztZQUNJLE1BQU0sQ0FBQyxPQUFQLENBQUE7QUFESjtBQURKO1FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYO0FBQUEsYUFBQSxTQUFBOztVQUNJLE9BQU8sQ0FBQyxPQUFSLENBQUE7QUFESjtlQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksR0FaaEI7O0lBRGU7OztBQWVuQjs7Ozs7OytCQUtBLE1BQUEsR0FBUSxTQUFDLE1BQUQ7TUFDSixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkI7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckI7SUFGSTs7Ozs7QUE5T1oiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2UsIFBvaW50LCBUZXh0RWRpdG9yfSA9IHJlcXVpcmUgJ2F0b20nXG5cblN1YkF0b20gPSByZXF1aXJlICdzdWItYXRvbSdcblxuQXR0YWNoZWRQb3BvdmVyID0gcmVxdWlyZSAnLi4vc2VydmljZXMvYXR0YWNoZWQtcG9wb3ZlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuXG5jbGFzcyBBYnN0cmFjdFByb3ZpZGVyXG4gICAgIyBUaGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgYSBsaW5lIG11c3QgbWF0Y2ggaW4gb3JkZXIgZm9yIGl0IHRvIGJlIGNoZWNrZWQgaWYgaXQgcmVxdWlyZXMgYW4gYW5ub3RhdGlvbi5cbiAgICByZWdleDogbnVsbFxuICAgIG1hcmtlcnM6IFtdXG4gICAgc3ViQXRvbXM6IFtdXG5cbiAgICAjIyMqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhpcyBwcm92aWRlci5cbiAgICAjIyNcbiAgICBpbml0OiAoKSAtPlxuICAgICAgICBAJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbiAgICAgICAgQHBhcnNlciA9IHJlcXVpcmUgJy4uL3NlcnZpY2VzL3BocC1maWxlLXBhcnNlcidcblxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgICAgICAgIGVkaXRvci5vbkRpZFNhdmUgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIEByZXNjYW4oZWRpdG9yKVxuXG4gICAgICAgICAgICBAcmVnaXN0ZXJBbm5vdGF0aW9ucyBlZGl0b3JcbiAgICAgICAgICAgIEByZWdpc3RlckV2ZW50cyBlZGl0b3JcblxuICAgICAgICAjIFdoZW4geW91IGdvIGJhY2sgdG8gb25seSBoYXZlIDEgcGFuZSB0aGUgZXZlbnRzIGFyZSBsb3N0LCBzbyBuZWVkIHRvIHJlLXJlZ2lzdGVyLlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lIChwYW5lKSA9PlxuICAgICAgICAgICAgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG5cbiAgICAgICAgICAgIGlmIHBhbmVzLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICAgICAgZm9yIHBhbmVJdGVtIGluIHBhbmVzWzBdLml0ZW1zXG4gICAgICAgICAgICAgICAgICAgIGlmIHBhbmVJdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlZ2lzdGVyRXZlbnRzIHBhbmVJdGVtXG5cbiAgICAgICAgIyBIYXZpbmcgdG8gcmUtcmVnaXN0ZXIgZXZlbnRzIGFzIHdoZW4gYSBuZXcgcGFuZSBpcyBjcmVhdGVkIHRoZSBvbGQgcGFuZXMgbG9zZSB0aGUgZXZlbnRzLlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFBhbmUgKG9ic2VydmVkUGFuZSkgPT5cbiAgICAgICAgICAgIHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuXG4gICAgICAgICAgICBmb3IgcGFuZSBpbiBwYW5lc1xuICAgICAgICAgICAgICAgIGlmIHBhbmUgPT0gb2JzZXJ2ZWRQYW5lXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICBmb3IgcGFuZUl0ZW0gaW4gcGFuZS5pdGVtc1xuICAgICAgICAgICAgICAgICAgICBpZiBwYW5lSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZWdpc3RlckV2ZW50cyBwYW5lSXRlbVxuXG4gICAgIyMjKlxuICAgICAqIERlYWN0aXZlcyB0aGUgcHJvdmlkZXIuXG4gICAgIyMjXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICAgICAgQHJlbW92ZUFubm90YXRpb25zKClcblxuICAgICMjIypcbiAgICAgKiBSZWdpc3RlcnMgZXZlbnQgaGFuZGxlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUZXh0RWRpdG9yIHRvIHJlZ2lzdGVyIGV2ZW50cyB0by5cbiAgICAjIyNcbiAgICByZWdpc3RlckV2ZW50czogKGVkaXRvcikgLT5cbiAgICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2ggL3RleHQuaHRtbC5waHAkL1xuICAgICAgICAgICAgIyBUaWNrZXQgIzEwNyAtIE1vdXNlb3V0IGlzbid0IGdlbmVyYXRlZCB1bnRpbCB0aGUgbW91c2UgbW92ZXMsIGV2ZW4gd2hlbiBzY3JvbGxpbmcgKHdpdGggdGhlIGtleWJvYXJkIG9yXG4gICAgICAgICAgICAjIG1vdXNlKS4gSWYgdGhlIGVsZW1lbnQgZ29lcyBvdXQgb2YgdGhlIHZpZXcgaW4gdGhlIG1lYW50aW1lLCBpdHMgSFRNTCBlbGVtZW50IGRpc2FwcGVhcnMsIG5ldmVyIHJlbW92aW5nXG4gICAgICAgICAgICAjIGl0LlxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSAoKSA9PlxuICAgICAgICAgICAgICAgIEByZW1vdmVQb3BvdmVyKClcblxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nICgpID0+XG4gICAgICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgICAgICAgICB0ZXh0RWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICAgICAgICAgIEAkKHRleHRFZGl0b3JFbGVtZW50KS5maW5kKCcuaG9yaXpvbnRhbC1zY3JvbGxiYXInKS5vbiAnc2Nyb2xsJywgKCkgPT5cbiAgICAgICAgICAgICAgICBAcmVtb3ZlUG9wb3ZlcigpXG5cbiAgICAgICAgICAgIEAkKHRleHRFZGl0b3JFbGVtZW50KS5maW5kKCcudmVydGljYWwtc2Nyb2xsYmFyJykub24gJ3Njcm9sbCcsICgpID0+XG4gICAgICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgIyMjKlxuICAgICAqIFJlZ2lzdGVycyB0aGUgYW5ub3RhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUaGUgZWRpdG9yIHRvIHNlYXJjaCB0aHJvdWdoLlxuICAgICMjI1xuICAgIHJlZ2lzdGVyQW5ub3RhdGlvbnM6IChlZGl0b3IpIC0+XG4gICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIHJvd3MgPSB0ZXh0LnNwbGl0KCdcXG4nKVxuICAgICAgICBAc3ViQXRvbXNbZWRpdG9yLmdldExvbmdUaXRsZSgpXSA9IG5ldyBTdWJBdG9tXG5cbiAgICAgICAgZm9yIHJvd051bSxyb3cgb2Ygcm93c1xuICAgICAgICAgICAgd2hpbGUgKG1hdGNoID0gQHJlZ2V4LmV4ZWMocm93KSlcbiAgICAgICAgICAgICAgICBAcGxhY2VBbm5vdGF0aW9uKGVkaXRvciwgcm93TnVtLCByb3csIG1hdGNoKVxuXG4gICAgIyMjKlxuICAgICAqIFBsYWNlcyBhbiBhbm5vdGF0aW9uIGF0IHRoZSBzcGVjaWZpZWQgbGluZSBhbmQgcm93IHRleHQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgICAqIEBwYXJhbSB7aW50fSAgICAgICAgcm93XG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICByb3dUZXh0XG4gICAgICogQHBhcmFtIHtBcnJheX0gICAgICBtYXRjaFxuICAgICMjI1xuICAgIHBsYWNlQW5ub3RhdGlvbjogKGVkaXRvciwgcm93LCByb3dUZXh0LCBtYXRjaCkgLT5cbiAgICAgICAgYW5ub3RhdGlvbkluZm8gPSBAZXh0cmFjdEFubm90YXRpb25JbmZvKGVkaXRvciwgcm93LCByb3dUZXh0LCBtYXRjaClcblxuICAgICAgICBpZiBub3QgYW5ub3RhdGlvbkluZm9cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKFxuICAgICAgICAgICAgbmV3IFBvaW50KHBhcnNlSW50KHJvdyksIDApLFxuICAgICAgICAgICAgbmV3IFBvaW50KHBhcnNlSW50KHJvdyksIHJvd1RleHQubGVuZ3RoKVxuICAgICAgICApXG5cbiAgICAgICAgIyBGb3IgQXRvbSAxLjMgb3IgZ3JlYXRlciwgbWFpbnRhaW5IaXN0b3J5IGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gZW50aXJlXG4gICAgICAgICMgbWFya2VyIGxheWVycy4gTGF5ZXJzIGRvbid0IGV4aXN0IGluIGVhcmxpZXIgdmVyc2lvbnMsIGhlbmNlIHRoZVxuICAgICAgICAjIGNvbmRpdGlvbmFsIGxvZ2ljLlxuICAgICAgICBpZiB0eXBlb2YgZWRpdG9yLmFkZE1hcmtlckxheWVyIGlzICdmdW5jdGlvbidcbiAgICAgICAgICAgIEBtYXJrZXJMYXllcnMgPz0gbmV3IFdlYWtNYXBcbiAgICAgICAgICAgIHVubGVzcyBtYXJrZXJMYXllciA9IEBtYXJrZXJMYXllcnMuZ2V0KGVkaXRvcilcbiAgICAgICAgICAgICAgICBtYXJrZXJMYXllciA9IGVkaXRvci5hZGRNYXJrZXJMYXllcihtYWludGFpbkhpc3Rvcnk6IHRydWUpXG4gICAgICAgICAgICAgICAgQG1hcmtlckxheWVycy5zZXQoZWRpdG9yLCBtYXJrZXJMYXllcilcblxuICAgICAgICBtYXJrZXIgPSAobWFya2VyTGF5ZXIgPyBlZGl0b3IpLm1hcmtCdWZmZXJSYW5nZShyYW5nZSlcblxuICAgICAgICBkZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgICAgdHlwZTogJ2xpbmUtbnVtYmVyJyxcbiAgICAgICAgICAgIGNsYXNzOiBhbm5vdGF0aW9uSW5mby5saW5lTnVtYmVyQ2xhc3NcbiAgICAgICAgfSlcblxuICAgICAgICBsb25nVGl0bGUgPSBlZGl0b3IuZ2V0TG9uZ1RpdGxlKClcblxuICAgICAgICBpZiBAbWFya2Vyc1tsb25nVGl0bGVdID09IHVuZGVmaW5lZFxuICAgICAgICAgICAgQG1hcmtlcnNbbG9uZ1RpdGxlXSA9IFtdXG5cbiAgICAgICAgQG1hcmtlcnNbbG9uZ1RpdGxlXS5wdXNoKG1hcmtlcilcblxuICAgICAgICBAcmVnaXN0ZXJBbm5vdGF0aW9uRXZlbnRIYW5kbGVycyhlZGl0b3IsIHJvdywgYW5ub3RhdGlvbkluZm8pXG5cbiAgICAjIyMqXG4gICAgICogRXhyYWN0cyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgYW5ub3RhdGlvbiBtYXRjaC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yXG4gICAgICogQHBhcmFtIHtpbnR9ICAgICAgICByb3dcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgIHJvd1RleHRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSAgICAgIG1hdGNoXG4gICAgIyMjXG4gICAgZXh0cmFjdEFubm90YXRpb25JbmZvOiAoZWRpdG9yLCByb3csIHJvd1RleHQsIG1hdGNoKSAtPlxuXG4gICAgIyMjKlxuICAgICAqIFJlZ2lzdGVycyBhbm5vdGF0aW9uIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgc3BlY2lmaWVkIHJvdy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yXG4gICAgICogQHBhcmFtIHtpbnR9ICAgICAgICByb3dcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgIGFubm90YXRpb25JbmZvXG4gICAgIyMjXG4gICAgcmVnaXN0ZXJBbm5vdGF0aW9uRXZlbnRIYW5kbGVyczogKGVkaXRvciwgcm93LCBhbm5vdGF0aW9uSW5mbykgLT5cbiAgICAgICAgdGV4dEVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICBndXR0ZXJDb250YWluZXJFbGVtZW50ID0gQCQodGV4dEVkaXRvckVsZW1lbnQpLmZpbmQoJy5ndXR0ZXItY29udGFpbmVyJylcblxuICAgICAgICBkbyAoZWRpdG9yLCBndXR0ZXJDb250YWluZXJFbGVtZW50LCBhbm5vdGF0aW9uSW5mbykgPT5cbiAgICAgICAgICAgIGxvbmdUaXRsZSA9IGVkaXRvci5nZXRMb25nVGl0bGUoKVxuICAgICAgICAgICAgc2VsZWN0b3IgPSAnLmxpbmUtbnVtYmVyJyArICcuJyArIGFubm90YXRpb25JbmZvLmxpbmVOdW1iZXJDbGFzcyArICdbZGF0YS1idWZmZXItcm93PScgKyByb3cgKyAnXSAuaWNvbi1yaWdodCdcblxuICAgICAgICAgICAgQHN1YkF0b21zW2xvbmdUaXRsZV0uYWRkIGd1dHRlckNvbnRhaW5lckVsZW1lbnQsICdtb3VzZW92ZXInLCBzZWxlY3RvciwgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIEBoYW5kbGVNb3VzZU92ZXIoZXZlbnQsIGVkaXRvciwgYW5ub3RhdGlvbkluZm8pXG5cbiAgICAgICAgICAgIEBzdWJBdG9tc1tsb25nVGl0bGVdLmFkZCBndXR0ZXJDb250YWluZXJFbGVtZW50LCAnbW91c2VvdXQnLCBzZWxlY3RvciwgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIEBoYW5kbGVNb3VzZU91dChldmVudCwgZWRpdG9yLCBhbm5vdGF0aW9uSW5mbylcblxuICAgICAgICAgICAgQHN1YkF0b21zW2xvbmdUaXRsZV0uYWRkIGd1dHRlckNvbnRhaW5lckVsZW1lbnQsICdjbGljaycsIHNlbGVjdG9yLCAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgQGhhbmRsZU1vdXNlQ2xpY2soZXZlbnQsIGVkaXRvciwgYW5ub3RhdGlvbkluZm8pXG5cbiAgICAjIyMqXG4gICAgICogSGFuZGxlcyB0aGUgbW91c2Ugb3ZlciBldmVudCBvbiBhbiBhbm5vdGF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSAgIGVkaXRvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICBhbm5vdGF0aW9uSW5mb1xuICAgICMjI1xuICAgIGhhbmRsZU1vdXNlT3ZlcjogKGV2ZW50LCBlZGl0b3IsIGFubm90YXRpb25JbmZvKSAtPlxuICAgICAgICBpZiBhbm5vdGF0aW9uSW5mby50b29sdGlwVGV4dFxuICAgICAgICAgICAgQHJlbW92ZVBvcG92ZXIoKVxuXG4gICAgICAgICAgICBAYXR0YWNoZWRQb3BvdmVyID0gbmV3IEF0dGFjaGVkUG9wb3ZlcihldmVudC50YXJnZXQpXG4gICAgICAgICAgICBAYXR0YWNoZWRQb3BvdmVyLnNldFRleHQoYW5ub3RhdGlvbkluZm8udG9vbHRpcFRleHQpXG4gICAgICAgICAgICBAYXR0YWNoZWRQb3BvdmVyLnNob3coKVxuXG4gICAgIyMjKlxuICAgICAqIEhhbmRsZXMgdGhlIG1vdXNlIG91dCBldmVudCBvbiBhbiBhbm5vdGF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSAgIGVkaXRvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICBhbm5vdGF0aW9uSW5mb1xuICAgICMjI1xuICAgIGhhbmRsZU1vdXNlT3V0OiAoZXZlbnQsIGVkaXRvciwgYW5ub3RhdGlvbkluZm8pIC0+XG4gICAgICAgIEByZW1vdmVQb3BvdmVyKClcblxuICAgICMjIypcbiAgICAgKiBIYW5kbGVzIHRoZSBtb3VzZSBjbGljayBldmVudCBvbiBhbiBhbm5vdGF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSAgIGVkaXRvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICBhbm5vdGF0aW9uSW5mb1xuICAgICMjI1xuICAgIGhhbmRsZU1vdXNlQ2xpY2s6IChldmVudCwgZWRpdG9yLCBhbm5vdGF0aW9uSW5mbykgLT5cblxuICAgICMjIypcbiAgICAgKiBSZW1vdmVzIHRoZSBleGlzdGluZyBwb3BvdmVyLCBpZiBhbnkuXG4gICAgIyMjXG4gICAgcmVtb3ZlUG9wb3ZlcjogKCkgLT5cbiAgICAgICAgaWYgQGF0dGFjaGVkUG9wb3ZlclxuICAgICAgICAgICAgQGF0dGFjaGVkUG9wb3Zlci5kaXNwb3NlKClcbiAgICAgICAgICAgIEBhdHRhY2hlZFBvcG92ZXIgPSBudWxsXG5cbiAgICAjIyMqXG4gICAgICogUmVtb3ZlcyBhbnkgYW5ub3RhdGlvbnMgdGhhdCB3ZXJlIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBUaGUgZWRpdG9yIHRvIHNlYXJjaCB0aHJvdWdoLlxuICAgICMjI1xuICAgIHJlbW92ZUFubm90YXRpb25zOiAoZWRpdG9yKSAtPlxuICAgICAgICBpZiBlZGl0b3I/XG4gICAgICAgICAgICBmb3IgaSxtYXJrZXIgb2YgQG1hcmtlcnNbZWRpdG9yLmdldExvbmdUaXRsZSgpXVxuICAgICAgICAgICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgICAgICAgIEBtYXJrZXJzW2VkaXRvci5nZXRMb25nVGl0bGUoKV0gPSBbXVxuICAgICAgICAgICAgQHN1YkF0b21zW2VkaXRvci5nZXRMb25nVGl0bGUoKV0/LmRpc3Bvc2UoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgaSxuYW1lIG9mIEBtYXJrZXJzXG4gICAgICAgICAgICAgICAgZm9yIGksbWFya2VyIG9mIEBtYXJrZXJzW25hbWVdXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgICAgICAgIEBtYXJrZXJzID0gW11cbiAgICAgICAgICAgIGZvciBpLCBzdWJBdG9tIG9mIEBzdWJBdG9tc1xuICAgICAgICAgICAgICAgIHN1YkF0b20uZGlzcG9zZSgpXG4gICAgICAgICAgICBAc3ViQXRvbXMgPSBbXVxuXG4gICAgIyMjKlxuICAgICAqIFJlc2NhbnMgdGhlIGVkaXRvciwgdXBkYXRpbmcgYWxsIGFubm90YXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGhlIGVkaXRvciB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAjIyNcbiAgICByZXNjYW46IChlZGl0b3IpIC0+XG4gICAgICAgIEByZW1vdmVBbm5vdGF0aW9ucyhlZGl0b3IpXG4gICAgICAgIEByZWdpc3RlckFubm90YXRpb25zKGVkaXRvcilcbiJdfQ==
