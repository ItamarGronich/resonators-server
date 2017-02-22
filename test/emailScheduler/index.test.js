import _ from 'lodash';
import proxyquire from 'proxyquire';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import waitFor from 'wait-for-cond';
import sinon from 'sinon';
import {assert} from 'chai';

describe('email scheduler', () => {
    let startEmailSchedulingLoop, stopEmailSchedulingLoop, sendResonatorEmailStub;

    beforeEach(() => {
        sendResonatorEmailStub = sinon.spy();

        const stubs = {
            './sendResonatorEmail':{
                default: sendResonatorEmailStub,
                '@global': true
            }
        };

        const scheduleEmailsLoop = proxyquire('../../src/emailScheduler/index', stubs);
        startEmailSchedulingLoop = scheduleEmailsLoop.startEmailSchedulingLoop;
        stopEmailSchedulingLoop = scheduleEmailsLoop.stopEmailSchedulingLoop;
    });

    afterEach(() => {
        stopEmailSchedulingLoop();
    });

    it('schedule pending resonator', async () => {
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

        startEmailSchedulingLoop();

        await waitFor(() => sendResonatorEmailStub.called, 5000);

        // console.log('jjjjj', sendResonatorEmailStub.getCall(0).args[0].html)
        const sendR1Called = sendResonatorEmailStub.calledWithMatch({
            to: r1.follower.user.email,
            subject: r1.title,
            html: sinon.match(
                txt => _.includes(txt, r1.link) &&
                       _.includes(txt, r1.content)
            )
        });

        const r1Call = resonatorEmailCalledWithMatch(sendResonatorEmailStub, r1);
        const r2Call = resonatorEmailCalledWithMatch(sendResonatorEmailStub, r2);

        assert(r1Call, 'r1 was not called properly.');
        assert(r2Call, 'r2 was not called properly.');
    }).timeout(5000);

    it('don\'t schedule non-pending resonators', async () => {
        const [r1] = await generateFixtures()
                        .generateResonator({
                            fields: {
                                repeat_days: '1,2,3,4,5,6',
                                pop_time: '2016-01-01',
                                last_pop_time: '2133-01-01'
                            }})
                        .done();

        startEmailSchedulingLoop();

        await waitFor(() => sendResonatorEmailStub.called, 3000).catch(() => {});

        const sendR1Called = sendResonatorEmailStub.calledWithMatch({
            to: r1.follower.user.email,
            subject: r1.title,
            html: sinon.match(
                txt => _.includes(txt, r1.link) &&
                       _.includes(txt, r1.content)
            )
        });

        const r1Call = resonatorEmailCalledWithMatch(sendResonatorEmailStub, r1);
        assert.isFalse(r1Call, 'r1 was called, even though it should not have been.');
    }).timeout(5000);

    function resonatorEmailCalledWithMatch(spy, resonatorFixture) {
        return spy.calledWithMatch({
            to: resonatorFixture.follower.user.email,
            subject: resonatorFixture.title,
            html: sinon.match(
                txt => _.includes(txt, resonatorFixture.link) &&
                       _.includes(txt, resonatorFixture.content)
            )
        });
    }
});
