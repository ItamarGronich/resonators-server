import {UnitOfWork} from 'ddd-helpers';
import sequelize from 'sequelize';
import userRepository from '../db/repositories/userRepository';
import getEntityRepository from '../application/getEntityRepository';
var createDomain = require('domain').create;

var createUow = UnitOfWork(createTransaction, getEntityRepository);

function createTransaction() {
    return sequelize.transaction();
}

export default function uowMiddleware(req, res, next) {
  var domain = createDomain();
  domain.add(req);
  domain.add(res);
  domain.uow = createUow();
  domain.run(next);
  domain.on('error', err => {
      console.error('app error', err);
      next();
  });
}
