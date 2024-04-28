class FriendsClass{
    chat_id = "";
    u_ref_id="";
    u_name="";
    u_surname="";
    u_nickname="";
    pp_path="";
    isOnline=false;
    hasNotification=0;

    constructor(){
        this.chat_id = "";
        this.u_ref_id="";
        this.u_name="";
        this.u_surname="";
        this.u_nickname="";
        this.pp_path="";
        this.isOnline=false;
        this.hasNotification=0;
    }
    
}

res_friend_ob_class = {};
res_friend_ob_class.friend_ob_class = FriendsClass;
res_friend_ob_class.friend_ob_obj_class = new FriendsClass();
module.exports = res_friend_ob_class;