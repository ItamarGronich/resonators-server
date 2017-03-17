import logWrapper from './logWrapper';
import winston from 'winston';
import path from 'path';

export default logWrapper(winston);

export const emailSchedulerLogger = logWrapper(new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/emailSchedulerLog'),
            maxsize: 1024 * 10,
            level: 'debug'
        })
    ]
}), true);
