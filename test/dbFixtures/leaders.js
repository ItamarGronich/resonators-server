import {leaders} from '../../src/db/sequelize/models';

export default () => {
    return leaders.create({
    
    });
};

export const fooLeader = {
    id: '455f0d8c-64c8-49af-843d-a2a2b0bdb591',
    name: 'foo',
    email: 'foo@bar.baz',
    pass: '$2a$10$EJT3ZPB5W5ZM10F3lR6RyeUnNxVjsyQmJwPohB6.V3YOmKMNNqoSG',
    salt: '$2a$10$EJT3ZPB5W5ZM10F3lR6Rye'
};
