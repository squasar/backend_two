module.exports = (sequelize, Sequelize) => {

    //id	name	surname	email	pass	photo	point	city	yetki	ref_id_for_point	ref_id_for_real	phone	birth_day	

    const Chat = sequelize.define("chat", {

        
        chat_id:{
            type: Sequelize.STRING,
        },
        chat_type:{
            type: Sequelize.STRING
        },
        sender_name: {
            type: Sequelize.STRING
        },
        sender_ref_id: {
            type: Sequelize.STRING
        },
        receiver_ref_ids: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        isSeen: {
            type: Sequelize.INTEGER
        },


    });

    return Chat;
};