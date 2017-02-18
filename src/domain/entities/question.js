export default class Question {
    constructor({
        id,
        leader_id,
        clinic_id,
        question_kind,
        description,
        title,
        removed,
        answers,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.question_kind = question_kind;
        this.description = description;
        this.title = title;
        this.removed = removed;
        this.answers = answers;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
