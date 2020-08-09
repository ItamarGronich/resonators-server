import { Router } from "express";

import { errorFormatMiddleware, followerLoader } from "./middleware";

// Creating the follower sub-api. All follower methods shall be attached to this router.
export default Router().use(errorFormatMiddleware).use(followerLoader);
