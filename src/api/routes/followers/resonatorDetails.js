import { Model } from "sequelize";

import app from "../../express";
import routeHandler from "../../routeHandler";
import Follower from "../../../domain/entities/follower";
import {
    resonators,
    resonator_attachments,
    resonator_questions,
    sent_resonators,
    resonator_answers,
} from "../../../db/sequelize/models";

app.get(
    "/api/follower/resonators/:resonatorId",
    routeHandler(
        async (request, response) => {
            response.status(200).json({
                resonator: (await getFollowerResonators(request.appSession.follower)).map(formatResonatorPreview),
            });
        },
        { enforceFollower: true, enforceFollowerResonator: true }
    )
);

const fetchFollowerResonator = async (resonatorId) => await resonators.findById(resonatorId, {});
