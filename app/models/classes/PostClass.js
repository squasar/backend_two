class PostClass {
    post_ref_id = "";
    owner_ref_id = "";
    
    constructor() {
        //this.name = "unknown";
    }
    
}

res_post_ob_class = {};
res_post_ob_class.pos_ob_class = PostClass;
res_post_ob_class.pos_ob_obj_class = new PostClass();
module.exports = res_post_ob_class;