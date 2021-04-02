let node = require('../node.js');

let node1 = new node(4);
let node2 = new node(6);

node1.next = node2;

let list = new linkedList(node1);
