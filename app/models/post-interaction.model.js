module.exports = (sequelize, Sequelize) => {

    //id	name	surname	email	pass	photo	point	city	yetki	ref_id_for_point	ref_id_for_real	phone	birth_day	

    const PostInteraction = sequelize.define("postInteraction", {
        interacted_post_ref_id: {
            type: Sequelize.STRING,
        },
        interaction_owner_ref_id: {
            type: Sequelize.STRING
        },
        interaction_type: {
            type: Sequelize.STRING
        },
        interaction_context: {
            type: Sequelize.STRING
        },
    });

    return PostInteraction;
};