const Node = require("./node.js").no;
const Edge = require("./edge.js").ed;

const { INTEGER } = require("sequelize");
const db = require("../../models");
const User = db.users;

const { parse, stringify } = require('./../../../node_modules/flatted/cjs');

class Graph {

  temp_nodes = [];

  all_nodes = [];

  //connected_nodes = [];
  connected_nodes = [{ /*SOURCE: new Node(), VALUES: []*/ }];


  selected_lowest_child;

  isCreated = false;
  isSetted = false;


  //choosen_node=null;


  constructor() {
    this.isCreated = true;
    this.isSetted = false;
  }

  //static instance = null;

  /*static getInstance() {
    if (Graph.instance == null) {
      Graph.instance = new Graph();
      Graph.instance.isCreated = true;
      Graph.instance.isSetted = false;
      Graph.instance.constructor = null; // Hiding the constructor
      return Graph.instance;
    } else {
      return Graph.instance;
    }
  }*/





  /*
    chooseNodeByNode(node){
      this.choosen_node = this.all_nodes[this.all_nodes.indexOf(node)];
      return this.choosen_node;
    }
  
    chooseNodeByRefId(ref_id){
      for(var ind = 0; ind<this.all_nodes.length; ind++){
        if(this.all_nodes[ind].getUser().ref_id == ref_id){
          this.choosen_node = this.all_nodes[ind];
          return this.all_nodes[ind];
        }
      }
    }
  
    getChosenOne(){
      if(this.choosen_node != -1){
        return this.choosen_node;
      }else{
        var text = "No selected node has been found on initialized graph!";
      }
    }
  
  */


  addTempNode(node) {
    this.temp_nodes.push(node);
    //console.log("LENGTH_REAL : " + this.temp_nodes.length);
  }

  clearTempNode() {
    var leng = this.temp_nodes.length;
    for (var ind = 0; ind < leng; ind++) {
      this.temp_nodes.slice(0, 1);
    }
  }

  getGraph() {
    return this;
  }

  setGraph() {

    var leng = this.temp_nodes.length;
    console.log("TEMP NODES LENGTH : " + leng);
    for (var ind = 0; ind < leng; ind++) {
      this.addNode(this.temp_nodes[ind]);

    }
    this.clearTempNode();

    return this;
  }

  updateNode(old_node, new_node) {
    this.all_nodes[this.all_nodes.indexOf(old_node)].setGhostM(new_node.isGhost());
    //...
    this.all_nodes[this.all_nodes.indexOf(old_node)].setPoint(new_node.getPoint());
    this.all_nodes[this.all_nodes.indexOf(old_node)].setParent(new_node.getParent());
    this.all_nodes[this.all_nodes.indexOf(old_node)].setValue(new_node.getValue());
    this.all_nodes[this.all_nodes.indexOf(old_node)].setAdjacents(new_node.getAdjacents());
    this.all_nodes[this.all_nodes.indexOf(old_node)].has_real_parent = new_node.has_real_parent;
    this.all_nodes[this.all_nodes.indexOf(old_node)].is_referenced = new_node.is_referenced;
    this.all_nodes[this.all_nodes.indexOf(old_node)].is_a_parent = new_node.is_a_parent;

    for (var t_node of Object.keys(this.connected_nodes)) {
      if (t_node.id == old_node.id) {
        t_node.setGhostM(new_node.isGhost());
        //...
        t_node.setPoint(new_node.getPoint());
        t_node.setParent(new_node.getParent());
        t_node.setValue(new_node.getValue());
        t_node.setAdjacents(new_node.getAdjacents());
        t_node.has_real_parent = new_node.has_real_parent;
        t_node.is_referenced = new_node.is_referenced;
        t_node.is_a_parent = new_node.is_a_parent;
      }
      for (var ind_child = 0; ind_child < t_node.length; ind_child++) {
        if (t_node[ind_child].id == old_node.id) {
          t_node[ind_child].setGhostM(new_node.isGhost());
          //...
          t_node[ind_child].setPoint(new_node.getPoint());
          t_node[ind_child].setParent(new_node.getParent());
          t_node[ind_child].setValue(new_node.getValue());
          t_node[ind_child].setAdjacents(new_node.getAdjacents());
          t_node[ind_child].has_real_parent = new_node.has_real_parent;
          t_node[ind_child].is_referenced = new_node.is_referenced;
          t_node[ind_child].is_a_parent = new_node.is_a_parent;
        }
      }



      /*if (node[1].id == old_node.id) {
        node[1].setGhostM(new_node.isGhost());
        //...
        node[1].setPoint(new_node.getPoint());
        node[1].setParent(new_node.getParent());
        node[1].setValue(new_node.getValue());
        node[1].setAdjacents(new_node.getAdjacents());
        node[1].has_real_parent = new_node.has_real_parent;
        node[1].is_referenced = new_node.is_referenced;
        node[1].is_a_parent = new_node.is_a_parent;
      }*/
    }
    //if it is also selected_lowest_child
    if (this.selected_lowest_child != undefined) {
      if (old_node.id == this.selected_lowest_child.id) {
        this.selected_lowest_child.setGhostM(new_node.isGhost());
        //...
        this.selected_lowest_child.setPoint(new_node.getPoint());
        this.selected_lowest_child.setParent(new_node.getParent());
        this.selected_lowest_child.setValue(new_node.getValue());
        this.selected_lowest_child.setAdjacents(new_node.getAdjacents());
        this.selected_lowest_child.has_real_parent = new_node.has_real_parent;
        this.selected_lowest_child.is_referenced = new_node.is_referenced;
        this.selected_lowest_child.is_a_parent = new_node.is_a_parent;
      }
    }
  }

