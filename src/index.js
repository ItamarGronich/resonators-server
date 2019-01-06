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

startHttpServer();
// if (process.env.ENV !== 'production')
//     startHttpServer();
// else
//     startHttpsServer();
//
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

function startHttpServer() {
    api.set('port', (process.env.HTTP_PORT || 8080));

    api.listen(api.get('port'), '0.0.0.0', function() {
        console.log('Node app is running on port', api.get('port'), '| env:', process.env.ENV);
    });
}
