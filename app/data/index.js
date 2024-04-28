const graph = {};

//graph._node = require("./graph_node.js");
//graph.nod = graph._node.Node();
graph._node = require("./graph/node.js");
graph.nod = graph._node.no;



//graph._graph = require("./graph_graph.js");
//graph.graf = graph._graph.gr_ob.Graph();
graph._graph = require("./graph/graph.js");
graph.graf = graph._graph.gr;



graph._edge = require("./graph/edge.js");
graph.edge = graph._graph.ed;



graph.users = require("./graph_users.js");
graph.us = graph._graph.usr_state;

//console.log("BBB : "+JSON.stringify(graph.users.UserState()));

//export default graph;
//module.exports = us;