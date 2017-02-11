export default class Question {
    constructor({
        id,
        leader_id,
        question_kind,
        description,
        title,
        answers,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.leader_id = leader_id;
        this.question_kind = question_kind;
        this.description = description;
        this.title = title;
        this.answers = answers;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
