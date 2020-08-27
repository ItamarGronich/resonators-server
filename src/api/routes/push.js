import webpush from "web-push";

import cfg from "../../cfg";
import api from "../express";
import routeHandler from "../routeHandler";

const subscriptions = {};

webpush.setVapidDetails("mailto:bla@bla.com", cfg.vapid.publicKey, cfg.vapid.privateKey);

/**
 * Saves a user's push notification subscription to the DB
 */
api.post(
    "/api/push-subscribe",
    routeHandler((req, res) => {
        subscriptions[req.appSession.user.id] = req.body;
        console.log(subscriptions);
        res.status(201).json({ status: "saved" });
    })
);

api.get("/api/notify/:userId", (req, res) => {
    const sub = subscriptions[req.params.userId];
    if (sub)
        webpush
            .sendNotification(sub, JSON.stringify({ title: "Hello there!!", body: "blablablablabla" }))
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    else res.status(404).json({ status: "User not subscribed!" });
});
