const Node = require("../data/graph/node.js").no;
const db = require("../models");
const gr = require("../data/");
const { parse, stringify } = require('./../../node_modules/flatted/cjs');
const UsrState = require("../data/graph_users.js").usr_state;
const User = db.users;

const UserClass = require("../models/classes/UserClass.js").usr_ob_class;
const MailSenderClass = require("../models/classes/MailSenderClass.js").msender_ob_class;

const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { Console } = require("console");


//Constants
var user_state = new UsrState();
const REF_ID_CHAR_LENGTH = 8;
const LINK_ID_CHAR_LENGTH = 9;

//Execute init functions
initialize_graph_from_db();

//Helper functions...
function create_random_string() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
  var charactersLength = characters.length;
  for (var i = 0; i < REF_ID_CHAR_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function create_random_string_withoutnums() {
  var result = '';
  var characters = 'AaBbCcDdEeFfGgHhIiJjKkLMmNnOoPpQqRrSsTtUuVvWwXxYyZz23456789';
  var charactersLength = characters.length;
  for (var i = 0; i < LINK_ID_CHAR_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}






async function DFSgetRelated(email, discovered = [], res = []) {
  var result = await get_node_from_graph(email);//result[0] - selected node, result[1] - all graph
  var nod = result[0];//result[1].all_nodes[result[0]];
  var targets = result[0].getAdjacents();//result[1].all_nodes[result[0]].getAdjacents();
  discovered[nod] = true;
  for (let i = 0; i < targets.length; i++) {
    let w = targets[i];
    if (discovered[w]) {
      res.push(w);
      await DFSgetRelated(w.getUser().email, discovered, res).then();
    }
  }
  //for(var ind=0; ind<res.length; ind++){
  //  console.log(ind+". DFS element : "+res[ind].getUser().email);
  //}
  return res;
}




/*async function dfs(node_init = await user_state.getGraph().all_nodes[await user_state.getGraph().all_nodes.indexOf(node_init)], 
                      discovered = [], result=[]) {
  let childeren = node_init.getAdjacents();
  discovered[node_init] = true;
  for (let i = 0; i < childeren.length; i++){
      let w = childeren[i];
      if (!discovered[w]) {
          result.push(w);
          this.dfs(w, discovered, result);
      }
  }
  //return discovered[goal] || false;
  return result;
}*/

async function generateUniqueLinkID() {
  const ref_ids = await User.findAll({
    attributes: ['ref_id_for_link']
  });
  var is_different = false;
  var temp_ref_id = "AAA";
  while (!is_different) {
    is_persistance = false;
    temp_ref_id = create_random_string_withoutnums();
    for (index = 0; index < ref_ids.length; index++) {
      if (ref_ids[index].get('ref_id_for_link') == temp_ref_id) {
        is_different = false;
        is_persistance = true;
      } else {
        if (is_persistance == false && index == ref_ids.length - 1) {
          is_different = true;
        }
      }
    }
  }
  return temp_ref_id;
}


async function generateUniqueID() {
  const ref_ids = await User.findAll({
    attributes: ['ref_id']
  });
  var is_different = false;
  var temp_ref_id = "AAA";
  while (!is_different) {
    is_persistance = false;
    temp_ref_id = create_random_string();
    for (index = 0; index < ref_ids.length; index++) {
      if (ref_ids[index].get('ref_id') == temp_ref_id) {
        is_different = false;
        is_persistance = true;
      } else {
        if (is_persistance == false && index == ref_ids.length - 1) {
          is_different = true;
        }
      }
    }
  }
  return temp_ref_id;
}


//signup-login activity functions...
//managing login function
exports.login = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var email = req.body.email;
  var pass = req.body.pass;
  var user = null;
  var response = null;
  //değişkenleri set et
  //...
  var is_a_member = await isAMember(email).then();
  if (is_a_member) {
    var is_authorized = await check_creditentials(email, pass).then();
    if (is_authorized) {
      var tmp_user = await get_node_from_graph(email).then();
      user = tmp_user[0];//tmp_user[1].all_nodes[tmp_user[0]]
      response = await get_related_nodes_from_graph(email).then();
      var childrens = [];
      for (var child of response) {
        var my_user = new UserClass();
        my_user.name = child.getUser().name;
        my_user.surname = child.getUser().surname;
        my_user.email = child.getUser().email;
        my_user.ref_id = child.getUser().ref_id;
        my_user.ref_id_for_point = child.getUser().ref_id_for_point;
        my_user.ref_id_for_real = child.getUser().ref_id_for_real;
        my_user.ref_id_for_link = crypto.createHash('sha256').update(child.getUser().ref_id_for_link).digest('hex'),
          my_user.isGhost = child.getUser().isGhost;
        my_user.point = child.getPoint();
        my_user.rank = child.generation;
        /* 
        name = "";
    surname = "";
    email="";
    pass="";
    ref_id="";
    ref_id_for_real="";
    yetki="";
    phone="";
    birth_day=null;
    isGhost=0;
        */
        childrens.push(my_user);
      }
      res.status(200).send({
        message: "SUCCESSFUL",
        owner_name: JSON.stringify(user.getUser().name),
        owner_surname: JSON.stringify(user.getUser().surname),
        owner_email: JSON.stringify(user.getUser().email),
        owner_ref_id: JSON.stringify(user.getUser().ref_id),
        owner_ref_id_for_real: JSON.stringify(user.getUser().ref_id_for_real),
        owner_ref_id_for_point: JSON.stringify(user.getUser().ref_id_for_point),
        owner_ref_id_for_link: JSON.stringify(crypto.createHash('sha256').update(user.getUser().ref_id_for_link).digest('hex')),
        //owner_ref_id_for_link : JSON.stringify(user.getUser().ref_id_for_link),
        owner_isGhost: JSON.stringify(user.getUser().isGhost),
        owner_point: JSON.stringify(user.getPoint()),
        owner_rank: JSON.stringify(user.generation),
        childeren: JSON.stringify(childrens)
      });
    } else {
      res.status(200).send({
        message: "FORGOTTEN"
      });
    }
  } else {
    res.status(200).send({
      message: "NOTAMEMBER"
    });
  }
}

//managing signup function
exports.createOrGet = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var email = req.body.email;
  var user = null;
  var response = null;
  var is_verified = await isVerified(email).then();
  var is_a_member = await isAMember(email).then();
  console.log("1");
  if (is_a_member) {
    res.status(200).send({
      message: "ALREADYAMEMBER"
    });
  } else {
    console.log("2");
    if (/*is_verified*/true) {
      console.log("3");
      //complete registeration
      var result = await add_node_to_graph(req).then();
      if (result) {
        console.log("4");
        user = await get_node_from_graph(email).then();
        response = await get_related_nodes_from_graph(email).then();
        console.log("5");
        res.status(200).send({
          message: "SUCCESSFUL"//, owner: user, childeren: response
        });
        console.log("6");
      } else {
        console.log("7");
        res.status(200).send({
          message: "FAILED"
        });
      }
    } else {
      //send verifying required response and do the necessary parts of verification process
      res.status(200).send({
        message: "VERIFY"
      });
    }
  }
}


