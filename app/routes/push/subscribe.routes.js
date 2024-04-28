module.exports = (app, io, push_keys) => {
    //const router = require('express').Router();
    const subscribers = require("../../controllers/push/subscribe.controller.js");

    const cors = require('cors');
    const cors_Options = {
        origin: '*',
        credentials: true,            //access-control-allow-credentials:true
        optionSuccessStatus: 200
    }
    app.use(cors(cors_Options));

    app.route('/api/push/subscribe')
        .get((req, res) => {
            subscribers.getSubscription(req, res, io, push_keys);
        })
        .post((req, res) => {
            subscribers.postSubscription(req, res, io, push_keys);
        });

    //app.use('/api/push/subscribe', router);
}