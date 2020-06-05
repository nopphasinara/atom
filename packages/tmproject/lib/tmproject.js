'use babel';

import fs from 'fs';
import path from 'path';
import {CompositeDisposable} from 'atom';
// import {SelectListView} from 'atom-space-pen-views';
// import co from 'co';
import mkdirp from 'mkdirp';
// import thenify from 'thenify';
import tmp from 'tmp';
// import TmpProjectManagerView from './tmp-project-manager-view';
import TemprojectListView from './tmproject-list-view';

tmp.setGracefulCleanup();

export default {
  tmprojectListView: null,
  tmpProjects: [],
  subscriptions: null,

  config: {
    tmpdir: {
      title: 'Base temporary directory',
      type: 'string',
      default: `${tmp.tmpdir}/atom`
    }
  },

  activate() {
    this.removeTmpProjects();
    this.tmprojectListView = new TemprojectListView();
    this.tmprojectListView.blurEventListener(() => {
      this.tmprojectListView.cancel();
      this.tmprojectListView.panel.hide();
    });
    const modalPanel = atom.workspace.addModalPanel({
      item: this.tmprojectListView,
      visible: false
    });
    this.tmprojectListView.setTmpProjects(this.tmpProjects);
    this.tmprojectListView.setPanel(modalPanel);

    this.ensureDirectory()
      .catch(err => console.log(err));

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'Tmproject: Create': () => this.createTmpProject(),
      'Tmproject: Delete': () => this.deleteTmpProjects()
    }));
  },

  deactivate() {
    this.tmprojectListView.panel.destroy();
    this.subscriptions.dispose();
  },

  getTmpProjects() {
    const tmpdir = this.getConfig('tmpdir');
    return atom.project.rootDirectories
      .filter(dir => dir.path.startsWith(tmpdir));
  },

  removeTmpProjects() {
    this.getTmpProjects()
      .forEach(dir => atom.project.removePath(dir.path));
  },

  getConfig(propName) {
    return atom.config.get(`tmproject.${propName}`);
  },

  ensureDirectory() {
    const tmpDirPath = this.getConfig('tmpdir');
    return new Promise((resolve, reject) => {
      fs.access(tmpDirPath, fs.constants.F_OK, err => {
        if (err !== null) {
          mkdirp(tmpDirPath, err => {
            if (err !== null) {
              return reject(err);
            }
            resolve();
          });
        }
        resolve();
      });
    });
  },

  createTmpProject() {
    const dir = tmp.dirSync({template: `${tmp.tmpdir}/atom/XXXXXX`});
    this.tmpProjects.push(dir);
    atom.project.addPath(dir.name);
  },

  deleteTmpProjects() {
    const items = this.getTmpProjects()
                    .map(dir => (
                      {dir, basename: path.basename(dir.path)}
                    ));
    this.tmprojectListView.show(items);
  }
};