  setGhostMode(node, is_ghost) {
    this.all_nodes[this.all_nodes.indexOf(node)].setGhostM(is_ghost);
    //update connected_nodes
    for (var t_node of Object.keys(this.connected_nodes)) {
      if (t_node.id == node.id) {
        t_node.setGhostM(is_ghost);
      }
      for (var ind_child = 0; ind_child < t_node.length; ind_child++) {
        if (t_node[ind_child].id == node.id) {
          t_node[ind_child].setGhostM(is_ghost);
        }
      }

    }
    //if it is also the selected_lowest_child
    if (this.selected_lowest_child != undefined) {
      if (node.id == this.selected_lowest_child.id) {
        this.selected_lowest_child.setGhostM(is_ghost);
      }
    }
  }

  arrange_connected_nodes() {
    for (var ind = 0; ind < this.all_nodes.length; ind++) {
      var _source = this.all_nodes[ind];
      var _target = this.all_nodes[ind].getAdjacents();
      var connection = { SOURCE: _source, VALUE: _target };
      if ((_target.length > 0) || this.connected_nodes.indexOf(connection) >= 0) {
        this.connected_nodes.push(connection);
      }
    }

    //show results
    /*var index = 0;
    for (var connect of this.connected_nodes) {
      if (connect.SOURCE != undefined) {
        console.log(index + ". USER EMAIL : " + connect.SOURCE.user.email);
        var ind = 0;
        for (var val of connect.VALUE) {
          console.log(ind + ". CHILD EMAIL : " + val.user.email);
          ind = ind + 1;
        }
      }
      index = index + 1;
    }*/


  }


  //Outside class methods...


  addNodeToGraph(node) {
    this.addNode(node);



/*
    //this.selected_lowest_child = this.calculate_common_path(false);
    var real_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_real;
    //var point_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point;

    var isNodeAddedAsReal = false;

    for (var i = 0; i < this.all_nodes.length; i++) {
      if (real_ref_id != null && real_ref_id != undefined) {//seçili node için gerçek bir parent tanımlanmışsa
        if (this.all_nodes[i].ref_id == real_ref_id) {//seçili node un ilgili parent i bulunur
          this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);//ilgili node, parent e çocuk olarak eklenir
          this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);//ilgili node un parent i gerçektir
          this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point = ref_real_id; //ilgili node un ref_id_for point i set edilir.
          var isNodeAddedAsReal = true;
        }
      } else if ((real_ref_id == null || real_ref_id == undefined)) {//seçili node için gerçek bir parent tanımlanmamışsa
        if (!isNodeAddedAsReal) {//isNodeAsReal değerine hiç dokunulmadıkça çalışmayacak şekilde ayarlı olarak isNodeAddedAsReal false yapma 
          isNodeAddedAsReal = false;
        }
      } else {//arada bir durum oluşmuşsa...
        if (!isNodeAddedAsReal) {//isNodeAsReal değerine hiç dokunulmadıkça çalışmayacak şekilde ayarlı olarak isNodeAddedAsReal false yapma 
          isNodeAddedAsReal = false;
        }
      }
    }
    //herhangi bir şekilde gerçek bir parent bulunup uygun bir şekilde set edilememişse...
    if (!isNodeAddedAsReal) {
      this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
      this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)], false);
      this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point = this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].getUser().ref_id;
    }*/



    //if (this.all_nodes[i].ref_id == point_ref_id) {//Eğer eklenen node a uygun bir point ref bulunursa

    //isNodeAddedAsCalculated = true;

    /*if ((point_ref_id == real_ref_id) && (!((point_ref_id == null) || (real_ref_id == null))) && (this.all_nodes[i].ref_id != "5UPMPGYK")) {
      this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
      this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);
    }
    else if ((point_ref_id != null) && (point_ref_id != real_ref_id) && (this.all_nodes[i].ref_id != "5UPMPGYK")) {
      this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
      this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], false);
    }

    else if(this.all_nodes[i].ref_id=="5UPMPGYK"){
      if (point_ref_id == real_ref_id){
        //true partnership
        this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
        this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);
      }else{
        //false partnership
        this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
        this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], false);
      }
    }
    else {
      this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
      this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)], false);
    }
  }*/

    //}




    /*if(isNodeAddedAsCalculated == false){//uygun parent dizide bulunamadı demektir
      this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
      this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)], false);
    }*/



    //this.selected_lowest_child = this.calculate_common_path(false);
    //update node ids in db
    //...

    /*this.calculate_point(this.all_nodes[this.all_nodes.indexOf(node)]);
    this.calculate_generation();
    this.arrange_connected_nodes();*/

    //this.selected_lowest_child = this.calculate_common_path(false);
    
  }





