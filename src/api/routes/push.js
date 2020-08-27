import uuid from "uuid/v4";
import webpush from "web-push";

import cfg from "../../cfg";
import api from "../express";
import routeHandler from "../routeHandler";

import { push_subscriptions } from "../../db/sequelize/models";

webpush.setVapidDetails("mailto:bla@bla.com", cfg.vapid.publicKey, cfg.vapid.privateKey);

/**
 * Saves a user's push notification subscription to the DB
 */
api.post(
    "/api/push-subscribe",
    routeHandler(async (req, res) => {
        await saveSubscription(req.appSession.user, req.body);
        res.sendStatus(201);
    })
);

api.get("/api/notify/:userId", async (req, res) => {
    const subscriptions = await getSubscriptions(req.params.userId);
    subscriptions.forEach((subscription) => webpush.sendNotification(subscription, getNotificationPayload()));
    res.sendStatus(200);
});

async function saveSubscription(user, subscription) {
    return await push_subscriptions.create({
        id: uuid(),
        subscription,
        user_id: user.id,
    });
}

async function getSubscriptions(user_id) {
    const subscriptions = await push_subscriptions.findAll({
        where: {
            user_id,
        },
    });
    return subscriptions.map((subscription) => subscription.subscription);
}

function getNotificationPayload() {
    return JSON.stringify({
        title: "Hello there!!",
        body: "blablablablabla",
    });
}
