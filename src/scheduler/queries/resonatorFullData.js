import * as dbToDomain from "../../db/dbToDomain";
import {
    users,
    answers,
    leaders,
    followers,
    questions,
    resonators,
    resonator_questions,
    resonator_attachments,
} from "../../db/sequelize/models";

export default function fetchResonatorData(resonatorId) {
    return resonators
        .findOne({
            where: {
                id: resonatorId,
            },
            include: [
                resonator_attachments,
                {
                    model: followers,
                    include: [users],
                },
                {
                    model: leaders,
                    include: [
                        users,
                        {
                            model: leader_clinics,
                            include: [clinics]
                        }
                    ],
                },
                {
                    model: resonator_questions,
                    include: [
                        {
                            model: questions,
                            include: [answers],
                        },
                    ],
                },
            ],
        })
        .then((row) => ({
            resonator: dbToDomain.toResonator(row),
            leaderUser: dbToDomain.toUser(row.leader.user),
            followerUser: dbToDomain.toUser(row.follower.user),
            clinic: row.clinic
        }));
}
