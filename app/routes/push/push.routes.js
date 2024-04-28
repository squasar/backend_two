module.exports = (app, io, push_keys) => {

    //const router = require('express').Router();
    const pushes = require("../../controllers/push/push.controller.js");

    const cors = require('cors');
    const cors_Options = {
        origin: '*',
        credentials: true,            //access-control-allow-credentials:true
        optionSuccessStatus: 200
    }
    app.use(cors(cors_Options));


    app.route('/api/push/pushes')
        .get((req, res) => {
            pushes.getPush(req,res,io,push_keys);
        })
        .post((req, res) => {
            pushes.postPush(req,res,io,push_keys);
        });

    //app.use('/api/push/subscribe', router);

}