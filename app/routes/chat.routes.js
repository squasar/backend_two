const { stringify } = require("flatted");

module.exports = (app,io) => {
    var chat_router = require("express").Router();
    const chat_s = require("../controllers/chat.controller.js");
    const db = require("../models");
    const ChatFriendsClass = require("../models/classes/ChatFriendsClass.js").chatfriend_ob_class;
    const FriendsClass = require("../models/classes/FriendsClass.js").friend_ob_class;
    const Chat = db.chat;
    const chatFriends = {};
    const chatMessages = {};

    

    app.use('/api/docs', chat_router);

    io.on("connection", socket => {
        let previousId;
        console.log("connection Çalıştı...");
        const safeJoin = currentId => {
            socket.leave(previousId);
            socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
            previousId = currentId;
        };
        
        socket.on("createChatIds", async req => {
            var myRefId = req.myRefId;
            var res = req.ids;
            var ref_link_ids = res.split(",");
            //ref_link_ids.pop();
            ref_link_ids.splice(ref_link_ids.length-1, 1);
            await chat_s.createChatIds(myRefId,ref_link_ids);
        });

        socket.on("getAllFriendsChatList", async req => {
            var my_ref_link_id = req.myRefId;
            var res = new ChatFriendsClass(my_ref_link_id);
            var related_chats = await chat_s.getChats(my_ref_link_id);
            console.log("22222222222222222222222");
            for(var ind=0; ind<related_chats.length; ind++){
                let isSenderAsked = false;
                let isReceiverAsked = false;
                let oneWorked = false;
                let bothAreSame = false;
                let content = false;
                if(related_chats[ind].chat_type == "first-init"){
                    content = true;
                }
                if(related_chats[ind].sender_ref_id == my_ref_link_id){
                    isSenderAsked = true;
                    bothAreSame = false;
                }else if(related_chats[ind].receiver_ref_ids == my_ref_link_id){
                    isReceiverAsked = true;
                    bothAreSame = false;
                }else if(related_chats[ind].sender_ref_id == related_chats[ind].receiver_ref_ids){
                    bothAreSame = true;
                }

                

                if(isSenderAsked == true && bothAreSame == false && oneWorked==false && content==true){
                    oneWorked = true;
                    var a_friend = new FriendsClass();
                    
                    a_friend.chat_id = related_chats[ind].chat_id;
                    a_friend.u_ref_id = related_chats[ind].receiver_ref_ids;
                    console.log("ILGILI ARKADAS REF LINKK ID : "+a_friend.u_ref_id + "   and  "+a_friend.chat_id);
                    var related_usr = await chat_s.getAuserByRefLinkId(a_friend.u_ref_id);
                    a_friend.u_name = related_usr.name;
                    a_friend.u_surname = related_usr.surname;
                    a_friend.u_nickname = related_usr.nickname;


                    a_friend = await chat_s.setNotificationStatus(my_ref_link_id,a_friend);
                    
                    
                    //a_friend.hasNotification = related_chats[ind].isSeen;
                    var pic = related_usr.photo;
                    if(pic != null && pic !=undefined && pic!=""){
                        a_friend.pp_path = "http://localhost:8090/dupia/angRes/backend_two/views/images/profilePics/"+pic;
                    }else{
                        a_friend.pp_path = 'NONE';
                    }
                    res.addFriend(a_friend);


                }
                if(isReceiverAsked == true && bothAreSame == false && oneWorked==false && content==true){
                    oneWorked = true;
                    var a_friend = new FriendsClass();
                    a_friend.chat_id = related_chats[ind].chat_id;
                    a_friend.u_ref_id = related_chats[ind].sender_ref_id;
                    console.log("ILGILI ARKADAS REF LINKK ID : "+a_friend.u_ref_id)
                    var related_usr = await chat_s.getAuserByRefLinkId(a_friend.u_ref_id);
                    a_friend.u_name = related_usr.name;
                    a_friend.u_surname = related_usr.surname;
                    a_friend.u_nickname = related_usr.nickname;
                    //a_friend.hasNotification = related_chats[ind].isSeen;

                    a_friend = await chat_s.setNotificationStatus(my_ref_link_id,a_friend);


                    var pic = related_usr.photo;
                    if(pic != null && pic !=undefined && pic!=""){
                        a_friend.pp_path = "http://localhost:8090/dupia/angRes/backend_two/views/images/profilePics/"+pic;
                    }else{
                        a_friend.pp_path = 'NONE';
                    }
                    
                    res.addFriend(a_friend);

                }
                









                /*if(related_chats[ind].sender_ref_id == my_ref_link_id || related_chats[ind].receiver_ref_ids == my_ref_link_id){
                    console.log("333333333333333333333");
                    var a_friend = new FriendsClass();
                    a_friend.chat_id = related_chats[ind].chat_id;
                    a_friend.u_ref_id = related_chats[ind].receiver_ref_ids;
                    console.log("ILGILI ARKADAS REF LINKK ID : "+a_friend.u_ref_id)
                    var related_usr = await chat_s.getAuserByRefLinkId(a_friend.u_ref_id);
                    a_friend.u_name = related_usr.name;
                    a_friend.u_surname = related_usr.surname;
                    a_friend.u_nickname = related_usr.nickname;
                    var pic = related_usr.photo;
                    if(pic != null && pic !=undefined && pic!=""){
                        a_friend.pp_path = "http://localhost:8090/dupia/angRes/backend_two/views/images/profilePics/"+pic;
                    }else{
                        a_friend.pp_path = 'NONE';
                    }
                    
                    res.addFriend(a_friend);
                }*/
            }
            console.log("1111111111111111111111111");

            safeJoin(my_ref_link_id);

            chatFriends[my_ref_link_id] = res;

            socket.emit("chatFriends", res);

                

            
            


            
            
            //console.log("Defined IDS : "+res);

            /*var _temp = await chat_s.getDoc(req);
            var doc_obj = new DocumentClass();
            doc_obj.id = _temp.id;
            doc_obj.doc = _temp.doc;
            
            safeJoin(_temp.id);
            documents[_temp.id] = _temp.doc;
            socket.emit("document", doc_obj);*/
        });
        //this.socket.emit('getAllChats', { chat_id: chat_id, owner_ref_link_id:this.loggedService.refLink });
        socket.on("getAllChats", async req => {
            var _temp = await chat_s.getChat(req.chat_id, req.owner_ref_link_id);
            
            //set isSeen as 1


            safeJoin(req.chat_id);
            chatMessages[req.chat_id] = _temp;
            socket.emit("allchats", chatMessages[req.chat_id]);
        });

        //getAllChatsWithotChangingNotify
        socket.on("getAllChatsWithotChangingNotify", async req => {
            var _temp = await chat_s.getChatWithotChangingNotify(req.chat_id, req.owner_ref_link_id);
            

            safeJoin(req.chat_id);
            chatMessages[req.chat_id] = _temp;
            socket.emit("allchatswithoutchangingnotification", chatMessages[req.chat_id]);
        });
        



        //this.socket.emit('sendMsg', { msg_ob: content, owner_ref_link_id:this.loggedService.refLink });
        socket.on("sendMsg", async req => {
            console.log("VAR RES : "+JSON.parse(req.msg_ob).chat_id);
            var chatId = JSON.parse(req.msg_ob).chat_id;
            //await chat_s.sendMessage(req.msg_ob, req.owner_ref_link_id);
            await chat_s.sendMessage(JSON.parse(req.msg_ob), req.owner_ref_link_id);
            //var _temp = await chat_s.getChat(req.msg_ob.chat_id, req.owner_ref_link_id);
            var _temp = await chat_s.getChat(chatId, req.owner_ref_link_id);
            //chatMessages[req.chat_id] = _temp;
            chatMessages[chatId] = _temp;
            //socket.to(req.chat_id).emit("allchats", _temp);
            socket.to(chatId).emit("allchats", _temp);
            
            
            
            
            /*documents[doc.id] = doc.doc;
            doc_s.updateDoc(doc);
            socket.to(doc.id).emit("document", doc);*/
        });
        
        /*socket.on("getFriendChatList", async req => {
            var _temp = await chat_s.getDoc(req.id);
            var doc_obj = new DocumentClass();
            doc_obj.id = _temp.id;
            doc_obj.doc = _temp.doc;
            
            safeJoin(_temp.id);
            documents[_temp.id] = _temp.doc;
            socket.emit("document", doc_obj);
        });*/


        //io.emit("chats", Object.keys(documents));
        console.log(`Socket ${socket.id} has connected`);
    });


};