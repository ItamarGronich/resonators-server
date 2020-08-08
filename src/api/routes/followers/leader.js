import api from "./mount";
import { fetchLeader } from "./queries";
import { formatLeader } from "./normalizers";

/**
 * Returns the data of the requesting follower's leader.
 */
api.get("/leader", async (req, res) => {
    const leader = await fetchLeader(req.follower);
    res.status(200).json({
        leader: formatLeader(leader),
    });
});
