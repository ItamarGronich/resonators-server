import path from 'path';
import winston from 'winston';

winston.add(winston.transports.File, {
    filename: path.join(__dirname, '../../logs/log'),
    maxsize: 1024 * 10,
    level: 'debug'
});
