module.exports = (sequelize, Sequelize) => {

    //id	name	surname	email	pass	photo	point	city	yetki	ref_id_for_point	ref_id_for_real	phone	birth_day	

    const Post = sequelize.define("post", {
        post_ref_id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        owner_ref_id: {
            type: Sequelize.STRING
        },
        file_path: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        total_likes: {
            type: Sequelize.INTEGER
        },
        total_shares: {
            type: Sequelize.INTEGER
        },
        total_comments: {
            type: Sequelize.INTEGER
        },
        privacy_type: {
            type: Sequelize.INTEGER
        }
    });

    return Post;
};