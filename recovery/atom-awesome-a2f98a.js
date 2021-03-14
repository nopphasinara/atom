var _ = require('lodash');
var fse = require('fs-extra');

console.log(_);
console.log(fse);
console.log(atom.workspace);

function AtomAwesome() {
  this.foo = 'Foo';
}

function baseCreate(proto) {
  if (typeof proto === 'undefined') {
    return {};
  }

  if (typeof proto !== 'object') {
    return Object.create(proto);
  }

  function object() {}
  object.prototype = proto;
  object.constructor.prototype = object;

  var result = proto.__proto__;

  console.group('result');
  console.log(result);

  // result.forEach(function (item, k) {
  //   console.log(item);
  //
  //   // Object.assign(proto.constructor.name, {
  //   //   k: item,
  //   // });
  // });
  console.groupEnd();

  return result;
}

function BaseWrapper(value) {
  Object.assign(global, {
    AtomAwesome,
  });

  value.getFoo = () => {
    return this.foo || '';
  };
  console.log(value);
  console.log(arguments);

  var proto = {
    getRegisteredCommands: function () {
      var result = null,
          commands = null
      ;

      commands = atom.commands.selectorBasedListenersByCommandName;

      for (var command in commands) {
        if (commands.hasOwnProperty(command)) {
          console.log(command);
        }
      }

      return result;
    },

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
}

var atomAwesome = BaseWrapper(baseCreate(AtomAwesome.prototype));

console.log(atomAwesome);

module.exports = atomAwesome;
