const db = require("../models");
const { parse, stringify } = require('./../../node_modules/flatted/cjs');
const Graph = require("./graph/graph.js").gr;
const Node = require("./graph/node.js").no;

const MUsers = db.users;
const Op = db.Sequelize.Op;

class UsrState {

  constructor() { }




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
      for (const usr of users) {
        //if (!graph.isCreated) {
          var node_ = new Node();
          node_.setUser(usr);
          //if there is no user added into temp_node, push it
          var is_exist=false;
          for(const nod of graph.temp_nodes){
            if(nod.getUser().ref_id == node_.getUser().ref_id){
              is_exist = true;
            }
          }
          if(!is_exist){
            //graph.temp_nodes.push(node_);
            graph.addTempNode(node_);
          }


          //if(graph.temp_nodes[graph.temp_nodes.indexOf(next_node)])
          //graph.temp_nodes.push(node_);
        //}
      }
      console.log("LENGTH : "+stringify(graph.temp_nodes.length));
      //dizide her kullanıcının parent ini bulup set et

      for(var selected_ind=0; selected_ind<graph.temp_nodes.length; selected_ind++){
        for(var iter=selected_ind+1; iter<graph.temp_nodes.length; iter++){
          if(graph.temp_nodes[iter].getUser().ref_id_for_point == graph.temp_nodes[selected_ind].getUser().ref_id){
            if(graph.temp_nodes[iter].getUser().ref_id_for_real == graph.temp_nodes[selected_ind].getUser().ref_id){
              //true partnership
              graph.temp_nodes[iter].setParent(graph.temp_nodes[selected_ind], true);
            }else{
              //false partnership
              graph.temp_nodes[iter].setParent(graph.temp_nodes[selected_ind], false);
            }
          }
        }
      }

      /*for(const tmp_node in graph.temp_nodes){
        for(const next_node in graph.temp_nodes){
          if(next_node.getUser().ref_id_for_point == tmp_node.getUser().ref_id){
            if(next_node.getUser().ref_id_for_real == tmp_node.getUser().ref_id){
              //true partnership
              graph.temp_nodes[graph.temp_nodes.indexOf(next_node)].setParent(graph.temp_nodes[graph.temp_nodes.indexOf(tmp_node)], true);
            }else{
              //false partnership
              graph.temp_nodes[graph.temp_nodes.indexOf(next_node)].setParent(graph.temp_nodes[graph.temp_nodes.indexOf(tmp_node)], false);
            }
          }
        }
      }*/



      /*for (const usr of users) {
        //if(!graph.isCreated){
        var node_ = new Node();
        node_.setUser(usr);
        var parent_user = await MUsers.findOne({ where: { ref_id: usr.ref_id_for_point } });
        var node_parent;
        var isParentInside = false;
        for (const node_temp of graph.temp_nodes) {
          if (node_temp.getUser() == parent_user) {
            node_parent = node_temp;
            isParentInside = true;
          }
        }
        if (!isParentInside) {
          node_parent = new Node();
        }
        if (graph.temp_nodes[graph.temp_nodes.indexOf(node_)] == undefined) {
          node_parent.setUser(parent_user);
          graph.addTempNode(node_);
        }
        graph.temp_nodes[graph.temp_nodes.indexOf(node_)].setParent(graph.temp_nodes[graph.temp_nodes.indexOf(node_parent)], true);//true-false bu aşamada önemi yok. sonradan ayarlanıyor...
      //}
    }*/
      if (graph.temp_nodes.length > 0 || graph.all_nodes.length > 0) {
        resolve(graph);
      } else {
        reject("Graph couldn't be initialized!");
      }

    });
    return promise_initialized_graph;
  }

  async updateNodePointsAndGenerationsOnDB(graph) {
    for (const node of graph.all_nodes) {
      var usr_id = graph.all_nodes[graph.all_nodes.indexOf(node)].getUser().id;
      var _point = graph.all_nodes[graph.all_nodes.indexOf(node)].point;
      var _generation = graph.all_nodes[graph.all_nodes.indexOf(node)].generation;
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
    if (!graph.all_nodes[graph.all_nodes.indexOf(node)].isAlone) {
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
      gr.setGraph();
      gr.arrangeGraph();
      return gr;
    });
    return graa;
  }

  /*async initGraph() {
    const graa = await this.getAllUsers().then(async (all_users) => {
      const graph = await this.mainAll();
      const gr = await this._initial_nodes(graph, all_users).then();
      gr.setGraph();
      gr.arrangeGraph();
      return gr;
    });
    return graa;
  }*/
}

res_a = {};
res_a.usr_state = UsrState;
res_a.usr_state_ob = new UsrState();
module.exports = res_a;

