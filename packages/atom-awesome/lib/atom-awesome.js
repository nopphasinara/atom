;(function () {

  setTimeout(function () {
    runtimeGenerator();
  }, 100);

  function runtimeGenerator() {

    var faker = new Faker();
    var atomAwesome;

    function baseCreate(value) {
      if (!_.isUndefined(value)) {
        if (!_.isObject(value)) {
          value = Object.create(value);
        }
      }

      var result = Object.create(value);

      return Object.assign(result, this);
    }

    function AtomAwesomeWrapper() {
      this.foo = 'Foo';
      this.bar = 'Bar';
    }

    var AtomAwesome = function (callback, proto, ...args) {
      if (!_.isUndefined(callback)) {
        if (!_.isFunction(callback)) {
          callback = function () {};
        }
      }

      if (!_.isUndefined(proto)) {
        if (!_.isObject(proto)) {
          proto = Object.create(proto);
        }
      }

      Object.assign(callback, args);
      Object.assign(callback.prototype, proto);

      return callback;
    }.bind(this, AtomAwesomeWrapper);

    atomAwesome = new AtomAwesome();

    console.log(atomAwesome);
    // console.log(atomAwesome.getFoo());

    module.exports = atomAwesome;

  }

}.call(this));
