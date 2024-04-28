const db = require("../models");
const { parse, stringify } = require('./../../node_modules/flatted/cjs');
const Graph = require("./graph/graph.js").gr;
const Node = require("./graph/node.js").no;

const MUsers = db.users;
const Op = db.Sequelize.Op;

class UsrState {
  graph;
  Q;
  constructor() {
    //this.graph = new Graph();
    this.Q = require("q");
  }

  async initGraph() {
    this.graph = new Graph();
    var all_users = await this.getAllUsersFromDB().finally(function (result) { });
    await this.setUsers(this.graph, all_users);
    return this.graph;
  }


  async getAllUsersFromDB() {
    let promise = new Promise(async function (resolve, reject) {
      const all_users = await MUsers.findAll();
      //var res=[];
      if (all_users.length > 0) {
        //res.push(all_users);
        //res.push(graph);
        resolve(all_users);
      }
      else {
        reject("Users can't be achieved from database!");
      }
    });
    return promise;
  }

  async setUsers(graph, users) {
    //console.log("Length of Users : "+users.length);
    for (var ind = 0; ind < users.length; ind++) {
      //for (const usr of users) {
      //if (!graph.isCreated) {
      var node_ = new Node();
      node_.setUser(users[ind]);
      //if there is no user added into temp_node, push it
      var is_exist = false;
      for (const nod of graph.all_nodes) {
        if (nod.getUser().ref_id == node_.getUser().ref_id) {
          is_exist = true;
        }
      }
      if (!is_exist) {
        //graph.temp_nodes.push(node_);
        //console.log("Length of Users : "+users.length);
        //console.log("Length of Nodes : "+graph.all_nodes.length);
        graph.addNode(node_, true);
      }

    }
    await this.updatePointsOnDB(graph);
  }

  async updatePointsOnDB(graph) {
    for (const node of graph.all_nodes) {
      var usr_id = node.getUser().id;
      var _point = node.point;
      var _generation = node.generation;
      await MUsers.update({
        point: _point,
        generation: _generation,
      }, {
        where: {
          id: usr_id
        }
      });
    }
    return graph;
  }

  async updatePointsOnDBwithMember(node) {
    var isFirst=false;
    var real_gen=0;
    for (var top of node.getTopPath()) {
      var usr_id = top.getUser().id;
      var _point = top.point;
      var _generation = top.generation;
      if(isFirst==false){
        real_gen = _generation + 1;
        isFirst = true;
      }
      await MUsers.update({
        point: _point,
        generation: _generation,
      }, {
        where: {
          id: usr_id
        }
      });
    }
    await MUsers.update({ generation: real_gen }, {
      where: {
           ref_id: node.getUser().ref_id 
      }
    });
  }

  //other functions to update user info on db
  async updateUserOnly(old_user_node, updated_user_node) {
    var old_user = old_user_node.getUser();
    var new_user = updated_user_node.getUser();

    old_user_node.setUser(new_user);

    await MUsers.update({
      name: new_user.name,
      surname: new_user.surname,
      email: new_user.email,
      pass: new_user.pass,
      photo: new_user.photo,
      ref_id: new_user.ref_id,
      ref_id_for_real: new_user.ref_id_for_real,
      ref_id_for_point: new_user.ref_id_for_point,
      ref_id_for_link: new_user.ref_id_for_link,
      yetki: new_user.yetki,
      phone: new_user.phone,
      birth_day: new_user.birth_day
    }, {
      where: {
        id: old_user.id
      }
    });

  }

  async getNode(node_user_id, graph) {
    var res = null;
    for (var ind = 0; ind < graph.all_nodes.length; ind++) {
      if (graph.all_nodes[ind].getUser().id == node_user_id) {
        res = graph.all_nodes[ind];
      }
    }
    return res;
  }

  async addUser(m_user, graph) {

    var node = new Node();
    //node.setUser(m_user);

    /*var isExist = false;
    for (const nod of graph.all_nodes) {
      var usr_id = nod.getUser().id;
      if (usr_id == node.getUser().id) {
        isExist = true;
      }
    }*/

    //if (!isExist) {
    const [user, created] = await MUsers.findOrCreate(
      {
        where: { email: m_user.email },
        defaults: {
          name: m_user.name,
          surname: m_user.surname,
          email: m_user.email,
          pass: m_user.pass,
          ref_id: m_user.ref_id,
          ref_id_for_real: m_user.ref_id_for_real,
          ref_id_for_point: m_user.ref_id_for_point,
          ref_id_for_link: m_user.ref_id_for_link,
          yetki: m_user.yetki,
          phone: m_user.phone,
          birth_day: m_user.birth_day
        }
      }
    )
    user.set({
      name: m_user.name,
      surname: m_user.surname,
      email: m_user.email,
      pass: m_user.pass,
      ref_id: m_user.ref_id,
      ref_id_for_link: m_user.ref_id_for_link,
      ref_id_for_real: m_user.ref_id_for_real,
      ref_id_for_point: m_user.ref_id_for_point,
      yetki: m_user.yetki,
      phone: m_user.phone,
      birth_day: m_user.birth_day
    });
    if (created) {
      //add to db and update graph if there was not any user like that before
      user.set({
        ref_id: m_user.ref_id,
        ref_id_for_link: m_user.ref_id_for_link,
        ref_id_for_real: m_user.ref_id_for_real,
        ref_id_for_point: m_user.ref_id_for_point,
      });
      //console.log("RES2: "+req.body.ref_id_for_real);
      node.setUser(user);

      if (node.hasRealParent) {
        graph.addNode(node, true);
        console.log("node.hasRealParent");
      } else if (node.hasFakeParent) {
        graph.addNode(node, false);
        console.log("node.hasFakeParent");
      } else {
        console.log("nelse");
        graph.addNode(node, false);
      }

      await user.save().then();

      //update generation

      

      this.updatePointsOnDBwithMember(node).then();

      //}


    }
  }




















