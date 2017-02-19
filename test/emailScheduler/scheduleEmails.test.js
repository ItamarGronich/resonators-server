import {assert} from 'chai';
import scheduleEmails from '../../src/emailScheduler/scheduleEmails';
import generateFixtures from '../dbFixtures/fixtureGenerator';

describe('fetch pending resonators', () => {
    describe('positive - resonator is pending', () => {
        it('default', async () => {
            await testPendingResonator({
                result: true
            });
        });
    });

    describe('negative - resonator is not pending', () => {
        it('no pending - now is not in repeat_days', async () => {
            await testPendingResonator({
                repeat_days: '3',
                result: false
            });
        });

        it('no pending - now.time < pop_time', async () => {
            await testPendingResonator({
                now: '2017-2-20 12:00:00',
                result: false
            });
        });

        it('no pending - last_pop_time is less than 24 hours from now', async () => {
            await testPendingResonator({
                last_pop_time: '2017-2-19 17:00:00',
                result: false
            });
        });
    });

    async function testPendingResonator({
        repeat_days = '1,2,3',
        pop_time = '2016-04-05 14:00:00',
        now = '2017-2-20 15:00:00',
        last_pop_time,
        result
    } = {}) {
        const [r1] = await generateFixtures()
        .generateResonator({
            fields: {
                repeat_days,
                pop_time: new Date(pop_time).toJSON(),
                last_pop_time
            }})
        .done();

        const resonatorIds = await scheduleEmails(() => new Date(now));

        if (result)
            assert.include(resonatorIds, r1.id);
        else
            assert.notInclude(resonatorIds, r1.id);
    }
});
