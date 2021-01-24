import userRepository from '../db/repositories/UserRepository';
import invitationRepository from '../db/repositories/InvitationRepository';
import Invitation from '../domain/entities/invitation';
import GoogleDrive from './google/googleDrive';
import getUow from './getUow';
import cfg from "../cfg";

export async function getInvitations(user_id) {
    const user = await userRepository.findByPk(user_id);
    if (!user) return false;

    const drive = new GoogleDrive(cfg.googleDriveAccount);
    const files = await drive.listFiles(cfg.invitationsFolderId);
    const systemInvitations = await Promise.all(files.map(async (file) => {
        const content = await drive.getFileContent(file.id);
        const subjectMatch = content.match('(?<=\\##).+?(?=\\##)');
        const subject = (subjectMatch) ? subjectMatch[0] : file.name;
        const bodyMatch = content.match('(?<=\\###)[\\s\\S]*(?=\\###)');
        const body = (bodyMatch) ? bodyMatch[0] : "";

        return {
            id: file.id,
            displayTitle: file.name,
            subject: subject,
            body: body,
            system: true
        };
    }));
    const userInvitations = await invitationRepository.findByUserId(user.id);

    const invitations = [...systemInvitations, ...userInvitations];

    return invitations;
}

export async function createInvitation(user_id, { subject, body }) {
    const user = await userRepository.findByPk(user_id);

    if (!user) return false;

    const invitation = new Invitation({
        user_id: user.id,
        subject,
        body
    });

    const uow = getUow();

    uow.trackEntity(invitation, {isNew: true});

    await uow.commit();

    return invitation;
}

export async function updateInvitation(invitationId, newInvitationDetails) {
    const invitation = await invitationRepository.findByPk(invitationId);
    invitation.subject = newInvitationDetails.subject;
    invitation.body = newInvitationDetails.body;

    await getUow().commit();
    return invitation;
}

export async function deleteInvitation(invitationId) {
    return await invitationRepository.deleteById(invitationId);
}
