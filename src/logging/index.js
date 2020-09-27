import { createLogger } from "./logger";

export const apiLogger = createLogger("api");
export const emailSchedulerLogger = createLogger("emailSchedulerLog");
export const calendarsSyncLog = createLogger("calendarsSyncLog");
export const calendarsEventsSyncLog = createLogger("calendarsEventsSyncLog");

export default apiLogger;
