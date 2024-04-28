class Node {

    isAlone = false;
    parent_node = null;
    has_real_parent = false;
    is_referenced = false;
    is_a_parent = false;
    adjacents = [];
    value = null;
    generation = -1;
    is_ghost_mode_active = false;
    point = 0;
    user = null;


    static _id = -2;
    id;

    getID(){
        return this.id;
    }

    setUser(user) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    setGhostM(is_ghost) {
        this.is_ghost_mode_active = is_ghost;
    }

    isGhost() {
        return this.is_ghost_mode_active;
    }


    setParent(p_node, is_real) {
        this.parent_node = p_node;

        this.is_referenced = true;

        if (is_real) {
            this.has_real_parent = true;
        } else {
            this.has_real_parent = false;
        }


    }

    getParent() {
        return this.parent_node;
    }

    getObjectId() {
        return this.ob_id;
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

    getIsAParent(){
        return this.is_a_parent;
    }


    constructor() {
        Node._id = Node._id + 1;
        this.id = Node._id;
        this.generation = 0;
        this.is_referenced = false;
        this.has_real_parent = false;
        this.is_a_parent = false;
        this.is_ghost_mode_active = false;
        this.point = 0;
        this.isAlone = false;
        this.adjacents = []; // adjacency list
    }

    addAdjacent(node) {
        this.adjacents.push(node);
        this.is_a_parent = true;
    }

    removeAdjacent(node) {
        const index = this.adjacents.indexOf(node);
        if (index > -1) {
            this.adjacents.splice(index, 1);
            return node;
        }
        if(this.adjacents.length == 0){
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