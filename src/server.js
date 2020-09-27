import api from "./api";
import cfg from "./cfg";
import { apiLogger as logger } from "./logging";
import emailSchedulingJob from "./emailScheduler";
import { setVapidKeys } from "./emailScheduler/push";
// import syncCalendarsJob from "./calendars/calendarsSync";

function startServer() {
    api.listen(cfg.port, "0.0.0.0", () => {
        logger.info(`API running on port ${cfg.port} with ${process.env.ENV.toUpperCase()} environment`);
    });
}

function startJobs() {
    if (cfg.emailSchedulerOn) emailSchedulingJob.start();
    // syncCalendarsJob.start();
}

setVapidKeys();
startJobs();
startServer();
