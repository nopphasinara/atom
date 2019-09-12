'use babel';

import path from 'path';
import fs from 'fs';

export default class Reloader {
  constructor(packageName) {
    this.packageName = packageName;
  }

  reload() {
    let pack = atom.packages.getLoadedPackage(this.packageName);

    if (!pack) {
      atom.notifications.addWarning(`${this.packageName} package is not loaded`);
      return;
    }

    // remove cache
    Object.keys(require.cache)
      .filter(p => p.indexOf(fs.realpathSync(pack.path) + path.sep) === 0)
      .forEach(p => { delete require.cache[p]; });

    atom.packages.deactivatePackage(this.packageName);
    atom.packages.unloadPackage(this.packageName);
    atom.packages.activatePackage(this.packageName)
      .then(() => atom.notifications.addInfo(`${this.packageName} is reloaded!`))
      .catch(err => atom.notifications.addError(err));
  }
}
