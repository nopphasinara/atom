'use babel';

import fs from 'fs';
import tmp from 'tmp';

tmp.setGracefulCleanup();

const tmpdir = tmp.dirSync();

describe('Tmproject', () => {
  beforeEach(() => {
    atom.packages.activatePackage('tmproject');
    atom.config.set('tmproject.tmpdir', tmpdir.name);
  });

  it('Created tmporary directory', () => {
    expect(fs.statSync(tmpdir.name).isDirectory()).toBe(true);
  });

  it('Add tmp project', () => {
    runs(() => {
      atom.commands.dispatch('atom-workspace', 'Tmproject: Create');
      setTimeout(() => {
        const dirs = atom.project.rootDirectories;
        expect(dirs.length).toBe(2);
        expect(dirs[dirs.length - 1].path.startsWith(tmpdir.name)).toBe(true);
      }, 10);
    });
  });
});
