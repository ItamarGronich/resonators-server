import api from './api';
import emailSchedulingJob from './emailScheduler';
import syncCalendarsJob from './calendars/calendarsSync';
import initInfra from './infra';
import cfg from './cfg';
import fs from 'fs';
import https from 'https';
import path from 'path';

initInfra();
startJobs();
startHttpsServer();

function startJobs() {
    if (cfg.emailSchedulerOn)
        emailSchedulingJob.start();

    syncCalendarsJob.start();
}

function startHttpsServer() {
    const privateKey = fs.readFileSync(path.resolve(__dirname, '../sslcert/resonators.key'), 'utf8');
    const certificate = fs.readFileSync(path.resolve(__dirname, '../sslcert/www_psysession_com.crt'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, api);
    httpsServer.listen(process.env.HTTPS_PORT || 8443);
}
