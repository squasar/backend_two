const express = require("express");
const cors = require("cors");

const users = require("./app/controllers/user.controller.js");

const app = express();
const push_keys = require('./app/config/push.config');

var corsOptions = {
  origin: "*",
};

var cc_web_sc = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
};

const http = require('http').Server(app);
const io = require('socket.io')(http, cc_web_sc);
//const documents = {};


/*var corsOptions = {
  origin: "*"
};*/

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
app.use(function (req,res,next){
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', '*');

  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});*/

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// set static folder for push api
//app.use(express.static("./app/views/index"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));








// simple route
/*app.get("/", (req, res) => {
  //res.removeHeader('Access-Control-Allow-Origin');
  //req.removeHeader('Access-Control-Allow-Origin');
  res.json({ message: "Welcome to suleyman's GET application." });
});
app.get("/login",(req, res) => {
  res.json({ message: "Welcome to suleyman's GET Login application." });
});

app.post("/",(req, res) => {
  res.json({ message: "Welcome to suleyman's POST application." });
});

app.post("/login",(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ message: "Welcome to suleyman's POST Login application." });
});*/


/*
app.route('/login')
  .post((req, res) => {
    users.login(req, res);
  });*/

app.route('/')
  .get((req, res) => {
    res.json({ message: "Welcome to suleyman's GET application." });
  })
  .post((req, res) => {
    res.json({ message: "Welcome to suleyman's POST application." });
  })
  .put((req, res) => {
    res.json({ message: "Welcome to suleyman's PUT application." });
  });

app.route('/api/signup')
  .post((req, res) => {
    users.createOrGet(req, res);
  })
  .put((req, res) => {
    res.json({ message: "Welcome to suleyman's PUT application." });
  });

app.route('/api/com/sendmailverification')
  .post((req, res) => {
    users.sendVerificationMail(req, res);
  })
  .put((req, res) => {
    res.json({ message: "Welcome to suleyman's PUT application." });
  });






require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/document.routes")(app,io);

require("./app/routes/post.routes")(app,io);
require("./app/routes/chat.routes")(app,io);

require("./app/routes/push/push.routes")(app,io, push_keys);
require("./app/routes/push/subscribe.routes")(app,io, push_keys);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const db = require("./app/models");
db.sequelize.sync(/*{ force: true }*/).then(() => {
  console.log("Drop and re-sync db.");
});

io.listen(4444, () => {
  console.log('Listening on port 4444');
});







/*
io.on("connection", socket => {
  let previousId;
  console.log("connection Çalıştı...");

  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
    previousId = currentId;
  };

  socket.on("getDoc", docId => {
    safeJoin(docId);
    //doc_s.getDoc(docId, documents);
    console.log("getDoc Çalıştı...");
    socket.emit("document", documents[docId]);
  });

  socket.on("addDoc", doc => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    //doc_s.addDoc(doc);
    io.emit("documents", Object.keys(documents));
    console.log("addDoc Çalıştı...");
    socket.emit("document", doc);
  });

  socket.on("editDoc", doc => {
    documents[doc.id] = doc;
    //doc_s.updateDoc(doc);
    console.log("editDoc Çalıştı...");
    socket.to(doc.id).emit("document", doc);
    /*We’ll replace the existing document in the database and then broadcast the new document to only 
    the clients that are currently viewing that document. */
  /*});

  io.emit("documents", Object.keys(documents));

  console.log(`Socket ${socket.id} has connected`);


  // ...
});



io.listen(4444, () => {
  console.log('Listening on port 4444');
});
*/
