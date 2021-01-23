import Repository from './Repository';
import * as dbToDomain from '../dbToDomain';
import {invitations} from '../sequelize/models';

class InvitationRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(invitation) {
        return {
            ...invitation
        };
    }

    save(invitation, transaction) {
        return invitations.upsert(invitation, {transaction});
    }


    async findByPk(id) {
        const dbInvitation = await invitations.findByPk(id);
        const invitation = dbToDomain.toInvitation(dbInvitation);
        this.trackEntity(invitation);

        return invitation;
    }

    async findByUserId(user_id) {
        return await invitations.findAll({where: {user_id}});
    }

    async deleteById(id) {
        return await invitations.destroy({
            where: {
                id
            }
        });
    }
}

export default new InvitationRepository();
