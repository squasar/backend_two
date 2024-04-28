const db = require("../models");
const Posts = db.post;


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
    const ref_ids = await Posts.findAll({
        attributes: ['post_ref_id']
    });
    var is_different = false;
    var temp_ref_id = "AAA";
    if (ref_ids.length != 0) {
        while (!is_different) {
            is_persistance = false;
            temp_ref_id = create_random_string(12);
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
    }
    return temp_ref_id;
}



exports.getLatestPostId = async (req, res) => {
    const my_posts = await Posts.findAll({
        order: [['createdAt', 'DESC']],
        where: {
            owner_ref_id: req.body.owner_ref_id
        }
    });
    console.log("getLatestPostId çalışıyor...");
    res.status(200).send({
        message: "FALSEINFO", datum: my_posts[0].post_ref_id
    });
}



exports.updatePostPrivacy = async (post_ref_id, privacy_type) => {

    const [post, created] = await Posts.findOrCreate({
        where: { post_ref_id: post_ref_id },
    });
    if (!created) {
        post.privacy_type = privacy_type;
        await post.save();
        //return post;
    }


    /*
  const my_post = await Posts.findAll({
      where: {
          post_ref_id: post_ref_id
      }
  });
  my_post.privacy_type = privacy_type;
  await my_post.save();
  return my_post;*/
}


exports.getMyPosts = async (owner_ref_id) => {

    if (owner_ref_id != undefined) {
        const my_posts = await Posts.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                owner_ref_id: owner_ref_id
            }
        });
        return my_posts;
    }
}

exports.getPostInfo = async (post_ref_id) => {

    const my_post = await Posts.findAll({
        where: {
            post_ref_id: post_ref_id
        }
    });

    /*var res = [{
        "likes":my_post.total_likes, 
        "comments":my_post.total_comments, 
        "shares":my_post.total_shares,
        "created":my_post.createdAt
    }];*/

    return my_post;
}



exports.addPost = async (owner_ref_id, content, privacy_type) => {
    console.log("666");
    var c_id = await generateUniqueID();
    //console.log("555555");
    //const _post = Posts.build({ post_ref_id: c_id });
    console.log("888");
    //await _post.save();


    const result_post = await Posts.create(
        {
            owner_ref_id: owner_ref_id,
            post_ref_id: c_id,
            content: content,
            privacy_type: privacy_type,
            total_likes: 0,
            total_shares: 0,
            total_comments: 0

        });

    console.log(result_post.toJSON());
    console.log("777");
    return result_post;
    //return result_post;
}

