import api from "./api";
import cfg from "./cfg";
import scheduler from "./scheduler";
import { setVapidKeys } from "./scheduler/push";
import { apiLogger as logger } from "./logging";
// import syncCalendarsJob from "./calendars/calendarsSync";

function startServer() {
    api.listen(cfg.port, "0.0.0.0", () => {
        logger.info(`Running on port ${cfg.port} with ${process.env.ENV.toUpperCase()} environment`);
    });
}

function startJobs() {
    if (cfg.scheduler.on) scheduler.start();
    // syncCalendarsJob.start();
}

setVapidKeys();
startJobs();
startServer();
