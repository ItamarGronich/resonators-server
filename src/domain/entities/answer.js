import { v4 as uuid } from "uuid";

export default class Answer {
    constructor({
        id,
        body,
        rank,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuid();
        this.body = body;
        this.rank = rank;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

