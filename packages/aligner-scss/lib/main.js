'use strict';

let provider = require('./provider');
module.exports = {
  config: provider.config,
  activate: function() {
    return true;
    // return console.log('activate aligner-scss');
  },
  getProvider: function() {
    return provider;
  }
};
