import scheduleEmails from '../../src/emailScheduler/scheduleEmails';
import generateFixtures from '../dbFixtures/fixtureGenerator';

describe.only('schedule emails', () => {
    it('send pending emails', async () => {
        const [r1,r2] = await generateFixtures()
                        .generateResonator({
                            fields: {
                                repeat_days: '1,2,3,4,5,6',
                                pop_time: '2016-04-05 14:00:00'
                            }})
                        .generateResonator({
                            fields: {
                                repeat_days: '1,2,3,4,5,6',
                                pop_time: '2016-04-05 14:00:00'
                            }
                        })
                        .done();

        await scheduleEmails();
    });
});
