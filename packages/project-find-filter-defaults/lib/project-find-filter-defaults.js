'use babel';

import { CompositeDisposable } from 'atom';
import * as path from 'path';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-find-filter-defaults:show': () => this.show()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  show() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), "project-find:show");
    atom.packages.activatePackage("find-and-replace").then(findAndReplace => this._prefill(findAndReplace));
  },

  _prefill(findAndReplace) {
    let view = findAndReplace.mainModule.projectFindView;
    view.pathsEditor.setText(atom.config.get('project-find-filter-defaults.fileDirectoryFilter'));
    view.findEditor.element.focus();
    view.findEditor.selectAll();
  }
};
