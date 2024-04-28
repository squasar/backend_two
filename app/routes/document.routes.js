const { stringify } = require("flatted");

module.exports = (app,io) => {
    /*var _web_socket_opts = {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    };*/
    var doc_router = require("express").Router();
    const doc_s = require("../controllers/document.controller.js");
    //const http = require('http').Server(app);
    //const io = require('socket.io')(http, _web_socket_opts);
    const db = require("../models");
    const DocumentClass = require("../models/classes/DocumentClass.js").doc_ob_class;
    const Document = db.document;
    const documents = {};

    app.use('/api/docs', doc_router);




    io.on("connection", socket => {
        let previousId;
        console.log("connection Çalıştı...");

        const safeJoin = currentId => {
            socket.leave(previousId);
            socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
            previousId = currentId;
        };

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
            /*var doc_obj = new DocumentClass();
            doc_obj.id = doc.id;
            doc_obj.doc = doc.doc;*/


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
            /*We’ll replace the existing document in the database and then broadcast the new document to only 
            the clients that are currently viewing that document. */
        });

        io.emit("documents", Object.keys(documents));

        console.log(`Socket ${socket.id} has connected`);


        // ...
    });



    /*io.listen(4444, () => {
        console.log('Listening on port 4444');
    });*/

};