'use babel';

const DEBUG = false;
const LOG_PREFIX = "[expand-selection-to-indentation]"

/**
 * Use log(...) with the specified parameters and prefix.
 */
function log(){
  if (!DEBUG) return;
  var args = Array.prototype.slice.call(arguments);
  args.unshift(LOG_PREFIX + ' ');
  console.log.apply(console, args);
}

class ExpandSelectionToIndentation {
  getCurrentLineText() {
    const editor = atom.workspace.getActiveTextEditor();
    const cursorPosition = editor.getCursorBufferPosition();
    return editor.lineTextForBufferRow(cursorPosition.row);
  }

  numberOfLeadingSpacesInText(text) {
    if (!text) {
      return null;
    }

    let leadingSpacesCount = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        leadingSpacesCount++;
      } else {
        break;
      }
    }
    return leadingSpacesCount;
  }

  up() {
    const editor = atom.workspace.getActiveTextEditor();

    const currentRow = editor.getCursorBufferPosition().row;
    const leadingSpacesCount = this.numberOfLeadingSpacesInText(
      editor.lineTextForBufferRow(currentRow),
    );

    log('Start at ', currentRow);

    let numberOfRowsToSelect = 0;
    // Continue scanning rows of text upwards until we meet the same leading space count.
    while (1) {
      let lineIndex = currentRow - numberOfRowsToSelect - 1;
      let line = editor.lineTextForBufferRow(lineIndex);
      let spacesOnLine = this.numberOfLeadingSpacesInText(line);
      if (spacesOnLine !== leadingSpacesCount || lineIndex === -1) {
        log('Done adding rows, lineIndex: %d', lineIndex);
        break;
      }
      numberOfRowsToSelect++;
      log('Add %s at %s', line, lineIndex);
    }

    editor.selectUp(numberOfRowsToSelect);
  }

  down() {
    const editor = atom.workspace.getActiveTextEditor();

    const currentRow = editor.getCursorBufferPosition().row;
    const leadingSpacesCount = this.numberOfLeadingSpacesInText(
      editor.lineTextForBufferRow(currentRow),
    );

    console.log('going down until we find: %s', leadingSpacesCount);

    let numberOfRowsToSelect = 0;
    // Continue scanning rows of text upwards until we meet the same leading space count.
    while (1) {
      let lineIndex = currentRow + numberOfRowsToSelect + 1;
      let line = editor.lineTextForBufferRow(lineIndex);
      let spacesOnLine = this.numberOfLeadingSpacesInText(line);
      if (spacesOnLine !== leadingSpacesCount || lineIndex === 0) {
        break;
      }
      numberOfRowsToSelect++;
      console.log('%s | %s', line, spacesOnLine);
    }

    editor.selectDown(numberOfRowsToSelect);
  }
}

export default new ExpandSelectionToIndentation();
