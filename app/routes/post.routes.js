const { stringify } = require("flatted");

module.exports = (app, io) => {
    var _web_socket_opts = {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    };

    var post_router = require("express").Router();
    const pos_s = require("../controllers/post.controller.js");
    //const http = require('http').Server(app);
    //const io = require('socket.io')(http, _web_socket_opts);
    const db = require("../models");

    const Post = db.post;

    const posts = {};

    app.use('/api/post', post_router);


    //'http://localhost:8080/api/posts/getLatestPostsId'
    app.route('/api/posts/getLatestPostsId')
        .post((req, res) => {
            console.log("Route a girildi....");
            pos_s.getLatestPostId(req, res);
        });




    io.on("connection", socket => {
        let previousId;
        console.log("connection Çalıştı...");

        const safeJoin = currentId => {
            socket.leave(previousId);
            socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
            previousId = currentId;
        };
        socket.on("sendPost", async req => {
            var res = await pos_s.addPost(req.owner_ref_id, req.content, req.privacy_type);
            posts[res.post_ref_id] = req.content;
            safeJoin(res.post_ref_id);
            io.emit("posts", Object.keys(posts));
            socket.emit("post", res.post_ref_id);
            /*console.log("addPost content...  : "+req.content);
            console.log("addPost owner ref id...  : "+req.owner_ref_id);
            console.log("addPost privacy type...  : "+req.privacy_type);
            posts[req.owner_ref_id] = req.content;
            console.log("1");
            safeJoin(req.owner_ref_id);
            console.log("2");
            var res = await pos_s.addPost(req.owner_ref_id, req.content, req.privacy_type);//owner_ref_id, content, privacy_type
            console.log("3");
            io.emit("posts", Object.keys(posts));
            console.log("4");
            console.log("addPost Çalıştı...");
            socket.emit("post", res.post_ref_id);*/

        });

        socket.on("getMyPosts", async req => {

            var _temp = await pos_s.getMyPosts(req.owner_ref_id);
            var latest_id = _temp[0].post_ref_id;
            safeJoin(latest_id);
            posts[req.owner_ref_id] = _temp;
            //console.log("LATEST ID : " + latest_id);
            socket.emit("getmyposts", _temp, latest_id);

        });

        socket.on("getAllMyPosts", async req => {

            var _temp = await pos_s.getMyPosts(req.owner_ref_id);

            console.log("FOR POST REF ID : "+ req.owner_ref_id);

            if (_temp != undefined) {

                if (_temp[0] != undefined) {
                    var latest_id = _temp[0].post_ref_id;
                    safeJoin(latest_id);
                    for (var i = 0; i < _temp.length; i++) {
                        posts[_temp[i].post_ref_id] = _temp[i];
                    }
                    socket.emit("getallmyposts", posts);
                }

                console.log("LATEST ID : " + req.owner_ref_id + "      LATEST OBJ : " + JSON.stringify(_temp[0]));
            }

            /*var latest_id = _temp[0].post_ref_id;
            safeJoin(latest_id);
            for(var i=0; i<_temp.length; i++){
                posts[_temp[i].post_ref_id]=_temp[i];
            }
            socket.emit("getallmyposts", posts);*/

        });

        socket.on("getStatOfPost", async req => {

            var _temp = await pos_s.getPostInfo(req.post_ref_id);
            //var latest_id = _temp[0].post_ref_id;
            safeJoin(req.post_ref_id);
            //posts[req.owner_ref_id] = _temp;
            //console.log(" ID : " + req.post_ref_id);
            //socket.emit("getallmyposts", _temp);


            /*for(var i=0; i<_temp.length; i++){
                posts[_temp[i].post_ref_id]=_temp[i];
            }*/
            //console.log("LATEST ID : " + JSON.stringify(_temp));
            //io.emit("alldocuments", posts);
            socket.emit("getInfoAboutPost", _temp);

        });

        socket.on("updatePostPrivacy", async req => {

            var _temp = await pos_s.updatePostPrivacy(req.post_ref_id, req.privacy_type);
            //var latest_id = _temp[0].post_ref_id;
            safeJoin(req.post_ref_id);
            //posts[req.owner_ref_id] = _temp;
            //console.log(" ID : " + req.post_ref_id);
            //socket.emit("getallmyposts", _temp);


            /*for(var i=0; i<_temp.length; i++){
                posts[_temp[i].post_ref_id]=_temp[i];
            }*/
            //console.log("LATEST ID : " + JSON.stringify(_temp));
            //io.emit("alldocuments", posts);
            socket.emit("updateAboutPostPrivacy", _temp);

        });









        /*
        socket.on("getDoc", async docId => {
            var _temp = await doc_s.getDoc(docId);
            var doc_obj = new DocumentClass();
            doc_obj.id = _temp.id;
            doc_obj.doc = _temp.doc;
            
            safeJoin(_temp.id);
            documents[_temp.id] = _temp.doc;
            socket.emit("document", doc_obj);
        });
    
        socket.on("getAllDocs", async getAllDocs=> {
            var _documents = await doc_s.getAllDocs();
            for(var i=0; i<_documents.length; i++){
                documents[_documents[i].id]=_documents[i].doc;
            }
            io.emit("alldocuments", documents);
        });
    
        socket.on("addDoc", async doc => {
    
            documents[doc.id] = doc.doc;
            safeJoin(doc.id);
    
            await doc_s.addDoc(doc);
            io.emit("documents", Object.keys(documents));
            console.log("addDoc Çalıştı...");
            socket.emit("document", doc);
        });
    
        socket.on("editDoc", async doc => {
            documents[doc.id] = doc.doc;
            doc_s.updateDoc(doc);
            socket.to(doc.id).emit("document", doc);
        });*/

        io.emit("documents", Object.keys(/*documents*/posts));

        console.log(`Socket ${socket.id} has connected`);
    });

};