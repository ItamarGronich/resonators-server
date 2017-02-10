import uuid from 'uuid/v4';
import {resonators} from '../../src/db/sequelize/models';
import {fooLeader} from './leaders';
import {barFollower} from './followers';

export default () => {
    return resonators.create(resonator);
};

export const resonator = {
    id: '2f4b901a-1c9d-4705-8229-52bd9ada3ade',
    leader_id: fooLeader.id,
    follower_id: barFollower.id,
    pop_email: false,
    pop_location_lat: 1.5,
    pop_location_lng: 3.4,
    pop_time: '2016-04-03 14:00:00',
    repeat_days: '1,2,3,4,5',
    last_pop_time: null,
    disable_copy_to_leader: false,
    content: 'a content',
    link: 'a link',
    title: 'a title',
    description: 'a description'
};
