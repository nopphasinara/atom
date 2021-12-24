// Clear current console log panel.
console.clear();


class Factory {

  constructor() {
    console.log('OK');

    this.markdownToggleBoldText();
  }

  markdownToggleBoldText() {
    console.log('markdownToggleBoldText');
    var editor = atom.workspace.getActiveTextEditor();
  }

}

// Export new  Factory module instance.
module.exports = new Factory();