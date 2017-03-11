import {resonator_attachments} from '../../src/db/sequelize/models';
import {resonator} from './resonators';
import {fooUser} from './users';

export default () => {
    return resonator_attachments.create(resonatorAttachment);
};

export const resonatorAttachment = {
    id: 'c3f264e1-0550-45e9-8a8f-357656ae7d49',
    resonator_id: resonator.id,
    media_kind: 'image',
    media_format: 'png',
    media_id: 'media_id',
    title: 'an image',
    visible: 1,
    owner_id: fooUser.id,
    owner_role: 'leader',
    link: 'a link'
};
