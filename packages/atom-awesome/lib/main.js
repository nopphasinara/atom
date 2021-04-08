'use babel';


let _ = require('lodash');
let fs = require('fs');
let fse = fs;
let stdpath = require('path');
let {
  CompositeDisposable,
} = require('atom');


// function didObserveTextEditors() {
//   atom.workspace.observeTextEditors(function (editor) {
//     editor.path = editor.getPath() || null;
//   });
// }
//
// function resolveActiveEditorDirPath() {
//   var dirpath, editor;
//
//   editor = atom.workspace.getActiveTextEditor();
//   dirpath = (typeof editor.path === 'undefined') ? '' : fse.realpathSync(editor.path + '/../');
//
//   return dirpath;
// }
//
// function resolveFromPath(fromPath = '') {
//   var activeDirPath = resolveActiveEditorDirPath();
//
//   fromPath = (typeof fromPath === 'undefined' || !fromPath) ? activeDirPath + '/' : activeDirPath + fromPath.replace(/^\.\./ig, '/..').replace(/^\./ig, '');
//
//   return stdpath.resolve(fromPath);
// }
//
// function requireFrom(fromPath = '') {
//   if (typeof fromPath === 'undefined' || !fromPath) {
//     return {};
//   }
//
//   delete require.cache[resolveFromPath(fromPath)];
//   module.loaded = false;
//   module.load(resolveFromPath(fromPath));
//
//   return module.exports;
// }
//
// Object.assign(global, {
//   resolveFromPath,
//   resolveActiveEditorDirPath,
//   requireFrom,
// });

console.log('start');

(function () {

  let atomAwesome;

  class AtomAwesome
  {

    deserialize() {
      console.log('deserialize');
    }

    activate() {
      // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
      this.subscriptions = new CompositeDisposable();

      // Wait for every package to have loaded, so that the menus are populated
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages(() => {
        didObserveTextEditors();
      }));
    }

    deactivate() {
      this.subscriptions.dispose();
    }
  }

  atomAwesome = new AtomAwesome();

  module.exports = atomAwesome;
}.call(global));
