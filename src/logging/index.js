import { createLogger } from "./logger";

export const apiLogger = createLogger("API");
export const schedulerLogger = createLogger("Scheduler");
export const calendarsSyncLog = createLogger("Calendar Sync");
export const calendarsEventsSyncLog = createLogger("Calendar Event Sync");
export const clinicBuilderLog = createLogger("Clinic Builder (Google Drive)");

export default apiLogger;
