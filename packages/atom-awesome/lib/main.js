'use strict';


let {
  CompositeDisposable,
  Emitter,
  Disposable,
} = require('atom');


function didObserveTextEditors() {
  atom.workspace.observeTextEditors(function (editor) {
    editor.path = editor.getPath() || null;
  });
}

function resolveActiveEditorDirPath() {
  var dirpath, editor;

  editor = atom.workspace.getActiveTextEditor();
  dirpath = (typeof editor.path === 'undefined') ? '' : fse.realpathSync(editor.path + '/../');

  return dirpath;
}

function resolveFromPath(fromPath = '') {
  var activeDirPath = resolveActiveEditorDirPath();

  fromPath = (typeof fromPath === 'undefined' || !fromPath) ? activeDirPath + '/' : activeDirPath + fromPath.replace(/^\.\./ig, '/..').replace(/^\./ig, '');

  return stdpath.resolve(fromPath);
}

Object.assign(global, {
  resolveFromPath,
  resolveActiveEditorDirPath,
});

console.log('start');

(function () {

  let atomAwesome;

  class AtomAwesome
  {

    deserialize() {
      console.log('deserialize');
    }

    activate() {
      this.subscriptions = new CompositeDisposable();
      this.emitter = new Emitter();

      didObserveTextEditors();
    }

    deactivate() {
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.dispose();
      this.emitter = null;
    }
  }

  atomAwesome = new AtomAwesome();

  console.log('function.call');

  // console.log(resolveActiveEditorDirPath());
  console.log(resolveFromPath('/../../asd.js'));

  module.exports = atomAwesome;
}.call(global));
