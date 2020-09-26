import {assert} from 'chai';
import fetchPendingResonators from '../../src/emailScheduler/fetchPendingResonators';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import { v4 as uuid } from "uuid";

describe('fetch pending resonators', () => {
    describe('positive - resonator is pending', () => {
        it('default', async () => {
            await testPendingResonator({
                result: true
            });
        });

        it('pending - resonator should be sent upon the regular due date, if the last sending time was yesterday before but less than 24 hours have passed.', async () => {
            await testPendingResonator({
                pop_time: '2015-01-01 14:00:00',
                last_pop_time: '2017-02-19 22:00:00',
                now: '2017-02-20 14:01:00',
                repeat_days: '0,1,2,3,4,5,6',
                result: true
            });
        });

        it('pending - scheduled for today', async () => {
            await testPendingResonator({
                now: '2017-02-20 15:00:00',
                pop_time: '2017-02-20 14:00:00',
                last_pop_time: null,
                repeat_days: '0,1,2,3,4,5,6',
                result: true
            });
        });
    });

    describe('negative - resonator is not pending', () => {
        it('now is not in repeat_days', async () => {
            await testPendingResonator({
                repeat_days: '3',
                result: false
            });
        });

        it('now.time < pop_time', async () => {
            await testPendingResonator({
                now: '2017-02-20 12:00:00',
                result: false
            });
        });

        it('was already sent today', async () => {
            await testPendingResonator({
                last_pop_time: '2017-02-20 14:00:00',
                result: false
            });
        });

        it('resonator was just created - should wait for the next due date', async () => {
            await testPendingResonator({
                last_pop_time: null,
                pop_time: '2017-02-28 11:00:00',
                result: false
            });
        });

        it('resonator is deactivated', async () => {
            await testPendingResonator({
                deactivated: true,
                result: false
            });
        });

        it('follower has no user', async () => {
            await testPendingResonator({
                follower: {
                    id: uuid(),
                    user: {
                        id: uuid()
                    }
                },
                result: false
            });
        });

        it('leader has no user', async () => {
            await testPendingResonator({
                leader: {
                    id: uuid(),
                    user: {
                        id: uuid()
                    }
                },
                result: false
            });
        });
    });

    async function testPendingResonator({
        repeat_days = '1,2,3',
        pop_time = '2016-04-05 14:00:00',
        now = '2017-02-20 15:00:00',
        last_pop_time,
        deactivated = false,
        result,
        follower,
        leader
    } = {}) {
        const [r1] = await generateFixtures()
        .generateResonator({
            follower,
            leader,
            fields: {
                repeat_days,
                pop_time: new Date(pop_time).toJSON(),
                last_pop_time,
                pop_email: !deactivated
            }})
        .done();

        const resonatorIds = await fetchPendingResonators(new Date(now));

        if (result)
            assert.include(resonatorIds, r1.id);
        else
            assert.notInclude(resonatorIds, r1.id);
    }
});
