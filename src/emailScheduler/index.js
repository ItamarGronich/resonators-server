import cfg from "../cfg";
import createJob from "../createJob";
import scheduleEmails from "./scheduleEmails";
import { emailSchedulerLogger as log } from "../logging";

export default createJob({
    runner: scheduleEmails,
    interval: cfg.scheduler.interval,
    onStart: () => log.info(`Starting scheduler with interval of ${cfg.scheduler.interval} ms`),
    onStop: () => log.info("Stopped scheduler"),
    onError: log.error,
});
