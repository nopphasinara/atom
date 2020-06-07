((global, factory) => {

  // Clear console log
  console.clear();

  console.log(define, define.amd);
  console.log(module, typeof module);

  // universal module definition
  /* jshint strict: false */ /* globals define, module */
  if (typeof define == 'function' && define.amd) {
    // AMD - RequireJS
    define('ev-emitter/ev-emitter', factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

})(this, () => {

});

var e = document.querySelector('#jumpto-symbol-select-menu');
var c = e.querySelector('.SelectMenu-modal');

// SelectMenu-item d-flex flex-justify-between css-truncate