import uuid from 'uuid/v4';

export default class Answer {
    constructor({
        id,
        body,
        rank,
        created_at,
        updated_at
    }) {
        this.id = id || uuid();
        this.body = body;
        this.rank = rank;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

