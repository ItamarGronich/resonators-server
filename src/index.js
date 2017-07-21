import api from './api';
import emailSchedulingJob from './emailScheduler';
import syncCalendarsJob from './calendars/calendarsSync';
import initInfra from './infra';
import cfg from './cfg';

initInfra();

if (cfg.emailSchedulerOn)
    emailSchedulingJob.start();

syncCalendarsJob.start();

api.set('port', (process.env.PORT || 8080));

api.listen(api.get('port'), '0.0.0.0', function() {
    console.log('Node app is running on port', api.get('port'), '| env:', process.env.ENV);
});
