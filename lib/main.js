'use babel';

console.clear();


var _ = require('lodash');


export class ProviderManager {
  constructor() {}

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
}

console.log(new ProviderManager());


export function atom_initialize() {
  console.log(_);
}


atom.packages.onDidActivateInitialPackages(atom_initialize);