  updateNodeOnGraph(old_node, new_node) {
    this.updateNode(old_node, new_node);
    //update node on DB
    //...
  }

  calculate_point(node) {
    var _node = this.all_nodes[this.all_nodes.indexOf(node)];
    while (_node.getParent() != undefined || _node.getParent() != null) {
      _node = _node.getParent();
      this.all_nodes[this.all_nodes.indexOf(_node)].point = this.all_nodes[this.all_nodes.indexOf(_node)].point + 1;
      //update node's point on DB
      //...

    }
  }

  calculate_generation() {
    for (var i = 0; i < this.all_nodes.length; i++) {
      if (this.all_nodes[i].getParent() != undefined || this.all_nodes[i].getParent() != null) {
        this.all_nodes[i].generation = this.all_nodes[i].getParent().generation + 1;
      }
      //update node's generation DB
      //...
    }
  }

  arrangeGraph() {

    for(var ind=0; ind<this.all_nodes.length; ind++){
      var source_ref_id = this.all_nodes[ind].getUser().ref_id;
      for(var go=0 ; go<this.all_nodes.length; go++){
        if(this.all_nodes[go].getUser().ref_id_for_point == source_ref_id){
          if(this.all_nodes[go].getUser().ref_id_for_real == source_ref_id){
            //true relationship
            this.all_nodes[ind].addAdjacent(this.all_nodes[go]);
            this.all_nodes[go].setParent(this.all_nodes[ind], true);
          }else{
            //false relationship
            this.all_nodes[ind].addAdjacent(this.all_nodes[go]);
            this.all_nodes[go].setParent(this.all_nodes[ind], false);
          }
        }else if(this.all_nodes[go].getUser().ref_id_for_point == undefined || this.all_nodes[go].getUser().ref_id_for_point==null){
          //ilk eleman. DO NOTHING
        }
      }
    }




    /*for (var i = 0; i < this.all_nodes.length; i++) {
      var ref_id = this.all_nodes[i].getUser().ref_id;
      for (var j = i + 1; j < this.all_nodes.length; j++) {
        var ref_point_id = this.all_nodes[j].getUser().ref_id_for_point;
        var ref_real_id = this.all_nodes[j].getUser().ref_id_for_real;
        if (ref_point_id == ref_id && ref_id != "5UPMPGYK") {
          //this.all_nodes[i].addAdjacent(this.all_nodes[j]);
          if (ref_point_id == ref_real_id && (!((ref_point_id == null) || (ref_real_id == null)))) {
            //if (ref_id != "5UPMPGYK") {
            this.all_nodes[i].addAdjacent(this.all_nodes[j]);
            this.all_nodes[j].setParent(this.all_nodes[i], true);
            //}
          }
          else if ((ref_point_id != null) && (ref_point_id != ref_real_id)) {
            //if (ref_id != "5UPMPGYK") {
            this.all_nodes[i].addAdjacent(this.all_nodes[j]);
            this.all_nodes[j].setParent(this.all_nodes[i], false);
            //}
          }

          /*else {
            //this.selected_lowest_child = this.calculate_common_path(false);
            this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[j]);
            //this.selected_lowest_child.addAdjacent(this.all_nodes[j]);
            this.all_nodes[j].setParent(this.all_nodes[i], false);
          }*/
        /*} else if (ref_point_id == ref_id && ref_id == "5UPMPGYK") {
          if (ref_real_id == ref_point_id) {
            //true partnership
            this.all_nodes[i].addAdjacent(this.all_nodes[j]);
            this.all_nodes[j].setParent(this.all_nodes[i], true);
          } else {
            //false partnership
            this.all_nodes[i].addAdjacent(this.all_nodes[j]);
            this.all_nodes[j].setParent(this.all_nodes[i], false);
          }

        }

      }
    }*/
    this.selected_lowest_child = this.calculate_common_path(false);
    for (var i = 0; i < this.all_nodes.length; i++) {
      this.calculate_point(this.all_nodes[i]);
    }
    //this.calculate_generation();
    this.arrange_connected_nodes();

    this.isSetted = true;
  }


