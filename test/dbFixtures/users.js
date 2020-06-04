import {users} from '../../src/db/sequelize/models';

export default () => {
    return Promise.all([
        users.create(fooUser),
        users.create(barUser),
        users.create(bazUser),
        users.create(putUser)
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

export const bazUser = {
    id: '3dd7cf98-a8f0-4304-ae74-c8967469b80c',
    name: 'baz',
    email: 'baz@baz.com',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
};

export const putUser = {
    id: 'ab7737b5-47f0-463b-850c-7d314934a1d0',
    name: 'put user',
    email: 'put@gmail.com',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
};
