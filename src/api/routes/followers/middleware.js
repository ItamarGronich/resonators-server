import { getLoginId } from "./utils";
import { fetchClientData } from "./queries";

/**
 * Adds a convenience method to the request object for sending error messages
 * in a consistent format.
 */
export const errorFormatMiddleware = (req, res, next) => {
    res.error = (message) => res.json({ status: message });
    next();
};

/**
 * Loads the client's follower data onto the request object.
 * Returns appropriate errors if client is not logged in or is not a follower.
 */
export const followerLoader = async (req, res, next) => {
    const login = await fetchClientData(getLoginId(req));

    if (!login) {
        return res.status(401).error("Client unauthorized. Don't forget to log in :)");
    }

    if (!login.user.follower) {
        return res.status(403).error("Must be a follower to perform this action");
    }

    req.follower = login.user.follower;
    next();
};