  //Outside class methods end


  addNode(node) {
    if (node.getUser().ref_id != "5UPMPGYK") {//ilk eleman olmadıkça path hesabı yapma
      this.selected_lowest_child = this.calculate_common_path(false);
      //console.log("LOWEST CHILD'S EMAIL : " + this.selected_lowest_child.getUser().email);
    }
    else {
      node.has_real_parent = false;
    }

    if (this.all_nodes[this.all_nodes.indexOf(node)] == undefined) {
      this.all_nodes.push(node);
    }

    if (node.getUser().ref_id != "5UPMPGYK") {//eklenen eleman ilk eleman değilse...
      var real_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_real;
      var point_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point;
      
      var isNodeAddedAsReal = false;
      var isNodeAddedAsFalse = false;

      for (var i = 0; i < this.all_nodes.length; i++) {
        if (real_ref_id != null && real_ref_id != undefined) {
          //ilk eleman değil ve gerçek bir referans id si var
          if(this.all_nodes[i].ref_id == real_ref_id){
            //gerçek parent bulundu...
            this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);
            this.all_nodes[i].addAdjacent(node);
            isNodeAddedAsReal = true
          }
        }
        if(real_ref_id == null && point_ref_id != undefined){//ilk eleman değil ve sahte bir parent i var
          if(this.all_nodes[i].ref_id == point_ref_id){
            //sahte parent bulundu
            this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], false);
            this.all_nodes[i].addAdjacent(node);
            isNodeAddedAsFalse = true
          }
        }
      }

      //hiç parent bulunmadı
      if(isNodeAddedAsFalse == false && isNodeAddedAsReal == false){
        //en kısa eleman al...
        this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)], false);
        this.all_nodes[this.all_nodes.indexOf(this.selected_lowest_child)].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
        //this.selected_lowest_child[i].addAdjacent(node);
      }



    }

    //for (var i = 0; i < this.all_nodes.length; i++) {
    //this.calculate_point(this.all_nodes[this.all_nodes.indexOf(node)]);
    //}
    this.calculate_generation();
    this.arrange_connected_nodes();

    this.isSetted = true;

  }
  










