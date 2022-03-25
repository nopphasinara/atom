'use babel';

console.clear();

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

const ATOM_PATH = path.dirname(atom.getUserInitScriptPath());

var foopath = lib('classes/CommandManager.js');

// console.log(require.cache[foopath]);

var CommandManager = requireFresh(foopath);

// new CommandManager([
//   {
//     atom.commands.add();
//   },
// ]);


function requireFresh(module) {
  if (typeof require.cache[module] !== 'undefined') {
    delete require.cache[module];
  }

  return require(module);
}


function lib(...paths) {
  if (typeof paths === 'undefined') {
    return;
  }

  return path.join(ATOM_PATH, 'lib', paths.join('/'));
}

function atom_initialize() {
  console.log(_);
  return this;
}


class ProviderManager {
  constructor() {
    atom.commands.onWillDispatch(() => {
      console.log(callback.arguments);
    });
  }

  register(provider) {
    const disposable = new CompositeDisposable();
    const providerId = provider ? provider.id : '';

    if (providerId) {
      disposable.add(operatorConfig.add(providerId, provider));
      disposable.add(
        atom.config.observe(providerId, (value) => {
          return operatorConfig.updateConfigWithAtom(providerId, value);
        })
      );
    }

    // Unregister provider from providerManager
    return disposable;
  }
};

console.log(new ProviderManager());

module.export = new ProviderManager();
module.export = new atom_initialize();


atom.packages.onDidActivateInitialPackages(atom_initialize);
