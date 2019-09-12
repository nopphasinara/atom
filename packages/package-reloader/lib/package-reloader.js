'use babel';

import { CompositeDisposable } from 'atom';
import Reloader from './reloader';

export default {
  config: {
    targets: {
      type: 'array',
      title: 'target packages',
      description: 'comma separeted package name',
      default: [],
      items: { type: 'string' },
    }
  },

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'package-reloader:reload': () => this.reload()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  reload() {
    let targets = atom.config.get('package-reloader.targets');

    if (targets.length === 0) {
      atom.notifications.addWarning('Set target packages in setting');
    }
    else {
      targets.forEach(packageName => {
        new Reloader(packageName).reload();
      });
    }
  }
};