exports.signupWithParent = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  //app.use('/api/signup', signup_route);
  //req.headers.actual_user == user in get

  const ref_ids = await User.findAll({
    attributes: ['ref_id_for_link']
  });
  var choosen_ref_id_link = "NoNe";
  var key_string = req.params.ref_id_for_link;

  //ref_ids[index].get('ref_id')

  for (var ref_link_id of ref_ids) {
    var the_key = crypto.createHash('sha256').update(ref_link_id.get('ref_id_for_link')).digest('hex');
    if (the_key == key_string) {
      choosen_ref_id_link = ref_link_id.get('ref_id_for_link');
      console.log("RES : "+choosen_ref_id_link);
      var result_parent_user = await User.findOne({ where: { ref_id_for_link: choosen_ref_id_link } });
      res.status(200).send({
        message: "PARENTALFOUND", parent_id: result_parent_user.ref_id
      });
      
      

      /*req.body.name = JSON.parse(req.headers.actual_user).name;
      req.body.surname = req.headers.actual_user.surname;
      req.body.email = req.headers.actual_user.email;
      req.body.pass = req.headers.actual_user.pass;
      req.body.ref_id_for_real = result_parent_user.ref_id;
      req.body.yetki = req.headers.actual_user.yetki;
      req.body.phone = req.headers.actual_user.phone;
      req.body.birth_day = req.headers.actual_user.birth_day;
      this.post((req, res) => {
        this.createOrGet(req, res);
      });
      res.status(200).send({
        message: "PARENTALFOUND", parent_id: result_parent_user.ref_id
      });*/
      //      return;
    }
  }





}

//takes email from client as a parameter, build a mail and send it to the provided address
exports.sendVerificationMail= async (req,res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var user_mail = req.body.email.replace('"','').replace('"','');
  var user_m = await User.findOne({ where: { email: user_mail } });
  
  var plain_txt = user_m.ref_id+user_m.ref_id_for_point;
  var _link_pos = crypto.createHash('sha256').update(plain_txt).digest('hex');
  var link = 'http://localhost:8080/api/verifyEmail/'+_link_pos+"&&"+user_mail;

  var manager = new MailSenderClass('hotmail', 'yarasa_1600@hotmail.com', 'Sartun21-');
  manager.setReceiver(user_mail);
  manager.setSubject('Email Doğrulama');
  var html_code = "<h1>DUPIA Email Adresi Doğrulama</h1><p style='color:blue;'>Lütfen Mailinizi doğrulamak için bağlantıya tıklayın : "
  +"<a>"+link+"</a></p>";
  manager.setHTML(html_code);
  manager.send();
  console.log("Verification mail has been sent to :"+user_mail);
  res.status(200).send({
    message: "EmailSentWorked",
  });
}



