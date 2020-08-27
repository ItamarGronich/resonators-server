import uuid from "uuid/v4";

import api from "../express";
import routeHandler from "../routeHandler";

import { push_subscriptions } from "../../db/sequelize/models";

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

async function saveSubscription(user, subscription) {
    return await push_subscriptions.create({
        id: uuid(),
        subscription,
        user_id: user.id,
    });
}
