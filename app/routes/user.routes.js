module.exports = app => {
  const users = require("../controllers/user.controller.js");

  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const db = require("../models");
  const User = db.users;
  const fileUpload = require('express-fileupload');

  var user_router = require("express").Router();
  var signup_route = require("express").Router();
  //var login_route = require("express").Router();
  var verify_email_route = require("express").Router();

  // Retrieve a single User with email
  //user_router.get("/:email" + "/:pass" + "/:name" + "/:surname" + "/:phone" +
  //  "/:yetki" + "/:birth_day" + "/:ref_id_for_real", users.createOrGet);


  //signup_route.get("/:ref_id_for_link", users.signupWithParent);
  //verify_email_route.get("/:verify_string_part", users.verify);
  //login_route.post("/login",users.login);

  app.use(fileUpload());


  app.route('/api/verifyUser/:ref_id_for_link')
  .get((req, res) => {
    users.verify(req,res);
  });


  //const getSignupRefIdUrl = "http://localhost:8080/api/getSignupParentRefId";

  app.route('/api/signup/:verify_string_part')
  .get((req, res) => {
    users.signupWithParent(req, res);
  });


  app.route('/api/getSignupParentRefId')
  .post((req, res) => {
    users.getSignupParentRefId(req, res);
  });




  app.route('/login')
  .get((req, res) => {
    res.json({ message: "Welcome to suleyman's GET application." });
  })
  .post((req, res) => {
    users.login(req, res);
  }
  );

 

  app.route('/api/users/updateImage')
  .post((req, res) => {
    users.updateUserImage(req, res);
  }
  );

  //const getUserByRefLinkIdUrl = "http://localhost:8080/api/users/getByRefLinkId";
  //"http://localhost:8080/api/verifyUser";
  //const getVerificationStatus = "http://localhost:8080/api/verifystatusget";
  //const createUserUrl = "http://localhost:8080/api/createUser";

  app.route('/api/createUser')
  .post((req, res) => {
    users.createOrGet(req, res);
  }
  );

  app.route('/api/verifyUser')
  .post((req, res) => {
    users.sendVerificationMail(req, res);
  }
  );

  app.route('/api/verifystatusget')
  .post((req, res) => {
    users.getVerificationStatus(req, res);
  }
  );


  app.route('/api/users/getByRefLinkId')
  .post((req, res) => {
    users.getUserByRefLinkId(req, res);
  }
  );
  app.route('/api/users/getByRefId')
  .post((req, res) => {
    users.getUserByRefId(req, res);
  }
  );




  app.route('/api/users/getImage')
  .post((req, res) => {
    users.getUserImage(req, res);
  }
  );





  app.use('/api/verifyUser', verify_email_route);
  app.use('/api/signup', signup_route);
  app.use('/api/users', user_router);

  /*io.on("connection", socket => {
    let previousId;

    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };

    socket.on("getDoc", docId => {
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });

    socket.on("addDoc", doc => {
      documents[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
      /*We’ll replace the existing document in the database and then broadcast the new document to only 
      the clients that are currently viewing that document. */
    /*});

    io.emit("documents", Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);


    // ...
  });*/


};