'use strict';


const {
  CompositeDisposable,
  Disposable,
} = require('atom');


class AtomAwesome
{
  activate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ascii-art:convert': function () {
        this.convert();
      },
    }));

    console.group('activate');
    console.log(this);
    console.groupEnd();
  }

  deactivate() {
    this.subscriptions.dispose();

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
