import {users} from '../../src/db/sequelize/models';

export default () => {
    return Promise.all([
        users.create(fooUser),
        users.create(barUser)
    ]);
};

export const fooUser = {
    id: '455f0d8c-64c8-49af-843d-a2a2b0bdb591',
    name: 'foo',
    email: 'foo@bar.baz',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
};

export const barUser = {
    id: '57394531-d688-463d-8460-b8642bc70bc8',
    name: 'bar',
    email: 'bar@baz.com',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
};
