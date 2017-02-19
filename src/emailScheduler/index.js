import cfg from '../cfg';
import scheduleEmails from './scheduleEmails';

const Interval = 6 * 1000;

export default function startEmailSchedulingLoop() {
    if (cfg.emailSchedulerOn) {
        console.log(`enabling email scheduler. interval: ${Interval}`);
        setInterval(scheduleEmails, Interval);
    }
}
