import {UnitOfWork} from 'ddd-helpers';
import sequelize from 'sequelize';
import userRepository from '../db/repositories/userRepository';
var createDomain = require('domain').create;

var createUow = UnitOfWork(createTransaction, getEntityRepository);

function createTransaction() {
    return sequelize.transaction();
}

function getEntityRepository(entity) {
    return userRepository;
}

export default function uowMiddleware(req, res, next) {
  var domain = createDomain();
  domain.add(req);
  domain.add(res);
  domain.uow = createUow();
  domain.run(next);
  domain.on('error', next);
}
