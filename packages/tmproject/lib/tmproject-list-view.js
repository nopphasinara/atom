'use babel';

import {SelectListView} from 'atom-space-pen-views';

export default class TmpProjectListView extends SelectListView {
  constructor() {
    super();
    this.tmpProjects = null;
    this.panel = null;
  }

  initialize() {
    super.initialize();
  }

  setPanel(panel) {
    this.panel = panel;
  }

  setTmpProjects(tmpProjects) {
    this.tmpProjects = tmpProjects;
  }

  viewForItem(item) {
    return `<li>${item.basename}</li>`;
  }

  getFilterKey() {
    return 'basename';
  }

  confirmed(item) {
    for (const project of this.tmpProjects) {
      if (project.name === item.dir.path) {
        atom.project.removePath(item.dir.path);
        break;
      }
    }
    this.panel.hide();
  }

  show(items) {
    this.setItems(items);
    this.panel.show();
    this.focusFilterEditor();
  }

  blurEventListener(callback) {
    this.filterEditorView[0].addEventListener('blur', callback);
  }
}
