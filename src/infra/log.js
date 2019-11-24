import logWrapper from './logWrapper';
import winston from 'winston';
import path from 'path';
import moment from 'moment';

export default createLogger('api');

export const emailSchedulerLogger = createLogger('emailSchedulerLog');
export const calendarsSyncLog = createLogger('calendarsSyncLog');
export const calendarsEventsSyncLog = createLogger('calendarsEventsSyncLog');


function timestamp(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss.SSS")
}

function formatMeta(message) {
   let type = toString.call(message).slice(8, -1).toLowerCase();

   switch (type) {
        case "string":
        case "number":
            return message
       case "array":
           return message.join(' ')
       case "object":
           return Object.entries(message).reduce((acc, curr) => acc + `${curr[0]}=${curr[1]} `, "")
       case "date":
           return timestamp(message)
   }
}

function formatter({timestamp, level, message, meta}) {
    const actualMessage = message || formatMeta(meta.message);
    return `[${timestamp()}] ${level.toUpperCase()}: ${actualMessage}`
}

function createLogger(fileName) {
    return logWrapper(new winston.Logger({
        transports: [
            new winston.transports.File({
                filename: path.join(__dirname, `../../logs/${fileName}`),
                maxsize: 1024 * 1024 * 10,
                level: 'debug',
                timestamp,
                formatter,
            }),
            new winston.transports.Console({ timestamp, formatter })
        ]
    }), true);
}
