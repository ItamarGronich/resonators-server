import createJob from "../createJob";
import scheduleEmails from "./scheduleEmails";
import { emailSchedulerLogger as log } from "../logging";

const interval = 6 * 1000;

export default createJob({
    interval,
    runner: scheduleEmails,
    onStart: () => log.info(`Starting scheduler with interval of ${interval} ms`),
    onStop: () => log.info("Stopped scheduler"),
    onError: log.error,
});
