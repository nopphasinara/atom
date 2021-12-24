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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9lZGl0b3ItZGlmZi1leHRlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztBQUVYLE1BQU0sQ0FBQyxPQUFPO0FBRUQsV0FGVSxrQkFBa0IsQ0FFM0IsTUFBTSxFQUFFOzBCQUZDLGtCQUFrQjs7QUFHckMsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEQsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDM0QsUUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDOztBQUUvRCxRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUM5RDs7Ozs7Ozs7ZUFYb0Isa0JBQWtCOztXQWtCekIsd0JBQUMsV0FBVyxFQUFFO0FBQzFCLFVBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxVQUFVO2VBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7T0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7ZUFBSyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFbkgsV0FBSSxJQUFJLGdCQUFnQixJQUFJLGlCQUFpQixFQUFFO0FBQzdD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RSxNQUFNLEVBQUUsU0FBTyxjQUFjLEVBQUMsQ0FBQyxDQUFDOztBQUUzRSxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7Ozs7Ozs7OztXQVNtQiw4QkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRTtBQUM3RCxVQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGFBQU8sQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUM7O0FBRXpDLGFBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEFBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsR0FBSSxJQUFJLENBQUM7O0FBRXhGLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNyRixVQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDN0YsVUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7OztTQXhQb0Isa0JBQWtCO0lBeVB4QyxDQUFDIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9lZGl0b3ItZGlmZi1leHRlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRWRpdG9yRGlmZkV4dGVuZGVyIHtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5fbGluZU1hcmtlckxheWVyID0gdGhpcy5fZWRpdG9yLmFkZE1hcmtlckxheWVyKCk7XG4gICAgdGhpcy5fbWlzY01hcmtlcnMgPSBbXTtcbiAgICB0aGlzLl9zZWxlY3Rpb25NYXJrZXJMYXllciA9IHRoaXMuX2VkaXRvci5hZGRNYXJrZXJMYXllcigpO1xuICAgIHRoaXMuX29sZFBsYWNlaG9sZGVyVGV4dCA9IGVkaXRvci5nZXRQbGFjZWhvbGRlclRleHQoKTtcbiAgICBlZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KCdQYXN0ZSB3aGF0IHlvdSB3YW50IHRvIGRpZmYgaGVyZSEnKTtcbiAgICAvLyBhZGQgc3BsaXQtZGlmZiBjc3Mgc2VsZWN0b3IgdG8gZWRpdG9ycyBmb3Iga2V5YmluZGluZ3MgIzczXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuX2VkaXRvcikuY2xhc3NMaXN0LmFkZCgnc3BsaXQtZGlmZicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb2Zmc2V0cyAoYmxhbmsgbGluZXMpIGludG8gdGhlIGVkaXRvci5cbiAgICpcbiAgICogQHBhcmFtIGxpbmVPZmZzZXRzIEFuIGFycmF5IG9mIG9mZnNldHMgKGJsYW5rIGxpbmVzKSB0byBpbnNlcnQgaW50byB0aGlzIGVkaXRvci5cbiAgICovXG4gIHNldExpbmVPZmZzZXRzKGxpbmVPZmZzZXRzKSB7XG4gICAgdmFyIG9mZnNldExpbmVOdW1iZXJzID0gT2JqZWN0LmtleXMobGluZU9mZnNldHMpLm1hcChsaW5lTnVtYmVyID0+IHBhcnNlSW50KGxpbmVOdW1iZXIsIDEwKSkuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuXG4gICAgZm9yKHZhciBvZmZzZXRMaW5lTnVtYmVyIG9mIG9mZnNldExpbmVOdW1iZXJzKSB7XG4gICAgICBpZihvZmZzZXRMaW5lTnVtYmVyID09IDApIHtcbiAgICAgICAgLy8gYWRkIGJsb2NrIGRlY29yYXRpb24gYmVmb3JlIGlmIGFkZGluZyB0byBsaW5lIDBcbiAgICAgICAgdGhpcy5fYWRkT2Zmc2V0RGVjb3JhdGlvbihvZmZzZXRMaW5lTnVtYmVyLTEsIGxpbmVPZmZzZXRzW29mZnNldExpbmVOdW1iZXJdLCAnYmVmb3JlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhZGQgYmxvY2sgZGVjb3JhdGlvbiBhZnRlciBpZiBhZGRpbmcgdG8gbGluZXMgPiAwXG4gICAgICAgIHRoaXMuX2FkZE9mZnNldERlY29yYXRpb24ob2Zmc2V0TGluZU51bWJlci0xLCBsaW5lT2Zmc2V0c1tvZmZzZXRMaW5lTnVtYmVyXSwgJ2FmdGVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWFya2VyIGZvciBsaW5lIGhpZ2hsaWdodC5cbiAgICpcbiAgICogQHBhcmFtIHN0YXJ0SW5kZXggVGhlIHN0YXJ0IGluZGV4IG9mIHRoZSBsaW5lIGNodW5rIHRvIGhpZ2hsaWdodC5cbiAgICogQHBhcmFtIGVuZEluZGV4IFRoZSBlbmQgaW5kZXggb2YgdGhlIGxpbmUgY2h1bmsgdG8gaGlnaGxpZ2h0LlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0VHlwZSBUaGUgdHlwZSBvZiBoaWdobGlnaHQgdG8gYmUgYXBwbGllZCB0byB0aGUgbGluZS5cbiAgICovXG4gIGhpZ2hsaWdodExpbmVzKHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBoaWdobGlnaHRUeXBlKSB7XG4gICAgaWYoc3RhcnRJbmRleCAhPSBlbmRJbmRleCkge1xuICAgICAgdmFyIGhpZ2hsaWdodENsYXNzID0gJ3NwbGl0LWRpZmYtbGluZSBzcGxpdC1kaWZmLScgKyBoaWdobGlnaHRUeXBlO1xuICAgICAgdGhpcy5fY3JlYXRlTGluZU1hcmtlcih0aGlzLl9saW5lTWFya2VyTGF5ZXIsIHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBoaWdobGlnaHRDbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsaW5lIG1hcmtlciBsYXllciBob2xkcyBhbGwgYWRkZWQvcmVtb3ZlZCBsaW5lIG1hcmtlcnMuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGxpbmUgbWFya2VyIGxheWVyLlxuICAgKi9cbiAgZ2V0TGluZU1hcmtlckxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9saW5lTWFya2VyTGF5ZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHNlbGVjdGlvbiBtYXJrZXIgbGF5ZXIgaG9sZHMgYWxsIGxpbmUgaGlnaGxpZ2h0IHNlbGVjdGlvbiBtYXJrZXJzLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBzZWxlY3Rpb24gbWFya2VyIGxheWVyLlxuICAgKi9cbiAgZ2V0U2VsZWN0aW9uTWFya2VyTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1hcmtlckxheWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgd29yZHMgaW4gYSBnaXZlbiBsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gbGluZU51bWJlciBUaGUgbGluZSBudW1iZXIgdG8gaGlnaGxpZ2h0IHdvcmRzIG9uLlxuICAgKiBAcGFyYW0gd29yZERpZmYgQW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCBsb29rIGxpa2UuLi5cbiAgICogICAgYWRkZWQ6IGJvb2xlYW4gKG5vdCB1c2VkKVxuICAgKiAgICBjb3VudDogbnVtYmVyIChub3QgdXNlZClcbiAgICogICAgcmVtb3ZlZDogYm9vbGVhbiAobm90IHVzZWQpXG4gICAqICAgIHZhbHVlOiBzdHJpbmdcbiAgICogICAgY2hhbmdlZDogYm9vbGVhblxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBoaWdobGlnaHQgdG8gYmUgYXBwbGllZCB0byB0aGUgd29yZHMuXG4gICAqL1xuICBzZXRXb3JkSGlnaGxpZ2h0cyhsaW5lTnVtYmVyLCB3b3JkRGlmZiA9IFtdLCB0eXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKSB7XG4gICAgdmFyIGtsYXNzID0gJ3NwbGl0LWRpZmYtd29yZC0nICsgdHlwZTtcbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgZm9yKHZhciBpPTA7IGk8d29yZERpZmYubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHdvcmREaWZmW2ldLnZhbHVlKSB7IC8vIGZpeCBmb3IgIzQ5XG4gICAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIGNoYW5nZVxuICAgICAgICAvLyBBTkQgb25lIG9mIHRoZXNlIGlzIHRydWU6XG4gICAgICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgbm90IHNwYWNlcywgaGlnaGxpZ2h0XG4gICAgICAgIC8vIE9SXG4gICAgICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgc3BhY2VzIGFuZCB3aGl0ZXNwYWNlIG5vdCBpZ25vcmVkLCBoaWdobGlnaHRcbiAgICAgICAgaWYod29yZERpZmZbaV0uY2hhbmdlZFxuICAgICAgICAgICYmICgvXFxTLy50ZXN0KHdvcmREaWZmW2ldLnZhbHVlKVxuICAgICAgICAgIHx8ICghL1xcUy8udGVzdCh3b3JkRGlmZltpXS52YWx1ZSkgJiYgIWlzV2hpdGVzcGFjZUlnbm9yZWQpKSkge1xuICAgICAgICAgIHZhciBtYXJrZXIgPSB0aGlzLl9lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbbGluZU51bWJlciwgY291bnRdLCBbbGluZU51bWJlciwgKGNvdW50ICsgd29yZERpZmZbaV0udmFsdWUubGVuZ3RoKV1dLCB7aW52YWxpZGF0ZTogJ25ldmVyJ30pXG4gICAgICAgICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczoga2xhc3N9KTtcbiAgICAgICAgICB0aGlzLl9taXNjTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgY291bnQgKz0gd29yZERpZmZbaV0udmFsdWUubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyBhbGwgbWFya2VycyBhZGRlZCB0byB0aGlzIGVkaXRvciBieSBzcGxpdC1kaWZmLlxuICAgKi9cbiAgZGVzdHJveU1hcmtlcnMoKSB7XG4gICAgdGhpcy5fbGluZU1hcmtlckxheWVyLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9taXNjTWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgbWFya2VyLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICB0aGlzLl9taXNjTWFya2VycyA9IFtdO1xuXG4gICAgdGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXIuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgaW5zdGFuY2Ugb2YgdGhlIEVkaXRvckRpZmZFeHRlbmRlciBhbmQgY2xlYW5zIHVwIGFmdGVyIGl0c2VsZi5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95TWFya2VycygpO1xuICAgIHRoaXMuX2xpbmVNYXJrZXJMYXllci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCh0aGlzLl9vbGRQbGFjZWhvbGRlclRleHQpO1xuICAgIC8vIHJlbW92ZSBzcGxpdC1kaWZmIGNzcyBzZWxlY3RvciBmcm9tIGVkaXRvcnMgZm9yIGtleWJpbmRpbmdzICM3M1xuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLl9lZGl0b3IpLmNsYXNzTGlzdC5yZW1vdmUoJ3NwbGl0LWRpZmYnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGxpbmVzLlxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnRMaW5lIFRoZSBsaW5lIG51bWJlciB0aGF0IHRoZSBzZWxlY3Rpb24gc3RhcnRzIGF0LlxuICAgKiBAcGFyYW0gZW5kTGluZSBUaGUgbGluZSBudW1iZXIgdGhhdCB0aGUgc2VsZWN0aW9uIGVuZHMgYXQgKG5vbi1pbmNsdXNpdmUpLlxuICAgKi9cbiAgc2VsZWN0TGluZXMoc3RhcnRMaW5lLCBlbmRMaW5lKSB7XG4gICAgLy8gZG9uJ3Qgd2FudCB0byBoaWdobGlnaHQgaWYgdGhleSBhcmUgdGhlIHNhbWUgKHNhbWUgbnVtYmVycyBtZWFucyBjaHVuayBpc1xuICAgIC8vIGp1c3QgcG9pbnRpbmcgdG8gYSBsb2NhdGlvbiB0byBjb3B5LXRvLXJpZ2h0L2NvcHktdG8tbGVmdClcbiAgICBpZihzdGFydExpbmUgPCBlbmRMaW5lKSB7XG4gICAgICB2YXIgc2VsZWN0aW9uTWFya2VyID0gdGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXIuZmluZE1hcmtlcnMoe1xuICAgICAgICBzdGFydEJ1ZmZlclJvdzogc3RhcnRMaW5lLFxuICAgICAgICBlbmRCdWZmZXJSb3c6IGVuZExpbmVcbiAgICAgIH0pWzBdO1xuICAgICAgaWYoIXNlbGVjdGlvbk1hcmtlcikge1xuICAgICAgICB0aGlzLl9jcmVhdGVMaW5lTWFya2VyKHRoaXMuX3NlbGVjdGlvbk1hcmtlckxheWVyLCBzdGFydExpbmUsIGVuZExpbmUsICdzcGxpdC1kaWZmLXNlbGVjdGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzZWxlY3RMaW5lcyhzdGFydExpbmUsIGVuZExpbmUpIHtcbiAgICB2YXIgc2VsZWN0aW9uTWFya2VyID0gdGhpcy5fc2VsZWN0aW9uTWFya2VyTGF5ZXIuZmluZE1hcmtlcnMoe1xuICAgICAgc3RhcnRCdWZmZXJSb3c6IHN0YXJ0TGluZSxcbiAgICAgIGVuZEJ1ZmZlclJvdzogZW5kTGluZVxuICAgIH0pWzBdO1xuICAgIGlmKHNlbGVjdGlvbk1hcmtlcikge1xuICAgICAgc2VsZWN0aW9uTWFya2VyLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgc2VsZWN0aW9uIG1hcmtlcnMuXG4gICAqL1xuICBkZXNlbGVjdEFsbExpbmVzKCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1hcmtlckxheWVyLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byB0ZXN0IHdoZXRoZXIgdGhlcmUgaXMgY3VycmVudGx5IGFuIGFjdGl2ZSBzZWxlY3Rpb24gaGlnaGxpZ2h0IGluXG4gICAqIHRoZSBlZGl0b3IuXG4gICAqXG4gICAqIEByZXR1cm4gQSBib29sZWFuIHNpZ25pZnlpbmcgd2hldGhlciB0aGVyZSBpcyBhbiBhY3RpdmUgc2VsZWN0aW9uIGhpZ2hsaWdodC5cbiAgICovXG4gIGhhc1NlbGVjdGlvbigpIHtcbiAgICBpZih0aGlzLl9zZWxlY3Rpb25NYXJrZXJMYXllci5nZXRNYXJrZXJDb3VudCgpID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGUgc29mdCB3cmFwIGZvciB0aGlzIGVkaXRvci5cbiAgICovXG4gIGVuYWJsZVNvZnRXcmFwKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9lZGl0b3Iuc2V0U29mdFdyYXBwZWQodHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9jb25zb2xlLmxvZygnU29mdCB3cmFwIHdhcyBlbmFibGVkIG9uIGEgdGV4dCBlZGl0b3IgdGhhdCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgdGV4dCBlZGl0b3Igd2l0aG91dCBwcm9tcHRpbmcgYSBzYXZlLlxuICAgKi9cbiAgY2xlYW5VcCgpIHtcbiAgICAvLyBpZiB0aGUgcGFuZSB0aGF0IHRoaXMgZWRpdG9yIHdhcyBpbiBpcyBub3cgZW1wdHksIHdlIHdpbGwgZGVzdHJveSBpdFxuICAgIHZhciBlZGl0b3JQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5fZWRpdG9yKTtcbiAgICBpZih0eXBlb2YgZWRpdG9yUGFuZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZWRpdG9yUGFuZSAhPSBudWxsICYmIGVkaXRvclBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggPT0gMSkge1xuICAgICAgZWRpdG9yUGFuZS5kZXN0cm95KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VkaXRvci5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZ2V0IHRoZSBUZXh0IEVkaXRvciBvYmplY3QgZm9yIHRoaXMgdmlldy4gSGVscGZ1bCBmb3IgY2FsbGluZyBiYXNpY1xuICAgKiBBdG9tIFRleHQgRWRpdG9yIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQHJldHVybiBUaGUgVGV4dCBFZGl0b3Igb2JqZWN0IGZvciB0aGlzIHZpZXcuXG4gICAqL1xuICBnZXRFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvcjtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUklWQVRFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXJrZXIgYW5kIGRlY29yYXRlcyBpdHMgbGluZSBhbmQgbGluZSBudW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSBtYXJrZXJMYXllciBUaGUgbWFya2VyIGxheWVyIHRvIHB1dCB0aGUgbWFya2VyIGluLlxuICAgKiBAcGFyYW0gc3RhcnRMaW5lTnVtYmVyIEEgYnVmZmVyIGxpbmUgbnVtYmVyIHRvIHN0YXJ0IGhpZ2hsaWdodGluZyBhdC5cbiAgICogQHBhcmFtIGVuZExpbmVOdW1iZXIgQSBidWZmZXIgbGluZSBudW1iZXIgdG8gZW5kIGhpZ2hsaWdodGluZyBhdC5cbiAgICogQHBhcmFtIGhpZ2hsaWdodENsYXNzIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSBsaW5lLlxuICAgKiAgICBDb3VsZCBiZSBhIHZhbHVlIG9mOiBbJ3NwbGl0LWRpZmYtaW5zZXJ0JywgJ3NwbGl0LWRpZmYtZGVsZXRlJyxcbiAgICogICAgJ3NwbGl0LWRpZmYtc2VsZWN0J10uXG4gICAqIEByZXR1cm4gVGhlIGNyZWF0ZWQgbGluZSBtYXJrZXIuXG4gICAqL1xuICBfY3JlYXRlTGluZU1hcmtlcihtYXJrZXJMYXllciwgc3RhcnRMaW5lTnVtYmVyLCBlbmRMaW5lTnVtYmVyLCBoaWdobGlnaHRDbGFzcykge1xuICAgIHZhciBtYXJrZXIgPSBtYXJrZXJMYXllci5tYXJrQnVmZmVyUmFuZ2UoW1tzdGFydExpbmVOdW1iZXIsIDBdLCBbZW5kTGluZU51bWJlciwgMF1dLCB7aW52YWxpZGF0ZTogJ25ldmVyJ30pXG5cbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSk7XG4gICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lJywgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSk7XG5cbiAgICByZXR1cm4gbWFya2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBkZWNvcmF0aW9uIGZvciBhbiBvZmZzZXQuXG4gICAqXG4gICAqIEBwYXJhbSBsaW5lTnVtYmVyIFRoZSBsaW5lIG51bWJlciB0byBhZGQgdGhlIGJsb2NrIGRlY29yYXRpb24gdG8uXG4gICAqIEBwYXJhbSBudW1iZXJPZkxpbmVzIFRoZSBudW1iZXIgb2YgbGluZXMgdGhhdCB0aGUgYmxvY2sgZGVjb3JhdGlvbidzIGhlaWdodCB3aWxsIGJlLlxuICAgKiBAcGFyYW0gYmxvY2tQb3NpdGlvbiBTcGVjaWZpZXMgd2hldGhlciB0byBwdXQgdGhlIGRlY29yYXRpb24gYmVmb3JlIHRoZSBsaW5lIG9yIGFmdGVyLlxuICAgKi9cbiAgX2FkZE9mZnNldERlY29yYXRpb24obGluZU51bWJlciwgbnVtYmVyT2ZMaW5lcywgYmxvY2tQb3NpdGlvbikge1xuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJ3NwbGl0LWRpZmYtb2Zmc2V0JztcbiAgICAvLyBpZiBubyB0ZXh0LCBzZXQgaGVpZ2h0IGZvciBibGFuayBsaW5lc1xuICAgIGVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gKG51bWJlck9mTGluZXMgKiB0aGlzLl9lZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkpICsgJ3B4JztcblxuICAgIHZhciBtYXJrZXIgPSB0aGlzLl9lZGl0b3IubWFya1NjcmVlblBvc2l0aW9uKFtsaW5lTnVtYmVyLCAwXSwge2ludmFsaWRhdGU6ICduZXZlcid9KTtcbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2Jsb2NrJywgcG9zaXRpb246IGJsb2NrUG9zaXRpb24sIGl0ZW06IGVsZW1lbnR9KTtcbiAgICB0aGlzLl9taXNjTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gIH1cbn07XG4iXX0=