//managing signup function
exports.verify = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("Verifying function is working!!!");
  var all_parts_of_link = req.params.verify_string_part.split("&&");
  var ciphered_text = all_parts_of_link[0];
  var u_email = all_parts_of_link[1];
  const user_m = await User.findOne({ where: { email: u_email } });
  var plain_txt = user_m.ref_id+user_m.ref_id_for_point;
  var _link_pos = crypto.createHash('sha256').update(plain_txt).digest('hex');
  if(_link_pos == ciphered_text){
    //update isVerified as 1 on DB
    //...
    user_m.isVerified = 1;
    await user_m.save();
    res.status(200).send({
      message: "USER VERIFIED SUCCESSFULLY", return_val:true
    });
  }else{
    res.status(200).send({
      message: "USER NOT VERIFIED!", return_val:false
    });
  }  
}







async function initialize_graph_from_db() {
  //initialize graph from db...
  var graph = await user_state.initGraph();
  return graph;

}

async function add_node_to_graph(req) {
  //getting graph...
  //var graph = await user_state.getGraph();
  var graph = await initialize_graph_from_db();
  var node = new Node();

  if(!(req.body.ref_id_for_real == "" || req.body.ref_id_for_real == undefined || req.body.ref_id_for_real == null)){
    node.isAlone = false;
    node.has_real_parent = true;
  }else{
    node.isAlone = true;
    node.has_real_parent =false;
  }

  //arrange UserClass object by requested user
  var my_user = new UserClass();
  my_user.name = req.body.name;
  my_user.surname = req.body.surname;
  my_user.email = req.body.email;
  my_user.pass = crypto.createHash('sha256').update(req.body.pass).digest('hex');
  console.log("RES: "+req.body.ref_id_for_real);
  my_user.ref_id_for_real = req.body.ref_id_for_real;
  my_user.yetki = req.body.yetki;
  my_user.phone = req.body.phone;
  my_user.birth_day = req.body.birth_day;
  my_user.ref_id = await generateUniqueID();
  my_user.ref_id_for_link = await generateUniqueLinkID();

  const [user, created] = await User.findOrCreate(
    {
      where: { email: my_user.email },
      defaults: {
        name: my_user.name,
        surname: my_user.surname,
        email: my_user.email,
        pass: my_user.pass,
        ref_id: my_user.ref_id,
        ref_id_for_real: my_user.ref_id_for_real,
        ref_id_for_link: my_user.ref_id_for_link,
        yetki: my_user.yetki,
        phone: my_user.phone,
        birth_day: my_user.birth_day
      }
    }
  )
  user.set({
    name: my_user.name,
    surname: my_user.surname,
    email: my_user.email,
    pass: my_user.pass,
    ref_id: my_user.ref_id,
    ref_id_for_link: my_user.ref_id_for_link,
    ref_id_for_real: my_user.ref_id_for_real,
    yetki: my_user.yetki,
    phone: my_user.phone,
    birth_day: my_user.birth_day
  });
  console.log("RES1: "+req.body.ref_id_for_real);
  if (created) {
    //add to db and update graph if there was not any user like that before
    user.set({
      ref_id: my_user.ref_id,
      ref_id_for_link: my_user.ref_id_for_link,
      ref_id_for_real: my_user.ref_id_for_real
    });
    console.log("RES2: "+req.body.ref_id_for_real);
    await user.save();
    node.setUser(user);
    graph.addNodeToGraph(node);
    graph = await user_state.updateNodeIDsOnDB(graph, node);
    graph = await user_state.updateNodePointsAndGenerationsOnDB(graph);
  }
  console.log("RES3: "+req.body.ref_id_for_real);
  return created;//return true if a new user is created on DB. Otherwise, false.
}

async function get_node_from_graph(n_email) {//it would be better if we get it from connected_nodes
  var graph = await initialize_graph_from_db();

  for(const node of graph.all_nodes){
    if (node.getUser().email == n_email) {
      var result = [node, graph];
      return result;
    }
  }

  console.log("Getting node step is passed...");
}

async function get_related_nodes_from_graph(n_email) {
  var result = await DFSgetRelated(n_email, discovered = [], res = []).then();
  return result;
}

async function update_node_from_graph(n_email, node) {
  //in also db...
}



//check creditentials
async function check_creditentials(n_email, n_pass) {
  const count = await User.count({
    where: {
      email: n_email,
      pass: crypto.createHash('sha256').update(n_pass).digest('hex')
    },
  });
  if (count == 1) {//there is only but only one record like that...
    return true;
  } else {
    return false;
  }
}


//is already a member?...
async function isAMember(n_email) {
  const count = await User.count({
    where: {
      email: n_email,
    },
  });
  if (count == 1) {//there is only but only one record like that...
    return true;
  } else {
    return false;
  }
}


//is a verified user?...
async function isVerified(email) {
  return false;
}

