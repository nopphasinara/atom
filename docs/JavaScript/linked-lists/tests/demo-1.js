console.clear();

var foo1;

delete require.cache[resolveFromPath('../node.js')];
module.loaded = false;
module.load(resolveFromPath('../node.js'));
// module.require(resolveFromPath('../node.js'));

foo1 = module.exports;

console.log(new foo1);

// let node = require(resolveFromPath('../node.js'));
//
// console.log(new node);
// console.log(node);
// console.log(node.fuck);
//
// // let node1 = new node(4);
// // let node2 = new node(6);
// //
// // node1.next = node2;
// //
// // let list = new linkedList(node1);
