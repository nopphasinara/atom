console.clear();

console.group('atom');
console.log(atom);
console.groupEnd();

function create(prototype, properties) {
  prototype = prototype === null ? null : Object(prototype)
  const result = Object.create(prototype)
  return properties == null ? result : Object.assign(result, properties)
}

var prototype, properties;

properties = {
  name   : 'John Doe',
  age    : 'Male',
  gender : 16,
};
// console.log(properties);

prototype = {
  getName: function () {
    return this.name;
  },

  getAge: function () {
    return this.age;
  },

  getGender: function () {
    return this.gender;
  },

  isOver18: function () {
    return this.age >= 18;
  },
};
// console.log(prototype);

var obj1 = Object.assign(Object.create(Object(prototype)), properties);
console.log(obj1);

var obj2 = _.create(prototype, properties);
console.log(obj2);

var obj3 = Object.assign(Object.create(prototype), properties);
console.log(obj3);

var obj4 = Object.assign(prototype.__proto__, properties);
console.log(obj4);