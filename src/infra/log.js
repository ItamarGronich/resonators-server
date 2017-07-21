import logWrapper from './logWrapper';
import winston from 'winston';
import path from 'path';

export default logWrapper(winston);

export const emailSchedulerLogger = createLogger('emailSchedulerLog');
export const calendarsSyncLog = createLogger('calendarsSyncLog');
export const calendarsEventsSyncLog = createLogger('calendarsEventsSyncLog');

function createLogger(fileName) {
    return logWrapper(new winston.Logger({
        transports: [
            new winston.transports.File({
                filename: path.join(__dirname, `../../logs/${fileName}`),
                maxsize: 1024 * 1024 * 10,
                level: 'debug'
            }),
            new winston.transports.Console()
        ]
    }), true);
}
