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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9kaWZmLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tDQUUrQix3QkFBd0I7Ozs7K0JBQzNCLHFCQUFxQjs7OztBQUhqRCxXQUFXLENBQUE7O0FBTVgsTUFBTSxDQUFDLE9BQU87Ozs7O0FBSUQsV0FKVSxRQUFRLENBSWpCLE9BQU8sRUFBRTswQkFKQSxRQUFROztBQUszQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsb0NBQXVCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRSxRQUFJLENBQUMsb0JBQW9CLEdBQUcsb0NBQXVCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRSxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLGtCQUFrQixHQUFHLDBCQUEwQixDQUFDO0FBQ3JELFFBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0dBQ3pCOzs7Ozs7Ozs7Ozs7ZUFab0IsUUFBUTs7V0F1QmxCLHFCQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFO0FBQ3hGLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7O0FBRWpDLFVBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDO0FBQ2hDLFVBQUksa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBQ25DLFVBQUcsY0FBYyxJQUFJLE9BQU8sRUFBRTtBQUM1Qix5QkFBaUIsR0FBRyxTQUFTLENBQUM7QUFDOUIsMEJBQWtCLEdBQUcsT0FBTyxDQUFDO09BQzlCO0FBQ0QsVUFBRyxjQUFjLEVBQUU7QUFDakIseUJBQWlCLElBQUks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QUFFLGVBQWUsRUFBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUMvSSxzQkFBYyxFQUFFLENBQUM7T0FDbEI7O0FBRUQsYUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUN4QyxZQUFJLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLEVBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDN00sdUJBQWUsRUFBRSxDQUFDO09BQ25CO0tBQ0Y7OztTQXpYb0IsUUFBUTtJQTBYOUIsQ0FBQyIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvZGlmZi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IEVkaXRvckRpZmZFeHRlbmRlciBmcm9tICcuL2VkaXRvci1kaWZmLWV4dGVuZGVyJztcbmltcG9ydCBDb21wdXRlV29yZERpZmYgZnJvbSAnLi9jb21wdXRlLXdvcmQtZGlmZic7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEaWZmVmlldyB7XG4gIC8qXG4gICAqIEBwYXJhbSBlZGl0b3JzIEFycmF5IG9mIGVkaXRvcnMgYmVpbmcgZGlmZmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZWRpdG9ycykge1xuICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEgPSBuZXcgRWRpdG9yRGlmZkV4dGVuZGVyKGVkaXRvcnMuZWRpdG9yMSk7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMiA9IG5ldyBFZGl0b3JEaWZmRXh0ZW5kZXIoZWRpdG9ycy5lZGl0b3IyKTtcbiAgICB0aGlzLl9jaHVua3MgPSBbXTtcbiAgICB0aGlzLl9pc1NlbGVjdGlvbkFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCA9IDA7XG4gICAgdGhpcy5fQ09QWV9IRUxQX01FU1NBR0UgPSAnTm8gZGlmZmVyZW5jZXMgc2VsZWN0ZWQuJztcbiAgICB0aGlzLl9tYXJrZXJMYXllcnMgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGhpZ2hsaWdodGluZyB0byB0aGUgZWRpdG9ycyB0byBzaG93IHRoZSBkaWZmLlxuICAgKlxuICAgKiBAcGFyYW0gZGlmZiBUaGUgZGlmZiB0byBoaWdobGlnaHQuXG4gICAqIEBwYXJhbSBhZGRlZENvbG9yU2lkZSBUaGUgc2lkZSB0aGF0IHRoZSBhZGRlZCBoaWdobGlnaHRzIHNob3VsZCBiZSBhcHBsaWVkIHRvLiBFaXRoZXIgJ2xlZnQnIG9yICdyaWdodCcuXG4gICAqIEBwYXJhbSBpc1dvcmREaWZmRW5hYmxlZCBXaGV0aGVyIGRpZmZlcmVuY2VzIGJldHdlZW4gd29yZHMgcGVyIGxpbmUgc2hvdWxkIGJlIGhpZ2hsaWdodGVkLlxuICAgKiBAcGFyYW0gaXNXaGl0ZXNwYWNlSWdub3JlZCBXaGV0aGVyIHdoaXRlc3BhY2Ugc2hvdWxkIGJlIGlnbm9yZWQuXG4gICAqIEBwYXJhbSB1c2VDdXN0b21TdHlsZSBXaGV0aGVyIHRvIHVzZSB0aGUgdXNlcidzIGN1c3RvbWl6ZWQgaGlnaGxpZ2h0IGNvbG9ycy5cbiAgICovXG4gIGRpc3BsYXlEaWZmKGRpZmYsIGFkZGVkQ29sb3JTaWRlLCBpc1dvcmREaWZmRW5hYmxlZCwgaXNXaGl0ZXNwYWNlSWdub3JlZCwgdXNlQ3VzdG9tU3R5bGUpIHtcbiAgICB0aGlzLl9jaHVua3MgPSBkaWZmLmNodW5rcyB8fCBbXTtcblxuICAgIHZhciBsZWZ0SGlnaGxpZ2h0VHlwZSA9ICdhZGRlZCc7XG4gICAgdmFyIHJpZ2h0SGlnaGxpZ2h0VHlwZSA9ICdyZW1vdmVkJztcbiAgICBpZihhZGRlZENvbG9yU2lkZSA9PSAncmlnaHQnKSB7XG4gICAgICBsZWZ0SGlnaGxpZ2h0VHlwZSA9ICdyZW1vdmVkJztcbiAgICAgIHJpZ2h0SGlnaGxpZ2h0VHlwZSA9ICdhZGRlZCc7XG4gICAgfVxuICAgIGlmKHVzZUN1c3RvbVN0eWxlKSB7XG4gICAgICBsZWZ0SGlnaGxpZ2h0VHlwZSArPSAnLWN1c3RvbSc7XG4gICAgICByaWdodEhpZ2hsaWdodFR5cGUgKz0gJy1jdXN0b20nO1xuICAgIH1cblxuICAgIC8vIG1ha2UgdGhlIGxhc3QgY2h1bmsgZXF1YWwgc2l6ZSBvbiBib3RoIHNjcmVlbnMgc28gdGhlIGVkaXRvcnMgcmV0YWluIHN5bmMgc2Nyb2xsICM1OFxuICAgIGlmKHRoaXMuZ2V0TnVtRGlmZmVyZW5jZXMoKSA+IDApIHtcbiAgICAgIHZhciBsYXN0Q2h1bmsgPSB0aGlzLl9jaHVua3NbdGhpcy5fY2h1bmtzLmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIG9sZENodW5rUmFuZ2UgPSBsYXN0Q2h1bmsub2xkTGluZUVuZCAtIGxhc3RDaHVuay5vbGRMaW5lU3RhcnQ7XG4gICAgICB2YXIgbmV3Q2h1bmtSYW5nZSA9IGxhc3RDaHVuay5uZXdMaW5lRW5kIC0gbGFzdENodW5rLm5ld0xpbmVTdGFydDtcbiAgICAgIGlmKG9sZENodW5rUmFuZ2UgPiBuZXdDaHVua1JhbmdlKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIG9mZnNldCBhcyBsYXJnZSBhcyBuZWVkZWQgdG8gbWFrZSB0aGUgY2h1bmsgdGhlIHNhbWUgc2l6ZSBpbiBib3RoIGVkaXRvcnNcbiAgICAgICAgZGlmZi5uZXdMaW5lT2Zmc2V0c1tsYXN0Q2h1bmsubmV3TGluZVN0YXJ0ICsgbmV3Q2h1bmtSYW5nZV0gPSBvbGRDaHVua1JhbmdlIC0gbmV3Q2h1bmtSYW5nZTtcbiAgICAgIH0gZWxzZSBpZihuZXdDaHVua1JhbmdlID4gb2xkQ2h1bmtSYW5nZSkge1xuICAgICAgICAvLyBtYWtlIHRoZSBvZmZzZXQgYXMgbGFyZ2UgYXMgbmVlZGVkIHRvIG1ha2UgdGhlIGNodW5rIHRoZSBzYW1lIHNpemUgaW4gYm90aCBlZGl0b3JzXG4gICAgICAgIGRpZmYub2xkTGluZU9mZnNldHNbbGFzdENodW5rLm9sZExpbmVTdGFydCArIG9sZENodW5rUmFuZ2VdID0gbmV3Q2h1bmtSYW5nZSAtIG9sZENodW5rUmFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yKHZhciBjaHVuayBvZiB0aGlzLl9jaHVua3MpIHtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuaGlnaGxpZ2h0TGluZXMoY2h1bmsub2xkTGluZVN0YXJ0LCBjaHVuay5vbGRMaW5lRW5kLCBsZWZ0SGlnaGxpZ2h0VHlwZSk7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmhpZ2hsaWdodExpbmVzKGNodW5rLm5ld0xpbmVTdGFydCwgY2h1bmsubmV3TGluZUVuZCwgcmlnaHRIaWdobGlnaHRUeXBlKTtcblxuICAgICAgaWYoaXNXb3JkRGlmZkVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5faGlnaGxpZ2h0V29yZHNJbkNodW5rKGNodW5rLCBsZWZ0SGlnaGxpZ2h0VHlwZSwgcmlnaHRIaWdobGlnaHRUeXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLnNldExpbmVPZmZzZXRzKGRpZmYub2xkTGluZU9mZnNldHMpO1xuICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuc2V0TGluZU9mZnNldHMoZGlmZi5uZXdMaW5lT2Zmc2V0cyk7XG5cbiAgICB0aGlzLl9tYXJrZXJMYXllcnMgPSB7XG4gICAgICBlZGl0b3IxOiB7XG4gICAgICAgIGlkOiB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLmlkLFxuICAgICAgICBsaW5lTWFya2VyTGF5ZXI6IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0TGluZU1hcmtlckxheWVyKCksXG4gICAgICAgIGhpZ2hsaWdodFR5cGU6IGxlZnRIaWdobGlnaHRUeXBlLFxuICAgICAgICBzZWxlY3Rpb25NYXJrZXJMYXllcjogdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRTZWxlY3Rpb25NYXJrZXJMYXllcigpXG4gICAgICB9LFxuICAgICAgZWRpdG9yMjoge1xuICAgICAgICBpZDogdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5pZCxcbiAgICAgICAgbGluZU1hcmtlckxheWVyOiB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldExpbmVNYXJrZXJMYXllcigpLFxuICAgICAgICBoaWdobGlnaHRUeXBlOiByaWdodEhpZ2hsaWdodFR5cGUsXG4gICAgICAgIHNlbGVjdGlvbk1hcmtlckxheWVyOiB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldFNlbGVjdGlvbk1hcmtlckxheWVyKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBkaWZmIGhpZ2hsaWdodGluZyBhbmQgb2Zmc2V0cyBmcm9tIHRoZSBlZGl0b3JzLlxuICAgKi9cbiAgY2xlYXJEaWZmKCkge1xuICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZGVzdHJveU1hcmtlcnMoKTtcbiAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmRlc3Ryb3lNYXJrZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHRvIG1vdmUgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhpZ2hsaWdodCB0byB0aGUgbmV4dCBkaWZmIGNodW5rLlxuICAgKiBAcGFyYW0gaXNTeW5jU2Nyb2xsRW5hYmxlZCBPbmx5IGF1dG9zY3JvbGwgb25lIGVkaXRvciBpZiBzeW5jIHNjcm9sbCBpcyBlbmFibGVkIG9yIHdlIHdpbGwgZ2V0IGluIGFuIGluZmluaXRlIGxvb3BcbiAgICovXG4gIG5leHREaWZmKGlzU3luY1Njcm9sbEVuYWJsZWQpIHtcbiAgICBpZih0aGlzLl9pc1NlbGVjdGlvbkFjdGl2ZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4Kys7XG4gICAgICBpZih0aGlzLl9zZWxlY3RlZENodW5rSW5kZXggPj0gdGhpcy5nZXROdW1EaWZmZXJlbmNlcygpKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2lzU2VsZWN0aW9uQWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgc3VjY2VzcyA9IHRoaXMuX3NlbGVjdENodW5rKHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCwgdHJ1ZSwgaXNTeW5jU2Nyb2xsRW5hYmxlZCk7XG4gICAgaWYoIXN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHRvIG1vdmUgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGhpZ2hsaWdodCB0byB0aGUgcHJldmlvdXMgZGlmZiBjaHVuay5cbiAgICogQHBhcmFtIGlzU3luY1Njcm9sbEVuYWJsZWQgT25seSBhdXRvc2Nyb2xsIG9uZSBlZGl0b3IgaWYgc3luYyBzY3JvbGwgaXMgZW5hYmxlZCBvciB3ZSB3aWxsIGdldCBpbiBhbiBpbmZpbml0ZSBsb29wXG4gICAqL1xuICBwcmV2RGlmZihpc1N5bmNTY3JvbGxFbmFibGVkKSB7XG4gICAgaWYodGhpcy5faXNTZWxlY3Rpb25BY3RpdmUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleC0tO1xuICAgICAgaWYodGhpcy5fc2VsZWN0ZWRDaHVua0luZGV4IDwgMCkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXggPSB0aGlzLmdldE51bURpZmZlcmVuY2VzKCkgLSAxXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2lzU2VsZWN0aW9uQWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgc3VjY2VzcyA9IHRoaXMuX3NlbGVjdENodW5rKHRoaXMuX3NlbGVjdGVkQ2h1bmtJbmRleCwgdHJ1ZSwgaXNTeW5jU2Nyb2xsRW5hYmxlZCk7XG4gICAgaWYoIXN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogQ29waWVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGlmZiBjaHVuayBmcm9tIHRoZSBsZWZ0IGVkaXRvciB0byB0aGUgcmlnaHRcbiAgICogZWRpdG9yLlxuICAgKi9cbiAgY29weVRvUmlnaHQoKSB7XG4gICAgdmFyIGZvdW5kU2VsZWN0aW9uID0gZmFsc2U7XG4gICAgdmFyIG9mZnNldCA9IDA7IC8vIGtlZXAgdHJhY2sgb2YgbGluZSBvZmZzZXQgKHVzZWQgd2hlbiB0aGVyZSBhcmUgbXVsdGlwbGUgY2h1bmtzIGJlaW5nIG1vdmVkKVxuXG4gICAgZm9yKHZhciBkaWZmQ2h1bmsgb2YgdGhpcy5fY2h1bmtzKSB7XG4gICAgICBpZihkaWZmQ2h1bmsuaXNTZWxlY3RlZCkge1xuICAgICAgICBmb3VuZFNlbGVjdGlvbiA9IHRydWU7XG5cbiAgICAgICAgdmFyIHRleHRUb0NvcHkgPSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbZGlmZkNodW5rLm9sZExpbmVTdGFydCwgMF0sIFtkaWZmQ2h1bmsub2xkTGluZUVuZCwgMF1dKTtcbiAgICAgICAgdmFyIGxhc3RCdWZmZXJSb3cgPSB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLmdldExhc3RCdWZmZXJSb3coKTtcblxuICAgICAgICAvLyBpbnNlcnQgbmV3IGxpbmUgaWYgdGhlIGNodW5rIHdlIHdhbnQgdG8gY29weSB3aWxsIGJlIGJlbG93IHRoZSBsYXN0IGxpbmUgb2YgdGhlIG90aGVyIGVkaXRvclxuICAgICAgICBpZigoZGlmZkNodW5rLm5ld0xpbmVTdGFydCArIG9mZnNldCkgPiBsYXN0QnVmZmVyUm93KSB7XG4gICAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGFzdEJ1ZmZlclJvdywgMF0sIHthdXRvc2Nyb2xsOiBmYWxzZX0pO1xuICAgICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0RWRpdG9yKCkuaW5zZXJ0TmV3bGluZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW2RpZmZDaHVuay5uZXdMaW5lU3RhcnQgKyBvZmZzZXQsIDBdLCBbZGlmZkNodW5rLm5ld0xpbmVFbmQgKyBvZmZzZXQsIDBdXSwgdGV4dFRvQ29weSk7XG4gICAgICAgIC8vIG9mZnNldCB3aWxsIGJlIHRoZSBhbW91bnQgb2YgbGluZXMgdG8gYmUgY29waWVkIG1pbnVzIHRoZSBhbW91bnQgb2YgbGluZXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgb2Zmc2V0ICs9IChkaWZmQ2h1bmsub2xkTGluZUVuZCAtIGRpZmZDaHVuay5vbGRMaW5lU3RhcnQpIC0gKGRpZmZDaHVuay5uZXdMaW5lRW5kIC0gZGlmZkNodW5rLm5ld0xpbmVTdGFydCk7XG4gICAgICAgIC8vIG1vdmUgdGhlIHNlbGVjdGlvbiBwb2ludGVyIGJhY2sgc28gdGhlIG5leHQgZGlmZiBjaHVuayBpcyBub3Qgc2tpcHBlZFxuICAgICAgICBpZih0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmhhc1NlbGVjdGlvbigpIHx8IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuaGFzU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXgtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKCFmb3VuZFNlbGVjdGlvbikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NwbGl0IERpZmYnLCB7ZGV0YWlsOiB0aGlzLl9DT1BZX0hFTFBfTUVTU0FHRSwgZGlzbWlzc2FibGU6IGZhbHNlLCBpY29uOiAnZGlmZid9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29waWVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGlmZiBjaHVuayBmcm9tIHRoZSByaWdodCBlZGl0b3IgdG8gdGhlIGxlZnRcbiAgICogZWRpdG9yLlxuICAgKi9cbiAgY29weVRvTGVmdCgpIHtcbiAgICB2YXIgZm91bmRTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICB2YXIgb2Zmc2V0ID0gMDsgLy8ga2VlcCB0cmFjayBvZiBsaW5lIG9mZnNldCAodXNlZCB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBjaHVua3MgYmVpbmcgbW92ZWQpXG5cbiAgICBmb3IodmFyIGRpZmZDaHVuayBvZiB0aGlzLl9jaHVua3MpIHtcbiAgICAgIGlmKGRpZmZDaHVuay5pc1NlbGVjdGVkKSB7XG4gICAgICAgIGZvdW5kU2VsZWN0aW9uID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdGV4dFRvQ29weSA9IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0RWRpdG9yKCkuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tkaWZmQ2h1bmsubmV3TGluZVN0YXJ0LCAwXSwgW2RpZmZDaHVuay5uZXdMaW5lRW5kLCAwXV0pO1xuICAgICAgICB2YXIgbGFzdEJ1ZmZlclJvdyA9IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuZ2V0TGFzdEJ1ZmZlclJvdygpO1xuICAgICAgICAvLyBpbnNlcnQgbmV3IGxpbmUgaWYgdGhlIGNodW5rIHdlIHdhbnQgdG8gY29weSB3aWxsIGJlIGJlbG93IHRoZSBsYXN0IGxpbmUgb2YgdGhlIG90aGVyIGVkaXRvclxuICAgICAgICBpZigoZGlmZkNodW5rLm9sZExpbmVTdGFydCArIG9mZnNldCkgPiBsYXN0QnVmZmVyUm93KSB7XG4gICAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGFzdEJ1ZmZlclJvdywgMF0sIHthdXRvc2Nyb2xsOiBmYWxzZX0pO1xuICAgICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuaW5zZXJ0TmV3bGluZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW2RpZmZDaHVuay5vbGRMaW5lU3RhcnQgKyBvZmZzZXQsIDBdLCBbZGlmZkNodW5rLm9sZExpbmVFbmQgKyBvZmZzZXQsIDBdXSwgdGV4dFRvQ29weSk7XG4gICAgICAgIC8vIG9mZnNldCB3aWxsIGJlIHRoZSBhbW91bnQgb2YgbGluZXMgdG8gYmUgY29waWVkIG1pbnVzIHRoZSBhbW91bnQgb2YgbGluZXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgb2Zmc2V0ICs9IChkaWZmQ2h1bmsubmV3TGluZUVuZCAtIGRpZmZDaHVuay5uZXdMaW5lU3RhcnQpIC0gKGRpZmZDaHVuay5vbGRMaW5lRW5kIC0gZGlmZkNodW5rLm9sZExpbmVTdGFydCk7XG4gICAgICAgIC8vIG1vdmUgdGhlIHNlbGVjdGlvbiBwb2ludGVyIGJhY2sgc28gdGhlIG5leHQgZGlmZiBjaHVuayBpcyBub3Qgc2tpcHBlZFxuICAgICAgICBpZih0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmhhc1NlbGVjdGlvbigpIHx8IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuaGFzU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZENodW5rSW5kZXgtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKCFmb3VuZFNlbGVjdGlvbikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NwbGl0IERpZmYnLCB7ZGV0YWlsOiB0aGlzLl9DT1BZX0hFTFBfTUVTU0FHRSwgZGlzbWlzc2FibGU6IGZhbHNlLCBpY29uOiAnZGlmZid9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIHRoZSBlZGl0b3IgaW5kaWNhdGVkIGJ5IGluZGV4LiBBIGNsZWFuIHVwIHdpbGwgcmVtb3ZlIHRoZSBlZGl0b3JcbiAgICogb3IgdGhlIHBhbmUgaWYgbmVjZXNzYXJ5LiBUeXBpY2FsbHkgbGVmdCBlZGl0b3IgPT0gMSBhbmQgcmlnaHQgZWRpdG9yID09IDIuXG4gICAqXG4gICAqIEBwYXJhbSBlZGl0b3JJbmRleCBUaGUgaW5kZXggb2YgdGhlIGVkaXRvciB0byBjbGVhbiB1cC5cbiAgICovXG4gIGNsZWFuVXBFZGl0b3IoZWRpdG9ySW5kZXgpIHtcbiAgICBpZihlZGl0b3JJbmRleCA9PT0gMSkge1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5jbGVhblVwKCk7XG4gICAgfSBlbHNlIGlmKGVkaXRvckluZGV4ID09PSAyKSB7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmNsZWFuVXAoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzdG9yZXMgc29mdCB3cmFwIHRvIHRoZSBhcHByb3ByaWF0ZSBlZGl0b3IuXG4gICAqIEBwYXJhbSBlZGl0b3JJbmRleCBUaGUgaW5kZXggb2YgdGhlIGVkaXRvciB0byByZXN0b3JlIHNvZnQgd3JhcCB0by5cbiAgICovXG4gIHJlc3RvcmVFZGl0b3JTb2Z0V3JhcChlZGl0b3JJbmRleCkge1xuICAgIGlmKGVkaXRvckluZGV4ID09PSAxKSB7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLmdldEVkaXRvcigpLnNldFNvZnRXcmFwcGVkKHRydWUpO1xuICAgIH0gZWxzZSBpZihlZGl0b3JJbmRleCA9PT0gMikge1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5zZXRTb2Z0V3JhcHBlZCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIGVkaXRvciBkaWZmIGV4dGVuZGVycy5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5kZXN0cm95KCk7XG4gICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzIGJldHdlZW4gdGhlIGVkaXRvcnMuXG4gICAqXG4gICAqIEByZXR1cm4gaW50IFRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGUgZWRpdG9ycy5cbiAgICovXG4gIGdldE51bURpZmZlcmVuY2VzKCkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHRoaXMuX2NodW5rcykgPyB0aGlzLl9jaHVua3MubGVuZ3RoIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtYXJrZXIgbGF5ZXJzIGluIHVzZSBieSB0aGUgZWRpdG9ycy5cbiAgICogQHJldHVybiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFya2VyIGxheWVycyBhbmQgYXBwcm9yaWF0ZSBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGdldE1hcmtlckxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2VyTGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgd2hlbiB0aGUgY3Vyc29yIG1vdmVzIGluIHRoZSBlZGl0b3IuIFdpbGwgaGlnaGxpZ2h0IGNodW5rcyB0aGF0IGhhdmUgYSBjdXJzb3IgaW4gdGhlbS5cbiAgICogQHBhcmFtIGN1cnNvciBUaGUgY3Vyc29yIG9iamVjdCBmcm9tIHRoZSBldmVudC5cbiAgICogQHBhcmFtIG9sZEJ1ZmZlclBvc2l0aW9uIFRoZSBvbGQgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBpbiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0gbmV3QnVmZmVyUG9zaXRpb24gVGhlIG5ldyBwb3NpdGlvbiBvZiB0aGUgY3Vyc29yIGluIHRoZSBidWZmZXIuXG4gICAqL1xuICBoYW5kbGVDdXJzb3JDaGFuZ2UoY3Vyc29yLCBvbGRCdWZmZXJQb3NpdGlvbiwgbmV3QnVmZmVyUG9zaXRpb24pIHtcbiAgICB2YXIgZWRpdG9ySW5kZXggPSAoY3Vyc29yLmVkaXRvciA9PT0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKSkgPyAxIDogMjtcbiAgICB2YXIgb2xkUG9zaXRpb25DaHVua0luZGV4ID0gdGhpcy5fZ2V0Q2h1bmtJbmRleEJ5TGluZU51bWJlcihlZGl0b3JJbmRleCwgb2xkQnVmZmVyUG9zaXRpb24ucm93KTtcbiAgICB2YXIgbmV3UG9zaXRpb25DaHVua0luZGV4ID0gdGhpcy5fZ2V0Q2h1bmtJbmRleEJ5TGluZU51bWJlcihlZGl0b3JJbmRleCwgbmV3QnVmZmVyUG9zaXRpb24ucm93KTtcblxuICAgIGlmKG9sZFBvc2l0aW9uQ2h1bmtJbmRleCA+PSAwKSB7XG4gICAgICB2YXIgZGlmZkNodW5rID0gdGhpcy5fY2h1bmtzW29sZFBvc2l0aW9uQ2h1bmtJbmRleF07XG4gICAgICBkaWZmQ2h1bmsuaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5kZXNlbGVjdExpbmVzKGRpZmZDaHVuay5vbGRMaW5lU3RhcnQsIGRpZmZDaHVuay5vbGRMaW5lRW5kKTtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZGVzZWxlY3RMaW5lcyhkaWZmQ2h1bmsubmV3TGluZVN0YXJ0LCBkaWZmQ2h1bmsubmV3TGluZUVuZCk7XG4gICAgfVxuICAgIGlmKG5ld1Bvc2l0aW9uQ2h1bmtJbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLl9zZWxlY3RDaHVuayhuZXdQb3NpdGlvbkNodW5rSW5kZXgsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUFJJVkFURSBNRVRIT0RTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuZCBoaWdobGlnaHRzIHRoZSBkaWZmIGNodW5rIGluIGJvdGggZWRpdG9ycyBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIGdpdmVuIGluZGV4LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBkaWZmIGNodW5rIHRvIGhpZ2hsaWdodCBpbiBib3RoIGVkaXRvcnMuXG4gICAqIEBwYXJhbSBpc05leHRPclByZXYgV2hldGhlciB3ZSBhcmUgbW92aW5nIHRvIGEgZGlyZWN0IHNpYmxpbmcgKGlmIG5vdCwgdGhpcyBpcyBhIGNsaWNrKVxuICAgKiBAcGFyYW0gaXNTeW5jU2Nyb2xsRW5hYmxlZCBPbmx5IGF1dG9zY3JvbGwgb25lIGVkaXRvciBpZiBzeW5jIHNjcm9sbCBpcyBlbmFibGVkIG9yIHdlIHdpbGwgZ2V0IGluIGFuIGluZmluaXRlIGxvb3BcbiAgICovXG4gIF9zZWxlY3RDaHVuayhpbmRleCwgaXNOZXh0T3JQcmV2LCBpc1N5bmNTY3JvbGxFbmFibGVkKSB7XG4gICAgdmFyIGRpZmZDaHVuayA9IHRoaXMuX2NodW5rc1tpbmRleF07XG4gICAgaWYoZGlmZkNodW5rICE9IG51bGwpIHtcbiAgICAgIGRpZmZDaHVuay5pc1NlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgaWYoaXNOZXh0T3JQcmV2KSB7XG4gICAgICAgIC8vIGRlc2VsZWN0IHByZXZpb3VzIG5leHQvcHJldiBoaWdobGlnaHRzXG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZGVzZWxlY3RBbGxMaW5lcygpO1xuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmRlc2VsZWN0QWxsTGluZXMoKTtcbiAgICAgICAgLy8gc2Nyb2xsIHRoZSBlZGl0b3JzXG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuZ2V0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2RpZmZDaHVuay5vbGRMaW5lU3RhcnQsIDBdLCB7YXV0b3Njcm9sbDogdHJ1ZX0pO1xuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIyLmdldEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtkaWZmQ2h1bmsubmV3TGluZVN0YXJ0LCAwXSwge2F1dG9zY3JvbGw6ICFpc1N5bmNTY3JvbGxFbmFibGVkfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGhpZ2hsaWdodCBzZWxlY3Rpb24gaW4gYm90aCBlZGl0b3JzXG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLnNlbGVjdExpbmVzKGRpZmZDaHVuay5vbGRMaW5lU3RhcnQsIGRpZmZDaHVuay5vbGRMaW5lRW5kKTtcbiAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuc2VsZWN0TGluZXMoZGlmZkNodW5rLm5ld0xpbmVTdGFydCwgZGlmZkNodW5rLm5ld0xpbmVFbmQpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5kZXggb2YgYSBjaHVuayBieSB0aGUgbGluZSBudW1iZXIuXG4gICAqIEBwYXJhbSBlZGl0b3JJbmRleCBUaGUgaW5kZXggb2YgdGhlIGVkaXRvciB0byBjaGVjay5cbiAgICogQHBhcmFtIGxpbmVOdW1iZXIgIFRoZSBsaW5lIG51bWJlciB0byB1c2UgdG8gY2hlY2sgaWYgaXQgaXMgaW4gYSBjaHVuay5cbiAgICogQHJldHVybiBUaGUgaW5kZXggb2YgdGhlIGNodW5rLlxuICAgKi9cbiAgX2dldENodW5rSW5kZXhCeUxpbmVOdW1iZXIoZWRpdG9ySW5kZXgsIGxpbmVOdW1iZXIpIHtcbiAgICBmb3IodmFyIGk9MDsgaTx0aGlzLl9jaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkaWZmQ2h1bmsgPSB0aGlzLl9jaHVua3NbaV07XG4gICAgICBpZihlZGl0b3JJbmRleCA9PT0gMSkge1xuICAgICAgICBpZihkaWZmQ2h1bmsub2xkTGluZVN0YXJ0IDw9IGxpbmVOdW1iZXIgJiYgZGlmZkNodW5rLm9sZExpbmVFbmQgPiBsaW5lTnVtYmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZihlZGl0b3JJbmRleCA9PT0gMikge1xuICAgICAgICBpZihkaWZmQ2h1bmsubmV3TGluZVN0YXJ0IDw9IGxpbmVOdW1iZXIgJiYgZGlmZkNodW5rLm5ld0xpbmVFbmQgPiBsaW5lTnVtYmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB0aGUgd29yZCBkaWZmIG9mIHRoZSBjaHVuayBwYXNzZWQgaW4uXG4gICAqXG4gICAqIEBwYXJhbSBjaHVuayBUaGUgY2h1bmsgdGhhdCBzaG91bGQgaGF2ZSBpdHMgd29yZHMgaGlnaGxpZ2h0ZWQuXG4gICAqL1xuICBfaGlnaGxpZ2h0V29yZHNJbkNodW5rKGNodW5rLCBsZWZ0SGlnaGxpZ2h0VHlwZSwgcmlnaHRIaWdobGlnaHRUeXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKSB7XG4gICAgdmFyIGxlZnRMaW5lTnVtYmVyID0gY2h1bmsub2xkTGluZVN0YXJ0O1xuICAgIHZhciByaWdodExpbmVOdW1iZXIgPSBjaHVuay5uZXdMaW5lU3RhcnQ7XG4gICAgLy8gZm9yIGVhY2ggbGluZSB0aGF0IGhhcyBhIGNvcnJlc3BvbmRpbmcgbGluZVxuICAgIHdoaWxlKGxlZnRMaW5lTnVtYmVyIDwgY2h1bmsub2xkTGluZUVuZCAmJiByaWdodExpbmVOdW1iZXIgPCBjaHVuay5uZXdMaW5lRW5kKSB7XG4gICAgICB2YXIgZWRpdG9yMUxpbmVUZXh0ID0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5saW5lVGV4dEZvckJ1ZmZlclJvdyhsZWZ0TGluZU51bWJlcik7XG4gICAgICB2YXIgZWRpdG9yMkxpbmVUZXh0ID0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5nZXRFZGl0b3IoKS5saW5lVGV4dEZvckJ1ZmZlclJvdyhyaWdodExpbmVOdW1iZXIpO1xuXG4gICAgICBpZihlZGl0b3IxTGluZVRleHQgPT0gJycpIHtcbiAgICAgICAgLy8gY29tcHV0ZVdvcmREaWZmIHJldHVybnMgZW1wdHkgZm9yIGxpbmVzIHRoYXQgYXJlIHBhaXJlZCB3aXRoIGVtcHR5IGxpbmVzXG4gICAgICAgIC8vIG5lZWQgdG8gZm9yY2UgYSBoaWdobGlnaHRcbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5zZXRXb3JkSGlnaGxpZ2h0cyhyaWdodExpbmVOdW1iZXIsIFt7Y2hhbmdlZDogdHJ1ZSwgdmFsdWU6IGVkaXRvcjJMaW5lVGV4dH1dLCByaWdodEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpO1xuICAgICAgfSBlbHNlIGlmKCBlZGl0b3IyTGluZVRleHQgPT0gJycgKSB7XG4gICAgICAgIC8vIGNvbXB1dGVXb3JkRGlmZiByZXR1cm5zIGVtcHR5IGZvciBsaW5lcyB0aGF0IGFyZSBwYWlyZWQgd2l0aCBlbXB0eSBsaW5lc1xuICAgICAgICAvLyBuZWVkIHRvIGZvcmNlIGEgaGlnaGxpZ2h0XG4gICAgICAgIHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjEuc2V0V29yZEhpZ2hsaWdodHMobGVmdExpbmVOdW1iZXIsIFt7Y2hhbmdlZDogdHJ1ZSwgdmFsdWU6IGVkaXRvcjFMaW5lVGV4dH1dLCBsZWZ0SGlnaGxpZ2h0VHlwZSwgaXNXaGl0ZXNwYWNlSWdub3JlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwZXJmb3JtIHJlZ3VsYXIgd29yZCBkaWZmXG4gICAgICAgIHZhciB3b3JkRGlmZiA9IENvbXB1dGVXb3JkRGlmZi5jb21wdXRlV29yZERpZmYoZWRpdG9yMUxpbmVUZXh0LCBlZGl0b3IyTGluZVRleHQpO1xuICAgICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLnNldFdvcmRIaWdobGlnaHRzKGxlZnRMaW5lTnVtYmVyLCB3b3JkRGlmZi5yZW1vdmVkV29yZHMsIGxlZnRIaWdobGlnaHRUeXBlLCBpc1doaXRlc3BhY2VJZ25vcmVkKTtcbiAgICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5zZXRXb3JkSGlnaGxpZ2h0cyhyaWdodExpbmVOdW1iZXIsIHdvcmREaWZmLmFkZGVkV29yZHMsIHJpZ2h0SGlnaGxpZ2h0VHlwZSwgaXNXaGl0ZXNwYWNlSWdub3JlZCk7XG4gICAgICB9XG5cbiAgICAgIGxlZnRMaW5lTnVtYmVyKys7XG4gICAgICByaWdodExpbmVOdW1iZXIrKztcbiAgICB9XG5cbiAgICAvLyBoaWdobGlnaHQgcmVtYWluaW5nIGxpbmVzIGluIGxlZnQgZWRpdG9yXG4gICAgd2hpbGUobGVmdExpbmVOdW1iZXIgPCBjaHVuay5vbGRMaW5lRW5kKSB7XG4gICAgICB2YXIgZWRpdG9yMUxpbmVUZXh0ID0gdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMS5nZXRFZGl0b3IoKS5saW5lVGV4dEZvckJ1ZmZlclJvdyhsZWZ0TGluZU51bWJlcik7XG4gICAgICB0aGlzLl9lZGl0b3JEaWZmRXh0ZW5kZXIxLnNldFdvcmRIaWdobGlnaHRzKGxlZnRMaW5lTnVtYmVyLCBbe2NoYW5nZWQ6IHRydWUsIHZhbHVlOiBlZGl0b3IxTGluZVRleHR9XSwgbGVmdEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpO1xuICAgICAgbGVmdExpbmVOdW1iZXIrKztcbiAgICB9XG4gICAgLy8gaGlnaGxpZ2h0IHJlbWFpbmluZyBsaW5lcyBpbiB0aGUgcmlnaHQgZWRpdG9yXG4gICAgd2hpbGUocmlnaHRMaW5lTnVtYmVyIDwgY2h1bmsubmV3TGluZUVuZCkge1xuICAgICAgdGhpcy5fZWRpdG9yRGlmZkV4dGVuZGVyMi5zZXRXb3JkSGlnaGxpZ2h0cyhyaWdodExpbmVOdW1iZXIsIFt7Y2hhbmdlZDogdHJ1ZSwgdmFsdWU6IHRoaXMuX2VkaXRvckRpZmZFeHRlbmRlcjIuZ2V0RWRpdG9yKCkubGluZVRleHRGb3JCdWZmZXJSb3cocmlnaHRMaW5lTnVtYmVyKX1dLCByaWdodEhpZ2hsaWdodFR5cGUsIGlzV2hpdGVzcGFjZUlnbm9yZWQpO1xuICAgICAgcmlnaHRMaW5lTnVtYmVyKys7XG4gICAgfVxuICB9XG59O1xuIl19