import app from '../../src/api/index';
import {leader as UserLogin} from '../../src/db/sequelize/models';
import db from '../../src/db/sequelize/dbConnection';
import request from 'supertest';
import {assert} from 'chai';
const knex = require('knex')({});

describe('leader_clinics', () => {
    it('get', done => {
        done();
        // request(app)
        //     .post('/user_sessions')
        //     .expect(200, {loginResult: { isValid: false, user: null }}, done);
    });
});
