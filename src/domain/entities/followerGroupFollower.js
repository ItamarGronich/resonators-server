export default class FollowerGroupFollower {
    constructor({
        id,
        follower_group_id,
        follower_id,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.follower_group_id = follower_group_id;
        this.follower_id = follower_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
