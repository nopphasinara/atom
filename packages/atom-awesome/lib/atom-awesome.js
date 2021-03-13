var _ = require('lodash');
var fse = require('fs-extra');

console.log(_);
console.log(fse);
console.log(atom.workspace);

function AtomAwesome() {
  this.foo = 'Foo';
}

function BaseWrapper() {
  AtomAwesome.prototype = {
    initialize: function () {
      console.log('initialize');
    },
    activate: function () {
      console.log('activate');
    },
    deactivate: function () {
      console.log('deactivate');
    },
    getFoo: function () {
      return this.foo;
    },
  };

  var result;
  result = new AtomAwesome();

  return result;
}

var atomAwesome = BaseWrapper();

console.log(atomAwesome);
console.log(atomAwesome.getFoo());

module.exports = atomAwesome;
