var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _editorDiffExtender = require('./editor-diff-extender');

var _editorDiffExtender2 = _interopRequireDefault(_editorDiffExtender);

var _computeWordDiff = require('./compute-word-diff');

var _computeWordDiff2 = _interopRequireDefault(_computeWordDiff);

'use babel';

module.exports = (function () {
  /*
   * @param editors Array of editors being diffed.
   */

  function DiffView(editors) {
    _classCallCheck(this, DiffView);

    this._editorDiffExtender1 = new _editorDiffExtender2['default'](editors.editor1);
    this._editorDiffExtender2 = new _editorDiffExtender2['default'](editors.editor2);
    this._chunks = [];
    this._isSelectionActive = false;
    this._selectedChunkIndex = 0;
    this._COPY_HELP_MESSAGE = 'No differences selected.';
    this._markerLayers = {};
  }

  /**
   * Adds highlighting to the editors to show the diff.
   *
   * @param diff The diff to highlight.
   * @param addedColorSide The side that the added highlights should be applied to. Either 'left' or 'right'.
   * @param isWordDiffEnabled Whether differences between words per line should be highlighted.
   * @param isWhitespaceIgnored Whether whitespace should be ignored.
   * @param useCustomStyle Whether to use the user's customized highlight colors.
   */

  _createClass(DiffView, [{
    key: 'displayDiff',
    value: function displayDiff(diff, addedColorSide, isWordDiffEnabled, isWhitespaceIgnored, useCustomStyle) {
      this._chunks = diff.chunks || [];

      var leftHighlightType = 'added';
      var rightHighlightType = 'removed';
      if (addedColorSide == 'right') {
        leftHighlightType = 'removed';
        rightHighlightType = 'added';
      }
      if (useCustomStyle) {
        leftHighlightType += '-custom';
        rightHighlightType += '-custom';
      }

      // make the last chunk equal size on both screens so the editors retain sync scroll #58
      if (this.getNumDifferences() > 0) {
        var lastChunk = this._chunks[this._chunks.length - 1];
        var oldChunkRange = lastChunk.oldLineEnd - lastChunk.oldLineStart;
        var newChunkRange = lastChunk.newLineEnd - lastChunk.newLineStart;
        if (oldChunkRange > newChunkRange) {
          // make the offset as large as needed to make the chunk the same size in both editors
          diff.newLineOffsets[lastChunk.newLineStart + newChunkRange] = oldChunkRange - newChunkRange;
        } else if (newChunkRange > oldChunkRange) {
          // make the offset as large as needed to make the chunk the same size in both editors
          diff.oldLineOffsets[lastChunk.oldLineStart + oldChunkRange] = newChunkRange - oldChunkRange;
        }
      }

      for (var chunk of this._chunks) {
        this._editorDiffExtender1.highlightLines(chunk.oldLineStart, chunk.oldLineEnd, leftHighlightType);
        this._editorDiffExtender2.highlightLines(chunk.newLineStart, chunk.newLineEnd, rightHighlightType);

        if (isWordDiffEnabled) {
          this._highlightWordsInChunk(chunk, leftHighlightType, rightHighlightType, isWhitespaceIgnored);
        }
      }

      this._editorDiffExtender1.setLineOffsets(diff.oldLineOffsets);
      this._editorDiffExtender2.setLineOffsets(diff.newLineOffsets);

      this._markerLayers = {
        editor1: {
          id: this._editorDiffExtender1.getEditor().id,
          lineMarkerLayer: this._editorDiffExtender1.getLineMarkerLayer(),
          highlightType: leftHighlightType,
          selectionMarkerLayer: this._editorDiffExtender1.getSelectionMarkerLayer()
        },
        editor2: {
          id: this._editorDiffExtender2.getEditor().id,
          lineMarkerLayer: this._editorDiffExtender2.getLineMarkerLayer(),
          highlightType: rightHighlightType,
          selectionMarkerLayer: this._editorDiffExtender2.getSelectionMarkerLayer()
        }
      };
    }

    /**
     * Clears the diff highlighting and offsets from the editors.
     */
  }, {
    key: 'clearDiff',
    value: function clearDiff() {
      this._editorDiffExtender1.destroyMarkers();
      this._editorDiffExtender2.destroyMarkers();
    }

    /**
     * Called to move the current selection highlight to the next diff chunk.
     * @param isSyncScrollEnabled Only autoscroll one editor if sync scroll is enabled or we will get in an infinite loop
     */
  }, {
    key: 'nextDiff',
    value: function nextDiff(isSyncScrollEnabled) {
      if (this._isSelectionActive) {
        this._selectedChunkIndex++;
        if (this._selectedChunkIndex >= this.getNumDifferences()) {
          this._selectedChunkIndex = 0;
        }
      } else {
        this._isSelectionActive = true;
      }

      var success = this._selectChunk(this._selectedChunkIndex, true, isSyncScrollEnabled);
      if (!success) {
        return -1;
      }

      return this._selectedChunkIndex;
    }

    /**
     * Called to move the current selection highlight to the previous diff chunk.
     * @param isSyncScrollEnabled Only autoscroll one editor if sync scroll is enabled or we will get in an infinite loop
     */
  }, {
    key: 'prevDiff',
    value: function prevDiff(isSyncScrollEnabled) {
      if (this._isSelectionActive) {
        this._selectedChunkIndex--;
        if (this._selectedChunkIndex < 0) {
          this._selectedChunkIndex = this.getNumDifferences() - 1;
        }
      } else {
        this._isSelectionActive = true;
      }

      var success = this._selectChunk(this._selectedChunkIndex, true, isSyncScrollEnabled);
      if (!success) {
        return -1;
      }

      return this._selectedChunkIndex;
    }

    /**
     * Copies the currently selected diff chunk from the left editor to the right
     * editor.
     */
  }, {
    key: 'copyToRight',
    value: function copyToRight() {
      var foundSelection = false;
      var offset = 0; // keep track of line offset (used when there are multiple chunks being moved)

      for (var diffChunk of this._chunks) {
        if (diffChunk.isSelected) {
          foundSelection = true;

          var textToCopy = this._editorDiffExtender1.getEditor().getTextInBufferRange([[diffChunk.oldLineStart, 0], [diffChunk.oldLineEnd, 0]]);
          var lastBufferRow = this._editorDiffExtender2.getEditor().getLastBufferRow();

          // insert new line if the chunk we want to copy will be below the last line of the other editor
          if (diffChunk.newLineStart + offset > lastBufferRow) {
            this._editorDiffExtender2.getEditor().setCursorBufferPosition([lastBufferRow, 0], { autoscroll: false });
            this._editorDiffExtender2.getEditor().insertNewline();
          }

          this._editorDiffExtender2.getEditor().setTextInBufferRange([[diffChunk.newLineStart + offset, 0], [diffChunk.newLineEnd + offset, 0]], textToCopy);
          // offset will be the amount of lines to be copied minus the amount of lines overwritten
          offset += diffChunk.oldLineEnd - diffChunk.oldLineStart - (diffChunk.newLineEnd - diffChunk.newLineStart);
          // move the selection pointer back so the next diff chunk is not skipped
          if (this._editorDiffExtender1.hasSelection() || this._editorDiffExtender2.hasSelection()) {
            this._selectedChunkIndex--;
          }
        }
      }

      if (!foundSelection) {
        atom.notifications.addWarning('Split Diff', { detail: this._COPY_HELP_MESSAGE, dismissable: false, icon: 'diff' });
      }
    }

    /**
     * Copies the currently selected diff chunk from the right editor to the left
     * editor.
     */
  }, {
    key: 'copyToLeft',
    value: function copyToLeft() {
      var foundSelection = false;
      var offset = 0; // keep track of line offset (used when there are multiple chunks being moved)

      for (var diffChunk of this._chunks) {
        if (diffChunk.isSelected) {
          foundSelection = true;

          var textToCopy = this._editorDiffExtender2.getEditor().getTextInBufferRange([[diffChunk.newLineStart, 0], [diffChunk.newLineEnd, 0]]);
          var lastBufferRow = this._editorDiffExtender1.getEditor().getLastBufferRow();
          // insert new line if the chunk we want to copy will be below the last line of the other editor
          if (diffChunk.oldLineStart + offset > lastBufferRow) {
            this._editorDiffExtender1.getEditor().setCursorBufferPosition([lastBufferRow, 0], { autoscroll: false });
            this._editorDiffExtender1.getEditor().insertNewline();
          }

          this._editorDiffExtender1.getEditor().setTextInBufferRange([[diffChunk.oldLineStart + offset, 0], [diffChunk.oldLineEnd + offset, 0]], textToCopy);
          // offset will be the amount of lines to be copied minus the amount of lines overwritten
          offset += diffChunk.newLineEnd - diffChunk.newLineStart - (diffChunk.oldLineEnd - diffChunk.oldLineStart);
          // move the selection pointer back so the next diff chunk is not skipped
          if (this._editorDiffExtender1.hasSelection() || this._editorDiffExtender2.hasSelection()) {
            this._selectedChunkIndex--;
          }
        }
      }

      if (!foundSelection) {
        atom.notifications.addWarning('Split Diff', { detail: this._COPY_HELP_MESSAGE, dismissable: false, icon: 'diff' });
      }
    }

    /**
     * Cleans up the editor indicated by index. A clean up will remove the editor
     * or the pane if necessary. Typically left editor == 1 and right editor == 2.
     *
     * @param editorIndex The index of the editor to clean up.
     */
  }, {
    key: 'cleanUpEditor',
    value: function cleanUpEditor(editorIndex) {
      if (editorIndex === 1) {
        this._editorDiffExtender1.cleanUp();
      } else if (editorIndex === 2) {
        this._editorDiffExtender2.cleanUp();
      }
    }

    /**
     * Restores soft wrap to the appropriate editor.
     * @param editorIndex The index of the editor to restore soft wrap to.
     */
  }, {
    key: 'restoreEditorSoftWrap',
    value: function restoreEditorSoftWrap(editorIndex) {
      if (editorIndex === 1) {
        this._editorDiffExtender1.getEditor().setSoftWrapped(true);
      } else if (editorIndex === 2) {
        this._editorDiffExtender2.getEditor().setSoftWrapped(true);
      }
    }

    /**
     * Destroys the editor diff extenders.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this._editorDiffExtender1.destroy();
      this._editorDiffExtender2.destroy();
    }

    /**
     * Gets the number of differences between the editors.
     *
     * @return int The number of differences between the editors.
     */
  }, {
    key: 'getNumDifferences',
    value: function getNumDifferences() {
      return Array.isArray(this._chunks) ? this._chunks.length : 0;
    }

    /**
     * Gets the marker layers in use by the editors.
     * @return An object containing the marker layers and approriate information.
     */
  }, {
    key: 'getMarkerLayers',
    value: function getMarkerLayers() {
      return this._markerLayers;
    }

    /**
     * Handles when the cursor moves in the editor. Will highlight chunks that have a cursor in them.
     * @param cursor The cursor object from the event.
     * @param oldBufferPosition The old position of the cursor in the buffer.
     * @param newBufferPosition The new position of the cursor in the buffer.
     */
  }, {
    key: 'handleCursorChange',
    value: function handleCursorChange(cursor, oldBufferPosition, newBufferPosition) {
      var editorIndex = cursor.editor === this._editorDiffExtender1.getEditor() ? 1 : 2;
      var oldPositionChunkIndex = this._getChunkIndexByLineNumber(editorIndex, oldBufferPosition.row);
      var newPositionChunkIndex = this._getChunkIndexByLineNumber(editorIndex, newBufferPosition.row);

      if (oldPositionChunkIndex >= 0) {
        var diffChunk = this._chunks[oldPositionChunkIndex];
        diffChunk.isSelected = false;
        this._editorDiffExtender1.deselectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
        this._editorDiffExtender2.deselectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
      }
      if (newPositionChunkIndex >= 0) {
        this._selectChunk(newPositionChunkIndex, false);
      }
    }

    // ----------------------------------------------------------------------- //
    // --------------------------- PRIVATE METHODS --------------------------- //
    // ----------------------------------------------------------------------- //

    /**
     * Selects and highlights the diff chunk in both editors according to the
     * given index.
     *
     * @param index The index of the diff chunk to highlight in both editors.
     * @param isNextOrPrev Whether we are moving to a direct sibling (if not, this is a click)
     * @param isSyncScrollEnabled Only autoscroll one editor if sync scroll is enabled or we will get in an infinite loop
     */
  }, {
    key: '_selectChunk',
    value: function _selectChunk(index, isNextOrPrev, isSyncScrollEnabled) {
      var diffChunk = this._chunks[index];
      if (diffChunk != null) {
        diffChunk.isSelected = true;

        if (isNextOrPrev) {
          // deselect previous next/prev highlights
          this._editorDiffExtender1.deselectAllLines();
          this._editorDiffExtender2.deselectAllLines();
          // scroll the editors
          this._editorDiffExtender1.getEditor().setCursorBufferPosition([diffChunk.oldLineStart, 0], { autoscroll: true });
          this._editorDiffExtender2.getEditor().setCursorBufferPosition([diffChunk.newLineStart, 0], { autoscroll: !isSyncScrollEnabled });
        }

        // highlight selection in both editors
        this._editorDiffExtender1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
        this._editorDiffExtender2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);

        return true;
      }

      return false;
    }

    /**
     * Gets the index of a chunk by the line number.
     * @param editorIndex The index of the editor to check.
     * @param lineNumber  The line number to use to check if it is in a chunk.
     * @return The index of the chunk.
     */
  }, {
    key: '_getChunkIndexByLineNumber',
    value: function _getChunkIndexByLineNumber(editorIndex, lineNumber) {
      for (var i = 0; i < this._chunks.length; i++) {
        var diffChunk = this._chunks[i];
        if (editorIndex === 1) {
          if (diffChunk.oldLineStart <= lineNumber && diffChunk.oldLineEnd > lineNumber) {
            return i;
          }
        } else if (editorIndex === 2) {
          if (diffChunk.newLineStart <= lineNumber && diffChunk.newLineEnd > lineNumber) {
            return i;
          }
        }
      }

      return -1;
    }

    /**
     * Highlights the word diff of the chunk passed in.
     *
     * @param chunk The chunk that should have its words highlighted.
     */
  }, {
    key: '_highlightWordsInChunk',
    value: function _highlightWordsInChunk(chunk, leftHighlightType, rightHighlightType, isWhitespaceIgnored) {
      var leftLineNumber = chunk.oldLineStart;
      var rightLineNumber = chunk.newLineStart;
      // for each line that has a corresponding line
      while (leftLineNumber < chunk.oldLineEnd && rightLineNumber < chunk.newLineEnd) {
        var editor1LineText = this._editorDiffExtender1.getEditor().lineTextForBufferRow(leftLineNumber);
        var editor2LineText = this._editorDiffExtender2.getEditor().lineTextForBufferRow(rightLineNumber);

        if (editor1LineText == '') {
          // computeWordDiff returns empty for lines that are paired with empty lines
          // need to force a highlight
          this._editorDiffExtender2.setWordHighlights(rightLineNumber, [{ changed: true, value: editor2LineText }], rightHighlightType, isWhitespaceIgnored);
        } else if (editor2LineText == '') {
          // computeWordDiff returns empty for lines that are paired with empty lines
          // need to force a highlight
          this._editorDiffExtender1.setWordHighlights(leftLineNumber, [{ changed: true, value: editor1LineText }], leftHighlightType, isWhitespaceIgnored);
        } else {
          // perform regular word diff
          var wordDiff = _computeWordDiff2['default'].computeWordDiff(editor1LineText, editor2LineText);
          this._editorDiffExtender1.setWordHighlights(leftLineNumber, wordDiff.removedWords, leftHighlightType, isWhitespaceIgnored);
          this._editorDiffExtender2.setWordHighlights(rightLineNumber, wordDiff.addedWords, rightHighlightType, isWhitespaceIgnored);
        }

        leftLineNumber++;
        rightLineNumber++;
      }

      // highlight remaining lines in left editor
      while (leftLineNumber < chunk.oldLineEnd) {
        var editor1LineText = this._editorDiffExtender1.getEditor().lineTextForBufferRow(leftLineNumber);
        this._editorDiffExtender1.setWordHighlights(leftLineNumber, [{ changed: true, value: editor1LineText }], leftHighlightType, isWhitespaceIgnored);
        leftLineNumber++;
      }
      // highlight remaining lines in the right editor
      while (rightLineNumber < chunk.newLineEnd) {
        this._editorDiffExtender2.setWordHighlights(rightLineNumber, [{ changed: true, value: this._editorDiffExtender2.getEditor().lineTextForBufferRow(rightLineNumber) }], rightHighlightType, isWhitespaceIgnored);
        rightLineNumber++;
      }
    }
  }]);

  return DiffView;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvZGlmZi12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQ0FFK0Isd0JBQXdCOzs7OytCQUMzQixxQkFBcUI7Ozs7QUFIakQsV0FBVyxDQUFBOztBQU1YLE1BQU0sQ0FBQyxPQUFPOzs7OztBQUlELFdBSlUsUUFBUSxDQUlqQixPQUFPLEVBQUU7MEJBSkEsUUFBUTs7QUFLM0IsUUFBSSxDQUFDLG9CQUFvQixHQUFHLG9DQUF1QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEUsUUFBSSxDQUFDLG9CQUFvQixHQUFHLG9DQUF1QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEUsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztBQUNoQyxRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRywwQkFBMEIsQ0FBQztBQUNyRCxRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztHQUN6Qjs7Ozs7Ozs7Ozs7O2VBWm9CLFFBQVE7O1dBdUJsQixxQkFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRTtBQUN4RixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDOztBQUVqQyxVQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQUNoQyxVQUFJLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUNuQyxVQUFHLGNBQWMsSUFBSSxPQUFPLEVBQUU7QUFDNUIseUJBQWlCLEdBQUcsU0FBUyxDQUFDO0FBQzlCLDBCQUFrQixHQUFHLE9BQU8sQ0FBQztPQUM5QjtBQUNELFVBQUcsY0FBYyxFQUFFO0FBQ2pCLHlCQUFpQixJQUFJLFNBQVMsQ0FB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LEVBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDL0ksc0JBQWMsRUFBRSxDQUFDO09BQ2xCOztBQUVELGFBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDeEMsWUFBSSxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxFQUFDLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzdNLHVCQUFlLEVBQUUsQ0FBQztPQUNuQjtLQUNGOzs7U0F6WG9CLFFBQVE7SUEwWDlCLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9kaWZmLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgRWRpdG9yRGlmZkV4dGVuZGVyIGZyb20gJy4vZWRpdG9yLWRpZmYtZXh0ZW5kZXInO1xuaW1wb3J0IENvbXB1dGVXb3JkRGlmZiBmcm9tICcuL2NvbXB1dGUtd29yZC1kaWZmJztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERpZmZWaWV3IHtcbiAgLypcbiAgICogQHBhcmFtIGVkaXRvcnMgQXJyYXkgb2YgZWRpdG9ycyBiZWluZyBkaWZmZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlZGl0b3JzKSB7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMSA9IG5ldyBFZGl0b3JEaWZmRXh0ZW5kZXIoZWRpdG9ycy5lZGl0b3IxKTtcbiAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyID0gbmV3IEVkaXRvckRpZmZFeHRlbmRlcihlZGl0b3JzLmVkaXRvcjIpO1xuICAgIHRoaXMuX2NodW5rcyA9IFtdO1xuICAgIHRoaXMuX2lzU2VsZWN0aW9uQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4ID0gMDtcbiAgICB0aGlzLl9DT1BZX0hFTFBfTUVTU0FHRSA9ICdObyBkaWZmZXJlbmNlcyBzZWxlY3RlZC4nO1xuICAgIHRoaXMuX21hcmtlckxheWVycyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgaGlnaGxpZ2h0aW5nIHRvIHRoZSBlZGl0b3JzIHRvIHNob3cgdGhlIGRpZmYuXG4gICAqXG4gICAqIEBwYXJhbSBkaWZmIFRoZSBkaWZmIHRvIGhpZ2hsaWdodC5cbiAgICogQHBhcmFtIGFkZGVkQ29sb3JTaWRlIFRoZSBzaWRlIHRoYXQgdGhlIGFkZGVkIGhpZ2hsaWdodHMgc2hvdWxkIGJlIGFwcGxpZWQgdG8uIEVpdGhlciAnbGVmdCcgb3IgJ3JpZ2h0Jy5cbiAgICogQHBhcmFtIGlzV29yZERpZmZFbmFibGVkIFdoZXRoZXIgZGlmZmVyZW5jZXMgYmV0d2VlbiB3b3JkcyBwZXIgbGluZSBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQuXG4gICAqIEBwYXJhbSBpc1doaXRlc3BhY2VJZ25vcmVkIFdoZXRoZXIgd2hpdGVzcGFjZSBzaG91bGQgYmUgaWdub3JlZC5cbiAgICogQHBhcmFtIHVzZUN1c3RvbVN0eWxlIFdoZXRoZXIgdG8gdXNlIHRoZSB1c2VyJ3MgY3VzdG9taXplZCBoaWdobGlnaHQgY29sb3JzLlxuICAgKi9cbiAgZGlzcGxheURpZmYoZGlmZiwgYWRkZWRDb2xvclNpZGUsIGlzV29yZERpZmZFbmFibGVkLCBpc1doaXRlc3BhY2VJZ25vcmVkLCB1c2VDdXN0b21TdHlsZSkge1xuICAgIHRoaXMuX2NodW5rcyA9IGRpZmYuY2h1bmtzIHx8IFtdO1xuXG4gICAgdmFyIGxlZnRIaWdobGlnaHRUeXBlID0gJ2FkZGVkJztcbiAgICB2YXIgcmlnaHRIaWdobGlnaHRUeXBlID0gJ3JlbW92ZWQnO1xuICAgIGlmKGFkZGVkQ29sb3JTaWRlID09ICdyaWdodCcpIHtcbiAgICAgIGxlZnRIaWdobGlnaHRUeXBlID0gJ3JlbW92ZWQnO1xuICAgICAgcmlnaHRIaWdobGlnaHRUeXBlID0gJ2FkZGVkJztcbiAgICB9XG4gICAgaWYodXNlQ3VzdG9tU3R5bGUpIHtcbiAgICAgIGxlZnRIaWdobGlnaHRUeXBlICs9ICctY3VzdG9tJztcbiAgICAgIHJpZ2h0SGlnaGxpZ2h0VHlwZSArPSAnLWN1c3RvbSc7XG4gICAgfVxuXG4gICAgLy8gbWFrZSB0aGUgbGFzdCBjaHVuayBlcXVhbCBzaXplIG9uIGJvdGggc2NyZWVucyBzbyB0aGUgZWRpdG9ycyByZXRhaW4gc3luYyBzY3JvbGwgIzU4XG4gICAgaWYodGhpcy5nZXROdW1EaWZmZXJlbmNlcygpID4gMCkge1xuICAgICAgdmFyIGxhc3RDaHVuayA9IHRoaXMuX2NodW5rc1t0aGlzLl9jaHVua3MubGVuZ3RoIC0gMV07XG4gICAgICB2YXIgb2xkQ2h1bmtSYW5nZSA9IGxhc3RDaHVuay5vbGRMaW5lRW5kIC0gbGFzdENodW5rLm9sZExpbmVTdGFydDtcbiAgICAgIHZhciBuZXdDaHVua1JhbmdlID0gbGFzdENodW5rLm5ld0xpbmVFbmQgLSBsYXN0Q2h1bmsubmV3TGluZVN0YXJ0O1xuICAgICAgaWYob2xkQ2h1bmtSYW5nZSA+IG5ld0NodW5rUmFuZ2UpIHtcbiAgICAgICAgLy8gbWFrZSB0aGUgb2Zmc2V0IGFzIGxhcmdlIGFzIG5lZWRlZCB0byBtYWtlIHRoZSBjaHVuayB0aGUgc2FtZSBzaXplIGluIGJvdGggZWRpdG9yc1xuICAgICAgICBkaWZmLm5ld0xpbmVPZmZzZXRzW2xhc3RDaHVuay5uZXdMaW5lU3RhcnQgKyBuZXdDaHVua1JhbmdlXSA9IG9sZENodW5rUmFuZ2UgLSBuZXdDaHVua1JhbmdlO1xuICAgICAgfSBlbHNlIGlmKG5ld0NodW5rUmFuZ2UgPiBvbGRDaHVua1JhbmdlKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIG9mZnNldCBhcyBsYXJnZSBhcyBuZWVkZWQgdG8gbWFrZSB0aGUgY2h1bmsgdGhlIHNhbWUgc2l6ZSBpbiBib3RoIGVkaXRvcnNcbiAgICAgICAgZGlmZi5vbGRMaW5lT2Zmc2V0c1tsYXN0Q2h1bmsub2xkTGluZVN0YXJ0ICsgb2xkQ2h1bmtSYW5nZV0gPSBuZXdDaHVua1JhbmdlIC0gb2xkQ2h1bmtSYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IodmFyIGNodW5rIG9mIHRoaXMuX2NodW5rcykge1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5oaWdobGlnaHRMaW5lcyhjaHVuay5vbGRMaW5lU3RhcnQsIGNodW5rLm9sZExpbmVFbmQsIGxlZnRIaWdobGlnaHRUeXBlKTtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuaGlnaGxpZ2h0TGluZXMoY2h1bmsubmV3TGluZVN0YXJ0LCBjaHVuay5uZXdMaW5lRW5kLCByaWdodEhpZ2hsaWdodFR5cGUpO1xuXG4gICAgICBpZihpc1dvcmREaWZmRW5hYmxlZCkge1xuICAgICAgICB0aGlzLl9oaWdobGlnaHRXb3Jkc0luQ2h1bmsoY2h1bmssIGxlZnRIaWdobGlnaHRUeXBlLCByaWdodEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuc2V0TGluZU9mZnNldHMoZGlmZi5vbGRMaW5lT2Zmc2V0cyk7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5zZXRMaW5lT2Zmc2V0cyhkaWZmLm5ld0xpbmVPZmZzZXRzKTtcblxuICAgIHRoaXMuX21hcmtlckxheWVycyA9IHtcbiAgICAgIGVkaXRvcjE6IHtcbiAgICAgICAgaWQ6IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuaWQsXG4gICAgICAgIGxpbmVNYXJrZXJMYXllcjogdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRMaW5lTWFya2VyTGF5ZXIoKSxcbiAgICAgICAgaGlnaGxpZ2h0VHlwZTogbGVmdEhpZ2hsaWdodFR5cGUsXG4gICAgICAgIHNlbGVjdGlvbk1hcmtlckxheWVyOiB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldFNlbGVjdGlvbk1hcmtlckxheWVyKClcbiAgICAgIH0sXG4gICAgICBlZGl0b3IyOiB7XG4gICAgICAgIGlkOiB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLmlkLFxuICAgICAgICBsaW5lTWFya2VyTGF5ZXI6IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0TGluZU1hcmtlckxheWVyKCksXG4gICAgICAgIGhpZ2hsaWdodFR5cGU6IHJpZ2h0SGlnaGxpZ2h0VHlwZSxcbiAgICAgICAgc2VsZWN0aW9uTWFya2VyTGF5ZXI6IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0U2VsZWN0aW9uTWFya2VyTGF5ZXIoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGRpZmYgaGlnaGxpZ2h0aW5nIGFuZCBvZmZzZXRzIGZyb20gdGhlIGVkaXRvcnMuXG4gICAqL1xuICBjbGVhckRpZmYoKSB7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5kZXN0cm95TWFya2VycygpO1xuICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZGVzdHJveU1hcmtlcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdG8gbW92ZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaGlnaGxpZ2h0IHRvIHRoZSBuZXh0IGRpZmYgY2h1bmsuXG4gICAqIEBwYXJhbSBpc1N5bmNTY3JvbGxFbmFibGVkIE9ubHkgYXV0b3Njcm9sbCBvbmUgZWRpdG9yIGlmIHN5bmMgc2Nyb2xsIGlzIGVuYWJsZWQgb3Igd2Ugd2lsbCBnZXQgaW4gYW4gaW5maW5pdGUgbG9vcFxuICAgKi9cbiAgbmV4dERpZmYoaXNTeW5jU2Nyb2xsRW5hYmxlZCkge1xuICAgIGlmKHRoaXMuX2lzU2VsZWN0aW9uQWN0aXZlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXgrKztcbiAgICAgIGlmKHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCA+PSB0aGlzLmdldE51bURpZmZlcmVuY2VzKCkpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4ID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNTZWxlY3Rpb25BY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdGhpcy5fc2VsZWN0Q2h1bmsodGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4LCB0cnVlLCBpc1N5bmNTY3JvbGxFbmFibGVkKTtcbiAgICBpZighc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdG8gbW92ZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaGlnaGxpZ2h0IHRvIHRoZSBwcmV2aW91cyBkaWZmIGNodW5rLlxuICAgKiBAcGFyYW0gaXNTeW5jU2Nyb2xsRW5hYmxlZCBPbmx5IGF1dG9zY3JvbGwgb25lIGVkaXRvciBpZiBzeW5jIHNjcm9sbCBpcyBlbmFibGVkIG9yIHdlIHdpbGwgZ2V0IGluIGFuIGluZmluaXRlIGxvb3BcbiAgICovXG4gIHByZXZEaWZmKGlzU3luY1Njcm9sbEVuYWJsZWQpIHtcbiAgICBpZih0aGlzLl9pc1NlbGVjdGlvbkFjdGl2ZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4LS07XG4gICAgICBpZih0aGlzLl9zZWxlY3RlZENodW5rSW5kZXggPCAwKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCA9IHRoaXMuZ2V0TnVtRGlmZmVyZW5jZXMoKSAtIDFcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNTZWxlY3Rpb25BY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdGhpcy5fc2VsZWN0Q2h1bmsodGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4LCB0cnVlLCBpc1N5bmNTY3JvbGxFbmFibGVkKTtcbiAgICBpZighc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkaWZmIGNodW5rIGZyb20gdGhlIGxlZnQgZWRpdG9yIHRvIHRoZSByaWdodFxuICAgKiBlZGl0b3IuXG4gICAqL1xuICBjb3B5VG9SaWdodCgpIHtcbiAgICB2YXIgZm91bmRTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICB2YXIgb2Zmc2V0ID0gMDsgLy8ga2VlcCB0cmFjayBvZiBsaW5lIG9mZnNldCAodXNlZCB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBjaHVua3MgYmVpbmcgbW92ZWQpXG5cbiAgICBmb3IodmFyIGRpZmZDaHVuayBvZiB0aGlzLl9jaHVua3MpIHtcbiAgICAgIGlmKGRpZmZDaHVuay5pc1NlbGVjdGVkKSB7XG4gICAgICAgIGZvdW5kU2VsZWN0aW9uID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdGV4dFRvQ29weSA9IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tkaWZmQ2h1bmsub2xkTGluZVN0YXJ0LCAwXSwgW2RpZmZDaHVuay5vbGRMaW5lRW5kLCAwXV0pO1xuICAgICAgICB2YXIgbGFzdEJ1ZmZlclJvdyA9IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0RWRpdG9yKCkuZ2V0TGFzdEJ1ZmZlclJvdygpO1xuXG4gICAgICAgIC8vIGluc2VydCBuZXcgbGluZSBpZiB0aGUgY2h1bmsgd2Ugd2FudCB0byBjb3B5IHdpbGwgYmUgYmVsb3cgdGhlIGxhc3QgbGluZSBvZiB0aGUgb3RoZXIgZWRpdG9yXG4gICAgICAgIGlmKChkaWZmQ2h1bmsubmV3TGluZVN0YXJ0ICsgb2Zmc2V0KSA+IGxhc3RCdWZmZXJSb3cpIHtcbiAgICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsYXN0QnVmZmVyUm93LCAwXSwge2F1dG9zY3JvbGw6IGZhbHNlfSk7XG4gICAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5pbnNlcnROZXdsaW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbZGlmZkNodW5rLm5ld0xpbmVTdGFydCArIG9mZnNldCwgMF0sIFtkaWZmQ2h1bmsubmV3TGluZUVuZCArIG9mZnNldCwgMF1dLCB0ZXh0VG9Db3B5KTtcbiAgICAgICAgLy8gb2Zmc2V0IHdpbGwgYmUgdGhlIGFtb3VudCBvZiBsaW5lcyB0byBiZSBjb3BpZWQgbWludXMgdGhlIGFtb3VudCBvZiBsaW5lcyBvdmVyd3JpdHRlblxuICAgICAgICBvZmZzZXQgKz0gKGRpZmZDaHVuay5vbGRMaW5lRW5kIC0gZGlmZkNodW5rLm9sZExpbmVTdGFydCkgLSAoZGlmZkNodW5rLm5ld0xpbmVFbmQgLSBkaWZmQ2h1bmsubmV3TGluZVN0YXJ0KTtcbiAgICAgICAgLy8gbW92ZSB0aGUgc2VsZWN0aW9uIHBvaW50ZXIgYmFjayBzbyB0aGUgbmV4dCBkaWZmIGNodW5rIGlzIG5vdCBza2lwcGVkXG4gICAgICAgIGlmKHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuaGFzU2VsZWN0aW9uKCkgfHwgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5oYXNTZWxlY3Rpb24oKSkge1xuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoIWZvdW5kU2VsZWN0aW9uKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU3BsaXQgRGlmZicsIHtkZXRhaWw6IHRoaXMuX0NPUFlfSEVMUF9NRVNTQUdFLCBkaXNtaXNzYWJsZTogZmFsc2UsIGljb246ICdkaWZmJ30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkaWZmIGNodW5rIGZyb20gdGhlIHJpZ2h0IGVkaXRvciB0byB0aGUgbGVmdFxuICAgKiBlZGl0b3IuXG4gICAqL1xuICBjb3B5VG9MZWZ0KCkge1xuICAgIHZhciBmb3VuZFNlbGVjdGlvbiA9IGZhbHNlO1xuICAgIHZhciBvZmZzZXQgPSAwOyAvLyBrZWVwIHRyYWNrIG9mIGxpbmUgb2Zmc2V0ICh1c2VkIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGNodW5rcyBiZWluZyBtb3ZlZClcblxuICAgIGZvcih2YXIgZGlmZkNodW5rIG9mIHRoaXMuX2NodW5rcykge1xuICAgICAgaWYoZGlmZkNodW5rLmlzU2VsZWN0ZWQpIHtcbiAgICAgICAgZm91bmRTZWxlY3Rpb24gPSB0cnVlO1xuXG4gICAgICAgIHZhciB0ZXh0VG9Db3B5ID0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShbW2RpZmZDaHVuay5uZXdMaW5lU3RhcnQsIDBdLCBbZGlmZkNodW5rLm5ld0xpbmVFbmQsIDBdXSk7XG4gICAgICAgIHZhciBsYXN0QnVmZmVyUm93ID0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5nZXRMYXN0QnVmZmVyUm93KCk7XG4gICAgICAgIC8vIGluc2VydCBuZXcgbGluZSBpZiB0aGUgY2h1bmsgd2Ugd2FudCB0byBjb3B5IHdpbGwgYmUgYmVsb3cgdGhlIGxhc3QgbGluZSBvZiB0aGUgb3RoZXIgZWRpdG9yXG4gICAgICAgIGlmKChkaWZmQ2h1bmsub2xkTGluZVN0YXJ0ICsgb2Zmc2V0KSA+IGxhc3RCdWZmZXJSb3cpIHtcbiAgICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsYXN0QnVmZmVyUm93LCAwXSwge2F1dG9zY3JvbGw6IGZhbHNlfSk7XG4gICAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5pbnNlcnROZXdsaW5lKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbZGlmZkNodW5rLm9sZExpbmVTdGFydCArIG9mZnNldCwgMF0sIFtkaWZmQ2h1bmsub2xkTGluZUVuZCArIG9mZnNldCwgMF1dLCB0ZXh0VG9Db3B5KTtcbiAgICAgICAgLy8gb2Zmc2V0IHdpbGwgYmUgdGhlIGFtb3VudCBvZiBsaW5lcyB0byBiZSBjb3BpZWQgbWludXMgdGhlIGFtb3VudCBvZiBsaW5lcyBvdmVyd3JpdHRlblxuICAgICAgICBvZmZzZXQgKz0gKGRpZmZDaHVuay5uZXdMaW5lRW5kIC0gZGlmZkNodW5rLm5ld0xpbmVTdGFydCkgLSAoZGlmZkNodW5rLm9sZExpbmVFbmQgLSBkaWZmQ2h1bmsub2xkTGluZVN0YXJ0KTtcbiAgICAgICAgLy8gbW92ZSB0aGUgc2VsZWN0aW9uIHBvaW50ZXIgYmFjayBzbyB0aGUgbmV4dCBkaWZmIGNodW5rIGlzIG5vdCBza2lwcGVkXG4gICAgICAgIGlmKHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuaGFzU2VsZWN0aW9uKCkgfHwgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5oYXNTZWxlY3Rpb24oKSkge1xuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoIWZvdW5kU2VsZWN0aW9uKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU3BsaXQgRGlmZicsIHtkZXRhaWw6IHRoaXMuX0NPUFlfSEVMUF9NRVNTQUdFLCBkaXNtaXNzYWJsZTogZmFsc2UsIGljb246ICdkaWZmJ30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgdGhlIGVkaXRvciBpbmRpY2F0ZWQgYnkgaW5kZXguIEEgY2xlYW4gdXAgd2lsbCByZW1vdmUgdGhlIGVkaXRvclxuICAgKiBvciB0aGUgcGFuZSBpZiBuZWNlc3NhcnkuIFR5cGljYWxseSBsZWZ0IGVkaXRvciA9PSAxIGFuZCByaWdodCBlZGl0b3IgPT0gMi5cbiAgICpcbiAgICogQHBhcmFtIGVkaXRvckluZGV4IFRoZSBpbmRleCBvZiB0aGUgZWRpdG9yIHRvIGNsZWFuIHVwLlxuICAgKi9cbiAgY2xlYW5VcEVkaXRvcihlZGl0b3JJbmRleCkge1xuICAgIGlmKGVkaXRvckluZGV4ID09PSAxKSB7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmNsZWFuVXAoKTtcbiAgICB9IGVsc2UgaWYoZWRpdG9ySW5kZXggPT09IDIpIHtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuY2xlYW5VcCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyBzb2Z0IHdyYXAgdG8gdGhlIGFwcHJvcHJpYXRlIGVkaXRvci5cbiAgICogQHBhcmFtIGVkaXRvckluZGV4IFRoZSBpbmRleCBvZiB0aGUgZWRpdG9yIHRvIHJlc3RvcmUgc29mdCB3cmFwIHRvLlxuICAgKi9cbiAgcmVzdG9yZUVkaXRvclNvZnRXcmFwKGVkaXRvckluZGV4KSB7XG4gICAgaWYoZWRpdG9ySW5kZXggPT09IDEpIHtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuc2V0U29mdFdyYXBwZWQodHJ1ZSk7XG4gICAgfSBlbHNlIGlmKGVkaXRvckluZGV4ID09PSAyKSB7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLnNldFNvZnRXcmFwcGVkKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgZWRpdG9yIGRpZmYgZXh0ZW5kZXJzLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGUgZWRpdG9ycy5cbiAgICpcbiAgICogQHJldHVybiBpbnQgVGhlIG51bWJlciBvZiBkaWZmZXJlbmNlcyBiZXR3ZWVuIHRoZSBlZGl0b3JzLlxuICAgKi9cbiAgZ2V0TnVtRGlmZmVyZW5jZXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5fY2h1bmtzKSA/IHRoaXMuX2NodW5rcy5sZW5ndGggOiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1hcmtlciBsYXllcnMgaW4gdXNlIGJ5IHRoZSBlZGl0b3JzLlxuICAgKiBAcmV0dXJuIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXJrZXIgbGF5ZXJzIGFuZCBhcHByb3JpYXRlIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgZ2V0TWFya2VyTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrZXJMYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB3aGVuIHRoZSBjdXJzb3IgbW92ZXMgaW4gdGhlIGVkaXRvci4gV2lsbCBoaWdobGlnaHQgY2h1bmtzIHRoYXQgaGF2ZSBhIGN1cnNvciBpbiB0aGVtLlxuICAgKiBAcGFyYW0gY3Vyc29yIFRoZSBjdXJzb3Igb2JqZWN0IGZyb20gdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0gb2xkQnVmZmVyUG9zaXRpb24gVGhlIG9sZCBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGluIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSBuZXdCdWZmZXJQb3NpdGlvbiBUaGUgbmV3IHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGhhbmRsZUN1cnNvckNoYW5nZShjdXJzb3IsIG9sZEJ1ZmZlclBvc2l0aW9uLCBuZXdCdWZmZXJQb3NpdGlvbikge1xuICAgIHZhciBlZGl0b3JJbmRleCA9IChjdXJzb3IuZWRpdG9yID09PSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpKSA/IDEgOiAyO1xuICAgIHZhciBvbGRQb3NpdGlvbkNodW5rSW5kZXggPSB0aGlzLl9nZXRDaHVua0luZGV4QnlMaW5lTnVtYmVyKGVkaXRvckluZGV4LCBvbGRCdWZmZXJQb3NpdGlvbi5yb3cpO1xuICAgIHZhciBuZXdQb3NpdGlvbkNodW5rSW5kZXggPSB0aGlzLl9nZXRDaHVua0luZGV4QnlMaW5lTnVtYmVyKGVkaXRvckluZGV4LCBuZXdCdWZmZXJQb3NpdGlvbi5yb3cpO1xuXG4gICAgaWYob2xkUG9zaXRpb25DaHVua0luZGV4ID49IDApIHtcbiAgICAgIHZhciBkaWZmQ2h1bmsgPSB0aGlzLl9jaHVua3Nbb2xkUG9zaXRpb25DaHVua0luZGV4XTtcbiAgICAgIGRpZmZDaHVuay5pc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmRlc2VsZWN0TGluZXMoZGlmZkNodW5rLm9sZExpbmVTdGFydCwgZGlmZkNodW5rLm9sZExpbmVFbmQpO1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5kZXNlbGVjdExpbmVzKGRpZmZDaHVuay5uZXdMaW5lU3RhcnQsIGRpZmZDaHVuay5uZXdMaW5lRW5kKTtcbiAgICB9XG4gICAgaWYobmV3UG9zaXRpb25DaHVua0luZGV4ID49IDApIHtcbiAgICAgIHRoaXMuX3NlbGVjdENodW5rKG5ld1Bvc2l0aW9uQ2h1bmtJbmRleCwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUklWQVRFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYW5kIGhpZ2hsaWdodHMgdGhlIGRpZmYgY2h1bmsgaW4gYm90aCBlZGl0b3JzIGFjY29yZGluZyB0byB0aGVcbiAgICogZ2l2ZW4gaW5kZXguXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGRpZmYgY2h1bmsgdG8gaGlnaGxpZ2h0IGluIGJvdGggZWRpdG9ycy5cbiAgICogQHBhcmFtIGlzTmV4dE9yUHJldiBXaGV0aGVyIHdlIGFyZSBtb3ZpbmcgdG8gYSBkaXJlY3Qgc2libGluZyAoaWYgbm90LCB0aGlzIGlzIGEgY2xpY2spXG4gICAqIEBwYXJhbSBpc1N5bmNTY3JvbGxFbmFibGVkIE9ubHkgYXV0b3Njcm9sbCBvbmUgZWRpdG9yIGlmIHN5bmMgc2Nyb2xsIGlzIGVuYWJsZWQgb3Igd2Ugd2lsbCBnZXQgaW4gYW4gaW5maW5pdGUgbG9vcFxuICAgKi9cbiAgX3NlbGVjdENodW5rKGluZGV4LCBpc05leHRPclByZXYsIGlzU3luY1Njcm9sbEVuYWJsZWQpIHtcbiAgICB2YXIgZGlmZkNodW5rID0gdGhpcy5fY2h1bmtzW2luZGV4XTtcbiAgICBpZihkaWZmQ2h1bmsgIT0gbnVsbCkge1xuICAgICAgZGlmZkNodW5rLmlzU2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICBpZihpc05leHRPclByZXYpIHtcbiAgICAgICAgLy8gZGVzZWxlY3QgcHJldmlvdXMgbmV4dC9wcmV2IGhpZ2hsaWdodHNcbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5kZXNlbGVjdEFsbExpbmVzKCk7XG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZGVzZWxlY3RBbGxMaW5lcygpO1xuICAgICAgICAvLyBzY3JvbGwgdGhlIGVkaXRvcnNcbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbZGlmZkNodW5rLm9sZExpbmVTdGFydCwgMF0sIHthdXRvc2Nyb2xsOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2RpZmZDaHVuay5uZXdMaW5lU3RhcnQsIDBdLCB7YXV0b3Njcm9sbDogIWlzU3luY1Njcm9sbEVuYWJsZWR9KTtcbiAgICAgIH1cblxuICAgICAgLy8gaGlnaGxpZ2h0IHNlbGVjdGlvbiBpbiBib3RoIGVkaXRvcnNcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuc2VsZWN0TGluZXMoZGlmZkNodW5rLm9sZExpbmVTdGFydCwgZGlmZkNodW5rLm9sZExpbmVFbmQpO1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5zZWxlY3RMaW5lcyhkaWZmQ2h1bmsubmV3TGluZVN0YXJ0LCBkaWZmQ2h1bmsubmV3TGluZUVuZCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbmRleCBvZiBhIGNodW5rIGJ5IHRoZSBsaW5lIG51bWJlci5cbiAgICogQHBhcmFtIGVkaXRvckluZGV4IFRoZSBpbmRleCBvZiB0aGUgZWRpdG9yIHRvIGNoZWNrLlxuICAgKiBAcGFyYW0gbGluZU51bWJlciAgVGhlIGxpbmUgbnVtYmVyIHRvIHVzZSB0byBjaGVjayBpZiBpdCBpcyBpbiBhIGNodW5rLlxuICAgKiBAcmV0dXJuIFRoZSBpbmRleCBvZiB0aGUgY2h1bmsuXG4gICAqL1xuICBfZ2V0Q2h1bmtJbmRleEJ5TGluZU51bWJlcihlZGl0b3JJbmRleCwgbGluZU51bWJlcikge1xuICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuX2NodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRpZmZDaHVuayA9IHRoaXMuX2NodW5rc1tpXTtcbiAgICAgIGlmKGVkaXRvckluZGV4ID09PSAxKSB7XG4gICAgICAgIGlmKGRpZmZDaHVuay5vbGRMaW5lU3RhcnQgPD0gbGluZU51bWJlciAmJiBkaWZmQ2h1bmsub2xkTGluZUVuZCA+IGxpbmVOdW1iZXIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKGVkaXRvckluZGV4ID09PSAyKSB7XG4gICAgICAgIGlmKGRpZmZDaHVuay5uZXdMaW5lU3RhcnQgPD0gbGluZU51bWJlciAmJiBkaWZmQ2h1bmsubmV3TGluZUVuZCA+IGxpbmVOdW1iZXIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHRoZSB3b3JkIGRpZmYgb2YgdGhlIGNodW5rIHBhc3NlZCBpbi5cbiAgICpcbiAgICogQHBhcmFtIGNodW5rIFRoZSBjaHVuayB0aGF0IHNob3VsZCBoYXZlIGl0cyB3b3JkcyBoaWdobGlnaHRlZC5cbiAgICovXG4gIF9oaWdobGlnaHRXb3Jkc0luQ2h1bmsoY2h1bmssIGxlZnRIaWdobGlnaHRUeXBlLCByaWdodEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpIHtcbiAgICB2YXIgbGVmdExpbmVOdW1iZXIgPSBjaHVuay5vbGRMaW5lU3RhcnQ7XG4gICAgdmFyIHJpZ2h0TGluZU51bWJlciA9IGNodW5rLm5ld0xpbmVTdGFydDtcbiAgICAvLyBmb3IgZWFjaCBsaW5lIHRoYXQgaGFzIGEgY29ycmVzcG9uZGluZyBsaW5lXG4gICAgd2hpbGUobGVmdExpbmVOdW1iZXIgPCBjaHVuay5vbGRMaW5lRW5kICYmIHJpZ2h0TGluZU51bWJlciA8IGNodW5rLm5ld0xpbmVFbmQpIHtcbiAgICAgIHZhciBlZGl0b3IxTGluZVRleHQgPSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGxlZnRMaW5lTnVtYmVyKTtcbiAgICAgIHZhciBlZGl0b3IyTGluZVRleHQgPSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJpZ2h0TGluZU51bWJlcik7XG5cbiAgICAgIGlmKGVkaXRvcjFMaW5lVGV4dCA9PSAnJykge1xuICAgICAgICAvLyBjb21wdXRlV29yZERpZmYgcmV0dXJucyBlbXB0eSBmb3IgbGluZXMgdGhhdCBhcmUgcGFpcmVkIHdpdGggZW1wdHkgbGluZXNcbiAgICAgICAgLy8gbmVlZCB0byBmb3JjZSBhIGhpZ2hsaWdodFxuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLnNldFdvcmRIaWdobGlnaHRzKHJpZ2h0TGluZU51bWJlciwgW3tjaGFuZ2VkOiB0cnVlLCB2YWx1ZTogZWRpdG9yMkxpbmVUZXh0fV0sIHJpZ2h0SGlnaGxpZ2h0VHlwZSwgaXNXaGl0ZXNwYWNlSWdub3JlZCk7XG4gICAgICB9IGVsc2UgaWYoIGVkaXRvcjJMaW5lVGV4dCA9PSAnJyApIHtcbiAgICAgICAgLy8gY29tcHV0ZVdvcmREaWZmIHJldHVybnMgZW1wdHkgZm9yIGxpbmVzIHRoYXQgYXJlIHBhaXJlZCB3aXRoIGVtcHR5IGxpbmVzXG4gICAgICAgIC8vIG5lZWQgdG8gZm9yY2UgYSBoaWdobGlnaHRcbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5zZXRXb3JkSGlnaGxpZ2h0cyhsZWZ0TGluZU51bWJlciwgW3tjaGFuZ2VkOiB0cnVlLCB2YWx1ZTogZWRpdG9yMUxpbmVUZXh0fV0sIGxlZnRIaWdobGlnaHRUeXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBlcmZvcm0gcmVndWxhciB3b3JkIGRpZmZcbiAgICAgICAgdmFyIHdvcmREaWZmID0gQ29tcHV0ZVdvcmREaWZmLmNvbXB1dGVXb3JkRGlmZihlZGl0b3IxTGluZVRleHQsIGVkaXRvcjJMaW5lVGV4dCk7XG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuc2V0V29yZEhpZ2hsaWdodHMobGVmdExpbmVOdW1iZXIsIHdvcmREaWZmLnJlbW92ZWRXb3JkcywgbGVmdEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpO1xuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLnNldFdvcmRIaWdobGlnaHRzKHJpZ2h0TGluZU51bWJlciwgd29yZERpZmYuYWRkZWRXb3JkcywgcmlnaHRIaWdobGlnaHRUeXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKTtcbiAgICAgIH1cblxuICAgICAgbGVmdExpbmVOdW1iZXIrKztcbiAgICAgIHJpZ2h0TGluZU51bWJlcisrO1xuICAgIH1cblxuICAgIC8vIGhpZ2hsaWdodCByZW1haW5pbmcgbGluZXMgaW4gbGVmdCBlZGl0b3JcbiAgICB3aGlsZShsZWZ0TGluZU51bWJlciA8IGNodW5rLm9sZExpbmVFbmQpIHtcbiAgICAgIHZhciBlZGl0b3IxTGluZVRleHQgPSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGxlZnRMaW5lTnVtYmVyKTtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuc2V0V29yZEhpZ2hsaWdodHMobGVmdExpbmVOdW1iZXIsIFt7Y2hhbmdlZDogdHJ1ZSwgdmFsdWU6IGVkaXRvcjFMaW5lVGV4dH1dLCBsZWZ0SGlnaGxpZ2h0VHlwZSwgaXNXaGl0ZXNwYWNlSWdub3JlZCk7XG4gICAgICBsZWZ0TGluZU51bWJlcisrO1xuICAgIH1cbiAgICAvLyBoaWdobGlnaHQgcmVtYWluaW5nIGxpbmVzIGluIHRoZSByaWdodCBlZGl0b3JcbiAgICB3aGlsZShyaWdodExpbmVOdW1iZXIgPCBjaHVuay5uZXdMaW5lRW5kKSB7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLnNldFdvcmRIaWdobGlnaHRzKHJpZ2h0TGluZU51bWJlciwgW3tjaGFuZ2VkOiB0cnVlLCB2YWx1ZTogdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5saW5lVGV4dEZvckJ1ZmZlclJvdyhyaWdodExpbmVOdW1iZXIpfV0sIHJpZ2h0SGlnaGxpZ2h0VHlwZSwgaXNXaGl0ZXNwYWNlSWdub3JlZCk7XG4gICAgICByaWdodExpbmVOdW1iZXIrKztcbiAgICB9XG4gIH1cbn07XG4iXX0=