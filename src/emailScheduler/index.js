import scheduleEmails from './scheduleEmails';
import createJob from '../createJob';
import {emailSchedulerLogger as log} from '../logging';

const Interval = 6 * 1000;

export default createJob({
    runner: scheduleEmails,
    interval: Interval,
    onStart: () => log.info(`starting email scheduler loop. interval: ${Interval}`),
    onStop: log.info('stopped email scheduler loop.'),
    onError: err => log.error('failure', err)
});
