/*
var my_user = new UserClass();
  my_user.name = req.params.name;
  my_user.surname = req.params.surname;
  my_user.email = req.params.email;
  my_user.pass = crypto.createHash('sha256').update(req.params.pass).digest('hex');
  my_user.ref_id_for_real = req.params.ref_id_for_real;
  my_user.yetki = req.params.yetki;
  my_user.phone = req.params.phone;
  my_user.birth_day = req.params.birth_day;
  my_user.ref_id = await generateUniqueID();

*/

class UserClass {
    name = "";
    surname = "";
    nickname="";
    
    email="";
    pass="";
    ref_id="";
    ref_id_for_real="";
    ref_id_for_point="";
    ref_id_for_link="";
    yetki="";
    phone="";
    birth_day=null;
    isGhost=0;
    photo;
    isVerified;

    point = 0;
    rank = -1;



    constructor() {
        this.name = "unknown";
    }
    getName() {
        return this.name;
    }
}

res_user_ob_class = {};
res_user_ob_class.usr_ob_class = UserClass;
res_user_ob_class.usr_ob_obj_class = new UserClass();
module.exports = res_user_ob_class;