/*

      var real_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_real;
      var point_ref_id = this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point;
      console.log("REAL PAIRS ONE -> node: "+real_ref_id);

      var isNodeAddedAsReal = false;

      for (var i = 0; i < this.all_nodes.length; i++) {
        
        if (real_ref_id != null && real_ref_id != undefined) {//seçili node için gerçek bir parent tanımlanmışsa
          if (this.all_nodes[i].ref_id == real_ref_id) {//seçili node un ilgili parent i bulunur
            this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);//ilgili node, parent e çocuk olarak eklenir
            this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], true);//ilgili node un parent i gerçektir
            this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point = this.all_nodes[i].ref_id; //ilgili node un ref_id_for point i set edilir.
            var isNodeAddedAsReal = true;
            console.log("REAL PAIRS-> node: "+node.ref_id+"   /////   "+"parent: "+this.all_nodes[i].ref_id);
          }
        } else if ((real_ref_id == null || real_ref_id == undefined)) {//seçili node için gerçek bir parent tanımlanmamışsa
          if (!isNodeAddedAsReal) {//isNodeAsReal değerine hiç dokunulmadıkça çalışmayacak şekilde ayarlı olarak isNodeAddedAsReal false yapma 
            isNodeAddedAsReal = false;
          }
          this.all_nodes[i].addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);//ilgili node, parent e çocuk olarak eklenir
          this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.all_nodes[i], false);//ilgili node un parent i gerçektir
          this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point = this.all_nodes[i].ref_id; //ilgili node un ref_id_for point i set edilir.

        } else {//arada bir durum oluşmuşsa...
          if (!isNodeAddedAsReal) {//isNodeAsReal değerine hiç dokunulmadıkça çalışmayacak şekilde ayarlı olarak isNodeAddedAsReal false yapma 
            isNodeAddedAsReal = false;
          }
        }
      }
      //herhangi bir şekilde gerçek bir parent bulunup uygun bir şekilde set edilememişse...
      if (!isNodeAddedAsReal) {
        this.selected_lowest_child.addAdjacent(this.all_nodes[this.all_nodes.indexOf(node)]);
        this.all_nodes[this.all_nodes.indexOf(node)].setParent(this.selected_lowest_child, false);
        this.all_nodes[this.all_nodes.indexOf(node)].getUser().ref_id_for_point = this.selected_lowest_child.getUser().ref_id;
      }
*/
      



   // }









    /*if (!node.isAlone) {//gerçek parent var ise
      //console.log("Related Parent : "+stringify(this.temp_nodes[this.temp_nodes.indexOf(node.parent_node)]));
      var _pNode = this.temp_nodes[this.temp_nodes.indexOf(node.getParent())];
      //console.log("Source BASE : "+stringify(_pNode));
      this.addConnection(_pNode, node, true);

    } else {//gerçek parent yok ise
      node.has_real_parent = false;
      //find the child that has the lowest generation and add a connection to it (by not forgetting to set has_real_parent false)
      if (node.id != 0) {
        if ((this.selected_lowest_child != null || this.selected_lowest_child != undefined)) {
          if (this.selected_lowest_child.id != node.id) {
            //this.addConnection(this.selected_lowest_child, node, false, true);
            this.addConnection(this.selected_lowest_child, node, false);
          }
        }
      }
    }*/
 // }

  /*
  addConnection(source, target, is_real_connection) {
    var _source = this.all_nodes[this.all_nodes.indexOf(source)];
    var _target = this.all_nodes[this.all_nodes.indexOf(target)];
    if (this.all_nodes[this.all_nodes.indexOf(_source)] != undefined) {
      if (this.all_nodes[this.all_nodes.indexOf(_target)].id != this.all_nodes[this.all_nodes.indexOf(_source)].id) {
        _target.setParent(_source, is_real_connection);
      }
    }
    if (_source != undefined) {
      _source.is_a_parent = true;
      _source.addAdjacent(_target);

      var temp_source = this.all_nodes[this.all_nodes.indexOf(_source)];
      var temp_targets = this.all_nodes[this.all_nodes.indexOf(_source)].getAdjacents();
      var connection = { SOURCE: temp_source, VALUE: temp_targets };
      if ((temp_targets.length > 0) && this.connected_nodes.indexOf(connection) >= 0) {
        this.connected_nodes.push(connection);
      }
    }
*/




  //myDict[subCat].push(x)

  //this.connected_nodes[source]=_source;
  //this.connected_nodes[targets].push(_target);


  /*for (const key of Object.keys(this.connected_nodes)) {
    console.log(stringify(key));
  };*/




  //var val = [_source, _target];
  //this.connected_nodes.push(val);

  //var source = this.all_nodes[ind];
  //var target = _source.getAdjacents();


















  //this.connected_nodes.source = _source;
  //this.connected_nodes.targets.push(_target);// = _source;





  //var connection = {}

  //this.connected_nodes.push(connection);//.source = _source;




  //console.log(obj.hasOwnProperty("key")); // true


  //console.log(!("key" in obj)); // true if "key" doesn't exist in object

  /*if(!(this.connected_nodes.hasOwnProperty(_source))){
    values = [];
  }
  Object.values(this.connected_nodes._source) = 

  this.connected_nodes._source=this.connected_nodes._source.push(_target);// = [];


  console.log(this.connected_nodes._source);*/



  /*  .push(_target);
    blah.key3 = value3; 
*/



  /*
      this.all_nodes[this.all_nodes.indexOf(source)] = _source;
      this.all_nodes[this.all_nodes.indexOf(target)] = _target;
    }*/

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
