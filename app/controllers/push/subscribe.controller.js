const db = require("../../models");
const Op = db.Sequelize.Op;
const Subscription = db.push_api_subscriber;

exports.getSubscription = async (req, res, io, push_keys) => {
    res.json({
        data: 'Invalid Request Bad'
    });
};

exports.postSubscription = async (req, res, io, push_keys) => {

    const sample = await Subscription.findOne({ where: { endpoint: req.body.endpoint } });
    if (sample === null) {
        //console.log('Not found!');
        const subscriptionModel = new Subscription(req.body);
        subscriptionModel.save().then(
            res.status(200).send({ data: 'Subscription saved.' })
        ).catch((err) => {
            console.error(`Error occurred while saving subscription. Err: ${err}`);
            res.status(500).send({
                error: 'Technical error occurred'
            });
        });
        await Subscription.update({ p256dh: req.body.keys.p256dh, auth:req.body.keys.auth }, {
            where: {
                endpoint: req.body.endpoint
            }
        });
    } else {
        //console.log(project instanceof Project); // true
        //console.log(project.title); // 'My Title'
        // Change everyone without a last name to "Doe"
        await Subscription.update({ p256dh: req.body.keys.p256dh, auth:req.body.keys.auth }, {
            where: {
                endpoint: req.body.endpoint
            }
        });
    }



    /*subscriptionModel.save((err, subscription) => {
        if (err) {
            console.error(`Error occurred while saving subscription. Err: ${err}`);
            res.status(500).send({
                error: 'Technical error occurred'
            });                
        } else {
            res.status(200).send({
                data: 'Subscription saved.'
            });
        }
    });*/
};