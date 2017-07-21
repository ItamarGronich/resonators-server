import logWrapper from './logWrapper';
import winston from 'winston';
import path from 'path';

export default logWrapper(winston);

export const emailSchedulerLogger = logWrapper(new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/emailSchedulerLog'),
            maxsize: 1024 * 1024 * 10,
            level: 'debug'
        })
    ]
}), true);

export const calendarsSyncLog = logWrapper(new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/calendarsSyncLog'),
            maxsize: 1024 * 1024 * 10,
            level: 'debug'
        }),
        new winston.transports.Console()
    ]
}), true);
