import cfg from '../cfg';
import scheduleEmails from './scheduleEmails';
import {emailSchedulerLogger as log} from '../infra/log';

const Interval = 6 * 1000;
let stopped;

export function startEmailSchedulingLoop(getNow) {
    if (cfg.emailSchedulerOn) {
        log.info(`starting email scheduler loop. interval: ${Interval}`);
        stopped = false;
        loop();
    }
}

export function stopEmailSchedulingLoop() {
    log.info('stopped email scheduler loop.');
    stopped = true;
}

function loop(getNow) {
    if (stopped)
        return;

    scheduleEmails(getNow)
        .then(() => {
            setTimeout(loop.bind(getNow), Interval);
        })
        .catch(err => {
            log.error('failed scheduling emails', err);
            setTimeout(loop.bind(getNow), Interval);
        });
}
