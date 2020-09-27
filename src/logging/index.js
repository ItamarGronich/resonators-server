import { createLogger } from "./log";

export default createLogger("api");

export const emailSchedulerLogger = createLogger("emailSchedulerLog");
export const calendarsSyncLog = createLogger("calendarsSyncLog");
export const calendarsEventsSyncLog = createLogger("calendarsEventsSyncLog");
