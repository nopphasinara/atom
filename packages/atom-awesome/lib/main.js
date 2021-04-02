'use strict';


let atomAwesomeBase;

const {
  CompositeDisposable,
  Emitter,
} = require('atom');


class AtomAwesomeBase
{
  observeTextEditors() {
    atom.workspace.observeActiveTextEditor(function (editor) {
      console.log(editor);
    });
  }
}

class AtomAwesome extends AtomAwesomeBase
{
  runtimeGenerator() {
    this.observeTextEditors();
  }

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ascii-art:convert': function () {
        this.convert();
      },

      'art:convert': function () {
        this.convert();
      },
    }));

    this.runtimeGenerator();

    console.group('activate');
    console.log(this);
    console.groupEnd();
  }

  deactivate() {
    this.subscriptions.dispose();
    this.subscriptions = null;
    this.emitter.dispose();
    this.emitter = null;

    console.group('deactivate');
    console.log(this);
    console.groupEnd();
  }

  convert() {
    console.log('Convert text!');
  }
};

var atomAwesome = new AtomAwesome();

console.group('atomAwesome');
console.log(atomAwesome);
console.groupEnd();

exports.atomAwesome = atomAwesome;
