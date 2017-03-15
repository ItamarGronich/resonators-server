import {UnitOfWork} from 'ddd-helpers';
import dbConn from '../db/sequelize/dbConnection';
import userRepository from '../db/repositories/UserRepository';
import getEntityRepository from '../application/getEntityRepository';
import ctx from 'request-local';
import uuid from 'uuid/v4';

var createUow = UnitOfWork(createTransaction, getEntityRepository);

function createTransaction() {
    return dbConn.transaction();
}

export default function uowMiddleware(req, res, next) {
    ctx.data.uow = createUow();
    ctx.data.id = uuid();
    next();
}
