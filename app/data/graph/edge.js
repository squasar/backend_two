const Node = require("./node.js");
class Edge {

    connection = [];
    value;
    
    setValue(value) {
        this.value = value;
        return this;
    }

    
    Edge() {
        this.connection = []; // adjacency list
    }

    addEdge(source_node, target_node) {
        var val = [source_node, target_node];
        var val2 = [target_node, source_node];
        this.connection.push(val);
        this.connection.push(val2);
    }

    removeEdge(source_node, target_node) {
        var val = [source_node, target_node];
        const index = this.connection.indexOf(val);
        if (index > -1) {
            this.connection.splice(index, 1);
            //return node;
        }
        var val = [target_node, source_node];
        const _index = this.connection.indexOf(val);
        if (_index > -1) {
            this.connection.splice(_index, 1);
            //return node;
        }
    }

    getEdge() {
        return this.connection;
    }

    isConnected(source_node, target_node) {
        var val = [source_node, target_node];
        return this.connection.indexOf(val) > -1;
    }
}


res_three={};
res_three.ed = Edge;
res_three.ed_ob = new Edge();
//module.exports = EngineSwitchboard;
//res.bfs = Graph;
//res.dfs = dfs;

//const gr = new Graph();
//console.log("Kayıt : 5");
module.exports = res_three;



//const no = new Node();

//console.log("Kayıt : 6");

//module.exports = no;