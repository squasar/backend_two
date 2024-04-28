const Node = require("../data/graph/node.js").no;
const db = require("../models");
const gr = require("../data/");
const { parse, stringify } = require('./../../node_modules/flatted/cjs');
const UsrState = require("../data/graph_users.js").usr_state;
const User = db.users;
const multiparty = require('multiparty');
var runner = require("child_process");

var stream = require('stream');
const fs = require('fs');

const UserClass = require("../models/classes/UserClass.js").usr_ob_class;
const MailSenderClass = require("../models/classes/MailSenderClass.js").msender_ob_class;

const Op = db.Sequelize.Op;
const crypto = require('crypto');
const { Console } = require("console");

var uns_st = new UsrState();

const LINK_ID_CHAR_LENGTH = 8;


function create_random_string(leng) {
  var result = '';
  var characters = 'AaBbCcDdEeFfGgHhIiJjKkLMmNnOoPpQqRrSsTtUuVvWwXxYyZz23456789';
  var charactersLength = characters.length;
  for (var i = 0; i < /*LINK_ID_CHAR_LENGTH*/leng; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generateUniqueID(leng) {
  const ref_ids = await User.findAll({
    attributes: ['ref_id']
  });
  var is_different = false;
  var temp_ref_id = "AAA";
  while (!is_different) {
    is_persistance = false;
    temp_ref_id = create_random_string(leng);
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








var res = uns_st.initGraph().then(function (result) {
  var sample = result.all_nodes[6];
  console.log("GRAPH: " + stringify(sample.getUser().name));
  //console.log("RESULT: "+sample);
  var res = sample.getTopPath();
  var bot = sample.getAllSubMembers();
  for (var ind = 0; ind < res.length; ind++) {
    console.log("RESULT TOP : " + stringify(res[ind].getUser().name));
  }
  for (var ind = 0; ind < bot.length; ind++) {
    console.log("RESULT SUB : " + stringify(bot[ind].getUser().name));
  }
  console.log("Length of Nodes " + stringify(result.all_nodes.length));
  for (var ind = 0; ind < result.all_nodes.length; ind++) {
    var sample = result.all_nodes[ind];
    console.log(ind + ". POINT : " + stringify(sample.point));
  }

  //uns_st.updatePointsOnDB(result).then();



  exports.login = async (req, res) => {
    console.log("LOGGED IN : " + stringify(req.body.email + "  &&&  " + req.body.pass));
    res.setHeader('Access-Control-Allow-Origin', '*');
    var email = req.body.email;
    var pass = req.body.pass;
    var temp_res = await isAvalidMember(email, pass);
    if (temp_res == false) {//no such a member on DB
      res.status(200).send({
        message: "NOTAMEMBER", datum: temp_res
      });
    } else if (temp_res == true) {//something is wrong about either email or pass
      res.status(200).send({
        message: "FALSEINFO", datum: temp_res
      });
    } else {//everything is just fine... welcome!! Your data is getting ready!
      const logged_user = await User.findOne({ where: { email: email } });
      temp_res.setUser(logged_user);
      var sub = [];
      var top = [];

      var sub_members = temp_res.getAllSubMembers();
      for (var s_member of sub_members) {
        sub.push(s_member.getUser().ref_id_for_link);
      }
      var top_members = temp_res.getTopPath();
      for (var t_member of top_members) {
        top.push(t_member.getUser().ref_id_for_link);
      }

      console.log("top length : " + top.length);

      //build sub_net string
      var sub_net = "";
      var _ayrac = "*";
      /*for (var ind=0; ind<sub.length; ind++) {
        sub_net = sub_net + sub[ind];
      }*/

      for (var s_ of sub) {
        sub_net = sub_net + s_ + _ayrac;
      }
      console.log("sub_net : " + sub_net);
      //build sub_net string
      var top_net = "";
      for (var t_ of top) {
        top_net = top_net + t_ + _ayrac;
      }
      console.log("top_net : " + top_net);


      /*var sub_net = JSON.stringify(sub);
      var top_net = JSON.stringify(top);*/





      var _nod_id = temp_res.getUser().id;
      var _generation = temp_res.getUser().generation;
      var _point = temp_res.point;
      var _name = temp_res.getUser().name;
      var _surname = temp_res.getUser().surname;
      var _email_ = temp_res.getUser().email;
      var _yetki = temp_res.getUser().yetki;
      var _city = temp_res.getUser().city;
      var _isVerified = temp_res.getUser().isVerified;
      var _phone = temp_res.getUser().phone;
      var _photo = temp_res.getUser().photo;
      var _birth_day = temp_res.getUser().birth_day;
      var _nickname = temp_res.getUser().nickname;

      var _ref_id_link = temp_res.getUser().ref_id_for_link;

      //var date_created = temp_res.getUser().createdAt;
      let date_created_ob = new Date(temp_res.getUser().createdAt);
      let this_date = new Date();
      let difference = date_created_ob.getTime() - this_date.getTime();
      var _howManyDays = Math.ceil(difference / (1000 * 3600 * 24));
      if (_howManyDays < 0) {
        _howManyDays = _howManyDays * (-1);
      }
      var _ref_id = temp_res.getUser().ref_id;

      var _isGhost = temp_res.getUser().isGhost;

      //create ref link...

      console.log("BIRTHDAY : " + _birth_day);
      console.log("_isVerified : " + _isVerified);


      res.status(200).send({
        message: "SUCCESSFUL",
        isGhost: _isGhost,
        ref_id: _ref_id,
        ref_link: _ref_id_link,
        nod_id: _nod_id,
        generation: _generation,
        point: _point,
        photo: _photo,
        name: _name,
        surname: _surname,
        nickname: _nickname,
        email: _email_,
        yetki: _yetki,
        isVerified: _isVerified,
        phone: _phone,
        city: _city,
        birth_day: _birth_day,
        howManyDays: _howManyDays,
        sub_net: sub_net,
        top_net: top_net
      });
    }
  }

  exports.getUserByRefLinkId = async (req, res) => {
    var requested_str = req.body.ref_id_for_link;
    const related_user = await User.findOne({ where: { ref_id_for_link: requested_str } });
    res.status(200).send({
      message: "SUCCESSFUL",
      isGhost: related_user.isGhost,
      generation: related_user.generation,
      point: related_user.point,
      photo: related_user.photo,
      name: related_user.name,
      surname: related_user.surname,
      nickname: related_user.nickname,
      phone: related_user.phone,
      city: related_user.city,
      birth_day: related_user.birth_day,
      ref_id: related_user.ref_id
    });
  }
  exports.getUserByRefId = async (req, res) => {
    var requested_str = req.body.ref_id;
    const related_user = await User.findOne({ where: { ref_id: requested_str } });
    res.status(200).send({
      message: "SUCCESSFUL",
      isGhost: related_user.isGhost,
      generation: related_user.generation,
      point: related_user.point,
      photo: related_user.photo,
      name: related_user.name,
      surname: related_user.surname,
      nickname: related_user.nickname,
      phone: related_user.phone,
      city: related_user.city,
      birth_day: related_user.birth_day,
      ref_id: related_user.ref_id
    });
  }

  exports.createOrGet = async (req, res) => {
    /*
    email: data.email,
      pass: data.pass,
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      yetki: data.yetki,
      birth_day: data.birth_day,
      ref_id_for_real: data.ref_id_for_real
    */
    res.setHeader('Access-Control-Allow-Origin', '*');
    var email = req.body.email;
    var pass = crypto.createHash('sha256').update(req.body.pass).digest('hex');//req.body.pass;
    var name = req.body.name;
    var ref_id = await generateUniqueID(8);//""//generate
    var surname = req.body.surname;
    var phone = req.body.phone;
    var yetki = req.body.yetki;
    var birth_day = req.body.birth_day;
    var ref_id_for_real = req.body.ref_id_for_real;
    var ref_id_for_link = await generateUniqueID(9);
    var isVerified = "Unverified";
    var isGhost = 0;
    var ref_id_for_point = ref_id_for_real;



    const user = await User.build({
      email: email,
      name: name,
      pass: pass,
      ref_id: ref_id,
      surname: surname,
      phone: phone,
      yetki: yetki,
      birth_day: birth_day,
      ref_id_for_real: ref_id_for_real,
      ref_id_for_link: ref_id_for_link,
      isVerified: isVerified,
      isGhost: isGhost,
      ref_id_for_point: ref_id_for_point
    });

    var is_a_member = await isAMember(email).then();
    //console.log("1");
    if (is_a_member) {
      res.status(200).send({
        message: "ALREADYAMEMBER"
      });
    } else {
      await uns_st.addUser(user, result);

      var user_parent = await User.findOne({ where: { ref_id: ref_id_for_real } });
      //var user_mail = //req.body.email.replace('"', '').replace('"', '');
      //var user_m = await User.findOne({ where: { email: user_mail } });

      //var plain_txt = user_m.ref_id + user_m.ref_id_for_point;
      //var _link_pos = crypto.createHash('sha256').update(plain_txt).digest('hex');
      //var link = 'http://localhost:8080/api/verifyUser/' + _link_pos + "&&" + user_mail;

      var manager = new MailSenderClass('hotmail', 'yarasa_1600@hotmail.com', 'Sartun21-');
      manager.setReceiver(user_parent.email);
      manager.setSubject('Ağınıza Yeni Kişi Eklendi!');
      var html_code = "<h1>DUPIA ağına yeni kişi eklendi</h1><p style='color:blue;'>Aşağıda adı ve email i verilen kullanıcı başarıyla ağınıza kayıt olmuştur: "
        + ">" + "</p>"+"<p>"+user.name+"  "+user.email+"</p>" ;
      manager.setHTML(html_code);
      manager.send();
      console.log("Notifying mail has been sent to :" + user_parent.email);





      res.status(200).send({
        message: "SUCCESSFUL"//, owner: user, childeren: response
      });
    }


  }
  //exports.signupWithParent = async (req, res) => { }

  exports.getVerificationStatus = async (req, res) => {
    var user_mail = req.body.email;
    var user_m = await User.findOne({ where: { email: user_mail } });
    var status = user_m.isVerified;
    var point = user_m.point;
    res.status(200).send({
      status: status,
      points: point
    });
  }


  exports.sendVerificationMail = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var user_mail = req.body.email.replace('"', '').replace('"', '');
    var user_m = await User.findOne({ where: { email: user_mail } });

    var plain_txt = user_m.ref_id + user_m.ref_id_for_point;
    var _link_pos = crypto.createHash('sha256').update(plain_txt).digest('hex');
    var link = 'http://localhost:8080/api/verifyUser/' + _link_pos + "&&" + user_mail;

    var manager = new MailSenderClass('hotmail', 'yarasa_1600@hotmail.com', 'Sartun21-');
    manager.setReceiver(user_mail);
    manager.setSubject('Email Doğrulama');
    var html_code = "<h1>DUPIA Email Adresi Doğrulama</h1><p style='color:blue;'>Lütfen Mailinizi doğrulamak için bağlantıya tıklayın : "
      + "<a>" + link + "</a></p>";
    manager.setHTML(html_code);
    manager.send();
    console.log("Verification mail has been sent to :" + user_mail);
    res.status(200).send({
      message: "EmailSentWorked",
    });
  }




  exports.verify = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log("Verifying function is working!!!  " + JSON.stringify(req.params));
    var all_parts_of_link = req.params.ref_id_for_link.split("&&");

    var ciphered_text = all_parts_of_link[0];
    var u_email = all_parts_of_link[1];
    const user_m = await User.findOne({ where: { email: u_email } });
    var plain_txt = user_m.ref_id + user_m.ref_id_for_point;
    var _link_pos = crypto.createHash('sha256').update(plain_txt).digest('hex');
    if (_link_pos == ciphered_text) {
      //update isVerified as 1 on DB
      //...
      user_m.isVerified = "Verified";
      await user_m.save();
      res.status(200).send({
        message: "USER VERIFIED SUCCESSFULLY", return_val: true
      });
    } else {
      res.status(200).send({
        message: "USER NOT VERIFIED!", return_val: false
      });
    }
  }
  exports.getSignupParentRefId = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const ref_ids = await User.findAll({
      attributes: ['ref_id_for_link', 'ref_id', 'isVerified']
    });

    var the_key = req.body.masked_id_for_link;

    var isFound = false;

    for (var infos of ref_ids) {
      var key_string = infos.get('ref_id_for_link');//crypto.createHash('sha256').update(ref_link_id.get('ref_id_for_link')).digest('hex');
      if (the_key == key_string) {
        var result = infos.get('ref_id');
        var ver_status = infos.get('isVerified');
        if (ver_status == "Verified") {
          isFound = true;
          res.status(200).send({
            message: "PARENTALFOUND", parent_id: result
          });
        }
      }
    }
    if (isFound == false) {
      res.status(200).send({
        message: "PARENTALNOTFOUND",
      });
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
    //console.log("VALL : "+JSON.stringify(ref_ids));

    for (var ref_link_id of ref_ids) {
      var the_key = crypto.createHash('sha256').update(ref_link_id.get('ref_id_for_link')).digest('hex');
      if (the_key == key_string) {
        choosen_ref_id_link = ref_link_id.get('ref_id_for_link');
        //console.log("RES : "+choosen_ref_id_link);
        var result_parent_user = await User.findOne({ where: { ref_id_for_link: choosen_ref_id_link } });
        res.status(200).send({
          message: "PARENTALFOUND", parent_id: result_parent_user.ref_id
        });
      }
    }
  }

  /* 
  this.point = this.loggedService.point;
    this.name = this.loggedService.name;
    this.nickname = this.loggedService.nickname;
    this.howManyDays = this.loggedService.howManyDays;
    this.isVerified = this.loggedService.isVerified;
    this.birthDay = this.loggedService.birthDay;
    this.generation = this.loggedService.generation;
    this.ref_link = this.loggedService.refLink;
    this.city = this.loggedService.city;
  
  */


  exports.getUserImage = async (req, res) => {
    var id = req.body.id;
    var node = await getMemberById(id);

    console.log("Resim istenen id: " + id);


    const re = node.getUser().photo;


    /*var query = "SELECT photo FROM users WHERE ref_id = '" + id + "';";
    const [re, metadata] = await db.sequelize.query(query);*/


    console.log("DEĞER : " + re);

    var file_blob = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\views\\images\\profilePics\\" + id + "@" + id + "." + re.toString();
    //const contents = fs.readFileSync(file_blob, { encoding: 'base64' });
    /*console.log("FILE BLOB : "+file_blob);

    var contents;

    if (fs.existsSync(file_blob)) {
      //file exists
      contents = fs.readFileSync(file_blob, { encoding: 'base64' });
    }else{
      contents = null;
    }*/


    //var contents = null;
    //const contents = fs.readFileSync(file_blob, { encoding: 'base64' });
    /*try {
      // file not presenet
      //var data = fs.readFileSync('sample.html');
      const contents = fs.readFileSync(file_blob, { encoding: 'base64' });
    } catch (err) {
      console.log(err);
      //const contents = null;
    }*/




    //console.log("RESULLTTTSSS : " + stringify(contents));




    res.status(200).send({
      message: re.toString()
    });

    /*var file_blob = node.getUser().photo;
    var bufferBase64 = new Buffer(file_blob, 'binary').toString('base64');
    res.status(200).send({
      message: "bufferBase64", datum: bufferBase64
    });*/


  }

  exports.updateUserImage = async (req, res) => {
    var _id = req.body.my_id;
    var root_path_images = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\views\\images\\profilePics\\";

    const { image } = req.files;

    var node = await getMemberById(_id);

    // If no image submitted, exit
    if (!image) { //return res.sendStatus(400);
      console.log("image is not submitted!");
      return res.status(200).send({
        message: "NOIMAGESUBMITTED"
      });
    } else {
      console.log("image submitted successfully!");
    }
    var old_name = image.name;
    var uzanti = old_name.split(".")[1];
    var katrs = ["AWS", "CDT", "RES", "YTG", "JHK", "CIN", "ETI", "BIM", "SOK", "KIL", "DON", "OKU", "GIT", "AKL", "SAT", "ETS", "CES", "JKL", "HNM", "MAN"];

    var rand_indis = Math.floor(Math.random() * 19);
    var rand_part = katrs[rand_indis];
    var new_name = _id + "@" + rand_part + "." + uzanti;

    const fs = require("fs");
    const path = require("path");
    const phpScriptPath = path.join(__dirname, "sub_dependencies", "fileSaver.php");

    //console.log("IMAGE : : : "+stringify(image));

    var argsString = JSON.parse(image);// "value1,value2,value3";
    /*runner.exec("php " + phpScriptPath + " " + argsString + " " + "saveImage" , function (err, phpResponse, stderr) {
      if (err) console.log(err); /* log error */
    //console.log(phpResponse);
    //});*/

    /*
        var old_path = root_path_images + old_name;
        var new_path = root_path_images + new_name;
    
    
        const fs = require("fs")
        const path = require("path")
    
        var _path_images = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\views\\images";
    
        console.log("WAY :::  "+__dirname);
        console.log("WAY TWO :::  "+root_path_images);
    
        const currentPath = path.join(__dirname, image.name);
        const newPath = path.join(_path_images, "profilePics", image.nama);
    
        fs.rename(currentPath, newPath, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Successfully moved the file!");
          }
        });*/

    /*const currentPath = path.join(__dirname, image.name)
    const newPath = path.join(__dirname, "images", image.name.split(".")[1])

    fs.rename(currentPath, newPath, function (err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully moved the file!")
      }
    })*/






    //image.mv(new_path);
    //fs.rename(old_path, new_path, function (err) {if (err) console.log('ERROR on changing image name : ' + err);});



    /*await image.mv(old_path).then(
      fs.rename(old_path, new_path, function (err) {if (err) console.log('ERROR on changing image name : ' + err);})).then(async function () {
        var sample = await User.findOne({ where: { ref_id: _id } });
        var old_file_name = sample.photo;
        if (node.getUser().photo != null && node.getUser().photo != undefined) {
          var path = root_path_images + old_file_name;
          fs.unlink(path, (err) => async function () { console.log("An error occured on deleting profile picture from storage: " + err) });
        }
        //update info on db -- png,jpg,...
        var query = "UPDATE `users` SET photo= '" + new_name + "' WHERE ref_id = '" + _id + "';";
        await db.sequelize.query(query);
      }
      );*/













    //check if file does exists, delete

    /*fs.rmSync(new_path, {
      force: true,
    });*/

    //upload the file
    //console.log("IMAGE PATH : " + new_path);








    // UPDATE `users` SET photo=LOAD_FILE('C:\\xampp\\mysql\\data\\images\\hyundai.png') WHERE ref_id = 'ZL5679E6'; -- WORKED
    /*var _id = req.body.my_id;
    var root_path_images = "C:\\\\xampp\\\\mysql\\\\data\\\\images\\\\";
    
    let form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
      Object.keys(req.files).forEach(async function (name) {
        //console.log('PUHAHAHAHAHHAHAH ' + stringify(req.body.my_id));
        _id = req.body.my_id;
        const { image } = req.files;
        if (!image) { //return res.sendStatus(400);
          console.log("image is not submitted!");
          return res.status(200).send({
            message: "NOIMAGESUBMITTED"
          });
        } else {
          console.log("image submitted successfully!");
        }
        
    
        //var path = __dirname + '\\upload\\' + image.name;
        var path = root_path_images + image.name;
        //C:\xampp\htdocs\dupia\angRes\backend_two\app\views\images\hyundai.png
        console.log("IMAGE PATH : " + path);
        //image.mv(path);
    
        await image.mv(path)
        var query = "UPDATE users SET photo=LOAD_FILE('" + path + "') WHERE ref_id = '" + _id + "';";
        const [results, metadata] = await db.sequelize.query(query);
        
    
        
      });
    }
    );
    
      
    if (req.body.my_id != undefined && req.body.my_id != null) {
      _id = req.body.my_id;
    }*/







    console.log("Resmi İTEYENİN ID : " + _id);
    /*
    
          //upload the image
          const { image } = req.files;
          //console.log("IMAGE : "+stringify(image));
          // If no image submitted, exit
          if (!image) { //return res.sendStatus(400);
            console.log("image is not submitted!");
            return res.status(200).send({
              message: "NOIMAGESUBMITTED"
            });
          } else {
            console.log("image submitted successfully!");
          }
          //var __dirname
          // Move the uploaded image to our upload folder
          //C:\xampp\htdocs\dupia\angRes\backend_two\app\controllers\upload/hyundai.png
          //var root_path_images = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\app\\views\\images\\";
          var root_path_images = "C:\\Users\\suley\\Desktop\\images\\";
    
          //var path = __dirname + '\\upload\\' + image.name;
          var path = root_path_images + image.name;
          //C:\xampp\htdocs\dupia\angRes\backend_two\app\views\images\hyundai.png
          console.log("IMAGE PATH : " + path);
          //image.mv(path);
    
          image.mv(path);
    
          if(_id!=0){
            var query = "UPDATE users SET photo=LOAD_FILE('" + path + "') WHERE ref_id = '" + _id + "';";
            const [results, metadata] = await db.sequelize.query(query);
          }*/




    //res.sendStatus(200);

    /*console.log("image uploaded successfully! : "+path);
 
    let form = new multiparty.Form();
    var _id = "";
 
    console.log("form is getting ready!");
 
    form.parse(req, function (err, fields, files) {
      Object.keys(fields).forEach(async function (name) {
        console.log('got field named ' + name);
      });
      Object.values(fields).forEach(async function (name) {
        console.log('got field named ' + name);
        _id = name;
        var query = "UPDATE users SET photo=LOAD_FILE("+path+") WHERE id = "+ _id+";";
        const [results, metadata] = await sequelize.query(query);
      });*/






    /*Object.values(files).forEach(async function (name) {
      console.log('got file ' + name);
      let bll = new Blob(name);
      await User.update({
        photo: bll,
      }, {
        where: {
          id: _id
        }
      });
    });*/





    //console.log(stringify(files.get("image")));
    /*for (var file in Object.values(files)){
      console.log("RESIM : "+stringify(file));
    }*/


    /*
          files.forEach(async function (name) {
            console.log("RESIM : "+stringify(name));
            await User.update({
              photo: name,
            }, {
              where: {
                id: _id
              }
            });
          });*/
    //});
    //console.log("USER IMAGE IS UPDATING...");
    //console.log("USER ID : " + stringify(req.body));
  }

  //helper functions

  //is already a member?... If there is such a member on DB, won't return false. If there is node that has same email, returns node, otherwise returns true
  async function isAvalidMember(n_email, n_pass) {
    var key = crypto.createHash('sha256').update(n_pass).digest('hex');
    const count = await User.count({
      where: {
        email: n_email,
      },
    });
    if (count == 1) {//there is only but only one record like that...
      for (var nod of result.all_nodes) {
        if ((nod.getUser().email == n_email) && (nod.getUser().pass == key)) {
          return nod;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  async function getMemberById(id) {
    const count = await User.count({
      where: {
        ref_id: id,
      },
    });
    if (count == 1) {//there is only but only one record like that...
      for (var nod of result.all_nodes) {
        if ((nod.getUser().ref_id == id)) {
          return nod;
        }
      }
      return true;
    } else {
      return false;
    }

  }








});







/*exports.login = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send({
    message: "SUCCESSFUL"});
}*/


/*

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





//DFS
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




/*
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
//console.log("1");
if (is_a_member) {
res.status(200).send({
  message: "ALREADYAMEMBER"
});
} else {
if (/*is_verified*//*true) {
  //complete registeration
  var result = await add_node_to_graph(req).then();
  if (result) {
    //console.log("4");
    user = await get_node_from_graph(email).then();
    response = await get_related_nodes_from_graph(email).then();
    //console.log("5");
    res.status(200).send({
      message: "SUCCESSFUL"//, owner: user, childeren: response
    });
  } else {
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
  //console.log("RES : "+choosen_ref_id_link);
  var result_parent_user = await User.findOne({ where: { ref_id_for_link: choosen_ref_id_link } });
  res.status(200).send({
    message: "PARENTALFOUND", parent_id: result_parent_user.ref_id
  });
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

//arrange UserClass object by requested user
var my_user = new UserClass();
my_user.name = req.body.name;
my_user.surname = req.body.surname;
my_user.email = req.body.email;
my_user.pass = crypto.createHash('sha256').update(req.body.pass).digest('hex');
//console.log("RES: "+req.body.ref_id_for_real);
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
//console.log("RES1: "+req.body.ref_id_for_real);
if (created) {
//add to db and update graph if there was not any user like that before
user.set({
  ref_id: my_user.ref_id,
  ref_id_for_link: my_user.ref_id_for_link,
  ref_id_for_real: my_user.ref_id_for_real
});
//console.log("RES2: "+req.body.ref_id_for_real);
node.setUser(user);
graph.addNode(node,false);
graph = await user_state.updateNodeIDsOnDB(graph, node);
graph = await user_state.updateNodePointsAndGenerationsOnDB(graph);
await user.save();
}
//console.log("RES3: "+req.body.ref_id_for_real);
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
*/
