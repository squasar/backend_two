const Node = require("./node.js").no;
const Edge = require("./edge.js").ed;

const { INTEGER } = require("sequelize");
const db = require("../../models");
const User = db.users;

const { parse, stringify } = require('./../../../node_modules/flatted/cjs');

class Graph {

    all_nodes = [];
    connected_nodes = [{ /*SOURCE: new Node(), VALUES: []*/ }];


    selected_lowest_child;
    isCreated = false;
    isSetted = false;
    constructor() {
        this.isCreated = true;
        this.isSetted = false;
    }

    getGraph() {
        return this;
    }

    /*arrange_connected_nodes() {
        for (var ind = 0; ind < this.all_nodes.length; ind++) {
            var _source = this.all_nodes[ind];
            var _target = this.all_nodes[ind].getAdjacents();
            var connection = { SOURCE: _source, VALUE: _target };
            if ((_target.length > 0) || this.connected_nodes.indexOf(connection) >= 0) {
                this.connected_nodes.push(connection);
            }
        }
    }*/


    /*my_dfs(node, discovered = [], res = []) {
        var result = this.all_nodes[this.all_nodes.indexOf(node)];//get_node_from_graph(email);//result[0] - selected node, result[1] - all graph
        var nod = result;//result[1].all_nodes[result[0]];
        var targets = result.getAdjacents();//result[1].all_nodes[result[0]].getAdjacents();
        //var total_points = result.getAdjacents().length;
        discovered[nod] = true;
        for (let i = 0; i < targets.length; i++) {
            let w = targets[i];
            if (discovered[w]) {
                res.push(w);
                my_dfs(w, discovered, res).then();
            }
        }
        //for(var ind=0; ind<res.length; ind++){
        //  console.log(ind+". DFS element : "+res[ind].getUser().email);
        //}
        return res;
    }*/


    arrangeGraph() {
        for (var ind = 0; ind < this.all_nodes.length; ind++) {
            var source_ref_id = this.all_nodes[ind].getUser().ref_id;
            for (var go = 0; go < this.all_nodes.length; go++) {
                if (this.all_nodes[go].getUser().ref_id_for_point == source_ref_id) {
                    if (this.all_nodes[go].getUser().ref_id_for_real == source_ref_id) {
                        //true relationship
                        this.all_nodes[ind].addAdjacent(this.all_nodes[go]);
                        this.all_nodes[go].setParent(this.all_nodes[ind], true);
                    } else {
                        //false relationship
                        this.all_nodes[ind].addAdjacent(this.all_nodes[go]);
                        this.all_nodes[go].setParent(this.all_nodes[ind], false);
                    }
                } else if (this.all_nodes[go].getUser().ref_id_for_point == undefined || this.all_nodes[go].getUser().ref_id_for_point == null) {
                    //ilk eleman. DO NOTHING
                }
            }
        }
        this.selected_lowest_child = this.calculate_common_path(false);


        //this.calculate_point();

        //this.calculate_generation();
        //this.arrange_connected_nodes();
        this.isSetted = true;
    }


    //Outside class methods end


    addNode(node, isFirst) {

        if (this.all_nodes[this.all_nodes.indexOf(node)] == undefined) {
            this.all_nodes.push(node);
            
        }

        if (isFirst) {
            console.log("First place is working this time...");
            console.log("Node's ref_id_for_real... : " + node.getUser().ref_id_for_real);
            this.arrangeGraph();
            /*if (node.getUser().ref_id != "5UPMPGYK") {
                console.log("Selected : " + node.getUser().email);
                console.log("Parent : " + node.getParent().getUser().email);
            }*/
        } else {
            console.log("Second place is working this time...");
            this.selected_lowest_child = this.calculate_common_path(false);

            var real_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_real;

            console.log("NODE EKLENDİ....    :   "+this.all_nodes.length);
            //var real_ref_id =  node.getUser().ref_id_for_real;
            /*var point_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point;*/


            for (var i = 0; i < this.all_nodes.length; i++) {
                if (this.all_nodes[i].getUser().ref_id == real_ref_id) {
                    this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);
                    //node.setParent(this.all_nodes[i], true);
                    this.all_nodes[i].addAdjacent(node);

                    console.log("GGGSelected : " + node.getUser().email);
                    console.log("GGGParent : " + node.getParent().getUser().email);
                    break;
                }
                /*if (this.all_nodes[i].ref_id == point_ref_id) {
                    this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], false);
                    this.all_nodes[i].addAdjacent(node);
                    break;
                }*/
            }

            console.log("Node's ref_id_for_real... : " + node.getUser().ref_id_for_real);
            if (node.getUser().ref_id != "5UPMPGYK") {
                console.log("Selected : " + node.getUser().email);
                console.log("Parent : " + node.getParent().getUser().email);
            }



            if (node.hasRealParent == false && node.hasFakeParent == false) {
                this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[
                    this.all_nodes.indexOf(this.selected_lowest_child)], false);
                this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[
                    this.all_nodes.indexOf(node)]);

            }

        }

        //this.arrange_connected_nodes();

        this.isSetted = true;

    }




    getNodeById(id) {
        for (var i = 0; i < this.all_nodes.length; i++) {
            if (id == this.all_nodes[i].id) {
                return this.all_nodes[i];
            }
        }
    }


    //calculations...
    calculate_to_top(node) {//use this function after you add a connection
        var path = [];
        var visited_node = node;
        if (visited_node.getUser() != undefined || visited_node.getUser() != null) {
            while (visited_node.getUser() != undefined && visited_node.getUser() != null) {
                path.push(visited_node);
                visited_node = visited_node.parent_node;
                if (visited_node == undefined || visited_node == null) {
                    break;
                }
            }

            //logging
            /*for(var i=0; i<path.length; i++){
              console.log(i+". CALCULATED PATH ELEMENT : "+stringify(path[i].getUser().email));
            }*/


            return path;
        }
    }

    calculate_common_path(is_long) {
        var childeren = [];
        var temp_len = this.all_nodes.length;
        for (var i = 0; i < temp_len; i++) {
            if (this.all_nodes[i].is_a_parent == false) {
                childeren.push(this.all_nodes[i]);
                //logging -- success
                /*if(this.all_nodes[i].getUser().email=="deneme_26@hotmail.com"){
                  console.log("---------------------");
                  console.log("EKLENDİ!!!");
                  console.log("---------------------");
                }*/
            }
        }
        var pathes = [];
        for (var ind = 0; ind < childeren.length; ind++) {
            var _p = this.calculate_to_top(childeren[ind]);
            //console.log(ind+". CALCULATED PATH : "+stringify(_p));
            pathes.push(_p);
        }




        var min_len_p = 90000000000;
        var max_len_p = -1;
        var min_ind_p = -1;
        var max_ind_p = -1;
        for (var ind = 0; ind < pathes.length; ind++) {
            var _p = pathes[ind];
            if (_p == undefined || _p == null || _p.length == 0) {
                min_ind_p = -1;
                max_ind_p = -1;
            } else {
                if (_p.length <= min_len_p) {
                    min_len_p = _p.length;
                    min_ind_p = ind;
                }
                if (_p.length >= max_len_p) {
                    max_len_p = _p.length;
                    max_ind_p = ind;
                }
                this.selected_lowest_child = pathes[min_ind_p][0];
            }
        }
        //this.selected_lowest_child = pathes[min_ind_p][0];

        /*if (is_long) {
          return pathes[max_ind_p];
        } else {
          return pathes[min_ind_p];
        }*/
        return this.selected_lowest_child;
    }
}

res = {};
res.gr = Graph;
//res.gr_ob = new Graph();
module.exports = res;
