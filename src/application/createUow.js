import {UnitOfWork} from 'ddd-helpers';
import dbConn from '../db/sequelize/dbConnection';
import getEntityRepository from '../application/getEntityRepository';

export default function createUow() {
    return UnitOfWork(createTransaction, getEntityRepository)();
}

function createTransaction() {
    return dbConn.transaction();
}
