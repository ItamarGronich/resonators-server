import cfg from '../cfg';
import scheduleEmails from './scheduleEmails';

const Interval = 6 * 1000;
let stopped;

export function startEmailSchedulingLoop(getNow) {
    if (cfg.emailSchedulerOn) {
        console.log(`starting email scheduler loop. interval: ${Interval}`);
        stopped = false;
        loop();
    }
}

export function stopEmailSchedulingLoop() {
    console.log('stopped email scheduler loop.');
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
            console.error('failed scheduling emails', err);
            setTimeout(loop.bind(getNow), Interval);
        });
}
