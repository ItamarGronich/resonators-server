import user from '../../src/dbModels/user';

user.truncate();

user.create({
    name: 'foo',
    email: 'foo@bar.baz',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
});
