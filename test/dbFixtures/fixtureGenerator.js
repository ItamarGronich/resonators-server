import _ from 'lodash';

import {
    users,
    user_logins,
    leaders,
    clinics,
    followers
} from '../../src/db/sequelize/models';

import uuid from 'uuid/v4';

export default function generateFixtures() {
    const fixtureList = [];
    const queue = [];

    const generateFixture = (entity) => {
        fixtureList.push(entity);
        return api;
    };

    const api = {
        generateUser: (...args) => generateFixture(generateUser(...args)),
        generateUserLogin: (...args) => generateFixture(generateUserLogin(...args)),
        generateLeader: (...args) => generateFixture(generateLeader(...args)),
        generateClinic: (...args) => generateFixture(generateClinic(...args)),
        generateFollower: (...args) => generateFixture(generateFollower(...args)),
        last: () => _.last(fixtureList),
        fixtures: () => fixtureList,

        done() {
            return Promise.all(queue)
                          .then(_ => fixtureList);
        }
    }

    return api;

    function randStr(str) {
        const uuidSuffix = uuid().substring(0, 4);
        return `${str}_${uuidSuffix}`;
    }

    function generateUser() {
        const user = {
            json: {
                id: uuid(),
                name: randStr('user'),
                email: `${randStr('user')}@bar.baz`,
                pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
                salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
            }
        };

        queue.push(users.create(user.json));

        return user;
    }

    function generateUserLogin({user = generateUser()} = {}) {
        const entity = {
            user,
            json: {
                id: uuid(),
                user_id: user.json.id
            }
        };

        queue.push(user_logins.create(entity.json));

        return entity;
    }

    function generateLeader({user = generateUser()}) {
        const entity = {
            user,
            json: {
                id: uuid(),
                user_id: user.json.id,
                title: randStr('leader title'),
                description: randStr('leader description'),
                visible: 1
            }
        };

        queue.push(leaders.create(entity.json));

        return entity;
    }

    function generateClinic({user = generateUser()}) {
        const entity = {
            user,
            json: {
                id: uuid(),
                user_id: user.json.id,
                name: randStr('clinic')
            }
        };

        queue.push(clinics.create(entity.json));

        return entity;
    }

    function generateFollower({
        user = generateUser(),
        clinic = generateClinic(),
        leader = generateLeader()
    }) {
        const entity = {
            user,
            clinic,
            leader,
            json: {
                id: uuid(),
                user_id: user.json.id,
                leader_id: leader.json.id,
                clinic_id: clinic.json.id,
                status: 1
            }
        };

        queue.push(followers.create(entity.json));

        return entity;
    }
}
