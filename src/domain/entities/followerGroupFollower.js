export default class FollowerGroupFollower {
    constructor({
        id,
        follower_group_id,
        follower_id,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.follower_group_id = follower_group_id;
        this.follower_id = follower_id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
