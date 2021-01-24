import express from '../express';
import routeHandler from '../routeHandler';
import {getInvitations, createInvitation, updateInvitation, deleteInvitation} from "../../application/invitations";


express.get('/api/invitations\.:ext?', routeHandler(async (request, response) => {
    const {user} = request.appSession;
    const invitations = await getInvitations(user.id);

    response.status(200);
    response.json(invitations);
}));

express.post('/api/invitations\.:ext?', routeHandler(async (request, response) => {
    const {user} = request.appSession;
    const invitation = await createInvitation(user.id, request.body);

    response.status(201);
    response.json(invitation);
}));

express.put('/api/invitations/:invitationId\.:ext?', routeHandler(async (request, response) => {
    const {invitationId} = request.params;

    const invitation = await updateInvitation(invitationId, request.body);

    response.status(200);
    response.json(invitation);
}, {}));

express.delete('/api/invitations/:invitationId\.:ext?', routeHandler(async (request, response) => {
    const {invitationId} = request.params;

    const result = await deleteInvitation(invitationId);

    response.status(result ? 200 : 422);
    response.json({});
}, {}));
