const db = require("../models");
const Chat = db.chat;
const User = db.users;
const Op = db.Sequelize.Op;

function create_random_string(LINK_ID_CHAR_LENGTH) {
    var result = '';
    var characters = 'AaBbCcDdEeFfGgHhIiJjKkLMmNnOoPpQqRrSsTtUuVvWwXxYyZz23456789';
    var charactersLength = characters.length;
    for (var i = 0; i < LINK_ID_CHAR_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function generateUniqueID() {
    const ref_ids = await Chat.findAll({
        attributes: ['chat_id']
    });
    var is_different = false;
    var temp_ref_id = "CCCC";
    if (ref_ids.length != 0) {
        while (!is_different) {
            is_persistance = false;
            temp_ref_id = create_random_string(12);
            for (index = 0; index < ref_ids.length; index++) {
                if (ref_ids[index].get('chat_id') == temp_ref_id) {
                    is_different = false;
                    is_persistance = true;
                } else {
                    if (is_persistance == false && index == ref_ids.length - 1) {
                        is_different = true;
                    }
                }
            }
        }
    }
    return temp_ref_id;
}

async function generateUniqueIDforMessages() {
    const ref_ids = await Chat.findAll({
        attributes: ['message_id ']
    });
    var is_different = false;
    var temp_ref_id = "CCCC";
    if (ref_ids.length != 0) {
        while (!is_different) {
            is_persistance = false;
            temp_ref_id = create_random_string(24);
            for (index = 0; index < ref_ids.length; index++) {
                if (ref_ids[index].get('message_id ') == temp_ref_id) {
                    is_different = false;
                    is_persistance = true;
                } else {
                    if (is_persistance == false && index == ref_ids.length - 1) {
                        is_different = true;
                    }
                }
            }
        }
    }
    return temp_ref_id;
}





exports.setNotificationStatus=async(myLinkId,friend)=>{
    var isThereNotification = false;
    const res = await Chat.findAll({
        attributes: ['isSeen'],
        where: {
            [Op.and]: [
                { sender_ref_id: friend.u_ref_id },
                {receiver_ref_ids: myLinkId }
            ]
        }
    });
    for (var infos of res) {
        var key_val = infos.get('isSeen');
        if(key_val == 0){
            isThereNotification = true;
        }
    }
    if(isThereNotification == false){
        friend.hasNotification = 0;
    }else{
        friend.hasNotification = 1;
    }
    return friend;
}







exports.getChats = async (myRefId) => {
    const res = await Chat.findAll({
        where: {
            [Op.or]: [
                { sender_ref_id: myRefId },
                { receiver_ref_ids: myRefId }
            ]
        }
    });
    return res;

}

exports.getAuserByRefLinkId = async (link_id) => {
    var requested_str = link_id;
    const related_user = await User.findOne({ where: { ref_id_for_link: requested_str } });
    return related_user;
    /*res.status(200).send({
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
    });*/
}

exports.sendMessage = async (content, owner_ref_link_id) => {
    const sender_user = await User.findOne({
        where: {
            ref_id_for_link: owner_ref_link_id,
        }
    });
    var name_nick_sur = sender_user.name + "," + sender_user.surname + "," + sender_user.nickname;
    await Chat.create({
        chat_id: content.chat_id,
        sender_name: name_nick_sur,
        chat_type: "Personal",
        sender_ref_id: owner_ref_link_id,
        receiver_ref_ids: content.receiver_ref_ids,
        content: content.content,
        isSeen: 0
    });
}

exports.getChatWithotChangingNotify=async (chat_id, owner_ref_link_id)=>{
    const messages = await Chat.findAll({
        where: {
            [Op.and]: [
                { receiver_ref_ids: owner_ref_link_id },
                { chat_id: chat_id }
            ]
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    });
    return messages;
}

exports.getChat = async (chat_id, owner_ref_link_id) => {

    const messages = await Chat.findAll({
        where: {
            chat_id: chat_id
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    });

    //update aall these messages isSeen as 1
    await Chat.update({ isSeen: 1 }, {
        where: {
            [Op.and]: [
                { receiver_ref_ids: owner_ref_link_id },
                { chat_id: chat_id }
            ]
            
        }
    });

    return messages;


}



exports.createChatIds = async (myRefId, ref_link_ids) => {

    var result = [];

    const sender_user = await User.findOne({
        where: {
            ref_id_for_link: myRefId,
        }
    });
    var name_nick_sur = sender_user.name + "," + sender_user.surname + "," + sender_user.nickname;

    var ref_links_len = ref_link_ids.length;
    for (var ind = 0; ind < ref_links_len; ind++) {
        var ct_id = await generateUniqueID();
        //var msg_id = await generateUniqueIDforMessages()
        const [chat, created] = await Chat.findOrCreate({
            where: {
                [Op.or]: [
                    { sender_ref_id: myRefId, receiver_ref_ids: ref_link_ids[ind] },
                    { sender_ref_id: ref_link_ids[ind], receiver_ref_ids: myRefId }
                ]

            },
            defaults: {
                chat_id: ct_id,
                sender_name: name_nick_sur,
                sender_ref_id: myRefId,
                receiver_ref_ids: ref_link_ids[ind],
                chat_type: 'first-init',
                content: "hidden",
                isSeen: 1
            }
        });
        result.push(chat.chat_id);
    }
    return result;
}


/*exports.getAllFriends = async () => {
    var result_docs = await Document.findAll();
    return result_docs;
}*/
exports.getAllFriends = async (req) => {

}


/*exports.getFriend = async (doc_id) => {
    var result_doc = await Document.findOne({ where: { id: doc_id } });
    return result_doc;
}*/
exports.getFriend = async (req) => {

}

