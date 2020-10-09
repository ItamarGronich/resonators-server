import cfg from "../cfg";
import createJob from "../createJob";
import scheduleResonators from "./scheduleResonators";
import { schedulerLogger as log } from "../logging";

export default createJob({
    runner: scheduleResonators,
    interval: cfg.scheduler.interval,
    onStart: () => log.info(`Starting scheduler with interval of ${cfg.scheduler.interval} ms`),
    onStop: () => log.info("Stopped scheduler"),
    onError: log.error,
});
