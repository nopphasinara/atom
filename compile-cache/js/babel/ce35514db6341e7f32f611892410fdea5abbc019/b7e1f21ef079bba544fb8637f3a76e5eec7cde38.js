'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function EditorDiffExtender(editor) {
    _classCallCheck(this, EditorDiffExtender);

    this._editor = editor;
    this._lineMarkerLayer = this._editor.addMarkerLayer();
    this._miscMarkers = [];
    this._selectionMarkerLayer = this._editor.addMarkerLayer();
    this._oldPlaceholderText = editor.getPlaceholderText();
    editor.setPlaceholderText('Paste what you want to diff here!');
    // add split-diff css selector to editors for keybindings #73
    atom.views.getView(this._editor).classList.add('split-diff');
  }

  /**
   * Adds offsets (blank lines) into the editor.
   *
   * @param lineOffsets An array of offsets (blank lines) to insert into this editor.
   */

  _createClass(EditorDiffExtender, [{
    key: 'setLineOffsets',
    value: function setLineOffsets(lineOffsets) {
      var offsetLineNumbers = Object.keys(lineOffsets).map(function (lineNumber) {
        return parseInt(lineNumber, 10);
      }).sort(function (x, y) {
        return x - y;
      });

      for (var offsetLineNumber of offsetLineNumbers) {
        if (offsetLineNumber == 0) {
          // add block decoration before if adding to line 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'before');
        } else {
          // add block decoration after if adding to lines > 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'after');
        }
      }
    }

    /**
     * Creates marker for line highlight.
     *
     * @param startIndex The start index of the line chunk to highlight.
     * @param endIndex The end index of the line chunk to highlight.
     * @param highlightType The type of highlight to be applied to the line.
     */
  }, {
    key: 'highlightLines',
    value: function highlightLines(startIndex, endIndex, highlightType) {
      if (startIndex != endIndex) {
        var highlightClass = 'split-diff-line split-diff-' + highlightType;
        this._createLineMarker(this._lineMarkerLayer, startIndex, endIndex, highlightClass);
      }
    }

    /**
     * The line marker layer holds all added/removed line markers.
     *
     * @return The line marker layer.
     */
  }, {
    key: 'getLineMarkerLayer',
    value: function getLineMarkerLayer() {
      return this._lineMarkerLayer;
    }

    /**
     * The selection marker layer holds all line highlight selection markers.
     *
     * @return The selection marker layer.
     */
  }, {
    key: 'getSelectionMarkerLayer',
    value: function getSelectionMarkerLayer() {
      return this._selectionMarkerLayer;
    }

    /**
     * Highlights words in a given line.
     *
     * @param lineNumber The line number to highlight words on.
     * @param wordDiff An array of objects which look like...
     *    added: boolean (not used)
     *    count: number (not used)
     *    removed: boolean (not used)
     *    value: string
     *    changed: boolean
     * @param type The type of highlight to be applied to the words.
     */
  }, {
    key: 'setWordHighlights',
    value: function setWordHighlights(lineNumber, wordDiff, type, isWhitespaceIgnored) {
      if (wordDiff === undefined) wordDiff = [];

      var klass = 'split-diff-word-' + type;
      var count = 0;

      for (var i = 0; i < wordDiff.length; i++) {
        if (wordDiff[i].value) {
          // fix for #49
          // if there was a change
          // AND one of these is true:
          // if the string is not spaces, highlight
          // OR
          // if the string is spaces and whitespace not ignored, highlight
          if (wordDiff[i].changed && (/\S/.test(wordDiff[i].value) || !/\S/.test(wordDiff[i].value) && !isWhitespaceIgnored)) {
            var marker = this._editor.markBufferRange([[lineNumber, count], [lineNumber, count + wordDiff[i].value.length]], { invalidate: 'never' });
            this._editor.decorateMarker(marker, { type: 'highlight', 'class': klass });
            this._miscMarkers.push(marker);
          }
          count += wordDiff[i].value.length;
        }
      }
    }

    /**
     * Destroys all markers added to this editor by split-diff.
     */
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers() {
      this._lineMarkerLayer.clear();

      this._miscMarkers.forEach(function (marker) {
        marker.destroy();
      });
      this._miscMarkers = [];

      this._selectionMarkerLayer.clear();
    }

    /**
     * Destroys the instance of the EditorDiffExtender and cleans up after itself.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.destroyMarkers();
      this._lineMarkerLayer.destroy();
      this._editor.setPlaceholderText(this._oldPlaceholderText);
      // remove split-diff css selector from editors for keybindings #73
      atom.views.getView(this._editor).classList.remove('split-diff');
    }

    /**
     * Selects lines.
     *
     * @param startLine The line number that the selection starts at.
     * @param endLine The line number that the selection ends at (non-inclusive).
     */
  }, {
    key: 'selectLines',
    value: function selectLines(startLine, endLine) {
      // don't want to highlight if they are the same (same numbers means chunk is
      // just pointing to a location to copy-to-right/copy-to-left)
      if (startLine < endLine) {
        var selectionMarker = this._selectionMarkerLayer.findMarkers({
          startBufferRow: startLine,
          endBufferRow: endLine
        })[0];
        if (!selectionMarker) {
          this._createLineMarker(this._selectionMarkerLayer, startLine, endLine, 'split-diff-selected');
        }
      }
    }
  }, {
    key: 'deselectLines',
    value: function deselectLines(startLine, endLine) {
      var selectionMarker = this._selectionMarkerLayer.findMarkers({
        startBufferRow: startLine,
        endBufferRow: endLine
      })[0];
      if (selectionMarker) {
        selectionMarker.destroy();
      }
    }

    /**
     * Destroy the selection markers.
     */
  }, {
    key: 'deselectAllLines',
    value: function deselectAllLines() {
      this._selectionMarkerLayer.clear();
    }

    /**
     * Used to test whether there is currently an active selection highlight in
     * the editor.
     *
     * @return A boolean signifying whether there is an active selection highlight.
     */
  }, {
    key: 'hasSelection',
    value: function hasSelection() {
      if (this._selectionMarkerLayer.getMarkerCount() > 0) {
        return true;
      }
      return false;
    }

    /**
     * Enable soft wrap for this editor.
     */
  }, {
    key: 'enableSoftWrap',
    value: function enableSoftWrap() {
      try {
        this._editor.setSoftWrapped(true);
      } catch (e) {
        //console.log('Soft wrap was enabled on a text editor that does not exist.');
      }
    }

    /**
     * Removes the text editor without prompting a save.
     */
  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      // if the pane that this editor was in is now empty, we will destroy it
      var editorPane = atom.workspace.paneForItem(this._editor);
      if (typeof editorPane !== 'undefined' && editorPane != null && editorPane.getItems().length == 1) {
        editorPane.destroy();
      } else {
        this._editor.destroy();
      }
    }

    /**
     * Used to get the Text Editor object for this view. Helpful for calling basic
     * Atom Text Editor functions.
     *
     * @return The Text Editor object for this view.
     */
  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this._editor;
    }

    // ----------------------------------------------------------------------- //
    // --------------------------- PRIVATE METHODS --------------------------- //
    // ----------------------------------------------------------------------- //

    /**
     * Creates a marker and decorates its line and line number.
     *
     * @param markerLayer The marker layer to put the marker in.
     * @param startLineNumber A buffer line number to start highlighting at.
     * @param endLineNumber A buffer line number to end highlighting at.
     * @param highlightClass The type of highlight to be applied to the line.
     *    Could be a value of: ['split-diff-insert', 'split-diff-delete',
     *    'split-diff-select'].
     * @return The created line marker.
     */
  }, {
    key: '_createLineMarker',
    value: function _createLineMarker(markerLayer, startLineNumber, endLineNumber, highlightClass) {
      var marker = markerLayer.markBufferRange([[startLineNumber, 0], [endLineNumber, 0]], { invalidate: 'never' });

      this._editor.decorateMarker(marker, { type: 'line-number', 'class': highlightClass });
      this._editor.decorateMarker(marker, { type: 'line', 'class': highlightClass });

      return marker;
    }

    /**
     * Creates a decoration for an offset.
     *
     * @param lineNumber The line number to add the block decoration to.
     * @param numberOfLines The number of lines that the block decoration's height will be.
     * @param blockPosition Specifies whether to put the decoration before the line or after.
     */
  }, {
    key: '_addOffsetDecoration',
    value: function _addOffsetDecoration(lineNumber, numberOfLines, blockPosition) {
      var element = document.createElement('div');
      element.className += 'split-diff-offset';
      // if no text, set height for blank lines
      element.style.minHeight = numberOfLines * this._editor.getLineHeightInPixels() + 'px';

      var marker = this._editor.markScreenPosition([lineNumber, 0], { invalidate: 'never' });
      this._editor.decorateMarker(marker, { type: 'block', position: blockPosition, item: element });
      this._miscMarkers.push(marker);
    }
  }]);

  return EditorDiffExtender;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvZWRpdG9yLWRpZmYtZXh0ZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7QUFFWCxNQUFNLENBQUMsT0FBTztBQUVELFdBRlUsa0JBQWtCLENBRTNCLE1BQU0sRUFBRTswQkFGQyxrQkFBa0I7O0FBR3JDLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3RELFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzNELFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUN2RCxVQUFNLENBQUMsa0JBQWtCLENBQUMsbUNBQW1DLENBQUMsQ0FBQzs7QUFFL0QsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDOUQ7Ozs7Ozs7O2VBWG9CLGtCQUFrQjs7V0FrQnpCLHdCQUFDLFdBQVcsRUFBRTtBQUMxQixVQUFJLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVTtlQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO09BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2VBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRW5ILFdBQUksSUFBSSxnQkFBZ0IsSUFBSSxpQkFBaUIsRUFBRTtBQUM3QyxZQUFHLGdC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QUFFLFNBQU8sY0FBYyxFQUFDLENBQUMsQ0FBQzs7QUFFM0UsYUFBTyxNQUFNLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7V0FTbUIsOEJBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUU7QUFDN0QsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxhQUFPLENBQUMsU0FBUyxJQUFJLG1CQUFtQixDQUFDOztBQUV6QyxhQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxBQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLEdBQUksSUFBSSxDQUFDOztBQUV4RixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDckYsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQzdGLFVBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hDOzs7U0F4UG9CLGtCQUFrQjtJQXlQeEMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL2VkaXRvci1kaWZmLWV4dGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFZGl0b3JEaWZmRXh0ZW5kZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVkaXRvcikge1xuICAgIHRoaXMuX2VkaXRvciA9IGVkaXRvcjtcbiAgICB0aGlzLl9saW5lTWFya2VyTGF5ZXIgPSB0aGlzLl9lZGl0b3IuYWRkTWFya2VyTGF5ZXIoKTtcbiAgICB0aGlzLl9taXNjTWFya2VycyA9IFtdO1xuICAgIHRoaXMuX3NlbGVjdGlvbk1hcmtlckxheWVyID0gdGhpcy5fZWRpdG9yLmFkZE1hcmtlckxheWVyKCk7XG4gICAgdGhpcy5fb2xkUGxhY2Vob2xkZXJUZXh0ID0gZWRpdG9yLmdldFBsYWNlaG9sZGVyVGV4dCgpO1xuICAgIGVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQoJ1Bhc3RlIHdoYXQgeW91IHdhbnQgdG8gZGlmZiBoZXJlIScpO1xuICAgIC8vIGFkZCBzcGxpdC1kaWZmIGNzcyBzZWxlY3RvciB0byBlZGl0b3JzIGZvciBrZXliaW5kaW5ncyAjNzNcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5fZWRpdG9yKS5jbGFzc0xpc3QuYWRkKCdzcGxpdC1kaWZmJyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBvZmZzZXRzIChibGFuayBsaW5lcykgaW50byB0aGUgZWRpdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gbGluZU9mZnNldHMgQW4gYXJyYXkgb2Ygb2Zmc2V0cyAoYmxhbmsgbGluZXMpIHRvIGluc2VydCBpbnRvIHRoaXMgZWRpdG9yLlxuICAgKi9cbiAgc2V0TGluZU9mZnNldHMobGluZU9mZnNldHMpIHtcbiAgICB2YXIgb2Zmc2V0TGluZU51bWJlcnMgPSBPYmplY3Qua2V5cyhsaW5lT2Zmc2V0cykubWFwKGxpbmVOdW1iZXIgPT4gcGFyc2VJbnQobGluZU51bWJlciwgMTApKS5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG5cbiAgICBmb3IodmFyIG9mZnNldExpbmVOdW1iZXIgb2Ygb2Zmc2V0TGluZU51bWJlcnMpIHtcbiAgICAgIGlmKG9mZnNldExpbmVOdW1iZXIgPT0gMCkge1xuICAgICAgICAvLyBhZGQgYmxvY2sgZGVjb3JhdGlvbiBiZWZvcmUgaWYgYWRkaW5nIHRvIGxpbmUgMFxuICAgICAgICB0aGlzLl9hZGRPZmZzZXREZWNvcmF0aW9uKG9mZnNldExpbmVOdW1iZXItMSwgbGluZU9mZnNldHNbb2Zmc2V0TGluZU51bWJlcl0sICdiZWZvcmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFkZCBibG9jayBkZWNvcmF0aW9uIGFmdGVyIGlmIGFkZGluZyB0byBsaW5lcyA+IDBcbiAgICAgICAgdGhpcy5fYWRkT2Zmc2V0RGVjb3JhdGlvbihvZmZzZXRMaW5lTnVtYmVyLTEsIGxpbmVPZmZzZXRzW29mZnNldExpbmVOdW1iZXJdLCAnYWZ0ZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBtYXJrZXIgZm9yIGxpbmUgaGlnaGxpZ2h0LlxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnRJbmRleCBUaGUgc3RhcnQgaW5kZXggb2YgdGhlIGxpbmUgY2h1bmsgdG8gaGlnaGxpZ2h0LlxuICAgKiBAcGFyYW0gZW5kSW5kZXggVGhlIGVuZCBpbmRleCBvZiB0aGUgbGluZSBjaHVuayB0byBoaWdobGlnaHQuXG4gICAqIEBwYXJhbSBoaWdobGlnaHRUeXBlIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSBsaW5lLlxuICAgKi9cbiAgaGlnaGxpZ2h0TGluZXMoc3RhcnRJbmRleCwgZW5kSW5kZXgsIGhpZ2hsaWdodFR5cGUpIHtcbiAgICBpZihzdGFydEluZGV4ICE9IGVuZEluZGV4KSB7XG4gICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3MgPSAnc3BsaXQtZGlmZi1saW5lIHNwbGl0LWRpZmYtJyArIGhpZ2hsaWdodFR5cGU7XG4gICAgICB0aGlzLl9jcmVhdGVMaW5lTWFya2VyKHRoaXMuX2xpbmVNYXJrZXJMYXllciwgc3RhcnRJbmRleCwgZW5kSW5kZXgsIGhpZ2hsaWdodENsYXNzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxpbmUgbWFya2VyIGxheWVyIGhvbGRzIGFsbCBhZGRlZC9yZW1vdmVkIGxpbmUgbWFya2Vycy5cbiAgICpcbiAgICogQHJldHVybiBUaGUgbGluZSBtYXJrZXIgbGF5ZXIuXG4gICAqL1xuICBnZXRMaW5lTWFya2VyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpbmVNYXJrZXJMYXllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2VsZWN0aW9uIG1hcmtlciBsYXllciBob2xkcyBhbGwgbGluZSBoaWdobGlnaHQgc2VsZWN0aW9uIG1hcmtlcnMuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIHNlbGVjdGlvbiBtYXJrZXIgbGF5ZXIuXG4gICAqL1xuICBnZXRTZWxlY3Rpb25NYXJrZXJMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXI7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB3b3JkcyBpbiBhIGdpdmVuIGxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBsaW5lTnVtYmVyIFRoZSBsaW5lIG51bWJlciB0byBoaWdobGlnaHQgd29yZHMgb24uXG4gICAqIEBwYXJhbSB3b3JkRGlmZiBBbiBhcnJheSBvZiBvYmplY3RzIHdoaWNoIGxvb2sgbGlrZS4uLlxuICAgKiAgICBhZGRlZDogYm9vbGVhbiAobm90IHVzZWQpXG4gICAqICAgIGNvdW50OiBudW1iZXIgKG5vdCB1c2VkKVxuICAgKiAgICByZW1vdmVkOiBib29sZWFuIChub3QgdXNlZClcbiAgICogICAgdmFsdWU6IHN0cmluZ1xuICAgKiAgICBjaGFuZ2VkOiBib29sZWFuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSB3b3Jkcy5cbiAgICovXG4gIHNldFdvcmRIaWdobGlnaHRzKGxpbmVOdW1iZXIsIHdvcmREaWZmID0gW10sIHR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpIHtcbiAgICB2YXIga2xhc3MgPSAnc3BsaXQtZGlmZi13b3JkLScgKyB0eXBlO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBmb3IodmFyIGk9MDsgaTx3b3JkRGlmZi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYod29yZERpZmZbaV0udmFsdWUpIHsgLy8gZml4IGZvciAjNDlcbiAgICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgY2hhbmdlXG4gICAgICAgIC8vIEFORCBvbmUgb2YgdGhlc2UgaXMgdHJ1ZTpcbiAgICAgICAgLy8gaWYgdGhlIHN0cmluZyBpcyBub3Qgc3BhY2VzLCBoaWdobGlnaHRcbiAgICAgICAgLy8gT1JcbiAgICAgICAgLy8gaWYgdGhlIHN0cmluZyBpcyBzcGFjZXMgYW5kIHdoaXRlc3BhY2Ugbm90IGlnbm9yZWQsIGhpZ2hsaWdodFxuICAgICAgICBpZih3b3JkRGlmZltpXS5jaGFuZ2VkXG4gICAgICAgICAgJiYgKC9cXFMvLnRlc3Qod29yZERpZmZbaV0udmFsdWUpXG4gICAgICAgICAgfHwgKCEvXFxTLy50ZXN0KHdvcmREaWZmW2ldLnZhbHVlKSAmJiAhaXNXaGl0ZXNwYWNlSWdub3JlZCkpKSB7XG4gICAgICAgICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tsaW5lTnVtYmVyLCBjb3VudF0sIFtsaW5lTnVtYmVyLCAoY291bnQgKyB3b3JkRGlmZltpXS52YWx1ZS5sZW5ndGgpXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSlcbiAgICAgICAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiBrbGFzc30pO1xuICAgICAgICAgIHRoaXMuX21pc2NNYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgfVxuICAgICAgICBjb3VudCArPSB3b3JkRGlmZltpXS52YWx1ZS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFsbCBtYXJrZXJzIGFkZGVkIHRvIHRoaXMgZWRpdG9yIGJ5IHNwbGl0LWRpZmYuXG4gICAqL1xuICBkZXN0cm95TWFya2VycygpIHtcbiAgICB0aGlzLl9saW5lTWFya2VyTGF5ZXIuY2xlYXIoKTtcblxuICAgIHRoaXMuX21pc2NNYXJrZXJzLmZvckVhY2goZnVuY3Rpb24obWFya2VyKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIHRoaXMuX21pc2NNYXJrZXJzID0gW107XG5cbiAgICB0aGlzLl9zZWxlY3Rpb25NYXJrZXJMYXllci5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBpbnN0YW5jZSBvZiB0aGUgRWRpdG9yRGlmZkV4dGVuZGVyIGFuZCBjbGVhbnMgdXAgYWZ0ZXIgaXRzZWxmLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgdGhpcy5fbGluZU1hcmtlckxheWVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9lZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KHRoaXMuX29sZFBsYWNlaG9sZGVyVGV4dCk7XG4gICAgLy8gcmVtb3ZlIHNwbGl0LWRpZmYgY3NzIHNlbGVjdG9yIGZyb20gZWRpdG9ycyBmb3Iga2V5YmluZGluZ3MgIzczXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuX2VkaXRvcikuY2xhc3NMaXN0LnJlbW92ZSgnc3BsaXQtZGlmZicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgbGluZXMuXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydExpbmUgVGhlIGxpbmUgbnVtYmVyIHRoYXQgdGhlIHNlbGVjdGlvbiBzdGFydHMgYXQuXG4gICAqIEBwYXJhbSBlbmRMaW5lIFRoZSBsaW5lIG51bWJlciB0aGF0IHRoZSBzZWxlY3Rpb24gZW5kcyBhdCAobm9uLWluY2x1c2l2ZSkuXG4gICAqL1xuICBzZWxlY3RMaW5lcyhzdGFydExpbmUsIGVuZExpbmUpIHtcbiAgICAvLyBkb24ndCB3YW50IHRvIGhpZ2hsaWdodCBpZiB0aGV5IGFyZSB0aGUgc2FtZSAoc2FtZSBudW1iZXJzIG1lYW5zIGNodW5rIGlzXG4gICAgLy8ganVzdCBwb2ludGluZyB0byBhIGxvY2F0aW9uIHRvIGNvcHktdG8tcmlnaHQvY29weS10by1sZWZ0KVxuICAgIGlmKHN0YXJ0TGluZSA8IGVuZExpbmUpIHtcbiAgICAgIHZhciBzZWxlY3Rpb25NYXJrZXIgPSB0aGlzLl9zZWxlY3Rpb25NYXJrZXJMYXllci5maW5kTWFya2Vycyh7XG4gICAgICAgIHN0YXJ0QnVmZmVyUm93OiBzdGFydExpbmUsXG4gICAgICAgIGVuZEJ1ZmZlclJvdzogZW5kTGluZVxuICAgICAgfSlbMF07XG4gICAgICBpZighc2VsZWN0aW9uTWFya2VyKSB7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUxpbmVNYXJrZXIodGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXIsIHN0YXJ0TGluZSwgZW5kTGluZSwgJ3NwbGl0LWRpZmYtc2VsZWN0ZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdExpbmVzKHN0YXJ0TGluZSwgZW5kTGluZSkge1xuICAgIHZhciBzZWxlY3Rpb25NYXJrZXIgPSB0aGlzLl9zZWxlY3Rpb25NYXJrZXJMYXllci5maW5kTWFya2Vycyh7XG4gICAgICBzdGFydEJ1ZmZlclJvdzogc3RhcnRMaW5lLFxuICAgICAgZW5kQnVmZmVyUm93OiBlbmRMaW5lXG4gICAgfSlbMF07XG4gICAgaWYoc2VsZWN0aW9uTWFya2VyKSB7XG4gICAgICBzZWxlY3Rpb25NYXJrZXIuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzZWxlY3Rpb24gbWFya2Vycy5cbiAgICovXG4gIGRlc2VsZWN0QWxsTGluZXMoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXIuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHRlc3Qgd2hldGhlciB0aGVyZSBpcyBjdXJyZW50bHkgYW4gYWN0aXZlIHNlbGVjdGlvbiBoaWdobGlnaHQgaW5cbiAgICogdGhlIGVkaXRvci5cbiAgICpcbiAgICogQHJldHVybiBBIGJvb2xlYW4gc2lnbmlmeWluZyB3aGV0aGVyIHRoZXJlIGlzIGFuIGFjdGl2ZSBzZWxlY3Rpb24gaGlnaGxpZ2h0LlxuICAgKi9cbiAgaGFzU2VsZWN0aW9uKCkge1xuICAgIGlmKHRoaXMuX3NlbGVjdGlvbk1hcmtlckxheWVyLmdldE1hcmtlckNvdW50KCkgPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBzb2Z0IHdyYXAgZm9yIHRoaXMgZWRpdG9yLlxuICAgKi9cbiAgZW5hYmxlU29mdFdyYXAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2VkaXRvci5zZXRTb2Z0V3JhcHBlZCh0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdTb2Z0IHdyYXAgd2FzIGVuYWJsZWQgb24gYSB0ZXh0IGVkaXRvciB0aGF0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSB0ZXh0IGVkaXRvciB3aXRob3V0IHByb21wdGluZyBhIHNhdmUuXG4gICAqL1xuICBjbGVhblVwKCkge1xuICAgIC8vIGlmIHRoZSBwYW5lIHRoYXQgdGhpcyBlZGl0b3Igd2FzIGluIGlzIG5vdyBlbXB0eSwgd2Ugd2lsbCBkZXN0cm95IGl0XG4gICAgdmFyIGVkaXRvclBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzLl9lZGl0b3IpO1xuICAgIGlmKHR5cGVvZiBlZGl0b3JQYW5lICE9PSAndW5kZWZpbmVkJyAmJiBlZGl0b3JQYW5lICE9IG51bGwgJiYgZWRpdG9yUGFuZS5nZXRJdGVtcygpLmxlbmd0aCA9PSAxKSB7XG4gICAgICBlZGl0b3JQYW5lLmRlc3Ryb3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWRpdG9yLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBnZXQgdGhlIFRleHQgRWRpdG9yIG9iamVjdCBmb3IgdGhpcyB2aWV3LiBIZWxwZnVsIGZvciBjYWxsaW5nIGJhc2ljXG4gICAqIEF0b20gVGV4dCBFZGl0b3IgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBUZXh0IEVkaXRvciBvYmplY3QgZm9yIHRoaXMgdmlldy5cbiAgICovXG4gIGdldEVkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBSSVZBVEUgTUVUSE9EUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hcmtlciBhbmQgZGVjb3JhdGVzIGl0cyBsaW5lIGFuZCBsaW5lIG51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIG1hcmtlckxheWVyIFRoZSBtYXJrZXIgbGF5ZXIgdG8gcHV0IHRoZSBtYXJrZXIgaW4uXG4gICAqIEBwYXJhbSBzdGFydExpbmVOdW1iZXIgQSBidWZmZXIgbGluZSBudW1iZXIgdG8gc3RhcnQgaGlnaGxpZ2h0aW5nIGF0LlxuICAgKiBAcGFyYW0gZW5kTGluZU51bWJlciBBIGJ1ZmZlciBsaW5lIG51bWJlciB0byBlbmQgaGlnaGxpZ2h0aW5nIGF0LlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0Q2xhc3MgVGhlIHR5cGUgb2YgaGlnaGxpZ2h0IHRvIGJlIGFwcGxpZWQgdG8gdGhlIGxpbmUuXG4gICAqICAgIENvdWxkIGJlIGEgdmFsdWUgb2Y6IFsnc3BsaXQtZGlmZi1pbnNlcnQnLCAnc3BsaXQtZGlmZi1kZWxldGUnLFxuICAgKiAgICAnc3BsaXQtZGlmZi1zZWxlY3QnXS5cbiAgICogQHJldHVybiBUaGUgY3JlYXRlZCBsaW5lIG1hcmtlci5cbiAgICovXG4gIF9jcmVhdGVMaW5lTWFya2VyKG1hcmtlckxheWVyLCBzdGFydExpbmVOdW1iZXIsIGVuZExpbmVOdW1iZXIsIGhpZ2hsaWdodENsYXNzKSB7XG4gICAgdmFyIG1hcmtlciA9IG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShbW3N0YXJ0TGluZU51bWJlciwgMF0sIFtlbmRMaW5lTnVtYmVyLCAwXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSlcblxuICAgIHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogaGlnaGxpZ2h0Q2xhc3N9KTtcbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogaGlnaGxpZ2h0Q2xhc3N9KTtcblxuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGRlY29yYXRpb24gZm9yIGFuIG9mZnNldC5cbiAgICpcbiAgICogQHBhcmFtIGxpbmVOdW1iZXIgVGhlIGxpbmUgbnVtYmVyIHRvIGFkZCB0aGUgYmxvY2sgZGVjb3JhdGlvbiB0by5cbiAgICogQHBhcmFtIG51bWJlck9mTGluZXMgVGhlIG51bWJlciBvZiBsaW5lcyB0aGF0IHRoZSBibG9jayBkZWNvcmF0aW9uJ3MgaGVpZ2h0IHdpbGwgYmUuXG4gICAqIEBwYXJhbSBibG9ja1Bvc2l0aW9uIFNwZWNpZmllcyB3aGV0aGVyIHRvIHB1dCB0aGUgZGVjb3JhdGlvbiBiZWZvcmUgdGhlIGxpbmUgb3IgYWZ0ZXIuXG4gICAqL1xuICBfYWRkT2Zmc2V0RGVjb3JhdGlvbihsaW5lTnVtYmVyLCBudW1iZXJPZkxpbmVzLCBibG9ja1Bvc2l0aW9uKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnc3BsaXQtZGlmZi1vZmZzZXQnO1xuICAgIC8vIGlmIG5vIHRleHQsIHNldCBoZWlnaHQgZm9yIGJsYW5rIGxpbmVzXG4gICAgZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSAobnVtYmVyT2ZMaW5lcyAqIHRoaXMuX2VkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSkgKyAncHgnO1xuXG4gICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrU2NyZWVuUG9zaXRpb24oW2xpbmVOdW1iZXIsIDBdLCB7aW52YWxpZGF0ZTogJ25ldmVyJ30pO1xuICAgIHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnYmxvY2snLCBwb3NpdGlvbjogYmxvY2tQb3NpdGlvbiwgaXRlbTogZWxlbWVudH0pO1xuICAgIHRoaXMuX21pc2NNYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgfVxufTtcbiJdfQ==