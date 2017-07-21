import api from './api';
import { startEmailSchedulingLoop } from './emailScheduler';
import syncCalendarsJob from './calendars/calendarsSync';
import initInfra from './infra';

initInfra();

startEmailSchedulingLoop();
syncCalendarsJob.start();

api.set('port', (process.env.PORT || 8080));

api.listen(api.get('port'), '0.0.0.0', function() {
    console.log('Node app is running on port', api.get('port'), '| env:', process.env.ENV);
});
