import request from './supertestWrapper';
import uuid from 'uuid/v4';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {leaders, users, clinics} from '../../src/db/sequelize/models';
import assertLoginResponse from './assert/assertLoginResponse';

describe('registration', () => {
    it('register a new user', async () => {
        const userRequest = {
            email: `foo_${uuid()}@gmail.com`,
            name: `Foo_${uuid()}`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        assertLoginResponse(response, userRequest);
    });

    it('registration creates a leader for the user', async () => {
        const userRequest = {
            email: `foo_${uuid()}@gmail.com`,
            name: `Foo_${uuid()}`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        const dbLeader = await leaders.findOne({
            include: [{
                model: users,
                where: {
                    email: userRequest.email
                }
            }]
        });

        assert.isOk(dbLeader.get('id'));
    });

    it('registration creates a clinic for the user', async () => {
        const userRequest = {
            email: `foo_${uuid()}@gmail.com`,
            name: `Foo_${uuid()}`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        const dbClinic = await clinics.findOne({
            include: [{
                model: users,
                where: {
                    email: userRequest.email
                }
            }]
        });

        assert.shallowDeepEqual(dbClinic.toJSON(), {
            name: `${userRequest.name}'s clinic`
        });
    });

    it('cannot register an existing email', async () => {
        const [user] = await generateFixtures().generateUser().done();

        const userRequest = {
            email: user.email,
            name: `foo_${uuid()}`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        assert.equal(response.status, 422);

        assert.deepEqual(response.body, {
            error: 'email is already registered'
        });
    });

    it('email should be valid', async () => {
        const userRequest = {
            email: `${uuid()}`,
            name: `Foo_${uuid()}`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        assert.equal(response.status, 422);
        assert.deepEqual(response.body, {
            error: 'invalid email'
        });
    });

    it('should send name', async () => {
        const userRequest = {
            email: `foo_${uuid()}@gmail.com`,
            password: '1234'
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        assert.equal(response.status, 422);
        assert.deepEqual(response.body, {
            error: 'invalid name'
        });
    });

    it('should send password', async () => {
        const userRequest = {
            email: `foo_${uuid()}@gmail.com`,
            name: 'foo',
            password: ''
        };

        const response = await request({
            url: '/api/users',
            method: 'post',
            body: userRequest
        });

        assert.equal(response.status, 422);
        assert.deepEqual(response.body, {
            error: 'invalid password'
        });
    });
});
