class Node {

    isAlone = true;
    isParent = false;
    hasRealParent = false;
    hasFakeParent = false;
    isGhost = false;

    parent_node = null;
    adjacents = [];
    value = null;
    user = null;

    generation = -1;
    point = 0;

    static _id = -2;
    id;

    constructor() {
        Node._id = Node._id + 1;
        this.id = Node._id;
        this.generation = 0;
        this.hasRealParent = false;
        this.hasFakeParent = false;
        this.isParent = false;
        this.isGhost = false;
        this.point = 0;
        this.isAlone = true;
    }

    getID() {
        return this.id;
    }

    setUser(user) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    setGhost(is_ghost) {
        this.isGhost = is_ghost;
    }

    isGhost() {
        return this.isGhost;
    }


    setParent(p_node, is_real) {

        //if(this.parent_node == null || this.parent_node == undefined){
            if (!this.hasFakeParent && !this.hasRealParent) {
                this.parent_node = p_node;
                this.parent_node.isParent = true;
                this.isAlone = false;
                if (is_real) {
                    this.hasRealParent = true;
                    this.hasFakeParent = false;
                } else {
                    this.hasRealParent = false;
                    this.hasFakeParent = true;
                }
                this.generation = p_node.generation + 1;
                this.calculatePoint();
            }
        //}

        
    }

    calculatePoint() {
        var tops = this.getTopPath();
        for (var ind = 0; ind < tops.length; ind++) {
            tops[ind].point = tops[ind].point + 1;
        }
        /*var _node = node;
        if (_node != null && _node != undefined) {
            if ((_node.hasRealParent || _node.hasFakeParent)) {
                _node.getParent().point = _node.getParent().point + 1;
                this.calculatePoint(_node.getParent());
            }
        }*/
    }

    getTopPath() {
        var path = [];
        path = this.getAbovePath(this, path);
        return path;
    }
    getAllSubMembers() {
        var path = [];
        path = this.my_dfs(this);
        return path;
    }



    getAbovePath(node, above_path = []) {
        if (node.hasRealParent || node.hasFakeParent) {
            node = node.getParent();
            above_path.push(node);
            this.getAbovePath(node, above_path);
        }
        return above_path;
    }


    my_dfs(node, discovered = [], res = []) {
        var result = node;//this.all_nodes[this.all_nodes.indexOf(node)];//get_node_from_graph(email);//result[0] - selected node, result[1] - all graph
        var nod = result;//result[1].all_nodes[result[0]];
        var targets = result.getAdjacents();//result[1].all_nodes[result[0]].getAdjacents();
        //var total_points = result.getAdjacents().length;
        discovered[nod] = true;
        for (let i = 0; i < targets.length; i++) {
            let w = targets[i];
            if (discovered[w]) {
                if (!(this.isExistOnArray(w, res))) {
                    res.push(w);
                }
                this.my_dfs(w, discovered, res);
            }
        }
        //for(var ind=0; ind<res.length; ind++){
        //  console.log(ind+". DFS element : "+res[ind].getUser().email);
        //}
        return res;
    }

    isExistOnArray(element, array) {
        if (array.length > 0) {
            for (var ind = 0; ind < array.length; ind++) {
                if (element.id == array[ind].id) {
                    return true;
                }
            }
        }
        return false;
    }










    //updates the node (which is this...) in a given array (an_array)
    updateArrray(an_array) {
        for (var ind = 0; ind < an_array.length; ind++) {
            if (an_array[ind].id == this.id) {
                an_array[ind] = this;
            }
        }
        return an_array;
    }







    getParent() {
        return this.parent_node;
    }

    setPoint(point) {
        this.point = point;
    }

    getPoint() {
        return this.point;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    getValue() {
        return this.value;
    }

    getIsAParent() {
        return this.isParent;
    }




    addAdjacent(node) {
        var isExist = this.isExistOnArray(node, this.adjacents);
        if (!isExist) {
            this.adjacents.push(node);
            this.is_a_parent = true;
        }
        /*this.adjacents.push(node);
        this.is_a_parent = true;*/
    }

    removeAdjacent(node) {
        const index = this.adjacents.indexOf(node);
        if (index > -1) {
            this.adjacents.splice(index, 1);
            return node;
        }
        if (this.adjacents.length == 0) {
            this.is_a_parent = false;
        }
    }

    getAdjacents() {
        return this.adjacents;
    }

    setAdjacents(adjacents) {
        //tek tek tüm komşulukları sil
        for (var ind = 0; ind < this.adjacents.length; ind++) {
            this.adjacents.splice(ind, 1);
        }
        //parametreden alınan komşulukları push et
        for (var ind = 0; ind < adjacents.length; ind++) {
            this.adjacents.push(adjacents[ind]);
        }
        this.is_a_parent = true;
    }

    getAdjacentLength() {
        return this.adjacents.length;
    }

    isAdjacent(node) {
        return this.adjacents.indexOf(node) > -1;
    }

    hasAdjacent() {
        var len = this.adjacents.length;
        if (len > 0) {
            return true;
        } else {
            return false;
        }
    }


}



res_two = {};
res_two.no = Node;
res_two.no_ob = new Node();
//module.exports = EngineSwitchboard;
//res.bfs = Graph;
//res.dfs = dfs;

//const gr = new Graph();
//console.log("Kayıt : 5");
module.exports = res_two;




/*const no = Node;

console.log("Kayıt : 6");

module.exports = no;*/