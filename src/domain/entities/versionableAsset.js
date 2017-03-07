import uuid from 'uuid/v4';

export default class VersionableAsset {
    constructor({
        id,
        asset_id,
        version,
        link,
        created_at
    }) {
        this.id = id;
        this.asset_id = asset_id;
        this.version = version || 0;
        this.link = link;
        this.created_at = created_at;

        if (!id) {
            this.init();
        }
    }

    init() {
        this.id = uuid();
        this.version = 0;
    }

    incrementVersion() {
        this.version++;
    }

    toString() {
        return `${this.asset_id}@${this.version}`;
    }
}
