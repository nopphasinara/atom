'use babel';

let CompositeDisposable = require('atom').CompositeDisposable;
let Emitter = require('atom').Emitter;

let CommandManager = {
  registerCommands: function () {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
  },
};

module.exports = CommandManager;
