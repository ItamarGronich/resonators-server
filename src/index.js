import api from "./api";
import cfg from "./cfg";
import initInfra from "./infra";
import emailSchedulingJob from "./emailScheduler";
// import syncCalendarsJob from "./calendars/calendarsSync";

function startServer() {
    api.listen(cfg.port, "0.0.0.0", () => {
        console.log(`API running on port ${cfg.port} with ${process.env.ENV.toUpperCase()} environment`);
    });
}

function startJobs() {
    if (cfg.emailSchedulerOn) emailSchedulingJob.start();
    // syncCalendarsJob.start();
}

initInfra();
startJobs();
startServer();
