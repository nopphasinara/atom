'use strict';


let {
  CompositeDisposable,
  Emitter,
  Disposable,
} = require('atom');


function didObserveTextEditors() {
  atom.workspace.observeTextEditors(function (editor) {
    editor.path = editor.getPath() || undefined;
  });
}


console.log('start');

(function () {

  let atomAwesome;

  class AtomAwesome
  {

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

  module.exports = atomAwesome;
}.call(global));
