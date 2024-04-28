const db = require("../../models");
const Op = db.Sequelize.Op;
const Subscription = db.push_api_subscriber;
const seq = db.sequelize;

const { parse, stringify } = require('./../../../node_modules/flatted/cjs');

const q = require('q');
const webPush = require('web-push');
const _keys = require('../../config/push.config');

exports.getPush = async (req, res, io, push_keys) => {
    res.locals.metaTags = {
        title: 'web-push-api',
        description: 'Web Push Notification Full Stack Application With Node Js Restful API',
        keywords: 'Web Push Notification Full Stack Application With Node Js Restful API',
        generator: '0.0.0.1',
        author: 'Saurabh Kashyap'
    };
    res.status(200).send({
        status: 'ok',
        message: 'Server is running'
    });
};

exports.postPush = async (req, res, io, push_keys) => {

    console.log("subscription data fIRST : "+stringify(req.body));

    const payload = {
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
        ttl: req.body.ttl,
        icon: req.body.icon,
        image: req.body.image,
        badge: req.body.badge,
        tag: req.body.tag
    };

    await Subscription.findAll({ raw: true }).then(function (subscriptions) {
        let parallelSubscriptionCalls = subscriptions.map((subscription) => {
            
            return new Promise((resolve, reject) => {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                };
                const pushPayload = JSON.stringify(payload);
                const pushOptions = {
                    vapidDetails: {
                        subject: 'http://example.com',
                        privateKey: _keys.privateKey,
                        publicKey: _keys.publicKey
                    },
                    TTL: payload.ttl,
                    headers: {}
                };
                webPush.sendNotification(
                    pushSubscription,
                    pushPayload,
                    pushOptions
                ).then((value) => {
                    resolve({
                        status: true,
                        endpoint: subscription.endpoint,
                        data: value
                    });
                    console.log("subscription data : "+stringify(req.body));
                }).catch((err) => {
                    reject({
                        status: false,
                        endpoint: subscription.endpoint,
                        data: err
                    });
                });
            });
            
        });
        q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
            console.info(pushResults);
        });
        res.status(200).send({
            data: 'Push triggered'
        });
    }).catch((err) => {
        console.log("ERROR : " + stringify(err));
        console.error(`Error occurred while getting subscriptions`);
        res.status(500).send({
            error: 'Technical error occurred'
        });
    });
};