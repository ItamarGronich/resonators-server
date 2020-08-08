import app from "../../express";
import followerApi from "./mount";

import "./leader";
import "./resonators";

// Attaching the follower sub-api to the main application under this root path
app.use("/api/follower", followerApi);