  /*
  
  
  
  
  
    async initGraphByNew(){
      var all_users = this.getAllUsersFromDB().finally(function (result) {return result;});
      var result = await this._initial_nodes(this.graph, all_users)//MUsers.findOne({ where: { ref_id: user.ref_id_for_point } });
      return result;
    }
  
  
  
  
  
  
  
  
  
  
  
    //await this._initial_nodes(graph, all_users).then();
  
  
  
    initGraphByUsers() {
      //var param = this.graph;
      var all_users = this.getAllUsersFromDB().finally(function (result) {
        // here you can use the result of promiseB
        //console.log("all users: " + stringify(result));
  
        return result;
      });
  
      /*all_users.then(function(result){
        console.log("all users: " + stringify(result));
      });*//*
return all_users;
}

 











async mainAll() {
let promise = new Promise(async function (resolve, reject) {
//create a singleton graph instance

var graph = new Graph();

//var graph = Graph.getInstance();
var result = graph.isCreated;
if (result) {
resolve(graph);
}
else {
reject("Graph couldn't be created!");
}
});
return promise;
}

async getAllUsers() {
const all_users = await MUsers.findAll();
let promise = new Promise(async function (resolve, reject) {
if (all_users.length > 0) {
resolve(all_users);
}
else {
reject("Users can't be achieved from database!");
}
});
return promise;
}

async getParent(user) {
var result = await MUsers.findOne({ where: { ref_id: user.ref_id_for_point } });
let promise = new Promise(async function (resolve, reject) {
if (result.length > 0) {
resolve(result);
}
else {
reject("Users can't be achieved from database!");
}
});
return promise;
}

async getUserData(user) {
var result = await MUsers.findOne({ where: { ref_id: user.ref_id_for_point } });
let promise = new Promise(async function (resolve, reject) {
if (result.length > 0) {
resolve(result);
}
else {
reject("Users can't be achieved from database!");
}
});
return promise;
}

async _initial_nodes(graph, users) {
let promise_initialized_graph = new Promise(async function (resolve, reject) {
//her kullanıcıyı node yapıp diziye ekle
for(var ind=0; ind<users.length; ind++){
//for (const usr of users) {
//if (!graph.isCreated) {
var node_ = new Node();
node_.setUser(users[ind]);
//if there is no user added into temp_node, push it
var is_exist = false;
for (const nod of graph.all_nodes) {
if (nod.getUser().ref_id == node_.getUser().ref_id) {
is_exist = true;
}
}
if (!is_exist) {
//graph.temp_nodes.push(node_);
graph.addNode(node_, true);
}

}

/*for(var selected_ind=0; selected_ind<graph.all_nodes.length; selected_ind++){
for(var iter=selected_ind+1; iter<graph.all_nodes.length; iter++){
if(graph.all_nodes[iter].getUser().ref_id_for_point == graph.all_nodes[selected_ind].getUser().ref_id){
if(graph.all_nodes[iter].getUser().ref_id_for_real == graph.all_nodes[selected_ind].getUser().ref_id){
//true partnership
graph.all_nodes[iter].setParent(graph.all_nodes[selected_ind], true);
}else{
//false partnership
graph.temp_nodes[iter].setParent(graph.all_nodes[selected_ind], false);
}
}
}
}*//*
    
    if (graph.all_nodes.length > 0 || graph.all_nodes.length > 0) {
      resolve(graph);
    } else {
      reject("Graph couldn't be initialized!");
    }
    
    });
    return promise_initialized_graph;
    }
    
    async updateNodePointsAndGenerationsOnDB(graph) {
    for (const node of graph.all_nodes) {
    var usr_id = node.getUser().id;
    var _point = node.point;
    var _generation = node.generation;
    await MUsers.update({
      point: _point,
      generation: _generation,
    }, {
      where: {
        id: usr_id
      }
    });
    }
    return graph;
    }
    
    async updateNodeIDsOnDB(graph, node) {
    var ref_real = null;
    var ref_point = null;
    var usr_id = graph.all_nodes[graph.all_nodes.indexOf(node)].getUser().ref_id;
    if (!graph.all_nodes[graph.all_nodes.indexOf(node)].hasRealParent) {
    ref_real = node.getUser().ref_id_for_real; //graph.all_nodes[graph.all_nodes.indexOf(node.getParent())].getUser().ref_id;
    ref_point = ref_real;
    } else {
    ref_point = graph.all_nodes[graph.all_nodes.indexOf(node.getParent())].getUser().ref_id;
    }
    
    await MUsers.update({
    ref_id_for_point: ref_point,
    ref_id_for_real: ref_real,
    }, {
    where: {
      ref_id: usr_id
    }
    });
    return graph;
    }
    
    
    
    async initGraph() {
    const graa = await this.getAllUsers().then(async (all_users) => {
    const graph = await this.mainAll();
    const gr = await this._initial_nodes(graph, all_users).then();
    //gr.setGraph();
    //gr.arrangeGraph();
    return gr;
    });
    return graa;
    }
    */
}

res_a = {};
res_a.usr_state = UsrState;
res_a.usr_state_ob = new UsrState();
module.exports = res_a;

