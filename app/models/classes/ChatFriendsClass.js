

class ChatFriendsClass {

    owner_ref_link_id="";
    friends=[];

    constructor(ref_link){
        this.owner_ref_link_id = ref_link;
        this.friends = new Array();
    }

    addFriend(friend){
        this.friends.push(friend);
    }
    
    getFriends(){
        return this.friends;
    }

    getChatIdByRefLink(ref_link){
        for(var ind=0; ind<this.friends.length; ind++){
            if(this.friends[ind].u_ref_link_id == ref_link){
                return this.friends[ind].chat_id;
            }
        }
    }

    getRefLinkByChatId(chat_id){
        for(var ind=0; ind<this.friends.length; ind++){
            if(this.friends[ind].chat_id == chat_id){
                return this.friends[ind].u_ref_link_id;
            }
        }
    }

}

res_chatfriend_ob_class = {};
res_chatfriend_ob_class.chatfriend_ob_class = ChatFriendsClass;
res_chatfriend_ob_class.chatfriend_ob_obj_class = new ChatFriendsClass();
module.exports = res_chatfriend_ob_class;